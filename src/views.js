/* ============ 단축키 글쇠: <kbd>mod+shift+p</kbd> → 설정(Mac/Windows)에 맞는 글쇠 ============ */
const OS = () => store.os || (/Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent) ? 'mac' : 'win');
const KEYNAME = { '⌘':'Command', '⇧':'Shift', '⌥':'Option', '⌃':'Control', '⌫':'Delete' };
function combo(k, os = OS()){
  const caps = SIM.caps(k, os);
  const el = h('span', { class:'combo', 'aria-label':caps.map(c => KEYNAME[c] || c).join(' ') });
  caps.forEach((c, i) => { if (i && os === 'win') el.append(h('span', { class:'plus', 'aria-hidden':'true' }, '+')); el.append(h('kbd', { class:'kc', 'aria-hidden':'true' }, c)); });
  return el;
}
/* 글에 들어 있는 <kbd>소문자 조합</kbd>만 바꾼다(버튼 속 Enter 같은 표시는 그대로) */
function keyify(root){
  const list = root.matches && root.matches('kbd') ? [root] : root.querySelectorAll ? root.querySelectorAll('kbd:not(.kc)') : [];
  list.forEach(k => { const t = k.textContent.trim();
    if (!k.classList.contains('kc') && t && t === t.toLowerCase() && !/^\d$/.test(t) && SIM.valid(t)) k.replaceWith(combo(t)); });
}
new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) keyify(n); }))).observe(document.body, { childList:true, subtree:true });
const WIN_NAME = { agents:'Agents Window', ide:'IDE 창', both:'두 창 모두', web:'웹 화면', console:'업스테이지 콘솔' };
/* 웹 창 이름표: 주소로 정한다 */
const webName = sc => /console\.upstage\.ai/.test(sc.url || '') ? '업스테이지 콘솔' : /^localhost|^127\.0\.0\.1/.test(sc.url || '') ? '내 웹앱' : '웹 화면';

/* ============ 모의 Cursor 화면 ============ */
const TNAME = t => { const [k, v] = [t.slice(0, t.indexOf(':')), t.slice(t.indexOf(':') + 1)];
  return { pal:`“${v}” 명령`, nav:`“${v}” 메뉴`, set:'설정 줄', file:`${v} 파일`, agent:`“${v}” 에이전트`, menu:`“${v}”`,
    side:{ customize:'Customize', settings:'Settings', explorer:'탐색기(Explorer)', search:'검색', extensions:'확장' }[v] || v,
    msg:`“${v}” 버튼`, chg:`“${v}” 버튼`, item:'그 줄의 버튼', web:`페이지의 “${v}”`,
    b:`“${v}” 버튼`, sel:`“${v}” 고르기 칸`, tog:`“${v}” 스위치`, tab:`“${v}” 탭`, row:`“${v}” 줄`, card:`“${v}” 카드`, el:`${v}번째 요소`,
    btn:{ 'new-agent':'New Agent 버튼', send:'보내기 버튼', mode:'모드 고르기', model:'모델 고르기', env:'어디서 돌릴지 고르기', restore:'Restore Checkpoint', run:'Run 버튼', skip:'Skip 버튼',
      accept:'Accept 버튼', reject:'Reject 버튼', close:'닫기 버튼', 'add-rule':'Add Rule 버튼(프로젝트 규칙 파일 만들기)' }[v] || v }[k] || t; };
