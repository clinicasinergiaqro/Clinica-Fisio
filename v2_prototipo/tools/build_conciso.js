#!/usr/bin/env node
/* SINERGIA · Reporte CONCISO 1 página por paciente (V2.2.x) · Node, sin dependencias.
 * Para revisar e incorporar dx + objetivos a los expedientes sin leer un PDF largo. Por paciente muestra:
 *  - ID anónimo ESTABLE + patología + edad + cohorte (octubre) + nº de sesiones de octubre + estado de revisión.
 *  - Dx médico referido (separado).
 *  - Dx funcional ANTERIOR (lo que ya hay en el expediente) vs PROPUESTA mejorada.
 *  - Objetivos ANTERIORES vs NUEVOS (CP / MP / LP).
 *  - Hallazgos pendientes relevantes · Precauciones clínicas · Valoración inicial vs hallazgos SOAP posteriores.
 * NO contiene recomendaciones de Daniels/dinamómetro (fuerza 0–10 de Sinergia). Alimenta el prototipo de revisión.
 *
 * Uso: node tools/build_conciso.js --in <resultados.json> [--data <dataset.json>] --out <reporte.html> [--titulo "..."]
 */
'use strict';
var fs = require('fs'), path = require('path');
function arg(n, d) { var i = process.argv.indexOf(n); return (i !== -1 && process.argv[i + 1]) ? process.argv[i + 1] : d; }
var BASE = path.join(__dirname, '..');
var inPath = arg('--in', path.join(BASE, 'datos', 'resultados_v22.json'));
var dataPath = arg('--data', path.join(BASE, 'datos', 'casos_anon.json'));
var outPath = arg('--out', path.join(BASE, 'datos', 'reporte_conciso.html'));
var titulo = arg('--titulo', 'SINERGIA · Diagnósticos funcionales y objetivos — revisión (BORRADOR)');

var raw = JSON.parse(fs.readFileSync(inPath, 'utf8'));
var resultados = raw.resultados || raw;
var dataset = {};
try { var dj = JSON.parse(fs.readFileSync(dataPath, 'utf8')); (dj.casos || dj).forEach(function (c) { dataset[c.codigo] = c; }); } catch (e) { /* opcional */ }

function esc(s) { return String(s == null ? '' : s).replace(/[&<>]/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[m]; }); }
function lleno(v) { var VAC = ['', 'none', 'no evaluado', 'no evaluada', 'pendiente', 'por definir', '-', 'n/a', 'no especificado', 'ninguno', 'ninguna', 'no cuenta con diagnostico medico referido']; return VAC.indexOf(String(v == null ? '' : v).trim().toLowerCase()) === -1 && String(v == null ? '' : v).trim() !== ''; }

var FASES = { corto: 'Corto plazo', mediano: 'Mediano plazo', largo: 'Largo plazo', seguridad: 'Seguridad' };
function objLinea(o) {
  var meta = o.meta_propuesta ? (typeof o.meta_propuesta === 'object' ? (o.meta_propuesta.valor || JSON.stringify(o.meta_propuesta)) : o.meta_propuesta) : null;
  return '<tr><td class="f">' + esc(FASES[o.fase] || o.fase) + '</td><td>' + esc(o.alteracion || '') +
    '<div class="mut">' + esc(o.actividad || '') + '</div></td>' +
    '<td>' + (meta ? '<b>' + esc(meta) + '</b>' : '<span class="mut">— (a definir)</span>') +
    (o.justificacion_meta ? '<div class="mut">' + esc(o.justificacion_meta) + '</div>' : '') + '</td></tr>';
}

