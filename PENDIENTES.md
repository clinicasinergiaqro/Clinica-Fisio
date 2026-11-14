# PENDIENTES — módulo biomecánico (ledger consolidado de la auditoría)

Registro vivo de lo que quedó deferido o pendiente de validar en las correcciones de auditoría del
`medidor-biomecanico.js` (rama `claude/medidor-correcciones-auditoria`). Mantener al día: cada deploy debe
revisar esta lista para que nada se pierda.

Estado del track: Fases 1, 1b, 2, 3, 4, 5, 6, 7 cerradas en rama; suite del auditor 18/18. Hallazgo D en curso.
`BIO_ALGO_VER` actual = `bio-2d-2026-11-14a`. NO desplegado (nada en main).

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

## Pendiente de validar EN VIVO (no testeable en sandbox)

- **(d) Validación física de los márgenes ±5–10°** del goniómetro 2D contra un **goniómetro físico**. Hasta
  entonces, toda etiqueta dice "margen estimado, no validado contra goniómetro físico" (UI, resumen gonio,
  `valoracion.rom`, PDF, comparador).
- **(e) Prueba manual con un slow-mo REAL de iPhone** antes del deploy (Hallazgo D): medir un video en cámara
  lenta y confirmar que los tiempos quedan `confiable:false` / `tiempoVerificado:false` y los ángulos no.
- **(f) Verificación VISUAL del arco del goniómetro en 9:16** (que la corrección de aspecto no deforme el dibujo;
  el dibujo usa coords originales — verificado por código, falta confirmación visual en equipo real).

## Notas de deploy
- Al mergear: bump doble `sw.js` + `window.APP_VERSION`; agregar `pruebas/`, `ejemplos/` y este `PENDIENTES.md`
  al `ignore` de `firebase.json` (como `docs/**`) para no servirlos en Hosting.
