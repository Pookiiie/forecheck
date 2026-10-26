// Builds "The Goblin's Ledger" into Forecheck (index.html) and both Goblin GM report pages from one source.
// usage: node build.js <forecheck index.html> <eric page out> <max page out>
const fs = require('fs'); const path = require('path');
const { STONE, WOOD, WOOD_TAG, PAPER, CLOTH, WEB, deckle } = require('./textures.js');
const RENDER = fs.readFileSync(path.join(__dirname, 'render.js'), 'utf8');
const FONTS = 'https://fonts.googleapis.com/css2?family=Pirata+One&family=IM+Fell+English:ital@0;1&family=IM+Fell+English+SC&family=UnifrakturMaguntia&display=swap';

// LW = the wall (the scrolling area), LR = the element that holds the report
const ledgerCSS = (LW, LR) => `
/* ---- The Goblin's Ledger: stone wall, burnt parchment, wax and cobwebs ---- */
${LW}{background-color:#141210;background-image:radial-gradient(60% 50% at 0% 0%,rgba(255,140,30,.28),transparent 70%),radial-gradient(60% 50% at 100% 60%,rgba(255,140,30,.18),transparent 70%),${STONE};background-size:100% 900px,100% 900px,auto;background-repeat:no-repeat,no-repeat,repeat;background-attachment:local}
${LR}{--lg-ink:#3a2512;--lg-ink2:#6e5130;--lg-rule:#8a6a3c;--lg-blood:#8b1d10;--lg-gold:#f0c46a;--lg-paper:#e6d2a6;--lg-note-paper:#ead594;
  --lg-good:rgba(70,130,40,.22);--lg-bad:rgba(170,40,20,.17);--lg-warn:rgba(205,145,30,.26);--lg-muted:rgba(110,70,20,.1);--lg-note:rgba(205,145,30,.14);--lg-pick:rgba(70,130,40,.14);
  --lg-good-ink:#3f8f22;--lg-bad-ink:#b3301a;--lg-warn-ink:#c98a12;
  --lg-ui:var(--ui,-apple-system,BlinkMacSystemFont,"Helvetica Neue",system-ui,sans-serif);--lg-fell:"IM Fell English",Georgia,"Times New Roman",serif;--lg-fellsc:"IM Fell English SC",Georgia,serif;--lg-pirate:"Pirata One","Palatino Linotype",Georgia,serif;--lg-frak:"UnifrakturMaguntia","Old English Text MT",Georgia,serif;
  position:relative;display:flex;flex-direction:column;gap:14px;padding-top:14px;padding-bottom:10px}
${LR}::before{content:'';position:absolute;top:0;right:-6px;width:150px;height:150px;background:${WEB};pointer-events:none;z-index:3}
${LR}::after{content:'🕷️';position:absolute;top:0;right:41px;padding-top:34px;font-size:17px;line-height:1;z-index:3;pointer-events:none;background:linear-gradient(rgba(230,225,210,.55),rgba(230,225,210,.55)) 50% 0/1px 38px no-repeat;filter:drop-shadow(0 2px 2px #000)}
/* report tabs: wooden tags on nails */
${LR} .pls{display:flex;flex-wrap:wrap;gap:8px;padding:0 4px}
${LR} .pls button{position:relative;font:400 16px var(--lg-pirate);letter-spacing:.03em;text-transform:none;background:${WOOD_TAG} 0 0/auto 260%,#5e3b1e;color:#e9cf9b;border:0;border-radius:3px 3px 10px 10px;padding:9px 14px 6px;box-shadow:0 3px 6px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,220,160,.2);text-shadow:0 1px 0 #000;cursor:pointer}
${LR} .pls button::before{content:'';position:absolute;top:3px;left:50%;width:5px;height:5px;margin-left:-2.5px;border-radius:50%;background:#1a1006;box-shadow:0 1px 0 rgba(255,220,160,.3)}
${LR} .pls button.on{color:#fff1cf;box-shadow:0 0 0 2px #c0391f,0 3px 8px rgba(0,0,0,.6),0 0 16px rgba(255,90,40,.35)}
/* parchment is drawn on a clipped layer so the torn edge keeps its drop shadow */
${LR} .grh,${LR} .gsec,${LR} .gbx,${LR} .gempty{position:relative;isolation:isolate;filter:drop-shadow(0 6px 8px rgba(0,0,0,.65));color:var(--lg-ink)}
${LR} .grh::before,${LR} .gsec::before,${LR} .gbx::before,${LR} .gempty::before{content:'';position:absolute;inset:0;z-index:-1;background:${PAPER},var(--lg-paper);
  box-shadow:inset 0 0 26px rgba(110,55,10,.6),inset 0 0 6px rgba(70,30,5,.9),inset 0 0 70px rgba(150,90,30,.25);clip-path:${deckle()}}
${LR} .gsec:nth-of-type(even)::before{clip-path:${deckle()}}
${LR} .gsec:nth-of-type(3n)::before{clip-path:${deckle()}}
${LR} .gsec{display:grid;gap:9px;min-width:0;padding:18px 16px 16px}
${LR} .gsec:nth-of-type(odd){transform:rotate(-.35deg)}
${LR} .gsec:nth-of-type(even){transform:rotate(.3deg)}
/* the title scroll */
${LR} .grh{margin:4px 6px 0;padding:20px 26px 16px;text-align:center}
${LR} .grh .roll{position:absolute;top:-6px;bottom:-6px;width:16px;border-radius:8px;z-index:1}
${LR} .grh .roll.l{left:-6px;background:linear-gradient(90deg,#6b4a22,#d9bb83 45%,#7b5628)}
${LR} .grh .roll.r{right:-6px;background:linear-gradient(90deg,#7b5628,#d9bb83 55%,#6b4a22)}
${LR} .grh .t{font:400 37px/1.05 var(--lg-frak);color:var(--lg-blood);text-shadow:0 1px 0 rgba(255,240,200,.5);text-wrap:balance}
${LR} .grh .s{font:italic 400 15px/1.35 var(--lg-fell);color:var(--lg-ink2);margin-top:6px}
${LR} .grh .s::after{content:'~ ❧ ~';display:block;margin-top:6px;color:var(--lg-rule);letter-spacing:.2em;font-style:normal}
/* league banners: cloth in each league's colour (PFL violet, BELL teal) */
${LR} .glg{position:relative;margin:4px 0 0;padding:10px 40px 12px;text-align:center;color:#f6d98f;text-shadow:0 2px 0 rgba(0,0,0,.6);
  background:${CLOTH},linear-gradient(180deg,rgba(255,255,255,.12),transparent 40%,rgba(0,0,0,.3)),#4b2a7a;clip-path:polygon(0 0,100% 0,95% 50%,100% 100%,0 100%,5% 50%);box-shadow:inset 0 0 0 3px rgba(240,196,106,.55)}
${LR} .glg.bell{background:${CLOTH},linear-gradient(180deg,rgba(255,255,255,.12),transparent 40%,rgba(0,0,0,.3)),#145f57}
${LR} .glg b{display:block;font:400 25px/1.15 var(--lg-pirate);letter-spacing:.04em}
${LR} .glg small{display:block;font:italic 400 14px var(--lg-fell);color:#ecdcb5;margin-top:2px;text-shadow:none}
${LR} .glg::before,${LR} .glg::after{content:'⚔';position:absolute;top:50%;transform:translateY(-50%);font-size:16px;color:var(--lg-gold);left:30px;text-shadow:none}
${LR} .glg::after{left:auto;right:30px}
/* section headings and running text */
${LR} .gsec>h2{margin:0;font:400 26px/1.05 var(--lg-pirate);letter-spacing:.02em;text-transform:none;color:var(--lg-blood);padding-bottom:5px;border-bottom:2px solid transparent;border-image:linear-gradient(90deg,transparent,var(--lg-rule) 12%,var(--lg-rule) 88%,transparent) 1;text-wrap:balance}
${LR} .gsub{font:italic 400 15px var(--lg-fell);color:var(--lg-ink2);margin-top:-4px}
${LR} .gpp{margin:0;font:400 16px/1.45 var(--lg-fell);color:var(--lg-ink)}
${LR} .gpp b{font:700 14px var(--lg-ui)}
${LR} .gsec>.gpp:first-of-type:not(:has(.seal))::first-letter{font:400 40px/0.8 var(--lg-frak);color:var(--lg-blood);float:left;margin:4px 6px 0 0}
/* pinned notes: a dagger through yellowed paper, with a stain */
${LR} .gbx{margin:14px 4px 0;padding:26px 18px 16px;transform:rotate(-.8deg);font:400 16px/1.45 var(--lg-fell)}
${LR} .gbx::before{background:radial-gradient(circle at 86% 78%,transparent 0 30px,rgba(120,70,20,.28) 31px 34px,rgba(120,70,20,.08) 35px 40px,transparent 41px),${PAPER},var(--lg-note-paper);clip-path:${deckle(30, 7)}}
${LR} .gbx .gbt{display:block;text-align:center;font:400 25px/1.1 var(--lg-pirate);color:var(--lg-blood);margin-bottom:6px;text-wrap:balance}
${LR} .gbx b:not(.gbt){font:700 14.5px var(--lg-ui)}
${LR} .gbx .dagger{position:absolute;top:-16px;left:50%;margin-left:-14px;font-size:28px;transform:rotate(135deg);filter:drop-shadow(1px 3px 2px rgba(0,0,0,.6));z-index:2}
/* ledger entries (wide tables, one entry per row) */
${LR} .gst{display:grid;gap:7px}
${LR} .gr{display:grid;gap:3px;background:rgba(120,80,30,.1);border-left:3px solid rgba(110,80,40,.45);border-radius:2px;padding:7px 10px;box-shadow:inset 0 -1px 0 rgba(110,80,40,.25)}
${LR} .gr .gt{color:var(--lg-ink);font:700 14.5px/1.35 var(--lg-ui)}
${LR} .gr .gt .tag{display:inline-block;min-width:22px;margin-right:7px;padding:1px 6px;text-align:center;background:radial-gradient(circle at 35% 30%,#c8402c,#8b1d10 70%);color:#ffe2cf;border-radius:9px 7px 10px 6px;font:400 14px/1.45 var(--lg-pirate);letter-spacing:.04em;box-shadow:0 1px 2px rgba(0,0,0,.5),inset 0 0 0 1.5px rgba(0,0,0,.18);vertical-align:1px}
${LR} .gr .kv{display:flex;flex-wrap:wrap;align-items:center;gap:3px 12px;color:var(--lg-ink);font:600 14px/1.35 var(--lg-ui);font-variant-numeric:tabular-nums}
${LR} .gr .kv i,${LR} .gr .ln i{font:400 13px var(--lg-fellsc);font-style:normal;letter-spacing:.02em;color:var(--lg-rule);margin-right:4px}
${LR} .gr .ln{color:var(--lg-ink);font:400 15px/1.4 var(--lg-fell)}
/* tables */
${LR} .gscroll{overflow-x:auto;min-width:0}
${LR} .gtb{width:100%;border-collapse:collapse;color:var(--lg-ink);font:500 14px/1.35 var(--lg-ui);font-variant-numeric:tabular-nums}
${LR} .gtb th{font:400 13.5px/1.2 var(--lg-fellsc);letter-spacing:.02em;text-transform:none;color:var(--lg-rule);text-align:left;padding:0 6px 4px;vertical-align:bottom}
${LR} .gtb td{padding:6px;border-top:1px dashed rgba(110,80,40,.45);vertical-align:top}
${LR} .gtb th:first-child,${LR} .gtb td:first-child{padding-left:2px}
${LR} .gtb .c{text-align:center}
${LR} .gtb td.b{font-weight:700}
${LR} .gtb.fx td:first-child{min-width:108px}
${LR} .gtb.fx td{padding-left:4px;padding-right:4px}
${LR} .gtb th small{display:block;color:var(--lg-rule);font:italic 400 12px/1.25 var(--lg-fell);margin-top:1px}
${LR} .gtb th.pk{color:var(--lg-good-ink)}
${LR} .gtb tr.gg td{background:rgba(110,70,20,.16);color:var(--lg-blood);font:400 16px var(--lg-pirate);letter-spacing:.04em;padding:3px 6px}
${LR} .gtb.gd td:first-child{color:var(--lg-ink2);font:italic 400 14px var(--lg-fell)}
/* matchup chips */
${LR} .mu{display:inline-block;padding:1px 7px;border-radius:999px;font:700 12.5px/1.45 var(--lg-ui);white-space:nowrap;color:#fff6e6;box-shadow:inset 0 0 0 1px rgba(0,0,0,.15)}
${LR} .mu.g{background:#4f7f2a} ${LR} .mu.y{background:#a87814} ${LR} .mu.r{background:#a8321c}
/* the Goblin talks */
${LR} .quip{position:relative;margin:10px 0 2px 2px;padding:12px 12px 10px 54px;background:${PAPER},#c9d99a;border-radius:18px 18px 18px 3px;box-shadow:0 2px 0 #3f5a1a,inset 0 0 0 1.5px rgba(50,80,20,.55);font:italic 400 15.5px/1.4 var(--lg-fell);color:#24360b}
${LR} .quip::before{content:'🧌';position:absolute;left:8px;top:50%;transform:translateY(-50%);width:36px;height:36px;display:grid;place-items:center;font-size:24px;font-style:normal;border-radius:50%;background:radial-gradient(circle,#6a8f2f,#2c4310);box-shadow:0 0 0 2px #1f300a,0 0 10px rgba(130,200,60,.5)}
${LR} .quip .qby{position:absolute;top:-9px;left:52px;padding:0 6px;font:400 12px/1.5 var(--lg-fellsc);font-style:normal;color:#ecf2d8;background:#3f5a1a;border-radius:6px}
${LR} .quip b{font-family:var(--lg-ui);font-style:normal;font-size:14px}
/* wax seal on every verdict */
${LR} .seal{display:inline-grid;place-items:center;width:28px;height:28px;margin:0 8px 0 0;float:left;border-radius:47% 53% 50% 50%;background:radial-gradient(circle at 38% 34%,#e0553f,#9a2414 55%,#6c140a);color:#ffd6c4;font:400 17px var(--lg-frak);box-shadow:0 2px 3px rgba(0,0,0,.5),inset 0 0 0 3px rgba(0,0,0,.15),inset 0 0 0 5px rgba(255,180,160,.18)}
/* dividers and sign-off */
${LR} .gdiv{text-align:center;font-size:17px;margin:-4px 0;filter:drop-shadow(0 2px 2px #000)}
${LR} .gsrc{margin:6px 0 0;text-align:center;font:italic 400 14px/1.45 var(--lg-fell);color:#b9a27a;padding:0 10px}
${LR} .gsrc a{color:#e9c27a}
${LR} .gend{display:grid;gap:12px;justify-items:center;text-align:center;padding:4px 10px 26px}
${LR} .gend b{font:400 19px var(--lg-pirate);color:#d9b36a;text-shadow:0 2px 0 #000}
${LR} .gend span{font-size:22px;letter-spacing:.5em;margin-right:-.5em}
${LR} .gempty{padding:26px 20px;text-align:center;font:italic 400 16px/1.45 var(--lg-fell)}
${LR} .gempty b{display:block;font:400 26px var(--lg-pirate);font-style:normal;color:var(--lg-blood);margin-bottom:4px}
@media (prefers-reduced-motion:reduce){${LR} .gsec,${LR} .gbx{transform:none}}
`;

