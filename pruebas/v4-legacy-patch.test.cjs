// Suite del paquete SINERGIA BIOMECHANICS V4 (tests/legacy_patch.test.cjs), VERBATIM salvo esta cabecera
// y la ruta del módulo: apunta al medidor REAL del repo (con el parche P0-PROVENANCIA aplicado).
'use strict';
const vm=require('vm'),fs=require('fs'),assert=require('node:assert/strict'),path=require('path');
const src=fs.readFileSync(path.resolve(__dirname,'../medidor-biomecanico.js'),'utf8');
const noop=()=>{};
const ctx={window:{},document:{createElement:()=>({getContext:()=>({clearRect:noop,drawImage:noop,beginPath:noop,moveTo:noop,lineTo:noop,stroke:noop,fill:noop,arc:noop,fillText:noop,save:noop,restore:noop,setTransform:noop,translate:noop,rotate:noop,fillRect:noop,setLineDash:noop,closePath:noop,measureText:()=>({width:10})}),style:{},width:0,height:0}),getElementById:()=>null,querySelector:()=>null,addEventListener:noop,body:{appendChild:noop},head:{appendChild:noop}},navigator:{mediaDevices:{}},console,setTimeout,clearTimeout,setInterval:()=>0,clearInterval:noop,requestAnimationFrame:noop,cancelAnimationFrame:noop,Image:()=>{},URL:{createObjectURL:()=>'',revokeObjectURL:noop},fetch:()=>Promise.reject(Error('offline'))};
vm.createContext(ctx);vm.runInContext(src,ctx,{filename:'medidor-biomecanico.js'});
const T=ctx.window.__BIO_TEST,point=(x,y,visibility=.98)=>({x,y,visibility});
const P=Array.from({length:33},()=>point(.5,.5,0));P[14]=point(.3,.5);P[16]=point(.6,.5);P[20]=point(.67,.6);
const H=Array.from({length:21},()=>point(.6,.5));H[0]=point(.66,.5);H[9]=point(.75,.56);
T.setAspect(1,1);T.setFrameH(null);T.setMunProto('3mcp');
let checks=0;
function test(h,reason){T.setHandsLm(h);const r=T.calcularGonio(P,'Muñeca','Flexión','der');assert.equal(r.ok,false);assert.equal(r.motivo,'correspondencia');if(reason)assert.equal(r.gate?.reason,reason);checks++;}
test([H],'WRIST_MISMATCH');
H[0]=point(.738,.5);test([H],'HAND_NOT_ASSOCIATED');
H[0]=point(.74,.5);test([H],'HAND_NOT_ASSOCIATED');
test(null,'HANDS_NOT_AVAILABLE');
test([],'HANDS_NOT_AVAILABLE');
// Valid hand is still allowed as a computed proxy, but does not certify anatomy.
H[0]=point(.606,.5);H[9]=point(.65,.56);T.setHandsLm([H]);const result=T.calcularGonio(P,'Muñeca','Flexión','der');assert.ok(result.ok);checks++;
// Structural regression: manual capture must persist original evidence and final protocol.
for(const token of ['deteccionOriginal:(BIO._estaticoR','traza.ajusteHumano','protocolo:(rT.protocolo ||','notaHandsScore']){assert.ok(src.includes(token),token);checks++;}
assert.ok(src.includes('function _confirmar(msg){ try{ return (typeof confirm===\'function\') ? confirm(msg) : false; }'), 'no auto consent when confirm missing');checks++;
console.log(`SINERGIA / Legacy patch: ${checks} verificaciones OK`);
