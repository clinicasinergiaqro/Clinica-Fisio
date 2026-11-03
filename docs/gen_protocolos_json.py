# -*- coding: utf-8 -*-
# Genera protocolos.json (raíz del repo) desde las 4 bibliotecas docs/biblioteca_*.md
# (ortopedia · agentes · msk · derma) para el lector 📋 Protocolos de la app.
# Correr con python3.13 (tiene python-markdown; el python3=3.11 NO).
# Capa de PRESENTACIÓN: NO cambia el texto clínico. Transforma a HTML + pastillas [verificar],
# limpia ruido de dev, convierte tablas ASCII → <table> responsive, colorea semáforo/peligro,
# añade data-labels y enlaces §N. docs/ está en el ignore de firebase → este .py NO se sirve.
import re, json, unicodedata, datetime
import markdown as MD

DOCS='/home/user/Clinica-Fisio/docs'
OUT='/home/user/Clinica-Fisio/protocolos.json'

def norm(s):
    s=''.join(c for c in unicodedata.normalize('NFD',s) if unicodedata.category(c)!='Mn')
    s=re.sub(r'[^a-z0-9 ]',' ',s.lower())
    return re.sub(r'\s+',' ',s).strip()

# headings cuya sub-sección se ELIMINA del lector (ruido para el fisio; queda en docs/)
STRIP_RE = re.compile(r'(^fuentes\b)|incertidumbre|(^nota de metodo)|(^notas de metodo)|(notas transversales de incertidumbre)|(^nota de uso)|(^notas para quien)|(^nota de integracion)|(^nota final)|(^observacion para la integracion)')

def heading_level(line):
    m=re.match(r'^(#{1,6}) ',line)
    return len(m.group(1)) if m else None

def strip_meta(body):
    lines=body.split('\n'); out=[]; i=0; n=len(lines)
    while i<n:
        lvl=heading_level(lines[i])
        if lvl is not None:
            txt=norm(re.sub(r'^#{1,6} ','',lines[i]))
            txt=re.sub(r'^\d+\s+','',txt)   # tolerar numeración: "12. Fuentes"/"13 Incertidumbres" → quita el nº para el match meta
            if STRIP_RE.search(txt):
                # saltar hasta el próximo heading de nivel <= lvl
                i+=1
                while i<n:
                    l2=heading_level(lines[i])
                    if l2 is not None and l2<=lvl: break
                    i+=1
                continue
        out.append(lines[i]); i+=1
    return '\n'.join(out).strip()

def split_areas(txt, skip_prefixes=()):
    """Divide por headings '## ' (nivel 2). Devuelve [(titulo, body_md)]."""
    lines=txt.split('\n')
    # localizar índices de '## '
    idxs=[i for i,l in enumerate(lines) if re.match(r'^## ',l)]
    areas=[]
    for k,start in enumerate(idxs):
        end=idxs[k+1] if k+1<len(idxs) else len(lines)
        titulo=re.sub(r'^## ','',lines[start]).strip()
        nt=norm(titulo)
        if any(nt.startswith(p) for p in skip_prefixes):
            continue
        body='\n'.join(lines[start+1:end]).strip()
        body=strip_meta(body)
        if not body: continue
        areas.append((titulo, body))
    return areas

from markdown.extensions.toc import slugify as _mdslug
def _slug(v,s):
    try: return 'bp-'+_mdslug(v,s)
    except Exception: return 'bp-x'
_MD=MD.Markdown(extensions=['tables','fenced_code','sane_lists','attr_list','toc'],
                extension_configs={'toc':{'slugify':_slug}})
def _tag_li(m):
    inner=m.group(1)
    t=re.sub(r'^\s*(<strong>)?\s*','',inner).lower()
    def hit(*pats): return any(re.match(p,t) for p in pats)
    if hit(r'fase\s'):
        return '<li class="L-phase">%s</li>'%inner
    if hit(r's[íi]\s*[:：]', r'qu[ée]\s+s[íi]\s*[:：]'):
        v=re.sub(r'^\s*(<strong>\s*)?(qu[ée]\s+)?s[íi]\s*[:：]\s*(</strong>\s*)?','',inner,count=1,flags=re.I)
        return '<li class="L-si">%s</li>'%v
    if hit(r'no\s*[:：]', r'qu[ée]\s+no\s*[:：]'):
        v=re.sub(r'^\s*(<strong>\s*)?(qu[ée]\s+)?no\s*[:：]\s*(</strong>\s*)?','',inner,count=1,flags=re.I)
        return '<li class="L-no">%s</li>'%v
    if hit(r'(restricc|evitar\s*[:：]|precauc|no\s+aplicar)'): return '<li class="L-prec">%s</li>'%inner
    if hit(r'(avanzar|avance\b|criterios?\s+(para|de)\b|progres|alta\b|retorno\b)'): return '<li class="L-goal">%s</li>'%inner
    if hit(r'(metas?\b|objetivo)'): return '<li class="L-meta">%s</li>'%inner
    return m.group(0)

