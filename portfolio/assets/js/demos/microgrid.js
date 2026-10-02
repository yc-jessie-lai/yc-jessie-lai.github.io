/* ================= Microgrid (report data) ================= */
(function(){
  // Representative day 2026-04-19, scenario S4, campus totals in MW (read off the report's dispatch figure)
  const load=[19.3,19.2,18.9,18.9,18.9,19.0,19.4,19.6,19.8,20.4,20.9,21.2,21.6,21.8,22.0,22.0,21.9,21.8,21.6,21.4,21.3,21.1,20.3,19.7];
  const solar=[0,0,0,0,0,0,0,.2,1.8,3.0,4.6,5.6,6.8,6.6,6.1,5.6,4.3,2.6,1.1,.2,0,0,0,0];
  const chg=Array(24).fill(0);chg[16]=10.7;chg[17]=10.1;chg[18]=9.0;
  const dis=Array(24).fill(0);dis[19]=14.5;dis[20]=14.6;dis[21]=14.7;dis[22]=14.6;
  const grid=load.map((l,h)=>Math.max(0,l+chg[h]-solar[h]-dis[h]));
  const CAP=88,soc=[];let e=44;for(let h=0;h<24;h++){e+=chg[h]*.95-dis[h]/.95;soc.push(clamp(e,0,CAP));}
  // PV sensitivity (S4). Endpoints and curtailment exact; 2×/3×/5× percentages read off the figure.
  const PV=[{m:'1×',sv:14.20,cr:13.84,sf:8.39,cu:0,ex:true},{m:'2×',sv:19.1,cr:22.0,sf:16.5,cu:6594},{m:'3×',sv:24.0,cr:30.0,sf:24.5,cu:21534},
    {m:'5×',sv:33.0,cr:45.2,sf:39.8,cu:75619},{m:'10×',sv:45.13,cr:65.56,sf:60.97,cu:834783,ex:true}];
  const S=[{k:'S1',sn:'Grid',n:'Grid only',d:'All demand comes from the utility grid.',cost:387776,co2:849246,sol:0,sv:0,cr:0},
    {k:'S2',sn:'Local',n:'Local PV + battery',d:'Each building uses its own solar and battery, with no sharing.',cost:334149,co2:734780,sol:8.01,sv:13.83,cr:13.48},
    {k:'S3',sn:'Pool',n:'Campus pool + battery',d:'Solar and storage pooled campus-wide, as if sharing were perfect.',cost:332724,co2:731708,sol:8.39,sv:14.20,cr:13.84},
    {k:'S4',sn:'Network',n:'Battery + 300 m network',d:'Batteries everywhere, plus power sharing with neighbors within 300 m.',cost:332720,co2:731681,sol:8.39,sv:14.20,cr:13.84}];
  let mode='day',hour=20,playing=false,acc=0,pv=0,gv=[PV[0].sv,PV[0].cr,PV[0].sf,0],metric='cost',sel=3,bars=[];
  const slider=$('#mgHour'),cap=$('#mgCap'),note=$('#mgNote'),st=$('#mgStats');
  const CAPS={day:'<strong>Play the day.</strong> The battery fills up just before the 7–11 pm price peak, then covers most of the campus load while prices are high.',
    solar:'<strong>Try installing more solar.</strong> Savings keep climbing, but past 3× the batteries can’t absorb midday output and more and more solar goes to waste.',
    designs:'<strong>Click a design.</strong> Each adds one feature to the one before it, so the gap between bars is what that feature is worth.'};
  const NOTES={day:'Campus totals on 19 April 2026 under the full model, read off the report’s dispatch figure, so values are approximate.',
    solar:'1× and 10× results and all curtailment figures are exact; percentages for 2×, 3× and 5× are read off the report’s chart.',designs:''};
  function stats(){
    if(mode==='day'){const h=hour,bt=dis[h]?`battery out ${dis[h].toFixed(1)} MW`:chg[h]?`battery in ${chg[h].toFixed(1)} MW`:'battery idle';
      st.textContent=`${String(h).padStart(2,'0')}:00${h>=19&&h<=22?'  (peak price)':''}\nload ${load[h].toFixed(1)} MW   grid ${grid[h].toFixed(1)} MW   solar ${solar[h].toFixed(1)} MW   ${bt}\nbattery charge ≈ ${Math.round(soc[h]/CAP*100)}% of 88 MWh`;}
    else if(mode==='solar'){const p=PV[pv],a=p.ex?'':'≈ ';
      st.textContent=`${p.m} today’s solar\n${a}${p.sv}% lower cost   ${a}${p.cr}% less CO₂   ${a}${p.sf}% of load from solar\n${p.cu?(p.cu/1000).toLocaleString(undefined,{maximumFractionDigits:1})+' MWh of solar wasted per week':'almost no solar wasted'}`;}
    else{const s=S[sel];st.textContent=`${s.k} ${s.n}: ${s.d}\n$${s.cost.toLocaleString()} per week   ${(s.co2/1000).toFixed(1)} t CO₂   solar ${s.sol.toFixed(2)}%`
      +(sel?`\n${s.sv.toFixed(2)}% cheaper and ${s.cr.toFixed(2)}% less CO₂ than grid only`:'')
      +(sel>1?`\nOnly ${(s.sv-S[1].sv).toFixed(2)} points better than S2: local batteries already capture almost all of the value.`:'');}}
  function drawDay(ctx,w,h){const l=30,r=50,t=14,b=40,pw=w-l-r,ph=h-t-b,mn=-12,mx=32,Y=v=>t+(mx-v)/(mx-mn)*ph,bw=pw/24;
    ctx.fillStyle=rgba(C.accent,.08);ctx.fillRect(l+19*bw,t,4*bw,ph);
    ctx.font=MONO;ctx.fillStyle=C.accent;ctx.textAlign='center';ctx.fillText('peak price',l+21*bw,t+10);
    ctx.strokeStyle=C.line;ctx.lineWidth=1;ctx.beginPath();[-10,0,10,20,30].forEach(v=>{ctx.moveTo(l,Y(v));ctx.lineTo(l+pw,Y(v));});ctx.stroke();
    ctx.fillStyle=C.faint;ctx.textAlign='right';[-10,0,10,20,30].forEach(v=>ctx.fillText(v,l-5,Y(v)+4));
    ctx.textAlign='center';[0,6,12,18,23].forEach(i=>ctx.fillText(String(i).padStart(2,'0'),l+(i+.5)*bw,t+ph+14));
    const upto=playing?hour:23;
    for(let i=0;i<=upto;i++){const x=l+i*bw+bw*.12,ww=bw*.76,al=i===hour?1:.55;let y=0;
      [[grid[i],C.faint],[solar[i],C.sand],[dis[i],C.green]].forEach(([v,c])=>{if(!v)return;ctx.fillStyle=rgba(c,al);ctx.fillRect(x,Y(y+v),ww,Y(y)-Y(y+v));y+=v;});
      if(chg[i]){ctx.fillStyle=rgba(C.violet,al);ctx.fillRect(x,Y(0),ww,Y(-chg[i])-Y(0));}}
    ctx.strokeStyle=C.ink;ctx.lineWidth=1.8;ctx.beginPath();for(let i=0;i<=upto;i++){const x=l+(i+.5)*bw;i?ctx.lineTo(x,Y(load[i])):ctx.moveTo(x,Y(load[i]));}ctx.stroke();
    ctx.strokeStyle=C.accent;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(l+(hour+.5)*bw,t);ctx.lineTo(l+(hour+.5)*bw,t+ph);ctx.stroke();
    // battery gauge
    const bx=w-r+14,by=t+20,bh=ph-40,f=soc[hour]/CAP;ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.strokeRect(bx,by,20,bh);ctx.fillStyle=C.ink;ctx.fillRect(bx+6,by-4,8,4);
    ctx.fillStyle=f<.2?C.accent:C.green;ctx.fillRect(bx+2,by+2+(bh-4)*(1-f),16,(bh-4)*f);
    ctx.fillStyle=C.dim;ctx.textAlign='center';ctx.fillText(Math.round(f*100)+'%',bx+10,by+bh+14);
    ctx.textAlign='left';let lx=l+4;const nar=w<500;[['load',C.ink],['grid',C.faint],['solar',C.sand],[nar?'out':'battery out',C.green],[nar?'in':'battery in',C.violet]].forEach(([n,c])=>{ctx.fillStyle=c;ctx.fillRect(lx,h-15,9,9);ctx.fillStyle=C.dim;ctx.fillText(n,lx+12,h-7);lx+=ctx.measureText(n).width+(nar?16:24);});}
  function drawSolar(ctx,w,h){const p=PV[pv],labs=['lower cost','less CO₂','load from solar'],cols=[C.accent,C.teal,C.sand];
    const n=3,cw=w/n,R=Math.min(cw*.32,(h-90)/2),cy=14+R+6;ctx.font=MONO;
    for(let i=0;i<n;i++){const cx=cw*(i+.5),v=gv[i];ctx.lineWidth=11;ctx.strokeStyle=C.line;ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();
      ctx.strokeStyle=cols[i];ctx.lineCap='round';ctx.beginPath();ctx.arc(cx,cy,R,-Math.PI/2,-Math.PI/2+Math.PI*2*v/100);ctx.stroke();ctx.lineCap='butt';
      ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.font='600 '+Math.max(14,R*.42)+'px "Space Grotesk",sans-serif';ctx.fillText((p.ex?'':'≈')+Math.round(v)+'%',cx,cy+R*.15);
      ctx.font=MONO;ctx.fillStyle=C.dim;ctx.fillText(labs[i],cx,cy+R+20);}
    const y=h-30,x0=16,bw=w-32,f=gv[3]/834783;ctx.fillStyle=C.line;ctx.fillRect(x0,y,bw,10);ctx.fillStyle=C.violet;ctx.fillRect(x0,y,Math.max(f>0?2:0,bw*f),10);
    ctx.fillStyle=C.dim;ctx.textAlign='left';ctx.fillText('solar wasted per week (curtailment)',x0,y-6);ctx.textAlign='right';ctx.fillText((gv[3]/1000).toFixed(0)+' MWh',x0+bw,y-6);}
  function drawDesigns(ctx,w,h){const l=14,r=14,t=26,b=40,ph=h-t-b,val=s=>metric==='cost'?s.cost/1000:metric==='co2'?s.co2/1000:s.sol,
      fmt=v=>metric==='cost'?'$'+Math.round(v)+'k':metric==='co2'?Math.round(v)+' t':v.toFixed(2)+'%',mx=Math.max(...S.map(val))*1.08,bw=(w-l-r)/S.length;
    bars=[];ctx.font=MONO;ctx.textAlign='center';ctx.strokeStyle=C.line;ctx.beginPath();ctx.moveTo(l,t+ph);ctx.lineTo(w-r,t+ph);ctx.stroke();
    S.forEach((s,i)=>{const v=val(s),x=l+i*bw+bw*.18,ww=bw*.64,y=t+ph*(1-v/mx);bars.push([l+i*bw,l+(i+1)*bw]);
      ctx.fillStyle=i===sel?C.accent:rgba(C.teal,i?.55:.3);ctx.fillRect(x,y,ww,t+ph-y);ctx.fillStyle=C.ink;ctx.fillText(fmt(v),x+ww/2,y-7);
      ctx.fillStyle=i===sel?C.ink:C.dim;ctx.fillText(s.k,x+ww/2,t+ph+15);ctx.fillStyle=C.faint;ctx.fillText(s.sn,x+ww/2,t+ph+30);});}
  const d=makeDemo($('#mgCanvas'),{
    frame(dt){let dirty=false;
      if(mode==='day'&&playing){acc+=dt;if(acc>.42){acc=0;hour++;if(hour>23){hour=23;playing=false;$('#mgPlay').textContent='Play the day';}slider.value=hour;stats();dirty=true;}}
      if(mode==='solar'){const p=PV[pv],tg=[p.sv,p.cr,p.sf,p.cu];for(let i=0;i<4;i++){const nv=gv[i]+(tg[i]-gv[i])*(RM?1:.12);if(Math.abs(nv-gv[i])>1e-3*(i===3?1000:1)){gv[i]=nv;dirty=true;}else gv[i]=tg[i];}}
      if(dirty)this.render();},
    render(){const{ctx,w,h}=this;ctx.clearRect(0,0,w,h);ctx.lineCap='butt';if(mode==='day')drawDay(ctx,w,h);else if(mode==='solar')drawSolar(ctx,w,h);else drawDesigns(ctx,w,h);}});
  function setMode(m){mode=m;cap.innerHTML=CAPS[m];note.textContent=NOTES[m];
    $('#mgCtrlDay').hidden=m!=='day';$('#mgCtrlSolar').hidden=m!=='solar';$('#mgCtrlDesigns').hidden=m!=='designs';
    $('#mgCanvas').style.cursor=m==='designs'?'pointer':'default';stats();d.render();}
  seg($('#mgTabs'),setMode);
  $('#mgPlay').addEventListener('click',e=>{if(playing){playing=false;e.target.textContent='Play the day';}else{if(hour>=23)hour=0;playing=true;acc=0;e.target.textContent='Pause';}stats();d.render();});
  slider.addEventListener('input',()=>{hour=+slider.value;playing=false;$('#mgPlay').textContent='Play the day';stats();d.render();});
  seg($('#mgMult'),v=>{pv=+v;stats();d.render();});
  seg($('#mgSeg'),v=>{metric=v;d.render();});
  $('#mgCanvas').addEventListener('click',e=>{if(mode!=='designs')return;const r=e.currentTarget.getBoundingClientRect(),x=e.clientX-r.left;
    const i=bars.findIndex(([a,b])=>x>=a&&x<b);if(i>=0){sel=i;stats();d.render();}});
  setMode('day');
})();
