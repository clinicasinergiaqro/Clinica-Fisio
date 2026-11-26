# SINERGIA — Plan de Implementación del Generador de Diagnósticos Funcionales V2

**Clínica Sinergia · Fisioterapia y Rehabilitación**
Borrador técnico para validación clínica y de ingeniería · 26 de noviembre de 2026
**Rama aislada `claude/generador-v2-prototipo` · SOLO LECTURA · sin `saveDB` · sin deploy**

---

## 0. Propósito y principios

Construir un **generador V2 aislado** que, a partir del expediente completo, produzca un **borrador** de diagnóstico funcional, hipótesis, seguridad, objetivos y plan de rehabilitación — **para que el fisioterapeuta lo valide, edite y apruebe**. No sustituye el juicio clínico ni emite diagnósticos médicos.

Principios rectores (de la auditoría interna + la V2 de revisión independiente):

1. **No inventar.** Si solo hay síntomas, se describen; no se fabrica déficit, grado, restricción ni línea base.
2. **La seguridad manda.** Un motor de seguridad independiente y versionado puede **bloquear** las recomendaciones terapéuticas y priorizar la acción de seguridad.
3. **Separar lo referido / observado / medido / hipótesis.** La hipótesis estructural vive en campo aparte, con sustento y "qué falta para contrastarla".
4. **Trazabilidad por evidencia.** Cada afirmación apunta a su fuente (ruta, fecha, tipo, id interno), no a datos personales copiados.
5. **Cronología estricta.** Distinguir la valoración inicial de la situación actual; no mezclar datos posteriores a la fecha de corte en una reconstrucción retrospectiva.
6. **El fisio aprueba.** Nada se escribe en el expediente sin validación explícita; si cambia un dato crítico, se invalida la aprobación.
7. **Aislado y de solo lectura.** El prototipo no ejecuta `saveDB`, no modifica expedientes, no sobrescribe valoraciones ni SOAP, no se despliega. Los archivos exportados se **anonimizan** y no incluyen credenciales.

---

## 1. Arquitectura por capas

```
┌─ EXTRACCIÓN ────────────────────────────────────────────────┐
│ Lee el expediente completo (read-only) y arma un modelo de  │
│ hechos fechados, con procedencia, episodio y región.        │
└───────────────┬─────────────────────────────────────────────┘
                ▼
┌─ NORMALIZACIÓN ─────────────────────────────────────────────┐
│ Estados controlados (no_evaluado, no_indicado, contraindicado│
│ , normal_documentado, alterado_documentado, desconocido).   │
│ 0 ≠ faltante. Conserva contexto/método/unidad. No convierte. │
└───────────────┬─────────────────────────────────────────────┘
                ▼
┌─ DETECCIÓN DE CONFLICTOS ───────────────────────────────────┐
│ Zona/lado, cronología, escala, estado de seguridad.         │
│ No resuelve por mayoría. No infiere remisión/sexo/estructura.│
└───────────────┬─────────────────────────────────────────────┘
                ▼
┌─ MOTOR DE SEGURIDAD (independiente, versionado) ────────────┐
│ Reglas con fuente. Clasifica: emergencia · derivación       │
│ prioritaria · bloqueo por dato inconsistente · precaución   │
│ específica · sin alerta detectada. Decide si bloquea el plan.│
└───────────────┬─────────────────────────────────────────────┘
                ▼
┌─ GENERACIÓN ────────────────────────────────────────────────┐
│ Dx funcional conciso · hipótesis (aparte) · objetivos CP/   │
│ MP/LP · indicadores de reevaluación · plan por fases        │
│ (ejercicio+dosis, agentes físicos, precauciones, qué sí/qué │
│ no, criterios de progresión/alta) — condicionado a seguridad.│
└───────────────┬─────────────────────────────────────────────┘
                ▼
┌─ CONTRATO DE SALIDA (JSON) + CAPA DE VALIDACIÓN ────────────┐
│ JSON versionado, trazable, editable. El fisio aprueba; se   │
│ registra autor/fecha/versión/fuentes; se invalida si cambia │
│ un dato crítico.                                            │
└─────────────────────────────────────────────────────────────┘
```

