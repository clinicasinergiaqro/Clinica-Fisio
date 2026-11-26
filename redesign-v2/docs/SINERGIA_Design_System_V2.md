# Sistema de diseño — Sinergia V2.0

**Rediseño premium mobile-first · Clínica Sinergia (expedientes de fisioterapia, PWA)**
Documento de referencia para Carlos y para la revisión de diseño.
Versión del prototipo: `v2-2026-11-26 · prototipo`.

> Alcance: este documento describe el **sistema visual y de interacción** de un **prototipo navegable** en réplica aislada con datos sintéticos. **No toca producción**, expedientes reales, persistencia, autenticación, acceso offline, sincronización ni algoritmos biomecánicos. Vive en la rama independiente `claude/redesign-ux-ui-v2` (sin fusionar).

---

## 1. Resumen y principios

La dirección V2.0 combina tres referencias y las unifica bajo la marca del login oficial:

- **A · Clínica premium minimalista** (base): calma visual, mucho espacio en blanco, una sola jerarquía clara por pantalla.
- **B · Tecnológica** (indicadores): anillos de cumplimiento, sparkbars de evolución, lecturas numéricas monoespaciadas, medidores de fuerza.
- **C · Editorial** (rigor tipográfico): escala tipográfica disciplinada, `eyebrow` en versalitas, títulos con `letter-spacing` negativo.

Principios rectores:

- **Mobile-first real.** Diseñado a 390 px; en celular ocupa toda la pantalla (sin marco), con `safe-area`.
- **Una tarea por pantalla, sin preámbulo.** El contenido accionable va arriba; se elimina relleno y repetición.
- **Honestidad del estado.** Lo que se ve refleja lo que de verdad pasó (ver §9, barra de guardar).
- **Nada se pierde.** Se reorganiza la presentación; no se elimina ningún campo, acción ni permiso (ver documento de mapa de campos).
- **Seguridad clínica siempre legible.** Los colores de alerta conservan su significado en cualquier contexto, incluida la lente dermatofuncional.

---

## 2. Paleta de color

Tokens definidos en `:root` (valores literales del prototipo). El acento (`--accent`) es navy por defecto y la lente dermatofuncional lo re-mapea (ver §8) **sin** tocar los colores de seguridad.

### Marca y acento

| Token | Valor | Uso |
|---|---|---|
| `--navy` | `#122950` | Color de marca; títulos, botón primario, acento por defecto |
| `--navy2` | `#1B3A6B` | Degradados de marca, acento secundario |
| `--gold` | `#C9A84C` | Detalle dorado: subrayado de pestaña activa, progreso, flecha del botón primario |
| `--gold2` | `#B8932F` | Dorado de texto/énfasis sobre fondo claro |

### Superficies y tinta

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#F5F7FA` | Fondo de la app |
| `--surface` | `#FFFFFF` | Tarjetas y campos |
| `--surface2` | `#F4F7FB` | Fondo sutil / estado presionado |
| `--ink` | `#172538` | Texto principal |
| `--ink2` | `#64748B` | Texto secundario |
| `--ink3` | `#94A3B8` | Texto terciario / placeholder reforzado |
| `--border` | `#E2E8F0` | Bordes de contenedor |
| `--hair` | `#EEF1F6` | Separadores finos (hairline) |
| `--field-bd` | `#DCE3EC` | Borde de campos de captura |

### Estado y seguridad clínica (significado fijo)

| Token | Texto | Fondo | Significado |
|---|---|---|---|
| `--ok` `#236646` | — | `--ok-bg` `#E9F3EC` | Correcto / sin contraindicaciones / confirmado |
| `--warn` `#83520C` | — | `--warn-bg` `#FBF2E0` | Precaución / revisar / guardado local pendiente |
| `--risk` `#A52D25` | — | `--risk-bg` `#FBECEA` | Riesgo / contraindicación / error |
| `--derma` `#8E3B6E` | — | `--derma-bg` `#F7EBF2` | Acento de lente dermatofuncional (identidad, no seguridad) |

> **Regla de seguridad:** `ok / warn / risk` conservan su color y su significado en todas las pantallas y lentes. El rosa dermatofuncional es **identidad de módulo**, nunca un estado de seguridad.

---

## 3. Tipografía

- **Familia de sistema** (`--font`): `-apple-system, "SF Pro Text", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`. Sin fuentes externas (rendimiento + offline).
- **Monoespaciada** (`--mono`): `"SF Mono", ui-monospace, Menlo, "Cascadia Mono", monospace`, con `tnum`. **Solo para lecturas numéricas**: horas, EVA, grados, conteos, cifras de indicadores. Da alineación de dígitos y legibilidad clínica.

