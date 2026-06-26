// анимация первого экрана мероприятия

(function () {

  var bykvi = document.querySelector('.events_bykvi');
  var kv    = document.querySelector('.kvadratiki_events');
  var txt   = document.getElementsByClassName('text_events.16')[0];
  var knopa = document.getElementsByClassName('knopa_events.18')[0];

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
    if (bykvi) setTimeout(function () { bykvi.classList.add('events1-in'); }, 100);
    if (kv)    setTimeout(function () { kv.classList.add('events1-in'); if (window.playSound) window.playSound('plashki'); }, 1100);
    if (txt)   setTimeout(function () { txt.classList.add('events1-in'); if (window.playSound) window.playSound('tekst'); }, 1500);
    if (knopa) setTimeout(function () { knopa.classList.add('events1-in'); }, 1800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runEntrance);
  } else {
    runEntrance();
  }

})();

// буквы мероприятия — клик/ховер/звуки

(function () {
  var bykvi = document.querySelector('.events_bykvi');
  var target = document.querySelector('.eventsblock2');
  if (!bykvi) return;
  bykvi.addEventListener('mouseenter', function () {
    if (window.playSound) window.playSound('hover');
  });
  bykvi.addEventListener('click', function () {
    if (window.playSound) window.playSound('perehod');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

// кнопка [ ПРИЙТИ В ГОСТИ ] — скролл к следующему блоку

(function () {
  var btn = document.querySelector('.knopa_events\\.18');
  var target = document.querySelector('.eventsblock2');
  if (!btn || !target) return;
  btn.addEventListener('mouseenter', function () {
    if (window.playSound) window.playSound('hover');
  });
  btn.addEventListener('click', function () {
    if (window.playSound) window.playSound('perehod');
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

// анимация постеров

(function () {

  var blocks = [
    {
      section: document.querySelector('.eventsblock2'),
      img: document.querySelector('.event1'),
      texts: [
        document.getElementsByClassName('text_event1.32')[0],
        document.getElementsByClassName('text_event1.1.18')[0],
        document.getElementsByClassName('text_event1.2.18')[0],
        document.getElementsByClassName('text_event1.16')[0],
        document.getElementsByClassName('knopa_event1.32')[0],
      ],
    },
    {
      section: document.querySelector('.eventsblock3'),
      img: document.querySelector('.event2'),
      texts: [
        document.getElementsByClassName('text_event2.32')[0],
        document.getElementsByClassName('text_event2.1.18')[0],
        document.getElementsByClassName('text_event2.2.18')[0],
        document.getElementsByClassName('text_event2.16')[0],
        document.getElementsByClassName('knopa_event2.32')[0],
      ],
    },
    {
      section: document.querySelector('.eventsblock4'),
      img: document.querySelector('.event3'),
      texts: [
        document.getElementsByClassName('text_event3.32')[0],
        document.getElementsByClassName('text_event3.1.18')[0],
        document.getElementsByClassName('text_event3.2.18')[0],
        document.getElementsByClassName('text_event3.16')[0],
        document.getElementsByClassName('knopa_event3.32')[0],
      ],
    },
  ];

  // начальное состояние постеров

  blocks.forEach(function (b) {
    b.progress = 0;
    b.done = false;
    b.textsFired = false;
    b.soundPlayed = false;
    if (b.img) {
      b.img.style.clipPath = 'inset(0% 0 100% 0)';
      b.img.style.transform = 'translateY(60px)';
    }
  });

  function tick() {
    blocks.forEach(function (b) {
      if (b.done || !b.img) return;

      var triggerEl = b.section || b.img;
      var rect = triggerEl.getBoundingClientRect();
      var inView = rect.top < window.innerHeight * 0.8;

      if (inView) {
        b.progress += 0.009; 
        if (b.progress > 1) b.progress = 1;
      }

      if (!b.soundPlayed && b.progress >= 0.05) {
        b.soundPlayed = true;
        var skipSound = b.img && b.img.classList.contains('event1') && window._skipEvent1Plashki;
        if (!skipSound && window.playSound) window.playSound('plashki');
      }

      if (b.progress > 0.999) {
        b.progress = 1;
        b.done = true;
        b.img.style.transform = ''; 
      }

      b.img.style.clipPath = 'inset(0% 0 ' + ((1 - b.progress) * 100).toFixed(1) + '% 0)';
      b.img.style.transform = 'translateY(' + ((1 - b.progress) * 60).toFixed(1) + 'px)';

      // анимация текстов

      if (!b.textsFired && b.progress >= 0.85) {
        b.textsFired = true;
        b.texts.forEach(function (el, i) {
          if (!el) return;
          setTimeout(function () {
            el.classList.add('event-in-text');
            if (i === 0 && window.playSound) window.playSound('tekst');
          }, i * 180);
        });
      }
    });

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

})();




// анимация первого экрана — идентично shop

(function () {

  var bykvi = document.querySelector('.events_bykvi');
  var kv    = document.querySelector('.kvadratiki_events');
  var txt   = document.getElementsByClassName('text_events.16')[0];
  var knopa = document.getElementsByClassName('knopa_events.18')[0];

  // парение букв — идентичные параметры как у shop_bykvi
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

  // появление при загрузке — те же задержки что и на shop
  function runEntrance() {
    if (bykvi) setTimeout(function () { bykvi.classList.add('events1-in'); }, 100);
    if (kv)    setTimeout(function () { kv.classList.add('events1-in'); if (window.playSound) window.playSound('plashki'); }, 400);
    if (txt)   setTimeout(function () { txt.classList.add('events1-in'); if (window.playSound) window.playSound('tekst'); }, 900);
    if (knopa) setTimeout(function () { knopa.classList.add('events1-in'); }, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runEntrance);
  } else {
    runEntrance();
  }

})();


// кнопка "прийти в гости" — скролл к мероприятиям

(function () {
  var btn    = document.querySelector('.knopa_events\\.18');
  var target = document.querySelector('.eventsblock2');
  if (!btn || !target) return;
  btn.addEventListener('mouseenter', function () {
    if (window.playSound) window.playSound('hover');
  });
  btn.addEventListener('click', function () {
    window._skipEvent1Plashki = true;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();


// навигация меню и звук ховера

(function () {

  var navItems = [
    { sel: '.text_meny1', href: './index.html' },
    { sel: '.eventsblock1 .text_meny2:nth-child(3)', href: './about.html' },
    { sel: '.text_meny3', href: './shop.html' },
    { sel: '.eventsblock1 .text_meny2:nth-child(5)', href: './events.html' },
  ];

  var podvalItems = [
    { sel: '.mainpodval .text_podval_ramka1_1\\.18', href: './index.html' },
    { sel: '.mainpodval .text_podval_ramka1_2\\.18', href: './about.html' },
    { sel: '.mainpodval .text_podval_ramka1_3\\.18:nth-child(6)', href: './shop.html' },
    { sel: '.mainpodval .text_podval_ramka1_3\\.18:nth-child(7)', href: './events.html' },
  ];

  navItems.concat(podvalItems).forEach(function (item) {
    var el = document.querySelector(item.sel);
    if (!el) return;
    el.style.cursor = 'pointer';
    el.addEventListener('mouseenter', function () {
      if (window.playSound) window.playSound('hover');
    });
    el.addEventListener('click', function () {
      window.location.href = item.href;
    });
  });

})();


// попап — открытие, переход и закрытие

(function () {

  var overlay  = document.getElementById('popupOverlay');
  var popup1   = document.getElementById('popup1');
  var popup2   = document.getElementById('popup2');
  var emailInput = document.getElementById('popupEmail');
  var knopaSend  = document.getElementById('knopaSend');
  var knopaBack  = document.getElementById('knopa_popup2');

  if (!overlay) return;

  // разблокировка кнопки отправки при вводе
  if (emailInput && knopaSend) {
    emailInput.addEventListener('input', function () {
      if (emailInput.value.trim().length > 0) {
        knopaSend.classList.add('active');
      } else {
        knopaSend.classList.remove('active');
      }
    });
  }

  function openPopup() {
    popup2.classList.remove('popup2-visible');
    popup1.style.opacity = '0';
    popup1.style.transform = 'translateY(1.5vw)';
    overlay.style.display = 'flex';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.classList.add('popup-visible');
        popup1.style.opacity = '';
        popup1.style.transform = '';
      });
    });
    // сбросить инпут и кнопку
    if (emailInput) emailInput.value = '';
    if (knopaSend) knopaSend.classList.remove('active');
  }

  function switchToPopup2() {
    if (!emailInput || emailInput.value.trim().length === 0) return;
    // скрыть попап 1
    popup1.style.opacity = '0';
    popup1.style.transform = 'translateY(-1.5vw)';
    popup1.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    popup1.style.pointerEvents = 'none';
    setTimeout(function () {
      popup1.style.display = 'none';
      popup2.style.display = '';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          popup2.classList.add('popup2-visible');
        });
      });
    }, 350);
    if (window.playSound) window.playSound('perehod');
  }

  function closePopup() {
    overlay.classList.remove('popup-visible');
    popup2.classList.remove('popup2-visible');
    setTimeout(function () {
      overlay.style.display = 'none';
      // сбросить состояние popup1
      popup1.style.display = '';
      popup1.style.opacity = '';
      popup1.style.transform = '';
      popup1.style.transition = '';
      popup1.style.pointerEvents = '';
      popup2.style.display = 'none';
    }, 400);
  }

  // сначала скрыть popup2
  popup2.style.display = 'none';

  // кнопки «оставить заявку»
  var knopas = [
    document.getElementsByClassName('knopa_event1.32')[0],
    document.getElementsByClassName('knopa_event2.32')[0],
    document.getElementsByClassName('knopa_event3.32')[0],
  ];
  knopas.forEach(function (el) {
    if (!el) return;
    el.addEventListener('click', function () {
      if (window.playSound) window.playSound('perehod');
      openPopup();
    });
  });

  // клик на афишу — открывает попап
  ['.event1', '.event2', '.event3'].forEach(function (sel) {
    var img = document.querySelector(sel);
    if (!img) return;
    img.addEventListener('click', function () {
      if (window.playSound) window.playSound('perehod');
      openPopup();
    });
  });

  // отправить
  if (knopaSend) {
    knopaSend.addEventListener('click', switchToPopup2);
  }

  // вернуться к мероприятиям
  if (knopaBack) {
    knopaBack.addEventListener('mouseenter', function () {
      if (window.playSound) window.playSound('hover');
    });
    knopaBack.addEventListener('click', function () {
      if (window.playSound) window.playSound('perehod');
      closePopup();
    });
  }

  // закрыть кликом по фону
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
      if (window.playSound) window.playSound('perehod');
      closePopup();
    }
  });

})();


// бегущая строка

(function () {

  var beg = document.querySelector('.begstrock');
  if (!beg) return;

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

  var items = [
    ['НЕЗРИМЫЙ<br>ВЕС',   'подвеска //'],
    ['САМОСТЬ',           'кольцо //'],
    ['НАВИ',              'браслет //'],
    ['КРИСТАЛЛ',          'кольцо //'],
    ['ЧАСТИЦЫ<br>ОКЕАНА', 'подвеска //'],
    ['ФОРМУЛА',           'моно-серьга //'],
    ['КАПЛИ<br>ДОЖДЯ',    'брелок //'],
    ['СИМФОНИЯ',          'карабин //'],
    ['САМОСТЬ 2',        'кольцо //'],
  ];

  var slotVw = 15.764;
  var productMap = [1,2,3,6,5,4,7,8,9];

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
        window.location.href = './shop.html?product=' + productNum + '&ref=events';
      });
      track.appendChild(hz);
    });
  });

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

  var section = elements[0].closest('section') || elements[0];
  var done = false;

  function animate() {
    if (done) return;
    var rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      done = true;
      window.removeEventListener('scroll', animate);
      elements.forEach(function (el, i) {
        setTimeout(function () { el.classList.add('podval-in-ramka'); }, i * 200);
        textGroups[i].forEach(function (txt) {
          setTimeout(function () { txt.classList.add('podval-in-text'); }, i * 200 + 600);
        });
      });
    }
  }

  window.addEventListener('scroll', animate, { passive: true });
  animate();
})();
