# Integración visual V2 — reskin de la app REAL (aislado, sin regresiones)

Esta carpeta integra la **estética V2.0** sobre la **app real** (`index.html`)
como **capa de presentación aditiva**, no como app nueva. El prototipo
`redesign-v2/prototype/` queda solo como **referencia estética**; aquí se
reutilizan los **componentes y funciones reales**.

## Principio rector
- La **app real es la fuente de verdad funcional**. V2.0 es la referencia visual.
- El reskin es **CSS aditivo** (+ JS fino solo cuando un módulo lo exija): tokens,
  estilos, íconos, contenedores, reorganización y responsive de **elementos
  existentes**. **No** motor nuevo, **no** router, **no** esquema de datos nuevo,
  **no** valores clínicos por defecto, **no** datos sintéticos en la app real.
- **No** se toca: auth, offline, sync, persistencia/guardado, permisos, agenda/
  Calendar, alta/edición, historia, motivo, valoraciones, SOAP, borradores,
  dictado, descarga, nuevo motivo, numeración de sesiones, consentimientos,
  estudios/recetas/fotos, biomecánica (`medidor-biomecanico.js`), protocolos,
  ejercicios, reportes, supervisión, config, dermatofuncional.
- Colores de **seguridad clínica** (verde/rojo/ámbar) conservan su significado.
- **No merge, no workflow, no deploy.** Ver `PROTECCION_DEPLOY.md`.

## Archivos
| Archivo | Qué es |
|---|---|
| `sinergia_v2.css.tpl` | Plantilla del reskin (editable a mano) |
| `gen_css.py` | Genera `sinergia_v2.css` incrustando el emblema (base64, offline-safe) |
| `sinergia_v2.css` | CSS generado, **self-contained** (lo que se servirá algún día) |
| `build_v2.py` | Hornea el reskin sobre una **réplica** de la app real (efímera, en scratchpad) |
| `cap.mjs` | Capturas antes/después a 390 px (Playwright) |
| `REVERSION.md` · `MATRIZ_EQUIVALENCIA.md` · `PROTECCION_DEPLOY.md` | Gobernanza |

## Cómo construir y probar (aislado)
```
python3 redesign-v2/integration/build_v2.py
#  -> scratchpad/audit/replica     (app real, sin reskin  = "ANTES")
#  -> scratchpad/audit/replica_v2  (app real + reskin      = "DESPUÉS")

node redesign-v2/integration/cap.mjs "$PWD/scratchpad/audit/replica/index.html"    "$PWD/scratchpad/audit/v2shots" antes
node redesign-v2/integration/cap.mjs "$PWD/scratchpad/audit/replica_v2/index.html" "$PWD/scratchpad/audit/v2shots" despues
```
La réplica corre con un **stub de Firebase sin red** y **datos sintéticos**
(sin PHI); es imposible que escriba a una base real.

## Editar el reskin
Editar `sinergia_v2.css.tpl` → `python3 gen_css.py` → `build_v2.py` → `cap.mjs`.
Regla de oro de cada cambio: **que no mueva el layout** (cero reflow); el uplift
viene de color/tipografía/radio/sombra/espaciado/forma, no de ensanchar texto ni
ocultar datos.

## Progreso por módulos (orden §20)
- [x] Fundación + gobernanza · [x] 1 Login · [x] 2 Agenda/directorio
- [x] 3 Expediente (hero+curva+logo, mosaico de módulos) · [x] 4 Alta/historia · [x] 5 Valoración/SOAP (segmentado S/O/A/P)
- [x] 6 Biomecánica (skin genérico) · [x] 8 Estudios/Protocolos/Supervisión (skin genérico) · [~] 7 Dermato (lente rosa conservada; afinar)
- [x] 9 Dark + desktop (columna centrada, mosaico 3-col) · [x] 10 Pruebas (equiv 21/21 paridad idéntica + 12 suites) 
- Afinar: emojis restantes en algunos banners (⚠️🙌🎤), iconos propios Dermato/Ejercicios, PDF visual.

## Reconstruir capturas / réplica
```
python3 redesign-v2/integration/build_v2.py
node     redesign-v2/integration/cap.mjs      "$PWD/scratchpad/audit/replica_v2/index.html" "$PWD/scratchpad/audit/v2shots" despues
node     redesign-v2/integration/cap_deep.mjs "$PWD/scratchpad/audit/replica_v2/index.html" "$PWD/scratchpad/audit/v2shots" despues
node     redesign-v2/integration/equiv_test.mjs
```
