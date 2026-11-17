/* Fallback push-in for browsers without scroll-driven animations */
(function(){
  if (CSS.supports && CSS.supports('animation-timeline','view()')) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var img=document.querySelector('.concert-hero img'); if(!img) return;
  var fig=img.parentElement, on=false, ticking=false;
  function upd(){ticking=false;var r=fig.getBoundingClientRect(),vh=innerHeight;
    var p=Math.min(1,Math.max(0,(vh-r.top)/(vh+r.height)));img.style.transform='translate3d(0,'+(-2+4*p).toFixed(2)+'%,0) scale('+(1.05+0.04*p).toFixed(4)+')';}
  function onScroll(){if(on&&!ticking){ticking=true;requestAnimationFrame(upd);}}
  new IntersectionObserver(function(e){on=e[0].isIntersecting;if(on)onScroll();}).observe(fig);
  addEventListener('scroll',onScroll,{passive:true});
})();
