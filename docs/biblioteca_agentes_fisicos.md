# 💠 AGENTES FÍSICOS — indicaciones, contraindicaciones y equipos de la clínica

## 💠 Cómo usar esta biblioteca + inventario de equipos

Referencia de los **agentes físicos** de la clínica: para qué sirve cada uno, **cuándo SÍ** (indicaciones), **cuándo NO** (contraindicaciones), precauciones, dosificación orientativa y **con qué equipo real** se aplica. Los números finos de dosimetría van marcados `[verificar]` (confírmalos contra la ficha técnica del equipo y la fuente antes de fijarlos como estándar; el autor clínico afina).

**Dos reglas de oro que aplican a TODOS:**
- 💪 **La CARGA (ejercicio terapéutico) es el motor del tratamiento; los agentes físicos son COADYUVANTES.** Acompañan, no sustituyen la rehabilitación activa.
- 🛡️ **Antes de cualquier agente, revisa `seguridadClinica` / la alerta de seguridad del expediente** (metal/osteosíntesis, marcapaso/DAI, embarazo, cáncer, trombosis/TVP, anticoagulación). Ver la sección de **Seguridad transversal** abajo.

**Cómo elegir rápido por fase:**
- **Agudo / irritable / con edema:** atérmico → frío (crioterapia), ultrasonido **pulsado**, tecar **atérmico**, láser, Corriente Aura (edema), presoterapia/DLM.
- **Subagudo / crónico / rigidez:** térmico → calor (termoterapia), ultrasonido **continuo**, tecar **térmico**, láser, terapia manual.
- **Tendinopatía crónica / refractaria que no cede:** **ondas de choque** (radial) y/o **MEP/electrólisis percutánea** — SIEMPRE con progresión de carga (HSR) y consentimiento.
- **Inhibición/atrofia muscular (p. ej. cuádriceps post-LCA/prótesis):** **NMES/Russian/FES** (EEM) superpuesta al ejercicio.

**Inventario de equipos (MSK):**

| Agente | Equipo / marca real | Para qué (MSK) |
|---|---|---|
| Tecarterapia / Diatermia RF | **Tecar RET/CET** (capacitiva C + resistiva R) | Analgesia, flujo, preparar tejido; C superficial, R profundo |
| Ultrasonido terapéutico | US fisio **1 y 3 MHz** (tipo Sonopulse) | Tendón/cicatriz/contractura; pulsado agudo, continuo crónico |
| Ondas de choque | **VILNASON V100** (radial) | Tendinopatía crónica/calcificante refractaria |
| Láser / fotobiomodulación | **LaserPulse** + **Antares** (Ibramed) + **ILIB** | 808/904 nm MSK profundo; 660 cicatriz; ILIB sistémico |
| Electroterapia | **Neurodyn Portable** (TENS/FES/Russian/Aussie/interferencial) | TENS analgesia; Russian/FES = EEM del músculo |
| MEP / Electrólisis percutánea + punción seca | **Microduo FREE** (fisiomove) modo Sport | Tendinopatía degenerativa; puntos gatillo (con consentimiento) |
| Corriente Aura | "Masaje Aura" del **Neurodyn Esthetic** | Edema/equimosis/drenaje + analgesia en agudo/post-qx |
| Coadyuvantes | Termoterapia, Crioterapia, Presoterapia, Drenaje linfático, Vendaje NM, Tracciones, Terapia manual/Masoterapia/Lib. miofascial | Analgesia, edema, movilidad, soporte |

*Equipos **estéticos** (NO rehab MSK, no van aquí): PLASMED (pluma de plasma), Neurodyn Esthetic (tonificación), ultrasónico facial XHUODADA. Los agentes de **dermatofuncional** (Ozono, Carboxiterapia, RF estética, etc.) viven en la biblioteca **Dermatofuncional**.*

## 🛡️ Seguridad transversal (contraindicaciones comunes a todos los agentes)

Vale para TODO agente físico y para cualquier paciente con flags de `seguridadClinica`. **Ligar siempre con `_soapSeguridadHTML` / `seguridadClinica` de la app** (la alerta de metal/marcapaso/etc. ya salta en el expediente).

- **Metal / osteosíntesis / prótesis / tornillos / placas / anclas:** **NO** radiofrecuencia, diatermia, **tecarterapia térmica** ni **ultrasonido térmico** sobre el material. Usar agentes **atérmicos** y **lejos** del implante. *(El **láser de baja potencia NO** se contraindica sobre el metal — no lo calienta: es buena opción cuando el metal bloquea tecar/US. La electroestimulación de superficie TENS/NMES **no** es diatermia térmica y sí se usa; basta no poner el electrodo justo sobre el material.)*
- **Marcapaso / DAI / neuroestimulador / bomba implantable:** NO diatermia/onda corta/RF/tecar ni electroterapia cerca del dispositivo; precaución con US (crítico en tórax/cuello/columna cervical-dorsal).
- **Embarazo:** no aplicar sobre abdomen, pelvis ni zona lumbosacra (tecar, US, ondas de choque, electroterapia, láser, MEP).
- **Cáncer / zona tumoral activa:** no irradiar/calentar/vibrar sobre la neoplasia o sus ganglios sin aval oncológico.
- **Trombosis / TVP (o sospecha):** NO agentes, masaje, presoterapia ni DLM sobre la zona (riesgo de embolia). Pantorrilla dolorosa + edema + calor → descartar TVP.
- **Anticoagulación / coagulopatía:** precaución (riesgo de hematoma) con técnicas agresivas, ondas de choque, MEP y masaje.
- **Esqueleto inmaduro / placas de crecimiento (fisis) abiertas en menores:** no US térmico, diatermia/onda corta ni ondas de choque sobre la fisis.
- **Sensibilidad alterada (neuropatía/anestesia):** riesgo de quemadura con térmicos (el paciente no avisa) → bajar intensidad o evitar.
- **Piel lesionada / herida abierta / infección local:** no aplicar sobre la zona.
- **Columna cervical (terapia manual/tracción):** cribar mielopatía (Hoffmann/Babinski, marcha) y banderas vasculares de disección ANTES de manipular/traccionar.


## 🔥 Tecarterapia / Diatermia (RF) — Tecar RET/CET (capacitiva + resistiva)

**Qué es / mecanismo:** Diatermia por radiofrecuencia (≈300 kHz–1.2 MHz, según equipo `[verificar]`) por *transferencia de energía capacitiva y resistiva* (CRET/TECAR). Es **endotermia**: el propio tejido genera el calor por su resistencia al paso de la corriente de alta frecuencia (el paciente cierra el circuito con una placa de retorno). A **baja potencia = modo atérmico** (biostimulación, microcirculación y analgesia sin subir temperatura relevante); a **alta potencia = modo térmico** (hiperemia, vasodilatación, calor profundo). La **intensidad —no solo la frecuencia— decide** si el efecto es atérmico o térmico. El **capacitivo (C)** usa electrodo aislado y concentra la energía en tejidos con más agua/electrolitos (piel, músculo, cuerpo del tendón) → más **superficial**; el **resistivo (R)** usa electrodo sin aislar y deposita en tejidos de mayor resistencia/menos agua (hueso, entesis, ligamento, cápsula) → más **profundo**.

