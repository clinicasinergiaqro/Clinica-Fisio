# SINERGIA · Contrato clínico compartido (V2.2.2)

**Propósito.** Documento puente entre las dos ventanas de Claude: esta rama (lógica/contrato de datos,
`v2_prototipo/`) y la ventana del **rediseño visual** (botones/pantallas). Define la estructura de
**episodios**, **fuerza comparativa 0–10**, **ROM**, **biomecánica**, **diagnósticos**, **objetivos** y
**seguridad** que ambas deben respetar para no divergir. Es solo-lectura sobre el expediente: NO ejecuta
`saveDB`, NO modifica expedientes, NO despliega, NO se fusiona todavía con el rediseño visual.

> **Reconciliación V2.2.2 (ver §10 al final):** diagnóstico MÉDICO referido separado del funcional; fuerza
> 0–10 **multi-grupo**; EVA **reposo/movimiento**; objetivos SOLO de alteraciones reales (las tareas de
> medición van a pendientes); objetivos **CP/MP/LP** con **MP como campo NUEVO aditivo** que NO toca los
> campos históricos `objetivosCP`/`objetivosLP`; flujo de **incorporación con revisión** (aceptar/editar/
> rechazar). Nada de Daniels/MRC/dinamómetro en las propuestas.

Versión de los módulos: `extractor 2.2.2-proto · motor 2.2.2-proto · generador 2.2.2-proto · render 2.2.2-proto`.
Pipeline: `extractor_v2` (hechos) → `motor_seguridad_v2` (reglas) → `generador_v2` (contrato JSON, única
fuente de verdad) → `render_contrato` (HTML/PDF). La prosa se DERIVA de los hechos; no se redacta aparte.

---

## 1. Episodios / nuevo motivo de consulta

Se CONSUME la estructura REAL de Sinergia (solo lectura). La IA **no inicia** un motivo ni mezcla datos.

Campos de entrada (en el registro del paciente, p.ej. `rec.episodio`):

| Campo | Significado |
|---|---|
| `motivosAnteriores` | Lista de motivos previos (episodios cerrados/antiguos). |
| `motivoActualIndex` | Índice del motivo ACTIVO. La IA opera SOLO dentro de este. |
| `motivoIndex` | Índice de motivo (compat; puede coincidir con `motivoActualIndex`). |
| `numEpisodio` | Número de episodio del motivo activo. |
| `numSesionEpisodioActual` | Nº de sesión dentro del episodio activo. |

Salida en el contrato (`episodio_analisis`):

```jsonc
{
  "estructura": { "numEpisodio", "motivoActualIndex", "motivoIndex", "numSesionEpisodioActual", "motivosAnteriores_n" },
  "alcance": "La IA opera SOLO dentro del motivo activo; no mezcla lesiones/objetivos/valoraciones/sesiones de otros motivos.",
  "posible_nuevo_motivo": true|false,   // OBSERVACIÓN, no acción
  "sospecha": true|false,               // alias de compatibilidad = posible_nuevo_motivo
  "inicia_automaticamente": false,      // SIEMPRE false: la IA no abre motivos
  "decide": "fisioterapeuta",
  "explicito": bool, "cambio_region": bool,
  "region_valoracion": [...], "region_soap_reciente": [...],
  "observacion": "texto informativo | null"
}
```

**Reglas duras.**
- La IA **NUNCA** inicia un nuevo motivo ni reinicia la numeración de sesiones. Si el SOAP reciente sugiere
  otra región o usa lenguaje de "nuevo motivo", emite una **observación** (no una acción) y el
  fisioterapeuta decide. En `valoracion_pendiente` aparece como *informativo* ("…lo decide el
  fisioterapeuta, la IA no lo inicia"), nunca como "iniciar valoración desde sesión 1".
- No se mezclan lesiones, objetivos, valoraciones ni sesiones de motivos distintos.

---

## 2. Fuerza muscular — escala clínica comparativa 0–10 de Sinergia

**Definición (oficial Sinergia):** escala comparativa **0 a 10**. El **lado sano o referencia válida = 10/10**.
Un **6/10 ≈ 60% estimado** de la fuerza de referencia. **NO** se sustituye por Daniels/MRC **ni** se convierte
entre escalas (un valor legado `/5` se conserva etiquetado, nunca se pasa a `/10`).

Hechos del extractor:

| Hecho | Valor |
|---|---|
| `fuerzaEscala` | `'comparativa_0_10'` \| `'daniels_0_5'` (legado) \| `null` (cualitativa) |
| `fuerzaValor` | número de la escala detectada (p.ej. 6) |
| `fuerzaRef` | 10 (comparativa) \| 5 (Daniels) \| null |
| `fuerzaPctEstimado` | **solo** comparativa: `valor*10` (6→60). Es la DEFINICIÓN de la escala, no una conversión. |
| `fuerzaGrupo` | grupo muscular nombrado (cuádriceps, manguito rotador, prensión…) \| null |
| `fuerzaLado` | lateralidad del hallazgo \| null |
| `fuerzaRefMencionada` | ¿se menciona una referencia/contralateral? |
| `fuerzaRefSanaConfirmada` | ¿la referencia está AFIRMADA sana? (no se asume) |
| `debilidadSinContextoNeuro` | "debilidad/pérdida de fuerza" SIN contexto neural → déficit de fuerza, **no** neuro |

**Reglas duras.**
- Identificar **grupo muscular, lateralidad y referencia**.
- **No confundir** disminución de fuerza con déficit neurológico automáticamente: "debilidad"/"pérdida de
  fuerza" solo cuentan como déficit neuro OBJETIVADO si hay contexto neural explícito (nervio/raíz/
  dermatoma/miotoma/nivel medular) o un marcador duro (pie caído, arreflexia, atrofia, denervación/ENMG…).
