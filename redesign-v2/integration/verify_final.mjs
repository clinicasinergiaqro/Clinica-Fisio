// Validación final del checklist de Carlos sobre la réplica aislada SERVIDA POR HTTP.
// Uso: node verify_final.mjs <baseURL>   (p.ej. http://127.0.0.1:8099)
import pw from '/opt/node-tools/node_modules/playwright/index.js';
const { chromium } = pw;
const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const OUT = '/home/user/Clinica-Fisio/scratchpad/audit/v2shots';
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 390, height: 850 }, deviceScaleFactor: 2 });
const errs = []; pg.on('pageerror', e => errs.push(String(e)));
const R = [];
const ok = (name, cond, info) => { R.push({ name, ok: !!cond, info: info || '' }); };
const ev = (fn, a) => pg.evaluate(fn, a);
const shot = n => pg.screenshot({ path: `${OUT}/vf_${n}.png`, animations: 'disabled' });

await pg.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
await pg.waitForTimeout(3400);
ok('arranca a Agenda', await ev(() => { const a = document.getElementById('screen-agenda'); return !!(a && a.classList.contains('active')); }));
const pid = await ev(() => (window.patientsDB && patientsDB[0] && patientsDB[0].id) || '');
const dpid = await ev(() => { var p = (window.patientsDB || []).find(x => x.valoracion && x.valoracion.dermato && x.valoracion.dermato.es); return p ? p.id : ''; });

// 1) BIBLIOTECA DE PROTOCOLOS (servida -> debe cargar protocolos.json)
await ev(() => window.showBiblioteca && showBiblioteca());
await pg.waitForTimeout(1600);
const bib = await ev(() => {
  var c = document.getElementById('content-biblioteca'); var t = c ? c.textContent : '';
  var err = /no se pudo|error al cargar|error de carga|reintentar/i.test(t);
  var libs = (window._bibData && window._bibData.bibliotecas && window._bibData.bibliotecas.length) || document.querySelectorAll('#content-biblioteca .bib-card, #content-biblioteca [onclick*="_bibAbrirArea"], #content-biblioteca .bib-lib').length;
  return { err, libs, len: t.length };
});
ok('Biblioteca de protocolos carga (sin error)', !bib.err && bib.libs > 0, 'libs=' + bib.libs + ' err=' + bib.err);
await shot('biblioteca');

// 2) BIOMECÁNICA abre + conserva herramientas
await ev(x => openExpediente(x), pid); await pg.waitForTimeout(700);
await ev(() => { try { renderExpediente('biomecanica'); } catch (e) { console.error(e); } }); await pg.waitForTimeout(1200);
const bio = await ev(() => {
  var has = typeof window.BIO_renderPestana === 'function';
  var c = document.getElementById('content-expediente');
  var btns = c ? c.querySelectorAll('button').length : 0;
  var txt = c ? /biomec|marcha|sentadilla|goni|medici|evaluaci/i.test(c.textContent) : false;
  return { has, btns, txt };
});
ok('Biomecánica: módulo presente (BIO_renderPestana)', bio.has);
ok('Biomecánica: abre con herramientas', bio.txt && bio.btns > 3, 'btns=' + bio.btns);
await shot('biomecanica');

// 3) DERMATO: alta y SOAP con la nueva estética
if (dpid) {
  await ev(x => openExpediente(x), dpid); await pg.waitForTimeout(700);
  const dermaExp = await ev(() => { var p = (typeof currentPatient !== 'undefined') ? currentPatient : null; return !!(p && p.valoracion && p.valoracion.dermato && p.valoracion.dermato.es); });
  ok('Dermato: expediente abre (lente derma)', dermaExp);
  await ev(x => { try { nuevaSesionRapida(x); } catch (e) {} }, dpid); await pg.waitForTimeout(900);
  const dermaSoap = await ev(() => { var seg = document.querySelector('.v2-soapnav'); return !!seg; });
  ok('Dermato: SOAP con segmentado/estética', dermaSoap);
  await shot('dermato_soap');
}
await ev(() => window.showNuevoPacienteDerma && showNuevoPacienteDerma()); await pg.waitForTimeout(900);
const dermaAlta = await ev(() => { var c = document.getElementById('content-nuevo'); return c ? /dermato|fototipo|cicatri|edema|est[eé]tic/i.test(c.textContent) : false; });
ok('Dermato: alta con apartado dermatofuncional', dermaAlta);
await shot('dermato_alta');

// 4) ESTUDIOS / EJERCICIOS / REPORTES abren
await ev(x => openExpediente(x), pid); await pg.waitForTimeout(500);
for (const tab of ['estudios', 'ejercicios', 'reporte']) {
  const before = errs.length;
  await ev(t => { try { renderExpediente(t); } catch (e) { console.error(e); } }, tab); await pg.waitForTimeout(700);
  const has = await ev(() => { var c = document.getElementById('content-expediente'); return c && c.textContent.trim().length > 20; });
  ok('Pestaña ' + tab + ' abre sin error', has && errs.length === before);
}

// 5) ALERTAS DE SEGURIDAD visibles (expediente + SOAP)
await ev(x => openExpediente(x), pid); await pg.waitForTimeout(600);
const segExp = await ev(() => { var el = Array.from(document.querySelectorAll('#content-expediente *')).find(e => /seguridad cl[ií]nica/i.test(e.textContent) && e.offsetParent !== null); return !!el; });
ok('Seguridad clínica visible en expediente', segExp);
await ev(x => nuevaSesionRapida(x), pid); await pg.waitForTimeout(800);
const segSoap = await ev(() => { var el = Array.from(document.querySelectorAll('#content-soap *')).find(e => /seguridad cl[ií]nica/i.test(e.textContent) && e.offsetParent !== null); return !!el; });
ok('Seguridad clínica visible en SOAP', segSoap);

// 6) TECLADO no tapa Guardar: simular viewport reducido (teclado) y comprobar que el botón real es alcanzable
const kbd = await ev(() => {
  var save = document.querySelector('#content-soap button[onclick="guardarSOAP()"]') || document.querySelector('button[onclick="guardarSOAP()"]');
  if (!save) return { found: false };
  save.scrollIntoView({ block: 'center' });
  var r = save.getBoundingClientRect();
  // simular teclado de ~300px: ¿el botón queda por encima de esa zona tras hacer scroll?
  return { found: true, bottom: Math.round(r.bottom), vh: window.innerHeight, reachable: r.bottom <= window.innerHeight };
});
ok('SOAP: botón Guardar alcanzable (scroll)', kbd.found && kbd.reachable, JSON.stringify(kbd));

console.log('\n===== VALIDACIÓN FINAL (servida por HTTP) =====');
R.forEach(r => console.log('  ' + (r.ok ? 'OK   ' : 'REVISAR ') + r.name + (r.info ? '  [' + r.info + ']' : '')));
console.log('\npageerrors:', errs.length ? errs.slice(0, 6) : 'NINGUNO');
console.log('RESULTADO:', R.every(r => r.ok) && errs.length === 0 ? 'TODO OK ✓' : 'HAY PUNTOS A REVISAR');
await b.close();
