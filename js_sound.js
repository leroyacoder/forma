(function () {

  var files = {
    hover:   './mp3/hover.mp3',
    plashki: './mp3/plashki.mp3',
    perehod: './mp3/perehod.mp3',
  };

  var pool = {};
  Object.keys(files).forEach(function (name) {
    var a = new Audio(files[name]);
    a.preload = 'auto';
    pool[name] = a;
  });

  function playPool(name) {
    var a = pool[name];
    if (!a) return;
    a.currentTime = 0;
    var p = a.play();
    if (p && p.catch) p.catch(function () {});
  }

  var _ac = null;
  var _tekstBuf = null;

  function getAC() {
    if (!_ac) _ac = new (window.AudioContext || window.webkitAudioContext)();
    return _ac;
  }

  function playTekst() {
    var ac = getAC();
    if (ac.state === 'suspended') { ac.resume(); return; }
    if (!_tekstBuf) return;
    var src = ac.createBufferSource();
    src.buffer = _tekstBuf;
    src.connect(ac.destination);
    src.start(0);
  }

  function loadTekst() {
    var ac = getAC();
    ac.resume();
    if (_tekstBuf) return;
    fetch('./mp3/tekst.mp3')
      .then(function (r) { return r.arrayBuffer(); })
      .then(function (buf) { return ac.decodeAudioData(buf); })
      .then(function (decoded) { _tekstBuf = decoded; })
      .catch(function () {});
  }

  function play(name) {
    if (name === 'tekst') { playTekst(); return; }
    playPool(name);
  }

  window.playSound = play;

  document.addEventListener('mousedown', function () {
    loadTekst();
    Object.keys(pool).forEach(function (name) {
      var a = pool[name];
      var saved = a.volume;
      a.volume = 0;
      var p = a.play();
      if (p && p.then) {
        p.then(function () { a.pause(); a.currentTime = 0; a.volume = saved; })
         .catch(function () { a.volume = saved; });
      } else { a.pause(); a.currentTime = 0; a.volume = saved; }
    });
  }, { once: true });

  document.addEventListener('mousedown', function (e) {
    var el = e.target.closest('[class*="knopa_main"], [class*="knopa_about"], [class*="knopa_shop"], [class*="knopa_events"]');
    if (el) play('perehod');
  });

  document.addEventListener('mouseover', function (e) {
    var el = e.target.closest('a, [class*="knopa"], [class*="strelka"]');
    if (!el || el._hovered) return;
    el._hovered = true;
    play('hover');
    el.addEventListener('mouseleave', function () { el._hovered = false; }, { once: true });
  });

  document.addEventListener('mouseover', function (e) {
    var el = e.target.closest('.beg-hz');
    if (!el || el._begHovered) return;
    el._begHovered = true;
    play('plashki');
    el.addEventListener('mouseleave', function () { el._begHovered = false; }, { once: true });
  });

})();
