Hola Duvan! Como estas?
Felicidades por la entrega del ejercicio! Nos gustó como pensaste la lógica del filtro viendo caso por caso, creemos que es una forma muy buena para separar responsabilidades y que sea fácil de entender.

Hemos removido el flag de `use strict`, no es necesario cuando estamos trabajando en ES6+.

A nivel de `fetch-data.js`, estuvo genial que hayas implementado el objeto de las ciudades para manejar qué nombre mostrar.

Hicimos algunos cambios que fue manipular la creación del articulo no como un string, sino como un elemento del DOM, lo que nos permitió usar los métodos de los elementos del DOM, como `classList.add`, `setAttribute`, etc. Y poder asignar el `li` al `fragment` como un elemento del DOM, en lugar de solo como un string.

También implementamos el `DocumentFragment` para mejorar el rendimiento, ya que en lugar de agregar cada trabajo directamente al DOM (lo que haría que el navegador redibuje la página múltiples veces), guardamos todos los elementos en memoria primero, y luego los agregamos todo a la vez.

Cualquier duda, como siempre: nos puedes escribir en `dudas.md` o hablarnos directamente

Enhorabuena por tu entrega!