// ═══════════════════════════════════════════════════════════
// Service Worker — Clínica Sinergia (offline shell)
// CAMBIAR la fecha de CACHE en cada deploy para forzar actualización
// ═══════════════════════════════════════════════════════════
const CACHE = 'sinergia-shell-v1-2026-08-15f';
const SHELL = [
  './',
  './index.html',
  './medidor-biomecanico.js?v=2026-08-15f',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js',
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
  const req = e.request;
  const url = req.url;
  // NUNCA cachear datos vivos ni media clínica sensible:
  if (
    url.includes('script.google.com') ||
    url.includes('firestore.googleapis.com') ||
    url.includes('firebasestorage.googleapis.com') ||
    url.includes('storage.googleapis.com') ||
    url.includes('identitytoolkit.googleapis.com') ||
    url.includes('securetoken.googleapis.com') ||
    url.includes('api.anthropic.com')
  ) {
    return;
  }
  if (req.method !== 'GET') return;
  // Navegación: red-primero CON TIMEOUT. En datos móviles con ruteo IPv6 degradado (ej. AT&T MX),
  // la petición a GitHub Pages no falla — se queda COLGADA — y sin timeout la app espera en blanco
  // indefinidamente. Con timeout: si la red no responde a tiempo y HAY copia guardada, se abre la
  // copia en ~3.5 s. Si NO hay copia (primera instalación) damos más margen (12 s) porque no hay
  // nada que servir. Con buena red (WiFi) se comporta igual que antes: trae lo último y lo cachea.
  if (req.mode === 'navigate' || req.destination === 'document') {
    e.respondWith((async () => {
      const cached = await caches.match('./index.html');
      const limiteMs = cached ? 3500 : 12000;
      try {
        const resp = await Promise.race([
          fetch(req),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout-red')), limiteMs))
        ]);
        if (resp && resp.ok) {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put('./index.html', copy)).catch(()=>{});
        }
        return resp;
      } catch (err) {
        return cached || (await caches.match('./')) || fetch(req);
      }
    })());
    return;
  }
  // Librerías estáticas: cache-first + refresh silencioso
  if (url.includes('gstatic.com/firebasejs') || url.includes('cdnjs.cloudflare.com') || url.includes('cdn.jsdelivr.net') || url.includes('docs.opencv.org')) {
    e.respondWith(
      caches.match(req).then(hit => {
        const fetchAndCache = fetch(req).then(resp => {
          if (resp && resp.ok) {
            const copy = resp.clone();
            caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
          }
          return resp;
        });
        return hit || fetchAndCache;
      })
    );
    return;
  }
  // Mismo origen (no navegación): cache-first, NUNCA devolver index.html como fallback
  if (new URL(url).origin === self.location.origin) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).catch(() => new Response('', {status:504, statusText:'Offline'})))
    );
  }
});
