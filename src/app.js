/* ============ 저장(이 기기 브라우저에만) ============ */
const KEY = 'upstage-hanip:v1';
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';   // 스크롤 자리는 앱이 정한다(다시 열면 지금 할 레슨으로)
function load(){ try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } }
let store = load();
store.done = store.done || {};
store.prep = store.prep || {};   // 연수 전 준비물 체크 'id' → true
function save(){ try { localStorage.setItem(KEY, JSON.stringify(store)); } catch {} }
const pkey = (u, it) => `${u.id}:${it.id}`;
const ZOOMS = [['작게', .92], ['보통', 1], ['크게', 1.12]];
function applyZoom(){ document.documentElement.style.setProperty('--zoom', store.zoom || 1); }
applyZoom();

/* ============ 도우미 ============ */
function h(tag, attrs, ...kids){
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})){
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(c));
  return el;
}
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const MARKS = ['①','②','③','④'];
const PRAISE = ['정답이에요!', '딩동댕!', '좋아요, 한입 더!', '완벽해요!', '눈치 100점!', '오, Solar 체질인데요?'];
const OOPS = ['아깝다!', '괜찮아요, 여기서 배워요', '한 번 더 볼까요?', '틀려야 기억에 남아요'];
const pick = a => a[Math.floor(Math.random() * a.length)];
const isPC = () => matchMedia('(min-width: 900px)').matches;
const buzz = ms => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch {} };

/* ============ 소리(Web Audio로 그 자리에서 만든다, 파일 없음) ============ */
const SFX = (() => {
  let ctx = null, last = 0;
  const ac = () => {
    if (store.sound === false) return null;
    try { if (!ctx){ const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C(); } if (ctx.state === 'suspended') ctx.resume(); } catch { return null; }
    return ctx;
  };
  /* 음 하나: 주파수(끝 주파수로 미끄러질 수 있음), 시작 지연, 길이, 파형, 크기 */
  const tone = (c, f, at, dur, type = 'sine', vol = .1, f2) => {
    const t = c.currentTime + at, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + .02);
  };
  const play = fn => { const c = ac(); if (!c) return; last = performance.now(); fn(c); };
  return {
    tap(){ setTimeout(() => { if (performance.now() - last > 40) play(c => tone(c, 1500, 0, .035, 'triangle', .045, 900)); }, 0); },
    pick(){ play(c => tone(c, 1046, 0, .07, 'sine', .07, 1318)); },
    right(){ play(c => { tone(c, 880, 0, .12, 'sine', .11); tone(c, 1318.5, .09, .26, 'sine', .11); tone(c, 2637, .09, .18, 'sine', .025); }); },
    wrong(){ play(c => { tone(c, 311, 0, .16, 'triangle', .12, 262); tone(c, 233, .13, .24, 'triangle', .11, 196); }); },
    done(){ play(c => [523.3, 659.3, 784, 1046.5].forEach((f, i) => tone(c, f, i * .085, i === 3 ? .42 : .16, 'sine', .1))); },
    fanfare(){ play(c => { [523.3, 659.3, 784].forEach((f, i) => tone(c, f, i * .09, .15, 'triangle', .09)); tone(c, 1046.5, .3, .55, 'triangle', .1); tone(c, 1318.5, .3, .55, 'sine', .05); }); },
    soft(){ play(c => { tone(c, 587.3, 0, .18, 'sine', .08); tone(c, 523.3, .14, .32, 'sine', .08); }); },
    run(){ play(c => tone(c, 660, 0, .09, 'square', .03, 990)); },
  };
})();
/* ============ 앱으로 설치(PWA, 웹 배포판에서만) ============ */
let installEvt = null;
const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; if (!S && document.querySelector('.home')) renderHome({ keep:true }); });
addEventListener('appinstalled', () => { installEvt = null; if (!S && document.querySelector('.home')) renderHome({ keep:true }); });
function installRow(){
  if (!window.HANIP_WEB || standalone() || !(installEvt || isIOS)) return null;
  return [h('div', { class:'side-label' }, '앱으로 설치'),
    installEvt ? h('button', { class:'ghost btn', onclick:async () => { const ev = installEvt; ev.prompt(); try { await ev.userChoice; } catch {} installEvt = null; renderHome({ keep:true }); } }, '홈 화면에 설치하기')
      : h('p', { class:'hint' }, '사파리 아래쪽 공유 버튼 → ', h('b', null, '홈 화면에 추가'), '를 누르면 앱처럼 쓸 수 있어요.')];
}
/* 버튼을 누르면 짧은 딸깍(다른 소리가 같이 나면 그쪽만) */
document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('button'); if (b && !b.disabled && !b.matches('.opt, .chip')) SFX.tap(); }, true);

