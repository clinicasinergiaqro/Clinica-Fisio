// Captura antes/después de la APP REAL (réplica aislada).
// Uso: node cap.mjs <file index.html> <outdir> <sufijo>
// Captura: login (antes del auto-boot) y agenda (tras el boot), más pantallas por hooks.
import pw from '/opt/node-tools/node_modules/playwright/index.js';
const { chromium } = pw;
const file = process.argv[2], outdir = process.argv[3], suf = process.argv[4] || '';
const W = parseInt(process.argv[5] || '390', 10);
import fs from 'fs';
fs.mkdirSync(outdir, { recursive: true });

const b = await chromium.launch();
const pg = await b.newPage({ viewport:{ width:W, height:850 }, deviceScaleFactor:2 });
const errs = []; pg.on('pageerror', e => errs.push(String(e)));
const shot = async (name) => { await pg.screenshot({ path:`${outdir}/${name}_${suf}.png`, animations:'disabled', fullPage:false }); console.log('shot', name); };

// 1) LOGIN — antes de que dispare el auto-boot (load+500ms -> entrarComo)
await pg.goto('file://'+file, { waitUntil:'domcontentloaded' });
await pg.waitForTimeout(220);
await shot('01_login');

// 2) Esperar boot -> agenda
await pg.waitForTimeout(2600);
// asegurar que agenda esté activa
await pg.evaluate(()=>{ try{ if(window.showAgenda) window.showAgenda(); }catch(e){} });
await pg.waitForTimeout(600);
await shot('02_agenda');

// 3) Directorio de pacientes
try { await pg.evaluate(()=>{ try{ window.showPacientes && window.showPacientes(); }catch(e){} }); await pg.waitForTimeout(700); await shot('03_pacientes'); } catch(e){ console.log('pacientes skip'); }

console.log('pageerrors:', errs.length ? errs.slice(0,6) : 'NINGUNO');
await b.close();