// ---------------- Forecheck ----------------
const appCSS = ledgerCSS('#sheet.gob #shScroll', '#sheet.gob #shBody') + `
#sheet.gob .nav{background:${WOOD_TAG} 0 50%/auto 220%,#5e3b1e;border-bottom:3px solid #2a1709;box-shadow:0 6px 16px rgba(0,0,0,.7),inset 0 -2px 0 rgba(255,220,160,.12),inset 0 2px 0 rgba(255,220,160,.12)}
#sheet.gob .back{color:#f0c46a;text-shadow:0 1px 0 #000}
#sheet.gob .sh-title{font:400 29px "Pirata One","Palatino Linotype",Georgia,serif;letter-spacing:.03em;text-transform:none;color:#f0c46a;text-shadow:0 2px 0 #2a1709,0 -1px 0 rgba(255,240,200,.35),0 0 14px rgba(255,170,40,.35)}
#sheet.gob .sh-title::before{content:'🧌 ';font-size:21px;text-shadow:none}
#sheet.gob #shBody>.err,#sheet.gob #shBody>.empty{color:#e9cf9b;background:rgba(0,0,0,.4)}
`;
function buildApp(file) {
  let h = fs.readFileSync(file, 'utf8');
  const swap = (a, b, body, label) => { const i = h.indexOf(a), j = h.indexOf(b, i); if (i < 0 || j < 0) throw new Error('marker missing: ' + label); h = h.slice(0, i) + a + body + h.slice(j); };
  swap('/*LEDGER-CSS*/', '/*/LEDGER-CSS*/', appCSS, 'css');
  swap('/*LEDGER-JS*/', '/*/LEDGER-JS*/', '\n' + RENDER, 'js');
  fs.writeFileSync(file, h);
}

