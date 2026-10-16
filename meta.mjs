// 단원 파일을 읽어 홈 화면에 필요한 요약(meta)과 예상 소요 시간을 만든다.
// node meta.mjs            → JSON(요약) 출력(build.py가 씀)
// node meta.mjs --report   → 적힌 시간과 예상 시간 비교표
import fs from 'fs';
const units = [];
const HANIP = { unit(u){ units.push(u); } };
for (const f of fs.readdirSync('units').filter(f => f.endsWith('.js')).sort()) new Function('HANIP', fs.readFileSync('units/' + f, 'utf8'))(HANIP);

/* 예상 시간: 처음 배우는 사람이 설명을 읽고, 그림을 보고, 문제를 고민하고, 연습장에서 고쳐 실행해 보는 시간 */
const PROSE = 380, CODE = 200, SKIM = 300, TABLE = 300; // 1분에 읽는 글자 수(공백 뺌): 설명 글, 예시 코드, 연습장 코드(훑어봄), 표
const THINK = { mc:12, blank:16, line:16, order:25 };  // 문제를 고르는 데 드는 초
const DO = { md:60, html:90 };           // 연습장에서 고치고 실행해 보는 초
const txt = s => String(s ?? '').replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, 'x');
const n = s => txt(s).replace(/\s+/g, '').length;
const sum = (a, f) => (a || []).reduce((t, x) => t + f(x), 0);
const read = (c, speed = PROSE) => c / speed * 60;
export function stepSec(st){
  let t = 2;                                            // 다음 누르기·화면 전환
  if (st.t === 'say'){
    t += read(n(st.h) + sum(st.p, n) + n(st.tip));
    if (st.code) t += read(n(st.code.src), CODE) + read(n(st.code.out));
    if (st.table) t += read(sum(st.table.head, n) + sum(st.table.rows, r => sum(r, n)), TABLE);
    if (st.fig) t += 6;
  } else if (st.t === 'q'){
    const kind = st.kind || 'mc';
    t += (THINK[kind] ?? 12) + read(n(st.q)) + (st.fig ? 5 : 0);
    if (typeof st.code === 'string') t += read(n(st.code), CODE);
    if (st.opts) t += read(sum(st.opts, o => n(Array.isArray(o) ? o.join(' ') : o)));
    if (st.items) t += read(sum(st.items, n)) * 1.5;
    t += read(n(st.why)) + (st.ex && st.ex.length ? read(sum(st.ex, n) / st.ex.length) : 0);
    t *= 1.15;                                          // 틀리면 끝에 한 번 더
  } else if (st.t === 'try'){
    t += read(n(st.h) + n(st.p) + n(st.note)) + Math.min(150, read(n(st.src), SKIM)) + (DO[st.lang] ?? 90);
  } else if (st.t === 'sim'){
    t += read(n(st.h) + n(st.p) + n(st.end) + sum(st.steps, x => n(x.goal) + n(x.say))) + sum(st.steps, () => 7);
  } else if (st.t === 'sum'){
    t += read(sum(st.pts, n)) + 4;
  }
  return t;
}
export const itemMin = it => it.type === 'mission' ? it.min : Math.max(1, Math.round(sum(it.steps, stepSec) / 60));

const meta = units.map(u => ({ id:u.id, course:u.course, title:u.title, goals:u.goals, checked:u.checked, skip:Array.isArray(u.skip) ? u.skip.length : 0,
  items:u.items.map(it => ({ id:it.id, type:it.type, title:it.title, sub:it.sub, min:itemMin(it), pass:it.pass, win:it.win, where:it.where, tasks:it.tasks ? it.tasks.length : undefined,
    qs:(it.steps || []).filter(s => s.t === 'q').length })) }));

if (process.argv.includes('--report')){
  const rows = [];
  for (const u of units) for (const it of u.items) rows.push({ u:u.id, it:it.id, type:it.type, was:it.min, est:itemMin(it) });
  const by = t => rows.filter(r => r.type === t);
  for (const t of ['lesson', 'quiz', 'mission', 'test']){
    const r = by(t), avg = f => (r.reduce((a, x) => a + f(x), 0) / r.length).toFixed(1);
    console.log(`${t}: ${r.length}개 · 적힌 시간 평균 ${avg(x => x.was)}분 · 예상 평균 ${avg(x => x.est)}분 · 예상 범위 ${Math.min(...r.map(x => x.est))}~${Math.max(...r.map(x => x.est))}분`);
  }
  const off = rows.filter(r => Math.abs(r.est - r.was) / r.was > .3);
  console.log(`30% 넘게 다른 것: ${off.length}/${rows.length}`);
  const tot = units.map(u => ({ id:u.id, was:sum(u.items, i => i.min), est:sum(u.items, itemMin) }));
  console.log('단원 합계(적힌→예상):', tot.map(t => `${t.id} ${t.was}→${t.est}`).join(', '));
  console.log('전체(시간):', (sum(tot, t => t.was) / 60).toFixed(1), '→', (sum(tot, t => t.est) / 60).toFixed(1));
} else if (process.argv.includes('--write')){
  // 단원 파일의 min(적힌 시간)을 예상 시간으로 맞춘다. 파일마다 min은 문항 순서대로 9개 있다(미션은 적힌 값 그대로).
  let changed = 0;
  for (const u of units){
    const f = `units/${u.id}.js`; let k = 0;
    const src = fs.readFileSync(f, 'utf8').replace(/\bmin:(\s*)\d+/g, (m, sp) => { const it = u.items[k++]; if (!it) return m; const v = itemMin(it); if (v !== it.min) changed++; return `min:${sp}${v}`; });
    if (k !== u.items.length) throw new Error(`${f}: min ${k}개, 문항 ${u.items.length}개`);
    fs.writeFileSync(f, src);
  }
  console.log('바꾼 시간', changed);
} else process.stdout.write(JSON.stringify(meta));
