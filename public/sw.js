const VERSION = new URL(self.location.href).searchParams.get('v') || 'development';
const CACHE_PREFIX = 'caption-check-';
const CACHE = `${CACHE_PREFIX}${VERSION}`;
const SHELL = ['/', '/demo', '/privacy', '/terms', '/favicon.svg', '/manifest.webmanifest', '/assets/signal-desk.webp'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys()
    .then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim())
));
self.addEventListener('message', e => {
  if (e.data?.type !== 'cache-page' || !Array.isArray(e.data.urls)) return;
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(e.data.urls)).then(() => e.source?.postMessage({ type: 'shell-cached' })));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(response => {
      const copy = response.clone();
      e.waitUntil(caches.open(CACHE).then(cache => cache.put(e.request, copy)));
      return response;
    }).catch(() => caches.match(e.request, { ignoreVary: true }).then(hit => hit || caches.match('/'))));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreVary: true }).then(hit => hit || fetch(e.request).then(response => {
    const copy = response.clone();
    e.waitUntil(caches.open(CACHE).then(cache => cache.put(e.request, copy)));
    return response;
  })));
});
