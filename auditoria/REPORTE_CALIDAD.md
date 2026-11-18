# Reporte de calidad — Medidor biomecánico (`medidor-biomecanico.js`)

**Tramo:** auditoría de CALIDAD / mejora — **report-only** (no se aplicó ningún cambio al código).
**Fecha:** 2026-11-18.
**Artefacto auditado:** `medidor-biomecanico.js`, **3493 líneas**, commit `486ef8a` (= lo desplegado en `v1-2026-11-18c`, main `5122ddb`). SHA-256 `db802d0ced41bb8ceab22065da46af23992c06bf86f527ab059e81eaaff1c9c3`.
**OJO de versión:** el prompt citaba el módulo `6d8b13d` (SHA `4a8ecb59…2859b8e`). Ese hash quedó atrás: los cambios `-18a/-18b` (video iPhone HEVC, cola de varios videos, candado de techo del goniómetro) aterrizaron después y crecieron el archivo de ~3290 a 3493 líneas. **Se auditó el módulo VIVO desplegado**, no el hash del prompt. Las líneas citadas son de `db802d0c`.
**Red anti-regresión (verde en baseline):** `geometria` 23/0 · `verificacion-auditoria` 18/0 · `datos-sospechosos` 19/0 · `goniometro-techo` 11/0 · (todas las demás suites de `pruebas/` también verdes: comparador-honesto, gen-identidad, procedencia-estado, reanalisis-video, tiempo-verificado, trayectoria-fondo, validez-puntos-medios).

---

## 1. Veredicto ejecutivo

El módulo está **sólido y bien defendido** para lo que es: un cribado 2D con confianza etiquetada. Las correcciones del track anterior (aspecto H1, guardas de degeneración Fase 1b, gateo de tiempo VFR, techo anatómico, procedencia) están **puestas y verificadas**; el hot-path está **bien diseñado** (auto-throttle, un solo `pose.send` en vuelo, watchdog) y **no necesita optimización**. No hay ningún hallazgo **P0**: nada causa pérdida de datos ni daño clínico HOY.

Los 3 hallazgos que más importan (en este orden):
1. **CLIN-2 / CLIN-1 (validez clínica):** ninguna métrica tiene **validación física contra patrón de oro** todavía, y el **proxy de estatura fijo 88%** sesga todo valor en **cm absolutos**. La exactitud absoluta es, hoy, *desconocida*; el uso defendible es cribado + comparación antes/después (relativo), no número goniométrico.
2. **TEST-1 (calidad de código):** los **3 pipelines dinámicos** (clasificación de hombro flex/ext/abd, **signo del FPPA** valgo/varo, **eventos de marcha** heel-strike/toe-off) **no tienen ningún assert unitario**. Es la geometría más intrincada y la más fácil de romper en silencio al mejorar. **Hay que crecer la red de pruebas ANTES de tocar nada.**
3. **MANT-1 (calidad de código):** los umbrales clínicos/heurísticos (0.45/0.35/0.38, 0.88, 0.06, …) están **dispersos como números mágicos**. Extraerlos a un `BIO_CFG` nombrado habilita la validación física en un solo lugar y es rename puro, riesgo casi nulo.

**Qué NO tocar:** el hot-path per-frame (ya se auto-regula; micro-optimizar es esfuerzo perdido, MediaPipe domina el presupuesto), las guardas de degeneración de ROM (Fase 1b ya las cerró), la ruta de sync (ya auditada y cerrada), y **no** hacer el refactor grande de los 4 pipelines a tabla-descriptor (alto riesgo sobre código auditado, bajo retorno).

> Nota honesta, sin adornos: el fps real en un iPad viejo y la exactitud absoluta de cada ángulo **solo se validan en equipo/físico real**. Este reporte razona y cita código; lo marcado *Not evaluable* es justo eso.

---

## 2. Tabla de hallazgos (ranqueada por severidad)

Severidad: **P0** crítico (ninguno) · **P1** importante · **P2** vale la pena · **P3** menor.
Clasificación: **[Insp]** confirmado por inspección de código · **[Repro]** posible, pendiente de repro · **[Fis]** no evaluable sin validación física/equipo real.
Naturaleza: 🟦 **Código** (sube calidad del código) · 🟥 **Clínico** (sube validez clínica). *Son cosas distintas; no se mezclan.*

