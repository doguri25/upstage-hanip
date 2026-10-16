import { chromium, launchOpts } from './pw.mjs';
const url = 'file://' + process.cwd() + '/dist/local.html';
const browser = await chromium.launch(launchOpts);
const go = async (page, uid, iid, step, act) => { await page.evaluate(([uid, iid, step, act]) => { const u = HANIP.units.find(x => x.id === uid); const it = u.items.find(x => x.id === iid); start(u, it); S.i = step; S.dir = 'none'; renderStep();
  if (act === 'wrong') { S.pickKeys((S.queue[step].a + 1) % 4); document.querySelector('.dock-in .primary').click(); }
  if (act === 'sel') { S.pickKeys(1); } }, [uid, iid, step, act]); await page.waitForTimeout(700); };
const pc = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await pc.goto(url); await pc.waitForTimeout(1500);
await pc.screenshot({ path: 'shots/v3-pc-home.png' });
for (const [n, a] of process.argv.slice(2).map(x => x.split('='))) { const [uid, iid, st, act] = a.split(','); await go(pc, uid, iid, +st, act); await pc.screenshot({ path: `shots/v3-pc-${n}.png` }); }
const mo = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await mo.goto(url); await mo.waitForTimeout(1500);
await mo.screenshot({ path: 'shots/v3-mo-home.png' });
await go(mo, 'c1u1', 'L1', 4, 'wrong'); await mo.screenshot({ path: 'shots/v3-mo-wrong.png' });
await browser.close();
