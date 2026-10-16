// 사용법: node check-unit.js units/c1u1.js
const path = require('path');
const file = process.argv[2];
if (!file) { console.log('사용법: node check-unit.js units/<id>.js'); process.exit(1); }
let U = null;
const SIM = require('./src/simcore.js');
const fs = require('fs'), cp = require('child_process');
// 앱의 파이썬 연습장 실행기(연습장 try lang:'py' 코드가 앱에서도 도는지 본다)
const PYSRC = fs.readFileSync(path.join(__dirname, 'src/pyrun.js'), 'utf8');
const miniPy = (code, ans) => { const PY = new Function(PYSRC + '\nreturn __hanipPy;')()(); let out = ''; let e = ''; try { e = PY.run(code, ans || [], s => { out += s; }); } catch (x) { e = 'RuntimeError: ' + x.message; } return { out, err:e || '' }; };
const realPy = (code, ans) => { try { const r = cp.spawnSync('python3', ['-c', code], { input:(ans || []).join('\n') + '\n', encoding:'utf8', timeout:5000 }); return r.error ? null : { out:r.stdout, err:r.stderr }; } catch { return null; } };
// 근거로 삼을 수 있는 공식 주소
const SRC_OK = /^https:\/\/(console\.upstage\.ai|www\.upstage\.ai|upstage\.ai|github\.com\/UpstageAI|pypi\.org|docs\.python\.org|docs\.streamlit\.io|streamlit\.io|cursor\.com|github\.com\/openai\/openai-python|python\.langchain\.com|docs\.langchain\.com|www\.moe\.go\.kr|moe\.go\.kr|www\.msit\.go\.kr|msit\.go\.kr|www\.keris\.or\.kr|keris\.or\.kr|www\.korea\.kr|korea\.kr|www\.pipc\.go\.kr|pipc\.go\.kr|www\.kces\.or\.kr|kces\.or\.kr)(\/|$)/;
global.HANIP = { unit(u) { if (U) err('HANIP.unit를 두 번 불렀어요'); U = u; } };
const errors = [], warns = [];
const err = m => errors.push(m), warn = m => warns.push(m);
try { require(path.resolve(file)); } catch (e) { console.log('ERROR 파일을 읽지 못함: ' + e.stack); process.exit(1); }
if (!U) { console.log('ERROR HANIP.unit(...)이 없어요'); process.exit(1); }

const COLORS = ['ink','ink2','soft','line','paper','accent','hi','warm','good','bad','pink','sky','k','s','n','t'];
const MOODS = ['happy','smile','sad','wow','wink','sleepy','dizzy','proud'];

