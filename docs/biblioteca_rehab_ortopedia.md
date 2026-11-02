# Biblioteca de rehabilitación — Ortopedia, traumatología y deporte — Clínica Sinergia
### Protocolos por fases, criterios de retorno y pruebas diagnósticas (evidencia internacional 2021–2026)

Autor clínico de referencia: Carlos Fernando Aranda González. Este documento **NO sustituye el criterio del fisioterapeuta tratante ni la indicación del cirujano**: es un andamio para ubicar en qué fase va el paciente, qué está permitido y qué no, y **si va en tiempo o desfasado**. Es el equivalente ortopédico de `docs/biblioteca_protocolos.md` (MSK/HSR) y `docs/biblioteca_dermatofuncional.md`.

> **Reglas de oro (transversales a todo el documento):**
> - **Progresar por CRITERIOS, no por calendario.** Los tiempos (semanas/meses) son orientativos para detectar desfases; el paso de fase lo da el cumplimiento de metas objetivas (ROM, fuerza/LSI, control, ausencia de derrame/dolor).
> - **En post-quirúrgico manda el cirujano.** Carga, ROM y plazos se verifican contra el protocolo del cirujano tratante; aquí va el rango convencional vs acelerado cuando existe.
> - **La carga (ejercicio terapéutico) es el motor; los agentes físicos son coadyuvantes.**
> - Monitoreo del dolor transversal (semáforo verde/ámbar/rojo, como en la biblioteca MSK).
> - **Descartar banderas rojas SIEMPRE primero** (sobre todo en columna: cauda equina, mielopatía cervical, fractura, cáncer, infección) antes de tratar.

> **Nota de método (honestidad sobre las cifras):** la evidencia se reunió con búsqueda web extendida de guías y consensos 2021–2026 (y fuentes fundacionales citadas por nombre). En el entorno de investigación **el acceso directo a los PDF primarios estuvo bloqueado**, así que varios números finos (grados exactos de ROM, semanas, sensibilidad/especificidad) provienen de resúmenes de las fuentes y están marcados **[verificar]**. Antes de fijar un número como estándar de la clínica, confírmalo contra la fuente primaria citada. Las cifras de pruebas especiales originales suelen venir infladas por el autor de la prueba; se dan rangos y se prioriza el metaanálisis independiente (p. ej. Hegedus 2012 en hombro, Sokal 2022 en rodilla).

### Índice de secciones (orden cabeza → pie)
- **PARTE 0** — Perfil de diagnósticos de la clínica (auditoría 2026-11-02)
- **PARTE 0b** — Seguridad clínica transversal (agentes físicos / implantes)
- **🧍 COLUMNA LUMBAR** — lumbalgia · radiculopatía/ciática · estenosis · espondilólisis · post-qx
- **🦴 COLUMNA CERVICAL Y DORSAL** — cervicalgia · latigazo (WAD) · radiculopatía · cefalea cervicogénica · dorsalgia · hipercifosis · escoliosis
- **💪 HOMBRO** — SLAP · manguito rotador · inestabilidad / Bankart
- **🦾 CODO** — epicondilalgia lateral/medial · post-fractura/luxación · LCU/Tommy John · túnel cubital
- **🖐️ MUÑECA Y MANO** — túnel carpiano · De Quervain · radio distal · escafoides · TFCC · dedo en gatillo · rizartrosis
- **🕺 CADERA** — prótesis (THA) · labrum acetabular / pinzamiento (FAI)
- **🦵 RODILLA** — ligamentos (LCA) y menisco · prótesis (TKA/UKA)
- **🧩 CARTÍLAGO** — lesiones osteocondrales (rodilla y astrágalo)
- **🦶 TOBILLO Y PIE** — esguince lateral · sindesmal · Broström · Aquiles · (pie no traumático: fascitis plantar, tibial posterior, Morton, hallux)
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
- **Lo más voluminoso es COLUMNA** (lumbar + cervical + dorsal ≈ 726) **y MANO/MUÑECA (~227)** → por eso esta versión AÑADE columna lumbar, cervical/dorsal y muñeca/mano a la biblioteca.
- **Rodilla** es el gran bloque articular (menisco + femoropatelar + cartílago + LCA + gonartrosis + ligamentos ≈ **401**).
- **Cadera** como región es grande (~226 de partes blandas + 28 labrum/FAI + 12 coxartrosis).
- **Hombro** ≈ 172 (manguito domina), **tobillo/pie** ≈ 200 (fascitis + Aquiles + esguince), **codo** ≈ 31.
- **Reality-check de lo pedido por Carlos:** *osteocondral/cartílago* **sí es un bloque real (~76)**; *labrum/FAI de cadera* **también (~28)**. En cambio *prótesis de rodilla/cadera* salen **casi en cero por diagnóstico codificado** — eso es **sub-captura, no realidad** (van codificadas por región). La clínica sí los ve; la biblioteca los cubre igual.
- **Hallazgo transversal importante:** **~45% de los expedientes NO tienen un diagnóstico estructurado limpio** (el texto más repetido es *"no cuenta con diagnóstico médico referido"*, 309 veces; ~1,400 con texto que no resuelve a categoría + ~350 vacíos). Esto confirma el pendiente del **formulario de alta (mecanismo/dx que no se capturan)** y es justo lo que la pestaña **📋 Protocolo** (semáforo "qué falta") está para empujar. *La valoración de diagnósticos también es una valoración de la CALIDAD de captura.*

> Fuente del conteo: `claudeGetPacientes` (385 activos) + `claudeGetHistoricos` (3,058) leídos 2026-11-02. Conteo **agregado y anónimo** (sin nombres). El detalle por paciente es PHI y no va al repo; si se quiere, se genera por la conexión y se entrega por canal privado.

---

## PARTE 0b — Seguridad clínica transversal (agentes físicos / implantes)