- **No asumir** que el contralateral está sano: la meta de simetría (10/10) solo se PROPONE si
  `fuerzaRefSanaConfirmada === true`; si no, meta `null` + nota para confirmar/medir la referencia.

---

## 3. ROM (rango de movimiento)

| Hecho | Regla |
|---|---|
| `romEsNumerico` | `true` solo si hay grados (`\d+ (°\|grados)`) → línea base `tipo:'medido'`, unidad `grados`. |
| `romTextoCualitativo` | texto ("limitado", "disminuido") → `tipo:'texto_cualitativo'`, **NO** se reporta como medición en grados. |
| (ausente) | → línea base `tipo:'pendiente'` (no se inventa valor). |

Meta de ROM: `null` por defecto (no se asume simetría); se propone al documentar la referencia (lado sano
u objetivo funcional). La medición estructurada vive en biomecánica (§4), no en texto.

---

## 4. Biomecánica — contrato `p.biomecanica[].medidas[]`

Se **consume** la estructura real: `p.biomecanica` es una lista de **sesiones**, cada una con `medidas[]`.
Los **algoritmos de medición NO se tocan** (los implementa el módulo/otra ventana); esta rama solo LEE.

Entrada esperada por medida (campos aceptados / alias):

```jsonc
// sesión
{ "id", "fecha", "eliminado": false, "medidas": [
  // medida
  { "id", "articulacion"|"joint", "movimiento"|"movement", "lado"|"side",
    "valor"|"grado"|"angulo"|"grados",       // valor ANGULAR
    "tipo"|"activa_pasiva", "posicion", "metodo"|"method", "unidad"(def "grados"),
    "calidad"|"quality", "autor", "eliminado": false }
]}
```

Salida (`mediciones_biomecanica`): clasificación de **estado** por medida:

| Estado | Definición |
|---|---|
| `eliminada` | tombstone `eliminado:true` en la sesión o la medida. |
| `pendiente` | sin valor (`valor == null`) y no eliminada. |
| `actual` | la más RECIENTE (por `articulacion+movimiento+lado`) con valor y no eliminada. |
| `historica` | medidas más antiguas del mismo gesto. |

```jsonc
"mediciones_biomecanica": {
  "actuales": [...], "historicas": [...], "pendientes": [...], "eliminadas": [...],
  "conteo": { "total", "actuales", "historicas", "pendientes", "eliminadas", "sin_id" }
}
```

- **VINCULADA** = medida con `id` estructurado y **no** eliminada → entra en `mediciones` y cuenta en
  `mediciones_vinculadas_n`. Una medida sin `id` NO cuenta (va a `mediciones_sin_vincular`).
- El ROM/fuerza en TEXTO (valoracion.rom/fuerza) no es medición vinculada: aparece en
  `mediciones_sin_vincular` como tarea de captura.
- Back-compat: si un elemento de `p.biomecanica` no trae `.medidas`, se trata como una medida suelta.

---

## 5. Diagnóstico funcional

Redacción **natural, concisa e individualizada**, derivada de los hechos. Aprovecha: relato + mecanismo +
dx médico referido + síntomas (dolor; neural **referido** vs **objetivado**, sin mezclar; la disminución de
fuerza NO es neuro) + hallazgos objetivos (ROM goniométrico; **fuerza 0–10**) + limitación funcional +
antecedentes personales pertinentes + evolución (desde cuándo + nº de notas SOAP).

