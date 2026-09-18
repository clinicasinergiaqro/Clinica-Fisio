# Checklist de despliegue — Clínica Sinergia

> **Por qué existe:** el correo autorizado de cada fisio vive en **4 lugares** distintos.
> Si se agrega/quita a alguien y se olvida uno de los 4, se produce una **fuga** (el caso
> Jess: Firestore la autorizaba pero el Sheets desplegado no). Este documento es la **fuente
> única de la verdad**: antes de tocar permisos, actualiza los 4 y despliega cada uno.

---

## 1. Roster autorizado (fuente única)

| Nombre | Inicial | Correo | Rol |
|---|---|---|---|
| Carlos (supervisor) | CG / CARLOS | `lftaranda@gmail.com` | supervisor |
| Daf | DA / DAF | `dafnend26@gmail.com` | fisioterapeuta |
| Zara | ZA / ZARA | `gutierrezgarciazaray96@gmail.com` | fisioterapeuta |
| Camila | CA / CAMI | `camislerma26@gmail.com` | fisioterapeuta |
| Gore | GO / GORE | `agoretti.mr@gmail.com` | fisioterapeuta |
| Jess | JE / JESS | `jriveare2000@hotmail.com` | fisioterapeuta |
| Dulce | DU / DUL | `dulcesalazar_1799@hotmail.com` | fisioterapeuta |

- El **supervisor** (único que borra/administra) es SOLO `lftaranda@gmail.com`.
- Los correos van **en minúsculas**; las reglas comparan con `.lower()`, así que un correo
  con mayúsculas (p. ej. `Jriveare2000@hotmail.com`) igual entra, pero **guárdalos en minúsculas**.
- Última auditoría de consistencia: **2026-09-18 → los 4 lugares coinciden (sin desfase).**

---

## 2. Los 4 lugares donde vive cada correo

1. **Front (app)** — `index.html`, `const ROLES_POR_CORREO` (~L4330).
   - Solo UX (nombre/inicial); NO es la autoridad de permisos. Se despliega con GitHub Pages (main).
2. **Reglas de Firestore** — `config/firestore.rules`, función `isWriter()` (lista de correos) y
   `isSupervisor()` (solo `lftaranda`). **Autoridad real** de lectura/escritura de datos.
3. **Reglas de Storage** — `config/storage.rules`, misma lista de correos + supervisor.
   **Autoridad real** de fotos/estudios/archivos.
4. **Backend** — `config/Codigo.gs`, `const ROLES_BACKEND` (~L18): correo → rol. Autoriza el Apps Script.

> Los 3 backends (2, 3, 4) DEBEN tener exactamente los mismos 7 correos. El front (1) los mismos,
> más nombre/inicial.

---

## 3. Checklist para AGREGAR o QUITAR un fisio

Marca cada casilla; no deploys a medias.

- [ ] **1. Front** — editar `ROLES_POR_CORREO` en `index.html` (agregar/quitar la línea `_R(...)`
      con correo, nombre, rol e inicial). Bump de cache en `sw.js` (esquema `v1-<fecha><letra>`).
- [ ] **2. Firestore rules** — editar la lista de `isWriter()` en `config/firestore.rules`.
- [ ] **3. Storage rules** — editar la MISMA lista en `config/storage.rules`.
- [ ] **4. Backend** — editar `ROLES_BACKEND` en `config/Codigo.gs`.
- [ ] **5. Commit + merge a `main`** (los 4 archivos juntos, en el mismo PR).

### Desplegar cada backend (el repo NO los publica solo)

- [ ] **6. Firestore rules → producción:** consola Firebase → proyecto `clinicasinergia-ec2cf` →
      Firestore → Rules → pegar `config/firestore.rules` → **Publicar**.
      (Link: https://console.firebase.google.com/project/clinicasinergia-ec2cf/firestore/rules)
- [ ] **7. Storage rules → producción:** consola Firebase → Storage → Rules → pegar
      `config/storage.rules` → **Publicar**.
- [ ] **8. Backend Apps Script → producción:** editor de Apps Script → pegar `config/Codigo.gs` →
      **Implementar → Administrar implementaciones → editar (lápiz) → Nueva versión → Implementar**
      (la URL `/exec` NO cambia).
- [ ] **9. Front (app):** con el merge a `main`, GitHub Pages publica solo. En el iPad del nuevo
      fisio: cerrar/abrir la app o "🔄 Forzar actualización".

### Verificar (que no quedó desfasado)

- [ ] **10.** El fisio nuevo **inicia sesión** y ve SUS pacientes.
- [ ] **11.** Guarda un cambio y sube (no queda "pendiente" atorado).
- [ ] **12.** Sube una **foto** (prueba Storage rules).
- [ ] Si algo falla con "permiso insuficiente" → falta uno de los 4 pasos de despliegue. Revisa cuál.

---

## 4. Notas

- **Nunca** quites a `lftaranda@gmail.com` de ninguna lista (es el supervisor).
- Al quitar a un fisio, sus pacientes NO se borran; solo deja de tener acceso. Reasigna el
  `terapeuta` de sus pacientes si hace falta (Editar datos / supervisor).
- Este checklist cubre la RAÍZ de las fugas históricas. Mantenerlo al día = no más “no carga”
  por permisos desfasados.
