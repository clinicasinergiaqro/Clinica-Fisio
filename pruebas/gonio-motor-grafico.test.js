/* ============================================================================
 * MOTOR GEOMÉTRICO/GRÁFICO V3 — arco firmado ≡ número (2ª revisión independiente, 2026-11-20)
 *
 * Verifica, sobre los 8 casos REALES de la auditoría (fixtures numéricos anonimizados: solo
 * coordenadas de articulación + ángulos; sin imágenes) y casos sintéticos:
 *  · |barrido| del arco == valor clínico EXACTO antes de redondear (fin del hallazgo G1:
 *    el motor viejo barría 184–322° por el lado reflejo en 4/8 casos).
 *  · barrido ∈ [-π, π]; invariancia a espejo y escala (|barrido| igual, signo volteado).
 *  · radio del arco acotado al segmento más corto (G3) y etiqueta DENTRO del lienzo o
 *    explícitamente "labelOutside" (G2), sin tocar ejes/arco/puntos.
 *  · el RENDERER dibuja el arco con ESE mismo barrido (ctx grabador) y lo SUPRIME cuando el
 *    valor clínico mostrado difiere de la geometría (tobillo truncado a 0°): nunca un arco que mienta.
 *  · _gonioValorDesdePx (ajuste manual) == calcularGonio para los mismos puntos (px ≡ norm×aspecto).
 *  · techo V3 como bandera (fueraTecho) también en la vía manual.
 *  · _renderAnotada produce anotada (con barra de procedencia) + original intactos.
 *
 * Node puro (vm + stubs). Hooks: window.__BIO_GFX + window.__BIO_TEST.
 *   node pruebas/gonio-motor-grafico.test.js medidor-biomecanico.js
 * ==========================================================================*/
'use strict';
var vm = require('vm');
var fs = require('fs');
var path = require('path');

var modPath = process.argv[2] || path.join(__dirname, '..', 'medidor-biomecanico.js');
var src = fs.readFileSync(modPath, 'utf8');

