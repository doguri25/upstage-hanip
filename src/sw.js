/* 업스테이지한입 서비스 워커: 한 번 열면 인터넷이 없어도 공부할 수 있게 저장해 둔다.
   화면(index.html)은 인터넷이 되면 새로 받고(안 되면 저장본), 버전이 붙은 단원·글꼴과 바깥 파일(글꼴·rough.js)은 저장본을 먼저 쓴다. */
const VERSION = '/*VERSION*/';
const CACHE = 'uhanip-' + VERSION, EXT = 'uhanip-ext';
const FILES = /*FILES*/;
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k !== EXT).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin === location.origin && r.mode !== 'navigate' && u.searchParams.has('v')){
    /* 버전이 붙은 파일(단원·글꼴)은 내용이 바뀌지 않으니 저장본을 바로 쓴다(레슨이 빨리 열림) */
    e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { if (res.ok){ const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); } return res; })));
  } else if (u.origin === location.origin){
    e.respondWith(fetch(r).then(res => { if (res.ok){ const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); } return res; })
      .catch(() => caches.match(r, { ignoreSearch:true }).then(m => m || (r.mode === 'navigate' ? caches.match('./') : Response.error()))));
  } else if (/fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net/.test(u.host)){
    e.respondWith(caches.open(EXT).then(c => c.match(r).then(m => m || fetch(r).then(res => { if (res.ok || res.type === 'opaque') c.put(r, res.clone()); return res; }))));
  }
});
