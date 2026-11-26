/* ============================================================================
   SINERGIA · REDISEÑO PREMIUM V2.0 — CAPA DE PRESENTACIÓN (ADITIVA)
   ----------------------------------------------------------------------------
   Reskin visual de la app REAL (index.html). SOLO presentación:
     · Se carga DESPUÉS del <style> inline → gana la cascada por orden.
     · No toca funciones, datos, persistencia, permisos ni algoritmos.
     · No cambia el significado de los colores de SEGURIDAD clínica
       (verde/rojo/ámbar y sus -light se dejan EXACTOS como en la app).
     · Reversión = quitar el <link>/<script> de index.html y borrar estos archivos.
   Módulos: GLOBAL · 1 Login/identidad · 2 Agenda/directorio.
   Generado desde sinergia_v2.css.tpl por gen_css.py (emblema incrustado).
   ============================================================================ */

/* ---- 1) TOKENS ESTÉTICOS (no toca semántica de seguridad) ---- */
:root{
  --navy:#1B3A6B; --navy-dark:#122950; --navy-light:#2A4F8F;
  --gold:#C9A84C; --gold-light:#E8C96A; --v2-gold-deep:#B8932F;
  --gray-50:#F5F7FA; --gray-100:#EDF1F7; --gray-200:#E2E8F0;
  --gray-400:#94A3B8; --gray-600:#64748B; --gray-800:#172538;
  --radius:16px; --radius-sm:11px;
  --shadow:0 1px 2px rgba(18,41,80,.05), 0 10px 26px -14px rgba(18,41,80,.22);
  --v2-ink:#172538; --v2-ink2:#64748B;
  --v2-border:#E2E8F0; --v2-surface:#FFFFFF;
  --v2-shadow-sm:0 1px 2px rgba(18,41,80,.06);
  --v2-shadow-card:0 1px 2px rgba(18,41,80,.04), 0 8px 22px -12px rgba(18,41,80,.18);
  --v2-derma:#8E3B6E; --v2-derma-light:#F7EBF2;
  /* NOTA: --green/--red/--amber y sus -light NO se redefinen (seguridad). */
}

/* ---- 2) GLOBAL ---- */
body{
  background:var(--gray-50);
  -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;
  /* sin letter-spacing global (evita reflow de nombres largos). */
}
.login-logo h1, .topbar-title{letter-spacing:-.2px}  /* SOLO encoge → sin envoltorios */

/* ============================================================================
   MÓDULO 1 · LOGIN / IDENTIDAD  (referencia V2: fondo CLARO + logo oficial)
   ============================================================================ */
