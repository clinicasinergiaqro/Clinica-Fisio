/* ============================================================================
 * GATES DE VALIDEZ ANATÓMICA (P0 corrección anatómica, 2026-11-22) — Node puro.
 * Prueba las implementaciones REALES del módulo con los escenarios del paquete
 * del auditor (tests/anatomical-gates.test.mjs) y los contratos nuevos:
 *   A) _gateMunecaMatch: 40% de separación muñeca Pose↔Hands NO se acepta en
 *      silencio (la V3.1/V3.2 aceptaba hasta 45%); ≤12% pasa; <20 px de
 *      antebrazo → FOREARM_TOO_SHORT.
 *   B) _axisQuality: una línea un radio completo fuera del eje central se
 *      rechaza; muestras alineadas pasan; eje corto → AXIS_NOT_TESTABLE.
 *   C) Integración calcularGonio/Muñeca: mano a 20% del antebrazo (el caso
 *      REAL de la foto 3 del caso auditado) → {ok:false, motivo:'correspondencia'}
 *      (sin número automático); a 4% → ok con qc.matchRatio; a 11% → ok con
 *      ALARMA de revisión; con índice abierto el descarte del gate queda
 *      trazado (gateDescartado) y el fallback sigue exigiendo confirmación.
 *   D) Protocolos NO intercambiables: 5.º MCP (lateral clásico) usa lm17 y
 *      NUNCA degrada al índice; 3.er MCP queda etiquetado proxy-3mcp.
 *   E) Construcción eje-contra-eje: el vértice es la muñeca de POSE (centro
 *      articular del detector) y el valor NO cambia cuando Hands coincide
 *      con Pose (compatibilidad con la suite del 11-20).
 *   F) "Posición mostrada": una medida estática sin tope confirmado NO se
 *      compara contra cortes clínicos (sin semáforo) y lo declara en el texto;
 *      las medidas viejas (sin el campo) conservan su comportamiento.
 * Umbrales PROVISIONALES sujetos a calibración clínica (≠ validación clínica).
 * Correr:  node pruebas/gonio-anatomia-gates.test.js   (sale !=0 si falla)
 * ==========================================================================*/
'use strict';
var vm = require('vm');
var fs = require('fs');
var path = require('path');

var src = fs.readFileSync(path.join(__dirname, '..', 'medidor-biomecanico.js'), 'utf8');
var noop = function(){};
function fakeCtx2d(){ return { clearRect:noop, drawImage:noop, beginPath:noop, moveTo:noop, lineTo:noop,
  stroke:noop, fill:noop, arc:noop, fillText:noop, save:noop, restore:noop, setTransform:noop,
  translate:noop, rotate:noop, fillRect:noop, setLineDash:noop, closePath:noop,
  measureText:function(){ return { width: 10 }; } }; }
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
['gateMunecaMatch','axisQuality','setMunProto','setFrameH','munecaEje','setHandsLm','calcularGonio','sinExtremo','gonioAlerta','gonioFmtGrado']
  .forEach(function(k){ if(!T[k]){ console.error('FALLO: falta el hook '+k); process.exit(1); } });

var pass = 0, fail = 0;
function ok(cond, msg){ if(cond){ pass++; } else { fail++; console.error('  ✗ ' + msg); } }
function near(a, b, tol, msg){ ok(a!=null && Math.abs(a-b) <= tol, msg + ' (obtuve ' + a + ', esperaba ~' + b + ')'); }

function L(x, y, v){ return { x:x, y:y, visibility:(v==null?0.95:v) }; }
function pose(map){ var a=[]; for(var i=0;i<33;i++) a[i]=L(0.5,0.5,0); for(var k in map) a[+k]=map[k]; return a; }
// Mano de Hands: lm0 (muñeca), lm9 (3.er MCP) y lm17 (5.º MCP) colocables; el resto de relleno.
function mano(l0, l9, l17){ var h=[]; for(var i=0;i<21;i++) h[i]={x:0.5,y:0.5,z:0}; h[0]=l0; h[9]=l9; if(l17) h[17]=l17; return h; }
function rad(g){ return g*Math.PI/180; }
var PDer = { E:14, W:16, Ix:20 };
function lmBase(extra){ var m={ 14:L(0.3,0.5), 16:L(0.6,0.5) }; for(var k in (extra||{})) m[+k]=extra[k]; return pose(m); }
function mcpDesde(origen, aGrados, largo){ var l=(largo==null?0.12:largo); return { x:origen.x+l*Math.cos(rad(aGrados)), y:origen.y+l*Math.sin(rad(aGrados)), z:0 }; }
var W0={ x:0.6, y:0.5, z:0 };   // muñeca de Pose en la base

