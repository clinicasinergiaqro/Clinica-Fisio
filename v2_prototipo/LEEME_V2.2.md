# SINERGIA · Generador de diagnóstico funcional — PROTOTIPO V2.2.3

**Prototipo aislado.** NO toca `index.html` de producción, NO ejecuta `saveDB`, NO modifica expedientes, NO
despliega, NO se fusiona todavía con el rediseño visual. Rama independiente `claude/generador-v2-prototipo`.
El rediseño visual (botones/ventanas) avanza en otra ventana de Claude; esta rama define y consume el
**contrato de datos** (ver `SINERGIA_Contrato_Clinico_Compartido.md`).

Módulos: `extractor / motor / generador / render = 2.2.3-proto` · catálogo seguridad `2026-11-26.e`.
Pruebas: `node v2_prototipo/tests/pruebas_v2.js` → **78 PASA · 0 FALLA · 2 PENDIENTE** (declarados).

## Novedades V2.2.3 (cierre definitivo: dx + objetivos de los 85, listos para incorporar)

- **Revisión completa del expediente incl. ESTUDIOS.** OCR/visión de recetas e informes: se recupera el dx
  médico cuando el campo está vacío pero el documento lo soporta, con **fuente + fecha**. Se separan
  **dx documentado** (receta/informe que afirma un dx) de **hallazgo radiológico** (impresión de estudio, que
  **no** constituye por sí solo un dx clínico confirmado). No se inventa. Real-85: **17** pac. con dx
  recuperado, **9** con hallazgo radiológico; **24** documentos en enlace de portal externo no consultables
  (lista aparte).
- **SOAP interpretado de verdad.** El campo `o` es un **objeto** `{rom, fuerza, hallazgos}`: se lee su
  contenido, se respeta la cronología (valoración inicial vs hallazgos posteriores vs estado actual) y se usa
  fuerza multi-grupo y ROM reales en el dx (p. ej. flexión de codo 120° del SOAP).
- **Dx funcional con marco causal.** Post-qx/fractura/LCA/menisco → “**secundaria a** …”. Región recuperada
  desde zona→dxMedico→padecimiento→SOAP (se eliminó “disfunción de otra”/“región por precisar” donde hay
  información).
- **Revisión POR SECCIÓN** (`prototipo_revision/`): dx médico · dx funcional · objetivos CP · MP · LP, cada
  uno **independiente** y **todo inicia PENDIENTE** (nada se acepta solo). Por apartado: **Conservar /
  Aceptar / Editar-combinar / Rechazar**; muestra el **texto anterior** y el **texto final a guardar**;
  registra **revisor + fecha**; un paciente **no** cuenta como aprobado si queda una sección pendiente.
  Verificación previa (paciente/episodio activo/fecha de corte/hash) y **flujo de aplicación en seco**.
- **Integridad por tres hashes** (ronda 4): `source_hash` (estado del expediente — abortar si cambió),
  `proposal_hash` (propuesta exacta) y `approved_hash` (texto aprobado por apartado). **Revisor obligatorio**;
  si el texto cambia tras aprobar, la aprobación de ese apartado se **invalida** (banner rojo) y debe
  re-confirmarse. Dx de fractura enriquecido con el descriptor anatómico documentado (p. ej. “secundaria a
  fractura **supraintercondílea humeral** postoperada”, R85-641dfb).
- **Cifras de la auditoría reconciliadas** (acento-normalizado): dx médico vacío **39** · dx funcional vacío
  **30** · objetivos CP vacíos **47** · objetivos LP vacíos **56** · planes bloqueados **16** · posible nuevo
  motivo **5**.
- **5 pacientes piloto** seleccionados para la primera validación individual (campos vacíos, info suficiente,
  sin alertas que bloqueen el plan, regiones diversas). Ver `SINERGIA_Dossier_5_Piloto`.
- **Entregables**: PDF comparativo conciso (1 pág/paciente), JSON anonimizado con propuestas, HTML de revisión
  por sección, matriz de correcciones de auditorías, inventario de documentos, lista de no consultables, mapa
  durable R85↔id real (**PHI, fuera de GitHub**), ZIP de código, pruebas.

