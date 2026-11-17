/* Sports section: STEPPED marquee (EN homepage).
   Stepped autoplay (2026-11-13): advance one card every 3600ms, cards rest fully
   visible between steps. The old continuous CSS linear infinite translateX kept
   edge cards mid-scroll (text cut mid-letter). Clone set once; track is 2x.
   When the offset reaches one full set, slide to it (clones) then instantly reset
   to 0 — clones look identical to originals, so the reset is invisible.
   Keeps playing on hover/focus (David 2026-11-15). prefers-reduced-motion: no autoplay, manual overflow-x
   scroll. Transform only. */
(function () {
  'use strict';
  var root = document.getElementById('sportsGallery');
  if (!root || !root.classList.contains('sports-marquee')) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var viewport = root.querySelector(':scope > .sp-viewport');
  var track = viewport && viewport.querySelector(':scope > .sp-track');
  if (!viewport) {
    viewport = document.createElement('div');
    viewport.className = 'sp-viewport';
    viewport.setAttribute('aria-label', 'Sports LED gallery');
    track = document.createElement('div');
    track.className = 'sp-track';
    Array.prototype.slice.call(root.children).forEach(function (el) {
      if (el.classList && el.classList.contains('sports-card')) track.appendChild(el);
    });
    viewport.appendChild(track);
    root.appendChild(viewport);
  }
  if (!track) {
    track = viewport.querySelector('.sp-track') || document.createElement('div');
    if (!track.classList.contains('sp-track')) {
      track.className = 'sp-track';
      viewport.appendChild(track);
    }
  }

  var originals = Array.prototype.slice.call(track.querySelectorAll(':scope > .sports-card:not([data-clone])'));
  if (!originals.length) {
    Array.prototype.slice.call(root.querySelectorAll('.sports-card')).forEach(function (c) {
      if (c.closest('.sp-track') !== track) track.appendChild(c);
    });
    originals = Array.prototype.slice.call(track.querySelectorAll(':scope > .sports-card:not([data-clone])'));
  }
  if (originals.length < 2) return;

  // Drop any prior clones then rebuild exactly one duplicate set
  Array.prototype.slice.call(track.querySelectorAll('.sports-card[data-clone="1"]')).forEach(function (c) {
    c.parentNode.removeChild(c);
  });
  originals.forEach(function (c, i) {
    c.setAttribute('data-sp-i', String(i));
    var clone = c.cloneNode(true);
    clone.setAttribute('data-clone', '1');
    clone.removeAttribute('data-full');
    clone.removeAttribute('tabindex');
    clone.setAttribute('aria-hidden', 'true');
    clone.removeAttribute('role');
    if (clone.id) clone.removeAttribute('id');
    track.appendChild(clone);
  });

  // Clear any leftover inline transform/transition/animation from old continuous JS
  track.style.transform = '';
  track.style.transition = '';
  track.style.animationDuration = '';

  /* Stepped autoplay: do NOT add is-marquee-ready (that triggers the old continuous
     CSS animation). is-stepped forces animation:none via CSS as a safety net. */
  root.classList.add('is-stepped');
  if (reduce) {
    root.classList.add('is-marquee-static');
    return;
  }

  var STEP_MS = 3600, TRANS_MS = 650;
  var offset = 0, timer = null;
  function cardStep() {
    var c = originals[0];
    if (!c) return 0;
    var w = c.getBoundingClientRect().width;
    var cs = window.getComputedStyle(track);
    var gap = parseFloat(cs.columnGap || cs.gap || '14') || 14;
    return w + gap;
  }
  function setW() { return track.scrollWidth / 2; }
  function apply(off, animate) {
    track.style.transition = animate ? ('transform ' + TRANS_MS + 'ms cubic-bezier(.22,1,.36,1)') : 'none';
    track.style.transform = 'translate3d(' + (-off) + 'px,0,0)';
  }
  function step() {
    var st = cardStep(), sw = setW();
    if (!st || !sw) return;
    var next = offset + st;
    if (next >= sw) {
      apply(sw, true);
      offset = 0;
      window.setTimeout(function () { apply(0, false); }, TRANS_MS + 30);
    } else {
      offset = next;
      apply(offset, true);
    }
  }
  function start() { if (!timer) timer = window.setInterval(step, STEP_MS); }
  function stop() { if (timer) { window.clearInterval(timer); timer = null; } }
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
  start();
})();
