# Medidor Sinergia 3D — Kinect (Hito 1: Sentadilla)

App de escritorio Windows que graba una sentadilla con **Kinect v2 (Kinect One)**, dibuja el
esqueleto en vivo, calcula un reporte **3D mejorado** (profundidad, valgo FPPA, rodilla/tobillo,
tronco, simetría izq/der) y lo guarda como `.dat` (compatible con MedidorOne) + reporte HTML.

Es un proyecto **separado** de la app web (Clínica Sinergia). No afecta la web ni GitHub Pages.

## Qué necesitas (una sola vez, todo gratis)
1. **Windows 10/11 x64**, con **USB 3.0**.
2. **Kinect v2 (Xbox One)** + **Kinect Adapter for Windows** (el adaptador USB3 — indispensable).
3. **Kinect for Windows SDK 2.0** — https://www.microsoft.com/download/details.aspx?id=44561
   (al instalarlo crea la variable `KINECTSDK20_DIR`, que el proyecto usa para encontrar la DLL).
4. **Visual Studio 2022 Community** (gratis) con la carga de trabajo **"Desarrollo de escritorio de .NET"**.

## Cómo compilar y correr
1. Conecta el Kinect v2 por el adaptador USB3 y espera a que Windows instale sus drivers.
2. Abre `MedidorSinergia3D.csproj` en Visual Studio (Archivo → Abrir → Proyecto/Solución).
3. Arriba selecciona la configuración **x64**.
4. Compila y ejecuta (F5). Si la DLL no se encuentra, verifica que el SDK 2.0 esté instalado
   (o ajusta el `HintPath` de `Microsoft.Kinect` en el .csproj a la ruta real de tu SDK).

## Cómo usar
1. Escribe el nombre del **paciente** (usa `ZZ PRUEBA MEDIDOR` para pruebas).
2. Colócate **de frente** al Kinect, cuerpo completo; cuando aparezca el esqueleto se habilita **Grabar**.
3. **⏺ Grabar** → haz 3–5 sentadillas → **⏹ Detener**. Verás el contador de cuadros mientras grabas.
4. Sale el resumen y el botón **📄 Ver reporte** (abre el HTML; imprímelo a PDF si quieres).
5. Todo se guarda en `Documentos\MedidorSinergia3D\` (`.dat` + `.html`).

## Formato .dat (compatible con MedidorOne)
`int32 numArticulaciones(25)`, `int32 numFrames`, luego por frame:
`float tiempo(s)`, `float fps`, y `25 × (x,y,z) float32` en metros del espacio de la cámara.
La app también **lee** los `.dat` viejos de MedidorOne.

## Honestidad y pendientes
- La **matemática del análisis** ya la validé contra tus capturas reales NORMAL vs RODILLA (distingue
  el valgo de rodilla y la asimetría). Esa parte está probada.
- La **captura del Kinect** no la pude compilar/probar en mi entorno (sin Kinect ni Windows). Si algo
  falla al compilar o correr, pásame el error exacto y lo corrijo — es un ida y vuelta contigo.
- **Hito 1b (siguiente):** subir la sesión a tu Firebase para que aparezca en el expediente web,
  junto a las tomas del celular. **Hito 2:** salto monopodal (altura, tiempo de vuelo, velocidad).
