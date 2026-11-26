# SINERGIA — Rediseño UX/UI **V1.1** · Cambios y funcionalidades

Prototipo funcional (réplica offline, datos sintéticos). **Mobile-first.**
Capa **aditiva** sobre la app real: no reescribe `index.html`, no toca expedientes
ni rutas de guardado, no modifica los algoritmos biomecánicos. Rama Git
independiente `claude/redesign-ux-ui-v1-1` (no fusionada).

> Referencia estética: el **módulo biomecánico** y el **lector de protocolos**
> (navy + oro, pastillas limpias, tarjetas). El overlay (`redesign/src/rediseno.css`
> + `rediseno.js`) se hornea sobre la réplica con `redesign/harness/`.

---

## 1. SOAP mobile-first (prioridad)

- **Navegación rápida S/O/A/P**: barra **sticky** con las 4 letras; tocar una salta a
  su sección (scroll-spy resalta la visible). Permite llegar al **Subjetivo** desde la
  primera pantalla en condiciones normales **sin ocultar la alerta de seguridad**
  (la barra se apila justo debajo de la alerta, que permanece visible).
- **Guardar fijo a prueba de teclado**: barra inferior fija con **💾 Guardar nota** que
  **flota sobre el teclado** (visualViewport) y dispara el **botón real** `guardarSOAP()`
  (conserva su verificación/estado). Botón **↑** para volver al inicio de la nota.
- **Encabezado compacto**: identificación a una línea, fecha compacta, dictado como
  pastilla colapsada. Se conservan dictado, descarga muscular, selector de motivo y el
  **panel de contexto** (última nota, valoración inicial, objetivos) + accesos.
- Se mantienen **todos** los tratamientos, agentes físicos, modalidades, media y el
  **razonamiento clínico escrito**. Solo se reubica y acentúa.

## 2. Fuerza muscular 0–10 (escala comparativa, 10 = lado sano)

- UI rápida y atractiva: **Región → Músculo → Valor 0–10 → Lado → Referencia**
  (reusa la taxonomía real `_FZ_MUS`; no duplica).
- Al registrar: escribe la frase en el **campo libre real** `f-ofuerza` **sin pisarlo**
  (conserva texto y registros previos) y guarda un registro estructurado aditivo
  `valoracion.fuerzaEval[]`.
- **Comparativa** (déficit vs 10, asimetría Izq/Der) y **evolución** (mismo músculo+lado,
  por fecha, con Δ ▲/▼). **No** sustituye Daniels/MRC.
- Disponible en **Valoración** y en la **O** del SOAP.

## 3. ROM / Biomecánica (integración funcional, motor intacto)

- **Medir** cámara en vivo / **foto** / **video** → abre el medidor real
  (`abrirMedidorBiomecanico`). Obtiene, revisa y valida ángulos con el motor existente;
  guarda e incorpora al registro (`p.biomecanica` + `valoracion.rom`).
- **Importar histórica — CORREGIDO**: ya **no abre el medidor**; abre un **selector de
  mediciones existentes** y trae la elegida a la nota (O · ROM). Las pendientes de
  validar no son importables para comparación.
- **Comparar solo compatibles**: mismo **episodio, articulación, movimiento, lado,
  método y unidad**; **excluye eliminadas y pendientes** de las comparaciones clínicas.
- **Recupera media anotada** (miniatura de la imagen guardada) y genera **reporte**
  (`BIO_pdf`).
- **No se pierde el borrador del SOAP** al abrir/cerrar el goniómetro ni en un re-render
  (guarda de borrador por campo, se restaura si la nota se vuelve a pintar vacía).
- **No** se modifican ni duplican los algoritmos.

## 4. Nuevo motivo de consulta

- Conserva el flujo real. Al activarlo muestra **de inmediato** un banner
  **«Nuevo episodio · Sesión 1 · pendiente de guardar»** con el número de episodio, y
  recuerda que **antecedentes e historia se conservan** y la numeración de sesiones
  **arranca en 1**, sin mezclar lesiones anteriores.

## 5. Resto de la app

- **Índice de apartados del Alta**: barra sticky que salta a cada sección
  (Datos / Antecedentes / Seguridad / Motivo / Valoración / Dx-Plan / …).
- **Dx funcional — presentación + edición**: tarjeta que **lee `p.dxFuncional`** y lo
  presenta (dx clínico, funcional, objetivos CP/LP, pronóstico, limitaciones) con botón
  **✏️ Editar**. **No genera** el diagnóstico (eso es de la otra ventana, V2.2.1); solo
  prepara su **presentación visual y edición**.
- **Directorio maestro-detalle (escritorio)**: panel de vista previa a la derecha que se
  llena al pasar el cursor por un paciente (dx, EVA/ROM/fuerza, objetivo, última nota) +
  **Abrir expediente / ➕ Sesión**. El clic en la tarjeta sigue abriendo el expediente.
- **Rail lateral** en escritorio (Agenda/Pacientes/Protocolos/Supervisión por rol) +
  listas multicolumna + panel de contexto flotante.
- **Modo oscuro** refinado (remapeo de tokens del overlay bajo `body.modo-oscuro`).
- **Lente dermatofuncional** (acento rosa) sin cambiar el significado de las alertas.

## 6. Coordinación con la otra ventana (dx V2.2.1)

- Se creó **`SINERGIA_Contrato_Clinico_Compartido.md`** (modelo de datos compartido,
  matriz de propiedad, invariantes y el contrato del dx funcional). La ventana A (este
  rediseño) **no desarrolla** el generador; solo presenta/edita `dxFuncional`.

## 7. Invariantes respetados

Integridad de guardado (usa el botón/flujo real), activo = migrado, notas append-only,
Android + iOS, sin campos nuevos a Firestore, algoritmos biomecánicos intactos, sin tocar
producción. Datos 100 % sintéticos.

## 8. Cómo abrir el prototipo

Abrir `redesign/index.html` (Chrome/Safari). Arranca como supervisor DEMO con pacientes
ficticios. Redimensionar para ver móvil / tablet / escritorio. Firebase y backend
neutralizados; credenciales redactadas.
