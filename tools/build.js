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
  `<div class="a" style="left:${px(cx - len / 2)};top:${px(cy)};width:${len}px;height:0;transform:rotate(${deg}deg)"><img class="ln${/^line(13|14|15|16|17|18|8|9)$/.test(name) ? ' thin' : ''}" src="assets/${name}.svg" alt=""></div>`;

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
push(bg(7050, 1093)); // closing section's background, pulled up 409px to remove the empty gap below the wheel

/* ---------- header ---------- */
push('<div class="a" id="site-header" style="left:0;top:0">');
push(box('left:74px;top:40px;width:154px;height:66px', img('untitled21', 'png', 'class="cover"')));
push(`<nav class="a" style="left:732px;top:49px;width:357px;height:24px">
  <a class="navlink" href="#customers" style="left:0">Customers</a>
  <a class="navlink" href="#industry" style="left:147px">Industry</a>
  <a class="navlink" href="#about" style="left:284px">About IGI</a></nav>`);
const hbtn = (frame, label) => `<a class="hbtn" href="#">${img(label ? 'ibtn' : 'ibtn', 'svg', 'class="hbg"')}${img(frame, 'svg', 'class="hico"')}</a>`;
const hpill = (bgName, frame, label, w) => `<a class="hpill" href="#" style="width:${w}px">${img(bgName, 'svg', 'class="hbg"')}<span class="hin">${frame ? img(frame, 'svg', 'class="hico"') : ''}<span class="inter">${label}</span></span></a>`;
push(`<div class="a hdr-row" style="left:1470px;top:30px">` +
  hbtn('frame') + hbtn('frame1') + hpill('pill', 'frame2', 'Verify Report', 146.5) + hbtn('frame3') + hpill('pill1', null, 'Menu', 79) + `</div>`);
push('</div>');

/* ---------- hero ---------- */
push(`<div class="a" id="hero" style="left:0;top:0">`);
// hero ring: circle outline + rotatable quarter disc (wedge + arc) + cross lines that appear last
push(`<div class="a" id="hero-ring">` +
  box('left:579px;top:261px;width:680px;height:680px', img('ellipse2', 'svg', 'class="fill"')) +
  box('left:579px;top:261px;width:680px;height:680px', '', 'fill-disc" id="fill') +
  `<div class="a" id="wedge" style="left:579px;top:261px;width:680px;height:680px">` +
    `<div class="a" style="left:50%;right:0;top:0;bottom:50%">${img('ellipse3', 'svg', 'class="fill"')}</div>` +
    `<div class="a" style="left:50%;top:0;width:50%;height:50%"><div class="a" style="inset:-0.74% -0.74% 0 0">${img('ellipse4', 'svg', 'class="fill"')}</div></div>` +
  `</div>` +
  `<div class="a" style="left:0;top:0">` +
  line(919, 601, 921, 90, 'line13') + line(919, 601, 920, 0, 'line14') +
  line(919, 601, 920.008, 45, 'line15') + line(919, 601, 920.008, 135, 'line17') +
  `</div></div>`);

// STONE stays put; the picture in the O and the copy on the right change with every scroll step
// (centre of the ring: 919,601). Each picture is centred in the ring at its own width.
const ring = (w, h, name, ext = 'png', dy = 0) => `<div class="a cimg" style="left:${919 - w / 2}px;top:${601 - h / 2 + dy}px;width:${w}px;height:${h}px"><img src="assets/hero/circle/${name}.${ext}" alt="" draggable="false" class="cover"></div>`;
const CIMGS = [
  ring(460, 455, 1),
  ring(482, 460, 2),
  ring(365, 360, 4, 'png', 8),
  ring(520, 332, 5),
  `<div class="a cimg" style="left:595px;top:371px;width:640px;height:427px">${img('diamond', 'png', 'class="cover" draggable="false"')}</div>`
];
push(`<div class="a" id="words" style="left:0;top:0"><div class="word final"><span class="wl">ST</span><span class="wr">NE</span></div>` + CIMGS.join('') + `</div>`);
push(box('left:119px;top:221px;font-size:63.8px;line-height:278.538px;letter-spacing:5px;color:#1e1e1e', 'Every', 'mont4 caps nw'));
const COPY = [['Has been', 'graded'], ['Has', 'fairness'], ['Has', 'protection'], ['Has', 'truth'], ['Carries', 'a Story']];
COPY.forEach((c, i) => {
  push(box('left:1352px;top:705px;font-size:63.8px;line-height:69px;letter-spacing:5px;color:#cbb4a0', c[0], 'mont6 caps nw hc" data-i="' + i));
  push(box('left:1352px;top:774px;font-size:63.8px;line-height:69px;letter-spacing:5px;color:#080808', c[1], 'mont6 caps nw hc" data-i="' + i));
});
// first screen: the four graded qualities, right-aligned against the diamond (they leave with the first picture)
[['Cut', 737, 472], ['Color', 710, 537], ['Clarity', 710, 630], ['Carat', 737, 710]].forEach((l) =>
  push(box(`left:${l[1] - 200}px;top:${l[2] - 12}px;width:200px;text-align:right;font-size:17px;line-height:24px;letter-spacing:1px;color:#222`, l[0], 'mont4 caps nw hc" data-i="0')));
push(box('left:1352px;top:861px;font-size:36.7px;line-height:36.317px;letter-spacing:1.4px;color:#111', 'We make sure it’s true', 'man4 nw late" data-d="0'));
const btn = (left, label, arrow, cls, d) => `<a class="btn ${cls} late" data-d="${d}" href="#" style="left:${left}px;top:957px"><span>${label}</span>${img(arrow, 'svg', 'class="btn-arrow"')}</a>`;
push(btn(1352, 'EXPLORE IGI', 'arrow', 'solid', 1));
push(btn(1565, 'VERIFY A REPORT', 'arrow1', 'ghost', 2));
// last scroll phase: the diamond blurs and a bigger circle with the video pops up over it; the play button starts the video
push(`<div class="a" id="vid" style="left:439px;top:121px;width:960px;height:960px"><img class="cover" src="assets/hero/circle/vIDEOTHUMB.png" alt="" draggable="false"><video id="vidv" class="cover" src="assets/hero/circle/video.mp4" preload="none" playsinline controls controlslist="nodownload noplaybackrate" style="opacity:0;pointer-events:none"></video><button id="vplay" type="button" aria-label="Play video"><img src="assets/hero/circle/play-button.png" alt="" draggable="false"></button></div>`);
push('</div>');
push(line(960.5, 3598.5, 1649, 0, 'line18'));
push(box('left:calc(50% + 1.44px);top:1720px;width:2818.874px;height:2930.301px;transform:translateX(-50%)', img('maskgroup', 'svg', 'class="fill"'), 'nopt'));

