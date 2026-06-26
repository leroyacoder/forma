// анимация первого экрана магазина

(function () {

  var bykvi   = document.querySelector('.shop_bykvi');
  var kv      = document.querySelector('.kvadratiki_shop');
  var txt     = document.getElementsByClassName('text_shop.16')[0];
  var knopa   = document.getElementsByClassName('knopa_shop.18')[0];

  // парение букв shop_bykvi
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

  // анимация появления при загрузке страницы
  function runEntrance() {
    // буквы — сразу
    if (bykvi) setTimeout(function () { bykvi.classList.add('shop1-in'); }, 100);
    // пауза ~900ms, потом остальные элементы
    if (kv)    setTimeout(function () { kv.classList.add('shop1-in'); if (window.playSound) window.playSound('plashki'); }, 1100);
    if (txt)   setTimeout(function () { txt.classList.add('shop1-in'); if (window.playSound) window.playSound('tekst'); }, 1500);
    if (knopa) setTimeout(function () { knopa.classList.add('shop1-in'); }, 1800);
  }

  // запускаем после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runEntrance);
  } else {
    runEntrance();
  }

})();

// буквы магазин — клик/ховер/звуки

(function () {
  var bykvi = document.querySelector('.shop_bykvi');
  var target = document.querySelector('.shopblock2');
  if (!bykvi) return;
  bykvi.addEventListener('mouseenter', function () {
    if (window.playSound) window.playSound('hover');
  });
  bykvi.addEventListener('click', function () {
    if (window.playSound) window.playSound('perehod');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

// анимация карточек товаров

(function () {

  var sections = [
    {
      block: '.shopblock2',
      cards: [
        { n: 1 },
        { n: 2 },
        { n: 3 },
      ]
    },
    {
      block: '.shopblock3',
      cards: [
        { n: 6 },
        { n: 5 },
        { n: 4 },
      ]
    },
    {
      block: '.shopblock4',
      cards: [
        { n: 7 },
        { n: 8, extra32: true, fill: true },
        { n: 9 },
      ]
    },
    {
      block: '.shopblock5',
      cards: [
        { n: 12, extra32: true, fill: true },
        { n: 11, extra32: true, fill: true },
        { n: 10 },
      ]
    },
  ];

  function animateCard(block, card, stagger) {
    var n = card.n;
    var ramka  = block.querySelector('.ramka_shop' + n);
    var tovar  = block.querySelector('.tovar_shop' + n);
    var t18    = document.getElementsByClassName('text_shop_tovar' + n + '.18')[0];
    var t12    = document.getElementsByClassName('text_shop_tovar' + n + '.12')[0];
    var t32    = card.extra32
                   ? document.getElementsByClassName('text_shop_tovar' + n + '.32')[0]
                   : null;

    if (ramka) setTimeout(function () { ramka.classList.add('shop-in-ramka'); if (window.playSound) window.playSound('plashki'); }, stagger);
    if (ramka && card.fill) {
      var overlay = document.createElement('div');
      overlay.className = 'shop-fill-overlay';
      overlay.dataset.card = String(n);
      block.appendChild(overlay);
      setTimeout(function () { overlay.classList.add('shop-in-fill'); }, 1100 + stagger);
    }
    if (tovar) setTimeout(function () { tovar.classList.add('shop-in-tovar'); }, 550 + stagger);
    if (t18)   setTimeout(function () { t18.classList.add('shop-in-text18'); if (window.playSound) window.playSound('tekst'); }, 950 + stagger);
    if (t12)   setTimeout(function () { t12.classList.add('shop-in-text12'); }, 1300 + stagger);
    if (t32)   setTimeout(function () { t32.classList.add('shop-in-text12'); }, 1300 + stagger);
  }

  sections.forEach(function (sec) {
    var block = document.querySelector(sec.block);
    if (!block) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        block.classList.add('shop-in-blik');
        sec.cards.forEach(function (card, i) {
          animateCard(block, card, i * 200);
        });
        observer.disconnect();
      });
    }, { threshold: 0.1 });

    observer.observe(block);
  });

})();

// попап товара

