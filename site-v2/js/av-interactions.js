/* 概念 B（全站卡片追光）+ 概念 C（首页数字计数、案例跑马灯）。defer 加载；不改任何真实内容。 */
(function(){
var mm=function(q){return matchMedia(q).matches},reduce=mm('(prefers-reduced-motion: reduce)');
/* B：仅精细指针设备；reduced-motion 不追踪（CSS 保持居中静态光晕） */
if(mm('(hover: hover) and (pointer: fine)')){
 document.querySelectorAll('.ui-card').forEach(function(c){var d=document.createElement('span');d.className='av-dots';d.setAttribute('aria-hidden','true');c.appendChild(d);});
 if(!reduce){var cur=null,ev=null,q=false;
  var upd=function(){q=false;if(!cur||!ev)return;var r=cur.getBoundingClientRect();
   cur.style.setProperty('--x',((ev.clientX-r.left)/r.width*100).toFixed(1)+'%');cur.style.setProperty('--y',((ev.clientY-r.top)/r.height*100).toFixed(1)+'%');};
  document.addEventListener('pointermove',function(e){var c=e.target.closest&&e.target.closest('.ui-card');cur=c;ev=e;if(c&&!q){q=true;requestAnimationFrame(upd);}},{passive:true});}
}
if(!document.body.classList.contains('av-home-led'))return;
/* C1：计数。HTML 中即为终值；仅动画期间临时改写数字，结束恢复原文本。ISO 等编号不计数 */
if(!reduce&&'IntersectionObserver' in window){
 var run=function(el){var txt=el.textContent,parts=txt.split(/(\d+)/),t0=performance.now(),D=1400;el.classList.add('av-count');
  (function f(n){var k=Math.min(1,(n-t0)/D),e=1-Math.pow(1-k,3);
   el.textContent=parts.map(function(p,i){return i%2?Math.round(+p*e):p}).join('');
   if(k<1)requestAnimationFrame(f);else{el.textContent=txt;setTimeout(function(){el.classList.remove('av-count')},600);}})(t0);};
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);run(e.target);}})});
 document.querySelectorAll('.hero-facts .hf-val').forEach(function(v){if(/\d/.test(v.textContent)&&!/ISO|9001/.test(v.textContent))io.observe(v);});
}
/* C2：跑马灯。原卡片不动；克隆一份作装饰：aria-hidden + inert + alt="" */
var g=document.querySelector('.sports-section .sports-grid');if(!g)return;
var w=document.createElement('div');w.className='av-marquee';g.parentNode.insertBefore(w,g);w.appendChild(g);
[].slice.call(g.children).forEach(function(n){var c=n.cloneNode(true);c.setAttribute('aria-hidden','true');c.inert=true;c.setAttribute('tabindex','-1');
 c.querySelectorAll('img').forEach(function(i){i.alt='';});c.querySelectorAll('a,button').forEach(function(a){a.setAttribute('tabindex','-1')});
 c.querySelectorAll('.av-dots').forEach(function(d){d.remove()});g.appendChild(c);});
})();
/* ===== 首页 #why COB 画廊 · 环形 Coverflow（11-05）=====
   HOVER_PLAY=false（本版默认）：不悬停播放。点击侧卡 → 转到正面；点击正面卡 → 展开 dialog（视频静音播放）。
   导航：‹ ›、← →、拖拽/滑动、点击侧卡。无自动轮播。prefers-reduced-motion：平面淡入切换，无 3D。 */