**Indicaciones (cuándo SÍ):** Siempre como **coadyuvante** (analgesia y flujo); la carga/ejercicio es el motor.
- **Tendinopatías:** epicondilalgia lateral (RCT 2025: mejoró la **función**, sin diferencia significativa en dolor; solo 2 RCT, n≈96, evidencia limitada `[verificar]`); manguito rotador (resolución más rápida de inflamación y recuperación de ROM/fuerza en estudio de Ribeiro `[verificar]`); aquíleo crónico (ensayos en curso, sin resultados publicados). **Atérmico** en fase reactiva/irritable; **térmico** en fase crónica/degenerativa.
- **Músculo:** contractura, espasmo, DOMS, **calentamiento y flexibilidad** (p. ej. isquiotibiales, RCT) antes del ejercicio o la terapia manual.
- **Dolor lumbar inespecífico crónico:** TECAR + terapia manual > terapia manual sola en ≥1 ensayo (revisión sistemática 2024); radiculopatía lumbar y hernia discal en ensayos en curso.
- **Dolor de ingle/aductores en deportistas:** RCT con sham reportó beneficio en dolor, ROM y fuerza `[verificar]`.
- **Articular:** capsulitis adhesiva / hombro congelado (ensayos en curso), recuperación de ROM.
- **Túnel carpiano leve-moderado:** RCT 2023, opción no invasiva efectiva `[verificar]`.
- **Post-quirúrgico en fase subaguda:** manejo de edema, dolor y preparación de tejido — **lejos del material de osteosíntesis** (ver contraindicaciones).
- **Analgesia** y dolor miofascial como coadyuvante.
- *Nota de evidencia (2021–2026):* ensayos pequeños, heterogeneidad alta (I² ≈92–97% en meta-análisis 2023 `[verificar]`) y **sin protocolo estandarizado** → usar como coadyuvante, no como tratamiento único.

**Contraindicaciones (cuándo NO):**
- *ABSOLUTAS:*
  - **Marcapaso, desfibrilador (DAI), neuroestimulador, implante coclear, bomba de insulina** u otro dispositivo electrónico implantado (la RF interfiere); además, nunca exponer el aplicador directamente sobre el dispositivo.
  - **Modo térmico / RF sobre o cerca de implante metálico, osteosíntesis, prótesis, placa, clavo o tornillo** (sobrecalentamiento del metal → quemadura profunda). Regla de la clínica: **no sobre el material**.
  - **Embarazo** sobre o cerca de la zona (abdomen, pelvis, lumbosacra).
  - **Cáncer activo / zona tumoral / neoplasia** en el campo de tratamiento (el calor puede favorecerlo; precaución oncológica).
  - **Trombosis venosa profunda (TVP) / tromboflebitis / trombo** (riesgo de embolia por la vasodilatación).
  - **Sangrado activo, hemorragia o hematoma en evolución**, traumatismo reciente con sangrado.
  - **Sobre gónadas** (testículos/ovarios) con modo térmico.
  - **Epífisis/cartílagos de crecimiento abiertos en menores** con modo térmico.
  - **Fiebre o infección aguda** (sistémica, o local activa en la zona).
  - **Pérdida grave de sensibilidad** térmica/dolorosa en la zona (no puede avisar la quemadura) → tratar como contraindicación del modo térmico.
  - **Sobre los ojos.**
- *RELATIVAS (valorar riesgo/beneficio, preferir atérmico):*
  - anticoagulación o trastorno de la coagulación (riesgo de hematoma con la hiperemia)
  - diabetes con neuropatía o vasculopatía
  - insuficiencia cardiaca/circulatoria grave
  - epilepsia (precaución en cabeza/cuello)
  - piel dañada, dermatitis o cicatriz reciente
  - alteración leve-moderada de la sensibilidad
  - menstruación sobre pelvis
  - zonas con escaso tejido o prominencias óseas

**Precauciones:** **Sensibilidad alterada = riesgo de quemadura** → el paciente debe sentir **calor agradable, NUNCA doloroso**, con comunicación constante; ante la duda, atérmico. No aplicar sobre **piel lesionada / herida / dermatitis**. En **zonas con poco tejido o prominencias óseas** el calor se concentra → bajar potencia. **Mantener el aplicador en movimiento** y usar suficiente **crema/medio de acoplamiento**. Vigilar la **placa de retorno (neutra)** por calentamiento y buen contacto. **Retirar joyas, piercings y metales** del campo. Cuidar la **hidratación** del paciente (la conductividad del tejido depende del agua). **No sobre los ojos**; precaución en cuello anterior (seno carotídeo/tiroides).

**Dosificación / parámetros:** Frecuencia típica 300 kHz–1.2 MHz según equipo `[verificar]`. **Atérmico** (baja potencia, p. ej. <50 % de intensidad `[verificar]`) en fase **aguda/inflamatoria** → biostimulación, microcirculación y analgesia sin calor relevante. **Térmico** (potencia alta) en fase **crónica/degenerativa** → hiperemia y calor profundo, siempre **confortable, nunca quemante**. Recordar: la **intensidad** (no solo la frecuencia) define atérmico vs térmico. Tiempo orientativo **10–30 min por región** `[verificar]`; ejemplo de calentamiento reportado: 500 kHz, 5 min CAP (ciclo 50 %) + 10 min RES (ciclo 100 %) `[verificar]`. Frecuencia-profundidad (estudio in vitro de fabricante): 500 kHz actúa más en superficie y 300 kHz más en profundidad (~3–6 cm) `[verificar]`. **Secuencia: C primero** (preparar/superficial/flujo) **→ R después** (profundo/foco) en la misma sesión. Nº de sesiones variable (series a lo largo de semanas) `[verificar]`; **no hay protocolo universal validado** → ajustar a tejido, fase y respuesta.

**En la clínica (Tecar RET/CET):**
- **C (CET, capacitiva — electrodo aislado):** superficial / músculo / **cuerpo del tendón** → **PREPARAR** el tejido, mover flujo y calentar antes del ejercicio o la terapia manual; fase aguda en atérmico.
- **R (RET, resistiva — electrodo sin aislar):** profundo / **entesis / ligamento / hueso / cápsula** → **FOCO** sobre la inserción o la estructura profunda; fase crónica en térmico leve-moderado.
- **C → R en la misma sesión:** primero capacitiva para preparar y dar flujo, luego resistiva para el foco profundo.
- **Atérmico en agudo** (analgesia/biostimulación), **térmico en crónico** (hiperemia) — siempre calor confortable.
- 🛑 **REGLA DE ORO (liga con `seguridadClinica`): NUNCA modo térmico / RF sobre metal, marcapaso, DAI/desfibrilador, neuroestimulador, osteosíntesis, prótesis, placa, clavo o tornillo.** Antes de aplicar, revisar el expediente: si `seguridadClinica` marca marcapaso/DAI/implante/osteosíntesis/prótesis/placa/clavo/tornillo/embarazo/cáncer/TVP/anticoagulación, **la alerta de seguridad salta → respetarla**; con metal, trabajar atérmico lejos del material o elegir otro agente.
- **Coadyuvante:** acompaña, **no sustituye la carga** (el ejercicio terapéutico es el motor).