**Decisión de diseño — determinista + redacción acotada.** El **núcleo auditable** (extracción, normalización, conflictos, motor de seguridad, andamiaje de objetivos y mediciones) es **100% reglas deterministas en JS** (reproducible, sin IA, con fuentes). La **redacción en prosa** del diagnóstico funcional y las hipótesis se genera con un modelo **acotado estrictamente a los hechos extraídos** (no puede introducir estructuras, grados ni restricciones que no estén en el modelo de hechos). En el prototipo interactivo, la prosa de ejemplo usa **datos sintéticos**.

---

## 2. Modelo de datos leído (extracción)

Campos del expediente que el generador V2 **debe** consultar (todos de solo lectura):

| Bloque | Campos | Uso |
|---|---|---|
| Identidad clínica | `age`, `sexo` (si documentado; no inferir) | contexto; nunca exportar nombre/teléfono |
| Diagnóstico médico | `dx`, `motivo.dxMedico`, `dxFuncional.dxClinico` | condición referida (con fuente), NO como funcional |
| Motivo / anamnesis | `motivo.{padecimiento, zonaPrincipal, lado, mecanismo, evolucion, desdeCuando}`, `motivoHC` | síntomas, región, lado, cronología |
| Valoración | `valoracion.{eva, rom, fuerza, pruebasEspeciales, palpacion, marcha, inflamacion, flex, dermato}` | hallazgos observados/medidos |
| **Seguridad clínica** | `seguridadClinica.{condiciones, condicionesObs, implantes, implantesDetalle, banderasRojas, banderasDetalle, contraindicaciones, alergias}` | **motor de seguridad** (hoy ignorado) |
| Antecedentes | `antecedentes.{patologicos(=HEREDOFAMILIAR), cirugias, medicamentos, deportivos, deporteFrecuencia}` | **separar familiar vs personal**; cirugías/medicamentos = seguridad |
| Contraindicaciones | `contraindicaciones` (campo dedicado) | seguridad |
| Alergias | `alergias` | seguridad |
| Evolución | `soap` / `soap2` / `soap3` (notas SOAP con fecha, EVA inicio/fin, modalidades) | situación **actual** vs inicial |
| Estudios | `estudiosDocs[]` (tipoClinico, fecha, url) | evidencia referida de imagen (NO afirma causalidad) |
| Revaloraciones | `revaloraciones[]` | cambios en el tiempo |
| Mediciones biomecánicas | `valoracion.rom` (escrito por el goniómetro de cámara) + `biomecanica[]` (sesiones del módulo 🦴) | **mediciones validadas** con id/fecha/lado/método (ver §8) |
| Plan previo | `planTto.{protocolo, enfoqueTerapeutico, contraindicaciones, objetivosCP, objetivosLP}` | continuidad |

**Reglas de procedencia y cronología:**
- A cada hecho se le adjunta `{fuente, fecha, episodio, region, lado, tipo∈[referido|observado|medido|hipotesis]}`.
- **Fecha de corte**: para una reconstrucción retrospectiva de una fecha X, se **excluye** todo dato posterior a X (p.ej. una nota SOAP de seguimiento no entra en la valoración inicial).
- `motivoActualIndex` / `motivosAnteriores` / `episodios` delimitan el **episodio** vigente; no se mezclan regiones de episodios distintos.

---

## 3. Normalización (sin borrar el original)

- **Estados controlados** por campo: `no_evaluado`, `no_indicado`, `contraindicado`, `normal_documentado`, `alterado_documentado`, `desconocido`. El valor original **siempre** se conserva en paralelo.
- **0 no es faltante** (EVA 0 = sin dolor = dato válido).
- **EVA**: se conserva su **contexto** (reposo / actividad / máximo), método y unidad; si hay dos EVA incompatibles (ficha 4 vs relato 7–8) → **discrepancia**, no promedio.
- **Fuerza**: no se convierte "7/10" a MRC/Daniels; se conserva escala y método tal cual, marcando "escala no estándar — aclarar método".
- **ROM**: separar **activo vs pasivo**, posición y método; no copiar un ROM histórico como actual.

