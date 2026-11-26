/* SINERGIA · Pruebas EJECUTABLES V2.2 (unitarias + integración) · Node, sin dependencias.
 * Correr:  node v2_prototipo/tests/pruebas_v2.js
 * Reproduce CADA error señalado por la auditoría (V2.1) y por la 2ª revisión (V2.2) y verifica su
 * corrección. Exit code 1 si falla alguna. Datos SINTÉTICOS (sin PHI).
 */
'use strict';
var EX = require('../src/extractor_v2.js');
var MS = require('../src/motor_seguridad_v2.js');
var GEN = require('../src/generador_v2.js');

var paso = 0, fallo = 0, pend = 0;
var RES = [];
function check(id, nota, cond) {
  var ok = !!cond;
  if (ok) paso++; else fallo++;
  RES.push({ id: id, estado: ok ? 'PASA' : 'FALLA', nota: nota });
  if (!ok) console.log('  ✗ ' + id + ' — ' + nota);
}
function pendiente(id, nota) { pend++; RES.push({ id: id, estado: 'PENDIENTE', nota: nota }); }

function facts(rec) { return EX.extraer(rec); }
function evalS(rec) { var h = EX.extraer(rec); return MS.evaluar(h); }
function tieneRegla(seg, id) { return seg.alertas.some(function (a) { return a.regla === id; }); }

// ---------- NEGACIÓN ----------
check('NEG-01', 'Negación de incontinencia NO debe disparar cauda equina (E1)',
  !facts({ orig: { padecimiento: 'Lumbalgia mecánica. Niega incontinencia urinaria y de esfínter. Sin anestesia en silla de montar.' } }).caudaEquina);

check('NEG-02', 'Cauda equina AFIRMADA sí dispara E1 (emergencia)',
  (function () { var s = evalS({ orig: { padecimiento: 'Lumbalgia con retención urinaria y anestesia en silla de montar desde ayer.' } }); return s.estado === 'emergencia' && tieneRegla(s, 'E1'); })());

check('NEG-03', 'Negación de cáncer NO debe marcar oncológico',
  !facts({ seguridadClinica: { condiciones: 'Niega cáncer. Sin antecedentes oncológicos.' } }).oncologico);

check('NEG-04', 'Cáncer personal AFIRMADO sí marca oncológico + P2',
  (function () { var r = { seguridadClinica: { condiciones: 'Cáncer de mama en tratamiento con quimioterapia' } }; return facts(r).oncologico && tieneRegla(evalS(r), 'P2'); })());

check('NEG-05', 'Cáncer SOLO familiar (heredofamiliar) NO cuenta como personal',
  (function () { var f = facts({ antecedentes: { patologicos: 'Madre con cáncer de mama; abuelo con cáncer de próstata' } }); return !f.oncologico && f.oncologico_familiar_solo; })());

check('NEG-06', '"sin inflamación" NO debe leerse como inflamación presente',
  !facts({ orig: { inflamacion: 'sin inflamación ni edema' } }).inflamacionPresente);

check('NEG-07', 'Inflamación AFIRMADA sí marca inflamacionPresente',
  facts({ orig: { inflamacion: 'edema y aumento de volumen en rodilla' } }).inflamacionPresente);

// ---------- TVP ----------
check('TVP-01', 'TVP activa dispara E3 (emergencia) — bug OCT-22 (no se detectaba)',
  (function () { var s = evalS({ orig: { padecimiento: 'Dolor y edema unilateral doloroso en pantorrilla; Homans positivo; sospecha de trombosis venosa profunda.' } }); return s.estado === 'emergencia' && tieneRegla(s, 'E3'); })());

check('TVP-02', 'Con TVP activa, evaluarAgente sobre el miembro = contraindicado',
  (function () { var h = facts({ orig: { padecimiento: 'trombosis venosa profunda en pierna izquierda' } }); return MS.evaluarAgente(h, 'ultrasonido', 'pierna').estado === 'contraindicado'; })());

// ---------- TRAUMA CERVICAL AXIAL (ADULTO + PEDIÁTRICO) ----------
check('CERV-01', 'Trauma cervical axial en ADULTO dispara E4 (antes solo pediátrico)',
  (function () { var s = evalS({ edad: 34, orig: { zona: 'cervical', padecimiento: 'Se clavó de cabeza en la alberca (carga axial); dolor cervical.' } }); return s.estado === 'emergencia' && tieneRegla(s, 'E4'); })());

check('CERV-02', 'Trauma cervical axial PEDIÁTRICO dispara E4',
  (function () { var s = evalS({ edad: 10, orig: { zona: 'cervical', padecimiento: 'Golpe en la cabeza con carga axial jugando; dolor de cuello.' } }); return tieneRegla(s, 'E4'); })());

check('CERV-03', 'Cervicalgia mecánica SIN mecanismo axial NO dispara E4',
  !tieneRegla(evalS({ edad: 40, orig: { zona: 'cervical', padecimiento: 'Cervicalgia por postura de trabajo, gradual.' } }), 'E4'));

check('CERV-04', '"occipital de cabeza" (anatomía) NO dispara E4 — falso positivo OCT-13',
  !tieneRegla(evalS({ edad: 65, orig: { zona: 'cervical', padecimiento: 'Hace 5 años dolor cervical gradual, se irradia a espalda alta y zona occipital de cabeza; miofascitis.' } }), 'E4'));

