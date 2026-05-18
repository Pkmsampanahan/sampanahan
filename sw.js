const CACHE_NAME = 'portal-navigasi-v1';

const assets = [
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// Menyimpan aset portal utama ke memori cache
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Menggunakan return agar memastikan semua aset ter-cache sebelum install selesai
      return cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

// Membersihkan cache lama
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
self.addEventListener('fetch', e => {
  // Hanya tangani request dengan skema http/https (menghindari error chrome-extension)
  if (!e.request.url.startsWith('http')) return;

  e.respondWith(
    fetch(e.request)
      .catch(() => {
        return caches.match(e.request);
      })
  );
});
