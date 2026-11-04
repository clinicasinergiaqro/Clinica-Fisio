# Plantilla — PLAN DE READAPTACIÓN DEPORTIVA (Clínica Sinergia)

Formato oficial del documento **"Plan de Readaptación Deportiva"** que entrega la clínica al
paciente/entrenador cuando el paciente vuelve a su deporte tras una lesión/cirugía. Este archivo es la
referencia **sin datos de paciente (sin PHI)** para poder **regenerar el documento idéntico** cuando se
pida, y como base para una futura **función en la app** (equivalente deportivo de la pestaña 📋 Protocolo
/ de `biblioteca_protocolos.md` y `biblioteca_dermatofuncional.md`).

> Los ejemplos reales (Iris Nájera, gimnasia, post-op tobillo) traen PHI → NO van al repo. El método y la
> plantilla sí son durables; el contenido por paciente se arma al momento.

## Cuándo se usa
Paciente en fase de **retorno al deporte** (readaptación), típicamente post-quirúrgico o post-lesión, que
ya tolera carga y necesita una guía clara de **qué puede / qué no puede hacer todavía en su deporte** +
**semáforo del dolor** + **signos de alarma**. Se actualiza por etapas (p. ej. semana 10, semana 12…): un
documento por corte, con la fecha del día.

## Principios del contenido (reglas de oro)
- **Se avanza por CRITERIOS y síntomas, no por calendario.** Los tiempos son tentativos.
- Lenguaje para paciente/entrenador, **específico del gesto del deporte** (no genérico): nombrar los
  elementos reales (en gimnasia: tumbling, flic-flac, rondada, mortales, desmontes, paradas de manos…).
- Dos columnas honestas: **SÍ puede hacer ahora** vs **NO puede hacer todavía** — progresar ítems de la
  derecha a la izquierda en cada corte.
- **Semáforo del dolor** (Verde 0–3 continuar · Amarillo 4–5 bajar carga · Rojo >5 parar y revalorar) +
  **signos de alarma** (dolor que sigue al día siguiente, inestabilidad/"se va" la articulación,
  inflamación, pérdida de fuerza, dolor agudo súbito).
- Protección específica si aplica (tobillera/rodillera obligatoria para el deporte) como campo propio.
- Firma del **fisioterapeuta tratante** (Carlos Fernando Aranda González, Céd. Prof. 10940863).

## Estructura visual (de arriba a abajo)
1. **Encabezado:** emblema circular de la clínica + "CLÍNICA SINERGIA" / "Fisioterapia y Rehabilitación" /
   "COORDINANDO MENTE Y CUERPO" (dorado, espaciado). A la derecha, barra dorada + "READAPTACIÓN DEPORTIVA" +
   fecha `dd/Mmm/aaaa`.
2. **Eyebrow dorado** en mayúsculas espaciadas: `LESIÓN/CONTEXTO · DEPORTE` (ej. "POSTOPERADO DE TOBILLO · GIMNASIA").
3. **Título H1 navy:** "PLAN DE READAPTACIÓN DEPORTIVA".
4. **Rejilla de datos** (etiqueta gris mayúscula + valor): `PACIENTE` · `DEPORTE` / `DIAGNÓSTICO` (ancho completo) /
   `ETAPA ACTUAL` · `<campo extra>` (ej. `TOBILLERA`).
5. **Párrafo intro** con frases clave en negrita ("progresiva", "no por calendario").
6. **Sección 1** (barra navy, cuadro numerado dorado): `QUÉ PUEDE Y QUÉ NO — IMPACTO EN <DEPORTE>` →
   dos tarjetas: verde `✓ SÍ PUEDE HACER AHORA` y roja `✕ NO PUEDE HACER TODAVÍA`, cada una con viñetas.
7. **Sección 2** (barra navy): `SEMÁFORO DEL DOLOR` → tabla (Nivel 0–10 | Qué hacer) 3 filas Verde/Amarillo/Rojo +
   caja roja `SIGNOS DE ALARMA — suspender y revalorar`.
8. **Nota pie** en itálica gris ("Esto se podrá modificar… Tiempos tentativos.").
9. **Bloque de firma** centrado: `FISIOTERAPEUTA TRATANTE` (dorado) + nombre navy + credenciales + dirección.

## Tokens de color
- Navy `#1B3A6B` (títulos, barras de sección, logo). Dorado `#C8A24B` / texto dorado `#B6912E`.
- Verde `#3C9A5F` (borde) / `#2E7D46` (texto) / fondo `#EAF5EE`. Rojo `#C0392B` / `#B23A2E` / fondo `#FBEDEB`.
- Ámbar `#E0A800` / `#B8860B` / fondo `#FBF4E3`. Gris etiqueta `#8A93A3`; fondo página `#f4f6f9`; tarjeta `#fff` borde `#e1e6ee`.

