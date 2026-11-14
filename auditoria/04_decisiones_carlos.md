# Decisiones de Carlos — log (el chat es efímero; esto es la memoria)

## 2026-11-14

1. **Las 3 sospechosas de misma clase** → "Prepara los 3 fixes para revisar" (sin aplicar a main/deploy).
   - Resultado: (j) ya estaba cubierto; se prepararon (h) y (i) en la rama. Commit `31241fa`. Puertas 104/0.

2. **Sesión slow-mo (bloqueador de deploy)** → "Esa cuenta — desbloquea".
   - Carlos acepta la marcha `bm_p1781814958552_1794670219101` (`video-sin-confirmar` → Temporal/Espacial
     `confiable:false`) como la validación del salvaguarda slow-mo, con captura real. Caveat registrado en
     PENDIENTES (e): sus ángulos cayeron por 1 solo ciclo, no por el tiempo. **Bloqueador LEVANTADO.**

3. **Deploy a producción (punto 5)** → "Aún no — reviso primero".
   - NO se mergea a main, NO se despliega. (h)+(i) quedan listos y revisables en la rama
     `claude/medidor-correcciones-auditoria` (commit `31241fa`), y el fix cross-device `b49de55` ya está
     auto-revisado (LIMPIO). A la espera de que Carlos revise los diffs y dé OK para el merge+bump+deploy.

### Estado para el próximo paso
- Listo para mergear en cuanto Carlos apruebe: `b49de55` (cross-device) + `31241fa` (h+i) + docs de auditoría.
- Al desplegar (punto 5): merge a main + bump doble `sw.js`/`APP_VERSION` + `ignore` de
  `pruebas/`,`ejemplos/`,`PENDIENTES.md`,`auditoria/`,`validacion/` en `firebase.json` + reporte
  hash/Action verde/SHA-256 del módulo servido vs HEAD mergeado.
- Punto 3 (pares vs goniómetro físico): `validacion/pares_goniometro.csv` listo; esperando que Carlos dicte pares.
