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

## MÓDULO 1 · Login / identidad  (referencia V2: fondo CLARO + logo oficial)

Nombres de función verificados vigentes en `main` (1 def c/u): `doLogin`,
`togglePassVer`, `recuperarPass`, `entrarModoOffline_`. **Solo se cambia su
presentación; los `onclick` del markup real quedan intactos.**

| Control | Función real (se conserva) | Cambio SOLO presentación | IDs | Verificación |
|---|---|---|---|---|
| Fondo | `#screen-login` | **tema CLARO** (#F5F7FA) + **curvas institucionales** navy (banda superior) y acento dorado (pseudo-elementos `pointer-events:none`) | `#screen-login::before/::after` | ✅ no intercepta toques; login scrolleable (`overflow-y:auto`) → teclado no tapa campos |
| Marca / logo | markup `<div class="mark">🫀</div>` | el emoji se **retira del árbol de accesibilidad** (`textContent=''` por JS) y se pone el **LOGO OFICIAL COMPLETO** como `<img alt="Clínica Sinergia — Fisioterapia y Rehabilitación">`. El `<h1>` de texto redundante se oculta **solo** si el logo se insertó (`.v2-login-ready`) → degradación elegante | `.login-logo .mark`, `.v2-login-logo` | ✅ logo visible + **nombre accesible** correcto (no emoji) |
| Correo | `#login-user` + `doLogin()` | campo **claro** profesional + **icono lineal** (sobre SVG, decorativo) | `#login-user` | ✅ onclick/placeholder intactos |
| Contraseña + ojo | `#login-pass`, `togglePassVer()` en `#btn-ver-pass` | campo claro + icono candado; botón ojo **44×44**, tinta, **sin desbordar**; input deja sitio | `#login-pass`, `#btn-ver-pass` | ✅ overflow corregido |
| Entrar (primario) | `doLogin()` (auth real) | **botón navy con DETALLE dorado** (línea inferior), como la referencia | `.btn-login` | ✅ onclick intacto |
| Modo offline (secundario) | `entrarModoOffline_()` | **acción secundaria** (contorno navy sobre claro) | `.btn-secondary` | ✅ onclick intacto |
| Recuperar contraseña | `recuperarPass()` | enlace navy discreto | enlace | ✅ onclick intacto |
| Chip de versión | `window.APP_VERSION` / `#app-version-chip` | pastilla discreta | `#app-version-chip` | ✅ texto real sin cambio |
| **Barra de estado/notch simulados** | N/A — la app real **no** los tiene (eran del prototipo) | nada que quitar | — | ✅ no existen en la app real |
| Credenciales demo | N/A — la app real **no** precarga credenciales | **no se introducen** | — | ✅ login en blanco |
| Responsive | — | verificado 360/390/430 px: logo+campos+botones caben sin desborde | — | ✅ 360/390/430 |

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

## MÓDULO 3 · Expediente clínico

Función real: `openExpediente(pid)` / `renderExpediente(tab)` (verificadas). El
reskin **no** cambia tabs, acciones, datos ni el motor de render.

| Control | Función real (se conserva) | Cambio SOLO presentación | IDs/clases | Verificación |
|---|---|---|---|---|
| Hero de identidad | nombre/edad/terapeuta/sesiones + pills (dx, alergia, consentimiento) | **tarjeta navy redondeada** con sombra (antes bloque plano) — mismos datos | `.exp-header/.exp-name/.exp-meta` | ✅ sin pérdida |
| Pills | dx / alergia / consentimiento (significado intacto) | pastilla con borde; `.gold` y `.red` conservan color | `.exp-pill(.gold/.red)` | ✅ |
| Pestañas | Historia/Valoración/SOAP/Estudios/Reportes… (mismos `onclick`) | **control segmentado premium**; activa en navy | `.tabs/.tab/.tab.active` | ✅ navegación intacta |
| Completitud / pendientes | "Expediente 4/7" + Consentimiento/Revaloración/SOAP semanal (cálculos reales) | hereda tarjeta/chip premium | — | ✅ cifras reales |
| Seguridad clínica | banner `_soapSeguridadHTML` (significado intacto) | radio refinado; **color de alerta sin cambio** | `.contraindication-box/.allergy-box` | ✅ |
| Motivo activo / historia | `.section-card/.field-*` | tarjeta premium, tinta legible | mismas clases | ✅ |
| Acciones | Exportar JSON / Editar datos / Pedir apoyo (SOS) / Agregar dermatofuncional | botones refinados (mismos onclick) | `.btn-*`, derma | ✅ |

> **Pendiente documentado (no hecho a ciegas):** "Alergia" aparece 3× (pill +
> banner de seguridad + caja de alergia). Reducir esa duplicación **sin eliminar
> datos** requiere un pase de **reorganización con JS** (colapsar la caja de
> alergia redundante solo cuando el banner ya la muestra). Queda para el pase de
> de-duplicación con verificación, no para CSS a ciegas.

---

## MÉTODO (reconstrucción de la PRESENTACIÓN, lógica intacta)
A partir de la dirección aprobada, el reskin **reorganiza la presentación** con un
motor (`sinergia_v2.js`) que, tras cada render, mejora el DOM **reenviando a los
controles reales** (nunca recrea handlers ni toca datos/guardado):
- **Hero** con logo oficial (emblema + wordmark) + **curva dorada** en los headers navy.
- **Expediente**: las pestañas reales (`.tab`, mismos `onclick=renderExpediente(...)`)
  se presentan como **mosaico de módulos** (CSS grid) con **iconos de línea** (no emoji).
- **SOAP**: control **segmentado S/O/A/P** bajo el hero que hace *scroll* a las
  secciones **reales** (`.form-section-title`); el formulario y `guardarSOAP` no se tocan.
- **Iconos de línea SVG** reemplazan emojis **decorativos** del chrome (títulos,
  botones, pills, labels), acotado para **no** alterar texto clínico ni símbolos con
  significado (p. ej. ▲/▼ de tendencia se respetan).
- **Modo oscuro**: variantes oscuras para los componentes nuevos (la app ya oscurecía
  `.card`/`.patient-card`). **Desktop (≥900px)**: columna centrada (sin marco de
  teléfono) + mosaico a 3 columnas; mobile-first intacto.

**Verificación continua:** `equiv_test.mjs` corre sobre ORIGINAL y RESKIN con el motor
activo → **21/21 ambas, paridad IDÉNTICA, 0 conexiones clínicas, 0 pageerror** en cada
iteración (login, agenda, directorio, expediente, SOAP, alta, supervisión, protocolos,
biomecánica, dark, desktop).

## Pendientes de dispositivo físico (⏳, no testeable headless)
- Teclado iOS/Android (foco de campos login/SOAP).
- Instalación PWA real (icono/splash/maskable) — sin tocar manifest aún.
- Rendimiento en equipos antiguos; safe-areas reales.

## Módulos siguientes (se añadirán a esta matriz al completarse)
3 Expediente · 4 Alta/historia · 5 Valoración/SOAP · 6 Biomecánica · 7 Dermato ·
8 Estudios/Protocolos/Ejercicios/Supervisión · 9 Dark/desktop · 10 Pruebas integrales.
