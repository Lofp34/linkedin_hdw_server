const CACHE_NAME = 'hdw-prospect-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/Linkedin_Search.png',
  '/manifest.json'
];

// Installation du service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interception des requêtes
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retourne la réponse du cache si elle existe
        if (response) {
          return response;
        }
        
        // Sinon, fait la requête réseau
        return fetch(event.request)
          .then(response => {
            // Vérifie si la réponse est valide
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone la réponse pour la mettre en cache
            const responseToCache = response.clone();
            
            // Vérifier que la requête peut être mise en cache
            if (event.request.url.startsWith('http')) {
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                })
                .catch(error => {
                  console.log('Erreur mise en cache:', error);
                });
            }

            return response;
          });
      })
  );
});

// Mise à jour du service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 