#!/usr/bin/env python3
# Construye redesign/index.html = replica/index.html + overlay (CSS+JS) horneado.
import os, shutil, pathlib
ROOT="/home/user/Clinica-Fisio/scratchpad/audit"
WORK=ROOT+"/work"; REP=ROOT+"/replica"; OUT=ROOT+"/redesign"
pathlib.Path(OUT).mkdir(parents=True, exist_ok=True)
html=open(REP+"/index.html","r",encoding="utf-8").read()
css=open(WORK+"/rediseno.css","r",encoding="utf-8").read()
js=open(WORK+"/rediseno.js","r",encoding="utf-8").read()

style='\n<style id="rd-overlay">\n'+css+'\n</style>\n'
script='\n<script id="rd-enhancer">\n'+js+'\n</script>\n'

assert "</head>" in html and "</body>" in html, "marcadores no encontrados"
# OJO: </head> y </body> aparecen 2x (uno real y otro dentro de un string JS,
# el document.write del Aviso de Privacidad). El </head> REAL es el PRIMERO;
# el </body> REAL es el ÚLTIMO. Insertar en los reales, no en el string.
ih=html.index("</head>")            # primer </head> = el real (el del string viene después)
html=html[:ih]+style+html[ih:]
ib=html.rindex("</body>")           # último </body> = el real
html=html[:ib]+script+html[ib:]

open(OUT+"/index.html","w",encoding="utf-8").write(html)
# copiar assets hermanos
for f in ("protocolos.json","medidor-biomecanico.js","manifest.webmanifest","demo_firebase_stub.js","demo_seed.js"):
    src=REP+"/"+f
    if os.path.exists(src): shutil.copy2(src, OUT+"/"+f)
print("OK redesign/index.html", os.path.getsize(OUT+"/index.html"), "bytes")
