/* ============================================================================
 * MUÑECA contra el 3.er METACARPIANO (auditoría 2026-11-20) — Node puro, sin DOM.
 * Qué demuestra:
 *   - Con la mano CERRADA (puño), la punta del índice de Pose colapsa junto a la
 *     palma y la fórmula vieja producía un número INVENTADO con ok:true; ahora,
 *     sin detector de mano, eso es {ok:false, motivo:'mano'} (gate endurecido).
 *   - Con Hands (lm0 muñeca → lm9 nudillo medio) el eje se mantiene aunque el
 *     puño esté cerrado → el ángulo sale bien.
 *   - Una mano detectada LEJOS de la muñeca de Pose (mano contraria / detección
 *     suelta) NO se usa.
 *   - El fallback de índice SOLO acepta mano abierta (segmento largo y visible).
 *   - La corrección de aspecto (H1), el techo fisiológico y la marca de
 *     "brazo corto en imagen" (cortoImg) siguen aplicando sobre el eje nuevo.
 * Correr:  node pruebas/gonio-muneca-metacarpiano.test.js   (sale !=0 si falla)
 * ==========================================================================*/
'use strict';
var vm = require('vm');
var fs = require('fs');
var path = require('path');

var src = fs.readFileSync(path.join(__dirname, '..', 'medidor-biomecanico.js'), 'utf8');
var noop = function(){};
function fakeCtx2d(){ return { clearRect:noop, drawImage:noop, beginPath:noop, moveTo:noop, lineTo:noop,
  stroke:noop, fill:noop, arc:noop, fillText:noop, save:noop, restore:noop, setTransform:noop,
  translate:noop, rotate:noop, fillRect:noop, setLineDash:noop, closePath:noop }; }
