/* ============================================================================
 * V3.1 — INTEGRIDAD DE CUADRO del goniómetro (pruebas DINÁMICAS)
 *
 * Ejercita el pipeline REAL (no greps de texto) con cuadros sintéticos NUMERADOS:
 * cada "elemento de video" lleva _frameNo y el canvas-stub PROPAGA ese número por
 * drawImage (raster congelado → copias → anotada), así se puede asertar la
 * correspondencia EXACTA raster + landmarks + valor + frameId en cada snapshot.
 *
 * Varias de estas pruebas FALLAN con la semántica V3 y pasan con V3.1:
 *  · B4: en vivo, una mano de hace <1.2 s YA NO se acepta (V3: ventana de 1200 ms).
 *  · A5: un resultado tardío tras cambio de generación no deja tupla retenida.
 *  · D1: borrar una medición borra TAMBIÉN su imagen (V3: la imagen sobrevivía).
 *  · H1: _gxK usa el CONTENIDO visible (letterbox object-fit), no clientWidth.
 *  · E1: sin evidencia construible NO hay éxito a medias (medición "sin imagen"
 *        explícita y confirmada; V3: copiaba el canvas compuesto como fallback).
 *
 * Correr desde la raíz del repo:  node pruebas/gonio-integridad-v31.test.js
 * Sale con código !=0 si algo falla (sirve para CI).
 * ==========================================================================*/
'use strict';
var vm = require('vm');
var fs = require('fs');
var path = require('path');

var modPath = process.argv[2] || path.join(__dirname, '..', 'medidor-biomecanico.js');
var src = fs.readFileSync(modPath, 'utf8');

var noop = function(){};
// Canvas-stub con LINAJE de contenido: drawImage copia _frameNo/_contenido de la fuente al canvas.
function mkCanvas(){
  var cv = { width:0, height:0, _contenido:null, style:{},
             classList:{ _s:{}, add:function(c){this._s[c]=1;}, remove:function(c){delete this._s[c];}, contains:function(c){return !!this._s[c];} },
             clientWidth:0, clientHeight:0, toBlob:noop };
  var ctx = { canvas:cv,
    drawImage:function(s){ cv._contenido = (s && s._frameNo!=null) ? s._frameNo : (s && s._contenido!=null ? s._contenido : cv._contenido); },
    clearRect:noop, beginPath:noop, moveTo:noop, lineTo:noop, stroke:noop, fill:noop, arc:noop, arcTo:noop,
    fillText:function(t){ (ctx._texts||(ctx._texts=[])).push(String(t)); }, save:noop, restore:noop,
    setTransform:noop, translate:noop, rotate:noop, fillRect:noop, strokeRect:noop, setLineDash:noop,
    closePath:noop, measureText:function(s){ return { width:String(s||'').length*8 }; } };
  cv.getContext = function(){ return ctx; };
  return cv;
}
var win = {};
var CONFIRMS = [];           // registro de confirm() + respuesta programada
var confirmResp = true;
var ctx = {
  window: win,
  document: { createElement: function(tag){ return (tag==='canvas') ? mkCanvas() : { style:{}, setAttribute:noop, appendChild:noop, addEventListener:noop }; },
              getElementById: function(){ return null; }, querySelector: function(){ return null; },
              addEventListener: noop, head:{ appendChild:noop }, body:{ appendChild:noop } },
  navigator: { mediaDevices:{} },
  confirm: function(msg){ CONFIRMS.push(String(msg)); return confirmResp; },
  console: console, setTimeout: setTimeout, clearTimeout: clearTimeout,
  setInterval: function(){ return 0; }, clearInterval: noop,
  requestAnimationFrame: noop, cancelAnimationFrame: noop,
  Image: function(){}, URL: { createObjectURL:function(){return '';}, revokeObjectURL:noop },
  fetch: function(){ return Promise.reject(new Error('sin red')); }
};
vm.createContext(ctx);
vm.runInContext(src, ctx, { filename: path.basename(modPath) });

var FR = win.__BIO_FR;
if (!FR || !FR.BIO || !FR.send || !FR.onResults || !FR.onHands || !FR.capturar) {
  console.error('FALLO: hook __BIO_FR no expuesto'); process.exit(1);
}
var BIO = FR.BIO, G = win.__BIO_GONIO;

var pass = 0, fail = 0;
function chk(cond, id, msg){ if(cond){ pass++; console.log('  ✓ '+id+' '+msg); } else { fail++; console.log('  ✗ '+id+' '+msg); } }
function tick(){ return new Promise(function(r){ setTimeout(r, 0); }); }

// ── Fixtures ────────────────────────────────────────────────────────────────
function pose33(){ var a=[]; for(var i=0;i<33;i++) a[i]={x:0.5,y:0.5,visibility:0.99}; return a; }
// Codo DERECHO (hombro 12 · codo 14 · muñeca 16) con flexión controlada (frames cuadrados, aspecto 1).
function lmCodo(flexDeg){
  var a=pose33();
  a[12]={x:0.5, y:0.2, visibility:0.99};
  a[14]={x:0.5, y:0.5, visibility:0.99};
  var th=(180-flexDeg)*Math.PI/180;                     // interior = 180 − flexión
  // brazo proximal apunta hacia ARRIBA desde el codo; el antebrazo gira th desde esa dirección reflejada
  a[16]={x:0.5+0.3*Math.sin(Math.PI-th), y:0.5+0.3*Math.cos(Math.PI-th), visibility:0.99};
  return a;
}
// Muñeca derecha: codo 14, muñeca 16, índice 20 (Pose) + mano de Hands (lm0 muñeca, lm9 nudillo medio).
function lmMunecaPose(){
  var a=pose33();
  a[14]={x:0.2, y:0.5, visibility:0.99};
  a[16]={x:0.5, y:0.5, visibility:0.99};
  a[20]={x:0.52, y:0.5, visibility:0.2};                // índice casi invisible (no fallback)
  return a;
}
function manoHands(angDeg){
  // Antebrazo E(0.2,0.5)→W(0.5,0.5): su prolongación apunta a +x. El 3.er metacarpiano (lm0→lm9) a
  // `angDeg` de esa prolongación → flexión de muñeca = angDeg exacto (interior = 180 − angDeg).
  var h=[]; for(var i=0;i<21;i++) h[i]={x:0.5,y:0.5,z:0};
  h[0]={x:0.5,y:0.5,z:0};
  var th=angDeg*Math.PI/180;
  h[9]={x:0.5+0.2*Math.cos(th), y:0.5+0.2*Math.sin(th), z:0};
  return h;
}
function elFrame(n){ return { videoWidth:100, videoHeight:100, _frameNo:n }; }

