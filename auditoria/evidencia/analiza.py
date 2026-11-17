import json, os
SP = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(os.path.join(SP,'exp_dafne.json')))
bm = d['expediente']['biomecanica']
ALGO = 'bio-2d-2026-11-14b'

def fnum(x):
    try: return float(x)
    except: return None

def aspect_ok(fuente, asp):
    if asp is None: return '?'
    # 0.56 video vertical 9:16, 0.75 foto 3:4, 1.77 horizontal
    if fuente in ('video','camara','mixta'):
        return 'ok' if 0.45 <= asp <= 0.9 else ('horiz' if asp>1.3 else 'raro')
    if fuente=='foto':
        return 'ok' if 0.6 <= asp <= 0.85 else 'raro'
    return '?'

print("="*90)
print("TABLA POR SESIÓN — expediente Dafne (ficticio) — %d sesiones" % len(bm))
print("="*90)
for i,s in enumerate(bm):
    t=s.get('tipo'); f=s.get('fuente'); fecha=s.get('fecha') or s.get('fechaHoraISO')
    cal=s.get('calidad') or {}
    av=cal.get('algoVersion') or (s.get('medidas',[{}])[0].get('traza',{}) if False else None)
    # algoVersion puede estar en calidad o en traza
    avs=set()
    if cal.get('algoVersion'): avs.add(cal['algoVersion'])
    for m in (s.get('medidas') or []):
        tr=m.get('traza') or {}
        if tr.get('algoVersion'): avs.add(tr['algoVersion'])
    sync=s.get('_estadoSync')
    elim=s.get('eliminado')
    print(f"\n[{i}] id={s.get('id')}")
    print(f"    tipo={t} fuente={f} fecha={fecha} sync={sync} elim={elim}")
    print(f"    algoVersion(es)={sorted(avs) or 'N/A'}  {'FLAG-ALGO' if avs and avs!={ALGO} else ''}")
    ft=cal.get('framesTotales'); fd=cal.get('framesDescartados')
    if ft:
        pct = 100*fd/ft if fd is not None else None
        pcts = f"{pct:.0f}%" if pct is not None else "n/a"
        print(f"    frames: tot={ft} descartados={fd} ({pcts})" + ('  FLAG-FRAMES' if (pct is not None and pct>10) else ''))
print("\n\n"+"="*90)
print("GONIOMETRÍA — por medida (grado vs ref, traza, visibilidad)")
print("="*90)
for i,s in enumerate(bm):
    if s.get('tipo')!='goniometria': continue
    print(f"\n[{i}] {s.get('id')}  fuente={s.get('fuente')} fecha={s.get('fecha')}")
    for m in (s.get('medidas') or []):
        g=fnum(m.get('grado')); ref=fnum(m.get('ref')); lim=m.get('lim')
        tr=m.get('traza') or {}; lm=tr.get('lmUsados') or {}
        vmin=min([fnum(p.get('v')) for p in lm.values() if isinstance(p,dict) and p.get('v') is not None] or [None]) if lm else None
        flags=[]
        if g is not None and ref is not None and g>ref+10: flags.append('>ref+10')
        if g is not None and g<0 and not m.get('defic') and not m.get('hiperext'): flags.append('NEGATIVO')
        if vmin is not None and vmin<0.5: flags.append('vis<0.5')
        if not tr: flags.append('SIN-TRAZA')
        asp=tr.get('aspect')
        print(f"    {m.get('key'):10s} {m.get('grupo')}/{m.get('mov')}/{m.get('lado'):4s} grado={g} ref={ref} norm={m.get('normTxt')} defic={m.get('defic')} hiperext={m.get('hiperext')} vis_min={vmin} aspect={asp} fuente={tr.get('fuente')} tSeg={tr.get('tSeg')}  {' '.join(flags) if flags else 'ok'}")
    # asimetría I/D por movimiento
    bymov={}
    for m in (s.get('medidas') or []):
        k=(m.get('grupo'),m.get('mov')); bymov.setdefault(k,{})[m.get('lado')]=fnum(m.get('grado'))
    for k,v in bymov.items():
        if 'izq' in v and 'der' in v and v['izq'] is not None and v['der'] is not None:
            dif=abs(v['izq']-v['der'])
            if dif>15: print(f"    ASIMETRÍA {k[0]}/{k[1]}: I={v['izq']} D={v['der']} dif={dif:.0f}°  FLAG-ASIM")