(function () {

  var products = {
    1: { name: 'НЕЗРИМЫЙ ВЕС',   type: 'подвеска //',    price: '4.500 ₽', desc: ['олово sn97cu3, стекло, цепочка и фурнитура из нержавеющей стали', 'каждая подвеска изготавливается вручную, могут быть незначительные отличия', 'срок изготовления: 5-7 дней'], photo: './img/tovar1_photo2.png', photoW: '32vw', photoH: '52vw', photoR: '90deg' },
    2: { name: 'САМОСТЬ',         type: 'кольцо //',      price: '4.000 ₽', desc: ['олово sn97cu3, аквамарин', 'каждое кольцо изготавливается вручную, могут быть незначительные отличия', 'срок изготовления: 5-7 дней'], photo: './img/tovar2_photo2.png', photoW: '39.88vw', photoH: '41.22vw' },
    3: { name: 'НАВИ',            type: 'браслет //',     price: '4.300 ₽', desc: ['олово sn97cu3', 'каждый браслет изготавливается вручную, могут быть незначительные отличия', 'срок изготовления: 5-7 дней'], photo: './img/tovar3_photo2.png', photoW: '57.54vw', photoH: '34.55vw' },
    4: { name: 'ФОРМУЛА',         type: 'моно-серьга //', price: '1.500 ₽', desc: ['олово sn97cu3, нержавеющая сталь, стеклянный кабашон ручной работы', 'каждая серьга изготавливается вручную, могут быть незначительные отличия', 'срок изготовления: 5-7 дней'], photo: './img/tovar4_photo2.png', photoW: '30.53vw', photoH: '41.42vw', offsetX: '2.5vw' },
    5: { name: 'ЧАСТИЦЫ ОКЕАНА',  type: 'подвеска //',    price: '1.500 ₽', desc: ['ракушка, нержавеющая сталь', 'каждая подвеска изготавливается вручную, могут быть незначительные отличия', 'срок изготовления: 5-7 дней'], photo: './img/tovar5_photo2.png', photoW: '40vw', photoH: '60vw', photoR: '-90deg' },
    6: { name: 'КРИСТАЛЛ',        type: 'кольцо //',      price: '3.500 ₽', desc: ['олово sn97cu3, кварц', 'каждое кольцо изготавливается вручную, могут быть незначительные отличия', 'срок изготовления: 5-7 дней'], photo: './img/tovar6_photo2.png', photoW: '36.97vw', photoH: '36.53vw', offsetX: '-0.5vw' },
    7: { name: 'КАПЛИ ДОЖДЯ',     type: 'брелок //',      price: '1.900 ₽', desc: ['ракушка, нержавеющая сталь, перламутр', 'каждый брелок изготавливается вручную, могут быть незначительные отличия', 'срок изготовления: 5-7 дней'], photo: './img/tovar7_photo2.png', photoW: '51.32vw', photoH: '44.44vw' },
    8: { name: 'СИМФОНИЯ',        type: 'карабин //',     price: '2.500 ₽', desc: ['олово sn97cu3, перламутр, нержавеющая сталь, кварц', 'каждый карабин изготавливается вручную, могут быть незначительные отличия', 'срок изготовления: 5-7 дней'], photo: './img/tovar8_photo2.png', photoW: '38.21vw', photoH: '50.86vw', photoR: '-31.6deg', offsetX: '-0.3vw' },
    9: { name: 'САМОСТЬ 2',       type: 'кольцо //',      price: '3.500 ₽', desc: ['олово sn97cu3, аквамарин', 'каждое кольцо изготавливается вручную, могут быть незначительные отличия', 'срок изготовления: 5-7 дней'], photo: './img/tovar9_photo2.png', photoW: '40.49vw', photoH: '32.5vw', offsetX: '2vw', offsetY: '1.5vw' },
  };

  // нумерация

  var cardToPopup = { 1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 9:8, 10:9 };

  var popup   = document.querySelector('.popup');
  var strelka = document.querySelector('.knopa_strelka_popup');
  var photoEl = document.querySelector('.popup-photo');
  var nameEl  = document.querySelector('.popup-pname');
  var typeEl  = document.querySelector('.popup-ptype');
  var priceEl = document.querySelector('.popup-pprice');
  var descEl  = document.querySelector('.popup-pdesc');
  if (!popup) return;

  var logoShop = document.querySelector('.logo_shop');

  function openPopup(productNum) {
    var p = products[productNum];
    if (!p) return;
    if (photoEl) {
      var r  = p.photoR   ? ' rotate(' + p.photoR + ')' : '';
      var ox = p.offsetX  || '0vw';
      var oy = p.offsetY  || '0vw';
      photoEl.src             = p.photo;
      photoEl.style.translate = '';
      photoEl.style.rotate    = '';
      photoEl.style.width     = p.photoW || '';
      photoEl.style.height    = p.photoH || '';
      photoEl.style.transform = 'translate(calc(-50% + ' + ox + '), calc(-50% + ' + oy + '))' + r;
      photoEl.dataset.offsetX = '0px';
    }
    if (nameEl)  nameEl.textContent  = p.name;
    if (typeEl)  typeEl.textContent  = p.type;
    if (priceEl) priceEl.textContent = p.price;
    if (descEl)  descEl.innerHTML = p.desc.map(function (s) { return '<p>' + s + '</p>'; }).join('');
    popup.scrollTop = 0;
    popup.classList.add('popup-active');
    document.body.style.overflow = 'hidden';
    if (logoShop) logoShop.style.display = 'none';
    if (window.playSound) window.playSound('perehod');
  }
  window.openPopup = openPopup;

  var urlRef = new URLSearchParams(window.location.search).get('ref');

  function closePopup() {
    popup.classList.remove('popup-active');
    document.body.style.overflow = '';
    if (logoShop) logoShop.style.display = '';
    if (window.playSound) window.playSound('perehod');
    if (urlRef) { history.back(); return; }
    if (window.podvalAnimate) window.podvalAnimate();
  }

  // клик открывает попап

  Object.keys(cardToPopup).forEach(function (n) {
    var num = parseInt(n);
    var popupNum = cardToPopup[num];
    ['.ramka_shop' + num, '.tovar_shop' + num].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      el.style.cursor = 'pointer';
      el.addEventListener('click', function () { openPopup(popupNum); });
    });
  });

  // закрытие по стрелке

  if (strelka) strelka.addEventListener('click', closePopup);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePopup();
  });

  var urlProduct = parseInt(new URLSearchParams(window.location.search).get('product'));
  if (urlProduct && products[urlProduct]) openPopup(urlProduct);

})();

