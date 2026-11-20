/* ============================================================================
 * TECHO FISIOLÓGICO del goniómetro — contrato V3 (2ª revisión independiente, 2026-11-20)
 *
 * ANTES (candado -18a): un grado por encima del techo era "no medible" (ok:false) y se
 * descartaba. Eso atrapaba artefactos (escorzo "Cadera ext 160°") pero BORRABA patología
 * real severa (un déficit de extensión de codo de ~90° > techo 30° quedaba inmedible).
 *
 * AHORA (V3 P0-4): el valor SE CONSERVA con bandera `fueraTecho` →
 *   · el PICO automático EN VIVO lo sigue ignorando (el candado anti-artefactos queda intacto:
 *     un escorzo de 160° NO se vuelve el pico),
 *   · en foto / cuadro-pico / cuadro actual el fisio lo VE con aviso y solo puede guardarlo
 *     CONFIRMANDO manualmente (la captura exige confirm(); revision 'confirmada'),
 *   · al mostrarse/guardarse queda rotulado "(supera techo)" y en alerta.
 *
 * Node puro (vm + stubs). Hooks: window.__BIO_GONIO + window.__BIO_GFX.
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

var G = win.__BIO_GONIO, X = win.__BIO_GFX;
if (!G || !G._gonioTecho || !G.GONIO_TECHO || !G.calcularGonio || !G.GONIO_CAT || !X || !X.procesarGonioFrame) {
  console.error('FALLO: hooks __BIO_GONIO/__BIO_GFX incompletos'); process.exit(1);
}

var pass = 0, fail = 0;
function chk(cond, id, msg){ if(cond){ pass++; console.log('  ✓ '+id+' '+msg); } else { fail++; console.log('  ✗ '+id+' '+msg); } }

console.log('\n== TECHO fisiológico — bandera confirmable (V3) ==');

// T1 — _gonioTecho CONSERVA el valor y lo marca; lo plausible pasa limpio.
var t1=G._gonioTecho('Cadera','Extensión',160);
chk(t1.ok===true && t1.val===160 && t1.fueraTecho===true && t1.techo===50, 'T1a', 'Cadera ext 160° → ok + fueraTecho (techo 50), valor CONSERVADO');
var t1b=G._gonioTecho('Cadera','Extensión',25);
chk(t1b.ok===true && t1b.val===25 && !t1b.fueraTecho, 'T1b', 'Cadera ext 25° → ok, sin bandera');
chk(G._gonioTecho('Rodilla','Flexión',172).fueraTecho===true, 'T1c', 'Rodilla flex 172° → fueraTecho (techo 160)');
chk(!G._gonioTecho('Rodilla','Flexión',110).fueraTecho, 'T1d', 'Rodilla flex 110° → limpio');
chk(G._gonioTecho('Tobillo','Dorsiflexión',60).fueraTecho===true, 'T1e', 'Tobillo DF 60° → fueraTecho (techo 45)');
chk(G._gonioTecho('Codo','Flexión',170).fueraTecho===true && !G._gonioTecho('Codo','Flexión',140).fueraTecho, 'T1f', 'Codo flex 170° marcado / 140° limpio');
// La razón clínica del cambio: una CONTRACTURA real severa (déficit 90° > techo 30°) YA NO se borra.
var t1g=G._gonioTecho('Codo','Extensión',90);
chk(t1g.ok===true && t1g.val===90 && t1g.fueraTecho===true, 'T1g', 'déficit de extensión 90° (patología real) → se CONSERVA con bandera, no se borra');

// T2 — valores no finitos / nulos siguen siendo no medibles (conservador).
chk(G._gonioTecho('Cadera','Flexión',null).ok===false && G._gonioTecho('Cadera','Flexión',NaN).ok===false, 'T2', 'null / NaN → no medible');

// T3 — cobertura: TODO movimiento del catálogo tiene un techo definido.
var sinTecho = G.GONIO_CAT.filter(function(e){ return G.GONIO_TECHO[e.key]==null; }).map(function(e){return e.key;});
chk(sinTecho.length===0, 'T3', 'cada movimiento del catálogo tiene techo (faltan: '+(sinTecho.join(',')||'0')+')');

// T4 — INTEGRACIÓN en calcularGonio: MISMOS landmarks (interior 45° → grado 135°) →
// Extensión (techo 50) lo marca fueraTecho CONSERVANDO el valor; Flexión (techo 150) sale limpio.
function L(x,y){ return { x:x, y:y, z:0, visibility:1 }; }
var lm = []; for(var i=0;i<33;i++) lm[i]=L(0.5,0.5);
lm[12]=L(0.50,0.40);   // hombro der (arriba)
lm[24]=L(0.50,0.50);   // cadera der (vértice)
lm[26]=L(0.60,0.40);   // rodilla der (arriba-derecha) → ang interior 45° → grado 135°
var rExt = G.calcularGonio(lm,'Cadera','Extensión','der');
var rFlex= G.calcularGonio(lm,'Cadera','Flexión','der');
chk(rExt.ok===true && Math.round(rExt.val)===135 && rExt.fueraTecho===true, 'T4a', 'calcularGonio Cadera EXTENSIÓN 135° → ok + fueraTecho (valor visible, confirmable)');
chk(rFlex.ok===true && Math.round(rFlex.val)===135 && !rFlex.fueraTecho, 'T4b', 'calcularGonio Cadera FLEXIÓN mismos landmarks → ok limpio (techo 150)');

// T5 — EL PICO EN VIVO SIGUE BLINDADO: un cuadro fueraTecho NO alimenta el pico automático
// (el candado anti-artefactos de -18a se conserva; solo cambió de "borrar" a "no auto-tomar").
var acc = G.nuevoAccGonio();
acc.sel = { grupo:'Cadera', mov:'Extensión', lado:'der', agg:'max', key:'cad_ext' };
X._setAccG(acc);
var okFrame   = { ok:true, val:25 };
var fueraFrame= { ok:true, val:160, fueraTecho:true, techo:50 };
X.procesarGonioFrame(okFrame); X.procesarGonioFrame(okFrame); X.procesarGonioFrame(okFrame);   // 3 válidos → pico 25
chk(acc.peak===25, 'T5a', '3 cuadros válidos de 25° → pico 25');
X.procesarGonioFrame(fueraFrame); X.procesarGonioFrame(fueraFrame); X.procesarGonioFrame(fueraFrame);
chk(acc.peak===25, 'T5b', '3 cuadros de 160° fueraTecho NO mueven el pico (sigue 25) — candado intacto');
X.procesarGonioFrame({ ok:true, val:28 });
chk(acc.peak===28, 'T5c', 'un valor válido posterior (28°) SÍ actualiza el pico (la racha run no se rompió)');
X._setAccG(null);

// T6 — presentación/alerta retroactivas: una medida >techo queda "(supera techo)" y en alerta.
var mSup = { grupo:'Cadera', mov:'Extensión', lado:'der', grado:160, ref:30, lim:15 };
chk(/\(supera techo\)/.test(G._gonioFmtGrado(mSup)), 'T6a', 'fmt de 160° → "(supera techo)"');
chk(G._gonioAlerta(mSup)===true, 'T6b', 'medida >techo → alerta');
var mOkv = { grupo:'Cadera', mov:'Extensión', lado:'der', grado:25, ref:30, lim:15 };
chk(!/supera techo/.test(G._gonioFmtGrado(mOkv)), 'T6c', '25° limpio → sin marcador');

console.log('\nTecho (bandera confirmable): '+pass+' OK, '+fail+' fallidas.');
process.exit(fail ? 1 : 0);