def enrich(html):
    """Capa de presentación: resalta fases, banderas y etiqueta SÍ/NO/precaución/criterio/meta. NO cambia el texto clínico."""
    # [verificar] (y variantes) → pastilla ámbar discreta en vez de caja de código gris.
    # Cubre las que van entre backticks (código) y las escritas en texto plano (consistencia).
    html=re.sub(r'<code>\[verificar([^\]<]*)\]</code>',
                r'<span class="bib-verif" title="dato a confirmar contra la fuente">verificar\1</span>', html)
    html=re.sub(r'\[verificar([^\]<]*)\]',
                r'<span class="bib-verif" title="dato a confirmar contra la fuente">verificar\1</span>', html)
    # ENCUADRE (bloque "de un vistazo" al inicio del protocolo): marcar el blockquote y sus 3 líneas
    html=re.sub(r'<blockquote>\s*<p><strong>📋 Encuadre</strong></p>',
                '<blockquote class="bib-encuadre">\n<p class="enc-h"><strong>📋 Encuadre</strong></p>', html)
    html=re.sub(r'<p><strong>(🎯[^<]*)</strong>', r'<p class="enc-ind"><strong>\1</strong>', html)
    html=re.sub(r'<p><strong>(⛔[^<]*)</strong>', r'<p class="enc-ci"><strong>\1</strong>', html)
    html=re.sub(r'<p><strong>(⚠️[^<]*)</strong>', r'<p class="enc-prec"><strong>\1</strong>', html)
    # ETIQUETAS de agente físico (biblioteca Agentes): color a Indicaciones/Contraindicaciones/Precauciones
    html=re.sub(r'<p><strong>(Indicaciones[^<]*)</strong>', r'<p class="af-ind"><strong>\1</strong>', html)
    html=re.sub(r'<p><strong>(Contraindicaciones[^<]*)</strong>', r'<p class="af-ci"><strong>\1</strong>', html)
    html=re.sub(r'<p><strong>(Precauciones[^<]*)</strong>', r'<p class="af-prec"><strong>\1</strong>', html)
    # encabezados de FASE (p en negrita y h4/h5)
    html=re.sub(r'<p><strong>((?:Fase|FASE)\b[^<]*)</strong>', r'<p class="ph"><strong>\1</strong>', html)
    html=re.sub(r'<(h[3-5])([^>]*)>(\s*(?:Fase|FASE)\b[^<]*)</\1>', r'<\1\2 class="ph">\3</\1>', html)
    # encabezados de peligro (banderas rojas / contraindicaciones)
    html=re.sub(r'<(h[3-5])([^>]*)>([^<]*(?:andera|ontraindicac|🚩|🛑)[^<]*)</\1>', r'<\1\2 class="danger">\3</\1>', html)
    # items de lista por etiqueta (evita los que contienen sub-listas)
    html=re.sub(r'<li>((?:(?!</li>|<[uo]l[ >]).)*?)</li>', _tag_li, html, flags=re.S)
    return html

def _sep_lists(md):
    """sane_lists exige línea en blanco antes de una lista; muchas fases la omiten
    (el '- SÍ:' quedaba como texto). Inserta la blanca SOLO donde una lista ARRANCA
    justo tras una línea de texto (no toca listas ya separadas ni continuaciones)."""
    is_item=lambda l: bool(re.match(r'^\s*([-*+]\s|\d+[.)]\s)', l))
    out=[]; in_list=False
    for l in md.split('\n'):
        if is_item(l):
            if (not in_list) and out:
                p=out[-1].strip()
                if p and not p.startswith('>') and not p.endswith('|') and not p.startswith('#'):
                    out.append('')
            in_list=True
        else:
            if l.strip()=='' or not l.startswith((' ','\t')):
                in_list=False
        out.append(l)
    return '\n'.join(out)

def _add_table_labels(html):
    """Tablas responsive en móvil: añade data-label (encabezado de columna) a cada <td>."""
    def per_table(m):
        tbl=m.group(0)
        heads=[re.sub(r'<[^>]+>','',h).strip().replace('"','&quot;') for h in re.findall(r'<th[^>]*>(.*?)</th>',tbl,re.S)]
        if not heads: return tbl
        def per_row(rm):
            row=rm.group(0)
            if '<td' not in row: return row
            idx=[0]
            def per_td(tm):
                lbl=heads[idx[0]] if idx[0]<len(heads) else ''
                idx[0]+=1
                return '<td data-label="%s"%s>'%(lbl, tm.group(1))
            return re.sub(r'<td([^>]*)>', per_td, row)
        return re.sub(r'<tr>.*?</tr>', per_row, tbl, flags=re.S)
    return re.sub(r'<table.*?</table>', per_table, html, flags=re.S)

