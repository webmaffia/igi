const fs = require('fs');
const H = 8552, W = 1920;
const px = (n) => (Math.round(n * 1000) / 1000) + 'px';
// figma inset percentages (top,right,bottom,left) -> absolute px box on the stage
const inset = (t, r, b, l) => {
  const top = H * t / 100, left = W * l / 100;
  return `left:${px(left)};top:${px(top)};width:${px(W * (100 - l - r) / 100)};height:${px(H * (100 - t - b) / 100)}`;
};
const img = (name, ext = 'svg', extra = '') => `<img src="assets/${name}.${ext}" alt="" ${extra}>`;
const box = (style, inner = '', cls = '') => `<div class="a ${cls}" style="${style}">${inner}</div>`;
// rotated element: centred in a w x h box at left/top, rotated by deg
const rot = (l, t, w, h, deg, inner, cls = '') =>
  `<div class="a rc ${cls}" style="left:${l}px;top:${t}px;width:${w}px;height:${h}px"><div style="transform:rotate(${deg}deg)">${inner}</div></div>`;
// thin line image centred at (cx,cy), length len, rotated deg
const line = (cx, cy, len, deg, name) =>
  `<div class="a" style="left:${px(cx - len / 2)};top:${px(cy)};width:${len}px;height:0;transform:rotate(${deg}deg)"><img class="ln${/^line(13|14|15|16|17|8|9)$/.test(name) ? ' thin' : ''}" src="assets/${name}.svg" alt=""></div>`;

const out = [];
const push = (s) => out.push(s);

/* ---------- backgrounds ---------- */
const bg = (top, h) => box(`left:0;top:${top}px;width:1920px;height:${h}px;opacity:.5;background:radial-gradient(ellipse 960px ${h / 2}px at 50% 50%,#f8f8f8 0,rgba(189,189,189,.62) 69.7%,#d1d1d1 100%)`);
push(box(inset(24.69, 13.75, 64.58, 26.25), img('glow', 'svg', 'class="fill"')));
push(bg(1093, 1533));
push(bg(4834, 1174));
push(box(inset(45.15, 10.31, 44.11, 29.69), img('glow1', 'svg', 'class="fill"')));
push(bg(0, 1093));
push(box(inset(0.12, 22.66, 89.14, 17.34), img('glow1', 'svg', 'class="fill"')));
push(bg(7459, 1093));

/* ---------- header ---------- */
push(box('left:74px;top:40px;width:154px;height:66px', img('untitled21', 'png', 'class="cover"')));
push(`<nav class="a" style="left:732px;top:49px;width:357px;height:24px">
  <a class="navlink" href="#customers" style="left:0">Customers</a>
  <a class="navlink" href="#industry" style="left:147px">Industry</a>
  <a class="navlink" href="#about" style="left:284px">About IGI</a></nav>`);
const hbtn = (frame, label) => `<a class="hbtn" href="#">${img(label ? 'ibtn' : 'ibtn', 'svg', 'class="hbg"')}${img(frame, 'svg', 'class="hico"')}</a>`;
const hpill = (bgName, frame, label, w) => `<a class="hpill" href="#" style="width:${w}px">${img(bgName, 'svg', 'class="hbg"')}<span class="hin">${frame ? img(frame, 'svg', 'class="hico"') : ''}<span class="inter">${label}</span></span></a>`;
push(`<div class="a hdr-row" style="left:1470px;top:30px">` +
  hbtn('frame') + hbtn('frame1') + hpill('pill', 'frame2', 'Verify Report', 146.5) + hbtn('frame3') + hpill('pill1', null, 'Menu', 79) + `</div>`);

/* ---------- hero ---------- */
// hero ring: circle outline + rotatable quarter disc (wedge + arc) + cross lines that appear last
push(`<div class="a" id="hero-ring">` +
  box('left:579px;top:261px;width:680px;height:680px', img('ellipse2', 'svg', 'class="fill"')) +
  `<div class="a" id="wedge" style="left:579px;top:261px;width:680px;height:680px">` +
    `<div class="a" style="left:50%;right:0;top:0;bottom:50%">${img('ellipse3', 'svg', 'class="fill"')}</div>` +
    `<div class="a" style="left:50%;top:0;width:50%;height:50%"><div class="a" style="inset:-0.74% -0.74% 0 0">${img('ellipse4', 'svg', 'class="fill"')}</div></div>` +
  `</div>` +
  `<div class="a late" data-d="0" style="left:0;top:0">` +
  line(919, 601, 921, 90, 'line13') + line(919, 601, 920, 0, 'line14') +
  line(919, 601, 920.008, 45, 'line15') + line(919, 601, 920.008, 135, 'line17') +
  `</div></div>`);