var noop = function(){};
function recCtx(w, h){
  var calls = { arc:[], text:[], rect:[], lines:0 };
  var ctx = {
    canvas: { width:w, height:h, clientWidth:0 },
    save:noop, restore:noop, beginPath:noop, closePath:noop,
    moveTo:noop, lineTo:function(){ calls.lines++; }, stroke:noop, fill:noop,
    setLineDash:noop, translate:noop, rotate:noop, clearRect:noop, drawImage:noop,
    fillRect:function(x,y,w2,h2){ calls.rect.push([x,y,w2,h2]); },
    arc:function(x,y,r,a1,a2,ccw){ calls.arc.push({ x:x, y:y, r:r, a1:a1, a2:a2, ccw:!!ccw }); },
    arcTo:noop,
    fillText:function(t,x,y){ calls.text.push({ t:String(t), x:x, y:y }); },
    measureText:function(t){ return { width:String(t).length*14 }; }
  };
  return { ctx:ctx, calls:calls };
}
function canvasStub(){
  var rec = recCtx(0,0);
  var cv = { width:0, height:0, style:{},
             getContext:function(){ rec.ctx.canvas=cv; return rec.ctx; },
             toBlob:noop, _rec:rec };
  return cv;
}
var win = {};
var ctx = {
  window: win,
  document: { createElement: function(tag){ return canvasStub(); },
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

var X = win.__BIO_GFX, T = win.__BIO_TEST;
if(!X || !X.geom || !X.layout || !X.trazarGonio || !X.valorDesdePx || !T || !T.calcularGonio){
  console.error('FALLO: hooks __BIO_GFX/__BIO_TEST incompletos'); process.exit(1);
}

var pass=0, fail=0;
function chk(c, id, msg){ if(c){ pass++; console.log('  ✓ '+id+' '+msg); } else { fail++; console.log('  ✗ '+id+' '+msg); } }
function near(a, b, tol){ return a!=null && isFinite(a) && Math.abs(a-b)<=tol; }
var DEG=180/Math.PI;

// ── Los 8 casos de la auditoría (coordenadas px del cuadro orientado + ángulo crudo esperado).
// barridoViejo = lo que el motor horario fijo dibujaba (hallazgo G1); 4/8 eran arcos reflejos.
var CASOS=[
 { id:'cod_flex_der', res:[608,1080],  A:[213.4,435.5],  V:[213.8,614.2],  C:[305.8,527.3],  crudo:133.192,  viejo:46.8  },
 { id:'cod_flex_izq', res:[608,1080],  A:[350.8,441.4],  V:[323.8,611.9],  C:[269.7,514.0],  crudo:142.0729, viejo:322.1 },
 { id:'cod_ext_der',  res:[608,1080],  A:[211.6,411.9],  V:[216.7,582.9],  C:[253.9,730.1],  crudo:12.4528,  viejo:167.5 },
 { id:'cod_ext_izq',  res:[608,1080],  A:[345.4,441.9],  V:[344.0,620.3],  C:[331.8,777.6],  crudo:4.0093,   viejo:184.0 },
 { id:'mun_flex_der', res:[1932,2576], A:[673.3,1509.7], V:[1168.4,1581.1],C:[1259.9,1777.3],crudo:56.7957,  viejo:236.8 },
 { id:'mun_flex_izq', res:[1932,2576], A:[1302.4,1586.0],V:[674.4,1570.6], C:[514.2,1723.1], crudo:45.0024,  viejo:135.0 },
 { id:'mun_ext_der',  res:[1932,2576], A:[607.1,1673.5], V:[1119.5,1645.0],C:[1238.9,1553.0],crudo:34.432,   viejo:145.6 },
 { id:'mun_ext_izq',  res:[1932,2576], A:[1246.3,1574.7],V:[567.5,1646.7], C:[513.4,1485.0], crudo:77.536,   viejo:257.5 }
];
function P(a){ return { x:a[0], y:a[1] }; }

console.log('\n== 8 casos de auditoría: geometría firmada ==');
CASOS.forEach(function(c){
  var g=X.geom(P(c.A), P(c.V), P(c.C), 'straight');
  chk(g.ok && near(g.degrees, c.crudo, 0.15), c.id, '|barrido| '+(g.ok?g.degrees.toFixed(2):'—')+'° ≈ crudo '+c.crudo+'°');
  chk(g.ok && Math.abs(g.sweep)<=Math.PI+1e-12 && near(Math.abs(g.sweep)*DEG, g.degrees, 1e-9), c.id, 'barrido ∈ [-π,π] y arco≡número exacto (pre-redondeo)');
  chk(g.ok && g.degrees<180.0001 && Math.abs(g.degrees-c.viejo)>0.6==(c.viejo>180||Math.abs(c.viejo-c.crudo)>0.6), c.id, 'ya no existe el barrido reflejo del motor viejo ('+c.viejo+'°)');
  // espejo + escala: |barrido| idéntico, signo volteado
  function tf(q){ return { x:-q.x*2+10000, y:q.y*2+30 }; }
  var h=X.geom(tf(P(c.A)), tf(P(c.V)), tf(P(c.C)), 'straight');
  chk(h.ok && near(h.degrees, g.degrees, 1e-8) && near(g.sweep + h.sweep, 0, 1e-8), c.id, 'invariante a espejo/escala (signo volteado)');
  // layout: radio < segmento más corto; etiqueta DENTRO del lienzo o labelOutside explícito
  var l=X.layout(g, c.res[0], c.res[1], { text:'≈'+Math.round(g.degrees)+'°', textWidth:70, k:Math.max(1,c.res[0]/420) });
  chk(l && l.radius < Math.min(g.l1, g.l2), c.id, 'radio del arco < segmento más corto (G3)');
  chk(l && (l.labelOutside || (l.label && l.label.x>=0 && l.label.y>=0 && l.label.x+l.label.w<=c.res[0] && l.label.y+l.label.h<=c.res[1])), c.id, 'etiqueta dentro del lienzo o fallback externo (G2)');
});

console.log('\n== renderer real: el arco dibujado ES el número ==');
CASOS.forEach(function(c){
  var rc=recCtx(c.res[0], c.res[1]);
  var manual={ A:P(c.A), V:P(c.V), C:P(c.C) };
  var out=X.trazarGonio(rc.ctx, c.res[0], c.res[1], null, (c.id.indexOf('mun')===0?'Muñeca':'Codo'), (c.id.slice(-3)==='izq'?'izq':'der'), c.crudo, null, { manual:manual });
  var arcos=rc.calls.arc.filter(function(a){ return Math.abs(Math.abs(a.a2-a.a1)-Math.PI*2)>1e-6; });   // excluye los puntos (círculos completos)
  chk(out && arcos.length===2, c.id, 'arco dibujado (halo+dorado) sobre puntos manuales');
  if(arcos.length){
    var sw=Math.abs(arcos[0].a2-arcos[0].a1)*DEG;
    chk(near(sw, c.crudo, 0.15), c.id, 'barrido DIBUJADO '+sw.toFixed(2)+'° == número '+c.crudo+'°');
    chk(near(arcos[0].x, c.V[0], 1e-6) && near(arcos[0].y, c.V[1], 1e-6), c.id, 'arco centrado en el vértice');
    chk(arcos[0].ccw === (arcos[0].a2-arcos[0].a1<0), c.id, 'sentido del trazo coincide con el signo del barrido');
  } else { fail+=3; }
  chk(rc.calls.text.length===0 || rc.calls.text.some(function(t){ return t.t===Math.round(c.crudo)+'°'; }), c.id, 'si hay etiqueta, el texto es el número clínico');
});

console.log('\n== sintéticos: neutro, degenerado, tobillo, truncado-0, ceros ==');
(function(){
  var g=X.geom({x:0,y:0},{x:0,y:10},{x:0,y:20},'straight');
  chk(g.ok && near(g.degrees,0,1e-9), 'S1', 'neutro recto → 0° exacto');
  chk(X.geom({x:0,y:0},{x:0,y:0},{x:0,y:20},'straight').ok===false, 'S2', 'segmento degenerado → no medible');
  // tobillo: perpendicular del lado del pie → |interior−90|, sin exigir orientación manual
  var t1=X.geom({x:0,y:0},{x:0,y:100},{x:100,y:100},'ankle');
  chk(t1.ok && near(t1.degrees,0,1e-9), 'S3', 'tobillo pie a 90° (neutro) → 0°');
  var t2=X.geom({x:0,y:0},{x:0,y:100},{x:100,y:60},'ankle');          // interior ≈ 111.8° → PF 21.8
  chk(t2.ok && near(t2.degrees, Math.abs(t2.interiorDeg-90), 1e-9) && near(t2.degrees, 21.801, 0.01), 'S4', 'tobillo |interior−90| = '+t2.degrees.toFixed(2)+'°');
  var t3=X.geom({x:0,y:0},{x:0,y:100},{x:-80,y:40},'ankle');          // pie del otro lado → misma regla
  chk(t3.ok && near(t3.degrees, Math.abs(t3.interiorDeg-90), 1e-9), 'S5', 'tobillo lado contrario: misma magnitud, perpendicular correcta');
  // valorDesdePx: pie DORSIflexionado (interior 68.2°) → DF=21.8°; PF seleccionada con ese pie → 0 (truncado)
  var ptsT={ A:{x:0,y:0}, V:{x:0,y:100}, C:{x:100,y:60}, mode:'ankle' };
  var vDF=X.valorDesdePx(ptsT,'Tobillo','Dorsiflexión'), vPF=X.valorDesdePx(ptsT,'Tobillo','Plantiflexión');
  chk(vDF.ok && near(vDF.val, 21.801, 0.01), 'S6', 'DF con pie dorsiflexionado → 21.8°');
  chk(vPF.ok && vPF.val===0, 'S7', 'PF mismos puntos (mov equivocado para la postura) → 0° (truncado, como el detector)');
  // …y el RENDERER no dibuja un arco no nulo cuando el valor mostrado es 0 (regla "truncado 0")
  var rc=recCtx(400,400);
  X.trazarGonio(rc.ctx, 400, 400, null, 'Tobillo', 'der', vPF.val, null, { manual:ptsT });
  var arcos=rc.calls.arc.filter(function(a){ return Math.abs(Math.abs(a.a2-a.a1)-Math.PI*2)>1e-6; });
  chk(arcos.length===0, 'S8', 'valor mostrado 0° con geometría 21.8° → SIN arco (nunca un arco que mienta)');
  var rc2=recCtx(400,400);
  X.trazarGonio(rc2.ctx, 400, 400, null, 'Tobillo', 'der', vDF.val, null, { manual:ptsT });
  var arcos2=rc2.calls.arc.filter(function(a){ return Math.abs(Math.abs(a.a2-a.a1)-Math.PI*2)>1e-6; });
  chk(arcos2.length===2 && near(Math.abs(arcos2[0].a2-arcos2[0].a1)*DEG, 21.801, 0.05), 'S9', 'DF 21.8° → arco de 21.8° dibujado');
})();

console.log('\n== ajuste manual ≡ detector (px ≡ norm×aspecto) + techo V3 en vía manual ==');
(function(){
  function L(x,y){ return { x:x, y:y, z:0, visibility:1 }; }
  var lm=[]; for(var i=0;i<33;i++) lm[i]=L(0.5,0.5);
  lm[12]=L(0.50,0.20); lm[14]=L(0.50,0.50); lm[16]=L(0.80,0.50);   // codo der a 90°
  T.setAspect(1,1);
  var rDet=T.calcularGonio(lm,'Codo','Flexión','der');
  var pts=X.gonioPtsPx(lm,'Codo','der',rDet,1000,1000,null);
  var rPx=X.valorDesdePx(pts,'Codo','Flexión');
  chk(rDet.ok && rPx.ok && near(rPx.val, rDet.val, 1e-6) && near(rPx.val, 90, 1e-6), 'M1', 'mismos puntos: detector '+rDet.val.toFixed(3)+'° == manual-px '+rPx.val.toFixed(3)+'°');
  // aspecto 9:16: normalizado×AR == px directo
  T.setAspect(608,1080);
  var rDet2=T.calcularGonio(lm,'Codo','Flexión','der');
  var pts2=X.gonioPtsPx(lm,'Codo','der',rDet2,608,1080,null);
  var rPx2=X.valorDesdePx(pts2,'Codo','Flexión');
  chk(near(rPx2.val, rDet2.val, 1e-6), 'M2', 'cuadro 9:16: manual-px '+rPx2.val.toFixed(2)+'° == detector '+rDet2.val.toFixed(2)+'° (H1 implícito en px)');
  T.setAspect(1,1);
  // techo V3 por la vía manual: valor conservado + bandera
  var ptsSup={ A:{x:0,y:0}, V:{x:0,y:100}, C:{x:5,y:260}, mode:'straight' };   // casi recto → déficit chico
  var rSup=X.valorDesdePx({ A:{x:0,y:200}, V:{x:0,y:100}, C:{x:95,y:130}, mode:'straight' }, 'Cadera', 'Extensión');  // ~72° > techo 50
  chk(rSup.ok && rSup.fueraTecho===true && rSup.val>50, 'M3', 'manual > techo → ok + fueraTecho (confirmable), valor conservado');
  var rLim=X.valorDesdePx(ptsSup,'Codo','Extensión');
  chk(rLim.ok && !rLim.fueraTecho && rLim.val<30, 'M4', 'manual dentro de techo → limpio');
})();

console.log('\n== _renderAnotada: anotada con barra de procedencia + original intacto ==');
(function(){
  var base=canvasStub(); base.width=800; base.height=600;
  var manual={ A:{x:100,y:500}, V:{x:400,y:300}, C:{x:650,y:200} };
  var out=X.renderAnotada({ base:base, lm:null, r:null, val:57, grupo:'Codo', mov:'Flexión', lado:'der', manualPts:manual, hd:null, revision:'manual' });
  chk(!!out && !!out.annot && !!out.orig, 'R1', 'devuelve anotada + original');
  chk(out && out.annot.width===800 && out.annot.height>600, 'R2', 'anotada = cuadro + BARRA DE PROCEDENCIA debajo (no tapa anatomía)');
  chk(out && out.orig.width===800 && out.orig.height===600, 'R3', 'original con las dimensiones EXACTAS del cuadro (sin anotar)');
  var rec=out && out.annot._rec;
  chk(rec && rec.calls.text.some(function(t){ return /Codo · Flexión · Der/.test(t.t) && /57°/.test(t.t); }), 'R4', 'la barra lleva movimiento · lado · valor');
  chk(rec && rec.calls.text.some(function(t){ return /ajuste manual/.test(t.t); }), 'R5', 'revisión manual marcada ("ajuste manual") en la barra');
})();

console.log('\nMotor gráfico V3: '+pass+' OK, '+fail+' fallidas.');
process.exit(fail ? 1 : 0);
