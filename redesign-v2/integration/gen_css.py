#!/usr/bin/env python3
# Genera los assets servibles del reskin (self-contained, offline-safe):
#   · sinergia_v2.css  <- sinergia_v2.css.tpl  (emblema de marca incrustado)
#   · sinergia_v2.js   <- sinergia_v2.js.tpl   (logo oficial incrustado, enhancer a11y)
import base64, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(HERE + '/../..')
BRAND = ROOT + '/redesign-v2/brand'

def datauri(path, mime='image/png'):
    return 'data:' + mime + ';base64,' + base64.b64encode(open(path, 'rb').read()).decode()

# CSS (emblema pequeño, por si se usa en algún punto)
css = open(HERE + '/sinergia_v2.css.tpl', encoding='utf-8').read()
css = css.replace('__EMBLEMA_DATAURI__', datauri(BRAND + '/emblema_sm.png'))
assert '__EMBLEMA_DATAURI__' not in css
open(HERE + '/sinergia_v2.css', 'w', encoding='utf-8').write(css)

# JS (logo oficial + emblema incrustados)
js = open(HERE + '/sinergia_v2.js.tpl', encoding='utf-8').read()
js = js.replace('__LOGO_DATAURI__', datauri(BRAND + '/logo_login.png'))
js = js.replace('__EMBLEMA_DATAURI__', datauri(BRAND + '/emblema_sm.png'))
assert '__LOGO_DATAURI__' not in js and '__EMBLEMA_DATAURI__' not in js
open(HERE + '/sinergia_v2.js', 'w', encoding='utf-8').write(js)

print('sinergia_v2.css OK:', len(css), 'bytes | sinergia_v2.js OK:', len(js), 'bytes')
