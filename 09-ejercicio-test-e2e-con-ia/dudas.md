<!-- Aquí puedes poner tus dudas del ejercicio -->
1. En el test de aplicar a una oferta, hardcodeo el texto 'Desarrollador de Software Senior' para verificar el primer resultado. ¿Es una buena práctica depender del contenido exacto de los datos en un test E2E? ¿Cómo se manejaría esto en un entorno real?

**Respuesta:**
Hola crack! Fuimos dejando comentarios en el código para que puedas tener ejemplos de esto.
No es una buena práctica:
- Usar textos hardcoded en los tests
- Depender de selectores de ID o de clases

Lo ideal en estos casos es verificar que si necesitamos un elemento específico, lo buscamos por su rol (heading de nivel 3 por ejemplo), sin importar el contenido que tenga dentro. Si sabemos que existe el `h3` y es visible, con eso debe alcanzar.

2. Algunos tests hacen clic en 'Iniciar sesión' pero no tenemos una autentificacion real. ¿Cómo se suele manejar la autenticación en tests E2E con Playwright?

**Respuesta:**
En los tests E2E, lo ideal es evitar la autenticación real siempre que sea posible.
Lo que se suele usar es hacer un mock de la autenticación. Que significa esto? Que en lugar de hacer una petición real a un servidor para autenticar al usuario, se simula la respuesta del servidor con datos de prueba.
Es como remplazar la función de autenticación real con una función que devuelve datos de prueba y no hace peticiones reales al servidor.
Hay librerías que nos permiten hacer esto muy fácil, y lo interesante que tiene es que no solo podemos simular los datos de autenticación, sino también simular errores, tiempos de respuesta, etc.
De esta manera, podemos testear todo de una manera muy completa.


3. ¿Cuál es la diferencia entre usar `page.getByRole()` vs `page.locator()` con una clase CSS como `.job-listing-card`? ¿Cuándo conviene usar cada uno?

**Respuesta:**
Los roles no se cambian tan seguido, si tenemos un nav para ir entre páginas, podemos modificar el componente, añadir estilos, moverlo, pero siempre será un nav a nivel semántico.
Hacer un selector por clases puede ser más frágil, ya que si cambiamos la clase, el test fallará.

Lo mejor es usar siempre que se pueda `getByRole()` para encontrar elementos, ya que los roles son más estables y no dependen de cambios de estilos.

2. En el test de paginación se asume que al buscar 'developer' hay suficientes resultados para que aparezca la paginación, pero ¿cómo se hace para que los tests E2E no dependan del estado real de los datos?

**Respuesta:**
Así como te comenté que se puede hacer un mock de la autenticación, también se puede hacer un mock de los datos que se muestran en la página. Con esto tenemos más control de los datos que se muestran.

1. ¿Cuál es la diferencia principal entre los tests E2E con Playwright y los tests de integración que hicimos antes con `node:test`? ¿Cuándo deberíamos usar cada tipo?

**Respuesta:**
Los E2E se deberían usar para cosas MUY importantes dentro del sitio, cosas que si fallan, sería un problema grande para el usuario. Ej: El buscador de airbnb, el formulario de pago, el inicio de sesión, etc.

Los otros tests se enfocan más en casos de uso específicos. Si vamos a los ejemplos que comentamos:
- Queremos que el botón de buscar abra y se vea bien.
- Queremos que al darle click al botón de iniciar sesión se redirija a la página de login.
- Queremos que al poner el email en el input, salten los errores si no es válido.

Son cosas más granulares, como por ejemplo ver que al buscar un trabajo que no existe, no se muestre ningún resultado.

Los E2E van de una punta a otra, tienen que simular el comportamiento completo de un usuario en la web.
Los otros test son más específicos y van a probar pequeñas sub partes de ese flujo, pero con más detalle.

E2E sería: 
- Entrar a la página navegando por los links y aplicar a un trabajo
Otros tests que no son E2E sería:
- Ver que el input funciona bien y si no se le pone nada de texto, que no se pueda enviar el formulario

Cualquier otra duda nos podes preguntar si? Espero haya quedado un poco más claro :)
