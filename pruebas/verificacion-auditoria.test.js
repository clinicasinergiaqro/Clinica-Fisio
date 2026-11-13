/* ============================================================================
 * SUITE DE ACEPTACIÓN — auditoría externa de medidor-biomecanico.js
 * (v auditada: v1-2026-11-13a, BIO_ALGO_VER 'bio-2d-2026-11-13')
 *
 * Cada assert describe el comportamiento CORRECTO. Sobre la versión auditada
 * fallan 10 de 18 (baseline esperado abajo). Las fases del plan deben irlos
 * volteando a verde SIN romper pruebas/geometria.test.js (23 OK).
 *
 * Correr desde la raíz del repo:
 *   node pruebas/verificacion-auditoria.test.js medidor-biomecanico.js
 * Sale con código !=0 si algo falla (sirve para CI).
 *
 * BASELINE sobre v1-2026-11-13a (sin correcciones):
 *   PASAN:  A-reg1, A-reg2, A-m1, A-paso0, B1, D2, X1, X2
 *   FALLAN: A-hip, A-tronco, A-abd1, A-paso1, B2, B3, B4, B5, I1, I2
 *
 * Mapa fase → asserts que deben voltear a verde:
 *   Fase 1 (validez de entrada): B2, B3, B4, B5
 *   Fase 2 (geometría coherente): A-hip, A-tronco, A-abd1, A-paso1
 *   Fase 6 (comparador):          I1, I2
 * (La detección de cámara lenta —hallazgo D— no se puede asertar en unitario
 *  sin fijar el diseño; su aceptación va en el prompt, con archivo real.)
 *
 * Técnica: carga el módulo real con vm + stubs (igual que geometria.test.js)
 * y expone internos extra inyectando window.__BIO_XTEST antes del cierre del
 * IIFE. La inyección solo EXPONE funciones; no cambia lógica. Si renombras
 * internos, actualiza la lista de `ins` abajo.
 * ==========================================================================*/
'use strict';
var vm = require('vm');
var fs = require('fs');
var path = require('path');

var modPath = process.argv[2] || path.join(__dirname, '..', 'medidor-biomecanico.js');
var src = fs.readFileSync(modPath, 'utf8');

var ins = "window.__BIO_XTEST = { calcularMarchaSagital: calcularMarchaSagital, calcularSentFrontal: calcularSentFrontal, _estadoHombro: _estadoHombro, _marcoCuerpo: _marcoCuerpo, nuevoAccMarcha: nuevoAccMarcha, acumularMarcha: acumularMarcha, finalizarMarcha: finalizarMarcha, _eventosPie: _eventosPie };\n";
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

var T = win.__BIO_TEST, X = win.__BIO_XTEST;
if (!T || !X) { console.error('FALLO: hooks __BIO_TEST/__BIO_XTEST no expuestos'); process.exit(1); }

var pass = 0, fail = 0;
function chk(cond, id, msg){ if(cond){ pass++; console.log('  ✓ '+id+' '+msg); } else { fail++; console.log('  ✗ '+id+' '+msg); } }
function L(x, y, v){ return { x:x, y:y, visibility:(v==null?0.95:v) }; }
function pose(map){ var a=[]; for(var i=0;i<33;i++) a[i]=L(0.5,0.5,0); for(var k in map) a[+k]=map[k]; return a; }

