# Procedimiento de reversión — Rediseño V2 (capa de presentación)

> El rediseño V2 es **100 % aditivo** y vive en archivos propios bajo
> `redesign-v2/integration/`. **No modifica `index.html` de producción**, ni
> funciones, datos, persistencia, reglas, `sw.js`, `manifest`, `firebase.json`
> ni `medidor-biomecanico.js`. Por eso la reversión es trivial y total.

## Estado actual (rama `claude/redesign-ux-ui-v2`)
- `index.html` de producción = **byte-idéntico a `main`** (`230815b8…`). No se ha
  tocado. El reskin se prueba en una **réplica aislada** que genera el harness.
- Archivos NUEVOS del rediseño (no servidos por la app real):
  - `redesign-v2/integration/sinergia_v2.css.tpl` (plantilla)
  - `redesign-v2/integration/sinergia_v2.css` (generado, emblema incrustado)
  - `redesign-v2/integration/gen_css.py` (generador)
  - `redesign-v2/integration/build_v2.py` (hornea en réplica)
  - `redesign-v2/integration/cap.mjs` (capturas antes/después)
  - `redesign-v2/integration/*.md` (gobernanza)

## Revertir TODO antes de cualquier integración
Como `index.html` no cambió, **no hay nada que revertir en producción**. Para
descartar por completo el rediseño:
```
git checkout main            # o: git branch -D claude/redesign-ux-ui-v2
rm -rf redesign-v2/integration
```

## Si en el FUTURO se autoriza integrar al `index.html` real
La integración añadiría **2 líneas** al `index.html` real (un `<link>` y, si
aplica, un `<script defer>`), justo antes de `</head>` / `</body>`, entre
marcadores:
```html
<!-- ===== SINERGIA V2 · RESKIN (capa de presentacion, aditiva) ===== -->
<link rel="stylesheet" href="sinergia_v2.css">
<!-- <script src="sinergia_v2.js" defer></script>  (si el módulo lo requiere) -->
<!-- ===== /SINERGIA V2 ===== -->
```
**Revertir esa integración** = borrar ese bloque (y, si se quiere, los archivos
`sinergia_v2.css`/`.js` servidos). Nada más. La app vuelve exacta a `main`.

### Reversión en caliente (sin redeploy), si algún día está en vivo
El reskin es solo un `<link>`. Se puede **desactivar sin tocar la lógica**:
1. Quitar la línea del `<link>` y volver a publicar (cambio mínimo), **o**
2. Bump de `sw.js` sirviendo un `index.html` sin esa línea.
No hay estado persistido por el reskin; no deja rastro en datos ni en caché de
pacientes. Un refresh con el `<link>` ausente restaura la apariencia original.

## Verificación de que no se tocaron expedientes
- El reskin es CSS/JS de presentación: **no escribe a Firestore/Sheet/Storage**,
  no llama `saveDB`, no toca colas de sync. 0 rutas de guardado tocadas.
- La réplica de pruebas corre con un **stub de Firebase sin red** y datos
  sintéticos: es imposible que escriba a una base real.
- Comprobación: `grep -n "saveDB\|firestore\|claudeFsMerge\|localStorage" redesign-v2/integration/sinergia_v2.css*` → 0 coincidencias de escritura.
