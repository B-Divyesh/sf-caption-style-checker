const CACHE = 'caption-check-v1';
const SHELL = ['/', '/demo', '/privacy', '/terms', '/favicon.svg', '/manifest.webmanifest', '/assets/signal-desk.webp'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('message', e => {
  if (e.data?.type !== 'cache-page' || !Array.isArray(e.data.urls)) return;
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(e.data.urls)).then(() => e.source?.postMessage({ type: 'shell-cached' })));
});
self.addEventListener('fetch', e => { if (e.request.method !== 'GET') return; e.respondWith(caches.match(e.request, { ignoreVary: true }).then(hit => hit || fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; }).catch(() => e.request.mode === 'navigate' ? caches.match('/') : Response.error()))); });
