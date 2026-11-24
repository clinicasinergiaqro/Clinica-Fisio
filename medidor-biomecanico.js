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
  // MOVIMIENTOS medidos (Fase 1 enfocada): codo flexo-extensión + hombro flexión y abducción,
  // por lado. 'calc' define cómo se calcula. vertice = landmark donde se dibuja la etiqueta.
  //  - codo: ángulo interior hombro-codo-muñeca → clínico = 180-interior (0°=extendido).
  //  - hombro_flex: elevación del brazo en el PLANO SAGITAL (brazo al frente).
  //  - hombro_abd:  elevación del brazo en el PLANO FRONTAL (brazo al lado).
  //    Ambos 0°=brazo al costado. Se usan hombros+caderas para el marco del cuerpo.
  // En UNA grabación el paciente hace TODOS los movimientos activos; cada uno se llena por su
  // cuenta. Para hombro se clasifica el frame por DIRECCIÓN del brazo (lateral=abducción,
  // adelante=flexión, atrás=extensión) y se guarda la elevación máxima de cada uno. base0: el ROM
  // se reporta desde 0° (neutro). dir: qué dirección llena esta métrica.
  var MEDIDAS = [
    { key:'codo_flex_izq',   grupo:'Codo',   mov:'Flexión',   lado:'Izq', calc:'codo',   vertice:13, pts:[11,13,15] },
    { key:'codo_flex_der',   grupo:'Codo',   mov:'Flexión',   lado:'Der', calc:'codo',   vertice:14, pts:[12,14,16] },
    { key:'hombro_flex_izq', grupo:'Hombro', mov:'Flexión',   lado:'Izq', calc:'hombro', dir:'flex', base0:true, vertice:11, hombro:11, codo:13 },
    { key:'hombro_flex_der', grupo:'Hombro', mov:'Flexión',   lado:'Der', calc:'hombro', dir:'flex', base0:true, vertice:12, hombro:12, codo:14 },
    { key:'hombro_ext_izq',  grupo:'Hombro', mov:'Extensión', lado:'Izq', calc:'hombro', dir:'ext',  base0:true, vertice:11, hombro:11, codo:13 },
    { key:'hombro_ext_der',  grupo:'Hombro', mov:'Extensión', lado:'Der', calc:'hombro', dir:'ext',  base0:true, vertice:12, hombro:12, codo:14 },
    { key:'hombro_abd_izq',  grupo:'Hombro', mov:'Abducción', lado:'Izq', calc:'hombro', dir:'abd',  base0:true, vertice:11, hombro:11, codo:13 },
    { key:'hombro_abd_der',  grupo:'Hombro', mov:'Abducción', lado:'Der', calc:'hombro', dir:'abd',  base0:true, vertice:12, hombro:12, codo:14 },
    // Lateralización cervical (inclinación lateral del cuello): eje cabeza vs vertical, plano FRONTAL.
    // dir: hacia qué lado se inclina la cabeza. base0: ROM desde 0° (neutro, cabeza recta). Ref AAOS 0–45°.
    { key:'cuello_lat_izq',  grupo:'Cuello', mov:'Lateralización', lado:'Izq', calc:'cuello', dir:'izq', base0:true, vertice:0 },
    { key:'cuello_lat_der',  grupo:'Cuello', mov:'Lateralización', lado:'Der', calc:'cuello', dir:'der', base0:true, vertice:0 }
  ];
  // Filas de la tabla (una por movimiento, con columnas Izq/Der).
  var FILAS = [
    { etq:'Codo · Flexo-ext.',  izq:'codo_flex_izq',   der:'codo_flex_der' },
    { etq:'Hombro · Flexión',   izq:'hombro_flex_izq', der:'hombro_flex_der' },
    { etq:'Hombro · Extensión', izq:'hombro_ext_izq',  der:'hombro_ext_der' },
    { etq:'Hombro · Abducción', izq:'hombro_abd_izq',  der:'hombro_abd_der' },
    { etq:'Cuello · Lateraliz.', izq:'cuello_lat_izq',  der:'cuello_lat_der' }
  ];

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

  // Sello de versión del algoritmo 2D (para trazabilidad en cada medición guardada).
  // ⚠️ REGLA: subir esta versión en TODO cambio que toque la MEDICIÓN — geometría, decodificación de
  //    cuadros (p.ej. el canvas HEVC/iOS), gateo de tiempo (VFR), o caps/techos que cambien el resultado —
  //    NO solo en "correcciones". Si el cálculo cambia y el sello no, la procedencia de los datos clínicos
  //    miente (una sesión diría "mismo algoritmo" que otra medida con código distinto).
  var BIO_ALGO_VER = 'bio-2d-2026-11-22';   // -22 (P0 ANATÓMICO): VALIDEZ DE LANDMARKS DE MUÑECA — gate de correspondencia Pose↔Hands (la muñeca de Hands debe caer a ≤12% del antebrazo de la muñeca de Pose, medido en las 6 fotos reales: buenas ~5%, malas 13–20%; antes se aceptaba hasta 45% en silencio → 3 de 4 medidas de muñeca pasaban sin revisión); brazo FIJO del goniómetro = eje longitudinal del antebrazo (codo→muñeca de Pose, UN solo modelo), vértice = muñeca de Pose (centro articular del detector) y brazo móvil = DIRECCIÓN del metacarpiano de Hands trasladada al vértice (ya no la polilínea codo→H0→H9 que mezclaba la POSICIÓN de dos modelos en el vértice; en las fotos reales el cambio de valor es ≤1.6°); protocolos NO intercambiables: (B) proxy computacional 3.er MCP (auto) vs (A) lateral clásico 5.º MCP (requiere revisión del fisio); foto estática sin "tope confirmado" → "posición mostrada", sin semáforo de corte; estadoAnatomico por medida; panel de diagnóstico anatómico sin ángulos + export de coordenadas. (-21 (V3.2): IDENTIDAD DE CALLBACKS — el emparejado resultado↔cuadro deja de depender de colas FIFO globales: Hands con UN job en vuelo por instancia (el .then/.catch libera SOLO su job; watchdog = job PERDIDO drenado por conteo o por epoch de instancia retirada) y Pose del goniómetro emparejada por el contexto de SU envío + deuda AMBIGUA (descarta sin adivinar) / DECLARADA (drenaje FIFO tras watchdog); techo DURO del pool de rasters; adquiridoEnUTC en traza. Las FÓRMULAS del ángulo no cambian. (-20c (V3.1): IDENTIDAD DE CUADRO — cada cuadro de goniómetro se congela a un raster INMUTABLE de pool ANTES de enviarse y el resultado se empareja por contexto {gen, frameId, mediaTime}; Hands en LOCKSTEP por frameId (fin de la ventana de 1200 ms: mano de un cuadro jamás se mezcla con pose de otro); "cuadro actual" y pico son snapshots de ESE cuadro exacto; captura TRANSACCIONAL (evidencia antes que medida; sin imagen = explícito y confirmado) con valCrudo a precisión original, capturadoEn, metodo, resExport y frameId en traza; hiperextensión exige confirmación visual. Las FÓRMULAS del ángulo no cambian. (-20b V3 motor gráfico/techo/tupla/manual; -20 muñeca 3.er metacarpiano; -19 foto/video robustos a orientación; -18 techo+HEVC iOS.)
  // CORRECCIÓN DE ASPECTO (H1): las coords de MediaPipe vienen normalizadas 0–1 por ANCHO (x) y por
  // ALTO (y) de forma INDEPENDIENTE. En un cuadro NO cuadrado (p.ej. 9:16 vertical del celular) eso
  // deforma los ángulos de segmentos oblicuos hasta ~20°. Reescalando x por (ancho/alto) se recupera
  // el ángulo real del plano de la imagen. _ANG_AR = ancho/alto de la fuente activa; 1 = cuadrado
  // (idéntico al comportamiento anterior). Lo fijan onResults (vivo/video) y _recalcEstatico (foto).
  var _ANG_AR = 1;
  function _setAspect(w,h){ _ANG_AR = (w>0 && h>0) ? (w/h) : 1; }

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
    acc:null,                // acumulador de mín/máx (ROM)
    accS:null,               // acumulador de sentadilla (Fase 2)
    accM:null,               // acumulador de marcha (Fase 3A)
    tipoMedicion:'rom',      // 'rom' | 'sent' (sentadilla frontal) | 'marcha'; se recuerda entre aperturas
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
            modelComplexity:0, smoothLandmarks:true, enableSegmentation:false,  // 0=lite: mucho más rápido en iPad
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

  // ── Carga de MediaPipe HANDS bajo demanda — SOLO para el goniómetro de MUÑECA ─────────────
  // AUDITORÍA 2026-11-20: el eje clínico de la mano para medir muñeca es el 3.er METACARPIANO
  // (muñeca → nudillo del dedo medio). Pose solo da la PUNTA del índice (19/20), que con la mano
  // cerrada / dedos curvos cae junto a la palma → el vector casi desaparece y el ángulo sale
  // inventado. Hands da lm0 (muñeca) y lm9 (nudillo medio), ESTABLES aunque el puño esté cerrado.
  // NO va al SHELL del SW (no rompe el offline del resto): se baja del CDN la 1.ª vez que se mide
  // muñeca y el SW lo cachea en runtime (igual que html2canvas). Si no carga → fallback endurecido.
  var MP_HANDS_BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4';
  function ensureHandsReady(){
    if(BIO.hands) return Promise.resolve(true);
    if(BIO._handsPromise) return BIO._handsPromise;
    BIO._handsPromise = new Promise(function(resolve){
      var timeout = setTimeout(function(){ resolve(false); }, 30000);
      function crearHands(){
        try{
          if(typeof Hands === 'undefined'){ clearTimeout(timeout); resolve(false); return; }
          var h = new Hands({ locateFile:function(f){ return MP_HANDS_BASE + '/' + f; } });
          h.setOptions({ maxNumHands:2, modelComplexity:1, minDetectionConfidence:0.4, minTrackingConfidence:0.4 });
          // (V3.2 P0) el callback queda ATADO por closure al epoch de ESTA instancia: si la instancia
          // se retira (watchdog → _handsRetirarInstancia), sus callbacks llegan con un epoch viejo y se
          // descartan ENTEROS — una instancia retirada jamás publica resultados en el estado de la nueva.
          var _epochInst = (BIO._handsEpoch||0);
          h.onResults(function(r){ onResultsHands(r, _epochInst); });
          BIO.hands = h; clearTimeout(timeout); resolve(true);
        }catch(e){ clearTimeout(timeout); console.warn('[BIO] Hands init falló:', e && e.message); resolve(false); }
      }
      if(typeof Hands !== 'undefined'){ crearHands(); return; }
      var s = document.createElement('script');
      s.src = MP_HANDS_BASE + '/hands.js'; s.async = true; s.crossOrigin = 'anonymous';
      s.onload = crearHands;
      s.onerror = function(){ clearTimeout(timeout); console.warn('[BIO] No se pudo cargar hands.js (la muñeca exigirá mano abierta)'); resolve(false); };
      document.head.appendChild(s);
    });
    return BIO._handsPromise;
  }
  function _munecaActiva(){ return BIO.tipoMedicion==='gonio' && !!(BIO.accG && BIO.accG.sel && BIO.accG.sel.grupo==='Muñeca'); }
  // Dispara la carga de Hands en 2º plano si el goniómetro activo es Muñeca (nunca bloquea; si falla, queda el fallback).
  function _ensureHandsSiMuneca(){
    if(_munecaActiva() && !BIO.hands && !BIO._handsFallo){
      ensureHandsReady().then(function(ok){ if(!ok) BIO._handsFallo = true; });
    }
  }
  // (V3.2 P0) RETIRO de la instancia Hands tras un watchdog: si el constructor está disponible, la
  // instancia colgada se cierra y se crea OTRA cuyo callback va atado a su propio epoch (closure en
  // crearHands) → cualquier callback tardío de la retirada cae por epoch, llegue cuando llegue y en el
  // orden que llegue. Si el constructor no está (aún no cargó / entorno de pruebas), se CONSERVA la
  // instancia y el callback tardío se drena por conteo (_handsStale) — mismo invariante, menor garantía,
  // acotado a la instancia única. Mientras recrea, la muñeca cae al fallback honesto (hint "cargando").
  function _handsRetirarInstancia(){
    try{
      if(typeof Hands === 'undefined') return;           // sin constructor: drenaje por _handsStale
      var vieja = BIO.hands;
      BIO.hands = null; BIO._handsPromise = null;
      BIO._handsEpoch = (BIO._handsEpoch||0) + 1;        // los callbacks de la vieja caen por epoch…
      BIO._handsStale = 0;                               // …así que el conteo de huérfanos se limpia
      try{ if(vieja && typeof vieja.close==='function') vieja.close(); }catch(_c){}
      ensureHandsReady().then(function(ok){ if(!ok) BIO._handsFallo = true; });
    }catch(_r){}
  }
  // (V3.2 P0-03) Un WATCHDOG (≥2.5 s sin respuesta) convierte la deuda AMBIGUA de Pose en pérdida
  // DECLARADA: los próximos N callbacks se drenan en orden (expectativa FIFO de la instancia única,
  // explícita y documentada) y el flujo siguiente empareja limpio — es lo que permite que el primer
  // cuadro tras recuperarse de un cuelgue SÍ se mida. Si un "perdido" en realidad nunca llega, el
  // drenaje consume un callback bueno y ESE cuadro se pierde (costo acotado a 1 cuadro, auto-sanable);
  // jamás una asociación cruzada. Sin watchdog (cambio de generación a secas) NO hay declaración:
  // la deuda queda AMBIGUA y onResults descarta sin emparejar (ver rama gonio).
  function _poseDeclararPerdidos(){
    BIO._poseStale = (BIO._poseStale||0) + (BIO._poseAmb||0);
    BIO._poseAmb = 0;
  }
  // (V3.2 P0-01) IDENTIDAD POR JOB + INSTANCIA, no por cola FIFO global. La API de Hands no ecoa ids,
  // así que el único emparejado seguro es: UNA inferencia en vuelo por instancia (BIO._handsJob) y el
  // callback sella el frameId de ESE job. Reglas de llegada, en orden:
  //  1) epoch de otra instancia (retirada por watchdog) → se descarta ENTERO: jamás publica.
  //  2) _handsStale>0 → callbacks de jobs declarados PERDIDOS (watchdog en la MISMA instancia, cuando
  //     no se pudo retirar): se DRENAN sin tocar estado — un callback viejo jamás consume el id de un
  //     job nuevo (el bug V3.1: _handsQ.shift() le daba el frameId fresco al huérfano).
  //  3) resto → pertenece al job vigente: sella su frameId y resuelve el cuadro diferido (lockstep).
  // Sigue sin existir la ventana de 1200 ms: una mano de otro cuadro JAMÁS se fusiona con la pose de éste.
  function onResultsHands(res, epoch){
    if(epoch!=null && epoch!==(BIO._handsEpoch||0)) return;            // instancia retirada: nunca publica
    if((BIO._handsStale||0)>0){ BIO._handsStale--; return; }           // huérfano declarado: se drena
    var hs = res && res.multiHandLandmarks;
    var job = BIO._handsJob;
    if(job) job.resuelto = true;                                       // su callback SÍ llegó (el watchdog ya no lo cuenta)
    var fid = job ? job.frameId : null;
    BIO._handsLm = (hs && hs.length) ? hs : null;
    // (P0 2026-11-22) PROVENANCE: handedness/score del detector, mismo orden que multiHandLandmarks
    // (antes se descartaba → la traza no podía decir la confianza de la mano usada).
    try{ BIO._handsMeta = (res && res.multiHandedness) ? JSON.parse(JSON.stringify(res.multiHandedness)) : null; }catch(_m){ BIO._handsMeta=null; }
    BIO._handsLmTs = Date.now();
    BIO._handsResFrameId = fid;
    _frResolverPend(fid, (hs && hs.length) ? hs : []);
  }
  // Manos vigentes para el CÁLCULO de muñeca: en estático las congeladas con ESE cuadro (foto / pico de
  // video); en vivo/video SOLO las del MISMO frameId que el cuadro en proceso (lockstep V3.1) — una mano
  // de un cuadro anterior nunca se usa. [] = "se buscó y no hay mano"; null = sin dato de mano este cuadro.
  function _handsActuales(){
    if(BIO._handsLmTest) return BIO._handsLmTest;                                   // hook de pruebas
    if(BIO.modo==='estatico') return (BIO._estaticoHandsLm!==undefined) ? BIO._estaticoHandsLm : null;
    return (BIO._frProcHands!==undefined && BIO._frProcHands!==null) ? BIO._frProcHands : null;
  }
  // Copia defensiva de landmarks de manos (para congelar el cuadro-pico, igual que _copiaLm con la pose).
  function _copiaManosLm(hs){
    if(!hs) return null;
    try{ return hs.map(function(h){ return (h||[]).map(function(p){ return p ? { x:p.x, y:p.y, z:p.z } : p; }); }); }
    catch(_c){ return null; }
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
  // ── Álgebra de vectores 3D (para la descomposición de hombro) ──
  function _sub(a,b){ return {x:a.x-b.x, y:a.y-b.y, z:(a.z||0)-(b.z||0)}; }
  function _dot(a,b){ return a.x*b.x+a.y*b.y+a.z*b.z; }
  function _mag(a){ return Math.sqrt(a.x*a.x+a.y*a.y+a.z*a.z); }
  function _norm(a){ var m=_mag(a)||1; return {x:a.x/m, y:a.y/m, z:a.z/m}; }
  function _cross(a,b){ return {x:a.y*b.z-a.z*b.y, y:a.z*b.x-a.x*b.z, z:a.x*b.y-a.y*b.x}; }
  function _vis(lm,i){ return !!(lm && lm[i] && (lm[i].visibility==null || lm[i].visibility>=VIS_MIN)); }

  // Marco de referencia ANATÓMICO del propio cuerpo (robusto a la orientación de la cámara):
  //  up = cadera→hombro (eje del tronco); lateral = hombro izq→der; forward = up × lateral (sagital).
  function _marcoCuerpo(world){
    var Ls=world[11], Rs=world[12], Lh=world[23], Rh=world[24];
    if(!Ls||!Rs||!Lh||!Rh) return null;
    var midS={x:(Ls.x+Rs.x)/2, y:(Ls.y+Rs.y)/2, z:((Ls.z||0)+(Rs.z||0))/2};
    var midH={x:(Lh.x+Rh.x)/2, y:(Lh.y+Rh.y)/2, z:((Lh.z||0)+(Rh.z||0))/2};
    var up=_norm(_sub(midS,midH));
    var lateral=_norm(_sub(Rs,Ls));
    var forward=_norm(_cross(up,lateral));
    // Orientar 'forward' hacia ADELANTE del cuerpo (nariz) para separar flexión (adelante, +)
    // de extensión (atrás, −). Sin nariz visible, queda la orientación del producto cruz.
    var nose=world[0];
    if(nose){ var toNose=_sub(nose, midH); if(_dot(toNose, forward) < 0){ forward={x:-forward.x, y:-forward.y, z:-forward.z}; } }
    return { up:up, lateral:lateral, forward:forward };
  }
  // Estado del hombro en un frame: elevación total (0=colgando) y dirección dominante del brazo.
  // La DIRECCIÓN se decide en 3D (marco del cuerpo). El VALOR de la ABDUCCIÓN se mide en 2D (plano
  // de la imagen), porque de frente es un movimiento IN-PLANE y el z del modelo "lite" lo ensuciaba
  // (lo volvía impreciso y asimétrico entre lados). Flexión/extensión van fuera del plano → 3D.
  function _estadoHombro(world, lm, marco, sIdx, eIdx){
    var arm=_sub(world[eIdx], world[sIdx]);
    var au=_dot(arm, marco.up), al=_dot(arm, marco.lateral), af=_dot(arm, marco.forward);
    var h=Math.sqrt(al*al+af*af);
    var theta3D=Math.atan2(h, -au)*180/Math.PI;   // 0=abajo, 90=horizontal, 180=arriba
    if(!isFinite(theta3D)) return { theta:NaN, dir:null };   // Fase 1b: brazo no finito (NaN) → sin dirección (la métrica no se llena)
    var dir=null;
    if(theta3D>=12){ dir = (Math.abs(al)>=Math.abs(af)) ? 'abd' : (af>0 ? 'flex' : 'ext'); }
    var theta=theta3D;
    if(dir==='abd' && lm && lm[sIdx] && lm[eIdx] && lm[11] && lm[12] && lm[23] && lm[24]){
      var ar=_ANG_AR||1;   // x escalada por aspecto (Fase 2): abducción in-plane real en cuadro no cuadrado
      var downX=(((lm[23].x+lm[24].x)/2)-((lm[11].x+lm[12].x)/2))*ar, downY=((lm[23].y+lm[24].y)/2)-((lm[11].y+lm[12].y)/2); // hombros→caderas (abajo)
      var armX=(lm[eIdx].x-lm[sIdx].x)*ar, armY=lm[eIdx].y-lm[sIdx].y;
      var md=Math.hypot(downX,downY), ma=Math.hypot(armX,armY);
      if(md>1e-6 && ma>1e-6){
        var cos=(downX*armX+downY*armY)/(md*ma); if(cos>1)cos=1; if(cos<-1)cos=-1;
        theta=Math.acos(cos)*180/Math.PI;   // 0=colgando, 90=horizontal, 180=arriba (in-plane, sin z)
      }
    }
    return { theta:theta, dir:dir };
  }
  // Calcula los valores clínicos de cada MOVIMIENTO para un frame.
  function calcularAngulos(world, lm){
    var out = { _algunoValido:false };
    var marco = world ? _marcoCuerpo(world) : null;
    var cacheHombro = {};   // sIdx → estado (se calcula una vez por hombro)
    for(var i=0;i<MEDIDAS.length;i++){
      var m=MEDIDAS[i], val=null, ok=false;
      if(m.calc==='codo'){
        var p1=m.pts[0], p2=m.pts[1], p3=m.pts[2];
        if(_vis(lm,p1)&&_vis(lm,p2)&&_vis(lm,p3) && world && world[p1]&&world[p2]&&world[p3] && _medible3(lm[p1],lm[p2],lm[p3])){   // Fase 1b: codo degenerado/NaN → no medible (evita 180 falso)
          var interior = angulo3D(world[p1], world[p2], world[p3]);
          // Codo en 2D cuando el brazo está EN EL PLANO de la imagen (de frente, al costado o en
          // abducción): sin ruido de z, un brazo recto da ~0°. Si el antebrazo apunta a la cámara
          // (foreshortening por flexión al frente) se queda en 3D.
          var fa3=_mag(_sub(world[p3],world[p2])), ua3=_mag(_sub(world[p1],world[p2]));
          if(fa3>1e-4 && ua3>1e-4){
            var rFa=Math.hypot(lm[p3].x-lm[p2].x, lm[p3].y-lm[p2].y)/fa3, rUa=Math.hypot(lm[p1].x-lm[p2].x, lm[p1].y-lm[p2].y)/ua3;
            var mn=Math.min(rFa,rUa), mx=Math.max(rFa,rUa);
            if(mx>1e-6 && mn>=0.6*mx) interior=_ang2D(lm[p1], lm[p2], lm[p3]);   // ambos segmentos in-plane → 2D
          }
          val = 180 - interior; if(val<0) val=0; ok=true;
        }
      } else if(m.calc==='cuello'){ // lateralización cervical: eje nariz→hombros vs vertical, en 2D (frontal)
        if(_vis(lm,0)&&_vis(lm,11)&&_vis(lm,12)){
          var mSx=(lm[11].x+lm[12].x)/2, mSy=(lm[11].y+lm[12].y)/2;
          var hx=(lm[0].x-mSx)*(_ANG_AR||1), hy=lm[0].y-mSy;  // eje cabeza vs hombros; x escalada por aspecto (Fase 2)
          if(Math.hypot(hx,hy)>1e-4){
            var tilt=Math.atan2(hx, -hy)*180/Math.PI;          // 0=recto; + = hacia +x (hombro IZQ del paciente, imagen espejada)
            var mag=Math.abs(tilt), ladoDir=(tilt>=0)?'izq':'der';
            if(mag>=8 && ladoDir===m.dir){ val=mag; ok=true; } // <8° = zona neutra
          }
        }
      } else { // hombro: la métrica se llena solo si el brazo va en SU dirección (flex/ext/abd)
        var s=m.hombro, e=m.codo;
        if(marco && _vis(lm,s)&&_vis(lm,e)&&_vis(lm,11)&&_vis(lm,12)&&_vis(lm,23)&&_vis(lm,24) && world && world[s]&&world[e]){
          var est = cacheHombro[s] || (cacheHombro[s] = _estadoHombro(world, lm, marco, s, e));
          if(est.dir === m.dir){ val = est.theta; if(val<0) val=0; ok=true; }
        }
      }
      if(ok && !isFinite(val)){ ok=false; val=null; }   // Fase 1b: cualquier val no finito (p.ej. mundo NaN en codo/hombro) → no medible
      out[m.key] = { val:val, ok:ok };
      if(ok) out._algunoValido = true;
    }
    return out;
  }

  // ── Acumulador: mín/máx + SERIE por movimiento (para detectar repeticiones) ──
  function nuevoAcumulador(){
    var a = { framesValidos:0, _frame:0 };
    MEDIDAS.forEach(function(m){ a[m.key] = { min:null, max:null, muestras:0, serie:[], _run:0 }; });
    return a;
  }
  function acumular(acc, ang){
    if(!acc || !ang) return;
    acc._frame++;                                   // índice monotónico de frame (separa repeticiones)
    var alguno=false;
    for(var i=0;i<MEDIDAS.length;i++){
      var k=MEDIDAS[i].key, r=ang[k], s=acc[k];
      // Histéresis de oclusión: exige 3 frames válidos SEGUIDOS para aceptar muestras (descarta
      // parpadeos de landmarks de mala calidad al entrar/salir de oclusión).
      if(r && r.ok){ s._run=(s._run||0)+1; } else { if(s) s._run=0; }
      if(r && r.ok && s._run>=3){
        alguno=true;
        if(s.min===null || r.val<s.min) s.min=r.val;
        if(s.max===null || r.val>s.max) s.max=r.val;
        s.muestras++;
        if(s.serie.length<4000) s.serie.push({ i:acc._frame, v:r.val });   // cota de memoria
      }
    }
    if(alguno) acc.framesValidos++;
  }
  // Detecta los picos (tope de cada repetición) en una serie {i,v} con histéresis adaptativa y
  // separación por hueco temporal (frames sin muestra = el brazo fue a otra dirección o al neutro).
  // Un frame ruidoso suelto NO crea un pico falso. Devuelve el arreglo de valores de pico.
  // Versión con ÍNDICES: devuelve [{v, i, k, kIni, kFin}] (pico + frame del pico + ventana de la
  // repetición dentro de la serie). La sentadilla la usa para leer métricas por repetición.
  function _detPicosIdx(serie, minPico, gap){
    var out=[]; if(!serie || !serie.length) return out;
    var srt=serie.map(function(s){return s.v;}).sort(function(a,b){return a-b;}), n=srt.length;
    var vlo=srt[Math.floor(0.05*(n-1))], vhi=srt[Math.floor(0.95*(n-1))];   // rango ROBUSTO (un frame atípico no lo infla)
    var rango=vhi-vlo;
    if(rango<8){
      if(vhi>=minPico){ var kM=0; for(var q=1;q<serie.length;q++){ if(serie[q].v>serie[kM].v) kM=q; } out.push({v:vhi, i:serie[kM].i, k:kM, kIni:0, kFin:serie.length-1}); }
      return out;   // casi plano ⇒ un solo pico
    }
    var enter=vlo+0.55*rango, exit=vlo+0.30*rango;
    var enRep=false, pico=-Infinity, kPico=-1, kIni=-1, dwell=0, lastI=null, MINDWELL=3;   // dwell rechaza chispazos de 1–2 frames
    function cierra(kFin){ if(pico>=minPico && dwell>=MINDWELL) out.push({v:pico, i:serie[kPico].i, k:kPico, kIni:kIni, kFin:kFin}); enRep=false; pico=-Infinity; kPico=-1; kIni=-1; dwell=0; }
    for(var k=0;k<serie.length;k++){
      var s=serie[k], v=s.v, i=s.i;
      if(enRep && lastI!=null && (i-lastI)>gap) cierra(k-1);
      lastI=i;
      if(!enRep){ if(v>=enter){ enRep=true; pico=v; kPico=k; kIni=k; dwell=1; } }
      else { dwell++; if(v>pico){ pico=v; kPico=k; } if(v<=exit) cierra(k); }
    }
    if(enRep) cierra(serie.length-1);
    return out;
  }
  function _detPicos(serie, minPico, gap){ return _detPicosIdx(serie, minPico, gap).map(function(r){ return r.v; }); }
  function _percentil(serie, q){                    // percentil robusto (0..1) de los valores
    if(!serie || !serie.length) return null;
    var a=serie.map(function(s){return s.v;}).sort(function(x,y){return x-y;});
    return a[Math.max(0, Math.min(a.length-1, Math.round(q*(a.length-1))))];
  }
  function _media(arr){ if(!arr.length) return null; var t=0,i; for(i=0;i<arr.length;i++) t+=arr[i]; return t/arr.length; }
  function _desv(arr){                               // DE muestral = ± consistencia entre repeticiones
    if(arr.length<2) return null; var m=_media(arr), t=0,i;
    for(i=0;i<arr.length;i++){ var d=arr[i]-m; t+=d*d; } return Math.sqrt(t/(arr.length-1));
  }
  function _mediana(arr){ if(!arr||!arr.length) return null; var a=arr.slice().sort(function(x,y){return x-y;}); return a[Math.floor(a.length/2)]; }
  // Filtro de MEDIANA de 5 muestras sobre una serie {i,v}: mata chispazos de 1–2 frames en el origen.
  function _medFilt5(serie){
    if(!serie || serie.length<5) return (serie||[]).slice();
    var out=new Array(serie.length);
    for(var k=0;k<serie.length;k++){
      var a=Math.max(0,k-2), b=Math.min(serie.length-1,k+2), w=[];
      for(var q=a;q<=b;q++) w.push(serie[q].v);
      w.sort(function(x,y){return x-y;});
      out[k]={i:serie[k].i, v:w[Math.floor(w.length/2)]};
    }
    return out;
  }
  // Quita CHISPAZOS solitarios de 1 frame (glitch del modelo) SIN recortar picos reales: solo
  // recorta una muestra si sobresale > thr° por encima de AMBOS vecinos (un pico real dura ≥2 frames).
  function _quitaChispazos(serie, thr){
    thr=thr||20;
    if(!serie || serie.length<3) return (serie||[]).slice();
    var out=serie.map(function(s){ return { i:s.i, v:s.v }; });
    for(var i=1;i<serie.length-1;i++){
      var a=serie[i-1].v, b=serie[i].v, c=serie[i+1].v, mx=Math.max(a,c), mn=Math.min(a,c);
      if(b-mx>thr && b-mn>thr) out[i].v=mx;
    }
    return out;
  }
  function _r1(v){ return v==null?null:Math.round(v*10)/10; }
  function _r2(v){ return v==null?null:Math.round(v*100)/100; }
  // Ángulo interior 2D (grados) en el vértice b, SOLO plano de la imagen (para proyecciones frontales).
  // x se reescala por _ANG_AR (ancho/alto) para no deformar el ángulo en cuadros no cuadrados (H1).
  function _ang2D(a,b,c){
    var ar=_ANG_AR||1;
    var v1x=(a.x-b.x)*ar, v1y=a.y-b.y, v2x=(c.x-b.x)*ar, v2y=c.y-b.y;
    var m1=Math.hypot(v1x,v1y), m2=Math.hypot(v2x,v2y);
    if(!m1||!m2) return 0;
    var cos=(v1x*v2x+v1y*v2y)/(m1*m2); if(cos>1)cos=1; if(cos<-1)cos=-1;
    return Math.acos(cos)*180/Math.PI;
  }
  // Longitud del segmento a–b en el espacio con aspecto corregido (para detectar puntos encimados).
  function _seg2D(a,b){ var ar=_ANG_AR||1; return Math.hypot((a.x-b.x)*ar, a.y-b.y); }
  function _dist2D(a,b){ return Math.hypot(a.x-b.x, a.y-b.y); }
  // VALIDEZ DE ENTRADA (Fase 1): un punto con coord NaN/Infinity o dos puntos casi encimados producían
  // antes un ángulo FALSO de 180° con ok:true (en _ang2D, !m1 con m1=NaN devuelve 0 → el llamador hace
  // 180-0=180, y ese 180 gana como "pico"). _finP = punto finito; _medible3 = 3 puntos finitos y con
  // ambos segmentos NO degenerados (umbral 0.03 en espacio con aspecto, igual que la guarda del goniómetro).
  // Los llamadores usan _medible3 para devolver {ok:false} en vez de un número inventado.
  function _finP(p){ return !!p && isFinite(p.x) && isFinite(p.y); }
  function _medible3(a,b,c){ return _finP(a) && _finP(b) && _finP(c) && _seg2D(a,b)>=0.03 && _seg2D(b,c)>=0.03; }
  // Cadencia inverosímil → los TIEMPOS del video no son fiables (cámara lenta/acelerada o fps irregular).
  function _cadenciaDudosa(cad){ return (cad!=null && !(cad>=20 && cad<=220)); }
  // Resume cada movimiento como la MEDIA de los picos de sus repeticiones (más reproducible que un
  // máximo suelto y robusto al ruido). Codo añade extensión (mínimo robusto). Mantiene min/max/rango
  // por compatibilidad con el render/PDF y con sesiones ya guardadas.
  // (i) Gate de confiable de ROM de brazos: además de ≥1 rep y ≥12 muestras, exige un PISO de visibilidad.
  // Un valor con muy pocos frames visibles (p.ej. hombro ext 174° a 8% de visibilidad) NO es confiable aunque
  // haya cruzado 12 muestras. Solo puede BAJAR confiable, nunca re-habilitarla. Pura para pruebas.
  function _romConfiable(reps, muestras, visPct){ return (reps>=1 && muestras>=12 && visPct>=25); }
  function finalizarMedidas(acc){
    return MEDIDAS.map(function(m){
      var s = acc && acc[m.key];
      // margen de error honesto por métrica: los movimientos en el PLANO de la cámara (codo, abducción,
      // cuello) son fiables en 2D (±5°); flexión/extensión de hombro van FUERA del plano de frente (±10°).
      var margen = (m.calc==='hombro' && (m.dir==='flex'||m.dir==='ext')) ? 10 : 5;
      var base = { key:m.key, grupo:m.grupo, mov:m.mov, lado:m.lado,
                   media:null, mejor:null, de:null, reps:0, ext:null,
                   min:null, max:null, rango:null, muestras:(s&&s.muestras)||0,
                   visPct:0, confiable:false, margen:margen };
      if(!s || s.muestras<6 || !s.serie || !s.serie.length) return base;   // <6 muestras = incidental
      var serie=_quitaChispazos(s.serie);               // quita glitches de 1 frame sin recortar picos reales
      var picos=_detPicos(serie, m.calc==='codo'?20:15, 8);
      if(!picos.length) return base;
      var de=_desv(picos);
      base.media=Math.round(_media(picos)); base.mejor=Math.round(Math.max.apply(null,picos));
      base.de=(de!=null)?Math.round(de):null; base.reps=picos.length;
      if(m.calc==='codo'){                            // codo: extensión = mínimo robusto (0°=extendido)
        var ext=_percentil(serie, 0.05); if(ext<0) ext=0;
        base.ext=Math.round(ext); base.min=base.ext; base.max=base.media; base.rango=Math.round(base.media-base.ext);
      } else {                                        // hombro/cuello: ROM desde 0° neutro
        base.min=0; base.max=base.mejor; base.rango=base.media;
      }
      base.visPct = (acc && acc._frame) ? Math.round(base.muestras/acc._frame*100) : 0;
      base.confiable = _romConfiable(base.reps, base.muestras, base.visPct);   // (i) ≥1 rep, ≥12 muestras y ≥25% visibilidad
      return base;
    });
  }
  function medidasPorKey(medidas){ var o={}; (medidas||[]).forEach(function(x){ o[x.key]=x; }); return o; }

  // ═════════════ FASE 2A — SENTADILLA (análisis FRONTAL) ═════════════
  // Métricas por frame desde los landmarks 2D de IMAGEN (el FPPA es un ángulo de PROYECCIÓN,
  // por definición se calcula en el plano de la imagen, no con el mundo 3D):
  //  - FPPA con signo por pierna (+ = rodilla hacia MEDIAL / valgo; − = varo). Se reporta a MEDIA
  //    BAJADA (~50% del descenso): en el fondo con muslo horizontal la proyección degenera y la
  //    literatura lo valida a ~45–60° de flexión, no en el fondo.
  //  - MKD: desplazamiento medial de la rodilla respecto a la línea cadera–tobillo, en % del ancho
  //    de pelvis (robusto en el fondo, donde el FPPA ya no sirve).
  //  - Ratio de separación rodillas/tobillos (adimensional; <1 = rodillas hacia adentro).
  //  - Inclinación LATERAL de tronco (frontal) y descenso del sacro (punto medio de caderas) en
  //    % de estatura (y cm si hay estatura del paciente; proxy nariz→tobillos ≈ 88% de estatura).
  var SENT_MIN_DESC = 10;   // % de estatura de descenso mínimo para contar una repetición

  function calcularSentFrontal(lm){
    if(!lm) return null;
    function vis(i){ return _vis(lm,i); }
    var piernasOK = vis(23)&&vis(24)&&vis(25)&&vis(26)&&vis(27)&&vis(28);
    var troncoOK  = vis(11)&&vis(12)&&vis(23)&&vis(24);
    var out={ piernasOK:piernasOK, troncoOK:troncoOK, ok:(piernasOK||troncoOK),
      fppaIzq:{val:null,ok:false}, fppaDer:{val:null,ok:false}, mkdIzq:{val:null,ok:false}, mkdDer:{val:null,ok:false},
      sepRatio:{val:null,ok:false}, troncoLat:{val:null,ok:false}, sacro:{ok:false}, alturaPx:null, orientFrontal:null };
    var midHip=(vis(23)&&vis(24))?{x:(lm[23].x+lm[24].x)/2, y:(lm[23].y+lm[24].y)/2}:null;
    var midSh =(vis(11)&&vis(12))?{x:(lm[11].x+lm[12].x)/2, y:(lm[11].y+lm[12].y)/2}:null;
    var midAnk=(vis(27)&&vis(28))?{x:(lm[27].x+lm[28].x)/2, y:(lm[27].y+lm[28].y)/2}:null;
    // Orientación: ancho proyectado (hombros+caderas) vs alto del tronco. De frente ≈ ≥0.45.
    if(midSh && midHip && _finP(midSh) && _finP(midHip)){
      var ancho=(Math.abs(lm[11].x-lm[12].x)+Math.abs(lm[23].x-lm[24].x))/2;
      var alto=Math.abs(midSh.y-midHip.y)||1e-6;
      out.orientFrontal=(ancho/alto)>=0.45;
    }
    // Pierna en frontal: FPPA con signo + MKD (% ancho pelvis). midX = línea media del cuerpo.
    var anchoPelvis = (vis(23)&&vis(24)) ? Math.abs(lm[23].x-lm[24].x) : null;
    function pierna(hip,knee,ank,midX){
      if(!_medible3(hip,knee,ank) || !isFinite(midX)) return { ok:false, fppa:null, mkdPct:null };   // rodilla encimada/NaN, o línea media NO finita (O1: el signo valgo/varo no debe invertirse) → no medible
      var interior=_ang2D(hip,knee,ank), mag=180-interior;
      var dy=(ank.y-hip.y);
      var t=Math.abs(dy)<1e-6 ? 0.5 : (knee.y-hip.y)/dy;
      var xLine=hip.x+(ank.x-hip.x)*t;                    // punto de la línea cadera–tobillo a la altura de la rodilla
      var dirMedial=(midX-xLine)>=0?1:-1;                 // hacia la línea media del cuerpo
      var despl=(knee.x-xLine)*dirMedial;                 // + = rodilla medial
      var signo=despl>=0?1:-1;
      return { ok:true, fppa:mag*signo, mkdPct:(anchoPelvis&&anchoPelvis>0.01)?(despl/anchoPelvis*100):null };
    }
    if(midHip){
      if(vis(23)&&vis(25)&&vis(27)){ var pi=pierna(lm[23],lm[25],lm[27],midHip.x); if(pi.ok){ out.fppaIzq={val:pi.fppa,ok:true}; if(pi.mkdPct!=null) out.mkdIzq={val:pi.mkdPct,ok:true}; } }
      if(vis(24)&&vis(26)&&vis(28)){ var pd=pierna(lm[24],lm[26],lm[28],midHip.x); if(pd.ok){ out.fppaDer={val:pd.fppa,ok:true}; if(pd.mkdPct!=null) out.mkdDer={val:pd.mkdPct,ok:true}; } }
    }
    if(vis(25)&&vis(26)&&vis(27)&&vis(28)){
      var dA=_dist2D(lm[27],lm[28]);
      if(dA>0.01) out.sepRatio={val:_dist2D(lm[25],lm[26])/dA, ok:true};
    }
    if(midSh && midHip && _finP(midSh) && _finP(midHip)){
      var dx=(midSh.x-midHip.x)*(_ANG_AR||1), dyT=midHip.y-midSh.y;   // x escalada por aspecto (Fase 2)
      if(dyT>1e-6) out.troncoLat={val:Math.atan2(dx,dyT)*180/Math.PI, ok:true};   // + = hacia un lado de la imagen
    }
    if(midHip && _finP(midHip)) out.sacro={x:midHip.x, y:midHip.y, ok:true};
    if(midAnk && _finP(midAnk) && vis(0) && _finP(lm[0])) out.alturaPx=Math.abs(midAnk.y-lm[0].y);   // proxy nariz→tobillos; O1: tobillo NaN no propaga
    out.midAnk=(midAnk && _finP(midAnk))?midAnk:null;
    out.p={ sacro:midHip,
            nariz:vis(0)?lm[0]:null, hombroIzq:vis(11)?lm[11]:null, hombroDer:vis(12)?lm[12]:null,
            codoIzq:vis(13)?lm[13]:null, codoDer:vis(14)?lm[14]:null, munecaIzq:vis(15)?lm[15]:null, munecaDer:vis(16)?lm[16]:null,
            caderaIzq:vis(23)?lm[23]:null, caderaDer:vis(24)?lm[24]:null,
            rodillaIzq:vis(25)?lm[25]:null, rodillaDer:vis(26)?lm[26]:null,
            tobilloIzq:vis(27)?lm[27]:null, tobilloDer:vis(28)?lm[28]:null };
    return out;
  }

  function nuevoAccSent(){
    return { frames:0, framesValidos:0, _frame:0, aspect:null, _run:{},
      s:{ sacroY:[], sacroX:[], fppaIzq:[], fppaDer:[], mkdIzq:[], mkdDer:[], sepRatio:[], troncoLat:[], alturaPx:[] },
      visPiernas:0, visTronco:0, orientFrontalN:0, orientN:0,
      // Trayectorias ALINEADAS por frame (mismo índice k = mismo instante; null si el punto no se vio),
      // para poder redibujar el esqueleto cuadro a cuadro en la reconstrucción.
      tray:{ sacro:[], nariz:[], hombroIzq:[], hombroDer:[], codoIzq:[], codoDer:[], munecaIzq:[], munecaDer:[],
             caderaIzq:[], caderaDer:[], rodillaIzq:[], rodillaDer:[], tobilloIzq:[], tobilloDer:[] },
      trayFrame:[], trayN:0, anclas:[] };
  }
  function _pushS(arr,i,v){ if(arr.length<4000) arr.push({i:i,v:v}); }
  function acumularSent(acc,f){
    if(!acc||!f) return;
    acc._frame++; acc.frames++;
    if(f.piernasOK) acc.visPiernas++;
    if(f.troncoOK) acc.visTronco++;
    if(f.orientFrontal!=null){ acc.orientN++; if(f.orientFrontal) acc.orientFrontalN++; }
    var i=acc._frame, alguno=false;
    // Histéresis de oclusión: exige 3 frames válidos SEGUIDOS por métrica de PROYECCIÓN (rodilla,
    // tobillo, tronco) antes de aceptarla, para descartar el parpadeo de landmarks distales al entrar/
    // salir de oclusión. El SACRO (punto medio de caderas, el más central y estable) y la ALTURA se
    // dejan sin filtrar: son el eje de la detección de repeticiones y del escalado, y filtrarlos
    // fragmentaría la segmentación en vez de mejorarla.
    var R=acc._run;
    function _g(k,ok){ R[k]=ok?((R[k]||0)+1):0; return ok && R[k]>=3; }
    if(f.sacro.ok){ _pushS(acc.s.sacroY,i,f.sacro.y); _pushS(acc.s.sacroX,i,f.sacro.x); alguno=true; }
    if(_g('fppaIzq',f.fppaIzq.ok)) _pushS(acc.s.fppaIzq,i,f.fppaIzq.val);
    if(_g('fppaDer',f.fppaDer.ok)) _pushS(acc.s.fppaDer,i,f.fppaDer.val);
    if(_g('mkdIzq',f.mkdIzq.ok)) _pushS(acc.s.mkdIzq,i,f.mkdIzq.val);
    if(_g('mkdDer',f.mkdDer.ok)) _pushS(acc.s.mkdDer,i,f.mkdDer.val);
    if(_g('sepRatio',f.sepRatio.ok)) _pushS(acc.s.sepRatio,i,f.sepRatio.val);
    if(_g('troncoLat',f.troncoLat.ok)) _pushS(acc.s.troncoLat,i,f.troncoLat.val);
    if(f.alturaPx!=null) _pushS(acc.s.alturaPx,i,f.alturaPx);
    if(f.midAnk && acc.anclas.length<4000) acc.anclas.push({x:f.midAnk.x,y:f.midAnk.y});
    if(alguno) acc.framesValidos++;
    if(acc.trayN<3600){
      var T=acc.tray, P=f.p||{};
      for(var k in T){ var pt=P[k]; T[k].push(pt?[Math.round(pt.x*1000), Math.round(pt.y*1000)]:null); }
      acc.trayFrame.push(i); acc.trayN++;
    }
  }

  // Cierra la toma frontal: detecta repeticiones por el descenso del sacro y lee cada métrica
  // POR REPETICIÓN (FPPA a media bajada; MKD/separación/tronco en el fondo). Con control de calidad:
  // visibilidad, orientación y cámara movida → 'confiable' por medida, nunca un número sin respaldo.
  function finalizarSent(acc, estaturaCm){
    var out={ nReps:0, medidas:[], porRep:[], calidad:{framesValidos:0}, calibracion:{estaturaCm:estaturaCm||null} };
    if(!acc) return out;
    var visPct = acc.frames ? Math.round(acc.visPiernas/acc.frames*100) : 0;
    var visPctTronco = acc.frames ? Math.round(acc.visTronco/acc.frames*100) : 0;
    var orientOK = acc.orientN ? (acc.orientFrontalN/acc.orientN)>=0.7 : null;
    var camMov=false;
    if(acc.anclas.length>20){   // ancla natural: pies plantados → si los tobillos derivan, se movió la cámara
      var xs=acc.anclas.map(function(a){return a.x;}).sort(function(a,b){return a-b;});
      var ys=acc.anclas.map(function(a){return a.y;}).sort(function(a,b){return a-b;});
      var nn=xs.length, sp=function(arr){ return arr[Math.floor(0.975*(nn-1))]-arr[Math.floor(0.025*(nn-1))]; };
      camMov=(sp(xs)>0.06 || sp(ys)>0.06);
    }
    out.calidad={ framesValidos:acc.framesValidos, frames:acc.frames, visPctPiernas:visPct, visPctTronco:visPctTronco, orientacionOK:orientOK, camaraMovida:camMov };
    var sacY=_medFilt5(acc.s.sacroY);
    if(sacY.length<12) return out;
    var hs=acc.s.alturaPx.map(function(s){return s.v;}).sort(function(a,b){return a-b;});
    var hPx=hs.length?hs[Math.floor(0.90*(hs.length-1))]:null;   // p90 = fase DE PIE (agachado se ve más bajo); p90, no máx, contra chispazos
    var hEst=hPx?hPx/0.88:null;                        // px de estatura (proxy nariz→tobillos ≈88%)
    if(!hEst) return out;
    var ys2=sacY.map(function(s){return s.v;}).sort(function(a,b){return a-b;});
    var yBase=ys2[Math.floor(0.05*(ys2.length-1))];    // de pie = sacro en su punto más alto (y mínima)
    var desc=sacY.map(function(s){ return {i:s.i, v:Math.max(0,(s.v-yBase)/hEst*100)}; });
    var reps=_detPicosIdx(desc, SENT_MIN_DESC, 8);
    out.nReps=reps.length;
    var fIzq=_medFilt5(acc.s.fppaIzq), fDer=_medFilt5(acc.s.fppaDer);
    var mIzq=_medFilt5(acc.s.mkdIzq), mDer=_medFilt5(acc.s.mkdDer);
    var sep=_medFilt5(acc.s.sepRatio), tro=_medFilt5(acc.s.troncoLat);
    function cerca(serie,iF){ if(iF==null) return null; var vals=[]; for(var k=0;k<serie.length;k++){ if(Math.abs(serie[k].i-iF)<=3) vals.push(serie[k].v); } return _mediana(vals); }
    reps.forEach(function(r,ix){
      // Frame a media BAJADA: retrocede desde el fondo hasta donde el descenso cae bajo el 50%
      // (no usar kIni: es la entrada de la histéresis al 55%, sesgaría el FPPA hacia el fondo).
      // Si la grabación EMPEZÓ ya abajo (rep parcial sin cruce del 50%), el FPPA de esa rep se
      // marca nulo en vez de leerse en zona degenerada (muslo horizontal → proyección inflada).
      var half=0.5*r.v, kM=r.k;
      while(kM>0 && desc[kM-1].v>=half) kM--;
      var iMedia=(kM===0 && desc[0].v>=half) ? null : desc[kM].i;
      out.porRep.push({ n:ix+1, frameFondo:r.i,
        fppaIzq:_r1(cerca(fIzq,iMedia)), fppaDer:_r1(cerca(fDer,iMedia)),
        mkdIzq:_r1(cerca(mIzq,r.i)), mkdDer:_r1(cerca(mDer,r.i)),
        sepRatio:_r2(cerca(sep,r.i)), troncoLat:_r1(cerca(tro,r.i)),
        descPct:Math.round(r.v), descCm:(estaturaCm?_r1(r.v*estaturaCm/100):null) });
    });
    function agrega(key,grupo,mov,lado,unidad,vals,extremoFn,visOk,muestras){
      var v=vals.filter(function(x){return x!=null;});
      var conf=!!(visOk && v.length>=1 && muestras>=12 && out.nReps>=1 && orientOK!==false && !camMov);
      out.medidas.push({ key:key, grupo:grupo, mov:mov, lado:lado, vista:'frontal', unidad:unidad,
        media:(v.length?_r1(_media(v)):null), extremo:(v.length?_r1(extremoFn(v)):null),
        de:(v.length>=2?_r1(_desv(v)):null), reps:v.length, confiable:conf, visPct:(lado==='—'&&grupo==='Tronco')?visPctTronco:visPct, muestras:muestras });
    }
    var vMax=function(v){return Math.max.apply(null,v);}, vMin=function(v){return Math.min.apply(null,v);};
    agrega('fppa_izq','Rodilla','Valgo dinámico FPPA (media bajada)','Izq','°', out.porRep.map(function(p){return p.fppaIzq;}), vMax, visPct>=60, acc.s.fppaIzq.length);
    agrega('fppa_der','Rodilla','Valgo dinámico FPPA (media bajada)','Der','°', out.porRep.map(function(p){return p.fppaDer;}), vMax, visPct>=60, acc.s.fppaDer.length);
    agrega('mkd_izq','Rodilla','Desplaz. medial en fondo (MKD)','Izq','%pelvis', out.porRep.map(function(p){return p.mkdIzq;}), vMax, visPct>=60, acc.s.mkdIzq.length);
    agrega('mkd_der','Rodilla','Desplaz. medial en fondo (MKD)','Der','%pelvis', out.porRep.map(function(p){return p.mkdDer;}), vMax, visPct>=60, acc.s.mkdDer.length);
    agrega('sep_rodillas','Rodilla','Separación rodillas/tobillos (fondo)','—','ratio', out.porRep.map(function(p){return p.sepRatio;}), vMin, visPct>=60, acc.s.sepRatio.length);
    agrega('tronco_lateral','Tronco','Inclinación lateral (fondo)','—','°', out.porRep.map(function(p){return p.troncoLat==null?null:Math.abs(p.troncoLat);}), vMax, visPctTronco>=60, acc.s.troncoLat.length);
    agrega('sacro_descenso','Pelvis','Descenso del sacro','—','%', out.porRep.map(function(p){return p.descPct;}), vMax, visPct>=60, sacY.length);
    return out;
  }
  // ═════════════ fin núcleo sentadilla ═════════════

  // ═════════════ FASE 3A — MARCHA (análisis SAGITAL, vista de PERFIL) ═════════════
  // Cribado 2D: parámetros temporales + cinemática sagital. Eventos del paso por el método de
  // COORDENADAS de Zeni et al. (Gait Posture 2008): contacto de talón = pie en su punto más
  // ADELANTADO respecto al sacro; despegue = punto más ATRASADO. Límites honestos: una sola
  // cámara ve un plano (sin rotaciones, sin cinética, sin EMG); el tobillo es el menos fiable.
  function calcularMarchaSagital(lm){
    if(!lm) return null;
    function vis(i){ return _vis(lm,i); }
    var out={ ok:false,
      hipIzq:{val:null,ok:false}, hipDer:{val:null,ok:false},
      rodIzq:{val:null,ok:false}, rodDer:{val:null,ok:false},
      tobIzq:{val:null,ok:false}, tobDer:{val:null,ok:false},
      footIzq:{val:null,ok:false}, footDer:{val:null,ok:false},
      noseRel:null, sacroX:null, alturaPx:null, orientPerfil:null, p:{} };
    var midHip=(vis(23)&&vis(24))?{x:(lm[23].x+lm[24].x)/2,y:(lm[23].y+lm[24].y)/2}:null;
    var midSh =(vis(11)&&vis(12))?{x:(lm[11].x+lm[12].x)/2,y:(lm[11].y+lm[12].y)/2}:null;
    if(!midHip) return out;
    var midHipOk=_finP(midHip);   // O1 (Fase 1b): cadera NaN con visibilidad alta → punto medio NO finito; no propagues NaN
    out.sacroX=midHipOk?midHip.x:null;
    // Orientación: de PERFIL los hombros/caderas se ven ESTRECHOS (ancho/alto pequeño). Inverso al frontal.
    if(midSh && _finP(midSh) && midHipOk){ var ancho=(Math.abs(lm[11].x-lm[12].x)+Math.abs(lm[23].x-lm[24].x))/2, alto=Math.abs(midSh.y-midHip.y)||1e-6; out.orientPerfil=(ancho/alto)<0.35; }
    if(vis(0) && midHipOk) out.noseRel=lm[0].x-midHip.x;     // nariz vs sacro → dirección de marcha (O1: exige sacro finito)
    // Cadera flexo-ext = ángulo SIGNADO muslo vs eje del tronco (ROM usa max−min → el signo no importa).
    function hipAng(hip,knee){ if(!midSh) return null; var ar=_ANG_AR||1;   // x escalada por aspecto (Fase 2): ángulo muslo–tronco real
      var tdx=(hip.x-midSh.x)*ar, tdy=hip.y-midSh.y, thx=(knee.x-hip.x)*ar, thy=knee.y-hip.y;
      var cross=tdx*thy-tdy*thx, dot=tdx*thx+tdy*thy; return Math.atan2(cross,dot)*180/Math.PI; }
    // Guarda de validez (Fase 1): finitud + segmento mínimo → sin esto, puntos coincidentes/NaN daban 180° ok:true.
    if(vis(23)&&vis(25)&&midSh&&_medible3(midSh,lm[23],lm[25])){ var hI=hipAng(lm[23],lm[25]); if(hI!=null) out.hipIzq={val:hI,ok:true}; }
    if(vis(24)&&vis(26)&&midSh&&_medible3(midSh,lm[24],lm[26])){ var hD=hipAng(lm[24],lm[26]); if(hD!=null) out.hipDer={val:hD,ok:true}; }
    if(vis(23)&&vis(25)&&vis(27)&&_medible3(lm[23],lm[25],lm[27])) out.rodIzq={val:180-_ang2D(lm[23],lm[25],lm[27]), ok:true};   // rodilla flex-ext
    if(vis(24)&&vis(26)&&vis(28)&&_medible3(lm[24],lm[26],lm[28])) out.rodDer={val:180-_ang2D(lm[24],lm[26],lm[28]), ok:true};
    if(vis(25)&&vis(27)&&vis(31)&&_medible3(lm[25],lm[27],lm[31])) out.tobIzq={val:_ang2D(lm[25],lm[27],lm[31]), ok:true};        // tobillo (interior pantorrilla-pie)
    if(vis(26)&&vis(28)&&vis(32)&&_medible3(lm[26],lm[28],lm[32])) out.tobDer={val:_ang2D(lm[26],lm[28],lm[32]), ok:true};
    if(vis(27)&&_finP(lm[27])&&midHipOk) out.footIzq={val:lm[27].x-midHip.x, ok:true};   // pos AP del pie vs sacro (eventos); O1: exige sacro finito
    if(vis(28)&&_finP(lm[28])&&midHipOk) out.footDer={val:lm[28].x-midHip.x, ok:true};
    if(vis(0)&&(vis(27)||vis(28))){ var ay=vis(27)?lm[27].y:lm[28].y; out.alturaPx=Math.abs(ay-lm[0].y); }
    out.ok=!!(out.rodIzq.ok||out.rodDer.ok);
    out.p={ nariz:vis(0)?lm[0]:null, sacro:midHipOk?midHip:null, hombroIzq:vis(11)?lm[11]:null, hombroDer:vis(12)?lm[12]:null,
      caderaIzq:vis(23)?lm[23]:null, caderaDer:vis(24)?lm[24]:null, rodillaIzq:vis(25)?lm[25]:null, rodillaDer:vis(26)?lm[26]:null,
      tobilloIzq:vis(27)?lm[27]:null, tobilloDer:vis(28)?lm[28]:null };
    return out;
  }
  function nuevoAccMarcha(){
    return { frames:0, framesValidos:0, _frame:0, _run:{}, orientN:0, orientPerfilN:0,
      s:{ hipI:[],hipD:[],rodI:[],rodD:[],tobI:[],tobD:[], footI:[],footD:[], altura:[], nose:[] },
      tray:{ nariz:[],sacro:[],hombroIzq:[],hombroDer:[],caderaIzq:[],caderaDer:[],rodillaIzq:[],rodillaDer:[],tobilloIzq:[],tobilloDer:[] },
      trayFrame:[], trayN:0 };
  }
  function acumularMarcha(acc,f,tSec){
    if(!acc||!f) return;
    acc._frame++; acc.frames++;
    // O5: sella el aspecto desde la fuente REAL cuando ya hay dimensiones (no hereda el aspecto de la fuente anterior);
    // si aún no las hay, queda null y se sella en un cuadro posterior (finalizarMarcha cae a _ANG_AR si nunca llegan).
    if(acc.aspect==null && BIO.srcEl && BIO.srcEl.videoWidth>0 && BIO.srcEl.videoHeight>0) acc.aspect=BIO.srcEl.videoWidth/BIO.srcEl.videoHeight;
    if(tSec==null) tSec=acc._frame/(FPS_CAMARA||20);
    if(f.orientPerfil!=null){ acc.orientN++; if(f.orientPerfil) acc.orientPerfilN++; }
    var i=acc._frame, R=acc._run, alguno=false;
    function g(k,ok){ R[k]=ok?((R[k]||0)+1):0; return ok&&R[k]>=3; }   // histéresis de oclusión (ángulos)
    function push(arr,v){ if(arr.length<6000) arr.push({i:i,t:tSec,v:v}); }
    if(g('hipI',f.hipIzq.ok)) push(acc.s.hipI,f.hipIzq.val);
    if(g('hipD',f.hipDer.ok)) push(acc.s.hipD,f.hipDer.val);
    if(g('rodI',f.rodIzq.ok)){ push(acc.s.rodI,f.rodIzq.val); alguno=true; }
    if(g('rodD',f.rodDer.ok)){ push(acc.s.rodD,f.rodDer.val); alguno=true; }
    if(g('tobI',f.tobIzq.ok)) push(acc.s.tobI,f.tobIzq.val);
    if(g('tobD',f.tobDer.ok)) push(acc.s.tobD,f.tobDer.val);
    // pies y nariz SIN histéresis: son la señal de eventos/dirección, deben quedar continuos
    if(f.footIzq.ok) push(acc.s.footI,f.footIzq.val);
    if(f.footDer.ok) push(acc.s.footD,f.footDer.val);
    if(f.noseRel!=null) push(acc.s.nose,f.noseRel);
    if(f.alturaPx!=null) push(acc.s.altura,f.alturaPx);
    if(alguno) acc.framesValidos++;
    if(acc.trayN<5400){ var T=acc.tray,P=f.p||{}; for(var k in T){ var pt=P[k]; T[k].push(pt?[Math.round(pt.x*1000),Math.round(pt.y*1000)]:null); } acc.trayFrame.push(i); acc.trayN++; }
  }
  // Eventos del paso en una serie de posición AP del pie ORIENTADA (+ = adelante). Máquina de estados
  // con banda muerta: HS = máximo de cada excursión adelante; TO = mínimo de cada excursión atrás.
  function _eventosPie(serie){
    var out={hs:[],to:[]};
    if(!serie || serie.length<8) return out;
    var v=serie.map(function(s){return s.v;}).slice().sort(function(a,b){return a-b;}), n=v.length;
    var lo=v[Math.floor(0.05*(n-1))], hi=v[Math.floor(0.95*(n-1))], rng=hi-lo;
    if(rng<=1e-6) return out;
    var mid=(lo+hi)/2, band=0.20*rng, hiTh=mid+band, loTh=mid-band;
    var mode=null, maxV=-Infinity,maxK=-1, minV=Infinity,minK=-1;
    for(var k=0;k<serie.length;k++){
      var x=serie[k].v;
      if(x>=hiTh){
        if(mode==='down' && minK>=0){ out.to.push({i:serie[minK].i,t:serie[minK].t}); }
        if(mode!=='up'){ mode='up'; maxV=-Infinity; maxK=-1; }
        if(x>maxV){ maxV=x; maxK=k; }
      } else if(x<=loTh){
        if(mode==='up' && maxK>=0){ out.hs.push({i:serie[maxK].i,t:serie[maxK].t}); }
        if(mode!=='down'){ mode='down'; minV=Infinity; minK=-1; }
        if(x<minV){ minV=x; minK=k; }
      } else {
        if(mode==='up' && x>maxV){ maxV=x; maxK=k; }
        if(mode==='down' && x<minV){ minV=x; minK=k; }
      }
    }
    if(mode==='up' && maxK>=0) out.hs.push({i:serie[maxK].i,t:serie[maxK].t});
    else if(mode==='down' && minK>=0) out.to.push({i:serie[minK].i,t:serie[minK].t});
    return out;
  }
  function finalizarMarcha(acc, estaturaCm, treadmillKmh){
    var out={ nCiclos:0, cadencia:null, velocidad:null, walkDir:1,
      temporal:{izq:null,der:null}, espacial:{}, sagital:{}, simetria:{}, medidas:[],
      calidad:{framesValidos:(acc&&acc.framesValidos)||0},
      calibracion:{estaturaCm:estaturaCm||null, treadmillKmh:treadmillKmh||null} };
    if(!acc) return out;
    // ASPECTO (Fase 2): la longitud de paso mezclaba una distancia X (fracción de ANCHO) con una escala
    // derivada de Y (altura-proxy). Sin corregir, 9:16 y 16:9 daban el mismo metraje (falso). Se escala la
    // distancia X por el aspecto de la fuente (acc.aspect; global _ANG_AR como respaldo documentado).
    var arM=(acc && acc.aspect!=null)?acc.aspect:(_ANG_AR||1);
    var visPct=acc.frames?Math.round(acc.framesValidos/acc.frames*100):0;
    var orientOK=acc.orientN?((acc.orientPerfilN/acc.orientN)>=0.6):null;
    out.calidad={ framesValidos:acc.framesValidos, frames:acc.frames, visPct:visPct, orientPerfilOK:orientOK };
    var med=_mediana(acc.s.nose.map(function(s){return s.v;}));
    out.walkDir=(med!=null && med<0)?-1:1;
    // _medFilt5 devuelve {i,v} (pierde t) → suavizamos v pero conservamos el t original de cada muestra.
    function orient(serie){ var m=_medFilt5(serie); return serie.map(function(s,k){ return {i:s.i, t:s.t, v:(m[k]?m[k].v:s.v)*out.walkDir}; }); }
    var fI=orient(acc.s.footI), fD=orient(acc.s.footD);
    var evI=_eventosPie(fI), evD=_eventosPie(fD);
    function temporal(ev){
      var hs=ev.hs, to=ev.to; if(hs.length<2) return null;
      var strides=[], stances=[];
      for(var i=0;i<hs.length-1;i++){
        var t0=hs[i].t, t1=hs[i+1].t, stride=t1-t0, toA=null;
        for(var j=0;j<to.length;j++){ if(to[j].t>t0 && to[j].t<t1){ toA=to[j].t; break; } }
        if(stride>0.4 && stride<2.5){ strides.push(stride); if(toA!=null) stances.push(toA-t0); }
      }
      if(!strides.length) return null;
      var strideT=_media(strides), stanceT=stances.length?_media(stances):null;
      var stancePct=(stanceT!=null&&strideT)?stanceT/strideT*100:null;
      return { nCiclos:strides.length, strideT:strideT, stanceT:stanceT,
        swingT:(stanceT!=null)?strideT-stanceT:null, stancePct:stancePct, swingPct:(stancePct!=null)?100-stancePct:null };
    }
    var tI=temporal(evI), tD=temporal(evD);
    out.temporal.izq=tI; out.temporal.der=tD;
    out.nCiclos=Math.max(tI?tI.nCiclos:0, tD?tD.nCiclos:0);
    var allHS=evI.hs.map(function(e){return e.t;}).concat(evD.hs.map(function(e){return e.t;})).sort(function(a,b){return a-b;});
    if(allHS.length>=2){ var span=allHS[allHS.length-1]-allHS[0]; if(span>0) out.cadencia=Math.round((allHS.length-1)/span*60); }
    // CÁMARA LENTA / FPS IRREGULAR (VFR): si el ritmo es inverosímil, los TIEMPOS del video no son fiables
    // (una grabación en cámara lenta da cadencias absurdas). Los ángulos sagitales (geometría por cuadro) sí.
    out.calidad.tiempoDudoso = _cadenciaDudosa(out.cadencia);
    if(out.calidad.tiempoDudoso) out.calidad.tiempoDudosoMsg = 'El ritmo calculado ('+out.cadencia+' pasos/min) es atípico. Si el video es en cámara lenta o acelerada, los tiempos (cadencia, fase de apoyo, doble apoyo, longitud de paso y velocidad) NO son fiables; el ángulo de rodilla/cadera sí.';
    // Doble apoyo %: solape de los intervalos de apoyo (HS→siguiente TO) de ambos pies.
    function stances(ev){ var o=[]; for(var i=0;i<ev.hs.length;i++){ var h=ev.hs[i].t, toA=null; for(var j=0;j<ev.to.length;j++){ if(ev.to[j].t>h){ toA=ev.to[j].t; break; } } if(toA!=null && (toA-h)>0.15 && (toA-h)<1.6) o.push([h,toA]); } return o; }
    var stI=stances(evI), stD=stances(evD), overlap=0;
    stI.forEach(function(a){ stD.forEach(function(b){ var l=Math.max(a[0],b[0]), r=Math.min(a[1],b[1]); if(r>l) overlap+=r-l; }); });
    if(allHS.length>=2){ var sp=allHS[allHS.length-1]-allHS[0]; out.espacial.dobleApoyoPct=(sp>0)?Math.round(overlap/sp*100):null; }
    // Calibración px→m (proxy nariz→tobillo ≈ 88% de la estatura, como en sentadilla).
    var altSorted=acc.s.altura.map(function(s){return s.v;}).sort(function(a,b){return a-b;});
    var hPx=altSorted.length?altSorted[Math.floor(0.90*(altSorted.length-1))]:null, hFull=hPx?hPx/0.88:null;
    var pxToM=(estaturaCm&&hFull)?(estaturaCm/100)/hFull:null;
    function nearestV(serie,t){ var best=null,bd=1e9; for(var k=0;k<serie.length;k++){ var d=Math.abs(serie[k].t-t); if(d<bd){bd=d;best=serie[k].v;} } return best; }
    var stepPx=[]; allHS.forEach(function(t){ var a=nearestV(fI,t), b=nearestV(fD,t); if(a!=null&&b!=null) stepPx.push(Math.abs(a-b)*arM); });   // distancia AP (X) · aspecto (Fase 2)
    var stepLenPx=stepPx.length?_media(stepPx):null;
    out.espacial.stepLenM=(stepLenPx!=null&&pxToM)?_r2(stepLenPx*pxToM):null;
    if(treadmillKmh){ out.velocidad=_r2(treadmillKmh/3.6); }
    else if(out.espacial.stepLenM!=null && out.cadencia){ out.velocidad=_r2(out.espacial.stepLenM*(out.cadencia/60)); }
    function romPorCiclo(serie, ev){
      if(!serie||serie.length<3) return {rom:null,peak:null,n:0};
      if(!ev.hs||ev.hs.length<2){ var vv=serie.map(function(s){return s.v;}); return {rom:_r1(Math.max.apply(null,vv)-Math.min.apply(null,vv)), peak:_r1(Math.max.apply(null,vv)), n:0}; }
      var roms=[],peaks=[];
      for(var i=0;i<ev.hs.length-1;i++){ var a=ev.hs[i].t,b=ev.hs[i+1].t, seg=serie.filter(function(s){return s.t>=a&&s.t<=b;}).map(function(s){return s.v;});
        if(seg.length>=3){ roms.push(Math.max.apply(null,seg)-Math.min.apply(null,seg)); peaks.push(Math.max.apply(null,seg)); } }
      if(!roms.length) return {rom:null,peak:null,n:0};
      return { rom:_r1(_media(roms)), peak:_r1(_media(peaks)), n:roms.length };
    }
    var rodI=romPorCiclo(acc.s.rodI,evI), rodD=romPorCiclo(acc.s.rodD,evD);
    var hipI=romPorCiclo(acc.s.hipI,evI), hipD=romPorCiclo(acc.s.hipD,evD);
    var tobI=romPorCiclo(acc.s.tobI,evI), tobD=romPorCiclo(acc.s.tobD,evD);
    out.sagital={ rodIzqPeak:rodI.peak, rodDerPeak:rodD.peak, rodIzqROM:rodI.rom, rodDerROM:rodD.rom,
      hipIzqROM:hipI.rom, hipDerROM:hipD.rom, tobIzqROM:tobI.rom, tobDerROM:tobD.rom };
    function sim(a,b){ if(a==null||b==null) return null; var m=(Math.abs(a)+Math.abs(b))/2; if(m<1e-6) return 100; return Math.max(0,Math.round(100-Math.abs(a-b)/m*100)); }
    out.simetria={ stancePct:sim(tI&&tI.stancePct,tD&&tD.stancePct), rodPeak:sim(rodI.peak,rodD.peak),
      hipROM:sim(hipI.rom,hipD.rom), strideT:sim(tI&&tI.strideT,tD&&tD.strideT) };
    var nMin=Math.min(tI?tI.nCiclos:0, tD?tD.nCiclos:0);
    function med2(key,grupo,mov,lado,unidad,valor,nCic){
      var esTemporal=(grupo==='Temporal'||grupo==='Espacial');   // tiempos/distancias dependen de que los fps del video sean reales
      var conf=!!(valor!=null && nCic>=2 && orientOK!==false && visPct>=50 && !(esTemporal && out.calidad.tiempoDudoso));
      out.medidas.push({ key:key,grupo:grupo,mov:mov,lado:lado,vista:'sagital',unidad:unidad,
        valor:(valor==null?null:_r1(valor)), confiable:conf, nCiclos:nCic }); }
    med2('cadencia','Temporal','Cadencia','—','pasos/min', out.cadencia, out.nCiclos);
    med2('doble_apoyo','Temporal','Doble apoyo','—','%', out.espacial.dobleApoyoPct, out.nCiclos);
    med2('stance_izq','Temporal','Fase de apoyo','Izq','%', tI&&tI.stancePct, tI?tI.nCiclos:0);
    med2('stance_der','Temporal','Fase de apoyo','Der','%', tD&&tD.stancePct, tD?tD.nCiclos:0);
    med2('paso_long','Espacial','Longitud de paso','—','m', out.espacial.stepLenM, out.nCiclos);
    med2('rod_pico_izq','Rodilla','Flexión pico','Izq','°', rodI.peak, rodI.n);
    med2('rod_pico_der','Rodilla','Flexión pico','Der','°', rodD.peak, rodD.n);
    med2('cadera_rom_izq','Cadera','ROM flexo-ext','Izq','°', hipI.rom, hipI.n);
    med2('cadera_rom_der','Cadera','ROM flexo-ext','Der','°', hipD.rom, hipD.n);
    med2('tobillo_rom_izq','Tobillo','ROM (menos fiable)','Izq','°', tobI.rom, tobI.n);
    med2('tobillo_rom_der','Tobillo','ROM (menos fiable)','Der','°', tobD.rom, tobD.n);
    return out;
  }
  // ═════════════ fin núcleo marcha ═════════════

  // ── Identidad de generación (P1-6): descarta resultados TARDÍOS de una medición anterior ──
  // Cada cambio de fuente o selección (cámara/video/foto/voltear/tipo/goniómetro) incrementa BIO.gen.
  // Cada send() de streaming encola su gen; onResults saca el más viejo (FIFO) y, si no coincide con
  // la generación vigente, el cuadro quedó en vuelo de una medición anterior → se descarta (framesDescartados).
  // Supuesto FIFO (MediaPipe no ecoa metadatos): send()→onResults es 1:1 y en orden; el candado de 32 + el
  // shift del watchdog mantienen la cola acotada y auto-sanable. RESIDUAL conocido (O3; cross-generación YA
  // resuelto): si un send colgado que el watchdog ya "soltó" (shift) resuelve TARDE (<2.5 s), su callback
  // consume el gen del send fresco y un cuadro algo viejo de la MISMA medición se acepta (y el fresco cae al
  // fallback). Es intra-medición y acotado a 2.5 s; NO mezcla mediciones de generaciones distintas.
  function _bumpGen(){
    BIO.gen = (BIO.gen||0) + 1; BIO._handsLm = null;   // manos frescas: no cruzar fuente/selección
    // (V3.1 P0) una generación nueva INVALIDA todo lo que estaba en vuelo y la tupla "cuadro actual":
    // los contextos de cuadro pendientes se barren y sus rasters vuelven al pool. El PICO materializado
    // (accG.peak + su snapshot) NO se toca aquí: ya es evidencia completa de SU cuadro y lo limpian los
    // cambios de selección/fuente (resetGonio/BIO_gonioSel), no un hipo del watchdog.
    try{
      if(BIO._frQ && BIO._frQ.length){
        // (V3.2 P0-03) cada contexto barrido tiene un callback de Pose EN VUELO que ya no es atribuible
        // con certeza (la API no ecoa ids): pasa a deuda AMBIGUA — los próximos callbacks se descartan
        // SIN emparejar (y sacrifican al posible dueño vivo), llegue cada uno en el orden que llegue.
        BIO._poseAmb = (BIO._poseAmb||0) + BIO._frQ.length;
        for(var _bi=0;_bi<BIO._frQ.length;_bi++){ _frSoltar(BIO._frQ[_bi].fr); } BIO._frQ.length=0;
      }
      if(BIO._frPend){ _frSoltar(BIO._frPend.fr); BIO._frPend=null; }   // su pose YA llegó: no es deuda
      if(BIO._frRet){ _frSoltar(BIO._frRet.fr); BIO._frRet=null; }
      BIO._frProcHands=null;
    }catch(_bg){}
  }
  // ── (V3.1 P0) POOL DE RASTERS: cada cuadro de goniómetro se CONGELA antes de enviarse ──
  // Un canvas del pool queda "busy" mientras su cuadro está en vuelo o retenido como "cuadro actual";
  // tope 4 (en vuelo ≤2 por los candados sending + 1 retenido + 1 margen). Nunca se dibuja encima de un
  // raster en vuelo: el resultado del modelo siempre corresponde byte a byte a su imagen.
  function _frTomar(){
    var pool=(BIO._frPool || (BIO._frPool=[]));
    for(var i=0;i<pool.length;i++){ if(!pool[i].busy){ pool[i].busy=true; return pool[i]; } }
    if(pool.length<4){ var f={ cv:document.createElement('canvas'), busy:true }; pool.push(f); return f; }
    // Pool agotado = contextos muertos de una generación anterior → recupera el más viejo inválido.
    var q=BIO._frQ||[];
    for(var j=0;j<q.length;j++){ if(q[j].gen!==(BIO.gen||0)){ var d=q.splice(j,1)[0]; d.fr.busy=true; return d.fr; } }
    // (V3.2) TECHO DURO: con los 4 rasters ocupados y nada recuperable, el CUADRO se descarta de forma
    // controlada (null → _gonioSendFrame lo salta SIN enviar). Saltar un cuadro de stream no pierde
    // ninguna MEDICIÓN (el siguiente tick trae otro); crecer el pool sin tope sí arriesgaba memoria en
    // iOS (hallazgo auditoría V3.1). Contador de diagnóstico: BIO._frPoolAgotado.
    BIO._frPoolAgotado = (BIO._frPoolAgotado||0) + 1;
    return null;
  }
  function _frSoltar(fr){ if(fr) fr.busy=false; }
  // Resultado de Hands para un frameId: si el cuadro con ese id está DIFERIDO esperando su mano
  // (lockstep de muñeca), lo completa y dispara su procesamiento; si aún está en vuelo en la cola,
  // le sella la mano para cuando llegue su pose. hs=[] significa "se buscó mano en ESTE cuadro y no hay".
  function _frResolverPend(fid, hs){
    if(fid==null) return;
    try{
      if(BIO._frPend && BIO._frPend.frameId===fid){
        var p=BIO._frPend; BIO._frPend=null; p.handsLm=hs; p.handsListo=true;
        _gonioProcesarCuadro(p, p.poseLm);
        return;
      }
      var q=BIO._frQ||[];
      for(var i=0;i<q.length;i++){ if(q[i].frameId===fid){ q[i].handsLm=hs; q[i].handsListo=true; return; } }
    }catch(_rp){}
  }
  // Envío de un cuadro de GONIÓMETRO (cámara en vivo y video): congela el cuadro a un raster INMUTABLE
  // del pool (con la rotación de decúbito ya aplicada — también es el fix HEVC/iOS: canvas 2D, no el
  // elemento), le asocia un contexto {gen, frameId, mediaTime, w, h, rot} y manda ESE raster a Pose
  // (y, en muñeca, el MISMO raster a Hands en LOCKSTEP: si Hands sigue ocupado, el cuadro se salta —
  // menor FPS verificable antes que mezclar manos de otro cuadro). El emparejado resultado↔cuadro es
  // por cola FIFO (la API no ecoa ids) y cualquier reset/watchdog invalida por generación.
  function _gonioSendFrame(el, mediaT){
    var w=el.videoWidth||el.naturalWidth||el.width||0, h=el.videoHeight||el.naturalHeight||el.height||0;
    if(!w||!h) return Promise.resolve();
    var rot=BIO._gonioRot||0;
    // MUÑECA lockstep: decide ANTES de congelar (si se salta el cuadro, no se toma raster del pool).
    var mandarHands = _munecaActiva() && !!BIO.hands;
    if(mandarHands && BIO._handsSending){
      if(BIO._handsSendAt && (Date.now()-BIO._handsSendAt)>2500){
        // (V3.2) Hands colgado: el JOB se declara PERDIDO. Su callback, si algún día llega, cae por
        // epoch (instancia retirada) o se drena por conteo (_handsStale, misma instancia) — JAMÁS
        // consume el id de un job nuevo. El lock lo libera SOLO este watchdog (dueño del cierre); la
        // promesa del job vencido no desbloquea al sucesor (guard por job en su .then/.catch). La
        // pérdida de POSE de la generación barrida queda DECLARADA (drenaje FIFO) para que el primer
        // cuadro tras la recuperación sí se mida.
        var _jv=BIO._handsJob;
        if(_jv && !_jv.resuelto){ _jv.perdido=true; BIO._handsStale=(BIO._handsStale||0)+1; }
        BIO._handsJob=null; BIO._handsSending=false;
        _handsRetirarInstancia();
        _bumpGen(); _poseDeclararPerdidos();
      }
      return Promise.resolve();   // Hands aún procesando el cuadro anterior → este cuadro se salta completo
    }
    var fr=_frTomar();
    if(!fr) return Promise.resolve();   // (V3.2) pool al techo duro: cuadro saltado de forma controlada
    var cv=fr.cv;
    // Tope 1600 px por lado (igual que las capturas V3): los landmarks son normalizados (idénticos) y el
    // pool queda acotado en memoria aun con cámara/video de alta resolución (presupuesto de píxeles iOS).
    var capL=1600, maxDim=Math.max(w,h), escF=(maxDim>capL)?capL/maxDim:1;
    var sw=Math.max(1,Math.round(w*escF)), sh=Math.max(1,Math.round(h*escF));
    var dw=(rot===90||rot===-90)?sh:sw, dh=(rot===90||rot===-90)?sw:sh;
    if(cv.width!==dw||cv.height!==dh){ cv.width=dw; cv.height=dh; }
    var x=cv.getContext('2d');
    try{
      x.setTransform(1,0,0,1,0,0);
      if(rot===90){ x.translate(dw,0); x.rotate(Math.PI/2); }
      else if(rot===-90){ x.translate(0,dh); x.rotate(-Math.PI/2); }
      else if(rot===180){ x.translate(dw,dh); x.rotate(Math.PI); }
      x.drawImage(el,0,0,sw,sh);
      x.setTransform(1,0,0,1,0,0);
    }catch(_d){ _frSoltar(fr); return Promise.resolve(); }
    var ctxF={ fr:fr, gen:(BIO.gen||0), frameId:(++BIO._frSeq||(BIO._frSeq=1)), t:(mediaT!=null?mediaT:null),
               adq:Date.now(), w:dw, h:dh, rot:rot, handsSent:false, handsLm:undefined, handsListo:false };
    if(mandarHands){
      ctxF.handsSent=true;
      // (V3.2 P0-02) UNA inferencia en vuelo por instancia, con identidad de JOB: el .then/.catch de
      // ESTE send libera exclusivamente el job que lo creó. La resolución tardía de un job vencido
      // (que el watchdog ya cerró) encuentra _handsJob apuntando a OTRO job y no toca el lock del
      // sucesor ni dispara un tercer envío concurrente.
      var _hjob={ frameId:ctxF.frameId, gen:ctxF.gen, epoch:(BIO._handsEpoch||0), perdido:false, resuelto:false };
      BIO._handsJob=_hjob; BIO._handsSending=true; BIO._handsSendAt=Date.now();
      try{
        BIO.hands.send({ image: cv }).then(function(){
          if(ctxF._huerfano){ _frSoltar(fr); ctxF._huerfano=false; }
          if(BIO._handsJob===_hjob){ BIO._handsJob=null; BIO._handsSending=false; }
        }).catch(function(){
          if(ctxF._huerfano){ _frSoltar(fr); ctxF._huerfano=false; }
          if(BIO._handsJob===_hjob){
            BIO._handsJob=null; BIO._handsSending=false;
            _frResolverPend(_hjob.frameId, []);   // el callback no llegará: cuadro "sin mano buscada"
          } else if(_hjob.perdido && (BIO._handsStale||0)>0){
            BIO._handsStale--;                    // contado como huérfano, pero su callback jamás vendrá
          }
        });
      }catch(_h){
        BIO._handsSending=false; BIO._handsJob=null; ctxF.handsSent=false;
      }
    }
    // (V3.2) el goniómetro ya NO empuja a la cola global de generaciones (_genQ): su emparejado es por
    // el contexto de SU envío (_frQ) + contadores de deuda — ver la rama gonio de onResults.
    (BIO._frQ || (BIO._frQ=[])).push(ctxF);
    try{ return BIO.pose.send({ image: cv }); }
    catch(_s){
      // send de Pose tronó síncrono: deshaz la cola de ESTE envío. El raster vuelve al pool solo si
      // Hands no lo está leyendo; si iba en vuelo a Hands, lo libera SU promesa al terminar (_huerfano).
      try{ var fi=BIO._frQ.indexOf(ctxF); if(fi>=0) BIO._frQ.splice(fi,1); }catch(_u){}
      if(ctxF.handsSent){ ctxF._huerfano=true; } else { _frSoltar(fr); }
      return Promise.resolve();
    }
  }
  function _genSend(img){
    (BIO._genQ || (BIO._genQ=[])).push(BIO.gen||0);
    if(BIO._genQ.length > 32) BIO._genQ.shift();   // candado: un send() colgado que nunca devolvió no crece la cola sin fin
    return BIO.pose.send({ image: img });
  }

  // ── Callback único de resultados de MediaPipe ──────────────────────────────
  function onResults(res){
    // MODO FOTO: una sola imagen estática → solo guardamos el resultado y salimos (lo procesa procesarFoto).
    // La foto está serializada con pose.reset() y se consume por BIO._fotoRes → NO pasa por la cola de generación.
    if(BIO.modo==='foto'){ BIO._fotoRes = res; return; }
    // (V3.2 P0-03) DEUDA del goniómetro PRIMERO, sea cual sea el tipo vigente — así un callback de un
    // cuadro barrido no contamina NINGÚN acumulador (ni el gonio nuevo, ni marcha/sentadilla si se
    // cambió de tipo con envíos en vuelo):
    //  · _poseStale = pérdidas DECLARADAS por watchdog → se drenan en orden (FIFO declarado) y el
    //    flujo siguiente empareja limpio.
    //  · _poseAmb = cambio de generación con callbacks en vuelo y SIN watchdog → el orden de entrega
    //    no es verificable (la API no ecoa ids): este callback es AMBIGUO → se descarta Y se sacrifica
    //    el contexto vivo más viejo (su callback real pudo ser éste u otro: JAMÁS se adivina). Costo:
    //    ~1-2 cuadros tras un cambio de selección con send en vuelo; a cambio, un resultado viejo
    //    NUNCA se une a un raster nuevo, llegue en el orden que llegue.
    if((BIO._poseStale||0)>0){
      BIO._poseStale--; BIO.framesDescartados=(BIO.framesDescartados||0)+1;
      return;
    }
    if((BIO._poseAmb||0)>0){
      BIO._poseAmb--; BIO.framesDescartados=(BIO.framesDescartados||0)+1;
      if(BIO.tipoMedicion==='gonio' && BIO._frQ && BIO._frQ.length){ _frSoltar(BIO._frQ.shift().fr); }
      return;
    }
    if(BIO.tipoMedicion==='gonio'){
      // (V3.2 P0) El goniómetro NO usa la cola global de generaciones: el emparejado es por el contexto
      // congelado de SU envío (cabeza de _frQ, generación vigente). Sin deuda pendiente (arriba), la
      // paridad 1:1 con la instancia única es sólida; un resultado SIN contexto vigente es huérfano y
      // se DESCARTA — jamás se reasigna al primer id fresco de una cola.
      var fcG=(BIO._frQ && BIO._frQ.length && BIO._frQ[0].gen===(BIO.gen||0)) ? BIO._frQ.shift() : null;
      if(!fcG){
        if(BIO._frQ && BIO._frQ.length && BIO._frQ[0].gen!==(BIO.gen||0)){ _frSoltar(BIO._frQ.shift().fr); }
        BIO.framesDescartados=(BIO.framesDescartados||0)+1;
        return;
      }
      var lmG = res && res.poseLandmarks;
      if(fcG.handsSent && !fcG.handsListo){
        fcG.poseLm = lmG; BIO._frPend = fcG;
        return;   // lo completa _frResolverPend cuando llegue la mano de este mismo cuadro (lockstep)
      }
      _gonioProcesarCuadro(fcG, lmG);
      return;
    }
    // IDENTIDAD DE GENERACIÓN (P1-6, modos NO goniómetro): saca el gen más viejo encolado por su send();
    // si NO es la generación vigente, el cuadro quedó en vuelo de una medición anterior (cambió
    // fuente/selección, o el watchdog liberó un send colgado) → se DESCARTA. Sustituye a _dropStale.
    var _gi = (BIO._genQ && BIO._genQ.length) ? BIO._genQ.shift() : (BIO.gen||0);
    if(_gi !== (BIO.gen||0)){
      BIO.framesDescartados=(BIO.framesDescartados||0)+1;
      return;
    }
    // Fija el aspecto real de la fuente (ancho/alto) para que los ángulos 2D no se deformen en vertical (H1).
    if(BIO.srcEl && BIO.srcEl.videoWidth){ if(BIO._gonioRot===90||BIO._gonioRot===-90) _setAspect(BIO.srcEl.videoHeight, BIO.srcEl.videoWidth); else _setAspect(BIO.srcEl.videoWidth, BIO.srcEl.videoHeight); }
    var lm = res && res.poseLandmarks;
    var world = res && res.poseWorldLandmarks;
    if(BIO.tipoMedicion==='marcha'){
      var fm = lm ? calcularMarchaSagital(lm) : null;
      if(fm && (BIO.recording || BIO.procesandoVideo)){
        var tSec=(BIO.modo==='video' && BIO.srcEl) ? (BIO.srcEl.currentTime||0) : ((Date.now()-BIO.tStart)/1000);
        acumularMarcha(BIO.accM, fm, tSec);
      }
      if(BIO.canvas && BIO.srcEl) dibujar(lm, null);
      if(BIO.modo==='camara'){ actualizarPanelMarcha(fm); actualizarGateMarcha(lm, fm); }
      return;
    }
    if(BIO.tipoMedicion==='sent'){
      var f = lm ? calcularSentFrontal(lm) : null;
      if(f && (BIO.recording || BIO.procesandoVideo)){
        if(BIO.accS && !BIO.accS.aspect && BIO.video && BIO.video.videoWidth){ BIO.accS.aspect = BIO.video.videoWidth/BIO.video.videoHeight; }
        acumularSent(BIO.accS, f);
      }
      if(BIO.canvas && BIO.srcEl){ dibujar(lm, null); dibujarSentVivo(f); }
      if(BIO.modo==='camara'){ actualizarPanelSent(f); actualizarGateSent(lm, f); }
      return;
    }
    var ang = (lm && world) ? calcularAngulos(world, lm) : null;
    if(ang && (BIO.recording || BIO.procesandoVideo)) acumular(BIO.acc, ang);
    if(BIO.canvas && BIO.srcEl) dibujar(lm, ang);
    if(BIO.modo==='camara'){ actualizarPanelVivo(ang); actualizarGateGrabacion(lm); }
  }

  // ── (V3.1 P0) Procesamiento de UN cuadro de goniómetro YA emparejado con su contexto ──
  // fc = {fr(raster inmutable del pool), frameId, t(mediaTime), w, h, gen, handsSent, handsLm} o null
  // (seguridad legada: resultado sin contexto). El aspecto, las manos y TODOS los snapshots (lectura
  // del cuadro, pico, "cuadro actual") salen de ESTE cuadro exacto — nunca del stream visible.
  function _gonioProcesarCuadro(fc, lm){
    if(fc && fc.gen!==(BIO.gen||0)){ _frSoltar(fc.fr); return; }   // diferido que quedó de otra generación
    var sg=BIO.accG&&BIO.accG.sel;
    if(fc) _setAspect(fc.w, fc.h);
    // Manos del MISMO cuadro: array = manos de este frameId; [] = se buscó mano y no hay; null = este
    // cuadro no llevó Hands (detector no cargado / no es muñeca) → aplica el fallback de índice.
    BIO._frProcHands = (fc && fc.handsSent) ? (fc.handsLm || []) : null;
    var rg = (lm && sg) ? calcularGonio(lm, sg.grupo, sg.mov, sg.lado) : {ok:false,val:null};
    var mejoroG = procesarGonioFrame(rg);
    // TUPLA "CUADRO ACTUAL": el último cuadro CON detección queda RETENIDO completo (raster + landmarks +
    // resultado + aspecto + frameId + tiempo). La captura "Cuadro actual" copia de AQUÍ, no del stream.
    if(fc && lm){
      try{
        if(BIO._frRet && BIO._frRet.fr!==fc.fr) _frSoltar(BIO._frRet.fr);
        BIO._frRet={ fr:fc.fr, frameId:fc.frameId, t:fc.t, adq:fc.adq, w:fc.w, h:fc.h, gen:fc.gen,
                     lm:_copiaLm(lm), r:rg, ar:_ANG_AR,
                     hands:(fc.handsSent?_copiaManosLm(fc.handsLm||[]):null) };
        // compat: _liveLm/_liveR/_liveAR apuntan a la MISMA tupla (lectores existentes del panel/captura)
        BIO._liveLm=BIO._frRet.lm; BIO._liveR=rg; BIO._liveAR=_ANG_AR;
      }catch(_l){ _frSoltar(fc.fr); }
    } else if(fc){ _frSoltar(fc.fr); }   // cuadro sin cuerpo: el raster vuelve al pool
    // PICO: landmarks + resultado del cuadro que lo produjo (trazabilidad) …
    if(mejoroG && lm){ try{ BIO._peakGonioLm=_copiaLm(lm); BIO._peakGonioAR=_ANG_AR; BIO._peakGonioR=rg; }catch(_g){} }
    // … y su IMAGEN: copia del raster congelado de ESTE envío (fc.fr.cv) — nunca del elemento visible,
    // que sigue avanzando durante la inferencia. frameId y tiempo quedan sellados con el snapshot.
    if(mejoroG && lm && fc){ try{
      if(BIO.modo==='video'){
        BIO._peakFrameCanvas=_canvasDeImagen(fc.fr.cv);
        BIO._peakFrameLm=_copiaLm(lm);
        BIO._peakTSeg=(fc.t!=null?fc.t:0);
        BIO._peakHandsLm=(fc.handsSent?_copiaManosLm(fc.handsLm||[]):null);
        BIO._peakFrameId=fc.frameId;
        BIO._peakAdq=fc.adq;      // (V3.2) UTC de adquisición del raster del pico (trazabilidad)
        BIO._peakRot=fc.rot||0;   // orientación ganadora (decúbito): fijar otros cuadros usa la MISMA
        // (V3.1 P2) candidatos de MEJOR RANGO para la línea de tiempo del video (t de media + frameId auténticos)
        (BIO._vidCands||(BIO._vidCands=[])).push({ t:(fc.t!=null?Math.round(fc.t*100)/100:null), val:Math.round(rg.val*10)/10, frameId:fc.frameId });
        if(BIO._vidCands.length>12) BIO._vidCands.shift();
      } else if(BIO.modo==='camara'){
        BIO._livePeakCv=_copiarFrameA(BIO._livePeakCv, fc.fr.cv, 1600);
        BIO._livePeakFrameId=fc.frameId; BIO._livePeakT=fc.t; BIO._livePeakAdq=fc.adq;
        BIO._livePeakHands=(fc.handsSent?_copiaManosLm(fc.handsLm||[]):null);
      }
    }catch(_e){} }
    // El preview pinta DESDE el raster congelado → imagen + esqueleto + arco del MISMO cuadro en pantalla
    // (menor FPS verificable antes que un overlay desfasado del stream). Sin contexto cae al elemento.
    if(BIO.canvas && (fc || BIO.srcEl)){ dibujar(lm, null, fc?fc.fr.cv:null); dibujarGonioVivo(lm, rg); }
    BIO._frProcHands=null;
  }

  // ── Dibujo del esqueleto + ángulos sobre el canvas activo ──────────────────
  // srcOverride (V3.1): raster congelado del cuadro procesado — el preview de goniómetro pinta la imagen
  // EXACTA que produjo los landmarks, no el stream visible (que ya avanzó durante la inferencia).
  function dibujar(lm, ang, srcOverride){
    var cv=BIO.canvas, ctx=BIO.ctx, src=srcOverride||BIO.srcEl;
    if(!cv || !ctx || !src) return;
    var vw = src.videoWidth || src.naturalWidth || src.width || 0;
    var vh = src.videoHeight || src.naturalHeight || src.height || 0;
    if(!vw || !vh) return;
    var cap = 720, escala = vw>cap ? cap/vw : 1;
    var w = Math.round(vw*escala), h = Math.round(vh*escala);
    if(cv.width!==w || cv.height!==h){ cv.width=w; cv.height=h; }
    // (V3.2 P1) marca el visor como VERTICAL cuando el contenido lo es (el CSS de escritorio ciñe el
    // wrap al aspecto del contenido para no dejar franjas negras laterales). Solo presentación.
    try{
      var _wv=cv.parentElement;
      if(_wv && _wv.classList && _wv._bioArv!==(vw+'x'+vh)){
        _wv._bioArv=(vw+'x'+vh);
        var _esV=(vh>vw);
        _wv.classList.toggle('bio-vert', _esV);
        if(_esV) _wv.style.setProperty('--bio-arv', String(Math.round((vw/vh)*1e4)/1e4));
      }
    }catch(_bv){}
    try{ ctx.drawImage(src, 0, 0, w, h); }catch(e){ return; }
    if(!lm) return;
    // conexiones — en GONIÓMETRO el esqueleto se atenúa (sirve para encuadrar, pero el instrumento V3
    // —ejes blancos/arco dorado— es el protagonista y no debe competir con la evidencia).
    var _tenue = (BIO.tipoMedicion==='gonio');
    ctx.lineWidth = Math.max(2, Math.round(w*0.006));
    ctx.strokeStyle = _tenue ? 'rgba(61,220,151,.28)' : 'rgba(61,220,151,.9)';
    CONEXIONES.forEach(function(par){
      var a=lm[par[0]], b=lm[par[1]];
      if(!a || !b) return;
      if((a.visibility!=null && a.visibility<VIS_MIN) || (b.visibility!=null && b.visibility<VIS_MIN)) return;
      ctx.beginPath(); ctx.moveTo(a.x*w, a.y*h); ctx.lineTo(b.x*w, b.y*h); ctx.stroke();
    });
    // puntos
    ctx.fillStyle = _tenue ? 'rgba(201,168,76,.35)' : '#C9A84C';
    PUNTOS_CLAVE.forEach(function(idx){
      var p=lm[idx]; if(!p) return;
      if(p.visibility!=null && p.visibility<VIS_MIN) return;
      ctx.beginPath(); ctx.arc(p.x*w, p.y*h, Math.max(3, Math.round(w*0.008)), 0, Math.PI*2); ctx.fill();
    });
    // etiqueta por MOVIMIENTO en su vértice (codo → codo; hombro flexión "F" y abducción "A"
    // apiladas en el hombro para no encimarse).
    if(ang){
      ctx.font = 'bold '+Math.max(11, Math.round(w*0.026))+'px -apple-system,Arial';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      // Por hombro solo hay UNA métrica activa por frame (la dirección en curso) → sin apilar.
      var pref={ flex:'Fl ', ext:'Ex ', abd:'Ab ' };
      MEDIDAS.forEach(function(m){
        var r=ang[m.key]; if(!r || !r.ok) return;
        var vtx=lm[m.vertice]; if(!vtx) return;
        var txt = (m.calc==='hombro' ? (pref[m.dir]||'') : '') + Math.round(r.val)+'°';
        var tx=vtx.x*w, ty=vtx.y*h;
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
      '.bio-modo-foto{background:rgba(201,168,76,.16);color:#F0E2B8;border:1.5px solid rgba(201,168,76,.55)}',
      '.bio-tipo-row{display:flex;gap:8px;width:100%;max-width:360px;flex-wrap:wrap}',
      '.bio-tipo-btn{flex:1 1 28%;min-width:92px;border:1.5px solid rgba(255,255,255,.25);background:rgba(255,255,255,.06);color:#9BA3B5;border-radius:12px;padding:11px 6px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit}',
      '.bio-tipo-btn.on{background:#1d3b6e;color:#fff;border-color:#C9A84C}',
      '.bio-canvas-wrap{position:relative;width:100%;flex:1;min-height:0;background:#000;display:flex;align-items:center;justify-content:center;overflow:hidden}',
      '#bio-cam-src{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:contain;background:#000}',
      '#bio-canvas{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:contain;display:block}',
      '.bio-vidwrap{position:relative;width:100%;height:58vh;flex-shrink:0;background:#000}',
      '#bio-vid-src{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:contain;background:#000}',
      '#bio-canvas-vid{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:contain}',
      '.bio-estado{padding:7px 16px;font-size:13px;font-weight:600;text-align:center;background:#0d1626;color:#E8C96A;flex-shrink:0}',
      '.bio-panel{position:absolute;left:0;right:0;bottom:0;margin:0;background:linear-gradient(to top,rgba(13,22,38,.94),rgba(13,22,38,0));padding:10px 10px 8px}',
      '.bio-panel table{width:100%;border-collapse:collapse;font-size:13px}',
      '.bio-panel th{color:#9BA3B5;font-weight:700;text-align:left;padding:4px 6px;font-size:11px;text-transform:uppercase;letter-spacing:.5px}',
      '.bio-panel td{padding:5px 6px;border-top:1px solid rgba(255,255,255,.08);font-variant-numeric:tabular-nums}',
      '.bio-panel td.g{color:#fff;font-weight:700}',
      '.bio-panel td.v{color:#3DDC97;font-weight:700;text-align:right}',
      '.bio-cron{position:absolute;top:8px;right:10px;font-size:15px;font-weight:800;color:#fff;background:rgba(192,57,43,.92);padding:3px 11px;border-radius:12px}',
      '.bio-acciones{display:flex;gap:8px;padding:10px 12px 16px;flex-wrap:wrap}',
      '.bio-acciones button{flex:1;min-width:120px;border:none;border-radius:14px;padding:13px;font-size:15px;font-weight:800;cursor:pointer}',
      '.bio-b-rec{background:#C0392B;color:#fff}',
      '.bio-b-stop{background:#122950;color:#fff;border:1.5px solid #E8C96A!important}',
      '.bio-b-save{background:#2E7D52;color:#fff}',
      '.bio-b-sec{background:rgba(255,255,255,.1);color:#fff;border:1.5px solid rgba(255,255,255,.25)!important}',
      '.bio-b-rec:disabled{opacity:.45;cursor:default}',
      '.bio-prog-wrap{padding:12px;align-items:center;justify-content:flex-start;gap:12px;flex-direction:column;flex:1;overflow-y:auto}',
      '.bio-prog-bar{width:100%;max-width:360px;height:14px;background:rgba(255,255,255,.12);border-radius:8px;overflow:hidden}',
      '.bio-prog-fill{height:100%;width:0;background:#C9A84C;transition:width .15s}',
      '.bio-resumen{padding:14px}',
      '.bio-resumen h3{font-size:15px;margin:0 0 10px;color:#E8C96A}',
      '.bio-tabla-res{width:100%;border-collapse:collapse;font-size:14px;background:rgba(255,255,255,.05);border-radius:12px;overflow:hidden}',
      '.bio-tabla-res th{background:rgba(255,255,255,.08);color:#9BA3B5;font-size:11px;text-transform:uppercase;letter-spacing:.5px;padding:8px;text-align:left}',
      '.bio-tabla-res td{padding:9px 8px;border-top:1px solid rgba(255,255,255,.08);font-variant-numeric:tabular-nums}',
      '.bio-tabla-res td.g{font-weight:700}',
      // Goniómetro
      '.bio-gonio-live{text-align:center;padding:2px 0 6px}',
      '.bio-gonio-live .gl-num{font-size:52px;font-weight:800;line-height:1;color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.5)}',
      '.bio-gonio-live .gl-num #bg-live{color:#3DDC97}',
      '.bio-gonio-live .gl-deg{color:#3DDC97;font-size:34px}',
      '.bio-gonio-live .gl-lbl{font-size:13px;color:#cfe0d6;margin-top:2px;font-weight:700}',
      '.bio-gonio-live .gl-max{font-size:12px;color:#9BA3B5;margin-top:2px}',
      '.bio-gonio-live .gl-max b{color:#E8C96A}',
      '.bio-gonio-ctrl{padding:8px 12px 16px;background:#0d1626;flex-shrink:0}',
      '.bio-grow{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:7px}',
      '.bio-glab{font-size:11px;color:#9BA3B5;font-weight:700;text-transform:uppercase;letter-spacing:.4px;min-width:74px}',
      '.bio-gchip{border:1.5px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:#c7d0e0;border-radius:999px;padding:7px 12px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}',
      '.bio-gchip.on{background:#1d3b6e;color:#fff;border-color:#C9A84C}',
      '.bio-gbtns{display:flex;gap:8px;margin:6px 0 8px}',
      '.bio-gcap-btn{flex:1;background:#3DDC97;color:#062015;border:none;border-radius:12px;padding:13px;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit}',
      '.bio-gfin-btn{flex:1;background:#2E7D52;color:#fff;border:none;border-radius:12px;padding:13px;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit}',
      '.bio-gcaps{display:flex;flex-wrap:wrap;gap:6px}',
      '.bio-gcap{background:rgba(61,220,151,.12);border:1px solid rgba(61,220,151,.35);color:#d6f5e6;border-radius:8px;padding:4px 8px;font-size:12px}',
      '.bio-gcap.al{background:rgba(232,201,106,.14);border-color:rgba(232,201,106,.45);color:#f0dfa8}',
      '.bio-gcap b{color:#ff9d9d;cursor:pointer;margin-left:4px;font-weight:800}',
      '.bio-gcaps-empty{color:#9BA3B5;font-size:12px;font-style:italic}',
      '#bio-gonio-sel{text-align:left;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:12px 12px 6px}',
      '#bio-gonio-caps{text-align:left}',
      '.bio-gsel-hint{font-size:12px;color:#9BA3B5;margin-bottom:10px;line-height:1.4;font-weight:600}',
      // ── V3 (dirección de arte): tokens, lectura principal grande y tabular, objetivos táctiles ≥44px ──
      '#bio-overlay{--bio-navy:#122C43;--bio-navy-deep:#10283D;--bio-gold:#E7BB57;--bio-white:#FFFFFF;--bio-surface:#ECF0F3;--bio-border:#D7DFE5;--bio-muted:#64778B}',
      '.bio-gonio-live .gl-num{font-size:clamp(42px,10vw,56px);font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-.5px}',
      '.bio-gonio-live .gl-num #bg-live{color:#fff}',
      '.bio-gonio-live .gl-deg{color:var(--bio-gold,#E7BB57);font-size:clamp(26px,6vw,34px)}',
      '.bio-gonio-live .gl-max b{font-variant-numeric:tabular-nums}',
      '.bio-gchip{min-height:44px}',
      '.bio-gcap-btn,.bio-gfin-btn,.bio-gact-btn,.bio-ged-btn,.bio-gzoom-btn,.bio-ged-ok,.bio-ged-undo,.bio-ged-no{min-height:48px}',
      '.bio-gact-btn{flex:1;background:rgba(61,220,151,.14);color:#9FE8C8;border:1.5px solid rgba(61,220,151,.5);border-radius:12px;padding:13px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit}',
      '.bio-ged-btn{flex:1.4;background:rgba(231,187,87,.14);color:#F0DFA8;border:1.5px solid rgba(231,187,87,.55);border-radius:12px;padding:12px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit}',
      '.bio-gzoom-btn{flex:.8;background:rgba(255,255,255,.08);color:#c7d0e0;border:1.5px solid rgba(255,255,255,.22);border-radius:12px;padding:12px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit}',
      '.bio-ged-ok{flex:1.3;background:#2E7D52;color:#fff;border:none;border-radius:12px;padding:12px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit}',
      '.bio-ged-undo{flex:1;background:rgba(255,255,255,.08);color:#c7d0e0;border:1.5px solid rgba(255,255,255,.22);border-radius:12px;padding:12px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit}',
      '.bio-ged-no{flex:.8;background:rgba(192,57,43,.16);color:#ff9d9d;border:1.5px solid rgba(192,57,43,.5);border-radius:12px;padding:12px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit}',
      '#bio-canvas{transform-origin:center center}',
      '#bio-canvas.bio-interactivo{touch-action:none}',
      // ── V3.1 (instrumento): lectura FUERA de la imagen (panel opaco), selector compacto, lateralidad
      // segmentada, UN botón primario dorado por etapa, barra de herramientas del visor, inspector lateral
      // en escritorio (grid visor ~70% + 300-340px), tipografía Inter/system-ui, sin emojis decorativos.
      '#bio-overlay{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}',
      '.bio-panel-dock{position:static!important;background:var(--bio-navy,#122C43)!important;border-top:2px solid var(--bio-gold,#E7BB57);padding:10px 16px 8px!important;flex-shrink:0}',
      '.bio-gonio-live{text-align:left;padding:0}',
      '.bio-gonio-live .gl-eyebrow{font-size:10.5px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#8FA1B8;margin-bottom:2px}',
      '.bio-gonio-live .gl-head{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}',
      '.bio-gonio-live .gl-num{font-size:clamp(44px,9vw,56px)}',
      '.bio-gonio-live .gl-lbl{font-size:14.5px;color:#fff;font-weight:800;margin-top:0}',
      '.bio-gonio-live .gl-sub{font-size:12.5px;color:#9BA3B5;margin-top:3px;font-variant-numeric:tabular-nums;display:flex;gap:14px;flex-wrap:wrap}',
      '.bio-gonio-live .gl-sub b{color:#E7BB57;font-weight:800}',
      '.bio-gonio-live .gl-metodo{font-size:11.5px;color:#64778B;margin-top:3px}',
      // móvil/tablet: el VISOR es protagonista con altura propia (≈mitad de pantalla); lectura, selector y
      // acciones fluyen debajo con scroll — nada tapa la imagen y el visor jamás colapsa a 0.
      '#bio-vista-camara.gonio-v31 .bio-canvas-wrap{flex:0 0 auto;height:min(52vh,480px);min-height:240px}',
      '.bio-gtools{display:none;gap:8px;padding:8px 12px;background:#0d1626;flex-shrink:0;align-items:center}',
      '.bio-gtools.on{display:flex}',
      '.bio-gtool{min-height:44px;min-width:44px;border:1.5px solid rgba(255,255,255,.22);background:rgba(255,255,255,.06);color:#D9E2EC;border-radius:10px;padding:8px 14px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit}',
      '.bio-gtool.zx{flex:0 0 auto;min-width:48px;font-size:18px;font-weight:800}',
      '.bio-gtool[aria-pressed="true"]{background:#1d3b6e;border-color:var(--bio-gold,#E7BB57);color:#fff}',
      '.bio-gfield{display:block;margin-bottom:10px}',
      '.bio-gfield .bio-glab{display:block;min-width:0;margin-bottom:5px}',
      '.bio-gsel2{width:100%;box-sizing:border-box;min-height:46px;background:#0F2137;color:#fff;border:1.5px solid rgba(255,255,255,.22);border-radius:10px;padding:10px 12px;font-size:15px;font-weight:700;font-family:inherit;-webkit-appearance:none;appearance:none;background-image:linear-gradient(45deg,transparent 50%,#9BA3B5 50%),linear-gradient(135deg,#9BA3B5 50%,transparent 50%);background-position:calc(100% - 20px) 55%,calc(100% - 14px) 55%;background-size:6px 6px;background-repeat:no-repeat}',
      '.bio-seg{display:flex;border:1.5px solid rgba(255,255,255,.22);border-radius:10px;overflow:hidden}',
      '.bio-seg-b{flex:1;min-height:46px;background:transparent;border:none;color:#9BA3B5;font-size:14.5px;font-weight:800;cursor:pointer;font-family:inherit}',
      '.bio-seg-b.on{background:#1d3b6e;color:#fff;box-shadow:inset 0 0 0 1.5px var(--bio-gold,#E7BB57);border-radius:8px}',
      '.bio-gcap-btn{background:var(--bio-gold,#E7BB57);color:#10283D}',                       // PRIMARIO (único por etapa): dorado
      '.bio-gfin-btn{background:rgba(255,255,255,.08);color:#fff;border:1.5px solid rgba(255,255,255,.28)}',   // verde reservado a ESTADO real
      '.bio-gact-btn{background:rgba(255,255,255,.06);color:#D9E2EC;border:1.5px solid rgba(255,255,255,.22)}',
      '.bio-gdiv{height:1px;background:rgba(255,255,255,.1);margin:10px 0}',
      '.bio-gonio-ctrl{padding-bottom:max(16px,env(safe-area-inset-bottom))}',
      '#bio-overlay button:focus-visible,#bio-overlay select:focus-visible{outline:2px solid var(--bio-gold,#E7BB57);outline-offset:2px}',
      '@media (prefers-reduced-motion:reduce){#bio-overlay *{transition:none!important;animation:none!important}}',
      '@media (min-width:1024px){',
      ' #bio-vista-camara.gonio-v31{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(300px,340px);grid-template-rows:auto auto auto minmax(0,1fr) auto;overflow:hidden}',
      ' .gonio-v31 .bio-canvas-wrap{grid-column:1;grid-row:1/5;height:auto;min-height:0}',
      // (V3.2 P1) contenido VERTICAL en visor ancho: el wrap se ciñe al aspecto del contenido y se centra
      // (menos franjas negras laterales). Solo CSS de presentación: export, puntos y análisis intactos.
      ' .gonio-v31 .bio-canvas-wrap.bio-vert{width:auto;aspect-ratio:var(--bio-arv,0.5625);max-width:100%;justify-self:center}',
      ' .gonio-v31 .bio-gtools{grid-column:1;grid-row:5;justify-content:center}',
      ' .gonio-v31 .bio-panel-dock{grid-column:2;grid-row:1;border-left:1px solid rgba(255,255,255,.1);border-top:none}',
      ' .gonio-v31 .bio-estado{grid-column:2;grid-row:2;border-left:1px solid rgba(255,255,255,.1)}',
      ' .gonio-v31 .bio-acciones{grid-column:2;grid-row:3;border-left:1px solid rgba(255,255,255,.1);padding-bottom:6px}',
      ' .gonio-v31 .bio-gonio-ctrl{grid-column:2;grid-row:4/6;border-left:1px solid rgba(255,255,255,.1);overflow-y:auto;min-height:0}',
      '}'
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
      +   '<div style="font-size:40px" id="bio-ini-icono">🦴</div>'
      +   '<div class="bio-tipo-row">'
      +     '<button class="bio-tipo-btn on" id="bio-tipo-rom">🦴 ROM</button>'
      +     '<button class="bio-tipo-btn" id="bio-tipo-sent">🏋️ Sentadilla</button>'
      +     '<button class="bio-tipo-btn" id="bio-tipo-marcha">🚶 Marcha</button>'
      +     '<button class="bio-tipo-btn" id="bio-tipo-gonio">📐 Goniómetro</button>'
      +   '</div>'
      +   '<p id="bio-ini-desc">Mide los rangos articulares de codo y hombro. Elige cómo capturar el movimiento.</p>'
      +   '<div id="bio-est-wrap" style="display:none;width:100%;max-width:360px">'
      +     '<input type="number" id="bio-estatura" inputmode="numeric" min="80" max="230" placeholder="Estatura del paciente en cm (opcional)" style="width:100%;box-sizing:border-box;border:1.5px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:#fff;border-radius:12px;padding:12px;font-size:14px;font-family:inherit">'
      +   '</div>'
      +   '<div id="bio-gonio-sel" style="display:none;width:100%;max-width:400px"></div>'
      +   '<button class="bio-modo-btn bio-modo-cam" id="bio-go-cam">▶️ Cámara en vivo</button>'
      +   '<button class="bio-modo-btn bio-modo-vid" id="bio-go-vid">📁 Subir video</button>'
      +   '<button class="bio-modo-btn bio-modo-foto" id="bio-go-foto" style="display:none">📷 Subir foto</button>'
      +   '<input type="file" id="bio-file" accept="video/*" multiple style="display:none">'
      +   '<input type="file" id="bio-file-foto" accept="image/*" style="display:none">'
      +   '<div id="bio-gonio-caps" style="display:none;width:100%;max-width:400px;margin-top:2px"></div>'
      + '</div>'
      // Vista cámara en vivo
      + '<div class="bio-vista" id="bio-vista-camara">'
      +   '<div class="bio-canvas-wrap"><video id="bio-cam-src" playsinline webkit-playsinline muted autoplay></video><canvas id="bio-canvas"></canvas>'
      +     '<div class="bio-cron" id="bio-cron" style="display:none">00:00</div>'
      +     '<div class="bio-panel" id="bio-panel-vivo"></div>'
      +   '</div>'
      +   '<div class="bio-gtools" id="bio-gtools" role="toolbar" aria-label="Herramientas del visor"></div>'
      +   '<div class="bio-estado" id="bio-estado">Iniciando cámara…</div>'
      +   '<div class="bio-acciones">'
      +     '<button class="bio-b-sec" id="bio-btn-flip" style="flex:0 0 auto;min-width:auto;padding:13px 16px">🔄 Cámara</button>'
      +     '<button class="bio-b-rec" id="bio-btn-rec" disabled>⏺️ Grabar sesión</button>'
      +   '</div>'
      +   '<div class="bio-gonio-ctrl" id="bio-gonio-ctrl" style="display:none"></div>'
      + '</div>'
      // Vista progreso (análisis de video)
      + '<div class="bio-vista bio-prog-wrap" id="bio-vista-progreso">'
      +   '<div style="font-size:14px;font-weight:700;flex-shrink:0">Analizando video…</div>'
      +   '<div class="bio-vidwrap"><video id="bio-vid-src" playsinline webkit-playsinline muted></video><canvas id="bio-canvas-vid"></canvas></div>'
      +   '<div class="bio-prog-bar"><div class="bio-prog-fill" id="bio-prog-fill"></div></div>'
      +   '<div id="bio-prog-txt" style="color:#9BA3B5;font-size:13px">0%</div>'
      +   '<button class="bio-modo-btn bio-modo-vid" id="bio-prog-cancel" style="max-width:200px;padding:12px">Cancelar</button>'
      + '</div>'
      // Vista resumen
      + '<div class="bio-vista bio-resumen" id="bio-vista-resumen"></div>'
      // Vista reconstrucción (esqueleto animado + trayectorias)
      + '<div class="bio-vista" id="bio-vista-recon" style="padding:8px">'
      +   '<div id="bio-recon-wrap" style="position:relative;width:100%;flex:1;min-height:0;display:flex;align-items:center;justify-content:center"><canvas id="bio-recon-canvas" style="border-radius:12px;max-width:100%;max-height:100%"></canvas></div>'
      +   '<div style="display:flex;gap:6px;padding:2px 6px 4px;justify-content:center">'
      +     '<button class="bio-tipo-btn on" id="bio-recon-m-tray" style="flex:0 1 auto;padding:8px 12px;font-size:12px">Trayectorias</button>'
      +     '<button class="bio-tipo-btn" id="bio-recon-m-sacro" style="flex:0 1 auto;padding:8px 12px;font-size:12px">Sacro</button>'
      +     '<button class="bio-tipo-btn" id="bio-recon-m-rod" style="flex:0 1 auto;padding:8px 12px;font-size:12px">Rodillas</button>'
      +   '</div>'
      +   '<div id="bio-recon-info" style="text-align:center;color:#9BA3B5;font-size:12px;padding:5px">—</div>'
      +   '<div style="display:flex;gap:8px;align-items:center;padding:2px 6px">'
      +     '<button class="bio-b-sec" id="bio-recon-play" style="flex:0 0 auto;min-width:auto;padding:10px 14px">▶︎ Reproducir</button>'
      +     '<input type="range" id="bio-recon-slider" min="0" max="100" value="0" style="flex:1">'
      +     '<button class="bio-b-sec" id="bio-recon-speed" style="flex:0 0 auto;min-width:auto;padding:10px 12px">1×</button>'
      +   '</div>'
      +   '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:4px 6px 8px;font-size:11px;color:#9BA3B5">'
      +     '<span>🟣/🟡 manos · 🔴/🟢 pies · 🟤 sacro · 🟢/🔵 rodillas · teal hombros</span>'
      +     '<button class="bio-b-sec" id="bio-recon-cerrar" style="flex:0 0 auto;min-width:auto;padding:8px 12px">Cerrar</button>'
      +   '</div>'
      + '</div>';
    document.body.appendChild(ov);

    document.getElementById('bio-cerrar').addEventListener('click', cerrarMedidor);
    document.getElementById('bio-tipo-rom').addEventListener('click', function(){ aplicarTipoMedicion('rom'); });
    document.getElementById('bio-tipo-sent').addEventListener('click', function(){ aplicarTipoMedicion('sent'); });
    document.getElementById('bio-tipo-marcha').addEventListener('click', function(){ aplicarTipoMedicion('marcha'); });
    document.getElementById('bio-tipo-gonio').addEventListener('click', function(){ aplicarTipoMedicion('gonio'); });
    document.getElementById('bio-go-cam').addEventListener('click', iniciarCamara);
    document.getElementById('bio-go-vid').addEventListener('click', function(){ document.getElementById('bio-file').click(); });
    document.getElementById('bio-file').addEventListener('change', function(ev){
      var files = Array.prototype.slice.call(ev.target.files||[]); ev.target.value='';
      if(!files.length) return;
      // Se pueden elegir VARIOS videos de una sola vez (en TODOS los modos). La app procesa el 1º y deja
      // los demás en cola; al terminar cada uno pasa al siguiente SIN re-abrir el selector. En goniómetro
      // cada video es una medición distinta (codo, muñeca…) que se acumula en la misma sesión; en ROM/
      // sentadilla/marcha cada video es su propia sesión (se guarda y pasa al siguiente).
      BIO.videoCola = (files.length>1) ? files.slice(1) : [];
      if(files.length>1){
        toast('📹 '+files.length+' videos en cola. Se analiza el 1º; al terminar pasa al siguiente'+(BIO.tipoMedicion==='gonio'?' (elige articulación/movimiento en cada uno)':'')+'.','info');
      }
      procesarVideo(files[0]);
    });
    document.getElementById('bio-go-foto').addEventListener('click', function(){ document.getElementById('bio-file-foto').click(); });
    document.getElementById('bio-file-foto').addEventListener('change', function(ev){
      var f = ev.target.files && ev.target.files[0]; ev.target.value='';
      if(f) procesarFoto(f);
    });
    document.getElementById('bio-btn-rec').addEventListener('click', toggleGrabacion);
    document.getElementById('bio-btn-flip').addEventListener('click', voltearCamara);
    document.getElementById('bio-prog-cancel').addEventListener('click', function(){ BIO.cancelVideo=true; });
    document.getElementById('bio-recon-play').addEventListener('click', _reconPlay);
    document.getElementById('bio-recon-slider').addEventListener('input', function(){ _reconStop(); if(RECON.paquete){ RECON.frame=Math.max(0,Math.min(RECON.paquete.n-1, parseInt(this.value,10)||0)); _reconDibujar(); } });
    document.getElementById('bio-recon-speed').addEventListener('click', function(){ RECON.speed = RECON.speed===1?0.5:(RECON.speed===0.5?2:1); this.textContent=RECON.speed+'×'; });
    document.getElementById('bio-recon-cerrar').addEventListener('click', function(){ _reconStop(); cerrarMedidor(); });
    document.getElementById('bio-recon-m-tray').addEventListener('click', function(){ _reconModo('tray'); });
    document.getElementById('bio-recon-m-sacro').addEventListener('click', function(){ _reconModo('sacro'); });
    document.getElementById('bio-recon-m-rod').addEventListener('click', function(){ _reconModo('rodillas'); });
  }

  function mostrarVista(id){
    ['bio-vista-inicio','bio-vista-camara','bio-vista-progreso','bio-vista-resumen','bio-vista-recon'].forEach(function(v){
      var el=document.getElementById(v); if(el) el.classList.toggle('on', v===id);
    });
  }

  // ── Abrir / cerrar ─────────────────────────────────────────────────────────
  function abrirMedidorBiomecanico(tipoInicial){
    var pid = (typeof currentPatient!=='undefined' && currentPatient) ? currentPatient.id : null;
    if(!pid){ toast('Abre un expediente primero','warning'); return; }
    construirOverlay();
    resetEstado();
    aplicarTipoMedicion(tipoInicial || BIO.tipoMedicion || 'rom');
    // Precargar estatura desde la última sentadilla guardada de ESTE paciente (si la hubo).
    var est=document.getElementById('bio-estatura');
    if(est){
      var ult=(currentPatient.biomecanica||[]).slice().reverse().find(function(s){ return s && (s.tipo==='sentadilla'||s.tipo==='marcha') && s.calibracion && s.calibracion.estaturaCm; });
      est.value = ult ? ult.calibracion.estaturaCm : '';
    }
    mostrarVista('bio-vista-inicio');
    document.getElementById('bio-overlay').style.display='flex';
  }
  // Selector de tipo de medición: ROM de brazos · sentadilla frontal · marcha sagital.
  function aplicarTipoMedicion(t){
    BIO.tipoMedicion = (t==='sent'||t==='marcha'||t==='gonio') ? t : 'rom';
    _bumpGen();   // cambia el tipo de medición: un cuadro tardío calculado para el tipo anterior no debe acumular
    var bR=document.getElementById('bio-tipo-rom'), bS=document.getElementById('bio-tipo-sent'), bM=document.getElementById('bio-tipo-marcha'), bG=document.getElementById('bio-tipo-gonio');
    if(bR) bR.classList.toggle('on', BIO.tipoMedicion==='rom');
    if(bS) bS.classList.toggle('on', BIO.tipoMedicion==='sent');
    if(bM) bM.classList.toggle('on', BIO.tipoMedicion==='marcha');
    if(bG) bG.classList.toggle('on', BIO.tipoMedicion==='gonio');
    var ic=document.getElementById('bio-ini-icono');
    if(ic){
      ic.textContent = BIO.tipoMedicion==='sent' ? '🏋️' : (BIO.tipoMedicion==='marcha' ? '🚶' : (BIO.tipoMedicion==='gonio' ? '📐' : '🦴'));
      // (V3.2 P1) en el INSTRUMENTO (goniómetro) no hay emoji decorativo gigante: a 320 px la vista
      // inicial consumía demasiada altura (hallazgo auditoría V3.1 #1).
      ic.style.display = (BIO.tipoMedicion==='gonio') ? 'none' : '';
    }
    // estatura: sentadilla y marcha la usan (calibración a cm); ROM no.
    var ew=document.getElementById('bio-est-wrap'); if(ew) ew.style.display = (BIO.tipoMedicion==='sent'||BIO.tipoMedicion==='marcha') ? 'block' : 'none';
    var de=document.getElementById('bio-ini-desc');
    if(de) de.textContent = BIO.tipoMedicion==='sent'
      ? 'Análisis FRONTAL de sentadilla: valgo dinámico (FPPA), desplazamiento medial de rodilla, separación y descenso. Paciente DE FRENTE, cuerpo completo, 3 a 5 sentadillas.'
      : (BIO.tipoMedicion==='marcha'
        ? 'Análisis de MARCHA de PERFIL (lado): tiempos del paso, cadencia, fases de apoyo/balanceo y ángulos sagitales de cadera/rodilla/tobillo, con simetría izq/der. Ideal en caminadora o 2–3 pasadas cruzando el cuadro.'
        : (BIO.tipoMedicion==='gonio'
          ? 'GONIÓMETRO (plano sagital): cadera, rodilla, tobillo, codo y muñeca por lado. Mídelo EN VIVO, subiendo una FOTO (ideal en camilla / decúbito prono) o subiendo un VIDEO. Elige articulación, movimiento y lado; el ángulo se escribe en el ROM de la Valoración.'
          : 'Mide los rangos articulares de codo y hombro. Elige cómo capturar el movimiento.'));
    var tt=document.querySelector('#bio-overlay .bio-top b');
    if(tt){
      if(BIO.tipoMedicion==='gonio'){
        // (V3.2 P1) 320 px: título corto en UNA línea + las fuentes en una 2.ª línea pequeña, sin emoji
        // decorativo (hallazgo auditoría V3.1 #1 — el título largo se partía en dos líneas grandes).
        tt.innerHTML='Goniómetro<span style="display:block;font-size:11.5px;font-weight:600;color:rgba(255,255,255,.72);letter-spacing:.3px;margin-top:1px">Cámara · foto · video — plano sagital 2D</span>';
      } else {
        tt.textContent = BIO.tipoMedicion==='sent' ? '🏋️ Sentadilla — análisis frontal' : (BIO.tipoMedicion==='marcha' ? '🚶 Marcha — análisis sagital' : '🦴 Medición biomecánica — ROM');
      }
    }
    // Goniómetro: selector de articulación/movimiento/lado + botón de foto + tira de capturas (foto/video usan el mismo acumulador).
    var esG=(BIO.tipoMedicion==='gonio');
    var gSel=document.getElementById('bio-gonio-sel'); if(gSel) gSel.style.display=esG?'block':'none';
    var gCap=document.getElementById('bio-gonio-caps'); if(gCap) gCap.style.display=esG?'block':'none';
    var gFoto=document.getElementById('bio-go-foto'); if(gFoto) gFoto.style.display=esG?'block':'none';
    if(esG) pintarGonioInicio();
  }
  function _leerEstatura(){
    var el=document.getElementById('bio-estatura'); var v=el?parseFloat(el.value):NaN;
    return (isFinite(v) && v>=80 && v<=230) ? v : null;
  }
  function resetEstado(){
    _bumpGen(); BIO.framesDescartados=0;   // nueva generación: cualquier cuadro en vuelo de la medición anterior se descartará
    BIO.modo=null; BIO.recording=false; BIO.procesandoVideo=false; BIO.cancelVideo=false; BIO.finalizando=false;
    BIO.acc=null; BIO.accS=null; BIO.accM=null; BIO.accG=null; BIO.framesTotales=0; BIO.srcEl=null; BIO.sending=false;
    BIO._estaticoBase=null; BIO._estaticoLm=null; BIO._estaticoImg=null; BIO._estaticoFuente=null; BIO._peakFrameCanvas=null; BIO._peakFrameLm=null; BIO._peakTSeg=null; BIO._fotoRes=null; BIO._gonioRot=0; BIO._vidFrameSent=null;
    BIO._fotoHD=null; BIO._liveLm=null; BIO._liveR=null; BIO._liveAR=null; BIO._livePeakCv=null; BIO._ed=null; BIO._gxHyst=null; _zoomReset();   // V3: HD de foto, tupla viva, ajuste manual, histéresis y zoom
    // V3.1: identidad de cuadro — pool de rasters, colas de contexto/manos, tupla retenida y sellos de pico
    BIO._frPool=[]; BIO._frQ=[]; BIO._frPend=null; BIO._frRet=null; BIO._frProcHands=null;
    // (V3.2) jobs y deuda de callbacks: la DEUDA sobrevive al reset — un send en vuelo del estado
    // anterior sigue debiendo su callback y, si el medidor se re-abre de inmediato, ese callback
    // tardío NO debe emparejar cuadros nuevos (el _bumpGen de arriba ya convirtió los contextos en
    // vuelo en deuda ambigua). El job de Hands en vuelo pasa a deuda; el lock se re-arma limpio.
    if(BIO._handsJob && !BIO._handsJob.resuelto){ BIO._handsStale=(BIO._handsStale||0)+1; }
    BIO._handsJob=null; BIO._frPoolAgotado=0;
    BIO._livePeakFrameId=null; BIO._livePeakT=null; BIO._livePeakHands=null; BIO._peakFrameId=null;
    BIO._livePeakAdq=null; BIO._peakAdq=null; BIO._estaticoAdq=null;   // (V3.2) UTC de adquisición
    BIO._vidCands=[]; BIO._vidDur=null; BIO._peakRot=0; BIO._estaticoTipoCuadro=null; BIO._estaticoTipoCuadroNext=null; BIO._vidFijando=false;
    BIO._handsLm=null; BIO._handsSending=false; BIO._estaticoHandsLm=undefined; BIO._estaticoHandsNext=undefined; BIO._estaticoHandsRun=false; BIO._peakHandsLm=null; BIO._peakGonioR=null; BIO._estaticoR=null;   // estado de HANDS (muñeca); el modelo cargado se conserva para reuso
    BIO._handsMeta=null; BIO._estaticoHandsMeta=null; BIO._estaticoHandsMetaNext=undefined;   // (P0) provenance de handedness
    BIO._munProto='3mcp'; BIO._extOk=false; BIO._anatOn=false;   // (P0) protocolo de muñeca, tope de rango y panel anatómico
    BIO.facing='environment';           // cada medición arranca con la cámara TRASERA
    detenerGrabadorVideo(); BIO.pendingVideo=null; BIO.videoCola=[];
    detenerLoopCamara(); pararCronometro();
  }
  function cerrarMedidor(){
    BIO.cancelVideo=true;
    _reconStop();
    detenerGrabadorVideo(); BIO.pendingVideo=null; BIO.videoCola=[];
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
  function detenerLoopCamara(){ if(BIO.rafId){ cancelAnimationFrame(BIO.rafId); BIO.rafId=null; } if(BIO._arranqueIv){ clearInterval(BIO._arranqueIv); BIO._arranqueIv=null; } BIO.sending=false; }
  function limpiarVideoSrc(v){ try{ if(v){ v.pause(); v.onclick=null; v.removeAttribute('src'); try{ v.srcObject=null; }catch(_e){} v.load(); } }catch(e){} }

  // ── MODO A: cámara en vivo ─────────────────────────────────────────────────
  async function iniciarCamara(){
    BIO.modo='camara'; _bumpGen(); _ensureHandsSiMuneca();
    BIO.facing = BIO.facing || 'environment';   // TRASERA por defecto (se apunta al paciente)
    mostrarVista('bio-vista-camara');
    // Reset del botón de grabar y cronómetro (evita estado viejo al volver a grabar).
    var _br=document.getElementById('bio-btn-rec'); if(_br){ _br.className='bio-b-rec'; _br.textContent='⏺️ Grabar sesión'; _br.disabled=true; }
    var _bf=document.getElementById('bio-btn-flip'); if(_bf) _bf.disabled=false;
    var _cr=document.getElementById('bio-cron'); if(_cr){ _cr.style.display='none'; _cr.textContent='00:00'; }
    BIO.canvas=document.getElementById('bio-canvas'); BIO.ctx=BIO.canvas.getContext('2d');
    var _gc=document.getElementById('bio-gonio-ctrl'); if(_gc) _gc.style.display=(BIO.tipoMedicion==='gonio')?'block':'none';
    if(_br) _br.style.display=(BIO.tipoMedicion==='gonio')?'none':'';   // gonio no usa "grabar": captura en vivo
    // V3.1: layout de INSTRUMENTO solo en goniómetro (lectura fuera del visor + inspector en escritorio)
    try{ var _vc31=document.getElementById('bio-vista-camara'); if(_vc31) _vc31.classList.toggle('gonio-v31', BIO.tipoMedicion==='gonio'); }catch(_g31){}
    var _tb31=document.getElementById('bio-gtools'); if(_tb31 && BIO.tipoMedicion!=='gonio'){ _tb31.classList.remove('on'); _tb31.innerHTML=''; }
    if(BIO.tipoMedicion==='gonio'){ if(!BIO.accG) BIO.accG=nuevoAccGonio(); pintarPanelGonio(); }
    else if(BIO.tipoMedicion==='sent') pintarPanelSent(null); else pintarPanelVivo(null);
    var estado=document.getElementById('bio-estado');
    estado.textContent='Cargando modelo de pose…';
    var ok = await ensureMediaPipeReady();
    if(!ok){ estado.textContent='⚠️ No se pudo cargar el motor de pose. Revisa tu conexión e inténtalo de nuevo.'; return; }
    var camOk = await abrirStreamCamara(BIO.facing);
    if(!camOk) return;
    if(BIO.tipoMedicion==='gonio'){ pintarGonioCtrl(); }
    else estado.textContent = (BIO.tipoMedicion==='sent')
      ? 'Paciente DE FRENTE, cuerpo completo (caderas, rodillas y tobillos en cuadro)'
      : 'Coloca al paciente de cuerpo completo en el encuadre';
    BIO.acc=null; BIO.accS=null; BIO.accM=null; BIO.framesTotales=0;
    loopCamara();
    _vigilarArranqueCamara();   // avisa/reintenta si el video no entrega imagen
  }
  // Abre (o reabre) el stream con la cámara indicada. Reutiliza el <video> y el loop.
  async function abrirStreamCamara(facing){
    detenerCamaraStream();
    var estado=document.getElementById('bio-estado');
    try{
      BIO.stream = await navigator.mediaDevices.getUserMedia({
        video:{ facingMode:{ideal:facing}, width:{ideal:640}, height:{ideal:480} }, audio:false
      });
    }catch(e){
      // Fallback: cualquier cámara disponible (iPads viejos o sin cámara trasera enumerable).
      try{ BIO.stream = await navigator.mediaDevices.getUserMedia({ video:true, audio:false }); }
      catch(e2){ if(estado) estado.textContent='⚠️ Permiso de cámara denegado o no disponible. Puedes usar "📁 Subir video".'; return false; }
    }
    // iOS Safari NO reproduce un <video> fuera del DOM → cámara negra. Usamos el <video> visible
    // que está en la vista de cámara (el canvas se dibuja encima con esqueleto + ángulos).
    var v = document.getElementById('bio-cam-src') || document.createElement('video');
    v.autoplay=true; v.muted=true; v.defaultMuted=true; v.setAttribute('muted',''); v.playsInline=true; v.setAttribute('playsinline',''); v.setAttribute('webkit-playsinline','');
    v.srcObject=BIO.stream; BIO.video=v; BIO.srcEl=v;
    // Ajustes REALES del track (resolución/fps/cámara) para trazabilidad honesta de la captura.
    try{
      var _tk = BIO.stream.getVideoTracks ? BIO.stream.getVideoTracks()[0] : null;
      var _s = (_tk && _tk.getSettings) ? _tk.getSettings() : null;
      BIO.camSettings = _s ? { width:_s.width||null, height:_s.height||null,
        frameRate:(_s.frameRate!=null?Math.round(_s.frameRate):null), facingMode:_s.facingMode||facing||null } : null;
    }catch(_c){ BIO.camSettings=null; }
    try{ await v.play(); }catch(_){}
    return true;
  }
  // Alterna trasera/frontal sin reiniciar el flujo (el loop sigue leyendo BIO.video).
  async function voltearCamara(){
    if(BIO.recording){ toast('Detén la grabación para cambiar de cámara','warning'); return; }
    BIO.facing = (BIO.facing==='environment') ? 'user' : 'environment';
    _bumpGen();   // cambia la fuente (trasera/frontal): descarta cuadros en vuelo de la cámara anterior
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
      // WATCHDOG: si un send() de MediaPipe se quedó COLGADO (Safari iOS bajo presión de memoria/GPU),
      // BIO.sending se quedaría en true para siempre y el muestreo se congelaría a media grabación
      // (síntoma: "no graba / se queda pegado / 0 cuadros"). Si lleva >2.5 s sin resolver, lo liberamos
      // y dejamos que el SIGUIENTE tick envíe un frame fresco (sin enviar dos a la vez).
      if(BIO.sending){
        if(BIO._sendAt && (Date.now()-BIO._sendAt)>2500){
          BIO.sending=false; BIO._sendStuck=(BIO._sendStuck||0)+1;
          // (V3.2) en goniómetro un send colgado invalida la GENERACIÓN completa y la pérdida queda
          // DECLARADA (los callbacks en deuda se drenan FIFO) → jamás un emparejado corrido, y el
          // primer cuadro tras recuperarse sí se mide.
          if(BIO.tipoMedicion==='gonio'){ _bumpGen(); _poseDeclararPerdidos(); }
          else if(BIO._genQ && BIO._genQ.length) BIO._genQ.shift();
        }
        return;
      }
      // Si el <video> se pausó (iOS al volver de segundo plano / bloqueo de pantalla), reintenta.
      if(BIO.video && BIO.video.paused){ try{ BIO.video.play(); }catch(_){} }
      if(!BIO.pose || !BIO.video || BIO.video.videoWidth===0) return;
      BIO.sending = true; BIO._sendAt = Date.now();
      BIO.framesTotales++;
      // GONIÓMETRO (V3.1): el cuadro se CONGELA a un raster del pool antes de enviarse (identidad de
      // cuadro + lockstep de Hands en muñeca). Los demás modos siguen mandando el elemento (sin cambio).
      var _envio = (BIO.tipoMedicion==='gonio')
        ? _gonioSendFrame(BIO.video, (BIO.video.currentTime!=null?BIO.video.currentTime:null))
        : _genSend(BIO.video);
      _envio.then(function(){ BIO.sending=false; }).catch(function(){ BIO.sending=false; });
    }
    BIO.rafId = requestAnimationFrame(tick);
  }
  // Vigilancia de ARRANQUE de cámara: si el <video> no entrega imagen (videoWidth 0) en unos segundos,
  // reintenta reproducir y avisa con claridad (en iOS el permiso puede quedar a medias o el stream mudo).
  function _vigilarArranqueCamara(){
    clearInterval(BIO._arranqueIv);
    var intentos=0;
    BIO._arranqueIv=setInterval(function(){
      if(BIO.modo!=='camara'){ clearInterval(BIO._arranqueIv); return; }
      if(BIO.video && BIO.video.videoWidth>0){ clearInterval(BIO._arranqueIv); return; }   // ya hay imagen
      intentos++;
      if(BIO.video){ try{ BIO.video.play(); }catch(_){} }                                   // reintenta arrancar
      var estado=document.getElementById('bio-estado');
      if(intentos>=4 && estado && !BIO.recording){ estado.textContent='⚠️ La cámara no envía imagen. Cierra y vuelve a abrir, o usa "📁 Subir video".'; }
      if(intentos>=10){ clearInterval(BIO._arranqueIv); }
    },1000);
  }
  // Orientación FRENTE vs PERFIL para el ROM de hombro (mismo criterio que la sentadilla: ancho
  // proyectado de hombros/caderas contra el alto del tronco). De frente los hombros se ven anchos;
  // de perfil se acortan. Histéresis para que el aviso no parpadee cerca del umbral.
  function _orientRomFrontal(lm){
    if(!(_vis(lm,11)&&_vis(lm,12)&&_vis(lm,23)&&_vis(lm,24))) return null;
    var ancho=(Math.abs(lm[11].x-lm[12].x)+Math.abs(lm[23].x-lm[24].x))/2;
    var alto=Math.abs((lm[11].y+lm[12].y)/2-(lm[23].y+lm[24].y)/2)||1e-6;
    var r=ancho/alto, prev=BIO._orientRom;
    var frontal=(prev===true)?(r>=0.38):(r>=0.45);   // banda de histéresis anti-parpadeo
    BIO._orientRom=frontal;
    return frontal;
  }
  function actualizarGateGrabacion(lm){
    if(BIO.recording) return;
    var btn=document.getElementById('bio-btn-rec'); if(!btn) return;
    // Listo en cuanto se detecta el tronco (hombros + caderas). Los brazos se miden al moverlos.
    var ok = _vis(lm,11)&&_vis(lm,12)&&_vis(lm,23)&&_vis(lm,24);
    btn.disabled = !ok;
    var estado=document.getElementById('bio-estado'); if(!estado) return;
    if(!ok){ estado.textContent='Encuadra tronco y brazos (hombros y caderas)'; return; }
    // Verificación ACTIVA de orientación: guía qué vista mide bien cada plano de hombro.
    var fr=_orientRomFrontal(lm);
    estado.textContent = (fr===false)
      ? '✓ De PERFIL — flexión/extensión de hombro · para abducción y cuello, ponte de FRENTE'
      : '✓ De FRENTE — abducción, codo y cuello · para flexión/extensión de hombro, ponte de PERFIL';
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
      BIO.recorder.ondataavailable = function(e){ if(e.data && e.data.size && BIO.recChunks) BIO.recChunks.push(e.data); };  // guard: evento tardío tras reset → recChunks null
      BIO.recorder.start();
    }catch(e){ BIO.recorder=null; console.warn('[BIO] MediaRecorder no disponible (se guardarán solo ángulos):', e && e.message); }
  }
  // Detiene el grabador y arma el blob del clip (Promise).
  function finalizarGrabadorVideo(){
    return new Promise(function(resolve){
      var rec=BIO.recorder;
      function armar(){
        var c=BIO.recChunks||[]; BIO.recorder=null;
        return c.length ? { blob:new Blob(c,{type:BIO.recMime||'video/webm'}), mime:BIO.recMime||'video/webm', ext:((BIO.recMime||'').indexOf('mp4')>=0?'mp4':'webm') } : null;
      }
      if(!rec || rec.state==='inactive'){ resolve(armar()); return; }
      var done=false;
      function acabar(){ if(done) return; done=true; resolve(armar()); }   // idempotente
      rec.onstop=acabar;
      // iOS Safari: a veces 'onstop' NUNCA dispara → sin este timeout el Detener se colgaba.
      setTimeout(acabar, 1500);
      try{ rec.stop(); }catch(e){ acabar(); }
    });
  }
  async function toggleGrabacion(){
    if(BIO.finalizando) return;                          // ignora toques mientras cierra la grabación
    var fb=document.getElementById('bio-btn-flip');
    var btnRec=document.getElementById('bio-btn-rec');
    if(!BIO.recording){
      if(BIO.tipoMedicion==='sent'){ BIO.accS=nuevoAccSent(); }
      else if(BIO.tipoMedicion==='marcha'){ BIO.accM=nuevoAccMarcha(); }
      else { BIO.acc = nuevoAcumulador(); }
      BIO.framesTotales=0; BIO.framesDescartados=0; BIO.tStart=Date.now();   // O4: los descartes por generación empiezan en 0 en cada grabación
      BIO.pendingVideo=null; iniciarGrabadorVideo();     // graba el clip de cámara en paralelo
      BIO.recording=true;
      if(fb) fb.disabled=true;                            // no cambiar de cámara a media grabación
      if(btnRec){ btnRec.className='bio-b-stop'; btnRec.textContent='⏹️ Detener'; }
      document.getElementById('bio-cron').style.display='block';
      iniciarCronometro();
    } else {
      BIO.finalizando=true;                              // evita doble-toque / reentrada
      BIO.recording=false; pararCronometro();
      if(fb) fb.disabled=false;
      if(btnRec){ btnRec.disabled=true; btnRec.textContent='⏳ Procesando…'; }
      var dur = Math.round((Date.now()-BIO.tStart)/1000);
      // El video NUNCA bloquea la medición: finalizarGrabadorVideo tiene timeout (1.5s).
      try{ BIO.pendingVideo = await finalizarGrabadorVideo(); }catch(e){ BIO.pendingVideo=null; }
      var fps = dur>0 ? Math.round(BIO.framesTotales/dur) : BIO.framesTotales;
      BIO.finalizando=false;
      if(BIO.tipoMedicion==='sent'){
        var resS = finalizarSent(BIO.accS, _leerEstatura());
        mostrarResumenSent(resS, {
          fuente:'camara', duracionSeg:dur,
          calidad:{ fpsPromedio:fps, framesTotales:BIO.framesTotales, framesValidos:(BIO.accS?BIO.accS.framesValidos:0) }
        });
      } else if(BIO.tipoMedicion==='marcha'){
        var resM = finalizarMarcha(BIO.accM, _leerEstatura(), null);
        mostrarResumenMarcha(resM, {
          fuente:'camara', duracionSeg:dur,
          calidad:{ fpsPromedio:fps, framesTotales:BIO.framesTotales, framesValidos:(BIO.accM?BIO.accM.framesValidos:0) }
        });
      } else {
        var artic = finalizarMedidas(BIO.acc);
        mostrarResumen(artic, {
          fuente:'camara', duracionSeg:dur,
          calidad:{ fpsPromedio:fps, framesTotales:BIO.framesTotales, framesValidos:BIO.acc?BIO.acc.framesValidos:0 }
        });
      }
    }
  }
  function iniciarCronometro(){
    var el=document.getElementById('bio-cron');
    BIO.timerId=setInterval(function(){
      var s=Math.round((Date.now()-BIO.tStart)/1000);
      var mm=String(Math.floor(s/60)).padStart(2,'0'), ss=String(s%60).padStart(2,'0');
      if(el) el.textContent=mm+':'+ss;
      // Indicador VIVO de captura: cuántos cuadros VÁLIDOS lleva → el usuario VE que sí está grabando
      // (y si se queda en 0, el mensaje dice qué corregir en vez de dejarlo a ciegas).
      if(BIO.recording){
        var acc=(BIO.tipoMedicion==='sent')?BIO.accS:BIO.acc, fv=acc?acc.framesValidos:0;
        var estado=document.getElementById('bio-estado');
        if(estado){ estado.textContent = fv>0
          ? ('● Grabando · '+fv+' cuadros capturados')
          : '● Grabando · buscando al paciente… acércalo y mejora la luz'; }
      }
    },500);
  }
  function pararCronometro(){ if(BIO.timerId){ clearInterval(BIO.timerId); BIO.timerId=null; } }

  // Media móvil EXPONENCIAL solo para el número mostrado en el panel EN VIVO (anti-parpadeo).
  // NO toca las series acumuladas ni lo que se guarda: es puramente visual. Se re-siembra al
  // perder de vista el punto (ok=false) para no arrastrar un valor viejo cuando el brazo vuelve.
  function _emaVivo(key, ok, raw){
    var E=BIO.emaVivo || (BIO.emaVivo={});
    if(!ok || raw==null){ delete E[key]; return null; }
    E[key] = (E[key]==null) ? raw : (0.35*raw + 0.65*E[key]);   // α=0.35: suaviza sin arrastrar
    return E[key];
  }
  // Panel de ángulos en vivo (cámara).
  function pintarPanelVivo(ang){
    var panel=document.getElementById('bio-panel-vivo'); if(!panel) return;
    _panelVivoDocked(false);   // V3.1: estos modos conservan el overlay flotante dentro del visor
    BIO.emaVivo={};   // panel recreado → EMA en vivo fresca
    var filas = FILAS.map(function(f){
      var vi = valorVivoK(ang, f.izq), vd = valorVivoK(ang, f.der);
      return '<tr><td class="g">'+f.etq+'</td><td class="v" id="bv-'+f.izq+'">'+vi+'</td><td class="v" id="bv-'+f.der+'">'+vd+'</td></tr>';
    }).join('');
    panel.innerHTML = '<table><thead><tr><th>Movimiento</th><th style="text-align:right">Izq</th><th style="text-align:right">Der</th></tr></thead><tbody>'+filas+'</tbody></table>';
  }
  function valorVivoK(ang, key){
    if(!ang){ return '—'; }
    var r=ang[key];
    return (r && r.ok) ? (Math.round(r.val)+'°') : '—';
  }
  function actualizarPanelVivo(ang){
    if(!document.getElementById('bv-codo_flex_izq')){ pintarPanelVivo(ang); return; }
    MEDIDAS.forEach(function(m){
      var td=document.getElementById('bv-'+m.key); if(!td) return;
      if(BIO.recording && BIO.acc){
        var s=BIO.acc[m.key];
        td.textContent = (s && s.min!==null) ? (Math.round(s.min)+'–'+Math.round(s.max)) : '—';
      } else {
        var r=ang?ang[m.key]:null;
        var sm=_emaVivo(m.key, !!(r&&r.ok), (r&&r.ok)?r.val:null);   // suavizado visual (anti-parpadeo)
        td.textContent = (sm!=null) ? (Math.round(sm)+'°') : '—';
      }
    });
  }

  // ── MODO B: analizar video subido ──────────────────────────────────────────
  async function procesarVideo(file){
    if(!file.type || file.type.indexOf('video')!==0){ toast('Selecciona un archivo de video','error'); return; }
    BIO.modo='video'; _bumpGen(); _ensureHandsSiMuneca();
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
    // iOS Safari NO reproduce un <video> oculto → se quedaba en 0%. Usamos el <video> VISIBLE
    // que está en la vista de progreso; el esqueleto se dibuja encima (canvas superpuesto).
    var v=document.getElementById('bio-vid-src');
    v.muted=true; v.defaultMuted=true; v.setAttribute('muted',''); v.playsInline=true; v.setAttribute('playsinline',''); v.setAttribute('webkit-playsinline',''); v.preload='auto';
    try{ v.srcObject=null; }catch(_){} v.src=url;
    BIO.video=v; BIO.srcEl=v;
    try{
      await new Promise(function(res,rej){
        v.onloadedmetadata=function(){ res(); };
        v.onerror=function(){ rej(new Error('No se pudo leer el video')); };
        setTimeout(function(){ if((v.videoWidth>0)||(isFinite(v.duration)&&v.duration>0)) res(); }, 2500);
        // Archivo dañado que NUNCA dispara metadata NI error → sin este corte duro la espera
        // quedaba colgada para siempre en "Analizando video…".
        setTimeout(function(){
          if((v.videoWidth>0)||(isFinite(v.duration)&&v.duration>0)) res();
          else rej(new Error('No se pudo leer el video (archivo dañado o formato no compatible)'));
        }, 9000);
      });
    }catch(e){ URL.revokeObjectURL(url); limpiarVideoSrc(v); txt.textContent='⚠️ '+e.message; return; }

    var dur = (isFinite(v.duration) && v.duration>0) ? v.duration : 0;
    if(!dur){ URL.revokeObjectURL(url); limpiarVideoSrc(v); txt.textContent='⚠️ Video sin duración legible.'; return; }

    if(BIO.tipoMedicion==='sent'){ BIO.accS=nuevoAccSent(); }
    else if(BIO.tipoMedicion==='marcha'){ BIO.accM=nuevoAccMarcha(); }
    else if(BIO.tipoMedicion==='gonio'){ if(!BIO.accG) BIO.accG=nuevoAccGonio(); _gonioSelDefault(BIO.accG); BIO.accG.peak=null; BIO.accG.run=0; BIO._peakFrameCanvas=null; BIO._peakFrameLm=null; BIO._peakTSeg=null; BIO._gonioRot=0; BIO._peakHandsLm=null; BIO._peakGonioR=null; BIO._vidDur=dur; BIO._vidCands=[]; BIO._peakRot=0; BIO._peakFrameId=null; BIO._peakAdq=null; _ensureHandsSiMuneca(); }
    else { BIO.acc = nuevoAcumulador(); }
    BIO.framesTotales=0; BIO.framesDescartados=0;   // O4: reinicia descartes al empezar el análisis de video
    BIO.procesandoVideo=true; BIO.cancelVideo=false;
    txt.textContent='0%';
    // MUESTREO DURANTE REPRODUCCIÓN (robusto en iOS). El método anterior (seek cuadro-a-cuadro
    // con await pose.send) se colgaba en el 2º cuadro en Safari. Aquí reproducimos el video
    // muteado y enviamos cuadros a MediaPipe SIN await (fire-and-forget con guarda BIO.sending,
    // igual que el modo cámara que sí funciona). Progreso = currentTime / duración.
    function _muestrear(){ return new Promise(function(resolve){
      var minGap = 1/FPS_VIDEO, lastSample = -1, rafId = 0, terminado = false, arranque = Date.now();
      function terminar(){
        if(terminado) return; terminado = true;
        if(rafId) cancelAnimationFrame(rafId);
        clearInterval(watchdog);
        try{ v.pause(); }catch(_){}
        resolve();
      }
      var hintShown = false;
      // Watchdog: cierra si termina, se cancela, llega al final, o se pasa mucho del tiempo esperado.
      var watchdog = setInterval(function(){
        if(terminado) return;
        if(BIO.cancelVideo || v.ended || v.currentTime >= dur - 0.05) terminar();
        else if(Date.now() - arranque > (dur*1000)*3 + 10000) terminar();
      }, 400);
      function intentarPlay(){ try{ var pp=v.play(); if(pp && pp.catch) pp.catch(function(){}); }catch(_){} }
      function tick(){
        if(terminado) return;
        if(BIO.cancelVideo){ terminar(); return; }
        var t = v.currentTime || 0;
        // Mismo watchdog que en vivo: libera un send() colgado para no congelar el muestreo del video.
        // (V3.1) en goniómetro invalida la generación completa (contextos barridos, tardío descartado).
        if(BIO.sending && BIO._sendAt && (Date.now()-BIO._sendAt)>2500){
          BIO.sending=false;
          if(BIO.tipoMedicion==='gonio'){ _bumpGen(); _poseDeclararPerdidos(); }   // (V3.2) pérdida declarada
          else if(BIO._genQ && BIO._genQ.length) BIO._genQ.shift();
        }
        // iOS: si el video no arrancó (currentTime pegado en 0), reintenta reproducir dentro del loop
        // (muteado+playsinline suele autoplay, pero algunos iOS exigen reintentos). Throttle 700ms.
        if(t < 0.05 && (Date.now()-arranque) > 1000 && (Date.now()-(BIO._lastPlayTry||0)) > 700){ BIO._lastPlayTry=Date.now(); intentarPlay(); }
        if(!BIO.sending && BIO.pose && v.videoWidth>0 && (t - lastSample) >= minGap){
          lastSample = t; BIO.sending = true; BIO._sendAt = Date.now(); BIO.framesTotales++;
          if(BIO.tipoMedicion==='gonio'){
            // (V3.1) GONIÓMETRO: congela el cuadro a un raster del pool con contexto {frameId, mediaTime}
            // + lockstep de Hands (muñeca). Incluye el fix iOS/HEVC (drawImage a canvas 2D) y la rotación
            // de decúbito. El pico copia SIEMPRE de ese raster exacto — _vidFrameSent ya no se usa aquí.
            _gonioSendFrame(v, t).then(function(){ BIO.sending=false; }).catch(function(){ BIO.sending=false; });
          } else {
            // 🔑 iOS/HEVC (.MOV del iPhone): mandar el <video> DIRECTO a MediaPipe da cuadros NEGROS (iOS no
            // texturiza el video) → 0 válidos aunque el video sea perfecto. Se dibuja el cuadro a un CANVAS 2D
            // (drawImage de <video> a 2D SÍ funciona en iOS) y se manda el CANVAS. Android/PC: equivalente.
            var _fsrc = v;
            try{
              var _vc = BIO._vidSampleCv || (BIO._vidSampleCv = document.createElement('canvas'));
              if(_vc.width!==v.videoWidth || _vc.height!==v.videoHeight){ _vc.width=v.videoWidth; _vc.height=v.videoHeight; }
              (BIO._vidSampleCtx || (BIO._vidSampleCtx=_vc.getContext('2d'))).drawImage(v,0,0,_vc.width,_vc.height);
              _fsrc = _vc;
            }catch(_df){ _fsrc = v; }
            BIO._vidFrameSent = _fsrc; BIO._vidFrameT = t;
            _genSend(_fsrc).then(function(){ BIO.sending=false; }).catch(function(){ BIO.sending=false; });
          }
        }
        var pct = Math.min(99, Math.round((t/dur)*100));
        fill.style.width = pct+'%';
        // Si a los ~1.8s no arrancó, iOS exige gesto: mostrar pista y permitir tocar para reproducir.
        if(!hintShown && t < 0.05 && (Date.now()-arranque) > 1800){ hintShown=true; txt.textContent='▶︎ Toca el video para reproducir'; }
        else if(t >= 0.05){ txt.textContent = pct+'%'; }
        if(v.ended){ terminar(); return; }
        rafId = requestAnimationFrame(tick);
      }
      v.onended = terminar;
      v.onclick = intentarPlay;                 // iOS: tocar el video reintenta la reproducción
      intentarPlay();
      tick();
    }); }
    await _muestrear();
    // DECÚBITO (solo goniómetro por video): si NO detectó la articulación en la orientación normal,
    // reintenta rotando los cuadros 90°/-90°/180° (igual que la foto). El cuerpo acostado queda
    // "vertical" para el detector; el ángulo es invariante a la rotación. Solo corre si la 1ª pasada
    // (rot 0, IDÉNTICA a antes) no encontró pico → cero efecto en video normal y en los demás modos.
    if(BIO.tipoMedicion==='gonio' && !BIO.cancelVideo && !(BIO.accG && BIO.accG.peak!=null && BIO._peakFrameCanvas)){
      var _rotsVid=[90,-90,180];
      for(var _rvi=0; _rvi<_rotsVid.length && !BIO.cancelVideo; _rvi++){
        BIO._gonioRot=_rotsVid[_rvi]; _bumpGen(); BIO.sending=false;
        if(BIO.accG){ BIO.accG.peak=null; BIO.accG.run=0; } BIO._peakFrameCanvas=null; BIO._peakFrameLm=null; BIO._peakTSeg=null; BIO._peakHandsLm=null; BIO._peakGonioR=null; BIO._peakFrameId=null; BIO._peakAdq=null; BIO._vidCands=[]; BIO.framesTotales=0;
        if(txt) txt.textContent='Probando otra orientación…'; if(fill) fill.style.width='0%';
        try{ v.currentTime=0; }catch(_){}
        await _muestrear();
        if(BIO.accG && BIO.accG.peak!=null && BIO._peakFrameCanvas) break;
      }
      BIO._gonioRot=0;
    }
    BIO.procesandoVideo=false;
    URL.revokeObjectURL(url);
    limpiarVideoSrc(v);

    if(BIO.cancelVideo){ mostrarVista('bio-vista-inicio'); return; }
    fill.style.width='100%'; txt.textContent='100%';
    if(BIO.tipoMedicion==='sent'){
      var resS=finalizarSent(BIO.accS, _leerEstatura());
      mostrarResumenSent(resS, {
        fuente:'video', duracionSeg:Math.round(dur),
        calidad:{ fpsMuestreo:FPS_VIDEO, framesTotales:BIO.framesTotales, framesValidos:(BIO.accS?BIO.accS.framesValidos:0) }
      });
    } else if(BIO.tipoMedicion==='marcha'){
      var resM=finalizarMarcha(BIO.accM, _leerEstatura(), null);
      mostrarResumenMarcha(resM, {
        fuente:'video', duracionSeg:Math.round(dur),
        calidad:{ fpsMuestreo:FPS_VIDEO, framesTotales:BIO.framesTotales, framesValidos:(BIO.accM?BIO.accM.framesValidos:0) }
      });
    } else if(BIO.tipoMedicion==='gonio'){
      var gg=BIO.accG;
      if(gg && gg.peak!=null && BIO._peakFrameCanvas){
        BIO._estaticoHandsNext = (BIO._peakHandsLm!=null) ? BIO._peakHandsLm : undefined;   // manos del cuadro-pico, congeladas con él
        _mostrarGonioEstatico(BIO._peakFrameCanvas, BIO._peakFrameLm, 'video');
      } else {
        toast('No se detectó la articulación con claridad en el video. Grábalo de PERFIL, con la zona y buena luz en cuadro, o usa una foto.','warning');
        mostrarVista('bio-vista-inicio'); pintarGonioInicio();
      }
    } else {
      var artic=finalizarMedidas(BIO.acc);
      mostrarResumen(artic, {
        fuente:'video', duracionSeg:Math.round(dur),
        calidad:{ fpsMuestreo:FPS_VIDEO, framesTotales:BIO.framesTotales, framesValidos:BIO.acc.framesValidos }
      });
    }
  }
  // ── Resumen + guardado ─────────────────────────────────────────────────────
  // Formato de una medida: MEDIA de los picos como valor principal; mejor, ± consistencia y nº de
  // repeticiones como apoyo. Codo muestra extensión–flexión. Compatible con sesiones viejas (min–max Δ).
  function _fmtMedida(m, verde, gris){
    gris = gris || '#9BA3B5';
    if(!m) return '<span style="color:'+gris+'">—</span>';
    if(m.media!=null){
      var noConf = (m.confiable===false);                  // sesiones viejas: confiable undefined → se muestra normal
      var principal = (m.grupo==='Codo') ? (m.min+'°–'+m.max+'°') : (m.media+'°');
      var de = (m.de!=null) ? (' <span style="color:'+gris+'">±'+m.de+'°</span>') : '';
      var reps = m.reps ? (' · '+m.reps+(m.reps===1?' rep':' reps')) : '';
      var conf = noConf ? (' <span style="color:'+gris+';font-size:10px">⚠️ baja conf.</span>') : '';
      return '<b style="color:'+(noConf?gris:verde)+'">'+principal+'</b>'+de
           + '<span style="color:'+gris+';font-size:11px"> máx '+m.mejor+'°'+reps+'</span>'+conf;
    }
    if(m.reps==null && m.min!=null) return m.min+'°–'+m.max+'° <b style="color:'+verde+'">Δ'+m.rango+'°</b>';  // sesión vieja
    return '<span style="color:'+gris+'">—</span>';
  }
  function fmtRango(a){ return _fmtMedida(a, '#3DDC97', '#9BA3B5'); }
  function mostrarResumen(medidas, meta){
    detenerCamaraStream(); detenerLoopCamara();
    var cont=document.getElementById('bio-vista-resumen');
    var fuenteTxt = meta.fuente==='camara' ? '📷 Cámara en vivo' : '📁 Video';
    var by = medidasPorKey(medidas);
    var filas = FILAS.map(function(f){
      return '<tr><td class="g">'+f.etq+'</td><td>'+fmtRango(by[f.izq])+'</td><td>'+fmtRango(by[f.der])+'</td></tr>';
    }).join('');
    var hayDato = (medidas||[]).some(function(x){ return x && x.min!==null; });
    cont.innerHTML =
      '<h3>Resumen de la medición</h3>'
      + '<div style="color:#9BA3B5;font-size:13px;margin-bottom:10px">'+fuenteTxt+' · '+meta.duracionSeg+' s · '+(meta.calidad.framesValidos||0)+' cuadros válidos · convención clínica (0° neutro)<br>ROM = <b style="color:#C9D2E8">media de los picos</b> de cada repetición · máx = mejor intento · ± = consistencia entre reps<br><span style="color:#E8C96A">Margen 2D honesto:</span> abducción/codo/cuello ±5°, flexión/extensión de hombro ±10° (de frente van fuera de plano → para finura, de PERFIL). Diferencias entre sesiones &lt; ~8° pueden ser ruido. Margen estimado, no validado contra goniómetro físico.</div>'
      + '<table class="bio-tabla-res"><thead><tr><th>Movimiento</th><th>Izquierda</th><th>Derecha</th></tr></thead><tbody>'+filas+'</tbody></table>'
      + (hayDato ? '' : ('<div style="color:#E8C96A;font-size:13px;margin-top:10px">⚠️ No se detectó tronco + brazos con suficiente visibilidad'+((meta.calidad.framesTotales!=null)?(' ('+meta.calidad.framesTotales+' cuadros leídos'+((meta.calidad.framesTotales||0)===0?'; el video no se reprodujo — tócalo para reproducir y reintenta':'')+')'):'')+'. Repite con hombros, codos y caderas en cuadro y buena luz.</div>'))
      + ((hayDato && (meta.calidad.framesValidos||0)<20) ? '<div style="color:#E8C96A;font-size:12px;margin-top:8px">⚠️ Pocos cuadros válidos ('+(meta.calidad.framesValidos||0)+'). La medición puede ser inestable: repite con el paciente más cerca, buena luz y movimientos algo más lentos.</div>' : '')
      + '<div class="bio-acciones">'
      +   '<button class="bio-b-sec" id="bio-res-repetir">🔄 Repetir</button>'
      +   ((BIO.videoCola&&BIO.videoCola.length) ? '<button class="bio-b-sec" id="bio-res-saltar">⏭️ Saltar video ('+BIO.videoCola.length+')</button>' : '')
      +   (hayDato ? '<button class="bio-b-save" id="bio-res-guardar">'+((BIO.videoCola&&BIO.videoCola.length)?'💾 Guardar y siguiente ('+BIO.videoCola.length+')':'💾 Guardar en expediente')+'</button>' : '')
      + '</div>';
    mostrarVista('bio-vista-resumen');
    document.getElementById('bio-res-repetir').addEventListener('click', function(){ resetEstado(); mostrarVista('bio-vista-inicio'); });
    var _sk=document.getElementById('bio-res-saltar'); if(_sk) _sk.addEventListener('click', function(){ BIO_colaSiguiente(); });
    var g=document.getElementById('bio-res-guardar');
    if(g) g.addEventListener('click', function(){ guardarSesion(medidas, meta); });
  }

  // Sube el clip pendiente (cámara o archivo) a Storage. Devuelve el objeto video o null.
  // Compartido por ROM y sentadilla; si falla, la sesión se guarda igual (solo métricas).
  async function _subirVideoSesion(p, meta, btn, pref){
    if(!(BIO.pendingVideo && typeof fbStorage!=='undefined' && fbStorage)) return null;
    try{
      var _src = BIO.pendingVideo.blob || BIO.pendingVideo.file;
      var _ext = BIO.pendingVideo.ext || 'webm';
      var _ts = Date.now();
      var _safe = (pref||'rom')+'_'+String(p.name||'paciente').replace(/[^\w]/g,'_')+'_'+_ts+'.'+_ext;
      var _path = 'clinica/sinergia/'+p.id+'/biomecanica/'+_ts+'_'+_safe;
      var _ref = fbStorage.ref(_path);
      var _url = await new Promise(function(resolve,reject){
        var task=_ref.put(_src,{contentType:BIO.pendingVideo.mime||('video/'+_ext)});
        task.on('state_changed',
          function(s){ var pct=s.totalBytes?Math.round(s.bytesTransferred/s.totalBytes*100):0; if(btn) btn.textContent='☁️ Subiendo video… '+pct+'%'; },
          function(err){ reject(err); },
          function(){ task.snapshot.ref.getDownloadURL().then(resolve).catch(reject); });
      });
      return { url:_url, fbPath:_path, mime:BIO.pendingVideo.mime||('video/'+_ext), tamanoBytes:(_src&&_src.size)||0, fuente:meta.fuente };
    }catch(e){ console.warn('[BIO] subida de video falló:', e && e.message); toast('⚠️ El video no se pudo subir; se guardan las métricas','warning'); return null; }
  }
  // Persistencia común: push a p.biomecanica + historial + saveDB + cierre y re-render.
  async function _persistirSesion(p, sesion, btn, accionTxt){
    if(btn){ btn.textContent='⏳ Guardando…'; }
    if(!Array.isArray(p.biomecanica)) p.biomecanica=[];
    // Sello de trazabilidad común a TODA medición: versión del algoritmo + ajustes REALES de cámara (solo en vivo).
    try{
      if(!sesion.calidad || typeof sesion.calidad!=='object') sesion.calidad={};
      if(!sesion.calidad.algoVersion) sesion.calidad.algoVersion=BIO_ALGO_VER;
      if(!sesion.calidad.captura && sesion.fuente==='camara' && typeof BIO!=='undefined' && BIO.camSettings) sesion.calidad.captura=BIO.camSettings;
      if(sesion.calidad.framesDescartados==null && typeof BIO!=='undefined' && BIO.framesDescartados) sesion.calidad.framesDescartados=BIO.framesDescartados;
      if(sesion._estadoSync==null){ sesion._estadoSync='local'; sesion._estadoSyncFecha=null; }   // P1-10: estado real de sync; _syncBiomecanicaFS lo pone 'sincronizada' al confirmar la nube
    }catch(_s){}
    p.biomecanica.push(sesion);
    if(!Array.isArray(p.historialCambios)) p.historialCambios=[];
    p.historialCambios.push({ usuario:usuarioActual(), seccion:'biomecanica', fecha:sesion.fecha+' '+sesion.horaCreacion, accion:accionTxt, antes:'', despues:accionTxt });
    p.fechaActualizacion=fechaHoy(); p.ultimoUsuario=usuarioActual();
    try{
      var res = (typeof saveDB==='function') ? await saveDB('pts',[p]) : {ok:false};
      toast(res && res.ok ? '✅ Medición guardada en el expediente' : '⚠️ Guardada local, Sheets pendiente', res && res.ok ? 'success' : 'warning');
    }catch(e){
      toast('⚠️ Sin conexión — guardada local, se sincronizará','warning');
    }
    // Espejo cross-device de la sesión completa a Firestore (unión por id). Best-effort: la medición ya
    // quedó durable en local por saveDB; si falla o las reglas no están, se sube en la próxima apertura.
    try{ if(typeof window!=='undefined' && typeof window._syncBiomecanicaFS==='function'){ await window._syncBiomecanicaFS(p); } }catch(e){}
    // Cola de VARIOS videos en modos dinámicos (ROM/sentadilla/marcha): cada video es su propia sesión;
    // tras guardar ESTA, si quedan videos en el lote pasa al siguiente SIN cerrar el overlay. (El goniómetro
    // consume su cola ANTES de "Terminar y guardar", así que ahí sí cierra normal.)
    if(BIO.tipoMedicion!=='gonio' && BIO.videoCola && BIO.videoCola.length){
      var _n=BIO.videoCola.shift();
      toast('✅ Guardada. 📹 Siguiente video ('+BIO.videoCola.length+' en cola tras este)…','info');
      procesarVideo(_n);
      return;
    }
    cerrarMedidor();
    if(typeof renderExpediente==='function') renderExpediente('biomecanica');
  }
  async function guardarSesion(medidas, meta){
    var p = (typeof currentPatient!=='undefined') ? currentPatient : null;
    if(!p){ toast('Sin paciente activo','error'); return; }
    var btn=document.getElementById('bio-res-guardar'); if(btn){ btn.disabled=true; btn.textContent='⏳ Guardando…'; }
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
      medidas:medidas,                    // arreglo de movimientos {grupo,mov,lado,min,max,rango,muestras}
      calidad:meta.calidad||{},
      reportePdf:null,
      video:null,
      eliminado:false
    };
    sesion.video = await _subirVideoSesion(p, meta, btn, 'rom');
    await _persistirSesion(p, sesion, btn, 'Medición ROM ('+sesion.fuente+')');
  }

  // ── Sentadilla: panel vivo, esqueleto, gate, resumen y guardado ────────────
  function pintarPanelSent(f){
    var panel=document.getElementById('bio-panel-vivo'); if(!panel) return;
    _panelVivoDocked(false);   // V3.1: estos modos conservan el overlay flotante dentro del visor
    BIO.emaVivo={};   // panel recreado → EMA en vivo fresca
    panel.innerHTML = '<table><thead><tr><th>Sentadilla (frontal)</th><th style="text-align:right">Izq</th><th style="text-align:right">Der</th></tr></thead><tbody>'
      + '<tr><td class="g">Valgo FPPA</td><td class="v" id="bs-fppa-izq">—</td><td class="v" id="bs-fppa-der">—</td></tr>'
      + '<tr><td class="g">Separación rod./tob.</td><td class="v" id="bs-sep" colspan="2" style="text-align:right">—</td></tr>'
      + '<tr><td class="g">Tronco lateral</td><td class="v" id="bs-tro" colspan="2" style="text-align:right">—</td></tr>'
      + '</tbody></table>';
  }
  function actualizarPanelSent(f){
    if(!document.getElementById('bs-fppa-izq')){ pintarPanelSent(f); if(!document.getElementById('bs-fppa-izq')) return; }
    function pon(id,txt){ var el=document.getElementById(id); if(el) el.textContent=txt; }
    if(!f){ pon('bs-fppa-izq','—'); pon('bs-fppa-der','—'); pon('bs-sep','—'); pon('bs-tro','—'); return; }
    var eFi=_emaVivo('s_fppaI', f.fppaIzq.ok, f.fppaIzq.ok?f.fppaIzq.val:null);       // suavizado visual
    var eFd=_emaVivo('s_fppaD', f.fppaDer.ok, f.fppaDer.ok?f.fppaDer.val:null);
    var eSe=_emaVivo('s_sep',   f.sepRatio.ok, f.sepRatio.ok?f.sepRatio.val:null);
    var eTr=_emaVivo('s_tro',   f.troncoLat.ok, f.troncoLat.ok?f.troncoLat.val:null);
    pon('bs-fppa-izq', eFi!=null ? (Math.round(eFi)+'°') : '—');
    pon('bs-fppa-der', eFd!=null ? (Math.round(eFd)+'°') : '—');
    pon('bs-sep', eSe!=null ? eSe.toFixed(2) : '—');
    pon('bs-tro', eTr!=null ? (Math.abs(Math.round(eTr))+'°') : '—');
  }
  // Etiquetas vivas junto a cada rodilla (V + = valgo / − = varo), encima del esqueleto ya dibujado.
  function dibujarSentVivo(f){
    if(!f || !BIO.ctx || !BIO.canvas) return;
    var ctx=BIO.ctx, w=BIO.canvas.width, h=BIO.canvas.height;
    if(!w || !h) return;
    ctx.font='bold '+Math.max(11, Math.round(w*0.026))+'px -apple-system,Arial';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    [['rodillaIzq','fppaIzq'],['rodillaDer','fppaDer']].forEach(function(par){
      var pt=f.p && f.p[par[0]], m=f[par[1]];
      if(!pt || !m || !m.ok) return;
      var x=pt.x*w, y=pt.y*h-14, txt='V '+Math.round(m.val)+'°';
      ctx.fillStyle='rgba(13,22,38,.75)';
      var tw=ctx.measureText(txt).width;
      ctx.fillRect(x-tw/2-5, y-11, tw+10, 22);
      ctx.fillStyle = (m.val>=10) ? '#E8C96A' : '#3DDC97';
      ctx.fillText(txt, x, y);
    });
  }
  function actualizarGateSent(lm, f){
    if(BIO.recording) return;
    var btn=document.getElementById('bio-btn-rec'); if(!btn) return;
    var ok = !!(f && f.piernasOK && f.troncoOK && _vis(lm,0));
    btn.disabled=!ok;
    var estado=document.getElementById('bio-estado'); if(!estado) return;
    if(!ok){ estado.textContent='Encuadra el cuerpo COMPLETO de frente (cabeza, caderas, rodillas y tobillos)'; return; }
    if(f.orientFrontal===false){ estado.textContent='⚠️ Parece PERFIL — esta toma se hace DE FRENTE a la cámara'; return; }
    estado.textContent='✓ Listo — pide 3 a 5 sentadillas a ritmo cómodo';
  }
  function mostrarResumenSent(res, meta){
    detenerCamaraStream(); detenerLoopCamara();
    var cont=document.getElementById('bio-vista-resumen');
    var by={}; (res.medidas||[]).forEach(function(m){ by[m.key]=m; });
    function fmtM(m, etqExt){
      if(!m || m.media==null) return '<span style="color:#9BA3B5">—</span>';
      var esRatio=(m.unidad==='ratio'), suf=esRatio?'':(m.unidad==='%'?'%':'°');
      var val=esRatio?m.media.toFixed(2):(_r1(m.media)+suf);
      var ext=(m.extremo!=null)?(' <span style="color:#9BA3B5;font-size:11px">'+etqExt+' '+(esRatio?m.extremo.toFixed(2):(_r1(m.extremo)+suf))+'</span>'):'';
      var de=(m.de!=null)?(' <span style="color:#9BA3B5">±'+_r1(m.de)+'</span>'):'';
      var conf=m.confiable?'':' <span style="color:#E8C96A;font-size:11px">⚠️ baja confianza</span>';
      return '<b style="color:#3DDC97">'+val+'</b>'+de+ext+conf;
    }
    var q=res.calidad||{}, avisos=[];
    if(q.orientacionOK===false) avisos.push('⚠️ La toma no se vio de FRENTE — el valgo frontal no es interpretable; repite con el paciente de frente.');
    if(q.camaraMovida) avisos.push('⚠️ La cámara o el paciente se desplazaron durante la toma — medidas marcadas como no confiables.');
    if(!res.nReps) avisos.push('⚠️ No se detectaron sentadillas completas (descenso mínimo '+SENT_MIN_DESC+'% de la estatura). Repite con sentadillas más profundas o el cuerpo completo en cuadro.');
    if(res.nReps && q.framesValidos!=null && q.framesValidos<20) avisos.push('⚠️ Pocos cuadros válidos ('+q.framesValidos+'). La medición puede ser inestable: repite con el cuerpo completo en cuadro, buena luz y bajadas algo más lentas.');
    var desc=by['sacro_descenso'], cmTxt='';
    if(desc && desc.media!=null && res.calibracion && res.calibracion.estaturaCm){
      cmTxt=' <span style="color:#9BA3B5;font-size:11px">≈ '+_r1(desc.media*res.calibracion.estaturaCm/100)+' cm (±10%)</span>';
    }
    cont.innerHTML =
      '<h3>Resumen — Sentadilla (análisis frontal)</h3>'
      + '<div style="color:#9BA3B5;font-size:13px;margin-bottom:10px">'+(meta.fuente==='camara'?'📷 Cámara en vivo':'📁 Video')+' · '+meta.duracionSeg+' s · '
      +   res.nReps+' repetición'+(res.nReps===1?'':'es')+' · FPPA a media bajada · MKD y separación en el fondo</div>'
      + '<table class="bio-tabla-res"><thead><tr><th>Métrica</th><th>Izquierda</th><th>Derecha</th></tr></thead><tbody>'
      + '<tr><td class="g">Valgo dinámico FPPA</td><td>'+fmtM(by['fppa_izq'],'peor')+'</td><td>'+fmtM(by['fppa_der'],'peor')+'</td></tr>'
      + '<tr><td class="g">Desplaz. medial (MKD, % pelvis)</td><td>'+fmtM(by['mkd_izq'],'peor')+'</td><td>'+fmtM(by['mkd_der'],'peor')+'</td></tr>'
      + '<tr><td class="g">Separación rodillas/tobillos</td><td colspan="2">'+fmtM(by['sep_rodillas'],'mín')+'</td></tr>'
      + '<tr><td class="g">Tronco lateral</td><td colspan="2">'+fmtM(by['tronco_lateral'],'máx')+'</td></tr>'
      + '<tr><td class="g">Descenso del sacro</td><td colspan="2">'+fmtM(by['sacro_descenso'],'máx')+cmTxt+'</td></tr>'
      + '</tbody></table>'
      + (avisos.length?('<div style="color:#E8C96A;font-size:13px;margin-top:10px">'+avisos.join('<br>')+'</div>'):'')
      + '<div class="bio-acciones">'
      +   '<button class="bio-b-sec" id="bio-res-repetir">🔄 Repetir</button>'
      +   ((BIO.videoCola&&BIO.videoCola.length) ? '<button class="bio-b-sec" id="bio-res-saltar">⏭️ Saltar video ('+BIO.videoCola.length+')</button>' : '')
      +   (res.nReps ? '<button class="bio-b-save" id="bio-res-guardar">'+((BIO.videoCola&&BIO.videoCola.length)?'💾 Guardar y siguiente ('+BIO.videoCola.length+')':'💾 Guardar en expediente')+'</button>' : '')
      + '</div>';
    mostrarVista('bio-vista-resumen');
    document.getElementById('bio-res-repetir').addEventListener('click', function(){ resetEstado(); mostrarVista('bio-vista-inicio'); });
    var _sk=document.getElementById('bio-res-saltar'); if(_sk) _sk.addEventListener('click', function(){ BIO_colaSiguiente(); });
    var g=document.getElementById('bio-res-guardar');
    if(g) g.addEventListener('click', function(){ guardarSesionSent(res, meta); });
  }
  async function guardarSesionSent(res, meta){
    var p = (typeof currentPatient!=='undefined') ? currentPatient : null;
    if(!p){ toast('Sin paciente activo','error'); return; }
    var btn=document.getElementById('bio-res-guardar'); if(btn){ btn.disabled=true; btn.textContent='⏳ Guardando…'; }
    var sesion = {
      id:'bm_'+p.id+'_'+Date.now(),
      tipo:'sentadilla',
      fuente:meta.fuente,
      fecha:fechaHoy(), horaCreacion:horaAhora(), fechaHoraISO:new Date().toISOString(),
      terapeuta:usuarioActual(), convencion:'clinica',
      vistas:{ frontal:{ duracionSeg:meta.duracionSeg||0, nReps:res.nReps, calidad:res.calidad } },
      duracionSeg:meta.duracionSeg||0,
      medidas:res.medidas, porRep:res.porRep, calibracion:res.calibracion,
      calidad:meta.calidad||{},
      // Las trayectorias completas NO caben en Sheets: se persisten aparte (Storage + IndexedDB)
      // y aquí queda solo el puntero. En Sheets viaja únicamente este resumen.
      trayectorias:null,
      reportePdf:null, video:null, eliminado:false
    };
    sesion.video = await _subirVideoSesion(p, meta, btn, 'sent');
    if(btn) btn.textContent='⏳ Guardando…';
    await _persistirTray(p, sesion, _paqueteTray(BIO.accS, meta, res));
    await _persistirSesion(p, sesion, btn, 'Sentadilla frontal ('+meta.fuente+')');
  }

  // ── Marcha: panel vivo, gate (guía de PERFIL), resumen y guardado ──────────
  function pintarPanelMarcha(f){
    var panel=document.getElementById('bio-panel-vivo'); if(!panel) return;
    _panelVivoDocked(false);   // V3.1: estos modos conservan el overlay flotante dentro del visor
    BIO.emaVivo={};
    panel.innerHTML = '<table><thead><tr><th>Marcha (perfil)</th><th style="text-align:right">Izq</th><th style="text-align:right">Der</th></tr></thead><tbody>'
      + '<tr><td class="g">Rodilla flex</td><td class="v" id="bm-rod-i">—</td><td class="v" id="bm-rod-d">—</td></tr>'
      + '<tr><td class="g">Cadera</td><td class="v" id="bm-cad-i">—</td><td class="v" id="bm-cad-d">—</td></tr>'
      + '</tbody></table>';
  }
  function actualizarPanelMarcha(f){
    if(!document.getElementById('bm-rod-i')){ pintarPanelMarcha(f); if(!document.getElementById('bm-rod-i')) return; }
    function pon(id,t){ var el=document.getElementById(id); if(el) el.textContent=t; }
    if(!f){ pon('bm-rod-i','—'); pon('bm-rod-d','—'); pon('bm-cad-i','—'); pon('bm-cad-d','—'); return; }
    var eRi=_emaVivo('m_rodI',f.rodIzq.ok,f.rodIzq.ok?f.rodIzq.val:null), eRd=_emaVivo('m_rodD',f.rodDer.ok,f.rodDer.ok?f.rodDer.val:null);
    var eCi=_emaVivo('m_hipI',f.hipIzq.ok,f.hipIzq.ok?f.hipIzq.val:null), eCd=_emaVivo('m_hipD',f.hipDer.ok,f.hipDer.ok?f.hipDer.val:null);
    pon('bm-rod-i', eRi!=null?(Math.round(eRi)+'°'):'—'); pon('bm-rod-d', eRd!=null?(Math.round(eRd)+'°'):'—');
    pon('bm-cad-i', eCi!=null?(Math.round(eCi)+'°'):'—'); pon('bm-cad-d', eCd!=null?(Math.round(eCd)+'°'):'—');
  }
  function actualizarGateMarcha(lm, f){
    if(BIO.recording) return;
    var btn=document.getElementById('bio-btn-rec'); if(!btn) return;
    var ok = !!(f && (f.rodIzq.ok||f.rodDer.ok) && _vis(lm,23)&&_vis(lm,24)&&_vis(lm,27)&&_vis(lm,28));
    btn.disabled=!ok;
    var estado=document.getElementById('bio-estado'); if(!estado) return;
    if(!ok){ estado.textContent='Encuadra el cuerpo COMPLETO de PERFIL (cadera, rodilla y tobillo en cuadro)'; return; }
    if(f.orientPerfil===false){ estado.textContent='⚠️ Parece DE FRENTE — la marcha se graba DE PERFIL (de lado a la cámara)'; return; }
    estado.textContent='✓ Listo — DE PERFIL, pide que camine 8–10 pasos (ideal en caminadora)';
  }
  function mostrarResumenMarcha(res, meta){
    detenerCamaraStream(); detenerLoopCamara();
    var cont=document.getElementById('bio-vista-resumen');
    var by={}; (res.medidas||[]).forEach(function(m){ by[m.key]=m; });
    function fmt(m){ if(!m || m.valor==null) return '<span style="color:#9BA3B5">—</span>';
      var u=(m.unidad==='m')?' m':(m.unidad==='%'?'%':(m.unidad==='pasos/min'?'':'°'));
      var conf=m.confiable?'':' <span style="color:#E8C96A;font-size:11px">⚠️ baja conf.</span>';
      return '<b style="color:#3DDC97">'+m.valor+u+'</b>'+conf; }
    function simTxt(v){ if(v==null) return '—'; var c=(v>=90)?'#3DDC97':(v>=80?'#E8C96A':'#E8836A'); return '<b style="color:'+c+'">'+v+'%</b>'; }
    var q=res.calidad||{}, avisos=[];
    if(res.calidad && res.calidad.orientPerfilOK===false) avisos.push('⚠️ La toma no se vio DE PERFIL — la marcha se mide de lado; repite con el paciente de perfil a la cámara.');
    if(!res.nCiclos) avisos.push('⚠️ No se detectaron ciclos de marcha completos. Repite DE PERFIL, con el cuerpo completo en cuadro y 8–10 pasos (o en caminadora).');
    if(res.nCiclos && q.framesValidos!=null && q.framesValidos<20) avisos.push('⚠️ Pocos cuadros válidos ('+q.framesValidos+'). Repite con mejor luz y el cuerpo completo en cuadro.');
    if(q.tiempoDudoso) avisos.push('⚠️ '+(q.tiempoDudosoMsg||'Ritmo atípico: si el video es en cámara lenta o acelerada, los tiempos no son fiables.'));
    if(meta && meta.fuente==='video') avisos.push('⏱️ Al guardar se te preguntará si el video es a velocidad normal (afecta solo los tiempos; los ángulos no).');
    var vel=(res.velocidad!=null)?(res.velocidad+' m/s'):'—';
    cont.innerHTML =
      '<h3>Resumen — Marcha (análisis sagital)</h3>'
      + '<div style="color:#9BA3B5;font-size:13px;margin-bottom:10px">'+(meta.fuente==='camara'?'📷 Cámara en vivo':'📁 Video')+' · '+meta.duracionSeg+' s · '
      +   res.nCiclos+' ciclo'+(res.nCiclos===1?'':'s')+' · cadencia '+(res.cadencia!=null?res.cadencia+' pasos/min':'—')+' · velocidad '+vel+'<br>'
      +   '<span style="color:#E8C96A">Cribado 2D de perfil:</span> tiempos y sagital son lo fiable; el tobillo es aproximado; sin rotaciones ni cinética. Compara al paciente consigo mismo.</div>'
      + '<table class="bio-tabla-res"><thead><tr><th>Métrica</th><th>Izquierda</th><th>Derecha</th></tr></thead><tbody>'
      + '<tr><td class="g">Fase de apoyo</td><td>'+fmt(by['stance_izq'])+'</td><td>'+fmt(by['stance_der'])+'</td></tr>'
      + '<tr><td class="g">Doble apoyo</td><td colspan="2">'+fmt(by['doble_apoyo'])+'</td></tr>'
      + '<tr><td class="g">Longitud de paso</td><td colspan="2">'+fmt(by['paso_long'])+'</td></tr>'
      + '<tr><td class="g">Rodilla · flexión pico</td><td>'+fmt(by['rod_pico_izq'])+'</td><td>'+fmt(by['rod_pico_der'])+'</td></tr>'
      + '<tr><td class="g">Cadera · ROM flexo-ext</td><td>'+fmt(by['cadera_rom_izq'])+'</td><td>'+fmt(by['cadera_rom_der'])+'</td></tr>'
      + '<tr><td class="g">Tobillo · ROM</td><td>'+fmt(by['tobillo_rom_izq'])+'</td><td>'+fmt(by['tobillo_rom_der'])+'</td></tr>'
      + '</tbody></table>'
      + '<div style="color:#C9D2E8;font-size:13px;margin-top:10px">Simetría izq/der — Rodilla '+simTxt(res.simetria&&res.simetria.rodPeak)+' · Cadera '+simTxt(res.simetria&&res.simetria.hipROM)+' · Apoyo '+simTxt(res.simetria&&res.simetria.stancePct)+' <span style="color:#9BA3B5">(100% = simétrico)</span></div>'
      + (avisos.length?('<div style="color:#E8C96A;font-size:13px;margin-top:10px">'+avisos.join('<br>')+'</div>'):'')
      + '<div class="bio-acciones">'
      +   '<button class="bio-b-sec" id="bio-res-repetir">🔄 Repetir</button>'
      +   ((BIO.videoCola&&BIO.videoCola.length) ? '<button class="bio-b-sec" id="bio-res-saltar">⏭️ Saltar video ('+BIO.videoCola.length+')</button>' : '')
      +   (res.nCiclos ? '<button class="bio-b-save" id="bio-res-guardar">'+((BIO.videoCola&&BIO.videoCola.length)?'💾 Guardar y siguiente ('+BIO.videoCola.length+')':'💾 Guardar en expediente')+'</button>' : '')
      + '</div>';
    mostrarVista('bio-vista-resumen');
    document.getElementById('bio-res-repetir').addEventListener('click', function(){ resetEstado(); mostrarVista('bio-vista-inicio'); });
    var _sk=document.getElementById('bio-res-saltar'); if(_sk) _sk.addEventListener('click', function(){ BIO_colaSiguiente(); });
    var g=document.getElementById('bio-res-guardar');
    if(g) g.addEventListener('click', function(){ guardarSesionMarcha(res, meta); });
  }
  // ── Hallazgo D: verificación del TIEMPO físico del video (cámara lenta / VFR) ──────────────
  // Un slow-mo ya re-muxeado NO se puede auto-detectar (duración y fps del contenedor son los del archivo).
  // Separamos (a) plausibilidad del movimiento (_cadenciaDudosa 20–220, ya existente) de (b) verificación del
  // tiempo real: cámara en vivo = reloj real (confiable); video subido = se PREGUNTA al terapeuta UNA vez por
  // archivo, con default seguro "No sé". Solo afecta métricas TEMPORALES/ESPACIALES; los ángulos no.
  function _sigArchivo(f){ return f ? ((f.name||'')+'|'+(f.size||0)+'|'+(f.lastModified||0)) : ''; }
  function _tiempoMeta(fuente, confirmado){
    if(fuente==='camara') return { tiempoVerificado:true, fuenteTiempo:'camara-vivo' };
    return (confirmado===true) ? { tiempoVerificado:true, fuenteTiempo:'video-confirmado' }
                               : { tiempoVerificado:false, fuenteTiempo:'video-sin-confirmar' };
  }
  // AND con la plausibilidad: una temporal queda confiable SOLO si tiempoVerificado (finalizarMarcha ya aplicó
  // !_cadenciaDudosa). Este gate solo puede BAJAR confiable a false, NUNCA re-habilitarla.
  function _gatearTemporalPorTiempo(medidas, tiempoVerificado){
    (medidas||[]).forEach(function(m){ if(m && (m.grupo==='Temporal'||m.grupo==='Espacial') && !tiempoVerificado){ m.confiable=false; } });
    return medidas;
  }
  // Modal de confirmación (NO confirm(): su botón por defecto es Aceptar → sesgo a "Sí"/click-through). El botón
  // prominente/por defecto es "No sé" (seguro); "Sí" exige un clic deliberado. Tocar fuera → "No sé". Promise<bool>.
  function _preguntarVelocidadNormal(pistaDudosa){
    return new Promise(function(resolve){
      var prev=document.getElementById('bio-vel-modal'); if(prev&&prev.parentNode) prev.parentNode.removeChild(prev);
      var ov=document.createElement('div'); ov.id='bio-vel-modal';
      ov.style.cssText='position:fixed;inset:0;z-index:100002;background:rgba(13,22,38,.72);display:flex;align-items:center;justify-content:center;padding:18px';
      var pista=pistaDudosa ? '<div style="background:#FEF3C7;border:1px solid #FCD34D;color:#92400E;font-size:12px;padding:7px 9px;border-radius:8px;margin-bottom:10px">⚠️ La cadencia calculada es atípica — si el video es en cámara lenta, los tiempos no son fiables.</div>' : '';
      ov.innerHTML='<div style="background:#fff;border-radius:14px;max-width:420px;width:100%;padding:18px 18px 14px;box-shadow:0 10px 40px rgba(0,0,0,.4)">'
        +'<div style="font-weight:800;color:#1B3A6B;font-size:16px;margin-bottom:8px">⏱️ ¿Velocidad del video?</div>'
        +'<div style="color:#444;font-size:13.5px;line-height:1.5;margin-bottom:12px">Para que la cadencia, las fases de apoyo, la longitud de paso y la velocidad sean fiables, el video debe estar a <b>velocidad normal</b> (no cámara lenta). Un video en cámara lenta ya re-muxeado no se puede detectar solo.</div>'
        +pista
        +'<button id="bio-vel-nose" style="width:100%;background:#1B3A6B;color:#fff;border:none;border-radius:10px;padding:12px;font-size:14px;font-weight:800;cursor:pointer;margin-bottom:8px">No sé / puede ser cámara lenta</button>'
        +'<button id="bio-vel-si" style="width:100%;background:#fff;color:#1B3A6B;border:1.5px solid #c9d2e8;border-radius:10px;padding:11px;font-size:13.5px;font-weight:700;cursor:pointer">Sí, se grabó a velocidad normal</button>'
        +'<div style="font-size:11px;color:#9BA3B5;margin-top:9px">Los ángulos (rodilla, cadera, tobillo) son fiables en cualquier caso.</div>'
        +'</div>';
      document.body.appendChild(ov);
      function done(v){ try{ if(ov.parentNode) ov.parentNode.removeChild(ov); }catch(_e){} resolve(v); }
      var bN=ov.querySelector('#bio-vel-nose'), bS=ov.querySelector('#bio-vel-si');
      if(bN) bN.onclick=function(){ done(false); };
      if(bS) bS.onclick=function(){ done(true); };
      ov.onclick=function(e){ if(e.target===ov) done(false); };
    });
  }
  // Pregunta UNA vez POR ARCHIVO (firma nombre+tamaño+lastModified). Reanálisis del mismo video no re-pregunta.
  async function _confirmarVelocidadArchivo(pendingVideo, pistaDudosa){
    var sig=_sigArchivo(pendingVideo && pendingVideo.file);
    if(!sig) return false;                                   // sin archivo identificable → conservador
    if(!BIO._velTiempo) BIO._velTiempo={};
    if(Object.prototype.hasOwnProperty.call(BIO._velTiempo, sig)) return BIO._velTiempo[sig];   // ya se preguntó por ESTE archivo
    var r = await _preguntarVelocidadNormal(!!pistaDudosa);
    BIO._velTiempo[sig]=r;
    return r;
  }
  async function guardarSesionMarcha(res, meta){
    var p = (typeof currentPatient!=='undefined') ? currentPatient : null;
    if(!p){ toast('Sin paciente activo','error'); return; }
    var btn=document.getElementById('bio-res-guardar'); if(btn){ btn.disabled=true; btn.textContent='⏳ Guardando…'; }
    // Hallazgo D: verifica el tiempo físico (gatea SOLO temporales/espaciales; los ángulos no se tocan).
    var _tv;
    if(meta.fuente==='camara'){ _tv=_tiempoMeta('camara'); }
    else { var _pista=!!(res && res.calidad && res.calidad.tiempoDudoso); var _c=await _confirmarVelocidadArchivo(BIO.pendingVideo, _pista); _tv=_tiempoMeta('video', _c); }
    res.calidad = res.calidad || {};
    res.calidad.tiempoVerificado=_tv.tiempoVerificado; res.calidad.fuenteTiempo=_tv.fuenteTiempo;
    _gatearTemporalPorTiempo(res.medidas, _tv.tiempoVerificado);
    var sesion = {
      id:'bm_'+p.id+'_'+Date.now(),
      tipo:'marcha',
      fuente:meta.fuente,
      fecha:fechaHoy(), horaCreacion:horaAhora(), fechaHoraISO:new Date().toISOString(),
      terapeuta:usuarioActual(), convencion:'clinica',
      duracionSeg:meta.duracionSeg||0,
      nCiclos:res.nCiclos, cadencia:res.cadencia, velocidad:res.velocidad,
      temporal:res.temporal, espacial:res.espacial, sagital:res.sagital, simetria:res.simetria,
      medidas:res.medidas, calibracion:res.calibracion, calidad:Object.assign({}, res.calidad||{}, meta.calidad||{}),   // P1-9: conserva tiempoDudoso/visPct/orientPerfilOK de res.calidad
      reportePdf:null, video:null, eliminado:false
    };
    sesion.video = await _subirVideoSesion(p, meta, btn, 'marcha');
    await _persistirSesion(p, sesion, btn, 'Marcha sagital ('+meta.fuente+')');
  }

  // ═════════════ RECONSTRUCCIÓN VISUAL (esqueleto + trayectorias) ═════════════
  // Empaqueta las trayectorias alineadas por frame + fps + aspecto + frame del fondo (sacro
  // más bajo). Compacto: coords enteras 0..1000, null donde el punto no se vio.
  function _paqueteTray(accS, meta, res){
    if(!accS || !accS.tray || !accS.trayN) return null;
    var sac=accS.tray.sacro||[], fondo=null, maxY=-1;
    for(var k=0;k<sac.length;k++){ if(sac[k] && sac[k][1]>maxY){ maxY=sac[k][1]; fondo=k; } }
    // Escala vertical para gráficas en cm/%: yBase (de pie, p05 de sacroY) y hEst (px de estatura),
    // en las MISMAS unidades ×1000 que puntos. estaturaCm si se capturó (para cm reales).
    var sy=(accS.s.sacroY||[]).map(function(o){return o.v;}).sort(function(a,b){return a-b;});
    var yBase = sy.length ? sy[Math.floor(0.05*(sy.length-1))]*1000 : null;
    var hs=(accS.s.alturaPx||[]).map(function(o){return o.v;}).sort(function(a,b){return a-b;});
    var hEst = hs.length ? (hs[Math.floor(0.90*(hs.length-1))]/0.88)*1000 : null;
    return { v:1, fps:(meta&&meta.calidad&&(meta.calidad.fpsPromedio||meta.calidad.fpsMuestreo))||12,
      aspect:accS.aspect||0.5625, nReps:(res&&res.nReps)||0, fondo:fondo, n:accS.trayN, puntos:accS.tray,
      porRep:(res&&res.porRep)||[], trayFrame:accS.trayFrame||[], escala:{ yBase:yBase, hEst:hEst, estaturaCm:(res&&res.calibracion&&res.calibracion.estaturaCm)||null } };   // P2-14: trayFrame (posición→nº de cuadro) lo usa _dibujarSacro para ubicar el fondo
  }
  // Persiste el paquete: memoria (replay inmediato) + IndexedDB (offline, mismo dispositivo) +
  // Storage (viaja entre dispositivos). En la sesión solo queda el puntero.
  async function _persistirTray(p, sesion, paquete){
    if(!paquete){ sesion.trayectorias={ estado:'nada' }; return; }
    BIO.trayCache = BIO.trayCache || {};
    BIO.trayCache[sesion.id] = paquete;
    var _tc=Object.keys(BIO.trayCache); while(_tc.length>5){ delete BIO.trayCache[_tc.shift()]; }
    try{ if(typeof idbSet==='function') await idbSet('bio_tray_'+sesion.id, paquete); }catch(e){}
    if(typeof fbStorage!=='undefined' && fbStorage){
      try{
        var blob=new Blob([JSON.stringify(paquete)],{type:'application/json'});
        var path='clinica/sinergia/'+p.id+'/biomecanica/tray_'+sesion.id+'.json';
        var ref=fbStorage.ref(path);
        var url=await new Promise(function(resolve,reject){
          var task=ref.put(blob,{contentType:'application/json'});
          task.on('state_changed', null, function(err){ reject(err); }, function(){ task.snapshot.ref.getDownloadURL().then(resolve).catch(reject); });
        });
        sesion.trayectorias={ estado:'ok', url:url, fbPath:path, fps:paquete.fps, aspect:paquete.aspect, muestras:paquete.n, fondo:paquete.fondo };
        return;
      }catch(e){ console.warn('[BIO] subida de trayectorias falló:', e && e.message); }
    }
    sesion.trayectorias={ estado:'local', fps:paquete.fps, aspect:paquete.aspect, muestras:paquete.n, fondo:paquete.fondo };
  }
  // Carga el paquete de una sesión: memoria → IndexedDB → Storage (fetch del JSON).
  async function _cargarTray(sid, sesion){
    if(BIO.trayCache && BIO.trayCache[sid]) return BIO.trayCache[sid];
    try{ if(typeof idbGet==='function'){ var loc=await idbGet('bio_tray_'+sid); if(loc && loc.puntos) return loc; } }catch(e){}
    var tr=sesion && sesion.trayectorias;
    if(tr && tr.url){
      try{ var r=await fetch(tr.url); if(r.ok){ var j=await r.json(); if(j && j.puntos) return j; } }catch(e){}
    }
    return null;
  }

  // Esqueleto COMPLETO (monito) por nombre de articulación; la cabeza se traza aparte (hombros→nariz).
  var RECON_SEGS=[
    ['hombroIzq','hombroDer'],['hombroIzq','caderaIzq'],['hombroDer','caderaDer'],['caderaIzq','caderaDer'],
    ['hombroIzq','codoIzq'],['codoIzq','munecaIzq'],['hombroDer','codoDer'],['codoDer','munecaDer'],
    ['caderaIzq','rodillaIzq'],['rodillaIzq','tobilloIzq'],['caderaDer','rodillaDer'],['rodillaDer','tobilloDer']
  ];
  // Colores por articulación imitando la referencia Kinect (manos morado/olivo, pies rojo/verde).
  var RECON_COLORES={
    sacro:'#8B2E2E', nariz:'#444444', hombroIzq:'#17A2A2', hombroDer:'#17A2A2',
    codoIzq:'#8A6D3B', codoDer:'#8A6D3B', munecaIzq:'#9B30FF', munecaDer:'#9AA000',
    caderaIzq:'#6E5AA8', caderaDer:'#6E5AA8', rodillaIzq:'#2E8B57', rodillaDer:'#3B6BC0',
    tobilloIzq:'#E23B3B', tobilloDer:'#20A040' };
  var RECON={ paquete:null, frame:0, playing:false, raf:null, speed:1, last:0, box:null, modo:'tray', _cvOverride:null };
  function _reconCanvas(){ return RECON._cvOverride || document.getElementById('bio-recon-canvas'); }
  // Render OFFSCREEN de un modo a un dataURL (para embeber en el PDF sin abrir el overlay).
  function _reconImg(paq, modo, w, h, frame){
    var cv=document.createElement('canvas'); cv.width=w; cv.height=h;
    var sv={p:RECON.paquete,m:RECON.modo,f:RECON.frame,b:RECON.box,c:RECON._cvOverride};
    RECON.paquete=paq; RECON.modo=modo; RECON.frame=frame||0; RECON._cvOverride=cv;
    RECON.box=(modo==='tray')?_reconCalcBox(paq,w,h):null;
    try{ _reconDibujar(); }catch(e){ console.warn('[BIO] recon img',e&&e.message); }
    var url=''; try{ url=cv.toDataURL('image/png'); }catch(e){}
    RECON.paquete=sv.p; RECON.modo=sv.m; RECON.frame=sv.f; RECON.box=sv.b; RECON._cvOverride=sv.c;
    return url;
  }

  // Proyección: normaliza a espacio cuadrado (x·aspect, y), ajusta el bounding box de TODOS los
  // puntos al canvas con margen, preservando proporciones reales.
  function _reconCalcBox(paq, W, H){
    var a=paq.aspect||0.5625, minX=1e9,maxX=-1e9,minY=1e9,maxY=-1e9, hay=false;
    for(var key in paq.puntos){ var arr=paq.puntos[key]; for(var k=0;k<arr.length;k++){ var pt=arr[k]; if(!pt) continue; hay=true;
      var X=(pt[0]/1000)*a, Y=pt[1]/1000; if(X<minX)minX=X; if(X>maxX)maxX=X; if(Y<minY)minY=Y; if(Y>maxY)maxY=Y; } }
    if(!hay) return null;
    var bw=Math.max(1e-3,maxX-minX), bh=Math.max(1e-3,maxY-minY), mg=0.12;
    var s=Math.min(W*(1-2*mg)/bw, H*(1-2*mg)/bh);
    return { a:a, s:s, ox:(W-s*bw)/2 - s*minX, oy:(H-s*bh)/2 - s*minY };
  }
  function _reconXY(pt, box){ if(!pt) return null; return { x:box.ox + box.s*(pt[0]/1000)*box.a, y:box.oy + box.s*(pt[1]/1000) }; }

  // Despachador de dibujo por modo: trayectorias (monito) | sacro (cm) | rodillas (cm).
  function _reconDibujar(){
    if(RECON.modo==='sacro') return _dibujarSacro();
    if(RECON.modo==='rodillas') return _dibujarRodillas();
    return _dibujarTray();
  }
  // Convierte una coord vertical ×1000 a cm (o % si no hay estatura) de descenso desde de pie.
  function _descV(y, esc){ if(esc.yBase==null||!esc.hEst) return null; var f=(y-esc.yBase)/esc.hEst; return esc.estaturaCm?f*esc.estaturaCm:f*100; }
  // Convierte una separación horizontal ×1000 (respecto al sacro) a cm (o %), usando el aspecto.
  function _sepH(dx, esc, aspect){ if(!esc.hEst) return null; var f=dx*aspect/esc.hEst; return esc.estaturaCm?f*esc.estaturaCm:f*100; }
  function _ejeChart(ctx,W,H,titulo,unidad){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#0f1a2e'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#9BA3B5'; ctx.font='bold '+Math.max(11,Math.round(W*0.03))+'px -apple-system,Arial'; ctx.textAlign='center'; ctx.textBaseline='top';
    ctx.fillText(titulo, W/2, 6);
    ctx.font=Math.max(9,Math.round(W*0.02))+'px -apple-system,Arial'; ctx.textAlign='left'; ctx.fillText(unidad, 8, 8);
  }
  // Gráfica del DESCENSO DEL SACRO en cm por el tiempo, con el fondo de cada rep marcado.
  function _dibujarSacro(){
    var paq=RECON.paquete, cv=_reconCanvas(); if(!paq||!cv) return;
    var ctx=cv.getContext('2d'), W=cv.width, H=cv.height, esc=paq.escala||{};
    var unidad=esc.estaturaCm?'cm':'%';
    _ejeChart(ctx,W,H,'Descenso del sacro ('+unidad+')',unidad);
    var sac=paq.puntos.sacro||[], serie=[];
    for(var k=0;k<sac.length;k++){ var v=sac[k]?_descV(sac[k][1],esc):null; serie.push(v); }
    var vals=serie.filter(function(x){return x!=null;}); if(!vals.length){ return; }
    var vmax=Math.max.apply(null,vals), top=40, bot=H-46, L=42, R=W-14;
    vmax=Math.max(vmax, esc.estaturaCm?20:10);
    function X(i){ return L+(R-L)*(paq.n>1?i/(paq.n-1):0); }
    function Y(v){ return top+(bot-top)*(v/vmax); }               // 0 arriba (de pie), max abajo (fondo)
    // rejilla + eje 0
    ctx.strokeStyle='rgba(255,255,255,.08)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(L,Y(0)); ctx.lineTo(R,Y(0)); ctx.stroke();
    ctx.fillStyle='#6E7891'; ctx.font=Math.max(8,Math.round(W*0.018))+'px Arial'; ctx.textAlign='right'; ctx.textBaseline='middle';
    ctx.fillText('0', L-4, Y(0)); ctx.fillText(Math.round(vmax)+unidad, L-4, Y(vmax));
    // curva
    ctx.strokeStyle='#4F9BFF'; ctx.lineWidth=Math.max(2,W*0.006); ctx.beginPath(); var st=false;
    for(var i=0;i<serie.length;i++){ if(serie[i]==null){ st=false; continue; } var x=X(i),y=Y(serie[i]); if(!st){ctx.moveTo(x,y);st=true;}else ctx.lineTo(x,y); }
    ctx.stroke();
    // fondos de cada rep (rojo) + etiqueta de profundidad
    ctx.textAlign='center'; ctx.textBaseline='top';
    (paq.porRep||[]).forEach(function(rp){
      var idx=null;
      if(paq.trayFrame && paq.trayFrame.length){
        for(var q=0;q<paq.trayFrame.length;q++){ if(paq.trayFrame[q]===rp.frameFondo){ idx=q; break; } }
        if(idx==null && rp.frameFondo!=null){ var _best=-1,_bd=Infinity; for(var q2=0;q2<paq.trayFrame.length;q2++){ var _dd=Math.abs(paq.trayFrame[q2]-rp.frameFondo); if(_dd<_bd){_bd=_dd;_best=q2;} } if(_best>=0) idx=_best; }   // P2-14: cuadro capturado MÁS CERCANO (no el nº de cuadro crudo como posición)
      } else if(rp.frameFondo!=null && rp.frameFondo<serie.length){ idx=rp.frameFondo; }   // compat: paquetes viejos sin trayFrame
      if(idx==null || serie[idx]==null) return;
      var x=X(idx), y=Y(serie[idx]);
      ctx.fillStyle='#E23B3B'; ctx.beginPath(); ctx.arc(x,y,Math.max(3,W*0.01),0,7); ctx.fill();
      var etq=esc.estaturaCm?(rp.descCm!=null?rp.descCm+' cm':''):(rp.descPct+'%');
      ctx.fillStyle='#E8A0A0'; ctx.font=Math.max(8,Math.round(W*0.02))+'px Arial'; ctx.fillText(etq, x, y+6);
    });
    // cursor del frame actual
    var cx=X(RECON.frame); ctx.strokeStyle='rgba(232,201,106,.8)'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(cx,top); ctx.lineTo(cx,bot); ctx.stroke();
    var et=document.getElementById('bio-recon-info'); if(et) et.textContent='Fondo de cada repetición marcado en rojo'+(esc.estaturaCm?' (cm reales, ±10%)':' (% de estatura)');
  }
  // Gráfica de SEPARACIÓN de rodillas de la línea media (cm): azul=derecha (+), rojo=izquierda (−).
  function _dibujarRodillas(){
    var paq=RECON.paquete, cv=_reconCanvas(); if(!paq||!cv) return;
    var ctx=cv.getContext('2d'), W=cv.width, H=cv.height, esc=paq.escala||{}, asp=paq.aspect||0.5625;
    var unidad=esc.estaturaCm?'cm':'%';
    _ejeChart(ctx,W,H,'Rodillas vs línea media ('+unidad+')',unidad);
    var sac=paq.puntos.sacro||[], ki=paq.puntos.rodillaIzq||[], kd=paq.puntos.rodillaDer||[];
    var der=[],izq=[],all=[];
    for(var k=0;k<paq.n;k++){
      var mid=sac[k]?sac[k][0]:null;
      var vd=(mid!=null&&kd[k])? Math.abs(_sepH(kd[k][0]-mid,esc,asp)) : null;   // derecha arriba (+)
      var vi=(mid!=null&&ki[k])? -Math.abs(_sepH(ki[k][0]-mid,esc,asp)) : null;  // izquierda abajo (−)
      der.push(vd); izq.push(vi); if(vd!=null)all.push(vd); if(vi!=null)all.push(vi);
    }
    if(!all.length){ return; }
    var amp=Math.max.apply(null, all.map(Math.abs)); amp=Math.max(amp, esc.estaturaCm?20:10);
    var top=40, bot=H-24, L=42, R=W-14, my=(top+bot)/2;
    function X(i){ return L+(R-L)*(paq.n>1?i/(paq.n-1):0); }
    function Y(v){ return my-(v/amp)*((bot-top)/2); }
    // línea media (negra=0) + etiquetas
    ctx.strokeStyle='#B9C2D6'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(L,my); ctx.lineTo(R,my); ctx.stroke();
    ctx.fillStyle='#6E7891'; ctx.font=Math.max(8,Math.round(W*0.018))+'px Arial'; ctx.textAlign='right'; ctx.textBaseline='middle';
    ctx.fillText('+'+Math.round(amp), L-4, Y(amp)); ctx.fillText('0', L-4, my); ctx.fillText('-'+Math.round(amp), L-4, Y(-amp));
    function linea(serie,color){ ctx.strokeStyle=color; ctx.lineWidth=Math.max(2,W*0.006); ctx.beginPath(); var st=false;
      for(var i=0;i<serie.length;i++){ if(serie[i]==null){st=false;continue;} var x=X(i),y=Y(serie[i]); if(!st){ctx.moveTo(x,y);st=true;}else ctx.lineTo(x,y);} ctx.stroke(); }
    linea(der,'#3B6BE0'); linea(izq,'#E23B3B');
    var cx=X(RECON.frame); ctx.strokeStyle='rgba(232,201,106,.8)'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(cx,top); ctx.lineTo(cx,bot); ctx.stroke();
    var et=document.getElementById('bio-recon-info'); if(et) et.textContent='🔵 rodilla derecha · 🔴 rodilla izquierda · línea = media. Más lejos de 0 = más abierta.';
  }
  function _dibujarTray(){
    var paq=RECON.paquete, cv=_reconCanvas(); if(!paq||!cv) return;
    var ctx=cv.getContext('2d'), W=cv.width, H=cv.height;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#0f1a2e'; ctx.fillRect(0,0,W,H);
    // cuadrícula ligera
    ctx.strokeStyle='rgba(255,255,255,.05)'; ctx.lineWidth=1;
    for(var gx=0; gx<=W; gx+=Math.round(W/8)){ ctx.beginPath(); ctx.moveTo(gx,0); ctx.lineTo(gx,H); ctx.stroke(); }
    for(var gy=0; gy<=H; gy+=Math.round(H/12)){ ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(W,gy); ctx.stroke(); }
    var box=RECON.box; if(!box) return;
    var fr=RECON.frame, N=paq.n, r=Math.max(1.4, W*0.0055);
    // título
    ctx.fillStyle='#9BA3B5'; ctx.font='bold '+Math.max(11,Math.round(W*0.03))+'px -apple-system,Arial'; ctx.textAlign='center'; ctx.textBaseline='top';
    ctx.fillText('Trayectorias', W/2, 6);
    // 1) TRAYECTORIAS como NUBE DE PUNTOS por articulación (imita Kinect)
    Object.keys(paq.puntos).forEach(function(key){
      var arr=paq.puntos[key], col=RECON_COLORES[key]||'#8891a6', esSacro=(key==='sacro');
      ctx.fillStyle=col; ctx.globalAlpha=esSacro?0.55:0.4;
      for(var k=0;k<arr.length;k++){ var q=_reconXY(arr[k],box); if(!q) continue;
        ctx.beginPath(); ctx.arc(q.x,q.y, esSacro?r*1.15:r, 0, 7); ctx.fill(); }
    });
    ctx.globalAlpha=1;
    // 2) FONDO marcado (sacro más bajo)
    if(paq.fondo!=null && paq.puntos.sacro){ var fq=_reconXY(paq.puntos.sacro[paq.fondo],box); if(fq){ ctx.strokeStyle='#E8C96A'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(fq.x,fq.y,10,0,7); ctx.stroke(); } }
    // 3) ESQUELETO (monito) en el frame actual, en azul como la referencia
    function P(key){ var a=paq.puntos[key]; return (a&&a[fr])?_reconXY(a[fr],box):null; }
    ctx.strokeStyle='#3B6BE0'; ctx.lineWidth=Math.max(2,Math.round(W*0.007)); ctx.lineCap='round';
    RECON_SEGS.forEach(function(seg){ var a=P(seg[0]), b=P(seg[1]); if(a&&b){ ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); } });
    // cabeza: hombros→nariz + círculo
    var hi=P('hombroIzq'), hd=P('hombroDer'), nz=P('nariz');
    if(hi&&hd&&nz){ var mc={x:(hi.x+hd.x)/2,y:(hi.y+hd.y)/2}; ctx.beginPath(); ctx.moveTo(mc.x,mc.y); ctx.lineTo(nz.x,nz.y); ctx.stroke();
      ctx.beginPath(); ctx.arc(nz.x,nz.y-r*1.5, Math.max(4,W*0.016),0,7); ctx.stroke(); }
    // articulaciones (nodos azules) del frame actual
    RECON_SEGS.forEach(function(seg){ seg.forEach(function(key){ var q=P(key); if(!q) return; ctx.fillStyle='#3B6BE0'; ctx.beginPath(); ctx.arc(q.x,q.y, Math.max(2.5,W*0.008),0,7); ctx.fill(); }); });
    var sq=P('sacro'); if(sq){ ctx.fillStyle='#8B2E2E'; ctx.beginPath(); ctx.arc(sq.x,sq.y,Math.max(3,W*0.011),0,7); ctx.fill(); }
    var et=document.getElementById('bio-recon-info');
    if(et){ var pct=N?Math.round(fr/(N-1)*100):0; et.textContent='Frame '+(fr+1)+'/'+N+' · '+pct+'%'+(paq.nReps?(' · '+paq.nReps+' rep'+(paq.nReps===1?'':'s')):''); }
  }
  function _reconStop(){ if(RECON.raf){ cancelAnimationFrame(RECON.raf); RECON.raf=null; } RECON.playing=false;
    var b=document.getElementById('bio-recon-play'); if(b) b.textContent='▶︎ Reproducir'; }
  function _reconLoop(ts){
    if(!RECON.playing){ return; }
    RECON.raf=requestAnimationFrame(_reconLoop);
    var fps=(RECON.paquete.fps||12)*RECON.speed, gap=1000/fps;
    if(ts-RECON.last<gap) return; RECON.last=ts;
    RECON.frame++; if(RECON.frame>=RECON.paquete.n){ RECON.frame=0; }
    var sl=document.getElementById('bio-recon-slider'); if(sl) sl.value=RECON.frame;
    _reconDibujar();
  }
  function _reconPlay(){ if(RECON.playing){ _reconStop(); return; }
    if(RECON.frame>=RECON.paquete.n-1) RECON.frame=0;
    RECON.playing=true; RECON.last=0; var b=document.getElementById('bio-recon-play'); if(b) b.textContent='⏸ Pausa';
    RECON.raf=requestAnimationFrame(_reconLoop);
  }
  function _reconModo(m){
    RECON.modo=m; _reconStop();
    [['tray','tray'],['sacro','sacro'],['rod','rodillas']].forEach(function(par){
      var b=document.getElementById('bio-recon-m-'+par[0]); if(b) b.classList.toggle('on', par[1]===m);
    });
    _reconSetCanvas();
  }
  function _reconSetCanvas(){
    var wrap=document.getElementById('bio-recon-wrap'), cv=_reconCanvas(); if(!wrap||!cv) return;
    var paq=RECON.paquete, W, H, maxH=(wrap.clientHeight||640);
    if(RECON.modo==='tray'){                                   // monito: vertical según aspecto del video
      var a=(paq&&paq.aspect)||0.5625;
      W=Math.max(240, Math.min(wrap.clientWidth||360, 520));
      H=Math.round(W/a); if(H>maxH){ H=maxH; W=Math.round(H*a); }
    } else {                                                    // gráficas: apaisado
      W=Math.max(240, Math.min(wrap.clientWidth||360, 560));
      H=Math.min(maxH, Math.round(W*0.72));
    }
    cv.width=W; cv.height=H;
    RECON.box=_reconCalcBox(paq, W, H);
    var sl=document.getElementById('bio-recon-slider'); if(sl){ sl.max=Math.max(0,paq.n-1); sl.value=RECON.frame; }
    _reconDibujar();
  }
  async function BIO_reconstruccion(sid){
    var p=(typeof currentPatient!=='undefined')?currentPatient:null; if(!p) return;
    var s=(p.biomecanica||[]).find(function(x){return x.id===sid;}); if(!s) return;
    construirOverlay();
    var ov=document.getElementById('bio-overlay'); ov.style.display='flex';
    BIO.tipoMedicion='sent';
    mostrarVista('bio-vista-recon');
    var info=document.getElementById('bio-recon-info'); if(info) info.textContent='Cargando trayectorias…';
    var paq=await _cargarTray(sid, s);
    if(!paq || !paq.puntos || !paq.n){ if(info) info.textContent='⚠️ No hay trayectorias guardadas para esta toma (se grabó antes de esta versión, o no se pudieron recuperar).'; return; }
    RECON.paquete=paq; RECON.frame=0; RECON.speed=1; _reconStop();
    _reconModo('tray');                                        // arranca en Trayectorias (resetea botones)
    _reconPlay();
  }

  // ── Render de la pestaña "Biomecánica" (devuelve HTML string) ──────────────
  function fmtRangoTxt(a){ return _fmtMedida(a, 'var(--green)', 'var(--gray-400)'); }
  // Filas de una sesión guardada: desde s.medidas (nuevo) o s.articulaciones (sesiones viejas).
  function filasSesionHTML(s){
    var fila=function(etq,izq,der){
      return '<div class="field-row"><div class="field-label">'+etq+'</div><div class="field-value" style="display:flex;gap:14px;flex-wrap:wrap">'
        + '<span><b style="color:var(--gray-400);font-weight:600">Izq</b> '+fmtRangoTxt(izq)+'</span>'
        + '<span><b style="color:var(--gray-400);font-weight:600">Der</b> '+fmtRangoTxt(der)+'</span></div></div>';
    };
    if(Array.isArray(s.medidas)){
      var by=medidasPorKey(s.medidas);
      return FILAS.map(function(f){ return fila(f.etq, by[f.izq], by[f.der]); }).join('');
    }
    var a=s.articulaciones||{}; // compatibilidad con sesiones anteriores
    return [['Codo','codoIzq','codoDer'],['Hombro','hombroIzq','hombroDer'],['Cadera','caderaIzq','caderaDer'],['Rodilla','rodillaIzq','rodillaDer']]
      .map(function(g){ return fila(g[0], a[g[1]], a[g[2]]); }).join('');
  }
  // Tarjeta de una sesión de SENTADILLA en la pestaña (misma familia visual que las de ROM).
  // Badge de estado de sincronización (P1-10): ☁️ en la nube / 📱 solo en este equipo. Sesiones viejas
  // (sin el campo _estadoSync) NO muestran badge, para no afirmar un estado que no se registró.
  // Multi-equipo (N2): una sesión traída de la nube puede verse 📱 un instante en el equipo B hasta que su propio
  // catch-up (renderPestana dispara _syncBiomecanicaFS al abrir la pestaña) la marque 'sincronizada' → converge solo.
  function _syncBadge(s){
    if(!s || s._estadoSync==null) return '';
    return (s._estadoSync==='sincronizada')
      ? ' · <span title="Sincronizada a la nube'+(s._estadoSyncFecha?(' ('+String(s._estadoSyncFecha).slice(0,10)+')'):'')+'" style="color:var(--green)">☁️</span>'
      : ' · <span title="Solo en este equipo (aún sin confirmar en la nube)" style="color:#B45309">📱</span>';
  }
  function tarjetaSentHTML(s){
    var by={}; (s.medidas||[]).forEach(function(m){ by[m.key]=m; });
    function fmtS(m, etqExt){
      if(!m || m.media==null) return '<span style="color:var(--gray-400)">—</span>';
      var esRatio=(m.unidad==='ratio'), suf=esRatio?'':(m.unidad==='%'?'%':'°');
      var val=esRatio?m.media.toFixed(2):(_r1(m.media)+suf);
      var ext=(m.extremo!=null)?(' <span style="color:var(--gray-400);font-size:11px">'+etqExt+' '+(esRatio?m.extremo.toFixed(2):(_r1(m.extremo)+suf))+'</span>'):'';
      var conf=m.confiable?'':' <span style="color:#B45309;font-size:11px">⚠️</span>';
      return '<b style="color:var(--green)">'+val+'</b>'+ext+conf;
    }
    function fila(etq, izq, der){
      return '<div class="field-row"><div class="field-label">'+etq+'</div><div class="field-value" style="display:flex;gap:14px;flex-wrap:wrap">'
        + (der!==undefined
            ? '<span><b style="color:var(--gray-400);font-weight:600">Izq</b> '+izq+'</span><span><b style="color:var(--gray-400);font-weight:600">Der</b> '+der+'</span>'
            : '<span>'+izq+'</span>')
        + '</div></div>';
    }
    var fuente = s.fuente==='video' ? '📁 Video' : '📷 Cámara';
    var vf=(s.vistas&&s.vistas.frontal)||{}, nReps=vf.nReps||0;
    var desc=by['sacro_descenso'], descTxt=fmtS(desc,'máx');
    if(desc && desc.media!=null && s.calibracion && s.calibracion.estaturaCm){
      descTxt += ' <span style="color:var(--gray-400);font-size:11px">≈ '+_r1(desc.media*s.calibracion.estaturaCm/100)+' cm</span>';
    }
    var q=vf.calidad||{}, avisos=[];
    if(q.orientacionOK===false) avisos.push('toma no frontal');
    if(q.camaraMovida) avisos.push('cámara/paciente se movió');
    var videoBtn = (s.video && s.video.url)
      ? '<button data-url="'+esc(s.video.url)+'" onclick="window.open(this.dataset.url,\'_blank\')" style="background:var(--green);color:#fff;border:none;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer">▶️ Ver video</button>'
      : '';
    return '<div class="section-card" style="margin-bottom:10px">'
      + '<div class="section-title" style="display:flex;align-items:center;justify-content:space-between">'
      +   '<span>🏋️ Sentadilla · '+esc(s.fecha)+' '+esc(s.horaCreacion||'')+'</span>'
      +   '<span style="font-weight:600;text-transform:none;letter-spacing:0;color:var(--gray-400)">'+fuente+_syncBadge(s)+'</span>'
      + '</div>'
      + '<div class="field-row"><div class="field-label">Terapeuta</div><div class="field-value">'+esc(s.terapeuta||'—')+' · '+(s.duracionSeg||0)+' s · '+nReps+' rep'+(nReps===1?'':'s')+' (vista frontal)'+(avisos.length?(' · <span style="color:#B45309">⚠️ '+esc(avisos.join(', '))+'</span>'):'')+'</div></div>'
      + fila('Valgo FPPA (media bajada)', fmtS(by['fppa_izq'],'peor'), fmtS(by['fppa_der'],'peor'))
      + fila('Desplaz. medial MKD (fondo)', fmtS(by['mkd_izq'],'peor'), fmtS(by['mkd_der'],'peor'))
      + fila('Separación rodillas/tobillos', fmtS(by['sep_rodillas'],'mín'))
      + fila('Tronco lateral', fmtS(by['tronco_lateral'],'máx'))
      + fila('Descenso del sacro', descTxt)
      + '<div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;padding:10px 14px;align-items:center">'
      +   ((s.trayectorias && s.trayectorias.estado && s.trayectorias.estado!=='nada')
          ? '<button data-sid="'+esc(s.id)+'" onclick="BIO_reconstruccion(this.dataset.sid)" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer">🎬 Reconstrucción</button>'
          : '<span style="color:var(--gray-400);font-size:11px">sin trayectorias</span>')
      +   ((s.reportePdf && s.reportePdf.url)
          ? '<button data-url="'+esc(s.reportePdf.url)+'" onclick="window.open(this.dataset.url,\'_blank\')" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer">📄 Ver PDF</button>'
          : '<button data-sid="'+esc(s.id)+'" onclick="BIO_pdf(this.dataset.sid)" style="background:var(--white);color:var(--navy);border:1.5px solid var(--gray-200);border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer">📄 Generar PDF</button>')
      +   videoBtn
      +   '<button data-sid="'+esc(s.id)+'" onclick="BIO_eliminar(this.dataset.sid)" style="background:var(--red-light);color:var(--red);border:1.5px solid #FCA5A5;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer">🗑️ Eliminar</button>'
      + '</div>'
      + '</div>';
  }
  function tarjetaMarchaHTML(s){
    var by={}; (s.medidas||[]).forEach(function(m){ by[m.key]=m; });
    function fmtM(m){ if(!m||m.valor==null) return '<span style="color:var(--gray-400)">—</span>';
      var u=(m.unidad==='m')?' m':(m.unidad==='%'?'%':(m.unidad==='pasos/min'?'':'°'));
      var conf=m.confiable?'':' <span style="color:#B45309;font-size:11px">⚠️</span>';
      return '<b style="color:var(--green)">'+m.valor+u+'</b>'+conf; }
    function fila(etq, izq, der){
      return '<div class="field-row"><div class="field-label">'+etq+'</div><div class="field-value" style="display:flex;gap:14px;flex-wrap:wrap">'
        + (der!==undefined
            ? '<span><b style="color:var(--gray-400);font-weight:600">Izq</b> '+izq+'</span><span><b style="color:var(--gray-400);font-weight:600">Der</b> '+der+'</span>'
            : '<span>'+izq+'</span>')
        + '</div></div>'; }
    function simTxt(v){ if(v==null) return '—'; var c=(v>=90)?'var(--green)':(v>=80?'#B45309':'var(--red)'); return '<b style="color:'+c+'">'+v+'%</b>'; }
    var fuente=s.fuente==='video'?'📁 Video':'📷 Cámara', sm=s.simetria||{}, q=s.calidad||{}, avisos=[];
    if(q.orientPerfilOK===false) avisos.push('toma no de perfil');
    if(q.fuenteTiempo==='video-sin-confirmar') avisos.push('tiempos sin confirmar (video subido)');   // Hallazgo D
    var velTxt=(s.velocidad!=null)?(s.velocidad+' m/s'):'—', cadTxt=(s.cadencia!=null)?(s.cadencia+' pasos/min'):'—';
    var videoBtn = (s.video && s.video.url)
      ? '<button data-url="'+esc(s.video.url)+'" onclick="window.open(this.dataset.url,\'_blank\')" style="background:var(--green);color:#fff;border:none;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer">▶️ Ver video</button>'
      : '';
    return '<div class="section-card" style="margin-bottom:10px">'
      + '<div class="section-title" style="display:flex;align-items:center;justify-content:space-between">'
      +   '<span>🚶 Marcha · '+esc(s.fecha)+' '+esc(s.horaCreacion||'')+'</span>'
      +   '<span style="font-weight:600;text-transform:none;letter-spacing:0;color:var(--gray-400)">'+fuente+_syncBadge(s)+'</span>'
      + '</div>'
      + '<div class="field-row"><div class="field-label">Terapeuta</div><div class="field-value">'+esc(s.terapeuta||'—')+' · '+(s.duracionSeg||0)+' s · '+(s.nCiclos||0)+' ciclo'+((s.nCiclos===1)?'':'s')+' (vista sagital)'+(avisos.length?(' · <span style="color:#B45309">⚠️ '+esc(avisos.join(', '))+'</span>'):'')+'</div></div>'
      + ((q.fuenteTiempo==='video-confirmado')?'<div class="field-row"><div class="field-label">Tiempos</div><div class="field-value" style="color:var(--gray-400);font-size:12px">⏱️ confirmados por el terapeuta (velocidad normal) — no es verificación instrumental</div></div>':'')
      + fila('Cadencia · velocidad', cadTxt+' · '+velTxt)
      + fila('Fase de apoyo', fmtM(by['stance_izq']), fmtM(by['stance_der']))
      + fila('Rodilla · flexión pico', fmtM(by['rod_pico_izq']), fmtM(by['rod_pico_der']))
      + fila('Cadera · ROM', fmtM(by['cadera_rom_izq']), fmtM(by['cadera_rom_der']))
      + fila('Tobillo · ROM', fmtM(by['tobillo_rom_izq']), fmtM(by['tobillo_rom_der']))
      + fila('Simetría rod/cadera/apoyo', simTxt(sm.rodPeak)+' / '+simTxt(sm.hipROM)+' / '+simTxt(sm.stancePct))
      + '<div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;padding:10px 14px;align-items:center">'
      +   videoBtn
      +   '<button data-sid="'+esc(s.id)+'" onclick="BIO_eliminar(this.dataset.sid)" style="background:var(--red-light);color:var(--red);border:1.5px solid #FCA5A5;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer">🗑️ Eliminar</button>'
      + '</div>'
      + '</div>';
  }
  // ═════════════ FASE A — GONIÓMETRO DE MIEMBRO INFERIOR (plano SAGITAL) ═════════════
  // Goniómetro de cámara: el terapeuta elige articulación + movimiento + lado; la app mide el ángulo
  // EN VIVO (plano de la cámara, ángulo interior 2D — misma matemática validada del ROM), marca el
  // máximo con histéresis de oclusión y, al tocar "Capturar", guarda ese grado. Todo en el plano
  // SAGITAL (cámara al costado). Neutro clínico = 0°. Fuente de rangos: AAOS; Norkin & White.
  var GONIO_CAT = [
    { key:'cad_flex', grupo:'Cadera',  mov:'Flexión',       pos:'Supino',        agg:'max', ref:120, lim:105, normTxt:'0–120°',
      guia:'Boca ARRIBA. Cámara al COSTADO, a la altura de la cadera. Lleva la rodilla hacia el pecho.' },
    { key:'cad_ext',  grupo:'Cadera',  mov:'Extensión',     pos:'Prono',         agg:'max', ref:30,  lim:15,  normTxt:'0–30°',
      guia:'Boca ABAJO. Cámara al COSTADO. Levanta el muslo separándolo de la camilla.' },
    { key:'rod_flex', grupo:'Rodilla', mov:'Flexión',       pos:'Supino/Prono',  agg:'max', ref:135, lim:120, normTxt:'0–135°',
      guia:'Cámara al COSTADO. Lleva el talón hacia el glúteo.' },
    { key:'rod_ext',  grupo:'Rodilla', mov:'Extensión',     pos:'Supino',        agg:'min', ref:0,   lim:5, defic:true, normTxt:'0° (déficit ≤5°)',
      guia:'Cámara al COSTADO. Estira la rodilla al máximo (mide el déficit de extensión).' },
    { key:'rod_hext', grupo:'Rodilla', mov:'Hiperextensión', pos:'Supino',       agg:'max', ref:5,   lim:10, hiperext:true, normTxt:'≤5–10° (genu recurvatum si más)',
      guia:'Cámara al COSTADO. Rodilla en su máxima extensión; si la articulación rebasa la línea recta hacia atrás es hiperextensión. La app mide los GRADOS de desviación respecto a la recta; tú confirmas visualmente que es hacia atrás.' },
    { key:'tob_df',   grupo:'Tobillo', mov:'Dorsiflexión',  pos:'Supino',        agg:'max', ref:20,  lim:10,  normTxt:'0–20°',
      guia:'Cámara al COSTADO del pie. Lleva la punta hacia la espinilla.' },
    { key:'tob_pf',   grupo:'Tobillo', mov:'Plantiflexión', pos:'Supino',        agg:'max', ref:50,  lim:40,  normTxt:'0–50°',
      guia:'Cámara al COSTADO del pie. Apunta la punta del pie hacia abajo.' },
    // ── Miembro superior (plano sagital, cámara al COSTADO del brazo) ──
    // Codo es fiable en 2D (hombro-codo-muñeca, todos landmarks sólidos). MUÑECA se mide contra el eje del
    // 3.er METACARPIANO (muñeca→nudillo medio, detector de MANO bajo demanda — auditoría 2026-11-20); sin ese
    // detector cae al índice de Pose SOLO con la mano abierta; con puño/mano tapada → "no medible" honesto.
    { key:'cod_flex', grupo:'Codo',    mov:'Flexión',       pos:'Sentado/De pie', agg:'max', ref:145, lim:130, normTxt:'0–145°',
      guia:'Cámara al COSTADO del brazo. Brazo pegado al cuerpo; dobla el codo llevando la mano al hombro.' },
    { key:'cod_ext',  grupo:'Codo',    mov:'Extensión',     pos:'Sentado/De pie', agg:'min', ref:0,   lim:5, defic:true, normTxt:'0° (déficit ≤5°)',
      guia:'Cámara al COSTADO del brazo. Estira el codo al máximo (mide el déficit de extensión).' },
    { key:'cod_hext', grupo:'Codo',    mov:'Hiperextensión', pos:'Sentado/De pie', agg:'max', ref:5,  lim:10, hiperext:true, normTxt:'≤5–10° (laxitud si más)',
      guia:'Cámara al COSTADO del brazo. Codo en su máxima extensión; si rebasa la línea recta es hiperextensión. La app mide la MAGNITUD respecto a la recta; tú confirmas la dirección.' },
    { key:'mun_flex', grupo:'Muñeca',  mov:'Flexión',       pos:'Sentado',        agg:'max', ref:80,  lim:60,  normTxt:'0–80°',
      guia:'Antebrazo apoyado, MANO LIBRE y VISIBLE a la cámara, cámara al COSTADO. Dobla la muñeca llevando la palma hacia el antebrazo (la app mide al NUDILLO medio, no a los dedos).' },
    { key:'mun_ext',  grupo:'Muñeca',  mov:'Extensión',     pos:'Sentado',        agg:'max', ref:70,  lim:50,  normTxt:'0–70°',
      guia:'Antebrazo apoyado, MANO LIBRE y VISIBLE a la cámara, cámara al COSTADO. Lleva el dorso de la mano hacia arriba/atrás (se mide al NUDILLO medio).' }
  ];
  var GONIO_CITA = 'AAOS; Norkin & White, Measurement of Joint Motion.';
  var GONIO_JOINTS = ['Cadera','Rodilla','Tobillo','Codo','Muñeca'];
  // (CANDADO 2026-11-17) Techo FISIOLÓGICO por movimiento. Por encima de esto el grado 2D es casi seguro un
  // ARTEFACTO (escorzo / landmark equivocado / lado reflejo), NO una medición real → se trata como "no medible"
  // y NO se guarda (ni a la sesión ni al ROM del expediente). Es un escalón MÁS DURO que (h) "(revisar)", que
  // solo señala lo ligeramente alto. Hallazgo real: un "Cadera ext 160°" (máx ~30°) llegó limpio al ROM. Los
  // topes son holgados (dejan pasar hipermovilidad real; solo frenan lo anatómicamente imposible).
  var GONIO_TECHO = {
    cad_flex:150, cad_ext:50, rod_flex:160, rod_ext:30, rod_hext:40,
    tob_df:45, tob_pf:80, cod_flex:160, cod_ext:30, cod_hext:40, mun_flex:100, mun_ext:95
  };
  // ═══ GATES DE VALIDEZ ANATÓMICA (P0 corrección anatómica, 2026-11-22) ═══════════════════════════
  // Un punto DETECTADO no es un landmark anatómico CONFIRMADO. Estos gates no "arreglan" el número:
  // cuando la evidencia no alcanza, el resultado es NO MEDIBLE / requiere revisión manual del fisio.
  // Umbrales PROVISIONALES sujetos a calibración clínica (medidos sobre las 6 fotos reales del caso
  // auditado: correspondencias buenas ~0.05 del antebrazo, malas 0.13–0.20; el 0.45 viejo queda SOLO
  // como radio de ASOCIACIÓN "qué mano pertenece a este brazo", nunca como validez anatómica).
  var GONIO_MATCH_MAX = 0.12;      // > esto → la muñeca de Hands NO corresponde a la de Pose → sin número
  var GONIO_MATCH_WARN = 0.10;     // alarma de revisión a partir de aquí (parámetro conservador de la orden)
  var GONIO_FOREARM_MIN_PX = 20;   // antebrazo proyectado más corto que esto (px) → eje no evaluable
  // Gate de correspondencia muñeca Pose↔Hands. `fore`/`mismatch` en CUALQUIER unidad consistente (la
  // razón es adimensional); `forePx` opcional = antebrazo en píxeles del cuadro (si se conoce).
  function _gateMunecaMatch(fore, mismatch, forePx){
    if(!(fore>0) || !isFinite(fore) || mismatch==null || !isFinite(mismatch)) return { valid:false, reason:'AXIS_NOT_TESTABLE', ratio:null };
    if(forePx!=null && forePx < GONIO_FOREARM_MIN_PX) return { valid:false, reason:'FOREARM_TOO_SHORT', ratio:null };
    var ratio=mismatch/fore;
    if(ratio <= GONIO_MATCH_MAX) return { valid:true, ratio:Math.round(ratio*1e4)/1e4, warn:(ratio >= GONIO_MATCH_WARN) };
    return { valid:false, reason:'WRIST_MISMATCH', ratio:Math.round(ratio*1e4)/1e4 };
  }
  // Calidad del EJE del segmento fijo (semántica de la auditoría): error perpendicular de cada muestra
  // de línea media respecto a la recta shaftA→shaftB, normalizado por el semiancho local del miembro;
  // válido solo si TODAS las muestras quedan a ≤0.3 semianchos. Requiere silueta/segmentación para
  // obtener muestras reales → hoy se usa en pruebas y en auditoría offline (en vivo: NOT RUN, el panel
  // de anatomía da el recorte al 100% para el chequeo visual del fisio).
  function _axisQuality(shaftA, shaftB, midlineSamples, halfWidths){
    if(!shaftA || !shaftB || !midlineSamples || !halfWidths) return { valid:false, reason:'AXIS_NOT_TESTABLE' };
    var vx=shaftB.x-shaftA.x, vy=shaftB.y-shaftA.y;
    var denom=Math.hypot(vx,vy);
    if(denom<20 || midlineSamples.length!==halfWidths.length || !midlineSamples.length) return { valid:false, reason:'AXIS_NOT_TESTABLE' };
    var errors=midlineSamples.map(function(p,i){ return Math.abs((p.x-shaftA.x)*vy-(p.y-shaftA.y)*vx)/denom/halfWidths[i]; });
    return { valid:errors.every(function(e){ return e<=0.3; }), errors:errors };
  }
  // Alto en píxeles del cuadro que se está midiendo (en el espacio norm-con-aspecto, distancia × alto = px).
  function _frameHGonio(){
    try{
      if(BIO._frameHTest!=null) return BIO._frameHTest;
      if(BIO.modo==='estatico' && BIO._estaticoBase && BIO._estaticoBase.height) return BIO._estaticoBase.height;
      if(BIO.srcEl && BIO.srcEl.videoHeight) return BIO.srcEl.videoHeight;
    }catch(_e){}
    return null;
  }
  // (V3 P0-4, 2ª revisión) El techo ya NO descarta el valor como "no medible": un techo duro perdía
  // PATOLOGÍA REAL (una contractura severa de codo con déficit ~90° > techo 30° se volvía inmedible).
  // Ahora el valor SE CONSERVA con bandera `fueraTecho` → el pico automático EN VIVO lo sigue ignorando
  // (el candado anti-artefactos de -18a queda intacto: un escorzo de 160° no se vuelve el pico), pero en
  // foto/cuadro-pico/actual el fisio lo VE y puede capturarlo CONFIRMANDO manualmente que es real.
  // Nunca se guarda solo: la captura de un fueraTecho exige confirmación explícita (revision 'confirmada').
  function _gonioTecho(grupo, mov, val){
    if(val==null || !isFinite(val)) return { ok:false, val:null };
    var e=_gonioEntry(grupo, mov); var techo = e && GONIO_TECHO[e.key];
    if(techo!=null && val > techo) return { ok:true, val:val, fueraTecho:true, techo:techo };   // posible artefacto O patología severa → confirmar, no borrar
    return { ok:true, val: val };
  }
  // Techo del movimiento de una medida ya guardada (para rotularla retroactivamente).
  function _gonioTechoDe(m){ var e=m&&_gonioEntry(m.grupo,m.mov); return e?GONIO_TECHO[e.key]:null; }
  function _gonioMovs(grupo){ return GONIO_CAT.filter(function(m){ return m.grupo===grupo; }); }
  function _gonioEntry(grupo, mov){ for(var i=0;i<GONIO_CAT.length;i++){ if(GONIO_CAT[i].grupo===grupo && GONIO_CAT[i].mov===mov) return GONIO_CAT[i]; } return null; }
  function _gonioPts(lado){
    return (lado==='izq')
      ? { S:11, H:23, K:25, A:27, F:31, E:13, W:15, Ix:19 }
      : { S:12, H:24, K:26, A:28, F:32, E:14, W:16, Ix:20 };
  }
  // ── Eje de la MANO para medir MUÑECA (auditoría 2026-11-20) ───────────────────────────────
  // Clínicamente la muñeca se mide antebrazo vs 3.er METACARPIANO (muñeca→nudillo del dedo medio),
  // NO vs la punta del índice: la punta se mueve con cada postura del dedo y con el puño cerrado cae
  // junto a la palma → el vector casi desaparece y el ángulo sale inventado.
  //  1º Hands lm0→lm9 (estable con puño cerrado). Se elige la mano cuya muñeca (lm0) quede pegada a la
  //     muñeca de Pose del lado medido — ≤ max(0.05, 45% del antebrazo) en espacio con aspecto — para no
  //     agarrar la mano contraria ni una detección suelta.
  //  2º Fallback SIN Hands (offline / no cargó): índice de Pose SOLO con la mano ABIERTA — segmento
  //     muñeca→índice ≥ max(0.045, 30% del antebrazo) y visible. Si no se cumple → null y el llamador
  //     devuelve {ok:false, motivo:'mano'} ("abre la mano"), NUNCA un número falso.
  function _munecaEje(lm, P, hs){
    var W=lm[P.W], E=lm[P.E];
    if(!_finP(W) || !_finP(E)) return null;
    var fore=_seg2D(E, W);
    var proto = (BIO._munProto==='5mcp') ? '5mcp' : '3mcp';   // (A) lateral clásico 5.º MCP | (B) proxy 3.er MCP
    var di = (proto==='5mcp') ? 17 : 9;                        // landmark distal de Hands según protocolo
    var gateFallo=null;
    if(hs && hs.length){
      var best=null, bd=Infinity, bi=-1;
      for(var i=0;i<hs.length;i++){
        var h=hs[i]; if(!h || !_finP(h[0]) || !_finP(h[di])) continue;
        var d=_seg2D(h[0], W);
        if(d<bd){ bd=d; best=h; bi=i; }
      }
      if(best && bd <= Math.max(0.05, fore*0.45)){            // ASOCIACIÓN: esta mano pertenece a este brazo…
        // …pero asociación ≠ anatomía: GATE de correspondencia (P0 2026-11-22). La muñeca de Hands debe
        // COINCIDIR con la de Pose (≤12% del antebrazo); si no, alguno de los dos modelos está mal ubicado
        // → sin número automático (revisión manual con ✋), nunca un grado de landmarks no verificados.
        var fH=_frameHGonio();
        var gate=_gateMunecaMatch(fore, bd, (fH!=null)? fore*fH : null);
        if(gate.valid){
          // EJE-CONTRA-EJE (criterio de la auditoría): brazo FIJO = eje longitudinal del antebrazo
          // (codo→muñeca de Pose, un solo modelo), VÉRTICE = muñeca de Pose (centro articular del
          // detector) y brazo móvil = DIRECCIÓN del metacarpiano de Hands (lm0→lmDistal) TRASLADADA al
          // vértice. Ya no se usa la POSICIÓN de lm0 de Hands como vértice (quedaba sobre el carpo,
          // desplazada del centro articular, mezclando posiciones de dos modelos en el vértice).
          var C2={ x: W.x + (best[di].x - best[0].x), y: W.y + (best[di].y - best[0].y) };
          return { eje:(proto==='5mcp'?'metacarpiano5-hands':'metacarpiano-hands'), B:W, C:C2,
                   manoCruda:{ H0:{x:best[0].x,y:best[0].y}, H9:(_finP(best[9])?{x:best[9].x,y:best[9].y}:null),
                               H17:(_finP(best[17])?{x:best[17].x,y:best[17].y}:null) },
                   manoIdx:bi, gate:gate,
                   dPoseHands:Math.round(bd*1e4)/1e4, antebrazoLen:Math.round(fore*1e4)/1e4 };
        }
        gateFallo={ rechazo:gate.reason, ratio:gate.ratio,
                    dPoseHands:Math.round(bd*1e4)/1e4, antebrazoLen:Math.round(fore*1e4)/1e4 };
      } else if(best===null && proto==='5mcp'){
        gateFallo={ rechazo:'MCP5_NO_VISIBLE', ratio:null };   // hay manos pero sin lm17 confiable
      }
    }
    // Protocolo A (5.º MCP, lateral clásico): NO degrada al índice (sería una TERCERA convención en
    // silencio). Sin mano válida → se reporta el fallo y el fisio revisa/ajusta.
    // V4 P0: un rechazo de Hands es TERMINAL. Nunca cambiar el eje al índice de Pose.
    if(gateFallo) return gateFallo;
    // Si hay un detector Hands activo pero NINGUNA mano compatible, tampoco se permite degradar
    // silenciosamente al índice; se requiere corrección humana o nueva fotografía.
    if(hs && hs.length) return { rechazo:'HAND_NOT_ASSOCIATED', ratio:null };
    if(proto==='5mcp') return { rechazo:'MCP5_NO_DISPONIBLE', ratio:null };
    // V4: sin Hands, no existe eje metacarpiano certificado; correccion manual obligatoria.
    return { rechazo:'HANDS_NOT_AVAILABLE', ratio:null };
  }
  // Mensaje honesto por RAZÓN del rechazo de correspondencia (V4: el rechazo es terminal; el texto
  // debe distinguir "sin detector de mano" de "la mano detectada no corresponde a esta muñeca").
  function _gonioMsgCorrespondencia(r, estatico){
    var razon = r && r.gate && r.gate.reason;
    var fin = estatico ? ' → sin número automático. Revisa en el panel Anatomía y ajusta con ✋ Ajustar puntos, o sube otra toma.'
                       : ': revisa con ✋ Ajustar puntos o sube otra toma';
    if(razon==='HANDS_NOT_AVAILABLE') return '⚠️ Sin detector de MANO: la muñeca no se mide automáticamente (el índice de Pose ya no sustituye al metacarpiano)'+fin;
    if(razon==='HAND_NOT_ASSOCIATED') return '⚠️ Ninguna mano detectada corresponde a esa muñeca (mano contraria o detección suelta)'+(estatico?fin:': acomoda la mano a cuadro o revisa con ✋ Ajustar puntos');
    if(razon==='MCP5_NO_DISPONIBLE'||razon==='MCP5_NO_VISIBLE') return '⚠️ El 5.º metacarpiano no está disponible en la mano detectada (protocolo lateral)'+fin;
    if(razon==='FOREARM_TOO_SHORT') return '⚠️ El antebrazo queda demasiado corto en imagen para validar la correspondencia'+fin;
    return '⚠️ La mano detectada no corresponde a esa muñeca'+(r&&r.gate&&r.gate.ratio!=null?' (separación '+Math.round(r.gate.ratio*100)+'% del antebrazo, límite 12%)':'')+fin;
  }
  // Ángulo del movimiento seleccionado, en convención clínica (0° neutro), desde landmarks 2D de imagen.
  function calcularGonio(lm, grupo, mov, lado){
    if(!lm) return { ok:false, val:null };
    var P=_gonioPts(lado);
    function v(i){ return _vis(lm,i); }
    // Guarda de geometría degenerada: si dos puntos quedan casi encimados (tracking fallido, articulación
    // fuera de cuadro o doblada sobre sí misma) el ángulo es basura → "no medible" en vez de un número falso.
    function deg(i,j,k){ return !_medible3(lm[i],lm[j],lm[k]); }   // degenerado O no-finito (NaN/Infinity) → no medible
    if(grupo==='Cadera'){
      if(!(v(P.S)&&v(P.H)&&v(P.K))) return { ok:false, val:null };
      if(deg(P.S,P.H,P.K)) return { ok:false, val:null };
      return _gonioTecho(grupo, mov, 180 - _ang2D(lm[P.S], lm[P.H], lm[P.K]));   // flex/ext desde tronco alineado (+ techo fisiológico)
    }
    if(grupo==='Rodilla'){                                                 // flexión, déficit de extensión E hiperextensión (misma geometría; el fisio elige el mov)
      if(!(v(P.H)&&v(P.K)&&v(P.A))) return { ok:false, val:null };
      if(deg(P.H,P.K,P.A)) return { ok:false, val:null };
      return _gonioTecho(grupo, mov, 180 - _ang2D(lm[P.H], lm[P.K], lm[P.A]));   // magnitud de desviación respecto a la recta (0°=extendido; + techo fisiológico)
    }
    if(grupo==='Tobillo'){
      if(!(v(P.K)&&v(P.A)&&v(P.F))) return { ok:false, val:null };
      if(deg(P.K,P.A,P.F)) return { ok:false, val:null };
      var ia=_ang2D(lm[P.K], lm[P.A], lm[P.F]);                            // interior pierna–tobillo–pie
      return (mov==='Dorsiflexión') ? _gonioTecho(grupo, mov, Math.max(0, 90-ia)) : _gonioTecho(grupo, mov, Math.max(0, ia-90));
    }
    if(grupo==='Codo'){                                                    // flexión, déficit de extensión E hiperextensión (el fisio elige el mov)
      if(!(v(P.S)&&v(P.E)&&v(P.W))) return { ok:false, val:null };
      if(deg(P.S,P.E,P.W)) return { ok:false, val:null };
      return _gonioTecho(grupo, mov, 180 - _ang2D(lm[P.S], lm[P.E], lm[P.W]));    // hombro–codo–muñeca; magnitud respecto a la recta (+ techo fisiológico)
    }
    if(grupo==='Muñeca'){
      if(!(v(P.E)&&v(P.W))) return { ok:false, val:null };
      var ejeM=_munecaEje(lm, P, _handsActuales());                      // metacarpiano (Hands, gate) o índice con mano abierta
      if(ejeM && ejeM.rechazo){                                          // GATE P0: la mano detectada NO corresponde a esta muñeca
        return { ok:false, val:null, motivo:'correspondencia',
                 gate:{ reason:ejeM.rechazo, ratio:ejeM.ratio, dPoseHands:ejeM.dPoseHands, antebrazoLen:ejeM.antebrazoLen } };
      }
      if(!ejeM) return { ok:false, val:null, motivo:'mano' };            // puño/mano no visible → "abre la mano", no un número falso
      if(!_medible3(lm[P.E], ejeM.B, ejeM.C)) return { ok:false, val:null, motivo:'mano' };
      var rM=_gonioTecho(grupo, mov, Math.max(0, 180 - _ang2D(lm[P.E], ejeM.B, ejeM.C)));  // antebrazo (codo→muñeca) vs eje de la mano trasladado al vértice (+ techo fisiológico)
      if(rM.ok){
        rM.eje=ejeM.eje; rM.mano={ B:{x:ejeM.B.x,y:ejeM.B.y}, C:{x:ejeM.C.x,y:ejeM.C.y} };  // los puntos REALES del número (dibujo+traza)
        rM.protocolo = (ejeM.eje==='metacarpiano5-hands') ? 'lateral-5mcp' : (ejeM.eje==='metacarpiano-hands' ? 'proxy-3mcp' : 'indice-pose');
        if(ejeM.manoCruda) rM.manoCruda=ejeM.manoCruda;            // lm0/lm9/lm17 CRUDOS de Hands (panel anatómico + traza)
        if(ejeM.manoIdx!=null){                                    // confianza (handedness score) de la mano usada, si el detector la dio
          try{ var _hm=(BIO.modo==='estatico')?BIO._estaticoHandsMeta:BIO._handsMeta;
               var _he=_hm&&_hm[ejeM.manoIdx]; if(_he&&_he.score!=null) rM.handsScore=Math.round(_he.score*100)/100; }catch(_hs){}
        }
        if(ejeM.gate) rM.qc={ matchRatio:ejeM.gate.ratio, matchAlarma:!!ejeM.gate.warn };   // correspondencia Pose↔Hands aprobada (con o sin alarma)
        if(ejeM.gateDescartado) rM.gateDescartado=ejeM.gateDescartado;
        if(ejeM.dPoseHands!=null) rM.dPoseHands=ejeM.dPoseHands;   // distancia muñeca Pose↔Hands (diagnóstico de asignación de mano; unidad: norm-con-aspecto)
        if(ejeM.antebrazoLen!=null) rM.antebrazoLen=ejeM.antebrazoLen;   // largo del antebrazo en la misma unidad (para exportar la proporción)
        if(_seg2D(lm[P.E], ejeM.B) < 0.09 || _seg2D(ejeM.B, ejeM.C) < 0.05) rM.cortoImg=true;  // fuera de plano probable → baja confianza
      }
      return rM;
    }
    return { ok:false, val:null };
  }
  function nuevoAccGonio(){ return { medidas:{}, imgs:{}, sel:null, peak:null, run:0, ema:{} }; }
  function _gonioSelDefault(g){
    if(!g) return;
    if(!g.sel){ g.sel={ grupo:'Cadera', mov:'Flexión', lado:'der' }; }
    var e=_gonioEntry(g.sel.grupo, g.sel.mov) || GONIO_CAT[0];
    g.sel.grupo=e.grupo; g.sel.mov=e.mov; g.sel.key=e.key; g.sel.pos=e.pos; g.sel.agg=e.agg;
    g.sel.ref=e.ref; g.sel.lim=e.lim; g.sel.defic=!!e.defic; g.sel.normTxt=e.normTxt; g.sel.guia=e.guia;
    g.peak=null; g.run=0; g.ema={};
  }
  function _gonioSelKey(g){ return g && g.sel ? (g.sel.key+'_'+g.sel.lado) : ''; }
  // (h) Posible ESCORZO / fuera de plano: el goniómetro 2D colapsa hacia ~180° cuando el segmento queda casi
  // paralelo al eje de la cámara (p.ej. cadera ext 160°, rodilla flex 172°). Se marca "revisar" cuando el grado
  // rebasa MUCHO el rango normal (ref + 15°) en un mov que NO es déficit ni hiperextensión. Se computa de los
  // campos ya guardados (grado/ref) → aplica también a sesiones viejas. No borra el número; lo señala.
  function _gonioFueraRango(m){
    return !!(m && m.grado!=null && m.ref!=null && !m.defic && !m.hiperext && m.grado > m.ref + 15);
  }
  // Medida por encima del techo fisiológico (retroactivo: se computa del grado guardado, con o sin traza).
  function _gonioSuperaTecho(m){
    if(!m || m.grado==null) return false;
    if(m.traza && m.traza.fueraTecho) return true;
    var t=_gonioTechoDe(m); return (t!=null && m.grado>t);
  }
  function _gonioFmtGrado(m){
    if(!m || m.grado==null) return '—';
    if(m.hiperext){ return (m.grado<=1) ? '0° (neutro)' : ('+'+Math.round(m.grado)+'° hiperext'); }
    if(m.defic){ return (m.grado<=1) ? '0° (completa)' : ('déficit '+Math.round(m.grado)+'°'+(_gonioSuperaTecho(m)?' (supera techo)':'')); }
    if(_gonioSuperaTecho(m)) return Math.round(m.grado)+'° (supera techo)';   // V3: por encima del techo manda sobre "(revisar)"
    return Math.round(m.grado)+'°'+(_gonioFueraRango(m)?' (revisar)':'')+(_gonioSinExtremo(m)?' (posición mostrada)':'');
  }
  // (P0 2026-11-22) Foto/cuadro estático SIN confirmación de tope: el número describe la POSICIÓN QUE SE
  // VE, no el rango máximo del paciente → no se compara contra cortes clínicos. Medidas viejas (sin el
  // campo) y tomas dinámicas ('pico-dinamico') conservan el comportamiento de siempre.
  function _gonioSinExtremo(m){ return !!(m && m.traza && m.traza.extremoRango==='sin confirmar'); }
  function _gonioAlerta(m){
    if(!m || m.grado==null) return false;
    if(_gonioSuperaTecho(m)) return true;             // V3: por encima del techo fisiológico → alerta siempre
    if(_gonioFueraRango(m)) return true;              // (h) fuera de rango (posible escorzo) → alerta
    if(_gonioSinExtremo(m)) return false;             // (P0) posición mostrada ≠ rango máximo → sin semáforo de corte
    if(m.hiperext) return m.grado>m.lim;              // hiperextensión: alerta si rebasa el umbral
    return m.defic ? (m.grado>m.lim) : (m.grado<m.lim);
  }

  // Procesa un frame en vivo: histéresis de oclusión, EMA para el número visible, y pico (máx/mín).
  // (V3) Un valor `fueraTecho` se MUESTRA con aviso pero NO entra al pico automático (candado
  // anti-artefactos intacto); capturarlo requiere confirmación explícita ("◎ Cuadro actual").
  function procesarGonioFrame(r){
    var g=BIO.accG; if(!g || !g.sel) return false;
    var ok = !!(r && r.ok);
    // Hint honesto de MUÑECA (vivo): mano no medible → pedir mano abierta/visible, nunca inventar número.
    g.manoMiss = (r && !ok && r.motivo==='mano') ? ((g.manoMiss||0)+1) : 0;
    var hintV=document.getElementById('bg-hint');
    if(hintV){ var mV='';
      if(ok && r.fueraTecho) mV='⚠️ '+Math.round(r.val)+'° supera el techo típico ('+r.techo+'°): posible escorzo o punto mal detectado. Si es real, captúralo con "Cuadro actual" y confírmalo.';
      else if(g.sel.grupo==='Muñeca'){
        if(!BIO.hands && !BIO._handsFallo) mV='Cargando el detector de mano (solo la primera vez)…';
        else if(r && !ok && r.motivo==='correspondencia') mV=_gonioMsgCorrespondencia(r,false);
        else if(g.manoMiss>=6) mV='No se ve bien la mano: ábrela con la palma visible, cámara al costado';
        else if(ok && r.cortoImg) mV='⚠️ Antebrazo/mano muy cortos en imagen: acércate o pon la cámara al costado';
        else if(ok && r.qc && r.qc.matchAlarma) mV='⚠️ Correspondencia muñeca↔mano al límite ('+Math.round(r.qc.matchRatio*100)+'% del antebrazo): revisa los puntos antes de capturar';
      }
      hintV.textContent=mV;
    }
    g.run = ok ? (g.run+1) : 0;
    var valido = ok && !r.fueraTecho && g.run>=3;        // 3 cuadros seguidos válidos (fueraTecho NO alimenta el pico)
    var eLive = _emaVivo('g_live', ok, ok?r.val:null);   // anti-parpadeo solo para mostrar
    var mejoro=false;
    if(valido){
      if(g.peak==null){ g.peak=r.val; mejoro=true; }
      else { var np=(g.sel.agg==='min') ? Math.min(g.peak, r.val) : Math.max(g.peak, r.val); if(np!==g.peak){ g.peak=np; mejoro=true; } }
    }
    // (V3.1) Lecturas SEPARADAS e identificadas: grande = suavizada (EMA, solo para mostrar);
    // "Cuadro" = valor CRUDO del cuadro procesado (el mismo que dibuja el arco); "Mejor rango/(mínimo)"
    // = agregado del movimiento. Nada de un "máx" sin apellido.
    var live=document.getElementById('bg-live'); if(live) live.textContent = (eLive!=null)? Math.round(eLive) : '—';
    var cfr=document.getElementById('bg-cuadro'); if(cfr) cfr.textContent = ok ? Math.round(r.val) : '—';
    var mx=document.getElementById('bg-max'); if(mx) mx.textContent = (g.peak!=null)? Math.round(g.peak) : '—';
    return mejoro;
  }
  // Vértice + brazos del goniómetro según articulación (compartido vivo / foto / video).
  function _gonioVtx(grupo, P){
    if(grupo==='Cadera') return { vtx:P.H, ea:P.S, eb:P.K };
    if(grupo==='Rodilla') return { vtx:P.K, ea:P.H, eb:P.A };
    if(grupo==='Codo')    return { vtx:P.E, ea:P.S, eb:P.W };
    if(grupo==='Muñeca')  return { vtx:P.W, ea:P.E, eb:P.Ix };
    return { vtx:P.A, ea:P.K, eb:P.F };   // Tobillo
  }
  // Los 3 landmarks (redondeados) que produjeron el grado, para trazabilidad de la captura.
  // Muñeca con eje metacarpiano: vtx/b son los puntos de HANDS realmente usados (+ qué eje midió).
  function _gonioLmUsados(lm, grupo, lado, r){
    if(!lm) return null;
    var P=_gonioPts(lado), vx=_gonioVtx(grupo,P);
    function pt(i){ var q=lm[i]; if(!q) return null;
      return { i:i, x:Math.round(q.x*1e4)/1e4, y:Math.round(q.y*1e4)/1e4,
               v:(q.visibility!=null?Math.round(q.visibility*100)/100:null) }; }
    function ptXY(q){ return q ? { x:Math.round(q.x*1e4)/1e4, y:Math.round(q.y*1e4)/1e4 } : null; }
    if(grupo==='Muñeca' && r && r.mano){
      // vtx = muñeca de POSE (centro articular del detector, P0 2026-11-22); manoCruda = lm0/9/17 de
      // Hands SIN trasladar (lo que el detector vio de verdad), para auditar la correspondencia.
      return { a:pt(vx.ea), vtx:(pt(vx.vtx)||ptXY(r.mano.B)), b:ptXY(r.mano.C), eje:(r.eje||null),
               manoCruda:(r.manoCruda?JSON.parse(JSON.stringify(r.manoCruda)):null) };
    }
    return { a:pt(vx.ea), vtx:pt(vx.vtx), b:pt(vx.eb) };
  }
  // ═══ MOTOR GEOMÉTRICO/GRÁFICO V3 (motor V2 de la 2ª revisión + dirección de arte V3) ═══════════
  // Geometría en PÍXELES del cuadro orientado (el canvas ES la fuente: el aspecto ya va implícito).
  // El ARCO se construye con barrido FIRMADO atan2(cross,dot) desde la referencia clínica (0°=neutro):
  //  · 'straight' (codo/rodilla/cadera/muñeca; flexión, déficit de extensión e hiperextensión):
  //    referencia = PROLONGACIÓN del segmento proximal A→V; eje distal = V→C.
  //    |barrido| = 180 − ángulo interior = EXACTAMENTE el número clínico (misma fórmula que calcularGonio).
  //  · 'ankle' (tobillo): referencia = PERPENDICULAR al eje de la pierna (A→V), del lado del PIE
  //    (neutro clínico = 90°). |barrido| = |interior − 90| = magnitud de DF/PF. El SIGNO de pantalla NO se
  //    usa como dirección anatómica (espejo/perfil lo invierten): el fisio eligió el movimiento y la app
  //    mide la magnitud (dirAnatomica 'porConfirmar', igual que el resto del motor 2D).
  // El arco dibujado y la cifra salen del MISMO objeto → ya no existe el arco horario fijo (hallazgo G1:
  // 184–322° por el lado reflejo) ni la etiqueta fija sin anticolisión (G2) ni el radio por-canvas (G3).
  var _GX=(function(){
    function sub(a,b){ return { x:a.x-b.x, y:a.y-b.y }; }
    function len(a){ return Math.hypot(a.x, a.y); }
    function signed(a,b){ return Math.atan2(a.x*b.y - a.y*b.x, a.x*b.x + a.y*b.y); }   // [-π, π]
    // A,V,C en px del cuadro; mode 'straight' | 'ankle'. Devuelve ok, a1 (ángulo de la referencia),
    // sweep (firmado), degrees=|sweep|°, interiorDeg (ángulo interior A-V-C) y la referencia unitaria.
    function geom(A, V, C, mode){
      if(!(_finP(A) && _finP(V) && _finP(C))) return { ok:false, motivo:'puntos' };
      var p=sub(V,A), q=sub(C,V), l1=len(p), l2=len(q);
      if(Math.min(l1,l2) < 2) return { ok:false, motivo:'degenerado' };
      var u={ x:p.x/l1, y:p.y/l1 }, v={ x:q.x/l2, y:q.y/l2 }, ref;
      if(mode==='ankle'){
        var side = (u.x*q.y - u.y*q.x) >= 0 ? 1 : -1;     // la perpendicular que cae del lado del pie
        ref = { x:-side*u.y, y:side*u.x };
      } else { ref=u; }
      var sweep=signed(ref, v);
      return { ok:true, A:A, V:V, C:C, l1:l1, l2:l2, mode:(mode||'straight'), ref:ref,
               a1:Math.atan2(ref.y, ref.x), sweep:sweep, degrees:Math.abs(sweep)*180/Math.PI,
               interiorDeg: 180 - Math.abs(signed(u, v))*180/Math.PI };
    }
    function ray(g, r, t){ return { x:g.V.x + r*Math.cos(t), y:g.V.y + r*Math.sin(t) }; }
    // Posición de la ETIQUETA por búsqueda de candidatos alrededor de la bisectriz, con anticolisión
    // contra ejes / arco / puntos / bordes (Liang-Barsky para segmentos). k = px por "px CSS" (escala de
    // diseño V3); prevOff = offset elegido antes (HISTÉRESIS en vivo, para que la caja no brinque).
    function layout(g, w, h, o){
      o=o||{};
      if(!g || !g.ok || !(w>0 && h>0)) return null;
      var k=o.k||1, L=Math.min(g.l1, g.l2);
      var radius=Math.min(L*0.52, Math.max(14*k, Math.min(L*0.42, 52*k)));
      var f=Math.max(18*k, Math.min(32*k, 26*k));
      var pad=6*k, hb=f+2*pad;
      var wb=Math.min(w-2*pad, (o.textWidth || (String(o.text||'').length*f*0.62)) + 2*pad);
      if(wb<=0 || hb>h-2*pad) return { radius:radius, label:null, labelOutside:true,
        refEnd:ray(g, radius+16*k, g.a1), arcStart:ray(g,radius,g.a1), arcEnd:ray(g,radius,g.a1+g.sweep) };
      var bis=g.a1 + g.sweep/2, refEnd=ray(g, radius+16*k, g.a1);
      var endpoints=[g.A, g.V, g.C];
      var segments=[[g.A,g.V],[g.V,g.C],[g.V,refEnd]];
      var offs=[0, Math.PI/4, -Math.PI/4, Math.PI/2, -Math.PI/2, Math.PI, 3*Math.PI/4, -3*Math.PI/4];
      var best=null;
      for(var oi=0; oi<offs.length; oi++){ for(var xi=0; xi<3; xi++){
        var off=offs[oi], extra=[1,1.6,2.3][xi];
        var des=ray(g, radius + (Math.max(wb,hb)/2 + 9*k)*extra, bis+off);
        var x=Math.max(pad, Math.min(w-pad-wb, des.x-wb/2)), y=Math.max(pad, Math.min(h-pad-hb, des.y-hb/2));
        var cx=x+wb/2, cy=y+hb/2;
        function contiene(p){ return p.x>=x-pad && p.x<=x+wb+pad && p.y>=y-pad && p.y<=y+hb+pad; }
        var hit=false, si;
        for(si=0; si<segments.length && !hit; si++){                        // segmento vs caja expandida
          var a=segments[si][0], b=segments[si][1], dx=b.x-a.x, dy=b.y-a.y, lo=0, hi=1, ok2=true;
          var pp=[-dx,dx,-dy,dy], qq=[a.x-(x-pad), x+wb+pad-a.x, a.y-(y-pad), y+hb+pad-a.y];
          for(var ii=0; ii<4; ii++){
            if(Math.abs(pp[ii])<1e-12){ if(qq[ii]<0){ ok2=false; break; } }
            else { var t=qq[ii]/pp[ii]; if(pp[ii]<0){ if(t>lo) lo=t; } else { if(t<hi) hi=t; } if(lo>hi){ ok2=false; break; } }
          }
          if(ok2) hit=true;
        }
        if(!hit){ for(si=0; si<=16 && !hit; si++){ if(contiene(ray(g, radius, g.a1 + g.sweep*si/16))) hit=true; } }
        if(!hit){ for(si=0; si<endpoints.length && !hit; si++){ if(contiene(endpoints[si])) hit=true; } }
        var score=(hit?10000:0) + Math.hypot(cx-des.x, cy-des.y) + Math.abs(off)*12*k + (extra-1)*14*k
                  - ((o.prevOff!=null && Math.abs(off-o.prevOff)<1e-9) ? 30*k : 0);   // histéresis en vivo
        if(!best || score<best.score) best={ x:x, y:y, w:wb, h:hb, cx:cx, cy:cy, off:off, score:score, blocked:hit };
      } }
      return { radius:radius, font:f, refEnd:refEnd,
               arcStart:ray(g,radius,g.a1), arcEnd:ray(g,radius,g.a1+g.sweep),
               label:(best && !best.blocked)?best:null, labelOutside:!(best && !best.blocked),
               off:(best?best.off:null) };
    }
    return { geom:geom, layout:layout };
  })();
  // px por "px CSS" (escala de diseño V3 → V3.1): si el canvas está montado, la escala sale del
  // CONTENIDO VISIBLE REAL — object-fit:contain deja letterbox, así que el contenido ocupa
  // min(clientW/w, clientH/h) px CSS por px de bitmap, NO clientWidth/w — y con zoom CSS activo se
  // divide por s para que grosores/tipografías mantengan TAMAÑO ÓPTICO estable en pantalla (el zoom
  // agranda la foto, no engorda el instrumento). En un canvas de exportación (sin layout) usa la
  // escala de diseño w/420.
  function _gxK(ctx, w){
    var k=null;
    try{
      var cv=ctx && ctx.canvas;
      if(cv && cv.clientWidth){
        var cw=cv.clientWidth||0, ch=cv.clientHeight||0, hh=cv.height||1;
        var esc=Math.min(cw/Math.max(1,w), (ch||cw)/Math.max(1,hh));   // px CSS por px de bitmap (contenido real)
        if(esc>0 && isFinite(esc)){
          var z=(cv.classList && cv.classList.contains('bio-interactivo') && BIO._zoom && BIO._zoom.s>1) ? BIO._zoom.s : 1;
          k=1/(esc*z);
        }
      }
    }catch(_e){}
    if(k==null || !isFinite(k) || k<=0) k=w/420;        // export / sin layout: escala de diseño
    // Tope de seguridad solo para contenidos PATOLÓGICAMENTE chicos (<180 px CSS, p.ej. miniaturas):
    // en pantallas reales el tamaño efectivo manda (etiqueta 24–32 px CSS aunque haya letterbox fuerte).
    return Math.min(k, w/180);
  }
  // Resuelve los 3 puntos A/V/C en PÍXELES del cuadro (muñeca usa los puntos reales de Hands de `r`;
  // `manual` los sobreescribe con los puntos EFECTIVOS del ajuste del fisio). Devuelve null si no visibles.
  function _gonioPtsPx(lm, grupo, lado, r, w, h, manual){
    if(manual && _finP(manual.A) && _finP(manual.V) && _finP(manual.C)){
      return { A:manual.A, V:manual.V, C:manual.C, mode:(grupo==='Tobillo'?'ankle':'straight'), manual:true };
    }
    if(!lm) return null;
    var P=_gonioPts(lado), j=_gonioVtx(grupo, P), A, V, C;
    if(grupo==='Muñeca' && r && r.mano && _finP(r.mano.B) && _finP(r.mano.C)){
      if(!_vis(lm, j.ea)) return null;
      A=lm[j.ea]; V=r.mano.B; C=r.mano.C;
    } else {
      if(!(_vis(lm,j.vtx) && _vis(lm,j.ea) && _vis(lm,j.eb))) return null;
      A=lm[j.ea]; V=lm[j.vtx]; C=lm[j.eb];
    }
    return { A:{x:A.x*w, y:A.y*h}, V:{x:V.x*w, y:V.y*h}, C:{x:C.x*w, y:C.y*h},
             mode:(grupo==='Tobillo'?'ankle':'straight') };
  }
  // Valor clínico desde 3 puntos en PX (para el AJUSTE MANUAL): mismo mapeo por movimiento que
  // calcularGonio (el ángulo en px ≡ normalizado×aspecto). Aplica el mismo techo (como bandera).
  function _gonioValorDesdePx(pts, grupo, mov){
    var g=_GX.geom(pts.A, pts.V, pts.C, pts.mode);
    if(!g.ok) return { ok:false, val:null, motivo:g.motivo };
    var val;
    if(grupo==='Tobillo'){
      val = (mov==='Dorsiflexión') ? Math.max(0, 90 - g.interiorDeg) : Math.max(0, g.interiorDeg - 90);
    } else if(grupo==='Muñeca'){ val = Math.max(0, 180 - g.interiorDeg); }
    else { val = 180 - g.interiorDeg; }
    var t=_gonioTecho(grupo, mov, val);
    t.geom=g; return t;
  }
  function _gxRoundRect(ctx, x, y, w, h, r){
    ctx.beginPath();
    if(ctx.roundRect){ ctx.roundRect(x, y, w, h, r); return; }
    ctx.moveTo(x+r, y); ctx.arcTo(x+w, y, x+w, y+h, r); ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r); ctx.arcTo(x, y, x+w, y, r); ctx.closePath();
  }
  // Traza ejes + arco + etiqueta estilo V3 sobre CUALQUIER contexto (vivo, foto, cuadro-pico, export).
  // `val` = número clínico a rotular (de calcularGonio o del ajuste manual); si la geometría del arco NO
  // representa ese número (p.ej. tobillo truncado a 0°), el arco NO se dibuja (nunca un arco que mienta).
  // opts: { manual:{A,V,C} px efectivos, hyst:{off} histéresis de etiqueta en vivo, k:escala }.
  // Devuelve info del layout (null si no se pudo dibujar).
  function _trazarGonio(ctx, w, h, lm, grupo, lado, val, r, opts){
    if(!ctx || !w || !h) return null;
    opts=opts||{};
    var pts=_gonioPtsPx(lm, grupo, lado, r, w, h, opts.manual);
    if(!pts) return null;
    var g=_GX.geom(pts.A, pts.V, pts.C, pts.mode);
    if(!g.ok) return null;
    var k=opts.k || _gxK(ctx, w);
    var NAVY='#10283D', GOLD='#E7BB57', WHITE='#FFFFFF';
    var txt=(val!=null) ? (Math.round(val)+'°') : null;
    ctx.save();
    ctx.font='700 '+Math.round(26*k)+'px Inter, system-ui, -apple-system, Arial, sans-serif';
    var l=_GX.layout(g, w, h, { text:txt||'', textWidth:(txt?ctx.measureText(txt).width:0), k:k,
                                prevOff:(opts.hyst ? opts.hyst.off : null) });
    if(!l){ ctx.restore(); return null; }
    if(opts.hyst) opts.hyst.off = l.off;
    ctx.lineCap='round'; ctx.lineJoin='round';
    function linea(a, b, dash, wCss){
      var ww=(wCss||2.5)*k;
      ctx.setLineDash(dash ? [5*k, 4.5*k] : []);
      ctx.strokeStyle=NAVY; ctx.lineWidth=ww+2*k; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      ctx.strokeStyle=WHITE; ctx.lineWidth=ww; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      ctx.setLineDash([]);
    }
    // 1) referencia neutra punteada (prolongación proximal / perpendicular del tobillo)
    linea(g.V, l.refEnd, true, 1.8);
    // 2) ejes anatómicos: blancos con halo navy
    linea(g.A, g.V, false, 2.5);
    linea(g.V, g.C, false, 2.5);
    // 3) arco dorado = el MISMO barrido que el número (si el valor mostrado difiere de la geometría —
    //    tobillo truncado a 0 — o es ~0°, no se dibuja arco: los ejes + la referencia ya cuentan la historia)
    var vDeg=(val!=null)?val:g.degrees;
    if(g.degrees>=0.5 && vDeg>=0.75 && Math.abs(vDeg-g.degrees)<=1.5){
      ctx.strokeStyle=NAVY; ctx.lineWidth=5*k; ctx.beginPath(); ctx.arc(g.V.x, g.V.y, l.radius, g.a1, g.a1+g.sweep, g.sweep<0); ctx.stroke();
      ctx.strokeStyle=GOLD; ctx.lineWidth=3*k; ctx.beginPath(); ctx.arc(g.V.x, g.V.y, l.radius, g.a1, g.a1+g.sweep, g.sweep<0); ctx.stroke();
    }
    // 4) puntos: extremos blancos con anillo navy; vértice dorado
    [g.A, g.C].forEach(function(p){
      ctx.beginPath(); ctx.arc(p.x, p.y, 4*k, 0, Math.PI*2);
      ctx.fillStyle=WHITE; ctx.fill(); ctx.strokeStyle=NAVY; ctx.lineWidth=1.6*k; ctx.stroke();
    });
    ctx.beginPath(); ctx.arc(g.V.x, g.V.y, 5*k, 0, Math.PI*2);
    ctx.fillStyle=GOLD; ctx.fill(); ctx.strokeStyle=NAVY; ctx.lineWidth=1.6*k; ctx.stroke();
    // 5) etiqueta navy con borde blanco (solo si hay lugar SEGURO; si no, el valor vive en el panel)
    if(txt && l.label){
      var b=l.label;
      ctx.fillStyle='#122C43'; _gxRoundRect(ctx, b.x, b.y, b.w, b.h, 7*k); ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,.85)'; ctx.lineWidth=1.2*k; _gxRoundRect(ctx, b.x, b.y, b.w, b.h, 7*k); ctx.stroke();
      ctx.fillStyle=WHITE; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(txt, b.cx, b.cy);
    }
    ctx.restore();
    return { geom:g, layout:l, pts:pts };
  }
  // Copia defensiva de landmarks (para congelar el cuadro-pico de un video).
  function _copiaLm(lm){ return (lm||[]).map(function(p){ return p?{x:p.x,y:p.y,z:p.z,visibility:p.visibility}:p; }); }
  // Dibuja una imagen/cuadro (img, video o canvas) a un canvas nuevo, con tope de ancho (default 1000 =
  // resolución de ANÁLISIS; la exportación anotada puede pedir más vía `cap`, separando inferencia de export).
  function _canvasDeImagen(el, cap){
    var vw=(el&&(el.naturalWidth||el.videoWidth||el.width))||0, vh=(el&&(el.naturalHeight||el.videoHeight||el.height))||0;
    cap=cap||1000;
    var esc=vw>cap?cap/vw:1, w=Math.max(1,Math.round(vw*esc)), h=Math.max(1,Math.round(vh*esc));
    var c=document.createElement('canvas'); c.width=w; c.height=h;
    try{ c.getContext('2d').drawImage(el,0,0,w,h); }catch(e){}
    return c;
  }
  // Copia un cuadro al canvas dado (REUSÁNDOLO, cero alloc por frame) o crea uno. Para congelar el
  // cuadro-pico en vivo sin castigar la memoria de iOS. Devuelve el canvas o null.
  function _copiarFrameA(cv, el, cap){
    var vw=(el&&(el.naturalWidth||el.videoWidth||el.width))||0, vh=(el&&(el.naturalHeight||el.videoHeight||el.height))||0;
    if(!vw || !vh) return null;
    cap=cap||1600;
    var esc=vw>cap?cap/vw:1, w=Math.max(1,Math.round(vw*esc)), h=Math.max(1,Math.round(vh*esc));
    if(!cv) cv=document.createElement('canvas');
    if(cv.width!==w || cv.height!==h){ cv.width=w; cv.height=h; }
    try{ cv.getContext('2d').drawImage(el,0,0,w,h); }catch(e){ return null; }
    return cv;
  }
  // Dibuja los brazos del goniómetro + arco + valor sobre la articulación medida (vista EN VIVO).
  // La etiqueta usa HISTÉRESIS (BIO._gxHyst) para no brincar de lugar cuadro a cuadro.
  function dibujarGonioVivo(lm, r){
    var g=BIO.accG; if(!lm || !BIO.ctx || !BIO.canvas || !g || !g.sel) return;
    if(!BIO._gxHyst) BIO._gxHyst={};
    _trazarGonio(BIO.ctx, BIO.canvas.width, BIO.canvas.height, lm, g.sel.grupo, g.sel.lado, (r && r.ok) ? r.val : null, r, { hyst:BIO._gxHyst });
  }
  // (V3.1) El panel vivo compartido se mueve FUERA del visor en goniómetro (panel opaco bajo la imagen,
  // nunca un gradiente sobre la anatomía) y se devuelve adentro para los demás modos (overlay como antes).
  function _panelVivoDocked(fuera){
    try{
      var p=document.getElementById('bio-panel-vivo'); if(!p) return;
      var wrap=document.querySelector('#bio-vista-camara .bio-canvas-wrap'); if(!wrap || !wrap.parentNode) return;
      if(fuera){
        var tools=document.getElementById('bio-gtools');
        var ancla=(tools && tools.parentNode===wrap.parentNode) ? tools : wrap;
        if(p.previousElementSibling!==ancla || p.parentNode!==wrap.parentNode) wrap.parentNode.insertBefore(p, ancla.nextSibling);
        p.classList.add('bio-panel-dock');
      } else {
        if(p.parentNode!==wrap) wrap.appendChild(p);
        p.classList.remove('bio-panel-dock');
      }
    }catch(_d){}
  }
  // Panel de LECTURA del goniómetro (V3.1): tres lecturas IDENTIFICADAS y separadas —
  //  · grande: en vivo = lectura suavizada (EMA anti-parpadeo); estático = lectura del cuadro.
  //  · "Cuadro": el valor CRUDO del último cuadro procesado (el mismo número que dibuja el arco).
  //  · "Mejor rango"/"Mejor (mínimo)" según la agregación del movimiento (ya no un "máx" engañoso);
  //    en estático se OCULTA (sería redundante con la lectura única del cuadro).
  function pintarPanelGonio(){
    var panel=document.getElementById('bio-panel-vivo'); if(!panel) return;
    _panelVivoDocked(true);
    BIO.emaVivo={};
    var s=BIO.accG&&BIO.accG.sel;
    var esEstP=(BIO.modo==='estatico');
    var rotMax=(s && s.agg==='min') ? 'Mejor (mínimo)' : 'Mejor rango';
    panel.innerHTML =
      '<div class="bio-gonio-live">'
      + '<div class="gl-eyebrow">'+(esEstP?'Lectura del cuadro analizado':'Lectura en vivo (suavizada)')+'</div>'
      + '<div class="gl-head">'
      +   '<div class="gl-num" aria-live="polite"><span id="bg-live">—</span><span class="gl-deg">°</span></div>'
      +   '<div><div class="gl-lbl" id="bg-lbl">'+(s?(esc(s.grupo)+' · '+esc(s.mov)+' · '+(s.lado==='izq'?'Izquierdo':'Derecho')):'—')+'</div>'
      +     '<div class="gl-metodo">'
      +       ((s && s.grupo==='Muñeca')
                ? (BIO._munProto==='5mcp'
                    ? 'Lateral clásico · eje 5.º metacarpiano (requiere revisión del fisio)'
                    : 'Proxy computacional · eje 3.er metacarpiano (no equivale a goniometría manual)')
                : 'Estimación fotogoniométrica 2D')
      +       ' · dirección por confirmar</div></div>'
      + '</div>'
      + '<div class="gl-sub">'
      // (V3.2 P1) lecturas auto-descritas: "Cuadro" = valor CRUDO del último cuadro (el del arco);
      // "Mejor rango" = mayor/mejor valor SOSTENIDO de la toma; la referencia es de ADULTO y ORIENTATIVA
      // (no diagnóstico automático — en pediatría los rangos difieren). Hallazgos auditoría V3.1 #3/#4.
      +   (esEstP ? '' : '<span title="Valor crudo del último cuadro procesado — el mismo número que dibuja el arco">Cuadro <b id="bg-cuadro">—</b>°</span><span title="'+((s && s.agg==='min')?'El menor valor sostenido de la toma (déficit): su mejor lectura':'El mayor rango sostenido alcanzado en esta toma')+'">'+rotMax+' <b id="bg-max">—</b>°</span>')
      +   '<span title="Rango de referencia de ADULTO — orientativo, no es diagnóstico (en pediatría difiere)">Ref. adulto '+(s?esc(s.normTxt):'—')+' <i style="font-style:normal;opacity:.7">(orientativa)</i></span>'
      +   (esEstP ? '<span style="display:none">'+rotMax+' <b id="bg-max">—</b>°</span>' : '')
      + '</div>'
      + '<div id="bg-hint" style="font-size:12px;line-height:1.3;color:#E8C96A;margin-top:4px;min-height:14px"></div>'
      + '</div>';
  }
  // (V3.1) Selector COMPACTO del instrumento: <select> nativos para articulación y movimiento (accesibles,
  // una línea cada uno) + control SEGMENTADO de lateralidad (Derecho | Izquierdo), como el prototipo.
  // Mismo contrato de siempre: todo pasa por BIO_gonioSel(kind, valor).
  function _gonioSelectorHTML(g){
    var sel=g.sel;
    function opts(list, cur){ return list.map(function(o){ return '<option value="'+esc(o)+'"'+(o===cur?' selected':'')+'>'+esc(o)+'</option>'; }).join(''); }
    var movs=_gonioMovs(sel.grupo).map(function(m){return m.mov;});
    return '<div class="bio-gfield"><span class="bio-glab">Articulación</span>'
      +   '<select class="bio-gsel2" aria-label="Articulación" onchange="BIO_gonioSel(\'grupo\',this.value)">'+opts(GONIO_JOINTS, sel.grupo)+'</select></div>'
      + '<div class="bio-gfield"><span class="bio-glab">Movimiento</span>'
      +   '<select class="bio-gsel2" aria-label="Movimiento" onchange="BIO_gonioSel(\'mov\',this.value)">'+opts(movs, sel.mov)+'</select></div>'
      + '<div class="bio-gfield"><span class="bio-glab">Lateralidad</span>'
      +   '<div class="bio-seg" role="group" aria-label="Lateralidad">'
      +     '<button type="button" class="bio-seg-b'+(sel.lado==='der'?' on':'')+'" aria-pressed="'+(sel.lado==='der')+'" onclick="BIO_gonioSel(\'lado\',\'der\')">Derecho</button>'
      +     '<button type="button" class="bio-seg-b'+(sel.lado==='izq'?' on':'')+'" aria-pressed="'+(sel.lado==='izq')+'" onclick="BIO_gonioSel(\'lado\',\'izq\')">Izquierdo</button>'
      +   '</div></div>';
  }
  // Lista de ángulos ya capturados (chips con × para borrar).
  function _gonioCapsHTML(g){
    var caps=[]; GONIO_CAT.forEach(function(e){
      ['der','izq'].forEach(function(ld){
        var m=g.medidas[e.key+'_'+ld];
        if(m) caps.push({ txt:e.grupo+' '+e.mov+' '+(ld==='izq'?'I':'D')+': '+_gonioFmtGrado(m), key:e.key+'_'+ld, al:_gonioAlerta(m) });
      });
    });
    return caps.length
      ? '<div class="bio-gcaps">'+caps.map(function(c){
          return '<span class="bio-gcap'+(c.al?' al':'')+'">'+esc(c.txt)+' <b onclick="BIO_gonioBorrar(\''+c.key+'\')">×</b></span>';
        }).join('')+'</div>'
      : '<div class="bio-gcaps-empty">Aún no capturas ningún ángulo.</div>';
  }
  // Barra de control del goniómetro EN VIVO / ESTÁTICO (V3.1): selector compacto + UN solo botón
  // PRIMARIO por etapa ("Capturar medición", dorado) + secundarios; barra de herramientas del visor
  // (Vista completa / Enfocar articulación / zoom) en estático; sin emojis decorativos.
  function pintarGonioCtrl(){
    var box=document.getElementById('bio-gonio-ctrl'); if(!box) return;
    if(!BIO.accG) BIO.accG=nuevoAccGonio();
    _gonioSelDefault(BIO.accG);
    var g=BIO.accG, sel=g.sel;
    var esEstC=(BIO.modo==='estatico');
    var editando=(BIO._ed&&BIO._ed.on);
    box.innerHTML =
      _gonioSelectorHTML(g)
      // (P0 2026-11-22) MUÑECA: protocolos NO intercambiables — (B) proxy computacional del 3.er
      // metacarpiano (automático, el que mide el detector de mano) vs (A) lateral clásico del 5.º
      // metacarpiano (convención de goniometría manual; SIEMPRE requiere revisión del fisio al capturar).
      + (sel.grupo==='Muñeca'
          ? '<div class="bio-gfield"><span class="bio-glab">Protocolo</span>'
            + '<div class="bio-seg" role="group" aria-label="Protocolo de muñeca">'
            +   '<button type="button" class="bio-seg-b'+(BIO._munProto!=='5mcp'?' on':'')+'" aria-pressed="'+(BIO._munProto!=='5mcp')+'" onclick="BIO_gonioProto(\'3mcp\')" title="Proxy computacional: eje muñeca→3.er nudillo del detector de mano">3.er MCP · proxy</button>'
            +   '<button type="button" class="bio-seg-b'+(BIO._munProto==='5mcp'?' on':'')+'" aria-pressed="'+(BIO._munProto==='5mcp')+'" onclick="BIO_gonioProto(\'5mcp\')" title="Convención lateral clásica (5.º metacarpiano): requiere revisión del fisioterapeuta">5.º MCP · clásico</button>'
            + '</div></div>'
          : '')
      + '<div class="bio-gdiv"></div>'
      // (P0) Foto/cuadro estático: sin "tope confirmado" la medida se guarda como POSICIÓN MOSTRADA
      // (sin semáforo de corte) y queda "requiere revisión". El fisio lo confirma solo si de verdad
      // llevó la articulación a su tope al tomar la foto.
      + (esEstC
          ? '<label style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:#cfd6e4;margin:0 0 8px;cursor:pointer">'
            + '<input type="checkbox" id="bio-ext-ok" '+(BIO._extOk?'checked':'')+' onchange="BIO_gonioExtremo(this.checked)" style="width:17px;height:17px;accent-color:#E7BB57">'
            + '<span>Tope de movimiento <b>confirmado</b> por el fisioterapeuta <span style="color:#9BA3B5">(sin marcar = "posición mostrada", no rango máximo)</span></span></label>'
          : '')
      + (esEstC
          ? '<div class="bio-gbtns" id="bio-ed-row">'
            + '<button class="bio-ged-btn" id="bio-ed-btn" onclick="BIO_gonioAjustar()" aria-label="Ajustar puntos anatómicos">'+(editando?'Ajustando puntos…':((BIO._ed&&BIO._ed.ok)?'Puntos ajustados ✓':'Ajustar puntos anatómicos'))+'</button>'
            + '</div>'
            + (editando
               ? '<div class="bio-gbtns" id="bio-ed-actions">'
                 + '<button class="bio-ged-ok" onclick="BIO_gonioAjustarOk()">Usar estos puntos</button>'
                 + '<button class="bio-ged-undo" onclick="BIO_gonioAjustarUndo()" aria-label="Deshacer ajuste">Deshacer</button>'
                 + '<button class="bio-ged-no" onclick="BIO_gonioAjustarCancelar()" aria-label="Cancelar ajuste">Cancelar</button>'
                 + '</div>'
               : '')
          : '')
      + '<div class="bio-gbtns">'
      +   '<button class="bio-gcap-btn" onclick="BIO_gonioCapturar()" aria-label="Capturar medición">Capturar medición</button>'
      +   (esEstC ? '' : '<button class="bio-gact-btn" onclick="BIO_gonioCapturarActual()" title="Captura el cuadro que se ve ahora (no el mejor rango)" aria-label="Capturar el cuadro actual">Cuadro actual</button>')
      + '</div>'
      + '<div class="bio-gbtns">'
      +   '<button class="bio-gfin-btn" onclick="BIO_gonioFinish()" aria-label="Ver registro y guardar al expediente">Guardar al expediente</button>'
      + '</div>'
      + _gonioVideoUIHTML()
      + (esEstC && BIO._estaticoFuente==='video' && BIO.pendingVideo && BIO.pendingVideo.file
          ? '<div class="bio-grow" style="margin-bottom:8px"><button class="bio-gtool" style="width:100%" onclick="BIO_gonioReanalizarVideo()">Reanalizar este video para '+esc(sel.grupo+' '+sel.mov+' '+(sel.lado==='izq'?'Izq':'Der'))+'</button></div>'
          : '')
      + ((BIO.videoCola && BIO.videoCola.length)
          ? '<div class="bio-grow" style="margin-bottom:8px"><button class="bio-gtool" style="width:100%;background:#0d47a1;border-color:#0d47a1;color:#fff" onclick="BIO_colaSiguiente()">Siguiente video ('+BIO.videoCola.length+' en cola)</button></div>'
          : '')
      + (esEstC ? '<div class="bio-grow" style="margin-bottom:8px"><button class="bio-gtool" style="width:100%" onclick="BIO_gonioVolverInicio()">Medir otra fuente (foto · video · cámara)</button></div>' : '')
      + _gonioCapsHTML(g);
    // Barra de herramientas del VISOR (solo estático): Vista completa · Enfocar articulación · zoom − / +.
    var tb=document.getElementById('bio-gtools');
    if(tb){
      if(esEstC){
        tb.innerHTML =
          '<button class="bio-gtool" onclick="BIO_gonioZoomReset()" aria-label="Vista completa">Vista completa</button>'
          + '<button class="bio-gtool" id="bio-gtool-foco" aria-pressed="'+(BIO._zoomFoco?'true':'false')+'" onclick="BIO_gonioEnfocar()" aria-label="Enfocar la articulación medida">Enfocar articulación</button>'
          + '<button class="bio-gtool zx" onclick="BIO_gonioZoomMenos()" aria-label="Alejar">−</button>'
          + '<button class="bio-gtool zx" onclick="BIO_gonioZoomMas()" aria-label="Acercar">+</button>'
          // (P0 2026-11-22) Panel de DIAGNÓSTICO ANATÓMICO: puntos crudos por fuente, SIN ángulos.
          + '<button class="bio-gtool" id="bio-gtool-anat" aria-pressed="'+(BIO._anatOn?'true':'false')+'" onclick="BIO_gonioPanelAnat()" aria-label="Panel de diagnóstico anatómico (puntos crudos, sin ángulos)"'+(BIO._anatOn?' style="background:#E7BB57;border-color:#E7BB57;color:#122C43"':'')+'>Anatomía</button>'
          + (BIO._anatOn ? '<button class="bio-gtool" onclick="BIO_gonioExportTraza()" aria-label="Exportar coordenadas (JSON)">Exportar JSON</button>' : '')
          + '<button class="bio-gtool" onclick="BIO_v4ExportarPar()" aria-label="Exportar este cuadro con su detección y abrir la herramienta de revisión V4">Revisar en V4</button>';
        tb.classList.add('on');
      } else { tb.classList.remove('on'); tb.innerHTML=''; }
    }
    pintarPanelGonio();
    var est=document.getElementById('bio-estado'); if(est) est.textContent = sel.pos+' · '+sel.guia;
  }
  // Pantalla de INICIO del goniómetro: selector arriba + tira de capturas + "Terminar y guardar".
  function pintarGonioInicio(){
    if(!BIO.accG) BIO.accG=nuevoAccGonio();
    _gonioSelDefault(BIO.accG);
    var selBox=document.getElementById('bio-gonio-sel');
    if(selBox) selBox.innerHTML = '<div class="bio-gsel-hint">1) Elige qué medir · 2) toma la medición en vivo, con una foto o un video.</div>' + _gonioSelectorHTML(BIO.accG);
    var capBox=document.getElementById('bio-gonio-caps');
    if(capBox){
      var arr=_gonioMedidasArr(BIO.accG);
      capBox.innerHTML = _gonioCapsHTML(BIO.accG)
        + ((BIO.videoCola && BIO.videoCola.length) ? '<button class="bio-gtool" style="width:100%;margin-top:10px;background:#0d47a1;border-color:#0d47a1;color:#fff" onclick="BIO_colaSiguiente()">Siguiente video ('+BIO.videoCola.length+' en cola)</button>' : '')
        + (arr.length ? '<button class="bio-gfin-btn" style="width:100%;margin-top:10px" onclick="BIO_gonioFinish()">Guardar al expediente ('+arr.length+')</button>' : '')
        // V4: herramienta de REVISIÓN manual (foto + 3 puntos colocados por el fisioterapeuta). Al
        // capturar allí, aparece la pantalla de confirmación y SOLO entonces se guarda al expediente.
        + '<div style="margin-top:12px;border-top:1px solid var(--gray-200);padding-top:10px">'
        +   '<button class="bio-gtool" style="width:100%;min-height:44px" onclick="BIO_v4Abrir()">Revisión anatómica V4 (colocación manual de puntos)</button>'
        +   '<div class="bio-gsel-hint" style="margin-top:6px">Sube una foto y coloca tú los 3 puntos (proximal · centro articular · distal); nada se guarda sin tu confirmación.</div>'
        + '</div>';
    }
  }
  // Muestra el resultado de una FOTO o del cuadro-pico de un VIDEO en la vista de cámara (cuadro congelado + control).
  function _mmss(s){ s=Math.max(0,Math.round(s||0)); return Math.floor(s/60)+':'+('0'+(s%60)).slice(-2); }   // 7 → "0:07"
  function _mostrarGonioEstatico(baseCanvas, lm, fuente){
    detenerCamaraStream(); detenerLoopCamara();
    BIO.modo='estatico'; BIO._estaticoBase=baseCanvas; BIO._estaticoLm=lm; BIO._estaticoFuente=fuente;
    // (V3.1 P2) qué cuadro es éste: 'pico' (del análisis) o 'fijado' (elegido a mano en la línea de tiempo)
    BIO._estaticoTipoCuadro=(BIO._estaticoTipoCuadroNext!=null)?BIO._estaticoTipoCuadroNext:((fuente==='video')?'pico':null);
    BIO._estaticoTipoCuadroNext=null;
    // (V3.2) UTC de ADQUISICIÓN del raster analizado: video-pico hereda el del cuadro congelado del
    // análisis; foto / cuadro fijado = momento de decodificación (el archivo no trae hora confiable).
    BIO._estaticoAdq=(fuente==='video' && BIO._peakAdq!=null) ? BIO._peakAdq : Date.now();
    BIO._ed=null; BIO._gxHyst=null; _zoomReset();   // V3: fuente nueva → ajuste manual, histéresis y zoom desde cero
    // Manos CONGELADAS con este cuadro (foto: pase explícito; video: las del cuadro-pico). undefined =
    // aún no se buscó la mano en esta imagen → _recalcEstatico la busca bajo demanda si eligen Muñeca.
    BIO._estaticoHandsLm = (BIO._estaticoHandsNext!==undefined) ? BIO._estaticoHandsNext : undefined;
    BIO._estaticoHandsMeta = (BIO._estaticoHandsNext!==undefined) ? (BIO._estaticoHandsMetaNext||null) : null;
    BIO._estaticoHandsNext = undefined; BIO._estaticoHandsMetaNext = undefined; BIO._estaticoHandsRun = false;
    BIO._extOk=false; BIO._anatOn=false;   // (P0) fuente nueva → tope de rango SIN confirmar y panel anatómico apagado
    mostrarVista('bio-vista-camara');
    try{ var _vc31e=document.getElementById('bio-vista-camara'); if(_vc31e) _vc31e.classList.add('gonio-v31'); }catch(_g31e){}   // V3.1: layout de instrumento
    var cv=document.getElementById('bio-canvas'); if(!cv) return;
    try{ cv.classList.add('bio-interactivo'); }catch(_ta){}   // V3: pinch/arrastre propios (solo en estático)
    _edBindPointer();
    BIO.canvas=cv; BIO.ctx=cv.getContext('2d'); BIO.srcEl=null;
    var cr=document.getElementById('bio-cron'); if(cr) cr.style.display='none';
    var br=document.getElementById('bio-btn-rec'); if(br) br.style.display='none';
    var bf=document.getElementById('bio-btn-flip'); if(bf) bf.style.display='none';
    var gc=document.getElementById('bio-gonio-ctrl'); if(gc) gc.style.display='block';
    pintarGonioCtrl();
    _recalcEstatico();
    var est=document.getElementById('bio-estado');
    if(est) est.textContent = (fuente==='foto')
      ? 'Foto analizada · cambia la articulación o el lado para medir otra, o toca Capturar medición'
      : ('Video analizado'+(BIO._peakTSeg!=null?' · mejor rango a '+_mmss(BIO._peakTSeg):'')+' · toca Capturar medición; para otro movimiento cambia la selección y toca Reanalizar este video');
  }
  // Recalcula el ángulo del movimiento seleccionado SOBRE el cuadro estático (foto o pico de video) y lo
  // dibuja. (V3) Si hay AJUSTE MANUAL activo/aceptado, el valor y el dibujo salen de los puntos EFECTIVOS
  // del fisio (mismo mapeo por movimiento); el detector original NUNCA se sobreescribe.
  function _recalcEstatico(){
    var g=BIO.accG; if(!g || !g.sel || !BIO._estaticoBase || !BIO.canvas) return;
    var cv=BIO.canvas, ctx=BIO.ctx;
    _setAspect(BIO._estaticoBase.width, BIO._estaticoBase.height);   // aspecto del cuadro estático (H1)
    if(cv.width!==BIO._estaticoBase.width || cv.height!==BIO._estaticoBase.height){ cv.width=BIO._estaticoBase.width; cv.height=BIO._estaticoBase.height; }
    // (V3.2 P1) marca el visor VERTICAL también en estático (igual que dibujar): el CSS de escritorio
    // ciñe el wrap al aspecto del contenido — menos franjas negras laterales; solo presentación.
    try{
      var _wvE=cv.parentElement, _vwE=BIO._estaticoBase.width, _vhE=BIO._estaticoBase.height;
      if(_wvE && _wvE.classList && _wvE._bioArv!==(_vwE+'x'+_vhE)){
        _wvE._bioArv=(_vwE+'x'+_vhE);
        var _esVE=(_vhE>_vwE);
        _wvE.classList.toggle('bio-vert', _esVE);
        if(_esVE) _wvE.style.setProperty('--bio-arv', String(Math.round((_vwE/_vhE)*1e4)/1e4));
      }
    }catch(_bvE){}
    ctx.clearRect(0,0,cv.width,cv.height);
    try{ ctx.drawImage(BIO._estaticoBase,0,0); }catch(e){}
    // MUÑECA sobre cuadro estático: si aún no se buscó la mano en ESTA imagen, se corre Hands en 2º plano
    // y se repinta al terminar (mientras tanto el fallback de índice-abierto puede dar un número provisional).
    if(g.sel.grupo==='Muñeca' && BIO._estaticoHandsLm===undefined && !BIO._handsFallo) _asegurarHandsEstatico();
    var r = BIO._estaticoLm ? calcularGonio(BIO._estaticoLm, g.sel.grupo, g.sel.mov, g.sel.lado) : { ok:false, val:null };
    BIO._estaticoR = r;   // para la traza de la captura (en muñeca trae r.mano/r.eje reales)
    var ed=BIO._ed, usandoManual = !!(ed && (ed.on || ed.ok) && ed.pts);
    var rMostrar=r, valMostrar=(r.ok?r.val:null);
    if(usandoManual){
      ed.r = _gonioValorDesdePx(ed.pts, g.sel.grupo, g.sel.mov);
      rMostrar = ed.r; valMostrar = ed.r.ok ? ed.r.val : null;
    }
    if(BIO._anatOn){
      // (P0 2026-11-22) PANEL ANATÓMICO: puntos crudos por fuente, SIN ángulos (el arco y el número se
      // apagan a propósito mientras se revisa la anatomía). El peak sigue computándose para la captura.
      _dibujarPanelAnat(ctx, cv);
      g.peak = valMostrar;
    } else if(valMostrar!=null){
      _trazarGonio(ctx, cv.width, cv.height, BIO._estaticoLm, g.sel.grupo, g.sel.lado, valMostrar, r,
                   usandoManual ? { manual:ed.pts } : undefined);
      g.peak = valMostrar;
    } else { g.peak=null; if(usandoManual && ed.on) _edDibujarSolo(ctx, cv, ed); }
    if(usandoManual && ed.on) _edDibujarHandles(ctx, cv, ed);
    var live=document.getElementById('bg-live'); if(live) live.textContent = (BIO._anatOn || valMostrar==null) ? '—' : Math.round(valMostrar);
    var mx=document.getElementById('bg-max'); if(mx) mx.textContent = (BIO._anatOn || valMostrar==null) ? '—' : Math.round(valMostrar);
    var hintE=document.getElementById('bg-hint');
    if(hintE){ var mE='';
      if(BIO._anatOn) mE='Panel de ANATOMÍA activo (sin ángulos): verifica que cada punto caiga en su referencia; corrige con ✋ Ajustar puntos. Toca "Anatomía" para volver a la medición.';
      else if(usandoManual && ed.on) mE='Ajuste manual: arrastra los puntos (proximal · vértice · distal) y toca "Usar estos puntos"';
      else if(usandoManual && ed.ok) mE='Puntos ajustados por el terapeuta — el valor sale de esos puntos';
      else if(rMostrar && rMostrar.ok && rMostrar.fueraTecho) mE='⚠️ '+Math.round(valMostrar)+'° supera el techo típico ('+rMostrar.techo+'°): posible escorzo o punto mal detectado. Capturar pedirá confirmación.';
      else if(g.sel.grupo==='Muñeca'){
        if(!r.ok && r.motivo==='correspondencia') mE=_gonioMsgCorrespondencia(r,true);
        else if(!r.ok && r.motivo==='mano') mE = BIO._estaticoHandsRun ? 'Buscando la mano en la imagen…' : 'No se ve bien la mano: palma visible hacia la cámara (abre la mano, sube otra toma o usa Ajustar puntos)';
        else if(r.ok && r.cortoImg) mE='⚠️ Antebrazo/mano muy cortos en imagen (posible fuera de plano): medición menos fiable';
        else if(r.ok && r.qc && r.qc.matchAlarma) mE='⚠️ Correspondencia muñeca↔mano al límite ('+Math.round(r.qc.matchRatio*100)+'% del antebrazo): revisa los puntos (panel Anatomía / ✋) antes de capturar';
      }
      hintE.textContent=mE;
    }
    BIO._estaticoImg = (valMostrar!=null) ? cv : null;
  }
  // ── (V3/A3) AJUSTE MANUAL DE PUNTOS + ZOOM/PAN de la vista estática ────────────────────────────
  // El fisio arrastra los 3 puntos (proximal · vértice · distal) sobre el cuadro; el ángulo se recalcula
  // EN VIVO desde los puntos efectivos (mismo mapeo por movimiento que el detector). El set del detector
  // se conserva íntegro en la traza (lmUsados) y el manual se guarda aparte (lmManual, revision 'manual').
  // Nada se captura sin la aceptación explícita "✓ Usar estos puntos".
  function _edDibujarSolo(ctx, cv, ed){   // puntos degenerados aún sin ángulo: dibuja solo los brazos guía
    try{
      ctx.save(); ctx.setLineDash([6,5]); ctx.strokeStyle='rgba(255,255,255,.65)'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(ed.pts.A.x, ed.pts.A.y); ctx.lineTo(ed.pts.V.x, ed.pts.V.y); ctx.lineTo(ed.pts.C.x, ed.pts.C.y); ctx.stroke();
      ctx.restore();
    }catch(_e){}
  }
  function _edDibujarHandles(ctx, cv, ed){
    var k=_gxK(ctx, cv.width);
    var tags=[['A','prox'],['V','vértice'],['C','distal']];
    ctx.save();
    ctx.font='700 '+Math.round(11*k)+'px Inter, system-ui, Arial, sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    tags.forEach(function(t){
      var p=ed.pts[t[0]]; if(!p) return;
      ctx.beginPath(); ctx.arc(p.x, p.y, 13*k, 0, Math.PI*2);
      ctx.strokeStyle='rgba(231,187,87,.95)'; ctx.lineWidth=2.2*k; ctx.stroke();
      ctx.beginPath(); ctx.arc(p.x, p.y, 2.2*k, 0, Math.PI*2); ctx.fillStyle='#E7BB57'; ctx.fill();
      var ty=p.y-19*k, tw=ctx.measureText(t[1]).width+8*k;
      ctx.fillStyle='rgba(18,44,67,.85)'; ctx.fillRect(p.x-tw/2, ty-8*k, tw, 16*k);
      ctx.fillStyle='#fff'; ctx.fillText(t[1], p.x, ty);
    });
    ctx.restore();
  }
  // ── (P0 2026-11-22) PROTOCOLO DE MUÑECA · TOPE DE RANGO · PANEL ANATÓMICO · EXPORT ──────────────
  function BIO_gonioProto(v){
    var nv=(v==='5mcp')?'5mcp':'3mcp';
    if(BIO._munProto===nv) return;
    BIO._munProto=nv;
    _bumpGen();   // cambió la convención del eje distal: cuadros en vuelo de la anterior no valen
    if(BIO.modo==='estatico'){ pintarGonioCtrl(); _recalcEstatico(); }
    else if(BIO.modo==='camara'){ pintarGonioCtrl(); }
    else pintarGonioInicio();
  }
  function BIO_gonioExtremo(on){
    BIO._extOk=!!on;
    var est=document.getElementById('bio-estado');
    if(est) est.textContent = BIO._extOk
      ? 'Tope confirmado por el fisioterapeuta: la medida se comparará contra la referencia.'
      : 'Sin tope confirmado: se guardará como "posición mostrada" (sin semáforo de corte) y quedará para revisión.';
  }
  // Panel de DIAGNÓSTICO ANATÓMICO (orden §2): muestra los puntos CRUDOS de cada detector con nombre,
  // índice, fuente y confianza, las líneas de eje y el centro articular — SIN NINGÚN ÁNGULO. Sirve para
  // verificar a ojo (con zoom/Enfocar) que los puntos caen en la anatomía ANTES de fiarse del número.
  function BIO_gonioPanelAnat(){
    if(BIO.modo!=='estatico'){ toast('El panel de anatomía funciona sobre una foto o cuadro analizado','info'); return; }
    BIO._anatOn=!BIO._anatOn;
    pintarGonioCtrl(); _recalcEstatico();
  }
  function _dibujarPanelAnat(ctx, cv){
    var g=BIO.accG; if(!g || !g.sel || !BIO._estaticoLm) return;
    var lm=BIO._estaticoLm, w=cv.width, h=cv.height, k=_gxK(ctx, w);
    var P=_gonioPts(g.sel.lado);
    var r=BIO._estaticoR||null;
    function X(p){ return p.x*w; } function Y(p){ return p.y*h; }
    ctx.save();
    ctx.lineWidth=2.2*k; ctx.font='700 '+Math.round(12*k)+'px Inter, system-ui, Arial, sans-serif';
    function rotulo(x,y,txt,color,dy){
      var tw=ctx.measureText(txt).width+8*k;
      var bx=x+7*k; if(bx+tw > w-4*k) bx=Math.max(4*k, w-4*k-tw);   // nunca cortar el texto en el borde
      var by=y-18*k+(dy||0); if(by<2*k) by=y+10*k; if(by+16*k>h-2*k) by=h-18*k;
      ctx.fillStyle='rgba(13,22,38,.82)'; ctx.fillRect(bx, by, tw, 16*k);
      ctx.fillStyle=color; ctx.fillText(txt, bx+4*k, by+12*k);
    }
    function punto(x,y,rad,color,borde){
      ctx.beginPath(); ctx.arc(x,y,rad,0,Math.PI*2); ctx.fillStyle=color; ctx.fill();
      ctx.strokeStyle=borde; ctx.lineWidth=1.6*k; ctx.stroke();
    }
    // Eje del ANTEBRAZO (codo→muñeca de Pose) y brazo (hombro→codo): cian.
    var nomP={}; nomP[P.S]='hombro'; nomP[P.E]='codo'; nomP[P.W]='muñeca'; nomP[P.Ix]='índice';
    var segs=[[P.S,P.E],[P.E,P.W]];
    ctx.strokeStyle='rgba(0,229,255,.85)'; ctx.lineWidth=2.4*k;
    segs.forEach(function(sg){ var a=lm[sg[0]], b=lm[sg[1]]; if(!a||!b) return;
      ctx.beginPath(); ctx.moveTo(X(a),Y(a)); ctx.lineTo(X(b),Y(b)); ctx.stroke(); });
    var dyP={}; dyP[P.S]=0; dyP[P.E]=0; dyP[P.W]=-34*k; dyP[P.Ix]=-16*k;   // escalonado: la muñeca/índice no se encimen
    [P.S,P.E,P.W,P.Ix].forEach(function(i){
      var p=lm[i]; if(!p) return;
      punto(X(p),Y(p),5*k,'#00E5FF','#06303B');
      var vis=(p.visibility!=null)?(' '+Math.round(p.visibility*100)+'%'):'';
      rotulo(X(p),Y(p),'Pose '+i+' · '+(nomP[i]||'')+vis+' · detector','#00E5FF', dyP[i]||0);
    });
    // CENTRO ARTICULAR del detector (muñeca de Pose): anillo.
    var Wp=lm[P.W];
    if(Wp){ ctx.beginPath(); ctx.arc(X(Wp),Y(Wp),11*k,0,Math.PI*2); ctx.strokeStyle='rgba(0,229,255,.7)'; ctx.setLineDash([4*k,3*k]); ctx.stroke(); ctx.setLineDash([]); }
    // MANOS (Hands): todas las detectadas; 0/9/17 grandes con nombre y score, resto chico; eje 0→9 y 0→17.
    var manos=(BIO._estaticoHandsLm&&BIO._estaticoHandsLm.length)?BIO._estaticoHandsLm:[];
    manos.forEach(function(hd,hi){
      if(!hd) return;
      var meta=(BIO._estaticoHandsMeta&&BIO._estaticoHandsMeta[hi])||null;
      var sc=(meta&&meta.score!=null)?(' · clasif. mano '+Math.round(meta.score*100)+'%'):'';
      var dyH={ 0:24*k, 9:42*k, 17:60*k };   // escalonado para que los 3 rótulos de la mano no se encimen
      hd.forEach(function(q,qi){ if(!q) return;
        if(qi===0||qi===9||qi===17){
          punto(X(q),Y(q),5*k,'#FFB300','#4A2F00');
          rotulo(X(q),Y(q),'Hands '+hi+':'+qi+' · '+(qi===0?'muñeca':(qi===9?'3.er MCP':'5.º MCP'))+sc+' · detector','#FFB300', dyH[qi]);
        } else { ctx.beginPath(); ctx.arc(X(q),Y(q),2*k,0,Math.PI*2); ctx.fillStyle='rgba(255,179,0,.5)'; ctx.fill(); }
      });
      var h0=hd[0];
      [[9,false],[17,true]].forEach(function(dd){ var q=hd[dd[0]]; if(!h0||!q) return;
        ctx.strokeStyle='rgba(255,179,0,.85)'; ctx.lineWidth=2*k;
        if(dd[1]) ctx.setLineDash([5*k,4*k]);
        ctx.beginPath(); ctx.moveTo(X(h0),Y(h0)); ctx.lineTo(X(q),Y(q)); ctx.stroke(); ctx.setLineDash([]);
      });
    });
    // Puntos AJUSTADOS por el fisio (si los hay): dorado — único estado "confirmado por humano".
    var ed=BIO._ed;
    if(ed && (ed.ok||ed.on) && ed.pts){
      ctx.strokeStyle='rgba(231,187,87,.95)'; ctx.lineWidth=2.6*k;
      ctx.beginPath(); ctx.moveTo(ed.pts.A.x, ed.pts.A.y); ctx.lineTo(ed.pts.V.x, ed.pts.V.y); ctx.lineTo(ed.pts.C.x, ed.pts.C.y); ctx.stroke();
      [['A','prox'],['V','vértice'],['C','distal']].forEach(function(t){ var p=ed.pts[t[0]]; if(!p) return;
        punto(p.x,p.y,5.5*k,'#E7BB57','#4A2F00'); rotulo(p.x,p.y,'✋ '+t[1]+' · confirmado por fisio','#E7BB57'); });
    }
    // Leyenda + lectura del gate (nunca un ángulo).
    var lineas=['DIAGNÓSTICO ANATÓMICO · sin ángulos','cian = Pose (detector) · ámbar = Hands (detector) · dorado = ✋ confirmado por fisio'];
    if(g.sel.grupo==='Muñeca'){
      if(r && r.dPoseHands!=null && r.antebrazoLen){
        var ratio=r.dPoseHands/r.antebrazoLen;
        lineas.push('Correspondencia muñeca Pose↔Hands: '+Math.round(ratio*100)+'% del antebrazo (límite 12%) '+(ratio<=GONIO_MATCH_MAX?'✓':'✗ requiere revisión'));
      } else if(r && r.gate && r.gate.ratio!=null){
        lineas.push('Correspondencia muñeca Pose↔Hands: '+Math.round(r.gate.ratio*100)+'% del antebrazo (límite 12%) ✗ requiere revisión');
      }
      lineas.push('Protocolo: '+(BIO._munProto==='5mcp'?'lateral clásico (5.º MCP, revisión del fisio)':'proxy computacional (3.er MCP)'));
    }
    ctx.font='700 '+Math.round(12*k)+'px Inter, system-ui, Arial, sans-serif';
    // Leyenda con AJUSTE DE LÍNEA al ancho del cuadro (nunca texto cortado en el borde).
    var maxW=w-32*k, lin2=[];
    lineas.forEach(function(t){
      if(ctx.measureText(t).width<=maxW){ lin2.push(t); return; }
      var palabras=t.split(' '), cur='';
      palabras.forEach(function(pal){
        var prueba=cur?(cur+' '+pal):pal;
        if(ctx.measureText(prueba).width<=maxW){ cur=prueba; }
        else { if(cur) lin2.push(cur); cur=pal; }
      });
      if(cur) lin2.push(cur);
    });
    var lw=0; lin2.forEach(function(t){ lw=Math.max(lw, ctx.measureText(t).width); });
    ctx.fillStyle='rgba(13,22,38,.85)'; ctx.fillRect(8*k, 8*k, Math.min(lw+16*k, w-16*k), (lin2.length*16+10)*k);
    lin2.forEach(function(t,i){ ctx.fillStyle=(i===0)?'#FFFFFF':'#cfd6e4'; ctx.fillText(t, 16*k, (24+16*i)*k); });
    ctx.restore();
  }
  // Exporta el registro COMPLETO de coordenadas del cuadro estático (orden maestra): pose 33, manos,
  // resultado con gates, selección y dims — como archivo JSON descargable (nada se manda a ningún lado).
  function BIO_gonioExportTraza(){
    if(BIO.modo!=='estatico' || !BIO._estaticoBase){ toast('Exportar funciona sobre una foto o cuadro analizado','info'); return; }
    var g=BIO.accG||{};
    var bw=BIO._estaticoBase.width, bh=BIO._estaticoBase.height;
    function rnd(v,n){ return (v==null)?null:Math.round(v*Math.pow(10,n))/Math.pow(10,n); }
    var reg={
      motor:BIO_ALGO_VER, exportadoEn:new Date().toISOString(),
      seleccion:(g.sel?{grupo:g.sel.grupo,mov:g.sel.mov,lado:g.sel.lado}:null),
      protocoloMuneca:(BIO._munProto==='5mcp'?'lateral-5mcp':'proxy-3mcp'),
      cuadro:{ w:bw, h:bh, fuente:BIO._estaticoFuente||null, rot:(BIO._fotoHD&&BIO._fotoHD.rot)||0,
               adquiridoEnUTC:(BIO._estaticoAdq!=null?new Date(BIO._estaticoAdq).toISOString():null) },
      pose33:(BIO._estaticoLm||[]).map(function(p,i){ return p?{ i:i, x:rnd(p.x,5), y:rnd(p.y,5), z:rnd(p.z,5),
        visibility:rnd(p.visibility,4), px:{x:rnd(p.x*bw,1), y:rnd(p.y*bh,1)} }:null; }),
      manos:(BIO._estaticoHandsLm||[]).map(function(hd,hi){ return { mano:hi,
        meta:(BIO._estaticoHandsMeta&&BIO._estaticoHandsMeta[hi])||null,
        pts:(hd||[]).map(function(q,qi){ return q?{ i:qi, x:rnd(q.x,5), y:rnd(q.y,5),
          px:{x:rnd(q.x*bw,1), y:rnd(q.y*bh,1)} }:null; }) }; }),
      resultado:(BIO._estaticoR?JSON.parse(JSON.stringify(BIO._estaticoR)):null),
      ajusteManual:(BIO._ed&&BIO._ed.ok)?JSON.parse(JSON.stringify(BIO._ed.pts)):null
    };
    try{
      var blob=new Blob([JSON.stringify(reg,null,1)],{type:'application/json'});
      var a=document.createElement('a'); a.href=URL.createObjectURL(blob);
      a.download='gonio_traza_'+((g.sel&&g.sel.key)||'cuadro')+'_'+Date.now()+'.json';
      document.body.appendChild(a); a.click();
      setTimeout(function(){ try{ URL.revokeObjectURL(a.href); a.remove(); }catch(_e){} }, 1200);
      toast('Traza exportada (JSON con coordenadas y confianza)','success');
    }catch(_e){ toast('No se pudo exportar la traza','error'); }
  }
  function BIO_gonioAjustar(){
    var g=BIO.accG; if(BIO.modo!=='estatico' || !g || !g.sel || !BIO.canvas){ return; }
    if(BIO._ed && BIO._ed.on){ return; }   // ya está ajustando
    var cv=BIO.canvas;
    var ini=_gonioPtsPx(BIO._estaticoLm, g.sel.grupo, g.sel.lado, BIO._estaticoR, cv.width, cv.height, null);
    if(!ini){   // no medible (p.ej. muñeca sin mano): triángulo inicial centrado para colocar a mano
      ini={ A:{x:cv.width*0.3, y:cv.height*0.6}, V:{x:cv.width*0.5, y:cv.height*0.5}, C:{x:cv.width*0.65, y:cv.height*0.35},
            mode:(g.sel.grupo==='Tobillo'?'ankle':'straight') };
    }
    function cp(p){ return { x:p.x, y:p.y }; }
    BIO._ed={ on:true, ok:false, r:null, drag:null,
              pts:{ A:cp(ini.A), V:cp(ini.V), C:cp(ini.C), mode:ini.mode },
              auto:{ A:cp(ini.A), V:cp(ini.V), C:cp(ini.C), mode:ini.mode } };
    _edBindPointer();
    pintarGonioCtrl(); _recalcEstatico();
  }
  function BIO_gonioAjustarOk(){
    var ed=BIO._ed; if(!ed || !ed.on) return;
    var g=BIO.accG;
    ed.r=_gonioValorDesdePx(ed.pts, g.sel.grupo, g.sel.mov);
    if(!ed.r.ok){ toast('Los puntos quedan encimados: sepáralos para que el ángulo sea medible','warning'); return; }
    ed.on=false; ed.ok=true;
    pintarGonioCtrl(); _recalcEstatico();
    toast('✋ Puntos ajustados: el valor sale de TUS puntos. Toca ◉ Capturar para guardarlo.','info');
  }
  function BIO_gonioAjustarUndo(){
    var ed=BIO._ed; if(!ed) return;
    ed.pts={ A:{x:ed.auto.A.x,y:ed.auto.A.y}, V:{x:ed.auto.V.x,y:ed.auto.V.y}, C:{x:ed.auto.C.x,y:ed.auto.C.y}, mode:ed.auto.mode };
    _recalcEstatico();
  }
  function BIO_gonioAjustarCancelar(){
    BIO._ed=null; pintarGonioCtrl(); _recalcEstatico();
  }
  // Zoom/pan (CSS transform sobre el canvas; las coordenadas de puntero se invierten con el rect REAL,
  // incluyendo el letterbox de object-fit:contain → válido con y sin zoom, en touch y mouse).
  function _zoomReset(){
    BIO._zoom={ s:1, tx:0, ty:0 }; BIO._zoomFoco=false; _focoBtnRefresh(); _zoomAplicar();
    // fuera del estático el canvas vuelve a dejar pasar el scroll (la clase se re-agrega al entrar al estático)
    if(BIO.modo!=='estatico'){ try{ var _c=document.getElementById('bio-canvas'); if(_c) _c.classList.remove('bio-interactivo'); }catch(_e){} }
  }
  function _zoomAplicar(){
    var cv=null; try{ cv=document.getElementById('bio-canvas'); }catch(_e){} if(!cv) return;
    var z=BIO._zoom||{s:1,tx:0,ty:0};
    cv.style.transform=(z.s!==1||z.tx||z.ty)?('translate('+z.tx+'px,'+z.ty+'px) scale('+z.s+')'):'';
    // (V3.1) tamaño ÓPTICO estable: al cambiar el zoom se re-renderiza el overlay (throttle a 1 cuadro)
    // para que _gxK recalcule los grosores con la escala nueva. Una sola transformación afín manda.
    if(BIO.tipoMedicion==='gonio' && BIO.modo==='estatico' && !BIO._zoomRaf && typeof requestAnimationFrame!=='undefined'){
      BIO._zoomRaf=requestAnimationFrame(function(){ BIO._zoomRaf=null; try{ _recalcEstatico(); }catch(_e){} });
    }
  }
  function _focoBtnRefresh(){ try{ var b=document.getElementById('bio-gtool-foco'); if(b) b.setAttribute('aria-pressed', BIO._zoomFoco?'true':'false'); }catch(_e){} }
  function BIO_gonioZoomReset(){ _zoomReset(); }
  function BIO_gonioZoomMas(){ var z=BIO._zoom||(BIO._zoom={s:1,tx:0,ty:0}); z.s=Math.min(5,(z.s||1)*1.25); BIO._zoomFoco=false; _focoBtnRefresh(); _zoomAplicar(); }
  function BIO_gonioZoomMenos(){ var z=BIO._zoom||(BIO._zoom={s:1,tx:0,ty:0}); z.s=Math.max(1,(z.s||1)/1.25); if(z.s===1){ z.tx=0; z.ty=0; } BIO._zoomFoco=false; _focoBtnRefresh(); _zoomAplicar(); }
  // (V3.1) "Enfocar articulación": recorte VIRTUAL no destructivo — zoom+pan de la MISMA transformación
  // afín hacia la caja de A/V/C (detector o ajuste manual) con ~22% de padding. Los puntos del original
  // NUNCA cambian; ejes, arco y etiqueta se conservan (solo cambia el encuadre). Toca de nuevo = vista completa.
  function BIO_gonioEnfocar(){
    if(BIO.modo!=='estatico' || !BIO.canvas) return;
    if(BIO._zoomFoco){ _zoomReset(); return; }
    var g=BIO.accG; if(!g || !g.sel) return;
    var cv=BIO.canvas, w=cv.width, h=cv.height;
    var pts=(BIO._ed && (BIO._ed.on||BIO._ed.ok) && BIO._ed.pts) ? BIO._ed.pts
            : _gonioPtsPx(BIO._estaticoLm, g.sel.grupo, g.sel.lado, BIO._estaticoR, w, h, null);
    if(!pts){ toast('No hay articulación detectada que enfocar','info'); return; }
    var xs=[pts.A.x,pts.V.x,pts.C.x], ys=[pts.A.y,pts.V.y,pts.C.y];
    var minX=Math.min.apply(null,xs), maxX=Math.max.apply(null,xs);
    var minY=Math.min.apply(null,ys), maxY=Math.max.apply(null,ys);
    var dimW=Math.max((maxX-minX)*1.44, w*0.22), dimH=Math.max((maxY-minY)*1.44, h*0.22);   // padding ~22% por lado + mínimo
    var cx=(minX+maxX)/2, cy=(minY+maxY)/2;
    var cw=cv.clientWidth||0, ch=cv.clientHeight||0; if(!cw || !ch){ return; }
    var esc0=Math.min(cw/w, ch/h); if(!(esc0>0) || !isFinite(esc0)) return;
    var s=Math.max(1, Math.min(5, Math.min(cw/(dimW*esc0), ch/(dimH*esc0))));
    // elemento: contenido centrado → punto p queda en (ox+p·esc0); transform-origin es el CENTRO del elemento
    var ox=(cw-w*esc0)/2, oy=(ch-h*esc0)/2;
    var ex=ox+cx*esc0, ey=oy+cy*esc0;
    var tx=-s*(ex-cw/2), ty=-s*(ey-ch/2);
    BIO._zoom={ s:s, tx:Math.round(tx), ty:Math.round(ty) };
    BIO._zoomFoco=true; _focoBtnRefresh(); _zoomAplicar();
  }
  // cliente → px del bitmap del canvas (object-fit:contain + transform CSS incluidos)
  function _evToCanvasPx(ev, cv){
    var r=cv.getBoundingClientRect();
    var esc=Math.min(r.width/cv.width, r.height/cv.height); if(!esc || !isFinite(esc)) return null;
    var dw=cv.width*esc, dh=cv.height*esc;
    var ox=r.left+(r.width-dw)/2, oy=r.top+(r.height-dh)/2;
    return { x:(ev.clientX-ox)/esc, y:(ev.clientY-oy)/esc, esc:esc };
  }
  function _edBindPointer(){
    if(BIO._edBound) return;
    var cv=document.getElementById('bio-canvas'); if(!cv) return;
    BIO._edBound=true;
    var ptrs={};   // pointerId → últimas coords cliente (para pinch)
    function esGonioEstatico(){ return BIO.tipoMedicion==='gonio' && BIO.modo==='estatico'; }
    cv.addEventListener('pointerdown', function(ev){
      if(!esGonioEstatico()) return;
      ptrs[ev.pointerId]={ x:ev.clientX, y:ev.clientY };
      var ids=Object.keys(ptrs);
      if(ids.length===2){   // pinch: congela distancia inicial
        var a=ptrs[ids[0]], b=ptrs[ids[1]];
        BIO._pinch={ d0:Math.hypot(a.x-b.x, a.y-b.y), s0:(BIO._zoom?BIO._zoom.s:1) };
        if(BIO._ed) BIO._ed.drag=null;
        ev.preventDefault(); return;
      }
      var p=_evToCanvasPx(ev, cv); if(!p) return;
      var ed=BIO._ed;
      if(ed && ed.on){
        var hit=null, hd=34/Math.max(p.esc,1e-6);   // radio de agarre ≈34 px CSS, en px de bitmap
        ['A','V','C'].forEach(function(kk){ var q=ed.pts[kk]; var d=Math.hypot(q.x-p.x, q.y-p.y); if(d<hd && (!hit || d<hit.d)) hit={ k:kk, d:d }; });
        if(hit){ ed.drag=hit.k; try{ cv.setPointerCapture(ev.pointerId); }catch(_c){} ev.preventDefault(); return; }
      }
      var z=BIO._zoom||{s:1};
      if(z.s>1){ BIO._pan={ x:ev.clientX, y:ev.clientY, tx:z.tx, ty:z.ty }; ev.preventDefault(); }
    }, { passive:false });
    cv.addEventListener('pointermove', function(ev){
      if(!esGonioEstatico()) return;
      if(ptrs[ev.pointerId]) ptrs[ev.pointerId]={ x:ev.clientX, y:ev.clientY };
      var ids=Object.keys(ptrs);
      if(BIO._pinch && ids.length===2){
        var a=ptrs[ids[0]], b=ptrs[ids[1]], d=Math.hypot(a.x-b.x, a.y-b.y);
        var z2=BIO._zoom||(BIO._zoom={s:1,tx:0,ty:0});
        z2.s=Math.max(1, Math.min(5, BIO._pinch.s0*(d/Math.max(BIO._pinch.d0,1))));
        if(z2.s===1){ z2.tx=0; z2.ty=0; }
        BIO._zoomFoco=false; _focoBtnRefresh();
        _zoomAplicar(); ev.preventDefault(); return;
      }
      var ed=BIO._ed;
      if(ed && ed.on && ed.drag){
        var p=_evToCanvasPx(ev, cv); if(!p) return;
        ed.pts[ed.drag].x=Math.max(0, Math.min(cv.width, p.x));
        ed.pts[ed.drag].y=Math.max(0, Math.min(cv.height, p.y));
        if(!BIO._edRaf){ BIO._edRaf=requestAnimationFrame(function(){ BIO._edRaf=null; _recalcEstatico(); }); }
        ev.preventDefault(); return;
      }
      if(BIO._pan){
        var z3=BIO._zoom||{s:1,tx:0,ty:0};
        var r=cv.getBoundingClientRect(), limX=r.width*0.6, limY=r.height*0.6;
        z3.tx=Math.max(-limX, Math.min(limX, BIO._pan.tx+(ev.clientX-BIO._pan.x)));
        z3.ty=Math.max(-limY, Math.min(limY, BIO._pan.ty+(ev.clientY-BIO._pan.y)));
        _zoomAplicar(); ev.preventDefault();
      }
    }, { passive:false });
    function fin(ev){
      delete ptrs[ev.pointerId];
      if(Object.keys(ptrs).length<2) BIO._pinch=null;
      if(BIO._ed) BIO._ed.drag=null;
      BIO._pan=null;
    }
    cv.addEventListener('pointerup', fin); cv.addEventListener('pointercancel', fin);
    cv.addEventListener('dblclick', function(){ if(esGonioEstatico()) _zoomReset(); });
    cv.addEventListener('wheel', function(ev){
      if(!esGonioEstatico()) return;
      var z=BIO._zoom||(BIO._zoom={s:1,tx:0,ty:0});
      z.s=Math.max(1, Math.min(5, z.s*(ev.deltaY<0?1.12:0.89)));
      if(z.s===1){ z.tx=0; z.ty=0; }
      BIO._zoomFoco=false; _focoBtnRefresh();
      _zoomAplicar(); ev.preventDefault();
    }, { passive:false });
  }
  // ── DECÚBITO / CUERPO PARCIAL: pose robusta a la ORIENTACIÓN ──────────────────────
  // El detector (BlazePose) está entrenado con personas VERTICALES y no engancha a un paciente
  // ACOSTADO (prono / lateral / supino) ni cuando el torso/cabeza quedan fuera de cuadro → devuelve
  // "sin cuerpo". Pero para un ángulo de RODILLA solo hacen falta cadera-rodilla-tobillo, no la
  // cabeza ni el cuerpo completo. Solución (validada 2026-11-19): probar la foto en 0°/90°/-90°/180°;
  // el detector engancha cuando el cuerpo queda "vertical", y el ÁNGULO es el mismo (invariante a la
  // rotación, con la corrección de aspecto H1 recalculada para el cuadro ganador en _recalcEstatico).
  // Se usa la orientación que más ARTICULACIONES deja visibles. Pedido de Carlos: medir en decúbito
  // sin cuerpo completo. (La foto puede quedar mostrada girada: es la orientación que el detector vio.)
  var _GONIO_LM_IDX = [11,12,13,14,15,16,23,24,25,26,27,28]; // hombros, codos, muñecas, caderas, rodillas, tobillos
  function _scoreVisGonio(lm){
    if(!lm) return -1;
    var n=0, s=0;
    for(var k=0;k<_GONIO_LM_IDX.length;k++){ var p=lm[_GONIO_LM_IDX[k]]; if(!p) continue; var v=(p.visibility==null?1:p.visibility); if(v>=VIS_MIN) n++; s+=v; }
    return n*1000 + s;   // prioriza nº de articulaciones visibles; desempata por visibilidad total
  }
  function _contarVisGonio(lm){ var n=0; if(!lm) return 0; for(var k=0;k<_GONIO_LM_IDX.length;k++){ var p=lm[_GONIO_LM_IDX[k]]; if(p && (p.visibility==null || p.visibility>=VIS_MIN)) n++; } return n; }
  // Dibuja un <img>/canvas rotado (0/90/-90/180) a un canvas; en 90° intercambia ancho/alto.
  // `cap` (opcional) limita el lado MAYOR del resultado (análisis: 1000, igual que _canvasDeImagen;
  // export anotado HD: 2000) → una foto de 12 MP ya no crea un canvas 4000×3000 en iOS.
  function _rotarImgACanvas(img, rot, cap){
    var w=img.naturalWidth||img.width||0, h=img.naturalHeight||img.height||0;
    var esc=1; if(cap && Math.max(w,h)>cap) esc=cap/Math.max(w,h);
    var dw=Math.max(1,Math.round(w*esc)), dh=Math.max(1,Math.round(h*esc));
    var c=document.createElement('canvas'), x;
    if(rot===90||rot===-90){ c.width=dh; c.height=dw; } else { c.width=dw; c.height=dh; }
    x=c.getContext('2d');
    if(rot===90){ x.translate(c.width,0); x.rotate(Math.PI/2); }
    else if(rot===-90){ x.translate(0,c.height); x.rotate(-Math.PI/2); }
    else if(rot===180){ x.translate(c.width,c.height); x.rotate(Math.PI); }
    try{ x.drawImage(img,0,0,dw,dh); }catch(e){}
    return c;
  }
  // Corre HANDS sobre un canvas/img ESTÁTICO (serializado) y devuelve multiHandLandmarks o null.
  async function _handsSobreEstatico(src){
    var ok = await ensureHandsReady();
    if(!ok || !BIO.hands){ BIO._handsFallo=true; return null; }
    try{ if(BIO.hands.reset) BIO.hands.reset(); }catch(_r){}
    BIO._handsLm=null;
    for(var i=0;i<2;i++){ try{ await BIO.hands.send({ image: src }); }catch(_s){} if(BIO._handsLm && BIO._handsLm.length) break; }
    return BIO._handsLm || null;
  }
  // Lazy: el fisio eligió MUÑECA sobre una foto/cuadro ya analizado SIN pase de manos → se corre una vez
  // sobre la MISMA imagen (BIO._estaticoBase, ya rotada si aplica) y se repinta. [] = se buscó y no hay.
  function _asegurarHandsEstatico(){
    if(BIO.modo!=='estatico' || !BIO._estaticoBase || BIO._estaticoHandsRun) return;
    if(BIO._estaticoHandsLm!==undefined) return;
    BIO._estaticoHandsRun=true;
    var base=BIO._estaticoBase;
    _handsSobreEstatico(base).then(function(hs){
      BIO._estaticoHandsRun=false;
      if(BIO.modo!=='estatico' || BIO._estaticoBase!==base) return;   // cambió la fuente mientras corría
      BIO._estaticoHandsLm = _copiaManosLm(hs) || [];
      BIO._estaticoHandsMeta = BIO._handsMeta || null;                // (P0) confianza/handedness congeladas con ese cuadro
      _recalcEstatico();
    }).catch(function(){ BIO._estaticoHandsRun=false; BIO._estaticoHandsLm=[]; BIO._estaticoHandsMeta=null; });
  }
  // Corre pose sobre un canvas/img ESTÁTICO (serializado, igual que la foto normal). Devuelve landmarks o null.
  async function _poseSobreEstatico(src){
    BIO.modo='foto'; BIO._fotoRes=null;
    try{ if(BIO.pose && BIO.pose.reset) BIO.pose.reset(); }catch(_){}
    for(var i=0;i<2;i++){ try{ await BIO.pose.send({ image: src }); }catch(_s){} if(BIO._fotoRes && BIO._fotoRes.poseLandmarks) break; }
    var r=BIO._fotoRes; BIO._fotoRes=null;
    return (r && r.poseLandmarks) ? r.poseLandmarks : null;
  }
  // Detecta pose probando rotaciones; devuelve {lm, base, rot} con la orientación que más articulaciones ve.
  // `rot` permite re-renderizar la ANOTADA en alta resolución desde la foto original con la misma orientación.
  async function _detectarPoseRot(img){
    var cv0=_canvasDeImagen(img);
    var lm0=await _poseSobreEstatico(cv0);
    if(lm0 && _contarVisGonio(lm0)>=8) return { lm:lm0, base:cv0, rot:0 };   // cuerpo vertical/completo: sin rotar (idéntico a antes)
    var best = lm0 ? { lm:lm0, base:cv0, rot:0, sc:_scoreVisGonio(lm0) } : null;
    var rots=[90,-90,180];
    for(var i=0;i<rots.length;i++){
      var cv=_rotarImgACanvas(img, rots[i], 1000);   // mismo tope de análisis que el cuadro sin rotar (memoria iOS)
      var lm=await _poseSobreEstatico(cv);
      if(!lm) continue;
      var sc=_scoreVisGonio(lm);
      if(!best || sc>best.sc){ best={ lm:lm, base:cv, rot:rots[i], sc:sc }; }
    }
    return best ? { lm:best.lm, base:best.base, rot:best.rot } : null;
  }
  // MODO C: subir una FOTO (ideal camilla / decúbito prono) → pose en imagen estática → ángulo + foto anotada.
  async function procesarFoto(file){
    if(!file || !file.type || file.type.indexOf('image')!==0){ toast('Selecciona una imagen (JPG/PNG)','error'); return; }
    _bumpGen(); BIO.framesDescartados=0;   // nueva generación (foto exenta de la cola); O4: reinicia descartes
    if(!BIO.accG) BIO.accG=nuevoAccGonio();
    _gonioSelDefault(BIO.accG);
    mostrarVista('bio-vista-progreso');
    var fill=document.getElementById('bio-prog-fill'), txt=document.getElementById('bio-prog-txt');
    if(fill) fill.style.width='25%'; if(txt) txt.textContent='Cargando motor de pose…';
    var ok = await ensureMediaPipeReady();
    if(!ok){ if(txt) txt.textContent='⚠️ No se pudo cargar el motor de pose. Revisa tu conexión.'; return; }
    var url=URL.createObjectURL(file);
    var img=new Image();
    try{
      await new Promise(function(res,rej){
        img.onload=function(){ res(); };
        img.onerror=function(){ rej(new Error('No se pudo leer la imagen')); };
        img.src=url;
        setTimeout(function(){ if(img.naturalWidth>0) res(); else rej(new Error('Imagen no compatible (prueba JPG o PNG)')); }, 9000);
      });
    }catch(e){ try{URL.revokeObjectURL(url);}catch(_){ } toast('⚠️ '+e.message,'error'); mostrarVista('bio-vista-inicio'); pintarGonioInicio(); return; }
    if(txt) txt.textContent='Detectando postura (prueba orientaciones)…'; if(fill) fill.style.width='70%';
    // DECÚBITO/CUERPO PARCIAL: prueba 0°/90°/-90°/180° y se queda con la que más articulaciones ve.
    // Solo necesita la articulación en cuadro (cadera-rodilla-tobillo), NO el cuerpo completo.
    var det = await _detectarPoseRot(img);
    try{URL.revokeObjectURL(url);}catch(_r){}
    if(!det){ toast('No se detectó el cuerpo en la foto. Que la articulación (p.ej. cadera-rodilla-tobillo) se vea de PERFIL, completa en cuadro y con buena luz.','warning'); mostrarVista('bio-vista-inicio'); pintarGonioInicio(); return; }
    // P2: conserva la FOTO ORIGINAL decodificada + su orientación ganadora para exportar la anotada en
    // alta resolución (hasta 2000 px) desde las MISMAS coordenadas — el análisis sigue al tope de 1000.
    BIO._fotoHD = { img: img, rot: (det.rot||0) };
    // MUÑECA: corre HANDS sobre el MISMO cuadro elegido (det.base, ya rotado si hizo falta) → el eje del
    // 3.er metacarpiano queda en las MISMAS coordenadas que la pose. Si falla, el fallback endurecido decide.
    BIO._estaticoHandsNext=undefined; BIO._estaticoHandsMetaNext=undefined;
    if(BIO.accG && BIO.accG.sel && BIO.accG.sel.grupo==='Muñeca'){
      if(txt) txt.textContent='Detectando la mano (eje metacarpiano)…';
      try{ BIO._estaticoHandsNext = _copiaManosLm(await _handsSobreEstatico(det.base)) || []; BIO._estaticoHandsMetaNext = BIO._handsMeta || null; }catch(_h){ BIO._estaticoHandsNext=[]; BIO._estaticoHandsMetaNext=null; }
    }
    if(fill) fill.style.width='100%';
    _mostrarGonioEstatico(det.base, _copiaLm(det.lm), 'foto');
  }
  // Sube las imágenes anotadas (foto / cuadro-pico) a Storage. Devuelve [{key,etq,grado,url,fbPath,...}] o [] si falla.
  async function _subirImagenesGonio(p, g, btn){
    var out=[];
    if(!(g && g.imgs) || typeof fbStorage==='undefined' || !fbStorage) return out;
    var keys=Object.keys(g.imgs);
    for(var i=0;i<keys.length;i++){
      var it=g.imgs[keys[i]]; if(!it || !it.canvas) continue;
      try{
        var blob=await new Promise(function(resolve){ try{ it.canvas.toBlob(function(b){ resolve(b); }, 'image/jpeg', 0.85); }catch(e){ resolve(null); } });
        if(!blob) continue;
        if(btn) btn.textContent='☁️ Subiendo imagen '+(i+1)+'/'+keys.length+'…';
        var _ts=Date.now()+'_'+i;
        var _path='clinica/sinergia/'+p.id+'/biomecanica/gonio_'+(it.key||('img'+i))+'_'+_ts+'.jpg';
        var _ref=fbStorage.ref(_path);
        var _url=await new Promise(function(resolve,reject){
          var task=_ref.put(blob,{contentType:'image/jpeg'});
          task.on('state_changed', null, function(err){ reject(err); }, function(){ task.snapshot.ref.getDownloadURL().then(resolve).catch(reject); });
        });
        // P1-8: sube TAMBIÉN el original sin anotar (mismo path con sufijo _orig). Si falla, se conserva lo anotado + las métricas.
        var _urlOrig=null, _pathOrig=null;
        if(it.orig){ try{
          var blobO=await new Promise(function(resolve){ try{ it.orig.toBlob(function(b){ resolve(b); }, 'image/jpeg', 0.85); }catch(e){ resolve(null); } });
          if(blobO){ _pathOrig='clinica/sinergia/'+p.id+'/biomecanica/gonio_'+(it.key||('img'+i))+'_'+_ts+'_orig.jpg';
            var _refO=fbStorage.ref(_pathOrig);
            _urlOrig=await new Promise(function(resolve,reject){ var t=_refO.put(blobO,{contentType:'image/jpeg'}); t.on('state_changed', null, function(err){ reject(err); }, function(){ t.snapshot.ref.getDownloadURL().then(resolve).catch(reject); }); });
          }
        }catch(eo){ console.warn('[BIO] subida del original falló (se conserva lo anotado):', eo && eo.message); _urlOrig=null; _pathOrig=null; } }
        out.push({ key:keys[i], grupo:it.grupo, mov:it.mov, lado:it.lado, grado:it.grado, etq:it.etq, url:_url, fbPath:_path, urlOrig:_urlOrig, fbPathOrig:_pathOrig, mime:'image/jpeg' });
      }catch(e){ console.warn('[BIO] subida de imagen gonio falló:', e && e.message); }
    }
    return out;
  }
  function BIO_gonioSel(kind, val){
    if(!BIO.accG) BIO.accG=nuevoAccGonio();
    var g=BIO.accG; if(!g.sel) _gonioSelDefault(g);
    _bumpGen();   // cambió articulación/movimiento/lado: descarta cuadros en vuelo de la selección anterior
    if(kind==='grupo'){ g.sel.grupo=val; g.sel.mov=_gonioMovs(val)[0].mov; }
    else if(kind==='mov'){ g.sel.mov=val; }
    else if(kind==='lado'){ g.sel.lado=val; }
    _gonioSelDefault(g);
    BIO._ed=null; BIO._gxHyst=null;   // V3: cambió el movimiento → el ajuste manual y la etiqueta no se arrastran al nuevo
    _ensureHandsSiMuneca();   // eligieron Muñeca → baja el detector de MANO en 2º plano (eje metacarpiano)
    if(BIO.modo==='estatico'){
      if(BIO._estaticoFuente==='foto'){ pintarGonioCtrl(); _recalcEstatico(); return; }   // misma foto: recalcula el nuevo movimiento
      // VIDEO: el cuadro-pico está atado al movimiento ANALIZADO (no vale para otro movimiento). Si conservamos
      // el archivo (P1-11), ofrecemos REANALIZAR el MISMO video para el nuevo movimiento en vez de pedir otra fuente.
      if(BIO.pendingVideo && BIO.pendingVideo.file){
        g.peak=null; g.run=0; BIO._estaticoImg=null;
        if(BIO.canvas && BIO.ctx && BIO._estaticoBase){ try{ BIO.ctx.clearRect(0,0,BIO.canvas.width,BIO.canvas.height); BIO.ctx.drawImage(BIO._estaticoBase,0,0); }catch(_e){} }  // quita el arco viejo (no aplica al nuevo mov)
        var _lv=document.getElementById('bg-live'); if(_lv) _lv.textContent='—';
        var _mx=document.getElementById('bg-max'); if(_mx) _mx.textContent='—';
        pintarGonioCtrl();   // re-pinta con el botón "🔁 Reanalizar este video"
        var _es=document.getElementById('bio-estado'); if(_es) _es.textContent='Cambiaste a '+g.sel.grupo+' '+g.sel.mov+'. Toca "Reanalizar este video" para medirlo, elige un cuadro en la línea de tiempo, o sube otra fuente.';
        return;
      }
      // Sin archivo conservado: comportamiento anterior (pedir otra fuente).
      BIO.modo=null; BIO._estaticoBase=null; BIO._estaticoLm=null; BIO._estaticoImg=null; BIO._estaticoFuente=null;
      mostrarVista('bio-vista-inicio'); pintarGonioInicio();
      toast('Sube otra foto o video para medir '+g.sel.grupo+' '+g.sel.mov,'info'); return;
    }
    if(BIO.modo==='camara'){ pintarGonioCtrl(); return; }
    pintarGonioInicio();   // pantalla de inicio
  }
  function BIO_gonioVolverInicio(){
    BIO.modo=null; BIO._estaticoBase=null; BIO._estaticoLm=null; BIO._estaticoImg=null; BIO._estaticoFuente=null;
    BIO._ed=null; BIO._gxHyst=null; _zoomReset();
    detenerCamaraStream(); detenerLoopCamara();
    mostrarVista('bio-vista-inicio'); pintarGonioInicio();
  }
  // ── (V3.1 P2) SELECCIÓN DE CUADRO EN VIDEO ───────────────────────────────────────────────────────
  // El video conservado (BIO.pendingVideo.file) se puede RECORRER desde el estático: línea de tiempo con
  // la duración real + "cuadro anterior/siguiente" en pasos de ~1/FPS_VIDEO (seek del navegador =
  // APROXIMADO, y así se declara en la UI) + los CANDIDATOS de mejor rango recogidos durante el análisis
  // (tiempo de media y frameId auténticos). Al fijar un cuadro se re-corre Pose — y Hands en muñeca, por
  // el pase estático lazy — SOBRE ESE cuadro exacto; el tiempo sellado es el currentTime REAL tras el seek.
  async function BIO_gonioFijarCuadro(tReq){
    if(BIO._vidFijando) return;
    if(!(BIO.pendingVideo && BIO.pendingVideo.file)){ toast('No hay un video conservado para recorrer','warning'); return; }
    if(!(isFinite(tReq))) return;
    BIO._vidFijando=true;
    var est=document.getElementById('bio-estado'); if(est) est.textContent='Decodificando el cuadro '+(Math.round(tReq*10)/10)+' s…';
    var url=null, v=null;
    try{
      url=URL.createObjectURL(BIO.pendingVideo.file);
      v=document.createElement('video'); v.muted=true; v.setAttribute('playsinline',''); v.setAttribute('webkit-playsinline',''); v.preload='auto'; v.src=url;
      await new Promise(function(res,rej){ var to=setTimeout(function(){ rej(new Error('metadata')); },8000);
        v.onloadedmetadata=function(){ clearTimeout(to); res(); };
        v.onerror=function(){ clearTimeout(to); rej(new Error('video')); }; });
      var dur=(isFinite(v.duration)&&v.duration>0)?v.duration:(BIO._vidDur||0);
      var t=Math.max(0, Math.min(dur>0?dur-0.02:tReq, tReq));
      await new Promise(function(res,rej){ var to=setTimeout(function(){ rej(new Error('seek')); },6000);
        v.onseeked=function(){ clearTimeout(to); res(); };
        try{ v.currentTime=t; }catch(_s){ clearTimeout(to); rej(_s); } });
      var tReal=(v.currentTime!=null)?v.currentTime:t;            // tiempo de media AUTÉNTICO tras el seek
      // cuadro → canvas 2D (fix HEVC/iOS) con la MISMA orientación ganadora del análisis (decúbito)
      var rot=BIO._peakRot||0;
      var tmp=document.createElement('canvas'); tmp.width=v.videoWidth||1; tmp.height=v.videoHeight||1;
      tmp.getContext('2d').drawImage(v,0,0,tmp.width,tmp.height);
      var base=_rotarImgACanvas(tmp, rot, 1000);
      var lm=await _poseSobreEstatico(base);
      BIO._peakTSeg=Math.round(tReal*100)/100;                    // el estático pasa a SER este cuadro
      BIO._peakFrameId=(++BIO._frSeq||(BIO._frSeq=1));
      BIO._peakAdq=Date.now();                                    // (V3.2) adquisición = decodificación de ESTE cuadro
      BIO._estaticoTipoCuadroNext='fijado';
      BIO._estaticoHandsNext=undefined;                           // muñeca: Hands se re-corre sobre ESTE cuadro
      _mostrarGonioEstatico(base, lm, 'video');
      if(!lm) toast('En ese cuadro no se detecta el cuerpo: usa Ajustar puntos o elige otro cuadro','info');
    }catch(e){
      toast('No se pudo decodificar ese cuadro del video','error');
      if(est && BIO.modo==='estatico') est.textContent='No se pudo decodificar el cuadro; sigue mostrado el anterior.';
    }
    finally{
      BIO._vidFijando=false;
      try{ if(v) limpiarVideoSrc(v); }catch(_l){}
      if(url){ try{ URL.revokeObjectURL(url); }catch(_u){} }
    }
  }
  function BIO_gonioCuadroPaso(dir){
    var t=(BIO._peakTSeg!=null?BIO._peakTSeg:0) + (dir<0?-1:1)*(1/FPS_VIDEO);
    BIO_gonioFijarCuadro(Math.max(0, Math.round(t*1000)/1000));
  }
  // Bloque de UI del recorrido de video (línea de tiempo + pasos + candidatos de mejor rango).
  function _gonioVideoUIHTML(){
    if(!(BIO.modo==='estatico' && BIO._estaticoFuente==='video' && BIO.pendingVideo && BIO.pendingVideo.file)) return '';
    var dur=BIO._vidDur||0, t=(BIO._peakTSeg!=null?BIO._peakTSeg:0);
    var paso=Math.round((1/FPS_VIDEO)*1000)/1000;
    var cands=(BIO._vidCands||[]).slice(-6).reverse();
    var chips=cands.map(function(c,i){
      if(c.t==null) return '';
      return '<button class="bio-gtool" style="min-height:36px;padding:5px 10px;font-size:12.5px" onclick="BIO_gonioFijarCuadro('+c.t+')" aria-label="Ir al candidato de '+Math.round(c.val)+' grados">'+(i===0?'Mejor rango · ':'')+Math.round(c.val)+'° · '+_mmss(c.t)+'</button>';
    }).join('');
    return '<div class="bio-gfield" id="bio-gvid">'
      + '<span class="bio-glab">Cuadro del video · '+_mmss(t)+(BIO._estaticoTipoCuadro==='fijado'?' (fijado a mano)':' (mejor rango del análisis)')+'</span>'
      + (dur>0 ? '<input type="range" min="0" max="'+(Math.round(dur*100)/100)+'" step="'+paso+'" value="'+t+'" style="width:100%;accent-color:#E7BB57" aria-label="Línea de tiempo del video" onchange="BIO_gonioFijarCuadro(parseFloat(this.value))">' : '')
      + '<div class="bio-gbtns" style="margin:6px 0 4px">'
      +   '<button class="bio-gtool" style="flex:1" onclick="BIO_gonioCuadroPaso(-1)" aria-label="Cuadro anterior">‹ Cuadro anterior</button>'
      +   '<button class="bio-gtool" style="flex:1" onclick="BIO_gonioCuadroPaso(1)" aria-label="Cuadro siguiente">Cuadro siguiente ›</button>'
      + '</div>'
      + (chips?'<div class="bio-grow" style="margin:2px 0 0">'+chips+'</div>':'')
      + '<div class="gl-metodo">Pasos de ~'+Math.round(1000/FPS_VIDEO)+' ms; el salto de cuadro usa el seek del navegador (aproximado) y el tiempo sellado es el real del video.</div>'
      + '</div>';
  }
  // P1-11: reanaliza el MISMO archivo de video ya subido para el movimiento ACTUAL (recorre el video completo de
  // nuevo; el pico es POR-MOVIMIENTO, NO reutiliza el cuadro-pico de otro movimiento). Conserva las capturas ya hechas.
  function BIO_gonioReanalizarVideo(){
    if(!(BIO.pendingVideo && BIO.pendingVideo.file)){ toast('No hay un video guardado; sube uno nuevo','warning'); mostrarVista('bio-vista-inicio'); pintarGonioInicio(); return; }
    var sel=(BIO.accG&&BIO.accG.sel)||{};
    toast('Reanalizando el video para '+(sel.grupo||'')+' '+(sel.mov||'')+'…','info');
    procesarVideo(BIO.pendingVideo.file);   // g.sel ya es la selección nueva; procesarVideo resetea el pico y re-mide el movimiento actual
  }
  // Cola de VARIOS videos (se eligieron varios de una): procesa el siguiente del lote. Sirve para TODOS
  // los modos. En goniómetro las capturas ya hechas viven en BIO.accG.medidas → se conservan; cada video
  // es una medición/sesión nueva. Si la cola quedó vacía, vuelve a inicio (gonio repinta su selector).
  function BIO_colaSiguiente(){
    if(BIO.videoCola && BIO.videoCola.length){
      var next = BIO.videoCola.shift();
      toast('📹 Siguiente video ('+BIO.videoCola.length+' en cola)'+(BIO.tipoMedicion==='gonio'?'. Elige su articulación/movimiento y captura.':'…'),'info');
      procesarVideo(next);
      return;
    }
    BIO.modo=null; mostrarVista('bio-vista-inicio');
    if(BIO.tipoMedicion==='gonio') pintarGonioInicio();
  }
  // Re-renderiza la IMAGEN ANOTADA desde la TUPLA de medición (cuadro original + landmarks + resultado):
  // una sola fuente para overlay, expediente, miniatura y PDF (V3 P0-1; nunca "captura de pantalla").
  // FOTO: re-render en alta resolución (hasta 2000 px) desde el original con la MISMA orientación.
  // Añade al pie una BARRA DE PROCEDENCIA (fuera de la foto: nunca tapa anatomía): mov · lado · valor · fecha.
  function _renderAnotada(tup){
    var base=tup.base; if(!base || !base.width) return null;
    var src=base, factor=1;
    if(tup.hd && tup.hd.img){
      try{ var hd=_rotarImgACanvas(tup.hd.img, tup.hd.rot||0, 2000);
           if(hd && hd.width>base.width){ src=hd; factor=hd.width/base.width; } }catch(_h){}
    }
    var w=src.width, h=src.height;
    var barH=Math.max(34, Math.min(64, Math.round(w*0.055)));
    var out=document.createElement('canvas'); out.width=w; out.height=h+barH;
    var ctx=out.getContext('2d');
    try{ ctx.drawImage(src,0,0); }catch(_d){ return null; }
    var manual=tup.manualPts ? { A:{x:tup.manualPts.A.x*factor, y:tup.manualPts.A.y*factor},
                                 V:{x:tup.manualPts.V.x*factor, y:tup.manualPts.V.y*factor},
                                 C:{x:tup.manualPts.C.x*factor, y:tup.manualPts.C.y*factor} } : null;
    _trazarGonio(ctx, w, h, tup.lm, tup.grupo, tup.lado, tup.val, tup.r, { manual:manual, k:(w/420) });
    ctx.fillStyle='#122C43'; ctx.fillRect(0,h,w,barH);
    ctx.fillStyle='#E7BB57'; ctx.fillRect(0,h,w,Math.max(2,Math.round(barH*0.055)));
    ctx.textBaseline='middle'; ctx.textAlign='left'; ctx.fillStyle='#FFFFFF';
    ctx.font='700 '+Math.round(barH*0.4)+'px Inter, system-ui, -apple-system, Arial, sans-serif';
    ctx.fillText(tup.grupo+' · '+tup.mov+' · '+(tup.lado==='izq'?'Izquierdo':'Derecho')+' — '+Math.round(tup.val)+'°'
      +(tup.revision==='manual'?' · ajuste manual':'')
      +(tup.protocolo==='proxy-3mcp'?' · proxy 3.er MCP':(tup.protocolo==='lateral-5mcp'?' · lateral 5.º MCP (revisado)':(tup.protocolo==='indice-pose'?' · índice (estimación)':'')))
      +(tup.sinExtremo?' · posición mostrada':''), Math.round(barH*0.4), h+barH/2);
    ctx.textAlign='right'; ctx.fillStyle='rgba(255,255,255,.75)';
    ctx.font='600 '+Math.round(barH*0.28)+'px Inter, system-ui, Arial, sans-serif';
    ctx.fillText('Goniometría 2D · '+fechaHoy(), w-Math.round(barH*0.4), h+barH/2);
    var orig=null;
    try{ orig=document.createElement('canvas'); orig.width=w; orig.height=h; orig.getContext('2d').drawImage(src,0,0); }catch(_o){ orig=null; }
    return { annot:out, orig:orig, dims:{ w:w, h:h }, factor:factor };
  }
  // confirm() nativo con guarda de entorno (en pruebas/vm no existe → se asume confirmado, explícito).
  function _confirmar(msg){ try{ return (typeof confirm==='function') ? confirm(msg) : false; }catch(_e){ return false; } }
  function BIO_gonioCapturar(){ _gonioCapturarCore('pico'); }
  function BIO_gonioCapturarActual(){ _gonioCapturarCore('actual'); }
  // Núcleo de captura (V3 → V3.1): resuelve la TUPLA {cuadro, landmarks, resultado, valor} según fuente y
  // pico/actual — SIEMPRE desde snapshots con identidad de cuadro (raster congelado + frameId), nunca del
  // stream visible; pide CONFIRMACIÓN explícita para fueraTecho, muñeca-índice e hiperextensión (dirección
  // no inferible en 2D); es TRANSACCIONAL: la imagen anotada se construye ANTES de persistir — si no puede
  // construirse, o se guarda explícitamente "sin imagen" (confirmado) o no se guarda nada. El canvas
  // compuesto de pantalla ya NO se usa como fallback (imagen de un cuadro con cifra de otro, prohibido).
  function _gonioCapturarCore(cual){
    var g=BIO.accG; if(!g||!g.sel){ return; }
    if(BIO._ed && BIO._ed.on){ toast('Termina el ajuste: toca "Usar estos puntos" (o Cancelar) antes de capturar','warning'); return; }
    var esEst=(BIO.modo==='estatico'), tup=null;
    if(esEst){
      if(g.peak==null){ toast('No se detecta esa articulación en la imagen; cambia de movimiento/lado, usa Ajustar puntos o sube otra','warning'); return; }
      tup={ base:BIO._estaticoBase, lm:BIO._estaticoLm, r:(BIO._estaticoR||null), val:g.peak, ar:(_ANG_AR||1),
            adq:(BIO._estaticoAdq!=null?BIO._estaticoAdq:null),
            fuente:(BIO._estaticoFuente||'estatico'),
            tSeg:(BIO._estaticoFuente==='video' && BIO._peakTSeg!=null) ? Math.round(BIO._peakTSeg*10)/10 : null,
            frameId:(BIO._estaticoFuente==='video' && BIO._peakFrameId!=null) ? BIO._peakFrameId : null,
            cual:(BIO._estaticoFuente==='video') ? (BIO._estaticoTipoCuadro||'pico') : null,
            // Detección automática anterior a la edición manual: PRESERVAR por separado.
            deteccionOriginal:(BIO._estaticoR ? JSON.parse(JSON.stringify(BIO._estaticoR)) : null),
            manualPts:(BIO._ed && BIO._ed.ok) ? BIO._ed.pts : null,
            manualR:(BIO._ed && BIO._ed.ok) ? BIO._ed.r : null,
            hd:(BIO._estaticoFuente==='foto' && BIO._fotoHD) ? BIO._fotoHD : null };
      if(tup.manualR){ tup.r=tup.manualR; tup.val=tup.manualR.val; }
    } else if(cual==='actual'){
      // (V3.1) "Cuadro actual" = la tupla RETENIDA del último cuadro procesado (raster del pool + landmarks
      // + resultado del MISMO frameId). Ya no se re-copia el elemento de video al momento del click.
      var ret=BIO._frRet;
      if(!(ret && ret.r && ret.r.ok && ret.lm)){ toast('No hay una lectura válida en este cuadro: acomoda la articulación de PERFIL y a cuadro','warning'); return; }
      var cvA=null; try{ cvA=_copiarFrameA(null, ret.fr.cv, 1600); }catch(_c){}
      tup={ base:cvA, lm:ret.lm, r:ret.r, val:ret.r.val, ar:(ret.ar||_ANG_AR||1), fuente:'camara', tSeg:null,
            cual:'actual', frameId:ret.frameId, adq:(ret.adq!=null?ret.adq:null) };
    } else {
      if(g.peak==null){ toast('Mueve la articulación hasta el tope para medir (o captura el cuadro actual)','warning'); return; }
      tup={ base:(BIO._livePeakCv||null), lm:BIO._peakGonioLm, r:(BIO._peakGonioR||null), val:g.peak,
            ar:(BIO._peakGonioAR||_ANG_AR||1), fuente:'camara', tSeg:null, cual:'pico',
            frameId:(BIO._livePeakFrameId!=null?BIO._livePeakFrameId:null),
            adq:(BIO._livePeakAdq!=null?BIO._livePeakAdq:null) };
    }
    // ── Confirmaciones de integridad (V3/V3.1): nunca auto-guardar lo sospechoso, nunca borrar lo real ──
    var rT=tup.r||{}, eSel=_gonioEntry(g.sel.grupo, g.sel.mov);
    var techoSel=(eSel && GONIO_TECHO[eSel.key]!=null) ? GONIO_TECHO[eSel.key] : null;
    var fueraT = !!rT.fueraTecho || (techoSel!=null && tup.val>techoSel);
    if(fueraT){
      if(!_confirmar('⚠️ '+Math.round(tup.val)+'° SUPERA el techo anatómico típico ('+(techoSel!=null?techoSel+'°':'—')+') para '+g.sel.grupo+' '+g.sel.mov+'.\n\nPuede ser un artefacto 2D (escorzo / punto mal detectado) O una alteración real severa.\n\n¿Confirmas VISUALMENTE que la medición es real y quieres guardarla?')) return;
    }
    if(g.sel.grupo==='Muñeca' && rT.eje==='indice-pose' && !tup.manualR){
      if(!_confirmar('🖐 La muñeca se midió contra el ÍNDICE (no se pudo usar el detector de mano / 3.er metacarpiano).\nEs una ESTIMACIÓN de menor confianza: exige mano ABIERTA y palma visible.\n\n¿Confirmas que la mano está abierta y el valor es coherente?')) return;
    }
    // (P0 2026-11-22) Protocolo A (lateral clásico, 5.º metacarpiano): NO es automático — exige la
    // revisión del fisioterapeuta de los puntos (criterio de la auditoría: protocolos no intercambiables).
    if(g.sel.grupo==='Muñeca' && rT.eje==='metacarpiano5-hands' && !tup.manualR){
      if(!_confirmar('Protocolo LATERAL CLÁSICO (eje del 5.º metacarpiano): requiere revisión del fisioterapeuta.\n\n¿Revisaste que el centro de la muñeca y el eje del 5.º metacarpiano están bien ubicados (panel Anatomía / ✋ Ajustar puntos)?')) return;
    }
    // (P0) Alarma de correspondencia muñeca↔mano (0.10–0.12 del antebrazo): medible, pero se confirma.
    if(g.sel.grupo==='Muñeca' && rT.qc && rT.qc.matchAlarma && !tup.manualR){
      if(!_confirmar('⚠️ La muñeca del detector de MANO quedó al límite de correspondencia con la muñeca de POSE ('+Math.round(rT.qc.matchRatio*100)+'% del antebrazo; límite 12%).\n\n¿Revisaste en el panel Anatomía que los puntos caen donde deben?')) return;
    }
    // (V3.1) HIPEREXTENSIÓN: la cámara 2D mide la MAGNITUD de la desviación; el SENTIDO anatómico no es
    // inferible del signo de pantalla → exige confirmación visual del fisioterapeuta antes de persistir.
    if(eSel && eSel.hiperext){
      if(!_confirmar('La cámara 2D mide la MAGNITUD de la desviación respecto a la recta ('+Math.round(tup.val)+'°); la DIRECCIÓN (hiperextensión) no puede firmarla.\n\n¿Confirmas VISUALMENTE que la articulación está en HIPEREXTENSIÓN (no en flexión residual)?')) return;
    }
    var e=eSel, key=_gonioSelKey(g);
    var rev = tup.manualR ? 'manual' : ((fueraT || (g.sel.grupo==='Muñeca' && (rT.eje==='indice-pose' || rT.eje==='metacarpiano5-hands' || (rT.qc&&rT.qc.matchAlarma))) || (eSel&&eSel.hiperext)) ? 'confirmada' : 'auto');
    // (P0 2026-11-22) Estado de la REVISIÓN ANATÓMICA de esta medida (no es validación clínica):
    //  'revisada-fisio' = puntos ajustados a mano; 'confirmada-fisio' = el fisio confirmó un caso dudoso;
    //  'requiere-revision' = quedó pendiente de revisión humana (posición mostrada sin tope confirmado /
    //  calidad baja); 'validada-auto' = gates en verde Y tope dinámico. Nunca "normal/anormal" automático.
    var esEstCap = esEst && (tup.fuente!=='camara');
    var extremoRango = esEstCap ? (BIO._extOk ? 'confirmado-fisio' : 'sin confirmar') : 'pico-dinamico';
    var estadoAnat = (rev==='manual') ? 'revisada-fisio'
                   : (rev==='confirmada') ? 'confirmada-fisio'
                   : (esEstCap && !BIO._extOk) ? 'requiere-revision'
                   : (rT.cortoImg) ? 'requiere-revision'
                   : 'validada-auto';
    // ── TRANSACCIÓN (V3.1): primero la EVIDENCIA, luego la medida — nunca un "éxito" a medias ──
    var rend=null;
    try{
      rend=_renderAnotada({ base:tup.base, lm:tup.lm, r:tup.r, val:tup.val, grupo:g.sel.grupo, mov:g.sel.mov,
                            lado:g.sel.lado, manualPts:tup.manualPts, hd:tup.hd, revision:rev,
                            protocolo:(rT.protocolo||null), sinExtremo:(extremoRango==='sin confirmar') });
    }catch(_e){ rend=null; }
    var sinImagen=false;
    if(!rend || !rend.annot){
      if(!_confirmar('No se pudo construir la imagen de evidencia de este cuadro.\n\n¿Guardar la medición SIN imagen? (quedará registrada explícitamente como "medición sin imagen")')) return;
      sinImagen=true;
    }
    // Puntos EFECTIVOS en px del cuadro de análisis (los mismos que dibujan el arco), para la traza/JSON.
    var pxPts=null;
    try{
      if(tup.base && tup.base.width){
        var pp=_gonioPtsPx(tup.lm, g.sel.grupo, g.sel.lado, tup.r, tup.base.width, tup.base.height, tup.manualPts);
        if(pp) pxPts={ a:{x:Math.round(pp.A.x*10)/10, y:Math.round(pp.A.y*10)/10},
                       v:{x:Math.round(pp.V.x*10)/10, y:Math.round(pp.V.y*10)/10},
                       c:{x:Math.round(pp.C.x*10)/10, y:Math.round(pp.C.y*10)/10}, modo:pp.mode };
      }
    }catch(_pp){}
    // Método de origen de la cifra (trazabilidad): ajuste manual / pose+mano (muñeca metacarpiana) / pose 2D.
    var metodo = tup.manualR ? 'ajuste-manual' : ((rT.eje==='metacarpiano-hands'||rT.eje==='metacarpiano5-hands') ? 'pose+hands-2d' : 'pose-2d');
    g.medidas[key] = { key:g.sel.key, grupo:g.sel.grupo, mov:g.sel.mov, lado:g.sel.lado,
      estadoAnatomico:estadoAnat,
      grado:Math.round(tup.val*10)/10, ref:e.ref, lim:e.lim, defic:!!e.defic, hiperext:!!e.hiperext, normTxt:e.normTxt,
      traza:{ algoVersion:BIO_ALGO_VER, aspect:Math.round(tup.ar*1e4)/1e4,
              fuente:tup.fuente, tSeg:tup.tSeg, cuadro:(tup.cual||null),
              frameId:(tup.frameId!=null?tup.frameId:null),
              seleccion:{ grupo:g.sel.grupo, mov:g.sel.mov, lado:g.sel.lado },
              // valCrudo = PRECISIÓN ORIGINAL del cálculo (1e-6, solo limpia polvo de flotante);
              // "grado" (0.1°) es el valor de PRESENTACIÓN. capturadoEn = momento de pulsar Capturar;
              // adquiridoEnUTC (V3.2) = momento de ADQUISICIÓN/decodificación del raster medido (en
              // cámara/video puede diferir del Capturar: el pico se congeló antes). tSeg = tiempo de media.
              valCrudo:Math.round(tup.val*1e6)/1e6,
              capturadoEn:fechaHoy()+' '+horaAhora(),
              adquiridoEnUTC:(tup.adq!=null ? new Date(tup.adq).toISOString() : null),
              metodo:metodo,
              dims:(tup.base && tup.base.width)?{ w:tup.base.width, h:tup.base.height }:null,
              resExport:(rend && rend.dims)?{ w:rend.dims.w, h:rend.dims.h }:null,
              pxPts:pxPts, revision:rev, dirAnatomica:'porConfirmar',
              // (P0 2026-11-22) revisión anatómica: protocolo de muñeca (no intercambiables), tope de
              // rango (foto estática sin confirmar = "posición mostrada"), gate de correspondencia
              // Pose↔Hands y si los landmarks fueron confirmados por un humano (solo el ajuste ✋ lo es).
              protocolo:(rT.protocolo || (tup.deteccionOriginal&&tup.deteccionOriginal.protocolo) ||
                (g.sel.grupo==='Muñeca' ? (BIO._munProto==='5mcp'?'aproximacion-lateral-5mcp-manual':'proxy-3mcp-manual') : '2d-pose-manual')),
              deteccionOriginal:(tup.deteccionOriginal || null),
              extremoRango:extremoRango,
              qc:{
                matchRatio:(rT.qc?rT.qc.matchRatio:((tup.deteccionOriginal&&tup.deteccionOriginal.qc)?tup.deteccionOriginal.qc.matchRatio:null)),
                matchAlarma:!!((rT.qc&&rT.qc.matchAlarma)||(tup.deteccionOriginal&&tup.deteccionOriginal.qc&&tup.deteccionOriginal.qc.matchAlarma)),
                gateDescartado:(rT.gateDescartado?rT.gateDescartado.rechazo:((tup.deteccionOriginal&&tup.deteccionOriginal.gateDescartado)?tup.deteccionOriginal.gateDescartado.rechazo:null)),
                handsScore:(rT.handsScore!=null?rT.handsScore:((tup.deteccionOriginal&&tup.deteccionOriginal.handsScore!=null)?tup.deteccionOriginal.handsScore:null)),
                notaHandsScore:'Clasificación de lateralidad de la mano; no confianza anatómica por punto'
              },
              anatomiaConfirmada:(rev==='manual'),
              lmUsados:_gonioLmUsados(tup.lm, g.sel.grupo, g.sel.lado, tup.r) } };
    if(fueraT) g.medidas[key].traza.fueraTecho=true;
    if(sinImagen) g.medidas[key].traza.sinImagen=true;
    if(tup.manualR && tup.manualPts){
      g.medidas[key].traza.ajusteHumano={
        tipo:'puntos-corregidos', confirmadoEnUTC:new Date().toISOString(),
        profesional:usuarioActual() || 'sin identificar',
        protocoloFinal:g.medidas[key].traza.protocolo,
        valorOriginal:(tup.deteccionOriginal&&tup.deteccionOriginal.val!=null?tup.deteccionOriginal.val:null),
        valorFinal:tup.val, estado:'revisado-por-profesional-no-validado-con-goniometro'
      };
      g.medidas[key].traza.lmManual={ a:{x:Math.round(tup.manualPts.A.x*10)/10, y:Math.round(tup.manualPts.A.y*10)/10},
                                      v:{x:Math.round(tup.manualPts.V.x*10)/10, y:Math.round(tup.manualPts.V.y*10)/10},
                                      c:{x:Math.round(tup.manualPts.C.x*10)/10, y:Math.round(tup.manualPts.C.y*10)/10} };
    }
    if(g.sel.grupo==='Muñeca' && tup.r){
      if(tup.r.eje) g.medidas[key].eje = tup.r.eje;                 // con qué eje se midió (metacarpiano-hands | indice-pose)
      if(tup.r.cortoImg) g.medidas[key].traza.cortoImg = true;      // brazo/mano muy cortos en imagen → menos fiable
      if(tup.r.dPoseHands!=null){
        // Distancia muñeca Pose↔Hands: la unidad es el espacio NORMALIZADO CON ASPECTO (no px). Se exporta
        // también la equivalencia en px del cuadro de análisis y la proporción respecto al antebrazo.
        g.medidas[key].traza.dPoseHands = tup.r.dPoseHands;
        g.medidas[key].traza.dPoseHandsUnidad = 'norm-aspecto';
        try{
          // En ese espacio (x escalada por w/h) toda distancia × h = píxeles del cuadro de análisis.
          if(tup.base && tup.base.height) g.medidas[key].traza.dPoseHandsPx = Math.round(tup.r.dPoseHands * tup.base.height * 10)/10;
          if(tup.r.antebrazoLen) g.medidas[key].traza.dPoseHandsPropAntebrazo = Math.round((tup.r.dPoseHands/tup.r.antebrazoLen)*100)/100;
        }catch(_dp){}
      }
    }
    if(!sinImagen && rend && rend.annot){
      if(!g.imgs) g.imgs={};
      g.imgs[key] = { canvas:rend.annot, orig:rend.orig, grupo:g.sel.grupo, mov:g.sel.mov, lado:g.sel.lado,
                      grado:g.medidas[key].grado, etq:g.sel.grupo+' '+g.sel.mov+' '+(g.sel.lado==='izq'?'Izq':'Der') };
    } else if(g.imgs && g.imgs[key]){ delete g.imgs[key]; }   // re-captura sin imagen: no dejar evidencia VIEJA pegada a la cifra nueva
    toast('Capturado: '+g.sel.grupo+' '+g.sel.mov+' '+(g.sel.lado==='izq'?'Izq':'Der')+(rev==='manual'?' (ajuste manual)':(sinImagen?' (sin imagen)':'')),'success');
    if(esEst){ pintarGonioCtrl(); _recalcEstatico(); }   // conserva la foto para medir otra
    else { g.peak=null; g.run=0; pintarGonioCtrl(); }
  }
  // Borra una medición Y su evidencia (V3.1: la imagen anotada no puede sobrevivir a su medida).
  // (V3.2) tras borrar, en ESTÁTICO se re-calcula la lectura del cuadro: pintarGonioCtrl → _gonioSelDefault
  // resetea el peak en cada repintado (pre-existente V3/V3.1) y sin este recalc no se podía RE-capturar la
  // misma articulación hasta cambiar la selección (cazado por la evidencia del flujo captura→eliminación).
  function BIO_gonioBorrar(key){ var g=BIO.accG; if(g&&g.medidas[key]){ delete g.medidas[key]; if(g.imgs&&g.imgs[key]) delete g.imgs[key]; pintarGonioCtrl(); if(BIO.modo==='estatico') _recalcEstatico(); } }
  function BIO_gonioFinish(){
    var g=BIO.accG; if(!g || !Object.keys(g.medidas).length){ toast('Captura al menos un ángulo antes de terminar','warning'); return; }
    mostrarResumenGonio();
  }
  function _gonioMedidasArr(g){
    var arr=[]; GONIO_CAT.forEach(function(e){ ['der','izq'].forEach(function(ld){ var m=g.medidas[e.key+'_'+ld]; if(m) arr.push(m); }); });
    return arr;
  }
  // Texto compacto para el campo ROM de la Valoración: "Cadera flex D118°/I120°; Rodilla ..."
  function _gonioTexto(arr){
    var by={}; arr.forEach(function(m){ var k=m.grupo+'|'+m.mov; (by[k]=by[k]||{})[m.lado]=m; });
    var abr={ 'Flexión':'flex', 'Extensión':'ext', 'Dorsiflexión':'DF', 'Plantiflexión':'PF', 'Hiperextensión':'hiperext' };
    function _fmt(m){ return _gonioFmtGrado(m).replace(' (completa)','').replace(' (neutro)','').replace('déficit ','−').replace(' hiperext',''); }
    var partes=[];
    GONIO_JOINTS.forEach(function(gr){
      var segs=[];
      GONIO_CAT.filter(function(e){return e.grupo===gr;}).forEach(function(e){
        var d=by[gr+'|'+e.mov]; if(!d) return;
        var pieces=[];
        if(d.der) pieces.push('D'+_fmt(d.der));
        if(d.izq) pieces.push('I'+_fmt(d.izq));
        if(pieces.length) segs.push((abr[e.mov]||e.mov)+' '+pieces.join('/'));
      });
      if(segs.length) partes.push(gr+' '+segs.join(', '));
    });
    return partes.join('; ');
  }
  function _gonioHallazgos(arr){
    var out=[]; arr.forEach(function(m){ if(_gonioAlerta(m)){
      out.push(m.grupo.toLowerCase()+' '+m.mov.toLowerCase()+' '+(m.lado==='izq'?'izquierda':'derecha')+' '+(m.defic?('con déficit de '+Math.round(m.grado)+'°'):('limitada ('+Math.round(m.grado)+'°, normal '+m.normTxt+')')));
    }});
    return out;
  }
  function mostrarResumenGonio(){
    detenerCamaraStream(); detenerLoopCamara();
    var g=BIO.accG, arr=_gonioMedidasArr(g);
    var by={}; arr.forEach(function(m){ (by[m.key]=by[m.key]||{})[m.lado]=m; });
    function celda(m){ if(!m) return '<span style="color:#9BA3B5">—</span>';
      var col=_gonioAlerta(m)?'#E8C96A':'#3DDC97';
      // (P0) estado de la revisión anatómica por medida: nunca un número sin su estatus.
      var est = (m.estadoAnatomico==='revisada-fisio') ? ' <sup style="color:#3DDC97">✋fisio</sup>'
              : (m.estadoAnatomico==='confirmada-fisio') ? ' <sup style="color:#E8C96A">✋conf</sup>'
              : (m.estadoAnatomico==='requiere-revision') ? ' <sup style="color:#E8C96A">⚠rev</sup>' : '';
      return '<b style="color:'+col+'">'+_gonioFmtGrado(m)+'</b>'+est; }
    var filas=GONIO_CAT.map(function(e){
      var d=by[e.key]||{};
      if(!d.der && !d.izq) return '';
      return '<tr><td class="g">'+esc(e.grupo)+' · '+esc(e.mov)+'</td><td style="text-align:center">'+celda(d.der)+'</td><td style="text-align:center">'+celda(d.izq)+'</td><td style="text-align:center;color:#9BA3B5;font-size:12px">'+esc(e.normTxt)+'</td></tr>';
    }).join('');
    var hall=_gonioHallazgos(arr);
    var interp = hall.length
      ? 'Hallazgos: '+hall.join('; ')+'. El resto de los arcos dentro de rangos de referencia.'
      : 'Todos los arcos medidos se encuentran dentro de rangos de referencia.';
    var cont=document.getElementById('bio-vista-resumen');
    cont.innerHTML =
      '<h3>Resumen — Goniometría de cámara</h3>'
      + '<div style="color:#9BA3B5;font-size:13px;margin-bottom:10px">📷 Cámara · plano sagital · '+arr.length+' medida'+(arr.length===1?'':'s')+'</div>'
      + '<table class="bio-tabla-res"><thead><tr><th>Articulación / movimiento</th><th style="text-align:center">Der</th><th style="text-align:center">Izq</th><th style="text-align:center">Ref. adulto</th></tr></thead><tbody>'+filas+'</tbody></table>'
      + '<div style="margin-top:12px;background:rgba(255,255,255,.05);border-radius:10px;padding:10px 12px;font-size:13px;color:#cfd6e4">'+esc(interp)+'</div>'
      + '<div style="font-size:11px;color:#9BA3B5;margin-top:8px;font-style:italic">Referencia: '+esc(GONIO_CITA)+' · Rangos de referencia de ADULTO, orientativos (no diagnóstico; en pediatría difieren) · Medición 2D (cribado), ±5° en plano; margen estimado, no validado contra goniómetro físico.'
      +   ' · Muñeca: proxy computacional (3.er MCP) o lateral clásico (5.º MCP, revisado) — NO intercambiables.'
      +   ' · <b style="color:#E8C96A">⚠rev = medición NO VALIDADA, requiere revisión manual del fisioterapeuta</b> (posición mostrada sin tope confirmado o calidad limitada); ✋ = puntos revisados/confirmados por el fisio.</div>'
      + '<div style="color:#9BA3B5;font-size:12px;margin-top:10px">Se escribirá en el campo <b>ROM</b> de la Valoración y quedará en Biomecánica.</div>'
      + '<div class="bio-acciones" style="padding-top:14px">'
      +   '<button class="bio-b-sec" onclick="BIO_gonioVolver()">← Seguir midiendo</button>'
      +   '<button class="bio-b-save" id="bio-gonio-guardar" onclick="BIO_gonioGuardar()">💾 Guardar en el expediente</button>'
      + '</div>';
    mostrarVista('bio-vista-resumen');
  }
  function BIO_gonioVolver(){
    // "← Seguir midiendo" desde el resumen: si hubo cámara en vivo, reanúdala; si fue foto/video, vuelve al inicio.
    if(BIO.stream){ BIO.modo='camara'; _zoomReset(); mostrarVista('bio-vista-camara'); try{ BIO.video&&BIO.video.play(); }catch(e){} if(!BIO.rafId) loopCamara(); pintarGonioCtrl(); }
    else { BIO_gonioVolverInicio(); }
  }
  // P1-7: la fuente de la sesión gonio se DERIVA de las trazas por medida (no de si hubo imágenes):
  // todas 'camara' → 'camara'; todas 'foto'/'video' → esa; mezcla → 'mixta'.
  function _fuenteDeTrazas(g){
    var set={}, med=(g&&g.medidas)||{};
    for(var k in med){ var t=med[k]&&med[k].traza, f=(t&&t.fuente)||'camara'; if(f==='estatico') f='foto'; set[f]=1; }
    var ks=Object.keys(set);
    if(ks.length===0) return 'camara';
    if(ks.length===1) return ks[0];
    return 'mixta';
  }
  // ROM de cámara: sustituir SOLO el resumen de cámara, nunca líneas V4 u otras
  // anotaciones del expediente. Maneja también el prefijo antiguo "Goniometría (".
  function _gonioActualizarROM(romPrevio, linea){
    var prev=String(romPrevio||'').split('\n').filter(function(l){
      var t=l.trim();
      return t && !/^Goniometría(?: cámara 2D)? \(/.test(t);
    });
    prev.push(linea);
    return prev.join('\n');
  }
  async function guardarSesionGonio(){
    var p=(typeof currentPatient!=='undefined')?currentPatient:null; if(!p){ toast('Sin paciente activo','error'); return; }
    var g=BIO.accG, arr=_gonioMedidasArr(g);
    if(!arr.length){ toast('Sin medidas que guardar','warning'); return; }
    var btn=document.getElementById('bio-gonio-guardar'); if(btn){ btn.disabled=true; btn.textContent='⏳ Guardando…'; }
    var imagenes = await _subirImagenesGonio(p, g, btn);   // fotos anotadas (foto/cuadro-pico); [] si no hubo o falló (las métricas igual se guardan)
    var fuenteG = _fuenteDeTrazas(g);   // P1-7: derivada de las trazas por medida (camara/foto/video/mixta)
    var sesion={
      id:'bm_'+p.id+'_'+Date.now(), tipo:'goniometria', fuente:fuenteG,
      fecha:fechaHoy(), horaCreacion:horaAhora(), fechaHoraISO:new Date().toISOString(),
      terapeuta:usuarioActual(), convencion:'clinica', plano:'sagital',
      medidas:arr, hallazgos:_gonioHallazgos(arr), cita:GONIO_CITA,
      calidad:{ nMedidas:arr.length }, imagenes:imagenes, video:null, reportePdf:null, eliminado:false
    };
    // Vuelca el resumen de grados al campo ROM de la Valoración (sin borrar lo que el terapeuta escribió;
    // reemplaza solo una línea previa de "Goniometría (" para no acumular en re-mediciones).
    try{
      if(!p.valoracion || typeof p.valoracion!=='object') p.valoracion={};
      // (P0 2026-11-22) La línea de ROM declara el protocolo de muñeca (proxy ≠ goniometría manual) y
      // si quedaron medidas pendientes de revisión — nunca un grado "limpio" de algo no revisado.
      var protos={}; arr.forEach(function(m){ var pr=m.traza&&m.traza.protocolo; if(pr&&m.grupo==='Muñeca') protos[pr]=1; });
      var protoTxt = protos['lateral-5mcp'] ? (protos['proxy-3mcp'] ? '; muñeca: proxy 3.er MCP y lateral 5.º MCP' : '; muñeca: lateral clásico 5.º MCP revisado')
                   : (protos['proxy-3mcp'] ? '; muñeca: proxy computacional 3.er MCP' : (protos['indice-pose'] ? '; muñeca: estimación por índice' : ''));
      var nRev=arr.filter(function(m){ return m.estadoAnatomico==='requiere-revision'; }).length;
      var linea='Goniometría cámara 2D ('+sesion.fecha+', cribado ±5–10°, no validado contra goniómetro físico'+protoTxt+(nRev?('; '+nRev+' medida'+(nRev===1?'':'s')+' SIN validar, requiere'+(nRev===1?'':'n')+' revisión'):'')+'): '+_gonioTexto(arr);
      p.valoracion.rom = _gonioActualizarROM(p.valoracion.rom, linea);
    }catch(e){}
    try{ sesion.calidad.requierenRevision = arr.filter(function(m){ return m.estadoAnatomico==='requiere-revision'; }).length; }catch(_q){}
    await _persistirSesion(p, sesion, btn, 'Goniometría sagital (cámara)');
  }

  function tarjetaGonioHTML(s){
    var by={}; (s.medidas||[]).forEach(function(m){ (by[m.key]=by[m.key]||{})[m.lado]=m; });
    function cel(m){ if(!m||m.grado==null) return '<span style="color:var(--gray-400)">—</span>';
      var al=_gonioAlerta(m), col=al?'#B45309':'var(--green)';
      var est=(m.estadoAnatomico==='requiere-revision') ? ' <span style="font-size:10px;color:#B45309">(requiere revisión)</span>'
            : (m.estadoAnatomico==='revisada-fisio'||m.estadoAnatomico==='confirmada-fisio') ? ' <span style="font-size:10px;color:var(--gray-400)">✋</span>' : '';
      return '<b style="color:'+col+'">'+_gonioFmtGrado(m)+'</b>'+(al?' ⚠️':'')+est; }
    function fila(e){ var d=by[e.key]||{}; if(!d.der&&!d.izq) return '';
      return '<div class="field-row"><div class="field-label">'+esc(e.grupo)+' · '+esc(e.mov)+'</div><div class="field-value" style="display:flex;gap:14px;flex-wrap:wrap">'
        + '<span><b style="color:var(--gray-400);font-weight:600">Der</b> '+cel(d.der)+'</span>'
        + '<span><b style="color:var(--gray-400);font-weight:600">Izq</b> '+cel(d.izq)+'</span>'
        + '<span style="color:var(--gray-400);font-size:12px">'+esc(e.normTxt)+'</span></div></div>'; }
    var filas=GONIO_CAT.map(fila).join('');
    var _imgs=(s.imagenes||[]).filter(function(x){ return x && x.url; });
    var imgHTML = _imgs.length ? ('<div class="field-row"><div class="field-label">Imágenes</div><div class="field-value" style="display:flex;gap:10px;flex-wrap:wrap">'
      + _imgs.map(function(im){ return '<div style="display:inline-block"><a href="'+esc(im.url)+'" target="_blank" rel="noopener" style="text-decoration:none"><img src="'+esc(im.url)+'" alt="'+esc(im.etq||'')+'" style="width:96px;height:96px;object-fit:cover;border-radius:10px;border:1.5px solid var(--gray-200);display:block"><div style="font-size:10px;color:var(--gray-400);text-align:center;max-width:96px;margin-top:2px">'+esc(im.etq||'')+(im.grado!=null?(' '+Math.round(im.grado)+'°'):'')+'</div></a>'+(im.urlOrig?('<a href="'+esc(im.urlOrig)+'" target="_blank" rel="noopener" style="display:block;text-align:center;font-size:10px;color:var(--navy);max-width:96px">ver original</a>'):'')+'</div>'; }).join('')
      + '</div></div>') : '';
    var fuenteLbl = s.fuente==='foto' ? '📷 Foto' : (s.fuente==='video' ? '📁 Video' : (s.fuente==='mixta' ? '🔀 Mixta' : (s.fuente==='imagen' ? '📷 Imagen' : (s.fuente==='v4' ? 'Revisión V4 (manual)' : '📷 Cámara'))));   // P1-7: 'imagen' = sesiones viejas · 'v4' = puente de revisión manual
    var pdfBtn = (s.reportePdf && s.reportePdf.url)
      ? '<button data-url="'+esc(s.reportePdf.url)+'" onclick="window.open(this.dataset.url,\'_blank\')" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer">📄 Ver PDF</button>'
      : '<button data-sid="'+esc(s.id)+'" onclick="BIO_pdf(this.dataset.sid)" style="background:var(--white);color:var(--navy);border:1.5px solid var(--gray-200);border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer">📄 Generar PDF</button>';
    return '<div class="section-card" style="margin-bottom:10px">'
      + '<div class="section-title" style="display:flex;align-items:center;justify-content:space-between">'
      +   '<span>📐 Goniometría · '+esc(s.fecha)+' '+esc(s.horaCreacion||'')+'</span>'
      +   '<span style="font-weight:600;text-transform:none;letter-spacing:0;color:var(--gray-400)">'+fuenteLbl+_syncBadge(s)+' · sagital</span>'
      + '</div>'
      + '<div class="field-row"><div class="field-label">Terapeuta</div><div class="field-value">'+esc(s.terapeuta||'—')+' · '+((s.medidas||[]).length)+' medidas</div></div>'
      + filas
      + imgHTML
      + ((s.hallazgos&&s.hallazgos.length)?('<div class="field-row"><div class="field-label">Hallazgos</div><div class="field-value" style="color:#B45309">'+esc(s.hallazgos.join('; '))+'</div></div>'):'')
      + '<div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;padding:10px 14px">'
      +   pdfBtn
      +   '<button data-sid="'+esc(s.id)+'" onclick="BIO_eliminar(this.dataset.sid)" style="background:var(--red-light);color:var(--red);border:1.5px solid #FCA5A5;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer">🗑️ Eliminar</button>'
      + '</div>'
      + '</div>';
  }
  // PDF de goniometría (mismo estilo que el reporte ROM: encabezado clínica, tabla, interpretación, cita).
  function BIO_construirPDF_gonio(s, p, jsPDFCtor, imgs){
    jsPDFCtor = jsPDFCtor || (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    var doc=new jsPDFCtor({unit:'pt', format:'letter'});
    var W=doc.internal.pageSize.getWidth(), M=40;
    var NAVY=[27,58,107], GOLD=[201,168,76], VERDE=[46,125,82], GRIS=[120,128,148], AMBAR=[180,83,9], INK=[31,41,55];
    try{ doc.setProperties({ title:'Goniometría — '+((p&&p.name)||''), author:'Clínica Sinergia', subject:'Goniometría (plano sagital)' }); }catch(e){}
    doc.setFillColor(NAVY[0],NAVY[1],NAVY[2]); doc.rect(0,0,W,74,'F');
    doc.setFillColor(GOLD[0],GOLD[1],GOLD[2]); doc.rect(0,74,W,4,'F');
    var lg=(typeof window!=='undefined'&&window.BIO_LOGO_DATAURL)?window.BIO_LOGO_DATAURL:null; if(lg){ try{ doc.addImage(lg,'PNG',W-M-54,10,54,54); }catch(e){} }
    doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(18); doc.text('Clínica Sinergia', M, 34);
    doc.setFont('helvetica','normal'); doc.setFontSize(11); doc.text('Reporte de goniometría — Rangos de movimiento (plano sagital)', M, 55);
    var y=100;
    doc.setTextColor(INK[0],INK[1],INK[2]); doc.setFontSize(11);
    doc.text('Paciente: '+((p&&p.name)||'—'), M, y); doc.text('Fecha: '+(s.fecha||''), W-M, y, {align:'right'}); y+=16;
    doc.text('Terapeuta: '+(s.terapeuta||'—'), M, y); doc.text('Método: Goniómetro de cámara (2D)', W-M, y, {align:'right'}); y+=26;
    doc.setFont('helvetica','bold'); doc.setTextColor(NAVY[0],NAVY[1],NAVY[2]); doc.setFontSize(12); doc.text('Rangos de movimiento (grados)', M, y); y+=8;
    doc.setDrawColor(210,216,228); doc.line(M,y,W-M,y); y+=18;
    var cMov=M, cDer=M+320, cIzq=M+400, cNor=M+470;
    doc.setFontSize(10); doc.setTextColor(GRIS[0],GRIS[1],GRIS[2]); doc.setFont('helvetica','bold');
    doc.text('Movimiento', cMov, y); doc.text('Der', cDer, y, {align:'center'}); doc.text('Izq', cIzq, y, {align:'center'}); doc.text('Normal', cNor, y); y+=6;
    doc.setDrawColor(230,234,242); doc.line(M,y,W-M,y); y+=16;
    var by={}; (s.medidas||[]).forEach(function(m){ (by[m.key]=by[m.key]||{})[m.lado]=m; });
    doc.setFontSize(11);
    GONIO_CAT.forEach(function(e){
      var d=by[e.key]||{}; if(!d.der&&!d.izq) return;
      doc.setFont('helvetica','normal'); doc.setTextColor(INK[0],INK[1],INK[2]);
      doc.text(e.grupo+' '+e.mov, cMov, y);
      function pon(m, cx){ if(!m||m.grado==null){ doc.setTextColor(GRIS[0],GRIS[1],GRIS[2]); doc.text('—', cx, y, {align:'center'}); return; }
        var al=_gonioAlerta(m); if(al){ doc.setTextColor(AMBAR[0],AMBAR[1],AMBAR[2]); } else { doc.setTextColor(VERDE[0],VERDE[1],VERDE[2]); }
        doc.setFont('helvetica','bold'); doc.text(_gonioFmtGrado(m).replace(' (completa)',''), cx, y, {align:'center'}); doc.setFont('helvetica','normal'); }
      pon(d.der, cDer); pon(d.izq, cIzq);
      doc.setTextColor(GRIS[0],GRIS[1],GRIS[2]); doc.text(e.normTxt, cNor, y);
      y+=18;
      if(y>720){ doc.addPage(); y=60; }
    });
    // (P0 2026-11-22) Estado de revisión anatómica: el PDF nunca presenta como validado lo no revisado.
    var _nRevPdf=(s.medidas||[]).filter(function(m){ return m.estadoAnatomico==='requiere-revision'; }).length;
    var _protosPdf={}; (s.medidas||[]).forEach(function(m){ var pr=m.traza&&m.traza.protocolo; if(pr&&m.grupo==='Muñeca') _protosPdf[pr]=1; });
    if(_nRevPdf || _protosPdf['proxy-3mcp'] || _protosPdf['lateral-5mcp'] || _protosPdf['indice-pose']){
      y+=2; doc.setFontSize(9);
      if(_nRevPdf){ doc.setTextColor(AMBAR[0],AMBAR[1],AMBAR[2]); doc.setFont('helvetica','bold');
        doc.splitTextToSize('MEDICIÓN NO VALIDADA / REQUIERE REVISIÓN MANUAL: '+_nRevPdf+' medida'+(_nRevPdf===1?'':'s')+' ("posición mostrada" sin tope confirmado por el fisioterapeuta, o calidad limitada). No usar como rango máximo del paciente sin revisión.', W-2*M).forEach(function(ln){ doc.text(ln, M, y); y+=12; });
        doc.setFont('helvetica','normal'); }
      doc.setTextColor(GRIS[0],GRIS[1],GRIS[2]);
      if(_protosPdf['proxy-3mcp'] || _protosPdf['lateral-5mcp'] || _protosPdf['indice-pose']){
        doc.splitTextToSize('Muñeca — convención del eje distal: '+(_protosPdf['proxy-3mcp']?'proxy computacional (3.er metacarpiano, detector de mano); ':'')+(_protosPdf['lateral-5mcp']?'lateral clásico (5.º metacarpiano, revisado por el fisioterapeuta); ':'')+(_protosPdf['indice-pose']?'estimación por índice (menor confianza); ':'')+'las convenciones NO son intercambiables ni equivalen a goniometría manual sin validación.', W-2*M).forEach(function(ln){ doc.text(ln, M, y); y+=12; });
      }
      doc.setFontSize(11); doc.setTextColor(INK[0],INK[1],INK[2]);
      if(y>700){ doc.addPage(); y=60; }
    }
    y+=10; doc.setDrawColor(210,216,228); doc.line(M,y,W-M,y); y+=20;
    doc.setFont('helvetica','bold'); doc.setTextColor(NAVY[0],NAVY[1],NAVY[2]); doc.setFontSize(12); doc.text('Interpretación', M, y); y+=16;
    doc.setFont('helvetica','normal'); doc.setTextColor(INK[0],INK[1],INK[2]); doc.setFontSize(11);
    var hall=(s.hallazgos&&s.hallazgos.length)?('Hallazgos: '+s.hallazgos.join('; ')+'. El resto de los arcos dentro de rangos de referencia.'):'Todos los arcos medidos se encuentran dentro de rangos de referencia, con buena simetría.';
    doc.splitTextToSize(hall, W-2*M).forEach(function(ln){ doc.text(ln, M, y); y+=15; });
    y+=8; doc.setFontSize(9); doc.setTextColor(GRIS[0],GRIS[1],GRIS[2]);
    doc.splitTextToSize('Referencia de rangos: '+GONIO_CITA+' Medición 2D con cámara (cribado); margen ±5° en el plano de la cámara, estimado y no validado contra goniómetro físico. No sustituye la exploración clínica.', W-2*M).forEach(function(ln){ doc.text(ln, M, y); y+=12; });
    // (V3 P2) REGISTRO VISUAL: imágenes anotadas de la sesión (el llamador las baja; fallos → sin página).
    if(imgs && imgs.length){
      doc.addPage();
      doc.setFillColor(NAVY[0],NAVY[1],NAVY[2]); doc.rect(0,0,W,46,'F');
      doc.setFillColor(GOLD[0],GOLD[1],GOLD[2]); doc.rect(0,46,W,3,'F');
      doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(13);
      doc.text('Registro visual — imágenes anotadas', M, 29);
      var colW=(W-2*M-16)/2, maxH=300, yImg=66;
      for(var ii=0; ii<imgs.length; ii+=2){
        var par=[imgs[ii], imgs[ii+1]].filter(Boolean);
        var hs=par.map(function(im){ var ar=im.h/Math.max(1,im.w); return Math.min(maxH, colW*ar); });
        var rowH=Math.max.apply(null, hs);
        if(yImg+rowH+28 > 760){ doc.addPage(); yImg=50; }
        par.forEach(function(im, j){
          var ar=im.h/Math.max(1,im.w), hC=Math.min(maxH, colW*ar), wC=hC/ar;
          var xCol=M + j*(colW+16), x=xCol + (colW-wC)/2;
          try{ doc.addImage(im.dataUrl, (String(im.dataUrl).indexOf('image/png')>=0?'PNG':'JPEG'), x, yImg, wC, hC); }catch(_a){}
          doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(GRIS[0],GRIS[1],GRIS[2]);
          doc.text(String(im.etq||'')+(im.grado!=null?(' · '+Math.round(im.grado)+'°'):''), xCol+colW/2, yImg+hC+12, { align:'center' });
        });
        yImg += rowH+30;
      }
    }
    return doc;
  }
  // Descarga las imágenes anotadas de una sesión de goniometría como dataURL para el PDF (máx 6; cada
  // fallo se salta — el PDF sale igual sin esa imagen, nunca truena por una descarga).
  async function _gonioImgsParaPdf(s){
    var list=((s&&s.imagenes)||[]).filter(function(x){ return x && x.url; }).slice(0,6), out=[];
    for(var i=0;i<list.length;i++){
      try{
        var blob=await Promise.race([
          fetch(list[i].url).then(function(q){ if(!q.ok) throw new Error('http '+q.status); return q.blob(); }),
          new Promise(function(_res, rej){ setTimeout(function(){ rej(new Error('timeout')); }, 8000); })
        ]);
        var du=await new Promise(function(res, rej){ var fr=new FileReader(); fr.onload=function(){ res(fr.result); }; fr.onerror=rej; fr.readAsDataURL(blob); });
        var dim=await new Promise(function(res){ var im=new Image(); im.onload=function(){ res({ w:im.naturalWidth, h:im.naturalHeight }); }; im.onerror=function(){ res(null); }; im.src=du; });
        if(du && dim && dim.w) out.push({ dataUrl:du, w:dim.w, h:dim.h, etq:list[i].etq||'', grado:list[i].grado });
      }catch(_e){}
    }
    return out;
  }

  function renderPestana(p){
    // Catch-up de sync: al abrir la pestaña, empuja a la nube cualquier medición local-only y jala las
    // de otros equipos (unión). Fire-and-forget; si las reglas aún no permiten 'biomecanica', se queda local.
    // CROSS-DEVICE (fix 2026-11-14): corre SIEMPRE, aunque este equipo NO tenga mediciones locales — si no,
    // un equipo que no midió nunca JALA lo que otro equipo guardó (bug "Sin mediciones" en el 2º equipo).
    try{ if(typeof window!=='undefined' && typeof window._syncBiomecanicaFS==='function' && p){ if(!Array.isArray(p.biomecanica)) p.biomecanica=[]; window._syncBiomecanicaFS(p); } }catch(e){}
    var lista = Array.isArray(p.biomecanica) ? p.biomecanica.filter(function(s){ return s && !s.eliminado; }) : [];
    var html = ''
      + '<button class="btn-gold" style="width:100%;margin-bottom:12px;font-size:15px;font-weight:800;border:none;border-radius:var(--radius);padding:14px;cursor:pointer;background:var(--gold);color:var(--navy-dark)" onclick="abrirMedidorBiomecanico()">▶️ Nueva medición ROM</button>';
    if(!lista.length){
      html += '<div style="text-align:center;padding:22px;color:var(--gray-400);font-size:13px">Sin mediciones — toca <b>▶️ Nueva medición ROM</b> para empezar.<br>Mide ROM de brazos (codo y hombro) o analiza una SENTADILLA (valgo de rodilla), con la cámara o subiendo un video.</div>';
      return html;
    }
    if(lista.length>=2){
      html += '<button style="width:100%;margin-bottom:12px;font-size:14px;font-weight:800;border:none;border-radius:var(--radius);padding:12px;cursor:pointer;background:var(--navy);color:#fff" onclick="BIO_comparar()">⚖️ Comparar antes / después</button>';
    }
    var orden = lista.slice().reverse(); // más reciente primero
    html += orden.map(function(s){
      if(s.tipo==='sentadilla') return tarjetaSentHTML(s);
      if(s.tipo==='marcha') return tarjetaMarchaHTML(s);
      if(s.tipo==='goniometria') return tarjetaGonioHTML(s);
      var fuente = s.fuente==='video' ? '📁 Video' : '📷 Cámara';
      var filas = filasSesionHTML(s);
      var pdfBtn = (s.reportePdf && s.reportePdf.url)
        ? '<button data-url="'+esc(s.reportePdf.url)+'" onclick="window.open(this.dataset.url,\'_blank\')" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer">📄 Ver PDF</button>'
        : '<button data-sid="'+esc(s.id)+'" onclick="BIO_pdf(this.dataset.sid)" style="background:var(--white);color:var(--navy);border:1.5px solid var(--gray-200);border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer">📄 Generar PDF</button>';
      var videoBtn = (s.video && s.video.url)
        ? '<button data-url="'+esc(s.video.url)+'" onclick="window.open(this.dataset.url,\'_blank\')" style="background:var(--green);color:#fff;border:none;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer">▶️ Ver video</button>'
        : '';
      return '<div class="section-card" style="margin-bottom:10px">'
        + '<div class="section-title" style="display:flex;align-items:center;justify-content:space-between">'
        +   '<span>🦴 ROM · '+esc(s.fecha)+' '+esc(s.horaCreacion||'')+'</span>'
        +   '<span style="font-weight:600;text-transform:none;letter-spacing:0;color:var(--gray-400)">'+fuente+_syncBadge(s)+'</span>'
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

  // ── COMPARADOR "antes / después" (solo lectura: 2 mediciones lado a lado) ───
  // Elige dos sesiones de p.biomecanica y muestra los videos + los grados con Δ. NO toca el guardado.
  var _CMP_TIPO={ rom:'ROM de brazos', sentadilla:'Sentadilla', marcha:'Marcha', goniometria:'Goniometría' };
  function _cmpTipoLeg(s){ return (s && _CMP_TIPO[s.tipo]) || (s && s.tipo) || 'Medición'; }
  function _cmpSesiones(){
    var p=(typeof currentPatient!=='undefined')?currentPatient:null;
    var lista=(p && Array.isArray(p.biomecanica)) ? p.biomecanica.filter(function(s){ return s && !s.eliminado && s.id; }) : [];
    lista.sort(function(a,b){ return String(b.fechaHoraISO||b.id||'').localeCompare(String(a.fechaHoraISO||a.id||'')); }); // más reciente primero
    return lista;
  }
  // Extrae de una sesión las filas comparables {k,etq,num,disp} según su tipo.
  // dir: sentido clínico de MEJORA para colorear el Δ. 'up' = más es mejor (ROM, flexión), 'down' = menos
  // es mejor (valgo, inclinación, déficit), '' = neutro (no se colorea, solo muestra el cambio).
  function _cmpExtraer(s){
    var out=[], med=Array.isArray(s.medidas)?s.medidas:[];
    if(s.tipo==='goniometria'){
      med.forEach(function(m){ var l=/izq/i.test(m.lado)?'Izq':'Der';
        var dir = m.defic ? 'down' : (m.hiperext ? '' : 'up');   // más ROM mejor; menos déficit mejor; hiperext neutro
        out.push({ k:(m.key||'')+'_'+m.lado, etq:(m.grupo||'')+' '+(m.mov||'')+' '+l, num:(m.grado==null?null:m.grado), disp:_gonioFmtGrado(m), dir:dir, margen:(m.margen!=null?m.margen:5) }); });
    } else if(s.tipo==='sentadilla'){
      var L={ fppa_izq:'Valgo FPPA Izq', fppa_der:'Valgo FPPA Der', mkd_izq:'Desplaz. medial Izq', mkd_der:'Desplaz. medial Der', sep_rodillas:'Separación rodillas', tronco_lateral:'Tronco lateral', sacro_descenso:'Descenso del sacro' };
      var Ds={ fppa_izq:'down', fppa_der:'down', mkd_izq:'down', mkd_der:'down', tronco_lateral:'down' };   // menos valgo/inclinación = mejor
      med.forEach(function(m){ var etq=L[m.key]; if(!etq || m.media==null) return;
        var r=(m.unidad==='ratio'), suf=r?'':(m.unidad==='%'?'%':'°');
        out.push({ k:m.key, etq:etq, num:m.media, disp:(r?m.media.toFixed(2):(_r1(m.media)+suf)), dir:(Ds[m.key]||''), margen:(r?0.1:5), signed:(m.key==='fppa_izq'||m.key==='fppa_der') }); });   // P2-12: fppa es signado (valgo+/varo−)
    } else if(s.tipo==='marcha'){
      if(s.cadencia!=null) out.push({ k:'cadencia', etq:'Cadencia', num:s.cadencia, disp:s.cadencia+' pasos/min', dir:'' });
      if(s.velocidad!=null) out.push({ k:'velocidad', etq:'Velocidad', num:s.velocidad, disp:s.velocidad+' m/s', dir:'up', margen:0.1 });
      var LM={ stance_izq:'Fase apoyo Izq', stance_der:'Fase apoyo Der', rod_pico_izq:'Rodilla pico Izq', rod_pico_der:'Rodilla pico Der', cadera_rom_izq:'Cadera ROM Izq', cadera_rom_der:'Cadera ROM Der' };
      var DM={ rod_pico_izq:'up', rod_pico_der:'up', cadera_rom_izq:'up', cadera_rom_der:'up' };   // más ROM = mejor; apoyo neutro
      med.forEach(function(m){ var etq=LM[m.key]; if(!etq || m.valor==null) return;
        var u=(m.unidad==='m')?' m':(m.unidad==='%'?'%':(m.unidad==='pasos/min'?'':'°'));
        out.push({ k:m.key, etq:etq, num:m.valor, disp:m.valor+u, dir:(DM[m.key]||''), margen:(m.unidad==='m'?0.1:5) }); });
    } else { // rom
      med.forEach(function(m){ var l=/izq/i.test(m.lado)?'Izq':'Der', etq=(m.grupo||'')+' '+(m.mov||'')+' '+l, num, disp;
        if(m.grupo==='Codo'){ num=(m.max!=null?m.max:m.media); disp=(m.min!=null&&m.max!=null)?(m.min+'°–'+m.max+'°'):(num!=null?num+'°':'—'); }
        else { num=(m.media!=null?m.media:m.max); disp=(num!=null?num+'°':'—'); }
        out.push({ k:m.key||etq, etq:etq, num:(num==null?null:num), disp:disp, dir:'up', margen:(m.margen!=null?m.margen:5) }); });   // más ROM = mejor
    }
    return out;
  }
  function _cmpVid(s, etq){
    var fecha=s?esc(s.fecha):'—';
    if(s && s.video && s.video.url){
      return '<div class="cmp-vpanel"><div class="cmp-vlab">'+etq+' · '+fecha+'</div>'
        + '<video controls preload="none" playsinline src="'+esc(s.video.url)+'" style="width:100%;min-height:160px;border-radius:8px;background:#0d1626;display:block"></video></div>';
    }
    var motivo=(s && s.tipo==='goniometria') ? 'el goniómetro no graba video' : 'sin video en esta medición';
    return '<div class="cmp-vpanel"><div class="cmp-vlab">'+etq+' · '+fecha+'</div><div class="cmp-novid">— '+motivo+' —</div></div>';
  }
  function _cmpTablaHTML(A,B){
    if(!A || !B) return '<div style="color:#9BA3B5;font-size:12px">Elige las dos mediciones.</div>';
    var ra=_cmpExtraer(A), rb=_cmpExtraer(B), ma={}, mb={}, keys=[], seen={};
    ra.forEach(function(r){ ma[r.k]=r; if(!seen[r.k]){ seen[r.k]=1; keys.push(r.k); } });
    rb.forEach(function(r){ mb[r.k]=r; if(!seen[r.k]){ seen[r.k]=1; keys.push(r.k); } });
    if(!keys.length) return '<div style="color:#9BA3B5;font-size:12px;padding:8px 0">Estas mediciones no tienen grados para comparar.</div>';
    var filas=keys.map(function(k){ var a=ma[k], b=mb[k];
      var etq=(a&&a.etq)||(b&&b.etq)||k;
      var da=a?esc(a.disp):'<span class="cmp-eq">—</span>', db=b?esc(b.disp):'<span class="cmp-eq">—</span>';
      var dcell='<span class="cmp-eq">—</span>';
      if(a&&b&&a.num!=null&&b.num!=null){ var d=Math.round((b.num-a.num)*10)/10;
        var ar=d>0?'▲':'▼', sg=d>0?'+':'';
        var mg=(b&&b.margen!=null)?b.margen:((a&&a.margen!=null)?a.margen:5);   // P2-12: margen de la métrica (m.margen o 5°)
        var signed=(a&&a.signed)||(b&&b.signed);
        var cruzaSigno = signed && a.num!==0 && b.num!==0 && ((a.num>0)!==(b.num>0));   // FPPA: cruce valgo(+)↔varo(−) NO es mejora directa
        if(cruzaSigno){
          dcell='<span class="cmp-eq" title="Cruzó de valgo a varo (o viceversa): revisar, no es una mejora directa">'+sg+d+' ⚠︎</span>';
        } else if(d===0){ dcell='<span class="cmp-eq">0</span>'; }
        else if(Math.abs(d) < mg){   // P2-12: dentro del margen de error → gris, no se colorea como cambio real
          dcell='<span class="cmp-eq" title="Δ dentro del margen estimado (±'+mg+'); puede ser ruido">'+sg+d+' '+ar+'</span>';
        } else {
          var dir=(b&&b.dir)||(a&&a.dir)||'';   // sentido clínico de mejora
          // 'up' → subir es verde; 'down' → bajar es verde; '' (neutro) → gris, solo muestra el cambio.
          var cls='cmp-eq';
          if(dir==='up') cls=(d>0?'cmp-up':'cmp-dn');
          else if(dir==='down') cls=(d>0?'cmp-dn':'cmp-up');
          dcell='<span class="'+cls+'">'+sg+d+' '+ar+'</span>';
        }
      }
      return '<tr><td>'+esc(etq)+'</td><td class="n">'+da+'</td><td class="n">'+db+'</td><td class="n">'+dcell+'</td></tr>';
    }).join('');
    var avA=(A.calidad&&A.calidad.algoVersion)||null, avB=(B.calidad&&B.calidad.algoVersion)||null;
    var bannerVer = (avA&&avB&&avA!==avB)
      ? '<div style="background:#FEF3C7;border:1px solid #FCD34D;color:#92400E;font-size:11px;padding:6px 9px;border-radius:8px;margin-bottom:8px">⚠️ Versiones de algoritmo distintas (A: '+esc(avA)+' · B: '+esc(avB)+'): la comparación puede no ser directa.</div>'
      : '';
    var pie = '<div style="color:#9BA3B5;font-size:11px;margin-top:8px">Δ en gris = dentro del margen estimado (±5–10°, no validado contra goniómetro físico) o cruce de signo (valgo↔varo): posible ruido, revisar.</div>';
    return bannerVer + '<table class="cmp-tbl"><thead><tr><th>Movimiento</th><th class="n">Antes</th><th class="n">Después</th><th class="n">Δ</th></tr></thead><tbody>'+filas+'</tbody></table>' + pie;
  }
  function _cmpOpt(ses, selId){
    return ses.map(function(s){ var sel=(s.id===selId)?' selected':'', vid=(s.video&&s.video.url)?' · 🎥':'';
      return '<option value="'+esc(s.id)+'"'+sel+'>'+esc(s.fecha)+' '+esc(s.horaCreacion||'')+' · '+esc(_cmpTipoLeg(s))+vid+'</option>'; }).join('');
  }
  function _cmpInjectStyle(){
    if(document.getElementById('bio-cmp-style')) return;
    var st=document.createElement('style'); st.id='bio-cmp-style';
    st.textContent='#bio-cmp-overlay{position:fixed;inset:0;z-index:100000;background:#F4F6F9;overflow:auto;-webkit-overflow-scrolling:touch}'
      +'.cmp-head{position:sticky;top:0;background:var(--navy,#1B3A6B);color:#fff;display:flex;align-items:center;gap:10px;padding:12px 14px;z-index:2}'
      +'.cmp-head b{font-size:15px}.cmp-x{margin-left:auto;background:rgba(255,255,255,.18);border:none;color:#fff;width:32px;height:32px;border-radius:8px;font-size:17px;cursor:pointer}'
      +'.cmp-body{padding:12px 14px 48px;max-width:900px;margin:0 auto}'
      +'.cmp-sels{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}'
      +'.cmp-sel label{display:block;font-size:11px;font-weight:800;color:var(--navy,#1B3A6B);margin-bottom:3px}'
      +'.cmp-sel select{width:100%;padding:8px;border:1.5px solid #CFDDF2;border-radius:8px;font-size:12px;background:#fff}'
      +'.cmp-vids{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}'
      +'.cmp-vpanel{background:#fff;border:1px solid #E3E8F0;border-radius:10px;padding:8px}'
      +'.cmp-vlab{font-size:11px;font-weight:800;color:var(--navy,#1B3A6B);margin-bottom:6px}'
      +'.cmp-novid{background:#0d1626;color:#9BA3B5;border-radius:8px;padding:30px 10px;text-align:center;font-size:12px}'
      +'.cmp-tbl{width:100%;border-collapse:collapse;background:#fff;border:1px solid #E3E8F0;border-radius:10px;overflow:hidden;font-size:12.5px}'
      +'.cmp-tbl th{background:var(--navy,#1B3A6B);color:#fff;padding:7px 9px;text-align:left;font-size:11px}'
      +'.cmp-tbl th.n,.cmp-tbl td.n{text-align:center}'
      +'.cmp-tbl td{padding:7px 9px;border-top:1px solid #EEF1F6}'
      +'.cmp-tbl tr:nth-child(even) td{background:#FAFBFD}'
      +'.cmp-up{color:#2E7D52;font-weight:800}.cmp-dn{color:#B23B3B;font-weight:800}.cmp-eq{color:#9BA3B5}';
    document.head.appendChild(st);
  }
  function _cmpRender(){
    var ov=document.getElementById('bio-cmp-overlay'); if(!ov || !BIO.cmp) return;
    var p=(typeof currentPatient!=='undefined')?currentPatient:null, ses=_cmpSesiones();
    var A=ses.filter(function(s){return s.id===BIO.cmp.idA;})[0]||null;
    var B=ses.filter(function(s){return s.id===BIO.cmp.idB;})[0]||null;
    var nombre=(p&&p.name)?esc(p.name):'Paciente', distinto=(A&&B&&A.tipo!==B.tipo);
    ov.innerHTML=
      '<div class="cmp-head"><span style="font-size:18px">⚖️</span><b>Comparar — '+nombre+'</b><button class="cmp-x" onclick="BIO_cmpCerrar()">✕</button></div>'
      +'<div class="cmp-body">'
      +'<div style="font-size:11.5px;color:#667085;margin-bottom:10px">Elige dos mediciones para ver el <b>antes</b> y el <b>después</b> (videos + grados).</div>'
      +'<div class="cmp-sels"><div class="cmp-sel"><label>🅰️ Antes</label><select onchange="BIO_cmpSel(\'a\',this.value)">'+_cmpOpt(ses,BIO.cmp.idA)+'</select></div>'
      +'<div class="cmp-sel"><label>🅱️ Después</label><select onchange="BIO_cmpSel(\'b\',this.value)">'+_cmpOpt(ses,BIO.cmp.idB)+'</select></div></div>'
      +'<div class="cmp-vids">'+_cmpVid(A,'Antes')+_cmpVid(B,'Después')+'</div>'
      +(distinto?('<div style="background:#FFF4E5;border:1px solid #F3D9A8;color:#8A5E0C;border-radius:8px;padding:8px 10px;font-size:11.5px;margin-bottom:10px">⚠️ Son de <b>distinto tipo</b> ('+esc(_cmpTipoLeg(A))+' vs '+esc(_cmpTipoLeg(B))+'). Los videos se comparan, pero los grados solo cambian si eliges el <b>mismo tipo</b>.</div>'):'')
      +_cmpTablaHTML(A,B)
      +'<div style="font-size:10.5px;color:#9BA3B5;margin-top:8px">Δ = Después − Antes. ▲ subió · ▼ bajó (interpreta según el movimiento: en ROM más suele ser mejor; en un déficit, menos es mejor).</div>'
      +'</div>';
  }
  function BIO_comparar(){
    var ses=_cmpSesiones();
    if(ses.length<2){ toast('Necesitas al menos 2 mediciones guardadas','warning'); return; }
    var B=ses[0], A=null, i;
    for(i=1;i<ses.length;i++){ if(ses[i].tipo===B.tipo){ A=ses[i]; break; } }
    if(!A) A=ses[1];
    BIO.cmp={ idA:A.id, idB:B.id };
    var ov=document.getElementById('bio-cmp-overlay');
    if(!ov){ _cmpInjectStyle(); ov=document.createElement('div'); ov.id='bio-cmp-overlay'; document.body.appendChild(ov); }
    ov.style.display='block'; _cmpRender();
  }
  function BIO_cmpSel(which, id){ if(!BIO.cmp) return; if(which==='a') BIO.cmp.idA=id; else BIO.cmp.idB=id; _cmpRender(); }
  function BIO_cmpCerrar(){ var ov=document.getElementById('bio-cmp-overlay'); if(!ov) return;
    try{ var vs=ov.querySelectorAll('video'); for(var i=0;i<vs.length;i++){ try{ vs[i].pause(); }catch(e){} } }catch(e){}
    ov.style.display='none'; ov.innerHTML=''; }

  // ── PDF de una sesión (bajo demanda; sube a Storage y guarda la url) ───────
  // ROM normal de referencia (grados) por movimiento — guía clínica, no diagnóstico.
  function _refNormal(grupo, mov){
    return ({ 'Codo·Flexión':145, 'Hombro·Flexión':180, 'Hombro·Extensión':60, 'Hombro·Abducción':180, 'Cuello·Lateralización':45 })[grupo+'·'+mov] || null;
  }
  // Construye el REPORTE PDF (función pura, sin subir): encabezado de clínica, tarjeta de paciente,
  // tabla con referencia normal y barra ROM, nota de interpretación y pie. Devuelve el doc jsPDF.
  function BIO_construirPDF(s, p, jsPDFCtor){
    jsPDFCtor = jsPDFCtor || (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    var doc=new jsPDFCtor({unit:'pt', format:'letter'});
    var W=doc.internal.pageSize.getWidth(), H=doc.internal.pageSize.getHeight(), M=40;
    var NAVY=[27,58,107], GOLD=[201,168,76], VERDE=[46,125,82], GRIS=[120,128,148];
    try{ doc.setProperties({ title:'Reporte ROM — '+((p&&p.name)||''), author:'Clínica Sinergia', subject:'Evaluación biomecánica (ROM)' }); }catch(e){}
    // Encabezado
    doc.setFillColor(NAVY[0],NAVY[1],NAVY[2]); doc.rect(0,0,W,74,'F');
    doc.setFillColor(GOLD[0],GOLD[1],GOLD[2]); doc.rect(0,74,W,4,'F');
    var logo = (typeof window!=='undefined' && window.BIO_LOGO_DATAURL) ? window.BIO_LOGO_DATAURL : null;
    if(logo){ try{ doc.addImage(logo,'PNG', W-M-54, 10, 54, 54); }catch(e){} }
    doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(21);
    doc.text('Clínica Sinergia', M, 36);
    doc.setFont('helvetica','normal'); doc.setFontSize(11); doc.setTextColor(GOLD[0],GOLD[1],GOLD[2]);
    doc.text('Evaluación biomecánica · Rango de movimiento (ROM)', M, 56);
    // Título
    var y=100;
    doc.setTextColor(NAVY[0],NAVY[1],NAVY[2]); doc.setFont('helvetica','bold'); doc.setFontSize(13);
    doc.text('Reporte de evaluación — Rango de movimiento articular', M, y);
    // Tarjeta paciente
    y+=14; var cardH=72;
    doc.setFillColor(247,248,250); doc.setDrawColor(221,225,234); doc.roundedRect(M,y,W-2*M,cardH,6,6,'FD');
    var colA=M+16, colB=M+(W-2*M)/2+8, cy=y+22;
    function campo(label,val,cx,vy){
      doc.setFontSize(8); doc.setTextColor(150,158,181); doc.setFont('helvetica','bold'); doc.text(String(label).toUpperCase(), cx, vy);
      doc.setFontSize(10.5); doc.setTextColor(45,51,68); doc.setFont('helvetica','normal'); doc.text(String(val==null||val===''?'—':val), cx, vy+14);
    }
    campo('Paciente', (p&&p.name)||'—', colA, cy);
    campo('Edad · Sexo', (((p&&p.age!=null)?p.age+' años':'—')+((p&&p.sexo)?(' · '+p.sexo):'')), colB, cy);
    campo('Fecha · Hora', (s.fecha||'—')+'   '+(s.horaCreacion||''), colA, cy+32);
    campo('Terapeuta', s.terapeuta||'—', colB, cy+32);
    y+=cardH+16;
    // Método
    doc.setFont('helvetica','italic'); doc.setFontSize(8.5); doc.setTextColor(GRIS[0],GRIS[1],GRIS[2]);
    var metodo='Convención clínica (0° = neutro). ROM = media de los picos de cada repetición (± = consistencia entre reps). '
             + 'Fuente: '+(s.fuente==='video'?'video':'cámara en vivo')+' · '+(s.duracionSeg||0)+' s · '+((s.calidad&&s.calidad.framesValidos)||0)+' cuadros válidos.';
    var metodoL=doc.splitTextToSize(metodo, W-2*M);
    doc.text(metodoL, M, y);
    y+=metodoL.length*11+3;
    // Tabla
    var cMov=M+6, cLado=M+150, cRom=M+186, cMejor=M+254, cReps=M+306, cRef=M+380, cBar=M+452, barW=(W-M)-cBar, rowH=22;
    doc.setFillColor(NAVY[0],NAVY[1],NAVY[2]); doc.rect(M,y,W-2*M,20,'F');
    doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(9);
    doc.text('Movimiento',cMov,y+14); doc.text('Lado',cLado,y+14); doc.text('ROM',cRom,y+14);
    doc.text('Mejor',cMejor,y+14); doc.text('Reps',cReps,y+14); doc.text('Ref.',cRef,y+14); doc.text('ROM vs ref.',cBar,y+14);
    y+=20;
    var filas=[];
    if(Array.isArray(s.medidas)){
      var by=medidasPorKey(s.medidas);
      FILAS.forEach(function(f){
        ['izq','der'].forEach(function(ld){
          var m=by[f[ld]]; if(!m) return;
          filas.push({ etq:f.etq, lado:ld==='izq'?'Izq':'Der', d:m, grupo:m.grupo, movn:m.mov, primero:ld==='izq' });
        });
      });
    } else {
      var a=s.articulaciones||{};
      [['Codo','codoIzq','codoDer'],['Hombro','hombroIzq','hombroDer']].forEach(function(g){
        filas.push({etq:g[0],lado:'Izq',d:a[g[1]],grupo:g[0],movn:'',primero:true});
        filas.push({etq:g[0],lado:'Der',d:a[g[2]],grupo:g[0],movn:'',primero:false});
      });
    }
    function _pdfCampos(d){
      if(d && d.media!=null){
        var rom=(d.grupo==='Codo')?(d.min+'°–'+d.max+'°'):(d.media+'°');
        return { rom:rom, mejor:(d.mejor!=null?d.mejor+'°':'—'), reps:(d.reps?(d.reps+(d.de!=null?('  ±'+d.de+'°'):'')):'—'), rango:d.rango };
      }
      if(d && d.min!=null) return { rom:(d.min+'°–'+d.max+'°'), mejor:(d.max!=null?d.max+'°':'—'), reps:'—', rango:d.rango };  // sesión vieja
      return { rom:'—', mejor:'—', reps:'—', rango:null };
    }
    doc.setFont('helvetica','normal'); doc.setFontSize(9.5);
    filas.forEach(function(r,i){
      if(i%2===1){ doc.setFillColor(245,247,250); doc.rect(M,y,W-2*M,rowH,'F'); }
      var cx=_pdfCampos(r.d);
      if(r.primero){ doc.setFont('helvetica','bold'); doc.setTextColor(45,51,68); doc.text(r.etq, cMov, y+15); doc.setFont('helvetica','normal'); }
      doc.setTextColor(GRIS[0],GRIS[1],GRIS[2]); doc.text(r.lado, cLado, y+15);
      doc.setFont('helvetica','bold'); doc.setTextColor(VERDE[0],VERDE[1],VERDE[2]); doc.text(cx.rom, cRom, y+15); doc.setFont('helvetica','normal');
      doc.setTextColor(45,51,68); doc.text(cx.mejor, cMejor, y+15);
      doc.setTextColor(GRIS[0],GRIS[1],GRIS[2]); doc.text(cx.reps, cReps, y+15);
      var ref=_refNormal(r.grupo,r.movn);
      doc.text(ref?('0–'+ref+'°'):'—', cRef, y+15);
      if(ref && cx.rango!=null){
        var frac=Math.max(0,Math.min(1,cx.rango/ref));
        doc.setFillColor(230,233,239); doc.roundedRect(cBar,y+7,barW,8,3,3,'F');
        var c = frac>=0.8?VERDE : frac>=0.5?GOLD : [192,57,43];
        doc.setFillColor(c[0],c[1],c[2]); doc.roundedRect(cBar,y+7,Math.max(3,barW*frac),8,3,3,'F');
      }
      doc.setDrawColor(230,233,239); doc.line(M,y+rowH,W-M,y+rowH);
      y+=rowH;
    });
    y+=16;
    // Nota de interpretación
    doc.setFillColor(254,243,199); doc.setDrawColor(240,214,120); doc.roundedRect(M,y,W-2*M,66,6,6,'FD');
    doc.setTextColor(120,90,20); doc.setFont('helvetica','bold'); doc.setFontSize(8.5); doc.text('Nota de interpretación', M+12, y+16);
    doc.setFont('helvetica','normal'); doc.setTextColor(90,74,30);
    var nota='ROM = media de los picos de cada repetición; ± indica la consistencia entre repeticiones (menor = más fiable). Estimado por pose con una sola cámara. Margen honesto: abducción, codo y cuello (en el plano de la cámara) ±5°; flexión y extensión de hombro (fuera del plano de frente) ±10° — para finura, capturar de PERFIL. Diferencias entre sesiones menores a ~8° pueden ser ruido. Cribado y seguimiento; no sustituye la goniometría manual.';
    doc.text(doc.splitTextToSize(nota, W-2*M-24), M+12, y+30);
    y+=72;
    // Referencias clínicas (fuentes reales)
    doc.setFont('helvetica','italic'); doc.setFontSize(6.8); doc.setTextColor(150,158,181);
    var refsR='Referencias: hombro flexión y abducción 0–180°, codo 0–145° (AAOS; Norkin & White, Measurement of Joint Motion, F.A. Davis, 5.ª ed., 2016; Neumann, Kinesiology of the Musculoskeletal System, Elsevier, 3.ª ed., 2017). Lateralización cervical 0–45° por lado (AAOS; Norkin & White, 2016; normas por edad con CROM: Youdas et al., Physical Therapy 1992;72(11):770–780).';
    doc.text(doc.splitTextToSize(refsR, W-2*M), M, y);
    // Pie
    var fy=H-38;
    doc.setDrawColor(GOLD[0],GOLD[1],GOLD[2]); doc.setLineWidth(1.2); doc.line(M,fy,W-M,fy); doc.setLineWidth(1);
    doc.setFontSize(8); doc.setTextColor(150,158,181);
    doc.text('Clínica Sinergia · Generado automáticamente el '+fechaHoy()+(usuarioActual()?(' · '+usuarioActual()):''), M, fy+14);
    doc.text('Página 1 de 1', W-M-52, fy+14);
    return doc;
  }
  // Reporte PDF de SENTADILLA (frontal). imgs opcional: {tray, sacro, rodillas} dataURLs para la 2ª página.
  function BIO_construirPDF_sent(s, p, jsPDFCtor, imgs){
    jsPDFCtor = jsPDFCtor || (window.jspdf && window.jspdf.jsPDF) || window.jsPDF; imgs=imgs||{};
    var doc=new jsPDFCtor({unit:'pt', format:'letter'});
    var W=doc.internal.pageSize.getWidth(), H=doc.internal.pageSize.getHeight(), M=40;
    var NAVY=[27,58,107], GOLD=[201,168,76], VERDE=[46,125,82], GRIS=[120,128,148];
    try{ doc.setProperties({ title:'Sentadilla — '+((p&&p.name)||''), author:'Clínica Sinergia', subject:'Análisis de sentadilla (frontal)' }); }catch(e){}
    function encab(sub){
      doc.setFillColor(NAVY[0],NAVY[1],NAVY[2]); doc.rect(0,0,W,74,'F'); doc.setFillColor(GOLD[0],GOLD[1],GOLD[2]); doc.rect(0,74,W,4,'F');
      var lg=(typeof window!=='undefined'&&window.BIO_LOGO_DATAURL)?window.BIO_LOGO_DATAURL:null; if(lg){ try{ doc.addImage(lg,'PNG',W-M-54,10,54,54); }catch(e){} }
      doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(21); doc.text('Clínica Sinergia',M,36);
      doc.setFont('helvetica','normal'); doc.setFontSize(11); doc.setTextColor(GOLD[0],GOLD[1],GOLD[2]); doc.text(sub,M,56);
    }
    function pie(n,tot){ var fy=H-38; doc.setDrawColor(GOLD[0],GOLD[1],GOLD[2]); doc.setLineWidth(1.2); doc.line(M,fy,W-M,fy); doc.setLineWidth(1);
      doc.setFontSize(8); doc.setTextColor(150,158,181); doc.text('Clínica Sinergia · '+fechaHoy()+(usuarioActual()?(' · '+usuarioActual()):''),M,fy+14); doc.text('Página '+n+' de '+tot,W-M-52,fy+14); }
    var vf=(s.vistas&&s.vistas.frontal)||{}, nReps=vf.nReps||0, cal=s.calibracion||{};
    var tieneVis=!!(imgs.tray||imgs.sacro||imgs.rodillas), tot=tieneVis?2:1;
    encab('Análisis de sentadilla · Vista frontal');
    var y=100; doc.setTextColor(NAVY[0],NAVY[1],NAVY[2]); doc.setFont('helvetica','bold'); doc.setFontSize(13);
    doc.text('Reporte de sentadilla — valgo dinámico y descenso', M, y);
    y+=14; var cardH=72; doc.setFillColor(247,248,250); doc.setDrawColor(221,225,234); doc.roundedRect(M,y,W-2*M,cardH,6,6,'FD');
    var colA=M+16, colB=M+(W-2*M)/2+8, cy=y+22;
    function campo(l,v,cx,vy){ doc.setFontSize(8); doc.setTextColor(150,158,181); doc.setFont('helvetica','bold'); doc.text(String(l).toUpperCase(),cx,vy);
      doc.setFontSize(10.5); doc.setTextColor(45,51,68); doc.setFont('helvetica','normal'); doc.text(String(v==null||v===''?'—':v),cx,vy+14); }
    campo('Paciente',(p&&p.name)||'—',colA,cy); campo('Edad · Sexo',(((p&&p.age!=null)?p.age+' años':'—')+((p&&p.sexo)?(' · '+p.sexo):'')),colB,cy);
    campo('Fecha · Hora',(s.fecha||'—')+'   '+(s.horaCreacion||''),colA,cy+32); campo('Terapeuta',s.terapeuta||'—',colB,cy+32);
    y+=cardH+16;
    doc.setFont('helvetica','italic'); doc.setFontSize(8.5); doc.setTextColor(GRIS[0],GRIS[1],GRIS[2]);
    var met='Análisis 2D de pose, vista frontal · '+(nReps===1?'1 repetición':nReps+' repeticiones')+'. FPPA a media bajada; desplazamiento medial (MKD) y separación en el fondo. '+(cal.estaturaCm?('Escala por estatura '+cal.estaturaCm+' cm (±10%).'):'Sin estatura: valores en % de estatura.');
    var metL=doc.splitTextToSize(met,W-2*M); doc.text(metL,M,y); y+=metL.length*11+8;
    var by={}; (s.medidas||[]).forEach(function(m){by[m.key]=m;});
    function val(m){ if(!m||m.media==null) return '—'; if(m.unidad==='ratio') return m.media.toFixed(2); return _r1(m.media)+(m.unidad==='%'?'%':'°'); }
    function extTxt(m,e){ if(!m||m.extremo==null) return ''; return e+' '+(m.unidad==='ratio'?m.extremo.toFixed(2):(_r1(m.extremo)+(m.unidad==='%'?'%':'°'))); }
    var filas=[ {et:'Valgo dinámico FPPA',iz:by.fppa_izq,de:by.fppa_der,ref:'valgo <10°',e:'peor'},
      {et:'Desplaz. medial MKD (fondo)',iz:by.mkd_izq,de:by.mkd_der,ref:'menor = mejor',e:'peor'},
      {et:'Separación rodillas/tobillos',u:by.sep_rodillas,ref:'>= 0.90',e:'mín'},
      {et:'Tronco lateral (fondo)',u:by.tronco_lateral,ref:'< 10°',e:'máx'},
      {et:'Descenso del sacro',u:by.sacro_descenso,ref:'—',e:'máx'} ];
    var cEt=M+6, cIz=M+206, cDe=M+300, cRef=M+400, rowH=24;
    doc.setFillColor(NAVY[0],NAVY[1],NAVY[2]); doc.rect(M,y,W-2*M,20,'F');
    doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(9);
    doc.text('Métrica',cEt,y+14); doc.text('Izquierda',cIz,y+14); doc.text('Derecha',cDe,y+14); doc.text('Referencia',cRef,y+14); y+=20;
    doc.setFontSize(9.5);
    filas.forEach(function(f,i){
      if(i%2===1){ doc.setFillColor(245,247,250); doc.rect(M,y,W-2*M,rowH,'F'); }
      doc.setFont('helvetica','bold'); doc.setTextColor(45,51,68); doc.text(f.et,cEt,y+15); doc.setFont('helvetica','normal');
      function celda(m,cx){ var col=(m&&!m.confiable)?GRIS:VERDE; doc.setFont('helvetica','bold'); doc.setTextColor(col[0],col[1],col[2]); doc.text(val(m),cx,y+14); doc.setFont('helvetica','normal');
        doc.setTextColor(GRIS[0],GRIS[1],GRIS[2]); doc.setFontSize(7.5); doc.text(extTxt(m,f.e),cx,y+21); if(m&&m.media!=null&&!m.confiable){ doc.setTextColor(180,83,9); doc.text('baja conf.',cx+40,y+21); } doc.setFontSize(9.5); }
      if(f.u!==undefined) celda(f.u,cIz); else { celda(f.iz,cIz); celda(f.de,cDe); }
      doc.setTextColor(GRIS[0],GRIS[1],GRIS[2]); doc.text(f.ref||'—',cRef,y+14);
      doc.setDrawColor(230,233,239); doc.line(M,y+rowH,W-M,y+rowH); y+=rowH;
    });
    y+=16;
    if((s.porRep||[]).length){
      doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(NAVY[0],NAVY[1],NAVY[2]); doc.text('Descenso del sacro por repetición',M,y); y+=10;
      var reps=s.porRep, chW=W-2*M, chH=86, byy=y, maxD=Math.max.apply(null,reps.map(function(r){return (cal.estaturaCm?r.descCm:r.descPct)||0;}))||1;
      var slot=(chW-16)/reps.length, bw=Math.min(46,slot-10);
      doc.setDrawColor(230,233,239); doc.line(M,byy+chH-12,W-M,byy+chH-12);
      reps.forEach(function(r,i){ var d=(cal.estaturaCm?r.descCm:r.descPct)||0, bh=Math.max(2,(d/maxD)*(chH-20)), x=M+8+i*slot;
        doc.setFillColor(NAVY[0],NAVY[1],NAVY[2]); doc.rect(x,byy+chH-12-bh,bw,bh,'F');
        doc.setTextColor(45,51,68); doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.text((cal.estaturaCm?(r.descCm+' cm'):(r.descPct+'%')),x,byy+chH-15-bh);
        doc.setTextColor(GRIS[0],GRIS[1],GRIS[2]); doc.setFont('helvetica','normal'); doc.text('#'+r.n,x+bw/2-5,byy+chH); });
      y+=chH+12;
    }
    doc.setFillColor(254,243,199); doc.setDrawColor(240,214,120); doc.roundedRect(M,y,W-2*M,72,6,6,'FD');
    doc.setTextColor(120,90,20); doc.setFont('helvetica','bold'); doc.setFontSize(8.5); doc.text('Nota de interpretación',M+12,y+16);
    doc.setFont('helvetica','normal'); doc.setTextColor(90,74,30);
    var nota='FPPA = valgo dinámico de rodilla (hacia adentro); valores altos o asimétricos sugieren control deficiente. La abducción/valgo en plano frontal es lo más confiable de la cámara 2D (FPPA: SEM ~3°, cambio mínimo detectable ~8°). La comparación VÁLIDA es el paciente contra sí mismo entre sesiones con el mismo montaje; NO se compara contra normas de sentadilla unipodal ni de laboratorio. El cm es aproximado (±10%). Cribado y seguimiento; no sustituye la evaluación clínica ni sistemas 3D (Kinect/optoelectrónicos).';
    doc.text(doc.splitTextToSize(nota,W-2*M-24),M+12,y+30); y+=78;
    doc.setFont('helvetica','italic'); doc.setFontSize(6.8); doc.setTextColor(GRIS[0],GRIS[1],GRIS[2]);
    var refsS='Referencias: FPPA — Willson & Davis, JOSPT 2008;38(10):606–615; fiabilidad Munro, Herrington & Carolan, J Sport Rehabil 2012;21(1):7–11, y Herrington & Alenezi, J Electromyogr Kinesiol 2017;34:80–85 (SEM ~2–3°, MDC ~7–9°). Valgo frontal 2D como cribado: McLean et al., Br J Sports Med 2005;39(6):355–362. Sin umbral normativo único — comparación intra-sujeto.';
    doc.text(doc.splitTextToSize(refsS,W-2*M),M,y);
    pie(1,tot);
    if(tieneVis){
      doc.addPage(); encab('Reconstrucción y gráficas del movimiento'); var y2=100;
      doc.setTextColor(NAVY[0],NAVY[1],NAVY[2]); doc.setFont('helvetica','bold'); doc.setFontSize(13); doc.text('Reconstrucción y gráficas',M,y2); y2+=18;
      var iw=190, ih=Math.min(320, iw/0.5625);
      if(imgs.tray){ doc.addImage(imgs.tray,'PNG',M,y2,iw,ih); doc.setFontSize(9); doc.setTextColor(GRIS[0],GRIS[1],GRIS[2]); doc.setFont('helvetica','normal'); doc.text('Trayectorias',M,y2+ih+12); }
      var gx=M+iw+22, gw=W-M-gx, gh=Math.min(150, gw*0.62);
      if(imgs.sacro){ doc.addImage(imgs.sacro,'PNG',gx,y2,gw,gh); doc.setTextColor(GRIS[0],GRIS[1],GRIS[2]); doc.text('Descenso del sacro (cm)',gx,y2+gh+11); }
      if(imgs.rodillas){ doc.addImage(imgs.rodillas,'PNG',gx,y2+gh+24,gw,gh); doc.text('Rodillas vs línea media (cm)',gx,y2+gh+24+gh+11); }
      pie(2,2);
    }
    return doc;
  }
  async function BIO_pdf(sid){
    var p=(typeof currentPatient!=='undefined')?currentPatient:null; if(!p) return;
    var s=(p.biomecanica||[]).find(function(x){return x.id===sid;}); if(!s) return;
    if(s.tipo==='sentadilla'){
      if(s.reportePdf && s.reportePdf.url){ window.open(s.reportePdf.url,'_blank'); return; }
      var jsC=(window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
      if(!jsC){ toast('jsPDF no disponible','error'); return; }
      toast('Generando PDF…','');
      try{
        var paq=await _cargarTray(sid, s), im={};
        if(paq && paq.puntos && paq.n){
          var fnd=(s.trayectorias&&s.trayectorias.fondo!=null)?s.trayectorias.fondo:Math.floor(paq.n/2);
          im.tray=_reconImg(paq,'tray',360,640,fnd); im.sacro=_reconImg(paq,'sacro',560,380,0); im.rodillas=_reconImg(paq,'rodillas',560,380,0);
        }
        var pd=BIO_construirPDF_sent(s, p, jsC, im), bl=pd.output('blob'), t2=Date.now();
        if(typeof fbStorage!=='undefined' && fbStorage){
          var sf='sentadilla_'+String(p.name||'paciente').replace(/[^\w]/g,'_')+'_'+t2+'.pdf', pt='clinica/sinergia/'+p.id+'/biomecanica/'+t2+'_'+sf, rf=fbStorage.ref(pt);
          await rf.put(new File([bl],sf,{type:'application/pdf'}),{contentType:'application/pdf'});
          var u2=await rf.getDownloadURL(); s.reportePdf={ url:u2, fbPath:pt, fecha:fechaHoy(), generadoPor:usuarioActual() };
          if(typeof saveDB==='function'){ try{ await saveDB('pts',[p]); }catch(e){} }
          if(typeof renderExpediente==='function') renderExpediente('biomecanica');
          window.open(u2,'_blank'); toast('✅ PDF generado','success');
        } else { pd.save('sentadilla_'+t2+'.pdf'); }
      }catch(e){ console.error('[BIO] PDF sentadilla',e); toast('❌ No se pudo generar el PDF: '+(e.message||''),'error'); }
      return;
    }
    if(s.tipo==='goniometria'){
      if(s.reportePdf && s.reportePdf.url){ window.open(s.reportePdf.url,'_blank'); return; }
      var jsG=(window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
      if(!jsG){ toast('jsPDF no disponible','error'); return; }
      toast('Generando PDF…','');
      try{
        var imgsPdf=[]; try{ imgsPdf=await _gonioImgsParaPdf(s); }catch(_ip){ imgsPdf=[]; }   // V3 P2: página de registro visual
        var pg=BIO_construirPDF_gonio(s, p, jsG, imgsPdf), blg=pg.output('blob'), tg=Date.now();
        if(typeof fbStorage!=='undefined' && fbStorage){
          var sfg='goniometria_'+String(p.name||'paciente').replace(/[^\w]/g,'_')+'_'+tg+'.pdf', ptg='clinica/sinergia/'+p.id+'/biomecanica/'+tg+'_'+sfg, rfg=fbStorage.ref(ptg);
          await rfg.put(new File([blg],sfg,{type:'application/pdf'}),{contentType:'application/pdf'});
          var ug=await rfg.getDownloadURL(); s.reportePdf={ url:ug, fbPath:ptg, fecha:fechaHoy(), generadoPor:usuarioActual() };
          if(typeof saveDB==='function'){ try{ await saveDB('pts',[p]); }catch(e){} }
          if(typeof renderExpediente==='function') renderExpediente('biomecanica');
          window.open(ug,'_blank'); toast('✅ PDF generado','success');
        } else { pg.save('goniometria_'+tg+'.pdf'); }
      }catch(e){ console.error('[BIO] PDF goniometría',e); toast('❌ No se pudo generar el PDF: '+(e.message||''),'error'); }
      return;
    }
    if(s.reportePdf && s.reportePdf.url){ window.open(s.reportePdf.url,'_blank'); return; }
    var jsPDFCtor=(window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    if(!jsPDFCtor){ toast('jsPDF no disponible','error'); return; }
    toast('Generando PDF…','');
    try{
      var pdf=BIO_construirPDF(s, p, jsPDFCtor);
      var blob=pdf.output('blob'); var ts=Date.now();
      if(typeof fbStorage!=='undefined' && fbStorage){
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
      } else { pdf.save('rom_'+ts+'.pdf'); }
    }catch(e){ console.error('[BIO] PDF error',e); toast('❌ No se pudo generar el PDF: '+(e.message||''),'error'); }
  }

  function BIO_eliminar(sid){
    var p=(typeof currentPatient!=='undefined')?currentPatient:null; if(!p || !Array.isArray(p.biomecanica)) return;
    if(!window.confirm('¿Eliminar esta medición biomecánica?')) return;
    var s=p.biomecanica.find(function(x){return x.id===sid;});
    if(!s) return;
    // Borrado SUAVE (no splice): así la unión al sincronizar no lo resucita y el borrado es duradero.
    s.eliminado=true; s.eliminadoPor=usuarioActual(); s.eliminadoEn=new Date().toISOString();
    p.fechaActualizacion=fechaHoy(); p.ultimoUsuario=usuarioActual();
    if(typeof saveDB==='function'){ saveDB('pts',[p]).then(function(){}).catch(function(){}); }
    // Propaga el tombstone (eliminado:true) a los demás equipos por la vía de unión.
    try{ if(typeof window!=='undefined' && typeof window._syncBiomecanicaFS==='function'){ window._syncBiomecanicaFS(p); } }catch(e){}
    if(typeof renderExpediente==='function') renderExpediente('biomecanica');
    toast('Medición eliminada','');
  }

  // ── Logo de la clínica para el encabezado del PDF (emblema recortado, fondo transparente) ──
  try{ if(typeof window!=='undefined' && !window.BIO_LOGO_DATAURL) window.BIO_LOGO_DATAURL="data:image/png;base64,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"; }catch(e){}

  // ── Exponer al ámbito global (usados por index.html) ───────────────────────
  // ═══════════ V4 · PUENTE A LA HERRAMIENTA DE REVISIÓN ANATÓMICA (SINERGIA BIOMECHANICS V4) ═══════════
  // La app V4 (./biomecanica-v4/, mismo origen, offline, sin dependencias) es el instrumento MANUAL:
  // foto + 3 puntos (A proximal · B centro articular · C distal) colocados y confirmados por el
  // fisioterapeuta. El widget (./SINERGIA_V4_WIDGET.js, cargado BAJO DEMANDA) solo abre el iframe y
  // publica 'sinergia:medicion-revisada' — NO escribe nada. AQUÍ se conecta al flujo REAL de guardado:
  // overlay de confirmación del profesional → medida/sesión del esquema probado (p.biomecanica,
  // tipo 'goniometria', fuente 'v4') → imagen de evidencia a Storage (NUNCA base64 al doc) →
  // saveDB verificado + _syncBiomecanicaFS + línea de ROM. Nunca guardado automático.
  var V4_URL='./biomecanica-v4/index.html';
  var _V4_MOV={ 'elbow-flexion':'cod_flex', 'elbow-extension':'cod_ext', 'elbow-hyperextension':'cod_hext',
                'wrist-flexion':'mun_flex', 'wrist-extension':'mun_ext' };
  function _v4CargarWidget(){
    return new Promise(function(res,rej){
      if(window.SinergiaV4Bridge){ res(); return; }
      var s=document.createElement('script'); s.src='./SINERGIA_V4_WIDGET.js';
      s.onload=function(){ if(window.SinergiaV4Bridge){ res(); } else { rej(new Error('widget sin API')); } };
      s.onerror=function(){ rej(new Error('no cargó el widget V4')); };
      document.head.appendChild(s);
    });
  }
  function BIO_v4Abrir(){
    _v4CargarWidget().then(function(){ window.SinergiaV4Bridge.open(V4_URL); })
      .catch(function(){ toast('No se pudo abrir la herramienta V4 (sin conexión o versión sin V4)','error'); });
  }
  function _v4Descargar(nombre, href){ var a=document.createElement('a'); a.href=href; a.download=nombre; document.body.appendChild(a); a.click(); setTimeout(function(){ try{ a.remove(); }catch(_e){} },800); }
  // Exporta el PAR exacto que V4 acepta: el raster ANALIZADO como PNG + su detección Pose(+Hands) en el
  // formato de SINERGIA_CORE.proposeFromDetector ({cuadro:{w,h,rot:0}, pose33, manos}, coords normalizadas
  // de ESE raster). Las dimensiones del JSON son las del PNG descargado → en V4 se carga ESA foto y se
  // importa el JSON; si no coinciden, V4 lo rechaza por diseño (FRAME_DIMENSION_MISMATCH). La propuesta
  // NO certifica anatomía: V4 obliga a revisar A/B/C antes de capturar.
  function BIO_v4ExportarPar(){
    try{
      if(BIO.modo!=='estatico' || !BIO._estaticoBase || !BIO._estaticoLm){ toast('Primero analiza una foto o fija un cuadro de video','warning'); return; }
      var cv=BIO._estaticoBase, ts=Date.now();
      var manos=(BIO._estaticoHandsLm && BIO._estaticoHandsLm.length)
        ? BIO._estaticoHandsLm.map(function(h){ return (h||[]).map(function(q){ return { x:q.x, y:q.y }; }); }) : [];
      var det={ motor:'mediapipe-pose'+(manos.length?'+hands':''), algoVersion:BIO_ALGO_VER,
                cuadro:{ w:cv.width, h:cv.height, rot:0 },
                pose33:BIO._estaticoLm.map(function(q){ return { x:q.x, y:q.y, visibility:(q&&q.visibility!=null?q.visibility:null) }; }),
                manos:manos };
      _v4Descargar('v4_cuadro_'+ts+'.png', cv.toDataURL('image/png'));
      _v4Descargar('v4_deteccion_'+ts+'.json', 'data:application/json;charset=utf-8,'+encodeURIComponent(JSON.stringify(det)));
      toast('Se descargaron el cuadro (PNG) y la detección (JSON). En V4: carga ESA foto y usa "Importar propuesta Pose+Hands".','info');
      BIO_v4Abrir();
    }catch(e){ toast('No se pudo exportar el par para V4','error'); }
  }
  // Recepción de una medición REVISADA en V4. Cola simple: cada captura del fisio en V4 llega aquí y
  // se muestra UNA pantalla de confirmación a la vez; nada se guarda sin tocar "Guardar al expediente".
  try{ if(typeof window!=='undefined' && typeof window.addEventListener==='function'){
    window.addEventListener('sinergia:medicion-revisada', function(ev){ try{ _v4Recibir(ev.detail); }catch(e){ console.warn('[BIO-V4]', e&&e.message); } });
  } }catch(_v4L){}
  // Contrato de la medición entrante: volver a calcular desde A-B-C en el HOST.
  // El ángulo y el estado de revisión no deben depender únicamente de los campos
  // declarados por un iframe. No sustituye la revisión anatómica humana.
  function _v4ComprobarRegistro(rec){
    if(!rec || !rec.selection || !_V4_MOV[rec.selection.movement] || !rec.image ||
       !rec.calculation || !rec.calculation.pointsPx || !rec.evidence ||
       rec.evidence.manualReviewed!==true || rec.evidence.therapistConfirmation!==true)
      return {ok:false,reason:'REGISTRO_INCOMPLETO_O_NO_REVISADO'};
    var w=Number(rec.image.width), h=Number(rec.image.height);
    if(!(w>0 && h>0 && Number.isFinite(w) && Number.isFinite(h))) return {ok:false,reason:'DIMENSIONES_INVALIDAS'};
    var p=rec.calculation.pointsPx, ks=['A','B','C'];
    for(var i=0;i<3;i++){
      var q=p[ks[i]];
      if(!q || !Number.isFinite(q.x) || !Number.isFinite(q.y) || q.x<0 || q.x>w || q.y<0 || q.y>h)
        return {ok:false,reason:'PUNTO_FUERA_DE_IMAGEN'};
    }
    var ax=p.B.x-p.A.x, ay=p.B.y-p.A.y, bx=p.C.x-p.B.x, by=p.C.y-p.B.y;
    if(Math.hypot(ax,ay)<1e-7 || Math.hypot(bx,by)<1e-7) return {ok:false,reason:'SEGMENTO_DEGENERADO'};
    var calculated=Math.abs(Math.atan2(ax*by-ay*bx,ax*bx+ay*by))*180/Math.PI;
    var raw=Number(rec.calculation.degreeRaw), shown=Number(rec.calculation.degreeDisplay);
    if(!Number.isFinite(raw) || !Number.isFinite(shown) || Math.abs(raw-calculated)>0.02 ||
       Math.abs(shown-Math.round(calculated*10)/10)>0.051)
      return {ok:false,reason:'ANGULO_NO_COINCIDE_CON_EJES'};
    if(!['derecho','izquierdo','der','izq'].includes(rec.selection.side))return {ok:false,reason:'LATERALIDAD_INVALIDA'};
    if(!rec.selection.protocol || typeof rec.selection.protocol!=='string')return {ok:false,reason:'PROTOCOLO_AUSENTE'};
    if(rec.selection.movement==='elbow-hyperextension' && rec.evidence.directionConfirmed!==true)
      return {ok:false,reason:'HIPEREXTENSION_NO_CONFIRMADA'};
    return {ok:true,angulo:calculated};
  }
  // Mantiene las mediciones de OTROS movimientos y lados al actualizar valoracion.rom.
  // El expediente completo continúa preservándose en p.biomecanica[]; en ROM se
  // reemplaza únicamente el último valor del MISMO movimiento y lado.
  function _v4ActualizarROM(romPrevio, claveMovimiento, lado, linea){
    var prefijo='Goniometría revisada V4 ['+claveMovimiento+':'+lado+']';
    var prev=String(romPrevio||'').split('\n').filter(function(l){
      var t=l.trim(); return t && t.indexOf(prefijo)!==0;
    });
    prev.push(prefijo+' '+linea);
    return prev.join('\n');
  }
  function _v4Recibir(rec){
    var check=_v4ComprobarRegistro(rec);
    if(!check.ok){toast('Medición V4 rechazada: '+check.reason,'error');return;}
    // Congelar el destino clínico ANTES de encolar. Una nueva selección de
    // paciente nunca puede redirigir esta medición a otro expediente.
    var p=(typeof currentPatient!=='undefined')?currentPatient:null;
    if(!p || p.id==null){toast('Abre primero el expediente del paciente','error');return;}
    var sellado=Object.assign({},rec,{_v4PacienteId:String(p.id),_v4PacienteNombre:String(p.name||p.id)});
    if(!BIO._v4Cola) BIO._v4Cola=[];
    BIO._v4Cola.push(sellado);
    if(!document.getElementById('bio-v4-conf')) _v4MostrarConfirmacion();
  }
  function _v4MostrarConfirmacion(){
    var rec=BIO._v4Cola && BIO._v4Cola[0]; if(!rec) return;
    var p=(typeof currentPatient!=='undefined')?currentPatient:null;
    var pacienteCoincide=!!(p && rec._v4PacienteId && String(p.id)===rec._v4PacienteId);
    var key=_V4_MOV[rec.selection.movement];
    var e=null; for(var i=0;i<GONIO_CAT.length;i++){ if(GONIO_CAT[i].key===key){ e=GONIO_CAT[i]; break; } }
    var lado=(rec.selection.side==='izquierdo'||rec.selection.side==='izq')?'izq':'der';
    var val=rec.calculation.degreeDisplay;
    var tch=null; try{ tch=_gonioTecho(e.grupo, e.mov, val); }catch(_t){ tch=null; }
    var fueraT=!!(tch && tch.fueraTecho);
    var maxOk=!!(rec.evidence && rec.evidence.maxConfirmed);
    var avisos=[];
    if(!pacienteCoincide) avisos.push('El expediente activo cambió desde que se capturó esta medición. Regresa al paciente original o descarta.');
    if(!maxOk) avisos.push('Posición mostrada en la foto — NO demuestra el tope de movimiento.');
    if(fueraT) avisos.push(Math.round(val)+'° supera el techo típico ('+tch.techo+'°): revisa que los puntos estén bien colocados; guardar pedirá confirmación.');
    if(e && e.hiperext && !(rec.evidence && rec.evidence.directionConfirmed)) avisos.push('Hiperextensión SIN confirmación visual de dirección en V4 — no se puede guardar.');
    avisos.push('Fotogoniometría 2D revisada manualmente; NO validada contra goniómetro físico.');
    var img=(typeof rec.evidencePng==='string' && rec.evidencePng.indexOf('data:image/')===0)?rec.evidencePng:null;
    var host=document.createElement('div'); host.id='bio-v4-conf';
    host.style.cssText='position:fixed;inset:0;z-index:100001;background:rgba(10,24,38,.72);display:flex;align-items:center;justify-content:center;padding:14px';
    host.innerHTML =
      '<div style="background:#fff;border-radius:16px;max-width:430px;width:100%;max-height:92vh;overflow:auto;padding:16px 16px 14px;box-shadow:0 18px 50px rgba(0,0,0,.35)">'
      + '<div style="font:800 15px/1.3 system-ui;color:#122C43">Medición revisada en V4</div>'
      + '<div style="font:600 12px/1.4 system-ui;color:#5a6b7c;margin:2px 0 10px">'+(p?('Expediente: '+String(p.name||p.id)):'SIN expediente abierto — abre el paciente para poder guardar')+'</div>'
      + (img?('<img src="'+img+'" alt="Evidencia V4" style="width:100%;border-radius:12px;border:1.5px solid #dce3e9;display:block">'):'<div style="font:600 12px system-ui;color:#B45309;border:1.5px dashed #E7BB57;border-radius:10px;padding:10px">Sin imagen de evidencia en el registro (se confirmará guardar sin imagen).</div>')
      + '<div style="display:flex;align-items:baseline;gap:10px;margin:10px 0 2px"><div style="font:900 34px system-ui;color:#122C43;font-variant-numeric:tabular-nums">'+(Math.round(val*10)/10).toFixed(1)+'°</div>'
      + '<div style="font:700 13px system-ui;color:#122C43">'+esc(e?e.grupo:'')+' · '+esc(e?e.mov:'')+' · '+(lado==='izq'?'Izquierdo':'Derecho')+'</div></div>'
      + '<div style="font:600 11.5px/1.5 system-ui;color:#5a6b7c">Protocolo: '+esc(String(rec.selection.protocol||'—'))+' · puntos colocados y revisados por el profesional en V4 (revisada-fisio)</div>'
      + '<ul style="margin:8px 0 0;padding-left:18px">'+avisos.map(function(a){ return '<li style="font:600 11.5px/1.5 system-ui;color:#8a5e0c">'+esc(a)+'</li>'; }).join('')+'</ul>'
      + '<div id="bio-v4-est" style="font:700 12px system-ui;color:#122C43;margin-top:8px"></div>'
      + '<div style="display:flex;gap:10px;margin-top:12px">'
      +   '<button id="bio-v4-save" style="flex:1;min-height:46px;background:#E7BB57;color:#122C43;border:0;border-radius:12px;font:800 14px system-ui;cursor:pointer">Guardar al expediente</button>'
      +   '<button id="bio-v4-desc" style="flex:1;min-height:46px;background:#fff;color:#122C43;border:1.5px solid #dce3e9;border-radius:12px;font:800 14px system-ui;cursor:pointer">Descartar</button>'
      + '</div>'
      + ((BIO._v4Cola.length>1)?('<div style="font:600 11px system-ui;color:#5a6b7c;margin-top:8px">'+(BIO._v4Cola.length-1)+' medición(es) más en espera de revisión.</div>'):'')
      + '</div>';
    document.body.appendChild(host);
    var noGuardable = !pacienteCoincide || !e || (e.hiperext && !(rec.evidence && rec.evidence.directionConfirmed));
    var bS=document.getElementById('bio-v4-save'); if(bS){ if(noGuardable){ bS.disabled=true; bS.style.opacity='.45'; bS.style.cursor='not-allowed'; } else { bS.onclick=function(){ _v4Guardar(); }; } }
    var bD=document.getElementById('bio-v4-desc'); if(bD) bD.onclick=function(){ _v4CerrarConf(true); };
  }
  function _v4CerrarConf(avanzar){
    var h=document.getElementById('bio-v4-conf'); if(h){ try{ h.remove(); }catch(_e){} }
    if(avanzar && BIO._v4Cola && BIO._v4Cola.length){ BIO._v4Cola.shift(); }
    if(BIO._v4Cola && BIO._v4Cola.length) _v4MostrarConfirmacion();
  }
  function _v4CanvasDeDataURL(dataUrl){
    return new Promise(function(res){ try{
      var im=new Image();
      im.onload=function(){ try{ var c=document.createElement('canvas'); c.width=im.width; c.height=im.height; c.getContext('2d').drawImage(im,0,0); res(c); }catch(_e){ res(null); } };
      im.onerror=function(){ res(null); };
      im.src=dataUrl;
    }catch(_e){ res(null); } });
  }
  // Núcleo de persistencia del puente: el MISMO esquema/plomería probados de _persistirSesion (push a
  // p.biomecanica + historial + saveDB verificado + sync FS + repintar), SIN la cola del medidor (que
  // cierra el overlay del medidor; aquí el medidor puede no estar abierto).
  async function _v4Persistir(p, sesion){
    if(!Array.isArray(p.biomecanica)) p.biomecanica=[];
    if(!sesion.calidad || typeof sesion.calidad!=='object') sesion.calidad={};
    if(!sesion.calidad.algoVersion) sesion.calidad.algoVersion=BIO_ALGO_VER;
    if(sesion._estadoSync==null){ sesion._estadoSync='local'; sesion._estadoSyncFecha=null; }
    p.biomecanica.push(sesion);
    if(!Array.isArray(p.historialCambios)) p.historialCambios=[];
    p.historialCambios.push({ usuario:usuarioActual(), seccion:'biomecanica', fecha:sesion.fecha+' '+sesion.horaCreacion, accion:'Goniometría revisada (V4)', antes:'', despues:'Goniometría revisada (V4)' });
    p.fechaActualizacion=fechaHoy(); p.ultimoUsuario=usuarioActual();
    var okSave=false;
    try{ var res=(typeof saveDB==='function') ? await saveDB('pts',[p]) : { ok:false }; okSave=!!(res && res.ok); }catch(_e){ okSave=false; }
    try{ if(typeof window!=='undefined' && typeof window._syncBiomecanicaFS==='function'){ await window._syncBiomecanicaFS(p); } }catch(_s){}
    return okSave;
  }
  async function _v4Guardar(){
    var rec=BIO._v4Cola && BIO._v4Cola[0]; if(!rec) return;
    var p=(typeof currentPatient!=='undefined')?currentPatient:null;
    if(!p){ toast('Sin paciente activo','error'); return; }
    if(!rec._v4PacienteId || String(p.id)!==rec._v4PacienteId){
      toast('Paciente cambiado: la medición V4 NO se guardó en un expediente distinto','error');return;
    }
    var verificacion=_v4ComprobarRegistro(rec);
    if(!verificacion.ok){toast('Medición alterada o inválida: '+verificacion.reason,'error');return;}
    var key=_V4_MOV[rec.selection.movement];
    var e=null; for(var i=0;i<GONIO_CAT.length;i++){ if(GONIO_CAT[i].key===key){ e=GONIO_CAT[i]; break; } }
    if(!e){ toast('Movimiento V4 sin equivalente','error'); return; }
    var lado=(rec.selection.side==='izquierdo'||rec.selection.side==='izq')?'izq':'der';
    var val=rec.calculation.degreeDisplay;
    var tch=null; try{ tch=_gonioTecho(e.grupo, e.mov, val); }catch(_t){ tch=null; }
    var fueraT=!!(tch && tch.fueraTecho);
    if(fueraT && !_confirmar('⚠️ '+Math.round(val)+'° supera el techo típico de '+e.grupo+' '+e.mov+' ('+tch.techo+'°).\n\n¿Confirmas que los puntos están bien colocados y el valor es real?')) return;
    var maxOk=!!(rec.evidence && rec.evidence.maxConfirmed);
    var btn=document.getElementById('bio-v4-save'); if(btn){ btn.disabled=true; btn.textContent='⏳ Guardando…'; }
    var est=document.getElementById('bio-v4-est');
    var med={ key:key, grupo:e.grupo, mov:e.mov, lado:lado, estadoAnatomico:'revisada-fisio',
      grado:Math.round(val*10)/10, ref:e.ref, lim:e.lim, defic:!!e.defic, hiperext:!!e.hiperext, normTxt:e.normTxt,
      traza:{ algoVersion:BIO_ALGO_VER, motorV4:(rec.engine||'sinergia-fotogonio-4'), fuente:'v4',
        metodo:'v4-manual-revisado', seleccion:{ grupo:e.grupo, mov:e.mov, lado:lado },
        valCrudo:(rec.calculation.degreeRaw!=null ? Math.round(rec.calculation.degreeRaw*1e6)/1e6 : null),
        capturadoEn:fechaHoy()+' '+horaAhora(), creadoEnV4:(rec.createdAt||null),
        dims:(rec.image && rec.image.width)?{ w:rec.image.width, h:rec.image.height }:null,
        frameId:(rec.frameId!=null?rec.frameId:null), tSeg:(rec.mediaTime!=null?rec.mediaTime:null),
        fuenteV4:(rec.source||null),
        pxPts:(rec.calculation.pointsPx ? { a:rec.calculation.pointsPx.A, v:rec.calculation.pointsPx.B, c:rec.calculation.pointsPx.C, modo:'v4-manual' } : null),
        protocolo:(rec.selection.protocol||null), revision:'manual', anatomiaConfirmada:true,
        dirAnatomica:(rec.evidence && rec.evidence.directionConfirmed)?'confirmada-visual':'porConfirmar',
        extremoRango:(maxOk?'confirmado':'sin confirmar'), warningsV4:(rec.calculation.warnings||[]),
        deteccionOriginal:((rec.evidence && rec.evidence.detectorOriginal)||null),
        estadoV4:(rec.status||null),
        ajusteHumano:{ tipo:'puntos-colocados-v4', confirmadoEnUTC:new Date().toISOString(),
          profesional:usuarioActual()||'sin identificar', protocoloFinal:(rec.selection.protocol||null),
          valorOriginal:null, valorFinal:val, estado:'revisado-por-profesional-no-validado-con-goniometro' } } };
    if(fueraT) med.traza.fueraTecho=true;
    // Imagen de evidencia (del MISMO registro/los MISMOS puntos, generada por V4) → Storage, nunca base64 al doc.
    var imgs=[];
    if(typeof rec.evidencePng==='string' && rec.evidencePng.indexOf('data:image/')===0){
      try{
        var cvv=await _v4CanvasDeDataURL(rec.evidencePng);
        if(cvv){ var gLike={ imgs:{} };
          gLike.imgs[key+'_'+lado]={ canvas:cvv, key:key+'_'+lado+'_v4', grupo:e.grupo, mov:e.mov, lado:lado, grado:med.grado, etq:e.grupo+' '+e.mov+' ('+(lado==='izq'?'Izq':'Der')+') · revisada V4' };
          imgs=await _subirImagenesGonio(p, gLike, btn);
        }
      }catch(_i){ imgs=[]; }
    }
    if(!imgs.length){
      if(!_confirmar('No se pudo preparar o subir la imagen de evidencia de esta medición V4.\n\n¿Guardar la medición SIN imagen? (quedará registrada explícitamente como "medición sin imagen")')){
        if(btn){ btn.disabled=false; btn.textContent='Guardar al expediente'; }
        return;
      }
      med.traza.sinImagen=true;
    }
    var sesion={ id:'bm_'+p.id+'_'+Date.now(), tipo:'goniometria', fuente:'v4',
      fecha:fechaHoy(), horaCreacion:horaAhora(), fechaHoraISO:new Date().toISOString(),
      terapeuta:usuarioActual(), convencion:'clinica', plano:'sagital',
      medidas:[med], hallazgos:_gonioHallazgos([med]), cita:GONIO_CITA,
      calidad:{ nMedidas:1, origen:'biomecanica-v4', requierenRevision:0 }, imagenes:imgs, video:null, reportePdf:null, eliminado:false };
    // Línea de ROM con la MISMA semántica idempotente que guardarSesionGonio (prefijo "Goniometría").
    try{
      if(!p.valoracion || typeof p.valoracion!=='object') p.valoracion={};
      var linea='Goniometría revisada V4 ('+sesion.fecha+', puntos colocados por el fisioterapeuta, cribado 2D, no validado contra goniómetro físico'+(maxOk?'':'; posición mostrada, tope sin confirmar')+'): '+_gonioTexto([med]);
      p.valoracion.rom=_v4ActualizarROM(p.valoracion.rom, key, lado, linea);
    }catch(_rl){}
    var okSave=await _v4Persistir(p, sesion);
    if(est) est.textContent = okSave ? '✅ Guardada en el expediente ('+(imgs.length?'con imagen de evidencia':'SIN imagen, registrado')+')' : '⚠️ Guardada LOCAL; se sincronizará al reconectar';
    toast(okSave ? '✅ Medición V4 guardada en el expediente' : '⚠️ Guardada local, pendiente de sincronizar', okSave?'success':'warning');
    setTimeout(function(){ _v4CerrarConf(true); try{ if(typeof renderExpediente==='function') renderExpediente('biomecanica'); }catch(_e){} }, 900);
  }
  window.BIO_v4Abrir = BIO_v4Abrir;
  window.BIO_v4ExportarPar = BIO_v4ExportarPar;

  window.abrirMedidorBiomecanico = abrirMedidorBiomecanico;
  window.BIO_renderPestana = renderPestana;
  window.BIO_pdf = BIO_pdf;
  window.BIO_eliminar = BIO_eliminar;
  window.BIO_reconstruccion = BIO_reconstruccion;
  window.BIO_construirPDF = BIO_construirPDF;   // para pruebas/render
  window.BIO_construirPDF_sent = BIO_construirPDF_sent;
  window.BIO_construirPDF_gonio = BIO_construirPDF_gonio;   // para pruebas/render
  window.BIO_gonioSel = BIO_gonioSel;
  window.BIO_gonioCapturar = BIO_gonioCapturar;
  window.BIO_gonioCapturarActual = BIO_gonioCapturarActual;     // V3: captura del cuadro ACTUAL (no el pico)
  window.BIO_gonioAjustar = BIO_gonioAjustar;                   // V3: corrección manual de puntos (A3)
  window.BIO_gonioAjustarOk = BIO_gonioAjustarOk;
  window.BIO_gonioAjustarUndo = BIO_gonioAjustarUndo;
  window.BIO_gonioAjustarCancelar = BIO_gonioAjustarCancelar;
  window.BIO_gonioZoomReset = BIO_gonioZoomReset;               // V3: zoom/pan de la vista estática
  window.BIO_gonioZoomMas = BIO_gonioZoomMas;                   // V3.1: barra de herramientas del visor
  window.BIO_gonioZoomMenos = BIO_gonioZoomMenos;
  window.BIO_gonioEnfocar = BIO_gonioEnfocar;                   // V3.1: recorte virtual no destructivo A/V/C
  window.BIO_gonioProto = BIO_gonioProto;                       // P0 2026-11-22: protocolo de muñeca (proxy 3MCP | lateral 5MCP)
  window.BIO_gonioExtremo = BIO_gonioExtremo;                   // P0: tope de movimiento confirmado por el fisio
  window.BIO_gonioPanelAnat = BIO_gonioPanelAnat;               // P0: panel de diagnóstico anatómico (sin ángulos)
  window.BIO_gonioExportTraza = BIO_gonioExportTraza;           // P0: export JSON de coordenadas/confianza
  window.BIO_gonioFijarCuadro = BIO_gonioFijarCuadro;           // V3.1 P2: fijar un cuadro del video (re-analiza Pose+Hands)
  window.BIO_gonioCuadroPaso = BIO_gonioCuadroPaso;             // V3.1 P2: cuadro anterior/siguiente (~1/FPS, seek declarado aprox.)
  window.BIO_gonioBorrar = BIO_gonioBorrar;
  window.BIO_gonioFinish = BIO_gonioFinish;
  window.BIO_gonioVolver = BIO_gonioVolver;
  window.BIO_gonioVolverInicio = BIO_gonioVolverInicio;
  window.BIO_gonioReanalizarVideo = BIO_gonioReanalizarVideo;
  window.BIO_colaSiguiente = BIO_colaSiguiente;
  window.BIO_gonioGuardar = guardarSesionGonio;
  window.BIO_comparar = BIO_comparar;
  window.BIO_cmpSel = BIO_cmpSel;
  window.BIO_cmpCerrar = BIO_cmpCerrar;
  window.__BIO_GONIO = { calcularGonio:calcularGonio, nuevoAccGonio:nuevoAccGonio, GONIO_CAT:GONIO_CAT, _gonioTexto:_gonioTexto, _gonioAlerta:_gonioAlerta, _gonioFmtGrado:_gonioFmtGrado, _gonioFueraRango:_gonioFueraRango, _gonioTecho:_gonioTecho, GONIO_TECHO:GONIO_TECHO };  // hook de pruebas
  // Hook de pruebas del MOTOR GRÁFICO V3 (geometría firmada + layout + valor desde px + render).
  window.__BIO_GFX = { geom:_GX.geom, layout:_GX.layout, trazarGonio:_trazarGonio, gonioPtsPx:_gonioPtsPx,
                       valorDesdePx:_gonioValorDesdePx, techo:_gonioTecho, superaTecho:_gonioSuperaTecho,
                       renderAnotada:_renderAnotada, procesarGonioFrame:procesarGonioFrame,
                       _setAccG:function(g){ BIO.accG=g; } };
  // Hook de PRUEBAS (geometría pura, sin DOM/MediaPipe) — lo usa pruebas/geometria.test.js.
  window.__BIO_TEST = {
    setAspect:_setAspect, ang2D:_ang2D, seg2D:_seg2D,
    munecaEje:_munecaEje, setHandsLm:function(a){ BIO._handsLmTest = a || null; },
    calcularGonio:calcularGonio, cmpExtraer:_cmpExtraer, cmpTablaHTML:_cmpTablaHTML,
    gateMunecaMatch:_gateMunecaMatch, axisQuality:_axisQuality,            // P0 2026-11-22: gates anatómicos
    setMunProto:function(v){ BIO._munProto=v; }, setFrameH:function(h){ BIO._frameHTest=h; },
    setExtOk:function(b){ BIO._extOk=!!b; }, sinExtremo:_gonioSinExtremo,
    setHandsMeta:function(m){ BIO._handsMeta=m||null; },
    cadenciaDudosa:_cadenciaDudosa, gonioFmtGrado:_gonioFmtGrado, gonioAlerta:_gonioAlerta,
    gonioFueraRango:_gonioFueraRango, romConfiable:_romConfiable,
    scoreVisGonio:_scoreVisGonio, contarVisGonio:_contarVisGonio,
    GONIO_CAT:GONIO_CAT, ALGO_VER:BIO_ALGO_VER
  };
  // (V3.1) hook de la SUITE DE INTEGRIDAD DE CUADRO: expone el pipeline de identidad (pool + contexto por
  // envío + lockstep de Hands + tupla retenida) para probarlo con cuadros sintéticos numerados y callbacks
  // demorados/perdidos — solo pruebas, jamás lo usa la app.
  window.__BIO_FR = {
    BIO:BIO, send:_gonioSendFrame, onResults:onResults, onHands:onResultsHands,
    procesar:_gonioProcesarCuadro, bump:_bumpGen, handsActuales:_handsActuales,
    frTomar:_frTomar, frSoltar:_frSoltar, capturar:_gonioCapturarCore,
    selDefault:_gonioSelDefault, resetEstado:resetEstado, borrar:BIO_gonioBorrar,
    videoUI:_gonioVideoUIHTML, gxK:_gxK, enfocar:BIO_gonioEnfocar, zoomEstado:function(){ return BIO._zoom; }
  };

})();
