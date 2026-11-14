/* ============================================================================
 * FASE 6 — comparador honesto + etiquetas (P2-12, P2-13)
 *
 * Node puro (vm + stubs). Cubre, vía window.__BIO_TEST.cmpTablaHTML, lo que I1/I2
 * de la suite del auditor no asertan explícitamente:
 *   H1 banner cuando calidad.algoVersion difiere entre A y B;
 *   H2 sin banner cuando coinciden;
 *   H3 cruce de signo FPPA → nota "Cruzó de valgo a varo" y NO cmp-up;
 *   H4 frontera del margen: Δ<margen → gris (cmp-eq); Δ≥margen → color;
 *   H5 descargo "no validado contra goniómetro físico" en el pie.
 *
 * Correr desde la raíz del repo:
 *   node pruebas/comparador-honesto.test.js medidor-biomecanico.js
 * ==========================================================================*/
'use strict';
var vm = require('vm');
var fs = require('fs');
var path = require('path');

var modPath = process.argv[2] || path.join(__dirname, '..', 'medidor-biomecanico.js');
var src = fs.readFileSync(modPath, 'utf8');

var noop = function(){};
function fakeCtx2d(){ return { clearRect:noop, drawImage:noop, beginPath:noop, moveTo:noop, lineTo:noop,
  stroke:noop, fill:noop, arc:noop, fillText:noop, save:noop, restore:noop, setTransform:noop,
  translate:noop, rotate:noop, fillRect:noop, setLineDash:noop, closePath:noop, measureText:function(){return {width:10};} }; }
var win = {};
var ctx = {
  window: win,
  document: { createElement: function(){ return { getContext: fakeCtx2d, width:0, height:0, style:{}, toBlob:noop }; },
              getElementById: function(){ return null; }, querySelector: function(){ return null; },
              addEventListener: noop, head:{ appendChild:noop }, body:{ appendChild:noop } },
  navigator: { mediaDevices:{} },
  console: console, setTimeout: setTimeout, clearTimeout: clearTimeout,
  setInterval: function(){ return 0; }, clearInterval: noop,
  requestAnimationFrame: noop, cancelAnimationFrame: noop,
  Image: function(){}, URL: { createObjectURL:function(){return '';}, revokeObjectURL:noop },
  fetch: function(){ return Promise.reject(new Error('sin red')); }
};
vm.createContext(ctx);
vm.runInContext(src, ctx, { filename: path.basename(modPath) });

var T = win.__BIO_TEST;
if (!T || typeof T.cmpTablaHTML !== 'function') { console.error('FALLO: __BIO_TEST.cmpTablaHTML no expuesto'); process.exit(1); }

var pass = 0, fail = 0;
function chk(cond, id, msg){ if(cond){ pass++; console.log('  ✓ '+id+' '+msg); } else { fail++; console.log('  ✗ '+id+' '+msg); } }
function gonio(grado, algoVer){ return { tipo:'goniometria', calidad:(algoVer?{algoVersion:algoVer}:undefined),
  medidas:[{ key:'rod_flex', lado:'der', grupo:'Rodilla', mov:'Flexión', grado:grado }] }; }
function sent(media){ return { tipo:'sentadilla', medidas:[{ key:'fppa_der', media:media, unidad:'°' }] }; }

console.log('\n== FASE 6 — comparador honesto (P2-12/13) ==');

// H1 — versiones de algoritmo distintas → banner.
var h1 = T.cmpTablaHTML(gonio(100,'bio-2d-2026-11-13'), gonio(130,'bio-2d-2026-11-14a'));
chk(/Versiones de algoritmo distintas/.test(h1), 'H1', 'algoVersion A≠B → banner de aviso');

// H2 — misma versión → sin banner.
var h2 = T.cmpTablaHTML(gonio(100,'bio-2d-2026-11-14a'), gonio(130,'bio-2d-2026-11-14a'));
chk(!/Versiones de algoritmo distintas/.test(h2), 'H2', 'misma algoVersion → sin banner');

// H3 — cruce de signo FPPA → nota + NO verde.
var h3 = T.cmpTablaHTML(sent(10), sent(-10));
chk(/Cruzó de valgo a varo/.test(h3) && !/cmp-up/.test(h3), 'H3', 'FPPA 10→−10 → nota de cruce, sin cmp-up');

// H4 — frontera del margen (5° por defecto en gonio): Δ4 gris, Δ8 color.
var h4a = T.cmpTablaHTML(gonio(100), gonio(104));   // Δ+4 < 5 → gris
var h4b = T.cmpTablaHTML(gonio(100), gonio(108));   // Δ+8 ≥ 5 → verde (dir up)
chk(!/cmp-up/.test(h4a) && /cmp-up/.test(h4b), 'H4', 'Δ+4 gris (cmp-eq), Δ+8 verde (cmp-up)');

// H5 — descargo de validación en el pie.
chk(/no validado contra goniómetro físico/.test(h4b), 'H5', 'pie con "no validado contra goniómetro físico"');

console.log('\nFase 6 comparador honesto: '+pass+' OK, '+fail+' fallidas.');
process.exit(fail ? 1 : 0);
