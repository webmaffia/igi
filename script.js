// The design is authored on a fixed 1920px-wide stage; scale it to the viewport width.
// The hero is pinned while scrolling: LOVE -> COLOR -> GROWN -> STONE, then the rest of the hero fades in.
(function () {
  var DESIGN_W = 1920, DESIGN_H = 8552;
  var BASELINE = 671.5, WORD_FONT = 347.409, ASCENT = 0.8585; // baseline offset inside a line-height:1 box
  var LEFT_EDGE = 103, RIGHT_START = 1320, LEFT_ROOM = 450, RIGHT_ROOM = 540;
  var viewport = document.getElementById('viewport');
  var pin = document.getElementById('pin');
  var stage = document.getElementById('stage');
  var wedge = document.getElementById('wedge');
  var words = [].slice.call(document.querySelectorAll('.word'));
  var lates = [].slice.call(document.querySelectorAll('.late'));
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scale = 1, run = 0, ticking = false, leftEdge = 510;

  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var smooth = function (t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  var easeOut = function (t) { t = clamp(t, 0, 1); return 1 - Math.pow(1 - t, 3); };

  // size each word so both halves fit around the diamond, keeping one shared baseline
  function fitWords() {
    var stone = words[words.length - 1];
    var sl = stone.querySelector('.wl');
    sl.style.left = LEFT_EDGE + 'px';
    leftEdge = LEFT_EDGE + sl.offsetWidth;
    words.forEach(function (w) {
      var l = w.querySelector('.wl'), r = w.querySelector('.wr');
      l.style.fontSize = r.style.fontSize = WORD_FONT + 'px';
      var f = Math.min(1, LEFT_ROOM / l.offsetWidth, RIGHT_ROOM / r.offsetWidth);
      var size = WORD_FONT * f, top = BASELINE - ASCENT * size;
      l.style.fontSize = r.style.fontSize = size + 'px';
      l.style.top = r.style.top = top + 'px';
      l.style.left = (leftEdge - l.offsetWidth) + 'px';
    });
  }

  function render() {
    ticking = false;
    var p = run ? clamp(window.scrollY / run, 0, 1) : 1;
    var x = 3 * clamp(p / 0.72, 0, 1);               // 0..3 across the four words
    var fl = Math.min(Math.floor(x), 2);
    var xs = x >= 3 ? 3 : fl + smooth((x - fl - 0.3) / 0.4); // dwell on each word, then sweep
    wedge.style.rotate = (90 + 90 * xs) + 'deg';
    words.forEach(function (w, i) {
      var d = xs - i, v, y;
      if (i === words.length - 1 && d >= 0) { v = 1; y = 0; }
      else { v = clamp(1 - 2 * Math.abs(d), 0, 1); y = -d * 80; }
      w.style.opacity = v;
      w.style.translate = '0 ' + y + 'px';
    });
    var q = clamp((p - 0.74) / 0.26, 0, 1);
    lates.forEach(function (el) {
      var t = easeOut((q - (+el.dataset.d) * 0.07) / 0.6);
      el.style.opacity = t;
      el.style.translate = '0 ' + (1 - t) * 30 + 'px';
      el.style.pointerEvents = t < 0.5 ? 'none' : '';
    });
  }

  function fit() {
    scale = window.innerWidth / DESIGN_W;
    stage.style.transform = 'scale(' + scale + ')';
    pin.style.height = DESIGN_H * scale + 'px';
    run = reduced ? 0 : window.innerHeight * 3.5;
    viewport.style.height = DESIGN_H * scale + run + 'px';
    render();
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(render); } }

  fitWords();
  fit();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fitWords(); render(); });
  window.addEventListener('resize', fit);
  window.addEventListener('scroll', onScroll, { passive: true });
})();
