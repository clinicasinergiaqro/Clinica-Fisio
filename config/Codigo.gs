// ============================================================
// CLÍNICA SINERGIA — Google Apps Script v5
// Autenticación: Firebase ID Token (token legacy eliminado)
// Acciones privadas por POST; getEjerciciosPublicos público por GET
// ============================================================

const SHEET_ID = '1-8UYgdT4Bmte4BXcbtPfmsJJ6qpyzJXYIxnaCDEZW-s';

/* PASO 2 — Cierre del token legacy COMPLETADO.
   - Token legacy eliminado del frontend.
   - PERMITIR_TOKEN_LEGACY = false.
   - Acciones privadas (savePacientes, getPacientes, registrarAcceso,
     generarSoapIA, testPost) solo con Firebase ID Token, vía POST.
   - getEjerciciosPublicos sigue público (solo ejerciciosToken del paciente). */
const PERMITIR_TOKEN_LEGACY = false;

// Roles por correo (en minúsculas). Todos los usuarios autorizados configurados.
const ROLES_BACKEND = {
  'lftaranda@gmail.com': 'supervisor',

  // Fisioterapeutas autorizadas
  'gutierrezgarciazaray96@gmail.com': 'fisioterapeuta', // Zara
  'camislerma26@gmail.com': 'fisioterapeuta',           // Camila
  'dafnend26@gmail.com': 'fisioterapeuta',              // Daf
  'jriveare2000@hotmail.com': 'fisioterapeuta',          // Jess
  'dulcesalazar_1799@hotmail.com': 'fisioterapeuta'     // Dulce
};

const HEADERS = [
  'id','name','age','terapeuta','terapeutaSeguimiento','date','medicoReferente','dx',
  'contraindicaciones','alergias','antecedentes','motivo','valoracion',
  'dxFuncional','planTto','consentimiento','sesiones','soap','ejercicios',
  'fotos','docs','ejerciciosToken','ejerciciosLinkActivo','creadoPor',
  'fechaCreacion','fechaActualizacion','ultimoUsuario','historialCambios','updatedAt',
  'consentimientos',
  'fechaNacimiento','telefono','motivoConsulta',
  'soap2','soap3',
  'seguridadClinica',
  'motivosAnteriores',
  'etiquetas',
  'consentimientoDatos','consentimientoImagen','consentimientoWhatsApp',
  'sexo',
  'altaClinica','revaloraciones','eventosAdversos',
  'motivoActualIndex','numSesionEpisodioActual','fechaInicio',
  'revalSolicitada',
  // FIX PÉRDIDA DE DATOS: 'inasistencias' ("No acudió") y 'motivoHC' se escribían desde el front pero
  // NO existían como columna → el backend los descartaba y se perdían al recargar (solo activos; los
  // históricos ya iban por Firestore). Agregar la columna hace que persistan en el Sheet.
  'inasistencias','motivoHC',
  // CONEXIÓN CLAUDE — Fase 1: columna donde Claude deja sugerencias de mejora de la historia clínica
  // (SOLO propuestas para revisión; nunca sobrescribe campos clínicos). Es la ÚNICA columna que puede
  // escribir el endpoint claude*. Texto plano (no va en CAMPOS_JSON).
  'sugerenciaIA'
];

// ── SPRINT TOKEN PASO 1: validación de Firebase ID Token ──
// feat/appsscript-auth: decodifica el payload del JWT (base64url) para chequeos locales
// de exp/aud/iss ANTES del lookup de red. NO verifica firma (eso lo hace accounts:lookup,
// que sigue siendo la autoridad); esto agrega fail-fast y ata el token al proyecto.
function _decodificarJwtPayload_(idToken){
  try{
    var parts = String(idToken).split('.');
    if(parts.length !== 3) return null;
    var b64 = parts[1].replace(/-/g,'+').replace(/_/g,'/');
    while(b64.length % 4) b64 += '=';
    var json = Utilities.newBlob(Utilities.base64Decode(b64)).getDataAsString();
    return JSON.parse(json);
  }catch(e){ return null; }
}
function validarFirebaseIdToken(idToken){
  if(!idToken || typeof idToken!=='string') return {ok:false, error:'Token vacío'};
  // feat/appsscript-auth — endurecimiento local (sin red): estructura, expiración y proyecto.
  // aud = project id; iss = securetoken del MISMO proyecto (clinicasinergia-ec2cf).
  const claims = _decodificarJwtPayload_(idToken);
  if(!claims) return {ok:false, error:'Token malformado'};
  const ahoraSec = Math.floor(Date.now()/1000);
  if(!(Number(claims.exp) > ahoraSec)) return {ok:false, error:'Token expirado'};
  if(claims.aud !== 'clinicasinergia-ec2cf') return {ok:false, error:'Audiencia inválida (aud!=clinicasinergia-ec2cf)'};
  if(claims.iss !== 'https://securetoken.google.com/clinicasinergia-ec2cf') return {ok:false, error:'Emisor inválido'};
  try{
    const apiKey = PropertiesService.getScriptProperties().getProperty('FIREBASE_WEB_API_KEY');
    if(!apiKey) return {ok:false, error:'FIREBASE_WEB_API_KEY no configurada'};
    const res = UrlFetchApp.fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key='+apiKey,
      { method:'post', contentType:'application/json',
        payload: JSON.stringify({idToken: idToken}), muteHttpExceptions: true }
    );
    const d = JSON.parse(res.getContentText());
    if(!d.users || !d.users[0]) return {ok:false, error:'Token inválido'};
    const email = String(d.users[0].email||'').toLowerCase().trim();
    const role = ROLES_BACKEND[email] || null;
    if(!role) return {ok:false, error:'No autorizado: '+email};
    return {ok:true, email: email, role: role};
  }catch(e){
    return {ok:false, error:'Error validación: '+e.message};
  }
}

// REGLA: solo Firebase ID Token. Sin idToken → AUTH_REQUIRED. Legacy eliminado (PASO 2).
function validarRequestPrivado(body){
  if(body && body.idToken){
    const r = validarFirebaseIdToken(body.idToken);
    if(r.ok) return r;
    return {ok:false, error: r.error || 'Token Firebase inválido'};
  }
  return {ok:false, error:'AUTH_REQUIRED'};
}

// Lee todos los pacientes del Sheet y devuelve un array (usado por doGet y doPost)
function leerPacientes(ss){
  const sheet = getOrCreateSheet(ss);
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];
  const data = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  const CAMPOS_JSON = ['antecedentes','motivo','valoracion','dxFuncional',
    'planTto','consentimiento','soap','soap2','soap3','ejercicios','fotos','docs','historialCambios',
    'consentimientos','seguridadClinica','motivosAnteriores','etiquetas',
    'consentimientoDatos','consentimientoImagen','consentimientoWhatsApp',
    'altaClinica','revaloraciones','eventosAdversos','revalSolicitada',
    'inasistencias','motivoHC'];
  return data
    .filter(row => row[0] !== '')
    .map(row => {
      const obj = {};
      HEADERS.forEach((h, i) => {
        if (CAMPOS_JSON.includes(h)) {
          try { obj[h] = JSON.parse(row[i] || (h === 'consentimientos' ? '[]' : '{}')); }
          catch(e) { obj[h] = (h === 'consentimientos' ? [] : {}); }
        } else if (h === 'updatedAt') {
          obj[h] = Number(row[i]) || 0;
        } else {
          obj[h] = row[i];
        }
      });
      return obj;
    });
}

// Elimina filas cuyo nombre empieza con un prefijo (usado por QA TEST_QA_)
function eliminarPorPrefijo(ss, prefijo){
  const sheet = getOrCreateSheet(ss);
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const names = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
    for (let i = names.length - 1; i >= 0; i--) {
      if (String(names[i][0]).startsWith(prefijo)) {
        sheet.deleteRow(i + 2);
      }
    }
  }
  return respuesta({ok: true, accion: prefijo + ' eliminados del Sheets'});
}

function doGet(e) {
  try {
    // ── ENDPOINT PÚBLICO: ejercicios por token (NO requiere token de terapeuta) ──
    // Solo expone ejercicios activos del paciente dueño del ejerciciosToken.
    // Nunca expone historia, SOAP, dx, consentimiento, teléfono, docs ni otros pacientes.
    if (e.parameter.action === 'getEjerciciosPublicos') {
      const tokenPub = e.parameter.ejerciciosToken;
      if (!tokenPub) return respuesta({error: 'Falta token', code: 400});

      // ── PASO A: buscar el token en el Sheet (pacientes activos) ──
      const ssp = SpreadsheetApp.openById(SHEET_ID);
      const sheetP = getOrCreateSheet(ssp);
      const lastRowP = sheetP.getLastRow();
      const idxToken = HEADERS.indexOf('ejerciciosToken');
      const idxActivo = HEADERS.indexOf('ejerciciosLinkActivo');
      const idxNombre = HEADERS.indexOf('name');
      const idxEjercicios = HEADERS.indexOf('ejercicios');
      if (lastRowP > 1) {
        const dataP = sheetP.getRange(2, 1, lastRowP - 1, HEADERS.length).getValues();
        for (let r = 0; r < dataP.length; r++) {
          if (String(dataP[r][idxToken]) === String(tokenPub)) {
            if (String(dataP[r][idxActivo]) === 'false') {
              return respuesta({error: 'Link desactivado', code: 403});
            }
            let ejercicios = [];
            try { ejercicios = JSON.parse(dataP[r][idxEjercicios] || '[]'); } catch(err) { ejercicios = []; }
            const ejerciciosPublicos = ejercicios
              // PRIVACIDAD: el paciente SOLO ve ejercicios activos, de tarea para casa y NO privados.
              // Antes solo se filtraba por estado 'activo' → un ejercicio marcado 🔒 privado (o "solo
              // consulta", paraCasa:false) seguía llegando al paciente. Alineado con el filtro del front.
              .filter(ej => ej && (ej.estado || 'activo') === 'activo' && ej.privado !== true && ej.paraCasa !== false)
              .map(ej => ({
                nombre: ej.nombre || ej.name || '',
                dosis: ej.dosis || '',
                indicaciones: ej.indicaciones || '',
                precauciones: ej.precauciones || '',
                fecha: ej.fecha || '',
                terapeuta: ej.terapeuta || '',
                media: ej.media ? {
                  type: ej.media.type || '',
                  url: ej.media.url || '',
                  data: (ej.media.data && String(ej.media.data).indexOf('data:image/') === 0) ? ej.media.data : null
                } : null
              }));
            const nombreCompleto = String(dataP[r][idxNombre] || '');
            return respuesta({ ok: true, nombre: nombreCompleto, ejercicios: ejerciciosPublicos });
          }
        }
      }

      // ── PASO B (FALLBACK): token no estaba en el Sheet → buscar en Firestore ──
      // Históricos mig_pac_ guardan su ejerciciosToken en Firestore (nunca en el Sheet).
      // Devuelve la misma estructura que el Sheet para que el cliente no note diferencia.
      // Requiere Script Properties: FIRESTORE_SA_EMAIL, FIRESTORE_SA_KEY, FIRESTORE_PROJECT_ID.
      try {
        const props = PropertiesService.getScriptProperties();
        const SA_EMAIL = props.getProperty('FIRESTORE_SA_EMAIL');
        const SA_KEY = props.getProperty('FIRESTORE_SA_KEY');
        const FS_PROJECT = props.getProperty('FIRESTORE_PROJECT_ID') || 'clinicasinergia-ec2cf';
        if (SA_EMAIL && SA_KEY) {
          // 1) Firmar JWT (RS256) y canjearlo por access token con scope datastore.
          const _b64url = (s) => Utilities.base64EncodeWebSafe(s).replace(/=+$/, '');
          const nowSec = Math.floor(Date.now() / 1000);
          const jwtHeader = _b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
          const jwtClaim = _b64url(JSON.stringify({
            iss: SA_EMAIL,
            scope: 'https://www.googleapis.com/auth/datastore',
            aud: 'https://oauth2.googleapis.com/token',
            iat: nowSec, exp: nowSec + 3600
          }));
          const jwtUnsigned = jwtHeader + '.' + jwtClaim;
          const sigBytes = Utilities.computeRsaSha256Signature(jwtUnsigned, SA_KEY.replace(/\\n/g, '\n'));
          const assertion = jwtUnsigned + '.' + Utilities.base64EncodeWebSafe(sigBytes).replace(/=+$/, '');
          const tokRes = UrlFetchApp.fetch('https://oauth2.googleapis.com/token', {
            method: 'post', muteHttpExceptions: true,
            payload: { grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: assertion }
          });
          const accessToken = (JSON.parse(tokRes.getContentText() || '{}') || {}).access_token;
          if (accessToken) {
            // 2) runQuery: pacientes WHERE ejerciciosToken == tokenPub (limit 1).
            const q = { structuredQuery: {
              from: [{ collectionId: 'pacientes' }],
              where: { fieldFilter: {
                field: { fieldPath: 'ejerciciosToken' },
                op: 'EQUAL',
                value: { stringValue: String(tokenPub) }
              }},
              limit: 1
            }};
            const qUrl = 'https://firestore.googleapis.com/v1/projects/' + FS_PROJECT +
                         '/databases/(default)/documents:runQuery';
            const qRes = UrlFetchApp.fetch(qUrl, {
              method: 'post', contentType: 'application/json',
              headers: { Authorization: 'Bearer ' + accessToken },
              muteHttpExceptions: true, payload: JSON.stringify(q)
            });
            const rows = JSON.parse(qRes.getContentText() || '[]') || [];
            let docFields = null;
            for (let k = 0; k < rows.length; k++) {
              if (rows[k] && rows[k].document && rows[k].document.fields) { docFields = rows[k].document.fields; break; }
            }
            if (docFields) {
              // Decodificador de valores Firestore REST → JS plano (recursivo).
              const _fsVal = (v) => {
                if (v == null) return null;
                if ('stringValue' in v) return v.stringValue;
                if ('booleanValue' in v) return v.booleanValue;
                if ('integerValue' in v) return Number(v.integerValue);
                if ('doubleValue' in v) return v.doubleValue;
                if ('nullValue' in v) return null;
                if ('timestampValue' in v) return v.timestampValue;
                if ('mapValue' in v) { const o = {}; const f = (v.mapValue.fields || {}); for (const kk in f) o[kk] = _fsVal(f[kk]); return o; }
                if ('arrayValue' in v) { return ((v.arrayValue.values) || []).map(_fsVal); }
                return null;
              };
              const linkActivo = ('ejerciciosLinkActivo' in docFields) ? _fsVal(docFields.ejerciciosLinkActivo) : true;
              if (linkActivo === false) {
                return respuesta({error: 'Link desactivado', code: 403});
              }
              let ejerciciosFS = ('ejercicios' in docFields) ? _fsVal(docFields.ejercicios) : [];
              if (!Array.isArray(ejerciciosFS)) ejerciciosFS = [];
              const nombreFS = ('name' in docFields) ? (_fsVal(docFields.name) || '') : '';
              const ejerciciosPublicosFS = ejerciciosFS
                // PRIVACIDAD (mismo criterio que el Sheet): activo + para casa + NO privado.
                .filter(ej => ej && (ej.estado || 'activo') === 'activo' && ej.privado !== true && ej.paraCasa !== false)
                .map(ej => ({
                  nombre: ej.nombre || ej.name || '',
                  dosis: ej.dosis || '',
                  indicaciones: ej.indicaciones || '',
                  precauciones: ej.precauciones || '',
                  fecha: ej.fecha || '',
                  terapeuta: ej.terapeuta || '',
                  media: ej.media ? {
                    type: ej.media.type || '',
                    url: ej.media.url || '',
                    data: (ej.media.data && String(ej.media.data).indexOf('data:image/') === 0) ? ej.media.data : null
                  } : null
                }));
              return respuesta({ ok: true, nombre: String(nombreFS || ''), ejercicios: ejerciciosPublicosFS });
            }
          }
        }
      } catch (fsErr) {
        // El fallback nunca rompe el endpoint: si algo falla, cae al 404 normal.
      }

      // ── No estaba ni en el Sheet ni en Firestore ──
      return respuesta({error: 'No encontrado', code: 404});
    }

    // PASO 2: doGet solo expone getEjerciciosPublicos. Cualquier otra acción
    // debe ir por POST con Firebase ID Token.
    return respuesta({
      ok: false,
      error: 'POST_REQUIRED',
      message: 'Las acciones privadas requieren POST con Firebase ID Token',
      code: 405
    });
  } catch(err) {
    return respuesta({error: err.toString()});
  }
}

// POST como respaldo para payloads grandes
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    // ── CONEXIÓN CLAUDE — Fase 1 ──
    // Las acciones que empiezan con "claude" se autentican con CLAUDE_TOKEN (no con Firebase ID Token),
    // por eso se rutean ANTES de validarRequestPrivado. La autenticación real la hace _claudeRouter_.
    if (String(body.action || '').indexOf('claude') === 0) {
      return _claudeRouter_(body);
    }

    const auth = validarRequestPrivado(body);
    if (!auth.ok) {
      return respuesta({ok:false, error: auth.error, code: 401});
    }
    const ss = SpreadsheetApp.openById(SHEET_ID);
    if (body.action === 'getPacientes') {
      return respuesta(leerPacientes(ss));
    }
    if (body.action === 'savePacientes') {
      // El candado (LockService) ahora vive DENTRO de guardarPacientesConMerge_ (punto único para
      // savePacientes y las escrituras claude*), así que aquí ya no se toma por fuera.
      try {
        return respuesta(guardarPacientesConMerge_(ss, body.data || body.datos || [], {email: auth.email, userAgent: body.userAgent}));
      } catch(eMergeGlobal) {
        var msgE = String(eMergeGlobal.message || '');
        if (msgE.indexOf('LOCK_TIMEOUT') >= 0) {
          return respuesta({ok:false, error:'LOCK_TIMEOUT', msg:'El sistema está ocupado. Tus cambios se conservarán localmente.'});
        }
        if (msgE.indexOf('MERGE_ERROR') >= 0) {
          return respuesta({ok:false, error:'MERGE_ERROR', msg:'No se pudo completar el merge seguro. Tus cambios se conservarán localmente.'});
        }
        return respuesta({ok:false, error:'SAVE_ERROR', msg: msgE || 'Error al guardar pacientes'});
      }
    }
    if (body.action === 'generarSoapIA') {
      return generarSoapIA(body);
    }
    if (body.action === 'registrarAcceso') {
      return registrarAccesoBitacora(ss, body);
    }
    if (body.action === 'validarPermisoExportacion') {
      if (auth.role !== 'supervisor') {
        return respuesta({ok:false, error:'SIN_PERMISO', msg:'Solo el supervisor puede exportar datos completos.'});
      }
      return respuesta({ok:true, permiso:'exportacion-total', usuario:auth.email});
    }
    // C1 FIX — eliminar paciente del Sheet para que loadFromCloud no lo reinyecte
    if (body.action === 'deletePaciente') {
      // FIX seguridad: borrar es acción de SUPERVISOR (antes cualquier terapeuta autenticado borraba
      // la fila de cualquier paciente por id). Mismo patrón que export/reporte.
      if (!auth || auth.role !== 'supervisor') {
        return respuesta({ok:false, error:'Solo supervisor puede borrar', code:403});
      }
      var idBorrar = String(body.id || '').trim();
      if (!idBorrar) {
        return respuesta({ok:false, error:'Falta body.id', code:400});
      }
      // mig_pac_ nunca viven en el Sheet — guard para no tocar nada por error
      if (idBorrar.indexOf('mig_pac_') === 0) {
        return respuesta({ok:false, error:'mig_pac_ no vive en el Sheet', code:400});
      }
      // FIX concurrencia (LockService): el read-modify (buscar la fila) + deleteRow no debe intercalarse
      // con un savePacientes/claude* concurrente (correrían los índices de fila).
      var _lockD = LockService.getScriptLock();
      try { _lockD.waitLock(15000); } catch (eLkD) { return respuesta({ok:false, error:'LOCK_TIMEOUT', msg:'Sistema ocupado, reintenta.'}); }
      try {
        var sheetD = getOrCreateSheet(ss);
        var lastRowD = sheetD.getLastRow();
        if (lastRowD <= 1) {
          Logger.log('[deletePaciente] Sheet vacío — id=' + idBorrar + ' (ok, idempotente)');
          return respuesta({ok:true, deleted:false, msg:'Sheet vacío'});
        }
        var idsCol = sheetD.getRange(2, 1, lastRowD - 1, 1).getValues();
        var filaEliminar = -1;
        for (var di = 0; di < idsCol.length; di++) {
          if (String(idsCol[di][0]).trim() === idBorrar) {
            filaEliminar = di + 2;
            break;
          }
        }
        if (filaEliminar > 0) {
          sheetD.deleteRow(filaEliminar);
          Logger.log('[deletePaciente] ELIMINADO id=' + idBorrar + ' fila=' + filaEliminar + ' por ' + auth.email);
          return respuesta({ok:true, deleted:true});
        } else {
          Logger.log('[deletePaciente] No encontrado id=' + idBorrar + ' — ok (idempotente) por ' + auth.email);
          return respuesta({ok:true, deleted:false, msg:'No encontrado en Sheet'});
        }
      } finally { try { _lockD.releaseLock(); } catch (_rD) {} }
    }
    if (body.action === 'deleteTestQA') {
      if (!auth || auth.role !== 'supervisor') return respuesta({ok:false, error:'Solo supervisor', code:403});
      return eliminarPorPrefijo(ss, 'TEST QA');
    }
    if (body.action === 'deleteTestQATerapeutas') {
      if (!auth || auth.role !== 'supervisor') return respuesta({ok:false, error:'Solo supervisor', code:403});
      return eliminarPorPrefijo(ss, 'TEST_QA_');
    }
    if (body.action === 'testPost') {
      const chars = (e.postData && e.postData.contents) ? e.postData.contents.length : 0;
      return respuesta({ok:true, recibido:true, chars: chars});
    }
    if (body.action === 'leerAgenda') {
      return respuesta(leerAgenda(body.rango || 'dia', body.desde, body.hasta));
    }
    // Envía por correo el reporte de "notas faltantes" que arma el cliente (mismo motor del tablero
    // de Rendimiento). Destinatario FIJO = supervisor; el cuerpo trae PHI, por eso jamás a un correo
    // variable. dedupKey (opcional) evita reenviar el mismo reporte automático el mismo día.
    if (body.action === 'enviarReporteCorreo') {
      if (auth.role !== 'supervisor') {
        return respuesta({ ok: false, error: 'SIN_PERMISO', msg: 'Solo el supervisor puede enviar reportes.' });
      }
      var REPORTE_TO = 'lftaranda@gmail.com';   // destinatario fijo (supervisor)
      var htmlR = String(body.html || '');
      if (!htmlR) return respuesta({ ok: false, error: 'SIN_CONTENIDO' });
      var propsR = PropertiesService.getScriptProperties();
      var dk = String(body.dedupKey || '').trim();
      if (dk) {
        var yaR = propsR.getProperty('REPORTE_ENVIADO_' + dk);
        if (yaR) return respuesta({ ok: true, enviado: false, motivo: 'YA_ENVIADO', cuando: yaR });
      }
      var asuntoR = String(body.asunto || 'Reporte de desempeño — Clínica Sinergia');
      // Adjuntos: PDF de desempeño por terapeuta (nuestro formato), llegan como base64 desde el cliente.
      var adjIn = Array.isArray(body.adjuntos) ? body.adjuntos : [];
      var attachments = [];
      try {
        adjIn.forEach(function (a) {
          if (a && a.b64) attachments.push(Utilities.newBlob(Utilities.base64Decode(a.b64), 'application/pdf', String(a.nombre || 'desempeno.pdf')));
        });
      } catch (eB) {
        return respuesta({ ok: false, error: 'ADJUNTO_ERROR', msg: String(eB && eB.message || eB) });
      }
      try {
        var opcMail = { to: REPORTE_TO, subject: asuntoR, htmlBody: htmlR };
        if (attachments.length) opcMail.attachments = attachments;
        MailApp.sendEmail(opcMail);
      } catch (eMail) {
        return respuesta({ ok: false, error: 'MAIL_ERROR', msg: String(eMail && eMail.message || eMail) });
      }
      if (dk) propsR.setProperty('REPORTE_ENVIADO_' + dk, new Date().toISOString());
      return respuesta({ ok: true, enviado: true, to: REPORTE_TO });
    }
    if (body.action === 'interpretarEstudio') {
      return interpretarEstudioIA(body);
    }
    if (body.action === 'generarSintesisIA') {
      return generarSintesisIA_(body);
    }
    return respuesta({error: 'Acción no reconocida'});
  } catch(err) {
    return respuesta({error: err.toString()});
  }
}

// ── BITÁCORA DE ACCESOS ──
function registrarAccesoBitacora(ss, body) {
  try {
    var sh = ss.getSheetByName('Bitacora');
    if (!sh) {
      sh = ss.insertSheet('Bitacora');
      sh.appendRow(['fecha','hora','accion','usuario','correo','rol','userAgent','registradoEn']);
    }
    sh.appendRow([
      body.fecha || '',
      body.hora || '',
      body.accion || '',
      body.usuario || '',
      body.correo || '',
      body.rol || '',
      (body.userAgent || '').slice(0,200),
      new Date().toISOString()
    ]);
    return respuesta({ok: true});
  } catch(err) {
    return respuesta({ok: false, error: err.toString()});
  }
}

// ── INTELIGENCIA CLÍNICA v3.0 ──
var MODELO_IA = 'claude-sonnet-4-6';

function _parseJSONClaude(texto) {
  if (!texto) throw new Error('Respuesta vacía');
  var t = String(texto).replace(/```json/gi, '').replace(/```/g, '').trim();
  var i = t.indexOf('{'), j = t.lastIndexOf('}');
  if (i === -1 || j === -1 || j < i) throw new Error('Sin JSON en respuesta');
  return JSON.parse(t.slice(i, j + 1));
}

function generarSoapIA(body) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  if (!apiKey) {
    return respuesta({error: 'API key no configurada. Agrega ANTHROPIC_API_KEY en Propiedades del proyecto.'});
  }

  const notaLibre   = String(body.notaLibre   || '').trim();
  const edadReal    = String(body.edadReal    || body.edadRango || '').trim();
  const diagnostico = String(body.diagnostico || '').trim();
  const numSesion   = String(body.numSesion   || '').trim();
  const modalidades = String(body.modalidades || '').trim();
  const eva         = String(body.eva         || '').trim();
  // ── Loop P1: campos de contexto longitudinal (opcionales; modo rápido no los envía) ──
  const motivoEpisodio    = String(body.motivoEpisodio    || '').trim();
  const numSesionEpisodio = String(body.numSesionEpisodio || '').trim();
  const planTratamiento   = String(body.planTratamiento   || '').trim();
  const contraindicP1     = String(body.contraindicaciones|| '').trim();
  const banderasRojasP1   = String(body.banderasRojas     || '').trim();
  const sesionAnteriorP1  = String(body.sesionAnterior    || '').trim();
  const tendenciaEVAP1    = String(body.tendenciaEVA      || '').trim();

  if (!notaLibre) {
    return respuesta({error: 'Se requiere el texto de la nota libre.'});
  }

  let contexto = '';
  if (edadReal    && edadReal !== 'No especificada') contexto += 'Edad del paciente: '               + edadReal    + '\n';
  if (diagnostico)                                   contexto += 'Diagnostico del expediente: '      + diagnostico + '\n';
  if (numSesion)                                     contexto += 'Numero de sesion actual: '         + numSesion   + '\n';
  if (modalidades)                                   contexto += 'Modalidades seleccionadas: '       + modalidades + '\n';
  if (eva)                                           contexto += 'EVA (solo si fue capturada): '     + eva         + '\n';
  // ── Loop P1: inyección en userMessage — hereda el framing "no inventar datos adicionales" ──
  if (motivoEpisodio)    contexto += 'Motivo del episodio actual: '           + motivoEpisodio    + '\n';
  if (numSesionEpisodio) contexto += 'Numero de sesion dentro del episodio: ' + numSesionEpisodio + '\n';
  if (planTratamiento)   contexto += 'Plan de tratamiento vigente: '          + planTratamiento   + '\n';
  if (contraindicP1)     contexto += 'Contraindicaciones vigentes: '          + contraindicP1     + '\n';
  if (banderasRojasP1)   contexto += 'Banderas rojas del paciente: '          + banderasRojasP1   + '\n';
  if (sesionAnteriorP1)  contexto += 'Resumen de la sesion anterior: '        + sesionAnteriorP1  + '\n';
  if (tendenciaEVAP1)    contexto += 'Tendencia de EVA en el episodio: '      + tendenciaEVAP1    + '\n';

  const userMessage = contexto
    ? 'CONTEXTO CLINICO REAL (no inventar datos adicionales):\n' + contexto + '\nNOTA LIBRE DEL TERAPEUTA:\n' + notaLibre
    : 'NOTA LIBRE DEL TERAPEUTA:\n' + notaLibre;

  const listaMods = ['Tecarterapia resistiva','Tecarterapia capacitiva','Ultrasonido',
    'L\u00e1ser','Ondas de choque','Aguja seca','MEP','Electroterapia','Corriente Aura','ILIB',
    'Ejercicio terap\u00e9utico','Estiramiento','Movilidad pasiva','Movilidad activa',
    'Propiocepci\u00f3n / Equilibrio','Readaptaci\u00f3n deportiva','Programa domiciliario',
    'Terapia manual','Masoterapia','Liberaci\u00f3n miofascial','Punci\u00f3n seca',
    'Vendaje neuromuscular','Presoterapia','Termoterapia','Crioterapia',
    'Drenaje linf\u00e1tico','Tracciones','Otra'];

  const systemPrompt =
    'Eres un asistente clinico especializado en fisioterapia y rehabilitacion. Tu tarea es convertir ' +
    'una nota libre del terapeuta en una nota SOAP estructurada para expediente clinico.\n\n' +
    'NO eres quien diagnostica ni inventa datos. Solo puedes usar informacion explicitamente escrita ' +
    'en la nota libre o enviada como contexto real.\n\n' +
    'NO inventes: edad, sexo, EVA final, ROM, fuerza, pruebas especiales, hallazgos objetivos, ' +
    'respuesta al tratamiento, parametros de agentes fisicos, diagnosticos ni evolucion clinica.\n\n' +
    'Si falta informacion usa exactamente: [pendiente] o "No especificado en la nota."\n\n' +
    'REGLAS POR CAMPO:\n' +
    '- s.dolor: sintomas, localizacion, intensidad, provocacion y limitaciones referidas por el paciente. NO incluir nombre ni edad.\n' +
    '- s.cambios: solo cambios desde ultima sesion. Si no se mencionan: [pendiente]\n' +
    '- s.actFisica: deporte, marcha, actividades que provocan dolor. Si no se menciona: [pendiente]\n' +
    '- o.rom: SOLO rangos medidos u observados en la nota. Si no hay: [pendiente]\n' +
    '- o.fuerza: SOLO fuerza medida o descrita. Si no hay: [pendiente]\n' +
    '- o.hallazgos: palpacion, edema, pruebas clinicas documentadas. Si no hay: [pendiente]\n' +
    '- a.evolucion: evolucion documentada vs sesion previa. Si no hay comparacion: [pendiente]\n' +
    '- a.respuesta: respuesta al tratamiento SOLO si fue descrita explicitamente. Si no: [pendiente]\n' +
    '- a.analisis: razonamiento clinico breve y prudente. NO inventar diagnostico definitivo.\n' +
    '- p.tratamiento: tecnicas y modalidades aplicadas en esta sesion.\n' +
    '- p.indicaciones: ejercicios o recomendaciones para casa. Separar de tratamiento aplicado.\n' +
    '- p.contraindicaciones: precauciones vigentes. NUNCA copiar aqui el tratamiento aplicado. Si no hay: "No especificadas en la nota."\n' +
    '- eva.inicio: numero entero solo si nota menciona dolor actual o EVA con numero claro. Si no: null.\n' +
    '- eva.final: numero entero SOLO si nota dice explicitamente "al final quedo", "EVA final", "bajo de X a Y", ' +
    '"posterior al tratamiento", "termino con EVA". En cualquier otro caso: null. NUNCA inventar.\n' +
    '- modalidades: seleccionar UNICAMENTE las que aparecen en esta lista: ' + JSON.stringify(listaMods) + '. ' +
    'Si se mencionan estiramientos: "Programa domiciliario". Si modalidad no esta en la lista: no seleccionar, anotarla en alertasPendientes.\n' +
    '- alertasPendientes: lista de strings con datos faltantes importantes.\n\n' +
    'Responde UNICAMENTE JSON valido con estas claves exactas en minusculas: s, o, a, p, eva, modalidades, alertasPendientes.\n' +
    'Cada subclave de s/o/a/p es texto plano en espanol. Sin objetos anidados adicionales. Sin markdown. Sin claves S/O/A/P en mayusculas.\n' +
    'Estructura exacta:\n' +
    '{"s":{"dolor":"","cambios":"","actFisica":""},' +
    '"o":{"rom":"","fuerza":"","hallazgos":""},' +
    '"a":{"evolucion":"","respuesta":"","analisis":""},' +
    '"p":{"tratamiento":"","indicaciones":"","contraindicaciones":""},' +
    '"eva":{"inicio":null,"final":null},' +
    '"modalidades":[],' +
    '"alertasPendientes":[]}';

  const systemPromptRapido =
    'Eres fisioterapeuta. Convierte la nota libre en SOAP estructurado. ' +
    'NO inventes datos. Si falta algo usa [pendiente]. ' +
    'eva.final SOLO si la nota lo dice explicitamente, si no null. NUNCA inventar EVA final. ' +
    'modalidades: solo de esta lista: ' + JSON.stringify(listaMods) + '. ' +
    'Si se mencionan estiramientos: "Programa domiciliario".\n' +
    'Responde UNICAMENTE JSON valido, claves minusculas, estructura exacta:\n' +
    '{"s":{"dolor":"","cambios":"","actFisica":""},' +
    '"o":{"rom":"","fuerza":"","hallazgos":""},' +
    '"a":{"evolucion":"","respuesta":"","analisis":""},' +
    '"p":{"tratamiento":"","indicaciones":"","contraindicaciones":""},' +
    '"eva":{"inicio":null,"final":null},' +
    '"modalidades":[],' +
    '"alertasPendientes":[]}';

  const promptElegido = (body.modoRapido === true) ? systemPromptRapido : systemPrompt;

  const payload = {
    model: MODELO_IA,   // FIX: id centralizado (antes literal duplicado). VERIFICAR que MODELO_IA (L496) sea un modelo vigente de la API o TODA la IA falla.
    max_tokens: 1500,
    system: promptElegido,
    messages: [{role: 'user', content: userMessage}]
  };

  let respClaude;
  try {
    const httpResp = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    respClaude = JSON.parse(httpResp.getContentText());
  } catch(err) {
    return respuesta({error: 'Error al llamar Claude API: ' + err.toString()});
  }

  if (respClaude.error) {
    return respuesta({error: 'Claude API error: ' + (respClaude.error.message || JSON.stringify(respClaude.error))});
  }

  const textoCrudo = (respClaude.content && respClaude.content[0] && respClaude.content[0].text) || '';
  if (!textoCrudo) {
    return respuesta({error: 'Claude no devolvio texto. Respuesta: ' + JSON.stringify(respClaude)});
  }

  const textoLimpio = textoCrudo.replace(/^```json\s*/,'').replace(/\s*```$/,'').trim();
  let soap;
  try {
    soap = JSON.parse(textoLimpio);
  } catch(err) {
    return respuesta({error: 'Respuesta no es JSON valido.', textoCrudo: textoCrudo});
  }

  if (!soap.s || !soap.o || !soap.a || !soap.p) {
    if (soap.S || soap.O || soap.A || soap.P) {
      soap = {
        s: soap.S || {dolor:'',cambios:'',actFisica:''},
        o: soap.O || {rom:'',fuerza:'',hallazgos:''},
        a: soap.A || {evolucion:'',respuesta:'',analisis:''},
        p: soap.P || {tratamiento:'',indicaciones:'',contraindicaciones:''},
        eva: {inicio: null, final: null},
        modalidades: [],
        alertasPendientes: []
      };
    } else {
      return respuesta({error: 'JSON incompleto (faltan claves s/o/a/p).', soap: soap});
    }
  }

  if (!soap.eva) soap.eva = {inicio: null, final: null};
  if (soap.eva.final === undefined) soap.eva.final = null;
  if (!Array.isArray(soap.modalidades)) soap.modalidades = [];
  if (!Array.isArray(soap.alertasPendientes)) soap.alertasPendientes = [];

  return respuesta({ok: true, soap: soap});
}

