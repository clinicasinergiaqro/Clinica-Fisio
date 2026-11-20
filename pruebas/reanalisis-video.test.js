/* ============================================================================
 * FASE 4 — Reutilizar el mismo video para otro movimiento (hallazgo P1-11)
 *
 * Prueba SIMULADA (Node puro, sin MediaPipe/cámara/video real): verifica la
 * LÓGICA testeable sin reproducir un clip —
 *   (a) al cambiar la selección sobre un video ya analizado, si se conservó el
 *       archivo (BIO.pendingVideo.file), NO se descarta la sesión: se queda en
 *       modo 'estatico' con el video listo para reanalizar;
 *   (b) sin archivo conservado, cae al comportamiento anterior (volver a inicio);
 *   (c) la captura de un pico de VIDEO guarda traza.tSeg (segundo del clip);
 *   (d) la captura de FOTO no lleva tSeg;
 *   (e) _mmss formatea el segundo como M:SS.
 * El recorrido REAL del archivo (procesarVideo re-leyendo el clip con MediaPipe)
 * NO se puede asertar aquí — requiere video real + detector; queda para prueba
 * en equipo físico.
 *
 * Correr desde la raíz del repo:
 *   node pruebas/reanalisis-video.test.js medidor-biomecanico.js
 * ==========================================================================*/
'use strict';
var vm = require('vm');
var fs = require('fs');
var path = require('path');

var modPath = process.argv[2] || path.join(__dirname, '..', 'medidor-biomecanico.js');
var src = fs.readFileSync(modPath, 'utf8');

var ins = "window.__BIO_V4 = { BIO: BIO, BIO_gonioSel: BIO_gonioSel, BIO_gonioCapturar: BIO_gonioCapturar, nuevoAccGonio: nuevoAccGonio, _gonioSelDefault: _gonioSelDefault, _mmss: _mmss };\n";
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

var V = win.__BIO_V4;
if (!V || !V.BIO || !V.BIO_gonioSel || !V.BIO_gonioCapturar || !V.nuevoAccGonio || !V._gonioSelDefault || !V._mmss) {
  console.error('FALLO: hook __BIO_V4 no expuesto'); process.exit(1);
}
var BIO = V.BIO;

var pass = 0, fail = 0;
function chk(cond, id, msg){ if(cond){ pass++; console.log('  ✓ '+id+' '+msg); } else { fail++; console.log('  ✗ '+id+' '+msg); } }
function pose33(){ var a=[]; for(var i=0;i<33;i++) a[i]={x:0.5,y:0.5,visibility:0.9}; return a; }

// Deja el goniómetro en estado "video analizado" (estático, cuadro-pico mostrado).
function prepararVideoEstatico(conArchivo){
  BIO.accG = V.nuevoAccGonio();
  V._gonioSelDefault(BIO.accG);               // sel por defecto: Cadera/Flexión/der, con .key
  BIO.modo = 'estatico';
  BIO._estaticoFuente = 'video';
  BIO._estaticoBase = null;                   // sin canvas → _recalcEstatico sale temprano
  BIO._estaticoLm = pose33();
  BIO._estaticoImg = null;
  BIO.canvas = null; BIO.ctx = null;
  BIO.pendingVideo = conArchivo ? { file:{ type:'video/mp4', name:'clip.mp4' }, mime:'video/mp4', ext:'mp4' } : null;
}

console.log('\n== FASE 4 — reutilizar el mismo video (P1-11) ==');

// R0 — formato de tiempo del pico.
chk(V._mmss(0)==='0:00' && V._mmss(7)==='0:07' && V._mmss(67)==='1:07' && V._mmss(125)==='2:05', 'R0',
    '_mmss formatea M:SS ('+V._mmss(0)+','+V._mmss(7)+','+V._mmss(67)+','+V._mmss(125)+')');

// R1 — con archivo conservado: cambiar la selección NO descarta el video; queda listo para reanalizar.
prepararVideoEstatico(true);
V.BIO_gonioSel('lado','izq');
chk(BIO.modo==='estatico' && BIO._estaticoFuente==='video' && !!(BIO.pendingVideo&&BIO.pendingVideo.file), 'R1',
    'cambio de selección conserva el video para reanalizar (modo='+BIO.modo+', pendingVideo='+(!!(BIO.pendingVideo&&BIO.pendingVideo.file))+')');

// R2 — sin archivo conservado: cae al comportamiento anterior (vuelve a inicio).
prepararVideoEstatico(false);
V.BIO_gonioSel('lado','izq');
chk(BIO.modo===null, 'R2',
    'sin archivo, el cambio de selección vuelve a inicio (modo='+String(BIO.modo)+')');

// R3 — captura de pico de VIDEO: traza lleva tSeg (segundo del clip) y fuente 'video'.
prepararVideoEstatico(true);
BIO.accG.peak = 100;
BIO._peakTSeg = 7.34;
V.BIO_gonioCapturar();
var k3 = BIO.accG.sel.key + '_' + BIO.accG.sel.lado;
var t3 = BIO.accG.medidas[k3] && BIO.accG.medidas[k3].traza;
chk(t3 && t3.tSeg===7.3 && t3.fuente==='video', 'R3',
    'captura de video guarda traza.tSeg='+(t3&&t3.tSeg)+' fuente='+(t3&&t3.fuente));

// R4 — captura de FOTO: sin tSeg aunque _peakTSeg tenga valor residual.
prepararVideoEstatico(true);
BIO._estaticoFuente = 'foto';
BIO.accG.peak = 90;
BIO._peakTSeg = 5;
V.BIO_gonioCapturar();
var k4 = BIO.accG.sel.key + '_' + BIO.accG.sel.lado;
var t4 = BIO.accG.medidas[k4] && BIO.accG.medidas[k4].traza;
chk(t4 && t4.tSeg===null && t4.fuente==='foto', 'R4',
    'captura de foto no lleva tSeg (tSeg='+(t4&&t4.tSeg)+', fuente='+(t4&&t4.fuente)+')');

console.log('\nFase 4 reutilizar video: '+pass+' OK, '+fail+' fallidas.');
process.exit(fail ? 1 : 0);
