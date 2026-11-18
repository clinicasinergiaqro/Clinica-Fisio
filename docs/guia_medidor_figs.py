# -*- coding: utf-8 -*-
# Esquemas (vista de elevación) de cómo colocar al paciente y la cámara para cada prueba.
import math
BODY='#33415c'; NAVY='#1B3A6B'; GOLD='#C8A24B'; GRAY='#8893a6'; TABLE='#cdd8e8'; RED='#C0392B'

def L(x1,y1,x2,y2,w=6,c=BODY):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{c}" stroke-width="{w}" stroke-linecap="round"/>'
def HEAD(cx,cy,r=8.5,c=BODY):
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#e7edf6" stroke="{c}" stroke-width="3.5"/>'
def JD(x,y,r=3.4,c=NAVY):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}"/>'
def TXT(x,y,t,s=8.5,c=GRAY,anchor='middle',w='400'):
    return f'<text x="{x}" y="{y}" font-size="{s}" fill="{c}" text-anchor="{anchor}" font-weight="{w}">{t}</text>'

def ARC(cx,cy,r,a0,a1,c=GOLD,w=3,arrow=True):
    x0=cx+r*math.cos(math.radians(a0)); y0=cy+r*math.sin(math.radians(a0))
    x1=cx+r*math.cos(math.radians(a1)); y1=cy+r*math.sin(math.radians(a1))
    large=1 if abs(a1-a0)>180 else 0; sweep=1 if a1>a0 else 0
    s=f'<path d="M {x0:.1f} {y0:.1f} A {r} {r} 0 {large} {sweep} {x1:.1f} {y1:.1f}" fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round"/>'
    if arrow:
        tang=math.radians(a1+(90 if sweep else -90)); tx,ty=math.cos(tang),math.sin(tang); nx,ny=-ty,tx
        s+=f'<polygon points="{x1:.1f},{y1:.1f} {x1-tx*8+nx*4:.1f},{y1-ty*8+ny*4:.1f} {x1-tx*8-nx*4:.1f},{y1-ty*8-ny*4:.1f}" fill="{c}"/>'
    return s

def CAM(cx,cy,tx,ty,label='',lbl='below'):
    s=(f'<rect x="{cx-13}" y="{cy-8}" width="26" height="16" rx="3.5" fill="{NAVY}"/>'
       f'<rect x="{cx-10}" y="{cy-12}" width="7" height="5" rx="1.5" fill="{NAVY}"/>'
       f'<circle cx="{cx}" cy="{cy}" r="5" fill="#cfe0ff"/><circle cx="{cx}" cy="{cy}" r="2.4" fill="{NAVY}"/>')
    ang=math.atan2(ty-cy,tx-cx); ux,uy=math.cos(ang),math.sin(ang)
    s+=f'<line x1="{cx+ux*15:.0f}" y1="{cy+uy*15:.0f}" x2="{tx-ux*7:.0f}" y2="{ty-uy*7:.0f}" stroke="{NAVY}" stroke-width="1.5" stroke-dasharray="4 3" opacity=".65"/>'
    if label:
        ly = cy+21 if lbl=='below' else cy-16
        s+=TXT(cx,ly,label,8.5,NAVY,'middle','700')
    return s

def SC(inner, w=190, h=150, floor=None, cap=''):
    s=[f'<svg viewBox="0 0 {w} {h}" style="width:100%;max-width:{w}px;height:auto">',
       f'<rect x="1" y="1" width="{w-2}" height="{h-2}" rx="10" fill="#F7F9FC" stroke="#e5e9f0"/>']
    if floor is not None: s.append(f'<line x1="10" y1="{floor}" x2="{w-10}" y2="{floor}" stroke="#d3dae6" stroke-width="2.5"/>')
    s.append(inner)
    if cap: s.append(TXT(w/2,h-8,cap,8.5,GRAY))
    s.append('</svg>'); return ''.join(s)

def TABLE_(x,y,wd=118,th=9):  # camilla
    return (f'<rect x="{x}" y="{y}" width="{wd}" height="{th}" rx="3" fill="{TABLE}"/>'
            f'<line x1="{x+10}" y1="{y+th}" x2="{x+10}" y2="{y+th+14}" stroke="{TABLE}" stroke-width="4"/>'
            f'<line x1="{x+wd-10}" y1="{y+th}" x2="{x+wd-10}" y2="{y+th+14}" stroke="{TABLE}" stroke-width="4"/>')

