/* ============================================================================
 * FASE 7 — menores (P2-14): _paqueteTray debe empaquetar trayFrame
 *
 * Node puro (vm + stubs). Antes _dibujarSacro leía paq.trayFrame pero _paqueteTray
 * no lo incluía → caía a usar el nº de cuadro crudo como POSICIÓN (dibujaba el fondo
 * en el lugar equivocado cuando se saltaron cuadros). Esta prueba verifica que el
 * paquete ahora lleva trayFrame y que permite ubicar el fondo por POSICIÓN.
 * (El dibujo en sí y el saveDB diferido de _syncBiomecanicaFS son DOM/Firebase →
 *  verificados por código, no asertables en Node.)
 *
 * Correr desde la raíz del repo:
 *   node pruebas/trayectoria-fondo.test.js medidor-biomecanico.js
 * ==========================================================================*/
'use strict';
var vm = require('vm');
var fs = require('fs');
var path = require('path');

var modPath = process.argv[2] || path.join(__dirname, '..', 'medidor-biomecanico.js');
var src = fs.readFileSync(modPath, 'utf8');

var ins = "window.__BIO_V7 = { _paqueteTray: _paqueteTray };\n";
var cut = src.lastIndexOf('})();');
if (cut < 0) { console.error('No encontré el cierre del IIFE'); process.exit(2); }
src = src.slice(0, cut) + ins + src.slice(cut);

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

var V = win.__BIO_V7;
if (!V || !V._paqueteTray) { console.error('FALLO: hook __BIO_V7 no expuesto'); process.exit(1); }

var pass = 0, fail = 0;
function chk(cond, id, msg){ if(cond){ pass++; console.log('  ✓ '+id+' '+msg); } else { fail++; console.log('  ✗ '+id+' '+msg); } }

// accS con cuadros NO contiguos (0,2,5,9): la posición del slot ≠ nº de cuadro.
var accS = {
  trayN: 4, aspect: 0.5625,
  trayFrame: [0, 2, 5, 9],
  tray: { sacro:[[500,300],[500,340],[500,360],[500,330]], nariz:[], hombroIzq:[], hombroDer:[],
          caderaIzq:[], caderaDer:[], rodillaIzq:[], rodillaDer:[], tobilloIzq:[], tobilloDer:[] },
  s: { sacroY:[{v:0.30},{v:0.34},{v:0.36},{v:0.33}], alturaPx:[{v:0.60},{v:0.61},{v:0.60},{v:0.60}] }
};
var meta = { calidad:{ fpsMuestreo:12 } };
var res = { nReps:1, porRep:[{ frameFondo:5, descPct:12 }], calibracion:{ estaturaCm:170 } };

console.log('\n== FASE 7 — trayFrame en el paquete (P2-14) ==');

var paq = V._paqueteTray(accS, meta, res);
chk(!!paq && Array.isArray(paq.trayFrame) && paq.trayFrame.join(',')==='0,2,5,9', 'T1',
    'el paquete incluye trayFrame = '+(paq&&JSON.stringify(paq.trayFrame)));

// El fondo (cuadro 5) debe ubicarse en la POSICIÓN 2, no en la posición 5.
var idxExacto = paq.trayFrame.indexOf(res.porRep[0].frameFondo);
chk(idxExacto===2, 'T2', 'frameFondo=5 → posición '+idxExacto+' (no el índice crudo 5)');

// Fallback cercano: un frameFondo ausente (6) resuelve al cuadro capturado MÁS cercano (5 → posición 2),
// no al nº 6 como posición (que sería fuera de rango / equivocado).
function nearest(tf, f){ var b=-1,bd=Infinity; for(var i=0;i<tf.length;i++){ var d=Math.abs(tf[i]-f); if(d<bd){bd=d;b=i;} } return b; }
chk(nearest(paq.trayFrame, 6)===2, 'T3', 'frameFondo ausente (6) → cuadro capturado más cercano = posición 2');

console.log('\nFase 7 trayectoria/fondo: '+pass+' OK, '+fail+' fallidas.');
process.exit(fail ? 1 : 0);
