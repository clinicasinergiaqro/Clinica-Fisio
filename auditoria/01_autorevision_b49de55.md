# Punto 1 — Auto-revisión de `b49de55` (fix cross-device)

**Fecha:** 2026-11-14 · **Auditor:** Claude (Opus 4.8), auto-revisión.
**Veredicto:** LIMPIO. Los 3 riesgos que marcó el prompt están descartados con evidencia de código.

## 1. Alcance del tramo no auditado

`6d8b13d → b49de55` = 2 commits:
- `b494dfa` docs(PENDIENTES): **solo** `PENDIENTES.md` (4 ins / 1 del). Trivial, sin riesgo.
- `b49de55` fix: `index.html` (+10/−3) y `medidor-biomecanico.js` (+3/−1). Neto ~9 líneas de lógica.

Suites CONGELADAS: `git diff --stat 6d8b13d b49de55 -- pruebas/` = **vacío** → ningún assert tocado.

## 2. Diff del fix (verbatim)

**`medidor-biomecanico.js` — `renderPestana(p)` (≈L2896):**
```diff
-    try{ if(... window._syncBiomecanicaFS ... && p && Array.isArray(p.biomecanica) && p.biomecanica.length){ window._syncBiomecanicaFS(p); } }catch(e){}
+    // corre SIEMPRE, aunque este equipo NO tenga mediciones locales
+    try{ if(... window._syncBiomecanicaFS ... && p){ if(!Array.isArray(p.biomecanica)) p.biomecanica=[]; window._syncBiomecanicaFS(p); } }catch(e){}
```
Antes el pull a la nube solo corría si el equipo YA tenía mediciones locales
(`&& p.biomecanica.length`) → un equipo con 0 locales nunca jalaba lo de otros.

**`index.html` — `_syncBiomecanicaFS` dentro de `if(_hayNuevas)` (≈L17570):**
```diff
-      if(_hayNuevas && typeof saveDB==='function' && !_bmSaveDeferPend[p.id]){
-        _bmSaveDeferPend[p.id]=true;
-        setTimeout(function(){ delete _bmSaveDeferPend[p.id]; try{ saveDB('pts',[p]); }catch(_e){} }, 1500);
+      if(_hayNuevas){
+        if(typeof saveDB==='function' && !_bmSaveDeferPend[p.id]){
+          _bmSaveDeferPend[p.id]=true;
+          setTimeout(function(){ delete _bmSaveDeferPend[p.id]; try{ saveDB('pts',[p]); }catch(_e){} }, 1500);
+        }
+        // REPINTAR: el pull trajo sesiones de otro equipo; la pestaña ya se pintó "Sin mediciones"
+        try{ if(currentPatient && currentPatient.id===p.id && document.getElementById('content-expediente') && typeof renderExpediente==='function'){ renderExpediente(currentTab || 'biomecanica'); } }catch(_e){}
       }
```

## 3. Puertas (corridas sobre el estado `b49de55`)

- `node --check medidor-biomecanico.js` → OK
- `node --check sw.js` → OK
- `pruebas/geometria.test.js` → **23 OK, 0 fallidas**
- `pruebas/verificacion-auditoria.test.js` → **18 OK, 0 fallidas**
- Suites de fase: tiempo-verificado 9/0 · procedencia-estado 9/0 · validez-puntos-medios 8/0 · gen-identidad 5/0 · reanalisis-video 5/0 · comparador-honesto 5/0 · trayectoria-fondo 3/0 → **44/0**.
- Total: **85 asserts, 0 fallos**. (Salida cruda en `evidencia/puertas_b49de55.txt`.)

## 4. Los 3 riesgos del prompt

