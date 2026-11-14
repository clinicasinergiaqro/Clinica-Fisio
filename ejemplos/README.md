# Sesiones de ejemplo del módulo biomecánico

`sesiones_ejemplo.json` son sesiones **FICTICIAS** (sin PHI; paciente/terapeuta genéricos `DEMO`,
URLs de Storage sin `?token=`) que reflejan la **forma REAL** de un elemento de `p.biomecanica` tal como
lo escribe `medidor-biomecanico.js` tras las Fases 1b–5 de la auditoría (`BIO_ALGO_VER='bio-2d-2026-11-14a'`).

Regenerado desde la implementación (P1-10): el `sesiones_ejemplo.json` del paquete de auditoría previo traía
campos que **no se guardan** (`orientFrontalOK`, `_motivo`). Aquí solo van los campos que el código escribe de verdad.

Qué ilustra cada sesión:
- **Goniometría · cámara**: `fuente:"camara"` DERIVADA de las trazas por medida (P1-7); `calidad.framesDescartados`
  (Fase 3) y `calidad.captura` reales; `_estadoSync:"sincronizada"` (P1-10).
- **Goniometría · foto**: `fuente:"foto"`; `imagenes[].url` (anotada) **+ `urlOrig`** (original sin anotar, P1-8);
  `traza.tSeg:null` (la foto no tiene timestamp de pico).
- **Goniometría · video**: `fuente:"video"`; `traza.tSeg` = segundo del cuadro-pico (P1-11/Fase 4).
- **Marcha · cámara**: `calidad` FUSIONA `res.calidad` (`visPct`/`orientPerfilOK`/`tiempoDudoso`) con
  `meta.calidad` (`fpsMuestreo`/`framesTotales`) — P1-9. **No existe `orientFrontalOK`**; marcha usa `orientPerfilOK`.
- **Marcha · video cámara lenta**: `tiempoDudoso:true` + `tiempoDudosoMsg` (H5); las métricas temporales quedan
  `confiable:false` y los ángulos sagitales siguen fiables; `_estadoSync:"local"` → badge 📱 (aún sin confirmar en la nube).

Campos de procedencia/estado por sesión:
- `fuente`: `camara` | `foto` | `video` | `mixta` (varias fuentes en una misma captura) | `imagen` (solo sesiones VIEJAS).
- `traza` por medida de goniometría: `{algoVersion, aspect, fuente, tSeg, lmUsados:{a,vtx,b}}`.
- `_estadoSync`: `local` (📱) al guardar; `sincronizada` (☁️) + `_estadoSyncFecha` cuando `_syncBiomecanicaFS`
  confirma la transacción a Firestore. Sesiones viejas sin el campo no muestran badge.

Nota: valores numéricos y de catálogo (`ref`/`lim`/`normTxt`) son ilustrativos; lo fiel aquí es la ESTRUCTURA
y los NOMBRES de campo.
