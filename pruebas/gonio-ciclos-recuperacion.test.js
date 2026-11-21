/* ============================================================================
 * V3.2 — CICLOS DE RECUPERACIÓN del goniómetro (pruebas de aceptación del
 * contrato técnico de la auditoría independiente V3.1→V3.2)
 *
 * Ejercita el pipeline REAL con cuadros sintéticos numerados (mismo harness que
 * P0_callbacks_regresion.test.js / gonio-integridad-v31):
 *  · C1: 100 ciclos enviar → reset → callback tardío (orden ALEATORIO) → reenviar:
 *        CERO asociaciones incorrectas o duplicadas; el ciclo limpio siguiente
 *        empareja exacto (raster + landmarks + valor + frameId del MISMO cuadro).
 *  · C2: 100 ciclos Hands timeout → la promesa vieja resuelve → NO desbloquea el
 *        job nuevo ni permite un 3.er envío; el huérfano se drena y el job nuevo
 *        empareja su mano con su cuadro; la promesa del job nuevo SÍ libera.
 *  · C3: techo DURO del pool (4): el 5.º cuadro se salta SIN enviar y sin crear
 *        buffers extra; ninguna medición se corrompe; el pool se recupera.
 *  · C4: cerrar la vista (resetEstado) durante la inferencia: el callback tardío
 *        no truena, no deja tupla, y NO contamina la sesión re-abierta (la deuda
 *        sobrevive al reset).
 *  · C5: cambio de articulación con resultados pendientes (muñeca → codo): la
 *        mano tardía del cuadro barrido no contamina; el ciclo nuevo empareja.
 *
 * Correr desde la raíz del repo:  node pruebas/gonio-ciclos-recuperacion.test.js
 * Sale con código !=0 si algo falla (sirve para CI).
 * ==========================================================================*/
'use strict';
var vm = require('vm');
var fs = require('fs');
var path = require('path');

var modPath = process.argv[2] || path.join(__dirname, '..', 'medidor-biomecanico.js');
var src = fs.readFileSync(modPath, 'utf8');

var noop = function(){};
function mkCanvas(){
  var cv = { width:0, height:0, _contenido:null, style:{},
             classList:{ _s:{}, add:function(c){this._s[c]=1;}, remove:function(c){delete this._s[c];}, contains:function(c){return !!this._s[c];}, toggle:function(c,on){ if(on===undefined) on=!this._s[c]; if(on) this._s[c]=1; else delete this._s[c]; return !!on; } },
             clientWidth:0, clientHeight:0, toBlob:noop };
  var ctx = { canvas:cv,
    drawImage:function(s){ cv._contenido = (s && s._frameNo!=null) ? s._frameNo : (s && s._contenido!=null ? s._contenido : cv._contenido); },
    clearRect:noop, beginPath:noop, moveTo:noop, lineTo:noop, stroke:noop, fill:noop, arc:noop, arcTo:noop,
    fillText:noop, save:noop, restore:noop,
    setTransform:noop, translate:noop, rotate:noop, fillRect:noop, strokeRect:noop, setLineDash:noop,
    closePath:noop, measureText:function(s){ return { width:String(s||'').length*8 }; } };
  cv.getContext = function(){ return ctx; };
  return cv;
}
var win = {};
var ctx = {
  window: win,
  document: { createElement: function(tag){ return (tag==='canvas') ? mkCanvas() : { style:{}, setAttribute:noop, appendChild:noop, addEventListener:noop }; },
              getElementById: function(){ return null; }, querySelector: function(){ return null; },
              addEventListener: noop, head:{ appendChild:noop }, body:{ appendChild:noop } },
  navigator: { mediaDevices:{} },
  confirm: function(){ return true; },
  console: console, setTimeout: setTimeout, clearTimeout: clearTimeout,
  setInterval: function(){ return 0; }, clearInterval: noop,
  requestAnimationFrame: noop, cancelAnimationFrame: noop,
  Image: function(){}, URL: { createObjectURL:function(){return '';}, revokeObjectURL:noop },
  fetch: function(){ return Promise.reject(new Error('sin red')); }
};
vm.createContext(ctx);
vm.runInContext(src, ctx, { filename: path.basename(modPath) });

var FR = win.__BIO_FR, G = win.__BIO_GONIO;
if (!FR || !FR.BIO || !FR.send || !FR.onResults || !FR.onHands) {
  console.error('FALLO: hook __BIO_FR no expuesto'); process.exit(1);
}
var BIO = FR.BIO;

