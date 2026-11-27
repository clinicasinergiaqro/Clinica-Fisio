# SINERGIA — Rediseño V1.1 · Pruebas (ejecutadas vs pendientes)

Entorno de prueba: **réplica offline** (app real + Firebase/backend neutralizados + 6
pacientes sintéticos), automatizada con **Playwright** (Chromium headless). "0 errores"
= 0 `pageerror` durante la interacción. El prototipo **no** escribe en ninguna base real.

---

## ✅ Ejecutadas (pasaron)

### Navegación y carga
- **Arranque + render** de las 8 pantallas (Agenda, Pacientes, Expediente, Valoración,
  SOAP, SOAP·Nuevo motivo, Alta, Biomecánica) × **4 anchos** (390 / 1024 / 1440 / 1920) =
  **32 capturas antes** + **32 después**, **0 errores JS**.
- **Rail de escritorio** navega con las funciones reales (Agenda/Pacientes/Protocolos/
  Supervisión); Supervisión respeta el rol.

### SOAP mobile-first
- **Quick-nav S/O/A/P** se pinta y persiste tras re-render (se resuelve por clase, no se
  pierde al armar la rejilla S|O / A|P). Verificado en móvil y escritorio.
- **Barra de Guardar fija** visible en la pantalla SOAP y oculta al salir; su botón
  dispara el botón real `guardarSOAP()`.
- **Alerta de seguridad** permanece visible (sticky) con la quick-nav apilada debajo.

### Fuerza muscular 0–10
- **Captura interactiva** Región→Músculo→Valor→Lado→**Registrar**: escribe
  `Cuádriceps 8/10 der [ref: lado sano/control]` en el **campo real `f-ofuerza`**
  (lo preexistente se conserva). **0 errores.**
- **Comparativa y evolución** renderizan con datos de demo: Cuádriceps Der **7/10**
  (déficit 30%) vs Izq **10/10** (referencia), **asimetría 30%**, evolución **5→7 ▲+2**.

### ROM / Biomecánica
- **Importar histórica (FIX)**: abre el **selector** (no el medidor —
  `medidorAbierto:false`), lista 4 mediciones, e **importar** escribe
  `[histórica] Flexión de rodilla 125° Derecho (09/11/2026)` en `f-orom`. **0 errores.**
- **Titular ROM**: prioriza goniómetro → **100°→125° (+25°, mismo mov./lado)** con
  miniatura de imagen anotada; pendientes marcadas aparte.
- **Guarda de borrador del SOAP**: se escribe en S y A, se simula un **re-render completo**
  (lo que hace el medidor al guardar) y **ambos campos se restauran**. **0 errores.**

### Nuevo motivo
- Al activar «¿Es un MOTIVO NUEVO?», aparece de inmediato el banner
  **«Nuevo episodio · Sesión 1 · pendiente de guardar · Episodio 2»** con la nota de que
  los antecedentes se conservan. **0 errores.**

### Resto de la app
- **Índice de apartados del Alta**: barra sticky con los apartados; salta a cada sección.
- **Dx funcional**: la tarjeta lee `p.dxFuncional` y presenta dx clínico/funcional +
  objetivos CP/LP + pronóstico + limitaciones + botón editar.
- **Directorio maestro-detalle (escritorio)**: al pasar el cursor por un paciente, el
  panel derecho muestra su resumen (dx, EVA/ROM/fuerza, objetivo, última nota) y los
  botones Abrir/Sesión. El clic sigue abriendo el expediente.
- **Activo = migrado**: la réplica incluye un paciente **migrado** (`mig_pac_…`); abre,
  lista y renderiza igual que un activo (mismas vistas/paneles).
- **Modo oscuro**: tokens del overlay remapeados bajo `body.modo-oscuro`.

### Guardado (simulado)
- La barra de Guardar y los botones usan el **flujo real** (`guardarSOAP`, `saveDB`) — en
  la réplica el guardado se **simula** (backend neutralizado), por lo que se verifica el
  **flujo** (que se dispara el botón real y se limpia el borrador), no la escritura en una
  base real.

---

## ⏳ Pendientes (requieren dispositivo/condiciones reales)

- **Teclado real en iPhone/Android**: el "flotar sobre el teclado" de la barra de Guardar
  se verificó por **lógica** (visualViewport) y en simulación de viewport, **falta**
  confirmarlo con teclado físico en Safari/iOS y Chrome/Android.
- **Cámara real / MediaPipe**: medir en vivo, capturar foto/video y validar ángulos usa el
  motor real, que **no** corre en el sandbox headless (sin cámara). Falta prueba en equipo
  con cámara (incluye la captura y la imagen anotada reales).
- **Guardado real end-to-end**: en la app real, confirmar que fuerza (`fuerzaEval`),
  mediciones (`biomecanica`/`valoracion.rom`) y nuevo motivo persisten por `saveDB` con la
  verificación de integridad, en activo **y** migrado. (En el prototipo se simula.)
- **Comparador biomecánico `BIO_comparar`** con datos reales multi-sesión del mismo
  episodio.
- **Reporte `BIO_pdf`** real (requiere html2canvas/jsPDF y datos reales).
- **Revisión visual humana** del modo oscuro y de la lente dermatofuncional en equipos
  reales.

---

## Cómo reproducir

```
python3 redesign/harness/build_replica.py      # réplica (app real + stub + seed)
python3 redesign/harness/build_redesign.py      # réplica + overlay = redesign/index.html
node scratchpad/audit/work/rcap_before.mjs      # capturas "antes"  -> shots/
node scratchpad/audit/work/rcap.mjs             # capturas "después"-> shots_rd/
```

Las pruebas funcionales (fuerza, importar, borrador, nuevo motivo) se corrieron con scripts
Playwright puntuales sobre `redesign/index.html`.