console.log('\n== A) Geometría con aspecto coherente ==');
(function(){
  // Caso de regresión del encargo: H=(0.4,0.3) K=(0.5,0.5) A=(0.4,0.7), 9:16 → 31.42°
  var lm = pose({ 24:L(0.4,0.3), 26:L(0.5,0.5), 28:L(0.4,0.7) });
  T.setAspect(1080,1920);
  var r = T.calcularGonio(lm,'Rodilla','Flexión','der');
  chk(r && r.ok && Math.abs(r.val-31.42)<0.1, 'A-reg1', 'gonio rodilla 9:16 → ~31.42° (obtuve '+(r&&r.val!=null?r.val.toFixed(2):'?')+')');
  T.setAspect(1,1);
  var r0 = T.calcularGonio(lm,'Rodilla','Flexión','der');
  chk(r0 && Math.abs(r0.val-53.13)<0.1, 'A-reg2', 'sin aspecto da el valor deformado 53.13° (sanity del caso)');

  // Rodilla de marcha comparte _ang2D corregido
  T.setAspect(1080,1920);
  var lmM = pose({ 11:L(0.45,0.1), 12:L(0.55,0.1), 23:L(0.4,0.3), 24:L(0.4,0.3), 25:L(0.5,0.5), 26:L(0.5,0.5), 27:L(0.4,0.7), 28:L(0.4,0.7), 0:L(0.5,0.05), 31:L(0.45,0.72), 32:L(0.45,0.72) });
  var fm = X.calcularMarchaSagital(lmM);
  chk(fm && fm.rodIzq.ok && Math.abs(fm.rodIzq.val-31.42)<0.15, 'A-m1', 'marcha rodilla corregida → ~31.42°');

  // Cadera en marcha: muslo a 45° REALES en píxeles sobre 9:16 debe dar ~45°
  var dxp=300/1080, dyp=300/1920;
  var lmH = pose({ 11:L(0.45,0.10), 12:L(0.55,0.10), 23:L(0.5,0.5), 24:L(0.5,0.5),
                   25:L(0.5+dxp,0.5+dyp), 26:L(0.5+dxp,0.5+dyp), 27:L(0.5,0.9), 28:L(0.5,0.9), 0:L(0.5,0.05) });
  T.setAspect(1080,1920);
  var fh = X.calcularMarchaSagital(lmH);
  chk(fh && fh.hipIzq.ok && Math.abs(Math.abs(fh.hipIzq.val)-45)<=1.0, 'A-hip', 'cadera marcha con aspecto: 45° reales → 45°±1 (obtuve '+(fh&&fh.hipIzq.val!=null?Math.abs(fh.hipIzq.val).toFixed(1):'?')+'°)');

  // Tronco lateral (sentadilla): 10° reales en píxeles sobre 9:16 → ~10°
  var dyT=600, dxT=Math.tan(10*Math.PI/180)*dyT;
  var lmS = pose({ 11:L(0.5+dxT/1080-0.1,0.2), 12:L(0.5+dxT/1080+0.1,0.2),
                   23:L(0.4,0.2+dyT/1920), 24:L(0.6,0.2+dyT/1920),
                   25:L(0.42,0.75), 26:L(0.58,0.75), 27:L(0.42,0.95), 28:L(0.58,0.95), 0:L(0.5,0.05) });
  T.setAspect(1080,1920);
  var fs2 = X.calcularSentFrontal(lmS);
  chk(fs2 && fs2.troncoLat.ok && Math.abs(Math.abs(fs2.troncoLat.val)-10)<=1.0, 'A-tronco', 'tronco lateral con aspecto: 10° reales → 10°±1 (obtuve '+(fs2&&fs2.troncoLat.val!=null?Math.abs(fs2.troncoLat.val).toFixed(1):'?')+'°)');
  // Misma clase (barrido): cuello_lat (calcularAngulos L217-225), umbrales de orientación
  // (L402/570, _orientRomFrontal L1198) y camMov (L496-500) comparten la matemática cruda.

  // Abducción de hombro in-plane: brazo a 45° reales en píxeles sobre 9:16 → ~45°
  function W3(x,y,z){ return {x:x,y:y,z:z||0}; }
  var world=[]; for(var i=0;i<33;i++) world[i]=W3(0,0,0);
  world[11]=W3(-0.2,-0.5,0); world[12]=W3(0.2,-0.5,0); world[23]=W3(-0.15,0,0); world[24]=W3(0.15,0,0);
  world[0]=W3(0,-0.7,-0.1); world[14]=W3(0.5,-0.2,0);
  var marco = X._marcoCuerpo(world);
  var dxa=300/1080, dya=300/1920;
  var lmA = pose({ 11:L(0.35,0.3), 12:L(0.65,0.3), 23:L(0.4,0.6), 24:L(0.6,0.6), 14:L(0.65+dxa,0.3+dya) });
  T.setAspect(1080,1920);
  var est = X._estadoHombro(world, lmA, marco, 12, 14);
  chk(est && est.dir==='abd' && Math.abs(est.theta-45)<=1.5, 'A-abd1', 'abducción in-plane con aspecto: 45° reales → 45°±1.5 (obtuve '+(est?est.theta.toFixed(1):'?')+'°, dir='+(est&&est.dir)+')');

  // Longitud de paso: debe DEPENDER del aspecto, y en 9:16 valer ~0.33 m con esta marcha sintética
  function marchaSintetica(){
    var acc = X.nuevoAccMarcha();
    var fps=20, dur=10;
    for(var k=0;k<fps*dur;k++){
      var t=k/fps;
      var f={ ok:true,
        hipIzq:{val:10*Math.sin(2*Math.PI*t),ok:true}, hipDer:{val:10*Math.sin(2*Math.PI*t+Math.PI),ok:true},
        rodIzq:{val:30+30*Math.sin(2*Math.PI*t),ok:true}, rodDer:{val:30+30*Math.sin(2*Math.PI*t+Math.PI),ok:true},
        tobIzq:{val:90,ok:true}, tobDer:{val:90,ok:true},
        footIzq:{val:0.10*Math.sin(2*Math.PI*t),ok:true}, footDer:{val:0.10*Math.sin(2*Math.PI*t+Math.PI),ok:true},
        noseRel:0.05, sacroX:0.5, alturaPx:0.5, orientPerfil:true, p:{} };
      X.acumularMarcha(acc, f, t);
    }
    return acc;
  }
  T.setAspect(1080,1920);
  var res916 = X.finalizarMarcha(marchaSintetica(), 175, null);
  T.setAspect(1920,1080);
  var res169 = X.finalizarMarcha(marchaSintetica(), 175, null);
  chk(res916.cadencia===120, 'A-paso0', 'cadencia sintética correcta (120 pasos/min)');
  // Con estatura 175 cm, altura-proxy 0.5 (y-norm) y paso 0.2 (x-norm): correcto en 9:16 ≈ 0.33 m, en 16:9 ≈ 1.05 m.
  var dependeAspecto = res916.espacial.stepLenM!=null && res169.espacial.stepLenM!=null && res916.espacial.stepLenM !== res169.espacial.stepLenM;
  var valor916ok = res916.espacial.stepLenM!=null && Math.abs(res916.espacial.stepLenM-0.33)<=0.03;
  chk(dependeAspecto && valor916ok, 'A-paso1', 'longitud de paso usa aspecto y en 9:16 da ~0.33 m (obtuve 9:16='+res916.espacial.stepLenM+' m, 16:9='+res169.espacial.stepLenM+' m)');
})();

