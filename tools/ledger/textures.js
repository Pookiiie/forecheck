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
const WOOD = svg(`<svg xmlns='http://www.w3.org/2000/svg' width='600' height='120'>
<filter id='w'><feTurbulence type='fractalNoise' baseFrequency='.004 .18' numOctaves='4' seed='3'/><feColorMatrix values='0 0 0 0 .1 0 0 0 0 .05 0 0 0 0 .01 0 0 0 1.1 -.35'/></filter>
<rect width='600' height='120' fill='#5b3a1f'/><rect width='600' height='120' filter='url(#w)'/></svg>`);
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


module.exports = { STONE, WOOD, PAPER, CLOTH, WEB, deckle };
