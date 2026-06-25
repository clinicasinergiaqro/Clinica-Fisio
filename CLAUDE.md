# Preferencias de trabajo

## Presentación de diffs y código
- SIEMPRE entregar diffs o código en UN SOLO bloque de código continuo y copiable de corrido.
- NO fragmentar en varias partes/bloques. El usuario trabaja en iPad y no puede copiar por pedazos.
- Si un cambio toca varios puntos del archivo, mostrarlo igualmente como un único bloque continuo.

## Flujo de git por loop
- GitHub Pages se publica desde `main`. Cada loop termina con MERGE A MAIN (PR + squash merge) para llegar a producción.
- Tras cada merge a main, RECREAR la rama de trabajo desde main para evitar conflictos en el siguiente loop:
  `git fetch origin main` → `git reset --hard origin/main` → `git push --force origin <rama>`.
  (Equivale a checkout main + pull + rama nueva; deja la rama designada idéntica a main, sin divergencia.)
- Cada deploy incluye bump de la versión de cache en `sw.js` (`v1-2026-06-22<letra>` → siguiente letra) para forzar refresh del service worker.
- Verificación de sintaxis: `index.html` no se valida con `node --check` directo (no es .js); extraer los bloques `<script>` inline y validarlos con `vm.Script`.
