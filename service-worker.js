const CACHE_NAME = 'reframing-game-cache-v1';
const urlsToCache = [
  '/reframing-game/index.html',
  '/reframing-game/manifest.json',
  '/reframing-game/images/icons/icon-192x192.png',
  '/reframing-game/images/icons/icon-512x512.png',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.77/Tone.js',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Orbitron:wght@700&family=MedievalSharp&display=swap',
  '/reframing-game/offline.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});