function interpretarEstudioIA(body) {
  var apiKey = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  if (!apiKey) return respuesta({ error: 'API key no configurada' });

  var base64 = body.base64;
  var mediaType = body.mediaType || 'image/jpeg';
  var esPDF = !!body.esPDF;
  var tipo = body.tipo || 'imagen';
  var nombrePaciente = body.nombrePaciente || '';
  if (!base64) return respuesta({ error: 'Sin archivo' });

  var GUARD =
    'REGLA CRÍTICA: transcribe SOLO lo que el documento dice. No diagnostiques.\n' +
    'Si el estudio NO trae un reporte de texto escrito por un médico/radiólogo ' +
    '(por ejemplo, solo son imágenes crudas sin texto), NO inventes hallazgos: responde con ' +
    'tipoDetectado:"imagen_sin_reporte" y deja hallazgos vacío.\n' +
    'Cada dato transcrito de un médico lleva origen:"documentado". ' +
    'Solo puedes añadir UNA nota propia en relevanciaFisio con origen:"ia".\n' +
    'No adivines cédulas, dosis ni nombres: si es ilegible usa null.\n' +
    'Responde SOLO JSON válido, sin markdown ni backticks.\n\n';

  var promptReceta = GUARD +
    'Analiza esta RECETA / INDICACIÓN MÉDICA y extrae:\n' +
    '{"tipoDetectado":"receta","origen":"documentado","medicoReferente":"nombre y especialidad o null",' +
    '"cedulaMedico":"cédula o null","diagnostico":"diagnósticos del médico",' +
    '"plan":"plan/indicaciones","medicamentos":["med1 con dosis","med2"],' +
    '"sesiones":número_o_null,"contraindicaciones":"o null","fecha":"o null",' +
    '"relevanciaFisio":"1 nota breve para fisio, origen ia, o null",' +
    '"resumenCorto":"1-2 oraciones esenciales para el fisioterapeuta"}';

  var promptInterpretacion = GUARD +
    'Analiza este ESTUDIO DE IMAGEN o LABORATORIO. Si trae reporte médico/radiólogo, extrae:\n' +
    '{"tipoDetectado":"resonancia|rx|ultrasonido|tac|laboratorio","origen":"documentado",' +
    '"tecnica":"técnica usada","zonaAnatomica":"zona estudiada",' +
    '"hallazgos":["hallazgo1","hallazgo2"],"conclusion":"conclusión del radiólogo",' +
    '"medicoReferente":"médico que solicitó o null","radiologo":"radiólogo que firmó o null",' +
    '"cedulaMedico":"cédula o null","fecha":"o null",' +
    '"relevanciaFisio":"1 nota para fisio, origen ia, o null",' +
    '"resumenCorto":"2-3 oraciones con lo relevante para fisioterapia"}\n' +
    'Si NO hay reporte médico de texto: {"tipoDetectado":"imagen_sin_reporte","hallazgos":[],"conclusion":null}';

  var promptGeneral = GUARD +
    'Analiza este documento médico y extrae:\n' +
    '{"tipoDetectado":"tipo del doc","origen":"documentado","diagnostico":"o null",' +
    '"hallazgos":["o vacío"],"conclusion":"o null","medicoReferente":"o null","fecha":"o null",' +
    '"resumenCorto":"1-2 oraciones"}';

  var prompt = tipo === 'receta' ? promptReceta
    : tipo === 'interpretacion' ? promptInterpretacion
    : promptGeneral;

  // FIX privacidad (LFPDPPP): no enviar el nombre del paciente a un tercero (Anthropic). El modelo no lo
  // necesita para interpretar el estudio. Se conserva nombrePaciente en el servidor (logs/uso local) pero
  // NO viaja en el prompt.
  var userContent = esPDF
    ? [{ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } },
       { type: 'text', text: 'Analiza este documento clínico.' }]
    : [{ type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
       { type: 'text', text: 'Analiza este documento clínico.' }];

  try {
    var httpResp = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
      method: 'post', contentType: 'application/json',
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      payload: JSON.stringify({ model: MODELO_IA, max_tokens: 2000, system: prompt, messages: [{ role: 'user', content: userContent }] }),
      muteHttpExceptions: true
    });
    var respClaude = JSON.parse(httpResp.getContentText());
    if (respClaude.error) return respuesta({ error: 'Claude: ' + (respClaude.error.message || '') });
    var texto = (respClaude.content && respClaude.content[0] && respClaude.content[0].text) || '';
    return respuesta({ ok: true, resumen: _parseJSONClaude(texto) });
  } catch (e) {
    return respuesta({ error: 'Error: ' + e.message });
  }
}

function generarSintesisIA_(body) {
  var apiKey = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  if (!apiKey) return respuesta({ error: 'API key no configurada' });
  var p = body.payload;
  if (!p) return respuesta({ error: 'Sin payload' });

  var systemPrompt =
    'Eres asistente clínico de fisioterapia. Genera SOLO dos campos JSON:\n' +
    '1. sintesisEjecutiva: 3-4 oraciones clínicas concisas sobre evolución, estado actual y punto de inflexión.\n' +
    '2. recomendaciones: {corto:[], mediano:[], largo:[]} — máx 4 bullets cada uno.\n\n' +
    'REGLAS:\n' +
    '- No inventes datos. No diagnóstico médico. Solo interpretación funcional.\n' +
    '- Si hay anticoagulante o contraindicaciones -> mencionarlo en corto.\n' +
    '- Si EVA final > inicial -> señalarlo como área de atención.\n' +
    '- Bullets concisos, accionables, en español clínico.\n' +
    'Responde SOLO JSON: {"sintesisEjecutiva":"...","recomendaciones":{"corto":[],"mediano":[],"largo":[]}}';

  var userMsg =
    // FIX privacidad (LFPDPPP): no enviar el nombre del paciente a Anthropic; la edad basta para el contexto clínico.
    'Paciente de ' + (p.edad || '?') + ' años.\n' +
    'Dx funcional: ' + (p.dxFuncional || 'Sin documentar') + '\n' +
    'Contraindicaciones: ' + (p.contraindicaciones || 'Ninguna') + '\n' +
    'Medicamentos: ' + (p.medicamentos || 'No documentados') + '\n' +
    'Total sesiones: ' + (p.totalSesiones || 0) +
    ' | EVA: inicial ' + (p.evaInicial !== null && p.evaInicial !== undefined ? p.evaInicial : '?') +
    ' -> pico ' + (p.evaPico !== null && p.evaPico !== undefined ? p.evaPico : '?') +
    ' -> final ' + (p.evaFinal !== null && p.evaFinal !== undefined ? p.evaFinal : '?') + '\n' +
    'Ultimas sesiones:\n' + JSON.stringify((p.sesiones || []).slice(-5)) + '\n' +
    (p.estudiosResumen && p.estudiosResumen.length ? 'Estudios: ' + p.estudiosResumen.join(' | ') + '\n' : '') +
    'Genera sintesis y recomendaciones.';

  try {
    var resp = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
      method: 'post', contentType: 'application/json',
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      payload: JSON.stringify({ model: MODELO_IA, max_tokens: 800, system: systemPrompt, messages: [{ role: 'user', content: userMsg }] }),
      muteHttpExceptions: true
    });
    var parsed = JSON.parse(resp.getContentText());
    if (parsed.error) return respuesta({ error: 'Claude: ' + (parsed.error.message || 'error') });
    var texto = (parsed.content && parsed.content[0] && parsed.content[0].text) || '';
    var json = _parseJSONClaude(texto);
    if (!json.sintesisEjecutiva || !json.recomendaciones) return respuesta({ error: 'Respuesta incompleta' });
    return respuesta({ ok: true, sintesis: json });
  } catch (e) {
    return respuesta({ error: 'Error: ' + e.message });
  }
}

function testGenerarSoapIA() {
  const resultado = generarSoapIA({
    notaLibre: 'El paciente llegó con menos dolor que la sesión anterior, dice que pudo caminar 20 minutos sin molestia. Hicimos ejercicios excéntricos de tibial posterior, ultrasonido en inserción y TENS. Al final refirió mejoría del dolor de 7 a 4.',
    edadRango: '40-50 años',
    diagnostico: 'Tendinopatía tibial posterior',
    numSesion: '3',
    modalidades: 'Ultrasonido, TENS, ejercicio terapéutico',
    eva: 'Inicio 7/10, Final 4/10'
  });
  Logger.log(resultado.getContent());
}

function respuesta(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(ss) {
  let sheet = ss.getSheetByName('Pacientes');
  if (!sheet) {
    sheet = ss.insertSheet('Pacientes');
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setBackground('#1B3A6B')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 150);
    sheet.setColumnWidth(2, 200);
  } else {
    const hdrRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    HEADERS.forEach((h, i) => {
      if(hdrRow[i] !== h){
        sheet.getRange(1, i+1).setValue(h);
        sheet.getRange(1, i+1)
          .setBackground('#1B3A6B')
          .setFontColor('#FFFFFF')
          .setFontWeight('bold');
      }
    });
  }
  return sheet;
}

function _logGuardaMigSkip_(ss, ids, meta){
  try{
    if(!ids || !ids.length) return;
    meta = meta || {};
    var sh = ss.getSheetByName('Bitacora');
    if(!sh){ sh = ss.insertSheet('Bitacora'); sh.appendRow(['fecha','hora','accion','usuario','correo','rol','userAgent','registradoEn']); }
    var ahora = new Date();
    sh.appendRow([
      Utilities.formatDate(ahora,'America/Mexico_City','yyyy-MM-dd'),
      Utilities.formatDate(ahora,'America/Mexico_City','HH:mm:ss'),
      'GUARDA_MIG_SKIP (' + ids.length + '): ' + ids.slice(0,20).join(','),
      '',
      String(meta.email || '').slice(0,120),
      '',
      String(meta.userAgent || '').slice(0,200),
      ahora.toISOString()
    ]);
    Logger.log('[GUARDA_MIG_SKIP] ' + ids.length + ' fila(s) mig_pac_ saltada(s) de ' + (meta.email||'?') + ' | ' + ids.join(','));
  }catch(err){ Logger.log('[GUARDA_MIG_SKIP] no se pudo registrar en Bitacora: ' + err.message); }
}

function guardarPacientes(ss, pacientes, meta) {
  if (!pacientes || !pacientes.length) return;
  const sheet = getOrCreateSheet(ss);
  const lastRow = sheet.getLastRow();
  const existingIds = lastRow > 1
    ? sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat()
    : [];

  var saltadosMig = [];
  pacientes.forEach(p => {
    if (!p.id) return;
    if (String(p.id).indexOf('mig_pac_') === 0) { saltadosMig.push(String(p.id)); return; }
    const row = HEADERS.map(h => {
      const v = p[h];
      if (v === null || v === undefined) return '';
      if (typeof v === 'object') return JSON.stringify(v);
      return String(v);
    });
    const idx = existingIds.indexOf(p.id);
    if (idx >= 0) {
      sheet.getRange(idx + 2, 1, 1, HEADERS.length).setValues([row]);
    } else {
      sheet.appendRow(row);
      existingIds.push(p.id);
    }
  });
  if (saltadosMig.length) _logGuardaMigSkip_(ss, saltadosMig, meta);
}

// ═══════════════════════════════════════════════════════
// H-01: Merge seguro de paciente
// ═══════════════════════════════════════════════════════

function normalizarUpdatedAt_(p) {
  var t = parseInt(p && p.updatedAt, 10);
  return isNaN(t) ? 0 : t;
}

function esEntranteMasNuevo_(actual, entrante) {
  return normalizarUpdatedAt_(entrante) >= normalizarUpdatedAt_(actual);
}

function parseSafeGS_(str) {
  if (str === null || str === undefined) return [];
  if (typeof str === 'object') return str;
  if (typeof str !== 'string' || !str.trim()) return [];
  try { return JSON.parse(str); } catch(e) { return []; }
}

function mergeArraysPorId_(actualArr, entranteArr, campoId) {
  var mapa = {};
  var orden = [];
  var arrA = Array.isArray(actualArr) ? actualArr : [];
  var arrE = Array.isArray(entranteArr) ? entranteArr : [];

  function keyDe(item) {
    return item[campoId] || item.id || item.mediaId || item.fecha || JSON.stringify(item);
  }

  arrA.forEach(function(item) {
    if (!item) return;
    var key = keyDe(item);
    if (!key) return;
    mapa[key] = item;
    orden.push(key);
  });

  arrE.forEach(function(item) {
    if (!item) return;
    var key = keyDe(item);
    if (!key) return;
    if (mapa[key]) {
      var tAct = parseInt(mapa[key].updatedAt || mapa[key].fechaActualizacion || mapa[key].timestamp || 0, 10);
      var tEnt = parseInt(item.updatedAt || item.fechaActualizacion || item.timestamp || 0, 10);
      if (!tAct && !tEnt) {
        mapa[key] = Object.assign({}, mapa[key], item);
      } else if (tEnt >= tAct) {
        mapa[key] = item;
      }
    } else {
      mapa[key] = item;
      orden.push(key);
    }
  });

  return orden.map(function(k){ return mapa[k]; }).filter(Boolean);
}

function mergeHistorialCambios_(actualArr, entranteArr) {
  var res = [];
  var keys = {};
  var combined = (Array.isArray(actualArr) ? actualArr : [])
    .concat(Array.isArray(entranteArr) ? entranteArr : []);
  combined.forEach(function(h) {
    if (!h) return;
    var key = [h.fecha||'', h.hora||'', h.usuario||'', h.accion||'', h.campo||''].join('|');
    if (!keys[key]) { keys[key] = true; res.push(h); }
  });
  return res;
}

function ensamblarSoap_(p) {
  return []
    .concat(parseSafeGS_(p.soap))
    .concat(parseSafeGS_(p.soap2))
    .concat(parseSafeGS_(p.soap3));
}

function repartirSoap_(soapArr) {
  var MAX_SOAP = 40000;
  var chunk1 = [], chunk2 = [], chunk3 = [];
  var tam1 = 0, tam2 = 0;
  (Array.isArray(soapArr) ? soapArr : []).forEach(function(s) {
    var str = JSON.stringify(s);
    if (tam1 + str.length < MAX_SOAP) { chunk1.push(s); tam1 += str.length; }
    else if (tam2 + str.length < MAX_SOAP) { chunk2.push(s); tam2 += str.length; }
    else { chunk3.push(s); }
  });
  var s1 = JSON.stringify(chunk1), s2 = JSON.stringify(chunk2), s3 = JSON.stringify(chunk3);
  // FIX límite de celda: chunk3 no tenía tope. El límite de celda de Sheets es ~50000 chars; si soap3 lo
  // rebasa, el setValues falla de forma OPACA y el guardado se pierde en el Sheet. Fallamos aquí de forma
  // EXPLÍCITA (mismo prefijo MERGE_ERROR que ya maneja el cliente → conserva local). El expediente completo
  // sigue en Firestore por el espejo (Fase 1), así que no se pierde el dato.
  var CELL_LIMIT = 49000;
  if (s3.length > CELL_LIMIT) {
    throw new Error('MERGE_ERROR:SOAP_CELL_LIMIT:soap3=' + s3.length + 'chars>' + CELL_LIMIT + ' (expediente muy grande para el Sheet; vive en Firestore)');
  }
  return { soap: s1, soap2: s2, soap3: s3 };
}

function mergePacienteSeguro_(actual, entrante) {
  actual = actual || {};
  entrante = entrante || {};

  // AUDITORIA (anti-clobber cross-device): si el guardado declara _soloCampos (los campos TOP-LEVEL que
  // ESE guardado realmente toco), se hace MERGE POR COLUMNA: se parte de ACTUAL (lo mas nuevo del Sheet)
  // y se superponen UNICAMENTE esos campos desde entrante. Asi un guardado de SOAP/ejercicios desde una
  // copia en memoria vieja NO revierte valoracion/motivo/dxFuncional/planTto/etc. que otro equipo acaba
  // de escribir. Sin _soloCampos -> merge clasico "updatedAt mas nuevo gana" (guardado completo legitimo).
  var solo = Array.isArray(entrante._soloCampos) ? entrante._soloCampos : null;
  var base;
  if (solo && solo.length) {
    base = JSON.parse(JSON.stringify(actual || {}));
    solo.forEach(function(campo){
      // soap/soap2/soap3 y los arrays criticos se fusionan por id mas abajo (no reemplazar en bloque).
      if (campo === 'soap' || campo === 'soap2' || campo === 'soap3') return;
      if (entrante[campo] !== undefined) base[campo] = entrante[campo];
    });
  } else {
    var entranteMasNuevo = esEntranteMasNuevo_(actual, entrante);
    base = entranteMasNuevo
      ? JSON.parse(JSON.stringify(Object.assign({}, actual, entrante)))
      : JSON.parse(JSON.stringify(Object.assign({}, entrante, actual)));
  }

  var soapActual = ensamblarSoap_(actual);
  var soapEntrante = ensamblarSoap_(entrante);
  var soapMerge = mergeArraysPorId_(soapActual, soapEntrante, 'id');
  var chunks = repartirSoap_(soapMerge);
  base.soap = chunks.soap;
  base.soap2 = chunks.soap2;
  base.soap3 = chunks.soap3;

  var arraysCriticos = ['fotos','docs','ejercicios','consentimientos','revaloraciones','eventosAdversos','motivosAnteriores','inasistencias'];
  arraysCriticos.forEach(function(campo) {
    base[campo] = mergeArraysPorId_(parseSafeGS_(actual[campo]), parseSafeGS_(entrante[campo]), 'id');
  });

  base.historialCambios = mergeHistorialCambios_(parseSafeGS_(actual.historialCambios), parseSafeGS_(entrante.historialCambios));

  base.updatedAt = Math.max(
    normalizarUpdatedAt_(actual),
    normalizarUpdatedAt_(entrante),
    Date.now()
  );

  var sesA = parseInt(actual.sesiones || 0, 10);
  var sesE = parseInt(entrante.sesiones || 0, 10);
  base.sesiones = Math.max(sesA, sesE);

  if (base._soloCampos !== undefined) delete base._soloCampos; // señal transitoria, no se persiste
  return base;
}

function pacienteARow_(p) {
  return HEADERS.map(function(h) {
    var v = p[h];
    if (v === null || v === undefined) return '';
    if (typeof v === 'object') return JSON.stringify(v);
    return String(v);
  });
}

function guardarPacientesConMerge_(ss, pacientes, meta) {
  if (!pacientes || !pacientes.length) return {ok:true, guardados:0};
  // FIX concurrencia (LockService): serializa el read-modify-write del Sheet para TODAS las escrituras
  // por merge — savePacientes y las claude* (claudeActualizarClinico/AgregarSoap/EditarSoap/AgregarItem).
  // Antes SOLO savePacientes tomaba el candado por fuera; una escritura de la conexión podía intercalarse
  // y pisar un guardado concurrente (actualización perdida). Ahora el candado vive AQUÍ (punto único), por
  // eso savePacientes ya NO lo toma por fuera (evita doble-adquisición en la misma ejecución).
  var _lock = LockService.getScriptLock();
  try { _lock.waitLock(15000); } catch (eLk) { throw new Error('LOCK_TIMEOUT'); }
  try {
  var sheet = getOrCreateSheet(ss);
  var lastRow = sheet.getLastRow();
  var existingIds = lastRow > 1
    ? sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat()
    : [];

  var guardados = 0, huboMerge = false, mergeWarning = false, saltadosMig = [], fallidos = [];

  pacientes.forEach(function(pEntrante) {
    if (!pEntrante || !pEntrante.id) return;
    // GUARDA DURA (fuga de la Hoja): un mig_pac_ NUNCA se escribe al Sheet. Skip POR FILA — jamas
    // rechazo del payload entero: activos+migs de un cliente rezagado -> los activos SI se guardan
    // y solo se saltan los migs. Se registra en Bitacora (GUARDA_MIG_SKIP) con correo+userAgent.
    if (String(pEntrante.id).indexOf('mig_pac_') === 0) { saltadosMig.push(String(pEntrante.id)); return; }
    var idx = existingIds.indexOf(pEntrante.id);

    if (idx < 0) {
      try {
        var pNuevo = JSON.parse(JSON.stringify(pEntrante));
        if (Array.isArray(pNuevo.soap)) {
          var ch = repartirSoap_(pNuevo.soap);
          pNuevo.soap = ch.soap; pNuevo.soap2 = ch.soap2; pNuevo.soap3 = ch.soap3;
        }
        sheet.appendRow(pacienteARow_(pNuevo));
        existingIds.push(pEntrante.id);
        guardados++;
      } catch(eNew) {
        // FIX pérdida silenciosa (caso Dulce): antes el fallo del alta (p.ej. fila/celda demasiado
        // grande por base64) se tragaba con catch(e2){} y la función IGUAL devolvía ok:true → el
        // cliente mostraba "✅ guardado" sin haber escrito nada. Ahora, si el fallback TAMBIÉN falla,
        // se registra en `fallidos` para devolver ok:false (el cliente conserva local + encola + avisa).
        try { guardarPacientes(ss, [pEntrante], meta); guardados++; mergeWarning = true; }
        catch(e2){
          fallidos.push(String(pEntrante.id));
          Logger.log('[savePacientes] ALTA NO PERSISTIÓ id=' + pEntrante.id
            + ' — append: ' + (eNew && eNew.message) + ' | fallback: ' + (e2 && e2.message));
        }
      }
      return;
    }

    try {
      var filaActual = sheet.getRange(idx + 2, 1, 1, HEADERS.length).getValues()[0];
      var pActual = {};
      HEADERS.forEach(function(h, i) { pActual[h] = filaActual[i]; });
      pActual.updatedAt = Number(pActual.updatedAt) || 0;

      var pMerge = mergePacienteSeguro_(pActual, pEntrante);
      sheet.getRange(idx + 2, 1, 1, HEADERS.length).setValues([pacienteARow_(pMerge)]);
      guardados++; huboMerge = true;
    } catch(eMerge) {
      Logger.log('MERGE_ERROR ' + (pEntrante && pEntrante.id ? pEntrante.id : '?') + ': ' + eMerge.message);
      throw new Error('MERGE_ERROR:' + (pEntrante && pEntrante.id ? pEntrante.id : '?') + ':' + eMerge.message);
    }
  });

  if (saltadosMig.length) _logGuardaMigSkip_(ss, saltadosMig, meta);

  // FIX honestidad (caso Dulce): si algún paciente NO se pudo escribir, NUNCA reportar éxito. El
  // cliente mapea ok:false → conserva local + encola + avisa (jamás un ✅ sobre un guardado que no
  // ocurrió). Antes se devolvía ok:true aunque guardados fuera 0 → "se guarda y no se guarda".
  if (fallidos.length) {
    return {ok:false, error:'SAVE_INCOMPLETO', guardados:guardados,
            fallidos:fallidos.length, idsFallidos:fallidos,
            msg: fallidos.length + ' paciente(s) no se pudieron guardar en el Sheet (fila inválida/grande). Conservados localmente.'};
  }

  var resp = {ok:true, guardados:guardados};
  if (huboMerge) resp.merged = true;
  if (mergeWarning) resp.mergeWarning = 'merge parcial';
  if (saltadosMig.length) resp.saltadosMig = saltadosMig.length;
  return resp;
  } finally { try { _lock.releaseLock(); } catch (_rel) {} }
}

function testScript() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = getOrCreateSheet(ss);
  Logger.log('Sheet OK - filas: ' + sheet.getLastRow());
  Logger.log('Columnas: ' + HEADERS.length + ' → ' + HEADERS.join(', '));
}

// ── LOOP G — AGENDA (solo LECTURA del Google Calendar de la clínica) ──
// CRÍTICO: JD antes de J, y CM antes de C, para que el parser los detecte primero.
// El match es por TOKEN EXACTO (mayúsculas normalizadas), así que además de la inicial corta se
// aceptan ALIAS: el nombre completo ('DULCE') y el código de la app ('DUL') → así aunque escriban
// "Dulce Juan" o "Dul Juan" en el calendario, la cita igual se le asigna bien. Sin ambigüedad: todos
// son tokens exactos, no prefijos.
var AGENDA_INICIALES = [
  { ini: 'CM',      terapeuta: 'Camila'  },
  { ini: 'Z',       terapeuta: 'Zara'    },
  { ini: 'DU',      terapeuta: 'Dulce'   },  // DU antes de D (D sola es Dafne)
  { ini: 'D',       terapeuta: 'Dafne'   },
  { ini: 'G',       terapeuta: 'Goretti' },
  { ini: 'C',       terapeuta: 'Carlos'  },
  { ini: 'JD',      terapeuta: 'Jess'    },  // JD antes de J (misma Jess, inicial larga primero)
  { ini: 'J',       terapeuta: 'Jess'    },
  // ALIAS por nombre completo y código de la app (token exacto):
  { ini: 'DULCE',   terapeuta: 'Dulce'   },
  { ini: 'DUL',     terapeuta: 'Dulce'   },
  { ini: 'DAFNE',   terapeuta: 'Dafne'   },
  { ini: 'DAF',     terapeuta: 'Dafne'   },
  { ini: 'ZARA',    terapeuta: 'Zara'    },
  { ini: 'CAMILA',  terapeuta: 'Camila'  },
  { ini: 'CAMI',    terapeuta: 'Camila'  },
  { ini: 'CARLOS',  terapeuta: 'Carlos'  },
  { ini: 'GORETTI', terapeuta: 'Goretti' },
  { ini: 'GORE',    terapeuta: 'Goretti' },
  { ini: 'JESS',    terapeuta: 'Jess'    }
];

function parsearTituloAgenda_(titulo) {
  var palabras = String(titulo || '').trim().split(/\s+/).filter(String);
  var terapeutas = [];
  var esNuevo = false;
  var i = 0;
  for (; i < palabras.length; i++) {
    var w = palabras[i];
    var wl = w.toLowerCase();
    if (wl === 'px') { esNuevo = true; continue; }
    var match = null;
    for (var k = 0; k < AGENDA_INICIALES.length; k++) {
      if (w.toUpperCase() === AGENDA_INICIALES[k].ini) { match = AGENDA_INICIALES[k]; break; }
    }
    if (match) {
      if (terapeutas.indexOf(match.terapeuta) === -1) terapeutas.push(match.terapeuta);
      continue;
    }
    break;
  }
  var paciente = palabras.slice(i).join(' ').trim();
  // ANTES: las citas SIN inicial ni "px" se DESCARTABAN (omitir:true) → desaparecían del tablero, el
  // supervisor no las veía ni las podía asignar. AHORA sí llegan, como "sin asignar", para que aparezcan
  // en "⚠️ Sin asignar" y se asignen a mano (o se auto-asignen a quien hizo la nota). Solo se omite un
  // evento con TÍTULO VACÍO (bloqueos/recordatorios sin nombre), que no es una cita.
  if (!String(titulo || '').trim()) return { omitir: true };
  var sinAsignar = (terapeutas.length === 0);
  return {
    omitir: false,
    terapeutas: terapeutas,
    paciente: paciente || '(sin nombre)',
    esNuevo: esNuevo,
    sinAsignar: sinAsignar
  };
}

// rango: 'dia' | 'manana' | 'pasado' | 'semana' | 'semanaSiguiente' | 'rango_fechas' (desde/hasta 'YYYY-MM-DD', hasta inclusivo)
function rangoAgenda_(rango, desde, hasta) {
  var hoy = new Date();
  hoy.setHours(0,0,0,0);
  var inicio = new Date(hoy), fin = new Date(hoy);
  if (rango === 'rango_fechas') {
    var pd = String(desde || '').split('-'), ph = String(hasta || '').split('-');
    if (pd.length === 3 && ph.length === 3) {
      var i2 = new Date(Number(pd[0]), Number(pd[1]) - 1, Number(pd[2]), 0, 0, 0);
      var f2 = new Date(Number(ph[0]), Number(ph[1]) - 1, Number(ph[2]), 0, 0, 0);
      f2.setDate(f2.getDate() + 1); // hasta inclusivo
      if (!isNaN(i2.getTime()) && !isNaN(f2.getTime()) && f2 > i2) return { inicio: i2, fin: f2 };
    }
    // desde/hasta inválidos → cae a 'dia'
    fin.setDate(hoy.getDate() + 1);
  } else if (rango === 'manana') {
    inicio.setDate(hoy.getDate() + 1);
    fin.setDate(hoy.getDate() + 2);
  } else if (rango === 'pasado') {
    inicio.setDate(hoy.getDate() + 2);
    fin.setDate(hoy.getDate() + 3);
  } else if (rango === 'semana') {
    var dia = (hoy.getDay() + 6) % 7;
    inicio.setDate(hoy.getDate() - dia);
    fin = new Date(inicio); fin.setDate(inicio.getDate() + 7);
  } else if (rango === 'semanaSiguiente') {
    var dia2 = (hoy.getDay() + 6) % 7;
    inicio.setDate(hoy.getDate() - dia2 + 7);
    fin = new Date(inicio); fin.setDate(inicio.getDate() + 7);
  } else {
    fin.setDate(hoy.getDate() + 1);
  }
  return { inicio: inicio, fin: fin };
}

