# Protección de despliegue — Rediseño V2

> Regla dura: **NO fusionar a `main`. NO correr el workflow. NO desplegar a
> Firebase.** Nada llega a producción hasta que Carlos y ChatGPT aprueben.

## Cómo publica esta app (verificado)
- `.github/workflows/firebase-hosting.yml` **auto-despliega en cada push a `main`**
  (canal live) + permite ejecución manual (`workflow_dispatch`).
- `firebase.json` → `"public": "."` → **publica desde la raíz del repo**, con una
  lista `"ignore"`.

## ⚠️ Hallazgo: la carpeta del rediseño NO está ignorada por Hosting
`firebase.json` `"ignore"` hoy solo excluye `docs/**` (entre otros), **no**
`redesign-v2/**`, `redesign/**`, `scratchpad/**`, `prueba*/**`.

**Implicación:** si esta rama se fusionara o se desplegara, el **prototipo,
stubs, datos sintéticos, scripts de prueba y docs internos de `redesign-v2/`
quedarían publicados** en el sitio (aunque la app no los referencia). Es un
riesgo de exposición, no de función.

### Compuerta ANTES de cualquier integración autorizada (pendiente, no hacer aún)
Antes de servir el reskin desde la app real, en una propuesta aparte:
1. Mover **solo** los archivos servibles (`sinergia_v2.css`, y el emblema si no
   va incrustado) a una ruta pública estable (p. ej. raíz o `assets/`), y
2. Añadir a `firebase.json` `"ignore"`:
   ```json
   "redesign-v2/**", "redesign/**", "scratchpad/**",
   "pruebas/**", "ejemplos/**", "auditoria/**", "validacion/**",
   "SINERGIA_*.md", "**/*.test.js"
   ```
   (varios ya convendría ignorarlos independientemente del rediseño).
3. Verificar con `firebase hosting:channel:deploy preview` (canal de PREVIEW, no
   live) que el sitio no incluye prototipo/stubs/datos sintéticos.

Hoy **no se hace** ningún cambio a `firebase.json` ni al workflow. Esto queda
documentado como requisito previo a la integración real.

## Checklist de no-regresión de despliegue (para la futura integración)
- [ ] `index.html` servido NO contiene stub de Firebase ni seed sintético
      (eso solo vive en la réplica de pruebas del harness).
- [ ] `sw.js` SHELL incluye el nuevo CSS (y el emblema si es archivo) para que
      el reskin funcione offline; bump de caché.
- [ ] `firebase.json` ignora prototipo/pruebas/datos sintéticos.
- [ ] Preview channel revisado; recién entonces, y con aprobación, `main`.