check('CERV-05', 'Marometa con carga axial cervical + moretón en nuca (pediátrico) SÍ dispara E4 — OCT-79',
  tieneRegla(evalS({ edad: 7, orig: { zona: 'cuello', padecimiento: 'Haciendo marometas la cabeza giró hacia atrás apoyando todo el cuerpo sobre la cabeza (hiperextensión/carga axial); moretón en la nuca; dolor en aumento.' } }), 'E4'));

check('CERV-06', '"corte axial" en reporte de imagen NO dispara E4',
  !tieneRegla(evalS({ edad: 50, orig: { zona: 'cervical', dxMedico: 'RM cervical, corte axial muestra protrusión C5-C6', padecimiento: 'dolor cervical crónico gradual sin trauma' } }), 'E4'));

// ---------- LATERALIDAD CIRUGÍA LIGAMENTARIA ----------
check('LAT-01', 'Cirugía LCA CONTRALATERAL NO debe marcarse ipsilateral — bug OCT-02',
  (function () { var f = facts({ orig: { zona: 'rodilla', lado: 'derecho', padecimiento: 'dolor de rodilla derecha' }, antecedentes: { cirugias: 'Plastia de LCA en rodilla izquierda hace 3 años' } }); return !f.ligamentoIpsilateralPrevio && f.ligamentoContralateral; })());

check('LAT-02', 'Cirugía LCA IPSILATERAL (mismo lado) sí dispara X3',
  (function () { var r = { orig: { zona: 'rodilla', lado: 'izquierdo', padecimiento: 'dolor de rodilla izquierda, nuevo mecanismo' }, antecedentes: { cirugias: 'Plastia de LCA rodilla izquierda 2023' } }; return facts(r).ligamentoIpsilateralPrevio && tieneRegla(evalS(r), 'X3'); })());

check('LAT-03', 'Cirugía ligamentaria sin lado documentado → indefinido (verificar, NO bloquear)',
  (function () { var f = facts({ orig: { zona: 'rodilla', padecimiento: 'dolor de rodilla' }, antecedentes: { cirugias: 'Cirugía de ligamento cruzado previa' } }); return f.ligamentoLadoIndefinido && !f.ligamentoIpsilateralPrevio; })());

// ---------- CONFLICTO LADO / REGIÓN ----------
check('CONF-01', 'Conflicto de LADO dispara X1 (bloqueo)',
  (function () { var s = evalS({ orig: { zona: 'rodilla', lado: 'derecho', dxMedico: 'gonartrosis rodilla izquierda', padecimiento: 'dolor' } }); return tieneRegla(s, 'X1') && s.bloquea_plan; })());

check('CONF-02', 'Conflicto de REGIÓN dispara X2 y BLOQUEA — antes se detectaba pero no bloqueaba',
  (function () { var s = evalS({ orig: { zona: 'tobillo_pie', dxMedico: 'cervicalgia', padecimiento: 'dolor' } }); return tieneRegla(s, 'X2') && s.bloquea_plan; })());

// ---------- McMURRAY / CRIBADO ----------
check('CRIB-01', 'McMurray negativo NO cuenta como cribado de banderas rojas',
  (function () { var f = facts({ orig: { pruebas: 'McMurray negativo, Lachman negativo' } }); return !f.cribadoDocumentado && f.pruebasEspecialesPresentes; })());

check('CRIB-02', 'Cribado EXPLÍCITO de banderas rojas sí cuenta',
  facts({ orig: { pruebas: 'Cribado de banderas rojas negativo; sin banderas rojas.' } }).cribadoDocumentado);

// ---------- SOAP (alarma en evolución, no en valoración inicial) ----------
check('SOAP-01', 'Bandera roja presente SOLO en nota SOAP posterior sí se detecta',
  (function () {
    var s = evalS({ orig: { zona: 'lumbar', padecimiento: 'Lumbalgia mecánica inicial sin datos de alarma.' },
      soap: [{ fecha: '2026-10-01', s: 'mejor' }, { fecha: '2026-10-20', s: 'ahora refiere retención urinaria y anestesia en silla de montar' }] });
    return s.estado === 'emergencia' && tieneRegla(s, 'E1');
  })());

check('SOAP-02', 'fecha_corte excluye notas posteriores',
  (function () {
    var h = EX.extraer({ orig: { padecimiento: 'lumbalgia' },
      soap: [{ fecha: '2026-10-20', s: 'retención urinaria y anestesia en silla de montar' }] }, { fecha_corte: '2026-10-05' });
    return !h.caudaEquina; // la nota del 20-oct queda fuera del corte del 5-oct
  })());

// ---------- CORD COMPRESSION vs ONCO DERIVACIÓN ----------
check('ONCO-01', 'Compresión medular / metástasis vertebral = EMERGENCIA (E2)',
  (function () { var s = evalS({ seguridadClinica: { condiciones: 'cáncer de próstata' }, orig: { zona: 'dorsal', padecimiento: 'metástasis vertebral con compresión medular y debilidad progresiva en piernas' } }); return s.estado === 'emergencia' && tieneRegla(s, 'E2'); })());

check('ONCO-02', 'Onco + dolor espinal nocturno (sin compresión) = DERIVACIÓN (D1), no emergencia',
  (function () { var s = evalS({ seguridadClinica: { condiciones: 'antecedente de cáncer de mama activo' }, orig: { zona: 'lumbar', padecimiento: 'dolor lumbar nocturno que no cede' } }); return s.estado === 'derivacion_prioritaria' && tieneRegla(s, 'D1'); })());

