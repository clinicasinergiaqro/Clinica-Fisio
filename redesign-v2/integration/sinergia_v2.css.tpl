/* ============================================================================
   SINERGIA · REDISEÑO PREMIUM V2.0 — SISTEMA VISUAL (capa de presentación)
   ----------------------------------------------------------------------------
   Reproduce la dirección estética aprobada (mockups V2.0) sobre la app REAL.
   SOLO presentación: no toca funciones, datos, persistencia ni permisos.
   Reorganiza la PRESENTACIÓN (permitido): tabs->mosaico, S/O/A/P segmentado,
   hero con logo+curva, tiles, iconos de línea (sin emojis).
   La lógica vive en los controles reales (se reusan / se reenvía el click).
   Generado desde sinergia_v2.css.tpl por gen_css.py.
   ============================================================================ */

:root{
  --navy:#1B3A6B; --navy-dark:#122950; --navy-deep:#0E2242; --navy-light:#2A4F8F;
  --gold:#C9A84C; --gold-light:#E8C96A; --gold-deep:#B8932F;
  --gray-50:#F5F7FA; --gray-100:#EDF1F7; --gray-200:#E2E8F0;
  --gray-400:#94A3B8; --gray-600:#64748B; --gray-800:#172538;
  --radius:16px; --radius-sm:11px;
  --shadow:0 1px 2px rgba(18,41,80,.05), 0 10px 26px -14px rgba(18,41,80,.22);
  --v2-ink:#172538; --v2-ink2:#64748B; --v2-border:#E6EAF1; --v2-surface:#FFFFFF;
  --v2-shadow-card:0 1px 2px rgba(18,41,80,.04), 0 10px 24px -14px rgba(18,41,80,.16);
  --v2-derma:#8E3B6E; --v2-derma-light:#F7EBF2;
}
body{ background:var(--gray-50); -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; color:var(--v2-ink); }

/* ===== Curva dorada de marca (reutilizable en heros navy) ===== */
.v2-curve{
  position:absolute; top:0; right:0; width:62%; height:100%;
  background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='420' height='230' viewBox='0 0 420 230'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23E8C96A'/><stop offset='1' stop-color='%23B8932F'/></linearGradient></defs><path d='M150 0 C 270 6 360 34 420 92 L420 0 Z' fill='url(%23g)'/><path d='M210 0 C 300 6 372 30 420 66 L420 40 C 372 16 292 4 232 0 Z' fill='%23F3DD92' opacity='.65'/></svg>") top right/contain no-repeat;
  pointer-events:none; opacity:.95;
}
.v2-hero-logo{ position:absolute; top:13px; left:16px; display:flex; align-items:center; gap:9px; pointer-events:none; z-index:2; }
.v2-hero-logo img.em{ height:30px; width:30px; display:block; border-radius:50%; box-shadow:0 0 0 1px rgba(201,168,76,.5); }
.v2-hero-logo .wm{ color:#fff; line-height:1; display:block; }
.v2-hero-logo .wm b{ display:block; font-size:12.5px; font-weight:800; letter-spacing:1.2px; color:#fff; }
.v2-hero-logo .wm span{ display:block; font-size:8px; letter-spacing:.6px; color:var(--gold-light); margin-top:2px; font-weight:600; }

/* iconos de línea inyectados */
.v2-ic{ display:inline-flex; align-items:center; justify-content:center; flex:none; }
.v2-ic svg{ width:1.3em; height:1.3em; stroke:currentColor; fill:none; stroke-width:1.9; stroke-linecap:round; stroke-linejoin:round; }

/* ============================================================================
   LOGIN
   ============================================================================ */
/* Fondo BLANCO + curvas diagonales navy/oro en esquinas (sin tarjeta central) */
#screen-login{
  background:#FFFFFF;
  align-items:center; justify-content:center; padding:36px 28px; overflow-y:auto; position:relative;
}
#screen-login::before{ /* esquina SUPERIOR IZQUIERDA */
  content:""; position:absolute; top:0; left:0; width:min(72%,300px); aspect-ratio:330/230;
  background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 330 230'><defs><linearGradient id='n' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='%230E2242'/><stop offset='1' stop-color='%231B3A6B'/></linearGradient><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='%23E8C96A'/><stop offset='1' stop-color='%23B8932F'/></linearGradient></defs><path d='M0 0 H330 C 185 46 74 152 34 230 H0 Z' fill='url(%23g)'/><path d='M0 0 H298 C 158 34 56 128 16 206 H0 Z' fill='url(%23n)'/></svg>") top left/100% 100% no-repeat;
  pointer-events:none;
}
#screen-login::after{ /* esquina INFERIOR DERECHA (misma curva girada 180°) */
  content:""; position:absolute; bottom:0; right:0; width:min(72%,300px); aspect-ratio:330/230;
  background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 330 230'><defs><linearGradient id='n2' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='%230E2242'/><stop offset='1' stop-color='%231B3A6B'/></linearGradient><linearGradient id='g2' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='%23E8C96A'/><stop offset='1' stop-color='%23B8932F'/></linearGradient></defs><path d='M0 0 H330 C 185 46 74 152 34 230 H0 Z' fill='url(%23g2)'/><path d='M0 0 H298 C 158 34 56 128 16 206 H0 Z' fill='url(%23n2)'/></svg>") top left/100% 100% no-repeat;
  transform:rotate(180deg); pointer-events:none;
}
/* formulario DIRECTO sobre blanco (sin tarjeta, sin sombra) */
.login-box{ background:transparent; border:none; border-radius:0; box-shadow:none; backdrop-filter:none;
  max-width:360px; width:100%; padding:0; position:relative; z-index:1; color:var(--v2-ink); }
