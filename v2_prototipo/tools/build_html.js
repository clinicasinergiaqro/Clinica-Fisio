#!/usr/bin/env node
/* SINERGIA · Construye el HTML del reporte V2.2 SOLO desde el JSON de resultados (punto 8).
 * El HTML sale 100% del contrato (render_contrato), sin prosa aparte. Luego se imprime a PDF con
 * Chromium headless (ver v2_prototipo/tools/LEEME_pdf.txt). Corrige las tablas cortadas vía CSS de
 * impresión (thead repetido, filas que no se parten, columnas con ancho fijo).
 *
 * Uso: node v2_prototipo/tools/build_html.js [--in <resultados.json>] [--out <reporte.html>]
 */
'use strict';
var fs = require('fs');
var path = require('path');
var R = require('../src/render_contrato.js');

function arg(name, def) { var i = process.argv.indexOf(name); return (i !== -1 && process.argv[i + 1]) ? process.argv[i + 1] : def; }
var BASE = path.join(__dirname, '..');
var inPath = arg('--in', path.join(BASE, 'datos', 'resultados_v22.json'));
var outPath = arg('--out', path.join(BASE, 'datos', 'reporte_v22.html'));

var raw = JSON.parse(fs.readFileSync(inPath, 'utf8'));
var resultados = raw.resultados || raw;
var html = R.renderDoc(resultados, {
  titulo: 'SINERGIA · Diagnóstico funcional asistido (V2.2 · BORRADOR)',
  subtitulo: 'Generado SOLO desde el contrato JSON del generador ' + R.version + ' · ' + resultados.length + ' caso(s) · requiere validación y firma del fisioterapeuta · insumos anonimizados'
});
fs.writeFileSync(outPath, html);
console.log('HTML: ' + outPath + ' (' + html.length + ' bytes, ' + resultados.length + ' casos)');