// ---------------- report pages ----------------
const page = cfg => `<title>${cfg.title}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Pirata+One&family=IM+Fell+English:ital@0;1&family=IM+Fell+English+SC&family=UnifrakturMaguntia&display=swap">
<style>
/* Layout: a carved wooden plank on a dungeon wall, then one column of burnt parchment scraps (the Goblin's ledger).
   One deliberate look in every theme: the wall is always dark and the paper always light. */
:root{color-scheme:dark;--wall:#141210;--plank:#5b3a1f;--gold:#f0c46a;--tag:#e9cf9b;--ink-soft:#b9a27a;
  --ui:"Barlow",-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;--pirate:"Pirata One","Palatino Linotype",Georgia,serif}
html{background:var(--wall)}
body{background:var(--wall);color:var(--tag);font-family:var(--ui);font-size:15px;line-height:1.45}
.wrap{max-width:680px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
.plank{background:${WOOD_TAG} 0 0/auto 100%,var(--plank);border-bottom:3px solid #2a1709;box-shadow:0 6px 16px rgba(0,0,0,.7),inset 0 -2px 0 rgba(255,220,160,.12);position:relative;z-index:4}
.plank .wrap{padding-block:12px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 16px}
.brand{font:400 31px/1.1 var(--pirate);letter-spacing:.03em;color:var(--gold);text-shadow:0 2px 0 #2a1709,0 -1px 0 rgba(255,240,200,.35),0 0 14px rgba(255,170,40,.35)}
.brand small{display:block;font:italic 400 14px "IM Fell English",Georgia,serif;letter-spacing:0;color:var(--tag);text-shadow:0 1px 0 #000}
.pick{display:flex;align-items:center;gap:8px;min-width:0}
.pick label{font:400 15px var(--pirate);letter-spacing:.04em;color:var(--tag);text-shadow:0 1px 0 #000}
.pick select{max-width:100%;font:600 15px var(--ui);padding:7px 10px;border-radius:4px;border:1px solid #2a1709;background:#2a1a0c;color:#f6e3bb;box-shadow:inset 0 1px 3px rgba(0,0,0,.6)}
.pick select:focus-visible{outline:2px solid var(--gold);outline-offset:2px}
main .wrap{padding-block:6px 30px}
main #report{padding-top:46px}
.foot{margin:0;text-align:center;font:400 12px/1.5 var(--ui);color:var(--ink-soft);padding:0 8px}
${ledgerCSS('body', '#report')}
</style>

<header class="plank"><div class="wrap">
  <div class="brand">🧌 Goblin GM<small>${cfg.brandSub}</small></div>
  <div class="pick" id="pickBox" hidden><label for="week">${cfg.pickLabel}</label><select id="week"></select></div>
</div></header>

<main><div class="wrap">
  <div id="report"><div class="gempty"><b>Unrolling the latest scroll…</b>${cfg.loading}</div></div>
  <p class="foot">${cfg.foot}</p>
</div></main>

<script>
(function(){
${RENDER}
  const $=id=>document.getElementById(id);
  const empty=(t,x)=>{$("report").innerHTML='<div class="gempty"><b>'+gobEsc(t)+"</b>"+gobEsc(x)+"</div>"};
  const get=p=>fetch(p+"?v="+Date.now()).then(r=>{if(!r.ok)throw new Error(r.status);return r.json()});
  const render=r=>{$("report").innerHTML=gobReport(r);};
${cfg.loader}
})();
</script>
`;

