/* ================= Bike GPS (report data) ================= */
(function(){
  const T={ '0930':{peak:false,r1:104,r2:112.5,s1:'18–22',s2:'20–22'},'1200':{peak:true,r1:132.5,r2:144,s1:'13–18',s2:'18–20'},
            '1430':{peak:false,r1:95.5,r2:112.5,s1:'25–30',s2:'30–35'},'1700':{peak:true,r1:153,r2:144,s1:'10–16',s2:'20–25'}};
  let slot='1200',riders=[],t=0;
  // schematic geometry in unit coords
  const R1=[[.05,.46],[.95,.54]],R2=[[.56,.04],[.56,.96]];
  const at=(R,u)=>[R[0][0]+(R[1][0]-R[0][0])*u,R[0][1]+(R[1][1]-R[0][1])*u];
  const X=[.56,.5045];
  function spawn(){const c=T[slot],n=c.peak?9:4;riders=[];
    for(let k=0;k<2;k++)for(let i=0;i<n;i++)riders.push({route:k,u:Math.random(),dir:Math.random()<.5?1:-1,ph:Math.random()*6.28,j:.85+Math.random()*.3});}
  function stats(){const c=T[slot];
    $('#bikeStats').textContent=`${slot.slice(0,2)}:${slot.slice(2)}  ${c.peak?'peak':'off-peak'}\n`
      +`Route 1 (Shengli Rd to Changrong Rd): ${c.r1} s average ride, step lengths mostly ${c.s1}, ${c.peak?'turning angles spread from −2 to 2 as riders dodge traffic':'riding almost perfectly straight'}\n`
      +`Route 2 (Daxue Rd to Xiaodong Rd): ${c.r2} s average ${c.peak?'at peak':'off-peak'}, step lengths mostly ${c.s2}, straight at all times on the wide boulevard`;}
  const d=makeDemo($('#bikeCanvas'),{
    init(){spawn();},
    frame(dt){t+=dt;const c=T[slot];riders.forEach(r=>{const dur=(r.route?c.r2:c.r1)/12;r.u+=r.dir*dt/dur*r.j;if(r.u>1){r.u=1;r.dir=-1;}if(r.u<0){r.u=0;r.dir=1;}});this.render();},
    render(){const{ctx,w,h}=this;ctx.clearRect(0,0,w,h);const c=T[slot],P=([x,y])=>[x*w,y*h];
      // building blocks (schematic)
      ctx.fillStyle=rgba(C.faint,.18);
      [[.08,.08,.14,.16],[.26,.1,.18,.24],[.62,.08,.3,.12],[.62,.24,.3,.12],[.26,.6,.12,.14],[.4,.6,.12,.14],[.08,.6,.14,.3],[.62,.62,.3,.12],[.62,.78,.3,.14],[.4,.78,.12,.14],[.26,.3,.12,.1],[.4,.3,.12,.1]]
        .forEach(([x,y,ww,hh])=>ctx.fillRect(x*w,y*h,ww*w,hh*h));
      ctx.font=w<500?'9.5px "IBM Plex Mono",monospace':MONO;ctx.fillStyle=C.faint;ctx.textAlign='center';ctx.fillText('Surveying',.46*w,.37*h);ctx.fillText('Physics',.46*w,.68*h);
      // roads
      ctx.lineCap='round';[R1,R2].forEach((R,k)=>{ctx.strokeStyle=C.line;ctx.lineWidth=k?18:13;ctx.beginPath();ctx.moveTo(...P(R[0]));ctx.lineTo(...P(R[1]));ctx.stroke();});
      ctx.strokeStyle=C.line;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(.22*w,.05*h);ctx.lineTo(.22*w,.95*h);ctx.stroke();
      ctx.lineCap='butt';
      // hotspots
      const hs=c.peak?[[.07,.462],[.93,.538],X,[.56,.07],[.56,.93],[.22,.475]]:[X,[.22,.475]];
      hs.forEach(([x,y],i)=>{const pul=RM?0:Math.sin(t*3+i)*.5+.5,rr=(c.peak?16:11)+pul*5;ctx.fillStyle=rgba(C.accent,.16+.1*pul);ctx.beginPath();ctx.arc(x*w,y*h,rr,0,7);ctx.fill();
        ctx.strokeStyle=rgba(C.accent,.8);ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x*w,y*h,rr,0,7);ctx.stroke();});
      // riders
      riders.forEach(r=>{const R=r.route?R2:R1;let[x,y]=P(at(R,r.u));const off=(r.dir>0?-1:1)*(r.route?4:3);
        let wob=0;if(r.route===0&&c.peak&&!RM)wob=Math.sin(t*4+r.ph+r.u*30)*4.5;
        if(r.route){x+=off+wob;}else{y+=off+wob;}
        ctx.fillStyle=r.route?C.blue:C.teal;ctx.beginPath();ctx.arc(x,y,3.6,0,7);ctx.fill();});
      // labels
      ctx.fillStyle=C.dim;ctx.textAlign='left';ctx.fillText('Route 1',.3*w,.44*h);ctx.textAlign='right';ctx.fillText('to Ziqiang campus',.95*w,.62*h);
      ctx.textAlign='left';ctx.fillText('to Guangfu campus',.02*w,.55*h);
      ctx.fillText('Route 2',.585*w,.22*h);ctx.fillText('to Chengxing',.585*w,.04*h+8);ctx.fillText('to Shengli dorms',.585*w,.97*h);
    }});
  seg($('#bikeSeg'),v=>{slot=v;spawn();stats();d.render();});
  stats();
})();
