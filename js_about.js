// кнопка узнать наше видение

(function () {
  var btn = document.querySelector('.knopa_about\\.18');
  var target = document.querySelector('.aboutblock2');
  if (!btn || !target) return;
  btn.addEventListener('click', function () {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

// бегущая строка

(function () {

  var beg = document.querySelector('.aboutpodval .begstrock_black');
  if (!beg) return;

  var track = document.createElement('div');
  track.className = 'begstrock-track';
  beg.parentNode.insertBefore(track, beg);
  track.appendChild(beg);

  var clone = document.createElement('img');
  clone.src = beg.src;
  clone.className = 'begstrock_black';
  clone.alt = '';
  clone.setAttribute('aria-hidden', 'true');
  track.appendChild(clone);

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
        window.location.href = './shop.html?product=' + productNum + '&ref=about';
      });
      track.appendChild(hz);
    });
  });

})();

// переключение секций галереи

(function () {

  var block2 = document.querySelector('.aboutblock2');
  if (!block2) return;

  var arrowLeft  = document.querySelector('.knopa_strelka_left');
  var arrowRight = document.querySelector('.knopa_strelka_right');

  var totalSections = 8;
  var sections = [];

  for (var r = 1; r <= totalSections; r++) {
    var imgs = block2.querySelectorAll('[class*="_r' + r + '"]');
    if (imgs.length === 0) continue;

    var wrapper = document.createElement('div');
    wrapper.className = 'about-section';
    wrapper.dataset.section = r;

    imgs.forEach(function (img) {
      wrapper.appendChild(img);
    });

    block2.appendChild(wrapper);
    sections.push(wrapper);
  }

  if (sections.length === 0) return;

  var current = 0;

  // анимация

  var imgProgress = new Map();
  var imgDone = new Set();
  var imgSoundPlayed = new Set();
  var arrowLProg = 0, arrowRProg = 0;
  var arrowLDone = false, arrowRDone = false;
  var triggerFirst = null, triggerLast = null;
  var arrowLStart = null, arrowRStart = null;

  function resetArrowAnim() {
    arrowLProg = 0; arrowRProg = 0;
    arrowLDone = false; arrowRDone = false;
    triggerFirst = null; triggerLast = null;
    arrowLStart = null; arrowRStart = null;
    if (arrowLeft)  { arrowLeft.style.clipPath  = 'inset(0% 0 100% 0)'; arrowLeft.style.transform  = 'translateY(calc(-50% + 60px))'; }
    if (arrowRight) { arrowRight.style.clipPath = 'inset(0% 0 100% 0)'; arrowRight.style.transform = 'translateY(calc(-50% + 60px))'; }
  }

  function resetSection(section) {
    section.querySelectorAll('img').forEach(function (img) {
      imgProgress.set(img, 0);
      imgDone.delete(img);
      img.style.clipPath = 'inset(0% 0 100% 0)';
      img.style.transform = 'translateY(60px)';
    });
    resetArrowAnim();
  }

  function observeSection(section) {
    section.querySelectorAll('img').forEach(function (img) {
      if (!imgProgress.has(img)) imgProgress.set(img, 0);
    });
  }

  function tickImages() {
    var active = sections[current];
    if (active) {
      var imgList = active.querySelectorAll('img');
      imgList.forEach(function (img, idx) {
        if (imgDone.has(img)) return;

        var p = imgProgress.get(img) || 0;
        var rect = img.getBoundingClientRect();
        var threshold = idx >= 2 ? 0.5 : 0.88;
        var target = rect.top < window.innerHeight * threshold ? 1 : 0;

        var wasBelowLate = p < 0.97;
        p += (target - p) * 0.12;
        if (p > 0.999) {
          p = 1;
          imgDone.add(img);
        }
        imgProgress.set(img, p);

        if (wasBelowLate && p >= 0.97 && !imgSoundPlayed.has(img) && window.playSound) {
          imgSoundPlayed.add(img);
          if (idx >= 2) {
            window.playSound('plashki');
          }
        }

        var clipBottom = ((1 - p) * 100).toFixed(1);
        var ty = ((1 - p) * 60).toFixed(1);
        var scale = (1 + (1 - p) * 0.12).toFixed(4);
        var blur = ((1 - p) * 18).toFixed(1);
        img.style.clipPath = 'inset(0% 0 ' + clipBottom + '% 0)';
        img.style.transform = 'scale(' + scale + ') translateY(' + ty + 'px)';
        img.style.filter = 'blur(' + blur + 'px)';
      });
    }

    if (arrowLeft && !arrowLeft.classList.contains('hidden') && !arrowLDone && triggerFirst && imgDone.has(triggerFirst)) {
      if (!arrowLStart) arrowLStart = Date.now();
      var rect = arrowLeft.getBoundingClientRect();
      var t = (Date.now() - arrowLStart > 800) && rect.top < window.innerHeight * 0.88 ? 1 : 0;
      arrowLProg += (t - arrowLProg) * 0.06;
      if (arrowLProg > 0.999) { arrowLProg = 1; arrowLDone = true; }
      var c = ((1 - arrowLProg) * 100).toFixed(1);
      var ty2 = ((1 - arrowLProg) * 60).toFixed(1);
      arrowLeft.style.clipPath = 'inset(0% 0 ' + c + '% 0)';
      arrowLeft.style.transform = 'translateY(calc(-50% + ' + ty2 + 'px))';
    }

    if (arrowRight && !arrowRight.classList.contains('hidden') && !arrowRDone && triggerLast && imgDone.has(triggerLast)) {
      if (!arrowRStart) arrowRStart = Date.now();
      var rect2 = arrowRight.getBoundingClientRect();
      var t2 = (Date.now() - arrowRStart > 800) && rect2.top < window.innerHeight * 0.88 ? 1 : 0;
      arrowRProg += (t2 - arrowRProg) * 0.06;
      if (arrowRProg > 0.999) { arrowRProg = 1; arrowRDone = true; }
      var c2 = ((1 - arrowRProg) * 100).toFixed(1);
      var ty3 = ((1 - arrowRProg) * 60).toFixed(1);
      arrowRight.style.clipPath = 'inset(0% 0 ' + c2 + '% 0)';
      arrowRight.style.transform = 'translateY(calc(-50% + ' + ty3 + 'px))';
    }

    requestAnimationFrame(tickImages);
  }

  requestAnimationFrame(tickImages);

  // высота блока и позиция стрелок

  function updateHeight() {
    var active = sections[current];
    var maxBottom = 0;
    var minTop = Infinity;
    var imgH = 0;
    active.querySelectorAll('img').forEach(function (img) {
      var b = img.offsetTop + img.offsetHeight;
      if (b > maxBottom) maxBottom = b;
      if (img.offsetTop < minTop) minTop = img.offsetTop;
      imgH = img.offsetHeight;
    });
    var totalH = maxBottom + 96;
    block2.style.height = totalH + 'px';

    if (arrowLeft)  arrowLeft.style.top  = (minTop + imgH / 2) + 'px';
    if (arrowRight) arrowRight.style.top = (maxBottom - imgH / 2) + 'px';

    // триггеры для задержки анимации стрелок
    var imgs = active.querySelectorAll('img');
    triggerFirst = imgs[0] || null;
    triggerLast  = imgs[imgs.length - 1] || null;
  }

  function updateArrows() {
    if (arrowLeft)  arrowLeft.classList.toggle('hidden',  current === 0);
    if (arrowRight) arrowRight.classList.toggle('hidden', current === sections.length - 1);
  }

  var p1 = document.querySelector('.perehod1');
  var p2 = document.querySelector('.perehod2');

  var navigating = false;

  function goTo(index) {
    if (navigating) return;
    navigating = true;

    if (window.playSound) window.playSound('perehod');

    // шаг 1: iris открывается — круг расширяется из центра
    if (p2) {
      p2.style.pointerEvents = 'auto';
      p2.style.transition = 'clip-path 0.65s cubic-bezier(0.4, 0, 0.6, 1)';
      p2.style.clipPath = 'circle(150% at 50% 50%)';
    }

    setTimeout(function () {
      // пик — переключаем секцию
      var prev = sections[current];
      resetSection(prev);
      prev.classList.remove('active');
      prev.style.display = 'none';

      current = index;
      var next = sections[current];
      next.style.display = '';
      next.classList.add('active');

      next.querySelectorAll('img').forEach(function (img) { imgSoundPlayed.delete(img); });

      updateHeight();
      updateArrows();

      var pageRowH = 0.5513 * window.innerWidth;
      var block2top = block2.getBoundingClientRect().top + window.scrollY;
      var scrollPos = block2top + Math.max(0, pageRowH - window.innerHeight + 40);
      window.scrollTo({ top: scrollPos, behavior: 'instant' });

      // шаг 2: iris закрывается — круг сжимается
      if (p2) {
        p2.style.transition = 'clip-path 0.65s cubic-bezier(0.4, 0, 0.2, 1)';
        p2.style.clipPath = 'circle(0% at 50% 50%)';
      }

      setTimeout(function () {
        if (p2) p2.style.pointerEvents = 'none';
        navigating = false;
      }, 680);
    }, 680);
  }

  sections[0].classList.add('active');
  for (var i = 1; i < sections.length; i++) {
    sections[i].style.display = 'none';
  }
  updateArrows();
  resetArrowAnim();
  setTimeout(updateHeight, 100);

  if (arrowRight) {
    arrowRight.addEventListener('click', function () {
      if (current < sections.length - 1) goTo(current + 1);
    });
  }

  if (arrowLeft) {
    arrowLeft.addEventListener('click', function () {
      if (current > 0) goTo(current - 1);
    });
  }

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

