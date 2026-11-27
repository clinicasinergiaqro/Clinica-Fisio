# Sinergia — Versión de PRUEBA (rediseño V2) + propuesta de backend de pruebas

> Documento de la rama `claude/redesign-ux-ui-v2`. NO toca producción, NO se despliega,
> NO se fusiona. PR #603 permanece en **borrador**.

## 1) Qué es esta versión de prueba

- Es el `index.html` REAL de la app (la rama **no introdujo ningún cambio** en `index.html`/
  `sw.js`; queda 1 commit por detrás de `main` — el fix #604 del banner, ajeno al diseño) con **solo** la capa visual
  encima: `sinergia_v2.css/js` + `sinergia_fidelidad.css/js` (código de ChatGPT, sin modificar).
- Corre con un **stub de Firebase falso** y **pacientes ficticios** incrustados en la página:
  todo vive en memoria. **No se conecta a ninguna base clínica real** (ni Sheet, ni Firestore,
  ni Storage). La página incluso **intercepta** cualquier intento de llamar a
  `googleapis.com / gstatic.com / script.google.com` → cero fugas.
- Sirve para **ver y tocar** el nuevo diseño en todos los módulos. Lo que NO guarda de verdad:
  no persiste notas, no sube fotos, no manda WhatsApp, no exporta PDF/descargas
  (el visor de la página no permite descargas; es un demo visual).

**Enlace de la prueba:** https://claude.ai/artifact/QBTw3vAiXdAAnbSK2hp6Mx

## 2) Procedimiento MÁS SIMPLE para abrirla desde el iPhone

1. Abre el enlace de arriba en **Safari** del iPhone (toca el enlace o pégalo).
2. Espera ~2 segundos: arranca solo en **Agenda** con pacientes de ejemplo.
3. Navega libremente: Pacientes → abrir expediente → pestañas, SOAP, 🦴 Biomecánica,
   📋 Protocolos, alta normal y alta 🧴 Dermato.
4. (Opcional) Para tenerla como “app” de prueba en la pantalla de inicio:
   botón **Compartir** de Safari → **Añadir a pantalla de inicio**.

**Para que la vean los fisioterapeutas:** el enlace es **privado** (solo tú lo abres hasta
que lo compartas). En la página, menú **Compartir** del artifact → dar acceso / copiar enlace,
y se los pasas por WhatsApp. Cada quien lo abre en su celular (Android o iPhone) igual que tú.

> Nota: esto es una **página de prueba alojada en claude.ai**, no tu dominio de Firebase.
> Es a propósito: así queda 100 % separada de producción y de la base real.

## 3) Los 7 puntos que pediste verificar — estado

| # | Punto | Estado |
|---|-------|--------|
| 1 | Biblioteca de **Protocolos** carga sin error | ✅ OK (el “error de carga” que viste era solo del PDF/`file://`; servida por web carga bien) |
| 2 | **Biomecánica** abre y conserva todas las herramientas | ✅ OK (módulo presente, 21 controles) |
| 3 | **Dermatofuncional**: alta y SOAP con la estética nueva | ✅ OK |
| 4 | **Estudios / recetas / ejercicios / reportes** funcionan igual | ✅ OK (abren sin error; la lógica es la misma de siempre) |
| 5 | **Icono oficial de Sinergia** al instalar en iPhone/Android | ✅ Intacto (ver abajo) |
| 6 | **Alertas de seguridad clínica** visibles | ✅ OK (en expediente y en SOAP) |
| 7 | El **teclado no tapa** campos ni botones | ✅ OK (botón “Ir a guardar nota” + barra de guardar alcanzable con teclado abierto) |

### Sobre el punto 5 (icono de instalación)
El rediseño **no toca** `manifest.webmanifest`, el `apple-touch-icon` ni el `theme-color`
(verificado: sin cambios vs `main`). El icono de instalación sigue siendo el **logo oficial de
Sinergia** (`logo_horizontal.png`) y el color de marca `#1B3A6B`. Es decir: en producción, el
icono de instalación queda **exactamente igual** que hoy. (En la versión de prueba alojada en
claude.ai el “añadir a inicio” usará el icono de esa página; el icono real de la PWA solo aplica
cuando se instala desde el dominio real de Sinergia, que no cambió.)

## 4) Propuesta de BACKEND de pruebas (NO implementado — solo propuesta)

Cuando quieras que la versión de prueba **sí guarde** (para que los fisios prueben capturar sin
riesgo), lo recomendable es un entorno espejo **separado** de la base clínica real:

**Opción recomendada — Proyecto Firebase de PRUEBAS independiente**
- Crear un proyecto Firebase nuevo, p. ej. `clinicasinergia-pruebas` (Firestore + Storage +
  Auth propios, vacíos). **Cero conexión** con el proyecto real `clinicasinergia-ec2cf`.
- Un Google Sheet de pruebas aparte (copia de la estructura, sin pacientes reales).
- Publicar la versión de prueba en un **canal/hosting de pruebas** de ESE proyecto
  (p. ej. `clinicasinergia-pruebas.web.app`), nunca en el hosting de producción.
- Los fisios entran con usuarios de prueba; lo que capturen cae en la base de pruebas y se
  puede borrar sin tocar nada real.

**Aislamiento garantizado**
- Credenciales/reglas distintas → aunque alguien se equivoque, no puede escribir en la base real.
- Datos ficticios; se puede resetear el proyecto de pruebas cuando quieras.

**Qué falta para activarlo (lo harías tú / con tu visto bueno):**
1. Crear el proyecto Firebase de pruebas y pegar su `firebaseConfig`.
2. Un Sheet de pruebas + su backend Apps Script de pruebas (copia, sin datos reales).
3. Desplegar la versión de prueba a ese hosting de pruebas.

> Mientras tanto, la versión de prueba actual (sin backend, en memoria) ya sirve para revisar
> **todo el diseño** desde el celular y compartirlo con el equipo.

## 5) Gobernanza (sin cambios)
- `index.html` de producción **byte‑idéntico a `main`**.
- PR #603 en **borrador**. **No se fusiona ni se despliega.**
- Reversión: quitar los dos `<link>/<script>` de `sinergia_v2.*` y `sinergia_fidelidad.*`
  (ver `redesign-v2/integration/REVERSION.md`).
