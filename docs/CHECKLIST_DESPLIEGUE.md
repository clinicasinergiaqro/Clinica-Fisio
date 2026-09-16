# Checklist de despliegue — Clínica Sinergia

Backend (Apps Script) y reglas (Firestore/Storage) se publican **a mano**. Un push a
GitHub NO los actualiza. Esta lista evita que se desfasen (fue la causa raíz del caso
Jess: el correo estaba bien en el código pero el backend en vivo era una versión vieja,
y las reglas de Storage no tenían `.lower()` ni a Dulce).

## LISTA MAESTRA DE CORREOS AUTORIZADOS
El mismo correo debe estar EN LOS 4 LADOS (en minúsculas). Si agregas/quitas a alguien,
actualiza los cuatro y publica cada uno:

| # | Lugar | Archivo / dónde | Cómo se activa |
|---|-------|-----------------|----------------|
| 1 | Frontend (UX) | `index.html` → `ROLES_POR_CORREO` | se despliega con Pages (push a `main`) |
| 2 | Reglas Firestore | `config/firestore.rules` → `isWriter()` (con `.lower()`) | **Publicar en consola Firebase** |
| 3 | Reglas Storage | `config/storage.rules` → `isWriter()` (con `.lower()`) | **Publicar en consola Firebase** |
| 4 | Backend Sheets | `Codigo.gs` → `ROLES_BACKEND` (lo normaliza con `.toLowerCase()`) | **Re-desplegar Apps Script** |

Correos autorizados actuales (7): lftaranda (supervisor), gutierrezgarciazaray96 (Zara),
camislerma26 (Camila), agoretti.mr (Gore), dafnend26 (Daf), jriveare2000 (Jess),
dulcesalazar_1799 (Dulce).

## CUANDO CAMBIES UN PERMISO (alta/baja de terapeuta)
1. Edita el correo en los **4 lugares** de la tabla (mismo correo, minúsculas).
2. Publica reglas **Firestore** (consola Firebase → Firestore → Reglas → Publicar).
3. Publica reglas **Storage** (consola Firebase → Storage → Reglas → Publicar).
4. Re-despliega **Apps Script** (ver abajo).
5. Push del `index.html` a `main` (Pages).
6. Verifica con la persona: que **guarde en verde** y que al reabrir **persista**.

## RE-DESPLEGAR APPS SCRIPT (backend Sheets)
1. script.google.com (cuenta clinicasinergiaqro) → proyecto de la clínica.
2. Asegúrate de que el código del editor sea el actual (ROLES_BACKEND + `.toLowerCase()`).
3. "Implementar" → "Administrar implementaciones".
4. En la implementación ACTIVA (Aplicación web, tipo web app), toca el lápiz (Editar).
5. En "Versión" elige "Nueva versión" → "Implementar".
6. REGLA DE ORO: nunca "Nueva implementación" (cambia la URL y rompe la app). La URL
   debe seguir siendo la de `APPS_SCRIPT_URL` en `index.html`.

## DEPLOY DEL FRONTEND (index.html / sw.js)
- Pages publica desde `main`. Cada deploy incluye bump de cache en `sw.js`
  (`sinergia-shell-v1-<fecha><letra>`; mismo día → siguiente letra).
- Validar sintaxis de `index.html`: extraer los `<script>` inline y validarlos con `vm.Script`
  (no `node --check`; no es .js).

## DIAGNÓSTICO RÁPIDO (si alguien reporta que "no se guarda")
En SU equipo: lupa 🔎 (arriba) → "🩺 Diagnóstico de escritura". Leer:
- `token.email` → el correo REAL de su cuenta (debe empatar con la lista maestra).
- `LECTURA de servidor` (Firestore) y `ESCRITURA en Sheets` (backend) → ✅ / ❌.
Si "ESCRITURA en Sheets ❌ NO AUTORIZADO" → falta re-desplegar el backend o el correo no empata.

## RESPALDOS (estado: completo)
- Sheets: `respaldoDiarioPacientes` (03:00) → JSON diario en Drive `Respaldos_Clinica`
  (retención 180) + copia por correo a lftaranda.
- Firestore: PITR 7 días + copias diaria/semanal 98 días.
- Storage: versionado de objetos (3 versiones / 30 días) + soft delete 7 días.
