/**
 * RESPALDO DIARIO DE LA HOJA "Pacientes" → JSON en Google Drive
 * ------------------------------------------------------------------
 * Loop RESPALDO (#1): la Hoja es hoy el ÚNICO almacén del expediente clínico
 * de los ACTIVOS (sin espejo en Firestore). Este snapshot versionado protege
 * contra corrupción/borrado de filas (como la contaminación mig_pac_ ya limpiada).
 * Un espejo write-through NO sirve como backup: replicaría la corrupción. Esto sí,
 * porque guarda una copia fechada e inmutable por día.
 *
 * SEGURIDAD / ALCANCE (auditado):
 *  - NO lee, escribe ni expone PropertiesService (ni FIREBASE_WEB_API_KEY ni ANTHROPIC_API_KEY).
 *  - Sobre la Hoja: SOLO LECTURA (getDataRange().getValues()). No inserta, no ordena, no borra,
 *    no cambia formato. Imposible que altere o bloquee la operación de la clínica.
 *  - Escribe EXCLUSIVAMENTE en una carpeta propia de Drive ("Respaldos_Clinica").
 *  - Reutiliza la const global SHEET_ID ya declarada en Codigo.gs (mismo proyecto Apps Script).
 *    NO la redeclara (evita "Identifier already declared").
 *
 * INSTALACIÓN (una sola vez): ejecutar manualmente `crearTriggerRespaldoDiario` desde el editor.
 * Es idempotente: borra cualquier trigger previo de esta función antes de crear el nuevo.
 */

// Correo que recibe la alerta si el respaldo falla o si las filas caen >10% (posible corrupción).
// Supervisor de la clínica. Cambiar aquí si hace falta.
var RESPALDO_EMAIL_ALERTA = 'lftaranda@gmail.com';
var RESPALDO_CARPETA      = 'Respaldos_Clinica';
var RESPALDO_RETENER      = 60;    // conservar los últimos 60 archivos (≈2 meses); borra los más viejos
var RESPALDO_CAIDA_ALERTA = 0.10;  // alerta si las filas de hoy caen >10% vs el respaldo anterior

/** Trigger diario. Idempotente: el archivo del día se SOBREESCRIBE si ya existe (no duplica). */
function respaldoDiarioPacientes(){
  var hoy = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  try{
    // 1) LEER la Hoja (solo lectura).
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sh = ss.getSheetByName('Pacientes');
    if(!sh) throw new Error('No existe la pestaña "Pacientes"');
    var valores = sh.getDataRange().getValues();          // incluye encabezado en la fila 0
    var nFilasDatos = Math.max(0, valores.length - 1);    // filas de pacientes (sin encabezado)
    if(nFilasDatos === 0) throw new Error('La Hoja "Pacientes" devolvió 0 filas de datos');

    // 2) Serializar. El JSON guarda encabezado + filas crudas + metadatos de verificación.
    var payload = {
      fecha: hoy,
      generado: new Date().toISOString(),
      hoja: 'Pacientes',
      sheetId: SHEET_ID,
      totalColumnas: (valores[0] || []).length,
      totalFilasDatos: nFilasDatos,
      encabezado: valores[0] || [],
      filas: valores.slice(1)
    };
    var contenido = JSON.stringify(payload);

    // 3) Carpeta propia en Drive (crear si no existe).
    var carpeta = _respaldoCarpeta_();

    // 4) Escribir/ sobreescribir el archivo del día (idempotencia: mismo nombre → se actualiza).
    var nombre = 'Pacientes_' + hoy + '.json';
    var existentes = carpeta.getFilesByName(nombre);
    if(existentes.hasNext()){
      existentes.next().setContent(contenido);            // corrió 2 veces hoy → actualiza, no duplica
    } else {
      carpeta.createFile(nombre, contenido, 'application/json');
    }

    // 5) Detector de corrupción: comparar contra el respaldo ANTERIOR más reciente.
    var previo = _respaldoFilasDelAnterior_(carpeta, nombre);
    if(previo != null && previo > 0){
      var caida = (previo - nFilasDatos) / previo;
      if(caida > RESPALDO_CAIDA_ALERTA){
        _respaldoAlerta_('⚠️ Respaldo Clínica: caída de filas',
          'El respaldo de ' + hoy + ' tiene ' + nFilasDatos + ' filas, el anterior tenía ' + previo +
          ' (caída ' + Math.round(caida*100) + '%). Posible borrado/corrupción de la Hoja "Pacientes". Revisa antes de que se sobreescriba.');
      }
    }

    // 6) Retención: borrar los archivos más viejos por encima del tope.
    _respaldoPurgar_(carpeta);

    Logger.log('Respaldo OK ' + hoy + ' — ' + nFilasDatos + ' filas.');
  }catch(e){
    // Cualquier fallo (Hoja ausente, 0 filas, Drive) avisa al supervisor; NUNCA rompe nada más.
    _respaldoAlerta_('❌ Respaldo Clínica FALLÓ (' + hoy + ')', 'El respaldo diario no se generó: ' + (e && e.message));
    Logger.log('Respaldo FALLÓ: ' + (e && e.message));
  }
}