function ficha(c) {
  var ds = dataset[c.episodio] || {};
  var ex = ds.existente || {};
  var sm = ds.soap_meta || {};
  var seg = c.seguridad || {};
  var H = [];
  H.push('<section class="ficha">');
  // Encabezado
  var chips = [];
  if (ds.patologia || c.patologia) chips.push('<span class="chip">' + esc(ds.patologia || c.patologia) + '</span>');
  if (typeof ds.edad === 'number') chips.push('<span class="chip">' + ds.edad + ' años</span>');
  if (sm.oct_sesiones) chips.push('<span class="chip oct">Octubre 2026 · ' + sm.oct_sesiones + ' sesión(es)</span>');
  chips.push('<span class="chip corte">corte ' + esc(c.fecha_corte || '—') + '</span>');
  var estadoRev = seg.bloquea_plan ? 'Requiere resolver seguridad' : 'Borrador — requiere validación del fisioterapeuta';
  H.push('<div class="head"><div><h2>' + esc(c.episodio || '') + '</h2>' + chips.join(' ') + '</div>' +
    '<div class="rev ' + (seg.bloquea_plan ? 'bloq' : '') + '">' + esc(estadoRev) + '</div></div>');
  // Dx médico: referido (campo) · documentado (recuperado de documentos, fuente+fecha) · radiológico (aparte)
  var dm = c.diagnostico_medico_referido || {};
  var ddoc = c.diagnostico_medico_documentado || { propuestas: [] };
  var rad = c.hallazgos_radiologicos || [];
  var dmHtml = '<div class="row"><div class="lbl">Dx médico</div><div class="val">';
  dmHtml += '<b>Referido:</b> ' + (dm.texto ? esc(dm.texto) + ' <span class="mut">(referido, a confirmar)</span>' : '<span class="mut">— campo vacío —</span>');
  if (ddoc.propuestas && ddoc.propuestas.length) {
    dmHtml += '<br><b>Recuperado de documento:</b> ' + ddoc.propuestas.map(function (p) { return esc(p.dx) + ' <span class="mut">(' + esc(p.fuente || 'doc') + (p.fecha ? ', ' + esc(p.fecha) : '') + ')</span>'; }).join(' · ') + ' <span class="mut">— propuesta para completar; verificar fuente</span>';
  }
  if (rad.length) {
    dmHtml += '<br><b>Hallazgo radiológico (no es dx confirmado):</b> ' + rad.map(function (x) { return esc((x.estudio ? x.estudio + ': ' : '') + (x.impresion || '')) + (x.fecha ? ' <span class="mut">(' + esc(x.fecha) + ')</span>' : ''); }).join(' · ');
  }
  dmHtml += '</div></div>';
  H.push(dmHtml);
  // Dx funcional anterior vs propuesto
  var dxAnt = lleno(ex.dxFuncional) ? ex.dxFuncional : (lleno(ex.dxClinico) ? ex.dxClinico : null);
  H.push('<div class="dx2"><div class="col"><div class="lbl">Dx funcional ANTERIOR (expediente)</div><div class="box ' + (dxAnt ? '' : 'vacio') + '">' + (dxAnt ? esc(dxAnt) : '— vacío / no documentado —') + '</div></div>' +
    '<div class="col"><div class="lbl">Dx funcional PROPUESTO (V2.2.2)</div><div class="box prop">' + esc(c.diagnostico_funcional.texto) + '</div></div></div>');
  // Objetivos anterior vs nuevo
  var objAnt = [];
  if (lleno(ex.objetivosCP)) objAnt.push('<b>CP:</b> ' + esc(ex.objetivosCP));
  if (lleno(ex.objetivosLP)) objAnt.push('<b>LP:</b> ' + esc(ex.objetivosLP));
  H.push('<div class="dx2"><div class="col"><div class="lbl">Objetivos ANTERIORES (CP/LP del expediente)</div><div class="box ' + (objAnt.length ? '' : 'vacio') + '">' + (objAnt.length ? objAnt.join('<br>') : '— vacío / no documentado —') + '</div></div>' +
    '<div class="col"><div class="lbl">Objetivos NUEVOS (CP / MP / LP)</div>' +
    '<table class="obj"><tbody>' + (c.objetivos || []).map(objLinea).join('') + '</tbody></table></div></div>');
  // Pendientes + precauciones
  var pend = (c.valoracion_pendiente || []).filter(function (p) { return !/POSIBLE NUEVO MOTIVO/.test(p); });
  H.push('<div class="dx2"><div class="col"><div class="lbl">Hallazgos pendientes relevantes</div>' +
    (pend.length ? '<ul class="chk">' + pend.slice(0, 6).map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>' : '<div class="mut">—</div>') + '</div>' +
    '<div class="col"><div class="lbl">Precauciones clínicas</div>' + precauHTML(seg) + '</div></div>');
  // Valoración inicial vs SOAP posterior
  H.push('<div class="row small"><div class="lbl">Fuentes</div><div class="val mut">Valoración inicial' +
    (sm.valoracion_inicial_fecha ? ' (' + esc(sm.valoracion_inicial_fecha) + ')' : '') +
    ' + evolución SOAP (' + (c.soap_procesado ? c.soap_procesado.n_notas : 0) + ' notas' +
    (sm.fechas_octubre && sm.fechas_octubre.length ? '; octubre: ' + esc(sm.fechas_octubre.join(', ')) : '') + '). ' +
    'El dx funcional integra la valoración INICIAL y los hallazgos POSTERIORES del SOAP; no se mezclan motivos distintos.</div></div>');
  H.push('</section>');
  return H.join('');
}

function precauHTML(seg) {
  var al = (seg.alertas || []);
  if (!al.length) return '<div class="mut">Sin alertas con los datos disponibles' + (seg.cribado_documentado ? '' : '; cribado de banderas rojas NO documentado') + '.</div>';
  var cls = (seg.estado === 'emergencia' || seg.estado === 'derivacion_prioritaria' || seg.estado === 'bloqueo_por_dato_inconsistente') ? 'danger' : 'warn';
  return '<ul class="prec ' + cls + '">' + al.map(function (a) {
    return '<li><b>' + esc(a.regla) + '</b> · ' + esc(a.clasificacion) + (a.requiere_validacion ? ' <span class="mut">(requiere validación)</span>' : '') + '<br>' + esc(a.accion) + '</li>';
  }).join('') + '</ul>' + (seg.bloquea_plan ? '<div class="bloqnota">Plan BLOQUEADO hasta resolver.</div>' : '');
}

var css = '@page{size:A4;margin:12mm}*{box-sizing:border-box}body{font:11px/1.4 -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#13203a;margin:0}' +
  '.ficha{page-break-after:always;padding:0 2mm 6mm}.ficha:last-child{page-break-after:auto}' +
  '.head{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #1B3A6B;padding-bottom:4px;margin-bottom:6px}' +
  'h2{font-size:15px;margin:0 0 3px;color:#1B3A6B;letter-spacing:.5px}' +
  '.chip{display:inline-block;background:#eef2f8;border-radius:10px;padding:1px 7px;font-size:10px;margin-right:3px}.chip.oct{background:#e7f0ff;color:#1B3A6B}.chip.corte{background:#f3f0e6;color:#7a5c14}' +
  '.rev{font-size:10px;background:#fff7e6;border:1px solid #e3c878;border-radius:6px;padding:3px 7px;max-width:170px;text-align:center}.rev.bloq{background:#fdeaea;border-color:#d99}' +
  '.row{margin:4px 0}.row.small{font-size:10px}.lbl{font-size:9px;text-transform:uppercase;letter-spacing:.6px;color:#6a7690;font-weight:700;margin-bottom:2px}' +
  '.dx2{display:flex;gap:8px;margin:6px 0}.dx2 .col{flex:1;min-width:0}' +
  '.box{border:1px solid #d8deea;border-radius:6px;padding:5px 7px;background:#fbfcfe;min-height:28px}.box.prop{border-color:#1B3A6B;background:#f7faff}.box.vacio{color:#b00;background:#fff6f6;border-color:#ecc;font-style:italic}' +
  'table.obj{width:100%;border-collapse:collapse}table.obj td{border-bottom:1px solid #eef1f6;padding:2px 4px;vertical-align:top;font-size:10px}td.f{white-space:nowrap;color:#1B3A6B;font-weight:600;width:70px}' +
  '.mut{color:#808aa0}ul.chk,ul.prec{margin:2px 0;padding-left:16px}ul.chk li,ul.prec li{margin:1px 0}ul.prec.danger li b{color:#b00}ul.prec.warn li b{color:#8a5e0c}' +
  '.bloqnota{color:#b00;font-weight:700;font-size:10px;margin-top:2px}.doc-head{margin-bottom:8px}.doc-head h1{font-size:16px;color:#1B3A6B;margin:0}.doc-head .mut{font-size:10px}';

var html = '<!doctype html><html lang="es"><head><meta charset="utf-8"><title>' + esc(titulo) + '</title><style>' + css + '</style></head><body>' +
  '<div class="doc-head"><h1>' + esc(titulo) + '</h1><div class="mut">' + resultados.length + ' pacientes · generador ' + esc(raw._resumen ? raw._resumen.version_generador : 'V2.2.2') + ' · 1 página por paciente · BORRADOR para validación profesional (no se aplica a expedientes sin autorización)</div></div>' +
  resultados.map(ficha).join('') + '</body></html>';

fs.writeFileSync(outPath, html);
console.log('Reporte conciso: ' + outPath + ' (' + resultados.length + ' fichas)');
