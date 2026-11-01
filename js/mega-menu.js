/* =====================================================
   Asia Vision — Products Mega Menu
   Vanilla JS, no dependencies. Progressive enhancement:
   all links are real <a href> in the static HTML; this
   script only wires up hover/tap/keyboard behaviour.
   ===================================================== */
(function () {
  'use strict';

  function init() {
    initDesktopMegaMenu();
    initMobileSubmenu();
  }

  /* ---------- Desktop mega menu ---------- */
  function initDesktopMegaMenu() {
    var items = document.querySelectorAll('.nav-item.has-mega');
    if (!items.length) return;

    items.forEach(function (item) {
      var toggle = item.querySelector('.mega-toggle');
      var menu = item.querySelector('.mega-menu');
      if (!toggle || !menu) return;

      var closeTimer = null;

      function openMenu() {
        clearTimeout(closeTimer);
        item.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        clampMenu(menu);
      }

      function closeMenu() {
        clearTimeout(closeTimer);
        closeTimer = setTimeout(function () {
          item.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }, 160);
      }

      // Hover (fine pointers)
      item.addEventListener('mouseenter', openMenu);
      item.addEventListener('mouseleave', closeMenu);

      // Tap (coarse pointers / touch laptops): toggle without navigating.
      // On mouse-driven desktop the click still follows the href normally.
      toggle.addEventListener('click', function (e) {
        if (window.matchMedia('(pointer: coarse)').matches) {
          e.preventDefault();
          if (item.classList.contains('open')) {
            closeMenu();
          } else {
            openMenu();
          }
        }
      });

      // Escape closes and returns focus to the toggle
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && item.classList.contains('open')) {
          closeMenu();
          toggle.focus();
        }
      });
    });

    initCategoryPreview();
  }

  /* Hovering / focusing a category swaps the preview + product list.
     Content is static HTML; we only toggle an .is-active class. */
  function initCategoryPreview() {
    var menus = document.querySelectorAll('.mega-menu');
    menus.forEach(function (menu) {
      var cats = menu.querySelectorAll('.mega-cat');
      cats.forEach(function (cat) {
        cat.addEventListener('mouseenter', function () {
          activateCategory(menu, cat.getAttribute('data-cat'));
        });
        cat.addEventListener('focus', function () {
          activateCategory(menu, cat.getAttribute('data-cat'));
        });
      });
    });
  }

  function activateCategory(menu, key) {
    if (!key) return;
    menu.querySelectorAll('.mega-cat').forEach(function (c) {
      c.classList.toggle('is-active', c.getAttribute('data-cat') === key);
    });
    menu.querySelectorAll('.mega-panel').forEach(function (p) {
      p.classList.toggle('is-active', p.getAttribute('data-cat') === key);
    });
  }

  /* Keep the panel inside the viewport (Products sits left-of-centre,
     so a centred 960px panel would overflow on the right). */
  function clampMenu(menu) {
    menu.style.left = '50%';
    menu.style.transform = 'translateX(-50%)';
    var r = menu.getBoundingClientRect();
    var vw = document.documentElement.clientWidth || window.innerWidth;
    var margin = 16;
    var shift = 0;
    if (r.left < margin) {
      shift = margin - r.left;
    } else if (r.right > vw - margin) {
      shift = (vw - margin) - r.right;
    }
    if (shift !== 0) {
      menu.style.transform = 'translateX(calc(-50% + ' + shift + 'px))';
    }
  }

  /* ---------- Mobile (hamburger) submenu ---------- */
  function initMobileSubmenu() {
    var groups = document.querySelectorAll('.mnav-group');
    groups.forEach(function (group) {
      var parent = group.querySelector('.mnav-parent');
      if (!parent) return;

      parent.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var wasOpen = group.classList.contains('open');

        // Close sibling groups first
        var nav = group.closest('.mobile-nav');
        if (nav) {
          nav.querySelectorAll('.mnav-group.open').forEach(function (g) {
            g.classList.remove('open');
            var p = g.querySelector('.mnav-parent');
            if (p) p.setAttribute('aria-expanded', 'false');
          });
        }

        if (wasOpen) {
          parent.setAttribute('aria-expanded', 'false');
        } else {
          group.classList.add('open');
          parent.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
