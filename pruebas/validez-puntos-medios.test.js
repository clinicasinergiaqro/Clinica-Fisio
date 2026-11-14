/* ============================================================================
 * FASE 1b — validez de PUNTOS MEDIOS + codo/hombro no-medible (contra-revisión O1)
 *
 * Node puro (vm + stubs), sin MediaPipe. Cubre:
 *   M1 (O1 marcha): cadera izq NaN con visibilidad alta → footIzq.ok=false y sacroX=null
 *                   (antes: footIzq={val:NaN, ok:true}, sacroX=NaN entraban a los eventos).
 *   S1 (O1 sentadilla): midline NaN → el FPPA CONTRALATERAL no queda ok:true con signo posiblemente
 *                   invertido; queda ok:false. Control: con pose finita, fppaDer SÍ es ok:true.
 *   A1 (codo degenerado): triple de codo encimado → codo_flex_der ok:false (no 180 falso). Control: ok:true.
 *   A2 (codo mundo NaN): world[16] NaN con lm finito → ok:false (compuerta isFinite(val)).
 *   H1 (_estadoHombro): brazo mundo NaN → dir:null (la métrica no se llena). Control: mundo finito → theta finito.
 *
 * Correr desde la raíz del repo:
 *   node pruebas/validez-puntos-medios.test.js medidor-biomecanico.js
 * ==========================================================================*/
'use strict';
var vm = require('vm');
var fs = require('fs');
var path = require('path');

var modPath = process.argv[2] || path.join(__dirname, '..', 'medidor-biomecanico.js');
var src = fs.readFileSync(modPath, 'utf8');

var ins = "window.__BIO_V1B = { calcularMarchaSagital: calcularMarchaSagital, calcularSentFrontal: calcularSentFrontal, calcularAngulos: calcularAngulos, _estadoHombro: _estadoHombro, _marcoCuerpo: _marcoCuerpo };\n";
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

var X = win.__BIO_V1B;
if (!X || !X.calcularMarchaSagital || !X.calcularSentFrontal || !X.calcularAngulos || !X._estadoHombro || !X._marcoCuerpo) {
  console.error('FALLO: hook __BIO_V1B no expuesto'); process.exit(1);
}

var pass = 0, fail = 0;
function chk(cond, id, msg){ if(cond){ pass++; console.log('  ✓ '+id+' '+msg); } else { fail++; console.log('  ✗ '+id+' '+msg); } }

// Pose de pie, de perfil aproximado, con puntos DISTINTOS y finitos (todos visibles).
function basePose(){
  var P = {
    0:[0.50,0.10], 11:[0.45,0.30], 12:[0.55,0.30], 13:[0.42,0.45], 14:[0.60,0.45],
    15:[0.40,0.60], 16:[0.62,0.60], 23:[0.46,0.55], 24:[0.54,0.55], 25:[0.46,0.75],
    26:[0.54,0.75], 27:[0.46,0.95], 28:[0.54,0.95], 31:[0.46,0.985], 32:[0.54,0.985]
  };
  var a=[]; for(var i=0;i<33;i++) a[i]={x:0.5,y:0.5,visibility:0.9};
  for(var k in P) a[+k]={x:P[k][0], y:P[k][1], visibility:0.9};
  return a;
}
function world3(lm){ var w=[]; for(var i=0;i<33;i++){ var p=lm[i]; w[i]=p?{x:p.x,y:p.y,z:0,visibility:p.visibility}:null; } return w; }

console.log('\n== FASE 1b — validez de puntos medios (O1) + codo/hombro ==');

// M1 — marcha: cadera izq NaN (visibilidad alta) → footIzq y sacroX no deben propagar NaN.
var lmM = basePose(); lmM[23] = { x:NaN, y:0.55, visibility:0.9 };   // cadera izq NaN pero "visible"
var m = X.calcularMarchaSagital(lmM);
chk(m && m.footIzq.ok===false && m.sacroX===null, 'M1',
    'cadera NaN → footIzq.ok='+(m&&m.footIzq.ok)+', sacroX='+(m&&m.sacroX));

