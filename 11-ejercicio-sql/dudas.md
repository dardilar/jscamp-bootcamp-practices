<!-- Aquí puedes poner tus dudas sobre el ejercicio -->
Hola! Estuve revisando el JobModel con SQL y me surgieron estas dudas:

1. En `getAll()` no veo que se use `limit` ni `offset` en la query, aunque en la práctica anterior de la API sí probábamos esos parámetros. ¿Debería agregarlos acá con `LIMIT ? OFFSET ?`, o eso se maneja en otra capa?

2. En `update()`, cuando se actualiza `technology`, se borran todas las filas de `job_technologies` y se vuelven a insertar todas de nuevo, en vez de comparar cuáles agregar o quitar. ¿Es un patrón aceptable en general, o solo tiene sentido cuando la lista es pequeña?

3. ¿Por qué se usan placeholders (`?`) en vez de interpolar los valores directo en el string SQL? Entiendo que tiene que ver con SQL injection, pero ¿podrías darme un ejemplo de cómo se explotaría si no se usaran?

4. El patrón de arrays `conditions[]` y `params[]` para armar el WHERE dinámicamente, ¿es algo que se usaría igual en un proyecto real con SQL?

5. Si `filters.tech` solo permite un valor a la vez (un solo `push` en el array `params`), ¿cómo se implementaría un filtro que acepte búsqueda por múltiples tecnologías a la vez (ej. `tech=react,css`)?