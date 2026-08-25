1. Puse `USER node` después del `COPY`, así que los archivos quedan con owner root. ¿Importa si la app solo lee, o conviene usar siempre `COPY --chown=node:node`?

2. `docker init` genera `CMD npm start` (shell form) y yo escribí `CMD ["node", "server.js"]` (exec form). Si exec form maneja mejor las señales, ¿por qué la herramienta oficial usa shell form?

3. `docker init` instala dependencias con `--mount=type=bind` y `--mount=type=cache` en vez de `COPY package*.json` + `npm ci`. ¿Cuál conviene en un proyecto real? ¿Los mounts de BuildKit funcionan en cualquier CI?

4. Mi etapa `runner` solo copia `dist/` porque esbuild bundlea todo. ¿Cómo se haría si hubiera una dependencia nativa tipo `better-sqlite3`?