# ───────── Escenas ─────────
def sc_codo():
    sh=(66,40); el=(66,66); wr=(84,52); hip=(66,86)
    g=(HEAD(66,26)+L(*sh,*hip)+L(*hip,60,116)+L(*hip,72,116)
       +L(*sh,*el,7)+L(*el,*wr,7)+JD(*sh)+JD(*el)+JD(*wr)
       +ARC(el[0],el[1],17,90,-18)+CAM(158,104,el[0],el[1],'al costado'))
    return SC(g, floor=122, cap='De pie o sentado · perfil · 2–3 m')

def sc_muneca():
    el=(44,70); wr=(96,70); ha=(120,56)
    g=(TABLE_(30,80)+L(*el,*wr,8)+L(*wr,*ha,6)+JD(*el)+JD(*wr)+JD(*ha)
       +TXT(44,64,'codo',7.5,GRAY)+ARC(wr[0],wr[1],15,0,-62)
       +CAM(150,108,wr[0],wr[1],'al costado'))
    return SC(g, floor=None, cap='Sentado · antebrazo apoyado · mano libre')

def sc_cadera_sup():
    hip=(96,72); kn=(70,52); an=(60,68); sh=(150,72)
    g=(TABLE_(40,84)+L(*sh,*hip,8)+HEAD(162,72,8)
       +L(*hip,*kn,8)+L(*kn,*an,7)+JD(*hip)+JD(*kn)
       +ARC(hip[0],hip[1],22,180,232)+CAM(48,110,hip[0],hip[1],'al costado'))
    return SC(g, floor=None, cap='Boca ARRIBA (supino) · rodilla al pecho')

def sc_cadera_pro():
    hip=(96,76); kn=(126,58); an=(140,72); sh=(44,76)
    g=(TABLE_(34,84)+L(*sh,*hip,8)+HEAD(34,72,8)
       +L(*hip,*kn,8)+L(*kn,*an,7)+JD(*hip)+JD(*kn)
       +ARC(hip[0],hip[1],22,0,-46)+CAM(150,110,hip[0],hip[1],'al costado'))
    return SC(g, floor=None, cap='Boca ABAJO (prono) · levanta el muslo')

def sc_rodilla():
    hip=(54,74); kn=(96,74); an=(120,52)
    g=(TABLE_(30,86)+L(40,74,*hip,8)+HEAD(32,70,8)
       +L(*hip,*kn,8)+L(*kn,*an,7)+JD(*hip)+JD(*kn)+JD(*an)
       +ARC(kn[0],kn[1],20,0,-54)+CAM(150,112,kn[0],kn[1],'al costado'))
    return SC(g, floor=None, cap='En camilla · talón hacia el glúteo')

def sc_tobillo():
    kn=(56,66); an=(104,66); toe=(124,54); heel=(104,78)
    g=(TABLE_(26,74)+L(36,66,*kn,8)+L(*kn,*an,8)+JD(*kn)+JD(*an)
       +L(*an,*toe,6)+L(*an,*heel,5)+ARC(an[0],an[1],16,0,-48)
       +CAM(150,110,an[0],an[1],'al costado del pie'))
    return SC(g, floor=None, cap='Supino · punta hacia la espinilla / abajo')

def sc_hombro_flex():
    sh=(70,40); el=(92,58); wr=(108,72); hip=(70,88)
    g=(HEAD(70,26)+L(*sh,*hip)+L(*hip,64,118)+L(*hip,76,118)
       +L(*sh,*el,7)+L(*el,*wr,7)+JD(*sh)+JD(*el)
       +ARC(sh[0],sh[1],24,90,8)+CAM(158,106,sh[0],sh[1],'al costado'))
    return SC(g, floor=120, cap='De pie · perfil · sube el brazo al frente')

def sc_hombro_abd():
    sh=(96,40); el=(120,52); wr=(138,62); hip=(96,86)
    g=(HEAD(96,25)+L(*sh,*hip)+L(*hip,88,112)+L(*hip,104,112)
       +L(*sh,*el,7)+L(*el,*wr,7)+JD(*sh)+JD(*el)
       +ARC(sh[0],sh[1],24,90,22)+CAM(96,138,sh[0],sh[1]+6,'','above'))
    return SC(g, h=158, floor=116, cap='De FRENTE · sube el brazo de lado')

