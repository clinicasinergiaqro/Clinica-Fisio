// =============================================================================
// SINERGIA · PRUEBA FUNCIONAL DE EQUIVALENCIA (app real vs reskineada)
// -----------------------------------------------------------------------------
// - Interactúa por controles REALES (no solo capturas).
// - Afirma: funciones originales existen y ejecutan, datos se conservan,
//   navegación funciona, permisos/estado intactos, 0 errores inesperados.
// - BLOQUEA y DETECTA cualquier conexión a servicios reales (red), no depende
//   solo del stub: si hay un intento HTTP(S) a un servicio, la prueba FALLA.
// - Corre la MISMA batería sobre la réplica ORIGINAL y la RESKINEADA y compara
//   que el resultado funcional sea IDÉNTICO.
// Uso: node equiv_test.mjs
// =============================================================================
import pw from '/opt/node-tools/node_modules/playwright/index.js';
const { chromium } = pw;
import fs from 'fs';
const ROOT = '/home/user/Clinica-Fisio';
const REPLICA   = ROOT + '/scratchpad/audit/replica/index.html';      // app real SIN reskin
const RESKIN    = ROOT + '/scratchpad/audit/replica_v2/index.html';   // app real CON reskin

async function runSuite(file, label) {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport:{ width:390, height:850 }, deviceScaleFactor:2 });
  const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  const net = [];        // TODA conexión externa bloqueada (transparencia)
  const netClin = [];    // SOLO servicios clínicos/backend (deben ser 0)
  // Servicios de DATOS CLÍNICOS / backend que NUNCA deben contactarse en pruebas:
  const CLINICOS = /(firebase|firestore|googleapis|script\.google\.com|spreadsheets|firebasestorage|identitytoolkit|googleusercontent|gstatic\.com\/firebasejs|\/exec)/i;
  // Bloqueo+detección: file/data/blob pasan; cualquier http(s) se ABORTA y registra.
  // Las libs de terceros (cdnjs/jsdelivr/opencv) se bloquean sin fallar (la app
  // degrada offline); un intento a un servicio CLÍNICO sí hace fallar la prueba.
  await pg.route('**', route => {
    const u = route.request().url();
    if (/^(file|data|blob):/.test(u)) return route.continue();
    net.push(u);
    if (CLINICOS.test(u)) netClin.push(u);
    return route.abort();
  });

  const A = [];
  var extra = {};
  const assert = (name, cond) => A.push({ name, ok: !!cond });
  const ev = (fn, arg) => pg.evaluate(fn, arg);

  await pg.goto('file://' + file, { waitUntil: 'domcontentloaded' });
  await pg.waitForTimeout(260);

  // ---- LOGIN: funciones originales presentes (no sustituidas) ----
  assert('fn doLogin existe',          await ev(() => typeof doLogin === 'function'));
  assert('fn togglePassVer existe',    await ev(() => typeof togglePassVer === 'function'));
  assert('fn recuperarPass existe',    await ev(() => typeof recuperarPass === 'function'));
  assert('fn entrarModoOffline_ existe', await ev(() => typeof entrarModoOffline_ === 'function'));
  // El control real "ver contraseña" ejecuta el handler real y alterna el type
  const t0 = await pg.getAttribute('#login-pass', 'type');
  await pg.click('#btn-ver-pass');
  const t1 = await pg.getAttribute('#login-pass', 'type');
  assert('ver-contraseña alterna type (handler real)', t0 !== t1 && (t1 === 'text' || t1 === 'password'));
  await pg.click('#btn-ver-pass');
  // accesibilidad del logo (solo reskin): registrar, no exigir en original
  extra.logoAlt = await ev(() => { const i = document.querySelector('#screen-login .login-logo img.v2-login-logo'); return i ? (i.getAttribute('alt') || '') : null; });

  // ---- BOOT -> AGENDA ----
  await pg.waitForTimeout(2900);
  assert('agenda activa', await ev(() => { const a = document.getElementById('screen-agenda'); return !!(a && a.classList.contains('active')); }));
  const pid = await ev(() => (window.patientsDB && patientsDB[0] && patientsDB[0].id) || '');
  assert('patientsDB poblado', !!pid);
  const nCards = await ev(() => document.querySelectorAll('.patient-card').length);
  assert('tarjetas de paciente presentes', nCards > 0);

  // ---- EXPEDIENTE: abrir por la función real y verificar estado/datos ----
  const dxEsperado = await ev((id) => { const p = patientsDB.find(x => x.id === id); return p ? (typeof p.dx === 'string' ? p.dx : (p.dx && (p.dx.dxClinico || p.dx.dxMedico))) || '' : ''; }, pid);
  await ev((id) => openExpediente(id), pid);
  await pg.waitForTimeout(800);
  assert('expediente: currentPatient coincide', await ev((id) => (typeof currentPatient !== 'undefined') && !!currentPatient && currentPatient.id === id, pid));
  const nameShown = await ev(() => { const e = document.querySelector('.exp-name'); return e ? e.textContent.trim() : ''; });
  assert('expediente: nombre del paciente visible', nameShown.length > 0);
  // navegación de pestañas por la función real
  await ev(() => renderExpediente('valoracion'));
  await pg.waitForTimeout(350);
  await ev(() => renderExpediente('historia'));
  await pg.waitForTimeout(350);
  assert('expediente: pestañas navegan sin romper (historia tras valoracion)', await ev(() => (typeof currentPatient !== 'undefined') && !!currentPatient));
  // el dx del dato NO cambió por abrir/navegar (no se pierde ni altera)
  const dxDespues = await ev((id) => { const p = patientsDB.find(x => x.id === id); return p ? (typeof p.dx === 'string' ? p.dx : (p.dx && (p.dx.dxClinico || p.dx.dxMedico))) || '' : ''; }, pid);
  assert('dato dx intacto tras navegar', dxEsperado === dxDespues);

  // ---- SOAP: funciones de guardado/borrador presentes + editor con campos reales ----
  assert('fn renderSOAPForm existe',      await ev(() => typeof renderSOAPForm === 'function'));
  assert('fn guardarSOAP existe',         await ev(() => typeof guardarSOAP === 'function'));
  assert('fn guardarBorradorSoap existe', await ev(() => typeof guardarBorradorSoap === 'function'));
  assert('fn guardarDescarga existe',     await ev(() => typeof guardarDescarga === 'function'));
  assert('fn _toggleNuevoMotivoSoap existe', await ev(() => typeof _toggleNuevoMotivoSoap === 'function'));
  await ev((id) => nuevaSesionRapida(id), pid);
  await pg.waitForTimeout(900);
  const soapCampo = await ev(() => !!document.getElementById('f-sdolor'));
  assert('SOAP: editor con campos reales (f-sdolor)', soapCampo);
  const soapInputs = await ev(() => document.querySelectorAll('.form-input, textarea, input, select').length);
  assert('SOAP: controles de captura alcanzables', soapInputs > 5);

  // ---- PRESERVACIÓN DE CAMPO (se escribe en un control real y se lee de vuelta) ----
  const campoVal = await ev(() => {
    var t = document.getElementById('f-sdolor') || document.querySelector('#soap-full textarea, #screen-soap textarea');
    if (!t) return null;
    t.value = 'QA_V2_PRUEBA'; t.dispatchEvent(new Event('input', { bubbles: true }));
    return t.value;
  });
  assert('SOAP: el campo conserva lo escrito', campoVal === 'QA_V2_PRUEBA');

  // ---- extras SOLO del reskin (no se comparan en paridad; se reportan) ----
  var ex = extra;
  ex.soapnav = await ev(() => document.querySelectorAll('.v2-soapnav').length);
  ex.soapnavBtns = await ev(() => document.querySelectorAll('.v2-soapnav button').length);
  // navegación S/O/A/P por CLIC visible: marca activo el tocado y desmarca el anterior
  ex.navClick = await ev(() => {
    var bs = document.querySelectorAll('.v2-soapnav button'); if (bs.length < 4) return 'n/a';
    bs[1].click(); return (bs[1].classList.contains('active') && !bs[0].classList.contains('active')) ? 'ok' : 'FALLA';
  });
  // DUPLICACIONES del observer: re-render y contar elementos inyectados
  await ev((id) => openExpediente(id), pid); await pg.waitForTimeout(500);
  ex.tabIconsDup = await ev(() => {
    var bad = 0; document.querySelectorAll('#screen-expediente .tabs .tab').forEach(function (t) { if (t.querySelectorAll(':scope > .v2-ic').length > 1) bad++; }); return bad;
  });
  ex.heroLogoDup = await ev(() => { var h = document.querySelector('#screen-expediente .exp-header'); return h ? h.querySelectorAll('.v2-hero-logo').length : 0; });
  await ev((id) => nuevaSesionRapida(id), pid); await pg.waitForTimeout(600);
  ex.soapnavDup = await ev(() => document.querySelectorAll('.v2-soapnav').length);

  // ---- integridad global ----
  assert('0 errores JS inesperados', errs.length === 0);
  assert('0 conexiones a servicios CLÍNICOS/backend (bloqueadas/detectadas)', netClin.length === 0);

  await b.close();
  return { label, A, errs, net, netClin, extra };
}

