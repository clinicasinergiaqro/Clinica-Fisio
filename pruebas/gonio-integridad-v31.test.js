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

console.log('\n== A) Identidad de cuadro (cámara, frames sintéticos numerados) ==');
armarPipeline({ grupo:'Codo', mov:'Flexión', lado:'der' });
FR.send(elFrame(1), 0.10);
FR.send(elFrame(2), 0.20);
var q0=BIO._frQ.slice();
chk(q0.length===2 && q0[0].frameId!==q0[1].frameId, 'A1a', 'dos envíos → dos contextos con frameId DISTINTO');
chk(q0[0].fr.cv._contenido===1 && q0[1].fr.cv._contenido===2 && q0[0].fr!==q0[1].fr,
    'A1b', 'cada envío congela SU raster del pool (contenido 1 y 2, buffers distintos — sin reuso en vuelo)');
var fid1=q0[0].frameId, fid2=q0[1].frameId;
FR.onResults(resPose(lmCodo(30)));
chk(BIO._frRet && BIO._frRet.frameId===fid1 && BIO._frRet.fr.cv._contenido===1,
    'A2a', 'resultado 1 → tupla retenida del frameId 1 con el raster de contenido 1');
var v1=BIO._frRet.r && BIO._frRet.r.val;
FR.onResults(resPose(lmCodo(60)));
chk(BIO._frRet.frameId===fid2 && BIO._frRet.fr.cv._contenido===2 && Math.abs(BIO._frRet.r.val-60)<1.5 && Math.abs(v1-30)<1.5,
    'A2b', 'resultado 2 → tupla del frameId 2 (raster 2) y CADA valor corresponde a SUS landmarks (30°/60°)');
chk(BIO._frQ.length===0 && BIO._frPool.filter(function(f){return f.busy;}).length===1,
    'A2c', 'cola vacía y solo el raster RETENIDO sigue ocupado (los demás volvieron al pool)');

// Captura "cuadro actual" = snapshot del frame retenido, no del stream
FR.capturar('actual');
var key=Object.keys(BIO.accG.medidas)[0];
var m=BIO.accG.medidas[key];
chk(!!m && m.traza.frameId===fid2 && m.traza.cuadro==='actual',
    'A3a', 'captura "actual" sella el frameId EXACTO del cuadro retenido (traza.cuadro=actual)');
chk(BIO.accG.imgs[key] && BIO.accG.imgs[key].canvas && BIO.accG.imgs[key].canvas._contenido===2,
    'A3b', 'la imagen capturada desciende del raster congelado 2 (no se re-copió el stream visible)');
chk(m.traza.metodo==='pose-2d' && typeof m.traza.capturadoEn==='string' && m.traza.capturadoEn.length>5
    && m.traza.seleccion && m.traza.seleccion.grupo==='Codo' && m.traza.resExport && m.traza.resExport.w>0,
    'A3c', 'traza V3.1: metodo + capturadoEn + seleccion + resolución de export');

// Pico: exige 3 cuadros válidos seguidos; el snapshot es del cuadro que FIJÓ el pico
delete BIO.accG.medidas[key]; delete BIO.accG.imgs[key]; BIO.accG.peak=null; BIO.accG.run=0;
var fidPeak=null;
[101,102,103].forEach(function(n){ FR.send(elFrame(n), n/100); fidPeak=BIO._frQ[BIO._frQ.length-1].frameId; FR.onResults(resPose(lmCodo(95))); });
chk(BIO.accG.peak!=null && Math.abs(BIO.accG.peak-95)<1.5 && BIO._livePeakCv && BIO._livePeakCv._contenido===103
    && BIO._livePeakFrameId===fidPeak,
    'A4a', 'el pico congela el raster del cuadro que lo produjo (contenido 103, frameId exacto)');
