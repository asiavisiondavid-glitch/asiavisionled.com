/* Asia Vision hero demo: module unfold + ink-wash ending, 2.5D composite of three real product photos.
   Self-contained (no libraries). Starts after load/idle, pauses off-screen, static end frame for prefers-reduced-motion.
   Markup: <div id="hero-demo" data-base="/images/unfold/"></div> */
(function () {
  var host = document.getElementById('hero-demo'); if (!host) return;
  var BASE = host.getAttribute('data-base') || '/images/unfold/';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var P = [[4.61709635, 0.0, 1.01460458, 412.0], [0.74932578, 4.00875038, -0.86118537, 188.71559143], [0.00075505, 0.0, -0.00082313, 1.0]], FACE = {"TL": [412.0, 188.716], "TR": [2270.0, 450.559], "BR": [2270.0, 1747.859], "BL": [412.0, 2112.916]};
  var MW = 320, MH = 160, MT = 1.6;
  var PHOTO = { x: 320, y: 160, w: 1985, h: 1985 };           // crop of 3q-interior-hub.png the webp was made from (original px)
  var FACE_FILL = ['#0b0b0c', '#050505', '#070708'], EDGE = '#5f5f5f';
  var OFF = function (r, c) { return [c ? 40 : -190, (r - 1) * 32, c ? 150 + r * 60 : 40 + r * 35]; };
  var LOOP = { unfold: 2.6, fold: 1.8, view: 1.4, ink: 7.7 }; // no holds; rear in/out uses view
  var clamp = function (x, a, b) { a = a === undefined ? 0 : a; b = b === undefined ? 1 : b; return Math.min(b, Math.max(a, x)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var ease3 = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var ease2 = function (t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  function prj(X, Y, Z) { var w = P[2][0] * X + P[2][1] * Y + P[2][2] * Z + P[2][3]; return [(P[0][0] * X + P[0][1] * Y + P[0][2] * Z + P[0][3]) / w, (P[1][0] * X + P[1][1] * Y + P[1][2] * Z + P[1][3]) / w]; }

  var cv = document.createElement('canvas'), ctx = cv.getContext('2d'), inkCv = document.createElement('canvas');
  cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
  inkCv.style.cssText = 'position:absolute;left:0;top:0;transform-origin:0 0;pointer-events:none;display:none;will-change:transform,opacity';
  host.appendChild(cv); host.appendChild(inkCv);

  // ---- modules ------------------------------------------------------------------------------
  var mods = [];
  for (var r = 0; r < 3; r++) for (var c = 0; c < 2; c++) mods.push({ r: r, c: c, i: r * 2 + c, X0: c * MW, Y0: r * MH, d: OFF(r, c), k: 0 });
  var byRC = function (r, c) { for (var i = 0; i < mods.length; i++) if (mods[i].r === r && mods[i].c === c) return mods[i]; return null; };
  var pos = function (m) { return [m.X0 + m.d[0] * m.k, m.Y0 + m.d[1] * m.k, m.d[2] * m.k]; };

  // ---- camera: fit the assembled cabinet, ease towards a fit of the fully unfolded layout ------------
  function bbox(pts) { var a = [1e9, 1e9, -1e9, -1e9]; pts.forEach(function (p) { a[0] = Math.min(a[0], p[0]); a[1] = Math.min(a[1], p[1]); a[2] = Math.max(a[2], p[0]); a[3] = Math.max(a[3], p[1]); }); return a; }
  var asm = bbox([prj(0, 0, 0), prj(640, 0, 0), prj(640, 480, 0), prj(0, 480, 0), prj(0, 0, -46), prj(0, 480, -46)]);
  var up = []; mods.forEach(function (m) { [0, MW].forEach(function (x) { [0, MH].forEach(function (y) { up.push(prj(m.X0 + m.d[0] + x, m.Y0 + m.d[1] + y, m.d[2])); }); }); });
  var unf = bbox(up.concat([[asm[0], asm[1]], [asm[2], asm[3]]]));
  var W = 0, H = 0, dpr = 1;
  function fit(b, m) { var bw = (b[2] - b[0]) * (1 + m), bh = (b[3] - b[1]) * (1 + m); return { s: Math.min(W / bw, H / bh), cx: (b[0] + b[2]) / 2, cy: (b[1] + b[3]) / 2 }; }

  // ---- assets -------------------------------------------------------------------------------
  var photo = null, rearPhoto = null, glOK = false;
  var REAR = { w: 2337, h: 2277, from: [225, 163, 2134, 2065], to: [350, 188, 2273, 2115] };
  function size() { var r = host.getBoundingClientRect(); W = r.width; H = r.height; dpr = Math.min(window.devicePixelRatio || 1, 2); cv.width = Math.max(1, Math.round(W * dpr)); cv.height = Math.max(1, Math.round(H * dpr)); }
  function poly(pts) { ctx.beginPath(); pts.forEach(function (p, i) { i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.closePath(); }

  var S = { u: 0, rear: 0, ink: 0, inkA: 0 };
  function draw() {
    if (!photo || !W) return;
    var ue = ease3(S.u), fa = fit(asm, .10), fu = fit(unf, .04);
    var s = lerp(fa.s, fu.s, ue), cx = lerp(fa.cx, fu.cx, ue), cy = lerp(fa.cy, fu.cy, ue);
    var ox = W / 2 - cx * s, oy = H / 2 - cy * s;
    var T = function (p) { return [ox + p[0] * s, oy + p[1] * s]; };
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    // soft contact shadow on the light background
    var bl = T(prj(0, 480, 0)), br = T(prj(640, 480, 0)), ang = Math.atan2(br[1] - bl[1], br[0] - bl[0]), len = Math.hypot(br[0] - bl[0], br[1] - bl[1]);
    ctx.save(); ctx.translate((bl[0] + br[0]) / 2, (bl[1] + br[1]) / 2 + len * .035); ctx.rotate(ang); ctx.scale(1, .075);
    var gs = ctx.createRadialGradient(0, 0, 0, 0, 0, len * .62); gs.addColorStop(0, 'rgba(20,20,30,' + (.16 * (1 - .4 * ue)).toFixed(3) + ')'); gs.addColorStop(1, 'rgba(20,20,30,0)');
    ctx.fillStyle = gs; ctx.beginPath(); ctx.arc(0, 0, len * .62, 0, 6.2832); ctx.fill(); ctx.restore();
    var rearA = clamp(S.rear), frontA = 1 - rearA;
    if (frontA > .001) {
      ctx.globalAlpha = 1;
      ctx.drawImage(photo, ox + PHOTO.x * s, oy + PHOTO.y * s, PHOTO.w * s, PHOTO.h * s);
    }
    if (rearA > .001 && rearPhoto) {
      var a = REAR, sc = ((a.to[2] - a.to[0]) / (a.from[2] - a.from[0]) + (a.to[3] - a.to[1]) / (a.from[3] - a.from[1])) / 2;
      var fx = (a.from[0] + a.from[2]) / 2, fy = (a.from[1] + a.from[3]) / 2, tx = (a.to[0] + a.to[2]) / 2, ty = (a.to[1] + a.to[3]) / 2;
      ctx.globalAlpha = rearA;
      ctx.drawImage(rearPhoto, ox + (tx - fx * sc) * s, oy + (ty - fy * sc) * s, REAR.w * sc * s, REAR.h * sc * s);
      ctx.globalAlpha = 1;
    }
    if (frontA <= .001) {
      inkCv.style.display = 'none';
      return;
    }
    // ink overlay (WebGL canvas mapped onto the front-face quad)
    var inkOn = glOK && S.inkA > .002 && frontA > .002;
    inkCv.style.display = inkOn ? 'block' : 'none';
    if (inkOn) {
      Ink.draw(Math.max(0, S.ink)); inkCv.style.width = Ink.W + 'px'; inkCv.style.height = Ink.H + 'px';
      inkCv.style.transform = Ink.matrix3d([T([FACE.TL[0], FACE.TL[1]]), T([FACE.TR[0], FACE.TR[1]]), T([FACE.BR[0], FACE.BR[1]]), T([FACE.BL[0], FACE.BL[1]])]);
      inkCv.style.opacity = S.inkA * frontA;
    }
    // modules: pure black plates in the photo's perspective
    mods.forEach(function (m) { m.k = ease3(clamp(S.u * 1.45 - m.i * .075)); });
    var order = mods.slice().sort(function (a, b) { return pos(a)[2] - pos(b)[2] || a.i - b.i; });
    var g = ctx.createLinearGradient.apply(ctx, T([FACE.TL[0], FACE.TL[1]]).concat(T([FACE.BR[0], FACE.BR[1]])));
    FACE_FILL.forEach(function (col, i, a) { g.addColorStop(i / (a.length - 1), col); });
    var sep = function (m, n, e) { if (!n) return 99; var a = pos(m), b = pos(n), dx = a[0] - b[0], dy = a[1] - b[1]; if (e === 'l') dx -= MW; if (e === 'r') dx += MW; if (e === 't') dy -= MH; if (e === 'b') dy += MH; return Math.hypot(dx, dy, a[2] - b[2]); };
    if (S.u > .001) {
      ctx.save(); poly([T(FACE.TL), T(FACE.TR), T(FACE.BR), T(FACE.BL)]); ctx.clip();
      ctx.filter = 'blur(' + Math.max(2, 14 * s / .3) + 'px)';
      order.forEach(function (m) {
        var p = pos(m), x = p[0], y = p[1], z = p[2]; if (z < 4) return;
        ctx.globalAlpha = .34 * clamp(z / 120);
        var q = function (X, Y) { return T(prj(X + z * .28, Y + z * .34, 0)); };
        poly([q(x, y), q(x + MW, y), q(x + MW, y + MH), q(x, y + MH)]); ctx.fillStyle = '#000'; ctx.fill();
      });
      ctx.restore(); ctx.filter = 'none'; ctx.globalAlpha = 1;
    }
    var hide = inkOn && S.u < .001 ? clamp(S.inkA) : 0;      // modules stay underneath the ink overlay
    var mA = 1 - clamp(S.rear * 2);
    if (mA < .01) { inkCv.style.opacity = S.inkA * frontA; return; }
    ctx.globalAlpha = mA;
    order.forEach(function (m) {
      var p = pos(m), x = p[0], y = p[1], z = p[2], zb = z - MT, Q = function (X, Y, Z) { return T(prj(X, Y, Z)); };
      var edges = [
        ['l', [Q(x, y, z), Q(x, y + MH, z), Q(x, y + MH, zb), Q(x, y, zb)], byRC(m.r, m.c - 1)],
        ['r', [Q(x + MW, y, z), Q(x + MW, y + MH, z), Q(x + MW, y + MH, zb), Q(x + MW, y, zb)], byRC(m.r, m.c + 1)],
        ['t', [Q(x, y, z), Q(x + MW, y, z), Q(x + MW, y, zb), Q(x, y, zb)], byRC(m.r - 1, m.c)],
        ['b', [Q(x, y + MH, z), Q(x + MW, y + MH, z), Q(x + MW, y + MH, zb), Q(x, y + MH, zb)], byRC(m.r + 1, m.c)]];
      edges.forEach(function (e) { var a = clamp(sep(m, e[2], e[0]) / 3); if (a < .01) return; ctx.globalAlpha = a; ctx.fillStyle = EDGE; ctx.strokeStyle = EDGE; ctx.lineWidth = .6; poly(e[1]); ctx.fill(); ctx.stroke(); });
      ctx.globalAlpha = 1;
      var f = [Q(x, y, z), Q(x + MW, y, z), Q(x + MW, y + MH, z), Q(x, y + MH, z)];
      ctx.fillStyle = g; ctx.strokeStyle = g; ctx.lineWidth = 1.2; ctx.lineJoin = 'round'; poly(f); ctx.fill(); ctx.stroke();
      if (m.k > .02) {
        ctx.globalAlpha = clamp(m.k * 1.5) * .55; ctx.lineWidth = 1.1; ctx.strokeStyle = '#6a6a70'; ctx.lineJoin = 'miter';
        ctx.beginPath(); ctx.moveTo(f[3][0], f[3][1]); ctx.lineTo(f[0][0], f[0][1]); ctx.lineTo(f[1][0], f[1][1]); ctx.stroke();
        ctx.globalAlpha = clamp(m.k * 1.5) * .3; ctx.strokeStyle = '#3c3c42'; ctx.beginPath(); ctx.moveTo(f[1][0], f[1][1]); ctx.lineTo(f[2][0], f[2][1]); ctx.lineTo(f[3][0], f[3][1]); ctx.stroke(); ctx.globalAlpha = 1;
      }
    });
    // the ink canvas must sit ABOVE the modules: it is a DOM overlay, so modules (canvas) are always below it
  }

  // ---- ink-wash WebGL ------------------------------------------------------------------------------
  var Ink = (function () {
    var IW = 688, IH = 516, api = { W: IW, H: IH }, gl, prog, loc = {}, tex, ok = false;
    var FS = `precision highp float;
uniform float uT; uniform vec2 uRes; uniform sampler2D uMark; uniform float uMarkA; varying vec2 vUv;
float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float a=.5, s=0.; mat2 r=mat2(.8,-.6,.6,.8); for(int i=0;i<5;i++){ s+=a*vn(p); p=r*p*2.03+vec2(7.1,3.7); a*=.5; } return s; }
float fbm3(vec2 p){ float a=.5, s=0.; mat2 r=mat2(.8,-.6,.6,.8); for(int i=0;i<3;i++){ s+=a*vn(p); p=r*p*2.03+vec2(7.1,3.7); a*=.5; } return s; }
float ridge(float x, float seed, float fr){ float a=.5,s=0.,p=x*fr+seed; for(int i=0;i<4;i++){ s+=a*vn(vec2(p,seed*1.7)); p*=2.1; a*=.5; } return s; }
// one ink drop blooming outwards with an organic, feathered edge
float drop(vec2 q, vec2 c, float t0, float R, float t, out float ring){
  float a = t-t0; ring=0.; if(a<0.) return 0.;
  float r = R*(1.-exp(-1.35*a));
  float n = fbm(q*3.2 + c*9. + a*.12);
  float d = length(q-c) + (n-.5)*.42*(.25+r);
  float m = smoothstep(r, r*.18, d);
  float vein = fbm(q*6.5 + c*4. - a*.05);
  m *= .45 + 1.05*vein;
  ring = exp(-pow((d-r*.9)/(.018+r*.03),2.)) * smoothstep(0.,.5,a) * (1.-smoothstep(1.5,4.,a));
  return clamp(m,0.,1.2);
}
vec3 scr(vec3 a, vec3 b){ return 1.-(1.-a)*(1.-b); }
// wet-ink 'over' compositing: pigments mix towards each other (stay saturated), darker pigment at the feathered rim
vec3 over(vec3 base, vec3 ink, float m, float ring){ vec3 c = mix(base, ink, clamp(m,0.,1.)*.88); c = mix(c, ink*1.15, clamp(ring,0.,1.)*.5); return c; }
void main(){
  vec2 uv = vec2(vUv.x, 1.-vUv.y);            // y down
  vec2 q = vec2(uv.x*1.3333, uv.y);
  float t = uT;
  vec3 ORG=vec3(1.,.42,.21), CYA=vec3(.08,.78,.95), MAG=vec3(.92,.12,.58), IND=vec3(.27,.22,.88), GLD=vec3(1.,.72,.25);
  vec2 w = vec2(fbm3(q*2.1+vec2(0.,t*.05)), fbm3(q*2.1+vec2(5.2,1.3-t*.045)));
  vec2 qq = q + (w-.5)*.30;
  vec3 col = vec3(.012,.012,.02);
  float ring, g;
  // --- blooms: orange, cyan, magenta, indigo, gold --------------------------------------------
  g = drop(qq, vec2(.26,.66), .55, 1.00, t, ring); col = over(col, ORG*.97, g, ring);
  g = drop(qq, vec2(1.06,.30), 1.05, .95, t, ring); col = over(col, CYA*.92, g*.95, ring);
  g = drop(qq, vec2(.70,.58), 1.55, .62, t, ring); col = over(col, MAG*.92, g*.85, ring);
  g = drop(qq, vec2(.14,.14), 1.85, .62, t, ring); col = over(col, IND*.95, g*.80, ring);
  g = drop(qq, vec2(1.10,.78), 2.20, .55, t, ring); col = over(col, GLD*.95, g*.6, ring);
  // --- flowing brush strokes (飞白) ------------------------------------------------------------
  for(int k=0;k<3;k++){
    float fk = float(k); float t0 = .9 + fk*.55;
    float head = (t-t0)*.9;
    float y = .30 + fk*.22 + .10*sin(q.x*2.6+fk*2.1+t*.5) + .05*sin(q.x*7.+fk*5.);
    float body = smoothstep(head, head-.55, q.x) * (1.-smoothstep(t0+3.2, t0+4.4, t));
    float dist = abs(q.y-y);
    float wd = .0035 + .010*smoothstep(0.,.6,q.x)*(1.-smoothstep(.9,1.35,q.x));
    float streak = .35 + .85*vn(vec2(q.x*70.+fk*9., q.y*3.));
    float s = exp(-pow(dist/wd,2.)) * body * streak * step(0.,t-t0);
    vec3 sc = k==0 ? mix(vec3(1.),CYA,.4) : (k==1 ? mix(vec3(1.),ORG,.35) : mix(vec3(1.),MAG,.35));
    col = scr(col, sc*s*.85);
  }
  // --- rising sun + ink-wash mountains ----------------------------------------------------------
  float sunA = smoothstep(2.0,3.4,t);
  vec2 sc2 = vec2(1.02,.31); float sd = length(q-sc2);
  col = mix(col, vec3(1.,.52,.24), smoothstep(.115,.105,sd)*.92*sunA); col = scr(col, ORG*exp(-sd*4.5)*.20*sunA);
  float rev = smoothstep(2.4,4.7,t);
  float fadeBack = 1.;
  for(int k=0;k<4;k++){
    float fk=float(k);
    float base = .56 + fk*.115;
    float amp = .20 - fk*.028;
    float ry = base - amp*(ridge(q.x+fk*.37, fk*3.1+1.3, 1.9+fk*.5)-.35) + (1.-rev)*(.55 - fk*.06);
    float soft = .004 + .006*fk;
    float m = smoothstep(ry-soft, ry+soft, q.y);
    float depth = fk/3.;
    vec3 tint = mix(vec3(.04,.07,.17), vec3(.002,.004,.012), depth);
    // faint colour bleeding inside the ink body (wet ink)
    float wet = fbm3(q*vec2(3.,6.)+fk*4.+t*.03);
    tint += mix(IND,CYA,wet)*.05*(1.-depth*.7);
    col = mix(col, tint, m*(.80+.20*depth));
    float rim = exp(-pow((q.y-ry)/(.0055),2.)) * rev;
    col = scr(col, mix(CYA,ORG,.5+.5*sin(q.x*3.+fk))*rim*.28*(1.-depth*.5));
    // mist hanging between ridges
    float mist = exp(-pow((q.y-(ry-.035))/.07,2.)) * fbm3(q*vec2(2.5,4.)+fk*3.+t*.04) * rev;
    col = scr(col, mix(vec3(.55,.62,.95),vec3(1.,.7,.6),.4)*mist*.16);
  }
  // --- LED / tech feel: faint cell grid, twinkling specks, scan sweep ----------------------------
  vec2 gcell = uv*vec2(43.,32.25);
  vec2 gl = abs(fract(gcell)-.5);
  float grid = smoothstep(.485,.5,max(gl.x,gl.y));
  float powerOn = smoothstep(0.,.6, t);
  col += CYA*grid*.035*powerOn*(.6+.4*sin(t*2.+gcell.x*.4));
  for(int k=0;k<2;k++){
    vec2 sp = q*vec2(14.+float(k)*9.,14.+float(k)*9.); vec2 id=floor(sp); vec2 f=fract(sp)-.5;
    float h=hash(id+float(k)*7.3);
    vec2 off=(vec2(hash(id+3.1),hash(id+9.7))-.5)*.5 + vec2(sin(t*.6+h*6.28),cos(t*.5+h*5.))*.12;
    float dd=length(f-off);
    float tw = pow(.5+.5*sin(t*(1.5+h*2.)+h*30.),3.);
    col += mix(CYA,ORG,h)*smoothstep(.07,.0,dd)*tw*step(.72,h)*.55*smoothstep(1.2,2.4,t);
  }
  float sweep = t*1.7 - .1;                         // power-on scan line (0 .. ~0.6 s) top -> bottom
  float on = smoothstep(sweep+.01, sweep-.01, uv.y);
  float line = exp(-pow((uv.y-sweep)/.006,2.))*step(0.,sweep)*step(sweep,1.05);
  col *= mix(0., 1., clamp(on + step(1.2, sweep*1.0),0.,1.));
  col += (CYA*.8+.2)*line*.9;
  // soft vignette, tone
  col *= 1. - .22*pow(length(uv-.5)*1.25, 2.2);
  float lum = dot(col,vec3(.3,.59,.11)); col = mix(vec3(lum), col, 1.18); col = pow(clamp(col,0.,1.), vec3(1.0));
  // --- real ASIA VISION logo (white alpha mask, R/G = tight/wide glow, A = crisp mask), composited last so it stays pure white
  vec4 lg = texture2D(uMark, vec2(vUv.x, uv.y));
  col += vec3(.45,.78,1.)*(lg.r*.42 + lg.g*.30)*uMarkA;
  col = mix(col, vec3(1.), lg.a*uMarkA);
  gl_FragColor = vec4(col,1.);
}`;
    var VS = 'attribute vec2 p; varying vec2 vUv; void main(){ vUv = p*.5+.5; gl_Position = vec4(p,0.,1.); }';
    api.init = function (cnv) {
      cnv.width = IW; cnv.height = IH;
      gl = cnv.getContext('webgl', { preserveDrawingBuffer: false, antialias: false, alpha: false }); if (!gl) return false;
      var sh = function (t, src) { var s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); } return s; };
      prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
      gl.useProgram(prog);
      var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      var a = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
      ['uT', 'uRes', 'uMark', 'uMarkA'].forEach(function (n) { loc[n] = gl.getUniformLocation(prog, n); });
      tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.viewport(0, 0, IW, IH); ok = true;
      var im = new Image(); im.onload = function () {                 // real ASIA VISION logo: crisp mask in A, glow in R/G
        var w = IW * .40, h = w * im.height / im.width, x = (IW - w) / 2, y = IH * .865 - h / 2;
        var mk = function (blur) { var c = document.createElement('canvas'); c.width = IW; c.height = IH; var x2 = c.getContext('2d'); if (blur) x2.filter = 'blur(' + blur + 'px)'; x2.drawImage(im, x, y, w, h); return x2.getImageData(0, 0, IW, IH).data; };
        var sharp = mk(0), g1 = mk(5), g2 = mk(14), d = new Uint8Array(IW * IH * 4);
        for (var i = 0; i < IW * IH; i++) { d[i * 4] = g1[i * 4 + 3]; d[i * 4 + 1] = g2[i * 4 + 3]; d[i * 4 + 2] = 255; d[i * 4 + 3] = sharp[i * 4 + 3]; }
        gl.bindTexture(gl.TEXTURE_2D, tex); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, IW, IH, 0, gl.RGBA, gl.UNSIGNED_BYTE, d); if (api.onlogo) api.onlogo();
      }; im.src = BASE + 'asia-vision-logo.png';
      return true;
    };
    api.draw = function (t) {
      if (!ok) return; gl.useProgram(prog); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1f(loc.uT, t); gl.uniform2f(loc.uRes, IW, IH); gl.uniform1i(loc.uMark, 0);
      gl.uniform1f(loc.uMarkA, Math.min(1, Math.max(0, (t - 4.6) / 1)));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    api.matrix3d = function (q) {
      var src = [[0, 0], [IW, 0], [IW, IH], [0, IH]], A = [], B = [];
      for (var i = 0; i < 4; i++) { var x = src[i][0], y = src[i][1], u = q[i][0], v = q[i][1]; A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); B.push(u); A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); B.push(v); }
      for (var i2 = 0; i2 < 8; i2++) { var mx = i2; for (var r2 = i2 + 1; r2 < 8; r2++) if (Math.abs(A[r2][i2]) > Math.abs(A[mx][i2])) mx = r2; var tA = A[i2]; A[i2] = A[mx]; A[mx] = tA; var tB = B[i2]; B[i2] = B[mx]; B[mx] = tB;
        for (var r3 = i2 + 1; r3 < 8; r3++) { var f = A[r3][i2] / A[i2][i2]; for (var c3 = i2; c3 < 8; c3++) A[r3][c3] -= f * A[i2][c3]; B[r3] -= f * B[i2]; } }
      var h = new Array(8); for (var i3 = 7; i3 >= 0; i3--) { var s = B[i3]; for (var c4 = i3 + 1; c4 < 8; c4++) s -= A[i3][c4] * h[c4]; h[i3] = s / A[i3][i3]; }
      return 'matrix3d(' + [h[0], h[3], 0, h[6], h[1], h[4], 0, h[7], 0, 0, 1, 0, h[2], h[5], 0, 1].join(',') + ')';
    };
    return api;
  })();

  // ---- timeline -----------------------------------------------------------------------------------
  var L = LOOP, T1 = 0, T2 = L.unfold, T3 = T2 + L.fold, T4 = T3 + L.view, T5 = T4 + L.view, TOT = T5 + L.ink;
  function setT(t) {
    S.ink = 0; S.inkA = 0; S.rear = 0;
    if (t < T2) { S.u = ease2(t / L.unfold); }
    else if (t < T3) { S.u = 1 - ease2((t - T2) / L.fold); }
    else if (t < T4) { S.u = 0; S.rear = ease2((t - T3) / L.view); }
    else if (t < T5) { S.u = 0; S.rear = 1 - ease2((t - T4) / L.view); }
    else { var it = t - T5; S.u = 0; S.ink = it; S.inkA = glOK ? Math.min(1, it / .35) * (1 - clamp((it - (L.ink - .5)) / .5)) : 0; }
  }
  var clock = 0, last = 0, running = false, visible = true, raf = 0;
  function frame(now) {
    raf = 0; if (!running || !visible || document.hidden) { last = 0; return; }
    if (last) clock += Math.min(.1, (now - last) / 1000); last = now;
    setT(clock % TOT); draw(); raf = requestAnimationFrame(frame);
  }
  function kick() { if (!raf && running && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); } }
  function start() {
    size(); glOK = Ink.init(inkCv);
    if (reduce) { // static end frame: ink-wash with the logo (or the assembled black cabinet if WebGL is unavailable)
      var endFrame = function () { S.u = 0; S.ink = 6.5; S.inkA = glOK ? 1 : 0; draw(); };
      Ink.onlogo = endFrame; endFrame(); return;
    }
    running = true; kick();
    host.addEventListener('click', function () { clock = S.u > .5 ? T2 : T1; kick(); });
  }
  if ('ResizeObserver' in window) new ResizeObserver(function () { size(); if (!running || reduce) draw(); }).observe(host); else addEventListener('resize', size);
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) kick(); }).observe(host);
  document.addEventListener('visibilitychange', kick);
  // lazy start: after load + idle so the H1 (LCP) is never delayed
  var pending = 2;
  var goWhenReady = function () {
    if (--pending > 0) return;
    var go = function () { start(); host.classList.add('on'); };
    (window.requestIdleCallback || function (f) { setTimeout(f, 60); })(go, { timeout: 800 });
  };
  var im0 = new Image(), im1 = new Image();
  im0.onload = function () { photo = im0; goWhenReady(); };
  im0.onerror = goWhenReady;
  im1.onload = function () { rearPhoto = im1; goWhenReady(); };
  im1.onerror = goWhenReady;
  var begin = function () { im0.src = BASE + 'cabinet-interior.webp'; im1.src = BASE + 'cabinet-rear.webp'; };
  if (document.readyState === 'complete') begin(); else addEventListener('load', begin);
  window.__heroDemo = { S: S, setT: setT, draw: draw, total: TOT, T: { T1: T1, T2: T2, T3: T3, T4: T4, T5: T5 }, stop: function () { running = false; } };
})();
