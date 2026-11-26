#!/usr/bin/env node
/* SINERGIA · Arma el JSON que consume el PROTOTIPO DE REVISIÓN (aceptar/editar/rechazar).
 * Combina el contrato (resultados) con el dato existente del expediente (dataset.existente) y la
 * metadata de verificación (episodio activo, fecha de corte, nº de notas, hash de la fuente).
 * Escribe un archivo JS `window.DATOS_REVISION = [...]` para abrir el prototipo offline (file://).
 *
 * Uso: node tools/build_revision_data.js --in <resultados.json> --data <dataset.json> --out <datos_revision.js>
 * Por defecto escribe el prototipo SINTÉTICO (sin PHI). Para el real-85 se apunta a los archivos del scratchpad.
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

function lleno(v) { var VAC = ['', 'none', 'no evaluado', 'no evaluada', 'pendiente', 'por definir', '-', 'n/a', 'no especificado', 'ninguno', 'ninguna', 'no cuenta con diagnostico medico referido']; return VAC.indexOf(String(v == null ? '' : v).trim().toLowerCase()) === -1 && String(v == null ? '' : v).trim() !== ''; }
function hash(obj) { return crypto.createHash('sha1').update(JSON.stringify(obj)).digest('hex').slice(0, 10); }
function objTxt(o) { var m = o.meta_propuesta ? (typeof o.meta_propuesta === 'object' ? o.meta_propuesta.valor : o.meta_propuesta) : null; return { fase: o.fase, alteracion: o.alteracion, actividad: o.actividad, meta: m || null, justificacion: o.justificacion_meta || null }; }

var items = resultados.map(function (c) {
  var ds = dataset[c.episodio] || {}; var ex = ds.existente || {}; var sm = ds.soap_meta || {};
  var dxAnt = lleno(ex.dxFuncional) ? ex.dxFuncional : (lleno(ex.dxClinico) ? ex.dxClinico : '');
  var objAnt = [];
  if (lleno(ex.objetivosCP)) objAnt.push({ horizonte: 'CP', texto: ex.objetivosCP });
  if (lleno(ex.objetivosLP)) objAnt.push({ horizonte: 'LP', texto: ex.objetivosLP });
  var vacios = { dx: !lleno(dxAnt), obj: objAnt.length === 0 };
  return {
    codigo: c.episodio, patologia: ds.patologia || c.patologia || null, edad: (typeof ds.edad === 'number' ? ds.edad : null),
    // Verificación ANTES de aplicar (el expediente real debe coincidir con esto):
    verificacion: {
      episodio_activo: (c.episodio_analisis && c.episodio_analisis.estructura) ? c.episodio_analisis.estructura.motivoActualIndex : null,
      num_episodio: (c.episodio_analisis && c.episodio_analisis.estructura) ? c.episodio_analisis.estructura.numEpisodio : null,
      fecha_corte: c.fecha_corte || null,
      soap_n: c.soap_procesado ? c.soap_procesado.n_notas : 0,
      valoracion_inicial_fecha: sm.valoracion_inicial_fecha || null,
      posible_nuevo_motivo: !!(c.episodio_analisis && c.episodio_analisis.posible_nuevo_motivo),
      source_hash: hash({ dx: c.diagnostico_funcional.texto, obj: c.objetivos })
    },
    dx_medico: c.diagnostico_medico_referido ? c.diagnostico_medico_referido.texto : null,
    dx_anterior: dxAnt, dx_propuesto: c.diagnostico_funcional.texto,
    obj_anterior: objAnt, obj_nuevos: (c.objetivos || []).map(objTxt),
    pendientes: (c.valoracion_pendiente || []).filter(function (p) { return !/POSIBLE NUEVO MOTIVO/.test(p); }),
    precauciones: (c.seguridad.alertas || []).map(function (a) { return { regla: a.regla, clase: a.clasificacion, accion: a.accion, requiere_validacion: !!a.requiere_validacion }; }),
    bloquea_plan: !!c.seguridad.bloquea_plan,
    estado_revision: c.seguridad.bloquea_plan ? 'resolver_seguridad' : 'pendiente_revision',
    vacios: vacios
  };
});

// Prioriza expedientes con campos vacíos (dx y/o objetivos) al frente.
items.sort(function (a, b) { return (b.vacios.dx + b.vacios.obj) - (a.vacios.dx + a.vacios.obj); });

var meta = { generado: new Date().toISOString(), version: raw._resumen ? raw._resumen.version_generador : 'V2.2.2', n: items.length, fuente: path.basename(inPath) };
fs.writeFileSync(outPath, 'window.DATOS_REVISION = ' + JSON.stringify({ _meta: meta, items: items }, null, 1) + ';\n');
console.log('Datos de revisión: ' + outPath + ' (' + items.length + ' pacientes; ' + items.filter(function (i) { return i.vacios.dx || i.vacios.obj; }).length + ' con campos vacíos)');