# Limpieza de "ruido de desarrollador" para el lector clínico: reemplaza identificadores de
# código/archivos/PR (sin significado clínico) por su equivalente en lenguaje llano. Capa de
# PRESENTACIÓN: no toca el .md, se re-aplica en cada generación.
_DECL = [
 (r'<code>_soapSeguridadHTML</code>\s*/\s*<code>seguridadClinica</code>', 'la caja de seguridad clínica'),
 (r'<code>seguridadClinica</code>\s*/\s*<code>_soapSeguridadHTML</code>', 'la caja de seguridad clínica'),
 (r'<code>_soapSeguridadHTML</code>', 'la caja de seguridad clínica'),
 (r'<code>_protoSegFlags</code>\s*/\s*<code>seguridadClinica</code>', 'la seguridad clínica'),
 (r'<code>_protoSegFlags</code>', 'la seguridad clínica'),
 (r'<code>docs/[^<]+</code>\s*', ''),   # red de seguridad: si quedara alguna ruta de archivo, se quita
 (r'\s*\(PR #\d+\)', ''),
 (r',\s*PR #\d+', ''),
]
def _declutter(html):
    for pat,rep in _DECL: html=re.sub(pat,rep,html)
    return html

import html as _HH, statistics as _ST
def _ascii_to_table(code_html):
    """Convierte un bloque ``` con columnas alineadas por ESPACIOS (macrociclo, dosificación HSR,
    semáforo del dolor, timeline, criterios) en una TABLA HTML real → reflúye a tarjetas en celular.
    Devuelve None si el bloque no es claramente tabular (se deja como <pre>)."""
    txt=_HH.unescape(code_html).rstrip('\n')
    rows=[]
    for ln in txt.split('\n'):
        if not ln.strip(): continue
        if re.match(r'^\s', ln) and rows:            # línea envuelta → continúa la última celda
            rows[-1][-1]=(rows[-1][-1]+' '+ln.strip()).strip(); continue
        rows.append([c for c in re.split(r'\s{2,}', ln.strip())])
    if len(rows)<2: return None
    # Recupera filas donde "nombre + rango de semanas" se fundieron por 1 solo espacio
    # (p. ej. "M4 · Pliometría/agilidad mes 5–8"): separa la columna de semanas al final de la 1ª celda.
    _wk=re.compile(r'^(.+?\S)\s+(~?(?:sem|semanas?|mes(?:es)?|d[íi]as?)\s*~?\d[\d+–\-—~\.\s]*)$', re.I)
    for r in rows:
        if len(r)>=2:
            m=_wk.match(r[0])
            if m: r[0:1]=[m.group(1).strip(), m.group(2).strip()]
    cc=[len(r) for r in rows]
    if _ST.mode(cc)<2 or sum(1 for c in cc if c>=2) < 0.7*len(rows): return None
    ncol=max(cc)
    # Fila corta porque "semanas + objetivo" se fundieron en una celda: separa el rango de semanas inicial.
    _wk2=re.compile(r'^(~?(?:sem|semanas?|mes(?:es)?|d[íi]as?)\s*~?\d[\d+–\-—~\.\s]*?)\s+(\S.+)$', re.I)
    _dos2=re.compile(r'^(\d+(?:[–\-]\d+)?\s*[×x]\s*[\d–\-]+)\s+([\d–\-]+\s*RM)$', re.I)
    _sem2=re.compile(r'^(VERDE|AMARILLO|ROJO|ÁMBAR|AMBAR)\s+(\S.+)$', re.I)
    for r in rows:
        if len(r)<ncol:
            hit=False
            for i,c in enumerate(r):
                m=_wk2.match(c) or _dos2.match(c)
                if m: r[i:i+1]=[m.group(1).strip(), m.group(2).strip()]; hit=True; break
            if not hit and r:
                m=_sem2.match(r[0])
                if m: r[0:1]=[m.group(1).strip(), m.group(2).strip()]
    # Un MACROCICLO (todas las filas empiezan por "M1…M5 ·") recibe encabezado con etiquetas →
    # tarjetas etiquetadas en celular + fila de encabezado navy en escritorio.
    hdr=None
    if ncol in (3,4) and len(rows)>=3 and all(re.match(r'^M\d+\b', (r[0] if r else '')) for r in rows):
        hdr=['Mesociclo','Semanas','Objetivo','Carga / contenido'][:ncol]
    elif ncol==4 and len(rows)>=3 and sum(1 for r in rows if len(r)>=2 and re.match(r'^\d+(?:[–\-]\d+)?\s*[×x]\s*\d', r[1])) >= 0.6*len(rows):
        hdr=['Bloque','Series × reps','Intensidad','Notas']
    out=['<table class="bib-dtbl">']
    if hdr: out.append('<thead><tr>'+''.join('<th>'+_HH.escape(x)+'</th>' for x in hdr)+'</tr></thead>')
    out.append('<tbody>')
    for r in rows:
        cells=r+['']*(ncol-len(r))
        out.append('<tr>'+''.join('<td>'+_HH.escape(c)+'</td>' for c in cells)+'</tr>')
    out.append('</tbody></table>')
    return ''.join(out)
