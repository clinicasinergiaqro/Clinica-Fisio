# Punto 2 — Análisis de las mediciones grabadas (expedientes de prueba)

**Fecha:** 2026-11-14 · **Fuente:** `claudeGetExpedienteFull` (solo lectura) de los 2 expedientes de prueba.
**Backend build:** `2026-09-27-soap-cap-archivo` · totalPacientes 420.
**Datos ficticios** (paciente "Dafne Estefanía Duñez Dosal", `p1781814958552`) → sin PHI, valores incluidos.
El 2º de prueba ("Paciente Prueba Biomecánica", `pc1f6be67-…`) tiene `biomecanica = None` (vacío, esperado).

> **Re-conteo:** el corte del prompt decía 11 sesiones; hoy hay **12** (entró 1 goniometría más):
> **6 goniometría, 3 ROM, 2 marcha, 1 sentadilla.** Todas `_estadoSync='sincronizada'`, `eliminado=false`,
> `algoVersion='bio-2d-2026-11-14b'` (0 FLAG-ALGO), aspect coherente con la fuente (video 0.56, cámara 0.75).

## 🔴 BLOQUEADOR DE DEPLOY

**No existe aún la sesión de marcha SLOW-MO.** Ninguna de las 2 marchas tiene `calidad.tiempoDudoso=true`
ni temporales con `confiable:false`. Las dos son video "normal" (cadencia 56 y 47, dentro de 20–220 → no
disparan `_cadenciaDudosa`). El Hallazgo D exige validar con un **slow-mo REAL de iPhone** que los tiempos
queden `confiable:false`/`tiempoVerificado:false` mientras los ángulos siguen normales. **Hasta tener esa
captura, el deploy (punto 5) queda bloqueado** (regla del prompt + PENDIENTES (e)).

## Tabla por sesión

| # | tipo | fuente | medida principal | valor | ref/norm | veredicto | por qué |
|---|------|--------|------------------|-------|----------|-----------|---------|
| 0 | goniometría | video | Cadera ext izq | 19.8° | 0–30 | ✅ plausible | traza completa, vis 0.97, aspect 0.56, tSeg 3.6 |
| 1 | sentadilla | cámara | FPPA izq/der | −13.1° / −20.9° (varo) | <10–12 típ. | ✅ plausible (prueba) | signo consistente (+valgo/−varo), descPct 20 (rep válida), orientaciónOK, cámara no movida; varo der 20.9° marcado |
| 2 | marcha | video | cadencia | 56 /min | 90–130 | ⚠️ plausible pobre | 1 solo ciclo, 37 frames, 3 s; stance izq 59.8% ok; picos rodilla bajos (38/47); doble apoyo 0. Captura corta, no concluyente. `tiempoVerificado:false`/`video-sin-confirmar` presente ✓ |
| 3 | marcha | video | hip ROM der | **97.6°** | 35–50 | 🚩 sospechosa | `orientPerfilOK:false`, visPct 77, 33% frames inválidos → ROM de cadera inflado + asimetría hip 37%. `tiempoVerificado:true`/`video-confirmado` ✓. NO slow-mo |
| 4 | ROM | cámara | hombro flex der | 167° (de 7) | ≤180 | ⚠️ mixta | codo der 43° (bajo); hombro flex izq 128° marcado **confiable a visPct 10%**; hombro ext izq 172° correctamente `confiable:false` (muestras 8); codo izq null honesto ✓ |
| 5 | ROM | cámara | hombro ext izq | **174°** | ≤60 | 🚩 sospechosa | 174° de extensión de hombro = imposible, **marcado `confiable:true`** (muestras 12, visPct **8%**). El gate es solo `reps≥1 && muestras≥12` (sin piso de visPct ni plausibilidad) |
| 6 | goniometría | cámara | Rodilla flex der | 106.1° | 0–135 | ✅ plausible | vis 0.88, aspect 0.75 |
| 7 | goniometría | cámara | Rodilla flex izq | 114.3° | 0–135 | ✅ plausible | vis 0.95 |
| 8 | goniometría | cámara | Rodilla flex der | **172.6°** | 0–135 | 🚩 sospechosa | >ref+10 imposible; vis_min 0.55; artefacto 2D (pierna escorzada/colineal). Incoherente con [6] (misma rodilla der = 106.1°) |
| 9 | ROM | cámara | codo flex izq | media 64 / mejor 117 (**de 31**) | — | ⚠️ mixta | alta variabilidad entre 5 reps (de 31); hombro flex izq de 25; hombro flex der null honesto ✓ |
| 10 | goniometría | cámara | Cadera flex izq | 129.3° | 0–120 | 🟡 borderline | levemente sobre ref; flexión activa de cadera puede ~120–135; vis 0.8 |
| 11 | goniometría | cámara | Cadera ext der | **160.1°** | 0–30 | 🚩 sospechosa | imposible (máx ~30°); artefacto 2D (pierna casi recta leída ~160–180); vis 0.68. Es el "Cadera ext D160°" que quedó escrito en `valoracion.rom` |

