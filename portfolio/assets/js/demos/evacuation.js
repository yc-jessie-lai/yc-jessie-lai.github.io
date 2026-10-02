/* ================= Evacuation pathfinding ================= */
(function(){const GX=36,GY=18,id=(x,y)=>y*GX+x,wall=new Uint8Array(GX*GY),cost=new Float32Array(GX*GY).fill(1);
  for(let x=0;x<GX;x++){wall[id(x,0)]=wall[id(x,GY-1)]=wall[id(x,7)]=wall[id(x,10)]=1;}
  for(let y=0;y<GY;y++){wall[id(0,y)]=wall[id(GX-1,y)]=1;}
  [6,12,18,24,30].forEach(x=>{for(let y=1;y<7;y++)wall[id(x,y)]=1;for(let y=11;y<17;y++)wall[id(x,y)]=1;});
  [3,9,15,21,27,33].forEach(x=>{wall[id(x,7)]=0;wall[id(x,10)]=0;});
  const exits=[[0,8],[GX-1,9]];exits.forEach(([x,y])=>wall[id(x,y)]=0);
  let start=[16,3],algo='dijkstra',res=null,k=0;
  function search(){const N=GX*GY,g=new Float32Array(N).fill(Infinity),prev=new Int32Array(N).fill(-1),closed=new Uint8Array(N),order=[],open=[];
    const hf=(x,y)=>algo==='astar'?Math.min(...exits.map(([ex,ey])=>Math.abs(ex-x)+Math.abs(ey-y))):0;
    const s=id(start[0],start[1]);g[s]=0;open.push([hf(...start),s]);let goal=-1;
    while(open.length){let bi=0;for(let i=1;i<open.length;i++)if(open[i][0]<open[bi][0])bi=i;
      const u=open.splice(bi,1)[0][1];if(closed[u])continue;closed[u]=1;order.push(u);
      const ux=u%GX,uy=(u/GX)|0;if(exits.some(([ex,ey])=>ex===ux&&ey===uy)){goal=u;break;}
      for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const vx=ux+dx,vy=uy+dy;if(vx<0||vy<0||vx>=GX||vy>=GY)continue;
        const v=id(vx,vy);if(wall[v]||closed[v])continue;const ng=g[u]+cost[v];
        if(ng<g[v]){g[v]=ng;prev[v]=u;const hv=hf(vx,vy);open.push([ng+hv+hv*1e-3,v]);}}}
    const path=[];for(let v=goal;v!==-1;v=prev[v])path.push(v);
    res={order,path:path.reverse(),cost:goal>=0?g[goal]:Infinity};k=RM?order.length:0;
    $('#evacStats').textContent=`${algo==='astar'?'A*':'Dijkstra'} searched ${order.length} cells   route ${res.path.length-1} steps   travel cost ${res.cost.toFixed(0)}`;}
  const d=makeDemo($('#evacCanvas'),{
    init(){search();},
    frame(){if(res&&k<res.order.length){k=Math.min(res.order.length,k+Math.max(3,res.order.length/50));this.render();}},
    render(){const{ctx,w,h}=this;ctx.clearRect(0,0,w,h);const cs=Math.min(w/GX,h/GY),ox=(w-GX*cs)/2,oy=(h-GY*cs)/2;this.geom={cs,ox,oy};
      for(let y=0;y<GY;y++)for(let x=0;x<GX;x++){const i=id(x,y);
        if(wall[i]){ctx.fillStyle=C.ink;ctx.fillRect(ox+x*cs,oy+y*cs,cs+.5,cs+.5);}
        else if(cost[i]>1){ctx.fillStyle=rgba(C.accent,.35);ctx.fillRect(ox+x*cs,oy+y*cs,cs,cs);}}
      ctx.fillStyle=rgba(C.teal,.28);for(let q=0;q<Math.floor(k);q++){const u=res.order[q];ctx.fillRect(ox+(u%GX)*cs+1,oy+((u/GX)|0)*cs+1,cs-2,cs-2);}
      exits.forEach(([x,y])=>{ctx.fillStyle=C.green;ctx.fillRect(ox+x*cs,oy+y*cs,cs,cs);});
      ctx.font=MONO;ctx.fillStyle=C.panel;ctx.textAlign='center';
      if(k>=res.order.length&&res.path.length){ctx.strokeStyle=C.accent;ctx.lineWidth=Math.max(2,cs*.3);ctx.lineJoin='round';ctx.beginPath();
        res.path.forEach((u,i)=>{const x=ox+(u%GX+.5)*cs,y=oy+(((u/GX)|0)+.5)*cs;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();}
      ctx.fillStyle=C.ink;ctx.strokeStyle=C.panel;ctx.lineWidth=2;ctx.beginPath();ctx.arc(ox+(start[0]+.5)*cs,oy+(start[1]+.5)*cs,cs*.5,0,7);ctx.fill();ctx.stroke();
    }});
  const cv=$('#evacCanvas');
  cv.addEventListener('click',e=>{const r=cv.getBoundingClientRect(),{cs,ox,oy}=d.geom;
    const x=Math.floor((e.clientX-r.left-ox)/cs),y=Math.floor((e.clientY-r.top-oy)/cs);
    if(x<0||y<0||x>=GX||y>=GY||wall[id(x,y)])return;start=[x,y];search();d.render();});
  seg($('#evacSeg'),v=>{algo=v;search();d.render();});
  $('#evacCrowd').addEventListener('click',()=>{const x0=3+Math.floor(Math.random()*26);for(let x=x0;x<x0+5;x++)for(let y=8;y<=9;y++)cost[id(x,y)]=1+5*1.2;search();d.render();});
  $('#evacClear').addEventListener('click',()=>{cost.fill(1);search();d.render();});
})();
