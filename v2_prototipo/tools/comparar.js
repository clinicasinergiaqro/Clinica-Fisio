#!/usr/bin/env node
/* SINERGIA · Comparación V2.1 → V2.2 (punto 8) · Node, sin dependencias.
 * Corre el MISMO dataset anonimizado con el generador V2.1 (snapshot en baseline_v21/) y con el
 * V2.2 (src/), y reporta, por caso, qué cambió en: diagnóstico funcional, objetivos (supuestos de
 * meta eliminados), seguridad (estado/bloqueo), plan (protocolo por patología) y mediciones.
 *
 * Uso: node v2_prototipo/tools/comparar.js [--in <dataset.json>] [--out <comparacion.json>]
 */
'use strict';
var fs = require('fs');
var path = require('path');
var BASE = path.join(__dirname, '..');
var V21 = require(path.join(BASE, 'baseline_v21', 'generador_v2.js'));
var V22 = require(path.join(BASE, 'src', 'generador_v2.js'));

function arg(name, def) { var i = process.argv.indexOf(name); return (i !== -1 && process.argv[i + 1]) ? process.argv[i + 1] : def; }
var inPath = arg('--in', path.join(BASE, 'datos', 'casos_anon.json'));
var outPath = arg('--out', path.join(BASE, 'datos', 'comparacion_v21_v22.json'));

var raw = JSON.parse(fs.readFileSync(inPath, 'utf8'));
var corte = (raw._meta && raw._meta.fecha_corte_default) || '2026-11-26';
var casos = raw.casos || raw;

// Cuenta metas "asumidas" (texto de supuesto: 50% / 90% / Daniels 5/5 / simetría) en los objetivos.
function metasAsumidas(res) {
  var n = 0;
  (res.objetivos || []).forEach(function (o) {
    var m = o.meta_propuesta;
    if (!m) return;
    var v = JSON.stringify(m).toLowerCase();
    if (/≥90|90%|daniels 5\/5|5\/5|simetr|~50%|reducci[oó]n ~50/.test(v)) n++;
  });
  return n;
}
function romEnGrados(res) { // objetivos cuya línea base dice "grados" pero el valor es texto cualitativo
  var bad = 0;
  (res.objetivos || []).forEach(function (o) {
    var lb = o.linea_base; if (!lb) return;
    if (lb.tipo === 'medido' && (lb.unidad === 'grados') && !/\d/.test(String(lb.valor))) bad++;
  });
  return bad;
}

var filas = casos.map(function (rec) {
  var a = V21.generar(rec, { fecha_corte_default: corte });
  var b = V22.generar(rec, { fecha_corte_default: corte });
  return {
    codigo: rec.codigo || null,
    patologia: rec.patologia || null,
    v21: {
      fecha_corte: a.fecha_corte || null,
      seguridad: a.seguridad.estado, bloquea: a.seguridad.bloquea_plan,
      reglas: (a.seguridad.alertas || []).map(function (x) { return x.regla; }),
      dx: a.diagnostico_funcional.texto,
      metas_asumidas: metasAsumidas(a),
      rom_falso_grados: romEnGrados(a),
      plan_ref: a.plan ? (a.plan.protocolo_referencia || 'genérico (sin protocolo por patología)') : null,
      mediciones_n: (a.mediciones || []).length
    },
    v22: {
      fecha_corte: b.fecha_corte || null,
      seguridad: b.seguridad.estado, bloquea: b.seguridad.bloquea_plan,
      reglas: (b.seguridad.alertas || []).map(function (x) { return x.regla; }),
      dx: b.diagnostico_funcional.texto,
      metas_asumidas: metasAsumidas(b),
      rom_falso_grados: romEnGrados(b),
      plan_ref: b.plan ? (b.plan.protocolo_referencia || 'genérico') : null,
      mediciones_vinculadas_n: b.mediciones_vinculadas_n,
      episodio_nuevo: !!(b.episodio_analisis && b.episodio_analisis.sospecha)
    }
  };
});

