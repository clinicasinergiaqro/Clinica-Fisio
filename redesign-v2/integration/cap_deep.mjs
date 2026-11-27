// Captura PROFUNDA: expediente + pestañas + SOAP + alta de la app REAL (réplica).
// Uso: node cap_deep.mjs <file index.html> <outdir> <sufijo> [width]
import pw from '/opt/node-tools/node_modules/playwright/index.js';
const { chromium } = pw;
const file = process.argv[2], outdir = process.argv[3], suf = process.argv[4] || '';
const W = parseInt(process.argv[5] || '390', 10);
import fs from 'fs';
fs.mkdirSync(outdir, { recursive: true });
const b = await chromium.launch();
const pg = await b.newPage({ viewport:{ width:W, height:850 }, deviceScaleFactor:2 });
const errs = []; pg.on('pageerror', e => errs.push(String(e)));
const shot = async (name, full=false) => { await pg.screenshot({ path:`${outdir}/${name}_${suf}.png`, animations:'disabled', fullPage:full }); console.log('shot', name, full?'(full)':''); };
const ev = async (fn, arg) => pg.evaluate(fn, arg);

await pg.goto('file://'+file, { waitUntil:'domcontentloaded' });
await pg.waitForTimeout(3200); // boot -> agenda

const pid = await ev(()=>{ try{ return (window.patientsDB&&patientsDB[0]&&patientsDB[0].id)||''; }catch(e){ return ''; } });
console.log('pid:', pid);

// Expediente (tab por defecto)
await ev((id)=>{ try{ window.openExpediente && openExpediente(id); }catch(e){console.error(e);} }, pid);
await pg.waitForTimeout(900);
await shot('10_exp_top');          // viewport superior (header + tabs)
await shot('10_exp_full', true);   // pantalla completa

// Pestaña Valoración
await ev(()=>{ try{ window.renderExpediente && renderExpediente('valoracion'); }catch(e){console.error(e);} });
await pg.waitForTimeout(700);
await shot('11_exp_valoracion_full', true);

// Editor SOAP (módulo 5, para referencia)
await ev((id)=>{ try{ if(window.nuevaSesionRapida) nuevaSesionRapida(id); else if(window.showNuevoSOAP) showNuevoSOAP(id); }catch(e){console.error(e);} }, pid);
await pg.waitForTimeout(1000);
await shot('12_soap_top');
await shot('12_soap_full', true);

// Alta (módulo 4)
await ev(()=>{ try{ window.showNuevoPaciente && showNuevoPaciente(); }catch(e){console.error(e);} });
await pg.waitForTimeout(800);
await shot('13_alta_top');

console.log('pageerrors:', errs.length ? errs.slice(0,8) : 'NINGUNO');
await b.close();
