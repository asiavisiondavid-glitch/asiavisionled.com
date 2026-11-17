/* Concept B (card cursor spotlight) + Concept C (hero count-up only). No 3D / marquee. */
(function(){
var mm=function(q){return matchMedia(q).matches},reduce=mm('(prefers-reduced-motion: reduce)');
/* B：仅精细指针；(hover:hover)；rAF 节流；只写 --x/--y（无 --rx/--ry，无几何变换） */
if(mm('(hover: hover) and (pointer: fine)')){
 document.querySelectorAll('.ui-card:not(.sports-card):not(.gallery-thumb)').forEach(function(c){
  if(c.querySelector('.av-dots'))return;
  var d=document.createElement('span');d.className='av-dots';d.setAttribute('aria-hidden','true');c.appendChild(d);
 });
 if(!reduce){var cur=null,ev=null,q=false;
  var rc=null,rcEl=null;addEventListener('scroll',function(){rc=null},{passive:true});
  var upd=function(){q=false;if(!cur||!ev)return;if(rcEl!==cur||!rc){rc=cur.getBoundingClientRect();rcEl=cur;}var r=rc;
   if(!r.width||!r.height)return;
   cur.style.setProperty('--x',((ev.clientX-r.left)/r.width*100).toFixed(1)+'%');
   cur.style.setProperty('--y',((ev.clientY-r.top)/r.height*100).toFixed(1)+'%');};
  document.addEventListener('pointermove',function(e){
   var c=e.target.closest&&e.target.closest('.ui-card:not(.sports-card):not(.gallery-thumb)');
   if(cur&&cur!==c){cur.style.removeProperty('--x');cur.style.removeProperty('--y');rc=null;rcEl=null;}
   cur=c;ev=e;if(c&&!q){q=true;requestAnimationFrame(upd);}
  },{passive:true});}
}
/* 体育卡悬停内层（几何抬升只在内层；命中盒静态） */
document.querySelectorAll('.sports-card').forEach(function(f){if(f.querySelector('.sp-in'))return;
 var w=document.createElement('div');w.className='sp-in';var img=f.querySelector('img');
 if(img){var m=document.createElement('span');m.className='sp-media';img.parentNode.insertBefore(m,img);m.appendChild(img);
  var g=document.createElement('span');g.className='sp-go';g.setAttribute('aria-hidden','true');
  g.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M8 7h9v9"/></svg>';m.appendChild(g);}
 while(f.firstChild)w.appendChild(f.firstChild);f.appendChild(w);f.querySelectorAll('.av-dots').forEach(function(d){d.remove()});});
/* C：计数（不依赖 av-home-led；HTML 终值；跳过 ISO/9001；无跑马灯） */
if(reduce||!('IntersectionObserver' in window))return;
var run=function(el){var txt=el.textContent,parts=txt.split(/(\d+)/),t0=performance.now(),D=1400;el.classList.add('av-count');
 (function f(n){var k=Math.min(1,(n-t0)/D),e=1-Math.pow(1-k,3);
  el.textContent=parts.map(function(p,i){return i%2?Math.round(+p*e):p}).join('');
  if(k<1)requestAnimationFrame(f);else{el.textContent=txt;setTimeout(function(){el.classList.remove('av-count')},600);}})(t0);};
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);run(e.target);}})});
document.querySelectorAll('.hero-facts .hf-val').forEach(function(v){
 if(/\d/.test(v.textContent)&&!/ISO|9001|FCC|RoHS|CE/.test(v.textContent))io.observe(v);
});
})();