function leerAgenda(rango, desde, hasta) {
  try {
    var cal = CalendarApp.getDefaultCalendar();
    var r = rangoAgenda_(rango, desde, hasta);
    var eventos = cal.getEvents(r.inicio, r.fin);
    var out = [];
    for (var j = 0; j < eventos.length; j++) {
      var ev = eventos[j];
      var parsed = parsearTituloAgenda_(ev.getTitle());
      if (parsed.omitir) continue;
      out.push({
        inicio: ev.getStartTime().toISOString(),
        fin: ev.getEndTime().toISOString(),
        terapeutas: parsed.terapeutas,
        paciente: parsed.paciente,
        esNuevo: parsed.esNuevo,
        sinAsignar: parsed.sinAsignar,
        tituloOriginal: ev.getTitle()
      });
    }
    out.sort(function(a,b){ return a.inicio < b.inicio ? -1 : 1; });
    return { ok: true, apiAgenda: 2, rango: rango, desde: desde || null, hasta: hasta || null, total: out.length, eventos: out };
  } catch (e) {
    return { ok: false, error: 'AGENDA_ERROR', msg: String(e && e.message || e) };
  }
}

// ── Funciones de diagnóstico y mantenimiento de datos ──

function eliminarAndreaCompleta() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName('Pacientes');
  var datos = sheet.getRange(2, 1, sheet.getLastRow()-1, 2).getValues();
  for (var i = datos.length-1; i >= 0; i--) {
    if (String(datos[i][1]).toLowerCase().indexOf('andrea') > -1) {
      Logger.log('Borrando fila ' + (i+2) + ': ' + datos[i][0] + ' — ' + datos[i][1]);
      sheet.deleteRow(i+2);
    }
  }
  Logger.log('✅ Listo.');
}

function diagnosticoAndrea() {
  var ss    = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName("Pacientes");
  if (!sheet) { Logger.log("ERROR: hoja Pacientes no encontrada"); return; }
  var data    = sheet.getDataRange().getValues();
  var headers = data[0];
  var colId   = headers.indexOf("id");
  var colName = headers.indexOf("name");
  var colSes  = headers.indexOf("sesiones");
  var colSoap = headers.indexOf("soap");
  Logger.log("Total filas de datos: " + (data.length - 1));
  var migCount = 0;
  for (var i = 1; i < data.length; i++) {
    var id = String(data[i][colId] || "").trim();
    if (id.indexOf("mig_pac_") === 0) {
      migCount++;
      var soapVal = colSoap !== -1 ? String(data[i][colSoap] || "") : "";
      Logger.log("  fila " + (i+1) + " | id=" + id + " | name=" + data[i][colName] +
                 " | sesiones=" + (colSes !== -1 ? data[i][colSes] : "?") +
                 " | soap=" + (soapVal ? soapVal.length + " chars" : "VACÍO"));
    }
  }
  if (migCount === 0) Logger.log("  mig_pac_* en Sheets: ninguna — OK");
  else Logger.log("  >>> TOTAL mig_pac_* colados: " + migCount);
  var andreaCount = 0;
  for (var j = 1; j < data.length; j++) {
    var nm = String(data[j][colName] || "");
    var nmLower = nm.toLowerCase();
    if (nmLower.indexOf("andrea") !== -1 &&
        (nmLower.indexOf("mendez") !== -1 || nmLower.indexOf("méndez") !== -1)) {
      andreaCount++;
      var id2 = String(data[j][colId] || "").trim();
      var soap2 = colSoap !== -1 ? String(data[j][colSoap] || "") : "";
      var ses2  = colSes  !== -1 ? data[j][colSes] : "?";
      var tieneData = (soap2 && soap2.length > 2) || (ses2 && String(ses2) !== "0" && String(ses2) !== "");
      Logger.log("  fila " + (j+1) + " | id=" + id2 + " | name=" + nm +
                 " | sesiones=" + ses2 + " | soap=" + (soap2 ? soap2.length + " chars" : "VACÍO") +
                 " | " + (tieneData ? "CON DATOS" : "VACÍA/STUB"));
    }
  }
  if (andreaCount === 0) Logger.log("  Andrea Mendez: ninguna encontrada");
  Logger.log("=== FIN DIAGNÓSTICO — sin escritura ===");
}

function diagnosticoStubsVsFirestore() {
  var ss    = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName("Pacientes");
  var data  = sheet.getDataRange().getValues();
  var colId = data[0].indexOf("id");
  var migs = [];
  for (var i = 1; i < data.length; i++) {
    var id = String(data[i][colId] || "").trim();
    if (id.indexOf("mig_pac_") === 0) migs.push({ fila: i+1, id: id });
    if (id === "p002") migs.push({ fila: i+1, id: id });
  }
  Logger.log(">>> Total mig_pac_ + p002 en Sheets: " + migs.length);
  Logger.log(JSON.stringify(migs));
}

function backupFilasAHojaNueva() {
  var ss    = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName("Pacientes");
  var data  = sheet.getDataRange().getValues();
  var headers = data[0];
  var colId = headers.indexOf("id");
  var backupRows = [];
  backupRows.push(["_fila_original"].concat(headers));
  for (var i = 1; i < data.length; i++) {
    var id = String(data[i][colId] || "").trim();
    if (id.indexOf("mig_pac_") === 0 || id === "p002") {
      backupRows.push([i + 1].concat(data[i]));
    }
  }
  var nombreHoja = "BACKUP_60filas_2jul";
  var vieja = ss.getSheetByName(nombreHoja);
  if (vieja) ss.deleteSheet(vieja);
  var hoja = ss.insertSheet(nombreHoja);
  hoja.getRange(1, 1, backupRows.length, backupRows[0].length).setValues(backupRows);
  Logger.log(">>> Respaldadas: " + (backupRows.length - 1));
}

function borrar60Filas() {
  var ss    = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName("Pacientes");
  var data  = sheet.getDataRange().getValues();
  var colId = data[0].indexOf("id");
  var aBorrar = [];
  for (var i = 1; i < data.length; i++) {
    var id = String(data[i][colId] || "").trim();
    if (id.indexOf("mig_pac_") === 0 || id === "p002") aBorrar.push(i + 1);
  }
  aBorrar.sort(function(a, b) { return b - a; });
  for (var j = 0; j < aBorrar.length; j++) sheet.deleteRow(aBorrar[j]);
  Logger.log(">>> Filas borradas: " + aBorrar.length);
}

function buscarP002() {
  var ss    = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName("Pacientes");
  var data  = sheet.getDataRange().getValues();
  var colId = data[0].indexOf("id");
  var colName = data[0].indexOf("name");
  var encontrados = 0, migs = 0;
  for (var i = 1; i < data.length; i++) {
    var id = String(data[i][colId] || "").trim();
    var nm = String(data[i][colName] || "");
    if (id === "p002" || nm.toLowerCase().indexOf("andrea mend") >= 0) {
      encontrados++;
      Logger.log("fila " + (i+1) + " | id=" + id + " | name=" + nm);
    }
    if (id.indexOf("mig_pac_") === 0) migs++;
  }
  Logger.log(">>> Andrea/p002 encontrados: " + encontrados);
  Logger.log(">>> mig_pac_ actuales en Sheets: " + migs);
}

function borrarP002Final() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName("Pacientes");
  var data = sheet.getDataRange().getValues();
  var colId = data[0].indexOf("id");
  var n = 0;
  for (var i = data.length - 1; i >= 1; i--) {
    if (String(data[i][colId]||"").trim() === "p002") { sheet.deleteRow(i+1); n++; }
  }
  Logger.log("p002 borradas: " + n);
}

function verEstadoSheets() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName("Pacientes");
  var data = sheet.getDataRange().getValues();
  var colId = data[0].indexOf("id");
  var total = 0, migs = 0, p002 = 0;
  for (var i = 1; i < data.length; i++) {
    var id = String(data[i][colId]||"").trim();
    if (!id) continue;
    total++;
    if (id.indexOf("mig_pac_") === 0) migs++;
    if (id === "p002") p002++;
  }
  Logger.log(">>> Total filas: " + total);
  Logger.log(">>> mig_pac_ en Sheets: " + migs);
  Logger.log(">>> p002 en Sheets: " + p002);
}

function reordenarTodosLosSoap() {
  var DRY_RUN = false;
  var ss    = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName("Pacientes");
  if (!sheet) { Logger.log("ERROR: hoja Pacientes no encontrada"); return; }
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  var data    = sheet.getRange(1, 1, lastRow, lastCol).getValues();
  var headers = data[0];
  var colId   = headers.indexOf("id");
  var colName = headers.indexOf("name");
  var colSoap = headers.indexOf("soap");
  if (colId === -1 || colSoap === -1) { Logger.log("ERROR: falta columna id o soap"); return; }

  function parseFechaISO(fch) {
    if (fch === null || fch === undefined) return null;
    if (Object.prototype.toString.call(fch) === '[object Date]') {
      if (isNaN(fch.getTime())) return null;
      return Utilities.formatDate(fch, "America/Mexico_City", "yyyy-MM-dd");
    }
    var s = String(fch).trim();
    if (!s) return null;
    var m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (m) return m[1] + "-" + pad(m[2]) + "-" + pad(m[3]);
    m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m) return m[3] + "-" + pad(m[2]) + "-" + pad(m[1]);
    return null;
  }
  function pad(n){ n = String(n); return n.length < 2 ? "0"+n : n; }

  var totalPac = 0, conSoap = 0, modificados = 0, saltados = 0, sinCambio = 0, errJson = 0;
  Logger.log("=== reordenarTodosLosSoap — DRY_RUN=" + DRY_RUN + " ===");

  for (var r = 1; r < data.length; r++) {
    var id   = String(data[r][colId] || "").trim();
    var name = String(data[r][colName] || "");
    if (!id) continue;
    if (name.indexOf("TEST_QA_") === 0) continue;
    totalPac++;
    var raw = data[r][colSoap];
    if (!raw || !String(raw).trim()) continue;
    var soap;
    try { soap = JSON.parse(raw); } catch (e) { errJson++; Logger.log("  [JSON-ERR] " + id + " · " + name); continue; }
    if (!Array.isArray(soap) || soap.length === 0) continue;
    conSoap++;
    var conIso = [];
    var faltante = false;
    for (var i = 0; i < soap.length; i++) {
      var iso = parseFechaISO(soap[i].fecha);
      if (iso === null) faltante = true;
      conIso.push({ ses: soap[i], iso: iso, origIdx: i, origNum: soap[i].num });
    }
    if (faltante) {
      saltados++;
      Logger.log("  [SKIP fecha-invalida] " + id + " · " + name);
      continue;
    }
    var ordenado = conIso.slice().sort(function(a, b) {
      if (a.iso < b.iso) return -1;
      if (a.iso > b.iso) return 1;
      return a.origIdx - b.origIdx;
    });
    var cambio = false;
    for (var j = 0; j < ordenado.length; j++) {
      if (ordenado[j].origIdx !== j || ordenado[j].origNum !== (j + 1)) { cambio = true; break; }
    }
    if (!cambio) { sinCambio++; continue; }
    var antes = conIso.map(function(x){ return x.origNum + ":" + x.iso; }).join(", ");
    var nuevoArr = ordenado.map(function(x, k) { x.ses.num = k + 1; return x.ses; });
    var despues = ordenado.map(function(x, k){ return (k+1) + ":" + x.iso; }).join(", ");
    modificados++;
    Logger.log("  [FIX] " + id + " · " + name + " (" + soap.length + " ses)");
    Logger.log("        antes:  " + antes);
    Logger.log("        después: " + despues);
    if (!DRY_RUN) sheet.getRange(r + 1, colSoap + 1).setValue(JSON.stringify(nuevoArr));
  }

  Logger.log("\n=== RESUMEN ===");
  Logger.log("Pacientes: " + totalPac + " | con soap: " + conSoap +
             " | MODIFICADOS: " + modificados + (DRY_RUN ? " (dry-run)" : " (escritos)") +
             " | sin cambio: " + sinCambio + " | saltados: " + saltados + " | json-err: " + errJson);
}

function corregirSoapAndrea() {
  var PAC_ID = "pmr45mhae";
  var ss    = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName("Pacientes");
  if (!sheet) { Logger.log("ERROR: hoja Pacientes no encontrada"); return; }
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var colId   = headers.indexOf("id");
  var colSoap = headers.indexOf("soap");
  if (colId === -1 || colSoap === -1) { Logger.log("ERROR: falta columna id o soap"); return; }
  var lastRow = sheet.getLastRow();
  var ids = sheet.getRange(2, colId + 1, lastRow - 1, 1).getValues();
  var targetRow = -1;
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]).trim() === PAC_ID) { targetRow = i + 2; break; }
  }
  if (targetRow === -1) { Logger.log("ERROR: no se encontró id=" + PAC_ID); return; }
  Logger.log("Fila " + PAC_ID + " encontrada en row " + targetRow);
  var valorAnterior = sheet.getRange(targetRow, colSoap + 1).getValue();
  Logger.log("BACKUP soap anterior: " + String(valorAnterior).length + " chars");

  function base(id, num, fecha, texto) {
    return {
      id: id, num: num, fecha: fecha, terapeuta: "GORE",
      formatoOriginal: "texto_libre", importado: true, completa: true,
      textoOriginal: texto,
      s: { dolor: "", cambios: "", actFisica: "" },
      o: { rom: "", fuerza: "", hallazgos: "" },
      a: { evolucion: "", respuesta: "", analisis: "" },
      p: { tratamiento: "", indicaciones: "", contraindicaciones: "" },
      media: [], modalidades: []
    };
  }

  var soap = [
    base("mig_soap_1870100bb000", 1, "01/06/2026", "Goretti\n\nCONTRAINDICACIONES: realizar rotaciones de hombro y ejercicios de fuerza\n\nAntecedentes personales patológicos: alergias cefalosporinas\nAntecedentes deportivos: natación ( (6 horas a la semana) y correr\nCirugías previas: tiroides y hombro\nMedicamentos: levotiroxina\n\nMotivo de consulta\nPadecimiento actual: la Px menciona que tuvo una lesión hace 3 años, comenzó con dolor en hombro derecho, en este tiempo asistió al fisio, el dolor iba y venía, hace poco regresó el dolor al levantar el hombro, le realizaron cirugía 7 de mayo.\nMecanismo de lesión: desconoce\nTiempo de evolución: 3 años, la Qx\nEstudios de imagen:\n\nVALORACIÓN\nDolor (EVA): 3/10 mínimo y 5/10 ENA\nInflamación: en hombro derecho sobre inserciones musculares\nMarcha / postura:\nROM: 45º hacia flexion pasiva, y 20º en abducción pasiva\nFuerza muscular: disminuida del lado izquierda\nFlexibilidad:\nPruebas especiales:\nPalpación: dolor en cicatrices\n\nDIAGNÓSTICO FUNCIONAL\nDiagnóstico clínico: lesion en manguito de los rotadores y Slap en hombro derecho\nDiagnóstico funcional:\nDisfunción de hombro derecho por Qx de lesion de manguito de los rotadores que limita la movilidad activa de hombro para AVDH\nLimitaciones: movilidad de hombro\nObjetivos del tratamiento: recuperar movilidad de hombro derecho, disminuir dolor, aumentar fuerza, reincorporación a actividad física\nPronóstico: probabilidad de mejoría\n\nPLAN DE TRATAMIENTO\nFrecuencia: 3 veces por semana las primeras dos semanas\nObjetivos: recuperar movilidad de hombro derecho, disminuir dolor, aumentar fuerza, reincorporación a actividad física\nEjercicio terapéutico: movilizacion pasiva a la flexion y abducción hasta 90º en la primera fase\nTerapia manual: liberacion en trapecios y movilizacion en cicatrices\nAgentes físicos: us, radiofrecuencia, TENS, laser\nContraindicaciones: realizar movimientos activos mayores a 90º en flexión y abducción, y realizar movimientos activos de rotaciones"),
    base("mig_soap_12a01d2f8d7a", 2, "03/06/2026", "Goretti\nS (Subjetivo):\n– Dolor: 6/10 ENA\n– Cambios desde última sesión: el dolor aumentó despues de las movilizaciones de hombro\n\nO (Objetivo):\n– ROM:\n– Fuerza:\n– Hallazgos:\n\nA (Análisis):\n– Evolución:\n– Respuesta al tratamiento: buena\n\nP (Plan):\n– Tratamiento aplicado: desinflamac, tape y movilizacion pasiva a la flexion y abducción\n– Indicaciones:\n-Contraindicaciones:"),
    base("mig_soap_1ed631146f14", 3, "05/06/2026", "Goretti\nS (Subjetivo):\n– Dolor: 5/10 ENA\n– Cambios desde última sesión: la Px llega a 90º de flexion de manera más fácil\n\nO (Objetivo):\n– ROM: limitados\n– Fuerza: disminuida\n– Hallazgos:\n\nA (Análisis):\n– Evolución:\n– Respuesta al tratamiento: buena\n\nP (Plan):\n– Tratamiento aplicado: desinflamación y movilizacion pasiva\n– Indicaciones:\n-Contraindicaciones:"),
    base("mig_soap_140dfb6b511e", 4, "08/06/2026", "Goretti\n\nS (Subjetivo):\n– Dolor: 4/10 el di de hoy, l fin de semana refierio dolor de 9/10\n– Cambios desde última sesión: ya llega a 90º en abd y flexion\n\nO (Objetivo):\n– ROM: 90º de flexión ay abducción pasiva\n– Fuerza:\n– Hallazgos:\n\nA (Análisis):\n– Evolución:\n– Respuesta al tratamiento: bueno\n\nP (Plan):\n– Tratamiento aplicado: desinflamación, movilidad pasiva y activa con bastón\n– Indicaciones: realizar movilidad activa a la flexión\n-Contraindicaciones:"),
    base("mig_soap_1fb466f99a41", 5, "10/06/2026", "Goretti (6ta semana post Qx)\n\nS (Subjetivo):\n– Dolor: 6/10 despues de realizar los ejercicios de movilidad activa en casa, al día de hoy presenta contracturas en cuello y trapecios\n– Cambios desde última sesión: el rango activo ha aumentado\n\nO (Objetivo):\n– ROM: 90º de flexión ay abducción pasiva\n– Fuerza: disminuida en brazo derecho\n– Hallazgos:\n\nA (Análisis):\n– Evolución: 2 semanas\n– Respuesta al tratamiento: bueno\n\nP (Plan):\n– Tratamiento aplicado: desinflamación, movilidad pasiva y activa con bastón, isometricos hacia flexiones, abduccion y extension en pared\n– Indicaciones: realizar movilidad activa a la flexión\n-Contraindicaciones:"),
    base("mig_soap_00de2a436a5e", 6, "12/06/2026", "Goretti\n\nS (Subjetivo):\n– Dolor: 4/10\n– Cambios desde última sesión: ya llega a 90º en abd y flexion en movilidad activa y el dolor es mejor al activar la musculatura\n\nO (Objetivo):\n– ROM: 90º de flexión ay abducción pasiva\n– Fuerza: diminuida en brazo derecho\n– Hallazgos:\n\nA (Análisis):\n– Evolución: 2 semanas Tx\n– Respuesta al tratamiento: bueno\n\nP (Plan):\n– Tratamiento aplicado: desinflamación, movilidad pasiva y activa con bastón\n– Indicaciones: realizar movilidad activa a la flexión\n-Contraindicaciones:"),
    base("mig_soap_0ef7cb1b60c9", 7, "17/06/2026", "Goretti (7ma semana post Qx)\n\nS (Subjetivo):\n– Dolor: presenta dolor 4/10\n– Cambios desde última sesión: la paciente menciona haber referido dolor 8/10 en día anterior debido a que se cayó, el traumatólogo le recetó desinflamatorios\n\nO (Objetivo):\n– ROM: 90º de flexión a abducción pasiva\n– Fuerza: diminuida en brazo derecho\n– Hallazgos:\n\nA (Análisis):\n– Evolución: 2 semanas Tx\n– Respuesta al tratamiento: bueno\n\nP (Plan):\n– Tratamiento aplicado: se aplica sólo desinflamación y vendaje\n– Indicaciones: realizar movilidad activa a la flexión, abducción y ejercicios isometricos en flexiones, abducción y extension\n-Contraindicaciones:"),
    base("mig_soap_1914bc7fa6ff", 8, "19/06/2026", "Goretti\nS (Subjetivo):\n– Dolor: 4/10 en hombro derecho\n– Cambios desde última sesión:\n\nO (Objetivo):\n– ROM: 90º de flexión y abducción activa\n– Fuerza: diminuida en brazo derecho\n– Hallazgos:\n\nA (Análisis):\n– Evolución: 2 semanas Tx\n– Respuesta al tratamiento: bueno\n\nP (Plan):\n– Tratamiento aplicado: se aplica sólo desinflamación y vendaje\n– Indicaciones: realizar movilidad activa a la flexión, abducción y ejercicios isometricos en flexiones, abducción y extension\n-Contraindicaciones:"),
    base("mig_soap_182ba8a8ae27", 9, "22/06/2026", "Goretti\n\n[IMAGEN_EMBEBIDA]\n\nS (Subjetivo):\n– Dolor: 6/10 en hombro derecho por manipulación del traumatólogo\n– Cambios desde última sesión: se agregan ejercicios para forzar el ROM de hombro\n\nO (Objetivo):\n– ROM: 90º de flexión y abducción activa\n– Fuerza: diminuida en brazo derecho\n– Hallazgos:\n\nA (Análisis):\n– Evolución: 3 semanas Tx, 7 semana post Qx\n– Respuesta al tratamiento: bueno\n\nP (Plan):\n– Tratamiento aplicado: se realizan ejercicios con baston hacia flexiones, abduccion y extension activa de hombro, ejercicios con pelota bobath para forzar la flexion y la abduccion de hombro y se realizan isometricos, se desinflama\n– Indicaciones: realizar movilidad activa a la flexión, abducción y ejercicios isometricos en flexiones, abducción y extension\n-Contraindicaciones:"),
    base("mig_soap_02c8ce83742a", 10, "26/06/2026", "Goretti\nS (Subjetivo):\n– Dolor: 2/10 en hombro derecho\n– Cambios desde última sesión: se agregan ejercicios para forzar el ROM de hombro\n\nO (Objetivo):\n– ROM: 90º de flexión y abducción activa\n– Fuerza: diminuida en brazo derecho\n– Hallazgos:\n\nA (Análisis):\n– Evolución: 4 semanas Tx, 7 semana post Qx\n– Respuesta al tratamiento: bueno\n\nP (Plan):\n– Tratamiento aplicado: se realizan ejercicios con baston hacia flexiones, abduccion y extension activa de hombro, ejercicios con pelota bobath para forzar la flexion y la abduccion de hombro, con liga se realiza flexion y abduccion y Rotacion externa de hombro pasiva, se desinflama con radiofrecuencia y láser.\n– Indicaciones: realizar movilidad activa a la flexión, abducción, rotación externa y ejercicios isometricos en flexiones, abducción y extension\n-Contraindicaciones:"),
    base("mig_soap_0bab1ca17ecb", 11, "27/06/2026", "Goretti\n(Subjetivo):\n– Dolor: 6/10 en hombro derecho al día siguiente despues de la terapia, en los ejercicios duele 4/10\n– Cambios desde última sesión: se agregan ejercicios para forzar el ROM de hombro\n\nO (Objetivo):\n– ROM: 110 de flexión activa y 90 abducción activa, en pasivo llega a 160 en flexion y 120 en abd\n– Fuerza: diminuida en brazo derecho\n– Hallazgos:\n\nA (Análisis):\n– Evolución: 4 semanas Tx, 7 semana post Qx\n– Respuesta al tratamiento: bueno\n\nP (Plan):\n– Tratamiento aplicado: se realizan ejercicios con baston hacia flexiones, abduccion y extension activa de hombro, ejercicios con pelota bobath para forzar la flexion y la abduccion de hombro, con liga se realiza flexion y abduccion y Rotacion externa de hombro pasiva, se desinflama con radiofrecuencia y se liberan trapecios\n– Indicaciones: realizar movilidad activa a la flexión, abducción, rotación externa y ejercicios isometricos en flexiones, abducción y extension\n-Contraindicaciones:"),
    base("mig_soap_00816af6e74b", 12, "16/06/2026", "Goretti\nS (Subjetivo):\n– Dolor: solo al final del día 5/10, menciona hacer bicicleta estática sin dolor\n– Cambios desde última sesión: ya llega a 90º en abd y flexion en movilidad activa y el dolor es mejor al activar la musculatura\n\nO (Objetivo):\n– ROM: 90º de flexión ay abducción pasiva\n– Fuerza: diminuida en brazo derecho\n– Hallazgos:\n\nA (Análisis):\n– Evolución: 2 semanas Tx\n– Respuesta al tratamiento: bueno\n\nP (Plan):\n– Tratamiento aplicado: desinflamación, movilidad pasiva y activa con bastón, isometricos hacia flexiones, abducción y extension\n– Indicaciones: realizar movilidad activa a la flexión\n-Contraindicaciones:")
  ];

  var nuevoJson = JSON.stringify(soap);
  Logger.log("Nuevo soap: " + soap.length + " sesiones, " + nuevoJson.length + " chars");
  sheet.getRange(targetRow, colSoap + 1).setValue(nuevoJson);
  Logger.log("✅ Columna soap reescrita en row " + targetRow);
}
function verHeaders() {
  console.log('Total columnas: ' + HEADERS.length);
  console.log('revalSolicitada en HEADERS? ' + (HEADERS.indexOf('revalSolicitada') !== -1));
  console.log('Ultimas 3: ' + HEADERS.slice(-3).join(', '));
}
function censoForenseMigPac(){
var ss=SpreadsheetApp.openById('1-8UYgdT4Bmte4BXcbtPfmsJJ6qpyzJXYIxnaCDEZW-s');
var hojas=ss.getSheets();
Logger.log('=== PESTANAS ===');
hojas.forEach(function(h){Logger.log(h.getName()+' | filas='+h.getLastRow()+' | cols='+h.getLastColumn());});
['LIMPIEZA_20260623_1355','BACKUP_60filas_2jul'].forEach(function(n){Logger.log('EXISTE '+n+'? '+(ss.getSheetByName(n)?'SI':'NO'));});
function fechaDe_(v){
 if(v===null||v===undefined||v==='')return null;
 if(v instanceof Date){return isNaN(v.getTime())?null:v;}
 var n=Number(v);
 if(isFinite(n)&&n>1000000000000)return new Date(n);
 if(isFinite(n)&&n>1000000000&&n<10000000000)return new Date(n*1000);
 if(!isFinite(n)){var d=new Date(String(v));if(!isNaN(d.getTime()))return d;}
 return null;
}
function censoHoja(nombre){
 var h=ss.getSheetByName(nombre);
 if(!h){Logger.log('(no existe: '+nombre+')');return null;}
 var data=h.getDataRange().getValues();
 if(data.length<1){Logger.log(nombre+': vacia');return{ids:[],celdas:0};}
 var headers=data[0].map(String);
 var colId=headers.indexOf('id'),colName=headers.indexOf('name'),colUpd=headers.indexOf('updatedAt');
 var usaFallback=(colId===-1);
 if(usaFallback)Logger.log('>>> '+nombre+': SIN columna id -> USANDO FALLBACK REGEX. Encabezados: '+headers.slice(0,12).join(' | '));
 var ids=[],celdas=0,vistos={},dup=[],sinFecha=0,crudos=[];
 var re=/mig_pac_[a-f0-9]+/gi;
 for(var i=(usaFallback?0:1);i<data.length;i++){
  var fila=data[i], idsFila={};
  for(var j=0;j<fila.length;j++){
   var s=String(fila[j]);
   if(s.indexOf('mig_pac_')!==-1){celdas++;
    if(usaFallback){var m=s.match(re); if(m)m.forEach(function(x){idsFila[x]=1;});}
   }
  }
  var encontrados=[];
  if(usaFallback){encontrados=Object.keys(idsFila);}
  else{var id=String(fila[colId]||'').trim(); if(id.indexOf('mig_pac_')===0)encontrados=[id];}
  encontrados.forEach(function(id){
   if(vistos[id])dup.push(id); vistos[id]=true; ids.push(id);
   var crudo=(!usaFallback&&colUpd>-1)?fila[colUpd]:null;
   var f=fechaDe_(crudo);
   var fecha=f?Utilities.formatDate(f,'America/Mexico_City','yyyy-MM-dd HH:mm'):'(sin fecha)';
   if(!f){sinFecha++; if(crudos.length<3)crudos.push(String(crudo).slice(0,60));}
   Logger.log(nombre+' fila '+(i+1)+' | '+id+' | '+((!usaFallback&&colName>-1)?fila[colName]:'?')+' | '+fecha);
  });
 }
 Logger.log('>>> '+nombre+': FILAS/IDS mig_pac_='+ids.length+' | CELDAS con mig_pac_='+celdas+' | sin fecha='+sinFecha+(usaFallback?' | (via FALLBACK)':'')+(dup.length?(' | DUPLICADOS: '+dup.join(', ')):''));
 if(crudos.length)Logger.log('>>> '+nombre+': updatedAt ilegible ej: '+crudos.join(' || '));
 return{ids:ids,celdas:celdas};
}
var pac=censoHoja('Pacientes');
var totalCeldas=pac?pac.celdas:0;
var enRespaldo={};
hojas.map(function(h){return h.getName();}).filter(function(n){
 return n!=='Pacientes' && (n.toUpperCase().indexOf('LIMPIEZA')===0||n.toUpperCase().indexOf('BACKUP')===0);
}).forEach(function(n){
 var r=censoHoja(n);
 if(r){totalCeldas+=r.celdas; r.ids.forEach(function(id){ if(!enRespaldo[id])enRespaldo[id]=n; });}
});
if(pac){
 var volvieron=pac.ids.filter(function(id){return enRespaldo[id];});
 Logger.log('=== CRUCE ===');
 Logger.log('mig VIVAS en Pacientes: '+pac.ids.length);
 Logger.log('ids distintos en respaldos: '+Object.keys(enRespaldo).length);
 Logger.log('VOLVIERON (vivas HOY y presentes en un respaldo previo = REINGRESO PROBADO): '+volvieron.length);
 volvieron.forEach(function(id){Logger.log('  '+id+' <- '+enRespaldo[id]);});
 Logger.log('celdas mig_pac_ totales: '+totalCeldas+' (compara vs el 72 del buscador)');
}
Logger.log('=== FIN - SOLO LECTURA ===');
}
// ═══ PASO 4 — LIMPIEZA mig_pac_ · pegar en el editor de Apps Script y correr por pasos ═══
// SHEET_ID ya existe en Codigo.gs; estas funciones lo reutilizan.

// ── Helper: localizar la columna 'id' case-insensitive; ABORTA si no existe (anti-silencio) ──
function _colId_(headers){
  for(var i=0;i<headers.length;i++){ if(String(headers[i]||'').trim().toLowerCase()==='id') return i; }
  throw new Error('No se encontro la columna "id" en los headers: '+JSON.stringify(headers.slice(0,12)));
}

