// ═══════════════════════════════════════════════════════════
// Service Worker — Clínica Sinergia (offline shell)
// CAMBIAR la fecha de CACHE en cada deploy para forzar actualización
// ═══════════════════════════════════════════════════════════
const CACHE = 'sinergia-shell-v1-2026-06-20';
const SHELL = [
  './',
  './index.html',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL).catch(()=>{}))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // NUNCA cachear datos vivos — siempre red:
  if (url.includes('script.google.com') ||
      url.includes('firestore.googleapis.com') ||
      url.includes('firebasestorage.googleapis.com') ||
      url.includes('identitytoolkit.googleapis.com') ||
      url.includes('securetoken.googleapis.com') ||
      url.includes('api.anthropic.com')) {
    return; // pasa a la red normal, no intercepta
  }
  // Solo GET se cachea
  if (e.request.method !== 'GET') return;
  // Shell + librerías: cache-first con fallback a red, y si todo falla → index.html
  e.respondWith(
    caches.match(e.request).then(hit => {
      if (hit) return hit;
      return fetch(e.request).then(resp => {
        if (resp.ok && (url.includes('cdnjs') || url.includes('gstatic'))) {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return resp;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