function highlight(src, lang){
  let s = esc(src);
  if (lang === 'py'){
    s = s.replace(/("[^"\n]*"?|'[^'\n]*'?)|(#.*$)|\b(print|input|len|int|str|float|range|if|elif|else|for|while|in|not|and|or|is|def|return|import|from|as|True|False|None|break|continue|pass|try|except|finally|lambda|global|class|with|async|await|yield|self|dict|list|open|isinstance|enumerate|zip|sorted|sum|max|min|abs|round)\b|\b(\d+(?:\.\d+)?)\b/gm,
      (m, str, com, kw, num) => str ? `<span class="s">${str}</span>` : com ? `<span class="c">${com}</span>` : kw ? `<span class="k">${kw}</span>` : `<span class="n">${num}</span>`);
  } else if (lang === 'html'){
    s = s.replace(/(&lt;!--[\s\S]*?--&gt;)|(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*|!DOCTYPE)([^&]*?)(\/?&gt;)/g, (m, com, open, name, attrs, close) => com ? `<span class="c">${com}</span>` :
      `${open}<span class="t">${name}</span>${attrs.replace(/([a-zA-Z-]+)(=)("[^"]*"?)/g, '<span class="k">$1</span>$2<span class="s">$3</span>')}${close}`);
  } else if (lang === 'js'){
    s = s.replace(/(\/\/.*$)|(`[^`]*`?|"[^"\n]*"?|'[^'\n]*'?)|\b(let|const|var|function|return|if|else|for|while|of|in|new|true|false|null|undefined|class|break|continue|switch|case|default|typeof|try|catch|async|await)\b|\b(\d+(?:\.\d+)?)\b|\b(console|document|alert|prompt|confirm|Math|JSON|localStorage)\b/gm,
      (m, com, str, kw, num, obj) => com ? `<span class="c">${com}</span>` : str ? `<span class="s">${str}</span>` : kw ? `<span class="k">${kw}</span>` : num ? `<span class="n">${num}</span>` : `<span class="t">${obj}</span>`);
  } else if (lang === 'sh'){
    s = s.replace(/^(\$ )?([\w.-]+)(.*)$/, (m, pr, cmd, rest) => pr || /^(git|cd|ls|dir|mkdir|pwd|python3?|pip3?|npm|npx|node|code|cp|mv|rm|cat|echo|touch|open|start|clear)$/.test(cmd)
      ? `${pr ? '<span class="c">$ </span>' : ''}<span class="k">${cmd}</span>${rest.replace(/("[^"]*"?|'[^']*'?)|(\s#.*$)|((?:^|(?<=\s))-{1,2}[\w-]+)/g, (mm, q, com, fl) => q ? `<span class="s">${q}</span>` : com ? `<span class="c">${com}</span>` : `<span class="n">${fl}</span>`)}`
      : m.replace(/^(#.*)$/, '<span class="c">$1</span>'));
  } else if (lang === 'json'){
    s = s.replace(/("(?:[^"\\\n]|\\.)*")(\s*:)?|\b(true|false|null)\b|(-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b)/g,
      (m, str, colon, kw, num) => str ? (colon ? `<span class="t">${str}</span>${colon}` : `<span class="s">${str}</span>`) : kw ? `<span class="k">${kw}</span>` : `<span class="n">${num}</span>`);
  } else if (lang === 'diff'){
    s = /^\+(?!\+\+)/.test(s) ? `<span class="dadd">${s}</span>` : /^-(?!--)/.test(s) ? `<span class="ddel">${s}</span>` : /^(@@|diff |index |\+\+\+|---)/.test(s) ? `<span class="c">${s}</span>` : s;
  } else if (lang === 'css'){
    s = s.replace(/(\/\*[\s\S]*?\*\/)|("[^"\n]*"|'[^'\n]*')|([a-z-]+)(\s*:)(?=[^;{}]*;|[^;{}]*$)|(#[0-9a-fA-F]{3,8}\b|-?\d*\.?\d+(?:px|rem|em|%|vh|vw|s|fr|deg)?\b)|(^[^{}:\n]+(?=\{)|[.#]?[a-zA-Z][\w-]*(?=\s*\{))/gm,
      (m, com, str, prop, colon, num, sel) => com ? `<span class="c">${com}</span>` : str ? `<span class="s">${str}</span>` : prop ? `<span class="k">${prop}</span>${colon}` : num ? `<span class="n">${num}</span>` : `<span class="t">${sel}</span>`);
  } else if (lang === 'md'){
    s = s.replace(/^(\s*(?:#{1,6}|&gt;(?:\s*&gt;)*|[-*+](?: \[[ xX]\])?|\d+[.)])(?=\s|$))|(^\s*(?:-{3,}|\*{3,}|```.*)\s*$)|(\*\*\*[^*\n]+\*\*\*|\*\*[^*\n]+\*\*|__[^_\n]+__)|(`[^`\n]+`)|(!?\[[^\]\n]*\]\([^)\n]*\))|(~~[^~\n]+~~)|(\\.)|(\|)/gm,
      (m, mark, rule, bold, code, link, del, escp, pipe) =>
        mark ? `<span class="k">${mark}</span>` : rule ? `<span class="c">${rule}</span>` : bold ? `<span class="s">${bold}</span>` :
        code ? `<span class="n">${code}</span>` : link ? `<span class="t">${link}</span>` : del ? `<span class="c">${del}</span>` :
        escp ? `<span class="n">${escp}</span>` : `<span class="c">${pipe}</span>`);
  }
  return s;
}
function codeBlock(src, lang, opt = {}){
  const box = h('div', { class: 'code' + (opt.pick ? ' pick' : ''), role: opt.pick ? 'listbox' : null });
  src.split('\n').forEach((line, i) => {
    const marked = line.replace(/\[\[(\d)\]\]/g, '\u0001B$1\u0002');
    let html = lang === 'err' ? esc(marked) : highlight(marked, lang);
    html = html.replace(/\u0001B(\d)\u0002/g, (m, n) => `<span class="blank" data-b="${n}">${MARKS[n - 1]}</span>`);
    const row = h('div', { class: 'ln', 'data-i': i, role: opt.pick ? 'option' : null, tabindex: opt.pick ? 0 : null },
      h('span', { class: 'nm' }, String(i + 1)), h('span', { class: 'tx', html }));
    if (opt.pick){
      row.addEventListener('click', () => opt.pick(i, row));
      row.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); e.stopPropagation(); opt.pick(i, row); } });
    }
    box.append(row);
  });
  if (lang === 'err') box.style.color = 'var(--bad)';
  return box;
}
function outBlock(text, err){
  return h('div', { class: 'out' + (err ? ' err' : '') }, h('div', { class: 'lbl' }, '실행 결과'), h('pre', null, text));
}
function tableBlock(t){
  return h('div', { class: 'tbl' }, h('table', null,
    h('thead', null, h('tr', null, t.head.map(c => h('th', { html: c })))),
    h('tbody', null, t.rows.map(r => h('tr', null, r.map(c => h('td', { html: c })))))));
}

/* ============ 마크다운 미리보기(연습장용 작은 변환기) ============ */
function mdInline(s){
  const keep = [];
  const hold = html => `\u0000${keep.push(html) - 1}\u0000`;
  s = s.replace(/\\([\\`*_{}\[\]()#+\-.!~>|])/g, (m, c) => hold(esc(c)));
  s = s.replace(/`([^`]+)`/g, (m, c) => hold(`<code>${esc(c)}</code>`));
  s = esc(s);
  s = s.replace(/&lt;br\s*\/?&gt;/gi, '<br>');
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]*)[^)]*\)/g, (m, alt) => hold(`<span class="md-img">그림: ${alt || '(대체 글 없음)'}</span>`));
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)[^)]*\)/g, (m, t, u) => hold(`<a href="${u.replace(/"/g, '%22')}" target="_blank" rel="noopener">${t}</a>`));
  s = s.replace(/\*\*\*(?=\S)(.+?)(?<=\S)\*\*\*/g, '<strong><em>$1</em></strong>');
  s = s.replace(/\*\*(?=\S)(.+?)(?<=\S)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^\w\uac00-\ud7af])__(?=\S)((?:(?!__).)+?)(?<=\S)__(?![\w\uac00-\ud7af])/g, '$1<strong>$2</strong>');
  s = s.replace(/(^|[^*\w])\*(?=\S)(.+?)(?<=\S)\*(?!\*)/g, '$1<em>$2</em>');
  s = s.replace(/(^|[^_\w\uac00-\ud7af])_(?=\S)(.+?)(?<=\S)_(?![\w\uac00-\ud7af])/g, '$1<em>$2</em>');
  s = s.replace(/~~(?=\S)(.+?)(?<=\S)~~/g, '<del>$1</del>');
  return s.replace(/\u0000(\d+)\u0000/g, (m, i) => keep[+i]);
}
function mdRender(src){
  const L = src.replace(/\t/g, '    ').split('\n');
  let out = '', i = 0, para = [];
  const flush = () => { if (!para.length) return;
    out += '<p>' + para.map((l, k) => mdInline(l.replace(/\s+$/, '')) + (k < para.length - 1 ? (/ {2,}$/.test(l) ? '<br>' : '\n') : '')).join('') + '</p>'; para = []; };
  const listRe = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
  const tableSep = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;
  while (i < L.length){
    const line = L[i];
    if (/^\s*```/.test(line)){
      flush(); const lang = line.trim().slice(3).trim(); const buf = []; i++;
      while (i < L.length && !/^\s*```\s*$/.test(L[i])) buf.push(L[i++]);
      i++; out += `<pre${lang ? ` data-lang="${esc(lang)}"` : ''}><code>${esc(buf.join('\n'))}</code></pre>`; continue;
    }
    if (!line.trim()){ flush(); i++; continue; }
    const hm = line.match(/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (hm){ flush(); out += `<h${hm[1].length}>${mdInline(hm[2])}</h${hm[1].length}>`; i++; continue; }
    if (para.length && /^\s{0,3}(=+|-+)\s*$/.test(line)){ const lv = line.trim()[0] === '=' ? 1 : 2; out += `<h${lv}>${mdInline(para.join(' '))}</h${lv}>`; para = []; i++; continue; }
    if (/^\s{0,3}([-*_])(\s*\1){2,}\s*$/.test(line)){ flush(); out += '<hr>'; i++; continue; }
    if (/^\s{0,3}>/.test(line)){ flush(); const buf = []; while (i < L.length && (/^\s{0,3}>/.test(L[i]) || (L[i].trim() && buf.length && buf[buf.length - 1].trim() && !/^\s{0,3}(#{1,6}\s|```|([-*_])(\s*\2){2,}\s*$)/.test(L[i]) && !listRe.test(L[i])))) buf.push(/^\s{0,3}>/.test(L[i]) ? L[i++].replace(/^\s{0,3}>\s?/, '') : L[i++]); out += `<blockquote>${mdRender(buf.join('\n'))}</blockquote>`; continue; }
    if (line.includes('|') && i + 1 < L.length && tableSep.test(L[i + 1]) && L[i + 1].includes('-')){
      flush();
      const cells = r => r.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
      const head = cells(line), al = cells(L[i + 1]).map(c => c.startsWith(':') && c.endsWith(':') ? 'center' : c.endsWith(':') ? 'right' : c.startsWith(':') ? 'left' : '');
      i += 2; const rows = [];
      while (i < L.length && L[i].includes('|') && L[i].trim()) rows.push(cells(L[i++]));
      const td = (tag, c, k) => `<${tag}${al[k] ? ` style="text-align:${al[k]}"` : ''}>${mdInline(c)}</${tag}>`;
      out += `<table><thead><tr>${head.map((c, k) => td('th', c, k)).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${head.map((_, k) => td('td', r[k] ?? '', k)).join('')}</tr>`).join('')}</tbody></table>`;
      continue;
    }
    if (listRe.test(line) && (!para.length || true)){
      flush();
      const items = [];
      const blockStart = l => /^\s{0,3}(#{1,6}\s|```|>|([-*_])(\s*\2){2,}\s*$)/.test(l) || (l.includes('|') && false);
      while (i < L.length && (listRe.test(L[i]) || (L[i].trim() && items.length && (/^\s{2,}/.test(L[i]) || !blockStart(L[i]))))){
        const m = L[i].match(listRe);
        if (m) items.push({ ind:m[1].length, ord:/\d/.test(m[2]), start:parseInt(m[2], 10), text:m[3] });
        else items[items.length - 1].text += ' ' + L[i].trim();
        i++;
      }
      out += renderList(items);
      continue;
    }
    para.push(line); i++;
  }
  flush();
  return out;
}
function renderList(items){
  let html = '', k = 0;
  function level(ind){
    const first = items[k]; const tag = first.ord ? 'ol' : 'ul';
    let s = `<${tag}${first.ord && first.start !== 1 ? ` start="${first.start}"` : ''}>`;
    while (k < items.length && items[k].ind >= ind){
      if (items[k].ind > ind + 1 && items[k].ind >= ind + 2){ s = s.replace(/<\/li>$/, '') + level(items[k].ind) + '</li>'; continue; }
      const it = items[k++]; let t = it.text, cb = '';
      const c = t.match(/^\[( |x|X)\]\s+(.*)$/);
      if (c){ cb = `<input type="checkbox" disabled${c[1] !== ' ' ? ' checked' : ''}> `; t = c[2]; }
      s += `<li${cb ? ' class="task"' : ''}>${cb}${mdInline(t)}</li>`;
    }
    return s + `</${tag}>`;
  }
  while (k < items.length) html += level(items[k].ind);
  return html;
}
const MD_CSS = `:host{display:block;padding:12px 14px;font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR",sans-serif;color:#1D1D1F;background:#fff;border-radius:8px;line-height:1.6;font-size:17px}
h1,h2,h3,h4,h5,h6{margin:.5em 0 .3em;line-height:1.3}h1{font-size:28px;border-bottom:1px solid #e5e5ea;padding-bottom:.2em}h2{font-size:23px;border-bottom:1px solid #eee;padding-bottom:.15em}h3{font-size:20px}h4{font-size:18px}h5{font-size:16px}h6{font-size:15px;color:#6e6e73}
p{margin:.5em 0}ul,ol{margin:.4em 0;padding-left:1.5em}li.task{list-style:none;margin-left:-1.3em}li.task input{margin-right:.3em;transform:scale(1.15)}
code{font-family:"Nanum Gothic Coding",Menlo,monospace;background:#f2f2f0;border-radius:5px;padding:.05em .35em;font-size:.92em}
pre{background:#f4f4f1;border-radius:8px;padding:10px 12px;overflow:auto;font-size:15px}pre code{background:none;padding:0}
blockquote{margin:.5em 0;padding:.1em .9em;border-left:4px solid #9fd3bf;color:#48484a;background:#f3faf6;border-radius:0 8px 8px 0}
hr{border:0;border-top:2px solid #e5e5ea;margin:1em 0}a{color:#1f6fd1}
table{border-collapse:collapse;margin:.5em 0;display:block;max-width:100%;overflow-x:auto}th,td{border:1px solid #d9d9de;padding:6px 10px}th{background:#f2f7f4}
.md-img{display:inline-block;padding:14px 16px;border:2px dashed #b9c2cc;border-radius:10px;color:#6e6e73;font-size:14px;background:#fafafa}`;


/* 연습장 HTML 미리보기: 그림자 DOM에는 html·body가 없어서, body는 상자로 바꾸고 스타일의 html·body·:root 선택자를 맞춰 준다 */
function previewHtml(src){
  let s = src.replace(/<!DOCTYPE[^>]*>/gi, '').replace(/<\/?html[^>]*>/gi, '').replace(/<\/?head[^>]*>/gi, '').replace(/<title>[\s\S]*?<\/title>/gi, '').replace(/<meta[^>]*>/gi, '');
  s = s.replace(/<style([^>]*)>([\s\S]*?)<\/style>/gi, (m, at, css) => `<style${at}>${css.replace(/(^|[\s,{}>+~])(:root|html)(?=[\s,{.:#\[>+~])/g, '$1:host').replace(/(^|[\s,{}>+~]|:host\s)body(?=[\s,{.:#\[>+~])/g, '$1.hanip-body')}</style>`);
  if (/<body[\s>]/i.test(s)) s = s.replace(/<body([^>]*)>/i, (m, at) => `<div class="hanip-body"${at.replace(/\bclass="([^"]*)"/, (mm, c) => '')}>`).replace(/<\/body>/i, '</div>');
  else s = `<div class="hanip-body">${s}</div>`;
  return s;
}

/*CORE*/

/* ============ 과정·단원 ============ */
const app = document.getElementById('app');
let S = null;
const UNITS = HANIP.units;
const COURSES = [...new Set(UNITS.map(u => u.course))];
const courseNo = c => (c.match(/과정 (\d+)/) || [])[1] || '';
const courseName = c => c.split(' · ')[1] || c;
const unitNo = u => (u.title.match(/단원 (\d+)/) || [])[1] || '';
const wb = s => typeof s === 'string' ? s.replace(/([^\s])·(?=[^\s])/g, '$1·\u200B') : s;   // 가운뎃점 뒤에서 줄이 바뀌게
const unitName = u => wb(u.title.replace(/^단원 \d+ · /, ''));
const doneCount = u => u.items.filter(it => store.done[pkey(u, it)]).length;
function statusOf(u, it){
  const r = store.done[pkey(u, it)];
  if (!r){ const m = it.type === 'mission' && store.mission && store.mission[pkey(u, it)], n = m ? m.t.filter(Boolean).length : 0;
    return { done:false, meta:n ? `${n}개 함` : `${it.min}분` }; }
  if (r.skip) return { done:true, meta:'건너뜀' };
  if (it.type === 'lesson' || it.type === 'mission') return { done:true, meta:'완료' };
  const pass = it.type === 'test' ? r.best / r.total >= it.pass : false;
  return { done:true, meta:`${r.best}/${r.total}`, pass };
}
function nextUp(){
  for (const u of UNITS) for (const it of u.items) if (!store.done[pkey(u, it)]) return [u, it];
  return null;
}

/* ============ 기록: 오늘·연속 학습일, 오답 노트, 이어서 하기 ============ */
store.wrong = store.wrong || {};   // '단원:문항:단계' → 처음 틀린 때
store.days = store.days || {};     // 'YYYY-MM-DD' → 그날 끝낸 한입 수
store.pos = store.pos || {};       // '단원:레슨' → { i:멈춘 단계, n:전체 단계 }
const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const dayShift = (n, d = new Date()) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const today = () => store.days[dayKey()] || 0;
function streak(){
  let n = 0, d = new Date();
  if (!store.days[dayKey(d)]) d = dayShift(-1, d);
  while (store.days[dayKey(d)]){ n++; d = dayShift(-1, d); }
  return n;
}
function bestStreak(){
  let best = 0, run = 0, prev = null;
  for (const k of Object.keys(store.days).sort()){ const d = new Date(k + 'T00:00:00');
    run = prev && Math.round((d - prev) / 864e5) === 1 ? run + 1 : 1; best = Math.max(best, run); prev = d; }
  return best;
}
function markToday(){
  const k = dayKey(); store.days[k] = (store.days[k] || 0) + 1;
  const ks = Object.keys(store.days).sort(); while (ks.length > 800) delete store.days[ks.shift()];
}
const wkey = st => `${st._u.id}:${st._it.id}:${st._k}`;
const lookup = k => { const [uid, iid] = String(k).split(':'); const u = UNITS.find(x => x.id === uid); const it = u && u.items.find(x => x.id === iid); return it ? [u, it] : null; };
const hm = m => m >= 60 ? `${Math.floor(m / 60)}시간${m % 60 ? ` ${m % 60}분` : ''}` : `${m}분`;
function toast(t){
  const el = h('div', { class:'toast', role:'status' }, t); document.body.append(el);
  setTimeout(() => el.classList.add('out'), 2600); setTimeout(() => el.remove(), 3000);
}
function icon(name){
  const P = { sound:'M4 9.5h3.5L12 5v14l-4.5-4.5H4z M15.5 9.2a4 4 0 0 1 0 5.6 M18.2 6.6a7.6 7.6 0 0 1 0 10.8',
    mute:'M4 9.5h3.5L12 5v14l-4.5-4.5H4z M16 9.5l5 5 M21 9.5l-5 5' };
  const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('class', 'ic');
  const p = document.createElementNS(NS, 'path'); p.setAttribute('d', P[name]); s.append(p); return s;
}

/* ============ 단원 파일은 필요할 때 불러온다(홈은 요약만으로 그림) ============ */
const needsLoad = u => !u.items.every(it => it.steps || it.tasks);
function loadUnit(u){
  if (!needsLoad(u)) return Promise.resolve(u);
  return u._loading || (u._loading = new Promise((ok, no) => {
    (HANIP._wait[u.id] = HANIP._wait[u.id] || []).push(() => ok(u));
    const s = document.createElement('script'); s.src = `units/${u.id}.js${window.HANIP_VER ? '?v=' + HANIP_VER : ''}`;
    s.onerror = () => { u._loading = null; s.remove(); no(new Error('load ' + u.id)); };
    document.head.append(s);
  }));
}
function showLoading(){ app.replaceChildren(h('div', { class:'wrap loading' }, fig('cookie'), h('p', null, '한입 준비 중…'))); }

/* ============ 홈 ============ */
let homeScroll = null;
const homeSnap = el => el ? { y:scrollY, c:el.querySelector('.courses')?.scrollLeft || 0, u:el.querySelector('.units')?.scrollLeft || 0 } : null;
function center(bar){
  const on = bar && bar.querySelector('.on');
  if (on && bar.scrollWidth > bar.clientWidth) bar.scrollLeft = Math.max(0, on.getBoundingClientRect().left - bar.getBoundingClientRect().left - (bar.clientWidth - on.offsetWidth) / 2);
}
function brandLine(){
  const t = today(), s = streak();
  if (t) return h('span', { class:'streak' }, `오늘 ${t}입 먹었어요`, s > 1 ? ` · 연속 ${s}일째 🔥` : '');
  if (s) return h('span', { class:'streak' }, `연속 ${s}일째! 오늘도 한입 할까요?`);
  return 'Solar·문서 AI를 한입씩, 내 수업 도구로';
}
/* 휴대폰 오른쪽 위: 소리 켜고 끄기, 글자 크기 고르기 */
function quickControls(){
  const on = store.sound !== false;
  const snd = h('button', { class:'qbtn btn', 'aria-pressed':String(on), 'aria-label':on ? '소리 끄기' : '소리 켜기', title:on ? '소리 끄기' : '소리 켜기',
    onclick:() => { store.sound = !on; save(); renderHome({ keep:true }); if (store.sound) SFX.pick(); toast(store.sound ? '소리를 켰어요' : '소리를 껐어요'); } }, icon(on ? 'sound' : 'mute'));
  const z0 = store.zoom || 1;
  const menu = h('div', { class:'qmenu', role:'menu', 'aria-label':'글자 크기', hidden:true },
    ZOOMS.map(([t, z]) => h('button', { class:'btn', role:'menuitemradio', 'aria-checked':String(z0 === z),
      onclick:() => { store.zoom = z; save(); applyZoom(); renderHome({ keep:true }); } },
      h('span', { class:'ck', 'aria-hidden':'true' }, z0 === z ? '✓' : ''), h('span', { style:`font-size:${Math.round(16 * z)}px` }, t))));
  const fontBtn = h('button', { class:'qbtn wide btn', 'aria-haspopup':'menu', 'aria-expanded':'false', 'aria-label':'글자 크기', title:'글자 크기' },
    h('span', { class:'ga', 'aria-hidden':'true' }, '가'), h('span', { class:'caret', 'aria-hidden':'true' }, '▾'));
  const outside = e => { if (!menu.contains(e.target) && e.target !== fontBtn && !fontBtn.contains(e.target)) setOpen(false); };
  const setOpen = open => {
    menu.hidden = !open; fontBtn.setAttribute('aria-expanded', String(open));
    if (open){ menu.classList.remove('pop'); void menu.offsetWidth; menu.classList.add('pop'); document.addEventListener('pointerdown', outside, true); menu.querySelector('[aria-checked="true"]')?.focus(); }
    else document.removeEventListener('pointerdown', outside, true);
  };
  fontBtn.addEventListener('click', () => setOpen(menu.hidden));
  menu.addEventListener('keydown', e => { if (e.key === 'Escape'){ setOpen(false); fontBtn.focus(); } });
  const osBtn = h('button', { class:'qbtn wide btn', 'aria-label':`단축키 표시: ${OS() === 'mac' ? 'Mac' : 'Windows'}. 눌러서 바꾸기`, title:'단축키 표시 바꾸기',
    onclick:() => { store.os = OS() === 'mac' ? 'win' : 'mac'; save(); renderHome({ keep:true }); toast(store.os === 'mac' ? '단축키를 Mac(⌘) 기준으로 보여 줘요' : '단축키를 Windows(Ctrl) 기준으로 보여 줘요'); } },
    h('span', { class:'ga os' }, OS() === 'mac' ? '⌘' : 'Ctrl'));
  return h('div', { class:'quick' }, osBtn, snd, h('div', { class:'qwrap' }, fontBtn, menu));
}
let firstHome = true;
/* 레슨 목록(PC 오른쪽과 휴대폰 트리가 함께 씀) */
function itemList(u, tU, tIt){
  let lessonNo = 0;
  return h('ol', { class:'list' }, u.items.map(it => {
    const st = statusOf(u, it), k = pkey(u, it), pos = !st.done && store.pos[k];
    const now = tU === u && tIt === it;
    if (it.type === 'lesson') lessonNo++;
    const label = it.type === 'lesson' ? String(lessonNo) : it.type === 'test' ? '평' : it.type === 'mission' ? '★' : '?';
    return h('li', null, h('button', { class:`item btn ${it.type}${st.done ? ' done' : ''}${now ? ' now' : ''}${pos ? ' inprog' : ''}`, 'aria-current':now ? 'step' : null, 'data-key':'i:' + k,
        onclick:() => start(u, it, null, pos ? pos.i : 0) },
      h('span', { class:'no' }, st.done && (it.type === 'lesson' || it.type === 'mission') ? '✓' : label),
      h('span', { class:'itx' }, now ? h('span', { class:'nowtag' }, pos ? '▶ 하던 중' : '▶ 지금 할 차례') : null, h('b', null, wb(it.title)), h('small', null, wb(it.sub))),
      h('span', { class:'meta' + (st.pass ? ' pass' : '') + (pos ? ' go' : '') }, pos ? `${pos.i + 1}/${pos.n}` : st.meta),
      pos ? h('span', { class:'ibar', 'aria-hidden':'true' }, h('i', { style:`width:${(pos.i + 1) / pos.n * 100}%` })) : null));
  }));
}
function folderIcon(open){
  const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('class', 'folder');
  const add = (d, cls) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('class', cls); s.append(p); };
  if (open){ add('M3 6.5A1.5 1.5 0 0 1 4.5 5h4.2l2 2h7.8A1.5 1.5 0 0 1 20 8.5V10H6.3a1.7 1.7 0 0 0-1.6 1.2L3 16.5z', 'back');
    add('M4.7 11.2A1.7 1.7 0 0 1 6.3 10h15a.9.9 0 0 1 .86 1.2l-2.2 6.5A1.9 1.9 0 0 1 18.2 19H4.2a1.1 1.1 0 0 1-1.05-1.45z', 'front'); }
  else add('M3 6.5A1.5 1.5 0 0 1 4.5 5h4.2l2 2h8.8A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z', 'front');
  return s;
}
/* 휴대폰 첫 화면: 과정 → 단원 → 레슨 폴더 트리(한 번에 과정 하나, 단원 하나만 펼침) */
function treeView(target, anim){
  const [tU, tIt] = target || [];
  const open = store.open || {};
  return h('ul', { class:'tree', 'aria-label':'과정·단원·레슨' }, COURSES.map(c => {
    const us = UNITS.filter(u => u.course === c);
    const n = us.reduce((a, u) => a + u.items.length, 0), d = us.reduce((a, u) => a + doneCount(u), 0);
    const isOpen = open.c === c, state = d === n ? 'done' : tU && tU.course === c ? 'now' : '';
    const key = 'c:' + courseNo(c);
    const row = h('button', { class:`tnode course btn${isOpen ? ' open' : ''}${state ? ' ' + state : ''}`, 'aria-expanded':String(isOpen), 'data-key':key,
        onclick:e => toggleNode('c', c, e.currentTarget) },
      folderIcon(isOpen),
      h('span', { class:'tlabel' }, h('small', null, `과정 ${courseNo(c)}`), h('b', null, courseName(c))),
      h('span', { class:'tmeta' }, state === 'done' ? '다 먹음 ✓' : state === 'now' ? `공부 중 ${d}/${n}` : `${d}/${n}`),
      h('span', { class:'chev', 'aria-hidden':'true' }));
    if (!isOpen) return h('li', { class:'tc' }, row);
    return h('li', { class:'tc open' }, row, h('ul', { class:'tkids' + (anim === key ? ' fresh' : '') }, us.map(u => {
      const uOpen = open.u === u.id, ud = doneCount(u), un = u.items.length;
      const ust = ud === un ? 'done' : tU === u ? 'now' : '';
      const ukey = 'u:' + u.id;
      const urow = h('button', { class:`tnode unit btn${uOpen ? ' open' : ''}${ust ? ' ' + ust : ''}`, 'aria-expanded':String(uOpen), 'data-key':ukey,
          onclick:e => toggleNode('u', u.id, e.currentTarget) },
        folderIcon(uOpen),
        h('span', { class:'tlabel' }, h('small', null, `단원 ${unitNo(u)} · 약 ${hm(u.items.reduce((a, it) => a + it.min, 0))}`), h('b', null, unitName(u), ust === 'now' ? h('em', { class:'tag-now' }, '진행 중') : null)),
        h('span', { class:'tmeta' }, ust === 'done' ? '✓' : `${ud}/${un}`),
        h('span', { class:'chev', 'aria-hidden':'true' }),
        h('span', { class:'tbar', 'aria-hidden':'true' }, h('i', { style:`width:${ud / un * 100}%` })));
      return h('li', { class:'tu' + (uOpen ? ' open' : '') }, urow, uOpen ? h('div', { class:'tkids tlessons' + (anim === ukey ? ' fresh' : '') },
        h('ul', { class:'goals tgoals' }, u.goals.map(g => h('li', null, rich(wb(g))))), skipRow(u), itemList(u, tU, tIt)) : null);
    })));
  }));
}
/* 누른 줄이 화면에서 그 자리에 있게 펼치고 접는다 */
function toggleNode(kind, id, row){
  const anchor = { key:row.dataset.key, top:row.getBoundingClientRect().top };
  const o = store.open = store.open || {};
  let anim = null;
  if (kind === 'c'){ if (o.c === id){ o.c = null; o.u = null; } else { o.c = id; o.u = null; anim = anchor.key; store.course = id; store.unit = UNITS.find(u => u.course === id).id; } }
  else if (o.u === id) o.u = null;
  else { o.u = id; anim = anchor.key; store.unit = id; store.course = o.c; }
  save();
  renderHome({ keep:true, anchor, anim });
}
/* 이미 아는 단원은 3문제로 점검하고 건너뛰기(과정 1) */
function skipRow(u){
  const c = u.checked ? h('small', { class:'checked' + (stale(u.checked.date) ? ' old' : '') }, `공식 문서 ${u.checked.date} 확인${stale(u.checked.date) ? ' · 확인 필요' : ''}`) : null;
  if (!skippable(u)) return c;
  return h('div', { class:'skiprow' }, h('div', null, h('b', null, '이미 아는 내용인가요?'), h('small', null, '3문제를 다 맞히면 레슨을 건너뛰고 미션·평가만 해요.')),
    h('button', { class:'ghost btn', onclick:() => startSkip(u) }, '3문제 점검'), c);
}
function openInfo(){
  SFX.tap();
  const lessons = UNITS.reduce((a, u) => a + u.items.filter(i => i.type === 'lesson').length, 0);
  const dlg = h('dialog', { class:'sheet info', 'aria-label':'업스테이지한입 정보' },
    h('div', { class:'sheet-head' },
      h('div', { class:'info-title' }, fig('cookie'), h('div', null, h('h3', null, APP_INFO.name), h('span', { class:'pill' }, `v${APP_INFO.version}`))),
      h('button', { class:'qbtn btn', 'aria-label':'닫기', onclick:() => dlg.close() }, '✕')),
    h('dl', { class:'info-rows' },
      h('dt', null, '버전'), h('dd', null, `${APP_INFO.version}${window.HANIP_VER ? ` (빌드 ${HANIP_VER.slice(0, 7)})` : ''}`),
      h('dt', null, '만든 사람'), h('dd', null, APP_INFO.author),
      h('dt', null, '연락처'), h('dd', null, h('a', { href:`mailto:${APP_INFO.contact}` }, APP_INFO.contact)),
      h('dt', null, '내용'), h('dd', null, `과정 ${COURSES.length}개 · 단원 ${UNITS.length}개 · 레슨 ${lessons}개`)),
    h('div', { class:'side-label' }, '변경 이력'),
    h('ol', { class:'history' }, APP_INFO.history.slice(0, 3).map(r => h('li', null,
      h('div', { class:'hv' }, h('b', null, `v${r.v}`), h('small', null, r.date)),
      h('ul', null, r.items.map(t => h('li', null, t)))))),
    h('p', { class:'hint' }, `레슨 내용은 업스테이지 공식 문서를 ${APP_INFO.checked}에 확인해 썼어요. 모델 이름·가격·화면은 바뀔 수 있어요. 새 버전은 인터넷에 연결된 채로 앱을 다시 열면 저절로 받아요.`),
    h('p', { class:'hint' }, APP_INFO.notice),
    h('p', { class:'credit' }, '글꼴: 나눔스퀘어라운드 · Gaegu · 나눔고딕코딩 (SIL 오픈 폰트 라이선스)'));
  dlg.addEventListener('close', () => dlg.remove());
  document.body.append(dlg); dlg.showModal();
}
function brandEl(){
  return h('header', { class:'brand' },
    h('div', { class:'logo', role:'button', tabindex:0, title:'앱 정보·변경 이력', 'aria-label':'업스테이지한입 정보와 변경 이력 보기', onclick:openInfo,
      onkeydown:e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openInfo(); } } },
      fig('cookie'), h('div', { class:'brand-t' }, h('h1', null, '업스테이지한입'), h('p', null, brandLine()))),
    quickControls());
}
function renderHome(opt = {}){
  closeBubble();
  const from = S && S.it && S.it.type !== 'review' && S.u ? [S.u, S.it] : null;
  if (S && S.pad) S.pad.stop();
  S = null;
  document.body.classList.remove('playing');
  if (!UNITS.length){ app.replaceChildren(h('p', { class:'wrap' }, '단원 파일을 불러오지 못했어요.')); return; }
  if (curTab() !== 'learn'){ firstHome = false; return renderTab(opt); }
  const initial = firstHome; firstHome = false;
  const old = document.querySelector('.home');
  let snap = opt.keep && old ? homeSnap(old) : opt.back ? homeScroll : null;
  const again = () => renderHome({ keep:true });
  const all = UNITS.reduce((a, u) => a + u.items.length, 0), allDone = UNITS.reduce((a, u) => a + doneCount(u), 0);
  /* 지금 할 곳: 하다 만 레슨이 있으면 그곳, 없으면 아직 안 한 첫 문항 */
  const lastK = store.last && store.pos[store.last] && !store.done[store.last] ? store.last : null;
  const target = (lastK && lookup(lastK)) || nextUp();
  const [tU, tIt] = target || [];
  /* 트리 펼침: 처음 열 때는 지금 할 레슨 자리, 레슨에서 돌아오면 방금 본 레슨 자리 */
  let focusKey = null;
  if (initial && target){ store.open = { c:tU.course, u:tU.id }; if (Object.keys(store.done).length || Object.keys(store.pos).length) focusKey = 'i:' + pkey(tU, tIt); }
  if (opt.back && from && (!store.open || store.open.u !== from[0].id)){ store.open = { c:from[0].course, u:from[0].id }; focusKey = 'i:' + pkey(from[0], from[1]); snap = null; }
  if (!store.open) store.open = { c:null, u:null };
  if (opt.focus){ focusKey = opt.focus; snap = null; }
  const curCourse = COURSES.includes(store.course) ? store.course : (UNITS.find(u => u.id === store.unit) || UNITS[0]).course;
  const cUnits = UNITS.filter(u => u.course === curCourse);
  const cur = cUnits.find(u => u.id === store.unit) || cUnits[0];
  const unitDone = u => doneCount(u) === u.items.length;

  const brand = brandEl();
  const courseBar = h('nav', { class:'courses', 'aria-label':'과정' }, COURSES.map(c => {
    const us = UNITS.filter(u => u.course === c), n = us.reduce((a, u) => a + u.items.length, 0), d = us.reduce((a, u) => a + doneCount(u), 0);
    const state = d === n ? 'done' : tU && tU.course === c ? 'now' : '';
    return h('button', { class:`cbtn btn${c === curCourse ? ' on' : ''}${state ? ' ' + state : ''}`, 'aria-current':c === curCourse ? 'true' : null,
      'aria-label':`과정 ${courseNo(c)} ${courseName(c)}${state === 'now' ? ', 지금 공부 중' : state === 'done' ? ', 다 끝냄' : ''}`,
      onclick:() => { store.course = c; store.unit = (state === 'now' ? tU : us[0]).id; save(); again(); } },
      h('small', null, `과정 ${courseNo(c)}`), h('b', null, courseName(c)), h('span', { class:'cp', 'aria-hidden':'true' }, h('i', { style:`width:${d / n * 100}%` })));
  }));
  const unitsEl = h('ul', { class:'units' }, cUnits.map(u => {
    const now = tU === u, done = unitDone(u);
    return h('li', null, h('button', { class:`utab btn${u === cur ? ' on' : ''}${now ? ' now' : ''}${done ? ' done' : ''}`, 'aria-current':u === cur ? 'true' : null,
      onclick:() => { store.unit = u.id; save(); again(); } },
      h('span', { class:'un' }, done ? '✓' : unitNo(u)), h('span', { class:'uname' }, unitName(u), now ? h('em', { class:'tag-now' }, '진행 중') : null),
      h('span', { class:'mini', 'aria-hidden':'true' }, h('i', { style:`width:${doneCount(u) / u.items.length * 100}%` }))));
  }));
  const coursePanel = h('section', { class:'panel course-panel' },
    h('h2', null, courseName(curCourse)),
    h('div', { class:'side-label' }, '단원'),
    unitsEl,
    h('div', { class:'meter', 'aria-hidden':'true' }, h('i', { style:`width:${allDone / all * 100}%` })),
    h('div', { class:'meter-label' }, h('span', null, '전체 진도'), h('span', null, `${allDone} / ${all}`)));
  /* 내 공부: 이번 주, 오늘·연속·최고, 오답 노트, 백업 */
  const nWrong = Object.keys(store.wrong).length;
  const week = [...Array(7)].map((_, i) => dayShift(i - 6));
  const mine = h('section', { class:'panel mine' },
    h('div', { class:'side-label' }, '내 공부'),
    h('div', { class:'week', 'aria-label':'최근 7일' }, week.map((d, i) => { const n = store.days[dayKey(d)] || 0;
      return h('span', { class:`day${n ? ' on' : ''}${i === 6 ? ' today' : ''}`, title:`${d.getMonth() + 1}월 ${d.getDate()}일 · ${n}입` },
        h('i', null, n ? String(n) : ''), h('small', null, i === 6 ? '오늘' : '일월화수목금토'[d.getDay()])); })),
    h('div', { class:'stats' },
      h('div', { class:'stat' }, h('b', null, `${today()}입`), h('small', null, '오늘')),
      h('div', { class:'stat' }, h('b', null, `${streak()}일`), h('small', null, '연속')),
      h('div', { class:'stat' }, h('b', null, `${bestStreak()}일`), h('small', null, '최고 기록'))),
    h('div', { class:'meter-label m-only' }, h('span', null, '전체 진도'), h('span', null, `${allDone} / ${all} (${Math.round(allDone / all * 100)}%)`)),
    h('div', { class:'wrongrow' + (nWrong ? ' has' : '') },
      h('div', null, h('b', null, '오답 노트'), h('small', null, nWrong ? `다시 볼 문제 ${nWrong}개` : '처음에 틀린 문제가 여기에 모여요')),
      h('button', { class:'ghost btn', disabled:!nWrong, onclick:startReview }, nWrong ? `복습 ${Math.min(nWrong, 10)}문제` : '복습')),
    h('button', { class:'linkbtn', onclick:openBackup }, '진도 백업·옮기기'));
  const settings = h('section', { class:'panel settings' },
    h('div', { class:'side-label' }, '글자 크기'),
    h('div', { class:'seg-ctl' }, ZOOMS.map(([t, z]) => h('button', { class:(store.zoom || 1) === z ? 'on' : '', onclick:() => { store.zoom = z; save(); applyZoom(); again(); } }, t))),
    h('div', { class:'side-label' }, '소리'),
    h('div', { class:'seg-ctl' }, [['켜기', true], ['끄기', false]].map(([t, v]) => h('button', { class:(store.sound !== false) === v ? 'on' : '', onclick:() => { store.sound = v; save(); again(); if (v) SFX.right(); } }, t))),
    h('div', { class:'side-label' }, '단축키 표시'),
    h('div', { class:'seg-ctl' }, [['Mac ⌘', 'mac'], ['Windows Ctrl', 'win']].map(([t, v]) => h('button', { class:OS() === v ? 'on' : '', onclick:() => { store.os = v; save(); again(); } }, t))));
  const inst = installRow();
  const side = h('div', { class:'side' }, tabBar(), coursePanel, mine, settings, inst ? h('section', { class:'panel install' }, inst) : null,
    h('p', { class:'keyhelp' }, '키보드: 보기 ', h('kbd', null, '1'), '~', h('kbd', null, '4'), ' · 확인·다음 ', h('kbd', null, 'Enter'), ' · 이전 ', h('kbd', null, '←'), ' · 목록 ', h('kbd', null, 'Esc')),
    h('p', { class:'foot' }, h('button', { class:'linkbtn', onclick:openInfo }, `업스테이지한입 v${APP_INFO.version}`), ` · 공식 문서 ${APP_INFO.checked} 확인 · 진도는 이 기기에만 저장돼요`));

  const cont = target ? (() => {
    const pos = lastK && store.pos[lastK];
    const go = () => { store.unit = tU.id; store.course = tU.course; save(); start(tU, tIt, null, pos ? pos.i : 0); };
    return h('button', { class:'continue btn', onclick:go },
      h('span', null, h('small', null, pos ? '이어서 하기' : allDone ? '다음 한입' : '여기서 시작해요'), h('b', null, tIt.title),
        h('span', { class:'how' }, `${tU.course.split(' · ')[0]} · 단원 ${unitNo(tU)} · ${pos ? `${pos.i + 1}/${pos.n} 단계부터` : `${tIt.min}분`}`)),
      h('span', { class:'go' }, pos ? '이어서' : '시작'));
  })() : h('div', { class:'continue finished' }, h('span', null, h('small', null, '모두 끝!'), h('b', null, `${UNITS.length}단원을 다 먹었어요. 오답 노트로 복습해 봐요`)));
  const unitMin = cur.items.reduce((a, it) => a + it.min, 0);
  const main = h('div', { class:'mainc' },
    !store.guideSeen ? h('section', { class:'guide' },
      h('h3', null, '처음 오셨나요? 이렇게 공부해요'),
      h('ol', null,
        h('li', null, '레슨에서 설명을 읽고, ', h('b', null, '모의 화면'), '에서 진짜처럼 키를 누르고 버튼을 눌러 봐요.'),
        h('li', null, '단원 끝의 ', h('b', null, '★ 진짜 실습 미션'), '은 업스테이지 콘솔과 내 컴퓨터의 Cursor로 진짜 API를 불러 보고 체크해요.'),
        h('li', null, h('b', null, '연수 지도'), ' 탭에서 기반연수 15차시마다 어느 단원이 대비되는지 봐요. 2일차는 ', h('b', null, '트랙 A(파이썬 자동채점 + AI튜터)'), ' 중심이에요.'),
        h('li', null, '단축키는 ', h('b', null, OS() === 'mac' ? '⌘(Mac)' : 'Ctrl(Windows)'), ' 기준으로 보여요. 설정에서 바꿀 수 있어요.'),
        h('li', null, '틀려도 괜찮아요. 틀린 문제는 레슨 끝에 한 번 더 나오고, 오답 노트에도 모여요.')),
      h('div', { class:'row' }, h('button', { class:'ghost btn', onclick:() => { store.guideSeen = true; save(); again(); } }, '알겠어요'))) : null,
    cont,
    h('section', { class:'panel unit-panel' },
      h('div', { class:'eyebrow' }, `${curCourse.split(' · ')[0]} · 단원 ${unitNo(cur)} · 약 ${hm(unitMin)} · ${doneCount(cur)}/${cur.items.length} 완료`),
      h('h2', null, unitName(cur)),
      h('ul', { class:'goals' }, cur.goals.map(g => h('li', null, rich(wb(g))))),
      skipRow(cur)),
    itemList(cur, tU, tIt));
  const tree = treeView(target, opt.anim);
  const home = h('div', { class:'wrap home' + (snap || opt.keep ? ' static' : '') }, brand, courseBar, side, main, tree);
  app.replaceChildren(home);
  if (snap){ courseBar.scrollLeft = snap.c; unitsEl.scrollLeft = snap.u; window.scrollTo(0, snap.y); }
  else { center(courseBar); center(unitsEl); window.scrollTo(0, 0); }
  if (isPC()) return;
  if (opt.anchor){ const el = tree.querySelector(`[data-key="${opt.anchor.key}"]`); if (el) window.scrollBy(0, el.getBoundingClientRect().top - opt.anchor.top); }
  if (focusKey){
    const toTarget = () => { const el = tree.querySelector(`[data-key="${focusKey}"]`); if (el) el.scrollIntoView({ block:'center' }); return scrollY; };
    const y = toTarget();
    if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(() => { if (!S && scrollY === y) toTarget(); });
  }
}

