/* ============ 모의 화면(Cursor·업스테이지 콘솔·웹앱): 화면 없이 하는 계산(앱과 check-unit.js가 함께 씀) ============
   단축키는 'mod+shift+p'처럼 쓴다. mod = 맥 ⌘ / 윈도우 Ctrl. ctrl은 맥에서도 ⌃(Control) 그대로.
   장면(scene)은 화면에 보일 것만 적은 객체이고, 단계마다 then으로 몇 칸만 바꾼다(null이면 지움). */
const SIM = (() => {
  const SPECIAL = { enter:['Return', 'Enter'], tab:['Tab', 'Tab'], esc:['Esc', 'Esc'], space:['Space', 'Space'], backspace:['⌫', 'Backspace'],
    up:['↑', '↑'], down:['↓', '↓'], left:['←', '←'], right:['→', '→'] };
  const MAC = { ctrl:'⌃', alt:'⌥', shift:'⇧', mod:'⌘' };
  const WIN = { ctrl:'Ctrl', alt:'Alt', shift:'Shift', mod:'Ctrl' };
  const ORDER = ['mod', 'ctrl', 'alt', 'shift'];   // 문서 표기 순서(Cmd Shift P, Ctrl+Shift+P)
  const KEY_RE = /^((mod|ctrl|alt|shift)\+)*([a-z0-9]|enter|tab|esc|space|backspace|up|down|left|right|[/.,;[\]\\`='-])$/;
  const valid = combo => KEY_RE.test(String(combo).toLowerCase()) || /^(mod|ctrl|alt|shift)$/.test(String(combo).toLowerCase());   // 조합키 하나만(예: Option+클릭의 Option)도 글쇠로
  function parse(combo){
    const parts = String(combo).toLowerCase().split('+');
    const key = parts.pop();
    return { mods:ORDER.filter(m => parts.includes(m)), key };
  }
  /* 화면에 보일 글쇠 목록: 맥 ['⌘','⇧','P'], 윈도우 ['Ctrl','Shift','P'] */
  function caps(combo, os){
    const { mods, key } = parse(combo), mac = os !== 'win';
    const names = mac ? MAC : WIN;
    let ms = mods.map(m => names[m]);
    if (!mac) ms = ms.filter((m, i) => ms.indexOf(m) === i);   // 윈도우에서 ctrl+mod가 겹치면 하나만
    const k = names[key] || (SPECIAL[key] ? SPECIAL[key][mac ? 0 : 1] : key.toUpperCase());
    return [...ms, k];
  }
  const label = (combo, os) => caps(combo, os).join(os === 'win' ? '+' : '');
  /* 키보드 사건 → 'mod+shift+p' (한글 입력 중에도 맞게 e.code로 읽는다) */
  const CODE = { Slash:'/', Period:'.', Comma:',', Semicolon:';', BracketLeft:'[', BracketRight:']', Backslash:'\\', Backquote:'`', Equal:'=', Minus:'-', Quote:"'",
    Enter:'enter', NumpadEnter:'enter', Tab:'tab', Escape:'esc', Space:'space', Backspace:'backspace', ArrowUp:'up', ArrowDown:'down', ArrowLeft:'left', ArrowRight:'right' };
  function fromEvent(e, os){
    let key = CODE[e.code];
    if (!key && /^Key[A-Z]$/.test(e.code)) key = e.code.slice(3).toLowerCase();
    if (!key && /^Digit\d$/.test(e.code)) key = e.code.slice(5);
    if (!key) return null;
    const mac = os !== 'win', mods = [];
    if (mac){ if (e.ctrlKey) mods.push('ctrl'); if (e.altKey) mods.push('alt'); if (e.shiftKey) mods.push('shift'); if (e.metaKey) mods.push('mod'); }
    else { if (e.altKey) mods.push('alt'); if (e.shiftKey) mods.push('shift'); if (e.ctrlKey || e.metaKey) mods.push('mod'); }
    return [...mods, key].join('+');
  }
  /* 너그럽게 맞추기: 맥 설정인데 Ctrl을 눌렀거나, 윈도우 설정인데 ⌘를 눌러도 mod로 본다 */
  function same(a, b){
    if (!a || !b) return false;
    const x = parse(a), y = parse(b);
    const norm = m => m.map(v => v === 'ctrl' ? 'mod' : v).filter((v, i, arr) => arr.indexOf(v) === i).sort().join();
    return x.key === y.key && (x.mods.join() === y.mods.join() || norm(x.mods) === norm(y.mods));
  }
  const hasMod = combo => /(^|\+)(mod|ctrl|alt)\+/.test(combo) || /^(tab|esc|enter|shift\+tab)$/.test(combo);

  /* 웹 창(win:'web')의 블록 목록: 대화 상자가 떠 있으면 그 안만 누를 수 있다 */
  const blockLists = sc => sc.dlg ? [sc.dlg.blocks || []] : [sc.blocks || [], sc.aside || []];
  const allBlocks = sc => [...(sc.blocks || []), ...(sc.aside || []), ...((sc.dlg && sc.dlg.blocks) || [])];
  /* set:{ id:값 } → 같은 id의 field·select 값, toggle 켜짐, tabs·files 고른 것을 바꾼다 */
  function setVals(sc, vals){
    const one = b => { if (!b || b.id == null || !(b.id in vals)) return b; const v = vals[b.id];
      if (b.k === 'toggle') return Object.assign({}, b, { on:!!v });
      if (b.k === 'tabs' || b.k === 'files') return Object.assign({}, b, { on:v });
      if (b.k === 'page') return Object.assign({}, b, { els:(b.els || []).map((e, i) => Object.assign({}, e, { on:i + 1 === +v })) });
      return Object.assign({}, b, { value:v }); };
    const s = Object.assign({}, sc);
    if (s.blocks) s.blocks = s.blocks.map(one);
    if (s.aside) s.aside = s.aside.map(one);
    if (s.dlg && s.dlg.blocks) s.dlg = Object.assign({}, s.dlg, { blocks:s.dlg.blocks.map(one) });
    return s;
  }
  /* 장면 바꾸기: 한 칸씩 통째로 바꾸고, null이면 지운다. set은 블록 값만 바꾼다 */
  function patch(scene, p){
    let s = Object.assign({}, scene);
    for (const [k, v] of Object.entries(p || {})){ if (k === 'set') continue; if (v === null) delete s[k]; else s[k] = v; }
    if (p && p.set) s = setVals(s, p.set);
    return s;
  }
  /* 누르면 저절로 바뀌는 것: 스위치(tog:)는 켜고 끄기, 탭(tab:)·파일(file:)·문서 요소(el:)는 고르기(블록에 id가 있을 때) */
  function autoClick(sc, t){
    if (sc.win !== 'web') return sc;
    const [k, v] = [t.slice(0, t.indexOf(':')), t.slice(t.indexOf(':') + 1)];
    for (const list of blockLists(sc)) for (const b of list){
      if (k === 'tog' && b.k === 'toggle' && b.id === v) return setVals(sc, { [b.id]:!b.on });
      if (k === 'tab' && b.k === 'tabs' && (b.items || []).includes(v) && b.id != null) return setVals(sc, { [b.id]:v });
      if (k === 'file' && b.k === 'files' && (b.items || []).includes(v) && b.id != null) return setVals(sc, { [b.id]:v });
      if (k === 'el' && b.k === 'page' && b.pick && b.id != null) return setVals(sc, { [b.id]:+v });
    }
    return sc;
  }
  /* 웹 창 블록에서 누를 수 있는 곳 */
  function blockTargets(list, add){
    list.forEach(b => {
      (b.btns || []).forEach(x => add('b:' + x));
      if (b.k === 'select') add('sel:' + b.id);
      if (b.k === 'toggle') add('tog:' + b.id);
      if (b.k === 'tabs') (b.items || []).forEach(x => add('tab:' + x));
      if (b.k === 'files') (b.items || []).forEach(x => add('file:' + x));
      if (b.k === 'table' && b.pick) (b.rows || []).forEach(r => add('row:' + String(r[0]).replace(/<[^>]+>/g, '')));
      if (b.k === 'cards') (b.items || []).forEach(c => add('card:' + c.id));
      if (b.k === 'page' && b.pick) (b.els || []).forEach((e, i) => add('el:' + (i + 1)));
      if (b.k === 'chat') add('btn:send');
      if (b.k === 'secret' && b.btn) add('b:' + b.btn);
    });
  }
  const lc = s => String(s).toLowerCase();
  const palItems = pal => (pal.items || []).filter(t => !pal.q || lc(t).includes(lc(pal.q)));
  /* 지금 장면에서 누를 수 있는 곳의 이름 목록(검사기와 화면이 같은 이름을 쓴다) */
  function targets(sc){
    const t = [];
    const add = (...a) => t.push(...a);
    if (sc.win === 'web'){
      if (!sc.dlg) (sc.nav || []).forEach(n => add('nav:' + (typeof n === 'string' ? n : n.name)));
      blockLists(sc).forEach(list => blockTargets(list, add));
      if (sc.dlg) add('btn:close');
    } else if (sc.win === 'agents'){
      add('btn:new-agent', 'side:customize', 'side:settings');
      (sc.agents || []).forEach(a => add('agent:' + a.title));
      (sc.changes || []).forEach(c => add('file:' + c.file));
      (sc.changeBtns || []).forEach(b => add('chg:' + b));
    } else if (sc.win === 'term'){
    } else {
      add('side:explorer', 'side:search', 'side:extensions');
      (sc.files || []).forEach(f => add('file:' + f));
    }
    if (sc.panel){
      add('btn:send', 'btn:mode', 'btn:model');
      if (sc.panel.env) add('btn:env');
      (sc.panel.msgs || []).forEach(m => { if (m.checkpoint) add('btn:restore'); if (m.run) add('btn:run', 'btn:skip'); (m.btns || []).forEach(b => add('msg:' + b)); });
    }
    if (sc.diff) add('btn:accept', 'btn:reject');
    if (sc.browser) (sc.browser.links || []).forEach(l => add('web:' + l));
    if (sc.menu) (sc.menu.items || []).forEach(i => add('menu:' + i));
    if (sc.palette) palItems(sc.palette).forEach(i => add('pal:' + i));
    if (sc.settings){ (sc.settings.nav || []).forEach(n => add('nav:' + n)); (sc.settings.rows || []).forEach(r => add('set:' + r.id)); add('btn:close'); }
    if (sc.customize){
      (sc.customize.nav || []).forEach(n => add('nav:' + n));
      if (sc.customize.page === 'Rules') add('btn:add-rule');
      else (sc.customize.items || []).forEach(i => { if (i.button || 'toggle' in i) add('item:' + i.id); });
      add('btn:close');
    }
    return t;
  }
  /* type 단계가 글을 넣는 칸: palette → 명령 팔레트, chat → 에이전트 입력칸(웹 창은 chat 블록), inline → ⌘K 상자, rule → Customize → Rules의 User Rules 칸, term → 터미널 맨 아래 $ 줄, f:<id> → 웹 창의 field 블록 */
  function typeInto(sc, into, text){
    if (into === 'palette' && sc.palette) return patch(sc, { palette:Object.assign({}, sc.palette, { q:text }) });
    if (into === 'chat' && sc.panel) return patch(sc, { panel:Object.assign({}, sc.panel, { input:text }) });
    if (into === 'inline' && sc.inline) return patch(sc, { inline:Object.assign({}, sc.inline, { text }) });
    if (into === 'rule' && sc.customize && sc.customize.page === 'Rules') return patch(sc, { customize:Object.assign({}, sc.customize, { user:text }) });
    if (into === 'term' && sc.term) return patch(sc, { prompt:text });
    if (sc.win === 'web'){
      const lists = blockLists(sc).flat();
      if (into === 'chat' && lists.some(b => b.k === 'chat')){
        const put = b => b.k === 'chat' ? Object.assign({}, b, { input:text }) : b;
        const s = Object.assign({}, sc);
        if (s.dlg) s.dlg = Object.assign({}, s.dlg, { blocks:s.dlg.blocks.map(put) }); else { if (s.blocks) s.blocks = s.blocks.map(put); if (s.aside) s.aside = s.aside.map(put); }
        return s;
      }
      if (/^f:/.test(into) && lists.some(b => b.k === 'field' && b.id === into.slice(2))) return setVals(sc, { [into.slice(2)]:text });
    }
    return null;
  }
  const BLOCKS = ['h', 'p', 'btns', 'field', 'select', 'toggle', 'chat', 'tabs', 'code', 'table', 'files', 'kv', 'note', 'secret', 'cards', 'page', 'steps'];
  return { valid, parse, caps, label, fromEvent, same, hasMod, patch, targets, typeInto, palItems, autoClick, allBlocks, BLOCKS };
})();
if (typeof module !== 'undefined') module.exports = SIM;
