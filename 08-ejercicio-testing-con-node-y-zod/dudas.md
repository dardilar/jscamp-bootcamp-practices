<!-- Aquí puedes poner tus dudas del ejercicio -->
1) ¿Por qué se envuelven `app.listen()` y `server.close()` en Promises dentro de `before()` y `after()`? ¿Siempre es necesario hacer eso con funciones basadas en callbacks?

**Respuesta:**
No lo hacemos porque sean callbacks, lo hacemos porque necesariamente `before()` y `after()` de `node:test` esperan Promises para saber cuándo terminó la operación asincrónica.

Todo lo que vayamos a hacer en `before()` y `after()` debe ser asincrónico y devolver una Promise.

2) En los tests, el DELETE elimina un job con un ID hardcodeado que también usa PATCH. Si corro los tests en un orden distinto, ¿podría romperse alguno? ¿Cómo se suele manejar el aislamiento de datos en tests de integración?

**Respuesta:**
Es una muy buena pregunta, no se rompería nada porque aunque modifiquemos los jobs en cada uno de los tests, estos se reinician al final de cada test gracias al `after()` que cierra el servidor.

Esto significa que por cada test, el servidor arranca con el mismo estado inicial (sin jobs modificados).

Si en un test elimino toda la BBDD, no afectaría a los demás tests porque cada test tiene su propio servidor. Esto es lo interesante del `before()` y `after()`. Y de ejecutar cada test de forma aislada.

Por eso es que en todos los tests que hacemos, debemos hacer cosas repetitivas como llamar a todos los jobs, crear nuevos jobs, etc. Se hace así porque cada uno debe ser independiente y no depender de otros tests.