| id | eje | sev | naturaleza | clasif | título | archivo:línea |
|----|-----|-----|-----------|--------|--------|---------------|
| CLIN-2 | 6 validez | **P1** | 🟥 | [Fis] | Ninguna métrica validada vs patrón de oro | (todo el módulo) |
| CLIN-1 | 6 validez | **P1** | 🟥 | [Fis] | Proxy de estatura fijo 88% sesga todo cm absoluto | `:522`, `:717` |
| TEST-1 | 4 pruebas | **P1** | 🟦 | [Insp] | Los 3 pipelines dinámicos sin assert unitario | `:198`,`:405`,`:571`,`:3485` |
| MANT-1 | 2 mant. | **P2** | 🟦 | [Insp] | Umbrales clínicos como números mágicos dispersos | (varias) |
| ROB-1 | 3 robustez | **P2** | 🟥🟦 | [Fis] | Umbrales de orientación 0.45/0.35/0.38 sin calibrar | `:420`,`:586`,`:1259` |
| CLIN-3 | 6 validez | **P2** | 🟥 | [Fis] | Tobillo sagital = el ángulo de marcha menos fiable | `:597-598` |
| CLIN-4 | 6 validez | **P2** | 🟥 | [Insp] | FPPA = ángulo de proyección (no goniometría de valgo) | `:426`,`:395` |
| SEC-1 | 5 seguridad | **P2** | 🟦🟥 | [Insp] | MediaPipe en versión FLOTANTE `@0.5`, sin SRI (reproducibilidad + supply-chain) | `:68` |
| SEC-2 | 5 privacidad | **P2** | 🟦 | [Insp] | Nombre del paciente en el nombre de archivo de los PDF en Storage | `:3394`,`:3412` |
| TEST-2 | 4 pruebas | **P2** | 🟦 | [Insp] | Detector de picos y filtros sin test | `:273`,`:308`,`:321` |
| PERF-2 | 1 perf | **P3** | 🟦 | [Insp] | Truncamiento SILENCIOSO más allá de los topes | `:263`,`:494`,`:624` |
| ROB-2 | 3 robustez | **P3** | 🟦 | [Repro] | `_marcoCuerpo` sin guarda de degeneración del tronco | `:158-171` |
| ROB-3 | 3 robustez | **P3** | 🟦 | [Insp] | `sepRatio`/`camMov` sin corrección de aspecto | `:440`,`:512-515` |
| PERF-1 | 1 perf | **P3** | 🟦 | [Fis] | Alocaciones por cuadro (2º orden vs MediaPipe) | `:405`,`:470`,`:198` |
| MANT-2 | 2 mant. | **P3** | 🟦 | [Insp] | Duplicación estructural entre los 4 pipelines | (varias) |
| SEC-3 | 5 privacidad | **P3** | 🟦 | [Insp] | Trayectorias = dato biométrico en reposo (aceptable) | `:1972` |
| PERF-0 | 1 perf | — | 🟦 | [Insp] | **POSITIVO:** hot-path auto-regulado (no tocar) | `:1212-1234` |

---

## 3. Detalle de cada hallazgo (con evidencia, impacto, esfuerzo, riesgo)

### 🟥 Validez clínica (metodología — plausible-pero-no-oro)

**CLIN-2 · P1 · [Fis] · Ninguna métrica validada vs patrón de oro.**
*Evidencia:* no existe en el repo un set de pares medidos (goniómetro manual, marcha instrumentada, distancias conocidas) cruzado contra la salida del módulo; el ledger ya lo tiene como pendiente (`validacion/pares_goniometro.csv`, aún no poblado). Todo ángulo/cm sale de proyección 2D de un modelo `pose` "lite/full".
*Impacto clínico:* la **exactitud absoluta es desconocida**. Lo defendible hoy: cribado (±5–10°, ya etiquetado) y **comparación antes/después** del MISMO encuadre (relativo, donde los sesgos se cancelan). Presentar un grado como medida clínica absoluta no está respaldado.
*Esfuerzo:* medio-alto, pero **mayormente datos, no código** (recolectar pares con cámara real + goniómetro, calcular sesgo + Bland-Altman).
*Riesgo de "corregir":* bajo (es validar, no cambiar lógica); el riesgo es confiar en números sin esto.

