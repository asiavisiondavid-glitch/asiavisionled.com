/* Concept A: LED matrix canvas. Decorative, aria-hidden, starts after first paint so LCP (h1) is unaffected. */
(function(){
var hero=document.getElementById('hero');if(!hero)return;
var bg=hero.querySelector('.hero-bg')||hero,c=document.createElement('canvas');c.className='av-led';c.setAttribute('aria-hidden','true');bg.appendChild(c);
var x=c.getContext('2d'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,mob=innerWidth<768;
var P=mob?10:14,R=P*.28,W,H,cols,rows,dpr=Math.min(devicePixelRatio||1,2),mx=-1e4,my=-1e4,t0=performance.now(),run=true,seed=[];
function size(){var r=hero.getBoundingClientRect();W=r.width;H=r.height;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);cols=Math.ceil(W/P);rows=Math.ceil(H/P);seed=[];for(var i=0;i<cols*rows;i++)seed.push(Math.random());}
function draw(now){
 var t=(now-t0)/1000,sweep=reduce?1e9:t*W*.9; x.clearRect(0,0,W,H);
 for(var j=0;j<rows;j++)for(var i=0;i<cols;i++){
  var px=i*P+P/2,py=j*P+P/2,s=seed[j*cols+i],a=.12;
  if(px<sweep){ // scan reveal: column sweep lights the panel left->right
   var wave=.5+.5*Math.sin(px*.012+py*.008-t*1.6);a=.10+wave*.35*(.3+px/W);
   var edge=sweep-px;if(edge<60&&!reduce)a+=(1-edge/60)*.8;
   var d=Math.hypot(px-mx,py-my);if(d<160)a+=(1-d/160)*.9;
  }
  x.fillStyle=s>.985?'rgba(255,107,53,'+a+')':(s>.6?'rgba(90,200,255,'+a*.8+')':'rgba(255,255,255,'+a*.7+')');
  x.fillRect(px-R,py-R,R*2,R*2);
 }
 if(run&&!reduce)requestAnimationFrame(draw);
}
size();addEventListener('resize',size);
hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;});
hero.addEventListener('pointerleave',function(){mx=my=-1e4});
new IntersectionObserver(function(es){var v=es[0].isIntersecting;if(v&&!run){run=true;requestAnimationFrame(draw)}run=v;}).observe(hero);
if(location.hash==='#demo'){mx=W*.72;my=H*.45;t0-=1200;}
requestAnimationFrame(function(){requestAnimationFrame(draw)});
})();
