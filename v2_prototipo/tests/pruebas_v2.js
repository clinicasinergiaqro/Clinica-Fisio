/* SINERGIA · Pruebas EJECUTABLES V2.1 (unitarias + integración) · Node, sin dependencias.
 * Correr:  node v2_prototipo/tests/pruebas_v2.js
 * Reproduce CADA error señalado por la auditoría y verifica su corrección. Exit code 1 si falla alguna.
 * Cada caso declara: id, lo que reproduce (bug de auditoría), y el aserto. Datos SINTÉTICOS (sin PHI).
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

check('OBJ-03', 'meta_propuesta de dolor es PROPUESTA editable (no dato medido) y línea base es medida',
  (function () {
    var c = GEN.generar({ patologia: 'Lumbalgia', orig: { padecimiento: 'dolor lumbar al estar sentado 2 horas desde hace 1 mes', zona: 'lumbar', eva: '8' } });
    var dolor = c.objetivos.filter(function (o) { return o.alteracion === 'dolor'; })[0];
    return dolor && dolor.linea_base.tipo === 'medido' && dolor.linea_base.valor === 8 && dolor.meta_propuesta.tipo === 'propuesta_editable';
  })());

check('OBJ-04', 'ROM no medido → línea base pendiente (no inventa valor)',
  (function () {
    var c = GEN.generar({ patologia: 'Rodilla', orig: { padecimiento: 'dolor de rodilla al subir escaleras desde hace 1 mes', zona: 'rodilla', eva: '4' } });
    var rom = c.objetivos.filter(function (o) { return o.indicador.indexOf('ROM') !== -1; })[0];
    return rom && rom.linea_base.tipo === 'pendiente' && rom.linea_base.valor === null;
  })());

// ---------- MEDICIONES: id no nulo ----------
check('MED-01', 'Medición estructurada conserva su id real',
  (function () {
    var c = GEN.generar({ orig: { padecimiento: 'dolor de rodilla al flexionar desde hace 2 meses', zona: 'rodilla' }, biomecanica: [{ id: 'bio_123', fecha: '2026-11-01', articulacion: 'rodilla', movimiento: 'flexion', lado: 'derecho', tipo: 'activa', valor: 110, unidad: 'grados', autor: 'fisio' }] });
    return c.mediciones[0] && c.mediciones[0].id === 'bio_123' && c.mediciones[0].articulacion === 'rodilla';
  })());

check('MED-02', 'ROM solo en texto → id sentinel "sin_id_estructurado" (NO null) + tarea',
  (function () {
    var c = GEN.generar({ orig: { padecimiento: 'dolor de hombro al abducir desde hace 1 mes', zona: 'hombro', rom: 'abducción 90° limitada' } });
    return c.mediciones[0] && c.mediciones[0].id === 'sin_id_estructurado' && !!c.mediciones[0].tarea;
  })());

// ---------- PLAN BLOQUEADO CUANDO HAY ALERTA ----------
check('BLK-01', 'Con alerta bloqueante, plan = null y objetivos = solo seguridad (no fijar objetivos/mediciones terapéuticas)',
  (function () {
    var c = GEN.generar({ orig: { zona: 'lumbar', padecimiento: 'lumbalgia con retención urinaria y anestesia en silla de montar', eva: '7' } });
    return c.plan === null && c.objetivos.length === 1 && c.objetivos[0].fase === 'seguridad';
  })());

// ---------- INTEGRACIÓN: caso limpio no debe disparar nada ----------
check('INT-01', 'Caso simple sin banderas → sin_alerta_detectada + plan editable',
  (function () {
    var c = GEN.generar({ patologia: 'Tendinopatia', orig: { padecimiento: 'dolor en codo al cargar peso, gradual, desde hace 6 semanas, mejora con reposo', zona: 'codo', lado: 'derecho', eva: '4' } });
    return c.seguridad.estado === 'sin_alerta_detectada_con_datos_disponibles' && c.plan && c.plan.estado === 'propuesta_editable';
  })());

// Pendientes declarados honestamente (no implementados aún en este incremento)
pendiente('UX-EDIT', 'Interfaz editable (editar dx/objetivos/metas, validar/rechazar) — pendiente incremento UI');
pendiente('BIO-BTN', 'Botones funcionales de medición en prototipo sintético — pendiente incremento UI');
pendiente('PDF-JSON', 'Regenerar los 85 JSON con este código y el PDF SOLO desde ese JSON — pendiente incremento de integración');

// ---------- RESUMEN ----------
console.log('\n================ RESUMEN PRUEBAS V2.1 ================');
RES.forEach(function (r) { console.log('  [' + r.estado + '] ' + r.id + ' · ' + r.nota); });
console.log('-----------------------------------------------------');
console.log('  PASA: ' + paso + '   FALLA: ' + fallo + '   PENDIENTE(declarado): ' + pend);
console.log('  motor: ' + MS.version + '  catálogo: ' + MS.catalogo_version + '  extractor: ' + EX.version + '  generador: ' + GEN.version);
console.log('=====================================================');
process.exit(fallo > 0 ? 1 : 0);