console.log('\n== B) Entradas inválidas → "no medible", nunca 180 ==');
(function(){
  T.setAspect(1,1);
  var lmC = pose({ 24:L(0.5,0.3), 26:L(0.5,0.5), 28:L(0.502,0.502) });
  var rC = T.calcularGonio(lmC,'Rodilla','Flexión','der');
  chk(rC && rC.ok===false, 'B1', 'gonio puntos encimados → ok:false');

  var lmN = pose({ 24:L(NaN,0.3), 26:L(0.5,0.5), 28:L(0.4,0.7) });
  var rN = T.calcularGonio(lmN,'Rodilla','Flexión','der');
  chk(rN && rN.ok===false, 'B2', 'gonio coordenada NaN → ok:false (obtuve '+JSON.stringify(rN)+')');

  var lmM = pose({ 11:L(0.45,0.1), 12:L(0.55,0.1), 23:L(0.5,0.5), 24:L(0.5,0.5),
                   25:L(0.5,0.5), 26:L(0.5,0.5), 27:L(0.5,0.5), 28:L(0.5,0.5), 0:L(0.5,0.05) });
  var fM = X.calcularMarchaSagital(lmM);
  chk(fM && fM.rodIzq.ok===false, 'B3', 'marcha rodilla puntos coincidentes → ok:false (obtuve ok:'+(fM&&fM.rodIzq.ok)+', val:'+(fM&&fM.rodIzq.val)+')');

  var lmMN = pose({ 11:L(0.45,0.1), 12:L(0.55,0.1), 23:L(NaN,0.5), 24:L(0.4,0.3),
                    25:L(0.5,0.5), 26:L(0.5,0.5), 27:L(0.4,0.7), 28:L(0.4,0.7), 0:L(0.5,0.05) });
  var fMN = X.calcularMarchaSagital(lmMN);
  chk(!(fMN && fMN.rodIzq.ok===true && (!isFinite(fMN.rodIzq.val) || Math.abs(fMN.rodIzq.val-180)<0.001)), 'B4', 'marcha rodilla con NaN → no 180/NaN con ok:true (obtuve ok:'+(fMN&&fMN.rodIzq.ok)+', val:'+(fMN&&fMN.rodIzq.val)+')');

  var lmS = pose({ 11:L(0.4,0.2), 12:L(0.6,0.2), 23:L(0.4,0.5), 24:L(0.6,0.5),
                   25:L(0.4,0.5), 26:L(0.6,0.5), 27:L(0.4,0.9), 28:L(0.6,0.9), 0:L(0.5,0.05) });
  var fS = X.calcularSentFrontal(lmS);
  chk(!(fS && fS.fppaIzq.ok===true && Math.abs(Math.abs(fS.fppaIzq.val)-180)<0.001), 'B5', 'sentadilla FPPA rodilla encimada → no ±180 con ok:true (obtuve ok:'+(fS&&fS.fppaIzq.ok)+', val:'+(fS&&fS.fppaIzq.val)+')');
})();