// ---------- NO SILENCIAR EXCEPCIONES ----------
check('ERR-01', 'Una excepción de regla se reporta como error_regla, NO como "sin alerta"',
  (function () {
    MS.REGLAS.push({ id: 'ZZ_THROW', clasificacion: MS.CLASES.PRECAUCION, estado: 'verificada', fundamento: 'prueba', fuente: 'test', accion: 'test', test: function () { throw new Error('boom'); } });
    var s = MS.evaluar({});
    MS.REGLAS.pop();
    return s.estado === 'error_regla' && s.alertas.some(function (a) { return a.regla === 'ZZ_THROW' && a.clasificacion === 'error_regla'; }) && s.bloquea_plan;
  })());

// ---------- AGENTES FÍSICOS: nunca "permitido" seco ----------
check('AG-01', 'Modalidad desconocida → "verificar", NO "permitido"',
  MS.evaluarAgente({}, 'aparato nuevo sin catalogar', 'rodilla').estado === 'verificar');

check('AG-02', 'Modalidad no especificada → "verificar"',
  MS.evaluarAgente({}, '', 'rodilla').estado === 'verificar');

check('AG-03', 'Sin contraindicación → "permitido_condicionado" (nunca "permitido" seco)',
  (function () { var r = MS.evaluarAgente({}, 'laser', 'rodilla'); return r.estado === 'permitido_condicionado' && r.requiere_validacion; })());

check('AG-04', 'Marcapaso + electroterapia → contraindicado',
  MS.evaluarAgente({ marcapaso: true }, 'electroterapia TENS', 'hombro').estado === 'contraindicado');

check('AG-05', 'Metal + térmico sin región → "verificar" (no se asume permitido)',
  MS.evaluarAgente({ metal: true }, 'tecar', '').estado === 'verificar');

// ---------- GENERADOR: "retorno a <diagnóstico>" ----------
check('OBJ-01', 'deportivos con texto clínico NO produce "retorno a <diagnóstico>"',
  (function () {
    var c = GEN.generar({ patologia: 'Hombro', orig: { padecimiento: 'dolor de hombro derecho al elevar el brazo desde hace 2 meses', zona: 'hombro', lado: 'derecho', eva: '6', deportivos: 'desgarre de pectoral mayor' } });
    var largo = c.objetivos.filter(function (o) { return o.fase === 'largo'; })[0];
    return largo && largo.actividad.indexOf('desgarre') === -1 && largo.actividad.indexOf('prioritaria') !== -1;
  })());

check('OBJ-02', 'deportivos con actividad real SÍ produce "retorno a <actividad>"',
  (function () {
    var c = GEN.generar({ patologia: 'Rodilla', orig: { padecimiento: 'dolor de rodilla al correr desde hace 3 semanas', zona: 'rodilla', lado: 'derecho', eva: '5', deportivos: 'correr 10k' } });
    var largo = c.objetivos.filter(function (o) { return o.fase === 'largo'; })[0];
    return largo && largo.actividad.indexOf('correr 10k') !== -1;
  })());

check('OBJ-03', 'V2.2.1: meta de dolor = PROPUESTA justificada y editable desde la EVA (no supuesto fijo ni dolor cero); línea base EVA numérica = medida',
  (function () {
    var c = GEN.generar({ patologia: 'Lumbalgia', orig: { padecimiento: 'dolor lumbar al estar sentado 2 horas desde hace 1 mes', zona: 'lumbar', eva: '8' } });
    var dolor = c.objetivos.filter(function (o) { return o.alteracion === 'dolor'; })[0];
    return dolor && dolor.fase === 'corto' && dolor.linea_base.tipo === 'medido' && dolor.linea_base.valor === 8
      && dolor.meta_propuesta && dolor.meta_propuesta.tipo === 'propuesta_editable' && /\d\/10/.test(dolor.meta_propuesta.valor)
      && !!dolor.justificacion_meta && !!dolor.meta_nota;
  })());

check('OBJ-04', 'ROM NO documentado → NO es objetivo de tratamiento; "medir ROM" va a valoración pendiente',
  (function () {
    var c = GEN.generar({ patologia: 'Rodilla', orig: { padecimiento: 'dolor de rodilla al subir escaleras desde hace 1 mes', zona: 'rodilla', eva: '4' } });
    var romObj = c.objetivos.filter(function (o) { return (o.indicador || '').indexOf('ROM') !== -1; });
    var enPend = c.valoracion_pendiente.some(function (p) { return /ROM goniom/i.test(p); });
    return romObj.length === 0 && enPend;
  })());

// ---------- MEDICIONES: vinculadas (id real) vs texto (no cuentan) ----------
check('MED-01', 'Medición estructurada conserva su id real y cuenta como vinculada',
  (function () {
    var c = GEN.generar({ orig: { padecimiento: 'dolor de rodilla al flexionar desde hace 2 meses', zona: 'rodilla' }, biomecanica: [{ id: 'bio_123', fecha: '2026-11-01', articulacion: 'rodilla', movimiento: 'flexion', lado: 'derecho', tipo: 'activa', valor: 110, unidad: 'grados', autor: 'fisio' }] });
    return c.mediciones[0] && c.mediciones[0].id === 'bio_123' && c.mediciones[0].articulacion === 'rodilla' && c.mediciones_vinculadas_n === 1;
  })());

