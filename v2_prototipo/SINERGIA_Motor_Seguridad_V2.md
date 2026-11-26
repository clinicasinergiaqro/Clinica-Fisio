# SINERGIA — Motor de Seguridad Clínica V2 (catálogo de reglas)

**Clínica Sinergia · V2 del generador · módulo `motor_seguridad_v2.js`**
`version: 2.0.0-proto · fecha: 2026-11-26 · estado: BORRADOR — requiere firma del fisioterapeuta de referencia`

> **Advertencia.** Este catálogo es una ayuda a la decisión, **no** un sustituto del juicio clínico ni una garantía de seguridad. Ninguna regla diagnostica ni autoriza tratamiento por sí sola. Las reglas marcadas **PENDIENTE** no deben activarse como bloqueo automático hasta ser validadas por un profesional y, en agentes físicos, contra las **instrucciones del fabricante** de cada equipo. No es un catálogo exhaustivo.

## Principios del motor

1. **Independiente y versionado.** Vive separado del generador; cada regla tiene `id`, `fundamento`, `fuente`, `estado(verificada|pendiente)`, `clasificacion` y `accion`.
2. **No prohíbe en bloque.** Para agentes físicos se evalúa **modalidad + región + equipo/fabricante + restricción documentada**, no "todo prohibido por metal/cáncer".
3. **Honestidad.** Nunca afirma "sin banderas rojas" si el cribado no está documentado → devuelve `sin_alerta_detectada_con_datos_disponibles` + "cribado no documentado".
4. **No infiere.** No deduce remisión por antigüedad, ni sexo, ni lesión estructural.
5. **Prioridad de seguridad.** Ante posible urgencia, **no** propone ejercicio ni pruebas provocativas: permite **documentar y derivar**, y **bloquea** el plan terapéutico.

## Clasificación de salida

| Estado | Significado | Efecto sobre el plan |
|---|---|---|
| `emergencia` | Posible urgencia médica | **Bloquea**; acción = derivación urgente / documentar; sin ejercicio ni pruebas provocativas |
| `derivacion_prioritaria` | Requiere valoración médica antes de progresar | **Bloquea** progresión de carga; permite medidas no provocativas |
| `bloqueo_por_dato_inconsistente` | Dato crítico sin confirmar (lado/región) | **Bloquea** plan lateralizado hasta reconciliar |
| `precaucion_especifica` | Restricción conocida y manejable | **No** bloquea; condiciona modalidad/dosis con justificación |
| `sin_alerta_detectada_con_datos_disponibles` | No se detecta alerta con lo capturado | No bloquea; **indica** si el cribado no consta |

---

## A. Reglas VERIFICADAS (con guía de referencia)

