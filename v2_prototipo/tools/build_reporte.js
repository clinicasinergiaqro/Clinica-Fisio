#!/usr/bin/env node
/* SINERGIA · Construye el HTML del reporte V2.1 SOLO desde un JSON de contratos (render_contrato).
 * Uso:  node v2_prototipo/tools/build_reporte.js <entrada.json> <salida.html>
 * El HTML se imprime a PDF con Chromium:  chrome --headless --no-pdf-header-footer --print-to-pdf=out.pdf salida.html
 * No contiene datos de pacientes: la entrada la provee quien lo corre (fuera del repo).
 */
'use strict';
var fs = require('fs');
var path = require('path');
var RC = require(path.join(__dirname, '..', 'src', 'render_contrato.js'));
var GEN = require(path.join(__dirname, '..', 'src', 'generador_v2.js'));

var inFile = process.argv[2], outFile = process.argv[3] || 'reporte_v2.1.html';
if (!inFile) { console.error('Uso: node build_reporte.js <entrada.json> <salida.html>'); process.exit(2); }

var data = JSON.parse(fs.readFileSync(inFile, 'utf8'));
var arr = Array.isArray(data) ? data : [data];
// Si la entrada son REGISTROS de expediente (no contratos), se generan aquí con el código real.
var contratos = arr.map(function (x) { return (x && x.version_generador) ? x : GEN.generar(x, { fecha_corte: null }); });
var html = RC.renderDoc(contratos, { titulo: 'SINERGIA · Diagnóstico funcional asistido (V2.1 · BORRADOR)', subtitulo: 'Generado ÚNICAMENTE desde el contrato JSON del generador V2.1 · ' + contratos.length + ' caso(s) · requiere validación y firma del fisioterapeuta' });
fs.writeFileSync(outFile, html);
var nombres = html.match(/\b[Dd][Rr][Aa]?\.?\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+/g) || [];
console.log('OK · casos:', contratos.length, '· HTML:', (html.length / 1024).toFixed(1), 'KB · posibles nombres médico en salida:', nombres.length, '→', outFile);
