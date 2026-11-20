# -*- coding: utf-8 -*-
# Genera la "Guía del medidor" como BIBLIOTECA del lector 📋 Protocolos:
# HTML pre-renderizado y con CSS SCOPEADO en .mg (no toca el resto de la app).
# Salida: docs/guia_medidor.json = {id,titulo,emoji,areas:[{titulo,toc,html}]}
# El generador docs/gen_protocolos_json.py lo inserta en protocolos.json.
import os, json
import guia_medidor_figs as F
from guia_medidor_figs import (sc_codo, sc_muneca, sc_cadera_sup, sc_cadera_pro, sc_rodilla, sc_tobillo,
                  sc_hombro_flex, sc_hombro_abd, sc_cuello, sc_sentadilla, sc_marcha, sc_plano)
NAVY='#1B3A6B'; GOLD='#C8A24B'; GREEN='#1F8A4C'; RED='#C0392B'; AMBER='#B07D18'; GRAY='#7c879b'

def ficha(svg, titulo, rows, ojo=None, dentro=None, fuera=None):
    r=''.join(f'<div class="fr"><span class="k">{k}</span><span class="v">{v}</span></div>' for k,v in rows)
    extra=''
    if dentro or fuera:
        extra=(f'<div class="lf"><div class="lf1"><b>🏥 En el lab</b> {dentro}</div>'
               f'<div class="lf2"><b>📍 Fuera del lab</b> {fuera}</div></div>')
    oj=f'<div class="ojo"><b>👁️ Ojo</b> {ojo}</div>' if ojo else ''
    return (f'<div class="ficha"><div class="fesq">{svg}</div>'
            f'<div class="ftxt"><div class="ftit">{titulo}</div>{r}{extra}{oj}</div></div>')

GONIO=[
 (sc_codo(),'🦾 Codo — flexión · extensión · hiperextensión',
  [('Posición','Sentado o de pie, <b>de costado</b>, brazo pegado al cuerpo.'),
   ('Cámara','Al costado del brazo, a <b>2–3 m</b>. En cuadro: hombro, codo y muñeca.'),
   ('Haz','Dobla el codo llevando la mano al hombro (flexión) y estíralo al máximo (extensión). Captura el <b>tope</b>.'),
   ('Mide','Flexión <b>0–145°</b> · Extensión déficit ≤5° · Hiperextensión ≤5–10°.')],
  'El más fiable en 2D. Si marca &gt;160° es artefacto → la app lo da por <b>no medible</b> y no lo guarda.'),
 (sc_muneca(),'✋ Muñeca — flexión · extensión',
  [('Posición','Sentado, antebrazo apoyado, <b>mano libre y visible</b>.'),
   ('Cámara','Al costado; se ven codo, muñeca y la mano/dedos.'),
   ('Haz','Palma hacia el antebrazo (flexión) y dorso arriba/atrás (extensión).'),
   ('Mide','Flexión <b>0–80°</b> · Extensión <b>0–70°</b>.')],
  'Es una <b>estimación</b> (depende de ver bien la mano). El fisio confirma el resultado.'),
 (sc_cadera_sup(),'🦵 Cadera — flexión (boca arriba)',
  [('Posición','<b>Boca ARRIBA</b> (supino) en camilla.'),
   ('Cámara','Al costado, a la <b>altura de la cadera</b>. En cuadro: tronco, cadera y rodilla.'),
   ('Haz','Lleva la rodilla hacia el pecho. Captura el tope.'),
   ('Mide','Flexión <b>0–120°</b>.')],
  'La más “floja” en 2D (escorzo). Si marca &gt;150° la app la descarta. <b>De una foto puedes medir cadera y rodilla a la vez.</b>'),
 (sc_cadera_pro(),'🦵 Cadera — extensión (boca abajo)',
  [('Posición','<b>Boca ABAJO</b> (prono) en camilla.'),
   ('Cámara','Al costado, altura de la cadera.'),
   ('Haz','Levanta el muslo separándolo de la camilla, pierna recta. Captura el tope.'),
   ('Mide','Extensión <b>0–30°</b>.')],
  'Rango chico: un “cadera ext 160°” es imposible (escorzo) → no medible. Mantén el muslo <b>en el plano</b>.'),
 (sc_rodilla(),'🦿 Rodilla — flexión · extensión',
  [('Posición','Supino o prono, <b>de costado</b>.'),
   ('Cámara','Al costado. En cuadro: cadera, rodilla y tobillo.'),
   ('Haz','Talón hacia el glúteo (flexión) y estira al máximo (extensión / déficit).'),
   ('Mide','Flexión <b>0–135°</b> · Extensión déficit ≤5° · Hiperextensión (genu recurvatum) si rebasa la recta.')],
  'La más fiable después del codo.'),
 (sc_tobillo(),'🦶 Tobillo — dorsiflexión · plantiflexión',
  [('Posición','Supino, <b>de costado</b> al pie.'),
   ('Cámara','Al costado del pie. En cuadro: rodilla, tobillo y pie.'),
   ('Haz','Punta hacia la espinilla (dorsiflexión) y punta abajo (plantiflexión).'),
   ('Mide','Dorsiflexión <b>0–20°</b> · Plantiflexión <b>0–50°</b>.')],
  'Rango chico: que el pie se vea <b>completo y nítido</b>, sin tela ni calcetín.'),
]
ROM=[
 (sc_codo(),'🦾 Codo — flexión','<b>De costado.</b> Sube la mano al hombro, 2–3 reps lentas.'),
 (sc_hombro_flex(),'💪 Hombro — flexión','<b>De costado.</b> Sube el brazo al frente hasta el tope, 2–3 reps.'),
 (sc_hombro_abd(),'💪 Hombro — abducción','<b>De FRENTE.</b> Sube el brazo por el costado hasta la oreja, 2–3 reps.'),
 (sc_cuello(),'🧑 Cuello — lateralización','<b>De FRENTE.</b> Inclina la cabeza hacia cada hombro.'),
]
def rom_card(svg,tit,txt):
    return f'<div class="rc"><div class="rc-e">{svg}</div><div class="rc-t"><b>{tit}</b><br>{txt}</div></div>'