// scroll-driven words: the diamond sits where the O is; STONE is the final word
const words = [['L', 'VE'], ['C', 'LOR'], ['GR', 'WN'], ['ST', 'NE']];
push(`<div class="a" id="words" style="left:0;top:0">` + words.map((w, i) =>
  `<div class="word${i === words.length - 1 ? ' final' : ''}" data-i="${i}"><span class="wl">${w[0]}</span><span class="wr">${w[1]}</span></div>`).join('') + `</div>`);
push(box('left:595px;top:371px;width:640px;height:427px', img('diamond', 'png', 'class="cover"')));
push(box('left:119px;top:221px;font-size:63.8px;line-height:278.538px;letter-spacing:5px;color:#1e1e1e', 'Every', 'mont4 caps nw late" data-d="0'));
push(box('left:126px;top:705px;font-size:63.8px;line-height:69px;letter-spacing:5px;color:#cbb4a0', 'Carries', 'mont6 caps nw late" data-d="1'));
push(box('left:126px;top:774px;font-size:63.8px;line-height:69px;letter-spacing:5px;color:#080808', 'a Story', 'mont6 caps nw late" data-d="2'));
push(box('left:325px;top:875px;transform:translateX(-50%);font-size:36.7px;line-height:36.317px;letter-spacing:1.4px;color:#111;text-align:center', 'We make sure it’s true', 'man4 nw late" data-d="3'));
const btn = (top, label, arrow, cls, d) => `<a class="btn ${cls} late" data-d="${d}" href="#" style="left:1571px;top:${top}px"><span>${label}</span>${img(arrow, 'svg', 'class="btn-arrow"')}</a>`;
push(btn(716.3, 'EXPLORE IGI', 'arrow', 'solid', 4));
push(btn(773.88, 'VERIFY A REPORT', 'arrow1', 'ghost', 5));
push(line(960.5, 3598.5, 1649, 0, 'line18'));
push(box('left:calc(50% + 1.44px);top:1720px;width:2818.874px;height:2930.301px;transform:translateX(-50%)', img('maskgroup', 'svg', 'class="fill"')));

/* ---------- natural vs lab ---------- */
push(box('left:699px;top:1218px;font-size:64px;line-height:103.054px;color:#ccb4a0', 'ONE WAS BORN', 'mont6 caps nw'));
push(box('left:472px;top:1292px;font-size:64px;line-height:103.054px;color:#1e1e1e', 'in the earth One in a lab', 'mont6 caps nw'));
push(box('left:980px;top:1406px;width:764px;height:131px;transform:translateX(-50%);text-align:center;letter-spacing:1px;color:#111;font-size:20px;line-height:26px', 'Natural diamonds form deep underground over millions of years. Lab-grown diamonds form in weeks. Chemically and optically they are the same. <span style="color:#000">So how can you tell them apart?</span>', 'man3'));
// diagram
push(box('left:571.47px;top:1633.46px;width:777.058px;height:777.058px', img('ellipse12', 'svg', 'class="fill"')));
push(rot(960.01, 1633.46, 388.529, 777.058, 0,
  `<div style="position:relative;width:777.058px;height:388.529px;transform:rotate(90deg)"><div class="a" style="inset:-0.64% -0.32% 0 -0.32%">${img('ellipse17', 'svg', 'class="fill"')}</div></div>`).replace('<div style="transform:rotate(0deg)">', '<div>'));
push(line(1349, 2029, 8, 0, 'line10').replace('left:1345px', 'left:1345px'));
push(line(960, 1630, 8, 90, 'line11'));
push(box('left:calc(50% + .11px);top:1852px;width:542px;height:361px;transform:translateX(-50%)', img('diamond', 'png', 'class="cover"')));
push(`<div class="a" style="left:calc(50% + .21px);top:1851.55px;width:541.785px;height:361.19px;transform:translateX(-50%);-webkit-mask:url(assets/diamondmask.svg) 13.215px -60.888px/257.974px 477.491px no-repeat;mask:url(assets/diamondmask.svg) 13.215px -60.888px/257.974px 477.491px no-repeat;mix-blend-mode:screen"><img class="cover" style="opacity:.96" src="assets/diamond.png" alt=""></div>`);
push(box('left:502.18px;top:1564.17px;width:915.642px;height:915.642px', img('ellipse13', 'svg', 'class="fill"')));
push(line(960, 2029, 1060, 90, 'line8'));
push(line(960, 2411, 8, 90, 'line11'));
push(line(960, 2029, 1060, 0, 'line9'));
push(box('left:903.91px;top:1965.89px;width:112.187px;height:112.187px', img('ellipse14', 'svg', 'class="fill"')));
push(box(inset(18.78, 48.97, 81.09, 48.97).replace(/top:[^;]+;/, 'top:1605.9px;').replace(/height:[^;]+/, 'height:11.1px'),
  `<div class="a" style="inset:-2.94% -1.47%">${img('group26', 'svg', 'class="fill"')}</div>`));
