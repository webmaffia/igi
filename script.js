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
  var lab = document.getElementById('lab');
  var lsteps = [].slice.call(lab.querySelectorAll('.lstep')), csteps = [].slice.call(lab.querySelectorAll('.cstep'));
  var tabs = [].slice.call(lab.querySelectorAll('.steps span')), fills = [].slice.call(lab.querySelectorAll('.tabfill'));
  var LAB_CENTER = 3200; // design y that sits mid-screen while the #lab steps play
  var scale = 1, run = 0, labRun = 0, yLab = 0, labStep = -1, ticking = false;

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
    var s = window.scrollY;
    // scroll engine: the stage is fixed and moved by hand so it can pin at the hero and again at #lab
    var sLab = run + yLab, off;
    if (s <= run) off = 0;
    else if (s <= sLab) off = s - run;
    else if (s <= sLab + labRun) off = yLab;
    else off = s - run - labRun;
    stage.style.transform = 'translate3d(0,' + (-off) + 'px,0) scale(' + scale + ')';
    var p = run ? clamp(s / run, 0, 1) : 1;
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
    // the fill grows with every word (a quarter more per word) and is a full circle when STONE lands; scrolling back un-fills it
    var sweep = xs / 3;
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
    // #lab: five steps driven by scroll while it is pinned
    var lp = labRun ? clamp((s - sLab) / labRun, 0, 1) : 0;
    var st = Math.min(4, Math.floor(lp * 5)), local = lp >= 1 ? 1 : (lp * 5) % 1;
    if (st !== labStep) {
      labStep = st;
      lab.dataset.s = st;
      lsteps.forEach(function (el, i) { el.classList.toggle('on', i === st); });
      csteps.forEach(function (el, i) { el.classList.toggle('on', i === st); });
      tabs.forEach(function (el, i) { el.classList.toggle('on', i === st); });
    }
    fills.forEach(function (f, i) { f.style.transform = 'scaleX(' + (i < st ? 1 : i === st ? local : 0) + ')'; });
  }

  function fit() {
    scale = window.innerWidth / DESIGN_W;
    run = reduced ? 0 : window.innerHeight * 3.5;
    labRun = reduced ? 0 : window.innerHeight * 4.5;
    yLab = Math.max(0, LAB_CENTER * scale - window.innerHeight / 2);
    viewport.style.height = DESIGN_H * scale + run + labRun + 'px';
    render();
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(render); } }

  // draggable comparison: lab-grown shows to the right of the handle, natural to the left.
  // The handle travels out to the outer ring on either side; the copy on the side it moves toward hides.
  (function () {
    var knob = document.getElementById('knob'), cmp = document.getElementById('cmp'), lab = document.getElementById('cmp-lab');
    var txtNat = document.getElementById('txt-nat'), txtLab = document.getElementById('txt-lab'), arc = document.getElementById('arc');
    var CMP_L = 689, CMP_W = 542, KNOB_R = 56.0935, MID = DESIGN_W / 2, REACH = 448, cx = MID, dragging = false; // REACH: handle stops at the outer ring
    function set(x) {
      cx = clamp(x, MID - REACH, MID + REACH);
      knob.style.left = (cx - KNOB_R) + 'px';
      lab.style.clipPath = 'inset(0 0 0 ' + clamp((cx - CMP_L) / CMP_W, 0, 1) * 100 + '%)';
      var t = (cx - MID) / REACH;                       // -1 (left stop) .. 1 (right stop)
      arc.style.rotate = (t * 90) + 'deg';              // the grey arc swings round the ring with the handle
      var labV = clamp(1 - Math.max(0, t) * 2.2, 0, 1);  // moving right hides the lab-grown copy
      var natV = clamp(1 + Math.min(0, t) * 2.2, 0, 1);  // moving left hides the natural copy
      txtLab.style.opacity = labV; txtLab.style.translate = (1 - labV) * 40 + 'px 0';
      txtNat.style.opacity = natV; txtNat.style.translate = -(1 - natV) * 40 + 'px 0';
      knob.setAttribute('aria-valuenow', Math.round(cx / DESIGN_W * 100));
    }
    function fromEvent(e) { return (e.clientX - stage.getBoundingClientRect().left) / scale; }
    knob.addEventListener('pointerdown', function (e) { dragging = true; knob.classList.add('drag'); knob.setPointerCapture(e.pointerId); e.preventDefault(); });
    knob.addEventListener('pointermove', function (e) { if (dragging) set(fromEvent(e)); });
    var end = function () { dragging = false; knob.classList.remove('drag'); };
    knob.addEventListener('pointerup', end);
    knob.addEventListener('pointercancel', end);
    cmp.addEventListener('pointerdown', function (e) { set(fromEvent(e)); });
    knob.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { set(cx - 60); e.preventDefault(); }
      if (e.key === 'ArrowRight') { set(cx + 60); e.preventDefault(); }
    });
  })();

  fitWords();
  fit();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fitWords(); render(); });
  window.addEventListener('resize', fit);
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="#lab"]');
    if (a) { e.preventDefault(); window.scrollTo({ top: run + yLab + 1, behavior: 'smooth' }); }
  });
  window.addEventListener('scroll', onScroll, { passive: true });
})();
