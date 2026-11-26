/* ============================================================================
   SINERGIA · REDISEÑO PREMIUM V2.0 — CAPA DE PRESENTACIÓN (ADITIVA)
   ----------------------------------------------------------------------------
   Reskin visual de la app REAL (index.html). SOLO presentación:
     · Se carga DESPUÉS del <style> inline → gana la cascada por orden.
     · No toca funciones, datos, persistencia, permisos ni algoritmos.
     · No cambia el significado de los colores de SEGURIDAD clínica
       (verde/rojo/ámbar y sus -light se dejan EXACTOS como en la app).
     · Reversión = quitar el <link> de index.html y borrar este archivo.
   Módulos cubiertos en esta tanda: GLOBAL · 1 Login/identidad · 2 Agenda/directorio.
   Generado desde sinergia_v2.css.tpl por gen_css.py (emblema incrustado).
   ============================================================================ */

/* ---- 1) TOKENS ESTÉTICOS (no toca semántica de seguridad) ---- */
:root{
  /* marca (idénticos a la app; se reafirman) */
  --navy:#1B3A6B; --navy-dark:#122950; --navy-light:#2A4F8F;
  --gold:#C9A84C; --gold-light:#E8C96A; --v2-gold-deep:#B8932F;
  /* neutros refinados (más aire + jerarquía de tinta) */
  --gray-50:#F5F7FA; --gray-100:#EDF1F7; --gray-200:#E2E8F0;
  --gray-400:#94A3B8; --gray-600:#64748B; --gray-800:#172538;
  /* radios y sombras premium (puramente estético) */
  --radius:16px; --radius-sm:11px;
  --shadow:0 1px 2px rgba(18,41,80,.05), 0 10px 26px -14px rgba(18,41,80,.22);
  /* nuevos tokens que usa SOLO este reskin */
  --v2-ink:#172538; --v2-ink2:#64748B;
  --v2-border:#E2E8F0; --v2-surface:#FFFFFF;
  --v2-shadow-sm:0 1px 2px rgba(18,41,80,.06);
  --v2-shadow-card:0 1px 2px rgba(18,41,80,.04), 0 8px 22px -12px rgba(18,41,80,.18);
  --v2-derma:#8E3B6E; --v2-derma-light:#F7EBF2;
  /* NOTA: --green/--red/--amber y sus -light NO se redefinen (seguridad). */
}

/* ---- 2) GLOBAL: tipografía y fondo más premium ---- */
body{
  background:var(--gray-50);
  -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;
  /* sin letter-spacing global: ensancharía cada cadena y podría inclinar
     el envoltorio de nombres largos (cero reflow). */
}
/* títulos un pelín más apretados (SOLO encoge → nunca genera envoltorios) */
.login-logo h1, .topbar-title{letter-spacing:-.2px}

/* ============================================================================
   MÓDULO 1 · LOGIN / IDENTIDAD
   ============================================================================ */
#screen-login{
  background:
    radial-gradient(120% 70% at 85% -10%, rgba(201,168,76,.22) 0%, rgba(201,168,76,0) 46%),
    radial-gradient(120% 80% at -15% 110%, rgba(42,79,143,.55) 0%, rgba(42,79,143,0) 50%),
    linear-gradient(165deg,#0E2242 0%, var(--navy-dark) 48%, #17356B 100%);
  position:relative; overflow:hidden;
}
/* arco dorado decorativo (marca), no interfiere con el toque */
#screen-login::before{
  content:""; position:absolute; top:-18%; right:-28%;
  width:78vw; height:78vw; max-width:420px; max-height:420px;
  border-radius:50%;
  border:2px solid rgba(201,168,76,.28);
  box-shadow:0 0 0 22px rgba(201,168,76,.05) inset;
  pointer-events:none;
}
#screen-login::after{
  content:""; position:absolute; bottom:-30%; left:-24%;
  width:70vw; height:70vw; max-width:380px; max-height:380px;
  border-radius:50%;
  background:radial-gradient(circle at 60% 40%, rgba(42,79,143,.42), rgba(42,79,143,0) 62%);
  pointer-events:none;
}
.login-box{
  background:rgba(255,255,255,.07);
  border:1px solid rgba(255,255,255,.14);
  border-radius:24px;
  padding:36px 30px 30px;
  box-shadow:0 30px 70px -30px rgba(0,0,0,.6), 0 1px 0 rgba(255,255,255,.08) inset;
  position:relative; z-index:1;
}
.login-logo{margin-bottom:26px}
/* emblema oficial de marca en lugar del emoji 🫀 */
.login-logo .mark{
  width:92px; height:92px; margin:0 auto 16px;
  background:#fff url("__EMBLEMA_DATAURI__") center/84% no-repeat;
  border-radius:50%;
  box-shadow:0 10px 30px -10px rgba(0,0,0,.5), 0 0 0 1px rgba(201,168,76,.45);
  font-size:0; /* oculta el emoji del markup real */
}
.login-logo h1{font-size:23px; font-weight:800; letter-spacing:.2px}
.login-logo p{font-size:12.5px; color:rgba(255,255,255,.6); letter-spacing:.3px; margin-top:5px}
.login-box label{font-size:11px; letter-spacing:.9px; color:rgba(255,255,255,.62)}
.login-box input{
  background:rgba(255,255,255,.09);
  border:1px solid rgba(255,255,255,.2);
  border-radius:13px;
  padding:14px 16px;
  transition:border-color .18s, background .18s, box-shadow .18s;
}
.login-box input:focus{
  border-color:var(--gold);
  background:rgba(255,255,255,.14);
  box-shadow:0 0 0 3px rgba(201,168,76,.18);
}
/* botón "ver contraseña": tap target 44px, centrado, nunca se desborda */
#btn-ver-pass{
  width:44px; height:44px; right:4px !important;
  display:flex; align-items:center; justify-content:center;
  font-size:17px !important; color:rgba(255,255,255,.6) !important;
  border-radius:10px;
}
#btn-ver-pass:active{background:rgba(255,255,255,.12)}
/* el input de contraseña deja sitio al botón */
#login-pass{padding-right:50px !important}
.btn-login{
  background:linear-gradient(180deg,var(--gold-light),var(--gold));
  color:var(--navy-dark); font-weight:800; border-radius:13px; padding:15px;
  box-shadow:0 10px 24px -12px rgba(201,168,76,.7);
  letter-spacing:.2px;
}
.btn-login:active{transform:translateY(1px) scale(.995)}
/* botón offline: coherente, discreto */
#screen-login .btn-secondary{
  border-radius:13px; border-color:rgba(255,255,255,.3) !important;
  background:rgba(255,255,255,.04) !important; font-weight:700;
}
.login-error{border-radius:11px}