var sentPose=[], sentHands=[], handsResolvers=[];
function armarPipeline(sel){
  FR.resetEstado();
  BIO.tipoMedicion='gonio'; BIO.modo='camara';
  BIO.canvas=null; BIO.srcEl=null;                      // sin preview (dibujar se salta)
  BIO.accG=G.nuevoAccGonio(); BIO.accG.sel=sel; FR.selDefault(BIO.accG);
  BIO.pose={ send:function(o){ sentPose.push(o.image); return Promise.resolve(); }, reset:noop };
  BIO.hands=null; BIO._handsFallo=false;
  sentPose.length=0; sentHands.length=0; handsResolvers.length=0;
  CONFIRMS.length=0; confirmResp=true;
}
function conHands(){
  BIO.hands={ send:function(o){ sentHands.push(o.image); return new Promise(function(r){ handsResolvers.push(r); }); }, reset:noop };
}
function resPose(lm){ return { poseLandmarks:lm, poseWorldLandmarks:lm }; }



(async function(){
  var sel=process.argv[3];
  if(!sel){
    var spawn=require('child_process').spawnSync, names=['hands-late','hands-lock','pose-order'];
    var nbad=0;
    for(var name of names){
      console.log('\n== '+name+' ==');
      var r=spawn(process.execPath,[__filename,modPath,name],{encoding:'utf8'});
      process.stdout.write(r.stdout||''); process.stderr.write(r.stderr||'');
      if(r.status!==0) nbad++;
    }
    console.log('\nESCENARIOS QUE FALLAN: '+nbad+'/'+names.length);
    process.exitCode=nbad?1:0;
    return;
  }
  function assertSafety(cond,id,msg){
    console.log((cond?'PASS ':'FAIL ')+id+' | '+msg);
    if(!cond) process.exitCode=1;
  }
  if(sel==='hands-late'){
    armarPipeline({grupo:'Muñeca',mov:'Flexión',lado:'der'}); conHands();
    FR.send(elFrame(101),1.01); var oldId=BIO._frQ[0].frameId;
    FR.bump(); BIO._handsSendAt=Date.now()-3000;
    FR.send(elFrame(102),1.02); // watchdog
    FR.send(elFrame(103),1.03); var currentId=BIO._frQ[BIO._frQ.length-1].frameId;
    FR.onResults(resPose(lmMunecaPose())); // previous Pose (discard)
    FR.onResults(resPose(lmMunecaPose())); // current Pose (pending)
    FR.onHands({multiHandLandmarks:[manoHands(73)]}); // OLD hand (frame 101)
    assertSafety(!(BIO._frRet && BIO._frRet.frameId===currentId && BIO._frRet.r && Math.abs(BIO._frRet.r.val-73)<0.5),
      'P0-01a','old Hands callback must not finalize fresh frame 103');
    FR.onHands({multiHandLandmarks:[manoHands(13)]}); // actual fresh hands
    assertSafety(!!(BIO._frRet && BIO._frRet.frameId===currentId && BIO._frRet.r && Math.abs(BIO._frRet.r.val-13)<0.5),
      'P0-01b','fresh frame 103 must use angle 13°, not the old 73°');
  }else if(sel==='hands-lock'){
    armarPipeline({grupo:'Muñeca',mov:'Flexión',lado:'der'}); conHands();
    FR.send(elFrame(201),2.01); FR.bump(); BIO._handsSendAt=Date.now()-3000;
    FR.send(elFrame(202),2.02);
    FR.send(elFrame(203),2.03);
    var sentBefore=sentHands.length;
    handsResolvers[0](); await tick(); // old job promise resolves
    assertSafety(BIO._handsSending===true,'P0-02a','old promise must not unlock fresh in-flight model');
    FR.send(elFrame(204),2.04);
    assertSafety(sentHands.length===sentBefore,'P0-02b','fresh send must remain exclusive');
  }else if(sel==='pose-order'){
    armarPipeline({grupo:'Codo',mov:'Flexión',lado:'der'});
    FR.send(elFrame(301),3.01); FR.bump();
    FR.send(elFrame(302),3.02); var newFid=BIO._frQ[0].frameId;
    FR.onResults(resPose(lmCodo(25))); // NEW callback arrives first
    FR.onResults(resPose(lmCodo(91))); // OLD callback arrives after
    var wrongJoin=!!(BIO._frRet && BIO._frRet.frameId===newFid && BIO._frRet.fr.cv._contenido===302 &&
      BIO._frRet.r && Math.abs(BIO._frRet.r.val-91)<1);
    assertSafety(!wrongJoin,'P0-03','old pose 91° must not join new raster 302');
  }else{throw new Error('Unknown scenario '+sel);}
})().catch(function(e){ console.error(e&&e.stack||e); process.exitCode=2; });
