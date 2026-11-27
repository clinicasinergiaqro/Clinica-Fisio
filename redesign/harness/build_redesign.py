#!/usr/bin/env python3
# redesign/index.html = replica/index.html + overlay (CSS+JS) horneado.
# Overlay VERSIONADO en redesign/src. Salida efímera en scratchpad.
import os, shutil, pathlib
ROOT="/home/user/Clinica-Fisio"
SRC=ROOT+"/redesign/src"
REP=ROOT+"/scratchpad/audit/replica"
OUT=ROOT+"/scratchpad/audit/redesign"
pathlib.Path(OUT).mkdir(parents=True, exist_ok=True)
html=open(REP+"/index.html","r",encoding="utf-8").read()
css=open(SRC+"/rediseno.css","r",encoding="utf-8").read()
js=open(SRC+"/rediseno.js","r",encoding="utf-8").read()

style='\n<style id="rd-overlay">\n'+css+'\n</style>\n'
script='\n<script id="rd-enhancer">\n'+js+'\n</script>\n'

assert "</head>" in html and "</body>" in html, "marcadores no encontrados"
# OJO: </head> y </body> aparecen 2x (uno real y otro dentro de un string JS del
# document.write del Aviso de Privacidad). El </head> REAL es el PRIMERO; el
# </body> REAL es el ÚLTIMO.
ih=html.index("</head>")
html=html[:ih]+style+html[ih:]
ib=html.rindex("</body>")
html=html[:ib]+script+html[ib:]

open(OUT+"/index.html","w",encoding="utf-8").write(html)
for f in ("protocolos.json","medidor-biomecanico.js","manifest.webmanifest"):
    src=REP+"/"+f
    if os.path.exists(src): shutil.copy2(src, OUT+"/"+f)
print("OK redesign/index.html", os.path.getsize(OUT+"/index.html"), "bytes")
