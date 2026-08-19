Hola! Estuve haciendo el módulo de CI/CD con GitHub Actions y me surgieron estas dudas:

1. En el workflow manual, los valores de los inputs se pasan por `env:` en vez de usar `${{ inputs.x }}` directo dentro del `run:`. Entiendo que es para evitar inyección de comandos, pero ¿hay casos donde sí sea aceptable usar `${{ }}` directamente en un `run:`? ¿Cómo se decide?

**Respuesta:** Hola! Me encantó la pregunta. La regla es:

Nunca permitas directamente en `run:` valores que puedan estar controlados por un usuario, sean: inputs manuales, títulos/cuerpos de issues, comentarios, nombres de ramas, datos de PRs, etc. porque podrían sin problema inyectar comandos.

Está bien usar `${{ }}` en `run:` cuando el valor es fijo y lo controla el propio workflow. Por ejemplo `echo "Corriendo en ${{ runner.os }}"`.

2. Los inputs `environment` y `logging_level` están como `type: string` sin restricción de valores. ¿Sería mejor usar `type: choice` con opciones fijas (dev/staging/prod)?

**Respuesta:** Sí, lo hicimos de esta manera por ser ejercicio práctico. Pero en un entorno real es mejor usar `choice`.

Con `type: choice` y `options:` limitas los valores permitidos, evitas typos y mejoras mucho la experiencia de usuario. Sobre todo lo usaría cuando los valores son estáticos y conocidos.

3. En el workflow de CI, los 6 jobs repiten los mismos dos pasos (`actions/checkout` y el setup de pnpm). ¿Hay alguna forma de evitar esa duplicación, o es normal y esperado que cada job haga su propio checkout?

**Respuesta:** Bien, aquí pasan dos cosas:

1. Es normal que cada job repita `actions/checkout`, porque cada uno se ejecuta en un runner independiente y limpio.
2. Existe la `composite action setup-pnpm-ci-cd` que permite reutilizar la configuración de Node, pnpm e instalación de dependencias, pero cada job debe hacer su propio checkout para acceder al código del repositorio. Es algo un poco más complejo, pero se puede hacer.

4. ¿Por qué cada job necesita hacer checkout de nuevo?

**Respuesta:** La respuesta quedó un poco implícita en la respuesta anterior, pero:
Es porque cada job arranca en un runner nuevo con un filesystem vacío que no contiene el código del repositorio.
El paso `actions/checkout@v6` es lo que descarga el código a ese runner, y lo tiene que hacer cada workflow por separado.
Sin él, comandos como `pnpm lint:frontend` o `pnpm test:backend` no encontrarían los archivos del proyecto ni las configuraciones.