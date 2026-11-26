# Pruebas UX / regresión — Sinergia V2.0

**Rediseño premium mobile-first · prototipo navegable (réplica aislada, datos sintéticos).**
Documento de verificación para Carlos y la revisión de diseño.

> Alcance: se prueba el **prototipo** (`redesign-v2/prototype/`), no la app de producción.
> **No** toca producción, expedientes reales, persistencia, autenticación, offline,
> sincronización ni algoritmos biomecánicos. Rama `claude/redesign-ux-ui-v2` (sin fusionar).

---

## Entorno de prueba

- **Prototipo aislado**: HTML/CSS/JS propios + datos 100 % sintéticos (sin PHI). No escribe en ninguna base real; el guardado se **simula**.
- **Automatización**: Playwright (Chromium headless), capturas a **390 px**, `deviceScaleFactor` 2.
- **"0 errores"** = 0 `pageerror` durante el render y la interacción.
- **Simulado vs dispositivo físico**: lo marcado como *ejecutado* corre en sandbox; lo marcado como *pendiente* requiere un iPhone/Android real (teclado, cámara, instalación PWA) y no es testeable en headless.

---

## ✅ Ejecutadas (pasaron)

### Navegación y render
- Render + navegación de **las pantallas núcleo y secundarias** — login, agenda, pacientes, expediente, valoración, SOAP, alta, dermatofuncional, expediente derma, supervisión, protocolos, configuración — con **0 errores JS**.
- Transiciones de pantalla con animación de entrada; respeta `prefers-reduced-motion`.
- Pestañas inferiores (Agenda/Pacientes/Protocolos/Supervisión) con subrayado dorado activo; FAB «+».

### Login y marca
- Login **reconstruido con el logo oficial del kit** (no imagen de fondo, no logo recreado): barra de estado legible, curvas navy/dorado recortadas bajo la barra, campos con iconografía lineal, botón navy con flecha dorada, «Acceder sin conexión», «¿Olvidaste tu contraseña?», chip de versión.
- Estados de acceso renderizados: **splash**, **carga**, **sin conexión**, **recuperar contraseña**, **sesión expirada**.
- Eliminado el emoji del corazón; iconografía **SVG (Lucide)** en toda la interfaz.

### Expediente
- Encabezado **compacto sin duplicación** (nombre, edad, terapeuta y dx una sola vez) + cifras clave **EVA · ROM · sesiones** + banner de seguridad + **tarjeta de evolución** del dolor + **mosaico de módulos** (ninguna área se quita).

### SOAP mobile-first
- Encabezado compacto **Paciente · Motivo · Sesión 13**; **se llega a la «S»** sin ~1.5 pantallas de preámbulo; alerta de seguridad **visible pero contenida**.
- **Quick-nav S/O/A/P** con salto por toque y resaltado por `scroll-spy`.
- Acciones rápidas (Nuevo motivo · Dictar · Última sesión · Objetivos); mediciones **inline** (ROM/fuerza) en la «O»; agentes físicos como pills.

### Alta y motivo guiado
- Alta en **8 apartados navegables** (Identificación, Antecedentes, Seguridad, Motivo, Valoración, Dx y objetivos, Tratamiento, Revisión) con barra de progreso y navegación por apartado.
- **Motivo guiado** por preguntas en lenguaje natural (región/lado/irradiación/carácter/desde cuándo/mecanismo/agrava/alivia/evolución/limitaciones); **no exige fecha exacta** si solo se conoce la duración.
- **Teléfono obligatorio** marcado; «Borrador conservado» en la barra inferior.

### Fuerza 0–10 y ROM
- Captura de **Fuerza Sinergia 0–10** (hoja: Región → Músculo → Valor 0–10 → Lado → Registrar); escala clínica comparativa (10 = lado sano), **sin Daniels ni dinamómetro**; permite varios grupos; compara der/izq con % de déficit.
- **Importar ROM** (hoja con mediciones validadas; las pendientes no se comparan); opción «Medir ahora con la cámara» (demo).