const ERIC_LOADER = `
  const safe=id=>/^[a-z0-9-]+$/.test(id);
  async function show(id){if(!safe(id))return;try{render(await get("reports/"+id+".json"))}
    catch(e){empty("That report isn't available","Pick another one, or check back after the next scheduled run.")}}
  get("reports/latest.json").then(idx=>{
    const list=(idx.entries||[]).filter(e=>e&&safe(e.id));
    if(!list.length){empty("No reports yet","The first one lands here Tuesday at 9:53am.");return}
    const weeks={};for(const e of list)(weeks[e.week]||=[]).push(e);
    const order=Object.keys(weeks).map(Number).sort((a,b)=>b-a);
    $("week").innerHTML=order.map(w=>'<optgroup label="Week '+w+'">'+weeks[w].slice().reverse().map(e=>'<option value="'+e.id+'">'+gobEsc(e.label||e.id)+(e.id==idx.latest?" (latest)":"")+"</option>").join("")+"</optgroup>").join("");
    $("pickBox").hidden=list.length<2;
    const first=safe(idx.latest||"")?idx.latest:list[list.length-1].id;
    $("week").value=first;$("week").onchange=()=>show($("week").value);
    show(first);
  }).catch(()=>empty("No reports yet","The first one lands here Tuesday at 9:53am."));`;
