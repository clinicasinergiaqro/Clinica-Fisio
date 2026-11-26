// ============================================================
// CLÍNICA SINERGIA — PropagarNombres.gs  (ARCHIVO NUEVO, aditivo)
// Propaga AUTOMÁTICAMENTE un cambio de nombre del EXPEDIENTE a:
//   · REGISTRO DEL DÍA (columna PACIENTE)  · PAQUETES Y ABONOS (titular)  · eventos del CALENDARIO (conserva la inicial del fisio)
// CÓMO: guarda una "foto" (snapshot) del nombre de cada paciente (hoja oculta _NOMBRE_SNAPSHOT en el Sheet
// principal). Cada corrida compara: si un expediente cambió de nombre, ya conoce el VIEJO y el NUEVO de ESE
// paciente y reescribe SOLO donde el texto coincide EXACTO con el nombre viejo. CANDADO anti-homónimos: si
// OTRO paciente sigue usando ese nombre viejo, NO propaga (lo reporta). La 1ª corrida solo toma la foto base.
// NO toca la app, NO toca la ruta de guardado del expediente, NO toca fórmulas de la hoja. Reusa funciones
// globales de Codigo.gs (mismo proyecto): _normRec_, leerPacientes, _claudeFsToken_, _fsDecodeFields_,
// _recHeader_, _recCol_, _recHojaPorNombre_, parsearTituloAgenda_, _esComboInicial_, AGENDA_INICIALES,
// SHEET_ID, RECEPCION_SHEET_ID, _BLOQUE_RE_REC.
// INSTALAR: Guardar → Deploy no es necesario (es trabajo interno) → correr aplicarPropagarNombres UNA VEZ
// (toma la foto base) → correr instalarPropagarNombres UNA VEZ (deja el disparador diario 5am Qro).
// ============================================================

var _SNAP_TAB = '_NOMBRE_SNAPSHOT';
var PROPAGAR_CAL_PASADO = 7;    // días hacia atrás que revisa en el calendario
var PROPAGAR_CAL_FUTURO = 180;  // días hacia adelante (citas próximas / series)

// ── Snapshot (hoja oculta en el Sheet PRINCIPAL): [id, name] ──
function _snapCargar_(ss){
  var sh = ss.getSheetByName(_SNAP_TAB);
  if(!sh) return {};
  var lr = sh.getLastRow();
  if(lr < 1) return {};
  var vals = sh.getRange(1,1,lr,2).getValues(), m = {};
  for(var i=0;i<vals.length;i++){ var id=String(vals[i][0]||'').trim(); if(id) m[id]=String(vals[i][1]==null?'':vals[i][1]); }
  return m;
}
function _snapGuardar_(ss, mapa){
  var sh = ss.getSheetByName(_SNAP_TAB);
  if(!sh){ sh = ss.insertSheet(_SNAP_TAB); try{ sh.hideSheet(); }catch(_e){} }
  var ids = Object.keys(mapa), rows = ids.map(function(id){ return [id, mapa[id]]; });
  sh.clearContents();
  if(rows.length) sh.getRange(1,1,rows.length,2).setValues(rows);
  return rows.length;
}

