# PENDIENTES — módulo biomecánico (ledger consolidado de la auditoría)

Registro vivo de lo que quedó deferido o pendiente de validar en las correcciones de auditoría del
`medidor-biomecanico.js` (rama `claude/medidor-correcciones-auditoria`). Mantener al día: cada deploy debe
revisar esta lista para que nada se pierda.

Estado del track: Fases 1, 1b, 2, 3, 4, 5, 6, 7 y Hallazgo D (`6d8b13d`) cerradas en rama; suite del auditor 18/18.
Fix cross-device (`b49de55`) auto-revisado el 2026-11-14 → LIMPIO (ver `auditoria/01_autorevision_b49de55.md`); puertas 85/0.
`BIO_ALGO_VER` actual = `bio-2d-2026-11-18` (bump 2026-11-18, `v1-2026-11-18d`). El track de auditoría se desplegó a main (`v1-2026-11-14a`) y encima llegaron `-18a/-18b/-18c`; el sello se había quedado en `bio-2d-2026-11-14b` hasta este bump (ver "Trazabilidad — ventana de sesiones mal-selladas" abajo).

## Deferido con intención (reportado, no aplicado)

- **(a) Umbrales de orientación 0.45 / 0.35 / 0.38 sin recalibrar.** El plan de Fase 2 los listaba; se dejaron
  con la semántica vieja (ratio ancho/alto sobre coords crudas) porque recalibrar a ciegas mis-clasificaría
  frontal/perfil en vertical y gatea `confiable` en marcha. Recalibrar **junto con la validación en cámara real**
  (necesita casos reales 9:16 de frente y de perfil para fijar las constantes nuevas).
- **(b) `sepRatio` / `camMov` sin corrección de aspecto (O2).** Impacto bajo: en `sepRatio` el aspecto se cancela
  aprox. por ser un ratio; `camMov` es heurística. No se tocó en Fase 2. Candidato a corregir si algún caso real
  lo expone.
- **(c) Residual O3 del FIFO (identidad de generación).** Si un `send()` colgado que el watchdog ya soltó resuelve
  TARDE (<2.5 s), su callback consume el gen del send fresco y un cuadro algo viejo de la MISMA medición se acepta
  (el fresco cae al fallback). Cross-generación YA resuelto; esto es intra-medición y acotado a 2.5 s. **Ya
  documentado en el código** (comentario del bloque de generación). Sin acción salvo que aparezca en la práctica.
- **(g) La marcha NO tiene PDF propio (preexistente).** El botón PDF de marcha cae al constructor genérico de
  ROM; no se introdujo en la auditoría. Por eso el reetiquetado de márgenes "no validado contra goniómetro físico"
  no aplica a un "PDF de marcha" (no existe como tal). Sin acción; nota para no buscar un PDF de marcha inexistente.

## Pendiente de validar EN VIVO (no testeable en sandbox)

- **(d) Validación física de los márgenes ±5–10°** del goniómetro 2D contra un **goniómetro físico**. Hasta
  entonces, toda etiqueta dice "margen estimado, no validado contra goniómetro físico" (UI, resumen gonio,
  `valoracion.rom`, PDF, comparador).
- **(e) Prueba slow-mo — ✅ ACEPTADA por Carlos (2026-11-14) con captura real.** La marcha
  `bm_p1781814958552_1794670219101` (`fuenteTiempo:"video-sin-confirmar"`, `tiempoVerificado:false`) dejó las
  medidas Temporal/Espacial en `confiable:false` → salvaguarda del Hallazgo D verificada con captura real. Caveat:
  sus ángulos también salieron `confiable:false`, pero por tener 1 solo ciclo (`nCic>=2` aparte), no por el tiempo;
  Carlos la aceptó como suficiente. Bloqueador de deploy por este punto: LEVANTADO. (Opcional a futuro: una
  slow-mo con ≥2 ciclos para la demostración limpia "tiempos no fiables + ángulos fiables".)
- **(f) Verificación VISUAL del arco del goniómetro en 9:16** (que la corrección de aspecto no deforme el dibujo;
  el dibujo usa coords originales — verificado por código, falta confirmación visual en equipo real).

