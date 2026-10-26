// Renders the Goblin drawing to a crisp high-resolution WebP (iPhone Safari blurs filtered SVG backgrounds),
// and subsets the report fonts to Latin WOFF files for embedding. Usage: node rasterize.js <fonts dir (google/fonts ofl)>
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const { GOBLIN, VB } = require('./goblin.js');
const OUT = __dirname, W = 300, H = Math.round(W * VB.h / VB.w);
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await p.setContent(`<body style="margin:0;background:transparent"><img src="data:image/svg+xml,${encodeURIComponent(GOBLIN)}" width="${W}" height="${H}" style="display:block"></body>`);
  await p.waitForTimeout(300); await p.screenshot({ path: path.join(OUT, 'goblin.png'), omitBackground: true }); await b.close();
  execFileSync('python3', ['-c', `from PIL import Image; Image.open('${OUT}/goblin.png').save('${OUT}/goblin.webp', 'WEBP', quality=90, method=6)`]);
  fs.unlinkSync(path.join(OUT, 'goblin.png'));
  console.log('goblin.webp', W + 'x' + H, fs.statSync(path.join(OUT, 'goblin.webp')).size, 'bytes');
})();
