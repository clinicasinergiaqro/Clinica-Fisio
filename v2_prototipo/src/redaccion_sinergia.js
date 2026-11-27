'use strict';
/* SINERGIA · Capa de REDACCIÓN clínica (V2.2.3). No extrae ni evalúa seguridad: sólo REDACTA en prosa
 * natural de fisioterapeuta el diagnóstico funcional y los objetivos CP/MP/LP a partir de los hechos YA
 * verificados por el extractor/generador. Estilo de los ejemplos de Clínica Sinergia:
 *   - frase clínica corrida (30–60 palabras), sin "Cuadro:", sin "en seguimiento (N notas)", sin conteos de
 *     sesión, sin "Exploración por completar / PROVISIONAL", sin "Paciente de X años" salvo relevancia.
 *   - sólo lo DOCUMENTADO; no inventa patologías ni mediciones. Precauciones/pendientes van aparte.
 */
(function (root) {
  function norm(s) { return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function has(s, arr) { var n = norm(s); return arr.some(function (k) { return n.indexOf(k) !== -1; }); }
  function lleno(v) { var n = norm(v).trim(); return n && ['', 'none', 'no evaluado', 'no evaluada', 'pendiente', 'por definir', 'no especificado', 'ninguno', 'ninguna', 'n/a', 'na', '-'].indexOf(n) === -1; }
  function cap(s) { s = String(s || '').trim(); return s ? s[0].toUpperCase() + s.slice(1) : s; }
  function unir(arr) { arr = arr.filter(Boolean); if (arr.length <= 1) return arr.join(''); var ult = arr[arr.length - 1]; var y = /^i/i.test(norm(ult)) ? ' e ' : ' y '; return arr.slice(0, -1).join(', ') + y + ult; }

  // Región → términos de movimiento, segmento y limitación funcional por defecto.
  var REG = {
    'codo': { mov: 'la flexoextensión', seg: 'del miembro superior', fx: 'el uso funcional de la extremidad', sup: true },
    'muñeca': { mov: 'la flexoextensión', seg: 'de la muñeca y la mano', fx: 'las actividades de la vida diaria que requieren prensión y manipulación', sup: true },
    'muñeca/mano': { mov: 'la flexoextensión', seg: 'de la mano', fx: 'las actividades que requieren prensión y destreza', sup: true },
    'mano': { mov: 'la movilidad de los dedos', seg: 'de la mano', fx: 'las actividades que requieren prensión y destreza manual', sup: true },
    'hombro': { mov: 'la movilidad en flexión y abducción', seg: 'del miembro superior', fx: 'las actividades que requieren elevación del miembro superior', sup: true, escap: true },
    'rodilla': { mov: 'la flexión', seg: 'de la rodilla', fx: 'la marcha y el uso de escaleras', inf: true },
    'tobillo': { mov: 'la dorsiflexión', seg: 'del tobillo', fx: 'la marcha y la tolerancia al apoyo', inf: true },
    'tobillo/pie': { mov: 'la dorsiflexión', seg: 'del tobillo', fx: 'la marcha y la tolerancia al apoyo', inf: true },
    'pie': { mov: 'la movilidad del pie', seg: 'del pie', fx: 'la marcha y el apoyo', inf: true },
    'cadera': { mov: 'la movilidad de cadera', seg: 'de la cadera', fx: 'la marcha, el apoyo unipodal y el uso de escaleras', inf: true },
    'columna cervical': { mov: 'la movilidad cervical', seg: 'cervical', fx: 'la tolerancia a posiciones prolongadas y a las actividades laborales', axial: true },
    'columna dorsal': { mov: 'la movilidad dorsal', seg: 'dorsal', fx: 'la tolerancia a posiciones prolongadas y a las actividades cotidianas', axial: true },
    'columna lumbar': { mov: 'la movilidad lumbopélvica', seg: 'lumbopélvica', fx: 'la marcha, la bipedestación y las actividades cotidianas', axial: true, lumbar: true }
  };
  function regKey(reg) { var n = norm(reg); if (REG[reg]) return reg; for (var k in REG) if (norm(k) === n) return k; if (/cervical/.test(n)) return 'columna cervical'; if (/dorsal|toracic/.test(n)) return 'columna dorsal'; if (/lumbar|lumbo/.test(n)) return 'columna lumbar'; if (/tobillo|pie/.test(n)) return 'tobillo/pie'; if (/mano|dedo/.test(n)) return 'mano'; if (/mu[nñ]eca/.test(n)) return 'muñeca'; for (var k2 in REG) if (n.indexOf(norm(k2)) !== -1) return k2; return null; }
  // Nombre de región para la prosa (sin barras) y género gramatical (para concordar la lateralidad).
  var REG_FEM = { 'rodilla': 1, 'muñeca': 1, 'muñeca/mano': 1, 'mano': 1, 'cadera': 1, 'columna cervical': 1, 'columna dorsal': 1, 'columna lumbar': 1 };
  function regDisplay(regLabel, regK) { if (regK === 'tobillo/pie') return 'tobillo'; if (regK === 'muñeca/mano') return 'muñeca'; return regLabel || 'región'; }
  function ladoGen(lado, regK) { var fem = !!REG_FEM[regK]; var n = norm(lado); if (!lado) return ''; if (n === 'izquierdo' || n === 'izquierda') return fem ? 'izquierda' : 'izquierdo'; if (n === 'derecho' || n === 'derecha') return fem ? 'derecha' : 'derecho'; return lado; }

  function nombreGrupo(g) {
    var n = norm(g || '');
    if (/cuadric/.test(n)) return 'cuádriceps';
    if (/isquio/.test(n)) return 'isquiotibiales';
    if (/gastrocnem|soleo|triceps sural|gemelo/.test(n)) return 'tríceps sural';
    if (/tibial anterior/.test(n)) return 'tibial anterior';
    if (/peroneo/.test(n)) return 'peroneos';
    if (/gluteo|abductor/.test(n)) return 'glúteos y abductores de cadera';
    if (/deltoid/.test(n)) return 'deltoides';
    if (/manguito|supraespin|infraespin/.test(n)) return 'manguito rotador';
    if (/biceps/.test(n)) return 'bíceps';
    if (/triceps/.test(n)) return 'tríceps';
    if (/prension|flexores de dedos|mano/.test(n)) return 'musculatura de la mano';
    return g ? String(g).trim() : null;
  }

  // Aditamentos documentados (por texto). Diferencia miembro superior/inferior para la redacción.
  function detectarAditamentos(blob) {
    var n = norm(blob), out = [];
    if (/bota walker|walker|bota ortop/.test(n)) out.push({ t: 'bota walker', inf: true });
    if (/\bmuleta/.test(n)) out.push({ t: 'muletas', inf: true });
    if (/cabestrillo/.test(n)) out.push({ t: 'cabestrillo', sup: true });
    if (/ferula|f[eé]rula/.test(n)) out.push({ t: 'férula', sup: true });
    if (/rodillera/.test(n)) out.push({ t: 'rodillera articulada', inf: true });
    if (/tobillera/.test(n)) out.push({ t: 'tobillera', inf: true });
    if (/andadera|andador/.test(n)) out.push({ t: 'andadera', inf: true });
    if (/\bbaston|bastón/.test(n)) out.push({ t: 'bastón', inf: true });
    if (/\bortesis|\bortésis/.test(n) && !out.length) out.push({ t: 'ortesis', inf: true });
    return out;
  }

  function movimientoEspecifico(regK, textos) {
    var n = norm(textos.join(' '));
    if (/pronosupinacion|pronacion|supinacion/.test(n) && regK === 'codo') return 'la flexoextensión y la pronosupinación';
    if (/flexoextension/.test(n)) return 'la flexoextensión';
    if (/dorsiflex/.test(n)) return 'la dorsiflexión';
    if (/abduccion/.test(n) && regK === 'hombro') return 'la movilidad en flexión y abducción';
    if (/\bflexion\b/.test(n) && /\bextension\b/.test(n)) return 'la flexoextensión';
    if (/\bflexion\b/.test(n)) return (REG[regK] && regK === 'rodilla') ? 'la flexión' : (REG[regK] ? REG[regK].mov : 'la movilidad');
    return REG[regK] ? REG[regK].mov : 'la movilidad';
  }

  // ===== DIAGNÓSTICO FUNCIONAL (prosa Sinergia) =====
  function redactarDx(ctx) {
    var h = ctx.h, o = ctx.o, rec = ctx.rec;
    var regLabel = ctx.regLabel, lado = ctx.lado || '';
    var regK = regKey(regLabel);
    var blob = norm((o.padecimiento || '') + ' ' + (o.limitaciones || '') + ' ' + (o.desdeCuando || '') + ' ' + (o.dxMedico || '') + ' ' + (rec.patologia || '') + ' ' + (ctx.soapHall || ''));
    var esNeuro = /hemipar|hemiplej|neurolog|\bevc\b|\bacv\b|ictus|lesion medular|paralisis cerebral|parkinson|guillain|esclerosis/.test(blob) || h.deficitNeuroObjetivo && /central|motor|hemi/.test(blob);
    var edad = (typeof rec.edad === 'number') ? rec.edad : null;
    var esGeriatricoGen = !regK && edad != null && edad >= 70 && /equilibri|caida|marcha|debilidad|fragil|geriatr/.test(blob);

    // Alteraciones documentadas.
    var dolor = (h.eva != null) || h.dolorNocturno || h.dolorPersistente || has(o.padecimiento, ['dolor', 'duele', 'molestia', 'adolorid']);
    var inflam = h.inflamacionPresente || has(blob, ['edema', 'inflamacion', 'derrame']);
    var edemaWord = has(blob, ['edema']) ? 'edema' : 'inflamación';
    var romDeficit = h.romEsNumerico || (h.soapRomActual && h.soapRomActual.romTxt && has(h.soapRomActual.romTxt, ['limit', 'disminu', 'restring', 'reducid', 'rigidez', '°', 'grados', 'flexion', 'extension'])) || (h.romTextoCualitativo && !has(o.rom, ['normal', 'complet', 'conservad', 'sin limitacion', 'sin restriccion', 'integra']));
    var mov = movimientoEspecifico(regK, [o.rom || '', (h.soapRomActual && h.soapRomActual.romTxt) || '', o.limitaciones || '']);
    // Fuerza (grupos documentados en valoración o SOAP).
    var grupos = (h.fuerzaGrupos && h.fuerzaGrupos.length) ? h.fuerzaGrupos : ((h.soapFuerzaActual && h.soapFuerzaActual.grupos) || []);
    var gruposDef = grupos.filter(function (g) { return g.escala === 'comparativa_0_10' ? g.valor < 10 : true; });
    var nombres = []; gruposDef.forEach(function (g) { var nm = nombreGrupo(g.grupo); if (nm && nombres.indexOf(nm) === -1) nombres.push(nm); });
    var fuerzaCual = !gruposDef.length && (h.debilidadSinContextoNeuro || (h.fuerzaTextoCualitativo && !has(o.fuerza, ['normal', 'conservad', 'complet', 'fuerte', 'buena fuerza'])) || has(ctx.soapHall || '', ['debil', 'disminucion de fuerza', 'hipotrof']));
    var estabilidad = has(blob, ['inestab', 'propiocep', 'esguince', 'giro', 'falla', 'se dobla', 'control dinamic']);
    var aditam = detectarAditamentos(blob);

    // Encuadre causal / asociación.
    var causal = ctx.causal; // ya computado por el generador (p. ej. "secundaria a fractura ...")
    var dxDoc = (rec.docsRecuperados && rec.docsRecuperados.dx_documentado && rec.docsRecuperados.dx_documentado[0]) ? rec.docsRecuperados.dx_documentado[0].dx : null;
    var asociacion = null;
    if (causal) asociacion = ' ' + causal;
    else if (dxDoc && !/no cuenta/i.test(dxDoc)) {
      var d = String(dxDoc).replace(/\s*\[[^\]]*\]\s*$/, '').trim();
      d = d.replace(/^\s*\d+\s*[.)-]\s*/, '');       // quita enumeración inicial "1. " / "2) "
      d = d.split(/;|\.\s|\s+asociad[oa]s?\s+a\s+|\s+con\s+cambios\s+/i)[0].trim(); // condición principal
      // quitar lateralidad/región redundante del final del dx documentado
      d = d.replace(/,?\s*(rodilla|codo|hombro|tobillo|cadera|mu[nñ]eca|mano|pie|columna)\s+(derech\w*|izquierd\w*)\s*$/i, '').replace(/,?\s*(derech\w*|izquierd\w*|bilateral)\s*$/i, '').replace(/,\s*de origen\b.*$/i, '').replace(/[.,]\s*$/, '').trim();
      if (d.length > 75) d = d.slice(0, 75).replace(/\s+\S*$/, '');
      if (/esguince/i.test(d)) asociacion = ' posterior a esguince';
      else if (d) asociacion = ' asociada a ' + d.charAt(0).toLowerCase() + d.slice(1);
    } else if (/esguince/.test(blob)) asociacion = ' posterior a esguince';

    var regDisp = regDisplay(regLabel, regK);
    var ladoG = ladoGen(lado, regK);
    // Fallback cuando la región no se mapeó ("otra"): recuperar de términos somáticos comunes y, si no,
    // anclar en el dx médico referido (evita "de región por precisar").
    var regSinMapa = !regK || /por precisar|^otra$|^region/.test(norm(regDisp));
    if (regSinMapa) {
      if (/espinilla|periostitis|tibial|canilla|pantorrilla/.test(blob)) regDisp = 'la pierna';
      else if (/\bpie\b|plantar|fascitis/.test(blob)) regDisp = 'el pie';
      else if (/abdomen|core|tronco/.test(blob)) regDisp = 'el tronco';
      else regDisp = null;
      if (!asociacion && lleno(o.dxMedico) && !/no cuenta/i.test(o.dxMedico)) {
        var dmr = String(o.dxMedico).split(';')[0].replace(/\s*(derech\w*|izquierd\w*|bilateral)\s*$/i, '').replace(/[.,]\s*$/, '').trim();
        if (dmr && dmr.length <= 70) asociacion = ' asociada a ' + dmr.charAt(0).toLowerCase() + dmr.slice(1);
      }
    }
    // Apertura.
    var apertura;
    if (esNeuro) apertura = 'Disfunción de la movilidad funcional asociada a ' + (/(hemipar|hemiplej)/.test(blob) ? ('hemiparesia' + (ladoGen(lado, null) ? ' ' + ladoGen(lado, null) : '')) : 'compromiso neurológico');
    else if (esGeriatricoGen) apertura = 'Disminución de la capacidad funcional';
    else if (regK === 'columna lumbar' && h.sintomaNeuroReferido) apertura = 'Disfunción lumbopélvica asociada a dolor lumbar irradiado al miembro inferior' + (lado ? ' ' + ladoGen(lado, null) : '');
    else if (regSinMapa && !regDisp) apertura = 'Disfunción musculoesquelética' + (asociacion || '');
    else apertura = 'Disfunción musculoesquelética de ' + regDisp + (ladoG ? ' ' + ladoG : '') + (asociacion || '');

    // Lista de alteraciones (sólo documentadas).
    var alt = [];
    if (!esGeriatricoGen && !esNeuro && !(regK === 'columna lumbar' && h.sintomaNeuroReferido)) {
      if (dolor) alt.push('dolor' + (h.dolorNocturno ? ' de predominio nocturno' : ''));
      if (inflam) alt.push(edemaWord);
      if (romDeficit) alt.push('limitación de ' + mov);
      // Fuerza: hasta 3 grupos por nombre; si hay más, se resume por miembro (evita listas largas).
      var segMiembro = (REG[regK] && REG[regK].inf) ? 'del miembro inferior' : ((REG[regK] && REG[regK].sup) ? 'del miembro superior' : null);
      if (nombres.length >= 4 && segMiembro) alt.push('disminución de la fuerza ' + (nombres.indexOf('tríceps sural') !== -1 ? 'del tríceps sural y de la musculatura ' + segMiembro : 'de la musculatura ' + segMiembro));
      else if (nombres.length) alt.push('disminución de la fuerza de ' + unir(nombres));
      else if (fuerzaCual) alt.push('disminución de la fuerza muscular');
      if (estabilidad && (regK === 'tobillo/pie' || regK === 'rodilla')) alt.push('alteración de la estabilidad y la propiocepción');
      if (REG[regK] && REG[regK].escap && has(blob, ['escapul', 'ritmo'])) alt.push('alteración del ritmo escapulohumeral');
      if (h.sintomaNeuroReferido && regK !== 'columna lumbar') alt.push('síntomas neurales referidos');
    } else if (esNeuro) {
      alt.push('alteración del control motor'); alt.push('disminución del equilibrio'); alt.push('asimetría durante la marcha');
    } else if (esGeriatricoGen) {
      alt.push('debilidad muscular'); alt.push('alteración del equilibrio dinámico'); alt.push('reducción de la tolerancia a la marcha');
    } else if (regK === 'columna lumbar' && h.sintomaNeuroReferido) {
      alt.push('disminución de la tolerancia al apoyo y a la marcha');
    }

    // Aditamentos / marcha asistida.
    var marcha = '';
    if (aditam.length) {
      var inf = aditam.filter(function (a) { return a.inf; }).map(function (a) { return a.t; });
      var sup = aditam.filter(function (a) { return a.sup; }).map(function (a) { return a.t; });
      if (inf.length) marcha = ' Actualmente presenta marcha asistida mediante ' + unir(inf) + ', con restricción del apoyo conforme a las indicaciones médicas.';
      else if (sup.length) marcha = ' Actualmente con inmovilización mediante ' + unir(sup) + ', respetando las indicaciones médicas.';
    }

    // Cierre funcional.
    var fx = (REG[regK] && REG[regK].fx) || 'las actividades de la vida diaria';
    if (has(o.limitaciones, ['escalera']) && REG[regK] && REG[regK].inf) fx = 'la marcha y el uso de escaleras';
    else if (has(o.limitaciones, ['laboral', 'trabajo'])) fx = 'las actividades laborales y cotidianas';
    else if (has(o.limitaciones, ['deport', 'correr', 'entren'])) fx = 'las actividades deportivas y de mayor demanda';
    var cierre = '';
    if (esNeuro) cierre = ', condicionando la independencia en transferencias y desplazamientos';
    else if (esGeriatricoGen) cierre = ', condicionando la independencia durante los desplazamientos y las actividades de la vida diaria';
    else if (regK === 'columna lumbar' && h.sintomaNeuroReferido) cierre = ', condicionando la marcha, la bipedestación y las actividades cotidianas';
    else if (alt.length) cierre = ', condicionando ' + fx;

    var conector;
    if (esNeuro) conector = ', caracterizada por ';
    else if (esGeriatricoGen) conector = ' caracterizada por ';
    else if (asociacion || (regK === 'columna lumbar' && h.sintomaNeuroReferido)) conector = ', con ';
    else conector = ' caracterizada por ';
    var cuerpo = alt.length ? (conector + unir(alt)) : '';
    var dx = apertura + cuerpo + cierre + '.';
    dx = dx.replace(/\s+/g, ' ').replace(/\s+,/g, ',').trim();
    return { dx: dx, flags: { regK: regK, lado: lado, dolor: dolor, inflam: inflam, romDeficit: romDeficit, mov: mov, nombres: nombres, fuerzaCual: fuerzaCual, estabilidad: estabilidad, aditam: aditam, esNeuro: esNeuro, esGeriatrico: esGeriatricoGen, lumbarNeuro: (regK === 'columna lumbar' && h.sintomaNeuroReferido), postq: !!causal && /quirurg|postoperad|reconstrucc|reparacion|fractura/.test(norm(causal)), sport: has(blob, ['deport', 'futbol', 'correr', 'atlet', 'entrena']) } };
  }

  // ===== OBJETIVOS CP / MP / LP (prosa Sinergia) =====
  function redactarObjetivos(ctx, flags) {
    var regK = flags.regK; var f = flags;
    var inf = REG[regK] && REG[regK].inf, sup = REG[regK] && REG[regK].sup, axial = REG[regK] && REG[regK].axial;
    var adInf = f.aditam.filter(function (a) { return a.inf; }).map(function (a) { return a.t; });
    var adSup = f.aditam.filter(function (a) { return a.sup; }).map(function (a) { return a.t; });
    var dolorEInfl = 'Disminuir el dolor' + (f.inflam ? ' y ' + (ctx.edemaInf ? 'el edema' : 'la inflamación') : '');
    var cp, mp, lp;

    if (f.esNeuro) {
      cp = 'Favorecer el control postural, la movilidad activa y la seguridad durante las transferencias.';
      mp = 'Mejorar el control motor, el equilibrio y la capacidad funcional durante la marcha.';
      lp = 'Alcanzar el mayor grado posible de independencia en las actividades de la vida diaria y los desplazamientos.';
    } else if (f.esGeriatrico) {
      cp = 'Mejorar la seguridad durante las transferencias, el equilibrio y la tolerancia a la bipedestación.';
      mp = 'Mejorar la fuerza muscular, el equilibrio dinámico y la capacidad de desplazamiento.';
      lp = 'Favorecer la independencia funcional y una marcha segura con la ayuda técnica que resulte necesaria.';
    } else if (f.lumbarNeuro || regK === 'columna lumbar') {
      cp = 'Disminuir el dolor lumbar e irradiado y mejorar la tolerancia a la marcha y a los cambios de posición, siempre que la valoración de seguridad permita continuar.';
      mp = 'Mejorar la movilidad lumbopélvica, la estabilidad y la tolerancia a las actividades funcionales.';
      lp = 'Recuperar la capacidad para caminar, permanecer de pie y realizar las actividades laborales y cotidianas.';
    } else if (axial) { // cervical / dorsal
      cp = 'Disminuir el dolor y la tensión muscular ' + (regK === 'columna cervical' ? 'cervical' : 'de la región dorsal') + '.';
      mp = 'Recuperar la movilidad ' + (regK === 'columna cervical' ? 'cervical' : 'dorsal') + ', la capacidad muscular y mejorar el control postural según las alteraciones documentadas.';
      lp = 'Mejorar la tolerancia a las actividades laborales y cotidianas relacionadas con la movilidad ' + (regK === 'columna cervical' ? 'cervical' : 'dorsal') + '.';
    } else if (regK === 'cadera') {
      cp = dolorEInfl + ' y mejorar la tolerancia al apoyo y la movilidad de cadera.';
      mp = 'Recuperar la fuerza muscular, la estabilidad pélvica y el control del miembro inferior.';
      lp = 'Recuperar la funcionalidad durante la marcha, las transferencias y el uso de escaleras.';
    } else if (regK === 'hombro') {
      cp = 'Disminuir el dolor y mejorar la movilidad del hombro' + (adSup.length ? ', favoreciendo la movilidad protegida e iniciando el destete del cabestrillo cuando esté indicado' : '') + '.';
      mp = 'Recuperar la fuerza de los grupos musculares afectados, el control escapular y la movilidad funcional.';
      lp = 'Recuperar la capacidad de alcance, elevación y carga del miembro superior durante las actividades habituales.';
    } else if (regK === 'codo') {
      cp = 'Disminuir el dolor y favorecer la recuperación progresiva de la movilidad del codo dentro de los rangos permitidos.';
      mp = 'Recuperar la flexoextensión' + (f.sport ? ', la pronosupinación' : '') + ' y la capacidad muscular del miembro superior, según los déficits documentados.';
      lp = 'Recuperar el uso funcional de la extremidad para las actividades de la vida diaria, respetando las restricciones de carga.';
    } else if (regK === 'muñeca' || regK === 'muñeca/mano' || regK === 'mano') {
      cp = dolorEInfl + ', favorecer la movilidad permitida' + (adSup.length ? ' e iniciar el destete de la férula cuando esté autorizado' : '') + '.';
      mp = 'Recuperar la movilidad de muñeca y mano, la fuerza de prensión y la destreza manual.';
      lp = 'Recuperar la funcionalidad de la mano y muñeca para las actividades cotidianas, laborales y recreativas.';
    } else if (regK === 'rodilla') {
      var lca = /cruzado|lca/.test(norm(ctx.causal || ''));
      if (lca) {
        cp = 'Disminuir el dolor y el derrame articular, recuperar la extensión de rodilla y favorecer la activación del cuádriceps.';
        mp = 'Recuperar la movilidad, la fuerza muscular, la estabilidad dinámica y el control neuromuscular del miembro inferior.' + (adInf.length ? ' Incluir el destete de ' + unir(adInf) + ' cuando su retiro esté autorizado.' : '');
        lp = 'Recuperar la funcionalidad de la rodilla y favorecer el retorno' + (f.sport ? ' deportivo' : ' a las actividades habituales') + ' cuando se cumplan los criterios funcionales correspondientes.';
      } else {
        cp = dolorEInfl + ' y mejorar la flexión de rodilla y la tolerancia a la marcha.';
        mp = 'Recuperar la fuerza de cuádriceps e isquiotibiales, la estabilidad y el control dinámico de rodilla.' + (adInf.length ? ' Favorecer el destete de ' + unir(adInf) + ' según la evolución y las indicaciones médicas.' : '');
        lp = 'Recuperar la capacidad funcional para caminar, subir y bajar escaleras y realizar las actividades habituales.';
      }
    } else if (inf) { // tobillo / pie
      if (adInf.length) {
        cp = dolorEInfl + ', favorecer la movilidad permitida e iniciar la carga progresiva cuando esté autorizada.';
        mp = 'Favorecer el destete progresivo de ' + unir(adInf) + ' según la evolución clínica y las indicaciones médicas, mejorando la fuerza, la estabilidad y la propiocepción.';
        lp = 'Recuperar la marcha independiente sin aditamentos y la tolerancia al apoyo en diferentes superficies.';
      } else {
        cp = dolorEInfl + ', mejorar la movilidad del tobillo y favorecer la tolerancia al apoyo.';
        mp = 'Recuperar la fuerza muscular, la estabilidad y la propiocepción del tobillo.';
        lp = 'Recuperar la marcha independiente y reincorporar al paciente a sus actividades habituales.';
      }
    } else { // sin región clara: hallazgos funcionales
      cp = dolorEInfl + ' y mejorar la movilidad y la tolerancia a la actividad.';
      mp = 'Recuperar la fuerza muscular, la movilidad y el control funcional del segmento según los déficits documentados.';
      lp = 'Recuperar la funcionalidad para las actividades de la vida diaria del paciente.';
    }
    return { cp: cp, mp: mp, lp: lp };
  }

  function redactar(ctx) {
    var dxR = redactarDx(ctx);
    ctx.edemaInf = has(norm((ctx.o.padecimiento || '') + (ctx.o.limitaciones || '') + (ctx.soapHall || '')), ['edema']);
    var obj = redactarObjetivos(ctx, dxR.flags);
    return { dx: dxR.dx, objetivos: obj, flags: dxR.flags };
  }

  var API = { redactar: redactar, _redactarDx: redactarDx, _regKey: regKey, version: '2.2.3-red' };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.REDACCION = API;
})(typeof window !== 'undefined' ? window : this);
