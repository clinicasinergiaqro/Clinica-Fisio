/* ============================================================================
 * Pruebas de GEOMETRÍA del medidor biomecánico (Node puro, sin DOM ni MediaPipe).
 * Carga medidor-biomecanico.js bajo un contexto con `window`/`document`/`navigator`
 * simulados y ejercita los hooks de `window.__BIO_TEST`:
 *   - Corrección de aspecto de _ang2D en cuadros NO cuadrados (H1).
 *   - Geometría degenerada → "no medible" en el goniómetro.
 *   - Valores del goniómetro (flexión / déficit / hiperextensión).
 *   - Dirección clínica del comparador (Δ verde/rojo/neutro según la métrica, H7).
 *   - Regla de cadencia inverosímil (cámara lenta / fps irregular, H5).
 * Correr:  node pruebas/geometria.test.js     (sale con código !=0 si algo falla)
 * NO prueba MediaPipe, cámara real, Firestore ni validación clínica — solo la
 * matemática pura. El detector de pose y el sync se verifican aparte (smoke/vivo).
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
function near(a, b, tol, msg){ ok(a!=null && Math.abs(a-b) <= tol, msg + ' (obtuve ' + a + ', esperaba ~' + b + ')'); }

// landmark ficticio: visibilidad alta por defecto (para pasar los guardas _vis).
function L(x, y, v){ return { x:x, y:y, visibility:(v==null?0.95:v) }; }
// arma un arreglo de 33 landmarks; se rellenan los índices que pase el caller.
function pose(map){ var a=[]; for(var i=0;i<33;i++) a[i]=L(0.5,0.5,0); for(var k in map) a[+k]=map[k]; return a; }

// ── A) Corrección de aspecto (H1) ────────────────────────────────────────────
// Ángulo recto OBLICUO en píxeles sobre un cuadro vertical 1080×1920 (9:16).
// b=(540,960)px; v1=(+300,+300), v2=(−300,+300) → perpendiculares (90° real).
(function(){
  var b = { x:540/1080, y:960/1920 };
  var a = { x:(540+300)/1080, y:(960+300)/1920 };
  var c = { x:(540-300)/1080, y:(960+300)/1920 };
  T.setAspect(1, 1);                        // sin corregir (como antes del fix)
  var naive = T.ang2D(a, b, c);
  T.setAspect(1080, 1920);                  // corrige por aspecto real 9:16
  var corr = T.ang2D(a, b, c);
  near(corr, 90, 0.6, 'A1 aspecto 9:16 → ángulo recto corregido ≈ 90°');
  ok(naive > 115, 'A2 sin corrección el mismo ángulo sale deformado (>115°): ' + naive.toFixed(1));
  T.setAspect(1, 1);
})();

// ── B) Geometría degenerada → "no medible" ───────────────────────────────────
(function(){
  T.setAspect(1, 1);
  // rodilla y tobillo casi encimados (tracking fallido) → ok:false
  var lmDeg = pose({ 24:L(0.5,0.3), 26:L(0.5,0.5), 28:L(0.505,0.505) });
  var rDeg = T.calcularGonio(lmDeg, 'Rodilla', 'Flexión', 'der');
  ok(rDeg && rDeg.ok === false && rDeg.val === null, 'B1 segmento degenerado → {ok:false,val:null}');
  // rodilla normal flexionada → ok:true
  var lmOK = pose({ 24:L(0.5,0.5), 26:L(0.5,0.7), 28:L(0.7,0.7) });
  var rOK = T.calcularGonio(lmOK, 'Rodilla', 'Flexión', 'der');
  ok(rOK && rOK.ok === true && rOK.val != null, 'B2 rodilla normal → {ok:true}');
})();

// ── C) Valores del goniómetro ────────────────────────────────────────────────
(function(){
  T.setAspect(1, 1);
  // Rodilla recta (colineal vertical) → flexión ≈ 0
  var recta = pose({ 24:L(0.5,0.3), 26:L(0.5,0.5), 28:L(0.5,0.7) });
  near(T.calcularGonio(recta,'Rodilla','Flexión','der').val, 0, 1.0, 'C1 rodilla recta → ~0°');
  // Rodilla a 90°
  var f90 = pose({ 24:L(0.5,0.5), 26:L(0.5,0.7), 28:L(0.7,0.7) });
  near(T.calcularGonio(f90,'Rodilla','Flexión','der').val, 90, 1.0, 'C2 rodilla a 90° → ~90°');
  // Codo a 90° (hombro 12, codo 14, muñeca 16)
  var cod = pose({ 12:L(0.5,0.3), 14:L(0.5,0.5), 16:L(0.7,0.5) });
  near(T.calcularGonio(cod,'Codo','Flexión','der').val, 90, 1.0, 'C3 codo a 90° → ~90°');
  // Etiquetas honestas
  ok(T.gonioFmtGrado({grado:8, hiperext:true}) === '+8° hiperext', 'C4 etiqueta hiperextensión');
  ok(T.gonioFmtGrado({grado:0.4, hiperext:true}) === '0° (neutro)', 'C5 hiperext ~0 → neutro');
  ok(T.gonioFmtGrado({grado:7, defic:true}) === 'déficit 7°', 'C6 etiqueta déficit');
  ok(T.gonioFmtGrado({grado:120}) === '120°', 'C7 etiqueta normal');
  // Alertas: hiperext alerta si rebasa lim; déficit alerta si supera lim
  ok(T.gonioAlerta({grado:12, lim:10, hiperext:true}) === true, 'C8 hiperext 12° (>10) alerta');
  ok(T.gonioAlerta({grado:6, lim:10, hiperext:true}) === false, 'C9 hiperext 6° sin alerta');
})();

// ── D) Dirección clínica del comparador (H7) ─────────────────────────────────
function sesGonio(key, lado, grupo, mov, grado, flags){
  var m = { key:key, lado:lado, grupo:grupo, mov:mov, grado:grado };
  if(flags){ for(var k in flags) m[k]=flags[k]; }
  return { tipo:'goniometria', medidas:[m] };
}
(function(){
  // Flexión que AUMENTA = mejora = verde (cmp-up)
  var h1 = T.cmpTablaHTML(sesGonio('rod_flex','der','Rodilla','Flexión',100), sesGonio('rod_flex','der','Rodilla','Flexión',120));
  ok(/cmp-up/.test(h1) && /\+20/.test(h1), 'D1 ROM flexión +20 → verde (cmp-up)');
  // Déficit que BAJA = mejora = verde (dir down, Δ negativo → cmp-up)
  var h2 = T.cmpTablaHTML(sesGonio('rod_ext','der','Rodilla','Extensión',10,{defic:true}), sesGonio('rod_ext','der','Rodilla','Extensión',4,{defic:true}));
  ok(/cmp-up/.test(h2) && /-6/.test(h2), 'D2 déficit −6 (mejora) → verde (cmp-up)');
  // Déficit que SUBE = empeora = rojo (cmp-dn)
  var h2b = T.cmpTablaHTML(sesGonio('rod_ext','der','Rodilla','Extensión',4,{defic:true}), sesGonio('rod_ext','der','Rodilla','Extensión',10,{defic:true}));
  ok(/cmp-dn/.test(h2b) && /\+6/.test(h2b), 'D3 déficit +6 (empeora) → rojo (cmp-dn)');
  // Sentadilla valgo (FPPA) que BAJA = mejora = verde
  var sentA = { tipo:'sentadilla', medidas:[{ key:'fppa_der', media:12, unidad:'°' }] };
  var sentB = { tipo:'sentadilla', medidas:[{ key:'fppa_der', media:6,  unidad:'°' }] };
  var h3 = T.cmpTablaHTML(sentA, sentB);
  ok(/cmp-up/.test(h3) && /-6/.test(h3), 'D4 FPPA −6 (menos valgo) → verde (cmp-up)');
  // Cadencia (marcha) = métrica NEUTRA → gris (cmp-eq), nunca verde/rojo
  var mA = { tipo:'marcha', cadencia:100, medidas:[] };
  var mB = { tipo:'marcha', cadencia:110, medidas:[] };
  var h4 = T.cmpTablaHTML(mA, mB);
  ok(/\+10/.test(h4) && /cmp-eq/.test(h4), 'D5 cadencia +10 neutra → gris (cmp-eq)');
  ok(!/cmp-up[^.]*\+10/.test(h4), 'D6 cadencia no se colorea de verde');
})();

// ── E) Cadencia inverosímil (cámara lenta / fps irregular, H5) ────────────────
(function(){
  ok(T.cadenciaDudosa(110) === false, 'E1 cadencia 110 plausible');
  ok(T.cadenciaDudosa(20) === false && T.cadenciaDudosa(220) === false, 'E2 límites 20 y 220 válidos');
  ok(T.cadenciaDudosa(null) === false, 'E3 cadencia null no es dudosa');
  ok(T.cadenciaDudosa(600) === true && T.cadenciaDudosa(10) === true && T.cadenciaDudosa(221) === true, 'E4 fuera de rango → dudosa');
})();

// ── Resumen ───────────────────────────────────────────────────────────────────
console.log('\nPruebas geometría biomecánica: ' + pass + ' OK, ' + fail + ' fallidas.');
process.exit(fail ? 1 : 0);
