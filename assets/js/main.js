// 海馬博一官網 — 共用互動
(function () {
  document.documentElement.classList.add('js');

  // 行動版選單開合
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // 點選任一連結後收合選單
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 頁尾自動年份
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  // 進場動效（漸進增強：無 JS / 減少動態時內容照常顯示）
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && 'IntersectionObserver' in window) {
    var revealTargets = document.querySelectorAll(
      '.section-head, .card, .step, .traffic-pill, .faq-item, .std-block, .disclaimer, .contact-box, .why-list li'
    );
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealTargets.forEach(function (el) { io.observe(el); });
    document.querySelectorAll('.stamp-pop').forEach(function (el) { io.observe(el); });
  } else {
    // 減少動態：印章直接顯示
    document.querySelectorAll('.stamp-pop').forEach(function (el) { el.classList.add('in'); });
  }
})();
