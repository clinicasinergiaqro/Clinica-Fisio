/* ============================================================================
   SINERGIA · REDISEÑO V2 — MOTOR DE PRESENTACIÓN (reorganización visual)
   ----------------------------------------------------------------------------
   SOLO presentación/accesibilidad. Reorganiza la PRESENTACIÓN (permitido):
   logo+curva en heros, tabs->mosaico, S/O/A/P segmentado, iconos de línea
   (sin emojis), tiles. NUNCA toca handlers/datos/funciones: los controles
   nuevos REENVÍAN el click al control real (p.ej. la tab real) o invocan la
   misma función global. Si algo falla, degrada en silencio (try/catch) y la
   app queda EXACTA. Reversión = quitar el <script> (ver REVERSION.md).
   ============================================================================ */
(function () {
  'use strict';
  var LOGO = "__LOGO_DATAURI__";
  var EMBLEM = "__EMBLEMA_DATAURI__";

  /* ---- Iconos de línea (reemplazan emojis decorativos) ---- */
  var P = {
    clipboard:"<rect x='5' y='4' width='14' height='17' rx='2'/><path d='M9 4V3h6v1'/><path d='M8 9h8M8 13h8M8 17h5'/>",
    clipcheck:"<rect x='5' y='4' width='14' height='17' rx='2'/><path d='M9 4V3h6v1'/><path d='m8.5 13 2 2 4-4.5'/>",
    filepen:"<path d='M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7'/><path d='M14 3v5h5'/><path d='M19 12.5 21 14l-4 4-2 .5.5-2z'/>",
    scan:"<path d='M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2'/><path d='M4 12h16'/>",
    chart:"<path d='M4 20h16'/><rect x='5' y='11' width='3.2' height='7'/><rect x='10.4' y='7' width='3.2' height='11'/><rect x='15.8' y='4' width='3.2' height='14'/>",
    run:"<circle cx='13.5' cy='5' r='1.7'/><path d='M12 8l-3 4 3 2 1 5'/><path d='M12 12l4 1 2 4'/><path d='M4 11l3-1 2 2'/>",
    shield:"<path d='M12 3l7 3v5c0 4.6-3 7.6-7 9-4-1.4-7-4.4-7-9V6z'/><path d='M12 9v5M9.5 11.5h5'/>",
    mic:"<rect x='9' y='3' width='6' height='11' rx='3'/><path d='M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6'/>",
    gauge:"<path d='M4 18a8 8 0 1 1 16 0'/><path d='M12 18l4-5'/><circle cx='12' cy='18' r='1'/>",
    dumbbell:"<path d='M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10'/>",
    history:"<path d='M3 12a9 9 0 1 0 3-6.7L3 8'/><path d='M3 4v4h4'/><path d='M12 8v4l3 2'/>",
    plusbox:"<rect x='4' y='4' width='16' height='16' rx='3'/><path d='M12 9v6M9 12h6'/>",
    droplet:"<path d='M12 3s6 6.5 6 10a6 6 0 0 1-12 0c0-3.5 6-10 6-10z'/>",
    headset:"<path d='M4 14v-2a8 8 0 0 1 16 0v2'/><rect x='3' y='13' width='4' height='6' rx='1.5'/><rect x='17' y='13' width='4' height='6' rx='1.5'/><path d='M20 19a3.5 3.5 0 0 1-3.5 3H14'/>",
    calendar:"<rect x='4' y='5' width='16' height='16' rx='2'/><path d='M8 3v4M16 3v4M4 10h16'/>",
    user:"<circle cx='12' cy='8' r='3.6'/><path d='M5 20a7 7 0 0 1 14 0'/>",
    steth:"<path d='M6 3v5a4 4 0 0 0 8 0V3'/><path d='M10 14v2a5 5 0 0 0 10 0v-1'/><circle cx='20' cy='12' r='2'/>",
    search:"<circle cx='11' cy='11' r='7'/><path d='m20 20-3.6-3.6'/>",
    bell:"<path d='M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6'/><path d='M10 20a2 2 0 0 0 4 0'/>",
    clock:"<circle cx='12' cy='12' r='8'/><path d='M12 8v4l3 2'/>",
    checkc:"<circle cx='12' cy='12' r='8'/><path d='m8.5 12 2.4 2.4 4.6-5'/>",
    bulb:"<path d='M9 18h6M10 21h4'/><path d='M12 3a6 6 0 0 0-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 0 0-4-10z'/>",
    camera:"<rect x='3' y='7' width='18' height='13' rx='2'/><circle cx='12' cy='13' r='3.4'/><path d='M8.5 7 10 5h4l1.5 2'/>",
    dots:"<circle cx='5' cy='12' r='1.4'/><circle cx='12' cy='12' r='1.4'/><circle cx='19' cy='12' r='1.4'/>",
    save:"<path d='M5 4h11l3 3v13H5z'/><path d='M8 4v5h7V4M8 20v-6h8v6'/>",
    warn:"<path d='M12 4 3 19h18z'/><path d='M12 10v4M12 17h.01'/>",
    x:"<path d='M6 6l12 12M18 6 6 18'/>",
    share:"<circle cx='6' cy='12' r='2.4'/><circle cx='18' cy='6' r='2.4'/><circle cx='18' cy='18' r='2.4'/><path d='m8.1 10.9 7.8-3.8M8.1 13.1l7.8 3.8'/>",
    link:"<path d='M10 14a4 4 0 0 0 6 0l2-2a4 4 0 1 0-6-6l-1 1'/><path d='M14 10a4 4 0 0 0-6 0l-2 2a4 4 0 1 0 6 6l1-1'/>",
    moon:"<path d='M20 14a8 8 0 1 1-10-10 7 7 0 0 0 10 10z'/>",
    hands:"<path d='M7 11V5a1.5 1.5 0 0 1 3 0M10 11V4a1.5 1.5 0 0 1 3 0v6M13 11V5.5a1.5 1.5 0 0 1 3 0V13a6 6 0 0 1-6 6H9a4 4 0 0 1-3-1.8L4 15'/>",
    list:"<path d='M8 6h12M8 12h12M8 18h12'/><circle cx='4' cy='6' r='1'/><circle cx='4' cy='12' r='1'/><circle cx='4' cy='18' r='1'/>",
    pill:"<rect x='3' y='8' width='18' height='8' rx='4' transform='rotate(45 12 12)'/><path d='M8.5 8.5 15.5 15.5'/>",
    angle:"<path d='M4 20h16M4 20V8M4 20l13-9'/>",
    scale:"<path d='M12 4v16M7 20h10M6 8h12l-3 6a3 3 0 0 1-6 0zM6 8 4 13a2.5 2.5 0 0 0 4 0zM18 8l2 5a2.5 2.5 0 0 1-4 0z'/>"
  };
  function svg(key, cls) {
    var p = P[key]; if (!p) return '';
    return "<span class='v2-ic " + (cls || '') + "' aria-hidden='true'><svg viewBox='0 0 24 24'>" + p + "</svg></span>";
  }
  // emoji -> icono (chrome decorativo)
  var EMAP = {
    '📋':'clipboard','🩺':'steth','📄':'filepen','📝':'filepen','🦴':'run','🏃':'run','📊':'chart',
    '🛡':'shield','🛡️':'shield','💊':'pill','📷':'camera','📸':'camera','⚠':'warn','⚠️':'warn',
    '🎤':'mic','💡':'bulb','🔎':'search','🔍':'search','🌙':'moon','👤':'user','🧴':'droplet',
    '🆘':'headset','➕':'plusbox','➖':'x','📅':'calendar','🗓':'calendar','✅':'checkc','✔':'checkc',
    '❌':'x','🙌':'hands','📲':'share','🔗':'link','⏱':'clock','⏰':'clock','🔄':'history','⚖':'scale','⚖️':'scale',
    '📐':'angle','🔔':'bell','📁':'clipboard','🏥':'shield','📈':'chart','📉':'chart','🧰':'clipboard','👁':'search','🗑':'x'
  };
  // regex de emojis frecuentes (para detectar al inicio del texto)
  var EMRE = /[⌚-➿⬀-⯿️\u{1F000}-\u{1FAFF}←-⇿☀-⛿]/u;

  function esc(root) { return (root || document); }

  /* Reemplaza un emoji inicial en un elemento de CHROME por su icono de línea. */
  function deEmojiEl(el) {
    if (!el || el.__v2em) return;
    // buscar el primer nodo de texto con emoji al inicio
    for (var i = 0; i < el.childNodes.length; i++) {
      var n = el.childNodes[i];
      if (n.nodeType === 3) {
        var txt = n.nodeValue;
        var m = txt.match(/^\s*([←-⯿☀-➿️\u{1F000}-\u{1FAFF}]+)\s?/u);
        if (m) {
          var key = null, g = m[1];
          for (var c of g) { if (EMAP[c]) { key = EMAP[c]; break; } }
          // quitar el/los emoji del texto
          n.nodeValue = txt.replace(/^\s*[←-⯿☀-➿️\u{1F000}-\u{1FAFF}]+\s?/u, '');
          if (key) {
            var span = document.createElement('span');
            span.innerHTML = svg(key);
            el.insertBefore(span.firstChild, n);
          }
          el.__v2em = 1;
          return;
        }
      } else if (n.nodeType === 1) {
        // si el primer hijo visible es un elemento, no arriesgar
        break;
      }
    }
    el.__v2em = 1;
  }
  function deEmojiIn(root, sel) {
    try { root.querySelectorAll(sel).forEach(deEmojiEl); } catch (e) {}
  }

  /* ---- Curva dorada de marca (para cualquier hero navy) ---- */
  function addCurve(headerEl) {
    if (!headerEl || headerEl.querySelector('.v2-curve')) return;
    headerEl.style.position = headerEl.style.position || 'relative';
    var curve = document.createElement('div'); curve.className = 'v2-curve';
    headerEl.insertBefore(curve, headerEl.firstChild);
  }
  /* ---- Marca (emblema + wordmark blanco) para heros altos ---- */
  function brandHero(headerEl) {
    if (!headerEl) return;
    addCurve(headerEl);
    if (headerEl.querySelector('.v2-hero-logo')) return;
    var logo = document.createElement('div'); logo.className = 'v2-hero-logo';
    logo.innerHTML = "<img class='em' src='" + EMBLEM + "' alt='' aria-hidden='true'>" +
      "<span class='wm'><b>CLÍNICA SINERGIA</b><span>Fisioterapia y Rehabilitación</span></span>";
    headerEl.insertBefore(logo, headerEl.firstChild);
  }
  /* quita un emoji inicial SIN sustituirlo (p.ej. en tabs que ya reciben icono) */
  function stripEmoji(el) {
    if (!el || el.__v2strip) return; el.__v2strip = 1;
    for (var i = 0; i < el.childNodes.length; i++) {
      var n = el.childNodes[i];
      if (n.nodeType === 3 && /^\s*[←-⯿☀-➿️\u{1F000}-\u{1FAFF}]/u.test(n.nodeValue)) {
        n.nodeValue = n.nodeValue.replace(/^\s*[←-⯿☀-➿️\u{1F000}-\u{1FAFF}]+\s?/u, ''); return;
      } else if (n.nodeType === 1) break;
    }
  }

  /* ---- LOGIN ---- */
  function enhanceLogin() {
    var scr = document.getElementById('screen-login'); if (!scr) return;
    var wrap = scr.querySelector('.login-logo'); if (!wrap) return;
    var mark = wrap.querySelector('.mark');
    if (mark && !mark.querySelector('img.v2-login-logo')) {
      mark.textContent = ''; mark.setAttribute('aria-hidden', 'false');
      var img = document.createElement('img');
      img.className = 'v2-login-logo';
      img.alt = 'Clínica Sinergia — Fisioterapia y Rehabilitación';
      img.decoding = 'async'; img.src = LOGO;
      mark.appendChild(img); wrap.classList.add('v2-login-ready');
    }
  }

  /* ---- EXPEDIENTE: hero + tabs -> mosaico con iconos ---- */
  var TABIC = { historia:'clipboard', valoracion:'clipcheck', soap:'filepen', estudios:'scan',
    reporte:'chart', reportes:'chart', biomecanica:'run', protocolo:'list', ejercicios:'dumbbell',
    biomecánica:'run' };
  function iconPorTexto(txt) {
    var s = (txt || '').toLowerCase();
    if (/biomec/.test(s)) return 'run'; if (/ejercic/.test(s)) return 'dumbbell';
    if (/protocol/.test(s)) return 'list'; if (/consent/.test(s)) return 'clipcheck';
    if (/report/.test(s)) return 'chart'; if (/estudi/.test(s)) return 'scan';
    if (/valorac/.test(s)) return 'clipcheck'; if (/soap/.test(s)) return 'filepen';
    if (/histor/.test(s)) return 'clipboard'; if (/derma/.test(s)) return 'droplet';
    return 'clipboard';
  }
  function skinExpediente() {
    var scr = document.getElementById('screen-expediente'); if (!scr || !scr.classList.contains('active')) return;
    brandHero(scr.querySelector('.exp-header'));
    scr.querySelectorAll('.tabs .tab').forEach(function (t) {
      if (t.__v2ic) return;
      var on = t.getAttribute('onclick') || '';
      var m = on.match(/renderExpediente\(['"]([a-zñáéíóú]+)['"]/i);
      var key = m ? (TABIC[m[1].toLowerCase()] || iconPorTexto(t.textContent)) : iconPorTexto(t.textContent);
      stripEmoji(t);  // quita emoji inicial SIN icono (evita doble icono)
      var ic = document.createElement('span');
      ic.innerHTML = svg(key, key === 'scan' ? 'boxed' : '');
      t.insertBefore(ic.firstChild, t.firstChild);
      t.__v2ic = 1;
    });
    deEmojiIn(scr, '.section-title, .btn-primary, .btn-secondary, .exp-pill, .seg-toggle-label');
  }

  /* ---- SOAP: hero + control segmentado S/O/A/P ---- */
  function soapSections() {
    var scr = document.getElementById('screen-soap'); if (!scr) return null;
    var titles = Array.prototype.slice.call(scr.querySelectorAll('.form-section-title, .soap-s, .soap-o, .soap-a, .soap-p'));
    var map = [[/^\s*S\s*[—–-]/, 'S', 'Subjetivo'], [/^\s*O\s*[—–-]/, 'O', 'Objetivo'], [/^\s*A\s*[—–-]/, 'A', 'Análisis'], [/^\s*P\s*[—–-]/, 'P', 'Plan']];
    var out = [];
    map.forEach(function (w) {
      var el = titles.find(function (t) { return w[0].test((t.textContent || '').trim()); });
      out.push({ el: el ? (el.closest('.form-section, .soap-section, .section-card') || el) : null, k: w[1], t: w[2] });
    });
    return out.every(function (o) { return o.el; }) ? out : null;
  }
  function skinSOAP() {
    var scr = document.getElementById('screen-soap'); if (!scr || !scr.classList.contains('active')) return;
    addCurve(scr.querySelector('.topbar'));   // barra delgada: solo curva (sin encimar el título)
    var full = document.getElementById('soap-full'); if (!full) return;
    if (!document.querySelector('.v2-soapnav')) {
      var secs = soapSections();
      if (secs) {
        var nav = document.createElement('div'); nav.className = 'v2-soapnav';
        secs.forEach(function (s, i) {
          var b = document.createElement('button'); b.type = 'button';
          b.innerHTML = "<span class='k'>" + s.k + "</span><span class='t'>" + s.t + "</span>";
          if (i === 0) b.classList.add('active');
          b.addEventListener('click', function () {
            nav.querySelectorAll('button').forEach(function (x) { x.classList.remove('active'); });
            b.classList.add('active');
            try { s.el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { try { s.el.scrollIntoView(); } catch (e2) {} }
          });
          nav.appendChild(b);
        });
        full.insertBefore(nav, full.firstChild);
      }
    }
    deEmojiIn(scr, '.soap-label, .section-title, .btn-primary, .btn-secondary, .seg-toggle-label, .form-label');
  }

  /* ---- AGENDA: iconos de chrome (los tiles ricos requieren datos; se de-emoji) ---- */
  function skinAgenda() {
    var scr = document.getElementById('screen-agenda'); if (!scr || !scr.classList.contains('active')) return;
    deEmojiIn(scr, '.section-title, .btn-primary, .btn-secondary, .badge, .exp-pill');
  }

  /* ---- aplicar todo (idempotente) ---- */
  var busy = false;
  function apply() {
    if (busy) return; busy = true;
    try { enhanceLogin(); } catch (e) {}
    try { skinExpediente(); } catch (e) {}
    try { skinSOAP(); } catch (e) {}
    try { skinAgenda(); } catch (e) {}
    busy = false;
  }

  function boot() {
    apply();
    try {
      var mo = new MutationObserver(function () { if (!busy) requestAnimationFrame(apply); });
      mo.observe(document.body, { subtree: true, childList: true });
    } catch (e) {}
    [250, 700, 1500, 3000].forEach(function (t) { setTimeout(apply, t); });
  }
  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