Resumen: **plausibles** 0,1,6,7,10 (+2 plausible-pobre) · **sospechosas/imposibles** 3,5,8,11 · **mixtas con flag menor** 4,9.

## Sospechosas — causa probable (clasificación)

1. **[8] rodilla 172.6° y [11] cadera ext 160.1° (goniómetro)** → **limitación conocida del 2D (escorzo / fuera de plano).**
   Cuando el segmento queda casi paralelo al eje de la cámara, el ángulo 2D colapsa hacia ~180°. No es un bug
   nuevo; es justo lo que advierte el etiquetado "cribado ±5–10°, no validado contra goniómetro físico". **PERO el
   número imposible igual se escribe a `valoracion.rom`** (clínico lo ve). La guarda de geometría degenerada
   (`_seg2D<0.03` → no-medible) y el gate de visibilidad (≥0.5) no los atrapan porque el segmento sí tiene largo
   y la visibilidad es 0.55–0.68.
   → **Candidato de fix (misma clase, NO aplicado):** avisar/marcar "revisar — fuera de rango, posible escorzo"
   cuando `grado > ref + margen` (p. ej. +15°) y no sea `hiperext`. Se reporta; requiere OK de Carlos.

2. **[5] hombro ext 174° marcado `confiable:true`** → **gate de `confiable` de ROM demasiado laxo.**
   `medidor-biomecanico.js:382` → `confiable = (reps>=1 && muestras>=12)`. No mira visPct ni plausibilidad, así
   que un valor imposible a 8% de visibilidad cruza el umbral por tener 12 muestras. (Comparar con [4], mismo
   movimiento, 172° → `confiable:false` solo porque tenía 8 muestras.)
   → **Candidato de fix (misma clase, NO aplicado):** añadir piso de `visPct` (p. ej. ≥25–30%) y/o clamp de
   plausibilidad contra el rango normal del movimiento. Reportado; requiere OK de Carlos.

3. **[3] marcha hip ROM 97.6° con `orientPerfilOK:false`** → **captura con mala orientación de perfil.**
   El módulo YA detecta y expone `orientPerfilOK:false`, pero igual computa y guarda el ROM sagital inflado
   (y la cadencia/ángulos salen raros). Es análogo al patrón de `tiempoDudoso` (Hallazgo D) pero para la
   geometría sagital.
   → **Candidato de fix (misma clase, NO aplicado):** gatear `confiable:false` en los ROM sagitales cuando
   `orientPerfilOK===false` (como `tiempoDudoso` gatea los temporales). Reportado; requiere OK de Carlos.

4. **[2] marcha corta (1 ciclo)** y **[9] codo de=31 (variabilidad entre reps)** → no son bugs: captura
   incompleta / esfuerzo inconsistente del tester. Informativo.

Nota: los 3 candidatos de fix son de la **misma clase** ("el 2D produce un número confiado pero clínicamente
imposible cuando la pose está mal / escorzada / poco visible"). El track previo ya añadió los `[verificar]` y el
"no-medible" por geometría degenerada; estos 3 son el residual de esa clase. **No se parchan sin confirmación de
Carlos** (regla 5 + "NO parchar por un dato raro sin confirmación").

## Cobertura del checklist del equipo (por tipo × fuente)

Cubierto ✅ / Falta ⬜:
- **Goniómetro:** cámara en vivo ✅ · video ✅ (1) · **foto ⬜** · **video subido de miembro inferior ⬜** ·
  articulaciones: cadera (ext/flex) ✅, rodilla (flex) ✅ · **tobillo (DF/PF) ⬜**, **codo ⬜**, **muñeca ⬜**.
- **ROM brazos:** cámara ✅ · codo flex ✅, hombro flex ✅, hombro ext ✅ · **cuello (lat) ⬜**.
- **Marcha:** video ✅ (2) · **cámara en vivo ⬜** · **🔴 slow-mo (BLOQUEADOR) ⬜**.
- **Sentadilla:** cámara frontal ✅ (1 rep) · **multi-rep / varias tomas ⬜**.

## Transversal (verificado)
- `algoVersion = bio-2d-2026-11-14b` en las 12 → 0 FLAG-ALGO (se midió dentro del preview).
- `_estadoSync = sincronizada` en las 12; `eliminado=false` en las 12.
- aspect: video 0.5624 (vertical 9:16 ✓), cámara/foto 0.75 (3:4 ✓).
- frames válidos/totales: marcha[3] 92/137 = **33% inválidos** (corrobora la mala orientación); resto <6%.
- goniometría: cada medida con `traza` completa (lmUsados con v, aspect, fuente, tSeg solo en video) ✓.

## Qué NO se hizo (por diseño)
- No se tocó ningún expediente (solo lectura).
- No se parchó ningún "dato raro" → los 3 candidatos de fix van a reporte para decisión de Carlos.