FR.capturar('pico');
var kp=Object.keys(BIO.accG.medidas)[0], mp=BIO.accG.medidas[kp];
chk(!!mp && mp.traza.frameId===fidPeak && mp.traza.cuadro==='pico' && BIO.accG.imgs[kp].canvas._contenido===103,
    'A4b', 'captura del pico: frameId + imagen del MISMO cuadro del pico');

// A5 — resultado TARDÍO tras cambio de generación: se descarta y no deja tupla
armarPipeline({ grupo:'Codo', mov:'Flexión', lado:'der' });
FR.send(elFrame(7), 0.3);
var dBefore=BIO.framesDescartados||0;
FR.bump();                                             // cambio de selección/fuente (o watchdog)
chk(BIO._frQ.length===0 && BIO._frRet===null, 'A5a', 'el bump barre contextos en vuelo y la tupla retenida');
FR.onResults(resPose(lmCodo(50)));
chk((BIO.framesDescartados||0)===dBefore+1 && BIO._frRet===null && Object.keys(BIO.accG.medidas).length===0,
    'A5b', 'el callback tardío se DESCARTA: no deja tupla ni medida (resultado tardío jamás se guarda)');
chk(BIO._frPool.every(function(f){ return !f.busy; }), 'A5c', 'todos los rasters del pool quedaron liberados');

console.log('\n== B) Hands en LOCKSTEP por frameId (muñeca) ==');
armarPipeline({ grupo:'Muñeca', mov:'Flexión', lado:'der' });
conHands();
FR.send(elFrame(11), 0.5);
chk(sentPose.length===1 && sentHands.length===1 && sentPose[0]===sentHands[0] && sentPose[0]._contenido===11,
    'B1', 'pose y Hands reciben EL MISMO raster congelado (contenido 11)');
var fidM=BIO._frQ[0].frameId;
FR.onResults(resPose(lmMunecaPose()));
chk(BIO._frPend && BIO._frPend.frameId===fidM && BIO._frRet===null,
    'B2a', 'pose llegó primero → el cuadro queda DIFERIDO esperando la mano de ESTE frameId');
FR.onHands({ multiHandLandmarks:[ manoHands(40) ] });
chk(BIO._frPend===null && BIO._frRet && BIO._frRet.frameId===fidM
    && BIO._frRet.r && BIO._frRet.r.ok && BIO._frRet.r.eje==='metacarpiano-hands' && Math.abs(BIO._frRet.r.val-40)<1.5,
    'B2b', 'la mano del MISMO cuadro completa el diferido: eje metacarpiano y valor de ESA mano (40°)');
handsResolvers.forEach(function(r){ r(); }); await tick();

// B3 — Hands ocupado → el cuadro siguiente SE SALTA completo (menor FPS verificable)
var pBefore=sentPose.length;
FR.send(elFrame(12), 0.6);                             // hands libre → va
var qLen=BIO._frQ.length;
FR.send(elFrame(13), 0.7);                             // hands AÚN procesando el 12 → se salta
chk(sentPose.length===pBefore+1 && BIO._frQ.length===qLen,
    'B3', 'con Hands ocupado el cuadro se SALTA entero (ni pose ni contexto): FPS menor pero verificable');
FR.onResults(resPose(lmMunecaPose()));                  // pose del 12 → diferido
FR.onHands({ multiHandLandmarks:[ manoHands(25) ] });   // mano del 12
handsResolvers.forEach(function(r){ r(); }); await tick();

// B4 — LA PRUEBA QUE FALLA EN V3: una mano "fresca" (<1.2 s) de OTRO cuadro ya no se acepta
BIO._handsLm=[ manoHands(70) ]; BIO._handsLmTs=Date.now();   // V3: _handsActuales la devolvería
BIO._frProcHands=null;                                        // no hay cuadro en proceso
chk(FR.handsActuales()===null,
    'B4', 'fuera del cuadro emparejado _handsActuales devuelve null (V3 devolvía la mano de <1200 ms → mezcla)');

