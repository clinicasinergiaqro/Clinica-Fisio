/* Adaptador opcional a la aplicación existente.
 * Sólo abre la herramienta en el MISMO origen e informa de las mediciones revisadas.
 * No escribe en currentPatient ni en DB: el host debe mostrar revisión y aprobación.
 */
(function(){'use strict';
 let container=null,callback=null;
 function open(url='/biomecanica-v4/index.html'){
   if(container){container.remove();container=null;}
   container=document.createElement('div');container.id='sinergia-v4-host';
   container.style.cssText='position:fixed;inset:0;z-index:100000;background:#f3f6f8;display:flex;flex-direction:column';
   const bar=document.createElement('div');bar.style.cssText='display:flex;justify-content:space-between;align-items:center;background:#10283d;color:#fff;padding:8px 15px;font:700 14px sans-serif';
   const label=document.createElement('span');label.textContent='SINERGIA | revisión anatómica V4';
   const close=document.createElement('button');close.textContent='Cerrar';close.style.cssText='padding:8px 13px;background:#c9a34d;border:0;border-radius:6px;color:#142c43;cursor:pointer;font-weight:700';close.onclick=()=>{container?.remove();container=null};
   bar.append(label,close);
   const iframe=document.createElement('iframe');iframe.src=url;iframe.title='Medidor Sinergia V4';iframe.style.cssText='border:0;width:100%;flex:1';
   iframe.setAttribute('allow','');container.append(bar,iframe);document.body.appendChild(container);
 }
 window.addEventListener('message',e=>{
   if(e.origin!==window.location.origin || e.source!==container?.querySelector('iframe')?.contentWindow) return;
   if(e.data?.type!=='SINERGIA_V4_REVIEWED_MEASUREMENT')return;
   const rec=e.data.record;
   // El host puede escuchar y pedir confirmación del terapeuta. NO hay guardado automático.
   window.dispatchEvent(new CustomEvent('sinergia:medicion-revisada',{detail:rec}));
   if(typeof callback==='function') callback(rec);
 });
 window.SinergiaV4Bridge={open,onMeasurement(fn){callback=fn;},close(){container?.remove();container=null}};
})();