var win = {};
var ctx = {
  window: win,
  document: { createElement: function(){ return { getContext: fakeCtx2d, width:0, height:0, style:{}, toBlob:noop }; },
              getElementById: function(){ return null; }, querySelector: function(){ return null; },
              addEventListener: noop, body:{ appendChild:noop }, head:{ appendChild:noop } },
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
if (!T.munecaEje || !T.setHandsLm) { console.error('FALLO: faltan los hooks munecaEje / setHandsLm'); process.exit(1); }

var pass = 0, fail = 0;
function ok(cond, msg){ if(cond){ pass++; } else { fail++; console.error('  ✗ ' + msg); } }
function near(a, b, tol, msg){ ok(a!=null && Math.abs(a-b) <= tol, msg + ' (obtuve ' + a + ', esperaba ~' + b + ')'); }

function L(x, y, v){ return { x:x, y:y, visibility:(v==null?0.95:v) }; }
function pose(map){ var a=[]; for(var i=0;i<33;i++) a[i]=L(0.5,0.5,0); for(var k in map) a[+k]=map[k]; return a; }
// Mano de Hands: 21 puntos de relleno + lm0 (muñeca) y lm9 (nudillo del dedo medio).
function mano(l0, l9){ var h=[]; for(var i=0;i<21;i++) h[i]={x:0.5,y:0.5,z:0}; h[0]=l0; h[9]=l9; return h; }
function rad(g){ return g*Math.PI/180; }

var PDer = { E:14, W:16, Ix:20 };   // lado 'der': codo 14, muñeca 16, índice 20

// Geometría base (AR=1): antebrazo HORIZONTAL codo(0.3,0.5)→muñeca(0.6,0.5); flexión = mano hacia abajo.
// mcp a 50° bajo la horizontal (y crece hacia abajo) → flexión esperada 50°.
function lmBase(extra){
  var m = { 14:L(0.3,0.5), 16:L(0.6,0.5) };
  for(var k in (extra||{})) m[+k]=extra[k];
  return pose(m);
}
var HW = { x:0.6, y:0.5, z:0 };
function mcpA(aGrados, largo){ var l=(largo==null?0.12:largo); return { x:0.6+l*Math.cos(rad(aGrados)), y:0.5+l*Math.sin(rad(aGrados)), z:0 }; }

// ── M1) Mano ABIERTA + Hands → ángulo por el 3.er metacarpiano ───────────────
(function(){
  T.setAspect(1,1); T.setHandsLm([ mano(HW, mcpA(50)) ]);
  var r = T.calcularGonio(lmBase(), 'Muñeca', 'Flexión', 'der');
  ok(r && r.ok===true, 'M1a con Hands la muñeca es medible');
  near(r && r.val, 50, 0.8, 'M1b flexión 50° por el eje metacarpiano');
  ok(r && r.eje==='metacarpiano-hands', 'M1c eje reportado = metacarpiano-hands');
  ok(r && r.mano && r.mano.B && r.mano.C, 'M1d el resultado trae los puntos reales (dibujo = número)');
  T.setHandsLm(null);
})();

// ── M2) PUÑO sin Hands → "no medible" honesto (la fórmula vieja INVENTABA) ───
(function(){
  T.setAspect(1,1); T.setHandsLm(null);
  // índice colapsado junto a la palma (puño): segmento muñeca→índice ≈0.025 (gate exige ≥0.09 con este antebrazo)
  var lm = lmBase({ 20:L(0.62,0.515) });
  var viejo = 180 - T.ang2D(lm[14], lm[16], lm[20]);   // lo que la fórmula vieja habría reportado
  ok(viejo > 10, 'M2a (demostración del bug) la fórmula vieja daba un número con el puño: ' + viejo.toFixed(1) + '°');
  var r = T.calcularGonio(lm, 'Muñeca', 'Flexión', 'der');
  ok(r && r.ok===false && r.val===null, 'M2b ahora el puño sin detector de mano es {ok:false}');
  ok(r && r.motivo==='mano', 'M2c con motivo "mano" (→ hint: abre la mano)');
})();

// ── M3) PUÑO CON Hands → el eje 0→9 se mantiene y mide bien ──────────────────
(function(){
  T.setAspect(1,1);
  var lm = lmBase({ 20:L(0.62,0.515) });              // índice colapsado (da igual: no se usa)
  T.setHandsLm([ mano(HW, mcpA(50)) ]);
  var r = T.calcularGonio(lm, 'Muñeca', 'Flexión', 'der');
  ok(r && r.ok===true, 'M3a con Hands el puño cerrado SÍ es medible');
  near(r && r.val, 50, 0.8, 'M3b y el ángulo es el del metacarpiano (50°)');
  T.setHandsLm(null);
})();

// ── M4) Mano detectada LEJOS de la muñeca de Pose → NO se usa ────────────────
(function(){
  T.setAspect(1,1);
  var lejos = { x:0.9, y:0.8, z:0 };                   // dist ~0.42 ≫ max(0.05, 45% del antebrazo 0.3)
  T.setHandsLm([ mano(lejos, { x:0.95, y:0.9, z:0 }) ]);
  var lm = lmBase({ 20:L(0.62,0.515) });               // y el índice está en puño → tampoco hay fallback
  var r = T.calcularGonio(lm, 'Muñeca', 'Flexión', 'der');
  ok(r && r.ok===false && r.motivo==='mano', 'M4 mano lejana (contraria/suelta) no se agarra → no medible');
  T.setHandsLm(null);
})();

// ── M5) Fallback de ÍNDICE solo con mano ABIERTA (sin Hands) ─────────────────
(function(){
  T.setAspect(1,1); T.setHandsLm(null);
  var lm = lmBase({ 20:L(0.6+0.12*Math.cos(rad(50)), 0.5+0.12*Math.sin(rad(50))) });   // índice extendido a 50°
  var r = T.calcularGonio(lm, 'Muñeca', 'Flexión', 'der');
  ok(r && r.ok===true, 'M5a mano abierta sin Hands: el fallback de índice sigue midiendo');
  near(r && r.val, 50, 0.8, 'M5b con el ángulo correcto');
  ok(r && r.eje==='indice-pose', 'M5c y queda trazado que midió el ÍNDICE (menos fiable)');
})();

// ── M6) Corrección de aspecto (H1) sobre el eje nuevo ────────────────────────
(function(){
  // Misma geometría física expresada en un cuadro vertical 1080×1920: codo(240,960)px, muñeca(540,960)px,
  // nudillo a 120px y 50° bajo la horizontal. Con AR corregido el ángulo debe seguir siendo 50°.
  var E={x:240/1080,y:960/1920,visibility:0.95}, W={x:540/1080,y:960/1920,visibility:0.95};
  var M={x:(540+120*Math.cos(rad(50)))/1080, y:(960+120*Math.sin(rad(50)))/1920, z:0};
  var lm = pose({ 14:E, 16:W });
  T.setAspect(1080,1920); T.setHandsLm([ mano({x:W.x,y:W.y,z:0}, M) ]);
  var r = T.calcularGonio(lm, 'Muñeca', 'Flexión', 'der');
  near(r && r.val, 50, 1.0, 'M6 en cuadro 9:16 el ángulo del metacarpiano sale corregido (≈50°)');
  T.setAspect(1,1); T.setHandsLm(null);
})();

// ── M7) El techo fisiológico sigue aplicando (mun_flex ≤ 100°) — contrato V3: el valor se
// CONSERVA con bandera `fueraTecho` (confirmable por el fisio), ya no se descarta como inmedible.
(function(){
  T.setAspect(1,1); T.setHandsLm([ mano(HW, mcpA(130)) ]);   // "flexión" de 140° → por encima del techo
  var r = T.calcularGonio(lmBase(), 'Muñeca', 'Flexión', 'der');
  ok(r && r.ok===true && r.fueraTecho===true && r.val>100, 'M7 un grado sobre el techo queda MARCADO fueraTecho (valor conservado, requiere confirmación; ya no se borra)');
  T.setHandsLm(null);
})();

// ── M8) Brazo muy corto en imagen (fuera de plano probable) → cortoImg ───────
(function(){
  T.setAspect(1,1);
  var lm = pose({ 14:L(0.55,0.5), 16:L(0.6,0.5) });     // antebrazo de 0.05 (<0.09) en imagen
  T.setHandsLm([ mano(HW, mcpA(50)) ]);
  var r = T.calcularGonio(lm, 'Muñeca', 'Flexión', 'der');
  ok(r && r.ok===true && r.cortoImg===true, 'M8 antebrazo corto en imagen → medible pero marcado cortoImg (baja confianza)');
  T.setHandsLm(null);
})();

// ── M9) _munecaEje unitario (prioridad y gates) ──────────────────────────────
(function(){
  T.setAspect(1,1);
  var lm = lmBase({ 20:L(0.6+0.12*Math.cos(rad(50)), 0.5+0.12*Math.sin(rad(50))) });
  var conManos = T.munecaEje(lm, PDer, [ mano(HW, mcpA(50)) ]);
  ok(conManos && conManos.eje==='metacarpiano-hands', 'M9a con Hands gana el metacarpiano aunque el índice esté abierto');
  var sinManos = T.munecaEje(lm, PDer, null);
  ok(sinManos && sinManos.eje==='indice-pose', 'M9b sin Hands y mano abierta → índice');
  var puno = T.munecaEje(lmBase({ 20:L(0.62,0.515) }), PDer, null);
  ok(puno===null, 'M9c sin Hands y puño → null (no medible)');
})();

// ── M10) Visibilidad del codo/muñeca de Pose sigue siendo requisito ──────────
(function(){
  T.setAspect(1,1); T.setHandsLm([ mano(HW, mcpA(50)) ]);
  var lm = lmBase(); lm[14]=L(0.3,0.5,0.1);            // codo no visible
  var r = T.calcularGonio(lm, 'Muñeca', 'Flexión', 'der');
  ok(r && r.ok===false, 'M10 sin codo visible no hay antebrazo → no medible (aunque haya mano)');
  T.setHandsLm(null);
})();

console.log('Muñeca 3.er metacarpiano (auditoría 11-20): ' + pass + ' OK, ' + fail + ' fallidas.');
process.exit(fail ? 1 : 0);
