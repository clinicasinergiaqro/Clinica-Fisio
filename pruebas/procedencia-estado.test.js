/* ============================================================================
 * FASE 5 — procedencia y estado real (P1-7 fuente derivada, P1-10 badge de sync)
 *
 * Node puro (vm + stubs). Cubre las piezas PURAS y testeables sin Firebase/DOM:
 *   _fuenteDeTrazas: camara / foto / video / mixta derivada de las trazas por medida.
 *   _syncBadge: ☁️ sincronizada / 📱 local / '' (sesión vieja sin el campo).
 * Lo que NO se puede asertar aquí (save/upload/transacción reales) va por código + nota de límites:
 *   P1-8 (sube el original de la foto), P1-9 (fusión res.calidad+meta.calidad en marcha),
 *   P1-10 transición a 'sincronizada' dentro de _syncBiomecanicaFS (index.html + Firebase).
 *
 * Correr desde la raíz del repo:
 *   node pruebas/procedencia-estado.test.js medidor-biomecanico.js
 * ==========================================================================*/
'use strict';
var vm = require('vm');
var fs = require('fs');
var path = require('path');

var modPath = process.argv[2] || path.join(__dirname, '..', 'medidor-biomecanico.js');
var src = fs.readFileSync(modPath, 'utf8');

var ins = "window.__BIO_V5 = { _fuenteDeTrazas: _fuenteDeTrazas, _syncBadge: _syncBadge };\n";
var cut = src.lastIndexOf('})();');
if (cut < 0) { console.error('No encontré el cierre del IIFE'); process.exit(2); }
src = src.slice(0, cut) + ins + src.slice(cut);

var noop = function(){};
function fakeCtx2d(){ return { clearRect:noop, drawImage:noop, beginPath:noop, moveTo:noop, lineTo:noop,
  stroke:noop, fill:noop, arc:noop, fillText:noop, save:noop, restore:noop, setTransform:noop,
  translate:noop, rotate:noop, fillRect:noop, setLineDash:noop, closePath:noop, measureText:function(){return {width:10};} }; }
var win = {};
var ctx = {
  window: win,
  document: { createElement: function(){ return { getContext: fakeCtx2d, width:0, height:0, style:{}, toBlob:noop }; },
              getElementById: function(){ return null; }, querySelector: function(){ return null; },
              addEventListener: noop, head:{ appendChild:noop }, body:{ appendChild:noop } },
  navigator: { mediaDevices:{} },
  console: console, setTimeout: setTimeout, clearTimeout: clearTimeout,
  setInterval: function(){ return 0; }, clearInterval: noop,
  requestAnimationFrame: noop, cancelAnimationFrame: noop,
  Image: function(){}, URL: { createObjectURL:function(){return '';}, revokeObjectURL:noop },
  fetch: function(){ return Promise.reject(new Error('sin red')); }
};
vm.createContext(ctx);
vm.runInContext(src, ctx, { filename: path.basename(modPath) });

var V = win.__BIO_V5;
if (!V || !V._fuenteDeTrazas || !V._syncBadge) { console.error('FALLO: hook __BIO_V5 no expuesto'); process.exit(1); }

var pass = 0, fail = 0;
function chk(cond, id, msg){ if(cond){ pass++; console.log('  ✓ '+id+' '+msg); } else { fail++; console.log('  ✗ '+id+' '+msg); } }
function g(fuentes){ var med={}; fuentes.forEach(function(f,i){ med['k'+i]={ traza:{ fuente:f } }; }); return { medidas:med }; }

console.log('\n== FASE 5 — procedencia (P1-7) + badge de sync (P1-10) ==');

chk(V._fuenteDeTrazas(g(['camara','camara']))==='camara', 'F1', 'todas camara → camara');
chk(V._fuenteDeTrazas(g(['foto','foto']))==='foto', 'F2', 'todas foto → foto');
chk(V._fuenteDeTrazas(g(['foto','video']))==='mixta', 'F3', 'foto+video → mixta');
chk(V._fuenteDeTrazas(g(['camara','foto']))==='mixta', 'F4', 'camara+foto → mixta');
chk(V._fuenteDeTrazas(g(['estatico','estatico']))==='foto', 'F5', "estatico normaliza a foto → foto");
chk(V._fuenteDeTrazas({medidas:{}})==='camara', 'F6', 'sin medidas → camara (default seguro)');

var bL=V._syncBadge({_estadoSync:'local'});
chk(/📱/.test(bL) && !/☁️/.test(bL), 'B1', 'local → 📱 ('+bL.replace(/<[^>]*>/g,'').trim()+')');
var bS=V._syncBadge({_estadoSync:'sincronizada', _estadoSyncFecha:'2026-11-14T10:00:00.000Z'});
chk(/☁️/.test(bS) && /2026-11-14/.test(bS), 'B2', 'sincronizada → ☁️ + fecha');
var bO=V._syncBadge({});   // sesión vieja sin el campo
chk(bO==='', 'B3', 'sesión vieja (sin _estadoSync) → sin badge (no miente)');

console.log('\nFase 5 procedencia/estado: '+pass+' OK, '+fail+' fallidas.');
process.exit(fail ? 1 : 0);
