// The Goblin GM as a manuscript drollery (marginal creature), drawn like a late-medieval pen-and-wash figure:
// tapered ink strokes, flat pigment washes with paper mottling, darker shade + white-lead highlights on folds.
// Red chaperon hood (one piece with the shoulder cape, so it wraps the face), long liripipe ending in a bell,
// pointed ear poking out, grumpy brow, long nose, a tusk; blue cotehardie with dagged hem, low gold belt and purse,
// mi-parti hose, poulaines; the football tucked in one arm, the other hand raised with the speaking gesture.
const INK = '#2b1a0e';
const C = { red: '#b23a22', redD: '#7f2616', redL: '#d36a4c', blue: '#3e5d9f', blueD: '#253f73', green: '#8fa85c', greenD: '#62803c',
  gold: '#c99a3a', goldL: '#e6c46c', brown: '#7b4523', hoseR: '#8c2d1b', hoseW: '#e9dab2', hoseWD: '#b9a374', shoe: '#3a2516', white: '#f7eed8' };
const f = n => +n.toFixed(2);
// proportions: everything below the shoulders (y > 56) is shortened, so the goblin gets a big head and short body
const Y0 = 56, K = .84, my = y => y > Y0 ? Y0 + (y - Y0) * K : y;
const xf = d => d.replace(/([MLCQTSHV])([^MLCQTSHVZ]*)/g, (m, cmd, args) => { const n = args.match(/-?\d*\.?\d+/g) || [];
  if (cmd === 'H') return cmd + n.join(' '); if (cmd === 'V') return cmd + n.map(v => f(my(+v))).join(' ');
  const o = []; for (let i = 0; i + 1 < n.length; i += 2) o.push(n[i], f(my(+n[i + 1]))); return cmd + o.join(' '); });
// a pen stroke that swells in the middle and tapers to points at both ends
const lens = (x0, y0, cx, cy, x1, y1, w) => { y0 = my(y0); cy = my(cy); y1 = my(y1); const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L * w, ny = dx / L * w;
  return `M${x0} ${y0}Q${f(cx + nx)} ${f(cy + ny)} ${x1} ${y1}Q${f(cx - nx)} ${f(cy - ny)} ${x0} ${y0}Z`; };
// edge decorations, always drawn left to right with the lobes hanging below: rounded scallops and pointed (leaf) dags
const scallops = (x0, y0, x1, y1, n, d) => { let s = ''; for (let i = 0; i < n; i++) { const ax = x0 + (x1 - x0) * i / n, ay = y0 + (y1 - y0) * i / n, bx = x0 + (x1 - x0) * (i + 1) / n, by = y0 + (y1 - y0) * (i + 1) / n;
  s += `C${f(ax)} ${f(ay + d * 1.3)} ${f(bx)} ${f(by + d * 1.3)} ${f(bx)} ${f(by)}`; } return s; };
const dags = (x0, y0, x1, y1, n, d) => { let s = ''; for (let i = 0; i < n; i++) { const ax = x0 + (x1 - x0) * i / n, ay = y0 + (y1 - y0) * i / n, bx = x0 + (x1 - x0) * (i + 1) / n, by = y0 + (y1 - y0) * (i + 1) / n, mx = (ax + bx) / 2, my = (ay + by) / 2 + d;
  s += `Q${f(ax + (bx - ax) * .1)} ${f(my - d * .25)} ${f(mx)} ${f(my)}Q${f(bx - (bx - ax) * .1)} ${f(my - d * .25)} ${f(bx)} ${f(by)}`; } return s; };
const P = (d, fill, sw = 1.1, extra = '') => `<path d='${xf(d)}' fill='${fill}' stroke='${INK}' stroke-width='${sw}'${extra}/>`;
const ink = (d, op) => `<path d='${d}' fill='${INK}'${op ? ` opacity='${op}'` : ''}/>`;
const tone = (d, fill, op) => `<path d='${d}' fill='${fill}' opacity='${op}'/>`;
const hi = d => `<path d='${d}' fill='${C.white}' opacity='.9'/>`;

