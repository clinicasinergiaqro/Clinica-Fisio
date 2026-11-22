// Suite del paquete SINERGIA BIOMECHANICS V4 (tests/geometry.test.cjs), VERBATIM salvo esta cabecera
// y la ruta del require: apunta al motor V4 ya integrado en el repo (biomecanica-v4/geometry.js).
'use strict';
const assert=require('node:assert/strict');
const C=require('../biomecanica-v4/geometry.js');
let checks=0;
const ok=(condition,message)=>{checks++;assert.ok(condition,message);};
const eq=(v,expected,msg,tol=1e-8)=>{checks++;assert.ok(Math.abs(v-expected)<tol, `${msg}: got ${v} wanted ${expected}`);};
const bend=(deg, len=160, B={x:210,y:250})=>{
 const t=deg*Math.PI/180;return {A:{x:B.x-160,y:B.y},B,C:{x:B.x+len*Math.cos(t),y:B.y+len*Math.sin(t)}};
};
for(const deg of [0,1,2,5,10,13,25,34.5,50,57,60,63,69,77,90,110,129,131,140,144,146,160,179.95]){
 const p=bend(deg);const r=C.angles(p);ok(r.ok,`valid angle ${deg}`);eq(r.angle,deg,`accurate ${deg}`,1e-8);
 const arc=C.makeArc(p,46);ok(!!arc,`arc exists ${deg}`);eq(arc.angle,r.angle,'arc matches value');
 eq(arc.center.x,p.B.x,'arc center x');eq(arc.center.y,p.B.y,'arc center y');
 for(const q of [arc.samples[0],arc.samples[20],arc.samples.at(-1)])eq(C.dist(q,arc.center),arc.radius,'on circle');
}
const p=bend(57);const r=C.angles(p);
const mirrored={A:{x:600-p.A.x,y:p.A.y},B:{x:600-p.B.x,y:p.B.y},C:{x:600-p.C.x,y:p.C.y}};
eq(C.angles(mirrored).angle,r.angle,'mirror invariance');
const trans={A:{x:p.A.x+17,y:p.A.y-40},B:{x:p.B.x+17,y:p.B.y-40},C:{x:p.C.x+17,y:p.C.y-40}};
eq(C.angles(trans).angle,r.angle,'translation invariance');
const scaled={A:{x:p.A.x*3,y:p.A.y*3},B:{x:p.B.x*3,y:p.B.y*3},C:{x:p.C.x*3,y:p.C.y*3}};
eq(C.angles(scaled).angle,r.angle,'uniform scale invariance');
ok(!C.angles({A:p.A,B:p.A,C:p.C}).ok,'degenerate segments rejected');
ok(!C.angles({A:{x:NaN,y:1},B:p.B,C:p.C}).ok,'nan rejected');
ok(!C.assess(p,{width:0,height:200}).ok,'invalid image rejected');
const result=C.assess(p,{width:900,height:1300},{movement:'wrist-flexion',manualReviewed:true});
ok(result.warnings.includes('POSITION_ONLY_MAX_NOT_CONFIRMED'),'static photo not maximum');
const hand={x:180,y:200};let w=C.wristAssociation({poseWrist:{x:200,y:200},handWrist:hand,elbow:{x:100,y:200}});
ok(!w.ok && w.reason==='WRIST_MISMATCH' && w.fallbackAllowed===false,'20 pct mismatch rejected, no index fallback');
for(const v of [13,15,20,40,70]){w=C.wristAssociation({poseWrist:{x:200,y:200},handWrist:{x:200+v,y:200},elbow:{x:100,y:200}});ok(!w.ok,'mismatch '+v+' pct rejected');}
w=C.wristAssociation({poseWrist:{x:200,y:200},handWrist:{x:203,y:200},elbow:{x:100,y:200}});ok(w.ok && w.anatomyCertified===false,'close wrists not anatomical certification');
w=C.wristAssociation({poseWrist:{x:200,y:200},handAvailable:false,elbow:{x:100,y:200}});ok(!w.ok&&!w.fallbackAllowed,'hands absent no silent index fallback');
try{C.provenance({image:{width:900,height:1300},points:p,movement:'wrist-flexion',side:'derecho',protocol:'proxy-3mcp-manual',manualReviewed:false});ok(false,'must reject unreviewed');}catch(e){ok(e.message==='REVIEW_REQUIRED','fail closed unreviewed');}
try{C.provenance({image:{width:900,height:1300},points:p,movement:'elbow-hyperextension',side:'derecho',protocol:'2d-ejes-manuales',manualReviewed:true,directionConfirmed:false});ok(false,'must reject unconfirmed hyperextension');}catch(e){ok(e.message==='MOVEMENT_DIRECTION_UNCONFIRMED','hyperext requires direction');}
const rec=C.provenance({image:{width:900,height:1300},points:p,movement:'wrist-flexion',side:'derecho',protocol:'proxy-3mcp-manual',manualReviewed:true,maxConfirmed:false,directionConfirmed:false,detector:{name:'source-detector',matchRatio:.02}});
ok(rec.calculation.degreeRaw===C.angles(p).angle,'same math in provenance');ok(rec.selection.protocol==='proxy-3mcp-manual','preserves protocol');ok(rec.evidence.detectorOriginal.matchRatio===.02,'preserves original QC');ok(rec.calculation.pointsPx.B.x===p.B.x,'preserves manual vertex');ok(rec.clinicalStatement.startsWith('Posición'),'does not claim maximal range');
for(const angle of [13,60,140]){
 const ratio=1.9,src=bend(angle,100,{x:200,y:350}),newp={};for(const k of ['A','B','C'])newp[k]={x:src[k].x*ratio,y:src[k].y*ratio};eq(C.angles(src).angle,C.angles(newp).angle,'export scaling stable');
}
console.log(`SINERGIA V4 / geometry: ${checks} verificaciones OK`);
// Future adapters must be tested with real data sets. These are synthetic deterministic fixtures.
const pose=Array.from({length:33},()=>({x:.5,y:.5,visibility:0}));
pose[12]={x:.30,y:.20,visibility:.98};pose[14]={x:.40,y:.40,visibility:.98};pose[16]={x:.60,y:.4,visibility:.98};
const base={cuadro:{w:1000,h:800,rot:0},pose33:pose};
let suggestion=C.proposeFromDetector(base,{image:{width:1000,height:800},side:'derecho',movement:'elbow-flexion',protocol:'2d-ejes-manuales'});
ok(suggestion.ok && suggestion.requiresManualReview && !suggestion.anatomyCertified,'pose suggests only');
suggestion=C.proposeFromDetector(base,{image:{width:800,height:1000},side:'derecho',movement:'elbow-flexion',protocol:'2d-ejes-manuales'});
ok(!suggestion.ok && suggestion.reason==='FRAME_DIMENSION_MISMATCH','reject frame dimension mismatch');
const h=Array.from({length:21},()=>({x:.6,y:.4}));h[0]={x:.79,y:.4};h[9]={x:.84,y:.38};
suggestion=C.proposeFromDetector({...base,manos:[h]},{image:{width:1000,height:800},side:'derecho',movement:'wrist-flexion',protocol:'proxy-3mcp-manual'});
ok(!suggestion.ok && suggestion.reason==='WRIST_MISMATCH','reject mismatched wrist no fallback');
h[0]={x:.605,y:.4};h[9]={x:.675,y:.35};
suggestion=C.proposeFromDetector({...base,manos:[h]},{image:{width:1000,height:800},side:'derecho',movement:'wrist-flexion',protocol:'proxy-3mcp-manual'});
ok(suggestion.ok && suggestion.requiresManualReview,'valid matching wrist still requires review');
console.log('SINERGIA V4 / detector adapter: 4 verificaciones OK');
