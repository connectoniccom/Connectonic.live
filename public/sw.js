// A simple service worker for PWA installation prompt
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
});

// A fetch handler is required for the app to be considered installable.
self.addEventListener('fetch', (event) => {
  // This is a "network-first" strategy.
  // It's a simple handler that satisfies the browser's PWA criteria.
  event.respondWith(fetch(event.request));
});