| Nivel | Tamaño | Uso |
|---|---|---|
| Título de pantalla (`.h1`) | 28 px | Encabezado de Agenda / Pacientes / Valoración |
| `.h2` | 22 px | Título de expediente, bienvenida |
| `.h3` / encabezados de sección | 18 px | Títulos de tarjeta y de biblioteca |
| Texto clínico | 14.5–16 px | Relato, notas, cuerpo |
| Etiquetas | 12–14 px | `labels`, chips, metadatos |
| Secundaria | 11–13 px | Subtítulos, unidades, pies |
| **Campos de captura** | **≥16 px** | `input`/`textarea`/`contenteditable` → evita el zoom automático de iOS |

`eyebrow`: 12 px, versalitas, `letter-spacing .1em` (rigor editorial para rótulos de sección).

---

## 4. Espaciado, radios, sombras, safe-areas

- **Escala de espaciado:** 4 / 8 / 12 / 16 / 20 / 24 / 32 px.
- **Radios:** `--r` 18 px (tarjetas), `--r-sm` 12 px, `--r-xs` 10 px; botones 13–16 px; píldoras 999 px.
- **Objetivos táctiles ≥ 44 px** en todos los controles interactivos (botones, pestañas, chips, iconos de acción).
- **Sombras suaves:** `--sh-sm` (elevación mínima), `--sh` (tarjeta), `--sh-lg` (hero / elementos destacados). Difusas y de bajo contraste, coherentes con la base minimalista.
- **Safe-area:** en celular real (`≤440px`) se activan `--safe-top`/`--safe-bot` desde `env(safe-area-inset-*)`; la status bar, app bars, tabbar y barras de guardar reservan ese espacio. En escritorio se previsualiza dentro de un marco de dispositivo (390×812) que desaparece en pantalla real.

---

## 5. Iconografía

- **Librería:** Lucide, en **SVG local inline** mediante sprite (`<symbol>` + `<use href="#i-…">`). `stroke: currentColor`, grosor 1.9 (2.3 en estado activo). **Cero emojis como iconografía.**
- **Tamaños:** `.ic` 20 px, `.ic.sm` 16 px, `.ic.lg` 24 px, `.ic.xl` 30 px.
- **Set en uso:** calendario, usuarios, libro, actividad, búsqueda, `+`, chevrons, clipboard, escudo, regla, rayo, hueso, cámara, micrófono, check, reloj, archivo, diana, tendencia, correo, candado, ojo, flecha, wifi / wifi-off, llave, refrescar, enviar, señal, batería, ajustes, editar, `x`, imagen, play, mancuerna, gota, destellos, gráfico, compartir, campana, filtro, usuario, lista, rotar.

---

## 6. Marca

- **Variantes de logo:**
  - **Vertical** → login y splash.
  - **Emblema** → nav, contextos compactos, insignia de estados (`emblem-badge`).
  - **Horizontal** → encabezados y reportes.
- **Iconos de instalación PWA:** 180 / 192 / 512 / 1024 + maskable + favicon.
- **Assets optimizados por tamaño** (no se cargan versiones 4K en el teléfono).
- Se **eliminó el emoji del corazón anatómico** como marca; el login se reconstruyó fiel a la referencia con el **logo oficial** (no imagen de fondo), con curvas de marca navy + dorado recortadas bajo la status bar.

---

## 7. Componentes del sistema

Inventario (clases en `app.css`) y para qué sirve cada uno:

**Estructura y navegación**
- **Marco de dispositivo** (`.device` / `.viewport`): solo previsualización en escritorio; a `≤440px` ocupa toda la pantalla.
- **Status bar simulada** (`.statusbar`, variante `on-navy`): hora + señal/wifi/batería; legible sobre claro y navy.
- **`.screen` / `.scroll`**: contenedor de pantalla con animación de entrada que respeta `prefers-reduced-motion`.
- **App bar** (`.appbar`) y **top nav** (`.topnav` con botón `back`): encabezados de pantalla raíz y de detalle.
- **Tabbar** (`.tabbar`): 4 pestañas (Agenda · Pacientes · Protocolos · Supervisión) con subrayado dorado en la activa + **FAB** (`.fab`) para alta.

**Agenda / listados**
- **Cards** (`.card`, `.card.pad`) y **sec-head** (encabezado de sección con acción).
- **Hero de jornada** (`.hero`): resumen del día con **anillo de cumplimiento** (`.ring`) y lecturas mono (atendidas / sin documentar / por llegar).
- **Filas de cita** (`.appt`): hora en mono, línea de tiempo (`.tl`), chip de diagnóstico, inicial de fisio (`.ini`), estado con punto (`.dot`).