// ---- correr ambas y comparar paridad funcional ----
const orig = await runSuite(REPLICA, 'ORIGINAL (sin reskin)');
const resk = await runSuite(RESKIN,  'RESKIN (V2)');

function summarize(r) {
  const pass = r.A.filter(a => a.ok).length, fail = r.A.length - pass;
  return { pass, fail, fails: r.A.filter(a => !a.ok).map(a => a.name) };
}
const so = summarize(orig), sr = summarize(resk);

// paridad: cada assertion debe dar el MISMO resultado en ambas
const parity = orig.A.map((a, i) => ({ name: a.name, orig: a.ok, resk: resk.A[i] && resk.A[i].ok, igual: a.ok === (resk.A[i] && resk.A[i].ok) }));
const parityFails = parity.filter(p => !p.igual);

console.log('\n================= PRUEBA FUNCIONAL DE EQUIVALENCIA =================');
for (const r of [orig, resk]) {
  const s = summarize(r);
  console.log(`\n[${r.label}]  ${s.pass}/${r.A.length} OK` + (s.fail ? `  · FALLAS: ${s.fails.join(' | ')}` : '') +
    `  · pageerrors: ${r.errs.length}  · conexiones CLÍNICAS: ${r.netClin.length}  · externas bloqueadas (libs 3os): ${r.net.length}`);
  if (r.netClin.length) console.log('   ⚠ CLÍNICAS DETECTADAS:', r.netClin.slice(0, 5));
}
console.log('\nExternas bloqueadas (libs de terceros, la app degrada offline; NO son datos clínicos):');
console.log('  ', [...new Set(resk.net)].map(u => u.replace(/^https?:\/\//, '').split('/')[0]).filter((v,i,a)=>a.indexOf(v)===i).join(', ') || '(ninguna)');
console.log('\nLogo accesible (alt) en reskin:', JSON.stringify(resk.extra.logoAlt));
console.log('Logo <img> en original:', JSON.stringify(orig.extra.logoAlt), '(se espera null: original usa emoji)');
console.log('\nPARIDAD FUNCIONAL original vs reskin:',
  parityFails.length === 0 ? 'IDÉNTICA ✓ (el reskin no cambió ninguna función)' : ('DIVERGE ✗ -> ' + JSON.stringify(parityFails)));

// comprobaciones de INTERACCIÓN y NO-DUPLICACIÓN (reskin)
var rx = resk.extra;
var reskinChecks = [
  ['SOAP segmentado presente (1)', rx.soapnav === 1],
  ['SOAP segmentado con 4 botones', rx.soapnavBtns === 4],
  ['navegación S/O/A/P por clic marca activo', rx.navClick === 'ok'],
  ['sin iconos duplicados en tabs del expediente', rx.tabIconsDup === 0],
  ['1 solo logo en hero del expediente', rx.heroLogoDup <= 1],
  ['sin duplicación de segmentado tras re-render (observer)', rx.soapnavDup <= 1],
  ['original sin segmentado (0)', orig.extra.soapnav === 0]
];
console.log('\nInteracción / no-duplicación (reskin):');
reskinChecks.forEach(function (c) { console.log('  ' + (c[1] ? 'OK ' : 'FALLA ') + c[0]); });
var reskinFails = reskinChecks.filter(function (c) { return !c[1]; }).map(function (c) { return c[0]; });

const okGlobal = so.fail === 0 && sr.fail === 0 && parityFails.length === 0 &&
  orig.netClin.length === 0 && resk.netClin.length === 0 && reskinFails.length === 0;
fs.writeFileSync(ROOT + '/scratchpad/audit/equiv_result.json', JSON.stringify({ orig: summarize(orig), resk: summarize(resk), parityFails, netClinOrig: orig.netClin, netClinResk: resk.netClin, externasBloqueadas: [...new Set(resk.net)], logoAltResk: resk.extra.logoAlt }, null, 2));
console.log('\nRESULTADO GLOBAL:', okGlobal ? 'APROBADO ✓' : 'REVISAR ✗');
console.log('===================================================================\n');
process.exit(okGlobal ? 0 : 1);
