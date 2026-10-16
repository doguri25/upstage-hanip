// Playwright 찾기: 이 Mac에서는 마이대시의 playwright와 크롬을 쓰고, 다른 곳에서는 PW(playwright index.mjs 경로)·CHROME(실행 파일) 환경 변수를 쓴다.
const PW = process.env.PW || '/Users/doguri/Projects/my-dashboard/node_modules/playwright/index.mjs';
export const { chromium } = await import(PW);
export const launchOpts = process.env.CHROME ? { executablePath: process.env.CHROME } : { channel: 'chrome' };
