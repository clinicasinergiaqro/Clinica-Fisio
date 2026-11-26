/* SINERGIA · Generador de Diagnóstico Funcional V2 (prototipo, determinista)
 * version 2.0.0-proto · 2026-11-26 · SOLO LECTURA · no escribe expedientes · no saveDB.
 * Produce el contrato de salida V2 a partir de un registro de expediente (anonimizado).
 * El núcleo es determinista y auditable; la prosa del dx puede refinarse luego con un
 * modelo acotado a estos mismos hechos. Node + navegador.
 */
(function (root) {
  'use strict';
  var MS = (typeof require !== 'undefined') ? require('./motor_seguridad_v2.js')
           : (root.MotorSeguridadV2);
  var VERSION = '2.0.0-proto';

  var norm = function (s) { return String(s == null ? '' : s).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
  var has = function (t, ks) { t = norm(t); return ks.some(function (k) { return t.indexOf(k) !== -1; }); };
  var VACIO = ['', 'none', 'no evaluado', 'no evaluada', 'no realizadas', 'no realizada', 'pendiente', 'por definir', '-', 'n/a', 'no especificado', 'no refiere', 'no cuenta con diagnostico medico referido', 'ninguno'];
  var lleno = function (v) { return VACIO.indexOf(norm(v).trim()) === -1 && String(v == null ? '' : v).trim() !== ''; };

  // Escalas validadas sugeridas por patología (dirección, no obligación)
  var ESCALAS = {
    'Cervicalgia': 'NDI (Neck Disability Index)',
    'Lumbalgia': 'Oswestry (ODI) / PSFS',
    'Dorsalgia': 'escala de dolor y función pertinente a la región',
    'Lesion meniscal': 'IKDC / KOOS',
    'Lesion ligamentaria': 'IKDC + hop tests (según fase)',
    'Tendinopatia': 'VISA-A (aquíleo) u homóloga de la región',
    'Hombro': 'SPADI o QuickDASH',
    'Miembro superior': 'PRWE + dinamometría de prensión',
    'Tobillo/pie': 'FAAM + Weight-Bearing Lunge Test',
    'Rodilla': 'IKDC + dinamometría + tolerancia a sentadilla',
    'Fractura': 'escala funcional de la región + goniometría',
    'Post-quirurgico': 'escala funcional de la región + ROM autorizado',
    'Radiculopatia': 'examen neurológico dirigido + escala regional',
    'Cadera': 'HOOS',
    'Otro': 'escala funcional pertinente'
  };

  function _ladoDe(txt) {
    txt = norm(txt);
    var d = /\bderech|\bder\b|\bdcho|\bderecho/.test(txt);
    var i = /\bizquierd|\bizq\b|\bizdo|\bizquierdo/.test(txt);
    if (d && !i) return 'derecho'; if (i && !d) return 'izquierdo'; return null;
  }

  // Construye los "hechos" para el motor de seguridad y la generación.
  function hechos(rec) {
    var o = rec.orig || {};
    var seg = rec.seguridadClinica || {};
    var ant = rec.antecedentes || {};
    var segBlob = norm(Object.keys(seg).map(function (k) { return seg[k]; }).join(' · '));
    var cirugias = norm(ant.cirugias || '');
    var medicamentos = norm(ant.medicamentos || '');
    var relato = norm(o.padecimiento || '');
    var dxMed = norm((o.dxMedico || '') + ' ' + (o.dxMedicoMotivo || ''));

    var onco = has(segBlob + ' ' + cirugias + ' ' + medicamentos,
      ['cancer', 'oncolog', 'tumor', 'carcinoma', 'linfoma', 'leucemia', 'metastas', 'sarcoma', 'melanoma', 'ewing', 'tamoxifeno', 'letrozol', 'mastectom', 'quimio', 'radioterap']);
    // diabetes PROPIA (seguridadClinica, no patologicos=familiar)
    var diabetesPersonal = has(segBlob, ['diabetes', 'dm2', 'dm tipo', 'insulino']);
    // lado del dx médico vs registro
    var ladoDx = _ladoDe(dxMed), ladoReg = norm(o.lado || '');
    var ladoConflicto = !!(ladoDx && lleno(ladoReg) && ladoDx !== norm(ladoReg) && (norm(ladoReg) === 'derecho' || norm(ladoReg) === 'izquierdo'));
    var zona = norm(o.zona || '');
    var ligamentoIpsilateralPrevio = has(zona, ['rodilla']) && has(cirugias, ['lca', 'cruzado', 'plastia', 'ligament', 'menisc']);
    var pediatrico = (typeof rec.edad === 'number' && rec.edad < 16) || (parseInt(rec.edad, 10) < 16);
    var traumaCervicalAxial = has(zona + ' ' + relato, ['cervical', 'cuello']) && has(relato, ['carga axial', 'clavado', 'de cabeza', 'cayo de cabeza', 'golpe en la cabeza', 'equimosis', 'axial']);
    var dolorNocturno = has(relato + ' ' + segBlob, ['noche', 'nocturn', 'en reposo', 'al dormir', 'madrugada']);
    var deficitNeuro = has(relato, ['paralisis', 'parálisis', 'pie caido', 'perdida de fuerza', 'no puedo mover', 'adormec', 'hormigue', 'parestesia', 'calambre']);
    var deficitNeuroDerivacion = has(relato + ' ' + dxMed, ['denervacion', 'enmg', 'pie caido', 'paralisis', 'mielopat']);
    var caudaEquina = has(relato, ['silla de montar', 'incontinencia', 'retencion urinaria', 'no controlo esfinter']);
    var dolorPersistente = has(relato, ['constante', 'persistente', 'todo el dia', 'siempre', 'no cede', 'no mejora']);
    var regionEspinal = has(zona + ' ' + (rec.patologia || ''), ['cervical', 'cuello', 'dorsal', 'lumbar', 'columna', 'lumbalg', 'cervicalg', 'dorsalg', 'radicul']);
    var oncoActivo = has(segBlob, ['cancer activo', 'oncolog activo', 'tumor activo', 'activo']) && onco;
    var cribadoDocumentado = lleno(o.pruebas) || has(segBlob, ['sin banderas', 'cribado']);
    var restriccionDocumentada = has(segBlob, ['contraindic', 'no aplicar', 'no rf', 'no tecar', 'evitar', 'restriccion']);

    return {
      segBlob: segBlob, cirugias: cirugias, medicamentos: medicamentos,
      oncologico: onco, diabetesPersonal: diabetesPersonal,
      ladoConflicto: ladoConflicto, ladoDx: ladoDx, lado: ladoReg, region: zona,
      ligamentoIpsilateralPrevio: ligamentoIpsilateralPrevio,
      pediatrico: pediatrico, traumaCervicalAxial: traumaCervicalAxial, lesionCervicalDescartada: false,
      dolorNocturno: dolorNocturno, deficitNeuro: deficitNeuro, deficitNeuroDerivacion: deficitNeuroDerivacion,
      caudaEquina: caudaEquina, dolorPersistente: dolorPersistente, regionEspinal: regionEspinal, oncoActivo: oncoActivo,
      cribadoDocumentado: cribadoDocumentado, restriccionDocumentada: restriccionDocumentada
    };
  }

  function conflictos(rec, h) {
    var o = rec.orig || {}; var out = [];
    if (h.ladoConflicto) out.push({ tipo: 'lado', detalle: 'Dx médico indica ' + h.ladoDx + ' y el registro indica ' + h.lado + '.', accion: 'Aclarar lateralidad antes de tratar; bloquear plan lateralizado.' });
    // región: zona codificada vs dx médico
    var zona = norm(o.zona || ''), dxMed = norm((o.dxMedico || '') + ' ' + (o.dxMedicoMotivo || ''));
    if (lleno(zona) && lleno(dxMed)) {
      var pares = [['cadera', 'lumbalg'], ['cervical', 'tobillo'], ['tobillo', 'cervical'], ['rodilla', 'tobillo']];
      pares.forEach(function (p) { if (zona.indexOf(p[0]) !== -1 && dxMed.indexOf(p[1]) !== -1) out.push({ tipo: 'region', detalle: 'Zona codificada "' + p[0] + '" vs dx médico "' + p[1] + '".', accion: 'Reconciliar región/episodio.' }); });
    }
    return out;
  }

  // Normaliza un valor de valoración a estado controlado (conserva original)
  function estado(v) {
    if (v == null || String(v).trim() === '') return { estado: 'no_evaluado', original: v };
    var n = norm(v);
    if (VACIO.indexOf(n.trim()) !== -1) return { estado: (n.indexOf('no realiz') !== -1 || n.indexOf('no evalu') !== -1) ? 'no_evaluado' : 'desconocido', original: v };
    return { estado: 'alterado_o_documentado', original: v };
  }

  function dxFuncional(rec, h) {
    var o = rec.orig || {};
    var reg = lleno(o.zona) ? o.zona.replace('_', '/') : 'región por precisar';
    var lado = lleno(o.lado) ? (' ' + o.lado) : '';
    var contexto = lleno(o.dxMedico) && norm(o.dxMedico).indexOf('no cuenta') === -1 ? ('dx médico referido: ' + o.dxMedico) :
      (lleno(o.dxMedicoMotivo) ? ('dx referido: ' + o.dxMedicoMotivo) : 'sin diagnóstico médico referido');
    var sintomas = [];
    if (lleno(o.eva)) sintomas.push('EVA ' + o.eva + (/^\d+$/.test(String(o.eva).trim()) ? '/10' : ''));
    if (lleno(o.inflamacion)) sintomas.push('inflamación referida');
    if (h.dolorNocturno) sintomas.push('dolor nocturno/en reposo');
    if (h.deficitNeuro) sintomas.push('síntomas neurales referidos');
    var crono = lleno(o.desdeCuando) ? (' Evolución: ' + o.desdeCuando + '.') : '';
    var faltan = [];
    ['rom', 'fuerza', 'pruebas'].forEach(function (k) { if (!lleno(o[k])) faltan.push(k === 'rom' ? 'ROM' : (k === 'fuerza' ? 'fuerza' : 'pruebas especiales')); });
    var pend = faltan.length ? (' Exploración objetiva pendiente (' + faltan.join(', ') + '): diagnóstico PROVISIONAL.') : '';
    var relatoCorto = lleno(o.padecimiento) && String(o.padecimiento).trim().length >= 15;
    if (!relatoCorto) return { texto: 'Anamnesis insuficiente para un diagnóstico funcional. Primera acción: RECAPTURAR la historia (zona, lado, EVA, mecanismo y limitación).', estado: 'provisional' };
    var txt = 'Disfunción de ' + reg + lado + ' en contexto de ' + contexto +
      (sintomas.length ? ', caracterizada por ' + sintomas.join(', ') : ', con síntomas por precisar') +
      '.' + crono + pend;
    return { texto: txt, estado: 'provisional' };
  }

  function hipotesis(rec, h) {
    var o = rec.orig || {}; var out = [];
    if (lleno(o.dxMedico) && norm(o.dxMedico).indexOf('no cuenta') === -1) {
      out.push({ texto: 'Hipótesis estructural a partir del dx médico referido: ' + o.dxMedico + ' (referido, a confirmar).', sustento: ['dx médico referido'], pendiente: ['confirmar con exploración/imagen pertinente'] });
    }
    return out;
  }

  function objetivos(rec, h, seguridad) {
    var pat = rec.patologia || 'Otro'; var escala = ESCALAS[pat] || ESCALAS['Otro'];
    var prioridad = (rec.orig && lleno(rec.orig.deportivos)) ? rec.orig.deportivos : 'su actividad prioritaria';
    var base = [
      { fase: 'corto', actividad: 'control de la irritabilidad y protección; medir línea base de la función/zona afectada', indicador: 'EVA contextualizada + ' + escala, linea_base: lleno(rec.orig && rec.orig.eva) ? (rec.orig.eva + '') : null, meta_propuesta: null, unidad: null, metodo: 'escala/goniometría', reevaluacion: '1–2 semanas', criterio_cumplimiento: null, evidencias: [] },
      { fase: 'mediano', actividad: 'recuperar la movilidad y la función básica de la zona', indicador: escala + ' + ROM (goniómetro)', linea_base: null, meta_propuesta: null, unidad: 'grados/puntaje', metodo: 'goniometría de cámara + escala', reevaluacion: '3–6 semanas', criterio_cumplimiento: null, evidencias: [] },
      { fase: 'largo', actividad: 'retorno a ' + prioridad + ' según criterios', indicador: escala + ' + prueba funcional pertinente', linea_base: null, meta_propuesta: null, unidad: null, metodo: 'prueba funcional + comparación bilateral si pertinente y con referencia válida', reevaluacion: 'por criterios', criterio_cumplimiento: null, evidencias: [] }
    ];
    if (seguridad.bloquea_plan) {
      base.unshift({ fase: 'seguridad', actividad: 'resolver la acción de seguridad antes de fijar objetivos terapéuticos', indicador: 'acción de seguridad del motor', linea_base: null, meta_propuesta: null, unidad: null, metodo: null, reevaluacion: 'inmediata', criterio_cumplimiento: 'alerta resuelta/derivación realizada', evidencias: [] });
    }
    return base;
  }

  function plan(rec, seguridad) {
    if (seguridad.bloquea_plan) {
      var acc = (seguridad.alertas[0] && seguridad.alertas[0].accion) || 'resolver la alerta de seguridad.';
      return null; // plan bloqueado; la acción vive en seguridad
    }
    // andamiaje mínimo de plan por fases (editable; sin recetar dosis sin datos)
    return {
      estado: 'propuesta_editable',
      fases: [
        { nombre: 'Fase 1 · control de síntomas', objetivo: 'reducir irritabilidad y proteger', ejemplos: ['movilidad indolora', 'isométricos submáximos si tolera'], agentes_fisicos: 'según §C del motor (modalidad/región/equipo)', puede: ['movilidad en rango sin dolor'], no_puede: ['carga/impacto provocador de dolor'], criterio_progresion: 'tolerancia sin aumento de síntomas' },
        { nombre: 'Fase 2 · recuperación funcional', objetivo: 'restaurar ROM y fuerza', ejemplos: ['fortalecimiento progresivo', 'control motor'], criterio_progresion: 'ROM/fuerza medidos en progreso' },
        { nombre: 'Fase 3 · retorno', objetivo: 'retorno a actividad/deporte por criterios', ejemplos: ['reeducación del gesto', 'pliometría si aplica'], criterio_alta: 'criterios funcionales + simetría medida si pertinente' }
      ],
      nota: 'Dosis y ejercicios concretos requieren línea base medida; propuesta editable por el fisioterapeuta.'
    };
  }

  function generar(rec, opts) {
    opts = opts || {};
    var h = hechos(rec);
    var seguridad = MS.evaluar(h);
    var confl = conflictos(rec, h);
    var dxf = dxFuncional(rec, h);
    var pend = [];
    var o = rec.orig || {};
    ['rom', 'fuerza', 'pruebas'].forEach(function (k) { if (!lleno(o[k])) pend.push('Medir ' + (k === 'rom' ? 'ROM (goniómetro)' : (k === 'fuerza' ? 'fuerza (método explícito)' : 'pruebas especiales pertinentes'))); });
    if (seguridad.estado === 'derivacion_prioritaria' || seguridad.estado === 'emergencia') pend.unshift('Resolver seguridad: ' + (seguridad.alertas[0] ? seguridad.alertas[0].accion : ''));
    confl.forEach(function (c) { if (c.tipo === 'lado' || c.tipo === 'region') pend.push('Aclarar ' + c.tipo + ': ' + c.detalle); });

    var contrato = {
      version_generador: VERSION,
      episodio: rec.codigo || null,
      fecha_corte: opts.fecha_corte || null,
      diagnostico_funcional: { texto: dxf.texto, estado: dxf.estado, evidencias: [] },
      hipotesis: hipotesis(rec, h),
      seguridad: {
        estado: seguridad.estado,
        cribado_documentado: seguridad.cribado_documentado,
        nota: seguridad.nota,
        alertas: seguridad.alertas,
        bloquea_plan: seguridad.bloquea_plan
      },
      discrepancias: confl,
      valoracion_pendiente: pend,
      objetivos: objetivos(rec, h, seguridad),
      plan: plan(rec, seguridad),
      mediciones_ids: (lleno(o.rom) ? [{ id: null, valor: o.rom, unidad: 'texto', articulacion: o.zona || null, lado: o.lado || null, metodo: 'valoracion.rom', fecha: null, nota: 'importar por id desde el módulo biomecánico' }] : []),
      validacion_profesional: { estado: 'borrador', autor: null, fecha: null, fuentes: [seguridad.version], cambios: [] }
    };
    return contrato;
  }

  var API = { version: VERSION, generar: generar, _hechos: hechos, _conflictos: conflictos, ESCALAS: ESCALAS };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.GeneradorV2 = API;
})(typeof window !== 'undefined' ? window : globalThis);
