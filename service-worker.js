const CACHE_NAME = 'sebc-certificate-generator-v1';
const urlsToCache = [
'/saints_certificate_app.html',
'/',
'https://cdn.tailwindcss.com',
'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
'https://www.google.com/search?q=https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
'/manifest.json',
'/uploaded:SAINTS_Blue.png',
'/uploaded:SAINTS_White.png',
'/uploaded:SAINTS_Red.png'
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