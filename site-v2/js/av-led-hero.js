/* 首页 Hero A：LED 点阵扫描 + 光标点亮。纯装饰（aria-hidden），首帧在两帧后绘制，不影响 h1 LCP。
   30fps 上限；移动端/低端机扫描结束后停止连续动画；prefers-reduced-motion 只画一帧静态点阵。 */
(function(){
var hero=document.getElementById('hero');if(!hero)return;
var bg=hero.querySelector('.hero-bg')||hero,c=document.createElement('canvas');c.className='av-led';c.setAttribute('aria-hidden','true');c.setAttribute('role','presentation');bg.appendChild(c);
var x=c.getContext('2d');if(!x)return;
var mq=function(q){return matchMedia(q).matches},reduce=mq('(prefers-reduced-motion: reduce)'),coarse=mq('(pointer: coarse)')||!mq('(hover: hover)'),
 nav=navigator,low=coarse||(nav.hardwareConcurrency||8)<=4||(nav.deviceMemory||8)<=4||(nav.connection&&nav.connection.saveData),
 P=innerWidth<768?10:14,R=P*.28,dpr=Math.min(devicePixelRatio||1,low?1.5:2),FRAME=1000/30,SCAN=1400,
 W,H,cols,rows,seed,mx=-1e4,my=-1e4,t0=0,last=0,raf=0,vis=true,done=false;
function size(){var r=hero.getBoundingClientRect();W=r.width;H=r.height;c.width=Math.round(W*dpr);c.height=Math.round(H*dpr);x.setTransform(dpr,0,0,dpr,0,0);
 cols=Math.ceil(W/P);rows=Math.ceil(H/P);seed=new Float32Array(cols*rows);for(var i=0;i<seed.length;i++)seed[i]=Math.random();}
function draw(t){ // t: ms since start
 var s=t/1000,sweep=reduce?1e9:(t/SCAN)*(W+80);x.clearRect(0,0,W,H);
 for(var j=0;j<rows;j++)for(var i=0;i<cols;i++){
  var px=i*P+P/2,py=j*P+P/2,k=seed[j*cols+i],a=.12;
  if(px<sweep){var wv=.5+.5*Math.sin(px*.012+py*.008-s*1.6);a=.10+wv*.35*(.3+px/W);
   var e=sweep-px;if(e<60&&!reduce)a+=(1-e/60)*.8;
   if(mx>-1e3){var d=Math.hypot(px-mx,py-my);if(d<160)a+=(1-d/160)*.9;}}
  x.fillStyle=k>.985?'rgba(255,107,53,'+a+')':(k>.6?'rgba(90,200,255,'+a*.8+')':'rgba(255,255,255,'+a*.7+')');
  x.fillRect(px-R,py-R,R*2,R*2);}
}
function loop(now){raf=0;if(!vis||document.hidden)return;if(!t0)t0=now;
 if(now-last>=FRAME){last=now;var t=now-t0;
  if(low&&t>=SCAN){draw(SCAN+80*SCAN/(W+80));done=true;return;} // 移动端/低端：扫描结束定格
  draw(t);}
 raf=requestAnimationFrame(loop);}
function start(){if(reduce||done||raf)return;raf=requestAnimationFrame(loop);}
size();
if(reduce){requestAnimationFrame(function(){draw(0)});}else requestAnimationFrame(function(){requestAnimationFrame(start)});
var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){size();if(reduce||done)draw(reduce?0:SCAN*2);},150);},{passive:true});
if(!low&&!reduce){
 hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;},{passive:true});
 hero.addEventListener('pointerleave',function(){mx=my=-1e4});}
if('IntersectionObserver' in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis)start();}).observe(hero);
document.addEventListener('visibilitychange',function(){if(!document.hidden)start();});
})();
