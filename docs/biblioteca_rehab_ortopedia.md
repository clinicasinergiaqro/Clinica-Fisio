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
- **Metal / osteosíntesis / prótesis / tornillos / anclas / placas:** **NO** radiofrecuencia, diatermia, **tecarterapia térmica**, ni **ultrasonido térmico** sobre el material. Usar agentes **atérmicos** y **lejos** del implante. (La electroestimulación de superficie — TENS/NMES para activar músculo o analgesia — **NO** es diatermia térmica y **sí puede usarse**; basta con no colocar los electrodos directamente sobre el implante.)
- **Marcapaso / DAI / neuroestimulador:** NO diatermia/onda corta/RF/tecar ni electroterapia cerca del dispositivo (crítico en columna cervical/dorsal por la cercanía torácica).
- **Esqueleto inmaduro / placas de crecimiento (fisis) abiertas (niños y adolescentes):** NO ultrasonido terapéutico ni diatermia/onda corta sobre la fisis abierta (precaución clásica de electroterapia en menores); preferir agentes atérmicos y el ejercicio. Aplica p. ej. a la espondilólisis del adolescente y a la OCD juvenil.
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
| Más útiles combinados | Sin dolor al sentarse, banda en 2 etapas, Romberg anormal (⚠️ el adormecimiento **perineal/en silla de montar** NO es signo de estenosis: es bandera de **cauda equina** → §3.1) | Ninguno fuerte aislado |

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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Dolor lumbar común sin radiculopatía ni bandera roja (~90–95% de los casos); se clasifica por tiempo (aguda <6 sem · subaguda 6–12 sem · crónica ≥12 sem) y se estratifica el riesgo (STarT Back).
>
> **⛔ Contraindicaciones / cuándo derivar:** No tratarlo como inespecífico si hay banderas rojas (cauda equina → urgencias HOY, fractura, cáncer, infección, AAA, déficit neurológico progresivo/pie caído — §3), ni si hay componente radicular (→ §8) o claudicación neurógena (→ §9).
>
> **⚠️ Precauciones:** Progresar por CRITERIOS, no por calendario. NO reposo en cama, NO imagen de rutina, NO lenguaje nocebo, NO opioides de rutina. La carga/ejercicio es el motor; agentes físicos y terapia manual solo como coadyuvantes. En crónico, abordaje biopsicosocial (CFT, educación en dolor). Respetar seguridad de agentes físicos (§11, `seguridadClinica`).

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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Dolor radicular / ciática por hernia discal lumbar (dolor de pierna dominante, patrón de raíz). Historia natural muy favorable: la mayoría mejora sin cirugía en ~4–6 semanas y la hernia tiende a reabsorberse.
>
> **⛔ Contraindicaciones / cuándo derivar:** URGENTE si cauda equina (§3.1 → quirófano) o déficit motor severo/rápidamente progresivo o pie caído (valoración en días). Electiva: dolor radicular invalidante que NO mejora tras ~6–12 sem de conservador bien conducido con hernia concordante. Vigilar siempre el déficit neurológico progresivo.
>
> **⚠️ Precauciones:** Progresar por CRITERIOS (centralización, §6.3). Evitar posturas/movimientos que **periferalizan** y el reposo prolongado; favorecer los que **centralizan**. Ejercicio + educación como base; terapia manual coadyuvante; analgesia según médico. Respetar seguridad de agentes físicos (§11).

#### 8.1 Historia natural (muy favorable — tranquilizar)
- **La mayoría mejora SIN cirugía.** La ciática por hernia suele mejorar sustancialmente en **~4–6 semanas** con manejo conservador.
- **Reabsorción espontánea** de la hernia es frecuente: más probable cuanto más **extruido/secuestrado** el fragmento (secuestrado > extrusión amplia > protrusión contenida), y más temprano (reabsorción significativa ≥50% en ~1/3 de pacientes dentro del 1er año) `[verificar]`.
- → El mensaje al paciente: "la hernia tiende a reabsorberse y los síntomas a ceder; el tiempo y el movimiento controlado juegan a favor".

#### 8.2 Manejo conservador por fases
**Base:** educación (pronóstico favorable), **mantener actividad**, ejercicio + preferencia direccional (centralización, §6.3), analgesia según médico, neurodinamia suave. Terapia manual coadyuvante.

- **FASE 1 — Protección relativa / control del dolor radicular** (criterio: dolor de pierna dominante, irritable). Metas: bajar dolor neural, centralizar, mantener movilidad. ✅ Posiciones y movimientos que **centralizan**; caminar; neurodeslizamientos suaves; educación. ❌ Posturas/movimientos que **periferalizan**; reposo prolongado; flexión sostenida provocadora si periferaliza.
- **FASE 2 — Recuperación activa** (criterio: síntomas centralizados, dolor de pierna cede). Metas: restaurar control motor y carga, resistencia del tronco, tolerancia a sedestación/flexión según tolerancia. ✅ Ejercicio progresivo (control motor + fuerza + aeróbico), exposición gradual. 
- **FASE 3 — Reacondicionamiento y retorno** (criterio: sin dolor de pierna, fuerza normalizándose). Metas: fuerza/resistencia completas, patrón de carga (bisagra de cadera), retorno a trabajo/deporte/gesto. En tendón/deportista ver la biblioteca MSK (HSR); para el adolescente con espondilólisis, §10.

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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Rehabilitación tras microdiscectomía lumbar. El ejercicio suele iniciar ~4–6 semanas (sin consenso del momento óptimo); el programa domiciliario ≈ supervisado en eficacia.
>
> **⛔ Contraindicaciones / cuándo derivar:** Los protocolos y restricciones los fija el equipo quirúrgico — confírmalos antes de progresar. Avisar al cirujano ante déficit neurológico nuevo o progresivo.
>
> **⚠️ Precauciones:** Fase de protección (~0–4/6 sem): evitar flexión repetida/cargada, levantamiento y rotación cargada. Retorno laboral: sedentario ~2 sem, manual/pesado ~6–8 sem [verificar]. "Manda el cirujano": confirmar restricciones. Respetar seguridad de agentes físicos (§11).
> Protocolos varían por cirujano. Confirma restricciones con el equipo quirúrgico.
- **Inicio de ejercicio:** la evidencia (Cochrane 2003) respalda que **programas de ejercicio que inician a las ~4–6 semanas** mejoran función y retorno al trabajo a corto plazo, sin diferencia a largo plazo vs programas suaves; algunos protocolos inician **ejercicio suave/movilidad inmediato** (mejora movilidad y retorno más temprano) y otros sugieren mejores resultados iniciando ~12 sem — **no hay consenso del momento óptimo** `[verificar]`. Programas **domiciliarios = supervisados** en eficacia.
- **Fases (criterio-dependientes):**
  - **0–4/6 sem (protección):** marcha progresiva, control de dolor, higiene de columna, movilidad neural suave, activación de core de baja carga; evitar flexión repetida/cargada, levantamiento, rotación cargada.
  - **~4–6 sem (fortalecimiento):** estabilización lumbar dinámica (reduce dolor, mejora movilidad y acelera retorno al trabajo); fortalecimiento de extensores; progresión de carga.
  - **Avanzada:** reacondicionamiento, patrón de levantamiento (bisagra de cadera), retorno a trabajo/deporte.
- **Retorno al trabajo:** sedentario ~2 semanas; manual/pesado ~**6–8 semanas**; restricción de levantamiento pesado hasta ~6–8 sem `[verificar]`.

#### 8.5 Rehabilitación POST-FUSIÓN lumbar (artrodesis)

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Rehabilitación tras fusión lumbar (artrodesis). Más conservadora que la microdiscectomía porque hay que proteger la consolidación ósea; la fisioterapia formal suele iniciar ~6–12 semanas.
>
> **⛔ Contraindicaciones / cuándo derivar:** MUY dependiente del cirujano, número de niveles y consolidación — confirma SIEMPRE las restricciones con el equipo quirúrgico. Avisar ante déficit neurológico nuevo o signos de no-unión.
>
> **⚠️ Precauciones:** Precauciones BLT (flexionar/levantar/rotar) restringidas ~6–12 sem. Fase temprana: levantamiento limitado (~2–4.5 kg [verificar]), evitar flexión/rotación cargadas e impacto; sin correr/saltar/alto impacto hasta ~3 meses. Faja, restricción de NSAIDs y estimulador óseo según cirujano. "Manda el cirujano". Respetar seguridad de agentes físicos (§11).
> **MUY dependiente del cirujano, número de niveles y consolidación ósea. Confirma SIEMPRE las restricciones.** Más conservador que la microdiscectomía porque hay que proteger la consolidación.
- **Precauciones BLT** (Bending/Lifting/Twisting — flexionar, levantar, rotar): se restringen típicamente **~6 a 12 semanas** `[verificar por protocolo]`.
- **Fase temprana (≈0–6/12 sem):** caminar + programa domiciliario suave; **levantamiento limitado ~2–4.5 kg (5–10 lb)** `[verificar]`; evitar flexión/rotación cargadas e impacto; conducir cuando esté sin opioides y sin debilidad de pierna (~2–4 sem). Fisioterapia formal suele iniciar **6–12 sem**.
- **Fase media (≈6–12 sem a 3–6 meses):** suben límites de carga gradualmente; se introduce **resistencia ligera ~8–12 sem**; aún se evita levantamiento pesado y rotación forzada; sin correr/saltar/alto impacto hasta ~3 meses `[verificar]`.
- **Fase tardía / retorno:** trabajo pesado **3–6 meses o más** (a veces restricciones permanentes); **recuperación funcional completa 6–12 meses** `[verificar]`.
- Nota: uso de faja, restricción de NSAIDs (por su posible efecto en consolidación) y estimulador óseo dependen del cirujano.

---

### 9. CUADRO C — ESTENOSIS del canal lumbar (claudicación neurógena)

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Adulto mayor con dolor/pesadez/adormecimiento en glúteos y piernas al caminar o estar de pie (extensión) que **alivia al sentarse o inclinarse adelante (flexión)**. Manejo conservador multimodal (terapia manual + ejercicio) antes de cirugía.
>
> **⛔ Contraindicaciones / cuándo derivar:** Diferenciar de claudicación vascular (ésta no alivia con flexión; valorar pulsos, prueba de la bicicleta §6.4). Derivar a valoración quirúrgica si claudicación invalidante que no responde o déficit neurológico progresivo; cauda equina = urgencia. Los esteroides epidurales NO son efectivos.
>
> **⚠️ Precauciones:** Progresar por criterios. Trabajar en **FLEXIÓN** (flexión lumbar, bicicleta estática, marcha inclinada); **evitar extensión lumbar sostenida/provocadora y cargas en extensión**. Respetar seguridad de agentes físicos (§11).

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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Lumbalgia del adolescente deportista por gestos de **extensión + rotación repetida** (gimnasia, clavados, fútbol americano, tenis, danza, vóley). Espondilólisis (defecto de la pars) ± espondilolistesis; la mayoría se maneja sin cirugía y regresa a su deporte (retorno ~4–5 meses [verificar]).
>
> **⛔ Contraindicaciones / cuándo derivar:** No volver al deporte con dolor. Valorar/derivar ante dolor persistente que no responde o progresión del deslizamiento; descartar banderas rojas de la región (§3). Mandan los **criterios clínicos**, no la curación radiográfica.
>
> **⚠️ Precauciones:** Progresar por criterios. Fase temprana: suspender el gesto provocador (extensión/rotación), trabajar control motor en posición **neutra/antilordótica**; evitar extensión/rotación cargada. Ortesis (TLSO) según equipo (evidencia inconsistente). Respetar seguridad de agentes físicos (§11).

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
- **Seguridad primero:** antes de manipular/traccionar columna cervical, **descartar banderas vasculares y mielopatía** (§1-§2); respetar implantes/metal, marcapaso, embarazo, anticoagulación, cáncer (`seguridadClinica`, §11).

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
| Marcha en tándem | ~66% | ~84% |

> **Lectura:** Babinski y clonus son **muy específicos** (positivo = fuerte sospecha) pero poco sensibles (negativo NO descarta). La **marcha** y la **hiperreflexia** son lo más sensible. Un **clúster** (desviación de marcha + Hoffmann + supinador invertido + Babinski + edad >45 años) es útil para apoyar el diagnóstico (Cook et al.).

**Conducta:** sospecha razonable → **derivar a valoración neuro-quirúrgica / RM**, **NO manipular, NO traccionar, NO forzar extensión cervical**. Ejercicio suave de control y educación mientras se deriva; marcarlo en `seguridadClinica`.

#### 1.2 Patología vascular del cuello (disección de arteria cervical / insuficiencia vertebrobasilar)
**Marco de referencia:** *IFOMPT International Framework* (2020, publicado en JOSPT 2022, Rushton et al.). Reemplazó el término "disfunción arterial cervical (CAD)" por **"patologías vasculares del cuello"**. Es **informativo, no prescriptivo**: obliga a razonamiento clínico antes de cualquier terapia manual/tracción cervical.

**Las "5 D y 3 N" (signos clásicos):** *Dizziness* (mareo/vértigo), *Diplopía*, *Disartria*, *Disfagia*, *Drop attacks* (caídas súbitas sin pérdida de conciencia) + *Nistagmo*, *Náusea*, *Numbness* (entumecimiento facial / adormecimiento perioral). **Advertencia del marco:** estos signos suelen ser **tardíos y poco específicos**; no esperar a tenerlos todos.
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
- **Fractura por compresión osteoporótica** (ver §1.5): dolor dorsal agudo en mujer posmenopáusica/adulto mayor, a veces tras esfuerzo trivial; dificultad para acostarse en decúbito supino o sentarse en silla dura; pérdida de talla/cifosis progresiva. Buscar también malignidad si hay banderas de §1.4.

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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Dolor de cuello mecánico (modula con movimiento/postura), sin signos radiculares ni banderas rojas; cae casi siempre en la categoría 1 (déficit de movilidad, §3.1) o 2 (control motor/coordinación, §3.2) del *Neck Pain CPG*.
>
> **⛔ Contraindicaciones / cuándo derivar:** Descartar primero banderas rojas (§1): mielopatía, patología vascular/disección, fractura/inestabilidad, cáncer/infección → derivar, no tratar. Si hay dolor radiante (radicular) → §10; cefalea cervicogénica → §5.
>
> **⚠️ Precauciones:** Cribado de seguridad OBLIGATORIO antes de cualquier manipulación/tracción cervical (§1, §11). NO collarín/inmovilización ni reposo (empeoran). La FUERZA cérvico-escápulo-torácica es el motor; agentes físicos coadyuvantes. Progresar por criterios y tolerancia a 24 h. Respetar `seguridadClinica` (metal, marcapaso, embarazo, anticoagulación, cáncer).

El *Neck Pain Clinical Practice Guideline* (revisión 2017, JOSPT 47(7):A1-A83) clasifica el dolor de cuello en **4 categorías** ligadas a la CIF, cruzadas por **agudeza** (agudo/subagudo/crónico). Cada categoría tiene intervenciones emparejadas. **La cervicalgia mecánica inespecífica cae casi siempre en la categoría 1 o 2.**

#### 3.1 Cuello con DÉFICIT DE MOVILIDAD

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Dolor de cuello localizado con limitación de ROM y patrón mecánico, **sin signos radiculares ni rojos** (categoría 1 del *Neck Pain CPG*). Base: terapia manual cervical Y torácica + ejercicio de movilidad y fortalecimiento cérvico-escápulo-torácico.
>
> **⛔ Contraindicaciones / cuándo derivar:** Si aparecen signos radiculares, de mielopatía o banderas rojas (§1) → reevaluar y derivar antes de manipular/traccionar.
>
> **⚠️ Precauciones:** Cribado de seguridad antes de terapia manual/manipulación cervical y torácica (§1, §11). En irritabilidad alta: movilización suave, ROM tolerable, isométricos; evitar estiramiento agresivo y cargas altas. NO reposo, collarín ni pasividad total. Avanzar por criterios (sin recaída a 24 h). `seguridadClinica`.
Dolor localizado, limitación de ROM, patrón mecánico, sin signos radiculares ni rojos.
- **Qué SÍ:** **terapia manual cervical Y torácica** (movilización/manipulación — con cribado de seguridad §1) + **ejercicio de movilidad y fortalecimiento cérvico-escápulo-torácico**; educación para mantenerse activo. En agudo, manipulación/movilización torácica + ejercicio es razonable.
- **Qué NO:** reposo, collarín, pasividad total, apoyarse solo en agentes físicos.
- **Enfoque por fases/criterios:**
  - **Fase 1 (irritabilidad alta):** metas = control del dolor, restaurar movimiento indoloro, educación. SÍ: movilización suave, ROM activo en rango tolerable, isométricos suaves, termoterapia/TENS como coadyuvante. NO: estiramiento agresivo, cargas altas. **Criterio de avance:** dolor en reposo controlado y ROM funcional en aumento sin recaída a 24 h.
  - **Fase 2 (control motor y carga):** metas = **CCFT/flexores profundos**, resistencia escapular, normalizar ROM. SÍ: entrenamiento de resistencia de flexores profundos, fortalecimiento progresivo, terapia manual según respuesta. **Criterio de avance:** control motor adecuado, fuerza/resistencia que tolera actividad diaria.
  - **Fase 3 (fuerza y función):** fortalecimiento cérvico-escápulo-torácico y de MMSS con carga creciente, gesto laboral/deportivo, ergonomía. **Alta:** dolor mínimo/ausente, ROM y fuerza funcionales, autogestión con programa domiciliario, retorno a actividad.
- **Hitos orientativos:** la mayoría de las cervicalgias agudas mejoran en **semanas**; si no hay progreso a ~6 semanas, reevaluar clasificación y banderas.

#### 3.2 Cuello con ALTERACIONES DEL CONTROL MOTOR Y LA COORDINACIÓN (incluye WAD — latigazo; ver §4)

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Dolor de cuello con pobre control cérvico-escapular, hipersensibilidad y a veces mareo cervicogénico; típico tras latigazo (categoría 2 del *Neck Pain CPG*; WAD → §4).
>
> **⛔ Contraindicaciones / cuándo derivar:** Descartar banderas rojas (§1) y fractura/inestabilidad en el contexto traumático (WAD IV → urgencia, §4). No sobre-estudiar con imagen en ausencia de banderas.
>
> **⚠️ Precauciones:** NO collarín/inmovilización, reposo ni mensajes alarmistas (empeoran el pronóstico). Peso en control motor (CCFT/flexores profundos), exposición gradual al movimiento y manejo de la hipersensibilidad/factores psicosociales. Avanzar por tolerancia y control, no por tiempo. Cribado de seguridad antes de manual/tracción (§1, §11).
Dolor con pobre control cérvico-escapular, hipersensibilidad, a veces mareo cervicogénico; típico tras latigazo.
- **Qué SÍ:** **educación y tranquilización** (recuperación esperada, mantenerse activo, volver a la actividad normal), **ejercicio de coordinación/control motor** (flexores profundos — CCFT), **fortalecimiento**; en crónico, abordaje **multimodal** (manual + ejercicio ± TENS), y educación en dolor.
- **Qué NO:** collarín/inmovilización, reposo, mensajes alarmistas (empeoran el pronóstico), sobre-estudiar con imagen en ausencia de banderas.
- **Fases/criterios:** igual estructura que §3.1 pero con **mayor peso en control motor, exposición gradual al movimiento y manejo de la hipersensibilidad/factores psicosociales**. Avanzar según tolerancia y control, no por tiempo.