/* ---------- natural vs lab ---------- */
push(box('left:699px;top:1218px;font-size:64px;line-height:103.054px;color:#ccb4a0', 'ONE WAS BORN', 'mont6 caps nw'));
push(box('left:462px;top:1292px;font-size:64px;line-height:103.054px;color:#1e1e1e', 'in the earth, One in a lab', 'mont6 caps nw'));
push(box('left:980px;top:1406px;width:764px;height:131px;transform:translateX(-50%);text-align:center;letter-spacing:1px;color:#111;font-size:20px;line-height:26px', 'Natural diamonds form deep underground over millions of years. Lab-grown diamonds form in weeks. Chemically and optically they are the same. <span style="color:#000">So how can you tell them apart?</span>', 'man3'));
// diagram
push(box('left:571.47px;top:1633.46px;width:777.058px;height:777.058px', img('ellipse12', 'svg', 'class="fill"')));
// grey half-arc + its two end ticks: right half for lab-grown, mirrored left half for natural
const ARC = (id, extra) => `<div class="a" id="${id}" style="left:571.47px;top:1633.46px;width:777.058px;height:777.058px;${extra}">` +
  `<div class="a rc" style="left:388.53px;top:0;width:388.529px;height:777.058px"><div style="flex:none;position:relative;width:777.058px;height:388.529px;transform:rotate(90deg)"><div class="a" style="inset:-0.64% -0.32% 0 -0.32%">${img('ellipse17', 'svg', 'class="fill"')}</div></div></div>` +
  line(388.53, -3.46, 8, 90, 'line11') + line(388.53, 777.54, 8, 90, 'line11')  + `</div>`;
push(ARC('arc', 'opacity:0'));
push(ARC('arcL', 'transform:scaleX(-1);opacity:0'));
push(line(1349, 2029, 8, 0, 'line10').replace('left:1345px', 'left:1345px'));
push(box('left:502.18px;top:1564.17px;width:915.642px;height:915.642px', img('ellipse13', 'svg', 'class="fill"')));
push(line(960, 2029, 1060, 90, 'line8'));
push(line(960, 2029, 1060, 0, 'line9'));
// draggable natural / lab-grown comparison: natural on the left of the handle, lab-grown on the right
push(`<div class="a cmp" id="cmp" style="left:689px;top:1791px;width:542px;height:477px">` +
  img('natural', 'png', 'class="fill" draggable="false"') +
  img('lab', 'png', 'class="fill" id="cmp-lab" draggable="false" style="clip-path:inset(0 0 0 50%)"') + `</div>`);
push(`<div class="a knob" id="knob" role="slider" tabindex="0" aria-label="Compare natural and lab-grown diamond" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" style="left:903.91px;top:1965.89px;width:112.187px;height:112.187px">` +
  img('ellipse14', 'svg', 'class="fill" draggable="false"') +
  `<div class="a" style="left:35.7px;top:48.7px;width:40.7637px;height:14.8479px">${img('group26', 'svg', 'class="fill" draggable="false"')}</div></div>`);
push(line(571, 2030, 8, 0, 'line10'));

const side = (left, top, eyebrow, l1, l2, body, cta, id) => {
  // every heading uses the same size (38px) so the longest line ("BY INNOVATION") ends before the outer ring
  const HS = 'font-size:38px;line-height:42px';
  const HT = `<span style="color:#ccb4a0">${l1}</span><br><span style="color:#000">${l2}</span>`;
  push(`<div class="a side" id="${id}" style="left:0;top:0">`);
  if (cta) {
    // long copy (shown while dragging): no small label of its own, so its big heading starts at the height of the small label on the other side
    push(box(`left:${left}px;top:${top}px;${HS}`, HT, 'h50'));
    push(box(`left:${left + 2}px;top:${top + 104}px;width:300px`, body, 'body18'));
    push(box(`left:${left + 2}px;top:${top + 330}px`, `<a href="#">${cta}</a>`, 'eyebrow clink'));
  } else {
    // original design copy (shown at the start, with the handle in the middle)
    push(box(`left:${left}px;top:${top}px`, eyebrow, 'eyebrow'));
    push(box(`left:${left}px;top:${top + 96}px;${HS}`, HT, 'h50'));
    push(box(`left:${left + 2}px;top:${top + 200}px;width:282px`, body, 'body18'));
  }
  push('</div>');
};
const NAT = ['NATURAL DIAMOND', 'Shaped', 'by nature', 'Born deep within the Earth, natural diamonds form over billions of years under extraordinary heat and pressure. Rare, enduring and timeless, each carries a story shaped by nature — and no two are exactly alike.', 'Know more'];
const LAB = ['LAB-GROWN DIAMOND', 'Created', 'by innovation', 'Grown with advanced technology that replicates nature’s own process, lab-grown diamonds share the same physical, chemical and optical properties as natural ones. Modern in origin, identical in composition, and made to shine just as beautifully.', 'Know more'];
// all four copies share one top (1805) so the headings line up when the copy swaps sides;
// start (handle in the middle): the original short copy on each side; dragging brings in the longer copy on the side you drag toward
const ORIG = 'Created deep within the Earth under intense heat and pressure over millions of years.';
side(126, 1805, 'NATURAL DIAMOND', 'FORMED', 'BY TIME', ORIG, null, 'txt-natL');
side(1511, 1805, 'LAB-GROWN DIAMOND', 'GROWN', 'BY SCIENCE', ORIG, null, 'txt-labR');
side(126, 1805, ...LAB, 'txt-labL');
side(1480, 1805, ...NAT, 'txt-natR');

