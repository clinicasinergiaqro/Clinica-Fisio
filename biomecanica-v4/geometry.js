/* SINERGIA BIOMECHANICS — Motor 2D auditable; sin dependencias ni datos del paciente.
 * Las coordenadas se expresan SIEMPRE en px del raster original.
 * A: eje proximal, B: CENTRO ARTICULAR, C: eje distal.
 * No atribuye dirección ni máximo de movimiento a una sola fotografía.
 */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined' && module.exports) module.exports=api;
  if(root) root.SINERGIA_CORE=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const EPS=1e-8, RAD=180/Math.PI;
 const MODEL='sinergia-fotogonio-4.0.0';
 const isPoint=(p)=>!!p && Number.isFinite(p.x) && Number.isFinite(p.y);
 const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
 const clamp=(v,lo,hi)=>Math.min(hi,Math.max(lo,v));
 const normalize=(v)=>{const n=Math.hypot(v.x,v.y);return n>EPS?{x:v.x/n,y:v.y/n}:null;};
 const copyPoint=(p)=>({x:p.x,y:p.y});
 function angles(points){
   if(!points || !['A','B','C'].every(k=>isPoint(points[k]))) return {ok:false,reason:'MISSING_POINT'};
   const {A,B,C}=points, proximal={x:B.x-A.x,y:B.y-A.y}, distal={x:C.x-B.x,y:C.y-B.y};
   const lenA=dist(A,B),lenC=dist(B,C);
   if(lenA<EPS || lenC<EPS) return {ok:false,reason:'DEGENERATE_SEGMENT'};
   const dot=proximal.x*distal.x+proximal.y*distal.y;
   const cross=proximal.x*distal.y-proximal.y*distal.x;
   const signed=Math.atan2(cross,dot);  // -π..π, coordenadas de imagen y hacia abajo
   return {ok:true, angle:Math.abs(signed)*RAD, rawInterior:180-Math.abs(signed)*RAD,
     signedRadians:signed, proximalLen:lenA, distalLen:lenC, vertices:{A:copyPoint(A),B:copyPoint(B),C:copyPoint(C)}};
 }
 // Los mínimos de segmento son avisos, no reglas absolutas de amplitud fisiológica.
 function assess(points,image,opts={}){
   const r=angles(points);
   if(!r.ok) return {...r,quality:'unmeasurable',warnings:[r.reason]};
   const W=image?.width,H=image?.height;
   if(!(W>0 && H>0)) return {...r,ok:false,reason:'INVALID_IMAGE',quality:'unmeasurable',warnings:['INVALID_IMAGE']};
   const w=[];
   if(Object.values(r.vertices).some(p=>p.x<0||p.x>W||p.y<0||p.y>H)) w.push('POINT_OUT_OF_IMAGE');
   const k=opts.movement?.startsWith('wrist')?'wrist':'elbow';
   if(r.proximalLen<0.075*Math.min(W,H)) w.push('PROXIMAL_AXIS_SHORT');
   if(r.distalLen<((k==='wrist')?0.045:0.065)*Math.min(W,H)) w.push('DISTAL_AXIS_SHORT');
   if(opts.auto && !opts.manualReviewed) w.push('AUTOMATIC_NOT_ANATOMICAL_CERTIFICATION');
   if(!opts.maxConfirmed) w.push('POSITION_ONLY_MAX_NOT_CONFIRMED');
   if(opts.planeConfirmed===false) w.push('OUT_OF_PLANE');
   if(opts.movement==='elbow-hyperextension' && !opts.directionConfirmed) w.push('HYPEREXTENSION_DIRECTION_UNCONFIRMED');
   return {...r, quality:w.length?'review':'manual-reviewed', warnings:w};
 }
 function interpret(raw,movement, directionConfirmed){
   if(!raw?.ok) return null;
   if(movement==='elbow-flexion') return {name:'Flexión de codo',degrees:raw.angle};
   if(movement==='elbow-extension') return {name:'Déficit de extensión de codo',degrees:raw.angle};
   if(movement==='elbow-hyperextension') return directionConfirmed ? {name:'Hiperextensión de codo',degrees:raw.angle} : null;
   if(movement==='wrist-flexion') return {name:'Flexión de muñeca',degrees:raw.angle};
   if(movement==='wrist-extension') return {name:'Extensión de muñeca',degrees:raw.angle};
   return null;
 }
 // Las etiquetas y el arco proceden de esta MISMA geometría; nada se ajusta sólo para dibujar.
 function makeArc(points, radiusPx, samples=64){
   const a=angles(points);if(!a.ok)return null;
   const B=points.B;
   const t0=Math.atan2(B.y-points.A.y,B.x-points.A.x);
   const dt=a.signedRadians;
   const radius=clamp(radiusPx,5,Math.min(a.proximalLen,a.distalLen)*.43);
   const xy=[];
   for(let i=0;i<=samples;i++) {const t=t0+dt*i/samples;xy.push({x:B.x+Math.cos(t)*radius,y:B.y+Math.sin(t)*radius});}
   return {samples:xy,radius,center:copyPoint(B),deltaRadians:dt,angle:a.angle,midAngle:t0+dt*.5};
 }
 // Contrato para la interfaz que recibe Pose+Hands: rechazo es terminal, nunca fallback a índice.
 function wristAssociation({poseWrist,handWrist,elbow,frameWidth,frameHeight,handAvailable=true}={}){
   if(!handAvailable||!isPoint(handWrist))return {ok:false,reason:'HANDS_MISSING',fallbackAllowed:false};
   if(!isPoint(poseWrist)||!isPoint(elbow))return {ok:false,reason:'POSE_MISSING',fallbackAllowed:false};
   const fore=dist(poseWrist,elbow),d=dist(poseWrist,handWrist);
   if(!(fore>0)||!Number.isFinite(fore))return {ok:false,reason:'FOREARM_DEGENERATE',fallbackAllowed:false};
   if(fore<20)return {ok:false,reason:'FOREARM_TOO_SHORT',ratio:d/fore,fallbackAllowed:false};
   const ratio=d/fore;
   // Umbral heredado P0 12 %, provisional, NO validez anatómica automática.
   if(ratio>.12)return {ok:false,reason:'WRIST_MISMATCH',ratio,fallbackAllowed:false};
   return {ok:true,ratio,warn:ratio>=.1,method:'pose-and-hands-proxy',anatomyCertified:false};
 }
 // Adaptador optativo: MediaPipe propone puntos, no certifica anatomía.
 // Las dimensiones deben coincidir con la imagen original. Nunca se da número si el gate rechaza.
 function proposeFromDetector(data,{image,side,movement,protocol}={}){
   if(!image || !(image.width>0&&image.height>0))return {ok:false,reason:'IMAGE_REQUIRED'};
   const dims=data?.cuadro || data?.image || data?.dims || null;
   const frameW=dims?.w??dims?.width??data?.width,frameH=dims?.h??dims?.height??data?.height;
   if(!(frameW>0&&frameH>0))return {ok:false,reason:'FRAME_DIMS_MISSING'};
   if(frameW!==image.width||frameH!==image.height)return {ok:false,reason:'FRAME_DIMENSION_MISMATCH'};
   if(dims?.rot && dims.rot!==0)return {ok:false,reason:'ORIENTATION_MISMATCH'};
   const pose=data.pose33||data.poseLandmarks||data.pose||null;
   if(!Array.isArray(pose)||pose.length<33)return {ok:false,reason:'POSE_33_REQUIRED'};
   const right=side==='derecho'||side==='der';const idx=right?{S:12,E:14,W:16}:{S:11,E:13,W:15};
   function toPx(q){if(!q)return null;if(q.px)return isPoint(q.px)?copyPoint(q.px):null;if(!isPoint(q))return null;return {x:q.x*frameW,y:q.y*frameH};}
   function pAt(i){const q=pose[i];if(!q||(q.visibility!=null&&q.visibility<.5))return null;return toPx(q);}
   const shoulder=pAt(idx.S),elbow=pAt(idx.E),wrist=pAt(idx.W);
   if(!shoulder||!elbow||!wrist)return {ok:false,reason:'POSE_LANDMARK_MISSING'};
   if(movement?.startsWith('elbow'))return {ok:true,method:'pose-proposal',points:{A:shoulder,B:elbow,C:wrist},anatomyCertified:false,requiresManualReview:true};
   if(!movement?.startsWith('wrist'))return {ok:false,reason:'UNSUPPORTED_MOVEMENT'};
   const arr=data.manos||data.multiHandLandmarks||data.hands||[];
   if(!Array.isArray(arr)||!arr.length)return {ok:false,reason:'HANDS_NOT_AVAILABLE'};
   const di=protocol?.includes('5mcp')?17:9;let best=null;
   for(const item of arr){const hand=Array.isArray(item)?item:(item.pts||item.landmarks||null);
     if(!Array.isArray(hand)||!hand[0]||!hand[di])continue;
     const h0=toPx(hand[0]),end=toPx(hand[di]);if(!h0||!end)continue;
     const test=wristAssociation({poseWrist:wrist,handWrist:h0,elbow});const score=test.ratio??Infinity;
     if(!best||score<best.score)best={test,score,h0,end};
   }
   if(!best)return {ok:false,reason:'HANDS_LANDMARKS_INCOMPLETE'};
   if(!best.test.ok)return {ok:false,reason:best.test.reason,ratio:best.test.ratio};
   const C={x:wrist.x+(best.end.x-best.h0.x),y:wrist.y+(best.end.y-best.h0.y)};
   if(dist(wrist,C)<Math.max(8,.1*dist(elbow,wrist)))return {ok:false,reason:'METACARPAL_TOO_SHORT'};
   return {ok:true,method:'pose+hands-proposal',points:{A:elbow,B:wrist,C},
     matchRatio:best.test.ratio,protocol,anatomyCertified:false,requiresManualReview:true};
 }
 function provenance(input){
   const {image,points,movement,side,protocol,source='image',frameId=null,mediaTime=null,
    detector=null,manualReviewed=false,therapistConfirmation=false,maxConfirmed=false,directionConfirmed=false}=input;
   const parsed=assess(points,image,{movement,manualReviewed,auto:!!detector,maxConfirmed,directionConfirmed});
   if(!parsed.ok) throw new Error(parsed.reason);
   if(!manualReviewed)throw new Error('REVIEW_REQUIRED');
   if(!protocol)throw new Error('PROTOCOL_REQUIRED');
   const interp=interpret(parsed,movement,directionConfirmed);
   if(!interp)throw new Error('MOVEMENT_DIRECTION_UNCONFIRMED');
   return {engine:MODEL,createdAt:new Date().toISOString(),source,frameId,mediaTime,
     image:{width:image.width,height:image.height},selection:{movement,side,protocol},
     calculation:{degreeRaw:parsed.angle,degreeDisplay:Math.round(parsed.angle*10)/10,formula:'atan2(abs(cross),dot)',
       pointsPx:parsed.vertices,warnings:parsed.warnings,quality:parsed.quality},
     evidence:{maxConfirmed:!!maxConfirmed,directionConfirmed:!!directionConfirmed,manualReviewed:!!manualReviewed,
       therapistConfirmation:!!therapistConfirmation,detectorOriginal:detector},
     status:'FOTOGONIOMETRIA_2D_REVISADA_NO_VALIDADA_CON_GONIOMETRO',
     clinicalStatement:maxConfirmed?'Tope referido/confirmado por profesional':'Posición fotografiada; no demuestra rango máximo'};
 }
 return {MODEL,angles,assess,interpret,makeArc,wristAssociation,proposeFromDetector,provenance,dist,clamp};
});
