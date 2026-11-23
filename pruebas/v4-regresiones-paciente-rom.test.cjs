'use strict';
// Regression tests independent of browser/server. Extract the exact functions from patched host.
const fs=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');const path=require('node:path');
const choose=(...names)=>names.find(f=>fs.existsSync(f));
const moduleFile=choose(path.join(__dirname,'medidor-biomecanico.js'),path.join(__dirname,'..','medidor-biomecanico.js'),path.join(__dirname,'..','CODIGO','medidor-biomecanico.js'));
const src=fs.readFileSync(moduleFile,'utf8');
const start=src.indexOf('  function _v4ComprobarRegistro(rec){');
const end=src.indexOf('  function _v4MostrarConfirmacion(){');
assert(start>=0&&end>start,'functions for record review and ROM');
const code=src.slice(start,end);
let messages=[];const currentPatient={id:'PACIENTE_A',name:'Paciente A',biomecanica:[]};
const testWin={
 currentPatient,
 BIO:{_v4Cola:[]},
 _V4_MOV:{'elbow-flexion':'cod_flex','wrist-flexion':'mun_flex'},
 toast:(message,type)=>messages.push({message,type}),
 document:{getElementById:()=>true},
 _v4MostrarConfirmacion:()=>{throw new Error('unexpected UI')},
};
const cx=vm.createContext(testWin);
vm.runInContext(code,cx);
let checks=0;function ok(c,msg){assert.ok(c,msg);checks++;}
const fixture=choose(path.join(__dirname,'EVIDENCIAS','A_export_mediciones.json'),path.join(__dirname,'..','EVIDENCIAS','A_export_mediciones.json'),'/mnt/data/v4_integrada_audit/EVIDENCIAS/A_export_mediciones.json');
const example=JSON.parse(fs.readFileSync(fixture,'utf8')).measurements[0];
ok(cx._v4ComprobarRegistro(example).ok,'accepted correct angle');
let r=structuredClone(example);r.calculation.degreeDisplay=90;
ok(!cx._v4ComprobarRegistro(r).ok,'reject wrong displayed angle');
r=structuredClone(example);r.calculation.degreeRaw=90;
ok(!cx._v4ComprobarRegistro(r).ok,'reject wrong raw angle');
r=structuredClone(example);r.calculation.pointsPx.B={x:-10,y:400};
ok(!cx._v4ComprobarRegistro(r).ok,'reject out-of-bounds point');
r=structuredClone(example);r.evidence.manualReviewed=false;
ok(!cx._v4ComprobarRegistro(r).ok,'reject unreviewed');
cx._v4Recibir(structuredClone(example));
ok(testWin.BIO._v4Cola.length===1,'queue accepted');
ok(testWin.BIO._v4Cola[0]._v4PacienteId==='PACIENTE_A','patient ID is frozen at reception');
// ROM: replace only the *same* movement-side, never other goniometry results
const old='Observación inicial: movilidad conservada\nGoniometría cámara 2D (fecha antigua): Codo izquierdo 140°\nGoniometría revisada V4 [mun_flex:der] dato previo';
const after=cx._v4ActualizarROM(old,'cod_flex','der','medición nueva: 129°');
ok(after.includes('Observación inicial'),'preserve unrelated clinical narrative');
ok(after.includes('Goniometría cámara 2D'),'preserve native goniometry summary');
ok(after.includes('Goniometría revisada V4 [mun_flex:der]'),'preserve other movement');
ok(after.includes('Goniometría revisada V4 [cod_flex:der]'),'add new movement');
const after2=cx._v4ActualizarROM(after,'cod_flex','der','medición repetida: 131°');
ok(after2.includes('131°')&&!after2.includes('129°'),'replace same movement without duplicate');
ok(after2.split('Goniometría revisada V4 [cod_flex:der]').length===2,'exact one current entry');
// Regression: save must refuse if current patient differs from the frozen patient.
const saveA=src.indexOf('  async function _v4Guardar(){');
const saveB=src.indexOf('  window.BIO_v4Abrir = BIO_v4Abrir;',saveA);
assert(saveA>=0&&saveB>saveA);
vm.runInContext(src.slice(saveA,saveB),cx);
let saved=0;testWin.saveDB=()=>{saved++;return Promise.resolve({ok:true});};
testWin.currentPatient={id:'PACIENTE_B',biomecanica:[]};
(async()=>{await cx._v4Guardar();ok(saved===0,'no database writes to different patient');ok(testWin.currentPatient.biomecanica.length===0,'no changed patient data mutated');
console.log('SINERGIA V4 Auditoría: '+checks+' regresiones paciente/ROM/integridad PASS');})().catch(e=>{console.error(e);process.exitCode=1;});