---

## 4. Detección de conflictos (no auto-resuelve)

Detecta y **marca** (no corrige por mayoría):
- **Zona/lado**: dx médico dice derecho, registro dice izquierdo → `discrepancia(lado)` → el motor de seguridad **bloquea el plan lateralizado** hasta reconciliar.
- **Cronología**: "2 años" vs "2 meses"; cirugía 2025 vs 2026 → `discrepancia(cronologia)`.
- **Escala**: EVA incompatibles; fuerza sin método.
- **Estado de seguridad**: condición marcada activa vs antigüedad que sugiere remisión → **no inferir remisión**; marcar para aclaración.
- **Región del campo vs relato**: p.ej. zona codificada "cadera" con relato de lumbalgia → `discrepancia(region)`.

---

## 5. Motor de seguridad (independiente y versionado)

Ver catálogo completo y fuentes en **`SINERGIA_Motor_Seguridad_V2.md`**. Resumen de diseño:

- **Módulo separado y versionado** (`motor_seguridad_v2.js`, `version`, `fecha`, `fuentes`). Reglas **revisadas por profesional** antes de activarse; se distinguen **reglas verificadas** de **pendientes de validación**.
- **Clasificación de alerta** (no solo rojo/amarillo/verde):
  - `emergencia` — posible urgencia (p.ej. señales de compresión medular / cauda equina, trauma cervical pediátrico sin descartar). → **No** sugerir ejercicio ni pruebas provocativas; permitir **documentar y derivar**.
  - `derivacion_prioritaria` — p.ej. dolor nuevo persistente en paciente con cáncer activo → cribado/valoración médica antes de progresar.
  - `bloqueo_por_dato_inconsistente` — lado/región sin confirmar → bloquea plan lateralizado.
  - `precaucion_especifica` — restricción documentada (p.ej. metal, osteoporosis, anticoagulación, embarazo, diabetes, AR + inmunosupresor).
  - `sin_alerta_detectada_con_datos_disponibles` — **no** equivale a "sin banderas rojas": si el cribado no consta, se dice explícitamente "cribado no documentado".
- **Agentes físicos — regla fina (corrección clave de la V2):** **no** se prohíben *todos* los agentes por metal o cáncer. Se respeta la **restricción documentada** y se valida **modalidad + región + equipo/fabricante** (p.ej. metal → no RF/diatermia/US térmico **sobre el material**; láser de baja potencia no se contraindica por metal). Si la restricción no está documentada, se marca "verificar", no "prohibido".
- **Regla de honestidad**: nunca escribir "sin banderas rojas" si el cribado no está documentado; nunca inferir remisión, sexo ni lesión estructural.

---

## 6. Generación de contenido

**6.1 Diagnóstico funcional** (1–3 frases, extensión flexible): alteraciones funcionales reales + limitación de actividad y participación **documentadas**. Modelo CIF: *"Disfunción de [región/lado] en contexto de [condición documentada], caracterizada por [síntomas/déficits comprobados], que limita [actividad/participación]."* Si solo hay síntomas → se describen; sin fabricar déficit.

**6.2 Hipótesis clínicas** (campo aparte): estructura probable con **sustento** y **qué falta** para contrastarla; marcada "a confirmar". No atribuye causalidad a imagen/postura/palpación.

**6.3 Objetivos** — **corto / mediano / largo plazo**, ligados a problema + actividad prioritaria:
- Separar **tareas de valoración** (p.ej. "medir ROM") de **objetivos terapéuticos**.
- Si falta línea base → `linea_base: null` + "medir".
- Metas numéricas y plazos = **propuestas editables**, no datos medidos ni pronósticos. **No** imponer dolor cero, simetría ≥90% ni plazos fijos 0–3/4–10 sem.
- Comparación bilateral solo si pertinente y con referencia válida (p.ej. no usar un lado operado como "sano").