**CLIN-1 · P1 · [Fis] · Proxy de estatura fijo 88%.**
*Evidencia:* `var hEst=hPx?hPx/0.88` (`:522`, sentadilla) y `hFull=hPx?hPx/0.88` (`:717`, marcha) — el factor "nariz→tobillos ≈ 88% de la estatura" es **constante**. De ahí salen `descCm` (`:545`) y `pxToM` → longitud de paso en metros.
*Impacto clínico:* los **cm/metros absolutos** se desvían sistemáticamente según las proporciones del individuo (índice tronco/pierna varía bastante entre personas). Los **porcentajes** (descenso % de estatura) y los **ángulos** NO dependen de esto.
*Esfuerzo:* validación física + eventualmente factor por sexo/altura (no código grande).
*Riesgo de "corregir":* **alto si se cambia el 0.88 sin datos reales** (se empeora a ojo). Mejor dejar 88% hasta tener pares medidos.

**CLIN-3 · P2 · [Fis] · Tobillo sagital = ángulo de marcha menos fiable.**
*Evidencia:* `out.tobIzq={val:_ang2D(lm[25],lm[27],lm[31])…}` (`:597-598`) — depende del landmark 31/32 (punta del pie), a menudo **ocluido o mal rastreado** en marcha sagital; el ángulo 2D confunde dorsi/plantarflexión real con el ángulo de progresión del pie y la geometría del calzado. La rodilla sagital (`:595-596`) sí está bien pozada.
*Impacto:* el tobillo arrastra más error que rodilla/cadera; hoy se muestra con la misma jerarquía.
*Esfuerzo:* bajo (etiquetar confianza del tobillo < rodilla/cadera) + validación.
*Riesgo:* bajo.

**CLIN-4 · P2 · [Insp] · FPPA es ángulo de proyección.**
*Evidencia:* `var interior=_ang2D(hip,knee,ank), mag=180-interior` con signo medial por `midX` (`:426-432`); el propio comentario del módulo lo dice ("el FPPA es un ángulo de PROYECCIÓN", ~`:395`).
*Impacto:* la magnitud de valgo **confunde** valgo real + rotación interna de cadera + rotación del pie + geometría de cámara (altura/distancia/centrado). Es **cribado de valgo dinámico**, no goniometría.
*Esfuerzo:* ninguno de código (ya etiquetado como cribado); mantener la honestidad en el reporte.
*Riesgo:* n/a.

### 🟥🟦 Robustez / clínico

**ROB-1 · P2 · [Fis] · Umbrales de orientación 0.45/0.35/0.38 sin calibrar.**
*Evidencia:* frontal `(ancho/alto)>=0.45` (sentadilla `:420`; gate ROM `:1259`), perfil `(ancho/alto)<0.35` (marcha `:586`), histéresis ROM `prev?r>=0.38:r>=0.45` (`:1259`). Agregación: sentadilla exige orientación en ≥70% de frames (`:509`), marcha ≥60% (`:679` aprox). **El gate de ROM sí tiene banda de histéresis (0.38–0.45); sentadilla y marcha usan umbral único por-frame** (sin histéresis, mitigado por la agregación).
*Impacto:* son heurísticos **no calibrados** contra ángulos de cámara reales. Una vista en el borde del umbral puede mal-gatear ("no óptima" falso o "ok" falso).
*Esfuerzo:* recalibrar con casos 9:16 reales (va junto con CLIN-2).
*Riesgo de "corregir":* bajo si se recalibra **con datos**; **alto si se ajusta a ojo**.

