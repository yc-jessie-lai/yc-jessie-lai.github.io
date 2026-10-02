/* Project map + filters (home and /projects/), and the small location map on project pages. */
(function(){
  'use strict';
  // Put the Americas east of Asia so one view spans Bangladesh → Taiwan → California across the Pacific.
  const lng=lon=>lon<-30?lon+360:lon;
  const TILES='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
  const ATTR='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
  const pinIcon=(color,active)=>L.divIcon({className:'pin'+(active?' is-active':''),html:`<span style="background:${color}"></span>`,iconSize:[18,18],iconAnchor:[9,9],popupAnchor:[0,-8],tooltipAnchor:[0,-10]});
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  function explorer(){
    const box=document.getElementById('explorer');if(!box||!window.L||!window.PROJECTS)return;
    const P=window.PROJECTS,CAT={};(window.CATEGORIES||[]).forEach(c=>CAT[c.id]=c);
    const rows=Array.from(box.querySelectorAll('.ex-row'));
    const map=L.map('exMap',{scrollWheelZoom:false,worldCopyJump:false,minZoom:1,zoomSnap:.25});
    L.tileLayer(TILES,{attribution:ATTR,subdomains:'abcd',maxZoom:19}).addTo(map);
    const group=L.markerClusterGroup?L.markerClusterGroup({showCoverageOnHover:false,maxClusterRadius:44,spiderfyOnMaxZoom:true,
      iconCreateFunction:c=>L.divIcon({className:'cluster',html:`<span>${c.getChildCount()}</span>`,iconSize:[32,32]})}):L.featureGroup();
    map.addLayer(group);
    const byUrl={};
    P.forEach(p=>{const color=(CAT[p.category]||{}).color||'#555';
      const m=L.marker([p.lat,lng(p.lon)],{icon:pinIcon(color),title:p.title,riseOnHover:true});
      m.bindTooltip(esc(p.short||p.title),{direction:'top'});
      m.bindPopup(`<div class="pop-meta">${esc((CAT[p.category]||{}).name||'')} · ${esc(p.period)}</div><a class="pop-title" href="${p.url}">${esc(p.title)}</a><div class="pop-meta">${esc(p.place)}</div>`);
      m.on('popupopen',()=>hl(p.url,true));m.on('popupclose',()=>hl(p.url,false));
      byUrl[p.url]={p,m,color};});
    function hl(url,on){rows.forEach(r=>r.classList.toggle('hl',on&&r.dataset.url===url));
      const o=byUrl[url];if(o)o.m.setIcon(pinIcon(o.color,on));}
    rows.forEach(r=>{r.addEventListener('mouseenter',()=>hl(r.dataset.url,true));r.addEventListener('mouseleave',()=>hl(r.dataset.url,false));});

    // tag filter buttons, most common first
    const count={};P.forEach(p=>(p.tags||[]).forEach(t=>count[t]=(count[t]||0)+1));
    const tags=Object.keys(count).sort((a,b)=>count[b]-count[a]||a.localeCompare(b));
    const tagbar=document.getElementById('exTags');
    tagbar.innerHTML='<span class="lab">Skills:</span>'+tags.map(t=>`<button type="button" class="tag-btn" data-tag="${esc(t)}" aria-pressed="false">${esc(t)}</button>`).join('');
    let cat='all',tag=null;
    function apply(fit){
      const vis=[];group.clearLayers();
      rows.forEach(r=>{const ok=(cat==='all'||r.dataset.cat===cat)&&(!tag||r.dataset.tags.split('|').includes(tag));r.hidden=!ok;
        if(ok){const o=byUrl[r.dataset.url];if(o){group.addLayer(o.m);vis.push(o.m.getLatLng());}}});
      document.getElementById('exEmpty').hidden=vis.length>0;
      if(fit&&vis.length)map.fitBounds(L.latLngBounds(vis),{padding:[40,40],maxZoom:vis.length===1?11:12});}
    box.querySelector('#exCats').addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(!b)return;cat=b.dataset.cat;
      box.querySelectorAll('#exCats [data-cat]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));apply(true);});
    tagbar.addEventListener('click',e=>{const b=e.target.closest('[data-tag]');if(!b)return;tag=tag===b.dataset.tag?null:b.dataset.tag;
      tagbar.querySelectorAll('[data-tag]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.tag===tag)));apply(true);});
    document.getElementById('exReset').addEventListener('click',()=>{cat='all';tag=null;
      box.querySelectorAll('[aria-pressed]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.cat==='all')));apply(true);});
    apply(true);
  }

  function miniMap(){
    const el=document.getElementById('miniMap');if(!el||!window.L)return;
    const lat=+el.dataset.lat,lon=lng(+el.dataset.lon);
    const m=L.map(el,{zoomControl:false,scrollWheelZoom:false,dragging:false,doubleClickZoom:false,boxZoom:false,keyboard:false,touchZoom:false,attributionControl:true}).setView([lat,lon],11);
    L.tileLayer(TILES,{attribution:ATTR,subdomains:'abcd',maxZoom:19}).addTo(m);
    L.marker([lat,lon],{icon:pinIcon(el.dataset.color||'#555',true),interactive:false}).addTo(m);
    m.attributionControl.setPrefix(false);
  }
  document.addEventListener('DOMContentLoaded',()=>{explorer();miniMap();});
})();
