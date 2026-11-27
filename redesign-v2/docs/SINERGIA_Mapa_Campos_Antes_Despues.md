# Mapa de campos — Antes → Después (Sinergia V2.0)

**Matriz de correspondencia que demuestra que el rediseño conserva campos, acciones y permisos — solo cambia la presentación.**
Documento de revisión para Carlos y para la revisión de diseño.

> **Principio rector:** **ningún campo, acción ni permiso se elimina.** El contenido actual se **reorganiza** en apartados y componentes mejor jerarquizados. Este documento mapea, pantalla por pantalla, dónde vive cada cosa en V2.
>
> **Convención de la columna «Dónde vive en V2»:** indica el componente/sección del prototipo. Donde se anota *(se conserva · se integra a la pantalla real)*, el campo pertenece al flujo y se preserva, aunque el prototipo navegable lo muestre de forma representativa (el prototipo usa datos sintéticos y no persiste).

---

## Alta de paciente → 8 apartados

El alta se reorganiza en una **stepbar** de 8 apartados con barra de progreso; borrador conservado en todo el flujo.

| Campo / acción (actual) | Dónde vive en V2 | Nota |
|---|---|---|
| Nombre, edad, sexo | Apartado **1 · Identificación** | Edad y sexo en una fila (segmento H/M) |
| Teléfono | Apartado **1 · Identificación** | Marcado obligatorio («10 dígitos · obligatorio para alta») |
| Terapeuta asignado | Apartado **1 · Identificación** | Chips de selección |
| Antecedentes heredofamiliares, cirugías, medicamentos | Apartado **2 · Antecedentes** | Textareas; «lo que no aplique, déjalo vacío» |
| Alergias | Apartado **2 · Antecedentes** | Obligatorio (o indicar «Ninguna») |
| Condiciones médicas e implantes/osteosíntesis | Apartado **3 · Seguridad clínica** | Chips; activan alerta de agentes físicos (banner warn) |
| Motivo de consulta (relato y estructura) | Apartado **4 · Motivo** (entrevista guiada) | Ver tabla de Motivo |
| EVA, ROM, fuerza 0–10, (edema/perímetros si derma) | Apartado **5 · Valoración inicial** | `eva-pick`; ROM por cámara/importar; fuerza por hoja |
| Diagnóstico funcional, objetivo CP, objetivo LP | Apartado **6 · Dx y objetivos** | Presenta/edita lo del motor clínico (ver cierre) |
| Agentes físicos de hoy, ejercicio/indicaciones | Apartado **7 · Tratamiento** | El plan completo vive en Protocolo |
| Confirmar y crear expediente | Apartado **8 · Revisión** | Checklist por apartado; «el borrador no se borra hasta confirmar el guardado» |

---

## Motivo de consulta → entrevista guiada

Se conserva toda la estructura del motivo; cambia a preguntas en lenguaje natural.

| Campo / acción (actual) | Dónde vive en V2 | Nota |
|---|---|---|
| Relato del padecimiento | «¿Qué le molesta y dónde?» | Texto libre |
| Región / zona | Pregunta con chips (Rodilla, Hombro, Columna, Tobillo, Cadera, Otra) | — |
| Lado | Chips (Derecho/Izquierdo/Bilateral/No aplica) | — |
| Irradiación | Chips (No/Sí) | — |
| Carácter del dolor | Chips (Punzante/Ardor/Eléctrico/Pulsante/Opresivo/Sin dolor) | — |
| Desde cuándo | Campo de texto | «Basta la duración; no hace falta la fecha exacta» |
| Mecanismo | Chips (Caída/golpe, Sobreuso, Gesto deportivo, Post-cirugía, Insidioso) | — |
| Qué lo agrava / qué lo alivia | Dos campos de texto | — |
| Evolución | Chips (En mejoría/Igual/Empeorando/Fluctuante) | — |
| Limitaciones funcionales | «¿Cómo le afecta su día a día?» | Texto libre |

---

## Valoración inicial