push(line(571, 2030, 8, 0, 'line10'));

const side = (left, top, eyebrow, l1, l2, body, lh) => {
  push(box(`left:${left}px;top:${top}px`, eyebrow, 'eyebrow'));
  push(box(`left:${left}px;top:${top + 96}px`, `<span style="color:#ccb4a0">${l1}</span><br><span style="color:#000">${l2}</span>`, 'h50'));
  push(box(`left:${left + 2}px;top:${top + 222}px;width:282px`, body, 'body18'));
};
side(126, 1815, 'NATURAL DIAMOND', 'FORMED', 'BY TIME', 'Created deep within the Earth under intense heat and pressure over millions of years.');
side(1511, 1795, 'LAB-GROWN DIAMOND', 'GROWN', 'BY SCIENCE', 'Created deep within the Earth under intense heat and pressure over millions of years.');

/* ---------- process / inscription ---------- */
push(box('left:126px;top:2770px', 'STEP ONE', 'eyebrow'));
push(box('left:126px;top:2866px', '<span style="color:#ccb4a0">It arrives</span><br><span style="color:#000">without a name.</span>', 'h50'));
push(box('left:128px;top:2992px;width:387px', 'Every stone is logged anonymously. Our graders never know who sent it \u2014 so nothing but the stone itself can influence the result.', 'body18'));
push(box('left:973px;top:2846px;width:567px;height:248px;background:#fbfbfb'));
push(rot(947, 3052, 81.962, 81.962, -150, `<div style="position:relative;width:60px;height:60px"><div class="a" style="left:6.7%;right:6.7%;top:0;bottom:25%">${img('polygon1', 'svg', 'class="fill"')}</div></div>`));
push(box('left:1011.99px;top:2866px', 'Intake', 'eyebrow'));
push(box('left:1011.99px;top:2914px;color:#ccb4a0', 'Sample A\u201148213', 'h50'));
push(box('left:1011.99px;top:2969px;width:387px', 'Client identity: anonymised', 'body18'));
push(box('left:77px;top:3241px;width:1843px;height:30px;font-size:257.706px;line-height:88.526px;color:#010101;display:flex;align-items:center', 'Inscription', 'mont7 caps'));
push(box('left:calc(50% + 20px);top:3047px;width:582px;height:388px;transform:translateX(-50%)', img('diamond', 'png', 'class="cover"')));
push(`<div class="a steps" style="left:136px;top:3526px;width:1700px;height:65.5px">` +
  ['Intake ', 'Screening', 'Grading', 'Inscription', 'Report'].map((s, i) => `<span class="${i ? 'mont6' : 'mont7'}" style="left:${[0, 331, 663, 995, 1331][i]}px">${s}</span>`).join('') + `</div>`);
push(box('left:137px;top:3597.5px;width:319px;height:0', `<div class="a" style="inset:-1px 0">${img('vector1', 'svg', 'class="fill"')}</div>`));

