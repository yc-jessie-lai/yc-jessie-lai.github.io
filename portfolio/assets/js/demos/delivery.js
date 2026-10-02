/* ================= Route optimization ================= */
(function(){const KX=8,KY=4;let P=[],tour=[],L0=0,opt=false,acc=0,done=false;
  const dist=(a,b)=>Math.hypot(P[a][0]-P[b][0],P[a][1]-P[b][1]);
  const len=()=>{let s=0;for(let i=0;i<tour.length;i++)s+=dist(tour[i],tour[(i+1)%tour.length]);return s;};
  function gen(){P=[[KX/2,KY/2]];for(let i=0;i<14;i++)P.push([.3+Math.random()*(KX-.6),.25+Math.random()*(KY-.5)]);
    tour=[...Array(P.length).keys()];for(let i=tour.length-1;i>1;i--){const j=1+Math.floor(Math.random()*i);[tour[i],tour[j]]=[tour[j],tour[i]];}
    L0=len();opt=false;done=false;}
  function step(){const n=tour.length;for(let i=1;i<n-1;i++)for(let k=i+1;k<n;k++){const a=tour[i-1],b=tour[i],c=tour[k],dd=tour[(k+1)%n];
    if(dist(a,c)+dist(b,dd)<dist(a,b)+dist(c,dd)-1e-9){let x=i,y=k;while(x<y){[tour[x],tour[y]]=[tour[y],tour[x]];x++;y--;}return true;}}return false;}
  function stats(){const L=len();$('#tspStats').textContent=`route ${L.toFixed(1)} km`+(L<L0-1e-6?`   ${Math.round(100*(1-L/L0))}% shorter than the random order`:'')+(done?'   no improving swap left':'');}
  const d=makeDemo($('#tspCanvas'),{
    init(){gen();},
    frame(dt){if(!opt)return;acc+=dt;while(acc>.09){acc-=.09;if(!step()){opt=false;done=true;break;}}stats();this.render();},
    render(){const{ctx,w,h}=this;ctx.clearRect(0,0,w,h);const s=Math.min((w-24)/KX,(h-24)/KY),ox=(w-KX*s)/2,oy=(h-KY*s)/2,X=x=>ox+x*s,Y=y=>oy+y*s;
      ctx.strokeStyle=C.line;ctx.lineWidth=1;ctx.beginPath();for(let x=0;x<=KX;x++){ctx.moveTo(X(x),Y(0));ctx.lineTo(X(x),Y(KY));}for(let y=0;y<=KY;y++){ctx.moveTo(X(0),Y(y));ctx.lineTo(X(KX),Y(y));}ctx.stroke();
      ctx.strokeStyle=rgba(C.ink,.8);ctx.lineWidth=1.8;ctx.lineJoin='round';ctx.beginPath();
      tour.forEach((p,i)=>i?ctx.lineTo(X(P[p][0]),Y(P[p][1])):ctx.moveTo(X(P[p][0]),Y(P[p][1])));ctx.closePath();ctx.stroke();
      P.forEach((p,i)=>{if(!i)return;ctx.fillStyle=C.teal;ctx.beginPath();ctx.arc(X(p[0]),Y(p[1]),4.5,0,7);ctx.fill();});
      ctx.fillStyle=C.accent;ctx.fillRect(X(P[0][0])-6,Y(P[0][1])-6,12,12);
      ctx.font=MONO;ctx.fillStyle=C.faint;ctx.textAlign='left';ctx.fillText('grid = 1 km',X(0)+4,Y(KY)-5);
    }});
  $('#tspNew').addEventListener('click',()=>{gen();stats();d.render();});
  $('#tspOpt').addEventListener('click',()=>{if(done)return;if(RM){while(step());done=true;stats();d.render();return;}opt=true;acc=0;});
  stats();
})();