| Campo / acción (actual) | Dónde vive en V2 | Nota |
|---|---|---|
| EVA | Tarjeta **Dolor (EVA)** | Número grande (mono) + barra con pin + badge «Evaluado» |
| ROM (goniometría) | Tarjeta **Rango de movimiento** | Arco SVG + inicial→actual + ganancia; importar/medir con cámara |
| Fuerza | Tarjeta **Fuerza comparativa (Sinergia 0–10)** | Medidores der/izq + % déficit; «Registrar otro grupo» |
| Pruebas especiales | Tarjeta **Pruebas y hallazgos** (`states`) | Estados: positivo / negativo / no aplica / no evaluado |
| Palpación | Tarjeta **Pruebas y hallazgos** | Se registra como hallazgo (`state`) |
| Marcha | Tarjeta **Pruebas y hallazgos** / Biomecánica | Hallazgo y/o medición |
| Inflamación / edema | Tarjeta de valoración (o dermato para post-op) | Representado como estado/medición |
| Estudios | Módulo **Estudios** del expediente | Foto/Galería/Escanear/Archivo/Link/Receta |

---

## Fuerza (Sinergia 0–10)

| Campo / acción (actual) | Dónde vive en V2 | Nota |
|---|---|---|
| Captura de fuerza | Hoja inferior **Fuerza Sinergia 0–10** | Flujo: Región → Músculo → Valor 0–10 → Lado → Registrar |
| Grupo muscular | Selección Región→Músculo | No usa Daniels ni dinamómetro |
| Valor y lado | Stepper 0–10 + segmento Derecho/Izquierdo | 10 = lado sano |
| Comparar lados / déficit | Medidores der/izq + % déficit en la tarjeta | No asume el contralateral sano: el fisio elige la referencia |
| Registrar varios grupos | «Registrar otro grupo» (repite la hoja) | Varios grupos consecutivos |

---

## ROM / biomecánica

| Campo / acción (actual) | Dónde vive en V2 | Nota |
|---|---|---|
| Mediciones de goniometría/marcha | Módulo **Biomecánica** | Lista con grado/referencia y barra |
| Medir con cámara | Acción **Medir** / «Medir ahora con la cámara» | Motor real fuera del prototipo (ver doc de pruebas) |
| Importar medición a la nota | Hoja **Importar medición ROM** | Solo mediciones **validadas**; las pendientes no se comparan |
| Comparar antes/después | Acción **Comparar antes / después** | — |

---

## SOAP

Mismo modelo S/O/A/P; encabezado compacto, navegación por secciones y guardado honesto.

| Campo / acción (actual) | Dónde vive en V2 | Nota |
|---|---|---|
| S — Subjetivo | Grupo **S** (`soap-S`) | Molestia/dolor + «actividad física/cambios» |
| O — Objetivo | Grupo **O** (`soap-O`) | ROM/fuerza + agentes físicos |
| A — Análisis | Grupo **A** (`soap-A`) | Razonamiento clínico |
| P — Plan | Grupo **P** (`soap-P`) | Indicaciones y objetivos |
| Navegar entre S/O/A/P | **quick-nav** sticky con scroll-spy | Resalta la sección visible |
| Agentes físicos aplicados | Pills en **O** | Lista propia por lente (MSK / dermatofuncional) |
| EVA inicio / EVA fin | Mini-métrica y etiqueta en **S/O** | EVA inicio mostrado en la S; EVA fin se conserva en la captura |
| Dictado por voz | Acción rápida **Dictar** | — |
| Nuevo motivo (episodio) | Acción rápida **Nuevo motivo** | Banner «Nuevo episodio · Sesión 1 · pendiente de guardar · antecedentes conservados» |
| Descarga muscular | Campo/técnica de la nota *(se conserva · se integra a la pantalla real)* | Registrado junto a agentes/técnicas de la O |
| Fecha de consulta / nº de sesión | Encabezado **soap-head** (chip «Sesión N») | La fecha de consulta se conserva en el contexto de la nota |
| Guardar | **savebar** con máquina de estados | No limpia el borrador hasta confirmar guardado efectivo |

---

## Dx funcional y objetivos

| Campo / acción (actual) | Dónde vive en V2 | Nota |
|---|---|---|
| Diagnóstico cineticofuncional | Apartado **6 · Dx y objetivos** (textarea) | Se **presenta y edita** aquí |
| Objetivo a corto plazo | Campo CP | «Por criterios, no calendario» |
| Objetivo a largo plazo | Campo LP | Retorno funcional |
| Pronóstico / limitaciones | Campos del expediente *(se conservan)* | Datos del modelo del paciente |

> El diagnóstico funcional **no se genera en esta ventana/pantalla**: se presenta y edita. La generación proviene del motor clínico (ver cierre).

---

## Dermatofuncional