**ROB-2 · P3 · [Repro] · `_marcoCuerpo` sin guarda de degeneración del tronco.**
*Evidencia:* `up=_norm(_sub(midS,midH))` (`:163`) no verifica que `|midS−midH|` supere un mínimo. `_norm` divide por `_mag||1`, así que no hay NaN, pero en pose casi-degenerada (tronco muy comprimido en el cuadro) el marco `up/lateral/forward` queda mal orientado → la **clasificación de dirección** de hombro (`dir = abd/flex/ext`, `:183`) puede voltearse.
*Impacto:* daño MÁXIMO = clasificar mal el movimiento (ej. llamar flexión a una abducción), **no** un número falso (las guardas de valor `isFinite` en `:181`/`:236` impiden NaN). El valor solo se llena si `dir===m.dir`, así que una mala clasificación se traduce en "no se midió ese movimiento", no en un grado erróneo.
*Esfuerzo:* bajo (añadir guarda `_mag(sub(midS,midH)) > eps`).
*Riesgo:* bajo; **pendiente de repro** con landmarks sintéticos degenerados.

**ROB-3 · P3 · [Insp] · `sepRatio`/`camMov` sin corrección de aspecto.**
*Evidencia:* `sepRatio = _dist2D(lm[25],lm[26]) / _dist2D(lm[27],lm[28])` (`:440-441`) usa `_dist2D` (sin aspecto) en vez de `_seg2D` (con aspecto, `:344`). `camMov = sp(xs)>0.06 || sp(ys)>0.06` (`:512-515`) compara spreads x/y en coords normalizadas sin aspecto.
*Impacto:* **marginal** — `sepRatio` es un RATIO de dos distancias casi-horizontales, el aspecto se cancela casi del todo; `camMov` puede ser ligeramente anisótropo en 9:16 (un movimiento vertical de cámara pesa distinto que horizontal). Inconsistente con la corrección H1 aplicada en todo lo demás.
*Esfuerzo:* trivial (usar `_seg2D` / escalar el eje x por `_ANG_AR`).
*Riesgo:* bajo, PERO **cambia valores guardados** → debe ir con un test que fije el antes/después.

### 🟦 Performance

**PERF-0 · POSITIVO · [Insp] · El hot-path ya está bien diseñado — NO tocar.**
*Evidencia:* `loopCamara` (`:1212-1234`) usa `requestAnimationFrame` con throttle a `FPS_CAMARA=20` (video 12), **un solo `pose.send` en vuelo** (`BIO.sending`, `:1223-1232`) y **watchdog de 2.5 s** que libera un send colgado (`:1224`); los paneles DOM se actualizan **solo en modo cámara** (`if(BIO.modo==='camara')`, `:800/810/827`), no durante el proceso de un video. En iPad lento el fps **se auto-degrada** (procesa menos cuadros) en vez de encolar o colgarse.
*Conclusión:* no requiere optimización. Micro-optimizarlo es esfuerzo perdido y arriesga las guardas.

**PERF-1 · P3 · [Fis] · Alocaciones por cuadro (segundo orden).**
*Evidencia:* `calcularSentFrontal` arma `out` con ~12 sub-objetos + `out.p` con 14 refs por frame (`:410-455`); `acumularSent` empuja 14 entradas de trayectoria + varios `{i,v}` por frame (`:484-498`); `_sub/_cross/_norm` crean `{x,y,z}` por llamada. Presión de GC **real**.
*Impacto:* de **segundo orden**: la inferencia de MediaPipe Pose (wasm) domina el presupuesto por cuadro en 1–2 órdenes de magnitud; el techo de fps lo fija MediaPipe, no este JS.
*Evaluabilidad:* *Not evaluable* sin iPad real; el razonamiento es sólido (inferencia wasm ≫ JS del módulo).
*Recomendación:* **NO micro-optimizar.** Si algún día se perfila en un iPad real y aparece GC visible, atacar primero reuso de buffers en `acumular*`, nunca antes.

**PERF-2 · P3 · [Insp] · Truncamiento silencioso más allá de los topes.**
*Evidencia:* `if(s.serie.length<4000)` (`:263`, ROM), `_pushS` tope 4000 (`:469`), marcha `arr.length<6000` (`:624`), tray `acc.trayN<3600` (`:494`), anclas `<4000` (`:492`). Al llegar al tope, **deja de empujar sin avisar**.
*Impacto:* bajo (los clips son cortos: 3600 frames = 3 min a 20fps / 5 min a 12fps). En un video muy largo, la cola de muestras/trayectoria queda recortada y la reconstrucción/tiempos salen incompletos **sin aviso al usuario**.
*Esfuerzo:* trivial (marcar `calidad.truncado=true` + aviso si se topó).
*Riesgo:* bajo.

