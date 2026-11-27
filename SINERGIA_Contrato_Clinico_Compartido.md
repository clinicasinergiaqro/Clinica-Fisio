# SINERGIA — Contrato Clínico Compartido

**Versión:** 1.0 · **Fecha:** 2026-11-26 · **Estado:** vigente

Este documento es el **acuerdo de coordinación** entre las dos ventanas de Claude que
trabajan sobre Sinergia en paralelo:

- **Ventana A — Rediseño UX/UI (V1.1):** estética, ergonomía, mobile-first, SOAP, fuerza,
  ROM/biomecánica, agenda, expediente, protocolos, ejercicios, supervisión. Trabaja como
  **capa aditiva** (overlay) sobre la app real; **no** reescribe `index.html` ni toca
  rutas de guardado.
- **Ventana B — Diagnóstico funcional V2.2.1:** el **generador** de diagnósticos
  funcionales. Es la **única** que desarrolla ese generador.

Ambas ventanas **deben respetar este contrato**. Su objetivo es que el trabajo de una
nunca pise ni rompa el de la otra, y que ambas honren las reglas permanentes del proyecto
(ver `CLAUDE.md`).

---

## 1. Reglas de oro (INVIOLABLES para las dos ventanas)

1. **Integridad de guardado.** Un "✅ guardado" solo puede mostrarse si de verdad se
   guardó (`saveDB` exige `d.ok && d.guardados!==0`; maneja
   `SAVE_INCOMPLETO`/`LOCK_TIMEOUT`/`MERGE_ERROR`/`AUTH_REQUIRED`). Nunca introducir una
   ruta que confirme un guardado que no ocurrió. **No tocar la ruta de persistencia sin
   releer la regla de integridad del `CLAUDE.md`.**
2. **Activo = Migrado.** Todo flujo (abrir, contar, listar, guardar, SOAP, nuevo motivo,
   fuerza, biomecánica, dx) debe funcionar idéntico para pacientes **activos (`p…`)** y
   **migrados (`mig_pac_…`)**.
3. **Notas SOAP = append-only.** No se borran ni se editan destructivamente; cada nota
   lleva `motivoIndex`/`numEpisodio`. Nada que escriba a `sesiones` puede asumir borrado.
4. **Ningún campo nuevo a Firestore sin su regla desplegada ANTES.** Si se agrega un campo
   a un documento de `pacientes/{id}` o `sesiones`, hay que whitelistearlo en
   `firestore.rules` y que Carlos lo despliegue **antes** de mandarlo; si no, el write se
   rechaza (`permission-denied`). Preferir que el write **degrade** (atrapar
   `permission-denied`) en vez de clavar la nota. (Lección del campo `modalidad`.)
5. **Android + iOS.** Todo cambio se piensa y prueba para ambos.
6. **Algoritmos biomecánicos intactos.** No modificar ni duplicar `medidor-biomecanico.js`
   ni sus fórmulas. Solo reusar sus funciones públicas (`abrirMedidorBiomecanico`,
   `BIO_comparar`, `BIO_pdf`, etc.).
7. **Bump doble al desplegar** (solo cuando Carlos autorice merge a producción):
   `sw.js` CACHE + `window.APP_VERSION` al mismo valor.
8. **`CLAUDE.md` se edita por secciones puntuales, nunca se reescribe completo** (reescribir
   desde una copia vieja clobbea secciones de la otra ventana).

---

## 2. Modelo de datos compartido del paciente (fuente de verdad)

Un paciente es **UN** registro (activo en Sheet + espejo Firestore; migrado solo
Firestore). Campos relevantes:

### 2.1 Identidad / raíz
`id`, `name`, `nombreNormalizado`, `age`, `fechaNacimiento`, `telefono`, `sexo`,
`terapeuta`, `terapeutaSeguimiento`, `date`, `medicoReferente`, `creadoPor`,
`fechaCreacion`, `fechaActualizacion`, `ultimoUsuario`, `historialCambios`, `updatedAt`.

### 2.2 Episodio vigente (lesión en curso) — campos raíz
- `motivoConsulta` (string), `motivo` (objeto: `padecimiento`, `mecanismo`, `zonaPrincipal`,
  `lado`, `desdeCuando`, `evolucion`, `dxMedico`…), `motivoHC`.
- `valoracion` (objeto): `eva`, `rom`, `fuerza`, `pruebasEspeciales`, `palpacion`, `marcha`,
  `inflamacion`, `flex`, y la **lente dermatofuncional** `valoracion.dermato` (ver CLAUDE.md).
- `dxFuncional` (objeto): `dxFuncional`/`dxClinico`, `objetivosCP`, `objetivosLP`,
  `pronostico`, `limitaciones`, … ← **lo escribe la Ventana B (generador V2.2.1).**
- `planTto` (objeto): `enfoqueTerapeutico`, `contraindicaciones`, `protocolo`
  (`{id,fase,fechaGuardado,guardadoPor}`), objetivos, sesiones.

### 2.3 Episodios anteriores (motivos cerrados)
- `motivosAnteriores[]`: snapshots de episodios cerrados (motivo+valoracion+dxFuncional+
  planTto de ESE episodio).