// ── A) _gateMunecaMatch con los escenarios EXACTOS del paquete del auditor (píxeles) ───────────
(function(){
  // antebrazo 200 px (codo (100,150) → muñeca (300,150)); mano a 80 px = 40% → rechazo
  var g40 = T.gateMunecaMatch(200, 80, 200);
  ok(g40.valid===false && g40.reason==='WRIST_MISMATCH', 'A1 40% de separación NO se acepta en silencio (el modelo V3.1 permitía hasta 45%)');
  var g4 = T.gateMunecaMatch(200, 8, 200);
  ok(g4.valid===true, 'A2 4% de separación pasa');
  ok(g4.warn!==true, 'A3 4% pasa SIN alarma');
  var g25 = T.gateMunecaMatch(200, 50, 200);
  ok(g25.valid===false && g25.reason==='WRIST_MISMATCH', 'A4 25% → WRIST_MISMATCH');
  var gCorto = T.gateMunecaMatch(15, 1, 15);
  ok(gCorto.valid===false && gCorto.reason==='FOREARM_TOO_SHORT', 'A5 antebrazo <20 px → FOREARM_TOO_SHORT');
  var g11 = T.gateMunecaMatch(200, 22, 200);
  ok(g11.valid===true && g11.warn===true, 'A6 11% pasa PERO con alarma de revisión (banda 10–12%)');
  var gNaN = T.gateMunecaMatch(0, 10, null);
  ok(gNaN.valid===false, 'A7 antebrazo nulo/degenerado → no evaluable');
})();

// ── B) _axisQuality con los escenarios EXACTOS del auditor ─────────────────────────────────────
(function(){
  var alineada = T.axisQuality({x:100,y:200},{x:300,y:200},
    [{x:140,y:202},{x:200,y:201},{x:260,y:202}],[20,20,20]);
  ok(alineada.valid===true, 'B1 línea sobre la línea media del miembro → válida');
  var desviada = T.axisQuality({x:100,y:220},{x:300,y:220},
    [{x:140,y:200},{x:200,y:200},{x:260,y:200}],[20,20,20]);
  ok(desviada.valid===false, 'B2 una línea UN RADIO COMPLETO fuera del eje central se rechaza');
  var corta = T.axisQuality({x:100,y:200},{x:110,y:200},[{x:105,y:200}],[20]);
  ok(corta.valid===false && corta.reason==='AXIS_NOT_TESTABLE', 'B3 eje demasiado corto → AXIS_NOT_TESTABLE');
})();

