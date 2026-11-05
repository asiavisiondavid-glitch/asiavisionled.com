// Asia Vision — site search over products and all blog articles.
// Overrides the page's inline doSearch() so search covers the full library,
// not just the 12 product cards. Index is lazy-loaded on first search.
(function () {
  var IDX = null, LOADING = false, PENDING = false;

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  function load() {
    if (IDX || LOADING) return;
    LOADING = true;
    fetch('/search-index.json')
      .then(function (r) { return r.json(); })
      .then(function (d) { IDX = d; LOADING = false; if (PENDING) { PENDING = false; run(); } })
      .catch(function () { LOADING = false; });
  }

  function score(item, q) {
    var t = (item.t || '').toLowerCase(), d = (item.d || '').toLowerCase();
    if (t.indexOf(q) === 0) return 0;
    if (t.indexOf(q) > -1) return 1;
    if (item.c === 'Product' && d.indexOf(q) > -1) return 2;
    if (d.indexOf(q) > -1) return 3;
    return -1;
  }

  function render(q) {
    var box = document.getElementById('searchResults');
    if (!box) return;
    if (!q) { box.innerHTML = ''; return; }
    if (!IDX) { box.innerHTML = '<p style="padding:16px;text-align:center;opacity:.6">Loading…</p>'; return; }

    var hits = [];
    for (var i = 0; i < IDX.length; i++) {
      var s = score(IDX[i], q);
      if (s > -1) hits.push({ s: s, a: IDX[i] });
    }
    hits.sort(function (x, y) { return x.s - y.s || x.a.t.length - y.a.t.length; });

    if (!hits.length) {
      box.innerHTML = '<p style="padding:16px;text-align:center;opacity:.6">No results for "' + esc(q) + '". Try "COB", "rental", "outdoor", "import" or <a href="/contact" style="color:#ff6b35">contact us</a>.</p>';
      return;
    }
    var n = Math.min(hits.length, 24), h = '';
    for (var j = 0; j < n; j++) {
      var a = hits[j].a;
      h += '<a href="' + esc(a.u) + '" style="display:block;padding:10px 12px;border-bottom:1px solid rgba(128,128,128,.18);text-decoration:none">'
         + '<div style="font-size:.7rem;letter-spacing:.05em;text-transform:uppercase;opacity:.55">' + esc(a.c) + '</div>'
         + '<strong style="display:block;font-size:.95rem">' + esc(a.t) + '</strong>'
         + (a.d ? '<small style="opacity:.65;display:block;line-height:1.35">' + esc(a.d.slice(0, 110)) + (a.d.length > 110 ? '…' : '') + '</small>' : '')
         + '</a>';
    }
    if (hits.length > n) h += '<p style="padding:10px 12px;font-size:.8rem;opacity:.6">+ ' + (hits.length - n) + ' more results — refine your search.</p>';
    box.innerHTML = h;
  }

  function run() {
    var inp = document.getElementById('searchInput');
    if (!inp) return;
    var q = inp.value.toLowerCase().trim();
    if (!q) { render(''); return; }
    if (!IDX) { PENDING = true; load(); }
    render(q);
  }

  // Override whatever the page defined.
  window.doSearch = run;

  document.addEventListener('DOMContentLoaded', function () {
    var inp = document.getElementById('searchInput');
    if (inp && !inp.dataset.idxBound) {
      inp.dataset.idxBound = '1';
      inp.addEventListener('focus', load, { once: true });
      inp.addEventListener('input', run);
    }
  });
})();