## Cómo se genera (método Claude, hoy)
Mismo patrón que los reportes clínicos: HTML+CSS propio → **Chromium `--headless --print-to-pdf`** (o
`--screenshot` para previsualizar). El **emblema** se obtiene recortando la parte circular del logo oficial
`clinica/sinergia/assets/logo_horizontal.png` (Firebase Storage) y se **embebe en base64** (Chromium no baja
por el proxy). Generador de referencia (rellenar un `DATA` dict y renderizar): `scratchpad/build_readapt.py`
(efímero; reconstruir desde este md). Nombre de archivo sugerido:
`Readaptacion_deportiva_<Paciente>_sem<NN>_<YYYY-MM-DD>.pdf`. Entrega por SendUserFile / subir al expediente
con `claudeSubirEstudio` (tipo `documento`).

### Esqueleto HTML/CSS (sin PHI — placeholders `{{...}}`)
```html
<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Plan de Readaptación Deportiva</title>
<style>
@page{size:A4;margin:0}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0;background:#f4f6f9;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:#2a2f3a}
.page{width:794px;min-height:1123px;margin:0 auto;background:#fff;border:1px solid #e1e6ee;border-radius:14px;padding:30px 38px 26px}
.hdr{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #eceff4;padding-bottom:14px}
.hdr-l{display:flex;align-items:center;gap:14px}.emb{width:62px;height:62px}
.brand h1{margin:0;font-size:22px;font-weight:800;letter-spacing:.5px;color:#1B3A6B}
.brand .s1{color:#6b7689;font-size:12px}.brand .s2{color:#B6912E;font-size:9px;letter-spacing:3px;font-weight:700;margin-top:3px}
.hdr-r{padding-left:16px;border-left:3px solid #C8A24B}
.hdr-r .t{color:#1B3A6B;font-size:11px;letter-spacing:2.5px;font-weight:700}.hdr-r .d{color:#6b7689;font-size:11px;margin-top:3px}
.eyebrow{color:#B6912E;font-size:11px;letter-spacing:3px;font-weight:700;margin:16px 0 4px}
.big{color:#1B3A6B;font-size:25px;font-weight:800;margin:0 0 12px}
.grid{width:100%;border-collapse:collapse;margin-bottom:12px}.grid td{padding:7px 8px;vertical-align:top;border-bottom:1px solid #eef1f5;font-size:12.5px}
.grid .lb{width:120px;color:#8A93A3;font-size:9.5px;letter-spacing:1.2px;font-weight:700;text-transform:uppercase}
.intro{font-size:12.5px;line-height:1.6;color:#3a414f;margin:0 0 16px}
.secbar{background:#1B3A6B;color:#fff;border-radius:7px;padding:9px 12px;display:flex;align-items:center;gap:11px;margin:16px 0 12px;font-size:13px;letter-spacing:.6px;font-weight:700}
.secbar .num{background:#C8A24B;color:#1B3A6B;width:22px;height:22px;border-radius:5px;display:inline-flex;align-items:center;justify-content:center;font-weight:800}
.cols{display:flex;gap:16px}.card{flex:1;border-radius:10px;padding:13px 15px}
.card.yes{background:#EAF5EE;border:1px solid #cfe8d7;border-left:5px solid #3C9A5F}.card.no{background:#FBEDEB;border:1px solid #f3d6d1;border-left:5px solid #C0392B}
.card .ct{display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:800;margin-bottom:9px}.card.yes .ct{color:#2E7D46}.card.no .ct{color:#B23A2E}
.badge{width:19px;height:19px;border-radius:50%;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:800}
.card.yes .badge{background:#3C9A5F}.card.no .badge{background:#C0392B}
.card ul{margin:0;padding:0;list-style:none}.card li{font-size:12px;line-height:1.5;margin-bottom:6px}.card li .mk{font-weight:800;margin-right:7px}
.sem{width:100%;border-collapse:collapse}.sem th{text-align:left;font-size:10px;letter-spacing:1px;color:#6b7689;text-transform:uppercase;padding:6px 10px;background:#eef1f5}
.sem td{padding:9px 10px;font-size:12px;border-bottom:1px solid #fff}.sem-niv{width:210px}.sem .dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:8px;vertical-align:middle}
.alarma{border:1px solid #f3d6d1;border-left:5px solid #C0392B;background:#fdf6f5;border-radius:9px;padding:12px 15px;margin-top:14px}
.alarma .at{font-size:12px;font-weight:800;color:#B23A2E;margin-bottom:7px}.alarma ul{margin:0;padding-left:18px}.alarma li{font-size:11.5px;line-height:1.5;margin-bottom:3px}
.nota{font-size:11px;color:#8A93A3;font-style:italic;margin:14px 0 0}
.firma{text-align:center;margin-top:30px;padding-top:16px;border-top:1px solid #eceff4}
.firma .ft{color:#B6912E;font-size:10px;letter-spacing:2.5px;font-weight:700}.firma .fn{color:#1B3A6B;font-size:16px;font-weight:800;margin-top:5px}
.firma .fs{color:#6b7689;font-size:11px;margin-top:3px}.firma .fc{color:#5a6478;font-size:11px;margin-top:3px}.firma .fd{color:#9aa3b2;font-size:10px;margin-top:9px}
</style></head><body><div class="page">
  <div class="hdr"><div class="hdr-l"><img class="emb" src="data:image/png;base64,{{EMBLEMA_B64}}">
    <div class="brand"><h1>CLÍNICA SINERGIA</h1><div class="s1">Fisioterapia y Rehabilitación</div>
      <div class="s2">COORDINANDO MENTE Y CUERPO</div></div></div>
    <div class="hdr-r"><div class="t">READAPTACIÓN DEPORTIVA</div><div class="d">{{FECHA}}</div></div></div>
  <div class="eyebrow">{{EYEBROW: LESIÓN · DEPORTE}}</div>
  <h2 class="big">PLAN DE READAPTACIÓN DEPORTIVA</h2>
  <table class="grid">
   <tr><td class="lb">PACIENTE</td><td>{{PACIENTE}}</td><td class="lb">DEPORTE</td><td>{{DEPORTE}}</td></tr>
   <tr><td class="lb">DIAGNÓSTICO</td><td colspan="3">{{DIAGNOSTICO}}</td></tr>
   <tr><td class="lb">ETAPA ACTUAL</td><td>{{ETAPA}}</td><td class="lb">{{EXTRA_LABEL}}</td><td>{{EXTRA_VALOR}}</td></tr>
  </table>
  <p class="intro">{{INTRO}}</p>
  <div class="secbar"><span class="num">1</span> QUÉ PUEDE Y QUÉ NO — IMPACTO EN {{DEPORTE_MAYUS}}</div>
  <div class="cols">
    <div class="card yes"><div class="ct"><span class="badge">✓</span> SÍ PUEDE HACER AHORA</div>
      <ul>{{LI_SI_PUEDE}}</ul></div>
    <div class="card no"><div class="ct"><span class="badge">✕</span> NO PUEDE HACER TODAVÍA</div>
      <ul>{{LI_NO_PUEDE}}</ul></div></div>
  <div class="secbar"><span class="num">2</span> SEMÁFORO DEL DOLOR</div>
  <table class="sem"><tr><th class="sem-niv">Nivel de dolor (0–10)</th><th>Qué hacer</th></tr>
    <tr style="background:#EAF5EE"><td class="sem-niv"><span class="dot" style="background:#3C9A5F"></span><b style="color:#2E7D46">VERDE</b> — 0 a 3/10</td><td>Puede continuar con la actividad</td></tr>
    <tr style="background:#FBF4E3"><td class="sem-niv"><span class="dot" style="background:#E0A800"></span><b style="color:#B8860B">AMARILLO</b> — 4 a 5/10</td><td>Baja intensidad y volumen; no aumentes carga; cambia o suspende el ejercicio que aumente el dolor</td></tr>
    <tr style="background:#FBEDEB"><td class="sem-niv"><span class="dot" style="background:#C0392B"></span><b style="color:#B23A2E">ROJO</b> — más de 5/10</td><td>Para la actividad y revalora antes de continuar</td></tr></table>
  <div class="alarma"><div class="at">SIGNOS DE ALARMA — suspender y revalorar</div><ul>{{LI_ALARMA}}</ul></div>
  <p class="nota">{{NOTA_PIE}}</p>
  <div class="firma"><div class="ft">FISIOTERAPEUTA TRATANTE</div>
    <div class="fn">Carlos Fernando Aranda González</div>
    <div class="fs">Licenciado en Fisioterapia · Ortopedia y Lesiones Deportivas</div>
    <div class="fc"><b>Céd. Prof.</b> 10940863 · <b>Cel.</b> 442-479-5588 · lftaranda@gmail.com</div>
    <div class="fd">Blvd. De la Campana 1039, Manzanares, 76230, Juriquilla, Qro.</div></div>
</div></body></html>
```

## Contrato de datos (lo que hay que llenar por paciente)
`fecha`, `eyebrow` (LESIÓN · DEPORTE), `paciente`, `deporte`, `diagnostico`, `etapa` (fase + semana),
`extra_label`/`extra_valor` (protección: tobillera/rodillera; o "APOYO"), `intro` (con negritas),
`si_puede[]`, `no_puede[]` (ítems específicos del deporte), `signos_alarma[]`, `nota_pie`. El semáforo y el
bloque de firma son fijos.

## Candidato a función en la app (futuro)
Igual que 📋 Protocolo saca el estado del expediente y arma el plan, esta plantilla puede volverse una
**pestaña/acción "Readaptación deportiva"** que (a) tome dx/región/deporte/fase del expediente,
(b) proponga el bloque "qué sí / qué no" por deporte + etapa, (c) genere el PDF con este diseño y
(d) lo comparta/guarde (reusar la maquinaria de PDF de los reportes/protocolo). Fuente clínica: esta
plantilla + criterios por deporte a construir con Carlos.
