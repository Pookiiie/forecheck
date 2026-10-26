const svg = s => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;

// ---- textures (SVG noise, rendered by the browser, no image files) ----
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const bricks = (() => { let r = ''; const tones = ['#36322b', '#2f2c26', '#3a352d', '#2b2924', '#333028'];
  for (let row = 0; row < 5; row++) for (let i = -1; i < 4; i++) { const x = i * 84 + (row % 2 ? 42 : 0), y = row * 44; r += `<rect x="${x + 2}" y="${y + 2}" width="80" height="40" rx="5" fill="${tones[Math.floor(rnd() * tones.length)]}"/>`; } return r; })();
const STONE = svg(`<svg xmlns='http://www.w3.org/2000/svg' width='252' height='220'>
<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .55 0'/></filter>
<filter id='b'><feTurbulence type='fractalNoise' baseFrequency='.035' numOctaves='4' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .7 -.05'/></filter>
<filter id='m'><feTurbulence type='turbulence' baseFrequency='.08' numOctaves='3' seed='4'/><feDisplacementMap in='SourceGraphic' scale='14'/></filter>
<rect width='252' height='220' fill='#141210'/>${bricks}
<rect width='252' height='220' filter='url(#b)'/><rect width='252' height='220' filter='url(#n)' opacity='.6'/>
<g filter='url(#m)' opacity='.55'><ellipse cx='42' cy='44' rx='26' ry='8' fill='#4d6b26'/><ellipse cx='210' cy='132' rx='20' ry='7' fill='#3f5c1f'/><ellipse cx='126' cy='176' rx='14' ry='5' fill='#5a7a2c'/></g></svg>`);
// wood: long grain streaks, fine fibres and pale highlights; the header plank also gets board joints, knots and nails
const woodDefs = `<defs><filter id='g' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.0025 .11' numOctaves='5' seed='11' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .12 0 0 0 0 .06 0 0 0 0 .02 2.6 0 0 0 -.9'/></filter>
<filter id='f' x='0' y='0' width='100%' height='100%'><feTurbulence type='turbulence' baseFrequency='.012 .55' numOctaves='3' seed='4' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .08 0 0 0 0 .04 0 0 0 0 .01 1.6 0 0 0 -.45'/></filter>
<filter id='h' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.004 .2' numOctaves='3' seed='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 .85 0 0 0 0 .6 1.8 0 0 0 -1.15'/></filter></defs>
<rect width='520' height='120' fill='#5e3b1e'/><rect width='520' height='120' filter='url(#h)'/><rect width='520' height='120' filter='url(#g)'/><rect width='520' height='120' filter='url(#f)'/>`;
const WOOD_TAG = svg(`<svg xmlns='http://www.w3.org/2000/svg' width='520' height='120'>${woodDefs}</svg>`);
const WOOD = svg(`<svg xmlns='http://www.w3.org/2000/svg' width='520' height='120'>${woodDefs}
<g fill='none'><path d='M173 0v120M347 0v120' stroke='#1f1208' stroke-width='3'/><path d='M175.5 0v120M349.5 0v120' stroke='rgba(255,215,160,.16)' stroke-width='1'/></g>
<g><ellipse cx='96' cy='70' rx='13' ry='5' fill='none' stroke='rgba(35,18,6,.55)' stroke-width='2'/><ellipse cx='96' cy='70' rx='6' ry='2.4' fill='rgba(35,18,6,.7)'/><ellipse cx='430' cy='34' rx='9' ry='3.5' fill='none' stroke='rgba(35,18,6,.5)' stroke-width='1.6'/><ellipse cx='430' cy='34' rx='4' ry='1.6' fill='rgba(35,18,6,.7)'/></g>
<g fill='#2a1a0c'><circle cx='164' cy='14' r='3.2'/><circle cx='164' cy='106' r='3.2'/><circle cx='358' cy='14' r='3.2'/><circle cx='358' cy='106' r='3.2'/></g><g fill='rgba(255,225,180,.35)'><circle cx='163' cy='13' r='1.2'/><circle cx='163' cy='105' r='1.2'/><circle cx='357' cy='13' r='1.2'/><circle cx='357' cy='105' r='1.2'/></g></svg>`);
const PAPER = svg(`<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'>
<filter id='g'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .36 0 0 0 0 .24 0 0 0 0 .1 0 0 0 .3 0'/></filter>
<filter id='mo'><feTurbulence type='fractalNoise' baseFrequency='.012' numOctaves='3' stitchTiles='stitch' seed='9'/><feColorMatrix values='0 0 0 0 .45 0 0 0 0 .3 0 0 0 0 .1 0 0 0 .9 -.32'/></filter>
<filter id='f'><feTurbulence type='fractalNoise' baseFrequency='.02 .6' numOctaves='2' stitchTiles='stitch' seed='2'/><feColorMatrix values='0 0 0 0 .3 0 0 0 0 .2 0 0 0 0 .1 0 0 0 .5 -.25'/></filter>
<rect width='320' height='320' filter='url(#mo)'/><rect width='320' height='320' filter='url(#f)'/><rect width='320' height='320' filter='url(#g)'/></svg>`);
const CLOTH = svg(`<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8'><path d='M0 0h8v8H0z' fill='none'/><path d='M0 4h8M4 0v8' stroke='rgba(0,0,0,.18)' stroke-width='1'/></svg>`);
const WEB = (() => { const cx = 150, cy = 0, rays = 7; let d = ''; const pts = [];
  for (let i = 0; i < rays; i++) { const a = Math.PI / 2 + (i / (rays - 1)) * (Math.PI / 2); const p = [cx + Math.cos(a) * 150, cy + Math.sin(a) * 150]; pts.push(a); d += `M${cx} ${cy}L${p[0].toFixed(1)} ${p[1].toFixed(1)}`; }
  for (const R of [22, 44, 68, 94, 122]) { for (let i = 0; i < rays - 1; i++) { const a1 = pts[i], a2 = pts[i + 1], am = (a1 + a2) / 2, sag = R * .86;
    d += `M${(cx + Math.cos(a1) * R).toFixed(1)} ${(cy + Math.sin(a1) * R).toFixed(1)}Q${(cx + Math.cos(am) * sag).toFixed(1)} ${(cy + Math.sin(am) * sag).toFixed(1)} ${(cx + Math.cos(a2) * R).toFixed(1)} ${(cy + Math.sin(a2) * R).toFixed(1)}`; } }
  return svg(`<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150'><path d='${d}' fill='none' stroke='rgba(230,225,210,.42)' stroke-width='.9'/></svg>`); })();
