import { useRouter } from "../hooks/useRouter";

/*
OJO CON ESTO! No es lo ideal, luego en el siguiente módulo vamos a trabajar con el router de `react-router`. Pero una manera de hacer que funcione la re dirección de 404, es en un objeto global (fuera del componente), agregar las rutas que se pasan por props, y si no hay match con ninguna de ellas, redirigir a la página de 404
*/

/* 
Lo vamos a explicar mejor:

El componente `Route.tsx` por más que sea un componente de React, no deja de ser una función de javascript que se carga en `App.jsx` una sola vez (cargar es diferente a utilizar, cargamos la función cuando se importa, y la usamos cada vez que llamamos al componente `Router`).

Entendiendo esto, lo que podemos hacer es crear un objeto (Set) que se cargue cuando se importa el componente.

```
const validPaths = new Set();
```

Y cada vez que se vaya a usar el componente, se agregue la ruta a este objeto.

De esta manera, cada vez que usamos el componente `Route`, vamos a recibir la prop de `path` y la agregamos al objeto `validPaths`.

El camino es el siguiente, cuando ejecutamos:

```
  <Route path="/" component={HomePage} />
  <Route path="/search" component={SearchPage} />
  <Route path="*" component={NotFoundPage} />
```

Lo que pasa con el `Set` es que:

```
validPaths.add("/");
validPaths.add("/search");
validPaths.add("*");
```

Ahora, cuando el usuario navega a una ruta, por ejemplo `/about`, el componente `Route` con `path="*"` va a verificar:
1. ¿El `currentPath` (`/about`) está en `validPaths`? No, porque solo tenemos `/`, `/search` y `*`.
2. Como no está en `validPaths`, significa que es una ruta no válida.
3. El componente con `path="*"` detecta esto y renderiza el componente 404.

De esta manera, el `path="*"` actúa como un "catch-all" para rutas no definidas, mostrando la página de error 404.

IMPORTANTE: Esto solo funciona porque el `Set` es un objeto global que persiste entre renders. Cada vez que React renderiza los componentes `Route`, el `Set` ya tiene todas las rutas válidas agregadas. Lo vamos a solucionar con `react-router` en el siguiente módulo.
*/
const validPaths = new Set();

export function Route({path, component: Component}) {
  const {currentPath} = useRouter();

  // Agregamos la ruta al set
  if (!validPaths.has(path)) {
    validPaths.add(path);
  }

  // Si es una ruta de 404 y no existe en el set, redirigimos a 404 
  if (path === "*" && !validPaths.has(currentPath)) {
    return <Component />;
  }

  if (currentPath === path) {
    return <Component />;
  }

  return null;
}