// парение товаров

(function () {

  var items = [1,2,3,4,5,6,7,8,9,10,11,12];
  var phases = [0, 1.3, 2.2, 0.6, 1.9, 0.4, 1.1, 2.7, 0.9, 2.0, 0.2, 1.6];

  function tick() {
    var t = Date.now() * 0.00072;
    items.forEach(function (n, i) {
      var el = document.querySelector('.tovar_shop' + n);
      if (!el) return;
      var y = Math.sin(t * (0.85 + i * 0.07) + phases[i]) * 20;
      el.style.translate = '0px ' + y.toFixed(2) + 'px';
    });
    requestAnimationFrame(tick);
  }

  tick();

})();

// ховер для появления названий

(function () {

  var pairs = [
    { triggers: ['.ramka_shop1', '.tovar_shop1'], ani: 'text_shop_ani1.32' },
    { triggers: ['.ramka_shop2', '.tovar_shop2'], ani: 'text_shop_ani2.32' },
    { triggers: ['.ramka_shop3', '.tovar_shop3'], ani: 'text_shop_ani3.32' },
    { triggers: ['.ramka_shop4', '.tovar_shop4'], ani: 'text_shop_ani4.32' },
    { triggers: ['.ramka_shop5', '.tovar_shop5'], ani: 'text_shop_ani5.32' },
    { triggers: ['.ramka_shop6', '.tovar_shop6'], ani: 'text_shop_ani6.32' },
    { triggers: ['.ramka_shop7', '.tovar_shop7'], ani: 'text_shop_ani7.32' },
    { triggers: ['.ramka_shop9', '.tovar_shop9'], ani: 'text_shop_ani9.32' },
    { triggers: ['.ramka_shop10', '.tovar_shop10'], ani: 'text_shop_ani10.32' },
  ];

  pairs.forEach(function (pair) {
    var aniEl = document.getElementsByClassName(pair.ani)[0];
    if (!aniEl) return;

    var timer = null;

    var tovarEl = document.querySelector('.tovar_shop' + pair.ani.replace('text_shop_ani', '').replace('.32', ''));

    function show() {
      clearTimeout(timer);
      aniEl.classList.add('ani-hover-in');
      if (tovarEl) tovarEl.classList.add('tovar-hover-in');
      if (window.playSound) window.playSound('hover');
    }
    function hide() {
      timer = setTimeout(function () {
        aniEl.classList.remove('ani-hover-in');
        if (tovarEl) tovarEl.classList.remove('tovar-hover-in');
      }, 80);
    }

    pair.triggers.forEach(function (sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      el.addEventListener('mouseenter', show);
      el.addEventListener('mouseleave', hide);
    });
  });

})();

// парение фото в попапе

(function () {

  var photo = document.querySelector('.popup-photo');
  if (!photo) return;

  function tick() {
    var t = Date.now() * 0.00110;
    var y = Math.sin(t * 0.85) * 18;
    var ox = photo.dataset.offsetX || '0px';
    photo.style.translate = ox + ' ' + y.toFixed(2) + 'px';
    requestAnimationFrame(tick);
  }

  tick();

})();

// кнопка корзины на 404

(function () {

  var btn = document.querySelector('.popup-page .knopa_shop_popup\\.32');
  if (!btn) return;
  btn.addEventListener('click', function () {
    window.location.href = './404.html';
  });

})();
