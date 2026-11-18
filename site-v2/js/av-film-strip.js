/* 2026-11-15 David: concert gallery under WHY = ONE connected loop over two rows.
   Carousel ring (David 21:41): top row moves RIGHT, bottom row moves LEFT. The image leaving the top row's right
   edge drops into the bottom row's right end; the one leaving the bottom row's left edge rises to the top row's left.
   Ring position p: top slots left->right are p=start..start+len-1; bottom slots right->left continue the ring.
   Extensible: add more <button class="gallery-thumb"> to .gallery-thumbs in index.html, nothing else to change.
   Originals stay (hidden) in .film-store so the lightbox still sees every image in order; visible items are clones. */
(function () {
  var root = document.getElementById('concertGallery');
  if (!root) return;
  var src = root.querySelector('.gallery-thumbs');
  if (!src) return;
  var originals = Array.prototype.slice.call(src.querySelectorAll(':scope > .gallery-thumb:not([data-clone])'));
  var n = originals.length;
  if (!n) return;
  var STEP_MS = 2600, MOVE_MS = 700;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ROWS = n >= 4 ? 2 : 1;
  var per = Math.ceil(n / ROWS);
  var wrap = document.createElement('div');
  wrap.className = 'film-rows';
  src.parentNode.insertBefore(wrap, src);
  var store = document.createElement('div');
  store.className = 'film-store';
  store.hidden = true;
  root.appendChild(store);
  originals.forEach(function (o) { store.appendChild(o); });

  function mod(a) { return ((a % n) + n) % n; }
  function makeClone(i) {
    var c = originals[mod(i)].cloneNode(true);
    c.setAttribute('data-clone', '1');
    return c;
  }

  var rows = [];
  for (var r = 0; r < ROWS; r++) {
    var start = r * per;
    var len = ROWS === 1 ? Math.max(n, 4) : Math.min(per, n - start);
    if (len <= 0) continue;
    var strip = document.createElement('div');
    strip.className = 'film-strip ' + (r % 2 ? 'film-rev' : 'film-fwd');
    var track;
    if (r === 0) { track = src; } else {
      track = document.createElement('div');
      track.className = 'gallery-thumbs';
      track.setAttribute('role', 'list');
      track.setAttribute('aria-label', src.getAttribute('aria-label') || 'Gallery');
    }
    track.classList.add('film-track', 'is-step');
    strip.appendChild(track);
    wrap.appendChild(strip);
    rows.push({ strip: strip, track: track, start: start, len: len });
  }
  root.classList.add('is-film');

  var g = 0; // ring shift: ring position p shows item (p - g)
  function isRev(row) { return rows.indexOf(row) % 2 === 1; }
  // node j of a row: forward rows hold ring p = start + j - 1; reversed rows (right-to-left) hold p = start + len - j
  function itemAt(row, j) { return isRev(row) ? (row.start + row.len - j - g) : (row.start + j - 1 - g); }
  function mark(row) {
    Array.prototype.forEach.call(row.track.children, function (c, j) {
      var vis = j >= 1 && j <= row.len;
      if (vis) { c.removeAttribute('aria-hidden'); c.removeAttribute('tabindex'); c.setAttribute('role', 'listitem'); }
      else { c.setAttribute('aria-hidden', 'true'); c.setAttribute('tabindex', '-1'); c.removeAttribute('role'); }
    });
  }
  rows.forEach(function (row) {
    row.track.innerHTML = '';
    // node j shows item (start + j - 1 - g): j=0 prefix (hidden, left), 1..len visible, len+1 suffix (hidden, right)
    for (var j = 0; j < row.len + 2; j++) row.track.appendChild(makeClone(itemAt(row, j)));
    mark(row);
  });

  function frameW(t) { var a = t.children[0], b = t.children[1]; return b ? (b.offsetLeft - a.offsetLeft) : a.offsetWidth; }
  function fit() {
    var w = wrap.clientWidth;
    var mobile = window.innerWidth <= 600;
    var vis = mobile ? 1.6 : 4;
    rows.forEach(function (row) {
      var gap = parseFloat(getComputedStyle(row.track).columnGap) || 0;
      var fw = (w - gap * (Math.ceil(vis) - 1)) / vis;
      row.track.style.setProperty('--fw', fw.toFixed(2) + 'px');
      // a short last row shows only its own slots, so the hand-off item is never visible in an empty slot
      row.strip.style.width = (!mobile && row.len < 4) ? (row.len * fw + (row.len - 1) * gap).toFixed(2) + 'px' : '';
    });
  }
  function place(row, animate) {
    row.track.style.transition = animate && !reduce ? 'transform ' + MOVE_MS + 'ms cubic-bezier(.65,0,.35,1)' : 'none';
    var fw = frameW(row.track);
    row.track.style.transform = 'translate3d(' + (animate ? (isRev(row) ? -2 * fw : 0) : -fw) + 'px,0,0)';
  }
  fit();
  rows.forEach(function (row) { place(row, false); });

  var busy = false;
  function step() {
    if (document.hidden || busy) return;
    busy = true;
    rows.forEach(function (row) { place(row, true); });
    setTimeout(function () {
      g++;
      rows.forEach(function (row) {
        row.track.style.transition = 'none';
        if (isRev(row)) {
          row.track.removeChild(row.track.firstChild);
          row.track.appendChild(makeClone(itemAt(row, row.len + 1)));
        } else {
          row.track.removeChild(row.track.lastChild);
          row.track.insertBefore(makeClone(itemAt(row, 0)), row.track.firstChild);
        }
        mark(row);
        row.track.style.transform = 'translate3d(' + (-frameW(row.track)) + 'px,0,0)';
      });
      busy = false;
    }, (reduce ? 0 : MOVE_MS) + 30);
  }
  setInterval(step, STEP_MS);
  window.addEventListener('resize', function () { fit(); rows.forEach(function (row) { place(row, false); }); });
})();