def _conv_pre(m):
    t=_ascii_to_table(m.group(1)); return t if t else m.group(0)

def _color_semaforo(html):
    """Colorea filas de tabla por su 1ª celda: VERDE/AMARILLO/ROJO (semáforo del dolor) y las de
    PELIGRO (contraindicación clave / banderas) en ROJO, para que la seguridad resalte de un vistazo."""
    def rep(m):
        first=re.sub(r'<[^>]+>','',m.group('first')).strip().upper()
        if first.startswith('VERDE'): cls=' class="sem-g"'
        elif first.startswith(('AMARILLO','AMBAR','ÁMBAR')): cls=' class="sem-a"'
        elif first.startswith('ROJO'): cls=' class="sem-r"'
        elif first.startswith(('CONTRAINDICAC','NUNCA','🛑','⛔','🚩')) or 'BANDERA ROJA' in first or 'BANDERAS ROJAS' in first: cls=' class="sem-r"'
        else: cls=''
        return '<tr'+cls+'><td'+m.group('rest')
    return re.sub(r'<tr><td(?P<rest>[^>]*>(?P<first>.*?)</td>)', rep, html, flags=re.S)

def _link_xrefs(html):
    """Convierte las referencias internas «§N» / «§N.M» en enlaces que saltan a esa sección."""
    mp={}
    for m in re.finditer(r'<h[1-6][^>]*\bid="([^"]+)"[^>]*>(.*?)</h[1-6]>', html, re.S):
        txt=re.sub(r'<[^>]+>','',m.group(2)).strip()
        mm=re.match(r'^(\d+(?:\.\d+)?)[\.\)]?\s', txt)
        if mm and mm.group(1) not in mp: mp[mm.group(1)]=m.group(1)
    if not mp: return html
    def rep(m):
        num=m.group(1)
        if num in mp:
            return '<a class="bib-xref" onclick="_bibScrollTo(\''+mp[num]+'\')">§'+num+'</a>'
        return m.group(0)
    return re.sub(r'§\s?(\d+(?:\.\d+)?)', rep, html)

def md2html(body):
    _MD.reset()
    html=_declutter(enrich(_MD.convert(_sep_lists(body))))
    html=re.sub(r'<pre><code>(.*?)</code></pre>', _conv_pre, html, flags=re.S)
    html=_add_table_labels(html)
    html=_color_semaforo(html)
    html=_link_xrefs(html)
    toc=[{'id':t['id'],'name':t['name']} for t in _MD.toc_tokens]
    return html, toc

def rename_area(t):
    n=norm(t)
    if n.startswith('parte 0b'):
        return '🛡️ Seguridad (agentes físicos / implantes)'
    return t

LIBS=[
 {'id':'ortopedia','titulo':'Ortopedia, traumatología y deporte','emoji':'🦴',
  'file':'biblioteca_rehab_ortopedia.md','skip':['parte 0 perfil']},
 {'id':'agentes','titulo':'Agentes físicos — indicaciones, contraindicaciones y equipos','emoji':'💠',
  'file':'biblioteca_agentes_fisicos.md','skip':[]},
 {'id':'msk','titulo':'Protocolos MSK / HSR (periodización)','emoji':'🏋️',
  'file':'biblioteca_protocolos.md','skip':['parte 3']},
 {'id':'derma','titulo':'Dermatofuncional (post-qx y estética)','emoji':'🧴',
  'file':'biblioteca_dermatofuncional.md','skip':[]},
]

out={'generado':str(datetime.date.today()),'bibliotecas':[]}
for L in LIBS:
    txt=open(f"{DOCS}/{L['file']}",encoding='utf-8').read()
    areas=split_areas(txt, skip_prefixes=L['skip'])
    render=[]
    for titulo,body in areas:
        _html,_toc=md2html(body)
        render.append({'titulo':rename_area(titulo),'toc':_toc,'html':_html})
    out['bibliotecas'].append({'id':L['id'],'titulo':L['titulo'],'emoji':L['emoji'],'areas':render})
    print(f"{L['id']:10} {len(render):2} áreas:")
    for a in render: print(f"   · {a['titulo'][:70]}  ({len(a['html'])} B)")

json.dump(out, open(OUT,'w',encoding='utf-8'), ensure_ascii=False, separators=(',',':'))
import os
print(f"\nWROTE {OUT}  {os.path.getsize(OUT)//1024} KB")
