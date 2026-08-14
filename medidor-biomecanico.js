// ============================================================================
// MÓDULO BIOMECÁNICO — Fase 1: Rangos articulares (ROM) en vivo y por video
// ----------------------------------------------------------------------------
// - Motor: MediaPipe Pose (BlazePose, 33 puntos) cargado desde CDN bajo demanda.
// - Dos modos de entrada que comparten el MISMO cálculo de ángulos y el MISMO
//   guardado: (A) cámara frontal en vivo, (B) subir un video y analizarlo cuadro
//   por cuadro.
// - Ángulos MEDIDOS internamente como ángulo interior 3D (0–180°). Lo VISIBLE
//   (pantalla + PDF) se muestra en convención goniométrica clínica (0° neutro).
// - Guardado: p.biomecanica[], mismo molde que guardarSOAP (push → saveDB →
//   renderExpediente). NO toca SOAP, scanner, consentimiento, sync ni Storage
//   existentes. Todo vive aquí; index.html solo gana el punto de entrada.
// ============================================================================
(function(){
  'use strict';

  // ── Configuración de articulaciones ──────────────────────────────────────
  // pts = [extremo, VÉRTICE, extremo] en índices de landmarks MediaPipe Pose.
  // art = tipo de articulación → define la conversión a convención clínica.
  var ARTIC = [
    { key:'codoIzq',    grupo:'Codo',    lado:'Izq', art:'codo',    pts:[11,13,15] },
    { key:'codoDer',    grupo:'Codo',    lado:'Der', art:'codo',    pts:[12,14,16] },
    { key:'hombroIzq',  grupo:'Hombro',  lado:'Izq', art:'hombro',  pts:[23,11,13] },
    { key:'hombroDer',  grupo:'Hombro',  lado:'Der', art:'hombro',  pts:[24,12,14] },
    { key:'caderaIzq',  grupo:'Cadera',  lado:'Izq', art:'cadera',  pts:[11,23,25] },
    { key:'caderaDer',  grupo:'Cadera',  lado:'Der', art:'cadera',  pts:[12,24,26] },
    { key:'rodillaIzq', grupo:'Rodilla', lado:'Izq', art:'rodilla', pts:[23,25,27] },
    { key:'rodillaDer', grupo:'Rodilla', lado:'Der', art:'rodilla', pts:[24,26,28] }
  ];
  var GRUPOS = ['Codo','Hombro','Cadera','Rodilla'];

  // Segmentos a dibujar (esqueleto simple: torso + brazos + piernas).
  var CONEXIONES = [
    [11,12],[11,23],[12,24],[23,24],   // torso
    [11,13],[13,15],                   // brazo izq
    [12,14],[14,16],                   // brazo der
    [23,25],[25,27],                   // pierna izq
    [24,26],[26,28]                    // pierna der
  ];
  var PUNTOS_CLAVE = [11,12,13,14,15,16,23,24,25,26,27,28];

  var VIS_MIN = 0.5;          // visibilidad mínima por punto para contar el ángulo
  var FPS_CAMARA = 20;        // throttle de muestreo en vivo
  var FPS_VIDEO = 12;         // muestreo al analizar un archivo

  // CDN de MediaPipe Pose (rango semver 0.5.x — jsdelivr resuelve el último parche).
  var MP_BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5';

  // ── Estado del módulo ─────────────────────────────────────────────────────
  var BIO = {
    pose:null, ready:false, cargando:false,
    modo:null,               // 'camara' | 'video'
    stream:null,             // MediaStream de la cámara (modo A)
    video:null,              // <video> fuente (cámara o archivo)
    canvas:null, ctx:null,   // canvas de dibujo activo
    srcEl:null,              // elemento fuente que se dibuja
    recording:false,         // grabando en vivo
    procesandoVideo:false,   // analizando archivo
    cancelVideo:false,
    acc:null,                // acumulador de mín/máx
    framesTotales:0,
    tStart:0,                // Date.now() al iniciar grabación
    rafId:null, timerId:null, sending:false
  };

  // ── Utilidades ─────────────────────────────────────────────────────────────
  function esc(v){ return String(v==null?'':v).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function toast(m,t){ if(typeof showToast==='function') showToast(m,t||''); else console.log('[BIO]',m); }
  function usuarioActual(){ return (typeof currentUser!=='undefined' && currentUser && currentUser.name) ? currentUser.name : ''; }
  function fechaHoy(){ return (typeof todayFmt==='function') ? todayFmt() : new Date().toLocaleDateString('es-MX',{day:'2-digit',month:'2-digit',year:'numeric'}); }
  function horaAhora(){ return new Date().toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'}); }

  // ── Carga de MediaPipe Pose bajo demanda ──────────────────────────────────
  function ensureMediaPipeReady(){
    if(BIO.ready && BIO.pose) return Promise.resolve(true);
    if(BIO._readyPromise) return BIO._readyPromise;
    BIO.cargando = true;
    BIO._readyPromise = new Promise(function(resolve){
      var timeout = setTimeout(function(){ resolve(false); }, 30000); // ~5–10MB en la 1ª carga
      function crearPose(){
        try{
          if(typeof Pose === 'undefined'){ clearTimeout(timeout); resolve(false); return; }
          var pose = new Pose({ locateFile:function(f){ return MP_BASE + '/' + f; } });
          pose.setOptions({
            modelComplexity:1, smoothLandmarks:true, enableSegmentation:false,
            minDetectionConfidence:0.5, minTrackingConfidence:0.5
          });
          pose.onResults(onResults);
          BIO.pose = pose; BIO.ready = true; BIO.cargando = false;
          clearTimeout(timeout); resolve(true);
        }catch(e){ clearTimeout(timeout); console.warn('[BIO] Pose init falló:', e && e.message); resolve(false); }
      }
      if(typeof Pose !== 'undefined'){ crearPose(); return; }
      var s = document.createElement('script');
      s.src = MP_BASE + '/pose.js'; s.async = true; s.crossOrigin = 'anonymous';
      s.onload = crearPose;
      s.onerror = function(){ clearTimeout(timeout); console.warn('[BIO] No se pudo cargar pose.js'); resolve(false); };
      document.head.appendChild(s);
    });
    return BIO._readyPromise;
  }

  // ── Matemática de ángulos ──────────────────────────────────────────────────
  // Ángulo interior 3D (grados) en el vértice b, usando landmarks del mundo (métricos).
  function angulo3D(a,b,c){
    var v1x=a.x-b.x, v1y=a.y-b.y, v1z=(a.z||0)-(b.z||0);
    var v2x=c.x-b.x, v2y=c.y-b.y, v2z=(c.z||0)-(b.z||0);
    var dot=v1x*v2x+v1y*v2y+v1z*v2z;
    var m1=Math.sqrt(v1x*v1x+v1y*v1y+v1z*v1z), m2=Math.sqrt(v2x*v2x+v2y*v2y+v2z*v2z);
    if(m1===0||m2===0) return 0;
    var cos=dot/(m1*m2); if(cos>1) cos=1; if(cos<-1) cos=-1;
    return Math.acos(cos)*180/Math.PI;
  }
  // Interior (0–180) → convención clínica (0° neutro).
  //  Codo / Rodilla / Cadera: flexión = 180 − interior (0° extendido → máx flexionado).
  //  Hombro: flexión/abducción ≈ interior directo (0° brazo al costado → 180° arriba).
  function aClinico(art, interior){
    var v = (art==='hombro') ? interior : (180 - interior);
    return v < 0 ? 0 : v;
  }
  // Calcula los ángulos clínicos de todas las articulaciones para un frame.
  function calcularAngulos(world, lm){
    var out = { _algunoValido:false };
    for(var i=0;i<ARTIC.length;i++){
      var j=ARTIC[i], p1=j.pts[0], p2=j.pts[1], p3=j.pts[2];
      var okVis = lm && lm[p1] && lm[p2] && lm[p3]
        && (lm[p1].visibility==null || lm[p1].visibility>=VIS_MIN)
        && (lm[p2].visibility==null || lm[p2].visibility>=VIS_MIN)
        && (lm[p3].visibility==null || lm[p3].visibility>=VIS_MIN);
      if(okVis && world && world[p1] && world[p2] && world[p3]){
        var interior = angulo3D(world[p1], world[p2], world[p3]);
        out[j.key] = { val: aClinico(j.art, interior), ok:true };
        out._algunoValido = true;
      } else {
        out[j.key] = { val:null, ok:false };
      }
    }
    return out;
  }

  // ── Acumulador de mín/máx ──────────────────────────────────────────────────
  function nuevoAcumulador(){
    var a = { framesValidos:0 };
    ARTIC.forEach(function(j){ a[j.key] = { min:null, max:null, muestras:0 }; });
    return a;
  }
  function acumular(acc, ang){
    if(!acc || !ang) return;
    var alguno=false;
    for(var i=0;i<ARTIC.length;i++){
      var k=ARTIC[i].key, r=ang[k];
      if(r && r.ok){
        alguno=true;
        var s=acc[k];
        if(s.min===null || r.val<s.min) s.min=r.val;
        if(s.max===null || r.val>s.max) s.max=r.val;
        s.muestras++;
      }
    }
    if(alguno) acc.framesValidos++;
  }
  function finalizarArticulaciones(acc){
    var out={};
    ARTIC.forEach(function(j){
      var s=acc[j.key];
      if(s && s.muestras>0 && s.min!==null){
        out[j.key] = { min:Math.round(s.min), max:Math.round(s.max), rango:Math.round(s.max-s.min), muestras:s.muestras };
      } else {
        out[j.key] = { min:null, max:null, rango:null, muestras:0 };
      }
    });
    return out;
  }

  // ── Callback único de resultados de MediaPipe ──────────────────────────────
  function onResults(res){
    var lm = res && res.poseLandmarks;
    var world = res && res.poseWorldLandmarks;
    var ang = (lm && world) ? calcularAngulos(world, lm) : null;
    if(ang && (BIO.recording || BIO.procesandoVideo)) acumular(BIO.acc, ang);
    if(BIO.canvas && BIO.srcEl) dibujar(lm, ang);
    if(BIO.modo==='camara'){ actualizarPanelVivo(ang); actualizarGateGrabacion(lm); }
  }

  // ── Dibujo del esqueleto + ángulos sobre el canvas activo ──────────────────
  function dibujar(lm, ang){
    var cv=BIO.canvas, ctx=BIO.ctx, src=BIO.srcEl;
    if(!cv || !ctx || !src) return;
    var vw = src.videoWidth || src.naturalWidth || 0;
    var vh = src.videoHeight || src.naturalHeight || 0;
    if(!vw || !vh) return;
    var cap = 720, escala = vw>cap ? cap/vw : 1;
    var w = Math.round(vw*escala), h = Math.round(vh*escala);
    if(cv.width!==w || cv.height!==h){ cv.width=w; cv.height=h; }
    try{ ctx.drawImage(src, 0, 0, w, h); }catch(e){ return; }
    if(!lm) return;
    // conexiones
    ctx.lineWidth = Math.max(2, Math.round(w*0.006));
    ctx.strokeStyle = 'rgba(61,220,151,.9)';
    CONEXIONES.forEach(function(par){
      var a=lm[par[0]], b=lm[par[1]];
      if(!a || !b) return;
      if((a.visibility!=null && a.visibility<VIS_MIN) || (b.visibility!=null && b.visibility<VIS_MIN)) return;
      ctx.beginPath(); ctx.moveTo(a.x*w, a.y*h); ctx.lineTo(b.x*w, b.y*h); ctx.stroke();
    });
    // puntos
    ctx.fillStyle = '#C9A84C';
    PUNTOS_CLAVE.forEach(function(idx){
      var p=lm[idx]; if(!p) return;
      if(p.visibility!=null && p.visibility<VIS_MIN) return;
      ctx.beginPath(); ctx.arc(p.x*w, p.y*h, Math.max(3, Math.round(w*0.008)), 0, Math.PI*2); ctx.fill();
    });
    // etiqueta del ángulo clínico en cada vértice
    if(ang){
      ctx.font = 'bold '+Math.max(11, Math.round(w*0.026))+'px -apple-system,Arial';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ARTIC.forEach(function(j){
        var r=ang[j.key]; if(!r || !r.ok) return;
        var vtx=lm[j.pts[1]]; if(!vtx) return;
        var tx=vtx.x*w, ty=vtx.y*h, txt=Math.round(r.val)+'°';
        var pad=Math.round(w*0.012), tw=ctx.measureText(txt).width;
        ctx.fillStyle='rgba(18,41,80,.82)';
        ctx.fillRect(tx-tw/2-pad, ty-Math.round(w*0.022), tw+pad*2, Math.round(w*0.044));
        ctx.fillStyle='#fff'; ctx.fillText(txt, tx, ty);
      });
    }
  }

  // ── Overlay (se construye una vez y se reutiliza) ──────────────────────────
  function inyectarEstilos(){
    if(document.getElementById('bio-estilos')) return;
    var st=document.createElement('style'); st.id='bio-estilos';
    st.textContent = [
      '#bio-overlay{position:fixed;inset:0;z-index:12000;background:#0d1626;display:none;flex-direction:column;color:#fff;font-family:-apple-system,BlinkMacSystemFont,Arial,sans-serif}',
      '#bio-overlay .bio-top{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#122950;flex-shrink:0}',
      '#bio-overlay .bio-top b{font-size:16px}',
      '#bio-overlay .bio-x{background:none;border:none;color:#9BA3B5;font-size:26px;cursor:pointer;line-height:1}',
      '.bio-vista{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;display:none;flex-direction:column}',
      '.bio-vista.on{display:flex}',
      '.bio-inicio{align-items:center;justify-content:center;gap:16px;padding:28px 22px;text-align:center}',
      '.bio-inicio p{color:#9BA3B5;font-size:14px;max-width:340px;line-height:1.5}',
      '.bio-modo-btn{width:100%;max-width:360px;border:none;border-radius:16px;padding:20px;font-size:17px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px}',
      '.bio-modo-cam{background:#C9A84C;color:#122950}',
      '.bio-modo-vid{background:rgba(255,255,255,.1);color:#fff;border:1.5px solid rgba(255,255,255,.25)}',
      '.bio-canvas-wrap{position:relative;width:100%;background:#000;display:flex;align-items:center;justify-content:center}',
      '#bio-canvas,#bio-canvas-vid{width:100%;max-height:56vh;object-fit:contain;display:block}',
      '.bio-estado{padding:8px 16px;font-size:13px;font-weight:600;text-align:center;background:#0d1626;color:#E8C96A}',
      '.bio-panel{margin:8px 12px;background:rgba(255,255,255,.06);border-radius:12px;padding:8px 10px}',
      '.bio-panel table{width:100%;border-collapse:collapse;font-size:13px}',
      '.bio-panel th{color:#9BA3B5;font-weight:700;text-align:left;padding:4px 6px;font-size:11px;text-transform:uppercase;letter-spacing:.5px}',
      '.bio-panel td{padding:5px 6px;border-top:1px solid rgba(255,255,255,.08);font-variant-numeric:tabular-nums}',
      '.bio-panel td.g{color:#fff;font-weight:700}',
      '.bio-panel td.v{color:#3DDC97;font-weight:700;text-align:right}',
      '.bio-cron{font-size:15px;font-weight:800;color:#E8C96A;text-align:center;padding:2px}',
      '.bio-acciones{display:flex;gap:8px;padding:10px 12px 16px;flex-wrap:wrap}',
      '.bio-acciones button{flex:1;min-width:120px;border:none;border-radius:14px;padding:13px;font-size:15px;font-weight:800;cursor:pointer}',
      '.bio-b-rec{background:#C0392B;color:#fff}',
      '.bio-b-stop{background:#122950;color:#fff;border:1.5px solid #E8C96A!important}',
      '.bio-b-save{background:#2E7D52;color:#fff}',
      '.bio-b-sec{background:rgba(255,255,255,.1);color:#fff;border:1.5px solid rgba(255,255,255,.25)!important}',
      '.bio-b-rec:disabled{opacity:.45;cursor:default}',
      '.bio-prog-wrap{padding:30px 22px;align-items:center;justify-content:center;gap:16px;display:flex;flex-direction:column;flex:1}',
      '.bio-prog-bar{width:100%;max-width:360px;height:14px;background:rgba(255,255,255,.12);border-radius:8px;overflow:hidden}',
      '.bio-prog-fill{height:100%;width:0;background:#C9A84C;transition:width .15s}',
      '.bio-resumen{padding:14px}',
      '.bio-resumen h3{font-size:15px;margin:0 0 10px;color:#E8C96A}',
      '.bio-tabla-res{width:100%;border-collapse:collapse;font-size:14px;background:rgba(255,255,255,.05);border-radius:12px;overflow:hidden}',
      '.bio-tabla-res th{background:rgba(255,255,255,.08);color:#9BA3B5;font-size:11px;text-transform:uppercase;letter-spacing:.5px;padding:8px;text-align:left}',
      '.bio-tabla-res td{padding:9px 8px;border-top:1px solid rgba(255,255,255,.08);font-variant-numeric:tabular-nums}',
      '.bio-tabla-res td.g{font-weight:700}'
    ].join('\n');
    document.head.appendChild(st);
  }

  function construirOverlay(){
    if(document.getElementById('bio-overlay')) return;
    inyectarEstilos();
    var ov=document.createElement('div'); ov.id='bio-overlay';
    ov.innerHTML =
      '<div class="bio-top"><b>🦴 Medición biomecánica — ROM</b><button class="bio-x" id="bio-cerrar">×</button></div>'
      // Vista inicio: elección de modo
      + '<div class="bio-vista bio-inicio on" id="bio-vista-inicio">'
      +   '<div style="font-size:40px">🦴</div>'
      +   '<p>Mide los rangos articulares (codo, hombro, cadera y rodilla). Elige cómo capturar el movimiento.</p>'
      +   '<button class="bio-modo-btn bio-modo-cam" id="bio-go-cam">▶️ Cámara en vivo</button>'
      +   '<button class="bio-modo-btn bio-modo-vid" id="bio-go-vid">📁 Subir video</button>'
      +   '<input type="file" id="bio-file" accept="video/*" style="display:none">'
      + '</div>'
      // Vista cámara en vivo
      + '<div class="bio-vista" id="bio-vista-camara">'
      +   '<div class="bio-canvas-wrap"><canvas id="bio-canvas"></canvas></div>'
      +   '<div class="bio-estado" id="bio-estado">Iniciando cámara…</div>'
      +   '<div class="bio-cron" id="bio-cron" style="display:none">00:00</div>'
      +   '<div class="bio-panel" id="bio-panel-vivo"></div>'
      +   '<div class="bio-acciones">'
      +     '<button class="bio-b-sec" id="bio-btn-flip" style="flex:0 0 auto;min-width:auto;padding:13px 16px">🔄 Cámara</button>'
      +     '<button class="bio-b-rec" id="bio-btn-rec" disabled>⏺️ Grabar sesión</button>'
      +   '</div>'
      + '</div>'
      // Vista progreso (análisis de video)
      + '<div class="bio-vista bio-prog-wrap" id="bio-vista-progreso">'
      +   '<div style="font-size:15px;font-weight:700">Analizando video…</div>'
      +   '<canvas id="bio-canvas-vid" style="max-height:38vh"></canvas>'
      +   '<div class="bio-prog-bar"><div class="bio-prog-fill" id="bio-prog-fill"></div></div>'
      +   '<div id="bio-prog-txt" style="color:#9BA3B5;font-size:13px">0%</div>'
      +   '<button class="bio-modo-btn bio-modo-vid" id="bio-prog-cancel" style="max-width:200px;padding:12px">Cancelar</button>'
      + '</div>'
      // Vista resumen
      + '<div class="bio-vista bio-resumen" id="bio-vista-resumen"></div>';
    document.body.appendChild(ov);

    document.getElementById('bio-cerrar').addEventListener('click', cerrarMedidor);
    document.getElementById('bio-go-cam').addEventListener('click', iniciarCamara);
    document.getElementById('bio-go-vid').addEventListener('click', function(){ document.getElementById('bio-file').click(); });
    document.getElementById('bio-file').addEventListener('change', function(ev){
      var f = ev.target.files && ev.target.files[0]; ev.target.value='';
      if(f) procesarVideo(f);
    });
    document.getElementById('bio-btn-rec').addEventListener('click', toggleGrabacion);
    document.getElementById('bio-btn-flip').addEventListener('click', voltearCamara);
    document.getElementById('bio-prog-cancel').addEventListener('click', function(){ BIO.cancelVideo=true; });
  }

  function mostrarVista(id){
    ['bio-vista-inicio','bio-vista-camara','bio-vista-progreso','bio-vista-resumen'].forEach(function(v){
      var el=document.getElementById(v); if(el) el.classList.toggle('on', v===id);
    });
  }

  // ── Abrir / cerrar ─────────────────────────────────────────────────────────
  function abrirMedidorBiomecanico(){
    var pid = (typeof currentPatient!=='undefined' && currentPatient) ? currentPatient.id : null;
    if(!pid){ toast('Abre un expediente primero','warning'); return; }
    construirOverlay();
    resetEstado();
    mostrarVista('bio-vista-inicio');
    document.getElementById('bio-overlay').style.display='flex';
  }
  function resetEstado(){
    BIO.modo=null; BIO.recording=false; BIO.procesandoVideo=false; BIO.cancelVideo=false;
    BIO.acc=null; BIO.framesTotales=0; BIO.srcEl=null; BIO.sending=false;
    BIO.facing='environment';           // cada medición arranca con la cámara TRASERA
    detenerGrabadorVideo(); BIO.pendingVideo=null;
    detenerLoopCamara(); pararCronometro();
  }
  function cerrarMedidor(){
    BIO.cancelVideo=true;
    detenerGrabadorVideo(); BIO.pendingVideo=null;
    detenerCamaraStream(); detenerLoopCamara(); pararCronometro();
    BIO.recording=false; BIO.procesandoVideo=false; BIO.modo=null; BIO.srcEl=null;
    var ov=document.getElementById('bio-overlay'); if(ov) ov.style.display='none';
  }
  function detenerGrabadorVideo(){
    try{ if(BIO.recorder && BIO.recorder.state!=='inactive') BIO.recorder.stop(); }catch(e){}
    BIO.recorder=null; BIO.recChunks=null;
  }
  function detenerCamaraStream(){
    try{ if(BIO.stream){ BIO.stream.getTracks().forEach(function(t){ t.stop(); }); BIO.stream=null; } }catch(e){}
    if(BIO.video && BIO.video.srcObject){ BIO.video.srcObject=null; }
  }
  function detenerLoopCamara(){ if(BIO.rafId){ cancelAnimationFrame(BIO.rafId); BIO.rafId=null; } }

  // ── MODO A: cámara en vivo ─────────────────────────────────────────────────
  async function iniciarCamara(){
    BIO.modo='camara';
    BIO.facing = BIO.facing || 'environment';   // TRASERA por defecto (se apunta al paciente)
    mostrarVista('bio-vista-camara');
    BIO.canvas=document.getElementById('bio-canvas'); BIO.ctx=BIO.canvas.getContext('2d');
    pintarPanelVivo(null);
    var estado=document.getElementById('bio-estado');
    estado.textContent='Cargando modelo de pose…';
    var ok = await ensureMediaPipeReady();
    if(!ok){ estado.textContent='⚠️ No se pudo cargar el motor de pose. Revisa tu conexión e inténtalo de nuevo.'; return; }
    var camOk = await abrirStreamCamara(BIO.facing);
    if(!camOk) return;
    estado.textContent='Coloca al paciente de cuerpo completo en el encuadre';
    BIO.acc=null; BIO.framesTotales=0;
    loopCamara();
  }
  // Abre (o reabre) el stream con la cámara indicada. Reutiliza el <video> y el loop.
  async function abrirStreamCamara(facing){
    detenerCamaraStream();
    var estado=document.getElementById('bio-estado');
    try{
      BIO.stream = await navigator.mediaDevices.getUserMedia({
        video:{ facingMode:{ideal:facing}, width:{ideal:1280}, height:{ideal:720} }, audio:false
      });
    }catch(e){
      // Fallback: cualquier cámara disponible (iPads viejos o sin cámara trasera enumerable).
      try{ BIO.stream = await navigator.mediaDevices.getUserMedia({ video:true, audio:false }); }
      catch(e2){ if(estado) estado.textContent='⚠️ Permiso de cámara denegado o no disponible. Puedes usar "📁 Subir video".'; return false; }
    }
    var v = BIO.video || document.createElement('video');
    v.autoplay=true; v.muted=true; v.playsInline=true; v.setAttribute('playsinline','');
    v.srcObject=BIO.stream; BIO.video=v; BIO.srcEl=v;
    try{ await v.play(); }catch(_){}
    return true;
  }
  // Alterna trasera/frontal sin reiniciar el flujo (el loop sigue leyendo BIO.video).
  async function voltearCamara(){
    if(BIO.recording){ toast('Detén la grabación para cambiar de cámara','warning'); return; }
    BIO.facing = (BIO.facing==='environment') ? 'user' : 'environment';
    var estado=document.getElementById('bio-estado');
    if(estado) estado.textContent = (BIO.facing==='environment') ? 'Cámara trasera' : 'Cámara frontal';
    await abrirStreamCamara(BIO.facing);
  }
  function loopCamara(){
    var intervalo = 1000/FPS_CAMARA, last=0;
    function tick(ts){
      if(BIO.modo!=='camara'){ return; }
      BIO.rafId = requestAnimationFrame(tick);
      if(ts - last < intervalo) return;
      last = ts;
      if(BIO.sending || !BIO.pose || !BIO.video || BIO.video.videoWidth===0) return;
      BIO.sending = true;
      BIO.framesTotales++;
      BIO.pose.send({ image: BIO.video }).then(function(){ BIO.sending=false; }).catch(function(){ BIO.sending=false; });
    }
    BIO.rafId = requestAnimationFrame(tick);
  }
  function actualizarGateGrabacion(lm){
    if(BIO.recording) return;
    var btn=document.getElementById('bio-btn-rec'); if(!btn) return;
    var ok = lm && lm[11] && lm[12] && lm[23] && lm[24]
      && (lm[11].visibility==null||lm[11].visibility>=VIS_MIN)
      && (lm[12].visibility==null||lm[12].visibility>=VIS_MIN)
      && (lm[23].visibility==null||lm[23].visibility>=VIS_MIN)
      && (lm[24].visibility==null||lm[24].visibility>=VIS_MIN);
    btn.disabled = !ok;
    var estado=document.getElementById('bio-estado');
    if(estado) estado.textContent = ok ? '✓ Cuerpo detectado — listo para grabar' : 'Coloca al paciente de cuerpo completo en el encuadre';
  }
  // Inicia la grabación del clip de cámara (MediaRecorder) en paralelo a la medición de ángulos.
  function iniciarGrabadorVideo(){
    BIO.recChunks=[]; BIO.recorder=null; BIO.recMime='';
    try{
      if(typeof MediaRecorder==='undefined' || !BIO.stream) return;
      var cands=['video/mp4','video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'];
      var mime=''; for(var i=0;i<cands.length;i++){ if(MediaRecorder.isTypeSupported(cands[i])){ mime=cands[i]; break; } }
      BIO.recorder = mime ? new MediaRecorder(BIO.stream,{mimeType:mime}) : new MediaRecorder(BIO.stream);
      BIO.recMime = BIO.recorder.mimeType || mime || 'video/webm';
      BIO.recorder.ondataavailable = function(e){ if(e.data && e.data.size) BIO.recChunks.push(e.data); };
      BIO.recorder.start();
    }catch(e){ BIO.recorder=null; console.warn('[BIO] MediaRecorder no disponible (se guardarán solo ángulos):', e && e.message); }
  }
  // Detiene el grabador y arma el blob del clip (Promise).
  function finalizarGrabadorVideo(){
    return new Promise(function(resolve){
      if(!BIO.recorder || BIO.recorder.state==='inactive'){
        var chunks0=BIO.recChunks||[];
        resolve(chunks0.length ? { blob:new Blob(chunks0,{type:BIO.recMime||'video/webm'}), mime:BIO.recMime||'video/webm', ext:((BIO.recMime||'').indexOf('mp4')>=0?'mp4':'webm') } : null);
        BIO.recorder=null; return;
      }
      BIO.recorder.onstop=function(){
        var chunks=BIO.recChunks||[];
        resolve(chunks.length ? { blob:new Blob(chunks,{type:BIO.recMime||'video/webm'}), mime:BIO.recMime||'video/webm', ext:((BIO.recMime||'').indexOf('mp4')>=0?'mp4':'webm') } : null);
        BIO.recorder=null;
      };
      try{ BIO.recorder.stop(); }catch(e){ resolve(null); BIO.recorder=null; }
    });
  }
  async function toggleGrabacion(){
    var fb=document.getElementById('bio-btn-flip');
    if(!BIO.recording){
      BIO.acc = nuevoAcumulador(); BIO.framesTotales=0; BIO.tStart=Date.now();
      BIO.pendingVideo=null; iniciarGrabadorVideo();     // graba el clip de cámara en paralelo
      BIO.recording=true;
      if(fb) fb.disabled=true;                            // no cambiar de cámara a media grabación
      document.getElementById('bio-btn-rec').className='bio-b-stop'; document.getElementById('bio-btn-rec').textContent='⏹️ Detener';
      document.getElementById('bio-cron').style.display='block';
      iniciarCronometro();
    } else {
      BIO.recording=false; pararCronometro();
      if(fb) fb.disabled=false;
      var dur = Math.round((Date.now()-BIO.tStart)/1000);
      BIO.pendingVideo = await finalizarGrabadorVideo();  // clip listo para subir al guardar
      var artic = finalizarArticulaciones(BIO.acc);
      var fps = dur>0 ? Math.round(BIO.framesTotales/dur) : BIO.framesTotales;
      mostrarResumen(artic, {
        fuente:'camara', duracionSeg:dur,
        calidad:{ fpsPromedio:fps, framesTotales:BIO.framesTotales, framesValidos:BIO.acc?BIO.acc.framesValidos:0 }
      });
    }
  }
  function iniciarCronometro(){
    var el=document.getElementById('bio-cron');
    BIO.timerId=setInterval(function(){
      var s=Math.round((Date.now()-BIO.tStart)/1000);
      var mm=String(Math.floor(s/60)).padStart(2,'0'), ss=String(s%60).padStart(2,'0');
      if(el) el.textContent=mm+':'+ss;
    },500);
  }
  function pararCronometro(){ if(BIO.timerId){ clearInterval(BIO.timerId); BIO.timerId=null; } }

  // Panel de ángulos en vivo (cámara).
  function pintarPanelVivo(ang){
    var panel=document.getElementById('bio-panel-vivo'); if(!panel) return;
    var filas = GRUPOS.map(function(g){
      var iz=ARTIC.find(function(a){return a.grupo===g&&a.lado==='Izq';});
      var de=ARTIC.find(function(a){return a.grupo===g&&a.lado==='Der';});
      var vi = valorVivo(ang, iz), vd = valorVivo(ang, de);
      return '<tr><td class="g">'+g+'</td><td class="v" id="bv-'+iz.key+'">'+vi+'</td><td class="v" id="bv-'+de.key+'">'+vd+'</td></tr>';
    }).join('');
    panel.innerHTML = '<table><thead><tr><th>Articulación</th><th style="text-align:right">Izq</th><th style="text-align:right">Der</th></tr></thead><tbody>'+filas+'</tbody></table>';
  }
  function valorVivo(ang, j){
    if(!ang){ return '—'; }
    var r=ang[j.key];
    return (r && r.ok) ? (Math.round(r.val)+'°') : '—';
  }
  function actualizarPanelVivo(ang){
    if(!document.getElementById('bv-codoIzq')){ pintarPanelVivo(ang); return; }
    ARTIC.forEach(function(j){
      var td=document.getElementById('bv-'+j.key); if(!td) return;
      if(BIO.recording && BIO.acc){
        var s=BIO.acc[j.key];
        td.textContent = (s && s.min!==null) ? (Math.round(s.min)+'–'+Math.round(s.max)) : '—';
      } else {
        var r=ang?ang[j.key]:null;
        td.textContent = (r && r.ok) ? (Math.round(r.val)+'°') : '—';
      }
    });
  }

  // ── MODO B: analizar video subido ──────────────────────────────────────────
  async function procesarVideo(file){
    if(!file.type || file.type.indexOf('video')!==0){ toast('Selecciona un archivo de video','error'); return; }
    BIO.modo='video';
    // Guardar el archivo elegido para subirlo al expediente al guardar (antes/después visual).
    var _ext=(String(file.name||'').split('.').pop()||'').toLowerCase().replace(/[^a-z0-9]/g,'') || (file.type.indexOf('mp4')>=0?'mp4':(file.type.indexOf('quicktime')>=0?'mov':'webm'));
    BIO.pendingVideo = { file:file, mime:file.type||'video/mp4', ext:_ext };
    mostrarVista('bio-vista-progreso');
    var fill=document.getElementById('bio-prog-fill'), txt=document.getElementById('bio-prog-txt');
    fill.style.width='0%'; txt.textContent='Cargando motor de pose…';
    BIO.canvas=document.getElementById('bio-canvas-vid'); BIO.ctx=BIO.canvas.getContext('2d');
    var ok = await ensureMediaPipeReady();
    if(!ok){ txt.textContent='⚠️ No se pudo cargar el motor de pose. Revisa tu conexión.'; return; }

    var url=URL.createObjectURL(file);
    var v=document.createElement('video');
    v.muted=true; v.defaultMuted=true; v.setAttribute('muted',''); v.playsInline=true; v.setAttribute('playsinline',''); v.preload='auto'; v.src=url;
    // iOS: el <video> debe estar en el DOM para reproducir. Offscreen 2px (el cuadro se ve en el canvas).
    v.style.cssText='position:fixed;left:-9999px;top:0;width:2px;height:2px;opacity:0;pointer-events:none';
    document.body.appendChild(v);
    BIO.video=v; BIO.srcEl=v;
    try{
      await new Promise(function(res,rej){ v.onloadedmetadata=function(){res();}; v.onerror=function(){rej(new Error('No se pudo leer el video'));}; });
    }catch(e){ URL.revokeObjectURL(url); try{ v.remove(); }catch(_){} txt.textContent='⚠️ '+e.message; return; }

    var dur = (isFinite(v.duration) && v.duration>0) ? v.duration : 0;
    if(!dur){ URL.revokeObjectURL(url); try{ v.remove(); }catch(_){} txt.textContent='⚠️ Video sin duración legible.'; return; }

    BIO.acc = nuevoAcumulador(); BIO.framesTotales=0;
    BIO.procesandoVideo=true; BIO.cancelVideo=false;
    txt.textContent='0%';
    // MUESTREO DURANTE REPRODUCCIÓN (robusto en iOS). El método anterior (seek cuadro-a-cuadro
    // con await pose.send) se colgaba en el 2º cuadro en Safari. Aquí reproducimos el video
    // muteado y enviamos cuadros a MediaPipe SIN await (fire-and-forget con guarda BIO.sending,
    // igual que el modo cámara que sí funciona). Progreso = currentTime / duración.
    await new Promise(function(resolve){
      var minGap = 1/FPS_VIDEO, lastSample = -1, rafId = 0, terminado = false, arranque = Date.now();
      function terminar(){
        if(terminado) return; terminado = true;
        if(rafId) cancelAnimationFrame(rafId);
        clearInterval(watchdog);
        try{ v.pause(); }catch(_){}
        resolve();
      }
      // Watchdog: cierra si termina, se cancela, llega al final, o se pasa mucho del tiempo esperado.
      var watchdog = setInterval(function(){
        if(terminado) return;
        if(BIO.cancelVideo || v.ended || v.currentTime >= dur - 0.05) terminar();
        else if(Date.now() - arranque > (dur*1000)*2 + 8000) terminar();
      }, 400);
      function tick(){
        if(terminado) return;
        if(BIO.cancelVideo){ terminar(); return; }
        var t = v.currentTime || 0;
        if(!BIO.sending && BIO.pose && v.videoWidth>0 && (t - lastSample) >= minGap){
          lastSample = t; BIO.sending = true; BIO.framesTotales++;
          BIO.pose.send({ image:v }).then(function(){ BIO.sending=false; }).catch(function(){ BIO.sending=false; });
        }
        var pct = Math.min(99, Math.round((t/dur)*100));
        fill.style.width = pct+'%'; txt.textContent = pct+'%';
        if(v.ended){ terminar(); return; }
        rafId = requestAnimationFrame(tick);
      }
      v.onended = terminar;
      var pp = v.play();
      if(pp && pp.then){ pp.then(function(){ tick(); }).catch(function(){ tick(); }); } else { tick(); }
    });
    BIO.procesandoVideo=false;
    URL.revokeObjectURL(url);
    try{ v.remove(); }catch(_){}

    if(BIO.cancelVideo){ mostrarVista('bio-vista-inicio'); return; }
    fill.style.width='100%'; txt.textContent='100%';
    var artic=finalizarArticulaciones(BIO.acc);
    mostrarResumen(artic, {
      fuente:'video', duracionSeg:Math.round(dur),
      calidad:{ fpsMuestreo:FPS_VIDEO, framesTotales:BIO.framesTotales, framesValidos:BIO.acc.framesValidos }
    });
  }
  // ── Resumen + guardado ─────────────────────────────────────────────────────
  function fmtRango(a){
    if(!a || a.min===null) return '—';
    return a.min+'°–'+a.max+'° <b style="color:#3DDC97">Δ'+a.rango+'°</b>';
  }
  function mostrarResumen(articulaciones, meta){
    detenerCamaraStream(); detenerLoopCamara();
    var cont=document.getElementById('bio-vista-resumen');
    var fuenteTxt = meta.fuente==='camara' ? '📷 Cámara en vivo' : '📁 Video';
    var filas = GRUPOS.map(function(g){
      var iz=ARTIC.find(function(a){return a.grupo===g&&a.lado==='Izq';});
      var de=ARTIC.find(function(a){return a.grupo===g&&a.lado==='Der';});
      return '<tr><td class="g">'+g+'</td><td>'+fmtRango(articulaciones[iz.key])+'</td><td>'+fmtRango(articulaciones[de.key])+'</td></tr>';
    }).join('');
    var hayDato = ARTIC.some(function(j){ return articulaciones[j.key] && articulaciones[j.key].min!==null; });
    cont.innerHTML =
      '<h3>Resumen de la medición</h3>'
      + '<div style="color:#9BA3B5;font-size:13px;margin-bottom:10px">'+fuenteTxt+' · '+meta.duracionSeg+' s · '+(meta.calidad.framesValidos||0)+' cuadros válidos · convención clínica (0° neutro)</div>'
      + '<table class="bio-tabla-res"><thead><tr><th>Articulación</th><th>Izquierda</th><th>Derecha</th></tr></thead><tbody>'+filas+'</tbody></table>'
      + (hayDato ? '' : '<div style="color:#E8C96A;font-size:13px;margin-top:10px">⚠️ No se detectaron articulaciones con suficiente visibilidad. Repite con el cuerpo completo en cuadro y buena luz.</div>')
      + '<div class="bio-acciones">'
      +   '<button class="bio-b-sec" id="bio-res-repetir">🔄 Repetir</button>'
      +   (hayDato ? '<button class="bio-b-save" id="bio-res-guardar">💾 Guardar en expediente</button>' : '')
      + '</div>';
    mostrarVista('bio-vista-resumen');
    document.getElementById('bio-res-repetir').addEventListener('click', function(){ resetEstado(); mostrarVista('bio-vista-inicio'); });
    var g=document.getElementById('bio-res-guardar');
    if(g) g.addEventListener('click', function(){ guardarSesion(articulaciones, meta); });
  }

  async function guardarSesion(articulaciones, meta){
    var p = (typeof currentPatient!=='undefined') ? currentPatient : null;
    if(!p){ toast('Sin paciente activo','error'); return; }
    var btn=document.getElementById('bio-res-guardar'); if(btn){ btn.disabled=true; btn.textContent='⏳ Guardando…'; }
    if(!Array.isArray(p.biomecanica)) p.biomecanica=[];
    var sesion = {
      id:'bm_'+p.id+'_'+Date.now(),
      tipo:'rom',
      fuente:meta.fuente,                 // 'camara' | 'video'
      fecha:fechaHoy(),
      horaCreacion:horaAhora(),
      fechaHoraISO:new Date().toISOString(),
      terapeuta:usuarioActual(),
      convencion:'clinica',
      duracionSeg:meta.duracionSeg||0,
      articulaciones:articulaciones,
      calidad:meta.calidad||{},
      reportePdf:null,
      video:null,
      eliminado:false
    };
    // Subir el video (clip grabado en cámara o archivo elegido) a Storage y enlazarlo a la sesión.
    // Sirve de antes/después visual para el paciente. Si falla, se guardan los ángulos igual.
    if(BIO.pendingVideo && typeof fbStorage!=='undefined' && fbStorage){
      try{
        var _src = BIO.pendingVideo.blob || BIO.pendingVideo.file;
        var _ext = BIO.pendingVideo.ext || 'webm';
        var _ts = Date.now();
        var _safe = 'rom_'+String(p.name||'paciente').replace(/[^\w]/g,'_')+'_'+_ts+'.'+_ext;
        var _path = 'clinica/sinergia/'+p.id+'/biomecanica/'+_ts+'_'+_safe;
        var _ref = fbStorage.ref(_path);
        var _url = await new Promise(function(resolve,reject){
          var task=_ref.put(_src,{contentType:BIO.pendingVideo.mime||('video/'+_ext)});
          task.on('state_changed',
            function(s){ var pct=s.totalBytes?Math.round(s.bytesTransferred/s.totalBytes*100):0; if(btn) btn.textContent='☁️ Subiendo video… '+pct+'%'; },
            function(err){ reject(err); },
            function(){ task.snapshot.ref.getDownloadURL().then(resolve).catch(reject); });
        });
        sesion.video = { url:_url, fbPath:_path, mime:BIO.pendingVideo.mime||('video/'+_ext), tamanoBytes:(_src&&_src.size)||0, fuente:meta.fuente };
      }catch(e){ console.warn('[BIO] subida de video falló:', e && e.message); toast('⚠️ El video no se pudo subir; se guardan los ángulos','warning'); }
    }
    if(btn){ btn.textContent='⏳ Guardando…'; }
    p.biomecanica.push(sesion);
    if(!Array.isArray(p.historialCambios)) p.historialCambios=[];
    p.historialCambios.push({ usuario:usuarioActual(), seccion:'biomecanica', fecha:sesion.fecha+' '+sesion.horaCreacion, accion:'Medición ROM ('+sesion.fuente+')', antes:'', despues:'ROM '+sesion.fuente });
    p.fechaActualizacion=fechaHoy(); p.ultimoUsuario=usuarioActual();
    try{
      var res = (typeof saveDB==='function') ? await saveDB('pts',[p]) : {ok:false};
      toast(res && res.ok ? '✅ Medición guardada en el expediente' : '⚠️ Guardada local, Sheets pendiente', res && res.ok ? 'success' : 'warning');
    }catch(e){
      toast('⚠️ Sin conexión — guardada local, se sincronizará','warning');
    }
    cerrarMedidor();
    if(typeof renderExpediente==='function') renderExpediente('biomecanica');
  }

  // ── Render de la pestaña "Biomecánica" (devuelve HTML string) ──────────────
  function fmtRangoTxt(a){
    if(!a || a.min===null) return '<span style="color:var(--gray-400)">—</span>';
    return a.min+'°–'+a.max+'° <b style="color:var(--green)">Δ'+a.rango+'°</b>';
  }
  function renderPestana(p){
    var lista = Array.isArray(p.biomecanica) ? p.biomecanica.filter(function(s){ return s && !s.eliminado; }) : [];
    var html = ''
      + '<button class="btn-gold" style="width:100%;margin-bottom:12px;font-size:15px;font-weight:800;border:none;border-radius:var(--radius);padding:14px;cursor:pointer;background:var(--gold);color:var(--navy-dark)" onclick="abrirMedidorBiomecanico()">▶️ Nueva medición ROM</button>';
    if(!lista.length){
      html += '<div style="text-align:center;padding:22px;color:var(--gray-400);font-size:13px">Sin mediciones — toca <b>▶️ Nueva medición ROM</b> para empezar.<br>Mide rangos articulares con la cámara en vivo o subiendo un video.</div>';
      return html;
    }
    var orden = lista.slice().reverse(); // más reciente primero
    html += orden.map(function(s){
      var fuente = s.fuente==='video' ? '📁 Video' : '📷 Cámara';
      var a=s.articulaciones||{};
      var filas = GRUPOS.map(function(g){
        var iz=ARTIC.find(function(x){return x.grupo===g&&x.lado==='Izq';});
        var de=ARTIC.find(function(x){return x.grupo===g&&x.lado==='Der';});
        return '<div class="field-row"><div class="field-label">'+g+'</div><div class="field-value" style="display:flex;gap:14px;flex-wrap:wrap">'
          + '<span><b style="color:var(--gray-400);font-weight:600">Izq</b> '+fmtRangoTxt(a[iz.key])+'</span>'
          + '<span><b style="color:var(--gray-400);font-weight:600">Der</b> '+fmtRangoTxt(a[de.key])+'</span></div></div>';
      }).join('');
      var pdfBtn = (s.reportePdf && s.reportePdf.url)
        ? '<button data-url="'+esc(s.reportePdf.url)+'" onclick="window.open(this.dataset.url,\'_blank\')" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer">📄 Ver PDF</button>'
        : '<button data-sid="'+esc(s.id)+'" onclick="BIO_pdf(this.dataset.sid)" style="background:var(--white);color:var(--navy);border:1.5px solid var(--gray-200);border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer">📄 Generar PDF</button>';
      var videoBtn = (s.video && s.video.url)
        ? '<button data-url="'+esc(s.video.url)+'" onclick="window.open(this.dataset.url,\'_blank\')" style="background:var(--green);color:#fff;border:none;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer">▶️ Ver video</button>'
        : '';
      return '<div class="section-card" style="margin-bottom:10px">'
        + '<div class="section-title" style="display:flex;align-items:center;justify-content:space-between">'
        +   '<span>🦴 ROM · '+esc(s.fecha)+' '+esc(s.horaCreacion||'')+'</span>'
        +   '<span style="font-weight:600;text-transform:none;letter-spacing:0;color:var(--gray-400)">'+fuente+'</span>'
        + '</div>'
        + '<div class="field-row"><div class="field-label">Terapeuta</div><div class="field-value">'+esc(s.terapeuta||'—')+' · '+(s.duracionSeg||0)+' s · '+((s.calidad&&s.calidad.framesValidos)||0)+' cuadros</div></div>'
        + filas
        + '<div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;padding:10px 14px">'
        +   videoBtn
        +   pdfBtn
        +   '<button data-sid="'+esc(s.id)+'" onclick="BIO_eliminar(this.dataset.sid)" style="background:var(--red-light);color:var(--red);border:1.5px solid #FCA5A5;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer">🗑️ Eliminar</button>'
        + '</div>'
        + '</div>';
    }).join('');
    return html;
  }

  // ── PDF de una sesión (bajo demanda; sube a Storage y guarda la url) ───────
  async function BIO_pdf(sid){
    var p=(typeof currentPatient!=='undefined')?currentPatient:null; if(!p) return;
    var s=(p.biomecanica||[]).find(function(x){return x.id===sid;}); if(!s) return;
    if(s.reportePdf && s.reportePdf.url){ window.open(s.reportePdf.url,'_blank'); return; }
    var jsPDFCtor=(window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    if(!jsPDFCtor){ toast('jsPDF no disponible','error'); return; }
    toast('Generando PDF…','');
    try{
      var pdf=new jsPDFCtor({unit:'pt',format:'letter'});
      var W=pdf.internal.pageSize.getWidth(), M=48, y=56;
      pdf.setFontSize(16); pdf.setTextColor(27,58,107); pdf.text('Clínica Sinergia — Reporte biomecánico (ROM)', M, y); y+=22;
      pdf.setFontSize(11); pdf.setTextColor(60,60,60);
      pdf.text('Paciente: '+(p.name||'—'), M, y); y+=16;
      pdf.text('Fecha: '+(s.fecha||'—')+'   Hora: '+(s.horaCreacion||'—'), M, y); y+=16;
      pdf.text('Terapeuta: '+(s.terapeuta||'—'), M, y); y+=16;
      pdf.text('Fuente: '+(s.fuente==='video'?'Video':'Cámara en vivo')+'   Duración: '+(s.duracionSeg||0)+' s', M, y); y+=16;
      pdf.setFontSize(9); pdf.setTextColor(120,120,120);
      pdf.text('Valores en convención goniométrica clínica (0° neutro). Δ = rango de movimiento.', M, y); y+=22;
      // tabla
      var col=[M, M+150, M+320], rowH=22;
      pdf.setFontSize(11); pdf.setTextColor(27,58,107); pdf.setFont(undefined,'bold');
      pdf.text('Articulación', col[0], y); pdf.text('Izquierda', col[1], y); pdf.text('Derecha', col[2], y);
      pdf.setFont(undefined,'normal'); pdf.setTextColor(40,40,40); y+=8;
      pdf.setDrawColor(210,210,210); pdf.line(M, y, W-M, y); y+=16;
      var a=s.articulaciones||{};
      function cel(x){ return (!x||x.min===null)?'—':(x.min+'°–'+x.max+'°  (Δ'+x.rango+'°)'); }
      GRUPOS.forEach(function(g){
        var iz=ARTIC.find(function(x){return x.grupo===g&&x.lado==='Izq';});
        var de=ARTIC.find(function(x){return x.grupo===g&&x.lado==='Der';});
        pdf.text(g, col[0], y); pdf.text(cel(a[iz.key]), col[1], y); pdf.text(cel(a[de.key]), col[2], y);
        y+=rowH;
      });
      var blob=pdf.output('blob');
      // subir a Storage (misma convención que el scanner)
      if(typeof fbStorage!=='undefined' && fbStorage){
        var ts=Date.now();
        var safe='rom_'+String(p.name||'paciente').replace(/[^\w]/g,'_')+'_'+ts+'.pdf';
        var path='clinica/sinergia/'+p.id+'/biomecanica/'+ts+'_'+safe;
        var ref=fbStorage.ref(path);
        await ref.put(new File([blob],safe,{type:'application/pdf'}),{contentType:'application/pdf'});
        var url=await ref.getDownloadURL();
        s.reportePdf={ url:url, fbPath:path, fecha:fechaHoy(), generadoPor:usuarioActual() };
        if(typeof saveDB==='function'){ try{ await saveDB('pts',[p]); }catch(e){} }
        if(typeof renderExpediente==='function') renderExpediente('biomecanica');
        window.open(url,'_blank');
        toast('✅ PDF generado','success');
      } else {
        // sin Storage: descarga local
        pdf.save('rom_'+ts+'.pdf');
      }
    }catch(e){ console.error('[BIO] PDF error',e); toast('❌ No se pudo generar el PDF: '+(e.message||''),'error'); }
  }

  function BIO_eliminar(sid){
    var p=(typeof currentPatient!=='undefined')?currentPatient:null; if(!p || !Array.isArray(p.biomecanica)) return;
    if(!window.confirm('¿Eliminar esta medición biomecánica? Esta acción no se puede deshacer.')) return;
    var i=p.biomecanica.findIndex(function(x){return x.id===sid;});
    if(i<0) return;
    p.biomecanica.splice(i,1);
    p.fechaActualizacion=fechaHoy(); p.ultimoUsuario=usuarioActual();
    if(typeof saveDB==='function'){ saveDB('pts',[p]).then(function(){}).catch(function(){}); }
    if(typeof renderExpediente==='function') renderExpediente('biomecanica');
    toast('Medición eliminada','');
  }

  // ── Exponer al ámbito global (usados por index.html) ───────────────────────
  window.abrirMedidorBiomecanico = abrirMedidorBiomecanico;
  window.BIO_renderPestana = renderPestana;
  window.BIO_pdf = BIO_pdf;
  window.BIO_eliminar = BIO_eliminar;

})();
