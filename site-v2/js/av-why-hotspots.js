/* WHY banner hotspots (2026-11-13): the 4 cards in the WHY image are clickable.
   Each opens a popup with that card's photo, title and detail. */
(function () {
  var DATA = window.AV_WHY_DATA || {
    mfg: {
      num: '01', title: 'Manufacturing Strength',
      img: '/images/why-popup-smt-line.jpg', more: '/factory', moreLabel: 'Tour Our Factory',
      alt: 'SMT production line in the Asia Vision factory',
      desc: '8 IC production lines and 7 SMD placement lines for consistent quality.',
      detail: 'Every panel is built in our own Shenzhen factory \u2014 in-house SMT placement, aging tests and quality control before it ships, so the screen you receive performs like the one you approved.'
    },
    rental: {
      num: '02', title: 'Rental-Ready Engineering',
      img: '/images/why-popup-concert.jpg', more: '/products/s-series', moreLabel: 'Explore Rental LED Panels',
      alt: 'Concert stage with a large LED screen in front of a live audience',
      desc: 'Designed for demanding rental and touring applications.',
      detail: 'Rental-grade cabinets for fast installation and a long lifespan, with a 3-year warranty \u2014 built to be set up, struck and shipped again and again, show after show.'
    },
    tech: {
      num: '03', title: 'Advanced LED Technology',
      img: '/images/why-popup-cob-feature.jpg', full: true, more: '/products/cob-zh', moreLabel: 'Explore COB Products',
      alt: 'Asia Vision COB chip-on-board LED \u2014 fine pitch, 170\u00b0 viewing angle, seamless flat surface',
      desc: 'COB and SMD solutions with stunning performance.',
      detail: 'COB fine-pitch series for sharp, seamless images, plus SMD options across indoor, outdoor and rental ranges \u2014 the right technology for each job, not one panel for everything.'
    },
    partner: {
      num: '04', title: 'Engineering Partnership',
      img: '/images/why-popup-booth.jpg', more: '/about', moreLabel: 'About Asia Vision',
      alt: 'Asia Vision exhibition booth with a large curved LED screen',
      desc: 'Expert support from design to after-sales service.',
      detail: 'Factory OEM support to help you expand your product line and business scope \u2014 from design and customization to installation guidance and after-sales service.'
    }
  };
  var modal = document.getElementById('whyModal');
  if (!modal) return;
  var img = document.getElementById('whyModalImg');
  var num = document.getElementById('whyModalNum');
  var title = document.getElementById('whyModalTitle');
  var desc = document.getElementById('whyModalDesc');
  var detail = document.getElementById('whyModalDetail');
  var lastFocus = null;
  var card = modal.querySelector('.why-modal-card');
  var closeTimer = null;
  function open(key, src) {
    var d = DATA[key];
    if (!d) return;
    clearTimeout(closeTimer);
    img.src = d.img;
    img.alt = d.alt;
    img.classList.add('is-full');
    modal.classList.add('is-wide');
    var more = document.getElementById('whyModalMore');
    if (more) { if (d.more) { more.href = d.more; more.textContent = (d.moreLabel || 'Learn More') + ' \u2192'; more.hidden = false; } else { more.hidden = true; } }
    num.textContent = d.num;
    title.textContent = d.title;
    desc.textContent = d.desc;
    detail.textContent = d.detail;
    lastFocus = document.activeElement;
    // start the card from the clicked hotspot so it grows out of it
    if (src && card) {
      var r = src.getBoundingClientRect();
      var dx = (r.left + r.width / 2) - window.innerWidth / 2;
      var dy = (r.top + r.height / 2) - window.innerHeight / 2;
      card.style.setProperty('--why-dx', Math.round(dx * 0.35) + 'px');
      card.style.setProperty('--why-dy', Math.round(dy * 0.35) + 'px');
    }
    modal.classList.remove('is-closing');
    modal.hidden = false;
    void modal.offsetWidth;
    modal.classList.add('is-open');
    document.documentElement.classList.add('av-lb-lock');
    var btn = modal.querySelector('.why-modal-close');
    if (btn) btn.focus({ preventScroll: true });
  }
  function close() {
    if (modal.hidden || !modal.classList.contains('is-open')) return;
    modal.classList.add('is-closing');
    modal.classList.remove('is-open');
    document.documentElement.classList.remove('av-lb-lock');
    closeTimer = setTimeout(function () {
      modal.hidden = true;
      modal.classList.remove('is-closing');
    }, 130);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  Array.prototype.forEach.call(document.querySelectorAll('.why-hotspot'), function (btn) {
    btn.addEventListener('click', function () { open(btn.getAttribute('data-why'), btn); });
  });
  Array.prototype.forEach.call(modal.querySelectorAll('[data-why-close]'), function (el) {
    el.addEventListener('click', close);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) close();
  });
  // stage spotlight: beam from the top follows the hovered / focused card
  var hero = document.getElementById('whyHero');
  if (hero) {
    var aim = function (btn) {
      var st = btn.style;
      var l = parseFloat(st.left), w = parseFloat(st.width);
      hero.style.setProperty('--tl', st.left);
      hero.style.setProperty('--tt', st.top);
      hero.style.setProperty('--tw', st.width);
      hero.style.setProperty('--th', st.height);
      hero.style.setProperty('--sx', (50 + ((l + w / 2) - 50) * 0.3).toFixed(1) + '%');
      hero.classList.add('spot-on');
    };
    Array.prototype.forEach.call(hero.querySelectorAll('.why-hotspot'), function (btn) {
      btn.addEventListener('mouseenter', function () { aim(btn); });
      btn.addEventListener('focus', function () { aim(btn); });
      btn.addEventListener('blur', function () { hero.classList.remove('spot-on'); });
    });
    hero.addEventListener('mouseleave', function () { hero.classList.remove('spot-on'); });
  }
})();