/* ---------- process / inscription (#lab: pinned, five scroll-driven steps) ---------- */
const STEPS = [
  { n: 'Step one',   h1: 'It arrives',       h2: 'without a name.', p: 'Every stone is logged anonymously. Our graders never know who sent it \u2014 so nothing but the stone itself can influence the result.', tab: 'Intake' },
  { n: 'Step two',   h1: 'We ask where',     h2: 'it came from.',   p: 'Advanced screening instruments confirm whether a diamond is natural or laboratory-grown, and detect treatments invisible to the eye.', tab: 'Screening', link: 'How gems are tested' },
  { n: 'Step three', h1: 'Several experts.', h2: 'One standard.',   p: 'Multiple gemologists independently assess the 4Cs \u2014 Carat, Color, Clarity and Cut \u2014 under controlled lighting and magnification.', tab: 'Grading', link: 'Explore the 4Cs' },
  { n: 'Step four',  h1: 'A signature,',     h2: 'in light.',       p: 'A microscopic laser inscription on the girdle links the stone permanently to its report \u2014 invisible to the eye, readable under a loupe.', tab: 'Inscription', link: 'Laser inscription' },
  { n: 'Step five',  h1: 'Its story,',       h2: 'on record.',      p: 'A secure IGI report is issued and stored online \u2014 so anyone, anywhere, can verify it in seconds.', tab: 'Report', link: 'Verify a report' }
];
const cardX = 1011.99;
const cardLink = (t) => t ? box('left:1240px;top:2866px;width:270px;text-align:right', `<a href="#">${t}</a>`, 'eyebrow clink') : '';
const CARDS = [
  box(`left:${cardX}px;top:2866px`, 'Intake', 'eyebrow') + box(`left:${cardX}px;top:2914px;color:#ccb4a0`, 'Sample A\u201148213', 'h50') + box(`left:${cardX}px;top:2969px;width:387px`, 'Client identity: anonymised', 'body18'),
  box(`left:${cardX}px;top:2866px`, 'Screening', 'eyebrow') + box(`left:${cardX}px;top:2914px;color:#ccb4a0`, 'Natural origin', 'h50') +
    box(`left:${cardX}px;top:2975px;width:480px`, '<div class="ok">Origin confirmed</div><div class="ok">No treatment detected</div><div class="ok">Not a simulant</div>', 'body18 oklist'),
  box(`left:${cardX}px;top:2866px`, 'Grading', 'eyebrow') +
    [['Carat', '1.02', 0, 0], ['Color', 'F', 250, 0], ['Clarity', 'VVS2', 0, 80], ['Cut', 'Excellent', 250, 80]].map(c =>
      box(`left:${cardX + c[2]}px;top:${2916 + c[3]}px`, `<span class="cl">${c[0]}</span><span class="cv">${c[1]}</span>`, 'callout')).join(''),
  box(`left:${cardX}px;top:2866px`, 'Inscription', 'eyebrow') + box(`left:${cardX}px;top:2914px;color:#ccb4a0`, 'Laser etched', 'h50') +
    box(`left:${cardX}px;top:2985px`, 'GIRDLE \u00b7 <span class="typed"><span>IGI XX000000000</span></span>', 'inscr'),
  box(`left:${cardX}px;top:2866px`, 'Report', 'eyebrow') + box(`left:${cardX}px;top:2914px;color:#ccb4a0`, 'Report issued', 'h50') +
    box(`left:${cardX}px;top:2969px;width:420px`, 'Natural Diamond Report \u00b7 No. XX 000 000 000<br>Verify online \u00b7 igi.org', 'body18')
];
push('<div class="a" id="lab" data-s="0" style="left:0;top:0;width:1920px">');
STEPS.forEach((st, i) => push(`<div class="a lstep${i ? '' : ' on'}" data-i="${i}" style="left:0;top:0">` +
  box('left:126px;top:2770px', st.n, 'eyebrow') +
  box('left:126px;top:2866px', `<span style="color:#ccb4a0">${st.h1}</span><br><span style="color:#000">${st.h2}</span>`, 'h50') +
  box('left:128px;top:2992px;width:387px', st.p, 'body18') + `</div>`));
