// Generador de REPORTE de sentadilla con INTERPRETACIÓN CLÍNICA ESCRITA (estilo laboratorio).
// Toma un objeto `a` (análisis, salida de analisis.js) + `meta` (paciente/evaluador/fecha) y
// devuelve un HTML profesional con secciones: datos + interpretación redactada automáticamente,
// como en los reportes BTS/baropodometría. Puro texto/HTML: sin dependencias, testeable en Node.
(function(root){
  'use strict';
  function n1(v){ return (v==null||isNaN(v))?'—':(Math.round(v*10)/10).toString(); }
  function n2(v){ return (v==null||isNaN(v))?'—':(Math.round(v*100)/100).toFixed(2); }
  function esc(s){ return String(s==null?'':s).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];}); }
  function lado(m){ return m>0 ? 'medial (valgo)' : 'lateral (por fuera)'; }
  function mediaAbs(arr){ if(!arr||!arr.length) return 0; var t=0; for(var i=0;i<arr.length;i++) t+=Math.abs(arr[i]); return t/arr.length; }

  // ── REDACCIÓN CLÍNICA: convierte números en prosa, sección por sección ──
  function interpretar(a){
    var I = { profundidad:[], valgo:[], simetria:[], tronco:[], conclusiones:[] };
    var lastMkdI = a.mkdMedioIzq, lastMkdD = a.mkdMedioDer;

    // Profundidad y ejecución
    I.profundidad.push('Se registraron '+a.nReps+' repeticion'+(a.nReps===1?'':'es')+' de sentadilla, con una profundidad media de descenso del sacro de '+n1(a.profMediaCm)+' cm.');
    if(a.reps && a.reps.length>=2){
      var profs=a.reps.map(function(r){return r.profundidadCm;});
      var dif=Math.max.apply(null,profs)-Math.min.apply(null,profs);
      I.profundidad.push(dif<=6
        ? 'La profundidad se mantuvo consistente entre repeticiones (variación '+n1(dif)+' cm), lo que sugiere un gesto reproducible.'
        : 'La profundidad varió '+n1(dif)+' cm entre repeticiones, lo que puede indicar fatiga o un gesto poco reproducible.');
    }

    // Valgo dinámico (el hallazgo clave)
    I.valgo.push('El desplazamiento medial de la rodilla respecto al tobillo (MKD) en el fondo del gesto fue de '+n1(lastMkdI)+' cm en el lado izquierdo y '+n1(lastMkdD)+' cm en el derecho; valores positivos indican que la rodilla se mete hacia la línea media (valgo), y negativos que se mantiene por fuera.');
    if(a.valgoIzq && a.valgoDer)
      I.valgo.push('Se observa un VALGO DINÁMICO BILATERAL: ambas rodillas se desplazan hacia adentro en el descenso, patrón asociado a control neuromuscular deficiente y factor de riesgo de sobrecarga femoropatelar y de rodilla.');
    else if(a.valgoIzq)
      I.valgo.push('Se observa un VALGO DINÁMICO de la rodilla IZQUIERDA (se mete '+n1(lastMkdI)+' cm hacia la línea media), mientras la derecha se mantiene con un control frontal adecuado. Sugiere déficit de control/fuerza del lado izquierdo.');
    else if(a.valgoDer)
      I.valgo.push('Se observa un VALGO DINÁMICO de la rodilla DERECHA (se mete '+n1(lastMkdD)+' cm hacia la línea media), mientras la izquierda se mantiene con un control frontal adecuado. Sugiere déficit de control/fuerza del lado derecho.');
    else
      I.valgo.push('No se observa valgo dinámico marcado: ambas rodillas se mantienen por fuera de los tobillos durante el descenso, patrón compatible con un control frontal de rodilla adecuado.');
    I.valgo.push('La relación de separación rodillas/tobillos fue de '+n2(a.ratioMedio)+' (valores menores a 1 indican que las rodillas se colapsan hacia adentro respecto a los tobillos).');

    // Simetría
    var difMkd=Math.abs(lastMkdI-lastMkdD);
    if(a.asimetria){
      var peor = lastMkdI>lastMkdD ? 'izquierdo' : 'derecho';
      I.simetria.push('Existe una ASIMETRÍA relevante entre lados (diferencia de '+n1(difMkd)+' cm en el MKD), con mayor colapso del lado '+peor+'. Se sugiere dirigir el trabajo de control neuromuscular y fuerza hacia ese lado.');
    } else {
      I.simetria.push('El comportamiento entre lados es simétrico (diferencia de '+n1(difMkd)+' cm en el MKD), sin un lado claramente predominante.');
    }

    // Tronco
    var tl = a.reps ? mediaAbs(a.reps.map(function(r){return r.troncoLateral;})) : 0;
    I.tronco.push(tl<5
      ? 'El tronco se mantuvo estable en el plano frontal (inclinación lateral media '+n1(tl)+'°), sin compensaciones laterales relevantes.'
      : 'El tronco mostró una inclinación lateral media de '+n1(tl)+'°, lo que puede reflejar una compensación para descargar un lado; conviene correlacionar con la asimetría de rodilla.');

    // Conclusiones (síntesis)
    var c=[];
    if(a.valgoIzq||a.valgoDer){
      c.push('El hallazgo principal es un valgo dinámico de rodilla'+((a.valgoIzq&&a.valgoDer)?' bilateral':(a.valgoIzq?' izquierdo':' derecho'))+', '+(a.asimetria?'con asimetría entre lados':'sin asimetría marcada')+'.');
      c.push('Se recomienda trabajo de control neuromuscular, fuerza de glúteo medio y rotadores externos de cadera, y reevaluar en '+ '4–6 semanas con el mismo montaje.');
    } else {
      c.push('La sentadilla muestra un control frontal de rodilla adecuado, sin valgo dinámico ni asimetría relevante en esta toma.');
      c.push('Adecuado como línea base; comparar contra el propio paciente en sesiones sucesivas.');
    }
    I.conclusiones=c;
    return I;
  }

  function bullets(arr){ return '<ul>'+arr.map(function(t){return '<li>'+esc(t)+'</li>';}).join('')+'</ul>'; }

  function svgDescenso(a){
    var d=a.sacroDescensoCm||[]; if(d.length<2) return '';
    var W=720,H=150,pad=26,maxD=Math.max(10,Math.max.apply(null,d)),nn=d.length,p='';
    for(var i=0;i<nn;i++){ var x=pad+(W-2*pad)*i/(nn-1), y=pad+(H-2*pad)*(d[i]/maxD); p+=(i?'L':'M')+n1(x)+' '+n1(y)+' '; }
    return '<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;height:auto"><line x1="'+pad+'" y1="'+pad+'" x2="'+pad+'" y2="'+(H-pad)+'" stroke="#c9ced9"/><line x1="'+pad+'" y1="'+(H-pad)+'" x2="'+(W-pad)+'" y2="'+(H-pad)+'" stroke="#c9ced9"/><path d="'+p+'" fill="none" stroke="#1b3a6b" stroke-width="2"/><text x="'+pad+'" y="14" font-size="10" fill="#788094">0 cm (de pie)</text><text x="'+pad+'" y="'+(H-pad+12)+'" font-size="10" fill="#788094">'+n1(maxD)+' cm (fondo)</text></svg>';
  }

  function seccion(titulo, cuerpoHtml, interpretacion){
    return '<div class="sec"><h2>'+esc(titulo)+'</h2>'+(cuerpoHtml||'')+
      '<div class="interp"><div class="il">Interpretación</div>'+bullets(interpretacion)+'</div></div>';
  }

  function generarReporteSentadilla(a, meta){
    meta=meta||{}; var I=interpretar(a);
    var alerta=a.valgoIzq||a.valgoDer||a.asimetria;
    var kpis='<div class="grid">'
      +'<div class="kpi"><div class="n">'+a.nReps+'</div><div class="l">repeticiones</div></div>'
      +'<div class="kpi"><div class="n">'+n1(a.profMediaCm)+' cm</div><div class="l">profundidad media</div></div>'
      +'<div class="kpi"><div class="n">'+n2(a.ratioMedio)+'</div><div class="l">rodilla/tobillo</div></div>'
      +'<div class="kpi"><div class="n">'+n1(a.mkdMedioIzq)+'/'+n1(a.mkdMedioDer)+'</div><div class="l">MKD izq/der (cm)</div></div>'
      +'<div class="kpi"><div class="n">'+n1(a.duracionSeg)+' s</div><div class="l">'+n1(a.fps)+' fps</div></div></div>';
    var filas=(a.reps||[]).map(function(r){ return '<tr><td>'+r.n+'</td><td>'+n1(r.profundidadCm)+' cm</td><td>'+n1(r.mkdIzq)+' cm '+lado(r.mkdIzq)+'</td><td>'+n1(r.mkdDer)+' cm '+lado(r.mkdDer)+'</td><td>'+n2(r.ratioRodillaTobillo)+'</td><td>'+n1(r.troncoLateral)+'°</td></tr>'; }).join('');
    var tabla='<table><tr><th>Rep</th><th>Profundidad</th><th>MKD rodilla izq</th><th>MKD rodilla der</th><th>Rodilla/Tobillo</th><th>Tronco lat.</th></tr>'+filas+'</table>';

    return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Reporte 3D — Sentadilla</title>'+ESTILO+'</head><body>'
      +'<div class="h"><div><h1>'+esc(meta.clinica||'Clínica Sinergia')+' · Sentadilla 3D (Kinect)</h1><div class="s">Análisis tridimensional del control de rodilla</div></div>'
      +'<div class="s" style="text-align:right"><b>'+esc(meta.paciente||'—')+'</b><br>'+esc(meta.estudio||'Sentadilla a repetición')+'<br>'+esc(meta.fecha||'')+(meta.evaluador?'<br>Eval.: '+esc(meta.evaluador):'')+'</div></div>'
      +kpis
      +seccion('Profundidad y ejecución', svgDescenso(a), I.profundidad)
      +seccion('Control frontal de rodilla (valgo dinámico)', tabla, I.valgo)
      +seccion('Simetría entre lados', '', I.simetria)
      +seccion('Tronco', '', I.tronco)
      +'<div class="sec concl '+(alerta?'alerta':'ok')+'"><h2>Conclusiones</h2>'+bullets(I.conclusiones)+'</div>'
      +'<div class="note">Cribado 3D con esqueleto de Kinect. MKD = desplazamiento medial de la rodilla respecto al tobillo, en el fondo del gesto. NO mide fuerzas (cinética) ni actividad muscular (EMG): esos estudios requieren plataformas de fuerza / electromiografía. Comparar contra el propio paciente entre sesiones con el mismo montaje.</div>'
      +'<div class="foot"><span>'+esc(meta.clinica||'Clínica Sinergia')+'</span><span>Reporte generado automáticamente</span></div>'
      +'</body></html>';
  }

  var ESTILO='<style>:root{--navy:#1b3a6b;--gold:#c9a84c;--green:#2E7D52;--amber:#B45309;--gray:#788094;--line:#e6e9ef}'
    +'*{box-sizing:border-box}body{font-family:-apple-system,Segoe UI,Arial,sans-serif;color:#232838;margin:0;padding:24px;background:#fff;line-height:1.4}'
    +'.h{background:var(--navy);color:#fff;border-radius:12px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;border-bottom:4px solid var(--gold)}'
    +'.h h1{font-size:18px;margin:0}.h .s{font-size:12px;opacity:.9}'
    +'.grid{display:flex;gap:10px;flex-wrap:wrap;margin:14px 0}'
    +'.kpi{flex:1 1 110px;border:1px solid var(--line);border-radius:12px;padding:12px}.kpi .n{font-size:22px;font-weight:800;color:var(--navy)}.kpi .l{font-size:11px;color:var(--gray)}'
    +'.sec{border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin-top:14px}.sec h2{font-size:15px;color:var(--navy);margin:0 0 8px}'
    +'table{width:100%;border-collapse:collapse;font-size:13px;margin:4px 0}th{background:var(--navy);color:#fff;text-align:left;padding:7px 9px;font-size:12px}td{padding:7px 9px;border-bottom:1px solid var(--line);font-variant-numeric:tabular-nums}'
    +'.interp{margin-top:10px;background:#f6f8fb;border-left:3px solid var(--navy);border-radius:0 8px 8px 0;padding:8px 12px}.il{font-size:11px;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:.4px}'
    +'.interp ul{margin:6px 0 0;padding-left:18px}.interp li{font-size:13px;margin:4px 0}'
    +'.concl{border-left:4px solid var(--green)}.concl.alerta{border-left-color:var(--amber);background:#FEF7EC}.concl ul{margin:6px 0 0;padding-left:18px}.concl li{font-size:13px;margin:5px 0;font-weight:500}'
    +'.note{color:var(--gray);font-size:11px;margin-top:14px;font-style:italic}.foot{border-top:2px solid var(--gold);margin-top:16px;padding-top:8px;color:var(--gray);font-size:11px;display:flex;justify-content:space-between}</style>';

  var API={ generarReporteSentadilla:generarReporteSentadilla, interpretar:interpretar };
  if(typeof module!=='undefined' && module.exports) module.exports=API; else root.ReporteSinergia=API;
})(typeof window!=='undefined'?window:this);
