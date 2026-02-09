# Aquí puedes dejar tus dudas

## Primera parte

<!-- Dudas de la primera parte del ejercicio -->

## Segunda parte

<!-- Dudas de la segunda parte del ejercicio -->

## Tercera parte

<!-- Dudas de la tercera parte del ejercicio -->

## Cuarta parte

- Me confundo al momento de enviar una función como prop, tengo entendido que se envía de la siguiente manera: Como al componente padre tiene el manejo de los estados, se envía la función que se encarga de cambiar el estado de la página actual; el componente hijo recibe esta función y la ejecuta con un evento cuando se hace clic en el botón; donde se ejecuta otra funcion que se encarga de pasar el parametro a la función que se encarga de cambiar el estado de la página actual. (Creo que es el caso pero me confundo un poco).

---

**Respuesta:**

Hola crack! Lo entendiste perfecto! Lo vemos con el ejemplo del código así queda mas claro si?

### El flujo completo del pasaje de funciones como props

**1. El componente PADRE tiene el estado:**
```jsx
// En SearchPage.jsx (componente padre)
const [currentPage, setCurrentPage] = useState(1);
```

**2. El componente PADRE crea una función handler:**
```jsx
// En SearchPage.jsx
const handlePageChange = (newPage) => {
  setCurrentPage(newPage);  // Esta función modifica el estado
};
```

**3. El componente PADRE pasa la función como prop al HIJO:**
```jsx
// En SearchPage.jsx
<Pagination 
  currentPage={currentPage} 
  onPageChange={handlePageChange}  // <- Pasamos la función
/>
```

**4. El componente HIJO recibe la función como prop:**
```jsx
// En Pagination.jsx
export function Pagination({ currentPage, onPageChange }) {
  // onPageChange es la función que recibimos del padre
  // ...
}
```

**5. El componente HIJO crea su propio handler que usa la función del padre:**
```jsx
// En Pagination.jsx
const handlePageClick = function(e, page) {
  e.preventDefault();
  
  if (page !== currentPage) {
    onPageChange(page);  // <- Ejecutamos la función del padre con el parámetro
  }
}
```

**6. El componente HIJO ejecuta su handler en un evento:**
```jsx
// En Pagination.jsx
<a onClick={(e) => handlePageClick(e, page)}>
  {page}
</a>
```

### Por qué hacemos esto?

**Separación de responsabilidades:**
- El **padre** (`SearchPage`) maneja el **ESTADO** y la **LÓGICA DE NEGOCIO**
- El **hijo** (`Pagination`) maneja la **INTERACCIÓN** del usuario (clicks, inputs, etc.)

**Flujo de datos unidireccional:**
- Los datos fluyen del padre -> hijo (via props)
- Los eventos fluyen del hijo -> padre (via funciones callback)

**IMPORTANTE:**

Siempre terminamos pasando funciones como props por esta razón. El componente padre se encarga de la **Lógica de negocio**, y luego reparte los handlers a todos los componentes hijos que precisen ejecutarla.

Siempre terminamos ejecutando los handlers en el punto en el que el usuario interactúa con la UI. Y para pasar los valores necesarios a los handlers, es que hacemos el paso 5, filtramos y normalizamos los datos que le enviamos a los handlers, para que se pueda ejecutar la lógica de negocio bien.

No se si quedó mas claro o más entreverado, pero cualquier cosa nos dices si?
Gracias por preguntarnos! Es un lindo tema jeje


## Quinta parte

<!-- Dudas de la quinta parte del ejercicio -->

## Sexta parte

<!-- Dudas de la sexta parte del ejercicio -->

## Séptima parte

<!-- Dudas de la séptima parte del ejercicio -->

## Ejercicio extra

<!-- Dudas del ejercicio extra -->
