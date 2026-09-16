# Preferencias de trabajo

## Presentación de diffs y código
- SIEMPRE entregar diffs o código en UN SOLO bloque de código continuo y copiable de corrido.
- NO fragmentar en varias partes/bloques. El usuario trabaja en iPad y no puede copiar por pedazos.
- Si un cambio toca varios puntos del archivo, mostrarlo igualmente como un único bloque continuo.

## Instrucciones / pruebas / prompts para copiar
- SIEMPRE en UN SOLO bloque de código de texto plano corrido, de principio a fin, en una sola caja copiable.
- SIN líneas separadoras horizontales (═══, ───, etc.), SIN numeración en saltos de línea que corte la selección.
- En el iPad los separadores cortan la selección y no se puede copiar completo: todo seguido en una sola caja.

## Flujo de git por loop
- GitHub Pages se publica desde `main`. Cada loop termina con MERGE A MAIN (PR + squash merge) para llegar a producción.
- Tras cada merge a main, RECREAR la rama de trabajo desde main para evitar conflictos en el siguiente loop:
  `git fetch origin main` → `git reset --hard origin/main` → `git push --force origin <rama>`.
  (Equivale a checkout main + pull + rama nueva; deja la rama designada idéntica a main, sin divergencia.)
- Cada deploy incluye bump de la versión de cache en `sw.js` para forzar refresh del service worker. Esquema: `sinergia-shell-v1-<fecha del deploy><letra>` (ej. `v1-2026-07-19a`); mismo día → siguiente letra, día nuevo → fecha del día y letra reinicia en `a`. El prefijo `sinergia-shell-` NO se cambia (el auto-update lo usa: `SW_CACHE_PREFIX` en index.html).
- Verificación de sintaxis: `index.html` no se valida con `node --check` directo (no es .js); extraer los bloques `<script>` inline y validarlos con `vm.Script`.

# Trabajo pendiente

## PRIORIDAD — Migrar pacientes ACTIVOS a Firestore (agendado: fin de semana)
Motivo: hoy el expediente vive partido en dos backends (Sheets = historia de activos; Firestore = SOAP/históricos/live), cada uno con su propia lista de permisos desplegada a mano. Ese diseño es la RAÍZ de las fugas (caso Jess: Firestore la autorizaba pero el Sheets desplegado no; Storage sin `.lower()` y sin Dulce; clobber cross-device; límites de celda/lock de Sheets). Unificar en Firestore cierra la clase entera de problema.
Hacerlo POR FASES y PROBANDO cada una (una migración a las prisas ya rompió la lectura antes → "no carga"):
- Fase 1 (segura, aditiva): en cada guardado de activo, espejar la historia a Firestore en tiempo real (patrón `_espejarCampoFirestore`), SIN tocar la lectura → cero riesgo. Resolver bien el pid (id local vs pid Firestore, `FST_resolverPidPaciente`).
- Fase 2: leer de Firestore cuando el Sheet venga vacío (recuperación).
- Fase 3: Firestore principal; Sheets pasa a respaldo/export.
Probar en el equipo de Jess antes de confiar cada fase.

## Otras áreas de mejora pendientes (no urgentes)
- Endurecer la cola de activos `COLA_SYNC` como la de históricos (tope, detección de error permanente, aislamiento de corrupción). Alto valor, bajo riesgo.
- Respaldo local en IndexedDB (hoy solo `localStorage`, que iOS puede desalojar).
- Lista maestra ÚNICA de correos autorizados (hoy duplicada en front, firestore.rules, storage.rules y `ROLES_BACKEND`) + checklist de despliegue (backend Apps Script y reglas se publican a mano → se desfasan).
- Alerta proactiva cuando un equipo tiene datos atorados > X horas (tablero de salud de sync ya existe).
- Actualización del PWA en iOS ("no se puede actualizar"): indicador de versión visible + mecanismo de refresh más confiable.

## Respaldos (estado: COMPLETO — 2026-09-16)
- Sheets: `respaldoDiarioPacientes` (Apps Script, 03:00) → JSON diario en Drive `Respaldos_Clinica` (retención 180) + copia externa por correo a lftaranda.
- Firestore: PITR 7 días + copias diaria/semanal 98 días (consola).
- Storage: versionado de objetos (3 versiones / 30 días) + soft delete 7 días.
