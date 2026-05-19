<!-- Aquí puedes poner tus dudas del ejercicio -->
Hola! Revisando el ejercicio de MVC con Express me surgió una duda sobre la relación entre el modelo y el controlador.

Veo que el controlador recibe la petición (req), extrae los parámetros y llama al modelo. El modelo filtra, transforma y retorna los datos. Pero me confundo al entender cuál es exactamente la responsabilidad de cada uno y dónde termina una y empieza la otra.

Por ejemplo, en `getAll`: el controlador saca los query params y se los pasa al modelo, el modelo filtra y pagina, y luego retorna el resultado al controlador que lo envía como JSON. ¿Esa cadena está bien así o debería haber alguna lógica diferente en alguna de las dos partes?

¿Me podrías explicar cómo pensar este flujo correctamente? Gracias!

**Respuesta:**
Holaa obvio! Es una duda muy común así que no te preocupes
Para hacerlo un poco más simple, el modelo es el que se encarga de la lógica de negocio, y punto.

Esto significa que, si tenes que hacer filtros, evaluaciones, paginación, etc., todo eso va en el modelo.

El controlador solo da datos y devuelve datos. No tiene ni idea de lo que se hace con esos datos (para eso está el modelo).

La idea de MVC es que si queres cambiar de donde salen los datos, lo puedas hacer solo modificando el modelo.

Un ejemplo:
Imaginate que mañana traemos los jobs de una base de datos distinta y en vez de tener en cada `job` la propiedad `company`, ahora tiene `companyName`. Con MVC, solo tendrías que modificar el modelo para que devuelva los datos en el formato que necesitas, y el controlador seguiría funcionando igual.

Una manera de pensar si lo haces bien es esa:
Viendo el controlador, si mañana modifican la manera de obtener los jobs de la BBDD, ¿tendrías que modificar el controlador?

Si la respuesta es sí, entonces está mal.
Si la respuesta es no, entonces está bien.

