/* SINERGIA · Extractor de hechos clínicos V2.2 (prototipo, determinista, auditable)
 * version 2.2.0-proto · 2026-11-26
 * Convierte un registro de expediente (anonimizado) en HECHOS VERIFICABLES para el motor
 * de seguridad y el generador. A diferencia de V2, NO razona por coincidencia simple de
 * palabras: interpreta NEGACIÓN, TEMPORALIDAD (antecedente/activo/resuelto), LATERALIDAD,
 * y distingue antecedente PERSONAL vs FAMILIAR y notas SOAP fechadas (valoración inicial vs
 * evolución actual). Cada hecho conserva su EVIDENCIA (campo + fragmento literal citado).
 * No diagnostica; alimenta reglas deterministas independientes. Node + navegador.
 */
(function (root) {
  'use strict';
  var VERSION = '2.2.3-proto';

  var norm = function (s) {
    return String(s == null ? '' : s).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();
  };

  // ---- Negación en español. Mira la MISMA cláusula antes del término (hasta . ; o salto),
  //      y una ventana corta después (negativo / (-) / descartado / ausente / negada).
  var NEG_PRE = [
    /\bniega\b/, /\bnieg\w*/, /\bno\b/, /\bsin\b/, /\bdescart\w*/, /\bausen\w*/,
    /\bnegativ\w*/, /\blibre de\b/, /\bno (presenta|refiere|hay|se observa|evidencia|cuenta con)\b/,
    /\bsin datos de\b/, /\bsin antecedente\w* de\b/, /\bnegad\w*/
  ];
  var NEG_POST = [/\bnegativ\w*/, /\(-\)/, /\bdescartad\w*/, /\bausen\w*/, /\bnegad\w*/, /\(neg/];

  function _clauseStart(txt, i) {
    var cut = Math.max(txt.lastIndexOf('.', i - 1), txt.lastIndexOf(';', i - 1), txt.lastIndexOf('\n', i - 1));
    return cut === -1 ? 0 : cut + 1;
  }
  function _negAt(txt, i, termLen) {
    var pre = txt.slice(_clauseStart(txt, i), i);
    var post = txt.slice(i + termLen, i + termLen + 20);
    var p;
    for (p = 0; p < NEG_PRE.length; p++) if (NEG_PRE[p].test(pre)) return true;
    for (p = 0; p < NEG_POST.length; p++) if (NEG_POST[p].test(post)) return true;
    return false;
  }

  // Estado de un conjunto de términos en un texto: present / affirmed / negatedOnly + evidencia.
  function termState(rawText, terms) {
    var txt = norm(rawText);
    var present = false, affirmed = false, ev = null, negEv = null;
    for (var t = 0; t < terms.length; t++) {
      var term = norm(terms[t]); if (!term) continue;
      var from = 0, i;
      while ((i = txt.indexOf(term, from)) !== -1) {
        present = true;
        var neg = _negAt(txt, i, term.length);
        var frag = rawText.slice(Math.max(0, i - 24), i + term.length + 20).trim();
        if (neg) { if (!negEv) negEv = frag; }
        else { affirmed = true; if (!ev) ev = frag; }
        from = i + term.length;
      }
    }
    return { present: present, affirmed: affirmed, negatedOnly: present && !affirmed, evidencia: ev, evidencia_negada: negEv };
  }

  // ¿co-ocurren un término de A y uno de B en la MISMA cláusula (entre . ; o salto)? Sirve para exigir
  // que un contexto neural esté JUNTO a una "debilidad/pérdida de fuerza" antes de llamarla déficit neuro.
  function _coOcurreClausula(rawText, termsA, termsB) {
    var txt = norm(rawText);
    var clausulas = txt.split(/[.;\n]/);
    for (var i = 0; i < clausulas.length; i++) {
      var c = clausulas[i];
      if (!termsA.some(function (t) { return c.indexOf(norm(t)) !== -1; })) continue;
      if (termsB.some(function (t) { return c.indexOf(norm(t)) !== -1; })) return true;
    }
    return false;
  }

  // Lateralidad de un texto (derecho / izquierdo / bilateral / null)
  function ladoDe(rawText) {
    var t = norm(rawText);
    var d = /\bderech\w*|\bder\b|\bdcho\w*|\bd\/\b/.test(t);
    var i = /\bizquierd\w*|\bizq\b|\bizdo\w*|\bi\/\b/.test(t);
    var bil = /\bbilateral\w*|\bambos\b|\bambas\b/.test(t);
    if (bil || (d && i)) return 'bilateral';
    if (d) return 'derecho'; if (i) return 'izquierdo'; return null;
  }

  var VACIO = ['', 'none', 'no evaluado', 'no evaluada', 'no realizadas', 'no realizada', 'pendiente',
    'por definir', '-', 'n/a', 'no especificado', 'no refiere', 'no cuenta con diagnostico medico referido', 'ninguno', 'ninguna'];
  function lleno(v) { return VACIO.indexOf(norm(v).trim()) === -1 && String(v == null ? '' : v).trim() !== ''; }

  // Clasificador de REGIÓN anatómica (para detectar conflicto zona vs dx médico, como HECHO).
  var REGIONES = {
    cervical: ['cervical', 'cuello'], dorsal: ['dorsal', 'toracic', 'espalda alta'], lumbar: ['lumbar', 'lumbalg', 'espalda baja', 'l4', 'l5', 's1'],
    hombro: ['hombro', 'manguito', 'supraespinoso', 'glenohumeral', 'humero proximal'], codo: ['codo', 'epicondil', 'supraintercondilea', 'supracondilea', 'intercondilea', 'olecranon', 'humero distal', 'humeral distal', 'cubito proximal'], muneca_mano: ['muneca', 'mano', 'carpo', 'dedo', 'tunel carpiano', 'escafoides', 'colles'],
    cadera: ['cadera', 'coxofemoral', 'labrum de cadera'], rodilla: ['rodilla', 'menisc', 'rotul', 'patelo', 'cruzado', 'lca', 'gonartros'], tobillo_pie: ['tobillo', 'pie', 'aquiles', 'calcaneo', 'fascitis plantar', 'peroneo', 'astragal', 'maleolo']
  };
  var REGION_LABEL = { cervical: 'columna cervical', dorsal: 'columna dorsal', lumbar: 'columna lumbar', hombro: 'hombro', codo: 'codo', muneca_mano: 'muñeca/mano', cadera: 'cadera', rodilla: 'rodilla', tobillo_pie: 'tobillo/pie' };
  function _regionLabel(k) { return REGION_LABEL[k] || (k ? String(k).replace('_', '/') : 'región por precisar'); }
  function regionDe(txt) {
    txt = norm(txt);
    // "pie fijo" / "de pie" / "a pie" / "en pie" NO son la región anatómica tobillo/pie: son postura o
    // mecanismo (p.ej. "giro con pie fijo"). Se neutralizan para no generar un falso conflicto de región.
    txt = txt.replace(/\bpie\s+fij\w*/g, ' ').replace(/\b(de|a|en)\s+pie\b/g, ' ');
    var found = [];
    Object.keys(REGIONES).forEach(function (r) { if (REGIONES[r].some(function (k) { return txt.indexOf(k) !== -1; })) found.push(r); });
    return found;
  }

  // Grupos musculares frecuentes en MSK (para fuerza por grupo). Nivel módulo (lo usa el parser multi).
  var GRUPOS_MUSC = ['cuadriceps', 'isquiotibial', 'gluteo', 'gastrocnemio', 'soleo', 'tibial anterior', 'peroneo', 'aductor', 'abductor', 'psoas', 'iliopsoas', 'manguito rotador', 'supraespinoso', 'infraespinoso', 'deltoides', 'biceps', 'triceps', 'trapecio', 'dorsal ancho', 'pectoral', 'flexores', 'extensores', 'prension', 'grip', 'core', 'abdominal', 'paravertebral', 'erector'];

  // Parser de FUERZA con MÚLTIPLES grupos: devuelve un objeto por cada valor X/10 (o /5 legado) hallado,
  // asociándole el grupo muscular y la lateralidad más cercanos a la izquierda (misma frase). NO convierte
  // escalas: /10 = comparativa Sinergia (pct = valor*10), /5 = Daniels legado (sin pct). Conserva TODOS.
  function _parseFuerzaMulti(raw) {
    var n = norm(raw); var out = [];
    var re = /(10|\d(?:\.\d)?)\s*\/\s*(10|5)\b/g, m;   // (10|\d…) para que "10/10" no se lea como "0/10"
    while ((m = re.exec(n))) {
      var idx = m.index, valor = parseFloat(m[1]), ref = parseInt(m[2], 10);
      if (valor > ref) continue; // valor fuera de escala → ignora (p.ej. "15/10" sería error)
      var start = Math.max(0, idx - 48);
      var win = n.slice(start, idx + m[0].length);
      var grupo = null, gpos = -1;
      GRUPOS_MUSC.forEach(function (g) { var p = win.lastIndexOf(g); if (p !== -1 && p > gpos) { gpos = p; grupo = g; } });
      out.push({ grupo: grupo, lado: ladoDe(win), escala: ref === 10 ? 'comparativa_0_10' : 'daniels_0_5', valor: valor, ref: ref, pct_estimado: ref === 10 ? Math.round(valor * 10) : null });
    }
    return out;
  }

  // Parser de EVA robusto: distingue reposo vs movimiento/actividad y da un valor representativo (el de
  // movimiento si existe, si no el máximo numérico 0–10). Conserva el texto crudo.
  function _parseEVA(raw) {
    var n = norm(String(raw || ''));
    if (!n.trim()) return { valor: null, reposo: null, movimiento: null, nums: [] };
    // Quita el denominador de escala "/10" para no contaminar los números ("7/10" → "7", "4-6/10" → "4-6").
    var nc = n.replace(/\s*\/\s*10\b/g, '');
    var inR = function (v) { return (v != null && !isNaN(v) && v >= 0 && v <= 10) ? v : null; };
    var pick = function (re) { var mm = nc.match(re); if (!mm) return null; return inR(parseFloat(mm[1] != null ? mm[1] : mm[2])); };
    var reposo = pick(/(\d(?:\.\d)?)\s*(?:en|de|al)?\s*reposo/) || pick(/reposo[^0-9]{0,12}(\d(?:\.\d)?)/);
    var movimiento = pick(/(\d(?:\.\d)?)\s*(?:en|de|al|con)?\s*(?:movimiento|actividad|esfuerzo|mover|cargar|carga|marcha)/) || pick(/(?:movimiento|actividad|esfuerzo|al mover|a la carga)[^0-9]{0,14}(\d(?:\.\d)?)/);
    // Rango "4-6" o "4 a 6" → toma el valor ALTO (peor dolor).
    var rng = nc.match(/\b(\d(?:\.\d)?)\s*(?:-|a)\s*(\d(?:\.\d)?)\b/);
    var rangoAlto = rng ? Math.max(inR(parseFloat(rng[1])) || 0, inR(parseFloat(rng[2])) || 0) : null;
    var nums = (nc.match(/\b(10|\d(?:\.\d)?)\b/g) || []).map(Number).filter(function (x) { return x >= 0 && x <= 10; });
    var valor = (movimiento != null) ? movimiento : (rangoAlto != null ? rangoAlto : (nums.length ? Math.max.apply(null, nums) : null));
    return { valor: valor, reposo: reposo, movimiento: movimiento, nums: nums };
  }

  // SOAP CLÍNICO: extrae hallazgos REALES de cada nota (el campo 'o' suele traer rom/fuerza/hallazgos).
  // Determina el estado ACTUAL (la nota más reciente con dato) vs el inicial, y conserva el histórico de
  // fuerza con sus fechas. No presenta un hallazgo antiguo como actual: cada dato lleva su fecha.
  function _subcampo(oTxt, clave) {
    var re = new RegExp(clave + "['\"\\s]*[:=]\\s*['\"]?([^}'\"]*?)(?:['\"]?\\s*[,}]|rom|fuerza|hallazgos|$)", 'i');
    var m = String(oTxt || '').match(re); return m ? m[1].trim() : null;
  }
  // El campo SOAP 'o' puede venir como OBJETO {rom,fuerza,hallazgos} o como texto. Normaliza a texto plano.
  function _oTexto(oVal) {
    if (oVal && typeof oVal === 'object') return [oVal.rom, oVal.fuerza, oVal.hallazgos, oVal.o, oVal.observaciones].filter(Boolean).map(String).join(' · ');
    return String(oVal || '');
  }
  function _oSub(oVal, clave) {
    if (oVal && typeof oVal === 'object') return (oVal[clave] != null && lleno(oVal[clave])) ? String(oVal[clave]).trim() : null;
    var v = _subcampo(oVal, clave); return (v && lleno(v)) ? v : null;
  }
  function _soapClinico(rec, fechaCorte) {
    var soaps = Array.isArray(rec.soap) ? rec.soap.slice() : [];
    var parse = function (f) { var d = Date.parse(f || ''); return isNaN(d) ? 0 : d; };
    if (fechaCorte) { var fc = parse(fechaCorte); if (fc) soaps = soaps.filter(function (s) { return parse(s.fecha) <= fc; }); }
    soaps.sort(function (a, b) { return parse(a.fecha) - parse(b.fecha); });
    var notas = soaps.map(function (s) {
      var oVal = s && s.o;
      var fuerzaSub = _oSub(oVal, 'fuerza');
      var grupos = _parseFuerzaMulti(fuerzaSub != null ? fuerzaSub : _oTexto(oVal));
      var romSub = _oSub(oVal, 'rom');
      var hallSub = _oSub(oVal, 'hallazgos');
      var texto = [s && s.s, _oTexto(oVal), s && s.a, s && s.p, s && s.texto].filter(Boolean).map(String).join(' · ');
      var hallLimpio = (hallSub && !/^(sin pruebas?|na|n\/a|pendiente|ninguno|ninguna|sin cambios?|s\/p|sin novedad)\.?$/i.test(hallSub.trim())) ? hallSub : null;
      return { fecha: (s && s.fecha) || null, grupos: grupos, romTxt: romSub, hallazgos: hallLimpio, region: regionDe(texto) };
    });
    function latestWith(pred) { for (var i = notas.length - 1; i >= 0; i--) if (pred(notas[i])) return notas[i]; return null; }
    return {
      n: notas.length,
      fuerzaActual: latestWith(function (x) { return x.grupos && x.grupos.length; }),
      romActual: latestWith(function (x) { return x.romTxt; }),
      hallazgosActual: latestWith(function (x) { return x.hallazgos; }),
      histFuerza: notas.filter(function (x) { return x.grupos && x.grupos.length; }).map(function (x) { return { fecha: x.fecha, grupos: x.grupos }; })
    };
  }

  // Texto SOAP: separa nota INICIAL (valoración) de la MÁS RECIENTE (evolución) con fecha_corte.
  function _soapTexto(rec, fechaCorte) {
    var soaps = Array.isArray(rec.soap) ? rec.soap.slice() : [];
    var parse = function (f) { var d = Date.parse(f || ''); return isNaN(d) ? 0 : d; };
    if (fechaCorte) { var fc = parse(fechaCorte); if (fc) soaps = soaps.filter(function (s) { return parse(s.fecha) <= fc; }); }
    soaps.sort(function (a, b) { return parse(a.fecha) - parse(b.fecha); });
    var join = function (s) { return [s && s.s, _oTexto(s && s.o), s && s.a, s && s.p, s && s.texto].filter(Boolean).join(' · '); };
    var inicial = soaps.length ? join(soaps[0]) : '';
    var actual = soaps.length ? join(soaps[soaps.length - 1]) : '';
    var todo = soaps.map(join).join(' · ');
    return { inicial: inicial, actual: actual, todo: todo, n: soaps.length, fechas: soaps.map(function (s) { return s.fecha; }) };
  }

  function extraer(rec, opts) {
    rec = rec || {}; opts = opts || {};
    var o = rec.orig || {};
    var seg = rec.seguridadClinica || {};
    var ant = rec.antecedentes || {};
    var fechaCorte = opts.fecha_corte || rec.fecha_corte || null;

    // Blobs por ORIGEN (clave para personal vs familiar): seguridadClinica + cirugías + medicamentos
    // son del PACIENTE; antecedentes.patologicos es HEREDOFAMILIAR (regla de oro del proyecto) → se aísla.
    var segBlob = Object.keys(seg).map(function (k) { return seg[k]; }).join(' · ');
    var cirugias = String(ant.cirugias || '');
    var medicamentos = String(ant.medicamentos || '');
    var heredofam = String(ant.patologicos || ''); // FAMILIAR: nunca se usa como condición personal
    var relato = String(o.padecimiento || '');
    var dxMed = String((o.dxMedico || '') + ' ' + (o.dxMedicoMotivo || ''));
    var soap = _soapTexto(rec, fechaCorte);
    var soapClin = _soapClinico(rec, fechaCorte);

    // Texto clínico del PACIENTE (personal), incluye evolución SOAP (dentro de fecha_corte).
    // Texto recuperado de DOCUMENTOS adjuntos (dx documentado, cirugías, indicaciones, restricciones) —
    // así el motor de seguridad cuenta restricciones que no están en los campos estructurados.
    var dr = rec.docsRecuperados || {};
    var docsBlob = [].concat((dr.dx_documentado || []).map(function (x) { return x.dx || ''; }), dr.cirugias || [], dr.indicaciones || [], dr.restricciones || []).join(' · ');
    var personal = [segBlob, cirugias, medicamentos, relato, dxMed, soap.todo, docsBlob].join(' · ');

    var ev = {}; // evidencias por hecho
    function flag(terms, texto, campo) {
      var st = termState(texto, terms);
      if (st.affirmed) ev[campo] = { campo: campo, fragmento: st.evidencia };
      else if (st.negatedOnly) ev[campo + '_negado'] = { campo: campo, fragmento: st.evidencia_negada };
      return st;
    }

    // --- Oncológico: afirmado y PERSONAL (no familiar), con temporalidad ---
    var oncoTerms = ['cancer', 'oncolog', 'tumor maligno', 'carcinoma', 'linfoma', 'leucemia', 'metastas', 'sarcoma', 'melanoma', 'ewing', 'mastectom', 'quimioterap', 'radioterap', 'tamoxifeno', 'letrozol'];
    var oncoPersonal = flag(oncoTerms, personal, 'oncologico');
    var oncoFamiliarSolo = termState(heredofam, oncoTerms).affirmed && !oncoPersonal.affirmed;
    // Temporalidad del cáncer PERSONAL: "dice activo" vs "dice remitido". Si AMBAS señales
    // aparecen = contradicción en el dato (oncoEstadoDudoso) → se marca para VERIFICAR, no se
    // decide en silencio que está inactivo (regla: ausencia/ambigüedad de dato ≠ ausencia de riesgo).
    var oncoDiceActivo = termState(personal, ['cancer activo', 'activo', 'en tratamiento', 'en quimio', 'en radio', 'quimioterap', 'radioterap', 'metastas', 'progresion', 'actualmente en', 'en curso']).affirmed;
    var oncoDiceRemitido = termState(personal, ['remision', 'remitido', 'curado', 'libre de enfermedad', 'en vigilancia', 'resecado hace', 'operado hace']).affirmed
      || /hace\s+(1[0-9]|[2-9])\s*(an[io]s?|anios?)/i.test(norm(personal));
    var oncoActivo = oncoPersonal.affirmed && oncoDiceActivo && !oncoDiceRemitido;
    var oncoEstadoDudoso = oncoPersonal.affirmed && oncoDiceActivo && oncoDiceRemitido;
    if (oncoEstadoDudoso && !ev['oncologico_estado_dudoso']) ev['oncologico_estado_dudoso'] = { campo: 'oncologico', fragmento: (oncoPersonal.evidencia || '') };
    var compresionMedular = flag(['compresion medular', 'compresion de medula', 'sindrome de compresion', 'metastasis vertebral', 'metastasis en columna', 'mscc', 'aplastamiento vertebral patologico'], personal, 'compresion_medular');

    // --- Cauda equina: silla de montar, retención, incontinencia NUEVA (excluye "de esfuerzo/estrés") ---
    var caudaTerms = ['silla de montar', 'anestesia en silla', 'retencion urinaria', 'retencion de orina', 'incontinencia urinaria', 'incontinencia fecal', 'incontinencia de esfinter', 'perdida de control de esfinter', 'no controla esfinter'];
    var cauda = flag(caudaTerms, personal, 'cauda_equina');
    var caudaEsfuerzo = termState(personal, ['incontinencia de esfuerzo', 'incontinencia de estres', 'de esfuerzo']).affirmed;
    var caudaEquina = cauda.affirmed && !(caudaEsfuerzo && !termState(personal, ['silla de montar', 'retencion']).affirmed);

    // --- Déficit neurológico: 3 NIVELES distintos (no se mezclan) ---
    //  (a) SÍNTOMA REFERIDO (subjetivo, sensitivo): parestesia/hormigueo/adormecimiento → PRECAUCIÓN.
    //  (b) DÉFICIT OBJETIVADO (motor/reflejo/electrofisiológico): pie caído, pérdida de fuerza,
    //      arreflexia, atrofia, DENERVACIÓN / ENMG / electromiografía, axonotmesis → DERIVACIÓN.
    //      (OCT-06: tenía denervación activa documentada por ENMG y V2.1 no lo marcaba → se recupera aquí.)
    //  (c) SOSPECHA DE COMPRESIÓN MEDULAR / radiculopatía confirmada → derivación/emergencia según bandera.
    var sintomaNeuroReferido = flag(['parestesia', 'hormigueo', 'adormecimiento', 'se me duerme', 'se duerme', 'entumecimiento', 'entumecido', 'sensacion de corriente'], personal, 'sintoma_neuro_referido');
    // Marcadores NEUROLÓGICOS DUROS (signo objetivo / electrofisiológico): pie caído, arreflexia, atrofia,
    // denervación/ENMG, axonotmesis… Son hallazgos objetivos poco ambiguos → cuentan por sí solos.
    var deficitNeuroDuro = flag(['pie caido', 'arreflexia', 'hiporreflexia', 'atrofia', 'hipotrofia', 'amiotrofia', 'denervacion', 'denervado', 'enmg', ' emg', 'electromiografia', 'axonotmesis', 'degeneracion axonal', 'neurotmesis', 'reinervacion'], personal, 'deficit_neuro_objetivo');
    // AMBIGUOS: "debilidad / pérdida de fuerza / parálisis / paresia / plejia". Una DISMINUCIÓN de fuerza
    // NO es, por sí sola, un déficit neurológico (puede ser dolor, desuso, inhibición; "parálisis facial"
    // antigua es un cuadro craneal/resuelto ajeno al motivo MSK). Solo cuentan como déficit neuro
    // OBJETIVADO si un CONTEXTO NEURAL (nervio/raíz/dermatoma/miotoma/nivel medular de miembro) aparece en
    // la MISMA CLÁUSULA. (Requisito Sinergia: NO confundir disminución de fuerza con déficit neurológico.)
    var ambiguosNeuro = ['debilidad', 'perdida de fuerza', 'perdida de la fuerza', 'disminucion de fuerza', 'disminucion de la fuerza', 'paralisis', 'paresia', 'plejia'];
    var neuralCtx = ['nervio', 'raiz nerviosa', 'radicul', 'dermatoma', 'miotoma', 'l2', 'l3', 'l4', 'l5', 's1', 'c5', 'c6', 'c7', 'c8', 'peroneo', 'ciatic', 'cubital', 'nervio radial', 'nervio mediano', 'femoral', 'neuropat', 'nervioso'];
    var debilidadTerm = termState(personal, ambiguosNeuro);
    var debilidadNeural = debilidadTerm.affirmed && _coOcurreClausula(personal, ambiguosNeuro, neuralCtx);
    var debilidadSinContextoNeuro = debilidadTerm.affirmed && !debilidadNeural && !deficitNeuroDuro.affirmed; // disminución de fuerza NO neurológica
    var deficitNeuroObjetivo = { affirmed: deficitNeuroDuro.affirmed || debilidadNeural, evidencia: deficitNeuroDuro.evidencia || (debilidadNeural ? debilidadTerm.evidencia : null) };
    if (deficitNeuroObjetivo.affirmed && !ev['deficit_neuro_objetivo']) ev['deficit_neuro_objetivo'] = { campo: 'deficit_neuro_objetivo', fragmento: deficitNeuroObjetivo.evidencia };
    var radiculopatiaConfirmada = flag(['radiculopatia confirmada', 'radiculopatia por enmg', 'radiculopatia electromiografica', 'compromiso radicular objetivado', 'dano axonal'], personal, 'radiculopatia_confirmada');
    var deficitProgresivo = flag(['progresiv', 'empeora', 'avanza', 'en aumento', 'cada vez mas'], relato + ' ' + soap.todo, 'deficit_progresivo');
    var mielopatia = flag(['mielopat', 'hoffmann', 'babinski', 'clonus', 'marcha espastica', 'hiperreflexia', 'signo de lhermitte'], personal, 'mielopatia');
    // Unión (compatibilidad): cualquier señal neuro presente.
    var deficitNeuro = { affirmed: sintomaNeuroReferido.affirmed || deficitNeuroObjetivo.affirmed };
    // DERIVACIÓN si hay déficit OBJETIVO, radiculopatía confirmada, mielopatía, o síntoma referido PROGRESIVO.
    var deficitNeuroDerivacion = deficitNeuroObjetivo.affirmed || radiculopatiaConfirmada.affirmed || mielopatia.affirmed
      || (sintomaNeuroReferido.affirmed && deficitProgresivo.affirmed);

    // --- TVP (trombosis venosa profunda): explícita Y por CONSTELACIÓN clínica ---
    var tvp = flag(['trombosis venosa', 'trombosis profunda', ' tvp', 'tromboembol', 'homans', 'empastamiento de pantorrilla', 'edema unilateral doloroso', 'trombo en', 'flebotrombosis'], personal, 'tvp');
    var tvpActiva = tvp.affirmed && !termState(personal, ['antecedente de tvp resuelt', 'tvp previa resuelt', 'anticoagulado por tvp antigua']).affirmed;
    // Constelación (OCT-22): hinchazón UNILATERAL de pierna/pantorrilla + factor de riesgo (inmovilización,
    // viaje largo, post-op reciente, reposo prolongado) → SOSPECHA de TVP aunque nadie escriba "trombosis".
    // El mecanismo ("post-operatorio con inmovilización y reposo prolongado") es texto clínico del
    // paciente y debe contar para el factor de riesgo de TVP (OCT-22 lo traía ahí, no en el relato).
    var mecTxtTvp = String(o.mecanismo || '');
    var tvpScan = personal + ' · ' + mecTxtTvp;
    var hinchazonTxt = String(o.inflamacion || '') + ' ' + relato + ' ' + mecTxtTvp + ' ' + soap.todo;
    var hinchazonPierna = termState(hinchazonTxt, ['hinchazon', 'edema', 'aumento de volumen', 'hinchado', 'inflamada']).affirmed
      && termState(hinchazonTxt, ['pierna', 'pantorrilla', 'gemelo', 'poplite', 'gastrocnemio', 'muslo', 'miembro inferior']).affirmed;
    var factorRiesgoTvp = termState(tvpScan, ['inmoviliz', 'yeso', 'ferula', 'reposo prolongado', 'reposo absoluto', 'viaje largo', 'vuelo largo', 'avion', 'encamad', 'postrad', 'anticonceptiv', 'trombofilia', 'postoperatori', 'post-operatori', 'post operatori']).affirmed
      || /(cirug[ií]a|operad|postoperatori|post-?\s?op|artroplast|reemplazo|reciente)\w*/i.test(norm(mecTxtTvp)) && termState(tvpScan, ['recient', 'inmoviliz', 'reposo']).affirmed;
    var tvpSospecha = tvpActiva || (hinchazonPierna && factorRiesgoTvp);
    if (tvpSospecha && !tvpActiva && !ev['tvp_sospecha']) ev['tvp_sospecha'] = { campo: 'valoracion/relato', fragmento: (termState(hinchazonTxt, ['hinchazon', 'edema']).evidencia || '') };

    // --- Dolor nocturno / en reposo / persistente ---
    var dolorNocturno = flag(['dolor nocturno', 'duele de noche', 'duele en la noche', 'despierta por dolor', 'en reposo', 'al dormir', 'de madrugada'], relato + ' ' + soap.todo, 'dolor_nocturno');
    var dolorPersistente = flag(['constante', 'persistente', 'no cede', 'no mejora', 'todo el dia', 'continuo'], relato + ' ' + soap.todo, 'dolor_persistente');

    // --- Región / lado y conflictos ---
    var zona = norm(o.zona || '');
    var ladoReg = ladoDe(o.lado || '') || ladoDe(zona);
    var ladoDx = ladoDe(dxMed) || ladoDe(relato);
    var ladoConflicto = !!(ladoReg && ladoDx && ladoReg !== 'bilateral' && ladoDx !== 'bilateral' && ladoReg !== ladoDx);
    var regionEspinal = termState(zona + ' ' + (rec.patologia || '') + ' ' + dxMed, ['cervical', 'cuello', 'dorsal', 'lumbar', 'columna', 'lumbalg', 'cervicalg', 'dorsalg', 'radicul', 'espald']).affirmed;
    var mecanismoTxt = String(o.mecanismo || '');
    var regionZona = regionDe(zona);
    var regionDxArr = regionDe(dxMed);
    var regionMec = regionDe(mecanismoTxt);
    var regionPat = regionDe(rec.patologia || '');
    // Conflicto de región CONSERVADOR: compara SOLO los dos campos que la clínica captura de forma
    // independiente: la ZONA codificada y el DX médico referido. NO entran el MECANISMO (narrativo, menciona
    // regiones incidentalmente: "giro con pie fijo") NI la PATOLOGÍA (que en datos reales se DERIVA de un
    // clasificador y fabricaría conflictos, p.ej. un dx "cervical y lumbar" con zona lumbar). Un dx con
    // varias regiones NO entra en conflicto si comparte alguna con la zona. (Ambos se siguen reportando.)
    var regionConflicto = false;
    if (regionZona.length && regionDxArr.length) {
      regionConflicto = !regionZona.some(function (r) { return regionDxArr.indexOf(r) !== -1; });
    }
    if (regionConflicto && !ev['region_conflicto']) ev['region_conflicto'] = { campo: 'zona/dx', fragmento: 'zona:[' + regionZona.join(',') + '] dx:[' + regionDxArr.join(',') + ']' + (regionMec.length ? ' (mec:[' + regionMec.join(',') + '] y pat:[' + regionPat.join(',') + '] NO entran al conflicto)' : '') };

    // --- RECUPERACIÓN de REGIÓN (zona → dx → padecimiento → SOAP) cuando la zona está vacía o es "otra".
    //     No resuelve contradicciones por suposición: solo RECUPERA cuando la zona no da información.
    var regRelato = regionDe(relato);
    var regSoap = (soapClin.fuerzaActual && soapClin.fuerzaActual.region && soapClin.fuerzaActual.region.length) ? soapClin.fuerzaActual.region : regionDe(soap.todo);
    var zonaVaga = !lleno(o.zona) || norm(o.zona) === 'otra' || norm(o.zona) === 'otro';
    var regionRec = null, regionRecFuente = null;
    if (!zonaVaga) { regionRec = regionZona.length ? regionZona[0] : norm(o.zona); regionRecFuente = 'zona'; }
    if (!regionRec) {
      var _cands = [['dxMedico', regionDxArr], ['padecimiento', regRelato], ['soap', regSoap]];
      for (var _ri = 0; _ri < _cands.length; _ri++) { if (_cands[_ri][1] && _cands[_ri][1].length) { regionRec = _cands[_ri][1][0]; regionRecFuente = _cands[_ri][0]; break; } }
    }
    var regionRecLabel = regionRec ? _regionLabel(regionRec) : 'región por precisar';
    // Lado RECUPERADO (orig.lado → dx → padecimiento). No inventa; null si nada lo documenta.
    var ladoRecuperado = ladoReg || ladoDx || ladoDe(relato) || null;
    var ladoRecFuente = ladoReg ? 'valoracion.lado' : (ladoDx ? 'dxMedico' : (ladoDe(relato) ? 'padecimiento' : null));

    // --- Cirugía ligamentaria/meniscal PREVIA con LATERALIDAD (ipsilateral requiere mismo lado) ---
    var cxLigTerms = ['lca', 'ligamento cruzado', 'cruzado anterior', 'plastia de ligamento', 'reconstruccion de ligament', 'menisc', 'ligamentoplastia'];
    var cxLig = termState(cirugias + ' ' + dxMed + ' ' + relato, cxLigTerms);
    var ladoCx = null;
    if (cxLig.affirmed) {
      // lado citado junto a la cirugía (misma cláusula de 'cirugias')
      ladoCx = ladoDe(cirugias);
    }
    var ladoActual = ladoReg || ladoDx;
    var rodilla = termState(zona + ' ' + dxMed, ['rodilla']).affirmed;
    var ligamentoIpsilateralPrevio = false, ligamentoLadoIndef = false, ligamentoContralateral = false;
    if (rodilla && cxLig.affirmed) {
      if (ladoCx && ladoActual && ladoCx !== 'bilateral' && ladoActual !== 'bilateral') {
        if (ladoCx === ladoActual) ligamentoIpsilateralPrevio = true; else ligamentoContralateral = true;
      } else { ligamentoLadoIndef = true; } // no se puede afirmar ipsilateral sin lado → verificar, no bloquear
    }
    if (ligamentoIpsilateralPrevio) ev['ligamento_ipsilateral'] = { campo: 'antecedentes.cirugias', fragmento: cxLig.evidencia };

    // --- Trauma cervical por carga axial (PEDIÁTRICO y ADULTO: mecanismo de alto riesgo) ---
    var cervical = termState(zona + ' ' + relato + ' ' + dxMed, ['cervical', 'cuello']).affirmed;
    // Mecanismo de alto riesgo cervical. Términos ESPECÍFICOS (no "de cabeza" suelto, que matchea
    // "occipital de cabeza"; ni "axial" suelto, que matchea "corte axial" de una imagen). Negación-aware.
    var mecAxial = termState(relato + ' ' + soap.todo, [
      'carga axial', 'compresion axial', 'trauma cervical', 'clavado de cabeza', 'se clavo de cabeza', 'clavo de cabeza',
      'cayo de cabeza', 'de cabeza en la', 'de cabeza a la', 'de cabeza al', 'zambullida', 'golpe en la cabeza',
      'apoyando todo el cuerpo', 'hiperextension cervical', 'accidente automovilistico', 'alcance vehicular', 'latigazo',
      'volcadura', 'caida de altura'
    ]).affirmed;
    var traumaCervicalAxial = cervical && mecAxial;
    var edadNum = (typeof rec.edad === 'number') ? rec.edad : parseInt(rec.edad, 10);
    var pediatrico = !isNaN(edadNum) && edadNum < 16;

    // --- Implantes / condiciones (afirmadas, personales) ---
    var marcapaso = flag(['marcapaso', 'marcapasos', 'desfibrilador', ' dai ', 'implante electronico', 'neuroestimulador'], personal, 'implante_electronico');
    var metal = flag(['osteosintesis', 'placa', 'clavo', 'tornillo', 'protesis', 'artrodesis', 'ancla', 'material de fijacion', 'endoprotesis'], segBlob + ' ' + cirugias + ' ' + dxMed, 'metal');
    var osteoporosis = flag(['osteoporos', 'osteopenia severa'], personal, 'osteoporosis');
    var anticoag = flag(['anticoagul', 'warfarina', 'acenocumarol', 'rivaroxab', 'apixab', 'dabigatr', 'clopidogrel', 'heparina', 'sintrom'], segBlob + ' ' + medicamentos, 'anticoagulacion');
    var autoinmune = flag(['artritis reumatoide', 'reumatoide', 'lupus', 'esclerodermia', 'dermatomiositis', 'espondilitis anquilosante', 'psoriasica'], personal, 'autoinmune');
    var inmunosupresor = flag(['metotrexato', 'golimumab', 'simponi', 'adalimumab', 'etanercept', 'biologico', 'inmunosupres', 'corticoide cronico', 'prednisona cronica'], personal, 'inmunosupresor');
    var diabetesPersonal = flag(['diabetes', 'dm2', 'dm tipo', 'insulino', 'hemoglobina glicosilada'], segBlob, 'diabetes');
    var cardio = flag(['infarto', 'cardiopat', 'hipertension', ' hta', 'insuficiencia cardiaca', 'arritmia'], segBlob + ' ' + medicamentos, 'cardiovascular');
    var embarazo = flag(['embaraz', 'gestante', 'gestacion', 'semanas de gestacion'], segBlob + ' ' + relato, 'embarazo');

    // --- Inflamación: SOLO si afirmada (no "sin inflamación") ---
    var inflam = termState(String(o.inflamacion || ''), ['inflamacion', 'edema', 'derrame', 'tumefaccion', 'hinchazon', 'aumento de volumen', 'calor', 'rubor']);
    var inflamacionPresente = inflam.affirmed;
    if (inflamacionPresente) ev['inflamacion'] = { campo: 'valoracion.inflamacion', fragmento: inflam.evidencia };

    // --- Cribado de banderas rojas: requiere lenguaje EXPLÍCITO de cribado (no una prueba especial) ---
    var pruebasTxt = String(o.pruebas || '');
    var cribadoDocumentado = termState(pruebasTxt + ' ' + segBlob + ' ' + soap.todo,
      ['banderas rojas', 'cribado de banderas', 'red flag', 'sin banderas rojas', 'descartadas banderas', 'cribado negativo de banderas']).affirmed;
    // pruebas especiales presentes (McMurray, Lachman…) NO son cribado de banderas. Se mide si se
    // REALIZÓ la prueba (present), independientemente de su resultado (un "McMurray negativo" cuenta
    // como prueba hecha con resultado negativo, NO como hallazgo positivo ni como cribado de banderas).
    var pruebasEspecialesPresentes = lleno(pruebasTxt) && termState(pruebasTxt, ['mcmurray', 'lachman', 'cajon', 'thessaly', 'apley', 'neer', 'hawkins', 'jobe', 'obrien', 'spurling', 'slr', 'lasegue', 'thomas', 'faber', 'fadir']).present;

    var restriccionDocumentada = termState(segBlob + ' ' + soap.todo + ' ' + ((rec.docsRecuperados && (rec.docsRecuperados.restricciones || []).join(' ')) || ''), ['contraindic', 'no aplicar', 'no rf', 'no tecar', 'evitar sobre', 'restriccion documentada', 'no diatermia', 'no carga', 'no impacto', 'sin carga']).affirmed;

    // --- ROM / Fuerza: ¿numérico (medible) o texto cualitativo? ---
    // El generador NO debe etiquetar texto cualitativo ("limitado", "disminuida") como medición en grados.
    var romRaw = String(o.rom || '');
    var romEsNumerico = lleno(romRaw) && /\d+\s*(°|grados?|grd|º)/i.test(romRaw);
    var romTextoCualitativo = lleno(romRaw) && !romEsNumerico;
    // --- FUERZA: escala CLÍNICA COMPARATIVA de Sinergia 0–10 (lado sano/referencia válida = 10/10;
    //     6/10 ≈ 60% ESTIMADO). NO se usa Daniels/MRC ni dinamómetro; un valor /5 (legado) se CONSERVA
    //     etiquetado, nunca se convierte. Soporta MÚLTIPLES grupos musculares (cada uno con valor+lado+%).
    var fuerzaRaw = String(o.fuerza || '');
    var fuerzaGrupos = _parseFuerzaMulti(fuerzaRaw);   // [{grupo,lado,escala,valor,ref,pct_estimado}] — TODOS
    var _fuPrim = fuerzaGrupos[0] || null;
    var fuerzaEscala = _fuPrim ? _fuPrim.escala : null;
    var fuerzaValor = _fuPrim ? _fuPrim.valor : null;
    var fuerzaRef = _fuPrim ? _fuPrim.ref : null;
    var fuerzaPctEstimado = _fuPrim ? _fuPrim.pct_estimado : null;
    var fuerzaEsNumerica = lleno(fuerzaRaw) && !!fuerzaEscala;
    var fuerzaTextoCualitativo = lleno(fuerzaRaw) && !fuerzaEsNumerica;
    var fuerzaLado = (_fuPrim && _fuPrim.lado) || ladoDe(fuerzaRaw);
    var fuerzaGrupo = _fuPrim ? _fuPrim.grupo : (function () { var t = norm(fuerzaRaw); for (var i = 0; i < GRUPOS_MUSC.length; i++) if (t.indexOf(GRUPOS_MUSC[i]) !== -1) return GRUPOS_MUSC[i]; return null; })();
    var fuerzaMultiGrupo = fuerzaGrupos.filter(function (x) { return x.grupo; }).length > 1;
    // Referencia/contralateral: ¿se MENCIONA? ¿se AFIRMA SANA? Nunca se asume sano el contralateral.
    var fuerzaRefMencionada = termState(fuerzaRaw, ['lado sano', 'contralateral', 'lado opuesto', 'lado contrario', 'comparado con', 'vs lado', 'referencia']).affirmed;
    var fuerzaRefSanaConfirmada = termState(fuerzaRaw, ['lado sano 10', 'sano 10/10', 'lado sano', 'contralateral sano', 'contralateral normal', 'contralateral sin alteracion', 'opuesto normal', 'opuesto sano', 'referencia 10/10', 'referencia sana']).affirmed
      && !termState(fuerzaRaw, ['contralateral tambien', 'ambos lados', 'bilateral', 'opuesto afectado', 'contralateral afectado', 'contralateral debil']).affirmed;
    // --- EVA robusta: distingue reposo vs movimiento/actividad; valor representativo (movimiento o máx) ---
    var evaP = _parseEVA(o.eva);
    // Datos insuficientes para afirmar seguridad: examen objetivo vacío Y sin cribado documentado,
    // o ≥2 campos clínicos núcleo por confirmar. Ausencia de dato ≠ ausencia de riesgo.
    // El SOAP de seguimiento cuenta como examen DOCUMENTADO (fuerza/ROM reales en notas posteriores).
    var soapTieneExamen = !!((soapClin.fuerzaActual && soapClin.fuerzaActual.grupos.length) || soapClin.romActual || soapClin.hallazgosActual);
    var examenVacio = !lleno(romRaw) && !lleno(fuerzaRaw) && !lleno(pruebasTxt) && !soapTieneExamen;
    var nPorConfirmar = [romRaw, fuerzaRaw, pruebasTxt, String(o.palpacion || ''), relato].filter(function (v) { return !lleno(v); }).length - (soapTieneExamen ? 2 : 0);
    var datosInsuficientes = (examenVacio && !cribadoDocumentado) || nPorConfirmar >= 4;

    return {
      version_extractor: VERSION,
      fecha_corte: fechaCorte,
      // texto crudo (para reglas específicas)
      segBlob: norm(segBlob), cirugias: norm(cirugias), medicamentos: norm(medicamentos), relato: norm(relato), dxMed: norm(dxMed),
      soap_inicial: soap.inicial, soap_actual: soap.actual, soap_n: soap.n, soap_fechas: soap.fechas,
      // hechos booleanos (afirmados)
      oncologico: oncoPersonal.affirmed, oncologico_familiar_solo: oncoFamiliarSolo, oncoActivo: oncoActivo, oncoEstadoDudoso: oncoEstadoDudoso,
      compresionMedular: compresionMedular.affirmed,
      caudaEquina: caudaEquina,
      deficitNeuro: deficitNeuro.affirmed, sintomaNeuroReferido: sintomaNeuroReferido.affirmed, deficitNeuroObjetivo: deficitNeuroObjetivo.affirmed,
      radiculopatiaConfirmada: radiculopatiaConfirmada.affirmed, deficitNeuroDerivacion: deficitNeuroDerivacion, mielopatia: mielopatia.affirmed,
      tvp: tvpActiva, tvpSospecha: tvpSospecha,
      dolorNocturno: dolorNocturno.affirmed, dolorPersistente: dolorPersistente.affirmed,
      regionEspinal: regionEspinal,
      region: zona, regionZona: regionZona, regionDx: regionDxArr, regionMecanismo: regionMec, regionPatologia: regionPat, regionConflicto: regionConflicto,
      regionRecuperada: regionRec, regionRecuperadaLabel: regionRecLabel, regionRecFuente: regionRecFuente,
      ladoRecuperado: ladoRecuperado, ladoRecFuente: ladoRecFuente,
      soapFuerzaActual: soapClin.fuerzaActual, soapRomActual: soapClin.romActual, soapHallazgos: soapClin.hallazgosActual, soapHistFuerza: soapClin.histFuerza, soap_todo: soap.todo,
      lado: ladoReg, ladoDx: ladoDx, ladoConflicto: ladoConflicto,
      ligamentoIpsilateralPrevio: ligamentoIpsilateralPrevio, ligamentoContralateral: ligamentoContralateral, ligamentoLadoIndefinido: ligamentoLadoIndef, ladoCirugia: ladoCx,
      traumaCervicalAxial: traumaCervicalAxial, pediatrico: pediatrico, edad: isNaN(edadNum) ? null : edadNum, lesionCervicalDescartada: false,
      marcapaso: marcapaso.affirmed, metal: metal.affirmed, osteoporosis: osteoporosis.affirmed,
      anticoagulacion: anticoag.affirmed, autoinmune: autoinmune.affirmed, inmunosupresor: inmunosupresor.affirmed,
      diabetesPersonal: diabetesPersonal.affirmed, cardiovascular: cardio.affirmed, embarazo: embarazo.affirmed,
      inflamacionPresente: inflamacionPresente,
      cribadoDocumentado: cribadoDocumentado, pruebasEspecialesPresentes: pruebasEspecialesPresentes,
      restriccionDocumentada: restriccionDocumentada,
      romEsNumerico: romEsNumerico, romTextoCualitativo: romTextoCualitativo, romRaw: romRaw,
      fuerzaEsNumerica: fuerzaEsNumerica, fuerzaTextoCualitativo: fuerzaTextoCualitativo, fuerzaRaw: fuerzaRaw,
      fuerzaEscala: fuerzaEscala, fuerzaValor: fuerzaValor, fuerzaRef: fuerzaRef, fuerzaPctEstimado: fuerzaPctEstimado,
      fuerzaGrupo: fuerzaGrupo, fuerzaLado: fuerzaLado, fuerzaRefMencionada: fuerzaRefMencionada, fuerzaRefSanaConfirmada: fuerzaRefSanaConfirmada,
      fuerzaGrupos: fuerzaGrupos, fuerzaMultiGrupo: fuerzaMultiGrupo,
      eva: evaP.valor, evaReposo: evaP.reposo, evaMovimiento: evaP.movimiento, evaRaw: String(o.eva || ''),
      debilidadSinContextoNeuro: debilidadSinContextoNeuro,
      datosInsuficientes: datosInsuficientes,
      // evidencias (campo + fragmento literal) por hecho afirmado/negado
      evidencias: ev
    };
  }

  var API = { version: VERSION, extraer: extraer, termState: termState, ladoDe: ladoDe, regionDe: regionDe, _norm: norm, _lleno: lleno, _neg: _negAt };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.ExtractorV2 = API;
})(typeof window !== 'undefined' ? window : globalThis);
