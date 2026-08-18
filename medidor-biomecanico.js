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
    { key:'hombro_abd_der',  grupo:'Hombro', mov:'Abducción', lado:'Der', calc:'hombro', dir:'abd',  base0:true, vertice:12, hombro:12, codo:14 }
  ];
  // Filas de la tabla (una por movimiento, con columnas Izq/Der).
  var FILAS = [
    { etq:'Codo · Flexo-ext.',  izq:'codo_flex_izq',   der:'codo_flex_der' },
    { etq:'Hombro · Flexión',   izq:'hombro_flex_izq', der:'hombro_flex_der' },
    { etq:'Hombro · Extensión', izq:'hombro_ext_izq',  der:'hombro_ext_der' },
    { etq:'Hombro · Abducción', izq:'hombro_abd_izq',  der:'hombro_abd_der' }
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
    tipoMedicion:'rom',      // 'rom' | 'sent' (sentadilla frontal); se recuerda entre aperturas
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
  function _estadoHombro(world, marco, sIdx, eIdx){
    var arm=_sub(world[eIdx], world[sIdx]);
    var au=_dot(arm, marco.up), al=_dot(arm, marco.lateral), af=_dot(arm, marco.forward);
    var h=Math.sqrt(al*al+af*af);
    var theta=Math.atan2(h, -au)*180/Math.PI;   // 0=abajo, 90=horizontal, 180=arriba
    var dir=null;
    if(theta>=12){ dir = (Math.abs(al)>=Math.abs(af)) ? 'abd' : (af>0 ? 'flex' : 'ext'); }
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
        if(_vis(lm,p1)&&_vis(lm,p2)&&_vis(lm,p3) && world && world[p1]&&world[p2]&&world[p3]){
          var interior = angulo3D(world[p1], world[p2], world[p3]);
          val = 180 - interior; if(val<0) val=0; ok=true;
        }
      } else { // hombro: la métrica se llena solo si el brazo va en SU dirección (flex/ext/abd)
        var s=m.hombro, e=m.codo;
        if(marco && _vis(lm,s)&&_vis(lm,e)&&_vis(lm,11)&&_vis(lm,12)&&_vis(lm,23)&&_vis(lm,24) && world && world[s]&&world[e]){
          var est = cacheHombro[s] || (cacheHombro[s] = _estadoHombro(world, marco, s, e));
          if(est.dir === m.dir){ val = est.theta; if(val<0) val=0; ok=true; }
        }
      }
      out[m.key] = { val:val, ok:ok };
      if(ok) out._algunoValido = true;
    }
    return out;
  }

  // ── Acumulador: mín/máx + SERIE por movimiento (para detectar repeticiones) ──
  function nuevoAcumulador(){
    var a = { framesValidos:0, _frame:0 };
    MEDIDAS.forEach(function(m){ a[m.key] = { min:null, max:null, muestras:0, serie:[] }; });
    return a;
  }
  function acumular(acc, ang){
    if(!acc || !ang) return;
    acc._frame++;                                   // índice monotónico de frame (separa repeticiones)
    var alguno=false;
    for(var i=0;i<MEDIDAS.length;i++){
      var k=MEDIDAS[i].key, r=ang[k];
      if(r && r.ok){
        alguno=true;
        var s=acc[k];
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
  function _r1(v){ return v==null?null:Math.round(v*10)/10; }
  function _r2(v){ return v==null?null:Math.round(v*100)/100; }
  // Ángulo interior 2D (grados) en el vértice b, SOLO plano de la imagen (para proyecciones frontales).
  function _ang2D(a,b,c){
    var v1x=a.x-b.x, v1y=a.y-b.y, v2x=c.x-b.x, v2y=c.y-b.y;
    var m1=Math.hypot(v1x,v1y), m2=Math.hypot(v2x,v2y);
    if(!m1||!m2) return 0;
    var cos=(v1x*v2x+v1y*v2y)/(m1*m2); if(cos>1)cos=1; if(cos<-1)cos=-1;
    return Math.acos(cos)*180/Math.PI;
  }
  function _dist2D(a,b){ return Math.hypot(a.x-b.x, a.y-b.y); }
  // Resume cada movimiento como la MEDIA de los picos de sus repeticiones (más reproducible que un
  // máximo suelto y robusto al ruido). Codo añade extensión (mínimo robusto). Mantiene min/max/rango
  // por compatibilidad con el render/PDF y con sesiones ya guardadas.
  function finalizarMedidas(acc){
    return MEDIDAS.map(function(m){
      var s = acc && acc[m.key];
      var base = { key:m.key, grupo:m.grupo, mov:m.mov, lado:m.lado,
                   media:null, mejor:null, de:null, reps:0, ext:null,
                   min:null, max:null, rango:null, muestras:(s&&s.muestras)||0 };
      if(!s || s.muestras<6 || !s.serie || !s.serie.length) return base;   // <6 muestras = incidental
      var picos=_detPicos(s.serie, m.calc==='codo'?20:15, 8);
      if(!picos.length) return base;
      var de=_desv(picos);
      base.media=Math.round(_media(picos)); base.mejor=Math.round(Math.max.apply(null,picos));
      base.de=(de!=null)?Math.round(de):null; base.reps=picos.length;
      if(m.calc==='codo'){                            // codo: extensión = mínimo robusto (0°=extendido)
        var ext=_percentil(s.serie, 0.05); if(ext<0) ext=0;
        base.ext=Math.round(ext); base.min=base.ext; base.max=base.media; base.rango=Math.round(base.media-base.ext);
      } else {                                        // hombro: ROM desde 0° neutro
        base.min=0; base.max=base.mejor; base.rango=base.media;
      }
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
    if(midSh && midHip){
      var ancho=(Math.abs(lm[11].x-lm[12].x)+Math.abs(lm[23].x-lm[24].x))/2;
      var alto=Math.abs(midSh.y-midHip.y)||1e-6;
      out.orientFrontal=(ancho/alto)>=0.45;
    }
    // Pierna en frontal: FPPA con signo + MKD (% ancho pelvis). midX = línea media del cuerpo.
    var anchoPelvis = (vis(23)&&vis(24)) ? Math.abs(lm[23].x-lm[24].x) : null;
    function pierna(hip,knee,ank,midX){
      var interior=_ang2D(hip,knee,ank), mag=180-interior;
      var dy=(ank.y-hip.y);
      var t=Math.abs(dy)<1e-6 ? 0.5 : (knee.y-hip.y)/dy;
      var xLine=hip.x+(ank.x-hip.x)*t;                    // punto de la línea cadera–tobillo a la altura de la rodilla
      var dirMedial=(midX-xLine)>=0?1:-1;                 // hacia la línea media del cuerpo
      var despl=(knee.x-xLine)*dirMedial;                 // + = rodilla medial
      var signo=despl>=0?1:-1;
      return { fppa:mag*signo, mkdPct:(anchoPelvis&&anchoPelvis>0.01)?(despl/anchoPelvis*100):null };
    }
    if(midHip){
      if(vis(23)&&vis(25)&&vis(27)){ var pi=pierna(lm[23],lm[25],lm[27],midHip.x); out.fppaIzq={val:pi.fppa,ok:true}; if(pi.mkdPct!=null) out.mkdIzq={val:pi.mkdPct,ok:true}; }
      if(vis(24)&&vis(26)&&vis(28)){ var pd=pierna(lm[24],lm[26],lm[28],midHip.x); out.fppaDer={val:pd.fppa,ok:true}; if(pd.mkdPct!=null) out.mkdDer={val:pd.mkdPct,ok:true}; }
    }
    if(vis(25)&&vis(26)&&vis(27)&&vis(28)){
      var dA=_dist2D(lm[27],lm[28]);
      if(dA>0.01) out.sepRatio={val:_dist2D(lm[25],lm[26])/dA, ok:true};
    }
    if(midSh && midHip){
      var dx=midSh.x-midHip.x, dyT=midHip.y-midSh.y;
      if(dyT>1e-6) out.troncoLat={val:Math.atan2(dx,dyT)*180/Math.PI, ok:true};   // + = hacia un lado de la imagen
    }
    if(midHip) out.sacro={x:midHip.x, y:midHip.y, ok:true};
    if(midAnk && vis(0)) out.alturaPx=Math.abs(midAnk.y-lm[0].y);   // proxy nariz→tobillos
    out.midAnk=midAnk;
    out.p={ sacro:midHip,
            nariz:vis(0)?lm[0]:null, hombroIzq:vis(11)?lm[11]:null, hombroDer:vis(12)?lm[12]:null,
            codoIzq:vis(13)?lm[13]:null, codoDer:vis(14)?lm[14]:null, munecaIzq:vis(15)?lm[15]:null, munecaDer:vis(16)?lm[16]:null,
            caderaIzq:vis(23)?lm[23]:null, caderaDer:vis(24)?lm[24]:null,
            rodillaIzq:vis(25)?lm[25]:null, rodillaDer:vis(26)?lm[26]:null,
            tobilloIzq:vis(27)?lm[27]:null, tobilloDer:vis(28)?lm[28]:null };
    return out;
  }

  function nuevoAccSent(){
    return { frames:0, framesValidos:0, _frame:0, aspect:null,
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
    if(f.sacro.ok){ _pushS(acc.s.sacroY,i,f.sacro.y); _pushS(acc.s.sacroX,i,f.sacro.x); alguno=true; }
    if(f.fppaIzq.ok) _pushS(acc.s.fppaIzq,i,f.fppaIzq.val);
    if(f.fppaDer.ok) _pushS(acc.s.fppaDer,i,f.fppaDer.val);
    if(f.mkdIzq.ok) _pushS(acc.s.mkdIzq,i,f.mkdIzq.val);
    if(f.mkdDer.ok) _pushS(acc.s.mkdDer,i,f.mkdDer.val);
    if(f.sepRatio.ok) _pushS(acc.s.sepRatio,i,f.sepRatio.val);
    if(f.troncoLat.ok) _pushS(acc.s.troncoLat,i,f.troncoLat.val);
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

  // ── Callback único de resultados de MediaPipe ──────────────────────────────
  function onResults(res){
    var lm = res && res.poseLandmarks;
    var world = res && res.poseWorldLandmarks;
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
      '.bio-tipo-row{display:flex;gap:8px;width:100%;max-width:360px}',
      '.bio-tipo-btn{flex:1;border:1.5px solid rgba(255,255,255,.25);background:rgba(255,255,255,.06);color:#9BA3B5;border-radius:12px;padding:11px 8px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit}',
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
      +   '<div style="font-size:40px" id="bio-ini-icono">🦴</div>'
      +   '<div class="bio-tipo-row">'
      +     '<button class="bio-tipo-btn on" id="bio-tipo-rom">🦴 ROM brazos</button>'
      +     '<button class="bio-tipo-btn" id="bio-tipo-sent">🏋️ Sentadilla</button>'
      +   '</div>'
      +   '<p id="bio-ini-desc">Mide los rangos articulares de codo y hombro. Elige cómo capturar el movimiento.</p>'
      +   '<div id="bio-est-wrap" style="display:none;width:100%;max-width:360px">'
      +     '<input type="number" id="bio-estatura" inputmode="numeric" min="80" max="230" placeholder="Estatura del paciente en cm (opcional)" style="width:100%;box-sizing:border-box;border:1.5px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:#fff;border-radius:12px;padding:12px;font-size:14px;font-family:inherit">'
      +   '</div>'
      +   '<button class="bio-modo-btn bio-modo-cam" id="bio-go-cam">▶️ Cámara en vivo</button>'
      +   '<button class="bio-modo-btn bio-modo-vid" id="bio-go-vid">📁 Subir video</button>'
      +   '<input type="file" id="bio-file" accept="video/*" style="display:none">'
      + '</div>'
      // Vista cámara en vivo
      + '<div class="bio-vista" id="bio-vista-camara">'
      +   '<div class="bio-canvas-wrap"><video id="bio-cam-src" playsinline webkit-playsinline muted autoplay></video><canvas id="bio-canvas"></canvas>'
      +     '<div class="bio-cron" id="bio-cron" style="display:none">00:00</div>'
      +     '<div class="bio-panel" id="bio-panel-vivo"></div>'
      +   '</div>'
      +   '<div class="bio-estado" id="bio-estado">Iniciando cámara…</div>'
      +   '<div class="bio-acciones">'
      +     '<button class="bio-b-sec" id="bio-btn-flip" style="flex:0 0 auto;min-width:auto;padding:13px 16px">🔄 Cámara</button>'
      +     '<button class="bio-b-rec" id="bio-btn-rec" disabled>⏺️ Grabar sesión</button>'
      +   '</div>'
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
    document.getElementById('bio-go-cam').addEventListener('click', iniciarCamara);
    document.getElementById('bio-go-vid').addEventListener('click', function(){ document.getElementById('bio-file').click(); });
    document.getElementById('bio-file').addEventListener('change', function(ev){
      var f = ev.target.files && ev.target.files[0]; ev.target.value='';
      if(f) procesarVideo(f);
    });
    document.getElementById('bio-btn-rec').addEventListener('click', toggleGrabacion);
    document.getElementById('bio-btn-flip').addEventListener('click', voltearCamara);
    document.getElementById('bio-prog-cancel').addEventListener('click', function(){ BIO.cancelVideo=true; });
    document.getElementById('bio-recon-play').addEventListener('click', _reconPlay);
    document.getElementById('bio-recon-slider').addEventListener('input', function(){ _reconStop(); if(RECON.paquete){ RECON.frame=Math.max(0,Math.min(RECON.paquete.n-1, parseInt(this.value,10)||0)); _reconDibujar(); } });
    document.getElementById('bio-recon-speed').addEventListener('click', function(){ RECON.speed = RECON.speed===1?0.5:(RECON.speed===0.5?2:1); this.textContent=RECON.speed+'×'; });
    document.getElementById('bio-recon-cerrar').addEventListener('click', function(){ _reconStop(); cerrarMedidor(); });
  }

  function mostrarVista(id){
    ['bio-vista-inicio','bio-vista-camara','bio-vista-progreso','bio-vista-resumen','bio-vista-recon'].forEach(function(v){
      var el=document.getElementById(v); if(el) el.classList.toggle('on', v===id);
    });
  }

  // ── Abrir / cerrar ─────────────────────────────────────────────────────────
  function abrirMedidorBiomecanico(){
    var pid = (typeof currentPatient!=='undefined' && currentPatient) ? currentPatient.id : null;
    if(!pid){ toast('Abre un expediente primero','warning'); return; }
    construirOverlay();
    resetEstado();
    aplicarTipoMedicion(BIO.tipoMedicion||'rom');
    // Precargar estatura desde la última sentadilla guardada de ESTE paciente (si la hubo).
    var est=document.getElementById('bio-estatura');
    if(est){
      var ult=(currentPatient.biomecanica||[]).slice().reverse().find(function(s){ return s && s.tipo==='sentadilla' && s.calibracion && s.calibracion.estaturaCm; });
      est.value = ult ? ult.calibracion.estaturaCm : '';
    }
    mostrarVista('bio-vista-inicio');
    document.getElementById('bio-overlay').style.display='flex';
  }
  // Selector de tipo de medición en la vista de inicio (ROM de brazos vs sentadilla frontal).
  function aplicarTipoMedicion(t){
    BIO.tipoMedicion = (t==='sent') ? 'sent' : 'rom';
    var bR=document.getElementById('bio-tipo-rom'), bS=document.getElementById('bio-tipo-sent');
    if(bR) bR.classList.toggle('on', BIO.tipoMedicion==='rom');
    if(bS) bS.classList.toggle('on', BIO.tipoMedicion==='sent');
    var ic=document.getElementById('bio-ini-icono'); if(ic) ic.textContent = BIO.tipoMedicion==='sent' ? '🏋️' : '🦴';
    var ew=document.getElementById('bio-est-wrap'); if(ew) ew.style.display = BIO.tipoMedicion==='sent' ? 'block' : 'none';
    var de=document.getElementById('bio-ini-desc');
    if(de) de.textContent = BIO.tipoMedicion==='sent'
      ? 'Análisis FRONTAL de sentadilla: valgo dinámico (FPPA), desplazamiento medial de rodilla, separación y descenso. Paciente DE FRENTE, cuerpo completo, 3 a 5 sentadillas.'
      : 'Mide los rangos articulares de codo y hombro. Elige cómo capturar el movimiento.';
    var tt=document.querySelector('#bio-overlay .bio-top b');
    if(tt) tt.textContent = BIO.tipoMedicion==='sent' ? '🏋️ Sentadilla — análisis frontal' : '🦴 Medición biomecánica — ROM';
  }
  function _leerEstatura(){
    var el=document.getElementById('bio-estatura'); var v=el?parseFloat(el.value):NaN;
    return (isFinite(v) && v>=80 && v<=230) ? v : null;
  }
  function resetEstado(){
    BIO.modo=null; BIO.recording=false; BIO.procesandoVideo=false; BIO.cancelVideo=false; BIO.finalizando=false;
    BIO.acc=null; BIO.accS=null; BIO.framesTotales=0; BIO.srcEl=null; BIO.sending=false;
    BIO.facing='environment';           // cada medición arranca con la cámara TRASERA
    detenerGrabadorVideo(); BIO.pendingVideo=null;
    detenerLoopCamara(); pararCronometro();
  }
  function cerrarMedidor(){
    BIO.cancelVideo=true;
    _reconStop();
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
  function limpiarVideoSrc(v){ try{ if(v){ v.pause(); v.onclick=null; v.removeAttribute('src'); try{ v.srcObject=null; }catch(_e){} v.load(); } }catch(e){} }

  // ── MODO A: cámara en vivo ─────────────────────────────────────────────────
  async function iniciarCamara(){
    BIO.modo='camara';
    BIO.facing = BIO.facing || 'environment';   // TRASERA por defecto (se apunta al paciente)
    mostrarVista('bio-vista-camara');
    // Reset del botón de grabar y cronómetro (evita estado viejo al volver a grabar).
    var _br=document.getElementById('bio-btn-rec'); if(_br){ _br.className='bio-b-rec'; _br.textContent='⏺️ Grabar sesión'; _br.disabled=true; }
    var _bf=document.getElementById('bio-btn-flip'); if(_bf) _bf.disabled=false;
    var _cr=document.getElementById('bio-cron'); if(_cr){ _cr.style.display='none'; _cr.textContent='00:00'; }
    BIO.canvas=document.getElementById('bio-canvas'); BIO.ctx=BIO.canvas.getContext('2d');
    if(BIO.tipoMedicion==='sent') pintarPanelSent(null); else pintarPanelVivo(null);
    var estado=document.getElementById('bio-estado');
    estado.textContent='Cargando modelo de pose…';
    var ok = await ensureMediaPipeReady();
    if(!ok){ estado.textContent='⚠️ No se pudo cargar el motor de pose. Revisa tu conexión e inténtalo de nuevo.'; return; }
    var camOk = await abrirStreamCamara(BIO.facing);
    if(!camOk) return;
    estado.textContent = (BIO.tipoMedicion==='sent')
      ? 'Paciente DE FRENTE, cuerpo completo (caderas, rodillas y tobillos en cuadro)'
      : 'Coloca al paciente de cuerpo completo en el encuadre';
    BIO.acc=null; BIO.accS=null; BIO.framesTotales=0;
    loopCamara();
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
    // Listo en cuanto se detecta el tronco (hombros + caderas). Los brazos se miden al moverlos.
    var ok = _vis(lm,11)&&_vis(lm,12)&&_vis(lm,23)&&_vis(lm,24);
    btn.disabled = !ok;
    var estado=document.getElementById('bio-estado');
    if(estado) estado.textContent = ok ? '✓ Detectado — graba y pide TODOS los movimientos' : 'Encuadra tronco y brazos (hombros y caderas)';
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
      if(BIO.tipoMedicion==='sent'){ BIO.accS=nuevoAccSent(); } else { BIO.acc = nuevoAcumulador(); }
      BIO.framesTotales=0; BIO.tStart=Date.now();
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
    },500);
  }
  function pararCronometro(){ if(BIO.timerId){ clearInterval(BIO.timerId); BIO.timerId=null; } }

  // Panel de ángulos en vivo (cámara).
  function pintarPanelVivo(ang){
    var panel=document.getElementById('bio-panel-vivo'); if(!panel) return;
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

    if(BIO.tipoMedicion==='sent'){ BIO.accS=nuevoAccSent(); } else { BIO.acc = nuevoAcumulador(); }
    BIO.framesTotales=0;
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
        if(!BIO.sending && BIO.pose && v.videoWidth>0 && (t - lastSample) >= minGap){
          lastSample = t; BIO.sending = true; BIO.framesTotales++;
          BIO.pose.send({ image:v }).then(function(){ BIO.sending=false; }).catch(function(){ BIO.sending=false; });
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
    });
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
      var principal = (m.grupo==='Codo') ? (m.min+'°–'+m.max+'°') : (m.media+'°');
      var de = (m.de!=null) ? (' <span style="color:'+gris+'">±'+m.de+'°</span>') : '';
      var reps = m.reps ? (' · '+m.reps+(m.reps===1?' rep':' reps')) : '';
      return '<b style="color:'+verde+'">'+principal+'</b>'+de
           + '<span style="color:'+gris+';font-size:11px"> máx '+m.mejor+'°'+reps+'</span>';
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
      + '<div style="color:#9BA3B5;font-size:13px;margin-bottom:10px">'+fuenteTxt+' · '+meta.duracionSeg+' s · '+(meta.calidad.framesValidos||0)+' cuadros válidos · convención clínica (0° neutro)<br>ROM = <b style="color:#C9D2E8">media de los picos</b> de cada repetición · máx = mejor intento · ± = consistencia entre reps</div>'
      + '<table class="bio-tabla-res"><thead><tr><th>Movimiento</th><th>Izquierda</th><th>Derecha</th></tr></thead><tbody>'+filas+'</tbody></table>'
      + (hayDato ? '' : '<div style="color:#E8C96A;font-size:13px;margin-top:10px">⚠️ No se detectó tronco + brazos con suficiente visibilidad. Repite con hombros, codos y caderas en cuadro y buena luz.</div>')
      + '<div class="bio-acciones">'
      +   '<button class="bio-b-sec" id="bio-res-repetir">🔄 Repetir</button>'
      +   (hayDato ? '<button class="bio-b-save" id="bio-res-guardar">💾 Guardar en expediente</button>' : '')
      + '</div>';
    mostrarVista('bio-vista-resumen');
    document.getElementById('bio-res-repetir').addEventListener('click', function(){ resetEstado(); mostrarVista('bio-vista-inicio'); });
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
    pon('bs-fppa-izq', f.fppaIzq.ok ? (Math.round(f.fppaIzq.val)+'°') : '—');
    pon('bs-fppa-der', f.fppaDer.ok ? (Math.round(f.fppaDer.val)+'°') : '—');
    pon('bs-sep', f.sepRatio.ok ? f.sepRatio.val.toFixed(2) : '—');
    pon('bs-tro', f.troncoLat.ok ? (Math.abs(Math.round(f.troncoLat.val))+'°') : '—');
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
      +   (res.nReps ? '<button class="bio-b-save" id="bio-res-guardar">💾 Guardar en expediente</button>' : '')
      + '</div>';
    mostrarVista('bio-vista-resumen');
    document.getElementById('bio-res-repetir').addEventListener('click', function(){ resetEstado(); mostrarVista('bio-vista-inicio'); });
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

  // ═════════════ RECONSTRUCCIÓN VISUAL (esqueleto + trayectorias) ═════════════
  // Empaqueta las trayectorias alineadas por frame + fps + aspecto + frame del fondo (sacro
  // más bajo). Compacto: coords enteras 0..1000, null donde el punto no se vio.
  function _paqueteTray(accS, meta, res){
    if(!accS || !accS.tray || !accS.trayN) return null;
    var sac=accS.tray.sacro||[], fondo=null, maxY=-1;
    for(var k=0;k<sac.length;k++){ if(sac[k] && sac[k][1]>maxY){ maxY=sac[k][1]; fondo=k; } }
    return { v:1, fps:(meta&&meta.calidad&&(meta.calidad.fpsPromedio||meta.calidad.fpsMuestreo))||12,
      aspect:accS.aspect||0.5625, nReps:(res&&res.nReps)||0, fondo:fondo, n:accS.trayN, puntos:accS.tray };
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
  var RECON={ paquete:null, frame:0, playing:false, raf:null, speed:1, last:0, box:null };

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

  function _reconDibujar(){
    var paq=RECON.paquete, cv=document.getElementById('bio-recon-canvas'); if(!paq||!cv) return;
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
  function _reconSetCanvas(){
    var wrap=document.getElementById('bio-recon-wrap'), cv=document.getElementById('bio-recon-canvas'); if(!wrap||!cv) return;
    var paq=RECON.paquete, a=(paq&&paq.aspect)||0.5625;
    var W=Math.max(240, Math.min(wrap.clientWidth||360, 520));
    var H=Math.round(W/a); var maxH=(wrap.clientHeight||640);
    if(H>maxH){ H=maxH; W=Math.round(H*a); }
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
    _reconSetCanvas();
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
      +   '<span style="font-weight:600;text-transform:none;letter-spacing:0;color:var(--gray-400)">'+fuente+'</span>'
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
      +   '<span style="color:var(--gray-400);font-size:11px">PDF: próxima subfase</span>'
      +   videoBtn
      +   '<button data-sid="'+esc(s.id)+'" onclick="BIO_eliminar(this.dataset.sid)" style="background:var(--red-light);color:var(--red);border:1.5px solid #FCA5A5;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer">🗑️ Eliminar</button>'
      + '</div>'
      + '</div>';
  }
  function renderPestana(p){
    var lista = Array.isArray(p.biomecanica) ? p.biomecanica.filter(function(s){ return s && !s.eliminado; }) : [];
    var html = ''
      + '<button class="btn-gold" style="width:100%;margin-bottom:12px;font-size:15px;font-weight:800;border:none;border-radius:var(--radius);padding:14px;cursor:pointer;background:var(--gold);color:var(--navy-dark)" onclick="abrirMedidorBiomecanico()">▶️ Nueva medición ROM</button>';
    if(!lista.length){
      html += '<div style="text-align:center;padding:22px;color:var(--gray-400);font-size:13px">Sin mediciones — toca <b>▶️ Nueva medición ROM</b> para empezar.<br>Mide ROM de brazos (codo y hombro) o analiza una SENTADILLA (valgo de rodilla), con la cámara o subiendo un video.</div>';
      return html;
    }
    var orden = lista.slice().reverse(); // más reciente primero
    html += orden.map(function(s){
      if(s.tipo==='sentadilla') return tarjetaSentHTML(s);
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
  // ROM normal de referencia (grados) por movimiento — guía clínica, no diagnóstico.
  function _refNormal(grupo, mov){
    return ({ 'Codo·Flexión':145, 'Hombro·Flexión':180, 'Hombro·Extensión':60, 'Hombro·Abducción':180 })[grupo+'·'+mov] || null;
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
    var nota='ROM = media de los picos de cada repetición; ± indica la consistencia entre repeticiones (menor = más fiable). Estimado por análisis de pose con una sola cámara: la abducción (plano frontal) es la más confiable; flexión y extensión (plano sagital) son aproximadas — para valores finos, capturar de perfil. Cribado y seguimiento; no sustituye la goniometría manual.';
    doc.text(doc.splitTextToSize(nota, W-2*M-24), M+12, y+30);
    y+=66;
    // Pie
    var fy=H-38;
    doc.setDrawColor(GOLD[0],GOLD[1],GOLD[2]); doc.setLineWidth(1.2); doc.line(M,fy,W-M,fy); doc.setLineWidth(1);
    doc.setFontSize(8); doc.setTextColor(150,158,181);
    doc.text('Clínica Sinergia · Generado automáticamente el '+fechaHoy()+(usuarioActual()?(' · '+usuarioActual()):''), M, fy+14);
    doc.text('Página 1 de 1', W-M-52, fy+14);
    return doc;
  }
  async function BIO_pdf(sid){
    var p=(typeof currentPatient!=='undefined')?currentPatient:null; if(!p) return;
    var s=(p.biomecanica||[]).find(function(x){return x.id===sid;}); if(!s) return;
    if(s.tipo==='sentadilla'){ toast('El PDF de sentadilla llega en la siguiente versión','warning'); return; }
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
    if(typeof renderExpediente==='function') renderExpediente('biomecanica');
    toast('Medición eliminada','');
  }

  // ── Logo de la clínica para el encabezado del PDF (emblema recortado, fondo transparente) ──
  try{ if(typeof window!=='undefined' && !window.BIO_LOGO_DATAURL) window.BIO_LOGO_DATAURL="data:image/png;base64,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"; }catch(e){}

  // ── Exponer al ámbito global (usados por index.html) ───────────────────────
  window.abrirMedidorBiomecanico = abrirMedidorBiomecanico;
  window.BIO_renderPestana = renderPestana;
  window.BIO_pdf = BIO_pdf;
  window.BIO_eliminar = BIO_eliminar;
  window.BIO_reconstruccion = BIO_reconstruccion;
  window.BIO_construirPDF = BIO_construirPDF;   // para pruebas/render

})();