// ---------- 그림 검사 ----------
function charW(ch, size, mono) {
  if (ch === ' ') return size * 0.3;
  if (/[ᄀ-ᇿ　-鿿가-힯＀-￯]/.test(ch)) return size * 0.95;
  return size * (mono ? 0.55 : 0.5);
}
function checkFig(name, f) {
  const where = `그림 ${name}`;
  if (!f || typeof f.draw !== 'function') return err(`${where}: draw 함수가 없어요`);
  if (!(f.w > 0 && f.h > 0)) err(`${where}: w, h가 필요해요`);
  if (!f.label) err(`${where}: label이 필요해요`);
  const boxes = [], texts = [];
  const col = (o, key) => { const c = o && o[key]; if (c != null && !COLORS.includes(c)) err(`${where}: 모르는 색 '${c}'`); };
  const opt = o => { col(o, 'c'); col(o, 'fill'); };
  const box = (x1, y1, x2, y2, what) => boxes.push({ x1: Math.min(x1, x2), y1: Math.min(y1, y2), x2: Math.max(x1, x2), y2: Math.max(y1, y2), what });
  const nums = (...a) => a.forEach(v => { if (typeof v !== 'number' || !isFinite(v)) err(`${where}: 숫자가 아닌 좌표 ${v}`); });
  const pathBox = d => {
    const t = String(d).match(/-?\d*\.?\d+(?:e-?\d+)?/g) || [];
    // 절대 좌표 명령만 대충 계산(M L Q C A H V). 상대 명령이 섞이면 건너뜀
    if (/[mlqcahvst]/.test(String(d).replace(/e-?\d/g, ''))) return;
    const n = t.map(Number); const xs = [], ys = [];
    for (let i = 0; i + 1 < n.length; i += 2) { xs.push(n[i]); ys.push(n[i + 1]); }
    if (xs.length) box(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), 'path');
  };
  const P = {
    rect(x, y, w, h, o) { nums(x, y, w, h); opt(o); box(x, y, x + w, y + h, 'rect'); },
    rrect(x, y, w, h, r, o) { nums(x, y, w, h, r); opt(o); box(x, y, x + w, y + h, 'rrect'); },
    circle(x, y, d, o) { nums(x, y, d); opt(o); box(x - d / 2, y - d / 2, x + d / 2, y + d / 2, 'circle'); },
    ellipse(x, y, w, h, o) { nums(x, y, w, h); opt(o); box(x - w / 2, y - h / 2, x + w / 2, y + h / 2, 'ellipse'); },
    line(a, b, c, d, o) { nums(a, b, c, d); opt(o); box(a, b, c, d, 'line'); },
    path(d, o) { opt(o); pathBox(d); },
    arrow(a, b, c, d, o) { nums(a, b, c, d); opt(o); box(a, b, c, d, 'arrow'); },
    curveArrow(a, b, cx, cy, c, d, o) { nums(a, b, cx, cy, c, d); opt(o); box(a, b, c, d, 'curveArrow'); },
    text(x, y, str, o = {}) {
      nums(x, y); col(o, 'c');
      if (typeof str !== 'string') return err(`${where}: text에 글자가 아님`);
      const size = o.size || 17;
      const w = [...str].reduce((s, ch) => s + charW(ch, size, o.mono), 0);
      const anchor = o.anchor || 'middle';
      const x1 = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2;
      const b = { x1, y1: y - size * 0.8, x2: x1 + w, y2: y + size * 0.22, what: `글자 "${str}"` };
      boxes.push(b); texts.push(b);
    },
    face(x, y, s, o = {}) { nums(x, y, s); if (o.mood && !MOODS.includes(o.mood)) err(`${where}: 모르는 표정 '${o.mood}'`); box(x - s / 2, y - s / 2, x + s / 2, y + s / 2, 'face'); },
    robot(x, y, s = 1, o = {}) { nums(x, y, s); if (o.mood && !MOODS.includes(o.mood)) err(`${where}: 모르는 표정 '${o.mood}'`); box(x - 50 * s, y - 60 * s, x + 50 * s, y + 60 * s, 'robot'); },
    bubble(x, y, w, h, tx, ty, o) { nums(x, y, w, h, tx, ty); opt(o); box(x, y, x + w, y + h, 'bubble'); box(tx, ty, tx, ty, 'bubble 꼬리'); },
    note(x, y, w, h, o) { nums(x, y, w, h); opt(o); box(x, y, x + w, y + h, 'note'); },
    sparkle(x, y, s = 8, c) { nums(x, y, s); col({ c }, 'c'); box(x - s, y - s, x + s, y + s, 'sparkle'); },
    heart(x, y, s = 8, c) { nums(x, y, s); col({ c }, 'c'); box(x - s, y - s, x + s, y + s, 'heart'); },
    drop(x, y, s = 8) { nums(x, y, s); box(x - s, y - s, x + s, y + s, 'drop'); },
    steam(x, y, s = 1, c) { nums(x, y, s); col({ c }, 'c'); box(x - 18 * s, y - 32 * s, x + 18 * s, y, 'steam'); },
  };
  try { f.draw(P); } catch (e) { return err(`${where}: 그리다가 오류 ${e.message}`); }
  const tol = 2;
  boxes.forEach(b => { if (b.x1 < -tol || b.y1 < -tol || b.x2 > f.w + tol || b.y2 > f.h + tol) warn(`${where}: ${b.what}이(가) 그림 밖으로 나가요 (${b.x1.toFixed(0)},${b.y1.toFixed(0)})-(${b.x2.toFixed(0)},${b.y2.toFixed(0)}), 크기 ${f.w}×${f.h}`); });
  for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
    const a = texts[i], b = texts[j];
    const ox = Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1), oy = Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1);
    if (ox > 3 && oy > 3) warn(`${where}: ${a.what}와 ${b.what}가 겹쳐요`);
  }
}

