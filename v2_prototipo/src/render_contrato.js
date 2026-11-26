/* SINERGIA · Render del contrato V2.2 (prototipo) · ÚNICA fuente de verdad para interfaz y reportes.
 * version 2.2.0-proto · 2026-11-26. Convierte el JSON que produce generador_v2 en HTML.
 * Lo usan TANTO el PDF como el prototipo visual (no hay prosa "mejorada" aparte).
 * Colores institucionales (navy/oro) PROVISIONALES: no cerrar diseño hasta revisar la interfaz real.
 * Node + navegador.
 */
(function (root) {
  'use strict';
  var VERSION = '2.2.0-proto';

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  var SEV = {
    emergencia: { t: 'EMERGENCIA', c: '#B3261E', bg: '#FCECEA' },
    derivacion_prioritaria: { t: 'DERIVACIÓN PRIORITARIA', c: '#B55A00', bg: '#FDF1E3' },
    bloqueo_por_dato_inconsistente: { t: 'BLOQUEO POR DATO', c: '#5B3A9B', bg: '#F1ECFB' },
    error_regla: { t: 'ERROR DE REGLA', c: '#5B3A9B', bg: '#F1ECFB' },
    precaucion_especifica: { t: 'PRECAUCIÓN', c: '#8A5E0C', bg: '#FBF3DD' },
    sin_alerta_detectada_con_datos_disponibles: { t: 'SIN ALERTA DETECTADA', c: '#1F6B3B', bg: '#E8F3EC' }
  };

  function lineaBase(lb) {
    if (!lb) return '<span class="muted">—</span>';
    if (lb.tipo === 'pendiente' || lb.valor == null) return '<span class="pend">pendiente de medir</span>' + (lb.nota ? ' <span class="muted">(' + esc(lb.nota) + ')</span>' : '');
    if (lb.tipo === 'texto_cualitativo') return '“' + esc(lb.valor) + '” <span class="tag tag-pend">cualitativo (no es medición)</span>' + (lb.nota ? ' <span class="muted">(' + esc(lb.nota) + ')</span>' : '');
    return '<b>' + esc(lb.valor) + '</b>' + (lb.unidad ? ' ' + esc(lb.unidad) : '') + ' <span class="tag tag-med">' + esc(lb.tipo || 'medido') + '</span>' + (lb.fuente ? ' <span class="muted">· ' + esc(lb.fuente) + '</span>' : '');
  }
  // Meta: en V2.2 NO se asume (muchas son null + nota). Si null, se muestra la nota de por qué.
  function metaProp(m, nota) {
    if (!m) return '<span class="pend">a definir con el fisioterapeuta</span>' + (nota ? ' <span class="muted">(' + esc(nota) + ')</span>' : '');
    return esc(m.valor) + (m.unidad ? ' ' + esc(m.unidad) : '') + ' <span class="tag tag-prop">propuesta editable</span>' + (m.nota ? ' <span class="muted">(' + esc(m.nota) + ')</span>' : '');
  }
  function evids(ev) {
    if (!ev || !ev.length) return '';
    return '<div class="evid">' + ev.map(function (e) { return '<span class="evid-chip" title="evidencia">🔎 ' + esc(e.campo || '') + (e.fragmento ? ': “' + esc(String(e.fragmento).slice(0, 80)) + '”' : (e.id ? ' #' + esc(e.id) : '')) + '</span>'; }).join(' ') + '</div>';
  }

  // Render de UNA tarjeta/caso a partir del contrato.
  function renderContrato(c, opts) {
    opts = opts || {};
    var sev = SEV[c.seguridad.estado] || SEV.sin_alerta_detectada_con_datos_disponibles;
    var H = [];
    H.push('<article class="caso" data-episodio="' + esc(c.episodio) + '">');
    // Encabezado
    H.push('<header class="caso-head"><div><span class="ep">' + esc(c.episodio || 's/código') + '</span>' +
      (c.fecha_corte ? ' <span class="muted">· corte ' + esc(c.fecha_corte) + '</span>' : ' <span class="muted">· sin fecha de corte</span>') + '</div>' +
      '<div class="ver muted">gen ' + esc(c.version_generador) + ' · motor ' + esc(c.version_motor) + ' · cat ' + esc(c.catalogo_seguridad) + '</div></header>');

    // SEGURIDAD primero
    H.push('<section class="sec seg" style="--sev:' + sev.c + ';--sevbg:' + sev.bg + '">');
    H.push('<div class="seg-badge">' + sev.t + (c.seguridad.bloquea_plan ? ' · PLAN BLOQUEADO' : '') + '</div>');
    if (c.seguridad.nota) H.push('<p class="seg-nota">' + esc(c.seguridad.nota) + '</p>');
    if (c.seguridad.alertas && c.seguridad.alertas.length) {
      H.push('<ul class="alertas">');
      c.seguridad.alertas.forEach(function (a) {
        H.push('<li><b>' + esc(a.regla) + '</b> <span class="tag">' + esc(a.clasificacion) + '</span>' +
          (a.requiere_validacion ? ' <span class="tag tag-pend">requiere validación</span>' : ' <span class="tag tag-ok">verificada</span>') +
          '<div class="a-fund">' + esc(a.fundamento) + '</div>' +
          '<div class="a-acc"><b>Acción:</b> ' + esc(a.accion) + '</div>' +
          '<div class="muted">Fuente: ' + esc(a.fuente) + '</div></li>');
      });
      H.push('</ul>');
    }
    if (c.seguridad.pendientes_bloqueo && c.seguridad.pendientes_bloqueo.length) {
      H.push('<p class="seg-pend">⚠ Regla(s) PENDIENTE(S) de validación (' + esc(c.seguridad.pendientes_bloqueo.join(', ')) + '): NO bloquean el plan automáticamente, pero el fisioterapeuta debe revisarlas.</p>');
    }
    H.push('<div class="cribado ' + (c.seguridad.cribado_documentado ? 'ok' : 'no') + '">Cribado de banderas rojas: ' + (c.seguridad.cribado_documentado ? 'documentado' : 'NO documentado') + '</div>');
    H.push('</section>');

    // Episodio / nuevo motivo (punto 5)
    if (c.episodio_analisis && c.episodio_analisis.sospecha) {
      H.push('<section class="sec warn"><h3>Posible nuevo motivo de consulta</h3><p>' + esc(c.episodio_analisis.accion || '') +
        '</p><div class="muted">Región del motivo valorado: ' + esc((c.episodio_analisis.region_valoracion || []).join(', ') || '—') +
        ' · región en la nota SOAP reciente: ' + esc((c.episodio_analisis.region_soap_reciente || []).join(', ') || '—') + '</div></section>');
    }

    // Diagnóstico funcional
    H.push('<section class="sec"><h3>Diagnóstico funcional <span class="tag">' + esc(c.diagnostico_funcional.estado) + '</span></h3>');
    H.push('<p>' + esc(c.diagnostico_funcional.texto) + '</p>' + evids(c.diagnostico_funcional.evidencias) + '</section>');

    // Hipótesis
    if (c.hipotesis && c.hipotesis.length) {
      H.push('<section class="sec"><h3>Hipótesis</h3><ul>');
      c.hipotesis.forEach(function (h) { H.push('<li>' + esc(h.texto) + evids(h.sustento) + '</li>'); });
      H.push('</ul></section>');
    }

    // Discrepancias
    if (c.discrepancias && c.discrepancias.length) {
      H.push('<section class="sec warn"><h3>Discrepancias a reconciliar</h3><ul>');
      c.discrepancias.forEach(function (d) { H.push('<li><b>' + esc(d.tipo) + ':</b> ' + esc(d.detalle) + ' <span class="muted">→ ' + esc(d.accion) + '</span></li>'); });
      H.push('</ul></section>');
    }

    // Valoración pendiente
    if (c.valoracion_pendiente && c.valoracion_pendiente.length) {
      H.push('<section class="sec"><h3>Valoración pendiente</h3><ul class="chk">');
      c.valoracion_pendiente.forEach(function (p) { H.push('<li>☐ ' + esc(p) + '</li>'); });
      H.push('</ul></section>');
    }

    // Objetivos
    H.push('<section class="sec"><h3>Objetivos (individualizados)</h3>');
    if (c.objetivos && c.objetivos.length) {
      H.push('<table class="obj"><thead><tr><th>Fase</th><th>Alteración</th><th>Indicador</th><th>Línea base</th><th>Meta</th><th>Método</th><th>Criterio de alta</th></tr></thead><tbody>');
      c.objetivos.forEach(function (o) {
        H.push('<tr><td>' + esc(o.fase) + '</td><td>' + esc(o.alteracion || '') + '<div class="muted">' + esc(o.actividad || '') + '</div>' + evids(o.evidencias) + '</td>' +
          '<td>' + esc(o.indicador || '') + '</td><td>' + lineaBase(o.linea_base) + '</td><td>' + metaProp(o.meta_propuesta, o.meta_nota) + '</td>' +
          '<td>' + esc(o.metodo || '—') + '<div class="muted">reeval: ' + esc(o.reevaluacion || '—') + '</div></td>' +
          '<td>' + esc(o.criterio_cumplimiento || '—') + '</td></tr>');
      });
      H.push('</tbody></table>');
    }
    H.push('</section>');

    // Plan
    H.push('<section class="sec"><h3>Plan de tratamiento</h3>');
    if (!c.plan) { H.push('<p class="bloq">Plan BLOQUEADO por la acción de seguridad. Resolver la alerta antes de fijar el plan terapéutico.</p>'); }
    else {
      if (c.plan.protocolo_referencia) {
        H.push('<div class="proto"><b>Protocolo de referencia:</b> ' + esc(c.plan.protocolo_referencia) +
          (c.plan.fuente_biblioteca ? ' <span class="muted">· fuente: ' + esc(c.plan.fuente_biblioteca) + '</span>' : '') +
          (c.plan.irritabilidad_estimada ? ' <span class="tag">irritabilidad: ' + esc(c.plan.irritabilidad_estimada) + '</span>' : '') +
          (c.plan.objetivo_prioritario ? '<div class="muted">objetivo prioritario: ' + esc(c.plan.objetivo_prioritario) + '</div>' : '') + '</div>');
      }
      if (c.plan.restricciones && c.plan.restricciones.length) {
        H.push('<ul class="restr">');
        c.plan.restricciones.forEach(function (r) { H.push('<li>⛔ ' + esc(r) + '</li>'); });
        H.push('</ul>');
      }
      H.push('<ol class="fases">');
      (c.plan.fases || []).forEach(function (f) {
        H.push('<li><b>' + esc(f.nombre) + '</b> — ' + esc(f.objetivo || '') +
          (f.ejemplos ? '<div class="muted">ej.: ' + esc((f.ejemplos || []).join(', ')) + '</div>' : '') +
          (f.criterio_progresion ? '<div class="muted">progresa si: ' + esc(f.criterio_progresion) + '</div>' : '') +
          (f.criterio_alta ? '<div class="muted">alta: ' + esc(f.criterio_alta) + '</div>' : '') + '</li>');
      });
      H.push('</ol>');
      if (c.plan.agentes_coadyuvantes) H.push('<div class="muted"><b>Agentes coadyuvantes:</b> ' + esc(c.plan.agentes_coadyuvantes) + '</div>');
      H.push('<p class="muted">' + esc(c.plan.estado) + ' · ' + esc(c.plan.nota || '') + '</p>');
    }
    H.push('</section>');

    // Mediciones
    if (c.mediciones && c.mediciones.length) {
      H.push('<section class="sec"><h3>Mediciones</h3><table class="med"><thead><tr><th>id</th><th>articulación</th><th>mov</th><th>lado</th><th>valor</th><th>método</th><th>fecha</th></tr></thead><tbody>');
      c.mediciones.forEach(function (m) {
        H.push('<tr><td>' + esc(m.id) + '</td><td>' + esc(m.articulacion || '—') + '</td><td>' + esc(m.movimiento || '—') + '</td><td>' + esc(m.lado || '—') + '</td><td>' + esc(m.valor != null ? m.valor : '—') + (m.unidad ? ' ' + esc(m.unidad) : '') + '</td><td>' + esc(m.metodo || '—') + '</td><td>' + esc(m.fecha || '—') + '</td></tr>' + (m.tarea ? '<tr class="med-tarea"><td colspan="7">⚠ ' + esc(m.tarea) + '</td></tr>' : ''));
      });
      H.push('</tbody></table></section>');
    }

    // Mediciones SIN vincular (texto, sin id estructurado): NO cuentan como mediciones vinculadas.
    if (c.mediciones_sin_vincular && c.mediciones_sin_vincular.length) {
      H.push('<section class="sec"><h3>Datos de medición sin vincular <span class="muted">(no cuentan como mediciones estructuradas)</span></h3><ul class="chk">');
      c.mediciones_sin_vincular.forEach(function (m) {
        H.push('<li>• <b>' + esc(m.origen) + '</b>: ' + esc(m.valor_texto != null ? ('“' + m.valor_texto + '”') : (m.n + ' registro(s)')) +
          ' <span class="tag tag-pend">no estructurado</span> <span class="muted">' + esc(m.tarea || '') + '</span></li>');
      });
      H.push('</ul></section>');
    }

    // Validación profesional
    H.push('<footer class="caso-foot"><div><b>Validación del fisioterapeuta:</b> ' + esc(c.validacion_profesional.estado) +
      ' — firma pendiente. Este documento es un BORRADOR asistido; no diagnostica ni autoriza tratamiento por sí solo.</div>' +
      '<div class="muted">SOAP procesado: ' + (c.soap_procesado ? (c.soap_procesado.n_notas + ' nota(s)') : '0') + '</div></footer>');
    H.push('</article>');
    return H.join('');
  }

  var CSS = [
    ':root{--navy:#1B3A6B;--gold:#C8A24B;--ink:#1c2430;--muted:#6b7682;--line:#e3e8ef;--bg:#f6f8fb}',
    '*{box-sizing:border-box}body{margin:0;font:14px/1.5 -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:var(--ink);background:var(--bg)}',
    '.rep-head{background:var(--navy);color:#fff;padding:18px 22px}.rep-head h1{margin:0;font-size:19px;letter-spacing:.3px}.rep-head .sub{opacity:.85;font-size:12.5px;margin-top:3px}',
    '.rep-head .rule{height:3px;background:var(--gold);margin-top:12px;border-radius:2px}',
    '.wrap{max-width:900px;margin:0 auto;padding:18px}',
    '.caso{background:#fff;border:1px solid var(--line);border-radius:12px;margin:0 0 20px;padding:0 18px 14px;overflow:hidden;box-shadow:0 1px 3px rgba(16,24,40,.04)}',
    '.caso-head{display:flex;justify-content:space-between;align-items:baseline;padding:12px 0;border-bottom:2px solid var(--navy);margin:0 -18px 12px;padding-left:18px;padding-right:18px}',
    '.ep{font-weight:700;color:var(--navy);font-size:16px}.ver{font-size:11px}',
    '.sec{padding:10px 0;border-top:1px solid var(--line)}.sec:first-of-type{border-top:0}',
    '.sec h3{margin:0 0 7px;font-size:14px;color:var(--navy)}',
    '.seg{border-left:5px solid var(--sev);background:var(--sevbg);border-radius:8px;padding:10px 12px;margin:4px 0}',
    '.seg-badge{display:inline-block;background:var(--sev);color:#fff;font-weight:700;font-size:12px;padding:3px 10px;border-radius:999px;letter-spacing:.4px}',
    '.seg-nota{margin:8px 0 4px;font-size:13px}',
    '.alertas{list-style:none;margin:8px 0 0;padding:0}.alertas li{background:#fff;border:1px solid var(--line);border-radius:8px;padding:8px 10px;margin:6px 0}',
    '.a-fund{margin:3px 0}.a-acc{margin:3px 0;background:#fff7e6;border-left:3px solid var(--gold);padding:4px 8px;border-radius:4px}',
    '.tag{display:inline-block;font-size:10.5px;background:#eef2f7;color:#425066;border-radius:999px;padding:1px 8px;margin-left:4px;vertical-align:middle}',
    '.tag-ok{background:#e8f3ec;color:#1F6B3B}.tag-pend{background:#fbf3dd;color:#8A5E0C}.tag-prop{background:#eef0fb;color:#3a3f8a}.tag-med{background:#e8f0fb;color:#1B3A6B}',
    '.cribado{margin-top:8px;font-size:12px;padding:4px 8px;border-radius:6px}.cribado.ok{background:#e8f3ec;color:#1F6B3B}.cribado.no{background:#fbf3dd;color:#8A5E0C}',
    '.muted{color:var(--muted);font-size:12px}.pend{color:#8A5E0C;font-weight:600}',
    '.evid{margin-top:5px}.evid-chip{display:inline-block;font-size:11px;background:#f0f4f9;border:1px solid var(--line);border-radius:6px;padding:1px 7px;margin:2px 3px 0 0;color:#3a4a5e}',
    '.warn{background:#fbf3dd;border-radius:8px;padding:8px 12px}.bloq{background:#f1ecfb;border-left:4px solid #5B3A9B;padding:8px 10px;border-radius:6px;font-weight:600}',
    'table{width:100%;border-collapse:collapse;font-size:12px;margin-top:4px;table-layout:fixed}th,td{border:1px solid var(--line);padding:6px 7px;text-align:left;vertical-align:top;overflow-wrap:break-word;word-break:break-word}th{background:var(--navy);color:#fff;font-weight:600}',
    'tbody tr:nth-child(even){background:#fafcff}.med-tarea td{background:#fbf3dd;color:#8A5E0C}',
    '.obj th:nth-child(1){width:8%}.obj th:nth-child(2){width:22%}.obj th:nth-child(3){width:14%}.obj th:nth-child(4){width:16%}.obj th:nth-child(5){width:16%}.obj th:nth-child(6){width:12%}.obj th:nth-child(7){width:12%}',
    '.med th:nth-child(1){width:20%}',
    '.chk{list-style:none;padding:0;margin:0}.chk li{padding:2px 0}',
    '.fases{margin:4px 0 0;padding-left:18px}.fases li{margin:4px 0}',
    '.seg-pend{margin:6px 0 2px;font-size:12.5px;color:#8A5E0C;background:#fbf3dd;border-radius:6px;padding:4px 8px}',
    '.proto{background:#eef3fb;border-left:4px solid var(--navy);border-radius:6px;padding:6px 10px;margin:2px 0 6px}',
    '.restr{list-style:none;margin:6px 0;padding:0}.restr li{background:#fcecea;border-left:3px solid #B3261E;border-radius:4px;padding:4px 8px;margin:3px 0;font-size:12.5px}',
    '.caso-foot{border-top:2px solid var(--navy);margin:10px -18px 0;padding:10px 18px 0;display:flex;justify-content:space-between;gap:12px;font-size:12px}',
    // PDF: NO forzar toda la caja en una página (eso CORTABA las tablas largas). Dejar fluir la caja y
    // proteger filas/encabezado: la fila no se parte y el <thead> se repite en cada página.
    '@media print{body{background:#fff}.caso{box-shadow:none}.sec,.caso-head,.caso-foot,tr,li{break-inside:avoid}thead{display:table-header-group}tr{page-break-inside:avoid}}'
  ].join('\n');

  // Documento completo (para PDF o vista).
  function renderDoc(contratos, opts) {
    opts = opts || {};
    var lista = Array.isArray(contratos) ? contratos : [contratos];
    var body = lista.map(function (c) { return renderContrato(c, opts); }).join('\n');
    return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<title>' + esc(opts.titulo || 'SINERGIA · Reporte V2.2 (borrador)') + '</title><style>' + CSS + '</style></head><body>' +
      '<div class="rep-head"><h1>' + esc(opts.titulo || 'SINERGIA · Diagnóstico funcional asistido (V2.2 · BORRADOR)') + '</h1>' +
      '<div class="sub">' + esc(opts.subtitulo || ('Generado desde el contrato JSON del generador V2.2 · ' + lista.length + ' caso(s) · requiere validación y firma del fisioterapeuta')) + '</div>' +
      '<div class="rule"></div></div><div class="wrap">' + body + '</div></body></html>';
  }

  var API = { version: VERSION, renderContrato: renderContrato, renderDoc: renderDoc, CSS: CSS, _esc: esc };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.RenderContratoV2 = API;
})(typeof window !== 'undefined' ? window : globalThis);
