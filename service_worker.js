const CACHE_NAME = 'sebc-certificate-generator-v1';
const urlsToCache = [
'/index.html',
'/',
'https://cdn.tailwindcss.com',
'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
'/manifest.json',
'/SAINTS_Blue.png',
'/SAINTS_White.png',
'/SAINTS_Red.png'
];

self.addEventListener('install', event => {
event.waitUntil(
caches.open(CACHE_NAME)
.then(cache => {
console.log('Opened cache');
return cache.addAll(urlsToCache);
})
);
});

self.addEventListener('fetch', event => {
event.respondWith(
caches.match(event.request)
.then(response => {
if (response) {
return response;
}
return fetch(event.request);
})
);
});