**6.4 Indicadores de reevaluación**: qué medir, con qué escala/prueba **validada pertinente** (NDI, Oswestry/PSFS, SPADI/QuickDASH, PRWE+dinamometría, FAAM+WBLT, IKDC+hop, VISA-A, KOOS/WOMAC+30sCST, TUG…) y cuándo; sin obligar pruebas innecesarias.

**6.5 Plan de rehabilitación por fases** — **solo** cuando seguridad y datos esenciales lo permiten:
- Fases con **ejercicio + dosis**, criterios de **tolerancia/progresión**, **restricciones**, y **agentes físicos pertinentes con justificación** (no se exige aparatología).
- **Qué puede hacer / qué todavía no** el paciente (tarjetas ✅/🚫 por fase).
- **Criterios de progresión y de alta** objetivos.
- **Si hay alerta crítica sin resolver → el plan se BLOQUEA**: muestra la **acción de seguridad siguiente**, no una receta de tratamiento (`plan: null` + `bloquea_plan: true`).

---

## 7. Contrato de salida (JSON) — adaptado al esquema real

```jsonc
{
  "version_generador": "v2.0-proto",
  "episodio": "OCT-NN",              // código anónimo, nunca nombre
  "fecha_corte": null,               // ISO; null = situación actual
  "diagnostico_funcional": { "texto": "", "estado": "provisional|confirmado", "evidencias": [] },
  "hipotesis": [ { "texto": "", "sustento": [], "pendiente": [], "evidencias": [] } ],
  "seguridad": {
    "estado": "pendiente|emergencia|derivacion_prioritaria|bloqueo|precaucion|sin_alerta_detectada",
    "alertas": [ { "regla": "", "fundamento": "", "fuente": "", "modalidad_region": "", "estado": "verificada|pendiente", "accion": "" } ],
    "bloquea_plan": true
  },
  "discrepancias": [ { "tipo": "lado|region|cronologia|escala", "detalle": "", "accion": "" } ],
  "valoracion_pendiente": [ "" ],
  "objetivos": [
    { "fase": "corto|mediano|largo", "actividad": "", "indicador": "", "linea_base": null,
      "meta_propuesta": null, "unidad": null, "metodo": null, "reevaluacion": null,
      "criterio_cumplimiento": null, "evidencias": [] }
  ],
  "plan": null,                      // null si no es seguro proponerlo
  "mediciones_ids": [],              // referencias a mediciones del módulo biomecánico
  "validacion_profesional": { "estado": "borrador|editado|aprobado", "autor": null, "fecha": null, "fuentes": [], "cambios": [] }
}
```

**Mapeo al esquema real de la app (cuando se integre, fuera de este prototipo):** el `diagnostico_funcional.texto` → `dxFuncional.dxClinico`; objetivos corto/largo → `dxFuncional.objetivosCP`/`objetivosLP` (el **mediano** requiere campo nuevo o se integra en `planTto`); el plan → `planTto`; precauciones → se ligan a `seguridadClinica`/`_soapSeguridadHTML` (ya existentes). **Comprobar el esquema real antes de mapear campos nuevos**; preferir reusar `dxFuncional`/`planTto` (ya cableados en Sheet+Firestore+reglas) para no desplegar backend.

---

## 8. Integración biomecánica (ver `SINERGIA_Integracion_Biomecanica_V2.md`)

- **No duplicar el motor biomecánico** existente (módulo 🦴: goniómetro de cámara, foto/video, comparador antes/después).
- El generador **recupera** mediciones validadas (no las transcribe a mano) conservando `{id, valor, unidad, lado, articulacion, movimiento, activa/pasiva, posicion, metodo, fecha, calidad, autor, evidencia}`.
- Botones **"Medir ROM"** / **"Importar medición desde valoración y SOAP"**: guardan el **id** de la medición, no el número suelto; **no copiar históricos como actuales**; comparar solo mediciones **compatibles** (misma articulación/movimiento/lado/método); mantener histórico y versión.
- El goniómetro ya escribe a `valoracion.rom` → es la fuente natural de **línea base** de ROM (hoy el 79% de los expedientes no la tiene capturada).

---

## 9. Capa de validación profesional

