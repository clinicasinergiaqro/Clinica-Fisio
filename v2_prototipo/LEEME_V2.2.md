# SINERGIA · Generador de diagnóstico funcional — PROTOTIPO V2.2.1

**Prototipo aislado.** NO toca `index.html` de producción, NO ejecuta `saveDB`, NO modifica expedientes, NO
despliega, NO se fusiona todavía con el rediseño visual. Rama independiente. El rediseño visual
(botones/ventanas) avanza en otra ventana de Claude; esta rama define y consume el **contrato de datos**
(ver `SINERGIA_Contrato_Clinico_Compartido.md`).

Módulos: `extractor / motor / generador / render = 2.2.1-proto` · catálogo seguridad `2026-11-26.c`.

## Qué incorpora V2.2.1 (requisitos definitivos de Carlos + 3ª revisión)

1. **Fuerza muscular — escala CLÍNICA COMPARATIVA de Sinergia 0–10.** Lado sano/referencia válida = 10/10;
   6/10 ≈ 60% estimado de la referencia. **NO** se sustituye por Daniels/MRC **ni** se convierte entre
   escalas (un valor legado `/5` se conserva etiquetado). Se identifica **grupo muscular, lateralidad y
   referencia**. **No se confunde** disminución de fuerza con déficit neurológico (la "debilidad/pérdida de
   fuerza/parálisis" solo es déficit neuro si hay contexto neural de miembro en la MISMA cláusula). **No se
   asume** el contralateral sano: la meta de simetría (10/10) solo se propone si la referencia está
   CONFIRMADA sana.

2. **Diagnósticos y objetivos.** Dx funcional **natural, conciso e individualizado**, usando valoración +
   antecedentes + pruebas + SOAP. Objetivos a **corto / mediano / largo plazo**. **Metas propuestas,
   justificadas y editables** cuando hay datos suficientes (EVA inicial; fuerza con referencia sana
   confirmada); si faltaría un supuesto, la meta queda `null` con la razón. Planes = protocolos de la
   biblioteca Sinergia como REFERENCIA, individualizados; sin inventar dosificación. Motor de seguridad y
   validación profesional intactos.

3. **Nuevo motivo de consulta.** Se consume la estructura REAL de Sinergia (`motivosAnteriores`,
   `motivoActualIndex`, `numSesionEpisodioActual`, `motivoIndex`, `numEpisodio`). La IA opera SOLO dentro
   del motivo activo y **NO mezcla** lesiones/objetivos/valoraciones/sesiones. La IA **NO inicia** un nuevo
   motivo: si el SOAP sugiere otro, emite una OBSERVACIÓN informativa; **decide el fisioterapeuta**.

4. **Biomecánica.** Se consume `p.biomecanica[].medidas[]` (sesiones → medidas): valor angular, lateralidad,
   movimiento, fecha, método y evidencia. Se distingue **actual / histórica / pendiente / eliminada**
   (tombstone `eliminado`). No se tocan los algoritmos de medición (los implementa la otra ventana).

5. **Validación / correcciones reproducibles.** Se cazaron y corrigieron errores reproducibles sobre los 85
   expedientes REALES: (a) falso **conflicto de región** por el mecanismo ("giro con pie fijo" → región
   "pie") y por la patología DERIVADA → el conflicto ahora compara SOLO zona vs dx médico (campos
   estructurados); (b) falsos **déficit neurológico/derivación** por "debilidad/pérdida de fuerza" genérica
   o "parálisis facial" antigua → ahora exige contexto neural de miembro en la misma cláusula. Resultado en
   el real-85: 6 bloqueos falsos eliminados, **sin perder ninguna alerta de emergencia/derivación**.

## Arquitectura

`extractor_v2.js` (hechos con negación/temporalidad/lateralidad/SOAP + fuerza 0–10 + neuro≠fuerza) →
`motor_seguridad_v2.js` (catálogo versionado) → `generador_v2.js` (compone el **contrato JSON**, única
fuente de verdad: dx, objetivos CP/MP/LP, plan, biomecánica, episodio, seguridad) → `render_contrato.js`
(HTML/PDF del mismo JSON).

## Cómo reproducir

```
node v2_prototipo/tests/pruebas_v2.js          # 72 pruebas, exit 0 (2 pendientes declaradas)
node v2_prototipo/tools/regenerar.js           # casos_anon.json (24 sintéticos) → datos/resultados_v22.json
node v2_prototipo/tools/comparar.js            # V2.1 (baseline_v21) vs V2.2.1 → datos/comparacion_v21_v22.{json,md}
node v2_prototipo/tools/build_html.js          # resultados JSON → datos/reporte_v22.html
# PDF desde el HTML (Chromium del entorno):
/opt/pw-browsers/chromium --headless --no-sandbox --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=datos/SINERGIA_Reporte_V2.2.1.pdf file://<abs>/datos/reporte_v22.html
```

## Set REAL de 85 (validación)

Los **20/24 casos sintéticos NO sustituyen** a los 85 reales. El real-85 se regenera con el MISMO pipeline
apuntando al export anonimizado del backend (requiere el token CLAUDE). El export y sus resultados **NO se
almacenan en GitHub** (contienen narrativa clínica = PHI): viven en el scratchpad y el PDF se entrega por
canal privado. Identificadores directos (nombre, teléfono, fechaNacimiento, médicoReferente) se eliminan;
códigos `R85-NNN`.

**Agregado real-85 (V2.1 → V2.2.1, sin PHI):**

| Métrica | V2.1 | V2.2.1 |
|---|---|---|
| Casos | 85 | 85 |
| Sin `fecha_corte` | 85 | **0** |
| Metas asumidas SIN justificar (50%/90%/Daniels/simetría sin dato) | 111 | **0** |
| ROM cualitativo reportado como grados | 20 | **0** |
| Planes distintos (variedad por patología) | 2 | **11** |
| Planes bloqueados por seguridad | — | 6 (12 antes de corregir los falsos) |
| Bloqueos nuevos vs V2.1 | — | **0** |
| Alertas de emergencia/derivación perdidas | — | **0** |

Las 6 fuerzas reales en escala 0–10 NO recibieron meta de simetría porque **ninguna** traía la referencia
sana confirmada (regla "no asumir contralateral sano" verificada en datos reales).

## Estado

Avance de V2.2.1 completo en la rama aislada. Integración con el rediseño visual **NO** autorizada todavía;
**no** se fusiona. Pendiente de la validación final de Carlos / 4ª revisión si la hubiera.
