/* SINERGIA · Generador de Diagnóstico Funcional V2.2 (prototipo, determinista)
 * version 2.2.0-proto · 2026-11-26 · SOLO LECTURA · no escribe expedientes · no saveDB.
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
  var VERSION = '2.2.0-proto';

  var norm = EX._norm, lleno = EX._lleno;
  var has = function (t, ks) { t = norm(t); return ks.some(function (k) { return t.indexOf(norm(k)) !== -1; }); };

  // --- Anonimización defensiva: ningún nombre de médico (ni "referido/operado por <Nombre>")
  //     puede salir en el contrato, aunque el input venga mal anonimizado. Se reemplaza por [médico].
  // Nombre completo = primera palabra Capitalizada seguida de hasta 6 tokens que pueden ser
  //   más palabras Capitalizadas O partículas en minúscula (de/del/la/los/y/e/da/di/van/von).
  //   Así se captura "Martín Alfredo Romo García de Bustamante" entero (OCT-72: antes el scrub se
  //   detenía en la partícula "de" en minúscula y dejaba escapar "García de Bustamante").
  // Nombre completo = palabra Capitalizada + hasta 6 tokens más (Capitalizadas O partículas en
  //   minúscula de/del/la/los/y/e/da/di/van/von como PALABRA COMPLETA, \b, para no comerse "en"/"el").
  //   SIEMPRE case-sensitive (capitales reales): nunca se usa el flag /i sobre el nombre, porque /i
  //   haría que [A-Z] matchee minúsculas y se "coma" palabras comunes (referido, médico, reposo).
  var _NOMBRE = '[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\\s+(?:(?:de|del|la|las|los|y|e|da|di|van|von)\\b|[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)){0,6}';
  function scrubPHI(s) {
    if (typeof s !== 'string' || !s) return s;
    return s
      // Dr./Dra./M.D./Lic./Q.F.B. + nombre completo (prefijo en ambas cajas; nombre capitales-only).
      .replace(new RegExp('\\b(?:[Dd][Rr][Aa]?|[Mm]\\.?[Dd]\\.?|[Ll]ic\\.?|[Qq]\\.?[Ff]\\.?[Bb]\\.?)\\.?\\s+' + _NOMBRE, 'g'), '[médico]')
      // "referido/operado/enviado/valorado/atendido/intervenido/canalizado por <Nombre>" (gatillo ambas cajas, nombre capitales-only).
      .replace(new RegExp('\\b([Rr]eferid[oa]|[Ee]nviad[oa]|[Oo]perad[oa]|[Vv]alorad[oa]|[Aa]tendid[oa]|[Ii]ntervenid[oa]|[Cc]analizad[oa])\\s+por\\s+' + _NOMBRE, 'g'), '$1 por [médico]')
      // "doctor(a)/médic(o/a)/traumatólog(o/a)/ortopedista/cirujan(o/a) <Nombre>" (profesión ambas cajas, nombre capitales-only).
      .replace(new RegExp('\\b(?:[Dd]octor[a]?|[Mm][ée]dic[oa]|[Tt]raumat[oó]log[oa]|[Oo]rtopedist[a]|[Cc]irujan[oa]|[Nn]eurocirujan[oa])\\s+' + _NOMBRE, 'g'), '[médico]');
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

  // Índice de protocolos de REFERENCIA de la biblioteca Sinergia (docs/biblioteca_*.md). NO contiene
  // dosificaciones: la dosis depende de la línea base medida y la individualiza el fisioterapeuta.
  // Cada entrada da: protocolo referido + fuente + fases POR CRITERIOS (no calendario) + agentes
  // coadyuvantes (cuál/cuándo, sin dosimetría). Con esto cada plan es ESPECÍFICO de la patología
  // (ya no un plan genérico idéntico para todos).
  var PROTO_INDEX = {
    'Tendinopatia': { ref: 'Tendinopatía — carga progresiva tipo HSR', fuente: 'biblioteca_protocolos.md (P1/P2/P7 HSR) · Silbernagel',
      fases: [
        { nombre: 'Isométricos / control de dolor', objetivo: 'analgesia de carga y tolerancia', criterio_progresion: 'dolor matutino y de carga ≤ umbral (semáforo Silbernagel) estable' },
        { nombre: 'Carga lenta pesada (HSR) concéntrica-excéntrica', objetivo: 'remodelado del tendón y fuerza', criterio_progresion: 'progresa por tolerancia de carga sin rebote de dolor a 24 h' },
        { nombre: 'Energía elástica / retorno', objetivo: 'reintroducir almacenamiento-liberación y gesto', criterio_progresion: 'criterios funcionales + VISA en meta' }
      ], agentes: 'Coadyuvantes según fase (p.ej. tecar, láser); ondas de choque / MEP solo en tendinopatía crónica que no cede, con consentimiento. La CARGA es el motor.' },
    'Lesion ligamentaria': { ref: 'LCA / ligamentaria — progresión por criterios', fuente: 'biblioteca_rehab_ortopedia.md · van Melick 2016 / Grindem 2016',
      fases: [
        { nombre: 'Control de derrame y activación', objetivo: 'extensión completa, control de cuádriceps (vencer inhibición)', criterio_progresion: 'rodilla seca, extensión simétrica, buen control de cuádriceps' },
        { nombre: 'Fuerza y control neuromuscular', objetivo: 'fuerza y estabilidad dinámica', criterio_progresion: 'fuerza/LSI en progreso, sin derrame tras carga' },
        { nombre: 'Retorno a deporte por criterios', objetivo: 'hop tests + fuerza simétrica + confianza', criterio_progresion: 'batería de retorno (LSI ≥ umbral, hop tests, ACL-RSI) — típicamente ≥9 meses' }
      ], agentes: 'EEM/Russian superpuesta al ejercicio para inhibición del cuádriceps; crio/compresión fase inicial; láser (no contraindicado por metal de fijación).' },
    'Lesion meniscal': { ref: 'Menisco — reparación (lento) vs meniscectomía (rápido)', fuente: 'biblioteca_rehab_ortopedia.md · consenso ESSKA 2024',
      fases: [
        { nombre: 'Protección (según tipo de cirugía)', objetivo: 'proteger sutura si fue reparación (ROM y carga restringidos) o movilidad temprana si meniscectomía', criterio_progresion: 'según restricción del cirujano; reparación avanza más lento' },
        { nombre: 'Fuerza y ROM', objetivo: 'recuperar ROM y fuerza por fases', criterio_progresion: 'ROM/fuerza medidos en progreso sin derrame' },
        { nombre: 'Retorno funcional', objetivo: 'retorno a actividad por criterios', criterio_progresion: 'criterios funcionales cumplidos' }
      ], agentes: 'Coadyuvantes de dolor/derrame fase inicial; respetar restricción de flexión/carga del cirujano en reparación.' },
    'Lumbalgia': { ref: 'Lumbalgia inespecífica — ejercicio graduado, anti-nocebo', fuente: 'biblioteca_rehab_ortopedia.md · NICE NG59 / Lancet 2018 / CFT',
      fases: [
        { nombre: 'Educación y movimiento temprano', objetivo: 'reducir miedo-evitación, mantener actividad (no reposo)', criterio_progresion: 'tolerancia a la actividad, sin banderas rojas' },
        { nombre: 'Ejercicio graduado e individualizado', objetivo: 'control motor, fuerza y resistencia según preferencia del paciente', criterio_progresion: 'función (ODI/PSFS) en progreso' },
        { nombre: 'Reintegro a actividad/trabajo', objetivo: 'retomar tareas y trabajo', criterio_progresion: 'metas funcionales del paciente alcanzadas' }
      ], agentes: 'Coadyuvantes de analgesia (TENS/termo) si ayudan a moverse; NO como tratamiento central; la clave es el ejercicio y la educación.' },
    'Cervicalgia': { ref: 'Cervicalgia — ejercicio + terapia según categoría', fuente: 'biblioteca_rehab_ortopedia.md · Neck Pain CPG 2017',
      fases: [
        { nombre: 'Control de dolor y movilidad', objetivo: 'movilidad y analgesia; cribar mielopatía/banderas antes de manipular', criterio_progresion: 'cribado neurológico/vascular negativo; movilidad en progreso' },
        { nombre: 'Fuerza cervical/escapular y control motor', objetivo: 'resistencia de flexores profundos y control escapular', criterio_progresion: 'NDI y fuerza en progreso' },
        { nombre: 'Reintegro funcional', objetivo: 'postura sostenida y tareas', criterio_progresion: 'metas funcionales alcanzadas' }
      ], agentes: 'Terapia manual + ejercicio; termo/TENS coadyuvantes. NO manipular sin cribar mielopatía y banderas vasculares (IFOMPT).' },
    'Hombro': { ref: 'Manguito rotador — por tamaño/tipo', fuente: 'biblioteca_rehab_ortopedia.md · Hegedus 2012',
      fases: [
        { nombre: 'Movilidad protegida y control de dolor', objetivo: 'ROM tolerado, isométricos submáximos', criterio_progresion: 'dolor controlado, ROM pasiva en progreso' },
        { nombre: 'Fuerza progresiva del manguito y escápula', objetivo: 'fuerza del manguito y ritmo escapulohumeral', criterio_progresion: 'fuerza y SPADI/QuickDASH en progreso' },
        { nombre: 'Retorno a actividad/overhead', objetivo: 'gesto funcional y deportivo', criterio_progresion: 'criterios funcionales cumplidos' }
      ], agentes: 'TENS/punción±electro coadyuvantes; tecar/láser según fase. Respetar protección post-op si reparación.' },
    'Tobillo/pie': { ref: 'Esguince lateral / tobillo — carga funcional temprana', fuente: 'biblioteca_rehab_ortopedia.md · CPG JOSPT 2021',
      fases: [
        { nombre: 'Control de edema y carga protegida', objetivo: 'reducir edema, carga según tolerancia', criterio_progresion: 'edema en descenso, carga sin dolor significativo' },
        { nombre: 'ROM, fuerza y propiocepción', objetivo: 'dorsiflexión (WBLT), fuerza de peroneos, equilibrio', criterio_progresion: 'WBLT y fuerza en progreso' },
        { nombre: 'Retorno a impacto/deporte', objetivo: 'carrera, cambios de dirección, saltos', criterio_progresion: 'criterios funcionales + FAAM en meta' }
      ], agentes: 'Crio/compresión fase inicial; coadyuvantes de dolor. Sindesmal y post-Broström: progresión más lenta.' },
    'Cadera': { ref: 'Cadera — labrum/FAI o conservador', fuente: 'biblioteca_rehab_ortopedia.md · Warwick 2016',
      fases: [
        { nombre: 'Movilidad indolora y activación', objetivo: 'rango tolerado, activar glúteo/core', criterio_progresion: 'sin pinzamiento doloroso; control pélvico' },
        { nombre: 'Fuerza y control', objetivo: 'fuerza de cadera y control lumbopélvico', criterio_progresion: 'fuerza (HOOS) en progreso' },
        { nombre: 'Retorno funcional', objetivo: 'gesto deportivo/laboral', criterio_progresion: 'criterios funcionales cumplidos' }
      ], agentes: 'Coadyuvantes de dolor; si hay anclas (post-artroscopia): no RF/US térmico sobre el material.' },
    'Radiculopatia': { ref: 'Radiculopatía — por criterios, vigilar déficit', fuente: 'biblioteca_rehab_ortopedia.md · juicio clínico',
      fases: [
        { nombre: 'Control de dolor y centralización', objetivo: 'reducir dolor radicular, preferencia direccional', criterio_progresion: 'síntomas centralizan; sin progresión de déficit' },
        { nombre: 'Movilidad neural y fuerza', objetivo: 'deslizamiento neural tolerado y fuerza segmentaria', criterio_progresion: 'fuerza/sensibilidad estables o mejorando' },
        { nombre: 'Reintegro funcional', objetivo: 'tareas y postura', criterio_progresion: 'metas funcionales alcanzadas' }
      ], agentes: 'Coadyuvantes de analgesia. DERIVAR si déficit objetivado/progresivo (ver seguridad).' },
    'Fractura': { ref: 'Post-fractura — según consolidación y autorización', fuente: 'biblioteca_rehab_ortopedia.md',
      fases: [
        { nombre: 'Protección y ROM autorizado', objetivo: 'ROM dentro de lo autorizado por el cirujano', criterio_progresion: 'consolidación y autorización de carga' },
        { nombre: 'Fuerza y carga progresiva', objetivo: 'recuperar fuerza y carga', criterio_progresion: 'fuerza/ROM medidos en progreso' },
        { nombre: 'Retorno funcional', objetivo: 'función y gesto', criterio_progresion: 'criterios funcionales cumplidos' }
      ], agentes: 'NO RF/diatermia/US térmico sobre osteosíntesis; láser de baja potencia no contraindicado por metal.' },
    'Post-quirurgico': { ref: 'Post-operatorio — protocolo del cirujano manda', fuente: 'biblioteca_rehab_ortopedia.md',
      fases: [
        { nombre: 'Protección según protocolo quirúrgico', objetivo: 'respetar ROM/carga autorizados', criterio_progresion: 'hitos y autorización del cirujano' },
        { nombre: 'Recuperación de ROM y fuerza', objetivo: 'ROM y fuerza por fases', criterio_progresion: 'medidos en progreso, sin signos de alarma' },
        { nombre: 'Retorno funcional', objetivo: 'actividad/deporte por criterios', criterio_progresion: 'criterios funcionales cumplidos' }
      ], agentes: 'Según restricciones del cirujano; cuidado con metal (no térmico sobre material).' }
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
    var evid = [];
    // --- Mecanismo de lesión (narrativa, no solo región+EVA) ---
    var mec = lleno(o.mecanismo) ? String(o.mecanismo).trim() : null;
    if (mec) evid.push({ campo: 'motivo.mecanismo', fragmento: mec });
    // --- Síntomas (dolor, inflamación, neural REFERIDO vs OBJETIVO: no se mezclan) ---
    var sintomas = [];
    if (lleno(o.eva)) { sintomas.push('EVA ' + o.eva + (/^\d+$/.test(String(o.eva).trim()) ? '/10' : '')); evid.push({ campo: 'valoracion.eva', fragmento: String(o.eva) }); }
    if (h.dolorNocturno) { sintomas.push('dolor nocturno/en reposo'); if (h.evidencias.dolor_nocturno) evid.push(h.evidencias.dolor_nocturno); }
    if (h.dolorPersistente) { sintomas.push('dolor persistente/continuo'); if (h.evidencias.dolor_persistente) evid.push(h.evidencias.dolor_persistente); }
    if (h.inflamacionPresente) { sintomas.push('inflamación referida'); if (h.evidencias.inflamacion) evid.push(h.evidencias.inflamacion); }
    if (h.deficitNeuroObjetivo) { sintomas.push('déficit neurológico OBJETIVADO'); if (h.evidencias.deficit_neuro_objetivo) evid.push(h.evidencias.deficit_neuro_objetivo); }
    else if (h.sintomaNeuroReferido) { sintomas.push('síntomas neurales referidos (sensitivos, sin déficit objetivado)'); if (h.evidencias.sintoma_neuro_referido) evid.push(h.evidencias.sintoma_neuro_referido); }
    // --- Hallazgos objetivos: ROM/fuerza SOLO como grados/escala si son numéricos; si son texto, se dicen cualitativos ---
    var hallaz = [];
    if (h.romEsNumerico) { hallaz.push('ROM ' + String(o.rom).trim()); evid.push({ campo: 'valoracion.rom', fragmento: String(o.rom) }); }
    else if (h.romTextoCualitativo) { hallaz.push('movilidad descrita como "' + String(o.rom).trim() + '" (cualitativo, sin goniometría)'); evid.push({ campo: 'valoracion.rom', fragmento: String(o.rom) }); }
    if (h.fuerzaEsNumerica) { hallaz.push('fuerza ' + String(o.fuerza).trim()); evid.push({ campo: 'valoracion.fuerza', fragmento: String(o.fuerza) }); }
    else if (h.fuerzaTextoCualitativo) { hallaz.push('fuerza descrita como "' + String(o.fuerza).trim() + '" (cualitativo, sin escala)'); evid.push({ campo: 'valoracion.fuerza', fragmento: String(o.fuerza) }); }
    if (lleno(o.palpacion)) { hallaz.push('palpación: ' + String(o.palpacion).trim()); evid.push({ campo: 'valoracion.palpacion', fragmento: String(o.palpacion) }); }
    if (h.pruebasEspecialesPresentes) { hallaz.push('pruebas especiales: ' + String(o.pruebas).trim()); evid.push({ campo: 'valoracion.pruebas', fragmento: String(o.pruebas) }); }
    // --- Limitación funcional concreta ---
    var limit = lleno(o.limitaciones) ? String(o.limitaciones).trim() : null;
    if (limit) evid.push({ campo: 'dxFuncional.limitaciones', fragmento: limit });
    var crono = (lleno(o.desdeCuando) && /[a-z0-9]/i.test(String(o.desdeCuando))) ? (' Evolución: ' + String(o.desdeCuando).trim() + '.') : '';
    var faltan = [];
    if (!h.romEsNumerico) faltan.push('ROM goniométrico');
    if (!h.fuerzaEsNumerica) faltan.push('fuerza con escala');
    if (!h.pruebasEspecialesPresentes) faltan.push('pruebas especiales');
    var pend = faltan.length ? (' Exploración objetiva por completar (' + faltan.join(', ') + '): diagnóstico PROVISIONAL.') : '';
    if (h.datosInsuficientes) pend += ' Datos clínicos insuficientes: no se afirma seguridad por ausencia de hallazgos.';
    var txt = 'Disfunción de ' + reg + lado + ' ' + contexto +
      (mec ? '; mecanismo: ' + mec : '') +
      (sintomas.length ? '. Cuadro: ' + sintomas.join(', ') : '. Síntomas por precisar') +
      (hallaz.length ? '. Hallazgos objetivos: ' + hallaz.join('; ') : '. Sin hallazgos objetivos documentados') +
      (limit ? '. Limitación funcional: ' + limit : '') +
      '.' + crono + pend;
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
    // Dolor (si hay EVA). NO se asume reducción del 50% ni "cero dolor": la meta la fija el
    // fisioterapeuta según irritabilidad y objetivo del paciente. Meta = null (editable) salvo meta documentada.
    if (lleno(o.eva)) {
      var evaNum = parseFloat(String(o.eva).replace(/[^\d.]/g, ''));
      objs.push({ fase: 'corto', alteracion: 'dolor', actividad: 'reducir el dolor y la irritabilidad',
        indicador: 'EVA', linea_base: { valor: isNaN(evaNum) ? String(o.eva) : evaNum, unidad: '/10', fuente: 'valoracion.eva', tipo: isNaN(evaNum) ? 'texto' : 'medido' },
        meta_propuesta: null, meta_nota: 'Definir meta de EVA con el fisioterapeuta según irritabilidad y objetivo del paciente (no se asume reducción fija ni dolor cero).',
        unidad: '/10', metodo: 'EVA contextualizada', reevaluacion: '1–2 semanas', criterio_cumplimiento: 'EVA en la meta acordada, sostenida', evidencias: [{ campo: 'valoracion.eva', fragmento: String(o.eva) }] });
    }
    // Movilidad (ROM). Línea base 'medido' SOLO si es numérica (grados). Si es texto → tipo cualitativo
    // (NO se reporta como medición en grados). Meta = null (la fija el fisio; no se asume simetría).
    if (h.romEsNumerico) {
      objs.push({ fase: 'mediano', alteracion: 'déficit de movilidad', actividad: 'recuperar ROM funcional de la zona',
        indicador: 'ROM (goniometría)', linea_base: { valor: String(o.rom).trim(), unidad: 'grados', fuente: 'valoracion.rom', tipo: 'medido' },
        meta_propuesta: null, meta_nota: 'Definir ROM meta con el fisio según la articulación, el objetivo y el lado sano (no se asume simetría automática).',
        unidad: 'grados', metodo: 'goniometría', reevaluacion: '3–6 semanas', criterio_cumplimiento: 'ROM en la meta acordada sin dolor', evidencias: [{ campo: 'valoracion.rom', fragmento: String(o.rom) }] });
    } else if (h.romTextoCualitativo) {
      objs.push({ fase: 'mediano', alteracion: 'movilidad (descrita en texto, sin goniometría)', actividad: 'medir ROM (grados) y luego recuperarlo',
        indicador: 'ROM (goniometría)', linea_base: { valor: String(o.rom).trim(), unidad: 'texto', fuente: 'valoracion.rom', tipo: 'texto_cualitativo', nota: 'descripción cualitativa: NO es una medición en grados; capturar goniometría para línea base' },
        meta_propuesta: null, unidad: 'grados', metodo: 'goniometría', reevaluacion: 'tras medir', criterio_cumplimiento: null, evidencias: [{ campo: 'valoracion.rom', fragmento: String(o.rom) }] });
    } else {
      objs.push({ fase: 'mediano', alteracion: 'movilidad (no medida)', actividad: 'medir y luego recuperar ROM',
        indicador: 'ROM (goniometría)', linea_base: { valor: null, tipo: 'pendiente', fuente: 'valoracion.rom', nota: 'no medido: capturar línea base' },
        meta_propuesta: null, unidad: 'grados', metodo: 'goniometría', reevaluacion: 'tras medir', criterio_cumplimiento: null, evidencias: [] });
    }
    // Fuerza. 'medido' SOLO si hay escala (x/5, Daniels, grado). Si es texto → cualitativo.
    // NO se asume "≥90% simetría" ni "Daniels 5/5" como meta: la fija el fisio.
    if (h.fuerzaEsNumerica) {
      objs.push({ fase: 'mediano', alteracion: 'déficit de fuerza', actividad: 'recuperar fuerza del segmento',
        indicador: 'fuerza (escala documentada)', linea_base: { valor: String(o.fuerza).trim(), unidad: 'escala', fuente: 'valoracion.fuerza', tipo: 'medido' },
        meta_propuesta: null, meta_nota: 'Definir fuerza meta con el fisio según método y objetivo (no se asume simetría ≥90% ni 5/5 automáticos).',
        unidad: 'según método', metodo: 'dinamometría / Daniels (explicitar)', reevaluacion: '4–6 semanas', criterio_cumplimiento: 'fuerza en la meta acordada', evidencias: [{ campo: 'valoracion.fuerza', fragmento: String(o.fuerza) }] });
    } else if (h.fuerzaTextoCualitativo) {
      objs.push({ fase: 'mediano', alteracion: 'fuerza (descrita en texto, sin escala)', actividad: 'medir fuerza con escala y luego recuperarla',
        indicador: 'fuerza (escala documentada)', linea_base: { valor: String(o.fuerza).trim(), unidad: 'texto', fuente: 'valoracion.fuerza', tipo: 'texto_cualitativo', nota: 'descripción cualitativa: elegir método (dinamómetro/Daniels) y capturar' },
        meta_propuesta: null, unidad: 'según método', metodo: 'dinamometría / Daniels', reevaluacion: 'tras medir', criterio_cumplimiento: null, evidencias: [{ campo: 'valoracion.fuerza', fragmento: String(o.fuerza) }] });
    } else {
      objs.push({ fase: 'mediano', alteracion: 'fuerza (no medida)', actividad: 'medir y luego recuperar fuerza',
        indicador: 'fuerza (escala documentada)', linea_base: { valor: null, tipo: 'pendiente', fuente: 'valoracion.fuerza', nota: 'no medida: elegir método (dinamómetro/Daniels) y capturar' },
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

  function plan(rec, h, seguridad) {
    if (seguridad.bloquea_plan) return null; // plan bloqueado; la acción vive en seguridad
    var o = rec.orig || {};
    var pat = rec.patologia || 'Otro';
    var proto = PROTO_INDEX[pat] || null;
    // Irritabilidad estimada (para modular, NO para dosificar): EVA alta + dolor nocturno/persistente + inflamación.
    var evaNum = parseFloat(String(o.eva || '').replace(/[^\d.]/g, ''));
    var irritabilidad = 'por determinar';
    if (!isNaN(evaNum)) {
      var alta = (evaNum >= 7) || h.dolorNocturno || h.inflamacionPresente;
      var baja = (evaNum <= 3) && !h.dolorNocturno && !h.dolorPersistente && !h.inflamacionPresente;
      irritabilidad = alta ? 'alta' : (baja ? 'baja' : 'moderada');
    }
    // Restricciones explícitas detectadas (no se inventan): metal, restricción documentada, post-quirúrgico.
    var restricciones = [];
    if (h.metal) restricciones.push('Material de osteosíntesis/prótesis: no RF/diatermia/tecar térmica/US térmico SOBRE el material (láser de baja potencia no contraindicado por metal).');
    if (h.restriccionDocumentada) restricciones.push('Restricción documentada en el expediente: respetarla.');
    if (/post|quirurg|cirug|operad/.test(norm(pat) + ' ' + norm(o.dxMedico || ''))) restricciones.push('Post-operatorio: el protocolo y los tiempos del cirujano MANDAN sobre esta referencia.');
    // Objetivo prioritario documentado (para ligar el plan al objetivo del paciente).
    var prioridad = actividadValida(o.deportivos) ? o.deportivos : (actividadValida(o.objetivoFuncional) ? o.objetivoFuncional : null);
    return {
      estado: 'propuesta_editable',
      protocolo_referencia: proto ? proto.ref : 'Sin protocolo específico en la biblioteca para esta patología; usar criterio clínico.',
      fuente_biblioteca: proto ? proto.fuente : null,
      patologia: pat,
      irritabilidad_estimada: irritabilidad,
      objetivo_prioritario: prioridad || 'no documentado (definir con el paciente)',
      restricciones: restricciones,
      fases: proto ? proto.fases.map(function (f) { return { nombre: f.nombre, objetivo: f.objetivo, criterio_progresion: f.criterio_progresion }; }) : [
        { nombre: 'Fase 1 · control de síntomas', objetivo: 'reducir irritabilidad y proteger', criterio_progresion: 'tolerancia sin aumento de síntomas' },
        { nombre: 'Fase 2 · recuperación funcional', objetivo: 'restaurar ROM y fuerza', criterio_progresion: 'ROM/fuerza medidos en progreso' },
        { nombre: 'Fase 3 · retorno', objetivo: 'retorno a actividad por criterios', criterio_progresion: 'criterios funcionales cumplidos' }
      ],
      agentes_coadyuvantes: proto ? proto.agentes : 'Evaluar modalidad/región/equipo con el motor (§ agentes físicos); nunca "permitido" automático.',
      nota: 'Propuesta de REFERENCIA ligada a la patología (biblioteca Sinergia), modulada por irritabilidad y restricciones. NO incluye dosificación: la dosis se individualiza con la línea base medida y el criterio del fisioterapeuta. La progresión es por CRITERIOS, no por calendario.'
    };
  }

  // Mediciones VINCULADAS: SOLO las del módulo biomecánico con id estructurado real (rec.biomecanica).
  // Contrato de datos que esta rama CONSUME (el rediseño visual/otra ventana define botones/ventanas):
  //   {id, paciente, fecha, articulacion, movimiento, lado, tipo(activa/pasiva), posicion, metodo,
  //    unidad, valor, calidad, autor, evidencia{campo,id}}. Una medición sin id estructurado NO es
  //   una medición vinculada → va aparte en 'mediciones_sin_vincular' y NO cuenta como vinculada (punto 7).
  function mediciones(rec) {
    var out = [];
    var bio = Array.isArray(rec.biomecanica) ? rec.biomecanica : [];
    bio.forEach(function (b) {
      if (!b || !b.id) return; // sin id estructurado → NO cuenta como medición vinculada
      out.push({
        id: b.id, paciente: rec.codigo || null, fecha: b.fecha || null,
        articulacion: b.articulacion || b.joint || null, movimiento: b.movimiento || b.movement || null, lado: b.lado || null,
        tipo: b.tipo || b.activa_pasiva || null, posicion: b.posicion || null, metodo: b.metodo || 'biomecanica', unidad: b.unidad || 'grados',
        valor: (b.valor != null ? b.valor : (b.grado != null ? b.grado : null)), calidad: b.calidad || null, autor: b.autor || null,
        evidencia: { campo: 'p.biomecanica', id: b.id }
      });
    });
    return out;
  }

  // Datos de ROM/fuerza que existen SOLO como texto (sin id estructurado): NO son mediciones vinculadas;
  // se listan aparte como tarea de captura para trazabilidad. Nunca inflan el conteo de mediciones.
  function medicionesSinVincular(rec, h) {
    var o = rec.orig || {}; var out = [];
    var bioSinId = (Array.isArray(rec.biomecanica) ? rec.biomecanica : []).filter(function (b) { return b && !b.id; }).length;
    if (bioSinId) out.push({ origen: 'p.biomecanica (sin id)', n: bioSinId, calidad: 'no_estructurado', tarea: 'Reasociar estas mediciones a un id estructurado; no se cuentan como vinculadas.' });
    if (lleno(o.rom)) out.push({ origen: 'valoracion.rom', valor_texto: String(o.rom), unidad: 'texto', es_numerico: !!h.romEsNumerico, calidad: 'no_estructurado',
      tarea: 'Capturar en el módulo biomecánico (id estructurado) para que cuente como medición vinculada.' });
    if (lleno(o.fuerza)) out.push({ origen: 'valoracion.fuerza', valor_texto: String(o.fuerza), unidad: 'texto', es_numerico: !!h.fuerzaEsNumerica, calidad: 'no_estructurado',
      tarea: 'Capturar con escala/dinamómetro para trazabilidad; no cuenta como medición vinculada.' });
    return out;
  }

  // --- Episodio / nuevo motivo (punto 5): un paciente que regresa puede venir por OTRA lesión.
  //     Si la nota SOAP MÁS RECIENTE describe una región distinta a la del motivo valorado (o hay
  //     lenguaje explícito de nuevo motivo), se marca SOSPECHA → iniciar valoración desde sesión 1
  //     y NO mezclar valoraciones/objetivos/mediciones de motivos distintos. No se auto-divide.
  function episodioNuevo(rec, h) {
    var soapAct = h.soap_actual || '';
    if (!soapAct || h.soap_n < 2) {
      var expl0 = EX.termState(soapAct, ['nuevo motivo', 'nueva lesion', 'otra lesion', 'distinto motivo', 'ahora acude por', 'ahora consulta por', 'acude ahora por', 'motivo diferente']).affirmed;
      if (!expl0) return { sospecha: false };
    }
    var explicito = EX.termState(soapAct, ['nuevo motivo', 'nueva lesion', 'otra lesion', 'distinto motivo', 'ahora acude por', 'ahora consulta por', 'acude ahora por', 'motivo diferente']).affirmed;
    var regAct = EX.regionDe(soapAct);
    var regVal = []; [h.regionZona, h.regionDx, h.regionMecanismo, h.regionPatologia].forEach(function (a) { (a || []).forEach(function (r) { if (regVal.indexOf(r) === -1) regVal.push(r); }); });
    var cambioRegion = regAct.length && regVal.length && !regAct.some(function (r) { return regVal.indexOf(r) !== -1; }) && h.soap_n >= 2;
    var sospecha = explicito || cambioRegion;
    return {
      sospecha: sospecha, explicito: explicito, cambio_region: cambioRegion,
      region_valoracion: regVal, region_soap_reciente: regAct,
      accion: sospecha ? 'Posible NUEVO motivo de consulta (episodio distinto): iniciar valoración desde sesión 1 para este motivo. NO mezclar valoración/objetivos/mediciones con el motivo previo.' : null
    };
  }

  function generar(rec, opts) {
    opts = opts || {};
    return scrubDeep(_generar(rec, opts)); // scrub PHI defensivo sobre TODO el contrato de salida
  }

  function _generar(rec, opts) {
    opts = opts || {};
    // fecha_corte EFECTIVA (punto 7: ningún resultado sin fecha_corte): la provista, o la última
    // fecha de SOAP dentro de corte, o la fecha por defecto de la corrida (opts.fecha_corte_default).
    var h0 = EX.extraer(rec, opts);
    var fcEfectiva = opts.fecha_corte || rec.fecha_corte || (h0.soap_fechas && h0.soap_fechas.length ? h0.soap_fechas[h0.soap_fechas.length - 1] : null) || opts.fecha_corte_default || null;
    var h = (fcEfectiva && fcEfectiva !== h0.fecha_corte) ? EX.extraer(rec, { fecha_corte: fcEfectiva }) : h0;
    var confl = conflictos(rec, h);
    var seguridad = MS.evaluar(h);
    var dxf = dxFuncional(rec, h);
    var epi = episodioNuevo(rec, h);
    var o = rec.orig || {};
    var pend = [];
    if (epi.sospecha) pend.unshift('EPISODIO: ' + epi.accion);
    if (!h.romEsNumerico) pend.push('Medir ROM goniométrico (grados)' + (h.romTextoCualitativo ? ' — hoy solo hay descripción cualitativa' : ''));
    if (!h.fuerzaEsNumerica) pend.push('Medir fuerza con escala (dinamómetro/Daniels)' + (h.fuerzaTextoCualitativo ? ' — hoy solo hay descripción cualitativa' : ''));
    if (!h.pruebasEspecialesPresentes) pend.push('Realizar pruebas especiales pertinentes');
    if (!h.cribadoDocumentado) pend.push('Documentar cribado de banderas rojas (no se infiere de pruebas especiales).');
    if (h.datosInsuficientes) pend.unshift('DATOS INSUFICIENTES: completar exploración y cribado antes de afirmar seguridad o fijar metas (ausencia de dato ≠ ausencia de riesgo).');
    if (seguridad.estado === 'emergencia' || seguridad.estado === 'derivacion_prioritaria' || seguridad.estado === 'bloqueo_por_dato_inconsistente' || seguridad.estado === 'error_regla') {
      pend.unshift('Resolver seguridad: ' + (seguridad.alertas[0] ? (seguridad.alertas[0].regla + ' · ' + seguridad.alertas[0].accion) : ''));
    }
    confl.lista.forEach(function (c) { pend.push('Aclarar ' + c.tipo + ': ' + c.detalle); });

    var medVinc = mediciones(rec);
    var medSin = medicionesSinVincular(rec, h);

    return {
      version_generador: VERSION, version_extractor: h.version_extractor, version_motor: seguridad.version, catalogo_seguridad: seguridad.catalogo_version,
      episodio: rec.codigo || null, fecha_corte: fcEfectiva,
      episodio_analisis: epi,
      soap_procesado: { n_notas: h.soap_n, fechas: h.soap_fechas, valoracion_inicial_presente: !!h.soap_inicial, evolucion_actual_presente: !!h.soap_actual },
      diagnostico_funcional: { texto: dxf.texto, estado: dxf.estado, evidencias: dxf.evidencias },
      hipotesis: hipotesis(rec, h),
      seguridad: { estado: seguridad.estado, cribado_documentado: seguridad.cribado_documentado, nota: seguridad.nota, alertas: seguridad.alertas, bloquea_plan: seguridad.bloquea_plan, reglas_pendientes: seguridad.reglas_pendientes, pendientes_bloqueo: seguridad.pendientes_bloqueo },
      discrepancias: confl.lista,
      valoracion_pendiente: pend,
      objetivos: objetivos(rec, h, seguridad),
      plan: plan(rec, h, seguridad),
      mediciones: medVinc,
      mediciones_vinculadas_n: medVinc.length,
      mediciones_sin_vincular: medSin,
      hechos_clave: {
        oncologico: h.oncologico, oncologico_familiar_solo: h.oncologico_familiar_solo, oncoActivo: h.oncoActivo, oncoEstadoDudoso: h.oncoEstadoDudoso,
        caudaEquina: h.caudaEquina, compresionMedular: h.compresionMedular, tvp: h.tvp, tvpSospecha: h.tvpSospecha,
        sintomaNeuroReferido: h.sintomaNeuroReferido, deficitNeuroObjetivo: h.deficitNeuroObjetivo, deficitNeuroDerivacion: h.deficitNeuroDerivacion, mielopatia: h.mielopatia,
        traumaCervicalAxial: h.traumaCervicalAxial, ladoConflicto: h.ladoConflicto, regionConflicto: h.regionConflicto,
        regionZona: h.regionZona, regionDx: h.regionDx, regionMecanismo: h.regionMecanismo, regionPatologia: h.regionPatologia,
        ligamentoIpsilateralPrevio: h.ligamentoIpsilateralPrevio, ligamentoContralateral: h.ligamentoContralateral,
        inflamacionPresente: h.inflamacionPresente, romEsNumerico: h.romEsNumerico, fuerzaEsNumerica: h.fuerzaEsNumerica, datosInsuficientes: h.datosInsuficientes,
        evidencias: h.evidencias
      },
      validacion_profesional: { estado: 'borrador', autor: null, fecha: null, fuentes: [seguridad.version, h.version_extractor], cambios: [] }
    };
  }

  var API = { version: VERSION, generar: generar, _conflictos: conflictos, _objetivos: objetivos, _plan: plan, _mediciones: mediciones, _medicionesSinVincular: medicionesSinVincular, _episodioNuevo: episodioNuevo, _dxFuncional: dxFuncional, _actividadValida: actividadValida, _scrubPHI: scrubPHI, ESCALAS: ESCALAS, PROTO_INDEX: PROTO_INDEX };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.GeneradorV2 = API;
})(typeof window !== 'undefined' ? window : globalThis);
