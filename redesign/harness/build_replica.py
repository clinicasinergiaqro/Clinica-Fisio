#!/usr/bin/env python3
# Construye la REPLICA interactiva: copia del index.html REAL con Firebase/red
# falsos (stub) y auto-boot con datos sintéticos. Reutiliza los componentes
# REALES de la app. Fuentes VERSIONADAS en redesign/harness (sobreviven al
# borrado del scratchpad). Salida en scratchpad (efímera, se regenera).
import re, shutil, os
ROOT='/home/user/Clinica-Fisio'
HARNESS=ROOT+'/redesign/harness'
OUT=ROOT+'/scratchpad/audit/replica'
os.makedirs(OUT, exist_ok=True)

html=open(ROOT+'/index.html',encoding='utf-8').read()

# 1) Quitar las <script src=gstatic ... firebasejs ...> (no hay red en la replica)
html=re.sub(r'\s*<script src="https://www\.gstatic\.com/firebasejs/[^"]+"></script>', '', html)

# 2) Stub de firebase ANTES del bloque que hace firebase.initializeApp.
stub=open(HARNESS+'/demo_firebase_stub.js',encoding='utf-8').read()
anchor='<script>\n  const firebaseConfig = {'
assert html.count(anchor)==1, 'anchor firebaseConfig no único: %d'%html.count(anchor)
html=html.replace(anchor, '<script>\n/* ===== DEMO STUB (replica offline, sin red/credenciales) ===== */\n'+stub+'\n</script>\n'+anchor, 1)

# 3) Seed + auto-boot antes del ÚLTIMO </body>
seed=open(HARNESS+'/demo_seed.js',encoding='utf-8').read()
boot=('\n<script>\n/* ===== DEMO SEED + AUTO-BOOT ===== */\n'+seed+'\n'
      'window.addEventListener("load",function(){ setTimeout(function(){ try{ window.__demoBoot && window.__demoBoot(); }catch(e){ console.error(e); } }, 500); });\n'
      '</script>\n')
idx=html.rfind('</body>')
assert idx!=-1
html=html[:idx]+boot+html[idx:]

open(OUT+'/index.html','w',encoding='utf-8').write(html)

# 4) Recursos same-origin que la app carga por fetch/script
for f in ['protocolos.json','medidor-biomecanico.js','manifest.webmanifest']:
    if os.path.exists(ROOT+'/'+f): shutil.copy(ROOT+'/'+f, OUT+'/'+f)

print('replica OK:', os.path.getsize(OUT+'/index.html'), 'bytes index.html')
print('firebasejs refs restantes:', html.count('gstatic.com/firebasejs'))
print('stub presente:', '__DEMO_STUB__' in html, '| seed presente:', '__demoBoot' in html)