### 🟦 Cobertura de pruebas

**TEST-1 · P1 · [Insp] · Los 3 pipelines dinámicos sin assert unitario.**
*Evidencia:* el hook `__BIO_TEST` (`:3485`) y `__BIO_GONIO` (`:3483`) exponen geometría primitiva (`_ang2D/_seg2D`), goniómetro completo, comparador (`_cmpExtraer/_cmpTablaHTML`) y gates (`_cadenciaDudosa/_romConfiable`). **NO exponen** `calcularAngulos`/`_estadoHombro`/`_marcoCuerpo` (clasificación hombro + conmutación codo 2D/3D), `calcularSentFrontal`/`pierna` (**SIGNO del FPPA** valgo/varo), ni `calcularMarchaSagital`/`_eventosPie` (**heel-strike/toe-off** + ROM por ciclo). Grep en `pruebas/`: 0 referencias a esas funciones.
*Impacto:* es la geometría más intrincada del módulo y la más propensa a **regresar en silencio** bajo cualquier mejora futura (ej. invertir el signo del valgo, mal-clasificar un hombro) sin que ninguna suite lo note. Las suites congeladas (23/18) cubren geometría + gonio + tiempo + procedencia, **pero no estas tres**.
*Esfuerzo:* medio (exponerlas en `__BIO_TEST` + asserts con **landmarks sintéticos**, sin MediaPipe/DOM, igual que `geometria.test.js` ya hace).
*Riesgo:* **ninguno** (aditivo puro). **Este hallazgo va PRIMERO: es la red que de-riskea todas las mejoras.**
*Tests propuestos (no escritos):* (a) hombro — brazo sintético a 90° lateral → `dir:'abd'`, 90° al frente → `dir:'flex'`, atrás → `'ext'`, colgando → `null`; codo recto en plano → ~0°, flexionado al frente (foreshortening) → rama 3D. (b) sentadilla — rodilla hacia la línea media → FPPA **signo +** (valgo), hacia afuera → **−** (varo); rodilla encimada/NaN → `ok:false`. (c) marcha — serie sintética de pie con N apoyos conocidos → N ciclos; cadencia fuera de 20–220 → `tiempoDudoso`.

**TEST-2 · P2 · [Insp] · Detector de picos y filtros sin test.**
*Evidencia:* `_detPicosIdx` (`:273`, histéresis adaptativa — central a reps de sentadilla y conteo de ROM), `_medFilt5` (`:308`), `_quitaChispazos` (`:321`) no tienen assert.
*Impacto:* una serie con N picos conocidos debe dar N reps; un chispazo de 1 frame debe descartarse. Hoy nada lo fija.
*Esfuerzo:* bajo (series sintéticas).
*Riesgo:* ninguno (aditivo).

### 🟦🟥 Seguridad / privacidad

**SEC-1 · P2 · [Insp] · MediaPipe en versión FLOTANTE, sin SRI.**
*Evidencia:* `var MP_BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5'` (`:68`) — rango semver, no versión exacta ni Subresource Integrity. El wasm + los modelos se resuelven al último parche `0.5.x` en tiempo de carga.
*Impacto:* (a) **reproducibilidad** — un mismo video puede dar landmarks ligeramente distintos tras una actualización silenciosa del parche, y el sello `BIO_ALGO_VER` (`:71`) **no captura** la versión de MediaPipe; dos mediciones "mismo algoritmo" podrían no serlo. (b) **supply-chain** — se ejecuta wasm de tercero, sin fijar, sobre video de paciente real.
*Esfuerzo:* bajo (fijar versión exacta, ej. `@0.5.1675469404`), pero **requiere probar que la versión exacta carga en iOS** (algunas combinaciones de parche fallan en Safari).
*Riesgo de corregir:* medio-bajo (hay que validar la carga en dispositivo antes de fijar).