(function(){
var HOVER_PLAY=false; // 环形版默认关闭悬停播放；改为 true 可恢复桌面悬停预览
var g=document.querySelector('.cob-reel');if(!g)return;
var mm=function(q){return matchMedia(q).matches},fine=mm('(hover: hover) and (pointer: fine)'),reduce=mm('(prefers-reduced-motion: reduce)'),
 track=g.querySelector('.cob-track'),cap=g.querySelector('.cob-cap'),
 cards=[].slice.call(track.querySelectorAll('.cob-gcard')),n=cards.length,active=0,
 clean=function(f){return (f.getAttribute('data-cap')||'').replace(/\s+/g,' ').trim()};
g.classList.add('is-ring');if(reduce)g.classList.add('is-flat');
var play=function(v){v.muted=true;if(v.preload==='none')v.preload='auto';var p=v.play();if(p&&p.catch)p.catch(function(){});};
var stop=function(v,reset){v.pause();if(reset)try{v.currentTime=0}catch(e){}};
/* dialog 展开（保留） */
var dlg=null,last=null;
function build(){dlg=document.createElement('dialog');dlg.className='av-lightbox';dlg.setAttribute('aria-modal','true');
 dlg.innerHTML='<div class="av-lb-media"></div><button type="button" class="av-lb-close" aria-label="Close"></button>';
 document.body.appendChild(dlg);
 dlg.querySelector('.av-lb-close').addEventListener('click',close);
 dlg.addEventListener('click',function(e){if(e.target===dlg)close();});
 dlg.addEventListener('close',function(){var v=dlg.querySelector('video');if(v)v.pause();dlg.querySelector('.av-lb-media').innerHTML='';if(last)last.focus({preventScroll:true});});}
function openLb(f){if(!dlg)build();last=f;
 cards.forEach(function(c){var v=c.querySelector('video');if(v){stop(v,true);c.classList.remove('is-playing')}});
 var m=dlg.querySelector('.av-lb-media'),src=f.querySelector('img,video'),el;
 if(src.tagName==='VIDEO'){el=document.createElement('video');el.src=src.currentSrc||src.getAttribute('src');el.poster=src.getAttribute('poster')||'';el.muted=true;el.loop=true;el.playsInline=true;el.setAttribute('playsinline','');el.setAttribute('aria-hidden','true');}
 else{el=document.createElement('img');el.src=src.currentSrc||src.getAttribute('src');el.alt=src.alt||'';}
 m.appendChild(el);dlg.setAttribute('data-cap',clean(f));dlg.setAttribute('aria-label',clean(f));
 if(dlg.showModal)dlg.showModal();else dlg.setAttribute('open','');
 if(el.tagName==='VIDEO')play(el);
 dlg.querySelector('.av-lb-close').focus({preventScroll:true});}
function close(){if(dlg&&dlg.open){if(dlg.close)dlg.close();else{dlg.removeAttribute('open');dlg.dispatchEvent(new Event('close'));}}}
function setActive(a,fromUser){a=((a%n)+n)%n;active=a;
 cards.forEach(function(c,i){var d=i-a;if(d>n/2)d-=n;if(d<-n/2)d+=n;c.dataset.off=String(d);c.classList.toggle('is-front',d===0);c.setAttribute('aria-current',d===0?'true':'false');
  var v=c.querySelector('video');if(v&&d!==0){stop(v,true);c.classList.remove('is-playing')}});
 if(cap)cap.textContent=clean(cards[a]);g.setAttribute('data-active',String(a));}
cards.forEach(function(f,i){
 var v=f.querySelector('video');
 f.setAttribute('role','button');f.setAttribute('tabindex','0');f.setAttribute('aria-haspopup','dialog');
 if(!f.getAttribute('aria-label'))f.setAttribute('aria-label',(v?'Video: ':'')+clean(f));
 if(v){v.muted=true;v.removeAttribute('autoplay');if(!f.querySelector('.av-play')){var b=document.createElement('span');b.className='av-play';b.setAttribute('aria-hidden','true');f.appendChild(b);}}
 f.addEventListener('click',function(e){if(+f.dataset.off===0)openLb(f);else setActive(i,true);});
 f.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();if(+f.dataset.off===0)openLb(f);else setActive(i,true);}
  else if(e.key==='ArrowRight'){e.preventDefault();setActive(active+1,true);}else if(e.key==='ArrowLeft'){e.preventDefault();setActive(active-1,true);}});
});
var pv=g.querySelector('.cob-prev'),nx=g.querySelector('.cob-next');
if(pv){pv.disabled=false;pv.addEventListener('click',function(){setActive(active-1,true)});}
if(nx){nx.disabled=false;nx.addEventListener('click',function(){setActive(active+1,true)});}
g.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();setActive(active+1,true)}else if(e.key==='ArrowLeft'){e.preventDefault();setActive(active-1,true)}});
/* 拖拽 / 触摸滑动 */
var sx=0,dx=0,drag=false;
var onDown=function(e){if(e.target.closest('.cob-gnav'))return;drag=true;sx=(e.touches?e.touches[0].clientX:e.clientX);dx=0;};
var onMove=function(e){if(!drag)return;dx=(e.touches?e.touches[0].clientX:e.clientX)-sx;};
var onUp=function(){if(!drag)return;drag=false;if(Math.abs(dx)>40)setActive(active+(dx<0?1:-1),true);};
track.addEventListener('pointerdown',onDown);window.addEventListener('pointermove',onMove);window.addEventListener('pointerup',onUp);
track.addEventListener('touchstart',onDown,{passive:true});track.addEventListener('touchmove',onMove,{passive:true});track.addEventListener('touchend',onUp);
setActive(0,false);
if('IntersectionObserver' in window)new IntersectionObserver(function(es){if(!es[0].isIntersecting)cards.forEach(function(c){var v=c.querySelector('video');if(v)stop(v,false)})}).observe(g);
})();