function simScreen(sc, on){
  const T = (t, attrs, ...kids) => h('button', Object.assign({ type:'button', class:'st', 'data-t':t, 'aria-label':TNAME(t) }, attrs || {}), ...kids);
  const field = (into, text, ph, cls) => h('div', { class:'sfield ' + (cls || ''), 'data-type':into, role:'textbox', 'aria-label':'입력칸' },
    text ? h('span', null, text) : h('span', { class:'ph' }, ph || ''), h('i', { class:'caret' }));
  const chat = p => h('section', { class:'s-chat' },
    h('div', { class:'s-msgs' }, (p.msgs || []).map(m => m.me != null
      ? h('div', { class:'s-mewrap' }, m.checkpoint ? T('btn:restore', { class:'st s-link' }, '↺ Restore Checkpoint') : null, h('div', { class:'s-me' }, h('span', { html:m.me })))
      : h('div', { class:'s-ai' }, h('span', { html:m.ai }),
          m.checkpoint ? T('btn:restore', { class:'st s-link' }, '↺ Restore Checkpoint') : null,
          m.run ? h('div', { class:'s-run' }, h('code', null, '$ ' + m.run), h('div', { class:'s-row' }, T('btn:skip', { class:'st s-btn' }, 'Skip'), T('btn:run', { class:'st s-btn pri' }, 'Run'))) : null,
          m.btns ? h('div', { class:'s-row wrap' }, m.btns.map((b, i) => T('msg:' + b, { class:'st s-btn' + (i ? '' : ' pri') }, b))) : null))),
    h('div', { class:'s-input' }, field('chat', p.input, p.ph || 'Plan, @ for context, / for commands'),
      h('div', { class:'s-row' }, T('btn:mode', { class:'st s-chip' }, (p.mode || 'Agent') + ' ▾'), T('btn:model', { class:'st s-chip' }, (p.model || 'Auto') + ' ▾'),
        p.env ? T('btn:env', { class:'st s-chip' }, p.env + ' ▾') : null,
        h('span', { class:'sp' }), T('btn:send', { class:'st s-send' }, '↑'))));
  const web = b => h('aside', { class:'s-web' }, h('div', { class:'s-url' }, h('span', null, '◀ ▶ ⟳'), h('code', null, b.url || 'localhost:3000')),
    h('div', { class:'s-page-w', html:b.html || '' }),
    b.links ? h('div', { class:'s-row wrap s-weblinks' }, b.links.map(l => T('web:' + l, { class:'st s-btn' }, l))) : null,
    b.console ? h('div', { class:'s-cons' }, h('div', { class:'s-h' }, 'CONSOLE'), b.console.map(c => h('div', { class:'s-tl' + (/error/i.test(c) ? ' err' : '') }, c))) : null);
  const termLines = sc => [...(sc.term || []).map(t => h('div', { class:'s-tl', html:highlight(t, 'sh') })),
    h('div', { class:'s-tl s-prompt' }, h('span', { class:'c' }, '$ '), field('term', sc.prompt, ''))];
  /* ---- 웹 창(업스테이지 콘솔·내 웹앱): 블록을 위에서 아래로 쌓는다 ---- */
  const fld = (b, into) => field(into, b.value, b.ph || '', 'w-in' + (b.area ? ' area' : '') + (b.mono ? ' mono' : ''));
  const bt = (x, i, plain) => T('b:' + x, { class:'st w-btn' + (i || plain ? '' : ' pri') }, x);
  const code = (src, lang) => h('pre', { class:'w-code' }, ...String(src || '').split('\n').map(l => h('div', { html:highlight(l, lang) || '&nbsp;' })));
  const block = b => {
    switch (b.k){
      case 'h': return h('div', { class:'w-h' }, h('div', null, h('b', null, b.text), b.sub ? h('small', { html:b.sub }) : null), h('span', { class:'sp' }), ...(b.btns || []).map((x, i) => bt(x, i, b.plain)));
      case 'p': return h('p', { class:'w-p', html:b.text });
      case 'btns': return h('div', { class:'s-row wrap w-btns' }, (b.btns || []).map((x, i) => bt(x, i, b.plain)));
      case 'field': return h('div', { class:'w-field' }, b.label ? h('small', null, b.label) : null, fld(b, 'f:' + b.id));
      case 'select': return h('div', { class:'w-field' }, h('small', null, b.label || b.id),
        b.slider != null ? T('sel:' + b.id, { class:'st w-slider' }, h('span', { class:'w-track' }, h('i', { style:`width:${Math.max(0, Math.min(1, b.slider)) * 100}%` })), h('b', null, String(b.value)))
          : T('sel:' + b.id, { class:'st w-select' }, h('span', null, String(b.value)), h('i', null, '▾')));
      case 'toggle': return h('div', { class:'w-tog' }, h('span', null, b.label || b.id), T('tog:' + b.id, { class:'st s-tog' + (b.on ? ' on' : ''), role:'switch', 'aria-checked':String(!!b.on) }, h('i')));
      case 'chat': return h('div', { class:'w-chat' },
        h('div', { class:'w-msgs' }, (b.msgs || []).length ? b.msgs.map(m => m.me != null ? h('div', { class:'w-me', html:m.me }) : m.sys != null ? h('div', { class:'w-sys', html:m.sys }) : h('div', { class:'w-ai', html:m.ai }))
          : h('div', { class:'w-empty' }, b.empty || '대화를 시작해 보세요')),
        h('div', { class:'w-input' }, field('chat', b.input, b.ph || 'Type a message'), T('btn:send', { class:'st s-send' }, '↑')));
      case 'tabs': return h('div', { class:'w-tabs' }, (b.items || []).map(x => T('tab:' + x, { class:'st w-tab' + (x === b.on ? ' on' : '') }, x)));
      case 'code': return h('div', { class:'w-codebox' }, b.label ? h('small', null, b.label) : null, code(b.src, b.lang));
      case 'table': return h('div', { class:'w-tbl' }, h('table', null, b.head ? h('thead', null, h('tr', null, b.head.map(c => h('th', { html:c })))) : null,
        h('tbody', null, (b.rows || []).map(r => b.pick ? h('tr', null, h('td', { colspan:r.length }, T('row:' + String(r[0]).replace(/<[^>]+>/g, ''), { class:'st w-rowbtn' }, ...r.map(c => h('span', { html:c })))))
          : h('tr', null, r.map(c => h('td', { html:c })))))));
      case 'files': return h('div', { class:'w-files' }, b.drop ? h('div', { class:'w-drop' }, b.drop) : null,
        (b.items || []).map(x => T('file:' + x, { class:'st w-file' + (x === b.on ? ' on' : '') }, h('i', null, /\.(png|jpe?g)$/i.test(x) ? '🖼' : '📄'), h('span', null, x))));
      case 'kv': return h('dl', { class:'w-kv' }, (b.rows || []).flatMap(([k, v]) => [h('dt', null, k), h('dd', { html:String(v) })]));
      case 'note': return h('div', { class:'w-note ' + (b.tone || ''), html:b.text });
      case 'secret': return h('div', { class:'w-secret' }, h('code', null, b.value), b.btn ? T('b:' + b.btn, { class:'st w-btn' }, b.btn) : null);
      case 'cards': return h('div', { class:'w-cards' }, (b.items || []).map(c => T('card:' + c.id, { class:'st w-card' + (c.on ? ' on' : '') }, h('b', null, c.title), c.desc ? h('small', null, c.desc) : null)));
      case 'steps': return h('ol', { class:'w-steps' }, (b.items || []).map((x, i) => h('li', { class:i < (b.on || 0) ? 'ok' : i === (b.on || 0) ? 'now' : '' }, h('i', null, i < (b.on || 0) ? '✓' : String(i + 1)), x)));
      case 'page': return h('div', { class:'w-pagebox' }, b.label ? h('small', null, b.label) : null, h('div', { class:'w-paper' + (b.show ? ' show' : '') }, (b.els || []).map((e, i) => {
        const inner = e.cat === 'table' ? h('table', null, (e.rows || []).map(r => h('tr', null, r.map(c => h('td', null, c)))))
          : e.cat === 'figure' || e.cat === 'chart' ? h('div', { class:'w-fig' }, e.text || (e.cat === 'chart' ? '📊' : '🖼'))
          : e.cat === 'list' ? h('ul', null, (e.items || [e.text]).map(x => h('li', null, x))) : h('span', null, e.text || '');
        const el = h('div', { class:'w-el c-' + e.cat }, b.show ? h('em', null, e.cat) : null, inner);
        return b.pick ? T('el:' + (i + 1), { class:'st w-elbtn' + (e.on ? ' on' : '') }, el) : el; })));
      default: return null;
    }
  };
  let body;
  if (sc.win === 'web'){
    const nav = sc.nav || [];
    body = h('div', { class:'s-body web' + (nav.length ? ' has-nav' : '') + ((sc.aside || []).length ? ' has-aside' : '') },
      nav.length ? h('nav', { class:'w-nav' }, sc.brand ? h('div', { class:'w-brand' }, sc.brand) : null,
        nav.map(n => { const name = typeof n === 'string' ? n : n.name, sub = typeof n === 'string' ? false : n.sub;
          return T('nav:' + name, { class:'st w-navi' + (name === sc.page ? ' on' : '') + (sub ? ' sub' : '') }, name); })) : null,
      h('section', { class:'w-main' }, (sc.blocks || []).map(block)),
      (sc.aside || []).length ? h('aside', { class:'w-aside' }, sc.aside.map(block)) : null);
  } else if (sc.win === 'term'){
    body = h('div', { class:'s-body termwin' }, h('section', { class:'s-term full' }, termLines(sc)));
  } else if (sc.win === 'agents'){
    body = h('div', { class:'s-body agents' + (sc.changes || sc.browser ? ' has-changes' : '') + (sc.browser ? ' has-web' : '') },
      h('aside', { class:'s-side' }, T('btn:new-agent', { class:'st s-new' }, '＋ New Agent'),
        h('div', { class:'s-list' }, (sc.agents || []).map(a => T('agent:' + a.title, { class:'st s-agent' + (a.on ? ' on' : '') }, h('i', { class:'dot ' + (a.status || '') }), a.title))),
        h('span', { class:'sp' }), T('side:customize', { class:'st s-sbtn' }, '⚙︎ Customize'), T('side:settings', { class:'st s-sbtn' }, '⚙ Settings')),
      sc.panel ? chat(sc.panel) : h('section', { class:'s-chat empty' }, h('p', null, 'Start a new agent')),
      sc.browser ? web(sc.browser) : sc.changes ? h('aside', { class:'s-changes' }, h('div', { class:'s-h' }, 'Changes'),
        sc.changes.map(c => T('file:' + c.file, { class:'st s-file' }, h('span', null, c.file), h('small', null, h('b', { class:'add' }, '+' + (c.add || 0)), ' ', h('b', { class:'del' }, '−' + (c.del || 0))))),
        sc.changeBtns ? h('div', { class:'s-row wrap s-chgbtns' }, sc.changeBtns.map((b, i) => T('chg:' + b, { class:'st s-btn' + (i ? '' : ' pri') }, b))) : null) : null);
  } else {
    const lines = String(sc.code || '').split('\n');
    const ed = h('div', { class:'s-code' });
    lines.forEach((ln, i) => {
      const n = i + 1;
      if (sc.inline && sc.inline.line === n) ed.append(h('div', { class:'s-inline' }, field('inline', sc.inline.text, sc.inline.ph || 'Edit selected code', 'in')));
      if (sc.diff && sc.diff.line === n){
        ed.append(h('div', { class:'s-diff' }, h('div', { class:'s-row s-dbtn' }, T('btn:reject', { class:'st s-btn' }, 'Reject'), T('btn:accept', { class:'st s-btn pri' }, 'Accept')),
          (sc.diff.del || []).map(d => h('div', { class:'s-ln del' }, h('span', { class:'nm' }, '−'), h('span', { class:'tx', html:highlight(d, sc.lang) }))),
          (sc.diff.add || []).map(d => h('div', { class:'s-ln add' }, h('span', { class:'nm' }, '+'), h('span', { class:'tx', html:highlight(d, sc.lang) })))));
        return;
      }
      ed.append(h('div', { class:'s-ln' }, h('span', { class:'nm' }, String(n)), h('span', { class:'tx', html:highlight(ln, sc.lang) },
        sc.ghost && sc.ghost.line === n ? h('span', { class:'s-ghost' }, sc.ghost.text) : null)));
    });
    body = h('div', { class:'s-body ide' + (sc.panel || sc.browser ? ' has-panel' : '') + (sc.term ? ' has-term' : '') },
      h('nav', { class:'s-act' }, T('side:explorer', { class:'st s-ico on', title:'Explorer' }, '▤'), T('side:search', { class:'st s-ico', title:'Search' }, '⌕'), T('side:extensions', { class:'st s-ico', title:'Extensions' }, '⊞')),
      h('aside', { class:'s-tree' }, h('div', { class:'s-h' }, (sc.folder || 'project').toUpperCase()),
        (sc.files || []).map(f => T('file:' + f, { class:'st s-f' + (f === sc.open ? ' on' : '') + (f.endsWith('/') ? ' dir' : '') }, (f.endsWith('/') ? '▸ ' : '') + f))),
      h('section', { class:'s-ed' }, sc.open ? h('div', { class:'s-tabs' }, h('span', { class:'s-tab' }, sc.open)) : null, sc.open ? ed : h('div', { class:'s-empty' }, 'Open a file')),
      sc.panel ? chat(sc.panel) : sc.browser ? web(sc.browser) : null,
      sc.term ? h('section', { class:'s-term' }, h('div', { class:'s-h' }, 'TERMINAL'), termLines(sc)) : null);
  }
  const over = [];
  if (sc.settings || sc.customize){
    const o = sc.settings || sc.customize, isSet = !!sc.settings;
    const page = o.page || (o.nav || [])[0];
    let content;
    if (isSet) content = (o.rows || []).map(r => h('div', { class:'s-setrow' },
      h('div', null, h('b', null, r.label), r.desc ? h('small', null, r.desc) : null),
      r.button ? T('set:' + r.id, { class:'st s-btn' }, r.button) : T('set:' + r.id, { class:'st s-tog' + (r.toggle ? ' on' : ''), role:'switch', 'aria-checked':String(!!r.toggle) }, h('i'))));
    else if (page === 'Rules') content = [h('div', { class:'s-h2' }, 'User Rules'), field('rule', o.user, '', 'area'),
      h('div', { class:'s-h2' }, 'Project Rules'), ...(o.project || []).map(r => h('div', { class:'s-rule' }, r)),
      T('btn:add-rule', { class:'st s-btn' }, '＋ Add Rule')];
    else content = (o.items || []).length ? o.items.map(i => h('div', { class:'s-setrow' }, h('div', null, h('b', null, i.title), i.desc ? h('small', null, i.desc) : null),
        i.button ? T('item:' + i.id, { class:'st s-btn' }, i.button)
          : 'toggle' in i ? T('item:' + i.id, { class:'st s-tog' + (i.toggle ? ' on' : ''), role:'switch', 'aria-checked':String(!!i.toggle) }, h('i')) : null)) : [h('p', { class:'s-muted' }, 'Nothing here yet')];
    over.push(h('div', { class:'s-dlg' }, h('div', { class:'s-dlgbar' }, h('b', null, isSet ? 'Cursor Settings' : 'Customize'), h('span', { class:'sp' }), T('btn:close', { class:'st s-x' }, '✕')),
      h('div', { class:'s-dlgin' }, h('nav', { class:'s-nav' }, (o.nav || []).map(n => T('nav:' + n, { class:'st s-navi' + (n === page ? ' on' : '') }, n))),
        h('div', { class:'s-page' }, h('div', { class:'s-h1' }, page), content))));
  }
  if (sc.dlg) over.push(h('div', { class:'w-dlg' }, h('div', { class:'s-dlgbar' }, h('b', null, sc.dlg.title || ''), h('span', { class:'sp' }), T('btn:close', { class:'st s-x' }, '✕')),
    h('div', { class:'w-dlgin' }, (sc.dlg.blocks || []).map(block))));
  if (sc.menu) over.push(h('div', { class:'s-menu' }, sc.menu.title ? h('div', { class:'s-h' }, sc.menu.title) : null, sc.menu.items.map(i => T('menu:' + i, { class:'st s-mi' }, i))));
  if (sc.palette) over.push(h('div', { class:'s-pal' }, field('palette', sc.palette.q, 'Type a command', 'pq'),
    h('div', { class:'s-pl' }, SIM.palItems(sc.palette).slice(0, 7).map(i => T('pal:' + i, { class:'st s-pi' }, i)),
      SIM.palItems(sc.palette).length ? null : h('div', { class:'s-muted' }, 'No matching commands'))));
  if (sc.toast) over.push(h('div', { class:'s-toast' }, sc.toast));
  const title = sc.win === 'web' ? (sc.title || webName(sc)) : `${sc.folder || 'Cursor'} — ${sc.win === 'agents' ? 'Agents Window' : sc.win === 'term' ? 'Terminal' : 'Cursor'}`;
  return h('div', { class:'sim w-' + sc.win, 'data-on':on || '' },
    h('div', { class:'s-bar' }, h('i'), h('i'), h('i'), h('span', null, title)),
    sc.win === 'web' ? h('div', { class:'s-url w-url' }, h('span', null, '◀ ▶ ⟳'), h('code', null, sc.url || 'console.upstage.ai')) : null,
    body, over.length ? h('div', { class:'s-over' + (sc.palette || sc.menu ? ' light' : '') + (sc.win === 'web' ? ' w-over' : '') }, over) : null);
}
function simView(st){
  const rec = S.rec.get(S.i);
  const my = { k:0, scene:st.scene, said:null, done:false, wrong:0 };
  if (rec && rec.done){ my.k = st.steps.length; my.scene = st.steps.reduce((sc, x) => { if (x.type != null) sc = SIM.typeInto(sc, x.into, x.type) || sc; if (x.click) sc = SIM.autoClick(sc, x.click); return x.then ? SIM.patch(sc, x.then) : sc; }, st.scene); my.done = true; my.said = st.end; }
  const goals = h('ol', { class:'sgoals' });
  const holder = h('div', { class:'simhold' });
  const bar = h('div', { class:'sgoal' });
  const say = h('div', { class:'ssay', 'aria-live':'polite' });
  const btn = primary('다음', next, !my.done);
  const cur = () => st.steps[my.k];
  const winPill = pill('', 'review');
  const drawGoals = () => goals.replaceChildren(...st.steps.map((x, i) => h('li', { class:i < my.k ? 'ok' : i === my.k && !my.done ? 'now' : '' },
    h('span', { class:'gi' }, i < my.k ? '✓' : String(i + 1)), h('span', { html:x.goal }))));
  const draw = () => {
    const x = cur();
    winPill.textContent = my.scene.win === 'web' ? webName(my.scene) : { agents:'Cursor 에이전트', ide:'Cursor 편집기', term:'터미널' }[my.scene.win] || '';
    holder.replaceChildren(simScreen(my.scene, x && !my.done ? (x.click || (x.type != null ? 'type:' + x.into : '')) : ''),
      h('p', { class:'snote' }, my.scene.win === 'web' ? '실제 화면을 단순하게 옮긴 연습용이에요. 메뉴 이름·위치·모델 목록은 바뀔 수 있어요.' : '실제 Cursor 화면을 단순하게 옮긴 연습용이에요. 버전에 따라 모양이 조금 달라요.'));
    drawGoals();
    if (my.done){ bar.replaceChildren(h('span', { class:'sdone' }, '✓ 다 해 봤어요'), h('button', { class:'ghost btn sm', type:'button', onclick:restart }, '처음부터 다시')); }
    else {
      const kids = [h('span', { class:'sstep' }, `${my.k + 1}/${st.steps.length}`), h('b', { html:x.goal })];
      if (x.key) kids.push(h('button', { class:'keybtn btn', type:'button', onclick:() => hit('key'), 'aria-label':`${SIM.label(x.key, OS())} 누르기` }, combo(x.key), h('span', null, '누르기')));
      kids.push(h('button', { class:'linkbtn', type:'button', onclick:hint }, '힌트'));
      bar.replaceChildren(...kids);
    }
    refit();
  };
  const tell = (html, cls) => { say.className = 'ssay ' + (cls || ''); say.innerHTML = html; say.classList.remove('pop'); void say.offsetWidth; say.classList.add('pop'); };
  function advance(){
    const x = cur();
    if (x.type != null) my.scene = SIM.typeInto(my.scene, x.into, x.type) || my.scene;
    if (x.click && x.click.startsWith('set:') && my.scene.settings){
      my.scene = SIM.patch(my.scene, { settings:Object.assign({}, my.scene.settings, { rows:my.scene.settings.rows.map(r => 'set:' + r.id === x.click && 'toggle' in r ? Object.assign({}, r, { toggle:!r.toggle }) : r) }) });
    }
    if (x.click && x.click.startsWith('item:') && my.scene.customize && my.scene.customize.items){
      my.scene = SIM.patch(my.scene, { customize:Object.assign({}, my.scene.customize, { items:my.scene.customize.items.map(i => 'item:' + i.id === x.click && 'toggle' in i ? Object.assign({}, i, { toggle:!i.toggle }) : i) }) });
    }
    if (x.click) my.scene = SIM.autoClick(my.scene, x.click);
    if (x.then) my.scene = SIM.patch(my.scene, x.then);
    my.k++; my.wrong = 0;
    if (my.k >= st.steps.length){
      my.done = true; S.rec.set(S.i, { done:true });
      tell((x.say ? x.say + ' ' : '') + (st.end ? `<b>${st.end}</b>` : ''), 'ok');
      btn.disabled = false; btn.classList.remove('ready'); void btn.offsetWidth; btn.classList.add('ready'); SFX.right(); buzz(15);
    } else { if (x.say) tell(x.say); else say.replaceChildren(); SFX.pick(); buzz(8); }
    draw();
  }
  /* 글을 칸에 한 글자씩 쳐 넣는 모습 */
  function typeIt(){
    const x = cur(); if (!x || x.type == null || my.typing) return;
    my.typing = true;
    const chars = [...x.type]; let n = 0;
    const per = Math.max(1, Math.ceil(chars.length / 32));   // 긴 부탁도 0.8초 안에 다 쳐진다
    const tick = () => {
      if (!S || S.queue[S.i] !== st){ return; }
      n = Math.min(chars.length, n + per); const sc = SIM.typeInto(my.scene, x.into, chars.slice(0, n).join(''));
      if (sc){ const keep = my.scene; my.scene = sc; draw(); my.scene = keep; }
      if (n < chars.length) setTimeout(tick, Math.max(22, 360 / chars.length)); else { my.typing = false; advance(); }
    };
    tick();
  }
  function hit(kind, t){
    if (my.done) return;
    const x = cur();
    if (kind === 'key' && x.key && t == null) return advance();
    if (kind === 'click' && x.click === t) return advance();
    if (kind === 'type' && x.type != null && t === x.into) return typeIt();
    my.wrong++;
    const what = kind === 'key' ? t : `<b>${TNAME(t)}</b>`;
    tell(`${kind === 'key' ? `<kbd>${what}</kbd>를 눌렀어요.` : `${what}을(를) 눌렀어요.`} 지금 할 일은 “${x.goal}”예요.${my.wrong > 1 ? ' 막히면 <b>힌트</b>를 눌러 봐요.' : ''}`, 'no');
    buzz(20);
  }
  function hint(){
    const x = cur(); if (!x) return;
    const glow = sel => { const el = holder.querySelector(sel); if (el){ el.classList.remove('glow'); void el.offsetWidth; el.classList.add('glow'); el.scrollIntoView({ block:'nearest' }); } };
    if (x.key){ tell(x.hint || `키보드에서 <kbd>${x.key}</kbd>를 함께 눌러요. 휴대폰이면 아래 글쇠 버튼을 눌러요.`); glow('.keybtn'); bar.querySelector('.keybtn')?.classList.add('glow'); }
    else if (x.click){ tell(x.hint || `반짝이는 <b>${TNAME(x.click)}</b>을(를) 눌러요.`); glow(`[data-t="${CSS.escape(x.click)}"]`); }
    else { tell(x.hint || '반짝이는 입력칸을 누르면 글이 저절로 쳐져요.'); glow(`[data-type="${CSS.escape(x.into)}"]`); }
  }
  function restart(){ S.rec.delete(S.i); my.k = 0; my.scene = st.scene; my.done = false; my.wrong = 0; say.replaceChildren(); btn.disabled = true; draw(); }
  holder.addEventListener('click', e => {
    const f = e.target.closest('[data-type]'); if (f && holder.contains(f)){ hit('type', f.dataset.type); return; }
    const b = e.target.closest('[data-t]'); if (b && holder.contains(b)) hit('click', b.dataset.t);
  });
  S.simKey = e => {
    if (my.done || !cur()) return false;
    const c = SIM.fromEvent(e, OS()); if (!c) return false;
    const x = cur();
    if (x.key && SIM.same(c, x.key)){ e.preventDefault(); hit('key'); return true; }
    if (c === 'esc' || (c === 'tab' && x.key) || /^(mod|ctrl|alt)\+|\+(mod|ctrl|alt)\+/.test(c) || c.startsWith('shift+tab')){ e.preventDefault(); hit('key', c); return true; }
    return false;
  };
  if (my.done) tell(st.end ? `<b>${st.end}</b>` : '다 해 봤어요.', 'ok');
  draw();
  const pc = isPC();   // PC: 왼쪽 칸에 할 일·안내, 오른쪽은 넓은 모의 화면 / 휴대폰: 화면 바로 아래에 안내
  layout([h('div', { class:'kicker' }, pill('모의 화면'), winPill, h('span', { class:'how' }, pc ? '진짜처럼 키를 누르고 화면을 눌러요' : '화면과 글쇠 버튼을 눌러요')),
      h('h2', null, rich(st.h)), h('p', { html:st.p }), ...(pc ? [goals, bar, say] : [])],
    pc ? [holder] : [bar, holder, say]);
  app.querySelector('.stage')?.classList.add('simstage');
  setDock(nav(btn));
}

