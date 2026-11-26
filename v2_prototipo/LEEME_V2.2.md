# SINERGIA · Generador de diagnóstico funcional — PROTOTIPO V2.2

**Prototipo aislado.** NO toca `index.html` de producción, NO ejecuta `saveDB`, NO modifica expedientes, NO despliega. Rama independiente. El rediseño visual (botones/ventanas) avanza en otra ventana de Claude; esta rama define y consume el **contrato de datos**.

## Qué corrige V2.2 (2ª revisión independiente de ChatGPT)

1. **Seguridad clínica.**
   - TVP por **constelación** (hinchazón unilateral de pierna + factor de riesgo: inmovilización/post-op/reposo) → regla **D3**, deriva y bloquea, aunque nadie escriba "trombosis" (caso OCT-22). El factor de riesgo se lee también del campo *mecanismo*.
   - Neuro en **3 niveles**: síntoma **referido** (parestesia/hormigueo → precaución **P10**) · déficit **objetivado** (pie caído, arreflexia, atrofia, **denervación/ENMG** → derivación **D2**; recupera OCT-06) · **compresión medular**/radiculopatía confirmada (emergencia/derivación).
   - Estado oncológico **contradictorio** (activo + remisión a la vez) → **V1** "verificar", NO se asume inactivo (OCT-84).
   - Conflicto de **región** evaluado contra zona / dx / **mecanismo** / **patología** (OCT-84) → **X2**.
   - Reglas **PENDIENTES** de validación (p.ej. **X3**) ya **NO bloquean** el plan solas: aparecen como precaución "requiere validación" y se listan en `pendientes_bloqueo`.
   - **Ausencia de dato ≠ ausencia de riesgo**: examen vacío sin cribado → **V2** "datos insuficientes".

2. **Diagnóstico funcional** usa relato + **mecanismo** + hallazgos objetivos + **limitación funcional** (ya no solo región+EVA+evolución).

3. **Objetivos** sin supuestos: no se asume reducción del 50%, ni simetría ≥90%, ni Daniels 5/5, ni dolor cero. La meta queda **null + nota** ("definir con el fisioterapeuta"). ROM/fuerza en **texto cualitativo NO** se reportan como medición en grados (`tipo: texto_cualitativo`).

4. **Planes** individualizados: cada plan referencia un **protocolo de la biblioteca Sinergia** por **patología**, con fases **por criterios**, irritabilidad y restricciones reales (metal → no térmico sobre material). **No inventa dosificación** (depende de la línea base medida). Antes los planes no bloqueados eran idénticos; ahora varían por patología (ver comparación: 2 → 11 distintos).

5. **SOAP / nuevo motivo**: si la nota SOAP más reciente describe **otra región** (o hay lenguaje de nuevo motivo), se marca **episodio distinto** → iniciar valoración desde sesión 1, sin mezclar.

6. **Biomecánica**: esta rama define/consume el **contrato de medición** (`{id, paciente, fecha, articulacion, movimiento, lado, tipo, posicion, metodo, unidad, valor, calidad, autor, evidencia}`). Los botones/ventanas los implementa el rediseño visual. No duplica ni modifica algoritmos de medición.

7. **Trazabilidad/anonimización**: todo resultado trae **`fecha_corte`** (de la última nota SOAP o del corte de la corrida). Las mediciones **sin id estructurado NO cuentan** como vinculadas (van a `mediciones_sin_vincular`). El scrub de PHI elimina nombres de médico **con partículas** ("García de Bustamante", OCT-72) sin comerse palabras comunes ("médico tratante", "en reposo").

## Arquitectura (sin cambios respecto a V2.1)

`extractor_v2.js` (hechos con negación/temporalidad/lateralidad/SOAP) → `motor_seguridad_v2.js` (catálogo versionado de reglas) → `generador_v2.js` (compone el **contrato JSON**, única fuente de verdad) → `render_contrato.js` (HTML para PDF y prototipo, de ese mismo JSON).

## Cómo reproducir

```
node v2_prototipo/tests/pruebas_v2.js          # 62 pruebas, exit 0
node v2_prototipo/tools/regenerar.js           # dataset anonimizado → datos/resultados_v22.json
node v2_prototipo/tools/comparar.js            # V2.1 (baseline_v21) vs V2.2 → datos/comparacion_v21_v22.{json,md}
node v2_prototipo/tools/build_html.js          # resultados JSON → datos/reporte_v22.html
# PDF desde el HTML (solo desde el JSON):
chromium --headless --no-sandbox --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=datos/SINERGIA_Reporte_85_V2.2.pdf file://.../datos/reporte_v22.html
```

## El set REAL de 85 pacientes

`datos/casos_anon.json` son insumos **sintéticos anonimizados** (sin PHI; el repo es público) que cubren los casos de la auditoría (OCT-*) y un espectro de patologías. Para el set real de 85, exportar del backend los 85 registros anonimizados al **mismo formato** y correr `regenerar.js --in <ese_export>`. El export requiere el **token CLAUDE del backend** (el scratchpad que lo guardaba se borró al reiniciar el worker; Carlos lo comparte para regenerar el real-85).

## Estado

Avance reconocido; integración **NO** autorizada todavía. Pendiente de la 3ª revisión de ChatGPT.
