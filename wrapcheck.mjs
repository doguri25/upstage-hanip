// 휴대폰 폭에서 가로로 넘치는 곳 찾기(글자를 낱말 단위로 줄바꿈한 뒤 확인용). 모든 단계를 그려 본다.
// ZOOM=1.12 SIZES='[[360,740]]' ONLY=c5 node wrapcheck.mjs
import { chromium, launchOpts } from './pw.mjs';
const url = 'file://' + process.cwd() + '/dist/local.html';
const browser = await chromium.launch(launchOpts);
const zoom = +(process.env.ZOOM || 1.12);
for (const [w, h] of (process.env.SIZES ? JSON.parse(process.env.SIZES) : [[360, 740]])) {
  const pg = await browser.newPage({ viewport: { width: w, height: h } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto(url); await pg.waitForTimeout(1200);
  const rep = await pg.evaluate(async ([zoom, only]) => {
    store.zoom = zoom; applyZoom();
    const res = [];
    const wide = () => { const out = [];
      if (document.documentElement.scrollWidth > innerWidth + 1) out.push('page+' + (document.documentElement.scrollWidth - innerWidth));
      document.querySelectorAll('.col, .home .panel, .item, .continue, .cbtn, .utab, .opt, .chip, .fb, .dock-in, .sgoal, .ssay, .mtask, .skiprow, .s-body').forEach(el => {
        const d = el.scrollWidth - el.clientWidth; if (d > 1) out.push(`${el.className.split(' ')[0]}+${d}`); });
      return out; };
    renderHome(); await new Promise(r => setTimeout(r, 0));
    let o = wide(); if (o.length) res.push(`home ${o.join(',')}`);
    for (const u of HANIP.units.filter(x => !only || x.id.startsWith(only))) for (const it of u.items) { start(u, it);
      if (!it.steps) { await new Promise(r => setTimeout(r, 0)); o = wide(); if (o.length) res.push(`${u.id}/${it.id}(미션) ${o.join(',')}`); continue; }
      for (let i = 0; i < it.steps.length; i++) { S.i = i; S.rec = new Map(); renderStep(); await new Promise(r => setTimeout(r, 0));
        const st = S.queue[i], tag = `${u.id}/${it.id}/${i + 1}(${st.t}${st.kind ? ':' + st.kind : ''})`;
        o = wide(); if (o.length) res.push(`${tag} ${o.join(',')}`);
        if (st.t === 'q' && (st.kind === 'mc' || st.kind === 'blank' || !st.kind)) { S.pickKeys((st.a + 1) % st.opts.length); document.querySelector('.dock-in .primary').click(); await new Promise(r => setTimeout(r, 0));
          o = wide(); if (o.length) res.push(`${tag} 오답후 ${o.join(',')}`); }
      } }
    return res; }, [zoom, process.env.ONLY || '']);
  console.log(`${w}x${h} zoom ${zoom} 넘침 ${rep.length}`, errs.length ? 'errors: ' + [...new Set(errs)].join(' | ') : ''); console.log(rep.slice(0, 40).join('\n'));
  await pg.close();
}
await browser.close();
