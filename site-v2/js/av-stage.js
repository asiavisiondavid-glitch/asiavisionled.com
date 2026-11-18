/* Three homepage scenes — same near-black LED-pixel base, tinted per scene.
   Scroll map: stage (hero→sports) → commercial (COB→factory) → XR (guides→CTA).
   Fixed layers; content/marquees scroll on top. Opacity crossfade only. No 3D. */
(function () {
  'use strict';
  if (!document.body.classList.contains('av-stage')) return;

  var root = document.getElementById('avScenes');
  if (!root) return;

  var scenes = {
    stage: document.getElementById('avSceneStage'),
    commercial: document.getElementById('avSceneCommercial'),
    xr: document.getElementById('avSceneXr')
  };
  var order = ['stage', 'commercial', 'xr'];
  var current = 'stage';
  var ticking = false;

  function setPaused() {
    document.body.classList.toggle('av-stage-paused', document.hidden);
  }
  document.addEventListener('visibilitychange', setPaused);
  setPaused();

  function anchors() {
    return {
      /* commercial begins at COB manufacturing */
      commercial: document.getElementById('cobMfg'),
      /* XR begins at buying guides */
      xr: document.getElementById('guides') || document.querySelector('.guides-section') || document.getElementById('contact')
    };
  }

  /* Switch when section top crosses ~58% of viewport */
  function pickScene() {
    var a = anchors();
    var line = (window.innerHeight || 800) * 0.58;
    function topVP(el) { return el ? el.getBoundingClientRect().top : Infinity; }
    if (topVP(a.xr) <= line) return 'xr';
    if (topVP(a.commercial) <= line) return 'commercial';
    return 'stage';
  }

  function apply(name) {
    if (name === current && root.getAttribute('data-active') === name) return;
    current = name;
    root.setAttribute('data-active', name);
    document.body.setAttribute('data-av-scene', name);
    order.forEach(function (key) {
      var el = scenes[key];
      if (!el) return;
      var on = key === name;
      el.classList.toggle('is-active', on);
      el.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      apply(pickScene());
    });
  }

  apply(pickScene());
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
})();
/* build 1794235935 */
