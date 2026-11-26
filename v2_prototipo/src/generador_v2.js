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
  var VERSION = '2.2.1-proto';

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

  // Diagnóstico funcional NATURAL y CONCISO, individualizado: aprovecha relato + mecanismo + dx médico
  // + síntomas (dolor / neural referido vs objetivado, sin mezclar) + hallazgos objetivos (ROM / FUERZA
  // en escala 0–10 comparativa de Sinergia) + limitación + antecedentes pertinentes + evolución SOAP.
  function dxFuncional(rec, h) {
    var o = rec.orig || {};
    var relatoCorto = lleno(o.padecimiento) && String(o.padecimiento).trim().length >= 15;
    if (!relatoCorto) return { texto: 'Anamnesis insuficiente para un diagnóstico funcional. Primera acción: RECAPTURAR la historia (zona, lado, EVA, mecanismo y limitación funcional).', estado: 'provisional', evidencias: [] };
    var reg = lleno(o.zona) ? String(o.zona).replace('_', '/') : 'región por precisar';
    var lado = (h.lado) ? (' ' + h.lado) : '';
    var evid = [];
    var conDx = (lleno(o.dxMedico) && norm(o.dxMedico).indexOf('no cuenta') === -1) ? String(o.dxMedico).trim()
      : (lleno(o.dxMedicoMotivo) ? String(o.dxMedicoMotivo).trim() : null);
    if (conDx) evid.push({ campo: 'motivo.dxMedico', fragmento: conDx });
    var mec = lleno(o.mecanismo) ? String(o.mecanismo).trim() : null;
    if (mec) evid.push({ campo: 'motivo.mecanismo', fragmento: mec });
    // --- Síntomas (dolor; neural REFERIDO vs OBJETIVADO: no se mezclan; la disminución de fuerza NO es neuro) ---
    var sintomas = [];
    if (lleno(o.eva)) { sintomas.push('dolor EVA ' + String(o.eva).trim() + (/^\d+$/.test(String(o.eva).trim()) ? '/10' : '')); evid.push({ campo: 'valoracion.eva', fragmento: String(o.eva) }); }
    if (h.dolorNocturno) { sintomas.push('de predominio nocturno/en reposo'); if (h.evidencias.dolor_nocturno) evid.push(h.evidencias.dolor_nocturno); }
    else if (h.dolorPersistente) { sintomas.push('persistente'); if (h.evidencias.dolor_persistente) evid.push(h.evidencias.dolor_persistente); }
    if (h.inflamacionPresente) { sintomas.push('con inflamación'); if (h.evidencias.inflamacion) evid.push(h.evidencias.inflamacion); }
    if (h.deficitNeuroObjetivo) { sintomas.push('con déficit neurológico OBJETIVADO'); if (h.evidencias.deficit_neuro_objetivo) evid.push(h.evidencias.deficit_neuro_objetivo); }
    else if (h.sintomaNeuroReferido) { sintomas.push('con síntomas neurales referidos (sensitivos, sin déficit objetivado)'); if (h.evidencias.sintoma_neuro_referido) evid.push(h.evidencias.sintoma_neuro_referido); }
    // --- Hallazgos objetivos: ROM goniométrico; FUERZA en escala 0–10 comparativa de Sinergia (sano=10) ---
    var hallaz = [];
    if (h.romEsNumerico) { hallaz.push('ROM ' + String(o.rom).trim()); evid.push({ campo: 'valoracion.rom', fragmento: String(o.rom) }); }
    else if (h.romTextoCualitativo) { hallaz.push('movilidad "' + String(o.rom).trim() + '" (cualitativa, sin goniometría)'); evid.push({ campo: 'valoracion.rom', fragmento: String(o.rom) }); }
    if (h.fuerzaEsNumerica) {
      var fTxt;
      if (h.fuerzaEscala === 'comparativa_0_10') {
        fTxt = 'fuerza ' + (h.fuerzaGrupo ? h.fuerzaGrupo + ' ' : '') + h.fuerzaValor + '/10 (escala comparativa Sinergia' +
          (h.fuerzaPctEstimado != null ? ', ≈' + h.fuerzaPctEstimado + '% de la referencia' : '') +
          (h.fuerzaRefSanaConfirmada ? '; lado sano confirmado 10/10' : (h.fuerzaRefMencionada ? '; referencia por confirmar' : '')) + ')';
      } else { fTxt = 'fuerza ' + String(o.fuerza).trim() + ' (escala /5 documentada; no se convierte a 0–10)'; }
      hallaz.push(fTxt); evid.push({ campo: 'valoracion.fuerza', fragmento: String(o.fuerza) });
    } else if (h.fuerzaTextoCualitativo) {
      hallaz.push('fuerza "' + String(o.fuerza).trim() + '" (cualitativa, sin escala 0–10)'); evid.push({ campo: 'valoracion.fuerza', fragmento: String(o.fuerza) });
    }
    if (h.debilidadSinContextoNeuro) hallaz.push('(la disminución de fuerza referida no muestra contexto neurológico: se interpreta como déficit de fuerza, no neural)');
    if (lleno(o.palpacion)) { hallaz.push('palpación: ' + String(o.palpacion).trim()); evid.push({ campo: 'valoracion.palpacion', fragmento: String(o.palpacion) }); }
    if (h.pruebasEspecialesPresentes) { hallaz.push('pruebas especiales: ' + String(o.pruebas).trim()); evid.push({ campo: 'valoracion.pruebas', fragmento: String(o.pruebas) }); }
    var limit = lleno(o.limitaciones) ? String(o.limitaciones).trim() : null;
    if (limit) evid.push({ campo: 'dxFuncional.limitaciones', fragmento: limit });
    // Antecedentes PERSONALES pertinentes (breve) — para individualizar, no diagnóstico familiar.
    var antPert = [];
    if (h.metal) antPert.push('material de osteosíntesis/prótesis');
    if (h.oncologico) antPert.push('antecedente oncológico (verificar estado)');
    if (h.diabetesPersonal) antPert.push('diabetes');
    if (h.anticoagulacion) antPert.push('anticoagulación');
    if (h.embarazo) antPert.push('embarazo');
    // Evolución: desde cuándo + tendencia por nº de notas SOAP.
    var crono = (lleno(o.desdeCuando) && /[a-z0-9]/i.test(String(o.desdeCuando))) ? String(o.desdeCuando).trim() : null;
    var trend = (h.soap_n >= 2) ? ('en seguimiento, ' + h.soap_n + ' notas SOAP') : null;
    // Prosa natural y concisa (frases cortas, voz clínica).
    var frase1 = ('Disfunción de ' + reg + lado + (conDx ? ' en contexto de ' + conDx : '') + (mec ? ' por ' + mec : '')).trim() + '.';
    var frase2 = sintomas.length ? ('Cursa con ' + sintomas.join(', ') + '.') : '';
    var frase3 = hallaz.length ? ('A la exploración: ' + hallaz.join('; ') + '.') : 'Sin hallazgos objetivos documentados.';
    var frase4 = limit ? ('Limita: ' + limit + '.') : '';
    var frase5 = antPert.length ? ('Antecedentes a considerar: ' + antPert.join(', ') + '.') : '';
    var frase6 = (crono || trend) ? ('Evolución: ' + [crono, trend].filter(Boolean).join('; ') + '.') : '';
    var faltan = [];
    if (!h.romEsNumerico) faltan.push('ROM goniométrico');
    if (!h.fuerzaEsNumerica) faltan.push('fuerza en escala 0–10');
    if (!h.pruebasEspecialesPresentes) faltan.push('pruebas especiales');
    var pend = faltan.length ? (' Exploración objetiva por completar (' + faltan.join(', ') + '): diagnóstico PROVISIONAL.') : '';
    if (h.datosInsuficientes) pend += ' Datos clínicos insuficientes: no se afirma seguridad por ausencia de hallazgos.';
    var txt = [frase1, frase2, frase3, frase4, frase5, frase6].filter(Boolean).join(' ') + pend;
    return { texto: txt, estado: 'provisional', evidencias: evid };
  }

  function hipotesis(rec, h) {
    var o = rec.orig || {}; var out = [];
    if (lleno(o.dxMedico) && norm(o.dxMedico).indexOf('no cuenta') === -1) {
      out.push({ texto: 'Hipótesis estructural a partir del dx médico referido: ' + o.dxMedico + ' (referido, a confirmar).', sustento: [{ campo: 'motivo.dxMedico', fragmento: String(o.dxMedico) }], pendiente: ['confirmar con exploración/imagen pertinente'] });
    }
    return out;
  }

  // Objetivos INDIVIDUALIZADOS por horizonte (CORTO / MEDIANO / LARGO plazo), uno por alteración
  // detectada, cada uno con indicador / línea base / unidad / método / criterio. Las METAS se PROPONEN
  // editables y JUSTIFICADAS cuando hay datos suficientes (EVA inicial; fuerza con referencia sana
  // CONFIRMADA); donde faltaría un supuesto (p.ej. simetría sin lado sano confirmado), la meta queda
  // null con la razón. La fuerza usa la escala 0–10 comparativa de Sinergia (NO Daniels/MRC, no conversión).
  function objetivos(rec, h, seguridad) {
    var o = rec.orig || {}; var pat = rec.patologia || 'Otro'; var escala = ESCALAS[pat] || ESCALAS['Otro'];
    var objs = [];
    if (seguridad.bloquea_plan) {
      objs.push({ fase: 'seguridad', alteracion: 'alerta de seguridad activa', actividad: 'resolver la acción de seguridad antes de fijar objetivos terapéuticos', indicador: 'acción de seguridad del motor', linea_base: null, meta_propuesta: null, unidad: null, metodo: null, reevaluacion: 'inmediata', criterio_cumplimiento: 'alerta resuelta / derivación realizada', evidencias: (seguridad.alertas[0] ? [{ campo: 'motor_seguridad', fragmento: seguridad.alertas[0].regla + ': ' + seguridad.alertas[0].accion }] : []) });
      return objs; // con plan bloqueado, no se fijan objetivos terapéuticos
    }
    // ===== CORTO PLAZO: dolor / control de síntomas =====
    if (lleno(o.eva)) {
      var evaNum = parseFloat(String(o.eva).replace(/[^\d.]/g, ''));
      var metaEva = null, justEva = null;
      if (!isNaN(evaNum)) {
        // Propuesta EDITABLE justificada por la línea base y la irritabilidad (no es una regla fija ni "dolor cero").
        var objetivoEva = (evaNum >= 7) ? Math.max(4, Math.round(evaNum - 3)) : (evaNum >= 4 ? Math.max(2, evaNum - 2) : Math.max(0, evaNum - 1));
        metaEva = { valor: '≤ ' + objetivoEva + '/10', tipo: 'propuesta_editable' };
        justEva = 'Propuesta a partir de la EVA inicial ' + evaNum + '/10 (descenso clínicamente relevante escalonado por irritabilidad). Editable por el fisioterapeuta.';
      }
      objs.push({ fase: 'corto', alteracion: 'dolor', actividad: 'reducir el dolor y la irritabilidad',
        indicador: 'EVA', linea_base: { valor: isNaN(evaNum) ? String(o.eva) : evaNum, unidad: '/10', fuente: 'valoracion.eva', tipo: isNaN(evaNum) ? 'texto' : 'medido' },
        meta_propuesta: metaEva, justificacion_meta: justEva,
        meta_nota: 'Meta editable; no es una reducción fija obligatoria ni "dolor cero". Reevaluar por irritabilidad y objetivo del paciente.',
        unidad: '/10', metodo: 'EVA contextualizada', reevaluacion: '1–2 semanas', criterio_cumplimiento: 'EVA en la meta acordada, sostenida', evidencias: [{ campo: 'valoracion.eva', fragmento: String(o.eva) }] });
    } else {
      objs.push({ fase: 'corto', alteracion: 'control de síntomas', actividad: 'controlar síntomas y educar al paciente; capturar EVA de línea base',
        indicador: 'EVA', linea_base: { valor: null, tipo: 'pendiente', fuente: 'valoracion.eva', nota: 'EVA no documentada: capturar línea base' },
        meta_propuesta: null, unidad: '/10', metodo: 'EVA contextualizada', reevaluacion: '1–2 semanas', criterio_cumplimiento: 'síntomas controlados y EVA capturada', evidencias: [] });
    }
    // ===== MEDIANO PLAZO: movilidad (ROM) =====
    if (h.romEsNumerico) {
      objs.push({ fase: 'mediano', alteracion: 'déficit de movilidad', actividad: 'recuperar ROM funcional de la zona',
        indicador: 'ROM (goniometría)', linea_base: { valor: String(o.rom).trim(), unidad: 'grados', fuente: 'valoracion.rom', tipo: 'medido' },
        meta_propuesta: null, meta_nota: 'Definir ROM meta con el fisio según articulación, objetivo y ROM del lado sano/funcional (no se asume simetría automática; proponer meta al documentar la referencia).',
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
    // ===== MEDIANO PLAZO: fuerza (escala 0–10 comparativa de Sinergia; sano/referencia = 10) =====
    if (h.fuerzaEsNumerica && h.fuerzaEscala === 'comparativa_0_10') {
      var metaFz = null, justFz = null, criterioFz;
      if (h.fuerzaRefSanaConfirmada) {
        // SOLO se propone simetría si el lado sano/referencia está CONFIRMADO sano (no se asume contralateral sano).
        metaFz = { valor: '10/10 (simetría con la referencia sana confirmada)', tipo: 'propuesta_editable' };
        justFz = 'La referencia (lado sano) está CONFIRMADA en 10/10; se propone acercar el lado afectado (' + h.fuerzaValor + '/10 ≈ ' + h.fuerzaPctEstimado + '%) a la referencia. Editable por el fisioterapeuta.';
        criterioFz = 'fuerza del segmento ≥ meta acordada respecto a la referencia sana';
      } else {
        justFz = 'No se propone meta de simetría: la referencia (lado sano) NO está confirmada sana (no se asume el contralateral sano). Primera acción: confirmar/medir la referencia válida.';
        criterioFz = 'fuerza en la meta acordada una vez definida la referencia';
      }
      objs.push({ fase: 'mediano', alteracion: 'déficit de fuerza' + (h.fuerzaGrupo ? ' (' + h.fuerzaGrupo + ')' : ''), actividad: 'recuperar fuerza del segmento',
        indicador: 'fuerza — escala comparativa 0–10 de Sinergia',
        linea_base: { valor: h.fuerzaValor + '/10', unidad: '/10', escala: 'comparativa_0_10', referencia: 'lado sano = 10', pct_estimado: h.fuerzaPctEstimado, grupo_muscular: h.fuerzaGrupo, lado: h.fuerzaLado, referencia_confirmada_sana: !!h.fuerzaRefSanaConfirmada, fuente: 'valoracion.fuerza', tipo: 'medido' },
        meta_propuesta: metaFz, justificacion_meta: justFz,
        meta_nota: 'Escala 0–10 de Sinergia (lado sano = 10/10; 6/10 ≈ 60% de la referencia). NO se sustituye por Daniels/MRC ni se convierte entre escalas.',
        unidad: '/10', metodo: 'escala comparativa 0–10 de Sinergia (lado sano/referencia = 10)', reevaluacion: '4–6 semanas', criterio_cumplimiento: criterioFz, evidencias: [{ campo: 'valoracion.fuerza', fragmento: String(o.fuerza) }] });
    } else if (h.fuerzaEsNumerica && h.fuerzaEscala === 'daniels_0_5') {
      objs.push({ fase: 'mediano', alteracion: 'déficit de fuerza', actividad: 'recuperar fuerza del segmento',
        indicador: 'fuerza (escala /5 legada — documentada tal cual)',
        linea_base: { valor: h.fuerzaValor + '/5', unidad: '/5', escala: 'daniels_0_5', fuente: 'valoracion.fuerza', tipo: 'medido', nota: 'Escala /5 legada; NO se convierte a 0–10. Recapturar en escala 0–10 de Sinergia para seguimiento comparativo.' },
        meta_propuesta: null, meta_nota: 'No se convierte /5 a 0–10. Para seguimiento comparativo, recapturar fuerza en la escala 0–10 de Sinergia (lado sano = 10).',
        unidad: '/5', metodo: 'escala documentada (no convertida)', reevaluacion: '4–6 semanas', criterio_cumplimiento: 'fuerza en la meta acordada', evidencias: [{ campo: 'valoracion.fuerza', fragmento: String(o.fuerza) }] });
    } else if (h.fuerzaTextoCualitativo) {
      objs.push({ fase: 'mediano', alteracion: 'fuerza (descrita en texto, sin escala)', actividad: 'medir fuerza en escala 0–10 (lado sano = 10) y luego recuperarla',
        indicador: 'fuerza — escala comparativa 0–10 de Sinergia', linea_base: { valor: String(o.fuerza).trim(), unidad: 'texto', fuente: 'valoracion.fuerza', tipo: 'texto_cualitativo', nota: 'descripción cualitativa: capturar en escala 0–10 de Sinergia contra el lado sano/referencia' },
        meta_propuesta: null, unidad: '/10', metodo: 'escala comparativa 0–10 de Sinergia', reevaluacion: 'tras medir', criterio_cumplimiento: null, evidencias: [{ campo: 'valoracion.fuerza', fragmento: String(o.fuerza) }] });
    } else {
      objs.push({ fase: 'mediano', alteracion: 'fuerza (no medida)', actividad: 'medir fuerza en escala 0–10 (lado sano = 10) y luego recuperarla',
        indicador: 'fuerza — escala comparativa 0–10 de Sinergia', linea_base: { valor: null, tipo: 'pendiente', fuente: 'valoracion.fuerza', nota: 'no medida: capturar en escala 0–10 de Sinergia contra la referencia válida' },
        meta_propuesta: null, unidad: '/10', metodo: 'escala comparativa 0–10 de Sinergia', reevaluacion: 'tras medir', criterio_cumplimiento: null, evidencias: [] });
    }
    // ===== LARGO PLAZO: función / retorno a actividad =====
    var prioridad = actividadValida(o.deportivos) ? o.deportivos : (actividadValida(o.objetivoFuncional) ? o.objetivoFuncional : null);
    objs.push({ fase: 'largo',
      alteracion: 'limitación funcional / retorno a actividad',
      actividad: prioridad ? ('retorno a ' + prioridad + ' según criterios') : 'retorno a la actividad funcional prioritaria según criterios (definir la actividad con el paciente: no documentada)',
      indicador: escala + ' + prueba funcional pertinente',
      linea_base: lleno(o.limitaciones) ? { valor: o.limitaciones, fuente: 'dxFuncional.limitaciones', tipo: 'documentado' } : { valor: null, tipo: 'pendiente', nota: 'limitación funcional no documentada' },
      meta_propuesta: prioridad ? { valor: prioridad, tipo: 'propuesta_editable' } : null,
      justificacion_meta: prioridad ? ('Meta de retorno tomada de la actividad/objetivo documentado del paciente: "' + prioridad + '". Editable.') : null,
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

  // Mediciones BIOMECÁNICAS: se CONSUME la estructura real p.biomecanica[].medidas[] (sesiones →
  // medidas). NO se tocan los algoritmos de medición (los implementa el módulo/otra ventana); esta rama
  // solo LEE. Por cada medida se recupera: valor ANGULAR, lateralidad, movimiento, fecha, método y
  // evidencia. Se distingue el ESTADO: 'actual' (la más reciente por articulación+movimiento+lado),
  // 'historica' (más antiguas del mismo gesto), 'pendiente' (sin valor aún) y 'eliminada' (tombstone
  // `eliminado` en la sesión o la medida). VINCULADA = con id estructurado y NO eliminada (punto 7).
  // Back-compat: si un elemento de p.biomecanica no trae `.medidas`, se trata como una medida suelta.
  function _bmNorm(s) { return String(s == null ? '' : s).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().trim(); }
  function _bmFecha(f) { var d = Date.parse(f || ''); return isNaN(d) ? 0 : d; }
  function mediciones(rec) {
    var bio = Array.isArray(rec.biomecanica) ? rec.biomecanica : [];
    var items = [];
    bio.forEach(function (ses) {
      if (!ses) return;
      var sesFecha = ses.fecha || ses.date || null;
      var sesElim = ses.eliminado === true || ses.deleted === true;
      var sesId = ses.id || null;
      var medidas = Array.isArray(ses.medidas) ? ses.medidas : (Array.isArray(ses.mediciones) ? ses.mediciones : null);
      if (medidas) medidas.forEach(function (m) { items.push({ m: m, sesFecha: sesFecha, sesElim: sesElim, sesId: sesId }); });
      else items.push({ m: ses, sesFecha: sesFecha, sesElim: sesElim, sesId: sesId }); // elemento plano (back-compat)
    });
    var norm = items.map(function (it) {
      var m = it.m || {};
      var articulacion = m.articulacion || m.joint || null, movimiento = m.movimiento || m.movement || null, lado = m.lado || m.side || null;
      var id = m.id || (it.sesId && articulacion ? (it.sesId + ':' + _bmNorm(articulacion) + ':' + _bmNorm(movimiento) + ':' + _bmNorm(lado)) : null);
      var valor = (m.valor != null ? m.valor : (m.grado != null ? m.grado : (m.angulo != null ? m.angulo : (m.grados != null ? m.grados : null))));
      var elim = it.sesElim || m.eliminado === true || m.deleted === true;
      var fecha = m.fecha || it.sesFecha || null;
      return {
        id: id, sesion_id: it.sesId || null, paciente: rec.codigo || null, fecha: fecha,
        articulacion: articulacion, movimiento: movimiento, lado: lado,
        tipo: m.tipo || m.activa_pasiva || null, posicion: m.posicion || null, metodo: m.metodo || m.method || 'biomecanica',
        unidad: m.unidad || 'grados', valor: valor, calidad: m.calidad || m.quality || null, autor: m.autor || null,
        eliminada: !!elim, pendiente: (valor == null && !elim),
        evidencia: { campo: 'p.biomecanica[].medidas[]', id: id, sesion: it.sesId || null }
      };
    });
    function keyOf(x) { return [_bmNorm(x.articulacion), _bmNorm(x.movimiento), _bmNorm(x.lado)].join('|'); }
    var masReciente = {};
    norm.forEach(function (x) { if (x.eliminada || x.valor == null) return; var k = keyOf(x), t = _bmFecha(x.fecha); if (!(k in masReciente) || t >= masReciente[k]) masReciente[k] = t; });
    norm.forEach(function (x) {
      if (x.eliminada) { x.estado = 'eliminada'; return; }
      if (x.valor == null) { x.estado = 'pendiente'; return; }
      x.estado = (_bmFecha(x.fecha) === masReciente[keyOf(x)]) ? 'actual' : 'historica';
    });
    var vinculadas = norm.filter(function (x) { return x.id && !x.eliminada; });
    var resumen = {
      actuales: norm.filter(function (x) { return x.estado === 'actual'; }),
      historicas: norm.filter(function (x) { return x.estado === 'historica'; }),
      pendientes: norm.filter(function (x) { return x.estado === 'pendiente'; }),
      eliminadas: norm.filter(function (x) { return x.estado === 'eliminada'; }),
      conteo: {
        total: norm.length,
        actuales: norm.filter(function (x) { return x.estado === 'actual'; }).length,
        historicas: norm.filter(function (x) { return x.estado === 'historica'; }).length,
        pendientes: norm.filter(function (x) { return x.estado === 'pendiente'; }).length,
        eliminadas: norm.filter(function (x) { return x.estado === 'eliminada'; }).length,
        sin_id: norm.filter(function (x) { return !x.id; }).length
      }
    };
    return { todas: norm, vinculadas: vinculadas, resumen: resumen };
  }

  // Datos de ROM/fuerza que existen SOLO como texto (sin id estructurado), y medidas biomecánicas sin id:
  // NO son mediciones vinculadas; se listan aparte como tarea de captura para trazabilidad. Nunca inflan
  // el conteo de mediciones vinculadas.
  function medicionesSinVincular(rec, h, med) {
    var o = rec.orig || {}; var out = [];
    var bioSinId = (med && med.todas ? med.todas : []).filter(function (x) { return !x.id && !x.eliminada; }).length;
    if (bioSinId) out.push({ origen: 'p.biomecanica[].medidas[] (sin id)', n: bioSinId, calidad: 'no_estructurado', tarea: 'Reasociar estas medidas a un id estructurado; no se cuentan como vinculadas.' });
    if (lleno(o.rom)) out.push({ origen: 'valoracion.rom', valor_texto: String(o.rom), unidad: 'texto', es_numerico: !!h.romEsNumerico, calidad: 'no_estructurado',
      tarea: 'Capturar en el módulo biomecánico (id estructurado) para que cuente como medición vinculada.' });
    if (lleno(o.fuerza)) out.push({ origen: 'valoracion.fuerza', valor_texto: String(o.fuerza), unidad: 'texto', es_numerico: !!h.fuerzaEsNumerica, escala: h.fuerzaEscala || null, calidad: 'no_estructurado',
      tarea: 'Capturar la fuerza en escala 0–10 de Sinergia (lado sano = 10) para seguimiento comparativo; no cuenta como medición vinculada biomecánica.' });
    return out;
  }

  // --- Episodio / nuevo motivo (punto 5): se CONSUME la estructura REAL de Sinergia
  //     (motivosAnteriores, motivoActualIndex, numSesionEpisodioActual, motivoIndex, numEpisodio) SOLO
  //     de lectura. La IA opera ÚNICAMENTE dentro del motivo ACTIVO y NO mezcla lesiones/objetivos/
  //     valoraciones/sesiones de motivos distintos. La IA **NO inicia** un nuevo motivo: si el SOAP
  //     reciente sugiere otra región o lenguaje de nuevo motivo, se emite una OBSERVACIÓN informativa;
  //     la decisión de abrir un nuevo motivo es del FISIOTERAPEUTA.
  function episodioAnalisis(rec, h) {
    var e = rec.episodio || {};
    var num = function (v) { return (v === 0 || (v != null && v !== '')) ? v : null; };
    var estructura = {
      numEpisodio: num(e.numEpisodio),
      motivoActualIndex: num(e.motivoActualIndex),
      motivoIndex: num(e.motivoIndex),
      numSesionEpisodioActual: num(e.numSesionEpisodioActual),
      motivosAnteriores_n: Array.isArray(e.motivosAnteriores) ? e.motivosAnteriores.length : null
    };
    var soapAct = h.soap_actual || '';
    var explicito = EX.termState(soapAct, ['nuevo motivo', 'nueva lesion', 'otra lesion', 'distinto motivo', 'ahora acude por', 'ahora consulta por', 'acude ahora por', 'motivo diferente']).affirmed;
    var regAct = EX.regionDe(soapAct);
    var regVal = []; [h.regionZona, h.regionDx, h.regionMecanismo, h.regionPatologia].forEach(function (a) { (a || []).forEach(function (r) { if (regVal.indexOf(r) === -1) regVal.push(r); }); });
    var cambioRegion = regAct.length && regVal.length && !regAct.some(function (r) { return regVal.indexOf(r) !== -1; }) && h.soap_n >= 2;
    var posibleNuevoMotivo = explicito || cambioRegion;
    return {
      estructura: estructura,
      alcance: 'La IA opera SOLO dentro del motivo activo' + (estructura.motivoActualIndex != null ? ' (motivoActualIndex = ' + estructura.motivoActualIndex + ')' : '') + '; no mezcla lesiones, objetivos, valoraciones ni sesiones de otros motivos.',
      // 'sospecha' se CONSERVA por compatibilidad de herramientas, pero su semántica es OBSERVACIÓN
      // informativa, nunca una acción automática: la IA no inicia un nuevo motivo.
      sospecha: posibleNuevoMotivo,
      posible_nuevo_motivo: posibleNuevoMotivo, inicia_automaticamente: false, decide: 'fisioterapeuta',
      explicito: explicito, cambio_region: cambioRegion,
      region_valoracion: regVal, region_soap_reciente: regAct,
      observacion: posibleNuevoMotivo
        ? ('OBSERVACIÓN (no acción automática): el SOAP más reciente sugiere ' + (explicito ? 'lenguaje de nuevo motivo' : 'una región distinta (' + regAct.join('/') + ') a la del motivo valorado (' + regVal.join('/') + ')') + '. El fisioterapeuta decide si abre un NUEVO motivo; la IA NO lo inicia ni mezcla datos entre motivos.')
        : null
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
    var epi = episodioAnalisis(rec, h);
    var o = rec.orig || {};
    var pend = [];
    // Observación informativa (NO acción automática): la IA no inicia un nuevo motivo; decide el fisio.
    if (epi.posible_nuevo_motivo) pend.push('POSIBLE NUEVO MOTIVO (informativo; lo decide el fisioterapeuta, la IA no lo inicia): ' + epi.observacion);
    if (!h.romEsNumerico) pend.push('Medir ROM goniométrico (grados)' + (h.romTextoCualitativo ? ' — hoy solo hay descripción cualitativa' : ''));
    if (!h.fuerzaEsNumerica) pend.push('Medir fuerza con escala (dinamómetro/Daniels)' + (h.fuerzaTextoCualitativo ? ' — hoy solo hay descripción cualitativa' : ''));
    if (!h.pruebasEspecialesPresentes) pend.push('Realizar pruebas especiales pertinentes');
    if (!h.cribadoDocumentado) pend.push('Documentar cribado de banderas rojas (no se infiere de pruebas especiales).');
    if (h.datosInsuficientes) pend.unshift('DATOS INSUFICIENTES: completar exploración y cribado antes de afirmar seguridad o fijar metas (ausencia de dato ≠ ausencia de riesgo).');
    if (seguridad.estado === 'emergencia' || seguridad.estado === 'derivacion_prioritaria' || seguridad.estado === 'bloqueo_por_dato_inconsistente' || seguridad.estado === 'error_regla') {
      pend.unshift('Resolver seguridad: ' + (seguridad.alertas[0] ? (seguridad.alertas[0].regla + ' · ' + seguridad.alertas[0].accion) : ''));
    }
    confl.lista.forEach(function (c) { pend.push('Aclarar ' + c.tipo + ': ' + c.detalle); });

    var med = mediciones(rec);
    var medSin = medicionesSinVincular(rec, h, med);

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
      mediciones: med.vinculadas,
      mediciones_vinculadas_n: med.vinculadas.length,
      mediciones_biomecanica: med.resumen,
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

  var API = { version: VERSION, generar: generar, _conflictos: conflictos, _objetivos: objetivos, _plan: plan, _mediciones: mediciones, _medicionesSinVincular: medicionesSinVincular, _episodioAnalisis: episodioAnalisis, _dxFuncional: dxFuncional, _actividadValida: actividadValida, _scrubPHI: scrubPHI, ESCALAS: ESCALAS, PROTO_INDEX: PROTO_INDEX };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.GeneradorV2 = API;
})(typeof window !== 'undefined' ? window : globalThis);
