const CACHE_NAME = 'reframing-game-cache-v1';
const urlsToCache = [
  '/reframing-game/index.html',
  '/reframing-game/manifest.json',
  '/reframing-game/offline.html',
  '/reframing-game/images/icons/icon-192x192.png',
  '/reframing-game/images/icons/icon-512x512.png',
  // 主要ルートを追加
  '/reframing-game/',
  // 必要な外部リソース
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.77/Tone.js',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Orbitron:wght@700&family=MedievalSharp&display=swap'
];

// Install: precache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Fetch: stale-while-revalidate & offline UX
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  // HTMLナビゲーション失敗時はoffline.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
            return response;
          }
          throw new Error('Network response was not ok');
        })
        .catch(() => caches.match('/reframing-game/offline.html'))
    );
    return;
  }
  // 通常リソースはstale-while-revalidate
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
            return response;
          }
          throw new Error('Network response was not ok');
        })
        .catch(() => cached || caches.match('/reframing-game/offline.html'));
      return cached || fetchPromise;
    })
  );
});
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});