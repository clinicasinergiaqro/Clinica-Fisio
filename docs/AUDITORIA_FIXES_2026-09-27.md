# Fixes de la auditoría maestra — 2026-09-27

Referencia: auditoría maestra (9 dominios). Este documento registra qué se arregló y qué queda pendiente de tu parte.

## 1) Frontend — YA en producción (tras merge a main)
Estos van solos por el deploy de GitHub Pages/Firebase Hosting. Requieren un refresh del PWA (se hizo bump de `sw.js` → `sinergia-shell-v1-2026-09-27a`).

- **CRÍTICO — SOAP de históricos ya no se oculta.** `FST_renderCard` (index.html ~485): una nota estructurada con `s.dolor` vacío se pintaba como "NOTA IMPORTADA" y escondía el S/O/A/P. Ahora se trata como texto libre solo si NO hay ningún campo S/O/A/P con contenido.
- **CRÍTICO — Borrar un activo lo tombstonea de verdad.** `_borrarPaciente` (~16423) ahora marca `eliminado:true` en `pacientes/.doc(pid)` (no solo en el set en memoria) y `_restaurarDesdePapelera` (~16505) lo desmarca. Cierra la reaparición de borrados por fail-open. **Hacer antes del flip 3c-b.**
- **CRÍTICO — Sin clobber al "Editar datos".** `_persistirDatosPaciente` rama activo (~15534) ahora guarda con `camposHist` de SOLO identidad → el Sheet mergea por columna y el espejo a Firestore no toca los clínicos.
- **XSS almacenado cerrado.** `renderEjercicios`: se escapan nombre/fecha/terapeuta/indicaciones/precauciones/dosis/label y el `src` de media (la vista pública ya escapaba; la del terapeuta no).
- **Rendimiento arranque.** Barra de supervisor: `_countRevaloraciones()` se calcula una sola vez (antes 2×).
- **Link público más seguro.** `rutina.html` con `<meta name="referrer" content="no-referrer">` (el token dejaba de filtrarse por `Referer`); `generateToken` usa `crypto.getRandomValues` y "Ver como paciente" usa la misma función (antes `Math.random`).
- **Completitud.** "Datos personales" pasa de `bad` (penalizaba a TODOS por la sección de consentimiento en pausa) a `info` cuando no está aceptado.

## 2) Backend `config/Codigo.gs` — EN EL REPO, requiere que TÚ despliegues
El código ya está en el repo, pero **Apps Script sigue sirviendo el deploy viejo hasta que hagas "Implementar → Gestionar implementaciones → Editar → Nueva versión"**. Verifica con `claudePing` (marca de build).

- **`deletePaciente` y `deleteTestQA*` ahora exigen rol supervisor** (antes cualquier terapeuta borraba por id).
- **`CLAUDE_TOKEN` ya no se guarda en claro en Drive** (`claude_token.txt`). Al desplegar, **rota el token** ejecutando `generarTokenClaude` una vez y copia el nuevo token del Logger (ya no queda en Drive). Actualiza donde lo consuma la conexión.
- **Id de modelo de IA centralizado** en `MODELO_IA` (antes duplicado en `generarSoapIA`). ⚠️ **VERIFICA que `MODELO_IA = 'claude-sonnet-4-6'` sea un modelo vigente de la API**; si no lo es, TODA la IA (dictado, SOAP-IA, estudios, síntesis) falla.
- **PHI a Anthropic minimizada:** ya no se envía el nombre del paciente en `interpretarEstudioIA` ni en `generarSintesisIA_` (solo edad/datos clínicos). Igual que ya hacía SOAP-IA.

## 3) Backend recomendado — NO aplicado (requiere tu revisión, no lo pude probar aquí)
- **LockService en las rutas `claude*` de escritura y en `deletePaciente`** (hoy solo `savePacientes` toma el lock). Envolver el read-modify-write en `LockService.getScriptLock()` como en `savePacientes` para evitar clobber con guardados concurrentes.
- **CSV/fórmula injection:** sanitizar valores que empiezan con `= + - @` **al EXPORTAR CSV** (no al escribir al Sheet, o corromperías el round-trip JSON). El export es cliente (pestaña Supervisión).
- **`repartirSoap_`:** poner tope al `chunk3` (hoy sin límite) o desviar SOAP grande a Firestore, para no perder guardados por el límite de 50 000 chars/celda.
- **`claudeGetArchivo`:** acotar el path a `clinica/sinergia/` (hoy puede descargar cualquier objeto del bucket con el token).
- **`validarFirebaseIdToken`:** verificar `email_verified` si Firebase Auth permite auto-registro (por confirmar).

## 4) Reglas (`firestore.rules` / `storage.rules`) — NO aplicado (riesgo de romper acceso)
- **Delete físico de paciente** (`firestore.rules:139`): borra el doc raíz con campos clínicos. Implementar flag durable `esTest` + backfill y restringir `delete` a solo docs de prueba; el resto, solo borrado lógico.
- **`create` de paciente sin validador** de esquema (añadir `keys().hasOnly(...)` como en `sesionCreateOK`).
- **Least-privilege de lectura** (todo terapeuta lee todo): evaluar scoping por terapeuta o monitoreo.

## 5) Decisiones tuyas (no son "mover código")
- **PHI por correo** a `lftaranda@gmail.com` (Gmail personal) con el aviso legal aún sin revisar: mover a buzón de dominio con 2FA o cifrar el PDF; alinear con LFPDPPP.
- **"Todos ven todo"**: documentarlo como aceptado o segmentar PHI por terapeuta.
- **Re-auth al entrar offline** (o política de "equipo personal" firmada).
- **Logo del manifest** servido desde Storage → moverlo a un asset del propio origen (el bucket ya está privado; solo el logo es público a nivel objeto).
- **Roster de roles en 4 capas**: automatizar la sincronización (script/CI que falle si divergen).
- **Retención NOM-004** de `papelera/`/`revision/`/`borrados/`: definir/confirmar periodo (≥5 años) y que nadie purgue.
- **Disparo de reportes**: migrar a trigger time-driven de Apps Script (hoy depende de que abras la app vie/lun ≥8am) y consultar el dedup antes de recalcular 61 días.

## 6) Pendientes menores (frontend, no aplicados — bajo valor / requieren diseño)
- FST: no descartar por nombre en la fusión de lista (oculta homónimos) — cambia comportamiento visible, decide primero.
- EVA por slider con default 5 en el editor por sección (distinguir "no valorado").
- Normalizar opcionales `[pendiente]` → cadena vacía (tiene efecto en completitud, revisar).
- Código muerto (`_reporteFaltantesHTML`, `_agendaCitaSinHoraHTML`) — no se ejecuta; limpiar cuando toque.
- Bug de conteo del panel QA (`TEST_QA_` vs `TEST QA`).
- Re-pintar el badge "Revalorar (N)" tras resolver en el modal.

## 7) Verificado en consola (no requiere acción)
- **Bucket de Storage privado**: prueba directa → 403 en toda ruta `clinica/sinergia/` inexistente, 403 en raíz y listado. La PHI en Storage no está expuesta públicamente. El logo es público solo a nivel de objeto.
