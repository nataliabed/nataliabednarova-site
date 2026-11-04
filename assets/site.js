(function () {
  var top = document.querySelector('.to-top');
  if (top) {
    var onScroll = function () { top.classList.toggle('show', window.scrollY > 300); };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  var imgs = [].slice.call(document.querySelectorAll('img[data-zoom]'));
  if (!imgs.length || !window.HTMLDialogElement) return;

  var chevron = function (d) { return '<svg viewBox="0 0 16 24" aria-hidden="true"><path d="' + d + '"/></svg>'; };
  var d = document.createElement('dialog');
  d.setAttribute('aria-label', 'Image viewer');
  d.setAttribute('autofocus', '');
  d.tabIndex = -1;
  d.innerHTML =
    '<img alt="">' +
    '<button class="lb-prev" aria-label="Previous image">' + chevron('M13 2 3 12l10 10') + '</button>' +
    '<button class="lb-next" aria-label="Next image">' + chevron('m3 2 10 10L3 22') + '</button>' +
    '<button class="lb-close" aria-label="Close"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="m1 1 12 12M13 1 1 13"/></svg></button>';
  document.body.append(d);

  var view = d.querySelector('img'), at = 0, idle, wheelLock = 0, wheelSum = 0, touchX = null;
  var wake = function () {
    d.classList.remove('idle');
    clearTimeout(idle);
    idle = setTimeout(function () { d.classList.add('idle'); }, 2500);
  };
  var show = function (i) {
    at = (i + imgs.length) % imgs.length;
    view.src = imgs[at].src;
    view.alt = imgs[at].alt;
    [at - 1, at + 1].forEach(function (n) { new Image().src = imgs[(n + imgs.length) % imgs.length].src; });
  };
  var close = function () { d.close(); };

  imgs.forEach(function (m, i) {
    m.addEventListener('click', function () { show(i); d.showModal(); d.focus(); document.documentElement.style.overflow = 'hidden'; wake(); });
  });
  d.addEventListener('close', function () { document.documentElement.style.overflow = ''; clearTimeout(idle); });
  d.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(at - 1); wake(); });
  d.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(at + 1); wake(); });
  d.querySelector('.lb-close').addEventListener('click', close);
  view.addEventListener('click', close);
  d.addEventListener('mousemove', wake);
  d.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(at - 1); wake(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(at + 1); wake(); }
  });
  d.addEventListener('wheel', function (e) {
    e.preventDefault();
    var now = Date.now();
    if (now < wheelLock) return;
    wheelSum += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(wheelSum) < 30) return;
    show(at + (wheelSum > 0 ? 1 : -1));
    wheelSum = 0;
    wheelLock = now + 450;
    wake();
  }, { passive: false });
  d.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  d.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 50) show(at + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();
