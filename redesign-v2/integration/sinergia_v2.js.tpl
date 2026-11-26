/* ============================================================================
   SINERGIA · REDISEÑO V2 — capa de PRESENTACIÓN (JS mínimo, aditivo)
   ----------------------------------------------------------------------------
   SOLO mejora presentación/accesibilidad. NO toca handlers, datos, funciones,
   validaciones, permisos ni rutas de guardado. Nunca llama saveDB, Firestore,
   localStorage de datos ni cambia onclick. Si algo falla, degrada en silencio y
   la app real queda EXACTA. Reversión = quitar el <script> (ver REVERSION.md).
   ============================================================================ */
(function () {
  'use strict';
  var LOGO = "__LOGO_DATAURI__";

  /* Login: reemplaza el emoji 🫀 por el LOGO OFICIAL con nombre accesible.
     (Ocultar un emoji por CSS NO lo quita del árbol de accesibilidad; aquí sí
     se retira el texto del emoji y se pone un <img alt>.) */
  function enhanceLogin() {
    var scr = document.getElementById('screen-login');
    if (!scr) return;
    var wrap = scr.querySelector('.login-logo');
    if (!wrap) return;
    var mark = wrap.querySelector('.mark');
    if (mark && !mark.querySelector('img.v2-login-logo')) {
      mark.textContent = '';                 // saca el emoji del árbol de accesibilidad
      mark.setAttribute('aria-hidden', 'false');
      var img = document.createElement('img');
      img.className = 'v2-login-logo';
      img.alt = 'Clínica Sinergia — Fisioterapia y Rehabilitación';
      img.decoding = 'async';
      img.src = LOGO;
      mark.appendChild(img);
      wrap.classList.add('v2-login-ready');  // CSS oculta el wordmark de texto redundante
    }
  }

  function run() { try { enhanceLogin(); } catch (e) { /* silencio: no romper la app */ } }

  if (document.readyState !== 'loading') run();
  else document.addEventListener('DOMContentLoaded', run);
  // reintentos ligeros (p. ej. si el login se re-muestra tras cerrar sesión)
  [300, 900, 2000].forEach(function (t) { setTimeout(run, t); });
})();
