# Matriz de equivalencia funcional — Rediseño V2 (capa de presentación)

Para **cada** control reskineado: qué función/campo/ID real se conserva, qué
cambia **solo** en presentación, y la verificación. El principio es:
**el reskin es CSS aditivo; ninguna función, campo, handler, validación,
permiso ni ruta de guardado se toca.** Lo que el reskin hace es cambiar color,
tipografía, radio, sombra, espaciado y forma; **no** reescribe render, no mueve
datos, no crea valores por defecto.

> Método de verificación por módulo:
> 1) Réplica aislada de la app REAL (código real + stub sin red + datos
>    sintéticos) → `build_v2.py`.
> 2) Captura ANTES (sin reskin) y DESPUÉS (con `<link>` del reskin) a 390 px.
> 3) **0 `pageerror`** durante render e interacción.
> 4) Verificación de **cero reflow** donde importa (que no se pierda/parta texto
>    ni se oculte ningún dato).

Leyenda estado: ✅ verificado en réplica · ⏳ pendiente dispositivo físico.

---

## GLOBAL (tokens + chrome)

| Elemento | Función/estructura real (se conserva) | Cambio SOLO presentación | IDs/clases | Verificación |
|---|---|---|---|---|
| Paleta/tokens | `:root` con `--navy/--gold/--gray-*` que usa toda la app | Remapeo **estético** de neutros/radio/sombra; se **reafirman** navy/gold; **NO** se redefinen `--green/--red/--amber` ni sus `-light` (significado de seguridad intacto) | `:root` | ✅ colores de alerta sin cambio de hue |
| Tipografía | — | `-webkit-font-smoothing`; tracking negativo SOLO en `.login-logo h1` y `.topbar-title` (encoge, nunca genera envoltorios) | body, títulos | ✅ sin reflow |
| Tarjetas | `.patient-card/.section-card/.soap-card/.card` (contenido intacto) | radio 12→16, sombra en capas | mismas clases | ✅ |
| Nav inferior | `.bottom-nav/.nav-item` (mismos `onclick`, orden, íconos SVG reales) | borde/sombra/blur, color activo navy | `.bottom-nav` | ✅ 4 ítems, activo correcto |

## MÓDULO 1 · Login / identidad

| Control | Función real (se conserva) | Cambio SOLO presentación | IDs | Verificación |
|---|---|---|---|---|
| Marca | markup `<div class="mark">🫀</div>` | emoji oculto (`font-size:0`) + **emblema oficial** por `background` (incrustado base64, offline-safe). **No** se borra ni reemplaza el nodo | `.login-logo .mark` | ✅ emblema visible, sin JS |
| Correo | `#login-user` + `doLogin()` | campo premium (radio, foco oro) | `#login-user` | ✅ intacto |
| Contraseña + ojo | `#login-pass`, `togglePassVer()` en `#btn-ver-pass` | botón ojo a **44×44**, centrado, **sin desbordar**; input deja sitio | `#login-pass`, `#btn-ver-pass` | ✅ corregido overflow |
| Entrar | `doLogin()` (auth real) | botón oro con degradado/sombra | `.btn-login` | ✅ onclick intacto |
| Modo offline | `entrarModoOffline_()` | botón coherente discreto | `.btn-secondary` | ✅ onclick intacto |
| Recuperar contraseña | `recuperarPass()` | — (estilo heredado) | enlace | ✅ onclick intacto |
| Fondo | `#screen-login` | curvas navy/oro (pseudo-elementos, `pointer-events:none`) | `#screen-login::before/::after` | ✅ no intercepta toques |
| Chip de versión | `window.APP_VERSION` / `#app-version-chip` | estilo discreto (claro sobre navy, tenue sobre claro) | `#app-version-chip` | ✅ texto real sin cambio |
| **Barra de estado/notch simulados** | N/A — la app real **no** tiene barra/notch (eran del prototipo) | nada que quitar | — | ✅ no existen en la app real |
| Credenciales demo | N/A — la app real **no** precarga credenciales | **no se introducen** | — | ✅ login en blanco |

## MÓDULO 2 · Agenda / directorio

| Control | Función real (se conserva) | Cambio SOLO presentación | IDs/clases | Verificación |
|---|---|---|---|---|
| Topbar | `renderAgenda`, título/rol/avatar, `🔎`/`🌙`/`doLogout()` | degradado navy, avatar oro | `.topbar*` | ✅ acciones intactas |
| Tarjeta de fecha | contenido real + botón Google Calendar | radio/sombra | `.card` | ✅ |
| Banner sugerencia | conteo real `_nSugAg`, onclick real | — (hereda tokens) | banner | ✅ dato real |
| Resumen de hoy | chips con **cálculos reales** (pacientes/precaución/consentimiento/SOAP) | — | — | ✅ cifras reales, sin inventar |
| Tarjeta de cita | `patient-card` + `openExpediente`/`nuevaSesionRapida` | radio/sombra premium | `.patient-card` | ✅ **cero reflow** (nombre no se parte distinto al "antes") |
| Chips de estado | `.badge badge-pending/alert/done` ("Sin consentimiento"/"SOAP +7d"/"OK") | **solo** `border-radius` (width-neutral) → sin reflow; color de seguridad intacto | `.badge*` | ✅ nombre "Juan Pérez Demo" en 1 línea como el "antes" |
| Directorio pacientes | `renderPacientesShell`, `_pacCardHTML`, filtros, buscador, "Nuevo paciente", "Nuevo paciente dermatofuncional", lente rosa derma | chips pill, tarjetas premium | `.chip-quick`, `.patient-card`, `.btn-primary/secondary` | ✅ lente derma rosa intacta |

---

## Pendientes de dispositivo físico (⏳, no testeable headless)
- Teclado iOS/Android (foco de campos login/SOAP).
- Instalación PWA real (icono/splash/maskable) — sin tocar manifest aún.
- Rendimiento en equipos antiguos; safe-areas reales.

## Módulos siguientes (se añadirán a esta matriz al completarse)
3 Expediente · 4 Alta/historia · 5 Valoración/SOAP · 6 Biomecánica · 7 Dermato ·
8 Estudios/Protocolos/Ejercicios/Supervisión · 9 Dark/desktop · 10 Pruebas integrales.
