// Nombre del caché para la aplicación
const CACHE_NAME = 'ecmotors-v1';

// Archivos básicos para que la app cargue offline
const assetsToCache = [
  './',
  './index.html',
  './logo.png',
  './manifest.json'
];

// Evento de instalación: guarda los archivos en el caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cacheando archivos de ECMOTORS');
        return cache.addAll(assetsToCache);
      })
      .then(() => self.skipWaiting()) // Forzar la activación inmediata
  );
});

// Evento de activación: limpia cachés antiguos si los hay
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Tomar control de las páginas abiertas
  );
});

// Evento de fetch: sirve los archivos desde el caché si están disponibles
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna la respuesta del caché si existe
        if (response) {
          return response;
        }
        // Si no, lo busca en la red
        return fetch(event.request);
      })
  );
});