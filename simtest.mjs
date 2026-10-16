// 모든 모의 화면(sim)을 대본대로 끝까지 눌러 보고, 막히는 동작·오류를 찾는다.
// node simtest.mjs   (python3 build.py 뒤, ONLY=c1u2,c3 처럼 골라 돌릴 수 있음)
import { chromium, launchOpts } from './pw.mjs';
const url = 'file://' + process.cwd() + '/dist/local.html';
const browser = await chromium.launch(launchOpts);
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const pg = await browser.newPage({ viewport: { width: w, height: h } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto(url); await pg.waitForTimeout(800);
  const sims = await pg.evaluate(only => { const out = []; HANIP.units.filter(u => !only.length || only.some(o => u.id.startsWith(o))).forEach(u => u.items.forEach(it => (it.steps || []).forEach((s, i) => { if (s.t === 'sim') out.push([u.id, it.id, i, s.steps.length]); }))); return out; }, (process.env.ONLY || '').split(',').filter(Boolean));
  const bad = [];
  for (const [uid, iid, i, n] of sims) {
    await pg.evaluate(([uid, iid, i]) => { const u = HANIP.units.find(x => x.id === uid); start(u, u.items.find(x => x.id === iid), null, i); }, [uid, iid, i]);
    await pg.waitForTimeout(200);
    for (let k = 0; k < n; k++) {
      const x = await pg.evaluate(([uid, iid, i, k]) => HANIP.units.find(u => u.id === uid).items.find(t => t.id === iid).steps[i].steps[k], [uid, iid, i, k]);
      try {
        // 휴대폰에서는 아래 고정 버튼 줄에 가리지 않게 가운데로 굴린 뒤 누른다
        const loc = x.key ? pg.locator('.keybtn') : x.click ? pg.locator(`.simhold [data-t="${x.click.replace(/"/g, '\\"')}"]`) : pg.locator(`.simhold [data-type="${x.into}"]`);
        await loc.first().evaluate(e => e.scrollIntoView({ block: 'center' }), null, { timeout: 1500 });
        await loc.first().click({ timeout: 1500 });
        if (x.type != null) await pg.waitForTimeout(1100);
      } catch (e) { bad.push(`${uid}/${iid}/${i + 1} 동작${k + 1}(${x.key || x.click || 'type:' + x.into}) 못 누름: ${e.message.split('\n')[0]}`); break; }
      await pg.waitForTimeout(60);
    }
    const done = await pg.evaluate(() => !document.querySelector('.dock-in .primary').disabled);
    if (!done) bad.push(`${uid}/${iid}/${i + 1} 끝나지 않음`);
  }
  console.log(`${w}x${h} 모의 화면 ${sims.length}개 · 문제 ${bad.length}개`, errs.length ? 'errors: ' + [...new Set(errs)].join(' | ') : '');
  bad.forEach(b => console.log('  ' + b));
  await pg.close();
}
await browser.close();