- **Redacción clínica Sinergia** (`src/redaccion_sinergia.js`): capa que compone el dx funcional y los
  objetivos CP/MP/LP en **prosa natural de fisioterapeuta** (30–60 palabras, estilo de los ejemplos de la
  clínica) a partir de los hechos YA verificados — **sin** "Cuadro:", "en seguimiento (N notas)", conteos de
  sesión, "Exploración por completar/PROVISIONAL" ni "Paciente de X años". Región + lateralidad con
  concordancia de género; encuadre causal ("secundaria a…") **sólo** cuando la región concuerda (no afirma
  "cervical secundaria a LCA"); fuerza en escala 0–10 de Sinergia; precauciones/pendientes **aparte**. Con
  plan bloqueado por seguridad se conserva el dx pero NO se proponen objetivos de progresión. No reconstruye
  el generador: la extracción, la seguridad y los objetivos (qué alteraciones existen) quedan intactos; sólo
  cambia la REDACCIÓN. Verificado en los 85: 0 frases de máquina, longitud media 27 palabras, 0 encuadres
  causales fuera de su región.

## Novedades V2.2.2 (base de la etapa)

## Novedades V2.2.2 (cerrar la 1ª etapa: dx + objetivos de los 85, listos para incorporar)

- **Dx estructurado:** bloques separados **dx médico referido · dx funcional · hipótesis · seguridad ·
  pendientes**. Prosa fisioterapéutica concisa (EVA reposo/movimiento, fuerza 0–10 multi-grupo, mecanismo,
  antecedentes, evolución SOAP). No concatena campos.
- **Objetivos = solo alteraciones reales** (CP/MP/LP). Las tareas de *medir* ROM/fuerza/pruebas van a
  pendientes, no a objetivos. Metas propuestas, editables y justificadas; sin dolor cero/simetría universal/
  tiempos rígidos.
- **Fuerza:** escala 0–10 de Sinergia con **múltiples grupos musculares** (valor+lado+% por grupo).
  **Eliminadas todas las recomendaciones de Daniels/MRC/dinamómetro** de las propuestas y pendientes.
- **Correcciones reproducibles** (auditorías): EVA robusta (reposo/movimiento, rangos, `7/10`→7),
  lateralidad por hallazgo, multi-grupo, fecha de corte, seguridad (sin falsos neuro por "debilidad" ni
  falsos conflictos de región), nuevo motivo (la IA no inicia), biomecánica `medidas[]`.
- **Cohorte real-85 = OCTUBRE 2026** con **IDs anónimos ESTABLES** (hash del id real, reproducibles); mapeo
  privado solo en scratchpad. Se distingue valoración inicial vs hallazgos SOAP posteriores.
- **Reporte CONCISO** (`tools/build_conciso.js`): **1 página por paciente** (dx anterior vs propuesto,
  objetivos anteriores vs nuevos CP/MP/LP, pendientes, precauciones, estado de revisión) en vez del PDF largo.
- **Prototipo de revisión** (`prototipo_revision/`): aceptar/editar/rechazar por campo, prioriza vacíos,
  conserva lo del fisio como alternativa, verificación previa (paciente/episodio/fecha/cambios) y **flujo de
  aplicación en seco** por las rutas existentes (no escribe a expedientes). Probado con datos sintéticos.
- **Contrato reconciliado** (§10): **MP como campo NUEVO aditivo** `objetivosMP` que **no toca** `objetivosCP`
  /`objetivosLP`; plan de preservación documentado antes de tocar el esquema.

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
node v2_prototipo/tests/pruebas_v2.js          # 78 PASA / 0 FALLA / 2 PENDIENTE, exit 0
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

Cierre de V2.2.3 completo en la rama aislada: dx + objetivos de los 85 definitivos, estudios revisados (OCR),
herramienta de revisión por sección corregida, 5 pilotos seleccionados y entregables listos. **No** se ha
ejecutado `saveDB`, **no** se ha tocado ningún expediente real, **no** se despliega y **no** se fusiona con el
rediseño visual. Siguiente paso: validación individual de los 5 pilotos por el fisioterapeuta en la
herramienta de revisión; la incorporación real a expedientes requiere autorización explícita campo por campo.
