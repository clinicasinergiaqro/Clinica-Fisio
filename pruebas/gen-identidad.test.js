/* ============================================================================
 * FASE 3 — Identidad de resultados tardíos (hallazgo P1-6)
 *
 * Prueba SIMULADA (Node puro, sin MediaPipe/cámara/DOM real): un callback de
 * onResults que llega DESPUÉS de un cambio de generación (cambió la fuente o la
 * selección mientras un cuadro seguía en vuelo) NO debe contaminar el acumulador
 * de la medición nueva, y debe contarse en BIO.framesDescartados.
 *
 * Correr desde la raíz del repo:
 *   node pruebas/gen-identidad.test.js medidor-biomecanico.js
 * Sale con código !=0 si algo falla (sirve para CI).
 *
 * Técnica: carga el módulo real con vm + stubs (igual que geometria.test.js /
 * verificacion-auditoria.test.js) y expone onResults + BIO + helpers inyectando
 * window.__BIO_GEN antes del cierre del IIFE. La inyección solo EXPONE; no cambia
 * lógica. Simula los send() empujando el gen a BIO._genQ (lo que hace _genSend).
 * ==========================================================================*/
'use strict';
var vm = require('vm');
var fs = require('fs');
var path = require('path');

var modPath = process.argv[2] || path.join(__dirname, '..', 'medidor-biomecanico.js');
var src = fs.readFileSync(modPath, 'utf8');

var ins = "window.__BIO_GEN = { onResults: onResults, BIO: BIO, _bumpGen: _bumpGen, nuevoAccMarcha: nuevoAccMarcha };\n";
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

var G = win.__BIO_GEN;
if (!G || !G.onResults || !G.BIO || !G._bumpGen || !G.nuevoAccMarcha) {
  console.error('FALLO: hook __BIO_GEN no expuesto'); process.exit(1);
}
var BIO = G.BIO;

var pass = 0, fail = 0;
function chk(cond, id, msg){ if(cond){ pass++; console.log('  ✓ '+id+' '+msg); } else { fail++; console.log('  ✗ '+id+' '+msg); } }

// 33 landmarks cualquiera: calcularMarchaSagital devuelve un frame (truthy) → acumularMarcha incrementa acc.frames.
function pose33(){ var a=[]; for(var i=0;i<33;i++) a[i]={x:0.5,y:0.5,visibility:0.9}; return a; }
var RES = { poseLandmarks: pose33(), poseWorldLandmarks: pose33() };

// Deja BIO en modo "video acumulando marcha", SIN DOM (canvas null) ni cámara (modo!=='camara').
function prepararMarcha(){
  BIO.tipoMedicion = 'marcha';
  BIO.modo = 'video';
  BIO.recording = false;
  BIO.procesandoVideo = true;
  BIO.canvas = null;                       // sin dibujo
  BIO.srcEl = { currentTime: 1, videoWidth: 0 };  // videoWidth 0 → no toca _setAspect
  BIO.accM = G.nuevoAccMarcha();
  BIO._genQ = [];
  BIO.framesDescartados = 0;
  BIO.gen = 7;                             // una generación cualquiera
}
// Simula lo que hace _genSend(): encola el gen vigente al momento del envío.
function simularSend(){ (BIO._genQ || (BIO._genQ=[])).push(BIO.gen||0); }

console.log('\n== FASE 3 — identidad de resultados tardíos (P1-6) ==');

// G1 — FRESCO: send y resultado en la MISMA generación → acumula, 0 descartes.
prepararMarcha();
simularSend();
G.onResults(RES);
chk(BIO.accM.frames === 1 && BIO.framesDescartados === 0, 'G1',
    'resultado de la generación vigente acumula (frames='+BIO.accM.frames+', descartados='+BIO.framesDescartados+')');

// G2 — TARDÍO: send en gen G, luego cambia la generación (fuente/selección), luego llega el resultado viejo
//      → se DESCARTA, el acumulador nuevo queda intacto.
prepararMarcha();
simularSend();           // send en gen 7
G._bumpGen();            // cambió la fuente/selección → gen 8
G.onResults(RES);        // llega el cuadro de gen 7
chk(BIO.accM.frames === 0 && BIO.framesDescartados === 1, 'G2',
    'cuadro de generación anterior NO contamina (frames='+BIO.accM.frames+', descartados='+BIO.framesDescartados+')');

// G3 — FIFO con dos en vuelo: dos sends en gen G, cambia la generación, llegan ambos → ambos descartados.
prepararMarcha();
simularSend(); simularSend();   // dos cuadros en vuelo, gen 7
G._bumpGen();                   // gen 8
G.onResults(RES);
G.onResults(RES);
chk(BIO.accM.frames === 0 && BIO.framesDescartados === 2, 'G3',
    'dos cuadros viejos descartados en orden (frames='+BIO.accM.frames+', descartados='+BIO.framesDescartados+')');

// G4 — AUTO-SANADO: tras drenar un huérfano viejo, un send de la generación NUEVA sí acumula.
prepararMarcha();
simularSend();          // huérfano en gen 7 (p.ej. un send que el watchdog debió soltar)
G._bumpGen();           // gen 8
simularSend();          // send real de la generación nueva (gen 8)
G.onResults(RES);       // saca el huérfano 7 → descarta
G.onResults(RES);       // saca el 8 → acumula
chk(BIO.accM.frames === 1 && BIO.framesDescartados === 1, 'G4',
    'la cola se auto-sana: el cuadro nuevo acumula tras descartar el huérfano (frames='+BIO.accM.frames+', descartados='+BIO.framesDescartados+')');

// G5 — FOTO exenta: un resultado en modo foto nunca pasa por la cola ni cuenta como descarte.
prepararMarcha();
BIO.modo = 'foto';
BIO._fotoRes = null;
G.onResults(RES);
chk(BIO._fotoRes === RES && BIO.framesDescartados === 0 && BIO.accM.frames === 0, 'G5',
    'modo foto se consume por _fotoRes, exento de la cola (descartados='+BIO.framesDescartados+')');

console.log('\nFase 3 identidad de generación: '+pass+' OK, '+fail+' fallidas.');
process.exit(fail ? 1 : 0);
