/* ============================================================================
   DEMO SEED — datos SINTÉTICOS (sin PHI) para la réplica/capturas.
   Define window.__demoBoot(). Llama entrarComo() como supervisor y siembra
   patientsDB con pacientes ficticios ricos (todos los campos del expediente).
   Pacientes/datos 100% inventados. Ningún correo/teléfono/nombre real.
   ============================================================================ */
(function(){
  // Placeholder de imagen (SVG navy/gold) como data URI — evita red/Storage.
  function ph(txt, c1, c2){
    c1=c1||'#1B3A6B'; c2=c2||'#C9A84C';
    var svg='<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360">'
      +'<rect width="480" height="360" fill="'+c1+'"/>'
      +'<rect x="12" y="12" width="456" height="336" fill="none" stroke="'+c2+'" stroke-width="3"/>'
      +'<text x="240" y="190" fill="'+c2+'" font-family="Arial" font-size="26" font-weight="700" text-anchor="middle">'+txt+'</text>'
      +'<text x="240" y="225" fill="#fff" font-family="Arial" font-size="13" text-anchor="middle">muestra sintética · sin datos reales</text></svg>';
    return 'data:image/svg+xml;utf8,'+encodeURIComponent(svg);
  }
  function soap(fecha, ter, evaI, evaF, s, o, a, pl, mods, modalidad){
    return { id:'s_'+Math.random().toString(36).slice(2,9), fecha:fecha, terapeuta:ter,
      atendidoPor:ter, creadoPor:ter, completa:true, revisionPendiente:false,
      modalidad:modalidad||'trauma',
      evaI:evaI, evaF:evaF, eva:evaI,
      s:{ dolor:s, cambios:'Mejoría respecto a la sesión previa', actFisica:'Tolera actividad ligera sin aumento de dolor' },
      o:{ rom:o, fuerza:'Cuádriceps 4/5', hallazgos:o },
      a:{ evolucion:a, respuesta:'Favorable', analisis:a },
      p:{ tratamiento:pl, indicaciones:'Continuar ejercicios en casa', contraindicaciones:'' },
      objetivoSesion:'Progresar carga según tolerancia',
      ejerciciosSesion:[], media:[],
      modalidades:mods||'Ejercicio terapéutico, Tecarterapia C' };
  }
  function ej(nombre, dosis, ind){
    return { id:'e_'+Math.random().toString(36).slice(2,9), nombre:nombre, dosis:dosis,
      indicaciones:ind, estado:'activo', paraCasa:true, origen:'manual',
      media:{ url:ph('🏋️ '+nombre,'#122950','#C9A84C'), type:'image/svg+xml' } };
  }
  function est(nombre, tipoClinico, desc){
    return { id:'est_'+Math.random().toString(36).slice(2,9), tipo:'imagen', type:'image/svg+xml',
      tipoClinico:tipoClinico, descripcion:desc, name:nombre, fechaEstudio:'2026-10-02',
      fechaAgregado:'02/10/2026', agregadoPor:'Demo', url:ph('🩻 '+nombre,'#1B3A6B','#9BA3B5'), fbPath:'' };
  }
  function bioGonio(fecha, etq, grado, ref){
    return { id:'b_'+Math.random().toString(36).slice(2,9), tipo:'gonio', fecha:fecha,
      eliminado:false,
      medidas:[{ clave:etq.k, etq:etq.t, grado:grado, ref:ref, fuente:'imagen', lado:'Derecho',
        traza:{ algoVersion:'bio-2d-2026-11-20', aspect:0.5625, fuente:'imagen' } }],
      imagenes:[{ url:ph('📐 '+etq.t+' '+grado+'°','#122950','#C9A84C'), fbPath:'', etq:etq.t, grado:grado }],
      calidad:{ algoVersion:'bio-2d-2026-11-20', captura:null } };
  }
  function bioMarcha(fecha){
    return { id:'b_'+Math.random().toString(36).slice(2,9), tipo:'marcha', fecha:fecha, eliminado:false,
      medidas:[{clave:'cadencia',etq:'Cadencia',grado:108,ref:110,confiable:true},
               {clave:'flex_rodilla',etq:'Flexión rodilla (apoyo)',grado:18,ref:20,confiable:true}],
      video:{ url:'', fbPath:'clinica/sinergia/demo/biomecanica/marcha_demo.webm' },
      calidad:{ algoVersion:'bio-2d-2026-11-20', tiempoDudoso:false } };
  }

  var HOY = (window.todayISO || new Date().toISOString().split('T')[0]);

  function base(id, name, age, sexo, ter, dx, n){
    return {
      id:id, name:name, age:age, sexo:sexo, telefono:'4421234567',
      fechaNacimiento:'15/03/1990', terapeuta:ter, terapeutaSeguimiento:ter,
      date:HOY, fechaCreacion:'2026-09-15', fechaActualizacion:'2026-11-20',
      ultimoUsuario:ter, sesiones:n, dx:dx,
      alergias:'Ninguna referida', consentimientos:[],
      historialCambios:[{fecha:'15/09/2026', usuario:ter, accion:'Creó el expediente'},
                         {fecha:'20/11/2026', usuario:ter, accion:'Actualizó valoración'}],
      fotos:[], docs:[]
    };
  }

  var P = [];

  // 1) Trauma completo — rodilla (agenda hoy, con nota pendiente)
  var p1 = base('p_demo_0001','Juan Pérez Demo',34,'Masculino','ZARA','Tendinopatía rotuliana derecha',12);
  p1.motivo={ padecimiento:'Dolor en cara anterior de rodilla derecha al correr y bajar escaleras, de 3 meses de evolución, que ha ido en aumento con el entrenamiento.', mecanismo:'Sobreuso / repetitivo', zonaPrincipal:'Rodilla', lado:'Derecho', desdeCuando:'3 meses', evolucion:'Progresiva', dxMedico:'Tendinopatía rotuliana (RM: engrosamiento del tendón rotuliano proximal)' };
  p1.motivoHC={ relato:p1.motivo.padecimiento, desdeCuando:'3 meses', irradiacion:'No' };
  p1.valoracion={ eva:'6', rom:'Flexión 125°, extensión 0° (completa)', fuerza:'Cuádriceps 4/5, isquios 5/5', pruebasEspeciales:'Prueba de Clarke +, salto monopodal doloroso', palpacion:'Dolor a la palpación del polo inferior de la rótula', marcha:'Antiálgica leve', inflamacion:'Leve' };
  p1.dxFuncional={ dxClinico:'Tendinopatía rotuliana en fase reactiva, con déficit de fuerza de cuádriceps y control excéntrico.', objetivosCP:'Reducir dolor a EVA ≤3/10 en 4 semanas; tolerar sentadilla a 60°.', objetivosLP:'Retorno a carrera sin dolor en 12 semanas.', pronostico:'Favorable', limitaciones:'Correr, saltar, bajar escaleras' };
  p1.antecedentes={ patologicos:'Sin antecedentes heredofamiliares relevantes', cirugias:'Ninguna', medicamentos:'Ninguno', deportivos:'Corre 30 km/semana' };
  p1.seguridadClinica={ tienePrecaucion:false, implantes:[], implantesDetalle:'', condiciones:[], condicionesObs:'', banderasRojas:[], banderasDetalle:'', contraindicaciones:'' };
  p1.planTto={ protocolo:{ id:'P1', fase:'M1', fechaGuardado:'20/11/2026', guardadoPor:'ZARA' }, enfoqueTerapeutico:'Carga progresiva (HSR) + manejo de síntomas', contraindicaciones:'' };
  p1.soap=[ soap('02/11/2026','ZARA','6','4','Dolor 6/10 al bajar escaleras','ROM flexión 120°; fuerza cuádriceps 4/5','Mejora respecto a sesión previa','Isométricos de cuádriceps + tecar C','Ejercicio terapéutico, Tecarterapia C'),
            soap('09/11/2026','ZARA','5','3','Dolor 5/10 solo al correr','Sentadilla a 60° sin dolor','Buena evolución','Progresar a HSR 70% CVM','Ejercicio terapéutico, Láser') ];
  p1.ejercicios=[ ej('Isométrico de cuádriceps','5×45 s · ~70% CVM · diario','Mantén la contracción 45 s, descansa 2 min, 5 repeticiones. No debe doler más de 3/10.'),
                  ej('Sentadilla a la pared','3×12 · tempo 3-3 · 3×/sem','Baja controlado en 3 s, sube en 3 s. Rodilla alineada con el pie.') ];
  p1.estudiosDocs=[ est('RM rodilla derecha','resonancia','Engrosamiento tendón rotuliano proximal') ];
  p1.biomecanica=[ bioGonio('02/11/2026',{k:'rod_flex',t:'Flexión de rodilla'},100,140), bioGonio('09/11/2026',{k:'rod_flex',t:'Flexión de rodilla'},125,140), bioMarcha('09/11/2026') ];
  // Fuerza estructurada (escala 0–10, 10 = lado sano) — demo de comparativa y evolución
  p1.valoracion.fuerzaEval=[
    {id:'fz_d1', reg:'Rodilla', mus:'Cuádriceps',   lado:'der', valor:5,  ref:'sano', fecha:'02/11/2026'},
    {id:'fz_d2', reg:'Rodilla', mus:'Cuádriceps',   lado:'der', valor:7,  ref:'sano', fecha:'09/11/2026'},
    {id:'fz_d3', reg:'Rodilla', mus:'Cuádriceps',   lado:'izq', valor:10, ref:'sano', fecha:'09/11/2026'},
    {id:'fz_d4', reg:'Rodilla', mus:'Isquiotibiales',lado:'der',valor:9,  ref:'sano', fecha:'09/11/2026'},
    {id:'fz_d5', reg:'Cadera',  mus:'Glúteo medio', lado:'der', valor:6,  ref:'sano', fecha:'09/11/2026'}
  ];
  p1.sugerenciaIA='💡 Sugerencia de anamnesis (por ejes):\n• Mecanismo: [sobreuso en carrera — por confirmar]\n• Comportamiento del dolor: agrava al bajar escaleras y correr; alivia con reposo.\n• Limitación funcional: no puede correr >2 km.\n— Texto original: '+p1.motivo.padecimiento;
  P.push(p1);

  // 2) Trauma hombro — con bandera roja (metal) para mostrar alerta ROJA
  var p2 = base('p_demo_0002','María López Demo',58,'Femenino','DAF','Síndrome de manguito rotador izquierdo',8);
  p2.motivo={ padecimiento:'Dolor en hombro izquierdo al elevar el brazo y al dormir sobre ese lado, desde hace 5 meses.', mecanismo:'Insidioso', zonaPrincipal:'Hombro', lado:'Izquierdo', desdeCuando:'5 meses', evolucion:'Estable', dxMedico:'Tendinopatía del supraespinoso' };
  p2.valoracion={ eva:'7', rom:'Abducción activa 90° (dolorosa), pasiva 150°', fuerza:'Supraespinoso 3/5 (Jobe +)', pruebasEspeciales:'Hawkins +, Jobe +', palpacion:'Dolor subacromial', marcha:'No aplica', inflamacion:'No' };
  p2.dxFuncional={ dxClinico:'Tendinopatía del manguito con déficit de abducción y fuerza.', objetivosCP:'Abducción activa a 120° sin dolor en 4 semanas.', objetivosLP:'Recuperar actividades de la vida diaria por encima de la cabeza.', pronostico:'Favorable con rehabilitación', limitaciones:'Peinarse, alcanzar estantes altos' };
  p2.antecedentes={ patologicos:'Madre con artritis reumatoide', cirugias:'Osteosíntesis de muñeca izquierda (placa) 2019', medicamentos:'Anticoagulante (acenocumarol)', deportivos:'Sedentaria' };
  p2.seguridadClinica={ tienePrecaucion:true, implantes:['Material de osteosíntesis'], implantesDetalle:'Placa en muñeca izquierda (2019)', condiciones:['Anticoagulantes'], condicionesObs:'Acenocumarol', banderasRojas:['Otro'], banderasDetalle:'Anticoagulación — precaución con agentes físicos/punción', contraindicaciones:'No RF/tecar térmica/US térmico sobre el material' };
  p2.soap=[ soap('28/10/2026','DAF','7','5','Dolor 7/10 nocturno','Abducción activa 90°','Limitación por dolor','Movilidad asistida + isométricos','Ejercicio terapéutico, Electroterapia (TENS)') ];
  p2.ejercicios=[ ej('Péndulo de Codman','3×30 s · 2×/día','Deja colgar el brazo y haz círculos suaves. Sin forzar.') ];
  p2.estudiosDocs=[ est('US hombro izquierdo','ultrasonido','Tendinopatía del supraespinoso sin rotura') ];
  p2.biomecanica=[ bioGonio('28/10/2026',{k:'hombro_abd',t:'Abducción de hombro'},92,180) ];
  P.push(p2);

  // 3) Dermato funcional (rosa) — post-quirúrgico
  var p3 = base('p_demo_0003','Ana Torres Demo',41,'Femenino','JESS','Post-lipoabdominoplastia (fibrosis)',5);
  p3.motivo={ padecimiento:'Acude para rehabilitación post-quirúrgica tras lipoabdominoplastia hace 3 semanas; refiere endurecimiento y edema en abdomen.', mecanismo:'Post-cirugía', zonaPrincipal:'Abdomen', lado:'Bilateral', desdeCuando:'3 semanas', evolucion:'Mejorando', dxMedico:'Post-lipoabdominoplastia' };
  p3.valoracion={ eva:'3', rom:'', fuerza:'', pruebasEspeciales:'', palpacion:'', marcha:'',
    dermato:{ es:true, version:6, tipos:['postqx'], procedimiento:'Lipoabdominoplastia', fechaCirugia:'2026-11-01', cirujano:'Dr. Demo', hallazgosQx:'Lipoaspiración de flancos + plicatura de rectos', complicaciones:['Ninguna'], fototipo:'III', edema:'+2', equimosis:'Flancos', fibrosis:'N1', fibrosisZonas:'Hemiabdomen inferior', cicatriz:'Plana móvil', drenajes:'Retirados', faja:'Cumple', autorizacionCirujano:'Sí sin restricciones', equipos:['DLM','Presoterapia','Corriente Aura'], frecuencia:'3×/semana', planEstetico:'F1 desinflamatoria: DLM + presoterapia + Corriente Aura', objetivoEstetico:'Reducir edema y prevenir fibrosis' } };
  p3.dxFuncional={ dxClinico:'Fibroedema post-lipoabdominoplastia en fase inflamatoria.', objetivosCP:'Reducir edema por godete de +2 a +1 en 3 semanas.', objetivosLP:'Cicatriz plana y móvil, sin fibrosis, a las 12 semanas.', pronostico:'Favorable', limitaciones:'Uso de faja, no esfuerzos' };
  p3.antecedentes={ patologicos:'Sin relevantes', cirugias:'Lipoabdominoplastia 2026', medicamentos:'Analgésico', deportivos:'Pilates' };
  p3.seguridadClinica={ tienePrecaucion:false, implantes:[], condiciones:[], banderasRojas:[], contraindicaciones:'' };
  p3.soap=[ soap('18/11/2026','JESS','3','2','Tirantez abdominal','Edema +2 por godete; fibrosis N1','Evolución esperada','DLM + presoterapia','Drenaje linfático, Presoterapia, Corriente Aura','derma') ];
  p3.ejercicios=[];
  p3.estudiosDocs=[];
  p3.biomecanica=[];
  P.push(p3);

  // 4) Lumbalgia (agenda hoy, nota completa)
  var p4 = base('p_demo_0004','Carlos Ramírez Demo',47,'Masculino','CAMI','Lumbalgia mecánica inespecífica',3);
  p4.motivo={ padecimiento:'Dolor lumbar bajo sin irradiación, aparece tras estar sentado mucho tiempo en la oficina.', mecanismo:'Postural / sobreuso', zonaPrincipal:'Columna lumbar', lado:'Central', desdeCuando:'6 semanas', evolucion:'Fluctuante', dxMedico:'Lumbalgia mecánica inespecífica' };
  p4.valoracion={ eva:'5', rom:'Flexión lumbar limitada 50%', fuerza:'Core 3/5', pruebasEspeciales:'SLR negativo', palpacion:'Contractura paravertebral', marcha:'Normal', inflamacion:'No' };
  p4.dxFuncional={ dxClinico:'Lumbalgia mecánica con déficit de control motor del core.', objetivosCP:'Reducir dolor y mejorar tolerancia a sedestación.', objetivosLP:'Reincorporación laboral sin dolor.', pronostico:'Muy favorable', limitaciones:'Estar sentado >1 h' };
  p4.antecedentes={ patologicos:'Hipertensión (padre)', cirugias:'Ninguna', medicamentos:'Losartán', deportivos:'Caminata' };
  p4.seguridadClinica={ tienePrecaucion:false, implantes:[], condiciones:['Diabetes'], condicionesObs:'Tipo 2 controlada', banderasRojas:[], contraindicaciones:'' };
  p4.soap=[ soap('20/11/2026','CAMI','5','3','Dolor 5/10 al final del día','Flexión lumbar 50%','Mejora de movilidad','Educación + ejercicio graduado + termoterapia','Ejercicio terapéutico, Termoterapia') ];
  p4.ejercicios=[ ej('Bird-dog','3×10 por lado · diario','Mantén la espalda neutra, extiende brazo y pierna opuestos lentamente.') ];
  p4.estudiosDocs=[];
  p4.biomecanica=[];
  P.push(p4);

  // 5) Migrado histórico (mig_pac_) — para mostrar estilo migrado
  var p5 = base('mig_pac_demo00000005','Rosa Jiménez Demo',63,'Femenino','DUL','Gonartrosis bilateral',20);
  p5.date='2026-10-15'; p5.creadoPor='MIGRACION';
  p5.motivo={ padecimiento:'Dolor crónico en ambas rodillas, mayor a la izquierda, al caminar y subir escaleras.', mecanismo:'Degenerativo', zonaPrincipal:'Rodilla', lado:'Bilateral', desdeCuando:'2 años', evolucion:'Crónica', dxMedico:'Gonartrosis grado II-III' };
  p5.valoracion={ eva:'5', rom:'Flexión 110° bilateral', fuerza:'Cuádriceps 4/5', pruebasEspeciales:'Crepitación +', palpacion:'Dolor interlínea medial', marcha:'Antiálgica', inflamacion:'Leve' };
  p5.dxFuncional={ dxClinico:'Gonartrosis con déficit de fuerza y movilidad.', objetivosCP:'Control del dolor y fortalecimiento.', objetivosLP:'Mantener independencia funcional.', pronostico:'Reservado', limitaciones:'Escaleras, caminatas largas' };
  p5.antecedentes={ patologicos:'Diabetes e HTA (familiares)', cirugias:'Ninguna', medicamentos:'Paracetamol', deportivos:'Sedentaria' };
  p5.seguridadClinica={ tienePrecaucion:false, implantes:[], condiciones:[], banderasRojas:[], contraindicaciones:'' };
  p5.soap=[ soap('15/10/2026','DUL','5','4','Dolor 5/10 al caminar','Flexión 110°','Estable','Fortalecimiento + termoterapia','Ejercicio terapéutico, Termoterapia') ];
  p5.ejercicios=[]; p5.estudiosDocs=[]; p5.biomecanica=[];
  P.push(p5);

  // 6) Alta reciente (agenda hoy), expediente incompleto — para mostrar semáforo "qué falta"
  var p6 = base('p_demo_0006','Luis Hernández Demo',29,'Masculino','ZARA','Esguince de tobillo lateral derecho',1);
  p6.motivo={ padecimiento:'Torcedura de tobillo derecho jugando fútbol hace 1 semana, con inflamación y dolor al apoyar.', mecanismo:'Inversión forzada (gesto deportivo)', zonaPrincipal:'Tobillo', lado:'Derecho', desdeCuando:'1 semana', evolucion:'Aguda', dxMedico:'' };
  p6.valoracion={ eva:'6', rom:'Dorsiflexión limitada', fuerza:'No evaluado', pruebasEspeciales:'No evaluado', palpacion:'Dolor en ligamento peroneo-astragalino anterior', marcha:'Con cojera', inflamacion:'Moderada' };
  p6.dxFuncional={ dxClinico:'', objetivosCP:'', objetivosLP:'', pronostico:'', limitaciones:'' };
  p6.antecedentes={ patologicos:'', cirugias:'', medicamentos:'', deportivos:'Fútbol amateur' };
  p6.seguridadClinica={ tienePrecaucion:false, implantes:[], condiciones:[], banderasRojas:[], contraindicaciones:'' };
  p6.soap=[]; p6.ejercicios=[]; p6.estudiosDocs=[]; p6.biomecanica=[];
  P.push(p6);

  window.__SEED_PACIENTES = P;

  window.__demoBoot = function(){
    try{
      // Fecha de agenda: los 4 primeros + el 6 caen HOY
      var hoy = (window.todayISO || HOY);
      P.forEach(function(p,i){ if(i!==2 && i!==4) p.date=hoy; }); // p3(derma) y p5(migrado) con otra fecha
      // Siembra directa de la base
      window.patientsDB = P.slice();
      try{ localStorage.setItem('sinergia_pts', JSON.stringify(P)); }catch(e){}
      // Neutraliza el backend: getPacientes devuelve el seed; todo lo demás ok benigno
      window.callAppsScriptPrivado = function(action){
        if(action==='getPacientes') return Promise.resolve(P.slice());
        return Promise.resolve({ ok:true, guardados:1 });
      };
      try{ window.callAppsScript = window.callAppsScriptPrivado; }catch(e){}
      // Red: cualquier fetch al backend → ok benigno (por si algo lo llama directo)
      var _f = window.fetch;
      window.fetch = function(u, o){
        try{
          var s = (typeof u==='string')?u:(u&&u.url)||'';
          if(/script\.google\.com|googleapis\.com|gstatic\.com/.test(s)){
            return Promise.resolve(new Response(JSON.stringify({ok:true}), {status:200, headers:{'Content-Type':'application/json'}}));
          }
        }catch(e){}
        return _f ? _f.apply(this, arguments) : Promise.reject(new Error('no fetch'));
      };
      // Entra como SUPERVISOR (ve los 4 módulos del nav)
      var perfil = { name:'DEMO', role:'supervisor', initials:'DS' };
      entrarComo(perfil, 'demo.supervisor@sinergia.local', true);
      window.__DEMO_BOOTED__ = true;
      return true;
    }catch(e){ console.error('demoBoot error', e); return false; }
  };
})();