// ── CONTADOR (correr ANTES de A y DESPUES de B) ──
function contarMigPac(){
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
function backupMigPac(){
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
// Pasa el nombre EXACTO de la pestaña que creo backupMigPac (lo imprimio en el log).
function borrarMigPacDesdeRespaldo(nombreBackup){
  var ss=SpreadsheetApp.openById(SHEET_ID);
  if(!nombreBackup || nombreBackup==='BACKUP_60filas_2jul'){ throw new Error('Pasa el nombre del respaldo NUEVO (no BACKUP_60filas_2jul).'); }
  var bak=ss.getSheetByName(nombreBackup);
  if(!bak) throw new Error('No existe el respaldo "'+nombreBackup+'" — corre backupMigPac primero');
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
  Logger.log('BORRADO OK -> filas borradas: '+aBorrar.length+' (esperado 52). Ahora corre contarMigPac (debe dar mig_pac_: 0).');
  return {ok:true, borradas:aBorrar.length};
}
function ejecutarBorradoPaso4(){
  return borrarMigPacDesdeRespaldo('BACKUP_52filas_20260718_1055');
}


function verificarRespaldo47(){
  var ss=SpreadsheetApp.openById(SHEET_ID);
  var bak=ss.getSheetByName('BACKUP_47filas_20260718_1100');
  if(!bak){ Logger.log('NO existe la pestaña'); return; }
  var data=bak.getDataRange().getValues();
  var colId=_colId_(data[0]);
  var conId=0, ids=[];
  for(var i=1;i<data.length;i++){
    var id=String(data[i][colId]||'').trim();
    if(id.indexOf('mig_pac_')===0){ conId++; ids.push(id); }
  }
  Logger.log('Filas totales en respaldo: '+(data.length-1));
  Logger.log('Filas con id mig_pac_ válido: '+conId+' (esperado 47)');
  Logger.log('IDS: '+JSON.stringify(ids));
}

function respaldar47EnLog(){
  var ss=SpreadsheetApp.openById(SHEET_ID);
  var sheet=ss.getSheetByName('Pacientes');
  var data=sheet.getDataRange().getValues();
  var headers=data[0];
  var colId=_colId_(headers);
  var filas=[];
  for(var i=1;i<data.length;i++){
    var id=String(data[i][colId]||'').trim();
    if(id.indexOf('mig_pac_')===0){
      var obj={_fila_original:i+1};
      for(var c=0;c<headers.length;c++){ obj[headers[c]]=data[i][c]; }
      filas.push(obj);
    }
  }
  Logger.log('TOTAL mig_pac_ encontradas: '+filas.length+' (esperado 47)');
  Logger.log('=== INICIO RESPALDO JSON (copia TODO esto a un archivo .json en tu compu) ===');
  Logger.log(JSON.stringify(filas));
  Logger.log('=== FIN RESPALDO JSON ===');
}

// ════════════════════════════════════════════════════════════════════════════
// CONEXIÓN CLAUDE — lectura TOTAL + escritura autorizada de todas las pestañas
// ────────────────────────────────────────────────────────────────────────────
// Acciones "claude*" por POST autenticadas con CLAUDE_TOKEN (no Firebase).
//  Lectura:  claudePing, claudeGetPacientes, claudeGetHistoricos, claudeGetPaciente,
//            claudeGetPacienteFull (Sheet + Firestore: incluye estudios/reportes),
//            claudeGetExpedienteFull (doc COMPLETO de Firestore por id, activo o histórico),
//            claudeGetNotas (subcolección sesiones por id),
//            claudeGetArchivo (descarga foto/archivo de Storage → base64).
//  Escritura (Sheet, pipeline de la app → merge por columna, no pisa lo no tocado):
//    claudePonerSugerencia, claudeActualizarClinico, claudeAgregarSoap, claudeAgregarItem.
//  Escritura (Firestore subcolección sesiones): claudeAgregarSoapFS (nota SOAP de históricos mig_pac_).
//  Escritura (Firestore .doc(p.id)): claudeFsMerge (estudiosDocs, reportesClinicosIA, …).
//  Subida de archivos: claudeSubirEstudio (base64 → Storage + entrada en estudiosDocs FS).
//  NUNCA identidad ni consentimientos. Todo queda en Bitacora como CLAUDE.
// El token vive en Script Properties + Drive (claude_token.txt); nunca por chat.
// ════════════════════════════════════════════════════════════════════════════

var CLAUDE_DRIVE_FOLDER_ID = '1rKlV5HHe6hfSzKGU6Y-0_JknTdWNm98w'; // carpeta Respaldos_Clinica
var CLAUDE_STORAGE_BUCKET = 'clinicasinergia-ec2cf.firebasestorage.app';

// Genera (o rota) el token de la conexión Claude. Ejecutar UNA VEZ desde el editor.
function generarTokenClaude() {
  var token = (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '');
  PropertiesService.getScriptProperties().setProperty('CLAUDE_TOKEN', token);
  // FIX seguridad: NO persistir el token en claro en Drive (Respaldos_Clinica/claude_token.txt). Esa
  // carpeta se comparte por correo con los respaldos diarios → filtración. El token vive SOLO en Script
  // Properties. Al rotar, copia el token del Logger (abajo) una sola vez y pégalo donde lo consuma Claude.
  try { getOrCreateSheet(SpreadsheetApp.openById(SHEET_ID)); } catch (e2) {}
  Logger.log('✅ CLAUDE_TOKEN generado (solo en Script Properties). Token: ' + token);
  return 'OK';
}

// Comparación de token en tiempo (casi) constante.
function _claudeAuthOK_(body) {
  var stored = PropertiesService.getScriptProperties().getProperty('CLAUDE_TOKEN');
  if (!stored) return false;
  var recibido = String((body && body.token) || '');
  if (recibido.length !== stored.length) return false;
  var diff = 0;
  for (var i = 0; i < stored.length; i++) diff |= (stored.charCodeAt(i) ^ recibido.charCodeAt(i));
  return diff === 0;
}

// Registra cada acceso de Claude en la hoja Bitacora (usuario = CLAUDE).
function _claudeBitacora_(ss, accion, detalle) {
  try {
    var sh = ss.getSheetByName('Bitacora');
    if (!sh) { sh = ss.insertSheet('Bitacora'); sh.appendRow(['fecha','hora','accion','usuario','correo','rol','userAgent','registradoEn']); }
    var ahora = new Date();
    sh.appendRow([
      Utilities.formatDate(ahora, 'America/Mexico_City', 'yyyy-MM-dd'),
      Utilities.formatDate(ahora, 'America/Mexico_City', 'HH:mm:ss'),
      String(accion || ''), 'CLAUDE', '', 'conexion-claude',
      String(detalle || '').slice(0, 200), ahora.toISOString()
    ]);
  } catch (e) {}
}

// Access token de una Service Account con el scope dado (Firestore o Storage).
function _claudeSAToken_(scope) {
  // [CACHE TOKEN] El token de servicio vive 3600s. Cachearlo ~50 min evita gastar 1 UrlFetch
  // (al endpoint oauth2) en CADA llamada del conector → ~25% menos consumo de la cuota UrlFetch.
  // CacheService es per-script, compartido entre ejecuciones; el valor (~1-2KB) cabe de sobra.
  var _cacheTok = null;
  try { _cacheTok = CacheService.getScriptCache(); } catch (eC) { _cacheTok = null; }
  var _ckey = 'SA_TOK_' + scope;
  if (_cacheTok) { var _hit = _cacheTok.get(_ckey); if (_hit) return _hit; }
  var props = PropertiesService.getScriptProperties();
  var SA_EMAIL = props.getProperty('FIRESTORE_SA_EMAIL');
  var SA_KEY = props.getProperty('FIRESTORE_SA_KEY');
  if (!SA_EMAIL || !SA_KEY) return null;
  var _b64url = function (s) { return Utilities.base64EncodeWebSafe(s).replace(/=+$/, ''); };
  var now = Math.floor(Date.now() / 1000);
  var head = _b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  var claim = _b64url(JSON.stringify({
    iss: SA_EMAIL, scope: scope,
    aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600
  }));
  var uns = head + '.' + claim;
  var sig = Utilities.computeRsaSha256Signature(uns, SA_KEY.replace(/\\n/g, '\n'));
  var assertion = uns + '.' + Utilities.base64EncodeWebSafe(sig).replace(/=+$/, '');
  var res = UrlFetchApp.fetch('https://oauth2.googleapis.com/token', {
    method: 'post', muteHttpExceptions: true,
    payload: { grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: assertion }
  });
  var _tok = (JSON.parse(res.getContentText() || '{}') || {}).access_token || null;
  if (_tok && _cacheTok) { try { _cacheTok.put(_ckey, _tok, 3000); } catch (ePut) {} }   // 50 min (vive 60)
  return _tok;
}
function _claudeFsToken_() { return _claudeSAToken_('https://www.googleapis.com/auth/datastore'); }
function _claudeStorageToken_() { return _claudeSAToken_('https://www.googleapis.com/auth/devstorage.read_only'); }
// Token de Storage con permiso de ESCRITURA (solo para claudeSubirEstudio; el resto usa read_only).
function _claudeStorageTokenRW_() { return _claudeSAToken_('https://www.googleapis.com/auth/devstorage.read_write'); }

// Decodifica el objeto fields de un documento Firestore REST → JS plano.
function _fsDecodeFields_(fields) {
  var _v = function (v) {
    if (v == null) return null;
    if ('stringValue' in v) return v.stringValue;
    if ('booleanValue' in v) return v.booleanValue;
    if ('integerValue' in v) return Number(v.integerValue);
    if ('doubleValue' in v) return v.doubleValue;
    if ('nullValue' in v) return null;
    if ('timestampValue' in v) return v.timestampValue;
    if ('mapValue' in v) { var o = {}; var f = (v.mapValue.fields || {}); for (var k in f) o[k] = _v(f[k]); return o; }
    if ('arrayValue' in v) { return ((v.arrayValue.values) || []).map(_v); }
    return null;
  };
  var out = {}; for (var k in fields) out[k] = _v(fields[k]); return out;
}

// Codifica un valor JS → formato de campo Firestore REST (inverso de _fsDecodeFields_).
function _fsEncodeValue_(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') return (Math.floor(v) === v ? { integerValue: String(v) } : { doubleValue: v });
  if (typeof v === 'string') return { stringValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(_fsEncodeValue_) } };
  if (typeof v === 'object') { var f = {}; for (var k in v) { if (v[k] !== undefined) f[k] = _fsEncodeValue_(v[k]); } return { mapValue: { fields: f } }; }
  return { nullValue: null };
}

// Lee el doc de Firestore .doc(pid) → objeto plano (o null).
function _claudeFsGetDoc_(pid) {
  var tok = _claudeFsToken_();
  if (!tok) return null;
  var PROJ = PropertiesService.getScriptProperties().getProperty('FIRESTORE_PROJECT_ID') || 'clinicasinergia-ec2cf';
  var url = 'https://firestore.googleapis.com/v1/projects/' + PROJ + '/databases/(default)/documents/pacientes/' + encodeURIComponent(pid);
  var r = UrlFetchApp.fetch(url, { method: 'get', headers: { Authorization: 'Bearer ' + tok }, muteHttpExceptions: true });
  if (r.getResponseCode() !== 200) return null;
  return _fsDecodeFields_((JSON.parse(r.getContentText() || '{}').fields) || {});
}

// Router de las acciones claude*. La autenticación se hace AQUÍ (token propio).
function _claudeRouter_(body) {
  if (!_claudeAuthOK_(body)) {
    return respuesta({ ok: false, error: 'CLAUDE_TOKEN inválido o no configurado', code: 401 });
  }
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var action = String(body.action || '');

  if (action === 'claudePing') {
    getOrCreateSheet(ss);
    var lista = leerPacientes(ss);
    _claudeBitacora_(ss, 'claudePing', 'n=' + lista.length);
    // build: marca de versión desplegada — permite confirmar desde fuera qué código está EN VIVO en /exec.
    return respuesta({ ok: true, pong: true, totalPacientes: lista.length, fecha: new Date().toISOString(), build: '2026-09-27-soap-cap-archivo' });
  }

  if (action === 'claudeGetPacientes') {
    var todos = leerPacientes(ss);
    _claudeBitacora_(ss, 'claudeGetPacientes', 'n=' + todos.length);
    return respuesta({ ok: true, total: todos.length, pacientes: todos });
  }

  if (action === 'claudeGetHistoricos') {
    var tok = _claudeFsToken_();
    if (!tok) return respuesta({ ok: false, error: 'Sin credenciales Firestore (FIRESTORE_SA_*)', code: 500 });
    var PROJ = PropertiesService.getScriptProperties().getProperty('FIRESTORE_PROJECT_ID') || 'clinicasinergia-ec2cf';
    var base = 'https://firestore.googleapis.com/v1/projects/' + PROJ + '/databases/(default)/documents/pacientes?pageSize=300';
    var out = [], pageToken = '', paginas = 0;
    try {
      do {
        var url = base + (pageToken ? '&pageToken=' + encodeURIComponent(pageToken) : '');
        var r = UrlFetchApp.fetch(url, { method: 'get', headers: { Authorization: 'Bearer ' + tok }, muteHttpExceptions: true });
        var j = JSON.parse(r.getContentText() || '{}');
        (j.documents || []).forEach(function (doc) {
          var f = _fsDecodeFields_(doc.fields || {});
          var idPath = String(doc.name || '').split('/').pop();
          out.push({
            id: f.id || idPath, name: f.name || '', terapeuta: f.terapeuta || '',
            terapeutaSeguimiento: f.terapeutaSeguimiento || '',
            motivo: f.motivo || f.motivoConsulta || '', motivoHC: f.motivoHC || '',
            dx: f.dx || '', fechaCreacion: f.fechaCreacion || '', updatedAt: f.updatedAt || 0, _origen: 'firestore'
          });
        });
        pageToken = j.nextPageToken || ''; paginas++;
      } while (pageToken && paginas < 30);
    } catch (e) { return respuesta({ ok: false, error: 'Firestore: ' + e.message, code: 500 }); }
    _claudeBitacora_(ss, 'claudeGetHistoricos', 'n=' + out.length);
    return respuesta({ ok: true, total: out.length, historicos: out });
  }

  if (action === 'claudeGetPaciente') {
    var q = String(body.id || body.query || '').trim().toLowerCase();
    if (!q) return respuesta({ ok: false, error: 'Falta id o query', code: 400 });
    var pacs = leerPacientes(ss);
    var exactos = pacs.filter(function (p) { return String(p.id || '').toLowerCase() === q; });
    var res = exactos.length ? exactos
      : pacs.filter(function (p) { return String(p.name || '').toLowerCase().indexOf(q) >= 0; }).slice(0, 5);
    _claudeBitacora_(ss, 'claudeGetPaciente', 'q=' + q + ' hits=' + res.length);
    return respuesta({ ok: true, total: res.length, pacientes: res });
  }

  // Paciente COMPLETO: objeto del Sheet + merge de lo que vive solo en Firestore (estudios, reportes).
  if (action === 'claudeGetPacienteFull') {
    var idF = String(body.id || '').trim();
    if (!idF) return respuesta({ ok: false, error: 'Falta id', code: 400 });
    var pacF = null;
    leerPacientes(ss).forEach(function (p) { if (String(p.id || '') === idF) pacF = p; });
    if (!pacF) return respuesta({ ok: false, error: 'Paciente no encontrado: ' + idF, code: 404 });
    try {
      var dF = _claudeFsGetDoc_(idF);
      if (dF) {
        ['estudiosDocs','reportesClinicosIA'].forEach(function (k) {
          if (dF[k] != null && (pacF[k] == null || (Array.isArray(pacF[k]) && !pacF[k].length))) pacF[k] = dF[k];
        });
        pacF._fs = { estudios: (Array.isArray(dF.estudiosDocs) ? dF.estudiosDocs.length : 0),
                     reportes: (Array.isArray(dF.reportesClinicosIA) ? dF.reportesClinicosIA.length : 0),
                     ejercicios: (Array.isArray(dF.ejercicios) ? dF.ejercicios.length : 0) };
      }
    } catch (eF) {}
    _claudeBitacora_(ss, 'claudeGetPacienteFull', 'id=' + idF);
    return respuesta({ ok: true, paciente: pacF });
  }

  // Expediente COMPLETO: TODOS los campos del doc de Firestore por id (activo o histórico mig_pac_).
  // Trae antecedentes, cirugías, valoracion, dx, motivo, seguridadClinica, etc. — todo lo que exista.
  if (action === 'claudeGetExpedienteFull') {
    var idE = String(body.id || '').trim();
    if (!idE) return respuesta({ ok: false, error: 'Falta id', code: 400 });
    var dE = _claudeFsGetDoc_(idE);
    if (!dE) return respuesta({ ok: false, error: 'Doc no encontrado en Firestore: ' + idE, code: 404 });
    _claudeBitacora_(ss, 'claudeGetExpedienteFull', 'id=' + idE);
    return respuesta({ ok: true, id: idE, expediente: dE });
  }

  // NOTAS SOAP (subcolección sesiones) de cualquier paciente por id (activo o histórico).
  if (action === 'claudeGetNotas') {
    var idN = String(body.id || '').trim();
    if (!idN) return respuesta({ ok: false, error: 'Falta id', code: 400 });
    var tokN = _claudeFsToken_();
    if (!tokN) return respuesta({ ok: false, error: 'Sin credenciales Firestore', code: 500 });
    var PROJN = PropertiesService.getScriptProperties().getProperty('FIRESTORE_PROJECT_ID') || 'clinicasinergia-ec2cf';
    var baseN = 'https://firestore.googleapis.com/v1/projects/' + PROJN + '/databases/(default)/documents/pacientes/' + encodeURIComponent(idN) + '/sesiones?pageSize=300';
    var outN = [], ptokN = '', pagN = 0;
    try {
      do {
        var urlN = baseN + (ptokN ? '&pageToken=' + encodeURIComponent(ptokN) : '');
        var rN = UrlFetchApp.fetch(urlN, { method: 'get', headers: { Authorization: 'Bearer ' + tokN }, muteHttpExceptions: true });
        var jN = JSON.parse(rN.getContentText() || '{}');
        (jN.documents || []).forEach(function (doc) { var f = _fsDecodeFields_(doc.fields || {}); f._sid = String(doc.name || '').split('/').pop(); outN.push(f); });
        ptokN = jN.nextPageToken || ''; pagN++;
      } while (ptokN && pagN < 20);
    } catch (eN) { return respuesta({ ok: false, error: 'Firestore sesiones: ' + eN.message, code: 500 }); }
    outN.sort(function (a, b) { return (Number(a.num) || 0) - (Number(b.num) || 0); });
    _claudeBitacora_(ss, 'claudeGetNotas', 'id=' + idN + ' n=' + outN.length);
    return respuesta({ ok: true, id: idN, total: outN.length, notas: outN });
  }

  // Descarga un archivo de Storage (foto/estudio/doc) → base64. body: { path } (fbPath) o { url }.
  if (action === 'claudeGetArchivo') {
    var pathA = String(body.path || '').trim();
    var urlA = String(body.url || '').trim();
    if (!pathA && urlA) {
      var mm = urlA.match(/\/o\/([^?]+)/);
      if (mm) pathA = decodeURIComponent(mm[1]);
      else { var seg = urlA.split(CLAUDE_STORAGE_BUCKET + '/'); if (seg.length > 1) pathA = decodeURIComponent(seg[1].split('?')[0]); }
    }
    if (!pathA) return respuesta({ ok: false, error: 'Falta path o url', code: 400 });
    // FIX seguridad: acotar la descarga al prefijo de la clínica. Sin esto, con el CLAUDE_TOKEN se podía
    // bajar CUALQUIER objeto del bucket. Toda la media clínica vive bajo clinica/sinergia/.
    if (pathA.indexOf('clinica/sinergia/') !== 0 || pathA.indexOf('..') >= 0) {
      return respuesta({ ok: false, error: 'Ruta no permitida (solo clinica/sinergia/)', code: 403 });
    }
    var tokS = _claudeStorageToken_();
    if (!tokS) return respuesta({ ok: false, error: 'Sin credenciales Storage', code: 500 });
    var urlG = 'https://storage.googleapis.com/storage/v1/b/' + encodeURIComponent(CLAUDE_STORAGE_BUCKET) + '/o/' + encodeURIComponent(pathA) + '?alt=media';
    var rG = UrlFetchApp.fetch(urlG, { method: 'get', headers: { Authorization: 'Bearer ' + tokS }, muteHttpExceptions: true });
    var codeG = rG.getResponseCode();
    if (codeG < 200 || codeG >= 300) return respuesta({ ok: false, error: 'Storage ' + codeG + ': ' + (rG.getContentText() || '').slice(0, 150), code: codeG });
    var blob = rG.getBlob();
    var bytes = blob.getBytes();
    var ct = blob.getContentType() || 'application/octet-stream';
    _claudeBitacora_(ss, 'claudeGetArchivo', 'path=' + pathA + ' bytes=' + bytes.length);
    if (bytes.length > 7000000) return respuesta({ ok: false, error: 'Archivo muy grande para base64 (' + bytes.length + ' bytes); ábrelo por su URL', bytes: bytes.length, contentType: ct, code: 413 });
    return respuesta({ ok: true, path: pathA, contentType: ct, bytes: bytes.length, base64: Utilities.base64Encode(bytes) });
  }

  // ── SUBIDA: foto/estudio (base64 → Storage) + entrada en estudiosDocs de Firestore .doc(id). ──
  // Sube un archivo al MISMO almacén y ruta que usa la app (clinica/sinergia/<id>/estudios/…) con un
  // token de descarga Firebase, y agrega la entrada a estudiosDocs del doc del paciente (activo o
  // histórico) para que se vea en la pestaña Estudios igual que si se hubiera subido desde la app.
  if (action === 'claudeSubirEstudio') {
    var idSU = String(body.id || '').trim();
    if (!idSU) return respuesta({ ok: false, error: 'Falta id', code: 400 });
    var b64SU = String(body.base64 || body.contenido || '');
    if (!b64SU) return respuesta({ ok: false, error: 'Falta base64 del archivo', code: 400 });
    if (b64SU.indexOf(',') >= 0 && /^data:/.test(b64SU)) b64SU = b64SU.slice(b64SU.indexOf(',') + 1); // tolera data URI
    var mimeSU = String(body.mime || body.contentType || 'application/octet-stream').trim() || 'application/octet-stream';
    var nombreSU = String(body.name || body.nombre || 'estudio').trim() || 'estudio';
    var bytesSU;
    try { bytesSU = Utilities.base64Decode(b64SU); } catch (eDec) { return respuesta({ ok: false, error: 'base64 inválido', code: 400 }); }
    if (!bytesSU || !bytesSU.length) return respuesta({ ok: false, error: 'Archivo vacío', code: 400 });
    if (bytesSU.length > 20000000) return respuesta({ ok: false, error: 'Archivo muy grande (' + bytesSU.length + ' bytes; máx 20MB)', bytes: bytesSU.length, code: 413 });
    var tokRW = _claudeStorageTokenRW_();
    if (!tokRW) return respuesta({ ok: false, error: 'Sin credenciales Storage (escritura)', code: 500 });
    var tsSU = Date.now();
    var safeSU = nombreSU.replace(/[^\w.\-]+/g, '_');
    var pathSU = 'clinica/sinergia/' + idSU + '/estudios/' + tsSU + '_' + safeSU;
    var tokenDesc = Utilities.getUuid();
    // Subida MULTIPART en UNA sola llamada (objects.create) con el token de descarga en la metadata.
    // Antes eran 2 pasos (subir + PATCH metadata); el PATCH (objects.update) fallaba con 403 "scope not
    // authorized". Al fijar la metadata durante la CREACIÓN, solo se usa objects.create (que sí funciona).
    var _bnd = 'claudebnd' + Utilities.getUuid().replace(/-/g, '');
    var _metaObj = { name: pathSU, contentType: mimeSU, metadata: { firebaseStorageDownloadTokens: tokenDesc } };
    var _pre = '--' + _bnd + '\r\n' + 'Content-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify(_metaObj) + '\r\n' + '--' + _bnd + '\r\n' + 'Content-Type: ' + mimeSU + '\r\n\r\n';
    var _post = '\r\n--' + _bnd + '--';
    var _bodyBytes = Utilities.newBlob(_pre).getBytes().concat(bytesSU).concat(Utilities.newBlob(_post).getBytes());
    var upUrl = 'https://storage.googleapis.com/upload/storage/v1/b/' + encodeURIComponent(CLAUDE_STORAGE_BUCKET) + '/o?uploadType=multipart';
    var rUp = UrlFetchApp.fetch(upUrl, { method: 'post', contentType: 'multipart/related; boundary=' + _bnd, payload: _bodyBytes, headers: { Authorization: 'Bearer ' + tokRW }, muteHttpExceptions: true });
    var codeUp = rUp.getResponseCode();
    if (codeUp < 200 || codeUp >= 300) return respuesta({ ok: false, error: 'Storage upload ' + codeUp + ': ' + (rUp.getContentText() || '').slice(0, 250), code: codeUp });
    var urlSU = 'https://firebasestorage.googleapis.com/v0/b/' + CLAUDE_STORAGE_BUCKET + '/o/' + encodeURIComponent(pathSU) + '?alt=media&token=' + tokenDesc;
    // 3) Armar la entrada estudiosDocs igual que la app (_baseItem) y agregarla al doc de Firestore.
    var esImg = /^image\//.test(mimeSU);
    var tipoSU = String(body.tipo || (esImg ? 'imagen' : 'documento'));
    var descSU = String(body.descripcion || nombreSU.replace(/\.[^.]+$/, ''));
    var hoyISO = Utilities.formatDate(new Date(), 'America/Mexico_City', 'yyyy-MM-dd');
    var hoyMX = Utilities.formatDate(new Date(), 'America/Mexico_City', 'dd/MM/yyyy');
    var itemSU = {
      id: 'est_' + tsSU + '_' + Math.random().toString(36).slice(2, 6),
      tipo: tipoSU, tipoClinico: String(body.tipoClinico || ''),
      type: mimeSU, descripcion: descSU, name: nombreSU,
      fechaEstudio: String(body.fechaEstudio || hoyISO), fechaAgregado: hoyMX,
      agregadoPor: String(body.agregadoPor || 'Claude'),
      url: urlSU, fbPath: pathSU
    };
    var resumenSU = String(body.resumen || body.interpretacion || '').trim();
    if (resumenSU) itemSU.resumenManual = { texto: resumenSU.slice(0, 600), autor: String(body.agregadoPor || 'Claude'), fecha: new Date().toISOString() };
    var tokFSs = _claudeFsToken_();
    if (!tokFSs) return respuesta({ ok: false, error: 'Subido a Storage pero sin credenciales Firestore para registrar', url: urlSU, fbPath: pathSU, code: 500 });
    var PROJs = PropertiesService.getScriptProperties().getProperty('FIRESTORE_PROJECT_ID') || 'clinicasinergia-ec2cf';
    var docSU = _claudeFsGetDoc_(idSU) || {};
    var arrSU = Array.isArray(docSU.estudiosDocs) ? docSU.estudiosDocs.slice() : [];
    arrSU.push(itemSU);
    var fieldsSU = { estudiosDocs: _fsEncodeValue_(arrSU), ultimoUsuario: _fsEncodeValue_('CLAUDE') };
    var maskSU = ['updateMask.fieldPaths=estudiosDocs', 'updateMask.fieldPaths=ultimoUsuario'];
    var urlFSs = 'https://firestore.googleapis.com/v1/projects/' + PROJs + '/databases/(default)/documents/pacientes/' + encodeURIComponent(idSU) + '?' + maskSU.join('&');
    var rFSs = UrlFetchApp.fetch(urlFSs, { method: 'patch', contentType: 'application/json',
      headers: { Authorization: 'Bearer ' + tokFSs }, muteHttpExceptions: true, payload: JSON.stringify({ fields: fieldsSU }) });
    var codeFSs = rFSs.getResponseCode();
    var okFSs = (codeFSs >= 200 && codeFSs < 300);
    _claudeBitacora_(ss, 'claudeSubirEstudio', 'id=' + idSU + ' path=' + pathSU + ' bytes=' + bytesSU.length + ' fsHttp=' + codeFSs);
    return respuesta({ ok: okFSs, id: idSU, url: urlSU, fbPath: pathSU, bytes: bytesSU.length, item: itemSU, total: arrSU.length,
      fsHttp: codeFSs, error: okFSs ? undefined : ('Subido a Storage; falló registro en Firestore: ' + (rFSs.getContentText() || '').slice(0, 200)) });
  }

  // ── SUBIDA POR LOTE: varios estudios en 1 llamada; 1 lectura+PATCH de Firestore por paciente. ──
  // Reduce ~60% las llamadas vs claudeSubirEstudio 1x1. Cada imagen usa 1 subida a Storage (inevitable).
  // items:[{id,base64,mime,name,tipo,descripcion,fechaEstudio,agregadoPor,dedupNombre}]. Agrupa por id.
  if (action === 'claudeSubirEstudiosLote') {
    var itemsLT = (body.items && body.items.length) ? body.items : null;
    if (!itemsLT) return respuesta({ ok:false, error:'Falta items[]', code:400 });
    var tokRWl = _claudeStorageTokenRW_(); if (!tokRWl) return respuesta({ ok:false, error:'Sin credenciales Storage', code:500 });
    var tokFSl = _claudeFsToken_();        if (!tokFSl) return respuesta({ ok:false, error:'Sin credenciales Firestore', code:500 });
    var PROJl = PropertiesService.getScriptProperties().getProperty('FIRESTORE_PROJECT_ID') || 'clinicasinergia-ec2cf';
    var porPac = {};
    itemsLT.forEach(function(it){ var k=String(it.id||'').trim(); if(k){ (porPac[k]=porPac[k]||[]).push(it); } });
    var resultados=[], subidas=0, fallos=0;
    Object.keys(porPac).forEach(function(idLT){
      var docLT = _claudeFsGetDoc_(idLT) || {};
      var arrLT = Array.isArray(docLT.estudiosDocs) ? docLT.estudiosDocs.slice() : [];
      var existe={}; arrLT.forEach(function(e){ if(e&&e.name) existe[e.name]=1; });
      porPac[idLT].forEach(function(it){
        try {
          var b64=String(it.base64||it.contenido||'');
          if (b64.indexOf(',')>=0 && /^data:/.test(b64)) b64=b64.slice(b64.indexOf(',')+1);
          var nom=String(it.name||it.nombre||'estudio').trim()||'estudio';
          if (it.dedupNombre && existe[nom]) { resultados.push({id:idLT,name:nom,ok:true,skip:'ya_existe'}); return; }
          var bytes=Utilities.base64Decode(b64);
          if (!bytes||!bytes.length){ resultados.push({id:idLT,name:nom,ok:false,error:'vacio'}); fallos++; return; }
          if (bytes.length>20000000){ resultados.push({id:idLT,name:nom,ok:false,error:'muy_grande'}); fallos++; return; }
          var mime=String(it.mime||it.contentType|| (/\.jpe?g$/i.test(nom)?'image/jpeg':(/\.png$/i.test(nom)?'image/png':(/\.pdf$/i.test(nom)?'application/pdf':'application/octet-stream'))));
          var ts=Date.now()+'_'+Math.random().toString(36).slice(2,6);
          var path='clinica/sinergia/'+idLT+'/estudios/'+ts+'_'+nom.replace(/[^\w.\-]+/g,'_');
          var tokenD=Utilities.getUuid();
          var bnd='claudebnd'+Utilities.getUuid().replace(/-/g,'');
          var pre='--'+bnd+'\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n'+JSON.stringify({name:path,contentType:mime,metadata:{firebaseStorageDownloadTokens:tokenD}})+'\r\n--'+bnd+'\r\nContent-Type: '+mime+'\r\n\r\n';
          var payload=Utilities.newBlob(pre).getBytes().concat(bytes).concat(Utilities.newBlob('\r\n--'+bnd+'--').getBytes());
          var up=UrlFetchApp.fetch('https://storage.googleapis.com/upload/storage/v1/b/'+encodeURIComponent(CLAUDE_STORAGE_BUCKET)+'/o?uploadType=multipart',{ method:'post', contentType:'multipart/related; boundary='+bnd, payload:payload, headers:{Authorization:'Bearer '+tokRWl}, muteHttpExceptions:true });
          if (up.getResponseCode()<200||up.getResponseCode()>=300){ resultados.push({id:idLT,name:nom,ok:false,error:'storage_'+up.getResponseCode()}); fallos++; return; }
          var url='https://firebasestorage.googleapis.com/v0/b/'+CLAUDE_STORAGE_BUCKET+'/o/'+encodeURIComponent(path)+'?alt=media&token='+tokenD;
          var esImg=/^image\//.test(mime);
          var item={ id:'est_'+ts, tipo:String(it.tipo||(esImg?'imagen':'documento')), type:mime, descripcion:String(it.descripcion||nom.replace(/\.[^.]+$/,'')), name:nom, fechaEstudio:String(it.fechaEstudio||Utilities.formatDate(new Date(),'America/Mexico_City','yyyy-MM-dd')), fechaAgregado:Utilities.formatDate(new Date(),'America/Mexico_City','dd/MM/yyyy'), agregadoPor:String(it.agregadoPor||'Claude'), url:url, fbPath:path };
          if (it.resumen||it.interpretacion){ item.resumenManual={texto:String(it.resumen||it.interpretacion).slice(0,600),autor:item.agregadoPor,fecha:new Date().toISOString()}; }
          arrLT.push(item); existe[nom]=1; subidas++; resultados.push({id:idLT,name:nom,ok:true,url:url});
        } catch(eIt){ resultados.push({id:idLT,name:String(it.name||''),ok:false,error:String(eIt).slice(0,120)}); fallos++; }
      });
      var fieldsLT={ estudiosDocs:_fsEncodeValue_(arrLT), ultimoUsuario:_fsEncodeValue_('CLAUDE') };
      UrlFetchApp.fetch('https://firestore.googleapis.com/v1/projects/'+PROJl+'/databases/(default)/documents/pacientes/'+encodeURIComponent(idLT)+'?updateMask.fieldPaths=estudiosDocs&updateMask.fieldPaths=ultimoUsuario',{ method:'patch', contentType:'application/json', headers:{Authorization:'Bearer '+tokFSl}, muteHttpExceptions:true, payload:JSON.stringify({fields:fieldsLT}) });
    });
    _claudeBitacora_(ss,'claudeSubirEstudiosLote','items='+itemsLT.length+' subidas='+subidas+' fallos='+fallos);
    return respuesta({ ok:true, subidas:subidas, fallos:fallos, pacientes:Object.keys(porPac).length, resultados:resultados });
  }


  // ── ESCRITURA: sugerencia (SOLO columna sugerenciaIA). texto:'' la limpia. ──
  if (action === 'claudePonerSugerencia') {
    var id = String(body.id || '').trim();
    if (!id) return respuesta({ ok: false, error: 'Falta id', code: 400 });
    var texto = (body.texto === null || body.texto === undefined) ? '' : String(body.texto);
    if (texto.length > 2000) texto = texto.slice(0, 2000);
    var sheet = getOrCreateSheet(ss);
    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) return respuesta({ ok: false, error: 'Sheet vacío', code: 404 });
    var colSug = HEADERS.indexOf('sugerenciaIA');
    if (colSug < 0) return respuesta({ ok: false, error: 'Columna sugerenciaIA no existe', code: 500 });
    var idsCol = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    var fila = -1;
    for (var i = 0; i < idsCol.length; i++) { if (String(idsCol[i][0]).trim() === id) { fila = i + 2; break; } }
    if (fila < 0) return respuesta({ ok: false, error: 'Paciente no encontrado en Sheet: ' + id, code: 404 });
    sheet.getRange(fila, colSug + 1).setValue(texto);
    _claudeBitacora_(ss, 'claudePonerSugerencia', 'id=' + id + ' len=' + texto.length + (texto ? '' : ' (limpiada)'));
    return respuesta({ ok: true, id: id, escrito: texto.length });
  }

  // ── RENOMBRAR paciente (identidad: SOLO el nombre). Candado token. Respaldo del nombre viejo + Bitacora. ──
  // La identidad está bloqueada en claudeActualizarClinico/claudeFsMerge a propósito; esta acción es la
  // ÚNICA vía para corregir un typo de nombre desde la conexión Claude, y SOLO toca 'name' (+ su normalizado en FS).
  // ACTIVO (id p…): escribe la celda 'name' del Sheet (lo que muestra la app) + espeja name/nombreNormalizado a FS.
  // MIGRADO (mig_pac_…): escribe name/nombreNormalizado en el doc de Firestore (no tiene fila en el Sheet).
  if (action === 'claudeRenombrarPaciente') {
    var idRN = String(body.id || '').trim();
    var nombreRN = String(body.name || body.nombre || '').trim();
    if (!idRN) return respuesta({ ok: false, error: 'Falta id', code: 400 });
    if (!nombreRN) return respuesta({ ok: false, error: 'Falta name (nombre nuevo)', code: 400 });
    if (nombreRN.length > 120) return respuesta({ ok: false, error: 'Nombre muy largo (máx 120)', code: 400 });
    // Normalización IGUAL que FST_normalizarNombreLive: sin paréntesis, sin acentos, minúsculas, sin dígitos, no-letra→espacio.
    var _normRN = function (s) {
      s = String(s || '').replace(/\([^)]*\)/g, ' ');
      s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');
      s = s.toLowerCase().replace(/[0-9]/g, ' ').replace(/[^a-z\s]/g, ' ');
      return s.replace(/\s+/g, ' ').trim();
    };
    var nnRN = _normRN(nombreRN);
    var esMigRN = idRN.indexOf('mig_pac_') === 0;
    var viejoRN = '', okSheetRN = false, okFSrn = false;
    if (!esMigRN) {
      var shRN = getOrCreateSheet(ss);
      var lastRowRN = shRN.getLastRow();
      if (lastRowRN <= 1) return respuesta({ ok: false, error: 'Sheet vacío', code: 404 });
      var colNameRN = HEADERS.indexOf('name');
      if (colNameRN < 0) return respuesta({ ok: false, error: 'Columna name no existe', code: 500 });
      var idsColRN = shRN.getRange(2, 1, lastRowRN - 1, 1).getValues();
      var filaRN = -1;
      for (var iRN = 0; iRN < idsColRN.length; iRN++) { if (String(idsColRN[iRN][0]).trim() === idRN) { filaRN = iRN + 2; break; } }
      if (filaRN < 0) return respuesta({ ok: false, error: 'Paciente activo no encontrado en Sheet: ' + idRN, code: 404 });
      viejoRN = String(shRN.getRange(filaRN, colNameRN + 1).getValue() || '');
      shRN.getRange(filaRN, colNameRN + 1).setValue(nombreRN);
      okSheetRN = true;
    }
    // Espejar a Firestore (activo Y migrado): name + nombreNormalizado.
    try {
      var tokFSrn = _claudeFsToken_();
      if (tokFSrn) {
        var PROJrn = PropertiesService.getScriptProperties().getProperty('FIRESTORE_PROJECT_ID') || 'clinicasinergia-ec2cf';
        if (esMigRN) { var docRN = _claudeFsGetDoc_(idRN); if (docRN && docRN.name) viejoRN = String(docRN.name); }
        var fieldsRN = { name: _fsEncodeValue_(nombreRN), nombreNormalizado: _fsEncodeValue_(nnRN), updatedAt: _fsEncodeValue_(Date.now()), ultimoUsuario: _fsEncodeValue_('CLAUDE') };
        var urlRN = 'https://firestore.googleapis.com/v1/projects/' + PROJrn + '/databases/(default)/documents/pacientes/' + encodeURIComponent(idRN) +
          '?updateMask.fieldPaths=name&updateMask.fieldPaths=nombreNormalizado&updateMask.fieldPaths=updatedAt&updateMask.fieldPaths=ultimoUsuario';
        var rRN = UrlFetchApp.fetch(urlRN, { method: 'patch', contentType: 'application/json', headers: { Authorization: 'Bearer ' + tokFSrn }, muteHttpExceptions: true, payload: JSON.stringify({ fields: fieldsRN }) });
        okFSrn = (rRN.getResponseCode() >= 200 && rRN.getResponseCode() < 300);
      }
    } catch (eRN) {}
    if (esMigRN && !okFSrn) return respuesta({ ok: false, error: 'No se pudo escribir el nombre en Firestore (migrado)', code: 500 });
    _claudeBitacora_(ss, 'claudeRenombrarPaciente', 'id=' + idRN + ' "' + viejoRN + '" -> "' + nombreRN + '" sheet=' + okSheetRN + ' fs=' + okFSrn);
    return respuesta({ ok: true, id: idRN, anterior: viejoRN, nuevo: nombreRN, nombreNormalizado: nnRN, sheet: okSheetRN, fs: okFSrn, migrado: esMigRN });
  }

  // Anamnesis / campos de historia (SET). body: { id, campos:{ motivo, motivoHC, dx, valoracion, ... } }
  if (action === 'claudeActualizarClinico') {
    var idAC = String(body.id || '').trim();
    if (!idAC) return respuesta({ ok: false, error: 'Falta id', code: 400 });
    var campos = (body.campos && typeof body.campos === 'object') ? body.campos : null;
    if (!campos) return respuesta({ ok: false, error: 'Falta campos {}', code: 400 });
    var PERMITIDOS = ['dx','motivo','motivoHC','motivoConsulta','valoracion','dxFuncional','planTto',
                      'antecedentes','alergias','contraindicaciones','seguridadClinica',
                      'motivosAnteriores','motivoActualIndex','numSesionEpisodioActual','altaClinica',
                      'sexo','fechaNacimiento'];   // sexo + fechaNacimiento: identidad clínica habilitada (se extraen de estudios/recetas); resto de identidad sigue bloqueado
    var pAC = { id: idAC, updatedAt: Date.now(), ultimoUsuario: 'CLAUDE' }, tocados = [];
    Object.keys(campos).forEach(function(k){ if (PERMITIDOS.indexOf(k) >= 0) { pAC[k] = campos[k]; tocados.push(k); } });
    if (!tocados.length) return respuesta({ ok: false, error: 'Ningún campo permitido en campos', code: 400 });
    var existeAC = leerPacientes(ss).some(function(p){ return String(p.id||'') === idAC; });
    if (!existeAC) return respuesta({ ok: false, error: 'Paciente no encontrado: ' + idAC, code: 404 });
    pAC._soloCampos = tocados.concat(['updatedAt','ultimoUsuario']);
    guardarPacientesConMerge_(ss, [pAC], { usuario: 'CLAUDE' });
    _claudeBitacora_(ss, 'claudeActualizarClinico', 'id=' + idAC + ' campos=' + tocados.join(','));
    return respuesta({ ok: true, id: idAC, actualizados: tocados });
  }

  // Agregar una nota SOAP. body: { id, sesion:{ s,o,a,p, evaI?, evaF?, fecha?, num?, terapeuta? } }
  if (action === 'claudeAgregarSoap') {
    var idSO = String(body.id || '').trim();
    if (!idSO) return respuesta({ ok: false, error: 'Falta id', code: 400 });
    var s = (body.sesion && typeof body.sesion === 'object') ? body.sesion : null;
    if (!s) return respuesta({ ok: false, error: 'Falta sesion {}', code: 400 });
    var pacSO = null;
    leerPacientes(ss).forEach(function(p){ if (String(p.id||'') === idSO) pacSO = p; });
    if (!pacSO) return respuesta({ ok: false, error: 'Paciente no encontrado: ' + idSO, code: 404 });
    var soapPrev = ensamblarSoap_(pacSO);
    var maxNum = 0; soapPrev.forEach(function(x){ var n = Number(x && x.num) || 0; if (n > maxNum) maxNum = n; });
    var ahora = new Date();
    var sesion = {
      id: s.id || ('claude-soap-' + ahora.getTime()),
      num: Number(s.num) || (maxNum + 1),
      fecha: s.fecha || Utilities.formatDate(ahora, 'America/Mexico_City', 'yyyy-MM-dd'),
      fechaHoraISO: ahora.toISOString(),
      terapeuta: s.terapeuta || pacSO.terapeuta || '',
      s: String(s.s || ''), o: String(s.o || ''), a: String(s.a || ''), p: String(s.p || ''),
      evaI: (s.evaI != null ? s.evaI : null), evaF: (s.evaF != null ? s.evaF : null),
      modalidades: Array.isArray(s.modalidades) ? s.modalidades : [],
      completa: true, creadoPor: 'CLAUDE', origen: 'claude',
      updatedAt: ahora.getTime(), createdAt: ahora.toISOString()
    };
    var pSO = { id: idSO, soap: JSON.stringify([sesion]), sesiones: (maxNum + 1),
                updatedAt: ahora.getTime(), ultimoUsuario: 'CLAUDE',
                _soloCampos: ['soap','sesiones','updatedAt','ultimoUsuario'] };
    guardarPacientesConMerge_(ss, [pSO], { usuario: 'CLAUDE' });
    _claudeBitacora_(ss, 'claudeAgregarSoap', 'id=' + idSO + ' num=' + sesion.num);
    return respuesta({ ok: true, id: idSO, sesion: { id: sesion.id, num: sesion.num, fecha: sesion.fecha } });
  }

  // EDITAR una nota SOAP EXISTENTE de un ACTIVO (Sheet): corrige texto de s/o/a/p sin cambiar el resto.
  // body: { id, sesionId, campos:{ s|o|a|p (objeto {dolor,...} → merge de subcampos, o string), evaI?, evaF?, modalidades? } }
  // Preserva todos los demás campos de la nota, sube updatedAt (para que el merge la conserve) y deja historialEdiciones.
  if (action === 'claudeEditarSoap') {
    var idES = String(body.id || '').trim();
    var sidES = String(body.sesionId || body.sid || '').trim();
    if (!idES || !sidES) return respuesta({ ok: false, error: 'Falta id o sesionId', code: 400 });
    var camposES = (body.campos && typeof body.campos === 'object') ? body.campos : null;
    if (!camposES) return respuesta({ ok: false, error: 'Falta campos {}', code: 400 });
    var pacES = null;
    leerPacientes(ss).forEach(function(p){ if (String(p.id || '') === idES) pacES = p; });
    if (!pacES) return respuesta({ ok: false, error: 'Paciente no encontrado: ' + idES, code: 404 });
    var soapArr = ensamblarSoap_(pacES);
    var idxES = -1;
    for (var iE = 0; iE < soapArr.length; iE++) { if (String((soapArr[iE] && soapArr[iE].id) || '') === sidES) { idxES = iE; break; } }
    if (idxES < 0) return respuesta({ ok: false, error: 'Nota no encontrada: ' + sidES, code: 404 });
    var notaES = soapArr[idxES];
    var PERM_ES = ['s','o','a','p','evaI','evaF','modalidades'];
    var tocES = [];
    PERM_ES.forEach(function(k){
      if (!(k in camposES)) return;
      var nv = camposES[k];
      if ((k==='s'||k==='o'||k==='a'||k==='p') && nv && typeof nv === 'object' && !Array.isArray(nv)) {
        var cur = (notaES[k] && typeof notaES[k] === 'object' && !Array.isArray(notaES[k])) ? notaES[k] : {};
        var mrg = {}; var z; for (z in cur) mrg[z] = cur[z]; for (z in nv) if (nv[z] != null) mrg[z] = nv[z];
        notaES[k] = mrg;
      } else { notaES[k] = nv; }
      tocES.push(k);
    });
    if (!tocES.length) return respuesta({ ok: false, error: 'Ningún campo editable', code: 400 });
    notaES.updatedAt = Date.now();
    if (!Array.isArray(notaES.historialEdiciones)) notaES.historialEdiciones = [];
    var ahoraES = new Date();
    notaES.historialEdiciones.push({ fecha: Utilities.formatDate(ahoraES,'America/Mexico_City','yyyy-MM-dd'), hora: Utilities.formatDate(ahoraES,'America/Mexico_City','HH:mm:ss'), usuario: 'CLAUDE', accion: 'corrección ortografía/redacción' });
    soapArr[idxES] = notaES;
    var chES = repartirSoap_(soapArr);
    var pES = { id: idES, soap: chES.soap, soap2: chES.soap2, soap3: chES.soap3, updatedAt: Date.now(), ultimoUsuario: 'CLAUDE',
                _soloCampos: ['soap','soap2','soap3','updatedAt','ultimoUsuario'] };
    guardarPacientesConMerge_(ss, [pES], { usuario: 'CLAUDE' });
    _claudeBitacora_(ss, 'claudeEditarSoap', 'id=' + idES + ' sid=' + sidES + ' campos=' + tocES.join(','));
    return respuesta({ ok: true, id: idES, sesionId: sidES, editados: tocES });
  }

  // Agregar una nota SOAP a un HISTÓRICO (o cualquier paciente): escribe en la subcolección Firestore
  // pacientes/<id>/sesiones (que es de donde la app lee las notas de históricos), NO en el Sheet.
  // body: { id, sesion:{ s,o,a,p (texto u objeto {dolor,cambios,actFisica}...), evaI?, evaF?, fecha?, num?, terapeuta?, modalidades? } }
  if (action === 'claudeAgregarSoapFS') {
    var idSF = String(body.id || '').trim();
    if (!idSF) return respuesta({ ok: false, error: 'Falta id', code: 400 });
    var sf = (body.sesion && typeof body.sesion === 'object') ? body.sesion : null;
    if (!sf) return respuesta({ ok: false, error: 'Falta sesion {}', code: 400 });
    var tokSF = _claudeFsToken_();
    if (!tokSF) return respuesta({ ok: false, error: 'Sin credenciales Firestore', code: 500 });
    var PROJSF = PropertiesService.getScriptProperties().getProperty('FIRESTORE_PROJECT_ID') || 'clinicasinergia-ec2cf';
    // 1) CONTINUIDAD: leer el doc (episodio actual) y las sesiones existentes para numerar bien.
    //    - motivoIndex de la nota = episodio ACTUAL del paciente (motivoActualIndex) salvo que se indique.
    //    - num = siguiente global; numEpisodio = siguiente dentro de ese episodio.
    var docPadSF = _claudeFsGetDoc_(idSF) || {};
    var sidPrev = sf.id ? String(sf.id) : '';   // si se reusa un id (corrección) NO se cuenta como nueva del episodio
    // 1a) Listar TODAS las sesiones existentes (para numerar y para saber el episodio de la última nota).
    var _diaISOx = function(f){ var s=String(f||'').trim(); var m=s.match(/^(\d{4})-(\d{2})-(\d{2})/); if(m) return m[0];
      m=s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/); if(m){ var d=('0'+m[1]).slice(-2), mo=('0'+m[2]).slice(-2), y=m[3]; if(y.length===2) y='20'+y; return y+'-'+mo+'-'+d; } return ''; };
    var baseL = 'https://firestore.googleapis.com/v1/projects/' + PROJSF + '/databases/(default)/documents/pacientes/' + encodeURIComponent(idSF) + '/sesiones?pageSize=300';
    var maxNumF = 0, ptokF = '', pgF = 0, _todas = [], _ultDia = '', _ultMi = null;
    try {
      do {
        var urlL = baseL + (ptokF ? '&pageToken=' + encodeURIComponent(ptokF) : '');
        var rL = UrlFetchApp.fetch(urlL, { method: 'get', headers: { Authorization: 'Bearer ' + tokSF }, muteHttpExceptions: true });
        var jL = JSON.parse(rL.getContentText() || '{}');
        (jL.documents || []).forEach(function(doc){
          var f = _fsDecodeFields_(doc.fields || {});
          var n = Number(f.num) || 0; if (n > maxNumF) maxNumF = n;
          var mi = (typeof f.motivoIndex === 'number') ? f.motivoIndex : 0;
          var thisId = (f.id != null ? String(f.id) : String(doc.name || '').split('/').pop());
          var d = _diaISOx(f.fecha || f.fechaHoraISO);
          _todas.push({ id: thisId, mi: mi, dia: d });
          if (thisId !== sidPrev && d && d >= _ultDia) { _ultDia = d; _ultMi = mi; }   // episodio de la última nota real
        });
        ptokF = jL.nextPageToken || ''; pgF++;
      } while (ptokF && pgF < 20);
    } catch (eL) {}
    // 1b) Episodio de la nota: lo indicado > motivoActualIndex del doc > episodio de la ÚLTIMA nota > 0.
    var epIdx = (sf.motivoIndex != null) ? Number(sf.motivoIndex)
              : ((typeof docPadSF.motivoActualIndex === 'number') ? docPadSF.motivoActualIndex
              : ((_ultMi != null) ? _ultMi : 0));
    var epCount = 0;
    _todas.forEach(function(x){ if (x.mi === epIdx && x.id !== sidPrev) epCount++; });
    var ahoraF = new Date();
    var numF = Number(sf.num) || (maxNumF + 1);
    var numEpisodioF = (sf.numEpisodio != null) ? Number(sf.numEpisodio) : (epCount + 1);
    var sidF = sf.id || ('claude-soap-' + ahoraF.getTime());
    var _so = function(v){ return (v && typeof v === 'object' && !Array.isArray(v)) ? v : String(v || ''); };
    // día ISO (yyyy-mm-dd) desde la fecha de la nota — para el índice fechasSesiones.
    var _diaISO = function(f){ var s=String(f||'').trim(); var m=s.match(/^(\d{4})-(\d{2})-(\d{2})/); if(m) return m[1]+'-'+m[2]+'-'+m[3];
      m=s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/); if(m){ var d=('0'+m[1]).slice(-2), mo=('0'+m[2]).slice(-2), y=m[3]; if(y.length===2) y='20'+y; return y+'-'+mo+'-'+d; } return ''; };
    var fechaNota = sf.fecha || Utilities.formatDate(ahoraF, 'America/Mexico_City', 'yyyy-MM-dd');
    // s/o/a/p con la MISMA estructura que arma la app (defaults + lo recibido), para que se pinte igual.
    var _mrg = function(def, v){ var o = {}; var i; for (i in def) o[i] = def[i]; if (v && typeof v === 'object' && !Array.isArray(v)) { for (i in v) if (v[i] != null) o[i] = v[i]; } return o; };
    var sesionF = {
      id: sidF, num: numF, totalSesiones: numF, semana: Number(sf.semana) || 1,
      motivoIndex: epIdx, numEpisodio: numEpisodioF,
      fecha: fechaNota,
      fechaHoraISO: sf.fechaHoraISO || ahoraF.toISOString(),
      terapeuta: sf.terapeuta || '',
      s: _mrg({ dolor:'', cambios:'', actFisica:'' }, sf.s),
      o: _mrg({ rom:'', fuerza:'', hallazgos:'' }, sf.o),
      a: _mrg({ evolucion:'', respuesta:'', analisis:'' }, sf.a),
      p: _mrg({ tratamiento:'', indicaciones:'', contraindicaciones:'' }, sf.p),
      evaI: (sf.evaI != null ? sf.evaI : null), evaF: (sf.evaF != null ? sf.evaF : null),
      modalidades: Array.isArray(sf.modalidades) ? sf.modalidades : [],
      // Campos NOM que la app escribe (vacíos por defecto) — mismo esquema de una nota nativa.
      objetivoSesion: String(sf.objetivoSesion || ''), respuestaTratamiento: String(sf.respuestaTratamiento || ''),
      tolerancia: String(sf.tolerancia || ''), eventosAdversosSesion: String(sf.eventosAdversosSesion || ''),
      cambiosPlan: String(sf.cambiosPlan || ''), criteriosProgreso: String(sf.criteriosProgreso || ''),
      indicacionesDomiciliarias: String(sf.indicacionesDomiciliarias || ''),
      // BANDERAS DE FORMATO: sin formatoOriginal:'soap' la app la carga como 'texto_libre' y la pinta
      // como "NOTA IMPORTADA — TEXTO ORIGINAL" (sin S/O/A/P). Se igualan a las de una nota nativa.
      completa: true, modoNota: '', importado: false, formatoOriginal: 'soap',
      creadoPor: 'CLAUDE', origen: 'claude', revisionPendiente: false,
      createdAt: sf.createdAt || ahoraF.toISOString(), updatedAt: ahoraF.getTime()
    };
    var fieldsF = {}; Object.keys(sesionF).forEach(function(k){ fieldsF[k] = _fsEncodeValue_(sesionF[k]); });
    // UPSERT por PATCH al doc de la sesión: crea si no existe, ACTUALIZA si ya existe (permite corregir
    // una nota reusando su mismo id, sin duplicar). SA de datastore ⇒ salta reglas.
    var urlC = 'https://firestore.googleapis.com/v1/projects/' + PROJSF + '/databases/(default)/documents/pacientes/' + encodeURIComponent(idSF) + '/sesiones/' + encodeURIComponent(sidF);
    var rC = UrlFetchApp.fetch(urlC, { method: 'patch', contentType: 'application/json',
      headers: { Authorization: 'Bearer ' + tokSF }, muteHttpExceptions: true, payload: JSON.stringify({ fields: fieldsF }) });
    var codeC = rC.getResponseCode();
    var okC = (codeC >= 200 && codeC < 300);
    // 2) Doc padre: mantener el índice de fechas (fechasSesiones) + últimaSesión + bump, para que
    //    "sin documentar" se limpie al instante sin depender del auto-reparador de índice cojo.
    if (okC) {
      try {
        var docPad = docPadSF || {};
        var fechas = Array.isArray(docPad.fechasSesiones) ? docPad.fechasSesiones.slice() : [];
        var diaISO = _diaISO(fechaNota);
        if (diaISO && fechas.indexOf(diaISO) === -1) fechas.push(diaISO);
        var camposPad = { fechasSesiones: fechas, ultimaSesionLive: fechaNota, updatedAt: ahoraF.getTime(), ultimoUsuario: 'CLAUDE' };
        var maskP = [], fieldsPad = {};
        Object.keys(camposPad).forEach(function(k){ fieldsPad[k] = _fsEncodeValue_(camposPad[k]); maskP.push('updateMask.fieldPaths=' + encodeURIComponent(k)); });
        var urlP = 'https://firestore.googleapis.com/v1/projects/' + PROJSF + '/databases/(default)/documents/pacientes/' + encodeURIComponent(idSF) + '?' + maskP.join('&');
        UrlFetchApp.fetch(urlP, { method: 'patch', contentType: 'application/json', headers: { Authorization: 'Bearer ' + tokSF }, muteHttpExceptions: true, payload: JSON.stringify({ fields: fieldsPad }) });
      } catch (eP) {}
    }
    _claudeBitacora_(ss, 'claudeAgregarSoapFS', 'id=' + idSF + ' num=' + numF + ' http=' + codeC);
    return respuesta({ ok: okC, id: idSF, num: numF, sid: sidF, http: codeC, error: okC ? undefined : (rC.getContentText() || '').slice(0, 200) });
  }

  // Agregar un ítem a un arreglo del Sheet (SUMA por id, no reemplaza). body: { id, campo, item }
  if (action === 'claudeAgregarItem') {
    var idIT = String(body.id || '').trim();
    if (!idIT) return respuesta({ ok: false, error: 'Falta id', code: 400 });
    var campo = String(body.campo || '').trim();
    var CAMPOS_ARR = ['ejercicios','etiquetas','revaloraciones','eventosAdversos','fotos','docs','inasistencias','motivosAnteriores'];
    if (CAMPOS_ARR.indexOf(campo) < 0) return respuesta({ ok: false, error: 'Campo de arreglo no permitido: ' + campo, code: 400 });
    if (body.item === null || body.item === undefined) return respuesta({ ok: false, error: 'Falta item', code: 400 });
    var pacIT = null;
    leerPacientes(ss).forEach(function(p){ if (String(p.id||'') === idIT) pacIT = p; });
    if (!pacIT) return respuesta({ ok: false, error: 'Paciente no encontrado: ' + idIT, code: 404 });
    var arr = Array.isArray(pacIT[campo]) ? pacIT[campo].slice() : [];
    var item = body.item;
    if (item && typeof item === 'object' && !Array.isArray(item) && !item.id) item.id = 'claude-' + campo + '-' + Date.now();
    arr.push(item);
    var pIT = { id: idIT, updatedAt: Date.now(), ultimoUsuario: 'CLAUDE' };
    pIT[campo] = arr;
    pIT._soloCampos = [campo, 'updatedAt', 'ultimoUsuario'];
    guardarPacientesConMerge_(ss, [pIT], { usuario: 'CLAUDE' });
    _claudeBitacora_(ss, 'claudeAgregarItem', 'id=' + idIT + ' campo=' + campo + ' total=' + arr.length);
    return respuesta({ ok: true, id: idIT, campo: campo, total: arr.length });
  }

  // Escribir campos que viven en Firestore .doc(p.id) (estudios, reportes, ejercicios).
  if (action === 'claudeFsMerge') {
    var idFS = String(body.id || '').trim();
    var camposFS = (body.campos && typeof body.campos === 'object') ? body.campos : null;
    if (!idFS || !camposFS) return respuesta({ ok: false, error: 'Falta id o campos', code: 400 });
    var PERMITIDOS_FS = ['estudiosDocs','reportesClinicosIA','ejercicios','ejerciciosToken','ejerciciosLinkActivo',
                         'dx','motivo','motivoHC','motivoConsulta','valoracion','dxFuncional','planTto','antecedentes',
                         'alergias','contraindicaciones','seguridadClinica','altaClinica','revaloraciones',
                         'eventosAdversos','etiquetas','motivosAnteriores','motivoActualIndex','numSesionEpisodioActual',
                         'inasistencias','fotos','docs','sexo','fechaNacimiento'];
    var tokFS = _claudeFsToken_();
    if (!tokFS) return respuesta({ ok: false, error: 'Sin credenciales Firestore', code: 500 });
    var PROJ2 = PropertiesService.getScriptProperties().getProperty('FIRESTORE_PROJECT_ID') || 'clinicasinergia-ec2cf';
    var fields = {}, mask = [], escritos = [];
    Object.keys(camposFS).forEach(function(k){
      if (PERMITIDOS_FS.indexOf(k) < 0) return;
      fields[k] = _fsEncodeValue_(camposFS[k]); mask.push('updateMask.fieldPaths=' + encodeURIComponent(k)); escritos.push(k);
    });
    if (!escritos.length) return respuesta({ ok: false, error: 'Ningún campo FS permitido', code: 400 });
    fields['ultimoUsuario'] = _fsEncodeValue_('CLAUDE'); mask.push('updateMask.fieldPaths=ultimoUsuario');
    var urlFS = 'https://firestore.googleapis.com/v1/projects/' + PROJ2 + '/databases/(default)/documents/pacientes/' + encodeURIComponent(idFS) + '?' + mask.join('&');
    var rFS = UrlFetchApp.fetch(urlFS, { method: 'patch', contentType: 'application/json',
      headers: { Authorization: 'Bearer ' + tokFS }, muteHttpExceptions: true, payload: JSON.stringify({ fields: fields }) });
    var codeFS = rFS.getResponseCode();
    var okFS = (codeFS >= 200 && codeFS < 300);
    _claudeBitacora_(ss, 'claudeFsMerge', 'id=' + idFS + ' campos=' + escritos.join(',') + ' http=' + codeFS);
    return respuesta({ ok: okFS, id: idFS, http: codeFS, escritos: escritos, error: okFS ? undefined : (rFS.getContentText() || '').slice(0, 200) });
  }

  // REEMPLAZO DE MEDIA EN STORAGE (overwrite en su lugar, CONSERVANDO el token de descarga existente).
  // Sobrescribe el MISMO objeto de Storage (mismo path) con bytes nuevos y le fija el firebaseStorageDownloadTokens
  // EXISTENTE → la URL que ya tiene el paciente (…?alt=media&token=…) sigue sirviendo el archivo nuevo, sin tocar
  // NI el expediente NI el array ejercicios. Úsese para recomprimir videos de ejercicio YA subidos (Claude los baja,
  // los comprime con ffmpeg y los re-sube aquí). El versionado de objetos del bucket (3 versiones / 30 días) conserva
  // la versión anterior → rollback. body: { path, base64, mime, dltoken }. dltoken = el UUID del ?token= de
  // la URL actual del paciente (OJO: NO usar body.token aquí — ese es el CLAUDE_TOKEN de autenticación).
  if (action === 'claudeReemplazarMediaStorage') {
    var pathRM = String(body.path || '').trim();
    if (!pathRM) return respuesta({ ok: false, error: 'Falta path', code: 400 });
    // GUARD: solo media de la clínica; nunca fuera del prefijo ni con traversal (mismo candado que claudeGetArchivo).
    if (pathRM.indexOf('clinica/sinergia/') !== 0 || pathRM.indexOf('..') >= 0) {
      return respuesta({ ok: false, error: 'Ruta no permitida (solo clinica/sinergia/)', code: 403 });
    }
    var b64RM = String(body.base64 || body.contenido || '');
    if (!b64RM) return respuesta({ ok: false, error: 'Falta base64 del archivo', code: 400 });
    if (b64RM.indexOf(',') >= 0 && /^data:/.test(b64RM)) b64RM = b64RM.slice(b64RM.indexOf(',') + 1); // tolera data URI
    // Token de descarga a CONSERVAR: parámetro PROPIO (dltoken/downloadToken), NUNCA body.token (ese es el
    // CLAUDE_TOKEN de auth). Si se reusara body.token, el objeto quedaría con el secreto de auth como token
    // de descarga y la URL real del paciente (su token) dejaría de servir (403).
    var tokenRM = String(body.dltoken || body.downloadToken || '').trim();
    if (!tokenRM) return respuesta({ ok: false, error: 'Falta dltoken (token de descarga EXISTENTE a conservar; el UUID del ?token= de la URL)', code: 400 });
    var mimeRM = String(body.mime || body.contentType || 'video/mp4').trim() || 'video/mp4';
    var bytesRM;
    try { bytesRM = Utilities.base64Decode(b64RM); } catch (eDecRM) { return respuesta({ ok: false, error: 'base64 inválido', code: 400 }); }
    if (!bytesRM || !bytesRM.length) return respuesta({ ok: false, error: 'Archivo vacío', code: 400 });
    if (bytesRM.length > 30000000) return respuesta({ ok: false, error: 'Archivo muy grande (' + bytesRM.length + ' bytes; máx 30MB)', bytes: bytesRM.length, code: 413 });
    var tokRWrm = _claudeStorageTokenRW_();
    if (!tokRWrm) return respuesta({ ok: false, error: 'Sin credenciales Storage (escritura)', code: 500 });
    // Multipart objects.create con name = path EXISTENTE → GCS crea una generación nueva (overwrite en su lugar);
    // la metadata fija el MISMO firebaseStorageDownloadTokens → la URL vieja no cambia y sirve el archivo nuevo.
    var bndRM = 'claudebnd' + Utilities.getUuid().replace(/-/g, '');
    var metaRM = { name: pathRM, contentType: mimeRM, metadata: { firebaseStorageDownloadTokens: tokenRM } };
    var preRM = '--' + bndRM + '\r\n' + 'Content-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify(metaRM) + '\r\n' + '--' + bndRM + '\r\n' + 'Content-Type: ' + mimeRM + '\r\n\r\n';
    var postRM = '\r\n--' + bndRM + '--';
    var bodyBytesRM = Utilities.newBlob(preRM).getBytes().concat(bytesRM).concat(Utilities.newBlob(postRM).getBytes());
    var upUrlRM = 'https://storage.googleapis.com/upload/storage/v1/b/' + encodeURIComponent(CLAUDE_STORAGE_BUCKET) + '/o?uploadType=multipart';
    var rUpRM = UrlFetchApp.fetch(upUrlRM, { method: 'post', contentType: 'multipart/related; boundary=' + bndRM, payload: bodyBytesRM, headers: { Authorization: 'Bearer ' + tokRWrm }, muteHttpExceptions: true });
    var codeUpRM = rUpRM.getResponseCode();
    if (codeUpRM < 200 || codeUpRM >= 300) return respuesta({ ok: false, error: 'Storage upload ' + codeUpRM + ': ' + (rUpRM.getContentText() || '').slice(0, 250), code: codeUpRM });
    var urlRM = 'https://firebasestorage.googleapis.com/v0/b/' + CLAUDE_STORAGE_BUCKET + '/o/' + encodeURIComponent(pathRM) + '?alt=media&token=' + tokenRM;
    _claudeBitacora_(ss, 'claudeReemplazarMediaStorage', 'path=' + pathRM + ' bytes=' + bytesRM.length + ' http=' + codeUpRM);
    return respuesta({ ok: true, path: pathRM, bytes: bytesRM.length, mime: mimeRM, url: urlRM, http: codeUpRM });
  }

  // LISTA TODA la Cola de revisión (sesiones con revisionPendiente==true), cualquier motivo. collectionGroup
  // sobre 'sesiones'. Devuelve por cada una {pid, sid, fecha, num, terapeuta, atendidoPor, creadoPor, motivos,
  // textoVacio} para que Claude decida y resuelva cada item (fecha / terapeuta / validar).
  if (action === 'claudeColaRevision') {
    var tokLR = _claudeFsToken_();
    if (!tokLR) return respuesta({ ok: false, error: 'Sin credenciales Firestore', code: 500 });
    var PROJLR = PropertiesService.getScriptProperties().getProperty('FIRESTORE_PROJECT_ID') || 'clinicasinergia-ec2cf';
    var urlLR = 'https://firestore.googleapis.com/v1/projects/' + PROJLR + '/databases/(default)/documents:runQuery';
    var qLR = { structuredQuery: { from: [{ collectionId: 'sesiones', allDescendants: true }],
      where: { fieldFilter: { field: { fieldPath: 'revisionPendiente' }, op: 'EQUAL', value: { booleanValue: true } } }, limit: 5000 } };
    var rLR = UrlFetchApp.fetch(urlLR, { method: 'post', contentType: 'application/json', headers: { Authorization: 'Bearer ' + tokLR }, muteHttpExceptions: true, payload: JSON.stringify(qLR) });
    if (rLR.getResponseCode() !== 200) return respuesta({ ok: false, error: 'runQuery ' + rLR.getResponseCode() + ': ' + (rLR.getContentText() || '').slice(0, 180), code: rLR.getResponseCode() });
    var rowsLR; try { rowsLR = JSON.parse(rLR.getContentText() || '[]'); } catch (eLR) { return respuesta({ ok: false, error: 'runQuery parse', code: 500 }); }
    var outLR = [];
    (rowsLR || []).forEach(function (row) {
      if (!row || !row.document) return;
      var fLR = _fsDecodeFields_(row.document.fields || {});
      var nmLR = String(row.document.name || '');
      var mLR = nmLR.match(/pacientes\/([^/]+)\/sesiones\/([^/]+)$/);
      if (!mLR) return;
      var sBlobLR = '';
      try { var sObjLR = fLR.s; if (sObjLR && typeof sObjLR === 'object') sBlobLR = [sObjLR.dolor, sObjLR.cambios, sObjLR.actFisica].join(' '); else if (typeof fLR.s === 'string') sBlobLR = fLR.s; } catch (_sLR) {}
      outLR.push({ pid: mLR[1], sid: mLR[2], fecha: fLR.fecha || '', num: (fLR.num != null ? fLR.num : null),
        terapeuta: fLR.terapeuta || '', atendidoPor: (Array.isArray(fLR.atendidoPor) ? fLR.atendidoPor : (fLR.atendidoPor || '')), creadoPor: fLR.creadoPor || '',
        motivos: (Array.isArray(fLR.motivosRevision) ? fLR.motivosRevision : []), textoVacio: !(String(sBlobLR).trim()) });
    });
    _claudeBitacora_(ss, 'claudeColaRevision', 'n=' + outLR.length);
    return respuesta({ ok: true, total: outLR.length, items: outLR });
  }

  // RESUELVE una sesión de la Cola. ACOTADA (seguridad): solo actúa si la sesión tiene revisionPendiente==true
  // (está en la cola) → no puede tocar notas normales. body: { id, sesionId, fecha?(yyyy-mm-dd), terapeuta?,
  // quitarMotivos?[] }. Aplica fecha/terapeuta si vienen, quita los motivos indicados, y revisionPendiente =
  // (quedan motivos). La decisión (qué fecha / terapeuta / qué motivos quitar) la calcula Claude.
  if (action === 'claudeResolverSesion') {
    var idRS = String(body.id || '').trim();
    var sidRS = String(body.sesionId || body.sid || '').trim();
    if (!idRS || !sidRS) return respuesta({ ok: false, error: 'Falta id o sesionId', code: 400 });
    var fechaRS = String(body.fecha || '').trim();
    if (fechaRS && !/^\d{4}-\d{2}-\d{2}$/.test(fechaRS)) return respuesta({ ok: false, error: 'fecha debe ser yyyy-mm-dd', code: 400 });
    var terRS = (body.terapeuta != null) ? String(body.terapeuta) : null;
    var quitRS = Array.isArray(body.quitarMotivos) ? body.quitarMotivos.map(String) : [];
    var tokRS = _claudeFsToken_();
    if (!tokRS) return respuesta({ ok: false, error: 'Sin credenciales Firestore', code: 500 });
    var PROJRS = PropertiesService.getScriptProperties().getProperty('FIRESTORE_PROJECT_ID') || 'clinicasinergia-ec2cf';
    var baseRS = 'https://firestore.googleapis.com/v1/projects/' + PROJRS + '/databases/(default)/documents/pacientes/' + encodeURIComponent(idRS) + '/sesiones/' + encodeURIComponent(sidRS);
    var rGetRS = UrlFetchApp.fetch(baseRS, { method: 'get', headers: { Authorization: 'Bearer ' + tokRS }, muteHttpExceptions: true });
    if (rGetRS.getResponseCode() !== 200) return respuesta({ ok: false, error: 'Sesion no encontrada: ' + (rGetRS.getContentText() || '').slice(0, 150), code: 404 });
    var fRS = _fsDecodeFields_((JSON.parse(rGetRS.getContentText() || '{}').fields) || {});
    if (fRS.revisionPendiente !== true) return respuesta({ ok: false, error: 'La sesion no esta en la cola (revisionPendiente!=true); no se modifica', code: 400 });
    var motRS = Array.isArray(fRS.motivosRevision) ? fRS.motivosRevision : [];
    var nuevosRS = motRS.filter(function (m) { return quitRS.indexOf(m) < 0; });
    var pendRS = nuevosRS.length > 0;
    var fieldsRS = { motivosRevision: _fsEncodeValue_(nuevosRS), revisionPendiente: _fsEncodeValue_(pendRS), updatedAt: _fsEncodeValue_(Date.now()), ultimoUsuario: _fsEncodeValue_('CLAUDE') };
    var maskRS = ['updateMask.fieldPaths=motivosRevision', 'updateMask.fieldPaths=revisionPendiente', 'updateMask.fieldPaths=updatedAt', 'updateMask.fieldPaths=ultimoUsuario'];
    if (fechaRS) { fieldsRS.fecha = _fsEncodeValue_(fechaRS); maskRS.push('updateMask.fieldPaths=fecha'); }
    if (terRS !== null) { fieldsRS.terapeuta = _fsEncodeValue_(terRS); maskRS.push('updateMask.fieldPaths=terapeuta'); }
    var rPRS = UrlFetchApp.fetch(baseRS + '?' + maskRS.join('&'), { method: 'patch', contentType: 'application/json', headers: { Authorization: 'Bearer ' + tokRS }, muteHttpExceptions: true, payload: JSON.stringify({ fields: fieldsRS }) });
    var codePRS = rPRS.getResponseCode();
    var okRS = (codePRS >= 200 && codePRS < 300);
    _claudeBitacora_(ss, 'claudeResolverSesion', 'id=' + idRS + ' sid=' + sidRS + ' fecha=' + fechaRS + ' ter=' + (terRS || '') + ' quita=' + quitRS.join('|') + ' http=' + codePRS);
    return respuesta({ ok: okRS, id: idRS, sesionId: sidRS, fecha: fechaRS || undefined, terapeuta: (terRS !== null ? terRS : undefined), revisionPendiente: pendRS, motivosRestantes: nuevosRS, http: codePRS, error: okRS ? undefined : (rPRS.getContentText() || '').slice(0, 200) });
  }

  // INICIO MANTENIMIENTO TEMPORAL (conexion Claude) - QUITAR AL TERMINAR LA LIMPIEZA
  // Acciones destructivas con candado CLAUDE_TOKEN. Borrado SIEMPRE SUAVE: respaldo a
  // revision/ + entrada en papelera/ + tombstone (identico a _borrarPaciente del front) ->
  // todo RESTAURABLE desde la papelera de la app. Para QUITAR: borrar este bloque completo
  // (de "INICIO MANTENIMIENTO" a "FIN MANTENIMIENTO") y volver a desplegar (New version).
  var _MNT_PROJ = PropertiesService.getScriptProperties().getProperty('FIRESTORE_PROJECT_ID') || 'clinicasinergia-ec2cf';
  var _mntBase = function(){ return 'https://firestore.googleapis.com/v1/projects/' + _MNT_PROJ + '/databases/(default)/documents'; };
  var _mntEnc  = function(obj){ var f = {}; for (var k in obj) { if (obj[k] !== undefined) f[k] = _fsEncodeValue_(obj[k]); } return { fields: f }; };
  var _mntTok  = function(){ return _claudeFsToken_(); };
  var _mntGet  = function(path){ var t=_mntTok(); if(!t) return null; var r=UrlFetchApp.fetch(_mntBase()+'/'+path,{method:'get',headers:{Authorization:'Bearer '+t},muteHttpExceptions:true}); if(r.getResponseCode()!==200) return null; return _fsDecodeFields_((JSON.parse(r.getContentText()||'{}').fields)||{}); };
  var _mntPatch = function(path, obj, mask){ var t=_mntTok(); var q = (mask&&mask.length) ? ('?'+mask.map(function(m){return 'updateMask.fieldPaths='+encodeURIComponent(m);}).join('&')) : ''; var r=UrlFetchApp.fetch(_mntBase()+'/'+path+q,{method:'patch',contentType:'application/json',headers:{Authorization:'Bearer '+t},muteHttpExceptions:true,payload:JSON.stringify(_mntEnc(obj))}); return r.getResponseCode(); };
  var _mntCreate = function(coll, obj){ var t=_mntTok(); var r=UrlFetchApp.fetch(_mntBase()+'/'+coll,{method:'post',contentType:'application/json',headers:{Authorization:'Bearer '+t},muteHttpExceptions:true,payload:JSON.stringify(_mntEnc(obj))}); return {code:r.getResponseCode(), name:((JSON.parse(r.getContentText()||'{}')||{}).name||'')}; };
  var _mntListSub = function(path){ var t=_mntTok(); var out=[]; var pg=''; do { var u=_mntBase()+'/'+path+'?pageSize=300'+(pg?('&pageToken='+encodeURIComponent(pg)):''); var r=UrlFetchApp.fetch(u,{method:'get',headers:{Authorization:'Bearer '+t},muteHttpExceptions:true}); if(r.getResponseCode()!==200) break; var j=JSON.parse(r.getContentText()||'{}'); (j.documents||[]).forEach(function(d){ out.push({id:String(d.name||'').split('/').pop(), data:_fsDecodeFields_(d.fields||{})}); }); pg=j.nextPageToken||''; } while(pg); return out; };
  var _mntDelete = function(path){ var t=_mntTok(); if(!t) return false; var r=UrlFetchApp.fetch(_mntBase()+'/'+path,{method:'delete',headers:{Authorization:'Bearer '+t},muteHttpExceptions:true}); var c=r.getResponseCode(); return (c>=200&&c<300); };
  var _mntVacio = function(v){ if (v===null||v===undefined) return true; if (typeof v==='string'){ var t=v.trim().toLowerCase(); return (!t || /^(pendiente|no cuenta con diagn|sin diagn|no especificad|ninguna|ninguno|n\/?d|n\/?a|—|-|\[pendiente\])/.test(t)); } if (Array.isArray(v)) return v.length===0; if (typeof v==='object'){ for (var k in v){ if (!_mntVacio(v[k])) return false; } return true; } return false; };
  var _mntTombstonePac = function(pid, borradoPor, ts, esHist){
    var pref = 'pacientes/' + encodeURIComponent(pid);
    var doc = _mntGet(pref);
    if (!doc) return { ok:false, msg:'doc no existe en Firestore' };
    var revId = (esHist?'pacHist':'pacAct') + '__' + pid + '__' + ts;
    var cBk = _mntPatch('revision/' + encodeURIComponent(revId), { tipo:(esHist?'pacienteHistorico':'pacienteActivo'), pid:pid, ts:ts, borradoPor:borradoPor, nombre:(doc.name||pid), paciente:doc, origen:'claude-mantenimiento' }, null);
    if (cBk<200||cBk>=300) return { ok:false, msg:'backup revision/ fallo http '+cBk };
    var ses = _mntListSub(pref + '/sesiones');
    var nSes = ses.length, backOK=0;
    ses.forEach(function(s){ var c=_mntPatch('revision/'+encodeURIComponent(revId)+'/sesiones/'+encodeURIComponent(s.id), s.data, null); if(c>=200&&c<300) backOK++; });
    if (backOK !== nSes) return { ok:false, msg:'backup sesiones incompleto ('+backOK+'/'+nSes+') - NO se borro' };
    var pap = _mntCreate('papelera', { tipo:(esHist?'pacienteHistorico':'pacienteActivo'), pid:pid, nombre:(doc.name||pid), numSesiones:nSes, ts:ts, borradoPor:borradoPor, revId:revId, origen:'claude-mantenimiento' });
    if (pap.code<200||pap.code>=300) return { ok:false, msg:'papelera/ fallo http '+pap.code };
    _mntPatch(pref, { eliminado:true, eliminadoPor:borradoPor, eliminadoFecha:new Date(ts).toISOString() }, ['eliminado','eliminadoPor','eliminadoFecha']);
    if (!esHist) {
      _mntPatch('pacientesEliminados/' + encodeURIComponent('pacienteActivo__'+pid), { tipo:'pacienteActivo', id:pid, eliminadoPor:borradoPor, eliminadoFecha:new Date(ts).toISOString() }, null);
    }
    return { ok:true, revId:revId, papId:(pap.name.split('/').pop()||''), numSesiones:nSes };
  };

  if (action === 'claudeBorrarEstudio') {
    var idBE = String(body.id||'').trim();
    var keyBE = String(body.estudioId||body.name||body.url||'').trim();
    if (!idBE || !keyBE) return respuesta({ ok:false, error:'Falta id y (estudioId|name|url)', code:400 });
    var docBE = _claudeFsGetDoc_(idBE); if (!docBE) return respuesta({ ok:false, error:'Paciente no existe en FS', code:404 });
    var arrBE = Array.isArray(docBE.estudiosDocs) ? docBE.estudiosDocs.slice() : [];
    var quitados = arrBE.filter(function(e){ return e && (String(e.id)===keyBE || String(e.name)===keyBE || String(e.url)===keyBE); });
    if (!quitados.length) return respuesta({ ok:true, removed:0, msg:'No habia estudio con ese id/name/url (idempotente)' });
    var nuevoBE = arrBE.filter(function(e){ return !(e && (String(e.id)===keyBE || String(e.name)===keyBE || String(e.url)===keyBE)); });
    var tsBE = Date.now();
    _mntPatch('revision/' + encodeURIComponent('estudio__'+idBE+'__'+tsBE), { tipo:'estudioBorrado', pid:idBE, ts:tsBE, quitados:quitados, origen:'claude-mantenimiento' }, null);
    var cBE = _mntPatch('pacientes/'+encodeURIComponent(idBE), { estudiosDocs:nuevoBE, ultimoUsuario:'CLAUDE' }, ['estudiosDocs','ultimoUsuario']);
    _claudeBitacora_(ss,'claudeBorrarEstudio','id='+idBE+' key='+keyBE+' quitados='+quitados.length+' http='+cBE);
    return respuesta({ ok:(cBE>=200&&cBE<300), id:idBE, removed:quitados.length, http:cBE });
  }

  if (action === 'claudeReemplazarEstudio') {
    var idRE = String(body.id||'').trim();
    var eidRE = String(body.estudioId||'').trim();
    var b64RE = String(body.base64||body.contenido||'');
    if (!idRE || !eidRE || !b64RE) return respuesta({ ok:false, error:'Falta id, estudioId o base64', code:400 });
    if (b64RE.indexOf(',')>=0 && /^data:/.test(b64RE)) b64RE=b64RE.slice(b64RE.indexOf(',')+1);
    var docRE = _claudeFsGetDoc_(idRE); if (!docRE) return respuesta({ ok:false, error:'Paciente no existe en FS', code:404 });
    var arrRE = Array.isArray(docRE.estudiosDocs) ? docRE.estudiosDocs.slice() : [];
    var ixRE = -1; for (var i=0;i<arrRE.length;i++){ if (arrRE[i] && String(arrRE[i].id)===eidRE){ ixRE=i; break; } }
    if (ixRE<0) return respuesta({ ok:false, error:'No existe estudio con id '+eidRE, code:404 });
    var bytesRE=Utilities.base64Decode(b64RE);
    if (!bytesRE||!bytesRE.length) return respuesta({ ok:false, error:'imagen vacia', code:400 });
    if (bytesRE.length>20000000) return respuesta({ ok:false, error:'muy_grande', code:400 });
    var nomRE = String(body.name||arrRE[ixRE].name||'estudio').trim()||'estudio';
    var mimeRE = String(body.mime||body.contentType|| (/\.png$/i.test(nomRE)?'image/png':(/\.pdf$/i.test(nomRE)?'application/pdf':'image/jpeg')));
    var tokRWre=_claudeStorageTokenRW_(); if(!tokRWre) return respuesta({ ok:false, error:'Sin credenciales Storage', code:500 });
    var tsRE=Date.now()+'_'+Math.random().toString(36).slice(2,6);
    var pathRE='clinica/sinergia/'+idRE+'/estudios/'+tsRE+'_'+nomRE.replace(/[^\w.\-]+/g,'_');
    var tokenDre=Utilities.getUuid();
    var bndRE='claudebnd'+Utilities.getUuid().replace(/-/g,'');
    var preRE='--'+bndRE+'\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n'+JSON.stringify({name:pathRE,contentType:mimeRE,metadata:{firebaseStorageDownloadTokens:tokenDre}})+'\r\n--'+bndRE+'\r\nContent-Type: '+mimeRE+'\r\n\r\n';
    var payloadRE=Utilities.newBlob(preRE).getBytes().concat(bytesRE).concat(Utilities.newBlob('\r\n--'+bndRE+'--').getBytes());
    var upRE=UrlFetchApp.fetch('https://storage.googleapis.com/upload/storage/v1/b/'+encodeURIComponent(CLAUDE_STORAGE_BUCKET)+'/o?uploadType=multipart',{ method:'post', contentType:'multipart/related; boundary='+bndRE, payload:payloadRE, headers:{Authorization:'Bearer '+tokRWre}, muteHttpExceptions:true });
    if (upRE.getResponseCode()<200||upRE.getResponseCode()>=300) return respuesta({ ok:false, error:'storage_'+upRE.getResponseCode(), code:502 });
    var urlRE='https://firebasestorage.googleapis.com/v0/b/'+CLAUDE_STORAGE_BUCKET+'/o/'+encodeURIComponent(pathRE)+'?alt=media&token='+tokenDre;
    var oldPath = arrRE[ixRE].fbPath||'';
    arrRE[ixRE].url = urlRE; arrRE[ixRE].fbPath = pathRE; arrRE[ixRE].type = mimeRE;
    arrRE[ixRE].tipo = (/^image\//.test(mimeRE)?'imagen':'documento');
    if (body.name) arrRE[ixRE].name = nomRE;
    arrRE[ixRE].corregidoPor='CLAUDE'; arrRE[ixRE].corregidoFecha=new Date().toISOString(); if(oldPath) arrRE[ixRE].fbPathAnterior=oldPath;
    var cRE = _mntPatch('pacientes/'+encodeURIComponent(idRE), { estudiosDocs:arrRE, ultimoUsuario:'CLAUDE' }, ['estudiosDocs','ultimoUsuario']);
    _claudeBitacora_(ss,'claudeReemplazarEstudio','id='+idRE+' eid='+eidRE+' path='+pathRE+' http='+cRE);
    return respuesta({ ok:(cRE>=200&&cRE<300), id:idRE, estudioId:eidRE, url:urlRE, http:cRE });
  }

  if (action === 'claudeBorrarPaciente') {
    var idBP = String(body.id||'').trim();
    if (!idBP) return respuesta({ ok:false, error:'Falta id', code:400 });
    var esHistBP = idBP.indexOf('mig_pac_')===0;
    var tsBP = Date.now();
    var porBP = 'CLAUDE/lftaranda@gmail.com';
    var tomb = _mntTombstonePac(idBP, porBP, tsBP, esHistBP);
    if (!tomb.ok) { _claudeBitacora_(ss,'claudeBorrarPaciente','id='+idBP+' ABORTADO: '+tomb.msg); return respuesta({ ok:false, error:tomb.msg, code:500 }); }
    var sheetDeleted = false;
    if (!esHistBP) {
      var _lkBP=LockService.getScriptLock(); var gotLk=false;
      try { _lkBP.waitLock(15000); gotLk=true; } catch(eLk){}
      if (gotLk) { try {
        var shBP=getOrCreateSheet(ss); var lrBP=shBP.getLastRow();
        if (lrBP>1){ var colBP=shBP.getRange(2,1,lrBP-1,1).getValues(); for (var di=0; di<colBP.length; di++){ if (String(colBP[di][0]).trim()===idBP){ shBP.deleteRow(di+2); sheetDeleted=true; break; } } }
      } finally { try{_lkBP.releaseLock();}catch(_r){} } }
      try {
        var tokQ=_mntTok();
        var q={ structuredQuery:{ from:[{collectionId:'pacientes'}], where:{ fieldFilter:{ field:{fieldPath:'appSourceId'}, op:'EQUAL', value:{stringValue:idBP} } }, limit:5 } };
        var rQ=UrlFetchApp.fetch(_mntBase()+':runQuery',{method:'post',contentType:'application/json',headers:{Authorization:'Bearer '+tokQ},muteHttpExceptions:true,payload:JSON.stringify(q)});
        if (rQ.getResponseCode()===200){ var rowsQ=JSON.parse(rQ.getContentText()||'[]'); var espIds=[]; (rowsQ||[]).forEach(function(r){ if(r&&r.document&&r.document.name){ espIds.push(String(r.document.name).split('/').pop()); } }); if (espIds.length===1){ _mntPatch('pacientes/'+encodeURIComponent(espIds[0]), { eliminado:true, eliminadoPor:porBP, eliminadoFecha:new Date(tsBP).toISOString() }, ['eliminado','eliminadoPor','eliminadoFecha']); } }
      } catch(_eQ){}
    }
    _claudeBitacora_(ss,'claudeBorrarPaciente','id='+idBP+' hist='+esHistBP+' ses='+tomb.numSesiones+' sheet='+sheetDeleted+' rev='+tomb.revId);
    return respuesta({ ok:true, id:idBP, historico:esHistBP, numSesiones:tomb.numSesiones, sheetDeleted:sheetDeleted, revId:tomb.revId, papeleraId:tomb.papId, restaurable:true });
  }

  if (action === 'claudeFusionarPacientes') {
    var pPri = String(body.idPrincipal||'').trim(), pSec = String(body.idSecundario||'').trim();
    if (!pPri || !pSec) return respuesta({ ok:false, error:'Falta idPrincipal o idSecundario', code:400 });
    if (pPri===pSec) return respuesta({ ok:false, error:'idPrincipal == idSecundario', code:400 });
    var moverSes = (body.moverSesiones===false) ? false : true;
    var dPri = _claudeFsGetDoc_(pPri), dSec = _claudeFsGetDoc_(pSec);
    if (!dPri) return respuesta({ ok:false, error:'Principal no existe en FS', code:404 });
    if (!dSec) return respuesta({ ok:false, error:'Secundario no existe en FS', code:404 });
    var tsMg = Date.now();
    _mntPatch('revision/'+encodeURIComponent('merge__'+pPri+'__'+pSec+'__'+tsMg), { tipo:'merge', idPrincipal:pPri, idSecundario:pSec, ts:tsMg, principal:dPri, secundario:dSec, origen:'claude-mantenimiento' }, null);
    var mergeArr = function(a,b,keyf){ var out=Array.isArray(a)?a.slice():[]; var seen={}; out.forEach(function(x){ if(x){ seen[keyf(x)]=1; } }); (Array.isArray(b)?b:[]).forEach(function(x){ if(x && !seen[keyf(x)]){ out.push(x); seen[keyf(x)]=1; } }); return out; };
    var kEst=function(e){ return String((e&&(e.url||e.name||e.id))||''); };
    var campos = {};
    campos.estudiosDocs = mergeArr(dPri.estudiosDocs, dSec.estudiosDocs, kEst);
    campos.fotos = mergeArr(dPri.fotos, dSec.fotos, kEst);
    campos.docs  = mergeArr(dPri.docs,  dSec.docs,  kEst);
    ['dx','motivoConsulta','motivo','motivoHC','dxFuncional','planTto','antecedentes','alergias','contraindicaciones','seguridadClinica','valoracion','sexo','fechaNacimiento','age','terapeuta'].forEach(function(k){
      if (_mntVacio(dPri[k]) && !_mntVacio(dSec[k])) campos[k] = dSec[k];
    });
    var maskMg=[], camposMg={}; Object.keys(campos).forEach(function(k){ camposMg[k]=campos[k]; maskMg.push(k); });
    camposMg.ultimoUsuario='CLAUDE'; maskMg.push('ultimoUsuario');
    var cMg = _mntPatch('pacientes/'+encodeURIComponent(pPri), camposMg, maskMg);
    if (cMg<200||cMg>=300) { _claudeBitacora_(ss,'claudeFusionarPacientes','ABORT escribir principal http='+cMg); return respuesta({ ok:false, error:'No se pudo escribir el principal http '+cMg, code:500 }); }
    var sesMovidas=0, sesTotal=0;
    if (moverSes) {
      var sPri = _mntListSub('pacientes/'+encodeURIComponent(pPri)+'/sesiones');
      var firmaPri={}; sPri.forEach(function(s){ var d=s.data||{}; firmaPri[String(d.fecha||'')+'#'+String(d.num||'')+'#'+String((d.textoOriginal||'')).slice(0,40)]=1; });
      var sSec = _mntListSub('pacientes/'+encodeURIComponent(pSec)+'/sesiones'); sesTotal=sSec.length;
      sSec.forEach(function(s){ var d=s.data||{}; var fg=String(d.fecha||'')+'#'+String(d.num||'')+'#'+String((d.textoOriginal||'')).slice(0,40); if(firmaPri[fg]) return; var nid=String(s.id)+'__mg'+tsMg; var c=_mntPatch('pacientes/'+encodeURIComponent(pPri)+'/sesiones/'+encodeURIComponent(nid), d, null); if(c>=200&&c<300){ sesMovidas++; firmaPri[fg]=1; } });
    }
    var esHistSec = pSec.indexOf('mig_pac_')===0;
    var tombSec = _mntTombstonePac(pSec, 'CLAUDE/merge->'+pPri, tsMg, esHistSec);
    if (!esHistSec) {
      var _lkMg=LockService.getScriptLock(); try{ _lkMg.waitLock(15000);
        var shMg=getOrCreateSheet(ss); var lrMg=shMg.getLastRow(); if(lrMg>1){ var colMg=shMg.getRange(2,1,lrMg-1,1).getValues(); for(var dj=0; dj<colMg.length; dj++){ if(String(colMg[dj][0]).trim()===pSec){ shMg.deleteRow(dj+2); break; } } }
      } catch(eLkm){} finally { try{_lkMg.releaseLock();}catch(_rm){} }
    }
    _claudeBitacora_(ss,'claudeFusionarPacientes','pri='+pPri+' sec='+pSec+' estudios='+(campos.estudiosDocs?campos.estudiosDocs.length:0)+' sesMovidas='+sesMovidas+'/'+sesTotal+' secBorrado='+(tombSec&&tombSec.ok));
    return respuesta({ ok:true, idPrincipal:pPri, idSecundario:pSec, estudiosEnPrincipal:(campos.estudiosDocs?campos.estudiosDocs.length:0), sesionesMovidas:sesMovidas, sesionesSecundario:sesTotal, secundarioBorrado:(tombSec&&tombSec.ok)||false, revMergeTs:tsMg, restaurable:true });
  }
  // DES-FUSIÓN: deshace un claudeFusionarPacientes (RESTAURABLE). Restaura el expediente
  // secundario (quita tombstone + papelera), devuelve el principal a su estado PRE-fusión
  // (nombre + arrays + campos que la fusión pudo rellenar) y BORRA del principal las notas
  // que la fusión copió (ids que terminan en __mg<ts>). El ts se toma de eliminadoFecha del
  // secundario (o body.revMergeTs). Candado CLAUDE_TOKEN (igual que claudeFusionarPacientes).
  if (action === 'claudeDesfusionarPacientes') {
    var dxPri = String(body.idPrincipal||'').trim(), dxSec = String(body.idSecundario||'').trim();
    if (!dxPri || !dxSec) return respuesta({ ok:false, error:'Falta idPrincipal o idSecundario', code:400 });
    if (dxPri===dxSec) return respuesta({ ok:false, error:'idPrincipal == idSecundario', code:400 });
    var dSecDX = _mntGet('pacientes/'+encodeURIComponent(dxSec));
    if (!dSecDX) return respuesta({ ok:false, error:'Secundario no existe en FS', code:404 });
    var dPriDX = _mntGet('pacientes/'+encodeURIComponent(dxPri));
    if (!dPriDX) return respuesta({ ok:false, error:'Principal no existe en FS', code:404 });
    var tsDX = 0;
    if (body.revMergeTs) { tsDX = Number(body.revMergeTs)||0; }
    if (!tsDX && dSecDX.eliminadoFecha) { var _pdDX = Date.parse(dSecDX.eliminadoFecha); if (!isNaN(_pdDX)) tsDX = _pdDX; }
    if (!tsDX) return respuesta({ ok:false, error:'No pude determinar el ts de la fusión (el secundario no trae eliminadoFecha); pasa revMergeTs', code:400 });
    var revDX = 'merge__'+dxPri+'__'+dxSec+'__'+tsDX;
    var bkDX = _mntGet('revision/'+encodeURIComponent(revDX));
    if (!bkDX || !bkDX.principal) return respuesta({ ok:false, error:'No encontré el respaldo de la fusión ('+revDX+'); verifica idPrincipal/idSecundario/revMergeTs', code:404 });
    var oPri = bkDX.principal; // doc del principal PRE-fusión

    // 1) RESTAURAR el principal a su estado pre-fusión (revierte nombre, merges de arrays y rellenos de campos)
    var KDX = ['name','nombreNormalizado','estudiosDocs','fotos','docs','dx','motivoConsulta','motivo','motivoHC','dxFuncional','planTto','antecedentes','alergias','contraindicaciones','seguridadClinica','valoracion','sexo','fechaNacimiento','age','terapeuta'];
    var patPriDX = {}, mskPriDX = [];
    KDX.forEach(function(k){ patPriDX[k] = (oPri[k]!==undefined ? oPri[k] : null); mskPriDX.push(k); });
    patPriDX.ultimoUsuario = 'CLAUDE/desfusion'; mskPriDX.push('ultimoUsuario');
    var cPriDX = _mntPatch('pacientes/'+encodeURIComponent(dxPri), patPriDX, mskPriDX);
    var priOkDX = (cPriDX>=200 && cPriDX<300);

    // 2) BORRAR del principal las sesiones que la fusión COPIÓ (ids que terminan en __mg<ts>)
    var sufDX = '__mg'+tsDX;
    var sPriDX = _mntListSub('pacientes/'+encodeURIComponent(dxPri)+'/sesiones');
    var copBorr=0, copTot=0;
    sPriDX.forEach(function(s){ var sid=String(s.id); if (sid.length>=sufDX.length && sid.slice(-sufDX.length)===sufDX){ copTot++; if (_mntDelete('pacientes/'+encodeURIComponent(dxPri)+'/sesiones/'+encodeURIComponent(sid))) copBorr++; } });

    // 3) REACTIVAR el secundario (quitar tombstone del doc)
    var cReactDX = _mntPatch('pacientes/'+encodeURIComponent(dxSec), { eliminado:false, eliminadoPor:null, eliminadoFecha:null }, ['eliminado','eliminadoPor','eliminadoFecha']);
    var secOkDX = (cReactDX>=200 && cReactDX<300);
    var esHistDX = dxSec.indexOf('mig_pac_')===0;
    var sheetPendDX = false;
    if (!esHistDX) {
      _mntDelete('pacientesEliminados/'+encodeURIComponent('pacienteActivo__'+dxSec));
      sheetPendDX = true; // activo: su fila del Sheet se borró en la fusión → re-agregar desde la Papelera de la app
    }
    // 3b) quitar la entrada de papelera/ del secundario (si quedó), por query pid==secundario
    var papBorrDX = 0;
    try {
      var tokPQ = _mntTok();
      var qPQ = { structuredQuery:{ from:[{collectionId:'papelera'}], where:{ fieldFilter:{ field:{fieldPath:'pid'}, op:'EQUAL', value:{stringValue:dxSec} } }, limit:20 } };
      var rPQ = UrlFetchApp.fetch(_mntBase()+':runQuery',{ method:'post', contentType:'application/json', headers:{Authorization:'Bearer '+tokPQ}, muteHttpExceptions:true, payload:JSON.stringify(qPQ) });
      if (rPQ.getResponseCode()===200){ var rowsPQ = JSON.parse(rPQ.getContentText()||'[]'); (rowsPQ||[]).forEach(function(r){ if (r && r.document && r.document.name){ var pidDocPQ = String(r.document.name).split('/').pop(); if (_mntDelete('papelera/'+encodeURIComponent(pidDocPQ))) papBorrDX++; } }); }
    } catch(_ePQ){}

    _claudeBitacora_(ss,'claudeDesfusionarPacientes','pri='+dxPri+' sec='+dxSec+' ts='+tsDX+' priRestaurado='+priOkDX+' secReactivado='+secOkDX+' notasCopiadasBorradas='+copBorr+'/'+copTot+' papelera='+papBorrDX+' sheetPend='+sheetPendDX);
    return respuesta({ ok:(priOkDX && secOkDX), idPrincipal:dxPri, idSecundario:dxSec, revMergeTs:tsDX,
      principalRestaurado:priOkDX, secundarioReactivado:secOkDX,
      nombrePrincipal:(oPri.name||''), nombreSecundario:(dSecDX.name||''),
      notasCopiadasBorradas:copBorr, notasCopiadasTotal:copTot, papeleraLimpiada:papBorrDX,
      sheetReinsertarPendiente:sheetPendDX, restaurado:true });
  }
  // FIN MANTENIMIENTO TEMPORAL - quitar este bloque al terminar

  // ── AUTO-CITAS recepción: manipular la hoja desde la conexión Claude ──
  if (action === 'claudeRecepcion') {
    var _sub = String(body.sub || '');
    var _rss;
    try { _rss = SpreadsheetApp.openById(RECEPCION_SHEET_ID); }
    catch(eR){ return respuesta({ ok:false, error:'No pude abrir la hoja de recepción: '+eR, code:500 }); }
    var _rsh = _rss.getSheetByName('REGISTRO DEL DÍA') || _rss.getSheetByName('REGISTRO DEL DIA');
    if(!_rsh){ var _tds=_rss.getSheets(); if(_tds.length===1) _rsh=_tds[0]; }
    if(!_rsh) return respuesta({ ok:false, error:'No encontré la pestaña REGISTRO DEL DÍA', code:500 });

    if(_sub==='correr'){
      var _ag = autoCitasRecepcion(body.dias || 1);
      _claudeBitacora_(ss,'claudeRecepcion','correr agregadas='+_ag);
      return respuesta({ ok:true, sub:'correr', agregadas:_ag });
    }
    if(_sub==='fechaFix'){
      // SOLO cambia el FORMATO de la columna FECHA a d/m/aaaa. No toca valores ni borra.
      var _d=_rsh.getDataRange().getValues(), _hr=-1;
      function _nrm(x){ return String(x==null?'':x).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase(); }
      for(var _r=0;_r<Math.min(_d.length,12);_r++){ var _row=_d[_r].map(_nrm); if(_row.indexOf('fecha')!==-1 && _row.some(function(z){return z.indexOf('paciente')!==-1;})){ _hr=_r; break; } }
      if(_hr<0) return respuesta({ ok:false, error:'No encontré el encabezado', code:500 });
      var _head=_d[_hr].map(_nrm), _cf=-1;
      for(var _i=0;_i<_head.length;_i++){ if(_head[_i].indexOf('fecha')!==-1){ _cf=_i; break; } }
      if(_cf<0) return respuesta({ ok:false, error:'No hay columna FECHA', code:500 });
      var _lr=_rsh.getLastRow(), _nf=_lr-(_hr+1);
      if(_nf>0) _rsh.getRange(_hr+2, _cf+1, _nf, 1).setNumberFormat('d/m/yyyy');
      _claudeBitacora_(ss,'claudeRecepcion','fechaFix filas='+_nf);
      return respuesta({ ok:true, sub:'fechaFix', filas:_nf });
    }
    if(_sub==='nombresFix'){
      // Actualiza los nombres CORTOS ya escritos en REGISTRO DEL DÍA al nombre COMPLETO del expediente,
      // con la MISMA regla de coincidencia ÚNICA del auto-llenado. PREVIEW por defecto; aplicar:true escribe.
      // Solo reescribe la celda PACIENTE (nunca toca fecha/terapeuta/formato/fórmulas/otras columnas).
      var _aplicar = body.aplicar === true;
      var _dv=_rsh.getDataRange().getValues(), _hr2=-1;
      for(var _r2=0;_r2<Math.min(_dv.length,12);_r2++){
        var _row2=_dv[_r2].map(_normRec_);
        if(_row2.indexOf('paciente')!==-1 && _row2.some(function(x){return x.indexOf('asisti')!==-1;})){ _hr2=_r2; break; }
      }
      if(_hr2<0) return respuesta({ ok:false, error:'No encontré el encabezado', code:500 });
      var _head2=_dv[_hr2].map(_normRec_), _cp2=-1;
      for(var _i2=0;_i2<_head2.length;_i2++){ if(_head2[_i2].indexOf('paciente')!==-1){ _cp2=_i2; break; } }
      if(_cp2<0) return respuesta({ ok:false, error:'No hay columna PACIENTE', code:500 });
      var _idx2=null; try{ _idx2=_recepcionIndexNombres_(ss); }catch(eIx){ _idx2=null; }
      if(!_idx2) return respuesta({ ok:false, error:'No pude armar el índice de nombres (Firestore/Sheet)', code:500 });
      var _cache2={}, _cambios=0, _rev=0, _ej=[];
      var _ini2=_hr2+1, _n2=_rsh.getLastRow()-_ini2;
      if(_n2>0){
        var _rng2=_rsh.getRange(_ini2+1, _cp2+1, _n2, 1), _vals2=_rng2.getValues(), _hubo=false;
        for(var _k2=0;_k2<_vals2.length;_k2++){
          var _orig=String(_vals2[_k2][0]==null?'':_vals2[_k2][0]);
          if(!_orig.trim()) continue;
          _rev++;
          var _nk=_normRec_(_orig), _fin;
          if(_cache2.hasOwnProperty(_nk)){ _fin=_cache2[_nk]; }
          else { try{ _fin=_recepcionResolverNombre_(_orig,_idx2)||_orig; }catch(eRr){ _fin=_orig; } _cache2[_nk]=_fin; }
          if(_fin && _normRec_(_fin)!==_nk){
            _cambios++;
            if(_ej.length<20) _ej.push({de:_orig, a:_fin});
            if(_aplicar){ _vals2[_k2][0]=_fin; _hubo=true; }
          }
        }
        if(_aplicar && _hubo) _rng2.setValues(_vals2);
      }
      _claudeBitacora_(ss,'claudeRecepcion','nombresFix aplicar='+_aplicar+' revisadas='+_rev+' cambios='+_cambios);
      return respuesta({ ok:true, sub:'nombresFix', aplicado:_aplicar, revisadas:_rev, cambios:_cambios, ejemplos:_ej });
    }
    if(_sub==='buscar'){
      // LECTURA: para cada {pac, fecha:'YYYY-MM-DD'} devuelve las filas de REGISTRO DEL DÍA
      // que coinciden (paciente normalizado igual o subset de tokens + misma fecha) con su
      // TERAPEUTA y ASISTIÓ. NO escribe nada.
      var _cons = body.consultas || [];
      if(!_cons.length) return respuesta({ ok:false, error:'Falta consultas:[{pac,fecha}]', code:400 });
      var _dvB=_rsh.getDataRange().getValues(), _hrB=-1;
      for(var _rb=0;_rb<Math.min(_dvB.length,12);_rb++){
        var _rowB=_dvB[_rb].map(_normRec_);
        if(_rowB.indexOf('paciente')!==-1 && _rowB.some(function(x){return x.indexOf('fecha')!==-1;})){ _hrB=_rb; break; }
      }
      if(_hrB<0) return respuesta({ ok:false, error:'No encontré el encabezado', code:500 });
      var _hB=_dvB[_hrB].map(_normRec_);
      function _colB(sub){ for(var i=0;i<_hB.length;i++){ if(_hB[i].indexOf(sub)!==-1) return i; } return -1; }
      var _cF=_colB('fecha'), _cP=_colB('paciente'), _cT=_colB('terapeuta'), _cA=_colB('asisti');
      if(_cF<0||_cP<0) return respuesta({ ok:false, error:'Faltan columnas FECHA/PACIENTE', code:500 });
      function _pad(n){ return (n<10?'0':'')+n; }
      function _fechaKey(v){
        if(v instanceof Date) return v.getFullYear()+'-'+_pad(v.getMonth()+1)+'-'+_pad(v.getDate());
        var s=String(v==null?'':v).trim();
        var m=s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/); if(m) return m[3]+'-'+_pad(+m[2])+'-'+_pad(+m[1]);
        m=s.match(/^(\d{4})-(\d{2})-(\d{2})/); if(m) return m[1]+'-'+m[2]+'-'+m[3];
        return s;
      }
      function _toks(s){ return _normRec_(s).split(' ').filter(function(t){return t.length>1;}); }
      function _subset(a,b){ for(var i=0;i<a.length;i++){ if(b.indexOf(a[i])===-1) return false; } return a.length>0; }
      // indexar filas por fecha
      var _porFecha={};
      for(var _ri=_hrB+1;_ri<_dvB.length;_ri++){
        var _fk=_fechaKey(_dvB[_ri][_cF]);
        if(!_fk) continue;
        (_porFecha[_fk]=_porFecha[_fk]||[]).push(_ri);
      }
      var _out=[];
      for(var _c=0;_c<_cons.length;_c++){
        var _q=_cons[_c], _qp=String(_q.pac||''), _qf=String(_q.fecha||'').slice(0,10);
        var _qt=_toks(_qp), _qn=_normRec_(_qp), _ms=[];
        var _candRows=_porFecha[_qf]||[];
        for(var _m=0;_m<_candRows.length;_m++){
          var _row=_dvB[_candRows[_m]], _cellP=String(_row[_cP]==null?'':_row[_cP]);
          var _cn=_normRec_(_cellP), _ct=_toks(_cellP);
          if(_cn===_qn || _subset(_qt,_ct) || _subset(_ct,_qt)){
            _ms.push({ paciente:_cellP, terapeuta:(_cT>=0?String(_row[_cT]||'').trim():''), asistio:(_cA>=0?String(_row[_cA]||'').trim():'') });
          }
        }
        _out.push({ pac:_qp, fecha:_qf, matches:_ms });
      }
      _claudeBitacora_(ss,'claudeRecepcion','buscar consultas='+_cons.length);
      return respuesta({ ok:true, sub:'buscar', resultados:_out });
    }
    if(_sub==='importar'){
      // UPSERT de filas del Excel de recepción → REGISTRO DEL DÍA (para sincronizar el .xlsx con la Google Sheet):
      //  - si la cita (fecha + nombre, exacto o subset de tokens) NO existe → AGREGA la fila con TODAS sus columnas.
      //  - si existe pero le faltan terapeuta/asistió/costo/… → RELLENA SOLO las celdas en BLANCO (NUNCA pisa un valor).
      // PREVIEW por defecto; aplicar:true escribe. Idempotente. Solo REGISTRO DEL DÍA; no toca Paquetes/fórmulas/otras pestañas.
      var _aplicar3 = body.aplicar === true;
      var _rowsIn = body.rows || [];
      if(!_rowsIn.length) return respuesta({ ok:false, error:'Falta rows:[{fecha,paciente,...}]', code:400 });
      var _dvI=_rsh.getDataRange().getValues(), _hrI=-1;
      for(var _ri0=0;_ri0<Math.min(_dvI.length,12);_ri0++){
        var _rowI=_dvI[_ri0].map(_normRec_);
        if(_rowI.indexOf('paciente')!==-1 && _rowI.some(function(x){return x.indexOf('asisti')!==-1;})){ _hrI=_ri0; break; }
      }
      if(_hrI<0) return respuesta({ ok:false, error:'No encontré el encabezado', code:500 });
      var _hI=_dvI[_hrI].map(_normRec_);
      function _cI(sub){ for(var i=0;i<_hI.length;i++){ if(_hI[i].indexOf(sub)!==-1) return i; } return -1; }
      var ciF=_cI('fecha'), ciP=_cI('paciente'), ciCo=_cI('costo'), ciPa=_cI('pago'), ciFa=_cI('factura'),
          ciTe=_cI('terapeuta'), ciAs=_cI('asisti'), ciSe=_cI('servicio'), ciNu=_cI('cita'), ciOb=_cI('observ'), ciSa=_cI('saldo');
      if(ciF<0||ciP<0) return respuesta({ ok:false, error:'Faltan columnas FECHA/PACIENTE', code:500 });
      function _tk3(s){ return _normRec_(s).split(' ').filter(function(t){return t.length>1;}); }
      function _sub3(a,b){ for(var i=0;i<a.length;i++){ if(b.indexOf(a[i])===-1) return false; } return a.length>0; }
      var _porDia3={};
      for(var _r3=_hrI+1;_r3<_dvI.length;_r3++){
        var _pc3=_dvI[_r3][ciP]; if(!_pc3) continue;
        var _dk3=_diaKeyRec_(_dvI[_r3][ciF]); (_porDia3[_dk3]=_porDia3[_dk3]||[]).push(_r3);
      }
      var _ancho3=_rsh.getLastColumn(), _nuevas3=[], _rellenos3=[], _ejAdd=[], _ejFill=[], _nFill=0;
      var _mapCol=[[ciCo,'costo'],[ciPa,'tipoPago'],[ciFa,'factura'],[ciTe,'terapeuta'],[ciAs,'asistio'],[ciSe,'servicio'],[ciNu,'numCita'],[ciOb,'obs'],[ciSa,'saldo']];
      // clave de día ISO-aware para el import: _diaKeyRec_ mal-parsea 'YYYY-MM-DD' (su 1er regex d/m/aaaa
      // la toma como DD-MM-AA) → aquí ISO primero, y si no, cae a _diaKeyRec_ (acepta d/m/aaaa y Date).
      function _dkImp(f){ var m=String(f==null?'':f).match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? (m[1]+m[2]+m[3]) : _diaKeyRec_(f); }
      for(var _q3=0;_q3<_rowsIn.length;_q3++){
        var R=_rowsIn[_q3], nom=String(R.paciente||'').trim();
        if(!nom || !R.fecha) continue;
        var dk3=_dkImp(R.fecha), cand3=_porDia3[dk3]||[], nt=_tk3(nom), nn=_normRec_(nom), hit=-1;
        for(var _m3=0;_m3<cand3.length;_m3++){
          var rIdx=cand3[_m3], cp=String(_dvI[rIdx][ciP]==null?'':_dvI[rIdx][ciP]), cn=_normRec_(cp), ct=_tk3(cp);
          if(cn===nn || _sub3(nt,ct) || _sub3(ct,nt)){ hit=rIdx; break; }
        }
        if(hit<0){
          var fila=[]; for(var _c3=0;_c3<_ancho3;_c3++) fila[_c3]='';
          var pm=String(R.fecha).match(/(\d{4})-(\d{2})-(\d{2})/);
          fila[ciF]= pm ? new Date(+pm[1],+pm[2]-1,+pm[3],12,0,0) : R.fecha;
          fila[ciP]=nom;
          for(var _mc=0;_mc<_mapCol.length;_mc++){ var ci=_mapCol[_mc][0], key=_mapCol[_mc][1]; if(ci>=0 && R[key]!=null && String(R[key]).trim()!=='') fila[ci]=R[key]; }
          _nuevas3.push(fila);
          if(_ejAdd.length<15) _ejAdd.push(String(R.fecha)+' '+nom);
        } else {
          var _did=false;
          for(var _mc2=0;_mc2<_mapCol.length;_mc2++){
            var ci2=_mapCol[_mc2][0], key2=_mapCol[_mc2][1]; if(ci2<0) continue;
            var cur=String(_dvI[hit][ci2]==null?'':_dvI[hit][ci2]).trim();
            var nv=R[key2]==null?'':String(R[key2]).trim();
            if(!cur && nv){ _rellenos3.push({r:hit, c:ci2, v:R[key2]}); _dvI[hit][ci2]=R[key2]; _did=true; }
          }
          if(_did){ _nFill++; if(_ejFill.length<15) _ejFill.push(String(R.fecha)+' '+nom); }
        }
      }
      if(_aplicar3){
        for(var _f3=0;_f3<_rellenos3.length;_f3++){ var rr=_rellenos3[_f3]; _rsh.getRange(rr.r+1, rr.c+1).setValue(rr.v); }
        if(_nuevas3.length){
          var _ini3=_rsh.getLastRow()+1, _dest3=_rsh.getRange(_ini3,1,_nuevas3.length,_ancho3);
          _dest3.setValues(_nuevas3);
          var _mf3=_hrI+2;
          if(_mf3<_ini3){
            var _mod3=_rsh.getRange(_mf3,1,1,_ancho3);
            _mod3.copyTo(_dest3,{formatOnly:true});
            try{ var _dvv3=_mod3.getDataValidations()[0], _all3=[]; for(var _qq=0;_qq<_nuevas3.length;_qq++) _all3.push(_dvv3.slice()); _dest3.setDataValidations(_all3); }catch(_e3){}
          }
          if(ciF>=0) _rsh.getRange(_ini3, ciF+1, _nuevas3.length, 1).setNumberFormat('d/m/yyyy');
        }
      }
      _claudeBitacora_(ss,'claudeRecepcion','importar aplicar='+_aplicar3+' add='+_nuevas3.length+' fill='+_nFill);
      return respuesta({ ok:true, sub:'importar', aplicado:_aplicar3, agregadas:_nuevas3.length, rellenadas:_nFill, celdas:_rellenos3.length, ejAdd:_ejAdd, ejFill:_ejFill });
    }
    if(_sub==='borrarFuturas'){
      // Borra de REGISTRO DEL DÍA las filas cuya FECHA es POSTERIOR a HOY (pre-cargas de días futuros).
      // El auto-llenado corre día a día (RECEPCION_DIAS=1) → no debe haber futuros; esto limpia los que
      // quedaron de un 'correr dias>1'. PREVIEW por defecto; aplicar:true borra. Opcional body.desde='YYYY-MM-DD'
      // para borrar desde esa fecha inclusive (default = mañana). Solo REGISTRO DEL DÍA; no toca otras pestañas.
      var _aplicar4 = body.aplicar === true;
      var _hoyK = Utilities.formatDate(new Date(),'America/Mexico_City','yyyyMMdd');
      var _desdeK = _hoyK;  // por defecto: todo lo ESTRICTAMENTE mayor a hoy
      var _estricto = true;
      if(body.desde){ var _md=String(body.desde).match(/^(\d{4})-(\d{2})-(\d{2})/); if(_md){ _desdeK=_md[1]+_md[2]+_md[3]; _estricto=false; } }
      var _dvF=_rsh.getDataRange().getValues(), _hrF=-1;
      for(var _rf0=0;_rf0<Math.min(_dvF.length,12);_rf0++){
        var _rowF=_dvF[_rf0].map(_normRec_);
        if(_rowF.indexOf('paciente')!==-1 && _rowF.some(function(x){return x.indexOf('fecha')!==-1;})){ _hrF=_rf0; break; }
      }
      if(_hrF<0) return respuesta({ ok:false, error:'No encontré el encabezado', code:500 });
      var _hF=_dvF[_hrF].map(_normRec_), _cFF=-1, _cPF=-1;
      for(var _if=0;_if<_hF.length;_if++){ if(_cFF<0&&_hF[_if].indexOf('fecha')!==-1) _cFF=_if; if(_cPF<0&&_hF[_if].indexOf('paciente')!==-1) _cPF=_if; }
      if(_cFF<0) return respuesta({ ok:false, error:'No hay columna FECHA', code:500 });
      var _delRows=[], _ejDel=[];
      for(var _rf=_hrF+1;_rf<_dvF.length;_rf++){
        var _fv=_dvF[_rf][_cFF]; if(_fv===''||_fv==null) continue;
        var _pv=String(_dvF[_rf][_cPF]==null?'':_dvF[_rf][_cPF]).trim(); if(!_pv) continue;
        var _k=_diaKeyRec_(_fv); if(!/^\d{8}$/.test(_k)) continue;
        var _match = _estricto ? (_k>_desdeK) : (_k>=_desdeK);
        if(_match){ _delRows.push(_rf+1); if(_ejDel.length<20) _ejDel.push(_k.slice(0,4)+'-'+_k.slice(4,6)+'-'+_k.slice(6,8)+' '+_pv); }
      }
      if(_aplicar4){
        // borrar de ABAJO hacia ARRIBA para no correr los índices
        _delRows.sort(function(a,b){return b-a;});
        for(var _d4=0;_d4<_delRows.length;_d4++){ _rsh.deleteRow(_delRows[_d4]); }
      }
      _claudeBitacora_(ss,'claudeRecepcion','borrarFuturas aplicar='+_aplicar4+' hoy='+_hoyK+' borradas='+_delRows.length);
      return respuesta({ ok:true, sub:'borrarFuturas', aplicado:_aplicar4, hoy:_hoyK, desde:_desdeK, estricto:_estricto, aBorrar:_delRows.length, ejemplos:_ejDel });
    }
    if(_sub==='fechaFixHojas'){
      // Formatea a d/m/aaaa TODAS las celdas con FECHA de las pestañas indicadas (default: Paquetes/Abonos + Ventas).
      // SOLO cambia el FORMATO de celdas cuyo valor YA es una fecha (objeto Date, o un serial de fecha 43000–55000
      // = ~2017–2050) — NO toca montos/conteos/texto, NO cambia valores, NO toca fórmulas. PREVIEW por defecto; aplicar:true escribe.
      var _aplicar5 = body.aplicar === true;
      var _subcad5 = (body.hojas && body.hojas.length) ? body.hojas.map(function(x){ return _normRec_(x); }) : ['paquete','venta','abono'];
      var _hojasOut = [], _todas5 = _rss.getSheets();
      for(var _hs=0; _hs<_todas5.length; _hs++){
        var _sh5 = _todas5[_hs], _nm5 = _normRec_(_sh5.getName()), _match5=false;
        for(var _sc=0;_sc<_subcad5.length;_sc++){ if(_nm5.indexOf(_subcad5[_sc])!==-1){ _match5=true; break; } }
        if(!_match5) continue;
        var _lr5=_sh5.getLastRow(), _lc5=_sh5.getLastColumn();
        if(_lr5<1||_lc5<1){ _hojasOut.push({ hoja:_sh5.getName(), fechas:0 }); continue; }
        var _rng5=_sh5.getRange(1,1,_lr5,_lc5), _vals5=_rng5.getValues(), _fmts5=_rng5.getNumberFormats(), _cnt5=0;
        for(var _r5=0;_r5<_vals5.length;_r5++){
          for(var _c5=0;_c5<_vals5[_r5].length;_c5++){
            var _v5=_vals5[_r5][_c5];
            var _esFecha = (_v5 instanceof Date) || (typeof _v5==='number' && _v5>=43000 && _v5<=55000);
            if(_esFecha && _fmts5[_r5][_c5] !== 'd/m/yyyy'){ _fmts5[_r5][_c5]='d/m/yyyy'; _cnt5++; }
          }
        }
        if(_aplicar5 && _cnt5>0) _rng5.setNumberFormats(_fmts5);
        _hojasOut.push({ hoja:_sh5.getName(), fechas:_cnt5 });
      }
      _claudeBitacora_(ss,'claudeRecepcion','fechaFixHojas aplicar='+_aplicar5+' '+JSON.stringify(_hojasOut));
      return respuesta({ ok:true, sub:'fechaFixHojas', aplicado:_aplicar5, hojas:_hojasOut });
    }
    if(_sub==='leer'){
      // LECTURA genérica de cualquier pestaña → objetos por encabezado + filtro opcional. No escribe.
      // body:{ hoja?:'paquetes'|'ventas'|'inventario'|'registro'(default), filtro?:{columna:valor}, limite?, sinFecha?:true }
      var _rl=_recLeer_(_rss, body.hoja, body.filtro, body.limite||0, body.sinFecha===true);
      if(_rl.ok) _claudeBitacora_(ss,'claudeRecepcion','leer '+(body.hoja||'registro')+' total='+_rl.total);
      return respuesta(_rl.ok ? Object.assign({sub:'leer'},_rl) : { ok:false, error:_rl.error, code:400 });
    }
    if(_sub==='sinFecha'){
      // Lista las filas de REGISTRO DEL DÍA con FECHA vacía/ inválida (las que estorban abajo).
      // Opcional borrar:true (+aplicar:true) para quitarlas. PREVIEW por defecto.
      var _rsf=_recLeer_(_rss, 'registro', null, body.limite||200, true);
      if(!_rsf.ok) return respuesta({ ok:false, error:_rsf.error, code:400 });
      if(body.borrar===true){
        var _apsf=body.aplicar===true, _rowsSf=_rsf.filas.map(function(f){return f._fila;}).sort(function(a,b){return b-a;});
        if(_apsf){ for(var _zsf=0;_zsf<_rowsSf.length;_zsf++) _rsh.deleteRow(_rowsSf[_zsf]); }
        _claudeBitacora_(ss,'claudeRecepcion','sinFecha borrar aplicar='+_apsf+' n='+_rowsSf.length);
        return respuesta({ ok:true, sub:'sinFecha', modo:'borrar', aplicado:_apsf, aBorrar:_rowsSf.length, filas:_rsf.filas });
      }
      return respuesta({ ok:true, sub:'sinFecha', total:_rsf.total, filas:_rsf.filas });
    }
    if(_sub==='editarFila'){
      // Edita celdas por NOMBRE de columna en las filas que cumplen TODOS los match. Rechaza columnas de fórmula.
      // body:{ hoja?, match:{columna:valor,...}, set:{columna:valor,...}, aplicar? }
      var _red=_recEditar_(_rss, body.hoja, body.match, body.set, body.aplicar===true);
      if(_red.ok) _claudeBitacora_(ss,'claudeRecepcion','editarFila '+(body.hoja||'')+' aplicar='+(body.aplicar===true)+' n='+_red.coincidencias);
      return respuesta(_red.ok ? Object.assign({sub:'editarFila'},_red) : { ok:false, error:_red.error, code:400, columnasBloqueadas:_red.columnasBloqueadas });
    }
    if(_sub==='agregarFila'){
      // Agrega una fila a cualquier pestaña por NOMBRE de columna (hereda formato+validaciones). Rechaza fórmula.
      // body:{ hoja, valores:{columna:valor,...}, aplicar? }
      var _rag=_recAgregar_(_rss, body.hoja, body.valores, body.aplicar===true);
      if(_rag.ok) _claudeBitacora_(ss,'claudeRecepcion','agregarFila '+(body.hoja||'')+' aplicar='+(body.aplicar===true));
      return respuesta(_rag.ok ? Object.assign({sub:'agregarFila'},_rag) : { ok:false, error:_rag.error, code:400 });
    }
    if(_sub==='nuevoPaquete'){
      // Da de alta un paquete en PAQUETES Y ABONOS (nunca toca CITAS USADAS/RESTANTES/ESTADO).
      // body:{ titular, monto, citas, desde:'YYYY-MM-DD', fechaPago?, hasta?, ajuste?, obs?, aplicar? }
      var _vp={};
      if(body.fechaPago!=null) _vp['fecha pago']=body.fechaPago;
      if(body.titular!=null)   _vp['titular']=body.titular;
      if(body.monto!=null)     _vp['monto']=body.monto;
      if(body.citas!=null)     _vp['compradas']=body.citas;
      if(body.desde!=null)     _vp['desde']=body.desde;
      if(body.hasta!=null)     _vp['hasta']=body.hasta;
      if(body.ajuste!=null)    _vp['ajuste']=body.ajuste;
      if(body.obs!=null)       _vp['obs']=body.obs;
      var _rnp=_recAgregar_(_rss, 'paquete', _vp, body.aplicar===true);
      if(_rnp.ok) _claudeBitacora_(ss,'claudeRecepcion','nuevoPaquete aplicar='+(body.aplicar===true)+' '+(body.titular||''));
      return respuesta(_rnp.ok ? Object.assign({sub:'nuevoPaquete'},_rnp) : { ok:false, error:_rnp.error, code:400 });
    }
    if(_sub==='modificarPaquete'){
      // Modifica un paquete existente por TITULAR (solo columnas editables). body:{ titular, set?|monto/citas/desde/hasta/ajuste/obs, aplicar? }
      if(!body.titular) return respuesta({ ok:false, error:'Falta titular', code:400 });
      var _M=body.set||body, _setp={};
      if(_M.monto!=null)  _setp['monto']=_M.monto;
      if(_M.citas!=null)  _setp['compradas']=_M.citas;
      if(_M.desde!=null)  _setp['desde']=_M.desde;
      if(_M.hasta!=null)  _setp['hasta']=_M.hasta;
      if(_M.ajuste!=null) _setp['ajuste']=_M.ajuste;
      if(_M.obs!=null)    _setp['obs']=_M.obs;
      if(!Object.keys(_setp).length) return respuesta({ ok:false, error:'Nada que cambiar (monto/citas/desde/hasta/ajuste/obs)', code:400 });
      var _rmp=_recEditar_(_rss, 'paquete', {titular:body.titular}, _setp, body.aplicar===true);
      if(_rmp.ok) _claudeBitacora_(ss,'claudeRecepcion','modificarPaquete aplicar='+(body.aplicar===true)+' '+body.titular);
      return respuesta(_rmp.ok ? Object.assign({sub:'modificarPaquete'},_rmp) : { ok:false, error:_rmp.error, code:400, columnasBloqueadas:_rmp.columnasBloqueadas });
    }
    if(_sub==='limpiarBasura'){
      // Limpia celdas con #REF! en REGISTRO DEL DÍA + una fórmula suelta '=X####' en OBSERVACIONES. PREVIEW por defecto.
      var _ap6=body.aplicar===true, _lr6=_rsh.getLastRow(), _lc6=_rsh.getLastColumn();
      if(_lr6<1||_lc6<1) return respuesta({ ok:true, sub:'limpiarBasura', aplicado:_ap6, aLimpiar:0, ejemplos:[] });
      var _rng6=_rsh.getRange(1,1,_lr6,_lc6), _vv6=_rng6.getValues(), _ff6=_rng6.getFormulas();
      var _H6=_recHeader_(_rsh), _cObs6=_H6?_recCol_(_H6.headN,'observ'):-1, _lim6=[], _ej6=[];
      for(var _a6=0;_a6<_vv6.length;_a6++){
        for(var _b6=0;_b6<_vv6[_a6].length;_b6++){
          var _val6=String(_vv6[_a6][_b6]==null?'':_vv6[_a6][_b6]), _frm6=String(_ff6[_a6][_b6]||'');
          var _esRef6=_val6.indexOf('#REF!')!==-1 || _frm6.indexOf('#REF!')!==-1;
          var _esSuelta6=(_cObs6>=0 && _b6===_cObs6 && /^=\s*[A-Z]+\d+\s*$/.test(_frm6));
          if(_esRef6||_esSuelta6){ _lim6.push([_a6+1,_b6+1]); if(_ej6.length<25) _ej6.push('R'+(_a6+1)+'C'+(_b6+1)+' '+(_frm6||_val6)); }
        }
      }
      if(_ap6){ for(var _c6=0;_c6<_lim6.length;_c6++){ _rsh.getRange(_lim6[_c6][0],_lim6[_c6][1]).clearContent(); } }
      _claudeBitacora_(ss,'claudeRecepcion','limpiarBasura aplicar='+_ap6+' celdas='+_lim6.length);
      return respuesta({ ok:true, sub:'limpiarBasura', aplicado:_ap6, aLimpiar:_lim6.length, ejemplos:_ej6 });
    }
    if(_sub==='arreglarResumen'){
      // Extiende los rangos de las fórmulas de RESUMEN DEL DÍA que se quedaron CORTOS (p.ej.
      // $A$4:$A$4342) para que cubran las filas nuevas — la hoja creció y las citas recientes
      // caían FUERA del rango → el resumen salía en 0. SOLO cambia el número de fila FINAL de los
      // rangos que apuntan a REGISTRO DEL DÍA / VENTAS DE PRODUCTO; NO toca la lógica ni los valores.
      // Escribe celda por celda (solo las fórmulas que cambian). PREVIEW por defecto; aplicar:true escribe.
      var _apR = body.aplicar===true;
      var _shR = _rss.getSheetByName('RESUMEN DEL DÍA') || _rss.getSheetByName('RESUMEN DEL DIA');
      if(!_shR) return respuesta({ ok:false, error:'No encontré RESUMEN DEL DÍA', code:500 });
      var _lrR=_shR.getLastRow(), _lcR=_shR.getLastColumn();
      if(_lrR<1||_lcR<1) return respuesta({ ok:true, sub:'arreglarResumen', aplicado:_apR, celdas:0, ejemplos:[] });
      var _fmlR=_shR.getRange(1,1,_lrR,_lcR).getFormulas(), _cambR=[];
      var _reReg=/('REGISTRO DEL D[ÍI]A'!\$[A-Z]{1,3}\$\d+:\$[A-Z]{1,3}\$)(\d+)/g;
      var _reVen=/('VENTAS DE PRODUCTO'!\$[A-Z]{1,3}\$\d+:\$[A-Z]{1,3}\$)(\d+)/g;
      // Tolerancia de fecha: el criterio exacto (..$A..,$B$4) falla si la fecha trae HORA (el
      // auto-llenado guarda mediodía) → se cambia a rango por DÍA: (..$A..,">="&$B$4, ..$A..,"<"&($B$4+1)).
      // Idempotente (no re-duplica porque ya no hay ",$B$4" crudo tras el cambio).
      var _reFec=/('(?:REGISTRO DEL D[ÍI]A|VENTAS DE PRODUCTO)'!\$A\$\d+:\$A\$\d+),\$B\$4(?!\+)/g;
      for(var _iR=0;_iR<_fmlR.length;_iR++){
        for(var _jR=0;_jR<_fmlR[_iR].length;_jR++){
          var _fR=_fmlR[_iR][_jR]; if(!_fR || String(_fR).charAt(0)!=='=') continue;
          var _nfR=_fR.replace(_reReg,function(m,p1,n){ return (+n<50000)?(p1+'50000'):m; })
                      .replace(_reVen,function(m,p1,n){ return (+n<20000)?(p1+'20000'):m; })
                      .replace(_reFec,function(m,p1){ return p1+',">="&$B$4,'+p1+',"<"&($B$4+1)'; });
          if(_nfR!==_fR){ _cambR.push({fila:_iR+1, col:_jR+1, de:_fR, a:_nfR}); if(_apR) _shR.getRange(_iR+1,_jR+1).setFormula(_nfR); }
        }
      }
      _claudeBitacora_(ss,'claudeRecepcion','arreglarResumen aplicar='+_apR+' celdas='+_cambR.length);
      return respuesta({ ok:true, sub:'arreglarResumen', aplicado:_apR, celdas:_cambR.length,
        ejemplos:_cambR.slice(0,12).map(function(c){ return { celda:'R'+c.fila+'C'+c.col, de:String(c.de).slice(0,80), a:String(c.a).slice(0,80) }; }) });
    }
    return respuesta({ ok:false, error:'claudeRecepcion sub no reconocido: '+_sub, code:400 });
  }

  return respuesta({ ok: false, error: 'Acción claude no reconocida: ' + action, code: 400 });
}

