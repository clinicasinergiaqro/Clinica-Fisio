#!/usr/bin/env python3
# Genera sinergia_v2.css desde la plantilla + emblema de marca incrustado (base64).
# El CSS resultante es self-contained (no depende de archivos externos; offline-safe).
import base64, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(HERE + '/../..')
tpl = open(HERE + '/sinergia_v2.css.tpl', encoding='utf-8').read()
emb = base64.b64encode(open(ROOT + '/redesign-v2/brand/emblema_sm.png', 'rb').read()).decode()
datauri = 'data:image/png;base64,' + emb
css = tpl.replace('__EMBLEMA_DATAURI__', datauri)
assert '__EMBLEMA_DATAURI__' not in css, 'placeholder sin sustituir'
open(HERE + '/sinergia_v2.css', 'w', encoding='utf-8').write(css)
print('sinergia_v2.css OK:', len(css), 'bytes (emblema', len(emb), 'b64 chars)')