// ── Mapa {id:name} de TODOS los expedientes (activos del Sheet + migrados de Firestore) ──
// deadlineMs: tope de tiempo para la paginación de Firestore (como _recepcionIndexNombres_). parcial=true
// si no se pudo leer todo → el llamador NO propaga (para no actuar con un panorama incompleto de homónimos).
function _recepcionMapaNombres_(ss, deadlineMs){
  var mapa = {}, parcial = false;
  try{
    var acts = leerPacientes(ss);
    for(var a=0;a<acts.length;a++){
      var p = acts[a]; if(!p || !p.id) continue;
      if(String(p.id).indexOf('mig_pac_')===0) continue;
      if(p._activoEliminado===true || p.eliminado===true) continue;
      var nm = String(p.name==null?'':p.name).trim(); if(!nm) continue;
      mapa[String(p.id)] = nm;
    }
  }catch(eA){}
  try{
    var tok = _claudeFsToken_();
    if(tok){
      var PROJ = PropertiesService.getScriptProperties().getProperty('FIRESTORE_PROJECT_ID') || 'clinicasinergia-ec2cf';
      var base = 'https://firestore.googleapis.com/v1/projects/'+PROJ+'/databases/(default)/documents/pacientes?pageSize=300'
        + '&mask.fieldPaths=name&mask.fieldPaths=eliminado&mask.fieldPaths=id';
      var pageToken = '', paginas = 0;
      do{
        if(deadlineMs && Date.now()>deadlineMs){ parcial = true; break; }
        var url = base + (pageToken ? '&pageToken='+encodeURIComponent(pageToken) : '');
        var r = UrlFetchApp.fetch(url, { method:'get', headers:{ Authorization:'Bearer '+tok }, muteHttpExceptions:true });
        if(r.getResponseCode()!==200){ parcial = true; break; }
        var j = JSON.parse(r.getContentText()||'{}');
        (j.documents||[]).forEach(function(doc){
          var f = _fsDecodeFields_(doc.fields||{});
          if(f.eliminado===true) return;
          var idPath = String(doc.name||'').split('/').pop();
          var idUse = f.id || idPath;
          var nm = String(f.name==null?'':f.name).trim();
          if(idUse && nm) mapa[String(idUse)] = nm;
        });
        pageToken = j.nextPageToken || ''; paginas++;
      } while(pageToken && paginas < 40);
    } else { parcial = true; }
  }catch(eM){ parcial = true; }
  return { mapa:mapa, parcial:parcial };
}

// ── Diff seguro: devuelve {renames, ambiguos, safeMap} con CANDADO anti-homónimos ──
function _calcularRenombres_(stored, currentMap){
  var nameToIds = {};
  Object.keys(currentMap).forEach(function(id){ var nn=_normRec_(currentMap[id]); if(!nn) return; (nameToIds[nn]=nameToIds[nn]||[]).push(id); });
  var renames = [], ambiguos = [];
  Object.keys(currentMap).forEach(function(id){
    var cur = String(currentMap[id]==null?'':currentMap[id]).trim();
    var old = (stored[id]==null) ? null : String(stored[id]).trim();
    if(old==null) return;            // paciente nuevo (no estaba en la foto): no es rename
    if(!old || !cur) return;
    if(old===cur) return;            // sin cambio real
    var normOld = _normRec_(old); if(!normOld) return;
    var others = (nameToIds[normOld]||[]).filter(function(x){ return x!==id; });
    if(others.length>0){ ambiguos.push({ id:id, old:old, nuevo:cur, motivo:'otro paciente usa el nombre viejo' }); return; }
    renames.push({ id:id, old:old, nuevo:cur, normOld:normOld });
  });
  var safeMap = {}, coll = {};
  renames.forEach(function(rn){ if(safeMap[rn.normOld]!==undefined && safeMap[rn.normOld]!==rn.nuevo) coll[rn.normOld]=1; safeMap[rn.normOld]=rn.nuevo; });
  var renamesOK = [];
  renames.forEach(function(rn){ if(coll[rn.normOld]){ ambiguos.push({ id:rn.id, old:rn.old, nuevo:rn.nuevo, motivo:'colision: dos pacientes con el mismo nombre viejo' }); } else renamesOK.push(rn); });
  Object.keys(coll).forEach(function(k){ delete safeMap[k]; });
  return { renames:renamesOK, ambiguos:ambiguos, safeMap:safeMap };
}

