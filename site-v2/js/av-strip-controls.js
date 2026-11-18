/* Shared prev/next + swipe + JS-driven loop for .sports-marquee / .cob-marquee.
   Replaces the CSS keyframe (and its :hover/:focus-within pause, which could stick
   after lightbox refocus or a lingering tap hover) with a rAF translate.
   Autoplay ~36px/s; arrow / swipe / lightbox-close resume after ~3s idle.
   Hover (fine pointer) pauses and resumes immediately on leave. Seamless wrap. */
(function () {
  'use strict';

  var SPEED = 36;
  var IDLE = 3000;
  var STEP_MS = 420;
  var SWIPE_PX = 14;
  var CHEVRON_L = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M15.4 4.6 8 12l7.4 7.4 1.2-1.2L10.4 12l6.2-6.2z"/></svg>';
  var CHEVRON_R = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8.6 4.6 15.99 12 8.6 19.4l-1.2-1.2 6.2-6.2-6.2-6.2z"/></svg>';

  function easeOutCubic(k) { return 1 - Math.pow(1 - k, 3); }

  function init(root, opts) {
    if (!root || root.getAttribute('data-mq-ctrl') === '1') return;
    var viewport = root.querySelector(opts.viewport);
    var track = viewport && viewport.querySelector(opts.track);
    if (!viewport || !track) return;
    root.setAttribute('data-mq-ctrl', '1');
    root.classList.add('is-js-marquee');

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var offset = 0;
    var hover = false;
    var lightbox = false;
    var stepping = false;
    var dragging = false;
    var lastT = 0;
    var rafId = 0;
    var resumeTimer = 0;
    var halfW = 0;

    function measure() {
      halfW = track.scrollWidth / 2;
      return halfW;
    }

    function wrapVal(x) {
      var h = halfW || measure();
      if (!h) return 0;
      x = x % h;
      if (x < 0) x += h;
      return x;
    }

    function apply() {
      if (!stepping && !dragging) offset = wrapVal(offset);
      track.style.transform = 'translate3d(' + (-offset) + 'px,0,0)';
    }

    function stepWidth() {
      var card = track.querySelector(opts.card + ':not([data-clone])') || track.querySelector(opts.card);
      if (!card) return 200;
      var gap = parseFloat(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap) || 16;
      return card.getBoundingClientRect().width + gap;
    }

    function canAutoplay() {
      return !reduce && !hover && !lightbox && !stepping && !dragging;
    }

    function tick(t) {
      if (!lastT) lastT = t;
      var dt = Math.min(48, t - lastT);
      lastT = t;
      if (canAutoplay()) {
        offset += SPEED * dt / 1000;
        apply();
      }
      rafId = window.requestAnimationFrame(tick);
    }

    function scheduleResume(ms) {
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(function () {
        lastT = 0;
      }, ms == null ? IDLE : ms);
    }

    function shift(dir) {
      if (stepping) return;
      window.clearTimeout(resumeTimer);
      measure();
      var w = stepWidth();
      if (!halfW || !w) return;
      offset = wrapVal(offset);
      if (dir < 0 && offset < w) offset += halfW;
      var from = offset;
      var to = offset + dir * w;
      stepping = true;
      dragging = false;
      var start = performance.now();
      function anim(now) {
        var k = Math.min(1, (now - start) / STEP_MS);
        offset = from + (to - from) * easeOutCubic(k);
        apply();
        if (k < 1) {
          window.requestAnimationFrame(anim);
        } else {
          offset = wrapVal(to);
          apply();
          stepping = false;
          lastT = 0;
          scheduleResume(IDLE);
        }
      }
      window.requestAnimationFrame(anim);
    }

    function btn(kind, label, svg, handler) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'mq-nav mq-' + kind;
      b.setAttribute('aria-label', label);
      b.innerHTML = svg;
      b.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        handler();
      });
      return b;
    }

    var prev = btn('prev', opts.prevLabel, CHEVRON_L, function () { shift(-1); });
    var next = btn('next', opts.nextLabel, CHEVRON_R, function () { shift(1); });
    root.insertBefore(prev, viewport);
    if (viewport.nextSibling) root.insertBefore(next, viewport.nextSibling);
    else root.appendChild(next);

    if (fineHover) {
      viewport.addEventListener('pointerenter', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        hover = true;
      });
      viewport.addEventListener('pointerleave', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        hover = false;
        lastT = 0;
      });
    }

    var dragStartX = 0;
    var dragStartOff = 0;
    var didSwipe = false;
    var activePtr = null;

    viewport.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.target && e.target.closest && e.target.closest('.mq-nav')) return;
      activePtr = e.pointerId;
      dragStartX = e.clientX;
      dragStartOff = wrapVal(offset);
      didSwipe = false;
      dragging = false;
    });

    viewport.addEventListener('pointermove', function (e) {
      if (activePtr == null || e.pointerId !== activePtr) return;
      var dx = e.clientX - dragStartX;
      if (!dragging && Math.abs(dx) < SWIPE_PX) return;
      if (!dragging) {
        dragging = true;
        didSwipe = true;
        window.clearTimeout(resumeTimer);
        stepping = false;
        measure();
        try { viewport.setPointerCapture(e.pointerId); } catch (err) {}
      }
      if (e.cancelable) e.preventDefault();
      offset = dragStartOff - dx;
      apply();
    }, { passive: false });

    function endDrag(e) {
      if (activePtr == null || (e && e.pointerId !== activePtr)) return;
      activePtr = null;
      if (dragging) {
        dragging = false;
        offset = wrapVal(offset);
        apply();
        lastT = 0;
        scheduleResume(IDLE);
      }
    }
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);

    viewport.addEventListener('click', function (e) {
      if (!didSwipe) return;
      e.preventDefault();
      e.stopPropagation();
      didSwipe = false;
    }, true);

    document.addEventListener('av-lightbox-change', function (ev) {
      var open = !!(ev && ev.detail && ev.detail.open);
      lightbox = open;
      if (open) {
        window.clearTimeout(resumeTimer);
        hover = false;
      } else {
        hover = false;
        lastT = 0;
        scheduleResume(IDLE);
      }
    });

    window.addEventListener('resize', function () {
      window.clearTimeout(root._mqRt);
      root._mqRt = window.setTimeout(function () {
        var prevH = halfW;
        var frac = prevH ? (wrapVal(offset) / prevH) : 0;
        measure();
        offset = frac * (halfW || 0);
        apply();
      }, 150);
    }, { passive: true });

    function kick() {
      measure();
      apply();
      if (!rafId) rafId = window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(kick);
    });
    Array.prototype.forEach.call(track.querySelectorAll('img'), function (img) {
      if (!img.complete) img.addEventListener('load', function () { measure(); }, { once: true });
    });
  }

  function boot() {
    var sports = document.getElementById('sportsGallery');
    if (sports && sports.classList.contains('sports-marquee') && sports.classList.contains('is-marquee-ready')) {
      init(sports, {
        viewport: ':scope > .sp-viewport',
        track: ':scope > .sp-track',
        card: '.sports-card',
        prevLabel: 'Previous sports image',
        nextLabel: 'Next sports image'
      });
    }
    var cob = document.getElementById('cobMfg');
    var cobGrid = cob && cob.querySelector('.cob-v2-grid.cob-marquee');
    if (cobGrid && cobGrid.classList.contains('is-marquee-ready')) {
      init(cobGrid, {
        viewport: ':scope > .cob-vp',
        track: ':scope > .cob-track',
        card: '.cob-v2-card',
        prevLabel: 'Previous COB factory image',
        nextLabel: 'Next COB factory image'
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
