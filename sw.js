const CACHE_NAME = 'meal-planner-v2';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './icon.svg'
];

// Install Event: Cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Fetch Event: Network first, fallback to cache
self.addEventListener('fetch', event => {
    // Don't cache API calls to TheMealDB to ensure fresh recipes, 
    // but cache the app shell (HTML, CSS, JS)
    if (event.request.url.includes('themealdb.com')) {
        event.respondWith(fetch(event.request));
        return;
    }

    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