// ════════ AUTO-CITAS: calendario → hoja de RECEPCIÓN (REGISTRO DEL DÍA) ════════
// Reusa parsearTituloAgenda_ de este mismo archivo. Idempotente: no duplica (mismo día + mismo paciente).
// NO escribe terapeuta (la inicial del calendario puede cambiar y metería ruido) ni toca paquetes.
// CRUCE DE NOMBRE COMPLETO: resuelve el nombre del calendario al del expediente (activos+migrados) SOLO si
// hay coincidencia ÚNICA (exacta o subset-única ≥2 tokens); si hay duda, deja el del calendario (nunca adivina).
// CONFIG: pon abajo el ID de la hoja de recepción (debe ser Google Sheet, no .xlsx).
// INSTALAR: Guardar → correr autoCitasRecepcion una vez (prueba) → correr instalarAutoCitas una vez.
var RECEPCION_SHEET_ID = '1WSji4eBJ9mQMRTCCX2Yg8LFhkwa6UlJXx0OFRR1NaNQ';   // PAGOS 26 OCT 2026 (Google Sheet de recepción, producción).
var RECEPCION_DIAS     = 1;   // 1 = solo hoy. 2 = hoy y mañana.
var _BLOQUE_RE_REC = /(^|\s)(clase|no viene|no vino|no esta|no está|bloque|junta|comida|vacacion|falta|cumple|evento|curso|taller|cerrado|festivo|reunion|descanso|puente|en espera|solo )/i;

