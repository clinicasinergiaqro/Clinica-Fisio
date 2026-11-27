# SINERGIA — Rediseño UX/UI V1 · Cambios y funcionalidades

Prototipo funcional del rediseño, alineado al PDF **Propuesta 01** de ChatGPT y a las
instrucciones de los 10 puntos. **Filosofía mobile-first**: el celular es la herramienta
principal; tablet/laptop añaden columnas y paneles encima, sin convertir la app en una de
escritorio adaptada.

> **Alcance:** propuesta visual/ergonómica. **No se tocó producción, ni los expedientes,
> ni las rutas de guardado, ni los algoritmos biomecánicos.** Datos 100% sintéticos.

---

## 1. Cómo está hecho (y por qué conserva TODO)

El prototipo **NO reescribe la app**. Es la aplicación real (`index.html`) con una capa
aditiva encima:

- **`rediseno.css`** — sistema de diseño único (tokens de la propuesta) + responsivo + compactaciones.
- **`rediseno.js`** — *enhancer* que, tras cada render, añade el rail lateral y los paneles de
  contexto, compacta el SOAP y acentúa S/O/A/P. **Solo lee datos y dispara los controles que ya
  existen** (p. ej. "Nuevo motivo" hace clic en el botón real `#btn-nuevo-motivo-soap`).

Consecuencia: **cada campo, botón, tratamiento, herramienta, dictado, cámara y flujo sigue
funcionando igual**, porque por debajo corre la app real. Si mañana se quita la capa, la app
queda idéntica.

El overlay se aplica sobre la **réplica offline** (Firebase y backend neutralizados con un
stub; pacientes ficticios) para poder abrirla y navegarla sin conexión ni datos reales.

---

## 2. Sistema de diseño único (Fase 1 de la propuesta)

Tokens EXACTOS del PDF (p.02): navy `#1B3A6B`, navy profundo `#122950`, oro `#C9A84C`,
fondo `#F5F7FA`, superficie `#FFFFFF`, texto `#24334A`, secundario `#526174`, borde `#DDE3EC`,
éxito `#236646`, aviso `#83520C`, riesgo `#A52D25`, **dermato `#8E3B6E`** (la lente rosa
identifica modalidad, NO sustituye los colores de seguridad). Radios 8/12/16; áreas táctiles
44–48px; oro solo con texto oscuro. Botones, tarjetas, campos, chips, checkboxes, pestañas,
alertas y buscador unificados. La identidad azul marino + dorado se conserva.

## 3. Mobile-first (prioridad)

- **Objetivos táctiles 44–52px** (chips, checkboxes, EVA, botones) para uso con una mano.
- **Guardar fijo** (`position:sticky` abajo) en SOAP y Alta → el teclado no lo tapa y no hay que
  perseguir el botón con scroll. Usa el **botón real** (conserva su estado y su verificación).
- **Menos scroll**: identificación del SOAP compactada a una línea; panel de contexto plegado
  en móvil (no empuja la primera caja).
- **Acceso rápido** a cámara/foto/dictado/mediciones conservado (rejilla de media en la O +
  acción "Medir / importar").
- **Alertas de seguridad siempre visibles** (nunca ocultas ni reducidas a un icono).

## 4. Responsivo real (Fase 2) — se evalúa primero el móvil, luego se aprovecha el ancho

- **Celular (≤759px):** una columna, nav inferior, el flujo móvil real intacto + pulido.
- **Tablet (760–1099px):** contenido centrado, listas en columnas, panel de contexto a la derecha.
- **Escritorio (≥1100px):** **rail lateral** (Agenda/Pacientes/Protocolos/Supervisión + Perfil/Salir),
  listas multicolumna, SOAP con S|O y A|P en dos columnas + panel de contexto, paneles de estado.
- **A 1920px** el contenido se **acota** (no se estira texto ni formularios).

## 5. Pantalla por pantalla

- **Agenda:** rail + resumen del día + citas con `+ Sesión` + pendientes. En móvil, lista compacta y nav inferior.
- **Directorio:** búsqueda y filtros conservados; tarjetas en columnas en pantallas grandes.
- **Expediente:** cabecera clínica + **9 pestañas** intactas + panel **"Estado del expediente"**
  (Historia / Valoración / Consentimiento / Notas) y acción "Nueva sesión".