/* ============ 진짜 실습 미션(업스테이지 콘솔·Cursor) ============ */
store.mission = store.mission || {};   // '단원:M1' → { t:[체크], memo, at }
function missionView(u, it){
  const k = pkey(u, it);
  const m = store.mission[k] = store.mission[k] || { t:[], memo:'' };
  S = { u, it, queue:[], i:0, maxI:0, rec:new Map(), first:new Map(), dir:'zoom', mission:true };
  document.body.classList.add('playing');
  const doneN = () => it.tasks.filter((_, i) => m.t[i]).length;
  const meter = h('div', { class:'mmeter' });
  const btn = primary('', () => complete());
  const refresh = () => { const n = doneN();
    meter.replaceChildren(h('div', { class:'meter' }, h('i', { style:`width:${n / it.tasks.length * 100}%` })), h('span', null, `${n} / ${it.tasks.length} 해 봤어요`));
    btn.firstChild.textContent = store.done[k] ? '목록으로' : n === it.tasks.length ? '미션 완료!' : n ? `완료로 표시 (${n}/${it.tasks.length})` : '해 본 것을 체크해요';
    btn.disabled = !store.done[k] && !n; };
  const copy = async (text, b) => { try { await navigator.clipboard.writeText(text); b.textContent = '복사했어요 ✓'; } catch { b.textContent = '길게 눌러 복사해요'; } setTimeout(() => { b.textContent = '부탁 복사'; }, 1800); };
  const list = h('ol', { class:'mtasks' }, it.tasks.map((t, i) => {
    const cb = h('input', { type:'checkbox', id:`mt${i}`, checked:!!m.t[i], onchange:() => { m.t[i] = cb.checked; m.at = Date.now(); save(); refresh(); if (cb.checked){ SFX.pick(); buzz(8); } } });
    return h('li', { class:'mtask' },
      h('label', { for:`mt${i}`, class:'mhead' }, cb, h('span', { class:'mbox', 'aria-hidden':'true' }), h('span', { html:t.do })),
      t.how ? h('p', { class:'mhow', html:t.how }) : null,
      t.prompt ? h('div', { class:'mprompt' }, h('pre', null, t.prompt), h('button', { class:'ghost btn sm', type:'button', onclick:e => copy(t.prompt, e.currentTarget) }, '부탁 복사')) : null,
      h('p', { class:'mcheck' }, h('b', null, '확인: '), h('span', { html:t.check })));
  }));
  const memo = h('textarea', { rows:2, placeholder:'한 줄 메모(어느 프로젝트에서 했는지, 막힌 점 등)', 'aria-label':'미션 메모' });
  memo.value = m.memo || '';
  memo.addEventListener('input', () => { m.memo = memo.value; save(); });
  function complete(){
    if (store.done[k]) return renderHome({ back:true });
    store.done[k] = { done:true, n:doneN() }; delete store.pos[k]; save(); markToday(); SFX.fanfare(); buzz(15);
    toast('미션 완료! 직접 해 본 건 오래 남아요');
    renderHome({ back:true });
  }
  layout([h('div', { class:'kicker' }, pill('진짜 실습 미션'), h('span', { class:'how' }, it.where)),
      h('h2', null, rich(it.title)), h('p', { html:it.intro }), meter, it.note ? h('div', { class:'tip', html:it.note }) : null,
      h('label', { class:'inbox' }, '메모', memo)],
    [list]);
  refresh();
  setDock(h('div', { class:'navrow' }, h('button', { class:'ghost btn prev', onclick:() => renderHome({ back:true }) }, '‹ 목록'), btn));
}