console.log('\n== D) Borrado: la evidencia muere con su medición ==');
armarPipeline({ grupo:'Codo', mov:'Flexión', lado:'der' });
FR.send(elFrame(21), 1.0); FR.onResults(resPose(lmCodo(45)));
FR.capturar('actual');
var kd=Object.keys(BIO.accG.medidas)[0];
chk(!!BIO.accG.imgs[kd], 'D0', '(precondición) la captura dejó imagen');
FR.borrar(kd);
chk(!BIO.accG.medidas[kd] && !BIO.accG.imgs[kd],
    'D1', 'BIO_gonioBorrar elimina medida E imagen (V3 dejaba la imagen huérfana)');

console.log('\n== E) Captura TRANSACCIONAL ==');
armarPipeline({ grupo:'Codo', mov:'Flexión', lado:'der' });
FR.send(elFrame(31), 1.1); FR.onResults(resPose(lmCodo(45)));
BIO._frRet.fr.cv.width=0;                              // la evidencia no puede construirse (copia imposible)
confirmResp=false;                                     // el fisio NO acepta "sin imagen"
FR.capturar('actual');
chk(Object.keys(BIO.accG.medidas).length===0 && CONFIRMS.some(function(c){ return /SIN imagen/i.test(c); }),
    'E1a', 'sin evidencia y sin confirmación NO se persiste nada (transacción abortada, confirm mostrado)');
confirmResp=true;
FR.capturar('actual');
var ke=Object.keys(BIO.accG.medidas)[0];
chk(!!ke && BIO.accG.medidas[ke].traza.sinImagen===true && !BIO.accG.imgs[ke],
    'E1b', 'confirmada, la medición queda registrada EXPLÍCITAMENTE "sin imagen" (jamás el canvas compuesto)');

console.log('\n== F) Precisión original + unidades de muñeca ==');
armarPipeline({ grupo:'Codo', mov:'Flexión', lado:'der' });
FR.send(elFrame(41), 1.2); FR.onResults(resPose(lmCodo(33.37)));
var exact=BIO._frRet.r.val;
FR.capturar('actual');
var kf=Object.keys(BIO.accG.medidas)[0], mf=BIO.accG.medidas[kf];
chk(Math.abs(mf.traza.valCrudo-exact)<1e-5 && mf.grado===Math.round(exact*10)/10,
    'F1', 'valCrudo conserva la precisión ORIGINAL (1e-6) y "grado" es solo presentación (0.1°)');
armarPipeline({ grupo:'Muñeca', mov:'Flexión', lado:'der' });
conHands();
FR.send(elFrame(42), 1.3);
FR.onResults(resPose(lmMunecaPose()));
FR.onHands({ multiHandLandmarks:[ manoHands(35) ] });
handsResolvers.forEach(function(r){ r(); }); await tick();
FR.capturar('actual');
var km=Object.keys(BIO.accG.medidas)[0], mm=BIO.accG.medidas[km];
chk(!!mm && mm.traza.dPoseHandsUnidad==='norm-aspecto' && mm.traza.dPoseHandsPx!=null
    && Math.abs(mm.traza.dPoseHandsPx - mm.traza.dPoseHands*100)<0.2 && mm.traza.dPoseHandsPropAntebrazo!=null,
    'F2', 'dPoseHands con UNIDAD declarada + equivalencia en px del cuadro + proporción del antebrazo');

console.log('\n== G) Dirección anatómica: hiperextensión exige confirmación ==');
armarPipeline({ grupo:'Rodilla', mov:'Hiperextensión', lado:'der' });
var lmRod=pose33(); lmRod[24]={x:0.5,y:0.2,visibility:0.99}; lmRod[26]={x:0.5,y:0.5,visibility:0.99};
lmRod[28]={x:0.5+0.3*Math.sin(8*Math.PI/180), y:0.8-0.3*(1-Math.cos(8*Math.PI/180)), visibility:0.99};
FR.send(elFrame(51), 1.4); FR.onResults(resPose(lmRod));
confirmResp=false; CONFIRMS.length=0;
FR.capturar('actual');
chk(Object.keys(BIO.accG.medidas).length===0 && CONFIRMS.some(function(c){ return /HIPEREXTENSIÓN/.test(c); }),
    'G1', 'sin confirmación visual NO se persiste la hiperextensión (2D no puede firmar la dirección)');
