/* SINERGIA · Extractor de hechos clínicos V2.1 (prototipo, determinista, auditable)
 * version 2.1.0-proto · 2026-11-26
 * Convierte un registro de expediente (anonimizado) en HECHOS VERIFICABLES para el motor
 * de seguridad y el generador. A diferencia de V2, NO razona por coincidencia simple de
 * palabras: interpreta NEGACIÓN, TEMPORALIDAD (antecedente/activo/resuelto), LATERALIDAD,
 * y distingue antecedente PERSONAL vs FAMILIAR y notas SOAP fechadas (valoración inicial vs
 * evolución actual). Cada hecho conserva su EVIDENCIA (campo + fragmento literal citado).
 * No diagnostica; alimenta reglas deterministas independientes. Node + navegador.
 */
(function (root) {
  'use strict';
  var VERSION = '2.1.0-proto';

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
    hombro: ['hombro', 'manguito', 'supraespinoso', 'glenohumeral'], codo: ['codo', 'epicondil'], muneca_mano: ['muneca', 'mano', 'carpo', 'dedo', 'tunel carpiano'],
    cadera: ['cadera', 'coxofemoral', 'labrum de cadera'], rodilla: ['rodilla', 'menisc', 'rotul', 'patelo', 'cruzado'], tobillo_pie: ['tobillo', 'pie', 'aquiles', 'calcaneo', 'fascitis plantar']
  };
  function regionDe(txt) {
    txt = norm(txt); var found = [];
    Object.keys(REGIONES).forEach(function (r) { if (REGIONES[r].some(function (k) { return txt.indexOf(k) !== -1; })) found.push(r); });
    return found;
  }

  // Texto SOAP: separa nota INICIAL (valoración) de la MÁS RECIENTE (evolución) con fecha_corte.
  function _soapTexto(rec, fechaCorte) {
    var soaps = Array.isArray(rec.soap) ? rec.soap.slice() : [];
    var parse = function (f) { var d = Date.parse(f || ''); return isNaN(d) ? 0 : d; };
    if (fechaCorte) { var fc = parse(fechaCorte); if (fc) soaps = soaps.filter(function (s) { return parse(s.fecha) <= fc; }); }
    soaps.sort(function (a, b) { return parse(a.fecha) - parse(b.fecha); });
    var join = function (s) { return [s && s.s, s && s.o, s && s.a, s && s.p, s && s.texto].filter(Boolean).join(' · '); };
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

    // Texto clínico del PACIENTE (personal), incluye evolución SOAP (dentro de fecha_corte).
    var personal = [segBlob, cirugias, medicamentos, relato, dxMed, soap.todo].join(' · ');

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
    var oncoActivo = oncoPersonal.affirmed && termState(personal, ['activo', 'en tratamiento', 'en quimio', 'en radio', 'metastas', 'progresion', 'actual']).affirmed
      && !termState(personal, ['remision', 'remitido', 'curado', 'libre de enfermedad', 'en vigilancia']).affirmed;
    var compresionMedular = flag(['compresion medular', 'compresion de medula', 'sindrome de compresion', 'metastasis vertebral', 'metastasis en columna', 'mscc', 'aplastamiento vertebral patologico'], personal, 'compresion_medular');

    // --- Cauda equina: silla de montar, retención, incontinencia NUEVA (excluye "de esfuerzo/estrés") ---
    var caudaTerms = ['silla de montar', 'anestesia en silla', 'retencion urinaria', 'retencion de orina', 'incontinencia urinaria', 'incontinencia fecal', 'incontinencia de esfinter', 'perdida de control de esfinter', 'no controla esfinter'];
    var cauda = flag(caudaTerms, personal, 'cauda_equina');
    var caudaEsfuerzo = termState(personal, ['incontinencia de esfuerzo', 'incontinencia de estres', 'de esfuerzo']).affirmed;
    var caudaEquina = cauda.affirmed && !(caudaEsfuerzo && !termState(personal, ['silla de montar', 'retencion']).affirmed);

    // --- Déficit neurológico ---
    var deficitNeuro = flag(['pie caido', 'paralisis', 'perdida de fuerza', 'debilidad progresiva', 'parestesia', 'hormigueo', 'adormecimiento', 'anestesia', 'arreflexia'], personal, 'deficit_neuro');
    var deficitProgresivo = flag(['progresiv', 'empeora', 'avanza', 'en aumento'], relato + ' ' + soap.todo, 'deficit_progresivo');
    var mielopatia = flag(['mielopat', 'hoffmann', 'babinski', 'clonus', 'marcha espastica', 'hiperreflexia'], personal, 'mielopatia');
    var deficitNeuroDerivacion = (deficitNeuro.affirmed && deficitProgresivo.affirmed) || mielopatia.affirmed;

    // --- TVP (trombosis venosa profunda) ---
    var tvp = flag(['trombosis venosa', 'trombosis profunda', ' tvp', 'tromboembol', 'homans', 'empastamiento de pantorrilla', 'edema unilateral doloroso', 'trombo en', 'flebotrombosis'], personal, 'tvp');
    var tvpActiva = tvp.affirmed && !termState(personal, ['antecedente de tvp resuelt', 'tvp previa resuelt', 'anticoagulado por tvp antigua']).affirmed;

    // --- Dolor nocturno / en reposo / persistente ---
    var dolorNocturno = flag(['dolor nocturno', 'duele de noche', 'duele en la noche', 'despierta por dolor', 'en reposo', 'al dormir', 'de madrugada'], relato + ' ' + soap.todo, 'dolor_nocturno');
    var dolorPersistente = flag(['constante', 'persistente', 'no cede', 'no mejora', 'todo el dia', 'continuo'], relato + ' ' + soap.todo, 'dolor_persistente');

    // --- Región / lado y conflictos ---
    var zona = norm(o.zona || '');
    var ladoReg = ladoDe(o.lado || '') || ladoDe(zona);
    var ladoDx = ladoDe(dxMed) || ladoDe(relato);
    var ladoConflicto = !!(ladoReg && ladoDx && ladoReg !== 'bilateral' && ladoDx !== 'bilateral' && ladoReg !== ladoDx);
    var regionEspinal = termState(zona + ' ' + (rec.patologia || '') + ' ' + dxMed, ['cervical', 'cuello', 'dorsal', 'lumbar', 'columna', 'lumbalg', 'cervicalg', 'dorsalg', 'radicul', 'espald']).affirmed;
    var regionZona = regionDe(zona);
    var regionDxArr = regionDe(dxMed);
    var regionConflicto = !!(regionZona.length && regionDxArr.length && regionDxArr.indexOf(regionZona[0]) === -1 && regionZona.indexOf(regionDxArr[0]) === -1);

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
    var mecAxial = termState(relato + ' ' + soap.todo, ['carga axial', 'clavado', 'de cabeza', 'cayo de cabeza', 'golpe en la cabeza', 'axial', 'zambullida', 'accidente automovilistico', 'alcance vehicular', 'volcadura', 'caida de altura']).affirmed;
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

    var restriccionDocumentada = termState(segBlob + ' ' + soap.todo, ['contraindic', 'no aplicar', 'no rf', 'no tecar', 'evitar sobre', 'restriccion documentada', 'no diatermia']).affirmed;

    return {
      version_extractor: VERSION,
      fecha_corte: fechaCorte,
      // texto crudo (para reglas específicas)
      segBlob: norm(segBlob), cirugias: norm(cirugias), medicamentos: norm(medicamentos), relato: norm(relato), dxMed: norm(dxMed),
      soap_inicial: soap.inicial, soap_actual: soap.actual, soap_n: soap.n, soap_fechas: soap.fechas,
      // hechos booleanos (afirmados)
      oncologico: oncoPersonal.affirmed, oncologico_familiar_solo: oncoFamiliarSolo, oncoActivo: oncoActivo,
      compresionMedular: compresionMedular.affirmed,
      caudaEquina: caudaEquina,
      deficitNeuro: deficitNeuro.affirmed, deficitNeuroDerivacion: deficitNeuroDerivacion, mielopatia: mielopatia.affirmed,
      tvp: tvpActiva,
      dolorNocturno: dolorNocturno.affirmed, dolorPersistente: dolorPersistente.affirmed,
      regionEspinal: regionEspinal,
      region: zona, regionZona: regionZona, regionDx: regionDxArr, regionConflicto: regionConflicto,
      lado: ladoReg, ladoDx: ladoDx, ladoConflicto: ladoConflicto,
      ligamentoIpsilateralPrevio: ligamentoIpsilateralPrevio, ligamentoContralateral: ligamentoContralateral, ligamentoLadoIndefinido: ligamentoLadoIndef, ladoCirugia: ladoCx,
      traumaCervicalAxial: traumaCervicalAxial, pediatrico: pediatrico, edad: isNaN(edadNum) ? null : edadNum, lesionCervicalDescartada: false,
      marcapaso: marcapaso.affirmed, metal: metal.affirmed, osteoporosis: osteoporosis.affirmed,
      anticoagulacion: anticoag.affirmed, autoinmune: autoinmune.affirmed, inmunosupresor: inmunosupresor.affirmed,
      diabetesPersonal: diabetesPersonal.affirmed, cardiovascular: cardio.affirmed, embarazo: embarazo.affirmed,
      inflamacionPresente: inflamacionPresente,
      cribadoDocumentado: cribadoDocumentado, pruebasEspecialesPresentes: pruebasEspecialesPresentes,
      restriccionDocumentada: restriccionDocumentada,
      // evidencias (campo + fragmento literal) por hecho afirmado/negado
      evidencias: ev
    };
  }

  var API = { version: VERSION, extraer: extraer, termState: termState, ladoDe: ladoDe, _norm: norm, _lleno: lleno, _neg: _negAt };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.ExtractorV2 = API;
})(typeof window !== 'undefined' ? window : globalThis);
