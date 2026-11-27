/* SINERGIA - adaptación visual acotada a la réplica V2 entregada.
   No contiene Firebase, escritura clínica, cálculos clínicos ni sustitución de funciones.
   Reutiliza nodos originales; no recrea formularios ni toca sus valores. */
(()=>{'use strict';
const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const has=(e,s)=>norm(e?.textContent).includes(s);
const direct=(root,fn)=>Array.from(root.children).find(fn);
const active=id=>q('#'+id+'.active');
const add=(e,k)=>{if(e&&!e.classList.contains(k))e.classList.add(k);};
const remove=(e,k)=>{if(e&&e.classList.contains(k))e.classList.remove(k);};
const toggle=(e,k,b)=>{if(b)add(e,k);else remove(e,k);};
function label(e,txt){if(e&&!e.hasAttribute('aria-label'))e.setAttribute('aria-label',txt);}
function login(){const r=q('#screen-login');if(!r)return;
 const u=q('#login-user',r),p=q('#login-pass',r),labels=qa('.login-box label',r);
 if(labels[0]&&u)labels[0].htmlFor=u.id;if(labels[1]&&p)labels[1].htmlFor=p.id;
 const eye=q('#btn-ver-pass',r);label(eye,'Mostrar u ocultar contraseña');
 const off=q('[onclick="entrarModoOffline_()"]',r);
 if(off&&!off.dataset.sfIcon){off.dataset.sfIcon='1';off.replaceChildren();const ic=document.createElementNS('http://www.w3.org/2000/svg','svg');ic.setAttribute('viewBox','0 0 24 24');ic.setAttribute('width','20');ic.setAttribute('height','20');ic.setAttribute('fill','none');ic.setAttribute('stroke','currentColor');ic.setAttribute('stroke-width','1.8');ic.setAttribute('aria-hidden','true');ic.innerHTML='<path d="M2 8.5a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8.5 15.5a5.5 5.5 0 0 1 7 0M12 19h.01M3 3l18 18"/>';off.append(ic,document.createTextNode('Abrir modo offline'));}
}
function agenda(){for(const id of ['screen-agenda','screen-pacientes']){const r=active(id);if(!r)continue;
 const c=q('.content',r);if(!c)continue;
 if(id==='screen-agenda'){const summary=qa('.section-card',c).find(e=>has(e,'resumen de hoy'));if(summary){add(summary,'sf-ag-summary');const row=qa('div',summary).find(e=>e.children.length>0&&Array.from(e.children).every(x=>x.tagName==='SPAN'));add(row,'sf-ag-metrics');}}
 qa('.patient-card',c).forEach(card=>{for(const e of card.children){if(!e.matches('.patient-avatar,.patient-info')&&!e.matches('button'))add(e,'sf-card-status');}});
}}
function expediente(){const r=active('screen-expediente');if(!r)return;const c=q('#content-expediente',r),fab=q('#fab-soap',r);if(!c||!fab)return;
 const h=direct(c,e=>e.classList.contains('exp-header')),tabs=direct(c,e=>e.classList.contains('tabs'));if(!h||!tabs)return;
 const safety=direct(c,e=>has(e.firstElementChild,'seguridad clinica')&&e!==h&&e!==tabs);
 const complete=direct(c,e=>/^expediente\s+\d+\s*\/\s*\d+/i.test(e.textContent.trim()));
 const contra=q('#contra-exp-wrap',c);
 if(safety){add(safety,'sf-safety');if(h.nextElementSibling!==safety)c.insertBefore(safety,h.nextSibling);}
 if(contra&&contra.parentElement===c){const anchor=safety||h;if(anchor.nextElementSibling!==contra)c.insertBefore(contra,anchor.nextSibling);}
 const anchor=contra&&contra.parentElement===c?contra:(safety||h);
 let proxy=q('.sf-exp-action',c);const allowed=getComputedStyle(fab).display!=='none'&&!fab.disabled;
 if(allowed){if(!proxy){proxy=document.createElement('button');proxy.type='button';proxy.className='sf-exp-action';proxy.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>Nueva sesión';proxy.addEventListener('click',()=>{if(getComputedStyle(fab).display!=='none'&&!fab.disabled)fab.click();});}if(anchor.nextElementSibling!==proxy)c.insertBefore(proxy,anchor.nextSibling);add(r,'sf-has-session');}
 else{proxy?.remove();proxy=null;remove(r,'sf-has-session');}
 if(complete){add(complete,'sf-completion');const a=proxy||anchor;if(a.nextElementSibling!==complete)c.insertBefore(complete,a.nextSibling);}
 // Existing tabs and buttons retained, with no changes to their handler or role gating.
 for(const e of Array.from(c.children)){if(e===h||e===tabs||e===complete||e===safety||e===contra||e===proxy)continue;if(e.querySelector(':scope > button[onclick*="exportarExpedienteJSON"],:scope > button[onclick*="_abrirEditarPaciente"],:scope > button[onclick*="pedirRevaloracion"],:scope > button[onclick*="_agregarModalidad"],:scope > button[onclick*="_borrarPaciente"]'))add(e,'sf-exp-controls');}
 // Avoid duplicate name in topbar without deleting it or touching the data. Only if the exact same name is rendered below.
 const top=q('#exp-topbar-name',r),name=q('.exp-name',h);// Keep original patient identity visible in sticky topbar while scrolling.
}
function soap(){const r=active('screen-soap');if(!r)return;const c=q('#content-soap',r),full=q('#soap-full',r);if(!c||!full)return;
 const nav=q('.v2-soapnav',r);if(nav)toggle(nav,'sf-descarga',getComputedStyle(full).display==='none');
 const id=direct(full,e=>e.classList.contains('form-section')&&has(q('.form-section-title',e),'identificacion')&&!e.querySelector('input,select,textarea,button,[onclick]'));
 // Informational identity only; date and new motive stay as original real controls, never folded away.
 if(id&&!id.closest('.sf-id-details')){const d=document.createElement('details');d.className='sf-id-details';const s=document.createElement('summary');s.textContent='Identificación · diagnóstico y terapeuta';d.append(s);id.before(d);d.append(id);}
 const date=qa('.form-section',full).find(e=>e.querySelector('#f-fecha-consulta'));add(date,'sf-date');
 const subj=qa('.form-section',full).find(e=>e.querySelector('#f-sdolor'));add(subj,'sf-subject');
 for(const selector of ['#btn-descarga','#btn-nuevo-motivo-soap','#soap-dictado-btn'])add(q(selector,c)?.closest('.form-section'),'sf-quick-section');
 const safety=direct(c,e=>has(e.firstElementChild,'seguridad clinica'));add(safety,'sf-soap-safety');
 // The ID card is read-only. Place it after the first S block, keeping the real content accessible.
 const info=q('.sf-id-details',full);if(info&&subj&&info.previousElementSibling!==subj)subj.after(info);
 // Dictation remains an existing real control and is available immediately after S navigation.
 const dict=q('#soap-dictado-btn',full)?.closest('.form-section');if(dict&&info&&dict.previousElementSibling!==info)info.after(dict);
 const save=q('button[onclick="guardarSOAP()"]',full);if(save&&!q('.sf-soap-jump',full)){const jump=document.createElement('button');jump.type='button';jump.className='sf-soap-jump';jump.textContent='Ir a guardar nota';jump.addEventListener('click',()=>{if(save.isConnected){save.scrollIntoView({block:'center',behavior:'auto'});save.focus({preventScroll:true});}});const subj=qa('.form-section',full).find(e=>e.querySelector('#f-sdolor'));if(subj)subj.after(jump);}
}
let pending=false;function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;login();agenda();expediente();soap();});}
function start(){schedule();new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
