<!-- Aquí puedes poner tus dudas sobre el ejercicio -->
Hola! Estuve revisando el JobModel con SQL y me surgieron estas dudas:

1. En `getAll()` no veo que se use `limit` ni `offset` en la query, aunque en la práctica anterior de la API sí probábamos esos parámetros. ¿Debería agregarlos acá con `LIMIT ? OFFSET ?`, o eso se maneja en otra capa?

**Respuesta:** Hola! Muy buena pregunta, es verdad que no lo dejamos 100% implementado para que ustedes lo hagan. Hicimos unos cambios ahora para que veas como sería con `limit` y `offset`. Así queda listo. Cualquier duda con respecto a la implementación nos puedes avisar, tocamos un poco más por fuera del modelo.

2. En `update()`, cuando se actualiza `technology`, se borran todas las filas de `job_technologies` y se vuelven a insertar todas de nuevo, en vez de comparar cuáles agregar o quitar. ¿Es un patrón aceptable en general, o solo tiene sentido cuando la lista es pequeña?

**Respuesta:** Depende. Solo tiene sentido comparar diferencias (INSERT solo lo nuevo, DELETE solo lo que sobra) cuando la lista es grande o se actualiza con muchísima frecuencia. Para este ejercicio, reemplazar toda la lista es lo mejor.

3. ¿Por qué se usan placeholders (`?`) en vez de interpolar los valores directo en el string SQL? Entiendo que tiene que ver con SQL injection, pero ¿podrías darme un ejemplo de cómo se explotaría si no se usaran?

**Respuesta:** Los placeholders separan el código SQL de los valores del usuario: el valor se trata como dato, nunca como código ejecutable.

Te doy un caso de cómo pondrías el código sin placeholders:
```ts
const query = `SELECT * FROM jobs WHERE title = '${title}'`
```

Qué pasa con esto? Si el usuario envía `title = "' OR '1'='1"`, la query queda:
```sql
SELECT * FROM jobs WHERE title = '' OR '1' = '1'
```

Lo que devuelve todos los jobs.
Este es el mejor de los casos, el usuario podría pasar `'; DROP TABLE jobs; --` y borraría toda la tabla.

Por eso es que usamos placeholders en vez de interpolar los valores directamente.

4. El patrón de arrays `conditions[]` y `params[]` para armar el WHERE dinámicamente, ¿es algo que se usaría igual en un proyecto real con SQL?

**Respuesta:** Si, lo que confunde mucho es cuando usamos ORMs o query builders, en donde la DX (developer experience) es mucho mejor. Pero internamente, están haciendo lo mismo.

5. Si `filters.tech` solo permite un valor a la vez (un solo `push` en el array `params`), ¿cómo se implementaría un filtro que acepte búsqueda por múltiples tecnologías a la vez (ej. `tech=react,css`)?

**Respuesta:** Se separa el string por comas, se genera un placeholder por cada tecnología y se usa `IN` (esto hace que el job coincida si tiene al menos una de ellas, que es lo habitual en un buscador), te paso código para que veas como quedaría:

```ts
// "react,css" -> ['react', 'css']
const technologies = filters.tech.split(',').map((tech) => tech.trim())

// Generamos un "?" por cada tecnología -> "?, ?"
const placeholders = technologies.map(() => '?').join(', ')

conditions.push(`
  j.id IN (
    SELECT job_id
    FROM job_technologies
    WHERE technology COLLATE NOCASE IN (${placeholders})
  )
`)

params.push(...technologies)
```

Para `tech=react,css` la consulta queda equivalente a `technology IN (?, ?)` y devuelve los jobs que tengan `react` o `css`

Si quedó dudas de las respuestas nos puedes volver a escribir, si?
 