// ── Reescribe una columna de nombres (PACIENTE/titular) según safeMap. NO toca fórmulas (reusa _recHeader_/_recCol_) ──
function _propColNombre_(sh, colKey, safeMap, aplicar){
  var H = _recHeader_(sh); if(!H) return { cambios:0, ejemplos:[] };
  var c = _recCol_(H.headN, colKey); if(c<0) return { cambios:0, ejemplos:[] };
  var first = H.hr+2, last = sh.getLastRow(); if(last<first) return { cambios:0, ejemplos:[] };
  var rng = sh.getRange(first, c+1, last-first+1, 1), vals = rng.getValues(), hubo = false, n = 0, ej = [];
  for(var i=0;i<vals.length;i++){
    var raw = String(vals[i][0]==null?'':vals[i][0]).trim(); if(!raw) continue;
    var nn = _normRec_(raw);
    if(safeMap.hasOwnProperty(nn) && safeMap[nn]!==raw){ if(ej.length<30) ej.push(raw+' -> '+safeMap[nn]); vals[i][0]=safeMap[nn]; hubo=true; n++; }
  }
  if(aplicar && hubo) rng.setValues(vals);
  return { cambios:n, ejemplos:ej };
}

// ── Separa el título del calendario en {prefix (iniciales/Px/combo), name (paciente)} ──
function _tituloSplit_(titulo){
  var words = String(titulo||'').trim().split(/\s+/).filter(String);
  var i = 0;
  for(; i<words.length; i++){
    var w = words[i];
    if(w.toLowerCase()==='px') continue;
    var hit = false;
    for(var k=0;k<AGENDA_INICIALES.length;k++){ if(w.toUpperCase()===AGENDA_INICIALES[k].ini){ hit=true; break; } }
    if(hit) continue;
    break;
  }
  if(i<words.length && _esComboInicial_(words[i])) i++;   // combo (CD/CZ/CDu...) = parte del prefijo, no del nombre
  return { prefix: words.slice(0,i).join(' '), name: words.slice(i).join(' ').trim() };
}

// ── Renombra en el calendario los eventos cuyo NOMBRE coincide EXACTO con un nombre viejo del safeMap ──
// Conserva la inicial del fisio (prefijo). Reescribe por ocurrencia (igual que autoIniciales/conciliar).
function _propagarCalendario_(safeMap, diasPasado, diasFuturo, aplicar){
  var cal = CalendarApp.getDefaultCalendar(); if(!cal) return { cambios:0, ejemplos:[] };
  var hoy = new Date(); hoy.setHours(0,0,0,0);
  var ini = new Date(hoy.getTime() - diasPasado*86400000);
  var fin = new Date(hoy.getTime() + diasFuturo*86400000);
  var evs = cal.getEvents(ini, fin);
  var n = 0, ej = [];
  for(var e=0;e<evs.length;e++){
    if(evs[e].isAllDayEvent()) continue;
    var titulo = evs[e].getTitle();
    if(!titulo || _BLOQUE_RE_REC.test(titulo)) continue;
    var sp = _tituloSplit_(titulo); if(!sp.name) continue;
    var nn = _normRec_(sp.name);
    if(!safeMap.hasOwnProperty(nn)) continue;
    var nuevo = (sp.prefix ? sp.prefix+' ' : '') + safeMap[nn];
    if(nuevo===titulo) continue;
    if(ej.length<40) ej.push({ de:titulo, a:nuevo });
    n++;
    if(aplicar){ try{ evs[e].setTitle(nuevo); }catch(_se){} }
  }
  return { cambios:n, ejemplos:ej };
}

