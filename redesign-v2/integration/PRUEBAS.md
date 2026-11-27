# Resultados de pruebas — Rediseño V2 (reproducibles)

Tres niveles, claramente distinguidos (como pidió la revisión):
**visuales** · **funcionales aisladas** · **pendientes con dispositivo/backend de pruebas**.

---

## 1) Suites existentes del repositorio (motor biomecánico y lógica) — Node puro
```
for f in pruebas/*.test.js; do node "$f"; done
```
**Resultado: 12 / 12 OK, 0 FAIL.** El reskin es CSS/JS de presentación y **no toca**
estos módulos (viven en `index.html`/`medidor-biomecanico.js` por lógica, no por estilo).

| Suite | Estado |
|---|---|
| comparador-honesto · datos-sospechosos · gen-identidad · geometria · gonio-muneca-metacarpiano · goniometro-techo · procedencia-estado · reanalisis-video · tiempo-verificado · trayectoria-fondo · validez-puntos-medios · verificacion-auditoria | ✅ 12/12 |

## 2) Prueba FUNCIONAL de equivalencia (app real vs reskineada) — Playwright
```
python3 redesign-v2/integration/build_v2.py      # genera replica (ORIG) y replica_v2 (RESKIN)
node     redesign-v2/integration/equiv_test.mjs   # -> scratchpad/audit/equiv_result.json
```
Interactúa por **controles reales** y **afirma con assertions** (no solo capturas):
- funciones originales **existen y ejecutan** (login: `doLogin/togglePassVer/recuperarPass/entrarModoOffline_`; SOAP: `renderSOAPForm/guardarSOAP/guardarBorradorSoap/guardarDescarga/_toggleNuevoMotivoSoap`; expediente: `openExpediente/renderExpediente`);
- el control real **“ver contraseña” alterna el tipo** (ejecuta el handler real);
- **agenda** puebla `patientsDB` y rinde tarjetas; **expediente** abre con `currentPatient` correcto, **navega pestañas** y el **dato dx no se altera**; **SOAP** abre con sus **campos reales** (`f-sdolor`) alcanzables;
- **0 errores JS inesperados** (cualquier `pageerror` reprueba);
- **bloqueo + detección de red**: toda conexión externa se **aborta y registra**; un intento a un servicio **CLÍNICO/backend** (Firebase/Firestore/Apps Script/Sheets/Storage) **reprueba**.

**Resultado (último run):**

| | Assertions | pageerrors | Conexiones CLÍNICAS | Externas bloqueadas |
|---|---|---|---|---|
| ORIGINAL (sin reskin) | **21 / 21 OK** | 0 | **0** | 4 (libs 3os) |
| RESKIN (V2) | **21 / 21 OK** | 0 | **0** | 4 (libs 3os) |

- **PARIDAD FUNCIONAL: IDÉNTICA ✓** — el reskin no cambió ninguna función.
- **Logo accesible** en reskin: `alt="Clínica Sinergia — Fisioterapia y Rehabilitación"` (en el original el emoji 🫀 no tiene `<img>`).
- **Externas bloqueadas** (NO datos clínicos; la app degrada offline): `cdnjs.cloudflare.com`, `cdn.jsdelivr.net`, `docs.opencv.org` (pdf.js, jsPDF, OpenCV, cargadas al abrir SOAP/biomecánica). **Ningún** intento a Firebase/Firestore/Sheets/Apps Script.
- **RESULTADO GLOBAL: APROBADO ✓**

> El stub de Firebase evita credenciales; **además** la prueba impone a nivel de **red**
> que no exista conexión clínica (no depende solo del stub). **No** se afirma que la
> autenticación/persistencia/sincronización reales estén verificadas: eso es pendiente
> con backend de pruebas (nivel 3).

## 3) Pruebas visuales (capturas)
```
node redesign-v2/integration/cap.mjs       <replica> <out> <sufijo> [ancho]   # login/agenda/directorio
node redesign-v2/integration/cap_deep.mjs  <replica> <out> <sufijo> [ancho]   # expediente/valoración/SOAP/alta
```
Antes/después a 360/390/430 px (y 1280 desktop). **0 `pageerror`** en todas.
Comparativas en `scratchpad/audit/v2shots/CMP_*.png`.

## Pendientes (nivel 3 — dispositivo/backend de pruebas, no testeable headless)
- Teclado físico iOS/Android (foco de campos; barra de guardar sobre teclado).
- Cámara real / MediaPipe (biomecánica).
- **Guardado/auth/sync reales end-to-end** con backend de **pruebas** (activo y migrado), con verificación de integridad.
- Instalación PWA (icono/splash/maskable); rendimiento en equipos antiguos; orientación horizontal real.
