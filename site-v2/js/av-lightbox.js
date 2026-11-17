/* Shared lightbox for concert .gallery-thumb + sports .sports-card[data-full] + COB .cob-v2-card[data-full].
   Open: FLIP from thumb rect 0.3s cubic-bezier(.16,1,.3,1) + backdrop fade;
         chrome stagger from 0.12s / 50ms; then bounce 1→1.05→1 on inner wrap.
   Close: reverse to thumb ~0.25s ease-in-out. Reduced-motion: fade only, no bounce.
   Opacity/transform only; no 3D. */
(function () {
  'use strict';
  var box = document.getElementById('ringLightbox');
  if (!box) return;

  var stage = document.getElementById('ringLightboxStage');
  var bounce = document.getElementById('ringLightboxBounce');
  var img = document.getElementById('ringLightboxImg');
  var cap = document.getElementById('ringLightboxCap');
  var btnClose = document.getElementById('ringLightboxClose');
  var btnPrev = document.getElementById('ringLightboxPrev');
  var btnNext = document.getElementById('ringLightboxNext');
  if (!stage || !bounce || !img) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var OPEN_MS = 300;
  var CLOSE_MS = 250;
  var EASE_OUT = 'cubic-bezier(.16, 1, .3, 1)';
  var EASE_IO = 'cubic-bezier(.65, 0, .35, 1)';
  var items = [];
  var current = 0;
  var originEl = null;
  var busy = false;
  var lastFocus = null;

  if (box.parentElement !== document.body) document.body.appendChild(box);

  var SELECTOR = '#concertGallery .gallery-thumb[data-full], .sports-gallery .sports-card[data-full], #cobMfg .cob-v2-card[data-full], .cob-v2-grid .cob-v2-card[data-full]';
  function groupRoot(el) {
    return (el && (el.closest('#concertGallery') || el.closest('.sports-gallery') || el.closest('#cobMfg') || el.closest('.cob-v2-grid'))) || document;
  }
  function collect(fromEl) {
    var root = fromEl ? groupRoot(fromEl) : document;
    var sel;
    if (root.id === 'concertGallery') sel = '.gallery-thumb[data-full]';
    else if (root.classList && root.classList.contains('sports-gallery')) sel = '.sports-card[data-full]';
    else if (root.id === 'cobMfg' || (root.classList && root.classList.contains('cob-v2-grid'))) sel = '.cob-v2-card[data-full]';
    else sel = SELECTOR;
    items = Array.prototype.slice.call(root.querySelectorAll(sel)).filter(function(el){return !el.hasAttribute('data-clone');});
  }
  function thumbImg(el) { return (el && el.querySelector('img')) || el; }
  function read(el) {
    var im = thumbImg(el);
    return {
      full: el.getAttribute('data-full') || im.getAttribute('src') || '',
      alt: el.getAttribute('data-alt') || im.getAttribute('alt') || '',
      cap: el.getAttribute('data-cap') || ''
    };
  }
  /* FIX 2026-11-13 (defect 4): the old lock used body{position:fixed} + inline top:-scrollY and
     restored the scroll position with window.scrollTo on close — that restore jumped and lost the
     position. Locking with overflow:hidden on <html> only lets the browser preserve the native
     scroll position, so closing needs no restore step and cannot jump. */
  function lockScroll() {
    document.documentElement.classList.add('av-lb-lock');
  }
  function unlockScroll() {
    document.documentElement.classList.remove('av-lb-lock');
  }
  function setChrome(on) {
    var nodes = box.querySelectorAll('.ring-lb-chrome');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].style.transitionDelay = on ? (0.12 + i * 0.05) + 's' : '0s';
      nodes[i].classList.toggle('is-in', on);
    }
  }
  function resetStage() {
    stage.style.transition = 'none';
    stage.style.transform = '';
    bounce.style.transition = 'none';
    bounce.style.transform = '';
    bounce.classList.remove('is-bounce');
    box.style.transition = 'none';
    box.style.opacity = '';
  }
  function flipMatrix(rect) {
    var last = stage.getBoundingClientRect();
    if (!last.width || !last.height || !rect || !rect.width || !rect.height) return null;
    return {
      dx: rect.left + rect.width / 2 - (last.left + last.width / 2),
      dy: rect.top + rect.height / 2 - (last.top + last.height / 2),
      sx: rect.width / last.width,
      sy: rect.height / last.height
    };
  }
  function captionFor(i, data) {
    var n = (i + 1) + ' / ' + items.length;
    return data.cap ? data.cap + '  ·  ' + n : n;
  }

  function openAt(index, fromEl, visualEl) {
    if (busy) return;
    collect(fromEl);
    if (!items.length) return;
    /* index is within the active group */
    if (fromEl) {
      var gi = items.indexOf(fromEl);
      if (gi >= 0) index = gi;
    }
    current = ((index % items.length) + items.length) % items.length;
    var el = items[current];
    originEl = (visualEl && document.body.contains(visualEl)) ? visualEl : (fromEl || el);
    var rect = thumbImg(originEl).getBoundingClientRect();
    var data = read(el);
    lastFocus = document.activeElement;
    busy = true;
    cap.textContent = captionFor(current, data);
    img.alt = data.alt;

    function run() {
      box.hidden = false;
      box.classList.add('is-open');
      box.setAttribute('aria-hidden', 'false');
      try { document.dispatchEvent(new CustomEvent('av-lightbox-change', {detail:{open:true}})); } catch (err) {}
      lockScroll();
      setChrome(false);
      resetStage();

      if (reduce) {
        box.style.opacity = '0';
        void box.offsetWidth;
        box.style.transition = 'opacity .22s ease';
        box.style.opacity = '1';
        setChrome(true);
        window.setTimeout(function () { busy = false; if (btnClose) btnClose.focus({preventScroll:true}); }, 240);
        return;
      }

      box.style.opacity = '0';
      var m = flipMatrix(rect);
      if (m) {
        stage.style.transformOrigin = 'center center';
        stage.style.transform = 'translate(' + m.dx + 'px,' + m.dy + 'px) scale(' + m.sx + ',' + m.sy + ')';
      }
      void box.offsetWidth;
      box.style.transition = 'opacity ' + OPEN_MS + 'ms ' + EASE_OUT;
      stage.style.transition = 'transform ' + OPEN_MS + 'ms ' + EASE_OUT;
      box.style.opacity = '1';
      stage.style.transform = 'translate(0px,0px) scale(1,1)';
      setChrome(true);

      window.setTimeout(function () {
        /* Bounce on inner wrap so FLIP transform on stage is not clobbered */
        bounce.style.transition = 'transform .12s ' + EASE_OUT;
        bounce.style.transform = 'scale(1.05)';
        window.setTimeout(function () {
          bounce.style.transition = 'transform .14s ' + EASE_IO;
          bounce.style.transform = 'scale(1)';
          window.setTimeout(function () {
            resetStage();
            busy = false;
            if (btnClose) btnClose.focus({preventScroll:true});
          }, 150);
        }, 120);
      }, OPEN_MS);
    }

    if (img.getAttribute('src') === data.full && img.complete && img.naturalWidth) {
      run();
    } else {
      var done = false;
      var go = function () {
        if (done) return;
        done = true;
        img.onload = null;
        img.onerror = null;
        run();
      };
      img.onload = go;
      img.onerror = go;
      img.src = data.full;
      if (img.complete && img.naturalWidth) go();
    }
  }

  function closeBox() {
    if (box.hidden || busy) return;
    busy = true;
    setChrome(false);
    var rect = originEl ? thumbImg(originEl).getBoundingClientRect() : null;

    function finish() {
      box.hidden = true;
      box.classList.remove('is-open');
      box.setAttribute('aria-hidden', 'true');
      resetStage();
      img.removeAttribute('src');
      unlockScroll();
      busy = false;
      if (lastFocus && lastFocus.focus) {
        try { lastFocus.focus({preventScroll:true}); } catch (err) {}
      }
      try { document.dispatchEvent(new CustomEvent('av-lightbox-change', {detail:{open:false}})); } catch (err) {}
    }

    if (reduce || !rect) {
      box.style.transition = 'opacity .2s ease';
      box.style.opacity = '0';
      window.setTimeout(finish, 210);
      return;
    }

    resetStage();
    void stage.offsetWidth;
    var m = flipMatrix(rect);
    box.style.opacity = '1';
    stage.style.transform = 'translate(0px,0px) scale(1,1)';
    void stage.offsetWidth;
    box.style.transition = 'opacity ' + CLOSE_MS + 'ms ' + EASE_IO;
    stage.style.transition = 'transform ' + CLOSE_MS + 'ms ' + EASE_IO;
    if (m) {
      stage.style.transform = 'translate(' + m.dx + 'px,' + m.dy + 'px) scale(' + m.sx + ',' + m.sy + ')';
    }
    box.style.opacity = '0';
    window.setTimeout(finish, CLOSE_MS + 20);
  }

  function go(delta) {
    if (box.hidden || busy || items.length < 2) return;
    collect(originEl);
    current = (current + delta + items.length) % items.length;
    originEl = items[current];
    var data = read(originEl);
    img.src = data.full;
    img.alt = data.alt;
    cap.textContent = captionFor(current, data);
  }

  function bindTriggers() {
    var all = Array.prototype.slice.call(document.querySelectorAll(SELECTOR));
    all.forEach(function (el) {
      if (el.getAttribute('data-lb-bound')) return;
      el.setAttribute('data-lb-bound', '1');
      if (el.tagName !== 'BUTTON' && el.tagName !== 'A') {
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
        if (!el.getAttribute('role')) el.setAttribute('role', 'button');
      }
    });
  }

  bindTriggers();
  /* 2026-11-11: delegated open so marquee clones (cloneNode drops listeners) and taps on mobile all enlarge */
  var CLONE_SEL = '.sports-gallery .sports-card[data-clone], #cobMfg .cob-v2-card[data-clone], .cob-v2-grid .cob-v2-card[data-clone]';
  function realItem(el) {
    if (!el.hasAttribute('data-clone')) return el;
    var root = groupRoot(el);
    var im = el.querySelector('img');
    var src = im ? im.getAttribute('src') : null;
    var list = root.querySelectorAll('[data-full]:not([data-clone])');
    for (var i = 0; i < list.length; i++) {
      var li = list[i].querySelector('img');
      if (src && li && li.getAttribute('src') === src) return list[i];
    }
    return null;
  }
  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest ? (e.target.closest(SELECTOR) || e.target.closest(CLONE_SEL)) : null;
    if (!el || e.defaultPrevented) return;
    var real = realItem(el);
    if (!real) return;
    e.preventDefault();
    e.stopPropagation();
    openAt(0, real, el);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var el = e.target && e.target.closest ? e.target.closest(SELECTOR) : null;
    if (!el || el.tagName === 'BUTTON' || el.tagName === 'A' || el.getAttribute('data-lb-key')) return;
    e.preventDefault();
    openAt(0, realItem(el));
  });
  if (btnClose) btnClose.addEventListener('click', function (e) { e.stopPropagation(); closeBox(); });
  if (btnPrev) btnPrev.addEventListener('click', function (e) { e.stopPropagation(); go(-1); });
  if (btnNext) btnNext.addEventListener('click', function (e) { e.stopPropagation(); go(1); });
  box.addEventListener('click', function (e) { if (e.target === box) closeBox(); });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closeBox(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
  });
})();