// ── Núcleo: detecta renombres del expediente y los propaga. aplicar=false = PREVIEW (no escribe, no guarda foto). ──
function propagarRenombresExpedienteImpl(aplicar){
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var cur = _recepcionMapaNombres_(ss, Date.now()+150000);
  var currentMap = cur.mapa;
  var nActuales = Object.keys(currentMap).length;
  if(cur.parcial){
    return { ok:true, parcial:true, aplicado:false, pacientesActuales:nActuales,
             nota:'Lectura parcial de Firestore (lento). No se propagó esta vez para no actuar con un panorama incompleto de homónimos; se intenta en la próxima corrida.' };
  }
  var stored = _snapCargar_(ss);
  var nPrevio = Object.keys(stored).length;
  var calc = _calcularRenombres_(stored, currentMap);
  var hay = Object.keys(calc.safeMap).length > 0;

  var regOut = { cambios:0, ejemplos:[] }, paqOut = { cambios:0, ejemplos:[] }, calOut = { cambios:0, ejemplos:[] };
  if(hay){
    var rss = null; try{ rss = SpreadsheetApp.openById(RECEPCION_SHEET_ID); }catch(eR){ rss = null; }
    if(rss){
      var shReg = rss.getSheetByName('REGISTRO DEL DÍA') || rss.getSheetByName('REGISTRO DEL DIA');
      if(shReg) regOut = _propColNombre_(shReg, 'paciente', calc.safeMap, aplicar);
      var shPaq = _recHojaPorNombre_(rss, 'abono');
      if(shPaq){ paqOut = _propColNombre_(shPaq, 'titular', calc.safeMap, aplicar); if(paqOut.cambios===0) paqOut = _propColNombre_(shPaq, 'paciente', calc.safeMap, aplicar); }
    }
    calOut = _propagarCalendario_(calc.safeMap, PROPAGAR_CAL_PASADO, PROPAGAR_CAL_FUTURO, aplicar);
  }

  // Guardar la foto nueva SOLO al aplicar (merge: nunca pierde entradas de pacientes no leídos hoy).
  var guardadas = 0;
  if(aplicar){
    var merged = {}, k;
    for(k in stored) merged[k] = stored[k];
    for(k in currentMap) merged[k] = currentMap[k];
    guardadas = _snapGuardar_(ss, merged);
  }

  return {
    ok: true, aplicado: aplicar, baseline: (nPrevio===0),
    pacientesActuales: nActuales, snapshotPrevio: nPrevio, snapshotGuardado: guardadas,
    renombres: calc.renames.map(function(r){ return { de:r.old, a:r.nuevo }; }),
    ambiguos: calc.ambiguos,
    registro: regOut.cambios, ejemplosRegistro: regOut.ejemplos,
    paquetes: paqOut.cambios, ejemplosPaquetes: paqOut.ejemplos,
    calendario: calOut.cambios, ejemplosCalendario: calOut.ejemplos
  };
}

// ── Wrapper del disparador diario (nunca truena, no mata el trigger) ──
function propagarRenombresExpediente(e){
  try{ return propagarRenombresExpedienteImpl(true); }
  catch(err){ Logger.log('[propagarNombres] ERROR no mata el trigger: '+(err&&err.message)); return { ok:false, error:String(err&&err.message) }; }
}

// ── Para correr A MANO desde el editor ──
function probarPropagarNombres(){   // PREVIEW: no escribe nada, solo muestra qué haría
  var r = propagarRenombresExpedienteImpl(false);
  Logger.log(JSON.stringify(r, null, 2));
  return r;
}
function aplicarPropagarNombres(){  // APLICA + guarda la foto (la 1ª vez solo toma la foto base)
  var r = propagarRenombresExpedienteImpl(true);
  Logger.log(JSON.stringify(r, null, 2));
  return r;
}

// ── Instala el disparador diario (5am Qro). Correr UNA VEZ. ──
function instalarPropagarNombres(){
  ScriptApp.getProjectTriggers().forEach(function(t){ if(t.getHandlerFunction()==='propagarRenombresExpediente') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('propagarRenombresExpediente').timeBased().everyDays(1).atHour(5).inTimezone('America/Mexico_City').create();
  Logger.log('✅ Propagar-nombres instalado (diario 5am Qro).');
  return { ok:true, hora:'5am America/Mexico_City' };
}
