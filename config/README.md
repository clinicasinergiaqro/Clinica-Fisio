# PROTOCOLO DE FUENTE ÚNICA

- **index.html y sw.js**: la verdad ES este repo. Deploy automático vía GitHub Pages.
- **config/Codigo.gs**: espejo del Apps Script desplegado. FLUJO: todo cambio se hace PRIMERO aquí (commit), LUEGO Carlos copia el archivo completo y lo pega en Apps Script + nueva versión del deployment. Nunca al revés.
- **config/firestore.rules**: espejo de las reglas vivas. FLUJO: cambio primero aquí (commit), luego Carlos pega en Firebase Console y publica.
- **REGLA PARA TODA SESIÓN DE CODE**: clonar fresh de GitHub main antes de leer cualquier archivo. NUNCA leer de `D:\claude cowork\` para auditorías — esas copias son históricas de la migración, no reflejan producción.