const MAX_LOADER = `
  async function show(w){try{render(await get("reports/wk"+w+".json"))}
    catch(e){empty("Week "+w+" isn't available","Pick another week, or check back after Tuesday morning's update.")}}
  get("reports/latest.json").then(idx=>{
    const weeks=(idx.weeks||[]).slice().sort((a,b)=>b-a);
    if(!weeks.length){empty("No game plan yet","The first one lands here Tuesday morning.");return}
    const sel=$("week");sel.innerHTML=weeks.map(w=>'<option value="'+w+'">Week '+w+(w==idx.latest?" (latest)":"")+"</option>").join("");
    $("pickBox").hidden=weeks.length<2;
    sel.value=String(idx.latest);sel.onchange=()=>show(sel.value);
    show(idx.latest);
  }).catch(()=>empty("No game plan yet","The first one lands here Tuesday morning."));`;

const [, , APP, ERIC, MAX] = process.argv;
if (APP && APP !== '-') buildApp(APP);
if (ERIC) fs.writeFileSync(ERIC, page({ title: 'Goblin GM Reports', brandSub: 'PFL + Bell Mirabel, from under the stairs', pickLabel: 'Report', loading: 'Start/sit calls, waivers, trades, matchups and byes for PFL and Bell Mirabel.', foot: 'Recommendations only: nothing here changes your Sleeper or CBS teams. Built by Goblin GM from Sleeper, ESPN, CBS and FantasyPros projections.', loader: ERIC_LOADER }));
if (MAX) fs.writeFileSync(MAX, page({ title: 'Goblin GM for Max', brandSub: 'Max D Best · Bell Mirabel', pickLabel: 'Week', loading: 'Start/sit calls, waiver adds, trade ideas and the bye-week outlook for Max D Best.', foot: 'Recommendations only: nothing here changes your CBS team. Built by Goblin GM from Sleeper, ESPN, CBS and FantasyPros projections.', loader: MAX_LOADER }));
console.log('built');