/* ============ 이미 알아요: 3문제 다 맞히면 레슨·퀴즈를 건너뛴다 ============ */
async function startSkip(u){
  if (needsLoad(u)){ try { await loadUnit(u); } catch { toast('단원을 불러오지 못했어요.'); return; } }
  const CI = { id:'K0', type:'check', title:'이미 알아요 점검', sub:'', min:2, steps:u.skip };
  start(u, CI);
}
const skippable = u => u.skip && u.items.filter(it => it.type === 'lesson' || it.type === 'quiz').every(it => !store.done[pkey(u, it)] && !store.pos[pkey(u, it)]);

/* ============ 위 메뉴: 배우기 · 연수 지도 · 찾아보기 · 미션 보드 ============ */
const GUIDE = HANIP.g || [];
const TABS = [['learn', '배우기'], ['map', '연수 지도'], ['guide', '찾아보기'], ['missions', '미션 보드']];
const curTab = () => TABS.some(t => t[0] === store.tab) ? store.tab : 'learn';
function tabBar(){
  return h('nav', { class:'tabs seg-ctl', 'aria-label':'메뉴' }, TABS.map(([k, t]) => h('button', { class:curTab() === k ? 'on' : '', 'aria-current':curTab() === k ? 'page' : null,
    onclick:() => { if (curTab() === k) return; store.tab = k; save(); renderHome(); window.scrollTo(0, 0); } }, t)));
}
const DAY = 864e5, stale = d => d && (Date.now() - Date.parse(d + 'T00:00:00')) / DAY > 60;
const checkedTag = d => h('small', { class:'gchk' + (stale(d) ? ' old' : '') }, stale(d) ? `확인 필요 · ${d}` : `${d} 확인`);
const plain = s => String(s || '').replace(/<[^>]+>/g, ' ');
function openUnit(id){
  const u = UNITS.find(x => x.id === id); if (!u) return;
  store.tab = 'learn'; store.unit = u.id; store.course = u.course; store.open = { c:u.course, u:u.id }; save();
  renderHome({ focus:'u:' + u.id }); if (isPC()) window.scrollTo(0, 0);
}
const unitLink = id => { const u = UNITS.find(x => x.id === id); return u ? h('button', { class:'linkbtn glink', onclick:() => openUnit(id) }, `${u.course.split(' · ')[0]} · ${u.title}`) : null; };
const srcLink = src => src ? h('a', { class:'glink', href:src, target:'_blank', rel:'noopener' }, '공식 문서 ↗') : null;