// the big word follows the step (the diamond stays centred over its middle letters)
STEPS.forEach((st, i) => push(box('left:0;top:3241px;width:1920px;height:30px;font-size:257.706px;line-height:88.526px;color:#010101;display:flex;align-items:center;justify-content:center;white-space:nowrap', st.tab, `mont7 caps lstep bigw${i ? '' : ' on'}" data-i="${i}`)));
push(box('left:calc(50% + 20px);top:3047px;width:582px;height:388px;transform:translateX(-50%)', img('diamond', 'png', 'class="cover"'), 'diaw'));
// Report step: a landscape grading-report page that sits above the big word, in the step-card column
const GRES = [['Shape &amp; Cut', 'Round Brilliant'], ['Carat Weight', '1.02 ct'], ['Color Grade', 'F'], ['Clarity Grade', 'VVS2'], ['Cut Grade', 'Excellent']];
const GADD = [['Polish', 'Excellent'], ['Symmetry', 'Excellent'], ['Fluorescence', 'None'], ['Inscription', 'IGI XX000000000']];
const rrows = (arr) => arr.map(r => `<div class="rpt-row"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('');
push(`<div class="a ov o4 rpt" style="left:973px;top:2772px;width:567px;height:346px">` +
  `<div class="rpt-in">` +
    `<div class="rpt-head">${img('social/logo', 'png', 'class="rpt-logo" draggable="false"')}<b>Natural Diamond Grading Report</b></div>` +
    `<div class="rpt-meta"><div><span>Report No.</span><b>XX 000 000 000</b></div><div><span>Date</span><b>00 Month 0000</b></div></div>` +
    `<div class="rpt-cols"><div class="rpt-col"><div class="rpt-sec">Grading Results</div>${rrows(GRES)}</div>` +
    `<div class="rpt-col"><div class="rpt-sec">Additional Information</div>${rrows(GADD)}</div></div>` +
    `<div class="rpt-foot"><div class="rpt-bar"></div><div class="rpt-ver"><span>Verify online</span><b>igi.org</b></div><div class="rpt-stamp">IGI<br>VERIFIED</div></div>` +
  `</div></div>`);
// overlays drawn over the diamond: scan (screening), guides (grading), laser (inscription), stamp (report)
push(`<svg class="a ovl" style="left:689px;top:3047px;width:582px;height:388px;overflow:visible;pointer-events:none" viewBox="0 0 582 388">
  <defs><mask id="dmask" maskUnits="userSpaceOnUse" x="0" y="0" width="582" height="388" style="mask-type:alpha"><image href="assets/diamond.png" x="0" y="0" width="582" height="388"/></mask></defs>
  <g class="ov o1" mask="url(#dmask)"><rect class="scanline" x="0" y="0" width="582" height="2" fill="#2FB8DD" opacity=".9"/><rect class="scanline" x="0" y="-12" width="582" height="16" fill="#2FB8DD" opacity=".2"/></g>
  <g class="ov o2" fill="none" stroke="#957d69" stroke-width="1" stroke-dasharray="7 7">
    <line x1="60" y1="418" x2="522" y2="418"/><line x1="60" y1="406" x2="60" y2="430"/><line x1="522" y1="406" x2="522" y2="430"/>
    <line x1="560" y1="70" x2="560" y2="372"/><circle cx="226" cy="150" r="20"/></g>
  <g class="ov o3"><line x1="700" y1="40" x2="406" y2="116" stroke="#FF5F7A" stroke-width="2"/><circle cx="406" cy="116" r="11" fill="#FF8FA2"/><circle cx="406" cy="116" r="29" fill="#FF5F7A" opacity=".25"/></g>
</svg>`);
// the card sits in front of the diamond (the diamond's top tucks behind it)
push(box('left:973px;top:2846px;width:567px;height:248px;background:#fbfbfb', '', 'cpanel'));
push(rot(947, 3052, 81.962, 81.962, -150, `<div class="cpoly" style="position:relative;width:60px;height:60px"><div class="a" style="left:6.7%;right:6.7%;top:0;bottom:25%">${img('polygon1', 'svg', 'class="fill"')}</div></div>`));
STEPS.forEach((st, i) => push(`<div class="a cstep${i ? '' : ' on'}" data-i="${i}" style="left:0;top:0">` + (i === 4 ? '' : CARDS[i] + cardLink(st.link)) + `</div>`));
push(`<div class="a steps" style="left:136px;top:3526px;width:1700px;height:65.5px">` +
  STEPS.map((st, i) => `<span class="${i ? 'mont6' : 'mont7 on'}" style="left:${[0, 331, 663, 995, 1331][i]}px">${st.tab}</span>`).join('') + `</div>`);
[[136, 319.29], [466.437, 318.49], [800.059, 318.49], [1129.7, 319.29], [1465.71, 319.29]].forEach(([x, w]) =>
  push(box(`left:${x}px;top:3597.5px;width:${w}px;height:1px;background:#000;transform-origin:0 50%;transform:scaleX(0)`, '', 'tabfill')));
push('</div>');

/* ---------- reports (#reports: pinned, nine stacked report cards driven by scroll) ---------- */
const REPORTS = [
  ['Natural Diamond', 'A complete assessment of a natural diamond\u2019s 4Cs, proportions and characteristics.'],
  ['Lab Grown Diamond', 'Clear disclosure of laboratory-grown origin, with the same rigorous 4Cs grading.'],
  ['Light Performance', 'Measures brilliance, fire and scintillation \u2014 how a diamond returns light.'],
  ['Fancy Colored Diamond', 'Hue, tone, saturation and origin of colour, beyond the D\u2013Z scale.'],
  ['Hearts & Arrows', 'Confirms precise optical symmetry with Hearts & Arrows imagery.'],
  ['Identification', 'Natural, laboratory-grown, treated or simulant \u2014 confirmed.'],
  ['Colored Stone', 'Species, variety and treatment disclosure for coloured gemstones.'],
  ['Jewellery', 'Metal, centre and accent stones of a finished piece, in one document.'],
  ['Pearl', 'Pearl type, size, shape, lustre, surface and colour.']
];
const NUMS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
push('<div class="a" id="reports" style="left:0;top:0;width:1920px">');
push(box('left:116px;top:4057px', 'The Report', 'eyebrow'));
push(box('left:116px;top:4153px;width:459px', '<span style="color:#ccb4a0">A promise,</span><br><span style="color:#000">written down.</span>', 'h50'));
push(box('left:118px;top:4279px;width:387px', 'Every stone, setting and story deserves the right document. Explore IGI\u2019s family of reports.', 'body18'));
push(box('left:118px;top:4395px', '<a href="#">Reports overview</a>', 'eyebrow clink'));
// card k is a 569px circle plus its vertical label; JS places the cards along the stack as you scroll
REPORTS.forEach((r, i) => push(`<article class="rcard" data-i="${i}" style="left:${[613, 790, 896, 977, 1050, 1112, 1166, 1212, 1252][i]}px;top:3946px;width:569px;height:888px;z-index:${100 - i}">` +
  box('left:0;top:0;width:569px;height:569px', img('ellipse18', 'svg', 'class="fill"'), 'rcirc') +
  box('left:135px;top:97px', NUMS[i], 'eyebrow rtx') +
  box('left:135px;top:163px;width:350px', `${r[0]}<br>Report`, 'h50 ct rtx rtitle') +
  box('left:145px;top:330px;width:301px;font-size:16px;line-height:28.1px', r[1], 'body rtx') +
  box('left:145px;top:440px;width:129px', '<a href="#">Learn more</a>', 'eyebrow rtx') +
  `<div class="a rc rlab" style="left:226px;top:628px;width:44px;height:201px"><div class="eyebrow" style="transform:rotate(-90deg);width:201px;height:44px;overflow:visible;text-align:left">${r[0]}</div></div>` +
  `<div class="a" style="left:284.5px;top:569px;width:0;height:319px"><div style="position:absolute;left:0;top:0;width:319px;height:1px;transform-origin:0 0;transform:rotate(90deg)"><img class="ln" src="assets/vector2.svg" alt=""></div></div>` +
  `</article>`));
push('</div>');

/* ---------- the moment (#moment) ---------- */
push('<div class="a" id="moment" style="left:0;top:0;width:1920px">');
// flush with the section's background (4834..6008) and clipped to it, so no strip shows above the sleeve or below the arm
push(`<div class="a" style="left:0;top:4834px;width:1920px;height:1174px;overflow:hidden">` + img('moment', 'png', 'class="a" style="left:0;top:0;width:1920px;height:1174px;max-width:none" draggable="false"') + `</div>`);
push(box('left:276px;top:4971px', 'The Moment', 'eyebrow'));
push(box('left:274px;top:5046px;width:1000px;font-size:103px;line-height:103.054px;color:#1e1e1e;white-space:nowrap', 'Somewhere,<br>Someone Is About<br>To Say &nbsp;<span style="color:#ccb4a0">Yes.</span>', 'mont5'));
push(box('left:274px;top:5397px;width:728px;font-size:24px;line-height:46px;color:#111', 'Before they do, they deserve to know that what they\u2019re holding is exactly what they were promised. It takes one number.', 'man4'));
push(`<form class="a vform" id="vform" style="left:274px;top:5575px;width:681px;height:93px"><input id="vnum" type="text" placeholder="REPORT NUMBER" aria-label="Report number" autocomplete="off"><button type="submit"><span>Verify</span><svg width="28" height="16" viewBox="0 0 28 16" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1 8h25M19 1l7 7-7 7"/></svg></button></form>`);
push(box('left:274px;top:5688px;width:681px;text-align:center;font-size:17px;line-height:24px;color:#7a7a7a', 'Can\u2019t find your number? <a href="#">How to read your report</a>', 'man4 vnote" id="vnote'));
push('</div>');

/* ---------- 4Cs wheel (#cust: tabs, dial slider and right-hand copy) ---------- */
const cx = 859, cy = 6589;
push('<div class="a" id="cust" style="left:0;top:0;width:1920px">');
push(`<div class="a" id="wheel">` +
  box('left:519px;top:6249px;width:680px;height:680px', img('ellipse5', 'svg', 'class="fill"')) +
  // the grey quarter + its arc rotate to the quadrant of the active tab
  `<div class="a" id="cwedge" style="left:519px;top:6249px;width:680px;height:680px">` +
    `<div class="a" style="left:50%;right:0;top:0;bottom:50%">${img('ellipse6', 'svg', 'class="fill"')}</div>` +
    `<div class="a" style="left:50%;top:0;width:50%;height:50%"><div class="a" style="inset:-0.74% -0.74% 0 0">${img('ellipse7', 'svg', 'class="fill"')}</div></div>` +
  `</div>` +
  rot(886, 6239.1, 698.602, 698.602, 0, `<div style="position:relative;width:493.986px;height:493.986px;transform:rotate(45deg)"><div class="a" style="inset:-0.51% -0.51% 0 0">${img('ellipse8', 'svg', 'class="fill"')}</div></div>`).replace('<div style="transform:rotate(0deg)">', '<div>') +
  line(cx, cy, 921, 90, 'line13') + line(cx, cy, 920, 0, 'line16') +
  line(cx, cy, 920.008, 45, 'line15') + line(cx, cy, 920.008, 135, 'line17') +
  // the diamond reacts to the grades (size, tint, inclusions, sparkle)
  `<div class="a" id="cgem" style="left:549.5px;top:6397px;width:607px;height:404px">` +
    img('diamond', 'png', 'class="cover" id="cgemimg"') +
    `<svg class="a" id="cincl" viewBox="0 0 200 160" style="left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none;opacity:0" fill="#1B2A40"><circle cx="78" cy="62" r="2.4"/><circle cx="118" cy="84" r="1.8"/><circle cx="96" cy="30" r="1.5"/><path d="M110 55 l9 4" stroke="#1B2A40" stroke-width="1.4"/><circle cx="88" cy="100" r="1.6"/></svg>` +
  `</div></div>`);
// each quarter of the wheel is a click target for its tab (the word stays in the tab too)
push([['carat', 859, 6249, 'top-right'], ['color', 859, 6589, 'bottom-right'], ['clarity', 519, 6589, 'bottom-left'], ['cut', 519, 6249, 'top-left']]
  .map(q => `<div class="a wquad" data-c="${q[0]}" style="left:${q[1]}px;top:${q[2]}px;width:340px;height:340px;border-${q[3]}-radius:340px"></div>`).join(''));
// word tabs: Carat / Color / Cut / Clarity (letters inherit the tab colour)
const L = (c, l, t, w, h, d, col, s = 32, iw, ih) => rot(l, t, w, h, d, `<p class="mont6 caps nw wch" style="font-size:${s}px;line-height:65.5px;letter-spacing:3.5px;${iw ? `width:${iw}px;height:${ih}px` : ''}">${c}</p>`);
const tab = (key, on, letters) => push(`<div class="a wtab${on ? ' on' : ''}" data-c="${key}" role="button" tabindex="0" aria-label="${key}" style="left:0;top:0">` + letters.map(a => L(a[0], a[1], a[2], a[3], a[4], a[5])).join('') + `</div>`);
tab('carat', true, [['C', 1045, 6259, 56.307, 67.434, 34.46], ['A', 1065, 6276, 59.968, 66.532, 38.66], ['r', 1084, 6297, 63.66, 63.619, 45.04], ['A', 1105.05, 6321.14, 65.777, 61.108, 49.51], ['t', 1122, 6345, 64.429, 56.221, 52.25]]);
tab('color', false, [['C', 1125.79, 6772, 67.434, 56.307, 124.46], ['o', 1110.94, 6792, 65.282, 58.406, 128.66], ['l', 1094.43, 6811, 60.788, 60.834, 135.04], ['o', 1067.69, 6832.05, 63.39, 67.725, 139.51], ['r', 1047.84, 6849, 59.384, 66.878, 142.25]]);
tab('cut', false, [['C', 549.58, 6324.7, 65.452, 59.885, -50.25], ['u', 568.71, 6301.45, 65.563, 64.523, -46.05], ['t', 591.88, 6284.96, 57.526, 63.57, -39.67]]);
tab('clarity', false, [['C', 628.87, 6857.96, 55.795, 67.653, -146.24], ['l', 608.13, 6844.56, 56.362, 64.342, -142.05], ['a', 582.01, 6824.23, 63.293, 63.978, -135.66], ['r', 558.52, 6802.84, 65.471, 61.527, -131.19], ['i', 548.26, 6791.09, 58.526, 49.658, -128.45], ['t', 532.52, 6774.47, 65.168, 54.942, -125.96], ['y', 515.18, 6751.07, 68.164, 52.033, -119.98]]);
// dial: the tick labels are filled in by script.js; the knob rides the arc
push(`<div class="a" id="cticks" style="left:${cx}px;top:${cy}px;width:0;height:0"></div>`);
push(`<div class="a" id="cknob" role="slider" tabindex="0" aria-label="Grade" aria-valuemin="0" aria-valuemax="100" aria-valuenow="8" style="left:1260px;top:6271px;width:44px;height:44px">` +
  `<div class="a" style="left:11.5px;top:11px;width:21px;height:22px">${img('ellipse21', 'svg', 'class="fill" draggable="false"')}</div>` +
  `<div class="a" style="left:17px;top:17px;width:10px;height:10px">${img('ellipse22', 'svg', 'class="fill" draggable="false"')}</div></div>`);
push(box('left:1356px;top:6278px;width:13px;height:13px', img('ellipse20', 'svg', 'class="fill"')));
push(box('left:113px;top:6403px', 'For Customers', 'eyebrow'));
push(box('left:113px;top:6498px;width:330px;color:#ccb4a0', 'Know<br>what<br>you\u2019re<br>looking<br>at.', 'h50'));
push(box('left:1555px;top:6387px', 'Carat', 'eyebrow" id="cr-title'));
push(box('left:1559px;top:6525px;font-size:16px;line-height:54.831px;color:#000', '\u2248 0.11 grams', 'mont6 caps nw" id="cr-sub'));
push(box('left:1555px;top:6483px;width:260px;color:#957d69', '0.55 ct', 'h50" id="cr-val'));
push(box('left:1557px;top:6591px;width:261px', 'Carat measures weight, not size. One carat equals 0.2 grams \u2014 and larger stones are rarer.', 'body18" id="cr-desc'));
push(box('left:1555px;top:6750px', '<a href="#" style="text-decoration:underline">Full experience</a>', 'eyebrow'));
push('</div>');

/* ---------- outro (the gemologists) ---------- */
push('<div class="a" id="gem" style="left:0;top:-409px;width:1920px">');
// background: warm cream that fades in from the section above and out into the one below
const T = 7459; // section top on the stage
push(box(`left:0;top:${T}px;width:1920px;height:1093px;background:linear-gradient(180deg,rgba(250,248,243,0) 0,#faf8f3 150px,#faf8f3 940px,rgba(250,248,243,0) 100%)`));
// eyebrow with a trailing hairline
push(box(`left:130px;top:${T + 170}px;font-size:15px;line-height:74px;letter-spacing:6px;color:#8a7667`, 'The Gemologists <span style="color:#1e1e1e;font-weight:600">· School of Gemology</span>', 'eyebrow'));
push(box(`left:740px;top:${T + 207}px;width:80px;height:1px;background:#cdbfae`));
push(box(`left:130px;top:${T + 270}px;width:900px;font-size:69.7px;line-height:96px;letter-spacing:-.5px;color:#1e1e1e`, 'Behind Every Grade Is A Trained Eye, A Steady Hand And Years Of Practice.', 'mont5'));
push(box(`left:134px;top:${T + 683}px;width:760px;font-size:36px;line-height:50px;color:#6b6560`, 'We don’t just grade diamonds — we teach the world how.', 'man3'));
push(`<a class="btn solid" href="#" style="left:130px;top:${T + 830}px;height:72px;padding:0 54px;gap:26px;font-size:16px;letter-spacing:3.2px;border-radius:60px"><span>EXPLORE THE CAMPUS</span>${img('arrow', 'svg', 'class="btn-arrow" style="width:30px;height:30px"')}</a>`);
// video card: poster image + our own play/pause button over the YouTube player (YouTube for now; swap for a local .mp4 <video> if needed)
const YT = '4XTCtpBPiKc';
push(`<div class="a gem-vid" id="gemcard" style="left:1094px;top:${T + 77}px;width:706px;height:896px;overflow:hidden;border-radius:30px;background:#d8d4cf;border:2px solid #dcc08a;box-shadow:0 30px 70px rgba(120,90,50,.18)"><div id="gemyt" data-yt="${YT}"></div><img id="gempos" class="cover" src="assets/hero/circle/poster-image-lady.png" alt="" draggable="false"><button id="gembtn" type="button" aria-label="Play video"><svg class="i-play" viewBox="0 0 24 24" width="38" height="38"><path d="M8.5 5.2v13.6L19.6 12z" fill="#fff"/></svg><svg class="i-pause" viewBox="0 0 24 24" width="38" height="38"><path d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z" fill="#fff"/></svg></button></div>`);
push(box(`left:1097px;top:${T + 995}px;font-size:17px;line-height:24px;color:#9a8878`, 'A closer look at the art of diamond grading', 'man3 nw'));
push(box(`left:1436px;top:${T + 1007}px;width:68px;height:1px;background:#cdbfae`));
push('</div>');

/* ---------- the trade (#trade) ---------- */
const T0 = 8143, TH = 2745;               // section top / height on the stage
// [title, description, icon file]  (icon files in assets/list are numbered by artwork, not by row)
const ROWS = [
  ['Diamond<br>Screening &amp;Sorting', 'High-throughput detection of laboratory-<br>grown stones and simulants.', 1],
  ['Laser Inscription', 'Microscopic inscriptions that link each stone<br>to its report.', 4],
  ['Origin Services', 'Documentation that traces a diamond\u2019s<br>journey from its source.', 2],
  ['Appraisals &amp; Updated<br>Reports', 'Independent valuations, duplicate and<br>updated reports.', 5],
  ['Registration &amp; Recovery', 'Register diamonds and report loss or theft to<br>support recovery.', 6],
  ['Retail Training &amp; Co-<br>Branding', 'Equip retail teams with gemological<br>knowledge and branded certification.', 3],
  ['Tools &amp; Technology', 'Advanced screening equipment and POS<br>solutions for retail.', 7]
];
const COUNTS = [['1975', 1975, '', 'Founded in Antwerp', 101, 330], ['30+', 30, '+', 'Laboratories worldwide', 595, 824], ['10+', 10, '+', 'Countries of operation', 1096, 1325], ['18', 18, '', 'Schools of Gemology', 1597, 1833]];
const ROW_TOP = 1268, ROW_H = 200;
push(`<section class="a" id="trade" style="left:0;top:${T0}px;width:1920px;height:${TH}px;background:#f4f4f4">`);
push(img('list/main', 'png', 'class="a" style="left:962px;top:138px;width:767px;height:713px;max-width:none" draggable="false"'));
push(box('left:208px;top:166px', 'The Trade \u00b7 Industry', 'eyebrow'));
push(box('left:208px;top:252px;width:900px;font-size:101px;line-height:111px;color:#1e1e1e;white-space:nowrap', 'Millions Of<br>Stones.<br>One Standard.', 'mont5'));
push(box('left:202px;top:634px;width:620px;font-size:23.5px;line-height:47px;color:#111;letter-spacing:1.5px;white-space:nowrap', 'From manufacturers and traders to retailers<br>&nbsp;on the high street \u2014 the trade relies on IGI<br>&nbsp;to grade at scale, without ever compromising<br>&nbsp;the standard.', 'man3'));
push(box('left:40px;top:955px;width:1840px;height:1px;background:#dcdcdc'));
COUNTS.forEach((c, i) => {
  if (i) push(box(`left:${[454, 965, 1473][i - 1]}px;top:1040px;width:1px;height:150px;background:#dcdcdc`));
  push(box(`left:${c[4]}px;top:1055px;font-size:78px;line-height:90px;color:#111;white-space:nowrap`, `<span class="cnt" data-to="${c[1]}" data-s="${c[2]}">${c[0]}</span>`, 'mont5'));
  push(box(`left:${c[4]}px;top:1168px;font-size:16px;line-height:24px;color:#8a8a8a;white-space:nowrap`, c[3], 'man4'));
  push(`<svg class="a tarc" style="left:${c[5] - 96}px;top:1027px;width:104px;height:104px;overflow:visible" viewBox="0 0 104 104" fill="none"><path class="tarcp" d="M0 0A96 96 0 0 1 96 96" stroke="#cfcfcf" stroke-width="1.3" pathLength="1"/><circle class="tdot" cx="96" cy="96" r="4.5" fill="#957d69"/></svg>`);
});
for (let i = 0; i <= ROWS.length; i++) push(box(`left:40px;top:${ROW_TOP + ROW_H * i}px;width:1840px;height:1px;background:#dcdcdc`));
ROWS.forEach((r, i) => push(`<div class="a trow" style="left:40px;top:${ROW_TOP + ROW_H * i}px;width:1840px;height:${ROW_H}px">` +
  `<div class="a trnum" style="left:229px;top:${ROW_H / 2 - 15}px">0${i + 1}</div>` +
  img(`list/${r[2]}`, 'png', `class="a tricon" style="left:322px;top:${ROW_H / 2 - 72}px;width:145px;height:145px;max-width:none" draggable="false"`) +
  `<div class="a trtitle" style="left:589px;top:0;width:420px;height:${ROW_H}px">${r[0]}</div>` +
  `<div class="a" style="left:1003px;top:${ROW_H / 2 - 50}px;width:1px;height:100px;background:#d6d6d6"></div>` +
  `<div class="a trdesc" style="left:1073px;top:0;width:430px;height:${ROW_H}px;white-space:nowrap">${r[1]}</div>` +
  `<a class="a trbtn" href="#" aria-label="${r[0].replace(/<br>/g, ' ')}" style="left:1510px;top:${ROW_H / 2 - 30.5}px;width:61px;height:61px">${img('list/button', 'svg', 'class="trb-rest" draggable="false"')}</a>` +
  `</div>`));
push('</section>');

/* ---------- the world (#world) ---------- */
const W0 = 10888, WH = 1560;              // directly below #trade
push(`<section class="a" id="world" style="left:0;top:${W0}px;width:1920px;height:${WH}px;background:#f8f7f4;overflow:hidden">`);
push(img('map/map', 'png', 'class="a wmap" style="left:115px;top:463px;width:1670px;height:942px;max-width:none" draggable="false"'));
// soft pulse on the Antwerp dot (dot is at 727,348 inside the 1670x942 image)
push(`<div class="a wpulse" style="left:${115 + 727 - 18}px;top:${463 + 348 - 18}px;width:36px;height:36px"></div>`);
push(box('left:0;top:78px;width:1920px;text-align:center', 'The World \u00b7 About IGI', 'eyebrow wrv'));
push(box('left:0;top:166px;width:1920px;text-align:center;font-size:79px;line-height:91.5px;color:#1e1e1e;white-space:nowrap', 'It Began In Antwerp, 1975.<br>Now It Travels everywhere<br><span style="color:#b99a6a">Diamonds Do.</span>', 'mont5 wrv wd1'));
push(box('left:0;top:462px;width:1920px;text-align:center;font-size:26px;line-height:45px;color:#111;white-space:nowrap', 'Laboratories and schools in the world\u2019s great diamond and jewellery<br>centres \u2014 one standard, wherever you are.', 'man4 wrv wd2'));
// location picker + links (pills), below the map
push(`<div class="a wrv wd3 wpills" style="left:518px;top:1365px;width:883px;height:68px">` +
  `<div class="wsel" style="left:0;width:316px"><select aria-label="Find a location"><option>Choose a laboratory or school…</option><option>Antwerp</option><option>Mumbai</option><option>New York</option><option>Dubai</option><option>Hong Kong</option><option>Tel Aviv</option><option>Bangkok</option><option>Tokyo</option></select><svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 2l6 6 6-6"/></svg></div>` +
  `<a class="wpill" href="#" style="left:345px;width:212px">Find a Store Near You</a>` +
  `<a class="wpill" href="#" style="left:586px;width:133px">Our Legacy</a>` +
  `<a class="wpill" href="#" style="left:748px;width:135px">Leadership</a></div>`);
push('</section>');

/* ---------- epilogue: media & events (#epilogue) ---------- */
const E0 = 12448, EH = 1190;               // directly below #world
const ARR = '<svg width="20" height="12" viewBox="0 0 20 12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 6h17M13 1l5 5-5 5"/></svg>';
const CARDS_E = [
  { x: 105, w: 640, img: 1, tag: 'PRESS RELEASE', tagX: 15, tagW: 165, title: 'Headline For The Lead Press Release Sits<br>Here, Across Two Lines.', sub: 'Short standfirst summarising the announcement. \u00b7 [Date]' },
  { x: 798, w: 501, img: 2, tag: 'TRADE SHOWS', tagX: 31, tagW: 155, title: 'Meet Our Experts At The Next<br>International Fair.', sub: 'See the calendar and book a meeting.' },
  { x: 1332, w: 502, img: 3, tag: 'BLOG', tagX: 29, tagW: 82, title: 'Natural Or Lab-Grown? What<br>Your Report Tells You.', sub: 'A plain-language guide for buyers.' }
];
push(`<section class="a" id="epilogue" style="left:0;top:${E0}px;width:1920px;height:${EH}px;background:#fbfaf8;overflow:hidden">`);
push(box('left:105px;top:93px', 'Epilogue \u00b7 Media &amp; Events', 'eyebrow erv'));
push(box('left:105px;top:255px;font-size:81px;line-height:110px;color:#12202b;white-space:nowrap', 'The Story <span style="color:#b99a6a">Continues.</span>', 'mont5 erv ed1'));
push(`<a class="a erv ed1 enews" href="#" style="left:1638px;top:284px"><span>NEWSROOM</span><i class="ecirc">${ARR}</i></a>`);
CARDS_E.forEach((c, i) => push(`<a class="a ecard erv ed${i + 2}" href="#" style="left:${c.x}px;top:452px;width:${c.w}px;height:556px">` +
  `<div class="eimg"><img src="assets/blog/${c.img}.png" alt="" draggable="false"></div>` +
  `<span class="etag" style="left:${c.tagX}px;width:${c.tagW}px">${c.tag}</span>` +
  `<div class="etitle">${c.title}</div>` +
  `<div class="esub">${c.sub}</div>` +
  `<i class="ecirc ecb" style="right:${i ? 58 : 46}px">${ARR}</i></a>`));
[['Press Kit', 108], ['Experiences', 298], ['Blogs', 523]].forEach(([t, x]) =>
  push(`<a class="a elink erv ed5" href="#" style="left:${x}px;top:1080px">${t.toUpperCase()}<svg width="16" height="10" viewBox="0 0 20 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6h17M13 1l5 5-5 5"/></svg></a>`));
push('</section>');

/* ---------- sustainability (#sustain) ---------- */
const S0 = 13638, SH = 1400, SLIFT = -50;   // directly below the epilogue; content sits 50px lower to make room for the heading
const SARR = '<svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke="#b8863a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 7h19M14 1l6 6-6 6"/></svg>';
push(`<section class="a" id="sustain" style="left:0;top:${S0}px;width:1920px;height:${SH}px;background:#f4f2ef;overflow:hidden">`);
push(`<div class="a" style="left:0;top:-${SLIFT}px;width:1920px;height:${SH + SLIFT}px">`);
push(box('left:105px;top:43px', 'Sustainability · ESG &amp; CSR', 'eyebrow'));
push(box('left:105px;top:100px;font-size:81px;line-height:110px;color:#12202b;white-space:nowrap', 'Responsible By <span style="color:#b99a6a">Design.</span>', 'mont5'));
// soft light behind the centre (the line artwork bg.png is the section's CSS background)
push(`<div class="a" style="left:360px;top:90px;width:1200px;height:1200px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.75) 0%,rgba(255,255,255,0) 62%);pointer-events:none"></div>`);
// numbers
push(`<div class="a srv sd1 snum" style="left:105px;top:280px"><span>01</span><i></i></div>`);
push(`<div class="a srv sd1 snum" style="left:1685px;top:280px;width:140px;justify-content:flex-end"><i></i><span>02</span></div>`);
// pictures (their captions are part of the image files)
push(`<div class="a srv sd2 simg" style="left:105px;top:387px;width:741px;height:377px"><img src="assets/sustain/1.png" alt="" draggable="false"></div>`);
push(`<div class="a srv sd3 simg" style="left:1078px;top:397px;width:747px;height:383px"><img src="assets/sustain/2.png" alt="" draggable="false"></div>`);
// left column
push(box('left:105px;top:845px', 'Sustainability (ESG)', 'slab srv sd4'));
push(box('left:105px;top:895px;width:700px;color:#957d69;white-space:nowrap', 'INTEGRITY, BEYOND<br>THE STONE.', 'h50 srv sd4'));
push(box('left:105px;top:1050px;width:640px', 'Our commitments to responsible operations, transparency and the<br>communities we serve.', 'spar srv sd5'));
push(`<a class="a scta srv sd5" href="#" style="left:105px;top:1163px"><span>OUR ESG APPROACH</span>${SARR}</a>`);
// right column
push(box('left:1425px;top:872px;width:400px;text-align:right', 'CSR', 'slab srv sd4'));
push(box('left:1183px;top:923px;width:650px;color:#957d69;white-space:nowrap', 'GIVING BACK, AROUND<br>THE WORLD.', 'h50 srv sd4'));
push(box('left:1085px;top:1075px;width:740px;text-align:right;white-space:nowrap', 'Education, community and social initiatives supported by IGI.', 'spar srv sd5'));
push(`<a class="a scta scta-r srv sd5" href="#" style="left:1520px;top:1163px"><span>VISIT THE CSR MICROSITE</span>${SARR}</a>`);
push('</div>');
push('</section>');

/* ---------- footer (#footer) ---------- */
const F0 = 15038, FH = 895;                 // directly below #sustain
const COLS = [
  ['Company', 645, ['Careers', 'Life at IGI', 'Investors', 'Affiliations', 'RJC']],
  ['Contact Us', 950, ['Offices', 'Schools', 'Write to Us', 'Report Concerns']],
  ['Resources', 1292, ['API Reports', 'Glossary', 'Verify Report', 'Find a Store']],
  ['Governance', 1624, ['Code of Conduct', 'Human Rights', 'Sustainability (ESG)', 'CSR']]
];
push(`<footer class="a" id="footer" style="left:0;top:${F0}px;width:1920px;height:${FH}px;background:#fff">`);
push(box('left:0;top:632px;width:1920px;height:263px;background:#f7f7f6'));
push(img('social/logo', 'png', 'class="a frv fd1" style="left:135px;top:125px;width:153px;height:66px;max-width:none" draggable="false"'));
push(box('left:135px;top:236px;width:420px;font-size:18.4px;line-height:27.5px;color:#111;white-space:nowrap', 'Independent grading, certification<br>and gemological education since 1975.', 'man4 frv fd1'));
// social icons (centres at y=334)
[['linked in', 'LinkedIn', 150, 35], ['Insta', 'Instagram', 218, 34], ['Youtube', 'YouTube', 302, 40], ['Facebook', 'Facebook', 379, 17], ['x', 'X', 452, 30]].forEach(([f, n, cx, w], i) =>
  push(`<a class="a fsoc frv fd2" href="#" aria-label="${n}" style="left:${cx - 24}px;top:${334 - 24}px;width:48px;height:48px"><img src="assets/social/${encodeURIComponent(f)}.svg" alt="" draggable="false" style="width:${Math.round(w * 1.08)}px"></a>`));
push(box('left:131px;top:421px;font-size:40.5px;line-height:56px;color:#111;white-space:nowrap', 'Stay Informed', 'mont4 frv fd3'));
push(box('left:135px;top:480px;font-size:17.8px;line-height:24px;color:#111;white-space:nowrap', 'Email for IGI updates', 'man4 frv fd3'));
push(`<form class="a fform frv fd3" id="fform" style="left:129px;top:522px;width:306px;height:65px"><input id="femail" type="email" placeholder="Your email address" aria-label="Your email address" autocomplete="email" required><button type="submit" aria-label="Subscribe"><svg width="14" height="12" viewBox="0 0 14 12" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6h11M8 1.5 12.5 6 8 10.5"/></svg></button></form>`);
push(box('left:135px;top:597px;font-size:15px;line-height:20px;color:#6d6d6d;white-space:nowrap', '', 'man4 fmsg" id="fmsg'));
COLS.forEach(([h, x, links], ci) => {
  push(box(`left:${x}px;top:132px;font-size:24.6px;line-height:36px;color:#111;white-space:nowrap`, h, `mont5 caps frv fd${ci + 2}`));
  links.forEach((l, i) => push(`<a class="a flink frv fd${ci + 3}" href="#" style="left:${x}px;top:${226 + 77 * i}px">${l}</a>`));
});
push(box('left:661px;top:713px;font-size:18.6px;line-height:28px;color:#6d6d6d;white-space:nowrap', '\u00a9 2026 International Gemological Institute', 'man4 frv fd4'));
push(box('left:1052px;top:714px;width:1px;height:32px;background:#d6d6d6', '', 'frv fd4'));
push(`<div class="a man4 frv fd4" style="left:1077px;top:713px;font-size:18.6px;line-height:28px;color:#6d6d6d;white-space:nowrap"><a class="fleg" href="#">Privacy</a> \u00b7 <a class="fleg" href="#">Terms</a> \u00b7 <a class="fleg" href="#">Cookies</a></div>`);
push('</footer>');

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
<form class="fab" id="fab" aria-label="Verify a report"><svg width="17" height="19" viewBox="0 0 24 24" fill="none" stroke="#c9d3e3" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg><input id="fabnum" type="text" placeholder="Report number" aria-label="Report number" autocomplete="off"><button type="submit">Verify</button></form>
<script src="script.js"></script>
</body>
</html>`;
fs.writeFileSync(require('path').join(__dirname, '..', 'index.html'), html);
console.log('ok', html.length);