/* ============ 오답 노트 복습 ============ */
async function startReview(){
  const keys = Object.entries(store.wrong).sort((a, b) => a[1] - b[1]).map(([k]) => k).slice(0, 10);
  const want = [...new Set(keys.map(k => k.split(':')[0]))].map(id => UNITS.find(u => u.id === id)).filter(Boolean);
  const wait = setTimeout(showLoading, 150);
  try { await Promise.all(want.map(loadUnit)); }
  catch { clearTimeout(wait); toast('문제를 불러오지 못했어요. 인터넷 연결을 확인해 주세요.'); renderHome({ back:true }); return; }
  clearTimeout(wait);
  const steps = [];
  for (const k of keys){
    const [uid, iid, sk] = k.split(':'); const u = UNITS.find(x => x.id === uid); const it = u && u.items.find(x => x.id === iid); const st = it && it.steps[+sk];
    if (!st || st.t !== 'q'){ delete store.wrong[k]; continue; }
    steps.push({ ...st, _u:u, _it:it, _k:+sk });
  }
  save();
  if (!steps.length){ toast('복습할 문제가 없어요'); renderHome({ keep:true }); return; }
  const RI = { id:'review', type:'review', title:'오답 복습', sub:'', min:0, steps };
  start({ id:'review', course:'', title:'오답 노트', figs:{}, items:[RI] }, RI);
}