### (a) Doble render / carrera con el saveDB diferido → DESCARTADO
- El re-render (`renderExpediente`) vuelve a correr `renderPestana` → `_syncBiomecanicaFS`. En esa 2ª pasada `p.biomecanica` **ya** contiene las sesiones fusionadas (línea `p.biomecanica = fusionFinal`), por lo que `_idsAntes` las incluye todas → `_hayNuevas=false` → **no hay 3er render ni nuevo saveDB diferido**. Bucle acotado a 1 render extra (lo dice el comentario y se verifica en el código).
- Costo real: 1 transacción Firestore extra por pull (idempotente: la fusión da el mismo resultado). Es una ineficiencia menor, no un bug.
- `saveDB` **no** llama a `_syncBiomecanicaFS` (verificado: el cuerpo de `saveDB` solo normaliza `p.biomecanica`, no sincroniza) y `biomecanica` **no** está en el whitelist del espejo de historia (`_persistirHistoricoFirestore` outCl/outEj; comentario L17529) → el saveDB diferido persiste biomecánica **solo a local** (localStorage/IDB, intención de P2-14) y **no re-dispara** el sync. Sin carrera que pierda datos.
- Convergencia: si un 3er equipo sigue agregando sesiones, cada pull trae novedad y repinta; converge en cuanto deja de entrar data nueva. No es bucle sobre data estática.

### (b) Pérdida de local-only si la nube llega vacía → DESCARTADO
- `bmR = (snap.exists && snap.data()) ? data().biomecanica : null`. Si el doc no existe o no trae biomecánica → `bmR=null` → `_fusionarBiomecanica(p.biomecanica, [])` = **local intacto**.
- `_fusionarBiomecanica` es UNIÓN (concat local+remoto, dedup por id, tombstone gana), **nunca** reemplazo. `p.biomecanica = fusionFinal ⊇ local` siempre.
- El fix **no tocó** `_fusionarBiomecanica`. La normalización nueva `if(!Array.isArray(p.biomecanica)) p.biomecanica=[]` solo garantiza que sea array; no descarta nada.
- La transacción atómica (H3) protege contra la carrera read-modify-write entre dos equipos guardando a la vez.

### (c) Repintado pisa el overlay a media medición → DESCARTADO
- `#bio-overlay` se crea con `document.body.appendChild(ov)` (medidor-biomecanico.js L1021) y es `position:fixed;inset:0;z-index:12000` (L879). **No es hijo de `#content-expediente`.**
- `renderExpediente(tab)` solo reemplaza el subtree de `#content-expediente`, que queda **detrás** del overlay. El overlay (y su `<canvas>`/`<video>`/estado MediaPipe en closure + DOM persistente) **no se toca** → la medición en curso sobrevive.
- `construirOverlay()` hace early-return si `#bio-overlay` ya existe → el overlay persiste entre renders; nunca se recrea ni se borra por un re-render del expediente.
- Cuándo puede dispararse el repaint con overlay abierto: al guardar (`_persistirSesion` llama `await _syncBiomecanicaFS`, L1610) o al borrar (`BIO_eliminar`, L3365). En ambos el overlay está arriba (body, z12000) → el refresco del expediente por debajo es inocuo y además deseable (al cerrar, el usuario ve la lista fresca). Solo ocurre si de verdad llegó data de otro equipo (`_hayNuevas`), no en cada guardado (la sesión recién guardada ya está en `_idsAntes`).

## 5. Barrido de clase (reportado, NO aplicado)

Clase = "repintar el expediente desde un callback async de sync FS". Otros sitios:
- `index.html` L12447 — estudios re-sube fotos locales y hace `renderExpediente('estudios')` desde un `.then`. **Pre-existente**, mismo patrón de guarda (`currentTab==='estudios'`). No tiene un overlay de captura fullscreen persistente equivalente al medidor (usa inputs de archivo / scanner), así que el riesgo (c) no aplica igual. No se toca.
- `_syncEstudiosDocsFS` (L17500) — hermano del sync de biomecánica (unión + tombstone), pero **no** fuerza repintado cross-device al abrir; la pestaña Estudios relee en vivo con `FST_renderEstudiosApartado`. Mecanismo distinto, sin defecto observado.
- No se encontró otro sync que repinte con un overlay fullscreen de por medio. El patrón introducido por `b49de55` es único y acotado.

## 6. Conclusión

`b49de55` es un fix pequeño, correcto y seguro: amplía el disparo del pull a equipos sin
mediciones locales y repinta la pestaña cuando llega data de otro equipo, sin perder
local-only (unión manda), sin bucle (converge por `_hayNuevas`) y sin pisar el overlay
(fixed, body-level). Puertas 85/0. **Apto para incluir en el deploy** una vez cumplidos
los otros bloqueadores del punto 5 (prueba slow-mo aprobada + OK de Carlos).