Salida: `diagnostico_funcional { texto, estado:'provisional', evidencias:[{campo,fragmento}] }`.
Cada afirmación conserva su **evidencia** (campo + fragmento literal citado). Si la anamnesis es
insuficiente, la primera acción es RECAPTURAR (no se inventa un diagnóstico).

---

## 6. Objetivos (corto / mediano / largo plazo)

Se generan objetivos por **horizonte** y por alteración, cada uno con indicador / línea base / unidad /
método / reevaluación / criterio de cumplimiento.

| Horizonte | Alteración típica |
|---|---|
| `corto` | dolor (EVA) / control de síntomas |
| `mediano` | ROM, fuerza |
| `largo` | función / retorno a actividad |

**Metas.** Se **proponen** metas **editables y JUSTIFICADas** cuando hay datos suficientes; donde faltaría
un supuesto, la meta queda `null` con la razón:

- Cada meta propuesta lleva `meta_propuesta { valor, tipo:'propuesta_editable' }` + `justificacion_meta`
  (cita el dato que la sustenta) + `meta_nota` (editable).
- **Dolor (EVA):** se propone un descenso escalonado por irritabilidad a partir de la EVA inicial (no es un
  supuesto fijo ni "dolor cero").
- **Fuerza (0–10):** se propone **10/10 (simetría)** SOLO si la referencia sana está **confirmada**; si no,
  `null` + nota para confirmar la referencia (no se asume el contralateral sano).
- **ROM:** `null` hasta documentar la referencia; nunca se asume simetría.
- **Función:** se propone la actividad/objetivo documentado del paciente (editable).

Se **usan los protocolos de rehabilitación** como REFERENCIA (biblioteca Sinergia), individualizados por
patología, irritabilidad y restricciones reales — **sin inventar dosificación** (`plan.*`).

---

## 7. Seguridad clínica (motor versionado)

El `motor_seguridad_v2` se mantiene y es independiente. Clasificación:
`emergencia | derivacion_prioritaria | bloqueo_por_dato_inconsistente | precaucion_especifica | error_regla
| sin_alerta_detectada_con_datos_disponibles`. Estado de regla: `verificada | pendiente_validacion` (una
regla pendiente **no** bloquea sola: aparece como precaución "requiere validación"). Toda salida es
**borrador** que requiere **validación profesional** del fisioterapeuta (`validacion_profesional`).

Puntos clave: TVP por constelación (D3); neuro en 3 niveles (referido P10 / objetivado D2 / medular);
estado oncológico contradictorio → V1 "verificar"; datos insuficientes → V2; conflicto de región
**conservador** (solo campos estructurados zona/dx/patología; el mecanismo narrativo NO entra para no
bloquear por frases como "giro con pie fijo"). Agentes físicos: matriz (modalidad, región, equipo,
condición) → nunca "permitido" seco; metal → no térmico/RF/US SOBRE el material (láser de baja potencia no
contraindicado por metal).

---

## 8. Trazabilidad / anonimización

- Todo resultado trae `fecha_corte` (última nota SOAP dentro de corte, o el default de la corrida).
- Mediciones sin `id` estructurado NO cuentan como vinculadas (`mediciones_sin_vincular`).
- Scrub de PHI defensivo sobre TODO el contrato: ningún nombre de médico sale (incluye nombres con
  partículas, p.ej. "García de Bustamante"). El dataset real NO se almacena en GitHub (PHI).

---

## 9. Qué implementa cada ventana

- **Esta rama (contrato/lógica):** define y produce el JSON de arriba; motor de seguridad; pruebas; real-85.
- **Ventana del rediseño visual:** botones/pantallas de captura (incl. el botón de medición biomecánica) y
  la presentación. Consume este contrato; **no** duplica ni modifica los algoritmos de medición ni la
  lógica del generador. La integración/fusión se hará cuando ambas partes estén validadas.

---

## 10. Reconciliación V2.2.2 (etapa de incorporación de dx/objetivos)

Cambios de esta etapa, para que la otra ventana consuma el mismo contrato sin divergir.

### 10.1 Diagnóstico MÉDICO referido separado del funcional
Nuevo campo `diagnostico_medico_referido { texto|null, estado:'referido'|'ausente', nota, evidencias }`.
El `diagnostico_funcional` ya **no** repite el dx médico (vive en su propio bloque). Bloques distintos:
**dx médico referido · dx funcional · hipótesis · seguridad · pendientes de valoración**.

