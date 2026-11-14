/* ============================================================================
 * HALLAZGO D — verificación del tiempo físico del video (cámara lenta / VFR)
 *
 * Node puro (vm + stubs). Cubre las piezas PURAS y testeables sin DOM:
 *   D1 _gatearTemporalPorTiempo: con tiempoVerificado:false baja confiable de TEMPORAL/ESPACIAL; los ángulos no.
 *   D2 _tiempoMeta: cámara → {true,'camara-vivo'}; video confirmado → {true,'video-confirmado'};
 *                   video sin confirmar → {false,'video-sin-confirmar'}.
 *   D3 cámara en vivo → fuenteTiempo 'camara-vivo', tiempoVerificado true.
 *   D4 "cadencia dudosa anula confirmación": el gate SOLO baja confiable, NUNCA re-habilita — una temporal que
 *      finalizarMarcha marcó confiable:false (por _cadenciaDudosa) sigue false aunque el terapeuta diga "sí".
 *   D5 _sigArchivo estable (misma firma) + _confirmarVelocidadArchivo responde por caché (una vez por archivo),
 *      y sin archivo identificable → false (conservador).
 * El modal y el guardado real son DOM → verificados por código, no asertables en Node.
 *
 * Correr desde la raíz del repo:
 *   node pruebas/tiempo-verificado.test.js medidor-biomecanico.js
 * ==========================================================================*/
'use strict';
var vm = require('vm');
var fs = require('fs');
var path = require('path');

var modPath = process.argv[2] || path.join(__dirname, '..', 'medidor-biomecanico.js');
var src = fs.readFileSync(modPath, 'utf8');

var ins = "window.__BIO_D = { _sigArchivo:_sigArchivo, _tiempoMeta:_tiempoMeta, _gatearTemporalPorTiempo:_gatearTemporalPorTiempo, _confirmarVelocidadArchivo:_confirmarVelocidadArchivo, BIO:BIO };\n";
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

var D = win.__BIO_D;
if (!D || !D._sigArchivo || !D._tiempoMeta || !D._gatearTemporalPorTiempo || !D._confirmarVelocidadArchivo || !D.BIO) {
  console.error('FALLO: hook __BIO_D no expuesto'); process.exit(1);
}

var pass = 0, fail = 0;
function chk(cond, id, msg){ if(cond){ pass++; console.log('  ✓ '+id+' '+msg); } else { fail++; console.log('  ✗ '+id+' '+msg); } }

(async function(){
  console.log('\n== HALLAZGO D — verificación de tiempo (slow-mo) ==');

  // D1 — gate baja temporal/espacial con tiempoVerificado:false; los ángulos se conservan.
  var meds = [
    { key:'cadencia', grupo:'Temporal', confiable:true },
    { key:'paso_long', grupo:'Espacial', confiable:true },
    { key:'rod_pico_der', grupo:'Rodilla', confiable:true }
  ];
  D._gatearTemporalPorTiempo(meds, false);
  chk(meds[0].confiable===false && meds[1].confiable===false && meds[2].confiable===true, 'D1',
      'tiempoVerificado:false → Temporal/Espacial confiable:false, ángulo intacto');

  // D2 — _tiempoMeta.
  var cam=D._tiempoMeta('camara'), vc=D._tiempoMeta('video',true), vn=D._tiempoMeta('video',false);
  chk(cam.tiempoVerificado===true && cam.fuenteTiempo==='camara-vivo', 'D2a', 'cámara → {true, camara-vivo}');
  chk(vc.tiempoVerificado===true && vc.fuenteTiempo==='video-confirmado', 'D2b', 'video confirmado → {true, video-confirmado}');
  chk(vn.tiempoVerificado===false && vn.fuenteTiempo==='video-sin-confirmar', 'D2c', 'video sin confirmar → {false, video-sin-confirmar}');

  // D3 — cámara en vivo (reloj real).
  chk(D._tiempoMeta('camara').fuenteTiempo==='camara-vivo', 'D3', 'cámara en vivo = tiempo real (camara-vivo)');

  // D4 — el gate SOLO baja: una temporal ya false (por _cadenciaDudosa) sigue false aunque tv=true.
  var meds2 = [ { key:'cadencia', grupo:'Temporal', confiable:false } ];   // finalizarMarcha la marcó false por tiempoDudoso
  D._gatearTemporalPorTiempo(meds2, true);
  chk(meds2[0].confiable===false, 'D4', 'cadencia dudosa (confiable:false) NO se re-habilita con tv=true');

  // D5 — firma estable + caché por archivo + sin archivo → false.
  var fA={ name:'clip.mp4', size:1000, lastModified:5 }, fA2={ name:'clip.mp4', size:1000, lastModified:5 }, fB={ name:'otro.mp4', size:2000, lastModified:9 };
  chk(D._sigArchivo(fA)===D._sigArchivo(fA2) && D._sigArchivo(fA)!==D._sigArchivo(fB), 'D5a',
      'firma estable para el mismo archivo, distinta para otro');
  D.BIO._velTiempo = {}; D.BIO._velTiempo[D._sigArchivo(fA)] = true;   // sembrar respuesta previa de ESTE archivo
  var cacheHit = await D._confirmarVelocidadArchivo({ file:fA2 }, false);   // misma firma → responde por caché, sin modal
  chk(cacheHit===true, 'D5b', 'reanálisis del mismo archivo responde por caché (no re-pregunta)');
  var sinArch = await D._confirmarVelocidadArchivo({ file:null }, false);
  chk(sinArch===false, 'D5c', 'sin archivo identificable → false (conservador)');

  console.log('\nHallazgo D verificación de tiempo: '+pass+' OK, '+fail+' fallidas.');
  process.exit(fail ? 1 : 0);
})();
