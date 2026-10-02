/* Shared helpers for the interactive demos on project pages.
   Each demo lives in assets/js/demos/<name>.js and uses these. */
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const C={};
(function readColors(){const s=getComputedStyle(document.documentElement);
  ['bg','panel','panel2','ink','dim','faint','line','accent','teal','blue','green','sand','violet'].forEach(v=>{C[v]=s.getPropertyValue('--'+v).trim();});})();
const hexRGB=h=>{h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');return[0,2,4].map(i=>parseInt(h.slice(i,i+2),16));};
const rgba=(h,a)=>{const[r,g,b]=hexRGB(h);return`rgba(${r},${g},${b},${a})`;};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const gauss=(x,m,s)=>Math.exp(-((x-m)**2)/(2*s*s));
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function randn(R=Math.random){let u=0;while(!u)u=R();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*R());}
const MONO='11px "Overpass Mono",ui-monospace,monospace';

function fitCanvas(c){const dpr=Math.min(window.devicePixelRatio||1,2);const r=c.getBoundingClientRect();
  const w=Math.max(1,r.width),h=Math.max(1,r.height);c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);
  const ctx=c.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);return{ctx,w,h};}
const demos=[];
const io=new IntersectionObserver(es=>es.forEach(e=>{const d=e.target._demo;if(d)d.visible=e.isIntersecting;}),{rootMargin:'120px'});
function makeDemo(canvas,o){const d=Object.assign({canvas,visible:false},o);canvas._demo=d;
  d.fit=()=>Object.assign(d,fitCanvas(canvas));d.fit();if(d.init)d.init();if(d.render)d.render();
  demos.push(d);io.observe(canvas);return d;}
let rT;window.addEventListener('resize',()=>{clearTimeout(rT);rT=setTimeout(()=>demos.forEach(d=>{d.fit();d.render&&d.render();}),120);});
let last=performance.now();
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;for(const d of demos)if(d.visible&&d.frame)d.frame(dt,now);requestAnimationFrame(loop);}
requestAnimationFrame(loop);
function seg(el,cb){el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  $$('button',el).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));cb(b.dataset.v,b);});}

/* Videos marked data-autoplay play (muted) only while on screen. */
document.addEventListener('DOMContentLoaded',()=>{
  $$('video[data-autoplay]').forEach(v=>new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting&&!RM)v.play().catch(()=>{});else v.pause();}),{threshold:.35}).observe(v));

  /* Before/after comparison sliders (from a project's "compare:" field). */
  $$('[data-compare]').forEach(box=>{
    const cmp=$('.cmp',box),after=$('.cmp-after',box),before=$('.cmp-before',box),handle=$('.cmp-handle',box),range=$('input[type=range]',box),note=$('.cmp-note',box);
    const setPos=p=>{p=clamp(p,0,100);after.style.clipPath=`inset(0 0 0 ${p}%)`;handle.style.left=p+'%';range.value=p;};
    range.addEventListener('input',()=>setPos(+range.value));
    let drag=false;const fromEvt=e=>{const r=cmp.getBoundingClientRect();setPos((e.clientX-r.left)/r.width*100);};
    cmp.addEventListener('pointerdown',e=>{drag=true;fromEvt(e);});
    addEventListener('pointermove',e=>{if(drag)fromEvt(e);});addEventListener('pointerup',()=>{drag=false;});
    seg($('.seg',box),(v,b)=>{before.src=b.dataset.before;after.src=b.dataset.after;if(note)note.textContent=b.dataset.note;});
    $$('.seg button',box).forEach(b=>{new Image().src=b.dataset.before;new Image().src=b.dataset.after;});
    setPos(50);
  });
});