function guideView(){
  const CATS = ['전체', '모델', 'API', '콘솔', '코드', '문제 해결', '용어'];
  const st = store.gv = store.gv || { cat:'전체', q:'', sheet:false };
  if (!CATS.includes(st.cat)) st.cat = '전체';
  const q = h('input', { id:'guide-q', type:'search', placeholder:'예: temperature, 임베딩, 401, Document Parse', 'aria-label':'찾아보기 검색', value:st.q || '' });
  const chips = h('div', { class:'gchips', role:'tablist' });
  const out = h('div', { class:'glist' });
  const hay = x => [x.title, ...(x.aka || []), plain(x.what), plain(x.where), x.code || '', ...(x.keys || []).flatMap(k => [k, SIM.label(k, 'mac'), SIM.label(k, 'win')])].join(' ').toLowerCase();
  const card = x => h('article', { class:'gcard' },
    h('header', null, h('h3', null, x.title), h('div', { class:'gpills' }, pill(x.cat))),
    x.keys && x.keys.length ? h('div', { class:'gkeys' }, x.keys.map(k => combo(k))) : null,
    h('p', { html:x.what }),
    x.code ? codeBlock(x.code, x.lang || 'py') : null,
    x.where ? h('p', { class:'gwhere' }, h('b', null, '어디서: '), h('span', { html:x.where })) : null,
    h('footer', null, x.lesson ? unitLink(x.lesson) : null, srcLink(x.src), checkedTag(x.checked)));
  const sheet = list => {
    const rows = list.filter(x => x.code);
    return rows.length ? h('div', { class:'gsheet' }, rows.map(x => h('section', null, h('h3', null, x.title), codeBlock(x.code, x.lang || 'py'))))
      : h('div', { class:'gempty' }, h('b', null, '코드 조각이 있는 항목이 없어요.'));
  };
  const draw = () => {
    const words = (st.q || '').toLowerCase().split(/\s+/).filter(Boolean);
    const list = GUIDE.filter(x => (st.cat === '전체' || x.cat === st.cat) && words.every(w => hay(x).includes(w)));
    chips.replaceChildren(...CATS.map(c => h('button', { class:'chip2 btn' + (st.cat === c ? ' on' : ''), role:'tab', 'aria-selected':String(st.cat === c), onclick:() => { st.cat = c; save(); draw(); } },
      c, h('small', null, String(c === '전체' ? GUIDE.length : GUIDE.filter(x => x.cat === c).length)))));
    if (!GUIDE.length) return out.replaceChildren(h('p', { class:'hint' }, '찾아보기 항목을 준비하고 있어요.'));
    out.replaceChildren(st.sheet ? sheet(list) : list.length ? h('div', { class:'gcards' }, list.map(card))
      : h('div', { class:'gempty' }, h('b', null, `“${st.q}”와 맞는 항목이 없어요.`), h('p', null, '다른 말(영어 이름, 모델 이름)로 찾거나 분류를 ‘전체’로 바꿔 보세요.')));
  };
  q.addEventListener('input', () => { st.q = q.value; save(); draw(); });
  const sheetBtn = h('div', { class:'seg-ctl' }, [['카드로 보기', false], ['코드 한 장', true]].map(([t, v]) => h('button', { class:!!st.sheet === v ? 'on' : '', onclick:() => { st.sheet = v; save(); renderHome({ keep:true }); } }, t)));
  draw();
  return { side:h('section', { class:'panel' }, h('h2', null, '찾아보기'), h('p', { class:'hint' }, `모델·API·콘솔·코드·문제 해결·용어 ${GUIDE.length}개. ‘코드 한 장’은 바로 베껴 쓸 파이썬 조각만 모아 보여요.`), sheetBtn),
    main:[h('div', { class:'gsearch' }, q, chips), out] };
}