/* chip de versión discreto (sirve sobre navy y sobre claro) */
#app-version-chip{
  background:rgba(18,41,80,.14) !important;
  color:var(--v2-ink2) !important;
  border:1px solid var(--v2-border) !important;
  border-radius:999px !important; font-weight:600 !important;
  letter-spacing:.3px; backdrop-filter:blur(6px);
}
#screen-login ~ #app-version-chip, body:has(#screen-login.active) #app-version-chip{
  background:rgba(255,255,255,.1) !important; color:rgba(255,255,255,.7) !important;
  border-color:rgba(255,255,255,.18) !important;
}

/* ============================================================================
   MÓDULO 2 · AGENDA / DIRECTORIO  (+ chrome global: topbar, cards, nav)
   ============================================================================ */

/* ---- Topbar premium ---- */
.topbar{
  background:linear-gradient(120deg,var(--navy-dark) 0%, var(--navy) 78%);
  height:58px; box-shadow:0 1px 0 rgba(255,255,255,.05) inset, 0 6px 18px -10px rgba(18,41,80,.5);
}
.topbar-title{font-size:16px; font-weight:800; letter-spacing:.1px}
.topbar-sub{font-size:11px; color:rgba(255,255,255,.62)}
.topbar-avatar{
  background:linear-gradient(180deg,var(--gold-light),var(--gold));
  box-shadow:0 2px 8px -2px rgba(201,168,76,.6), 0 0 0 1px rgba(255,255,255,.12) inset;
}

/* ---- Tarjetas premium (sin tocar contenido) ---- */
.card{
  border-radius:var(--radius);
  border:1px solid var(--v2-border);
  box-shadow:var(--v2-shadow-card);
  background:var(--v2-surface);
}

/* ---- Badges/chips de estado: SOLO forma de pastilla (width-neutral).
   NO se toca padding/peso/tracking/tamaño → cero reflow de la columna del
   nombre en las tarjetas. COLOR intacto (significado de seguridad). ---- */
.badge{border-radius:999px}

/* ---- Botones ---- */
.btn-primary{
  background:linear-gradient(180deg,var(--navy-light),var(--navy));
  border-radius:13px; box-shadow:0 8px 20px -12px rgba(18,41,80,.6);
  letter-spacing:.2px;
}
.btn-primary:active{transform:translateY(1px) scale(.995)}
.btn-secondary{border-radius:13px}

/* ---- Inputs / selects premium ---- */
.form-input, .mod-detail-input{color:var(--v2-ink)}
.mod-detail-input{border-radius:9px; border-color:var(--v2-border)}

/* ---- Chips rápidos: pill premium ---- */
.chip-quick{border-radius:999px; border-color:var(--v2-border)}

/* ---- Barra de navegación inferior premium ---- */
.bottom-nav{
  border-top:1px solid var(--v2-border);
  box-shadow:0 -8px 24px -18px rgba(18,41,80,.3);
  background:rgba(255,255,255,.96); backdrop-filter:blur(8px);
}
.nav-item{color:var(--v2-ink2); font-size:10px; letter-spacing:.2px}
.nav-item.active{color:var(--navy)}
.nav-item.active svg{filter:drop-shadow(0 2px 6px rgba(27,58,107,.25))}

/* etiquetas/typo de campos: tinta más legible */
.field-value{color:var(--v2-ink)}
.field-label{color:var(--v2-ink2)}
