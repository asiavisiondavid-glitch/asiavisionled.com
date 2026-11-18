/* 2026-11-15 David: parallax depth for the 6 concert gallery images under WHY.
   Foreground cards (high depth) move faster than background ones; each photo also drifts inside its frame. */
(function () {
  var root = document.getElementById('concertGallery');
  if (!root) return;
  var mq = window.matchMedia('(min-width: 769px) and (prefers-reduced-motion: no-preference)');
  var cards = Array.prototype.slice.call(root.querySelectorAll('.gallery-thumb'));
  var DEPTH = [1, 0.35, 0.8, 0.45, 0.4, 0.95, 0.3, 0.75];
  cards.forEach(function (c, i) {
    var d = DEPTH[i % DEPTH.length];
    c.style.setProperty('--pd', d);
    c.classList.add(d >= 0.7 ? 'px-front' : 'px-back');
  });
  var ticking = false, active = false;
  function update() {
    ticking = false;
    var vh = window.innerHeight;
    var r = root.getBoundingClientRect();
    if (r.bottom < -200 || r.top > vh + 200) return;
    var p = ((r.top + r.height / 2) - vh / 2) / vh; // -1..1 around viewport centre
    if (p > 1.2) p = 1.2; else if (p < -1.2) p = -1.2;
    cards.forEach(function (c, i) {
      var d = DEPTH[i % DEPTH.length];
      c.style.setProperty('--py', (p * 70 * d).toFixed(1) + 'px');
      c.style.setProperty('--pi', (-p * 26 * (1.3 - d)).toFixed(1) + 'px');
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  function setup() {
    if (mq.matches && !active) {
      active = true; root.classList.add('is-parallax');
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      update();
    } else if (!mq.matches && active) {
      active = false; root.classList.remove('is-parallax');
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cards.forEach(function (c) { c.style.removeProperty('--py'); c.style.removeProperty('--pi'); });
    }
  }
  if (mq.addEventListener) mq.addEventListener('change', setup); else if (mq.addListener) mq.addListener(setup);
  setup();
})();