**Expediente**
- **`pt-head`**: encabezado compacto (avatar, nombre, edad, terapeuta, dx) + **stats** (EVA / flexión o edema / sesiones) sin duplicación.
- **`safe-banner`** (ok / warn / risk): alerta de seguridad clínica.
- **`evo`**: evolución con **sparkbars** + **delta** (mejoría/empeoramiento).
- **`modgrid`** / **`mod`**: mosaico de módulos del expediente.

**Valoración**
- **EVA** (`.eva-top` + `.evabar` con pin): número grande en mono + barra con marcador.
- **ROM** (`.arc` + `.rom-info`): arco SVG con grados + ganancia.
- **Fuerza comparativa 0–10** (`.fz-row` / `.fz-bars`): medidores derecho/izquierdo + % de déficit.
- **States** (`.state`): cuatro estados de hallazgo — positivo (`pos`), negativo (`neg`), no aplica (`na`), no evaluado (`ne`).

**SOAP**
- **`soap-head`** sticky (id de paciente + nº de sesión + alerta de seguridad), **quick-nav S/O/A/P** (`.qnav`), **acciones rápidas** (`.qa`).
- **`field`** con acento dorado al llenarse (`.filled`), **mini-métricas** inline (`.mini-metric`), **pills de agentes** físicos (`.pill`).
- **`savebar`** con máquina de estados de guardado honesta (ver §9).

**Alta**
- **`stepbar`** de apartados + **`progress-top`** (barra dorada de avance).
- **`formcard`** y campos: `inp`, `chips`/`chsel`, `seg` (segmentos), `eva-pick` (stepper rápido de EVA).

**Feedback y marca**
- **Toast** (`.toast`, variantes ok/warn/risk).
- **Sheet / modal inferior** (`.sheet`, `.sheet-bg`) con `grab`.
- **Login / curvas de marca**, **splash**, **loading/estados** (offline, recuperar, sesión expirada vía `center-state` / `state-ic` / `emblem-badge`).
- **Lente dermatofuncional** (ver §8).

---

## 8. Lente dermatofuncional

Al abrir un paciente dermatofuncional, el contenedor recibe la clase `.lens-derma`, que **re-mapea las variables de acento**:

```
.lens-derma{ --accent:#8E3B6E; --accent2:#A85089; --accent-bg:#F7EBF2; }
```

- Como los componentes toman su color de `--accent` / `--accent-bg`, el acento rosa se aplica a **los componentes** (EVA, íconos de módulo, fase, avatar, chips de módulo), no solo al color de ventana.
- **No cambia** `--ok` / `--warn` / `--risk`: las alertas de seguridad conservan color y significado.
- Se activa solo en las pantallas de ese paciente (expediente, valoración, SOAP, alta, dermato); fuera de ahí el acento vuelve a navy.

---

## 9. Estados y feedback

- **Toast** (`.toast`): confirmaciones y avisos breves; variantes ok/warn/risk con ícono dorado.
- **Sheet** (`.sheet`): hojas inferiores para capturas acotadas (fuerza 0–10, importar ROM) sin salir de la pantalla.
- **Barra de guardar honesta** (`.savebar`): máquina de estados que nunca miente sobre la persistencia.

| Estado | Etiqueta | Significado |
|---|---|---|
| `draft` | «Borrador · se guarda al confirmar» | Hay cambios sin guardar; estado en reposo |
| `saving` | «Guardando…» | Guardado en curso (punto pulsante) |
| `saved` | «Guardado ✓ · confirmado en la nube» | Persistido y confirmado |
| `local` | «Guardado local · sincroniza al reconectar» | Guardado en el dispositivo, pendiente de subir |
| `err` | «No se pudo guardar · tu borrador sigue aquí» | Falló; el borrador se conserva |

> **Invariante de guardado:** el borrador **no se limpia** hasta confirmar un guardado efectivo. La barra **nunca** muestra «guardado» en reposo ni antes de confirmar. En Alta, el pie indica «Borrador conservado» durante todo el flujo.

---

## 10. Accesibilidad y mobile

- **Objetivos táctiles ≥ 44 px** en todos los controles.
- **Campos de captura ≥ 16 px** para evitar el zoom automático de iOS.
- **`prefers-reduced-motion`**: desactiva las animaciones de entrada de pantalla.
- **Safe-area** respetada arriba y abajo en celular real.
- **Sin hover obligatorio**: toda acción es alcanzable por toque; el hover nunca es requisito.
- **Contraste**: texto principal `--ink` sobre superficies claras; estados con par texto/fondo propio (p. ej. `--risk` sobre `--risk-bg`).
- **Iconografía vectorial** `currentColor`: nítida en cualquier densidad y coherente entre iOS y Android (sin depender de emojis del sistema).
