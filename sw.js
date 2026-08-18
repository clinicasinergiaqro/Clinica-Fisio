// ═══════════════════════════════════════════════════════════
// Service Worker — Clínica Sinergia (offline shell)
// CAMBIAR la fecha de CACHE en cada deploy para forzar actualización
// ═══════════════════════════════════════════════════════════
const CACHE = 'sinergia-shell-v1-2026-08-18h';
const SHELL = [
  './',
  './index.html',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// El botón "Forzar actualización" puede pedir que un SW en espera tome control de inmediato.
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// index.html y './' se piden SIEMPRE con no-store + cache-buster: GitHub Pages sirve el HTML con
// Cache-Control de ~10 min y, sin esto, el SW revalida contra ESE caché HTTP y vuelve a guardar la
// versión vieja → la app "no se actualiza" hasta que expira. Con cache:'no-store'+?v= se salta ese
// caché y trae el HTML recién publicado de una vez.
function _fetchIndexFresco() {
  return fetch('./index.html?swfresh=' + Date.now(), { cache: 'no-store' });
}
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    try { await c.addAll(SHELL.filter(u => u !== './' && u !== './index.html')); } catch(_) {}
    try {
      const fresh = await _fetchIndexFresco();
      if (fresh && fresh.ok) { await c.put('./index.html', fresh.clone()); await c.put('./', fresh.clone()); }
    } catch(_) {}
  })());
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
  // Navegación: CACHÉ-PRIMERO (stale-while-revalidate). En datos móviles mexicanos (AT&T y Telcel),
  // la petición a GitHub Pages se queda COLGADA por ruteo IPv6 degradado. Antes esperábamos 3.5s a la
  // red antes de servir la copia → apertura lenta y, si la red engañaba, versión vieja igual. Ahora:
  // si HAY copia, se abre AL INSTANTE desde ella (funciona con datos malos o sin señal) y se revalida
  // en 2º plano (con timeout, para no dejar el fetch colgado) para la PRÓXIMA apertura; el auto-update
  // de la app aplica la versión nueva cuando sea seguro y la red lo permita. Sin copia (primera
  // instalación) sí vamos a la red con margen amplio.
  if (req.mode === 'navigate' || req.destination === 'document') {
    e.respondWith((async () => {
      const cached = await caches.match('./index.html');
      if (cached) {
        const ctrl = ('AbortController' in self) ? new AbortController() : null;
        const to = setTimeout(() => { try { ctrl && ctrl.abort(); } catch(_){} }, 6000);
        // Revalidación FRESCA (no-store): trae el HTML recién publicado, no el del caché HTTP de GitHub.
        fetch('./index.html?swfresh=' + Date.now(), ctrl ? { cache:'no-store', signal: ctrl.signal } : { cache:'no-store' }).then(resp => {
          clearTimeout(to);
          if (resp && resp.ok) { const copy = resp.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)).catch(()=>{}); }
        }).catch(() => { clearTimeout(to); });
        return cached;
      }
      try {
        const resp = await Promise.race([
          _fetchIndexFresco(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout-red')), 12000))
        ]);
        if (resp && resp.ok) {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put('./index.html', copy)).catch(()=>{});
        }
        return resp;
      } catch (err) {
        return (await caches.match('./')) || fetch(req);
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
