// The design is authored on a fixed 1920px-wide stage; scale it to the viewport width.
// The hero is pinned while scrolling: LOVE -> COLOR -> GROWN -> STONE, then the rest of the hero fades in.
(function () {
  var DESIGN_W = 1920, DESIGN_H = 8552;
  var BASELINE = 671.5, WORD_FONT = 347.409, ASCENT = 0.8585; // baseline offset inside a line-height:1 box
  var LEFT_END = 510, RIGHT_START = 1320, EDGE_PAD = 8; // left halves end at LEFT_END, right halves start at RIGHT_START
  var viewport = document.getElementById('viewport');
  var pin = document.getElementById('pin');
  var stage = document.getElementById('stage');
  var wedge = document.getElementById('wedge');
  var fill = document.getElementById('fill');
  var hero = document.getElementById('hero');
  var header = document.getElementById('site-header');
  var RING_CY = 601;
  var words = [].slice.call(document.querySelectorAll('.word'));
  var lates = [].slice.call(document.querySelectorAll('.late'));
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scale = 1, run = 0, ticking = false;

  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var smooth = function (t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  var easeOut = function (t) { t = clamp(t, 0, 1); return 1 - Math.pow(1 - t, 3); };

  // every word uses the same 347px size and baseline around the fixed diamond slot;
  // a half that would run off the screen is nudged inward just enough to stay visible
  function fitWords() {
    var top = BASELINE - ASCENT * WORD_FONT;
    words.forEach(function (w) {
      var l = w.querySelector('.wl'), r = w.querySelector('.wr');
      l.style.fontSize = r.style.fontSize = WORD_FONT + 'px';
      l.style.top = r.style.top = top + 'px';
      l.style.left = Math.max(EDGE_PAD, LEFT_END - l.offsetWidth) + 'px';
      r.style.left = Math.min(RIGHT_START, DESIGN_W - EDGE_PAD - r.offsetWidth) + 'px';
    });
  }

  function render() {
    ticking = false;
    var p = run ? clamp(window.scrollY / run, 0, 1) : 1;
    var x = 3 * clamp(p / 0.58, 0, 1);               // 0..3 across the four words
    var fl = Math.min(Math.floor(x), 2);
    var xs = x >= 3 ? 3 : fl + smooth((x - fl - 0.3) / 0.4); // dwell on each word, then sweep
    // LOVE top-right, COLOR bottom-right, GROWN bottom-left, STONE back round to top-right
    wedge.style.rotate = (xs <= 2 ? 90 * xs : 180 + 180 * (xs - 2)) + 'deg';
    words.forEach(function (w, i) {
      var d = xs - i, v, y;
      if (i === words.length - 1 && d >= 0) { v = 1; y = 0; }
      else { v = clamp(1 - 2 * Math.abs(d), 0, 1); y = -d * 80; }
      w.style.opacity = v;
      w.style.translate = '0 ' + y + 'px';
    });
    // keep the ring centred on screen throughout (it starts at the design position, under the menu)
    // once STONE lands the quarter disc sweeps round to a full circle and stays; scrolling back up un-fills it
    var sweep = smooth((p - 0.5) / 0.12);
    fill.style.setProperty('--a', (90 + 270 * sweep) + 'deg');
    var dy = (window.innerHeight / 2) / scale - RING_CY;
    hero.style.translate = '0 ' + dy * smooth(p / 0.05) + 'px';
    // menu only shows on the first screen; it slides up as soon as scrolling begins (and returns on scroll back)
    var h = 1 - smooth(p / 0.05);
    header.style.opacity = h;
    header.style.translate = '0 ' + (-(1 - h) * 70) + 'px';
    header.style.pointerEvents = h < 0.5 ? 'none' : '';
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