// Agregados globales (lo que mejoró de V2.1 a V2.2).
var agg = {
  n: filas.length,
  v21_sin_fecha_corte: filas.filter(function (f) { return !f.v21.fecha_corte; }).length,
  v22_sin_fecha_corte: filas.filter(function (f) { return !f.v22.fecha_corte; }).length,
  v21_metas_asumidas: filas.reduce(function (a, f) { return a + f.v21.metas_asumidas; }, 0),
  v22_metas_asumidas: filas.reduce(function (a, f) { return a + f.v22.metas_asumidas; }, 0),
  v21_rom_falso_grados: filas.reduce(function (a, f) { return a + f.v21.rom_falso_grados; }, 0),
  v22_rom_falso_grados: filas.reduce(function (a, f) { return a + f.v22.rom_falso_grados; }, 0),
  v21_planes_distintos: (function () { var s = {}; filas.forEach(function (f) { s[f.v21.plan_ref || 'null'] = 1; }); return Object.keys(s).length; })(),
  v22_planes_distintos: (function () { var s = {}; filas.forEach(function (f) { s[f.v22.plan_ref || 'null'] = 1; }); return Object.keys(s).length; })(),
  casos_con_cambio_seguridad: filas.filter(function (f) { return f.v21.seguridad !== f.v22.seguridad || f.v21.bloquea !== f.v22.bloquea; }).map(function (f) { return f.codigo; }),
  casos_episodio_nuevo: filas.filter(function (f) { return f.v22.episodio_nuevo; }).map(function (f) { return f.codigo; })
};

fs.writeFileSync(outPath, JSON.stringify({ _agregado: agg, comparacion: filas }, null, 2));

// Reporte legible (Markdown) al lado.
var md = ['# Comparación V2.1 → V2.2 (insumos anonimizados)', '',
  '- Casos: ' + agg.n,
  '- Sin fecha_corte: V2.1 = ' + agg.v21_sin_fecha_corte + ' → V2.2 = ' + agg.v22_sin_fecha_corte,
  '- Metas asumidas (50%/90%/Daniels/simetría): V2.1 = ' + agg.v21_metas_asumidas + ' → V2.2 = ' + agg.v22_metas_asumidas,
  '- ROM cualitativo reportado como grados: V2.1 = ' + agg.v21_rom_falso_grados + ' → V2.2 = ' + agg.v22_rom_falso_grados,
  '- Planes distintos (variedad por patología): V2.1 = ' + agg.v21_planes_distintos + ' → V2.2 = ' + agg.v22_planes_distintos,
  '- Casos con cambio de seguridad: ' + (agg.casos_con_cambio_seguridad.join(', ') || '—'),
  '- Casos marcados como nuevo motivo (episodio): ' + (agg.casos_episodio_nuevo.join(', ') || '—'),
  '', '## Por caso', ''];
filas.forEach(function (f) {
  md.push('### ' + f.codigo + ' · ' + f.patologia);
  md.push('- Seguridad: `' + f.v21.seguridad + '` (bloquea ' + f.v21.bloquea + ', reglas ' + (f.v21.reglas.join('/') || '—') + ') → `' + f.v22.seguridad + '` (bloquea ' + f.v22.bloquea + ', reglas ' + (f.v22.reglas.join('/') || '—') + ')');
  md.push('- Plan: _' + (f.v21.plan_ref || '—') + '_ → _' + (f.v22.plan_ref || '—') + '_');
  md.push('- Metas asumidas: ' + f.v21.metas_asumidas + ' → ' + f.v22.metas_asumidas + '; ROM falso-grados: ' + f.v21.rom_falso_grados + ' → ' + f.v22.rom_falso_grados);
  md.push('- DX V2.1: ' + f.v21.dx);
  md.push('- DX V2.2: ' + f.v22.dx);
  md.push('');
});
fs.writeFileSync(outPath.replace(/\.json$/, '.md'), md.join('\n'));

console.log('Comparación: ' + outPath);
console.log(JSON.stringify(agg, null, 2));