const parts = [
  // a little grassy mound to stand on, as figures in manuscripts do
  P('M33 124.6C39 120.6 55 119.6 69 120.1C79 120.5 88 122 90.6 125.4C78 127.2 45 127.4 33 124.6Z', '#86a14d', .9),
  ink(lens(39.4, 122, 38.8, 120, 37.6, 118.6, .5)), ink(lens(41, 121.6, 41.2, 119.8, 42.2, 118.4, .45)),
  ink(lens(73, 121.2, 73.4, 119.4, 74.6, 118.2, .45)), ink(lens(86.6, 123, 87.2, 121.4, 88.6, 120.4, .45)),
  tone(lens(36, 125, 60, 123.4, 88.6, 125.4, 1.2), '#5f7a36', .6),
  // far leg (red hose) and near leg (pale hose), striding
  P('M37 93.5H43.4C43.2 100 41.8 106 41.6 110.2C41.5 114 41.9 116.2 42.4 118.2L38.9 118.5C38.4 114.2 37.4 108.4 37.1 104C36.8 100.2 36.8 96.8 37 93.5Z', C.hoseR),
  P('M53 93.5H59.6C62.8 97.6 65.4 102 65.5 106.2C65.6 110.4 65.6 114.4 66.3 118.2L62.9 118.5C62.4 114.4 62 110.6 61.5 107.6C58.6 103.6 54.8 100 53 93.5Z', C.hoseW),
  tone(lens(54.4, 95.2, 58.2, 101.6, 61.8, 107.6, 1.8), C.hoseWD, .75),
  ink(lens(58.6, 100.4, 59.6, 101.4, 60.6, 101.8, .45)), ink(lens(59.4, 102.8, 60.4, 103.8, 61.4, 104.2, .45)),
  // poulaines (long pointed shoes)
  P('M37.8 117.8H43C45.6 119.2 51.6 120.4 56.6 120.8C59.6 120.9 61 119.6 60.8 118.2C62.2 119.2 62 122 57.8 122.6C51 123.4 43.4 123.4 38.8 122.6C37.2 121.8 37 119.4 37.8 117.8Z', C.shoe, 1),
  P('M62.4 117.8H67.6C70.2 119.2 76.2 120.4 81.2 120.8C84.2 120.9 85.6 119.6 85.4 118.2C86.8 119.2 86.6 122 82.4 122.6C75.6 123.4 68 123.4 63.4 122.6C61.8 121.8 61.6 119.4 62.4 117.8Z', C.shoe, 1),
  `<path d='${lens(66.4, 119.6, 74, 120.6, 82, 120.2, .5)}' fill='#8a6a4a'/>`,
  // cotehardie: fitted body, flared skirt, hem cut in pointed dags
  P(`M30 56C29 66 30 76 29 84C27 90 25 94 24 98.2${dags(24, 98.2, 70, 98.2, 7, 4.2)}C67 92 64 86 62.6 80C66.6 73 68 63 64 56Z`, C.blue),
  tone(lens(31.2, 58, 28.8, 71, 30.4, 83, 3.4), C.blueD, .7),
  tone(lens(29.4, 85, 26.2, 92, 25.4, 98.6, 2.6), C.blueD, .6),
  ink(lens(33.6, 86, 31.6, 92.4, 29.6, 99.2, .75)), ink(lens(42.6, 85.6, 41.6, 92.4, 41, 100, .75)),
  ink(lens(52, 85.2, 52.6, 91.6, 54, 99.6, .7)), ink(lens(60, 83.6, 62.4, 90.4, 65, 98.4, .6)),
  hi(lens(37.2, 86.2, 36, 92.4, 34.8, 99.4, .75)), hi(lens(47, 85.6, 47, 92.4, 47.6, 100, .75)), hi(lens(56.4, 85, 57.6, 91, 59.6, 98.6, .55)),
  // low belt with a purse
  `<path d='${xf('M29 83.6C40 83.4 52 82.4 62.8 80.8')}' fill='none' stroke='${INK}' stroke-width='3.2'/><path d='${xf('M29 83.6C40 83.4 52 82.4 62.8 80.8')}' fill='none' stroke='${C.gold}' stroke-width='1.8'/>`,
  `<path d='${xf('M29.6 83.6C40 83.4 52 82.4 62.4 80.9')}' fill='none' stroke='${C.goldL}' stroke-width='.5' stroke-dasharray='.9 2.2'/>`,
  P('M34.6 84.6C33.4 88.2 34 91.6 37.6 92.6C41.2 93.2 42.6 90 42 86.6C41.4 85 38 84 34.6 84.6Z', C.brown, .9),
  ink(lens(35, 86.6, 38.2, 87.6, 41.8, 87, .55)),
  // the football, tucked against the belly, with the far hand under it
  `<g transform='translate(0 ${f(my(71.6) - 71.6)}) rotate(-24 64 71.6)'><ellipse cx='64' cy='71.6' rx='9.6' ry='5.9' fill='${C.brown}' stroke='${INK}' stroke-width='1.15'/>`
    + `<path d='M59.8 71.4H68.4' stroke='${C.white}' stroke-width='.85'/><path d='M61.2 70.3V72.5M63 70.3V72.5M64.8 70.3V72.5M66.6 70.3V72.5' stroke='${C.white}' stroke-width='.7'/>`
    + `<path d='${lens(57.2, 69.4, 60.4, 66.8, 64.6, 66.4, .8)}' fill='#a8683c'/></g>`,
  P('M57.2 75.4C57.8 78.4 60.6 79.6 62.8 78.7C63.8 80.2 66.6 80 67.6 77.9C66.2 76.2 61 75.2 57.2 75.4Z', C.green, .9),
  ink(lens(60.6, 76.4, 61.4, 77.6, 62.4, 78.4, .4)), ink(lens(63.4, 76.8, 64.2, 77.8, 65, 78.6, .4)),
  // near arm raised, sleeve with a gold cuff, hand with the index finger up (the medieval sign for speaking)
  P('M54.5 60C61 62.5 67.5 62.4 72.6 58.4C75 55.5 75.4 51.6 74.6 48.2L70.2 48.4C70.2 51.6 69.4 54.4 67.2 55.8C63.4 57.4 59.2 56.6 55.6 55Z', C.blue),
  tone(lens(57, 58.8, 64, 60.8, 71.4, 57.8, 1.4), C.blueD, .7), hi(lens(68.4, 55.2, 71.6, 53.6, 72.4, 49.6, .55)),
  `<path d='${xf('M70 50.2L74.9 50')}' stroke='${INK}' stroke-width='2.7'/><path d='M70.4 50.2L74.5 50' stroke='${C.gold}' stroke-width='1.3'/>`,
  P('M72.4 44.4C72.1 41.4 72.4 39.1 73.4 38.3C74.5 37.9 75 39.4 74.7 41.4C74.5 42.6 74.6 43.6 74.8 44.3Z', C.green, .85),
  P('M69.6 48.8C69 46 70.6 43.8 73.2 43.8C75.6 43.9 76.6 46.4 75.2 48.8Z', C.green, .95),
  `<path d='M73.8 46.2Q76 45.4 75.8 47.6' fill='none' stroke='${INK}' stroke-width='.55'/>`, ink(lens(70.6, 46.4, 71.6, 45.6, 72.6, 46.4, .35)),
  // the head (drawn under the hood, which wraps it)
  P('M46 14C50 13.5 54 14 56.5 15.2C60 17 62.6 20.5 62.2 24.2C61.8 25.4 61.4 26 61.6 26.6C66.5 26.2 75.5 27.8 81.4 32.6C82 33.6 81.2 34.4 80 34.2C74.5 34 68.8 34.6 64.6 36.4C64.2 37.2 64.6 38 65.2 38.6C65.8 40 65.4 41.2 64 41.8C66.4 43.8 66.8 47.4 63.6 49.2C59.6 51.4 52 51 46.6 47.2C43 44 42 38 42 30C42 22 43 16 46 14Z', C.green),
  tone(lens(49.4, 17, 46.2, 32, 51.2, 48, 4.4), C.greenD, .55),
  tone(lens(65.4, 35, 72.6, 34.4, 79.8, 33.8, 1), C.greenD, .55), `<ellipse cx='56.4' cy='34.6' rx='2.4' ry='1.6' fill='#e0766a' opacity='.3'/>`,
  ink(lens(51.2, 33.4, 52, 35, 53, 36.4, .45)), ink(lens(51, 36.6, 51.8, 38.2, 52.8, 39.6, .45)), ink(lens(51.2, 39.8, 52, 41.4, 53, 42.8, .45)),
  ink(lens(60.4, 45.8, 61.8, 47.2, 63.4, 47.8, .4)),
  // the hood and shoulder cape, one piece: its front edge frames the face, its hem is scalloped
  P(`M64.8 57.6C64.4 54.6 62.6 52.4 60 51.2C55.6 50.8 50.2 49.4 47.8 45.4C45.8 41.6 46 35 47.2 30C48.4 24.2 51.6 18.6 57.4 15.4C56 8.6 50 3 42 1.6C34 .6 26 2.8 20.6 7.8C16.8 11.4 15.4 16.6 16.4 22.4C18.2 18 22 14.2 27.4 13C31.4 12.4 34.6 15.4 35.2 22C35.8 30 36.2 38.4 35.4 45.2C31.4 51 26 56.4 22 61.6${scallops(22, 61.6, 66.2, 61.2, 6, 3)}C66.2 60 65.4 59 64.8 57.6Z`, C.red),
  tone(lens(37.2, 16.6, 35.6, 30, 37.6, 44.6, 3), C.redD, .6), tone(lens(17.4, 19.6, 22, 13.6, 31, 13.6, 1.7), C.redD, .7),
  tone(lens(34, 47.4, 27, 55, 23.2, 61.4, 2.2), C.redD, .55),
  ink(lens(39.4, 48, 36, 55, 33, 62.4, .75)), ink(lens(46.2, 50.4, 44.8, 56, 44.2, 63, .75)), ink(lens(54.4, 51.6, 55.2, 56.6, 56.4, 62.8, .65)),
  hi(lens(40.6, 48.2, 38, 55, 35.8, 62.4, .75)), hi(lens(48.8, 51.2, 47.6, 56.6, 47.4, 63, .6)), hi(lens(45.6, 5.2, 51.4, 6.4, 55.6, 12.8, .9)), hi(lens(21.8, 8.6, 29.6, 3.4, 40, 3, .8)),
  // the ear, poking out from under the hood's edge
  P('M45.8 29.6C40.6 27.4 33 25.4 23.6 25.6C30.4 29.4 37.6 33.8 44.8 38.6Z', C.green, 1.1),
  tone(lens(43.6, 31.6, 35.6, 28.8, 28.2, 27, 1.3), C.greenD, .8),
  // the hood's turned-back edge, over the ear's root and the face
  `<path d='M60 51.2C55.6 50.8 50.2 49.4 47.8 45.4C45.8 41.6 46 35 47.2 30C48.4 24.2 51.6 18.6 57.4 15.4' fill='none' stroke='${INK}' stroke-width='3.3' stroke-linecap='round'/>`
    + `<path d='M60 51.2C55.6 50.8 50.2 49.4 47.8 45.4C45.8 41.6 46 35 47.2 30C48.4 24.2 51.6 18.6 57.4 15.4' fill='none' stroke='${C.redL}' stroke-width='1.7' stroke-linecap='round'/>`,
  // the face: grumpy brow, eye, nose, grin with a fang and a tusk
  `<path d='M53.4 26.8Q56.2 24.4 59.2 26.6Q56.4 29 53.4 26.8Z' fill='#f0d978' stroke='${INK}' stroke-width='.6'/><circle cx='57.4' cy='26.7' r='.95' fill='${INK}'/>`,
  ink(lens(53.3, 26.8, 56.2, 24.1, 59.3, 26.6, .7)), ink(lens(51.8, 22, 56.6, 21.2, 61, 24.4, 1.6)),
  ink(lens(54.2, 29.4, 56.6, 30.4, 59, 29.2, .45)), ink(lens(66.2, 33.2, 67.4, 34.4, 68.8, 33.8, .6)),
  `<circle cx='73.5' cy='29.8' r='.9' fill='${C.greenD}' stroke='${INK}' stroke-width='.4'/>`,
  `<path d='M64.2 40.2C61 41.2 57.5 41.4 54.8 39.6' fill='none' stroke='${INK}' stroke-width='.95' stroke-linecap='round'/>`,
  `<path d='M61.8 40.7L62.9 40.5L62.3 42.7Z' fill='${C.white}' stroke='${INK}' stroke-width='.45'/><path d='M58.3 41.3L59.8 41.2L59 38.4Z' fill='${C.white}' stroke='${INK}' stroke-width='.45'/>`,
  ink(lens(55, 39.8, 53.6, 39.2, 53.3, 37.6, .6)),
];
// pigment washes are never perfectly flat: a fine paper mottle over the whole drawing
const WASH = `<filter id='w' x='-2%' y='-2%' width='104%' height='104%'><feTurbulence type='fractalNoise' baseFrequency='.35' numOctaves='2' seed='2' result='d'/><feDisplacementMap in='SourceGraphic' in2='d' scale='.7' xChannelSelector='R' yChannelSelector='G' result='s'/><feTurbulence type='fractalNoise' baseFrequency='.14' numOctaves='2' seed='4'/><feColorMatrix values='0 0 0 0 .2 0 0 0 0 .12 0 0 0 0 .05 0 0 0 -.7 .42' result='c'/><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' seed='9'/><feColorMatrix values='0 0 0 0 .2 0 0 0 0 .12 0 0 0 0 .05 0 0 0 -.55 .32'/><feMerge><feMergeNode in='c'/><feMergeNode/></feMerge><feComposite in2='s' operator='in'/><feComposite in2='s' operator='over'/></filter>`;
const VB = { x: 13, y: -1, w: 79, h: 118 };
const GOBLIN = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${VB.x} ${VB.y} ${VB.w} ${VB.h}'><defs>${WASH}</defs><g filter='url(#w)' stroke-linejoin='round'>${parts.join('')}</g></svg>`;
module.exports = { GOBLIN, VB, gobURL: `url("data:image/svg+xml,${encodeURIComponent(GOBLIN)}")` };
if (require.main === module) {
  const { chromium } = require('playwright'); const S = process.argv[2];
  const src = `data:image/svg+xml,${encodeURIComponent(GOBLIN)}`;
  (async () => { const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); const p = await b.newPage({ viewport: { width: 640, height: 480 }, deviceScaleFactor: 2 });
    await p.setContent(`<body style="margin:0;background:#e6d2a6;display:flex;gap:24px;align-items:end;padding:16px"><img src="${src}" width="290"><div style="display:grid;gap:16px;justify-items:center"><img src="${src}" width="60"><img src="${src}" width="38"><img src="${src}" width="60" style="transform:scaleX(-1)"></div></body>`);
    await p.waitForTimeout(300); await p.screenshot({ path: S + '/goblin_art.png' }); await b.close(); console.log((GOBLIN.length / 1024).toFixed(1) + ' KB'); })();
}
