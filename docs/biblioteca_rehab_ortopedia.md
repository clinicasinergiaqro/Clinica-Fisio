# Biblioteca de rehabilitación — Ortopedia, traumatología y deporte — Clínica Sinergia
### Protocolos por fases, criterios de retorno y pruebas diagnósticas (evidencia internacional 2021–2026)

Autor clínico de referencia: Carlos Fernando Aranda González. Este documento **NO sustituye el criterio del fisioterapeuta tratante ni la indicación del cirujano**: es un andamio para ubicar en qué fase va el paciente, qué está permitido y qué no, y **si va en tiempo o desfasado**. Es el equivalente ortopédico de `docs/biblioteca_protocolos.md` (MSK/HSR) y `docs/biblioteca_dermatofuncional.md`.

> **Reglas de oro (transversales a todo el documento):**
> - **Progresar por CRITERIOS, no por calendario.** Los tiempos (semanas/meses) son orientativos para detectar desfases; el paso de fase lo da el cumplimiento de metas objetivas (ROM, fuerza/LSI, control, ausencia de derrame/dolor).
> - **En post-quirúrgico manda el cirujano.** Carga, ROM y plazos se verifican contra el protocolo del cirujano tratante; aquí va el rango convencional vs acelerado cuando existe.
> - **La carga (ejercicio terapéutico) es el motor; los agentes físicos son coadyuvantes.**
> - Monitoreo del dolor transversal (semáforo verde/ámbar/rojo, como en la biblioteca MSK).

> **Nota de método (honestidad sobre las cifras):** la evidencia se reunió con búsqueda web extendida de guías y consensos 2021–2026 (y fuentes fundacionales citadas por nombre). En el entorno de investigación **el acceso directo a los PDF primarios estuvo bloqueado**, así que varios números finos (grados exactos de ROM, semanas, sensibilidad/especificidad) provienen de resúmenes de las fuentes y están marcados **[verificar]**. Antes de fijar un número como estándar de la clínica, confírmalo contra la fuente primaria citada. Las cifras de pruebas especiales originales suelen venir infladas por el autor de la prueba; se dan rangos y se prioriza el metaanálisis independiente (p. ej. Hegedus 2012 en hombro, Sokal 2022 en rodilla).

### Índice de secciones
- **PARTE 0** — Perfil de diagnósticos de la clínica (auditoría 2026-11-02)
- **PARTE 0b** — Seguridad clínica transversal (agentes físicos / implantes)
- **🦵 RODILLA** — ligamentos (LCA) y menisco · prótesis (TKA/UKA)
- **🕺 CADERA** — prótesis (THA) · labrum acetabular / pinzamiento (FAI)
- **💪 HOMBRO** — SLAP · manguito rotador · inestabilidad / Bankart
- **🦶 TOBILLO Y PIE** — esguince lateral · sindesmal · Broström · Aquiles
- **🧩 CARTÍLAGO** — lesiones osteocondrales (rodilla y astrágalo)
- **🏃 DEPORTE** — isquiotibiales · aductores/ingle · pantorrilla · cuádriceps · LCM · MTSS

---

## PARTE 0 — Perfil de diagnósticos de la clínica (auditoría 2026-11-02)

Para que la biblioteca apunte a lo que de verdad se trata, se auditó la base completa: **3,443 expedientes (385 activos + 3,058 históricos/migrados)** leyendo el texto de `dx` + `motivo.dxMedico`/`zonaPrincipal`/`padecimiento` + `dxFuncional.dxClinico` (conteo multi-etiqueta por palabras clave; es un **piso**, no exacto). Carga por categoría en toda la base:

| # | Categoría (señal clínica) | Expedientes |
|---|---|---|
| 1 | **Columna lumbar / lumbalgia / hernia-ciática** | ~439 |
| 2 | **Mano / muñeca / túnel carpiano / dedos** | ~227 |
| 3 | **Cadera (bursitis/tendinitis/glúteo medio/trocantérico/psoas)** | ~226 |
| 4 | **Fractura (cualquier región)** | ~196 |
| 5 | **Cervical / cuello** | ~151 |
| 6 | **Dorsal / torácica / escoliosis** | ~136 |
| 7 | **Menisco** | ~124 |
| 8 | **Femoropatelar / rotuliano** | ~104 |
| 9 | **Hombro – manguito rotador** | ~101 |
| 10 | **Cartílago / osteocondral / OCD** | ~76 |
| 11 | Post-quirúrgico (genérico, sin región fina) | ~71 |
| 12 | Pantorrilla / gastrocnemio / sóleo | ~67 |
| 13 | Fascitis plantar / pie | ~65 |
| 14 | Tendón de Aquiles | ~63 |
| 15 | Tobillo – esguince lateral | ~62 |
| 16 | Aductor / pubalgia / ingle | ~56 |
| 17 | Cuádriceps / recto femoral | ~53 |
| 18 | Isquiotibiales | ~45 |
| 19 | **LCA / cruzado anterior** | ~41 |
| 20 | Gonartrosis / artrosis de rodilla | ~37 |
| 21 | Epicondilitis / codo | ~31 |
| 22 | **Hombro – SLAP / labrum** | ~31 |
| 23 | **Labrum / FAI de cadera** | ~28 |
| 24 | Neurológico | ~23 |
| 25 | Ligamentos de rodilla (LCM/LCL/LCP) | ~19 |
| 26 | Hombro – inestabilidad / Bankart / luxación | ~15 |
| 27 | Coxartrosis / artrosis de cadera | ~12 |
| 28 | Hombro – capsulitis / congelado | ~10 |
| 29 | Tobillo – sindesmal | ~10 |
| — | **Prótesis / artroplastia de rodilla (codificada como tal)** | ~3 |
| — | **Prótesis / artroplastia de cadera (codificada como tal)** | ~1 |

**Lecturas clave (para decidir qué protocolizar):**
- **Lo más voluminoso es COLUMNA** (lumbar + cervical + dorsal ≈ 726) **y MANO/MUÑECA (~227)** — regiones que esta biblioteca de ortopedia/deporte **aún no cubre**. Candidatas naturales a una *biblioteca de columna* y una de *mano/muñeca* más adelante.
- **Rodilla** es el gran bloque articular (menisco + femoropatelar + cartílago + LCA + gonartrosis + ligamentos ≈ **401**) → el núcleo LCA/menisco/cartílago/prótesis de esta biblioteca está bien dirigido.
- **Cadera** como región es grande (~226 de partes blandas + 28 labrum/FAI + 12 coxartrosis) → justifica el apartado de cadera (labrum/FAI + prótesis).
- **Hombro** ≈ 172 (manguito domina) y **tobillo/pie** ≈ 200 (fascitis + Aquiles + esguince) → ambos bien representados.
- **Reality-check de lo que pidió Carlos:** *osteocondral/cartílago* **sí es un bloque real (~76)**; *labrum/FAI de cadera* **también (~28)**. En cambio *prótesis de rodilla/cadera* salen **casi en cero por diagnóstico codificado** — pero eso es **sub-captura, no realidad**: los pacientes protésicos suelen quedar codificados por región ("gonartrosis", "fractura/post-quirúrgico", "rodilla/cadera") o en texto libre que no matchea "prótesis". La clínica sí los ve; la biblioteca los cubre igual.
- **Hallazgo transversal importante:** **~45% de los expedientes NO tienen un diagnóstico estructurado limpio** (el texto más repetido es *"no cuenta con diagnóstico médico referido"*, 309 veces; ~1,400 con texto que no resuelve a categoría + ~350 vacíos). Esto confirma el pendiente ya documentado del **formulario de alta (mecanismo/dx que no se capturan)** y es justo lo que la pestaña **📋 Protocolo** (semáforo "qué falta") está para empujar. *La valoración de diagnósticos, por tanto, también es una valoración de la CALIDAD de captura: hay que mejorar que se registre el dx/mecanismo.*

> Fuente del conteo: `claudeGetPacientes` (385 activos) + `claudeGetHistoricos` (3,058) leídos 2026-11-02. Es un conteo **agregado y anónimo** (sin nombres). El detalle por paciente es PHI y no va al repo; si se quiere, se puede generar por la conexión y entregar por canal privado.

---

## PARTE 0b — Seguridad clínica transversal (agentes físicos / implantes)