check('MED-02', 'V2.2: ROM solo en texto NO cuenta como medición vinculada (va a mediciones_sin_vincular)',
  (function () {
    var c = GEN.generar({ orig: { padecimiento: 'dolor de hombro al abducir desde hace 1 mes', zona: 'hombro', rom: 'abducción 90° limitada' } });
    return c.mediciones.length === 0 && c.mediciones_vinculadas_n === 0
      && c.mediciones_sin_vincular.some(function (m) { return m.origen === 'valoracion.rom' && !!m.tarea; });
  })());

// ---------- PLAN BLOQUEADO CUANDO HAY ALERTA ----------
check('BLK-01', 'Con alerta bloqueante, plan = null y objetivos = solo seguridad (no fijar objetivos/mediciones terapéuticas)',
  (function () {
    var c = GEN.generar({ orig: { zona: 'lumbar', padecimiento: 'lumbalgia con retención urinaria y anestesia en silla de montar', eva: '7' } });
    return c.plan === null && c.objetivos.length === 1 && c.objetivos[0].fase === 'seguridad';
  })());

// ---------- ANONIMIZACIÓN (PHI) ----------
check('PHI-01', 'Nombre de médico en dx referido NO sale en el contrato (se reemplaza por [médico])',
  (function () {
    var c = GEN.generar({ patologia: 'Rodilla', orig: { padecimiento: 'dolor de rodilla al correr desde hace 1 mes', zona: 'rodilla', dxMedico: 'Condromalacia referida por Dr. Mauricio Larrañaga' } });
    var blob = JSON.stringify(c);
    return blob.indexOf('Larrañaga') === -1 && blob.indexOf('[médico]') !== -1;
  })());

check('PHI-02', 'scrubPHI respeta texto clínico sin nombres',
  GEN._scrubPHI('dolor lumbar que no cede, EVA 7') === 'dolor lumbar que no cede, EVA 7');

// ---------- INTEGRACIÓN: caso limpio no debe disparar nada ----------
check('INT-01', 'Caso COMPLETO sin banderas (con exploración + cribado) → sin_alerta_detectada + plan editable',
  (function () {
    var c = GEN.generar({ patologia: 'Tendinopatia', orig: { padecimiento: 'dolor en codo al cargar peso, gradual, desde hace 6 semanas, mejora con reposo', zona: 'codo', lado: 'derecho', eva: '4', mecanismo: 'sobreuso por trabajo manual repetitivo', rom: 'extensión de codo 0°, flexión 140°', fuerza: '4/5 extensores de muñeca', pruebas: 'Cozen positivo; cribado de banderas rojas negativo' } });
    return c.seguridad.estado === 'sin_alerta_detectada_con_datos_disponibles' && c.plan && c.plan.estado === 'propuesta_editable';
  })());

check('INT-02', 'Caso MÍNIMO sin exploración → V2.2 surge "datos insuficientes" (NO "sin alerta")',
  (function () {
    var c = GEN.generar({ patologia: 'Tendinopatia', orig: { padecimiento: 'dolor en codo al cargar peso desde hace 6 semanas', zona: 'codo', lado: 'derecho', eva: '4' } });
    return c.seguridad.estado === 'precaucion_especifica' && c.seguridad.alertas.some(function (a) { return a.regla === 'V2'; }) && !c.seguridad.bloquea_plan;
  })());

// ========================================================================
// ============  V2.2 · 2ª revisión independiente (ChatGPT)  ==============
// ========================================================================

// --- Punto 1: SEGURIDAD ---
check('V22-TVP-CONS', 'OCT-22: TVP por CONSTELACIÓN (hinchazón pierna + factor de riesgo, sin la palabra "trombosis") → D3 y BLOQUEA',
  (function () { var s = evalS({ orig: { inflamacion: 'hinchazón de pantorrilla derecha', padecimiento: 'posterior a cirugía de rodilla reciente con inmovilización y reposo prolongado' } }); return tieneRegla(s, 'D3') && s.bloquea_plan && s.estado === 'derivacion_prioritaria'; })());

check('V22-TVP-AGENTE', 'TVP sospecha: evaluarAgente sobre el miembro = contraindicado (D3)',
  (function () { var h = facts({ orig: { inflamacion: 'hinchazón de pierna izquierda', padecimiento: 'reposo prolongado por yeso' } }); var r = MS.evaluarAgente(h, 'ultrasonido', 'pierna'); return r.estado === 'contraindicado' && r.reglas.indexOf('D3') !== -1; })());

check('V22-NEU-OBJ', 'OCT-06: denervación activa por ENMG = déficit OBJETIVADO → D2 deriva',
  (function () { var r = { orig: { dxMedico: 'radiculopatía L5 derecha con denervación activa documentada por ENMG' } }; var f = facts(r); var s = evalS(r); return f.deficitNeuroObjetivo && s.estado === 'derivacion_prioritaria' && tieneRegla(s, 'D2'); })());

check('V22-NEU-REF', 'Solo hormigueo (síntoma REFERIDO) sin déficit objetivo NO deriva (precaución)',
  (function () { var f = facts({ orig: { padecimiento: 'refiere hormigueo ocasional en la mano, sin pérdida de fuerza' } }); return f.sintomaNeuroReferido && !f.deficitNeuroObjetivo && !f.deficitNeuroDerivacion; })());

check('V22-NEU-PROG', 'Síntoma referido PROGRESIVO sí deriva (D2)',
  (function () { var r = { orig: { zona: 'cervical', padecimiento: 'hormigueo en brazo que empeora y avanza cada vez más' } }; return facts(r).deficitNeuroDerivacion && tieneRegla(evalS(r), 'D2'); })());

