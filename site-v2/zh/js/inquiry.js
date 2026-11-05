// ========================================
// Asia Vision — Inquiry Cart System
// ========================================

(function() {
  'use strict';

  // Detect Chinese language
  var isZH = window.location.pathname.indexOf('/zh/') === 0 || window.location.pathname.indexOf('/zh') === 0;
  var T = isZH ? {
    title: '询价清单',
    empty: '暂无产品。点击产品上的"添加"按钮。',
    items: '件产品',
    submit: '提交询价 →',
    add: '添加',
    sqm: '㎡',
    qty: '数量',
    note: '备注',
    contact: '../contact.html'
  } : {
    title: 'Inquiry Builder',
    empty: 'No items yet. Click "+ Add" on any product.',
    items: 'items',
    submit: 'Submit Inquiry →',
    add: '+ Add',
    sqm: '㎡',
    qty: 'Qty',
    note: 'Note',
    contact: 'contact.html'
  };

  // Build cart HTML
  var cartHTML =
    '<div class="av-cart-overlay" id="avCartOverlay"></div>' +
    '<div class="av-cart-slideout" id="avCartSlideout">' +
    '<div class="av-cart-header"><h3>'+T.title+'</h3><button class="av-cart-close" id="avCartClose">✕</button></div>' +
    '<div class="av-cart-body" id="avCartBody"><p class="av-cart-empty">'+T.empty+'</p></div>' +
    '<div class="av-cart-footer" id="avCartFooter" style="display:none">' +
    '<div class="av-cart-summary"><span id="avCartCount">0</span> '+T.items+'</div>' +
    '<a href="'+T.contact+'" class="av-cart-submit" id="avCartSubmit">'+T.submit+'</a>' +
    '</div></div>';

  document.body.insertAdjacentHTML('beforeend', cartHTML);

  // State
  var cart = JSON.parse(localStorage.getItem('av-inquiry-v2') || '[]');

  // CSS
  var style = document.createElement('style');
  style.textContent =
    '.av-cart-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:199;display:none}' +
    '.av-cart-overlay.open{display:block}' +
    '.av-cart-slideout{position:fixed;top:0;right:-420px;width:400px;height:100vh;background:#fff;z-index:200;box-shadow:-5px 0 30px rgba(0,0,0,.15);transition:right .3s;display:flex;flex-direction:column}' +
    '.av-cart-slideout.open{right:0}' +
    '.av-cart-header{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid #eee;background:#f9f9f9}' +
    '.av-cart-header h3{font-size:1rem;font-weight:700;color:#111}' +
    '.av-cart-close{background:none;border:none;font-size:1.3rem;cursor:pointer;color:#666}' +
    '.av-cart-body{flex:1;overflow-y:auto;padding:16px}' +
    '.av-cart-empty{color:#999;text-align:center;padding:40px 0;font-size:.85rem}' +
    '.av-cart-item{display:flex;gap:10px;margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #eee;position:relative}' +
    '.av-cart-item img{width:60px;height:45px;object-fit:contain;border-radius:4px;flex-shrink:0;background:#f5f5f5}' +
    '.av-cart-item-info{flex:1;min-width:0}' +
    '.av-cart-item-info strong{font-size:.78rem;color:#111;display:block;margin-bottom:2px}' +
    '.av-cart-item-info .av-fields{display:flex;gap:4px;flex-wrap:wrap;margin-top:6px;align-items:center}' +
    '.av-cart-item-info .av-fields input{width:48px;padding:3px 5px;border:1px solid #ddd;border-radius:3px;font-size:.66rem;text-align:center;font-family:inherit}' +
    '.av-cart-item-info .av-fields input.av-wide{width:70px}' +
    '.av-cart-item-info .av-fields span{font-size:.62rem;color:#999}' +
    '.av-cart-item-remove{position:absolute;top:0;right:0;background:none;border:none;color:#ccc;cursor:pointer;font-size:.85rem;padding:2px 4px}' +
    '.av-cart-item-remove:hover{color:#e44}' +
    '.av-cart-footer{padding:16px 20px;border-top:1px solid #eee;background:#f9f9f9}' +
    '.av-cart-summary{font-size:.75rem;color:#666;margin-bottom:8px}' +
    '.av-cart-submit{display:block;width:100%;padding:12px;background:#0098a6;color:#fff;text-align:center;border-radius:4px;text-decoration:none;font-weight:700;font-size:.84rem;transition:background .2s}' +
    '.av-cart-submit:hover{background:#007580}' +
    '.av-inquiry-btn{position:absolute;bottom:6px;right:6px;background:#0098a6;color:#fff;border:none;padding:4px 10px;border-radius:3px;font-size:.62rem;font-weight:600;cursor:pointer;z-index:3;opacity:0;transition:opacity .3s}' +
    '.prod-card:hover .av-inquiry-btn,.product-card:hover .av-inquiry-btn{opacity:1}' +
    '@media(max-width:500px){.av-cart-slideout{width:100%;right:-100%}}';

  document.head.appendChild(style);

  // Functions
  function save() { localStorage.setItem('av-inquiry-v2', JSON.stringify(cart)); }

  window.addToInquiry = function(pid, name, img) {
    var found = cart.find(function(i) { return i.id === pid; });
    if (!found) {
      cart.push({ id: pid, name: name, img: img, sqm: '10', qty: '1', note: '' });
      save();
      renderCart();
      openCart();
    }
  };

  window.removeFromInquiry = function(pid) {
    cart = cart.filter(function(i) { return i.id !== pid; });
    save();
    renderCart();
  };

  window.updateCartItem = function(pid, field, val) {
    var item = cart.find(function(i) { return i.id === pid; });
    if (item) { item[field] = val; save(); }
  };

  function renderCart() {
    var body = document.getElementById('avCartBody');
    var footer = document.getElementById('avCartFooter');
    if (cart.length === 0) {
      body.innerHTML = '<p class="av-cart-empty">'+T.empty+'</p>';
      footer.style.display = 'none';
    } else {
      document.getElementById('avCartCount').textContent = cart.length;
      footer.style.display = 'block';
      var h = '';
      cart.forEach(function(item) {
        h += '<div class="av-cart-item">' +
          '<img src="images/products/' + item.id + '.jpg" alt="' + item.name + '">' +
          '<div class="av-cart-item-info"><strong>' + item.name + '</strong>' +
          '<div class="av-fields"><span>㎡</span><input value="' + item.sqm + '" onchange="updateCartItem(\'' + item.id + '\',\'sqm\',this.value)">' +
          '<span>Qty</span><input value="' + item.qty + '" onchange="updateCartItem(\'' + item.id + '\',\'qty\',this.value)">' +
          '<input class="av-wide" value="' + item.note + '" placeholder="Note" onchange="updateCartItem(\'' + item.id + '\',\'note\',this.value)"></div></div>' +
          '<button class="av-cart-item-remove" onclick="removeFromInquiry(\'' + item.id + '\')">✕</button></div>';
      });
      body.innerHTML = h;
    }
  }

  function openCart() {
    document.getElementById('avCartSlideout').classList.add('open');
    document.getElementById('avCartOverlay').classList.add('open');
  }

  function closeCart() {
    document.getElementById('avCartSlideout').classList.remove('open');
    document.getElementById('avCartOverlay').classList.remove('open');
  }

  window.toggleCart = function() {
    var slide = document.getElementById('avCartSlideout');
    if (slide.classList.contains('open')) closeCart(); else openCart();
  };

  document.getElementById('avCartClose').addEventListener('click', closeCart);
  document.getElementById('avCartOverlay').addEventListener('click', closeCart);
  document.getElementById('avCartSubmit').addEventListener('click', function() {
    localStorage.setItem('av-inquiry-submit-v2', JSON.stringify(cart));
  });

  // Add buttons to existing product cards after they render
  function injectButtons() {
    // Homepage featured products
    document.querySelectorAll('.prod-card').forEach(function(card, i) {
      if (card.querySelector('.av-inquiry-btn')) return;
      var img = card.querySelector('img');
      var name = card.querySelector('h3');
      var pricediv = card.querySelector('.prod-info');
      if (img && name && pricediv) {
        var pid = img.src.split('/').pop().replace('.jpg', '');
        var btn = document.createElement('button');
        btn.className = 'av-inquiry-btn';
        btn.textContent = T.add;
        btn.onclick = function(e) { e.preventDefault(); e.stopPropagation(); addToInquiry(pid, name.textContent, img.src); };
        pricediv.appendChild(btn);
      }
    });

    // Products page cards
    document.querySelectorAll('.product-card, [class*="prod-card"]').forEach(function(card) {
      if (card.querySelector('.av-inquiry-btn')) return;
      var img = card.querySelector('img');
      var name = card.querySelector('h3');
      if (img && name) {
        var pid = img.src.split('/').pop().replace('.jpg', '');
        var btn = document.createElement('button');
        btn.className = 'av-inquiry-btn';
        btn.textContent = T.add;
        btn.onclick = function(e) { e.preventDefault(); e.stopPropagation(); addToInquiry(pid, name.textContent, img.src); };
        card.style.position = 'relative';
        card.appendChild(btn);
      }
    });
  }

  // Initial render + inject after DOM ready
  renderCart();
  setTimeout(injectButtons, 500);
  document.addEventListener('DOMContentLoaded', function() { setTimeout(injectButtons, 300); });

  // Wire header cart icon
  var cartIcon = document.querySelector('.header-actions button:nth-child(2)');
  if (cartIcon) {
    cartIcon.addEventListener('click', function(e) { e.preventDefault(); openCart(); });
  }
})();

// Immediate injection
injectButtons();
setTimeout(injectButtons, 800);
setTimeout(injectButtons, 2000);
