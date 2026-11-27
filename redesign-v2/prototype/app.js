/* ============================================================
   SINERGIA V2 · motor del prototipo (navegación + pantallas)
   Datos sintéticos. No toca lógica real, persistencia ni algoritmos.
   ============================================================ */
(function(){
"use strict";
const D = window.DEMO;
const app = () => document.getElementById('app');
const ic = (id,cls='') => `<svg class="ic ${cls}"><use href="#i-${id}"/></svg>`;
let LENS = false; // lente dermatofuncional

/* ---- status bar ---- */
function statusbar(white){
  return `<div class="statusbar${white?' on-navy':''}"><span>9:41</span><div class="r">
    ${ic('sig','')}${ic('wifi','sm')}<svg class="ic" style="width:26px;height:16px"><use href="#i-bat"/></svg></div></div>`;
}
function tabbar(active){
  const tabs=[['agenda','cal','Agenda'],['pacientes','users','Pacientes'],['protocolos','book','Protocolos'],['supervision','activity','Supervisión']];
  return `<div class="tabbar">${tabs.map(t=>`<button class="tab${active===t[0]?' on':''}" data-go="${t[0]}">${ic(t[1])}${t[2]}</button>`).join('')}</div>`;
}
const curves = `<div class="curves">
  <svg class="tl" viewBox="0 0 322 322"><path d="M-40,-40 C 170,-30 300,70 250,195 C 214,285 95,250 -40,300 Z" fill="#122950"/><path d="M-40,-40 C 150,-26 268,64 236,176" fill="none" stroke="#C9A84C" stroke-width="5" stroke-linecap="round"/></svg>
  <svg class="br" viewBox="0 0 340 340"><path d="M400,400 C 190,392 60,286 118,160 C 158,66 286,104 400,56 Z" fill="#1B3A6B"/><path d="M400,400 C 206,388 92,296 128,182" fill="none" stroke="#C9A84C" stroke-width="5" stroke-linecap="round"/></svg></div>`;

/* ---- router ---- */
const state = { screen:'login', pid:'p1', soapTab:'S', altaStep:0, nuevoMotivo:false, saveState:'draft' };
function go(screen, pid){
  if(pid) state.pid = pid;
  const p = D.pById(state.pid);
  LENS = (screen!=='login' && screen!=='splash' && p && p.derma);
  app().classList.toggle('lens-derma', !!(LENS && ['expediente','valoracion','soap','alta','dermato'].includes(screen)));
  state.screen = screen;
  const fn = SCREENS[screen] || SCREENS.agenda;
  app().innerHTML = fn(p);
  window.scrollTo && app().querySelector('.scroll') && (app().querySelector('.scroll').scrollTop=0);
  if(AFTER[screen]) AFTER[screen](p);
}
window.__go = go;

/* ---- toast / sheet ---- */
function toast(msg, cls='', icon='check'){
  let t = document.getElementById('toast');
  if(!t){ t=document.createElement('div'); t.id='toast'; t.className='toast'; app().appendChild(t); }
  t.className = 'toast '+cls; t.innerHTML = ic(icon,'sm')+'<span>'+msg+'</span>';
  requestAnimationFrame(()=>t.classList.add('show'));
  clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('show'), 2600);
}
function sheet(html){
  closeSheet();
  const bg=document.createElement('div'); bg.className='sheet-bg'; bg.id='sheet-bg';
  const sh=document.createElement('div'); sh.className='sheet'; sh.id='sheet'; sh.innerHTML=`<div class="grab"></div>`+html;
  app().appendChild(bg); app().appendChild(sh);
  bg.addEventListener('click', closeSheet);
  requestAnimationFrame(()=>{bg.classList.add('show'); sh.classList.add('show');});
}
function closeSheet(){
  const bg=document.getElementById('sheet-bg'), sh=document.getElementById('sheet');
  if(sh){sh.classList.remove('show'); setTimeout(()=>sh.remove(),300);}
  if(bg){bg.classList.remove('show'); setTimeout(()=>bg.remove(),300);}
}
window.__sheet=sheet; window.__closeSheet=closeSheet; window.__toast=toast;

/* =======================================================
   PANTALLAS
   ======================================================= */
const SCREENS = {};

/* ---------- LOGIN ---------- */
SCREENS.login = () => `<div class="screen">
  ${curves}
  ${statusbar()}
  <div class="login">
    <div class="brandbox"><img src="../brand/logo_vertical.png" alt="Clínica Sinergia"></div>
    <div class="gold-div"></div>
    <h2>Bienvenido</h2>
    <p class="welcome-sub">Sistema de expedientes clínicos</p>
    <div class="flabel">Correo electrónico</div>
    <div class="ifield"><span class="lead">${ic('mail')}</span><span class="sep"></span><input placeholder="tu correo institucional" value="z.gutierrez@clinica"></div>
    <div class="flabel">Contraseña</div>
    <div class="ifield"><span class="lead">${ic('lock')}</span><span class="sep"></span><input type="password" value="demodemo"><button class="eye" data-act="eye">${ic('eye')}</button></div>
    <button class="btn-primary" style="height:58px;border-radius:16px" data-act="entrar">Iniciar sesión ${ic('arrow')}</button>
    <button class="forgot" data-go="recuperar">¿Olvidaste tu contraseña?</button>
    <button class="btn-wifi" data-act="entrar"><span class="lead">${ic('wifi')}</span><span class="sep"></span>Acceder sin conexión</button>
    <div class="auth-note">${ic('shield')}Acceso exclusivo para personal autorizado</div>
    <div class="verchip">${D.version}</div>
  </div>
</div>`;

SCREENS.recuperar = () => `<div class="screen">
  ${curves}${statusbar()}
  <div class="login" style="padding-top:20px">
    <div class="topnav" style="padding-left:0"><button class="back" data-go="login">${ic('back')}</button></div>
    <div class="state-ic navy" style="margin:6px auto 18px">${ic('key')}</div>
    <h2 style="font-size:25px">Recuperar acceso</h2>
    <p class="welcome-sub" style="margin-bottom:28px">Te enviaremos un enlace seguro a tu correo institucional.</p>
    <div class="flabel">Correo electrónico</div>
    <div class="ifield"><span class="lead">${ic('mail')}</span><span class="sep"></span><input value="z.gutierrez@clinica"></div>
    <button class="btn-primary" style="height:58px;border-radius:16px" data-act="recup">Enviar enlace ${ic('send')}</button>
    <button class="forgot" data-go="login">Volver a inicio de sesión</button>
    <div class="auth-note">${ic('shield')}El enlace expira en 30 minutos</div>
  </div></div>`;

/* ---------- SPLASH ---------- */
SCREENS.splash = () => `<div class="screen">${curves}${statusbar()}
  <div class="splash"><img src="../brand/logo_vertical.png" alt=""><div class="tag">Fisioterapia y Rehabilitación</div><div class="prog"><i></i></div></div></div>`;

/* ---------- AGENDA ---------- */
SCREENS.agenda = () => {
  const H=D.hoy;
  const apptRow = a => `<button class="appt" data-go="expediente" data-pid="${a.id}">
    <div class="time"><b>${a.hora}</b><span>${a.dur}</span></div>
    <div class="tl${a.on?' on':''}"></div>
    <div class="body"><div class="nm">${a.nombre}</div><div class="meta"><span class="chip${a.derma?' derma':''}">${a.dx}</span></div></div>
    <div class="right"><span class="ini ${a.ini.toLowerCase()}">${a.ini}</span><span class="st"${a.falta?' style="color:var(--warn)"':''}><span class="dot ${a.stCls}"></span>${a.estado}</span></div>
  </button>`;
  return `<div class="screen">${statusbar()}
    <div class="scroll">
      <div class="appbar"><div><div class="date">${H.fecha}</div><div class="h1">Hoy</div></div>
        <div class="actions"><button class="iconbtn">${ic('search')}</button><div class="avatar">${D.user.inicial}</div></div></div>
      <div class="hero"><div class="lbl">Jornada de hoy</div><div class="big">${H.citas}<small> citas</small></div>
        <svg class="ring" viewBox="0 0 66 66"><circle cx="33" cy="33" r="27" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="6"/><circle cx="33" cy="33" r="27" fill="none" stroke="#C9A84C" stroke-width="6" stroke-linecap="round" stroke-dasharray="170" stroke-dashoffset="36" transform="rotate(-90 33 33)"/></svg><div class="ring" style="position:absolute"><div class="v" style="right:20px;top:18px;width:66px;height:66px">79%</div></div>
        <div class="hero-row"><div class="hero-stat"><div class="n">${H.atendidas}</div><div class="t">Atendidas</div></div>
          <div class="hero-stat"><div class="n gold">${H.sinDoc}</div><div class="t">Sin documentar</div></div>
          <div class="hero-stat"><div class="n">${H.porLlegar}</div><div class="t">Por llegar</div></div></div></div>
      <div class="sec-head"><div class="t">Próximas</div><button class="a">Ver todas ${ic('cr','sm')}</button></div>
      <div class="card" style="padding:0;overflow:hidden">${D.agenda.proximas.map(apptRow).join('')}</div>
      <div class="sec-head"><div class="t">Atendidas · sin documentar</div></div>
      <div class="card" style="padding:0;overflow:hidden">${D.agenda.sinDocumentar.map(apptRow).join('')}</div>
      <div class="scroll-pad"></div>
    </div>
    <button class="fab" data-go="alta">${ic('plus','lg')}</button>
    ${tabbar('agenda')}
  </div>`;
};

/* ---------- PACIENTES ---------- */
SCREENS.pacientes = () => {
  const row = p => `<button class="appt" data-go="expediente" data-pid="${p.id}">
    <div class="pt-av" style="width:44px;height:44px;border-radius:13px;font-size:15px;background:linear-gradient(135deg,${p.derma?'#8E3B6E,#A85089':'#122950,#1B3A6B'})">${p.ini}</div>
    <div class="body" style="margin-left:2px"><div class="nm">${p.nombre}</div><div class="meta"><span class="chip${p.derma?' derma':''}">${p.dx}</span></div></div>
    <div class="right"><span class="st">${p.edad} a · ${p.terapeuta}</span><span class="st muted">${ic('cr','sm')}</span></div></button>`;
  return `<div class="screen">${statusbar()}
    <div class="scroll">
      <div class="appbar"><div><div class="date">${D.pacientes.length} activos</div><div class="h1">Pacientes</div></div>
        <div class="actions"><button class="iconbtn">${ic('filter')}</button><div class="avatar">${D.user.inicial}</div></div></div>
      <div class="pad20"><div class="ifield" style="height:50px;margin-bottom:14px"><span class="lead">${ic('search')}</span><span class="sep"></span><input placeholder="Buscar paciente o diagnóstico"></div></div>
      <div class="card" style="padding:0;overflow:hidden">${D.pacientes.map(row).join('')}</div>
      <div class="scroll-pad"></div>
    </div>
    <button class="fab" data-go="alta">${ic('plus','lg')}</button>
    ${tabbar('pacientes')}
  </div>`;
};

/* ---------- EXPEDIENTE ---------- */
SCREENS.expediente = (p) => {
  const sb=p.seguridad;
  const mods = p.derma ? [
    ['dermato','droplet','Dermatofuncional','Edema · fibrosis · cicatriz',true],
    ['valoracion','clip','Valoración','EVA · perímetros · fotos'],
    ['soap','activity','Notas SOAP',p.sesiones+' sesiones'],
    ['biomecanica','cam','Fotos antes/después','Comparativas'],
    ['protocolos','target','Plan estético','Fases 1-3'],
    ['estudios','file','Estudios','Documentos']
  ] : [
    ['valoracion','clip','Valoración','EVA · ROM · fuerza',true],
    ['soap','activity','Notas SOAP',p.sesiones+' sesiones · última '+(p.ultimaNota||'—').toLowerCase()],
    ['biomecanica','bone','Biomecánica','Goniometría · marcha'],
    ['protocolos','target','Protocolo',(p.protocolo?p.protocolo.nombre+' · '+p.protocolo.fase:'Sugerir')],
    ['ejercicios','bolt','Ejercicios',(p.ejercicios?p.ejercicios.length:0)+' en casa'],
    ['estudios','file','Estudios',(p.estudios?p.estudios.length:0)+' documentos']
  ];
  const evo = p.evolucionEVA||[], ev0=evo[0]||0, evN=evo[evo.length-1]||0, maxv=Math.max(...evo,10);
  return `<div class="screen">${statusbar()}
    <div class="scroll">
      <div class="topnav"><button class="back" data-go="${state.from||'agenda'}">${ic('back')}</button>
        <div class="ttl">Expediente${p.derma?' · dermatofuncional':''}<small>${p.region||''}</small></div>
        <button class="iconbtn sp" data-go="alta" title="Editar">${ic('edit')}</button></div>
      <div class="pt-head">
        <div class="top"><div class="pt-av">${p.ini}</div><div style="flex:1;min-width:0"><h2>${p.nombre}</h2>
          <div class="line"><span class="m">${p.edad} años</span><span class="m">·</span><span class="m">${p.terapeuta}</span>${p.derma?'<span class="chip derma">Dermatofuncional</span>':'<span class="chip">Activo</span>'}</div></div></div>
        <div class="pt-dx"><span class="chip" style="max-width:none">${p.dx}</span></div>
        <div class="pt-stats"><div class="s"><div class="n">${p.eva}<span class="u">/10</span></div><div class="l">EVA</div></div>
          ${p.flex?`<div class="s"><div class="n">${p.flex}<span class="u">°</span></div><div class="l">Flexión</div></div>`:`<div class="s"><div class="n">${(p.derma_datos&&p.derma_datos.edema)||'+2'}</div><div class="l">Edema</div></div>`}
          <div class="s"><div class="n">${p.sesiones}</div><div class="l">Sesiones</div></div></div>
      </div>
      <div class="safe-banner ${sb.nivel}">${ic('shield','sm')}${sb.texto}</div>
      <div class="evo"><div class="hd"><div class="t">Evolución del dolor</div><div class="delta down">${ic('cd','sm')}−${ev0-evN} en ${evo.length} sem</div></div>
        <div class="spark">${evo.map((v,i)=>`<div class="b${i===evo.length-1?' on':''}" style="height:${Math.round(v/maxv*100)}%">${(i===0||i===evo.length-1)?`<span>${v}</span>`:''}</div>`).join('')}</div>
        <div class="xax">${(p.evoLabels||[]).map(l=>`<span>${l}</span>`).join('')}</div></div>
      <div class="vh eyebrow" style="padding-left:22px">Áreas del expediente</div>
      <div class="modgrid">${mods.map(m=>`<button class="mod${m[4]?' on':''}" data-go="${m[0]}" data-pid="${p.id}"><div class="ico">${ic(m[1])}</div><div class="nm">${m[2]}</div><div class="d">${m[3]}</div></button>`).join('')}</div>
      <div class="scroll-pad" style="height:24px"></div>
    </div>
  </div>`;
};

/* ---------- VALORACIÓN ---------- */
SCREENS.valoracion = (p) => {
  if(p.derma) return dermatoValoracion(p);
  const fz = (p.fuerza||[]).map(f=>`<div class="fz-row"><div class="nm"><span>${f.m}</span><span class="def${f.def?'':' ref'}">${f.def?('Déficit '+f.def+'%'):'Simétrico'}</span></div>
    <div class="fz-bars"><div class="fz-side"><div class="lab"><span>Derecho</span><span>${f.der}/10</span></div><div class="fz-track"><div class="fz-fill v" style="width:${f.der*10}%"></div></div></div>
    <div class="fz-side"><div class="lab"><span>Izquierdo</span><span>${f.izq}/10</span></div><div class="fz-track"><div class="fz-fill r" style="width:${f.izq*10}%"></div></div></div></div></div>`).join('');
  const off = p.flex? Math.round(251-(p.flex/180)*251) : 90;
  return `<div class="screen">${statusbar()}
    <div class="scroll">
      <div class="topnav"><button class="back" data-go="expediente" data-pid="${p.id}">${ic('back')}</button><div class="ttl">${p.nombre}<small>Valoración</small></div></div>
      <div class="vh"><div class="h1" style="font-size:24px">Valoración inicial</div><div class="sub" style="margin-top:3px">${p.region} · 09 nov 2026</div></div>
      <div style="height:12px"></div>
      <div class="vcard"><div class="vt"><div class="ico">${ic('activity','sm')}</div><div class="t">Dolor (EVA)</div><span class="badge done">Evaluado</span></div>
        <div class="eva-top"><div class="n">${p.eva}</div><div class="d">/ 10</div><div class="tag">${p.eva>=7?'Intenso':p.eva>=4?'Moderado':'Leve'}</div></div>
        <div class="evabar"><div class="pin" style="left:${p.eva*10}%"></div></div><div class="evascale"><span>Sin dolor</span><span>Máximo</span></div></div>
      ${p.flex?`<div class="vcard"><div class="vt"><div class="ico">${ic('ruler','sm')}</div><div class="t">Rango de movimiento</div><span class="badge done">Medido</span></div>
        <div class="rom-row"><div class="arc"><svg width="92" height="92" viewBox="0 0 92 92"><circle cx="46" cy="46" r="40" fill="none" stroke="#EEF2F6" stroke-width="9"/><circle cx="46" cy="46" r="40" fill="none" stroke="var(--accent)" stroke-width="9" stroke-linecap="round" stroke-dasharray="251" stroke-dashoffset="${off}" transform="rotate(-90 46 46)"/></svg><div class="lbl"><b>${p.flex}°</b><span>flexión</span></div></div>
        <div class="rom-info"><div class="big">Flexión de rodilla</div><div class="sub2">Inicial ${p.flexIni}° → actual ${p.flex}°<br>Goniometría de cámara · 2D</div><div class="delta up" style="margin-top:8px">${ic('up','sm')}+${p.flex-p.flexIni}° de ganancia</div></div></div></div>`:''}
      ${p.fuerza?`<div class="vcard"><div class="vt"><div class="ico">${ic('bolt','sm')}</div><div class="t">Fuerza comparativa</div><span class="badge part">Sinergia 0–10</span></div>${fz}
        <button class="btn btn-ghost btn-sm mt12" data-act="fuerza">${ic('plus','sm')} Registrar otro grupo</button></div>`:''}
      ${p.pruebas?`<div class="vcard"><div class="vt"><div class="ico">${ic('clip','sm')}</div><div class="t">Pruebas y hallazgos</div></div>
        <div class="states">${p.pruebas.map(x=>`<div class="state ${x.st}"><span class="pt"></span>${x.t}</div>`).join('')}</div></div>`:''}
      <div class="scroll-pad" style="height:24px"></div>
    </div></div>`;
};

/* ---------- SOAP ---------- */
SCREENS.soap = (p) => {
  const sb=p.seguridad, nm=state.nuevoMotivo;
  const ses = nm?1:p.sesiones;
  const last = (p.soap&&p.soap[0])||{};
  return `<div class="screen">
    ${statusbar()}
    <div class="soap-head">
      <div class="soap-id"><div class="pt-av">${p.ini}</div><div style="flex:1;min-width:0">
        <h3>${p.nombre}</h3><div class="ml">${p.dx.split('·')[0]} <span class="ses-chip">Sesión ${ses}</span>${p.derma?'<span class="chip derma">Derma</span>':''}</div></div>
        <button class="back" data-go="expediente" data-pid="${p.id}">${ic('back')}</button></div>
      ${nm?`<div class="soap-safe" style="background:var(--warn-bg);color:var(--warn)">${ic('plus2','sm')}Nuevo episodio · Sesión 1 · pendiente de guardar · antecedentes conservados</div>`:
        `<div class="soap-safe ${sb.nivel==='ok'?'':''}" style="background:${sb.nivel==='warn'?'var(--warn-bg)':sb.nivel==='risk'?'var(--risk-bg)':'var(--ok-bg)'};color:${sb.nivel==='warn'?'var(--warn)':sb.nivel==='risk'?'var(--risk)':'var(--ok)'}">${ic('shield','sm')}${sb.texto}</div>`}
      <div class="qnav">${['S|Subjetivo','O|Objetivo','A|Análisis','P|Plan'].map(x=>{const k=x[0];return `<button class="q${state.soapTab===k?' on':''}" data-soap="${k}">${k}<small>${x.slice(2)}</small></button>`}).join('')}</div>
      <div class="qa"><button class="a" data-act="nuevomotivo">${ic('plus2')}Nuevo motivo</button><button class="a" data-act="dictar">${ic('mic')}Dictar</button><button class="a" data-act="ultima">${ic('clock')}Última sesión</button><button class="a" data-go="valoracion" data-pid="${p.id}">${ic('target')}Objetivos</button></div>
    </div>
    <div class="scroll" id="soap-scroll">
      <div class="sgrp" id="soap-S"><div class="gl"><div class="k">S</div><div class="t">Subjetivo<small>Lo que refiere el paciente</small></div></div>
        <div class="field filled"><div class="fl">Molestia / dolor<span class="muted" style="font-weight:600">EVA inicio ${last.evaI||5}/10</span></div><div class="ft" contenteditable>${last.s||''}</div></div>
        <div class="field"><div class="fl">Actividad física / cambios</div><div class="ft ph" contenteditable data-ph="Toca para escribir…"></div></div></div>
      <div class="sgrp" id="soap-O"><div class="gl"><div class="k">O</div><div class="t">Objetivo<small>Exploración y mediciones</small></div></div>
        <div class="field filled"><div class="fl">ROM · fuerza <button class="pill" style="padding:3px 9px" data-act="importrom">${ic('ruler','sm')} Importar</button></div>
          <div class="mini-metric">${p.flex?`<div class="mm"><div class="ml">Flexión</div><div class="mv">${p.flex}° <small>+${p.flex-p.flexIni}</small></div></div>`:''}${p.fuerza?`<div class="mm"><div class="ml">${p.fuerza[0].m}</div><div class="mv">${p.fuerza[0].der}/10</div></div>`:''}</div>
          <button class="btn btn-ghost btn-sm mt12" data-act="fuerza">${ic('bolt','sm')} Registrar fuerza 0–10</button></div>
        <div class="field"><div class="fl">Agentes físicos aplicados</div><div class="pillrow" id="agentes">${(LENS?['Drenaje linfático','Presoterapia','Corriente Aura','Ultrasonido','Radiofrecuencia','+ más']:['Tecar resistiva','Láser 808 nm','Ultrasonido','Ondas de choque','+ más']).map((a,i)=>`<button class="pill${i<2?' on':''}">${a}</button>`).join('')}</div></div></div>
      <div class="sgrp" id="soap-A"><div class="gl"><div class="k">A</div><div class="t">Análisis<small>Razonamiento clínico</small></div></div>
        <div class="field filled"><div class="fl">Evolución</div><div class="ft" contenteditable>${last.a||''}</div></div></div>
      <div class="sgrp" id="soap-P"><div class="gl"><div class="k">P</div><div class="t">Plan<small>Indicaciones y objetivos</small></div></div>
        <div class="field"><div class="fl">Indicaciones</div><div class="ft ph" contenteditable data-ph="Toca para escribir…"></div></div></div>
      <div class="scroll-pad" style="height:20px"></div>
    </div>
    <div class="savebar"><button class="btn-top" data-act="totop">${ic('up')}</button>
      <div class="state2 ${state.saveState}" id="savestate">${saveLabel()}</div>
      <button class="btn-save btn btn-primary" style="width:auto;padding:0 22px;height:48px" data-act="guardar">${ic('check','sm')} Guardar</button></div>
  </div>`;
};
function saveLabel(){
  const m={draft:'Borrador · se guarda al confirmar', saving:'Guardando…', saved:'Guardado ✓ · confirmado en la nube', local:'Guardado local · sincroniza al reconectar', err:'No se pudo guardar · tu borrador sigue aquí'};
  return m[state.saveState]||m.draft;
}

/* ---------- ALTA (apartados navegables) ---------- */
const ALTA_STEPS = [
  ['Identificación','user'], ['Antecedentes','clip'], ['Seguridad','shield'], ['Motivo','activity'],
  ['Valoración','ruler'], ['Dx y objetivos','target'], ['Tratamiento','bolt'], ['Revisión','check']
];
SCREENS.alta = (p) => {
  const i=state.altaStep, derma=LENS;
  return `<div class="screen">${statusbar()}
    <div class="topnav"><button class="back" data-go="${state.pid?'expediente':'agenda'}" ${state.pid?'data-pid="'+state.pid+'"':''}>${ic('back')}</button>
      <div class="ttl">${derma?'Alta dermatofuncional':'Nuevo paciente'}<small>Paso ${i+1} de ${ALTA_STEPS.length} · ${ALTA_STEPS[i][0]}</small></div></div>
    <div class="progress-top"><i style="width:${Math.round((i+1)/ALTA_STEPS.length*100)}%"></i></div>
    <div class="stepbar">${ALTA_STEPS.map((s,k)=>`<button class="st${k===i?' on':k<i?' done':''}" data-step="${k}"><span class="n">${k<i?'✓':k+1}</span>${s[0]}</button>`).join('')}</div>
    <div class="scroll" id="alta-scroll">${altaBody(i,derma)}<div class="scroll-pad" style="height:100px"></div></div>
    <div class="savebar"><button class="btn btn-ghost" style="width:auto;padding:0 18px;height:46px" data-act="altaprev" ${i===0?'disabled style="opacity:.4"':''}>Anterior</button>
      <div class="state2"><span class="d"></span>Borrador conservado</div>
      ${i<ALTA_STEPS.length-1?`<button class="btn btn-primary" style="width:auto;padding:0 20px;height:46px" data-act="altanext">Siguiente ${ic('cr','sm')}</button>`:`<button class="btn btn-primary" style="width:auto;padding:0 20px;height:46px" data-act="altasave">${ic('check','sm')} Guardar alta</button>`}</div>
  </div>`;
};
function altaBody(i,derma){
  const C=(h,sub,inner)=>`<div class="formcard"><div class="fh">${h}</div><div class="fhsub">${sub}</div>${inner}</div>`;
  const fld=(l,ph,opt)=>`<div class="ff"><label>${l} ${opt?'<span class="opt">(opcional)</span>':'<span class="req">*</span>'}</label><input class="inp" placeholder="${ph||''}"></div>`;
  const chips=(l,arr)=>`<div class="ff"><label>${l}</label><div class="chips">${arr.map((c,k)=>`<button class="chsel${k===0?' on':''}">${c}</button>`).join('')}</div></div>`;
  if(i===0) return C('Datos del paciente','Lo básico para abrir el expediente.',
    fld('Nombre completo','Nombre y apellidos')+
    `<div class="row-g"><div class="ff" style="flex:1"><label>Edad <span class="req">*</span></label><input class="inp" placeholder="años"></div><div class="ff" style="flex:1"><label>Sexo</label><div class="seg"><button class="o on">H</button><button class="o">M</button></div></div></div>`+
    fld('Teléfono','10 dígitos · obligatorio para alta')+
    `<div class="ff"><label>Terapeuta</label><div class="chips">${['Zara','Dulce','Dafne','Camila','Jess'].map((t,k)=>`<button class="chsel${k===0?' on':''}">${t}</button>`).join('')}</div></div>`);
  if(i===1) return C('Antecedentes','Patológicos, cirugías y medicamentos. Lo que no aplique, déjalo vacío.',
    `<div class="ff"><label>Antecedentes heredofamiliares</label><textarea class="inp" rows="2" placeholder="Familiares relevantes"></textarea></div>`+
    `<div class="ff"><label>Cirugías / intervenciones</label><textarea class="inp" rows="2" placeholder="Con fecha si se conoce"></textarea></div>`+
    `<div class="ff"><label>Medicamentos actuales</label><textarea class="inp" rows="2" placeholder="Por condición si toma varios"></textarea></div>`+
    `<div class="ff"><label>Alergias <span class="req">*</span></label><input class="inp" placeholder="o indica 'Ninguna'"></div>`);
  if(i===2) return C('Seguridad clínica','Marca lo que aplique; esto activa las alertas de agentes físicos.',
    `<div class="ff"><label>Condiciones médicas</label><div class="chips">${['Ninguna','Diabetes','Anticoagulantes','Marcapaso / implante','Cáncer (antecedente)','Embarazo','Epilepsia'].map((c,k)=>`<button class="chsel${k===0?' on':''}">${c}</button>`).join('')}</div></div>`+
    `<div class="ff"><label>Implantes / osteosíntesis</label><div class="chips">${['Ninguno','Prótesis metálica','Material de osteosíntesis','Implante electrónico'].map((c,k)=>`<button class="chsel${k===0?' on':''}">${c}</button>`).join('')}</div></div>`+
    `<div class="safe-banner warn" style="margin:4px 0 0">${ic('shield','sm')}Metal o implante electrónico → no RF/US térmico sobre la zona</div>`);
  if(i===3) return motivoGuiado();
  if(i===4) return C('Valoración inicial','Captura rápida. Marca «no evaluado» si aún no aplica.',
    `<div class="ff"><label>Dolor (EVA) <span class="req">*</span></label><div class="eva-pick">${[0,1,2,3,4,5,6,7,8,9,10].map(n=>`<button class="n${n===6?' on':''}" style="${n===6?'background:var(--accent)':''}">${n}</button>`).join('')}</div></div>`+
    (derma?`<div class="ff"><label>Edema (godet)</label><div class="seg"><button class="o">+1</button><button class="o on">+2</button><button class="o">+3</button><button class="o">+4</button></div></div><div class="ff"><label>Perímetros (cm)</label><div class="row-g"><input class="inp" placeholder="Supraumbilical"><input class="inp" placeholder="Umbilical"></div></div>`
    :`<div class="ff"><label>ROM</label><button class="btn btn-ghost btn-sm" data-act="importrom">${ic('ruler','sm')} Medir con cámara / importar</button></div><div class="ff"><label>Fuerza (Sinergia 0–10)</label><button class="btn btn-ghost btn-sm" data-act="fuerza">${ic('bolt','sm')} Registrar grupo muscular</button></div>`));
  if(i===5) return C('Diagnóstico funcional y objetivos','Se mostrará lo que genere el motor clínico; aquí puedes ajustarlo.',
    `<div class="ff"><label>Diagnóstico funcional</label><textarea class="inp" rows="2" placeholder="Dx cineticofuncional"></textarea></div>`+
    `<div class="ff"><label>Objetivo a corto plazo</label><input class="inp" placeholder="Por criterios, no calendario"></div>`+
    `<div class="ff"><label>Objetivo a largo plazo</label><input class="inp" placeholder="Retorno funcional"></div>`);
  if(i===6) return C('Tratamiento inicial','Agentes físicos y ejercicio. El plan completo vive en Protocolo.',
    `<div class="ff"><label>Agentes físicos de hoy</label><div class="chips">${(derma?['Drenaje linfático','Presoterapia','Corriente Aura','Ultrasonido']:['Tecar','Láser','Ultrasonido','Electroterapia','Punción seca']).map((c,k)=>`<button class="chsel${k<2?' on':''}">${c}</button>`).join('')}</div></div>`+
    `<div class="ff"><label>Ejercicio / indicaciones</label><textarea class="inp" rows="2" placeholder="Dosis inicial"></textarea></div>`);
  // revisión
  return C('Revisión y guardado','Confirma antes de crear el expediente. El borrador no se borra hasta confirmar el guardado.',
    `<div style="display:flex;flex-direction:column;gap:9px">${['Identificación','Antecedentes','Seguridad','Motivo','Valoración','Dx y objetivos','Tratamiento'].map((s,k)=>`<div class="state pos" style="justify-content:flex-start"><span class="pt"></span>${s} · completo</div>`).join('')}</div>
    <div class="safe-banner ok" style="margin:14px 0 0">${ic('check','sm')}Teléfono y alergias capturados · listo para guardar</div>`);
}
function motivoGuiado(){
  const q=(l,ph,opts)=>`<div class="ff"><label>${l}</label>${opts?`<div class="chips">${opts.map((c,k)=>`<button class="chsel${k===0&&l.indexOf('¿Qué')<0?'':''}">${c}</button>`).join('')}</div>`:`<input class="inp" placeholder="${ph}">`}</div>`;
  return `<div class="formcard"><div class="fh">Motivo de consulta — entrevista guiada</div><div class="fhsub">Preguntas en lenguaje natural. Si solo conoces el tiempo de evolución, no hace falta la fecha exacta.</div>
    ${q('¿Qué le molesta y dónde?','Describe la molestia principal')}
    ${q('Región / zona',null,['Rodilla','Hombro','Columna','Tobillo','Cadera','Otra'])}
    ${q('Lado',null,['Derecho','Izquierdo','Bilateral','No aplica'])}
    ${q('¿Irradia?',null,['No','Sí'])}
    ${q('¿Cómo es el dolor?',null,['Punzante','Ardor','Eléctrico','Pulsante','Opresivo','Sin dolor'])}
    ${q('¿Desde cuándo?','Ej. "hace 10 semanas" (basta la duración)')}
    ${q('¿Cómo empezó? (mecanismo)',null,['Caída/golpe','Sobreuso','Gesto deportivo','Post-cirugía','Insidioso'])}
    ${q('¿Qué lo agrava?','Actividades/posturas')}
    ${q('¿Qué lo alivia?','Reposo, calor, medicación…')}
    ${q('Evolución',null,['En mejoría','Igual','Empeorando','Fluctuante'])}
    ${q('¿Cómo le afecta su día a día?','Limitaciones funcionales concretas')}
  </div>`;
}

/* ---------- DERMATO (pestaña + valoración) ---------- */
function dermatoValoracion(p){
  const d=p.derma_datos||{};
  const card=(t,ico,rows)=>`<div class="vcard"><div class="vt"><div class="ico">${ic(ico,'sm')}</div><div class="t">${t}</div></div>
    <div style="display:flex;flex-direction:column;gap:11px">${rows.map(r=>`<div style="display:flex;justify-content:space-between;align-items:center"><span class="muted" style="font-size:13px;font-weight:600">${r[0]}</span><span style="font-weight:700;font-size:13.5px;color:${r[2]||'var(--ink)'}">${r[1]}</span></div>`).join('')}</div></div>`;
  return `<div class="screen">${statusbar()}
    <div class="scroll">
      <div class="topnav"><button class="back" data-go="expediente" data-pid="${p.id}">${ic('back')}</button><div class="ttl">${p.nombre}<small>Valoración dermatofuncional</small></div></div>
      <div class="vh"><div class="h1" style="font-size:24px">Valoración · día ${d.dias||14} post-op</div><div class="sub" style="margin-top:3px">${d.procedimiento||''} · ${d.cirujano||''}</div></div>
      <div style="height:12px"></div>
      <div class="vcard"><div class="vt"><div class="ico">${ic('activity','sm')}</div><div class="t">Molestia (EVA)</div><span class="badge done">Evaluado</span></div>
        <div class="eva-top"><div class="n">${p.eva}</div><div class="d">/ 10</div><div class="tag" style="color:var(--derma);background:var(--derma-bg)">Leve</div></div>
        <div class="evabar"><div class="pin" style="left:${p.eva*10}%"></div></div></div>
      ${card('Post-quirúrgico','droplet',[['Autorización del cirujano',d.autorizacion||'Pendiente','var(--ok)'],['Fototipo',d.fototipo||'—'],['Edema (godet)',d.edema||'—','var(--warn)'],['Fibrosis (PANFIC)',d.fibrosis||'—'],['Cicatriz',d.cicatriz||'—']])}
      ${card('Plan estético','sparkles',[['Fase','F1 · desinflamatoria','var(--derma)'],['Equipos',(d.equipos||[]).join(' · ')]])}
      <div class="vcard"><div class="vt"><div class="ico">${ic('image','sm')}</div><div class="t">Fotos antes / después</div></div>
        <div class="row-g"><div style="flex:1;aspect-ratio:3/4;border-radius:12px;background:linear-gradient(135deg,#F7EBF2,#efe3ea);display:grid;place-items:center;color:var(--derma)">${ic('cam','lg')}</div><div style="flex:1;aspect-ratio:3/4;border-radius:12px;background:#F4F6F9;display:grid;place-items:center;color:var(--ink3);font-size:12px;font-weight:600;text-align:center">Captura<br>de hoy</div></div></div>
      <div class="scroll-pad" style="height:24px"></div>
    </div></div>`;
}
SCREENS.dermato = dermatoValoracion;

/* ---------- Pantallas secundarias (navegables, estilizadas) ---------- */
function simpleList(title, sub, items, back){
  return `<div class="screen">${statusbar()}
    <div class="scroll">
      <div class="topnav"><button class="back" data-go="${back||'expediente'}" ${state.pid?'data-pid="'+state.pid+'"':''}>${ic('back')}</button><div class="ttl">${title}<small>${sub||''}</small></div></div>
      ${items}
      <div class="scroll-pad" style="height:24px"></div>
    </div></div>`;
}
SCREENS.ejercicios = (p)=> simpleList('Ejercicios en casa', (p.ejercicios?p.ejercicios.length:0)+' asignados',
  `<div class="card" style="padding:0;overflow:hidden">${(p.ejercicios||[]).map(e=>`<div class="appt" style="cursor:default"><div class="pt-av" style="width:44px;height:44px;border-radius:12px;background:var(--accent-bg);color:var(--accent)">${ic('bolt')}</div><div class="body"><div class="nm">${e.n}</div><div class="meta"><span class="chip">${e.dosis}</span></div></div><div class="right">${ic('play','sm')}</div></div>`).join('')}</div>
   <div class="pad20"><button class="btn btn-primary mt8">${ic('share','sm')} Enviar rutina por WhatsApp</button></div>`);
SCREENS.estudios = (p)=> simpleList('Estudios y documentos',(p.estudios?p.estudios.length:0)+' archivos',
  `<div class="pad20"><div class="row-g" style="flex-wrap:wrap;margin-bottom:14px">${['cam|Foto','image|Galería','file|Escanear','file|Archivo','activity|Link','droplet|Receta'].map(x=>`<button class="mod" style="flex:1;min-width:30%;align-items:center;text-align:center"><div class="ico" style="margin:0 auto">${ic(x.split('|')[0])}</div><div class="nm" style="font-size:12px">${x.split('|')[1]}</div></button>`).join('')}</div></div>
   <div class="card" style="padding:0;overflow:hidden">${(p.estudios||[]).map(e=>`<div class="appt" style="cursor:default"><div class="pt-av" style="width:44px;height:44px;border-radius:12px;background:var(--accent-bg);color:var(--accent)">${ic('file')}</div><div class="body"><div class="nm">${e.t}</div><div class="meta"><span class="chip">${e.fecha}</span></div></div></div>`).join('')}</div>`);
SCREENS.biomecanica = (p)=> simpleList('Biomecánica','Goniometría · mediciones',
  `<div class="card pad"><div class="sec-head" style="padding:0 0 10px"><div class="t">Mediciones</div><button class="a" data-act="importrom">${ic('cam','sm')} Medir</button></div>
    ${(p.biomecanica||[]).map(m=>`<div class="fz-row"><div class="nm"><span>${m.etq}</span><span class="def ref">${m.grado}° / ${m.ref}°</span></div><div class="fz-track"><div class="fz-fill v" style="width:${Math.round(m.grado/m.ref*100)}%"></div></div></div>`).join('')}
   </div><div class="pad20"><button class="btn btn-ghost">${ic('chart','sm')} Comparar antes / después</button></div>`);
SCREENS.protocolos = (p)=> {
  if(state.pid && state.from!=='tab') return simpleList('Protocolo', (p.protocolo?p.protocolo.nombre:'Sugerencia'),
    `<div class="card pad"><div class="eyebrow">Plan sugerido</div><div class="h3 mt8">${p.protocolo?p.protocolo.nombre:'Rotuliano HSR'}</div><div class="sub mt8">${p.protocolo?p.protocolo.frase:''}</div>
      <div class="seg mt16">${['M1','M2','M3','M4','M5'].map(f=>`<button class="o${(p.protocolo&&p.protocolo.fase===f)?' on':''}">${f}</button>`).join('')}</div>
      <div class="safe-banner ok" style="margin:16px 0 0">${ic('check','sm')}Carga = motor · agentes físicos coadyuvantes</div></div>
     <div class="pad20"><button class="btn btn-primary">${ic('file','sm')} PDF del protocolo</button><button class="btn btn-ghost mt12" data-go="ejercicios" data-pid="${p.id}">${ic('bolt','sm')} Generar rutina del paciente</button></div>`,'expediente');
  // modo biblioteca (tab)
  return `<div class="screen">${statusbar()}<div class="scroll">
    <div class="appbar"><div><div class="date">Biblioteca clínica</div><div class="h1">Protocolos</div></div><div class="avatar">${D.user.inicial}</div></div>
    <div class="pad20"><div class="ifield" style="height:50px;margin-bottom:14px"><span class="lead">${ic('search')}</span><span class="sep"></span><input placeholder="Buscar lesión, región o técnica"></div></div>
    ${[['Ortopedia y trauma','13 áreas · rodilla, hombro, columna…','bone'],['Agentes físicos','Indicaciones y contraindicaciones','bolt'],['Guía del medidor','Cómo se hace cada prueba','cam'],['Dermatofuncional','Post-op, edema, fibrosis, cicatriz','droplet']].map(x=>`<button class="card" style="width:calc(100% - 40px);display:flex;gap:14px;align-items:center;padding:16px 18px;border:0;text-align:left"><div class="pt-av" style="width:44px;height:44px;border-radius:13px;background:var(--accent-bg);color:var(--accent)">${ic(x[2])}</div><div style="flex:1"><div class="nm" style="font-weight:700">${x[0]}</div><div class="d muted" style="font-size:12.5px;margin-top:2px">${x[1]}</div></div>${ic('cr','sm')}</button>`).join('')}
    <div class="scroll-pad"></div></div>${tabbar('protocolos')}</div>`;
};
SCREENS.supervision = ()=> {
  const bar=(v,risk)=>`<div class="fz-track" style="height:7px"><div class="fz-fill ${risk?'lo':'v'}" style="width:${v}%"></div></div>`;
  return `<div class="screen">${statusbar()}<div class="scroll">
    <div class="appbar"><div><div class="date">Equipo · esta semana</div><div class="h1">Supervisión</div></div><div class="avatar">${D.user.inicial}</div></div>
    <div class="hero" style="background:linear-gradient(140deg,#122950,#1B3A6B)"><div class="lbl">Cobertura de documentación</div><div class="big">88<small>% promedio</small></div>
      <div class="hero-row"><div class="hero-stat"><div class="n">214</div><div class="t">Notas</div></div><div class="hero-stat"><div class="n gold">15</div><div class="t">Sin documentar</div></div><div class="hero-stat"><div class="n">5</div><div class="t">Terapeutas</div></div></div></div>
    <div class="sec-head"><div class="t">Por terapeuta</div><button class="a">${ic('share','sm')} PDF de todos</button></div>
    ${D.rendimiento.map(r=>`<div class="card pad" style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><div style="display:flex;align-items:center;gap:10px"><div class="ini ${r.t[0].toLowerCase()}" style="width:28px;height:28px">${r.t[0]}</div><b style="font-size:15px">${r.t}</b></div><span class="delta ${r.cob>=90?'up':'gold'}">${r.cob}% cobertura</span></div>
      <div style="display:flex;gap:16px"><div style="flex:1"><div class="mm" style="background:transparent;padding:0"><div class="ml">Cobertura</div>${bar(r.cob)}</div></div><div style="flex:1"><div class="mm" style="background:transparent;padding:0"><div class="ml">Calidad</div>${bar(r.cal)}</div></div></div>
      ${r.sinDoc?`<div class="muted" style="font-size:12px;font-weight:600;margin-top:8px;color:var(--warn)">${r.sinDoc} sesiones sin documentar</div>`:''}</div>`).join('')}
    <div class="scroll-pad"></div></div>${tabbar('supervision')}</div>`;
};
SCREENS.config = ()=> `<div class="screen">${statusbar()}<div class="scroll">
  <div class="topnav"><button class="back" data-go="agenda">${ic('back')}</button><div class="ttl">Configuración y perfil</div></div>
  <div class="pt-head"><div class="top"><div class="pt-av">${D.user.inicial}</div><div><h2>Carlos</h2><div class="line"><span class="m">Supervisor</span></div></div></div></div>
  ${['user|Mi perfil','bell|Notificaciones','refresh|Sincronización','shield|Seguridad y sesión','settings|Preferencias'].map(x=>`<button class="card" style="width:calc(100% - 40px);display:flex;gap:12px;align-items:center;padding:15px 18px;border:0;text-align:left;margin-bottom:10px"><div class="pt-av" style="width:38px;height:38px;border-radius:11px;background:var(--accent-bg);color:var(--accent)">${ic(x.split('|')[0],'sm')}</div><div class="nm" style="flex:1;font-weight:600">${x.split('|')[1]}</div>${ic('cr','sm')}</button>`).join('')}
  <div class="pad20"><button class="btn btn-ghost" style="color:var(--risk);border-color:var(--risk)" data-go="login">Cerrar sesión</button></div>
  <div class="center muted" style="font-size:12px;margin-top:14px">${D.version}</div><div class="scroll-pad"></div></div></div>`;
SCREENS.motivo = (p)=> simpleList('Motivo de consulta','Entrevista guiada', `<div style="padding-top:6px">${motivoGuiado()}</div>`);

/* =======================================================
   INTERACCIONES (post-render)
   ======================================================= */
const AFTER={};
AFTER.splash = ()=> setTimeout(()=>go('agenda'), 1700);
AFTER.soap = ()=> setupSoapNav();
function setupSoapNav(){
  const sc=document.getElementById('soap-scroll'); if(!sc) return;
  const secs=['S','O','A','P'].map(k=>document.getElementById('soap-'+k));
  sc.addEventListener('scroll',()=>{
    let cur='S'; const top=sc.scrollTop+120;
    secs.forEach(s=>{ if(s&&s.offsetTop<=top) cur=s.id.slice(5); });
    if(cur!==state.soapTab){ state.soapTab=cur; document.querySelectorAll('.qnav .q').forEach(q=>q.classList.toggle('on',q.dataset.soap===cur)); }
  });
}
/* fuerza sheet */
function fuerzaSheet(){
  const mus={Rodilla:['Cuádriceps','Isquiotibiales','Glúteo medio'],Hombro:['Deltoides','Manguito rotador','Trapecio'],Cadera:['Glúteo mayor','Psoas','Aductores'],Tobillo:['Tríceps sural','Tibial anterior','Peroneos']};
  sheet(`<h3>Fuerza Sinergia 0–10</h3><div class="sh-sub">Escala clínica comparativa (10 = lado sano). No usa Daniels ni dinamómetro.</div>
    <div class="ff"><label>Región</label><div class="chips" id="fz-reg">${Object.keys(mus).map((r,k)=>`<button class="chsel${k===0?' on':''}" data-reg="${r}">${r}</button>`).join('')}</div></div>
    <div class="ff"><label>Músculo</label><div class="chips" id="fz-mus">${mus.Rodilla.map((m,k)=>`<button class="chsel${k===0?' on':''}">${m}</button>`).join('')}</div></div>
    <div class="ff"><label>Valor (0–10)</label><div class="eva-pick">${[0,1,2,3,4,5,6,7,8,9,10].map(n=>`<button class="n${n===7?' on':''}" style="${n===7?'background:var(--accent)':''}" data-val="${n}">${n}</button>`).join('')}</div></div>
    <div class="ff"><label>Lado</label><div class="seg"><button class="o on">Derecho</button><button class="o">Izquierdo</button></div></div>
    <button class="btn btn-primary" data-act="fz-reg-ok">${ic('check','sm')} Registrar</button>`);
  const reg=document.getElementById('fz-reg'), musBox=document.getElementById('fz-mus');
  reg.addEventListener('click',e=>{const b=e.target.closest('[data-reg]'); if(!b)return; reg.querySelectorAll('.chsel').forEach(x=>x.classList.remove('on')); b.classList.add('on'); musBox.innerHTML=mus[b.dataset.reg].map((m,k)=>`<button class="chsel${k===0?' on':''}">${m}</button>`).join(''); bindChipGroup(musBox);});
  bindChipGroup(musBox);
}
function romSheet(){
  const p=D.pById(state.pid);
  sheet(`<h3>Importar medición ROM</h3><div class="sh-sub">Elige una medición ya validada para traerla a la nota. Las pendientes no se pueden comparar.</div>
    ${(p.biomecanica||[]).map(m=>`<button class="card" style="width:100%;margin:0 0 10px;display:flex;gap:12px;align-items:center;padding:14px;border:0;text-align:left" data-act="rom-ok"><div class="pt-av" style="width:40px;height:40px;border-radius:11px;background:var(--accent-bg);color:var(--accent)">${ic('ruler')}</div><div style="flex:1"><div class="nm" style="font-weight:700">${m.etq}</div><div class="d muted" style="font-size:12px">${m.grado}° · ${m.fecha} · cámara 2D</div></div>${ic('plus','sm')}</button>`).join('')}
    <button class="btn btn-ghost" data-act="rom-medir">${ic('cam','sm')} Medir ahora con la cámara</button>`);
}
function bindChipGroup(box){ box.addEventListener('click',e=>{const b=e.target.closest('.chsel'); if(!b)return; box.querySelectorAll('.chsel').forEach(x=>x.classList.remove('on')); b.classList.add('on');}); }

/* guardar (estado honesto: borrador NO se limpia hasta confirmar) */
function doGuardar(){
  if(state.saveState==='saving') return;
  state.saveState='saving'; refreshSave();
  setTimeout(()=>{ state.saveState='saved'; refreshSave(); toast('Nota guardada y confirmada en la nube','ok','check');
    setTimeout(()=>{ state.saveState='draft'; },2500); }, 1100);
}
function refreshSave(){ const el=document.getElementById('savestate'); if(el){ el.className='state2 '+state.saveState; el.textContent=saveLabel(); } }

/* =======================================================
   Delegación de eventos
   ======================================================= */
document.addEventListener('click', e=>{
  const g=e.target.closest('[data-go]');
  if(g){ state.from=state.screen; go(g.dataset.go, g.dataset.pid); return; }
  const soap=e.target.closest('[data-soap]');
  if(soap){ state.soapTab=soap.dataset.soap; const sec=document.getElementById('soap-'+soap.dataset.soap); const sc=document.getElementById('soap-scroll'); if(sec&&sc) sc.scrollTo({top:sec.offsetTop-12,behavior:'smooth'}); document.querySelectorAll('.qnav .q').forEach(q=>q.classList.toggle('on',q===soap)); return; }
  const step=e.target.closest('[data-step]');
  if(step){ state.altaStep=+step.dataset.step; go('alta'); return; }
  const pill=e.target.closest('.pill');
  if(pill && !pill.dataset.act){ pill.classList.toggle('on'); return; }
  const chsel=e.target.closest('.chsel');
  if(chsel && chsel.parentElement && !chsel.closest('#fz-reg,#fz-mus')){ /* alta chips: multi excepto segment */ chsel.classList.toggle('on'); return; }
  const o=e.target.closest('.seg .o');
  if(o){ o.parentElement.querySelectorAll('.o').forEach(x=>x.classList.remove('on')); o.classList.add('on'); return; }
  const evn=e.target.closest('.eva-pick .n');
  if(evn){ evn.parentElement.querySelectorAll('.n').forEach(x=>{x.classList.remove('on');x.style.background='';}); evn.classList.add('on'); evn.style.background='var(--accent)'; return; }
  const a=e.target.closest('[data-act]'); if(!a) return;
  const act=a.dataset.act;
  if(act==='entrar'){ go('splash'); }
  else if(act==='recup'){ toast('Enlace enviado a tu correo','ok','send'); setTimeout(()=>go('login'),900); }
  else if(act==='eye'){ const inp=a.previousElementSibling; if(inp&&inp.tagName==='INPUT') inp.type=inp.type==='password'?'text':'password'; }
  else if(act==='guardar'){ doGuardar(); }
  else if(act==='nuevomotivo'){ state.nuevoMotivo=true; go('soap'); toast('Nuevo episodio · Sesión 1 · pendiente de guardar','warn','plus2'); }
  else if(act==='dictar'){ toast('Dictado por voz (demo)','', 'mic'); }
  else if(act==='ultima'){ toast('Mostrando última sesión (demo)','','clock'); }
  else if(act==='fuerza'){ fuerzaSheet(); }
  else if(act==='importrom'){ romSheet(); }
  else if(act==='fz-reg-ok'){ closeSheet(); toast('Fuerza registrada en la O · 7/10 derecho','ok','check'); }
  else if(act==='rom-ok'){ closeSheet(); toast('Medición importada a la nota','ok','ruler'); }
  else if(act==='rom-medir'){ closeSheet(); toast('Abriendo medidor de cámara (demo)','','cam'); }
  else if(act==='totop'){ const sc=document.getElementById('soap-scroll'); if(sc) sc.scrollTo({top:0,behavior:'smooth'}); }
  else if(act==='altaprev'){ state.altaStep=Math.max(0,state.altaStep-1); go('alta'); }
  else if(act==='altanext'){ state.altaStep=Math.min(ALTA_STEPS.length-1,state.altaStep+1); go('alta'); document.getElementById('alta-scroll').scrollTop=0; }
  else if(act==='altasave'){ toast('Expediente guardado y subido a la nube','ok','check'); setTimeout(()=>{state.altaStep=0;go('agenda');},1200); }
});
/* placeholder visible en contenteditable vacío */
document.addEventListener('input', e=>{ const f=e.target; if(f.hasAttribute&&f.hasAttribute('contenteditable')){ f.classList.toggle('ph', !f.textContent.trim()); if(f.textContent.trim()){ const card=f.closest('.field'); if(card) card.classList.add('filled'); } } });

/* arranque */
go('login');
})();
