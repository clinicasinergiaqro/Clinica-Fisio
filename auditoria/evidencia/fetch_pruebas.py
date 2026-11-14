import os, json, sys
import requests

TOK = os.environ.get('CLAUDE_TOKEN','')
EXEC = "https://script.google.com/macros/s/AKfycbyM9yFDxmP-HWLyZg-v2-rfQXJlMyA_l0iozqYNkeIR-gKaZj3oEDhUrM2VBlGU0n3l/exec"
SP = os.path.dirname(os.path.abspath(__file__))

def call(payload):
    r = requests.post(EXEC, json=payload, timeout=120, allow_redirects=True)
    r.raise_for_status()
    return r.json()

if __name__ == '__main__':
    assert len(TOK) == 64, "token ausente"
    ping = call({'action':'claudePing','token':TOK})
    print("PING:", json.dumps({k:ping.get(k) for k in ('ok','totalPacientes','build')}))
    IDS = {
        'dafne':'p1781814958552',
        'vacio':'pc1f6be67-eb6b-44d4-a2a0-a897f834f2c9',
    }
    for name, pid in IDS.items():
        res = call({'action':'claudeGetExpedienteFull','token':TOK,'id':pid})
        ok = res.get('ok')
        exp = res.get('expediente') or {}
        bm = exp.get('biomecanica')
        print(f"{name} ({pid}): ok={ok} biomecanica={len(bm) if isinstance(bm,list) else bm}")
        out = os.path.join(SP, f"exp_{name}.json")
        with open(out,'w') as f:
            json.dump(res, f, ensure_ascii=False, indent=1)
        print("  guardado:", out)
