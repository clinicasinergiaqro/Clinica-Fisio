#!/usr/bin/env node
/* SINERGIA · Regenerador de resultados V2.2 · Node, sin dependencias.
 * Lee un dataset de insumos clínicos anonimizados y produce el JSON de resultados (el contrato V2.2,
 * ÚNICA fuente de verdad del PDF y del prototipo). Cada resultado lleva fecha_corte (punto 7).
 *
 * Uso:
 *   node v2_prototipo/tools/regenerar.js [--in <dataset.json>] [--out <resultados.json>] [--corte YYYY-MM-DD]
 *   # por defecto: in = v2_prototipo/datos/casos_anon.json, out = v2_prototipo/datos/resultados_v22.json
 *
 * Para el set REAL de 85 pacientes: exportar del backend los 85 registros anonimizados al MISMO
 * formato que casos_anon.json ({_meta, casos:[{codigo,patologia,edad,orig,antecedentes,seguridadClinica,soap?}]})
 * y correr este script con --in <ese_export>. (El export requiere el token CLAUDE del backend.)
 */
'use strict';
var fs = require('fs');
var path = require('path');
var GEN = require('../src/generador_v2.js');

function arg(name, def) { var i = process.argv.indexOf(name); return (i !== -1 && process.argv[i + 1]) ? process.argv[i + 1] : def; }

var BASE = path.join(__dirname, '..');
var inPath = arg('--in', path.join(BASE, 'datos', 'casos_anon.json'));
var outPath = arg('--out', path.join(BASE, 'datos', 'resultados_v22.json'));

var raw = JSON.parse(fs.readFileSync(inPath, 'utf8'));
var meta = raw._meta || {};
var corteDefault = arg('--corte', meta.fecha_corte_default || new Date().toISOString().slice(0, 10));
var casos = Array.isArray(raw.casos) ? raw.casos : (Array.isArray(raw) ? raw : []);

var resultados = casos.map(function (rec) {
  return GEN.generar(rec, { fecha_corte_default: corteDefault });
});

// Resumen de trazabilidad (todos con fecha_corte; cuántos bloquean; mediciones vinculadas vs sin vincular).
var resumen = {
  generado: new Date().toISOString(),
  version_generador: GEN.version,
  dataset: path.basename(inPath),
  n_casos: resultados.length,
  todos_con_fecha_corte: resultados.every(function (r) { return !!r.fecha_corte; }),
  bloqueados: resultados.filter(function (r) { return r.seguridad && r.seguridad.bloquea_plan; }).length,
  con_pendientes_bloqueo: resultados.filter(function (r) { return r.seguridad && r.seguridad.pendientes_bloqueo && r.seguridad.pendientes_bloqueo.length; }).length,
  mediciones_vinculadas_total: resultados.reduce(function (a, r) { return a + (r.mediciones_vinculadas_n || 0); }, 0),
  mediciones_sin_vincular_total: resultados.reduce(function (a, r) { return a + ((r.mediciones_sin_vincular || []).length); }, 0),
  episodios_nuevo_motivo: resultados.filter(function (r) { return r.episodio_analisis && r.episodio_analisis.sospecha; }).map(function (r) { return r.episodio; })
};

fs.writeFileSync(outPath, JSON.stringify({ _resumen: resumen, resultados: resultados }, null, 2));
console.log('Regenerado: ' + outPath);
console.log(JSON.stringify(resumen, null, 2));