## 〰️ Ultrasonido terapéutico (1 / 3 MHz)
**Qué es / mecanismo:** Ondas acústicas de alta frecuencia (0.75–3 MHz) generadas por un cristal piezoeléctrico que vibra; la energía mecánica entra al tejido a través de un medio de acoplamiento (gel). Dos familias de efectos según el modo de emisión:
- **Continuo (térmico):** emisión constante → calor profundo → ↑ extensibilidad del colágeno, ↑ flujo sanguíneo local, ↓ rigidez articular, ↑ metabolismo, analgesia. Se usa cuando quieres CALENTAR (crónico, contractura, cicatriz/fibrosis).
- **Pulsado (atérmico / mecánico):** emisión intermitente (duty cycle 20–50% `[verificar]`) → minimiza el calor y conserva los efectos mecánicos (micromasaje, cavitación estable, microcorrientes). Se usa cuando NO quieres calentar (agudo, edema, tejido irritable).
- **Frecuencia = profundidad:** **1 MHz → profundo (~3–5 cm)** (cadera, lumbar, músculos gruesos, tendones profundos); **3 MHz → superficial (~1–2 cm)** (epicóndilo, Aquiles, fascia plantar, cicatriz). A igual intensidad, **3 MHz se absorbe antes y calienta más rápido y más superficial** que 1 MHz (~3× `[verificar]`).

**Indicaciones (cuándo SÍ):** Tendinopatías, contracturas/acortamiento con rigidez, cicatriz/fibrosis/adherencias (ablandar con térmico), dolor miofascial/puntos gatillo, fase SUBAGUDA de lesiones de tejido blando; **fonoforesis** (vehiculizar un fármaco tópico —AINE, etc.— con el US; el pulsado concentra mejor la dosis en el sitio y da mejor entrega tisular). Regla de modo: **pulsado** en agudo/edema/tejido irritable; **continuo** en crónico/rigidez/cuando necesitas calor.
- **Nota honesta de evidencia:** la evidencia MSK es **heterogénea y de calidad baja-moderada**. Revisiones 2024 muestran reducción de dolor en algunos cuadros (fascitis plantar, dolor MSK general) pero con alta heterogeneidad (I²~74% `[verificar]`) y dosificación inconsistente entre estudios; en tendinopatía, **las ondas de choque superan al US en dolor**. Trátalo como **COADYUVANTE del ejercicio/carga** (el motor del tratamiento), NUNCA como tratamiento principal ni sustituto del rehab activo. Reevalúa a las ~6 sesiones: si no mueve la aguja, suspéndelo.

**Contraindicaciones (cuándo NO):**
- Sobre **útero gestante** / abdomen-pelvis-zona lumbar en el **embarazo**.
- Sobre **gónadas** (testículos/ovarios).
- Sobre los **ojos** (cavitación en el humor vítreo).
- Sobre **marcapaso / desfibrilador (DAI) / neuroestimulador / bomba implantable**, sobre el corazón o zona torácica-cuello con dispositivo; también **seno carotídeo / ganglio estrellado**.
- Sobre **tejido tumoral / zona de cáncer** activo o sospechoso (riesgo de diseminación).
- Sobre **trombosis / TVP / tromboflebitis** (riesgo de desprender émbolo).
- Sobre **sangrado activo / hemorragia / hematoma agudo** (incluye anticoagulación mal controlada sobre la zona).
- Sobre **infección activa / absceso / sepsis** (riesgo de diseminar).
- Sobre **epífisis de crecimiento (fisis) abiertas** en niños y adolescentes.
- Sobre **médula expuesta / laminectomía** (zona sin cobertura ósea sobre la médula).
- Sobre **cemento de prótesis / polietileno** en modo **térmico/continuo** (el cemento acrílico y el plástico retienen calor → daño de la interfase).
- Sobre **isquemia / insuficiencia vascular severa** de la zona.

**Precauciones:**
- **Sensibilidad alterada** (neuropatía, zona anestesiada): el paciente no avisa el sobrecalentamiento → riesgo de quemadura; baja la intensidad y vigila.
- **Metal / osteosíntesis / implantes:** contraindicación **DEBATIDA** en la literatura — el metal **refleja ~90%** del US y no se calienta como se temía, por lo que la evidencia NO lo considera contraindicación absoluta; **la regla conservadora de la clínica se mantiene por seguridad:** preferir **pulsado / baja intensidad**, **nunca térmico de alta intensidad** sobre el implante y **nunca sobre cemento de prótesis**. Documentar la decisión.
- **Cabezal SIEMPRE en movimiento** (lento, circular o longitudinal) para evitar ondas estacionarias, puntos calientes y dolor perióstico.
- Sobre **prominencias óseas superficiales** → dolor perióstico: baja la intensidad o pasa a 3 MHz pulsado.
- **Fase aguda/inflamatoria** → pulsado y baja intensidad.
- Implantes mamarios y zonas con reemplazo articular (ver contraindicaciones).

**Dosificación / parámetros:**
- **Frecuencia por profundidad:** 1 MHz (profundo ~3–5 cm) · 3 MHz (superficial ~1–2 cm).
- **Modo:** continuo (duty 100%) = térmico; pulsado **20%** (agudo/irritable) a **50%** (subagudo) = atérmico `[verificar]`.
- **Intensidad (W/cm², promedio espacial):** rango terapéutico ~**0.1–2.0 W/cm²**; atérmico/subtérmico **≤0.5 W/cm²**; térmico ~**1.0–1.5 W/cm²** `[verificar]`.
- **Relación intensidad↔tiempo:** a más intensidad, menos tiempo (y al revés).
- **Área y tiempo:** tratar un área ≈ **2× el ERA** (área radiante efectiva del cabezal), no más de 4×; ~**1–2 min por área de cabezal**, total **5–10 min** por sesión (no hay tiempo estándar; la evidencia es inconsistente) `[verificar]`.
- **Acoplamiento:** gel; o inmersión en agua para zonas irregulares (mano/pie/muñeca).

**En la clínica:** Tenemos **US terapéutico 1 y 3 MHz (tipo Sonopulse)**. Usa **3 MHz** para tendón/estructura superficial (epicóndilo, Aquiles insercional, fascia plantar, cicatriz) y **1 MHz** para tejido profundo (cadera, lumbar, isquios, músculos gruesos). **Pulsado** en agudo / con edema / irritable; **continuo** en crónico / rigidez / cicatriz-fibrosis (cuando quieres calor). Es **coadyuvante** del ejercicio, no lo reemplaza. **Liga con `seguridadClinica`:** la alerta roja del expediente ya salta con **marcapaso/desfibrilador/DAI, cáncer/oncológico, anticoagulación, embarazo, metal/osteosíntesis/prótesis, trombosis/TVP** → revísala antes de aplicar US: con **metal/prótesis** usa pulsado/baja intensidad y evita el térmico sobre el material (nunca sobre cemento); con **marcapaso/DAI, embarazo, cáncer o TVP en la zona, NO apliques**. **OJO — equipo distinto:** el **ultrasónico ESTÉTICO facial XHUODADA** de la clínica NO es este US de rehab MSK (es estético); no se dosifica ni se usa con estos protocolos.


