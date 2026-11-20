/* ============================================================================
 * CANDADO — techo FISIOLÓGICO del goniómetro (hallazgo: "Cadera ext 160°" llegó al ROM)
 *
 * Un grado 2D por encima del máximo anatómico del movimiento es casi seguro un ARTEFACTO
 * (escorzo / landmark equivocado / lado reflejo), no una medición → debe ser "no medible"
 * (ok:false) y NO guardarse. Es un escalón más duro que (h) "(revisar)", que solo señala.
 *
 * Node puro (vm + stubs). Usa el hook window.__BIO_GONIO que el módulo ya expone.
 * Correr desde la raíz del repo:
 *   node pruebas/goniometro-techo.test.js medidor-biomecanico.js
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

var G = win.__BIO_GONIO;
if (!G || !G._gonioTecho || !G.GONIO_TECHO || !G.calcularGonio || !G.GONIO_CAT) {
  console.error('FALLO: hook __BIO_GONIO no expone _gonioTecho/GONIO_TECHO/calcularGonio'); process.exit(1);
}

var pass = 0, fail = 0;
function chk(cond, id, msg){ if(cond){ pass++; console.log('  ✓ '+id+' '+msg); } else { fail++; console.log('  ✗ '+id+' '+msg); } }

console.log('\n== CANDADO — techo fisiológico del goniómetro ==');

// T1 — _gonioTecho rechaza lo imposible y deja pasar lo plausible (por movimiento).
chk(G._gonioTecho('Cadera','Extensión',160).ok===false, 'T1a', 'Cadera ext 160° → no medible (techo 50)');
chk(G._gonioTecho('Cadera','Extensión',25).ok===true && G._gonioTecho('Cadera','Extensión',25).val===25, 'T1b', 'Cadera ext 25° → ok, val 25');
chk(G._gonioTecho('Rodilla','Flexión',172).ok===false, 'T1c', 'Rodilla flex 172° → no medible (techo 160)');
chk(G._gonioTecho('Rodilla','Flexión',110).ok===true, 'T1d', 'Rodilla flex 110° → ok');
chk(G._gonioTecho('Tobillo','Dorsiflexión',60).ok===false, 'T1e', 'Tobillo DF 60° → no medible (techo 45)');
chk(G._gonioTecho('Codo','Flexión',170).ok===false && G._gonioTecho('Codo','Flexión',140).ok===true, 'T1f', 'Codo flex 170° no / 140° sí');
chk(G._gonioTecho('Cadera','Flexión',135).ok===true, 'T1g', 'Cadera flex 135° → ok (techo 150, más holgado que ext)');

// T2 — valores no finitos / nulos → no medible (conservador).
chk(G._gonioTecho('Cadera','Flexión',null).ok===false && G._gonioTecho('Cadera','Flexión',NaN).ok===false, 'T2', 'null / NaN → no medible');

// T3 — cobertura: TODO movimiento del catálogo tiene un techo definido (ninguno sin candado).
var sinTecho = G.GONIO_CAT.filter(function(e){ return G.GONIO_TECHO[e.key]==null; }).map(function(e){return e.key;});
chk(sinTecho.length===0, 'T3', 'cada movimiento del catálogo tiene techo (faltan: '+(sinTecho.join(',')||'0')+')');

// T4 — INTEGRACIÓN en calcularGonio: MISMOS landmarks (ángulo interior 45° → grado 135°) →
// Extensión (techo 50) lo RECHAZA, Flexión (techo 150) lo ACEPTA. Prueba que el techo es por-movimiento.
function L(x,y){ return { x:x, y:y, z:0, visibility:1 }; }
var lm = []; for(var i=0;i<33;i++) lm[i]=L(0.5,0.5);
lm[12]=L(0.50,0.40);   // hombro der (arriba)
lm[24]=L(0.50,0.50);   // cadera der (vértice)
lm[26]=L(0.60,0.40);   // rodilla der (arriba-derecha) → ang interior 45° → grado 135°
var rExt = G.calcularGonio(lm,'Cadera','Extensión','der');
var rFlex= G.calcularGonio(lm,'Cadera','Flexión','der');
chk(rExt.ok===false, 'T4a', 'calcularGonio Cadera EXTENSIÓN con grado≈135° → no medible (techo 50)');
chk(rFlex.ok===true && Math.round(rFlex.val)===135, 'T4b', 'calcularGonio Cadera FLEXIÓN mismos landmarks → ok, 135° (techo 150)');

console.log('\nCandado goniómetro: '+pass+' OK, '+fail+' fallidas.');
process.exit(fail ? 1 : 0);
