# Fixes (h) e (i) — PREPARADOS PARA REVISIÓN (no en main, no desplegados)

**Fecha:** 2026-11-14 · Carlos pidió "prepara los 3 fixes para revisar... NO los aplico hasta tu OK".
**Resultado:** de los 3 candidatos, **(j) resultó ya cubierto** → se prepararon **2 fixes reales: (h) y (i)**.
Están en la rama `claude/medidor-correcciones-auditoria`. **No se mergearon a main ni se desplegó nada**
(sin bump de `sw.js`/`APP_VERSION`). Esperan OK de Carlos para el punto 5.

## Por qué (j) NO necesita fix
La marcha con `orientPerfilOK:false` YA marca `confiable:false` en TODAS sus medidas (el gate de ángulo exige
`orientOK!==false`, `medidor-biomecanico.js:741`) y muestra el aviso "⚠️ La toma no se vio DE PERFIL…" (`:1795`).
El valor crudo 97.6° se conserva pero se renderiza con "baja conf.". Correcto como está.

## Fix (h) — goniómetro: marcar "(revisar)" fuera de rango (posible escorzo 2D)
Helper puro `_gonioFueraRango(m)` = `grado != null && ref != null && !defic && !hiperext && grado > ref + 15`.
Se engancha en `_gonioAlerta` (devuelve alerta) y `_gonioFmtGrado` (añade " (revisar)"). Se computa de los
campos ya guardados (`grado`/`ref`) → **aplica retroactivamente a sesiones viejas** (incluida la de Dafne).
No borra el número; lo señala en ámbar. Umbral ref+15°.

**Evidencia contra los datos reales de Dafne (ficticio):**
```
cad_ext izq 19.8° (ref30)  -> 20°                       (en rango, sin marca)
rod_flex der 106.1° (ref135) -> 106° [ALERTA]           (alerta "limitada" pre-existente, <lim)
rod_flex izq 114.3° (ref135) -> 114° [ALERTA]           (idem pre-existente)
rod_flex der 172.6° (ref135) -> 173° (revisar) [ALERTA] ← (h) lo marca
cad_flex izq 129.3° (ref120) -> 129°                    (borderline <ref+15 → NO marcado, correcto)
cad_ext der 160.1° (ref30)  -> 160° (revisar) [ALERTA]  ← (h) lo marca
```
Solo los 2 imposibles quedan "(revisar)"; el borderline 129.3° se deja limpio.

## Fix (i) — ROM de brazos: piso de visibilidad en `confiable`
`_romConfiable(reps, muestras, visPct)` = `reps>=1 && muestras>=12 && visPct>=25`. Antes era solo
`reps>=1 && muestras>=12` (`:382`, ignoraba `visPct` aunque lo calculaba en `:381`). Solo BAJA confiable.

**Evidencia contra los datos reales de Dafne — medidas que pasan de `confiable:true` → `false`:**
```
hombro_flex_izq 128°  muestras 19  visPct 10%
hombro_abd_izq  179°  muestras 29  visPct 16%   (≈saturación 180° a baja visibilidad)
hombro_abd_der  168°  muestras 16  visPct  9%
hombro_ext_izq  174°  muestras 12  visPct  8%   (el caso del análisis)
hombro_flex_izq 147°  muestras 26  visPct 19%
hombro_ext_der  168°  muestras 20  visPct 14%
```
Las 6 son de visibilidad 8–19% (mal vistas) → correctamente dejan de ser "confiables".

## Diff (medidor-biomecanico.js, 16 ins / 3 del)
Ver `git diff caeebbb..HEAD medidor-biomecanico.js`. Resumen: +`_romConfiable` (L358) y su uso (L386);
+`_gonioFueraRango` (L2381) y sus 2 enganches (L2388 fmt, L2394 alerta); +exports en `__BIO_GONIO`/`__BIO_TEST`.

## BIO_ALGO_VER — NO se bumpeó (a propósito)
`BIO_ALGO_VER` sella cómo se CALCULÓ el grado; (h)/(i) no cambian la geometría del cálculo (el número medido es
idéntico), solo el etiquetado/gate de confianza. Queda en `bio-2d-2026-11-14b`. Si Carlos prefiere bumpear para
marcar el cambio de presentación, es trivial.

## Puertas (sobre el estado con (h)+(i))
- `node --check medidor-biomecanico.js` OK · `node --check sw.js` OK.
- `pruebas/datos-sospechosos.test.js` (NUEVA) → **19 OK, 0**.
- Suites CONGELADAS intactas: geometria 23/0 · verificacion-auditoria 18/0 · fase 44/0. **Total 104 asserts, 0 fallos.**
- Suites existentes NO editadas (solo se agregó un archivo de pruebas nuevo + exports aditivos a los hooks).

## Qué falta para desplegar (punto 5) — bloqueado
1. OK explícito de Carlos a (h)+(i).
2. Confirmación de la sesión slow-mo (ver más abajo / chat): la que ejercita el salvaguarda es la marcha
   `bm_p1781814958552_1794670219101` (`video-sin-confirmar` → temporales `confiable:false`); sus ángulos
   salieron `confiable:false` por tener 1 solo ciclo (`nCic>=2` aparte), no por el tiempo. Falta, si Carlos
   quiere la demostración limpia "tiempos no fiables + ángulos fiables", una slow-mo con ≥2 ciclos.
3. Entonces: merge a main + bump doble `sw.js`/`APP_VERSION` + ignore de `pruebas/`/`ejemplos/`/`PENDIENTES.md`/
   `auditoria/`/`validacion/` en `firebase.json`.
