/* ================= EV charging ================= */
(function(){const CX=12,CY=5,PORTS=2;let chargers=[],agents=[],served=0,waitSum=0,statT=0;
  const rn=()=>[Math.floor(Math.random()*(CX+1)),Math.floor(Math.random()*(CY+1))];
  function place(k){chargers=[];const used=new Set();let tries=0;
    while(chargers.length<k&&tries<500){tries++;const[x,y]=rn(),key=x+','+y;
      if(used.has(key)||chargers.some(c=>Math.abs(c.x-x)+Math.abs(c.y-y)<3&&tries<300))continue;used.add(key);chargers.push({x,y,ch:[],q:[]});}}
  function nearest(a){let b=null,bd=1e9;chargers.forEach(c=>{const dd=Math.abs(c.x-a.ix)+Math.abs(c.y-a.iy);if(dd<bd){bd=dd;b=c;}});return b;}
  function plan(a){
    if(a.mode==='drive'&&a.bat<.25){a.c=nearest(a);a.tx=a.c.x;a.ty=a.c.y;a.mode='seek';}
    if(a.ix===a.tx&&a.iy===a.ty){
      if(a.mode==='seek'){const c=a.c;if(c.ch.length<PORTS){c.ch.push(a);a.mode='charge';served++;}else{c.q.push(a);a.mode='queue';a.wait=0;}return;}
      [a.tx,a.ty]=rn();}
    a.nx=a.ix;a.ny=a.iy;const mx=a.ix!==a.tx,my=a.iy!==a.ty;
    if(mx&&(!my||Math.random()<.5))a.nx+=Math.sign(a.tx-a.ix);else if(my)a.ny+=Math.sign(a.ty-a.iy);
    a.s=0;}
  function reset(k){place(k);served=0;waitSum=0;agents=[];
    for(let i=0;i<40;i++){const[x,y]=rn(),a={ix:x,iy:y,nx:x,ny:y,s:0,bat:.25+Math.random()*.75,mode:'drive',spd:1.3+Math.random()*.8,wait:0};[a.tx,a.ty]=rn();plan(a);agents.push(a);}}
  function update(dt){for(const a of agents){
    if(a.mode==='drive'||a.mode==='seek'){a.s+=dt*a.spd;if(a.s>=1){a.ix=a.nx;a.iy=a.ny;a.bat=Math.max(0,a.bat-.03);plan(a);}}
    else if(a.mode==='queue')a.wait+=dt;
    else if(a.mode==='charge'){a.bat+=dt*.22;if(a.bat>=.95){a.bat=.95;const c=a.c;c.ch.splice(c.ch.indexOf(a),1);a.mode='drive';[a.tx,a.ty]=rn();plan(a);
      if(c.q.length){const b=c.q.shift();waitSum+=b.wait;served++;c.ch.push(b);b.mode='charge';}}}}}
  function stats(){const ch=agents.filter(a=>a.mode==='charge').length,q=agents.filter(a=>a.mode==='queue').length;
    $('#evStats').textContent=`${ch} charging   ${q} waiting   average wait ${(served?waitSum/served:0).toFixed(1)} s`;}
  const d=makeDemo($('#evCanvas'),{
    init(){reset(3);},
    frame(dt){update(RM?dt*.5:dt);this.render();statT+=dt;if(statT>.3){statT=0;stats();}},
    render(){const{ctx,w,h}=this;ctx.clearRect(0,0,w,h);const m=20,sx=(w-2*m)/CX,sy=(h-2*m)/CY,P=(x,y)=>[m+x*sx,m+y*sy];
      ctx.strokeStyle=C.line;ctx.lineWidth=3;ctx.beginPath();
      for(let x=0;x<=CX;x++){ctx.moveTo(m+x*sx,m);ctx.lineTo(m+x*sx,h-m);}for(let y=0;y<=CY;y++){ctx.moveTo(m,m+y*sy);ctx.lineTo(w-m,m+y*sy);}ctx.stroke();
      chargers.forEach(c=>{const[x,y]=P(c.x,c.y);ctx.fillStyle=C.ink;ctx.fillRect(x-6,y-6,12,12);ctx.fillStyle=C.panel;ctx.fillRect(x-2,y-2,4,4);
        c.q.forEach((a,i)=>{ctx.fillStyle=C.accent;ctx.beginPath();ctx.arc(x+12+(i%6)*7,y-9-Math.floor(i/6)*7,2.8,0,7);ctx.fill();});});
      agents.forEach(a=>{if(a.mode==='queue')return;let x,y;
        if(a.mode==='charge'){const c=a.c,i=c.ch.indexOf(a);[x,y]=P(c.x,c.y);x+=i?8:-8;y+=10;}
        else{const[x0,y0]=P(a.ix,a.iy),[x1,y1]=P(a.nx,a.ny);x=x0+(x1-x0)*a.s;y=y0+(y1-y0)*a.s;}
        ctx.fillStyle=a.mode==='charge'?C.blue:a.bat<.25?C.accent:C.teal;ctx.beginPath();ctx.arc(x,y,3.3,0,7);ctx.fill();});
    }});
  $('#evN').addEventListener('input',e=>{$('#evNLabel').textContent=e.target.value;reset(+e.target.value);stats();d.render();});
  stats();
})();
