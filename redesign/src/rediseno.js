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

  /* --------------------------------- TARJETA BIOMECÁNICA (propuesta) ------
     Lee p.biomecanica real; estados Actual/Histórica/Pendiente; NO calcula
     diferencias de pendientes; conserva fecha de las históricas; reusa el
     motor existente (abrirMedidorBiomecanico/BIO_comparar). Es PROPUESTA
     visual: no escribe datos, no toca algoritmos. */
  function bioSesiones(p){ try{ return (p&&Array.isArray(p.biomecanica))?p.biomecanica.slice():[]; }catch(_){ return []; } }
  function bioMejorMedida(ses){
    // extrae una medida (grado + etiqueta) de una sesión gonio, si la trae
    try{
      if(!ses||!Array.isArray(ses.medidas)) return null;
      var m=ses.medidas.find(function(x){return x && (x.grado!=null) && x.ok!==false;});
      if(!m) return null;
      return {etq:(m.etq||m.articulacion||m.mov||'Medición'), grado:m.grado, fecha:ses.fecha||ses.date||'', pend:(m.ok===false||m.validado===false)};
    }catch(_){ return null; }
  }
  function buildBioCard(full){
    var O=full.querySelector('.rd-o'); if(!O) return;
    var grp=O.querySelector('.form-group'); if(!grp) return;
    if(grp.querySelector('.rd-bio')) return;
    var p=cur(); if(!p) return;
    var ses=bioSesiones(p).filter(function(s){return s && s.tipo==='gonio';});  // ROM/goniómetro
    var medidas=ses.map(bioMejorMedida).filter(Boolean);
    var actual=medidas.length?medidas[medidas.length-1]:null;
    // COMPARABILIDAD: la "inicial" debe ser del MISMO movimiento que la actual
    // (mismo etiquetado). Nunca se compara flexión con cadencia, etc.
    var inicial=null;
    if(actual){
      for(var i=0;i<medidas.length-1;i++){
        if(medidas[i] && medidas[i].etq===actual.etq){ inicial=medidas[i]; break; }
      }
    }
    // delta SOLO si: mismo movimiento, ambos numéricos y NINGUNO pendiente de validar
    var delta=null;
    if(actual && inicial && actual.etq===inicial.etq
       && typeof actual.grado==='number' && typeof inicial.grado==='number'
       && !actual.pend && !inicial.pend){
      delta=(actual.grado-inicial.grado);
    }
    var hayMed=(typeof window.abrirMedidorBiomecanico==='function');
    var hayCmp=(typeof window.BIO_comparar==='function');
    function val(lbl,v,sub,cls){ return '<div class="rd-bio-v '+(cls||'')+'"><div class="rd-bio-n">'+H(v)+'</div><div class="rd-bio-l">'+H(lbl)+(sub?('<br><span>'+H(sub)+'</span>'):'')+'</div></div>'; }
    var cuerpo;
    if(actual){
      cuerpo='<div class="rd-bio-row">'
        + (inicial?val('Inicial', inicial.grado+'°', inicial.fecha, 'hist'):'')
        + val('Actual', actual.grado+'°'+(actual.pend?' ⏳':''), actual.pend?'pendiente de validar':(actual.fecha||'sesión actual'), actual.pend?'pend':'now')
        + (delta!=null?val('Cambio', (delta>=0?'+':'')+delta+'°', 'comparable', 'delta'):(actual.pend?val('Cambio','—','no se calcula en pendientes','off'):''))
        + '</div>'
        + '<div class="rd-bio-note">'+H(actual.etq)+' · cámara 2D · estimación no validada frente a goniómetro físico. Confirmar posición, activa/pasiva, lado y evidencia.</div>';
    } else {
      cuerpo='<div class="rd-bio-note">Sin mediciones en este motivo. Mide con la cámara o importa una medición previa.</div>';
    }
    var card=document.createElement('div'); card.className='rd-bio';
    card.innerHTML='<div class="rd-bio-head">📐 Mediciones biomecánicas <span class="rd-bio-tag">propuesta</span></div>'
      + cuerpo
      + '<div class="rd-bio-btns">'
      + (hayMed?'<button type="button" onclick="try{abrirMedidorBiomecanico(\'gonio\')}catch(e){}">📐 Medir ROM</button>':'')
      + (hayMed?'<button type="button" onclick="try{abrirMedidorBiomecanico(\'gonio\')}catch(e){}">⬇️ Importar histórica</button>':'')
      + (hayCmp?'<button type="button" onclick="try{BIO_comparar()}catch(e){}">⚖️ Comparar</button>':'')
      + '</div>'
      + '<div class="rd-bio-legend"><span class="now">● Actual</span><span class="hist">● Histórica</span><span class="pend">● Pendiente</span> · la pendiente no alimenta diferencias ni IA</div>';
    grp.appendChild(card);
  }

  /* --------------------------------- COMPACTAR + ACENTUAR SOAP ----------- */
  function enhanceSoap(container){
    var full=el('soap-full'); if(!full) return;
    var secs=full.querySelectorAll(':scope > .form-section');
    var S=null,O=null,A=null,P=null;
    secs.forEach(function(sec){
      var t=sec.querySelector('.form-section-title'); if(!t) return;
      var tx=(t.textContent||'').trim();
      if(/^📋/.test(tx)||/identificaci/i.test(tx)) sec.classList.add('rd-ident');
      else if(/^S\s*[—\-·]/.test(tx)||/^S\b.*Subjetiv/i.test(tx)){sec.classList.add('rd-s');S=sec;}
      else if(/^O\s*[—\-·]/.test(tx)){sec.classList.add('rd-o');O=sec;}
      else if(/^A\s*[—\-·]/.test(tx)){sec.classList.add('rd-a');A=sec;}
      else if(/^P\s*[—\-·]/.test(tx)){sec.classList.add('rd-p');P=sec;}
    });
    // Rejilla S|O y A|P (solo si no se armó ya)
    if(S&&O&&!full.querySelector('.rd-row-so')){
      var r1=document.createElement('div'); r1.className='rd-row rd-row-so';
      S.parentNode.insertBefore(r1,S); r1.appendChild(S); r1.appendChild(O);
    }
    if(A&&P&&!full.querySelector('.rd-row-ap')){
      var r2=document.createElement('div'); r2.className='rd-row rd-row-ap';
      A.parentNode.insertBefore(r2,A); r2.appendChild(A); r2.appendChild(P);
    }
    buildSoapCtx(container);
    try{ buildBioCard(full); }catch(_){}
  }

  /* --------------------------------------------------- OBSERVADORES ------ */
  function runFor(id){
    var c=el(id); if(!c) return;
    if(id==='content-soap') enhanceSoap(c);
    else if(id==='content-expediente') buildExpCtx(c);
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
