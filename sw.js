// JIKA ADA UPDATE PORTAL, GANTI NAMA CACHE DI BAWAH INI (Contoh: v1 jadi v2)
const CACHE_NAME = 'portal-kesling-cache-v2.0.0';

const assets = [
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// Pemasangan cache awal
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

// Pembersihan cache versi lama secara otomatis
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Menghapus cache lawas:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Strategi Pengambilan Data
self.addEventListener('fetch', e => {
  if (!e.request.url.startsWith('http')) return;

  e.respondWith(
    fetch(e.request)
      .catch(() => {
        return caches.match(e.request);
      })
  );
});
