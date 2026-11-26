#!/usr/bin/env node
/* SINERGIA · Arma el JSON que consume el PROTOTIPO DE REVISIÓN (aceptar/editar/rechazar POR SECCIÓN).
 * Secciones independientes: Dx MÉDICO (referido + documentado recuperado + radiológico) · Dx FUNCIONAL ·
 * Objetivos CP · MP · LP. Cada sección muestra el texto ANTERIOR exacto y el PROPUESTO exacto; todas
 * inician PENDIENTES (no se acepta nada automáticamente). Incluye la verificación (episodio/fecha/hash).
 *
 * Uso: node tools/build_revision_data.js --in <resultados.json> --data <dataset.json> --out <datos_revision.js>
 */
'use strict';
var fs = require('fs'), path = require('path'), crypto = require('crypto');
function arg(n, d) { var i = process.argv.indexOf(n); return (i !== -1 && process.argv[i + 1]) ? process.argv[i + 1] : d; }
var BASE = path.join(__dirname, '..');
var inPath = arg('--in', path.join(BASE, 'datos', 'resultados_v22.json'));
var dataPath = arg('--data', path.join(BASE, 'datos', 'casos_anon.json'));
var outPath = arg('--out', path.join(BASE, 'prototipo_revision', 'datos_revision.js'));

var raw = JSON.parse(fs.readFileSync(inPath, 'utf8'));
var resultados = raw.resultados || raw;
var dataset = {};
try { var dj = JSON.parse(fs.readFileSync(dataPath, 'utf8')); (dj.casos || dj).forEach(function (c) { dataset[c.codigo] = c; }); } catch (e) { }

function _norm(v) { return String(v == null ? '' : v).normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase(); }
function lleno(v) { var VAC = ['', 'none', 'no evaluado', 'no evaluada', 'pendiente', 'por definir', 'por precisar', '-', '--', 'n/a', 'na', 'no especificado', 'no refiere', 'sin datos', 'ninguno', 'ninguna', 'no cuenta con diagnostico medico referido', 'no cuenta con diagnostico medico', 'sin diagnostico medico referido']; var n = _norm(v); return VAC.indexOf(n) === -1 && n !== ''; }
function hash(obj) { return crypto.createHash('sha1').update(JSON.stringify(obj)).digest('hex').slice(0, 10); }
function objTxt(o) { var m = o.meta_propuesta ? (typeof o.meta_propuesta === 'object' ? o.meta_propuesta.valor : o.meta_propuesta) : null; return o.actividad + (m ? ' — meta: ' + m : '') + (o.justificacion_meta ? ' (' + o.justificacion_meta + ')' : ''); }

var items = resultados.map(function (c) {
  var ds = dataset[c.episodio] || {}; var ex = ds.existente || {}; var sm = ds.soap_meta || {};
  var dm = c.diagnostico_medico_referido || {};
  var ddoc = c.diagnostico_medico_documentado || { propuestas: [] };
  var rad = c.hallazgos_radiologicos || [];
  var docsx = c.documentos_recuperados || {};
  var dxAnt = lleno(ex.dxFuncional) ? ex.dxFuncional : (lleno(ex.dxClinico) ? ex.dxClinico : '');
  var porFase = { corto: [], mediano: [], largo: [] };
  (c.objetivos || []).forEach(function (o) { if (o.fase === 'seguridad') return; (porFase[o.fase] || porFase.largo).push(objTxt(o)); });
  var vacios = {
    dx_medico: !lleno(dm.texto),
    dx_funcional: !lleno(dxAnt),
    cp: !lleno(ex.objetivosCP),
    mp: true, // no existe campo de mediano plazo en el expediente → siempre "vacío" (aditivo)
    lp: !lleno(ex.objetivosLP)
  };
  var nVacios = Object.keys(vacios).reduce(function (a, k) { return a + (vacios[k] ? 1 : 0); }, 0);
  // Propuesta de dx médico a guardar (si el campo está vacío y hay documento): el dx documentado.
  var dxMedPropuesto = lleno(dm.texto) ? dm.texto : (ddoc.propuestas && ddoc.propuestas.length ? ddoc.propuestas.map(function (p) { return p.dx + ' [' + (p.fuente || 'doc') + (p.fecha ? ' ' + p.fecha : '') + ']'; }).join(' · ') : '');
  return {
    codigo: c.episodio, patologia: ds.patologia || c.patologia || null, edad: (typeof ds.edad === 'number' ? ds.edad : null),
    verificacion: {
      episodio_activo: (c.episodio_analisis && c.episodio_analisis.estructura) ? c.episodio_analisis.estructura.motivoActualIndex : null,
      num_episodio: (c.episodio_analisis && c.episodio_analisis.estructura) ? c.episodio_analisis.estructura.numEpisodio : null,
      fecha_corte: c.fecha_corte || null,
      soap_n: c.soap_procesado ? c.soap_procesado.n_notas : 0,
      valoracion_inicial_fecha: sm.valoracion_inicial_fecha || null,
      posible_nuevo_motivo: !!(c.episodio_analisis && c.episodio_analisis.posible_nuevo_motivo),
      source_hash: hash({ dxm: dxMedPropuesto, dx: c.diagnostico_funcional.texto, obj: porFase })
    },
    secciones: {
      dx_medico: { anterior: dm.texto || '', propuesto: dxMedPropuesto, documentado: ddoc.propuestas || [], radiologicos: rad, vacio: vacios.dx_medico },
      dx_funcional: { anterior: dxAnt, propuesto: c.diagnostico_funcional.texto, vacio: vacios.dx_funcional },
      cp: { anterior: lleno(ex.objetivosCP) ? ex.objetivosCP : '', propuesto: porFase.corto, campo: 'objetivosCP', vacio: vacios.cp },
      mp: { anterior: '', propuesto: porFase.mediano, campo: 'objetivosMP (nuevo, aditivo)', vacio: true },
      lp: { anterior: lleno(ex.objetivosLP) ? ex.objetivosLP : '', propuesto: porFase.largo, campo: 'objetivosLP', vacio: vacios.lp }
    },
    pendientes: (c.valoracion_pendiente || []).filter(function (p) { return !/POSIBLE NUEVO MOTIVO/.test(p); }),
    precauciones: (c.seguridad.alertas || []).map(function (a) { return { regla: a.regla, clase: a.clasificacion, accion: a.accion, requiere_validacion: !!a.requiere_validacion }; }),
    restricciones_recuperadas: docsx.restricciones || [],
    enlaces_no_consultados: docsx.enlaces_no_consultados || [],
    bloquea_plan: !!c.seguridad.bloquea_plan,
    nVacios: nVacios, vacios: vacios
  };
});

// Prioriza expedientes con más campos vacíos al frente.
items.sort(function (a, b) { return b.nVacios - a.nVacios; });

var meta = { generado: new Date().toISOString(), version: raw._resumen ? raw._resumen.version_generador : 'V2.2.3', n: items.length, fuente: path.basename(inPath) };
fs.writeFileSync(outPath, 'window.DATOS_REVISION = ' + JSON.stringify({ _meta: meta, items: items }, null, 1) + ';\n');
console.log('Datos de revisión: ' + outPath + ' (' + items.length + ' pacientes; ' + items.filter(function (i) { return i.nVacios > 0; }).length + ' con campos vacíos)');
