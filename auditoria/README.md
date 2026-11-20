# auditoría/ — memoria documental del track del Medidor Biomecánico

El repo es la memoria, no el chat. Todo rastro del track de auditoría del módulo
biomecánico (`medidor-biomecanico.js`) vive aquí. Toda evidencia nueva se commitea
en esta carpeta.

## Rama y checkpoints (verificados en este repo)

- Base auditada: `13a6783` (= HEAD de `claude/dazzling-brahmagupta-lu7eqn`, blob del módulo `163231a`).
- HEAD auditado y CERRADO: `6d8b13d` ("Hallazgo D"), blob del módulo `e1922ef`.
  - SHA-256 del módulo auditado (dato externo del prompt): `4a8ecb59407567554f2508b6b598df3e778b1f44ef2536a942bed96ed2859b8e` (300,081 bytes).
  - `BIO_ALGO_VER='bio-2d-2026-11-14b'`.
- Tramo NO auditado hasta este loop: `6d8b13d → b49de55`, que son **dos** commits:
  - `b494dfa` — docs(PENDIENTES) cosmético (solo `PENDIENTES.md`, 4 ins / 1 del).
  - `b49de55` — fix cross-device (index.html 13 líneas + medidor-biomecanico.js 4 líneas), blob del módulo `caeebbb`.

Nota: el prompt dice "6d8b13d→b49de55 sea solo el fix cross-device"; en el repo son
el fix **más** un commit docs intermedio (`b494dfa`). Ambos verificados (ver `01_...`).

## Historia del track (de la rama `claude/medidor-correcciones-auditoria`)

```
b49de55 fix(biomecánica): mostrar mediciones cross-device         ← HEAD (fix, auditado en este loop)
b494dfa docs(PENDIENTES): cosméticos — BIO_ALGO_VER 14b + nota marcha sin PDF
6d8b13d Hallazgo D: verificación del tiempo físico del video       ← HEAD auditado y cerrado (track previo)
18d11bc Limpieza contra-revisión: ledger + N2 + N3 _bmSavePend
581272e Fase 7: menores (P2-14) — trayFrame + saveDB diferido tras fusión
1a51630 Fase 6: comparador honesto + etiquetas (P2-12, P2-13)
52afe36 Fase 5: procedencia y estado real (P1-7..P1-10)
0ee44ef Fase 1b: validez de puntos medios + codo/hombro no-medible
c322891 Fase 4: reutilizar el mismo video del goniómetro (P1-11)
07dc872 Fase 3: identidad de resultados tardíos (P1-6)
40410ec Fase 2: geometría coherente con aspecto
3923dd9 Fase 1: validez de entrada (no-medible, no 180 falso)
ef06f1d test(medidor): suite de aceptación (baseline 8/18)
13a6783 docs(memoria): auditoría externa (scope B) — entrada (i)    ← BASE
```

## Índice de documentos

- `00_prompt_loop_2026-11-14.md` — charter de este loop (prompt de Carlos, verbatim).
- `01_autorevision_b49de55.md` — Punto 1: auto-revisión del fix cross-device (diff, 3 puertas, 3 riesgos, barrido de clase). **Resultado: LIMPIO.**
- `02_analisis_mediciones.md` — Punto 2: análisis de las mediciones grabadas en los expedientes de prueba (se llena al bajar los datos).
- `evidencia/` — salidas de puertas, tablas de datos, capturas.

## FALTA — pedir a Carlos (no está en el repo; vivía en el chat del track previo)

1. **Plan original** del track de auditoría externa (el documento de alcance scope B).
2. **Paquetes de evidencia de los 3 tramos** de la contra-revisión externa (los diffs sobre copia prístina + corridas 18/18 + 44 asserts).
3. **Respuestas del auditor externo** (los textos O1/O3/O4/O5, P1-*, P2-*, Hallazgo D, N2/N3).

Si Carlos los pega, se guardan como `auditoria/evidencia/track_previo_*.md` y se commitean.
Mientras tanto, la trazabilidad del CÓDIGO está completa vía git (cada fase = 1 commit con su diff).
