const CACHE_NAME = 'portal-navigasi-v2';

// Cukup cache file portal utama saja
const assets = [
  '/',
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// Menyimpan aset portal utama ke memory
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

// Membersihkan cache lama jika ada pembaruan
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Strategi: Network First, Fallback to Cache
// Mencoba mengambil data online, jika offline baru ambil dari cache lokal
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
