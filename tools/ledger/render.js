/* ===== Goblin GM report renderer: "The Goblin's Ledger" (shared by Forecheck and both report pages) ===== */
const gobEsc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// report text may only carry <b> <i> <strong> <em> <span> <br> (no attributes) and a few entities
const gobTxt = s => gobEsc(s).replace(/&amp;(gt|lt|amp|quot|#39|nbsp|middot|rarr|larr|mdash|ndash);/g, '&$1;').replace(/&lt;(\/?)(b|i|span|strong|em)&gt;/g, '<$1$2>').replace(/&lt;br\s*\/?&gt;/g, '<br>');
const gobPlain = s => String(s || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const GOB_TINT = { '#e8f6ee': 'var(--lg-good)', '#fdecec': 'var(--lg-bad)', '#fff4db': 'var(--lg-warn)', '#eef1f6': 'var(--lg-muted)', '#fff8e6': 'var(--lg-note)' };
const GOB_EDGE = { '#e8f6ee': 'var(--lg-good-ink)', '#fdecec': 'var(--lg-bad-ink)', '#fff4db': 'var(--lg-warn-ink)', '#fff8e6': 'var(--lg-warn-ink)' };
function gobCellTint(c) { const s = String(c); return /^❌/.test(s) ? GOB_TINT['#fdecec'] : /^✅/.test(s) ? GOB_TINT['#e8f6ee'] : s.includes('🛌') && s.length < 8 ? GOB_TINT['#fff4db'] : null; }
// the Goblin's own lines (jokes, sign-off) become his speech bubble
const GOB_VOICE = /\b(goblin|undercroft|the council|brazier|toadstools?|candle stub|sealing wax|quill|crawlspace|under the stairs|boiler|mushrooms?|damp sock|the crew)\b/i;
const gobQuip = h => `<div class="quip"><span class="qby">the Goblin mutters</span>${h}</div>`;
// matchup tiers ("🟩 4" = the 4th easiest defence for that position, of 32) become labelled chips
const gobOrd = n => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' })[n % 10] || 'th');
const GOB_TIER = /(🟩|🟨|🟥)\s*(\d{1,2})(?!\d)/gu;
const gobMu = (h, long) => h.replace(GOB_TIER, (m, t, n) => { n = +n; if (n < 1 || n > 32) return m; const k = t === '🟩' ? 'g' : t === '🟥' ? 'r' : 'y'; const txt = k === 'g' ? gobOrd(n) + ' easiest' + (long ? ' matchup' : '') : k === 'r' ? gobOrd(33 - n) + ' toughest' + (long ? ' matchup' : '') : (long ? 'average matchup (' + gobOrd(n) + ' easiest)' : gobOrd(n) + ' easiest'); return `<span class="mu ${k}">${txt}</span>`; });
const GOB_ICONS = ['🍄', '🕯️', '🦴', '🗝️', '🐀', '🪓', '🕸️', '🧪'];

// standard report names: the wooden tag shows the day, the scroll shows the title
const GOB_KINDS = { tue: ['Tuesday', 'Game plan'], thu: ['Thursday', 'Early check'], sat: ['Saturday', 'Refresh'], sunam: ['Sun AM', 'Morning check'], sun: ['Sunday', 'Inactives'] };
function gobName(r) { const k = (String((r && r.id) || '').match(/-(tue|thu|sat|sunam|sun)$/) || [])[1]; const n = GOB_KINDS[k];
  return n ? { day: n[0], title: n[1] } : { day: (r && (r.label || r.id)) || 'Report', title: (r && (r.title || r.label)) || 'Goblin GM report' }; }
const gobSub = s => String(s || '').replace(/(^|\s*·\s*)recommendations only(\s*·\s*|$)/i, (m, a, b) => a && b ? ' · ' : '').trim();
function gobTitle(r) {
  const n = gobName(r), t = n.title, sub = gobSub(r.sub);
  const rest = gobEsc(t.slice(1)).replace(/[ky]/g, '<span class="ky">$&</span>');  // k and y from the heading font: the blackletter ones read as t and n
  return `<div class="grh"><i class="roll l"></i><i class="roll r"></i><i class="gbar"></i><i class="ivy top"></i><i class="ivy bot"></i><i class="drol" aria-hidden="true"></i>`
    + `<div class="rub">${r.week ? `Week ${gobEsc(r.week)}` : ''}${r.week && r.updated ? ' · ' : ''}${gobTxt(r.updated || '')}</div>`
    + `<div class="t"><span class="ini">${gobEsc(t[0])}</span>${rest}</div>${sub ? `<div class="s">${gobTxt(sub)}</div>` : ''}</div>`;
}
function gobReport(r) {
  const parts = []; let cur = null;
  const flush = () => { if (cur !== null) { parts.push({ sec: true, h: cur + '</section>' }); cur = null; } };
  const put = s => { if (cur === null) cur = '<section class="gsec">'; cur += s; };
  parts.push({ h: gobTitle(r) });
  for (const b of r.blocks || []) {
    const k = b[0];
    if (k === 'league') { flush(); parts.push({ h: `<div class="glg${/bell/i.test(b[1]) ? ' bell' : ''}"><b>${gobTxt(b[1])}</b>${b[2] ? `<small>${gobTxt(b[2])}</small>` : ''}</div>` }); }
    else if (k === 'h2') { flush(); put(`<h2>${gobTxt(b[1])}</h2>${b[2] ? `<div class="gsub">${gobTxt(b[2])}</div>` : ''}`); }
    else if (k === 'box') {
      flush(); const seg = gobTxt(b[2]).split(/<br\s*\/?>/i); let q = '';
      if (seg.length > 1 && GOB_VOICE.test(gobPlain(seg[seg.length - 1]))) q = seg.pop();
      else if (seg.length > 1 && GOB_VOICE.test(gobPlain(seg[0]))) q = seg.shift();
      parts.push({ h: `<div class="gbx"><span class="dagger" aria-hidden="true">🗡️</span><b class="gbt">${gobTxt(b[1])}</b><div>${gobMu(seg.join('<br>'), true)}</div>${q ? gobQuip(q) : ''}</div>` });
    }
    else if (k === 'p') {
      const lab = String(b[1] || ''), body = gobTxt(b[2]);
      if (lab === '🧌' || (!lab && GOB_VOICE.test(gobPlain(b[2])))) put(gobQuip(body));
      else put(`<p class="gpp">${/^verdict/i.test(lab) ? '<span class="seal" aria-hidden="true">G</span>' : ''}${lab ? `<b>${gobTxt(lab)}</b> ` : ''}${gobMu(body, true)}</p>`);
    }
    else if (k === 't') put(gobTable(b[1] || [], b[2] || [], b[3] || {}));
    else if (k === 'd') {
      const P = b[1] || [], G = b[2] || [];
      put(`<div class="gscroll"><table class="gtb gd"><tr><th></th>${P.map(p => `<th class="c${p[2] ? ' pk' : ''}">${gobTxt(p[0])}<small>${gobTxt(p[1] || '')}</small></th>`).join('')}</tr>${G.map(([g, ms]) => `<tr class="gg"><td colspan="${P.length + 1}">${gobTxt(g)}</td></tr>` + (ms || []).map(([m, vals]) => `<tr><td>${gobTxt(m)}</td>${(vals || []).map((v, j) => { const bg = gobCellTint(v) || (P[j] && P[j][2] ? 'var(--lg-pick)' : null); return `<td class="c${/^adj/i.test(m) ? ' b' : ''}"${bg ? ` style="background:${bg}"` : ''}>${gobMu(gobTxt(v))}</td>`; }).join('')}</tr>`).join('')).join('')}</table></div>`);
    }
  }
  flush();
  let h = '', n = 0;
  parts.forEach((p, i) => { if (p.sec && parts[i - 1] && parts[i - 1].sec) h += `<div class="gdiv" aria-hidden="true">${GOB_ICONS[n++ % GOB_ICONS.length]}</div>`; h += p.h; });
  if ((r.sources || []).length) h += `<p class="gsrc">📚 ${r.sources.map(s => /^https:\/\//.test(s[1] || '') ? `<a href="${gobEsc(s[1])}" target="_blank" rel="noopener">${gobEsc(s[0])}</a>` : gobEsc(s[0])).join(' · ')}</p>`;
  return h + '<div class="gend"><b>Sealed in wax by the Goblin, Ledger-Keeper of the Undercroft</b><span aria-hidden="true">🦴 🐀 🍄</span></div>';
}
/* Short tables stay tables. Wide ones (5+ columns with long text, or 4+ with very long text) become one ledger entry per row:
   title, short values as labelled chips, long values as labelled lines. In the lineup, 🟢 ("start") is dropped: being listed already says it. */
function gobTable(head, rows, o) {
  const al = o.c || [], tint = o.tint || [];
  const plain = v => gobPlain(String(v ?? ''));
  const lineup = /^slot$/i.test(plain(head[0]));
  rows = rows.map(row => row.map((c, ci) => lineup && /^note/i.test(plain(head[ci])) ? String(c ?? '').replace(/🟢\s*/gu, '').trim() : c));
  const avgLen = c => rows.reduce((a, r) => a + plain(r[c]).length, 0) / Math.max(1, rows.length);
  const wide = (head.length >= 5 && head.slice(1).some((_, i) => avgLen(i + 1) > 12)) || (head.length >= 4 && head.slice(1).some((_, i) => avgLen(i + 1) > 22));
  if (!wide) return `<div class="gscroll"><table class="gtb${head.length >= 5 ? ' fx' : ''}"><tr>${head.map((x, i) => `<th class="${al[i] ? 'c' : ''}">${gobTxt(x)}</th>`).join('')}</tr>${rows.map((row, ri) => `<tr>${row.map((c, ci) => { const bg = gobCellTint(c) || GOB_TINT[tint[ri]] || null; return `<td class="${al[ci] ? 'c' : ''}"${bg ? ` style="background:${bg}"` : ''}>${gobMu(gobTxt(c))}</td>`; }).join('')}</tr>`).join('')}</table></div>`;
  const tierOnly = v => /^(🟩|🟨|🟥)\s*\d{1,2}$/u.test(v);
  return `<div class="gst">${rows.map((row, ri) => {
    const short0 = plain(row[0]).length <= 4;  // a slot, a number or a dash leads the title as a small wax tag
    const title = short0 ? `${plain(row[0]) ? `<span class="tag">${gobTxt(row[0])}</span>` : ''}${gobTxt(row[1])}` : gobTxt(row[0]);
    let rest = row.map((c, ci) => [ci, c]).filter(([ci, c]) => ci > (short0 ? 1 : 0) && plain(c) && !/^[-–—]$/.test(plain(c)));
    const marks = rest.filter(([, c]) => !/[\p{L}\p{N}]/u.test(plain(c))); rest = rest.filter(x => !marks.includes(x));
    const chips = rest.filter(([, c]) => plain(c).length <= 14).map(([ci, c]) => tierOnly(plain(c)) ? gobMu(gobTxt(c), true) : `<span><i>${gobTxt(head[ci])}</i>${gobMu(gobTxt(c), true)}</span>`).join('');
    const lines = rest.filter(([, c]) => plain(c).length > 14).map(([ci, c]) => `<div class="ln"><i>${gobTxt(head[ci])}</i> ${gobMu(gobTxt(c), true)}</div>`).join('');
    const edge = GOB_EDGE[tint[ri]] || (/^✅/.test(plain(row[0])) ? 'var(--lg-good-ink)' : /^❌/.test(plain(row[0])) ? 'var(--lg-bad-ink)' : '');
    return `<div class="gr"${edge ? ` style="border-left-color:${edge}"` : ''}><div class="gt">${title}${marks.map(([, c]) => ' ' + gobTxt(c)).join('')}</div>${chips ? `<div class="kv">${chips}</div>` : ''}${lines}</div>`;
  }).join('')}</div>`;
}
/* ===== end of shared renderer ===== */
