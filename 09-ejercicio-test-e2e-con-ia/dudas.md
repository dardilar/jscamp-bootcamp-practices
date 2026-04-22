<!-- Aquí puedes poner tus dudas del ejercicio -->
1. En el test de aplicar a una oferta, hardcodeo el texto 'Desarrollador de Software Senior' para verificar el primer resultado. ¿Es una buena práctica depender del contenido exacto de los datos en un test E2E? ¿Cómo se manejaría esto en un entorno real?

2. Algunos tests hacen clic en 'Iniciar sesión' pero no tenemos una autentificacion real. ¿Cómo se suele manejar la autenticación en tests E2E con Playwright?

3. ¿Cuál es la diferencia entre usar `page.getByRole()` vs `page.locator()` con una clase CSS como `.job-listing-card`? ¿Cuándo conviene usar cada uno?

4. En el test de paginación se asume que al buscar 'developer' hay suficientes resultados para que aparezca la paginación, pero ¿cómo se hace para que los tests E2E no dependan del estado real de los datos?

5. ¿Cuál es la diferencia principal entre los tests E2E con Playwright y los tests de integración que hicimos antes con `node:test`? ¿Cuándo deberíamos usar cada tipo?