/* ---------- reports ---------- */
push(`<span id="reports"></span>`);
push(box('left:116px;top:4057px', 'The Report', 'eyebrow'));
push(box('left:116px;top:4153px;width:459px', '<span style="color:#ccb4a0">A promise,</span><br><span style="color:#000">written down.</span>', 'h50'));
push(box('left:118px;top:4279px;width:387px', 'Every stone, setting and story deserves the right document. Explore IGI\u2019s family of reports.', 'body18'));
[1112, 1050, 977, 896, 790, 613].forEach((x, i, arr) => {
  const active = x === 613;
  push(`<article class="card${active ? ' on' : ''}">` +
    box(`left:${x}px;top:3946px;width:569px;height:569px`, img('ellipse18', 'svg', 'class="fill"')) +
    box(`left:${x + 145}px;top:4276px;width:301px;font-size:16px;line-height:28.1px`, 'Reports overview 01 Natural Diamond Report A complete assessment of a natural diamond\u2019s 4Cs, proportions and characteristics.', 'body') +
    box(`left:${x + 135}px;top:4109px;width:459px`, 'Natural Diamond<br>Report', 'h50 ct') +
    box(`left:${x + 145}px;top:4386px;width:129px`, '<a href="#">Learn more</a>', 'eyebrow') +
    box(`left:${x + 135}px;top:4043px`, 'ONE', 'eyebrow') +
    `<div class="a rc" style="left:${x + 226}px;top:4574px;width:44px;height:201px"><div class="eyebrow" style="transform:rotate(-90deg);width:201px;height:44px">Buying a diamond</div></div>` +
    `<div class="a" style="left:${x + 284.5}px;top:4515px;width:0;height:319px"><div style="position:absolute;left:0;top:0;width:319px;height:1px;transform-origin:0 0;transform:rotate(90deg)"><img class="ln" src="assets/vector2.svg" alt=""></div></div>` +
    `</article>`);
});

/* ---------- yes ---------- */
push(box('left:calc(50% - 75px);top:5018px;width:1158px;height:332px;transform:translateX(-50%);text-align:center;font-size:105.363px;line-height:103.054px;color:#1e1e1e', 'Somewhere, someone is about to say <span style="color:#ccb4a0">yes.</span>', 'mont5 cap'));
push(box('left:884.5px;top:5350px;width:785px;height:133px;transform:translateX(-50%);text-align:center;font-size:24px;line-height:47.09px;letter-spacing:1px;color:#111', 'Before they do, they deserve to know that what they\u2019re holding is exactly what they were promised. It takes one number.', 'man4'));

/* ---------- carat wheel ---------- */
const cx = 859, cy = 6589;
push(`<div class="a" id="wheel">` +
  box('left:519px;top:6249px;width:680px;height:680px', img('ellipse5', 'svg', 'class="fill"')) +
  box('left:519px;top:6249px;width:680px;height:680px', `<div class="a" style="left:50%;right:0;top:0;bottom:50%">${img('ellipse6', 'svg', 'class="fill"')}</div>`) +
  box('left:859px;top:6249px;width:340px;height:340px', `<div class="a" style="inset:-0.74% -0.74% 0 0">${img('ellipse7', 'svg', 'class="fill"')}</div>`) +
  rot(886, 6239.1, 698.602, 698.602, 0, `<div style="position:relative;width:493.986px;height:493.986px;transform:rotate(45deg)"><div class="a" style="inset:-0.51% -0.51% 0 0">${img('ellipse8', 'svg', 'class="fill"')}</div></div>`).replace('<div style="transform:rotate(0deg)">', '<div>') +
  line(cx, cy, 921, 90, 'line13') + line(cx, cy, 920, 0, 'line16') +
  line(cx, cy, 920.008, 45, 'line15') + line(cx, cy, 920.008, 135, 'line17') +
  box('left:549.5px;top:6397px;width:607px;height:404px', img('diamond', 'png', 'class="cover"')) + `</div>`);
const L = (c, l, t, w, h, d, col, s = 32, iw, ih) => rot(l, t, w, h, d, `<p class="mont6 caps nw" style="font-size:${s}px;line-height:65.5px;letter-spacing:3.5px;color:${col}${iw ? `;width:${iw}px;height:${ih}px` : ''}">${c}</p>`);
const gold = '#957d69', blk = '#010101';
[['C', 1045, 6259, 56.307, 67.434, 34.46], ['A', 1065, 6276, 59.968, 66.532, 38.66], ['r', 1084, 6297, 63.66, 63.619, 45.04], ['A', 1105.05, 6321.14, 65.777, 61.108, 49.51], ['t', 1122, 6345, 64.429, 56.221, 52.25]]
  .forEach(a => push(L(a[0], a[1], a[2], a[3], a[4], a[5], gold)));
[['C', 1125.79, 6772, 67.434, 56.307, 124.46], ['o', 1110.94, 6792, 65.282, 58.406, 128.66], ['l', 1094.43, 6811, 60.788, 60.834, 135.04], ['o', 1067.69, 6832.05, 63.39, 67.725, 139.51], ['r', 1047.84, 6849, 59.384, 66.878, 142.25]]
  .forEach(a => push(L(a[0], a[1], a[2], a[3], a[4], a[5], blk)));
[['C', 549.58, 6324.7, 65.452, 59.885, -50.25], ['u', 568.71, 6301.45, 65.563, 64.523, -46.05], ['t', 591.88, 6284.96, 57.526, 63.57, -39.67]]
  .forEach(a => push(L(a[0], a[1], a[2], a[3], a[4], a[5], blk)));