Vale para TODO post-quirúrgico con material y para cualquier paciente con los flags de `seguridadClinica`. **Ligar siempre con `_soapSeguridadHTML`/`seguridadClinica` de la app** (alerta de metal ya existe, PR #419):
- **Metal / osteosíntesis / prótesis / tornillos / anclas / placas:** **NO** radiofrecuencia, diatermia, **tecarterapia térmica**, ni **ultrasonido térmico** sobre el material. Usar agentes **atérmicos** y **lejos** del implante. (La electroestimulación de superficie — TENS/NMES para activar músculo, p. ej. cuádriceps post-prótesis — es distinta de la diatermia térmica y sí se usa, no directamente sobre el metal con modalidad térmica.)
- **TVP / TEP:** vigilancia ALTA en inmovilización y post-op de miembro inferior (cadera, rodilla, Aquiles). Pantorrilla dolorosa + edema + calor → descartar TVP (urgencia).
- **Anticoagulación** (frecuente post-op), **embarazo**, **cáncer/oncológico**, **marcapaso/DAI** → precauciones estándar de agentes físicos (ver tamiz de contraindicaciones y la caja de seguridad del expediente).
- **Infección periprotésica / articular:** fiebre + calor/eritema/drenaje → urgencia, suspender y derivar.

---

## 🦵 RODILLA — ligamentos (LCA) y menisco

> **Nota de uso:** material de referencia para que el fisio ubique fase, restricciones y si el paciente va en tiempo. NO es prescripción automática: el cirujano manda sobre carga/ROM (sobre todo en reparación meniscal y lesiones concomitantes). La evidencia en rehabilitación de rodilla es desigual: fuerte para criterios de retorno al deporte en LCA (Grindem 2016), débil/consenso para menisco (EU-US 2024, mayoría GRADE C-D). Los tiempos son orientativos; **la progresión es por CRITERIOS, no por calendario** (van Melick 2016).

---

### Reconstrucción de LCA (quirúrgico)

#### Diagnóstico — pruebas especiales
Mejor usarlas en combinación; ningún test aislado confirma/descarta. Cifras de metaanálisis 2022 (Sokal et al., KSSTA) salvo donde se indique:
- **Lachman:** rodilla ~20-30° flexión, traslación tibial anterior con tope blando = positivo · **Sens ~79% / Esp ~91%** (Sokal 2022; el metaanálisis concluye que la sensibilidad del Lachman **se había sobreestimado** históricamente —antes se citaba 85-87%). Es el más sensible de los tres.
- **Cajón anterior:** rodilla 90° flexión, tracción tibial anterior · **Sens ~78% / Esp ~91%** (Sokal 2022). Menos útil en agudo (guarding/dolor).
- **Pivot shift:** valgo + rotación interna en extensión→flexión buscando subluxación-reducción · **Sens ~55% / Esp ~96-97%** (Sokal 2022; rango de sens 55-65% entre revisiones). **Muy específico, poco sensible despierto**; mucho más sensible bajo anestesia. Un pivot shift positivo en consulta es casi confirmatorio de inestabilidad rotatoria.

#### Rehabilitación por fases
Marco: van Melick 2016 (BJSM, guía KNGF multidisciplinar, 90 estudios) = **prehabilitación + 3 fases postop por criterios** (basada en deficiencias → entrenamiento específico del deporte → retorno al juego); timeline global **9-12 meses**. Complementada con MOON (Wright et al.) y progresión criterio-basada de Wilk & Arrigo (JOSPT 2012).

**Fase 1 — Protección y control (sem ~0-2 · criterio de entrada: postop inmediato):**
- Metas: extensión COMPLETA 0° (igualar la sana, incluida hiperextensión fisiológica) — prioridad #1 para prevenir cyclops/artrofibrosis; flexión ≥90° al final de sem 1-2; control de derrame; SLR sin retraso del cuádriceps (extension lag).
- Restricciones: **carga = WBAT (según tolerancia) con muletas desde el día 0** en LCA aislado (estándar; la carga precoz da resultados comparables a 3 sem sin carga — evidencia limitada, PMC11106972). **Si hay reparación meniscal concomitante → carga restringida varias semanas (ver sección Menisco).** Rodillera: muchos cirujanos ya NO la usan en LCA aislado; si se usa, bloqueada en extensión para marcha/sueño las primeras 1-2 sem (práctica variable, no consensuada).
- SÍ: extensión pasiva (prono con peso en tobillo, heel props), movilización rotuliana, SLR, isométricos de cuádriceps/electroestimulación, flexión activa-asistida, bomba de tobillo, crioterapia/compresión.
- NO: hiperflexión forzada; **OKC de cuádriceps en arco terminal (0-45°)** (tensión del injerto); descuidar la extensión (ganar extensión tarde es el principal factor de cyclops).
- Criterios para AVANZAR: extensión 0° simétrica, flexión ≥90-100°, SLR sin lag, derrame ≤1+, marcha sin muletas con buen control.

**Fase 2 — ROM completo y fuerza (sem ~2-12):**
- Metas: ROM completo e indoloro a las 4-6 sem; marcha normal sin muletas (típico 2-4 sem al resolver el lag); recuperar cuádriceps progresivamente (IMC/QI >60% hacia sem 4-6, **>80% hacia sem 8** — Wilk/JOSPT, Delaware).
- Restricciones: introducir OKC de cuádriceps con cautela; evitar impacto/pivote.
- SÍ: CKC (sentadilla parcial, prensa, step-ups), bici y elíptica, propiocepción/equilibrio, fortalecimiento de cadena posterior y cadera, **OKC de cuádriceps desde ~6 sem** (MOON) empezando en arco protegido 90-45° y progresando; natación/aqua-jogging. La evidencia actual (van Melick 2016) respalda combinar CKC **y** OKC —los protocolos antiguos eran más restrictivos con OKC.
- NO: correr, saltar, pivotes, deporte; carga en hiperflexión profunda bajo resistencia si injerto de isquios (ver abajo).
- Criterios para AVANZAR a carrera: **cuádriceps LSI ≥70-80%** (umbral variable entre fuentes: 70% mínimo citado, muchos exigen 80% —mejor sostenido), **derrame trazo o ausente**, extensión completa, flexión ≥95% del lado sano, hop monopodal indoloro. Suele caer a los **~3-4 meses** (criterio, no calendario).

**Fase 3 — Carrera, pliometría y específico del deporte (mes ~3-6+):**
- Metas: carrera progresiva → pliometría → agilidad → gestos del deporte; cuádriceps LSI subiendo hacia ≥90%.
- Restricciones: progresar pliometría SOLO tras pasar compuerta de fuerza (habitualmente **LSI ≥80%**); bilateral→unilateral, baja→alta intensidad.
- SÍ: programa de carrera, pliometría (inicio ~4 meses, p.ej. Sportsmetrics a 4-6 meses — Texas Children's; algunos empiezan plio ligera 8-16 sem), cambios de dirección controlados, reintroducción del gesto deportivo.
- NO: retorno a competición/contacto antes de cumplir criterios y el mínimo de tiempo (ver retorno).
- Criterios para AVANZAR: superar la batería de retorno al deporte (abajo).

#### Criterios de RETORNO AL DEPORTE (objetivos)
- **Tiempo mínimo ≥9 meses** desde cirugía (Grindem 2016): retornar <9 meses se asoció a riesgo de re-lesión **hasta ~7×** mayor (Beischer 2020, reportado). Injertos BPTB/cuádriceps/aloinjerto a menudo empujan a **9-12 meses**.
- **Fuerza de cuádriceps LSI ≥90%** (isocinético 60°/s; también isquios ≥90%). Cada **+1% de simetría de cuádriceps = −3% de re-lesión** (Grindem 2016).
- **Batería de hop tests ≥90% LSI** en cada uno: salto único, triple, cruzado, 6-m cronometrado (SMU 2025). Precaución: el LSI **sobreestima** la recuperación (el lado "sano" también se debilita) — comparar contra pre-lesión cuando sea posible (Wellsandt/JOSPT 2017: solo 16/40 que pasaban 90% LSI lo pasaban vs. su basal).
- **Listo psicológico: ACL-RSI ≥80%** (algunas revisiones usan ~68-71 como mínimo; cifra variable). Es de los predictores más potentes de retorno exitoso.
- **Derrame trazo-a-cero**, ROM completo, técnica de aterrizaje sin valgo dinámico.
- **Regla de decisión Grindem 2016:** retorno ≥9 meses **+** cuádriceps LSI ≥90% al retornar → **reducción del 84%** de re-lesión (cada mes de retraso hasta los 9 meses = −51% de riesgo).

#### Timeline típico (hitos para saber si va en tiempo o desfasado)
- Sem 1-2: extensión 0°, flexión ~90°, SLR sin lag, marcha con muletas WBAT.
- Sem 4-6: ROM completo, sin muletas, cuádriceps >60-80%.
- Sem 8: cuádriceps ~80%, derrame mínimo; OKC de cuádriceps ya en curso (desde sem 6).
- Mes 3-4 (sem 12-16): inicia **carrera** (si cuádriceps LSI ≥70-80% + sin derrame).
- Mes 4-6: **pliometría/salto** tras compuerta de fuerza; agilidad.
- Mes 6-9: específico del deporte, testing tardío.
- **≥9 meses:** retorno al deporte si pasa la batería completa.
- **Desfasado / bandera amarilla:** sin extensión completa a las 4-6 sem; cuádriceps <80% a los 3 meses; derrame recurrente con actividad; no corre a los 4-5 meses.

**Diferencias por injerto (relevantes para la progresión):**
- **HTH / BPTB (hueso-tendón rotuliano-hueso):** dolor de rodilla anterior y déficit de cuádriceps más marcados; **más lento en alcanzar hitos y criterios de retorno** (ACL-SPORTS, JOSPT 2020). Cuidar la rodilla al arrodillarse; énfasis extra en cuádriceps. Incorporación biológica más rápida y menor tasa de re-rotura que isquios (narrativa, discutido).
- **Isquiotibiales (HT):** recuperación de cuádriceps más rápida, pero **déficit de fuerza de isquios/flexión profunda más persistente**; cautela con carga de flexión profunda/resistida las primeras semanas; vigilar simetría de isquios a 60/90°.
- **Tendón de cuádriceps (QT):** cada vez más usado, **menor morbilidad del sitio donante que BPTB**, pero **déficit de cuádriceps similar a BPTB** → priorizar cuádriceps y no acelerar. Resultados globales (fallo, laxitud, PRO, retorno) similares a HT/BPTB en metaanálisis de ECA 2025.
- **Aloinjerto:** incorporación biológica más lenta → timeline de retorno más conservador; **mayor tasa de fallo en jóvenes/activos** → preferir 9-12 meses.
- Dato normativo: la fuerza de cuádriceps no difiere mucho por injerto a los 6-9 meses; sexo y estado meniscal influyen más que el injerto (Schwery et al., IJSPT). Varones con BPTB alcanzan 80% de simetría antes que mujeres (5.7 vs 7.1 meses).

#### Contraindicaciones / banderas rojas
- **Pérdida de extensión que no recupera** → sospecha de **lesión de cyclops / artrofibrosis** (confirmar por RM; suele requerir cirugía, no se "rehabilita"). Déficit de extensión precoz es el factor de riesgo principal.
- Derrame caliente + fiebre → **infección articular** (urgencia).
- Dolor en pantorrilla, edema unilateral → **TVP**.
- Clunk mecánico / bloqueo → cyclops o lesión meniscal asociada.
- Inestabilidad franca (giving way) con ganancia brusca de laxitud → sospecha de **re-rotura del injerto**.
- Dolor femoropatelar progresivo con OKC agresivo (sobre todo BPTB/QT) → ajustar dosis/arco.

#### Fuentes
- van Melick N, et al. *Br J Sports Med* 2016;50:1506-15 — guía práctica de rehabilitación de LCA (base multidisciplinar/criterio) [[PDF](https://andreasphysioblog.com/wp-content/uploads/2022/05/Van-melick-2016-Evidence-based-clinical-practice-up.pdf)]
- Grindem H, et al. (Delaware-Oslo). *Br J Sports Med* 2016;50:804-8 — reglas de decisión (−84% re-lesión) [[ref](https://orthopedicindex.com/library/grindem-2016-simple-decision-rules-can-reduce-reinjury-risk-by-84-after-acl-reconstruction)]
- MOON ACL Rehabilitation Guidelines (Wright et al.) — fases, OKC a las 6 sem [[ref](https://www.jospt.org/doi/10.2519/jospt.2012.3871)]
- Wilk KE, Arrigo C. *J Orthop Sports Phys Ther* 2012 — progresión criterio-basada
- ACL-SPORTS secondary analysis. *JOSPT* 2020 — BPTB más lento en hitos/retorno [[ref](https://www.jospt.org/doi/10.2519/jospt.2020.9111)]
- Schwery N, et al. *IJSPT* — valores normativos de fuerza de cuádriceps por sexo/injerto a 3-6-9 meses [[ref](https://ijspt.scholasticahq.com/article/32378)]
- Leung et al. *Annals of Joint* — consideraciones postop por tipo de injerto [[ref](https://aoj.amegroups.org/article/view/8067/html)]
- Sokal et al. *KSSTA* 2022 — metaanálisis de tests de LCA (Lachman sobreestimado) [[ref](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9464183/)]
- Wellsandt E, et al. *JOSPT* 2017 — el LSI sobreestima la función [[ref](https://www.jospt.org/doi/10.2519/jospt.2017.7285)]

---

### Menisco — reparación vs meniscectomía parcial (quirúrgico; distinguir siempre cuál)

> **Clave:** las dos rutas son OPUESTAS. **Meniscectomía parcial = progresión rápida** (se quitó tejido, no hay que proteger cicatrización). **Reparación = restricciones estrictas de flexión y carga** (hay que proteger la sutura). Confundirlas es el error típico. Marco: **Consenso EU-US 2024 (ESSKA-AOSSM-AASPT)**, Partes I y II — la mejor guía actual, aunque la mayoría de recomendaciones son **GRADE C-D** (evidencia débil); el consenso mismo dice que **no existe protocolo estandarizado validado** y recomienda enfoque por **hitos + tiempo**.

#### Diagnóstico — pruebas especiales
Para menisco ningún test aislado es fiable; combinar historia + interlínea + provocación. Cifras de metaanálisis agrupado salvo donde se indique:
- **Dolor en interlínea articular (joint line tenderness):** palpación de la interlínea medial/lateral · **Sens ~63% / Esp ~77%** (metaanálisis). A menudo el más sensible, pero **poco específico** (en atención primaria la Esp cae a ~0.26-0.39, NIHR HTA 2015). Útil como cribado.
- **McMurray:** flexión máxima + rotación tibial con extensión buscando clic/dolor · **Sens ~70% / Esp ~71%** agrupado (algunas series Esp hasta 89%). El clic palpable (no solo dolor) sube la especificidad.
- **Thessaly (20° flexión, en apoyo monopodal con rotación del cuerpo):** **MUY variable según la fuente** — original Karachalios 2005: **Sens ~90% / Esp ~91%** (exactitud 94% medial/96% lateral); pero estudios pragmáticos en atención primaria (NIHR HTA 2015): **Sens ~66% / Esp ~39%** (mucho peor). Metaanálisis 2015 (JOSPT): exactitud similar o levemente superior a McMurray/interlínea. **INCIERTO:** no es el test casi perfecto que sugería el estudio original.
- **Apley (compresión/distracción en prono a 90°):** compresión dolorosa (menisco) vs distracción dolorosa (ligamento) · **Sens ~60% / Esp ~70%** (metaanálisis). **El más específico pero el menos sensible** del grupo; un Apley de compresión positivo apoya menisco, pero un negativo no descarta.

#### Rehabilitación por fases

##### (b) MENISCECTOMÍA PARCIAL — progresión rápida
**Fase 1 — Recuperación temprana (sem ~0-2):**
- Metas: control de derrame/dolor, ROM completo pronto, activación de cuádriceps, marcha normal.
- Restricciones: **carga completa inmediata según tolerancia** y **ROM completo según síntomas** (EU-US 2024, GRADE C). Muletas solo hasta marcha sin cojera (días).
- SÍ: ROM libre, isométricos/SLR, bici, CKC progresiva según molestia, control de derrame.
- NO: forzar a través de derrame/dolor marcado; impacto hasta control de síntomas.
- Criterios para AVANZAR: ROM completo, derrame mínimo, marcha normal, buen control de cuádriceps.

**Fase 2 — Fuerza y retorno funcional (sem ~2-8):**
- Metas: fuerza simétrica, reintroducir impacto/carrera, gesto deportivo.
- SÍ: fortalecimiento progresivo, carrera (~2-4 sem según síntomas y fuerza), pliometría y agilidad según tolerancia.
- Criterios de retorno: síntomas controlados + fuerza y función simétricas (ver retorno).

##### (a) REPARACIÓN MENISCAL — restricciones estrictas (según tipo de rotura)
**Fase 1 — Protección de la sutura (sem ~0-4/6 · criterio de entrada: postop):**
- Metas: proteger la reparación, extensión completa, control de derrame, activación de cuádriceps SIN cargar la sutura.
- Restricciones **(varían por tipo de rotura — EU-US 2024):**
  - **Rotura vertical estable:** puede permitirse **carga completa**; ROM a menudo limitado ~6 sem (variable; algunos protocolos la dejan libre).
  - **Roturas horizontal / radial / compleja / raíz (root):** **carga restringida** (sin carga o toe-touch) **+ ROM limitado 4-6 sem**, típicamente **0-90° las primeras 4-6 sem**. Si se dañan las fibras circunferenciales (hoop) → **sin carga 6 sem** (revisión 2022). Las **roturas de raíz** y las combinadas con LCA llevan los protocolos **más restrictivos** (revisión sistemática 2025).
  - Rodillera: bloqueada 0° para marcha/sueño y liberada por rangos permitidos para ejercicio (práctica común; el consenso no fija ángulos exactos).
- SÍ: isométricos de cuádriceps, SLR (con extensión completa lograda), movilización rotuliana, ROM en el arco permitido, carga en el % permitido.
- NO: **flexión profunda bajo carga, sentadilla/cuclillas profundas, pivotes, rotación con carga** (tensan la reparación); **evitar sentadilla profunda ≥4 meses**; flexión >90° con carga en fase temprana.
- Criterios para AVANZAR: cicatrización en tiempo protegido cumplido, extensión completa, flexión progresando sin dolor, derrame controlado.

**Fase 2 — ROM completo y fuerza progresiva (sem ~6-12):**
- Metas: ROM completo (~120° hacia sem 12, progresando a completo), carga completa, fuerza.
- Restricciones: aún **evitar flexión profunda cargada / cuclillas profundas hasta ~4 meses**; progresar flexión y carga gradualmente.
- SÍ: CKC en arco seguro, bici, fortalecimiento, propiocepción, retirar restricciones de ROM al cumplir plazos.
- Criterios para AVANZAR: ROM completo, fuerza simétrica en progreso, sin dolor en interlínea con carga.

**Fase 3 — Retorno a carrera y deporte (mes ~3-9):**
- SÍ: carrera cuando fuerza/control lo permitan y sin síntomas; pliometría y gesto deportivo progresivos.
- Criterios de retorno: ver abajo.

#### Criterios de RETORNO AL DEPORTE (objetivos) — EU-US 2024, **criterio + tiempo**
- Retorno **por criterios Y por tiempo** (EU-US 2024, GRADE D) — individualizado por procedimiento, lesiones concomitantes y demandas del deporte.
- **Meniscectomía parcial: retorno al deporte ~4-12 semanas** (carrera ~2-4 sem).
- **Reparación meniscal: retorno al deporte ~6-9 meses** (fase de retorno a actividad 6-9 meses en la tabla del consenso).
- Criterios funcionales: fuerza y hops **simétricos (habitualmente ≥90% LSI, extrapolado de LCA — el consenso NO fija un umbral numérico propio)**, PRO + medidas de rendimiento combinadas, sin derrame ni dolor en interlínea con la actividad, y **motivación/preparación psicológica** evaluada.
- **INCIERTO:** el consenso reconoce que estos criterios no son específicos para roturas traumáticas y que faltan umbrales numéricos validados.

#### Timeline típico (hitos para saber si va en tiempo o desfasado)
- **Meniscectomía parcial:** carga completa día 0 · ROM completo 1-2 sem · carrera 2-4 sem · deporte 4-12 sem (recuperación global 3-4 meses).
- **Reparación:** arco protegido 0-90° y carga limitada 4-6 sem (según rotura) · ROM completo ~sem 12 · **sin cuclillas profundas <4 meses** · deporte **6-9 meses** (recuperación global 6-9 meses).
- **Desfasado / bandera:** en reparación, si se progresa a flexión profunda cargada o pivote antes de tiempo = riesgo de fallo de la sutura; en meniscectomía, derrame persistente sugiere condral asociado.

#### Contraindicaciones / banderas rojas
- **Bloqueo articular verdadero / imposibilidad de extensión** → asa de balde desplazada (puede requerir cirugía urgente).
- En reparación: **dolor agudo en interlínea + derrame al avanzar flexión/carga** → sospecha de fallo de la reparación; retroceder y avisar al cirujano.
- Derrame caliente + fiebre → infección.
- Dolor en pantorrilla / edema unilateral → TVP.
- Progresar flexión profunda o rotación con carga en reparación **contra el protocolo del cirujano** = contraindicado (clase "se rompe la sutura").
- Deep squat / hiperflexión cargada antes de 4 meses en reparación.

#### Fuentes
- EU-US Meniscus Rehabilitation 2024 Consensus (ESSKA-AOSSM-AASPT), **Parte I** (meniscectomía/reparación/reconstrucción) [[PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12310086/)] y **Parte II** (prevención/no-operatorio/retorno al deporte), *JOSPT Open / IJSPT / KSSTA* 2024-2025 [[ref](https://www.jospt.org/doi/10.2519/josptopen.2025.13539)]
- Revisión sistemática 2025 — protocolos restringidos de ROM/carga en reparación de raíz meniscal lateral + LCA [[PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12616272/)]
- Revisión de reparación meniscal aislada 2022 — ROM 0-90° 4 sem, sin carga 6 sem si fibras hoop [[Springer](https://link.springer.com/article/10.1186/s40634-022-00521-8)]
- McCarty/CU Anschutz — ACL + Meniscus Repair Protocol 2024 (ejemplo de protocolo combinado) [[PDF](https://medschool.cuanschutz.edu/docs/librariesprovider65/eric-mccarty/rehab-protocols/acl-and-meniscus-repair-protocol-2024.pdf)]
- Metaanálisis de exactitud de tests meniscales (McMurray 70/71, Apley 60/70, interlínea 63/77)
- Karachalios T, et al. *JBJS* 2005 — Thessaly original (sens/esp ~90%)
- NIHR HTA 2015 (Blyth/Hing et al.) — Thessaly pragmático en primaria (sens 66/esp 39) [[ref](https://www.ncbi.nlm.nih.gov/books/NBK310289/)]
- Thessaly vs artroscopia, *JOSPT* 2015 [[ref](https://www.jospt.org/doi/10.2519/jospt.2015.5215)]

---

### Notas transversales de incertidumbre (marcar al afinar)
1. **Tiempos = orientativos, criterios = mandan.** Los rangos de semanas varían ampliamente entre instituciones; progresar por metas objetivas (van Melick 2016).
2. **LCA — OKC de cuádriceps:** los protocolos antiguos lo prohibían; la evidencia actual lo respalda como seguro y beneficioso desde ~6 sem en arco protegido. Área de desacuerdo residual.
3. **LCA — umbral de carrera:** 70% vs 80% de cuádriceps LSI según fuente; 80% sostenido es más defendible.
4. **LSI sobreestima** la recuperación (el lado sano también se debilita tras LCA) — comparar con basal pre-lesión cuando haya datos.
5. **Menisco:** evidencia mayormente GRADE C-D; el cirujano define carga/ROM por el TIPO y PATRÓN de rotura. No aplicar un protocolo genérico de reparación sin saber el tipo.
6. **Thessaly:** amplio rango de sens/esp entre el estudio original y los pragmáticos — no tratarlo como test definitivo.
7. No encontré una guía de práctica clínica JOSPT 2023-2024 formal y completa solo de fases de LCA; la referencia de fases más sólida sigue siendo van Melick 2016 + MOON + Grindem 2016 para retorno.
8. **Limitación técnica de esta investigación:** WebFetch no resolvió varios hosts (bpb-us-w2.wpmucdn.com, salinaortho.com, pmc.ncbi.nlm.nih.gov quedaron fuera del dominio de red permitido de la sesión); las cifras provienen de la síntesis de búsqueda extendida de fuentes primarias. Si Carlos quiere, se pueden habilitar esos dominios y extraer las tablas semana-a-semana textuales de los PDFs de Delaware/MOON/consenso EU-US para la versión definitiva de la biblioteca.

---

## 🦵 RODILLA — prótesis / artroplastia (TKA · nota de UKA)

#### Documento de referencia para la biblioteca clínica · fisioterapia

> **Para qué sirve este documento:** material de referencia para que el fisio **ubique la fase del paciente, las restricciones, y si va EN TIEMPO** (o si hay desfase/bandera). **NO es prescripción automática.** El plan de cada paciente lo **manda el cirujano** (tipo de prótesis, fijación, estabilidad, restricciones de carga y arco, tiempos). Ante duda o bandera roja → consultar al cirujano antes de progresar. Progresión **por CRITERIOS cumplidos, no por calendario**; las semanas son solo un mapa para detectar desfase.

---

### 1. Principios que ordenan toda la rehabilitación post-TKA

1. **La EXTENSIÓN completa (0°) temprana es prioridad #1.** Un déficit de extensión que se deja instalar se vuelve **contractura en flexión** (flexo), que arruina la marcha, sobrecarga el cuádriceps y es difícil de revertir. Recuperar flexión importa, pero **nunca a costa de perder extensión**.
2. **El déficit de CUÁDRICEPS es EL gran problema post-TKA.** No es solo atrofia: hay **inhibición muscular artrogénica (AMI)** — el cerebro no "enciende" bien el cuádriceps por dolor/derrame/inflamación. El músculo está, pero no se activa. Por eso el trabajo de **activación** (no solo de fuerza bruta) es central desde el día 1.
3. **La CARGA (ejercicio terapéutico) es el motor; los agentes físicos son COADYUVANTES.** Frío, electro analgésica, etc., ayudan a crear la ventana para moverse y cargar, pero no sustituyen el ejercicio.
4. **Carga TOTAL inmediata (WBAT) es lo normal en TKA primaria cementada.** "Weight-bearing as tolerated" (carga según tolerancia) con andadera/bastón desde el día de la cirugía, salvo que el cirujano diga otra cosa. Ojo: en prótesis **no cementada (press-fit)**, injertos óseos, osteotomías asociadas o fracturas periprotésicas, la carga puede estar **restringida** → ese dato lo da el cirujano, no se asume.
5. **Dolor y edema se vigilan de forma transversal** (como el semáforo del dolor): controlarlos abre la ventana para el ROM y la activación del cuádriceps.
6. **Rehabilitación supervisada y temprana.** La guía APTA recomienda iniciar fisioterapia **dentro de las 24 h** de la cirugía y manejo supervisado; prefiere el entorno ambulatorio cuando es seguro `[verificar: redacción exacta de la recomendación APTA]`.

---

### 2. Datos que SIEMPRE manda el cirujano (confirmar antes de progresar)

- **Tipo de artroplastia:** total (TKA) vs unicompartimental (UKA) vs revisión.
- **Fijación:** cementada (WBAT habitual) vs no cementada/press-fit (puede restringir carga).
- **Estabilidad / diseño:** CR (retención de cruzado posterior), PS (estabilizada posterior), constreñida, bisagra → algunas limitan arcos o rotación.
- **Restricciones específicas:** tope de flexión, de extensión, carga parcial, uso de inmovilizador, precauciones por reparación de mecanismo extensor.
- **Profilaxis de TVP/TEP y anticoagulación** vigentes (ver §13 y §14).
- **Comorbilidades / seguridad clínica:** metal/osteosíntesis adicional, marcapaso/DAI, anticoagulación, diabetes, cáncer, etc. → se captura en `seguridadClinica` para que la alerta salte (§14).

---

### 3. Fases por CRITERIOS (con semanas solo como referencia)

> Las semanas son aproximadas y orientativas. **Se avanza cuando se cumplen los CRITERIOS de salida, no cuando llega la fecha.** Metas de ROM: ver tabla de hitos (§4).

#### FASE 1 — Aguda / hospitalaria y primeros días (≈ día 0 a 1–2 semanas)
**Metas:**
- Marcha segura con andadera, carga según tolerancia (WBAT) en TKA cementada.
- **Encender el cuádriceps:** contracción isométrica (quad set) y **elevación de pierna recta (SLR) SIN retraso de extensión (extension lag)**.
- **Extensión pasiva a 0°** lo antes posible (talón en alto / toalla bajo el tobillo, NO bajo la rodilla).
- Flexión activa-asistida progresiva (meta temprana ~**90°** hacia 2 semanas).
- Control de dolor y edema; cuidado de herida.
- Transferencias, sentado↔de pie, escalón con ayuda.

**Qué SÍ:** quad sets, SLR, bombeo de tobillo (circulación/TVP), extensión pasiva en prono o con toalla, flexión activa/activa-asistida (deslizar talón, sentado al borde), crioterapia + elevación, movilización de rótula (§9), marcha con andadera.
**Qué NO:** poner almohada **bajo la rodilla** (induce flexo), forzar flexión a dolor alto, cargar más allá de lo indicado en prótesis no cementada, ignorar un extension lag.
**Restricciones:** respetar topes del cirujano; herida protegida; vigilar signos de TVP/infección.
**Criterios de avance:** SLR activa sin lag o con lag mínimo, extensión activa cercana a 0°, flexión ≈ 90° `[verificar: umbral exacto]`, marcha independiente con andadera, dolor/edema controlados.

#### FASE 2 — ROM temprano, control de edema y activación del cuádriceps (≈ 2 a 6 semanas)
**Metas:**
- **Extensión activa 0° completa y mantenida** (sin lag). *Esta es la meta crítica de la fase.*
- Flexión progresando: hitos típicos ~**90–100° a las 2–3 sem**, **~105–110° hacia 4–6 sem**, rumbo a **110–120° a 6 sem** `[verificar: cifras varían por fuente]`.
- Edema a la baja; dolor manejable para permitir ejercicio.
- Transición **andadera → bastón** cuando la marcha es estable y segura.
- Cuádriceps activándose cada vez mejor (reducir AMI).

**Qué SÍ:** progresión de ROM (flexión y extensión), fortalecimiento de cuádriceps/glúteos en cadena cerrada tolerable (mini-sentadillas, puente, step-ups bajos), **NMES de cuádriceps** si hay activación pobre (§7), movilización de rótula, re-educación de marcha, propiocepción básica, crioterapia/compresión para edema.
**Qué NO:** descuidar la extensión por perseguir flexión; agentes físicos **térmicos** sobre el material (§14); progresiones de impacto; marcha sin control del valgo/varo.
**Criterios de avance:** extensión 0° estable, flexión ≥ ~100–110° `[verificar]`, cuádriceps activo con SLR sin lag y control en apoyo monopodal breve, marcha con bastón sin claudicar, edema controlado.

> **BANDERA DE RIGIDEZ (crítica):** si hacia **~6 semanas** no logra **~90–100° de flexión** (o persiste flexo), o no alcanza 0–90° → **riesgo de ARTROFIBROSIS**. Consultar al cirujano: puede requerir **manipulación bajo anestesia (MUA)** (ver §5). No esperar a que "se destrabe solo".

#### FASE 3 — Fuerza, marcha y escaleras (≈ 6 a 12 semanas)
**Metas:**
- ROM funcional: extensión 0°, flexión hacia **115–120°+** `[verificar]`.
- Fuerza de cuádriceps/cadera en progresión (reducir la brecha vs pierna sana).
- **Marcha sin dispositivo** cuando sea segura (sin claudicación, buen control).
- **Escaleras** alternando pasos (subir y bajar) — recordar que subir escalera requiere ~**85–90°** de flexión y buen cuádriceps.
- Resistencia (caminar distancias crecientes, bici estática).

**Qué SÍ:** fortalecimiento progresivo (sentadillas más profundas tolerables, prensa/extensión en arcos seguros, step-ups más altos, trabajo de cadera), equilibrio/propiocepción avanzada, bici estática (resistencia creciente), caminata, retiro gradual del bastón.
**Qué NO:** impacto/pivote, correr, deportes de contacto; progresar si persiste un déficit grosero de extensión o un cuádriceps que no sostiene la rodilla.
**Criterios de avance:** marcha independiente sin dispositivo y sin dolor, escaleras alternando, déficit de fuerza de cuádriceps en descenso, pruebas funcionales mejorando (TUG, 6MWT — §12).

#### FASE 4 — Funcional y retorno a actividad (≈ 3 meses en adelante; recuperación plena 6–12 meses)
**Metas:**
- ROM y fuerza cercanos a meseta (extensión plena; flexión según objetivo del paciente).
- Independencia total en AVD, trabajo, y **actividad de bajo impacto**.
- Retorno guiado a deporte recomendado (§11).

**Qué SÍ:** fortalecimiento avanzado, acondicionamiento, reentrenamiento del gesto/actividad del paciente, bajo impacto (bici, natación, caminata, golf).
**Qué NO (a largo plazo):** alto impacto/pivote repetitivo que acelera el desgaste del polietileno (§11).
**Criterios de "alta"/meseta:** objetivos funcionales del paciente logrados, mínima diferencia lado a lado en fuerza y pruebas funcionales, dolor estable y bajo. La mayoría retoma AVD hacia los **3 meses**; recuperación plena **6–12 meses** `[verificar]`.

---

### 4. Hitos para detectar DESFASE (mapa de tiempos, no reglas rígidas)

> Las cifras varían mucho entre fuentes (estudios medidos vs protocolos de clínica). Usar como **detector de desfase**, no como meta forzada. Marcadas `[verificar]` las que vienen de resúmenes.

| Momento | Flexión típica esperada | Extensión | Otros hitos |
|---|---|---|---|
| Día 0–3 | ~60–80° `[verificar]` | buscando 0° | WBAT con andadera; quad set; SLR |
| 2 semanas | ~90° `[verificar]` | **0° (meta)** | andadera firme |
| 2–3 sem | ~90–100° `[verificar]` | 0° mantenida | andadera → bastón |
| 4–6 sem | ~105–110° `[verificar]` | 0° | bastón; sube escalón |
| 6 sem | ~110–120° `[verificar]` | 0° | **CHECKPOINT: si <90°, consultar cirujano** |
| 12 sem | ~115–120°+ `[verificar]` | 0° | sin dispositivo; escaleras alternando |
| 3–6 meses | meseta funcional | 0° | retorno a bajo impacto |

**Datos medidos de cohorte** (referencia de evolución real, no meta): flexión mediana ~**80° en semana 1 → ~110° en semana 8**; extensión de ~**−10.7° → −3.2°** en el mismo periodo; mayor ganancia en las **primeras 4 semanas**; la flexión tiende a mesetar hacia ~3 meses y la extensión hacia ~6 meses `[verificar: Chen/colaboradores, cohorte primeras 8 sem]`.

**Umbrales funcionales útiles para interpretar el ROM:** caminar cómodo ≈ **65°**, subir escaleras ≈ **85°**, sentarse/pararse ≈ **95°** de flexión `[verificar: Physiopedia]`.

**Transiciones típicas (referencia, las ajusta el cirujano):**
- **Andadera → bastón:** cuando la marcha es estable (frecuentemente ~2–4 sem).
- **Bastón → sin dispositivo:** marcha sin claudicar (frecuentemente ~4–8 sem).
- **Conducir:** la evidencia (Kirschbaum 2021, TKA derecha) muestra que el **tiempo de reacción de frenado vuelve al basal hacia las ~4 semanas**, pero la **confianza subjetiva** recién a las **~6 semanas** `[verificar]`. Estudios previos también apuntaban a ~4 semanas para TKA derecha. **Regla práctica:** no conducir con opioides, y requerir buen control, fuerza y frenado de emergencia; para rodilla izquierda con transmisión automática suele ser antes. Siempre confirmar con cirujano.
- **Retorno a trabajo:** depende del tipo de trabajo (sedentario antes; físico más tarde).

---

### 5. Bandera de rigidez → ARTROFIBROSIS y manipulación bajo anestesia (MUA)

- **Definición operativa de rigidez:** flexión **< 90°** persistente, o flexo (déficit de extensión) **> 10°**, más allá de ~12 semanas `[verificar: definiciones varían]`. Un ROM < 90° que persiste **> 12 semanas** se considera rigidez adquirida.
- **Ventana típica de MUA:** cuando no se alcanza **> 90° de flexión** hacia las **6–12 semanas** `[verificar]`. La mayoría de cirujanos la hacen en esa ventana.
- **Timing (evidencia):** series retrospectivas (**Issa et al. 2014, JBJS**, 144 manipulaciones) sugieren que la **MUA temprana (< 12 sem)** logra mayor ganancia de flexión y mayor arco final que la tardía (ganancia ~**36.5° vs 17°**; arco final ~**119° vs 95°**) `[verificar: cifras de resumen]`. Por eso se recomienda **umbral bajo para manipular temprano** si el paciente se está trabando. (Nota: otra lectura señala que los pacientes "tempranos" partían de peor flexión, así que el beneficio neto no está 100% zanjado; y una cohorte Mayo asoció MUA con más riesgo de revisión → decisión del cirujano.)
- **Rol del fisio:** detectar el desfase a tiempo, documentar el ROM objetivo y **escalar al cirujano** si no progresa; post-MUA, rehabilitación intensiva inmediata de ROM para no perder lo ganado.

---

### 6. ¿Por qué la EXTENSIÓN completa temprana es tan crítica?

- La **contractura en flexión (flexo)** altera la biomecánica: marcha con rodilla flexionada → **demanda constante del cuádriceps**, fatiga, dolor anterior, y marcha ineficiente.
- Historia natural (referencia): la incidencia de flexo recién desarrollado baja de ~**14% a las 6 sem** a ~**0.3% al año** en la mayoría `[verificar: Int Orthop 2013, umbral de 5°]`; un flexo **< 15° a los 3 meses** suele poder resolver a extensión plena hacia los 2 años, pero **> 15° a los 3 meses tiende a PERSISTIR** `[verificar]`. Los pacientes con **extensión plena caminan y suben escaleras mejor** que los que quedan con flexo.
- **Implicación clínica:** la extensión se "gana" en las **primeras semanas**; perseguir flexión descuidando la extensión es el error clásico. Técnicas: extensión pasiva en prono (pierna colgando), toalla bajo el tobillo (no bajo la rodilla), estiramiento mantenido, y **evitar dormir/descansar con la rodilla flexionada** sobre almohada. Algunos protocolos usan inmovilización corta en extensión (~2–3 días) para prevenir recurrencia temprana `[verificar]`.

---

### 7. Cuádriceps y electroestimulación (NMES): la evidencia

**El problema (fundacional):**
- **Mizner, Stevens, Snyder-Mackler (2003, Phys Ther):** el déficit de **activación voluntaria** del cuádriceps post-TKA es ~**26%**, ~**4× el del grupo comparación (~6%)** `[verificar]`; concluyeron que **la rehabilitación centrada solo en ejercicio voluntario difícilmente vence esta falla de activación** → justifica NMES.
- **Mizner et al. (2005, JBJS):** en la pérdida temprana de fuerza, la **falla de activación voluntaria pesa casi el doble que la atrofia**; fenómeno descrito como **inhibición muscular artrogénica (AMI)** por dolor/derrame.
- El dolor durante la contracción explica una parte pequeña pero significativa del déficit de activación `[verificar: r²≈0.22]`.

**La intervención — NMES (electroestimulación neuromuscular de superficie, sobre el vientre del cuádriceps):**
- **Stevens-Lapsley et al. (2012, Phys Ther):** NMES iniciada **~48 h post-op** mejoró fuerza y activación del cuádriceps a las ~3.5 sem; a las 52 sem las diferencias se atenuaron pero seguían significativas en fuerza y desempeño funcional; efecto mayor en el **primer mes** y con **intensidades más altas** `[verificar]`.
- **Petterson et al. (2009, Arthritis Care Res):** fortalecimiento progresivo **con o sin NMES** dio resultados similares a 3 y 12 meses (lectura null-leaning); pero lo clave de ese trabajo es que **el fortalecimiento progresivo supervisado funciona** (hubo gran mejoría funcional en ambos brazos).
- **Metaanálisis recientes:** en general, la NMES **mejora la fuerza del cuádriceps a corto–mediano plazo** (algunos reportan beneficio hasta 12–13 meses con "alta calidad") `[verificar]`; el beneficio más sólido es el de **corto plazo (primer mes)** y a **mayor intensidad tolerada**.
- **Síntesis práctica:** NMES es un **coadyuvante útil, sobre todo temprano y cuando la activación es pobre**, siempre **combinada con ejercicio voluntario progresivo** (no lo reemplaza).

> **Importante (seguridad, ver §14):** la **NMES de superficie** sobre el vientre muscular para activar el cuádriceps **es distinta** de la diatermia/tecar/US **térmicos**. La NMES de superficie **se usa y tiene evidencia** en TKA; **no se aplica directamente sobre el material protésico** ni se usan modalidades **térmicas profundas** sobre el metal/cemento.

---

### 8. ¿CPM (movilización pasiva continua) sí o no?

**Respuesta corta: NO de rutina.** La evidencia reciente **no la apoya** como estándar.
- **Cochrane (Harvey et al., 2014):** evidencia de calidad moderada de **ningún efecto clínicamente importante sobre la función** a mediano plazo; evidencia de muy baja calidad de que podría reducir el riesgo de MUA (del ~7% al ~2% en los ensayos) — dato débil y no consistente `[verificar]`.
- **Yang et al. (2019, Arch Phys Med Rehabil)** y **revisión sistemática 2024 (J Orthop Surg Res):** CPM **no mejora** de forma relevante la flexión/extensión activa ni pasiva vs fisioterapia estándar `[verificar]`.
- **Guía APTA (2020/revisión 2026):** ubica la CPM entre las opciones de **beneficio incierto** → **sugiere limitar su uso rutinario** (junto con Kinesio taping, drenaje linfático manual y vendajes compresivos) `[verificar: redacción exacta]`.
- **Conclusión:** priorizar **ROM activo/activo-asistido + ejercicio supervisado**. La CPM queda, a lo sumo, para casos puntuales a criterio del cirujano, no como estándar.

---

### 9. Movilización de rótula

- Práctica **común en protocolos** desde la fase temprana: **deslizamientos patelares superior/inferior y medial/lateral**, suaves, para preservar la **movilidad rotuliana** y el juego patelofemoral.
- Fundamento clínico: una rótula que pierde movilidad (sobre todo el deslizamiento **superior**) limita la flexión y la mecánica extensora; el tejido periarticular puede fibrosar. Mantener la movilidad rotuliana acompaña la ganancia de ROM.
- Se complementa con **movilización tibiofemoral** si el ROM se estanca `[verificar: respaldo de protocolos de clínica, no de ensayo controlado específico]`.

---

### 10. Manejo de dolor y edema

- **Crioterapia:** evidencia **mixta pero favorable a corto plazo**. Revisiones muestran **beneficio modesto y de baja certeza en dolor a ~48 h** (diferencia ~**1.6/10** en EVA `[verificar]`) y reducción de edema peripatelar a los **2–6 días** (no a 6 sem/3 meses) `[verificar]`; la guía APTA la ubica como **opción beneficiosa de bajo riesgo**. **Crioterapia + compresión dinámica** podría dar mayor reducción de edema y mejor flexión pasiva que el frío solo `[verificar]`. Útil como coadyuvante; no sustituye el ejercicio.
- **Elevación + bombeo de tobillo + movilización temprana:** base del control de edema (y profilaxis de TVP).
- **Posicionamiento temprano de la extremidad** (p. ej. talón elevado para extensión): la guía APTA lo marca como beneficioso de bajo riesgo `[verificar]`.
- **Beneficio incierto / limitar rutina (APTA):** Kinesio taping, **drenaje linfático manual**, vendajes compresivos, CPM `[verificar]`.
- **Electroanalgesia (TENS):** coadyuvante de dolor; de nuevo, distinta de modalidades térmicas (§14).
- **Analgesia farmacológica:** la maneja el equipo médico; el fisio **cronometra la sesión** aprovechando la ventana analgésica y vigila que no se enmascare una bandera roja.

---

### 11. Deportes y actividad: recomendados vs desaconsejados

**Marco:** la evidencia es sobre todo de **consenso de expertos** (no ensayos). No hay señal clara de que retomar actividad de bajo impacto aumente complicaciones; **el factor pronóstico más fuerte es la experiencia previa del paciente con ese deporte**.

**Recomendados (BAJO impacto):**
- **Caminar, bicicleta (estática y de ruta), natación/aquafitness, golf.** Bici y natación tienen las mejores tasas de retorno. Golf es de los más respaldados.
- **European Knee Associates (EKA, 2021):** alto consenso para permitir progresivamente — ~**5 deportes en las primeras 6 sem** (caminar, subir escaleras, natación, aquafitness, bici estática), **~7 a las 6–12 sem** (se agrega bici en plano, yoga), **~14 a los 3–6 meses**, y **~21 de 47 actividades a los 6 meses** (golf, tenis en dobles, senderismo, pesas) `[verificar: cifras]`.
- Senderismo, tenis en **dobles** y esquí de descenso: "recomendados **con experiencia previa**".

**Desaconsejados / restringidos (ALTO impacto, pivote, contacto):**
- **Correr/trotar, baloncesto, fútbol, tenis en singles, deportes de pivote y de contacto.** Aceleran el desgaste del polietileno y el riesgo de aflojamiento.
- Los corredores/trotadores son los que **más difícil** retoman su nivel previo.

> **Tiempos de referencia:** retorno a deporte de bajo impacto frecuentemente hacia los **~3–6 meses** según el deporte y la recuperación `[verificar]`.

---

### 12. Valoración y pruebas (qué medir)

**ROM (goniometría):**
- Medir **flexión Y extensión activas y pasivas** cada visita. Documentar la extensión como déficit (p. ej. "−5°") para no "redondear" un flexo a 0°.
- **Retraso de extensión (extension lag):** diferencia entre extensión **pasiva** (la logra el examinador) y **activa** (la logra el paciente con SLR). Un lag marca **déficit de activación/fuerza del cuádriceps**, no rigidez articular → el trabajo es de **activación**, no de estiramiento.

**Fuerza de cuádriceps:**
- Comparar **lado a lado** (índice de simetría). Dinamómetro si hay; si no, grados de MMT y calidad del quad set/SLR. Vigilar la **brecha** como guía de progresión.

**Pruebas funcionales:**
- **TUG (Timed Up and Go):** levantarse, caminar 3 m, volver y sentarse. Referencia de mejoría: de ~**18 s → ~10 s** en el postoperatorio temprano `[verificar]`.
- **6MWT (caminata de 6 minutos):** distancia; buen predictor de deambulación funcional. Referencia: de ~**231 m → ~361 m** `[verificar]`.
- **Prueba de escaleras (stair climb test):** tiempo para subir/bajar un tramo.

**Escalas / resultados reportados por el paciente (PROMs):**
- **KOOS** (y su versión corta) — síntomas, dolor, AVD, deporte, calidad de vida.
- **Oxford Knee Score (OKS):** 12 ítems, **0–48** `[verificar]` (mayor = mejor).
- (Otras en uso: WOMAC, Knee Society Score/KSS.)

**Edema:** perímetro peripatelar comparativo; útil para seguir el control de inflamación.

---

### 13. Banderas rojas y contraindicaciones (escalar al cirujano/urgencias)

- **TVP (trombosis venosa profunda):** dolor/hinchazón de pantorrilla, calor, enrojecimiento unilateral. **No aplicar masaje/drenaje linfático** si hay sospecha de TVP. → Médico de inmediato.
- **TEP (tromboembolia pulmonar):** disnea súbita, dolor torácico, taquicardia → **urgencia**.
- **Infección periprotésica (PJI):** dolor creciente, calor/eritema que **persiste o empeora más allá de ~3–4 sem**, **drenaje turbio/purulento**, dehiscencia, fiebre (p. ej. > 38 °C / 101.5 °F) `[verificar: umbrales]`. → Cirujano urgente; no "trabajar a través" de una posible infección.
- **Dehiscencia de la herida / drenaje persistente.** → Cirujano.
- **Déficit del mecanismo extensor** (no logra extensión activa, extension lag grosero nuevo, "se le va" la rodilla): posible lesión del aparato extensor. → Cirujano.
- **Inestabilidad** (giving way, bostezo): evaluar; → Cirujano.
- **Fractura periprotésica:** dolor súbito intenso, deformidad, incapacidad de cargar tras caída/trauma. → Urgencia.
- **Dolor desproporcionado, quemante, con cambios de color/temperatura/sudoración y alodinia → sospecha de SDRC (síndrome doloroso regional complejo).** → Evaluación médica.
- **Rigidez/artrofibrosis:** ver §5 (bandera de ROM a las ~6 sem).

---

### 14. Seguridad de AGENTES FÍSICOS con IMPLANTE METÁLICO (ligar a `seguridadClinica`)

> El paciente con TKA/UKA **tiene prótesis metálica + cemento (PMMA) + polietileno**. Esto condiciona qué agentes se pueden usar. **Se liga con la alerta de seguridad clínica de la app** (`_soapSeguridadHTML`/`seguridadClinica`): capturar "material de osteosíntesis / prótesis de rodilla" para que la caja de **CUIDADO** salte sola.

**NO usar sobre el material (modalidades TÉRMICAS profundas):**
- **Radiofrecuencia / diatermia / tecarterapia TÉRMICA / ultrasonido TÉRMICO (continuo)** sobre o alrededor del implante. El metal y, sobre todo, el **cemento y el polietileno** concentran/retienen calor → **riesgo de quemadura y de daño a la interfase**. La diatermia de onda corta lista el **metal como contraindicación**; el US térmico está **contraindicado/cautelado sobre prótesis cementadas o de plástico** aunque el metal refleje parte de la energía `[verificar]`.
- Precaución adicional absoluta con **marcapaso/DAI** (cualquier diatermia = contraindicación).

**SÍ se puede (con criterio):**
- **NMES de SUPERFICIE del cuádriceps** para activación muscular: **se usa y tiene evidencia** (§7). Es una corriente de **estimulación neuromuscular**, **no** una modalidad térmica. Se aplica sobre el **vientre del cuádriceps**, **no directamente sobre el implante**, y **no calienta** el metal.
- **TENS** analgésica (mismo principio: no térmica, electrodos fuera del implante).
- **Crioterapia** (§10) — sin problema con el metal.
- **US/diatermia:** si por algún motivo se considerara US, usar solo **pulsado/atérmico y lejos del material**, nunca térmico sobre el implante (y en general, evitarlo sobre la prótesis).

**Otros candados de seguridad en este paciente:**
- **Vigilar TVP** de forma transversal (§13); **anticoagulación post-op frecuente** → cuidado con maniobras agresivas, hematomas, y con cualquier técnica que aumente sangrado; coordinar con el estado de anticoagulación.
- **Embarazo, cáncer activo** → precauciones generales de agentes físicos (como en el resto de la biblioteca).

**Regla de bolsillo:** sobre una prótesis de rodilla → **nada que CALIENTE en profundidad el material**; **sí** electroestimulación de superficie (NMES/TENS) fuera del implante, y frío.

---

### 15. UKA (artroplastia unicompartimental) — nota breve

- **Recuperación más rápida que TKA:** menor agresión quirúrgica, estancia más corta (~1–2 días), **retorno más temprano** a AVD, trabajo y actividad.
- **Datos de referencia:** retorno al trabajo en 3 meses ~**73% (UKA) vs ~48% (TKA)**; tiempo a retorno deportivo ~**12 sem (UKA) vs ~13 sem (TKA)**; tasas de retorno a deporte altas y algo mayores que TKA (sin diferencia estadística clara) `[verificar]`.
- **Principios de rehabilitación: los MISMOS que TKA pero comprimidos/acelerados** — extensión plena temprana, activación del cuádriceps, ROM, fuerza, marcha, progresión por criterios. **El cirujano igual manda** tiempos y restricciones.
- **Matiz importante:** la **UKA tiene MAYOR tasa de revisión** que la TKA a largo plazo. Y **OJO**: algunas fuentes de "retorno sin restricciones a deportes vigorosos (trote, esquí, tenis singles)" son **específicas de UKA, NO extrapolables a TKA**. Para TKA mantener la recomendación de bajo impacto (§11).

---

### Fuentes

**Guía de referencia (columna vertebral):**
- Jette DU, et al. **Physical Therapist Management of Total Knee Arthroplasty** (Clinical Practice Guideline, APTA/Academy of Orthopaedic PT). *Phys Ther.* **2020**;100(9):1603–1631. → https://academic.oup.com/ptj/article/100/9/1603/5857258
- **Revisión 2026** de la misma CPG. *Phys Ther.* **2026**;106(7):pzag058. → https://academic.oup.com/ptj/article/106/7/pzag058/8742282 · Resumen: https://www.guidelinecentral.com/insights/jul-2026-apta-managementtka-guideline-spotlight/

**Déficit/activación de cuádriceps (fundacionales):**
- Mizner RL, Stevens JE, Snyder-Mackler L. **Voluntary Activation and Decreased Force Production of the Quadriceps Femoris Muscle After TKA.** *Phys Ther.* 2003;83(4):359–365. → https://academic.oup.com/ptj/article-abstract/83/4/359/2857537
- Mizner RL, Petterson SC, Stevens JE, Vandenborne K, Snyder-Mackler L. **Early Quadriceps Strength Loss After TKA: Contributions of Muscle Atrophy and Failure of Voluntary Muscle Activation.** *J Bone Joint Surg Am.* 2005. → https://www.researchgate.net/publication/7871266
- Petterson SC, et al. **Improved function from progressive strengthening interventions after TKA: RCT comparing rehabilitation programs.** *Arthritis Care Res (Arthritis Rheum).* 2009. → (pmid 19177542)

**NMES:**
- Stevens-Lapsley JE, Balter JE, Wolfe P, Eckhoff DG, Kohrt WM. **Early NMES to Improve Quadriceps Muscle Strength After TKA: RCT.** *Phys Ther.* 2012;92(2):210–226. → https://academic.oup.com/ptj/article-abstract/92/2/210/2703178
- Metaanálisis de RCT de NMES post-TKA. → https://pmc.ncbi.nlm.nih.gov/articles/PMC8677678/ y https://pmc.ncbi.nlm.nih.gov/articles/PMC12047048/

**CPM:**
- Harvey LA, Brosseau L, Herbert RD. **Continuous passive motion following TKA.** *Cochrane Database Syst Rev.* 2014. → https://www.cochrane.org/evidence/CD004260
- Yang X, et al. **CPM After TKA: SR & Meta-analysis.** *Arch Phys Med Rehabil.* 2019. → https://pubmed.ncbi.nlm.nih.gov/30831093/
- SR & meta-analysis 2024. *J Orthop Surg Res.* → https://link.springer.com/article/10.1186/s13018-024-04536-y

**Rigidez / MUA / artrofibrosis:**
- Issa K, et al. **Effect of timing of MUA to improve ROM and functional outcomes after TKA.** *J Bone Joint Surg Am.* 2014. → https://pubmed.ncbi.nlm.nih.gov/25143495
- **Management of Stiffness following TKA.** *SICOT-J.* 2021. → https://www.sicot-j.org/articles/sicotj/pdf/2021/01/sicotj200146.pdf
- Early MUA & mayor ganancia de flexión. → https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9957883/

**Contractura en flexión / extensión:**
- **The natural history of a newly developed flexion contracture following primary TKA.** *Int Orthop.* 2013. → https://pmc.ncbi.nlm.nih.gov/articles/PMC3779550/
- **Management of fixed flexion contracture in primary TKA: recent systematic review.** *SICOT-J.* 2024. → https://www.sicot-j.org/articles/sicotj/full_html/2024/01/sicotj240002/sicotj240002.html

**ROM / recuperación medida:**
- **Recovery of knee ROM after TKA in the first postoperative weeks.** *Musculoskelet Surg.* 2019. → https://link.springer.com/article/10.1007/s12306-019-00588-0
- Physiopedia — **Total Knee Arthroplasty** (hitos de fase). → https://www.physio-pedia.com/Total_Knee_Arthroplasty
- Protocolos de referencia: OHSU (2023), Brigham & Women's, Mass General, Alberta Hip & Knee. → https://www.ohsu.edu/sites/default/files/2023-11/OHSU-Rehab-Protocols-Total-Knee-Nov2023.pdf · https://www.brighamandwomens.org/assets/bwh/patients-and-families/rehabilitation-services/pdfs/knee-tkr-protocol-bwh.pdf

**Crioterapia / edema:**
- SR de RCT (crioterapia y edema, 2023). → https://pmc.ncbi.nlm.nih.gov/articles/PMC10415999/
- Reassessment of SRs (2025). → https://pmc.ncbi.nlm.nih.gov/articles/PMC12138932/
- RCT crioterapia compresiva vs estándar (2024). → https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10900683/

**Conducir:**
- Kirschbaum S, et al. **Reaction time and brake pedal force after TKA: timeframe for return to driving.** *Knee Surg Sports Traumatol Arthrosc.* 2021. → https://esskajournals.onlinelibrary.wiley.com/doi/full/10.1007/s00167-020-06105-2

**Retorno a deporte / UKA vs TKA:**
- **European Knee Associates (EKA): 21 sports activities recommended 6 months after TKA.** *KSSTA.* 2021. → https://pubmed.ncbi.nlm.nih.gov/33404817
- **Return to sport post-knee arthroplasty: umbrella review for consensus guidelines.** *Bone Joint Open.* 2022. → https://pmc.ncbi.nlm.nih.gov/articles/PMC8965786/
- **High rate of return to low-impact activity/sport after TKA and UKA: SR & meta-analysis** (2026). → https://pmc.ncbi.nlm.nih.gov/articles/PMC13502459/
- **Outcomes TKA vs UKA in an ERAS protocol.** → https://pmc.ncbi.nlm.nih.gov/articles/PMC11490907/

**Pruebas / escalas:**
- Fiabilidad del 6MWT y predicción de deambulación tras TKA. → https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3644243/
- PROMs y pruebas funcionales tras TKR. → https://pmc.ncbi.nlm.nih.gov/articles/PMC13252258/

**Seguridad de agentes físicos / metal:**
- **Electrophysical Agents — Contraindications and Precautions: An Evidence-Based Approach.** *Physiother Can.* 2010. → https://pmc.ncbi.nlm.nih.gov/articles/PMC3031347/
- Physiopedia — **Electrotherapy Contraindications.** → https://www.physio-pedia.com/Electrotherapy_Contraindications
- Short Wave Diathermy (overview). → https://www.sciencedirect.com/topics/medicine-and-dentistry/short-wave-diathermy

---

### Incertidumbres [verificar]

1. **Método de esta revisión:** todo proviene de **resúmenes de WebSearch extended**, no de la lectura de los PDFs/artículos completos. **No se abrieron los textos originales.** Por eso, antes de fijar cifras finas en protocolo clínico, verificar en fuente primaria.
2. **Cifras de ROM por semana:** varían mucho entre fuentes (estudios medidos vs protocolos de clínica vs páginas divulgativas). Las de la tabla (§4) son **orientativas**, no metas rígidas; confirmar con el protocolo del cirujano.
3. **Redacción exacta de las recomendaciones APTA 2020/2026** (cuáles son "recomendadas", "beneficiosas de bajo riesgo" o "beneficio incierto/limitar"): tomada de resúmenes; **verificar el texto y el grado de evidencia** en la guía original (incluye ~20 recomendaciones: prehabilitación, inicio < 24 h, supervisión, crioterapia, posicionamiento temprano, NMES, y "no bracing rutinario" para TKA primaria no complicada).
4. **MUA (Issa 2014):** las ganancias "36.5° vs 17°" y arco final "119° vs 95°", y el umbral/ventana "6–12 sem / <90°", vienen de resúmenes; **verificar**. La evidencia de timing es mayormente retrospectiva y no está del todo zanjada (una cohorte asoció MUA con más revisión).
5. **NMES:** la magnitud y durabilidad del beneficio (si supera al ejercicio progresivo solo) **no está totalmente zanjada**; el consenso más firme es el beneficio de **corto plazo** y a **mayor intensidad**.
6. **Crioterapia:** evidencia mixta; cifras de EVA (~1.6/10) y ventana de edema (2–6 días) por resumen; **verificar**.
7. **Conducir (Kirschbaum 2021):** "4 sem reacción / 6 sem confianza" para TKA derecha; aplicar siempre con criterio clínico y marco legal local; confirmar con cirujano.
8. **Retorno a deporte:** cifras del EKA (5/7/14/21 actividades por ventana) y UKA (73% vs 48% RTW; 12 vs 13 sem) por resumen; **verificar**. Recordar que varias recomendaciones de deporte vigoroso "sin restricción" son **de UKA, no de TKA**.
9. **Movilización de rótula y topes de carga en no cementadas:** respaldo de **protocolos de clínica**, no de ensayo controlado específico; individualizar con el cirujano.
10. **Oxford Knee Score 0–48** y umbrales de fiebre/temperatura para infección: por resumen; **verificar** rangos y puntos de corte.
11. **Seguridad US sobre metal:** hay matiz en la literatura (el metal refleja, pero cemento/polietileno sí se calientan) → para una **prótesis de rodilla cementada**, lo prudente y lo que marca la regla de la clínica es **evitar modalidades térmicas profundas sobre el material**; verificar con la política interna y el implante específico.

> **Nota de uso clínico:** este documento ubica fase, restricciones y desfase. **No reemplaza la indicación del cirujano** ni la valoración individual. Ante bandera roja (§13) o rigidez a las ~6 sem (§5), **escalar antes de progresar**.

---

## 🕺 CADERA — prótesis / artroplastia total (THA)

> **Qué es esto:** un andamio para que el fisio ubique en qué FASE va el paciente, qué RESTRICCIONES aplican según el ABORDAJE y la FIJACIÓN, y si va "en tiempo". **No es una prescripción automática: el plan lo manda el cirujano.** La progresión es por CRITERIOS cumplidos, no por semanas del calendario; las semanas que aparecen son promedios orientativos para detectar desfase, no metas rígidas.
> **Regla de oro de esta clínica para esta función:** PTC = implante metálico. Antes de cualquier agente físico, leer la Sección 10 (seguridad con metal) y cruzarla con `seguridadClinica`.

### 0. Lo primero: datos que hay que sacar de la nota quirúrgica (o preguntar)

Sin estos datos NO se puede fijar la fase ni las precauciones. Capturarlos en el expediente (motivo/antecedentes/seguridadClinica):

- **Abordaje quirúrgico** (posterior/posterolateral · anterior directo (DAA) · lateral directo o anterolateral). Define las precauciones de luxación (Sección 2). Es el dato más importante.
- **Tipo de fijación** (cementada · no cementada/press-fit · híbrida). Define la carga permitida (Sección 3).
- **Reparación capsular / tipo de cabeza** (cabeza grande, cotilo de doble movilidad). Reduce riesgo de luxación y suele permitir precauciones más laxas.
- **Restricciones explícitas del cirujano** (carga, rango, tiempo de precauciones). Mandan sobre este documento.
- **Longitud de miembros** post-op (si hubo alargamiento intencional/no intencional).
- **Profilaxis de TVP indicada** (aspirina, HBPM, anticoagulante oral) y hasta cuándo. Relevante para agentes físicos y para vigilancia (Secciones 8 y 10).
- **Diagnóstico de base y comorbilidades** (fractura vs coxartrosis; fusión lumbar previa; obesidad; cirugía de revisión) — suben el riesgo de luxación/complicación.

### 1. Precauciones por ABORDAJE quirúrgico (lo más importante)

La dirección de la luxación depende de por dónde entró el cirujano: se luxa hacia el lado donde se soltó la cápsula/músculos. Por eso las precauciones son ESPEJO entre abordajes.

#### 1.1 Abordaje POSTERIOR / posterolateral (el más frecuente a nivel mundial)

Entra por detrás; la inestabilidad clásica es POSTERIOR. Precauciones clásicas ("las de toda la vida"), típicamente por ~6 semanas mientras cicatriza la cápsula:

- **NO flexión de cadera > 90°** (no sentarse en sillas bajas/inodoro bajo, no agacharse a amarrarse los zapatos, no acercar la rodilla al pecho).
- **NO aducción cruzando la línea media** (no cruzar las piernas sentado ni acostado; almohada de abducción entre las piernas al dormir).
- **NO rotación INTERNA de la cadera** (no girar el pie hacia adentro; no girar el cuerpo hacia el lado operado con el pie fijo).
- La combinación de riesgo máximo es **flexión + aducción + rotación interna** (la posición de "ponerse de pie desde una silla baja girando").
- **SÍ permitido:** extensión, rotación externa, abducción, marcha, sentarse en silla alta con reposabrazos, dormir boca arriba.

#### 1.2 Abordaje ANTERIOR DIRECTO (DAA)

Entra por delante entre planos musculares; la inestabilidad es ANTERIOR. Precauciones ESPEJO de las posteriores y, en general, MÁS LIBERTAD temprana (muchos centros no ponen precauciones formales):

- **Evitar la combinación EXTENSIÓN + ROTACIÓN EXTERNA** (la posición de "dar un paso largo hacia atrás y girar el pie hacia afuera"; cuidado al bajar de la cama o al pivotar).
- Protocolos restrictivos limitan **extensión de cadera más allá de ~20°** y **rotación externa más allá de ~50°** las primeras ~6 semanas [verificar: cifras de protocolos institucionales, p. ej. OSU CPG 2022 y Salina Regional 2024; no son un estándar único].
- Otros protocolos (p. ej. Lahey) permiten **extensión y rotación externa ACTIVAS** desde temprano y solo limitan las PASIVAS/forzadas; y varios centros no imponen ninguna precaución formal.
- **SÍ permitido (ventaja del DAA):** flexión > 90°, sentarse normal, cruzar piernas, agacharse — justo lo contrario del posterior. Esto hace el DAA cómodo para actividades de la vida diaria desde el día 1.
- Precaución general: evitar zancadas largas hacia extensión y camas/sofás muy bajos los primeros días.

#### 1.3 Abordaje LATERAL DIRECTO (Hardinge) / ANTEROLATERAL (Watson-Jones)

Separa parte del glúteo medio (lateral) o pasa entre glúteo medio y tensor (anterolateral). Precauciones del lado anterior (como DAA): **evitar extensión + rotación externa combinadas**; algunos protocolos aplican los mismos topes de ~20° extensión / ~50° rotación externa [verificar]. Tasa de luxación baja, PERO mayor riesgo de **debilidad del glúteo medio / marcha de Trendelenburg** por la manipulación del abductor (vigilar y fortalecer; Sección 9).

#### 1.4 Tendencia actual: precauciones MÍNIMAS o SIN precauciones en abordaje posterior (controversia)

Punto clave y en evolución. En los últimos años, varios centros han **relajado o eliminado** las precauciones clásicas tras abordaje posterior en pacientes de riesgo estándar, con respaldo de evidencia reciente:

- **Korfitsen et al., Acta Orthopaedica, 2023** — metaanálisis de 8,835 pacientes (coxartrosis primaria, abordaje posterior): las precauciones de cadera **no influyen en la recuperación temprana**; la recomendación clásica se basaba en evidencia de muy baja certeza.
- **Revisión sistemática (7 estudios, 6,900 pacientes)** — las precauciones **no modificaron las tasas de luxación** tras abordaje posterior [verificar año exacto de publicación].
- **ECA prospectivo, 2022** — pacientes con estabilidad intraoperatoria documentada (**90° flexión / 45° rotación interna / 0°**) NO requieren precauciones; eliminarlas no aumentó la luxación.
- **Estudio retrospectivo del Hospital for Special Surgery (HSS)** — en posterior sin factores de riesgo de inestabilidad, las precauciones estándar serían innecesarias.
- **ECA 2025 (posterior con reparación capsular)** — sin diferencia en luxación con/sin precauciones estrictas, y **menor satisfacción (HOOS JR)** en el grupo con precauciones [verificar: por ahora resumen/abstract de congreso].

**Cómo usar esto en la clínica:** la tendencia es real, pero la decisión de relajar precauciones es del CIRUJANO (depende de reparación capsular, tamaño de cabeza/doble movilidad, estabilidad intraoperatoria y factores del paciente). El fisio **sigue las órdenes del cirujano**; si no hay orden explícita, asume las precauciones clásicas del abordaje. Precaución transversal incluso en protocolos "mínimos": evitar **cruzar las piernas sentado** y las posiciones combinadas extremas las primeras semanas.

### 2. Carga según TIPO DE FIJACIÓN

La carga permitida depende de cómo se ancló el implante al hueso, porque el riesgo es el **micromovimiento del vástago** antes de la osteointegración.

- **Cementada → carga TOTAL inmediata (WBAT/FWB desde el día 0).** El cemento fija al instante; no hay que esperar osteointegración. Es el escenario sin conflicto.
- **No cementada / press-fit → la evidencia actual tiende a permitir CARGA SEGÚN TOLERANCIA (WBAT) en la mayoría.** Metaanálisis recientes (incluida una síntesis de 17 estudios) **no hallaron daño adicional significativo** con carga inmediata sin restricción vs carga parcial; un metaanálisis de 2017 vio **mayor hundimiento (subsidencia) femoral a los 3 meses** con carga completa, pero **sin diferencia en Harris Hip Score a 1–2 años**. Algunos cirujanos aún indican carga parcial 6–12 semanas por precaución biológica.
- **Híbrida** (un componente cementado, otro no): seguir la indicación del componente más restrictivo según el cirujano.
- **Press-fit en paciente mayor / hueso osteoporótico:** mayor riesgo de **fractura periprotésica**; aquí muchos cirujanos prefieren cementar o protegen la carga. Si llega un press-fit en un anciano con dolor de muslo a la carga, pensar en fractura/subsidencia (Sección 8).
- **Fractura intra-op, injerto, revisión, osteotomía:** la carga la define el cirujano (puede ser parcial o "toque"), caso por caso. No asumir WBAT.

**Para el fisio:** confirmar siempre el estatus de carga en la orden. "WBAT" = carga según tolerancia con ayuda de marcha; no equivale a "sin andadera". El avance de la ayuda de marcha es por criterios (Sección 5), no por el estatus de carga.

### 3. Ventana de mayor riesgo de luxación (por qué el foco está en las primeras semanas)

Entender esto justifica por qué las precauciones y la educación pesan tanto al inicio:

- **~60–70% de las luxaciones ocurren en las primeras 6 semanas**, la mayoría en dirección posterior; hasta ~70% en el primer mes según algunas series.
- Aproximadamente **59% en los primeros 3 meses** y **~77% en el primer año** [verificar: cifras de literatura citada en Proceedings of the Hip Society 2025].
- Razón: en las primeras **6–8 semanas** la cápsula y los tejidos blandos aún cicatrizan (el "sobre" de tejido que estabiliza la prótesis todavía no madura). Por eso las precauciones clásicas se prescriben ~6 semanas.
- Si una primera luxación ocurre TARDE (> 5 semanas), el riesgo de reluxación es mayor (hasta ~60% vs ~33% si fue temprana) [verificar]. Una cadena de luxaciones es señal de reevaluación quirúrgica.

### 4. Fases de rehabilitación POR CRITERIOS

No hay guía de práctica clínica formal revisada por pares para la rehabilitación post-PTC; lo que existe son protocolos institucionales y revisiones. La estructura más usada es de 3–4 fases con avance por criterios. Las semanas son orientativas.

#### FASE I — Hospitalaria / aguda ("protección", ~0 a 4–6 semanas)

**Metas:** proteger la reparación, controlar dolor e inflamación, prevenir TVP, lograr marcha segura con ayuda, independencia en transferencias y AVD básicas, recuperar activación muscular y ROM dentro de precauciones.

**SÍ (lo que se trabaja):**
- Movilización temprana y marcha el mismo día o al día siguiente (clave ERAS; se asocia a menos TVP/TEP y recuperación más rápida).
- Marcha con **andadera** (o muletas), con el estatus de carga indicado (WBAT en cementada; WBAT en la mayoría de press-fit salvo orden distinta).
- Ejercicios: bombeo de tobillo, isométricos de cuádriceps (quad sets) y glúteos (glut sets), deslizamiento de talón dentro de precaución de flexión, abducción en decúbito/parado, activación de abductores.
- Transferencias seguras (silla alta con reposabrazos, cama, inodoro elevado), higiene de posiciones según abordaje.
- Educación del paciente y la familia en precauciones del abordaje y banderas rojas.

**NO (en Fase I):**
- Violar las precauciones del abordaje (Sección 1).
- **Elevación de pierna recta (SLR) resistida/repetida al inicio:** puede irritar los flexores de cadera y la reparación; introducir con criterio [verificar: recomendación de protocolos, no estándar universal].
- Marcha sin ayuda o escaleras sin supervisión antes de cumplir criterios.
- Ejercicios de rango/fuerza al extremo de la posición de riesgo.

**Criterios para avanzar a Fase II (todos, no por fecha):**
- Dolor e inflamación mínimos y controlados.
- Camina distancias domésticas **sin ayuda técnica** o con mínima asistencia, patrón seguro.
- Buen control: **apoyo monopodal sin caída de la pelvis** (Trendelenburg negativo o en vías de serlo).
- Transferencias y AVD básicas independientes y seguras.
- Herida cicatrizando sin signos de infección.

#### FASE II — Intermedia ("movilidad y fuerza", ~4–6 a 10–12 semanas)

**Metas:** recuperar ROM funcional, normalizar la marcha sin ayuda, progresar fuerza (sobre todo abductores y extensores de cadera y cuádriceps), subir/bajar escaleras con patrón recíproco, equilibrio.

**SÍ:**
- Transición **andadera → bastón → sin ayuda** por criterios (ver Sección 5).
- Progresión de abductores: abducción de pie con banda, "almeja" (clamshell) y puente/bridge introducidos en esta fase, step-ups laterales, marcha lateral resistida (monster walk).
- Fortalecimiento de cadena cerrada: sentadilla parcial, sit-to-stand, subir escalón; bicicleta estática (con sillín alto si hay precaución de flexión).
- Entrenamiento de marcha (simetría, longitud de paso, eliminar Trendelenburg/cojera) y equilibrio/propiocepción.
- Movilidad hacia el ROM funcional; muchas precauciones se liberan hacia las 6 semanas según el cirujano.

**NO:**
- Impacto, carrera, saltos, pivotes, deporte.
- Cargas máximas o rangos forzados al extremo si persiste dolor/inflamación.
- Abandonar la ayuda de marcha mientras haya Trendelenburg marcado o cojera (perpetúa patrón defectuoso).

**Criterios para avanzar a Fase III:**
- ROM funcional para AVD (sentarse, vestirse, escaleras) sin dolor.
- **Marcha sin ayuda, simétrica, sin Trendelenburg ni cojera.**
- Escaleras con patrón recíproco y seguro.
- Fuerza de cadera/rodilla acercándose al lado sano (umbral práctico frecuente **~70% del contralateral** para progresar; algunos protocolos piden apoyo monopodal > 20 s sin caída de pelvis) [verificar: umbrales de protocolos institucionales].

#### FASE III — Fortalecimiento / retorno a función (~3 meses en adelante)

**Metas:** fuerza, resistencia y potencia cercanas a lo normal; retorno a trabajo, actividad recreativa y deporte de bajo impacto; corregir déficits residuales.

**SÍ:**
- Fortalecimiento progresivo (el entrenamiento de resistencia progresiva es superior a cargas bajas para recuperación funcional) [verificar: fuente secundaria].
- Resistencia cardiovascular de bajo impacto (bicicleta, elíptica, natación/agua una vez cerrada la herida).
- Entrenamiento específico de la tarea/deporte permitido; equilibrio avanzado.
- Retorno escalonado a deporte de bajo impacto (Sección 7), con alta del cirujano.

**NO:**
- Alto impacto/pivote salvo autorización explícita del cirujano (y aun así, controvertido; Sección 7).

**Criterios de alta funcional:**
- Fuerza y resistencia **~80–90% del lado sano** (umbral práctico frecuente) [verificar].
- Marcha y AVD normales e indoloras; escaleras sin barandal si aplica.
- Capacidad para la actividad/laboral o deportiva objetivo sin dolor ni inestabilidad.
- Escalas de resultado en metas (Sección 9).

### 5. Timeline típico de hitos (para detectar DESFASE, no como meta rígida)

Orientativo; varía por abordaje, fijación, edad y comorbilidad. Si el paciente está muy por detrás de esto, buscar la causa (dolor, debilidad de abductores, complicación).

- **Día 0–1:** de pie y primeros pasos con andadera; transferencias asistidas.
- **Alta hospitalaria:** mismo día (ERAS, seleccionados) hasta ~1–3 días.
- **Andadera → bastón:** cuando hay carga equitativa, equilibrio adecuado y Trendelenburg/cojera limitados (frecuentemente ~1–3 semanas, por criterios).
- **Bastón → sin ayuda:** cuando la marcha es normal, simétrica y sin cojera (frecuentemente ~3–6 semanas, por criterios).
- **Escaleras:** patrón de aprendizaje "sube con la pierna sana primero, baja con la operada primero" ("la buena sube al cielo, la mala baja al infierno"); patrón recíproco conforme mejora fuerza/equilibrio.
- **Conducir** (ver Sección 7): cadera DERECHA ~4–6 semanas; IZQUIERDA con automático ~2 semanas; algunos DAA antes. Requisitos: sin opioides, prueba de frenado de emergencia, entrar/salir del auto respetando precauciones.
- **Retorno al trabajo:** sedentario/ligero pocas semanas; media global reportada **~10–13 semanas** (p. ej. media 12.5 semanas THA; mediana 10 semanas, IQR 7–14 en vástago corto) [verificar]; trabajo pesado más tarde y según cirujano.
- **Deporte de bajo impacto:** la mayoría de cirujanos lo permite **dentro de los primeros 3 meses**; AAHKS sugiere iniciar retorno deportivo en ese lapso.
- **Fin de precauciones del abordaje:** típicamente ~6 semanas (10% de cirujanos hasta 12) [verificar], o según estabilidad intraoperatoria/reparación capsular.

### 6. Retorno a deporte y actividad

Las recomendaciones **se han vuelto menos restrictivas** conforme mejoran los implantes; no hay consenso uniforme y el alta es del cirujano. Guía general:

**Recomendados / de bajo impacto (en general permitidos):** caminar, nadar, ejercicio en agua, bicicleta (fija o de ruta), golf, senderismo suave, remo suave, baile de bajo impacto. Bicicleta estática de baja resistencia es buena opción temprana.

**Con precaución / impacto moderado (según cirujano y condición):** tenis en **dobles**, esquí de fondo, pilates/yoga adaptado (evitando rangos extremos de la posición de riesgo), elíptica.

**Desaconsejados / alto impacto o pivote (en general NO, salvo indicación expresa):** correr/trotar, baloncesto, fútbol, balonmano, deportes de contacto/artes marciales, saltos, tenis **individual** (fuente en conflicto; varios lo desaconsejan), squash, aeróbicos de alto impacto. Aceleran el desgaste y suben el riesgo de fractura/aflojamiento.

**Encuadre con el paciente:** la postura quirúrgica varía (en una encuesta, ~51% permitía algún retorno a alto impacto, ~34% lo desaconsejaba, ~8% sin límites). Individualizar por edad, nivel previo, fijación y expectativas; dejar por escrito lo que autorizó el cirujano.

**Conducir (detalle):**
- **Cadera derecha:** ~4–6 semanas (controla acelerador/freno); el tiempo de reacción de frenado se mantiene peor a los 6 días y 2 semanas tras cirugía derecha [verificar].
- **Cadera izquierda, transmisión automática:** tan pronto como ~2 semanas si está sin opioides.
- **Transmisión manual:** más tiempo (estimaciones variables; para izquierda algunas fuentes 8–10 semanas) [verificar].
- **Serie de un cirujano (DAA):** retomar manejo ~1 semana y trabajo ~3 semanas si médicamente apto [verificar: serie monocéntrica, no generalizable].
- Requisito transversal: sin medicación sedante/opioide, poder hacer frenado de emergencia, y entrar/salir del auto sin violar precauciones.

### 7. Banderas rojas y complicaciones (vigilancia del fisio)

El fisio suele ser quien más ve al paciente: reconocer y DERIVAR a tiempo salva prótesis y vidas.

- **Luxación protésica:** dolor súbito intenso, imposibilidad de cargar, **acortamiento y rotación anómala del miembro** (posterior: pierna acortada, aducida y rotada INTERNA; anterior: en extensión y rotación EXTERNA), "clunk" y pérdida de movilidad. Es URGENCIA → reducción. Incidencia global ~0–4.1% (anterior ~0.8% vs posterior ~1.4%) [verificar]. Mayor riesgo primeras 6 semanas.
- **TVP / TEP (vigilancia ALTA en cadera):** TVP suele ser asintomática; cuando da signos: **dolor/edema de pantorrilla o miembro que no cede con elevación**, calor, enrojecimiento, venas distendidas. TEP: **disnea súbita, dolor torácico (punzante, peor al inspirar), taquicardia, tos (±hemoptisis)** → URGENCIA (activar emergencias). Riesgo mayor en las primeras 1–2 semanas, hasta ~3 semanas. La movilización temprana reduce el riesgo; no masajear ni aplicar agentes sobre una pantorrilla sospechosa.
- **Infección periprotésica (IAP):** **secreción/drenaje de la herida persistente, eritema, aumento de volumen, dolor que no mejora o reaparece, fiebre/escalofríos/malestar.** Marcadores: VSG y PCR elevadas (umbrales orientativos VSG > 30 mm/h, PCR > ~5–10 mg/L; VSG/PCR juntas sensibilidad 94–98%, especificidad 59–77%) [verificar umbrales; usar los del laboratorio local]. Confirmación por aspiración/cultivo. Cualquier cadera dolorosa + fiebre o herida que drena → evaluación ortopédica urgente, no "esperar a ver".
- **Fractura periprotésica:** dolor agudo y falla para cargar tras caída o esfuerzo (o incluso atraumática en press-fit anciano); umbral bajo para imagen (Rx; a veces TC). Pensar en ella ante dolor nuevo a la carga, sobre todo press-fit en hueso frágil.
- **Lesión nerviosa (ciático/femoral/peroneo):** el **ciático es el más afectado (~79% de las lesiones nerviosas), femoral ~13%** [verificar]. Signos: pie caído (peroneo/ciático), debilidad/parestesias, pérdida de dorsiflexión. Asociado a **alargamiento del miembro** (ciático con alargamiento > ~4 cm; peroneo > ~3.8 cm) [verificar] y a luxación (parálisis ciática hasta ~10% en luxaciones). Documentar fuerza/sensibilidad distal de base.
- **Dolor de muslo / aflojamiento del vástago:** dolor de muslo con la carga o al iniciar la marcha (dolor de "arranque"), que mejora en reposo, sobre todo en no cementadas → sospecha de aflojamiento/subsidencia → Rx y cirujano.
- **Discrepancia de longitud de miembros:** **causa #1 de insatisfacción y de litigio** tras PTC; 1–2 cm suelen tolerarse, más suele dar problemas (lumbalgia, marcha, sensación de cojera). Ojo con la discrepancia **aparente** por oblicuidad pélvica (contractura de cadera o patología lumbar). Medir (Sección 9) y manejar con alza si lo indica el cirujano.

### 8. Valoración relevante en consulta

- **Marcha de Trendelenburg / signo de Trendelenburg:** evalúa fuerza del **glúteo medio** y control pélvico en apoyo monopodal. Positivo = la pelvis del lado en vuelo cae (o el tronco se inclina compensando). Frecuente tras abordaje lateral/posterior por manipulación/disección del abductor. Útil como criterio de progresión (apoyo monopodal sostenido sin caída de pelvis) y como objetivo de fortalecimiento. Un positivo aislado no es diagnóstico: orienta a seguir explorando.
- **Longitud de miembros:** longitud real (EIAS → maléolo medial) y aparente (ombligo → maléolo medial); diferenciar discrepancia real vs aparente (oblicuidad pélvica/contractura). Registrar en Fase I como línea base.
- **ROM** (dentro de precauciones), **fuerza** (abductores, extensores, cuádriceps; comparar % contra lado sano), **inflamación/perímetro**, **estado de la herida**, **dolor (EVA)**, equilibrio y patrón de marcha.
- **Escalas de resultado reportado (PROMs):**
  - **Harris Hip Score (HHS)** (Harris, 1969, *J Bone Joint Surg Am* — referencia fundacional): 100 puntos (dolor ~44, función ~47, ROM ~5, deformidad ~4). Bandas usuales: **90–100 excelente, 80–89 bueno, 70–79 regular, < 70 malo** (hay convención alterna 91–100/81–90/71–80/≤70, verificar cuál usa cada estudio). MCID reportada ~15.9–18 puntos [verificar]; mejoría clínicamente relevante a menudo citada ~40 puntos tras PTC.
  - **HOOS / HOOS JR** (Hip disability and Osteoarthritis Outcome Score): PROM específico de cadera; HOOS JR es la versión corta usada en registros. MCID exacta de HOOS JR tras PTC primaria no confirmada aquí [verificar: trabajos de validación 2024–2026]; MCID de subescalas HOOS a 3 meses reportadas ~7.5 (síntomas), ~8.75 (dolor), ~4.41 (AVD), ~9.38 (deporte/CdV) [verificar].
  - Usarlas al inicio y en seguimiento para objetivar avance y detectar estancamiento.

### 9. Seguridad de AGENTES FÍSICOS con implante metálico (clave para esta clínica)

Una PTC es un implante metálico grande. Antes de cualquier agente físico sobre o cerca de la cadera operada, cruzar con `seguridadClinica` y aplicar:

- **NO radiofrecuencia / diatermia / TECARTERAPIA TÉRMICA / ultrasonido TÉRMICO sobre el material metálico ni sus proximidades.** La diatermia por onda corta/microonda está **contraindicada sobre implantes metálicos**: el campo induce **calentamiento excesivo del metal y del tejido vecino → quemaduras**. En esta clínica esto incluye **Tecar en modo térmico (RET/CET)** y cualquier modalidad de RF/diatermia sobre la zona de la prótesis. (Regla ya vigente de la clínica: metal/osteosíntesis → no RF/diatermia/tecar térmica/US térmico sobre el material.)
- **Ultrasonido terapéutico:** contraindicación **debatida**. Algunas guías sostienen que el metal "no se calienta" con US y que el US continuo/pulsado **no está contraindicado** sobre implantes metálicos modernos; otros estudios (modelos animales/cadavéricos) muestran calentamiento del metal a 1–2 W/cm² continuos. Postura prudente: si se usa, **evitar US térmico/continuo de alta intensidad sobre el componente**; preferir pulsado/baja intensidad y **nunca sobre prótesis cementada** (el efecto térmico podría afectar la integridad del cemento). Ante la duda, no aplicarlo sobre el implante.
- **Electroterapia (TENS/EEM):** el metal en sí no se calienta, pero puede haber **quemadura en los extremos de una barra/implante metálico por intensificación del campo eléctrico**. Más seguro con implantes superficiales y **evitando colocar electrodos directamente sobre el implante**; usar TENS para analgesia y EEM para activación muscular (p. ej. glúteo/cuádriceps) con sentido común de colocación.
- **Marcapaso / DAI / neuroestimulador:** contraindican RF/diatermia y obligan cautela con US/electro (ver `seguridadClinica`).
- **Vigilar TVP en inmovilización:** no aplicar agentes ni masaje sobre pantorrilla con sospecha de TVP; promover movilización temprana (reduce TVP/TEP).
- **Anticoagulación post-op frecuente (precaución):** muchos pacientes salen con profilaxis (aspirina, HBPM o anticoagulante oral). Implica **precaución con técnicas agresivas** (riesgo de hematoma/equimosis), con crioterapia prolongada sobre piel comprometida, y atención a signos de sangrado. Profilaxis típica: agentes AAOS (aspirina, HBPM, warfarina, inhibidores del factor Xa), duración mínima ~10–14 días, extensible hasta ~35 días según riesgo; aspirina 81–325 mg frecuentemente 4–6 semanas en riesgo típico [verificar dosis/pauta contra la guía AAOS vigente y la orden del cirujano].
- **Qué SÍ suele ser seguro y útil (lejos del implante / sin calor sobre metal):** crioterapia para dolor/edema (vigilando piel y sangrado), ejercicio terapéutico (el motor de la recuperación), terapia manual suave fuera de rango de riesgo, EEM para reactivar glúteo/cuádriceps, educación. Los agentes físicos son **coadyuvantes**; la carga/ejercicio manda.

### Fuentes

Evidencia obtenida vía WebSearch (resúmenes); WebFetch a sitios externos quedó bloqueado en esta sesión (DNS/ENOTFOUND), por lo que no se abrieron los PDFs/artículos completos. Cifras finas marcadas [verificar].

- Korfitsen CB et al. "Hip precautions after posterior-approach THA among patients with primary hip OA do not influence early recovery: systematic review and meta-analysis (8,835 patients)." *Acta Orthopaedica*, 2023. https://actaorthop.org/actao/article/view/11958
- Revisión sistemática (7 estudios, 6,900 pacientes): precauciones y tasas de luxación tras abordaje posterior. PMC8023879. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8023879/
- Chan PHA et al. "Scoping review on recommendations of hip precautions after posterior THA." *J Orthop Trauma Rehabil* (SAGE), 2025. https://journals.sagepub.com/doi/10.1177/22104917251336772
- ECA estabilidad intraoperatoria 90°/45°/0° sin precauciones (posterior). *J Arthroplasty*, 2022 (ScienceDirect S0883540322000456). https://www.sciencedirect.com/science/article/abs/pii/S0883540322000456
- ECA 2025: precauciones vs reparación capsular en posterior (sin diferencia en luxación; menor satisfacción con precauciones). ScienceDirect S0883540326004146. https://www.sciencedirect.com/science/article/pii/S0883540326004146
- "Rehabilitation Phases, Precautions, and Mobility Goals Following THA." PMC10626929 (no pude abrirlo; fases y criterios). https://pmc.ncbi.nlm.nih.gov/articles/PMC10626929/
- Ohio State University — Total Hip Arthroplasty Post-op Clinical Practice Guideline, update 2022 (precauciones por abordaje; no pude abrir el PDF). https://medicine.osu.edu/-/media/files/medicine/departments/sports-medicine/medical-professionals/hip/total-hip-arthroplasty-cpg-update-2022.pdf
- Salina Regional Orthopedic Clinic — THA (Anterior Approach) Rehab Protocol, rev. mayo 2024. https://www.salinaregionalorthopedicclinic.com/documents/47/THA_Anterior_Approach_Protocol.pdf
- Lahey Hospital — Rehabilitation Protocol: Total Hip Arthroplasty. https://www.lahey.org/-/media/files/lhmc/orthopedics/hip/lhmc-total-hip-arthroplasty.pdf
- UW Health — Rehabilitation Guideline for Traditional THA (criterio-based), act. 2024. https://bynder.uwhealth.org/m/918ed4c21dc7de54/original/Rehab-Guideline-Traditional-Total-Hip-Arthroplasty.pdf
- E&B Orthopaedics — THA Protocol (ejercicios tempranos, destete de ayuda de marcha). https://eandbortho.com/wp-content/uploads/2022/07/Total-Hip-Arthroplasty-Protocol.pdf
- "Immediate unrestricted vs graduated weight bearing after cementless THA: RCT" (*Annals of Joint*) y metaanálisis carga parcial vs completa en no cementada (PMC5316222, PMC10684916). https://aoj.amegroups.org/article/view/3631/html · https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5316222/ · https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10684916/
- Comparación abordaje anterior vs posterior (tasas de luxación/complicaciones). PMC11942977; análisis de fijación femoral 60,739 PTC PMC11264548. https://pmc.ncbi.nlm.nih.gov/articles/PMC11942977/ · https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11264548/
- "Recommendations for return to sports after THA are becoming less restrictive." PMC7899958. https://pmc.ncbi.nlm.nih.gov/articles/PMC7899958/
- "Returning to Sports and High-Impact Exercise After THA: What Should We Be Recommending in 2026?" *Orthopedic Reviews*. https://orthopedicreviews.openmedicalpublishing.org/article/165090
- AAHKS — "Resuming Sports After Hip Replacement." https://hipkneeinfo.org/hip-care/resuming-sports-after-hip-replacement/
- "Management of VTE After Hip and Knee Arthroplasty" (AAOS/ACCP, aspirina, pautas). PMC12376865; AAOS VTE guideline (NZOA copy). https://pmc.ncbi.nlm.nih.gov/articles/PMC12376865/ · https://www.nzoa.org.nz/sites/default/files/AAOS%20Guidelines%20for%20VTE%20prevention.pdf
- Ensayo CRISTAL (aspirina vs enoxaparina, VTE sintomática 3.45% vs 1.82%) — citado en revisiones AAOS. https://www.aaos.org/aaosnow/2026/apr/clinical/clinical02/
- AAOS OrthoInfo — Deep Vein Thrombosis (signos TVP/TEP). https://orthoinfo.aaos.org/en/diseases--conditions/deep-vein-thrombosis/ · Stop the Clot — Orthopedic Surgery Fact Sheet. https://www.stoptheclot.org/about-clots/toolkit-for-knee-hip-replacement-patients/orthopedic-surgery-fact-sheet/
- "Identification of periprosthetic joint infection after THA" PMC5982357; revisión diagnóstico IAP (VSG/PCR) Hip & Pelvis 2021. https://pmc.ncbi.nlm.nih.gov/articles/PMC5982357/ · https://www.hipandpelvis.or.kr/journal/view.html?doi=10.5371%2Fhp.2021.33.1.11
- "Complications Following Total Hip Arthroplasty" (IntechOpen); emDocs EM@3AM THA Complications (luxación, nervio, fractura, longitud). https://www.intechopen.com/chapters/42832 · https://www.emdocs.net/em3am-total-hip-arthroplasty-complications/
- Trendelenburg: Physiopedia; StatPearls (Europe PMC); MedBridge. https://www.physio-pedia.com/Trendelenburg_Gait · https://europepmc.org/books/n/statpearls/article-30566/ · https://www.medbridge.com/blog/trendelenburg-test-clinical-use-interpretation-and-application
- Harris WH (1969), Harris Hip Score — referencia fundacional (bandas/pesos vía fuentes secundarias). Umbrales de mejoría HHS: Singh et al./estudio de thresholds PMC4901425. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4901425/
- MCID HOOS tras THA (cohorte multicéntrica 2026). DOI 10.1177/10225536261433423. https://doi.org/10.1177/10225536261433423
- Luxación y fusión lumbar / spinopelvic / doble movilidad: estudio fusión lumbar + doble movilidad (*Int Orthop*, 2020). https://link.springer.com/article/10.1007/s00264-020-04507-y
- Ventana temporal de luxación (60–70% en 6 semanas; reparación capsular): PMC7509067; Healio/BHS president. https://pmc.ncbi.nlm.nih.gov/articles/PMC7509067/ · https://www.healio.com/news/orthopedics/20160525/
- Conducir tras PTC: serie DAA (PMC6250078) y guías clínicas (resúmenes). https://pmc.ncbi.nlm.nih.gov/articles/PMC6250078/
- Retorno al trabajo: PMC4651988 (media ~12.5 sem) y vástago corto PMC7925530 (mediana 10 sem). https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4651988/ · https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7925530/
- Agentes físicos y metal: "Electrophysical Agents — Contraindications and Precautions" (consenso canadiense/APTA), PMC3031347; Physiopedia Electrotherapy Contraindications. https://pmc.ncbi.nlm.nih.gov/articles/PMC3031347/ · https://www.physio-pedia.com/Electrotherapy_Contraindications

### Incertidumbres marcadas [verificar]

Números/afirmaciones que NO pude confirmar en el texto completo (WebFetch bloqueado) o que vienen de fuentes secundarias con cifras en conflicto. Verificar contra el PDF/artículo original o la orden del cirujano antes de usarlos como absolutos:

- Topes numéricos del abordaje ANTERIOR/lateral (extensión ~20°, rotación externa ~50°, 6 semanas): provienen de protocolos institucionales (OSU 2022, Salina 2024) que no pude abrir; no son estándar único y varían por centro.
- Tasas de luxación por abordaje (anterior ~0.8% vs posterior ~1.4%; rango global 0–4.1%): cifras de resúmenes; confirmar contra el registro/estudio citado.
- Cronología de luxación (~59% a 3 meses, ~77% a 1 año; reluxación hasta ~60% si la primera es > 5 semanas): mezcla de series antiguas y un abstract de congreso 2025.
- ECA 2025 de reparación capsular vs precauciones: por ahora resumen/abstract; confirmar publicación completa.
- Carga en no cementada: dirección de la evidencia (WBAT seguro en la mayoría) es sólida, pero el protocolo óptimo NO está establecido; señal de subsidencia temprana real. La indicación concreta la da el cirujano.
- Profilaxis TVP (aspirina 81–325 mg, 4–6 semanas; duración 10–14 hasta 35 días): de revisiones secundarias de la guía AAOS; verificar la pauta exacta vigente y la orden individual.
- HHS: bandas (90–100/80–89/70–79/<70 vs 91–100/81–90/71–80/≤70) y pesos (dolor 44/función 47/ROM 5/deformidad 4) de fuentes secundarias; MCID ~15.9–18 y "mejoría relevante ~40 pts" conviven y no coinciden entre fuentes.
- HOOS JR: MCID exacta tras PTC primaria NO confirmada aquí; las MCID de subescalas HOOS a 3 meses (7.5/8.75/4.41/9.38) son de un estudio que no abrí.
- Lesión nerviosa: ciático ~79% / femoral ~13% de lesiones; alargamiento umbral ciático > ~4 cm, peroneo > ~3.8 cm; parálisis ciática hasta ~10% en luxaciones — cifras de resúmenes.
- Umbrales IAP (VSG > 30 mm/h; PCR > 5–10 mg/L; sens 94–98%/esp 59–77%): usar los cortes del laboratorio local y la definición vigente (EBJIS/ICM/MSIS).
- Umbrales de progresión por fuerza (~70% para avanzar, ~80–90% para alta; apoyo monopodal > 20 s): umbrales prácticos de protocolos; no hay estándar único.
- Tiempos de conducir/trabajo (derecha 4–6 sem; izquierda automático ~2 sem; manual 8–10 sem; DAA manejar ~1 sem/trabajo ~3 sem; retorno laboral medio ~10–13 sem): mayoría de fuentes son series monocéntricas o guías clínicas, no ECA; tratar como rangos típicos.
- Ultrasonido terapéutico sobre metal: contraindicación genuinamente DEBATIDA en la literatura; postura prudente adoptada aquí (evitar US térmico sobre el implante, nunca sobre cementada). RF/diatermia/tecar térmica sobre metal SÍ es contraindicación firme.
- "No SLR al inicio" y "entrenamiento de resistencia progresiva superior": recomendaciones de protocolos/fuente secundaria, no de guía de práctica clínica formal (no existe una guía revisada por pares para rehab post-PTC a la fecha).

---

## 🕺 CADERA — labrum acetabular / pinzamiento femoroacetabular (FAI)

#### Documento de referencia para la biblioteca clínica · Clínica Sinergia

> **Para qué sirve este documento.** Es **material de referencia** para que el fisioterapeuta ubique **en qué fase va el paciente, qué restricciones aplican y si va en tiempo o desfasado** tras una artroscopia de cadera por pinzamiento femoroacetabular (FAI) con reparación del labrum (± femoroplastia / acetabuloplastia), y para encuadrar el **manejo conservador** del FAI/labrum.
> **NO es una prescripción automática.** El protocolo quirúrgico, las restricciones de carga y los límites de rango los **define el cirujano** (dependen de la técnica exacta: tamaño de la resección, calidad del labrum, cierre capsular, microfractura/condroplastia concomitante). Ante duda o discrepancia, **manda la hoja del cirujano**. Progresión **por criterios, no por calendario**: las semanas son guía.

---

### 0. Encuadre y reglas de oro

- **Progresar por CRITERIOS, no por calendario.** Las semanas orientan; se avanza cuando se cumple el criterio de la fase (dolor controlado, rango objetivo, patrón de marcha normal, control neuromuscular).
- **La carga es el motor** (ejercicio terapéutico progresivo: glúteos, control lumbopélvico, cadena); los **agentes físicos son coadyuvantes** (acompañan, no sustituyen).
- **Respetar el tejido en reparación.** El labrum reinsertado con anclas y la cápsula suturada necesitan protección temprana de los rangos que los tensan (ver §5). Microfractura/condral concomitante = plazos de descarga mucho más largos.
- **El error más común de esta cirugía es la sobreactivación del psoas/flexores** → tendinitis del iliopsoas iatrogénica. Es la bandera clínica más repetida (ver §5 y §7).
- **Individualizar:** edad, deporte/gesto, displasia o laxitud de base (microinestabilidad), estado del cartílago (artrosis = peor pronóstico), comorbilidades y **seguridad clínica** (anclas metálicas, ver §8).

---

### 1. Qué es el FAI y qué corrige la cirugía

**Definición (Acuerdo de Warwick, Griffin et al., BJSM 2016).** El **síndrome de FAI** es una **tríada clínica**: (1) **síntomas** (dolor de ingle/cadera relacionado con el movimiento o la posición, a veces chasquido/bloqueo/rigidez), (2) **signos clínicos** (pruebas de pinzamiento positivas, rango limitado), y (3) **hallazgos de imagen** (morfología CAM y/o PINCER). **Ningún dato aislado hace el diagnóstico**: se necesita la combinación de los tres. El consenso **no fijó valores de corte radiográficos** ni un algoritmo de tratamiento definitivo (no había evidencia de alto nivel para ello en 2016).

#### Clasificación morfológica (para encuadrar)

| Tipo | Dónde está la deformidad | Medida habitual | Umbral citado (aprox.) |
|---|---|---|---|
| **CAM (leva)** | Unión cabeza-cuello femoral (pérdida de esfericidad; "giba" femoral) | **Ángulo alfa** | **> ~55°** más usado (rango publicado 50–83°; algunos usan 60° para separar sintomático) **[verificar]** |
| **PINCER (pinza)** | Acetábulo: sobrecobertura (sobrecubre la cabeza) | **Ángulo centro-borde lateral (LCEA)** | **> ~40°** más frecuente (rango 35–45°) **[verificar]** |
| **MIXTO** | CAM + PINCER a la vez | Ambas | Es el tipo **más frecuente** en la práctica |

> Referencia de "normalidad": LCEA ~**25–40°** se considera normal; **< 20–25°** sugiere **displasia / infracobertura** (otro problema, con manejo distinto y a veces contraindicación relativa de artroscopia aislada). **[verificar umbrales — son dependientes del estudio; cítese el que se use].**

#### Qué se hace en el quirófano (impacta la rehab)

- **Femoroplastia / osteocondroplastia** (CAM): se "lima" la giba femoral para recuperar la esfericidad. → Vigilar hueso resecado (riesgo de osificación heterotópica; ver §7).
- **Acetabuloplastia / trimming del reborde** (PINCER): se recorta el reborde acetabular sobrecubriente.
- **Reparación del labrum:** reinserción del labrum con **anclas (suturas/implantes)** → **relevante para agentes físicos (§8)** y define los rangos a proteger (§5).
- **Cierre capsular (capsulotomía):** se abre la cápsula para entrar; si se **cierra/plica**, hay precauciones de protección de la sutura capsular; si se deja **capsulotomía amplia sin cierre**, aumenta el riesgo de **inestabilidad** (§7).
- **Microfractura / condroplastia** (si hay daño de cartílago): **alarga mucho la descarga** (NWB/carga muy protegida) — dato clave para saber si el paciente "va en tiempo".

---

### 2. Diagnóstico y pruebas especiales

> **Advertencia transversal:** las pruebas de pinzamiento/labrum son típicamente **MUY SENSIBLES pero POCO ESPECÍFICAS** → sirven para **descartar** (tamizaje) y para **agrupar en clúster**, **no** para confirmar la estructura lesionada por sí solas. El **estándar de imagen es la RM-artrografía**, y la **infiltración intraarticular diagnóstica** (anestésico local intraarticular que quita el dolor) confirma que el origen del dolor es **intraarticular**.

| Prueba | Maniobra / qué busca | Para qué sirve | S / E (orientativo) |
|---|---|---|---|
| **FADIR / pinzamiento anterior** (flexión + aducción + rotación interna) | Lleva la cadera a flexión ~90°, la aduce y la rota internamente; positivo = dolor anterior/ingle reproducido | **Tamizaje de FAI/labrum anterior.** Muy sensible → **un FADIR negativo ayuda a descartar** | **S alta** ~0.78–1.00 (hasta 96–99%); **E baja** ~0.05–0.33 (tan baja como 5–11%). Para desgarro labral, un estudio dio **S 0.53 / E 0.67 [verificar — las cifras varían mucho entre estudios]** |
| **FABER / Patrick** (flexión + abducción + rotación externa, "4") | Tobillo sobre rodilla contraria; mide distancia rodilla-camilla y reproduce dolor | Dolor **posterolateral/sacroilíaco** o **anterior**; cribado inespecífico de patología intra/extraarticular | **S ~0.93 / E ~0.55** en una serie de CAM vs ángulo alfa; **un FABER negativo no descarta [verificar]** |
| **Scour / cuadrante** (compresión en arco) | Cadera y rodilla a ~90°, se recorre un arco manteniendo compresión axial posterior; positivo = "enganche"/clic/aprensión bajo carga | Sugiere **labral/FAI o condral** bajo carga | S reportada muy dispersa (~50–100%); **negativo no descarta [verificar]** |
| **Log roll** (rodamiento en supino) | Rotación pasiva de la pierna extendida; positivo = dolor/clic/pop | **De las más ESPECÍFICAS** para patología **intraarticular** (la cápsula/ligamentos no se tensan, solo gira la articulación). ER aumentada vs contralateral → **laxitud/microinestabilidad** | E relativamente alta; S baja **[verificar]** |
| **Aprensión posterior / anterior** | Posterior: cadera en flexión-aducción-RI con carga posterior. **Anterior (hiperextensión-RE):** extensión + rotación externa reproduce dolor/aprensión anterior | Posterior → labrum/pared posterior; **anterior → microinestabilidad anterior** (laxitud capsular) | Evidencia escasa; usar en clúster **[verificar]** |
| **Dial test** (variante del log roll) | ER pasiva: si supera a la contralateral o el ángulo pie-camilla es < ~20° / sin tope firme → **laxitud capsular anterior** | Sospecha de **microinestabilidad** (dx diferencial del FAI o coexistente) | Sin gold standard; apoyo clínico **[verificar]** |
| **Thomas** | Decúbito, se abraza una rodilla al pecho; la pierna evaluada que no baja = **acortamiento de flexores / flexo de cadera** | **Flexibilidad de flexores de cadera** (psoas/recto anterior), no es prueba de labrum per se | Como prueba de labrum, débil (una serie: S 0.89 / E 0.92, estudio único **[verificar]**) |
| **Trendelenburg** | Apoyo monopodal; positivo = la pelvis **cae del lado contrario** al de apoyo | **Debilidad de abductores (glúteo medio/menor)** — NO es intraarticular. Clave para el **objetivo de fuerza** de la rehab | Marcador de debilidad abductora, no diagnóstico de FAI |

**Clúster recomendado (práctico):** **FADIR + FABER + log roll (± scour)** positivos juntos aumentan la probabilidad; combinar **pruebas de pinzamiento + limitación del rango** mejora la precisión diagnóstica (Reiman et al. y cols.). Un estudio 2026 (Halliwell et al., *Arthroscopy*) reportó que el **clúster FABER + FADIR + elevación de pierna recta resistida** concurrentemente positivo alcanzó **S 94% y exactitud 94%** para desgarro labral **[verificar — E y VPP al 100%, cifras "al techo", pendientes de replicación]**. Aun así, **la imagen (RM-artrografía) y la respuesta a la infiltración intraarticular siguen siendo el referente** para confirmar.

> **Diagnóstico diferencial que no hay que olvidar:** microinestabilidad/displasia (dial test, aprensión anterior, LCEA bajo, signo de pared posterior), tendinopatía del glúteo, pubalgia/aductores, patología del psoas, dolor lumbar referido, cadera "en resorte" (snapping) extraarticular.

---

### 3. Manejo CONSERVADOR del FAI/labrum (ejercicio vs cirugía)

El FAI sintomático **se puede tratar primero sin cirugía** en muchos casos. La evidencia principal:

- **UK FASHIoN (Griffin et al., *Lancet* 2018):** ECA multicéntrico (23 hospitales del NHS, **348 pacientes**, artroscopia vs **Personalised Hip Therapy / PHT**). A 12 meses, la **artroscopia** dio una mejoría mayor de calidad de vida de la cadera (**iHOT-33: diferencia media de ~6.8 puntos** a favor, por encima de la MCID), **pero AMBOS tratamientos mejoraron**. El beneficio de la cirugía fue claro en **morfología CAM** (~8.3 puntos) y **mínimo en mixto** (~1.1). La artroscopia tuvo **más eventos adversos** y fue **menos costo-efectiva** a 12 meses. **[verificar cifras finas]**
- **Lectura clínica:** un ensayo de **fisioterapia estructurada y progresiva** antes de operar es razonable, sobre todo si el cartílago está conservado; la cirugía muestra ventaja sobre todo en CAM. La decisión es compartida con el cirujano.

**Contenido del programa conservador (PHT — Personalised Hip Therapy, Wall et al. 2016, desarrollado para FASHIoN).** Cuatro componentes nucleares, dirigidos por fisioterapeuta, a lo largo de **~12–26 semanas, 6–10 sesiones + programa en casa**:

1. **Valoración detallada** de la cadera y de factores contribuyentes.
2. **Educación y consejo** (qué es el FAI, pronóstico, tranquilizar).
3. **Ayuda para el dolor** (modificación de actividad, agentes físicos coadyuvantes).
4. **Ejercicio individualizado y progresivo**, centrado en **control pélvico y femoral**.

**Ejes del ejercicio (y de todo plan conservador de FAI):**
- **Fuerza y control de cadera:** abductores (glúteo medio: clamshells, abducción con banda de pie, planchas laterales), extensores (glúteo mayor), rotadores externos.
- **Control lumbopélvico y core / estabilidad.**
- **Movilidad de cadera** dentro de rango no provocativo (evitar forzar la flexión-RI que reproduce el pinzamiento).
- **Control postural y propiocepción** (apoyo monopodal, equilibrio).
- **Modificación de actividad:** reducir posiciones de pinzamiento sostenidas (sentado profundo prolongado, flexión-RI repetida, sentadilla muy profunda), corregir patrón de movimiento del gesto que provoca.
- Progresión a **movimientos compuestos funcionales** y gesto deportivo cuando tolera.

---

### 4. Fases de rehabilitación POST-ARTROSCOPIA (por criterios)

> Estructura de **4 fases** (la más consensuada en la literatura: revisión sistemática *State of the Art* 2024, JCM; 14 estudios, 1105 pacientes; tasa de retorno al deporte ~90%). Hay **uniformidad en las 4 fases** pero **inconsistencia en tiempos y criterios de retorno** — por eso se gobierna por criterios y por la hoja del cirujano. Las semanas de abajo son **orientativas para un labrum reparado aislado sin microfractura**; ajustar al caso.

#### Macrociclo orientativo

```
FASE 1 · Protección/cicatrización   sem ~0–4    proteger labrum+cápsula, control dolor/edema, marcha, activación suave
FASE 2 · Movilidad y activación      sem ~4–8    recuperar ROM por criterios, patrón de marcha normal sin muletas, activación glútea
FASE 3 · Fuerza y control neuromusc. sem ~8–16   fuerza de cadera/core, control lumbopélvico, resistencia, iniciar impacto
FASE 4 · Retorno a carrera/deporte   mes ~4–6+   carrera → pliometría → gesto → deporte por criterios y batería de pruebas
```

---

#### FASE 1 — Protección y cicatrización (≈ sem 0–4, por criterios)

**Metas:** proteger la reparación del labrum y la cápsula; controlar dolor y edema; mantener la movilidad de rotación del cartílago **sin tensar la sutura**; activación muscular suave; marcha con muletas segura.

**Restricciones CLAVE (típicas — las define el cirujano):**
- **Carga:** **parcial / de contacto ("flat-foot", ~9–20 kg)** con dos muletas, **~2–4 semanas** en labrum reparado aislado. **[verificar por técnica]** → **Si hubo microfractura/condral: NWB o carga muy protegida ~6–8 semanas** (dato decisivo para saber si va en tiempo).
- **Límites de rango (proteger la reparación):**
  - **EVITAR rotación externa (RE) pasiva de rango final** y **extensión de rango final**, y **sobre todo la COMBINACIÓN extensión + RE** (posición de máxima tensión anterior sobre labrum y cápsula).
  - **EVITAR flexión > 90° temprana** y **sentarse con cadera flexionada > 90°** las primeras ~2 semanas. **[verificar días: p. ej. "sin sentarse >90° por ~14 días", "sin RE más allá de neutro ~21 días", "sin extensión más allá de neutro ~17 días" — muy variable por cirujano]**
  - **NO distracción axial de rango largo** hasta **~8 semanas** (labrum reparado) / **~12 semanas** (reconstrucción labral). **[verificar]**
- **Órtesis (dependiente del cirujano):** a veces **brace de cadera** (limita flexión a ~90°, abducción a ~45°, extensión a 0°) y/o **almohada de abducción** para dormir. Hay evidencia de que **retirar el brace no aumenta complicaciones** en muchos casos → su uso **varía por cirujano**.
- **Psoas:** **NO elevación de pierna recta (SLR) resistida** ni **flexión de cadera activa de cadena abierta** las primeras ~2 semanas (protección del iliopsoas; ver §5).

**Qué SÍ (ejemplos):**
- Marcha con muletas respetando la carga indicada; crioterapia/compresión para edema.
- **Movilidad pasiva/asistida suave en rango seguro** (rotación interna suave, flexión ≤90°, péndulos/círculos suaves), **bicicleta estática sin resistencia y con sillín alto** cuando el fisio lo apruebe (ver §5).
- **Isométricos** suaves (glúteos, transverso/core, cuádriceps), **activación glútea de baja carga en cadena cerrada protegida**, movilidad de tobillo (bomba venosa → profilaxis de TVP).
- Profilaxis de osificación heterotópica si el cirujano la indicó (AINE; p. ej. **naproxeno 500 mg c/12 h × ~3 semanas**, o celecoxib/etoricoxib). **[verificar pauta — es indicación médica]**

**Qué NO:**
- Estiramiento de flexores en **extensión + RE**; RE o extensión pasivas forzadas; flexión profunda bajo carga; distracción; sentarse profundo prolongado; SLR resistido; cualquier maniobra que reproduzca dolor de ingle agudo.

**Criterios para avanzar a Fase 2:**
- Dolor mínimo con los ejercicios de Fase 1.
- **ROM activo y pasivo ≥ ~75% del lado sano** (dentro de los límites permitidos). **[verificar]**
- **Patrón de disparo neuromuscular normal** (activación glútea sin dominancia del psoas/TFL).
- **Marcha normalizada** (base para dejar muletas según carga permitida).

---

#### FASE 2 — Movilidad y activación progresiva (≈ sem 4–8, por criterios)

**Metas:** recuperar **rango completo e indoloro** (ya levantadas la mayoría de las restricciones de rango hacia ~sem 6–8, **según cirujano**); **retirar muletas** a marcha normal sin cojera; activación glútea de calidad; preparar la fase de fuerza.

**Restricciones:**
- Retirar límites de rango **progresivamente y sin dolor** (confirmar con la hoja del cirujano **antes** de forzar extensión + RE).
- Seguir **cuidando el psoas**: progresar flexión de cadera **sin dolor** y sin provocar tendinitis (si aparece dolor anterior con la flexión activa resistida, bajar carga — bandera, §7).
- Evitar impacto/carrera y pliometría todavía.

**Qué SÍ:**
- Movilidad hasta rango completo indoloro; **marcha sin muletas** cuando la carga es completa y sin cojera.
- **Fortalecimiento de cadena cerrada de baja-moderada carga:** puentes (bipodal→unipodal), sentadilla parcial, peso muerto rumano ligero, abducción/aducción con banda, control lumbopélvico.
- **Progresión glútea** (clamshells, abducción de pie, monster walks), core antirrotación, equilibrio monopodal.
- **Bicicleta estática** aumentando tiempo (aún precaución con resistencia alta si molesta el psoas); natación/acuaterapia si la herida cerró **[verificar]**.

**Qué NO:**
- Carrera, saltos, cambios de dirección; cargas máximas; estiramientos agresivos de flexores; nada que reproduzca pinzamiento o dolor de ingle.

**Criterios para avanzar a Fase 3:**
- **ROM completo e indoloro** (o el techo que fijó el cirujano).
- **Marcha normal sin cojera ni muletas**, sin signo de Trendelenburg.
- Buena **activación y control glúteo** en cadena cerrada sin compensación del psoas/TFL.
- Dolor controlado (semáforo verde, §9) con los ejercicios de Fase 2.

---

#### FASE 3 — Fuerza y control neuromuscular (≈ sem 8–16, por criterios)

**Metas:** **fuerza de cadera y core** (prioridad **glúteo medio y mayor**), **control lumbopélvico** en tareas progresivamente exigentes, resistencia, e **introducción del impacto** al final de la fase.

**Clave de esta fase (y bandera a vigilar):**
- **Priorizar glúteos** (medio = estabilidad frontal de pelvis / corrige Trendelenburg; mayor = extensión/potencia) y **control del core**.
- **Evitar la tendinitis del flexor/psoas por sobreactivación**: es la complicación "de rehab" más común. Si el psoas se vuelve el motor de la flexión (dolor anterior con flexión resistida, chasquido doloroso), **reducir trabajo de flexión activa, reforzar glúteos y control**, y revalorar.

**Qué SÍ:**
- Fuerza progresiva **bilateral → unilateral**: sentadilla, peso muerto, zancadas, prensa, puentes cargados, abducción cargada; **énfasis en abductores y extensores**.
- Control neuromuscular dinámico, propiocepción avanzada (superficies inestables, alcances multidireccionales / Y-balance), resistencia aeróbica sin impacto (bici con resistencia, elíptica).
- **Introducción del impacto por criterios** hacia el final (saltos de baja intensidad bipodales, preparación para correr) cuando la fuerza lo permite.

**Qué NO:**
- Correr/pliometría pesada o cambios de dirección **antes** de cumplir criterios de fuerza; cargas que disparen dolor anterior de psoas o de ingle.

**Criterios para avanzar a Fase 4 (iniciar carrera):**
- **Fuerza de cadera ≥ ~80% del lado sano** (dinamómetro manual; abducción/aducción/flexión/extensión). **[verificar umbral — dependiente de protocolo]**
- **Reclutamiento glúteo normal**, control pélvico mantenido en tareas unipodales (p. ej. **single-leg "pick-up" / sentadilla monopodal con pelvis nivelada**, sin Trendelenburg).
- Sin dolor con la progresión de impacto de baja intensidad; semáforo verde.

---

#### FASE 4 — Retorno a la carrera y al deporte (≈ mes 4–6+, por criterios)

**Metas:** progresión **carrera → pliometría → agilidad/cambios de dirección → gesto deportivo → deporte**, superando una **batería de pruebas**.

**Progresión y tiempos orientativos:**
- **Inicio de carrera:** lo más citado **~12 semanas** una vez cumplidos los hitos (algunos protocolos 16–18 semanas). **[verificar — por cirujano]**
- **Retorno al deporte:** típico **~5–6 meses** (guía ISHA ~5 meses; estudios acelerados ~6 meses; literatura antigua media ~9.4 meses). **Deportes de pivote, contacto/colisión y gestos "overhead"/por encima de la cabeza → MÁS TARDE.** **[verificar]**
- **Tasa de retorno al deporte** reportada **~90%** (revisión sistemática 2024).

**Qué SÍ:** programa de carrera progresivo; pliometría creciente; técnica de aterrizaje y desaceleración; cambios de dirección controlados → agilidad; **drills específicos del deporte**; mantener trabajo de fuerza.

**Criterios de retorno al deporte (clúster — no hay un estándar validado único; OSU CPG 2019 advierte que no hay criterios de retorno validados para FAI):**

```
Dolor        sin dolor en carga ni en el gesto deportivo (semáforo verde)
Fuerza       ≥ ~90% de simetría de cadera (abducción/aducción/flex/ext); <80% = BANDERA ROJA
ROM          simétrico e indoloro
Función      pruebas funcionales superadas (hop tests, Y-balance, Vail Hip Sports Test);
             SIN consenso sobre cuál es la mejor batería → usar varias y comparar vs lado sano
Gesto        tolera el gesto específico y la velocidad plena sin dolor ni aprensión
PROM         cuestionario específico (iHOT-33 / HAGOS) en ascenso
```
> **Importante:** estos umbrales son **consenso de expertos**, no puntos de corte validados; individualizar y acordar el alta deportiva con el cirujano.

---

### 5. Precauciones específicas post-artroscopia (resumen operativo)

- **Flexores de cadera / psoas:** **no** trabajo agresivo de flexores temprano (SLR resistido, flexión activa de cadena abierta cargada) → **riesgo de tendinitis del iliopsoas**. Priorizar glúteos y control; introducir flexión activa de forma gradual e indolora.
- **No estirar en EXTENSIÓN + ROTACIÓN EXTERNA temprano** (posición de máxima tensión anterior sobre la reparación labral y la cápsula). Igual, cuidado con la **RE pasiva forzada** y la **extensión de rango final** aisladas en fase temprana.
- **Bicicleta estática:** **sillín ALTO** (para no pasar de ~90° de flexión), **SIN resistencia** al inicio, **no recumbente**, **sin correas en los pedales**; típicamente **10–20 min**, comenzar cuando el fisio lo apruebe (frecuentemente tras la 1.ª semana). **[verificar]**
- **No distracción axial de rango largo** hasta ~8 sem (reparación) / ~12 sem (reconstrucción). **[verificar]**
- **Carga:** respetar estrictamente la indicación (parcial/NWB), **mucho más conservadora si hubo microfractura/condral**.
- **Marcha:** retirar muletas solo con carga completa permitida y **sin cojera / sin Trendelenburg**.
- **Brace / almohada de abducción:** solo si el cirujano los indicó; su uso es variable.

---

### 6. Línea de hitos (para detectar DESFASE)

> Úsese para ubicar "si el paciente va en tiempo". **Si un hito se retrasa claramente, investigar la causa** (dolor no controlado, edema persistente, psoas irritado, adherencias, carga mal progresada) y **revalorar con el cirujano**. Ajustar todo si hubo microfractura/condral (todo se corre varias semanas).

```
~Sem 0–2    Marcha con muletas estable y carga correcta; edema/dolor bajando; isométricos y movilidad
            suave sin dolor; activación glútea iniciada; profilaxis de TVP/osificación según indicación.
~Sem 2–4    Dolor mínimo con ejercicios de Fase 1; ROM acercándose a ~75% del sano dentro de límites;
            disparo neuromuscular correcto (glúteo > psoas).
~Sem 4–6    Dejando muletas a marcha normal (si carga completa permitida); ROM casi completo indoloro.
~Sem 6–8    ROM completo e indoloro; marcha normal sin cojera; buena activación glútea → Fase 3.
~Sem 8–16   Fuerza subiendo a ≥80% del sano; control pélvico unipodal; introducción de impacto por criterios.
~Mes 3–4    Inicio de carrera (~sem 12, si cumple criterios de fuerza y control).
~Mes 4–6    Pliometría → agilidad → gesto; batería de retorno (fuerza ≥90%, pruebas funcionales).
~Mes 5–6+   Retorno al deporte por criterios; pivote/contacto/overhead más tarde.
```

**Señales de que va DESFASADO (revisar):** sigue con muletas más allá de lo esperado por la técnica; ROM estancado por debajo del ~75% pasadas varias semanas; cojera/Trendelenburg persistente; dolor de ingle que no cede; dolor anterior con la flexión (psoas); edema/derrame que reaparece con la progresión.

---

### 7. Banderas rojas, complicaciones y contraindicaciones

**Banderas rojas / complicaciones a vigilar (derivar/avisar al cirujano):**
- **Tendinitis del iliopsoas iatrogénica / por sobreactivación:** dolor anterior de ingle, **chasquido doloroso persistente** con la flexión activa; la complicación "de rehab" más común → bajar trabajo de flexión, reforzar glúteos/control.
- **Adherencias capsulares:** entre labrum/cápsula, sobre todo tras reparación + recorte de reborde; pérdida de rango y dolor que no progresa → considerar como fuente de dolor; movilización y, si persiste, valoración del cirujano.
- **Inestabilidad / microinestabilidad de cadera:** sobre todo si hubo **capsulotomía amplia sin cierre**, sobre-resección del reborde, o base de **displasia/laxitud**. Signos: aprensión anterior, sensación de fallo, RE pasiva aumentada sin tope firme (dial test). **No forzar extensión + RE.**
- **Osificación heterotópica:** dolor, pinzamiento y pérdida de rango; incidencia reportada muy variable (**0–46% [verificar]**); los **AINE reducen** su aparición/severidad.
- **TVP (trombosis venosa profunda):** dolor/edema/calor de pantorrilla, empeoramiento desproporcionado → **urgente**. Incidencia baja (**<1% a ~4% [verificar]**); profilaxis con movilización temprana y bomba venosa.
- **Dolor que no cede / dolor de ingle con chasquido doloroso persistente:** reevaluar (psoas, adherencia, condral, reparación).
- Infección, lesión neurológica por tracción (nervio pudendo/ciático/femorocutáneo) — avisar si parestesias o déficit.

**Contraindicaciones / peor pronóstico (para el encuadre y expectativas):**
- **Condromalacia / artrosis avanzada** (p. ej. **Tönnis ≥ 2**, espacio articular **< 2 mm**): **peor resultado** de la artroscopia y, a veces, **contraindicación relativa** (el manejo puede ser conservador o protésico, no de preservación). **[verificar umbrales]**
- **Displasia significativa no corregida** (LCEA bajo): la artroscopia aislada puede **empeorar la inestabilidad**; suele requerir osteotomía/valoración especializada.

---

### 8. Seguridad de agentes físicos (ligar a seguridad clínica del expediente)

> El labrum reparado se fija con **anclas (implantes)**; la femoroplastia/acetabuloplastia deja hueso resecado. Capturar en `seguridadClinica` del expediente que hay **material/implante** para que salte la alerta.

- **Con anclas metálicas de la reparación labral → NO** aplicar **radiofrecuencia / diatermia / tecarterapia TÉRMICA / ultrasonido TÉRMICO SOBRE el material** (riesgo de calentamiento del implante y del tejido circundante). Si la clínica tiene **anclas no metálicas/bioabsorbibles**, confirmar con el cirujano; ante la duda, **tratar como metal**.
- **Osificación heterotópica:** evitar agentes térmicos agresivos sobre la zona en fase inflamatoria; no "forzar" calor profundo sobre hueso resecado reciente.
- **Agentes como COADYUVANTES** (la carga es el tratamiento): crioterapia/compresión para edema temprano; láser (fotobiomodulación) y tecar **atérmica/leve** o electroterapia analgésica (TENS) para dolor/activación, **lejos del implante y sin modo térmico sobre el material**.
- **Precauciones generales** (igual que el resto de la biblioteca): anticoagulación, cáncer activo, embarazo, trombosis → revisar antes de cualquier agente físico.

---

### 9. Semáforo del dolor (adaptado a cadera de preservación)

```
VERDE     ≤3/10 durante el ejercicio y normaliza en 24 h, sin aumento de edema ni dolor de ingle   → progresar por criterios
AMARILLO  4–5/10 o molestia que cede en 24 h, o leve dolor anterior con flexión                      → mantener carga, no progresar, repetir
ROJO      >5/10, dolor de ingle agudo, chasquido doloroso, edema/derrame que reaparece,              → bajar un escalón, revalorar 48–72 h;
          dolor anterior de psoas que persiste, o sensación de fallo/inestabilidad                     si inestabilidad o signos de TVP → avisar al cirujano
```
Termómetros clave en cadera: **dolor anterior de ingle** (reparación/psoas), **edema/derrame que reaparece** con la progresión y **cojera/Trendelenburg** (control abductor insuficiente).

---

### Fuentes

- **Griffin DR, Dickenson EJ, O'Donnell J, et al. The Warwick Agreement on femoroacetabular impingement syndrome (FAI syndrome): an international consensus statement.** *Br J Sports Med.* 2016;50(19):1169–1176. — https://pubmed.ncbi.nlm.nih.gov/27629403/ · PDF: https://www.hiparthroscopyclinic.co.uk/research/downloads/Warwick_Agreement.pdf
- **Griffin DR, Dickenson EJ, Wall PDH, et al. Hip arthroscopy versus best conservative care for the treatment of femoroacetabular impingement syndrome (UK FASHIoN): a multicentre randomised controlled trial.** *Lancet.* 2018;391(10136):2225–2235. — https://pmc.ncbi.nlm.nih.gov/articles/PMC5988794/ · https://pubmed.ncbi.nlm.nih.gov/29893223/
- **Wall PDH, Dickenson EJ, Robinson D, et al. Personalised Hip Therapy (PHT): development of a non-operative protocol to treat FAI syndrome in the UK FASHIoN RCT.** *Br J Sports Med.* 2016. — https://pmc.ncbi.nlm.nih.gov/articles/PMC5036255/
- **State of the Art in Rehabilitation Strategies After Hip Arthroscopy for FAI Syndrome: A Systematic Review.** *J Clin Med.* 2024 (14 estudios, 1105 pacientes; 4 fases; RTS ~90%). — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11642080/
- **Structured physical therapy protocols following hip arthroscopy: systematic review.** 2021. — https://pubmed.ncbi.nlm.nih.gov/33948193/
- **Leo et al. Criteria-Based Rehabilitation Following Revision Hip Arthroscopy: A Clinical Commentary.** *IJSPT* 2023. — https://ijspt.org/wp-content/uploads/2023/04/19-Leo.pdf
- **Rehabilitation and Return to Sport After Arthroscopic Treatment of FAI (revisión + técnicas avanzadas).** — https://pmc.ncbi.nlm.nih.gov/articles/PMC8811526/
- **Halliwell et al. Clinical Physical Exam Shows High Sensitivity for Detecting Labral Tears in FAI (clúster FABER+FADIR+RSLR).** *Arthroscopy.* 2026. — https://arthroscopyjournals.onlinelibrary.wiley.com/doi/10.1002/arj.70074
- **Combining hip impingement and ROM tests increases diagnostic accuracy in FAI.** — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7511272/
- **Physical Examination of the Hip: FAI, Labral Pathology, and Microinstability.** — https://pmc.ncbi.nlm.nih.gov/articles/PMC9076795/ · FADIR: https://www.physio-pedia.com/FADIR_(Flexion,_Adduction,_Internal_Rotation)_Test
- **Hip Microinstability: etiology, diagnosis and treatment** (dial test, aprensión, PART). — https://academic.oup.com/jhps/article/2/2/123/2188787 · https://academic.oup.com/jhps/article/7/2/288/5864907
- **Complications in Hip Arthroscopy: Recognizing and Managing Adverse Events** (psoas, adherencias, inestabilidad, osificación, TVP). — https://pmc.ncbi.nlm.nih.gov/articles/PMC12396418/ · https://boneandjoint.org.uk/Article/10.1302/2046-3758.17.2000108
- **Chemoprophylaxis for Heterotopic Ossification After Hip Arthroscopy: Systematic Review and Meta-analysis** (AINE; naproxeno 500 mg c/12 h ×3 sem). 2025. — https://pmc.ncbi.nlm.nih.gov/articles/PMC12835504/
- **Clasificación/umbrales radiográficos (ángulo alfa, LCEA):** Femoroacetabular Impingement (revisión NIH) — https://pmc.ncbi.nlm.nih.gov/articles/PMC4280287/ · LCEA en FAI — https://pmc.ncbi.nlm.nih.gov/articles/PMC11596748/
- **Return to running after arthroscopic hip surgery (revisión)** — https://www.drpascualmd.com/pdf/back-to-running1.pdf · **Accelerated rehab and RTS after hip arthroscopy (seguro/efectivo)** — https://pmc.ncbi.nlm.nih.gov/articles/PMC12051851/
- **Objetivos de retorno al deporte / falta de criterios validados:** OSU Hip Arthroscopy Clinical Practice Guideline (2019) — https://medicine.osu.edu/-/media/files/wexnermedical/patient-care/healthcare-services/sports-medicine/education/medical-professionals/hip/hip-arthroscopy-cpg-2019-(002).pdf · A systematic review of objective RTS criteria following hip arthroscopy — https://orthopedicreviews.openmedicalpublishing.org/article/144729
- **Protocolos institucionales (restricciones de carga/ROM, bici, distracción, brace):** MGH — https://www.massgeneral.org/assets/MGH/pdf/orthopaedics/sports-medicine/physical-therapy/rehabilitation-protocol-for-hip-labral-postop.pdf · Brigham & Women's — https://www.brighamandwomens.org/assets/BWH/patients-and-families/rehabilitation-services/pdfs/hip-fai-post-op-rehab-protocol.pdf · Lahey — https://www.lahey.org/-/media/files/lhmc/orthopedics/hip/lhmc-hip-arthroscopy-protocol-bts.pdf · OrthoVirginia (precauciones RE/extensión/sentado) — https://www.orthovirginia.com/wp-content/uploads/2022/09/Eastwood-hip-arthroscopy-PT-protocol.pdf · NebraskaOrtho (iliopsoas release) — https://nebraskaortho.com/wp-content/uploads/2023/04/PT-Protocol-Hip-Arthroscopy-with-Iliopsoas-Release.pdf
- **Non-operative Management and Outcomes of FAI Syndrome** (revisión 2023) — https://link.springer.com/article/10.1007/s12178-023-09863-x
- **Elimination of a Postoperative Brace Does Not Increase Complications Following Hip Arthroscopy** — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10337986/

### Incertidumbres [verificar]

- **Cifras de sensibilidad/especificidad de las pruebas** (FADIR, FABER, scour, log roll, Thomas): **muy dispersas entre estudios** y de calidad heterogénea; las del clúster 2026 (S/E "al techo") **están pendientes de replicación**. Tómense como orientativas, no como puntos de corte firmes.
- **Umbrales radiográficos (ángulo alfa ~55°, LCEA ~40°):** sin consenso internacional; **dependientes del estudio**. Warwick explícitamente **no fijó cortes**. Cítese el umbral que use el radiólogo/cirujano.
- **Días/semanas de las restricciones post-op** (carga parcial 2–4 sem; "sin RE más allá de neutro ~21 d"; "sin extensión ~17 d"; "sin sentarse >90° ~14 d"; distracción 8/12 sem; NWB 6–8 sem si microfractura): **varían mucho por cirujano y técnica**. **Confirmar SIEMPRE con la hoja del cirujano.**
- **Tiempos de carrera (~12 sem) y retorno al deporte (~5–6 meses):** orientativos; **no hay criterios de retorno validados para FAI** (OSU CPG 2019). Pivote/contacto/overhead más tarde, sin cifra consensuada.
- **Umbrales de fuerza (≥80% para correr, ≥90% para deporte, <80% bandera):** consenso de expertos / dependientes de protocolo, no validados.
- **Incidencias de complicaciones** (osificación heterotópica 0–46%; TVP <1–4%): rangos amplios por subregistro y heterogeneidad.
- **Pauta de profilaxis de osificación (AINE):** es **indicación médica**; el esquema (naproxeno 500 mg c/12 h ×3 sem, u otros) debe confirmarlo el cirujano.
- **Tipo de ancla (metálica vs bioabsorbible):** determina la restricción de agentes térmicos; **confirmar con el cirujano**. Ante la duda, tratar como metal.
- **Umbral de artrosis como contraindicación relativa** (Tönnis ≥2 / espacio <2 mm): citado en la literatura pero con variación; decisión del cirujano.

---
*Material de referencia; no sustituye el criterio del fisioterapeuta tratante ni las indicaciones del cirujano. Progresión por criterios. Individualizar por edad, deporte, cartílago, displasia/laxitud de base y comorbilidades.*

---

## 💪 HOMBRO — SLAP, manguito rotador e inestabilidad / Bankart

> **Advertencia transversal sobre pruebas especiales:** casi todas las cifras "estrella" vienen del artículo original del autor de la prueba y NO se reproducen en estudios independientes (p. ej. O'Brien original 100/98.5 → pooled ~60/40). Regla práctica: ninguna prueba sola confirma; se usan en CLÚSTER y el estándar de referencia real es RM-artrografía o artroscopia. En general en hombro: las pruebas de manguito/labrum son **sensibles pero poco específicas** (sirven para descartar), y las de inestabilidad/subescapular son **muy específicas pero poco sensibles** (sirven para confirmar). La mejor síntesis independiente sigue siendo Hegedus et al. 2012 (BJSM, meta-análisis).

---

### 1. Reparación de SLAP tipo II (quirúrgico)

#### Diagnóstico — pruebas especiales
- **O'Brien (compresión activa):** hombro en flexión 90° + aducción 10°, pulgar abajo, resistir descenso → dolor profundo que se alivia con pulgar arriba = + · Sens ~50–67% / Esp ~30–50% (revisiones/meta-análisis; original O'Brien 1998 reportó 100%/98.5%, NO reproducido) · (O'Brien 1998; rev. sistemática Active Compression, PMC 2019)
- **Biceps Load II:** supino, abducción 120° + rotación externa máxima, antebrazo supinado; resistir flexión de codo → dolor = + · Sens ~90% / Esp ~97% en el estudio original; cohortes independientes bajan la especificidad pero mantienen VPN alto (~90%) · (Kim et al. 2001)
- **Dynamic Labral Shear / O'Driscoll:** abducir a 120° en RE y descender de 120°→60° en el plano escapular → dolor/clic entre 90–120° = + · Sens ~78% / Esp ~51% (VPN ~100%) en validación; el paper desarrollador reportó ~72%/98% (no reproducido; subgrupos muy pequeños n=9) · (Sodha et al. 2017; desarrollador Kibler/O'Driscoll ~2009)
- **Speed:** codo extendido, antebrazo supinado; resistir flexión de hombro a 90° → dolor en corredera bicipital = + · Sens ~32% / Esp ~61% para SLAP (es mejor marcador de patología bicipital que de SLAP) · (Hegedus et al. 2008)
- **Crank:** abducción ~160° en plano escapular + carga axial + rotación interna/externa → dolor/clic/aprensión = + · Sens ~91% / Esp ~93% original; revisiones posteriores dan cifras bastante menores y variables · (Liu et al. 1996)

> Clúster recomendado: O'Brien + Biceps Load II mejora el rendimiento frente a cualquiera sola. Marcar incierto: los valores altos aislados no son fiables.

#### Rehabilitación por fases
> La evidencia específica son protocolos de cirujano (variabilidad alta, confirmada por la revisión de 60 protocolos, Chang et al. 2021, PMC8523106) más una revisión narrativa de retorno al juego (Michener/ScienceDirect 2017). No hay GPC JOSPT para SLAP post-qx. El invariante clínico clave es **proteger el anclaje del bíceps**: nada de contracción activa del bíceps ni RE pasiva forzada temprano.

**Fase 1 — Protección máxima (sem ~0–4 · criterio de entrada: post-op inmediato):**
- Metas: proteger reparación, control del dolor/edema, ROM pasivo seguro, evitar inhibición.
- Restricciones: RE pasiva limitada a ~10–15° en plano escapular (algunos protocolos permiten hasta 30°); cabestrillo 4 semanas; prohibido elevación activa, extensión de hombro, abducción+RE combinada.
- SÍ: pendulares, PROM en rango permitido, isométricos submáximos de hombro, movilidad de codo/muñeca (sin resistir bíceps), ejercicio escapular suave.
- NO: **contracción activa/aislada del bíceps** (flexión de codo o supinación resistida), RE pasiva más allá del tope, abducción+RE, extensión de hombro (todas tensan el anclaje SLAP).
- Avanzar si: dolor controlado y tolera PROM en los topes sin molestia del anclaje.

**Fase 2 — Movimiento e inicio de fuerza (sem ~4–10):**
- Metas: recuperar ROM completo progresivamente, iniciar fuerza de manguito/escápula.
- Restricciones: RE a 30° hasta la semana 6, luego progresar hacia 60° [verificar límite exacto por protocolo]; retirar cabestrillo ~sem 4; seguir SIN bíceps resistido.
- SÍ: progresión PROM→AAROM→AROM, RE/RI asistida, isométricos que pasan a isotónicos de manguito ~sem 6, fortalecimiento escapular.
- NO: resistir bíceps, estiramiento agresivo en RE (sobre todo reparaciones de base anterior → progresar RE pasiva más lento; base posterior → progresar RI más lento).
- Avanzar si: ROM casi completo e indoloro, buen control escapular.

**Fase 3 — Fortalecimiento (sem ~10–16):**
- Metas: ROM completo, fuerza progresiva de manguito/escápula, reintroducir bíceps.
- Restricciones: iniciar bíceps resistido LIGERO ~sem 12; bíceps resistido pleno diferido a sem 16–20.
- SÍ: fortalecimiento progresivo con bandas/pesas, cadena cerrada, propiocepción, isométricos de bíceps → isotónicos.
- NO: pliometría pesada o lanzamiento aún.
- Avanzar si: fuerza ~simétrica, ROM completo, sin dolor con cargas.

**Fase 4 — Retorno al deporte / lanzamiento (sem ~16–24+):**
- Metas: potencia, resistencia, gesto deportivo, programa de lanzamiento por intervalos.
- SÍ: pliometría progresiva, programa de lanzamiento por intervalos (ventana más común 16–24 sem; Michener ~16 sem; encuesta 16–20 sem), trabajo específico.
- Avanzar/alta si: ver criterios de retorno.

#### Criterios de RETORNO AL DEPORTE (objetivos)
- ROM completo e indoloro; fuerza simétrica (vs contralateral); programa de lanzamiento por intervalos completado sin síntomas; mecánica correcta; tiempo mínimo ~16 sem para iniciar lanzar, **retorno pleno a lanzamiento/pitcheo competitivo típicamente 9–12 meses**. Solo ~80–90% de atletas overhead vuelven a su nivel previo.

#### Timeline típico (para saber si van en tiempo o desfasados)
- Sem 0–4: cabestrillo, PROM, RE ≤~15–30°.
- Sem 6: inicia isotónicos de manguito; RE progresa hacia 60°.
- Sem 12: ROM completo + inicio bíceps resistido ligero.
- Mes 4 (~sem 16): inicia programa de lanzamiento por intervalos.
- Meses 9–12: retorno pleno a lanzamiento.
> Señal de desfase: si a la semana 6–8 aún no hay AAROM/AROM útil, o si a los 4–5 meses no tolera fuerza simétrica, va atrasado. Forzar RE/bíceps antes de tiempo = riesgo de fallo del anclaje.

#### Contraindicaciones / banderas rojas
- Dolor del anclaje con contracción de bíceps o RE pasiva forzada → retroceder, no progresar.
- Pérdida súbita de ROM o chasquido doloroso nuevo → sospecha de fallo de reparación, derivar.
- Signos de infección (fiebre, eritema/calor/drenaje crecientes), signos de TVP.
- Parestesias nuevas / déficit neurológico.

#### Fuentes
- O'Brien et al. 1998 (Active Compression); Kim et al. 2001 (Biceps Load II); Liu et al. 1996 (Crank); Sodha et al. 2017 (Dynamic Labral Shear); Hegedus et al. 2008/2012 (meta-análisis pruebas de hombro).
- Chang et al. 2021 "Variability in Rehabilitation Protocols after SLAP Repair" (PMC8523106); revisión de rehabilitación y retorno al juego post-SLAP (ScienceDirect 2017, Michener).

---

### 2. Reparación de manguito rotador (quirúrgico)

#### Diagnóstico — pruebas especiales
- **Jobe / empty can (supraespinoso):** abducción 90° en plano escapular + RI (pulgar abajo), resistir → debilidad/dolor = + · Sens ~74–88% / Esp ~30–62% (la DEBILIDAD es más informativa que el dolor; pooled Hegedus 2012 ~74%/30%) · (Hegedus et al. 2012; Itoi 1999)
- **Full can (supraespinoso):** igual pero pulgar arriba (RE ~45°) → debilidad = + · Sens ~70–74% / Esp ~81% (precisión ~75%); preferido por provocar menos dolor que empty can · (Itoi 1999)
- **Hawkins-Kennedy (pinzamiento subacromial):** flexión 90° + RI forzada → dolor = + · Sens ~79% / Esp ~59% · (Hegedus et al. 2012)
- **Neer (pinzamiento subacromial):** elevación pasiva completa en RI estabilizando escápula → dolor = + · Sens ~72% / Esp ~60% · (Hegedus et al. 2012)
- **Lift-off / Gerber (subescapular):** dorso de la mano en región lumbar, separar de la espalda contra resistencia → no poder/debilidad = + · Sens ~12–40% (baja) / Esp ~100% · (Gerber; rev. Clinical Examination of the Rotator Cuff, PMC3826176)
- **Belly-press (subescapular, porción alta):** palma sobre abdomen, presionar manteniendo el codo adelante → codo cae atrás/debilidad = + · Sens ~40% / Esp ~93–98% (la más sensible de las de subescapular, aun así baja) · (PMC3826176)
- **External rotation lag sign (infraespinoso/redondo menor):** codo 90°, brazo en ~20° abd, llevar pasivo a RE casi máxima y pedir sostener → el antebrazo "cae" hacia RI = + · Sens ~46–98% (muy variable) / Esp ~72–100% (Hertel original 70%/100%); requiere RE normal para ser válido · (Hertel 1996; PMC3826176)
- **Drop arm (desgarro grande/completo supraespinoso):** abducir pasivo a 90–120° y pedir descender lento → el brazo cae = + · Sens ~10–73% (baja, típico ~20–30%) / Esp ~77–98% · (PMC3826176)

> Patrón: Jobe/full can/Neer/Hawkins para cribar (sensibles); lift-off/belly-press/ERLS/drop-arm para confirmar (específicas). Ninguna sola es diagnóstica (meta-análisis BMC 2017 y Hegedus 2012: ningún test individual mostró validez superior).

#### Rehabilitación por fases
> **La progresión cambia según el TAMAÑO del desgarro y si se reparó el SUBESCAPULAR.** Protocolos de referencia: Mass General Brigham / Sanford Health / UW Health (handouts de cirujano, criterio-dependientes). Evidencia reciente: un meta-análisis 2023 (PMC10694899) muestra que la movilización TEMPRANA vs diferida en desgarros pequeños-grandes NO aumenta la tasa de re-ruptura; el estándar histórico era inmovilización estricta 4–6 sem (revisión 2025, PMC12537514).

**Fase 1 — Pasiva / protección (sem ~0–6):**
- Metas: proteger reparación, PROM, controlar dolor, evitar rigidez sin estresar el tendón.
- Restricciones por tamaño:
  - Pequeño: cabestrillo ~4 sem; PROM solo 0–4/6 sem.
  - Mediano/grande: cabestrillo 6 sem; solo PROM; objetivo flexión pasiva ≥~125°.
  - Grande/masivo: cabestrillo 6 (–8) sem; PROM sem 1–6 (en masivos a veces PROM por terapeuta se difiere a sem 6); objetivo flexión pasiva benchmark ~100–120°.
  - RE pasiva típica: 0–30° las primeras 3 sem, 0–60° resto de fase 1 — **EXCEPTO si se reparó subescapular → RE solo hasta neutro (0°) × 6 sem y SIN RI resistida × 6 sem**.
- SÍ: pendulares, PROM en topes, isométricos submáximos (no de manguito reparado al inicio), movilidad codo/muñeca, control escapular suave.
- NO: elevación/RE activa; RE pasiva más allá del tope; soltar el cabestrillo antes de tiempo; cargar el brazo.
- Avanzar si: cumple objetivos de PROM (p. ej. flexión pasiva ≥90–120° según tamaño) sin dolor.

**Fase 2 — AAROM → AROM (sem ~4–12):**
- Metas: recuperar ROM activo completo.
- Restricciones: pequeño inicia AROM ~sem 4–6; grande/masivo inicia AROM ~sem 8 (Sanford); evitar RE en abducción si subescapular involucrado.
- SÍ: AAROM→AROM progresivo, escápula, isométricos suaves al final de fase.
- NO: fortalecimiento resistido del manguito aún, sobre todo en grandes/masivos.
- Avanzar si: AROM funcional sin compensación/dolor.

**Fase 3 — Fortalecimiento (sem ~12–20):**
- Metas: fuerza progresiva de manguito y escápula.
- Restricciones: iniciar fortalecimiento ~sem 12 (grandes/masivos típicamente a sem 12); cargas ligeras y progresivas.
- SÍ: bandas/pesas, manguito en progresión, cadena cerrada→abierta, propiocepción.
- Avanzar si: fuerza progresando sin dolor nocturno ni signos de re-ruptura.

**Fase 4 — Avanzada / retorno (mes ~4–9):**
- Metas: potencia, resistencia, gesto deportivo/laboral.
- SÍ: trabajo específico, pliometría si procede.
- Alta/retorno: ver criterios.

#### Criterios de RETORNO AL DEPORTE (objetivos)
- **No hay timeline universal; es por criterios** (Consenso Internacional de Manguito Parte III, Hurley et al. 2025): restauración de fuerza, ROM, propiocepción, resolución del dolor y disposición psicológica. En la práctica: ROM completo e indoloro, fuerza ~prelesional/simétrica, examen funcional satisfactorio. Tiempo mínimo ~6 meses; grandes/masivos 6–9 meses. (Rev. sistemática RTP, Ciccotti 2022, PMC9024603: no hay criterios precisos consensuados).

#### Timeline típico (para saber si van en tiempo o desfasados)
- Sem 0–6: cabestrillo + PROM (RE ≤30° al inicio; neutro si subescapular).
- Sem 6–8: retira cabestrillo; inicia AAROM/AROM (pequeño antes, masivo hacia sem 8).
- Sem 12: inicia fortalecimiento resistido.
- Meses 4–6: fuerza funcional; inicio de retorno en desgarros pequeños.
- Meses 6–9: retorno deportivo (grandes/masivos en el extremo alto).
> Señal de desfase vs riesgo: un masivo con fuerza resistida antes de sem 12, o RE forzada en fase 1, es riesgo de re-ruptura; a la inversa, rigidez que no cede a los 3 meses también es bandera (capsulitis).

#### Contraindicaciones / banderas rojas
- Pérdida súbita de fuerza/ROM activo, chasquido, dolor nuevo → sospecha de re-ruptura → suspender fortalecimiento, derivar.
- RE/abducción pasada temprano (sobre todo con subescapular reparado) = contraindicado.
- Infección (fiebre, calor/eritema/drenaje), TVP.
- Déficit del nervio axilar (deltoides/sensibilidad en "charretera"), parestesias nuevas.
- Rigidez progresiva/capsulitis.

#### Fuentes
- Hegedus et al. 2012 (BJSM, meta-análisis); Itoi 1999 (empty vs full can); Hertel 1996 (lag signs); revisión "Clinical Examination of the Rotator Cuff" (PMC3826176); meta-análisis BMC Musculoskelet Disord 2017.
- Hurley et al. 2025 "Rotator Cuff Consensus Part III" (Arthroscopy); meta-análisis movilización temprana vs diferida 2023 (PMC10694899); revisión de técnicas y protocolos 2025 (PMC12537514); Ciccotti et al. 2022 RTP (PMC9024603); protocolos Mass General Brigham / Sanford Health / UW Health. **[JOSPT 2025 "Rotator Cuff Tendinopathy CPG" es para manejo NO quirúrgico/tendinopatía, no para post-reparación — no aplicar como guía post-qx.]**

---

### 3. Inestabilidad anterior / reparación de Bankart artroscópica (quirúrgico)

#### Diagnóstico — pruebas especiales
- **Aprensión (apprehension):** supino, abducción 90° + RE progresiva → sensación de que "se va a salir" (aprensión, NO dolor) = + · Sens ~66% / Esp ~95% (cuando el criterio + es aprensión, no dolor) · (Hegedus et al. 2012; Lo et al. 2004)
- **Reubicación (relocation / Jobe):** desde aprensión, aplicar fuerza posterior sobre la cabeza humeral → desaparece la aprensión = + · Sens ~65% / Esp ~90% · (Lo et al. 2004)
- **Sorpresa / release (surprise):** desde reubicación, soltar de golpe la fuerza posterior → reaparece aprensión súbita = + · Sens ~64% / Esp ~99% — **la prueba individual más precisa**; las 3 positivas juntas = altísimo valor predictivo de inestabilidad anterior traumática · (Lo et al. 2004)
- **Load and shift:** carga axial + traslación anterior/posterior de la cabeza humeral, graduar I–III → traslación aumentada = + · Sens ~50–55% / Esp ~78–100% · (orthofixar; rev. inestabilidad)
- **Sulcus sign:** tracción caudal del brazo en aducción → surco subacromial >1–2 cm = laxitud inferior/sospecha de inestabilidad multidireccional · datos escasos; con corte >2 cm Sens ~28% / Esp ~97% · (Tzannes & Murrell 1999)

> Clave clínica: distinguir APRENSIÓN (sensación de inestabilidad) de dolor; definida por aprensión la prueba es mucho más específica. El clúster aprensión+reubicación+sorpresa es el patrón más fiable (muy específico).

#### Rehabilitación por fases
> Evidencia: protocolos académicos (Mass General, CHOP 2023, VUMC) + revisión sistemática 2024 que confirma **variabilidad sustancial** entre protocolos post-Bankart. El invariante es proteger la cápsula anterior: **evitar la posición de abducción + RE (posición de aprensión) y la RE pasiva forzada** en las primeras semanas/meses.

**Fase 1 — Protección (sem ~0–4/6 · post-op inmediato):**
- Metas: proteger reparación capsulolabral anterior, controlar dolor, PROM seguro.
- Restricciones: cabestrillo 4–6 sem (rango 4–8; hasta 8 en entornos "no controlados"); **RE limitada**: fase 1 típicamente RE 0° (neutro) hasta ~30° según protocolo (protocolos académicos tipo MGH: FF ≤90°, abd ≤45°, RE ≤30°); si se reparó subescapular (reparación abierta) RE <20° hasta 6 sem.
- SÍ: pendulares, PROM dentro de topes, isométricos submáximos, escápula, codo/muñeca.
- NO: **RE activa; abducción + RE combinadas (posición de aprensión/riesgo); extensión de hombro y mano-a-la-espalda (tensan cápsula anterior); estiramiento pasivo forzado en RE**.
- Avanzar si: dolor controlado, tolera PROM en topes.

**Fase 2 — ROM e inicio de fuerza (sem ~6–12):**
- Metas: recuperar ROM progresivamente, iniciar fuerza de manguito/escápula.
- Restricciones: progresar RE a 45° y luego hacia 90° hacia la semana ~12; NO estiramiento forzado en RE × 3 meses (reparación anterior); evitar abducción+RE de rango final hasta ~12 sem.
- SÍ: AAROM→AROM en todos los planos dentro de límites, isotónicos de manguito/escápula, cadena cerrada.
- NO: posición de aprensión de rango final, RE pasiva agresiva.
- Avanzar si: ROM casi completo, buena activación de manguito/escápula.

**Fase 3 — Fortalecimiento (sem ~12–20):**
- Metas: ROM completo, fuerza/potencia, propiocepción.
- SÍ: fortalecimiento progresivo y excéntrico, perturbaciones/propiocepción, inicio controlado de RE de rango final; reintroducir abducción+RE de forma gradual.
- Avanzar si: fuerza ~simétrica, control dinámico, sin aprensión.

**Fase 4 — Retorno al deporte (sem ~20–28+):**
- Metas: gesto deportivo, potencia, contacto.
- SÍ: pliometría, trabajo específico; programa de lanzamiento por intervalos ~sem 28 (overhead/lanzadores más tarde).
- Alta/retorno: ver criterios.

#### Criterios de RETORNO AL DEPORTE (objetivos)
- ROM completo (incl. RE/abducción de rango final sin aprensión), fuerza simétrica, control propioceptivo, disposición psicológica. **No lanzadores/no contacto ~4–6 meses; lanzamiento ~4.5–6 meses; deportes de contacto/colisión ≥6 meses.** (CHOP 2023: 4–6 meses no lanzadores; clínicas: throwing 4.5 m, deporte 6 m; MGB posterior: lanzamiento por intervalos a sem 28).

#### Timeline típico (para saber si van en tiempo o desfasados)
- Sem 0–4/6: cabestrillo, RE ≤0–30°, sin abd+RE.
- Sem 6–12: RE progresa 45°→90°; AROM todos los planos; inicia fuerza.
- Sem 12–20: ROM completo, fuerza/propiocepción, RE de rango final controlada.
- Mes 4–6: retorno no-contacto / lanzamiento progresivo.
- ≥Mes 6: contacto/colisión.
> Señal de desfase vs riesgo: forzar RE/abducción+RE antes de ~12 sem = riesgo de recidiva/fallo; apresurar a "sanadores rápidos" se asocia a recurrencia. A la inversa, RE que no llega a ~90° hacia los 3–4 meses va atrasado.

#### Contraindicaciones / banderas rojas
- Sensación de subluxación/luxación o aprensión persistente con la actividad → suspender provocación, derivar (posible recidiva/fallo).
- RE/abducción+RE forzada temprana = contraindicado.
- Déficit del nervio axilar (deltoides/sensibilidad charretera), parestesias nuevas.
- Infección (fiebre, calor/eritema/drenaje), TVP.
- Sulcus marcado + hiperlaxitud generalizada → considerar componente multidireccional (ajustar expectativas y protocolo).

#### Fuentes
- Lo et al. 2004 (apprehension/relocation/surprise); Hegedus et al. 2012 (BJSM meta-análisis); Tzannes & Murrell 1999 (sulcus); revisión "Physical Exam of the Unstable Shoulder" (PMC5646139).
- CHOP "Arthroscopic Bankart Protocol Revised 2023"; Mass General / VUMC protocolos; revisión sistemática 2024 sobre variabilidad de protocolos post-Bankart (PMC11446737).

---

### Notas de incertidumbre / dónde difieren los protocolos (para el clínico que afine)
1. **Límites de RE son el punto de mayor desacuerdo** en los tres (SLAP, manguito, Bankart): varían de 0° (neutro) a 30° en fase 1 según cirujano y según si hubo reparación de subescapular o base anterior/posterior. Marcados [verificar] arriba — definir el estándar de la clínica con el/los cirujanos de referencia.
2. **Cabestrillo:** 4 sem (pequeño/SLAP) hasta 6–8 sem (manguito grande/masivo, Bankart). 
3. **Inicio de fuerza:** converge en ~sem 12 en los tres; AROM converge 4–6 sem (pequeño) vs 8 sem (masivo).
4. **Cifras de pruebas especiales:** dar rangos (no un valor único) es lo honesto; las cifras originales están infladas. Hegedus 2012 es la mejor referencia neutral.
5. **No existe GPC JOSPT post-quirúrgica** para estas 3 (la JOSPT 2025 de manguito es para tendinopatía no quirúrgica). La mejor evidencia de consenso quirúrgico es el Consenso Internacional de Manguito 2025 (criterios, no tiempos) y, para retorno, revisiones sistemáticas que coinciden en "por criterios, no por calendario" — lo cual encaja perfectamente con el modelo de semáforo/"qué falta" de la pestaña Protocolo de la app.

Este es material de referencia para revisión clínica, no prescripción automática. Verificar grados y semanas marcados [verificar] contra la fuente primaria antes de fijarlos en la biblioteca durable.

---

## 🦶 TOBILLO Y PIE — esguince lateral, sindesmal, Broström y Aquiles

> Material de referencia para que el clínico revise y afine. No es prescripción automática. Progresar por **criterios**, no por calendario; los tiempos son orientativos para detectar desfases. Grados ROM, carga y cuñas verificables contra el protocolo del cirujano tratante (en post-qx manda el cirujano).

**Regla de descarte de fractura aplicable a TODO trauma agudo de tobillo/pie (puerta de entrada antes de rehabilitar):**
- **Reglas de Ottawa (tobillo):** Rx si hay dolor en zona maleolar **Y** (dolor óseo en borde posterior/punta de maléolo lateral o medial [6 cm distales] **o** incapacidad de dar 4 pasos inmediatamente y en urgencias). **Pie:** dolor en zona medio-pie **Y** (dolor óseo en base del 5º metatarsiano o navicular **o** incapacidad de 4 pasos). · **Sens ~98–99%** (muy buen descarte, VPN cercano a 100%), **Esp baja ~26–35%** (metaanálisis Bachmann, BMJ 2003, 27 estudios; metaanálisis adultos 2022 Sens ~91–92%). Úsalas para **descartar**, no para confirmar.

---

### 1) Esguince LATERAL de tobillo — agudo (conservador) — grados I–III

#### Diagnóstico — pruebas especiales
- **Cajón anterior de tobillo** (integridad LPAA/ATFL): tobillo ~10–15° flexión plantar, se traslada el talón/pie hacia anterior sobre la tibia fija; positivo = desplazamiento aumentado ± "succión/hoyuelo". · **Sens ~54–74% / Esp ~38–87%** (muy variable; Croy 2013 Sens 74%/Esp 38%). · **Clave temporal:** en agudo la Sens es baja (~21%); a los **4–5 días** sube a ~61% → **reexplorar diferido** (van Dijk, 1996). Mejor para "rule-in".
- **Talar tilt / inversión forzada** (LPAA + ligamento peroneocalcáneo/CFL): inversión pasiva comparando bostezo astragalino con el lado sano. · **Esp alta ~82–100% (rule-in) / Sens baja ~17–66%** (fuentes secundarias; confirmar). Un talar tilt negativo no descarta.
- (Descartar fractura con Ottawa, arriba.)

#### Rehabilitación por fases
**Fase 1 — Protección y carga óptima / aguda (sem ~0–2 · criterio de entrada: lesión aguda, fractura descartada):**
- Metas: controlar dolor/edema, normalizar la marcha, recuperar ROM temprano, iniciar activación.
- Restricciones: **carga** = apoyo según tolerancia/dolor (se favorece carga temprana vs reposo); en grado III o dolor marcado, apoyo breve con bota CAM/muletas los primeros días. **Inmovilización** = soporte funcional (tobillera semirrígida/vendaje) **preferido sobre inmovilización rígida** salvo dolor severo transitorio (JOSPT 2021: "protección + carga óptima", evidencia fuerte-moderada). **ROM:** libre dentro del dolor; evitar inversión dolorosa máxima.
- SÍ: carga óptima (modelo PEACE & LOVE: protección = evitar movimiento doloroso, no reposo total; compresión, elevación; evitar hielo prolongado/AINE de rutina ⚠ evidencia debatida), movilidad activa (alfabeto, dorsiflexión), isométricos de peroneos, equilibrio en superficie firme cuando sea indoloro.
- NO: inmovilización rígida prolongada (retrasa recuperación), inversión forzada/pasiva máxima, reposo absoluto.
- Criterios para AVANZAR: marcha sin cojera (± con soporte), edema controlado, ROM dorsiflexión funcional, dolor tolerable con carga.

**Fase 2 — Recuperación de ROM, fuerza y propiocepción (sem ~2–6):**
- Metas: ROM completo simétrico, fuerza de eversores/peroneos, control neuromuscular.
- Restricciones: retirar soporte funcional conforme mejora el control; aún evitar gestos de inversión de alta velocidad sin control.
- SÍ: **terapia manual / movilización articular talocrural y movilización-con-movimiento (MWM/Mulligan)** para ganar dorsiflexión (JOSPT 2021 recomendado); fortalecimiento progresivo (bandas en eversión/inversión/flexión plantar), **entrenamiento de equilibrio/propiocepción/neuromuscular** (recomendación grado A — reduce recurrencia), bicicleta, progresión a superficie inestable.
- NO: correr/pliometría si hay dolor o déficit de equilibrio en apoyo monopodal.
- Criterios para AVANZAR: ROM ~simétrico, fuerza ~buena, equilibrio monopodal estable (ojos abiertos→cerrados), marcha/trote indoloro.

**Fase 3 — Retorno a función/deporte (sem ~6–16 según grado):**
- Metas: correr, cortar, saltar y gesto deportivo sin dolor ni aprensión.
- SÍ: carrera progresiva, agilidad, pliometría, saltos, drills específicos del deporte; tobillera/taping profiláctico para retorno.
- NO: retorno a competencia sin cumplir criterios objetivos (↑ riesgo de re-esguince).
- Criterios: ver Retorno al deporte.

#### Criterios de RETORNO AL DEPORTE (objetivos)
- **Hop tests ≥90% LSI** (algunos protocolos 95%) en salto monopodal en distancia, triple salto, salto cronometrado 6 m y/o crossover (protocolo MGH).
- Fuerza eversores/flexores plantares y equilibrio (SEBT/Y-Balance) simétricos.
- Sin ↑ dolor ni edema con pliometría/gesto deportivo.
- Autorreporte: **FAAM** + **ALR-RSI** (confianza psicológica) recomendados (revisión narrativa 2022).
- **Tobillera o taping profiláctico** al volver (grado A para prevenir recurrencia).

#### Timeline típico (para detectar desfase)
- **Grado I** (estiramiento/microlesión): fase aguda ~3–5 días; retorno ~1–2 sem.
- **Grado II** (rotura parcial ATFL): fase aguda ~5–10 días; retorno ~2–4 sem.
- **Grado III** (rotura completa ATFL ± CFL): fase aguda ~2–3 sem; retorno ~4–8 sem (algunos protocolos 9–10 sem; con bota/muletas puede llegar a 12–16 sem). ⚠ Manejo del grado III sigue siendo **controversial**.
- Periodo agudo 1–2 sem; **las deficiencias post-agudas pueden durar hasta 12 meses** (JOSPT 2021). Si a las 6 sem no corre sin dolor/edema → revisar adherencia, descartar lesión osteocondral/sindesmal/fractura oculta.

#### Contraindicaciones / banderas rojas
- Ottawa positivo no estudiado (fractura), dolor óseo focal, incapacidad de carga persistente.
- Sospecha de lesión **sindesmal** (dolor proximal/anterolateral, dolor con rotación externa) → tratar como #2 (más lento).
- Dolor en seno del tarso, bloqueos, derrame persistente → sospechar lesión osteocondral del astrágalo.
- Dolor retromaleolar/subluxación de peroneos; dolor en base 5º MTT (fractura por avulsión).

#### Fuentes
- Martin RL et al. **CPG lateral ankle ligament sprains revision, JOSPT 2021** (51[4]:CPG1-CPG80). · van Dijk CN, 1996 (reexploración diferida). · Croy 2013 (cajón anterior). · Bachmann, BMJ 2003 + metaanálisis adultos 2022 (Ottawa). · Protocolo MGH esguince lateral no operatorio. · Marco PEACE & LOVE (Dubois & Esculier, 2019).

---

### 2) Esguince SINDESMAL / "high ankle sprain" (ambos: conservador si estable · quirúrgico si inestable)

#### Diagnóstico — pruebas especiales
- **Squeeze test** (compresión de tibia-peroné a mitad de pantorrilla reproduce dolor distal en sindesmosis): · **Esp ~85% (IC 81–89) / Sens baja ~30%** (metaanálisis 2021; estudio individual Sens 30%/Esp 93.5%). Rule-in.
- **Prueba de estrés en rotación externa (ER test)** (rodilla 90°, tobillo neutro, rotación externa del pie reproduce dolor en sindesmosis): · **Esp ~78% (IC 73–82) / Sens baja ~20%** (metaanálisis 2021; estudio individual Sens 20%/Esp 84.8%). Rule-in.
- **Dorsiflexión-compresión / dorsiflexión en estocada** y **palpación de la sindesmosis**: las más **sensibles** → úsalas para agrupar y descartar; luego confirma con squeeze/ER (clúster recomendado por el metaanálisis).
- Conclusión del metaanálisis: **ningún test clínico es a la vez muy sensible y muy específico** → ante sospecha, **imagen** (Rx en carga/estrés; TC/RM de alta Sens-Esp) para medir diástasis y estabilidad.

#### Rehabilitación por fases
**Fase 1 — Protección (sem ~0–3 · criterio de entrada: lesión estable confirmada, sin diástasis):**
- Metas: proteger, controlar dolor/edema.
- Restricciones: **inmovilización** en bota, frecuentemente **sin carga o carga parcial protegida ~2–3 sem** (más conservador que el lateral). **Evitar rotación externa y dorsiflexión forzada** (reproducen el mecanismo).
- SÍ: isométricos suaves, movilidad en flexión plantar indolora, manejo del edema.
- NO: rotación externa, dorsiflexión forzada, carga dolorosa, carrera.
- Criterios para AVANZAR: dolor controlado, carga protegida tolerada, pruebas de estrés menos reactivas.

**Fase 2 — Movilidad y fuerza (subaguda):**
- Metas: restaurar ROM (progresar dorsiflexión al final), fuerza, control.
- SÍ: carga progresiva fuera de bota, movilidad, fortalecimiento, equilibrio/propiocepción; dorsiflexión progresiva según tolerancia.
- NO: pliometría/cambios de dirección hasta tener fuerza y dorsiflexión funcionales.
- Criterios: ROM ~simétrico, marcha normal sin dolor, fuerza adecuada.

**Fase 3 — Avanzada / retorno (prepara deporte):**
- SÍ: perturbaciones, agilidad, pliometría, carrera y entrenamiento específico del deporte (Williams & Allen).
- Criterios: ver retorno al deporte.

#### Criterios de RETORNO AL DEPORTE (objetivos)
- Progresión por función: correr → cortar/pivotar → saltar, sin dolor en sindesmosis.
- Salto monopodal simétrico, fuerza y equilibrio simétricos, pruebas de estrés indoloras.
- Se usa el **single-leg hop test** como criterio en varios protocolos quirúrgicos.

#### Timeline típico (para detectar desfase)
- **Clave: ~2× más lento que el lateral.** Esguince lateral típico vuelve en ~2–6 sem; el sindesmal tarda notablemente más.
- **No operatorio (estable):** retorno medio **~29–39 días** (algunas series) a **~46 días** (metaanálisis, no-op 41.7 vs op 55.2 días).
- **Quirúrgico (inestable):** protocolos **~12–16 sem**; **tornillo** clásico 3–6 meses vs **suture-button/tightrope + rehab acelerada <2 meses** (comentario 2024). Fútbol profesional post-qgrado IIB/III: **~72±28 días** a entrenamiento con equipo (D'Hooghe et al.). Tasa de retorno agrupada en élite **~96%**.
- Grado III, lesión condral asociada y mayor edad → retornos más largos.

#### Clasificación / indicación quirúrgica (para encuadrar el caso)
- **West Point / Calder** por estabilidad: **estable (I–IIA)** → rehab conservadora estructurada; **inestable (IIB–III, o diástasis en imagen)** → **estabilización quirúrgica**. Grado III = disrupción completa con diástasis franca.

#### Contraindicaciones / banderas rojas
- Diástasis en imagen / inestabilidad → no rehabilitar como estable; valorar cirugía.
- Dolor proximal en peroné (fractura de **Maisonneuve** — explorar peroné proximal).
- Osificación heterotópica/sinostosis, dolor persistente con pivote.

#### Fuentes
- Williams GN, Allen EJ. **Rehabilitation of Syndesmotic (High) Ankle Sprains, Sports Health 2010.** · Metaanálisis de tests clínicos de sindesmosis (revisión sistemática 2021). · Metaanálisis retorno al deporte en sindesmosis (élite, 2025; pooled 96%). · D'Hooghe et al. (cohorte fútbol profesional, West Point IIB/III). · Comentario tightrope + rehab acelerada, 2024.

---

### 3) Reparación/reconstrucción de ligamento lateral — Broström-Gould (quirúrgico, post-op)

> ⚠ **No hay protocolo único**: los tiempos difieren por técnica (reparación simple vs **aumentada con suture tape / InternalBrace**) y por cirujano. Manda el protocolo del cirujano. Abajo, el rango convencional vs acelerado.

#### Diagnóstico — pruebas especiales (contexto pre-qx: inestabilidad crónica)
- **Cajón anterior** y **talar tilt** positivos/aumentados vs lado sano (ver #1 para Sens/Esp); se confirman clínicamente + Rx de estrés. Indicación quirúrgica = inestabilidad lateral crónica sintomática que falló a rehab.

#### Rehabilitación por fases
**Fase 1 — Protección/cicatrización (sem ~0–2 a 0–6 según protocolo):**
- Metas: proteger la reparación, controlar edema, cicatrización de herida.
- Restricciones:
  - **Convencional (p.ej. Tri-Service/SOMOS):** **sin carga** en férula/yeso corto sem **0–2**; carga según tolerancia con precauciones sem **2–4**; bota CAM progresando a carga total sem **4–6**. **ROM:** inicio ~sem 3; **restringir inversión las primeras ~4–6 sem.**
  - **Acelerado/aumentado (Ohio State suture-tape; Seybold InternalBrace):** **carga según tolerancia en bota desde el inicio/≤2 sem** (bota 22–23 h/día hasta la 1ª revisión 10–14 días) → tobillera lace-up ≥4 sem; **PT formal desde sem 2.**
- SÍ: isométricos suaves, movilidad en planos seguros, manejo de edema, carga según el protocolo.
- NO: **inversión y flexión plantar forzadas sem 0–2** (tensan la reparación), ROM agresivo, estrés en el injerto.
- Criterios para AVANZAR: herida cerrada, edema controlado, carga protegida tolerada.

**Fase 2 — ROM y fuerza (sem ~2–8):**
- Metas: recuperar ROM (dorsiflexión, eversión, flexión plantar), fuerza, marcha normal.
- Restricciones: **inversión progresiva y cautelosa**; en varios protocolos se limita inversión hasta **sem 6**. ROM ~simétrico al lado sano hacia **sem 7–8**.
- SÍ: movilidad progresiva, fortalecimiento (peroneos/eversores), propiocepción/equilibrio, bici.
- NO: inversión forzada temprana, correr/saltar.
- Criterios para AVANZAR: ROM casi simétrico, fuerza buena, equilibrio monopodal, marcha normal sin bota.

**Fase 3 — Retorno a impacto/deporte (sem ~12–16+):**
- SÍ: carrera progresiva (jogging ~sem 13+), agilidad, pliometría, gesto deportivo; retirar tobillera gradualmente con el deporte en los 1–2 meses siguientes.
- Criterios: ver retorno al deporte.

#### Criterios de RETORNO AL DEPORTE (objetivos)
- ROM y fuerza simétricos, equilibrio/propiocepción, hop tests simétricos, sin dolor ni aprensión en inversión.
- Progresión estructurada de carrera antes de cortes/saltos.

#### Timeline típico (para detectar desfase)
- **Carrera/salto ~14+ sem** (Seybold InternalBrace); jogging **13+ sem** (BCS).
- Retorno a actividad previa: **~13.3 sem con aumento (suture tape) vs ~17.5 sem sin aumento**; élite (Broström no aumentado): entrenamiento personal ~1.9 m, con equipo ~2.9 m, competencia ~3.9 m.
- **Recuperación completa puede tomar hasta ~1 año.** Si a las ~8 sem no camina sin bota con ROM casi simétrico → revisar (rigidez, protección excesiva, dolor).
- ⚠ Dato de baja calidad: "yeso 6 sem estándar, algunos reportan mejor función con 3 sem" (Wikipedia) — no usar como referencia principal.

#### Contraindicaciones / banderas rojas
- Inversión forzada temprana (riesgo de fallo de la reparación), caída/torcedura en fase protegida.
- Dehiscencia/infección de herida, dolor neuropático (nervio sural), rigidez marcada persistente.

#### Fuentes
- Protocolo Tri-Service/SOMOS (Modified Broström, 2020). · Estudio Ohio State: carga inmediata post-Broström aumentado con suture tape (revisión retrospectiva, protocolo acelerado). · Seybold — Modified Broström + InternalBrace rehab (2020). · BCS Orthopedics — guía Modified Broström. · Cohorte élite (retorno al juego post-Broström).

---

### 4) Ruptura del tendón de AQUILES (ambos: quirúrgico y conservador — rehab funcional temprana en ambos)

> **Mensaje central (AOFAS 2024 + metaanálisis):** con **rehabilitación funcional temprana** (movilización y carga precoces), el tratamiento **quirúrgico y el no operatorio dan resultados similares, incluida la re-ruptura.** La decisión qx vs conservador se individualiza; **lo que más importa es la rehab funcional temprana, sea cual sea la vía.**

#### Diagnóstico — pruebas especiales
- **Thompson / Simmonds** (prono, pie fuera de la camilla, se comprime la pantorrilla; normal = flexión plantar; **ausencia de flexión plantar = positivo** = ruptura completa): · **Sens ~96% / Esp ~93%** (metaanálisis Wang 2013; serie Maffulli 174 pts 0.96/0.93). Rule-in fuerte. ⚠ Puede haber flexión plantar residual (flexores largos) → no descarta por sí solo.
- **Palpación del gap** (defecto palpable **~2–6 cm proximal a la inserción en calcáneo**): sin Sens/Esp robustas publicadas; **combinar** con Thompson + **incapacidad de talón monopodal** + mayor dorsiflexión en reposo (prueba de Matles) para el "clúster" diagnóstico.
- Si duda clínica → **ecografía/RM**. (Ottawa no aplica al tendón; sirve para descartar fractura asociada.)

#### Rehabilitación por fases (modelo funcional temprano; aplica a conservador y a post-reparación)
**Fase 1 — Protección en equino, carga precoz (sem ~0–4 · criterio de entrada: dx confirmado / post-op):**
- Metas: proteger el tendón en acortamiento (equino), permitir carga temprana.
- Restricciones: **bota walker con cuñas de talón ~3 cm (equino) · carga según tolerancia desde ~las 2 primeras sem** (AOFAS 2024: la evidencia favorece carga dentro de ~2 sem). **ROM: flexión plantar activa libre; NO dorsiflexión más allá de neutro; NO estiramiento pasivo del tríceps sural** (⚠ convención biomecánica para proteger la reparación/cicatrización; la tendencia moderna es a movilidad activa temprana a neutro — confirmar umbral con el cirujano).
- SÍ: carga en bota con cuñas, dorsiflexión **activa solo hasta neutro**, flexión plantar activa, movilidad de dedos, control de edema.
- NO: dorsiflexión pasiva/forzada, estiramiento del gastro-sóleo, caminar sin bota, flexión plantar resistida pesada.
- Criterios para AVANZAR: herida ok, tolera carga en bota, control de dolor/edema.

**Fase 2 — Retiro progresivo de cuñas y de la bota (sem ~4–8):**
- Metas: llevar el tobillo hacia neutro, destetar cuñas y bota, iniciar fuerza.
- Restricciones (esquema representativo tipo acelerado/UK STAR): **cuñas 3 cm × 4 sem → 1.5 cm × 2 sem → neutro × 2 sem → carga total fuera de bota ~sem 8** (ClinicalTrials NCT02598843). **Retirar bota ~sem 8 cuando: dorsiflexión ≈ neutro y marcha indolora.**
- SÍ: dorsiflexión progresiva hacia neutro/ligero positivo, fortalecimiento isométrico→concéntrico suave, propiocepción, bici; hacia el final, elevaciones de talón bilaterales.
- NO: dorsiflexión forzada agresiva, salto, carrera, sobreestiramiento.
- Criterios para AVANZAR: fuera de bota con marcha normal, **~10 elevaciones de talón monopodales** para iniciar fortalecimiento en carga.

**Fase 3 — Fuerza y resistencia (sem ~8–~16+):**
- Metas: fuerza del flexor plantar, altura de talón, patrón de marcha/trote.
- SÍ: progresión a **talón monopodal**, fortalecimiento progresivo (incluye excéntrico), equilibrio avanzado; iniciar carrera **cuando se cumplen criterios de fuerza** (no por fecha).
- Criterios para iniciar carrera: **25 elevaciones de talón monopodales con altura dentro del 20% del lado sano** (criterio tipo UK STAR / Ohio State).

**Fase 4 — Retorno al deporte (meses ~6–12):**
- SÍ: pliometría, agilidad, gesto deportivo, retorno gradual.
- Criterios: ver retorno al deporte.

#### Criterios de RETORNO AL DEPORTE (objetivos)
- **Fuerza de flexores plantares / altura de heel-rise ≥90% LSI** (algunos 95%); **heel-rise test** (número/altura/trabajo total) simétrico.
- **Hop tests ≥90% LSI** y tareas de estiramiento-acortamiento (no basta fuerza en cadena cerrada).
- **ATRS ≥95/100** (autorreporte Achilles).
- Tiempos: **agilidad específica del deporte ~6 meses** con 90–100% LSI; retorno completo frecuentemente **6–12 meses**. Volver antes de cumplir criterios → peores tasas de re-lesión.

#### Timeline típico (para detectar desfase)
- Carga en bota **~2 sem**; destete de cuñas **sem 4→8**; **fuera de bota ~sem 8** (si DF≈neutro + marcha indolora); talón monopodal **~sem 10–12**; **carrera cuando cumple fuerza (≈3–4 meses)**; **deporte 6–12 meses.**
- ⚠ Alta variabilidad entre protocolos (p.ej. algunas guías NHS difieren carrera a 5–6 meses o fases finales 8–12 meses). Si a las ~12 sem no hace talón monopodal → revisar elongación del tendón (tendón "largo"/débil), adherencia, dorsiflexión excesiva temprana.

#### Contraindicaciones / banderas rojas
- **Dorsiflexión forzada/caída** en fase temprana = riesgo de **re-ruptura** (urgencia relativa).
- Signos de **TVP** (pantorrilla dolorosa, edema, calor — mayor riesgo en inmovilización), infección de herida (post-op), lesión del nervio sural.
- Tendón que se "alarga" (brecha de dorsiflexión excesiva, incapacidad de heel-rise) → revalorar.

#### Fuentes
- **AOFAS Position Statement, Management of Acute Achilles Tendon Ruptures, nov 2024.** · Metaanálisis rehab funcional acelerada no-op (2021). · Revisión narrativa "How Early Is Early?" (2024). · **UK STAR trial** (yeso vs bracing funcional; Costa et al.). · Protocolo ClinicalTrials NCT02598843 (esquema de cuñas). · Protocolo Ohio State reparación de Aquiles (criterios de heel-rise/LSI). · Wang 2013 / Maffulli (Thompson test).

---

### Avisos transversales de seguridad clínica (ligar con `seguridadClinica` de la app)
- **Metal/osteosíntesis/tornillos de sindesmosis o fijación:** NO radiofrecuencia/diatermia/tecar térmica/US térmico sobre el material. En post-Broström con anclas y post-sindesmosis con tornillo/suture-button, aplicar agentes atérmicos y lejos del implante.
- **TVP:** vigilar en inmovilización prolongada (sobre todo Aquiles).
- Anticoagulación, embarazo, cáncer, marcapaso/DAI → precauciones estándar de agentes físicos.

### Incertidumbres marcadas (revisar antes de fijar)
1. ⚠ "No dorsiflexión más allá de neutro / no estiramiento del tríceps sural precoz" en Aquiles: convención muy usada, pero **no encontré un umbral con cita primaria directa**; la tendencia moderna admite movilidad activa temprana a neutro. Confirmar con el cirujano/protocolo local.
2. ⚠ Grados exactos de recomendación (A/B/C) de la CPG JOSPT 2021 para inmovilización vs movilización, terapia manual, equilibrio y bracing: necesité el texto completo de la tabla de recomendaciones (no accesible en esta sesión). La dirección (favorecer carga óptima, terapia manual para DF, entrenamiento neuromuscular grado A, bracing grado A para prevención) es consistente, pero confirmar las letras.
3. ⚠ Sens/Esp de varias pruebas provienen de fuentes secundarias (Physiopedia/blogs) que repiten estudios primarios; verificar van Dijk 1996, Croy 2013, Wang 2013 y el metaanálisis de sindesmosis 2021 antes de citar cifras exactas.
4. Protocolos post-op (Broström, sindesmosis qx) **varían mucho**; presenté el rango convencional vs acelerado. Siempre manda el cirujano.

**Acceso:** si quieren que extraiga las cifras exactas y los grados A/B/C de los PDF primarios (JOSPT 2021, AOFAS 2024, metaanálisis), habría que **habilitar esos dominios en la red de la sesión** (hoy orthopt.org, ifspt.org, aofas.org, pmc.ncbi.nlm.nih.gov y clinicaltrials.gov devuelven 403/DNS vía WebFetch/curl; solo WebSearch funciona).

---

## 🧩 CARTÍLAGO Y LESIONES OSTEOCONDRALES (rodilla y astrágalo)

> **Documento de referencia clínica — NO es prescripción automática.** La rehabilitación del cartílago es de las MÁS dependientes del procedimiento, la localización, el tamaño del defecto y los gestos quirúrgicos asociados (osteotomía, reconstrucción ligamentaria, meniscectomía). **El protocolo lo marca el cirujano.** Este material sirve para que el fisio: (1) ubique en qué FASE va el paciente, (2) conozca las RESTRICCIONES típicas (carga + rango), (3) detecte si el paciente **va en tiempo** o hay desfase, y (4) identifique BANDERAS ROJAS. Ante cualquier discrepancia con la indicación del cirujano, manda el cirujano. Los números finos están marcados con **[verificar]** porque se consolidaron de resúmenes de literatura, no del texto completo.

---

### 1. Por qué el cartílago es distinto (y por qué la rehab es lenta)

El cartílago articular es **avascular, aneural y alinfático**: no sangra, no duele hasta que se afecta el hueso subcondral, y no tiene vasos que traigan células reparadoras. Se nutre por **difusión del líquido sinovial**, y esa difusión depende del **movimiento y de ciclos de carga/descarga** (efecto esponja). De ahí las dos ideas rectoras de toda la rehab de cartílago:

- **El MOVIMIENTO (ROM/CPM) sin carga NUTRE y MODELA el tejido reparado** → se busca temprano.
- **La CARGA/CIZALLA prematura sobre el tejido inmaduro lo DESTRUYE** (desprende el coágulo, hunde el relleno, delamina el injerto) → se restringe por semanas.

El arte de la rehab de cartílago es **separar estos dos ejes**: dar movimiento sin dar carga, hasta que el tejido tolere la carga. Esto es lo opuesto a muchas cirugías ortopédicas donde carga y movimiento avanzan juntos.

#### 1.1 Las dos variables críticas en cada fase: CARGA (weight-bearing) + RANGO (ROM)

Para **cada** procedimiento y localización, lo que define las restricciones es la **combinación** de:
- **Carga (apoyo del peso corporal):** sin carga (NWB) → toque de dedos (touch-down, ~10%) → carga parcial progresiva (PWB, +~25%/sem) → carga total (FWB).
- **Rango articular bajo carga vs. sin carga:** cuánta flexión se permite, y si esa flexión es con o sin peso encima.

#### 1.2 EL CONCEPTO CLAVE: lesión en ZONA DE CARGA vs. lesión PATELOFEMORAL (son inversas)

Esta es **la distinción que más se confunde** y la que cambia por completo el protocolo. Depende de **dónde** está el defecto porque la biomecánica decide cuándo se "aplasta" el injerto:

**A) Lesión en zona de CARGA tibiofemoral — cóndilo femoral, platillo tibial (y, análogo, cúpula del ASTRÁGALO):**
- Al **estar de pie / apoyar** en extensión, el peso pasa directo por el cóndilo/platillo/astrágalo → el injerto se comprime y cizalla.
- Por eso se **RESTRINGE LA CARGA** semanas (NWB o PWB), **pero SÍ se permite ROM/CPM temprano SIN carga** (sentado/acostado): mover la rodilla no aplasta el cartílago mientras no haya peso encima; al contrario, lo nutre.
- Rodillera a menudo **bloqueada en extensión para la marcha** (para que cuando toque el piso, no cargue en flexión), y se abre para hacer ROM sin carga.

**B) Lesión PATELOFEMORAL — rótula o tróclea (es al REVÉS):**
- Cerca de la **extensión** completa, la rótula **casi no contacta** la tróclea (el cartílago PF está prácticamente "descargado") → **se permite APOYAR el peso TEMPRANO, en extensión** (con rodillera bloqueada en extensión para caminar).
- El problema aquí es la **FLEXIÓN bajo carga**: al flexionar, la rótula se mete en el surco troclear y el **área y la presión de contacto PF aumentan mucho** (sobre todo entre ~30° y ~90°). Eso cizalla el injerto PF.
- Por eso en PF se **RESTRINGE LA FLEXIÓN** (rango de flexión limitado, progresivo, con rodillera), y el fortalecimiento con carga se hace **solo en rangos cercanos a la extensión** (p. ej. sentadillas de arco corto 0–30/0–45°), evitando flexión profunda cargada por semanas/meses.

| | **Carga (apoyo) temprano** | **Flexión bajo carga temprana** | ROM sin carga |
|---|---|---|---|
| **Zona de carga** (cóndilo/platillo/astrágalo) | **NO** — restringida semanas | (irrelevante: no hay carga) | **SÍ**, temprano |
| **Patelofemoral** (rótula/tróclea) | **SÍ** — en extensión | **NO** — restringida (rango limitado) | **SÍ**, pero limitado y progresivo |

> **Regla mnemónica:** en el **cóndilo** restringes el **PESO**; en la **rótula/tróclea** restringes la **FLEXIÓN cargada**. Confundirlas hace fallar el injerto.

#### 1.3 CPM (movilización pasiva continua): en cartílago SÍ, a diferencia de la prótesis

- En **artroplastia total de rodilla (TKA)** el CPM cayó en desuso (no mejora resultados).
- En **cirugía de cartílago** se sigue recomendando ampliamente con **lógica biológica**: el movimiento pasivo repetido aumenta el flujo de líquido sinovial sobre el defecto y **favorece la condrogénesis** del tejido de reparación (más y mejor cartílago en modelos). Pauta típica: **~6 h/día durante 6–8 semanas** [verificar], iniciando a las pocas horas del posoperatorio; si no hay máquina, algunos protocolos sustituyen con **~500 repeticiones de flexo-extensión pasiva ×3/día** [verificar].
- **Honestidad de la evidencia:** el soporte es sobre todo **mecanístico/preclínico (animal) y de protocolos**; la evidencia CLÍNICA de que el CPM mejore los desenlaces de microfractura o ACI es **débil** (p. ej. Marder 2005: Lysholm mejoró igual con y sin CPM). Se usa porque es de bajo riesgo y biológicamente plausible, no porque haya ensayos contundentes. Si el paciente no tiene acceso a CPM, el ROM activo-asistido temprano sin carga es la alternativa razonable.

---

### 2. Biología de maduración POR procedimiento (explica por qué las fases duran distinto)

La duración de las fases NO es arbitraria: sigue a qué tan rápido madura el tejido de cada técnica.

- **Microfractura / estimulación de médula ósea (BMS):** se forma un **coágulo** de células de la médula que se transforma en **fibrocartílago** (tipo I, menos resistente que el hialino tipo II). El coágulo es **muy frágil las primeras semanas** → rehab la MÁS protectora al inicio. Maduración del relleno a lo largo de meses; calidad del tejido inferior y más propenso a degradarse con el tiempo.
- **OAT / OATS / mosaicoplastia (autoinjerto osteocondral):** se trasplantan **cilindros de hueso + cartílago hialino propio**. El cartílago es hialino verdadero desde el día 0, pero el **tapón ÓSEO debe integrarse al hueso receptor** (consolidación ~**6–12 semanas** [verificar]). La carga se gradúa según esa **integración ósea**, no según madurar cartílago → progresión de carga relativamente **más rápida** que microfractura/ACI, pero con respeto al hueso.
- **ACI / MACI (implante de condrocitos autólogos):** se implantan condrocitos cultivados (MACI = sobre matriz de colágeno). Maduración **la más lenta de todas**, en fases: **adhesión/proliferación** (0–~6 sem, tejido blando "como gelatina"), **transición/matriz que llena el defecto** (~7–12 sem), **remodelación** (~3–6 meses) y **maduración/endurecimiento** (~9–12 meses), con remodelado que continúa **hasta 1–3 años** [verificar]. Por eso ACI/MACI tiene **fases largas** y el retorno a impacto es el más tardío.
- **Aloinjerto osteocondral (OCA):** cartílago hialino de **donante** (condrocitos viables) sobre hueso de donante. El cartílago es maduro, pero el **hueso del aloinjerto debe incorporarse al huésped**, y esa **incorporación ósea es MÁS LENTA** que en autoinjerto → restricciones de carga **más conservadoras** y retorno al deporte tardío.
- **Fijación de OCD / osteocondral:** si el fragmento es viable y se fija con tornillos/pins, es **consolidación de hueso-cartílago in situ** (como una fractura intraarticular): se protege carga y flexión hasta que consolide (~6–8 sem), con deporte muy diferido.

---

### 3. Marco de fases por CRITERIOS (no por calendario) — común a todos

Las fechas son orientativas para detectar desfase; **el avance se decide por criterios cumplidos**, no por el día del calendario.

#### Fase 0–1 — PROTECCIÓN y activación (descarga + ROM/CPM)
- **Metas:** proteger el relleno/injerto, controlar derrame y dolor, **recuperar extensión pasiva completa**, reactivar cuádriceps (control, no fuerza), ROM progresivo **sin carga**, nutrir el tejido (CPM/ROM).
- **SÍ:** CPM/ROM pasivo-asistido sin carga; movilización rotuliana; contracciones isométricas suaves de cuádriceps/glúteo; trabajo de cadera y core sin cargar la rodilla; crioterapia y control de edema; marcha con muletas respetando la carga indicada.
- **NO:** apoyar más peso del indicado; flexión profunda bajo carga; cadena cinética abierta resistida agresiva sobre la zona reparada; impacto; pivote; cuclillas/escaleras cargadas.
- **Criterios para avanzar:** derrame mínimo/ausente, **extensión pasiva completa simétrica**, control activo de cuádriceps (elevación de pierna recta sin retraso extensor), ROM dentro de la meta de la fase, dolor controlado.

#### Fase 2 — TRANSICIÓN a carga progresiva y restauración funcional
- **Metas:** llegar a **carga total sin muletas** con marcha normal y sin derrame, ROM completo, iniciar fuerza funcional.
- **SÍ:** progresión de carga según pauta; destete de rodillera/muletas cuando hay control y marcha normal; cadena cerrada en **rangos seguros** (en PF, arcos cercanos a extensión); bicicleta estática sin resistencia → ligera; propiocepción; patrón de marcha.
- **NO:** avanzar si reaparece **derrame o dolor con la carga** (señal de sobrecarga del injerto); impacto; flexión cargada profunda antes de tiempo.
- **Criterios:** **carga total indolora**, marcha simétrica sin muletas, **ROM completo**, sin derrame que reaparezca con actividad, buen control neuromuscular.

#### Fase 3 — FUERZA y resistencia
- **Metas:** recuperar fuerza perdida en la descarga, resistencia, base para impacto futuro.
- **SÍ:** fortalecimiento progresivo (cadena cerrada y abierta en rangos tolerados), resistencia cardiovascular de bajo impacto (bici, elíptica, natación/ caminata), equilibrio avanzado.
- **NO:** correr/saltar/pivotar antes de los hitos del procedimiento (sección 5); progresar con dolor o derrame recurrentes.
- **Criterios:** fuerza aproximándose a **≥80–90% del lado sano**, sin dolor ni derrame con la carga de la fase.

#### Fase 4 — RETORNO a impacto / deporte (muy tardío en cartílago)
- **Metas:** reintroducir impacto gradual (marcha rápida → trote → carrera → pliometría → cambios de dirección → gesto deportivo → contacto/competencia), según ventana del procedimiento.
- **SÍ:** progresión escalonada de impacto con monitoreo de derrame/dolor a las 24 h; criterios funcionales cumplidos.
- **NO:** saltar etapas; volver a competir sin superar pruebas; impacto antes de la ventana biológica (sobre todo ACI/MACI y OCA).
- **Criterios (ver sección 7):** ROM y fuerza **≥90%** del contralateral, pruebas funcionales simétricas, sin derrame tras impacto, progresión de carrera tolerada, **ventana temporal del procedimiento cumplida**.

---

### 4. Restricciones típicas POR PROCEDIMIENTO y LOCALIZACIÓN

> Todas las cifras son **rangos típicos de protocolos de cirujano** y varían con tamaño de lesión y gestos asociados. **[verificar]** contra la indicación del cirujano.

#### 4.1 Microfractura / estimulación de médula ósea (BMS) — el coágulo es frágil

**Cóndilo femoral / platillo tibial (zona de carga):**
- **Carga:** descarga protegida prolongada. Típico **touch-down/NWB las primeras ~2 semanas**, luego **carga parcial progresiva ~+25% del peso/semana**, llegando a carga total hacia **~6–8 semanas** [verificar]. Lesiones grandes (**>4 cm²**) se protegen más (4–6+ sem de carga restringida) [verificar].
- **ROM/CPM:** **temprano y sin carga** desde el día 1 (CPM ~6 h/día × 6–8 sem). Rodillera a menudo **bloqueada en 0° para la marcha ~6–8 sem** [verificar], abierta para ROM.
- **Lógica:** el coágulo no debe recibir cizalla al apoyar, pero sí movimiento sin carga para que madure a fibrocartílago.

**Patelofemoral (rótula/tróclea) — inverso:**
- **Carga:** **apoyo temprano permitido en EXTENSIÓN** con rodillera bloqueada en extensión.
- **Flexión:** **restringida** (flexión limitada progresiva, evitar flexión cargada profunda ~6–8 sem) para no cizallar; cadena cerrada solo en arco corto cercano a extensión [verificar].

#### 4.2 OAT / OATS / mosaicoplastia (autoinjerto osteocondral) — manda la integración del hueso

- **Carga (cóndilo):** varía por tamaño y nº de tapones. Rango de protocolos: **NWB/touch-down 0–3/0–4 sem → PWB 25–50% sem 3–6 → FWB ~8 sem** (algunos cirujanos más lentos: FWB 10–12 sem) [verificar]. La progresión sigue la **consolidación del tapón óseo**.
- **ROM:** generalmente **movilización temprana** permitida (el cartílago es hialino propio); rodillera bloqueada en extensión para marcha/sueño ~2–4 sem en algunos protocolos [verificar].
- **Impacto/deporte:** impacto diferido a **~6 meses**; retorno al deporte ~6–9 meses según demanda [verificar].
- **Patelofemoral:** mismo principio PF — carga en extensión OK, flexión cargada restringida; rodillera en extensión más tiempo.

#### 4.3 ACI / MACI (condrocitos autólogos) — maduración lenta, fases largas

- **Carga (cóndilo/tibiofemoral):** descarga protegida con **progresión ~+25%/semana a carga total hacia ~6(–8) semanas**; destete de rodillera ~sem 6 [verificar]. (Guía clínica JOSPT recomienda **progresión escalonada a carga total en 6–8 semanas** para lesiones de cartílago articular.)
- **ROM/CPM:** **extensión bloqueada las primeras ~48 h**, luego ROM pasivo progresivo + **CPM** temprano; recuperar extensión completa pronto.
- **Patelofemoral (clave):** la carga progresa **más lento** que en tibiofemoral y, sobre todo, se usa **rodillera con FLEXIÓN LIMITADA bajo carga** (p. ej. límite ~**60° para injertos PF** en protocolos acelerados de Ebert/D'Alessandro [verificar]; otros desbloquean la flexión conforme hay control de cuádriceps ~sem 7–12). Marcha en extensión; fortalecimiento en arco corto.
- **Fuerza:** meses **3–6** (recuperar lo perdido en la descarga).
- **Impacto/deporte:** trote **~7–9 meses**, carrera **~9–12 meses**, **impacto/pivote NO antes de ~9 meses** y con frecuencia **12–18 meses**, especialmente PF y lesiones grandes [verificar]. Es el procedimiento con **retorno MÁS tardío** por su maduración lenta.

#### 4.4 Aloinjerto osteocondral (OCA) — más conservador por incorporación ósea lenta

- **Carga:** **más conservadora que autoinjerto** porque la incorporación del hueso del donante tarda más. Rango de protocolos: **touch-down/PWB ~2 sem → ~50% sem 2–8 → FWB ~8–12 sem** [verificar]. **Alta variabilidad entre cirujanos** (encuesta de 76 cirujanos: desde NWB con FWB a las 12 sem hasta carga según tolerancia inmediata; los de mayor volumen tienden a ser menos restrictivos).
- **ROM:** movilización temprana habitual; rodillera en extensión para marcha.
- **Deporte:** **~9–12 meses o más** (profesionales: tiempo medio de retorno **~1.2 años** [verificar]); PF más lento.

#### 4.5 Lesión osteocondral del ASTRÁGALO (OLT) — zona de carga del tobillo

- **BMS/microfractura del astrágalo:** clásico **NWB estricto 6–8 semanas** para proteger el fibrocartílago [verificar]. **Debate actual:** carga temprana vs. tardía — el ECA de **Deal (2019)** mostró mejores puntajes a corto plazo con carga temprana pero **sin diferencia significativa a 2 años**; metaanálisis: **no concluyente**. Tendencia reciente a reanudar carga algo antes, pero muchas series mantienen 6 sem. **ROM de tobillo temprano sin carga** (dorsi/plantiflexión) para nutrir y evitar rigidez.
- **OAT/aloinjerto en astrágalo:** frecuentemente requiere **osteotomía maleolar** para acceder → la rehab también respeta la **consolidación de la osteotomía** (hardware metálico, ver sección 8). NWB ~**5–6 sem** [verificar], luego progresión.
- **AMIC (matriz + BMS) en astrágalo:** deporte competitivo desde **~6 meses**, retorno medio **~12 meses** para lesiones >1.5 cm² [verificar].
- **Retorno al deporte (OLT):** BMS/microfractura **~15 semanas a ~5.5 meses** (tasa de retorno ~**76%**, muchos no al nivel previo); pediátricos con lesiones pequeñas (<10 mm) hasta 100% de retorno [verificar]. OATS: la mayoría retorna pero con menor frecuencia de práctica. **Guía DGOU 2024:** sin ventaja clara de microfractura sobre micro-perforación; trasplante osteocondral para lesiones que fallaron a BMS.

#### 4.6 Osteocondritis disecante (OCD) de rodilla — ESTABLE vs INESTABLE, JUVENIL vs ADULTO

**Distinción que define todo:**
- **Juvenil (fisis abiertas):** mayoría **estables** → suelen cicatrizar; **tratamiento NO quirúrgico** primero.
- **Adulto (fisis cerradas):** mayoría **inestables/sintomáticas** → suelen requerir cirugía (fijación del fragmento, o reparación si no es viable).

**OCD juvenil ESTABLE (no quirúrgico):**
- Restricción de actividad ± descarga parcial con muletas y/o **rodillera descargadora** ~**4–6 sem**, luego carga según tolerancia **6–12 sem** con ROM y fortalecimiento de bajo impacto de cuádriceps/isquios [verificar]. Objetivo: cicatrización radiográfica antes de volver a impacto.

**OCD INESTABLE → FIJACIÓN del fragmento (tornillos/pins, con frecuencia metal → sección 8):**
- **Carga:** protegida **~6–8 sem** (algunos NWB 3 sem → PWB 3–6 → FWB 6 sem) [verificar].
- **Flexión:** a menudo **limitada <90° ~6 sem** [verificar] para proteger la fijación.
- **Deporte:** **excluido ≥8 meses** [verificar] (consolidación hueso-cartílago).
- **Nota:** evidencia mayormente de bajo nivel; corregir malalineación (osteotomía) o inestabilidad ligamentaria concomitante si existe. **Fragmento inestable/suelto puede dar BLOQUEO articular → bandera roja (sección 6).**

---

### 5. Línea de tiempo de HITOS (para detectar desfase) y cuándo se permite impacto

> Úsese para responder "¿va en tiempo?". Un paciente **por detrás** de estos hitos (p. ej. aún con derrame y sin extensión completa a las 6–8 sem, o sin carga total a las 10–12 sem) debe **revisarse con el cirujano** antes de forzar. Un paciente que **se adelanta** (quiere correr a los 3 meses tras ACI) debe **frenarse**. Rangos típicos; **[verificar]**.

| Hito | Microfractura cóndilo | OAT/OATS | OCA | ACI/MACI | OLT astrágalo (BMS) | OCD fijación |
|---|---|---|---|---|---|---|
| Extensión pasiva completa | ~2–4 sem | ~2–4 sem | ~2–4 sem | ~2–6 sem | n/a (tobillo) | ~ según flexión limitada |
| Carga total sin muletas | ~6–8 sem | ~8 (–12) sem | ~8–12 sem | ~6–8 sem | ~6–8 sem | ~6 sem |
| ROM completo | ~6–8 sem | ~6–8 sem | ~8 sem | ~8–12 sem | tobillo ~6–8 sem | tras liberar flexión |
| Bici/elíptica | ~6–8 sem | ~6 sem | ~8 sem | ~8–12 sem | ~8–12 sem | ~8–12 sem |
| **Trote/correr** | ~4–6 meses | ~4–6 meses | ~6–9 meses | **~7–12 meses** | ~3–4 meses | diferido |
| **Impacto / pivote / deporte** | ~6–9 meses | ~6–9 meses | **~9–12+ meses** | **~9–18 meses** (PF lo más tardío) | ~4–6 meses (BMS); 6–12 m (OAT/AMIC) | **≥8 meses** |

**Patrón general:** el impacto en cartílago es **muy tardío** y **ACI/MACI y OCA son los más lentos**; la lesión **patelofemoral** alarga aún más el retorno a flexión cargada e impacto. El astrágalo con BMS tiende a retornos funcionales más rápidos que la rodilla.

---

### 6. Banderas rojas y contraindicaciones (parar y referir)

- **Carga prematura en zona de carga** (apoyar más peso del indicado sobre cóndilo/platillo/astrágalo): **falla el relleno/injerto** (delaminación, hundimiento). La señal fisioterapéutica es **derrame y/o dolor que aparecen o aumentan con la carga** → retroceder y avisar.
- **Derrame persistente o recurrente:** sobrecarga del tejido reparado o reacción articular → no progresar; evaluar.
- **Bloqueo articular / resalto mecánico / "se traba":** sospecha de **fragmento suelto** (OCD inestable, cuerpo libre, tapón/injerto desprendido) → **referir urgente** (posible fragmento que requiere cirugía).
- **Signos de TVP:** dolor/edema/calor en pantorrilla, empeoramiento unilateral (riesgo alto por inmovilización/descarga + cirugía de MMII) → **referir urgente**, no masaje ni ejercicio hasta descartar.
- **Infección:** fiebre, eritema, calor, dolor desproporcionado, secreción, derrame turbio → **referir urgente**.
- **Flexión cargada profunda en lesión patelofemoral** antes de tiempo (cuclillas, escaleras cargadas, flexión >límite con rodillera): **cizalla el injerto PF**.
- **Dolor nuevo en zona del injerto con el impacto** (sobre todo si reaparece derrame a las 24 h): sobrecarga → regresar de fase.
- **Pérdida de extensión que no progresa / artrofibrosis incipiente:** priorizar extensión; avisar.

---

### 7. Valoración y pruebas relevantes

- **Derrame:** prueba de barrido (stroke/sweep test), peloteo rotuliano. El derrame es el **termómetro de sobrecarga** en cartílago: si aparece con una actividad nueva, esa actividad fue demasiado.
- **ROM:** goniometría de **extensión** (prioridad: debe igualar al lado sano temprano) y flexión según meta de fase; en astrágalo, dorsi/plantiflexión.
- **Fuerza:** cuádriceps (clave; inhibición post-descarga), isquios, glúteos; dinamometría o pruebas funcionales; **índice de simetría de extremidad (LSI)**.
- **Marcha:** patrón, apoyo, uso de muletas/rodillera, descarga antálgica.
- **Pruebas funcionales de retorno (no hay batería específica de cartílago; se adapta la de LCA):**
  - **Fuerza de cuádriceps ≥90% del lado sano** (algunos usan ≥85% cuádriceps / ≥90% isquios) [verificar].
  - **Batería de saltos** (hop simple, triple, cruzado, 6 m cronometrado) con **LSI ≥90%** en cada uno.
  - **ROM completo e indoloro, sin derrame.**
  - **Progresión de carrera/impacto tolerada sin derrame a 24 h.**
  - **Ventana temporal del procedimiento cumplida** (criterio no negociable; ver sección 5).
- **Advertencia sobre el LSI:** el índice de simetría **puede sobrestimar** la función (ambas piernas se desacondicionan); complementar con fuerza absoluta y calidad del gesto, no solo simetría.
- **PROMs/imagen (seguimiento del cirujano):** escalas clínicas (Lysholm, IKDC, KOOS); RM con **MOCART** para madurez del injerto (lo interpreta el cirujano, no define el alta fisioterapéutica por sí solo).

---

### 8. Seguridad de AGENTES FÍSICOS con fijación metálica (ligar a `seguridadClinica` / `_soapSeguridadHTML`)

Muchos de estos pacientes llevan **fijación metálica**: tornillos/pins de OCD, tornillos de osteotomía maleolar (acceso al astrágalo), tornillos/placas de osteotomía tibial (TTO) o de alineación, o algún injerto fijado. **Capturar el implante en `seguridadClinica` para que salte la alerta de metal** (la caja roja "🛑 CUIDADO" y `_soapSeguridadHTML` ya detectan osteosíntesis/placa/clavo/tornillo). Reglas de seguridad de agentes físicos sobre o cerca del material metálico:

- **NO aplicar calentamiento profundo sobre el implante:** **radiofrecuencia / tecarterapia en modo TÉRMICO, diatermia por onda corta (shortwave) y ultrasonido TÉRMICO (continuo) NO sobre el metal.** El metal y los tejidos vecinos pueden sobrecalentarse de forma no controlada (riesgo de quemadura profunda). La onda corta es **contraindicación tradicional clásica sobre implantes metálicos** (consenso >90%); la tecar/RF térmica sigue la **misma lógica térmica** → evitarla sobre el material (no hay evidencia que la avale sobre metal).
- **Ultrasonido:** el US **refleja ~90%** en el metal y **no lo calienta** como se temía; la evidencia dice que **no está formalmente contraindicado** sobre implantes metálicos. Aun así, en el posoperatorio de cartílago **evitar el US TÉRMICO/continuo** sobre la zona por prudencia (fase inflamatoria, tejido reparado inmaduro); si se usa, preferir **pulsado/atérmico** y nunca como sustituto de la descarga.
- **Implantes ELECTRÓNICOS activos = contraindicación ABSOLUTA** para diatermia/onda corta/microonda/US terapéutico cerca: **marcapasos, desfibrilador (DAI), neuroestimulador, bomba implantable.** Los cables/leads se calientan **mucho más rápido** que un tornillo → riesgo grave. (Ya cubierto por la alerta roja de `seguridadClinica`: marcapaso/desfibrilador/DAI.)
- **Electroterapia (TENS/EMS):** no sobre marcapasos/DAI ni sobre la herida/injerto fresco; en general segura lejos del implante activo.
- **Otras contraindicaciones de agentes físicos a recordar:** **TVP** (no termo/US/masaje sobre la zona), **infección activa**, **malignidad** en la zona, **embarazo** (según agente/zona). Todas ya contempladas en `seguridadClinica`.
- **Mensaje operativo para el fisio:** si el paciente tiene tornillos de OCD, osteotomía maleolar, TTO u osteotomía → **marcar el metal en `seguridadClinica`** y, sobre el material, **nada de calor profundo (RF/tecar térmica/onda corta/US térmico)**. Crioterapia, ejercicio terapéutico, terapia manual y electroanalgesia lejos del implante activo son la base segura.

---

### Fuentes

**Fundacionales (citar por nombre):**
- **Steadman JR, Rodkey WG, Briggs KK.** Microfractura: técnica descrita por Steadman (introducida ~1997–1999); "Microfracture: Its History and Experience of the Developing Surgeon", *Cartilage* 2010;1(2):78–86. [verificar cita exacta]
- **Brittberg M, et al.** Implante de condrocitos autólogos (ACI), primera descripción 1994, *N Engl J Med*. Revisión de actualización: Brittberg, "Clinical articular cartilage repair—an up to date review", *Annals of Joint*.
- **Hangody L, et al.** Mosaicoplastia (autoinjerto osteocondral), Hungría.
- **Ebert JR, et al.** "Clinical Rehabilitation Guidelines for Matrix-Induced Autologous Chondrocyte Implantation on the Tibiofemoral Joint", *JOSPT* 2014;44(2) — consenso Delphi. https://www.jospt.org/doi/10.2519/jospt.2014.5055 ; MACI Rehabilitation Manual (maci.com).
- **Reinold MM, Wilk KE, Macrina LC, Dugas JR, Cain EL.** "Current Concepts in the Rehabilitation Following Articular Cartilage Repair", *JOSPT* 2006;36(10):774–794.
- **Current Concepts for Rehabilitation and Return to Sport After Knee Articular Cartilage Repair in the Athlete**, *JOSPT* 2012;42(3). https://www.jospt.org/doi/10.2519/jospt.2012.3665

**Guías / revisiones recientes (2021–2026):**
- **Knee Pain and Mobility Impairments: Meniscal and Articular Cartilage Lesions, Revision 2018 (JOSPT CPG, APTA)** — progresión escalonada a carga total en 6–8 sem. https://www.jospt.org/doi/10.2519/jospt.2018.0301
- **Rehabilitation and Return to Play Protocols Following Osteochondral Autograft and Allograft Transplantation for Knee Chondral Lesions in Athletic Populations** (revisión 2025–2026). https://pmc.ncbi.nlm.nih.gov/articles/PMC13197494/ · https://link.springer.com/article/10.1007/s12178-026-10033-y
- **Osteochondral Allograft in Professional Athletes: Rehabilitation and Return to Play**, *IJSPT*. https://ijspt.scholasticahq.com/article/22085 · Allahabadi/Cole et al. 2024, *OJSM*. https://doi.org/10.1177/23259671241226738
- **Rehabilitation and Return-to-Play Criteria After Fresh Osteochondral Allograft Transplantation: A Systematic Review**, PubMed 2021. https://pubmed.ncbi.nlm.nih.gov/34377714
- **Enhancing Bone–Cartilage Interface Healing in OAT: BMAC and Rehabilitation** (2025). https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12300502/
- **Deal JB, et al.** "Early vs Delayed Weightbearing After Microfracture of Osteochondral Lesions of the Talus: A Prospective Randomized Trial", 2019/2022. https://pubmed.ncbi.nlm.nih.gov/35097322/
- **Is Early or Delayed Weightbearing Better After Microfracture for OLT? Meta-analysis** (2021). https://www.sciencedirect.com/science/article/abs/pii/S1067251621001630
- **Operative management of osteochondral lesions of the talus: 2024 recommendations (DGOU, working group clinical tissue regeneration)**, *EFORT Open Reviews* 2024;9(3). https://eor.bioscientifica.com/view/journals/eor/9/3/EOR-23-0075.xml
- **Return to Sports After Microfracture for OLT in Skeletally Immature Children** (2024). https://doi.org/10.1177/10711007241241067 · **Return to Play after Microfracture for OLT in Young Elite Athletes**. https://pmc.ncbi.nlm.nih.gov/articles/PMC8702659/ · **OLT current concepts**. https://jassm.org/osteochondral-lesions-of-the-talus-current-concepts/ · **RTS after AMIC for OLT** (2025), *JFAS*. https://www.jfas.org/article/S1067-2516(25)00178-4/fulltext
- **An update on osteochondritis dissecans of the knee** (Orthopedic Reviews). https://orthopedicreviews.openmedicalpublishing.org/article/38829 · **OCD of the knee in adolescents: How to treat them?** https://pmc.ncbi.nlm.nih.gov/articles/PMC9900018/ · **Juvenile Knee OCD**, Mitchell, *Arthroscopy* 2025. https://arthroscopyjournals.onlinelibrary.wiley.com/doi/10.1016/j.arthro.2025.07.021
- **Patellofemoral Cartilage Repair** (*Curr Rev Musculoskelet Med* 2018). https://link.springer.com/article/10.1007/s12178-018-9474-3 · **Comprehensive Patellofemoral Cartilage Restoration: Trochlear OCA, Patellar MACI, and TTO** (2026). https://pmc.ncbi.nlm.nih.gov/articles/PMC13305384/ · **Cartilage Restoration of Patellofemoral Lesions: A Systematic Review**. https://pmc.ncbi.nlm.nih.gov/articles/PMC8808938/
- **Patellofemoral joint contact area increases with knee flexion and weight-bearing** (base biomecánica de la distinción carga vs PF). https://www.sciencedirect.com/science/article/abs/pii/S0736026604001822
- **CPM:** "The Physiologic Basis of CPM for Articular Cartilage Healing and Regeneration" (*ScienceDirect*). https://www.sciencedirect.com/science/article/abs/pii/S0749071221012841 · "CPM following Cartilage Surgery: Does a Common Protocol Exist?" · CPM en modelo de conejo (*Int J Mol Sci* 2019). https://doi.org/10.3390/ijms20020259
- **Ren et al. 2026**, "Long-Term Efficacy of Microfracture + Autologous Collagen-Induced Chondrogenesis: 5-Year RCT", *Orthopaedic Surgery*. https://onlinelibrary.wiley.com/doi/10.1111/os.70226
- **Morphological Assessment of MACI Grafts** (histología de maduración), Beck/Ebert et al. 2021. https://doi.org/10.1177/1947603519890754
- **Agentes físicos / seguridad:** "Electrophysical Agents — Contraindications and Precautions: An Evidence-Based Approach" (*Physiother Can*, PMC3031347). https://pmc.ncbi.nlm.nih.gov/articles/PMC3031347/ · "Can Pulsed Shortwave Diathermy be Used Over Surgically-Implanted Metal?", *IJATT* 2017. · Short Wave Diathermy / Ultrasound Diathermy overviews (ScienceDirect).
- **Protocolos de cirujano consultados** (ejemplos de rangos de carga/ROM; no son guías): OrthoVirginia (Owusu-Akyaw), UVA osteochondral allograft, Hazelwood OATS, Harris OAT/OCA, D'Alessandro accelerated MACI, Gilmer/Redler MACI patelofemoral, MACI Rehabilitation Manual (maci.com), OrthopedicONE.

### Incertidumbres [verificar]

- **Números finos de carga/semanas** de cada procedimiento: tomados de resúmenes de literatura y handouts de cirujano, **no del texto completo** (WebFetch no disponible). Confirmar contra el protocolo del cirujano tratante; hay **gran variabilidad inter-cirujano** documentada (sobre todo OCA: encuesta de 76 cirujanos con rangos muy amplios).
- **Límite exacto de flexión en rodillera para injerto patelofemoral:** se documentó **60°** (protocolo acelerado Ebert/D'Alessandro) y abordajes de "desbloqueo según control de cuádriceps ~sem 7–12"; **no se confirmó** la cifra 0–45° que a veces se cita. Rango de flexión segura = decisión del cirujano según localización/tamaño.
- **Duración óptima de NWB en astrágalo (BMS):** sin consenso; evidencia (Deal 2019, metaanálisis) **no concluyente** entre carga temprana vs. tardía. "6–8 sem estricto" es tradición, no verdad establecida.
- **CPM:** beneficio clínico **no demostrado** en ensayos (evidencia mecanística/animal); dosis exacta (horas/día, semanas) varía por protocolo.
- **Fases de maduración ACI/MACI:** los límites temporales (6 sem / 12 sem / 3–6 m / 9–12 m, remodelado hasta 1–3 años) provienen de manuales de fabricante/clínica, **no de estudios histológicos controlados de curso temporal**. Orientativos.
- **OCD:** evidencia de tiempos de carga/inmovilización mayormente **de bajo nivel**; estable vs. inestable y juvenil vs. adulto cambian todo.
- **Tecar/radiofrecuencia sobre metal:** no hay estudios específicos; la recomendación de **evitar modo térmico sobre el implante** se extrapola de la lógica térmica de la diatermia (bien documentada para onda corta). El ultrasonido NO está formalmente contraindicado sobre metal, pero se recomienda prudencia con el US térmico sobre tejido reparado reciente.
- **Criterios de retorno al deporte:** **no existe batería validada específica de cartílago**; se adapta la de LCA (≥90% LSI fuerza y saltos), reconociendo que el **LSI sobrestima** la función. La **ventana temporal del procedimiento** (sección 5) es el criterio más firme.

---

#### Nota de integración con la app (Clínica Sinergia)
Este documento es análogo a `docs/biblioteca_protocolos.md` (MSK) y `docs/biblioteca_dermatofuncional.md`: material de **referencia/biblioteca**, no prescripción. Encaja con la lógica ya existente de la app: progresión **por criterios** (no calendario), **semáforo del dolor/derrame** como termómetro de sobrecarga, y **seguridad de agentes físicos ligada a `seguridadClinica`/`_soapSeguridadHTML`** (la alerta de metal/osteosíntesis ya existe desde PR #419 — aquí se refuerza: capturar tornillos de OCD / osteotomía maleolar / TTO para que salte la caja roja y no se aplique RF/tecar térmica/onda corta/US térmico sobre el material). Si algún día se arma una pestaña 📋 Protocolo de cartílago, la carga (weight-bearing) y el ROM/flexión por fase serían las dos variables a modelar, con la distinción **zona de carga vs patelofemoral** como eje central.

---

## 🏃 LESIONES DEPORTIVAS DE TEJIDO BLANDO (conservador)

### 1. Lesión de ISQUIOTIBIALES / hamstring strain (conservador)

#### Diagnóstico — pruebas / clasificación
- **BAMIC (British Athletics Muscle Injury Classification):** clasificación por RMN; grados 0–4, y cada grado 1–4 se subdivide en **a** (miofascial/periférico), **b** (unión miotendinosa) y **c** (intratendinoso). Grado 0 = RMN normal o edema difuso sin desgarro. Es el sistema más usado y confiable hoy · (Pollock et al., 2014; revisiones 2022–2023). Ojo: algunas fuentes describen 0–3 y otras 0–4 — **[verificar la escala exacta en Pollock 2014]**.
- **Significado pronóstico del sufijo "c" (intratendinoso):** evidencia MODERADA e inconsistente de que la afectación del tendón intramuscular prolonga el RTP y sube el riesgo de re-lesión · (revisión sistemática JSAMS 2023). Donde difieren: un estudio en fútbol 2022 halló 36 vs 24 días con/sin tendón; otros estudios no hallaron diferencia 2b vs 2c ni efecto sobre re-lesión (Vermeulen; cohortes retrospectivas). → **tratar "c" con más cautela pero NO como timeline fijo.**
- **Palpación / longitud:** mapear longitud y localización del dolor a la palpación (distancia a tuberosidad isquiática = proximal, peor pronóstico); evaluar fuerza y longitud muscular, NO la flexibilidad como factor de riesgo (la CPG lo descarta) · (JOSPT CPG, Martin et al., 2022).
- **Askling H-test:** ver sección 3 (prueba balística de aprensión; criterio final de RTS).

#### Rehabilitación por fases
Síntesis de la vía Aspetar (6 estadios: 3 de fisioterapia + 3 específicos del deporte), la CPG JOSPT 2022 (excéntricos tempranos guiados por dolor + agilidad/estabilización de tronco) y el L-protocol de Askling (extender/diver/glider).

**Fase 1 — Protección / control (días ~0–5 · entrada: lesión aguda):**
- Metas: controlar dolor y edema, recuperar marcha normal, activación indolora.
- Restricciones/precauciones: respetar el dolor; evitar poner el tejido en rango largo bajo tensión dolorosa.
- SÍ: isométricos submáximos INDOLOROS en rango acortado/medio, control lumbopélvico y de tronco, movilidad indolora, caminar; hielo/compresión fase aguda.
- NO: estiramiento agresivo, carrera, contracción máxima dolorosa, trabajo excéntrico en rango largo doloroso.
- Criterios para AVANZAR: marcha indolora, isométricos indoloros, palpación en descenso.

**Fase 2 — Carga progresiva / fuerza (semana ~1–3 · entrada: criterios Fase 1):**
- Metas: progresar concéntrico→excéntrico, introducir rango largo controlado, reintroducir trote.
- Restricciones: dosis que NO deje dolor residual >2/10 al día siguiente; progresar por tolerancia al dolor (CPG JOSPT 2022).
- SÍ: **excéntricos TEMPRANOS guiados por dolor** (recomendación clave JOSPT 2022, Martin et al.); **L-protocol de Askling** — Extender (2×/día, 3×12), Diver (día por medio, 3×6); **agilidad progresiva + estabilización de tronco** (reduce re-lesión, JOSPT 2022); progresión de carrera lineal.
- NO: sprint / velocidad máxima; rango largo que provoque dolor franco.
- Criterios para AVANZAR: déficit de fuerza isométrica <~10–15% vs pierna sana **[umbral clínico común, evidencia limitada]**; trote indoloro; Extender/Diver indoloros.

**Fase 3 — Alta velocidad / específico del deporte (semana ~3+ · entrada: criterios Fase 2):**
- Metas: sprint progresivo a velocidad máxima, cambio de dirección (COD), gestos del deporte.
- Restricciones: no competir hasta superar H-test y pruebas de campo.
- SÍ: **Glider de Askling** (día por medio, 3×4 — el de mayor demanda de frenado excéntrico, va al final); sprint progresivo; COD; **3 sesiones específicas de 30–45 min** a esfuerzo pleno (Aspetar) repartidas en 3–4 días.
- NO: retorno a partido/competición sin criterios objetivos cumplidos.
- Criterios para AVANZAR a retorno: ver abajo.

(Dosis del L-protocol: las fuentes difieren en series/reps — algunos dan Diver 3×6, Glider 3×4; **tratar como punto de partida y verificar contra el protocolo original de Askling** 2013/2014.)

#### Criterios de RETORNO AL DEPORTE (objetivos)
- **Sin dolor, rango completo, fuerza completa, y gestos específicos del deporte completados a máxima velocidad sin dolor** (resumen para paciente de la CPG JOSPT 2022, Martin et al.).
- **Askling H-test sin inseguridad/aprensión** → criterio final asociado a bajo riesgo de re-lesión (pero prolonga la rehabilitación) · (Askling; revisiones de RTS).
- Ponderar con dinamómetro: **fuerza de isquios**, **dolor al momento de la lesión** y **días desde la lesión a RTS** (CPG JOSPT 2022).
- Completar las 3 sesiones específicas a esfuerzo pleno sin dolor durante ni después (Aspetar). Retorno escalonado a partido (p. ej. 1er partido al 50% o 30 min).
- Umbral de fuerza para manejo de carga (NO de alta): un déficit de fuerza isométrica **>14%** (reconfirmado el mismo día) sugiere modificar cargas · (guía Aspetar). **No hay un corte de fuerza validado como test único de alta** (Aspetar).

#### Timeline típico / tasa de re-lesión — para saber si van en tiempo
- **L-protocol (Askling, longitud) vs C-protocol (convencional):** en fútbol, **28 días vs 51 días** a RTS, 0 re-lesiones vs 1 a 12 meses (Askling 2013, RCT, n=75); en velocistas/saltadores, **49 vs 86 días**, 0 vs 2 re-lesiones (Askling 2014, RCT). → el enfoque de carga en rango largo acorta el RTS. Caveat: 2 RCT pequeños del mismo grupo, falta replicación independiente.
- **Por BAMIC en fútbol profesional:** cada grado adicional suma ~**3 días** de RTP (lím. sup. 4) · (cohorte fútbol profesional). Un estudio: grado 2 ≈ 14 días, "c"/intratendinoso ≈ 36–48 días. **El grado NO debe ser el único criterio de alta** (estudio en cricket; revisiones).
- **Re-lesión:** antecedente de lesión previa de isquios es factor de riesgo clave — **+33%** con 1 previa, **~+77%** con 2 previas (Aspetar). La re-lesión suele ser en las primeras semanas tras el retorno.

#### Banderas rojas
- Dolor proximal muy cercano a tuberosidad isquiática + equimosis extensa / "gap" palpable / debilidad marcada → sospechar **avulsión proximal / rotura de tendón libre** (puede ser quirúrgica; la CPG excluye tendones proximal/distal aislados) → derivar.
- Dolor que no cede, parestesias/ciática, dolor nocturno óseo → descartar referido lumbar, tendinopatía proximal o patología ósea.

#### Fuentes
- Martin et al., **Hamstring Strain Injury in Athletes: Clinical Practice Guidelines (ICF)**, JOSPT 2022;52(3):CPG1-44 — jospt.org/doi/10.2519/jospt.2022.0301 y resumen 0501.
- Askling et al., RCT fútbol **BJSM 2013** y velocistas/saltadores **BJSM 2014** (L vs C protocol).
- **The Aspetar Hamstring Injury Rehabilitation Pathway**, JOSPT Open 2026 — jospt.org/doi/10.2519/josptopen.2026.0213.
- Pollock et al., **British Athletics Muscle Injury Classification**, BJSM 2014; revisión intramuscular tendon JSAMS 2023; scoping review RTP fútbol (Tandfonline 2024).

---

### 2. Dolor INGUINAL del deporte / ADUCTORES (pubalgia del deportista) (conservador)

#### Diagnóstico — pruebas / clasificación
- **Acuerdo de Doha (taxonomía clínica):** 3 grandes categorías → (A) **4 entidades definidas**: relacionada con **aductores**, con **iliopsoas**, **inguinal**, y **púbica**; (B) dolor **relacionado con la cadera**; (C) **otras causas**. Reemplaza términos viejos ("tendinopatía del aductor", "osteítis del pubis", "pubalgia") por el formato "-relacionado con" · (Weir/Brukner/Hölmich et al., Doha agreement, BJSM 2015).
- **Aductor-relacionado:** dolor/tenderness en aductores + **dolor en aducción resistida** · (Doha 2015).
- **Iliopsoas-relacionado:** tenderness de iliopsoas + dolor en flexión de cadera resistida y/o en estiramiento del flexor · (Doha 2015).
- **Inguinal-relacionado:** dolor y tenderness en el canal inguinal, SIN hernia inguinal palpable (debe descartarse) · (Doha 2015). (Es lo más cercano a la "hernia del deportista / sports hernia"; si falla conservador puede requerir valoración quirúrgica.)
- **Púbica-relacionado:** tenderness local sobre la sínfisis del pubis y hueso adyacente; sin test de resistencia asignado · (Doha 2015).
- Limitación de Doha: define las entidades pero **no especifica cómo ejecutar los tests ni su reproducibilidad** (crítica posterior; estudios de confiabilidad inter-examinador en curso).
- **Squeeze test** y **test de 5 segundos:** ver sección 3.

#### Rehabilitación por fases
Para lesión **AGUDA de aductor** se usa el protocolo criteria-based de Aspetar/Serner (2 componentes: progresión de ejercicio de ingle + protocolo progresivo de carrera/deporte; 6 fases de manejo). Para dolor **de larga evolución** (LSAGP) el estándar es el programa activo de Hölmich (± Copenhagen).

**Fase 1 — Aguda / control (semana ~1 · entrada: lesión aguda):**
- Metas: controlar dolor, recuperar marcha normal, activación indolora.
- Restricciones: respetar dolor; evitar provocación en estiramiento.
- SÍ: **isométricos de aductor submáximos INDOLOROS**, movilidad, core, bici suave.
- NO: estiramiento provocador del aductor, aducción resistida máxima dolorosa, carrera, Copenhagen de palanca larga.
- Criterios para AVANZAR: palpación en descenso, isométricos indoloros, caminar sin dolor.

**Fase 2 — Carga progresiva (semana ~1–3 · entrada: criterios Fase 1):**
- Metas: fuerza aductora progresiva, reintroducir trote.
- SÍ (ejercicios del programa de Hölmich/Serner): balanceos de pierna, círculos de cadera de pie + aducción, rotación de tronco, "tension arc" con banda elástica, coordinación en una pierna, y **ejercicio de aducción Copenhagen palanca corta→media**. Trabajo de ingle en **días alternos, 3×/semana**. Trote lineal a baja intensidad.
- NO: sprint, COD brusco, Copenhagen palanca larga si es doloroso.
- Criterios para AVANZAR: correr indoloro a intensidad baja-media; progresión del Copenhagen tolerada.

**Fase 3 — Carrera / COD / específico (semana ~3+ · entrada: criterios Fase 2):**
- Metas: carrera de alta intensidad, cambio de dirección, gesto deportivo.
- SÍ: progresión de carrera — **movimientos de carrera indoloros al 30%** → **correr indoloro 15 min hasta 60%+** → sprint y COD progresivos (Aspetar permite progresar la carrera a diario según el atleta); Copenhagen palanca larga; aducción resistida sin dolor.
- NO: partido/competición sin cumplir criterios "clínicamente pain-free".
- Criterios para AVANZAR a retorno (abajo).

**Para LSAGP (larga evolución):** programa activo de **Hölmich** (fuerza estática y dinámica de aductores + abductores + abdominales; progresión por módulos) durante **~8–12 semanas**. El Copenhagen suele dosificarse **2–3 sesiones/semana, ~180–320 reps totales, progresando por síntomas durante ~8 semanas** (revisión sistemática 2026; mayor volumen → mejores resultados). El Hölmich **original EXCLUYE el estiramiento del aductor**; una versión modificada que lo añade reportó RTS posiblemente más rápido (estudio pequeño, Yousefzadeh 2018 — **[tratar como preliminar]**). Cronograma módulo-a-módulo original: **[verificar en Hölmich et al. 1999]**.

#### Criterios de RETORNO AL DEPORTE (objetivos)
- **Criterios "clínicamente pain-free"** antes de pasar a entrenamiento específico supervisado: **palpación del aductor indolora, estiramiento del aductor indoloro, aducción resistida indolora, y test de agilidad específico del deporte indoloro** · (Serner et al., 2020). Lista completa en Apéndice del paper — **[verificar valores exactos]**.
- Restaurar fuerza (varias fuentes citan recuperar simetría de fuerza vs lado sano) + completar al menos **1 sesión completa de entrenamiento con el equipo** · (revisión sistemática RTP 2024–2026).
- Continuum: return to participation → return to play → return to performance.

#### Timeline típico / tasa de re-lesión — para saber si van en tiempo
- **Aductor AGUDO (criteria-based, Serner 2020, cohorte prospectiva):** grados RMN 0–2 → clínicamente sin dolor a **~2 semanas**, retorno a entrenamiento completo a **~3 semanas**; grado 3 (rotura/avulsión) → **~3 meses**. **Re-lesión a 1 año: 8%.**
- **LSAGP (crónico):** retorno LENTO aun con ejercicio — mediana **~18.5 semanas** tras el programa de Hölmich; en un RCT posterior solo **~55% retornó a deporte pleno a ~17 semanas**. → si llevan semanas y no avanzan, es esperable en crónicos, no necesariamente falla del tratamiento.
- Difieren: una fuente de bajo nivel dice "correr a las 6 semanas, retorno ~4 meses" (anecdótico, no fiar).

#### Banderas rojas
- Hernia inguinal palpable, masa, o dolor que aumenta con Valsalva/tos → valoración quirúrgica (descartar hernia verdadera; inguinal-relacionado puede ser "sports hernia").
- Dolor de cadera con bloqueo/chasquido doloroso, pérdida de rango → **cadera-relacionado** (FAI/labrum) → imagen de cadera.
- Dolor óseo nocturno/en reposo, fiebre, pérdida de peso, dolor púbico desproporcionado en adolescente → descartar fractura por estrés/avulsión apofisaria, infección, tumor.

#### Fuentes
- Weir, Brukner, Thorborg, Hölmich et al., **Doha agreement meeting on terminology and definitions in groin pain in athletes**, BJSM 2015 (PubMed 26031643).
- Serner, Weir, Tol, Thorborg, Hölmich et al., **Return to Sport After Criteria-Based Rehabilitation of Acute Adductor Injuries**, OJSM 2020;8(1) (doi 10.1177/2325967119897247); y progresión de fuerza/flexibilidad/palpación JOSPT 2021.
- Hölmich et al., programa activo (Lancet 1999); versión modificada Yousefzadeh et al. 2018 (PMC5867683).
- Revisión sistemática Copenhagen adduction, Apunts 2026; **Aspetar — Acute Adductor Injuries Treatment Protocol** (guía clínica).

---

### 3. Pruebas y evaluación (isquiotibiales y aductores)

**Askling H-test (isquiotibiales — RTS):**
- Qué es: elevación activa de pierna recta en supino (SLR activo) realizada a **máxima velocidad** y en **rango completo**, buscando **inseguridad/aprensión** en el isquio.
- Cómo se usa: criterio FINAL de retorno — se aplica cuando los ejercicios ya son indoloros y hay rango completo; se considera superado cuando NO produce inseguridad (se mide la aprensión, típicamente por EVA). Asociado a **bajo riesgo de re-lesión pero prolonga la rehabilitación** · (Askling; revisiones de RTS). Encarna el principio de Askling de cargar y progresar aun con molestia controlada ("challenging the pain-free rule") en lugar de exigir ausencia total de dolor en todo el proceso.

**Palpación / longitud de isquios:**
- Localizar el punto más doloroso y medir su **distancia a la tuberosidad isquiática** (más proximal / más cercano al isquion = peor pronóstico, mayor tiempo de RTP); documentar longitud del área dolorosa. La **flexibilidad** NO es factor de riesgo según la CPG · (JOSPT CPG 2022). Evaluar fuerza (dinamómetro) y longitud, más medidas específicas del deporte.

**Squeeze test de aductores (ángulos):**
- Posiciones: **0°** (piernas extendidas), **45°** (caderas flexionadas 45°, rodillas flexionadas) y **90°** (caderas y rodillas a 90°). Se aprieta contra el puño/dinamómetro/esfigmomanómetro del examinador.
- **45° es la posición óptima**: genera los **mayores valores de presión** y la **menor variabilidad** (menor SEM/MDC) · (estudio de laboratorio, Delahunt et al., 2011). Confiabilidad intra-examinador alta en los tres ángulos (ICC **0.89 a 0.92**: 0°=0.89, 45°=0.92, 90°=0.90) · (Malliaras/Delahunt, Gaelic games, 2009/2011).
- Interpretación clínica: **positivo = reproduce el dolor familiar de ingle/aductor** durante el apriete (test de provocación). Testar en varios ángulos ayuda a diferenciar: aductor longus más provocativo a **0–45°**, dolor púbico más provocativo a **mayor flexión** · (guía clínica; evidencia limitada).
- Fuerza: aductor con **fuerza isométrica máxima < ~465 N** se asoció a **+72% de probabilidad** de lesión de ingle · (estudio prospectivo; es fuerza isométrica máxima, NO directamente lectura de squeeze → no trasladar el número literal). Un corte citado de "<200 mmHg" con esfigmomanómetro para dolor de ingle de larga evolución NO lo pude verificar — **[tratar con cautela]**.

**Test de 5 segundos (Copenhagen 5-second squeeze / palanca larga):**
- Es un squeeze de palanca larga con componente objetivo de fuerza (sostener ~5 s, medir). Considerado por expertos como **probablemente el abordaje más valioso** para dolor de ingle relacionado con aductor · (comentario clínico IJSPT). ES OPINIÓN: **no encontré datos de confiabilidad/validación específicos del protocolo de 5 s** → marcar como no validado formalmente.

**Prueba de fuerza/dolor para retorno (ambas regiones):**
- Isquios: dinamometría (déficit de fuerza vs lado sano; umbral de manejo de carga >14% Aspetar; umbral de alta clínico común <10%, poco validado) + H-test sin inseguridad.
- Aductores: aducción resistida INDOLORA + squeeze indoloro + recuperar simetría de fuerza + test de agilidad específico indoloro (Serner 2020).

---

### 4. Otras lesiones deportivas (nota breve para añadir después)

**Pantorrilla — gastrocnemio / "tennis leg":** desgarro de la unión miotendinosa del **gastrocnemio medial** (clásico en el deportista de mediana edad, dolor agudo tipo "pedrada" o latigazo en el gemelo). Grado 1 ≈ **1–3 semanas** (media reportada ~17 días), grado 2 ≈ **3–8 semanas** (media ~25 días), grado 3 ≈ **6 semanas–6 meses** (ocasional cirugía). Manejo: fase aguda protección/compresión, luego carga progresiva del tríceps sural con progresión de elevaciones de talón (bilateral→unilateral→pliometría) y retorno a carrera por función. **Criterio de alta por función, no por calendario** (p. ej. elevaciones de talón a una pierna simétricas con el lado sano). Recurrencia frecuente dentro de los **6 meses**. Ojo: el **sóleo** (lesión más insidiosa, dolor con rodilla flexionada) y descartar **TVP** siempre (dolor de pantorrilla + edema). Fuentes: fact sheets SMA; estudios poblacionales de RTP (datos de blogs clínicos → aproximados).

**Cuádriceps / recto femoral:** típico en gesto de pateo/sprint. Desgarro muscular periférico (grado 1) con programa criteria-based ≈ **~6 semanas**. Clave pronóstica: la **afectación del TENDÓN CENTRAL** ("bull's-eye"/diana en RMN) alarga mucho la recuperación (**~27 vs ~9 días** para lesiones periféricas en una serie) y las roturas completas del tendón central pueden requerir **cirugía** con RTS a **2.5–4 meses**; avulsiones proximales a menudo manejo conservador. Progresión de excéntrico + control de cadera/tronco + sprint/pateo graduado. Fuentes: revisión sistemática proximal rectus femoris (PMC10108758); case reports criteria-based (PMC11338860).

**Esguince de LCM/ligamento colateral medial de rodilla:** el LCM cicatriza muy bien en manejo conservador, incluso grado III aislado. Grado I ≈ **1–2 sem** (media ~10.6 días en fútbol americano universitario), grado II ≈ **2–6 sem** (media ~19.5 días; otras fuentes 5–6 sem), grado III aislado ≈ **6–9 sem** (media ~9.2 sem para roturas completas aisladas). Manejo: **rodillera articulada (hinged brace)**, rango de movimiento y carga precoces, fortalecimiento progresivo, retorno por pruebas funcionales (no solo calendario). Derivar/sospechar lesión combinada si hay inestabilidad rotatoria, derrame grande o bloqueo (descartar LCA/menisco). Fuentes: Sports Injury Bulletin; estudios de cohorte en deportistas (números de estudios primarios más fiables que los blogs).

**Síndrome de estrés tibial medial (periostitis / "shin splints"):** dolor difuso en el borde posteromedial de la tibia relacionado con carga. **Primera línea = manejo de carga** (reducir volumen/intensidad/frecuencia de carrera, educación) + **programa de carga gradual** y **fortalecimiento de tríceps sural/pie** (excéntrico, progresando a unilateral y pliometría). Corregir factores de riesgo (caída navicular/pronación, IMC alto, sexo femenino, historia previa, rango de rotación de cadera). **Reentrenamiento de la marcha** (p. ej. subir cadencia ~5–10%, reducir cargas tibiales): **eficaz en PREVENCIÓN** (reducción ~75% de riesgo en reclutas militares a 26 sem) pero con **evidencia de tratamiento aún limitada** (RCT RUNMETRES pendiente). **Ondas de choque (ESWT)** como coadyuvante: evidencia **débil e inconsistente** — "la más prometedora" entre modalidades pasivas, pero un piloto sham-controlado fue negativo; úsala solo como adjunto, no como base. **Bandera roja:** dolor FOCAL puntual (no difuso), dolor nocturno o que empeora → descartar **fractura por estrés tibial** (imagen). Fuentes: StatPearls; revisiones sistemáticas de ESWT (Winters 2013; 2022); protocolo RUNMETRES (PMC11296717).

---

#### Nota de incertidumbre / dónde difieren las fuentes (resumen)
- **BAMIC "b" vs "c":** evidencia mixta sobre si el tendón intramuscular prolonga el RTP (sí en algunos estudios de fútbol/soccer, no en otros). No usar el grado como timeline fijo; mandan los criterios clínicos/funcionales seriados.
- **Dosis del L-protocol de Askling** y **cronograma módulo-a-módulo del Hölmich original:** las cifras exactas varían entre fuentes secundarias → verificar contra los papers originales antes de fijarlas.
- **Umbrales de fuerza de alta** (LSI <10%, squeeze en mmHg): de uso clínico común pero **poco validados** como test único de retorno.
- **Test de 5 segundos / Copenhagen squeeze:** recomendado por opinión experta, sin validación formal publicada que haya encontrado.
- **ESWT en MTSS y versión modificada del Hölmich:** estudios pequeños, baja calidad metodológica → preliminar.
- Limitación de sesión: WebFetch bloqueado; todo proviene de búsqueda web extendida (síntesis de la literatura), no de lectura íntegra de cada PDF primario.

#### Fuentes principales (enlaces)
- Hamstring CPG: [JOSPT 2022.0301](https://www.jospt.org/doi/10.2519/jospt.2022.0301) · [resumen 0501](https://www.jospt.org/doi/10.2519/jospt.2022.0501)
- Aspetar hamstring pathway 2026: [JOSPT Open](https://www.jospt.org/doi/10.2519/josptopen.2026.0213)
- Askling L-protocol RCTs: [BJSM 2014 (velocistas, PDF)](https://aphc.be/Articles/Br%20J%20Sports%20Med-2014-Askling-532-9.pdf) · [rehab y RTS (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6189266/)
- BAMIC: [Radsource grading](https://radsource.us/grading-hamstring-injuries-using-the-british-athletics-muscle-injury-classification-bamic/) · [BAMIC como predictor RTP (ScienceDirect 2022)](https://www.sciencedirect.com/science/article/abs/pii/S1466853X22001225) · [tendón intramuscular RTP (JSAMS 2023)](https://www.jsams.org/article/S1440-2440(23)00423-1/fulltext)
- Doha agreement 2015: [PubMed 26031643](https://pubmed.ncbi.nlm.nih.gov/26031643/) · [PDF](https://pcrmm.org.uk/wp-content/uploads/2021/01/600c68cf66087.pdf)
- Serner criteria-based adductor 2020: [SAGE OJSM](https://journals.sagepub.com/doi/10.1177/2325967119897247) · [repositorio PDF](https://repub.eur.nl/pub/124413/Repub_124413_O-A.pdf) · [progresión fuerza/palpación JOSPT 2021](https://www.jospt.org/doi/10.2519/jospt.2021.9951)
- Hölmich modificado: [PMC5867683](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5867683/) · Copenhagen revisión: [Apunts 2026](https://www.apunts.org/en-the-influence-copenhagen-adduction-exercise-articulo-S2666506926000027)
- Squeeze test 45°: [ScienceDirect (Delahunt 2011)](https://www.sciencedirect.com/science/article/abs/pii/S1356689X11000488) · tests clínicos ingle confiabilidad: [ScienceDirect 2023](https://www.sciencedirect.com/science/article/pii/S1466853X23001554)
- Pantorrilla: [SMA gastrocnemius fact sheet](https://sma.org.au/resources/injury-fact-sheets/gastrocnemius-calf-strain/) · Recto femoral: [revisión sistemática proximal (PMC10108758)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10108758/) · [case report criteria-based (PMC11338860)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11338860/)
- MCL: [Sports Injury Bulletin](https://www.sportsinjurybulletin.com/anatomy/medial-collateral-ligament-strain-back-to-activity) · MTSS: [StatPearls](https://www.ncbi.nlm.nih.gov/sites/books/NBK538479/) · [RUNMETRES protocolo (PMC11296717)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11296717/) · [ESWT revisión (PubMed 23979968)](https://pubmed.ncbi.nlm.nih.gov/23979968/)

---

Observación para la integración en la app: esto encaja con el modelo de `docs/biblioteca_protocolos.md` y `PROTO_LIB` (periodización por criterios, carga como motor, agentes físicos coadyuvantes, semáforo del dolor transversal). Estas 2 condiciones conservadoras (isquios P8, aductor/ingle P9) y las 4 notas breves son candidatas a nuevas entradas de la biblioteca MSK. No escribí ningún archivo (era reporte de investigación).

---
