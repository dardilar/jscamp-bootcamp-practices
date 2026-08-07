Hola! Estuve haciendo el módulo de CI/CD con GitHub Actions y me surgieron estas dudas:

1. En el workflow manual, los valores de los inputs se pasan por `env:` en vez de usar `${{ inputs.x }}` directo dentro del `run:`. Entiendo que es para evitar inyección de comandos, pero ¿hay casos donde sí sea aceptable usar `${{ }}` directamente en un `run:`? ¿Cómo se decide?

2. Los inputs `environment` y `logging_level` están como `type: string` sin restricción de valores. ¿Sería mejor usar `type: choice` con opciones fijas (dev/staging/prod)?

3. En el workflow de CI, los 6 jobs repiten los mismos dos pasos (`actions/checkout` y el setup de pnpm). ¿Hay alguna forma de evitar esa duplicación, o es normal y esperado que cada job haga su propio checkout?

4. ¿Por qué cada job necesita hacer checkout de nuevo?