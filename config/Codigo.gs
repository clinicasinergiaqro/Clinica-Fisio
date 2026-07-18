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
  'agoretti.mr@gmail.com': 'fisioterapeuta',            // Gore
  'dafnend26@gmail.com': 'fisioterapeuta',              // Daf
  'jriveare2000@hotmail.com': 'fisioterapeuta'          // Jess
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
  'revalSolicitada'
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
    'altaClinica','revaloraciones','eventosAdversos','revalSolicitada'];
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
              .filter(ej => (ej.estado || 'activo') === 'activo')
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
                .filter(ej => ej && (ej.estado || 'activo') === 'activo')
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
    const auth = validarRequestPrivado(body);
    if (!auth.ok) {
      return respuesta({ok:false, error: auth.error, code: 401});
    }
    const ss = SpreadsheetApp.openById(SHEET_ID);
    if (body.action === 'getPacientes') {
      return respuesta(leerPacientes(ss));
    }
    if (body.action === 'savePacientes') {
      var lock = LockService.getScriptLock();
      try {
        lock.waitLock(10000);
      } catch(eLock) {
        return respuesta({ok:false, error:'LOCK_TIMEOUT', msg:'El sistema está ocupado. Tus cambios se conservarán localmente.'});
      }
      try {
        return respuesta(guardarPacientesConMerge_(ss, body.data || body.datos || [], {email: auth.email, userAgent: body.userAgent}));
      } catch(eMergeGlobal) {
        var msgE = String(eMergeGlobal.message || '');
        if (msgE.indexOf('MERGE_ERROR') >= 0) {
          return respuesta({ok:false, error:'MERGE_ERROR', msg:'No se pudo completar el merge seguro. Tus cambios se conservarán localmente.'});
        }
        return respuesta({ok:false, error:'SAVE_ERROR', msg: msgE || 'Error al guardar pacientes'});
      } finally {
        try { lock.releaseLock(); } catch(eRel) {}
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
      var idBorrar = String(body.id || '').trim();
      if (!idBorrar) {
        return respuesta({ok:false, error:'Falta body.id', code:400});
      }
      // mig_pac_ nunca viven en el Sheet — guard para no tocar nada por error
      if (idBorrar.indexOf('mig_pac_') === 0) {
        return respuesta({ok:false, error:'mig_pac_ no vive en el Sheet', code:400});
      }
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
    }
    if (body.action === 'deleteTestQA') {
      return eliminarPorPrefijo(ss, 'TEST QA');
    }
    if (body.action === 'deleteTestQATerapeutas') {
      return eliminarPorPrefijo(ss, 'TEST_QA_');
    }
    if (body.action === 'testPost') {
      const chars = (e.postData && e.postData.contents) ? e.postData.contents.length : 0;
      return respuesta({ok:true, recibido:true, chars: chars});
    }
    if (body.action === 'leerAgenda') {
      return respuesta(leerAgenda(body.rango || 'dia', body.desde, body.hasta));
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
    model: 'claude-sonnet-4-6',
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

  var userContent = esPDF
    ? [{ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } },
       { type: 'text', text: 'Paciente: ' + nombrePaciente + '. Analiza este documento.' }]
    : [{ type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
       { type: 'text', text: 'Paciente: ' + nombrePaciente + '. Analiza este documento.' }];

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
    'Paciente: ' + (p.nombre || '') + ', ' + (p.edad || '') + ' años.\n' +
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
  return {
    soap: JSON.stringify(chunk1),
    soap2: JSON.stringify(chunk2),
    soap3: JSON.stringify(chunk3)
  };
}

function mergePacienteSeguro_(actual, entrante) {
  actual = actual || {};
  entrante = entrante || {};

  var entranteMasNuevo = esEntranteMasNuevo_(actual, entrante);
  var base = entranteMasNuevo
    ? JSON.parse(JSON.stringify(Object.assign({}, actual, entrante)))
    : JSON.parse(JSON.stringify(Object.assign({}, entrante, actual)));

  var soapActual = ensamblarSoap_(actual);
  var soapEntrante = ensamblarSoap_(entrante);
  var soapMerge = mergeArraysPorId_(soapActual, soapEntrante, 'id');
  var chunks = repartirSoap_(soapMerge);
  base.soap = chunks.soap;
  base.soap2 = chunks.soap2;
  base.soap3 = chunks.soap3;

  var arraysCriticos = ['fotos','docs','ejercicios','consentimientos','revaloraciones','eventosAdversos','motivosAnteriores'];
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
  var sheet = getOrCreateSheet(ss);
  var lastRow = sheet.getLastRow();
  var existingIds = lastRow > 1
    ? sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat()
    : [];

  var guardados = 0, huboMerge = false, mergeWarning = false, saltadosMig = [];

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
        try { guardarPacientes(ss, [pEntrante], meta); guardados++; mergeWarning = true; } catch(e2){}
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

  var resp = {ok:true, guardados:guardados};
  if (huboMerge) resp.merged = true;
  if (mergeWarning) resp.mergeWarning = 'merge parcial';
  if (saltadosMig.length) resp.saltadosMig = saltadosMig.length;
  return resp;
}

function testScript() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = getOrCreateSheet(ss);
  Logger.log('Sheet OK - filas: ' + sheet.getLastRow());
  Logger.log('Columnas: ' + HEADERS.length + ' → ' + HEADERS.join(', '));
}

// ── LOOP G — AGENDA (solo LECTURA del Google Calendar de la clínica) ──
// CRÍTICO: JD antes de J, y CM antes de C, para que el parser los detecte primero.
var AGENDA_INICIALES = [
  { ini: 'CM', terapeuta: 'Camila'  },
  { ini: 'Z',  terapeuta: 'Zara'    },
  { ini: 'D',  terapeuta: 'Dafne'   },
  { ini: 'G',  terapeuta: 'Goretti' },
  { ini: 'C',  terapeuta: 'Carlos'  },
  { ini: 'JD', terapeuta: 'Jess'    },  // JD antes de J (misma Jess, inicial larga primero)
  { ini: 'J',  terapeuta: 'Jess'    }
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
  if (terapeutas.length === 0 && !esNuevo) return { omitir: true };
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