<!-- Aquí puedes poner tus dudas del ejercicio -->
Hola! Revisando el ejercicio de MVC con Express me surgió una duda sobre la relación entre el modelo y el controlador.

Veo que el controlador recibe la petición (req), extrae los parámetros y llama al modelo. El modelo filtra, transforma y retorna los datos. Pero me confundo al entender cuál es exactamente la responsabilidad de cada uno y dónde termina una y empieza la otra.

Por ejemplo, en `getAll`: el controlador saca los query params y se los pasa al modelo, el modelo filtra y pagina, y luego retorna el resultado al controlador que lo envía como JSON. ¿Esa cadena está bien así o debería haber alguna lógica diferente en alguna de las dos partes?

¿Me podrías explicar cómo pensar este flujo correctamente? Gracias!