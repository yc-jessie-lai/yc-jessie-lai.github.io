/* ================= DAS ================= */
(function(){const N=600,T=10;let type='car',zoom=false,filt=false,sig=null,prog=1,sigma=.02;
  function gen(){const s=new Float32Array(N);
    for(let i=0;i<N;i++){const t=i/N*T;let v=0;
      if(type==='car')v=1*gauss(t,4.75,.09)+.9*gauss(t,5.25,.09)+.35*gauss(t,5,.7);
      else if(type==='moto')v=.45*gauss(t,4.88,.06)+.4*gauss(t,5.12,.06)+.08*gauss(t,5,.4);
      else if(type==='bike')v=.13*gauss(t,4.82,.07)+.12*gauss(t,5.12,.07);
      else for(let k=0;k<14;k++){const tk=1.6+k*.5;v+=.05*gauss(t,tk,.06)*(.6+.4*gauss(tk,5,2.2));}
      s[i]=v+.02*randn();}
    sigma=.02;
    if(filt){const o=new Float32Array(N);for(let i=0;i<N;i++){let a=0,c=0;for(let k=-3;k<=3;k++){const j=i+k;if(j>=0&&j<N){a+=s[j];c++;}}o[i]=a/c;}
      sigma=.02/Math.sqrt(7);return o;}
    return s;}
  function peaks(s){const thr=4*sigma,out=[];
    for(let i=0;i<N;i++){if(s[i]<thr)continue;let m=true;for(let k=-10;k<=10&&m;k++){const j=i+k;if(j>=0&&j<N&&s[j]>s[i])m=false;}if(m)out.push(i);}return out;}
  const d=makeDemo($('#dasCanvas'),{
    init(){sig=gen();},
    frame(dt){if(prog<1){prog=Math.min(1,prog+dt*(RM?99:1.5));this.render();}},
    render(){const{ctx,w,h}=this;ctx.clearRect(0,0,w,h);const pad=10,mid=h*.8;
      let mx=1.6;if(zoom){mx=0;for(const v of sig)mx=Math.max(mx,v);mx*=1.15;}
      const ys=v=>mid-(v/mx)*(mid-pad);
      ctx.strokeStyle=C.line;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,mid);ctx.lineTo(w,mid);
      for(let s=1;s<T;s++){const x=s/T*w;ctx.moveTo(x,mid);ctx.lineTo(x,mid+5);}ctx.stroke();
      const thr=4*sigma;ctx.setLineDash([4,4]);ctx.strokeStyle=rgba(C.accent,.7);ctx.beginPath();ctx.moveTo(0,ys(thr));ctx.lineTo(w,ys(thr));ctx.stroke();ctx.setLineDash([]);
      const n=Math.floor(prog*N);ctx.strokeStyle=C.teal;ctx.lineWidth=1.3;ctx.beginPath();
      for(let i=0;i<n;i++){const x=i/(N-1)*w,y=ys(sig[i]);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
      ctx.fillStyle=C.faint;ctx.font=MONO;ctx.textAlign='left';ctx.fillText('strain',6,16);ctx.textAlign='right';ctx.fillText('time, 10 s',w-6,h-6);
      ctx.fillStyle=C.accent;ctx.fillText('4σ detection threshold',w-6,ys(thr)-5);
      if(prog>=1){const p=peaks(sig);ctx.fillStyle=C.accent;
        p.forEach(i=>{ctx.beginPath();ctx.arc(i/(N-1)*w,ys(sig[i]),3.2,0,7);ctx.fill();});
        let mxv=0;for(const v of sig)mxv=Math.max(mxv,v);
        $('#dasStats').textContent=`peak ${mxv.toFixed(3)}   SNR ${(20*Math.log10(mxv/sigma)).toFixed(1)} dB   ${p.length} peak${p.length===1?'':'s'} detected`;}
    }});
  const redo=()=>{sig=gen();prog=RM?1:0;d.render();};
  seg($('#dasSeg'),v=>{type=v;redo();});
  $('#dasZoom').addEventListener('change',e=>{zoom=e.target.checked;d.render();});
  $('#dasFilt').addEventListener('change',e=>{filt=e.target.checked;redo();});
})();
