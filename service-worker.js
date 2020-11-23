const CACHE_NAME = "football-info-v1.0";
var api_url = "https://api.football-data.org/v2/";
var urlsToCache = [
    "/",
    "/index.html",
    "/nav.html",
    "/manifest.json",
    "/sw-register.js",
    "/service-worker.js",
    "/match-detail.html",
    "/standing-details.html",
    "/pages/home.html",
    "/pages/match.html",
    "/pages/favorit.html",
    "/pages/contact.html",
    "/assets/css/materialize.min.css",
    "/assets/css/main.css",
    "/assets/js/materialize.min.js",
    "/assets/js/main.js",
    "/assets/js/nav.js",
    "/assets/js/api.js",
    "/assets/js/jquery.min.js",
    "/assets/js/idb.js",
    "/assets/js/database.js",
    "/assets/img/stadium-1.jpg",
    "/assets/img/stadium-2.jpeg",
    "/assets/img/stadium-3.jpeg",
    "/assets/img/maskable-icon-192.png",
    "/assets/img/maskable-icon-512.png",
    "/assets/img/contact/icon-address.png",
    "/assets/img/contact/icon-gmail.png",
    "/assets/img/contact/icon-line.png",
    "/assets/img/contact/icon-twitter.png",
    "/assets/img/contact/icon-whatsapp.png",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2"
];

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", function(event) {
    const online = navigator.onLine;

    if (event.request.url.indexOf(api_url) > -1 && online) {
        event.respondWith(
            caches.open(CACHE_NAME).then(function(cache) {
                return fetch(event.request).then(function(response) {
                    cache.put(event.request.url, response.clone());
                    return response;
                })
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request, { ignoreSearch: true }).then(function(response) {
                return response || fetch(event.request);
            })
        )
    }
});

self.addEventListener("activate", function(event) {
    clients.claim();
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName != CACHE_NAME) {
                        console.log("ServiceWorker: cache " + cacheName + " dihapus");
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('push', function(event) {
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    var options = {
        body: body,
        icon: 'assets/img/notification.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});