- Salida nace **borrador**. El fisio **edita y aprueba explícitamente**. Se pueden guardar borradores y notas de derivación.
- **No se puede aprobar un plan rutinario bloqueado** por una alerta crítica.
- Se registra **autor, fecha, versión, fuentes y cambios**. Si cambia un **dato crítico** (lado, estado de seguridad, medición base) → **se invalida la aprobación** y se re-evalúa.

---

## 10. Aislamiento, privacidad y pruebas

- **Rama aislada** `claude/generador-v2-prototipo`; **solo lectura** sobre expedientes; **sin `saveDB`**, sin sobrescritura de valoraciones/SOAP, **sin deploy**.
- **Anonimización**: los archivos exportados usan código `OCT-NN`; se excluyen nombres, teléfonos, identificadores y credenciales. Las evidencias apuntan a **id interno**, no a datos personales.
- **Pruebas de aceptación** (detalle en `SINERGIA_Matriz_Pruebas_V2.xlsx`):
  - **Retrospectiva de los 85** de octubre con datos completos; conservar la salida original y comparar por caso; **no contar aciertos como errores**; distinguir riesgo del paciente de gravedad del fallo del sistema.
  - **Casos mínimos** (criterios semánticos, no cadenas literales): lado OCT-72; región+oncológico OCT-84; neuro/onco OCT-11; trauma cervical pediátrico OCT-79; LCA ipsilateral OCT-65; contralateral no-sana OCT-02; antecedente familiar no personal OCT-23; EVA discordante OCT-56; medición ausente vs 0; SOAP posterior a corte; medición de otro episodio; ROM activo vs pasivo; duplicados; medición inválida; reapertura de alerta por dato nuevo.
  - **Casos sintéticos de seguridad** añadidos (no reusar los 85 como validación independiente; reservar expedientes nuevos para generalización).
  - **Criterios de calidad del banco**: cero invenciones verificadas; cero conflictos críticos de lado no detectados; cero planes aprobables ante alertas bloqueantes conocidas; 100% de mediciones incorporadas con trazabilidad y unidades. *(Son objetivos de calidad del banco de prueba, no garantías de seguridad clínica.)*

---

## 11. Fases de entrega del prototipo

1. **Diseño** — este plan + `SINERGIA_Motor_Seguridad_V2.md` + `SINERGIA_Integracion_Biomecanica_V2.md`.
2. **Código del núcleo** — `generador_v2.js` + `motor_seguridad_v2.js` + `normalizacion.js` + `conflictos.js` (deterministas, Node + navegador).
3. **Regeneración de los 85** con datos completos → `SINERGIA_Resultados_85_V2.json` (anónimo).
4. **Comparativa** anterior vs V2 → `SINERGIA_Comparativa_85_Pacientes_V2.pdf`.
5. **Matriz de pruebas** (85 + sintéticos + casos mínimos) → `SINERGIA_Matriz_Pruebas_V2.xlsx`.
6. **Prototipo visual interactivo** (datos sintéticos, identidad Sinergia) → `SINERGIA_Prototipo_Visual_V2.zip` con los apartados: Dx funcional · Hipótesis · Objetivos · Seguridad · Plan · Mediciones biomecánicas · Evolución · Validación.
7. **Empaquetado de código** → `SINERGIA_Codigo_Generador_V2.zip`.

## 12. Fuera de alcance (por ahora)

- Diseño UI/UX definitivo (se hará tras la auditoría UX/UI de toda la app).
- Integración real en `index.html` / escritura a `dxFuncional`/`planTto` (requiere autorización posterior; respetará integridad de guardado, activo=migrado, Android+iOS y bump de versión).
- Despliegue (GitHub Pages/Firebase) — **no** en esta fase.

## 13. Decisiones abiertas para Carlos / segunda auditoría

- Campo para **objetivo de mediano plazo** (hoy la app solo tiene CP/LP): ¿campo nuevo o se absorbe en `planTto`?
- Umbral del semáforo del dolor y catálogo final de reglas del motor de seguridad (requiere firma del fisioterapeuta de referencia).
- Qué mediciones biomecánicas se consideran "validadas" para alimentar objetivos automáticamente.
