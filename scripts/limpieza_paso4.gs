// ═══ PASO 4 — LIMPIEZA mig_pac_ · pegar en el editor de Apps Script y correr por pasos ═══
// SHEET_ID ya existe en Codigo.gs; estas funciones lo reutilizan.

// ── Helper: localizar la columna 'id' case-insensitive; ABORTA si no existe (anti-silencio) ──
function _colId_(headers){
  for(var i=0;i<headers.length;i++){ if(String(headers[i]||'').trim().toLowerCase()==='id') return i; }
  throw new Error('No se encontro la columna "id" en los headers: '+JSON.stringify(headers.slice(0,12)));
}

// ── CONTADOR (correr ANTES de A y DESPUES de B) ──
function contarMigPac_(){
  var ss=SpreadsheetApp.openById(SHEET_ID);
  var sheet=ss.getSheetByName('Pacientes');
  var data=sheet.getDataRange().getValues();
  var colId=_colId_(data[0]);
  var total=0, migs=0, activos=0;
  for(var i=1;i<data.length;i++){
    var id=String(data[i][colId]||'').trim();
    if(!id) continue;
    total++;
    if(id.indexOf('mig_pac_')===0) migs++; else activos++;
  }
  Logger.log('CONTEO Pacientes -> total con id: '+total+' | mig_pac_: '+migs+' | activos (p-uuid/otros): '+activos);
  return {total:total, migs:migs, activos:activos};
}

// ── PASO A — RESPALDO NUEVO CON TIMESTAMP (no borra nada) ──
// Copia TODAS las columnas de cada fila mig_pac_ a una pestaña nueva BACKUP_<n>filas_<timestamp>.
// NUNCA toca BACKUP_60filas_2jul (nombre distinto). Devuelve la lista exacta de ids respaldados.
function backupMigPac_(){
  var ss=SpreadsheetApp.openById(SHEET_ID);
  var sheet=ss.getSheetByName('Pacientes');
  var data=sheet.getDataRange().getValues();
  var headers=data[0];
  var colId=_colId_(headers);
  var rows=[['_fila_original'].concat(headers)];
  var ids=[];
  for(var i=1;i<data.length;i++){
    var id=String(data[i][colId]||'').trim();
    if(id.indexOf('mig_pac_')===0){ rows.push([i+1].concat(data[i])); ids.push(id); }
  }
  if(!ids.length){ Logger.log('No hay filas mig_pac_ que respaldar.'); return {count:0}; }
  var stamp=Utilities.formatDate(new Date(),'America/Mexico_City','yyyyMMdd_HHmm');
  var nombre='BACKUP_'+ids.length+'filas_'+stamp;
  if(ss.getSheetByName(nombre)) throw new Error('Ya existe la pestaña '+nombre+' — espera 1 min y reintenta');
  var hoja=ss.insertSheet(nombre);
  hoja.getRange(1,1,rows.length,rows[0].length).setValues(rows);
  Logger.log('RESPALDO OK -> pestaña "'+nombre+'" | filas respaldadas: '+ids.length+' (esperado 52)');
  Logger.log('IDS respaldados: '+JSON.stringify(ids));
  return {nombre:nombre, count:ids.length, ids:ids};
}

// ── PASO B — BORRADO POR LISTA EXPLICITA (lee los ids DEL RESPALDO, no por prefijo) ──
// Solo borra filas cuyo id este EN EL RESPALDO. Un mig_pac_ nuevo que apareciera despues del
// respaldo NO esta en la lista -> NO se toca. Guard: si el conteo encontrado != respaldo, ABORTA.
// Pasa el nombre EXACTO de la pestaña que creo backupMigPac_ (lo imprimio en el log).
function borrarMigPacDesdeRespaldo_(nombreBackup){
  var ss=SpreadsheetApp.openById(SHEET_ID);
  if(!nombreBackup || nombreBackup==='BACKUP_60filas_2jul'){ throw new Error('Pasa el nombre del respaldo NUEVO (no BACKUP_60filas_2jul).'); }
  var bak=ss.getSheetByName(nombreBackup);
  if(!bak) throw new Error('No existe el respaldo "'+nombreBackup+'" — corre backupMigPac_ primero');
  var bdata=bak.getDataRange().getValues();
  var bColId=_colId_(bdata[0]);
  var idsBorrar={}, listaIds=[];
  for(var i=1;i<bdata.length;i++){ var id=String(bdata[i][bColId]||'').trim(); if(id.indexOf('mig_pac_')===0 && !idsBorrar[id]){ idsBorrar[id]=true; listaIds.push(id); } }
  var sheet=ss.getSheetByName('Pacientes');
  var data=sheet.getDataRange().getValues();
  var colId=_colId_(data[0]);
  var aBorrar=[], encontrados=[];
  for(var j=data.length-1;j>=1;j--){ var id2=String(data[j][colId]||'').trim(); if(idsBorrar[id2]){ aBorrar.push(j+1); encontrados.push(id2); } }
  Logger.log('en respaldo: '+listaIds.length+' ids | encontrados en Pacientes: '+encontrados.length);
  if(encontrados.length!==listaIds.length){
    Logger.log('⚠️ DESAJUSTE respaldo('+listaIds.length+') vs encontrados('+encontrados.length+') — NO borro. Revisa manualmente.');
    return {ok:false, motivo:'desajuste', respaldo:listaIds.length, encontrados:encontrados.length};
  }
  aBorrar.sort(function(a,b){ return b-a; });   // de abajo hacia arriba (los indices no se corren)
  for(var k=0;k<aBorrar.length;k++){ sheet.deleteRow(aBorrar[k]); }
  Logger.log('BORRADO OK -> filas borradas: '+aBorrar.length+' (esperado 52). Ahora corre contarMigPac_ (debe dar mig_pac_: 0).');
  return {ok:true, borradas:aBorrar.length};
}
