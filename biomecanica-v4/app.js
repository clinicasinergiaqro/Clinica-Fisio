/* Sinergia V4 – visor manual clínico (funciona offline en file://).
 * No envía datos a servidores y no crea una nueva entrada de expediente sin confirmación.
 */
(()=>{'use strict';
const CORE=window.SINERGIA_CORE, $=id=>document.getElementById(id);
const cv=$('photoCanvas'),ctx=cv.getContext('2d'),stage=$('stage'),
 defaults={image:null,source:'image',fileName:'',imageData:null,video:null,videoUrl:null,mediaTime:null,frameId:null,
  points:{},placing:'A',drag:null,zoom:1,panX:0,panY:0,showLines:true,showLabel:true,
  movement:'elbow-flexion',side:'derecho',protocol:'2d-ejes-manuales',
  anatomyOk:false,planeOk:false,maxOk:false,directionOk:false,records:[],
  currentImageVersion:0,detectorOriginal:null,warning:null,stageW:1,stageH:1,transform:null,labelRect:null,labelDrag:{x:0,y:0}};
let S={...defaults};
const keys=['A','B','C'];
const defs={
 'elbow-flexion': ['Eje longitudinal del húmero','Centro articular del codo','Eje longitudinal del antebrazo'],
 'elbow-extension':['Eje longitudinal del húmero','Centro articular del codo','Eje longitudinal del antebrazo'],
 'elbow-hyperextension':['Eje longitudinal del húmero','Centro articular del codo','Eje longitudinal del antebrazo'],
 'wrist-flexion':['Eje central del antebrazo (cúbito en vista lateral)','Centro articular de la muñeca','Eje metacarpiano elegido'],
 'wrist-extension':['Eje central del antebrazo (cúbito en vista lateral)','Centro articular de la muñeca','Eje metacarpiano elegido']
};
const isWrist=()=>S.movement.startsWith('wrist');
function protocols(){ const sel=$('protocol'),p=S.protocol;
 if(isWrist()){sel.innerHTML='<option value="proxy-3mcp-manual">Muñeca · proxy 3.er metacarpiano</option><option value="lateral-5mcp-manual">Muñeca · aproximación lateral 5.º MCP</option>';S.protocol=p.startsWith('2d')?'proxy-3mcp-manual':p;}
 else{sel.innerHTML='<option value="2d-ejes-manuales">Codo · ejes manuales de imagen</option>';S.protocol='2d-ejes-manuales';}
 sel.value=S.protocol;
 defs[S.movement].forEach((s,i)=>$('name'+keys[i]).textContent=s);
 $('directionWrap').hidden=S.movement!=='elbow-hyperextension';
}
const filename=(s)=>String(s).replace(/[^a-z0-9_-]+/gi,'_').slice(0,65);
function download(filename,blob){const link=document.createElement('a'),url=URL.createObjectURL(blob);link.href=url;link.download=filename;document.body.appendChild(link);link.click();setTimeout(()=>{URL.revokeObjectURL(url);link.remove();},1200);}
function updateVideoUI(){ $('videoControls').hidden=S.source!=='video';if(S.source==='video'&&S.video){$('videoSeek').max=S.video.duration||10;$('videoSeek').value=S.mediaTime||0;$('videoTime').textContent=`${Number(S.mediaTime||0).toFixed(2)} s`;} }
function resetPoints(){ S.points={};S.detectorOriginal=null;S.placing='A';S.anatomyOk=false;S.planeOk=false;S.maxOk=false;S.directionOk=false;S.labelDrag={x:0,y:0};$('anatomyCheck').checked=$('planeCheck').checked=$('maxCheck').checked=$('directionCheck').checked=false; update(); }
function newFrame(img,{source='photo',name='',time=null}={}){S.detectorOriginal=null;S.image=img;S.source=source;S.fileName=name;S.mediaTime=time;S.frameId=`${Date.now()}-${++S.currentImageVersion}`;S.zoom=1;S.panX=0;S.panY=0;resetPoints();$('emptyState').hidden=true;$('viewerTitle').textContent=name||'Imagen clínica';$('viewerMeta').textContent=`${img.width} × ${img.height} px · ${source==='video'?'fotograma '+Number(time).toFixed(2)+' s':'fotografía original'}`;updateVideoUI();render();}
$('detectorInput').addEventListener('change',async e=>{
 const file=e.target.files?.[0];if(!file)return;
 if(!S.image){alert('Primero carga la fotografía o fija el fotograma exacto del video.');return;}
 try{
   const data=JSON.parse(await file.text());const r=CORE.proposeFromDetector(data,{image:{width:S.image.width,height:S.image.height},side:S.side,movement:S.movement,protocol:S.protocol});
   if(!r.ok){alert('Propuesta rechazada: '+r.reason+(r.ratio!=null?' (desacuerdo '+(r.ratio*100).toFixed(1)+'%)':'')+'. Marca manualmente o repite la toma.');return;}
   S.points={A:{...r.points.A},B:{...r.points.B},C:{...r.points.C}};
   S.detectorOriginal={method:r.method,protocol:S.protocol,matchRatio:r.matchRatio??null,
     acquisition:{width:S.image.width,height:S.image.height,frameId:S.frameId,mediaTime:S.mediaTime},
     originalPoints:r.points,anatomyCertified:false};
   S.anatomyOk=false;$('anatomyCheck').checked=false;S.placing='B';
   update();$('coordHint').textContent='Puntos PROPUESTOS por detector: corrige A, B y C y confirma antes de guardar. No certificados anatómicamente.';
 }catch(err){alert('Error leyendo JSON: '+err.message);}finally{e.target.value='';}
});
$('photoInput').addEventListener('change',e=>{const file=e.target.files?.[0];if(!file)return;const url=URL.createObjectURL(file),image=new Image();image.onload=()=>{if(S.videoUrl){URL.revokeObjectURL(S.videoUrl);S.videoUrl=null;}S.video=null;newFrame(image,{source:'photo',name:file.name});URL.revokeObjectURL(url);};image.onerror=()=>alert('No fue posible leer esta fotografía');image.src=url;});
$('videoInput').addEventListener('change',e=>{const file=e.target.files?.[0];if(!file)return;if(S.videoUrl)URL.revokeObjectURL(S.videoUrl);
  S.videoUrl=URL.createObjectURL(file);const v=document.createElement('video');v.preload='auto';v.muted=true;v.playsInline=true;v.src=S.videoUrl;S.video=v;S.fileName=file.name;
  v.onloadedmetadata=()=>{S.source='video';S.mediaTime=0;$('videoControls').hidden=false;updateVideoUI();v.currentTime=0;};v.onseeked=()=>{freeze();};v.onerror=()=>alert('No pude abrir este archivo de video en el navegador.');});
function freeze(){const v=S.video;if(!v||!(v.videoWidth>0))return;v.pause();const buf=document.createElement('canvas');buf.width=v.videoWidth;buf.height=v.videoHeight;buf.getContext('2d').drawImage(v,0,0);newFrame(buf,{source:'video',name:S.fileName,time:v.currentTime});}
function seek(time){if(!S.video)return;const v=S.video;v.pause();v.currentTime=CORE.clamp(time,0,v.duration||0);}
$('videoSeek').addEventListener('input',e=>seek(Number(e.target.value)));
$('videoBack').onclick=()=>seek((S.mediaTime||0)-.1);$('videoForward').onclick=()=>seek((S.mediaTime||0)+.1);$('videoFreeze').onclick=freeze;
function viewport(){const r=cv.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,3);S.stageW=Math.round(r.width);S.stageH=Math.round(r.height);if(cv.width!==Math.round(r.width*dpr)||cv.height!==Math.round(r.height*dpr)){cv.width=Math.round(r.width*dpr);cv.height=Math.round(r.height*dpr);}ctx.setTransform(dpr,0,0,dpr,0,0);return {width:r.width,height:r.height};}
function project(p){const t=S.transform;return {x:t.x+p.x*t.k,y:t.y+p.y*t.k};}
function unproject(x,y){const t=S.transform;return {x:(x-t.x)/t.k,y:(y-t.y)/t.k};}
function render(){const sz=viewport();ctx.clearRect(0,0,sz.width,sz.height);ctx.fillStyle='#172536';ctx.fillRect(0,0,sz.width,sz.height);if(!S.image){return;}
 const fit=Math.min(sz.width/S.image.width,sz.height/S.image.height),k=fit*S.zoom;
 const x=(sz.width-S.image.width*k)/2+S.panX, y=(sz.height-S.image.height*k)/2+S.panY;
 S.transform={k,x,y};ctx.drawImage(S.image,x,y,S.image.width*k,S.image.height*k);
 if(S.showLines)drawMeasurement(ctx,S.points,{map:project,width:sz.width,height:sz.height,mode:'screen'});
 else for(const key of keys){const p=S.points[key];if(p)drawHandle(ctx,project(p),key, key===S.placing);}
}
function drawHandle(c,p,name,selected){c.save();c.shadowColor='#162b40';c.shadowBlur=6;c.beginPath();c.arc(p.x,p.y,selected?10:8,0,Math.PI*2);c.fillStyle='#ebc568';c.fill();c.strokeStyle='#17344e';c.lineWidth=2.7;c.stroke();c.shadowBlur=0;c.fillStyle='#122b44';c.font='900 11px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText(name,p.x,p.y+.5);c.restore();}
function drawMeasurement(c,p,{map,width,height,mode='screen',font=null}={}){
 const good=['A','B','C'].every(k=>p[k]);
 if(!good){keys.forEach(k=>{if(p[k])drawHandle(c,map(p[k]),k,S.placing===k)});return;}
 const q={A:map(p.A),B:map(p.B),C:map(p.C)},r=CORE.angles(q);
 if(!r.ok)return;
 const u={x:q.B.x-q.A.x,y:q.B.y-q.A.y},v={x:q.C.x-q.B.x,y:q.C.y-q.B.y};
 const ln=Math.max(3,Math.min(5.5,width*.005));c.save();c.lineCap='round';c.lineJoin='round';
 c.beginPath();c.moveTo(q.A.x,q.A.y);c.lineTo(q.B.x,q.B.y);c.lineTo(q.C.x,q.C.y);c.strokeStyle='#142d46';c.lineWidth=ln+4.4;c.stroke();c.strokeStyle='#ffffff';c.lineWidth=ln;c.stroke();
 // Prolongación desde la muñeca/codo hacia el sentido proximal para referencia neutra.
 const mag=Math.hypot(u.x,u.y),nx=u.x/mag,ny=u.y/mag;
 if(mag>0){c.setLineDash([7,7]);c.strokeStyle='#d7b56b';c.lineWidth=2.2;c.beginPath();c.moveTo(q.B.x,q.B.y);c.lineTo(q.B.x+nx*Math.min(70,width*.12),q.B.y+ny*Math.min(70,width*.12));c.stroke();c.setLineDash([]);}
 const raw=CORE.makeArc(q,Math.min(43,width*.08),84);if(raw){
   c.beginPath();raw.samples.forEach((pt,i)=>i?c.lineTo(pt.x,pt.y):c.moveTo(pt.x,pt.y));
   c.lineWidth=7;c.strokeStyle='#17344e';c.stroke();c.lineWidth=3.8;c.strokeStyle='#e6bb59';c.stroke();
 }
 for(const k of keys)drawHandle(c,q[k],k,S.placing===k);
 if(S.showLabel){const deg=Math.round(r.angle*10)/10;
  const fsz=font||Math.max(24,Math.min(30,width*.046));
  c.font=`900 ${fsz}px Arial,sans-serif`;let lbl=`${deg.toFixed(1)}°`,tw=c.measureText(lbl).width+29;
  const th=fsz+19;
  const dir=raw?{x:Math.cos(raw.midAngle),y:Math.sin(raw.midAngle)}:{x:1,y:0};
  let pos={x:q.B.x+dir.x*(raw?.radius||26)+dir.x*80+S.labelDrag.x,
           y:q.B.y+dir.y*(raw?.radius||26)+dir.y*80+S.labelDrag.y};
  // Enfocar el rótulo lejos del vértice y dentro del raster visible.
  let lx=CORE.clamp(pos.x-tw/2,5,width-tw-5),ly=CORE.clamp(pos.y-th/2,5,height-th-5);
  c.shadowColor='#001a2e77';c.shadowBlur=10;c.fillStyle='#0e2b43';roundRect(c,lx,ly,tw,th,8);c.fill();c.shadowBlur=0;c.strokeStyle='#d9c18b';c.lineWidth=1.5;c.stroke();
  c.fillStyle='#ffffff';c.textAlign='center';c.textBaseline='middle';c.fillText(lbl,lx+tw/2,ly+th/2+1);
  if(mode==='screen')S.labelRect={x:lx,y:ly,width:tw,height:th};
 }
 c.restore();
}
function roundRect(c,x,y,w,h,r){r=Math.min(r,w/2,h/2);c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
function getValue(){if(!S.image)return {ok:false};const out=CORE.assess(S.points,{width:S.image.width,height:S.image.height},{movement:S.movement,maxConfirmed:S.maxOk,manualReviewed:S.anatomyOk,auto:!!S.detectorOriginal,planeConfirmed:S.planeOk,directionConfirmed:S.directionOk});return out;}
function update(){ protocols();for(const key of keys){$('place'+key).classList.toggle('current',S.placing===key);}
 const a=getValue();$('degreeValue').innerHTML=a.ok?`${a.angle.toFixed(1)}<span>°</span>`:'—<span>°</span>';
 $('angleCaption').textContent=a.ok?`${$('movement').selectedOptions[0]?.text||''} · ${S.side}`:`Coloca ${keys.filter(k=>!S.points[k]).length} referencias anatómicas`;
 const risky=a.ok&&a.warnings.filter(x=>x!=='POSITION_ONLY_MAX_NOT_CONFIRMED');
 $('quality').textContent=a.ok?(risky.length?`Revisión requerida: ${risky.join(', ')}`:'Geometría revisada · no validada contra goniómetro'):'Sin geometría completa';
 const all=['A','B','C'].every(k=>S.points[k]);
 const block=!!(a.ok&&a.warnings.some(x=>['POINT_OUT_OF_IMAGE','PROXIMAL_AXIS_SHORT','DISTAL_AXIS_SHORT','OUT_OF_PLANE','HYPEREXTENSION_DIRECTION_UNCONFIRMED'].includes(x)));
 const can=!!(all&&a.ok&&S.anatomyOk&&S.planeOk&&(!S.movement.includes('hyperextension')||S.directionOk)&&!block);
 $('capture').disabled=!can;
 $('warning').textContent=can? 'Listo para registrar la posición visible. No se declara validación con goniómetro.': !S.image?'Primero sube una fotografía o congela un cuadro de video.':block?'Un eje es demasiado corto, está fuera del encuadre o el plano no está confirmado. Cambia el punto o repite la toma.':'Confirma las referencias y el plano; se bloquean mediciones inciertas.';
 render();
}
function setPoint(key,p){if(!S.image)return;const po={x:CORE.clamp(p.x,0,S.image.width),y:CORE.clamp(p.y,0,S.image.height)};S.points[key]=po;S.anatomyOk=false;$('anatomyCheck').checked=false;const missing=keys.find(k=>!S.points[k]);S.placing=missing||key;update();}
let pointer=null;
cv.addEventListener('pointerdown',e=>{if(!S.image)return;e.preventDefault();cv.setPointerCapture(e.pointerId);const r=cv.getBoundingClientRect(),xy={x:e.clientX-r.left,y:e.clientY-r.top};
 let target=null,best=Infinity;for(const key of keys)if(S.points[key]){const p=project(S.points[key]),d=Math.hypot(xy.x-p.x,xy.y-p.y);if(d<best&&d<30){best=d;target=key;}}
 if(target){S.placing=target;pointer={id:e.pointerId,mode:'point',key:target};setPoint(target,unproject(xy.x,xy.y));}
 else if(S.labelRect && xy.x>=S.labelRect.x&&xy.x<=S.labelRect.x+S.labelRect.width&&xy.y>=S.labelRect.y&&xy.y<=S.labelRect.y+S.labelRect.height){pointer={id:e.pointerId,mode:'label',xy};}
 else if(keys.some(k=>!S.points[k])){const k=keys.find(k=>!S.points[k]);pointer={id:e.pointerId,mode:'point',key:k};setPoint(k,unproject(xy.x,xy.y));}
 else { // Elegir explícitamente A/B/C y tocar cualquier lugar reposiciona el punto; para desplazar usar espacio/zoom.
   if(e.shiftKey||e.altKey){pointer={id:e.pointerId,mode:'pan',xy};}
   else{pointer={id:e.pointerId,mode:'point',key:S.placing};setPoint(S.placing,unproject(xy.x,xy.y));}
 }
});
cv.addEventListener('pointermove',e=>{if(!pointer||pointer.id!==e.pointerId)return;e.preventDefault();const r=cv.getBoundingClientRect(),xy={x:e.clientX-r.left,y:e.clientY-r.top};
 if(pointer.mode==='point')setPoint(pointer.key,unproject(xy.x,xy.y));
 else if(pointer.mode==='label'){S.labelDrag.x+=xy.x-pointer.xy.x;S.labelDrag.y+=xy.y-pointer.xy.y;pointer.xy=xy;render();}
 else if(pointer.mode==='pan'){S.panX+=xy.x-pointer.xy.x;S.panY+=xy.y-pointer.xy.y;pointer.xy=xy;render();}
});
['pointerup','pointercancel','lostpointercapture'].forEach(name=>cv.addEventListener(name,()=>pointer=null));
cv.addEventListener('wheel',e=>{if(!S.image)return;e.preventDefault();S.zoom=CORE.clamp(S.zoom*(e.deltaY<0?1.14:1/1.14),1,6);render();},{passive:false});
window.addEventListener('keydown',e=>{if(!S.image||!S.points[S.placing]||!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))return;if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName))return;e.preventDefault();const s=e.shiftKey?10:1,p={...S.points[S.placing]};if(e.key==='ArrowUp')p.y-=s;if(e.key==='ArrowDown')p.y+=s;if(e.key==='ArrowLeft')p.x-=s;if(e.key==='ArrowRight')p.x+=s;setPoint(S.placing,p);});
$('zoomIn').onclick=()=>{S.zoom=Math.min(6,S.zoom*1.28);render();};$('zoomOut').onclick=()=>{S.zoom=Math.max(1,S.zoom/1.28);render();};$('fit').onclick=()=>{S.zoom=1;S.panX=S.panY=0;render();};$('toggleLines').onclick=()=>{S.showLines=!S.showLines;render();};
keys.forEach(k=>$('place'+k).onclick=()=>{S.placing=k;update();});
$('clearPoints').onclick=resetPoints;$('undoPoint').onclick=()=>{const last=keys.filter(k=>S.points[k]).slice(-1)[0];if(last)delete S.points[last];S.placing=last||'A';S.anatomyOk=false;$('anatomyCheck').checked=false;update();};
$('movement').onchange=e=>{S.movement=e.target.value;resetPoints();};$('protocol').onchange=e=>{S.protocol=e.target.value;resetPoints();};
['right','left'].forEach(id=>$(id).onclick=()=>{S.side=$(id).dataset.side;['right','left'].forEach(b=>$(b).classList.toggle('active',b===id));resetPoints();});
[['anatomyCheck','anatomyOk'],['planeCheck','planeOk'],['maxCheck','maxOk'],['directionCheck','directionOk']].forEach(([id,k])=>$(id).onchange=e=>{S[k]=e.target.checked;update();});
function exportCanvas(scale=1,source=S.image,points=S.points,showLegend=true){if(!source||!['A','B','C'].every(k=>points[k]))throw new Error('Faltan puntos');const x=document.createElement('canvas');x.width=Math.round(source.width*scale);x.height=Math.round(source.height*scale);const c=x.getContext('2d');c.drawImage(source,0,0,x.width,x.height);const p={};keys.forEach(k=>p[k]={x:points[k].x*scale,y:points[k].y*scale});
 // Todo se dibuja en espacio de salida; mantiene proporción de la etiqueta al aumentar resolución.
 const q={...S};const oldLabel=S.labelDrag;S.labelDrag={x:0,y:0};drawMeasurement(c,p,{map:p=>p,width:x.width,height:x.height,mode:'export',font:Math.min(165,Math.max(40,x.width*.048))});S.labelDrag=oldLabel;
 if(showLegend){const bar=Math.max(36,Math.round(x.width*.055));c.fillStyle='#132c44';c.fillRect(0,x.height-bar,x.width,bar);c.fillStyle='#f4f6f8';c.font=`700 ${Math.round(bar*.30)}px Arial`;c.textAlign='left';c.textBaseline='middle';c.fillText(`SINERGIA · ${S.movement} · ${S.side} · ${CORE.angles(p).angle.toFixed(1)}°`,bar*.3,x.height-bar/2);}
 return x;
}
function canExport(){return S.image&&['A','B','C'].every(k=>S.points[k])&&getValue().ok;}
function png(scale){if(!canExport())return alert('Primero coloca los 3 puntos y revisa la medición.');if(!S.anatomyOk)return alert('Para exportación clínica necesitas confirmar las referencias anatómicas.');const k=scale==='4k'?Math.max(1,3840/S.image.width):1;
 const out=exportCanvas(k);out.toBlob(blob=>{if(blob)download(`SINERGIA_${filename(S.movement)}_${S.side}_${scale}.png`,blob);},'image/png');}
