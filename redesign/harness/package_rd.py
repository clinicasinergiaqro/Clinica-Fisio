#!/usr/bin/env python3
# Empaqueta los entregables del rediseño V1.1, con SCRUB de credenciales en la
# réplica interactiva. Fuentes versionadas en redesign/; salidas efímeras en
# scratchpad/audit/ENTREGA_RD.
import os, re, shutil, zipfile, subprocess, pathlib
ROOT='/home/user/Clinica-Fisio'
AUD=ROOT+'/scratchpad/audit'
SRC=ROOT+'/redesign/src'; HARN=ROOT+'/redesign/harness'; DOCS=ROOT+'/redesign/docs'
RD=AUD+'/redesign'; SHOTS=AUD+'/shots_rd'; OUT=AUD+'/ENTREGA_RD'
pathlib.Path(OUT).mkdir(parents=True, exist_ok=True)

REPL=[
  ('AKfycbyM9yFDxmP-HWLyZg-v2-rfQXJlMyA_l0iozqYNkeIR-gKaZj3oEDhUrM2VBlGU0n3l','REDACTED_APPS_SCRIPT_DEPLOY_ID'),
  ('AIzaSyAAOntyRH7ErmdzS_tzE2eMZRvp_2R74Ik','REDACTED_FIREBASE_API_KEY'),
  ('AIzaSyCLTS0tKqgRRL6EIw5nHqG7plyusXTfb4s','REDACTED_STAGING_API_KEY'),
  ('1:103504274288:web:f2c0fe06536374b05065b5','REDACTED_APP_ID'),
  ('1:659703740667:web:ead8a2bd25ca78dc01185e','REDACTED_STAGING_APP_ID'),
  ('103504274288','REDACTED_SENDER_ID'),('659703740667','REDACTED_STAGING_SENDER'),
  ('clinicasinergiaqro@gmail.com','clinica@ejemplo.com'),('lftaranda@gmail.com','supervisor@ejemplo.com'),
  ("_R('lftaranda','gmail.com'","_R('supervisor','ejemplo.com'"),
  ("_R('dafnend26','gmail.com'","_R('tera1','ejemplo.com'"),
  ("_R('gutierrezgarciazaray96','gmail.com'","_R('tera2','ejemplo.com'"),
  ("_R('camislerma26','gmail.com'","_R('tera3','ejemplo.com'"),
  ("_R('jriveare2000','hotmail.com'","_R('tera4','ejemplo.com'"),
  ("_R('dulcesalazar_1799','hotmail.com'","_R('tera5','ejemplo.com'"),
]
def scrub(t):
    for a,b in REPL: t=t.replace(a,b)
    return t

# 1) Réplica interactiva (redesign = app real + overlay), scrub de credenciales
REP=OUT+'/_replica'; shutil.rmtree(REP,ignore_errors=True); os.makedirs(REP)
open(REP+'/index.html','w',encoding='utf-8').write(scrub(open(RD+'/index.html',encoding='utf-8').read()))
for f in ('protocolos.json','medidor-biomecanico.js','manifest.webmanifest'):
    if os.path.exists(RD+'/'+f): shutil.copy2(RD+'/'+f, REP+'/'+f)
open(REP+'/_LEEME.txt','w',encoding='utf-8').write(
"PROTOTIPO REDISENO SINERGIA V1.1 (datos sinteticos, sin conexion real).\n"
"Abre index.html en Chrome o Safari. Arranca solo como supervisor DEMO.\n"
"Redimensiona la ventana para ver celular / tablet / escritorio.\n"
"Firebase y backend neutralizados; credenciales redactadas. No escribe en ninguna base.\n")
leak=subprocess.run(r"grep -rlE 'AIzaSy[A-Za-z0-9]|AKfycby|@gmail\.com|@hotmail\.com' "+REP,
                    shell=True,capture_output=True,text=True).stdout.strip()
print('REPLICA fugas:', leak or 'NINGUNA'); assert not leak, 'FUGA: '+leak

# 2) README del codigo fuente
open(OUT+'/_README_SOURCE.md','w',encoding='utf-8').write(
"""# Rediseno Sinergia V1.1 - codigo fuente (capa aditiva)

- src/rediseno.css, src/rediseno.js : overlay (reskin + mobile-first + paneles + fuerza + biomecanica + nuevo motivo + dx + maestro-detalle).
- harness/build_replica.py  : app real + stub Firebase + seed sintetico -> replica.
- harness/build_redesign.py : replica + overlay -> redesign/index.html.
- harness/demo_seed.js, harness/demo_firebase_stub.js : datos sinteticos + neutralizacion de backend.
- harness/package_rd.py : empaqueta y redacta credenciales.
- docs/ : cambios y pruebas.

Reconstruir: python3 harness/build_replica.py && python3 harness/build_redesign.py ; abrir redesign/index.html.
No toca produccion, expedientes ni rutas de persistencia. Rama claude/redesign-ux-ui-v1-1 (no fusionada).
""")

def zdir(zp, src, root):
    with zipfile.ZipFile(zp,'w',zipfile.ZIP_DEFLATED) as z:
        for r,_,fs in os.walk(src):
            for f in fs: fp=os.path.join(r,f); z.write(fp, os.path.join(root,os.path.relpath(fp,src)))
def zfiles(zp, pairs):
    with zipfile.ZipFile(zp,'w',zipfile.ZIP_DEFLATED) as z:
        for fp,arc in pairs:
            if os.path.exists(fp): z.write(fp,arc)

zdir(OUT+'/SINERGIA_Replica_Rediseno_V1.1_Interactiva.zip', REP, 'replica_rediseno_v1.1')
zdir(OUT+'/SINERGIA_Capturas_Rediseno_V1.1.zip', SHOTS, 'capturas_rediseno_v1.1')
code=[(SRC+'/rediseno.css','src/rediseno.css'),(SRC+'/rediseno.js','src/rediseno.js'),
      (HARN+'/build_replica.py','harness/build_replica.py'),(HARN+'/build_redesign.py','harness/build_redesign.py'),
      (HARN+'/demo_seed.js','harness/demo_seed.js'),(HARN+'/demo_firebase_stub.js','harness/demo_firebase_stub.js'),
      (HARN+'/package_rd.py','harness/package_rd.py'),
      (DOCS+'/SINERGIA_Cambios_y_Funcionalidades_V1.1.md','docs/SINERGIA_Cambios_y_Funcionalidades_V1.1.md'),
      (DOCS+'/SINERGIA_Pruebas_V1.1.md','docs/SINERGIA_Pruebas_V1.1.md'),
      (ROOT+'/SINERGIA_Contrato_Clinico_Compartido.md','SINERGIA_Contrato_Clinico_Compartido.md'),
      (OUT+'/_README_SOURCE.md','README.md')]
zfiles(OUT+'/SINERGIA_Rediseno_UX_UI_V1.1_Codigo.zip', code)
for d in ('SINERGIA_Cambios_y_Funcionalidades_V1.1.md','SINERGIA_Pruebas_V1.1.md'):
    shutil.copy2(DOCS+'/'+d, OUT+'/'+d)

shutil.rmtree(REP,ignore_errors=True)
print('--- ENTREGA_RD ---')
for f in sorted(os.listdir(OUT)):
    if f.startswith('_'): continue
    p=os.path.join(OUT,f); print(f'{os.path.getsize(p)/1e6:7.2f} MB  {f}')