CSS=f'''<style>
.mg{{font-size:12px;line-height:1.55;color:#2b3140}}
.mg h2{{color:#fff;background:{NAVY};font-size:13px;margin:16px 0 8px;padding:7px 11px;border-radius:8px;scroll-margin-top:12px}}
.mg h2 .s{{font-weight:500;opacity:.85;font-size:10.5px}}
.mg .gold{{background:#FBFBF7;border:1px solid #eee3c8;border-left:4px solid {GOLD};border-radius:10px;padding:10px 13px;margin:9px 0;color:#4a4330}}
.mg .gold b{{color:{NAVY}}}
.mg .planos{{display:flex;gap:10px;flex-wrap:wrap;margin:9px 0}}
.mg .pcard{{flex:1 1 200px;border:1px solid #e5e9f0;border-radius:11px;padding:9px 11px;text-align:center;background:#fff}}
.mg .pcard h3{{margin:0 0 4px;font-size:12px;color:{NAVY}}}
.mg .pcard p{{font-size:11px;color:#5a6782;margin:5px 0 0;text-align:left;line-height:1.45}}
.mg .cols{{display:flex;gap:10px;flex-wrap:wrap;margin:9px 0}}
.mg .col{{flex:1 1 230px;border:1px solid #e5e9f0;border-radius:11px;padding:9px 12px;font-size:11.5px;background:#fff}}
.mg .col h3{{margin:0 0 5px;font-size:12px;color:{NAVY}}}
.mg .col ul{{margin:4px 0 0;padding-left:16px;line-height:1.5}} .mg .col li{{margin:2px 0}}
.mg .lab{{background:#EAF2FB}} .mg .field{{background:#FBF6EC}}
.mg .ficha{{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-start;border:1px solid #e5e9f0;border-radius:12px;padding:10px 12px;margin:9px 0;background:#fff}}
.mg .fesq{{flex:1 1 150px;max-width:195px}} .mg .ftxt{{flex:3 1 230px;min-width:0}}
.mg .ftit{{font-size:13px;font-weight:800;color:{NAVY};margin-bottom:6px}}
.mg .fr{{display:flex;gap:8px;margin:3px 0;font-size:11.5px}}
.mg .fr .k{{flex:0 0 50px;color:{GOLD};font-weight:800;font-size:9px;text-transform:uppercase;letter-spacing:.03em;padding-top:2px}}
.mg .fr .v{{flex:1;color:#3a4961;line-height:1.5}} .mg .fr .v b{{color:{NAVY}}}
.mg .ojo{{background:#F4F7FC;border-radius:8px;padding:6px 9px;margin-top:7px;font-size:11px;color:#3a4961}} .mg .ojo b{{color:{NAVY}}}
.mg .lf{{display:flex;gap:8px;flex-wrap:wrap;margin-top:7px}} .mg .lf1,.mg .lf2{{flex:1 1 150px;border-radius:8px;padding:6px 9px;font-size:10.5px;line-height:1.45}}
.mg .lf1{{background:#EAF2FB;color:#2c3e5a}} .mg .lf2{{background:#FBF6EC;color:#5c4a22}} .mg .lf b{{color:{NAVY};display:block;margin-bottom:1px}}
.mg .rc{{display:flex;gap:11px;flex-wrap:wrap;align-items:center;border:1px solid #e5e9f0;border-radius:11px;padding:8px 11px;margin:7px 0;background:#fff}}
.mg .rc-e{{flex:1 1 130px;max-width:160px}} .mg .rc-t{{flex:3 1 220px;font-size:11.5px;color:#3a4961;line-height:1.5}} .mg .rc-t b{{color:{NAVY}}}
.mg .note{{background:#EAF2FB;border-radius:10px;padding:9px 12px;margin:9px 0;font-size:11.5px;color:#2c3e5a;line-height:1.55}} .mg .note b{{color:{NAVY}}}
.mg .sem{{display:flex;gap:9px;flex-wrap:wrap;margin:9px 0}}
.mg .sembox{{flex:1 1 170px;border-radius:10px;padding:9px 11px;font-size:11px;line-height:1.45}}
.mg .sg{{background:#EAF7EE;border:1px solid #bfe3cb}} .mg .sa{{background:#FBF3E6;border:1px solid #e9d9b8}} .mg .sr{{background:#FBEAE7;border:1px solid #edc8c2}}
.mg .sembox b{{display:block;font-size:12px;margin-bottom:2px}}
.mg .chk{{font-size:11.5px;line-height:1.8;color:#2c3e5a;margin:4px 0}} .mg .chk b{{color:{NAVY}}}
</style>'''

