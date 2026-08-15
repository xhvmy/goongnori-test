// ============================================================
//  sw.js — 궁노리 오프라인 캐시
// ============================================================

const CACHE_NAME = 'goongnori-v6';

const APP_SHELL = [
  'index.html',
  '404.html',
  'css/style.css',
  'js/main.js',
  'js/content.js',
  'manifest.json',
  'sound/login.mp3',
  'fonts/KMU80SungkokSemiSerif.woff2',
  'fonts/KMU80SungkokSerif.woff2',
  'images/00_logo/logo.png',
  'images/01_gate/bg-language-900.webp',
  'images/01_gate/bg-gate-appear-900.webp',
  'images/01_gate/logo-goongnori.webp',
  'images/01_gate/goongi-silhouette.png',
  'images/01_gate/goongi-front-full.webp',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// 자주 바뀌는 앱 셸(HTML/CSS/JS)인지 판별 — 이 자산들은 네트워크 우선으로,
// 나머지(이미지/사운드/폰트 등 무거운 정적 자산)는 캐시 우선으로 처리한다.
function isAppShell(pathname) {
  return pathname.endsWith('.html') || pathname.endsWith('.css') || pathname.endsWith('.js') || pathname === '/';
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const sameOrigin = url.origin === self.location.origin;

  if (sameOrigin && isAppShell(url.pathname)) {
    // 앱 셸: 네트워크 우선(항상 최신 콘텐츠), 오프라인일 때만 캐시로 폴백
    event.respondWith(
      fetch(event.request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => caches.match(event.request))
    );
  } else if (sameOrigin) {
    // 이미지/사운드 등 무거운 정적 자산: 캐시 우선
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        }).catch(() => cached);
      })
    );
  } else {
    // 외부 자산(Google Fonts 등): 네트워크 우선, 실패 시 캐시로 폴백
    event.respondWith(
      fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      }).catch(() => caches.match(event.request))
    );
  }
});
