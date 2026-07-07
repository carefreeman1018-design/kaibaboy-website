// 海馬博一官網 — 共用互動
(function () {
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
})();
