<!-- Aquí puedes poner tus dudas sobre el ejercicio -->
1. ¿Cuándo usar `jobs: Job[]` y cuándo `job: Job` en los parámetros?

**Respuesta:**
- `jobs: Job[]` se usa cuando se espera un array de jobs
- `job: Job` se usa cuando se espera un solo job

2. ¿Cómo funciona exactamente `Pick<Job, 'id' | 'title' | 'company' | 'location'>`?

**Respuesta:**
`Pick<Job, 'id' | 'title' | 'company' | 'location'>` crea un nuevo tipo que solo incluye esas propiedades especificadas de `Job`.
Si `Job` tiene más propiedades, ellas no están incluidas en el nuevo tipo.