[['C', 628.87, 6857.96, 55.795, 67.653, -146.24], ['l', 608.13, 6844.56, 56.362, 64.342, -142.05], ['a', 582.01, 6824.23, 63.293, 63.978, -135.66], ['r', 558.52, 6802.84, 65.471, 61.527, -131.19], ['i', 548.26, 6791.09, 58.526, 49.658, -128.45], ['t', 532.52, 6774.47, 65.168, 54.942, -125.96], ['y', 515.18, 6751.07, 68.164, 52.033, -119.98]]
  .forEach(a => push(L(a[0], a[1], a[2], a[3], a[4], a[5], blk)));
// 0.25 tick labels
[[49.02, [1237.21, 6212.94, 42.066, 38.434], [1244.99, 6220.11, 46.244, 43.062], [1255.74, 6234.41, 46.244, 43.062]],
 [67.67, [1338.71, 6372.13, 47.219, 27.246], [1343.62, 6381.61, 50.052, 32.559], [1349.23, 6398.6, 50.052, 32.559]],
 [90.77, [1377.68, 6566.17, 46.988, 10.835], [1378.27, 6577.11, 47.905, 16.243], [1376.77, 6594.94, 47.905, 16.243]],
 [110.72, [1353.39, 6737.91, 47.436, 26.125], [1348.38, 6748.42, 50.136, 31.471], [1340.88, 6764.66, 50.136, 31.471]],
 [132.11, [1258.84, 6904.09, 41.605, 38.99], [1248.49, 6912.74, 45.851, 43.561], [1235.59, 6925.14, 45.851, 43.561]]]
  .forEach(([d, a, b, c]) => {
    push(L('0', a[0], a[1], a[2], a[3], d, gold, 13, 10.207, 46.855));
    push(L('.2', b[0], b[1], b[2], b[3], d, gold, 13, 15.604, 47.7));
    push(L('5', c[0], c[1], c[2], c[3], d, gold, 13, 15.604, 47.7));
  });
push(box('left:1356px;top:6278px;width:13px;height:13px', img('ellipse20', 'svg', 'class="fill"')));
push(box('left:1272px;top:6282px;width:21px;height:22px', img('ellipse21', 'svg', 'class="fill"')));
push(box('left:1278px;top:6288px;width:10px;height:10px', img('ellipse22', 'svg', 'class="fill"')));
push(box('left:113px;top:6403px', 'For Customers', 'eyebrow'));
push(box('left:113px;top:6498px;width:330px;color:#ccb4a0', 'Know<br>what<br>you\u2019re<br>looking<br>at.', 'h50'));
push(box('left:1555px;top:6387px', 'CARAT', 'eyebrow'));
push(box('left:1559px;top:6525px;font-size:16px;line-height:54.831px;color:#000', '\u2248 0.11 grams', 'mont6 caps nw'));
push(box('left:1555px;top:6483px;width:209px;color:#957d69', '0.55 ct', 'h50'));
push(box('left:1557px;top:6591px;width:261px', 'Carat measures weight, not size. One carat equals 0.2 grams \u2014 and larger stones are rarer.', 'body18'));
push(box('left:1555px;top:6750px', '<a href="#" style="text-decoration:underline">Full experience</a>', 'eyebrow'));

/* ---------- outro ---------- */
push(box('left:calc(50% - 222.99px);top:7489px', 'The Gemologists \u00b7 School of Gemology', 'eyebrow'));
push(box('left:calc(50% + 5.5px);top:7740px;width:1419px;height:662px;transform:translateX(-50%);text-align:center;font-size:94.9px;line-height:103.054px;color:#1e1e1e', 'Behind every grade is a trained eye, a steady hand and years of practice. We don\u2019t just grade diamonds \u2014 we teach the world how.', 'mont5 cap'));
push(box('left:calc(50% - 24.56px);top:6415px;width:2818.874px;height:2930.301px;transform:translateX(-50%)', img('maskgroup1', 'svg', 'class="fill"')));

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>IGI \u2013 Every Stone Carries a Story</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400&family=Manrope:wght@300;400&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body>
<div id="viewport"><div id="pin"><main id="stage">
${out.join('\n')}
</main></div></div>
<script src="script.js"></script>
</body>
</html>`;
fs.writeFileSync(require('path').join(__dirname, '..', 'index.html'), html);
console.log('ok', html.length);