var pass = 0, fail = 0;
function chk(cond, id, msg){ if(cond){ pass++; console.log('  ✓ '+id+' '+msg); } else { fail++; console.log('  ✗ '+id+' '+msg); } }
function tick(){ return new Promise(function(r){ setTimeout(r, 0); }); }
// LCG determinista (reproducible) para el orden aleatorio de entrega.
var _seed = 20261121;
function rnd(){ _seed = (_seed*1103515245 + 12345) % 2147483648; return _seed/2147483648; }

// ── Fixtures (idénticas al harness de la regresión P0) ──────────────────────
function pose33(){ var a=[]; for(var i=0;i<33;i++) a[i]={x:0.5,y:0.5,visibility:0.99}; return a; }
function lmCodo(flexDeg){
  var a=pose33();
  a[12]={x:0.5, y:0.2, visibility:0.99};
  a[14]={x:0.5, y:0.5, visibility:0.99};
  var th=(180-flexDeg)*Math.PI/180;
  a[16]={x:0.5+0.3*Math.sin(Math.PI-th), y:0.5+0.3*Math.cos(Math.PI-th), visibility:0.99};
  return a;
}
function lmMunecaPose(){
  var a=pose33();
  a[14]={x:0.2, y:0.5, visibility:0.99};
  a[16]={x:0.5, y:0.5, visibility:0.99};
  a[20]={x:0.52, y:0.5, visibility:0.2};
  return a;
}
function manoHands(angDeg){
  var h=[]; for(var i=0;i<21;i++) h[i]={x:0.5,y:0.5,z:0};
  h[0]={x:0.5,y:0.5,z:0};
  var th=angDeg*Math.PI/180;
  h[9]={x:0.5+0.2*Math.cos(th), y:0.5+0.2*Math.sin(th), z:0};
  return h;
}
function elFrame(n){ return { videoWidth:100, videoHeight:100, _frameNo:n }; }
function resPose(lm){ return { poseLandmarks:lm, poseWorldLandmarks:lm }; }

var sentPose=[], sentHands=[], handsResolvers=[];
function armarPipeline(sel){
  FR.resetEstado();
  BIO.tipoMedicion='gonio'; BIO.modo='camara';
  BIO.canvas=null; BIO.srcEl=null;
  BIO.accG=G.nuevoAccGonio(); BIO.accG.sel=sel; FR.selDefault(BIO.accG);
  BIO.pose={ send:function(o){ sentPose.push(o.image); return Promise.resolve(); }, reset:noop };
  BIO.hands=null; BIO._handsFallo=false;
  sentPose.length=0; sentHands.length=0; handsResolvers.length=0;
}
function conHands(){
  BIO.hands={ send:function(o){ sentHands.push(o.image); return new Promise(function(r){ handsResolvers.push(r); }); }, reset:noop };
}
function drenarDeuda(){
  // entrega callbacks "vacíos" hasta vaciar la deuda declarada/ambigua (higiene entre ciclos)
  var guard=0;
  while(((BIO._poseAmb||0)>0 || (BIO._poseStale||0)>0) && guard++<50){ FR.onResults(resPose(null)); }
}