## 💥 Ondas de choque (ESWT radial) — VILNASON V100

**Qué es / mecanismo:** Ondas acústicas (mecánicas) de alta energía aplicadas sobre el tejido. Hay dos familias y NO son intercambiables: **radial (rESWT / "balística")** — un proyectil golpea un transmisor y genera una onda de **presión** que es **máxima en la superficie** y se disipa con la profundidad → tratamiento **superficial y disperso**, se dosifica en **bar**; y **focal (fESWT)** — onda que **converge en un foco profundo y puntual** (generación electrohidráulica/electromagnética/piezoeléctrica), se dosifica en **densidad de flujo de energía mJ/mm²** y alcanza estructuras profundas (hueso, entesis profunda). **El VILNASON V100 es RADIAL.** Efectos biológicos propuestos: **mecanotransducción** (estímulo mecánico → respuesta celular reparadora), **neovascularización/angiogénesis**, **analgesia** (hiperestimulación y modulación del dolor), estímulo de remodelación del tendón y, en el hombro, favorecer la **reabsorción del depósito calcificante** `[verificar mecanismos de reabsorción]`.

**Indicaciones (cuándo SÍ):** Como **coadyuvante en tendinopatías CRÓNICAS / refractarias / calcificantes que NO ceden** al ejercicio y la carga bien dosificada (típicamente >3 meses de síntomas) `[verificar ventana]`:
- **Fascitis/fasciopatía plantar crónica** — es la indicación con más soporte en ensayos de rESWT `[verificar]`.
- **Tendinopatía aquílea** (porción media e insercional) `[verificar sub-análisis insercional]`.
- **Tendinopatía rotuliana** ("rodilla del saltador") refractaria.
- **Epicondilalgia lateral y medial** ("codo de tenista/golfista") crónica.
- **Tendinopatía calcificante del hombro / manguito rotador**: la rESWT es eficaz tanto en la calcificante como en la no calcificante; para depósitos **profundos/densos** la **focal** suele preferirse, y en manguito **no** calcificante un RCT mostró la focal con mejor dolor a 24–48 sem (ambas efectivas) `[verificar magnitudes]`.
- **Síndrome doloroso del trocánter mayor** (tendinopatía glútea) `[verificar]`.
- **Pseudoartrosis / retardo de consolidación ósea** → se trata con **ESWT FOCAL de alta energía**, NO con la radial del V100; derivar o usar equipo focal `[verificar]`.
- **NUNCA en lesión aguda ni en desgarro/ruptura aguda** del tendón o músculo: la ESWT es herramienta del cuadro **crónico**, no del agudo.

**Contraindicaciones (cuándo NO):**
- **Embarazo** con el **feto/útero en el campo** de tratamiento (contraindicación absoluta ISMST) `[verificar]`.
- **Tumor maligno / zona de cáncer** en el campo de tratamiento (absoluta) `[verificar]`.
- **Coagulopatía o tratamiento anticoagulante** (riesgo de hematoma/sangrado); valorar estado de coagulación antes `[verificar manejo según fármaco/INR]`.
- **Trombosis / TVP** en la zona a tratar.
- **Infección local activa / osteomielitis** en la zona.
- **Fisis (cartílago/placa de crecimiento) abierta** en niños y adolescentes: evitar tratar sobre la fisis, en especial con energías altas (relativa–absoluta según energía) `[verificar]`.
- **Marcapaso / desfibrilador** cuando quedan en el campo de tratamiento (según zona) `[verificar]`.
- **Sobre grandes vasos, troncos nerviosos, pulmón, cabeza/cerebro y médula espinal.**
- **Focal de alta energía:** además, **NO sobre tejido lleno de aire** (pulmón, intestino) `[verificar]`.
- Relativas: corticoide infiltrado reciente en la zona (esperar un intervalo), polineuropatía/alteración sensitiva marcada, prótesis/material de osteosíntesis bajo el haz (evaluar) `[verificar]`.

**Precauciones:** Obtener **consentimiento informado** (procedimiento que puede doler). Es **molesto durante** la aplicación y puede dejar **dolor post-tratamiento transitorio, enrojecimiento, petequias/equimosis e hinchazón** leves; avisar al paciente. Ajustar la intensidad a la **tolerancia** del paciente. **Progresión de carga antes y después**: la ESWT **NO sustituye al ejercicio terapéutico ni a la carga** — es **coadyuvante** del tendón crónico; el motor del tratamiento sigue siendo la **carga progresiva (ejercicio)**. Respetar la hoja de seguridad de agentes físicos (metal/marcapaso/embarazo/cáncer).

**Dosificación / parámetros (RADIAL — todo `[verificar]`):**
- **Presión:** ~**1.5–3 bar**, a la máxima tolerable por el paciente `[verificar]`.
- **Impactos:** ~**2000–4000** por sesión `[verificar]`.
- **Frecuencia:** ~**8–15 Hz** (habitual **10 Hz**) `[verificar]`.
- **Sesiones:** **3–6**, **1 por semana** (intervalo semanal) `[verificar]`.
- Puede ayudar **escalar la intensidad** entre sesiones (dose escalation) en vez de mantenerla fija `[verificar]`.
- Ejemplo publicado en **hombro calcificante** con protocolo radial individualizado: ~**1.7 bar, 5 Hz, ~2175 impactos, ~7 sesiones** `[verificar]`.
- **Confirmar siempre los ajustes exactos (bar, impactos, Hz) y el cabezal/transmisor en el manual del VILNASON V100** antes de tratar — los parámetros dependen del equipo y del aplicador.

**En la clínica (VILNASON V100):** Equipo **radial (rESWT)**, con varios cabezales/transmisores. Reservarlo para **tendinopatía crónica refractaria o calcificante que no cede** (fascitis plantar, aquílea, rotuliana, epicondilalgia, calcificante de hombro, trocantéricas), **siempre con consentimiento** y como **coadyuvante**, **combinado con carga pesada lenta (HSR)** y progresión de ejercicio. **Nunca en fase aguda / desgarro agudo.** Para depósitos muy profundos o **pseudoartrosis** haría falta equipo **focal** (el V100 no lo cubre).


## 🔦 Láser / fotobiomodulación (LLLT) — LaserPulse · Antares · ILIB

**Qué es / mecanismo:** Luz (láser o LED) de baja potencia que no calienta: el cromóforo es la **citocromo c oxidasa** de la mitocondria, que al absorber la luz aumenta la producción de **ATP**, modula especies reactivas de oxígeno y señalización celular → efecto **antiinflamatorio, analgésico y pro-reparación** (angiogénesis, síntesis de colágeno, regeneración tendinosa). Es **fotobiomodulación (PBM)**, no efecto térmico. **La longitud de onda define la profundidad:** infrarrojo >760 nm (808/904 nm) = tejido PROFUNDO (tendón, ligamento, entesis, hueso); rojo 610-760 nm (660 nm) = superficial (piel, cicatriz); azul/verde = muy superficial (piel/estética). La respuesta es **bifásica (ventana Arndt-Schultz): dosis baja estimula, dosis alta inhibe** — un metaanálisis preclínico 2026 confirmó que el sobredosaje (~17.5 J/cm²) anuló el beneficio en tendón.