**SEC-2 · P2 · [Insp] · Nombre del paciente en el nombre de archivo de los PDF.**
*Evidencia:* `'sentadilla_'+String(p.name||'paciente').replace(/[^\w]/g,'_')+'_'+t2+'.pdf'` → ruta `clinica/sinergia/<p.id>/biomecanica/…` (`:3394`); igual para goniometría (`:3412`). El objeto vive bajo la carpeta del `id` (controlado por Storage rules), **pero la URL de descarga lleva el nombre** si se comparte/filtra. Video (`:1602`), trayectorias (`:1972`) e imágenes gonio (`:2682`) usan **solo `p.id`** — correcto.
*Impacto:* PII (nombre) en reposo en la ruta de Storage de 2 de los artefactos. Consistente con cómo el resto de la app nombra PDFs de reporte, pero evitable.
*Esfuerzo:* bajo (usar `p.id` también en la ruta del objeto; dejar el nombre amistoso solo en el `download`/`navigator.share` del cliente).
*Riesgo:* bajo.

**SEC-3 · P3 · [Insp] · Trayectorias = dato biométrico en reposo (aceptable).**
*Evidencia:* `tray_<id>.json` (`:1972`) guarda coordenadas de landmarks por cuadro (×1000) + aspecto + estaturaCm. Es **dato biométrico de movimiento** del paciente en reposo en Storage. Sin PII (sin nombre), bajo la carpeta del id, access-controlled.
*Impacto:* aceptable; se nota por completitud (si alguna vez hay export o retención, considerar este objeto).

**SEC-POSITIVO · [Insp]:** el módulo **no** maneja el token de Apps Script (`CLAUDE_TOKEN`) ni cabeceras `Authorization` — usa el **SDK de Firebase Storage** (`fbStorage.ref(...)`), que inyecta auth por su cuenta. Los `console.warn/error` solo registran `[BIO] <msg>` + `e.message`, **sin PII de paciente** en logs. La ruta de escritura al expediente se **delega** a `saveDB` + `window._syncBiomecanicaFS` (index.html) — ya auditada y fuera de alcance de este tramo.

### 🟦 Mantenibilidad

**MANT-1 · P2 · [Insp] · Umbrales clínicos/heurísticos como números mágicos dispersos.**
*Evidencia:* 0.45/0.35/0.38 (orientación), 0.88 (proxy estatura ×2), 0.06 (camMov), 3 (histéresis de oclusión ×3 pipelines), 12 (muestras mínimas), 0.7/0.6 (fracción de orientación), 20–220 (`_cadenciaDudosa`), `SENT_MIN_DESC=10`, epsilons 1e-6/1e-4/0.03/0.01, topes 4000/6000/3600, 2500 (watchdog), 2.5/0.15/1.6 (ventana de apoyo de marcha). Varios comentados inline; pocos con constante nombrada.
*Impacto:* durante la validación física (CLIN-2/ROB-1) estos son **exactamente** los números a tunear, y están regados por el archivo.
*Esfuerzo:* bajo (extraer un bloque `BIO_CFG` nombrado y documentado — rename puro, cero cambio de comportamiento).
*Riesgo:* **casi nulo**, retorno **alto** para el trabajo de validación que viene. Buen primer paso.

**MANT-2 · P3 · [Insp] · Duplicación estructural entre los 4 pipelines.**
*Evidencia:* rom/sent/marcha/gonio repiten el patrón `nuevoAcc*/acumular*/finalizar*/dibujar*/pintarPanel*/actualizarGate*/mostrarResumen*/tarjeta*HTML/BIO_construirPDF*`; el cierre `_g` de histéresis aparece 3× (`:483`,`:623`, y el `_run` de `acumular`); los escaladores `X(i)/Y(v)` de charts se repiten (`:2061/2107`); los `fmt*` de medidas también.
*Impacto:* IIFE de 3493 líneas, mantenible pero con fricción para cambios transversales.
*Recomendación:* **NO** hacer el refactor grande a tabla-descriptor de pipelines (alto riesgo sobre código ya auditado, bajo retorno). A lo sumo extraer helpers chicos **compartidos** (el `_g`, los escaladores de chart) **sólo si** aparece un dolor concreto y **sólo con TEST-1/2 ya en verde**.

---

## 4. Plan de mejora propuesto (en fases, por retorno/riesgo — **SIN aplicar**)