console.log('\n== D) Cadencia (solo sanity; la aceptación real de slow-mo va aparte) ==');
(function(){
  chk(T.cadenciaDudosa(420)===true, 'D2', 'cadencia 420 marcada dudosa');
  // NOTA: cadenciaDudosa(30)===false hoy — 120 pasos/min a 4× slow-mo pasa el filtro.
  // No se asierta aquí porque la corrección correcta NO es estirar el rango, sino
  // separar plausibilidad del movimiento de verificación del tiempo físico del archivo.
})();

console.log('\n== I) Comparador ==');
(function(){
  // Cruce de signo FPPA (+12 valgo → −14 varo severo) NO debe pintarse como mejora
  var A = { tipo:'sentadilla', medidas:[{ key:'fppa_der', media:12, unidad:'°' }] };
  var B = { tipo:'sentadilla', medidas:[{ key:'fppa_der', media:-14, unidad:'°' }] };
  var h = T.cmpTablaHTML(A,B);
  chk(!(/cmp-up/.test(h)), 'I1', 'FPPA +12→−14 (cruza a varo) no se pinta verde');
  // Δ dentro del margen de error (±5°) no debe colorearse
  var C = { tipo:'goniometria', medidas:[{ key:'rod_flex', lado:'der', grupo:'Rodilla', mov:'Flexión', grado:100 }] };
  var D = { tipo:'goniometria', medidas:[{ key:'rod_flex', lado:'der', grupo:'Rodilla', mov:'Flexión', grado:102 }] };
  var h2 = T.cmpTablaHTML(C,D);
  chk(!(/cmp-up/.test(h2)), 'I2', 'Δ+2° (< margen ±5°) no se colorea como mejora');
})();

console.log('\n== X) Sanity del hook ==');
chk(typeof X.calcularMarchaSagital==='function', 'X1', 'internos de marcha expuestos');
chk(typeof X.calcularSentFrontal==='function', 'X2', 'internos de sentadilla expuestos');

console.log('\nAceptación auditoría: '+pass+' OK, '+fail+' fallidas.');
process.exit(fail ? 1 : 0);