**Indicaciones (cuándo SÍ):** Coadyuvante analgésico/antiinflamatorio y de reparación en: **tendinopatías** (rotuliana, aquílea, manguito, epicondilalgia lateral/medial), **dolor musculoesquelético agudo y crónico**, **puntos gatillo miofasciales**, **síndrome del túnel del carpo**, **neuropatías periféricas** y dolor posoperatorio. **808 / 904 nm (IR) → MSK profundo**; **904 nm además favorece reparación ósea** (fractura, retardo de consolidación, reinserción tendón-hueso). **660 nm (rojo) → cicatriz/herida de piel** (superficial, no MSK profundo). **ILIB (láser sistémico, pulsera) → analgesia/antiinflamación/circulación global** (dolor difuso, fatiga, inflamación sistémica). Evidencia: en tendinopatía y dolor MSK los resultados son favorables **cuando se dosifica adecuadamente** (los ensayos negativos suelen estar **subdosificados**); en túnel del carpo un metaanálisis 2024 (13 ECA) mostró mejora de **funcionalidad** (dolor y fuerza de prensión no alcanzaron significancia). **Regla de oro de la clínica:** el motor del tratamiento es la **CARGA (ejercicio terapéutico)**; el láser es **COADYUVANTE**, no sustituye la progresión de carga.

**Contraindicaciones (cuándo NO):**
- **OJOS / retina — NUNCA apuntar al ojo ni a su cercanía; gafas de protección OBLIGATORIAS para el paciente Y el terapeuta (y cualquiera en la sala).** El IR es invisible y puede dañar la retina de forma irreversible. Es la contraindicación #1.
- **Zona tumoral / cáncer activo:** no irradiar sobre neoplasia conocida o sospechada ni sus metástasis/ganglios (la PBM estimula actividad celular). (Excepción de uso oncológico supervisado: mucositis por quimio/radio — fuera del alcance MSK de la clínica.)
- **Embarazo: no irradiar sobre abdomen ni pelvis/zona lumbosacra.**
- **Sobre la glándula tiroides** (cuello anterior).
- **Hemorragia activa / hematoma en expansión.**
- **Fotosensibilidad o fármacos fotosensibilizantes** (p. ej. isotretinoína, ciertos antibióticos/retinoides, hipérico) → riesgo de reacción cutánea.
- **Epífisis/placas de crecimiento abiertas en menores** (RELATIVA — valorar dosis baja y zona).
- **Sobre marcapasos / dispositivo implantado** (RELATIVA — evitar irradiar directo sobre el generador).

**Precauciones:** **Protección ocular siempre** (paciente + terapeuta); no mirar el haz ni reflejos en superficies brillantes. **Tatuajes y piel oscura / fototipos altos** absorben más luz → mayor calentamiento local y menor penetración: bajar dosis y vigilar. **La dosis importa en los dos sentidos:** insuficiente = inútil (causa frecuente de "no funcionó"), excesiva = inhibe el efecto (ventana bifásica). Revisar piel antes (heridas abiertas, infección activa). Mantener el cabezal en **contacto perpendicular** y limpio. **A diferencia de tecarterapia / radiofrecuencia / ultrasonido térmico, el láser de baja potencia NO está contraindicado sobre material de osteosíntesis / implantes metálicos** (no genera calentamiento profundo del metal) → útil cuando el metal bloquea otros agentes.

**Dosificación / parámetros:** Energía por punto **E(J) = Potencia(W) × tiempo(s)**; aplicación por puntos en contacto, perpendicular. Marcos de referencia (consenso **WALT**, confirmar contra el equipo):
- **808 nm (banda 780-860 nm):** p. ej. supraespinoso / Aquiles / fascia plantar **≈8 J/punto** `[verificar]`; epicondilalgia lateral **≈4 J/punto** `[verificar]`; tope de densidad de potencia **≤100 mW/cm²** en algunos sitios tendinosos `[verificar]`.
- **904 nm:** dosis por punto MÁS BAJAS, **≈1-3 J/punto** `[verificar]` (en rodilla/OA WALT recomienda **≥1 J/punto** a 904 nm) `[verificar]`.
- **Rango clínico típico interno:** **2-4 J/punto**, **20-150 s/punto** `[verificar]`.
- **Frecuencia:** **2-3×/semana** (no diario en crónicos) `[verificar]`.
- **Táctica WALT:** empezar con la dosis de la tabla y **reducir ~30% una vez controlada la inflamación** `[verificar]`.
- Potencia del cabezal (mW) según cada probe del equipo → `[verificar]` en la ficha técnica de LaserPulse/Antares.

**En la clínica (LaserPulse / Antares / ILIB):** Ambos equipos Ibramed comparten la misma familia de probes.
- **Probe 4 — Láser 808 nm IR** y **Probe 5 — Láser 904 nm IR → MSK PROFUNDO:** tendón, ligamento, entesis, dolor crónico, epicondilalgia, puntos gatillo, túnel del carpo. **904 nm además para reparación ósea** (fractura, retardo de consolidación, reinserción tendón-hueso HSR).
- **Probe 3 — 660 nm rojo → cicatriz/herida de piel** (superficial): posquirúrgico cutáneo, laserpuntura. No es para tejido MSK profundo.
- **LEDs (RGB / 410 azul / 590) y clusters → piel/estética** (no MSK).
- **ILIB (pulsera, láser sistémico transcutáneo/intravascular) → analgesia, antiinflamación y circulación global** (dolor difuso, inflamación sistémica).
- **Gafas de protección SIEMPRE** (paciente + terapeuta). El láser es **coadyuvante** del ejercicio terapéutico, que es el motor del tratamiento.


## ⚡ Electroterapia — Neurodyn (TENS · NMES/Russian · interferencial · FES)

> **Regla de oro:** la **carga (ejercicio terapéutico) es el motor**; la electroterapia es **coadyuvante** (analgesia de corto plazo o activación muscular), nunca el tratamiento principal ni sustituto del rehab activo. Las guías de dolor lumbar común (NICE NG59, WHO 2023) incluso recomiendan **NO** ofrecer TENS/interferencial como tratamiento del dolor — su lugar es puntual y para objetivos concretos.

**Qué es / mecanismo:**
Corrientes eléctricas de superficie con fines distintos según los parámetros:
- **TENS (analgesia):** no produce fuerza, modula el dolor. **Convencional/alta frecuencia** → *gate control* (teoría de la compuerta): estimula fibras Aβ que "cierran la puerta" al dolor en el asta posterior; efecto rápido, dura mientras se aplica. **Tipo acupuntura/baja frecuencia** → libera **opioides endógenos (endorfinas/encefalinas)**; inicio lento pero analgesia más duradera.
- **NMES / Russian / Aussie (EEM = electroestimulación muscular):** despolariza el nervio motor y genera **contracción muscular evocada** → recluta unidades motoras (incluidas las de umbral alto) para **ganar/mantener fuerza y vencer la inhibición**. La "Russian" y la "Aussie" son corrientes de **media frecuencia** moduladas en ráfagas (más cómodas para contracción intensa).
- **FES (estimulación eléctrica funcional):** NMES sincronizada con una tarea/movimiento funcional para **reeducar** el gesto (marcha, control).
- **Interferencial (IFC):** dos corrientes de media frecuencia que se cruzan y producen una frecuencia de batido en profundidad; se tolera mejor que el TENS para tejido profundo; uso analgésico.