Vale para TODO post-quirúrgico con material y para cualquier paciente con los flags de `seguridadClinica`. **Ligar siempre con `_soapSeguridadHTML`/`seguridadClinica` de la app** (alerta de metal ya existe, PR #419):
- **Metal / osteosíntesis / prótesis / tornillos / anclas / placas:** **NO** radiofrecuencia, diatermia, **tecarterapia térmica**, ni **ultrasonido térmico** sobre el material. Usar agentes **atérmicos** y **lejos** del implante. (La electroestimulación de superficie — TENS/NMES para activar músculo — es distinta de la diatermia térmica y sí se usa, no directamente sobre el metal con modalidad térmica.)
- **Marcapaso / DAI / neuroestimulador:** NO diatermia/onda corta/RF/tecar ni electroterapia cerca del dispositivo (crítico en columna cervical/dorsal por la cercanía torácica).
- **TVP / TEP:** vigilancia ALTA en inmovilización y post-op de miembro inferior (cadera, rodilla, Aquiles). Pantorrilla dolorosa + edema + calor → descartar TVP (urgencia).
- **Anticoagulación** (frecuente post-op), **embarazo**, **cáncer/oncológico** → precauciones estándar de agentes físicos (ver tamiz de contraindicaciones y la caja de seguridad del expediente).
- **Infección periprotésica / articular:** fiebre + calor/eritema/drenaje → urgencia, suspender y derivar.

---

## 🧍 COLUMNA LUMBAR (lumbalgia, radiculopatía, estenosis, espondilólisis y post-quirúrgico)

> **Qué es esto:** material de REFERENCIA para el fisio. Sirve para ubicar en qué **fase/clasificación** va el paciente, qué **restricciones** aplican, qué **banderas rojas** vigilar y si el paciente **va en tiempo**. NO es prescripción automática ni reemplaza el razonamiento clínico: cada plan se individualiza (edad, deporte/gesto, comorbilidades, seguridad clínica) y la progresión es **por CRITERIOS, no por calendario**. El diagnóstico lumbar es el más frecuente de la clínica (~439 expedientes), por eso se documenta a fondo.
>
> **Relación con la app:** liga con la pestaña 📋 Protocolo (semáforo "qué falta"), con `_soapSeguridadHTML`/`seguridadClinica` (alerta de metal/marcapaso/anticoagulación) y con la biblioteca MSK `docs/biblioteca_protocolos.md` (P6 lumbar HSR). Última revisión de evidencia: 2026-11-02 (guías 2016–2026).

---

### 0. Cómo usar este documento

1. **Triaje primero** (§2): ¿es dolor lumbar común, radicular, o hay sospecha de patología seria?
2. **Descarta banderas rojas SIEMPRE** (§3) — tienen prioridad sobre todo lo demás.
3. Clasifica y estratifica riesgo (§4 amarillas, §5 STarT Back / clasificación por tratamiento).
4. Ubica el **cuadro** (§7–§10) y su **fase por criterios**; usa el **timeline de hitos** para ver si va en tiempo.
5. Revisa **seguridad de agentes físicos** (§11) y captúrala en `seguridadClinica` para que la alerta salte sola.

**Regla de lenguaje (anti-nocebo):** el 90–95% del dolor lumbar NO tiene una lesión estructural identificable que explique los síntomas (Lancet LBP Series 2018). La columna es **fuerte y adaptable**; dolor ≠ daño. Evita frases que asustan e inmovilizan.

| ❌ NO decir | ✅ Mejor decir |
|---|---|
| "Tienes la columna desgastada/degenerada" | "Son cambios normales con la edad, como las canas; aparecen también en gente sin dolor" |
| "Tu columna está inestable/desalineada/fuera de lugar" | "Tu espalda es estable; está sensible y protegida en este episodio" |
| "La hernia te va a dañar más si te mueves" | "El movimiento controlado nutre y ayuda a que mejore; duele pero no daña" |
| "No cargues nada, cuídate" | "Vamos a cargar de forma gradual; evitar todo movimiento alarga la recuperación" |
| "Esto es para toda la vida" | "La mayoría mejora en semanas; puede repetir, y sabrás cómo manejarlo" |

---

### 1. Principios de la rehabilitación lumbar moderna (consenso 2016–2026)

Coinciden NICE NG59, ACP 2017, JOSPT/APTA CPG 2012/2021, WHO 2023 y la serie del Lancet 2018:

- **NO reposo en cama.** Es contraproducente. **Mantenerse activo** y continuar actividades normales dentro de lo tolerable es la primera indicación.
- **Educación + autocuidado** en TODAS las etapas: naturaleza benigna y favorable del cuadro, tranquilizar (sin minimizar), mantener actividad, manejo de recaídas (NICE NG59 rec 1.2.1).
- **Ejercicio graduado** como intervención central (grupal o individual: puede ser biomecánico, aeróbico, mente-cuerpo o combinación; la elección según preferencias y capacidades — NICE NG59 rec 1.2.2). No hay un ejercicio "superior": el mejor es el que el paciente hará.
- **Terapia manual** (manipulación, movilización, masaje) solo **como COADYUVANTE dentro de un paquete que incluye ejercicio** (NICE NG59), nunca sola ni como tratamiento principal.
- **Enfoque biopsicosocial** y estratificado por riesgo: menos es más en bajo riesgo; intensificar en alto riesgo (ACP 2017: empezar por lo no farmacológico; WHO 2023: cuidado holístico, centrado en la persona, no estigmatizante).
- **Agentes físicos electrofísicos NO son el motor** (ver §11): las guías NO respaldan ultrasonido, TENS, interferencial, tracción ni fajas como tratamiento efectivo del dolor lumbar común (NICE NG59 recomienda NO ofrecerlos; WHO 2023 recomendación condicional en contra de US y TENS). **La carga/ejercicio es el motor; los agentes físicos son coadyuvantes de analgesia de corto plazo, nunca sustituto del rehab activo.**

---

### 2. Triaje diagnóstico inicial — 3 grupos (Quebec Task Force / guías)

Toda lumbalgia se clasifica primero en una de tres cajas (recomendado por NICE, ACP, JOSPT):

1. **Dolor lumbar INESPECÍFICO (común)** — ~90–95% de los casos. Sin radiculopatía ni bandera roja. → §7.
2. **Dolor lumbar con componente RADICULAR** (radiculopatía / ciática, estenosis con claudicación neurógena). → §8, §9.
3. **Sospecha de PATOLOGÍA ESPECÍFICA/seria** (banderas rojas: fractura, cáncer, infección, cauda equina, inflamatoria/espondiloartritis, aneurisma). → §3, derivar.

> **Clave:** la mayoría NO necesita imagen ni etiqueta estructural para tratarse bien.

---

### 3. 🚩 BANDERAS ROJAS — patología seria (PRIORIDAD ABSOLUTA)

Son raras pero graves. **Ninguna bandera aislada confirma nada** (muchas tienen bajo valor diagnóstico — Downie et al., *BMJ* 2013); lo que pesa es la **combinación** y el **contexto**. Ante sospecha real: **no trates, deriva.**

#### 3.1 Síndrome de CAUDA EQUINA — URGENCIA QUIRÚRGICA (lo más crítico)
Compresión de las raíces de la cola de caballo. **Es la emergencia que no se puede pasar por alto.**
- **Anestesia en silla de montar** (pérdida/cambio de sensibilidad en periné, genitales, zona perianal, cara interna de muslos).
- **Disfunción vesical**: retención urinaria nueva, dificultad para orinar, incontinencia por rebosamiento, pérdida de la sensación de llenado.
- **Disfunción intestinal**: incontinencia fecal, pérdida del tono/sensación anal.
- **Déficit motor bilateral** o progresivo en piernas; disfunción sexual nueva.
- **La intensidad del dolor NO marca la urgencia** — pueden coexistir con poco dolor.
- **Acción:** derivación HOY a urgencias/neurocirugía para **RM urgente** y descompresión. No esperar, no "segunda cita". El pronóstico empeora cuanto más tarda; la retención completa es el estadio de peor recuperación `[verificar]`.

#### 3.2 FRACTURA vertebral
- Trauma significativo (caída de altura, accidente) — o trauma MENOR en hueso frágil.
- **Uso prolongado de corticoides**; osteoporosis conocida; edad avanzada; mujer posmenopáusica.
- Dolor que aumenta al cargar peso; contusión/abrasión visible tras trauma.
- Prevalencia ~1% en atención primaria (mediana ~3.6% por revisión Cochrane) `[verificar]`. Los indicadores con mayor valor: edad mayor, corticoides prolongados, trauma significativo, contusión — en **combinación** (Downie 2013) `[verificar LRs exactos]`.

#### 3.3 CÁNCER / metástasis
- **Antecedente de cáncer** (es el indicador con más peso).
- Pérdida de peso inexplicada; **dolor nocturno** que no cede en reposo; dolor constante/progresivo que no mejora.
- Edad >50 años; malestar general.
- Prevalencia <1% en primaria (~0.5%). La mayoría de banderas individuales para cáncer tienen poco valor; el antecedente oncológico es la que sí sube la probabilidad (Henschke Cochrane; Downie 2013) `[verificar]`.

#### 3.4 INFECCIÓN (espondilodiscitis, absceso)
- Fiebre, escalofríos, sudores nocturnos.
- Inmunosupresión (diabetes, VIH, fármacos); **uso de drogas IV**; cirugía/procedimiento espinal reciente, catéter, bacteriemia.
- Dolor constante, progresivo, que no cede.

#### 3.5 DÉFICIT NEUROLÓGICO PROGRESIVO
- Debilidad **que empeora** (p. ej. **pie caído/foot drop** por L5), hipoestesia creciente, varios miotomas.
- **Pie caído rápidamente progresivo** = valoración quirúrgica en **días** (idealmente 24–48 h según algunas fuentes) `[verificar ventana exacta]`. Debilidad **estable y leve** generalmente NO es urgencia quirúrgica, pero sí vigilancia y derivación programada.

#### 3.6 ANEURISMA AÓRTICO ABDOMINAL (AAA)
- Varón >65, fumador, hipertenso, ateroesclerosis.
- Dolor lumbar/abdominal profundo, pulsátil, no mecánico (no cambia con postura/movimiento); masa abdominal pulsátil. Dolor súbito e intenso = urgencia vascular.

#### 3.7 Tabla resumen — qué hacer
| Sospecha | Señales clave | Acción |
|---|---|---|
| **Cauda equina** | Silla de montar, retención/incontinencia, déficit bilateral | **Urgencias HOY** (RM urgente) |
| **Déficit progresivo / pie caído** | Debilidad que empeora | Derivación urgente (días) |
| **Fractura** | Trauma, corticoides, osteoporosis, edad | Imagen + derivar |
| **Cáncer** | Antecedente oncológico, dolor nocturno, baja de peso | Derivar para estudio |
| **Infección** | Fiebre, inmunosupresión, drogas IV | Derivar (labs/imagen) |
| **AAA** | Varón mayor fumador, dolor pulsátil no mecánico | Urgencia vascular |

> **Registro en la app:** captura estos hallazgos en `seguridadClinica.banderasRojas` / `banderasDetalle` para que la caja 🛑 salte en el expediente y en el editor de notas.

---

### 4. 🟡 BANDERAS AMARILLAS — predictores psicosociales de cronicidad

Son los **mejores predictores de que un dolor agudo se vuelva crónico y discapacitante** (mejores que los hallazgos de imagen). Identificarlas cambia el abordaje (más educación, exposición gradual, apoyo cognitivo-conductual) — NO son "el paciente exagera".

- **Miedo-evitación** del movimiento/actividad (kinesiofobia): "si me duele me estoy dañando".
- **Catastrofización** (rumiar, magnificar, sentirse indefenso ante el dolor).
- **Creencias dañinas** sobre la espalda ("está dañada", "frágil").
- **Ánimo bajo / depresión / ansiedad**; retraimiento social.
- **Expectativa de que solo lo pasivo funciona** (masaje, aparatos) y baja expectativa de recuperación.
- **Factores laborales**: insatisfacción, baja expectativa de volver al trabajo, conflicto, baja laboral prolongada (los mejores predictores del estatus laboral).

Evidencia: kinesiofobia, creencias de miedo-evitación y catastrofización se asocian a **mayor duración de baja laboral y discapacidad**; depresión/ansiedad predicen discapacidad a largo plazo (revisiones 2010–2022) `[verificar magnitudes]`. El marco "yellow flags" ha sido matizado ("Rethinking yellow flags", 2010): úsalas para dirigir el apoyo, no para etiquetar.

**Herramienta práctica → STarT Back (§5.1).**

---

### 5. Estratificación de riesgo y clasificación por tratamiento

#### 5.1 STarT Back Screening Tool (Keele / Hill et al.)
Cuestionario de **9 ítems** que estratifica en **bajo / medio / alto riesgo** de mala evolución (discapacidad) y asigna cuidado ajustado al riesgo.
- **Puntaje total ≤3 → BAJO riesgo.** Total ≥4 → riesgo elevado; el **subpuntaje psicosocial** (últimos 5 ítems) separa: subpuntaje 0–3 → **MEDIO**; ≥4 → **ALTO** `[verificar corte exacto]`.
- **Vía de cuidado ajustada:**
  - **Bajo:** educación, tranquilizar, mantener activo, autocuidado; mínima intervención.
  - **Medio:** fisioterapia estándar (ejercicio + manual coadyuvante + función).
  - **Alto:** fisioterapia + abordaje de obstáculos psicosociales (cognitivo-conductual, exposición gradual, educación en dolor).
- Valor pronóstico: medio y alto riesgo tuvieron ~130% y ~186% más riesgo de discapacidad al año vs bajo riesgo `[verificar]`. La distribución varía por población (en una cohorte ~59% bajo / 29% medio / 11% alto) `[verificar]`.

#### 5.2 Clasificación basada en tratamiento (Treatment-Based Classification, Delitto 1995; Fritz/Cleland/Childs 2007; revisión Alrwaily/Bise/Delitto 2015–2016)
Agrupa por hallazgos de exploración, no por tiempo. Cuatro categorías; cuando el paciente cae en varias, **prioridad: preferencia direccional → manipulación → estabilización**:

1. **Preferencia direccional / ejercicio específico** (McKenzie/MDT): el movimiento repetido (casi siempre **extensión**) **centraliza** los síntomas. → §6.3.
2. **Manipulación/movilización** (regla de predicción: dolor reciente <16 días, sin síntomas distales a la rodilla, baja creencia de miedo-evitación, hipomovilidad segmentaria, cadera con buena rotación interna) `[verificar ítems]`.
3. **Estabilización / control motor** (regla de Hicks/Fritz: SLR ≥91°, **prueba de inestabilidad en prono +**, **movimientos aberrantes**, edad <40; 3 de 4 → alta probabilidad de responder). → §6.5.
4. **Tracción** (subgrupo pequeño: signos radiculares que NO centralizan). Evidencia débil.

> La TBC es el sistema de clasificación más investigado en fisioterapia, pero la asignación a subgrupos tiene fiabilidad moderada (acuerdo ~77–84%) `[verificar]`. Úsala como mapa, no como dogma.

---

### 6. Evaluación clínica y pruebas

> **Advertencia transversal:** ninguna prueba aislada confirma/descarta por sí sola. Las pruebas neurológicas individuales tienen **sensibilidad limitada**; los **reflejos son más específicos que sensibles** (mejores para "confirmar" que para "descartar"). Interpreta en conjunto (patrón coherente raíz + neurodinamia + síntomas).

#### 6.1 Examen neurológico por raíz (las hernias L4-L5 y L5-S1 son las más frecuentes → evaluar L4–S1)
| Raíz | Motor (debilidad) | Reflejo | Sensibilidad (dermatoma) | Tamiz funcional |
|---|---|---|---|---|
| **L4** | Cuádriceps (extensión de rodilla) + tibial anterior (dorsiflexión de tobillo) | **Rotuliano (patelar)** ↓ | Cara anteromedial de muslo/rodilla → maléolo medial | — |
| **L5** | **Extensor del hallux (EHL)** + dorsiflexión / extensores de dedos; glúteo medio | **No hay reflejo fiable** (algunos usan isquiotibial medial) | Dorso del pie, 1er espacio interdigital, cara lateral de pierna | **Caminar en talones** |
| **S1** | **Flexores plantares (gastrocnemio-sóleo)**; flexión plantar; glúteo mayor | **Aquíleo** ↓ | Planta y borde lateral del pie, talón | **Caminar en puntas** |

- **Pie caído (foot drop)** = debilidad de dorsiflexión → típicamente **L5** (vigilar progresión → §3.5).
- Busca un **patrón dermatomal coherente** con la raíz sospechada; hallazgos dispersos sugieren otra causa.

#### 6.2 Pruebas neurodinámicas (tensión neural)
| Prueba | Qué busca | Sensibilidad | Especificidad |
|---|---|---|---|
| **SLR / Lasègue** (elevar pierna recta, + si reproduce dolor radicular 30–70°) | Compresión raíz L5/S1 (ciática) | **ALTA** (clásico ~0.85–0.91; meta-análisis reciente la baja a <0.80) | **BAJA** (~0.26–0.28) `[verificar]` |
| **SLR CRUZADO** (elevar pierna SANA reproduce dolor en la pierna sintomática) | Hernia significativa con compresión radicular | **BAJA** (~0.25–0.35) | **ALTA** (~0.85–0.90) → si +, muy sugestivo | 
| **Slump test** (sedente, flexión de columna+cuello+rodilla) | Tensión neural lumbosacra | **ALTA** (~0.84, Majlesi 2008) | ~0.83 `[verificar]` |

- **Interpretación práctica:** SLR negativo ayuda a **descartar** radiculopatía (sens alta); SLR **cruzado** positivo ayuda a **confirmar** hernia con compresión (esp alta). El **Slump** es la más sensible para tensión neural.
- Nota: el meta-análisis reciente (2026) concluye que SLR y cruzado tienen **precisión diagnóstica baja** para dolor radicular lumbosacro aislado — úsalos dentro del cuadro clínico, no solos `[verificar]`.

#### 6.3 Centralización / preferencia direccional (McKenzie / MDT)
- **Centralización** = con movimientos repetidos (casi siempre extensión), el dolor **retrocede de la pierna hacia la línea media lumbar**. Es un **signo de BUEN pronóstico** y de que el paciente responderá a ejercicio direccional (asociación consistente con mejor dolor, función, retorno al trabajo y menos uso de servicios — revisiones sistemáticas).
- **Periferalización** (el dolor baja/se irradia más) = evitar esa dirección.
- En radiculopatía discogénica la evidencia específica es más limitada/mixta (vs estabilización), pero la centralización sigue siendo pronóstica. Evaluar preferencia direccional en TODA lumbalgia.

#### 6.4 Pruebas de estenosis lumbar (claudicación neurógena)
| Prueba / signo | Hallazgo | Precisión |
|---|---|---|
| **Prueba de banda sin fin en 2 etapas** (nivel vs 15° inclinación) | Síntomas antes al caminar en plano; más tiempo y mejor tolerancia en inclinación (flexión); recuperación lenta tras plano | Sens ~0.50 (revisión) a ~0.77 (estudio original); **Esp ~0.92–0.95** → buena para confirmar `[verificar]` |
| **Signo del "carrito de súper"** / mejora al inclinarse adelante o sentarse | Alivio en flexión, peor en extensión/bipedestación | Clínico, apoya el dx |
| **Prueba de la bicicleta (Van Gelderen)** | Pedalear inclinado tolera más que caminar erguido (dato clásico para diferenciar de claudicación vascular) | `[verificar sens/esp — no obtenida]` |
| Más útiles combinados | Sin dolor al sentarse, adormecimiento perineal, banda en 2 etapas, Romberg anormal | Ninguno fuerte aislado |

#### 6.5 Control motor / inestabilidad clínica
- **Prueba de inestabilidad en prono (PIT):** sens ~0.61, esp ~0.57 (débil para "diagnosticar" inestabilidad estructural), **pero útil como parte de la regla para predecir respuesta a estabilización** (§5.2). `[verificar]`
- **Movimientos aberrantes** (arco doloroso, "escalada" con las manos sobre los muslos al reincorporarse — Gowers, inversión del ritmo lumbopélvico): componente de la regla de estabilización.
- La **extensión lumbar pasiva (PLET)** es la de reliability/utilidad más consistente en revisión reciente `[verificar]`.
- **Tests de resistencia del tronco** (McGill: puente lateral, flexores, extensores; **Biering-Sørensen** para extensores) sirven de línea base y meta funcional; los cortes de Biering-Sørensen (~<176 s predice riesgo) vienen de población masculina y predicen riesgo futuro, **no** aptitud de alta `[verificar]`.

#### 6.6 Imagen: por qué correlaciona MAL con los síntomas (clave anti-nocebo)
Los hallazgos "degenerativos" en RM son **enormemente frecuentes en personas SIN dolor** (Brinjikji et al., *AJNR* 2015, 3,110 asintomáticos):
- **Degeneración discal:** 37% a los 20 años → 96% a los 80.
- **Abombamiento (bulge) discal:** 30% a los 20 → 84% a los 80. `[verificar cifras exactas de tabla]`
- → Un hallazgo en RM **no es necesariamente la causa del dolor**; muchos son incidentales.

**Cuándo SÍ pedir imagen (guías):** sospecha de bandera roja (cauda equina, fractura, cáncer, infección), déficit neurológico progresivo, o cuando el resultado cambiará el manejo (p. ej. candidato a cirugía). En lumbalgia inespecífica sin banderas: **NO imagen de rutina** (aumenta sobrediagnóstico, cirugía y nocebo, sin mejorar resultados — ACP 2017, NICE NG59, Lancet 2018).

---

### 7. CUADRO A — Lumbalgia INESPECÍFICA (aguda / subacuta / crónica)

**Definiciones de tiempo** (varían): aguda <6 sem · subaguda 6–12 sem · persistente/crónica ≥12 sem (algunos usan agudo <4 sem) `[verificar]`.

**Historia natural (tranquilizar con datos reales):** la mayor mejoría ocurre en las **primeras ~6 semanas**; sigue mejorando hasta ~3 meses y luego se estabiliza. PERO la **recurrencia es común** (~69–73% tiene ≥1 recaída en 12 meses) — por eso se educa en manejo de recaídas y se construye hábito de ejercicio. El paso a dolor crónico persistente es menor pero real (estimaciones 2–56% según definición) `[verificar]`.

#### FASE 1 — Aguda / control de síntomas (criterio: dolor dominante, irritabilidad alta)
- **Metas:** tranquilizar/educar, controlar dolor, **mantener actividad**, prevenir miedo-evitación.
- **✅ SÍ:** educación (naturaleza benigna, dolor≠daño, seguir activo); caminar; movimiento en rango cómodo; preferencia direccional si centraliza; analgesia según médico (NSAIDs/relajante si procede — ACP); manual/termoterapia como **coadyuvante** breve si ayuda a moverse.
- **❌ NO:** reposo en cama; imagen de rutina; lenguaje nocebo; opioides de rutina; reposo/inmovilización prolongada; prometer "cura pasiva".
- **Avance:** dolor e irritabilidad bajan, tolera más actividad.

#### FASE 2 — Subaguda / recuperación activa (criterio: dolor controlado, función limitada)
- **Metas:** restaurar movilidad y control, reintroducir carga, retorno a actividad/trabajo.
- **✅ SÍ:** ejercicio graduado (el que el paciente hará: fuerza, control motor, aeróbico); progresión de carga; exposición gradual a movimientos temidos; abordar banderas amarillas; retorno laboral gradual.
- **❌ NO:** esperar a estar "sin dolor" para moverse; sobre-proteger; centrarse solo en pasivos.
- **Avance:** cumple metas funcionales; confianza en el movimiento.

#### FASE 3 — Crónica / persistente (criterio: ≥12 sem o recurrente/discapacitante)
- **Modelo biopsicosocial** (ACP 2017 y WHO 2023 lo priorizan): ejercicio + educación en neurofisiología del dolor (PNE) + componente cognitivo-conductual.
- **Opciones con mejor evidencia:** ejercicio (cualquiera que se sostenga), **Terapia Funcional Cognitiva (CFT)** — el **RESTORE trial** (*Lancet* 2023, Kent/O'Sullivan) mostró beneficio grande y duradero a 3 años vs cuidado usual (dif. limitación de actividad ~−3.5 a −4.1; dolor ~−1.0 a −1.5) `[verificar]`; rehabilitación multidisciplinar; actividad graduada; mindfulness/yoga/tai chi; terapia manual coadyuvante.
- **❌ NO:** repetir imagen sin indicación; agentes físicos pasivos como tratamiento principal; opioides crónicos.

#### Timeline de hitos — ¿va en tiempo? (lumbalgia inespecífica)
| Momento | Hito esperado | Si NO se cumple → |
|---|---|---|
| 0–2 sem | Dolor empieza a ceder, mantiene actividad básica | Revisar banderas rojas/amarillas; reforzar educación |
| ~6 sem | Mejoría marcada (la mayor parte); vuelve a la mayoría de actividades | **Reevaluar:** banderas amarillas, clasificación, adherencia; intensificar/estratificar (STarT Back) |
| ~12 sem | Función casi normal; hábito de ejercicio | Si persiste/discapacita → vía dolor crónico (biopsicosocial, CFT, multidisciplinar) |

#### Criterios de ALTA / retorno
- Dolor controlado y **no limitante**; recupera actividades/trabajo/deporte objetivo; **autonomía** (programa domiciliario, sabe manejar recaídas); confianza en el movimiento (baja kinesiofobia). El alta no exige "cero dolor".

---

### 8. CUADRO B — Hernia discal lumbar con RADICULOPATÍA / ciática

#### 8.1 Historia natural (muy favorable — tranquilizar)
- **La mayoría mejora SIN cirugía.** La ciática por hernia suele mejorar sustancialmente en **~4–6 semanas** con manejo conservador.
- **Reabsorción espontánea** de la hernia es frecuente: más probable cuanto más **extruido/secuestrado** el fragmento (secuestrado > extrusión amplia > protrusión contenida), y más temprano (reabsorción significativa ≥50% en ~1/3 de pacientes dentro del 1er año) `[verificar]`.
- → El mensaje al paciente: "la hernia tiende a reabsorberse y los síntomas a ceder; el tiempo y el movimiento controlado juegan a favor".

#### 8.2 Manejo conservador por fases
**Base:** educación (pronóstico favorable), **mantener actividad**, ejercicio + preferencia direccional (centralización, §6.3), analgesia según médico, neurodinamia suave. Terapia manual coadyuvante.

- **FASE 1 — Protección relativa / control del dolor radicular** (criterio: dolor de pierna dominante, irritable). Metas: bajar dolor neural, centralizar, mantener movilidad. ✅ Posiciones y movimientos que **centralizan**; caminar; neurodeslizamientos suaves; educación. ❌ Posturas/movimientos que **periferalizan**; reposo prolongado; flexión sostenida provocadora si periferaliza.
- **FASE 2 — Recuperación activa** (criterio: síntomas centralizados, dolor de pierna cede). Metas: restaurar control motor y carga, resistencia del tronco, tolerancia a sedestación/flexión según tolerancia. ✅ Ejercicio progresivo (control motor + fuerza + aeróbico), exposición gradual. 
- **FASE 3 — Reacondicionamiento y retorno** (criterio: sin dolor de pierna, fuerza normalizándose). Metas: fuerza/resistencia completas, patrón de carga (bisagra de cadera), retorno a trabajo/deporte/gesto. En tendón/deportista ver §10 y biblioteca MSK (HSR).

#### Timeline de hitos — ¿va en tiempo? (radiculopatía)
| Momento | Hito esperado | Si NO → |
|---|---|---|
| 0–6 sem | Dolor de pierna **centraliza** y baja; sin déficit progresivo | Vigilar déficit; si debilidad progresiva/pie caído → **derivación urgente** (§3.5) |
| 6–12 sem | Mejoría clara de dolor y función; déficit estable o mejorando | Si dolor radicular invalidante persiste pese a conservador bien hecho → **valorar cirugía** (§8.3) |
| ~12 sem | Retorno a la mayoría de actividades | Persistencia >3 meses se asocia a peor pronóstico con o sin cirugía → no demorar la decisión |

#### 8.3 Cuándo DERIVAR a cirugía (microdiscectomía)
- **URGENTE/emergente:** cauda equina (§3.1) → quirófano; **déficit motor severo o rápidamente progresivo** / pie caído progresivo → valoración en días.
- **Electiva (indicación relativa):** dolor radicular **invalidante que NO mejora** tras **~6–12 semanas** de conservador bien conducido, con hernia concordante en imagen y correlación clínica. La debilidad motora es la indicación más consistente.
- **Evidencia (para contextualizar, no para asustar):**
  - **SPORT** (Weinstein et al., *JAMA* 2006; 501 pacientes, radiculopatía >6 sem + hernia confirmada): cirugía da **alivio del dolor de pierna más rápido**; ambos grupos mejoran y el conservador "alcanza" hacia el año en promedio; mucho cruce (~30% del grupo no quirúrgico pasó a cirugía) `[verificar]`.
  - **Ciática persistente 4–12 meses** (*NEJM* 2020): microdiscectomía superior a cuidado conservador en intensidad de dolor a 6 meses `[verificar]`.
  - Mensaje clínico: operar **acelera** el alivio del dolor de pierna en el subgrupo que no mejora; no "repara" más que el tiempo en quienes iban a mejorar. Pacientes que claramente mejoran NO deben operarse.

#### 8.4 Rehabilitación POST-microdiscectomía
> Protocolos varían por cirujano. Confirma restricciones con el equipo quirúrgico.
- **Inicio de ejercicio:** la evidencia (Cochrane 2003) respalda que **programas de ejercicio que inician a las ~4–6 semanas** mejoran función y retorno al trabajo a corto plazo, sin diferencia a largo plazo vs programas suaves; algunos protocolos inician **ejercicio suave/movilidad inmediato** (mejora movilidad y retorno más temprano) y otros sugieren mejores resultados iniciando ~12 sem — **no hay consenso del momento óptimo** `[verificar]`. Programas **domiciliarios = supervisados** en eficacia.
- **Fases (criterio-dependientes):**
  - **0–4/6 sem (protección):** marcha progresiva, control de dolor, higiene de columna, movilidad neural suave, activación de core de baja carga; evitar flexión repetida/cargada, levantamiento, rotación cargada.
  - **~4–6 sem (fortalecimiento):** estabilización lumbar dinámica (reduce dolor, mejora movilidad y acelera retorno al trabajo); fortalecimiento de extensores; progresión de carga.
  - **Avanzada:** reacondicionamiento, patrón de levantamiento (bisagra de cadera), retorno a trabajo/deporte.
- **Retorno al trabajo:** sedentario ~2 semanas; manual/pesado ~**6–8 semanas**; restricción de levantamiento pesado hasta ~6–8 sem `[verificar]`.

#### 8.5 Rehabilitación POST-FUSIÓN lumbar (artrodesis)
> **MUY dependiente del cirujano, número de niveles y consolidación ósea. Confirma SIEMPRE las restricciones.** Más conservador que la microdiscectomía porque hay que proteger la consolidación.
- **Precauciones BLT** (Bending/Lifting/Twisting — flexionar, levantar, rotar): se restringen típicamente **~6 a 12 semanas** `[verificar por protocolo]`.
- **Fase temprana (≈0–6/12 sem):** caminar + programa domiciliario suave; **levantamiento limitado ~2–4.5 kg (5–10 lb)** `[verificar]`; evitar flexión/rotación cargadas e impacto; conducir cuando esté sin opioides y sin debilidad de pierna (~2–4 sem). Fisioterapia formal suele iniciar **6–12 sem**.
- **Fase media (≈6–12 sem a 3–6 meses):** suben límites de carga gradualmente; se introduce **resistencia ligera ~8–12 sem**; aún se evita levantamiento pesado y rotación forzada; sin correr/saltar/alto impacto hasta ~3 meses `[verificar]`.
- **Fase tardía / retorno:** trabajo pesado **3–6 meses o más** (a veces restricciones permanentes); **recuperación funcional completa 6–12 meses** `[verificar]`.
- Nota: uso de faja, restricción de NSAIDs (por su posible efecto en consolidación) y estimulador óseo dependen del cirujano.

---

### 9. CUADRO C — ESTENOSIS del canal lumbar (claudicación neurógena)

**Cuadro clínico:** adulto mayor; dolor/pesadez/adormecimiento en glúteos y piernas **al caminar o estar de pie (extensión)**, que **alivia al sentarse o inclinarse adelante (flexión)**. Diferenciar de claudicación vascular (ésta alivia solo con detenerse, no con flexión; pulsos; prueba de bicicleta §6.4).

**Evidencia de manejo conservador:** la mejor síntesis (revisión Cochrane actualizada) halló **evidencia de calidad moderada de que un abordaje MULTIMODAL (terapia manual + ejercicio, con o sin educación) es efectivo**, y que los **esteroides epidurales NO son efectivos**; el resto de intervenciones no quirúrgicas tiene evidencia insuficiente. El ejercicio domiciliario prescrito **no superó** a solo consejo/educación en un estudio. El ejercicio **en flexión** y en bici tiene base **teórica** (reduce la lordosis → abre el canal) más que ensayos fuertes `[verificar]`. Las guías igual recomiendan conservador antes de cirugía.

#### Fases por criterios
- **FASE 1 — Alivio sintomático / tolerancia a la marcha** (criterio: claudicación limita caminar). Metas: aumentar distancia de marcha sin síntomas, controlar dolor. ✅ **Ejercicio y posiciones en FLEXIÓN** (flexión lumbar, estiramiento de flexores de cadera/isquiotibiales según tolerancia), **bicicleta estática** (tolera mejor por postura flexionada), marcha con descansos / marcha inclinada (carrito), terapia manual coadyuvante, acondicionamiento aeróbico. ❌ Extensión lumbar sostenida/provocadora; cargas en extensión.
- **FASE 2 — Reacondicionamiento** (criterio: mejor tolerancia). Metas: fuerza de core y miembros inferiores, resistencia aeróbica, control postural (ligera retroversión pélvica funcional). ✅ Fortalecimiento global, progresión de marcha/bici, equilibrio.
- **FASE 3 — Mantenimiento / función** (criterio: función objetivo lograda). Programa domiciliario sostenible; manejo de recaídas.
- **Derivar a valoración quirúrgica (descompresión):** claudicación invalidante que no responde a conservador, o déficit neurológico progresivo; cauda equina = urgencia.

#### Timeline de hitos
| Momento | Hito | Si NO → |
|---|---|---|
| 4–6 sem | Más distancia de marcha, menos claudicación | Revisar adherencia, componente vascular, dx |
| 8–12 sem | Función y marcha claramente mejores | Si invalidante persiste → valoración quirúrgica |

---

### 10. CUADRO D — ESPONDILÓLISIS / ESPONDILOLISTESIS (deportista adolescente)

**Contexto:** causa frecuente de lumbalgia en adolescente deportista (gestos de **extensión + rotación repetida**: gimnasia, clavados, fútbol americano, tenis, danza, vóley). Espondilólisis = defecto de la pars; puede progresar a espondilolistesis (deslizamiento). **La mayoría se maneja sin cirugía y regresa a su deporte.**

**Evidencia:** manejo conservador centrado en rehabilitación; **retorno al deporte promedio ~4–5 meses** (≈4.3–4.6 meses conservador; ~6.7 meses si requiere cirugía) `[verificar]`. **Bracing (ortesis TLSO): evidencia inconsistente** — puede aliviar a corto plazo pero resultados a largo plazo similares con o sin ortesis; no es obligatorio. **Inicio TEMPRANO de fisioterapia (tan pronto como ~6 sem) se asoció a retorno más rápido sin más eventos adversos** `[verificar]`. La curación radiográfica **no** predice fiablemente la recuperación funcional → **mandan los criterios clínicos**.

#### Fases (criterio, no calendario)
- **FASE 1 — Reposo deportivo relativo + control de dolor** (criterio: dolor con extensión). Metas: dolor-free en actividades diarias. ✅ Suspender el gesto provocador (extensión/rotación), control de dolor, iniciar control motor en **posición neutra/antilordótica**, movilidad de cadera/isquiotibiales; (± ortesis según equipo). ❌ Extensión/rotación cargada; volver al deporte con dolor.
- **FASE 2 — Estabilización / control motor** ("isolated → integrated"). Metas: control lumbopélvico, fuerza de core (transverso, multífidos, glúteos), resistencia del tronco en neutro, corregir déficits (flexibilidad de cadera, mecánica). ✅ Progresión de estabilización, cadena posterior, patrón de bisagra de cadera.
- **FASE 3 — Readaptación y retorno al deporte** ("return to sport training"). Metas: tolerar carga deportiva específica sin dolor. ✅ Progresión gradual a gestos deportivos, pliometría/impacto controlado, reintroducción progresiva de extensión según tolerancia.

#### Criterios de RETORNO al deporte
- **Sin dolor** en actividades y en el gesto deportivo; **ROM completo e indoloro** de columna y cadera + ROM específico del deporte; fuerza/resistencia de core adecuadas; progresión deportiva completada sin síntomas. **No se exige curación radiográfica.**

---

### 11. 🛡️ Seguridad de agentes físicos (coadyuvantes) — liga a `seguridadClinica`

> **Recordatorio de jerarquía:** en columna lumbar, **la carga/ejercicio + educación son el tratamiento; los agentes físicos son COADYUVANTES de analgesia a corto plazo.** Las guías (NICE NG59, WHO 2023) **no respaldan** US, TENS, interferencial, tracción ni fajas como tratamiento efectivo del dolor lumbar; úsalos con criterio, limitados, nunca como sustituto del rehab activo ni prolongados. **TENS** puede dar analgesia transitoria a algunos pacientes (razonable como puente para moverse), reconociendo su evidencia limitada.

#### Contraindicaciones / precauciones por agente
| Condición del paciente | NO aplicar / precaución |
|---|---|
| **Marcapaso / DAI (desfibrilador)** | **NO** electroterapia (TENS/EEM/Russian), **NO** diatermia/onda corta, **NO** tecar/radiofrecuencia; precaución con US cerca del dispositivo. Mantener distancia de equipos de onda corta (~3 m) `[verificar]`. |
| **Material de osteosíntesis / fusión / implante metálico** (placas, tornillos, clavos, prótesis, jaula de fusión) | **NO** radiofrecuencia / tecar térmica / onda corta / **US térmico** sobre el material (se sobrecalienta). US a dosis atérmica es el único que suele permitirse sobre metal, con cautela `[verificar]`. Ejercicio y TENS a distancia sí. |
| **Embarazo** | **NO** aplicar electroterapia, onda corta, US ni tecar sobre **abdomen / zona lumbosacra / pelvis**. (TENS en parto es excepción). |
| **Cáncer / tumor** (zona a tratar) | **NO** aplicar energía (US, calor, tecar, electro) **sobre tejido maligno o sospechoso**. El antecedente oncológico pasado no es por sí mismo la contraindicación; lo es tratar la zona del tumor. Ante dolor lumbar + antecedente oncológico → §3.3. |
| **Anticoagulación / trastorno de sangrado / TVP o riesgo** | Precaución con calor profundo/tecar; **TENS** contraindicado si TVP/riesgo de desprender trombo `[verificar]`. |
| **Alteración de la sensibilidad / piel lesionada / infección local** | NO calor/US/electro sobre zona anestésica o con herida/infección. |
| **Epilepsia** | Precaución con estimulación. |

#### Enganche con la app
- Captura implantes, marcapaso, anticoagulación, cáncer, embarazo, etc. en **`seguridadClinica`** (`implantes`/`implantesDetalle`, `condiciones`/`condicionesObs`, `contraindicaciones`, `banderasRojas`) para que **`_soapSeguridadHTML`** dispare la caja 🛑/⚠️ en el expediente y en el editor de notas (patrón ya existente, PR #419). Si el dato vive en texto libre (p. ej. "metal en columna" en antecedentes), **trasládalo a `seguridadClinica`** para que la alerta salte sola.

---

### 12. Fuentes

**Guías fundacionales (citar por nombre):**
- **NICE NG59** — *Low back pain and sciatica in over 16s: assessment and management* (2016; enmiendas 2020 y 2026). https://www.nice.org.uk/guidance/ng59 — mantenerse activo, educación/autocuidado, ejercicio (grupal), terapia manual solo con ejercicio; NO ofrecer tracción, acupuntura, US, PENS, TENS, interferencial, fajas, ortesis. `[2026: amendment y retiro de recomendaciones de terapia psicológica — verificar]`
- **ACP 2017** — Qaseem A, et al. *Noninvasive Treatments for Acute, Subacute, and Chronic Low Back Pain.* *Ann Intern Med* 2017 (M16-2367). https://www.acpjournals.org/doi/10.7326/M16-2367 — no farmacológico primero; crónico: ejercicio, rehab multidisciplinar, MBSR, tai chi, yoga, control motor, TCC.
- **JOSPT / APTA CPG (Academy of Orthopaedic Physical Therapy):** Delitto A, George SZ, et al. *Low Back Pain.* *JOSPT* 2012;42(4):A1-57. doi:10.2519/jospt.2012.42.4.A1 — y **Revisión 2021:** George SZ, et al. *Interventions for the Management of Acute and Chronic Low Back Pain: Revision 2021.* *JOSPT* 2021;51(11):CPG1-CPG60. doi:10.2519/jospt.2021.0304. https://www.jospt.org/doi/10.2519/jospt.2021.0304
- **WHO 2023** — *WHO guideline for non-surgical management of chronic primary low back pain in adults in primary and community care settings* (dic 2023). https://www.ncbi.nlm.nih.gov/books/NBK599210/ — educación, actividad, biopsicosocial; recomendación condicional EN CONTRA de US, TENS, fajas, relajantes.
- **Serie Lancet Low Back Pain 2018:** Hartvigsen J, et al. *What low back pain is and why we need to pay attention* (PIIS0140-6736(18)30480-X); Foster NE, et al. *Prevention and treatment of low back pain* (PMID 29573872); Buchbinder R, et al. *Low back pain: a call for action* (PMID 29573871).

**Estratificación y clasificación:**
- **STarT Back** — Hill JC, et al. (Keele); ECA en *Lancet* 2011 (PMC3208163). https://pmc.ncbi.nlm.nih.gov/articles/PMC3208163/
- **Clasificación basada en tratamiento (TBC)** — Delitto A, et al. 1995; Fritz JM, Cleland JA, Childs JD. *Subgrouping Patients With Low Back Pain.* *JOSPT* 2007. https://www.jospt.org/doi/pdf/10.2519/jospt.2007.2498 ; revisión Alrwaily/Bise/Delitto 2015–2016.

**Dolor crónico / enfoque biopsicosocial:**
- **RESTORE trial** — Kent P, O'Sullivan P, et al. *Cognitive functional therapy … (RESTORE).* *Lancet* 2023. doi:10.1016/S0140-6736(23)00441-5; seguimiento a 3 años 2025. https://www.medscape.com/viewarticle/cognitive-functional-therapy-offers-sustained-relief-chronic-2025a1000ldo
- CFT (marco) — Vibe Fersum/O'Sullivan; *Phys Ther* 2018 (ptj/98/5/408).

**Banderas rojas e imagen:**
- **Downie A, et al.** *Red flags to screen for malignancy and fracture in patients with low back pain: systematic review.* *BMJ* 2013 (PMID 24335669 / PMC3898572). https://pubmed.ncbi.nlm.nih.gov/24335669/
- **Henschke N, et al.** Cochrane — red flags for malignancy (CD008686).
- Revisión actualizada de banderas para fractura vertebral (2023, PMC10448864).
- **Brinjikji W, et al.** *Systematic Literature Review of Imaging Features of Spinal Degeneration in Asymptomatic Populations.* *AJNR* 2015;36(4):811. https://www.ajnr.org/content/36/4/811

**Radiculopatía / hernia / cirugía:**
- **SPORT** — Weinstein JN, et al. *Surgical vs Nonoperative Treatment for Lumbar Disk Herniation (SPORT).* *JAMA* 2006. https://jamanetwork.com/journals/jama/fullarticle/204281
- **Ciática 4–12 meses** — *Surgery versus Conservative Care for Persistent Sciatica Lasting 4 to 12 Months.* *NEJM* 2020. https://www.nejm.org/doi/full/10.1056/NEJMoa1912658
- Reabsorción discal — revisiones narrativas 2024–2025 (MDPI 2673-4087/7/2/30; PMC12890389).
- **Rehab post-discectomía** — Cochrane 2003 (*Rehabilitation following first-time lumbar disc surgery*, PMID 12567020); síntesis de 55 ECA / 4,311 pacientes 2025 (S2772529425000578); metanálisis timing 2024 (PMC11084320) `[verificar]`.

**Pruebas clínicas:**
- SLR / Slump — Majlesi J, et al. *The Sensitivity and Specificity of the Slump and the SLR Tests in Patients With Lumbar Disc Herniation.* 2008 (PMID 18391677). Metanálisis SLR 2026 (S2468781226001827) `[verificar]`.
- Banda sin fin 2 etapas — Fritz JM, et al. 1997; revisión De Schepper et al. 2013 `[verificar]`.
- Inestabilidad / control motor — Hicks GE, Fritz JM, et al. (regla de estabilización); revisión JOSPT 2011 (10.2519/jospt.2011.3457); scoping review 2025 (PMC12550962).
- Examen por raíz — StatPearls / Stanford Medicine 25 / BPAC.

**Estenosis y espondilólisis:**
- Estenosis — revisión Cochrane de tratamiento no quirúrgico de claudicación neurógena (PMID 35046008 / 23996271).
- Espondilólisis adolescente — revisiones en *Clin Sports Med* / *Phys Med Rehabil* (S1040738320300216; 10.1007/s40141-026-00544-7); revisión sistemática de retorno al deporte (S1466853X18303456) `[verificar tiempos]`.

**Agentes físicos:**
- Contraindicaciones de onda corta/US/TENS — electrotherapy.org; revisiones de contraindicaciones de diatermia; guías de NMES/TENS `[verificar: fuentes secundarias]`.

---

### 13. Incertidumbres [verificar]

Números a confirmar contra la fuente primaria antes de fijarlos como estándar de la clínica (metodología en la «Nota de método» del inicio):

1. **NICE NG59 — enmienda 2026** (retiro de recomendaciones de terapia psicológica, enfoque estratificado por riesgo): proviene de un resumen de búsqueda; contrasta con que ACP/WHO/Lancet respaldan el modelo biopsicosocial para dolor crónico. **Verificar el texto vigente en nice.org.uk/guidance/ng59** antes de citar el retiro como definitivo.
2. **Cortes exactos de STarT Back** (≤3 bajo; subpuntaje ≥4 alto) y sus odds de discapacidad.
3. **Sens/esp finas de SLR, SLR cruzado, Slump** (varían mucho entre estudios; el metanálisis 2026 baja la precisión del SLR). Rango dado, no valor único.
4. **Banda sin fin 2 etapas** (sens ~0.50–0.77, esp ~0.92–0.95) y **bicicleta/stoop test** (no obtuve sens/esp).
5. **Likelihood ratios de banderas rojas de Downie 2013**; prevalencias de fractura/cáncer citadas por rango.
6. **Cifras exactas de Brinjikji** por década (degeneración 37→96%, bulge 30→84%).
7. **Timings post-microdiscectomía y post-fusión** (semanas, kg/lb de levantamiento, BLT 6–12 sem): **altamente dependientes de cirujano/protocolo**; confirmar con el equipo quirúrgico de cada paciente. Conversiones lb→kg aproximadas.
8. **Tiempos de retorno al deporte en espondilólisis** (~4–5 meses) y utilidad real del bracing: evidencia mayormente de estudios narrativos/retrospectivos, sin ECA fuertes.
9. **Efecto del RESTORE** a 3 años (cifras de 2025, no del paper primario 2023).
10. **Ventana quirúrgica del pie caído** (24–48 h vs días): de fuentes secundarias; verificar contra guía NASS o documento L&I.
11. **Contraindicaciones de agentes físicos:** varias fuentes son secundarias/vendedores; confirmar con el manual del fabricante del equipo y guía vigente (distancia de 3 m para onda corta, US atérmico sobre metal, TENS y trombosis).

---

## 🦴 COLUMNA CERVICAL Y DORSAL/TORÁCICA (cervicalgia, latigazo, radiculopatía, cefalea, dorsalgia, escoliosis)

> **Propósito y alcance.** Material de **referencia** para el equipo de fisioterapia (Clínica Sinergia). Sintetiza la mejor evidencia internacional 2015-2026 (guías fundacionales citadas por nombre). **NO es prescripción automática:** cada plan se individualiza por paciente, se razona por **criterios clínicos** (no por calendario) y se contrasta con `seguridadClinica` del expediente. Los números finos van marcados **[verificar]** contra la fuente primaria antes de usarlos en una decisión. La regla de oro: **primero descartar banderas rojas, después tratar.**

---

### 0. Principios transversales (aplican a TODO el documento)

> **Aplican las reglas de oro del inicio del documento** (progresar por criterios > calendario · la carga/ejercicio es el motor · semáforo del dolor · banderas rojas primero). Lo **específico de cuello y dorsal**:

- **En cuello crónico el motor es la FUERZA** cérvico-escápulo-torácica y de MMSS (la evidencia más sólida — Cochrane, Gross 2015); los agentes físicos son coadyuvantes.
- **No collarín prolongado ni inmovilización rutinaria:** el collarín blando prolongado **empeora** el pronóstico en cervicalgia y latigazo. Mantenerse activo, tranquilizar y recuperar movimiento temprano.
- **Monitoreo del dolor:** en cuadros radiculares, vigilar **centralización vs. periferización** (el síntoma que "sube" hacia la columna = buena señal; el que "baja" por el brazo = mala) y la **respuesta a 24 h**.
- **Seguridad primero:** antes de manipular/traccionar columna cervical, **descartar banderas vasculares y mielopatía** (§1-§2); respetar implantes/metal, marcapaso, embarazo, anticoagulación, cáncer (`seguridadClinica`, §8/§11).

---

### 1. BANDERAS ROJAS CRÍTICAS (cribado obligatorio antes de tratar)

#### 1.1 Mielopatía cervical (mielopatía espondilótica / degenerativa cervical, DCM) — **la más importante en cuello**
Compresión de la médula espinal. **Es la bandera roja que más se escapa en fisioterapia** y una **contraindicación a la manipulación y a la tracción cervical**.

**Síntomas de sospecha:**
- **Torpeza/pérdida de destreza de manos** (abrochar botones, escribir, soltar objetos).
- **Alteración de la marcha y el equilibrio** (marcha "a lo ebrio", caídas, ensanchar la base).
- Parestesias difusas en manos/pies, a veces bilaterales; signo de Lhermitte.
- En fases avanzadas: alteración esfinteriana (urgencia/retención) — **urgente**.

**Signos a buscar (sens/esp aproximadas — reportes muy variables [verificar]):**
| Signo | Sensibilidad | Especificidad |
|---|---|---|
| Alteración de la marcha | ~91% | moderada |
| Hiperreflexia | ~85% | moderada |
| Signo de Hoffmann | ~31-89% (meta: ~83-89%) | ~41-100% |
| Signo de Babinski | ~7-36% | ~93-100% (muy específico) |
| Clonus / marcha en tándem | ~66% | ~84% |

> **Lectura:** Babinski y clonus son **muy específicos** (positivo = fuerte sospecha) pero poco sensibles (negativo NO descarta). La **marcha** y la **hiperreflexia** son lo más sensible. Un **clúster** (desviación de marcha + Hoffmann + supinador invertido + Babinski + edad >45 años) es útil para apoyar el diagnóstico (Cook et al.).

**Conducta:** sospecha razonable → **derivar a valoración neuro-quirúrgica / RM**, **NO manipular, NO traccionar, NO forzar extensión cervical**. Ejercicio suave de control y educación mientras se deriva; marcarlo en `seguridadClinica`.

#### 1.2 Patología vascular del cuello (disección de arteria cervical / insuficiencia vertebrobasilar)
**Marco de referencia:** *IFOMPT International Framework* (2020, publicado en JOSPT 2022, Rushton et al.). Reemplazó el término "disfunción arterial cervical (CAD)" por **"patologías vasculares del cuello"**. Es **informativo, no prescriptivo**: obliga a razonamiento clínico antes de cualquier terapia manual/tracción cervical.

**Las "5 D y 3 N" (signos clásicos):** *Dizziness* (mareo/vértigo), *Diplopía*, *Disartria*, *Disfagia*, *Drop attacks* (caídas súbitas sin pérdida de conciencia) + *Nistagmo*, *Náusea*, *Nedacciones/entumecimiento facial* (adormecimiento perioral). **Advertencia del marco:** estos signos suelen ser **tardíos y poco específicos**; no esperar a tenerlos todos.
- Pista temprana de disección: **cefalea/cervicalgia nueva, intensa, inusual** ("la peor de mi vida", en latigazo o tras trauma menor), a veces con Horner.
- El **mareo** aparece en una proporción relevante de disecciones vertebrales/carotídeas [verificar % exacto].
- **Mareo cervicogénico vs. vascular:** el vascular aparece con la **rotación/extensión** mantenida y **no mejora** con movimiento repetido; se acompaña de otras D/N. Ante duda → derivar.

**Conducta:** sospecha de disección/evento vascular en curso → **urgencia médica**, no manipular/traccionar. El marco **ya no recomienda** las pruebas pre-manipulativas de posición sostenida (rotación-extensión) por su pobre valor predictivo; el cribado es por **historia + factores de riesgo + examen neurológico**, no por una maniobra provocadora.

#### 1.3 Fractura / inestabilidad cervical
- **Trauma:** usar reglas de decisión validadas para decidir imagen: **Canadian C-Spine Rule** (Stiell) — sensibilidad ~**99%** (90-100%), especificidad baja (~1-77%) [verificar]; y **NEXUS** (Hoffman) — sensibilidad ~**90%** (83-100%), especificidad menor. Ambas son muy sensibles (un negativo bien aplicado descarta lesión clínicamente importante). Ante mecanismo de alto riesgo, déficit neurológico o dolor axial intenso post-trauma → **inmovilizar y derivar** (equivale a WAD grado IV, ver §4).
- **Artritis reumatoide con subluxación atlanto-axoidea (C1-C2):** riesgo de inestabilidad y compresión medular. En AR de larga evolución, **NO manipular cuello**; cautela con la flexión cervical forzada; buscar signos mielopáticos. Marcar en `seguridadClinica`.
- Otras: Down, espondilitis anquilosante, post-radioterapia cervical, osteoporosis severa.

#### 1.4 Cáncer / infección / dolor no mecánico (cervical y dorsal)
Sospechar ante: dolor **nocturno que no cede con el reposo ni la postura**, **pérdida de peso no explicada**, antecedente de **cáncer**, **fiebre/escalofríos** o factores de riesgo de infección (inmunosupresión, uso de drogas IV), dolor **progresivo no mecánico** (no modula con movimiento), síntomas constitucionales, edad de inicio atípica. → **Derivar** para estudio.

#### 1.5 Banderas rojas específicas de columna DORSAL/TORÁCICA
La región torácica es **zona de referencia de dolor visceral**: ante dolor dorsal atípico, descartar primero causa no músculo-esquelética.
- **Cardíaco:** dolor precordial/interescapular con esfuerzo, irradiación a brazo izquierdo/mandíbula, disnea, sudoración → **urgencia**.
- **Aórtico (disección/aneurisma):** dolor "desgarrante" súbito, interescapular, con compromiso hemodinámico → **urgencia**.
- **Pulmonar/pleural:** dolor pleurítico (aumenta con la inspiración), disnea, tos, hemoptisis (TEP, neumotórax, neumonía).
- **Gastrointestinal:** esofágico, biliar (refiere a escápula derecha), pancreático (dorso), úlcera.
- **Herpes zóster:** dolor en banda dermatómica antes de la erupción.
- **Fractura por compresión osteoporótica** (ver §6.4): dolor dorsal agudo en mujer posmenopáusica/adulto mayor, a veces tras esfuerzo trivial; dificultad para acostarse en decúbito supino o sentarse en silla dura; pérdida de talla/cifosis progresiva. Buscar también malignidad si hay banderas de §1.4.

---

### 2. Evaluación y pruebas clínicas (con sensibilidad/especificidad)

> **Principio:** ninguna prueba aislada confirma o descarta; se razona en **clústeres** y a la luz de la historia. Pruebas **específicas** (esp. alta) ayudan a **confirmar** (regla "SpPin"); pruebas **sensibles** (sens. alta) ayudan a **descartar** (regla "SnNout").

#### 2.1 Radiculopatía cervical — Clúster de Wainner (Wainner et al. 2003)
Cuatro componentes: **(1)** rotación cervical activa hacia el lado sintomático **< 60°**, **(2)** **Spurling** positivo, **(3)** **distracción cervical** positiva, **(4)** **ULTT-A** (sesgo mediano) positivo.

| Prueba / combinación | Sensibilidad | Especificidad | +LR |
|---|---|---|---|
| **Spurling** (compresión + extensión/inclinación al lado sintomático, reproduce dolor radicular) | ~**30-50%** (baja) | ~**83-93%** (alta) | — |
| **Distracción cervical** (alivia el dolor radicular al traccionar) | ~44% | ~90% | — |
| **ULTT-A / test de Elvey** (tensión neural MMSS, sesgo mediano) | ~**97%** (alta) | ~22% (baja) | — |
| Rotación hacia el lado < 60° | ~89% | ~49% | — |
| **Clúster 3 de 4 positivos** | ~0.39 | ~0.94 | ~6.1 |
| **Clúster 4 de 4 positivos** | ~0.24 | ~0.99 | ~30 (prob. post-test ~90%) |

> **Lectura clínica:** el **Spurling** es muy útil para **confirmar** (positivo pesa mucho; negativo no descarta). El **ULTT-A** es muy útil para **descartar** (negativo hace improbable la radiculopatía). 3-4 pruebas positivas elevan mucho la probabilidad. Números varían según fuente → **[verificar]** contra Wainner 2003.

#### 2.2 Cefalea cervicogénica — Test de flexión-rotación cervical (CFRT; Hall & Robinson)
Paciente en supino, columna en **flexión máxima** (bloquea C2-C7 y aísla C1-C2), se rota la cabeza a cada lado.
- **Normal:** ~**40-44°** por lado. **Positivo:** rotación **< 32°** hacia el lado restringido, o reproducción del dolor conocido.
- **Precisión reportada (un estudio principal):** sensibilidad ~**91%**, especificidad ~**90%** [verificar]; otros reportan ~90%/88% en examinadores expertos.
- **Advertencia (perspectiva 2023):** su valor puede estar **sobreestimado**; quizá sea mejor **modificador del efecto del tratamiento** que prueba diagnóstica pura de C1-C2 (patrón oro = bloqueo zigapofisario). La técnica importa: **si no hay flexión completa, no se aísla C1-C2**.

#### 2.3 Flexores profundos del cuello — Test de flexión craneocervical (CCFT; Jull, Falla, O'Leary)
Prueba de **control motor y resistencia** de los flexores cervicales profundos (longus colli/capitis) con biofeedback de presión (manguito a 20 mmHg, incrementos de 2 mmHg hasta 30). Los pacientes con dolor de cuello/latigazo muestran **menor activación profunda y sobreactividad compensatoria del ECM/superficiales**. Guía el entrenamiento de control motor (base del tratamiento en cervicalgia con alteración de coordinación y en cefalea cervicogénica).

#### 2.4 Mielopatía cervical
Hoffmann, Babinski, clonus, hiperreflexia, marcha en tándem, supinador invertido, Romberg (ver tabla §1.1). Son **signos de cribado de bandera roja**, no de tratamiento fisioterapéutico.

#### 2.5 Escoliosis — Cribado
- **Test de Adams (flexión anterior del tronco):** evidencia la **giba** (rotación vertebral); prueba de tamizaje más sensible que el escoliómetro pero con tasa de derivación variable.
- **Escoliómetro (ángulo de rotación del tronco, ATR):** umbral habitual de derivación **≥ 7°** (correlaciona ~**20°** de Cobb) [verificar]; umbral más bajo (5-6°) en niños con sobrepeso/obesidad (la grasa enmascara la giba). La radiografía con **ángulo de Cobb** es el estándar diagnóstico y de seguimiento (error de medición ±3-5° — un cambio < 5° puede ser ruido de medición).

---

### Región CERVICAL
### 3. Cervicalgia mecánica inespecífica y clasificación por el *Neck Pain CPG* (Blanpied et al. 2017, JOSPT)

El *Neck Pain Clinical Practice Guideline* (revisión 2017, JOSPT 47(7):A1-A83) clasifica el dolor de cuello en **4 categorías** ligadas a la CIF, cruzadas por **agudeza** (agudo/subagudo/crónico). Cada categoría tiene intervenciones emparejadas. **La cervicalgia mecánica inespecífica cae casi siempre en la categoría 1 o 2.**

#### 3.1 Cuello con DÉFICIT DE MOVILIDAD
Dolor localizado, limitación de ROM, patrón mecánico, sin signos radiculares ni rojos.
- **Qué SÍ:** **terapia manual cervical Y torácica** (movilización/manipulación — con cribado de seguridad §1) + **ejercicio de movilidad y fortalecimiento cérvico-escápulo-torácico**; educación para mantenerse activo. En agudo, manipulación/movilización torácica + ejercicio es razonable.
- **Qué NO:** reposo, collarín, pasividad total, apoyarse solo en agentes físicos.
- **Enfoque por fases/criterios:**
  - **Fase 1 (irritabilidad alta):** metas = control del dolor, restaurar movimiento indoloro, educación. SÍ: movilización suave, ROM activo en rango tolerable, isométricos suaves, termoterapia/TENS como coadyuvante. NO: estiramiento agresivo, cargas altas. **Criterio de avance:** dolor en reposo controlado y ROM funcional en aumento sin recaída a 24 h.
  - **Fase 2 (control motor y carga):** metas = **CCFT/flexores profundos**, resistencia escapular, normalizar ROM. SÍ: entrenamiento de resistencia de flexores profundos, fortalecimiento progresivo, terapia manual según respuesta. **Criterio de avance:** control motor adecuado, fuerza/resistencia que tolera actividad diaria.
  - **Fase 3 (fuerza y función):** fortalecimiento cérvico-escápulo-torácico y de MMSS con carga creciente, gesto laboral/deportivo, ergonomía. **Alta:** dolor mínimo/ausente, ROM y fuerza funcionales, autogestión con programa domiciliario, retorno a actividad.
- **Hitos orientativos:** la mayoría de las cervicalgias agudas mejoran en **semanas**; si no hay progreso a ~6 semanas, reevaluar clasificación y banderas.

#### 3.2 Cuello con ALTERACIONES DEL CONTROL MOTOR Y LA COORDINACIÓN (incluye WAD — latigazo; ver §4)
Dolor con pobre control cérvico-escapular, hipersensibilidad, a veces mareo cervicogénico; típico tras latigazo.
- **Qué SÍ:** **educación y tranquilización** (recuperación esperada, mantenerse activo, volver a la actividad normal), **ejercicio de coordinación/control motor** (flexores profundos — CCFT), **fortalecimiento**; en crónico, abordaje **multimodal** (manual + ejercicio ± TENS), y educación en dolor.
- **Qué NO:** collarín/inmovilización, reposo, mensajes alarmistas (empeoran el pronóstico), sobre-estudiar con imagen en ausencia de banderas.
- **Fases/criterios:** igual estructura que §3.1 pero con **mayor peso en control motor, exposición gradual al movimiento y manejo de la hipersensibilidad/factores psicosociales**. Avanzar según tolerancia y control, no por tiempo.

#### 3.3 Cuello con CEFALEA (cervicogénica) → ver §5

#### 3.4 Cuello con DOLOR RADIANTE (radicular) → ver §4 (radiculopatía)

> **Ejercicio para cervicalgia — qué dice Cochrane (Gross et al. 2015, CD004250):** evidencia de **calidad moderada** a favor del **fortalecimiento** cérvico-escápulo-torácico y de MMSS (mejoría de dolor moderada-grande a corto plazo); la **resistencia aislada** da efecto leve; **estiramiento o resistencia como única intervención** tienen efecto mínimo. **Combinar fuerza + resistencia/estiramiento** es beneficioso. **La dosis óptima es desconocida** (JOSPT 2020: aumentar volumen en clínica no mejora claramente el resultado) → dosificar por tolerancia y progresión.

---

### 4. Latigazo cervical / Whiplash-Associated Disorders (WAD)

#### 4.1 Clasificación de la Quebec Task Force (Spitzer 1995)
| Grado | Hallazgos |
|---|---|
| **0** | Sin queja cervical, sin signos físicos |
| **I** | Dolor/rigidez cervical, **sin signos físicos** |
| **II** | Dolor cervical **+ signos músculo-esqueléticos** (↓ROM, puntos dolorosos) |
| **III** | Dolor cervical **+ signos neurológicos** (reflejos ↓, debilidad, déficit sensitivo) |
| **IV** | Dolor cervical **+ fractura o luxación** → **urgencia, inmovilizar y derivar** |

En WAD IV (y sospecha de fractura) aplicar reglas de trauma (**Canadian C-Spine Rule / NEXUS**, §1.3).

#### 4.2 Manejo (grados I-III): **activo y temprano**
- **Qué SÍ (base de la evidencia):** **educación + tranquilización** (recuperación esperada favorable, "act as usual"), **mantenerse activo**, **ejercicio cervical específico** y de **coordinación/control motor** (flexores profundos), **ejercicio para el mareo** si lo hay, analgesia simple. En crónico: multimodal, ejercicio + manejo de factores psicológicos.
- **Qué NO:** **collarín/inmovilización** (empeora), reposo prolongado, mensajes catastrofistas. (El *Neck Pain CPG* ubica el WAD en la categoría de "alteración del control motor/coordinación".)
- *Guías de referencia:* **TRACsa/Australia** (originalmente 2008; actualización SIRA 4ª ed. en proceso 2023 [verificar estado final]) — recomienda como más efectivos en agudo: **educación + ejercicio específico de cuello y de mareo + analgesia simple**; menor consenso sobre fisioterapia multimodal, inmovilización y fármacos neuromoduladores.

#### 4.3 Pronóstico y evitar la cronificación
- **Curso natural (Sterling, JOSPT 2016):** ~**50%** se recupera, ~**25%** queda con dolor/discapacidad **moderada-grave persistente**, ~**25%** con molestias leves [verificar].
- **Regla de predicción clínica WhipPredict (Ritchie, Sterling et al. 2013, *Pain*):** combina **Neck Disability Index (NDI)**, **síntomas de hiperexcitación (hyperarousal)** y **edad**.
  - **Mayor riesgo de discapacidad crónica mod/grave:** edad **≥ 35 años**, **NDI ≥ 40%**, presencia de hiperexcitación (> 6 en subescala PDS) [verificar cortes].
  - **Mejor pronóstico de recuperación completa:** edad **≤ 35 años** y **NDI ≤ 32%**.
- **Otros predictores de mala evolución:** alta intensidad de dolor inicial, discapacidad inicial alta, síntomas de estrés postraumático, **catastrofización**, baja autoeficacia, **hiperalgesia al frío**, expectativas negativas de recuperación, afrontamiento pasivo.
- **Implicación clínica:** estratificar riesgo temprano; en alto riesgo, intervención más intensiva/temprana y abordaje de factores psicosociales; en bajo riesgo, educación + actividad suele bastar.

---

### 5. Cefalea cervicogénica (breve)

Cefalea referida desde estructuras cervicales altas (**C1-C3**), típicamente unilateral, "de lado fijo", que se desencadena/reproduce con posturas o movimientos del cuello y con presión sobre la columna cervical alta.
- **Evaluación clave:** **CFRT** (§2.2, restricción C1-C2), examen de columna cervical alta, **CCFT** (control de flexores profundos frecuentemente deficiente).
- **Qué SÍ (Neck Pain CPG, categoría "con cefalea"):** **terapia manual de columna cervical alta** (movilización/SNAG C1-C2 — con cribado de seguridad §1) **+ ejercicio** (fortalecimiento/resistencia cérvico-escapular y flexores profundos). La combinación manual + ejercicio tiene mejor soporte que cualquiera sola.
- **Qué NO:** manipular sin cribado vascular/mielopático; tratar como migraña/cefalea tensional sin examinar el cuello.
- **Criterios de avance/alta:** ↓ frecuencia e intensidad de la cefalea, ↑ rotación en CFRT, control motor restaurado, autogestión. Si no responde, replantear diagnóstico (migraña, cefalea tensional, mixta).

---

### 6. Rehabilitación post-quirúrgica cervical (breve) — ACDF / discectomía

> **Las restricciones exactas las fija el cirujano; lo de abajo es un patrón general de fuentes de educación al paciente, NO una guía formal — [verificar] con el protocolo del cirujano.**

- **Fase temprana (~0-4 semanas):** proteger la fusión; **collarín según indicación del cirujano**; evitar flexión/rotación brusca; **no cargar peso** (límites típicos bajos, p. ej. no levantar más de unos pocos kg); caminar y movilidad suave desde temprano. Trabajo de escritorio suele reanudarse en **~2-4 semanas**.
- **Fase intermedia (~6 semanas-3 meses):** se reintroduce actividad física progresiva según consolidación; fisioterapia para **control, fuerza suave y función**; evaluar retorno laboral.
- **Fase avanzada (~3-6 meses):** retorno gradual al nivel previo; **deportes de contacto/alto impacto** varios meses después y con **autorización del cirujano**; fusiones multinivel se prolongan (a veces requiere TC para confirmar fusión).
- **Rol del fisio:** control motor de flexores profundos, movilidad torácica y escapular, reacondicionamiento, ergonomía, educación. Vigilar banderas (déficit neurológico nuevo, disfagia persistente, signos de no-unión) → avisar al cirujano.

---

### Región DORSAL / TORÁCICA
### 7. Dorsalgia mecánica y disfunción costovertebral

Dolor torácico de patrón mecánico (modula con movimiento, postura, respiración profunda), reproducible a la palpación de articulaciones costovertebrales/costotransversas o segmentos torácicos. **Primero descartar dolor visceral referido y fractura (§1.5).**
- **Evidencia (baja certeza):** datos específicos de dorsalgia son escasos. Lo mejor soportado es la **combinación de terapia manual torácica + ejercicio activo a corto plazo** (la terapia manual **sola** no supera claramente al placebo; **añadida al ejercicio** sí mejora sobre ejercicio solo). La terapia manual torácica también ayuda a corto plazo en dolor de cuello y hombro (síndrome subacromial) como coadyuvante.
- **Qué SÍ:** movilización/manipulación torácica (con cribado), **ejercicio de movilidad torácica** (extensión, rotación), **fortalecimiento de extensores y estabilizadores escapulares**, reeducación respiratoria/costal, educación postural y de actividad.
- **Qué NO:** apoyarse solo en terapia manual pasiva; reposo prolongado; manipular sin descartar osteoporosis/fractura/visceral.
- **Fases/criterios:** (1) control del dolor + movilidad indolora → (2) control motor y carga progresiva de extensores/escápula → (3) fuerza y gesto funcional/laboral. **Avance** por tolerancia y ↓ irritabilidad; **alta** con dolor mínimo, movilidad y fuerza funcionales, autogestión.

### 8. Hipercifosis postural

Aumento de la cifosis torácica (postural en jóvenes; en adultos mayores, hipercifosis senil asociada a debilidad de extensores ± fracturas vertebrales). Distinguir **postural reductible** de **estructural** (Scheuermann, fracturas, degenerativa).
- **Evidencia:** **ensayo SHEAF (Katzman et al. 2017, Osteoporos Int):** programa de **6 meses de fortalecimiento espinal + entrenamiento postural** redujo medidas radiográficas y clínicas de cifosis en adultos mayores. Programas más cortos (3 meses) mejoran la medida clínica pero no siempre la radiográfica. Revisión sistemática: **ejercicio de extensores espinales (y yoga) puede reducir la cifosis**; evidencia aún limitada, datos de caídas preliminares.
- **Qué SÍ:** **fortalecimiento de extensores torácicos**, entrenamiento postural, movilidad torácica en extensión, estiramiento de pectorales/flexores, propiocepción postural; en adulto mayor, integrar prevención de caídas.
- **Qué NO:** suponer que es siempre reductible sin examinar; cargar en flexión agresiva si hay sospecha de osteoporosis/fractura (§6.4/§1.5).
- **Criterios de avance/alta:** ↑ fuerza de extensores, ↑ conciencia y control postural, ↓ cifosis clínica, autogestión mantenida (la cifosis recidiva si se abandona el ejercicio).

### 9. Escoliosis

> **Diagnóstico y seguimiento por radiografía (ángulo de Cobb) y madurez esquelética (Risser).** El fisio **no sustituye** la vigilancia ortopédica; trabaja en equipo. Sociedad de referencia: **SOSORT** (*Society on Scoliosis Orthopaedic and Rehabilitation Treatment*).

#### 9.1 Escoliosis idiopática del adolescente (EIA)
**Umbrales de manejo (SOSORT 2016, Negrini et al.; marco orientativo por Cobb y madurez) [verificar cortes exactos]:**
| Cobb (de pie) | Conducta general |
|---|---|
| **< 15-20°** | Observación ± **ejercicios específicos (PSSE)**; vigilancia de progresión |
| **~20-40°** (Risser 0-3, en crecimiento, con progresión/riesgo) | **Corsé** (p. ej. Chêneau) **+ PSSE** |
| **~45-60°** | Corsé muy rígido/yeso para intentar evitar cirugía |
| **> 40-45°** (en crecimiento) / progresivo | **Derivar a cirugía** (valoración) |

- **Ejercicios específicos de fisioterapia para escoliosis (PSSE):** métodos **Schroth** y **SEAS** (Scientific Exercise Approach to Scoliosis), entre otros. Buscan **autocorrección 3D activa, elongación axial, estabilización en la postura corregida y reeducación respiratoria**, integrados en las AVD.
  - **Evidencia:** **Schroth añadido al cuidado estándar** mejora el ángulo de Cobb frente a cuidado estándar solo (Schroth PSSE, PLOS ONE 2016); **Schroth durante el corsé** fue superior a corsé solo en Cobb, rotación del tronco y calidad de vida (estudio preliminar). Series con **Chêneau + SEAS** reportan efectividad ~83% [verificar]. La calidad global aún es limitada/heterogénea.
  - **Filosofía SOSORT:** prioriza **resultados centrados en el paciente** (calidad de vida, función, estética) además del Cobb; la Scoliosis Research Society centra el Cobb como desenlace primario.
- **Rol del fisio:** cribado y derivación (escoliómetro ≥7°, §2.5), **PSSE**, trabajo conjunto con el ortesista durante el corsé, educación, adherencia, soporte psicosocial (imagen corporal).
- **Qué NO:** prometer "corrección" en curvas estructurales rígidas; usar ejercicios genéricos simétricos como si fueran específicos; descuidar la vigilancia radiográfica de progresión.
- **Criterios de avance/alta:** por madurez esquelética (Risser, menarquia) y estabilidad de la curva en radiografías seriadas; el alta del componente de corsé la marca el ortopedista.

#### 9.2 Escoliosis del adulto (idiopática evolucionada y **degenerativa "de novo"**)
El objetivo cambia: **no es frenar una curva en crecimiento sino controlar dolor y discapacidad y preservar función**; el **balance sagital** suele correlacionar más con los síntomas que la curva coronal.
- **Evidencia:** limitada, estudios pequeños/heterogéneos; éxito del tratamiento conservador modesto (cifra histórica ~27% [verificar]). Cohorte prospectiva: ejercicio/fisioterapia **↓ dolor y ↑ calidad de vida/función** en escoliosis degenerativa del adulto.
- **Qué SÍ:** programa **individualizado**; cuando hay **desbalance sagital**, **fortalecimiento de extensores con énfasis en resistencia** y reeducación de la marcha; PSSE (Schroth/SEAS) como complemento; manejo del dolor, acondicionamiento general, educación. Corsé en casos dolorosos seleccionados (adherencia suele ser baja).
- **Qué NO:** esperar corrección estructural; ignorar banderas rojas (claudicación neurógena, déficit progresivo → derivar).
- **Criterios de avance/alta:** por **mejoría funcional y de síntomas** (no por el ángulo). Derivar a cirugía si dolor/discapacidad refractarios, déficit neurológico progresivo o desbalance sagital marcado.

### 10. Radiculopatía cervical (ubicada aquí por completitud; es cuadro CERVICAL)

Compresión/irritación de raíz cervical (hernia discal, espondilosis/estenosis foraminal). Dolor radicular + posibles signos sensitivos/motores/reflejos en el dermatoma/miotoma.
- **Evaluación:** clúster de Wainner (§2.1); **siempre cribar mielopatía (§1.1)** — radiculopatía y mielopatía pueden coexistir.
- **Historia natural:** generalmente **favorable** con manejo conservador (mejoría espontánea frecuente); la cifra de "~90% asintomáticos/leves a largo plazo" proviene de cohortes antiguas y fuentes secundarias → **[verificar], tratar con cautela**.
- **Qué SÍ (Neck Pain CPG + revisiones):** **abordaje multimodal** — **ejercicio** (movilidad, fortalecimiento, estabilización), **terapia manual** cervical y torácica (mejor combinada con ejercicio), **neurodinámica/deslizamientos neurales** (soporte de confianza moderada), **tracción cervical** (evidencia **mixta**: un metaanálisis halló que **añadir tracción mecánica al ejercicio** ↓ dolor y discapacidad, sobre todo a largo plazo; otras revisiones piden más evidencia). Educación y analgesia. Monitorear **irritabilidad** y ajustar.
- **Qué NO:** traccionar/manipular sin descartar mielopatía y banderas vasculares; forzar maniobras que **periferizan** el síntoma; reposo/collarín.
- **Enfoque por fases/criterios:**
  - **Fase 1 (irritabilidad alta):** metas = ↓ dolor radicular, posiciones de descarga, **centralizar** el síntoma. SÍ: ejercicios/posturas que centralizan, deslizamientos neurales suaves ("sliders"), tracción suave si alivia, terapia manual torácica, educación. NO: tensión neural agresiva ("tensioners"), ejercicios que periferizan. **Avance:** síntoma centralizado y estable, ↓ irritabilidad.
  - **Fase 2 (control y carga):** fortalecimiento cérvico-escápulo-torácico, control motor (flexores profundos), progresión de neurodinámica, movilidad. **Avance:** fuerza/control funcional, tolerancia creciente.
  - **Fase 3 (función/retorno):** fuerza con carga, gesto laboral/deportivo, ergonomía. **Alta:** dolor mínimo, sin déficit progresivo, función restaurada, autogestión.
- **Cuándo derivar / cirugía:** **déficit neurológico progresivo** (debilidad que empeora), **signos de mielopatía**, **dolor intratable pese a ~6-12 semanas** de tratamiento conservador adecuado; urgente si marcha nueva alterada, disfunción esfinteriana o progresión rápida (AAPMR; políticas de pagadores exigen ~6 semanas de conservador) [verificar contra NASS/AAOS].

---

### 11. Seguridad de agentes físicos y precaución con MANIPULACIÓN/TRACCIÓN CERVICAL

#### 11.1 Manipulación y tracción cervical — precauciones (ligar a `seguridadClinica`)
**Antes de cualquier terapia manual de alta velocidad o tracción cervical, cribar OBLIGATORIAMENTE las banderas rojas de §1:** **mielopatía (§1.1)** y **patología vascular / disección (§1.2)** son **contraindicación** de manipulación (evitar también tracción y extensión forzada → urgencia médica); **fractura/inestabilidad (§1.3)** (trauma reciente, AR con subluxación C1-C2, osteoporosis severa, EA, Down) y **cáncer/infección (§1.4)** → **no manipular**, derivar antes de tratar. El marco **IFOMPT 2020 ya no recomienda** pruebas pre-manipulativas posicionales: el cribado es por historia + riesgo + examen neurológico.

**Sobre el riesgo de la manipulación cervical (manipulación de alta velocidad, HVLA):**
- Los **eventos adversos benignos** (dolor transitorio, rigidez) son **frecuentes**; los **graves (ACV por disección) son raros** (revisión de alcance 2017).
- La **causalidad** manipulación→ACV **sigue en debate**; estudios poblacionales (p. ej. cohorte Medicare, Cassidy/Kosloff) sugieren **riesgo absoluto muy bajo** y asociación posiblemente **circunstancial** (pacientes con una disección en curso consultan por el dolor que esta ya produjo). Cifra histórica "~1/20,000" es antigua y no verificada [verificar]. **Conclusión práctica:** ante signos de disección, **no manipular** y derivar; preferir técnicas de menor riesgo (movilización de baja velocidad, ejercicio) cuando el beneficio de HVLA no es claro; consentimiento informado.

#### 11.2 Agentes físicos — contraindicaciones y precauciones (inventario de la clínica)
Los agentes son **coadyuvantes**. Respetar siempre `seguridadClinica` (la alerta de metal/implantes ya existe en la app). Reglas clave aplicables a columna cervical/dorsal:
- **Material quirúrgico / osteosíntesis / implantes metálicos / prótesis:** **NO** radiofrecuencia/diatermia, **NO Tecar térmica (resistiva/capacitiva en modo térmico)**, **NO ultrasonido térmico** sobre el material. (La energía se concentra en el metal → quemadura/daño.) Usar modos atérmicos lejos del material si procede.
- **Marcapaso / desfibrilador (DAI):** **NO electroterapia (TENS/EEM/corrientes)**, **NO Tecar/radiofrecuencia/diatermia** sobre tórax/cuello ni cerca del dispositivo. Contraindicación crítica cervical/dorsal por la cercanía torácica.
- **Embarazo:** evitar agentes sobre columna lumbar/abdomen/pelvis y en general modalidades no probadas; cautela con Tecar/RF, ultrasonido térmico, ondas de choque, electroterapia sobre tronco.
- **Cáncer activo / tumor en la zona:** no aplicar agentes que estimulen circulación/metabolismo sobre la zona tumoral (Tecar, US, láser, ondas de choque) salvo indicación específica; precaución general.
- **Anticoagulación / trastorno de coagulación:** cautela con técnicas que puedan generar hematoma (punción seca, ondas de choque, masaje profundo).
- **Zona cervical anterior:** evitar presión/electroestimulación sobre seno carotídeo, laringe, ganglios; cuidado con electrodos en cuello anterior.
- **Ondas de choque:** no sobre tejido agudo/desgarro agudo, no sobre pulmón (tórax), no en coagulopatía/embarazo/tumor.
- **MEP / punción seca:** requieren consentimiento; precaución en anticoagulados, zonas con implante, embarazo.
- **Radiculopatía/dolor neuropático:** priorizar ejercicio/neurodinámica; agentes solo para control sintomático puntual.

> **Flujo clínico recomendado:** al abrir el expediente, revisar la caja de **seguridad clínica** (`_soapSeguridadHTML` / `seguridadClinica`). Si hay implante/metal, marcapaso, anticoagulación, cáncer o embarazo, **configurar los agentes físicos en consecuencia** y dejarlo registrado. Si el dato clínico de riesgo vive en texto libre (p. ej. un tumor en antecedentes), **capturarlo en `seguridadClinica`** para que la alerta salte.

---

### Fuentes (guía / autor / año + enlace)

**Cervical — guías y clasificación**
- Blanpied PR, et al. **Neck Pain: Revision 2017. Clinical Practice Guidelines (JOSPT).** 2017. https://www.jospt.org/doi/10.2519/jospt.2017.0302 · PDF Orthopaedic Section: https://www.orthopt.org/uploads/content_files/files/Neck%20Pain%20CPG%20-%20Revision%202017.pdf
- Rushton A, et al. **International IFOMPT Cervical Framework** (consenso 2020; publicado JOSPT 2022). https://www.jospt.org/doi/10.2519/jospt.2022.11147 · Documento IFOMPT (2020, add. 2023): https://www.ifompt.org/wp-content/uploads/2026/09/IFOMPT-cervical-framework-final-2020-Add-2023.pdf · Resumen Physiopedia: https://www.physio-pedia.com/International_Framework_for_Examination_of_the_Cervical_Region

**Latigazo / WAD**
- Spitzer WO, et al. **Quebec Task Force on Whiplash-Associated Disorders** (clasificación 0-IV). 1995. Resumen: https://chiro.org/Whiplash/FULL/Quebec_Task_Force/definition.htm
- Ritchie C, Sterling M, et al. **Derivation of a clinical prediction rule (WhipPredict).** *Pain* 2013. https://recover.centre.uq.edu.au/files/81/Derivation%20of%20a%20CPR_Ritchie%20et%20al%202013.pdf
- Sterling M. **Recovery Pathways and Prognosis After Whiplash Injury.** JOSPT 2016. https://www.jospt.org/doi/10.2519/jospt.2016.6918
- **TRACsa / Guías australianas de whiplash (SIRA).** https://www.ipts.org.il/_Uploads/dbsAttachedFiles/whiplash.pdf · https://mywhiplash.com.au/content/managing-whiplash-your-patients · Physiopedia WAD: https://www.physio-pedia.com/Whiplash_Associated_Disorders

**Radiculopatía cervical**
- Wainner RS, et al. **Clúster para radiculopatía cervical** (2003). Resumen Physiotutors: https://www.physiotutors.com/wiki/cluster-of-wainner/ · Spurling: https://www.physiotutors.com/wiki/spurlings-test-cervical-radicular-syndrome/
- Romeo A, et al. **Traction added to PT for cervical radiculopathy: meta-analysis.** https://www.researchgate.net/publication/322282018
- Australian Physiotherapy Association. **Cervical radiculopathy** (manejo/derivación). https://australian.physio/inmotion/cervical-radiculopathy
- AAPM&R. **Cervical Radiculopathy** (indicaciones de cirugía). https://now.aapmr.org/cervical-radiculopathy/

**Cefalea cervicogénica / flexión-rotación**
- Hall T, Robinson K. **Diagnostic validity of the cervical flexion-rotation test in C1/2 CGH.** *Man Ther* 2007. https://www.sciencedirect.com/science/article/abs/pii/S1356689X06001111
- **Perspective on the CFRT in PT management of CGH** (2023, PMC). https://pmc.ncbi.nlm.nih.gov/articles/PMC9730562/

**Flexores profundos / control motor**
- Jull G, Falla D, O'Leary S, et al. **Craniocervical Flexion Test** y entrenamiento de flexores profundos. Revisión sistemática DCF (BMC Musculoskelet Disord 2018): https://link.springer.com/article/10.1186/s12891-018-2324-z
- Gross A, et al. **Exercises for mechanical neck disorders (Cochrane, CD004250).** 2015. https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD004250.pub5/full · Dosis (JOSPT 2020): https://www.jospt.org/doi/10.2519/jospt.2020.9155

**Mielopatía cervical**
- **Degenerative Cervical Myelopathy: Recognition and Management.** AAFP 2020. https://www.aafp.org/afp/2020/1215/p740
- Jiang Z, Davies B, et al. **Value of clinical signs in DCM: systematic review/meta-analysis** (AO Spine RECODE-DCM) 2024. https://journals.sagepub.com/doi/10.1177/21925682231209869

**Trauma / reglas de decisión**
- Stiell IG, et al. **Canadian C-Spine Rule**; Hoffman JR, et al. **NEXUS.** Metaanálisis comparativo: https://pmc.ncbi.nlm.nih.gov/articles/PMC10568954/ · Comparación (Ann Emerg Med): https://www.annemergmed.com/article/S0196-0644(03)01361-1/fulltext

**Post-quirúrgico cervical (ACDF) — educación al paciente [verificar]**
- Complete Orthopedics: https://www.cortho.org/spine/acdf-recovery/ · Neurosurgeons of NJ: https://www.neurosurgeonsofnewjersey.com/blog/acdf-physical-therapy/

**Torácica / dorsalgia**
- **Thoracic Manual Therapy With or Without Exercise** (revisión sistemática de ECA) 2025. https://pmc.ncbi.nlm.nih.gov/articles/PMC12523727/ · Physiopedia (cérvico-torácica): https://www.physio-pedia.com/Manual_Techniques_for_the_Cervicothoracic_Spine

**Hipercifosis**
- Katzman WB, et al. **SHEAF RCT: spine-strengthening + posture training** (Osteoporos Int 2017). https://link.springer.com/article/10.1007/s00198-017-4109-x

**Escoliosis**
- Negrini S, et al. **2016 SOSORT guidelines** (y 2011). https://d-nb.info/1154649695/34 · https://link.springer.com/article/10.1186/1748-7161-7-3
- **Schroth PSSE añadido al cuidado estándar** (PLOS ONE 2016): https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0168746 · Schroth + corsé (RCT): https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6615154/
- **Escoliosis degenerativa del adulto — cohorte prospectiva:** https://pmc.ncbi.nlm.nih.gov/articles/PMC11079735/ · Rehabilitación (IntechOpen): https://www.intechopen.com/chapters/63594
- **Cribado (escoliómetro/Adams):** CHOP https://www.chop.edu/news/screening-scoliosis · Punto de corte escoliómetro (PubMed 9306527): https://pubmed.ncbi.nlm.nih.gov/9306527/

**Fractura vertebral osteoporótica (torácica)**
- **NOGG — Management of symptomatic osteoporotic vertebral fractures (Section 8).** https://www.nogg.org.uk/full-guideline/section-8-management-symptomatic-osteoporotic-vertebral-fractures · Physiopedia: https://www.physio-pedia.com/Osteoporotic_Vertebral_Fractures

**Seguridad de la manipulación cervical**
- Cassidy JD / Kosloff T, et al. **Riesgo de ACV tras manipulación cervical (cohorte).** https://www.sciencedirect.com/science/article/pii/S016147541400267X
- **Risks of manual treatment of the spine: scoping review** (2017). https://link.springer.com/article/10.1186/s12998-017-0168-5

---

### Incertidumbres [verificar]

- **Latigazo — guía vigente:** la actualización australiana (SIRA 4ª ed., ~2023) aparecía en **borrador**; confirmar edición final y recomendaciones graduadas en el sitio de SIRA/TRACsa antes de citarla como definitiva.
- **Neck Pain CPG:** el de 2017 (Blanpied) sigue siendo el de referencia; confirmar si existe una revisión posterior y los **grados de evidencia (A/B/C)** por subgrupo en el documento completo.
- **SOSORT:** los cortes de Cobb para corsé/cirugía/PSSE provienen del marco 2016 (y 2011); verificar si hay **actualización 2024-2025** y los umbrales exactos (varían con Risser/progresión).
- **Cifras de precisión diagnóstica** (Spurling, distracción, ULTT, CFRT, Hoffmann/Babinski, escoliómetro, CCR/NEXUS): rangos **muy variables entre fuentes**; contrastar con el estudio primario antes de usarlas en una decisión.
- **WhipPredict:** cortes de NDI (≤32 / ≥40), edad (35) e hiperexcitación (>6 PDS) y proporciones de recuperación (~50/25/25) tomados de fuentes secundarias y del estudio de derivación 2013 → verificar validación externa en el *Pain* original.
- **Radiculopatía cervical — historia natural:** la cifra "~90% recuperados" se apoya en cohortes antiguas/fuentes secundarias; tratar como orientativa.
- **Escoliosis del adulto:** "éxito conservador ~27%" y la efectividad de PSSE son de evidencia limitada/heterogénea.
- **ACDF:** tiempos y restricciones provienen de educación al paciente de cirujanos, **no de guía formal**; el protocolo real lo fija el cirujano.
- **Riesgo de ACV por manipulación cervical:** causalidad no resuelta; "~1/20,000" es cifra histórica no verificada.
- **IFOMPT — % de mareo en disección** y detalles de los signos "5D/3N": tomados de resúmenes secundarios; verificar contra el documento IFOMPT 2020.

> **Nota final de uso clínico:** este documento es el equivalente cervical/dorsal de la biblioteca de protocolos de la clínica. Sirve como **fundamento y checklist de razonamiento** (clasificar → cribar banderas rojas → tratar por criterios → vigilar seguridad de agentes y manipulación). **No** genera prescripción automática; el fisio individualiza y documenta, ligando siempre con `seguridadClinica`.

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

## 🦾 CODO — epicondilalgia, post-fractura/luxación, LCU/Tommy John y túnel cubital

> **Material de referencia, NO prescripción automática.** Las fases se avanzan por **CRITERIOS** (dolor, ROM, fuerza, tolerancia a la carga), no por calendario; los tiempos son hitos orientativos. Individualizar por edad, demanda deportiva/laboral, tipo de tejido, manejo conservador vs post-quirúrgico y `seguridadClinica`. Evidencia 2021–2026 + fundacionales citados por nombre. Los números finos marcados **[verificar]** provienen de resúmenes y deben cotejarse con el texto completo.

### 0. Principios transversales de la rehabilitación de codo

> **Aplican las reglas de oro del inicio** (criterios > calendario · la carga es el motor · semáforo del dolor). Lo **específico del codo**:

- **El motor cambia por cuadro:** en las tendinopatías (epicondilalgias) es la **CARGA progresiva**; en trauma (fractura/luxación) es el **movimiento activo temprano controlado**. Los agentes físicos son coadyuvantes.
- **El codo es muy propenso a la RIGIDEZ y a la osificación heterotópica (OH):** (1) movilizar pronto y de forma controlada tras trauma; (2) **NO forzar con estiramiento pasivo agresivo** (empeora la OH y la rigidez).
- **Recuperar la EXTENSIÓN es prioridad** tras trauma: el codo tiende a quedar en **flexo** (déficit de extensión), lo más incapacitante funcionalmente.
- **Termómetro de la tendinopatía:** la **rigidez/dolor matutino** y el dolor a las 24 h post-carga mandan; dolor **estable ≤3–5/10 que no empeora a las 24 h** = progresar; dolor creciente, hinchazón o pérdida de ROM = retroceder.
- **ROM normal del codo (goniometría):** extensión 0° / flexión ~140–150°; pronación ~80–85° / supinación ~85–90°. **Arco funcional (Morrey):** flexión 30°–130° y 50°–50° de pronosupinación cubren la mayoría de las AVD → objetivo mínimo realista.

---

### 1. Epicondilalgia LATERAL (codo de tenista; tendinopatía del extensor radial corto del carpo / ECRB)

El cuadro más frecuente. Terminología moderna preferida: **tendinopatía lateral de codo / epicondilalgia lateral** (evita "epicondilitis": el proceso es degenerativo-reparativo, no inflamatorio puro).

#### Modelo de comprensión (Coombes, Bisset & Vicenzino — Br J Sports Med 2009)
Modelo integrador de 3 dominios que deben evaluarse y tratarse: **(1) patología tendinosa local** (degeneración del ECRB), **(2) cambios en el sistema del dolor** (sensibilización), **(3) deterioros del sistema motor** (fuerza de prensión indolora disminuida, control motor). Útil para explicar por qué el ejercicio de carga (que actúa en los 3) supera a intervenciones que solo tocan uno.

#### Historia natural y pronóstico
A menudo descrito como **autolimitado** (tiende a resolver), pero con **alta recurrencia** y bajas laborales prolongadas que justifican tratamiento activo (JOSPT CPG 2022). Factores de mal pronóstico: alta irritabilidad, cronicidad, trabajo manual pesado, dolor bilateral, catastrofización (JOSPT 2015, "One size does not fit all" — propone estratificar por riesgo de mal resultado).

#### Manejo moderno (pilar = EJERCICIO DE CARGA PROGRESIVA)
- **Ejercicio de resistencia progresiva de extensores de muñeca/antebrazo — es el pilar** (excéntrico + concéntrico; la Cochrane 2024 de Wallis et al. "Manual therapy and exercise for lateral elbow pain" define la intervención de ejercicio precisamente como *carga progresiva con componentes excéntrico y concéntrico*).
- **Dosificación orientativa:** programa de **6–12 semanas, 3 series de 10–15 repeticiones** (revisión de dosificación de ejercicio resistido, J Hand Ther 2012 [verificar año/autores]). En fase reactiva/irritable: **isométricos 30–60 s por debajo del umbral de dolor**, 3–5 series, luego progresar a concéntrico-excéntrico lento conforme baja la irritabilidad (Coombes/Bisset/Vicenzino, JOSPT 2015).
- **Matiz importante sobre isométricos:** el ejercicio **isométrico aislado NO fue superior a "esperar y ver"** en fuerza de prensión indolora ni en percepción de cambio (Vuvan et al., *Med Sci Sports Exerc* 2020; SMD de prensión indolora **−0.33 [IC95% −0.97 a 0.30]** [verificar]). Conclusión: el isométrico sirve para control de síntomas en fase irritable, pero **dudoso como tratamiento único**; el programa debe progresar a carga mayor (HSR / concéntrico-excéntrico).
- **Educación + manejo de carga:** evitar/modificar actividades provocadoras, ergonomía, cambio de hábitos, ajuste del puesto de trabajo (JOSPT CPG 2022, soporte moderado como estándar de práctica). Explicar que el dolor controlado durante el ejercicio es aceptable.
- **Terapia manual COADYUVANTE** (no sustituye la carga): movilización con movimiento de Mulligan (MWM, "lateral glide"), manipulación de Mills, movilización articular — efecto sobre todo a corto plazo, mejor combinada con ejercicio (Cochrane Wallis 2024).

#### "Esperar y ver" vs ejercicio vs CORTICOIDE (mensaje clave: el corticoide empeora a largo plazo)
- **Smidt et al., Lancet 2002 (n=185; inyección de corticoide vs fisioterapia vs esperar-y-ver):** a **6 semanas** la inyección ganaba (éxito ~92% vs ~47% fisio vs ~32% esperar), pero a **52 semanas se invertía: ~69% inyección vs ~91% fisioterapia vs ~83% esperar-y-ver** [verificar]. Costos: inyección la más barata (~€430) vs esperar (~€631) vs fisio (~€921).
- **Coombes et al., JAMA 2013 (epicondilalgia crónica, placebo-controlado, ±fisioterapia):** el **corticoide dio PEORES resultados al año** que placebo — recuperación completa/mucha mejoría **83% corticoide vs 96% placebo (RR 0.86 [IC99% 0.75–0.99])** y **mayor recurrencia (54% vs 12%)** [verificar]. La fisioterapia no añadió diferencia significativa al año.
- **Síntesis para la clínica:** la inyección de corticoide da alivio **a corto plazo** pero **empeora el resultado a largo plazo y aumenta la recurrencia** → **no es primera línea**; primera línea = educación + carga progresiva ± ortesis, con "esperar y ver" como opción razonable en casos leves/recientes.

#### Ortesis (banda/strap de contrafuerza o férula de muñeca)
- Evidencia de **baja certeza** y efecto **a corto plazo/inmediato** sobre dolor y prensión; **no superior de forma consistente** a la férula de muñeca (meta-análisis Shahabi et al. 2020: banda de contrafuerza vs férula de muñeca, diferencia de dolor **SMD 0.35 [−0.07 a 0.76], baja certeza** [verificar]; RCTs cruzados muestran efecto inmediato en dolor/prensión).
- **Uso práctico:** coadyuvante sintomático para actividades provocadoras; **no sustituye el ejercicio**. Banda ~1–2 cm distal al epicóndilo lateral.

#### Ondas de choque (ESWT) y PRP
- **ESWT:** soporte **moderado** para dolor en casos crónicos; efecto **dosis-dependiente** (la radial de intensidad media salió mejor para dolor a 1 mes en network meta-analysis de 11 RCT + 2 cohortes, 938 pacientes [verificar]). Resultados **mixtos frente a corticoide**. Razonable en tendinopatía crónica que no cede a la carga; **con consentimiento**.
- **PRP:** evidencia **inconsistente y frágil** (pocos ensayos, muestras pequeñas, rankings contradictorios entre revisiones). **No primera línea**; considerar solo en refractarios tras fallar carga bien dosificada, informando la incertidumbre.

#### Pruebas clínicas (lateral) — ver también sección 8
- **Cozen:** dolor en epicóndilo lateral con extensión resistida de muñeca (puño + desviación radial) → sens alta (~84–91%), espec baja → **mejor para descartar**.
- **Maudsley:** dolor con extensión resistida del **3er dedo** → sens alta (~70–88%).
- **Mill:** dolor con estiramiento pasivo (codo extendido, antebrazo pronado, muñeca en flexión) → **espec alta (~100%), sens menor (~53–76%)** → **mejor para confirmar (rule-in)** [verificar; evidencia de baja calidad e inconsistente].
- **Confirmación por imagen:** ecografía como primera línea de imagen cuando se requiere.

#### Fases por criterios — epicondilalgia lateral
- **Fase 1 — Control de síntomas / descarga (tendón reactivo/irritable).** *Metas:* bajar dolor e irritabilidad, iniciar carga tolerable. *SÍ:* educación + manejo de carga; **isométricos de extensores 30–60 s × 3–5, por debajo del dolor**, diarios; prensión indolora; terapia manual/ortesis si ayuda; corregir cadena cinética (hombro/muñeca). *NO:* reposo absoluto prolongado; cargas provocadoras que dejan dolor >24 h; corticoide como primera opción. *Criterio de avance:* dolor en reposo ≤2/10, tolera isométricos sin exacerbación >24 h.
- **Fase 2 — Carga progresiva (reconstrucción).** *Metas:* restaurar fuerza y prensión indolora. *SÍ:* resistido **concéntrico-excéntrico lento** y/o **HSR** (carga pesada lenta) de extensores de muñeca, 3×10–15, 3×/sem, progresando resistencia; integrar flexión/extensión de muñeca, supinación/pronación, agarre. *Criterio de avance:* prensión indolora ≥80–90% del lado sano, sin dolor matutino significativo.
- **Fase 3 — Retorno a función/deporte.** *SÍ:* carga específica de la tarea/gesto (revés de tenis, herramientas), pliometría de miembro superior si aplica, reintroducción gradual. *Criterio de alta/retorno:* **fuerza de prensión indolora simétrica (≥90–95% contralateral)**, función plena en AVD/trabajo, PRTEE/VAS mínimos, gesto deportivo tolerado sin recaída a 24–48 h.

#### Medidas de resultado
- **Fuerza de prensión INDOLORA** (dinamómetro Jamar; se incrementa el agarre y se detiene al primer dolor, registrando la fuerza máxima sin dolor) — medida de referencia en epicondilalgia.
- **PRTEE** (Patient-Rated Tennis Elbow Evaluation), **VAS/EVA** de dolor, fuerza de prensión máxima.

---

### 2. Epicondilalgia MEDIAL (codo de golfista; tendinopatía de la masa flexora-pronadora)

Análoga a la lateral pero en el origen flexor-pronador común (epicóndilo medial). Menos frecuente. **Clave diferencial: coexistencia frecuente con afectación del nervio cubital** (síndrome del túnel cubital) → siempre explorar el cubital.

#### Diagnóstico clínico
Diagnóstico **principalmente clínico**: dolor con **flexión resistida de muñeca y pronación resistida del antebrazo**, más dolor a la palpación **5–10 mm distal y anterior al epicóndilo medial** (origen flexor común). El **test de Polk** ayuda a diferenciar medial vs lateral. Las pruebas provocadoras son útiles pero **carecen de validación estandarizada** → juicio clínico (revisión UK de epicondilitis medial 2024; revisión "current concepts" 2025). Imagen (eco/RM/electrodiagnóstico) reservada a duda diagnóstica, sospecha de cubital o fracaso terapéutico. Las **calcificaciones** se asociaron a más dolor, antecedente de infiltración y **neuropatía cubital combinada** [verificar].

#### Manejo
- **~85–95% responden a tratamiento conservador** [verificar]; recuperación típica 3–6 meses.
- Mismo esquema que la lateral: **carga progresiva de flexores-pronadores** (isométrico → excéntrico → concéntrico-excéntrico → HSR). Protocolo representativo (ensayo registrado 2026, NCT07582510): sem 1–2 isométricos 4–5×30–45 s; sem 3–4 excéntrico 3×15; sem 5–6 concéntrico-excéntrico 3–4×10–12; sem 7–8 HSR ~70–85% 1RM [verificar].
- **Manejo de carga** (la lesión aparece cuando intensidad/frecuencia/volumen exceden la capacidad de recuperación) + abordar **contribuyentes proximales** (columna torácica rígida, manguito débil, mecánica de golf/lanzamiento que vuelca fuerza al codo).
- Educación, ergonomía; ortesis de contrafuerza medial como coadyuvante; corticoide con las **mismas reservas** que en la lateral (empeora a largo plazo).
- **Si hay síntomas cubitales** (parestesias 4º–5º dedo, Tinel/flexión positivos): tratar también el túnel cubital (sección 7) y evitar maniobras que lo compriman.

#### Fases por criterios — epicondilalgia medial
Idénticas en lógica a la lateral: **Fase 1** control de síntomas (isométricos indoloros, descarga, tratar cubital si aplica) → **Fase 2** carga progresiva flexor-pronadora → **Fase 3** retorno al gesto (swing de golf, lanzamiento) con criterio de **prensión indolora ≥90% contralateral** y gesto tolerado sin recaída a 24–48 h. *NO:* estiramiento/valgo provocador agresivo si hay irritación cubital; retorno al swing antes de recuperar fuerza simétrica.

---

### 3. Rehabilitación POST-FRACTURA y POST-LUXACIÓN de codo + RIGIDEZ

El codo es la articulación más propensa a rigidez post-traumática. **Principio rector: movilización activa temprana controlada; recuperar extensión; NO forzar.**

#### Luxación SIMPLE (sin fractura asociada) — manejo conservador
- **Movilización funcional temprana (dentro de ~7 días)** es superior a la inmovilización con yeso >2 semanas (consenso SMDA-SEC; revisiones sistemáticas, p. ej. PMC8899322; RCT multicéntrico FuncSiE):
  - Tasa de **re-luxación similar** (~**1.3%** movilización temprana vs ~**2.2%** yeso) [verificar].
  - **Menos osificación heterotópica (~36% vs ~54%)** [verificar].
  - **Recuperación más rápida de ROM, función y retorno al trabajo** (a cambio de algo más de dolor en las primeras ~6 semanas).
- **Posición "overhead" (supino con el brazo hacia el techo):** usar la gravedad para **coaptar/estabilizar** la articulación mientras se hace flexo-extensión activa temprana, protegiendo de varo/valgo y de la inestabilidad rotatoria posterolateral.
- **Fases orientativas (criterio, no calendario):**
  - **Fase 1 (~0–3 sem):** ROM activa/activa-asistida protegida, preferible en posición overhead; **flexión sin límite**, pronosupinación activa-asistida, **extensión graduada según la inestabilidad** (evitar los **últimos ~30° de extensión** si hubo inestabilidad, es la posición más vulnerable). *NO:* ROM pasiva forzada, valgo/varo, estiramiento agresivo.
  - **Fase 2 (~3–6 sem):** estabilidad articular habitual hacia la 3ª–4ª semana; ROM activa/activa-asistida con el codo en posición dependiente (sentado/de pie), ampliar extensión, iniciar isométricos.
  - **Fase 3 (~desde 6 sem):** ROM sin límites, fuerza y resistencia progresivas, retorno a actividades. *Criterio de retorno deportivo:* fuerza **85–90% del lado sano** [verificar].
- Alternativa más conservadora (protocolo tipo Lervick): férula a 90° 3–4 días sin ROM pasiva, luego brida articulada 15°–90° abriendo a 0°–flexión completa entre semanas 2–6 [verificar].

#### Luxación COMPLEJA / fractura-luxación (incluida la TRÍADA TERRIBLE)
- **Tríada terrible** = luxación posterolateral + **fractura de cabeza radial** + **fractura de apófisis coronoides** (± lesión del complejo ligamentario lateral/LCL). Suele requerir **cirugía** (reparación/reemplazo de cabeza radial, fijación de coronoides, reparación del LCL ± LCU). **No existe un protocolo único estandarizado**; la rehab la **dirige el cirujano** según la estabilidad lograda intraoperatoria.
- **Riesgo de OH mucho mayor:** OH radiográfica en **~20% de las fracturas-luxaciones** vs ~**3%** de las luxaciones simples [verificar]. **Las manipulaciones repetidas y el estiramiento pasivo forzado agravan la OH y la rigidez** (caso documentado de tríada descuidada).
- **Fases orientativas (siempre según el cirujano):**
  - **Temprana (~0–3/6 sem):** valva/férula posterior breve, luego **brida articulada** con límites (típico ~30°–120°); **evitar los últimos ~30° de extensión × ~4 semanas** (zona inestable); posición overhead; movilidad de mano/muñeca/dedos.
  - **Media (~3/6–12 sem):** ampliar límites de la brida de forma gradual (p. ej. ~10°/semana), aumentar supinación, iniciar isométricos (muñeca, flexo-extensores, hombro). *NO:* valgo/varo resistido, estiramiento pasivo agresivo.
  - **Tardía (~desde 12 sem):** ROM completa, fortalecimiento graduado, retorno a AVD (3–6 meses); impacto alto/contacto diferido.

#### RIGIDEZ post-traumática del codo (déficit de extensión prioritario)
- **Movimiento activo y activo-asistido** es la base; **el movimiento activo temprano previene el engrosamiento del líquido inflamatorio y la rigidez** (revisión del codo rígido post-traumático, PMC8261251).
- **Férulas estáticas progresivas / turnbuckle:** reservadas para **plateau** (cuando el ejercicio manual no logra avanzar la ROM), aplicando **tensión baja y mantenida/prolongada**, NO estiramiento forzado breve. Se usan típicamente desde las ~6–12 semanas y **antes de que el tejido capsular madure (ventana ~6 meses)**; pasado ese punto sin avance, considerar escalar (liberación quirúrgica).
- **Qué NO hacer:** estiramiento pasivo agresivo, "forzar" la extensión, cargas altas para "romper" la rigidez → desencadenan dolor, derrame y **OH**.
- **Priorizar la extensión:** el codo tiende al flexo; perder extensión es más incapacitante que perder los últimos grados de flexión.

---

### 4. Inestabilidad del LIGAMENTO COLATERAL CUBITAL (LCU/UCL) / valgo en lanzadores

Sobrecarga en **valgo** repetitiva (béisbol, lanzadores, jabalina, voleibol). El LCU (fascículo anterior) es el estabilizador primario al valgo entre ~20°–120° de flexión.

#### Manejo conservador vs reconstrucción (Tommy John)
- **Parciales / grado I–II:** la gran mayoría responde a **tratamiento conservador** (reposo relativo del lanzamiento, fortalecimiento de la cadena cinética y de flexores-pronadores, **Thrower's Ten**, control motor del hombro/core, luego **programa de lanzamiento por intervalos**); retorno típico **3–4 meses** [verificar]. Cirugía indicada tras **inestabilidad recurrente o fracaso de ≥12 semanas** de rehab integral.
- **Roturas completas / alta demanda (lanzador):** **reconstrucción del LCU (cirugía de Tommy John)**, injerto a través de túneles óseos.
- **Rehab de la reconstrucción (por fases, dirigida por cirujano):**
  - **Fase 1 (~0–6 sem):** proteger el injerto (brida), restaurar ROM, isométricos ligeros.
  - **Fortalecimiento progresivo** y Thrower's Ten.
  - **Programa de lanzamiento por intervalos** iniciando ~**4–5 meses** (tiros cortos → progresión de distancia → lanzamiento desde el montículo más tarde).
  - **Retorno a competición ~12–18 meses** [verificar].
  - **La causa más común de fracaso es el retorno prematuro al lanzamiento.** El programa por intervalos es una **progresión por criterios** (tolerancia, mecánica, ausencia de dolor), no una fecha fija.

#### Pruebas clínicas (valgo/LCU) — ver sección 8
- **Moving valgus stress test (O'Driscoll et al., Am J Sports Med 2005):** codo en valgo mantenido mientras se lleva de flexión máxima a extensión; positivo si reproduce dolor medial en el "arco doloroso" ~120°→70°. Reportado **sens ~100%, espec ~75%** en el estudio original (n=21; espec basada en solo 4 casos → **imprecisa**) [verificar].
- **Test de estrés en valgo (estático)** y **maniobra de "ordeño" (milking maneuver).** Las pruebas provocadoras pueden ser **poco específicas**; la **RM con artrografía (RMA)** tiene la mayor exactitud por imagen para roturas del LCU.

---

### 5. Bursitis olecraniana

Inflamación de la bursa del olécranon. **Primera decisión clínica: ¿SÉPTICA o aséptica?**

#### Diferenciar séptica de aséptica (bandera roja)
Sospechar **séptica** ante **calor, eritema, dolor marcado, fiebre, fluctuación, antecedente de trauma/herida o break de piel**. Ante la duda → **aspiración con análisis del líquido (Gram, cultivo, recuento)** y manejo como séptica hasta descartar.

#### Manejo
- **Aséptica:** **conservador de primera línea** — reposo relativo, **evitar apoyar/recargar el codo**, compresión/acolchado, hielo, AINE si precisa. **Infiltración de corticoide controvertida y poco recomendada** por riesgo de **bursitis séptica iatrogénica, atrofia y despigmentación cutánea**. Falta de evidencia robusta para la aséptica (revisión J Hand Surg 2021).
- **Séptica:** **antibiótico** cubriendo *Staphylococcus* y *Streptococcus*. La **aspiración** es debatida (algunos datos apoyan antibiótico empírico sin aspirar en casos no complicados); **≤7 días de antibiótico** tan eficaz como pautas más largas en una cohorte [verificar]. **Cirugía (bursectomía) reservada** a fracaso del tratamiento conservador, incluso en sépticas.

---

### 7. Atrapamiento del nervio cubital en el codo (síndrome del túnel cubital)

Segunda neuropatía por compresión más frecuente del miembro superior. Síntomas: parestesias/entumecimiento en **4º–5º dedos**, dolor medial del codo, debilidad de intrínsecos en casos avanzados; se agravan con la **flexión mantenida del codo** y con apoyarse en el codo.

#### Manejo conservador (primera línea en leve/moderado)
- **Educación + modificación de actividad** (evitar flexión sostenida del codo y el apoyo sobre el codo) — probablemente el componente más eficaz.
- **Férula nocturna en extensión relativa (~45°, evitando la flexión completa)** × ~3 meses.
- **Deslizamientos neurales del cubital (nerve gliders/sliders)** suaves, sin provocar síntomas.
- **Evidencia:** el ensayo aleatorizado clásico (Dellon et al., ~1989/1993; n=70, leve-moderado) encontró **sin diferencia relevante** entre férula nocturna, deslizamientos y control; **~89.5%** mejoró a 6 meses, sugiriendo que **la educación es el motor** y que férula/deslizamientos añaden poco por encima [verificar]. Serie de casos con ortesis rígida a 45° × 3 meses + modificación de actividad: **~88% de éxito** (21/24 miembros) [verificar]. Revisión sistemática 2022: mejoría en ~66% [verificar].
- **Cirugía (descompresión ± transposición)** si falla el conservador, hay debilidad/atrofia o compromiso axonal en electrodiagnóstico.

#### Pruebas clínicas (cubital) — ver sección 8
- **Test de flexión del codo** (flexión máxima + muñeca neutra/extendida, mantenido ~30–60 s; reproduce parestesias) y **Tinel** sobre el surco cubital. El **estudio de neuroconducción** (enlentecimiento a través del codo) es el hallazgo distintivo. **Tinel tiene alto VPN** (útil para descartar) pero exactitud variable.

---

### 8. Pruebas / evaluación clínica (resumen)

| Prueba | Cuadro | Maniobra (positivo = reproduce dolor/síntoma) | Exactitud (aprox.) [verificar] |
|---|---|---|---|
| **Cozen** | Epicondilalgia lateral | Extensión resistida de muñeca (puño, desv. radial), codo ~90° | Sens alta ~84–91%; espec baja → **descartar** |
| **Maudsley** | Epicondilalgia lateral | Extensión resistida del 3er dedo | Sens ~70–88% |
| **Mill** | Epicondilalgia lateral | Estiramiento pasivo: codo extendido, antebrazo pronado, flexión de muñeca | **Espec alta ~100%**, sens ~53–76% → **confirmar (rule-in)** |
| **Test epicondilitis medial** | Epicondilalgia medial | **Flexión resistida de muñeca + pronación resistida** del antebrazo; tenderness 5–10 mm distal/anterior al epicóndilo medial | Clínico; sin validación estandarizada |
| **Polk** | Medial vs lateral | Diferencia por dirección de carga que reproduce dolor | Diferencial, no de exactitud |
| **Moving valgus stress (O'Driscoll 2005)** | LCU/valgo | Valgo mantenido + flexión→extensión; dolor medial ~120°→70° | Sens ~100%, espec ~75% (n pequeño) |
| **Valgus stress estático / milking** | LCU/valgo | Valgo a ~20–30° flexión / traccionar pulgar con codo flexionado+supinado | Variable, puede ser poco específico |
| **Test de flexión del codo** | Túnel cubital | Flexión máxima sostenida ~30–60 s → parestesias 4º–5º dedo | Sens 36–93%, espec 40–99% (heterogéneo) |
| **Tinel (surco cubital)** | Túnel cubital | Percusión sobre el cubital → parestesias distales | Sens ~62–70%, espec ~53–98%; **alto VPN** |
| **Goniometría** | Todos (trauma) | Flexión/extensión y pronosupinación; **el déficit de extensión es clave** | Normal: ext 0°/flex ~140–150°; pro/sup ~80–90° |

**Imagen:** ecografía (primera línea en epicondilalgias), RM/RMA (LCU, duda), radiografía (fractura, OH, cuerpos libres), electrodiagnóstico (cubital).
**Medidas de resultado:** fuerza de **prensión indolora** (Jamar) y PRTEE/VAS en epicondilalgias; ROM goniométrica y DASH/QuickDASH en trauma/rigidez; programa de lanzamiento por intervalos superado en LCU.

---

### 9. BANDERAS ROJAS (derivar / no progresar / imagen)

- **Osificación heterotópica (OH):** **pérdida PROGRESIVA de ROM** tras fractura/luxación (sobre todo si aparece dolor al final del rango, calor local, plateau que retrocede) → **NO forzar**, imagen (Rx), valorar con cirujano. Mayor riesgo en fracturas-luxaciones (~20%) y tríada terrible.
- **Fractura oculta:** dolor desproporcionado, imposibilidad de cargar/mover, tras trauma con Rx inicial dudosa.
- **Compromiso neurovascular:** déficit o progresión en **cubital, mediano (incl. interóseo anterior) o radial (incl. interóseo posterior/PIN)**; alteración de pulso, relleno capilar, palidez, dolor isquémico → **urgente** (sospecha de síndrome compartimental tras trauma: dolor al estiramiento pasivo, parestesias, tensión → emergencia).
- **Infección:** **bursitis séptica** (calor/eritema/fiebre/fluctuación) y **artritis séptica** (codo caliente, derrame, dolor a cualquier micro-movimiento, fiebre) → no tratar con agentes físicos; derivar.
- **Otras:** rotura tendinosa aguda completa (distal del bíceps/tríceps — defecto palpable, equimosis), masa de tejidos blandos, dolor nocturno/en reposo progresivo o síntomas sistémicos (sospecha de tumor), artropatía inflamatoria.

---

### 10. Seguridad de agentes físicos (liga con `seguridadClinica`)

Los agentes físicos son **coadyuvantes**. Rige la **seguridad transversal (PARTE 0b)** y el campo `seguridadClinica`/alerta de metal del expediente. **Específico del codo:**

- **Material de osteosíntesis / implante metálico:** aplica la regla de metal (nada térmico —RF/diatermia/tecar/US térmico— sobre el material; el metal se sobrecalienta → quemadura profunda, daño óseo/periimplante). *Matiz de la literatura:* el **US terapéutico no está absolutamente contraindicado sobre metal** según revisiones basadas en evidencia (precauciones por ondas estacionarias), pero **la regla conservadora de la clínica se mantiene: no aplicar modalidad térmica sobre la osteosíntesis.** Tecar/RF **atérmica** y láser pueden usarse **lejos del material** con criterio.
- **Riesgo de OH con calor agresivo:** en el periodo post-traumático temprano, **evitar calor profundo agresivo y estiramiento pasivo vigoroso** (ambos favorecen la OH). Preferir movimiento activo controlado.
- **Marcapaso / DAI / neuroestimulador / implante coclear:** **NUNCA** diatermia (onda corta/microondas) ni **tecar/RF**; **electroterapia (TENS/EEM) y US cerca del dispositivo contraindicados/con cautela extrema**; **ESWT: no dentro de ~3 m de una persona con implante electrónico** [verificar].
- **Ondas de choque (ESWT):** la no térmica puede aplicarse **cerca de** metal, pero **evitar sobre pulmón, grandes vasos/nervios, placas de crecimiento abiertas**, en **rotura tendinosa aguda**, **embarazo**, **coagulopatía/anticoagulación**, **malignidad** en la zona.
- **Contraindicaciones generales de diatermia/US térmico:** embarazo (sobre útero/pelvis-abdomen), malignidad conocida/sospechada en la zona, TVP activa, infección activa, isquemia/enfermedad vascular periférica, zonas con sensibilidad alterada, ojos/gónadas; **US no sobre fisis abiertas** en niños.
- **Anticoagulación:** cautela con ESWT, punción seca/electropunción, MEP y técnicas que puedan sangrar; valorar riesgo.

**Regla operativa:** si el expediente marca metal/osteosíntesis, marcapaso/DAI, anticoagulación, cáncer o embarazo, el plan de agentes físicos debe documentar la alternativa segura elegida (p. ej. tecar atérmica lejos del material, láser, electroterapia analgésica fuera de zona de implante electrónico) y **la carga/ejercicio sigue siendo el tratamiento principal**.

---

### Fuentes

- Academy of Hand and Upper Extremity PT & Academy of Orthopaedic PT (APTA). **Lateral Elbow Pain and Muscle Function Impairments: Clinical Practice Guidelines.** *JOSPT* 2022;52(12):CPG1–CPG111. https://www.jospt.org/doi/10.2519/jospt.2022.0302
- **Physical Therapy for People with Lateral Elbow Tendinopathy: Using the Evidence to Guide MSK Rehabilitation Clinical Practice.** *JOSPT* 2023. https://www.jospt.org/doi/10.2519/jospt.2023.0501
- Wallis JA, et al. **Manual therapy and exercise for lateral elbow pain.** Cochrane Database Syst Rev 2024. https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD013042.pub2/references
- Coombes BK, Bisset L, Vicenzino B. **A new integrative model of lateral epicondylalgia.** Br J Sports Med 2009. https://www.researchgate.net/publication/23563091
- Coombes BK, Bisset L, Vicenzino B. **Management of Lateral Elbow Tendinopathy: One Size Does Not Fit All.** *JOSPT* 2015;45(11). https://www.jospt.org/doi/10.2519/jospt.2015.5841
- Smidt N, et al. **Corticosteroid injections, physiotherapy, or a wait-and-see policy for lateral epicondylitis.** Lancet 2002 (n=185). (Resumen vía) https://www.sciencedaily.com/releases/2013/02/130205162119.htm
- Coombes BK, et al. **Effect of Corticosteroid Injection, Physiotherapy, or Both on Clinical Outcomes in Unilateral Lateral Epicondylalgia (RCT).** *JAMA* 2013. https://jamanetwork.com/journals/jama/fullarticle/1568252
- Vuvan V, et al. **Unsupervised Isometric Exercise versus Wait-and-See for Lateral Elbow Tendinopathy.** *Med Sci Sports Exerc* 2020. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9820871/ · https://www.ovid.com/jnls/acsm-msse/abstract/10.1249/mss.0000000000002128
- **Conservative Management of Lateral Epicondylalgia: A Review.** PMC 2024. https://pmc.ncbi.nlm.nih.gov/articles/PMC11157989/
- Shahabi S, et al. **Effects of counterforce brace on pain in lateral elbow tendinopathy: systematic review/meta-analysis.** Prosthet Orthot Int 2020. https://journals.sagepub.com/doi/full/10.1177/0309364620930618
- **Immediate Effects of 2 Types of Braces on Pain and Grip (LET).** JOSPT 2014. https://www.jospt.org/doi/pdf/10.2519/jospt.2014.4744
- **ESWT vs Local Corticosteroid Injection for Chronic Lateral Epicondylitis: SR/meta-analysis.** PMC 2024. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11541127/ · Network meta-analysis tipos/intensidad ESWT: https://pmc.ncbi.nlm.nih.gov/articles/PMC13386806/ · Umbrella review ESWT/US/CSI 2025: https://link.springer.com/article/10.1186/s10195-025-00871-w
- **Medial Epicondylitis: Review of Clinical Presentation, Diagnosis, and Management (UK).** PMC 2024/25. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12931734/ · **Current concepts of medial epicondylitis.** https://orthopedicreviews.openmedicalpublishing.org/article/84275 · **Non-traumatic Medial-Sided Elbow Pain: Comprehensive Review.** https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12619105/
- **The post-traumatic stiff elbow: A review.** PMC8261251. https://pmc.ncbi.nlm.nih.gov/articles/PMC8261251/
- **Early functional mobilization for non-operative simple elbow dislocations: systematic review.** PMC8899322. https://pmc.ncbi.nlm.nih.gov/articles/PMC8899322/ · **Early functional rehab (SR + meta-analysis).** https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8568443/ · **SMDA-SEC consensus/guidelines simple elbow dislocations.** https://orthopedicreviews.openmedicalpublishing.org/article/133988 · **FuncSiE RCT cost analysis.** https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7295826/
- Hospital for Special Surgery. **Rehabilitation Clinical Guidelines — Elbow (stable fractures & simple dislocations, non-operative).** https://www.hss.edu/globalassets/files/rehab/guidelines/hssrehabilitationclinicalguidelines-elbow-stablefracturesandsimpledislocations-non-operative.pdf
- **Rehabilitation Considerations in the Management of Terrible Triad Injury to the Elbow.** (ResearchGate 2011) https://www.researchgate.net/publication/51817321 · **Terrible Triad of the Elbow — StatPearls.** https://www.ncbi.nlm.nih.gov/books/NBK589675/ · **Treatment of Neglected Elbow Dislocation with Secondary HO.** PMC12651051. https://pmc.ncbi.nlm.nih.gov/articles/PMC12651051
- **Indomethacin prophylaxis for HO after surgical fixation of elbow injuries (RCT).** PubMed 42388258 / PMC13319672. https://pmc.ncbi.nlm.nih.gov/articles/PMC13319672/ · **NSAID prophylaxis for elbow HO: SR/meta-analysis (COX-2 vs no selectivo).** https://www.sciencedirect.com/science/article/pii/S2666639125002433
- O'Driscoll SW, et al. **The "Moving Valgus Stress Test" for Medial Collateral Ligament Tears of the Elbow.** *Am J Sports Med* 2005;33(2):231–239. https://www.researchgate.net/publication/8030507 · (Physiopedia) https://www.physio-pedia.com/Moving_Valgus_Stress_Test
- **UCL / Tommy John rehabilitation & return-to-throwing** (protocolos clínicos; Thrower's Ten). https://www.vumc.org/sports-medicine/.../Postoperative%20Ulnar%20Collateral%20Ligement%20Reconstruction%20Protocol.pdf · https://thelabsportsmed.ca/tommy-john-ucl-surgery-return-to-throwing-program/
- **Clinical Management of Olecranon Bursitis: A Review.** *J Hand Surg* 2021. https://www.jhandsurg.org/article/S0363-5023(21)00092-7/fulltext · **Olecranon Bursitis — StatPearls.** https://www.ncbi.nlm.nih.gov/sites/books/NBK470291/ · (Medscape tratamiento) https://emedicine.medscape.com/article/327951-treatment
- **A Comprehensive Review of Cubital Tunnel Syndrome.** https://orthopedicreviews.openmedicalpublishing.org/article/38239 · **The Use of Physiotherapy in Conservative Treatment of Cubital Tunnel Syndrome: Critical Review.** PMC11171884. https://pmc.ncbi.nlm.nih.gov/articles/PMC11171884/ · **Conservative treatment of cubital tunnel syndrome.** PubMed 19282413. https://pubmed.ncbi.nlm.nih.gov/19282413/ · (Tinel/elbow flexion) https://www.physiotutors.com/wiki/elbow-flexion-test/ · https://www.physiotutors.com/wiki/tinel-sign-elbow/
- **Diagnostic Accuracy of Provocative Tests in Lateral Epicondylitis (Saroja/Leo).** https://www.researchgate.net/publication/287595490 · **Differences in Clinical Tests for LE (reliability + ultrasound).** PMC9914816. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9914816/ · (orthofixar Cozen/Maudsley) https://orthofixar.com/special-test/cozen-test/
- **Electrophysical Agents — Contraindications and Precautions: An Evidence-Based Approach.** PMC3031347 (Houghton et al.). https://pmc.ncbi.nlm.nih.gov/articles/PMC3031347/ · **Physiotherapy and cardiac rhythm devices.** Europace 2009. https://academic.oup.com/europace/article/11/7/850/498953

### Incertidumbres [verificar]

- **Cifras finas de los ensayos de epicondilalgia lateral** (Smidt 2002 92/47/32% y 69/91/83%; Coombes JAMA 2013 83% vs 96%, recurrencia 54% vs 12%; costos en €): tomadas de resúmenes; confirmar en el texto completo. El ensayo de n=185 con costos en euros corresponde a **Smidt et al. Lancet 2002** (ensayo holandés); el australiano análogo es **Bisset et al. BMJ 2006** (cifras algo distintas) — distinguirlos si se cita el número exacto.
- **Dosificación "6–12 sem, 3×10–15"** y el SMD de prensión indolora de Vuvan 2020 (−0.33): verificar fuente/año.
- **Exactitud de pruebas provocadoras:** los valores de **especificidad 0%** para Cozen/Maudsley del estudio de Saroja son implausibles; otras revisiones dan Cozen sens ~91%. Todas con evidencia de baja calidad e inconsistente. El **moving valgus** tiene espec basada en n=4 → imprecisa. Tinel/flexión del codo muy heterogéneos entre estudios.
- **Osificación heterotópica:** % de OH (20% vs 3%; 36% vs 54% en luxación simple) y el beneficio de la **indometacina** (ARR 21.4%, NNT 5) son de resúmenes y **hay ensayos contradictorios**; la profilaxis farmacológica es decisión médica (sopesar riesgo de pseudoartrosis).
- **Túnel cubital:** el ~89.5% del ensayo clásico (Dellon) y el ~88% de la serie de ortesis a 45° requieren verificación de año/autoría exactos.
- **Tiempos de retorno en LCU/Tommy John** (3–4 meses conservador; 12–18 meses post-reconstrucción) provienen de protocolos de clínicas, no de un protocolo único validado; el programa de lanzamiento por intervalos es por criterios.
- **US terapéutico sobre metal:** la literatura basada en evidencia (Houghton/PMC3031347) indica que **no está absolutamente contraindicado**, lo que **difiere de la regla conservadora de la clínica** (no US térmico sobre osteosíntesis). Mantener la regla de la clínica por seguridad y documentar la decisión; verificar con la política interna.
- **Protocolos de fractura-luxación / tríada terrible:** no hay estándar universal; los límites de brida (30°–120°), "evitar últimos 30° de extensión × 4 sem" y "~10°/semana" son de protocolos quirúrgicos individuales → **siempre según el cirujano tratante**.

---

## 🖐️ MUÑECA Y MANO — túnel carpiano, De Quervain, radio distal, escafoides, TFCC, dedo en gatillo, rizartrosis

### Seguridad clínica transversal (agentes físicos / implantes / SDRC)

Vale para TODO lo de esta región. **Ligar siempre con `_soapSeguridadHTML`/`seguridadClinica` de la app** (la alerta de metal ya existe, PR #419; tecar térmica/RF ya documentadas en la biblioteca MSK):

- **Material de osteosíntesis — frecuentísimo aquí** (placa volar y tornillos de **radio distal**, **tornillo de escafoides** tipo Herbert, agujas de K): **NO** radiofrecuencia, diatermia, **tecarterapia térmica** ni **ultrasonido térmico** sobre el metal. Usar agentes **atérmicos** y **lejos** del implante. La electroestimulación de superficie (TENS/NMES) es distinta de la diatermia térmica y sí se usa, no con modalidad térmica directamente sobre el metal.
- **SDRC tipo I (síndrome doloroso regional complejo)**: complicación clásica **post-fractura de radio distal** (y post-inmovilización en general) → ver banderas rojas. Durante un SDRC activo: **nada de agresividad**, agentes físicos con precaución (umbral de dolor bajo, alodinia), evitar térmicos intensos; **baños de contraste y parafina como coadyuvantes suaves** para desensibilización y preparación al movimiento (práctica consolidada en terapia de mano; evidencia de bajo nivel, [verificar]).
- **Marcapaso / DAI**: no diatermia/RF/tecar; precaución con electroterapia cerca del tórax (irrelevante por zona en mano, pero verificar el flag del paciente).
- **Parafina / baños de contraste / crioterapia**: coadyuvantes habituales de mano (rigidez, edema, dolor). La parafina está contraindicada sobre heridas abiertas, infección o pérdida de sensibilidad marcada (riesgo de quemadura).
- **Infección** (post-quirúrgica o tras punción/infiltración): fiebre + calor/eritema/drenaje → urgencia, suspender y derivar.
- **Anticoagulación, embarazo, cáncer/oncológico**: precauciones estándar de agentes físicos (ver tamiz de contraindicaciones y la caja de seguridad del expediente).
- **Ojo con el láser en STC:** la CPG de JOSPT **recomienda NO usar láser de baja potencia (LLLT), iontoforesis ni imanes** para el túnel carpiano (ver sección STC) — aunque la clínica tenga láser, para este cuadro la guía va en contra.

---

### Evaluación transversal

#### Goniometría de muñeca (valores de referencia AAOS)
Son **valores de referencia convencionales**, no normas poblacionales ni "rango estadístico normal"; medir siempre con el **mismo goniómetro/método** y comparar contra el **lado sano** del propio paciente:
- **Flexión:** ~60–80° · **Extensión (dorsiflexión):** ~60–70° · **Desviación radial:** ~20° · **Desviación cubital:** ~30° (valores AAOS reportados por Physiopedia; rangos entre estándares) **[verificar]**.
- **Prono-supinación del antebrazo** (clave en radio distal y TFCC): no hubo cifra fiable en la búsqueda; convención clínica ~80–90° cada una **[verificar]**.
- **Motion funcional** (Palmer 1985, biomecánico, n=10): la mano usa arcos mucho menores en actividades de la vida diaria (~5° flexión, ~30° extensión, ~10° radial, ~15° cubital; y el "dart-thrower's motion" —extensión-radial a flexión-cubital— es el arco funcional dominante). Útil para fijar **metas funcionales realistas** antes de perseguir el ROM máximo.

#### Dinamometría de prensión (Jamar) y pinza — la medida de resultado objetiva de la mano
- **Método estandarizado (ASHT):** sentado, hombro aducido y en rotación neutra, **codo a 90°**, antebrazo y muñeca neutros. Promediar **3 intentos**; el **mango en la 2ª posición** es el más usado. El codo y la posición alteran el valor → estandarizar entre sesiones.
- **Prensión (grip):** dinamómetro **Jamar** (patrón de referencia, ICC 0.85–0.98). Usar tablas normativas por **edad y sexo** (Mathiowetz 1985 es la normativa fundacional; Bohannon meta-análisis; Peters 2011 da **puntos de corte del percentil 5** para "claramente débil"). Orientación gruesa **[verificar contra tabla local por edad/sexo]**: percentil 5 varón 20–29 ~37 kg (81 lb), mujer ~23 kg (50 lb).
- **Pinza (pinch gauge):** tres tomas — **pinza en punta** (pulpejo–pulpejo), **pinza lateral o en llave** (la más fuerte), **pinza trípode / tres puntos**. Los valores son **específicos del instrumento** (distintos pinch gauges leen distinto) → usar siempre el mismo.
- **Comparación con el lado sano (lo operativo para alta/retorno):** reportar como **% del contralateral (índice de simetría, LSI)**. Regla práctica (convención, no respaldada por corte validado en mano — **[verificar]**): considerar el lado **dominante ~10% más fuerte** que el no dominante; **meta de alta ≈ prensión y pinza dentro del 10–20% del lado sano** (≥80–90% LSI) con uso funcional indoloro. No hay un corte de LSI validado para mano como en LCA de rodilla; úsese como objetivo clínico, no como umbral rígido.
- **MCID de prensión** citado (en poblaciones de rehabilitación): ~5–6 kg **[verificar; es específico de diagnóstico, no un criterio universal]**.

#### Pruebas especiales (sens/esp; mejor en combinación — ningún test aislado confirma/descarta)

**Túnel carpiano (STC)** — cifras pooled de metaanálisis 2023 y UpToDate (varían mucho entre revisiones):
- **Phalen** (flexión mantenida de muñecas ~60 s, reproduce parestesias en territorio mediano): **Sens ~57–70% / Esp ~67–80%** (pooled ~68/73) **[verificar]**.
- **Tinel** (percusión sobre el túnel, parestesias hacia los dedos): **Sens ~45–50% / Esp ~77–78%** — poco sensible, razonablemente específico **[verificar]**.
- **Durkan / compresión del carpo** (presión directa mantenida ~30 s sobre el túnel): la más útil — **Sens ~64–87% / Esp ~83–96%** (pooled UpToDate ~64/83; original Durkan 1991 ~87/90) **[verificar]**. **Combinar Phalen + Durkan** sube la sensibilidad.
- Apoyo con **cuestionarios** (Boston Carpal Tunnel Questionnaire) y, para severidad/decisión quirúrgica, **electrodiagnóstico** (gold standard de confirmación).

**De Quervain (1er compartimento):**
- **Finkelstein verdadero (Finkelstein 1930):** el examinador toma el pulgar y **desvía cubitalmente de golpe** → dolor agudo sobre la estiloides radial.
- **Eichhoff** (lo que **comúnmente —y erróneamente— se llama "Finkelstein"**): el paciente **empuña sobre el pulgar** y luego desvía cubital → más **falsos positivos**. Distinguirlos en la nota.
- **WHAT** (Wrist Hyperflexion and Abduction of the Thumb): maniobra más reciente, reportada como más específica **[verificar sens/esp — sin cifras robustas]**. Confirmar con dolor/edema a la palpación del 1er compartimento.

**Inestabilidad escafolunar:**
- **Watson / scaphoid shift test** (estabilizar el escafoides con presión del pulgar mientras se pasa de desviación cubital a radial; "clunk"/dolor = positivo): **Sens ~50–69% / Esp ~62–78%** **[verificar]**. **Ojo falsos positivos:** hasta **20–32% de muñecas sanas** dan "clunk" → interpretar con la clínica (historia, dolor, sensación del movimiento), no por el shift aislado.

**TFCC / DRUJ:**
- **Signo de la fóvea cubital (fovea sign, Tay 2007):** dolor a la presión puntual en el canal entre estiloides cubital/flexor cubital del carpo y el pisiforme/cabeza cubital → **Sens ~95% / Esp ~87%** para lesión foveal/ligamento ulnotriquetral **(cifra de un solo estudio, probablemente optimista — [verificar])**.
- **Ballottement (peloteo) del DRUJ:** evalúa **estabilidad de la articulación radiocubital distal**, no la fóvea en sí.
- **TFCC compression test** y **prueba de carga (weight-bearing/press test)**: reproducen dolor cubital con compresión/carga; coadyuvantes. Confirmación avanzada por artroscopia (hook test).

**Escafoides:**
- **Dolor en la tabaquera anatómica** (y a la compresión axial del pulgar / dolor en el tubérculo del escafoides): **bandera** — tratar como fractura aunque la radiografía inicial sea negativa (ver sección escafoides).

---

### Banderas rojas (toda la región muñeca/mano)

- **SDRC tipo I post-fractura (sobre todo radio distal) — detección TEMPRANA:** **dolor desproporcionado** al estímulo/fase de curación + ≥1 signo de cada categoría de **Budapest** (sensorial: alodinia/hiperalgesia; vasomotor: asimetría de color/temperatura; sudomotor/edema: edema o sudoración asimétrica; motor/trófico: rigidez, temblor, debilidad, cambios en piel/uñas/vello). Cuanto antes se detecte y se movilice suave + se controle dolor/edema, mejor el pronóstico. No sobre-inmovilizar ni sobre-cargar.
- **No-unión de escafoides:** dolor persistente en tabaquera + pérdida de fuerza/ROM semanas-meses después → reimagen; riesgo de colapso (SNAC wrist).
- **Neuropatía progresiva del mediano (STC severo):** **atrofia tenar** (eminencia tenar aplanada), debilidad de abducción/oposición del pulgar, parestesias **constantes** o pérdida sensitiva fija → **derivar a valoración quirúrgica** (la ventana para recuperar el nervio se cierra).
- **Infección:** fiebre, calor, eritema expansivo, drenaje purulento (post-quirúrgico, post-infiltración, herida) → urgencia.
- **Compromiso vascular / síndrome compartimental agudo** (post-fractura/post-reducción): dolor en aumento desproporcionado, dolor al estiramiento pasivo de los dedos, palidez, parestesias, tensión del compartimento → **urgencia quirúrgica**, no es rehab.
- **Rotura tendinosa tardía** (p. ej. extensor largo del pulgar tras fractura de radio distal, incluso no desplazada): pérdida súbita de extensión del pulgar → derivar.

---

### 🖐️ SÍNDROME DEL TÚNEL CARPIANO (STC)

> **Enfoque:** compresión del nervio mediano en el túnel carpiano. **La fisioterapia es el manejo inicial del STC leve-moderado** confirmado o sospechado (JOSPT CPG, revisión 2026). En STC **severo** (atrofia tenar / hallazgos electrodiagnósticos severos) → derivar a valoración quirúrgica.

#### Pruebas / evaluación
Phalen, Tinel, **Durkan/compresión del carpo** (el más útil, combinar con Phalen) — cifras en «Evaluación transversal» (arriba). Boston Questionnaire para síntomas/función; electrodiagnóstico para severidad y decisión quirúrgica. Buscar **atrofia tenar** y déficit sensitivo fijo (bandera de severidad).

#### A) Manejo CONSERVADOR (leve-moderado) — por criterios

**Fase 1 — Descompresión y control de síntomas (sem ~0–6):**
- **Metas:** reducir parestesias nocturnas y despertares; proteger el nervio; educación y modificación de actividad.
- **SÍ (basado en CPG JOSPT 2019 + revisión 2026):**
  - **Férula de muñeca en POSICIÓN NEUTRA, uso NOCTURNO** → alivio a corto plazo (recomendación central). Si el uso nocturno no basta, considerar **uso diurno o de tiempo completo**.
  - **Educación** (ergonomía, evitar flexo-extensión sostenida y vibración, pausas) y **modificación de la actividad**.
  - **Estiramientos** (lumbricales / generales) y **deslizamientos neurodinámicos del mediano + deslizamientos tendinosos** como **coadyuvante opcional** — evidencia mixta: pueden ayudar/acortar recuperación como añadido al cuidado conservador (Ballestero-Pérez 2017; Kim 2015), pero varios ECA **no muestran beneficio extra sobre la férula sola** en STC leve idiopático → ofrecerlos sin prometer de más, dosis sin provocar síntomas.
  - **Terapia manual** (incluye maniobras de desensibilización del SNC) como opción: el programa de **Fernández-de-las-Peñas** (3 sesiones) igualó a la cirugía en función, síntomas y fuerza de pinza **al año y a 4 años**, con **mejor resultado al 1er mes** y **mucho menor costo** → respalda **probar conservador primero** en leve-moderado.
- **NO (recomendación EN CONTRA de la CPG):** **láser de baja potencia (LLLT), iontoforesis, imanes.** No sobre-inmovilizar de día si limita la función sin necesidad.
- **Criterios para avanzar / reevaluar:** reevaluar a las **~2–7 semanas [verificar]**. Si mejoran parestesias nocturnas y Boston → progresar a fase funcional. Si **no mejora** o progresa → reconsiderar y/o derivar.

**Fase 2 — Reacondicionamiento funcional (tras mejoría sintomática):**
- **Metas:** normalizar fuerza de prensión/pinza y destreza, tolerancia a la actividad/trabajo.
- **SÍ:** progresión de fuerza de prensión/pinza (putty, grip progresivo), destreza, reentrenamiento ergonómico del gesto laboral; continuar deslizamientos a tolerancia.
- **Criterios de alta:** síntomas nocturnos resueltos o mínimos, Boston mejorado, **prensión/pinza ≥80–90% del lado sano [verificar como meta clínica]**, uso funcional indoloro.

**Cuándo DERIVAR a cirugía (liberación del túnel):**
- **STC severo:** atrofia tenar, déficit sensitivo fijo, hallazgos electrodiagnósticos severos → derivar **sin demorar** (la recuperación del nervio tiene ventana).
- **Fracaso del conservador** bien hecho (p. ej. a las ~6–12 semanas sin mejoría) o síntomas incapacitantes progresivos.

#### B) Rehab POST-LIBERACIÓN quirúrgica (abierta o endoscópica)
> **Clave de la AAOS 2024:** **la terapia supervisada NO debe prescribirse de rutina** tras la liberación del túnel (evidencia moderada); la mayoría recupera bien con indicaciones y automanejo. Reservar terapia formal para los que se estancan (rigidez, dolor en pilar persistente, debilidad, cicatriz adherida, necesidades laborales).

- **Fase temprana (sem ~0–2):** elevación y **control de edema**; **movilización precoz** de dedos, pulgar y muñeca (evitar rigidez/atrofia por inmovilidad); cuidado de la herida. Meta orientativa: **puño completo hacia el día ~14 [verificar]**. Uso ligero permitido pronto.
- **Fase intermedia (sem ~2–6):** **manejo/desensibilización de la cicatriz** (masaje, texturas), **deslizamientos tendinosos y del nervio mediano**, recuperación de ROM, inicio de fuerza suave.
- **Dolor en pilar** (pillar pain, a los lados de la cicatriz): común, suele ser **autolimitado (semanas–meses, hasta ~6 meses)**; educar y no alarmar.
- **Fase de fortalecimiento (desde ~sem 4–6):** progresión de prensión/pinza (putty, pesos pequeños) hasta uso pleno.
- **Retorno al trabajo (orientativo, depende del puesto) [verificar]:** trabajo **no repetitivo / mano no dominante** ~7–14 días; trabajo **repetitivo / mano dominante** ~6–8 semanas. **Fuerza plena puede tardar hasta ~1 año.**

---

### 👍 TENOSINOVITIS DE DE QUERVAIN

> **Enfoque:** tendinopatía/tenosinovitis estenosante del **1er compartimento dorsal** (abductor largo + extensor corto del pulgar). Muy ligada a sobreuso y a mujeres en posparto/cuidado de bebé ("tenosinovitis de las madres"). Manejo escalonado: ortesis + modificación + ejercicio; **la infiltración de corticoide es la de mayor evidencia de éxito**.

#### Pruebas / evaluación
**Finkelstein verdadero** vs **Eichhoff** (distinguirlos; Eichhoff da más falsos positivos), **WHAT test [verificar]**; dolor y edema a la palpación del 1er compartimento; descartar **rizartrosis** concomitante (grind test, dolor en la base del pulgar — ver sección rizartrosis).

#### Rehab por criterios

**Fase 1 — Descarga y control del dolor (sem ~0–6):**
- **Metas:** bajar dolor/edema, descargar el 1er compartimento.
- **SÍ:**
  - **Ortesis de pulgar tipo spica** (antebraquial, incluye muñeca y columna del pulgar hasta la IF libre). Opción **semirrígida removible** suele preferirse (mejor adherencia; la rígida tiene más abandono). **Ojo adherencia y recurrencia altas** con férula sola.
  - **Modificación de actividad** (evitar desviación cubital repetida + agarre-pinza con carga; técnica de cargar al bebé).
  - **Hielo / AINE tópico** coadyuvante; terapia manual de tejidos blandos a tolerancia.
- **NO:** gestos provocadores repetidos con carga; estiramientos agresivos en fase irritable.
- **Decisión de tratamiento (evidencia):**
  - **Infiltración de corticoide = primera línea con mayor tasa de éxito.** Metaanálisis de 16 estudios (1,206 pacientes): infiltración **RR 1.61** de éxito vs inmovilización; **combinar infiltración + férula añade beneficio**. Series observacionales (débiles): curación **~83% infiltración sola / ~61% infiltración+férula / ~14% férula sola**. Autores recomiendan **infiltración de primera línea + inmovilización como coadyuvante**.
  - **Diabéticos:** peores resultados; **la férula añadida no ayuda tanto** en diabéticos como en no diabéticos → expectativas ajustadas.
- **Criterios para avanzar:** dolor en reposo/nocturno controlado, Finkelstein mucho menos doloroso.

**Fase 2 — Carga progresiva y reintroducción (sem ~6+):**
- **Metas:** recuperar fuerza de pinza/prensión indolora, tolerar el gesto.
- **SÍ:** **ejercicio de carga progresiva del tendón**, incluido **trabajo excéntrico** del pulgar/muñeca (desviación radial/abducción controladas) — **extrapolado de principios de tendinopatía; evidencia directa en De Quervain de BAJO nivel [verificar]**; progresión a tolerancia con semáforo del dolor. Reentrenamiento del gesto y ergonomía.
- **Criterios de alta/retorno:** Finkelstein/Eichhoff indoloro o mínimo, **pinza y prensión ≥80–90% del lado sano [verificar]**, retorno a la actividad/cuidado sin recaída.
- **Si fracasa conservador + infiltraciones** (típicamente ≥1–2 infiltraciones) → valorar **liberación quirúrgica** del 1er compartimento.

#### Agentes físicos (cuál y cuándo)
Ultrasonido/láser sobre el 1er compartimento y crioterapia como **coadyuvantes de bajo nivel**; el motor es descarga + carga progresiva. (Evidencia específica débil, [verificar].)

---

### 🦴 FRACTURA DE RADIO DISTAL

> **Enfoque:** post-inmovilización (yeso) o **post-fijación (ORIF con placa volar bloqueada / agujas / fijador externo)**. Es **muy frecuente** en la clínica. Prioridades: **edema → ROM (flexo-extensión, prono-supinación, desviaciones) → fuerza de prensión progresiva**. **El cirujano marca retiro de yeso e inicio de carga.** **Vigilar SDRC tipo I** desde el día 1.

#### Pruebas / evaluación
Goniometría seriada de muñeca **y prono-supinación** (clave y a menudo lo más limitado), **dinamometría Jamar** y **pinza** vs lado sano (medida de resultado principal), medición de **edema** (volumetría/circunferencia), inspección de piel/uñas/color/temperatura (tamiz SDRC), PRWE/DASH para función.

#### Rehab por fases y criterios
> Timelines **orientativos**; mandan la **consolidación** y el protocolo del cirujano (la fijación estable permite ROM más temprano que el yeso).

**Fase 0 — Inmovilización (sem ~0–4/6, mientras consolida):**
- **Yeso/férula:** no desplazadas suelen ~**4 semanas** (según posición/severidad); retiro guiado por imagen/clínica, a menudo entre **3–8 semanas [verificar; riesgo real de retiro prematuro]**.
- **SÍ desde el día 0 (CPG JOSPT 2024 Distal Radius):** **movilidad activa de DEDOS, pulgar, codo y HOMBRO** de inmediato (prevenir rigidez y "hombro congelado" por desuso); elevación y **control de edema**; en **reparación quirúrgica, iniciar ROM activo de mano/muñeca/hombro dentro de las primeras ~3 semanas**, y **fortalecimiento ligero** (apretar toalla/putty) **desde ~sem 2** en casos no complicados → mejor ROM y prensión a corto y largo plazo.
- **NO:** carga/levantamiento con la muñeca; forzar ROM de muñeca si aún inmovilizada; descuidar el hombro.

**Fase 1 — Movilidad (tras retiro de yeso, sem ~6–12):**
- **Metas:** recuperar ROM de muñeca (flexión/extensión, **prono-supinación**, desviaciones radial/cubital); seguir bajando edema; cicatriz si ORIF.
- **SÍ:** ROM activo → activo-asistido → estiramientos suaves al final de rango; movilización de tejidos blandos y cicatriz; **baños de contraste/parafina** coadyuvantes para rigidez/edema; prensión suave.
- **NO:** cargas pesadas, levantamiento >~2–5 lb, deporte de contacto, apoyo de peso sobre la muñeca.
- **Criterios para avanzar:** consolidación confirmada por el cirujano, dolor controlado, edema en descenso, ROM funcional en progreso.

**Fase 2 — Fortalecimiento (sem ~12–16):**
- **Metas:** **fuerza de prensión progresiva**, resistencia, destreza.
- **SÍ:** fortalecimiento progresivo de muñeca/antebrazo y prensión/pinza (putty, pesos crecientes); reintroducción del gesto laboral/deportivo. Ganancias de prensión con PT supervisada se han mantenido hasta **2 años** en adultos mayores (un ECA).
- **Carga (consenso, no derivado de ensayos — [verificar]):** evitar **apoyo de peso, levantamiento pesado y deporte de contacto hasta ~12 semanas** del trazo, aunque la movilidad se sienta cómoda (el hueso cura a su propio ritmo). Rampa típica: cargas ligeras (<~5 lb) ~sem 8–12 → 5–10 lb ~sem 12–16 → **levantamiento pesado y deporte ~mes 4–6** (fuente de baja autoridad, [verificar]).
- **Criterios de alta/retorno:** ROM funcional (idealmente ≥~80% del lado sano), **prensión y pinza dentro del ~10–20% del lado sano [verificar]**, uso funcional/laboral indoloro, consolidación consolidada.

#### SDRC tipo I — complicación a VIGILAR (ver banderas rojas)
- **Factores de riesgo** asociados: fractura **intraarticular**, luxación, sexo femenino, comorbilidad musculoesquelética; se ha ligado **vitamina D baja** en posmenopáusicas.
- **Detección temprana (Budapest):** dolor desproporcionado + signos sensoriales/vasomotores/edema/tróficos → **actuar pronto** (movilización suave, control de dolor/edema, desensibilización, baños de contraste; evitar sobre-inmovilizar y sobre-cargar).
- **Vitamina C profiláctica:** **evidencia MIXTA/no concluyente.** Algunos estudios positivos (Sane 2021: 500 mg/día ~90 días redujo casos Budapest+); metaanálisis y otros ECA **sin efecto significativo**. Orthobullets cita **500 mg/día ~50 días** en fractura de radio distal (dosis menor si función renal comprometida). **Decisión médica**, no de fisioterapia; sin consenso.

#### Agentes físicos / seguridad
Con **placa volar/tornillos**, aplica la regla de metal (atérmicos, lejos del implante). En SDRC, **máxima precaución con térmicos**; parafina/baños de contraste como coadyuvantes suaves.

---

### 🦴 FRACTURA DE ESCAFOIDES

> **Enfoque:** **inmovilización larga** por la **irrigación retrógrada** (la rama carpiana dorsal de la arteria radial irriga el polo proximal) → **alto riesgo de no-unión y necrosis avascular (NAV)**, mayor cuanto más proximal el trazo. **Bandera:** dolor en la **tabaquera anatómica** tras caída sobre la mano = tratar como fractura aunque la radiografía inicial sea negativa.

#### Pruebas / evaluación
**Dolor en tabaquera anatómica**, dolor en el tubérculo del escafoides, dolor a la **compresión axial del pulgar**. Radiografía (serie de escafoides); si negativa con clínica alta → **inmovilizar y reimagen / RM** (la RM detecta la fractura oculta). Tras consolidación: goniometría, **dinamometría de prensión** vs lado sano.

#### Manejo e inmovilización
- **Sospecha con Rx negativa:** inmovilizar (férula de escafoides) y reevaluar/reimagen — **no dar de alta** por una Rx inicial negativa.
- **Fractura no desplazada de cintura (waist):** **yeso ~8–12 semanas** es el estándar inicial de primera línea. La **fijación quirúrgica precoz** reduce el riesgo relativo de no-unión vs yeso en fracturas de cintura, pero **el yeso sigue siendo primera línea**; en desplazamiento **≤2 mm**, **sin diferencia funcional a 12 meses** entre cirugía y yeso (ECA/meta 2022, SWIFFT). **Polo proximal:** más riesgo de NAV/no-unión → inmovilización más larga y umbral quirúrgico más bajo.
- **Riesgo de NAV por localización [verificar; cifras altas de fuente que cita datos antiguos]:** polo **proximal ~100%**, tercio distal ~33%.
- **Tabaquismo:** **deteriora la consolidación** (asociado a más no-unión/NAV) → consejo de cese.

#### Rehab TRAS CONSOLIDACIÓN (confirmada por imagen/cirujano)
> Antes de la consolidación, la fisioterapia se centra en lo que NO compromete el foco: dedos, codo y **hombro** activos, control de edema; **nada de carga/muñeca** mientras inmoviliza.

**Fase 1 — Movilidad (post-retiro):**
- **Metas:** recuperar ROM de muñeca (la rigidez es la regla tras inmovilización larga), seguir con edema.
- **SÍ:** ROM activo → activo-asistido → estiramiento suave; movilización de tejidos blandos; parafina/contraste coadyuvantes.
- **NO:** carga axial/impacto, apoyo de peso, hasta autorización; forzar extremos con dolor.
- **Criterios para avanzar:** consolidación confirmada, dolor controlado, ROM funcional en progreso.

**Fase 2 — Fortalecimiento y retorno:**
- **SÍ:** prensión/pinza progresiva, fortalecimiento de antebrazo, destreza; reintroducción gradual de carga e impacto (deporte al final).
- **Criterios de alta/retorno:** ROM funcional, **prensión ≥80–90% del lado sano [verificar]**, uso/deporte indoloro, **sin dolor en tabaquera** (si reaparece → descartar no-unión).
- **Vigilancia:** dolor persistente en tabaquera + pérdida de fuerza/ROM semanas-meses después → **reimagen por no-unión** (SNAC wrist si evoluciona).

#### Agentes físicos / seguridad
Con **tornillo (Herbert) o agujas**, regla de metal (atérmicos, nada térmico sobre el implante). (La estimulación de consolidación ósea en no-unión es indicación médica, no estándar de fisioterapia aquí.)

---

### 🤚 ESGUINCE DE MUÑECA / TFCC / INESTABILIDAD ESCAFOLUNAR

> **Enfoque:** conservador guiado por **estabilidad**. El "esguince de muñeca" es un cajón de sastre: antes de etiquetarlo, descartar fractura oculta (escafoides/radio distal), lesión del **TFCC** (dolor cubital) y **disociación escafolunar** (dolor dorso-radial, Watson+). La **inestabilidad** cambia el pronóstico y la conducta.

#### Pruebas / evaluación
- **TFCC/dolor cubital:** **signo de la fóvea** (muy sensible/específico en un estudio, [verificar]), **ballottement del DRUJ** (estabilidad radiocubital distal), TFCC compression / press test.
- **Escafolunar:** **Watson/scaphoid shift** (Sens ~50–69% / Esp ~62–78%, falsos positivos frecuentes; interpretar con la clínica).
- Imagen según sospecha (Rx en estrés, RM/artro-RM; artroscopia es el patrón en TFCC foveal).

#### A) TFCC (fibrocartílago triangular)
- **Manejo por estabilidad:**
  - **Estable:** ensayo **conservador hasta ~6 meses**. **Inmovilización 3–6 semanas** (algunos **4–6**); en lesiones recientes, **férula tipo Muenster** para limitar la **prono-supinación** (y/o muñeca) las primeras **~6–8 semanas** (Barlow 2016, [verificar]).
  - **Inestable / disrupción foveal con inestabilidad del DRUJ** (apoyada por RM): **consulta quirúrgica** (reparación foveal).
- **Rehab por fases (conservador):**
  - **Fase 1 (protección, sem ~0–6):** ortesis/Muenster, control de dolor/edema, **evitar carga en desviación cubital y rotación resistida**; ROM de dedos/codo/hombro libre.
  - **Fase 2 (movilidad, tras protección):** recuperar prono-supinación y ROM de muñeca a tolerancia; **estabilizadores del DRUJ y cubitales** (extensor/flexor cubital del carpo, pronador cuadrado) con progresión; **propiocepción** de muñeca.
  - **Fase 3 (carga/retorno):** carga progresiva en cadena cerrada, agarre y rotación con resistencia, gesto deportivo/laboral (deportes de raqueta/golf/apoyo con cautela).
  - **Criterios de alta:** dolor cubital indoloro en carga/rotación, **prensión ≥80–90% del lado sano [verificar]**, DRUJ estable, retorno sin recaída.

#### B) Inestabilidad escafolunar (disociación)
- **Parcial / dinámica / reducible:** conservador — ortesis dorsal, **reentrenamiento del "dart-thrower's motion"** (extensión-radial ↔ flexión-cubital, el arco que protege el escafolunar), fortalecimiento de los **músculos "SL-friendly"** (extensor cubital del carpo, flexor radial del carpo, abductor largo del pulgar) y **propiocepción**; evitar cargas en extensión + desviación radial agresiva. **[Evidencia de bajo nivel/consenso — verificar.]**
- **Completa / estática (DISI) / crónica:** suele requerir **cirugía** (reparación/reconstrucción) → derivar.

#### Agentes físicos / seguridad
Coadyuvantes de dolor/edema (crio, US/láser atérmico, TENS). Sin material salvo post-quirúrgico (entonces aplica la regla de metal).

---

### 🔒 DEDO EN GATILLO (tenosinovitis estenosante — polea A1)

> **Enfoque:** desproporción tendón–polea **A1** → bloqueo/chasquido al flexo-extender el dedo. Conservador razonable en grados bajos; la **infiltración de corticoide** es el pilar médico de primera línea; **la ortesis es efectiva a corto plazo**.

#### Pruebas / evaluación / estadiaje
- Palpar nódulo/chasquido sobre la **A1** (base del dedo, cara palmar). **Estadiaje de Quinnell (mod. Green):** **I** pre-gatillo (dolor/molestia, sin bloqueo); **II** bloqueo activo **reductible activamente**; **III** bloqueo que requiere **reducción pasiva** (IIIA extensión bloqueada, IIIB flexión bloqueada); **IV** **contractura fija** en flexión de la IFP. (La escala **SST** clasifica el triggering con más detalle; Quinnell sigue siendo la referencia en ensayos.)

#### Rehab por criterios
**Fase 1 — Descarga (sem ~0–6):**
- **Metas:** romper el círculo de bloqueo-inflamación, bajar dolor/nódulo.
- **SÍ:**
  - **Ortesis de bloqueo**, **tiempo completo ~6 semanas** (evidencia: uso de tiempo completo **~81% de éxito** vs **~53%** solo nocturno; SR 2025 confirma eficacia a corto plazo). **Articulación a bloquear:** **MCF (MCP) es lo más común** (~77% éxito vs ~50% bloqueando la IFD, y más cómoda → más horas de uso); **bloqueo de la IFP** es efectivo y a veces **más cómodo/estético → más adherencia**. No hay consenso sobre cuál articulación; elegir por comodidad/adherencia.
  - **Modificación de actividad** (evitar agarres sostenidos con fuerza).
- **Ejercicio (menos respaldado que la ortesis):** **ejercicios de bloqueo (blocking)** y **deslizamientos tendinosos** (mantener MCF en extensión mientras flexiona IFP/IFD) → series combinadas ortesis + ejercicio reportan éxito ~55% [verificar].
- **Infiltración de corticoide:** primera línea médica, suele combinarse con ortesis; alternativa/añadido cuando la ortesis sola no basta o el paciente la rechaza.
- **Criterios para avanzar:** menos episodios de bloqueo, dolor controlado.

**Fase 2 — Reintroducción:**
- **SÍ:** recuperar deslizamiento tendinoso completo y ROM, prensión progresiva, reeducar el gesto.
- **Criterios de alta:** sin bloqueo/chasquido, ROM completo del dedo, prensión funcional.
- **Derivar a cirugía (liberación de A1):** **grado IV (contractura fija)**, grados altos que no ceden, o fracaso de ortesis ± infiltraciones. **Diabéticos:** peor respuesta al conservador/infiltración (expectativas ajustadas).

---

### 👍 RIZARTROSIS (artrosis trapeciometacarpiana / de la base del pulgar)

> **Enfoque:** artrosis de la articulación **trapeciometacarpiana (CMC del pulgar)**. **El conservador es el pilar** (ejercicio + ortesis + protección articular), con **mejor respuesta en estadios tempranos**. Muy frecuente en mujeres mayores; impacta pinza y agarre.

#### Pruebas / evaluación / estadiaje
- **Grind test** (compresión + rotación de la CMC reproduce dolor/crepitación), dolor a la palpación de la base del pulgar, prueba de subluxación. Descartar **De Quervain** concomitante.
- **Estadiaje de Eaton-Littler (I–IV)** por radiografía (I: espacio normal/laxitud; II–III: estrechamiento/osteofitos; IV: compromiso escafotrapecial/pantrapecial).
- **Dinamometría de pinza (en llave especialmente) y prensión** vs lado sano = medida de resultado clave.

#### Rehab por criterios
**Fase 1 — Protección y control del dolor:**
- **Metas:** bajar dolor, estabilizar la CMC, proteger la articulación.
- **SÍ (evidencia):**
  - **Ortesis de pulgar** (CMC ± MCF; neopreno flexible o termoplástico): mejora síntomas, sobre todo en **Eaton I–II** (mejoran ~76% I–II vs ~54% III–IV; un ECA: uso ~6 sem mejoró dolor, función y prensión en estadios 1–2). Evidencia global **moderada/limitada**. Uso diurno en actividad y/o nocturno según tolerancia.
  - **Educación en PROTECCIÓN ARTICULAR y productos de apoyo/adaptaciones** (abridores, mangos gruesos, evitar pinza de llave con fuerza sostenida) — recomendación estándar de las guías de artrosis de mano (ACR/EULAR).
  - **Terapia manual + ejercicio terapéutico:** **evidencia de calidad moderada** de que **reducen el dolor** a corto/medio plazo (SR/MA 16 ECA, 1,145 pacientes).
- **NO:** cargas máximas de pinza en fase dolorosa; inmovilización rígida prolongada innecesaria.
- **Criterios para avanzar:** dolor en actividad controlado, tolerancia a ejercicio.

**Fase 2 — Estabilización y fuerza:**
- **SÍ:** fortalecimiento de **oponente/abductor del pulgar, 1er interóseo dorsal**, estabilizadores de la CMC; **ejercicio propioceptivo/estabilización dinámica** (protocolos de FNP/propiocepción, piloto prometedor en estadios tempranos); progresión de pinza/prensión funcional.
- **Criterios de alta:** dolor de base controlado, pinza/prensión funcionales y más simétricas vs lado sano, uso de estrategias de protección articular en la vida diaria.
- **Derivar:** dolor refractario y/o **Eaton III–IV** con fallo del conservador (± infiltración) → valoración quirúrgica (trapecectomía/artroplastia/reconstrucción de Eaton-Littler en inestabilidad).

#### Agentes físicos (cuál y cuándo)
Calor/parafina antes del ejercicio, TENS/US/láser para dolor como coadyuvantes de bajo nivel; algún dato de magnetoterapia para dolor/función a corto plazo (calidad baja-moderada, [verificar]). El motor es ortesis + ejercicio + protección articular.

---

### Fuentes

**Túnel carpiano (STC):**
- APTA Orthopaedics & Hand/Upper Extremity Academies. *Hand Pain and Sensory Deficits: Carpal Tunnel Syndrome — CPG* (original 2019, JOSPT 49(5)) y **Revisión 2026** (JOSPT 56(4)). https://www.jospt.org/doi/10.2519/jospt.2019.0301 · https://www.jospt.org/doi/10.2519/jospt.2026.0301 · resumen: https://www.jospt.org/doi/10.2519/jospt.2019.0501
- AAOS. *Management of Carpal Tunnel Syndrome — CPG* (2024; post-op supervised therapy no de rutina). https://www.aaos.org/globalassets/quality-and-practice-resources/carpal-tunnel/carpal-tunnel-2024/cts-cpg.pdf
- Fernández-de-las-Peñas et al. *Manual Physical Therapy vs Surgery for CTS* (JOSPT 2017) · *4-Year Follow-Up* (Phys Ther 2020) · *Cost-Effectiveness* (JOSPT 2019) · *Pain processing* (Eur J Pain 2017). https://www.jospt.org/doi/full/10.2519/jospt.2017.7090 · https://academic.oup.com/ptj/article/100/11/1987/5881394 · https://www.jospt.org/doi/10.2519/jospt.2019.8483 · https://onlinelibrary.wiley.com/doi/full/10.1002/ejp.1026
- Ballestero-Pérez et al. *Effectiveness of Nerve Gliding Exercises on CTS: SR* (2017) · Kim. *Tendon and nerve gliding exercises for CTS: SR of RCTs* (J Phys Ther Sci 2015). https://pubmed.ncbi.nlm.nih.gov/26357452/
- Meta-análisis de maniobras de examen para STC (Phalen/Tinel/Durkan) (Cureus 2023). https://pmc.ncbi.nlm.nih.gov/articles/PMC10446104/ · UpToDate: *CTS — Clinical manifestations and diagnosis*. https://www.uptodate.com/contents/carpal-tunnel-syndrome-clinical-manifestations-and-diagnosis

**De Quervain:**
- Challoumas et al. *Corticosteroid injection vs immobilisation for De Quervain's: SR & MA* (2024). https://www.sciencedirect.com/science/article/abs/pii/S2468122924000719
- *Effectiveness of Corticosteroid Injection for DQST: SR & MA* (PMC4655850) · Peters-Veluthamaningal et al. (Cochrane/trial 2009, PubMed 19588376) · ECA en diabéticos (PMC8415982). https://pubmed.ncbi.nlm.nih.gov/19588376/

**Fractura de radio distal:**
- Academy of Orthopaedic & Hand PT (APTA). *Distal Radius Fracture Rehabilitation — CPG* (JOSPT 2024, 54(9); AROM temprano, fortalecimiento ligero desde ~sem 2). https://www.jospt.org/doi/10.2519/jospt.2024.0301
- Handoll et al. *Rehabilitation for distal radial fractures in adults* (Cochrane 2015). https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD003324.pub3/full
- Resumen Physiotutors (supervisado vs domiciliario; prensión mantenida a 2 años). https://www.physiotutors.com/research/distal-radius-fracture-rehabilitation/

**SDRC / vitamina C:**
- SR de prevención de SDRC tras fractura de radio distal (MDPI, J. Funct. Morphol. Kinesiol. 2026). https://www.mdpi.com/2411-5142/11/2/158
- Sane et al. *Prophylactic vitamin C for CRPS after DRF* (2021). https://journals.sagepub.com/doi/10.1177/22104917211056946 · Revisión PLOS ONE (sin efecto significativo). https://journals.plos.org/plosone/article/file?id=10.1371/journal.pone.0314307 · Orthobullets CRPS (dosis 500 mg/50 d). https://www.orthobullets.com/basic-science/6095/complex-regional-pain-syndrome-crps · Criterios de Budapest (Harden et al. 2007/2010).

**Escafoides:**
- Simon et al. *Postoperative Immobilization of Scaphoid Fractures: Comprehensive Review* (J Hand Surg/HAND 2023). https://pubmed.ncbi.nlm.nih.gov/35575303/
- SWIFFT y meta 2022: cirugía vs yeso en fracturas de cintura (Bone & Joint J 2022). https://boneandjoint.org.uk/Article/10.1302/0301-620X.104B8.BJJ-2022-0085.R2 · Meta cast vs fixation (PMC13222678).
- Irrigación retrógrada / NAV: Gelberman & Menon (1980, fundacional); clasificación de Herbert (no-unión/estadios).

**TFCC / esguince / escafolunar:**
- Atzei. *Foveal TFCC Tear Classification and Treatment* · Tay et al. *Ulnar fovea sign* (2007). https://www.andreaatzei.it/wp-content/uploads/2011/11/HC-def.pdf
- Palmer (1989, clasificación TFCC, fundacional); Hand Therapy Academy (férula Muenster, Barlow 2016). https://www.handtherapyacademy.com/treatments/management-of-a-tfcc-injury-in-hand-therapy/ · TFCC compression test (Physiotutors). https://www.physiotutors.com/wiki/tfcc-compression-test/
- Watson (scaphoid shift): precisión (J Clin Med, PMC9656589). https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9656589/ · Watson & Ballet (1984, fundacional) · *Current Concepts in Scapholunate Instability* (Indian J Orthop 2023). https://link.springer.com/article/10.1007/s43465-023-00839-0

**Dedo en gatillo:**
- *Efficacy of Splinting in Managing Adult Trigger Finger: SR of Short-Term Outcomes* (J Hand Surg Glob Online 2025). https://www.jhsgo.org/article/S2589-5141(25)00201-4/fulltext · Quinnell (1980) / modificación de Green (estadiaje) · Hand Therapy Academy (revisión conservador). https://www.handtherapyacademy.com/reviews/a-review-on-the-conservative-management-of-trigger-finger/

**Rizartrosis (CMC del pulgar):**
- *Conservative interventions in thumb CMC OA: SR & MA* (16 ECA, 1,145 participantes; PubMed 25559974). https://pubmed.ncbi.nlm.nih.gov/25559974/ · ECA de férula en estadios tempranos (PMC7775706). https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7775706/ · Estadiaje de Eaton-Littler · Guías de artrosis de mano ACR/EULAR (protección articular).

**Evaluación (goniometría / dinamometría):**
- Valores AAOS de ROM (Physiopedia, *Range of Motion Normative Values*). https://www.physio-pedia.com/Range_of_Motion_Normative_Values · Palmer et al. *Functional wrist motion: a biomechanical study* (1985, PubMed 3968403).
- Estándar ASHT de prensión; Mathiowetz et al. (1985, normativa fundacional); Bohannon (meta descriptiva Jamar); Peters et al. *Revised normative values for grip strength with the Jamar* (2011). https://onlinelibrary.wiley.com/doi/10.1111/j.1529-8027.2011.00318.x

---

### Incertidumbres [verificar]

- **Cifras finas de pruebas especiales:** los rangos de sens/esp de Phalen/Tinel/Durkan, Watson y el signo de la fóvea varían mucho entre revisiones (criterios de inclusión y patrón de referencia distintos). El **fovea sign ~95%/87%** viene de **un solo estudio** (probablemente optimista). Confirmar contra la fuente primaria antes de fijarlas.
- **Grados exactos de goniometría:** los valores AAOS son **referencias convencionales**, no normas poblacionales; usar el **lado sano** del paciente como referencia operativa. Prono-supinación normal (~80–90°) **sin cifra robusta** en la búsqueda.
- **Umbrales de prensión/pinza para alta (LSI):** **no existe un corte validado** para mano (a diferencia de LCA en rodilla). El **≥80–90% del lado sano** y el ajuste del **~10% por dominancia** son **convención clínica**, no evidencia fuerte.
- **Semanas de inmovilización y rampa de carga (radio distal y escafoides):** los plazos (yeso ~4 vs 8–12 sem; carga hasta ~12 sem; rampa de pesos) salen de fuentes heterogéneas y de **baja autoridad**; **manda la consolidación y el cirujano**. Varios números provienen de guías de paciente/blogs, marcados por verificar.
- **Riesgo de NAV del escafoides por localización (~100% proximal):** cifra citada de datos antiguos; probablemente sobreestima → verificar con serie reciente.
- **Ejercicio excéntrico en De Quervain:** **extrapolado** de principios de tendinopatía; **evidencia directa escasa**. La infiltración es lo mejor documentado.
- **Neurodinamia/deslizamientos en STC:** beneficio como **añadido** es inconsistente; varios ECA no muestran valor extra sobre la férula sola.
- **Vitamina C para SDRC:** **no concluyente** (estudios en ambos sentidos); es decisión médica.
- **Dedo en gatillo (cifras de éxito por articulación/horario de ortesis):** varias provienen de resúmenes secundarios; el **HANDGUIDE** y los ECA primarios deben consultarse para fijar protocolo.
- No se accedió a los **PDF primarios** de las CPG de JOSPT (STC 2026, radio distal 2024) ni de la de AAOS; las recomendaciones citadas vienen de resúmenes de búsqueda. Antes de estandarizar, **leer el texto completo de la CPG correspondiente**.

---

#### Notas para quien integre esto a la app
- Este material alimenta la biblioteca de **muñeca/mano**. Encaja con la pestaña **📋 Protocolo**: los cuadros ya están en formato "fases por criterios + qué falta" reutilizable como `PROTO_LIB` de mano/muñeca, igual que la biblioteca MSK.
- Agentes físicos descritos "solo cuál y cuándo" (sin dosimetría), para ligar con `_protoSegFlags`/`seguridadClinica`. La **caja roja de metal** (placa de radio distal, tornillo de escafoides) y la **precaución de SDRC** deben saltar automáticamente vía `_soapSeguridadHTML`.
- La **dinamometría de prensión/pinza vs lado sano** es la medida de resultado objetiva de toda la región → buen candidato a capturarse estructurado en valoración/revaloración para alimentar el semáforo de alta.

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
- "Rehabilitation Phases, Precautions, and Mobility Goals Following THA." PMC10626929 (fases y criterios por abordaje). https://pmc.ncbi.nlm.nih.gov/articles/PMC10626929/
- Ohio State University — Total Hip Arthroplasty Post-op Clinical Practice Guideline, update 2022 (precauciones por abordaje). https://medicine.osu.edu/-/media/files/medicine/departments/sports-medicine/medical-professionals/hip/total-hip-arthroplasty-cpg-update-2022.pdf
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

- Topes numéricos del abordaje ANTERIOR/lateral (extensión ~20°, rotación externa ~50°, 6 semanas): provienen de protocolos institucionales (OSU 2022, Salina 2024); no son estándar único y varían por centro.
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

> **Para qué sirve este documento.** Es **material de referencia** para que el fisioterapeuta ubique **en qué fase va el paciente, qué restricciones aplican y si va en tiempo o desfasado** tras una artroscopia de cadera por pinzamiento femoroacetabular (FAI) con reparación del labrum (± femoroplastia / acetabuloplastia), y para encuadrar el **manejo conservador** del FAI/labrum.
> **NO es una prescripción automática.** El protocolo quirúrgico, las restricciones de carga y los límites de rango los **define el cirujano** (dependen de la técnica exacta: tamaño de la resección, calidad del labrum, cierre capsular, microfractura/condroplastia concomitante). Ante duda o discrepancia, **manda la hoja del cirujano**. Progresión **por criterios, no por calendario**: las semanas son guía.

---

### 0. Encuadre y reglas de oro

> **Aplican las reglas de oro del inicio** (criterios > calendario · la carga es el motor · semáforo del dolor); en post-qx **manda la hoja del cirujano**. Lo **específico de la cadera de preservación**:

- **Respetar el tejido en reparación.** El labrum reinsertado con anclas y la cápsula suturada necesitan protección temprana de los rangos que los tensan (ver §5). Microfractura/condral concomitante = plazos de descarga mucho más largos.
- **Ojo con el psoas:** la sobreactivación del psoas/flexores → **tendinitis del iliopsoas iatrogénica** es la complicación de rehab más frecuente de esta cirugía (manejo en §5 y §7).
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
- **Vigilar el psoas:** si se vuelve el motor de la flexión (dolor anterior con flexión resistida, chasquido doloroso), **reducir trabajo de flexión activa, reforzar glúteos y control**, y revalorar (ver §7).

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
---

## 🦵 RODILLA — prótesis / artroplastia (TKA · nota de UKA)

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
- **Quirúrgico (inestable):** protocolos **~12–16 sem**; **tornillo** clásico 3–6 meses vs **suture-button/tightrope + rehab acelerada <2 meses** (comentario 2024). Fútbol profesional post-qx grado IIB/III: **~72±28 días** a entrenamiento con equipo (D'Hooghe et al.). Tasa de retorno agrupada en élite **~96%**.
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
Rige la **seguridad transversal (PARTE 0b)** — anticoagulación, embarazo, cáncer, marcapaso/DAI. Específico de tobillo/pie:
- **Metal/osteosíntesis/tornillos de sindesmosis o fijación:** nada térmico (RF/diatermia/tecar/US térmico) sobre el material. En post-Broström con anclas y post-sindesmosis con tornillo/suture-button, agentes atérmicos y lejos del implante.
- **TVP:** vigilar en inmovilización prolongada (sobre todo Aquiles).

### Incertidumbres marcadas (revisar antes de fijar)
1. ⚠ "No dorsiflexión más allá de neutro / no estiramiento del tríceps sural precoz" en Aquiles: convención muy usada, pero **no encontré un umbral con cita primaria directa**; la tendencia moderna admite movilidad activa temprana a neutro. Confirmar con el cirujano/protocolo local.
2. ⚠ Grados exactos de recomendación (A/B/C) de la CPG JOSPT 2021 para inmovilización vs movilización, terapia manual, equilibrio y bracing: necesité el texto completo de la tabla de recomendaciones (no accesible en esta sesión). La dirección (favorecer carga óptima, terapia manual para DF, entrenamiento neuromuscular grado A, bracing grado A para prevención) es consistente, pero confirmar las letras.
3. ⚠ Sens/Esp de varias pruebas provienen de fuentes secundarias (Physiopedia/blogs) que repiten estudios primarios; verificar van Dijk 1996, Croy 2013, Wang 2013 y el metaanálisis de sindesmosis 2021 antes de citar cifras exactas.
4. Protocolos post-op (Broström, sindesmosis qx) **varían mucho**; presenté el rango convencional vs acelerado. Siempre manda el cirujano.

---

## 🦶 PIE (no traumático) — fascitis plantar, tibial posterior, peroneos, Morton, hallux

> **Alcance y uso.** Documento de referencia clínica para la biblioteca de la clínica. **Complementa** la sección de tobillo (esguince lateral, lesión sindesmal, reconstrucción de Broström, tendinopatía aquílea); aquí se cubre la **patología del pie no traumática / por sobreuso**, con foco en la **fasciopatía plantar** (muy frecuente, ~65 pacientes). La carga del tríceps sural solo se referencia (ver sección de Aquiles del documento de tobillo).
> **Esto NO es prescripción automática.** Es evidencia sintetizada para razonar el plan; el fisio individualiza. La progresión se rige por **CRITERIOS**, no por calendario (los tiempos son para fijar expectativas).
> **Seguridad primero.** Antes de cualquier agente físico, revisar `seguridadClinica` (metal/osteosíntesis, marcapaso/DAI, anticoagulación, cáncer, embarazo, diabetes con neuropatía). Ver la sección final "Seguridad de agentes físicos".

### Principios transversales (aplican a todos los cuadros)

> **Aplican las reglas de oro del inicio** (la carga es el motor · criterios > calendario). Lo **específico del pie** (patología mayormente tendinopática/por sobreuso):

- **Monitoreo del dolor transversal (semáforo tipo Silbernagel).** Regla práctica usada en tendinopatías y aplicable aquí:
  - **Verde (seguir):** dolor durante el ejercicio ≤3/10 **y** sin empeorar a las 24 h (rigidez/dolor del primer paso de la mañana igual o mejor que la semana previa).
  - **Ámbar (con calma):** dolor 4-5/10 o ligero aumento que cede en 24 h → mantener carga, no progresar.
  - **Rojo (bajar y reevaluar):** dolor >5/10, o dolor matutino peor 3 días seguidos, o dolor nocturno/en reposo → reducir carga y descartar bandera roja.
  La **"regla de las 24 h"** (el síntoma vuelve a su basal a la mañana siguiente) es el termómetro más útil en carga del pie [verificar: umbrales exactos 2/3/4-10 varían entre fuentes, no hay ensayo validado del umbral].
- **Individualizar** por edad, peso corporal, ocupación (bipedestación prolongada), deporte/gesto, calzado, comorbilidades (diabetes, artropatía inflamatoria) y estado del tejido.

---

### 1. Fasciopatía / fascitis plantar (dolor de talón plantar)

#### 1.1 Terminología y concepto
Dolor en la cara plantar del talón por sobrecarga de la fascia plantar en su origen (tubérculo calcáneo medial). Histológicamente es **degenerativo/no inflamatorio** más que "itis" → se prefiere **fasciopatía** o **dolor de talón plantar**; "fascitis plantar" sigue siendo el término clínico más usado. Guía de referencia: **CPG de JOSPT "Heel Pain—Plantar Fasciitis"** (McPoil/Martin et al., Revisión 2014; **Revisión 2023** de Koc, Bise, Neville, Carreira, Martin y McDonough).

#### 1.2 Factores de riesgo (para educación y prevención de recaída)
- **Dorsiflexión de tobillo limitada** (tríceps sural corto) — factor modificable asociado.
- **Sobrepeso/obesidad** (IMC alto), sobre todo en población no deportista.
- **Bipedestación/carga laboral prolongada** (jornadas de pie).
- **Corredores / aumento rápido de volumen** de carrera o cambios de calzado/superficie.
- Pie plano o cavo, pronación excesiva (asociación menos consistente).

#### 1.3 Evaluación clínica
- **Dolor del primer paso de la mañana** y tras reposo (hallmark); mejora al "calentar" y reaparece con carga prolongada.
- **Palpación del tubérculo calcáneo medial** (origen de la fascia): dolor focal reproducible. El dolor plantar, NO en los lados del calcáneo (eso orienta a fractura por estrés).
- **Windlass test** (ver 1.8): confirma, no excluye.
- **Test de dorsiflexión en carga (lunge/estocada)**: cuantifica la limitación de rango (factor modificable y objetivo de tratamiento).
- Diferenciar de: fractura por estrés del calcáneo, síndrome del túnel del tarso, atrofia de la almohadilla grasa, artropatía inflamatoria, radiculopatía S1 (ver Banderas rojas, sección 8).

#### 1.4 Manejo — enfoque por fases/criterios
> Las intervenciones no son secuenciales estrictas; se combinan. Lo que cambia por fase es el **objetivo** y la **tolerancia a la carga**.

**Fase 1 — Control de síntomas y descarga relativa** *(criterio de entrada: dolor agudo/irritable, primer paso muy doloroso)*
- **Metas:** bajar la irritabilidad, educar, mantener carga tolerable (no reposo absoluto).
- **Qué SÍ:**
  - **Educación + manejo de carga:** explicar naturaleza benigna pero lenta; modular (no eliminar) la actividad que provoca; evitar picos bruscos de carga.
  - **Estiramiento fascia-específico (protocolo de DiGiovanni):** sentado, cruzar el tobillo afectado sobre la rodilla contraria y **traccionar los dedos en dorsiflexión** (tensa la fascia vía mecanismo de windlass), confirmando tensión con palpación de la fascia; ~10 repeticiones de 10 s, 3 veces/día (al levantarse y antes de ponerse de pie). Añadir **estiramiento de tríceps sural** (gastrocnemio/sóleo).
  - **Vendaje (taping) antipronación / low-Dye** o elástico: la CPG 2023 lo recomienda **junto con** otras intervenciones para mejoría de dolor y función a corto plazo.
  - **Ortesis/plantillas (prefabricadas o a medida):** recomendadas por la CPG 2023 para alivio a corto plazo, **en combinación** (no como único tratamiento del dolor agudo).
  - **Férula nocturna 1-3 meses:** la CPG 2023 la indica cuando el dolor es consistentemente peor con el **primer paso matutino**.
  - **Agentes físicos como coadyuvantes de dolor** (no sustituyen carga): la CPG favorece terapia manual/estiramiento/ortesis **por encima** de las modalidades electroterapéuticas (recomendación débil); puede usarse fonoforesis con gel de ketoprofeno para dolor.
- **Qué NO / restricciones:** no indicar reposo absoluto prolongado; no perseguir "0 dolor" antes de cargar; cuidado con corticoide repetido (ver 1.6).
- **Criterio de avance:** dolor del primer paso en descenso y carga diaria tolerable con semáforo verde/ámbar.

**Fase 2 — Carga progresiva (reconstrucción de tolerancia)** *(criterio de entrada: irritabilidad controlada, tolera estiramiento y marcha diaria)*
- **Metas:** aumentar capacidad de carga de la fascia y del complejo aquíleo-plantar; corregir déficit de dorsiflexión y de fuerza del tríceps/intrínsecos.
- **Qué SÍ:**
  - **Ejercicio de carga de alta intensidad (protocolo de Rathleff 2015):** **elevaciones de talón unilaterales con una toalla enrollada bajo los dedos** (la toalla añade rango y activa el mecanismo de windlass), **día por medio**. Progresión por carga descrita en el ensayo/guías derivadas [verificar contra el artículo original, Scand J Med Sci Sports 2015;25(3):e292-300]:
    - Sem 1-2: **3×12 RM**
    - Sem 3-4: **4×10 RM**
    - Sem 5-8: **5×8 RM**
    - **Tempo lento:** ~3 s subida (concéntrico) / 2-3 s pausa isométrica arriba / 3 s bajada (excéntrico).
    - Progresar la carga con mochila/libros conforme tolere.
  - **Fortalecimiento de intrínsecos ("short foot"/pie corto)** como coadyuvante (evidencia baja-moderada, razonable sumarlo).
  - Continuar estiramientos y ortesis/taping según respuesta.
- **Qué NO / restricciones:** no saltar etapas de carga; respetar la regla de 24 h; no progresar en semáforo ámbar.
- **Criterio de avance:** tolera 5×8 RM con buen control y dolor ≤3/10 que cede en 24 h; dorsiflexión en mejora.

**Fase 3 — Reintroducción de impacto / retorno a actividad-deporte** *(criterio de entrada: carga pesada tolerada, marcha prolongada sin flare)*
- **Metas:** reintroducir impacto (trote/carrera, saltos, gesto deportivo) por dosis crecientes.
- **Qué SÍ:** progresión caminar-correr (aumentar **duración → frecuencia → intensidad**, en ese orden), monitoreando con la regla de 24 h; diferir trabajo de velocidad ~6-8 semanas [verificar]. Mantener el trabajo de fuerza como mantenimiento.
- **Qué NO:** no reanudar volumen/velocidad previos de golpe; no ignorar el dolor matutino ascendente.

#### 1.5 Ondas de choque (ESWT) — en crónicos/refractarios
Opción para **fasciopatía crónica/recalcitrante** que no cede con carga + medidas básicas (focales y radiales se usan; la evidencia es algo más firme para focales). Mejora dolor matutino y función en varios metaanálisis. **Efectos adversos** habituales: dolor local y eritema en la zona del calcáneo (transitorios). **No** hay evidencia de que cause rotura de fascia (a diferencia del corticoide). Ver contraindicaciones en la sección 9.

#### 1.6 Infiltración de corticoide — contexto y riesgos (lo hace el médico, el fisio debe conocerlo)
- **Beneficio:** alivio **solo a corto plazo**.
- **Riesgos a vigilar/educar:** **rotura de la fascia plantar** (estimaciones ~2.4-10%, mayor con **inyecciones repetidas** y **obesidad**) y **atrofia de la almohadilla grasa plantar** (frecuencia muy variable, 1.5-40% según series) [verificar: cifras de series retrospectivas pequeñas]. Guiado por ecografía reduce riesgo/mejora precisión.
- **Implicación fisio:** ante dolor súbito plantar **post-infiltración** con chasquido/equimosis/pérdida del arco → sospechar rotura de fascia (bandera roja, sección 8).

#### 1.7 Expectativas / timeline de hitos (para el paciente)
- Es un cuadro **lento**: la mayoría mejora en **semanas a varios meses**; buena parte resuelve en torno al año (cohortes citan ~70% resueltos a 1 año, ~80% a largo plazo) [verificar: Rathleff 2015, Wolgin 1994]. Casos crónicos (>3 meses) suelen requerir **3-6 meses** de rehabilitación sostenida.
- **Manejar expectativas desde la 1ª consulta** evita abandono y "shopping" de tratamientos.

#### 1.8 Criterios de alta / retorno
- Dolor del primer paso mínimo (≤2-3/10) y en descenso ≥1 semana.
- Marcha/bipedestación laboral prolongada sin flare a 24 h.
- **Single-leg heel rise** indoloro y con buena resistencia (meta funcional ~25 reps según objetivos del paciente) [verificar].
- Para corredores: progresión caminar-correr completada sin recaída a 24 h.

---

### 2. Tendinopatía del tibial posterior (disfunción del tibial posterior / pie plano adquirido del adulto, PPAA)

#### 2.1 Concepto y estadios
Insuficiencia progresiva del tibial posterior → pérdida del arco longitudinal medial, retropié en valgo y antepié en abducción. Clasificación de referencia: **Johnson y Strom (1989)**, con el **Estadio IV de Myerson (1996)**. Terminología moderna propone "tendinopatía del tibial posterior" para estadios iniciales.
- **Estadio I:** tendón intacto pero doloroso/engrosado, **sin deformidad**, pie aún móvil. Dolor/edema posteromedial.
- **Estadio II:** elongación/disfunción del tendón, **deformidad flexible** (reductible), "too many toes", heel-rise unipodal débil o imposible. **Es el estadio clave para el fisio.**
- **Estadio III:** deformidad **rígida/fija**, cambios degenerativos subtalares.
- **Estadio IV:** valgo del tobillo por insuficiencia del ligamento deltoideo.
> **Regla de oro:** el tratamiento conservador es más eficaz en **estadios I-II (deformidad flexible)**; III-IV suelen ser quirúrgicos.

#### 2.2 Evaluación
- **Single-leg heel rise** (ver 7): incapacidad de elevar el talón unipodal, o sin inversión del retropié al elevarse → sugiere disfunción.
- **Signo "too many toes"** (demasiados dedos): visto por detrás, se ven **>1.5-2 dedos** laterales por abducción del antepié/valgo del retropié.
- Palpación/dolor a lo largo del trayecto posteromedial (maléolo medial → navicular).
- Fuerza de inversión resistida (en flexión plantar) dolorosa/débil.

#### 2.3 Manejo conservador (estadios I-II) — por fases/criterios
**Fase 1 — Descarga y control** *(irritable)*
- **Metas:** bajar carga del tendón, soportar el arco.
- **Qué SÍ:** **ortesis** (plantilla con soporte de arco medial / cuña, u **ortesis tobillo-pie articulada corta** en casos más marcados — la ortesis es más eficaz mientras la deformidad es flexible); modificación de actividad; control de dolor.
- **Qué NO:** cargar en valgo sin soporte; impacto repetitivo.

**Fase 2 — Carga progresiva** *(dolor controlado)*
- **Qué SÍ:** fortalecimiento **excéntrico/progresivo del tibial posterior** (inversión resistida con banda en flexión plantar), elevaciones de talón progresando a unipodal, control del arco e intrínsecos, equilibrio/propiocepción. El protocolo no-operatorio de referencia (**Alvarez et al., 2006**) combinó ortesis + **ejercicio de alta repetición agresivo**, con éxito elevado en estadios I-II (~89%, ~11% requirió cirugía) [verificar cifras].
- **Criterio de avance:** heel-rise unipodal posible y controlado, sin flare a 24 h.

**Fase 3 — Función/retorno:** reintroducir marcha prolongada, impacto y gesto deportivo por dosis; mantener ortesis según necesidad.

#### 2.4 Criterios de derivación
Deformidad **rígida** (estadio III-IV), fracaso de 3-6 meses de manejo conservador bien hecho, dolor incapacitante persistente, o colapso progresivo del arco → **valoración de cirugía ortopédica**.

---

### 3. Tendinopatía de los peroneos (breve)

- **Concepto:** sobrecarga de peroneo largo/corto en la cara **lateral** del tobillo/pie (a menudo tras inestabilidad lateral — nexo con la sección de tobillo). Diferenciar de subluxación/luxación de peroneos (chasquido, inestabilidad del tendón) y de esguince lateral.
- **Evidencia:** **débil** (consenso ESSKA-AFAS 2018 clasifica el manejo conservador como nivel V, opinión de experto; no hay protocolo de carga validado específico para peroneos).
- **Manejo (por criterios):** control de carga inicial → **progresión isométrico → concéntrico → excéntrico** de eversión/flexión plantar, control del retropié y propiocepción; vendaje/órtesis en deporte de contacto; corregir el déficit de estabilidad lateral asociado.
- **Qué SÍ / NO:** sí carga progresiva y trabajo de estabilidad del tobillo; evitar impacto lateral agresivo en fase irritable.
- **Derivación:** fracaso de 3-6 meses de conservador, o sospecha de inestabilidad/luxación tendinosa → ortopedia.
- **Recuperación:** estimada ~6-12 semanas en casos no complicados [verificar: dato de fuentes clínicas, no de ensayo].

---

### 4. Metatarsalgia / neuroma de Morton (breve)

- **Neuroma de Morton:** fibrosis perineural del nervio interdigital (típico 3er espacio), dolor plantar en antepié, "piedra en el zapato", disestesias a los dedos, peor con calzado estrecho/tacón.
- **Prueba de Mulder (click):** compresión latero-lateral de las cabezas metatarsianas ± presión plantar → dolor/click palpable reproducible. Sensibilidad reportada muy variable (desde ~60-70% hasta 94-98% según fuente; especificidad alta ~90%) [verificar: discrepancia no resuelta entre fuentes]; apoyar con imagen (ecografía/RM) si duda.
- **Manejo conservador:** **modificación de calzado** (puntera ancha, bajar tacón), **almohadilla metatarsiana colocada PROXIMAL a las cabezas** (no justo bajo el punto doloroso) para abrir el espacio, modificación de actividad/descarga. Derivar si persiste >6 semanas; escalón siguiente: corticoide, luego excisión quirúrgica.
- **Metatarsalgia (general):** descarga del antepié (plantilla/almohadilla), calzado, control de carga; descartar fractura por estrés metatarsiana (bandera roja) y artropatía inflamatoria.

---

### 5. Hallux valgus y hallux rigidus (breve, conservador)

#### 5.1 Hallux valgus ("juanete")
- **Conservador de 1ª línea:** ortesis/plantillas, **ejercicio** (combinado con **separador interdigital**, férula nocturna o taping; una red de metaanálisis sugiere que ejercicio + soporte externo reduce ángulo/dolor; pauta ~**3×/semana ≥8 semanas** para leve-moderado), analgesia, calzado ancho. El soporte da alivio sintomático a corto plazo; la evidencia de la fisioterapia **aislada** es limitada.
- **Cuándo derivar (umbral NICE):** fracaso de medidas conservadoras adecuadas tras **~3 meses** con dolor/discapacidad persistente. La cirugía (p. ej. osteotomía en chevron) supera a la ortesis cuando el síntoma principal es **dolor al caminar**; no garantiza evitar recurrencia.

#### 5.2 Hallux rigidus (artrosis de la 1ª metatarsofalángica)
- **Conservador (evidencia débil-moderada):** moderada para **ortesis/calzado a medida** (suela rígida/balancín que limita la dorsiflexión del hallux) e infiltración de ácido hialurónico; **movilidad/terapia manual** con evidencia débil; AINEs insuficiente.
- **Qué SÍ:** calzado de suela rígida/rocker, modificación de actividad, movilidad articular tolerada, control del dolor.
- **Derivación:** dolor/limitación persistente → **queilectomía** (enfermedad moderada) o **artrodesis** (avanzada) con evidencia moderada.

---

### 7. Pruebas / evaluación (resumen con sensibilidad/especificidad donde existe)

| Prueba | Para qué | Técnica (resumen) | Rendimiento diagnóstico |
|---|---|---|---|
| **Windlass test** | Fasciopatía plantar | Dorsiflexión pasiva del hallux (mejor **en carga**, de pie sobre taburete) → dolor en origen de la fascia | **Muy específico, poco sensible**: ~**100% esp / ~32% sens** (en carga 31.8%); LR+ ~1.47 (De Garceau 2003). **Confirma, NO excluye**. Fiabilidad intra/inter-examinador alta (ICC ~96-99%). Variante "Windlass Shield" 2026 más sensible pero preliminar (n=45) |
| **Palpación tubérculo calcáneo medial** | Fasciopatía plantar | Dolor focal plantar-medial en el origen | Dolor plantar (no lateral) orienta a fascia vs fractura |
| **Test de dorsiflexión en carga (lunge/estocada)** | Rango de dorsiflexión (factor de FP; objetivo de tto) | Rodilla hacia la pared, talón apoyado; medir distancia dedo-pared o ángulo tibial | Sin cutoff único consensuado: ~**30°** o ~**9-10 cm** como referencia de normalidad; limitación = factor de riesgo de FP. Fiabilidad buena [verificar MDC] |
| **Single-leg heel rise** | Tibial posterior / resistencia tríceps | Elevación de talón unipodal; observar nº de reps e **inversión del retropié** | Incapacidad o ausencia de inversión → disfunción del tibial posterior. Fiabilidad test-retest ICC ~**0.78-0.96** (sano) |
| **Signo "too many toes"** | PPAA / tibial posterior | Visto por detrás; contar dedos laterales visibles | Afectado: **>1.5-2 dedos** visibles. Fiabilidad **moderada**, depende del ángulo de observación |
| **Prueba de Mulder (click)** | Neuroma de Morton | Compresión latero-lateral de metatarsianos ± presión plantar | Sens muy variable (**~60-98%**), esp ~90% [verificar discrepancia]; apoyar con imagen |
| **Test de compresión/squeeze del calcáneo** | Fractura por estrés del calcáneo (bandera roja) | Compresión medial-lateral del calcáneo → dolor | Dolor en los **lados** del calcáneo (vs plantar en FP). Sens/esp aprox ~64%/~80% [verificar, fuente no primaria] |
| **Tinel sobre túnel del tarso** | Atrapamiento del nervio tibial posterior (bandera roja) | Percusión posteromedial al maléolo medial → disestesias irradiadas | Apoya dx; confirmar con NCS/EMG + RM si masa |

---

### 8. Banderas rojas (derivar / no tratar como sobreuso)

- **Fractura por estrés del calcáneo o metatarsiano:** dolor que **empeora con la carga** (y tras la actividad, a diferencia del dolor de "primer paso" de la FP), posible **dolor nocturno/en reposo**, **test de compresión del calcáneo positivo** (dolor en los lados, no plantar), antecedente de aumento rápido de carga/carrera. Radiografía precoz suele ser normal → puede requerir RM/gammagrafía/TC. **No cargar agresivamente; derivar.**
- **Atrapamiento del nervio tibial posterior (síndrome del túnel del tarso):** dolor **quemante/hormigueo/irradiado** posteromedial y plantar, **dolor en reposo** (ayuda a distinguir de FP), a veces **sensibilidad del talón preservada** (lesión distal), Tinel positivo. Confirmar con NCS/EMG + RM (descartar masa ocupante). Diferenciar de FP y de neuroma de Morton.
- **Artropatía inflamatoria** (espondiloartritis, AR): dolor **multiarticular**, **rigidez matutina prolongada**, entesitis en varios sitios, síntomas sistémicos → derivar a reumatología.
- **Rotura de la fascia plantar** (clásicamente **post-infiltración** de corticoide): dolor súbito plantar con chasquido/equimosis/caída del arco. Diferente del dolor insidioso de la FP.
- **Pie de riesgo en diabético:** signos neuropáticos (pérdida de sensibilidad protectora) y/o **vasculares** (ausencia de pulsos, piel fría, úlcera, cambios tróficos) → precaución máxima; valorar pie diabético antes de cargar agente/ejercicio de impacto (ver sección 9).

---

### 9. Seguridad de agentes físicos (liga a `seguridadClinica`)

> Antes de aplicar cualquier agente, revisar en el expediente `seguridadClinica` (implantes, condiciones, banderas rojas, contraindicaciones). La alerta del expediente salta ROJA ante: marcapaso/desfibrilador, anticoagulación, cáncer/metástasis, osteosíntesis/prótesis/placa/clavo/tornillo, embarazo, trombosis.

- **Ondas de choque (ESWT):** contraindicaciones habituales (consenso ISMST / criterios de exclusión en ensayos) [verificar lista vigente en ISMST]:
  - **Tumor/neoplasia en la zona de tratamiento** (el tumor local es contraindicación; el cáncer como enfermedad de base se valora caso a caso),
  - **Marcapaso/dispositivos implantados**, **coagulopatía/anticoagulación**, **embarazo**,
  - **fisis abiertas** (niños/adolescentes) en la zona, **infección o lesión cutánea** en el sitio.
  - Adversos esperables: dolor local y eritema transitorios.
- **Material de osteosíntesis / implante metálico (si hubo cirugía del pie):** **NO** aplicar **radiofrecuencia/tecar térmica, diatermia ni ultrasonido térmico sobre el metal** (riesgo de calentamiento del implante). Usar modalidades atérmicas o alejadas del material; preferir carga/ejercicio.
- **Diabético con neuropatía / sensibilidad alterada:** **precaución con agentes térmicos** (termoterapia, US térmico, tecar/RF térmica): el paciente puede no percibir el sobrecalentamiento → riesgo de quemadura. El **ejercicio NO está contraindicado** (es 1ª línea aun con pérdida de sensibilidad protectora), pero debe ser **gradual, supervisado y con inspección del pie**.
- **Marcapaso/DAI:** no RF/diatermia/tecar ni ESWT sin autorización; evitar corrientes sobre el tórax/cercanía del dispositivo.
- **Embarazo, cáncer activo, trombosis/TVP, anticoagulación:** valorar individualmente; muchos agentes quedan contraindicados o restringidos.
- **Jerarquía:** la carga (ejercicio terapéutico) es el motor; los agentes físicos son **coadyuvantes** de dolor que facilitan cargar. La CPG de JOSPT 2023 favorece **terapia manual, estiramiento y ortesis** por encima de las modalidades electroterapéuticas en la fasciopatía plantar.

---

### Fuentes (guía / autor / año + enlaces)

**Fasciopatía plantar — guía y tratamientos**
- JOSPT CPG Heel Pain—Plantar Fasciitis, Revisión 2023 (Koc, Bise, Neville, Carreira, Martin, McDonough): https://www.jospt.org/doi/10.2519/jospt.2023.0303 · PDF AOPT: https://www.orthopt.org/uploads/content_files/files/Heel_Pain_Plantar_Fasciitis_Revision_2023.pdf
- JOSPT CPG Revisión 2014 (McPoil/Martin et al.): https://www.jospt.org/doi/10.2519/jospt.2014.0303
- Comentario internacional a la CPG 2023 (JOSPT 2025): https://www.jospt.org/doi/10.2519/jospt.2025.0202
- Rathleff et al. 2015, carga de alta intensidad, Scand J Med Sci Sports (PMID 25145882): https://pubmed.ncbi.nlm.nih.gov/25145882/ · PDF: https://braceworks.ca/wp-content/uploads/2016/04/Rathleff-og-M%C3%B8lgaard-2014_High-load-strength-training-improves-outcome-in-patients-with-plantar-fasciitis-A-randomized-controlled-trial-with-12-month-follow-up.pdf
- DiGiovanni et al., estiramiento fascia-específico, JBJS 2003 y seguimiento 2 años 2006: https://www.kintec.net/wp-content/uploads/2016/12/DiGiovanni.-Stretching-and-PF-RCT-JBJS.pdf · https://www.jbjs.org/reader.php?rsuite_id=837726
- Windlass test (De Garceau 2003), PubMed: https://pubmed.ncbi.nlm.nih.gov/12793489/ · Physiotutors: https://www.physiotutors.com/wiki/windlass-test/ · variante Windlass Shield 2026: https://doi.org/10.1177/24730114261486025
- ESWT fasciopatía crónica (metaanálisis RCT): https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5403108/ · ESWT vs US (revisión sistemática): https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8803385/
- Riesgos del corticoide (rotura de fascia / atrofia almohadilla): https://pmc.ncbi.nlm.nih.gov/articles/PMC2684947/ · Cochrane corticoides dolor de talón: https://pmc.ncbi.nlm.nih.gov/articles/PMC6481652/ · red metaanálisis mínimamente invasivos 2026: https://www.nature.com/articles/s41598-026-40038-z
- Ejercicio de intrínsecos / short foot: revisión sistemática (ScienceDirect): https://www.sciencedirect.com/science/article/abs/pii/S1466853X1630075X · activación por RM: https://pmc.ncbi.nlm.nih.gov/articles/PMC5094843/
- Dorsiflexión / lunge test (revisión fiabilidad/MDC): https://www.researchgate.net/publication/272524534_Reliability_and_minimal_detectable_change_of_the_weight-bearing_lunge_test_A_systematic_review
- Pronóstico/trayectoria a 12 meses: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12266988/ · AAFP Plantar Fasciitis 2019: https://www.aafp.org/pubs/afp/issues/2019/0615/p744.html

**Tibial posterior / PPAA**
- Johnson y Strom (1989) + modificación Myerson: https://www.inova.org/sites/default/files/education/podiatric_residency/Johnson_and_Strom_Myerson_Modification.pdf
- Alvarez et al. 2006, protocolo no-operatorio (ortesis + ejercicio): https://www.bcsorthopedics.com/articles/alvarez-post-tib-dysfunction-managed-with-orthosis%20.pdf
- Revisión fisioterapia PTTD (narrativa, 2025): https://www.researchgate.net/publication/399562201_Physiotherapy_point_of_view_on_posterior_tibial_tendon_dysfunction_A_narrative_review · Physiopedia: https://www.physio-pedia.com/Posterior_Tibial_Tendon_Dysfunction
- Single-leg heel rise (fiabilidad): https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8514424/ · "too many toes" (precisión): https://pmc.ncbi.nlm.nih.gov/articles/PMC13337338/

**Peroneos**
- Consenso ESSKA-AFAS 2018 (vía resumen): https://physio-learning.com/en/ressources/exercices-tendinopathie-fibulaires/ · Physiopedia: https://www.physio-pedia.com/Peroneal_Tendinopathy

**Neuroma de Morton / metatarsalgia**
- AMBOSS Morton neuroma: https://www.amboss.com/us/knowledge/morton-neuroma · Orthobullets: https://www.orthobullets.com/foot-and-ankle/7041/interdigital-mortons-neuroma · prueba de Mulder: https://www.michiganfootdoctors.com/mulders-click-test/

**Hallux valgus / rigidus**
- Hallux valgus, actualización basada en NICE: https://pmc.ncbi.nlm.nih.gov/articles/PMC12699283/ · RCT cirugía vs ortesis vs espera (JAMA): https://jamanetwork.com/journals/jama/fullarticle/193839 · ejercicio + soporte externo (red metaanálisis): https://www.sciencedirect.com/science/article/abs/pii/S1268773125002024
- Hallux rigidus, manejo no operatorio (revisión): https://pmc.ncbi.nlm.nih.gov/articles/PMC5318145 · algoritmo basado en evidencia: https://www.elsevier.es/en-revista-revista-espanola-cirugia-ortopedica-traumatologia-429-articulo-proposed-global-treatment-algorithm-for-S1988885614001096

**Banderas rojas / diagnóstico diferencial / seguridad de agentes**
- AAFP Heel Pain: Diagnosis and Management 2018: https://www.aafp.org/pubs/afp/issues/2018/0115/p86.html · diferencial de dolor de talón: https://www.hmpgloballearningnetwork.com/site/podiatry/a-guide-to-the-differential-diagnosis-of-heel-pain
- Fractura por estrés del calcáneo (caso/retraso dx): https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12121967/
- Túnel del tarso: Physiopedia https://www.physio-pedia.com/Tarsal_Tunnel_Syndrome · Orthobullets https://www.orthobullets.com/foot-and-ankle/7042/tarsal-tunnel-syndrome · StatPearls tibial neuropathy: https://www.ncbi.nlm.nih.gov/books/NBK582151/
- Agentes físicos y neuropatía diabética / precauciones: https://musculoskeletalkey.com/physical-agent-modalities-2/ · Physiopedia Diabetic Neuropathy: https://www.physio-pedia.com/Diabetic_Neuropathy

### Incertidumbres [verificar]
- **Dosis exacta de Rathleff 2015** (3×12RM → 4×10RM → 5×8RM, tempo 3-2-3, día por medio): la progresión proviene de guías derivadas; **confirmar contra el artículo original** (Scand J Med Sci Sports 2015;25(3):e292-300). El beneficio fue superior al estiramiento a los 3 meses pero **sin diferencia a 6 y 12 meses**.
- **Umbrales del semáforo del dolor y "regla de 24 h"** (2/3/4-10): heurísticos de fuentes clínicas; no hay ensayo que valide un umbral específico frente a recurrencia.
- **Windlass test**: ~100% esp / ~32% sens de un estudio pequeño (n=45 grupos mezclados); la variante "Windlass Shield" es preliminar (n=45, 2026).
- **Mulder (neuroma)**: discrepancia grande entre fuentes (60-70% vs 94-98% sens); no resuelta.
- **Squeeze del calcáneo**: ~64%/~80% proviene de página clínica, no de estudio primario.
- **Corticoide**: rotura 2.4-10% y atrofia 1.5-40% son de series retrospectivas pequeñas, subreportadas → incidencia real incierta.
- **Contraindicaciones de ESWT**: confirmar lista vigente en el consenso ISMST actual (y consenso en alemán) antes de barridos.
- **Cutoff de dorsiflexión en lunge** (30° / 9-10 cm): sin consenso único; métodos de medición dispares.
- **Alvarez 2006 (~89% éxito estadios I-II, ~11% cirugía)**: estudio no reciente; confirmar cifras.
- **Tiempos de recuperación** (peroneos 6-12 sem; FP crónica 3-6 meses; ~70% a 1 año): mezcla de datos de cohorte y estimaciones de fuentes clínicas; usar como expectativa, no como garantía.
- Búsqueda limitada a resúmenes de WebSearch (sin acceso a texto completo); las cifras finas deben cotejarse con la fuente primaria antes de usarse en decisiones clínicas.

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

Observación para la integración en la app: esto encaja con el modelo de `docs/biblioteca_protocolos.md` y `PROTO_LIB` (periodización por criterios, carga como motor, agentes físicos coadyuvantes, semáforo del dolor transversal). Estas 2 condiciones conservadoras (isquios P8, aductor/ingle P9) y las 4 notas breves son candidatas a nuevas entradas de la biblioteca MSK.

---