// torn edge for every scrap of parchment
const deckle = (n = 44, a = 5) => { const P = []; for (let i = 0; i <= n; i++) P.push(`${(i / n * 100).toFixed(2)}% ${(rnd() * a).toFixed(1)}px`);
  for (let i = 1; i < 8; i++) P.push(`calc(100% - ${(rnd() * 3).toFixed(1)}px) ${(i / 8 * 100).toFixed(1)}%`);
  for (let i = n; i >= 0; i--) P.push(`${(i / n * 100).toFixed(2)}% calc(100% - ${(rnd() * a).toFixed(1)}px)`);
  for (let i = 7; i > 0; i--) P.push(`${(rnd() * 3).toFixed(1)}px ${(i / 8 * 100).toFixed(1)}%`); return `polygon(${P.join(',')})`; };


// knots and nail heads for the header plank, placed at its edges so they never sit behind the text
const KNOT = svg(`<svg xmlns='http://www.w3.org/2000/svg' width='34' height='12'><ellipse cx='17' cy='6' rx='15' ry='5' fill='rgba(60,32,12,.35)' stroke='rgba(35,18,6,.55)' stroke-width='1.6'/><ellipse cx='17' cy='6' rx='9' ry='3' fill='none' stroke='rgba(35,18,6,.35)' stroke-width='1'/><ellipse cx='17' cy='6' rx='4' ry='1.6' fill='rgba(35,18,6,.75)'/></svg>`);
const NAIL = svg(`<svg xmlns='http://www.w3.org/2000/svg' width='9' height='9'><circle cx='4.5' cy='4.5' r='3.6' fill='#2a1a0c'/><circle cx='4.5' cy='4.5' r='3.6' fill='none' stroke='rgba(255,220,170,.18)' stroke-width='.8'/><circle cx='3.5' cy='3.4' r='1.2' fill='rgba(255,225,180,.4)'/></svg>`);
const PLANK_BITS = [`${NAIL} left 7px top 6px/9px 9px no-repeat`, `${NAIL} left 7px bottom 6px/9px 9px no-repeat`, `${NAIL} right 7px top 6px/9px 9px no-repeat`, `${NAIL} right 7px bottom 6px/9px 9px no-repeat`, `${KNOT} right 9% bottom 4px/30px 11px no-repeat`, `${KNOT} right 21% top 4px/22px 8px no-repeat`].join(',');

// illuminated title: lapis ground with white filigree for the initial, a gold/blue/red border bar, ivy with gold bezants
const FILIGREE = svg(`<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36'><rect width='36' height='36' fill='#24459a'/><g fill='none' stroke='rgba(255,250,235,.7)' stroke-width='.8' stroke-linecap='round'><path d='M4 18c0-6 6-9 10-6s2 8-2 8-4-4-1-5'/><path d='M22 4c6 0 9 6 6 10s-8 2-8-2 4-4 5-1'/><path d='M32 26c0 5-5 8-9 6'/></g><g fill='rgba(255,250,235,.75)'><circle cx='26' cy='26' r='1'/><circle cx='28' cy='27.6' r='.8'/><circle cx='26.4' cy='28.4' r='.8'/><circle cx='9' cy='31' r='.9'/><circle cx='31' cy='9' r='.9'/></g></svg>`);
const BAR = svg(`<svg xmlns='http://www.w3.org/2000/svg' width='10' height='60'><rect width='10' height='60' fill='#d8ad4a'/><rect x='2' y='3' width='6' height='24' fill='#24459a'/><rect x='2' y='33' width='6' height='24' fill='#a8321c'/><path d='M5 6v18M5 36v18' stroke='rgba(255,245,220,.7)' stroke-width='.8' stroke-dasharray='1.5 2.5'/></svg>`);
const IVY = (() => { let leaves = ''; for (let i = 0; i < 6; i++) { const x = 15 + i * 30, up = i % 2 === 0; leaves += `<path d='M${x} ${up ? 9 : 15}l-5 ${up ? -6 : 6}l5 ${up ? 2 : -2}l5 ${up ? -2 : 2}z' fill='${i % 3 === 0 ? '#d8ad4a' : '#3f6a1c'}' stroke='#2b1a0e' stroke-width='.5'/><circle cx='${x + 12}' cy='${up ? 17 : 7}' r='2.6' fill='#d8ad4a' stroke='#8a6420' stroke-width='.6'/>`; }
  return svg(`<svg xmlns='http://www.w3.org/2000/svg' width='180' height='24'><path d='M0 12c15-8 30 8 45 0s30 8 45 0 30 8 45 0 30 8 45 0' fill='none' stroke='#8a6420' stroke-width='1.3'/>${leaves}</svg>`); })();

module.exports = { FILIGREE, BAR, IVY, PLANK_BITS, STONE, WOOD, WOOD_TAG, PAPER, CLOTH, WEB, deckle };