SECS=f'''{CSS}
<div class="mg">
<div class="gold"><b>🎯 La regla de oro.</b> La app mide el ángulo en <b>2D</b>, así que el <b>plano del movimiento tiene que quedar DE FRENTE a la cámara</b>. Si el movimiento va <i>hacia</i> el lente, el número sale corto o imposible. Por eso unas pruebas se graban <b>de lado</b> (perfil) y otras <b>de frente</b>.</div>

<div class="planos">
 <div class="pcard"><h3>↔ DE LADO (perfil)</h3>{sc_plano('lado')}
 <p>Codo, muñeca, rodilla, cadera, tobillo, flexión de hombro y <b>marcha</b> → cámara <b>al costado</b>.</p></div>
 <div class="pcard"><h3>⬌ DE FRENTE</h3>{sc_plano('frente')}
 <p><b>Sentadilla</b>, <b>abducción de hombro</b> y <b>lateralización de cuello</b> → cámara <b>enfrente</b>.</p></div>
</div>

<div class="cols">
 <div class="col"><h3>✅ Condiciones de una buena toma</h3><ul>
 <li>Cámara <b>firme y horizontal</b>, a <b>~2–3 m</b>.</li>
 <li><b>Zona completa</b> en cuadro (la articulación + una arriba y una abajo).</li>
 <li><b>Ropa ajustada</b>; articulación <b>descubierta</b>.</li>
 <li><b>Luz pareja</b>, sin contraluz; fondo liso.</li>
 <li>Movimiento <b>lento y hasta el tope</b>.</li>
 <li><b>Mismo encuadre</b> cada visita → se puede comparar.</li>
 </ul></div>
 <div class="col"><h3>📲 3 formas de medir</h3><ul>
 <li><b>▶️ En vivo</b> — con la cámara, en el momento.</li>
 <li><b>📁 Subir video</b> — puedes subir <b>varios de una</b>.</li>
 <li><b>📷 Subir foto</b> — ideal boca abajo: de una foto mides rodilla y cadera.</li>
 </ul></div>
</div>

<div class="cols">
 <div class="col lab"><h3>🏥 Dentro del lab</h3>Trípode o apoyo fijo, marca en el piso para los 2–3 m, luz controlada. Para <b>marcha</b>, caminadora. Tomas idénticas y <b>comparables</b>.</div>
 <div class="col field"><h3>📍 Fuera del lab (casa / cancha)</h3>Mismas reglas con el celular: <b>apóyalo</b> a 2–3 m, cuida el <b>plano</b> y el contraluz. Marcha: 2–3 <b>pasadas</b> en piso plano, a velocidad normal.</div>
</div>

<h2 id="med-gonio">📐 Goniómetro de cámara <span class="s">— el modo PRECISO</span></h2>
<div class="note"><b>Cómo funciona.</b> Eliges <b>articulación + movimiento + lado</b>, haces el movimiento hasta el tope y la app dibuja el <b>arco</b> y guarda los <b>grados</b>. El número se escribe en la <b>valoración del expediente</b> (sale en el reporte y sincroniza). Todo <b>de lado</b>. Cribado 2D ±5–10°. Ref: AAOS; Norkin &amp; White.</div>
{ficha(*GONIO[0][:3], ojo=GONIO[0][3])}
{ficha(*GONIO[1][:3], ojo=GONIO[1][3])}
{ficha(*GONIO[2][:3], ojo=GONIO[2][3])}
{ficha(*GONIO[3][:3], ojo=GONIO[3][3])}
{ficha(*GONIO[4][:3], ojo=GONIO[4][3])}
{ficha(*GONIO[5][:3], ojo=GONIO[5][3])}

<h2 id="med-rom">🦾 ROM de brazos <span class="s">— barrido rápido (codo, hombro, cuello)</span></h2>
<div class="note"><b>Qué es.</b> Un <b>barrido rápido</b>: 2–3 reps lentas. Es <b>menos fino</b> que el goniómetro y descarta la medición si la <b>visibilidad es &lt;25%</b>. Para un número fino de codo u hombro, usa el <b>📐 Goniómetro</b>.</div>
{''.join(rom_card(s,t,x) for s,t,x in ROM)}
<div class="note" style="background:#FBF3E6;color:#5c4a22"><b>👁️ Error típico.</b> Si el brazo sale <b>fuera del plano</b> salen valores imposibles. El reporte los marca 🛑 y con la <b>visibilidad</b>; si ves eso, repite cuidando el plano.</div>

<h2 id="med-sent">🏋️ Sentadilla frontal <span class="s">— valgo dinámico y simetría</span></h2>
{ficha(sc_sentadilla(),'🏋️ Sentadilla (de frente)',
  [('Posición','<b>De FRENTE</b>, cuerpo completo; pies y rodillas visibles.'),
   ('Cámara','Enfrente, firme, a 2–3 m.'),
   ('Haz','<b>3–5 sentadillas</b> seguidas, lentas y controladas.'),
   ('Mide','<b>Valgo FPPA</b> por pierna · <b>MKD</b> en el fondo · separación rodillas/tobillos · inclinación del tronco · <b>descenso del sacro</b>.'),
   ('Reporte','Tabla por pierna + <b>curva de descenso del sacro</b> + video.')],
  ojo='La app corrige el aspecto (9:16) sola. Cuida la <b>línea media</b> y los pies; si una rodilla tapa la otra en el fondo, repite más despacio.',
  dentro='Marca en el piso dónde pararse.',
  fuera='Celular apoyado a la altura de la cadera; piso plano, luz de frente.')}

<h2 id="med-marcha">🚶 Marcha sagital <span class="s">— cadencia, ángulos y simetría</span></h2>
{ficha(sc_marcha(),'🚶 Marcha (de perfil)',
  [('Posición','<b>De PERFIL</b>, cuerpo completo.'),
   ('Cámara','Al costado, firme, a 2–3 m.'),
   ('Haz','10–15 pasos. En lab, caminadora; fuera, <b>2–3 pasadas</b>.'),
   ('Mide','Cadencia · ciclos · <b>ROM y pico de rodilla, cadera y tobillo</b> por lado · simetría.'),
   ('Reporte','Tabla de ángulos izq/der + tiempos + simetría + video.')],
  ojo='<b>Los ÁNGULOS son fiables.</b> Los <b>TIEMPOS</b> solo cuentan si confirmas que el video va a <b>velocidad NORMAL</b> (la cámara lenta los invalida). Si el cuerpo no queda de perfil, la cadera se deforma.',
  dentro='Caminadora a ritmo cómodo; capta varios ciclos limpios.',
  fuera='Pasillo plano; graba a <b>velocidad normal</b> (no cámara lenta).')}

<h2 id="med-calidad">🚦 Cómo queda el reporte y si la toma sirvió</h2>
<div class="sem">
 <div class="sembox sg"><b style="color:{GREEN}">✓ Plausible</b> Dentro de rango y buena visibilidad. Sirve.</div>
 <div class="sembox sa"><b style="color:{AMBER}">⚠ Al límite</b> Cerca del tope o visibilidad justa. Revísalo.</div>
 <div class="sembox sr"><b style="color:{RED}">🛑 No medible</b> Rebasa lo posible. <b>La app NO lo guarda.</b></div>
</div>
<div class="cols">
 <div class="col"><h3>¿Por qué sale imposible?</h3><ul>
 <li><b>Plano girado / escorzo</b> — el segmento viene hacia el lente (causa #1).</li>
 <li><b>Cámara lenta / VFR</b> — tiempos de marcha falsos.</li>
 <li><b>Visibilidad &lt;25%</b> — ropa, contraluz, fuera de cuadro.</li>
 <li><b>Lado equivocado</b> — confirma izq/der.</li>
 </ul></div>
 <div class="col"><h3>Qué hacer</h3><ul>
 <li>Repite respetando el <b>plano</b> y los <b>2–3 m</b>.</li>
 <li>Ropa ajustada, articulación descubierta, luz pareja.</li>
 <li>Para un número fino, usa el <b>📐 Goniómetro</b>.</li>
 <li>Si ves 🛑 o <b>·vis bajo</b>, <b>repite esa toma</b>.</li>
 </ul></div>
</div>

<h2 id="med-flujo">💾 Guardar, sincronizar y comparar</h2>
<div class="cols">
 <div class="col"><h3>Dónde queda</h3>El <b>grado del goniómetro</b> se escribe en la <b>valoración</b> → reporte clínico + sincroniza a todos los equipos. La <b>sesión</b> (foto/video/arco/métricas) vive en la pestaña <b>🦴 Biomecánica</b>.</div>
 <div class="col"><h3>⚖️ Comparar antes/después</h3>El botón <b>⚖️ Comparar</b> toma 2 sesiones del mismo tipo y muestra los grados con <b>Δ</b> (▲ mejoró / ▼ bajó) y los videos lado a lado. Graba <b>igual</b> cada visita.</div>
</div>
<div class="note"><b>Para ir viendo cómo nos queda.</b> Haz la toma hoy → repítela idéntica la próxima visita → el comparador te dice cuánto avanzó.</div>
<div class="note"><b>✅ Checklist:</b> <span class="chk">cámara firme a 2–3 m · plano correcto (lado/frente) · zona completa · ropa ajustada y articulación descubierta · luz pareja · movimiento lento al tope · mismo encuadre que la vez pasada · marcha a velocidad normal · revisa el reporte: si hay 🛑 o vis bajo, <b>repite</b>.</span></div>

<div class="note" style="font-size:10.5px;color:#5a6782"><b>Nota honesta.</b> Es un cribado 2D (±5–10°), no sustituye al goniómetro manual en casos finos: codo y rodilla son los más fiables; muñeca es estimación; cadera la más sensible al escorzo. El fisio confirma el movimiento y el lado.</div>
</div>'''

