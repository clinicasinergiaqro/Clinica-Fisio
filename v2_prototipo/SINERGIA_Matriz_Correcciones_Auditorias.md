# SINERGIA · Matriz de correcciones de las auditorías (V2 → V2.2.3)

**Rama aislada** `claude/generador-v2-prototipo` · **sin `saveDB`, sin tocar expedientes reales, sin desplegar, sin fusionar con el rediseño visual.**
Módulos en esta entrega: extractor / motor / generador / render `2.2.3-proto` · catálogo de reglas `2026-11-26.e`.
Pruebas: `node v2_prototipo/tests/pruebas_v2.js` → **78 PASA · 0 FALLA · 2 PENDIENTE** (declarados).

> La aceptación de la arquitectura no constituye aprobación clínica ni autorización de producción. Todo es BORRADOR y requiere validación y firma del fisioterapeuta.

Cada fila enlaza el hallazgo de auditoría con **qué se cambió**, **dónde** (archivo/función) y **la prueba** que lo reproduce y lo deja fijo.

---

## Ronda 1 — Auditoría de arquitectura (V2 → V2.1)

| # | Hallazgo | Corrección | Dónde | Prueba |
|---|----------|-----------|-------|--------|
| 1 | Razonaba por coincidencia de palabras; pruebas sólo declaradas (Excel) | Se separó **extracción de hechos** de **reglas deterministas**; pruebas ejecutables que reproducen cada error | `extractor_v2.js` / `motor_seguridad_v2.js` / `tests/pruebas_v2.js` | toda la suite |
| 2 | Prosa “mejorada” aparte del dato | **JSON = única fuente de verdad**; PDF y prototipos se construyen desde él | `render_contrato.js` | — |
| 3 | Sin negación/temporalidad/lateralidad/región; “retorno a” lesión negada | Extractor con negación, temporalidad, lateralidad, región, antecedente personal vs familiar; guard `actividadValida` | `extractor_v2.js` | NEG-*, LAT-*, OBJ-01/02 |
| 4 | Motor de seguridad incompleto (TVP, cervical adulto, oncológico, conflicto de región, cribado, alarma en SOAP, no silenciar excepciones) | Catálogo versionado E/D/X/P; cada regla con clasificación y acción | `motor_seguridad_v2.js` | TVP, CERV, CONF, CRIB, SOAP, ONCO, ERR |
| 5 | Agentes físicos “permitido” automático | `evaluarAgente`: `verificar` / `permitido_condicionado` / `contraindicado`; nunca permiso ciego | `motor_seguridad_v2.js` | AG-01..05 |
| 6 | No leía SOAP (inicial vs evolución) | Lectura de SOAP fechado; recalcular seguridad con lo posterior | `extractor_v2.js` | SOAP-01/02 |
| 7 | Objetivos genéricos (un solo EVA) | Un objetivo por alteración; cada indicador con línea base/unidad/método/criterio | `generador_v2.js` | OBJ-03/04, BLK-01 |
| 8 | Biomecánica no integrada | Lectura de `p.biomecanica`, conserva id/articulación/lado; bloquea medición con alerta | `generador_v2.js` | MED-01/02 |
| — | PHI: nombre de médico en cadena exportada | `scrubPHI`/`scrubDeep`; 0 nombres en salida | `generador_v2.js` | PHI-01/02 |

---

## Ronda 2 — Auditoría clínica (ChatGPT, 2ª) incorporada en V2.2 / V2.2.1