Lente rosa (acento), seguridad conservada; valoración con tarjetas específicas.

| Campo / acción (actual) | Dónde vive en V2 | Nota |
|---|---|---|
| Procedimiento quirúrgico | Tarjeta **Post-quirúrgico** | — |
| Cirujano | Tarjeta **Post-quirúrgico** | — |
| Fecha de cirugía / día post-op | Encabezado de valoración («día N post-op») | — |
| Autorización del cirujano | Tarjeta **Post-quirúrgico** | Verde si «Sí…», alerta si pendiente |
| Drenajes / faja | Tarjeta **Post-quirúrgico** *(se conserva)* | Estado post-op (p. ej. «drenajes retirados») |
| Fototipo (Fitzpatrick) | Tarjeta **Post-quirúrgico** | — |
| Edema (godet) | Tarjeta **Post-quirúrgico** / `eva-pick` en alta | +1…+4 |
| Fibrosis (PANFIC) | Tarjeta **Post-quirúrgico** | N1… por zona |
| Cicatrices | Tarjeta **Post-quirúrgico** | Estado/morfología |
| Perímetros | Valoración (fila de perímetros) | cm por nivel |
| Fotos antes/después | Tarjeta **Fotos antes / después** | Captura comparativa |
| Equipos / aparatología | Tarjeta **Plan estético** | Equipos reales (DLM, Presoterapia, Corriente Aura, Ultrasonido…) |
| Plan por fases | Tarjeta **Plan estético** | Fase F1…F3 |
| EVA (molestia) | Tarjeta **Molestia (EVA)** | Acento dermatofuncional; escala y seguridad iguales |

---

## Agenda

| Campo / acción (actual) | Dónde vive en V2 | Nota |
|---|---|---|
| Resumen del día | **Hero de jornada** | Citas, atendidas, sin documentar, por llegar; anillo de cumplimiento |
| Lista de citas / próximas | Sección **Próximas** (filas `appt`) | Hora mono, dx, inicial de fisio, estado |
| Sesiones sin documentar | Sección **Atendidas · sin documentar** | Estado «Falta nota» en warn |
| Buscar | Icono de búsqueda en app bar | — |
| Alta de paciente | **FAB** `+` | — |
| Navegación | **Tabbar** (Agenda·Pacientes·Protocolos·Supervisión) | — |

---

## Expediente

| Campo / acción (actual) | Dónde vive en V2 | Nota |
|---|---|---|
| Identidad (nombre, edad, terapeuta, dx) | **pt-head** compacto | Una sola vez, sin duplicación |
| Indicadores clave | **pt-stats** | EVA / flexión (o edema) / sesiones |
| Seguridad clínica | **safe-banner** | ok / warn / risk |
| Evolución | **evo** (sparkbars + delta) | Evolución del dolor |
| Acceso a módulos | **modgrid** | Valoración, SOAP, Biomecánica, Protocolo, Ejercicios, Estudios (o Dermato/Plan/Fotos si derma) |
| Editar | Acción de editar (top nav) | — |

---

## Supervisión

| Campo / acción (actual) | Dónde vive en V2 | Nota |
|---|---|---|
| Cobertura de documentación | **Hero** del tablero | % promedio, notas, sin documentar, terapeutas |
| Cobertura vs. calidad por terapeuta | Tarjeta por terapeuta | Dos medidores (cobertura / calidad) |
| Sesiones sin documentar por terapeuta | Línea de alerta en la tarjeta (warn) | — |
| Exportar / compartir | Acción **PDF de todos** | — |

---

## Permisos y roles

- **No se tocan las reglas de autenticación, roles ni visibilidad.** El rediseño es capa de presentación; quién ve y edita qué se conserva igual que en producción.
- **Activo = migrado:** mismo trato en la presentación (sin distinción de experiencia entre un paciente activo y uno migrado).
- Supervisión sigue siendo una vista de supervisor; el resto de pantallas respeta el ámbito del usuario autenticado.

---

## Coordinación con el generador clínico

Esta ventana/rama **no desarrolla** el generador de diagnósticos funcionales (el que trabaja los 85 pacientes). Aquí el `dxFuncional` **se presenta y se edita**; se genera en la rama de inteligencia clínica. La correspondencia de datos se gobierna por el **contrato clínico compartido** entre ambas ventanas. Esta rama es independiente y no se fusiona con la de inteligencia clínica.