- **Valoración:** vista de exploración + EVA/ROM/fuerza; la medición biomecánica se referencia (ver §7).
- **SOAP (prioridad):** seguridad sticky → identificación en una línea → **S/O/A/P** con acento de
  color → **panel de contexto de solo lectura** (última nota, valoración inicial, objetivos) +
  acciones (Nuevo motivo, Descarga, Medir). "Guardar" fijo. **Se conserva cada acción, solo se reubica.**
- **Alta:** ficha de identificación agrupada, edad automática, progreso del expediente; campos y
  condiciones existentes intactos.
- **Biomecánica:** pestaña y módulo intactos; además se referencia en el SOAP (ver §7).

## 6. Nuevo motivo de consulta (requisito fundamental) — CONSERVADO

Se auditó la implementación real y **no se modificó la estructura de datos**:

- El episodio vigente vive en los campos raíz del paciente (`motivoConsulta`, `motivo`,
  `valoracion`, `dxFuncional`, `planTto`); los cerrados en `motivosAnteriores[]`;
  `motivoActualIndex` + `numSesionEpisodioActual`; cada nota lleva `motivoIndex`/`numEpisodio`.
- El botón **"🆕 ¿Es un MOTIVO NUEVO?"** dentro del SOAP sigue archivando el episodio y **reiniciando
  la numeración de sesiones desde 1** al guardar (un solo paso). También está el acceso desde la
  pestaña Historia ("Nuevo motivo de consulta") y el acceso en el panel de contexto.
- **Antecedentes NO se borran** al cambiar de motivo (viven aparte) y pueden actualizarse.
- El rediseño distingue visualmente: **expediente general**, **motivo activo**, **motivos anteriores**
  y numeración por episodio — sin tocar los datos.

## 7. Integración biomecánica (propuesta, Fase 4)

Tarjeta **"📐 Mediciones biomecánicas · propuesta"** en la **O** del SOAP (y referenciable en
Valoración), que:

- Muestra **Inicial / Actual / Cambio** con los estados **Actual · Histórica · Pendiente**.
- **El Δ solo se calcula entre mediciones del MISMO movimiento**, ambas numéricas y **ninguna
  pendiente de validar** (nunca compara flexión con cadencia; la pendiente **no alimenta
  diferencias ni IA**). Conserva la fecha original de las históricas.
- Botones **Medir ROM / Importar histórica / Comparar** que **reusan el motor existente**
  (`abrirMedidorBiomecanico`, `BIO_comparar`) — **sin tocar sus algoritmos**.
- Nota honesta de método ("cámara 2D · estimación no validada frente a goniómetro físico").

Es **propuesta visual**: no escribe datos ni establece diagnósticos a partir de un ángulo.

## 8. Lo que queda como refinamiento (para tu revisión, aún no hecho)

- Índice lateral de "Apartados" en el Alta de escritorio (Datos/Antecedentes/Seguridad/…).
- Directorio maestro-detalle en escritorio (lista + detalle del paciente seleccionado).
- "S aún más arriba" en móvil plegando Fecha/Dictado (no se hizo para no esconder los atajos de
  Motivo/Descarga sin tu visto bueno).
- Protocolos/Ejercicios/Supervisión en escritorio (índice lateral / grid / tabla) — pendientes de Fase 2b.

## 9. Fuera de alcance (a propósito)

- **No se tocó el generador de diagnósticos funcionales V2.2** (lo desarrolla la otra ventana).
- No se despliega nada; no se modifican expedientes ni rutas de persistencia.

## 10. Cómo abrir el prototipo

Abre `redesign/index.html` en un navegador (Chrome/Safari). Arranca solo con pacientes
ficticios (supervisor DEMO). Navega Agenda → Pacientes → un paciente → pestañas → `+ Sesión`
(SOAP) → "¿Es un MOTIVO NUEVO?". Redimensiona la ventana para ver móvil / tablet / escritorio.
El `apiKey` de Firebase y la URL del backend fueron **redactados** (el prototipo no se conecta a nada).