> Todas las mejoras van en rama **`claude/medidor-mejoras`** sobre main ya desplegado. **No** se mueve el hash de deploy: si Carlos decide desplegar lo auditado, se despliega `486ef8a`/`b49de55` tal cual. Las suites congeladas (23/18) son la red en cada fase.

**Fase A — de-risk (bajo riesgo, alto retorno, CÓDIGO aditivo puro, cero cambio de comportamiento):**
- **TEST-1** — exponer los 3 pipelines en `__BIO_TEST` + asserts con landmarks sintéticos (hombro, signo FPPA, eventos de marcha). *Crece la red ANTES de tocar nada.*
- **TEST-2** — tests del detector de picos y filtros.
- **MANT-1** — extraer `BIO_CFG` (rename de umbrales a constantes nombradas). Verificar con las suites que los valores son idénticos.

**Fase B — arreglos chicos de bajo riesgo:**
- **SEC-2** — `p.id` en la ruta del objeto PDF (nombre amistoso solo en el download del cliente).
- **PERF-2** — marcar `calidad.truncado` + aviso al topar los caps.
- **SEC-1** — fijar versión exacta de MediaPipe **tras probar la carga en iOS**.

**Fase C — validación física (ALTO valor clínico; mayormente datos, no código):**
- **CLIN-2 / CLIN-1 / CLIN-3 / ROB-1** — protocolo de pares goniómetro + distancias conocidas + casos 9:16 reales → sesgo + Bland-Altman → **recalibrar** proxy 88%, umbrales 0.45/0.35/0.38 y etiquetas de confianza **con datos reales** (no a ojo). Afinar la confianza del tobillo < rodilla/cadera (CLIN-3).

**Fase D — opcional, evaluar caso por caso (solo con Fase A verde):**
- **ROB-2** (guarda de degeneración del tronco), **ROB-3** (aspecto en sepRatio/camMov — con test de antes/después porque cambia valores guardados), **MANT-2** (helpers chicos compartidos, nunca el refactor grande).

---

## 5. Lo que explícitamente recomiendo **NO** hacer

- ❌ **Refactor grande** de los 4 pipelines a una tabla-descriptor común. Alto riesgo sobre código auditado y con miles de combinaciones ya validadas; retorno bajo (funciona). El costo supera el beneficio.
- ❌ **Micro-optimizar** las alocaciones por cuadro (PERF-1). El techo de fps lo fija MediaPipe (wasm), no el JS del módulo; es esfuerzo perdido y arriesga romper guardas.
- ❌ **Tocar el hot-path** `loopCamara`/`onResults` (PERF-0). Ya se auto-regula (throttle + single-flight + watchdog). Está bien.
- ❌ **Cambiar umbrales clínicos sin datos físicos** (0.88, 0.45/0.35/0.38). "Ajustar a ojo" empeora silenciosamente. Esperar la Fase C.
- ❌ **Re-auditar lo ya cerrado** (corrección geométrica/aspecto, validez de entrada, tiempo/VFR, procedencia, sync cross-device) salvo que aparezca una regresión — ya está verificado por las suites 23/18 y el track anterior.
- ❌ **Mover el hash de la rama de deploy** con cualquiera de estas mejoras.

---

## 6. Resumen honesto

- **Código:** sólido y bien defendido; el hot-path es un acierto (no tocar). Los huecos reales de CALIDAD DE CÓDIGO son **cobertura de pruebas de los pipelines dinámicos** (TEST-1, lo más importante) y **umbrales dispersos** (MANT-1). Todo lo demás es menor.
- **Clínica:** el límite real es que **nada está validado contra patrón de oro** y los **cm absolutos** cuelgan de un proxy fijo. Eso **no se arregla con código** — se arregla **midiendo en físico** (Fase C). Hasta entonces, el uso defendible es cribado + comparación antes/después, que es justo como el módulo ya se presenta.
- **Lo que NO está listo de validar aquí:** el fps en iPad viejo y la exactitud absoluta de cada ángulo — **solo en equipo/físico real**. Dicho sin optimismo de relleno.

*Report-only. No se abrió ninguna fase de cambios. Cada ítem se aplica después, en su rama, con diff explícito y OK de Carlos ítem por ítem.*