#### 3.3 Cuello con CEFALEA (cervicogénica) → ver §5

#### 3.4 Cuello con DOLOR RADIANTE (radicular) → ver §10 (radiculopatía)

> **Ejercicio para cervicalgia — qué dice Cochrane (Gross et al. 2015, CD004250):** evidencia de **calidad moderada** a favor del **fortalecimiento** cérvico-escápulo-torácico y de MMSS (mejoría de dolor moderada-grande a corto plazo); la **resistencia aislada** da efecto leve; **estiramiento o resistencia como única intervención** tienen efecto mínimo. **Combinar fuerza + resistencia/estiramiento** es beneficioso. **La dosis óptima es desconocida** (JOSPT 2020: aumentar volumen en clínica no mejora claramente el resultado) → dosificar por tolerancia y progresión.

---

### 4. Latigazo cervical / Whiplash-Associated Disorders (WAD)

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Trastornos asociados al latigazo cervical, grados I–III de la Quebec Task Force (dolor/rigidez cervical ± signos músculo-esqueléticos o neurológicos tras aceleración-desaceleración). Manejo **activo y temprano**.
>
> **⛔ Contraindicaciones / cuándo derivar:** **WAD IV** (fractura/luxación) = urgencia → inmovilizar y derivar; aplicar reglas de trauma (Canadian C-Spine Rule / NEXUS, §1.3) ante mecanismo de alto riesgo, déficit neurológico o dolor axial intenso. Estratificar riesgo temprano (WhipPredict) e intensificar en alto riesgo.
>
> **⚠️ Precauciones:** NO collarín/inmovilización (empeora), reposo prolongado ni mensajes catastrofistas. Base: educación + tranquilización ("act as usual"), ejercicio específico de cuello y de coordinación/control motor, ejercicio para el mareo si lo hay, analgesia simple. En crónico, abordar factores psicosociales. Cribado de seguridad antes de manual/tracción (§1, §11).

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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Cefalea referida desde estructuras cervicales altas (**C1–C3**), típicamente unilateral "de lado fijo", que se reproduce con posturas/movimientos del cuello o presión sobre la columna cervical alta. Evaluar con CFRT (§2.2) y CCFT (§2.3).
>
> **⛔ Contraindicaciones / cuándo derivar:** No tratar como migraña/cefalea tensional sin examinar el cuello. Si no responde, replantear el diagnóstico. Descartar banderas rojas y vasculares/mielopáticas antes de tratar la cervical alta (§1).
>
> **⚠️ Precauciones:** NO manipular sin cribado vascular/mielopático (§1, §11). Combinar **terapia manual de columna cervical alta** (movilización/SNAG C1–C2) **+ ejercicio** (fortalecimiento/resistencia cérvico-escapular y flexores profundos) — la combinación supera a cualquiera sola. `seguridadClinica`.

Cefalea referida desde estructuras cervicales altas (**C1-C3**), típicamente unilateral, "de lado fijo", que se desencadena/reproduce con posturas o movimientos del cuello y con presión sobre la columna cervical alta.
- **Evaluación clave:** **CFRT** (§2.2, restricción C1-C2), examen de columna cervical alta, **CCFT** (control de flexores profundos frecuentemente deficiente).
- **Qué SÍ (Neck Pain CPG, categoría "con cefalea"):** **terapia manual de columna cervical alta** (movilización/SNAG C1-C2 — con cribado de seguridad §1) **+ ejercicio** (fortalecimiento/resistencia cérvico-escapular y flexores profundos). La combinación manual + ejercicio tiene mejor soporte que cualquiera sola.
- **Qué NO:** manipular sin cribado vascular/mielopático; tratar como migraña/cefalea tensional sin examinar el cuello.
- **Criterios de avance/alta:** ↓ frecuencia e intensidad de la cefalea, ↑ rotación en CFRT, control motor restaurado, autogestión. Si no responde, replantear diagnóstico (migraña, cefalea tensional, mixta).

---

### 6. Rehabilitación post-quirúrgica cervical (breve) — ACDF / discectomía

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Rehabilitación tras cirugía cervical (ACDF / discectomía). Rol del fisio: control motor de flexores profundos, movilidad torácica y escapular, reacondicionamiento, ergonomía y educación.
>
> **⛔ Contraindicaciones / cuándo derivar:** Las restricciones exactas las fija el cirujano (patrón general de educación al paciente, NO guía formal — [verificar] con su protocolo). Vigilar y avisar al cirujano ante déficit neurológico nuevo, disfagia persistente o signos de no-unión.
>
> **⚠️ Precauciones:** Fase temprana (~0–4 sem): proteger la fusión, collarín según indicación, evitar flexión/rotación brusca, no cargar peso; caminar y movilidad suave desde temprano. Deportes de contacto/alto impacto varios meses después y con autorización del cirujano; fusiones multinivel se prolongan. "Manda el cirujano". Respetar seguridad de agentes físicos (§11).

> **Las restricciones exactas las fija el cirujano; lo de abajo es un patrón general de fuentes de educación al paciente, NO una guía formal — [verificar] con el protocolo del cirujano.**

- **Fase temprana (~0-4 semanas):** proteger la fusión; **collarín según indicación del cirujano**; evitar flexión/rotación brusca; **no cargar peso** (límites típicos bajos, p. ej. no levantar más de unos pocos kg); caminar y movilidad suave desde temprano. Trabajo de escritorio suele reanudarse en **~2-4 semanas**.
- **Fase intermedia (~6 semanas-3 meses):** se reintroduce actividad física progresiva según consolidación; fisioterapia para **control, fuerza suave y función**; evaluar retorno laboral.
- **Fase avanzada (~3-6 meses):** retorno gradual al nivel previo; **deportes de contacto/alto impacto** varios meses después y con **autorización del cirujano**; fusiones multinivel se prolongan (a veces requiere TC para confirmar fusión).
- **Rol del fisio:** control motor de flexores profundos, movilidad torácica y escapular, reacondicionamiento, ergonomía, educación. Vigilar banderas (déficit neurológico nuevo, disfagia persistente, signos de no-unión) → avisar al cirujano.

---

### Región DORSAL / TORÁCICA
### 7. Dorsalgia mecánica y disfunción costovertebral

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Dolor torácico de patrón mecánico (modula con movimiento, postura y respiración profunda), reproducible a la palpación de articulaciones costovertebrales/costotransversas o segmentos torácicos.
>
> **⛔ Contraindicaciones / cuándo derivar:** **Primero descartar dolor visceral referido y fractura (§1.5):** cardíaco, aórtico, pulmonar/pleural, gastrointestinal, herpes zóster, fractura por compresión osteoporótica → derivar/urgencia según el caso. No manipular sin descartar osteoporosis/fractura/causa visceral.
>
> **⚠️ Precauciones:** Cribado de seguridad antes de movilización/manipulación torácica (§1, §11). Combinar **terapia manual torácica + ejercicio activo** (la manual sola no supera al placebo). No apoyarse solo en terapia manual pasiva ni en reposo prolongado. Avanzar por tolerancia e ↓ irritabilidad. `seguridadClinica`.

Dolor torácico de patrón mecánico (modula con movimiento, postura, respiración profunda), reproducible a la palpación de articulaciones costovertebrales/costotransversas o segmentos torácicos. **Primero descartar dolor visceral referido y fractura (§1.5).**
- **Evidencia (baja certeza):** datos específicos de dorsalgia son escasos. Lo mejor soportado es la **combinación de terapia manual torácica + ejercicio activo a corto plazo** (la terapia manual **sola** no supera claramente al placebo; **añadida al ejercicio** sí mejora sobre ejercicio solo). La terapia manual torácica también ayuda a corto plazo en dolor de cuello y hombro (síndrome subacromial) como coadyuvante.
- **Qué SÍ:** movilización/manipulación torácica (con cribado), **ejercicio de movilidad torácica** (extensión, rotación), **fortalecimiento de extensores y estabilizadores escapulares**, reeducación respiratoria/costal, educación postural y de actividad.
- **Qué NO:** apoyarse solo en terapia manual pasiva; reposo prolongado; manipular sin descartar osteoporosis/fractura/visceral.
- **Fases/criterios:** (1) control del dolor + movilidad indolora → (2) control motor y carga progresiva de extensores/escápula → (3) fuerza y gesto funcional/laboral. **Avance** por tolerancia y ↓ irritabilidad; **alta** con dolor mínimo, movilidad y fuerza funcionales, autogestión.

### 8. Hipercifosis postural

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Aumento de la cifosis torácica (postural en jóvenes; en adultos mayores, hipercifosis senil por debilidad de extensores ± fracturas vertebrales). Base del tratamiento: fortalecimiento de extensores + entrenamiento postural (evidencia SHEAF, 6 meses).
>
> **⛔ Contraindicaciones / cuándo derivar:** Distinguir **postural reductible** de **estructural** (Scheuermann, fracturas, degenerativa) — no suponer que siempre es reductible sin examinar. Descartar osteoporosis/fractura (§1.5) y malignidad si hay banderas.
>
> **⚠️ Precauciones:** No cargar en flexión agresiva si hay sospecha de osteoporosis/fractura. En adulto mayor, integrar prevención de caídas. La cifosis recidiva si se abandona el ejercicio (sostener la autogestión). Respetar seguridad de agentes físicos (§11).

Aumento de la cifosis torácica (postural en jóvenes; en adultos mayores, hipercifosis senil asociada a debilidad de extensores ± fracturas vertebrales). Distinguir **postural reductible** de **estructural** (Scheuermann, fracturas, degenerativa).
- **Evidencia:** **ensayo SHEAF (Katzman et al. 2017, Osteoporos Int):** programa de **6 meses de fortalecimiento espinal + entrenamiento postural** redujo medidas radiográficas y clínicas de cifosis en adultos mayores. Programas más cortos (3 meses) mejoran la medida clínica pero no siempre la radiográfica. Revisión sistemática: **ejercicio de extensores espinales (y yoga) puede reducir la cifosis**; evidencia aún limitada, datos de caídas preliminares.
- **Qué SÍ:** **fortalecimiento de extensores torácicos**, entrenamiento postural, movilidad torácica en extensión, estiramiento de pectorales/flexores, propiocepción postural; en adulto mayor, integrar prevención de caídas.
- **Qué NO:** suponer que es siempre reductible sin examinar; cargar en flexión agresiva si hay sospecha de osteoporosis/fractura (§1.5).
- **Criterios de avance/alta:** ↑ fuerza de extensores, ↑ conciencia y control postural, ↓ cifosis clínica, autogestión mantenida (la cifosis recidiva si se abandona el ejercicio).

### 9. Escoliosis

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Desviación lateral de la columna confirmada por radiografía (ángulo de Cobb). El fisio trabaja en **equipo con el ortopedista** (SOSORT): cribado/derivación, ejercicios específicos (PSSE), apoyo durante el corsé, educación y adherencia. Ver EIA (§9.1) y adulto (§9.2).
>
> **⛔ Contraindicaciones / cuándo derivar:** El fisio **no sustituye** la vigilancia ortopédica. Derivar a valoración quirúrgica según umbrales de Cobb/madurez (§9.1) o ante déficit neurológico progresivo/claudicación. Cribado con escoliómetro ≥7° (§2.5) → derivar.
>
> **⚠️ Precauciones:** Mantener la vigilancia radiográfica de progresión (Cobb, Risser). No prometer "corrección" en curvas estructurales rígidas; no usar ejercicios genéricos simétricos como si fueran PSSE. Respetar seguridad de agentes físicos (§11).

> **Diagnóstico y seguimiento por radiografía (ángulo de Cobb) y madurez esquelética (Risser).** El fisio **no sustituye** la vigilancia ortopédica; trabaja en equipo. Sociedad de referencia: **SOSORT** (*Society on Scoliosis Orthopaedic and Rehabilitation Treatment*).

#### 9.1 Escoliosis idiopática del adolescente (EIA)

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Escoliosis idiopática en el adolescente **en crecimiento**. Conducta por Cobb y madurez (SOSORT 2016 [verificar cortes]): <15–20° observación ± PSSE; ~20–40° (Risser 0–3, con progresión/riesgo) corsé + PSSE. Ejercicios específicos (PSSE): Schroth, SEAS.
>
> **⛔ Contraindicaciones / cuándo derivar:** Derivar a cirugía (valoración) con Cobb >40–45° en crecimiento o curva progresiva; ~45–60° corsé muy rígido/yeso para intentar evitar cirugía. El fisio no sustituye la vigilancia ortopédica.
>
> **⚠️ Precauciones:** Mantener la vigilancia radiográfica de progresión; el alta del corsé la marca el ortopedista (por madurez: Risser/menarquia + estabilidad de la curva). No prometer corrección en curvas rígidas; no usar ejercicios genéricos simétricos como PSSE. Trabajar con el ortesista durante el corsé; cuidar adherencia y soporte psicosocial (imagen corporal).
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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Escoliosis del adulto (idiopática evolucionada o **degenerativa "de novo"**). El objetivo es **controlar dolor y discapacidad y preservar función**, no frenar una curva en crecimiento; el balance sagital suele correlacionar más con los síntomas que la curva coronal. Programa individualizado.
>
> **⛔ Contraindicaciones / cuándo derivar:** No esperar corrección estructural. Derivar a cirugía si dolor/discapacidad refractarios, déficit neurológico progresivo o desbalance sagital marcado. No ignorar banderas rojas (claudicación neurógena, déficit progresivo).
>
> **⚠️ Precauciones:** Con desbalance sagital, fortalecimiento de extensores con énfasis en **resistencia** + reeducación de la marcha; PSSE (Schroth/SEAS) como complemento. Corsé solo en casos dolorosos seleccionados (adherencia baja). Avanzar/dar de alta por **mejoría funcional y de síntomas**, no por el ángulo. Respetar seguridad de agentes físicos (§11).
El objetivo cambia: **no es frenar una curva en crecimiento sino controlar dolor y discapacidad y preservar función**; el **balance sagital** suele correlacionar más con los síntomas que la curva coronal.
- **Evidencia:** limitada, estudios pequeños/heterogéneos; éxito del tratamiento conservador modesto (cifra histórica ~27% [verificar]). Cohorte prospectiva: ejercicio/fisioterapia **↓ dolor y ↑ calidad de vida/función** en escoliosis degenerativa del adulto.
- **Qué SÍ:** programa **individualizado**; cuando hay **desbalance sagital**, **fortalecimiento de extensores con énfasis en resistencia** y reeducación de la marcha; PSSE (Schroth/SEAS) como complemento; manejo del dolor, acondicionamiento general, educación. Corsé en casos dolorosos seleccionados (adherencia suele ser baja).
- **Qué NO:** esperar corrección estructural; ignorar banderas rojas (claudicación neurógena, déficit progresivo → derivar).
- **Criterios de avance/alta:** por **mejoría funcional y de síntomas** (no por el ángulo). Derivar a cirugía si dolor/discapacidad refractarios, déficit neurológico progresivo o desbalance sagital marcado.

### 10. Radiculopatía cervical (ubicada aquí por completitud; es cuadro CERVICAL)

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Compresión/irritación de raíz cervical (hernia discal, espondilosis/estenosis foraminal): dolor radicular ± signos sensitivos/motores/reflejos en el dermatoma/miotoma. Historia natural generalmente favorable con manejo conservador multimodal. Evaluar con el clúster de Wainner (§2.1).
>
> **⛔ Contraindicaciones / cuándo derivar:** **SIEMPRE cribar mielopatía (§1.1)** — puede coexistir; NO traccionar/manipular sin descartar mielopatía y banderas vasculares. Derivar/cirugía ante déficit neurológico progresivo, signos de mielopatía o dolor intratable pese a ~6–12 sem de conservador adecuado; urgente si marcha nueva alterada, disfunción esfinteriana o progresión rápida.
>
> **⚠️ Precauciones:** Progresar por criterios monitoreando **centralización vs. periferización** e irritabilidad. Fase irritable: posturas/ejercicios que **centralizan**, "sliders" suaves, tracción suave si alivia; evitar "tensioners" agresivos y maniobras que **periferizan**; NO reposo/collarín. Cribado de seguridad antes de manual/tracción (§1, §11). `seguridadClinica`.

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

## 💪 HOMBRO — manguito rotador (tendinopatía/pinzamiento y reparación)

### Hombro — manguito rotador, guía por tipo

El manguito rotador es el grupo de tendones que mueven y estabilizan el hombro. Duele por sobrecarga / pinzamiento (el tendón se pellizca al subir el brazo) o porque se rompió y lo repararon. Se trata con **carga progresiva del manguito + control de la escápula** (el omóplato); los aparatos solo acompañan. Lo primero es saber si es **conservador** o **post-operado**, porque el plan cambia por completo. Se avanza por logros, no por calendario; en lo operado manda el cirujano.

#### ⛔ PRIMERO: ¿qué tipo es? — de esto depende TODO
- **Conservador (sin cirugía):** dolor al subir el brazo (arco doloroso), a veces dolor de noche al acostarse sobre el hombro. Se trata con fuerza del manguito y control de la escápula, evitando al inicio las posiciones que pellizcan.
- **Manguito reparado (operado):** te cosieron el tendón. Hay que proteger la reparación: cabestrillo, primero mover el hombro pasivo (que lo muevan), nada de fuerza activa contra resistencia temprano. Manda el cirujano.

> **Si fue SLAP / labrum o inestabilidad, avísame:** lleva matices propios y lo ajustamos.

**Agentes físicos por fase** (acompañan, no sustituyen la carga): láser y TECAR atérmica para analgesia; ultrasonido pulsado si hay dolor local; hielo tras la sesión. En fase de carga, apoyan antes o después del ejercicio.

> **⚠️ Seguridad:** nada de radiofrecuencia, diatermia, TECAR térmica ni ultrasonido térmico sobre las anclas de la reparación, prótesis o marcapaso. Precaución con anticoagulación, cáncer activo, embarazo y trombosis.

| Semáforo del dolor | Qué hacer |
|---|---|
| **VERDE ≤3/10** | durante el ejercicio, que se va en 24 h y sin dolor nocturno nuevo → progresa. |
| **AMARILLO 4–5/10** | o molestia que dura → mantén, no subas. |
| **ROJO >5/10** | dolor nocturno que empeora o pérdida de fuerza → baja un escalón y avísame. |

#### RUTA A — Conservador (sin cirugía)

El mapa (las semanas son guía; se avanza por criterios):