### Dermatofuncional
- **Lente dermatofuncional** automática al abrir paciente derma: acento **rosa en los componentes** (EVA, íconos, fase), no solo el color de ventana.
- Tarjetas **post-quirúrgico** (autorización del cirujano, fototipo, edema godet, fibrosis PANFIC, cicatriz), **plan estético** (fase + equipos reales), **fotos antes/después**.
- **Los colores de las alertas de seguridad conservan su significado** bajo la lente.

### Barra de guardar honesta (invariante clave)
- Máquina de estados: **borrador → guardando → guardado confirmado**.
- Etiquetas: «Borrador · se guarda al confirmar», «Guardando…», «Guardado ✓ · confirmado en la nube», «Guardado local · sincroniza al reconectar», «No se pudo guardar · tu borrador sigue aquí».
- **El borrador NO se limpia hasta confirmar el guardado**; nunca muestra «guardado» en reposo ni antes de confirmar.

### Nuevo motivo de consulta
- Al activarlo: banner inmediato **«Nuevo episodio · Sesión 1 · pendiente de guardar · antecedentes conservados»**; la numeración de sesiones arranca en 1 sin mezclar episodios anteriores.

---

## ⏳ Pendientes (requieren dispositivo / condiciones reales)

- **Teclado físico (iPhone/Android)**: que la barra de Guardar **flote sobre el teclado** sin tapar campos (`visualViewport`). En el prototipo se demuestra el comportamiento (la barra queda por encima del teclado); falta validarlo con teclado real.
- **Cámara real / MediaPipe**: medir ROM en vivo, capturar foto/video y validar ángulos usa el motor real, que no corre en sandbox headless.
- **Guardado real end-to-end**: en la app de producción, con la verificación de integridad y en activo **y** migrado. El prototipo lo simula; la integración a `index.html` real es un paso posterior, **post-aprobación**.
- **PWA instalada**: icono, splash, maskable (Android) y `apple-touch-icon` en dispositivo real.
- **Revisión visual humana** en equipos reales (iOS/Android), safe-areas reales y rendimiento en dispositivos antiguos.

---

## Criterios de aceptación (antes vs después)

Comparar en **tareas equivalentes** a 390 px (ver `SINERGIA_Rediseno_Premium_V2_Comparativa.pdf`):

| Tarea | Antes (actual) | Después (V2) |
|---|---|---|
| Llegar a documentar el SOAP | ~1.5 pantallas de preámbulo (seguridad extensa, tarjeta de identificación repetida, motivo, dictado, fecha) antes de la «S» | Encabezado compacto + alerta contenida; **la «S» es lo primero** |
| Scroll hasta la «S» | Alto | Mínimo |
| Registrar varios grupos de fuerza | Campo libre | Hoja guiada 0–10, varios grupos, comparativa der/izq |
| Medir / importar ROM | Flujo disperso | Hoja de importación (validadas) + medir con cámara |
| Iniciar nuevo motivo | Caja dentro del formulario | Banner inmediato de episodio nuevo |
| Alta de paciente | Formulario de scroll profundo | 8 apartados navegables + progreso |
| Consultar expediente | Encabezado con datos duplicados | Encabezado compacto + evolución + módulos |

**Objetivo**: que la mejora en celular sea **verificable** y que se **preserven todos los campos, acciones y permisos** (ver `SINERGIA_Mapa_Campos_Antes_Despues.md`).

---

## Cómo reproducir

1. Abrir `redesign-v2/prototype/index.html` en Chrome o Safari (en celular ocupa toda la pantalla).
2. Arranca en el **login demo** (correo y clave precargados). Toca **Iniciar sesión** → splash → **Agenda**.
3. Recorrido sugerido: Agenda → toca una cita → **Expediente** → **Valoración** / **SOAP** (prueba quick-nav, fuerza, importar ROM, nuevo motivo, Guardar) → vuelve y abre un paciente **dermatofuncional** (Ana Torres) para ver la lente rosa → FAB «+» para el **Alta** por apartados.
4. Datos 100 % sintéticos; nada se escribe en una base real.
