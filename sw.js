const CACHE_NAME = 'schedulemonitor-2.6.3'; 

const STATIC_ASSETS = [
  './',
  './index.html',
  './script.js',
  './css/styles.css',
  './default-calendar.json',
  './Changelog.md',
  './version.txt',
  './version.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        STATIC_ASSETS.map(url => {
          return cache.add(url).catch(err => {
            console.warn(`Failed to cache: ${url}`, err);
          });
        })
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));

    self.clients.claim();

    await checkForUpdate();
  })());
});

function getVersionUrl() {
  const host = self.location.hostname;
  if (host.endsWith('github.io')) {
    const repoPath = self.location.pathname.split('/')[1];
    return `https://raw.githubusercontent.com/oirehm/${repoPath}/main/version.json?t=` + Date.now();
  }
  return './version.json?t=' + Date.now();
}

async function checkForUpdate(isManual = false) {
  try {
    const res = await fetch(getVersionUrl(), { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    const { cacheName, version } = data;

    if (cacheName && cacheName !== CACHE_NAME) {
      const newCache = await caches.open(cacheName);
      await newCache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'no-store' })));

      await caches.delete(CACHE_NAME);

      const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
      clients.forEach(client => client.postMessage({
        type: 'UPDATE_AVAILABLE',
        cacheName,
        version,
        isManual,
      }));
    } else if (cacheName === CACHE_NAME) {
      const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
      clients.forEach(client => client.postMessage({
        type: 'UP_TO_DATE',
        isManual,
      }));
    }
  } catch (e) {
  }
}

self.addEventListener('message', event => {
  if (event.data?.type === 'CHECK_UPDATE') {
    checkForUpdate(event.data.isManual === true);
  }
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  if (event.request.url.includes('version.json')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const ct = response.headers.get('content-type') || '';
        const url = event.request.url;
        if (url.endsWith('.js') && ct.includes('text/html')) return response;
        if (url.endsWith('.css') && ct.includes('text/html')) return response;

        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    }).catch(() => {
      if (event.request.mode === 'navigate') return caches.match('./index.html');
      return new Response('Offline', { status: 503 });
    })
  );
});