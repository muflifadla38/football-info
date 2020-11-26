importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
    console.log(`Workbox berhasil dimuat`);

    workbox.precaching.precacheAndRoute([
        { url: '/', revision: '1' },
        { url: '/index.html', revision: '1' },
        { url: '/manifest.json', revision: '1' },
        { url: '/sw-register.js', revision: '1' },
        { url: '/service-worker.js', revision: '1' },
        { url: '/nav.html', revision: '1' },
        { url: '/match-detail.html', revision: '1' },
        { url: '/standing-details.html', revision: '1' },
        { url: '/pages/home.html', revision: '1' },
        { url: '/pages/match.html', revision: '1' },
        { url: '/pages/favorit.html', revision: '1' },
        { url: '/pages/contact.html', revision: '1' },
        { url: '/assets/css/materialize.min.css', revision: '1' },
        { url: '/assets/css/main.css', revision: '1' },
        { url: '/assets/js/materialize.min.js', revision: '1' },
        { url: '/assets/js/api.js', revision: '1' },
        { url: '/assets/js/nav.js', revision: '1' },
        { url: '/assets/js/main.js', revision: '1' },
        { url: '/assets/js/jquery.min.js', revision: '1' },
        { url: '/assets/js/idb.js', revision: '1' },
        { url: '/assets/js/database.js', revision: '1' },
        { url: '/assets/img/stadium-1.jpg', revision: '1' },
        { url: '/assets/img/stadium-2.jpeg', revision: '1' },
        { url: '/assets/img/stadium-3.jpeg', revision: '1' },
        { url: '/assets/img/notification.png', revision: '1' },
        { url: '/assets/img/maskable-icon-192.png', revision: '1' },
        { url: '/assets/img/maskable-icon-512.png', revision: '1' },
        { url: '/assets/img/contact/icon-address.png', revision: '1' },
        { url: '/assets/img/contact/icon-gmail.png', revision: '1' },
        { url: '/assets/img/contact/icon-line.png', revision: '1' },
        { url: '/assets/img/contact/icon-twitter.png', revision: '1' },
        { url: '/assets/img/contact/icon-whatsapp.png', revision: '1' },
        { url: 'https://fonts.googleapis.com/icon?family=Material+Icons', revision: '1' },
        { url: 'https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2', revision: '1' }
    ], {
        ignoreURLParametersMatching: [/.*/]
    });

    workbox.routing.registerRoute(
        /\.(?:png|gif|jpg|jpeg|svg)$/,
        workbox.strategies.cacheFirst({
            cacheName: 'images',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 60,
                    maxAgeSeconds: 30 * 24 * 60 * 60,
                }),
            ],
        }),
    );

    workbox.routing.registerRoute(
        new RegExp('/pages/'),
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'pages'
        })
    );

    workbox.routing.registerRoute(
        new RegExp('https://api.football-data.org/v2/'),
        workbox.strategies.staleWhileRevalidate()
    );

    workbox.routing.registerRoute(
        /\.(?:js|css)$/,
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'resource-web',
        })
    );

    workbox.routing.registerRoute(
        /^https:\/\/fonts\.googleapis\.com/,
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'google-fonts-stylesheets',
        })
    );

    workbox.routing.registerRoute(
        /^https:\/\/fonts\.gstatic\.com/,
        workbox.strategies.cacheFirst({
            cacheName: 'google-fonts-webfonts',
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
                new workbox.expiration.Plugin({
                    maxAgeSeconds: 60 * 60 * 24 * 365,
                    maxEntries: 30,
                }),
            ],
        })
    );

} else {
    console.log(`Workbox gagal dimuat`);
}

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