| # | Hallazgo | Corrección | Dónde | Prueba |
|---|----------|-----------|-------|--------|
| 9 | **Fuerza en Daniels/MRC/dinamómetro** | **Escala 0–10 comparativa de Sinergia** exclusiva (sano=10, 6/10≈60%); eliminada toda recomendación de Daniels/MRC/dinamómetro de propuestas y pendientes | `generador_v2.js` `_fraseFuerza` | V222-NO-DANIELS |
| 10 | Descenso de fuerza leído como **déficit neurológico** | `debilidadSinContextoNeuro`: la debilidad no implica neuro salvo contexto explícito | `extractor_v2.js` | V22-NEURO-FUERZA |
| 11 | “No valorado/No evaluado” tratado como déficit | Se distingue **no evaluado** (hueco de examen) de **vacío**/**alterado**; no genera objetivo de fuerza por “no valorado” | `extractor_v2.js` / `generador_v2.js` | OBJ-FUERZA-* |
| 12 | Un solo grupo muscular | **Multi-grupo**: valor + lado + % por grupo, con fecha y referencia sana | `extractor_v2._parseFuerzaMulti` | V222-FUERZA-MULTI |
| 13 | EVA mal leída (`7/10`→10, rangos) | `_parseEVA` robusto: reposo/movimiento, rangos, quita denominador `/10`; meta anclada al dolor de **movimiento** | `extractor_v2._parseEVA` | V222-EVA-REPOSO-MOV |
| 14 | Lateralidad por defecto | Lateralidad **por hallazgo**; no se resuelve contradicción por suposición | `extractor_v2.js` | V22-LAT-HALLAZGO |
| 15 | La IA podía **iniciar un nuevo motivo** | La IA **no** inicia motivo; sólo marca `posible_nuevo_motivo` para que lo decida el fisioterapeuta | `generador_v2.js` `episodio_analisis` | V22-NUEVO-MOTIVO |
| 16 | Biomecánica sin contrato de datos | `p.biomecanica[].medidas[]` con id/articulación/lado/valor/fecha | contrato + `generador_v2.js` | MED-* |

---

## Ronda 3 — Auditoría clínica (ChatGPT, 3ª) incorporada en V2.2.2 / V2.2.3

| # | Hallazgo | Corrección | Dónde | Prueba / evidencia |
|---|----------|-----------|-------|--------|
| 17 | Dx concatenaba campos | **Dx estructurado**: médico referido · funcional · hipótesis · seguridad · pendientes | `generador_v2.js` | suite dx |
| 18 | “Disfunción de otra”, “región por precisar” con info disponible | **Recuperación de región** desde zona→dxMedico→padecimiento→SOAP; etiqueta legible | `extractor_v2._regionLabel`, `regionRecuperada` | revisión real-85 |
| 19 | No usaba el **contenido** del SOAP | `_soapClinico`: interpreta `o` (objeto `{rom,fuerza,hallazgos}`), respeta cronología, estado actual vs inicial, filtra ruido | `extractor_v2._soapClinico`, `_oTexto` | real-85 (p. ej. R85-641dfb usa flexión de codo 120°) |
| 20 | Post-qx/fractura sin marco causal | Marco **“secundaria a”** (Aquiles/fractura/LCA/menisco) | `generador_v2.dxFuncional` | R85-72271e, R85-641dfb |
| 21 | **Estudios ignorados** (dxMedico vacío con receta/RM que sí trae dx) | **OCR/visión** de recetas e informes; **dx documentado** vs **hallazgo radiológico** separados, con fuente+fecha; no se inventa | `recovered_docs.json` → `diagnostico_medico_documentado` / `hallazgos_radiologicos` | inventario: 17 pac. con dx recuperado, 9 radiológicos |
| 22 | Objetivos sin MP y riesgo de pisar CP/LP | **`objetivosMP` campo NUEVO aditivo**; no toca `objetivosCP`/`objetivosLP` | contrato §10 + builder | V22-MP-ADITIVO |
| 23 | Interfaz aceptaba cambios automáticamente | Revisión **por sección** (dx médico/funcional/CP/MP/LP), todo inicia **pendiente**; Conservar/Aceptar/Editar/Rechazar; muestra texto anterior y final; registra revisor+fecha; no cuenta como aprobado si queda algo pendiente | `prototipo_revision/index.html` | render headless 85 fichas, 0 errores JS |
| 24 | Incorporación sin verificación | **Flujo en seco**: verifica paciente, episodio activo, fecha de corte, hash, campos aprobados; sólo escribe secciones aceptadas/editadas; historialCambios antes/después | `prototipo_revision` (dry-run) | — |
| 25 | Cifras del expediente mal detectadas (placeholder con acentos) | `lleno()` normaliza acentos → “No cuenta con **diagnóstico médico** referido” se trata como vacío | `tools/build_revision_data.js` | reconciliación: dx méd 39 · dx func 30 · CP 47 · LP 56 |

**Pendientes declarados (no fingidos):** (a) catálogo de agentes físicos por equipo/modelo/parámetros del inventario real; (b) enganche al módulo biomecánico real sin duplicar algoritmos; (c) 24 documentos en **enlace de portal externo** (CMJ/DaiCloud) no descargables en esta revisión → consulta manual (ver *Documentos No Consultables*).

---

## Ronda 4 — Referencia definitiva (corrección puntual, sin reconstrucción)

| # | Hallazgo / pedido | Corrección | Dónde | Prueba |
|---|----------|-----------|-------|--------|
| 26 | Faltaban `proposal_hash` y `approved_hash` (solo había `source_hash`) | **Tres hashes**: `source_hash` (estado del expediente — abortar si cambió), `proposal_hash` (propuesta exacta revisada), `approved_hash` (texto aprobado, sellado por apartado) | `build_revision_data.js` (source/proposal) + `prototipo_revision/index.html` (`_h` FNV-1a, approved) | smoke headless |
| 27 | Revisor no obligatorio | **Revisor obligatorio**: sin nombre no se sella ningún apartado (alerta) | `index.html` `sellar()` | smoke (aceptar sin revisor → no sella) |
| 28 | La aprobación no se invalidaba al editar después | Si el texto final cambia tras sellar → **approved_hash deja de coincidir** → apartado **INVALIDADO** (banner rojo + re-confirmar); no cuenta como aprobado | `index.html` `secInvalidada`/`secAprobada` | smoke (editar tras sellar → INVALIDADA) |
| 29 | Un paciente podía contar aprobado con apartados sin sellar | **APROBADO** sólo si: no bloqueado, verificado, revisor, y **cada** apartado sellado y sin cambios | `index.html` `aprobado()` | smoke (conservar 5 + verificar → APROBADO) |
| 30 | Dx de fractura genérico (prioridad codo R85-641dfb) | El marco causal **enriquece el descriptor anatómico documentado** (“secundaria a fractura **supraintercondílea humeral** postoperada”), tomándolo del dx documentado; se descartan nombres de región como descriptor | `generador_v2.js` (encuadre causal) | 78 PASA; R85-641dfb = texto objetivo |

> Nota de procedencia: los dos archivos que se recibieron como “referencia de ChatGPT” eran en realidad las salidas **propias V2.2.2** (con los defectos “disfunción de otra”/“región por precisar” que V2.2.3 ya corrige). Se procedió con las instrucciones escritas, que son especificación completa. **No** se reconstruyó el generador: sólo las correcciones puntuales de esta ronda.

---

## Trazabilidad de las cifras de la auditoría (verificadas tras consultar documentos)

| Cifra del encargo | Verificada | Fuente |
|---|---|---|
| 85 pacientes, cohorte octubre 2026 | ✔ 85 | `real85_anon.json` |
| objetivosLP vacíos | ✔ **56** | `build_revision_data` (acento-normalizado) |
| objetivosCP “Pendiente” | ✔ **47** | idem |
| dxFuncional sólo “No cuenta con dx médico referido”/“Pendiente” | ✔ **30** | idem |
| sin dx médico | ✔ **39** | idem |
| planes bloqueados por seguridad | ✔ **16** | `resultados_real85` (`bloquea_plan`) |
| posible nuevo motivo (lo decide el fisio) | ✔ **5** | `episodio_analisis` |
| dx médico recuperado de documentos | ✔ **17** pac. | OCR/visión |
| hallazgos radiológicos (no dx confirmado) | ✔ **9** pac. | OCR/visión |

> “región por precisar / disfunción de otra” (≈21 en la auditoría) se resolvió por recuperación de región; lo que permanece como **PROVISIONAL** es un marcador honesto de exploración incompleta (fuerza/pruebas no evaluadas), **no** un defecto de redacción.
