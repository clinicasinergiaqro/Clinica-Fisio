# SINERGIA — Integración Biomecánica V2

**Cómo el generador V2 recupera y usa las mediciones del módulo 🦴 (cámara/foto/video), sin duplicarlo ni transcribir a mano**
Borrador técnico · 2026-11-26 · rama aislada · solo lectura

---

## 1. Qué ya existe (no se reconstruye)

La app tiene un módulo biomecánico **autónomo** (`medidor-biomecanico.js`) que **ya mide y ya guarda**:

- **Goniómetro de cámara** (en vivo, por **foto** y por **video** subidos): cadera, rodilla, tobillo, hombro, codo, muñeca. Escribe los grados en **`valoracion.rom`** (campo clínico normal → sincroniza a todos los equipos y sale en el reporte) y guarda la **imagen anotada** (brazos + arco + grados) como evidencia.
- **Sesiones completas** en `p.biomecanica[]` (array): ROM de brazos, sentadilla frontal (valgo/FPPA), marcha sagital, con **video crudo** subido a Storage y **comparador antes/después** (⚖️).
- **Sincronización cross-device** de `p.biomecanica` por `_syncBiomecanicaFS`.

> **Regla de oro:** el generador V2 **no mide ni recalcula**. Solo **lee** estas mediciones ya validadas y las **referencia por id**.

## 2. Contrato de una medición (lo que el generador conserva)

Por cada medición importada, el generador guarda **la referencia**, no el número suelto:

```jsonc
{
  "id": "bio_<ts>_<rand>",        // id de la medición en p.biomecanica / valoracion.rom
  "valor": 92,                     // grados u otra unidad
  "unidad": "grados",
  "articulacion": "rodilla",
  "movimiento": "flexion",
  "lado": "izquierdo",
  "tipo": "activa",               // activa | pasiva
  "posicion": "supino",
  "metodo": "goniometro_camara",  // goniometro_camara | foto | video | manual_valoracion | SOAP
  "fecha": "2026-10-14",
  "calidad": "buena",             // según detección del módulo
  "autor": "<terapeuta>",
  "evidencia": { "ruta": "clinica/sinergia/<id>/biomecanica/gonio_*.jpg", "tipo": "imagen_anotada" }
}
```

El generador referencia estas mediciones en `output.mediciones_ids[]` y en la `evidencia` de cada objetivo/indicador.

## 3. Cómo se usa (sustentar dx, objetivos y SOAP)

1. **Línea base de objetivos:** si existe una medición de ROM válida y **del episodio/fecha pertinente**, se usa como `linea_base` del objetivo correspondiente (hoy el 79% de expedientes no tiene ROM capturado → el goniómetro llena ese hueco). Si **no** existe → `linea_base: null` + tarea "Medir ROM" (botón que abre el módulo existente).
2. **Indicador de reevaluación:** el **comparador antes/después** del módulo es el mecanismo natural de seguimiento; el generador propone "reevaluar [articulación/movimiento] con goniómetro en [fecha]" y enlaza la medición previa.
3. **Sustento del diagnóstico funcional:** una limitación de ROM **medida** (no referida) pasa a `tipo:medido` y puede sustentar el déficit funcional; una limitación solo referida se queda como síntoma.
4. **Pruebas funcionales dinámicas:** sentadilla frontal (valgo/FPPA) y marcha sagital alimentan objetivos de **control motor / retorno deportivo** (p.ej. control de valgo en rodilla/LCA) y criterios de progresión.

## 4. Botones de la futura UI (especificación, no implementados en producción)

- **"Medir ROM"** → abre el goniómetro del módulo 🦴; al terminar, el generador recibe el **id** de la medición (no el número tecleado).
- **"Importar medición desde valoración / SOAP"** → lista las mediciones existentes (`valoracion.rom`, `p.biomecanica`, grados en notas SOAP) y permite seleccionarlas por id.
- Al importar se guardan **id, fecha, lado, articulación, movimiento, activa/pasiva, posición, método, unidad, calidad, autor y evidencia**.

## 5. Reglas de integridad (de la V2)

- **No copiar históricos como actuales:** una medición de fecha previa no se presenta como la actual; conserva su fecha y queda marcada como histórica.
- **Comparar solo compatibles:** el comparador exige misma **articulación + movimiento + lado + método** (activa vs pasiva no se comparan entre sí).
- **Mantener histórico y versión:** cada reevaluación agrega una medición nueva; no se sobrescribe la anterior.
- **No duplicar el motor biomecánico:** el generador consume `medidor-biomecanico.js`; no reimplementa cálculo de ángulos.
- **Trazabilidad:** la evidencia apunta a la **imagen/video anotado** en Storage por ruta e id, nunca a datos personales.

## 6. Mapeo a datos reales de la app

| Fuente en el expediente | Qué aporta | Campo destino en el contrato V2 |
|---|---|---|
| `valoracion.rom` (goniómetro) | grados de ROM por articulación/lado | `mediciones_ids` + `linea_base` de objetivos de ROM |
| `p.biomecanica[]` sesiones | ROM brazos, sentadilla (FPPA), marcha, con video | pruebas funcionales → objetivos de control motor/retorno |
| Imagen anotada (gonio) | evidencia visual reproducible | `evidencia` de la medición |
| Comparador ⚖️ antes/después | evolución objetiva | `indicador de reevaluación` |

## 7. Pendiente / decisiones

- Definir qué **calidad mínima** de medición se acepta para alimentar un objetivo automáticamente.
- Si se añade un **tipo de medición no-ROM** (p.ej. dinamometría de prensión, Y-Balance) habrá que extender el módulo 🦴 o capturarlo como campo nuevo (fuera de este prototipo).
- La escritura real de la referencia al expediente se hará en la fase de integración (con autorización, respetando integridad de guardado y activo=migrado).