// ── C) Integración calcularGonio/Muñeca: el gate corta el caso REAL de la auditoría ────────────
(function(){
  T.setAspect(1,1); T.setMunProto('3mcp'); T.setFrameH(null);
  // C1: mano a 20% del antebrazo (≈ la foto 3 real: ratio 0.196) e índice en puño (sin fallback)
  var lejia={ x:0.6+0.3*0.20, y:0.5, z:0 };
  T.setHandsLm([ mano(lejia, mcpDesde(lejia,50)) ]);
  var r20 = T.calcularGonio(lmBase({ 20:L(0.62,0.515) }), 'Muñeca', 'Flexión', 'der');
  ok(r20 && r20.ok===false && r20.motivo==='correspondencia', 'C1 mano a 20% del antebrazo → SIN número automático (motivo correspondencia)');
  ok(r20 && r20.gate && r20.gate.reason==='WRIST_MISMATCH' && Math.abs(r20.gate.ratio-0.20)<=0.02, 'C2 el rechazo queda trazado con la razón y la proporción');
  // C3: la misma mano con el ÍNDICE ABIERTO → degrada al índice (pose pura) y DEJA TRAZA del descarte
  var lmAbierto = lmBase({ 20:L(0.6+0.12*Math.cos(rad(50)), 0.5+0.12*Math.sin(rad(50))) });
  var rIx = T.calcularGonio(lmAbierto, 'Muñeca', 'Flexión', 'der');
  ok(rIx && rIx.ok===true && rIx.eje==='indice-pose', 'C3 con índice abierto el fallback (pose pura) sigue midiendo');
  ok(rIx && rIx.gateDescartado && rIx.gateDescartado.rechazo==='WRIST_MISMATCH', 'C4 y queda trazado que la mano de Hands se descartó por el gate');
  // C5: mano a 4% → medible, con la proporción registrada y sin alarma
  var cerca={ x:0.6+0.3*0.04, y:0.5, z:0 };
  T.setHandsLm([ mano(cerca, mcpDesde(cerca,50)) ]);
  var r4 = T.calcularGonio(lmBase({ 20:L(0.62,0.515) }), 'Muñeca', 'Flexión', 'der');
  ok(r4 && r4.ok===true && r4.qc && Math.abs(r4.qc.matchRatio-0.04)<=0.01 && !r4.qc.matchAlarma, 'C5 mano a 4% → medible, proporción en qc, sin alarma');
  near(r4 && r4.val, 50, 1.5, 'C6 y el ángulo sale del eje metacarpiano (~50°)');
  // C7: mano a 11% → medible PERO con alarma de revisión
  var borde={ x:0.6+0.3*0.11, y:0.5, z:0 };
  T.setHandsLm([ mano(borde, mcpDesde(borde,50)) ]);
  var r11 = T.calcularGonio(lmBase({ 20:L(0.62,0.515) }), 'Muñeca', 'Flexión', 'der');
  ok(r11 && r11.ok===true && r11.qc && r11.qc.matchAlarma===true, 'C7 banda 10–12% → medible con ALARMA de revisión');
  // C8: antebrazo <20 px reales (setFrameH) → no evaluable aunque la mano coincida
  T.setFrameH(60);   // antebrazo 0.3 norm × 60 px = 18 px < 20
  T.setHandsLm([ mano(W0, mcpDesde(W0,50)) ]);
  var rPx = T.calcularGonio(lmBase({ 20:L(0.62,0.515) }), 'Muñeca', 'Flexión', 'der');
  ok(rPx && rPx.ok===false && rPx.motivo==='correspondencia' && rPx.gate && rPx.gate.reason==='FOREARM_TOO_SHORT', 'C8 antebrazo <20 px → FOREARM_TOO_SHORT (sin número)');
  T.setFrameH(null); T.setHandsLm(null);
})();

// ── D) Protocolos NO intercambiables (3.er MCP proxy vs 5.º MCP lateral clásico) ───────────────
(function(){
  T.setAspect(1,1);
  // mano coincidente: 3.er MCP a 50°, 5.º MCP a 30° (convenciones distintas → números distintos)
  T.setHandsLm([ mano(W0, mcpDesde(W0,50), mcpDesde(W0,30)) ]);
  T.setMunProto('3mcp');
  var r3 = T.calcularGonio(lmBase({ 20:L(0.62,0.515) }), 'Muñeca', 'Flexión', 'der');
  ok(r3 && r3.ok===true && r3.eje==='metacarpiano-hands' && r3.protocolo==='proxy-3mcp', 'D1 protocolo B queda etiquetado proxy-3mcp');
  near(r3 && r3.val, 50, 1.5, 'D2 y mide contra el 3.er MCP (~50°)');
  T.setMunProto('5mcp');
  var r5 = T.calcularGonio(lmBase({ 20:L(0.62,0.515) }), 'Muñeca', 'Flexión', 'der');
  ok(r5 && r5.ok===true && r5.eje==='metacarpiano5-hands' && r5.protocolo==='lateral-5mcp', 'D3 protocolo A usa el 5.º MCP y queda etiquetado lateral-5mcp');
  near(r5 && r5.val, 30, 1.5, 'D4 el MISMO cuadro da OTRO número con la otra convención (30° ≠ 50°): no intercambiables');
  // D5: bajo protocolo A, sin mano NO se degrada al índice (sería una 3.ª convención en silencio)
  T.setHandsLm(null);
  var r5sin = T.calcularGonio(lmBase({ 20:L(0.6+0.12*Math.cos(rad(50)), 0.5+0.12*Math.sin(rad(50))) }), 'Muñeca', 'Flexión', 'der');
  ok(r5sin && r5sin.ok===false, 'D5 protocolo A sin detector de mano → no medible (NUNCA cambia de convención en silencio)');
  T.setMunProto('3mcp');
})();

