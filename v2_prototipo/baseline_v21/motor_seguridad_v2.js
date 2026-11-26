/* SINERGIA · Motor de Seguridad Clínica V2.1 (prototipo, determinista, versionado)
 * version 2.1.0-proto · 2026-11-26 · BORRADOR, requiere firma del fisioterapeuta.
 * Consume los HECHOS del extractor_v2 (negación/temporalidad/lateralidad ya resueltas).
 * No diagnostica ni autoriza tratamiento por sí solo.
 * Clasificación de reglas: emergencia | derivacion_prioritaria | bloqueo_por_dato_inconsistente
 *   | precaucion_especifica | error_regla | sin_alerta_detectada_con_datos_disponibles.
 * Estado de regla: verificada | pendiente_validacion. Una regla PENDIENTE nunca silencia ni
 *   bloquea sola: surge como precaución etiquetada "requiere validación".
 * Las excepciones de una regla NO se clasifican como "sin alerta": se reportan como error_regla.
 * Agentes físicos: matriz (modalidad, región, equipo, condición, restricción) → nunca "permitido"
 *   automático ante modalidad desconocida o datos insuficientes (devuelve "verificar").
 * Corre en Node (module.exports) y navegador (window.MotorSeguridadV2).
 */
(function (root) {
  'use strict';

  var VERSION = '2.1.0-proto';
  var CATALOGO_VERSION = '2026-11-26.a';

  var norm = function (s) { return String(s == null ? '' : s).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
  var any = function (txt, kws) { txt = norm(txt); return kws.some(function (k) { return txt.indexOf(norm(k)) !== -1; }); };

  var CLASES = {
    EMERGENCIA: 'emergencia',
    DERIVACION: 'derivacion_prioritaria',
    BLOQUEO: 'bloqueo_por_dato_inconsistente',
    PRECAUCION: 'precaucion_especifica',
    ERROR: 'error_regla',
    SIN: 'sin_alerta_detectada_con_datos_disponibles'
  };

  // Catálogo versionado. estado: 'verificada' | 'pendiente_validacion'. agente: involucra agentes físicos.
  var REGLAS = [
    { id: 'E1', clasificacion: CLASES.EMERGENCIA, estado: 'verificada',
      fundamento: 'Posible síndrome de cauda equina (anestesia en silla de montar / retención / incontinencia nueva).',
      fuente: 'NICE NG59 / NG234', accion: 'URGENCIA: derivación inmediata a servicio de urgencias. No tratamiento rutinario ni pruebas provocativas.',
      test: function (h) { return !!h.caudaEquina; } },

    { id: 'E2', clasificacion: CLASES.EMERGENCIA, estado: 'verificada',
      fundamento: 'Sospecha de compresión medular / metástasis vertebral (MSCC).',
      fuente: 'NICE NG234 (compresión medular metastásica)', accion: 'URGENCIA oncológica: derivación inmediata. No manipular, no traccionar, no cargar. Contactar servicio tratante.',
      test: function (h) { return !!h.compresionMedular || !!(h.oncologico && h.deficitNeuroDerivacion && h.regionEspinal); } },

    { id: 'E3', clasificacion: CLASES.EMERGENCIA, estado: 'verificada',
      fundamento: 'Sospecha de trombosis venosa profunda (TVP) activa.',
      fuente: 'NICE NG158 (enfermedad tromboembólica venosa)', accion: 'URGENCIA: NO masaje, NO movilización vigorosa, NO compresión/termoterapia del miembro, NO ejercicio del segmento. Derivación médica para valoración (Wells/dímero-D/eco-doppler).',
      test: function (h) { return !!h.tvp; } },

    { id: 'E4', clasificacion: CLASES.EMERGENCIA, estado: 'verificada',
      fundamento: 'Trauma cervical con mecanismo de carga axial / alto riesgo sin lesión descartada (pediátrico o adulto).',
      fuente: 'Canadian C-Spine Rule / NEXUS', accion: 'Valoración médica urgente e inmovilización según protocolo. No provocar movimiento para medir. Bloquear tratamiento rutinario hasta descartar lesión ósea/ligamentaria.',
      test: function (h) { return !!(h.traumaCervicalAxial && !h.lesionCervicalDescartada); } },

    { id: 'D1', clasificacion: CLASES.DERIVACION, estado: 'verificada',
      fundamento: 'Contexto oncológico personal con dolor espinal nuevo/persistente, nocturno/en reposo o déficit neurológico (descartar causa oncológica/metástasis).',
      fuente: 'NICE NG234', accion: 'Evaluación médica para descartar causa oncológica antes de progresar. Confirmar estado activo/remisión (no inferir por antigüedad).',
      test: function (h) { return !!(h.oncologico && (h.dolorNocturno || h.deficitNeuro || h.dolorPersistente || h.regionEspinal || h.oncoActivo)); } },

    { id: 'D2', clasificacion: CLASES.DERIVACION, estado: 'verificada',
      fundamento: 'Signos de mielopatía / déficit neurológico progresivo que requieren derivación.',
      fuente: 'NICE NG127 (cervical) / juicio clínico', accion: 'Valoración neurológica/médica. No manipular ni traccionar la columna sin descartar mielopatía.',
      test: function (h) { return !!h.deficitNeuroDerivacion; } },

    { id: 'X1', clasificacion: CLASES.BLOQUEO, estado: 'verificada',
      fundamento: 'Conflicto de LADO no resuelto entre el dx referido y el registro.',
      fuente: 'Regla de proceso (integridad del dato)', accion: 'Bloquear plan lateralizado y carga hasta reconciliar. Primera acción: aclarar lado con el paciente/expediente.',
      test: function (h) { return !!h.ladoConflicto; } },

    { id: 'X2', clasificacion: CLASES.BLOQUEO, estado: 'verificada',
      fundamento: 'Conflicto de REGIÓN entre la zona codificada y el dx médico referido.',
      fuente: 'Regla de proceso (integridad del dato)', accion: 'Bloquear plan hasta reconciliar región/episodio. No fijar objetivos sobre una región no confirmada.',
      test: function (h) { return !!h.regionConflicto; } },

    { id: 'X3', clasificacion: CLASES.BLOQUEO, estado: 'pendiente_validacion',
      fundamento: 'Cirugía ligamentaria/meniscal previa IPSILATERAL + nuevo mecanismo: descartar fallo del injerto.',
      fuente: 'Pendiente de validación clínica', accion: 'Descartar lesión del injerto u otra lesión antes de progresar. No afirmar derrame/fallo sin exploración. (Si la cirugía fue CONTRALATERAL, esta regla no aplica.)',
      test: function (h) { return !!h.ligamentoIpsilateralPrevio; } },

    { id: 'P1', clasificacion: CLASES.PRECAUCION, estado: 'verificada', agente: true,
      fundamento: 'Implante electrónico (marcapaso / DAI / neuroestimulador).',
      fuente: 'Contraindicación estándar de agentes físicos', accion: 'Contraindicadas electroterapia, tecar/diatermia, US y ondas cerca del dispositivo. Verificar con cardiología.',
      test: function (h) { return !!h.marcapaso; } },

    { id: 'P2', clasificacion: CLASES.PRECAUCION, estado: 'verificada', agente: true,
      fundamento: 'Antecedente/condición oncológica personal: precaución con agentes térmicos/RF/US sobre la región.',
      fuente: 'NICE NG234 / contraindicación estándar de agentes físicos', accion: 'Verificar estado oncológico (activo vs remisión, no inferir). Evitar térmico/RF/US sobre región tumoral salvo aval documentado.',
      test: function (h) { return !!h.oncologico; } },

    { id: 'P3', clasificacion: CLASES.PRECAUCION, estado: 'pendiente_validacion', agente: true,
      fundamento: 'Material de osteosíntesis / prótesis metálica.',
      fuente: 'Verificar por equipo/fabricante', accion: 'Evitar RF/diatermia/tecar térmica/US térmico SOBRE el material. Láser de baja potencia NO contraindicado por metal. Validar región+modalidad+equipo.',
      test: function (h) { return !!h.metal; } },

    { id: 'P4', clasificacion: CLASES.PRECAUCION, estado: 'pendiente_validacion',
      fundamento: 'Osteoporosis.', fuente: 'Pendiente de validación', accion: 'Evitar manipulación forzada/HVLA y alto impacto no autorizado. Carga gradual supervisada.',
      test: function (h) { return !!h.osteoporosis; } },

    { id: 'P5', clasificacion: CLASES.PRECAUCION, estado: 'pendiente_validacion',
      fundamento: 'Anticoagulación / antiagregación.', fuente: 'Pendiente de validación', accion: 'Precaución con punción seca, masaje profundo, ondas de choque y tracciones. Vigilar hematomas.',
      test: function (h) { return !!h.anticoagulacion; } },

    { id: 'P6', clasificacion: CLASES.PRECAUCION, estado: 'pendiente_validacion',
      fundamento: 'Enfermedad inflamatoria/autoinmune (± inmunosupresor).', fuente: 'Pendiente de validación', accion: 'Considerar actividad inflamatoria y riesgo infeccioso (no atribuir todo a tendinopatía). Cautela con invasivas; vigilar inestabilidad cervical en AR.',
      test: function (h) { return !!(h.autoinmune || h.inmunosupresor); } },

    { id: 'P7', clasificacion: CLASES.PRECAUCION, estado: 'pendiente_validacion',
      fundamento: 'Diabetes (condición del paciente).', fuente: 'Pendiente de validación', accion: 'Precaución con sensibilidad/cicatrización y agentes térmicos en zonas insensibles. Cribar neuropatía.',
      test: function (h) { return !!h.diabetesPersonal; } },

    { id: 'P8', clasificacion: CLASES.PRECAUCION, estado: 'pendiente_validacion',
      fundamento: 'Antecedente cardiovascular / HTA.', fuente: 'Pendiente de validación', accion: 'Dosificar ejercicio con monitoreo. Derivar ante síntomas de alarma. Evitar Valsalva no controlada.',
      test: function (h) { return !!h.cardiovascular; } },

    { id: 'P9', clasificacion: CLASES.PRECAUCION, estado: 'pendiente_validacion', agente: true,
      fundamento: 'Embarazo.', fuente: 'Pendiente de validación', accion: 'Contraindicados varios agentes (RF/US sobre abdomen/pelvis, ondas, ciertas corrientes). Verificar modalidad/región.',
      test: function (h) { return !!h.embarazo; } }
  ];

  var ORDEN = [CLASES.EMERGENCIA, CLASES.DERIVACION, CLASES.BLOQUEO, CLASES.ERROR, CLASES.PRECAUCION];

  function evaluar(h) {
    h = h || {};
    var alertas = [];
    REGLAS.forEach(function (r) {
      var hit = false, err = null;
      try { hit = !!r.test(h); }
      catch (e) { err = String(e && e.message || e); }
      if (err !== null) {
        // NO se silencia como "sin alerta": se reporta como error_regla visible.
        alertas.push({ regla: r.id, clasificacion: CLASES.ERROR, fundamento: 'Error al evaluar la regla ' + r.id + ': ' + err + '. Revisar manualmente.', fuente: r.fuente, estado: r.estado, requiere_validacion: true, es_agente_fisico: !!r.agente, accion: 'Evaluación manual de esta regla (fallo del motor).' });
        return;
      }
      if (hit) {
        alertas.push({ regla: r.id, clasificacion: r.clasificacion, fundamento: r.fundamento, fuente: r.fuente,
          estado: r.estado, requiere_validacion: (r.estado === 'pendiente_validacion'), es_agente_fisico: !!r.agente, accion: r.accion });
      }
    });

    var cribado = !!h.cribadoDocumentado;

    var estado = CLASES.SIN;
    for (var i = 0; i < ORDEN.length; i++) {
      if (alertas.some(function (a) { return a.clasificacion === ORDEN[i]; })) { estado = ORDEN[i]; break; }
    }
    // Bloquea plan terapéutico: emergencia, derivación prioritaria, bloqueo por dato, o error de regla no resuelto.
    var bloquea = (estado === CLASES.EMERGENCIA || estado === CLASES.DERIVACION || estado === CLASES.BLOQUEO || estado === CLASES.ERROR);

    var nota = '';
    if (estado === CLASES.SIN) {
      nota = cribado ? 'Sin alerta detectada con los datos disponibles.'
                     : 'Sin alerta detectada; cribado de banderas rojas NO documentado (no equivale a "sin banderas rojas").';
    } else if (estado === CLASES.PRECAUCION && !cribado) {
      nota = 'Precauciones detectadas; cribado de banderas rojas NO documentado.';
    }

    return {
      version: VERSION, catalogo_version: CATALOGO_VERSION,
      estado: estado, cribado_documentado: cribado, nota: nota,
      alertas: alertas, bloquea_plan: bloquea,
      reglas_pendientes: alertas.filter(function (a) { return a.requiere_validacion; }).map(function (a) { return a.regla; })
    };
  }

  // Matriz de agente físico puntual. estado: contraindicado | precaucion | verificar | permitido_condicionado.
  // NUNCA "permitido" seco: ante modalidad desconocida o región/condición faltante → "verificar".
  var MODALIDADES = {
    termico: ['rf', 'radiofrecuencia', 'diatermia', 'tecar', 'onda corta', 'ultrasonido termico', 'us termico', 'microondas'],
    electro: ['electroterapia', 'electro', 'tens', 'russian', 'interferencial', 'corriente', 'estimulacion electrica', 'ems', 'fes'],
    ultrasonido: ['ultrasonido', 'us'],
    ondas: ['ondas de choque', 'onda de choque', 'eswt', 'ondas'],
    laser: ['laser', 'fotobiomodulacion', 'led'],
    manual: ['manual', 'masaje', 'movilizacion', 'puncion seca', 'traccion', 'hvla', 'manipulacion']
  };
  function _clasificarModalidad(m) {
    m = norm(m); var tipos = [];
    Object.keys(MODALIDADES).forEach(function (k) { if (MODALIDADES[k].some(function (x) { return m.indexOf(x) !== -1; })) tipos.push(k); });
    return tipos;
  }

  function evaluarAgente(h, modalidad, region) {
    h = h || {};
    var out = { modalidad: modalidad || null, region: region || null, estado: null, motivo: '', reglas: [], requiere_validacion: false };
    if (!modalidad || !String(modalidad).trim()) { out.estado = 'verificar'; out.motivo = 'Modalidad no especificada: no se puede evaluar. Capturar modalidad, equipo y región.'; out.requiere_validacion = true; return out; }
    var tipos = _clasificarModalidad(modalidad);
    if (!tipos.length) { out.estado = 'verificar'; out.motivo = 'Modalidad no reconocida por el catálogo: requiere validación del fisioterapeuta (no se asume permitida).'; out.requiere_validacion = true; return out; }
    var electromagnetico = tipos.indexOf('termico') !== -1 || tipos.indexOf('electro') !== -1 || tipos.indexOf('ultrasonido') !== -1 || tipos.indexOf('ondas') !== -1;
    var termico = tipos.indexOf('termico') !== -1 || tipos.indexOf('ultrasonido') !== -1;
    var rNorm = norm(region || '');
    var regionConocida = !!rNorm;

    // Emergencia activa sobre el segmento: no aplicar agentes al segmento afectado.
    if (h.tvp) { out.estado = 'contraindicado'; out.motivo = 'TVP activa: no aplicar agentes físicos/termo/compresión sobre el miembro afectado (E3).'; out.reglas.push('E3'); return out; }

    if (h.marcapaso && electromagnetico) { out.estado = 'contraindicado'; out.motivo = 'Implante electrónico: evitar modalidad electromagnética (P1). Verificar distancia al dispositivo.'; out.reglas.push('P1'); return out; }

    if (h.oncologico && termico) {
      out.reglas.push('P2'); out.requiere_validacion = !h.restriccionDocumentada;
      out.estado = h.restriccionDocumentada ? 'contraindicado' : 'verificar';
      out.motivo = 'Antecedente/condición oncológica: térmico/RF/US sobre región tumoral contraindicado salvo aval documentado (P2). Confirmar estado y región.';
      return out;
    }

    if (h.embarazo && termico) {
      out.reglas.push('P9');
      if (!regionConocida) { out.estado = 'verificar'; out.requiere_validacion = true; out.motivo = 'Embarazo + térmico/US: falta la región para decidir. Verificar (contraindicado sobre abdomen/pelvis/lumbar).'; return out; }
      if (any(rNorm, ['abdomen', 'pelvis', 'lumbar', 'sacro', 'cadera'])) { out.estado = 'contraindicado'; out.motivo = 'Embarazo: evitar térmico/US sobre abdomen/pelvis/lumbar (P9).'; return out; }
      out.estado = 'precaucion'; out.motivo = 'Embarazo: precaución general con agentes; región distal no pélvica, validar parámetros (P9).'; out.requiere_validacion = true; return out;
    }

    if (h.metal && termico) {
      out.reglas.push('P3'); out.requiere_validacion = true;
      if (!regionConocida) { out.estado = 'verificar'; out.motivo = 'Metal + térmico: falta región para saber si incide SOBRE el material. Verificar región y equipo/fabricante (P3).'; return out; }
      out.estado = 'precaucion'; out.motivo = 'Metal: evitar térmico/RF SOBRE el material; aplicar atérmico o lejos del material; láser baja potencia permitido (P3). Validar con equipo/fabricante.'; return out;
    }

    if (h.anticoagulacion && tipos.indexOf('ondas') !== -1) { out.estado = 'precaucion'; out.motivo = 'Anticoagulación + ondas de choque: precaución (riesgo de hematoma); validar INR/indicación (P5).'; out.reglas.push('P5'); out.requiere_validacion = true; return out; }
    if (h.anticoagulacion && tipos.indexOf('manual') !== -1 && any(modalidad, ['puncion', 'masaje profundo'])) { out.estado = 'precaucion'; out.motivo = 'Anticoagulación + técnica invasiva/profunda: precaución (P5).'; out.reglas.push('P5'); out.requiere_validacion = true; return out; }

    // Sin regla de contraindicación aplicable: NO se declara "permitido" seco.
    out.estado = 'permitido_condicionado';
    out.requiere_validacion = true;
    out.motivo = 'Sin contraindicación detectada en los datos disponibles. Permitido CONDICIONADO a: confirmar región, equipo/modelo, parámetros y restricciones del expediente/fabricante. Requiere criterio del fisioterapeuta.';
    return out;
  }

  var API = { version: VERSION, catalogo_version: CATALOGO_VERSION, CLASES: CLASES, REGLAS: REGLAS, evaluar: evaluar, evaluarAgente: evaluarAgente, _norm: norm, _any: any, _clasificarModalidad: _clasificarModalidad };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.MotorSeguridadV2 = API;
})(typeof window !== 'undefined' ? window : globalThis);