confirmResp=true;
FR.capturar('actual');
var kg=Object.keys(BIO.accG.medidas)[0];
chk(!!kg && BIO.accG.medidas[kg].traza.revision==='confirmada' && BIO.accG.medidas[kg].traza.dirAnatomica==='porConfirmar',
    'G2', 'confirmada → revision "confirmada" y dirAnatomica sigue declarada "porConfirmar"');

console.log('\n== H) _gxK por CONTENIDO real (letterbox + zoom) ==');
var cvH=mkCanvas(); cvH.width=1000; cvH.height=1600; cvH.clientWidth=390; cvH.clientHeight=300;
var kH=FR.gxK(cvH.getContext(), 1000);
chk(Math.abs(kH - 1/Math.min(390/1000, 300/1600)) < 1e-6,
    'H1', 'con letterbox vertical _gxK = 1/esc del CONTENIDO (V3 usaba clientWidth → 2× más chico)');
cvH.classList.add('bio-interactivo'); BIO._zoom={ s:2, tx:0, ty:0 };
var kH2=FR.gxK(cvH.getContext(), 1000);
chk(Math.abs(kH2 - kH/2) < 1e-6, 'H2', 'con zoom 2× la escala se divide: tamaño ÓPTICO estable en pantalla');
BIO._zoom={ s:1, tx:0, ty:0 };

console.log('\n== I) Enfocar articulación: recorte virtual NO destructivo ==');
armarPipeline({ grupo:'Codo', mov:'Flexión', lado:'der' });
BIO.modo='estatico';
var base=mkCanvas(); base.width=1000; base.height=800; base.clientWidth=390; base.clientHeight=312;
BIO.canvas=base; BIO._estaticoBase=base; BIO._estaticoLm=lmCodo(60); BIO._estaticoR={ ok:true, val:60 };
var lmAntes=JSON.stringify(BIO._estaticoLm);
FR.enfocar();
var z=FR.zoomEstado();
chk(z && z.s>1 && isFinite(z.tx) && isFinite(z.ty), 'I1', 'Enfocar aplica zoom+pan de la transformación afín (s>1)');
chk(JSON.stringify(BIO._estaticoLm)===lmAntes, 'I2', 'los puntos del ORIGINAL no cambian (recorte virtual, no destructivo)');
FR.enfocar();
chk(FR.zoomEstado().s===1, 'I3', 'segundo toque = vista completa (toggle)');

console.log('\n== J) Línea de tiempo del video (UI honesta) ==');
armarPipeline({ grupo:'Codo', mov:'Flexión', lado:'der' });
BIO.modo='estatico'; BIO._estaticoFuente='video'; BIO.pendingVideo={ file:{} };
BIO._vidDur=12.4; BIO._peakTSeg=3.5; BIO._vidCands=[{ t:2.0, val:40, frameId:9 },{ t:3.5, val:55, frameId:10 }];
var html=FR.videoUI();
chk(/Cuadro anterior/.test(html) && /Cuadro siguiente/.test(html) && /max="12.4"/.test(html),
    'J1', 'línea de tiempo con la duración real + pasos de cuadro');
chk(/aproximado/.test(html) && /Mejor rango/.test(html) && /55/.test(html),
    'J2', 'declara el seek APROXIMADO y lista los candidatos de mejor rango');

console.log('\nIntegridad V3.1: '+pass+' OK, '+fail+' fallidas.');
process.exit(fail?1:0);
})().catch(function(e){ console.error('EXCEPCIÓN:', e && e.stack || e); process.exit(2); });