// S1 — sentadilla: midline NaN → FPPA contralateral (der) no queda ok:true con signo invertido.
var lmS = basePose(); lmS[23] = { x:NaN, y:0.55, visibility:0.9 };
var s = X.calcularSentFrontal(lmS);
chk(s && s.fppaDer.ok===false, 'S1',
    'midline NaN → fppaDer.ok='+(s&&s.fppaDer.ok)+' (no se acredita un signo posiblemente invertido)');
// Control S1 — pose finita: fppaDer SÍ es medible (la guarda no apaga el caso sano).
var sc = X.calcularSentFrontal(basePose());
chk(sc && sc.fppaDer.ok===true && isFinite(sc.fppaDer.val), 'S1c',
    'control: pose finita → fppaDer.ok=true, val='+(sc&&Math.round(sc.fppaDer.val*10)/10));

// A1 — codo degenerado (triple encimado) → codo_flex_der no medible (no 180 falso).
var lmA = basePose(); lmA[12]={x:0.55,y:0.30,visibility:0.9}; lmA[14]={x:0.55,y:0.30,visibility:0.9}; lmA[16]={x:0.55,y:0.30,visibility:0.9};
var a1 = X.calcularAngulos(world3(lmA), lmA);
chk(a1 && a1['codo_flex_der'] && a1['codo_flex_der'].ok===false, 'A1',
    'codo encimado → codo_flex_der.ok='+(a1&&a1['codo_flex_der']&&a1['codo_flex_der'].ok)+' val='+(a1&&a1['codo_flex_der']&&a1['codo_flex_der'].val));
// Control A1 — codo no degenerado: medible.
var lmAc = basePose();
var ac = X.calcularAngulos(world3(lmAc), lmAc);
chk(ac && ac['codo_flex_der'] && ac['codo_flex_der'].ok===true && isFinite(ac['codo_flex_der'].val), 'A1c',
    'control: codo normal → ok=true val='+(ac&&ac['codo_flex_der']&&Math.round(ac['codo_flex_der'].val)));

// A2 — codo con MUNDO NaN (lm finito no degenerado) → compuerta isFinite(val) → no medible.
var lmA2 = basePose(); var wA2 = world3(lmA2); wA2[16] = { x:NaN, y:0.60, z:0, visibility:0.9 };
var a2 = X.calcularAngulos(wA2, lmA2);
chk(a2 && a2['codo_flex_der'] && a2['codo_flex_der'].ok===false, 'A2',
    'mundo NaN → codo_flex_der.ok='+(a2&&a2['codo_flex_der']&&a2['codo_flex_der'].ok)+' val='+(a2&&a2['codo_flex_der']&&a2['codo_flex_der'].val));

// H1 — _estadoHombro con brazo (mundo) NaN → dir:null (sin métrica). Control: mundo finito → theta finito.
var lmH = basePose(); var wH = world3(lmH); wH[11] = { x:NaN, y:0.30, z:0, visibility:0.9 };
var marcoH = X._marcoCuerpo(wH);
var estH = X._estadoHombro(wH, lmH, marcoH||{up:{x:0,y:-1,z:0},lateral:{x:1,y:0,z:0},forward:{x:0,y:0,z:1}}, 11, 13);
chk(estH && estH.dir===null && !isFinite(estH.theta), 'H1',
    'brazo mundo NaN → dir='+(estH&&String(estH.dir))+', theta finito='+(estH&&isFinite(estH.theta)));
var wHc = world3(basePose());
var estHc = X._estadoHombro(wHc, basePose(), X._marcoCuerpo(wHc), 11, 13);
chk(estHc && isFinite(estHc.theta), 'H1c',
    'control: mundo finito → theta finito ('+(estHc&&Math.round(estHc.theta))+')');

console.log('\nFase 1b validez de puntos medios: '+pass+' OK, '+fail+' fallidas.');
process.exit(fail ? 1 : 0);