function missionsView(){
  const list = [];
  UNITS.forEach(u => u.items.forEach(it => { if (it.type === 'mission') list.push([u, it]); }));
  const k = (u, it) => pkey(u, it);
  const doneN = list.filter(([u, it]) => store.done[k(u, it)]).length;
  const card = ([u, it]) => {
    const m = store.mission[k(u, it)], n = m ? m.t.filter(Boolean).length : 0, done = !!store.done[k(u, it)];
    const state = done ? ['완료', 'good'] : n ? [`${n}${it.tasks ? '/' + it.tasks : ''} 하는 중`, 'warm'] : ['아직', ''];
    return h('button', { class:'mcard btn' + (done ? ' done' : ''), onclick:() => start(u, it) },
      h('span', { class:'mstate ' + state[1] }, state[0]),
      h('span', { class:'mtx' }, h('small', null, `${u.course.split(' · ')[0]} · ${u.title}`), h('b', null, it.title), it.where ? h('small', null, it.where) : null,
        m && m.memo ? h('em', null, '메모: ' + m.memo) : null));
  };
  return { side:h('section', { class:'panel' }, h('h2', null, '미션 보드'), h('p', { class:'hint' }, '단원마다 진짜 업스테이지 콘솔과 내 Cursor로 해 보는 미션이에요. 연수 전에 해 두면 실습이 훨씬 빨라요.'),
      h('div', { class:'meter', 'aria-hidden':'true' }, h('i', { style:`width:${list.length ? doneN / list.length * 100 : 0}%` })), h('div', { class:'meter-label' }, h('span', null, '완료한 미션'), h('span', null, `${doneN} / ${list.length}`))),
    main:COURSES.map(c => { const cs = list.filter(([u]) => u.course === c); return cs.length ? h('section', { class:'mgroup' }, h('h3', null, c), h('div', { class:'mcards' }, cs.map(card))) : null; }) };
}

