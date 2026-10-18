// Forecheck service worker: opens instantly and works offline for the app itself.
// Scores, fantasy data and CBS calls always go to the network (never cached here).
const V = 'fc-v7';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V && k !== 'fc-img').map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // fonts and team logos: cache first
  if (/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname) || (u.hostname === 'a.espncdn.com' && /teamlogos/.test(u.pathname))) {
    e.respondWith(caches.open('fc-img').then(async c => (await c.match(e.request)) || fetch(e.request).then(r => { if (r.ok || r.type === 'opaque') c.put(e.request, r.clone()); return r; })));
    return;
  }
  // the app itself: network first so updates arrive, cache when offline
  if (u.origin === location.origin) {
    e.respondWith(fetch(e.request).then(r => { if (r.ok) { const cl = r.clone(); caches.open(V).then(c => c.put(e.request, cl)); } return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
  }
});
