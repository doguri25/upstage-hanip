import { chromium, launchOpts } from './pw.mjs';
const url = 'file://' + process.cwd() + '/dist/local.html';
const browser = await chromium.launch(launchOpts);
for (const [w, h] of (process.env.SIZES ? JSON.parse(process.env.SIZES) : [[1280, 720], [1440, 900]])) {
  const pc = await browser.newPage({ viewport: { width: w, height: h } });
  const errs = []; pc.on('pageerror', e => errs.push(e.message));
  await pc.goto(url); await pc.waitForTimeout(1200); if (process.env.ONLY) await pc.evaluate(o => { window.__only = o; }, process.env.ONLY);
  const rep = await pc.evaluate(async () => { const res = []; const over = () => [...document.querySelectorAll('.col')].map(c => c.scrollHeight - c.clientHeight).filter(d => d > 4);
    for (const u of HANIP.units.filter(x => !window.__only || x.id.startsWith(window.__only))) for (const it of u.items) { start(u, it);
      if (!it.steps) continue;
      for (let i = 0; i < it.steps.length; i++) { S.i = i; S.rec = new Map(); renderStep(); await new Promise(r => setTimeout(r, 0));
        let o = over(); const tag = `${u.id}/${it.id}/${i + 1}(${S.queue[i].t}${S.queue[i].kind ? ':' + S.queue[i].kind : ''})`;
        if (o.length) res.push(`${tag} 처음 ${o.join(',')}`);
        const st = S.queue[i];
        if (st.t === 'q' && (st.kind === 'mc' || st.kind === 'blank')) { const wrongIx = (st.a + 1) % 4; S.pickKeys(wrongIx); document.querySelector('.dock-in .primary').click(); await new Promise(r => setTimeout(r, 0)); S.fit && S.fit(); o = over(); if (o.length) res.push(`${tag} 오답후 ${o.join(',')}`); }
      } }
    return res; });
  console.log(`${w}x${h} overflow ${rep.length}`, errs.length ? 'errors: ' + [...new Set(errs)].join(' | ') : ''); console.log(rep.slice(0, 30).join('\n'));
  await pc.close();
}
await browser.close();
