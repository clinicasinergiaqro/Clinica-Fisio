import pkg from '/opt/node-tools/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'fs';
const ROOT='/home/user/Clinica-Fisio/scratchpad/audit';
const BEF=ROOT+'/shots', AFT=ROOT+'/shots_rd';
const OUTPDF=ROOT+'/ENTREGA_RD/SINERGIA_Comparativa_Visual_Antes_Despues.pdf';
// (after, before, título) — antes y después usan el MISMO nombre (misma pantalla, con/sin overlay)
const SCREENS=[
 ['01_agenda','01_agenda','Agenda'],
 ['02_pacientes','02_pacientes','Directorio de pacientes'],
 ['03_expediente','03_expediente','Expediente clínico'],
 ['04_valoracion','04_valoracion','Valoración fisioterapéutica'],
 ['05_soap','05_soap','Editor SOAP'],
 ['06_soap_motivo','06_soap_motivo','SOAP · Nuevo motivo de consulta'],
 ['07_alta','07_alta','Alta de paciente'],
 ['08_biomecanica','08_biomecanica','Biomecánica integrada'],
];
const uri=p=> fs.existsSync(p)?('file://'+p):'';
function pair(size,after,before){
  const a=uri(AFT+'/'+size+'/'+after+'.png'), b=uri(BEF+'/'+size+'/'+before+'.png');
  return `<div class="pair">
    <div class="side"><div class="tag antes">ANTES</div>${b?`<img src="${b}">`:'<div class="miss">—</div>'}</div>
    <div class="side"><div class="tag desp">DESPUÉS</div>${a?`<img src="${a}">`:'<div class="miss">—</div>'}</div>
  </div>`;
}
let body='';
for(const [after,before,titulo] of SCREENS){
  body+=`<section>
    <h2>${titulo}</h2>
    <div class="blk"><div class="blk-t">📱 Celular (390)</div>${pair('celular_390',after,before)}</div>
    <div class="blk"><div class="blk-t">🖥️ Escritorio (1920)</div>${pair('escritorio_1920',after,before)}</div>
  </section>`;
}
const html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
 @page{size:A4;margin:12mm}
 *{box-sizing:border-box;font-family:-apple-system,Arial,sans-serif}
 body{color:#1B3A6B;margin:0}
 .cover{height:250mm;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;page-break-after:always}
 .cover h1{font-size:30px;margin:0 0 10px}
 .cover .g{color:#C9A84C;font-weight:800}
 .cover p{color:#526174;font-size:14px;max-width:560px;line-height:1.55}
 section{page-break-before:always;page-break-inside:avoid}
 h2{font-size:17px;border-left:5px solid #C9A84C;padding-left:10px;margin:0 0 10px}
 .blk{margin-bottom:12px}
 .blk-t{font-size:11px;font-weight:700;color:#526174;margin-bottom:6px}
 .pair{display:flex;gap:10px}
 .side{flex:1;background:#F5F7FA;border:1px solid #DDE3EC;border-radius:8px;padding:6px;position:relative}
 .tag{position:absolute;top:10px;left:10px;font-size:9px;font-weight:800;letter-spacing:.5px;padding:2px 7px;border-radius:5px;color:#fff;z-index:2}
 .tag.antes{background:#8C96AB}.tag.desp{background:#236646}
 .side img{width:100%;max-height:118mm;object-fit:contain;display:block;border-radius:4px}
 .miss{color:#9BA3B5;text-align:center;padding:30px}
</style></head><body>
 <div class="cover"><h1>Clínica <span class="g">Sinergia</span><br>Comparativa visual · Antes / Después</h1>
 <p>Rediseño UX/UI V1 — capturas REALES del prototipo funcional (réplica offline, datos sintéticos).
 Mobile-first: se muestra primero el celular y luego el escritorio. Propuesta, no despliegue.</p>
 <p style="margin-top:14px;font-size:11px;color:#9BA3B5">${new Date().toISOString().slice(0,10)}</p></div>
 ${body}</body></html>`;
fs.mkdirSync(ROOT+'/ENTREGA_RD',{recursive:true});
fs.writeFileSync(ROOT+'/ENTREGA_RD/_compare.html',html);
(async()=>{
  const b=await chromium.launch({args:['--no-sandbox','--disable-gpu']});
  const p=await b.newPage();
  await p.goto('file://'+ROOT+'/ENTREGA_RD/_compare.html',{waitUntil:'networkidle',timeout:60000});
  await p.pdf({path:OUTPDF,format:'A4',printBackground:true,margin:{top:'10mm',bottom:'10mm',left:'10mm',right:'10mm'}});
  await b.close();
  console.log('PDF:', fs.statSync(OUTPDF).size, 'bytes');
})().catch(e=>{console.error('PDF FAIL',e.message);process.exit(1);});
