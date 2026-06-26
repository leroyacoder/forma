// анимация страницы 404

(function () {

  var bykvi = document.querySelector('.bykvi_404');
  var kv    = document.querySelector('.kvadratiki_404');
  var txt   = document.getElementsByClassName('text_404.16')[0];
  var knopa = document.getElementsByClassName('knopa_404.18')[0];

  // парение букв
  if (bykvi) {
    (function () {
      var phY = 0.4, phX = 1.2, phR = 0.8;
      function tick() {
        var t = Date.now() * 0.00072;
        var y = Math.sin(t * 0.65 + phY) * 18;
        var x = Math.cos(t * 0.41 + phX) * 8;
        var r = Math.sin(t * 0.28 + phR) * 2.5;
        bykvi.style.translate = x.toFixed(2) + 'px ' + y.toFixed(2) + 'px';
        bykvi.style.rotate    = r.toFixed(2) + 'deg';
        requestAnimationFrame(tick);
      }
      tick();
    })();
  }

  function runEntrance() {
    if (bykvi) setTimeout(function () { bykvi.classList.add('in'); }, 100);
    if (kv)    setTimeout(function () { kv.classList.add('in'); }, 400);
    if (txt)   setTimeout(function () { txt.classList.add('in'); }, 900);
    if (knopa) setTimeout(function () { knopa.classList.add('in'); }, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runEntrance);
  } else {
    runEntrance();
  }

})();
