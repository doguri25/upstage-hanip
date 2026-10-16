// 찾아보기(guide/*.js) 검사: node check-guide.js
const fs = require('fs'), path = require('path');
const SIM = require('./src/simcore.js');
const errors = [], warns = [];
const err = m => errors.push(m), warn = m => warns.push(m);
const items = [];
global.HANIP = { guide(list){ items.push(...list.map(x => Object.assign({ _f:this._f }, x))); } };
for (const dir of ['guide']) for (const f of (fs.existsSync(dir) ? fs.readdirSync(dir) : []).filter(f => f.endsWith('.js')).sort()){
  HANIP._f = `${dir}/${f}`;
  try { new Function('HANIP', fs.readFileSync(path.join(dir, f), 'utf8'))(HANIP); } catch (e) { err(`${dir}/${f}: 읽지 못함 ${e.message}`); }
}
const CATS = ['모델', 'API', '콘솔', '코드', '문제 해결', '용어'];
const SRC_OK = /^https:\/\/(console\.upstage\.ai|www\.upstage\.ai|upstage\.ai|github\.com\/UpstageAI|pypi\.org|docs\.python\.org|docs\.streamlit\.io|cursor\.com|github\.com\/openai\/openai-python|www\.moe\.go\.kr|www\.msit\.go\.kr|www\.keris\.or\.kr|www\.korea\.kr|www\.pipc\.go\.kr|kace\.re\.kr|www\.kace\.re\.kr)(\/|$)/;
const kbd = (w, t) => { if (typeof t !== 'string') return;
  for (const m of t.matchAll(/<kbd>([^<]*)<\/kbd>/g)) if (!SIM.valid(m[1])) err(`${w}: <kbd>${m[1]}</kbd>는 단축키 모양이 아니에요`);
  if (/⌘|⇧|⌥|Cmd\s*\+|Ctrl\s*\+/.test(t.replace(/<kbd>[^<]*<\/kbd>/g, ''))) warn(`${w}: 단축키는 <kbd>…</kbd>로: ${t.slice(0, 50)}`); };
const ids = new Set();
items.forEach((x, i) => {
  const w = `${x._f} ${x.id || '#' + i}`;
  if (!/^[a-z0-9-]+$/.test(x.id || '')) err(`${w}: id는 영어 소문자·숫자·하이픈`);
  if (ids.has(x.id)) err(`${w}: id가 겹쳐요`); ids.add(x.id);
  if (!CATS.includes(x.cat)) err(`${w}: cat은 ${CATS.join('/')}`);
  ['title', 'what', 'src', 'checked'].forEach(k => { if (!x[k]) err(`${w}: ${k}가 필요해요`); });
  if (x.src && !SRC_OK.test(x.src)) err(`${w}: src는 공식 주소(console.upstage.ai/docs 등)`);
  if (x.code && x.code.split('\n').length > 12) warn(`${w}: code가 12줄을 넘어요`);
  if (x.checked && !/^\d{4}-\d{2}-\d{2}$/.test(x.checked)) err(`${w}: checked는 YYYY-MM-DD`);
  if (x.lesson && !/^c[1-5]u[1-3]$/.test(x.lesson)) err(`${w}: lesson은 c1u2 같은 단원 id`);
  (x.keys || []).forEach(k => { if (!SIM.valid(k)) err(`${w}: keys의 '${k}'가 단축키 모양이 아니에요`); });
  [x.what, x.where].forEach(t => kbd(w, t));
});
errors.forEach(m => console.log('ERROR ' + m)); warns.forEach(m => console.log('WARN  ' + m));
const by = CATS.map(c => `${c} ${items.filter(x => x.cat === c).length}`).join(' · ');
console.log(`\n찾아보기 ${items.length}개(${by}): 오류 ${errors.length}개, 경고 ${warns.length}개`);
process.exit(errors.length ? 1 : 0);