function _normRec_(s){ return String(s==null?'':s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim(); }
function _diaKeyRec_(v){
  if(v instanceof Date) return Utilities.formatDate(v,'America/Mexico_City','yyyyMMdd');
  var s=String(v==null?'':v).trim(), m=s.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if(m){ var y=m[3]; if(y.length<4) y='20'+y; return y+('0'+m[2]).slice(-2)+('0'+m[1]).slice(-2); }
  m=s.match(/(\d{4})-(\d{2})-(\d{2})/); if(m) return m[1]+m[2]+m[3];
  return s;
}

// ── CRUCE DE NOMBRE COMPLETO (conservador: solo coincidencia ÚNICA) ──
// Construye el índice de nombres de TODOS los expedientes: activos del Sheet + migrados de Firestore.
// Devuelve {byExact:{normCompleto:[full,...]}, list:[{full,tok:{token:true}}]} o null si no se pudo.
// NUNCA tira: si Firestore falla, usa solo activos; si todo falla, devuelve null (y el auto-llenado deja el nombre del calendario).
function _recepcionIndexNombres_(ss){
  var list=[], byExact={};
  function _add(full){
    full=String(full==null?'':full).trim(); if(!full) return;
    var norm=_normRec_(full); if(!norm) return;
    if(/\b(test|prueba|papelera|qa)\b/.test(norm)) return;   // salta nombres de prueba/papelera
    var toks=norm.split(' ').filter(function(t){return t.length>=2;}); if(!toks.length) return;
    var tm={}; for(var i=0;i<toks.length;i++) tm[toks[i]]=true;
    list.push({full:full, tok:tm});
    (byExact[norm]=byExact[norm]||[]).push(full);
  }
  // ACTIVOS (Sheet)
  try{
    var acts=leerPacientes(ss);
    for(var a=0;a<acts.length;a++){
      var p=acts[a]; if(!p) continue;
      if(String(p.id||'').indexOf('mig_pac_')===0) continue;
      if(p._activoEliminado===true || p.eliminado===true) continue;
      _add(p.name);
    }
  }catch(eA){}
  // MIGRADOS (Firestore pacientes) — solo campos de nombre (mask) para que sea liviano
  try{
    var tok=_claudeFsToken_();
    if(tok){
      var PROJ=PropertiesService.getScriptProperties().getProperty('FIRESTORE_PROJECT_ID')||'clinicasinergia-ec2cf';
      var base='https://firestore.googleapis.com/v1/projects/'+PROJ+'/databases/(default)/documents/pacientes?pageSize=300'
        +'&mask.fieldPaths=name&mask.fieldPaths=eliminado';
      var pageToken='', paginas=0;
      do{
        var url=base+(pageToken?'&pageToken='+encodeURIComponent(pageToken):'');
        var r=UrlFetchApp.fetch(url,{method:'get',headers:{Authorization:'Bearer '+tok},muteHttpExceptions:true});
        if(r.getResponseCode()!==200) break;
        var j=JSON.parse(r.getContentText()||'{}');
        (j.documents||[]).forEach(function(doc){ var f=_fsDecodeFields_(doc.fields||{}); if(f.eliminado===true) return; _add(f.name); });
        pageToken=j.nextPageToken||''; paginas++;
      } while(pageToken && paginas<30);
    }
  }catch(eM){}
  if(!list.length) return null;
  return {byExact:byExact, list:list};
}

// Resuelve el nombre del calendario al nombre COMPLETO del expediente SOLO si hay coincidencia ÚNICA.
// Duda (0 o >1 coincidencias) → devuelve el nombre del calendario sin cambios (NUNCA adivina).
function _recepcionResolverNombre_(calNombre, idx){
  if(!idx) return calNombre;
  var norm=_normRec_(calNombre); if(!norm) return calNombre;
  // COLAPSA por NOMBRE: un mismo paciente vive en varios docs (activo p… + espejo app_live_ + migrado
  // mig_pac_). Esos NO son homónimos: son el MISMO nombre repetido. Contar DOCS los trataba como
  // ambiguos y dejaba el nombre corto; se cuenta NOMBRES DISTINTOS (normalizados) para no confundir
  // "repetido-mismo-nombre" (→ sí completa) con "homónimo real-nombres distintos" (→ no adivina).
  var ex=idx.byExact[norm];
  if(ex && ex.length){
    var exSeen={}, exUno=null, exN=0;
    for(var e=0;e<ex.length;e++){ var ek=_normRec_(ex[e]); if(!exSeen[ek]){ exSeen[ek]=1; exUno=ex[e]; exN++; if(exN>1) break; } }
    if(exN===1) return exUno;                  // 1) exacto único (colapsa espejos del mismo nombre)
    return calNombre;                          //    homónimo exacto REAL → no adivinar
  }
  var calToks=norm.split(' ').filter(function(t){return t.length>=2;});
  if(calToks.length<2) return calNombre;       // 2) subset: 1 solo token (nombre de pila) = demasiado ambiguo
  var hitFull=null, seen={}, n=0, L=idx.list;
  for(var i=0;i<L.length;i++){
    var tm=L[i].tok, ok=true;
    for(var k=0;k<calToks.length;k++){ if(!tm[calToks[k]]){ ok=false; break; } }
    if(ok){ var nk=_normRec_(L[i].full); if(!seen[nk]){ seen[nk]=1; n++; hitFull=L[i].full; if(n>1) break; } }
  }
  if(n===1 && hitFull) return hitFull;         // subset único POR NOMBRE → nombre completo
  return calNombre;
}

// ════════ COMANDO UNIFICADO DE RECEPCIÓN: helpers genéricos (leer/editar/agregar) ════════
// Un mismo núcleo para manipular CUALQUIER pestaña del Google Sheet de recepción por NOMBRE de columna,
// con CANDADO DURO sobre las columnas calculadas (fórmula) para no romper los conteos/estados/saldos.
// Columnas calculadas por pestaña (match por subcadena del encabezado normalizado); '*' = toda la hoja:
var _REC_COMPUT = {
  'resumen del dia'   : ['*'],                             // cierre de turno = 100% fórmula
  'registro del dia'  : ['observ','saldo'],                // OBSERVACIONES + SALDO RESTANTE
  'paquetes y abonos' : ['citas usada','restante','estado'],// CITAS USADAS, CITAS RESTANTES, ESTADO
  'inventario'        : ['salida','stock','alerta']         // SALIDAS, STOCK, ALERTA
};
function _recEsComputada_(hojaNorm, colNorm){
  var keys=Object.keys(_REC_COMPUT);
  for(var i=0;i<keys.length;i++){
    if(hojaNorm.indexOf(keys[i])!==-1){
      var subs=_REC_COMPUT[keys[i]];
      for(var j=0;j<subs.length;j++){ if(subs[j]==='*') return true; if(colNorm.indexOf(subs[j])!==-1) return true; }
    }
  }
  return false;
}
// Resuelve una pestaña por subcadena de su nombre (sin acentos). Vacío = REGISTRO DEL DÍA.
function _recHojaPorNombre_(rss, sub){
  var want=_normRec_(sub||''), all=rss.getSheets();
  if(!want){ return rss.getSheetByName('REGISTRO DEL DÍA')||rss.getSheetByName('REGISTRO DEL DIA')||all[0]; }
  for(var i=0;i<all.length;i++){ if(_normRec_(all[i].getName()).indexOf(want)!==-1) return all[i]; }
  return null;
}
// Encuentra la fila de encabezado (busca paciente/titular/producto + ≥2 celdas de texto).
function _recHeader_(sh){
  var dv=sh.getDataRange().getValues(), hr=-1, max=Math.min(dv.length,15);
  for(var r=0;r<max;r++){
    var row=dv[r].map(_normRec_), txt=row.join(' '), llenas=row.filter(function(x){return x;}).length;
    if(/(paciente|titular|producto|insumo|concepto)/.test(txt) && llenas>=2){ hr=r; break; }
  }
  if(hr<0){ for(var r2=0;r2<max;r2++){ if(dv[r2].map(_normRec_).filter(function(x){return x;}).length>=2){ hr=r2; break; } } }
  if(hr<0) return null;
  return { dv:dv, hr:hr, headN:dv[hr].map(_normRec_), headRaw:dv[hr].map(function(x){return String(x==null?'':x).trim();}) };
}
function _recCol_(headN, sub){ var s=_normRec_(sub); for(var i=0;i<headN.length;i++){ if(headN[i].indexOf(s)!==-1) return i; } return -1; }
function _recFmtVal_(v){ return (v instanceof Date) ? Utilities.formatDate(v,'America/Mexico_City','d/M/yyyy') : v; }
// clave de día ISO-first (evita el mal-parseo de _diaKeyRec_ con 'YYYY-MM-DD').
function _recDiaKey_(v){ if(v instanceof Date) return Utilities.formatDate(v,'America/Mexico_City','yyyyMMdd'); var m=String(v==null?'':v).match(/^(\d{4})-(\d{2})-(\d{2})/); if(m) return m[1]+m[2]+m[3]; return _diaKeyRec_(v); }
function _recTok_(s){ return _normRec_(s).split(' ').filter(function(t){return t.length>1;}); }
function _recSubset_(a,b){ if(!a.length) return false; for(var i=0;i<a.length;i++){ if(b.indexOf(a[i])===-1) return false; } return true; }

// LEER: objetos por encabezado + filtro (subcadena; la columna fecha compara por día). soloSinFecha = filas con FECHA vacía/ inválida.
function _recLeer_(rss, hojaSub, filtro, limite, soloSinFecha){
  var sh=_recHojaPorNombre_(rss, hojaSub); if(!sh) return { ok:false, error:'No encontré la pestaña: '+hojaSub };
  var H=_recHeader_(sh); if(!H) return { ok:false, error:'No encontré el encabezado de '+sh.getName() };
  var lim=limite>0?limite:300, cFecha=_recCol_(H.headN,'fecha');
  var fil=[]; if(filtro){ for(var k in filtro){ if(filtro.hasOwnProperty(k)){ var ci=_recCol_(H.headN,k); if(ci>=0) fil.push([ci,_normRec_(filtro[k]),H.headN[ci].indexOf('fecha')!==-1,filtro[k]]); } } }
  var out=[], total=0;
  for(var r=H.hr+1;r<H.dv.length;r++){
    var row=H.dv[r], vacia=true;
    for(var c=0;c<row.length;c++){ if(String(row[c]==null?'':row[c]).trim()!==''){ vacia=false; break; } }
    if(vacia) continue;
    if(soloSinFecha){ var fv=cFecha>=0?row[cFecha]:''; if(!(fv===''||fv==null||!/^\d{8}$/.test(_recDiaKey_(fv)))) continue; }
    var okF=true;
    for(var f=0;f<fil.length;f++){ var cell=row[fil[f][0]]; if(fil[f][2]){ if(_recDiaKey_(cell)!==_recDiaKey_(fil[f][3])){ okF=false; break; } } else if(_normRec_(cell).indexOf(fil[f][1])===-1){ okF=false; break; } }
    if(!okF) continue;
    total++;
    if(out.length<lim){ var o={ _fila:r+1 }; for(var cc=0;cc<H.headRaw.length;cc++){ var key=H.headRaw[cc]||('col'+(cc+1)); o[key]=_recFmtVal_(row[cc]); } out.push(o); }
  }
  return { ok:true, hoja:sh.getName(), encabezados:H.headRaw, total:total, mostradas:out.length, filas:out };
}
// EDITAR: busca filas que cumplen TODOS los match (fecha por día; texto por igualdad o subset de tokens) y escribe set.
// Rechaza columnas calculadas. PREVIEW si !aplicar.
function _recEditar_(rss, hojaSub, match, set, aplicar){
  var sh=_recHojaPorNombre_(rss, hojaSub); if(!sh) return { ok:false, error:'No encontré la pestaña: '+hojaSub };
  var hojaN=_normRec_(sh.getName());
  var H=_recHeader_(sh); if(!H) return { ok:false, error:'No encontré el encabezado de '+sh.getName() };
  if(!match || !Object.keys(match).length) return { ok:false, error:'Falta match:{columna:valor}' };
  if(!set || !Object.keys(set).length) return { ok:false, error:'Falta set:{columna:valor}' };
  var setCols=[], bloq=[];
  for(var k in set){ if(!set.hasOwnProperty(k)) continue; var ci=_recCol_(H.headN,k); if(ci<0) return { ok:false, error:'No existe la columna "'+k+'" en '+sh.getName() }; if(_recEsComputada_(hojaN,H.headN[ci])) bloq.push(H.headRaw[ci]); else setCols.push([ci,k]); }
  if(bloq.length) return { ok:false, error:'Esas columnas son CALCULADAS (fórmula), no se pueden editar: '+bloq.join(', '), columnasBloqueadas:bloq };
  var matchCols=[]; for(var mk in match){ if(!match.hasOwnProperty(mk)) continue; var mi=_recCol_(H.headN,mk); if(mi<0) return { ok:false, error:'No existe la columna de match "'+mk+'"' }; matchCols.push([mi,match[mk],H.headN[mi]]); }
  var hits=[];
  for(var r=H.hr+1;r<H.dv.length;r++){
    var row=H.dv[r], ok=true;
    for(var m=0;m<matchCols.length;m++){
      var ci2=matchCols[m][0], want=matchCols[m][1], colN=matchCols[m][2], cell=row[ci2];
      if(colN.indexOf('fecha')!==-1){ if(_recDiaKey_(cell)!==_recDiaKey_(want)){ ok=false; break; } }
      else { var cn=_normRec_(cell), wn=_normRec_(want); if(cn!==wn){ if(!(_recSubset_(_recTok_(want),_recTok_(cell))||_recSubset_(_recTok_(cell),_recTok_(want)))){ ok=false; break; } } }
    }
    if(ok) hits.push(r);
  }
  var cambios=[];
  for(var h=0;h<hits.length;h++){ var rr=hits[h]; for(var s=0;s<setCols.length;s++){ var sc=setCols[s][0]; cambios.push({ fila:rr+1, columna:H.headRaw[sc], de:_recFmtVal_(H.dv[rr][sc]), a:set[setCols[s][1]] }); } }
  if(aplicar){
    for(var h2=0;h2<hits.length;h2++){ var rr2=hits[h2]; for(var s2=0;s2<setCols.length;s2++){ var sc2=setCols[s2][0], val2=set[setCols[s2][1]];
        if(H.headN[sc2].indexOf('fecha')!==-1){ var pm=String(val2).match(/^(\d{4})-(\d{2})-(\d{2})/); if(pm){ sh.getRange(rr2+1,sc2+1).setValue(new Date(+pm[1],+pm[2]-1,+pm[3],12,0,0)).setNumberFormat('d/m/yyyy'); continue; } }
        sh.getRange(rr2+1,sc2+1).setValue(val2);
    } }
  }
  return { ok:true, hoja:sh.getName(), aplicado:!!aplicar, coincidencias:hits.length, cambios:cambios };
}
// AGREGAR: una fila nueva por nombre de columna, heredando formato + validaciones de la 1a fila de datos. Rechaza columnas calculadas.
function _recAgregar_(rss, hojaSub, valores, aplicar){
  var sh=_recHojaPorNombre_(rss, hojaSub); if(!sh) return { ok:false, error:'No encontré la pestaña: '+hojaSub };
  var hojaN=_normRec_(sh.getName());
  var H=_recHeader_(sh); if(!H) return { ok:false, error:'No encontré el encabezado de '+sh.getName() };
  if(!valores || !Object.keys(valores).length) return { ok:false, error:'Falta valores:{columna:valor}' };
  var ancho=sh.getLastColumn(), fila=[], bloq=[];
  for(var c=0;c<ancho;c++) fila[c]='';
  for(var k in valores){ if(!valores.hasOwnProperty(k)) continue; var ci=_recCol_(H.headN,k); if(ci<0) return { ok:false, error:'No existe la columna "'+k+'"' }; if(_recEsComputada_(hojaN,H.headN[ci])){ bloq.push(H.headRaw[ci]); continue; } var val=valores[k]; if(H.headN[ci].indexOf('fecha')!==-1){ var pm=String(val).match(/^(\d{4})-(\d{2})-(\d{2})/); if(pm) val=new Date(+pm[1],+pm[2]-1,+pm[3],12,0,0); } fila[ci]=val; }
  if(bloq.length) return { ok:false, error:'Esas columnas son CALCULADAS (fórmula), no se pueden escribir: '+bloq.join(', ') };
  var preview={}; for(var c2=0;c2<ancho;c2++){ if(String(fila[c2]).trim()!=='') preview[H.headRaw[c2]||('col'+(c2+1))]=_recFmtVal_(fila[c2]); }
  if(aplicar){
    var ini=sh.getLastRow()+1, dest=sh.getRange(ini,1,1,ancho); dest.setValues([fila]);
    var mf=H.hr+2; if(mf<ini){ var mod=sh.getRange(mf,1,1,ancho); mod.copyTo(dest,{formatOnly:true}); try{ dest.setDataValidations([mod.getDataValidations()[0]]); }catch(_e){} }
    for(var cf=0;cf<H.headN.length;cf++){ if(H.headN[cf].indexOf('fecha')!==-1) sh.getRange(ini,cf+1).setNumberFormat('d/m/yyyy'); }
    return { ok:true, hoja:sh.getName(), aplicado:true, fila:ini, valores:preview };
  }
  return { ok:true, hoja:sh.getName(), aplicado:false, valores:preview };
}

function autoCitasRecepcion(diasAdelante){
  var dias = diasAdelante || RECEPCION_DIAS;
  var ss = SpreadsheetApp.openById(RECEPCION_SHEET_ID);
  var sh = ss.getSheetByName('REGISTRO DEL DÍA') || ss.getSheetByName('REGISTRO DEL DIA');
  if(!sh){ var _todas=ss.getSheets(); if(_todas.length===1) sh=_todas[0]; }   // solo cae a la 1a pestaña si la hoja tiene UNA (prueba); nunca escribe en otra pestaña de recepción
  if(!sh){ Logger.log('No encontré la pestaña REGISTRO DEL DÍA'); return 0; }
  var datos = sh.getDataRange().getValues(), hdr=-1;
  for(var r=0;r<Math.min(datos.length,12);r++){
    var row=datos[r].map(_normRec_);
    if(row.indexOf('paciente')!==-1 && row.some(function(x){return x.indexOf('asisti')!==-1;})){ hdr=r; break; }
  }
  if(hdr<0){ Logger.log('No encontré el encabezado'); return 0; }
  var head=datos[hdr].map(_normRec_);
  function _colRec_(k){ for(var i=0;i<head.length;i++){ if(head[i].indexOf(k)!==-1) return i; } return -1; }
  var cF=_colRec_('fecha'), cP=_colRec_('paciente'), cS=_colRec_('servicio');
  if(cF<0||cP<0){ Logger.log('Faltan columnas fecha/paciente'); return 0; }
  var existe={}, existeMap={};
  for(var r2=hdr+1;r2<datos.length;r2++){ var p=datos[r2][cP]; if(p){ var _kk=_diaKeyRec_(datos[r2][cF])+'|'+_normRec_(p); existe[_kk]=true; existeMap[_kk]={row:r2+1, name:String(p)}; } }
  var cal = CalendarApp.getDefaultCalendar();
  if(!cal){ Logger.log('No se pudo abrir el calendario'); return 0; }
  var idxNom=null; try{ idxNom=_recepcionIndexNombres_(ss); }catch(eIdx){ idxNom=null; }   // índice de nombres (nunca rompe)
  var ancho=sh.getLastColumn(), hoy=new Date(); hoy.setHours(0,0,0,0);
  var nuevas=[], up=0, _ups=[];
  for(var d=0; d<dias; d++){
    var ini=new Date(hoy.getTime()+d*86400000), fin=new Date(ini.getTime()+86400000);
    var evs=cal.getEvents(ini,fin);
    for(var e=0;e<evs.length;e++){
      if(evs[e].isAllDayEvent()) continue;
      var titulo=evs[e].getTitle();
      if(!titulo || _BLOQUE_RE_REC.test(titulo)) continue;
      var pr=parsearTituloAgenda_(titulo);
      if(pr.omitir) continue;
      var nombreCal=String(pr.paciente||'').trim();
      if(!nombreCal || nombreCal==='(sin nombre)') continue;
      // CRUCE DE NOMBRE COMPLETO: solo coincidencia única; si hay duda, deja el del calendario
      var nombre=nombreCal;
      try{ nombre=_recepcionResolverNombre_(nombreCal, idxNom)||nombreCal; }catch(eRes){ nombre=nombreCal; }
      if(_normRec_(nombre)!==_normRec_(nombreCal)) up++;
      // dedup bajo el nombre final Y el del calendario (no duplica una cita ya puesta con nombre corto)
      var diaK=_diaKeyRec_(ini), keyFin=diaK+'|'+_normRec_(nombre), keyCal=diaK+'|'+_normRec_(nombreCal);
      if(existe[keyFin]||existe[keyCal]){
        // Ya existe la cita. Si el expediente resuelve a un nombre MÁS COMPLETO del MISMO paciente
        // (los tokens del corto son subconjunto del completo y hay más tokens) → actualiza esa celda
        // en su lugar (nunca cambia de persona). Así renombrar a nombre completo se refleja en la hoja.
        var _ex=existeMap[keyCal]||existeMap[keyFin];
        if(_ex && _normRec_(nombre)!==_normRec_(_ex.name)){
          var _exTok=_recTok_(_ex.name), _fullTok=_recTok_(nombre);
          if(_recSubset_(_exTok,_fullTok) && _fullTok.length>_exTok.length){ _ups.push({row:_ex.row, name:nombre}); _ex.name=nombre; }
        }
        continue;
      }
      existe[keyFin]=true; existe[keyCal]=true;
      existeMap[keyFin]={row:-1, name:nombre}; existeMap[keyCal]={row:-1, name:nombre};
      var fila=[]; for(var c=0;c<ancho;c++){ fila[c]=''; }
      fila[cF]=new Date(ini.getFullYear(),ini.getMonth(),ini.getDate(),12,0,0);  // mediodía: evita que la zona horaria corra el día
      fila[cP]=nombre;
      if(cS>=0) fila[cS]='FISIOTERAPIA';
      nuevas.push(fila);
    }
  }
  if(nuevas.length){
    var _inicio = sh.getLastRow()+1;
    var _dest = sh.getRange(_inicio,1,nuevas.length,ancho);
    _dest.setValues(nuevas);
    // RESPETAR EL FORMATO: copiar estilo (bordes/colores/formato de fecha) + menús desplegables
    // de la 1a fila de datos (plantilla) a las filas nuevas. No pisa los valores recién escritos.
    var _mfila = hdr+2;
    if(_mfila < _inicio){
      var _modelo = sh.getRange(_mfila,1,1,ancho);
      _modelo.copyTo(_dest, {formatOnly:true});
      try{ var _dv=_modelo.getDataValidations()[0], _dvAll=[]; for(var _q=0;_q<nuevas.length;_q++){ _dvAll.push(_dv.slice()); } _dest.setDataValidations(_dvAll); }catch(_e){}
    }
    // FECHA SIEMPRE día/mes/año (d/m/aaaa), sin importar el locale de la hoja — y sigue siendo fecha real
    try{ sh.getRange(_inicio, cF+1, nuevas.length, 1).setNumberFormat('d/m/yyyy'); }catch(_e2){}
  }
  // Auto-upgrade de nombre corto → completo en filas YA existentes del día (mismo paciente, subset).
  var _nUp=0;
  for(var _u=0;_u<_ups.length;_u++){ if(_ups[_u].row>0){ try{ sh.getRange(_ups[_u].row, cP+1).setValue(_ups[_u].name); _nUp++; }catch(_eu){} } }
  Logger.log('Auto-citas: agregadas '+nuevas.length+' cita(s) ('+up+' con nombre completo del expediente); '+_nUp+' fila(s) actualizadas a nombre completo.');
  return nuevas.length;
}

function instalarAutoCitas(){
  ScriptApp.getProjectTriggers().forEach(function(t){ if(t.getHandlerFunction()==='autoCitasRecepcion') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('autoCitasRecepcion').timeBased().everyHours(1).create();
  Logger.log('✅ Auto-citas instalado (corre cada hora). Para apagarlo: borra el disparador en Activadores.');
}