(function(){
 var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,vh=innerHeight;
 // 滚动揭示：只作用于加载时完全位于首屏以下的区块/卡片，保证 LCP 不受影响
 /* 滚动揭示（11-05 重构）：只揭示卡片与区块标题，不再整段 section 淡入（大面积重绘）；
    先一次性批量读取位置、再批量写入 class（避免读写交错的强制同步布局）；IO 一次性触发后 unobserve；无 scroll 监听。 */
 if(!reduce&&'IntersectionObserver' in window){
  var skip='header,nav,.mega-menu,.mobile-nav,footer,.av-blognav,.cob-carousel,.hero-full';
  var cand=[].slice.call(document.querySelectorAll('.ui-card, .card, .rel-card, .case-card, .product-card, .guide-card, .sc-card, .fc-card, .article-img, .table-wrap, main .section-header, body > section .section-header'))
   .filter(function(el){return !el.closest(skip)&&!el.parentElement.closest('.ui-card,.card,.product-card,.case-card')});
  var tops=cand.map(function(el){return el.getBoundingClientRect().top});           // 批量读
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}})},{rootMargin:'0px 0px -6% 0px'});
  var groups=new Map();
  cand.forEach(function(el,k){if(tops[k]<vh*1.02)return;                              // 首屏内元素不动画
   var p=el.parentElement,i=groups.get(p)||0;groups.set(p,i+1);
   el.style.setProperty('--i',Math.min(i,5));el.classList.add('av-reveal');io.observe(el);}); // 批量写
 }
 // 头部 scrolled 状态（IO 替代 scroll 监听）
 var h=document.querySelector('.header');
 if(h&&'IntersectionObserver' in window){var s=document.createElement('div');s.setAttribute('aria-hidden','true');s.style.cssText='position:absolute;top:60px;left:0;width:1px;height:1px;pointer-events:none';document.body.appendChild(s);
  new IntersectionObserver(function(es){h.classList.toggle('scrolled',!es[0].isIntersecting)}).observe(s);}
 // 移动菜单：aria、焦点陷阱、滚动锁定、Esc 关闭
 var btn=document.querySelector('.hamburger'),nav=document.querySelector('.mobile-nav');
 if(btn&&nav){
  if(!nav.id)nav.id='mobileNav';
  btn.setAttribute('aria-controls',nav.id);btn.setAttribute('aria-expanded','false');
  if(!btn.getAttribute('aria-label'))btn.setAttribute('aria-label','Menu');
  nav.setAttribute('aria-label','Mobile navigation');
  var sync=function(){var o=nav.classList.contains('open');btn.setAttribute('aria-expanded',o);document.documentElement.classList.toggle('av-lock',o);
   if(o){var f=nav.querySelector('a,button');f&&f.focus({preventScroll:true});}};
  new MutationObserver(sync).observe(nav,{attributes:true,attributeFilter:['class']});
  var close=function(){nav.classList.remove('open');btn.classList.remove('open');btn.focus();};
  document.addEventListener('keydown',function(e){
   if(!nav.classList.contains('open'))return;
   if(e.key==='Escape'){close();return;}
   if(e.key!=='Tab')return;
   var f=[btn].concat([].slice.call(nav.querySelectorAll('a[href],button,input,select,textarea'))).filter(function(x){return x.offsetParent!==null||x===btn});
   var a=f[0],z=f[f.length-1];
   if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}
   else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}
  });
  nav.addEventListener('click',function(e){if(e.target.closest('a'))document.documentElement.classList.remove('av-lock');});
 }
})();
/* Phase 2.5c：目录当前章节高亮（无 JS 时目录为普通锚链接） */
(function(){
 var side=document.querySelector('.article .av-toc-side');
 if(!side||!('IntersectionObserver' in window))return;
 var links={},heads=[];
 [].forEach.call(side.querySelectorAll('a[href^="#"]'),function(a){var h=document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));if(h){links[h.id]=a;heads.push(h);}});
 if(!heads.length)return;
 var vis={},cur=null;
 function set(id){if(id===cur)return;if(cur&&links[cur])links[cur].removeAttribute('aria-current');cur=id;if(id&&links[id])links[id].setAttribute('aria-current','true');}
 var io=new IntersectionObserver(function(es){
  es.forEach(function(e){vis[e.target.id]=e.isIntersecting;});
  var top=null;for(var i=0;i<heads.length;i++){if(vis[heads[i].id]){top=heads[i].id;break;}}
  if(!top){for(var j=heads.length-1;j>=0;j--){if(heads[j].getBoundingClientRect().top<120){top=heads[j].id;break;}}}
  set(top);
 },{rootMargin:'-88px 0px -55% 0px'});
 heads.forEach(function(h){io.observe(h);});
})();