| Fase | Semanas | Qué se hace |
|---|---|---|
| **M1** | sem 1–3 | Analgesia y activación del manguito sin pinzamiento. |
| **M2** | sem 4–8 | Fuerza de rotadores y escápula en rango medio. |
| **M3** | sem 9–14 | Fuerza por encima del hombro. |
| **M4** | sem 15–18 | Potencia y función específica. |
| **M5** | sem 19+ | Readaptación al gesto deportivo o laboral. |

##### SEM 1–3 · M1 — Bajar el dolor y activar sin pellizcar
**Apoyo / muletas:** Normal. Evita dormir sobre el hombro y subir el brazo con dolor.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Isométricos de rotadores** (rotación externa e interna contra la pared o con liga) en rango neutro, sin dolor
> - **Control de la escápula:** retracción (juntar los omóplatos), serrato (empujar la pared)
> - Agentes para analgesia

> **🚫 TODAVÍA NO**
>
> - Subir el brazo por encima de la cabeza con dolor (arco de pinzamiento)
> - Cargar peso con el brazo elevado
> - Dormir sobre el hombro

##### SEM 4–8 · M2 — Fuerza en rango medio
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Rotación externa e interna con liga, remo, "full can" en rango medio
> - Serrato y trapecio inferior; rango progresivo según tolere

> **🚫 TODAVÍA NO**
>
> - Press militar pesado, dominadas, fondos
> - Rango alto cargado si pellizca

##### SEM 9–14 · M3 — Fuerza por encima del hombro
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Progresar a elevación cargada, press controlado, jalón (pull)
> - Escalones chicos de carga

> **🚫 TODAVÍA NO**
>
> - Lanzamientos o gesto deportivo máximo todavía

##### SEM 15–18 · M4 — Potencia y función
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Pliometría de brazo (lanzar y atrapar balón), trabajo de cadena (piernas–core–brazo)

> **🚫 TODAVÍA NO**
>
> - Competir o gesto máximo antes de tolerar la pliometría

##### SEM 19+ · M5 — Readaptación
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Drills específicos del deporte o del trabajo; retorno progresivo

> **🚫 TODAVÍA NO**
>
> - Volver sin cumplir los criterios de retorno

#### RUTA B — Manguito reparado (post-operado)

**Lo que NO se rompe:** respeta el cabestrillo el tiempo que indique el cirujano; primero el hombro se mueve **pasivo** (que te lo muevan o con el otro brazo), sin que tú actives el músculo reparado; nada de fuerza contra resistencia ni llevar la mano a la espalda hasta que te autoricen. Manda el cirujano.

Línea de tiempo (según el cirujano):

| Hito (lo que la persona logra) | ¿Cuándo, aprox.? |
|---|---|
| Cabestrillo + movimiento pasivo | **Sem 0–6** |
| Movimiento activo-asistido → activo | **Sem 6–12** |
| Empieza la fuerza | **Sem 12–16** |
| Fuerza por encima de la cabeza | **Mes 4–6** |
| Retorno (según cirujano) | **4–6 meses** |

##### SEM 0–6 — Proteger la reparación
**Apoyo / muletas:** Cabestrillo el tiempo que indique el cirujano.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Péndulos (dejar colgar el brazo y mecerlo)
> - Movimiento pasivo: que el fisioterapeuta o tu otro brazo lo muevan, en el rango permitido
> - Mover codo, muñeca y mano; apretar la mano (pelota)

> **🚫 TODAVÍA NO**
>
> - Mover el hombro activo (que tú jales el músculo)
> - Cargar peso, llevar la mano a la espalda
> - Apoyarte con ese brazo

> **Clave:** en estas semanas el tendón solo está pegado por la costura. Activar el músculo tira de la reparación.

##### SEM 6–12 — Recuperar el movimiento
**Apoyo / muletas:** Según el cirujano, dejar el cabestrillo.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Movimiento activo-asistido (te ayudas con el otro brazo o una polea) → activo sin peso
> - Seguir con el control de la escápula

> **🚫 TODAVÍA NO**
>
> - Fuerza contra resistencia, cargar peso
> - Forzar el rango final

##### SEM 12–16 — Empezar la fuerza
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Isométricos → banda de rotadores, en rango medio, progresivo
> - Fortalecer escápula

> **🚫 TODAVÍA NO**
>
> - Pesos altos por encima de la cabeza

##### MES 4–6 — Fuerza y retorno
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Progresar fuerza por encima de la cabeza y función; retorno según el cirujano

> **🚫 TODAVÍA NO**
>
> - Gesto deportivo/laboral máximo antes del visto bueno del cirujano

#### Criterios de retorno
- **Fuerza:** rotación externa e interna ≥90% del otro lado.
- **Dolor:** sin dolor nocturno y sin dolor al subir el brazo.
- **Función:** mano por encima de la cabeza sin dolor; cuestionario (ej. SPADI) en mejora.

#### 🚩 Señales de alarma — avisa de inmediato
- **No puedes subir el brazo o se te "cae" al bajarlo** → posible re-rotura (en operado) o rotura.
- Dolor nocturno que empeora semana a semana.
- Hombro **caliente + hinchado + fiebre** → posible infección (urgencia).
- Hormigueo o pérdida de fuerza en el brazo o la mano.

> En el operado, **la orden del cirujano manda** sobre el cabestrillo, los rangos y los tiempos.

