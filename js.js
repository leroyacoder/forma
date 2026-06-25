// кнопка "узнать наше видение" — скролл к следующему блоку
(function () {
  var btn = document.querySelector('.knopa_main\\.18');
  var target = document.querySelector('.lipkiy-wrapper');
  if (!btn || !target) return;
  btn.addEventListener('click', function () {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

// анимация секций по скролу

(function () {

  var wrapper = document.querySelector('.lipkiy-wrapper');

  var blocks = [
    document.querySelector('.mainblock2'),
    document.querySelector('.mainblock3'),
    document.querySelector('.mainblock4'),
  ];

  var previews = [
    document.querySelector('.preview_about'),
    document.querySelector('.preview_shop'),
    document.querySelector('.preview_ivents'),
  ];

  var squares = [
    document.querySelector('.kvadratiki_preview_about'),
    document.querySelector('.kvadratiki_preview_shop'),
    document.querySelector('.kvadratiki_preview_ivents'),
  ];

  var texts = [
    document.querySelector('.text_preview_about\\.16'),
    document.querySelector('.text_preview_shop\\.16'),
    document.querySelector('.text_preview_ivents\\.16'),
  ];

  var decors = [
    [
      { el: document.querySelector('.decor_about1'),  dx:  34,  dy:  9.5 },
      { el: document.querySelector('.decor_about2'),  dx:  25,  dy: -2.5 },
      { el: document.querySelector('.decor_about3'),  dx: -23,  dy:  1   },
      { el: document.querySelector('.decor_about4'),  dx: -32,  dy: -9.5 },
    ],
    [
      { el: document.querySelector('.decor_shop1'),   dx:  34,  dy:  9.5 },
      { el: document.querySelector('.decor_shop2'),   dx:  25,  dy: -1.5 },
      { el: document.querySelector('.decor_shop3'),   dx: -24,  dy: -1   },
      { el: document.querySelector('.decor_shop4'),   dx: -33,  dy: -12  },
    ],
    [
      { el: document.querySelector('.decor_ivents1'), dx:  31,  dy:  8.5 },
      { el: document.querySelector('.decor_ivents2'), dx:  23,  dy: -4   },
      { el: document.querySelector('.decor_ivents3'), dx: -24,  dy: -0.5 },
      { el: document.querySelector('.decor_ivents4'), dx: -29,  dy: -11  },
    ],
  ];

  var rotations = [
    [0,      3.74,  -11.92,  0   ],
    [14.04, -24.35,  0,      0   ],
    [0,      0,    -15.18,   5.4 ],
  ];

  if (!blocks[0] || !wrapper) return;

  var played = [false, false, false];

  // Текущий прогресс скролла внутри wrapper (0→1)
  function getProgress() {
    var rect = wrapper.getBoundingClientRect();
    return Math.max(0, Math.min(1, -rect.top / (wrapper.offsetHeight - window.innerHeight)));
  }

  // Локальный прогресс блока i внутри его 1/3 диапазона (0→1)
  // Блок 0: global 0.000→0.333  Блок 1: 0.333→0.667  Блок 2: 0.667→1.000
  // Это гарантирует строгую последовательность: блок i+1 начинается
  // ровно тогда, когда блок i заканчивается.
  function getLocal(i) {
    return Math.max(0, Math.min(1, (getProgress() - i / 3) * 3));
  }

  // Кубическая ease-in-out: медленный старт, медленный конец
  function ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Значение 0→1, пока loc идёт от a до b (с easing)
  function ph(loc, a, b) {
    if (loc <= a) return 0;
    if (loc >= b) return 1;
    return ease((loc - a) / (b - a));
  }

  function tick() {
    var vw = window.innerWidth / 100;

    for (var i = 0; i < 3; i++) {
      var loc = getLocal(i);

      // Фазы (доли от 0 до 1 внутри блока):
      //  0.00→0.20  — контент появляется с погружением  (fi: 0→1)
      //  0.20→0.37  — декор выплывает                   (ds: 0→1)
      //  0.37→0.63  — статика + парение декора
      //  0.63→0.80  — декор заплывает обратно           (ds: 1→0)
      //  0.80→1.00  — контент уходит с погружением      (fo: 0→1)

      var fi = ph(loc, 0.00, 0.20);
      var fo = ph(loc, 0.80, 1.00);
      var ds = Math.min(
        ph(loc, 0.20, 0.37),
        1 - ph(loc, 0.63, 0.80)
      );

      var vis = fi * (1 - fo);

      // звук
      if (!played[i] && vis > 0.15) {
        played[i] = true;
        if (window.playSound) window.playSound('plashki');
      }
      if (played[i] && vis < 0.05) {
        played[i] = false;
      }

      // блок
      blocks[i].style.opacity       = Math.max(0, vis).toFixed(3);
      blocks[i].style.pointerEvents  = vis > 0.5 ? 'auto' : 'none';

      // ── ПРЕВЬЮ — эффект погружения: выплывает снизу из глубины ──
      if (previews[i]) {
        // scale: 1.12→1.0 при появлении (выходит из глубины), 1.0→0.93 при уходе
        var pvScale = 1 + (1 - fi) * 0.12 - fo * 0.07;
        // blur: 18px→0 при появлении, 0→12px при уходе
        var pvBlur  = (1 - fi) * 18 + fo * 12;
        // clipPath — шторка снизу вверх при появлении, сверху при уходе
        previews[i].style.clipPath =
          'inset(' + (fo * 100).toFixed(1) + '% 0 ' + ((1 - fi) * 100).toFixed(1) + '% 0)';
        previews[i].style.filter = 'blur(' + pvBlur.toFixed(1) + 'px)';
        if (i !== 1) {
          previews[i].style.transform =
            'scale(' + pvScale.toFixed(4) + ') translateY(' + ((1 - fi) * 100 - fo * 80).toFixed(1) + 'px)';
        } else {
          previews[i].style.transform = 'scale(' + pvScale.toFixed(4) + ')';
        }
      }

      // ── КВАДРАТИКИ — чуть позже превью, те же глубина и масштаб ──
      if (squares[i]) {
        var sqScale = 1 + (1 - fi) * 0.09 - fo * 0.05;
        squares[i].style.clipPath =
          'inset(' + (fo * 100).toFixed(1) + '% 0 ' + ((1 - fi) * 100).toFixed(1) + '% 0)';
        squares[i].style.transform =
          'scale(' + sqScale.toFixed(4) + ') translateY(' + ((1 - fi) * 75 - fo * 55).toFixed(1) + 'px)';
        squares[i].style.opacity = Math.max(0, vis).toFixed(3);
      }

      // ── ТЕКСТ — самый медленный, с глубоким blur ──
      if (texts[i]) {
        var txScale = 1 + (1 - fi) * 0.06 - fo * 0.04;
        var txBlur  = (1 - fi) * 14 + fo * 9;
        texts[i].style.transform =
          'scale(' + txScale.toFixed(4) + ') translateY(' + ((1 - fi) * 55 - fo * 45).toFixed(1) + 'px)';
        texts[i].style.filter  = 'blur(' + txBlur.toFixed(1) + 'px)';
        texts[i].style.opacity = Math.max(0, vis).toFixed(3);
      }

      // ── ДЕКОР — позиционирование через scroll (парение — отдельный IIFE) ──
      decors[i].forEach(function (d, j) {
        if (!d.el) return;
        var r  = rotations[i][j];
        var tx = (1 - ds) * d.dx * vw;
        var ty = (1 - ds) * d.dy * vw;
        d.el.style.opacity   = ds.toFixed(3);
        d.el.style.transform =
          (r ? 'rotate(' + r + 'deg) ' : '') +
          'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px)';
      });
    }

    requestAnimationFrame(tick);
  }

  tick();

})();


// бегущая строка

(function () {

  var beg = document.querySelector('.begstrock');
  if (!beg) return;

  // беспрерывность
  var track = document.createElement('div');
  track.className = 'begstrock-track';
  beg.parentNode.insertBefore(track, beg);
  track.appendChild(beg);

  var clone = document.createElement('img');
  clone.src = beg.src;
  clone.className = 'begstrock';
  clone.alt = '';
  clone.setAttribute('aria-hidden', 'true');
  track.appendChild(clone);

  // сожержание
  var items = [
    ['НЕЗРИМЫЙ<br>ВЕС', 'подвеска //'],
    ['САМОСТЬ',         'кольцо //'],
    ['НАВИ',            'браслет //'],
    ['КРИСТАЛЛ',        'кольцо //'],
    ['ЧАСТИЦЫ<br>ОКЕАНА','подвеска //'],
    ['ФОРМУЛА',         'моно-серьга //'],
    ['КАПЛИ<br>ДОЖДЯ',  'брелок //'],
    ['СИМФОНИЯ',        'карабин //'],
    ['САМОСТЬ 2',       'кольцо //'],
  ];

  var slotVw = 15.764;
  var productMap = [1,2,3,6,5,4,7,8,9];
  var hasPopup = !!document.querySelector('.popup');

  // наведение
  [0, 1].forEach(function (copy) {
    items.forEach(function (item, i) {
      var hz = document.createElement('div');
      hz.className = 'beg-hz';
      hz.style.left = (copy * 141.88 + i * slotVw).toFixed(3) + 'vw';

      var plashka = document.createElement('div');
      plashka.className = 'beg-plashka';
      plashka.innerHTML =
        '<div class="beg-plashka-type">' + item[1] + '</div>' +
        '<div class="beg-plashka-name">' + item[0] + '</div>';
      hz.appendChild(plashka);
      var productNum = productMap[i];
      hz.style.cursor = 'pointer';
      hz.addEventListener('click', function () {
        if (hasPopup) {
          if (window.openPopup) window.openPopup(productNum);
        } else {
          window.location.href = './shop.html?product=' + productNum + '&ref=main';
        }
      });
      track.appendChild(hz);
    });
  });

})();


// парение декора

(function () {

  var all = [
    document.querySelector('.decor_about1'),
    document.querySelector('.decor_about2'),
    document.querySelector('.decor_about3'),
    document.querySelector('.decor_about4'),
    document.querySelector('.decor_shop1'),
    document.querySelector('.decor_shop2'),
    document.querySelector('.decor_shop3'),
    document.querySelector('.decor_shop4'),
    document.querySelector('.decor_ivents1'),
    document.querySelector('.decor_ivents2'),
    document.querySelector('.decor_ivents3'),
    document.querySelector('.decor_ivents4'),
  ];

  // Фазы Y (основное парение)
  var phY = [0,    1.4,  2.1,  0.7,  0.5,  1.8,  0.3,  2.4,  1.1,  0.2,  1.9,  0.8];
  // Фазы X (горизонтальное смещение — другая частота)
  var phX = [0.8,  2.2,  0.3,  1.6,  1.1,  0.5,  2.0,  0.9,  1.7,  2.5,  0.4,  1.3];
  // Фазы вращения (самая медленная)
  var phR = [1.5,  0.4,  1.9,  0.2,  2.3,  1.0,  0.7,  1.8,  0.3,  1.4,  2.1,  0.6];

  function tick() {
    var t = Date.now() * 0.00072;
    all.forEach(function (el, i) {
      if (!el) return;
      var spd = 0.75 + i * 0.08;                              // у каждого своя скорость
      var y   = Math.sin(t * spd            + phY[i]) * 24;  // верт. парение ±24px
      var x   = Math.cos(t * (spd * 0.62)  + phX[i]) * 10;  // гориз. дрейф ±10px
      var rot = Math.sin(t * (spd * 0.38)  + phR[i]) * 5;   // вращение ±5°
      el.style.translate = x.toFixed(2) + 'px ' + y.toFixed(2) + 'px';
      el.style.rotate    = rot.toFixed(2) + 'deg';
    });
    requestAnimationFrame(tick);
  }

  tick();

})();


// анимация рамок и текста подвала

(function () {
  var elements = [1, 2, 3].map(function (n) {
    return document.querySelector('.ramka_podval' + n + ', .ramka_podval_black' + n);
  }).filter(Boolean);
  if (!elements.length) return;

  var textGroups = [
    ['text_podval_ramka1_1.18', 'text_podval_ramka1_2.18',
     'text_podval_ramka1_3.18', 'text_podval_ramka1_4.18'],
    ['text_podval_ramka2_16'],
    ['text_podval_ramka3_16'],
  ].map(function (names) {
    var els = [];
    names.forEach(function (name) {
      var found = document.getElementsByClassName(name);
      for (var j = 0; j < found.length; j++) els.push(found[j]);
    });
    return els;
  });

  var observer = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return;
    elements.forEach(function (el, i) {
      setTimeout(function () { el.classList.add('podval-in-ramka'); }, i * 200);
      var texts = textGroups[i] || [];
      texts.forEach(function (txt) {
        setTimeout(function () { txt.classList.add('podval-in-text'); }, i * 200 + 600);
      });
    });
    observer.disconnect();
  }, { threshold: 0.15 });

  observer.observe(elements[0].closest('section') || elements[0]);
})();
