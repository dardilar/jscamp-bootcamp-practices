# Aquí puedes dejar tus dudas

## Primera parte

¿Por qué al migrar `useRouter` a React Router seguimos manteniendo el hook personalizado en lugar de usar `useNavigate` y `useLocation` directamente en los componentes?

---

**Respuesta:**
Hola genio! Nos encanta que nos preguntes, no dejes de hacerlo :)
Es una muy buena pregunta y la respuesta es:

"Mantenibilidad y Capa de Abstracción"

Que sucede... Como ya vimos en este ejercicio, tuvimos que hacer una migración de nuestro propio Router a react-router.

Si nuestro sitio tiene 20 páginas y 100 componentes (algo que no suele ser raro), la migración de 100 componentes y 20 páginas puede volverse algo complicado, ni hablar si en cada página tenemos un `useNavigate` y un `useLocation` de react-router por cada página.

Lo que hacemos para evitar esto y podes usar las utilidades de una librería sin conocer directamente que recurso se usa, es lo que llamamos "capa de abstracción" o "wrapper". Creamos nuestro propio hook y usamos los recursos de react-router dentro de él.

Así mañana si actualizamos la propia librería (que usualmente cambia la sintaxis o los nombres de las funciones), solo necesitamos actualizar nuestro hook y no todos los componentes que lo usan.


## Segunda parte

<!-- Dudas de la segunda parte del ejercicio -->

## Tercera parte

Tengo entendido que `useSearchParams` nos permite leer y escribir los parámetros de la URL, pero no tengo claro el flujo completo, ¿cuándo el estado de los filtros actualiza la URL y cuándo la URL inicializa el estado?

---

**Respuesta:**

A ver si entendí la pregunta:

Siempre inicializamos un estado con el valor que coloquemos en el `useState()`, por lo tanto, en donde inicializamos el estado a partir de la URL es en:

```jsx
const [filters, setFilters] = useState(() => {
  return {
    technology: searchParams.get('technology') || '',
    location: searchParams.get('type') || '',
    experienceLevel: searchParams.get('level') || '',
  };
});
```

Aquí lo que hacemos es obtener mediante `searchParams` los valores de los parámetros de la URL y asignarlos al estado inicial del filtro.

Eso por un lado, el estado de los filtros actualiza la URL aquí:

```jsx
  useEffect(() => {
    setSearchParams((params) => {
      textToFilter ? params.set('text', textToFilter) : params.delete('text');
      filters.technology ? params.set('technology', filters.technology) : params.delete('technology');
      filters.location ? params.set('type', filters.location) : params.delete('type');
      filters.experienceLevel ? params.set('level', filters.experienceLevel) : params.delete('level');
      currentPage > 1 ? params.set('page', currentPage) : params.delete('page');

      return params; // <- Esta es la linea importante
    })
  }, [filters, textToFilter, currentPage, setSearchParams]);
```

En la linea del `return params` ahí esta lo importante. Cuando dentro del `setSearchParams` devolvemos un return con el valor de `params`, estamos actualizando la URL con los nuevos valores automaticamente. Esto es por el comportamiento interno de `setSearchParams`.


## Cuarta parte

<!-- Dudas de la cuarta parte del ejercicio -->

## Quinta parte

<!-- Dudas de la quinta parte del ejercicio -->

## Sexta parte

En la función `set` de Zustand, a veces se pasa directamente un objeto `set({ isLoggedIn: true })` y otras veces se pasa una función que recibe `state`: `set((state) => ({ favorites: [...state.favorites, jobId] }))`. ¿Cuándo debemos usar una forma u otra? ¿A que se refiere el parametro `state`?

---

**Respuesta:**

La diferencia está en la necesidad de acceder al estado actual antes de actualizarlo.

- **Objeto directo**: Cuando solo necesitamos actualizar un valor específico sin referenciar otros valores del estado.

```javascript
set({ isLoggedIn: true })
```

- **Función con state**: Cuando necesitamos acceder al estado actual para calcular el nuevo valor, especialmente cuando el nuevo valor depende del valor actual.

```javascript
set((state) => ({ favorites: [...state.favorites, jobId] }))
```

El parámetro `state` es una referencia al estado actual del store, lo que nos permite leer valores existentes antes de actualizarlos.

En resumen:
- Usar objeto directo cuando solo necesitamos actualizar un valor específico.
- Usar función con state cuando necesitamos acceder al estado actual para calcular el nuevo valor o modificarlo parcialmente.

---

¿Cuándo conviene usar Zustand y cuándo es suficiente con prop-drilling o Context de React? ¿Hay alguna regla para decidir qué herramienta usar según el tamaño o tipo de estado que necesitamos compartir o es mejor utilizar Zustand en general?

**Respuesta:**

Esto es opinión personal:

Zustand es más fácil que React Context.
Zustand escala mejor que React Context.
Zustand permite actualizar el estado de forma más granular y tiene utilidades simples para vincular automáticamente con LocalStorage y otras Stores.

Usaría Zustand siempre por estas razones.

Prop-drilling es suficiente cuando el estado pasa no más de dos niveles del componente (cuando la prop pasa por dos componentes como máximo). Si tiene tres o más niveles, consideraría usar Zustand o Context por un tema de reutilización. No quiero que muchos componentes intermedios dependan de un estado que no necesitan.