## 🦾 CODO — epicondilalgia, post-fractura/luxación, LCU/Tommy John, bursitis olecraniana y túnel cubital

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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Tendinopatía lateral de codo / epicondilalgia lateral (codo de tenista, tendinopatía del ECRB); el cuadro de codo más frecuente, de manejo conservador. Proceso degenerativo-reparativo, no inflamatorio puro.
>
> **⛔ Contraindicaciones / cuándo derivar:** El corticoide NO es primera línea: alivia a corto plazo pero empeora el resultado a largo plazo y aumenta la recurrencia (Coombes JAMA 2013). Descartar banderas rojas del codo (sección 9): compromiso neurovascular (radial/PIN), fractura oculta, infección, masa o dolor nocturno/en reposo progresivo. PRP solo en refractarios tras fallar carga bien dosificada.
>
> **⚠️ Precauciones:** Pilar = EJERCICIO DE CARGA PROGRESIVA (excéntrico + concéntrico / HSR); agentes físicos, ortesis y terapia manual son COADYUVANTES y no sustituyen la carga. Avanzar por el termómetro del dolor (estable ≤3–5/10 que no empeora a 24 h = progresar; creciente/hinchazón/pérdida de ROM = retroceder). El isométrico sirve en fase irritable pero es dudoso como tratamiento único. ESWT razonable en crónico que no cede, con consentimiento.

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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Tendinopatía de la masa flexora-pronadora (codo de golfista, epicondilalgia medial), en el origen flexor-pronador común; análoga a la lateral pero menos frecuente. Diagnóstico principalmente clínico; ~85–95% responden a conservador [verificar].
>
> **⛔ Contraindicaciones / cuándo derivar:** Clave diferencial = coexistencia frecuente con neuropatía del nervio cubital → SIEMPRE explorar el cubital; si hay síntomas cubitales, tratar también el túnel cubital (sección 7). Corticoide con las mismas reservas que en la lateral (empeora a largo plazo). Imagen/electrodiagnóstico reservados a duda, sospecha de cubital o fracaso terapéutico.
>
> **⚠️ Precauciones:** Mismo esquema que la lateral = carga progresiva de flexores-pronadores (isométrico → excéntrico → concéntrico-excéntrico → HSR) + abordar contribuyentes proximales. NO estiramiento ni valgo provocador agresivo si hay irritación cubital; evitar maniobras que compriman el cubital. No retornar al swing/lanzamiento antes de fuerza simétrica (prensión indolora ≥90% contralateral).

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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Rehabilitación tras fractura y/o luxación de codo —simple (conservadora) o compleja/fractura-luxación incl. tríada terrible (dirigida por cirujano)— y del codo rígido post-traumático. El codo es la articulación más propensa a rigidez post-traumática.
>
> **⛔ Contraindicaciones / cuándo derivar:** Osificación heterotópica (OH) = pérdida PROGRESIVA de ROM, dolor al final del rango, calor local o plateau que retrocede → NO forzar, imagen (Rx), valorar con cirujano. Compromiso neurovascular / sospecha de síndrome compartimental (dolor al estiramiento pasivo, parestesias, tensión, alteración de pulso/palidez) → urgente. Fractura oculta, infección (artritis séptica), rotura tendinosa completa (bíceps/tríceps distal).
>
> **⚠️ Precauciones:** Principio rector = movilización activa temprana controlada, recuperar la EXTENSIÓN (el codo tiende al flexo, lo más incapacitante) y NO forzar. PROHIBIDO el estiramiento pasivo agresivo / forzar la extensión (agravan OH y rigidez). En inestabilidad, evitar los últimos ~30° de extensión (zona vulnerable) [verificar] y valgo/varo. En luxación compleja/tríada la rehab la dirige el cirujano según la estabilidad lograda (límites de brida por protocolo). Férulas estáticas progresivas solo en plateau, con tensión baja y mantenida.

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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Inestabilidad del ligamento colateral cubital (LCU/UCL) por sobrecarga en valgo repetitiva (béisbol, lanzadores, jabalina, voleibol). Parciales / grado I–II → conservador; roturas completas o alta demanda (lanzador) → reconstrucción del LCU (cirugía de Tommy John).
>
> **⛔ Contraindicaciones / cuándo derivar:** Cirugía indicada tras inestabilidad recurrente o fracaso de ≥12 semanas de rehab integral. Dolor medial en valgo o inestabilidad que no cede → derivar (la RM con artrografía tiene la mayor exactitud por imagen para roturas del LCU). Descartar banderas rojas del codo (sección 9).
>
> **⚠️ Precauciones:** La causa más común de fracaso es el retorno prematuro al lanzamiento. El programa de lanzamiento por intervalos es una progresión por CRITERIOS (tolerancia, mecánica, ausencia de dolor), no una fecha fija. En reconstrucción: proteger el injerto (brida) en fase 1, dirigido por cirujano; lanzamiento por intervalos ~4–5 meses, retorno a competición ~12–18 meses [verificar]. Fortalecer cadena cinética y flexores-pronadores (Thrower's Ten).

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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Inflamación de la bursa del olécranon. Primera decisión clínica obligada: ¿SÉPTICA o aséptica?
>
> **⛔ Contraindicaciones / cuándo derivar:** Sospechar SÉPTICA ante calor, eritema, dolor marcado, fiebre, fluctuación o antecedente de trauma/herida/break de piel → aspiración con análisis del líquido (Gram, cultivo, recuento) y manejar como séptica hasta descartar; séptica = antibiótico (cobertura Staphylococcus/Streptococcus), no tratar con agentes físicos. La infiltración de corticoide es controvertida y poco recomendada (riesgo de bursitis séptica iatrogénica, atrofia y despigmentación cutánea).
>
> **⚠️ Precauciones:** Aséptica = conservador de primera línea: reposo relativo, EVITAR apoyar/recargar el codo, compresión/acolchado, hielo, AINE si precisa. Cirugía (bursectomía) reservada al fracaso del tratamiento conservador, incluso en sépticas. Evidencia robusta escasa en la aséptica.

Inflamación de la bursa del olécranon. **Primera decisión clínica: ¿SÉPTICA o aséptica?**

#### Diferenciar séptica de aséptica (bandera roja)
Sospechar **séptica** ante **calor, eritema, dolor marcado, fiebre, fluctuación, antecedente de trauma/herida o break de piel**. Ante la duda → **aspiración con análisis del líquido (Gram, cultivo, recuento)** y manejo como séptica hasta descartar.

#### Manejo
- **Aséptica:** **conservador de primera línea** — reposo relativo, **evitar apoyar/recargar el codo**, compresión/acolchado, hielo, AINE si precisa. **Infiltración de corticoide controvertida y poco recomendada** por riesgo de **bursitis séptica iatrogénica, atrofia y despigmentación cutánea**. Falta de evidencia robusta para la aséptica (revisión J Hand Surg 2021).
- **Séptica:** **antibiótico** cubriendo *Staphylococcus* y *Streptococcus*. La **aspiración** es debatida (algunos datos apoyan antibiótico empírico sin aspirar en casos no complicados); **≤7 días de antibiótico** tan eficaz como pautas más largas en una cohorte [verificar]. **Cirugía (bursectomía) reservada** a fracaso del tratamiento conservador, incluso en sépticas.

---

### 7. Atrapamiento del nervio cubital en el codo (síndrome del túnel cubital)

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Atrapamiento del nervio cubital en el codo (síndrome del túnel cubital), 2ª neuropatía por compresión más frecuente del miembro superior: parestesias/entumecimiento en 4º–5º dedos, dolor medial, debilidad de intrínsecos en casos avanzados; se agrava con la flexión mantenida del codo y al apoyarse en el codo. Conservador = primera línea en leve/moderado.
>
> **⛔ Contraindicaciones / cuándo derivar:** Cirugía (descompresión ± transposición) si falla el conservador, hay debilidad/atrofia o compromiso axonal en electrodiagnóstico. El estudio de neuroconducción (enlentecimiento a través del codo) es el hallazgo distintivo.
>
> **⚠️ Precauciones:** La educación + modificación de actividad (evitar la flexión sostenida del codo y el apoyo sobre el codo) es probablemente el componente más eficaz / el motor del tratamiento. Férula nocturna en extensión relativa (~45°, evitando la flexión completa) × ~3 meses. Deslizamientos neurales del cubital SUAVES, SIN provocar síntomas.

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
| **Test de epicondilalgia medial** | Epicondilalgia medial | **Flexión resistida de muñeca + pronación resistida** del antebrazo; dolor a la palpación 5–10 mm distal/anterior al epicóndilo medial | Clínico; sin validación estandarizada |
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
- **Movimiento/arco funcional** (Palmer 1985, biomecánico, n=10): la mano usa arcos mucho menores en actividades de la vida diaria (~5° flexión, ~30° extensión, ~10° radial, ~15° cubital; y el "dart-thrower's motion" —extensión-radial a flexión-cubital— es el arco funcional dominante). Útil para fijar **metas funcionales realistas** antes de perseguir el ROM máximo.

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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Compresión del nervio mediano en el túnel carpiano; la fisioterapia es el manejo inicial del STC leve-moderado confirmado o sospechado (JOSPT CPG, revisión 2026).
>
> **⛔ Contraindicaciones / cuándo derivar:** STC severo (atrofia tenar, déficit sensitivo fijo, hallazgos electrodiagnósticos severos) → derivar a cirugía sin demorar (la ventana de recuperación del nervio se cierra). Fracaso del conservador bien hecho (~6–12 sem) o síntomas incapacitantes progresivos → derivar.
>
> **⚠️ Precauciones:** La CPG recomienda EN CONTRA de láser de baja potencia (LLLT), iontoforesis e imanes. Férula en posición neutra de uso nocturno, sin sobre-inmovilizar de día si limita la función; deslizamientos sin provocar síntomas; progresar por criterios. Post-liberación quirúrgica: terapia supervisada NO de rutina (AAOS 2024), reservar para los que se estancan.

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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Tenosinovitis estenosante del 1er compartimento dorsal (abductor largo + extensor corto del pulgar); ligada a sobreuso y a mujeres en posparto/cuidado de bebé. Manejo escalonado: ortesis + modificación + ejercicio.
>
> **⛔ Contraindicaciones / cuándo derivar:** Descartar rizartrosis concomitante (grind test, dolor en la base del pulgar). Fracaso del conservador + infiltraciones (típicamente ≥1–2) → valorar liberación quirúrgica del 1er compartimento.
>
> **⚠️ Precauciones:** La infiltración de corticoide es la de mayor evidencia de éxito (primera línea, combinar con férula). Fase irritable: evitar gestos provocadores repetidos con carga y estiramientos agresivos. Diabéticos: peores resultados, expectativas ajustadas. Excéntrico extrapolado de tendinopatía, evidencia directa de bajo nivel [verificar]; US/láser/crioterapia solo coadyuvantes.

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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Rehabilitación post-inmovilización (yeso) o post-fijación (ORIF con placa volar bloqueada / agujas / fijador externo); muy frecuente. Prioridades: edema → ROM (incl. prono-supinación) → fuerza de prensión progresiva.
>
> **⛔ Contraindicaciones / cuándo derivar:** Vigilar SDRC tipo I desde el día 1 (dolor desproporcionado + criterios de Budapest). Rotura tendinosa tardía (extensor largo del pulgar: pérdida súbita de extensión del pulgar) → derivar. Síndrome compartimental agudo / compromiso vascular post-reducción → urgencia quirúrgica.
>
> **⚠️ Precauciones:** El cirujano marca el retiro de yeso e inicio de carga (manda la consolidación). Desde el día 0: movilidad activa de dedos/pulgar/codo/hombro (prevenir rigidez y hombro congelado); NO cargar ni levantar con la muñeca hasta autorización. Con placa volar/tornillos aplica la regla de metal (agentes atérmicos, lejos del implante); en SDRC, máxima precaución con térmicos.

> **Enfoque:** post-inmovilización (yeso) o **post-fijación (ORIF con placa volar bloqueada / agujas / fijador externo)**. Es **muy frecuente** en la clínica. Prioridades: **edema → ROM (flexo-extensión, prono-supinación, desviaciones) → fuerza de prensión progresiva**. **El cirujano marca retiro de yeso e inicio de carga.** **Vigilar SDRC tipo I** desde el día 1.

#### Pruebas / evaluación
Goniometría seriada de muñeca **y prono-supinación** (clave y a menudo lo más limitado), **dinamometría Jamar** y **pinza** vs lado sano (medida de resultado principal), medición de **edema** (volumetría/circunferencia), inspección de piel/uñas/color/temperatura (tamiz SDRC), PRWE/DASH para función.

#### Rehab por fases y criterios
> Timelines **orientativos**; mandan la **consolidación** y el protocolo del cirujano (la fijación estable permite ROM más temprano que el yeso).

**Fase 0 — Inmovilización (sem ~0–4/6, mientras consolida):**
- **Yeso/férula:** no desplazadas suelen ~**4 semanas** (según posición/severidad); retiro guiado por imagen/clínica, a menudo entre **3–8 semanas [verificar; riesgo real de retiro prematuro]**.
- **SÍ desde el día 0 (CPG JOSPT 2024 Distal Radius):** **movilidad activa de DEDOS, pulgar, codo y HOMBRO** de inmediato (prevenir rigidez y "hombro congelado" por desuso); elevación y **control de edema**; en **reparación con PLACA VOLAR estable, iniciar ROM activo de MUÑECA dentro de las primeras ~3 semanas** (con agujas-K o fijador externo la muñeca sigue inmovilizada hasta el retiro del material según el cirujano; dedos/pulgar/codo/hombro sí se movilizan desde el día 0 en todos), y **fortalecimiento ligero** (apretar toalla/putty) **desde ~sem 2** en casos no complicados → mejor ROM y prensión a corto y largo plazo.
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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Fractura con inmovilización larga por la irrigación retrógrada (polo proximal) → alto riesgo de no-unión y necrosis avascular (NAV), mayor cuanto más proximal el trazo. La rehabilitación activa solo TRAS consolidación confirmada por imagen/cirujano.
>
> **⛔ Contraindicaciones / cuándo derivar:** Dolor en la tabaquera anatómica tras caída = tratar como fractura aunque la Rx inicial sea negativa (NO dar de alta; inmovilizar y reimagen/RM). Dolor persistente en tabaquera + pérdida de fuerza/ROM semanas-meses después → reimagen por no-unión (SNAC wrist). Polo proximal: umbral quirúrgico más bajo.
>
> **⚠️ Precauciones:** Antes de la consolidación, solo dedos/codo/hombro activos + control de edema; nada de carga ni muñeca mientras inmoviliza. Con tornillo (Herbert) o agujas, regla de metal (atérmicos, nada térmico sobre el implante). El tabaquismo deteriora la consolidación → consejo de cese.

> **Enfoque:** **inmovilización larga** por la **irrigación retrógrada** (la rama carpiana dorsal de la arteria radial irriga el polo proximal) → **alto riesgo de no-unión y necrosis avascular (NAV)**, mayor cuanto más proximal el trazo. **Bandera:** dolor en la **tabaquera anatómica** tras caída sobre la mano = tratar como fractura aunque la radiografía inicial sea negativa.

#### Pruebas / evaluación
**Dolor en tabaquera anatómica**, dolor en el tubérculo del escafoides, dolor a la **compresión axial del pulgar**. Radiografía (serie de escafoides); si negativa con clínica alta → **inmovilizar y reimagen / RM** (la RM detecta la fractura oculta). Tras consolidación: goniometría, **dinamometría de prensión** vs lado sano.

#### Manejo e inmovilización
- **Sospecha con Rx negativa:** inmovilizar (férula de escafoides) y reevaluar/reimagen — **no dar de alta** por una Rx inicial negativa.
- **Fractura no desplazada de cintura (waist):** **yeso ~8–12 semanas** es el estándar inicial de primera línea. La **fijación quirúrgica precoz** reduce el riesgo relativo de no-unión vs yeso en fracturas de cintura, pero **el yeso sigue siendo primera línea**; en desplazamiento **≤2 mm**, **sin diferencia funcional a 12 meses** entre cirugía y yeso (ECA SWIFFT, Dias et al., *Lancet* 2020; + metaanálisis 2022). **Polo proximal:** más riesgo de NAV/no-unión → inmovilización más larga y umbral quirúrgico más bajo.
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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Manejo conservador guiado por estabilidad del esguince de muñeca, lesión del TFCC (dolor cubital) e inestabilidad escafolunar parcial/dinámica/reducible (dolor dorso-radial, Watson+).
>
> **⛔ Contraindicaciones / cuándo derivar:** Antes de etiquetar "esguince", descartar fractura oculta (escafoides/radio distal). TFCC inestable / disrupción foveal con inestabilidad del DRUJ → consulta quirúrgica (reparación foveal). Inestabilidad escafolunar completa/estática (DISI)/crónica → cirugía.
>
> **⚠️ Precauciones:** La inestabilidad cambia el pronóstico y la conducta. TFCC en fase de protección: evitar carga en desviación cubital y rotación resistida; férula tipo Muenster para limitar prono-supinación. Escafolunar: reentrenar el "dart-thrower's motion", evitar cargas en extensión + desviación radial agresiva (evidencia de bajo nivel/consenso [verificar]). Post-quirúrgico: regla de metal.

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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Desproporción tendón–polea A1 con bloqueo/chasquido al flexo-extender el dedo; conservador razonable en grados bajos. Ortesis + modificación de actividad + infiltración.
>
> **⛔ Contraindicaciones / cuándo derivar:** Grado IV (contractura fija en flexión de la IFP), grados altos que no ceden, o fracaso de ortesis ± infiltraciones → liberación quirúrgica de A1. Diabéticos: peor respuesta al conservador/infiltración (expectativas ajustadas).
>
> **⚠️ Precauciones:** La infiltración de corticoide es el pilar médico de primera línea; la ortesis es efectiva a corto plazo (de bloqueo, tiempo completo ~6 sem; articulación a elegir por comodidad/adherencia). Modificar actividad (evitar agarres sostenidos con fuerza); el ejercicio está menos respaldado que la ortesis.

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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Artrosis de la articulación trapeciometacarpiana (CMC del pulgar); el conservador es el pilar (ejercicio + ortesis + protección articular), con mejor respuesta en estadios tempranos (Eaton I–II). Frecuente en mujeres mayores; impacta pinza y agarre.
>
> **⛔ Contraindicaciones / cuándo derivar:** Dolor refractario y/o Eaton III–IV con fallo del conservador (± infiltración) → valoración quirúrgica (trapecectomía/artroplastia/reconstrucción de Eaton-Littler en inestabilidad). Descartar De Quervain concomitante.
>
> **⚠️ Precauciones:** Fase dolorosa: evitar cargas máximas de pinza y la inmovilización rígida prolongada innecesaria. Ortesis de pulgar + educación en protección articular + terapia manual y ejercicio (reducen dolor, calidad moderada). Calor/parafina, TENS/US/láser solo coadyuvantes de bajo nivel.

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
- SWIFFT (ECA, Dias et al., *Lancet* 2020) y meta 2022: cirugía vs yeso en fracturas de cintura (Bone & Joint J 2022). https://boneandjoint.org.uk/Article/10.1302/0301-620X.104B8.BJJ-2022-0085.R2 · Meta cast vs fixation (PMC13222678).
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

### Prótesis de cadera — guía post-operatoria semana a semana

Te pusieron una **prótesis (reemplazo) de cadera**. El objetivo es recuperar la marcha y la fuerza del glúteo, pero lo primero y más importante son las **"precauciones de luxación"**: mientras la cápsula cicatriza (las primeras ~6–12 semanas), ciertas posiciones pueden hacer que la cadera se zafe. Y esas posiciones dependen de **por dónde te operaron (el abordaje)**. Se avanza por logros, y la orden del cirujano manda.

#### ⛔ PRIMERO: ¿por dónde te operaron? — las reglas son OPUESTAS
Confirma con el cirujano el abordaje. De esto depende qué posiciones están prohibidas:
- **Abordaje POSTERIOR (el más común):** NO dobles la cadera más de 90° (no te sientes muy bajo), NO cruces la pierna hacia el otro lado, NO gires el pie hacia adentro. Usa silla alta y cojín para no hundirte.
- **Abordaje ANTERIOR:** NO lleves la pierna muy atrás (extensión) girando el pie hacia afuera. Al sentarte hay menos restricción que en el posterior.

**Agentes físicos:** crioterapia y compresión para el edema; TECAR atérmica y láser para analgesia.

> **⚠️ Seguridad con prótesis:** nada de radiofrecuencia, diatermia, TECAR térmica ni ultrasonido térmico **sobre la prótesis**. Precaución con anticoagulación (común tras esta cirugía), cáncer activo, embarazo y trombosis.

| Semáforo del dolor | Qué hacer |
|---|---|
| **VERDE ≤3/10** | que se va, edema que baja → progresa. |
| **AMARILLO 4–5/10** | o más hinchada al día siguiente → mantén, no fuerces. |
| **ROJO >5/10** | pantorrilla hinchada, calor con fiebre, o dolor súbito con la pierna "chueca" → para y avísame (urgencia). |

#### Línea de tiempo — hitos clave

| Hito (lo que la persona logra) | ¿Cuándo, aprox.? |
|---|---|
| Camina con andador, apoyo según tolere | **Semana 0–2** |
| Deja el andador / bastón | **Semana 4–6** |
| Se relajan las precauciones (según cirujano) | **Semana 6–12** |
| Marcha sin cojear, fuerza de glúteo | **Semana 8–12** |
| Actividad de bajo impacto (bici, caminar, natación) | **Mes 3+** |

##### SEM 0–6 — Proteger la cadera y caminar
**Apoyo / muletas:** Apoyo según tolere con andador o bastón. Respeta las precauciones de tu abordaje todo el tiempo.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Isométricos de glúteo, cuádriceps y tobillo (bomba de tobillo contra la trombosis)
> - Abducción de cadera en rango seguro (abrir la pierna hacia afuera, no cruzar)
> - Marcha con el andador; silla alta y cojín para no hundirte
> - Crioterapia para el edema

> **🚫 TODAVÍA NO**
>
> - Las posiciones prohibidas de tu abordaje (ver arriba)
> - Posterior: sentarte bajo, cruzar la pierna, girar el pie hacia adentro, agacharte a recoger algo
> - Forzar rango, impacto

> **Lo más importante:** una cadera protésica se zafa si la llevas a la posición prohibida. Respeta las precauciones hasta que el cirujano las levante.

##### SEM 6–12 — Fuerza y marcha normal
**Apoyo / muletas:** Progresar a apoyo completo, dejar el andador/bastón. Precauciones se relajan según el cirujano.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Fuerza de glúteo (abducción con liga, puente, sentadilla parcial en rango seguro) — clave para no cojear
> - Bici fija, marcha normal, equilibrio

> **🚫 TODAVÍA NO**
>
> - Impacto, correr, saltar
> - Rangos extremos hasta el visto bueno del cirujano

##### MES 3+ — Resistencia y vida normal
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Progresar fuerza y resistencia; propiocepción
> - Actividad de bajo impacto: caminar, bici, natación, golf

> **🚫 TODAVÍA NO**
>
> - Impacto alto de por vida (correr, saltar, deportes de contacto) — desgasta la prótesis

#### Criterios de alta funcional
- **Marcha:** camina sin cojear y sin ayuda (sin que la cadera se "caiga" al apoyar — eso es debilidad de glúteo).
- **Fuerza:** glúteo medio y mayor que permitan subir escaleras y levantarse sin empujarse.
- **Dolor:** sin dolor de ingle ni de muslo al cargar.

#### 🚩 Señales de alarma — avisa de inmediato
- **Dolor súbito + la pierna se ve más corta o "chueca" (rotada) + no la puedes mover** → posible luxación (se zafó la prótesis), urgencia.
- Dolor e hinchazón en la pantorrilla de una sola pierna → posible coágulo (urgencia).
- Cadera/herida **caliente + hinchada + fiebre** o secreción → posible infección (urgencia).
- Cojera que no mejora (la cadera se cae al apoyar) → debilidad de glúteo, avísame.

> **La orden del cirujano manda** sobre el apoyo, las precauciones y los tiempos.

## 🕺 CADERA — labrum acetabular / pinzamiento femoroacetabular (FAI)

### Cadera — labrum y pinzamiento (FAI), guía por tipo

El labrum es el anillo de cartílago que sella y estabiliza la cadera. Duele cuando hay **pinzamiento (FAI**, el fémur choca contra el borde del acetábulo) o una lesión del labrum. Lo que lo irrita es la **flexión profunda de cadera + rotación** (la posición de pinzamiento): cuclillas hondas, sentarse muy bajo, cruzar la pierna. Lo primero es saber si vas por **manejo sin cirugía** o **después de una artroscopia**, porque el plan cambia. Se avanza por logros, no por calendario, y en lo operado manda el cirujano.

#### ⛔ PRIMERO: ¿qué camino es? — de esto depende TODO
- **Conservador (sin cirugía):** dolor en la ingle al flexionar o girar la cadera, estar mucho sentado, cuclillas. Se maneja con fuerza de glúteo y core y evitando las posiciones de pinzamiento.
- **Post-artroscopia (operado):** te repararon el labrum y a veces limaron el hueso (osteoplastia). Hay que proteger la reparación: progresión por fases y, al inicio, **cero flexores de cadera activos**. Manda el cirujano.

**Agentes físicos por fase** (acompañan a la carga, no la sustituyen): láser y TECAR atérmica para analgesia; ultrasonido pulsado si hay edema; hielo tras la sesión. En fase de carga, apoyan antes/después del ejercicio.

> **⚠️ Seguridad:** nada de radiofrecuencia, diatermia, TECAR térmica ni ultrasonido térmico sobre las anclas/tornillos de la reparación, prótesis o marcapaso. Precaución con anticoagulación, cáncer activo, embarazo y trombosis.

| Semáforo del dolor | Qué hacer |
|---|---|
| **VERDE ≤3/10** | en la ingle durante, que se va en 24 h y no amanece peor → progresa. |
| **AMARILLO 4–5/10** | o molestia que dura → mantén, no subas, repite. |
| **ROJO >5/10** | dolor que cojea o que queda → baja un escalón y avísame. |

#### RUTA A — Conservador (sin cirugía)
**Regla de oro:** fortalecer **fuera de la posición de pinzamiento**. Nada de forzar la cadera a flexión profunda + rotación. El rango que no duele es el rango que sirve.

##### FASE 1 · sem 1–3 — Bajar el dolor y activar el glúteo
**Apoyo / muletas:** Normal. Evita sentarte muy bajo y cruzar la pierna.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Isométricos de glúteo** (puente bipodal, aprieta arriba) y clamshells en rango corto
> - **Core:** bicho muerto, plancha, anti-rotación con liga
> - Movilidad de cadera solo en rango sin dolor; agentes para analgesia

> **🚫 TODAVÍA NO**
>
> - Flexión de cadera profunda + rotación (la posición de pinzamiento)
> - Sentadilla o cuclilla honda, estar mucho tiempo sentado bajo
> - Estiramientos forzados de cadera que lleven al tope

##### FASE 2 · sem 4–8 — Fuerza de glúteo y cadena
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Glúteo medio:** abducción de lado y "monster walks" con liga arriba de la rodilla
> - **Glúteo mayor:** puente progresando a una pierna, hip thrust ligero, patada atrás (kickback)
> - **Cadena posterior:** peso muerto rumano ligero, curl femoral; sentadilla y prensa en rango sin dolor

> **🚫 TODAVÍA NO**
>
> - Rango de pinzamiento (flexión profunda + giro)
> - Impacto, correr, saltar

##### FASE 3 · sem 9+ — Fuerza, control y retorno
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Progresar fuerza y propiocepción en una pierna (equilibrio, sentadilla a una pierna en rango seguro)
> - Reintroducir gradualmente carrera y gesto si no duele

> **🚫 TODAVÍA NO**
>
> - Volver a deporte de pivote/contacto sin control de la cadera y sin criterios

#### RUTA B — Post-artroscopia (reparación del labrum ± osteoplastia)
**Las 3 reglas que NO se rompen las primeras semanas:** cero flexores de cadera activos (no levantar la pierna estirada activamente) las primeras ~4 semanas; no estar sentado más de 30 minutos las primeras 3 semanas; no luchar contra el dolor. Se hizo una apertura de la cápsula, así que hay que cuidar la cadera de posiciones de luxación. Manda el cirujano.

Línea de tiempo (según el cirujano):

| Hito (lo que la persona logra) | ¿Cuándo, aprox.? |
|---|---|
| Apoyo 30% con muletas (pie a piso) | **Sem 0–3** |
| Deja las muletas (marcha normal) | **Sem 3–6** |
| Empieza propiocepción | **Sem 8** |
| Camina → trote (si hay control en una pierna) | **Sem 12+** |
| Pliometría y agilidad | **Sem 12–20** |
| Deporte de contacto | **≥ 6 meses** |

##### SEM 0–3 — Proteger y movilidad pasiva
**Apoyo / muletas:** Apoyo 30% con muletas (pie a piso). No sentarse más de 30 min.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Isométricos de cuádriceps, glúteo y tibial anterior (20 reps, 2 veces al día)
> - Arcos de movilidad pasivos (otro te mueve): flexión 90°, rotación interna 20° a 90°, abducción 30°
> - Cuadrupedia (rocking, tilts de pelvis), clamshells
> - Bici fija vertical sin resistencia, asiento alto, 20 min

> **🚫 TODAVÍA NO**
>
> - Levantar la pierna estirada activamente (cero flexores de cadera)
> - Estar sentado más de 30 min
> - Albercas, tinas o jacuzzi
> - Forzar el rango o luchar contra el dolor

> **Lo más importante:** nada de activar el psoas/flexores de cadera. Si levantas la pierna estirada tú solo, lo activas. Que te la muevan.

##### SEM 3–6 — Dejar muletas y rango completo
**Apoyo / muletas:** Progresar a apoyo 100%, deja las muletas cuando camines sin cojear. (Si hubo trabajo en cartílago, continúa muletas 6 semanas.)

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Arcos de movilidad completos sin dolor, progresivo
> - Estiramientos de cápsula anterior, flexores de cadera y cintilla iliotibial
> - Progresar fortalecimiento 2–4 veces por semana (glúteo, core)
> - Bici fija y elíptica, progresar el tiempo a tolerancia

> **🚫 TODAVÍA NO**
>
> - Forzar el rango o el dolor
> - Impacto, correr, saltar

##### SEM 6–12 — Fuerza y propiocepción
**Apoyo / muletas:** Apoyo 100%, marcha normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Progresar fuerza de glúteo, cuádriceps, isquios
> - Propiocepción desde la semana 8 (equilibrio, apoyo en una pierna)
> - Bici y elíptica 20–60 min, iniciar progresión de resistencia

> **🚫 TODAVÍA NO**
>
> - Impacto fuerte, pivotes

##### SEM 12–20 — Pliometría y agilidad
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Progresar fuerza, propiocepción y resistencia (core, glúteos, cuádriceps, isquios, pantorrilla)
> - Pliometría inicial: saltar cuerda a uno y dos pies; de apoyo parcial a completo
> - Programa caminar → trote si el control en una pierna lo permite

> **🚫 TODAVÍA NO**
>
> - Cambios de dirección y contacto todavía

##### SEM 20 – mes 6 — Readaptación deportiva
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Progresar pliometría, agilidad y propiocepción
> - Drills específicos del deporte sin contacto

> **🚫 TODAVÍA NO**
>
> - Deporte competitivo de contacto antes de los 6 meses
> - Volver sin la indicación conjunta de ortopedista y fisioterapeuta

#### Criterios de retorno
- **Fuerza:** glúteo y cuádriceps parejos con el otro lado, control en una pierna sin que la cadera se "meta".
- **Función:** pruebas de salto y agilidad sin dolor de ingle ni aprensión.
- **Tiempo (operado):** deporte de contacto no antes de 6 meses, y con indicación conjunta de ortopedista y fisioterapeuta.

#### 🚩 Señales de alarma — avisa de inmediato
- Dolor profundo de ingle que no cede o que cojea.
- Sensación de que la cadera se sale o se **traba (bloqueo)** → avisa, sobre todo en el operado (se abrió la cápsula).
- Cadera **caliente + hinchada + fiebre** → posible infección (urgencia).
- Dolor e hinchazón en la **pantorrilla de una sola pierna** → posible coágulo.

> En el operado, **la orden del cirujano manda** sobre apoyo, rangos y tiempos.

## 🦵 RODILLA — ligamentos (LCA), menisco y tendón rotuliano

> **Nota de uso:** material de referencia para que el fisio ubique fase, restricciones y si el paciente va en tiempo. NO es prescripción automática: el cirujano manda sobre carga/ROM (sobre todo en reparación meniscal y lesiones concomitantes). La evidencia en rehabilitación de rodilla es desigual: fuerte para criterios de retorno al deporte en LCA (Grindem 2016), débil/consenso para menisco (EU-US 2024, mayoría GRADE C-D). Los tiempos son orientativos; **la progresión es por CRITERIOS, no por calendario** (van Melick 2016).

---

### Reconstrucción de LCA (ligamento cruzado anterior) — guía post-operatoria semana a semana

Te reconstruyeron el **ligamento cruzado anterior (LCA)**, el que da estabilidad a la rodilla y evita que "se zafe", con un injerto nuevo que tarda en pegarse al hueso. Esta guía va **semana por semana**: en cada ventana dice qué apoyo toca, qué ejercicios ya puedes hacer y cómo ejecutarlos, y qué todavía no. Lo primero y más importante al inicio: **recuperar la extensión completa** (que la rodilla estire igual que la sana). Se avanza **por logros, no por calendario**; meta global: volver al deporte entre los **9 y 12 meses**. La orden del cirujano siempre manda.

#### ⛔ Lo que protege el injerto — no se negocia
Nada de giros ni pivoteos con el pie fijo hasta que te autoricen: esa torsión es la que más estresa el injerto nuevo. Y cuida la extensión: recuperar que la rodilla estire completa desde el inicio es la **prioridad #1**.

> **🎗️ Cómo colocar la liga (regla práctica para todo el protocolo).**
>
> - **Liga por ARRIBA de la rodilla (supracondílea):** menos palanca sobre la articulación → la opción segura al inicio, para activar glúteo y corregir el valgo ("rodilla que se mete").
> - **Liga en el TOBILLO para mover la CADERA** (flexión, extensión o abducción de cadera con la rodilla recta, pierna estirada): **sin problema desde temprano** — la rodilla no se mueve, el injerto no sufre. Aquí la liga en el tobillo es buena (más palanca = más trabajo de cadera).
> - **Liga o peso en el tobillo para EXTENDER la RODILLA en cadena abierta** (pierna colgando): ese sí espera — el peso en el tobillo en el tramo final (de 45° a estirar del todo) tensa el injerto. Las primeras semanas la extensión de rodilla se trabaja en arco protegido (de 90° a 45°) o con el pie apoyado (cadena cerrada).

> **🏋️ Entrena desde el día 1 — todo lo que NO carga la rodilla operada.** Mantiene tu forma y acelera el regreso, desde la primera semana:
>
> - **Core / abdomen:** bicho muerto (dead bug), perro-pájaro (bird-dog), plancha frontal y lateral, anti-rotación con liga (Pallof), puente isométrico.
> - **Tren superior** (sentado o acostado al inicio): press de pecho, remo, jalón, press de hombro, bíceps, tríceps.
> - **Pierna sana:** entrénala normal — fortalecerla también ayuda a la operada (efecto cruzado).
> - **Cardio sin impacto:** ergómetro de brazos; bici cuando el arco de rodilla lo permita.

#### Línea de tiempo — hitos clave

| Hito (lo que la persona logra) | ¿Cuándo, aprox.? |
|---|---|
| Estira la rodilla completa (igual que la sana) | **Semana 1–2** |
| Sube la pierna estirada sin que se le "caiga" la rodilla | **Semana 1–2** |
| Dobla ~90° | **Semana 2** |
| Deja las muletas (destete) | **Semana 3–4** |
| Movimiento completo y marcha normal | **Semana 4–6** |
| El muslo recupera fuerza (hacia 80% de la sana) | **Semana 8** |
| Empieza a correr (si cumple criterios) | **Mes 3–4** |
| Saltos y agilidad | **Mes 4–6** |
| Vuelve al deporte si pasa todas las pruebas | **≥ 9 meses** |

##### SEMANA 1 — Extensión completa y despertar el muslo
**Apoyo / muletas:** Según el cirujano: normalmente pisa según tolere con muletas desde el día 0 (si fue solo LCA). Rodillera, si la indican, trabada en estirado para caminar y dormir.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Extensión pasiva:** talón en alto o boca abajo con la pierna colgando, deja que estire sola
> - **Isométricos de cuádriceps** (apretar el muslo) + electroestimulación
> - **Elevación de pierna recta** (sin que se caiga la rodilla)
> - Movilización de la rótula, bomba de tobillo, hielo y compresión

> **🚫 TODAVÍA NO**
>
> - Doblar a la fuerza
> - Extensión de rodilla con peso en el tobillo en el tramo final (45° a estirar)
> - Sentadilla, prensa, estocadas; cargar la pierna de pie
> - Girar o pivotear sobre el pie fijo
> - Descuidar la extensión por perseguir la flexión

##### SEMANA 2 — Doblar a 90° y control
**Apoyo / muletas:** Pisa cada vez mejor con muletas; marcha mejorando.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Seguir ganando **extensión completa**
> - **Flexión asistida hasta ~90°** (talón resbalando, con ayuda de la otra pierna)
> - Bici fija sin resistencia, asiento alto, si ya llega al arco
> - Cadena cerrada ligera: mini-sentadilla con el pie apoyado

> **🚫 TODAVÍA NO**
>
> - Forzar la flexión más allá de lo cómodo
> - Extensión de rodilla con peso en el tobillo en el tramo final (45° a estirar)
> - Correr, saltar, giros o pivoteos
> - Sentadilla o prensa pesada

##### SEMANA 3–4 — Dejar las muletas (destete)
**Apoyo / muletas:** Hacer destete de muletas (quitarlas poco a poco). Hacia la semana 4 ya sin muletas si caminas sin cojear.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Cadena cerrada:** sentadilla parcial, prensa, step-ups con liga arriba de la rodilla para alinear
> - **Glúteo mayor:** puente bipodal; **glúteo medio:** abducción de lado y "monster walks" con liga arriba de la rodilla
> - **Tríceps sural:** elevación de talón bipodal (gemelo y sóleo)
> - Propiocepción en dos pies; bici progresando

> **🚫 TODAVÍA NO**
>
> - Correr, saltar, pliometría
> - Giros, pivoteos y cambios de dirección sobre el pie fijo
> - Extensión de rodilla en cadena abierta con peso en el tobillo (tramo final)
> - Sentadilla muy profunda con carga

##### SEMANA 5–6 — Movimiento completo y primera fuerza
**Apoyo / muletas:** Marcha normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Sentadilla a 90° y prensa**, con liga arriba de las rodillas
> - **Step-ups**, peso muerto rumano ligero (cadena posterior)
> - **Extensión de rodilla en máquina** desde ~semana 6, en arco protegido (90° a 45°), sin el tramo final pesado
> - Propiocepción en una pierna iniciando

> **🚫 TODAVÍA NO**
>
> - Extensión de rodilla en el tramo final (45° a estirar) con peso en el tobillo
> - Correr, saltar, pliometría
> - Giros, pivoteos y cambios de dirección

##### SEM 7–12 — Fuerza, el muslo hacia 80%
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Fuerza progresiva en cadena cerrada (sentadilla, prensa, zancadas controladas) y extensión de rodilla **ampliando el arco poco a poco**
> - Cadena posterior, cadera completa (abducción, extensión, aducción en polea)
> - Bici con resistencia, elíptica, natación

> **🚫 TODAVÍA NO**
>
> - Correr, saltar o pivotear todavía
> - Cambios de dirección y deportes con giro
> - Pliometría de alta intensidad

##### MES 3–4 — Empezar a correr
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Programa de carrera progresivo** (empieza alternando caminar y trotar) si el muslo llegó a ≥70–80% de la pierna sana y no hay hinchazón
> - Seguir subiendo la fuerza

> **🚫 TODAVÍA NO**
>
> - Saltos de alta intensidad y cambios de dirección antes de pasar la prueba de fuerza
> - Pivotes y deporte de contacto
> - Correr en terreno irregular al inicio

##### MES 4–6 — Saltos y agilidad
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Pliometría** (saltos de menos a más, de dos piernas a una)
> - Cambios de dirección controlados, reintroducir el gesto del deporte

> **🚫 TODAVÍA NO**
>
> - Volver a competir o al contacto antes de cumplir criterios Y tiempo
> - Pivotes y cambios de dirección máximos sin haber hecho la progresión

##### ≥ 9 MESES — Volver al deporte
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Retorno al deporte** si pasas toda la batería: fuerza del muslo y saltos ≥90% de la pierna sana, confianza (cuestionario), sin hinchazón, aterrizas sin que la rodilla se meta

> **🚫 TODAVÍA NO**
>
> - Volver antes de ≥9 meses Y de pasar las pruebas (volver antes dispara el riesgo de re-lesión)

#### 🚩 Señales de alarma — avisa o acude de inmediato
- La rodilla **no termina de estirar** y no mejora → avisa pronto (es lo más importante de vigilar).
- Rodilla **caliente + hinchada + fiebre** → posible infección **(URGENCIA)**.
- Dolor e hinchazón en la **pantorrilla de una sola pierna** → posible coágulo.
- La rodilla **"se zafa"** de repente con aflojamiento → avísame.

> **La orden del cirujano SIEMPRE manda** sobre estos tiempos. El tipo de injerto (de tu propio tendón o de banco) puede cambiar un poco el ritmo.

### Menisco — guía post-operatoria semana a semana (meniscectomía vs reparación)

> **📋 Encuadre clínico** — para el fisioterapeuta / quien captura
>
> **🎯 Indicaciones:** post-operado de menisco. Distinguir SIEMPRE la ruta: meniscectomía parcial (quitaron) = rápido; reparación (cosieron) = lento y protegido.
>
> **⛔ Cuándo derivar:** bloqueo verdadero que no extiende → posible asa de balde (valoración urgente); dolor agudo en interlínea + derrame al avanzar carga/flexión → posible falla de la sutura; caliente + fiebre → infección; pantorrilla hinchada → posible trombosis.
>
> **⚠️ Precaución #1:** confundir las dos rutas es el error típico. En reparación, proteger la flexión profunda cargada hasta ~4 meses según el tipo de rotura.

El menisco es el "cojín" de cartílago que amortigua la rodilla. Esta guía va **semana por semana**: en cada ventana dice qué apoyo toca, qué ejercicios ya puede hacer **y cómo ejecutarlos**, y qué todavía no. Los ejercicios son **sugerencias**; el fisioterapeuta ajusta la carga, las series y la colocación según cómo responde cada persona. Se avanza **por logros, no por calendario**, y la orden del cirujano siempre manda.

#### ⛔ PRIMERO: confirma con el cirujano cuál cirugía se hizo. Son DOS rutas OPUESTAS
- **Meniscectomía parcial** (le **quitaron** un pedazo) → nada que esperar a que cicatrice → **rápido**, pisa desde el día 0.
- **Reparación** (le **cosieron** el menisco) → hay que proteger la costura → **lento**, a veces sin apoyar 2-3 semanas.
- Confundirlas es el error más común y el más peligroso.

> **🎗️ Cómo colocar la liga (regla práctica para todo el protocolo).**
>
> - **Liga por ARRIBA de la rodilla (supracondílea):** menos brazo de palanca, menos estrés en la articulación → la opción **segura al inicio** y para activar glúteo y corregir el valgo ("rodilla que se mete").
> - **Liga en el TOBILLO:** más resistencia y más brazo de palanca, pero **carga más la rodilla** → se introduce **después**, cuando la articulación ya tolera.
> - **¿Menisco + ligamento cruzado (LCA) juntos?** El cuidado es **solo con la extensión de rodilla en cadena abierta**: para ese movimiento la resistencia va **proximal (en la rodilla), NO en el tobillo** en el tramo final 0-45° (evita la cizalla sobre el injerto). En cambio, la liga en el tobillo **para mover la CADERA con la rodilla recta** (flexión, extensión o abducción de cadera, pierna estirada) **no hay problema** — la rodilla no se mueve, el injerto no sufre.

> **🏋️ Entrena desde el día 1 — todo lo que NO carga la rodilla operada.** Mantiene la forma física y acelera el regreso. Aplica a las dos rutas, desde la primera semana:
>
> - **Core / abdomen:** bicho muerto (dead bug), perro-pájaro (bird-dog), plancha frontal y lateral, anti-rotación con liga (Pallof press), puente isométrico, vacío abdominal. *Evita* abdominales que obliguen a doblar y cargar la rodilla operada en reparación temprana.
> - **Tren superior** (sentado o acostado al inicio, sin pararse sobre la rodilla): press de pecho, remo, jalón al pecho, press de hombro, bíceps, tríceps, fondos en banca.
> - **Pierna sana:** entrénala normal (sentadilla, prensa, zancada) — fortalecer la sana también ayuda a la operada (efecto cruzado).
> - **Cardio sin impacto:** ergómetro de brazos; bici o remo cuando el arco de rodilla lo permita.

#### RUTA A — Meniscectomía parcial (quitaron pedazo) · RÁPIDO

| Hito (lo que la persona logra) | ¿Cuándo, aprox.? |
|---|---|
| Pisa completo (según lo que tolere) | **Día 0** |
| Movimiento completo | **Semana 1-2** |
| Empieza a correr | **Semana 2-4** |
| Vuelve al deporte | **Semana 4-12** |

##### SEM 0-1 — Bajar hinchazón y caminar
**Apoyo / muletas:** Carga completa según tolere desde el día 0. Muletas solo hasta caminar sin cojear (unos días).

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Isométricos de cuádriceps:** apretar el muslo 5 seg, pierna estirada
> - **Elevación de pierna recta** (sin que se caiga la rodilla)
> - **Bomba de tobillo**, hielo y compresión
> - Movilidad libre de rodilla; **bici fija sin resistencia**, asiento alto

> **🚫 TODAVÍA NO**
>
> - Forzar a través de hinchazón o dolor marcado
> - Correr, saltar, pliometría
> - Giros bruscos y cuclillas profundas con dolor

##### SEM 1-2 — Movimiento completo y fuerza base
**Apoyo / muletas:** Marcha normal sin muletas.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Cadena cerrada:** sentadilla parcial y prensa en arco cómodo, con **liga arriba de la rodilla** para alinear
> - **Cadera:** abducción de lado y puente de glúteo, **liga arriba de la rodilla**
> - **Tríceps sural:** elevación de talón bipodal (gemelo con rodilla recta, sóleo con rodilla doblada)
> - Bici con resistencia, elíptica; propiocepción en dos pies

> **🚫 TODAVÍA NO**
>
> - Carrera, saltos y pliometría
> - Giros y cambios de dirección con carga si todavía hay hinchazón

##### SEM 2-4 — Reintroducir impacto
**Apoyo / muletas:** Marcha normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Progresar fuerza: sentadilla a 90°, **step-ups**, prensa; pasar la liga de cadera **al tobillo** si tolera
> - **Carrera suave** (~sem 2-4 si no hay derrame y la fuerza acompaña)
> - Propiocepción **en una pierna**

> **🚫 TODAVÍA NO**
>
> - Pivotes, cambios de dirección bruscos y contacto hasta cumplir criterios
> - Saltos máximos sin haber hecho pliometría progresiva

##### SEM 4-12 — Retorno al deporte
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Pliometría** (saltos de menos a más), agilidad, cambios de dirección
> - Gesto específico del deporte

> **🚫 TODAVÍA NO**
>
> - Competir antes de que la fuerza y los saltos estén parejos entre las dos piernas (≥90%)

#### RUTA B — Reparación meniscal (cosieron) · LENTO y con candados
**Clave:** hay que proteger la costura. El apoyo y el arco de movimiento los **define el cirujano** según el tipo de rotura (una rotura vertical estable es más permisiva; las de raíz, radiales o complejas son más estrictas).

| Hito (lo que la persona logra) | ¿Cuándo, aprox.? |
|---|---|
| Pisa (según el cirujano; a veces sin cargar al inicio) | **Sem 0-3** |
| Deja las muletas (destete) | **~Sem 4** |
| 120° de flexión | **~Sem 6** |
| Movimiento completo | **~Sem 12** |
| Vuelve al deporte | **6-9 meses** |

##### SEMANA 1 — Proteger la costura y lograr la extensión
**Apoyo / muletas:** Según el cirujano: con frecuencia **sin apoyar o solo tocar el piso** las primeras 2-3 semanas. Rodillera trabada en estirado (0°). Arco permitido 0-90°.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Isométricos de cuádriceps** (apretar el muslo, pierna estirada)
> - **Elevación de pierna recta** (solo si ya estira completo, sin que se caiga)
> - **Movilización de la rótula** (deslizarla con los dedos) y movilidad asistida dentro de 0-90°
> - Isométricos de glúteo, bomba de tobillo, hielo

> **🚫 TODAVÍA NO**
>
> - Apoyar si el cirujano lo prohibió; caminar sin muletas antes de tiempo
> - Doblar más de 90°; ponerte en cuclillas
> - Sentadilla, prensa, estocadas; girar sobre el pie fijo
> - Extensión de rodilla con peso en el tobillo (pierna colgando)

##### SEMANA 2 — Mantener y preparar
**Apoyo / muletas:** Igual que semana 1 (muchos cirujanos siguen sin carga completa). Seguir arco 0-90°.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Todo lo de la semana 1
> - **Electroestimulación del cuádriceps** junto con el isométrico
> - **Bici fija sin resistencia**, asiento alto (si llega al arco)
> - Isométricos de cuádriceps **a varios ángulos** dentro del arco (30°, 60°)

> **🚫 TODAVÍA NO**
>
> - Todo lo de la semana 1
> - Cargar la rodilla en flexión; bici con resistencia o asiento bajo
> - Bajar escaleras alternando (carga la rodilla en flexión)

##### SEMANA 3-4 — Empieza la carga con muletas → destete
**Apoyo / muletas:** Empezar a **poner carga parcial con muletas** (según el cirujano) y hacer **destete** (quitar las muletas poco a poco). Hacia la **semana 4 ya sin muletas** si camina sin cojear.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Extensiones de rodilla** en arco protegido (90-45°), sin peso o resistencia proximal; **evita el tramo 45-0° con peso en tobillo** si hay cruzado asociado
> - **Flexión de rodilla activa** (curl) dentro del arco permitido
> - **Cadera — glúteo medio:** abducción de lado, "monster walks" y clamshells con **liga arriba de la rodilla**
> - **Cadera — glúteo mayor:** puente bipodal y patada de glúteo en cuadrupedia (kickback) con liga
> - **Cadera — aductores:** aducción isométrica apretando una pelota entre las rodillas (suave)
> - **Tríceps sural:** elevación de talón bipodal (gemelo con rodilla recta, sóleo con rodilla doblada)
> - **Peroneos:** eversión de tobillo con liga y caminata sobre los bordes externos del pie
> - Propiocepción en dos pies (piso estable → cojín)

> **🚫 TODAVÍA NO**
>
> - Sentadilla o cuclilla profunda; prensa más allá de 90°
> - Peso muerto convencional; estocadas profundas
> - Correr, saltar, pliometría
> - Giros, pivoteos y cambios de dirección

##### SEMANA 5 — Primera carga en flexión controlada
**Apoyo / muletas:** Sin muletas, marcha normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Sentadilla isométrica a 45° contra la pared** (aguantar 20-45 seg), con **liga arriba de las rodillas** para evitar el valgo
> - **Prensa** en arco parcial (0-60°)
> - **Cadera de pie con liga o polea:** abducción, extensión y aducción (liga arriba de rodilla → tobillo si tolera)
> - **Puente de glúteo** progresando a una pierna
> - Peroneos y tríceps sural subiendo resistencia; propiocepción **en una pierna** iniciando

> **🚫 TODAVÍA NO**
>
> - Romper el paralelo (sentadilla >90°) con carga; hack squat profundo
> - Estocada caminando profunda
> - Trote, saltos, pliometría
> - Pivotes y cambios de dirección

##### SEMANA 6 — Debe tener 120° de flexión
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Sentadillas a 90°** controladas, con **liga arriba de las rodillas** (protege y alinea)
> - **Step-ups** (banco bajo → alto) y zancadas controladas
> - **Peso muerto rumano ligero** y **hip thrust ligero** (cadena posterior / glúteo)
> - **Cadera completa en polea:** abducción, aducción y extensión; desplazamientos laterales ("monster walks")
> - Elevación de talón progresando a una pierna; bici con resistencia, elíptica

> **🚫 TODAVÍA NO**
>
> - Romper el paralelo bajo carga **si la rotura es de raíz, radial o compleja** — espera ~4 meses (confírmalo con el cirujano)
> - Sentadilla muy profunda (al fondo), prensa a fondo
> - Correr, saltar, pivotear

##### SEM 7-12 — Fuerza y movimiento completo
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Progresar fuerza y arco hasta el **movimiento completo** (~sem 12)
> - Cadena cerrada en arco creciente (sentadilla, prensa, zancadas controladas); propiocepción avanzada (una pierna en superficie inestable)
> - Bici, elíptica; **empezar trote suave** hacia el final si la fuerza y el control lo permiten

> **🚫 TODAVÍA NO**
>
> - Sentadilla / flexión profunda cargada hasta ~4 meses (según la rotura)
> - Correr en terreno irregular; saltos de alta intensidad
> - Pivotes y cambios de dirección bruscos

##### MES 3-6+ — Retorno a carrera y deporte
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Carrera progresiva → pliometría → agilidad → gesto del deporte
> - Deporte **hacia los 6-9 meses** si pasa los criterios

> **🚫 TODAVÍA NO**
>
> - Deporte de contacto o pivote antes de cumplir criterios (fuerza y saltos ≥90%, sin dolor en el borde)
> - Volver a competir sin el visto bueno del cirujano

#### 🚩 Señales de alarma — avisa o acude de inmediato
- Rodilla **caliente + hinchada + fiebre** → posible infección **(URGENCIA)**.
- La rodilla **se traba o se bloquea** y no termina de estirar → posible menisco atrapado (asa de balde).
- Dolor e hinchazón en la **pantorrilla de una sola pierna** → posible coágulo (trombosis).
- En reparación: **dolor agudo en el borde de la rodilla + hinchazón** al avanzar la flexión o la carga → posible falla de la costura; retrocede y avisa al cirujano.

> **La orden del cirujano SIEMPRE manda** sobre estos tiempos. Avanzar la flexión profunda o el giro con carga "contra" lo que indicó puede **romper la costura**.

#### Para el fisioterapeuta — pruebas de exploración
No es parte de la guía del paciente. Ningún test aislado confirma o descarta; combinar historia + interlínea + provocación. **Dolor en interlínea** (sens ~63% / esp ~77%, buen cribado), **McMurray** (~70% / ~71%), **Thessaly** (muy variable según la fuente), **Apley** (~60% / ~70%, el menos sensible). Marco de rehabilitación: **Consenso EU-US 2024 (ESSKA-AOSSM-AASPT), evidencia GRADE C-D**. Progresión por criterios, no por calendario.

---

### Tendón rotuliano (rodilla de saltador) — guía por tipo, semana a semana

El tendón rotuliano une la rótula con la tibia (el hueso de la espinilla). Se trata con **carga progresiva**: el ejercicio es el tratamiento y los aparatos (láser, TECAR, ultrasonido) solo acompañan. Lo primero es saber **QUÉ tipo es**. El tendón se estresa al máximo en **flexión profunda de rodilla bajo carga** (sentadilla profunda, aterrizar de un salto) — por eso eso se controla al inicio. El termómetro es la **rigidez o el dolor de la mañana**. Se avanza por logros, no por calendario.

#### ⛔ PRIMERO: ¿qué tipo es? — de esto depende TODO
Ubica dónde y cómo duele:
- **Tendinopatía ("rodilla de saltador"):** duele en el polo inferior de la rótula (justo debajo del hueso de la rodilla), al saltar, aterrizar, ponerse en cuclillas o bajar escaleras. Es una sobrecarga; mejor pronóstico. La más común en quien salta.
- **Desgarre parcial del polo inferior:** hubo una lesión más aguda (no solo desgaste). Se trata parecido, pero respetando la cicatriz: más cuidado con la flexión profunda bajo carga en las primeras fases.
- Si el tendón se **rompió por completo o fue reparado con cirugía**, ese es otro protocolo (manda el cirujano): avísame y lo armamos aparte.

**Agentes físicos por fase** (acompañan a la carga, no la sustituyen):
- **Fase aguda:** láser (fotobiomodulación) en el foco; TECAR atérmica para analgesia; ultrasonido pulsado si hay edema; hielo tras la sesión.
- **Fase de carga:** láser y TECAR antes o después de la carga; la carga (HSR) es el tratamiento.
- **Fase avanzada:** los aparatos casi se retiran; foco en carga, potencia y gesto.
- **Ondas de choque:** útil en tendinopatía crónica o calcificante como apoyo puntual — no en desgarre agudo.

> **⚠️ Seguridad:** nada de radiofrecuencia, diatermia, TECAR térmica ni ultrasonido térmico sobre material de osteosíntesis, prótesis o marcapaso. Precaución con anticoagulación, cáncer activo, embarazo y trombosis.

| Semáforo del dolor (Silbernagel) | Qué hacer |
|---|---|
| **VERDE ≤3/10** | durante el ejercicio, que se normaliza en 24 h y sin más rigidez en la mañana → progresa. |
| **AMARILLO 4–5/10** | o molestia que tarda en irse → mantén la carga, no subas, repite la semana. |
| **ROJO >5/10** | o la rigidez matutina empeora, o el síntoma dura más de 24 h → baja un escalón y reevalúa en 48–72 h. |

#### El mapa completo (las semanas son guía; se avanza por criterios)

| Fase | Semanas | Qué se hace |
|---|---|---|
| **M1** | sem 1–3 | Descarga y analgesia. Isométricos de cuádriceps, proteger el tendón. |
| **M2** | sem 4–8 | Carga lenta (HSR) — introducción. Sentadilla, prensa, extensión en arco controlado. |
| **M3** | sem 9–14 | Fuerza pesada (HSR), rango completo, unilateral. |
| **M4** | sem 15–20 | Energía elástica y pliometría. Saltos y aterrizajes. |
| **M5** | sem 21–24 | Readaptación deportiva. Salto, aterrizaje, cambios de dirección. |

##### SEM 1–3 · M1 — Bajar el dolor y despertar el muslo
**Apoyo / muletas:** Normal (caminar). Evita bajar escaleras rápido y ponerte en cuclillas.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Isométrico de cuádriceps** (sentadilla española con liga, o en máquina de extensión en ángulo medio) **5 × 45 seg a ~70%**, sin dolor — baja el dolor del tendón
> - Movilidad; agentes (láser / TECAR / ultrasonido pulsado)

> **🚫 TODAVÍA NO**
>
> - Saltar, aterrizar, correr
> - Sentadilla o cuclilla profunda, bajar escaleras rápido
> - Prensa o sentadilla pesadas

> **⊕ Si es DESGARRE parcial:** isométricos más suaves y cuidando la cicatriz; progresa más lento y confirma rangos con el fisioterapeuta.

##### SEM 4–8 · M2 — Empezar la carga lenta (HSR)
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Sentadilla** (goblet con talones elevados), **prensa** y **extensión de rodilla**, tempo 3 seg sube / 3 seg baja, **3 × 12–15 bajando a 3 × 10–12**
> - Rango controlado (no profundo todavía); tres veces por semana en días alternos

> **🚫 TODAVÍA NO**
>
> - Saltos, pliometría, correr
> - Sentadilla profunda bajo carga y aterrizajes
> - Subir la carga de golpe

> **⊕ DESGARRE parcial:** mantén el rango aún más corto y sube el peso más despacio — la cicatriz manda.

##### SEM 9–14 · M3 — Fuerza pesada (HSR)
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Progresar a **3–4 × 8** (y hacia **4 × 6** en lo más avanzado), rango completo, énfasis en la bajada (excéntrico)
> - Añadir unilateral (una pierna)
> - Sube el peso en escalones chicos, nunca de golpe

> **🚫 TODAVÍA NO**
>
> - Saltos de alta intensidad y carrera todavía
> - Romper la regla del dolor (si amanece peor, baja un escalón)

##### SEM 15–20 · M4 — Energía elástica y pliometría
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Pliometría progresiva:** saltos y aterrizajes de menos a más — volumen antes que intensidad
> - Mantener 2 × semana el HSR pesado como base

> **🚫 TODAVÍA NO**
>
> - Saltos máximos o competir antes de tolerar la pliometría
> - Cambios de dirección bruscos al inicio

##### SEM 21–24 · M5 — Readaptación deportiva
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Salto, aterrizaje y cambios de dirección específicos del deporte
> - Reintroducir el gesto deportivo

> **🚫 TODAVÍA NO**
>
> - Competir antes de cumplir los criterios de retorno

#### Criterios de retorno — hay que cumplir TODO
- **Fuerza del muslo:** cuádriceps ≥90% de la pierna sana.
- **Saltos:** hop / salto ≥90% de simetría con la otra pierna.
- **Cuestionario:** VISA-P en ascenso (escala de función del tendón rotuliano que llena el paciente).
- **Gesto:** sin dolor en el polo inferior al saltar, aterrizar o en el gesto del deporte.

#### 🚩 Señales de alarma — avisa de inmediato
- **Dolor agudo con un esfuerzo + no puedes estirar la rodilla** (extensión) → posible rotura del tendón, acude de inmediato.
- Pérdida de fuerza para subir escaleras o levantarte de la silla.
- Aumento marcado de edema o dolor que no cede.
- La rigidez de la mañana empeora semana a semana → vas sobrecargado, baja la carga y avísame.

> **La carga es el tratamiento; los aparatos acompañan.** Si hubo cirugía o material, la orden del cirujano manda sobre estos tiempos.

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

### Prótesis de rodilla — guía post-operatoria semana a semana

Te pusieron una **prótesis (reemplazo) de rodilla**: el metal y plástico sustituyen la articulación gastada. A diferencia de otras cirugías, aquí no hay que proteger una costura de tejido blando — el reto es **recuperar el movimiento pronto** (sobre todo la extensión completa y la flexión) antes de que se endurezca, y reconstruir la fuerza para caminar bien. Se avanza por logros, y la orden del cirujano manda. La prótesis es para **actividad de bajo impacto**: nada de correr ni saltar de por vida.

#### ⛔ PRIMERO: lo que hay que entender
- **Total (TKA):** se reemplazó toda la articulación. Lo más común. Apoyo según tolere casi desde el día 1.
- **Parcial (unicompartimental, UKA):** se reemplazó solo un lado de la rodilla. Suele recuperar más rápido, pero mismas reglas.

> **La prioridad #1 es el movimiento:** extensión completa (que estire del todo) y ganar flexión. Si el rango se estanca las primeras semanas, cuesta mucho recuperarlo después.

**Agentes físicos por fase:** la **crioterapia (hielo) + compresión** es protagonista las primeras semanas (hay mucho edema); TECAR atérmica y láser para analgesia y flujo.

> **⚠️ Seguridad — MUY importante con prótesis:** nada de radiofrecuencia, diatermia, TECAR térmica ni ultrasonido térmico **sobre la prótesis** (el metal se calienta y daña el hueso alrededor). Precaución con anticoagulación (es común tras esta cirugía), cáncer activo, embarazo y trombosis.

| Semáforo del dolor | Qué hacer |
|---|---|
| **VERDE ≤3/10** | que se va, edema que baja → progresa el rango y la fuerza. |
| **AMARILLO 4–5/10** | o rodilla más caliente/hinchada al día siguiente → mantén, no fuerces. |
| **ROJO >5/10** | edema marcado, calor con fiebre, o pantorrilla hinchada → para y avísame. |

#### Línea de tiempo — hitos clave

| Hito (lo que la persona logra) | ¿Cuándo, aprox.? |
|---|---|
| Estira la rodilla completa; dobla ~90° | **Semana 1–2** |
| Deja el andador / las muletas | **Semana 2–4** |
| Dobla ~110°+; camina sin cojear | **Semana 6** |
| Sube y baja escaleras alternando | **Semana 8–12** |
| Actividad de bajo impacto (bici, caminar, natación) | **Mes 3+** |

##### SEM 0–2 — Movimiento y bajar el edema
**Apoyo / muletas:** Apoyo según tolere con andador o muletas (la prótesis aguanta carga desde el inicio).

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Extensión completa:** talón en alto dejando caer la rodilla, o boca abajo con la pierna colgando
> - **Flexión asistida hasta ~90°:** talón deslizando, con ayuda de la otra pierna
> - Isométricos de cuádriceps + electroestimulación; elevación de pierna estirada
> - Crioterapia y compresión para el edema; movilización de la rótula

> **🚫 TODAVÍA NO**
>
> - Descuidar la extensión por perseguir la flexión
> - Forzar con dolor agudo
> - Estar mucho tiempo con la rodilla doblada (almohada bajo la rodilla) — se pega en flexión

##### SEM 2–6 — Dejar el andador y fuerza
**Apoyo / muletas:** Progresar el apoyo; dejar el andador/muletas cuando camines seguro.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Flexión progresando a 110°+
> - Bici fija (primero medios giros adelante/atrás, luego vuelta completa)
> - Cadena cerrada: sentadilla parcial, prensa, step-ups bajos; fuerza de cuádriceps y glúteo

> **🚫 TODAVÍA NO**
>
> - Impacto, correr, saltar
> - Giros bruscos con el pie fijo

##### SEM 6–12 — Movimiento completo y marcha normal
**Apoyo / muletas:** Marcha normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Recuperar la flexión completa y afinar la extensión
> - Fuerza progresiva; escaleras alternando los pies
> - Elíptica, bici con resistencia

> **🚫 TODAVÍA NO**
>
> - Correr, saltar, deportes de impacto

##### MES 3+ — Resistencia y vida normal
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Progresar fuerza y resistencia
> - Actividad de bajo impacto: caminar, bici, natación, golf

> **🚫 TODAVÍA NO**
>
> - Impacto alto de por vida: correr, saltar, deportes de contacto — desgastan la prótesis

#### Criterios de alta funcional
- **Movimiento:** extensión completa (0°) y flexión ≥110–120°.
- **Marcha:** camina sin cojear y sin ayuda; sube y baja escaleras alternando.
- **Fuerza:** cuádriceps y glúteo que permitan levantarse de una silla sin empujarse con las manos.

#### 🚩 Señales de alarma — avisa de inmediato
- **Dolor e hinchazón en la pantorrilla de una sola pierna** → posible coágulo (trombosis), frecuente tras esta cirugía (urgencia).
- Rodilla **caliente + hinchada + fiebre**, o secreción por la herida → posible infección (urgencia).
- Un "tronido" fuerte + no poder apoyar o la pierna se deforma → acude de inmediato.
- La flexión o la extensión **se estancan y no mejoran en varias semanas** → avísame, hay que intervenir el rango pronto.

> **La orden del cirujano manda** sobre apoyo y tiempos. El objetivo siempre: ganar el movimiento temprano y proteger la prótesis del impacto.

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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Tras microfractura / estimulación de médula ósea (coágulo → fibrocartílago; la rehab más protectora al inicio). Carga típica: touch-down/NWB ~2 sem → carga parcial +~25%/sem → carga total ~6-8 sem [verificar] (lesiones >4 cm² se protegen más). Trote ~4-6 meses, impacto/deporte ~6-9 meses [verificar].
>
> **⛔ Contraindicaciones / cuándo derivar:** Derrame y/o dolor que aparecen o aumentan con la carga = sobrecarga/falla del relleno → retroceder y avisar. Bloqueo o resalto mecánico → coágulo/fragmento suelto, referir urgente. TVP (pantorrilla) o infección (fiebre, derrame turbio) → referir urgente.
>
> **⚠️ Precauciones:** Separar CARGA de ROM — el coágulo frágil no debe recibir cizalla al apoyar, pero SÍ movimiento sin carga que lo nutre. Zona de carga (cóndilo/platillo): restringir PESO semanas, ROM/CPM sin carga temprano, rodillera bloqueada en extensión para marcha. Patelofemoral (inverso): apoyar en extensión OK, restringir FLEXIÓN cargada (cadena cerrada solo en arco corto cercano a extensión). En cartílago el CPM SÍ se usa (nutre; ~6 h/día × 6-8 sem) [verificar]. Manda el cirujano.

**Cóndilo femoral / platillo tibial (zona de carga):**
- **Carga:** descarga protegida prolongada. Típico **touch-down/NWB las primeras ~2 semanas**, luego **carga parcial progresiva ~+25% del peso/semana**, llegando a carga total hacia **~6–8 semanas** [verificar]. Lesiones grandes (**>4 cm²**) se protegen más (4–6+ sem de carga restringida) [verificar].
- **ROM/CPM:** **temprano y sin carga** desde el día 1 (CPM ~6 h/día × 6–8 sem). Rodillera a menudo **bloqueada en 0° para la marcha ~6–8 sem** [verificar], abierta para ROM.
- **Lógica:** el coágulo no debe recibir cizalla al apoyar, pero sí movimiento sin carga para que madure a fibrocartílago.

**Patelofemoral (rótula/tróclea) — inverso:**
- **Carga:** **apoyo temprano permitido en EXTENSIÓN** con rodillera bloqueada en extensión.
- **Flexión:** **restringida** (flexión limitada progresiva, evitar flexión cargada profunda ~6–8 sem) para no cizallar; cadena cerrada solo en arco corto cercano a extensión [verificar].

#### 4.2 OAT / OATS / mosaicoplastia (autoinjerto osteocondral) — manda la integración del hueso

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Tras autoinjerto osteocondral (cilindros de hueso + cartílago hialino propio). Carga en cóndilo: NWB/touch-down 0-3/0-4 sem → PWB 25-50% sem 3-6 → carga total ~8 sem (algunos 10-12) [verificar]; ROM temprano permitido. Impacto diferido ~6 meses, deporte ~6-9 meses [verificar].
>
> **⛔ Contraindicaciones / cuándo derivar:** Derrame/dolor que aparecen o aumentan con la carga = sobrecarga del injerto → retroceder y avisar. Bloqueo/resalto → tapón desprendido o cuerpo libre, referir urgente. TVP o infección → referir urgente.
>
> **⚠️ Precauciones:** La progresión de carga sigue la INTEGRACIÓN del tapón ÓSEO (~6-12 sem [verificar]), no la maduración del cartílago. ROM temprano permitido (cartílago hialino propio); rodillera bloqueada en extensión para marcha/sueño ~2-4 sem. Patelofemoral: carga en extensión OK, flexión cargada restringida y rodillera en extensión más tiempo. Varía por tamaño y nº de tapones → manda el cirujano.

- **Carga (cóndilo):** varía por tamaño y nº de tapones. Rango de protocolos: **NWB/touch-down 0–3/0–4 sem → PWB 25–50% sem 3–6 → FWB ~8 sem** (algunos cirujanos más lentos: FWB 10–12 sem) [verificar]. La progresión sigue la **consolidación del tapón óseo**.
- **ROM:** generalmente **movilización temprana** permitida (el cartílago es hialino propio); rodillera bloqueada en extensión para marcha/sueño ~2–4 sem en algunos protocolos [verificar].
- **Impacto/deporte:** impacto diferido a **~6 meses**; retorno al deporte ~6–9 meses según demanda [verificar].
- **Patelofemoral:** mismo principio PF — carga en extensión OK, flexión cargada restringida; rodillera en extensión más tiempo.

#### 4.3 ACI / MACI (condrocitos autólogos) — maduración lenta, fases largas

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Tras implante de condrocitos autólogos (ACI / MACI sobre matriz de colágeno); maduración la MÁS lenta (adhesión 0-6 sem → transición 7-12 sem → remodelación 3-6 m → maduración 9-12 m, remodelado hasta 1-3 años [verificar]). Carga a total ~6(-8) sem; retorno a impacto el más tardío de la biblioteca.
>
> **⛔ Contraindicaciones / cuándo derivar:** Derrame/dolor que aparecen o aumentan con la carga = sobrecarga del injerto → retroceder y avisar. Bloqueo/resalto → injerto desprendido o cuerpo libre, referir urgente. TVP o infección → referir urgente.
>
> **⚠️ Precauciones:** Fases largas por maduración lenta → NO acelerar (frenar al paciente que quiere correr a los 3 meses); impacto/pivote NO antes de ~9 meses, frecuentemente 12-18 meses (PF y lesiones grandes lo más tardío) [verificar]. Extensión bloqueada ~48 h, luego ROM pasivo progresivo + CPM temprano. Patelofemoral: carga más lenta + rodillera con FLEXIÓN LIMITADA bajo carga (~60° en protocolos acelerados [verificar]); marcha en extensión, fortalecimiento en arco corto. Manda el cirujano.

- **Carga (cóndilo/tibiofemoral):** descarga protegida con **progresión ~+25%/semana a carga total hacia ~6(–8) semanas**; destete de rodillera ~sem 6 [verificar]. (Guía clínica JOSPT recomienda **progresión escalonada a carga total en 6–8 semanas** para lesiones de cartílago articular.)
- **ROM/CPM:** **extensión bloqueada las primeras ~48 h**, luego ROM pasivo progresivo + **CPM** temprano; recuperar extensión completa pronto.
- **Patelofemoral (clave):** la carga progresa **más lento** que en tibiofemoral y, sobre todo, se usa **rodillera con FLEXIÓN LIMITADA bajo carga** (p. ej. límite ~**60° para injertos PF** en protocolos acelerados de Ebert/D'Alessandro [verificar]; otros desbloquean la flexión conforme hay control de cuádriceps ~sem 7–12). Marcha en extensión; fortalecimiento en arco corto.
- **Fuerza:** meses **3–6** (recuperar lo perdido en la descarga).
- **Impacto/deporte:** trote **~7–9 meses**, carrera **~9–12 meses**, **impacto/pivote NO antes de ~9 meses** y con frecuencia **12–18 meses**, especialmente PF y lesiones grandes [verificar]. Es el procedimiento con **retorno MÁS tardío** por su maduración lenta.

#### 4.4 Aloinjerto osteocondral (OCA) — más conservador por incorporación ósea lenta

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Tras aloinjerto osteocondral (cartílago hialino + hueso de donante). Más conservador que el autoinjerto porque el hueso del donante se incorpora más lento: touch-down/PWB ~2 sem → ~50% sem 2-8 → carga total ~8-12 sem [verificar]; deporte ~9-12 meses o más (profesionales ~1.2 años [verificar]).
>
> **⛔ Contraindicaciones / cuándo derivar:** Derrame/dolor que aparecen o aumentan con la carga = sobrecarga del injerto → retroceder y avisar. Bloqueo/resalto → injerto desprendido o cuerpo libre, referir urgente. TVP o infección → referir urgente.
>
> **⚠️ Precauciones:** La incorporación del hueso del donante es MÁS LENTA que en autoinjerto → carga más conservadora y retorno tardío. Alta variabilidad entre cirujanos en los tiempos de carga → confirmar el protocolo. Patelofemoral más lento aún (carga en extensión OK, flexión cargada restringida). ROM temprano con rodillera en extensión para marcha. Manda el cirujano.

- **Carga:** **más conservadora que autoinjerto** porque la incorporación del hueso del donante tarda más. Rango de protocolos: **touch-down/PWB ~2 sem → ~50% sem 2–8 → FWB ~8–12 sem** [verificar]. **Alta variabilidad entre cirujanos** (encuesta de 76 cirujanos: desde NWB con FWB a las 12 sem hasta carga según tolerancia inmediata; los de mayor volumen tienden a ser menos restrictivos).
- **ROM:** movilización temprana habitual; rodillera en extensión para marcha.
- **Deporte:** **~9–12 meses o más** (profesionales: tiempo medio de retorno **~1.2 años** [verificar]); PF más lento.

#### 4.5 Lesión osteocondral del ASTRÁGALO (OLT) — zona de carga del tobillo

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Tras cirugía de lesión osteocondral del astrágalo (OLT, zona de carga del tobillo). BMS/microfractura: clásico NWB estricto 6-8 sem [verificar] + ROM de tobillo sin carga temprano; OAT/aloinjerto suele requerir osteotomía maleolar (NWB ~5-6 sem [verificar]). Retorno: BMS ~15 sem a ~5.5 meses (retorno ~76%); AMIC deporte ~6 m, medio ~12 m en >1.5 cm² [verificar].
>
> **⛔ Contraindicaciones / cuándo derivar:** Derrame/dolor que aparecen o aumentan con la carga = sobrecarga → retroceder y avisar. Bloqueo/resalto → fragmento suelto, referir urgente. TVP (riesgo alto por inmovilización/descarga) o infección → referir urgente.
>
> **⚠️ Precauciones:** Zona de carga del tobillo → restringir PESO (NWB) pero ROM de tobillo (dorsi/plantiflexión) sin carga temprano para nutrir y evitar rigidez. Si hay osteotomía maleolar → respetar su consolidación + hardware metálico: capturar en `seguridadClinica`, nada de calor profundo (RF/tecar térmica/onda corta/US térmico) sobre el material. Duración óptima de NWB sin consenso (6-8 sem es tradición, no verdad establecida) [verificar]. Manda el cirujano.

- **BMS/microfractura del astrágalo:** clásico **NWB estricto 6–8 semanas** para proteger el fibrocartílago [verificar]. **Debate actual:** carga temprana vs. tardía — el ECA de **Deal (2019)** mostró mejores puntajes a corto plazo con carga temprana pero **sin diferencia significativa a 2 años**; metaanálisis: **no concluyente**. Tendencia reciente a reanudar carga algo antes, pero muchas series mantienen 6 sem. **ROM de tobillo temprano sin carga** (dorsi/plantiflexión) para nutrir y evitar rigidez.
- **OAT/aloinjerto en astrágalo:** frecuentemente requiere **osteotomía maleolar** para acceder → la rehab también respeta la **consolidación de la osteotomía** (hardware metálico, ver sección 8). NWB ~**5–6 sem** [verificar], luego progresión.
- **AMIC (matriz + BMS) en astrágalo:** deporte competitivo desde **~6 meses**, retorno medio **~12 meses** para lesiones >1.5 cm² [verificar].
- **Retorno al deporte (OLT):** BMS/microfractura **~15 semanas a ~5.5 meses** (tasa de retorno ~**76%**, muchos no al nivel previo); pediátricos con lesiones pequeñas (<10 mm) hasta 100% de retorno [verificar]. OATS: la mayoría retorna pero con menor frecuencia de práctica. **Guía DGOU 2024:** sin ventaja clara de microfractura sobre micro-perforación; trasplante osteocondral para lesiones que fallaron a BMS.

#### 4.6 Osteocondritis disecante (OCD) de rodilla — ESTABLE vs INESTABLE, JUVENIL vs ADULTO

> **📋 Encuadre**
>
> **🎯 Indicaciones:** OCD de rodilla; la distinción ESTABLE/INESTABLE y JUVENIL/ADULTO define todo. Juvenil estable (fisis abiertas) → NO quirúrgico primero (restricción ± descarga/rodillera descargadora ~4-6 sem → carga según tolerancia 6-12 sem). Adulto inestable (fisis cerradas) → fijación del fragmento (tornillos/pins); carga protegida ~6-8 sem, deporte excluido ≥8 meses [verificar].
>
> **⛔ Contraindicaciones / cuándo derivar:** Fragmento inestable/suelto → BLOQUEO articular (referir urgente, posible cirugía). Derrame/dolor que aumentan con la carga → retroceder y avisar. TVP o infección → referir urgente.
>
> **⚠️ Precauciones:** Clasificar bien (estable vs inestable, juvenil vs adulto) porque cambia todo el manejo. Tras fijación: flexión a menudo limitada <90° ~6 sem para proteger la fijación [verificar]; fijación metálica → capturar en `seguridadClinica`, nada de calor profundo (RF/tecar térmica/onda corta/US térmico) sobre el material. Corregir malalineación u inestabilidad ligamentaria concomitante si existe. Evidencia mayormente de bajo nivel. Manda el cirujano.

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
| Carga total sin muletas | ~6–8 sem | ~8 (–12) sem | ~8–12 sem | ~6–8 sem | ~8–10 sem (tras NWB estricto 6–8 sem) | ~6 sem |
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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Esguince lateral agudo de manejo conservador, grados I–III (lesión de LPAA/ATFL ± ligamento peroneocalcáneo/CFL), una vez descartada fractura.
>
> **⛔ Contraindicaciones / cuándo derivar:** Ottawa positivo no estudiado, dolor óseo focal o incapacidad de carga persistente → sospecha de fractura, estudiar antes de rehabilitar. Dolor proximal/anterolateral o dolor con rotación externa → sospecha sindesmal (tratar como cuadro #2, más lento). Dolor en seno del tarso, bloqueos o derrame persistente → lesión osteocondral del astrágalo. Dolor retromaleolar/subluxación de peroneos o dolor en base del 5º MTT (fractura por avulsión).
>
> **⚠️ Precauciones:** Carga óptima/temprana preferida sobre reposo; en grado III o dolor marcado, apoyo breve con bota CAM/muletas los primeros días. Soporte funcional (tobillera semirrígida/vendaje) preferido sobre inmovilización rígida prolongada. Evitar inversión forzada/pasiva máxima en fase temprana. No correr/pliometría hasta equilibrio monopodal estable. Progresar por CRITERIOS (no calendario); tobillera/taping profiláctico al retorno.

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
- Dolor en seno del tarso, bloqueos, derrame persistente → sospechar lesión osteocondral del astrágalo (ver 🧩 Cartílago §4.5 OLT).
- Dolor retromaleolar/subluxación de peroneos; dolor en base 5º MTT (fractura por avulsión).

#### Fuentes
- Martin RL et al. **CPG lateral ankle ligament sprains revision, JOSPT 2021** (51[4]:CPG1-CPG80). · van Dijk CN, 1996 (reexploración diferida). · Croy 2013 (cajón anterior). · Bachmann, BMJ 2003 + metaanálisis adultos 2022 (Ottawa). · Protocolo MGH esguince lateral no operatorio. · Marco PEACE & LOVE (Dubois & Esculier, 2019).

---

### 2) Esguince SINDESMAL / "high ankle sprain" (ambos: conservador si estable · quirúrgico si inestable)

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Lesión de la sindesmosis ("high ankle sprain"). Conservador estructurado si ESTABLE (West Point/Calder I–IIA); estabilización quirúrgica si INESTABLE (IIB–III o diástasis en imagen).
>
> **⛔ Contraindicaciones / cuándo derivar:** Diástasis en imagen / inestabilidad → no rehabilitar como estable, valorar cirugía. Dolor proximal en peroné → descartar fractura de Maisonneuve. Ningún test clínico es a la vez sensible y específico → ante sospecha, imagen (Rx en carga/estrés, TC/RM) para medir diástasis y estabilidad.
>
> **⚠️ Precauciones:** ~2× más lento que el esguince lateral. Fase 1 con inmovilización en bota, frecuentemente sin carga o carga parcial protegida ~2–3 sem. Evitar rotación externa y dorsiflexión forzada (reproducen el mecanismo); dorsiflexión progresiva solo al final. No pliometría/cambios de dirección hasta tener fuerza y dorsiflexión funcionales. En post-qx (tornillo/suture-button) manda el cirujano; nada térmico (RF/diatermia/tecar/US térmico) sobre el material.

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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Post-operatorio de reparación/reconstrucción lateral (Broström-Gould); indicación quirúrgica = inestabilidad lateral crónica sintomática que falló a rehabilitación.
>
> **⛔ Contraindicaciones / cuándo derivar:** No hay protocolo único (varía por técnica —reparación simple vs aumentada con suture tape/InternalBrace— y por cirujano) → manda el protocolo del cirujano. Dehiscencia/infección de herida, dolor neuropático (nervio sural) o rigidez marcada persistente → revalorar.
>
> **⚠️ Precauciones:** Evitar inversión y flexión plantar forzadas sem 0–2 (tensan la reparación); restringir inversión hasta ~sem 4–6. Carga según protocolo (convencional: sin carga sem 0–2; acelerado/aumentado: carga en bota desde el inicio). Caída/torcedura en fase protegida = riesgo de fallo de la reparación. Anclas = metal → agentes atérmicos y lejos del implante. Progresar por criterios.

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

### Tendón de Aquiles — guía por tipo, semana a semana (porción media · insercional · roto/reparado)

El tendón de Aquiles une la pantorrilla con el talón. Se trata con **carga progresiva**: el ejercicio es el tratamiento y los aparatos (láser, TECAR, ultrasonido) solo acompañan. Lo primero es saber **QUÉ tipo es**, porque el ejercicio que cura a uno puede empeorar al otro. El termómetro más fiable es la **rigidez o el dolor de la mañana**: si amanece peor, hubo sobrecarga aunque durante el ejercicio no doliera. Se avanza por logros, no por calendario.

#### ⛔ PRIMERO: ¿qué tipo de Aquiles es? — de esto depende TODO
Ubica dónde duele. No es lo mismo el tendón irritado que el tendón roto, y dentro del irritado, no es lo mismo arriba que pegado al hueso:
- **Porción media (el más común):** duele en el cordón del tendón, uno o dos dedos por arriba del talón. Mejor pronóstico. Aquí estirar bajo carga ayuda — en fases avanzadas puede bajar el talón del escalón.
- **Insercional:** duele justo donde el tendón se pega al hueso del talón (atrás y abajo); a veces hay un bulto duro (Haglund). Más lento. Estirar el tobillo hacia arriba **APLASTA el tendón contra el hueso** → por eso NO se baja del escalón.
- **Roto / reparado:** el tendón se rompió (te operaron, o traes bota con cuñas). Otro mundo: primero se protege la reparación y se progresa despacio; no se estira temprano. **Manda el cirujano.**

Esta guía tiene dos partes: **Sección 1** para el tendón irritado (porción media e insercional, con lo que cambia en cada uno marcado con ⊕) y **Sección 2** para el tendón roto o reparado.

**Agentes físicos por fase** (acompañan a la carga, no la sustituyen):
- **Fase aguda:** láser (fotobiomodulación) en el foco; TECAR atérmica para analgesia; ultrasonido pulsado si hay edema; hielo tras la sesión.
- **Fase de carga:** láser y TECAR antes o después de la carga; la carga (HSR) es el tratamiento.
- **Fase avanzada:** los aparatos casi se retiran; foco en carga, potencia y gesto.
- **Ondas de choque:** útil en tendinopatía crónica o calcificante (más en insercional con calcificación) — no en desgarre agudo ni sobre un tendón recién reparado.

> **⚠️ Seguridad:** nada de radiofrecuencia, diatermia, TECAR térmica ni ultrasonido térmico sobre material de osteosíntesis, prótesis o marcapaso. Precaución con anticoagulación, cáncer activo, embarazo y trombosis.

| Semáforo del dolor (Silbernagel) | Qué hacer |
|---|---|
| **VERDE ≤3/10** | durante el ejercicio, que se normaliza en 24 h y sin más rigidez en la mañana → progresa. |
| **AMARILLO 4–5/10** | o molestia que tarda en irse → mantén la carga, no subas, repite la semana. |
| **ROJO >5/10** | o la rigidez matutina empeora, o el síntoma dura más de 24 h → baja un escalón y reevalúa en 48–72 h. |

#### Sección 1 — Tendón IRRITADO (tendinopatía): porción media e insercional

El mapa completo (las semanas son guía; se avanza por criterios):

| Fase | Semanas | Qué se hace |
|---|---|---|
| **M1** | sem 1–2 | Analgesia e isométricos. |
| **M2** | sem 3–6 | Carga lenta (HSR) — introducción. |
| **M3** | sem 7–12 | Fuerza pesada (HSR), unilateral. |
| **M4** | sem 13–18 | Energía elástica (rebote y saltos). |
| **M5** | sem 19–24 | Readaptación y carrera. |

##### SEM 1–2 · M1 — Bajar el dolor y despertar el tendón
**Apoyo / muletas:** Normal (caminar).

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Isométrico de gemelo** (de puntas, aguanta arriba) **5 × 45 seg a ~70%** de tu fuerza, en rango neutro
> - Movilidad suave de tobillo; agentes (láser / TECAR / ultrasonido pulsado)

> **🚫 TODAVÍA NO**
>
> - Correr, saltar, brincar
> - Cuestas y escaleras pesadas

> **⊕ Si es INSERCIONAL:** el isométrico en neutro o en puntas (plantiflexión), nunca con el talón caído. Evita los estiramientos que lleven el tobillo hacia arriba — aplastan la inserción.

##### SEM 3–6 · M2 — Empezar la carga lenta (HSR)
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Elevación de talón**, tempo 3 seg sube / 3 seg baja, **3 × 12–15**, tres veces por semana en días alternos
> - Bipodal → unipodal conforme toleres
> - De pie (trabaja el gemelo) y sentado (trabaja el sóleo)

> **🚫 TODAVÍA NO**
>
> - Saltar, correr, pliometría
> - Subir la carga de golpe

> **⊕ INSERCIONAL:** haz la elevación en el piso (de 0 a puntas), SIN bajar el talón por debajo del escalón. **Porción media:** rango completo, y más adelante puede añadir el déficit (bajar del escalón).

##### SEM 7–12 · M3 — Fuerza pesada (HSR)
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Progresar hacia **3 × 8 (8RM)**, manteniendo el tempo 3-3
> - Unilateral y prensa de gemelo / con mancuerna
> - Sube el peso en escalones chicos, nunca de golpe (el tendón castiga el salto brusco de carga)

> **🚫 TODAVÍA NO**
>
> - Saltos de alta intensidad y carrera todavía
> - Romper la regla del dolor (si amanece peor, baja un escalón)

> **⊕ INSERCIONAL:** sigue sin déficit (sin bajar del escalón). **Porción media:** ya puede meter déficit controlado si no hay dolor matutino.

##### SEM 13–18 · M4 — Energía elástica (rebote y saltos)
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Skipping, pogos y saltos progresivos** — volumen antes que intensidad
> - Mantener 2 × semana el HSR pesado como base

> **🚫 TODAVÍA NO**
>
> - Correr a alta intensidad antes de tolerar los saltos
> - Saltar en terreno irregular al inicio

> **⊕ INSERCIONAL:** mete el impacto más despacio — la caída en dorsiflexión comprime la inserción. Vigila la mañana siguiente.

##### SEM 19–24 · M5 — Volver a correr y al deporte
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Programa de carrera progresivo** (alterna caminar y trotar)
> - Gesto específico del deporte, cambios de dirección

> **🚫 TODAVÍA NO**
>
> - Competir o correr al máximo antes de cumplir los criterios de retorno

#### Sección 2 — Tendón ROTO O REPARADO (protocolo distinto)

Aquí el chip cambia. Si el tendón se rompió (operado o en bota con cuñas), primero se protege la reparación y se sube la carga despacio. **NO se estira el tendón temprano:** se puede alargar o volver a romper. El cirujano manda sobre los tiempos, las cuñas y cuándo dejar la bota.

Línea de tiempo (según el cirujano):

| Hito (lo que la persona logra) | ¿Cuándo, aprox.? |
|---|---|
| Bota con cuñas, carga protegida | **Sem 0–2** |
| Empieza a quitar cuñas (destete) | **Sem 2–6** |
| Deja la bota, camina normal | **~Sem 8** |
| Empieza la fuerza (HSR) | **Sem 8–12** |
| Saltos y carrera | **Mes 3–6** |
| Vuelve al deporte | **6–9 meses** |

##### SEM 0–2 — Proteger la reparación
**Apoyo / muletas:** Bota con cuña de talón (pie en puntas). Carga según el cirujano (a veces parcial, con muletas).

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Mover los dedos del pie
> - Isométricos muy suaves de gemelo solo si el cirujano lo autoriza
> - Cuidar la cicatriz; hielo y elevar
> - Entrena lo que no toca la pierna: core, tren superior, pierna sana

> **🚫 TODAVÍA NO**
>
> - Estirar el tendón (llevar el tobillo hacia arriba)
> - Quitar las cuñas por tu cuenta
> - Apoyar sin la bota

> **Clave:** en esta fase el enemigo es estirar. Todo movimiento que lleve el pie hacia arriba (dorsiflexión) pone en riesgo la reparación.

##### SEM 2–6 — Quitar cuñas poco a poco
**Apoyo / muletas:** Destete de las cuñas (según el cirujano), llevando el pie de puntas hacia neutro. Carga parcial → total con la bota.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Rango activo sin pasar de neutro (el pie llega a plano, no más arriba)
> - Isométricos de gemelo progresivos
> - Bici con la bota si se puede

> **🚫 TODAVÍA NO**
>
> - Llevar el pie hacia arriba más allá de neutro (dorsiflexión)
> - Impacto, saltar
> - Caminar sin bota antes de que lo autoricen

##### SEM 6–8 — Dejar la bota
**Apoyo / muletas:** Dejar la bota (según el cirujano) y pasar a marcha normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Recuperar el rango completo poco a poco (ya se permite llegar arriba, sin forzar)
> - Isométricos y elevación de talón bipodal asistida
> - Movilización de la cicatriz

> **🚫 TODAVÍA NO**
>
> - Saltar, correr
> - Forzar el estiramiento de golpe

##### SEM 8–12 — Empezar la fuerza (HSR)
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - **Elevación de talón HSR**, tempo 3-3, bipodal → unipodal
> - Progresar la carga en escalones chicos
> - Prensa de gemelo / con mancuerna

> **🚫 TODAVÍA NO**
>
> - Impacto, carrera, saltos todavía

##### MES 3–6 — Energía elástica y carrera
**Apoyo / muletas:** Normal.

> **✅ YA PUEDE (ideas de ejercicio)**
>
> - Saltos progresivos (volumen antes que intensidad), luego programa de carrera
> - Gesto del deporte

> **🚫 TODAVÍA NO**
>
> - Competir o volver al deporte antes de cumplir criterios Y del visto bueno del cirujano

#### Criterios de retorno — hay que cumplir TODO
- **Fuerza del tendón:** elevación de talón en una pierna ≥90% del lado sano (en número de repeticiones y en carga).
- **Saltos:** hop / salto ≥90% de simetría con la otra pierna.
- **Cuestionario:** VISA-A en ascenso (escala de función del Aquiles que llena el paciente).
- **Carrera:** corre sin dolor en la mañana siguiente.
- **Si fue rotura:** además, visto bueno del cirujano y, normalmente, 6–9 meses desde la cirugía.

#### 🚩 Señales de alarma — avisa de inmediato
- **Dolor agudo y chasquido con un esfuerzo + no puedes empujar con el pie** → posible rotura, acude de inmediato.
- Pérdida de fuerza para ponerte de puntas.
- Aumento marcado de edema o dolor que no cede.
- La rigidez de la mañana empeora semana a semana → vas sobrecargado, baja la carga y avísame.
- En tendón reparado: rodilla/tobillo **caliente + hinchado + fiebre** → posible infección (urgencia).

> **La carga es el tratamiento; los aparatos acompañan.** En el tendón roto o reparado, la orden del cirujano manda sobre estos tiempos.

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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Dolor plantar del talón por sobrecarga de la fascia en su origen (tubérculo calcáneo medial); cuadro degenerativo/no inflamatorio ("fasciopatía"). Hallmark = dolor del primer paso matutino/tras reposo. Muy frecuente en la clínica (~65 pacientes).
>
> **⛔ Contraindicaciones / cuándo derivar:** Fractura por estrés del calcáneo (dolor que empeora con la carga, dolor nocturno/en reposo, compresión del calcáneo dolorosa en los lados) → no cargar agresivamente, derivar. Túnel del tarso (dolor quemante/irradiado, dolor en reposo, Tinel+). Artropatía inflamatoria (multiarticular, rigidez matutina prolongada, síntomas sistémicos). Rotura de fascia post-infiltración (dolor súbito con chasquido/equimosis/caída del arco). Pie de riesgo diabético (neuropático/vascular).
>
> **⚠️ Precauciones:** No reposo absoluto prolongado ni perseguir "0 dolor" antes de cargar. Carga progresiva por fases (Rathleff), respetando la regla de las 24 h / semáforo del dolor; no progresar en ámbar. Cuidado con corticoide repetido (riesgo de rotura de fascia y atrofia de la almohadilla grasa). ESWT solo en crónicos/refractarios (contraindicada en tumor local, marcapaso/implantes, coagulopatía/anticoagulación, embarazo, fisis abiertas, infección/lesión cutánea). En diabético con neuropatía, precaución con agentes térmicos (riesgo de quemadura); el ejercicio no está contraindicado. Cuadro lento (semanas a meses; crónicos 3–6 meses).

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
    - **Tempo lento (3-2-3):** ~3 s subida (concéntrico) / 2 s pausa isométrica arriba / 3 s bajada (excéntrico).
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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Insuficiencia del tibial posterior con pérdida del arco longitudinal medial / pie plano adquirido del adulto (clasificación Johnson y Strom). El conservador es más eficaz en estadios I–II (deformidad flexible); el estadio II es el clave para el fisio.
>
> **⛔ Contraindicaciones / cuándo derivar:** Deformidad RÍGIDA (estadio III–IV, suelen ser quirúrgicos), fracaso de 3–6 meses de conservador bien hecho, dolor incapacitante persistente o colapso progresivo del arco → valoración de cirugía ortopédica.
>
> **⚠️ Precauciones:** No cargar en valgo sin soporte; evitar impacto repetitivo en fase irritable. Ortesis (soporte de arco medial / AFO corta) más eficaz mientras la deformidad es flexible. Fortalecimiento excéntrico/progresivo del tibial posterior y control del arco; progresar por criterios (heel-rise unipodal controlado, sin flare a 24 h). Agentes físicos según `seguridadClinica`.

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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Sobrecarga del peroneo largo/corto en la cara lateral del tobillo/pie, a menudo tras inestabilidad lateral (nexo con el cuadro de esguince lateral).
>
> **⛔ Contraindicaciones / cuándo derivar:** Diferenciar de subluxación/luxación de peroneos (chasquido, inestabilidad del tendón) y de esguince lateral. Fracaso de 3–6 meses de conservador, o sospecha de inestabilidad/luxación tendinosa → ortopedia. Evidencia débil (consenso nivel V, sin protocolo de carga validado específico).
>
> **⚠️ Precauciones:** Control de carga inicial → progresión isométrico → concéntrico → excéntrico de eversión/flexión plantar. Evitar impacto lateral agresivo en fase irritable. Corregir el déficit de estabilidad lateral asociado; vendaje/órtesis en deporte de contacto. Recuperación estimada ~6–12 sem en casos no complicados [verificar].

- **Concepto:** sobrecarga de peroneo largo/corto en la cara **lateral** del tobillo/pie (a menudo tras inestabilidad lateral — nexo con la sección de tobillo). Diferenciar de subluxación/luxación de peroneos (chasquido, inestabilidad del tendón) y de esguince lateral.
- **Evidencia:** **débil** (consenso ESSKA-AFAS 2018 clasifica el manejo conservador como nivel V, opinión de experto; no hay protocolo de carga validado específico para peroneos).
- **Manejo (por criterios):** control de carga inicial → **progresión isométrico → concéntrico → excéntrico** de eversión/flexión plantar, control del retropié y propiocepción; vendaje/órtesis en deporte de contacto; corregir el déficit de estabilidad lateral asociado.
- **Qué SÍ / NO:** sí carga progresiva y trabajo de estabilidad del tobillo; evitar impacto lateral agresivo en fase irritable.
- **Derivación:** fracaso de 3-6 meses de conservador, o sospecha de inestabilidad/luxación tendinosa → ortopedia.
- **Recuperación:** estimada ~6-12 semanas en casos no complicados [verificar: dato de fuentes clínicas, no de ensayo].

---

### 4. Metatarsalgia / neuroma de Morton (breve)

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Neuroma de Morton = fibrosis perineural del nervio interdigital (típico 3er espacio): dolor plantar en antepié, sensación de "piedra en el zapato", disestesias a los dedos, peor con calzado estrecho/tacón. Metatarsalgia general = dolor por sobrecarga del antepié.
>
> **⛔ Contraindicaciones / cuándo derivar:** Descartar fractura por estrés metatarsiana (bandera roja) y artropatía inflamatoria. Derivar si persiste >6 semanas; escalones siguientes: corticoide → excisión quirúrgica.
>
> **⚠️ Precauciones:** Modificación de calzado (puntera ancha, bajar tacón); almohadilla metatarsiana colocada PROXIMAL a las cabezas (no justo bajo el punto doloroso) para abrir el espacio; descarga/modificación de actividad. Apoyar el dx con imagen (ecografía/RM) si hay duda (prueba de Mulder de sensibilidad muy variable).

- **Neuroma de Morton:** fibrosis perineural del nervio interdigital (típico 3er espacio), dolor plantar en antepié, "piedra en el zapato", disestesias a los dedos, peor con calzado estrecho/tacón.
- **Prueba de Mulder (click):** compresión latero-lateral de las cabezas metatarsianas ± presión plantar → dolor/click palpable reproducible. Sensibilidad reportada muy variable (desde ~60-70% hasta 94-98% según fuente; especificidad alta ~90%) [verificar: discrepancia no resuelta entre fuentes]; apoyar con imagen (ecografía/RM) si duda.
- **Manejo conservador:** **modificación de calzado** (puntera ancha, bajar tacón), **almohadilla metatarsiana colocada PROXIMAL a las cabezas** (no justo bajo el punto doloroso) para abrir el espacio, modificación de actividad/descarga. Derivar si persiste >6 semanas; escalón siguiente: corticoide, luego excisión quirúrgica.
- **Metatarsalgia (general):** descarga del antepié (plantilla/almohadilla), calzado, control de carga; descartar fractura por estrés metatarsiana (bandera roja) y artropatía inflamatoria.

---

### 5. Hallux valgus y hallux rigidus (breve, conservador)

#### 5.1 Hallux valgus ("juanete")

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Deformidad en valgo del hallux ("juanete"); manejo conservador de 1ª línea en casos leve-moderados.
>
> **⛔ Contraindicaciones / cuándo derivar:** Fracaso de medidas conservadoras adecuadas tras ~3 meses con dolor/discapacidad persistente (umbral NICE) → cirugía (p. ej. osteotomía en chevron), que supera a la ortesis cuando el síntoma principal es dolor al caminar y no garantiza evitar recurrencia.
>
> **⚠️ Precauciones:** La evidencia de la fisioterapia aislada es limitada; el soporte da alivio sintomático solo a corto plazo. Ejercicio combinado con soporte externo (separador interdigital / férula nocturna / taping), pauta ~3×/semana ≥8 semanas; calzado ancho y analgesia.
- **Conservador de 1ª línea:** ortesis/plantillas, **ejercicio** (combinado con **separador interdigital**, férula nocturna o taping; una red de metaanálisis sugiere que ejercicio + soporte externo reduce ángulo/dolor; pauta ~**3×/semana ≥8 semanas** para leve-moderado), analgesia, calzado ancho. El soporte da alivio sintomático a corto plazo; la evidencia de la fisioterapia **aislada** es limitada.
- **Cuándo derivar (umbral NICE):** fracaso de medidas conservadoras adecuadas tras **~3 meses** con dolor/discapacidad persistente. La cirugía (p. ej. osteotomía en chevron) supera a la ortesis cuando el síntoma principal es **dolor al caminar**; no garantiza evitar recurrencia.

#### 5.2 Hallux rigidus (artrosis de la 1ª metatarsofalángica)

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Artrosis de la 1ª articulación metatarsofalángica; manejo conservador (evidencia débil-moderada).
>
> **⛔ Contraindicaciones / cuándo derivar:** Dolor/limitación persistente → queilectomía (enfermedad moderada) o artrodesis (avanzada), con evidencia moderada.
>
> **⚠️ Precauciones:** Calzado de suela rígida/rocker (balancín que limita la dorsiflexión del hallux), modificación de actividad, movilidad articular tolerada / terapia manual (evidencia débil) y control del dolor. AINEs con evidencia insuficiente.
- **Conservador (evidencia débil-moderada):** moderada para **ortesis/calzado a medida** (suela rígida/balancín que limita la dorsiflexión del hallux) e infiltración de ácido hialurónico; **movilidad/terapia manual** con evidencia débil; AINEs insuficiente.
- **Qué SÍ:** calzado de suela rígida/rocker, modificación de actividad, movilidad articular tolerada, control del dolor.
- **Derivación:** dolor/limitación persistente → **queilectomía** (enfermedad moderada) o **artrodesis** (avanzada) con evidencia moderada.

---

### 7. Pruebas / evaluación (resumen con sensibilidad/especificidad donde existe)

| Prueba | Para qué | Técnica (resumen) | Rendimiento diagnóstico |
|---|---|---|---|
| **Windlass test** | Fasciopatía plantar | Dorsiflexión pasiva del hallux (mejor **en carga**, de pie sobre taburete) → dolor en origen de la fascia | **Muy específico, poco sensible**: ~**100% esp / ~32% sens** (en carga 31.8%; De Garceau 2003). **Confirma, NO excluye** (un negativo no descarta por su sensibilidad baja). Fiabilidad intra/inter-examinador alta (ICC ~96-99%). Variante "Windlass Shield" 2026 más sensible pero preliminar (n=45) |
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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Lesión muscular de isquiotibiales (hamstring strain) de manejo conservador; clasificación por BAMIC (RMN). Rehabilitación por criterios con excéntricos tempranos guiados por dolor + agilidad/estabilización de tronco (CPG JOSPT 2022, L-protocol de Askling, vía Aspetar).
>
> **⛔ Contraindicaciones / cuándo derivar:** Dolor proximal muy cercano a la tuberosidad isquiática + equimosis extensa / "gap" palpable / debilidad marcada → sospechar avulsión proximal / rotura de tendón libre (puede ser quirúrgica) → derivar. Dolor que no cede, parestesias/ciática o dolor nocturno óseo → descartar referido lumbar o patología ósea.
>
> **⚠️ Precauciones:** Fase aguda: evitar estiramiento agresivo, carrera, contracción máxima dolorosa y excéntrico en rango largo doloroso. Dosis que no deje dolor residual >2/10 al día siguiente; progresar por criterios. Afectación intratendinosa ("c") con más cautela, pero NO como timeline fijo. No competir hasta superar el H-test y pruebas de campo; antecedente de lesión previa sube el riesgo de re-lesión.

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

> **📋 Encuadre**
>
> **🎯 Indicaciones:** Dolor inguinal del deportista relacionado con aductores (y demás entidades de Doha: iliopsoas, inguinal, púbica); manejo conservador. Aguda de aductor por protocolo criteria-based de Aspetar/Serner; larga evolución (LSAGP) con el programa activo de Hölmich (± Copenhagen).
>
> **⛔ Contraindicaciones / cuándo derivar:** Hernia inguinal palpable, masa, o dolor que aumenta con Valsalva/tos → valoración quirúrgica. Dolor de cadera con bloqueo/chasquido o pérdida de rango → cadera-relacionado (FAI/labrum), imagen de cadera. Dolor óseo nocturno/en reposo, fiebre, pérdida de peso, o dolor púbico desproporcionado en adolescente → descartar fractura por estrés/avulsión apofisaria, infección, tumor.
>
> **⚠️ Precauciones:** Fase aguda: evitar estiramiento provocador del aductor, aducción resistida máxima dolorosa, carrera y Copenhagen de palanca larga. Progresar por criterios "clínicamente pain-free" antes del entrenamiento específico (Serner 2020). En crónicos (LSAGP) el retorno es LENTO (mediana ~18.5 semanas) aun con ejercicio — esperable, no necesariamente falla del tratamiento.

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
