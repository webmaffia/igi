// The design is authored on a fixed 1920px-wide stage; scale it to the viewport width.
// The hero is pinned while scrolling: LOVE -> COLOR -> GROWN -> STONE, then the rest of the hero fades in.
(function () {
  var DESIGN_W = 1920, DESIGN_H = 10513;
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
  var fab = document.getElementById('fab');
  var trade = document.getElementById('trade'), tradeIn = false, TRADE_Y = 8143;
  function countUp() {
    [].slice.call(trade.querySelectorAll('.cnt')).forEach(function (b) {
      var to = +b.dataset.to, suf = b.dataset.s || '', from = to > 1000 ? 1900 : 0, t0 = performance.now();
      (function step(t) {
        var p = Math.min(1, (t - t0) / 1800), v = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
        b.textContent = v + (p === 1 ? suf : '');
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    });
  }
  var lab = document.getElementById('lab');
  var lsteps = [].slice.call(lab.querySelectorAll('.lstep')), csteps = [].slice.call(lab.querySelectorAll('.cstep'));
  var tabs = [].slice.call(lab.querySelectorAll('.steps span')), fills = [].slice.call(lab.querySelectorAll('.tabfill'));
  var LAB_CENTER = 3200; // design y that sits mid-screen while the #lab steps play
  var rcards = [].slice.call(document.querySelectorAll('.rcard'));
  var REP_CENTER = 4420;
  var scale = 1, run = 0, labRun = 0, yLab = 0, repRun = 0, yRep = 0, repActive = -1, labStep = -1, ticking = false;

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
    var sLab = run + yLab, sRep = run + labRun + yRep, off;
    if (s <= run) off = 0;
    else if (s <= sLab) off = s - run;
    else if (s <= sLab + labRun) off = yLab;
    else if (s <= sRep) off = s - run - labRun;
    else if (s <= sRep + repRun) off = yRep;
    else off = s - run - labRun - repRun;
    stage.style.transform = 'translate3d(0,' + (-off) + 'px,0) scale(' + scale + ')';
    var p = run ? clamp(s / run, 0, 1) : 1;
    // fixed verify bar: shows once the hero is over, hides while the #moment form is on screen
    var topY = off / scale, botY = (off + window.innerHeight) / scale;
    var momentInView = botY > 5480 && topY < 5740;
    fab.classList.toggle('show', s > run * 0.95 && !momentInView);
    // #trade: counters count up and the arcs draw in the first time the row comes on screen
    if (!tradeIn && botY > TRADE_Y + 1000) { tradeIn = true; trade.classList.add('in'); countUp(); }
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
      lsteps.forEach(function (el) { el.classList.toggle('on', +el.dataset.i === st); });
      csteps.forEach(function (el) { el.classList.toggle('on', +el.dataset.i === st); });
      tabs.forEach(function (el, i) { el.classList.toggle('on', i === st); });
    }
    fills.forEach(function (f, i) { f.style.transform = 'scaleX(' + (i < st ? 1 : i === st ? local : 0) + ')'; });
  }

  function fit() {
    scale = window.innerWidth / DESIGN_W;
    run = reduced ? 0 : window.innerHeight * 3.5;
    labRun = reduced ? 0 : window.innerHeight * 4.5;
    yLab = Math.max(0, LAB_CENTER * scale - window.innerHeight / 2);
    repRun = 0; // reports are hover-driven, no scroll pinning
    yRep = Math.max(yLab, REP_CENTER * scale - window.innerHeight / 2);
    viewport.style.height = DESIGN_H * scale + run + labRun + repRun + 'px';
    render();
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(render); } }

  // draggable comparison: lab-grown shows to the right of the handle, natural to the left.
  // The handle travels out to the outer ring on either side; the copy on the side it moves toward hides.
  (function () {
    var knob = document.getElementById('knob'), cmp = document.getElementById('cmp'), lab = document.getElementById('cmp-lab');
    var natL = document.getElementById('txt-natL'), labR = document.getElementById('txt-labR'), labL = document.getElementById('txt-labL'), natR = document.getElementById('txt-natR'), arc = document.getElementById('arc'), arcL = document.getElementById('arcL');
    var CMP_L = 689, CMP_W = 542, KNOB_R = 56.0935, MID = DESIGN_W / 2, REACH = 448, cx = MID, dragging = false; // REACH: handle stops at the outer ring
    function show(el, v, dir) {
      el.style.opacity = v;
      el.style.translate = dir * (1 - v) * 40 + 'px 0';
      el.style.pointerEvents = v < 0.3 ? 'none' : '';
    }
    function set(x) {
      cx = clamp(x, MID - REACH, MID + REACH);
      knob.style.left = (cx - KNOB_R) + 'px';
      lab.style.clipPath = 'inset(0 0 0 ' + clamp((cx - CMP_L) / CMP_W, 0, 1) * 100 + '%)';
      var t = (cx - MID) / REACH;                       // -1 (left stop) .. 1 (right stop)
      // the grey half-arc stays left/right: right half while lab-grown, left half once natural takes over
      arc.style.opacity = t <= 0 ? 1 : clamp(1 - t * 2.2, 0, 1);
      arcL.style.opacity = clamp(t * 2.2, 0, 1);
      // dragged left: the new lab-grown copy takes the left side and the original lab-grown copy stays on the right.
      // dragged right: the new natural copy takes the right side and the original natural copy stays on the left.
      show(natL, t >= 0 ? 1 : clamp(1 + t * 2.2, 0, 1), -1);
      show(labR, t <= 0 ? 1 : clamp(1 - t * 2.2, 0, 1), 1);
      show(labL, clamp(-t * 2.2, 0, 1), -1);
      show(natR, clamp(t * 2.2, 0, 1), 1);
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
    set(MID);
  })();

  // report titles: keep every line inside the circle and clear of the description by shrinking until they fit
  var rtitles = [].slice.call(document.querySelectorAll('.rtitle'));
  function fitTitles() {
    rtitles.forEach(function (el) {
      var size = 50;
      el.style.fontSize = size + 'px'; el.style.lineHeight = '54.831px';
      while ((el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > 160) && size > 26) {
        size -= 1;
        el.style.fontSize = size + 'px'; el.style.lineHeight = (size * 1.0966) + 'px';
      }
    });
  }

  // #reports: coverflow. The active card is large in the middle, neighbours shrink to each side.
  // Click a card (or use the arrows / arrow keys / swipe) to bring it to the middle.
  var RX = [0, 385, 500, 600], RS = [1, 0.55, 0.34, 0.26], RO = [1, 0.95, 0.6, 0];
  var rprev = document.getElementById('rprev'), rnext = document.getElementById('rnext');
  function setRep(i) {
    i = clamp(i, 0, rcards.length - 1);
    repActive = i;
    rcards.forEach(function (el, k) {
      var d = k - i, a = Math.abs(d), n = Math.min(a, 3), sg = d < 0 ? -1 : 1;
      el.style.transform = 'translate(' + (a ? sg * RX[n] : 0) + 'px,' + (a ? 0 : -10) + 'px) scale(' + RS[n] + ')';
      el.style.opacity = RO[n];
      el.style.zIndex = a ? 100 - a : 200;
      el.classList.toggle('on', a === 0);
      el.querySelector('.rcirc').style.pointerEvents = RO[n] > 0.3 ? 'auto' : 'none';
    });
    rprev.disabled = i === 0;
    rnext.disabled = i === rcards.length - 1;
  }
  rcards.forEach(function (el, i) {
    el.querySelector('.rcirc').addEventListener('click', function () { if (i !== repActive) setRep(i); });
    el.addEventListener('focusin', function () { if (i !== repActive) setRep(i); });
  });
  rprev.addEventListener('click', function () { setRep(repActive - 1); });
  rnext.addEventListener('click', function () { setRep(repActive + 1); });
  document.addEventListener('keydown', function (e) {
    var t = (document.activeElement && document.activeElement.tagName) || '';
    if (t === 'INPUT' || t === 'TEXTAREA') return;
    var topY = (parseFloat(stage.style.transform.split(',')[1]) || 0) * -1 / scale;
    if (topY + window.innerHeight / scale < 3946 || topY > 4834) return;       // only while the section is on screen
    if (e.key === 'ArrowLeft') setRep(repActive - 1);
    if (e.key === 'ArrowRight') setRep(repActive + 1);
  });
  (function () {
    var x0 = null;
    var zone = document.getElementById('reports');
    zone.addEventListener('pointerdown', function (e) { if (e.target.closest('.rcirc')) x0 = e.clientX; });
    window.addEventListener('pointerup', function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 70) setRep(repActive + (dx < 0 ? 1 : -1));
    });
  })();
  setRep(0);

  // #moment: report number form (prototype, no verification service yet)
  document.getElementById('vform').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = document.getElementById('vnum').value.trim(), note = document.getElementById('vnote');
    note.textContent = v ? 'Design prototype \u2014 this will connect to IGI\u2019s report verification service.' : 'Please enter your IGI report number.';
  });

  // #cust: 4Cs wheel - tabs pick the C, the knob rides the dial, the right-hand copy follows
  (function () {
    var quads = [].slice.call(document.querySelectorAll('.wquad')),
    tabsC = [].slice.call(document.querySelectorAll('.wtab')), knob = document.getElementById('cknob'), ticksEl = document.getElementById('cticks');
    var cwedge = document.getElementById('cwedge'), cgem = document.getElementById('cgem'), gimg = document.getElementById('cgemimg');
    var incl = document.getElementById('cincl');
    var title = document.getElementById('cr-title'), val = document.getElementById('cr-val'), sub = document.getElementById('cr-sub'), desc = document.getElementById('cr-desc');
    var CX = 859, CY = 6589, KR = 516, TR = 538, A0 = -42, A1 = 42; // wheel centre, knob/tick radii, dial span in degrees
    var QUAD = { carat: 0, color: 90, clarity: 180, cut: 270 };   // quadrant (clockwise from top-right) of each tab
    var C = {
      carat: { d: 'Carat measures weight, not size. One carat equals 0.2 grams \u2014 and larger stones are rarer.', s: ['0.25', '0.50', '1.00', '2.00', '3.00'] },
      color: { d: 'Graded from D (colourless) to Z (light yellow or brown). The less colour, the rarer the stone.', s: ['D', 'G', 'J', 'M', 'Z'] },
      clarity: { d: 'The absence of inclusions and blemishes, from Flawless to Included, under 10\u00d7 magnification.', s: ['FL', 'VVS', 'VS', 'SI', 'I'] },
      cut: { d: 'How well the facets interact with light. Excellent proportions mean maximum brilliance and fire.', s: ['Poor', 'Fair', 'Good', 'V.Good', 'Excellent'] }
    };
    var colorG = 'DEFGHIJKLMNOPQRSTUVWXYZ'.split(''), clar = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'], cutG = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    var st = { carat: 8.53, color: 10, clarity: 20, cut: 90 }, cur = 'carat', dragging = false; // knob starts at the design's 0.55 ct
    var carat = function (v) { return 0.25 + Math.pow(v / 100, 0.9) * 2.75; };

    function drawKnob() {
      var a = (A0 + (A1 - A0) * st[cur] / 100) * Math.PI / 180;
      knob.style.left = (CX + KR * Math.cos(a) - 22) + 'px';
      knob.style.top = (CY + KR * Math.sin(a) - 22) + 'px';
      knob.setAttribute('aria-valuenow', Math.round(st[cur]));
    }
    function draw() {
      drawKnob();
      var ct = carat(st.carat), y = st.color / 100, q = st.cut / 100, V, N;
      cgem.style.transform = 'scale(' + (1 + (ct - 0.55) * 0.07) + ')';
      incl.style.opacity = Math.max(0, (st.clarity - 8) / 92);
      gimg.style.filter = 'sepia(' + y * 0.55 + ') saturate(' + (1 + y * 0.7) + ') brightness(' + (0.82 + q * 0.2) + ') drop-shadow(0 0 ' + q * 22 + 'px rgba(150,190,255,' + q * 0.5 + '))';
      if (cur === 'carat') { V = ct.toFixed(2) + ' ct'; N = '\u2248 ' + (ct * 0.2).toFixed(2) + ' grams'; }
      if (cur === 'color') { V = colorG[Math.min(22, Math.round(y * 22))]; N = V <= 'F' ? 'Colourless' : V <= 'J' ? 'Near colourless' : V <= 'M' ? 'Faint' : V <= 'R' ? 'Very light' : 'Light'; }
      if (cur === 'clarity') { V = clar[Math.min(10, Math.round(st.clarity / 10))]; N = V === 'FL' ? 'Flawless' : V === 'IF' ? 'Internally flawless' : V.indexOf('VVS') === 0 ? 'Very, very slightly included' : V.indexOf('VS') === 0 ? 'Very slightly included' : V.indexOf('SI') === 0 ? 'Slightly included' : 'Included'; }
      if (cur === 'cut') { V = cutG[Math.min(4, Math.round(q * 4))]; N = 'Light return & sparkle'; }
      val.textContent = V; sub.textContent = N;
    }
    function setC(c) {
      cur = c;
      title.textContent = c;
      desc.textContent = C[c].d;
      ticksEl.innerHTML = C[c].s.map(function (t, i) {
        var a = -40 + 20 * i;
        return '<div class="tk" style="transform:rotate(' + a + 'deg) translateX(' + TR + 'px) rotate(90deg) translate(-50%,-50%)">' + t + '</div>';
      }).join('');
      tabsC.forEach(function (t) { t.classList.toggle('on', t.dataset.c === c); });
      quads.forEach(function (q) { q.classList.toggle('on', q.dataset.c === c); });
      cwedge.style.rotate = QUAD[c] + 'deg';
      draw();
    }
    function fromPointer(e) {
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / scale - CX, yy = (e.clientY - r.top) / scale - CY;
      var a = Math.atan2(yy, x) * 180 / Math.PI;
      st[cur] = clamp((a - A0) / (A1 - A0) * 100, 0, 100);
      draw();
    }
    quads.forEach(function (q) {
      var tw = document.querySelector('.wtab[data-c="' + q.dataset.c + '"]');
      q.addEventListener('click', function () { setC(q.dataset.c); });
      q.addEventListener('pointerenter', function () { tw.classList.add('hov'); });
      q.addEventListener('pointerleave', function () { tw.classList.remove('hov'); });
    });
    tabsC.forEach(function (t) {
      t.addEventListener('click', function () { setC(t.dataset.c); });
      t.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setC(t.dataset.c); } });
    });
    knob.addEventListener('pointerdown', function (e) { dragging = true; knob.classList.add('drag'); knob.setPointerCapture(e.pointerId); e.preventDefault(); });
    knob.addEventListener('pointermove', function (e) { if (dragging) fromPointer(e); });
    var stop = function () { dragging = false; knob.classList.remove('drag'); };
    knob.addEventListener('pointerup', stop);
    knob.addEventListener('pointercancel', stop);
    knob.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -2 : e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 2 : 0;
      if (d) { st[cur] = clamp(st[cur] + d, 0, 100); draw(); e.preventDefault(); }
    });
    setC('carat');
  })();

  // the fixed bar hands the number over to the #moment form and scrolls to it
  fab.addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('vnum').value = document.getElementById('fabnum').value;
    window.scrollTo({ top: 4834 * scale + run + labRun + repRun, behavior: 'smooth' });
    setTimeout(function () { document.getElementById('vnum').focus({ preventScroll: true }); }, 700);
  });

  fitWords();
  fitTitles();
  fit();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fitWords(); fitTitles(); render(); });
  window.addEventListener('resize', fit);
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="#lab"]');
    if (a) { e.preventDefault(); window.scrollTo({ top: run + yLab + 1, behavior: 'smooth' }); }
  });
  window.addEventListener('scroll', onScroll, { passive: true });
})();