.login-logo{ margin-bottom:30px; text-align:center; }
.login-logo .mark{ width:auto; height:auto; background:none; box-shadow:none; border-radius:0; margin:0 auto 6px; font-size:0; display:flex; align-items:center; justify-content:center; }
.v2-login-logo{ display:block; width:224px; max-width:82%; height:auto; margin:0 auto; }
.login-logo.v2-login-ready h1{ display:none; }
.login-logo.v2-login-ready p{ color:var(--v2-ink2); margin-top:8px; font-size:13px; }
.login-logo h1{ color:var(--navy); font-size:22px; font-weight:800; }
.login-logo p{ color:var(--v2-ink2); font-size:13px; margin-top:6px; }
.login-box label{ display:none; }  /* etiqueta dentro del campo (placeholder), como el mockup */
.login-box input{ background:#F7F9FC; border:1px solid #DCE2EC; color:var(--v2-ink); border-radius:12px;
  padding:14px 16px 14px 44px; margin-bottom:18px; transition:border-color .18s, background .18s, box-shadow .18s; }
.login-box input::placeholder{ color:#9AA6B8; }
.login-box input:focus{ border-color:var(--navy); background:#fff; box-shadow:0 0 0 3px rgba(27,58,107,.13); }
#login-user{ background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' stroke='%231B3A6B' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'><rect x='2.5' y='4.5' width='15' height='11' rx='2.2'/><path d='m3 6 7 5 7-5'/></svg>") 14px center/19px no-repeat; }
#login-pass{ background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' stroke='%231B3A6B' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'><rect x='4' y='9' width='12' height='9' rx='2'/><path d='M7 9V6.5a3 3 0 0 1 6 0V9'/></svg>") 14px center/19px no-repeat; padding-right:50px !important; }
#btn-ver-pass{ width:44px; height:44px; right:4px !important; display:flex; align-items:center; justify-content:center; font-size:17px !important; color:var(--v2-ink2) !important; border-radius:10px; }
.btn-login{ background:linear-gradient(180deg,var(--navy-light),var(--navy)) !important; color:#fff !important; font-weight:800; border-radius:12px; padding:15px; box-shadow:0 12px 28px -14px rgba(18,41,80,.6); position:relative; overflow:hidden; margin-top:4px; }
.btn-login::after{ content:""; position:absolute; left:18px; right:18px; bottom:9px; height:2px; background:linear-gradient(90deg,transparent,var(--gold),transparent); opacity:.85; }
#screen-login .btn-secondary{ background:#fff !important; color:var(--navy) !important; border:1.5px solid #DCE2EC !important; border-radius:12px; font-weight:700; margin-top:10px; }
#screen-login a{ color:var(--navy) !important; }
.login-error{ border-radius:11px; }
#app-version-chip{ background:rgba(18,41,80,.06) !important; color:var(--v2-ink2) !important; border:1px solid var(--v2-border) !important; border-radius:999px !important; font-weight:600 !important; }

/* ============================================================================
   TOPBAR + NAV (global)
   ============================================================================ */
.topbar{ background:linear-gradient(120deg,var(--navy-deep) 0%, var(--navy) 80%); height:58px; position:relative; overflow:hidden;
  box-shadow:0 1px 0 rgba(255,255,255,.05) inset, 0 6px 18px -10px rgba(18,41,80,.5); }
.topbar-title{ font-size:16px; font-weight:800; letter-spacing:-.2px; }
.topbar-sub{ font-size:11px; color:rgba(255,255,255,.64); }
.topbar-avatar{ background:linear-gradient(180deg,var(--gold-light),var(--gold)); box-shadow:0 2px 8px -2px rgba(201,168,76,.6), 0 0 0 1px rgba(255,255,255,.12) inset; }
.bottom-nav{ border-top:1px solid var(--v2-border); box-shadow:0 -8px 24px -18px rgba(18,41,80,.3); background:rgba(255,255,255,.97); backdrop-filter:blur(8px); }
.nav-item{ color:var(--v2-ink2); font-size:10px; letter-spacing:.2px; }
.nav-item.active{ color:var(--navy); }
.nav-item.active svg{ filter:drop-shadow(0 2px 6px rgba(27,58,107,.25)); }

/* ============================================================================
   AGENDA + DIRECTORIO
   ============================================================================ */
.card{ border-radius:var(--radius); border:1px solid var(--v2-border); box-shadow:var(--v2-shadow-card); background:var(--v2-surface); }
.patient-card{ border-radius:var(--radius); border:1px solid var(--v2-border); box-shadow:var(--v2-shadow-card); }
.patient-avatar{ border-radius:14px; }
.badge{ border-radius:999px; }
.btn-primary{ background:linear-gradient(180deg,var(--navy-light),var(--navy)); border-radius:13px; box-shadow:0 10px 22px -12px rgba(18,41,80,.6); letter-spacing:.2px; position:relative; overflow:hidden; }
.btn-primary::after{ content:""; position:absolute; left:16px; right:16px; bottom:7px; height:2px; background:linear-gradient(90deg,transparent,var(--gold),transparent); opacity:.7; }
.btn-primary:active{ transform:translateY(1px) scale(.995); }
.btn-secondary{ border-radius:13px; }
.chip-quick{ border-radius:999px; border-color:var(--v2-border); }
.form-input{ color:var(--v2-ink); }
.field-value{ color:var(--v2-ink); } .field-label{ color:var(--v2-ink2); }

/* tiles de estadística (inyectados por JS en agenda) */
.v2-tiles{ display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin:14px 0; }
.v2-tile{ background:#fff; border:1px solid var(--v2-border); border-radius:16px; padding:12px 8px; text-align:center; box-shadow:var(--v2-shadow-card); }
.v2-tile .n{ font-size:22px; font-weight:800; color:var(--navy); line-height:1.1; }
.v2-tile .l{ font-size:11px; color:var(--v2-ink2); font-weight:600; margin-top:3px; }
.v2-tile.ok .n{ color:var(--green,#2E7D52); } .v2-tile.warn .n{ color:var(--amber,#B7791F); }
.v2-tile .v2-ic{ color:var(--gold-deep); font-size:18px; margin-bottom:2px; }

/* ============================================================================
   EXPEDIENTE  (hero logo+curva · mosaico de módulos)
   ============================================================================ */
#screen-expediente .exp-header{
  background:linear-gradient(135deg,var(--navy-deep) 0%, var(--navy) 72%, var(--navy-light) 100%);
  border-radius:0 0 26px 26px; padding:54px 18px 20px; position:relative; overflow:hidden;
  box-shadow:0 18px 36px -22px rgba(18,41,80,.6); margin:-16px -16px 18px;
}
#screen-expediente .exp-name{ font-size:22px; font-weight:800; letter-spacing:-.4px; }
#screen-expediente .exp-meta{ margin-top:5px; color:rgba(255,255,255,.74); }
#screen-expediente .exp-pills{ margin-top:13px; gap:7px; }
#screen-expediente .exp-pill{ background:rgba(255,255,255,.14); border:1px solid rgba(255,255,255,.17); border-radius:999px; padding:5px 13px; font-weight:700; backdrop-filter:blur(3px); }
#screen-expediente .exp-pill.gold{ background:linear-gradient(180deg,var(--gold-light),var(--gold)); color:var(--navy-dark); border-color:transparent; }
#screen-expediente .exp-pill.red{ background:rgba(192,57,43,.32); color:#FFDAD4; border-color:rgba(255,130,120,.3); }

/* tabs -> MOSAICO de 2 columnas (launcher de módulos) */
#screen-expediente .tabs{
  display:grid; grid-template-columns:1fr 1fr; gap:12px; width:100%;
  background:transparent; border:none; box-shadow:none; padding:0; margin:0 0 16px; overflow:visible;
}
#screen-expediente .tab{
  flex:none; min-width:0; display:flex; align-items:center; gap:10px; text-align:left;
  background:#fff; color:var(--v2-ink); border:1px solid var(--v2-border);
  border-bottom:3px solid var(--gold); border-radius:16px;
  padding:16px 13px; min-height:68px; font-size:14.5px; font-weight:700;
  box-shadow:var(--v2-shadow-card); position:relative; white-space:normal; overflow:hidden;
}
#screen-expediente .tab.active{ background:#fff; color:var(--v2-ink); box-shadow:0 0 0 2px var(--navy) inset, var(--v2-shadow-card); }
#screen-expediente .tab .v2-ic{ color:var(--navy); font-size:24px; }
#screen-expediente .tab .v2-ic.boxed{ background:var(--navy); color:#fff; border-radius:10px; width:38px; height:38px; }
#screen-expediente .tab::after{ content:"›"; margin-left:auto; color:var(--gray-400); font-size:21px; font-weight:400; }

/* tarjetas de sección y banners */
.section-card{ border-radius:var(--radius); border:1px solid var(--v2-border); box-shadow:var(--v2-shadow-card); }
.section-title{ color:var(--v2-ink); }
.allergy-box, .contraindication-box{ border-radius:16px; }

/* ============================================================================
   SOAP  (hero compacto · S/O/A/P segmentado · campos premium · EVA chips)
   ============================================================================ */
#screen-soap .topbar, #screen-soap > .topbar{ background:linear-gradient(135deg,var(--navy-deep),var(--navy) 78%); height:auto; min-height:58px; }
#soap-full{ padding-top:4px; }
/* control segmentado S/O/A/P (inyectado por JS) */
.v2-soapnav{ position:sticky; top:58px; z-index:40; display:grid; grid-template-columns:repeat(4,1fr); gap:6px;
  background:var(--gray-50); padding:10px 0 8px; margin:0 0 6px; }
.v2-soapnav button{ background:#fff; border:1px solid var(--v2-border); border-radius:13px; padding:9px 4px 7px; cursor:pointer;
  font-family:inherit; display:flex; flex-direction:column; align-items:center; gap:1px; box-shadow:var(--v2-shadow-card); }
.v2-soapnav button .k{ font-size:17px; font-weight:800; color:var(--navy); line-height:1; }
.v2-soapnav button .t{ font-size:10px; color:var(--v2-ink2); font-weight:600; }
.v2-soapnav button.active{ background:linear-gradient(180deg,var(--navy-light),var(--navy)); border-color:transparent; }
.v2-soapnav button.active .k, .v2-soapnav button.active .t{ color:#fff; }
/* EVA botones -> chips redondos */
.soap-label{ color:var(--v2-ink); }
.form-section, .section-card{ scroll-margin-top:120px; }

/* ============================================================================
   FILAS de acción con icono (genérico premium)
   ============================================================================ */
.v2-row{ display:flex; align-items:center; gap:12px; background:#fff; border:1px solid var(--v2-border); border-radius:14px; padding:14px 16px; box-shadow:var(--v2-shadow-card); }
.v2-row .v2-ic{ color:var(--navy); font-size:20px; }
.v2-row::after{ content:"›"; margin-left:auto; color:var(--gray-400); font-size:20px; }

/* ============================================================================
   MODO OSCURO — los componentes NUEVOS del reskin necesitan variante oscura
   (la app ya oscurece .card/.patient-card/etc. con mayor especificidad).
   ============================================================================ */
body.modo-oscuro{ background:#121722; color:#E8EDF5; }
body.modo-oscuro .v2-tile,
body.modo-oscuro .v2-row,
body.modo-oscuro #screen-expediente .tabs .tab,
body.modo-oscuro .v2-soapnav button{
  background:#1E2533; border-color:#323C4F; color:#E8EDF5;
  box-shadow:0 1px 2px rgba(0,0,0,.3), 0 10px 24px -16px rgba(0,0,0,.6);
}
body.modo-oscuro #screen-expediente .tabs .tab{ border-bottom-color:var(--gold); }
body.modo-oscuro #screen-expediente .tabs .tab.active{ box-shadow:0 0 0 2px var(--gold-light) inset, 0 1px 2px rgba(0,0,0,.3); }
body.modo-oscuro #screen-expediente .tab .v2-ic{ color:var(--gold-light); }
body.modo-oscuro #screen-expediente .tab .v2-ic.boxed{ background:var(--gold); color:#121722; }
body.modo-oscuro .v2-row .v2-ic{ color:var(--gold-light); }
body.modo-oscuro .v2-soapnav{ background:#121722; }
body.modo-oscuro .v2-soapnav button.active{ background:linear-gradient(180deg,var(--navy-light),var(--navy)); border-color:transparent; }
body.modo-oscuro .v2-soapnav button.active .k,
body.modo-oscuro .v2-soapnav button.active .t{ color:#fff; }
body.modo-oscuro .v2-ic{ color:var(--gold-light); }
body.modo-oscuro .bottom-nav{ background:rgba(20,24,36,.97); border-top-color:#2A3346; }
body.modo-oscuro .nav-item{ color:#9AA6BC; }
body.modo-oscuro .nav-item.active{ color:var(--gold-light); }
/* login en oscuro */
body.modo-oscuro #screen-login{ background:#121722; }
body.modo-oscuro .login-box{ background:#1E2533; border-color:#323C4F; color:#E8EDF5; }
body.modo-oscuro .login-box input{ background:#151B27; border-color:#323C4F; color:#E8EDF5; }
body.modo-oscuro .login-logo.v2-login-ready p,
body.modo-oscuro .login-box label{ color:#9AA6BC; }

/* ============================================================================
   DESKTOP / TABLET — centrar la columna (la app no usa marco de teléfono).
   Mobile-first: solo afecta pantallas anchas (>= 900px).
   ============================================================================ */
@media (min-width:900px){
  .topbar, .bottom-nav{ max-width:860px; left:50%; right:auto; transform:translateX(-50%); width:100%; }
  .bottom-nav{ border-radius:18px 18px 0 0; }
  .screen.active{ max-width:860px; margin-inline:auto; width:100%; }
  #content-agenda, #content-pacientes, #content-expediente, #content-supervision,
  #content-biblioteca, #content-nuevo, #soap-full, .exp-header{ max-width:820px; margin-inline:auto; }
  #screen-expediente .tabs{ grid-template-columns:repeat(3,1fr); }
}