check('V22-ONCO-DUDOSO', 'OCT-84: estado oncológico contradictorio (activo + remisión) → V1 verificar, NO se asume inactivo, NO bloquea',
  (function () { var r = { seguridadClinica: { condiciones: 'cáncer de mama activo, en remisión hace 5 años' }, orig: { zona: 'hombro' } }; var f = facts(r); var s = evalS(r); return f.oncoEstadoDudoso && !f.oncoActivo && tieneRegla(s, 'V1') && !s.bloquea_plan; })());

check('V22-REG-MEC', 'OCT-84: conflicto de región detectado por patología/mecanismo vs zona',
  facts({ orig: { zona: 'hombro derecho', dxMedico: 'lumbalgia crónica' } }).regionConflicto === true);

check('V22-DATOS', 'Ausencia de datos ≠ ausencia de riesgo: examen vacío sin cribado → V2 (datos insuficientes)',
  (function () { var r = { orig: { padecimiento: 'dolor' } }; return facts(r).datosInsuficientes && tieneRegla(evalS(r), 'V2'); })());

check('V22-X3-NOBLOCK', 'Punto 1: regla PENDIENTE (X3) NO bloquea el plan; aparece en pendientes_bloqueo',
  (function () { var s = evalS({ orig: { zona: 'rodilla derecha', dxMedico: 'gonalgia derecha' }, antecedentes: { cirugias: 'plastia de ligamento cruzado anterior rodilla derecha hace 2 años' } }); return tieneRegla(s, 'X3') && s.bloquea_plan === false && s.pendientes_bloqueo.indexOf('X3') !== -1; })());

// --- Punto 3: OBJETIVOS sin supuestos ---
check('V22-ROM-NUM', 'ROM numérico ("90 grados") = medido; ROM texto ("limitado") = cualitativo (NO grados)',
  (function () { var a = facts({ orig: { rom: 'flexión 90 grados' } }); var b = facts({ orig: { rom: 'limitado y doloroso' } }); return a.romEsNumerico && !b.romEsNumerico && b.romTextoCualitativo; })());

check('V22-ROM-OBJ', 'Objetivo de ROM con texto cualitativo NO se etiqueta "medido" ni se reporta en grados',
  (function () { var c = GEN.generar({ patologia: 'Hombro', orig: { padecimiento: 'dolor de hombro al elevar desde hace 1 mes', zona: 'hombro', rom: 'movilidad limitada', eva: '5' } }); var rom = c.objetivos.filter(function (o) { return o.indicador.indexOf('ROM') !== -1; })[0]; return rom && rom.linea_base.tipo === 'texto_cualitativo' && rom.linea_base.unidad === 'texto' && rom.meta_propuesta === null; })());

check('V22-FUERZA-SUP', 'Fuerza legada /5 (Daniels): NO se convierte a 0–10, meta null + nota de recaptura',
  (function () { var c = GEN.generar({ patologia: 'Rodilla', orig: { padecimiento: 'dolor de rodilla al correr desde hace 1 mes', zona: 'rodilla', fuerza: '4/5 cuádriceps', eva: '4' } }); var fz = c.objetivos.filter(function (o) { return /fuerza/.test(o.alteracion); })[0]; return fz && fz.meta_propuesta === null && !!fz.meta_nota && fz.linea_base.tipo === 'medido' && fz.linea_base.escala === 'daniels_0_5' && fz.linea_base.valor === '4/5' && !/\/10/.test(JSON.stringify(fz.linea_base)); })());

// --- Requisito Sinergia V2.2.1: FUERZA en escala 0–10 comparativa (sano=10; 6/10≈60%); NO Daniels/MRC ni conversión ---
check('V221-FUERZA-010-REF', 'Fuerza 6/10 con lado sano CONFIRMADO 10/10 → meta de simetría PROPUESTA y JUSTIFICADA + grupo/lado/%',
  (function () { var c = GEN.generar({ patologia: 'Lesion ligamentaria', orig: { padecimiento: 'inestabilidad de rodilla derecha tras lesión ligamentaria hace 1 mes', zona: 'rodilla', lado: 'derecho', fuerza: 'cuádriceps 6/10 lado derecho (lado sano 10/10)', eva: '4' } }); var fz = c.objetivos.filter(function (o) { return /fuerza/.test(o.alteracion); })[0]; var g0 = fz && fz.linea_base.grupos && fz.linea_base.grupos[0]; return fz && fz.linea_base.escala === 'comparativa_0_10' && g0 && g0.pct_estimado === 60 && g0.grupo === 'cuadriceps' && fz.linea_base.referencia_confirmada_sana === true && fz.meta_propuesta && fz.meta_propuesta.tipo === 'propuesta_editable' && /simetr/i.test(fz.meta_propuesta.valor) && !!fz.justificacion_meta; })());

check('V221-FUERZA-010-NOREF', 'Fuerza 6/10 SIN referencia sana confirmada → NO se propone simetría (no se asume contralateral sano)',
  (function () { var c = GEN.generar({ patologia: 'Rodilla', orig: { padecimiento: 'debilidad de cuádriceps derecho tras dolor de rodilla hace 1 mes', zona: 'rodilla', lado: 'derecho', fuerza: 'cuádriceps 6/10', eva: '4' } }); var fz = c.objetivos.filter(function (o) { return /fuerza/.test(o.alteracion); })[0]; return fz && fz.linea_base.escala === 'comparativa_0_10' && fz.linea_base.referencia_confirmada_sana === false && fz.meta_propuesta === null && /referencia|lado sano|contralateral/i.test(fz.justificacion_meta || ''); })());