/** Carpeta "Respaldos_Clinica" (reutiliza la primera existente, si no la crea). */
function _respaldoCarpeta_(){
  var it = DriveApp.getFoldersByName(RESPALDO_CARPETA);
  return it.hasNext() ? it.next() : DriveApp.createFolder(RESPALDO_CARPETA);
}

/** Nº de filas del respaldo anterior más reciente (excluyendo el de hoy). null si no hay. */
function _respaldoFilasDelAnterior_(carpeta, nombreHoy){
  var mejorNombre = '', mejorFilas = null;
  var files = carpeta.getFilesByName ? carpeta.getFiles() : null;
  if(!files) return null;
  while(files.hasNext()){
    var f = files.next();
    var n = f.getName();
    if(n === nombreHoy) continue;                          // ignorar el de hoy
    if(!/^Pacientes_\d{4}-\d{2}-\d{2}\.json$/.test(n)) continue;
    if(n > mejorNombre){                                   // nombre con fecha ISO → orden lexicográfico = cronológico
      try{
        var d = JSON.parse(f.getBlob().getDataAsString());
        mejorNombre = n; mejorFilas = (d && d.totalFilasDatos != null) ? d.totalFilasDatos : null;
      }catch(_){ /* archivo ilegible: ignorar */ }
    }
  }
  return mejorFilas;
}

/** Conserva los últimos RESPALDO_RETENER archivos; manda los más viejos a la papelera. */
function _respaldoPurgar_(carpeta){
  var nombres = [];
  var files = carpeta.getFiles();
  while(files.hasNext()){
    var n = files.next().getName();
    if(/^Pacientes_\d{4}-\d{2}-\d{2}\.json$/.test(n)) nombres.push(n);
  }
  nombres.sort();                                          // ascendente por fecha
  var sobran = nombres.length - RESPALDO_RETENER;
  for(var i=0; i<sobran; i++){
    var it = carpeta.getFilesByName(nombres[i]);
    if(it.hasNext()) it.next().setTrashed(true);
  }
}

/** Envía la alerta por correo (si MailApp tiene cuota; si no, solo log). */
function _respaldoAlerta_(asunto, cuerpo){
  try{ MailApp.sendEmail(RESPALDO_EMAIL_ALERTA, asunto, cuerpo); }
  catch(e){ Logger.log('No se pudo enviar alerta: ' + (e && e.message)); }
}

/** INSTALADOR (ejecutar una vez a mano). Idempotente: elimina triggers previos de esta función. */
function crearTriggerRespaldoDiario(){
  ScriptApp.getProjectTriggers().forEach(function(t){
    if(t.getHandlerFunction() === 'respaldoDiarioPacientes') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('respaldoDiarioPacientes').timeBased().atHour(3).everyDays(1).create();
  Logger.log('Trigger diario creado (03:00). Respaldos en Drive: ' + RESPALDO_CARPETA);
}