/* ============ 연수 지도: 기반연수 차시마다 대비 단원을 잇는다 ============ */
function unitChip(id){
  const u = UNITS.find(x => x.id === id); if (!u) return null;
  const d = doneCount(u), n = u.items.length, state = d === n ? 'done' : d ? 'doing' : '';
  return h('button', { class:'uchip btn' + (state ? ' ' + state : ''), onclick:() => openUnit(id), title:`${u.course} · ${u.title}` },
    h('i', { 'aria-hidden':'true' }, state === 'done' ? '✓' : `${courseNo(u.course)}-${unitNo(u)}`), h('span', null, unitName(u)), state === 'doing' ? h('small', null, `${d}/${n}`) : null);
}
const unitsReady = ids => { const us = [...new Set(ids)].map(id => UNITS.find(u => u.id === id)).filter(Boolean); return [us.filter(u => doneCount(u) === u.items.length).length, us.length]; };
function mapView(){
  const T = TRAINING, track = store.track == null ? T.myTrack : store.track;
  const meter = (label, [d, n]) => h('div', null, h('div', { class:'meter', 'aria-hidden':'true' }, h('i', { style:`width:${n ? d / n * 100 : 0}%` })), h('div', { class:'meter-label' }, h('span', null, label), h('span', null, `${d} / ${n} 단원`)));
  const day1 = T.days[0], day2 = T.days[1];
  const ids1 = day1.rows.flatMap(r => r.units), idsA = day2.rows.flatMap(r => r.ua), idsB = day2.rows.flatMap(r => r.ub);
  const prepDone = T.prep.filter(p => store.prep[p.id]).length;
  const prepList = h('ul', { class:'prep' }, T.prep.map(p => {
    const cb = h('input', { type:'checkbox', id:'prep-' + p.id, checked:!!store.prep[p.id], onchange:() => { if (cb.checked) store.prep[p.id] = true; else delete store.prep[p.id]; save(); if (cb.checked){ SFX.pick(); buzz(8); } renderHome({ keep:true }); } });
    return h('li', null, h('label', { for:'prep-' + p.id, class:'mhead' }, cb, h('span', { class:'mbox', 'aria-hidden':'true' }), h('span', null, p.t)), p.unit ? h('div', { class:'prep-u' }, unitChip(p.unit)) : null);
  }));
  const side = h('section', { class:'panel' }, h('h2', null, '연수 지도'),
    h('p', { class:'hint' }, `${T.by} ${T.title}. ${T.kind}. 차시마다 미리 해 두면 좋은 단원을 이어 놨어요.`),
    meter('1일차 대비', unitsReady(ids1)),
    track === 'B' ? meter('2일차 트랙 B 대비', unitsReady(idsB)) : meter('2일차 트랙 A 대비', unitsReady(idsA)),
    h('div', { class:'side-label' }, '내 2일차 트랙'),
    h('div', { class:'seg-ctl' }, [['트랙 A', 'A'], ['트랙 B', 'B']].map(([t, v]) => h('button', { class:track === v ? 'on' : '', onclick:() => { store.track = v; save(); renderHome({ keep:true }); } }, t))),
    h('p', { class:'hint' }, track === 'B' ? '트랙 B 단원(c4u4)은 선택 단원이에요. 앱은 트랙 A 중심으로 짜여 있어요.' : '트랙 A(파이썬 자동채점 + AI튜터)는 과정 4의 단원 1~3이 차례로 대비해요.'),
    h('div', { class:'side-label' }, `연수 전 준비물 ${prepDone}/${T.prep.length}`), prepList);
  const row1 = r => h('li', { class:'srow' + (r.prep ? ' prep-row' : '') },
    h('div', { class:'stime' }, h('b', null, r.time), r.len ? h('small', null, r.len) : null),
    h('div', { class:'sbody' }, h('b', { class:'stitle' }, wb(r.title)),
      r.units.length ? h('div', { class:'uchips' }, r.units.map(unitChip)) : h('small', { class:'hint' }, '왼쪽(휴대폰은 위) 준비물 체크리스트를 미리 끝내 두면 편해요.')));
  const row2 = r => h('li', { class:'srow' },
    h('div', { class:'stime' }, h('b', null, r.time)),
    h('div', { class:'sbody' }, h('small', { class:'stheme' }, wb(r.title)),
      h('div', { class:'tracks' }, ...(track === 'B' ? [['B', r.b, r.ub], ['A', r.a, r.ua]] : [['A', r.a, r.ua], ['B', r.b, r.ub]]).map(([k, t, us], i) =>
        h('div', { class:'trk' + (i ? ' dim' : ' mine') }, h('span', { class:'tname' }, `트랙 ${k}${i ? '' : ' · 내 반'}`), h('b', null, t), i ? null : h('div', { class:'uchips' }, us.map(unitChip)))))));
  const day = (d, rows) => h('section', { class:'panel tday' }, h('div', { class:'eyebrow' }, `${d.name} · ${d.hours}`), h('h2', null, d.sub), h('ol', { class:'sched' }, rows));
  const main = [day(day1, day1.rows.map(row1)), day(day2, day2.rows.map(row2)),
    h('section', { class:'panel tday' }, h('div', { class:'eyebrow' }, '그다음'), h('h2', null, T.after.title), h('p', { class:'hint' }, T.after.p), h('div', { class:'uchips' }, T.after.units.map(unitChip)))];
  return { side, main };
}
function renderTab(opt = {}){
  const tab = curTab();
  const v = tab === 'guide' ? guideView() : tab === 'missions' ? missionsView() : mapView();
  const old = document.querySelector('.home');
  const y = opt.keep && old ? scrollY : 0;
  const home = h('div', { class:'wrap home tabview' + (opt.keep ? ' static' : '') }, brandEl(), h('div', { class:'side' }, tabBar(), v.side), h('div', { class:'mainc' }, v.main));
  app.replaceChildren(home);
  window.scrollTo(0, y);
}
