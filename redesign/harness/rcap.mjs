import pkg from '/opt/node-tools/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'fs'; import path from 'path';
const ROOT='/home/user/Clinica-Fisio/scratchpad/audit';
const PAGE='file://'+ROOT+'/redesign/index.html';
const OUT=ROOT+'/shots_rd'; fs.mkdirSync(OUT,{recursive:true});
const only=(process.argv[2]||'').split(',').filter(Boolean);           // subconjunto opcional
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const race=(p,ms)=>Promise.race([p,new Promise(r=>setTimeout(r,ms))]);
const VPS=[['celular_390',390,844,2],['tablet_1024',1024,768,1],['laptop_1440',1440,900,1],['escritorio_1920',1920,1080,1]];
let STEPS=[
 ['01_agenda',       `showAgenda();`],
 ['02_pacientes',    `showPacientes();`],
 ['03_expediente',   `openExpediente('p_demo_0001'); renderExpediente('historia');`],
 ['04_valoracion',   `openExpediente('p_demo_0001'); renderExpediente('valoracion');`],
 ['05_soap',         `openExpediente('p_demo_0001'); showNuevoSOAP();`],
 ['06_soap_motivo',  `openExpediente('p_demo_0001'); showNuevoSOAP(); setTimeout(function(){var b=document.getElementById('btn-nuevo-motivo-soap'); if(b) b.click();},350);`],
 ['07_alta',         `showNuevoPaciente();`],
 ['08_biomecanica',  `openExpediente('p_demo_0001'); renderExpediente('biomecanica');`],
];
if(only.length) STEPS=STEPS.filter(s=>only.some(o=>s[0].includes(o)));
(async()=>{
  const b=await chromium.launch({args:['--no-sandbox','--disable-gpu']});
  const log=[];
  for(const [vn,w,h,dsf] of VPS){
    const dir=path.join(OUT,vn); fs.mkdirSync(dir,{recursive:true});
    const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:dsf,serviceWorkers:'block'});
    const page=await ctx.newPage(); page.setDefaultTimeout(12000);
    const errs=[]; page.on('pageerror',e=>errs.push(String(e).slice(0,140)));
    await page.route('**/*',r=>{const u=r.request().url(); if(u.startsWith('file:'))return r.continue(); if(/firebasejs/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:''}); return r.abort();});
    await page.goto(PAGE,{waitUntil:'domcontentloaded',timeout:30000}).catch(e=>log.push('goto:'+e.message));
    await sleep(1400);   // autoboot (load+500) + render
    for(const [id,fn] of STEPS){
      await race(page.evaluate(`(async()=>{ try{ ${fn} }catch(e){} })()`),6000).catch(()=>{});
      await sleep(id.includes('motivo')?900:650);
      try{ await page.screenshot({path:path.join(dir,id+'.png'),animations:'disabled',timeout:15000}); log.push('[OK] '+vn+'/'+id+(errs.length?(' err='+errs.length):'')); }
      catch(e){ log.push('[FAIL] '+vn+'/'+id+' :: '+e.message); }
    }
    if(errs.length) log.push('   · '+vn+' errs: '+errs.slice(0,3).join(' | '));
    await ctx.close();
  }
  await b.close(); console.log(log.join('\n'));
})().catch(e=>{console.error('FATAL',e&&e.message);process.exit(1);});