$('exportNative').onclick=()=>png('nativa');$('export4k').onclick=()=>png('4k');
function capture(){if($('capture').disabled)return;let record;try{record=CORE.provenance({image:{width:S.image.width,height:S.image.height},points:S.points,movement:S.movement,side:S.side,protocol:S.protocol,source:S.source,frameId:S.frameId,mediaTime:S.mediaTime,manualReviewed:S.anatomyOk,therapistConfirmation:true,detector:S.detectorOriginal,maxConfirmed:S.maxOk,directionConfirmed:S.directionOk});}catch(e){alert('No es posible capturar: '+e.message);return;}
 const shot=exportCanvas(1),thumb=shot.toDataURL('image/png');const id=`M${S.records.length+1}_${Date.now()}`;S.records.push({id,record,thumb});drawRecords();
 // El host recibe una propuesta REVISADA, no se guarda automaticamente en ningún expediente.
 // Same-origin, sin '*' ni conexiones externas. La integración requiere confirmación explícita.
 // [Integración Sinergia] El registro que viaja al host lleva TAMBIÉN la imagen anotada (evidencePng),
 // generada del MISMO registro de puntos y la MISMA imagen (exportCanvas de esta captura) — §8 de la
 // orden V4: foto, valor y datos que llegan al expediente salen del mismo registro.
 try{if(window.parent!==window && /^https?:$/.test(window.location.protocol))
     window.parent.postMessage({type:'SINERGIA_V4_REVIEWED_MEASUREMENT',record:{...structuredClone(record),evidencePng:thumb}},window.location.origin);
 }catch(_bridge){}
 $('capture').textContent='Medición capturada ✓';setTimeout(()=>$('capture').textContent='Capturar medición revisada',1600);}