### 10.2 Fuerza 0–10 — multi-grupo y sin instrumentos
`h.fuerzaGrupos = [{ grupo, lado, escala:'comparativa_0_10'|'daniels_0_5', valor, ref, pct_estimado }]` con
**TODOS** los grupos documentados; `fuerzaMultiGrupo` indica >1 grupo. La línea base de fuerza del objetivo
usa `linea_base.grupos` (array). **No** se usa Daniels/MRC ni dinamómetro en ninguna propuesta/pendiente;
un valor `/5` histórico se conserva etiquetado y nunca se convierte. La escala 0–10 (sano = 10) es la única
del protocolo y la referencia (10/10) solo se propone como meta si está **confirmada sana**.

### 10.3 EVA reposo/movimiento
`h.eva` (representativo), `h.evaReposo`, `h.evaMovimiento`. El dx lo redacta como "EVA X/10 al movimiento y
Y/10 en reposo". La meta de dolor se ancla al **dolor de movimiento** (el peor), editable, sin imponer dolor cero.

### 10.4 Objetivos = solo alteraciones REALES
Un objetivo de tratamiento se crea solo si la alteración está documentada (dolor presente; ROM con déficit;
fuerza con déficit). Las tareas de **medir** ROM/fuerza/pruebas **no** son objetivos: van a
`valoracion_pendiente`. Horizontes: `corto` (dolor), `mediano` (ROM, fuerza), `largo` (retorno funcional).

### 10.5 Mapeo a campos del expediente — **MP sin perder CP/LP** (antes de tocar el esquema)
El expediente ya tiene `dxFuncional.objetivosCP` y `dxFuncional.objetivosLP` (no hay campo de mediano plazo).
Para no perder esos campos históricos al introducir el mediano plazo, el mapeo de aplicación es **ADITIVO**:

| Horizonte (contrato) | Campo del expediente | Acción |
|---|---|---|
| corto plazo  | `dxFuncional.objetivosCP` | se escribe (campo EXISTENTE) |
| largo plazo  | `dxFuncional.objetivosLP` | se escribe (campo EXISTENTE) |
| **mediano plazo** | **`dxFuncional.objetivosMP`** | **CAMPO NUEVO, aditivo** — no existe hoy; **no toca CP/LP** |
| dx funcional | `dxFuncional.dxFuncional` | se escribe (campo EXISTENTE) |

**Plan de preservación (obligatorio antes de cambiar el esquema):** `objetivosMP` se agrega como campo
NUEVO; la migración es sólo aditiva (los expedientes sin `objetivosMP` lo tienen `undefined`, que se trata
como vacío). **No se renombra ni se borra** `objetivosCP`/`objetivosLP`. Si la otra ventana prefiere un
objeto estructurado `dxFuncional.objetivos = { CP, MP, LP }`, debe **mantener en espejo** `objetivosCP`/
`objetivosLP` como copias de lectura para compatibilidad hacia atrás hasta que todo el código lea el objeto.
Cualquiera de las dos vías conserva CP/LP; se acuerda la elección ANTES de modificar el esquema.

### 10.6 Flujo de INCORPORACIÓN (revisión profesional, sin sobrescritura)
Prototipo en `v2_prototipo/prototipo_revision/` (datos de prueba). Reglas que ambas ventanas respetan:
1. **Prioridad** a expedientes con campos vacíos.
2. Si ya hay dx/objetivo escrito por el fisio, **se conserva** y la propuesta se muestra como **alternativa**
   (nunca se auto-sobrescribe).
3. Aceptar / editar / rechazar **por campo** (dx y cada objetivo).
4. **Verificación previa** a aplicar: paciente, **episodio activo** (`motivoActualIndex`/`numEpisodio`),
   **fecha de corte** y **sin notas SOAP posteriores**; se compara un `source_hash` de la propuesta.
5. Escritura por las **rutas existentes**: ACTIVO → `saveDB('pts',[p],{camposHist:['dxFuncional',…]})`;
   MIGRADO → Firestore directo. Solo los campos aceptados/editados.
6. **Registro de cambios** en `historialCambios` y **verificación de guardado** (`res.ok && res.guardados!==0`
   → ✅; `res.pendiente` → 📴; si no confirma → ⚠️ honesto).
7. Hasta aquí todo es **EN SECO** con datos de prueba; **no se aplica a expedientes reales sin autorización**.

### 10.7 Identificadores anónimos estables (trazabilidad)
El real-85 usa `codigo = R85-<hash estable del id real>` (reproducible entre corridas). El mapeo
`R85-xxxxxx → id real` vive SOLO en el scratchpad (nunca en git). Cohorte = pacientes con actividad SOAP en
**octubre 2026**. Se distingue la **valoración inicial** de los **hallazgos posteriores del SOAP**.