**Indicaciones (cuándo SÍ):**
- **TENS:** dolor **agudo o crónico** musculoesquelético como coadyuvante de analgesia (no cura, acompaña). Evidencia de **buena calidad** para su efecto **desinhibitorio inmediato** sobre la inhibición artrogénica del cuádriceps (una aplicación mejora la activación) y beneficio **de corto plazo** sumado al ejercicio; evidencia limitada a largo plazo (revisión sistemática de AMI del cuádriceps) `[verificar cita y cifras]`.
- **NMES / Russian / Aussie:** **activación y fuerza** del cuádriceps; **inhibición muscular artrogénica (AMI) post-quirúrgica** → **cuádriceps post-LCA y post-prótesis de rodilla (TKA)**; **prevención de atrofia** durante inmovilización/descarga. La mejor evidencia pide **superponerla a contracción voluntaria/ejercicio** (coadyuvante, no reemplazo): meta-análisis en gonartrosis no mostró superioridad sobre comparadores y una SR/MA 2025 en dolor femoropatelar halla evidencia **muy baja a baja** con beneficio sobre todo en **cursos largos** `[verificar]`. Hay meta-análisis de ECA que la respaldan post-LCA con parámetros heterogéneos `[verificar]`.
- **FES:** **reeducación** de un patrón/gesto funcional.
- **Interferencial:** analgesia de dolor **profundo** cuando el TENS resulta incómodo.

**Contraindicaciones (cuándo NO):**
Absolutas:
- **Marcapaso / DAI / neuroestimulador implantado** (riesgo de interferencia) — no aplicar cerca del dispositivo.
- **Electrodos sobre el tórax/región precordial** (corriente transtorácica que cruce el corazón) y **transcerebral** (electrodos a ambos lados de la cabeza).
- **Seno carotídeo / cara anterior del cuello anterolateral** (riesgo de respuesta vagal/laringoespasmo/hipotensión).
- **Sobre zona tumoral / neoplasia activa**, **sobre trombosis venosa (TVP) / tromboflebitis**.
- **Piel lesionada, herida abierta, dermatitis o infección** bajo el electrodo; **sobre los ojos**.
Relativas / según criterio:
- **Embarazo:** no sobre **abdomen, pelvis ni zona lumbosacra / útero grávido** (el TENS sí se usa en trabajo de parto, pero eso es contexto obstétrico, no MSK).
- **Epilepsia** (precaución; evitar cuello/cabeza y estimulación que pueda desencadenar).
- **Deterioro cognitivo o imposibilidad de dar retroalimentación** del nivel de sensación.
- **Alergia a electrodos/gel.**

**Precauciones:**
- **NO colocar los electrodos directamente sobre metal/osteosíntesis/prótesis con intensidad alta** (aunque, ojo: la electroestimulación de superficie TENS/NMES **NO es diatermia térmica** y **sí puede usarse** cerca de implantes; basta no poner el electrodo justo encima del material).
- **Sensibilidad alterada / anestesia cutánea:** riesgo de sobredosis o irritación por no percibir la intensidad → extremar vigilancia o evitar.
- **Colocación de electrodos:** piel limpia y seca, buen contacto, evitar prominencias óseas/cicatrices; separar los electrodos lo suficiente para no "puentear" la corriente; vigilar eritema/irritación al retirar.
- Subir intensidad **gradualmente** y siempre con el paciente informando sensación.