check('V221-NEURO-NO-FUERZA', 'Disminución de fuerza por dolor (sin contexto neural) NO es déficit neurológico ni deriva',
  (function () { var c = GEN.generar({ patologia: 'Rodilla', orig: { padecimiento: 'debilidad de cuádriceps por dolor de rodilla al subir escaleras hace 1 mes', zona: 'rodilla', eva: '5' } }); return c.hechos_clave.deficitNeuroObjetivo === false && c.hechos_clave.deficitNeuroDerivacion !== true && c.seguridad.bloquea_plan === false; })());

check('V221-NEURO-SI', 'Déficit neurológico DURO (pie caído/arreflexia) sí es objetivado y deriva',
  (function () { var c = GEN.generar({ patologia: 'Lumbalgia', orig: { padecimiento: 'lumbalgia con pie caído y arreflexia aquílea derecha desde hace 2 semanas', zona: 'lumbar', eva: '6' } }); return c.hechos_clave.deficitNeuroObjetivo === true; })());

check('V221-REGION-PIE', '"giro con pie fijo" en el mecanismo NO crea falso conflicto de región (no bloquea el plan)',
  (function () { var c = GEN.generar({ patologia: 'Lesion ligamentaria', orig: { padecimiento: 'dolor de rodilla derecha tras pivote hace 3 semanas', zona: 'rodilla', lado: 'derecho', mecanismo: 'giro con pie fijo (pivote)', dxMedico: 'Esguince LCA grado II', eva: '5' } }); return c.hechos_clave.regionConflicto === false && c.seguridad.estado !== 'bloqueo_por_dato_inconsistente'; })());

check('V221-REGION-X2', 'Conflicto de región GENUINO (zona vs dx de otra región) SÍ bloquea (X2)',
  (function () { var c = GEN.generar({ patologia: 'Rodilla', orig: { zona: 'rodilla', padecimiento: 'dolor referido hace 1 mes', dxMedico: 'tendinopatía del manguito rotador del hombro', eva: '5' } }); return c.hechos_clave.regionConflicto === true && c.seguridad.estado === 'bloqueo_por_dato_inconsistente' && c.seguridad.alertas.some(function (a) { return a.regla === 'X2'; }); })());

check('V221-REGION-MULTI', 'Dx con varias regiones que INCLUYE la zona NO es conflicto (dx "cervical y lumbar" + zona lumbar)',
  (function () { var c = GEN.generar({ patologia: 'Lumbalgia', orig: { zona: 'lumbar', padecimiento: 'dolor de espalda baja hace 1 mes', dxMedico: 'esguince cervical grado 2 y esguince lumbar grado 1', eva: '5' } }); return c.hechos_clave.regionConflicto === false; })());

check('V221-NEURO-FACIAL', 'Parálisis facial antigua (otra cláusula, sin contexto neural de miembro) NO es déficit neuro objetivado',
  (function () { var c = GEN.generar({ patologia: 'Cervicalgia', orig: { zona: 'cervical', padecimiento: 'tuvo una parálisis facial hace años, ya resuelta. Ahora acude por dolor de cuello al girar hace 2 semanas', eva: '5' } }); return c.hechos_clave.deficitNeuroObjetivo === false; })());

// --- Requisito Sinergia V2.2.1: BIOMECÁNICA p.biomecanica[].medidas[] (actual/histórica/pendiente/eliminada) ---
check('V221-BIO-SESIONES', 'Consume sesiones→medidas y clasifica actual/histórica/pendiente/eliminada; vinculadas excluye eliminadas',
  (function () {
    var c = GEN.generar({ orig: { padecimiento: 'control de ROM tras cirugía de rodilla izquierda, seguimiento', zona: 'rodilla', lado: 'izquierdo', eva: '2' }, biomecanica: [
      { id: 's1', fecha: '2026-10-01', medidas: [{ id: 'm1', articulacion: 'rodilla', movimiento: 'flexion', lado: 'izquierdo', valor: 95 }, { id: 'm2', articulacion: 'rodilla', movimiento: 'extension', lado: 'izquierdo', valor: null }] },
      { id: 's2', fecha: '2026-11-01', medidas: [{ id: 'm3', articulacion: 'rodilla', movimiento: 'flexion', lado: 'izquierdo', valor: 120 }] },
      { id: 's0', fecha: '2026-09-01', eliminado: true, medidas: [{ id: 'mx', articulacion: 'rodilla', movimiento: 'flexion', lado: 'izquierdo', valor: 80 }] }
    ] });
    var b = c.mediciones_biomecanica;
    return b.conteo.actuales === 1 && b.conteo.historicas === 1 && b.conteo.pendientes === 1 && b.conteo.eliminadas === 1 && b.actuales[0].valor === 120 && c.mediciones_vinculadas_n === 3;
  })());

check('V221-EPIS-NO-INICIA', 'Episodio: consume estructura real y la IA NO inicia un nuevo motivo (decide el fisioterapeuta)',
  (function () {
    var c = GEN.generar({ episodio: { numEpisodio: 2, motivoActualIndex: 1, numSesionEpisodioActual: 3, motivosAnteriores: [{}] }, patologia: 'Rodilla', orig: { zona: 'rodilla', padecimiento: 'gonalgia por sobreuso al correr hace meses' }, soap: [{ fecha: '2026-09-01', s: 'dolor de rodilla' }, { fecha: '2026-11-20', s: 'ahora acude por dolor de hombro derecho' }] }, { fecha_corte_default: '2026-11-26' });
    var ea = c.episodio_analisis;
    return ea.estructura.numEpisodio === 2 && ea.estructura.motivoActualIndex === 1 && ea.estructura.numSesionEpisodioActual === 3 && ea.estructura.motivosAnteriores_n === 1
      && ea.inicia_automaticamente === false && ea.decide === 'fisioterapeuta' && ea.posible_nuevo_motivo === true
      && c.valoracion_pendiente.some(function (p) { return /no lo inicia|lo decide el fisioterapeuta/i.test(p); });
  })());

