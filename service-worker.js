self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('rg-v1').then((cache) =>
      cache.addAll([
        '/reframing-game/',
        '/reframing-game/index.html',
        '/reframing-game/offline.html',
        '/reframing-game/manifest.json',
        '/reframing-game/images/icons/icon-192x192.png',
        '/reframing-game/images/icons/icon-512x512.png',
      ])
    )
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // 外部ドメイン(CDN等)はSWで処理しない → CORSエラー回避
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((res) => {
      return (
        res ||
        fetch(event.request).catch(() =>
          caches.match('/reframing-game/offline.html')
        )
      );
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
