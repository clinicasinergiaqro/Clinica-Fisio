/* ============================================================================
   SINERGIA — Enhancer de REDISEÑO (prototipo funcional, NO producción)
   Aditivo: NO cambia la lógica de la app. Solo:
     · fija el breakpoint (body.rd-desk / rd-tablet)
     · inyecta un rail lateral que llama a las funciones de navegación reales
     · compacta la identificación del SOAP y acentúa S/O/A/P
     · añade un panel de contexto de solo-lectura (última nota, valoración
       inicial, objetivos) + accesos (Nuevo motivo, Descarga, Medir) que
       disparan los controles YA existentes de la app.
   Todo se re-aplica tras cada render mediante MutationObserver.
   ========================================================================== */
(function(){
  'use strict';
  var H=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};
  var el=function(id){return document.getElementById(id);};
  // OJO: la app declara currentPatient/currentUser/editingSoapId con `let`
  // (binding global léxico), así que NO están en window. Se leen como variable
  // bare vía typeof desde este otro <script> (comparten el entorno léxico global).
  var cur=function(){try{return (typeof currentPatient!=='undefined'&&currentPatient)||null;}catch(_){return null;}};
  var curUser=function(){try{return (typeof currentUser!=='undefined'&&currentUser)||null;}catch(_){return null;}};
  var editId=function(){try{return (typeof editingSoapId!=='undefined'&&editingSoapId)||null;}catch(_){return null;}};

  /* ---------------------------------------------------------- BREAKPOINT -- */
  function applyBP(){
    var w=window.innerWidth||document.documentElement.clientWidth||0;
    var b=document.body; if(!b) return;
    b.classList.toggle('rd-desk', w>=1100);
    b.classList.toggle('rd-tablet', w>=760 && w<1100);
  }

  /* -------------------------------------------------------------- RAIL ----- */
  var RAIL=[
    {id:'ag', ic:'🗓️', t:'Agenda',     fn:'showAgenda',     match:['screen-agenda']},
    {id:'pa', ic:'👥', t:'Pacientes',  fn:'showPacientes',  match:['screen-pacientes']},
    {id:'pr', ic:'📘', t:'Protocolos', fn:'showBiblioteca', match:['screen-biblioteca']},
    {id:'su', ic:'✅', t:'Supervisión',fn:'showSupervision',match:['screen-supervision'], sup:true}
  ];
  function buildRail(){
    if(el('rd-rail')) return;
    var nav=document.createElement('nav'); nav.id='rd-rail';
    var btns=RAIL.map(function(r){
      return '<button data-rid="'+r.id+'" data-sup="'+(r.sup?1:0)+'" onclick="try{'+r.fn+'()}catch(e){}">'
        +'<span class="ic">'+r.ic+'</span><span>'+r.t+'</span></button>';
    }).join('');
    nav.innerHTML=
      '<div class="rd-brand"><span class="dot">🫀</span><span>Sinergia</span></div>'
      +'<div class="rd-nav">'+btns+'</div>'
      +'<div class="rd-foot rd-nav"><button onclick="try{showAgenda()}catch(e){}"><span class="ic">👤</span><span id="rd-rail-user">Perfil</span></button>'
      +'<button onclick="try{doLogout()}catch(e){}"><span class="ic">⏻</span><span>Salir</span></button></div>';
    document.body.appendChild(nav);
  }
  function syncRail(){
    buildRail();
    // Supervisión: visible solo si el nav real lo está (rol)
    var navSup=el('nav-supervision');
    var supVis=!(navSup && navSup.style.display==='none');
    var active=(document.querySelector('.screen.active')||{}).id||'';
    RAIL.forEach(function(r){
      var btn=document.querySelector('#rd-rail [data-rid="'+r.id+'"]'); if(!btn) return;
      if(r.sup) btn.style.display=supVis?'':'none';
      btn.classList.toggle('active', r.match.indexOf(active)>=0);
    });
    var u=el('rd-rail-user'); try{ var cu=curUser(); if(u && cu && cu.name) u.textContent=cu.name; }catch(_){}
    // La barra de Guardar fija solo vive en la pantalla SOAP activa
    try{ var cs=el('content-soap'); if(!(cs && cs.offsetParent!==null && el('soap-full'))) hideSoapSaveBar(); }catch(_){}
  }

  /* ---------------------------------------------- helpers de lectura ------ */
  function soapVivas(p){
    try{ if(typeof window._soapVivas==='function') return window._soapVivas(p)||[]; }catch(_){}
    var a=(p&&Array.isArray(p.soap))?p.soap:[]; return a.filter(function(s){return s && s.borrado!==true;});
  }
  function txt(x){ x=String(x==null?'':x).trim(); return (!x||/^(pendiente|no evaluad|no especific|ninguna)/i.test(x))?'':x; }
  function clip(s,n){ s=String(s||''); return s.length>n?(s.slice(0,n-1)+'…'):s; }

  /* --------------------------------- PANEL DE CONTEXTO (SOAP / Exp) ------- */
  function ctxItem(label, body, onclick, cls){
    return '<button class="rd-ctx-item '+(cls||'')+'"'+(onclick?(' onclick="'+onclick+'"'):' disabled style="cursor:default"')+'>'
      +(label?('<b>'+H(label)+'</b>'):'')+(body||'')+'</button>';
  }
  function buildSoapCtx(container){
    var p=cur(); if(!p) return;
    var full=el('soap-full')||container;
    if(full.querySelector(':scope > .rd-ctx')) return;   // ya está (evita duplicar)
    var vivas=soapVivas(p);
    var eid=editId();
    var prev=vivas.filter(function(s){return !eid||s.id!==eid;});
    var ultima=prev.length?prev[prev.length-1]:null;

    // Motivo vigente (valoración/objetivos del episodio en curso)
    var mv={}; try{ mv=(typeof window._motivoVigenteDe==='function')?window._motivoVigenteDe(p):{motivoConsulta:p.motivoConsulta,valoracion:p.valoracion||{},dxFuncional:p.dxFuncional||{}}; }catch(_){ mv={valoracion:p.valoracion||{},dxFuncional:p.dxFuncional||{}}; }
    var val=mv.valoracion||{}, dxf=mv.dxFuncional||{};

    var ultimaHTML, ultimaCls='';
    if(ultima){
      var sS=(ultima.s&&ultima.s.dolor)||ultima.subjetivo||'';
      var sA=(ultima.a&&ultima.a.analisis)||ultima.analisis||'';
      var fch=ultima.fecha||ultima.date||'';
      var num=ultima.num||ultima.sesion||'';
      ultimaHTML='<span style="color:var(--gray-500);font-size:11px">Sesión '+H(num)+' · '+H(fch)+'</span><br>'
        + H(clip(txt(sS)||txt(sA)||'Nota registrada',120));
    } else { ultimaHTML='<span style="color:var(--gray-400)">Sin notas previas en este motivo</span>'; ultimaCls=''; }

    var romV=txt(val.rom), fzaV=txt(val.fuerza), evaV=txt(val.eva);
    var valBody = (romV||fzaV||evaV)
      ? ((evaV?('EVA '+H(evaV)+' · '):'')+(romV?('ROM '+H(clip(romV,40))+' '):'')+(fzaV?('· Fuerza '+H(clip(fzaV,30))):''))
      : '<span style="color:var(--gray-400)">Valoración inicial sin datos estructurados</span>';

    var dxFun=txt(dxf.dxFuncional)||txt(dxf.dxClinico)||txt(p.dx)||txt(p.motivoConsulta);
    var objCP=txt(dxf.objetivosCP), objLP=txt(dxf.objetivosLP);
    var objBody = (objCP||objLP)
      ? ((objCP?('CP: '+H(clip(objCP,70))+'<br>'):'')+(objLP?('LP: '+H(clip(objLP,70))):''))
      : '<span style="color:var(--gray-400)">Sin objetivos registrados</span>';

    var hayMed = (typeof window.abrirMedidorBiomecanico==='function');

    var d=document.createElement('details'); d.className='rd-ctx';
    d.innerHTML='<summary><h4 style="display:inline">🧭 Contexto clínico</h4></summary>'
      + '<div class="rd-ctx-note">Solo lectura — no se copia como hallazgo de hoy.</div>'
      + ctxItem('Última nota SOAP', ultimaHTML, null, ultimaCls)
      + ctxItem('Valoración inicial', valBody, null)
      + ctxItem('Diagnóstico / objetivos', (dxFun?('<span style="color:var(--text)">'+H(clip(dxFun,80))+'</span><br>'):'')+objBody, null)
      + '<h4>Acciones de esta nota</h4>'
      + ctxItem('', '🆕 Nuevo motivo de consulta', "try{var b=document.getElementById('btn-nuevo-motivo-soap');if(b){b.click();b.scrollIntoView({behavior:'smooth',block:'center'});}}catch(e){}", 'accion gold')
      + ctxItem('', '🙌 Sesión de descarga', "try{var b=document.getElementById('btn-descarga');if(b){b.click();b.scrollIntoView({behavior:'smooth',block:'center'});}}catch(e){}", 'accion')
      + (hayMed?ctxItem('', '📐 Medir / importar (biomecánica)', "try{abrirMedidorBiomecanico('gonio')}catch(e){}", 'accion'):'');
    full.insertBefore(d, full.firstChild);
    if(document.body.classList.contains('rd-desk')||document.body.classList.contains('rd-tablet')) d.open=true;
  }

  function buildExpCtx(container){
    var p=cur(); if(!p) return;
    if(container.querySelector(':scope > .rd-ctx')) return;
    var vivas=soapVivas(p);
    var consent=false; try{ consent=(typeof window.tieneConsentimientoFirmado==='function')?!!tieneConsentimientoFirmado(p):!!(p.consentimiento&&p.consentimiento.firmado); }catch(_){}
    var hist = !!(txt(p.motivoConsulta)|| (p.motivo&&txt(p.motivo.padecimiento)));
    var val = !!((p.valoracion&&(txt(p.valoracion.rom)||txt(p.valoracion.eva)))||(p.dxFuncional&&txt(p.dxFuncional.dxFuncional)));
    function st(ok,okT,noT){return '<span style="color:'+(ok?'var(--exito)':'var(--aviso)')+';font-weight:700">'+(ok?okT:noT)+'</span>';}
    var d=document.createElement('details'); d.className='rd-ctx';
    d.innerHTML='<summary><h4 style="display:inline">🧾 Estado del expediente</h4></summary>'
      + ctxItem('Historia', st(hist,'Registrada','Incompleta'), null)
      + ctxItem('Valoración', st(val,'Capturada','Pendiente'), null)
      + ctxItem('Consentimiento', st(consent,'Firmado','Pendiente'), null)
      + ctxItem('Notas SOAP', '<span style="color:var(--navy);font-weight:700">'+vivas.length+'</span> nota'+(vivas.length!==1?'s':''), null)
      + '<h4>Acciones</h4>'
      + ctxItem('', '📝 Nueva sesión (SOAP)', "try{showNuevoSOAP()}catch(e){}", 'accion');
    var hdr=container.querySelector(':scope > .exp-header');
    if(hdr && hdr.nextSibling) container.insertBefore(d, hdr.nextSibling);
    else container.insertBefore(d, container.firstChild);
    if(document.body.classList.contains('rd-desk')||document.body.classList.contains('rd-tablet')) d.open=true;
  }

  /* ===================================================================== *
   * V1.1 · ROM / BIOMECÁNICA  (integración funcional, motor intacto)      *
   *   · medir en vivo / foto / video → abrirMedidorBiomecanico (real)     *
   *   · Importar histórica = SELECCIONAR una medición existente (no abrir *
   *     el medidor) → la trae a la nota (FIX del bug reportado)           *
   *   · comparar SOLO compatibles: mismo movimiento+lado+método+unidad,   *
   *     mismo episodio; excluye eliminadas y pendientes de validar        *
   *   · recuperar media anotada (miniaturas) · reporte (BIO_pdf real)     *
   *   · NO toca ni duplica algoritmos; no pierde el borrador del SOAP     *
   * ===================================================================== */
  function bioSesiones(p){ try{ return (p&&Array.isArray(p.biomecanica))?p.biomecanica.filter(function(s){return s && s.eliminado!==true;}):[]; }catch(_){ return []; } }
  function bioPend(m){ return (m.ok===false)||(m.validado===false)||(m.validada===false)||(m.pendiente===true)||(m.porValidar===true); }
  function bioEp(p){ try{ return (p&&(p.motivoActualIndex!=null))?p.motivoActualIndex:0; }catch(_){ return 0; } }
  function bioFlat(p, incluirPend){
    var out=[], ep=bioEp(p);
    bioSesiones(p).forEach(function(s){
      (Array.isArray(s.medidas)?s.medidas:[]).forEach(function(m){
        if(m==null || m.grado==null) return;
        var pend=bioPend(m);
        if(pend && !incluirPend) return;                       // fuera de comparaciones clínicas
        out.push({ sesId:s.id, tipo:s.tipo||s.tipoMedicion||'', fecha:s.fecha||s.date||'',
          ep:(s.motivoIndex!=null?s.motivoIndex:ep),
          clave:m.clave||m.key||'', etq:m.etq||((m.grupo||'')+(m.mov?(' · '+m.mov):''))||'Medición',
          grupo:m.grupo||'', mov:m.mov||'', lado:m.lado||'', unidad:m.fuente||m.unidad||'cámara 2D',
          grado:m.grado, ref:(m.ref!=null?m.ref:null), pend:pend,
          imagen:(Array.isArray(s.imagenes)&&s.imagenes[0]&&s.imagenes[0].url)||'',
          video:(s.video&&s.video.url)||'' });
      });
    });
    return out;
  }
  // Compatibilidad clínica: mismo movimiento (clave/etq) + lado + método/unidad + episodio
  function bioCompat(m){ return (m.ep)+'||'+(m.clave||m.etq||'')+'||'+(m.lado||'')+'||'+(m.unidad||''); }
  function bioFecha(f){ return fzParse(f); }

  function bioWrite(texto){
    try{
      if(typeof window.setCampoAppend==='function'){ window.setCampoAppend('f-orom', texto); return true; }
      var t=el('f-orom'); if(t){ t.value=(t.value?t.value.replace(/\s*$/,'')+' · ':'')+texto; t.dispatchEvent(new Event('input',{bubbles:true})); return true; }
    }catch(_){}
    return false;
  }
  // FIX "Importar histórica": abre un SELECTOR de mediciones existentes (no el medidor)
  function bioImportPicker(){
    var p=cur(); if(!p) return;
    var old=el('rd-bio-pick'); if(old) old.remove();
    var items=bioFlat(p, true).sort(function(a,b){return bioFecha(b.fecha)-bioFecha(a.fecha);});
    var ov=document.createElement('div'); ov.id='rd-bio-pick'; ov.className='rd-modal';
    var lista = items.length ? items.map(function(m){
      var dis=m.pend;
      return '<button type="button" class="rd-pick-item'+(dis?' dis':'')+'" '+(dis?'disabled':'data-import="1"')+' data-txt="'+H(m.etq+' '+Math.round(m.grado)+'° '+(m.lado||'')+' ('+m.fecha+')')+'">'
        +(m.imagen?'<img src="'+H(m.imagen)+'" alt="">':'<span class="noimg">📐</span>')
        +'<span class="rd-pick-main"><b>'+H(m.etq)+(m.lado?(' · '+H(m.lado)):'')+'</b>'
        +'<small>'+Math.round(m.grado)+'° · '+H(m.unidad)+' · '+H(m.fecha)+(dis?' · ⏳ pendiente de validar':'')+'</small></span>'
        +(dis?'<span class="rd-pick-cta off">no válida</span>':'<span class="rd-pick-cta">Importar ⬇️</span>')+'</button>';
    }).join('') : '<div class="rd-pick-empty">No hay mediciones previas guardadas en este expediente.</div>';
    ov.innerHTML='<div class="rd-modal-box"><div class="rd-modal-top"><b>⬇️ Importar medición existente</b><button class="rd-modal-x" aria-label="cerrar">×</button></div>'
      +'<div class="rd-modal-sub">Selecciona una medición ya guardada para traerla a esta nota (O · ROM). Las pendientes de validar no se pueden importar para comparación.</div>'
      +'<div class="rd-pick-list">'+lista+'</div></div>';
    document.body.appendChild(ov);
    function close(){ ov.remove(); }
    ov.querySelector('.rd-modal-x').onclick=close;
    ov.addEventListener('click', function(ev){ if(ev.target===ov) close(); var b=ev.target.closest('[data-import]'); if(b){ bioWrite('[histórica] '+b.getAttribute('data-txt')); close(); } });
  }
  function bioReportar(){
    try{ if(typeof window.BIO_pdf==='function'){ BIO_pdf(); return; } }catch(_){}
    try{ if(typeof window.BIO_construirPDF==='function'){ BIO_construirPDF(); return; } }catch(_){}
    try{ if(typeof window.abrirMedidorBiomecanico==='function'){ abrirMedidorBiomecanico('gonio'); } }catch(_){}
  }
  function buildBioCard(grp){
    if(!grp) return;
    if(grp.querySelector(':scope > .rd-bio, :scope .rd-bio')) return;
    var p=cur(); if(!p) return;
    var todas=bioFlat(p,false);                   // excluye eliminadas y pendientes
    var pend=bioFlat(p,true).filter(function(m){return m.pend;});
    // Para el titular/comparación usamos ROM/goniómetro (no métricas de marcha/sentadilla);
    // el selector de importar sí ofrece TODAS las mediciones.
    var rom=todas.filter(function(m){return m.tipo==='gonio'||m.tipo==='rom'||(m.grupo&&m.mov);});
    var validas=rom.length?rom:todas;
    // la "actual" = la más reciente VÁLIDA; su histórico compatible
    validas.sort(function(a,b){return bioFecha(a.fecha)-bioFecha(b.fecha);});
    var actual=validas.length?validas[validas.length-1]:null, inicial=null, delta=null;
    if(actual){
      var compat=validas.filter(function(m){return bioCompat(m)===bioCompat(actual);});
      if(compat.length>=2){ inicial=compat[0]; if(typeof actual.grado==='number'&&typeof inicial.grado==='number') delta=actual.grado-inicial.grado; }
    }
    var hayMed=(typeof window.abrirMedidorBiomecanico==='function');
    var hayCmp=(typeof window.BIO_comparar==='function');
    var hayPdf=(typeof window.BIO_pdf==='function')||(typeof window.BIO_construirPDF==='function');
    function vcell(lbl,v,sub,cls){ return '<div class="rd-bio-v '+(cls||'')+'"><div class="rd-bio-n">'+H(v)+'</div><div class="rd-bio-l">'+H(lbl)+(sub?('<br><span>'+H(sub)+'</span>'):'')+'</div></div>'; }
    var cuerpo;
    if(actual){
      cuerpo='<div class="rd-bio-sub">'+H(actual.etq)+(actual.lado?(' · '+H(actual.lado)):'')+' · '+H(actual.unidad)+'</div>'
        +'<div class="rd-bio-row">'
        + (inicial?vcell('Inicial', Math.round(inicial.grado)+'°', inicial.fecha, 'hist'):'')
        + vcell('Actual', Math.round(actual.grado)+'°', (actual.fecha||'sesión actual'), 'now')
        + (delta!=null?vcell('Cambio', (delta>=0?'+':'')+Math.round(delta)+'°', 'mismo mov./lado', 'delta'):vcell('Cambio','—','1 sola medición','off'))
        + '</div>'
        + (actual.imagen?('<div class="rd-bio-media"><img src="'+H(actual.imagen)+'" alt="medición anotada"><span>Imagen anotada guardada</span></div>'):'')
        + '<div class="rd-bio-note">cámara 2D · estimación no validada frente a goniómetro físico. Compara solo mismo episodio, articulación, movimiento, lado y método.</div>';
    } else {
      cuerpo='<div class="rd-bio-note">Sin mediciones válidas en este motivo. Mide con la cámara, sube foto/video o importa una previa.</div>';
    }
    if(pend.length) cuerpo+='<div class="rd-bio-pend">⏳ '+pend.length+' medición(es) pendiente(s) de validar — fuera de las comparaciones clínicas.</div>';
    var card=document.createElement('div'); card.className='rd-bio';
    card.innerHTML='<div class="rd-bio-head">📐 Mediciones biomecánicas <span class="rd-bio-tag">ROM</span></div>'
      + cuerpo
      + '<div class="rd-bio-btns">'
      + (hayMed?'<button type="button" data-bio="vivo">📷 Medir (cámara / foto / video)</button>':'')
      + '<button type="button" data-bio="import">⬇️ Importar histórica</button>'
      + (hayCmp?'<button type="button" data-bio="comparar">⚖️ Comparar</button>':'')
      + (hayPdf?'<button type="button" data-bio="reporte">📄 Reporte</button>':'')
      + '</div>'
      + '<div class="rd-bio-legend"><span class="now">● Actual</span><span class="hist">● Histórica</span><span class="pend">● Pendiente</span> · la pendiente no alimenta diferencias ni IA</div>';
    grp.appendChild(card);
    card.addEventListener('click', function(ev){
      var b=ev.target.closest('[data-bio]'); if(!b) return;
      var a=b.getAttribute('data-bio');
      if(a==='vivo'){ rdSnapDraft(); try{ abrirMedidorBiomecanico('gonio'); }catch(_){} }
      else if(a==='import'){ bioImportPicker(); }
      else if(a==='comparar'){ rdSnapDraft(); try{ BIO_comparar(); }catch(_){} }
      else if(a==='reporte'){ rdSnapDraft(); bioReportar(); }
    });
  }

  /* --- GUARDA DE BORRADOR DEL SOAP (no perder la nota al abrir/cerrar el
     goniómetro ni en un re-render). Mantiene un borrador vivo por campo y lo
     restaura si la nota se vuelve a pintar vacía. No interfiere al EDITAR. --- */
  var SOAP_DRAFT_FIELDS=['f-sdolor','f-scambios','f-sactfisica','f-orom','f-ofuerza','f-ohallazgos',
    'f-aevolucion','f-arespuesta','f-aanalisis','f-pindicaciones','f-pcontra','f-ptratamiento','f-objetivo-sesion'];
  function rdSnapDraft(){
    try{
      if(editId()) return;                 // al editar, la app ya trae los valores
      var m={}, any=false;
      SOAP_DRAFT_FIELDS.forEach(function(id){ var e=el(id); if(e){ m[id]=e.value; if(String(e.value||'').trim()) any=true; } });
      if(any) window._rdSoapDraft={ts:Date.now(), pid:(cur()&&cur().id)||'', map:m};
    }catch(_){}
  }
  function rdRestoreDraft(){
    try{
      var d=window._rdSoapDraft; if(!d) return;
      if(Date.now()-d.ts>15*60*1000){ window._rdSoapDraft=null; return; }
      if(editId()) return;
      if(cur() && d.pid && cur().id!==d.pid) return;     // otro paciente → no restaurar
      Object.keys(d.map).forEach(function(id){ var e=el(id); if(e && !String(e.value||'').trim() && String(d.map[id]||'').trim()){ e.value=d.map[id]; try{e.dispatchEvent(new Event('input',{bubbles:true}));}catch(_){} } });
    }catch(_){}
  }
  function rdClearDraft(){ window._rdSoapDraft=null; }

  /* ===================================================================== *
   * V1.1 · FUERZA MUSCULAR  (escala comparativa 0–10, 10 = lado sano)     *
   *   · UI rápida: región → músculo → valor 0–10 → lado → referencia      *
   *   · escribe la frase en el campo libre REAL (f-ofuerza) sin pisarlo   *
   *   · guarda registro estructurado aditivo valoracion.fuerzaEval[]      *
   *   · comparativa (déficit vs 10 / Izq-Der) y evolución compatibles     *
   *   · NO sustituye Daniels/MRC; conserva texto libre y registros previos*
   * ===================================================================== */
  function fzGrupos(){ try{ return window._FZ_MUS||{}; }catch(_){ return {}; } }
  function fzColor(v){ v=+v; return v<=3?'#A52D25':(v<=6?'#B07A12':(v<=9?'#1B3A6B':'#236646')); }
  function fzEntries(p){ try{ p.valoracion=p.valoracion||{}; if(!Array.isArray(p.valoracion.fuerzaEval)) p.valoracion.fuerzaEval=[]; return p.valoracion.fuerzaEval; }catch(_){ return []; } }
  function fzHoy(){ try{ var d=new Date(); return ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+'/'+d.getFullYear(); }catch(_){ return ''; } }
  function fzParse(f){ try{ var m=String(f).match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/); return m?new Date(+((''+m[3]).length<4?'20'+m[3]:m[3]),+m[2]-1,+m[1]).getTime():0; }catch(_){ return 0; } }
  var fzSel={reg:'',mus:'',valor:null,lado:'der',ref:'sano'};
  function fzRefLbl(r){ return r==='esperado'?'normal esperado':'lado sano/control'; }
  function fzFrase(e){ return e.mus+' '+e.valor+'/10'+(e.valor>=10?' (sano)':'')+(e.lado?(' '+e.lado):'')+' [ref: '+fzRefLbl(e.ref)+']'; }

  // Comparativa + evolución: agrupa por músculo (último valor por lado + histórico)
  function fzResumen(p){
    var es=fzEntries(p).filter(function(e){return e && e.eliminado!==true && typeof e.valor==='number';});
    var byMus={};
    es.forEach(function(e){
      var k=e.mus||'—'; byMus[k]=byMus[k]||{mus:k, lados:{}, hist:[]};
      byMus[k].hist.push(e);
      var l=e.lado||'der';
      var prev=byMus[k].lados[l];
      if(!prev || (fzParse(e.fecha)>=fzParse(prev.fecha))) byMus[k].lados[l]=e; // el más reciente por lado
    });
    return Object.keys(byMus).map(function(k){return byMus[k];});
  }
  function fzBar(v){
    v=Math.max(0,Math.min(10,+v));
    return '<div class="rd-fz-bar"><i style="width:'+(v*10)+'%;background:'+fzColor(v)+'"></i></div>';
  }
  function fzCompHTML(g){
    var der=g.lados.der, izq=g.lados.izq, bil=g.lados.bilateral;
    var row=function(lado,e){
      if(!e) return '';
      var def=Math.round((10-e.valor)*10);
      return '<div class="rd-fz-cmp"><span class="l">'+H(lado)+'</span>'
        +'<span class="v" style="color:'+fzColor(e.valor)+'">'+e.valor+'<small>/10</small></span>'
        +fzBar(e.valor)
        +'<span class="d">'+(e.valor>=10?'referencia':('déficit '+def+'%'))+'</span></div>';
    };
    var asim='';
    if(der&&izq&&(der.valor!==izq.valor)){
      var hi=Math.max(der.valor,izq.valor), lo=Math.min(der.valor,izq.valor);
      var ladoDebil=der.valor<izq.valor?'der':'izq';
      asim='<div class="rd-fz-asim">Asimetría Izq/Der: '+Math.round((hi-lo)*10)+'% más débil el lado '+ladoDebil+'</div>';
    }
    // evolución: mismo músculo+lado, ≥2 fechas
    var evo='';
    ['der','izq','bilateral'].forEach(function(l){
      var hs=g.hist.filter(function(e){return (e.lado||'der')===l;}).sort(function(a,b){return fzParse(a.fecha)-fzParse(b.fecha);});
      if(hs.length>=2){
        var first=hs[0], last=hs[hs.length-1], dlt=last.valor-first.valor;
        evo+='<div class="rd-fz-evo"><b>'+H(l)+'</b> '+hs.map(function(e){return '<span style="color:'+fzColor(e.valor)+'">'+e.valor+'</span>';}).join(' → ')
          +' <span class="dl '+(dlt>=0?'up':'dn')+'">'+(dlt>=0?'▲ +':'▼ ')+dlt+'</span> <small>'+H(first.fecha)+'→'+H(last.fecha)+'</small></div>';
      }
    });
    return '<div class="rd-fz-g"><div class="rd-fz-gh">'+H(g.mus)+'</div>'+row('Der',der)+row('Izq',izq)+row('Bilat.',bil)+asim+evo+'</div>';
  }

  function fzRenderResultados(host,p){
    var box=host.querySelector('.rd-fz-res'); if(!box) return;
    var gs=fzResumen(p);
    if(!gs.length){ box.innerHTML='<div class="rd-fz-empty">Aún no hay registros de fuerza en este motivo. Captura arriba.</div>'; return; }
    box.innerHTML='<div class="rd-fz-res-h">Comparativa y evolución</div>'+gs.map(fzCompHTML).join('');
  }
  function fzRenderCapture(host){
    var regs=Object.keys(fzGrupos());
    var regHTML=regs.map(function(r){ return '<button type="button" class="rd-fz-chip" data-fz="reg" data-v="'+H(r)+'">'+H(r)+'</button>'; }).join('');
    var musHTML=(fzSel.reg&&fzGrupos()[fzSel.reg]||[]).map(function(m){ return '<button type="button" class="rd-fz-chip" data-fz="mus" data-v="'+H(m)+'">'+H(m)+'</button>'; }).join('');
    var valHTML=''; for(var i=0;i<=10;i++){ valHTML+='<button type="button" class="rd-fz-val" data-fz="val" data-v="'+i+'" style="--c:'+fzColor(i)+'">'+i+'</button>'; }
    var cap=host.querySelector('.rd-fz-cap');
    cap.innerHTML=
      '<div class="rd-fz-step"><span>1 · Región</span><div class="rd-fz-row">'+regHTML+'</div></div>'
      +(fzSel.reg?'<div class="rd-fz-step"><span>2 · Músculo</span><div class="rd-fz-row">'+musHTML+'</div></div>':'')
      +(fzSel.mus?('<div class="rd-fz-step"><span>3 · Fuerza (0 = sin contracción · 10 = lado sano)</span><div class="rd-fz-vals">'+valHTML+'</div></div>'
        +'<div class="rd-fz-step2"><div><span>Lado</span><div class="rd-fz-row">'
          +'<button type="button" class="rd-fz-chip" data-fz="lado" data-v="der">Der</button>'
          +'<button type="button" class="rd-fz-chip" data-fz="lado" data-v="izq">Izq</button>'
          +'<button type="button" class="rd-fz-chip" data-fz="lado" data-v="bilateral">Bilat.</button></div></div>'
        +'<div><span>Referencia = 10</span><div class="rd-fz-row">'
          +'<button type="button" class="rd-fz-chip" data-fz="ref" data-v="sano">Lado sano/control</button>'
          +'<button type="button" class="rd-fz-chip" data-fz="ref" data-v="esperado">Normal esperado</button></div></div></div>'
        +'<div class="rd-fz-prev"></div>'
        +'<button type="button" class="rd-fz-add" data-fz="add" disabled>➕ Registrar fuerza</button>'):'');
    // marcar selección
    function mark(attr,val){ cap.querySelectorAll('[data-fz="'+attr+'"]').forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-v')===String(val)); }); }
    mark('reg',fzSel.reg); mark('mus',fzSel.mus); if(fzSel.valor!=null) mark('val',fzSel.valor); mark('lado',fzSel.lado); mark('ref',fzSel.ref);
    var prev=cap.querySelector('.rd-fz-prev'), add=cap.querySelector('.rd-fz-add');
    if(prev && fzSel.mus && fzSel.valor!=null){
      prev.style.display='block';
      prev.innerHTML='Se registra: <b>'+H(fzFrase({mus:fzSel.mus,valor:fzSel.valor,lado:fzSel.lado,ref:fzSel.ref}))+'</b>';
      if(add) add.disabled=false;
    } else if(prev){ prev.style.display='none'; if(add) add.disabled=true; }
  }
  function buildFuerzaPanel(host, p, opts){
    opts=opts||{};
    if(!host || !p) return;
    if(host.querySelector(':scope > .rd-fz')){ fzRenderResultados(host.querySelector(':scope > .rd-fz'), p); return; }
    if(!Object.keys(fzGrupos()).length) return;  // taxonomía real no cargada
    var panel=document.createElement('div'); panel.className='rd-fz';
    panel.innerHTML='<div class="rd-fz-head">💪 Fuerza muscular <span class="rd-fz-tag">0–10 · 10 = lado sano</span></div>'
      +'<div class="rd-fz-cap"></div>'
      +'<div class="rd-fz-res"></div>';
    host.appendChild(panel);
    fzRenderCapture(panel);
    fzRenderResultados(panel, p);
    panel.addEventListener('click', function(ev){
      var b=ev.target.closest('[data-fz]'); if(!b) return;
      var a=b.getAttribute('data-fz'), v=b.getAttribute('data-v');
      if(a==='reg'){ fzSel.reg=(fzSel.reg===v?'':v); fzSel.mus=''; fzSel.valor=null; fzRenderCapture(panel); }
      else if(a==='mus'){ fzSel.mus=(fzSel.mus===v?'':v); fzSel.valor=null; fzRenderCapture(panel); }
      else if(a==='val'){ fzSel.valor=(fzSel.valor===+v?null:+v); fzRenderCapture(panel); }
      else if(a==='lado'){ fzSel.lado=v; fzRenderCapture(panel); }
      else if(a==='ref'){ fzSel.ref=v; fzRenderCapture(panel); }
      else if(a==='add'){
        if(!fzSel.mus||fzSel.valor==null) return;
        var e={id:'fz_'+Date.now()+'_'+Math.random().toString(36).slice(2,6), reg:fzSel.reg, mus:fzSel.mus, lado:fzSel.lado, valor:fzSel.valor, ref:fzSel.ref, fecha:fzHoy()};
        fzEntries(p).push(e);
        // escribir la frase en el campo libre REAL sin pisar lo escrito
        try{
          if(opts.writeField && typeof window.setCampoAppend==='function') window.setCampoAppend(opts.writeField, fzFrase(e));
          else if(opts.writeField){ var t=el(opts.writeField); if(t){ t.value=(t.value?t.value.replace(/\s*$/,'')+' · ':'')+fzFrase(e); t.dispatchEvent(new Event('input',{bubbles:true})); } }
        }catch(_){}
        fzSel.mus=''; fzSel.valor=null;      // listo para el siguiente músculo
        fzRenderCapture(panel); fzRenderResultados(panel, p);
      }
    });
  }

  /* ===================================================================== *
   * V1.1 · SOAP MOBILE-FIRST                                              *
   *   · compacta identificación / fecha / dictado (encabezado liviano)   *
   *   · barra sticky de navegación rápida S/O/A/P (llega al Subjetivo)    *
   *   · barra de Guardar fija que flota sobre el teclado (visualViewport) *
   *   · conserva TODO: dictado, descarga, nuevo motivo, modalidades,     *
   *     agentes, media, razonamiento clínico. Solo reubica y acentúa.    *
   * ===================================================================== */
  var SOAP_SECS=[
    {k:'s', ic:'S', t:'Subjetivo', cls:'rd-s', col:'#1565C0'},
    {k:'o', ic:'O', t:'Objetivo',  cls:'rd-o', col:'#1B5E20'},
    {k:'a', ic:'A', t:'Análisis',  cls:'rd-a', col:'#E65100'},
    {k:'p', ic:'P', t:'Plan',      cls:'rd-p', col:'#6A1B9A'}
  ];
  function rdScrollTo(elm){
    if(!elm) return;
    try{ elm.scrollIntoView({behavior:'smooth', block:'start'}); }catch(_){ try{elm.scrollIntoView();}catch(__){} }
  }
  // Barra sticky con las 4 letras — tocar una salta a su sección.
  function buildSoapQuickNav(full, map){
    var present=SOAP_SECS.filter(function(x){return map[x.k];});
    if(present.length<2){ var old=el('rd-soap-qnav'); if(old) old.remove(); return; }
    var nav=el('rd-soap-qnav');
    if(!nav){
      nav=document.createElement('div'); nav.id='rd-soap-qnav';
      full.insertBefore(nav, full.firstChild);
    } else if(nav.parentNode!==full || full.firstChild!==nav){
      full.insertBefore(nav, full.firstChild);
    }
    nav.innerHTML=present.map(function(x){
      return '<button type="button" data-k="'+x.k+'" style="--rdc:'+x.col+'">'
        +'<b>'+x.ic+'</b><span>'+x.t+'</span></button>';
    }).join('');
    // Apilar la barra justo debajo de la alerta de seguridad sticky (sin ocultarla)
    try{
      var cs=el('content-soap'), sf=el('soap-full'), top=0;
      if(cs){ var ch=cs.children; for(var i=0;i<ch.length;i++){ if(ch[i]===sf) break; if(getComputedStyle(ch[i]).position==='sticky') top+=ch[i].getBoundingClientRect().height; } }
      nav.style.top=top+'px';
      SOAP_SECS.forEach(function(x){ if(map[x.k]) map[x.k].style.scrollMarginTop=(top+46)+'px'; });
    }catch(_){}
    present.forEach(function(x){
      var b=nav.querySelector('[data-k="'+x.k+'"]');
      if(b) b.onclick=function(){ rdScrollTo(map[x.k]); setActiveChip(x.k); };
    });
    // scroll-spy: resalta la sección visible
    try{ if(window.__rdSpy) window.__rdSpy.disconnect(); }catch(_){}
    var io=new IntersectionObserver(function(ents){
      ents.forEach(function(e){ if(e.isIntersecting){ var k=e.target.getAttribute('data-rdk'); if(k) setActiveChip(k); } });
    },{rootMargin:'-45% 0px -45% 0px', threshold:0});
    present.forEach(function(x){ map[x.k].setAttribute('data-rdk',x.k); io.observe(map[x.k]); });
    window.__rdSpy=io;
    function setActiveChip(k){ nav.querySelectorAll('button').forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-k')===k); }); }
    setActiveChip(present[0].k);
  }
  // Barra inferior fija: Guardar (dispara el botón REAL) + saltos S/O/A/P.
  // Flota sobre el teclado con visualViewport para no quedar tapada al escribir.
  function realSaveBtn(){ return document.querySelector('#content-soap [onclick="guardarSOAP()"], #content-soap [onclick*="guardarSOAP"]'); }
  function buildSoapSaveBar(map){
    var sf=el('soap-full'); if(!sf || sf.offsetParent===null){ hideSoapSaveBar(); return; }  // descarga / pantalla oculta
    var bar=el('rd-soap-bar');
    if(!bar){
      bar=document.createElement('div'); bar.id='rd-soap-bar';
      bar.innerHTML='<button type="button" class="rd-bar-top" title="Ir al inicio de la nota">↑</button>'
        +'<button type="button" class="rd-bar-save">💾 Guardar nota</button>';
      document.body.appendChild(bar);
      bar.querySelector('.rd-bar-save').onclick=function(){
        var b=realSaveBtn();
        if(b){ b.click(); }      // usa el botón REAL → conserva su verificación/estado
        else { try{ if(typeof guardarSOAP==='function') guardarSOAP(); }catch(_){} }
        setTimeout(function(){ try{ rdClearDraft(); }catch(_){} }, 60);  // nota guardada → limpiar borrador
      };
      bar.querySelector('.rd-bar-top').onclick=function(){ var sf=el('soap-full'); if(sf) rdScrollTo(sf); };
      var vv=window.visualViewport;
      if(vv){ var f=function(){ floatSaveBar(); }; vv.addEventListener('resize',f); vv.addEventListener('scroll',f); }
    }
    bar.classList.add('show');
    floatSaveBar();
  }
  function floatSaveBar(){
    var bar=el('rd-soap-bar'); if(!bar) return;
    var vv=window.visualViewport;
    if(vv){
      var kb=Math.max(0, (window.innerHeight - vv.height - vv.offsetTop));
      bar.style.bottom = (kb>60 ? kb : 0) + 'px';         // sobre el teclado si está abierto
      bar.classList.toggle('kb', kb>60);
    }
  }
  function hideSoapSaveBar(){ var b=el('rd-soap-bar'); if(b) b.classList.remove('show'); }

  /* V1.1 · NUEVO MOTIVO — al activarlo, mostrar de inmediato
     "Nuevo episodio · Sesión 1 · pendiente de guardar" y recordar que los
     antecedentes/historia se conservan (no se mezclan lesiones). */
  function rdMotivoNuevoOn(){
    try{ if(window._soapNuevoMotivoOn===true) return true; }catch(_){}
    var box=el('nuevo-motivo-box'); return !!(box && box.style.display!=='none' && box.offsetParent!==null);
  }
  function rdNuevoMotivoBanner(){
    var full=el('soap-full'); if(!full) return;
    var on=rdMotivoNuevoOn();
    var ban=el('rd-nm-banner');
    if(!on){ if(ban) ban.remove(); return; }
    var p=cur(); var ep=((p&&p.motivoActualIndex)||0)+2;   // el nuevo episodio (1-based)
    if(!ban){
      ban=document.createElement('div'); ban.id='rd-nm-banner'; ban.className='rd-nm';
      var qn=el('rd-soap-qnav');
      if(qn && qn.nextSibling) full.insertBefore(ban, qn.nextSibling);
      else full.insertBefore(ban, full.firstChild);
    }
    ban.innerHTML='<div class="rd-nm-top"><span class="rd-nm-ic">🆕</span>'
      +'<div><b>Nuevo episodio · Sesión 1</b>'
      +'<span class="rd-nm-pend">pendiente de guardar</span></div>'
      +'<span class="rd-nm-ep">Episodio '+ep+'</span></div>'
      +'<div class="rd-nm-note">Se conservan los antecedentes y la historia; esta nota inicia un episodio nuevo y la numeración de sesiones arranca en 1. No se mezcla con lesiones anteriores.</div>';
  }

  /* --------------------------------- COMPACTAR + ACENTUAR SOAP ----------- */
  function enhanceSoap(container){
    var full=el('soap-full'); if(!full){ hideSoapSaveBar(); return; }
    // 1) Etiquetar las secciones que aún sean hijas directas (solo acierta en el
    //    1er render; las clases rd-* persisten aunque luego se aniden en filas).
    full.querySelectorAll(':scope > .form-section').forEach(function(sec){
      var t=sec.querySelector('.form-section-title'); if(!t) return;
      var tx=(t.textContent||'').trim();
      if(/^📋/.test(tx)||/identificaci/i.test(tx)) sec.classList.add('rd-ident');
      else if(/^📅/.test(tx)||/fecha de la consulta/i.test(tx)) sec.classList.add('rd-fecha');
      else if(sec.querySelector('#soap-dictado-btn')) sec.classList.add('rd-dictado');
      else if(/^S\s*[—\-·]/.test(tx)||/^S\b.*Subjetiv/i.test(tx)) sec.classList.add('rd-s','rd-sec');
      else if(/^O\s*[—\-·]/.test(tx)) sec.classList.add('rd-o','rd-sec');
      else if(/^A\s*[—\-·]/.test(tx)) sec.classList.add('rd-a','rd-sec');
      else if(/^P\s*[—\-·]/.test(tx)) sec.classList.add('rd-p','rd-sec');
    });
    // 2) Resolver el mapa por CLASE (robusto a la rejilla que anida S|O / A|P)
    var map={ s:full.querySelector('.rd-s'), o:full.querySelector('.rd-o'),
              a:full.querySelector('.rd-a'), p:full.querySelector('.rd-p') };
    // 3) Rejilla S|O y A|P SOLO si aún son hijas directas y no se armó
    if(map.s&&map.o&&map.s.parentNode===full&&map.o.parentNode===full&&!full.querySelector('.rd-row-so')){
      var r1=document.createElement('div'); r1.className='rd-row rd-row-so';
      full.insertBefore(r1,map.s); r1.appendChild(map.s); r1.appendChild(map.o);
    }
    if(map.a&&map.p&&map.a.parentNode===full&&map.p.parentNode===full&&!full.querySelector('.rd-row-ap')){
      var r2=document.createElement('div'); r2.className='rd-row rd-row-ap';
      full.insertBefore(r2,map.a); r2.appendChild(map.a); r2.appendChild(map.p);
    }
    buildSoapCtx(container);            // panel de contexto (colapsado en móvil)
    try{ var og=map.o&&map.o.querySelector('.form-group'); if(og) buildBioCard(og); }catch(_){}
    try{ if(map.o) buildFuerzaPanel(map.o, cur(), {writeField:'f-ofuerza'}); }catch(_){}
    try{ buildSoapQuickNav(full, map); }catch(_){}   // al final → queda como 1er hijo (arriba de todo)
    try{ buildSoapSaveBar(map); }catch(_){}
    // guarda de borrador: mantener vivo + restaurar si el re-render dejó la nota vacía
    try{
      if(!full._rdDraftHooked){ full._rdDraftHooked=true; var _t; full.addEventListener('input',function(){ clearTimeout(_t); _t=setTimeout(rdSnapDraft,400); }); }
      rdRestoreDraft();
    }catch(_){}
    // nuevo motivo: banner inmediato + hook al botón real (el toggle es un cambio de estilo)
    try{
      var nmb=el('btn-nuevo-motivo-soap');
      if(nmb && !nmb._rdHooked){ nmb._rdHooked=true; nmb.addEventListener('click', function(){ setTimeout(rdNuevoMotivoBanner, 40); }); }
      rdNuevoMotivoBanner();
    }catch(_){}
  }

  /* --------------------------------------------------- OBSERVADORES ------ */
  function tabActivo(){ try{ var t=document.querySelector('.tabs .tab.active'); return t?(t.textContent||'').trim().toLowerCase():''; }catch(_){ return ''; } }
  function enhanceValoracion(c){
    // Solo en la pestaña Valoración: panel de Fuerza 0–10 (comparativa/evolución).
    if(!/valoraci/.test(tabActivo())) return;
    if(c.querySelector(':scope > .rd-fz')){ try{ buildFuerzaPanel(c, cur(), {}); }catch(_){} return; }
    try{ buildBioCard(c); }catch(_){}                 // ROM/biomecánica también en Valoración
    try{ buildFuerzaPanel(c, cur(), {}); }catch(_){}
  }
  function runFor(id){
    var c=el(id); if(!c) return;
    if(id==='content-soap') enhanceSoap(c);
    else if(id==='content-expediente'){ buildExpCtx(c); try{ enhanceValoracion(c); }catch(_){} }
  }
  function observe(id){
    var c=el(id); if(!c) return;
    var pending=false, obs;
    function fire(){
      if(pending) return; pending=true;
      requestAnimationFrame(function(){
        pending=false;
        try{ obs.disconnect(); }catch(_){}
        try{ runFor(id); }catch(e){ /* nunca romper la app */ }
        try{ obs.observe(c,{childList:true}); }catch(_){}
      });
    }
    obs=new MutationObserver(fire);
    obs.observe(c,{childList:true});
    fire();
  }

  /* -------------------------------------------------------------- INIT --- */
  function init(){
    try{ applyBP(); }catch(_){}
    try{ buildRail(); syncRail(); }catch(_){}
    window.addEventListener('resize', function(){ try{applyBP();}catch(_){} }, {passive:true});
    // re-sincroniza el rail cuando cambia la pantalla activa
    try{
      var mo=new MutationObserver(function(){ try{syncRail();}catch(_){} });
      document.querySelectorAll('.screen').forEach(function(s){ mo.observe(s,{attributes:true,attributeFilter:['class']}); });
    }catch(_){}
    ['content-soap','content-expediente'].forEach(observe);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else setTimeout(init, 0);
  // reintento tardío por si la app pinta después del boot sintético
  setTimeout(function(){ try{init();}catch(_){} }, 1500);
})();