// --- Punto 4: PLANES individualizados por patología (ya no idénticos) ---
check('V22-PLAN-PAT', 'El plan referencia un protocolo de la biblioteca ESPECÍFICO por patología (Tendinopatía ≠ Lumbalgia)',
  (function () {
    var t = GEN.generar({ patologia: 'Tendinopatia', orig: { padecimiento: 'dolor en tendón rotuliano al saltar desde hace 2 meses', zona: 'rodilla', eva: '4' } });
    var l = GEN.generar({ patologia: 'Lumbalgia', orig: { padecimiento: 'dolor lumbar mecánico desde hace 3 semanas', zona: 'lumbar', eva: '4' } });
    return t.plan.protocolo_referencia !== l.plan.protocolo_referencia && /HSR|Tendinopat/.test(t.plan.protocolo_referencia) && !!t.plan.fuente_biblioteca && /dosificaci/i.test(t.plan.nota);
  })());

check('V22-PLAN-RESTR', 'El plan incorpora restricción real (metal → no térmico sobre material) sin inventar dosis',
  (function () { var c = GEN.generar({ patologia: 'Fractura', orig: { padecimiento: 'dolor posterior a fractura de tibia con placa desde hace 2 meses', zona: 'tobillo_pie', eva: '5' }, seguridadClinica: { implantes: 'material de osteosíntesis, placa y tornillos en tibia' } }); return c.plan && c.plan.restricciones.some(function (r) { return /osteos[ií]ntesis|material/i.test(r); }); })());

// --- Punto 5: SOAP / nuevo motivo ---
check('V22-EPISODIO', 'Nuevo motivo: SOAP reciente de OTRA región → OBSERVACIÓN de posible episodio distinto (la IA no lo inicia)',
  (function () { var c = GEN.generar({ patologia: 'Rodilla', orig: { zona: 'rodilla', padecimiento: 'gonalgia por sobreuso al correr hace meses' }, soap: [{ fecha: '2026-09-01', s: 'dolor de rodilla' }, { fecha: '2026-11-20', s: 'ahora acude por dolor de hombro derecho tras cargar peso' }] }, { fecha_corte_default: '2026-11-26' }); return c.episodio_analisis.sospecha === true && c.episodio_analisis.region_valoracion.indexOf('rodilla') !== -1 && c.episodio_analisis.region_soap_reciente.indexOf('hombro') !== -1; })());

check('V22-EPISODIO-NEG', 'Mismo motivo en evolución NO marca episodio nuevo',
  (function () { var c = GEN.generar({ patologia: 'Rodilla', orig: { zona: 'rodilla', padecimiento: 'gonalgia derecha al correr' }, soap: [{ fecha: '2026-09-01', s: 'dolor de rodilla' }, { fecha: '2026-11-20', s: 'rodilla con menos dolor, mejor flexión' }] }, { fecha_corte_default: '2026-11-26' }); return c.episodio_analisis.sospecha === false; })());

// --- Punto 7: trazabilidad / anonimización ---
check('V22-FECHA-CORTE', 'Todo resultado trae fecha_corte (de la última nota SOAP o del default de la corrida)',
  (function () {
    var conSoap = GEN.generar({ orig: { padecimiento: 'dolor de codo al cargar desde hace 1 mes', zona: 'codo' }, soap: [{ fecha: '2026-10-10', s: 'x' }, { fecha: '2026-11-15', s: 'y' }] }, { fecha_corte_default: '2026-11-26' });
    var sinSoap = GEN.generar({ orig: { padecimiento: 'dolor de codo al cargar desde hace 1 mes', zona: 'codo' } }, { fecha_corte_default: '2026-11-26' });
    return conSoap.fecha_corte === '2026-11-15' && sinSoap.fecha_corte === '2026-11-26';
  })());

check('V22-PHI-PART', 'OCT-72: nombre de médico con partículas ("García de Bustamante") se elimina entero',
  (function () { var c = GEN.generar({ patologia: 'Rodilla', orig: { padecimiento: 'dolor de rodilla al correr desde hace 1 mes', zona: 'rodilla', dxMedico: 'Condromalacia, operado por Dr. Martín Alfredo Romo García de Bustamante' } }); var b = JSON.stringify(c); return b.indexOf('García de Bustamante') === -1 && b.indexOf('Bustamante') === -1 && b.indexOf('[médico]') !== -1; })());

check('V22-PHI-NOFALSO', 'scrubPHI NO se come palabras comunes (médico tratante / en reposo / referido sin nombre)',
  (function () { return GEN._scrubPHI('el médico tratante indicó reposo; dolor en reposo nocturno; sin diagnóstico médico referido') === 'el médico tratante indicó reposo; dolor en reposo nocturno; sin diagnóstico médico referido'; })());