// ---------- 내용 검사 ----------
const figs = U.figs || {};
['id', 'course', 'title'].forEach(k => { if (!U[k]) err(`unit.${k}가 없어요`); });
if (!Array.isArray(U.goals) || U.goals.length !== 3) err('goals는 3개여야 해요');
Object.entries(figs).forEach(([n, f]) => checkFig(n, f));
const ORDER = [['L1', 'lesson'], ['L2', 'lesson'], ['QA', 'quiz'], ['L3', 'lesson'], ['L4', 'lesson'], ['QB', 'quiz'], ['L5', 'lesson'], ['M1', 'mission'], ['T1', 'test']];
const items = U.items || [];
if (items.length !== 9) err(`items는 9개여야 해요(지금 ${items.length}개)`);
if (!U.checked || !/^\d{4}-\d{2}-\d{2}$/.test(U.checked.date || '')) err(`checked: { date:'2026-10-16' } 모양이 필요해요(공식 문서를 확인한 날)`);
if (!Array.isArray(U.sources) || !U.sources.length) err('sources에 근거로 삼은 공식 문서 주소가 1개 이상 필요해요');
(U.sources || []).forEach(x => { if (!SRC_OK.test(x)) err(`sources '${x}'는 허용된 공식 주소가 아니에요(console.upstage.ai/docs, upstage.ai, github.com/UpstageAI, pypi.org, docs.python.org, docs.streamlit.io, cursor.com, 정부·학회 누리집)`); });
if (U.skip != null){
  if (!Array.isArray(U.skip) || U.skip.length !== 3) err('skip(이미 알아요 점검)은 문제 3개여야 해요');
}
ORDER.forEach(([id, type], i) => { const it = items[i]; if (!it || it.id !== id || it.type !== type) err(`items[${i}]는 {id:'${id}', type:'${type}'}여야 해요`); });
const usedFigs = new Set();
const stats = { say: 0, q: 0, try: 0, sim: 0, figs: Object.keys(figs).length };
const hasTagInHtml = s => /<(?!\/?(b|i|br|code|mark|small|sub|sup|kbd)\b)[a-z/!]/i.test(s.replace(/<\/?(b|i|br|code|mark|small|sub|sup|kbd)(\s[^>]*)?>/gi, ''));
function kbds(where, list){
  list.flat(3).forEach(t => { if (typeof t !== 'string') return;
    for (const m of t.matchAll(/<kbd>([^<]*)<\/kbd>/g)) if (!SIM.valid(m[1])) err(`${where}: <kbd>${m[1]}</kbd>는 단축키 모양이 아니에요(예: <kbd>mod+shift+p</kbd>)`);
    if (/⌘|⇧|⌥|Cmd\s*\+|Ctrl\s*\+/.test(t.replace(/<kbd>[^<]*<\/kbd>/g, ''))) warn(`${where}: 단축키는 <kbd>mod+shift+p</kbd>처럼 써야 맥·윈도우에 맞게 바뀌어요: ${t.slice(0, 60)}`); });
}
function checkSim(w, s){
  if (!s.scene || !['ide', 'agents', 'term', 'web'].includes(s.scene.win)) return err(`${w}: scene.win은 'ide', 'agents', 'term', 'web' 중 하나여야 해요`);
  const checkBlocks = (where, sc) => {
    if (sc.win !== 'web') return;
    const ids = new Set();
    SIM.allBlocks(sc).forEach((b, i) => {
      if (!b || !SIM.BLOCKS.includes(b.k)) return err(`${where}: 블록 ${i + 1}의 k '${b && b.k}'를 몰라요(${SIM.BLOCKS.join(', ')})`);
      if (['field', 'select', 'toggle'].includes(b.k)){ if (b.id == null) err(`${where}: ${b.k} 블록에는 id가 필요해요`); else if (ids.has(b.id)) err(`${where}: 블록 id '${b.id}'가 겹쳐요`); ids.add(b.id); }
      if (b.k === 'cards') (b.items || []).forEach(c => { if (!c.id || !c.title) err(`${where}: cards 항목에는 id와 title이 필요해요`); });
      if (b.k === 'code' && b.lang && !['py', 'json', 'md', 'html', 'sh', 'plain', 'err', 'js'].includes(b.lang)) err(`${where}: code 블록 lang '${b.lang}'`);
      if (b.k === 'table' && (!Array.isArray(b.rows))) err(`${where}: table 블록에는 rows가 필요해요`);
    });
  };
  checkBlocks(w + ' 처음 장면', s.scene);
  if (!s.h || !s.p) err(`${w}: h, p가 필요해요`);
  const ss = s.steps || [];
  if (ss.length < 2 || ss.length > 8) err(`${w}: steps는 2~8개여야 해요(${ss.length})`);
  let sc = s.scene;
  ss.forEach((x, k) => {
    const v = `${w} 동작${k + 1}`;
    if (!x.goal) err(`${v}: goal이 필요해요`);
    const kinds = ['key', 'click', 'type'].filter(n => x[n] != null);
    if (kinds.length !== 1) return err(`${v}: key, click, type 중 하나만 써요`);
    if (x.key != null && !SIM.valid(x.key)) err(`${v}: key '${x.key}'는 단축키 모양이 아니에요`);
    if (x.key != null && !SIM.hasMod(x.key)) warn(`${v}: 조합키가 없는 '${x.key}'는 브라우저에서 잘 안 잡혀요`);
    if (x.click != null && !SIM.targets(sc).includes(x.click)) err(`${v}: 지금 화면에 '${x.click}'이 없어요. 있는 곳: ${SIM.targets(sc).join(', ')}`);
    if (x.type != null){ const n = SIM.typeInto(sc, x.into, x.type); if (!n) err(`${v}: '${x.into}' 칸이 지금 화면에 없어요(into: palette|chat|inline|rule|term|f:<field id>)`); else sc = n; }
    if (x.click != null) sc = SIM.autoClick(sc, x.click);
    if (x.then) sc = SIM.patch(sc, x.then);
    if (x.then && x.then.set) Object.keys(x.then.set).forEach(id => { if (!SIM.allBlocks(sc).some(b => b.id === id)) err(`${v}: then.set의 '${id}' 블록이 화면에 없어요`); });
    checkBlocks(v, sc);
    if (sc.palette && x.type != null && x.into === 'palette' && !SIM.palItems(sc.palette).length) warn(`${v}: 팔레트에 '${x.type}'와 맞는 항목이 없어요`);
    kbds(v, [x.goal, x.say, x.hint]);
  });
  if (!s.end) warn(`${w}: end(끝났을 때 한마디)가 있으면 좋아요`);
  kbds(w, [s.p, s.end]);
}
[...items, ...(Array.isArray(U.skip) ? [{ id:'K0', type:'quiz', title:'이미 알아요', sub:'점검', min:1, steps:U.skip }] : [])].forEach(it => {
  const W = `${it.id}`;
  ['title', 'sub', 'min'].forEach(k => { if (!it[k]) err(`${W}: ${k}가 없어요`); });
  const steps = it.steps || [];
  const qs = steps.filter(s => s.t === 'q');
  if (it.type === 'lesson') {
    const says = steps.filter(s => s.t === 'say').length;
    if (says < 3) err(`${W}: 설명(say)이 3개 이상이어야 해요(${says})`);
    const sims = steps.filter(s => s.t === 'sim').length;
    if (qs.length < (sims ? 3 : 4)) err(`${W}: 문제가 ${sims ? 3 : 4}개 이상이어야 해요(${qs.length})`);
    if (sims > 2) warn(`${W}: 모의 화면은 레슨마다 2개까지만 권해요(${sims})`);
    if (!steps.length || steps[steps.length - 1].t !== 'sum') err(`${W}: 마지막 단계는 sum이어야 해요`);
    const kinds = new Set(qs.map(q => q.kind)); if (kinds.size < 2) warn(`${W}: 문제 종류가 한 가지뿐이에요`);
  }
  if (it.type === 'quiz' && qs.length !== 3) err(`${W}: 헷갈림 퀴즈는 3문제여야 해요(${qs.length})`);
  if (it.type === 'test') {
    if (qs.length !== 10) err(`${W}: 형성평가는 10문제여야 해요(${qs.length})`);
    if (it.pass !== 0.7) err(`${W}: pass:0.7이 필요해요`);
    const k = qs.map(q => q.kind);
    if (!k.includes('order')) err(`${W}: order 문제가 필요해요`);
    if (!k.includes('line')) err(`${W}: line 문제가 필요해요`);
    if (!qs.some(q => q.kind === 'blank' && Array.isArray(q.opts && q.opts[0]))) err(`${W}: 빈칸 2개짜리 문제가 필요해요`);
  }
  if (it.type === 'mission'){
    if (steps.length) err(`${W}: 미션에는 steps 대신 tasks를 써요`);
    if (!it.where) err(`${W}: where(미션을 할 곳, 예: '업스테이지 콘솔 + upstage-lab 폴더')가 필요해요`);
    if (!it.intro) err(`${W}: intro가 필요해요`);
    const ts = it.tasks || [];
    if (ts.length < 3 || ts.length > 6) err(`${W}: tasks는 3~6개여야 해요(${ts.length})`);
    ts.forEach((t, k) => { if (!t.do || !t.check) err(`${W} 할 일${k + 1}: do와 check가 필요해요`); kbds(`${W} 할 일${k + 1}`, [t.do, t.how, t.check]); });
    kbds(W, [it.intro, it.note]);
    return;
  }
  if (it.type !== 'lesson' && steps.some(s => s.t !== 'q')) err(`${W}: 퀴즈·평가에는 문제만 넣어요`);
  const answers = [];
  steps.forEach((s, i) => {
    const w = `${W} 단계${i + 1}(${s.t}${s.kind ? ':' + s.kind : ''})`;
    stats[s.t] = (stats[s.t] || 0) + 1;
    if (s.t !== 'sim') kbds(w, [s.q, s.why, s.ex, s.opts, s.p, s.tip, s.h, s.pts, s.table && s.table.rows]);
    if (s.fig) { usedFigs.add(s.fig); if (!figs[s.fig]) err(`${w}: 그림 '${s.fig}'이 figs에 없어요`); }
    const code = s.code && typeof s.code === 'object' ? s.code.src : s.code;
    if (code && (s.lang || (s.code && s.code.lang)) !== 'err') {
      const lines = code.split('\n');
      if (lines.length > 12) warn(`${w}: 코드가 12줄을 넘어요`);
      lines.forEach(l => { const len = [...l.replace(/\[\[\d\]\]/g, '__')].reduce((a, ch) => a + (/[가-힯]/.test(ch) ? 2 : 1), 0); if (len > 40) warn(`${w}: 코드 한 줄이 길어요: ${l}`); });
    }
    if (s.t === 'say') {
      if (!s.h) err(`${w}: h가 없어요`);
      if (!s.p || !s.p.length) err(`${w}: p가 없어요`);
      (s.p || []).forEach(p => { if (hasTagInHtml(p)) warn(`${w}: 문단에 HTML로 해석될 < 가 있어요. &lt;로 쓰세요: ${p.slice(0, 60)}`); });
      if (s.code && !['py', 'json', 'html', 'css', 'js', 'md', 'sh', 'diff', 'plain', 'err'].includes(s.code.lang)) err(`${w}: code.lang이 이상해요`);
    } else if (s.t === 'q') {
      if (!s.q) err(`${w}: q가 없어요`);
      if (!s.fig) err(`${w}: 문제에도 fig가 필요해요`);
      if (!s.why) err(`${w}: why가 없어요`);
      if (s.code && !['py', 'json', 'html', 'css', 'js', 'md', 'sh', 'diff', 'plain', 'err'].includes(s.lang)) err(`${w}: code가 있으면 lang이 필요해요`);
      [s.q, s.why].forEach(t => { if (t && hasTagInHtml(t)) warn(`${w}: HTML로 해석될 < 가 있어요. &lt;로 쓰세요: ${t.slice(0, 60)}`); });
      if (s.kind === 'mc' || s.kind === 'blank') {
        if (!Array.isArray(s.opts) || s.opts.length !== 4) err(`${w}: opts는 4개여야 해요`);
        if (!(s.a >= 0 && s.a <= 3)) err(`${w}: a는 0~3이어야 해요`);
        if (!Array.isArray(s.ex) || s.ex.length !== 4) err(`${w}: ex는 4개여야 해요`);
        else s.ex.forEach((e, k) => { if (k === s.a && e !== '') err(`${w}: 정답 칸 ex[${k}]는 ''이어야 해요`); if (k !== s.a && !e) err(`${w}: ex[${k}]가 비었어요`); });
        if (s.opts && new Set(s.opts.map(o => JSON.stringify(o))).size !== s.opts.length) err(`${w}: 같은 보기가 있어요`);
        answers.push(s.a);
        if (s.kind === 'mc' && !s.mono) (s.opts || []).forEach(o => { if (typeof o === 'string' && hasTagInHtml(o)) warn(`${w}: 보기에 HTML로 해석될 < 가 있어요: ${o}`); });
      }
      if (s.kind === 'blank') {
        const n = ((s.code || '').match(/\[\[\d\]\]/g) || []).length;
        if (!n) err(`${w}: code에 [[1]]이 없어요`);
        (s.opts || []).forEach(o => { const k = Array.isArray(o) ? o.length : 1; if (k !== n) err(`${w}: 빈칸 ${n}개인데 보기 칸 수가 ${k}예요`); });
      }
      if (s.kind === 'line') {
        const n = (s.code || '').split('\n').length;
        if (!(s.a >= 0 && s.a < n)) err(`${w}: a가 줄 범위(0~${n - 1}) 밖이에요`);
      }
      if (s.kind === 'order' && !(Array.isArray(s.items) && s.items.length >= 3 && s.items.length <= 6)) err(`${w}: items는 3~6개여야 해요`);
      if (!['mc', 'blank', 'line', 'order'].includes(s.kind)) err(`${w}: 모르는 kind '${s.kind}'`);
    } else if (s.t === 'sim') {
      checkSim(w, s);
    } else if (s.t === 'try') {
      if (!['html', 'md', 'py'].includes(s.lang)) err(`${w}: lang은 py, md, html 중 하나`);
      if (!s.h || !s.p || !s.src) err(`${w}: h, p, src가 필요해요`);
      if (s.lang === 'py' && s.src){
        const ans = s.answers || [];
        const m = miniPy(s.src, ans), r = realPy(s.src, ans);
        if (m.err && !s.err) err(`${w}: 앱 파이썬 연습장에서 오류가 나요: ${m.err.split('\n').pop()}`);
        if (r && !s.err && r.err) err(`${w}: 진짜 python3에서 오류가 나요: ${r.err.trim().split('\n').pop()}`);
        if (r && !m.err && !r.err && m.out !== r.out) warn(`${w}: 앱 연습장과 진짜 python3 출력이 달라요\n  앱: ${JSON.stringify(m.out.slice(0, 160))}\n  진짜: ${JSON.stringify(r.out.slice(0, 160))}`);
        if (/^\s*(import|from)\s+(openai|requests|os|dotenv|streamlit|numpy|langchain)/m.test(s.src)) err(`${w}: 연습장에서는 ${RegExp.$2}를 쓸 수 없어요(인터넷·패키지 없음). 설명 code나 미션으로 보여 주세요`);
      }
    } else if (s.t === 'sum') {
      if (!Array.isArray(s.pts) || s.pts.length !== 3) err(`${w}: pts는 3개여야 해요`);
    } else err(`${w}: 모르는 단계 t='${s.t}'`);
  });
  if (answers.length >= 4) { const c = [0, 1, 2, 3].map(k => answers.filter(a => a === k).length); if (Math.max(...c) > answers.length * 0.6) warn(`${W}: 정답 위치가 한쪽으로 몰려요 ${c.join('/')}`); }
});
Object.keys(figs).forEach(n => { if (!usedFigs.has(n) && n !== 'hero') warn(`그림 '${n}'을 아무 데서도 안 써요`); });

errors.forEach(m => console.log('ERROR ' + m));
warns.forEach(m => console.log('WARN  ' + m));
console.log(`\n${U.id}: 오류 ${errors.length}개, 경고 ${warns.length}개 · 설명 ${stats.say} · 문제 ${stats.q} · 모의 화면 ${stats.sim || 0} · 연습장 ${stats.try || 0} · 그림 ${stats.figs}`);
process.exit(errors.length ? 1 : 0);
