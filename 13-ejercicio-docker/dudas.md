1. Puse `USER node` después del `COPY`, así que los archivos quedan con owner root. ¿Importa si la app solo lee, o conviene usar siempre `COPY --chown=node:node`?

**Respuesta:**
Hola! Muy buena pregunta.
Si tu app solo lee archivos, no pasa nada: el usuario `node` puede leer archivos que son de root. Pero conviene poner `COPY --chown=node:node` igual, por las dudas: si el día de mañana tu app necesita guardar algo (un log, un archivo subido), va a fallar porque no tiene permiso de escritura, y es un error difícil de detectar.

2. `docker init` genera `CMD npm start` (shell form) y yo escribí `CMD ["node", "server.js"]` (exec form). Si exec form maneja mejor las señales, ¿por qué la herramienta oficial usa shell form?

**Respuesta:**
`docker init` usa `npm start` porque es la opción que funciona para todos los proyectos sin saber cómo están armados. El problema de esa forma es que el que arranca el proceso es un "shell" intermedio, y cuando hacés `docker stop`, la señal de "apagate" le llega al shell, no a Node. Node nunca se entera, y Docker termina matándolo a la fuerza a los 10 segundos. Con `CMD ["node", "server.js"]` Node arranca directo y se entera del apagado, pudiendo cerrar conexiones prolijamente.

3. `docker init` instala dependencias con `--mount=type=bind` y `--mount=type=cache` en vez de `COPY package*.json` + `npm ci`. ¿Cuál conviene en un proyecto real? ¿Los mounts de BuildKit funcionan en cualquier CI?

**Respuesta:**
Los `--mount` hacen que npm guarde los paquetes descargados en un caché, así los próximos builds son más rápidos. El problema: no funcionan en todos lados (algunos CIs no los soportan). `COPY package*.json` + `npm ci` funciona en cualquier lado, y Docker igual es inteligente: si no cambiaste el `package.json`, no vuelve a instalar nada, usa lo que ya tenía.

4. Mi etapa `runner` solo copia `dist/` porque esbuild bundlea todo. ¿Cómo se haría si hubiera una dependencia nativa tipo `better-sqlite3`?

**Respuesta:**
Los paquetes nativos como `better-sqlite3` traen archivos binarios (no JavaScript), y esbuild no puede meterlos dentro del bundle. Entonces el container final necesita sí o sí el `node_modules` con ese paquete instalado. La solución: decirle a esbuild que ignore ese paquete (`external`), instalarlo en el container final con `npm ci --omit=dev`, y copiar el `node_modules` además del `dist/`.