#screen-login{
  background:
    radial-gradient(120% 70% at 112% -24%, rgba(27,58,107,.10), transparent 55%),
    radial-gradient(90% 60% at -24% 122%, rgba(201,168,76,.14), transparent 58%),
    var(--gray-50);
  align-items:center; justify-content:center;
  padding:24px; overflow-y:auto;     /* teclado: el login puede desplazarse */
  position:relative;
}
/* Banda institucional navy (curva) arriba — NO intercepta toques */
#screen-login::before{
  content:""; position:absolute; top:0; left:0; right:0; height:40%;
  background:linear-gradient(135deg,var(--navy-dark) 0%, var(--navy) 68%, var(--navy-light) 100%);
  border-bottom-left-radius:46% 24%; border-bottom-right-radius:54% 28%;
  box-shadow:0 22px 46px -24px rgba(18,41,80,.55);
  pointer-events:none;
}
/* Acento dorado institucional bajo la curva */
#screen-login::after{
  content:""; position:absolute; top:calc(40% - 34px); left:50%; transform:translateX(-50%);
  width:min(74vw,300px); height:64px; border-radius:50%;
  background:radial-gradient(60% 100% at 50% 0%, rgba(201,168,76,.42), transparent 72%);
  pointer-events:none;
}
.login-box{
  background:var(--v2-surface); border:1px solid #E6EAF1; border-radius:22px;
  padding:26px 24px; max-width:380px; width:100%;
  box-shadow:0 26px 64px -30px rgba(18,41,80,.45), 0 2px 8px rgba(18,41,80,.06);
  position:relative; z-index:1; color:var(--v2-ink);
  backdrop-filter:none;
}
.login-logo{margin-bottom:22px; text-align:center}
/* el <div class="mark"> deja de ser cuadro dorado; lo llena el logo oficial (JS <img alt>) */
.login-logo .mark{
  width:auto; height:auto; background:none; box-shadow:none; border-radius:0;
  margin:0 auto 8px; font-size:0;   /* oculta el emoji si el JS no corrió */
  display:flex; align-items:center; justify-content:center;
}
.v2-login-logo{display:block; width:196px; max-width:74%; height:auto; margin:0 auto}
/* con el logo (incluye wordmark) el h1 de texto es redundante: se oculta solo si el JS puso el logo */
.login-logo.v2-login-ready h1{display:none}
.login-logo.v2-login-ready p{color:var(--v2-ink2); margin-top:2px; font-size:12.5px}
/* degradación elegante si el JS no corre: h1/p navy sobre tarjeta clara */
.login-logo h1{color:var(--navy); font-size:22px; font-weight:800}
.login-logo p{color:var(--v2-ink2); font-size:12.5px; margin-top:4px}
.login-box label{
  color:var(--v2-ink2); font-size:11px; letter-spacing:.8px;
  text-transform:uppercase; font-weight:700; margin-bottom:7px;
}
.login-box input{
  background:#F7F9FC; border:1px solid #DCE2EC; color:var(--v2-ink);
  border-radius:12px; padding:14px 16px 14px 44px; margin-bottom:18px;
  transition:border-color .18s, background .18s, box-shadow .18s;
}
.login-box input::placeholder{color:#9AA6B8}
.login-box input:focus{
  border-color:var(--navy); background:#fff;
  box-shadow:0 0 0 3px rgba(27,58,107,.13);
}
/* iconos lineales dentro de los campos (decorativos, SVG en background) */
#login-user{background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' stroke='%231B3A6B' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'><rect x='2.5' y='4.5' width='15' height='11' rx='2.2'/><path d='m3 6 7 5 7-5'/></svg>") 14px center/19px no-repeat}
#login-pass{background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' stroke='%231B3A6B' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'><rect x='4' y='9' width='12' height='9' rx='2'/><path d='M7 9V6.5a3 3 0 0 1 6 0V9'/></svg>") 14px center/19px no-repeat; padding-right:50px !important}
/* botón "ver contraseña": 44px, color tinta (sobre claro), sin desbordar */
#btn-ver-pass{
  width:44px; height:44px; right:4px !important;
  display:flex; align-items:center; justify-content:center;
  font-size:17px !important; color:var(--v2-ink2) !important; border-radius:10px;
}
#btn-ver-pass:active{background:#EEF2F7}
/* PRIMARIO navy con DETALLE dorado */
.btn-login{
  background:linear-gradient(180deg,var(--navy-light),var(--navy)) !important;
  color:#fff !important; font-weight:800; border-radius:12px; padding:15px;
  box-shadow:0 12px 28px -14px rgba(18,41,80,.6); letter-spacing:.2px;
  position:relative; overflow:hidden; margin-top:4px;
}
.btn-login::after{
  content:""; position:absolute; left:18px; right:18px; bottom:9px; height:2px;
  background:linear-gradient(90deg, transparent, var(--gold), transparent); opacity:.85;
}
.btn-login:active{transform:translateY(1px) scale(.995)}
/* offline = acción SECUNDARIA (contorno navy sobre claro) */
#screen-login .btn-secondary{
  background:#fff !important; color:var(--navy) !important;
  border:1.5px solid #DCE2EC !important; border-radius:12px; font-weight:700; margin-top:10px;
}
/* enlace recuperar contraseña: navy */
#screen-login a{color:var(--navy) !important}
.login-error{border-radius:11px; background:var(--red-light); color:var(--red); border:1px solid #F3C9C4}

/* chip de versión discreto */
#app-version-chip{
  background:rgba(18,41,80,.06) !important; color:var(--v2-ink2) !important;
  border:1px solid var(--v2-border) !important; border-radius:999px !important;
  font-weight:600 !important; letter-spacing:.3px;
}

/* ============================================================================
   MÓDULO 2 · AGENDA / DIRECTORIO  (+ chrome global: topbar, cards, nav)
   ============================================================================ */
.topbar{
  background:linear-gradient(120deg,var(--navy-dark) 0%, var(--navy) 78%);
  height:58px; box-shadow:0 1px 0 rgba(255,255,255,.05) inset, 0 6px 18px -10px rgba(18,41,80,.5);
}
.topbar-title{font-size:16px; font-weight:800}
.topbar-sub{font-size:11px; color:rgba(255,255,255,.62)}
.topbar-avatar{
  background:linear-gradient(180deg,var(--gold-light),var(--gold));
  box-shadow:0 2px 8px -2px rgba(201,168,76,.6), 0 0 0 1px rgba(255,255,255,.12) inset;
}

.card{
  border-radius:var(--radius); border:1px solid var(--v2-border);
  box-shadow:var(--v2-shadow-card); background:var(--v2-surface);
}

/* badges/chips: SOLO forma de pastilla (width-neutral → cero reflow). COLOR intacto. */
.badge{border-radius:999px}

.btn-primary{
  background:linear-gradient(180deg,var(--navy-light),var(--navy));
  border-radius:13px; box-shadow:0 8px 20px -12px rgba(18,41,80,.6); letter-spacing:.2px;
}
.btn-primary:active{transform:translateY(1px) scale(.995)}
.btn-secondary{border-radius:13px}

.form-input, .mod-detail-input{color:var(--v2-ink)}
.mod-detail-input{border-radius:9px; border-color:var(--v2-border)}
.chip-quick{border-radius:999px; border-color:var(--v2-border)}

.bottom-nav{
  border-top:1px solid var(--v2-border);
  box-shadow:0 -8px 24px -18px rgba(18,41,80,.3);
  background:rgba(255,255,255,.96); backdrop-filter:blur(8px);
}
.nav-item{color:var(--v2-ink2); font-size:10px; letter-spacing:.2px}
.nav-item.active{color:var(--navy)}
.nav-item.active svg{filter:drop-shadow(0 2px 6px rgba(27,58,107,.25))}

.field-value{color:var(--v2-ink)}
.field-label{color:var(--v2-ink2)}