## Hallazgos del análisis de datos 2026-11-14 (reportados, NO aplicados — decide Carlos)

Del análisis de las 12 mediciones de prueba (ver `auditoria/02_analisis_mediciones.md`). Misma clase:
"el 2D da un número confiado pero clínicamente imposible cuando la pose está escorzada / mal orientada / poco visible".
- **(h) Goniómetro: "(revisar)" fuera de rango (posible escorzo) — ✅ FIX PREPARADO en rama** (no desplegado).
  `_gonioFueraRango` marca "(revisar)" + alerta cuando `grado > ref+15°` (no defic/hiperext). Retroactivo.
  Verificado contra datos reales (marca 160° cadera / 172° rodilla; deja 129° borderline). Ver `auditoria/03_fixes_preparados.md`.
- **(i) Gate `confiable` de ROM brazos — ✅ FIX PREPARADO en rama** (no desplegado).
  `_romConfiable` ahora exige `visPct>=25` además de `reps>=1 && muestras>=12` (`:386`). Baja a no-confiable 6
  medidas de hombro de baja visibilidad en los datos reales (incluida abd 179° a 16% y ext 174° a 8%).
- **(j) Marcha con `orientPerfilOK:false`** → **CORREGIDO EL DIAGNÓSTICO: ya está cubierto.** Las medidas salen
  `confiable:false` por el gate `orientOK!==false` (`:741`) + aviso "no se vio DE PERFIL" (`:1795`). No requiere fix.

(h) e (i) están en la rama, **sin merge a main ni deploy**, esperando OK de Carlos (punto 5). Suites 104/0.

## Trazabilidad — ventana de sesiones mal-selladas (`BIO_ALGO_VER`)

**Qué pasó:** desde el sello `bio-2d-2026-11-14b`, el cálculo cambió en **`-18a` (#581, `fedeb9f`, merge a main 2026-11-17 18:25 CST, versión `v1-2026-11-18a`)** pero el sello NO se subió hasta **`v1-2026-11-18d` (2026-11-18)**. Dos cambios de `-18a` tocan la medición:
- **Candado de techo del goniómetro:** un grado por encima del techo anatómico ahora → `ok:false` (no medible, no se guarda); antes registraba un número.
- **Decodificación HEVC por canvas (iOS):** en iPhone, mandar el `<video>` a canvas 2D cambia los cuadros que ve MediaPipe → cambia los ángulos medidos (antes daba cuadros negros / 0 válidos).

**Ventana afectada:** biomecánica guardada **entre el 2026-11-17 ~18:25 CST (deploy de `-18a`/`v1-2026-11-18a`) y el deploy de `v1-2026-11-18d` (2026-11-18)**. Esas sesiones llevan `calidad.algoVersion = 'bio-2d-2026-11-14b'` pero las produjo código `-18x` → **procedencia incierta para ese rango**. Carlos: NO comparar una sesión de esa ventana contra una genuinamente `14b` (pre-`-18a`) como "mismo algoritmo".

**Dónde pega de verdad (acotación honesta):** el techo solo afecta **goniometría**; el decode HEVC solo afecta **videos capturados en iPhone**. Una medición de ROM/sentadilla/marcha hecha en Android/PC en esa ventana es numéricamente idéntica a `14b`. Aun así, por el sello, trátese toda la ventana como procedencia incierta.

**NO se reescriben datos históricos** (append-only; reescribir el sello de sesiones viejas inventaría procedencia). El comparador ⚖️ YA avisa "Versiones de algoritmo distintas" cuando dos sesiones difieren de sello (`comparador-honesto.test.js` H1) → tras el bump, una sesión nueva (`bio-2d-2026-11-18`) vs una vieja (`14b`) se marca sola; lo que NO se puede distinguir automáticamente es, dentro del cubo `14b`, cuál es genuina y cuál es de la ventana → por eso queda aquí anotado.

## Notas de deploy
- Al mergear: bump doble `sw.js` + `window.APP_VERSION`; agregar `pruebas/`, `ejemplos/`, este `PENDIENTES.md`,
  `auditoria/` y `validacion/` al `ignore` de `firebase.json` (como `docs/**`) para no servirlos en Hosting.