/* ============ 진도 백업·옮기기 ============ */
const exportData = () => ({ app:'upstage-hanip', v:1, at:new Date().toISOString(), done:store.done, wrong:store.wrong, days:store.days, pos:store.pos, mission:store.mission, prep:store.prep });
function downloadBackup(){
  const a = h('a', { href:URL.createObjectURL(new Blob([JSON.stringify(exportData(), null, 1)], { type:'application/json' })), download:`업스테이지한입-진도-${dayKey()}.json` });
  document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}
const toB64 = bytes => { let s = ''; for (let i = 0; i < bytes.length; i += 8192) s += String.fromCharCode(...bytes.subarray(i, i + 8192)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
const fromB64 = t => Uint8Array.from(atob(t.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
async function makeCode(){
  const bytes = new TextEncoder().encode(JSON.stringify(exportData()));
  if (window.CompressionStream) return 'HANIP1:' + toB64(new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer()));
  return 'HANIP0:' + toB64(bytes);
}
async function readCode(code){
  const m = /^HANIP([01]):([A-Za-z0-9_-]+)$/.exec(code.replace(/\s+/g, ''));
  if (!m) return JSON.parse(code);
  const bytes = fromB64(m[2]);
  return JSON.parse(m[1] === '1' ? await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text() : new TextDecoder().decode(bytes));
}
function mergeData(d){
  if (!d || d.app !== 'upstage-hanip' || typeof d.done !== 'object') throw new Error('not a backup');
  const ok = /^c\d+u\d+:[A-Z0-9]+$/, okW = /^c\d+u\d+:[A-Z0-9]+:\d+$/, okD = /^\d{4}-\d{2}-\d{2}$/;
  const r = { done:0, wrong:0, days:0 };
  for (const [k, v] of Object.entries(d.done || {})){ if (!ok.test(k) || !v || typeof v !== 'object') continue;
    const c = store.done[k];
    if (!c){ store.done[k] = v.best != null ? { best:+v.best || 0, total:+v.total || 0 } : { done:true }; r.done++; }
    else if (v.best != null){ c.best = Math.max(+c.best || 0, +v.best || 0); c.total = c.total || +v.total || 0; } }
  for (const [k, v] of Object.entries(d.wrong || {})) if (okW.test(k) && !store.wrong[k]){ store.wrong[k] = +v || Date.now(); r.wrong++; }
  for (const [k, v] of Object.entries(d.days || {})) if (okD.test(k)){ if (!store.days[k]) r.days++; store.days[k] = Math.max(store.days[k] || 0, +v || 0); }
  for (const [k, v] of Object.entries(d.pos || {})) if (ok.test(k) && !store.pos[k] && !store.done[k] && v && +v.n) store.pos[k] = { i:+v.i || 0, n:+v.n };
  for (const [k, v] of Object.entries(d.mission || {})) if (ok.test(k) && v && Array.isArray(v.t)){ const c = store.mission[k] = store.mission[k] || { t:[], memo:'' }; v.t.forEach((x, i) => { if (x) c.t[i] = true; }); if (!c.memo && typeof v.memo === 'string') c.memo = v.memo.slice(0, 500); }
  for (const [k, v] of Object.entries(d.prep || {})) if (/^[a-z0-9-]+$/.test(k) && v) store.prep[k] = true;
  return r;
}
function openBackup(){
  const all = UNITS.reduce((a, u) => a + u.items.length, 0);
  const msg = h('p', { class:'hint msg', 'aria-live':'polite' });
  const say = t => { msg.textContent = t; };
  const ta = h('textarea', { rows:3, placeholder:'복사해 온 진도 코드를 여기에 붙여 넣어요', 'aria-label':'진도 코드', spellcheck:'false' });
  const take = d => { const r = mergeData(d); save(); say(`불러왔어요! 새로 완료 ${r.done}개, 오답 ${r.wrong}개, 공부한 날 ${r.days}일을 더했어요.`); SFX.right(); };
  const file = h('input', { type:'file', accept:'.json,application/json', class:'sr', 'aria-label':'진도 파일 고르기',
    onchange:async () => { const f = file.files[0]; if (!f) return; try { take(JSON.parse(await f.text())); } catch { say('이 파일은 업스테이지한입 진도 파일이 아니에요.'); } file.value = ''; } });
  let armed = false;
  const dlg = h('dialog', { class:'sheet', 'aria-label':'진도 백업·옮기기' },
    h('div', { class:'sheet-head' }, h('h3', null, '진도 백업·옮기기'), h('button', { class:'qbtn btn', 'aria-label':'닫기', onclick:() => dlg.close() }, '✕')),
    h('p', { class:'hint' }, `이 기기의 진도: 완료 ${Object.keys(store.done).length}/${all} · 오답 ${Object.keys(store.wrong).length}개 · 공부한 날 ${Object.keys(store.days).length}일. 진도는 브라우저마다 따로 저장돼서, 휴대폰과 PC를 오갈 때 여기서 옮겨요.`),
    h('div', { class:'side-label' }, '내보내기'),
    h('div', { class:'row' },
      h('button', { class:'ghost btn', onclick:() => { downloadBackup(); say('파일로 저장했어요. 다른 기기에서 "파일 불러오기"로 열어요.'); } }, '파일로 저장'),
      h('button', { class:'ghost btn', onclick:async () => { const code = await makeCode();
        try { await navigator.clipboard.writeText(code); say(`진도 코드(${code.length}자)를 복사했어요. 메신저로 나에게 보낸 뒤 다른 기기에서 붙여 넣어요.`); }
        catch { ta.value = code; ta.select(); say('자동 복사가 안 돼서 아래 칸에 코드를 넣었어요. 길게 눌러 복사해요.'); } } }, '코드 복사')),
    h('div', { class:'side-label' }, '가져오기 (지금 진도와 합쳐요)'),
    h('div', { class:'row' }, h('button', { class:'ghost btn', onclick:() => file.click() }, '파일 불러오기'), file),
    ta,
    h('div', { class:'row' }, h('button', { class:'ghost btn', onclick:async () => { if (!ta.value.trim()) return say('먼저 코드를 붙여 넣어요.');
      try { take(await readCode(ta.value.trim())); } catch { say('코드를 읽지 못했어요. 처음부터 끝까지 다 붙여 넣었는지 확인해요.'); } } }, '코드로 불러오기')),
    msg,
    h('div', { class:'danger' }, h('button', { class:'linkbtn', onclick:e => {
      if (!armed){ armed = true; e.currentTarget.textContent = '정말 지울까요? 한 번 더 누르면 모두 지워요'; return; }
      store.done = {}; store.wrong = {}; store.days = {}; store.pos = {}; delete store.last; save(); dlg.close(); toast('이 기기의 진도를 모두 지웠어요'); } }, '이 기기의 진도 모두 지우기')));
  dlg.addEventListener('close', () => { dlg.remove(); renderHome({ keep:true }); });
  document.body.append(dlg); dlg.showModal();
}

/* ============ 레슨 진행 ============ */
async function start(u, it, only, at = 0){
  const hmEl = document.querySelector('.home'); if (hmEl) homeScroll = homeSnap(hmEl);
  if (needsLoad(u)){
    const wait = setTimeout(showLoading, 150);
    try { await loadUnit(u); }
    catch { clearTimeout(wait); toast('단원을 불러오지 못했어요. 인터넷 연결을 확인해 주세요.'); renderHome({ back:true }); return; }
    clearTimeout(wait);
    it = u.items.find(x => x.id === it.id) || it;
  }
  if (it.type === 'mission') return missionView(u, it);
  const steps = only || it.steps;
  at = Math.max(0, Math.min(at | 0, steps.length - 1));
  S = { u, it, queue:steps.map((s, k) => ({ ...s, _k:s._k ?? k, _u:s._u ?? u, _it:s._it ?? it })), i:at, maxI:at, rec:new Map(), first:new Map(), retrying:!!only, dir:'zoom' };
  document.body.classList.add('playing');
  renderStep();
}
function segState(k){
  const r = S.rec.get(k);
  if (k === S.i) return 'cur';
  if (r && 'ok' in r) return r.ok ? 'right' : 'wrong';
  return k < S.maxI || k < S.i ? 'done' : '';
}
function topBar(){
  const { u, it, queue, i } = S;
  return h('div', { class:'top' }, h('div', { class:'wrap' },
    h('div', { class:'top-row' }, h('button', { class:'back btn', onclick:() => renderHome({ back:true }) }, '‹ 목록'),
      h('div', { class:'top-title' }, it.type === 'review' ? '오답 노트 · ' : `단원 ${unitNo(u)} · `, h('b', null, it.title)),
      queue.length ? h('div', { class:'count' }, `${Math.min(i + 1, queue.length)} / ${queue.length}`) : null),
    !queue.length ? null : h('div', { class:'segs', role:'progressbar', 'aria-valuemin':0, 'aria-valuemax':queue.length, 'aria-valuenow':i + 1 },
      queue.map((st, k) => { const vis = k <= S.maxI && k !== i;
        return h('button', { class:`${segState(k)}${vis ? ' visited' : ''}`, tabindex:-1, 'aria-label':`${k + 1}번째 단계`, title:vis ? `${k + 1}번째로 가기` : null,
          onclick:vis ? () => go(k) : null }); }))));
}
function layout(a, b, movable){
  S.dockIn = h('div', { class:'dock-in' });
  S.fbSlot = h('div', { class:'fbslot', 'aria-live':'polite' });
  const dock = h('div', { class:'dock' }, S.dockIn);
  const pc = isPC();
  const colA = h('section', { class:'col col-a' }, a);
  const cols = [colA];
  if (b && b.length) cols.push(h('section', { class:'col col-b' }, b, S.fbSlot, pc ? dock : null));
  else { colA.append(S.fbSlot); if (pc) colA.append(dock); }
  const main = h('main', { class:`wrap stage ${cols.length > 1 ? 'two' : 'one'} anim-${S.dir || 'fwd'}` }, cols);
  app.replaceChildren(h('div', { class:'player' }, topBar(), main, pc ? null : dock));
  window.scrollTo(0, 0);
  S.fit = () => fit(cols, movable);
  refit();
}
/* 아래 버튼·피드백까지 들어간 뒤에 칸 크기를 맞춘다 */
function refit(){ if (S && S.fit && !S.fitQ){ S.fitQ = true; queueMicrotask(() => { if (S){ S.fitQ = false; S.fit && S.fit(); } }); } }
/* PC에서 칸이 넘치면: 설명 문단을 오른쪽 칸으로 옮기고, 그래도 넘치면 그림을 줄인다 */
function fit(cols, movable){
  if (!isPC()) return;
  const over = c => c.scrollHeight > c.clientHeight + 2;
  const [A, B] = cols;
  if (movable && B && over(A) && movable[0].parentNode === A){
    const first = B.firstChild;
    movable.forEach(n => B.insertBefore(n, first));
    if (over(B)) movable.forEach(n => A.append(n));
  }
  cols.forEach(c => {
    const svg = c.querySelector('.fig svg'); let g = 0;
    while (svg && over(c) && g++ < 16){ const hh = svg.getBoundingClientRect().height; if (hh < 140) break; svg.style.maxHeight = Math.floor(hh - 20) + 'px'; }
    if (over(c)) c.classList.add('tight');   // 조금 넘치는 설명(연습장 칸 포함)은 글자를 살짝 줄여 한 화면에
  });
}
function closeBubble(){ if (S && S.bubble){ S.bubble.off(); S.bubble = null; } document.querySelectorAll('.bubble').forEach(b => b.remove()); }
let lastW = innerWidth;
addEventListener('resize', () => { if (innerWidth !== lastW){ lastW = innerWidth; closeBubble(); } });   // 폰 주소창이 접히는 높이 변화에는 닫지 않는다
function renderStep(){
  closeBubble();
  if (S.pad){ S.pad.stop(); S.pad = null; }
  const st = S.queue[S.i];
  S.pickKeys = null; S.canNext = true; S.simKey = null;
  S.maxI = Math.max(S.maxI, S.i);
  if (S.it.type === 'lesson' && !S.retrying){
    const k = pkey(S.u, S.it), n = S.it.steps.length;
    if (!store.done[k] && S.i > 0){ store.pos[k] = { i:Math.min(S.i, n - 1), n }; store.last = k; save(); }
  }
  ({ say:sayView, q:qView, try:tryView, sum:sumView, sim:simView })[st.t](st);
}
function next(){ S.dir = 'fwd'; S.i++; if (S.i >= S.queue.length) finish(); else renderStep(); }
function prev(){ if (S.i > 0 && S.i < S.queue.length){ S.dir = 'back'; S.i--; renderStep(); } }
function go(k){ if (k === S.i) return; S.dir = k < S.i ? 'back' : 'fwd'; S.i = k; renderStep(); }
function setDock(...kids){ S.dockIn.replaceChildren(...kids); refit(); }
function primary(text, on, disabled){ return h('button', { class:'primary btn', onclick:on, disabled }, h('span', null, text), h('kbd', null, 'Enter')); }
function nav(btn){
  return h('div', { class:'navrow' },
    h('button', { class:'ghost btn prev', onclick:prev, disabled:S.i === 0, 'aria-label':'이전 단계' }, '‹ 이전'), btn);
}
const pill = (text, cls = '') => h('span', { class:'pill ' + cls }, text);
/* 제목·정리·메모: 닫는 태그나 &lt; 같은 표시가 있으면 HTML로, 아니면 글자 그대로 */
const rich = s => typeof s === 'string' && (/&(lt|gt|amp|nbsp|quot);/.test(s) || /<\/(code|b|i|mark|strong|em|kbd)>/.test(s)) ? h('span', { html:s }) : s;

function sayView(st){
  const a = [h('div', { class:'kicker' }, pill('설명'), S.it.win && WIN_NAME[S.it.win] ? pill(WIN_NAME[S.it.win], 'review') : null), h('h2', null, rich(st.h))];
  const f = st.fig && fig(st.fig);
  const ps = (st.p || []).map(p => h('p', { html:p }));
  const b = [];
  if (st.code){ b.push(codeBlock(st.code.src, st.code.lang)); if (st.code.out) b.push(outBlock(st.code.out, st.code.err)); }
  if (st.table) b.push(tableBlock(st.table));
  if (st.tip) b.push(h('div', { class:'tip', html:st.tip }));
  if (f) a.push(f);
  if (f && !b.length) b.push(...ps); else a.push(...ps);
  layout(a, b, f && b.length ? ps : null);
  setDock(nav(primary('다음', next)));
}
function sumView(st){
  layout([h('div', { class:'kicker' }, pill('정리 카드')), h('h2', null, '오늘의 한입 요약'), fig('yay')],
    [h('ol', { class:'sum' }, st.pts.map(p => h('li', null, rich(p))))]);
  setDock(nav(primary('레슨 끝내기', next)));
}
const PREVIEW_CSS = `:host{display:block;padding:0;font-family:-apple-system,"Apple SD Gothic Neo","Noto Sans KR",sans-serif;color:#1F2633;background:#fff;border-radius:8px;line-height:1.5;font-size:18px;overflow:hidden}.hanip-body{display:block;margin:0;padding:10px 12px}h1{font-size:30px;margin:.2em 0}h2{font-size:24px;margin:.2em 0}p{margin:.4em 0}.hanip-img{display:inline-block;padding:12px 14px;border:2px dashed #b9c2cc;border-radius:10px;color:#6e6e73;font-size:14px;background:#fafafa;vertical-align:middle}`;
const placeImgs = root => root.querySelectorAll('img').forEach(im => { const src = im.getAttribute('src'); if (src == null || /^data:/.test(src)) return;
  const ph = document.createElement('span'); ph.className = 'hanip-img'; ph.textContent = `그림: ${im.getAttribute('alt') || '(대체 글 없음)'}`;
  const w = im.getAttribute('width'); if (w) ph.style.width = /^\d+$/.test(w) ? w + 'px' : w;
  im.replaceWith(ph); });
function tryView(st){
  const saved = S.rec.get(S.i);
  const ta = h('textarea', { id:`try-${st.lang}`, spellcheck:'false', autocapitalize:'off', autocomplete:'off', autocorrect:'off', 'aria-label':'코드 입력' });
  ta.value = saved ? saved.code : st.src;
  ta.addEventListener('input', () => { S.rec.set(S.i, { code:ta.value }); if (st.lang === 'md') run(); });
  const insert = sym => { const a = ta.selectionStart, b = ta.selectionEnd; ta.setRangeText(sym, a, b, 'end'); ta.focus(); ta.dispatchEvent(new Event('input')); };
  const KEYS = { html:['<', '>', '/', '"', '=', '{', '}', ':', ';'], py:['"', '(', ')', '[', ']', '{', '}', ':', '=', ','], md:['#', '*', '-', '`', '>', '[', ']', '(', ')', '|', '!'], js:['(', ')', '{', '}', ';', '\'', '"', '=', '.', '`', '[', ']', '>'] };
  const keys = h('div', { class:'keys' }, KEYS[st.lang].map(k =>
    h('button', { type:'button', class:'btn', onpointerdown:e => e.preventDefault(), onclick:() => insert(k), 'aria-label':`${k} 넣기` }, k)));
  const result = h('div');
  let inp = null;
  function run(){
    if (st.lang === 'html' || st.lang === 'md'){
      const host = h('div');
      const root = host.attachShadow({ mode:'open' });
      root.innerHTML = st.lang === 'md' ? `<style>${MD_CSS}</style>${mdRender(ta.value)}`
        : `<style>${PREVIEW_CSS}</style>` + previewHtml(ta.value);
      const note = h('div', { class:'hint', style:'padding:4px 6px;min-height:1.5em' });
      if (st.lang === 'html'){
        placeImgs(root);
        root.addEventListener('click', e => { const a = e.target.closest && e.target.closest('a'); if (a){ e.preventDefault(); note.textContent = `링크를 눌렀어요 → ${a.getAttribute('href') || '(주소 없음)'} (연습장에서는 이동하지 않아요)`; } });
        root.addEventListener('submit', e => { e.preventDefault(); const fd = new FormData(e.target); const parts = [...fd.entries()].map(([k, v]) => `${k}=${v}`);
          note.textContent = `보냈어요! ${parts.length ? parts.join(', ') : '(name이 붙은 입력칸이 없어서 보낼 값이 없어요)'}`; });
      }
      result.replaceChildren(h('div', { class:'preview' }, h('div', { class:'lbl' }, st.lang === 'md' ? '바로 보기' : '미리보기'), host, st.lang === 'html' ? note : null));
    } else {
      if (S.pad){ S.pad.stop(); S.pad = null; }
      const pre = h('pre'), errPre = h('pre', { class:'perr' }), note = h('div', { class:'hint', style:'padding:4px 6px' });
      const box = h('div', { class:'out' }, h('div', { class:'lbl' }, '실행 결과'), pre, errPre);
      let got = false;
      pre.textContent = '실행 중…';
      S.pad = pyPad({ onOut:s => { if (!got){ pre.textContent = ''; got = true; } pre.textContent += s; },
        onErr:s => { errPre.textContent = s; box.classList.add('err'); }, onNote:t => { note.textContent = t; },
        onDone:() => { if (!got) pre.textContent = errPre.textContent ? '' : '(화면에 나온 것이 없어요)'; } });
      result.replaceChildren(box, note);
      S.pad.run(ta.value, inp ? (inp.value || '').split(',').map(s => s.trim()).filter((x, i, arr) => arr.length > 1 || x !== '') : []);
    }
  }
  if (st.lang === 'py' && /\binput\s*\(/.test(st.src)) inp = h('input', { id:'py-input', placeholder:'예: 하늘', 'aria-label':'input()에 넣을 답' });
  layout([h('div', { class:'kicker' }, pill('직접 해 보기'), h('span', { class:'how' }, st.lang === 'md' ? '쓰는 대로 바로 바뀌어요' : '고친 뒤 실행을 눌러요')),
      h('h2', null, rich(st.h)), h('p', { html:st.p }),
      h('div', { class:'editor' }, ta, keys,
        inp ? h('label', { class:'inbox' }, st.lang === 'js' ? 'prompt()에 넣을 답(여러 개는 쉼표로)' : 'input()에 넣을 답(여러 개는 쉼표로)', inp) : null,
        st.lang === 'js' && st.html ? h('details', { class:'peek' }, h('summary', null, '이 연습장의 HTML 보기'), codeBlock(st.html, 'html')) : null,
        h('div', { class:'row' }, h('button', { class:'run btn', type:'button', onclick:() => { SFX.run(); run(); } }, '실행'),
          h('button', { class:'ghost btn', type:'button', onclick:() => { ta.value = st.src; S.rec.delete(S.i); run(); } }, '처음 코드로')))],
    [result, st.note ? h('p', { class:'note' }, rich(st.note)) : null].filter(Boolean));
  if (st.lang === 'py' && /\binput\s*\(/.test(ta.value)) result.replaceChildren(h('div', { class:'out' }, h('div', { class:'lbl' }, '실행 결과'),
    h('pre', null, 'input()에 넣을 답을 위 칸에 적고 실행을 눌러요.\n(답이 여러 개면 쉼표로 나눠요. 예: 하늘, 20)')));
  else run();
  setDock(nav(primary('다음', next)));
}

const HOW = {
  mc:['골라 보기', '알맞은 것을 하나 골라요'],
  blank:['빈칸 채우기', '빈칸에 들어갈 것을 골라요. 고르면 코드에 채워져요'],
  line:['틀린 줄 찾기', '문제가 있는 줄을 눌러요'],
  order:['순서 맞추기', '먼저 할 일부터 차례로 눌러 쌓아요'],
};
function qView(st){
  const rec = S.rec.get(S.i);
  const [label, how] = HOW[st.kind] || HOW.mc;
  const from = S.it.type === 'review' && st._u ? h('div', { class:'from' }, `${st._u.course.split(' · ')[0]} · 단원 ${unitNo(st._u)} · ${st._it.title}`) : null;
  const a = [h('div', { class:'kicker' }, pill(label), S.it.type === 'review' ? pill('오답 복습', 'retry') : null, st.retry ? pill('다시 도전', 'retry') : null, rec ? pill('푼 기록', 'review') : null, h('span', { class:'how' }, how)), from,
    h('div', { class:'q-text', html:st.q })];
  const f = st.fig && fig(st.fig, st._u); if (f) a.push(f);
  const b = [];
  let answer = null, checked = false, isRight, mark;
  const btn = primary('확인', () => checked ? next() : check(), true);
  const ready = ok => { const was = btn.disabled; btn.disabled = !ok; if (ok && was){ btn.classList.remove('ready'); void btn.offsetWidth; btn.classList.add('ready'); } };

  if (st.kind === 'line'){
    const box = codeBlock(st.code, st.lang, { pick:(i, row) => {
      if (checked) return;
      box.querySelectorAll('.ln').forEach(r => r.classList.remove('sel')); row.classList.add('sel'); answer = i; ready(true); buzz(8); SFX.pick();
    }});
    b.push(box, h('p', { class:'hint' }, isPC() ? '줄을 누르거나 숫자 키로 골라요.' : '줄을 눌러 고른 뒤 확인을 눌러요.'));
    S.pickKeys = n => { const r = box.querySelectorAll('.ln')[n]; if (r) r.click(); };
    isRight = () => answer === st.a;
    mark = (ok, quiet) => { const rows = box.querySelectorAll('.ln'); rows.forEach(r => r.classList.remove('sel')); rows[st.a].classList.add('right');
      if (!ok){ rows[answer].classList.add('wrong'); if (quiet) rows[answer].style.animation = 'none'; } };
  } else if (st.kind === 'order'){
    const order = shuffle(st.items.map((t, i) => i)), placed = rec ? rec.answer.slice() : [];
    const stack = h('ol', { class:'stack' }), pool = h('div', { class:'pool' });
    const draw = () => {
      stack.replaceChildren(...(placed.length ? placed.map((ix, k) => h('li', null, h('button', { class:'chip btn', disabled:checked, onclick:() => { placed.splice(k, 1); draw(); } },
        h('span', { class:'ix' }, `${k + 1}`), st.items[ix]))) : [h('li', { class:'empty' }, '여기에 차례로 쌓여요')]));
      pool.replaceChildren(...order.filter(ix => !placed.includes(ix)).map(ix => h('button', { class:'chip btn', disabled:checked, onclick:() => { placed.push(ix); buzz(8); SFX.pick(); draw(); } },
        h('span', { class:'ix' }, '+'), st.items[ix])));
      ready(placed.length === st.items.length);
    };
    draw();
    b.push(stack, h('p', { class:'hint' }, '쌓은 줄을 다시 누르면 빠져요.'), pool);
    S.pickKeys = n => { const c = pool.querySelectorAll('.chip')[n]; if (c) c.click(); };
    isRight = () => placed.every((ix, k) => ix === k);
    answer = placed;
    mark = () => { [...stack.querySelectorAll('.chip')].forEach((c, k) => { c.disabled = true; c.classList.add(placed[k] === k ? 'right' : 'wrong'); }); pool.replaceChildren(); };
  } else {
    let code = null;
    if (st.code){ code = codeBlock(st.code, st.lang); a.push(code); }
    const monoOpt = st.kind === 'blank' || st.mono;
    const texts = st.opts.map(o => Array.isArray(o) ? o.map((x, k) => `${MARKS[k]} ${x}`).join('   ') : o);
    const plainLen = t => String(t).replace(/<[^>]+>/g, '').length;
    const lines = t => String(t).split('\n');
    const multi = monoOpt && texts.every(t => String(t).includes('\n') && lines(t).every(l => [...l].reduce((n, ch) => n + (/[\uac00-\ud7af]/.test(ch) ? 2 : 1), 0) <= 26));
    const grid = isPC() && (multi || texts.every(t => plainLen(t) <= 14 && !String(t).includes('\n')));
    const optBtns = texts.map((text, i) => {
      const bt = h('button', { class:'opt btn', role:'radio', 'aria-checked':'false',
        onclick:() => {
          if (checked) return;
          optBtns.forEach(x => { x.classList.remove('sel'); x.setAttribute('aria-checked', 'false'); });
          bt.classList.add('sel'); bt.setAttribute('aria-checked', 'true'); answer = i; ready(true); buzz(8); SFX.pick(); closeBubble();
          if (st.kind === 'blank' && code) fillBlanks(code, st.opts[i]);
        },
        ondblclick:() => { if (!checked && answer === i) check(); } },
        h('span', { class:'radio' }, isPC() || st.kind === 'blank' ? String(i + 1) : MARKS[i]),   // 빈칸 문제는 빈칸 표시(①)와 헷갈리지 않게 숫자로
        monoOpt ? h('span', { class:'ot mono' }, text) : h('span', { class:'ot', html:text }),
        h('span', { class:'tag' }, i === st.a ? '정답' : '내 선택'),
        st.ex && st.ex[i] ? h('span', { class:'why', html:st.ex[i] }) : null);
      return bt;
    });
    const opts = h('div', { class:'opts' + (grid ? ' grid2' : '') + (multi ? ' multi' : ''), role:'radiogroup' }, optBtns);
    const tapBlanks = st.kind === 'blank' && code && !isPC();
    b.push(h('p', { class:'hint' }, isPC() ? '고른 뒤 확인(Enter). 숫자 키 1~4, 두 번 누르기로도 돼요.' : tapBlanks ? '빈칸을 누르면 바로 아래에 보기가 떠요. 여기 목록에서 골라도 돼요.' : '하나를 고른 뒤 아래 확인을 눌러요.'), opts);
    /* 휴대폰: 빈칸을 누르면 빈칸 바로 아래 말풍선으로 보기를 보여 준다 */
    if (tapBlanks){
      code.classList.add('tapblanks');
      code.querySelectorAll('.blank').forEach(el => {
        el.setAttribute('role', 'button'); el.tabIndex = 0; el.setAttribute('aria-label', `빈칸 ${el.textContent}: 보기 고르기`);
        const openIt = e => { e.preventDefault(); e.stopPropagation(); if (!checked) openBubble(el); };
        el.addEventListener('click', openIt);
        el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openIt(e); });
      });
    }
    function openBubble(anchor){
      closeBubble();
      const bub = h('div', { class:'bubble', role:'listbox', 'aria-label':'보기 고르기', style:`--z:${store.zoom || 1}` },
        texts.map((t, i) => h('button', { class:'bopt btn' + (answer === i ? ' on' : ''), role:'option', 'aria-selected':String(answer === i),
          onclick:e => { e.stopPropagation(); optBtns[i].click(); closeBubble(); } },
          h('span', { class:'bn' }, String(i + 1)), h('span', { class:'bt' }, t))));
      bub.addEventListener('keydown', e => { if (e.key === 'Escape'){ e.stopPropagation(); closeBubble(); anchor.focus(); } });
      document.body.append(bub);
      const r = anchor.getBoundingClientRect(), bw = Math.min(innerWidth - 24, 380);
      const left = Math.max(12, Math.min(innerWidth - bw - 12, r.left + r.width / 2 - bw / 2));
      bub.style.width = bw + 'px'; bub.style.left = left + scrollX + 'px'; bub.style.top = r.bottom + 12 + scrollY + 'px';
      bub.style.setProperty('--tail', Math.max(20, Math.min(bw - 20, r.left + r.width / 2 - left)) + 'px');
      /* 아래 버튼 영역에 가리면 말풍선이 다 보이게 조금 내린다 */
      const dock = document.querySelector('.dock'), limit = innerHeight - (dock ? dock.getBoundingClientRect().height : 0) - 10;
      const bb = bub.getBoundingClientRect(); if (bb.bottom > limit) window.scrollBy({ top:bb.bottom - limit, behavior:'smooth' });
      const outside = e => { if (!bub.contains(e.target) && !anchor.contains(e.target)) closeBubble(); };
      setTimeout(() => document.addEventListener('pointerdown', outside, true), 0);
      S.bubble = { el:bub, off:() => document.removeEventListener('pointerdown', outside, true) };
      (bub.querySelector('.bopt.on') || bub.querySelector('.bopt')).focus({ preventScroll:true });
    }
    S.pickKeys = n => { if (optBtns[n]) optBtns[n].click(); };
    isRight = () => answer === st.a;
    mark = (ok, quiet) => {
      opts.classList.add('checked');
      optBtns.forEach((x, i) => { x.disabled = true; x.classList.remove('sel');
        if (i === st.a){ x.classList.add('right'); x.querySelector('.radio').textContent = '✓'; }
        else if (i === answer){ x.classList.add('wrong'); if (!quiet) x.classList.add('shake'); x.querySelector('.radio').textContent = '✕'; } });
      if (st.kind === 'blank' && code){ fillBlanks(code, st.opts[st.a]); code.classList.remove('tapblanks'); }
      closeBubble();
      b[0].remove && b[0].remove();
    };
  }
  function feedback(ok, fresh){
    let body = st.why;
    if (!ok && st.kind === 'order') body = `<b>정답 순서:</b> ${st.items.map((t, k) => `${k + 1}. ${esc(t)}`).join(' → ')}<br>${st.why}`;
    if (!ok && st.kind === 'line') body = `${answer + 1}번 줄이 아니라 <b>${st.a + 1}번 줄</b>이에요. ${st.why}`;
    const fb = h('div', { class:'fb ' + (ok ? 'ok' : 'no'), role:'status' },
      h('h3', null, h('span', { class:'ic' }, ok ? '✓' : '✕'), fresh ? (ok ? pick(PRAISE) : pick(OOPS)) : (ok ? '맞혔던 문제예요' : '틀렸던 문제예요')),
      h('p', { html:body }));
    if (fresh && !ok && S.it.type === 'lesson' && !st.retry){
      S.queue.push({ ...st, retry:true, id0:st.id0 ?? st });
      fb.append(h('p', { class:'hint' }, '이 문제는 레슨 끝에 한 번 더 나와요.'));
    }
    return fb;
  }
  function showResult(ok, fresh){
    checked = true; S.pickKeys = null;
    mark(ok, !fresh);
    btn.firstChild.textContent = '다음';
    const fb = feedback(ok, fresh);
    if (isPC()) setDock(fb, nav(btn)); else { S.fbSlot.replaceChildren(fb); setDock(nav(btn)); }
    if (fresh){
      btn.disabled = false; btn.classList.remove('ready'); void btn.offsetWidth; btn.classList.add('ready');
      buzz(ok ? 15 : [30, 40, 30]); ok ? SFX.right() : SFX.wrong();
      if (!isPC()) setTimeout(() => fb.scrollIntoView({ behavior:'smooth', block:'nearest' }), 60);
      else btn.focus({ preventScroll:true });
      const top = document.querySelector('.segs'); if (top){ const seg = top.children[S.i]; if (seg){ seg.className = ok ? 'right' : 'wrong'; } }
    }
  }
  function check(){
    const ok = isRight(), keyq = st.id0 ?? st;
    if (!S.first.has(keyq)) S.first.set(keyq, ok);
    /* 오답 노트: 처음 푼 답만 본다(레슨 끝의 '다시 도전'과 '틀린 문제만 다시 풀기'는 빼고) */
    if (!S.retrying && !st.retry && st._u && st._it && S.it.type !== 'check'){
      const k = wkey(st);
      if (ok) delete store.wrong[k]; else if (S.it.type === 'review' || !store.wrong[k]) store.wrong[k] = Date.now();
      save();
    }
    S.rec.set(S.i, { answer:st.kind === 'order' ? answer.slice() : answer, ok });
    showResult(ok, true);
  }
  layout(a, b);
  setDock(nav(btn));
  if (rec){ answer = rec.answer; if (st.kind === 'blank' && st.code){} btn.disabled = false; showResult(rec.ok, false); }
}
function fillBlanks(code, o){
  const vals = Array.isArray(o) ? o : [o];
  code.querySelectorAll('.blank').forEach(el => { const n = +el.dataset.b; el.textContent = vals[n - 1] ?? MARKS[n - 1]; el.classList.remove('filled'); void el.offsetWidth; el.classList.add('filled'); });
}
function shuffle(a){
  const r = a.slice();
  do { for (let i = r.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } }
  while (r.every((v, i) => v === i) && r.length > 1);
  return r;
}
function nextItem(){
  const { u, it } = S;
  if (it.type === 'review') return null;
  const k = u.items.indexOf(it);
  if (k + 1 < u.items.length) return [u, u.items[k + 1]];
  const nu = UNITS[UNITS.indexOf(u) + 1];
  return nu ? [nu, nu.items[0]] : null;
}
function finish(){
  const { u, it } = S;
  S.pickKeys = null; S.dir = 'zoom';
  const nx = nextItem();
  const toList = () => renderHome({ back:true });
  const goNx = () => { if (!nx) return toList(); store.unit = nx[0].id; store.course = nx[0].course; save(); start(nx[0], nx[1]); };
  const listBtn = () => h('button', { class:'ghost btn wide', onclick:toList }, '목록으로');
  const backBtn = () => h('button', { class:'ghost btn wide', onclick:() => { S.dir = 'back'; S.i = S.queue.length - 1; renderStep(); } }, '‹ 마지막 단계 다시 보기');
  if (!S.retrying) markToday();
  const cheer = () => { const t = today(), s = streak();
    return h('p', { class:'cheer' }, `오늘 ${t}번째 한입이에요.`, s > 1 ? ` 연속 ${s}일째 공부 중! 🔥` : ' 내일도 한입 하면 연속 기록이 시작돼요.'); };
  if (it.type === 'lesson'){
    const k = pkey(u, it);
    if (!S.retrying){ store.done[k] = { done:true }; delete store.pos[k]; if (store.last === k) delete store.last; }
    save();
    SFX.done();
    const qn = it.steps.filter(s => s.t === 'q').length;
    layout([h('div', { class:'kicker' }, pill('레슨 완료')), h('h2', null, `${it.title}, 한입 꿀꺽!`), fig('yay'),
      h('p', null, `문제 ${qn}개를 모두 지나왔어요. 틀렸던 문제도 다시 풀어 봤으니 이제 내 것이에요.`), cheer()], []);
    setDock(primary(nx ? `다음: ${nx[1].title}` : '목록으로', goNx), listBtn());
    return;
  }
  const asked = S.queue.filter(s => s.t === 'q');
  const right = asked.filter(q => S.first.get(q.id0 ?? q)).length;
  const wrong = asked.filter(q => !S.first.get(q.id0 ?? q));
  const wrongList = () => wrong.length ? [h('p', null, '틀린 문제'), h('ul', { class:'review' }, wrong.map(q => h('li', { html:q.q })))] : [];
  if (it.type === 'check'){
    const all = right === asked.length;
    if (all){ u.items.forEach(x => { if ((x.type === 'lesson' || x.type === 'quiz') && !store.done[pkey(u, x)]) store.done[pkey(u, x)] = { skip:true }; }); save(); SFX.fanfare(); }
    else SFX.soft();
    const m1 = u.items.find(x => x.type === 'mission'), t1 = u.items.find(x => x.type === 'test'), l1 = u.items[0];
    layout([h('div', { class:'kicker' }, pill('이미 알아요 점검')), h('div', { class:'score' }, `${right} / ${asked.length}`),
      h('div', { class:'verdict ' + (all ? 'ok' : 'no') }, all ? '다 알고 있네요! 레슨은 건너뛰었어요.' : '몇 개는 새로 배울 게 있어요. 레슨부터 차근차근 해요.'), fig('yay')], wrongList());
    const goTo = x => { store.unit = u.id; store.course = u.course; save(); start(u, x); };
    setDock(...(all ? [primary(`다음: ${(m1 || t1).title}`, () => goTo(m1 || t1)), h('button', { class:'ghost btn wide', onclick:toList }, '목록으로')]
      : [primary(`레슨 1부터: ${l1.title}`, () => goTo(l1)), h('button', { class:'ghost btn wide', onclick:toList }, '목록으로')]));
    return;
  }
  if (it.type === 'review'){
    save();
    const left = Object.keys(store.wrong).length;
    (right === asked.length ? SFX.fanfare : SFX.done)();
    layout([h('div', { class:'kicker' }, pill('오답 복습 결과')), h('div', { class:'score' }, `${right} / ${asked.length}`),
      h('div', { class:'verdict ok' }, right ? `맞힌 ${right}문제는 오답 노트에서 뺐어요.` : '괜찮아요. 틀린 문제는 오답 노트에 그대로 남아 있어요.'), fig('yay'), cheer()], wrongList());
    setDock(...(left ? [primary(`한 번 더 복습 (${Math.min(left, 10)}문제)`, startReview), listBtn()] : [primary('목록으로', toList)]));
    return;
  }
  if (!S.retrying){ const prevR = store.done[pkey(u, it)]; store.done[pkey(u, it)] = { best:Math.max(prevR ? prevR.best : 0, right), total:asked.length }; save(); }
  const passed = it.type === 'test' && !S.retrying ? right / asked.length >= it.pass : null;
  const verdict = passed === null
    ? h('div', { class:'verdict ok' }, right === asked.length ? '완전 정복!' : '헷갈리는 건 원래 헷갈려요. 한 번 더!')
    : h('div', { class:'verdict ' + (passed ? 'ok' : 'no') }, passed ? '통과! 다음으로 가도 좋아요.' : `조금만 더! ${Math.ceil(asked.length * it.pass)}문제 이상이면 통과예요.`);
  (passed === false ? SFX.soft : right === asked.length || passed ? SFX.fanfare : SFX.done)();
  const a = [h('div', { class:'kicker' }, pill(S.retrying ? '틀린 문제 다시 풀기 결과' : it.title)), h('div', { class:'score' }, `${right} / ${asked.length}`), verdict, fig('yay'), S.retrying ? null : cheer()];
  layout(a, wrongList());
  setDock(...(wrong.length
    ? [primary('틀린 문제만 다시 풀기', () => start(u, it, wrong.map(q => ({ ...q, id0:undefined, retry:false })))), h('button', { class:'ghost btn wide', onclick:goNx }, nx ? `다음: ${nx[1].title}` : '목록으로')]
    : [primary(nx ? `다음: ${nx[1].title}` : '목록으로', goNx), backBtn()]));
}

/*VIEWS*/

/* 키보드 */
document.addEventListener('keydown', e => {
  if (S && S.simKey && !e.isComposing && S.simKey(e)) return;
  if (!S || e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.key === 'Escape' && document.querySelector('.bubble')){ closeBubble(); return; }
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'textarea' || tag === 'input') return;
  if (/^[1-9]$/.test(e.key) && S.pickKeys){ e.preventDefault(); S.pickKeys(+e.key - 1); return; }
  if (e.key === 'ArrowLeft'){ e.preventDefault(); prev(); return; }
  if (e.key === 'Enter' && (tag !== 'button' || e.target.matches('.opt, .chip'))){
    const b = S.dockIn && S.dockIn.querySelector('.primary');
    if (b && !b.disabled){ e.preventDefault(); b.click(); }
  }
  if (e.key === 'Escape') renderHome({ back:true });
});

if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (S && S.fit) S.fit(); });
renderHome();