def sc_cuello():
    hd=(104,28); neck=(96,42); hip=(96,88)
    g=(HEAD(hd[0],hd[1])+L(*neck,*hip)+L(*hip,88,112)+L(*hip,104,112)
       +L(*neck,76,56)+L(*neck,116,56)+JD(*neck)
       +ARC(neck[0],neck[1]-2,20,-90,-40)+CAM(96,138,neck[0],neck[1],'','above'))
    return SC(g, h=158, floor=116, cap='De FRENTE · inclina la cabeza al hombro')

def sc_sentadilla():
    sh=(96,44); hip=(96,72); knL=(80,92); knR=(112,92); anL=(82,112); anR=(110,112)
    g=(HEAD(96,30)+L(*sh,*hip)
       +L(*hip,*knL,7)+L(*knL,*anL,7)+L(*hip,*knR,7)+L(*knR,*anR,7)
       +L(*sh,78,58,6)+L(*sh,114,58,6)+JD(*knL)+JD(*knR)
       +f'<line x1="{knL[0]}" y1="{knL[1]}" x2="{knR[0]}" y2="{knR[1]}" stroke="{GOLD}" stroke-width="2" stroke-dasharray="3 2"/>'
       +TXT(140,92,'valgo?',7.5,GOLD,'middle','700')+CAM(96,140,96,66,'','above'))
    return SC(g, h=160, floor=116, cap='De FRENTE · cuerpo completo · 3–5 sentadillas')

def sc_marcha():
    # dos siluetas caminando de perfil + flecha de trayectoria
    def walker(x,dx):
        sh=(x,44); hip=(x,76)
        return (HEAD(x,30)+L(*sh,*hip)+L(*hip,x-10+dx,112)+L(*hip,x+12+dx,112)
                +L(*sh,x+10,60,5)+L(*sh,x-8,60,5)+JD(*hip))
    g=(walker(58,-6)+walker(118,8)
       +f'<line x1="30" y1="128" x2="158" y2="128" stroke="{GOLD}" stroke-width="2.5"/>'
       +f'<polygon points="164,128 156,124 156,132" fill="{GOLD}"/>'
       +CAM(150,100,118,76,'al costado'))
    return SC(g, floor=120, cap='De PERFIL · cuerpo completo · 10–15 pasos')

def sc_plano(view):
    # top-view mini para explicar de-lado vs de-frente
    w,h=150,96; px,py=64,52; r=14
    s=[f'<svg viewBox="0 0 {w} {h}" style="width:{w}px;height:{h}px">',
       f'<rect x="2" y="2" width="{w-4}" height="{h-4}" rx="9" fill="#F7F9FC" stroke="#e5e9f0"/>',
       TXT(w-7,h-7,'vista desde arriba',7.5,'#9aa4b5','end'),
       f'<circle cx="{px}" cy="{py}" r="{r}" fill="#dfe8f6" stroke="{NAVY}" stroke-width="1.5"/>',
       TXT(px,py+4,'🧍',12),
       f'<polygon points="{px},{py-r-6} {px-5},{py-r+1} {px+5},{py-r+1}" fill="{NAVY}"/>']
    if view=='lado':
        s.append(f'<line x1="{px}" y1="{py-r-12}" x2="{px}" y2="{py+r+12}" stroke="{GOLD}" stroke-width="2.4"/>')
        s.append(CAM(w-28,py,px+r,py,'al costado'))
    else:
        s.append(f'<line x1="{px-r-12}" y1="{py}" x2="{px+r+12}" y2="{py}" stroke="{GOLD}" stroke-width="2.4"/>')
        s.append(CAM(px,22,px,py-r,'enfrente'))
    s.append('</svg>'); return ''.join(s)

ALL=[('codo',sc_codo),('muneca',sc_muneca),('cadera_sup',sc_cadera_sup),('cadera_pro',sc_cadera_pro),
     ('rodilla',sc_rodilla),('tobillo',sc_tobillo),('hombro_flex',sc_hombro_flex),('hombro_abd',sc_hombro_abd),
     ('cuello',sc_cuello),('sentadilla',sc_sentadilla),('marcha',sc_marcha)]

if __name__=='__main__':
    cells=''.join(f'<div style="display:inline-block;width:200px;margin:6px;text-align:center;vertical-align:top">'
                  f'<div style="font:700 11px sans-serif;color:{NAVY}">{n}</div>{f()}</div>' for n,f in ALL)
    cells+=f'<div style="display:inline-block;margin:6px">{sc_plano("lado")}{sc_plano("frente")}</div>'
    open('contact.html','w').write(f'<!doctype html><meta charset=utf8><body style="background:#fff">{cells}</body>')
    print('contact ok')