(async function(){

  console.log('— C1: 100 ciclos enviar → reset → callback tardío (orden aleatorio) → reenviar —');
  armarPipeline({grupo:'Codo',mov:'Flexión',lado:'der'});
  var malas=0, limpiasMal=0, dupls=0;
  for(var i=0;i<100;i++){
    var angA=20+(i%50), angB=75+(i%40);
    FR.send(elFrame(1000+3*i), 0.1);                    // cuadro A en vuelo
    FR.bump();                                          // reset/cambio con A en vuelo → deuda ambigua
    FR.send(elFrame(1001+3*i), 0.2);                    // cuadro B (raster reusado del pool)
    var fidB=(BIO._frQ.length)?BIO._frQ[BIO._frQ.length-1].frameId:null;
    var cbs=[function(){ FR.onResults(resPose(lmCodo(angA))); },    // callback VIEJO (de A)
             function(){ FR.onResults(resPose(lmCodo(angB))); }];   // callback NUEVO (de B)
    if(rnd()<0.5){ cbs.reverse(); }                     // orden de entrega aleatorio (reproducible)
    cbs[0](); cbs[1]();
    // JAMÁS: valor viejo unido al raster nuevo; JAMÁS una tupla duplicada/colgada de A.
    if(BIO._frRet){
      if(BIO._frRet.fr.cv._contenido===(1001+3*i) && BIO._frRet.r && Math.abs(BIO._frRet.r.val-angA)<0.5) malas++;
      if(BIO._frRet.frameId!==fidB) dupls++;
    }
    drenarDeuda();
    // ciclo LIMPIO de recuperación: el siguiente cuadro empareja EXACTO
    var angC=35+(i%30);
    FR.send(elFrame(1002+3*i), 0.3);
    var fidC=BIO._frQ[BIO._frQ.length-1].frameId;
    FR.onResults(resPose(lmCodo(angC)));
    var ok=(BIO._frRet && BIO._frRet.frameId===fidC && BIO._frRet.fr.cv._contenido===(1002+3*i) && Math.abs(BIO._frRet.r.val-angC)<0.5);
    if(!ok) limpiasMal++;
  }
  chk(malas===0,   'C1a','100 ciclos: cero asociaciones viejas sobre raster nuevo ('+malas+' malas)');
  chk(dupls===0,   'C1b','100 ciclos: cero tuplas con frameId ajeno ('+dupls+')');
  chk(limpiasMal===0,'C1c','100 ciclos: el cuadro limpio posterior SIEMPRE empareja exacto ('+limpiasMal+' fallos)');
  chk((BIO._poseAmb||0)===0 && (BIO._poseStale||0)===0,'C1d','contadores de deuda drenados a 0 al final');
  chk((BIO._frPool||[]).length<=4,'C1e','el pool jamás rebasó el techo declarado (len='+(BIO._frPool||[]).length+')');

  console.log('— C2: 100 ciclos Hands timeout → promesa vieja resuelve → no desbloquea; el job nuevo empareja —');
  var lockMal=0, terceros=0, emparejaMal=0, liberaMal=0, drenaMal=0;
  for(var j=0;j<100;j++){
    armarPipeline({grupo:'Muñeca',mov:'Flexión',lado:'der'}); conHands();
    FR.send(elFrame(2000+2*j), 1.0);                    // job H1 (hands en vuelo, promesa r1)
    FR.bump();
    BIO._handsSendAt=Date.now()-3000;
    FR.send(elFrame(9999), 1.1);                        // watchdog: H1 = job PERDIDO (drenaje declarado)
    FR.send(elFrame(2001+2*j), 1.2);                    // job H2 (promesa r2)
    var fidH2=(BIO._frQ.length)?BIO._frQ[BIO._frQ.length-1].frameId:null;
    var antes=sentHands.length;
    handsResolvers[0](); await tick();                  // la promesa VIEJA resuelve…
    if(BIO._handsSending!==true) lockMal++;             // …y NO desbloquea el job nuevo
    FR.send(elFrame(9998), 1.3);
    if(sentHands.length!==antes) terceros++;            // …ni permite un 3.er envío concurrente
    FR.onResults(resPose(lmMunecaPose()));              // pose vieja (drenada: pérdida declarada)
    FR.onResults(resPose(lmMunecaPose()));              // pose del job H2 → diferida esperando SU mano
    FR.onHands({multiHandLandmarks:[manoHands(70)]});   // mano VIEJA (huérfana) → drenada
    if(BIO._frRet && BIO._frRet.r && Math.abs(BIO._frRet.r.val-70)<0.5) drenaMal++;
    FR.onHands({multiHandLandmarks:[manoHands(12)]});   // mano del job H2 → completa SU cuadro
    if(!(BIO._frRet && BIO._frRet.frameId===fidH2 && BIO._frRet.r && Math.abs(BIO._frRet.r.val-12)<0.5)) emparejaMal++;
    handsResolvers[1](); await tick();                  // la promesa del job VIGENTE sí libera su lock
    if(BIO._handsSending!==false) liberaMal++;
  }
  chk(lockMal===0,  'C2a','100 ciclos: la promesa vieja jamás desbloqueó el job en vuelo ('+lockMal+')');
  chk(terceros===0, 'C2b','100 ciclos: jamás un 3.er envío concurrente a Hands ('+terceros+')');
  chk(drenaMal===0, 'C2c','100 ciclos: la mano huérfana jamás finalizó el cuadro nuevo ('+drenaMal+')');
  chk(emparejaMal===0,'C2d','100 ciclos: la mano del job vigente SIEMPRE completó SU cuadro ('+emparejaMal+')');
  chk(liberaMal===0,'C2e','100 ciclos: la promesa del job vigente SIEMPRE liberó su lock ('+liberaMal+')');

  console.log('— C3: techo DURO del pool de rasters (4) —');
  armarPipeline({grupo:'Codo',mov:'Flexión',lado:'der'});
  for(var k=0;k<4;k++){ FR.send(elFrame(3000+k), 2.0+k*0.1); }
  chk(BIO._frQ.length===4 && (BIO._frPool||[]).length===4, 'C3a','4 cuadros en vuelo ocupan el pool completo');
  var poseAntes=sentPose.length, agotadoAntes=(BIO._frPoolAgotado||0);
  FR.send(elFrame(3004), 2.5);                          // 5.º cuadro: pool al techo
  chk(BIO._frQ.length===4 && sentPose.length===poseAntes, 'C3b','el 5.º cuadro se SALTA sin enviar (no se crea trabajo sin raster)');
  chk((BIO._frPool||[]).length===4, 'C3c','no se creó ningún buffer extra por encima del techo declarado');
  chk((BIO._frPoolAgotado||0)===agotadoAntes+1, 'C3d','el descarte quedó contado (BIO._frPoolAgotado)');
  for(var k2=0;k2<4;k2++){ FR.onResults(resPose(lmCodo(40+k2))); }
  chk(BIO._frRet && BIO._frRet.fr.cv._contenido===3003 && Math.abs(BIO._frRet.r.val-43)<0.5, 'C3e','los 4 cuadros emparejaron en orden pese al descarte del 5.º (retenido = el último, 43°)');
  FR.send(elFrame(3005), 2.6);
  chk(BIO._frQ.length===1 && sentPose.length===poseAntes+1, 'C3f','liberados los rasters, el pool vuelve a servir cuadros');

  console.log('— C4: cerrar la vista durante la inferencia (reset con callback en vuelo) —');
  armarPipeline({grupo:'Codo',mov:'Flexión',lado:'der'});
  FR.send(elFrame(4000), 3.0);                          // inferencia en vuelo…
  FR.resetEstado();                                     // …y el fisio cierra la vista
  var trono=false;
  try{ FR.onResults(resPose(lmCodo(88))); }catch(_e){ trono=true; }
  chk(!trono, 'C4a','el callback tardío tras cerrar la vista no truena');
  chk(!BIO._frRet && (!BIO._frQ || BIO._frQ.length===0), 'C4b','no deja tupla retenida ni contextos (nada que persistir en UI desmontada)');
  // re-abrir de inmediato: la DEUDA sobrevivió al reset → el tardío del estado anterior no contamina
  armarPipeline({grupo:'Codo',mov:'Flexión',lado:'der'});
  FR.send(elFrame(4001), 3.1);
  FR.onResults(resPose(lmCodo(88)));                    // tardío del estado ANTERIOR llega primero…
  var contaminado=!!(BIO._frRet && BIO._frRet.fr.cv._contenido===4001 && Math.abs(BIO._frRet.r.val-88)<0.5);
  chk(!contaminado, 'C4c','el tardío del estado anterior NO empareja el cuadro de la sesión re-abierta');
  FR.onResults(resPose(lmCodo(33)));                    // …el callback real de 4001 (sacrificado o drenado)
  drenarDeuda();
  FR.send(elFrame(4002), 3.2);
  FR.onResults(resPose(lmCodo(55)));
  chk(BIO._frRet && BIO._frRet.fr.cv._contenido===4002 && Math.abs(BIO._frRet.r.val-55)<0.5, 'C4d','la sesión re-abierta se recupera y empareja limpio');

  console.log('— C5: cambio de articulación con resultados pendientes (muñeca → codo) —');
  armarPipeline({grupo:'Muñeca',mov:'Flexión',lado:'der'}); conHands();
  FR.send(elFrame(5000), 4.0);
  FR.onResults(resPose(lmMunecaPose()));                // pose llegó → cuadro DIFERIDO esperando su mano
  chk(!!BIO._frPend, 'C5a','el cuadro de muñeca queda diferido esperando su mano');
  FR.bump();                                            // el fisio cambia de articulación
  var trono5=false;
  try{ FR.onHands({multiHandLandmarks:[manoHands(66)]}); }catch(_e5){ trono5=true; }
  chk(!trono5 && !BIO._frPend && !BIO._frRet, 'C5b','la mano tardía del cuadro barrido no truena ni deja tupla');
  handsResolvers[0] && handsResolvers[0](); await tick();
  BIO.accG.sel={grupo:'Codo',mov:'Flexión',lado:'der'}; FR.selDefault(BIO.accG);
  drenarDeuda();
  FR.send(elFrame(5001), 4.1);
  FR.onResults(resPose(lmCodo(47)));
  chk(BIO._frRet && BIO._frRet.fr.cv._contenido===5001 && Math.abs(BIO._frRet.r.val-47)<0.5, 'C5c','el ciclo de codo posterior empareja limpio (sin contaminación de la muñeca)');

  console.log('\nCiclos de recuperación V3.2: '+pass+' OK, '+fail+' fallidas.');
  process.exit(fail?1:0);
})().catch(function(e){ console.error(e&&e.stack||e); process.exit(2); });
