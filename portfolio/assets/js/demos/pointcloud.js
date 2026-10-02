/* ================= Point cloud ================= */
(function(){const R=mulberry(7),rnd=(a,b)=>a+(b-a)*R(),P=[];
  for(let i=0;i<1100;i++)P.push([rnd(-6.8,6.8),rnd(-.03,.03),rnd(-14,14),0]);
  for(let i=0;i<260;i++){const s=R()<.5?-1:1;P.push([s*3.5,rnd(0,.18),rnd(-14,14),0]);}
  for(let i=0;i<900;i++){const s=R()<.5?-1:1;P.push([s*rnd(7,7.1),rnd(0,6),rnd(-14,14),4]);}
  const poles=[[-4.3,-9],[4.3,-2],[-4.3,5],[4.3,11]];
  poles.forEach(([x,z])=>{for(let i=0;i<45;i++)P.push([x+rnd(-.05,.05),rnd(0,2.6),z+rnd(-.05,.05),1]);
    for(let i=0;i<80;i++)P.push([x+rnd(-.45,.45),rnd(2.6,3.3),z+rnd(-.03,.03),2]);});
  [[-5.3,-3],[5.3,6],[5.3,-11],[-5.3,10]].forEach(([x,z])=>{for(let i=0;i<30;i++)P.push([x+rnd(-.1,.1),rnd(0,2),z+rnd(-.1,.1),3]);
    for(let i=0;i<170;i++){const th=rnd(0,6.283),ph=Math.acos(rnd(-1,1)),r=1.3*Math.cbrt(R());
      P.push([x+r*Math.sin(ph)*Math.cos(th),3.1+r*Math.cos(ph),z+r*Math.sin(ph)*Math.sin(th),3]);}});
  let ang=.7,detected=false,drag=null;const tilt=.42;
  const stats=()=>{$('#pcStats').textContent=detected?`4 sign features exported to roadside_signs.shp`:`raw point cloud, ${P.length.toLocaleString()} points`;};
  const d=makeDemo($('#pcCanvas'),{
    frame(dt){if(!drag&&!RM){ang+=dt*.22;this.render();}},
    render(){const{ctx,w,h}=this;ctx.clearRect(0,0,w,h);
      const ca=Math.cos(ang),sa=Math.sin(ang),ct=Math.cos(tilt),st=Math.sin(tilt),D=28,F=Math.min(w,h*1.7)*.95;
      const cols=detected?[rgba(C.faint,.35),C.teal,C.accent,rgba(C.green,.3),rgba(C.faint,.25)]:[C.faint,C.dim,C.dim,C.green,rgba(C.faint,.8)];
      for(let c=0;c<5;c++){ctx.fillStyle=cols[c];const sz=(c===2&&detected)?2.4:1.5;
        for(const p of P){if(p[3]!==c)continue;
          const x=p[0]*ca-p[2]*sa,z=p[0]*sa+p[2]*ca,y=p[1]-1.5;
          const y2=y*ct-z*st,z2=y*st+z*ct,f=F/(D+z2);if(f<=0)continue;
          ctx.fillRect(w/2+x*f-sz/2,h*.6-y2*f-sz/2,sz,sz);}}
    }});
  const cv=$('#pcCanvas');
  cv.addEventListener('pointerdown',e=>{drag={x:e.clientX,a:ang};cv.setPointerCapture(e.pointerId);cv.style.cursor='grabbing';});
  cv.addEventListener('pointermove',e=>{if(!drag)return;ang=drag.a+(e.clientX-drag.x)*.01;d.render();});
  const end=()=>{drag=null;cv.style.cursor='grab';};cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',end);
  $('#pcBtn').addEventListener('click',e=>{detected=!detected;e.target.textContent=detected?'Show raw cloud':'Digitize signs';stats();d.render();});
  stats();
})();