$('capture').onclick=capture;
function drawRecords(){const el=$('records');if(!S.records.length){el.innerHTML='<p class="empty-records">Las mediciones confirmadas se mostrarán aquí, con su imagen y trazabilidad.</p>';return;}el.innerHTML='';S.records.forEach(({id,record,thumb})=>{const item=document.createElement('article');item.className='record';const info=record.selection;item.innerHTML=`<img alt="Medición anotada" src="${thumb}"><div class="record-body"><div class="record-top"><div class="record-big">${record.calculation.degreeDisplay.toFixed(1)}°</div><div class="record-small">${info.side}</div></div><div class="record-name">${info.movement.replaceAll('-',' ')}</div><p class="record-small">${record.clinicalStatement}<br>${info.protocol} · revisión manual</p><button type="button">Eliminar medición</button></div>`;item.querySelector('button').onclick=()=>{S.records=S.records.filter(r=>r.id!==id);drawRecords();};el.appendChild(item);});}
$('clearSession').onclick=()=>{if(S.records.length&&confirm('¿Vaciar todas las mediciones de la sesión?')){S.records=[];drawRecords();}};
$('exportJson').onclick=()=>{if(!S.records.length)return alert('Captura al menos una medición primero.');const json=JSON.stringify({version:CORE.MODEL,exportedAt:new Date().toISOString(),measurements:S.records.map(x=>x.record)},null,2);download('SINERGIA_mediciones_trazables.json',new Blob([json],{type:'application/json'}));};
$('printReport').onclick=()=>{if(!S.records.length)return alert('Primero captura las mediciones.');const p=$('printRegion');p.innerHTML='';const intro=document.createElement('section');intro.className='print-page';intro.innerHTML='<h1>CLÍNICA SINERGIA | Evidencias de fotogoniometría 2D</h1><p>Resultados de posición fotografiada, basados en puntos corregidos manualmente. No validado contra goniómetro. No inferir diagnóstico ni máximo sin confirmación profesional.</p>';S.records.forEach(({record,thumb})=>{const fig=document.createElement('figure');fig.innerHTML=`<img alt="Medición" src="${thumb}"><figcaption><b>${record.selection.movement} · ${record.selection.side}: ${record.calculation.degreeDisplay.toFixed(1)}°</b><br>${record.clinicalStatement}<br>Protocolo ${record.selection.protocol}</figcaption>`;intro.appendChild(fig);});p.appendChild(intro);window.print();};
if(window.ResizeObserver)new ResizeObserver(()=>render()).observe(stage);window.addEventListener('resize',render);protocols();update();
window.SinergiaV4={getMeasurements:()=>S.records.map(x=>structuredClone(x.record)),getState:()=>({source:S.source,points:{...S.points},movement:S.movement}),model:CORE.MODEL};
})();