- `motivoActualIndex` / `motivoActual` + `numSesionEpisodioActual`: índice y numeración del
  episodio vigente.
- Cada nota SOAP lleva `motivoIndex` / `numEpisodio` para no mezclar lesiones.

### 2.4 Notas clínicas (SOAP)
- Activos: `p.soap[]` (Sheet) + espejo vivo en Firestore `app_live_<hash>` / `sesiones`.
- Migrados: subcolección `sesiones` del doc.
- Estructura S/O/A/P + `evaI`/`evaF` + `modalidades` + media. **Append-only.**

### 2.5 Biomecánica (ROM/goniómetro/marcha/sentadilla)
- `p.biomecanica[]`: cada sesión `{id, tipo:'gonio'|'rom'|'sentadilla'|'marcha',
  fecha, medidas:[{etq,articulacion,mov,lado,metodo,unidad,grado,ok,validado,eliminado,
  traza}], video, imagenes, calidad:{algoVersion,…}}`.
- Los **grados del goniómetro** se escriben además en `valoracion.rom` (campo clínico que
  ya sincroniza y sale en reportes).
- Sync cross-device por vía dedicada `_syncBiomecanicaFS` (transaccional). Regla
  `pacienteClinicoUpdateOK` ya incluye `'biomecanica'`.

### 2.6 Fuerza muscular (escala comparativa 0–10 de la clínica)
- **Escala propia 0–10**, el lado **sano / referencia válida = 10/10**. **No** se usa
  Daniels/MRC.
- El resumen clínico vive en `valoracion.fuerza` (texto libre; **se conserva**).
- La captura estructurada propuesta por el rediseño es **aditiva**:
  `valoracion.fuerzaEval[]` (ver §4). No sustituye el texto libre ni los registros previos.

---

## 3. Matriz de propiedad (quién escribe qué)

| Dato | Ventana A (UX/UI) | Ventana B (dx V2.2.1) |
|---|---|---|
| Presentación/layout/estética | **Dueña** | respeta |
| SOAP (estructura visual, quick-nav) | **Dueña** (aditivo) | — |
| `valoracion.fuerzaEval` (captura 0–10) | **propone/edita** (aditivo) | lee |
| `p.biomecanica` + `valoracion.rom` | reusa motor, **no** toca fórmulas | lee |
| `dxFuncional.*` (texto del diagnóstico) | **solo presenta/edita** | **Dueña (genera)** |
| `planTto.*` | presenta/edita | puede proponer |
| Generador de diagnóstico | **no desarrolla** | **Dueña** |
| `firestore.rules` / backend `Codigo.gs` | propone, Carlos despliega | propone, Carlos despliega |

**Regla clave:** la Ventana A **no reimplementa** el generador de dx. Solo construye la
**presentación visual y la edición** del `dxFuncional` que la Ventana B produce, tratándolo
como un objeto de datos con una forma estable (§2.2).

---

## 4. Contrato del Diagnóstico funcional V2.2.1 (para que A lo presente sin romperlo)

La Ventana B es la única que **genera** el diagnóstico. La Ventana A lo **muestra y permite
editar**. Para que ambas encajen:

- El dx funcional vive en **`p.dxFuncional`** (episodio vigente) y se archiva en
  `motivosAnteriores[].dxFuncional` al cerrar el motivo.
- Forma mínima estable que A asume para presentar (todo opcional, A degrada si falta):
  `dxFuncional = { dxFuncional|dxClinico:string, objetivosCP:string, objetivosLP:string,
  pronostico:string, limitaciones:string, cie?:string, componentes?:[], version?:string,
  generadoPor?:string, fecha?:string }`.
- La Ventana A **no** inventa el contenido: si B añade campos nuevos (p.ej. `componentes[]`,
  `razonamiento`, `banderas`), A los presenta como texto/listas y permite editarlos como
  texto; **no** recalcula ni valida clínicamente.
- La edición desde A escribe de vuelta en `p.dxFuncional` por la ruta normal de guardado
  (`saveDB(..., {camposHist:['dxFuncional', ...]})`), preservando los demás campos con
  `Object.assign` (merge por campo, nunca reemplazo ciego del objeto).
- Si B cambia la forma, **lo anota aquí** (bump de versión del contrato) para que A se
  ajuste.

---

## 5. Protocolo de colaboración

1. **Este archivo es el puente.** Antes de un cambio que toque datos compartidos (SOAP,
   valoracion, dxFuncional, planTto, biomecanica), revisar §2–§4.
2. **Versionado del contrato:** si cambia la forma de un dato compartido, subir la versión
   de la cabecera y anotar el cambio en §6.
3. **La Ventana A entrega prototipos** (réplica offline + overlay) y **no fusiona** a
   producción sin autorización explícita de Carlos.
4. **Nada de PHI al repo** (el repo es público): reportes con nombres/datos de paciente van
   por `SendUserFile`, nunca committeados.

---

## 6. Bitácora de cambios del contrato

- **1.0 (2026-11-26):** versión inicial. Define modelo compartido, matriz de propiedad,
  contrato del dx funcional V2.2.1 y las reglas de oro. Creado por la Ventana A (rediseño
  UX/UI V1.1) como base de coordinación.