### A1 · Compresión medular / metástasis vertebral (oncológico) — `emergencia` / `derivacion_prioritaria`
- **Disparador:** antecedente/condición oncológica (`seguridadClinica.condiciones`/`banderasRojas`) **+** dolor espinal nuevo, progresivo, nocturno o en reposo, o déficit neurológico.
- **Acción:** evaluación médica urgente para descartar compresión medular; **no** demorar por pruebas de fisioterapia; documentar y derivar. Sobre agentes físicos térmicos/RF/US en la región tumoral: contraindicados salvo aval oncológico documentado.
- **Fuente:** NICE NG234 — *Spinal metastases and metastatic spinal cord compression* (https://www.nice.org.uk/guidance/ng234/chapter/recommendations). **Estado: verificada.**

### A2 · Cauda equina — `emergencia`
- **Disparador:** lumbalgia **+** cualquiera de: anestesia en silla de montar, retención/incontinencia urinaria o fecal, déficit motor bilateral/progresivo de MMII.
- **Acción:** urgencia quirúrgica; derivación inmediata; **no** tratamiento rutinario ni provocación.
- **Fuente:** NICE NG234 / guías de banderas rojas lumbares. **Estado: verificada.**

### A3 · Déficit/compromiso neurológico que requiere derivación — `derivacion_prioritaria`
- **Disparador:** signos de mielopatía (Hoffmann/Babinski/marcha), déficit motor progresivo, pie caído, radiculopatía con denervación (ENMG) referida.
- **Acción:** valoración neurológica/médica; cribado dirigido antes de cargar; no manipular/traccionar cérvix sin descartar mielopatía.
- **Fuente:** NICE NG127 — *Suspected neurological conditions: recognition and referral* (https://www.nice.org.uk/guidance/ng127/chapter/Recommendations-for-adults-aged-over-16). **Estado: verificada.**

### A4 · Trauma cervical pediátrico con carga axial — `emergencia`
- **Disparador:** menor con traumatismo cervical por carga axial, equimosis/dolor cervical, sin constancia de que se descartó lesión cervical.
- **Acción:** valoración médica urgente; **no** provocar movimiento para obtener mediciones; bloquear tratamiento rutinario hasta descartar lesión ósea/inestabilidad.
- **Fuente:** ACR Appropriateness Criteria — *Suspected Spine Trauma–Child* (https://acsearch.acr.org/docs/3101274/Narrative/). **Estado: verificada.**

### A5 · Marcapaso / desfibrilador (DAI) — `precaucion_especifica` (contraindicación de modalidades eléctricas/EM)
- **Disparador:** `seguridadClinica.implantes` = marcapaso/DAI/implante electrónico.
- **Acción:** contraindicadas electroterapia, tecar/diatermia, US y ondas de choque **cerca del dispositivo**; otras modalidades según región. Verificar con cardiología/fabricante.
- **Fuente:** contraindicación estándar de agentes físicos (manuales de electroterapia; fichas de equipo). **Estado: verificada.**

---

## B. Reglas PENDIENTES de validación profesional / por equipo

> Requieren firma del fisioterapeuta de referencia y, en agentes físicos, verificación contra el **fabricante** del equipo de Sinergia. Se activan como **precaución con "verificar"**, no como bloqueo automático.

### B1 · Material de osteosíntesis / prótesis metálica — `precaucion_especifica`
- **Disparador:** `seguridadClinica.implantes` = osteosíntesis/placa/clavo/tornillo/prótesis; o `antecedentes.cirugias` con implante.
- **Acción (fina, no bloqueo total):** evitar **RF/diatermia/tecar térmica/US térmico SOBRE el material**; el **láser de baja potencia NO se contraindica** por metal; validar **región exacta + modalidad + equipo**. Respetar la restricción documentada en el expediente. **Estado: pendiente** (verificar por equipo/fabricante).

### B2 · Osteoporosis — `precaucion_especifica`
- **Disparador:** condición "osteoporosis".
- **Acción:** evitar manipulación forzada/HVLA y alto impacto no autorizado; progresión de carga gradual y supervisada. **Estado: pendiente.**

### B3 · Anticoagulación / antiagregación — `precaucion_especifica`
- **Disparador:** medicamento anticoagulante/antiagregante (p.ej. warfarina, DOAC, aspirina) o condición marcada.
- **Acción:** precaución con punción seca, masaje profundo, ondas de choque y tracciones; vigilar hematomas. **Estado: pendiente.**

### B4 · Artritis reumatoide / enfermedad inflamatoria + inmunosupresor — `precaucion_especifica`
- **Disparador:** AR/esclerodermia/lupus u otra autoinmune + biológico/inmunosupresor (p.ej. golimumab/metotrexato) referidos.
- **Acción:** considerar **actividad inflamatoria** y **riesgo infeccioso** (no atribuir todo a tendinopatía mecánica); precaución con técnicas invasivas; inestabilidad cervical en AR (cautela con manipulación/tracción). **Estado: pendiente.**

### B5 · Diabetes (especialmente insulinodependiente / pie) — `precaucion_especifica`
- **Disparador:** diabetes en `seguridadClinica.condiciones` (no en `patologicos`=familiar).
- **Acción:** precaución con sensibilidad alterada, cicatrización y agentes térmicos en zonas insensibles; cribar neuropatía. **Estado: pendiente.**

### B6 · Cardiovascular (post-infarto / HTA no controlada) — `precaucion_especifica`
- **Disparador:** antecedente cardiovascular o HTA en seguridadClinica/medicamentos.
- **Acción:** dosificar ejercicio con monitoreo; derivar ante síntomas de alarma; evitar maniobras de Valsalva no controladas. **Estado: pendiente.**

### B7 · Embarazo — `precaucion_especifica`
- **Disparador:** condición "embarazo".
- **Acción:** contraindicados varios agentes (RF/diatermia/US sobre abdomen/pelvis, ondas de choque, ciertas corrientes); verificar modalidad/región. **Estado: pendiente.**

### B8 · Sospecha de fractura por estrés / lesión ósea no descartada — `derivacion_prioritaria`
- **Disparador:** deportista de alto volumen con dolor óseo focal (p.ej. tibial) sin imagen; o dolor óseo en menor con antecedente oncológico.
- **Acción:** descartar con imagen antes de cargar; no progresar impacto. **Estado: pendiente.**

### B9 · Fallo de injerto / reintervención — `bloqueo_por_dato_inconsistente` (diagnóstico)
- **Disparador:** cirugía ligamentaria previa **ipsilateral** (p.ej. plastia LCA) + nuevo mecanismo (hiperextensión/giro).
- **Acción:** descartar lesión del injerto u otra lesión relevante antes de progresar; **no afirmar** derrame/fallo sin exploración. **Estado: pendiente.**

### B10 · Conflicto de lado/región no resuelto — `bloqueo_por_dato_inconsistente`
- **Disparador:** discrepancia lado/región entre dx médico, registro y relato.
- **Acción:** **bloquear plan lateralizado** y carga hasta reconciliar; primera acción = aclarar. **Estado: verificada (regla de proceso).**

### B11 · "Sin banderas rojas" sin cribado documentado — regla de honestidad
- **Disparador:** ausencia de cribado de banderas rojas en el expediente.
- **Acción:** devolver `sin_alerta_detectada_con_datos_disponibles` + "cribado no documentado"; **nunca** afirmar "sin banderas rojas". **Estado: verificada (regla de proceso).**

---

## C. Regla transversal de agentes físicos (anti-bloqueo-total)

Para CUALQUIER recomendación de agente físico, el motor evalúa la tupla **(modalidad, región, equipo, restricción_documentada)** y responde:
- `permitido` — sin restricción aplicable documentada.
- `permitido_con_precaucion` — aplica una regla B; se indica el ajuste (p.ej. "tecar atérmica lejos del material").
- `verificar` — hay una condición pero la restricción exacta no está documentada → no prohíbe, pide confirmar.
- `contraindicado` — restricción documentada o regla verificada (p.ej. térmico/RF sobre tumor o sobre material; EM cerca de marcapaso).

Esto implementa la corrección clave de la segunda auditoría: **no prohibir todos los agentes por metal o cáncer**; respetar lo documentado y validar modalidad/región/equipo.

---

## D. Procedencia y mantenimiento

- Cada regla cita su `fuente`; las de agentes físicos deben completarse con las **fichas técnicas de los equipos de Sinergia** (Tecar RET/CET, LaserPulse/Antares, Vilnason V100, Neurodyn, Microduo, US terapéutico).
- El catálogo se **versiona**; cambios registran autor/fecha/fundamento. Reglas **pendientes** no bloquean hasta validarse.
- Fuentes citadas (no exhaustivas): NICE NG234, NICE NG127, ACR Suspected Spine Trauma–Child, y las fichas de fabricante de cada equipo.
