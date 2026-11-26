# Sinergia · Rediseño premium V2.0 — guía de revisión

Prototipo de rediseño **mobile-first** de Clínica Sinergia (expedientes de fisioterapia, PWA).
Rama independiente `claude/redesign-ux-ui-v2` · **NO fusionar** con `main` ni con la rama del generador clínico.

> **Es un prototipo para revisión visual y de UX**, con **datos 100 % sintéticos** (sin PHI).
> **No toca** producción, expedientes reales, persistencia, autenticación, acceso offline,
> sincronización ni algoritmos biomecánicos.

## Cómo abrirlo
Abre **`prototype/index.html`** en Chrome o Safari (en celular ocupa toda la pantalla).
Arranca en el **login demo** (correo/clave precargados) → *Iniciar sesión* → splash → **Agenda**.
Recorrido sugerido: Agenda → toca una cita → **Expediente** → **Valoración** / **SOAP**
(quick-nav S/O/A/P, fuerza 0–10, importar ROM, nuevo motivo, **Guardar**) →
abre a **Ana Torres** para la lente **dermatofuncional** → FAB «+» = **Alta** por apartados.

## Estructura
| Carpeta | Qué es |
|---|---|
| `prototype/` | SPA del prototipo: `index.html` (shell + sprite de íconos Lucide), `app.css` (sistema de diseño), `app.js` (router + pantallas + interacciones), `data.js` (datos sintéticos) |
| `directions/` | Las **3 direcciones visuales** a 390 px: `A_minimalista.html`, `B_tecnologica.html`, `C_editorial.html` + `Z_marca_login.html` (login oficial + estados de marca) |
| `brand/` | Kit de marca **oficial** optimizado por tamaño (vertical/horizontal/emblema/iconos 180–1024/maskable/favicon). Sin emoji de corazón |
| `docs/` | `SINERGIA_Design_System_V2.md`, `SINERGIA_Mapa_Campos_Antes_Despues.md`, `SINERGIA_Pruebas_UX_Regresion_V2.md` |

## Dirección elegida
**Base A (minimalista)** + **indicadores de B** (anillos/medidores/deltas) + **rigor tipográfico de C**,
unificado por el **lenguaje de marca del login oficial** (navy #122950 · dorado #C9A84C · fondo #F5F7FA · dermatofuncional #8E3B6E).

## Qué revisar (prioridad)
1. **SOAP** mobile-first: se llega a la «S» sin preámbulo; quick-nav S/O/A/P; **barra de guardar honesta** (el borrador **no se limpia hasta confirmar**); teclado abierto sin tapar *Guardar*.
2. **Expediente** compacto (sin duplicar nombre/dx/terapeuta) + evolución + módulos.
3. **Alta** en 8 apartados + **motivo guiado** por preguntas.
4. **Fuerza Sinergia 0–10** (sin Daniels/dinamómetro) y **ROM / importar**.
5. **Lente dermatofuncional** (rosa en los componentes, no solo el color; alertas de seguridad conservan su significado).
6. **Login** fiel a la referencia con el **logo oficial del kit** (no imagen de fondo) + estados (splash/carga/offline/recuperar/sesión expirada).

## Invariantes respetados
No elimina funcionalidades; **mapa de campos** demuestra que nada se pierde (solo cambia la presentación).
Colores de seguridad clínica conservan su significado. `dxFuncional` se **presenta/edita** aquí (el generador vive en otra rama, vía `SINERGIA_Contrato_Clinico_Compartido.md`).

## Pendiente de validar en dispositivo real
Teclado físico (iPhone/Android), cámara/MediaPipe, guardado real end-to-end, instalación PWA (icono/splash/maskable), revisión humana y rendimiento. La integración al `index.html` de producción es un paso **posterior a la aprobación**, por fases.