**Dosificación / parámetros:** `[verificar todos los valores finos]`
- **TENS convencional (analgesia rápida):** frecuencia alta **~80–120 Hz** `[verificar]`, ancho de pulso corto **~50–100 µs** `[verificar]`, intensidad **sensorial fuerte pero cómoda, SIN contracción motora**; aplicación continua **20–60 min** (se puede repetir/prolongar). Efecto durante la aplicación.
- **TENS tipo acupuntura / baja frecuencia (analgesia duradera):** **~2–10 Hz** `[verificar]`, ancho de pulso mayor **~100–250 µs** `[verificar]`, intensidad hasta **contracción motora visible tolerable**; **20–30 min**; inicio lento, efecto más prolongado. (Modo ráfaga/*burst* combina ambos.)
- **NMES / Russian / Aussie para cuádriceps:** parámetros óptimos para **torque minimizando molestia/fatiga**: **frecuencia 30–50 Hz** y **ancho de pulso 400–600 µs** (Glaviano & Saliba 2016; confirmado por revisión 2024) `[verificar]`. "Russian" clásica = portadora **~2500 Hz** modulada en ráfagas de **~50 Hz** `[verificar]`. **Ciclo on:off 1:3 a 1:5** `[verificar]` (p. ej. **10 s on / 30–50 s off** para fuerza), con **rampa de 1–2 s**. **Intensidad: la más alta tolerable que logre una contracción fuerte** (idealmente ≥50% de la CVM — el torque evocado se correlaciona con la ganancia). **~10–15 contracciones/sesión**, **3–5 sesiones/semana** `[verificar]`, **siempre superpuesta a contracción voluntaria/ejercicio**.
- **Interferencial:** portadora de media frecuencia **~2000–4000 Hz** `[verificar]`; frecuencia de batido (AMF) seleccionable: **~80–150 Hz para analgesia**, **~1–10 Hz** para estímulo motor `[verificar]`; **20–30 min** `[verificar]`.

**En la clínica (Neurodyn Portable):**
Equipo real con modos **TENS · FES · Russian · Aussie · interferencial**.
- **TENS** → analgesia coadyuvante (p. ej. dolor rotuliano, lumbar, cervical) como complemento del ejercicio, nunca como tratamiento único.
- **Russian / FES / Aussie** → **EEM del cuádriceps** para vencer la inhibición artrogénica en **post-LCA** y post-prótesis/post-op de rodilla, y para prevenir atrofia — **superpuesta a la contracción voluntaria y al programa de carga**.
- **Seguridad:** **NO colocar electrodos sobre implante/placa/tornillos ni cerca de marcapaso/DAI**; captúralo en `seguridadClinica` para que salte la alerta de `_soapSeguridadHTML`. Recordar: la carga manda; la electroterapia acompaña.

## 💉 MEP / Electrólisis percutánea + Punción seca — Microduo FREE

> **Regla de oro:** técnica **invasiva** y **coadyuvante** — su efecto depende de **acompañarla SIEMPRE de progresión de carga** (excéntrico/HSR); sola no sostiene resultados. **Consentimiento informado obligatorio** y técnica estéril.

**Qué es / mecanismo:**
- **MEP (microelectrólisis percutánea) / EPI (electrólisis percutánea intratisular):** se introduce una **aguja** en el tejido degenerado (guiada por **ecografía** idealmente) y se pasa **corriente galvánica (catódica)** por la punta → genera una **reacción electroquímica/inflamatoria controlada y local** que "reinicia" el proceso reparador en el **tendón degenerado** (de una tendinosis crónica, metabólicamente inerte, hacia una respuesta reparadora) + estimula mecano-/neuromodulación. La **MEP** usa **microcorriente** (intensidades bajas); la EPI clásica usa intensidades mayores.
- **Punción seca:** aguja (sin sustancia) en el **punto gatillo miofascial** → busca la **respuesta de espasmo local (REL)**; reduce la actividad de la placa motora y el dolor referido. **± electro-punción:** se suma microcorriente a la aguja en el punto gatillo.

**Indicaciones (cuándo SÍ):**
- **Tendinopatía crónica / degenerativa refractaria** que no cede al manejo conservador (carga + agentes coadyuvantes): **tendón rotuliano, Aquiles, epicondilalgia (codo), supraespinoso/manguito, tibial posterior**, reinserción tendón-hueso. Evidencia 2021–2026: meta-análisis 2024 y **SR/MA 2026 (Novaková, *Physiotherapy Research International*)** → la electrólisis percutánea, **sola o combinada con ejercicio terapéutico, mejora dolor y función** en tendinopatía y síndrome de dolor miofascial; un ECA 2026 de tibial posterior mostró que **sumar EPI guiada por eco** a terapia manual+ejercicio supera a terapia manual+ejercicio solos a corto/medio plazo `[verificar]`. Nota: la evidencia es **mixta** (un ECA de manguito no halló efecto añadido) → **no es magia, es coadyuvante** `[verificar]`.
- **Puntos gatillo miofasciales** (punción seca ± electro-punción).
- **Condición imprescindible en todas:** acompañar de **progresión de carga** (excéntrico/HSR).

**Contraindicaciones (cuándo NO):**
Absolutas / fuertes:
- **Belonefobia** (fobia a las agujas) o rechazo del paciente / **sin consentimiento**.
- **Infección local, celulitis o piel lesionada** en la zona de punción; **infección sistémica/fiebre**.
- **Linfedema** del miembro, **zona anestésica** (sin sensibilidad) o **sobre neoplasia/tumor local**.
- **Marcapaso / DAI / neuroestimulador** para la parte de **corriente galvánica** (no pasar corriente cerca del dispositivo).
- **Embarazo** (evitar; relativa-fuerte según zona).
Relativas / según criterio clínico:
- **Coagulopatía / anticoagulación:** **NO es contraindicación absoluta** (revisión 2022: el fármaco antitrombótico no cambia por sí solo el perfil de seguridad si se valora el riesgo individual y la técnica) `[verificar]`, pero **extremar precaución** (hematoma) y evitar zonas profundas/vasculares.
- **Diabético insulinodependiente** (relativa: cicatrización/infección) `[verificar]`.
- **Inmunosupresión.**
- **Tendencia a queloide** (relativa).
- **Fase aguda / inflamatoria** de la lesión (la MEP es para el tendón **crónico/degenerativo**, no para el agudo).

**Precauciones:**
- **CONSENTIMIENTO INFORMADO OBLIGATORIO** (documentado) — es técnica invasiva.
- **Técnica estéril:** aguja estéril de un solo uso, antisepsia de piel, guantes, manejo de residuos punzocortantes.
- **Evitar estructuras de riesgo:** vasos, nervios, vísceras y **pleura** (riesgo de **neumotórax** si se puncionan zonas torácicas/periescapulares — raro pero grave; profundidad segura sobre pulmón ~**10–20 mm** `[verificar]`). Conocer anatomía; ante punción torácica profunda, la **guía ecográfica** reduce el riesgo.
- **Dolor post-punción** 24–72 h esperable (informar al paciente). Eventos adversos **leves frecuentes** (sangrado, hematoma, dolor durante/después, ~19% de las aplicaciones) `[verificar]`; los graves (neumotórax) son raros.
- **No en fase aguda**; respetar reposo relativo breve y la progresión de carga posterior.
- Vigilar reacción vagal (lipotimia) durante la punción.

**Dosificación / parámetros:** `[verificar todos los valores finos]`
- **MEP (microcorriente galvánica):** modo **micro** en **microamperios** — p. ej. estilo EPTE **~300–350 µA** por punción durante **~1–2 min** (ECA de Aquiles: monopolar **330 µA, 1 min 20 s**) `[verificar]`; la **EPI clásica** usa intensidades mayores (**mA**) en pasadas cortas `[verificar]`. **Nº de punciones/pasadas por sesión** y **nº de sesiones** variables (p. ej. **3–6 sesiones**, intervalo **~7–14 días**) `[verificar]`. **Guía ecográfica** recomendada. **Siempre + carga** (excéntrico/HSR) entre sesiones.
- **Punción seca:** localizar el punto gatillo, provocar **REL**, técnica **dinámica (pistoneo)** o estática; **~1 sesión/semana** `[verificar]`, reevaluando dolor y función.

**En la clínica (Microduo FREE modo Sport):**
Equipo real de **microelectrólisis percutánea** (aguja + microcorriente galvánica). Uso clínico: **tendinopatía crónica que no cede** (rotuliano, Aquiles, epicondilalgia, reinserción) — se liga a la biblioteca de protocolos `docs/biblioteca_protocolos.md` como **coadyuvante en fases de tendinopatía refractaria** (p. ej. añadida a **P1-M3 rotuliano** y **P2-M3 Aquiles**, y en **P7** reinserción solo si cronifica), **SIEMPRE con consentimiento + progresión de carga**. **Punción seca ± electro-punción** para puntos gatillo (con consentimiento). Captura banderas (anticoagulación, marcapaso, embarazo, diabetes insulinodependiente) en `seguridadClinica` para que la alerta salte sola.


## 🧊 Termoterapia y Crioterapia

**Indicaciones**
- Calor (termoterapia), cuadro subagudo/crónico: dolor y rigidez crónicos, contractura o espasmo muscular, relajación y preparación pre-ejercicio/pre-estiramiento (aumenta extensibilidad del tejido y flujo sanguíneo local).
- Frío (crioterapia), cuadro agudo: lesión reciente (esguince, contusión, post-qx temprano), edema, dolor e inflamación agudos, y tras un ejercicio/movilización que exacerbó síntomas.
- Regla práctica: frío en las primeras 48–72 h o con signos inflamatorios activos; calor cuando el cuadro ya es subagudo/crónico y sin inflamación.

**Contraindicaciones**
- Calor: inflamación aguda, hemorragia activa o riesgo de sangrado, zona tumoral/neoplásica, isquemia/insuficiencia arterial, trombosis (TVP) e infección aguda.
- Frío: fenómeno o enfermedad de Raynaud, crioglobulinemia, urticaria/hipersensibilidad al frío (crioalergia), insuficiencia arterial o isquemia.
- Ambos: alteración de la sensibilidad térmica o paciente que no puede reportar molestia (riesgo de quemadura térmica o lesión por frío).

**Precauciones**
- Frío sobre nervio superficial (peroneo en la cabeza del peroné, cubital en el codo): limitar el tiempo para evitar neuropraxia; no aplicar de forma prolongada.
- Diabetes/neuropatía, ancianos y niños, y embarazo (zona abdomino-lumbar): extremar la vigilancia con ambos.
- Lipedema: NO frío ni calor extremos (empeoran dolor/tejido); usar temperaturas moderadas o evitar.
- Siempre barrera (toalla) entre la fuente y la piel; revisar la piel durante y al terminar.

**En la clínica**
- Termoterapia: compresa/calor húmedo ~15–20 min `[verificar]` con barrera, como analgesia/relajación o para "abrir" la sesión de terapia manual/ejercicio.
- Crioterapia: hielo/cold pack ~10–20 min, repetible cada 1–2 h en agudo `[verificar]`; nunca hielo directo sobre la piel.
- Son coadyuvantes: acompañan al ejercicio terapéutico (el motor), no lo sustituyen.

## 🦵 Presoterapia y Drenaje linfático

**Indicaciones**
- Edema post-traumático y post-quirúrgico, linfedema (fase de mantenimiento/descongestiva), insuficiencia venosa crónica y estasis circulatorio.
- Pesadez/cansancio de miembros inferiores y recuperación circulatoria tras actividad.
- Drenaje linfático manual (DLM): edema linfático, post-mastectomía (con aval) y edema blando que aún no tolera la bomba neumática.

**Contraindicaciones**
- **TVP / trombosis venosa aguda o su sospecha → NO presoterapia ni DLM** (riesgo de desprender el trombo y causar embolia pulmonar). Es la contraindicación más crítica.
- Insuficiencia cardiaca descompensada o edema pulmonar (la sobrecarga de retorno venoso puede descompensar).
- Infección aguda de la zona: celulitis, erisipela, linfangitis.
- Cáncer activo sin aval oncológico; edema por insuficiencia renal o cardiaca descompensada.
- Insuficiencia arterial severa (isquemia / índice tobillo-brazo bajo) y tromboflebitis aguda.

**Precauciones**
- Descartar TVP antes de iniciar (dolor y edema unilateral súbitos, empastamiento de pantorrilla, enrojecimiento/calor): ante la duda, derivar y NO comprimir.
- Hipertensión no controlada, neuropatía y piel frágil; presión cómoda `[verificar: ~30–60 mmHg]` y progresiva.
- DLM: maniobras suaves y lentas (el sistema linfático es superficial); drenar hacia ganglios proximales permeables.

**En la clínica**
- Presoterapia = compresión neumática secuencial (botas/manguitos): sesiones ~20–30 min `[verificar]`, de distal a proximal, como coadyuvante del edema y la circulación.
- DLM manual para el edema que aún no tolera presión o para "preparar" los cuadrantes antes de la bomba.
- Coadyuvantes: combinar con elevación, movilidad activa y, en linfedema, con vendaje/compresión de contención.

## 🌀 Corriente Aura (masaje electrovibracional) — Neurodyn Esthetic

**Indicaciones**
- Edema, inflamación, equimosis y estancamiento de líquidos en fase aguda y post-quirúrgica (es donde más destaca).
- Analgesia temporal y relajación muscular; mejora de la microcirculación local.
- Coadyuvante de drenaje cuando interesa un efecto "masaje" sobre tejido hinchado/sensible (p. ej. post-op temprano, esguince reciente).

**Contraindicaciones**
- Marcapaso / desfibrilador implantable (DAI) u otro dispositivo electrónico implantable.
- Embarazo según zona (abdomen, lumbar, pelvis).
- Tumor local o cáncer activo sobre la zona (sin aval), y trombosis / TVP.
- Piel lesionada, herida abierta, dermatitis o infección cutánea en la zona de deslizamiento.

**Precauciones**
- Sobre o cerca de implante metálico/osteosíntesis: usar con cautela y ligarlo con la alerta de 🛡️ Seguridad; ante la duda, evitar.
- Zonas de sensibilidad alterada (el paciente no puede reportar molestia); evitar cara anterior del cuello/seno carotídeo.
- Intensidad cómoda (10–200 Hz), con medio de deslizamiento y piel íntegra.

**En la clínica**
- Es el "Masaje Aura" del Neurodyn Esthetic: masaje electrovibracional por repulsión de cargas electrostáticas; se **desliza el aplicador** sobre la zona como un masaje, NO con electrodos fijos.
- Uso típico: coadyuvante de edema/equimosis y analgesia en agudo o post-qx con hinchazón.
- Agente de apoyo: no reemplaza elevación, compresión ni ejercicio; se suma a ellos.

## 🩹 Vendaje neuromuscular, Tracciones y Terapia manual

**Indicaciones**
- Vendaje NM (kinesiotape): soporte y facilitación propioceptiva, descarga de tejido, corrección postural leve, y drenaje de edema/equimosis.
- Tracción cervical/lumbar: radiculopatía con alivio o centralización de los síntomas a la tracción, y hernia discal con compresión radicular que responde.
- Terapia manual / masoterapia / liberación miofascial: dolor miofascial, contractura y puntos gatillo, restricción de movilidad, relajación y preparación para el ejercicio.

**Contraindicaciones**
- Vendaje NM: alergia al adhesivo/acrílico, piel lesionada/herida abierta, dermatitis o infección cutánea; no sobre TVP, celulitis ni tumor local activo.
- Tracción (mayores): inestabilidad ligamentosa o vertebral, mielopatía sin cribado, tumor o metástasis vertebral, infección (discitis/osteomielitis), fractura, osteoporosis severa; en cervical, además artritis reumatoide con inestabilidad atlantoaxial (riesgo medular) e insuficiencia vertebrobasilar.
- Terapia manual/masoterapia: trombosis/TVP (no masajear MMII con sospecha), fractura aguda, infección local/celulitis, tumor local o malignidad sin aval, herida abierta y miositis osificante aguda.
- Cervical (manual o tracción): NO manipular ni traccionar sin cribar antes mielopatía (Hoffmann/Babinski, marcha) y banderas vasculares de disección arterial.

**Precauciones**
- **Cribado OBLIGATORIO antes de tracción/manipulación cervical:** historia + examen neurológico y vascular (vértigo, mareo, tinnitus, alteración visual, disfagia = banderas vertebrobasilares → derivar); en AR confirmar la estabilidad C1–C2 por imagen.
- Tracción: iniciar con carga baja y progresar `[verificar: cervical ~10% del peso corporal, lumbar ~25–50%]`; SUSPENDER si aumenta el dolor radicular o periferiza.
- Anticoagulación (hematomas con masaje/tape), osteoporosis (dosificar la fuerza), piel frágil, embarazo (lumbar/abdomen).
- Vendaje NM: prueba de tolerancia cutánea; no estirar la piel en exceso; recambio ~3–5 días `[verificar]`.

**En la clínica**
- Vendaje NM (kinesiotape): soporte propioceptivo/drenaje como complemento del ejercicio; retirar ante cualquier irritación.
- Tracciones (cervical/lumbar): alivio sintomático de la raíz; es coadyuvante del ejercicio y la educación, no un tratamiento aislado.
- Terapia manual / masoterapia / liberación miofascial: abren una ventana de menor dolor y más movilidad para cargar/ejercitar después; siempre tras el cribado correspondiente.