TOC=[{'id':'med-gonio','name':'📐 Goniómetro (preciso)'},
     {'id':'med-rom','name':'🦾 ROM de brazos'},
     {'id':'med-sent','name':'🏋️ Sentadilla'},
     {'id':'med-marcha','name':'🚶 Marcha'},
     {'id':'med-calidad','name':'🚦 Semáforo de calidad'},
     {'id':'med-flujo','name':'💾 Guardar y comparar'}]

LIB={'id':'medidor','titulo':'Guía del medidor biomecánico','emoji':'🦴',
     'areas':[{'titulo':'🦴 Cómo se hace cada prueba (y cómo queda el reporte)','toc':TOC,'html':SECS}]}

if __name__=='__main__':
    out=os.environ.get('OUT','guia_medidor.json')
    json.dump(LIB, open(out,'w',encoding='utf-8'), ensure_ascii=False, separators=(',',':'))
    print('wrote', out, len(SECS),'B html')
    # preview en un contenedor tipo lector
    open('preview_app.html','w',encoding='utf-8').write(
      '<!doctype html><meta charset=utf8><body style="margin:0;background:#eef1f6">'
      '<div style="max-width:720px;margin:0 auto;background:#fff;min-height:100vh">'
      '<div style="padding:14px 16px">'
      '<div style="color:#C8A24B;font-weight:800;font-size:11px;text-transform:uppercase;letter-spacing:.1em">🦴 Guía del medidor biomecánico</div>'
      '<div style="color:#1B3A6B;font-size:17px;font-weight:800;margin:3px 0 4px">🦴 Cómo se hace cada prueba (y cómo queda el reporte)</div>'
      '<div style="height:3px;background:#C8A24B;width:60px;border-radius:2px;margin-bottom:8px"></div>'
      +SECS+'</div></div></body>')
    print('preview_app.html ok')
