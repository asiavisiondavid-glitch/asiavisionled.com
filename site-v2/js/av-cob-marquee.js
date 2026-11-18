/* COB manufacturing six-card STEPPED marquee (EN homepage).
   Stepped autoplay (2026-11-13): advance one card every 3600ms, cards rest fully
   visible between steps. The old continuous CSS linear infinite translateX kept
   edge cards mid-scroll (text cut mid-letter, e.g. "ltra Slim", "alibration").
   Clone set once; track is 2x. When the offset reaches one full set, slide to it
   (clones) then instantly reset to 0 — clones look identical to originals, so the
   reset is invisible. Keeps playing on hover/focus (David 2026-11-15). prefers-reduced-motion: static +
   manual overflow-x. */
(function () {
  'use strict';
  var root = document.querySelector('#cobMfg .cob-v2-grid.cob-marquee, .cob-v2-grid.cob-marquee');
  if (!root) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var viewport = root.querySelector(':scope > .cob-vp');
  var track = viewport && viewport.querySelector(':scope > .cob-track');
  if (!viewport) {
    viewport = document.createElement('div');
    viewport.className = 'cob-vp';
    viewport.setAttribute('aria-label', 'COB manufacturing process');
    track = document.createElement('div');
    track.className = 'cob-track';
    Array.prototype.slice.call(root.children).forEach(function (el) {
      if (el.classList && el.classList.contains('cob-v2-card')) track.appendChild(el);
    });
    viewport.appendChild(track);
    root.appendChild(viewport);
  }
  if (!track) {
    track = viewport.querySelector('.cob-track') || document.createElement('div');
    if (!track.classList.contains('cob-track')) {
      track.className = 'cob-track';
      viewport.appendChild(track);
    }
  }

  var originals = Array.prototype.slice.call(track.querySelectorAll(':scope > .cob-v2-card:not([data-clone])'));
  if (!originals.length) {
    Array.prototype.slice.call(root.querySelectorAll('.cob-v2-card')).forEach(function (c) {
      if (c.closest('.cob-track') !== track) track.appendChild(c);
    });
    originals = Array.prototype.slice.call(track.querySelectorAll(':scope > .cob-v2-card:not([data-clone])'));
  }
  if (originals.length < 2) return;

  Array.prototype.slice.call(track.querySelectorAll('.cob-v2-card[data-clone="1"]')).forEach(function (c) {
    c.parentNode.removeChild(c);
  });
  originals.forEach(function (c, i) {
    c.setAttribute('data-cob-i', String(i));
    var clone = c.cloneNode(true);
    clone.setAttribute('data-clone', '1');
    clone.removeAttribute('data-full');
    clone.removeAttribute('tabindex');
    clone.removeAttribute('data-lb-bound');
    clone.setAttribute('aria-hidden', 'true');
    clone.removeAttribute('role');
    if (clone.id) clone.removeAttribute('id');
    track.appendChild(clone);
  });

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
