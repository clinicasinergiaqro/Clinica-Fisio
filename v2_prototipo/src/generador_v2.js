/* SINERGIA · Generador de Diagnóstico Funcional V2.1 (prototipo, determinista)
 * version 2.1.0-proto · 2026-11-26 · SOLO LECTURA · no escribe expedientes · no saveDB.
 * Orquesta: extractor_v2 (hechos con negación/temporalidad/lateralidad/SOAP) → motor_seguridad_v2
 * → composición del contrato de salida. El JSON resultante es la ÚNICA fuente de verdad para
 * interfaz y reportes. No rellena campos faltantes: lo faltante se marca como tarea de valoración.
 * La prosa es derivada de estos mismos hechos (no se redacta una versión "mejorada" aparte).
 * Node + navegador.
 */
(function (root) {
  'use strict';
  var EX = (typeof require !== 'undefined') ? require('./extractor_v2.js') : root.ExtractorV2;
  var MS = (typeof require !== 'undefined') ? require('./motor_seguridad_v2.js') : root.MotorSeguridadV2;
  var VERSION = '2.1.0-proto';

  var norm = EX._norm, lleno = EX._lleno;
  var has = function (t, ks) { t = norm(t); return ks.some(function (k) { return t.indexOf(norm(k)) !== -1; }); };

  // --- Anonimización defensiva: ningún nombre de médico (ni "referido/operado por <Nombre>")
  //     puede salir en el contrato, aunque el input venga mal anonimizado. Se reemplaza por [médico].
  function scrubPHI(s) {
    if (typeof s !== 'string' || !s) return s;
    return s
      .replace(/\b[Dd][Rr][Aa]?\.?\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){0,2}/g, '[médico]')
      .replace(/\b(referid[oa]|envid[oa]|enviad[oa]|operad[oa]|valorad[oa]|atendid[oa])\s+por\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){0,2}/gi, '$1 por [médico]');
  }
  function scrubDeep(x) {
    if (typeof x === 'string') return scrubPHI(x);
    if (Array.isArray(x)) return x.map(scrubDeep);
    if (x && typeof x === 'object') { var o = {}; Object.keys(x).forEach(function (k) { o[k] = scrubDeep(x[k]); }); return o; }
    return x;
  }

  var ESCALAS = {
    'Cervicalgia': 'NDI (Neck Disability Index)', 'Lumbalgia': 'Oswestry (ODI) / PSFS', 'Dorsalgia': 'escala de dolor y función pertinente a la región',
    'Lesion meniscal': 'IKDC / KOOS', 'Lesion ligamentaria': 'IKDC + hop tests (según fase)', 'Tendinopatia': 'VISA (según región)',
    'Hombro': 'SPADI o QuickDASH', 'Miembro superior': 'PRWE + dinamometría de prensión', 'Tobillo/pie': 'FAAM + Weight-Bearing Lunge Test',
    'Rodilla': 'IKDC + dinamometría + tolerancia a sentadilla', 'Fractura': 'escala funcional de la región + goniometría',
    'Post-quirurgico': 'escala funcional de la región + ROM autorizado', 'Radiculopatia': 'examen neurológico dirigido + escala regional',
    'Cadera': 'HOOS', 'Otro': 'escala funcional pertinente'
  };

  // ¿"prioridad" es una ACTIVIDAD válida o texto clínico/negación colado? (arregla "retorno a negado"/"a desgarre…")
  function actividadValida(v) {
    if (!lleno(v)) return false;
    var n = norm(v);
    if (/\b(negad|niega|ningun|no |n\/a|desconoc)\b/.test(n)) return false;
    // si contiene vocabulario clínico/diagnóstico, NO es una actividad prioritaria
    if (has(n, ['lesion', 'desgarre', 'ruptura', 'esguince', 'fractura', 'dolor', 'tendinop', 'cervical', 'lumbar', 'dorsal', 'contractura', 'luxacion', 'dx', 'diagnostic', 'sindrome', 'radicul'])) return false;
    return true;
  }

  function conflictos(rec, h) {
    var out = [];
    if (h.ladoConflicto) out.push({ tipo: 'lado', detalle: 'El lado del dx referido (' + (h.ladoDx || '?') + ') y el del registro (' + (h.lado || '?') + ') no coinciden.', accion: 'Aclarar lateralidad antes de tratar; bloquear plan lateralizado.' });
    if (h.regionConflicto) out.push({ tipo: 'region', detalle: 'Zona codificada "' + (h.regionZona || []).join('/') + '" vs dx médico "' + (h.regionDx || []).join('/') + '".', accion: 'Reconciliar región/episodio; no fijar objetivos sobre una región no confirmada.' });
    return { lista: out, regionConflicto: h.regionConflicto };
  }

  function dxFuncional(rec, h) {
    var o = rec.orig || {};
    var relatoCorto = lleno(o.padecimiento) && String(o.padecimiento).trim().length >= 15;
    if (!relatoCorto) return { texto: 'Anamnesis insuficiente para un diagnóstico funcional. Primera acción: RECAPTURAR la historia (zona, lado, EVA, mecanismo y limitación funcional).', estado: 'provisional', evidencias: [] };
    var reg = lleno(o.zona) ? String(o.zona).replace('_', '/') : 'región por precisar';
    var lado = (h.lado) ? (' ' + h.lado) : '';
    var conDx = (lleno(o.dxMedico) && norm(o.dxMedico).indexOf('no cuenta') === -1) ? ('dx médico referido: ' + o.dxMedico)
      : (lleno(o.dxMedicoMotivo) ? ('dx referido: ' + o.dxMedicoMotivo) : null);
    var contexto = conDx ? ('en contexto de ' + conDx) : 'sin diagnóstico médico referido';
    var sintomas = [], evid = [];
    if (lleno(o.eva)) { sintomas.push('EVA ' + o.eva + (/^\d+$/.test(String(o.eva).trim()) ? '/10' : '')); evid.push({ campo: 'valoracion.eva', fragmento: String(o.eva) }); }
    if (h.inflamacionPresente) { sintomas.push('inflamación referida'); if (h.evidencias.inflamacion) evid.push(h.evidencias.inflamacion); }
    if (h.dolorNocturno) { sintomas.push('dolor nocturno/en reposo'); if (h.evidencias.dolor_nocturno) evid.push(h.evidencias.dolor_nocturno); }
    if (h.deficitNeuro) { sintomas.push('síntomas neurales referidos'); if (h.evidencias.deficit_neuro) evid.push(h.evidencias.deficit_neuro); }
    var crono = (lleno(o.desdeCuando) && /[a-z0-9]/i.test(String(o.desdeCuando))) ? (' Evolución: ' + String(o.desdeCuando).trim() + '.') : '';
    var faltan = [];
    ['rom', 'fuerza', 'pruebas'].forEach(function (k) { if (!lleno(o[k])) faltan.push(k === 'rom' ? 'ROM' : (k === 'fuerza' ? 'fuerza' : 'pruebas especiales')); });
    var pend = faltan.length ? (' Exploración objetiva pendiente (' + faltan.join(', ') + '): diagnóstico PROVISIONAL.') : '';
    var txt = 'Disfunción de ' + reg + lado + ' ' + contexto +
      (sintomas.length ? ', caracterizada por ' + sintomas.join(', ') : ', con síntomas por precisar') + '.' + crono + pend;
    return { texto: txt, estado: 'provisional', evidencias: evid };
  }

  function hipotesis(rec, h) {
    var o = rec.orig || {}; var out = [];
    if (lleno(o.dxMedico) && norm(o.dxMedico).indexOf('no cuenta') === -1) {
      out.push({ texto: 'Hipótesis estructural a partir del dx médico referido: ' + o.dxMedico + ' (referido, a confirmar).', sustento: [{ campo: 'motivo.dxMedico', fragmento: String(o.dxMedico) }], pendiente: ['confirmar con exploración/imagen pertinente'] });
    }
    return out;
  }

  // Objetivos INDIVIDUALIZADOS: uno por alteración funcional detectada, cada uno con su propio
  // indicador / línea base / unidad / método / criterio. Faltante → sin línea base + tarea de valoración.
  function objetivos(rec, h, seguridad) {
    var o = rec.orig || {}; var pat = rec.patologia || 'Otro'; var escala = ESCALAS[pat] || ESCALAS['Otro'];
    var objs = [];
    if (seguridad.bloquea_plan) {
      objs.push({ fase: 'seguridad', alteracion: 'alerta de seguridad activa', actividad: 'resolver la acción de seguridad antes de fijar objetivos terapéuticos', indicador: 'acción de seguridad del motor', linea_base: null, meta_propuesta: null, unidad: null, metodo: null, reevaluacion: 'inmediata', criterio_cumplimiento: 'alerta resuelta / derivación realizada', evidencias: (seguridad.alertas[0] ? [{ campo: 'motor_seguridad', fragmento: seguridad.alertas[0].regla + ': ' + seguridad.alertas[0].accion }] : []) });
      return objs; // con plan bloqueado, no se fijan objetivos terapéuticos
    }
    // Dolor (si hay EVA)
    if (lleno(o.eva)) {
      var evaNum = parseFloat(String(o.eva).replace(/[^\d.]/g, ''));
      objs.push({ fase: 'corto', alteracion: 'dolor', actividad: 'reducir el dolor y la irritabilidad',
        indicador: 'EVA', linea_base: { valor: isNaN(evaNum) ? String(o.eva) : evaNum, unidad: '/10', fuente: 'valoracion.eva', tipo: 'medido' },
        meta_propuesta: isNaN(evaNum) ? null : { valor: Math.max(0, Math.round(evaNum / 2)), unidad: '/10', tipo: 'propuesta_editable', nota: 'reducción ~50%, ajustable por el fisioterapeuta' },
        unidad: '/10', metodo: 'EVA contextualizada', reevaluacion: '1–2 semanas', criterio_cumplimiento: 'EVA en la meta sostenida 2 sesiones', evidencias: [{ campo: 'valoracion.eva', fragmento: String(o.eva) }] });
    }
    // Movilidad (ROM)
    if (lleno(o.rom)) {
      objs.push({ fase: 'mediano', alteracion: 'déficit de movilidad', actividad: 'recuperar ROM funcional de la zona',
        indicador: 'ROM (goniometría)', linea_base: { valor: o.rom, unidad: 'grados', fuente: 'valoracion.rom', tipo: 'medido' },
        meta_propuesta: { valor: 'ROM funcional / simetría con contralateral si válido', unidad: 'grados', tipo: 'propuesta_editable' },
        unidad: 'grados', metodo: 'goniometría de cámara', reevaluacion: '3–6 semanas', criterio_cumplimiento: 'ROM en meta sin dolor', evidencias: [{ campo: 'valoracion.rom', fragmento: String(o.rom) }] });
    } else {
      objs.push({ fase: 'mediano', alteracion: 'movilidad (no medida)', actividad: 'medir y luego recuperar ROM',
        indicador: 'ROM (goniometría)', linea_base: { valor: null, tipo: 'pendiente', fuente: 'valoracion.rom', nota: 'no medido: capturar línea base' },
        meta_propuesta: null, unidad: 'grados', metodo: 'goniometría de cámara', reevaluacion: 'tras medir', criterio_cumplimiento: null, evidencias: [] });
    }
    // Fuerza
    if (lleno(o.fuerza)) {
      objs.push({ fase: 'mediano', alteracion: 'déficit de fuerza', actividad: 'recuperar fuerza del segmento',
        indicador: 'fuerza (método documentado)', linea_base: { valor: o.fuerza, unidad: 'según método', fuente: 'valoracion.fuerza', tipo: 'medido' },
        meta_propuesta: { valor: 'simetría ≥90% vs contralateral o Daniels 5/5 según método', tipo: 'propuesta_editable' },
        unidad: 'según método', metodo: 'dinamometría / Daniels (explicitar)', reevaluacion: '4–6 semanas', criterio_cumplimiento: 'fuerza en meta', evidencias: [{ campo: 'valoracion.fuerza', fragmento: String(o.fuerza) }] });
    } else {
      objs.push({ fase: 'mediano', alteracion: 'fuerza (no medida)', actividad: 'medir y luego recuperar fuerza',
        indicador: 'fuerza (método documentado)', linea_base: { valor: null, tipo: 'pendiente', fuente: 'valoracion.fuerza', nota: 'no medida: elegir método (dinamómetro/Daniels) y capturar' },
        meta_propuesta: null, unidad: 'según método', metodo: 'dinamometría / Daniels', reevaluacion: 'tras medir', criterio_cumplimiento: null, evidencias: [] });
    }
    // Función / retorno a actividad — con GUARD de actividad válida (arregla "retorno a <diagnóstico>")
    var prioridad = actividadValida(o.deportivos) ? o.deportivos : (actividadValida(o.objetivoFuncional) ? o.objetivoFuncional : null);
    objs.push({ fase: 'largo',
      alteracion: 'limitación funcional / retorno a actividad',
      actividad: prioridad ? ('retorno a ' + prioridad + ' según criterios') : 'retorno a la actividad funcional prioritaria según criterios (definir la actividad con el paciente: no documentada)',
      indicador: escala + ' + prueba funcional pertinente',
      linea_base: lleno(o.limitaciones) ? { valor: o.limitaciones, fuente: 'dxFuncional.limitaciones', tipo: 'documentado' } : { valor: null, tipo: 'pendiente', nota: 'limitación funcional no documentada' },
      meta_propuesta: prioridad ? { valor: prioridad, tipo: 'propuesta_editable' } : null,
      unidad: 'puntaje/criterios', metodo: 'escala funcional + prueba de retorno', reevaluacion: 'por criterios', criterio_cumplimiento: 'criterios funcionales cumplidos', evidencias: prioridad ? [{ campo: 'antecedentes.deportivos/objetivoFuncional', fragmento: String(prioridad) }] : [] });
    return objs;
  }

  function plan(rec, seguridad) {
    if (seguridad.bloquea_plan) return null; // plan bloqueado; la acción vive en seguridad
    return {
      estado: 'propuesta_editable',
      fases: [
        { nombre: 'Fase 1 · control de síntomas', objetivo: 'reducir irritabilidad y proteger', ejemplos: ['movilidad indolora', 'isométricos submáximos si tolera'], agentes_fisicos: 'evaluar por §C del motor (modalidad/región/equipo)', puede: ['movilidad en rango sin dolor'], no_puede: ['carga/impacto provocador de dolor'], criterio_progresion: 'tolerancia sin aumento de síntomas' },
        { nombre: 'Fase 2 · recuperación funcional', objetivo: 'restaurar ROM y fuerza', ejemplos: ['fortalecimiento progresivo', 'control motor'], criterio_progresion: 'ROM/fuerza medidos en progreso' },
        { nombre: 'Fase 3 · retorno', objetivo: 'retorno a actividad/deporte por criterios', ejemplos: ['reeducación del gesto', 'pliometría si aplica'], criterio_alta: 'criterios funcionales + simetría medida si pertinente' }
      ],
      nota: 'Dosis y ejercicios concretos requieren línea base medida; propuesta editable por el fisioterapeuta.'
    };
  }

  // Mediciones: conserva id/paciente/fecha/articulación/movimiento/lado/tipo/posición/método/unidad/calidad/autor/evidencia
  // desde rec.biomecanica (estructurado). Si solo hay valoracion.rom en texto → id sentinel + tarea (no null fingido).
  function mediciones(rec) {
    var o = rec.orig || {}; var out = [];
    var bio = Array.isArray(rec.biomecanica) ? rec.biomecanica : [];
    bio.forEach(function (b) {
      out.push({
        id: b.id || ('sin_id_estructurado'), paciente: rec.codigo || null, fecha: b.fecha || null,
        articulacion: b.articulacion || b.joint || null, movimiento: b.movimiento || b.movement || null, lado: b.lado || null,
        tipo: b.tipo || b.activa_pasiva || null, posicion: b.posicion || null, metodo: b.metodo || 'biomecanica', unidad: b.unidad || 'grados',
        valor: (b.valor != null ? b.valor : (b.grado != null ? b.grado : null)), calidad: b.calidad || null, autor: b.autor || null,
        evidencia: { campo: 'p.biomecanica', id: b.id || null }
      });
    });
    if (!out.length && lleno(o.rom)) {
      out.push({ id: 'sin_id_estructurado', paciente: rec.codigo || null, fecha: null, articulacion: o.zona || null, movimiento: null, lado: o.lado || null,
        tipo: null, posicion: null, metodo: 'valoracion.rom (texto)', unidad: 'texto', valor: o.rom, calidad: 'no_estructurado', autor: null,
        evidencia: { campo: 'valoracion.rom', fragmento: String(o.rom) }, tarea: 'Capturar medición estructurada (módulo biomecánico) para trazabilidad.' });
    }
    return out;
  }

  function generar(rec, opts) {
    opts = opts || {};
    return scrubDeep(_generar(rec, opts)); // scrub PHI defensivo sobre TODO el contrato de salida
  }

  function _generar(rec, opts) {
    var h = EX.extraer(rec, opts); // h.regionConflicto ya viene del extractor (alimenta la regla X2)
    var confl = conflictos(rec, h);
    var seguridad = MS.evaluar(h);
    var dxf = dxFuncional(rec, h);
    var o = rec.orig || {};
    var pend = [];
    ['rom', 'fuerza', 'pruebas'].forEach(function (k) { if (!lleno(o[k])) pend.push('Medir ' + (k === 'rom' ? 'ROM (goniómetro)' : (k === 'fuerza' ? 'fuerza (método explícito)' : 'pruebas especiales pertinentes'))); });
    if (!h.cribadoDocumentado) pend.push('Documentar cribado de banderas rojas (no se infiere de pruebas especiales).');
    if (seguridad.estado === 'emergencia' || seguridad.estado === 'derivacion_prioritaria' || seguridad.estado === 'bloqueo_por_dato_inconsistente' || seguridad.estado === 'error_regla') {
      pend.unshift('Resolver seguridad: ' + (seguridad.alertas[0] ? (seguridad.alertas[0].regla + ' · ' + seguridad.alertas[0].accion) : ''));
    }
    confl.lista.forEach(function (c) { pend.push('Aclarar ' + c.tipo + ': ' + c.detalle); });

    return {
      version_generador: VERSION, version_extractor: h.version_extractor, version_motor: seguridad.version, catalogo_seguridad: seguridad.catalogo_version,
      episodio: rec.codigo || null, fecha_corte: h.fecha_corte || null,
      soap_procesado: { n_notas: h.soap_n, fechas: h.soap_fechas, valoracion_inicial_presente: !!h.soap_inicial, evolucion_actual_presente: !!h.soap_actual },
      diagnostico_funcional: { texto: dxf.texto, estado: dxf.estado, evidencias: dxf.evidencias },
      hipotesis: hipotesis(rec, h),
      seguridad: { estado: seguridad.estado, cribado_documentado: seguridad.cribado_documentado, nota: seguridad.nota, alertas: seguridad.alertas, bloquea_plan: seguridad.bloquea_plan, reglas_pendientes: seguridad.reglas_pendientes },
      discrepancias: confl.lista,
      valoracion_pendiente: pend,
      objetivos: objetivos(rec, h, seguridad),
      plan: plan(rec, seguridad),
      mediciones: mediciones(rec),
      hechos_clave: { oncologico: h.oncologico, oncologico_familiar_solo: h.oncologico_familiar_solo, caudaEquina: h.caudaEquina, tvp: h.tvp, traumaCervicalAxial: h.traumaCervicalAxial, ladoConflicto: h.ladoConflicto, regionConflicto: h.regionConflicto, ligamentoIpsilateralPrevio: h.ligamentoIpsilateralPrevio, ligamentoContralateral: h.ligamentoContralateral, inflamacionPresente: h.inflamacionPresente, evidencias: h.evidencias },
      validacion_profesional: { estado: 'borrador', autor: null, fecha: null, fuentes: [seguridad.version, h.version_extractor], cambios: [] }
    };
  }

  var API = { version: VERSION, generar: generar, _conflictos: conflictos, _objetivos: objetivos, _actividadValida: actividadValida, _scrubPHI: scrubPHI, ESCALAS: ESCALAS };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.GeneradorV2 = API;
})(typeof window !== 'undefined' ? window : globalThis);
