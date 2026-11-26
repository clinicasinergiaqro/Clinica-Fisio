/* SINERGIA · Motor de Seguridad Clínica V2 (prototipo, determinista, versionado)
 * version 2.0.0-proto · 2026-11-26 · BORRADOR, requiere firma del fisioterapeuta.
 * No diagnostica ni autoriza tratamiento por sí solo. Reglas "pendiente" NO bloquean
 * automáticamente. Agentes físicos: NO bloqueo total; se evalúa (modalidad,región,equipo,restricción).
 * Corre en Node (module.exports) y navegador (window.MotorSeguridadV2).
 */
(function (root) {
  'use strict';

  var VERSION = '2.0.0-proto';
  var norm = function (s) {
    return String(s == null ? '' : s)
      .normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();
  };
  var any = function (txt, kws) { txt = norm(txt); return kws.some(function (k) { return txt.indexOf(k) !== -1; }); };

  // Catálogo de reglas. Cada regla: id, clasificacion, estado(verificada|pendiente), fundamento, fuente, accion, test(h)->{hit, detalle, agente?}
  var CLASES = {
    EMERGENCIA: 'emergencia',
    DERIVACION: 'derivacion_prioritaria',
    BLOQUEO: 'bloqueo_por_dato_inconsistente',
    PRECAUCION: 'precaucion_especifica',
    SIN: 'sin_alerta_detectada_con_datos_disponibles'
  };

  // h = hechos normalizados: { segBlob, condiciones[], implantes[], cirugias, medicamentos,
  //   oncologico(bool), banderas, dolorNocturno(bool), deficitNeuro(bool), caudaEquina(bool),
  //   edad, pediatrico(bool), traumaCervicalAxial(bool), ladoConflicto(bool), region, lado,
  //   ligamentoIpsilateralPrevio(bool), cribadoDocumentado(bool), ... }
  var REGLAS = [
    { id: 'A2', clasificacion: CLASES.EMERGENCIA, estado: 'verificada',
      fundamento: 'Posible síndrome de cauda equina.',
      fuente: 'NICE NG234',
      accion: 'Urgencia: derivación inmediata. No tratamiento rutinario ni pruebas provocativas.',
      test: function (h) { return { hit: !!h.caudaEquina }; } },

    { id: 'A4', clasificacion: CLASES.EMERGENCIA, estado: 'verificada',
      fundamento: 'Trauma cervical pediátrico con carga axial sin descartar lesión.',
      fuente: 'ACR Suspected Spine Trauma–Child',
      accion: 'Valoración médica urgente. No provocar movimiento para medir. Bloquear tratamiento rutinario.',
      test: function (h) { return { hit: !!(h.pediatrico && h.traumaCervicalAxial && !h.lesionCervicalDescartada) }; } },

    { id: 'A1', clasificacion: CLASES.DERIVACION, estado: 'verificada',
      fundamento: 'Dolor espinal, nuevo/persistente, nocturno o en reposo, o déficit neurológico, o paciente pediátrico con dolor óseo, en contexto oncológico (descartar metástasis/compresión).',
      fuente: 'NICE NG234',
      accion: 'Evaluación médica para descartar causa oncológica antes de progresar. Confirmar estado activo/remisión (no inferir por antigüedad). Agentes térmicos/RF/US sobre región tumoral: contraindicados salvo aval documentado.',
      test: function (h) { return { hit: !!(h.oncologico && (h.dolorNocturno || h.deficitNeuro || h.dolorPersistente || h.regionEspinal || h.pediatrico || h.oncoActivo)) }; } },

    { id: 'A1b', clasificacion: CLASES.PRECAUCION, estado: 'verificada', agente: true,
      fundamento: 'Antecedente/condición oncológica: precaución con agentes físicos térmicos/RF/US sobre la región; confirmar estado actual.',
      fuente: 'NICE NG234 / contraindicación estándar de agentes físicos',
      accion: 'Verificar estado oncológico (activo vs remisión, no inferir). Evitar térmico/RF/US sobre región tumoral salvo aval documentado; otras modalidades/regiones según restricción documentada.',
      test: function (h) { return { hit: !!h.oncologico }; } },

    { id: 'A3', clasificacion: CLASES.DERIVACION, estado: 'verificada',
      fundamento: 'Signos de compromiso neurológico que requieren derivación (mielopatía, déficit progresivo, denervación referida).',
      fuente: 'NICE NG127',
      accion: 'Valoración neurológica/médica. No manipular/traccionar cérvix sin descartar mielopatía.',
      test: function (h) { return { hit: !!h.deficitNeuroDerivacion }; } },

    { id: 'A5', clasificacion: CLASES.PRECAUCION, estado: 'verificada', agente: true,
      fundamento: 'Implante electrónico (marcapaso/DAI).',
      fuente: 'Contraindicación estándar de agentes físicos',
      accion: 'Contraindicadas electroterapia, tecar/diatermia, US y ondas cerca del dispositivo. Verificar con cardiología.',
      test: function (h) { return { hit: any(h.segBlob, ['marcapaso', 'desfibrilador', 'dai', 'implante electronico']) }; } },

    { id: 'B1', clasificacion: CLASES.PRECAUCION, estado: 'pendiente', agente: true,
      fundamento: 'Material de osteosíntesis / prótesis metálica.',
      fuente: 'Verificar por equipo/fabricante',
      accion: 'Evitar RF/diatermia/tecar térmica/US térmico SOBRE el material. Láser de baja potencia NO contraindicado por metal. Validar región+modalidad+equipo.',
      test: function (h) { return { hit: any(h.segBlob + ' ' + h.cirugias, ['osteosintesis', 'placa', 'clavo', 'tornillo', 'protesis', 'artrodesis', 'ancla']) }; } },

    { id: 'B2', clasificacion: CLASES.PRECAUCION, estado: 'pendiente',
      fundamento: 'Osteoporosis.',
      fuente: 'Pendiente de validación',
      accion: 'Evitar manipulación forzada/HVLA y alto impacto no autorizado. Carga gradual supervisada.',
      test: function (h) { return { hit: any(h.segBlob, ['osteoporos']) }; } },

    { id: 'B3', clasificacion: CLASES.PRECAUCION, estado: 'pendiente',
      fundamento: 'Anticoagulación / antiagregación.',
      fuente: 'Pendiente de validación',
      accion: 'Precaución con punción seca, masaje profundo, ondas de choque, tracciones. Vigilar hematomas.',
      test: function (h) { return { hit: any(h.segBlob + ' ' + h.medicamentos, ['anticoagul', 'warfarina', 'acenocumarol', 'rivaroxab', 'apixab', 'dabigatr', 'aspirina', 'clopidogrel', 'heparina']) }; } },

    { id: 'B4', clasificacion: CLASES.PRECAUCION, estado: 'pendiente',
      fundamento: 'Enfermedad inflamatoria/autoinmune + inmunosupresor.',
      fuente: 'Pendiente de validación',
      accion: 'Considerar actividad inflamatoria y riesgo infeccioso (no atribuir todo a tendinopatía). Cautela con invasivas; inestabilidad cervical en AR.',
      test: function (h) { return { hit: any(h.segBlob + ' ' + h.medicamentos, ['artritis reumatoide', 'reumatoide', 'lupus', 'esclerodermia', 'dermatomiositis', 'golimumab', 'simponi', 'metotrexato', 'biologico', 'inmunosupres', 'adalimumab', 'etanercept']) }; } },

    { id: 'B5', clasificacion: CLASES.PRECAUCION, estado: 'pendiente',
      fundamento: 'Diabetes (condición del paciente).',
      fuente: 'Pendiente de validación',
      accion: 'Precaución con sensibilidad/cicatrización y agentes térmicos en zonas insensibles. Cribar neuropatía.',
      test: function (h) { return { hit: !!h.diabetesPersonal }; } },

    { id: 'B6', clasificacion: CLASES.PRECAUCION, estado: 'pendiente',
      fundamento: 'Antecedente cardiovascular / HTA.',
      fuente: 'Pendiente de validación',
      accion: 'Dosificar ejercicio con monitoreo. Derivar ante síntomas de alarma. Evitar Valsalva no controlada.',
      test: function (h) { return { hit: any(h.segBlob + ' ' + h.medicamentos, ['infarto', 'cardiop', 'hipertens', 'hta', 'anticoagulado por']) }; } },

    { id: 'B7', clasificacion: CLASES.PRECAUCION, estado: 'pendiente', agente: true,
      fundamento: 'Embarazo.',
      fuente: 'Pendiente de validación',
      accion: 'Contraindicados varios agentes (RF/US sobre abdomen/pelvis, ondas, ciertas corrientes). Verificar modalidad/región.',
      test: function (h) { return { hit: any(h.segBlob, ['embaraz', 'gestante', 'gestacion']) }; } },

    { id: 'B9', clasificacion: CLASES.BLOQUEO, estado: 'pendiente',
      fundamento: 'Cirugía ligamentaria previa ipsilateral + nuevo mecanismo: descartar fallo del injerto.',
      fuente: 'Pendiente de validación',
      accion: 'Descartar lesión del injerto u otra lesión antes de progresar. No afirmar derrame/fallo sin exploración.',
      test: function (h) { return { hit: !!h.ligamentoIpsilateralPrevio }; } },

    { id: 'B10', clasificacion: CLASES.BLOQUEO, estado: 'verificada',
      fundamento: 'Conflicto de lado/región no resuelto.',
      fuente: 'Regla de proceso',
      accion: 'Bloquear plan lateralizado y carga hasta reconciliar. Primera acción: aclarar lado/región.',
      test: function (h) { return { hit: !!h.ladoConflicto }; } }
  ];

  function evaluar(h) {
    h = h || {};
    var alertas = [];
    REGLAS.forEach(function (r) {
      var res;
      try { res = r.test(h); } catch (e) { res = { hit: false }; }
      if (res && res.hit) {
        alertas.push({
          regla: r.id,
          clasificacion: r.clasificacion,
          fundamento: r.fundamento + (res.detalle ? ' ' + res.detalle : ''),
          fuente: r.fuente,
          estado: r.estado,
          es_agente_fisico: !!r.agente,
          accion: r.accion
        });
      }
    });

    // Regla de honestidad B11: si no hay cribado documentado, decirlo.
    var cribado = !!h.cribadoDocumentado;

    // Estado global: el más severo.
    var orden = [CLASES.EMERGENCIA, CLASES.DERIVACION, CLASES.BLOQUEO, CLASES.PRECAUCION];
    var estado = CLASES.SIN;
    for (var i = 0; i < orden.length; i++) {
      if (alertas.some(function (a) { return a.clasificacion === orden[i]; })) { estado = orden[i]; break; }
    }
    // Bloquea el plan terapéutico si hay emergencia, derivación prioritaria o bloqueo por dato.
    var bloquea = (estado === CLASES.EMERGENCIA || estado === CLASES.DERIVACION || estado === CLASES.BLOQUEO);

    var nota = '';
    if (estado === CLASES.SIN) {
      nota = cribado ? 'Sin alerta detectada con los datos disponibles.'
                     : 'Sin alerta detectada; cribado de banderas rojas NO documentado (no equivale a "sin banderas rojas").';
    }

    return {
      version: VERSION,
      estado: estado,
      cribado_documentado: cribado,
      nota: nota,
      alertas: alertas,
      bloquea_plan: bloquea
    };
  }

  // Evalúa un agente físico puntual: (modalidad, region, equipo) vs reglas de agente + restricción documentada.
  // Devuelve: permitido | permitido_con_precaucion | verificar | contraindicado
  function evaluarAgente(h, modalidad, region) {
    var m = norm(modalidad);
    var termico = any(m, ['rf', 'radiofrecuencia', 'diatermia', 'tecar', 'ultrasonido termico', 'us termico', 'onda corta']);
    var electromagnetico = any(m, ['electro', 'tens', 'russian', 'interferencial', 'corriente', 'tecar', 'rf', 'ondas de choque', 'us', 'ultrasonido']);
    // marcapaso
    if (any(h.segBlob, ['marcapaso', 'desfibrilador', 'dai', 'implante electronico']) && electromagnetico) {
      return { estado: 'contraindicado', motivo: 'Implante electrónico cerca de la región: evitar modalidad electromagnética (A5).' };
    }
    // oncológico activo + térmico sobre región tumoral
    if (h.oncologico && termico) {
      return { estado: h.restriccionDocumentada ? 'contraindicado' : 'verificar', motivo: 'Antecedente/condición oncológica: térmico/RF sobre región tumoral contraindicado salvo aval documentado (A1).' };
    }
    // metal + térmico sobre el material
    if (any(h.segBlob + ' ' + h.cirugias, ['osteosintesis', 'placa', 'clavo', 'tornillo', 'protesis', 'ancla']) && termico) {
      return { estado: 'permitido_con_precaucion', motivo: 'Metal: evitar térmico/RF SOBRE el material; aplicar atérmico o lejos del material; láser baja potencia permitido (B1).' };
    }
    // embarazo + térmico/US sobre abdomen/pelvis
    if (any(h.segBlob, ['embaraz']) && termico && any(region, ['abdomen', 'pelvis', 'lumbar'])) {
      return { estado: 'contraindicado', motivo: 'Embarazo: evitar térmico/US sobre abdomen/pelvis (B7).' };
    }
    return { estado: 'permitido', motivo: 'Sin restricción documentada aplicable; verificar restricción específica del expediente y fabricante.' };
  }

  var API = { version: VERSION, CLASES: CLASES, REGLAS: REGLAS, evaluar: evaluar, evaluarAgente: evaluarAgente, _norm: norm, _any: any };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.MotorSeguridadV2 = API;
})(typeof window !== 'undefined' ? window : globalThis);