// ── E) Construcción eje-contra-eje: vértice = muñeca de POSE (centro articular del detector) ───
(function(){
  T.setAspect(1,1); T.setMunProto('3mcp');
  // E1: Hands desplazada DENTRO del gate (8% del antebrazo, a lo largo de la mano): el vértice del
  // registro es la muñeca de POSE, y el número usa la DIRECCIÓN del metacarpiano (no la posición de H0).
  var h0={ x:0.6+0.3*0.08, y:0.5, z:0 };
  T.setHandsLm([ mano(h0, mcpDesde(h0,50)) ]);
  var r = T.calcularGonio(lmBase({ 20:L(0.62,0.515) }), 'Muñeca', 'Flexión', 'der');
  ok(r && r.ok===true, 'E1 desplazamiento dentro del gate → medible');
  ok(r && r.mano && Math.abs(r.mano.B.x-0.6)<1e-9 && Math.abs(r.mano.B.y-0.5)<1e-9, 'E2 el vértice del registro es la MUÑECA DE POSE (no la lm0 de Hands desplazada)');
  near(r && r.val, 50, 1.0, 'E3 y el valor es el de la DIRECCIÓN del metacarpiano (50°), robusto al desplazamiento de H0');
  ok(r && r.manoCruda && r.manoCruda.H0 && Math.abs(r.manoCruda.H0.x-h0.x)<1e-9, 'E4 los puntos CRUDOS de Hands quedan en la traza sin trasladar (auditables)');
  T.setHandsLm(null);
})();

// ── F) "Posición mostrada": sin tope confirmado NO hay semáforo de corte ───────────────────────
(function(){
  var base={ grupo:'Muñeca', mov:'Flexión', lado:'der', grado:28.5, ref:80, lim:60, defic:false, hiperext:false, normTxt:'0–80°' };
  var vieja=JSON.parse(JSON.stringify(base));                                     // medida antigua (sin el campo)
  ok(T.gonioAlerta(vieja)===true, 'F1 una medida VIEJA (sin el campo) conserva el semáforo de siempre (28°<60° → alerta)');
  var sinTope=JSON.parse(JSON.stringify(base)); sinTope.traza={ extremoRango:'sin confirmar' };
  ok(T.sinExtremo(sinTope)===true, 'F2 el helper reconoce la medida sin tope confirmado');
  ok(T.gonioAlerta(sinTope)===false, 'F3 sin tope confirmado NO se marca "limitado" por corte fijo (posición mostrada ≠ rango máximo)');
  ok(T.gonioFmtGrado(sinTope).indexOf('posición mostrada')!==-1, 'F4 y el texto lo declara: "(posición mostrada)"');
  var conTope=JSON.parse(JSON.stringify(base)); conTope.traza={ extremoRango:'confirmado-fisio' };
  ok(T.gonioAlerta(conTope)===true, 'F5 con tope confirmado por el fisio el semáforo clínico aplica');
  var techo=JSON.parse(JSON.stringify(base)); techo.grado=120; techo.traza={ extremoRango:'sin confirmar' };
  ok(T.gonioAlerta(techo)===true, 'F6 el candado de TECHO (artefacto) sigue alertando aunque no haya tope confirmado');
})();

console.log('Gates anatómicos P0 (2026-11-22): ' + pass + ' OK, ' + fail + ' fallidas.');
process.exit(fail ? 1 : 0);