// --- V2.2.2: dx médico separado del funcional ---
check('V222-DXMED-SEP', 'El diagnóstico MÉDICO referido va en su propio bloque (no dentro del funcional)',
  (function () { var c = GEN.generar({ patologia: 'Hombro', orig: { zona: 'hombro', lado: 'derecho', padecimiento: 'dolor de hombro derecho al elevar el brazo hace 1 mes', dxMedico: 'síndrome subacromial', eva: '5' } }); return c.diagnostico_medico_referido && c.diagnostico_medico_referido.estado === 'referido' && /subacromial/i.test(c.diagnostico_medico_referido.texto) && c.diagnostico_funcional.texto.indexOf('en contexto de') === -1; })());

check('V222-DXMED-AUSENTE', 'Sin dx médico → bloque médico "ausente" y el funcional igual se redacta',
  (function () { var c = GEN.generar({ patologia: 'Lumbalgia', orig: { zona: 'lumbar', padecimiento: 'dolor lumbar mecánico al cargar peso hace 3 semanas', eva: '5' } }); return c.diagnostico_medico_referido.estado === 'ausente' && c.diagnostico_medico_referido.texto === null && c.diagnostico_funcional.texto.length > 20; })());

// --- V2.2.2: objetivos = solo alteraciones reales; no "medir X" como objetivo ---
check('V222-OBJ-NO-TAREA', 'Fuerza NORMAL documentada NO genera objetivo de fuerza; ROM normal tampoco',
  (function () { var c = GEN.generar({ patologia: 'Rodilla', orig: { zona: 'rodilla', padecimiento: 'dolor de rodilla al correr hace 1 mes', eva: '4', fuerza: 'fuerza conservada 10/10', rom: 'ROM completo' } }); var fz = c.objetivos.filter(function (o) { return /fuerza/.test(o.alteracion); }); var rom = c.objetivos.filter(function (o) { return /movilidad/.test(o.alteracion); }); return fz.length === 0 && rom.length === 0; })());

check('V222-OBJ-MULTIGRUPO', 'Objetivo de fuerza lista MÚLTIPLES grupos con déficit (cuádriceps+glúteo), excluye el 10/10',
  (function () { var c = GEN.generar({ patologia: 'Rodilla', orig: { zona: 'rodilla', lado: 'derecho', padecimiento: 'debilidad de rodilla derecha tras dolor hace 1 mes', eva: '4', fuerza: 'cuádriceps 6/10 derecho, glúteo medio 7/10 derecho, gastrocnemio 10/10' } }); var fz = c.objetivos.filter(function (o) { return /fuerza/.test(o.alteracion); })[0]; return fz && fz.linea_base.grupos.length === 2 && /cuadriceps/.test(fz.alteracion) && /gluteo/.test(fz.alteracion); })());

check('V222-EVA-REPOSO-MOV', 'EVA reposo/movimiento: la meta se ancla al dolor de MOVIMIENTO y la línea base guarda ambos',
  (function () { var c = GEN.generar({ patologia: 'Tendinopatia', orig: { zona: 'rodilla', padecimiento: 'dolor en tendón rotuliano al saltar hace 2 meses', eva: '7 al movimiento, 2 en reposo' } }); var d = c.objetivos.filter(function (o) { return o.alteracion === 'dolor'; })[0]; return d && d.linea_base.movimiento === 7 && d.linea_base.reposo === 2 && /≤ 4\/10/.test(d.meta_propuesta.valor); })());

check('V222-NO-DANIELS', 'Ningún TEXTO de recomendación (objetivos/plan) recomienda Daniels/MRC ni dinamómetro (la etiqueta de dato histórico no cuenta)',
  (function () {
    var c = GEN.generar({ patologia: 'Rodilla', orig: { zona: 'rodilla', padecimiento: 'debilidad de rodilla al subir escaleras hace 1 mes', eva: '4', fuerza: 'cuádriceps 6/10' } });
    var textos = [];
    (c.objetivos || []).forEach(function (o) { textos.push(o.actividad, o.metodo, o.indicador, o.meta_nota, o.justificacion_meta, o.meta_propuesta && o.meta_propuesta.valor, o.linea_base && o.linea_base.nota); });
    if (c.plan) { textos.push(c.plan.nota, c.plan.agentes_coadyuvantes, c.plan.protocolo_referencia); (c.plan.fases || []).forEach(function (f) { textos.push(f.nombre, f.objetivo, f.criterio_progresion); }); }
    var blob = textos.filter(Boolean).join(' · ').toLowerCase();
    return blob.indexOf('daniels') === -1 && blob.indexOf('dinamom') === -1 && blob.indexOf('mrc') === -1;
  })());

// Pendientes declarados honestamente (no implementados aún en este incremento)
pendiente('UX-EDIT', 'Interfaz editable (editar dx/objetivos/metas, validar/rechazar) — la define el rediseño visual (otra ventana)');
pendiente('BIO-BTN', 'Botones de medición: los implementa el rediseño visual; esta rama define/consume el CONTRATO de datos de medición');

// ---------- RESUMEN ----------
console.log('\n================ RESUMEN PRUEBAS V2.2 ================');
RES.forEach(function (r) { console.log('  [' + r.estado + '] ' + r.id + ' · ' + r.nota); });
console.log('-----------------------------------------------------');
console.log('  PASA: ' + paso + '   FALLA: ' + fallo + '   PENDIENTE(declarado): ' + pend);
console.log('  motor: ' + MS.version + '  catálogo: ' + MS.catalogo_version + '  extractor: ' + EX.version + '  generador: ' + GEN.version);
console.log('=====================================================');
process.exit(fallo > 0 ? 1 : 0);
