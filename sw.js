var staticCacheName = 'sandy-wms-v20';
var urlsToCache = [
        '/',
        '/project1/add2numbers.html',
        '/project1/add2numbers.js',
        '/project2/map.html',
        '/css/my-css.css',
        '/images/foto.jpg',
        '/images/home.png'
      ];
self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('sandy') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );

});

self.addEventListener('fetch', function(event) {
  var requestUrl = new URL(event.request.url);
  if(requestUrl.origin === location.origin){
    if(requestUrl.pathname === '/'){
      event.respondWith(caches.match('/'));
      return;
    }
  }
  event.respondWith(
    caches.match(event.request).then(function(response) {
      console.log(event);
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});