'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const path=require('node:path');
const file=process.env.SINERGIA_JS||path.join(__dirname,'..','medidor-biomecanico.js'); // unica adaptacion: por defecto el modulo del repo (el paquete apuntaba a su copia PATCHED); SINERGIA_JS sigue mandando
const src=fs.readFileSync(file,'utf8');
function extract(start,end){const a=src.indexOf(start), b=src.indexOf(end,a+1);assert(a>=0&&b>a,`No se pudo extraer ${start}`);return src.slice(a,b);}
assert(src.includes('p.valoracion.rom = _gonioActualizarROM(p.valoracion.rom, linea);'), 'Guardar cámara debe invocar helper bidireccional');
const cx=vm.createContext({});
vm.runInContext(extract('  function _gonioActualizarROM(','  async function guardarSesionGonio(')+extract('  function _v4ActualizarROM(','  function _v4Recibir('),cx);
let n=0;function test(name,fn){fn();n++;console.log('PASS',name);}
const observacion='Valoración: debilidad moderada del lado derecho';
const v4Codo='Goniometría revisada V4 [cod_flex:der] Codo derecho 129°';
const v4Muneca='Goniometría revisada V4 [mun_flex:izq] Muñeca izquierda 45°';
const oldCam='Goniometría cámara 2D (22/11/2026): Codo izquierdo 140°';
const legacy='Goniometría (20/11/2026): Codo izquierdo 135°';
const camNew='Goniometría cámara 2D (24/11/2026): Muñeca derecha 51°';
let rom=[observacion,oldCam,v4Codo,v4Muneca].join('\n');
test('Camara preserva líneas V4 de otro movimiento y lado',()=>{const a=cx._gonioActualizarROM(rom,camNew);assert(a.includes(v4Codo));assert(a.includes(v4Muneca));assert(a.includes(observacion));});
test('Camara reemplaza solo resumen previo de camara',()=>{const a=cx._gonioActualizarROM(rom,camNew);assert(!a.includes(oldCam));assert(a.includes(camNew));});
test('Camara también reemplaza línea histórica del formato antiguo',()=>{const a=cx._gonioActualizarROM([legacy,v4Codo,observacion].join('\n'),camNew);assert(!a.includes(legacy));assert(a.includes(v4Codo));assert(a.includes(observacion));});
test('Guardar cámara dos veces mantiene un solo resumen',()=>{const a=cx._gonioActualizarROM(rom,camNew);const b=cx._gonioActualizarROM(a,camNew);assert.equal(b.split('Goniometría cámara 2D (').length-1,1);assert(b.includes(v4Muneca));});
test('V4 reemplaza solo medición del mismo lado y movimiento',()=>{const a=cx._v4ActualizarROM(rom,'cod_flex','der','Codo derecho 133°');assert(!a.includes(v4Codo));assert(a.includes(v4Muneca));assert(a.includes(oldCam));assert(a.includes('Codo derecho 133°'));});
test('V4 conserva resumen de cámara después de guardarlo',()=>{const a=cx._gonioActualizarROM(rom,camNew);const b=cx._v4ActualizarROM(a,'cod_flex','der','Codo derecho 133°');assert(b.includes(camNew));assert(b.includes(v4Muneca));});
test('Alternancia V4 -> cámara -> V4 -> cámara no elimina otros registros',()=>{
  let a=cx._v4ActualizarROM(observacion,'cod_flex','der','Codo D 129°');
  a=cx._gonioActualizarROM(a,'Goniometría cámara 2D (2026): Muñeca I 56°');
  a=cx._v4ActualizarROM(a,'mun_flex','der','Muñeca D 41°');
  a=cx._gonioActualizarROM(a,camNew);
  assert(a.includes('Codo D 129°'));assert(a.includes('Muñeca D 41°'));assert(a.includes(camNew));assert(!a.includes('Muñeca I 56°'));assert(a.includes(observacion));
});
test('V4 repetido mismo movimiento lado mantiene solo última medición',()=>{let a=cx._v4ActualizarROM(observacion,'cod_flex','der','Codo D 129°');a=cx._v4ActualizarROM(a,'cod_flex','der','Codo D 131°');assert.equal(a.split('Goniometría revisada V4 [cod_flex:der]').length-1,1);assert(!a.includes('129°'));});
test('V4 derecho e izquierdo preservan ambos lados',()=>{let a=cx._v4ActualizarROM('', 'cod_flex', 'der', '129°');a=cx._v4ActualizarROM(a,'cod_flex','izq','140°');assert(a.includes('129°'));assert(a.includes('140°'));});
test('Una nota ajena con la palabra Goniometría se preserva',()=>{const text='Se realizó Goniometría manual: pendiente de revisión';const a=cx._gonioActualizarROM(text,camNew);assert(a.includes(text));});
console.log(`SINERGIA V4: ${n} verificaciones ROM simétrico PASS`);
