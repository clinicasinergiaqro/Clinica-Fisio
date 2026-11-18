# Contra-revisión del tramo en producción `-18a`/`-18b` (report-only)

**Fecha:** 2026-11-18 · **Alcance:** defecto-auditoría del delta que llegó a producción SIN contra-revisión.
**Regla de este pase:** REPORT-ONLY. No se aplicó ningún cambio al código. `main` sigue en `5122ddb`; el hash desplegado del módulo NO se movió. Todo esto vive en la rama `claude/medidor-mejoras`, bajo `auditoria/` (carpeta ignorada del Hosting en `firebase.json` → no se sirve).

## 0. Qué se verificó y cómo

- **Módulo vivo:** `medidor-biomecanico.js`, 3493 líneas, servido en `v1-2026-11-18c`.
  SHA-256 = `db802d0ced41bb8ceab22065da46af23992c06bf86f527ab059e81eaaff1c9c3` (coincide con la verificación independiente del auditor, `db802d0c`).
- **Cronología git del delta:**
  `6d8b13d` (Hallazgo D) → `534c9e5` (`-14a`, #579, contra-revisado, fija `BIO_ALGO_VER='bio-2d-2026-11-14b'`) → `fedeb9f` (`-18a`, #581) → `486ef8a` (`-18b`, #582). `-18c` (#584) **no tocó el módulo** (fue la guía del medidor en el lector 📋 Protocolos).
- **El delta REALMENTE sin contra-revisar** = `534c9e5..486ef8a` → `auditoria/contrarevision_18/diff_18a_18b_solo.patch` (281 líneas, solo código + suites).
- **Diff completo pedido** `6d8b13d..486ef8a` → `auditoria/contrarevision_18/diff_6d8b13d__486ef8a.patch` (503 líneas).

Clasificación de cada verdicto: **[Insp]** = por inspección del código (lectura línea a línea), **[Repro]** = reproducido contra dato real, **[Fís]** = requiere validación física que el sandbox no puede dar.

---

## 1. HALLAZGO NUEVO (P1) — el sello `BIO_ALGO_VER` MIENTE

**`medidor-biomecanico.js:71` → `BIO_ALGO_VER = 'bio-2d-2026-11-14b'`.** Sigue en `14b` aunque el código desplegado es `-18c`. El sello se estampa en `calidad.algoVersion` de **cada sesión** (`_persistirSesion`) y en el texto de goniometría que se escribe a `valoracion.rom` → es la trazabilidad clínica de "qué algoritmo produjo esta medida".

**Por qué es mentira (no cosmético):** entre `14b` y el código desplegado hay DOS cambios que alteran el VALOR o la ADMISIBILIDAD de una medida:
1. **Candado de techo** (`-18a`, ver §4): una medida de goniómetro por encima del techo anatómico ahora → `ok:false` (no medible, no se guarda). En `14b` ese mismo gesto registraba un número. Misma entrada → resultado distinto.
2. **Decodificación por canvas para iOS** (`-18a`, ver §3): en iOS, mandar el `<video>` directo a MediaPipe daba cuadros negros; ahora se dibuja a canvas y se manda el canvas → en un iPhone, los cuadros que MediaPipe ve (y por tanto los ángulos medidos) cambiaron de "ninguno/negro" a "válidos". Misma entrada → resultado distinto.

Una sesión medida con `-18x` queda sellada `14b` → la trazabilidad asegura algo falso.

**[Insp]** · **Corrección (NO aplicada en este pase, agendada en la secuencia §7 paso 2):** bumpear `BIO_ALGO_VER` a `'bio-2d-2026-11-18'` junto con el refactor `BIO_CFG` de MANT-1, en el mismo commit. No se aplica aquí porque este tramo es report-only y porque conviene que el bump viaje con el deploy que Carlos apruebe, no suelto.

---

## 2. AUTO-REVISIÓN DE LA COLA DE VARIOS VIDEOS (la clase async/estado que falló en Fase 3)

La cola (`BIO.videoCola`) es orquestación asíncrona con estado compartido entre videos — exactamente la clase de bug que ya mordió en Fase 3. Se revisó a ojo, línea por línea, contra las 4 preguntas del auditor. Las 4 resuelven **SEGURO por inspección**, con dos notas de claridad honestas (no son defectos).

### Q1 — ¿un resultado tardío de un video cruza al siguiente? → **NO** [Insp]
- `procesarVideo` arranca cada video con `BIO.modo='video'; _bumpGen();` (`medidor-biomecanico.js:1413-1414`). `_bumpGen()` incrementa `BIO.gen`.
- Cada envío a MediaPipe va por `_genSend(frame)`, que etiqueta el frame con el `gen` del momento; `onResults` (`:787-788`) **descarta** todo resultado cuyo `gen` ≠ el actual.
- `BIO_colaSiguiente`→`procesarVideo(next)` vuelve a hacer `_bumpGen()` → cualquier resultado de MediaPipe aún en vuelo del video anterior llega con el `gen` viejo y se tira.
- La ruta HEVC (§3) también manda por `_genSend(_fsrc)` → igual de protegida.
- **Verdicto: no hay cruce.** El mecanismo de identidad-de-generación es justamente el blindaje de esta clase.

### Q2 — ¿se resetea `peak`/`run`/`_peakTSeg`/`_peakFrameCanvas` entre videos? → **SÍ** [Insp]
- Goniómetro (`:1451`), explícito al entrar a cada video:
  `if(!BIO.accG) BIO.accG=nuevoAccGonio(); _gonioSelDefault(BIO.accG); BIO.accG.peak=null; BIO.accG.run=0; BIO._peakFrameCanvas=null; BIO._peakFrameLm=null; BIO._peakTSeg=null;`
  → `peak`, `run`, `_peakFrameCanvas`, `_peakFrameLm`, `_peakTSeg` reseteados por video.
- Dinámicos (`:1449-1450`): acumulador fresco por video — `BIO.accS=nuevoAccSent()` / `BIO.accM=nuevoAccMarcha()` / `BIO.acc=nuevoAcumulador()`.
- **Nota de claridad (NO defecto):** `BIO._peakGonioLm` / `BIO._peakGonioAR` (`:818`) NO están en la línea de reset de `:1451`. No es un bug porque solo se escriben cuando el pico mejora (`mejoroG`) y solo se leen en una captura con `g.peak!=null`; como `peak` SÍ se resetea a `null`, el primer frame del video nuevo re-establece el pico y sobrescribe esos campos antes de cualquier lectura, y si la articulación nunca se detecta `BIO_gonioCapturar` corta en `g.peak==null` y no los lee. No existe ruta que use un `_peakGonioLm` viejo. **Recomendación (cosmética):** añadir ambos a la línea de reset para que el reseteo sea evidente de un vistazo.

### Q3 — ¿la firma por-archivo del Hallazgo D sigue distinguiendo archivos encolados? → **SÍ** [Insp]
- `_confirmarVelocidadArchivo` memoiza por `_sigArchivo(file)` = `name|size|lastModified` (sin cambios en el delta; 0 hits al grepear las funciones de gateo en el patch).
- Cada entrada de `BIO.videoCola` es un `File` distinto del multi-select (`files.slice(1)`, `:1041`) con su propio `name/size/lastModified` → firma distinta → `BIO._velTiempo[sig]` por-archivo → **cada video encolado se confirma/pregunta por separado**.
- **Nota honesta (NO defecto):** dos videos DISTINTOS con `name`+`size`+`lastModified` idénticos (p.ej. renombrados a mano al mismo tamaño) compartirían firma y el 2º heredaría la confirmación del 1º. Caso de borde improbable (grabaciones reales difieren en tamaño/mtime); no se corrige, se documenta.

### Q4 — ¿cancelar a media cola deja estado sucio? → **NO** [Insp]
- `cerrarMedidor` (`:1131`): `BIO.cancelVideo=true` + `BIO.videoCola=[]` + resetea `modo/srcEl/recording/procesandoVideo`.
- El tick del video (`:1479`) y el watchdog chequean `BIO.cancelVideo` → `terminar()` cancela el `rafId` LOCAL, limpia el watchdog y resuelve la promesa.
- `:1517` (`if(BIO.cancelVideo){ mostrarVista('bio-vista-inicio'); return; }`) salta el resumen Y el auto-avance.
- `resetEstado` (`:1125`) también limpia `videoCola=[]` + todos los campos de pico.
- **Verdicto: cancelar a media cola deja todo limpio** — cola vaciada, sin auto-avance, sin resumen, acumuladores/pico reseteados en el siguiente `resetEstado`/`procesarVideo`.

### Auto-avance de la cola (lo que NO preguntó el auditor pero conviene fijar) [Insp]
- `_persistirSesion` (`:1642-1645`): solo auto-avanza `if(BIO.tipoMedicion!=='gonio' && BIO.videoCola.length)` → en dinámicos cada video es su propia sesión (guarda y pasa al siguiente); en goniómetro NO auto-avanza porque cada video es una medición de la MISMA sesión (el usuario toca "📹 Siguiente video" / `BIO_colaSiguiente`). Coherente con el diseño declarado en el comentario del código.
- `BIO_colaSiguiente` (`:1480` del patch / función en el módulo): si hay cola → `shift()` + `procesarVideo(next)`; si no → `BIO.modo=null; mostrarVista('bio-vista-inicio')` y, en gonio, `pintarGonioInicio()`. Cierre limpio.

**Conclusión §2:** la cola es segura por inspección. No reproduce la clase de Fase 3 porque (a) la identidad-de-generación mata resultados tardíos y (b) hay reseteo explícito por video. Pero **no tiene suite** (ver §5) — la garantía es esta inspección + el smoke de carga, no una prueba automatizada.

---

## 3. REVISIÓN DEL FIX HEVC/.MOV DE iPhone (`-18a`)

**Qué hace** (`diff_18a_18b_solo.patch`, hunk de `procesarVideo`): en vez de mandar el `<video>` directo a MediaPipe (cuadros NEGROS en iOS con HEVC → "0 cuadros válidos"), dibuja cada cuadro a un canvas 2D reutilizado y manda el CANVAS:
```
var _vc = BIO._vidSampleCv || (BIO._vidSampleCv = document.createElement('canvas'));
if(_vc.width!==v.videoWidth || _vc.height!==v.videoHeight){ _vc.width=v.videoWidth; _vc.height=v.videoHeight; }
(BIO._vidSampleCtx || (BIO._vidSampleCtx=_vc.getContext('2d'))).drawImage(v,0,0,_vc.width,_vc.height);
_fsrc = _vc;
}catch(_df){ _fsrc = v; }
_genSend(_fsrc).then(...)
```

**Verdicto: correcto por construcción [Insp], pendiente de validar en iPhone [Fís].**
- **Enfoque correcto:** `drawImage` de `<video>` a canvas 2D SÍ texturiza en iOS donde el envío directo falla (comportamiento WebKit conocido).
- **Barato:** el canvas se REUTILIZA entre cuadros (solo se redimensiona si cambian las dimensiones) → sin asignación por cuadro.
- **No lanza:** `try/catch` → si falla, cae a mandar el `<video>` crudo (comportamiento viejo). Degrada, no rompe.
- **Aspecto preservado:** el canvas se dimensiona a `v.videoWidth/videoHeight`, igual que el video, y `_ANG_AR` (corrección de aspecto de Fase 1) se fija en `onResults` desde `BIO.srcEl.videoWidth/Height` → la relación de aspecto sigue correcta. Sin regresión del fix H1.
- **Gen-tagged:** va por `_genSend` → resultados tardíos descartados (ata con Q1).
- **LÍMITE HONESTO:** esto es comportamiento de runtime de iOS. `node --check`, `vm.Script` y el smoke de carga NO lo ejercitan. El propio CLAUDE.md (k) lo marca "🔴 PENDIENTE de validar EN VIVO en un iPhone real". **No está validado en un iPhone y no hay suite que lo cubra** (§5). El diagnóstico "(N cuadros leídos)" que se añadió ayuda a Carlos a ver en vivo si el video se reprodujo (0 = no arrancó).

---

## 4. REVISIÓN DEL CANDADO DE TECHO (`-18a`)

**Qué hace** (`diff_18a_18b_solo.patch:146-189`): `GONIO_TECHO` = techo anatómico por movimiento; `_gonioTecho(grupo,mov,val)` devuelve `{ok:false,val:null,fueraFisio:true}` si `val > techo`, si no el valor. Cableado en los 5 cálculos de goniómetro (codo/muñeca/cadera/rodilla/tobillo).

**Verdicto: correcto [Insp], CUBIERTO por suite.**
- **Correcto:** atrapa el escorzo 2D (p.ej. cadera ext 160°) rehusando un número físicamente imposible en vez de registrarlo. Topes holgados. Entra por la plomería `ok:false` existente (3 cuadros válidos seguidos / foto estática muestra "—" / no se guarda a sesión ni a `valoracion.rom`) — ruta ya probada.
- **CAMBIO DE COMPORTAMIENTO vs `14b`:** un valor por encima del techo ahora NO se mide (antes se registraba). Esto es justo lo que exige el bump de `BIO_ALGO_VER` (§1).
- **Cobertura:** `pruebas/goniometro-techo.test.js` (11 asserts) — la ÚNICA ruta nueva del tramo `-18` con suite propia.

---

## 5. MAPEO DE COBERTURA — qué suite cubre cada ruta nueva

| Ruta nueva `-18a`/`-18b` | Suite | Estado |
|---|---|---|
| Candado de techo (`GONIO_TECHO` / `_gonioTecho`) | `pruebas/goniometro-techo.test.js` (11 asserts) | ✅ Cubierta |
| Decodificación HEVC por canvas (iOS) | — ninguna | 🔴 Runtime iOS; verificada solo por inspección (§3); **pendiente iPhone real** |
| **Cola de varios videos** (`videoCola`, `BIO_colaSiguiente`, auto-avance de `_persistirSesion`, "Saltar video") | — ninguna | 🟧 Async/DOM/MediaPipe; verificada solo por la inspección de §2 + smoke de carga |
| Captura de imagen anotada en cámara EN VIVO (`g.imgs` en `modo==='camara'`) | — ninguna | 🟧 DOM/canvas |
| Multi-select `<input multiple>` + reparto a cola | — ninguna | 🟧 DOM |

**Lectura honesta:** de las rutas nuevas, solo el techo tiene prueba. Las dos más delicadas — HEVC (runtime iOS) y la COLA (la clase async/estado que ya falló en Fase 3) — **no tienen suite**. El tramo se validó offline (`node --check`, `vm.Script` 9/0, geometría 23/23, datos-sospechosos 19/19, smoke de carga) + lo que CLAUDE.md marca pendiente de iPhone. Esto motiva el hallazgo de robustez de cobertura que se agrega al reporte (§6 del REPORTE, punto 4 del auditor) y refuerza TEST-1.

---

## 6. PRUEBA CLÍNICA DURA — ¿pasó la de CÁMARA LENTA antes de desplegar `-18c`?

**Respuesta directa: NO se corrió una prueba de cámara lenta fresca antes de `-18b`/`-18c`. PERO el gateo de cámara lenta es BYTE-IDÉNTICO al que Carlos ya aceptó en `-14a`.** [Repro]

Evidencia:
1. **El delta `-18a`/`-18b` no tocó el gateo de tiempo.** `git diff 534c9e5 486ef8a -- medidor-biomecanico.js | grep -E '_confirmarVelocidadArchivo|_gatearTemporalPorTiempo|_cadenciaDudosa|_tiempoMeta|tiempoVerificado|finalizarMarcha'` → **0 cambios**. Las funciones de Hallazgo D están intactas desde `-14a`.
2. **`-18c` (#584) no tocó el módulo** (fue la guía en 📋 Protocolos).
3. **El gateo está vivo y sellado en el expediente de prueba** (capturado bajo `14b`), dos sesiones de marcha:
   - `tiempoVerificado=false` → `fuenteTiempo=video-sin-confirmar` → temporales/espaciales `confiable:false`.
   - `tiempoVerificado=true` → `fuenteTiempo=video-confirmado`.
   El campo existe, toma ambos valores, y gatea las métricas temporales — demostrado en dato real.

**Conclusión:** el COMPORTAMIENTO de cámara lenta está preservado por construcción (el código es idéntico a la versión que Carlos aceptó en `-14a` con la sesión de marcha de prueba). Lo que **no** ocurrió es una corrida de cámara lenta NUEVA específicamente sobre `-18b`/`-18c`. Los PRs `-18a`/`-18b` se validaron OFFLINE, no con una marcha lenta en vivo. Se declara así, sin afirmar que "pasó". La validación física de cámara lenta en un equipo real sigue PENDIENTE (lo único no testeable en sandbox).

---

## 7. VEREDICTO GLOBAL DEL TRAMO `-18`

- **Defectos que cambian conducta clínica:** ninguno nuevo encontrado por inspección. El techo es correcto y cubierto; la cola es segura por inspección; el HEVC es correcto por construcción.
- **1 hallazgo P1 real:** `BIO_ALGO_VER` desincronizado (§1) — la trazabilidad miente. Fix agendado (no aplicado).
- **2 huecos de cobertura** sobre rutas YA en manos de pacientes (§5): HEVC (pendiente iPhone) y COLA (sin suite). Suben la prioridad de TEST-1 y agregan un hallazgo de robustez.
- **1 pendiente físico:** validación de cámara lenta en vivo sobre `-18x` (§6).

Nada de esto se corrigió en este pase (report-only). `main` en `5122ddb`, hash del módulo sin mover.
