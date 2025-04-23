self.addEventListener('install', (event) => {
  console.log('📦 Service Worker installed');
  self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activated');
  return self.clients.claim(); // Take control of all tabs
});

self.addEventListener('fetch', (event) => {
  // Optional: Add caching logic here if needed
});
