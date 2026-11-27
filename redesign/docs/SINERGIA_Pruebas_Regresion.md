# SINERGIA — Pruebas de regresión del rediseño

El rediseño es una **capa aditiva** sobre la app real. Antes de adoptar cualquier parte en
producción, verificar que estos **invariantes** siguen intactos. (Lista basada en la auditoría
del código real, los criterios de aceptación del PDF §12 y las reglas permanentes del proyecto.)

## A. Integridad de guardado (lo más crítico)
- [ ] Un **"✅ guardado" solo aparece si de verdad se guardó** (`saveDB` exige `d.ok && guardados!==0`;
      maneja `SAVE_INCOMPLETO`/`LOCK_TIMEOUT`/`MERGE_ERROR`/`AUTH_REQUIRED` conservando local + encolando + avisando).
- [ ] La **barra "Guardar" fija** del móvil dispara el **botón real** (misma verificación y estado); no un atajo nuevo.
- [ ] **No se perdió ningún campo, botón, tratamiento o herramienta** del SOAP, Alta, Valoración o Expediente.
- [ ] Respaldo local durable (localStorage + IndexedDB) y recuperación siguen funcionando; disco lleno avisa, no calla.

## B. Nuevo motivo de consulta / numeración
- [ ] "🆕 ¿Es un MOTIVO NUEVO?" archiva el episodio y **reinicia la numeración de sesiones desde 1** al guardar.
- [ ] Los **antecedentes NO se borran** al cambiar de motivo.
- [ ] La nota queda etiquetada con `motivoIndex`/`numEpisodio`; los motivos anteriores quedan en el historial.
- [ ] El acceso desde la pestaña Historia ("Nuevo motivo de consulta") sigue operando.

## C. Activo = Migrado
- [ ] Todo flujo (abrir, contar, listar, guardar, SOAP, nuevo motivo, biomecánica) funciona igual para
      pacientes **activos (`p…`)** y **migrados (`mig_pac_…`)**.

## D. Seguridad clínica
- [ ] La caja de **seguridad del paciente** permanece **visible** (no oculta ni reducida a icono) en el
      SOAP y el Expediente; las alertas graves (metal/marcapaso/anticoagulante/cáncer…) siguen saltando.

## E. Biomecánica (propuesta)
- [ ] El motor (`abrirMedidorBiomecanico`, `BIO_comparar`) **no se modificó**.
- [ ] El Δ solo se calcula entre **mismo movimiento**, ambas numéricas y **ninguna pendiente**; la
      pendiente **no alimenta diferencias ni IA**; las históricas conservan su fecha.
- [ ] Ninguna medición establece un diagnóstico estructural automáticamente.

## F. Offline / sincronización
- [ ] Arranque offline, reconexión, colas de sync y "sin sincronizar" siguen funcionando; no se pierden borradores.

## G. Responsivo (PDF §12 F2)
- [ ] Probar **390 / 1024 / 1440 / 1920**; sin **scroll horizontal** accidental; a 1920 los anchos se acotan.
- [ ] En móvil: nav inferior, una columna, teclado no cubre Guardar.
- [ ] El rail de escritorio llama a las mismas funciones de navegación (Agenda/Pacientes/Protocolos/Supervisión por rol).

## H. Roles y permisos
- [ ] Supervisión solo aparece para supervisor; QA y migración siguen protegidos; exportar/papelera/apoyo
      conservan sus permisos.

## I. Modo oscuro y dermato
- [ ] El acento **rosa** identifica la lente dermatofuncional **sin** cambiar el significado de las alertas.
- [ ] Revisar el modo oscuro visualmente.

---

## Cómo probar el prototipo (datos sintéticos)
1. Abrir `redesign/index.html`. Verifica que arranca en Agenda como supervisor DEMO.
2. Pacientes → abrir **Juan Pérez Demo** → recorrer las 9 pestañas (contexto y "volver" estables).
3. `+ Sesión` (SOAP): confirmar S/O/A/P, dictado, modalidades, media, biomecánica, y **Guardar fijo**.
4. En el SOAP, "🆕 ¿Es un MOTIVO NUEVO?": confirmar que aparece el campo de motivo/dx y que la cabecera
   anuncia **Sesión 1 del nuevo episodio**.
5. Redimensionar la ventana (o DevTools responsive) a 390/1024/1440/1920 y revisar cada pantalla.
6. Abrir **Ana Torres Demo** (dermatofuncional) para ver la lente rosa; y **Jeff/María** con alertas de seguridad.

> Nota: el prototipo no se conecta a ningún backend (Firebase y Apps Script neutralizados; credenciales
> redactadas). "Guardar" muestra el flujo pero no escribe en ninguna base real.
