/* ============================================================================
 * Pruebas de los HALLAZGOS del análisis de datos 2026-11-14 (Node puro, sin DOM/MediaPipe).
 * Cubre dos correcciones de la MISMA clase "el 2D da un número confiado pero clínicamente
 * imposible cuando la pose está escorzada / poco visible":
 *   (h) Goniómetro: _gonioFueraRango → "(revisar)" + alerta cuando grado > ref+15°
 *       (posible escorzo/fuera de plano), excepto déficit/hiperextensión. Retroactivo.
 *   (i) ROM de brazos: _romConfiable exige piso de visibilidad (≥25%) además de ≥1 rep y ≥12 muestras.
 * Correr:  node pruebas/datos-sospechosos.test.js medidor-biomecanico.js
 * NO prueba MediaPipe/cámara/Firestore — solo la lógica pura expuesta por __BIO_TEST.
 * ==========================================================================*/
'use strict';
var vm = require('vm');
var fs = require('fs');
var path = require('path');

var modArg = process.argv[2] || 'medidor-biomecanico.js';
var src = fs.readFileSync(path.isAbsolute(modArg) ? modArg : path.join(process.cwd(), modArg), 'utf8');
var noop = function(){};
function fakeCtx2d(){ return { clearRect:noop, drawImage:noop, beginPath:noop, moveTo:noop, lineTo:noop,
  stroke:noop, fill:noop, arc:noop, fillText:noop, save:noop, restore:noop, setTransform:noop,
  translate:noop, rotate:noop, fillRect:noop, setLineDash:noop, closePath:noop }; }
var win = {};
var ctx = {
  window: win,
  document: { createElement: function(){ return { getContext: fakeCtx2d, width:0, height:0, style:{}, toBlob:noop }; },
              getElementById: function(){ return null; }, querySelector: function(){ return null; },
              addEventListener: noop, body:{ appendChild:noop } },
  navigator: { mediaDevices:{} },
  console: console, setTimeout: setTimeout, clearTimeout: clearTimeout,
  setInterval: function(){ return 0; }, clearInterval: noop,
  requestAnimationFrame: noop, cancelAnimationFrame: noop,
  Image: function(){}, URL: { createObjectURL:function(){return '';}, revokeObjectURL:noop },
  fetch: function(){ return Promise.reject(new Error('sin red en pruebas')); }
};
vm.createContext(ctx);
vm.runInContext(src, ctx, { filename: 'medidor-biomecanico.js' });

var T = win.__BIO_TEST;
if (!T) { console.error('FALLO: el módulo no expuso window.__BIO_TEST'); process.exit(1); }

var pass = 0, fail = 0;
function ok(cond, msg){ if(cond){ pass++; } else { fail++; console.error('  ✗ ' + msg); } }

console.log('== (h) Goniómetro: fuera de rango / posible escorzo ==');
// casos reales del análisis de datos (expediente ficticio Dafne)
ok(T.gonioFueraRango({grado:160.1, ref:30, defic:false, hiperext:false}) === true,  'H1 cadera ext 160° (ref 30) → fueraRango');
ok(T.gonioFueraRango({grado:172.6, ref:135, defic:false, hiperext:false}) === true, 'H2 rodilla flex 172.6° (ref 135) → fueraRango');
ok(T.gonioFueraRango({grado:129.3, ref:120, defic:false, hiperext:false}) === false,'H3 cadera flex 129.3° (ref 120, <ref+15) → NO fueraRango (borderline legítimo)');
ok(T.gonioFueraRango({grado:106.1, ref:135, defic:false, hiperext:false}) === false,'H4 rodilla flex 106° (<ref) → NO fueraRango');
ok(T.gonioFueraRango({grado:160, ref:30, defic:true}) === false,                    'H5 déficit excluido');
ok(T.gonioFueraRango({grado:160, ref:5,  hiperext:true}) === false,                 'H6 hiperextensión excluida');
ok(T.gonioFueraRango({grado:120}) === false,                                        'H7 sin ref → NO fueraRango (compat sesiones viejas / C7)');
ok(T.gonioAlerta({grado:160.1, ref:30, lim:15, defic:false, hiperext:false}) === true, 'H8 alerta por fuera de rango');
ok(T.gonioFmtGrado({grado:160.1, ref:30, defic:false, hiperext:false}) === '160° (revisar)', 'H9 formato con "(revisar)"');
ok(T.gonioFmtGrado({grado:106.1, ref:135, lim:120, defic:false, hiperext:false}) === '106°', 'H10 en rango → sin "(revisar)"');
// no-regresión de los asserts congelados de geometria (C4..C9)
ok(T.gonioFmtGrado({grado:8, hiperext:true}) === '+8° hiperext', 'H11 hiperext intacto (C4)');
ok(T.gonioFmtGrado({grado:7, defic:true}) === 'déficit 7°',       'H12 déficit intacto (C6)');
ok(T.gonioFmtGrado({grado:120}) === '120°',                      'H13 normal sin ref intacto (C7)');

console.log('== (i) ROM de brazos: piso de visibilidad en confiable ==');
ok(T.romConfiable(2, 180, 99) === true,  'I1 2 reps / 180 muestras / 99% vis → confiable');
ok(T.romConfiable(1, 12, 8)   === false, 'I2 hombro ext 174° a 8% vis (muestras 12) → NO confiable (el caso del análisis)');
ok(T.romConfiable(1, 12, 24)  === false, 'I3 24% vis (just < 25) → NO confiable');
ok(T.romConfiable(2, 12, 25)  === true,  'I4 25% vis (piso) → confiable');
ok(T.romConfiable(0, 180, 99) === false, 'I5 0 reps → NO confiable (gate viejo preservado)');
ok(T.romConfiable(1, 8, 99)   === false, 'I6 <12 muestras → NO confiable (gate viejo preservado)');

console.log('\nDatos sospechosos (h)+(i): ' + pass + ' OK, ' + fail + ' fallidas.');
process.exit(fail ? 1 : 0);
