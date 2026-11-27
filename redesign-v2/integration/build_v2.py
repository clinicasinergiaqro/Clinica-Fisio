#!/usr/bin/env python3
# Hornea el reskin V2 (capa de presentación aditiva) sobre una REPLICA aislada
# de la app REAL. NO toca index.html de produccion. Salida efimera en scratchpad.
#   1) genera sinergia_v2.css (emblema incrustado)
#   2) construye la replica limpia (build_replica.py)  -> scratchpad/audit/replica
#   3) copia la replica a scratchpad/audit/replica_v2 e inyecta el <link> del reskin
#      JUSTO antes de </head> (se carga despues del <style> inline -> gana la cascada)
import os, shutil, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(HERE + '/../..')
REPLICA = ROOT + '/scratchpad/audit/replica'
OUT = ROOT + '/scratchpad/audit/replica_v2'

# 1) CSS
subprocess.run([sys.executable, HERE + '/gen_css.py'], check=True)

# 2) replica limpia
subprocess.run([sys.executable, ROOT + '/redesign/harness/build_replica.py'], check=True)

# 3) copiar replica -> replica_v2 + inyectar reskin
shutil.rmtree(OUT, ignore_errors=True)
shutil.copytree(REPLICA, OUT)
shutil.copy(HERE + '/sinergia_v2.css', OUT + '/sinergia_v2.css')
if os.path.exists(HERE + '/sinergia_v2.js'):
    shutil.copy(HERE + '/sinergia_v2.js', OUT + '/sinergia_v2.js')
# capa de FIDELIDAD (ChatGPT) — se carga DESPUES de la V2 (orden de cascada)
_fid = os.path.exists(HERE + '/sinergia_fidelidad.css')
if _fid:
    shutil.copy(HERE + '/sinergia_fidelidad.css', OUT + '/sinergia_fidelidad.css')
    if os.path.exists(HERE + '/sinergia_fidelidad.js'):
        shutil.copy(HERE + '/sinergia_fidelidad.js', OUT + '/sinergia_fidelidad.js')

html = open(OUT + '/index.html', encoding='utf-8').read()
inject = ('\n<!-- ===== SINERGIA V2 · RESKIN (capa de presentacion, aditiva) ===== -->\n'
          '<link rel="stylesheet" href="sinergia_v2.css">\n')
if os.path.exists(HERE + '/sinergia_v2.js'):
    inject += '<script src="sinergia_v2.js" defer></script>\n'
if _fid:
    inject += ('<!-- ===== SINERGIA FIDELIDAD (ChatGPT) · DESPUES de la V2 ===== -->\n'
               '<link rel="stylesheet" href="sinergia_fidelidad.css">\n')
    if os.path.exists(HERE + '/sinergia_fidelidad.js'):
        inject += '<script src="sinergia_fidelidad.js" defer></script>\n'
i = html.find('</head>')
assert i != -1, 'no se encontro </head>'
html = html[:i] + inject + html[i:]
open(OUT + '/index.html', 'w', encoding='utf-8').write(html)

print('replica_v2 OK:', os.path.getsize(OUT + '/index.html'), 'bytes')
print('v2 link:', 'sinergia_v2.css' in html, '| fidelidad link:', 'sinergia_fidelidad.css' in html)
