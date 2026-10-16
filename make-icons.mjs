// 앱 아이콘(PWA) 만들기: 홈 화면의 쿠키 그림을 찍어 assets/icons/에 PNG로 저장한다. 한 번만 돌리면 된다.
import { chromium, launchOpts } from './pw.mjs';
const b = await chromium.launch(launchOpts);
const p = await b.newPage({ viewport: { width: 600, height: 600 }, colorScheme: 'light' });
await p.goto('file://' + process.cwd() + '/dist/local.html'); await p.waitForTimeout(800);
const shot = async (size, scale, name, round) => {
  await p.evaluate(([size, scale, round]) => {
    document.querySelector('#iconbox')?.remove();
    const box = document.createElement('div'); box.id = 'iconbox';
    box.style.cssText = `position:fixed;left:0;top:0;width:${size}px;height:${size}px;z-index:99;display:grid;place-items:center;background:#FFF5CC;${round ? 'border-radius:22%;' : ''}`;
    const svg = document.querySelector('.brand .fig svg').cloneNode(true);
    svg.style.cssText = `width:${size * scale}px;max-width:none;height:auto`;
    box.append(svg); document.body.append(box);
  }, [size, scale, round]);
  await p.locator('#iconbox').screenshot({ path: `assets/icons/${name}`, omitBackground: true });
};
await shot(512, .86, 'icon-512.png');
await shot(192, .86, 'icon-192.png');
await shot(512, .62, 'maskable-512.png');
await shot(180, .8, 'apple-touch-icon.png');
await shot(64, .9, 'favicon-64.png', true);
await b.close();
