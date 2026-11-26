#!/usr/bin/env python3
# Construye la REPLICA interactiva: copia de index.html con Firebase/red falsos
# y auto-boot con datos sintéticos. Reutiliza los componentes REALES de la app.
import re, shutil, os
ROOT='/home/user/Clinica-Fisio'
WORK=ROOT+'/scratchpad/audit/work'
REP=ROOT+'/scratchpad/audit/replica'
os.makedirs(REP, exist_ok=True)

html=open(ROOT+'/index.html',encoding='utf-8').read()

# 1) Quitar las 4 etiquetas <script src=gstatic ... firebasejs ...> (no hay red en la replica)
html=re.sub(r'\s*<script src="https://www\.gstatic\.com/firebasejs/[^"]+"></script>', '', html)

# 2) Insertar el stub de firebase ANTES del bloque que hace firebase.initializeApp.
stub=open(WORK+'/demo_firebase_stub.js',encoding='utf-8').read()
anchor='<script>\n  const firebaseConfig = {'
assert html.count(anchor)==1, 'anchor firebaseConfig no único: %d'%html.count(anchor)
html=html.replace(anchor, '<script>\n/* ===== DEMO STUB (replica offline, sin red/credenciales) ===== */\n'+stub+'\n</script>\n'+anchor, 1)

# 3) Insertar seed + auto-boot antes de </body>
seed=open(WORK+'/demo_seed.js',encoding='utf-8').read()
boot=('\n<script>\n/* ===== DEMO SEED + AUTO-BOOT ===== */\n'+seed+'\n'
      'window.addEventListener("load",function(){ setTimeout(function(){ try{ window.__demoBoot && window.__demoBoot(); }catch(e){ console.error(e); } }, 500); });\n'
      '</script>\n')
assert html.count('</body>')>=1
# insertar antes del ÚLTIMO </body>
idx=html.rfind('</body>')
html=html[:idx]+boot+html[idx:]

open(REP+'/index.html','w',encoding='utf-8').write(html)

# 4) Copiar los recursos same-origin que la app carga por fetch/script
for f in ['protocolos.json','medidor-biomecanico.js','manifest.webmanifest']:
    shutil.copy(ROOT+'/'+f, REP+'/'+f)

print('replica OK:', os.path.getsize(REP+'/index.html'), 'bytes index.html')
print('firebasejs refs restantes:', html.count('gstatic.com/firebasejs'))
print('stub presente:', '__DEMO_STUB__' in html, '| seed presente:', '__demoBoot' in html)
