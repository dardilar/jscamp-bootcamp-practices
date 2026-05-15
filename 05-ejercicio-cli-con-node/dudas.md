# Dudas sobre el ejercicio CLI con Node.js

## 1. ¿Por qué es necesario usar `async/await` (asincronismo) en este ejercicio?

```javascript
const files = await readdir(dir);
const info = await stat(fullPath);
```

**Respuesta:**

Usamos `async/await` porque las operaciones de **lectura del sistema de archivos son asincrónicas**. Esto significa que no son instantáneas y toman tiempo en completarse.

**¿Por qué son asincrónicas?**

Cuando Node lee archivos:
1. Le pide al sistema operativo que lea el directorio/archivo
2. Mientras espera la respuesta, Node puede hacer otras cosas (no se bloquea)
3. Cuando el sistema operativo termina, devuelve los datos

**Sin `await`, esto NO funcionaría:**
```javascript
const files = readdir(dir); // ❌ files sería una Promise, no los archivos
console.log(files); // Promise { <pending> }
```

**Con `await`, esperamos el resultado:**
```javascript
const files = await readdir(dir); // ✅ Esperamos a que termine
console.log(files); // ['archivo1.txt', 'carpeta1', ...]
```

**En tu código sería así:**

```javascript
// Esperamos a que readdir() lea todos los nombres del directorio
const files = await readdir(dir);

// Dentro del map, esperamos a que stat() nos dé info de cada archivo
const info = await stat(fullPath);
```

Si no usáramos `await`, intentaríamos trabajar con Promises en lugar de con los datos reales, y el código fallaría.

---

## 2. ¿Cómo funciona `Promise.all()`?

```javascript
const entries = await Promise.all(
    files.map(async(name) => {
        const info = await stat(fullPath);
        return { name, size, isDirectory }
    })
)
```

**Respuesta:**

`Promise.all()` ejecuta **múltiples promesas en paralelo** y espera a que **todas** terminen antes de continuar.

### ¿Qué hace en tu código?

**Paso 1: `files.map()` crea un array de Promises**

```javascript
const files = ['archivo1.txt', 'carpeta1', 'archivo2.js'];

// files.map() crea un array de Promises:
[
  Promise { stat('archivo1.txt') },
  Promise { stat('carpeta1') },
  Promise { stat('archivo2.js') }
]
```

**Paso 2: `Promise.all()` ejecuta todas en paralelo**

Sin `Promise.all()` (secuencial - lento ❌):
```javascript
for (const name of files) {
  const info = await stat(name); // Espera uno por uno
  // Total: 3 archivos × 10ms = 30ms
}
```

Con `Promise.all()` (paralelo - rápido ✅):
```javascript
const entries = await Promise.all(
  files.map(async (name) => {
    const info = await stat(name); // Todos al mismo tiempo
    // Total: 10ms (todos en paralelo)
  })
);
```

**Paso 3: Espera a que TODAS terminen**

```javascript
// Promise.all() espera a que las 3 terminen:
const entries = [
  { name: 'archivo1.txt', size: '2 KB', isDirectory: false },
  { name: 'carpeta1', size: '4 KB', isDirectory: true },
  { name: 'archivo2.js', size: '1 KB', isDirectory: false }
]
```

**Lo que sucede:**
1. Si tienes 100 archivos, crea 100 Promises
2. Ejecuta las 100 llamadas a `stat()` **al mismo tiempo** (paralelo)
3. Espera a que las 100 terminen
4. Devuelve un array con los 100 resultados

### IMPORTANTE: Si una falla, todas fallan

```javascript
await Promise.all([
  Promise.resolve('✅ OK'),
  Promise.reject('❌ ERROR'),
  Promise.resolve('✅ OK')
])
// ❌ Lanza error y no devuelve nada
```

---

## 3. ¿Cómo se usa típicamente `formatBytes()` en proyectos reales?

Creamos una función helper `formatBytes()` para convertir bytes a KB/MB/GB:
- ¿Es común crear estas utilidades en cada proyecto o suelen venir de ciertas librerías?

```javascript
const formatBytes = function(bytes) {
    if(bytes < 1024) return bytes + ' Bytes';
    if(bytes < 1024 * 1024) return bytes / 1024 + ' KB';
    if(bytes < 1024 * 1024 * 1024) return bytes / 1024 / 1024 + ' MB';
    return bytes / 1024 / 1024 / 1024 + ' GB';
}
```

**Respuesta:**

Suele venir de librerías, en este caso queríamos hacerlo nosotros para enseñar como sería. De todos modos, esto lo podes hacer en tu código si lo preciosas, (es algo chico), si querés más funcionalidades relacionadas o algo mas complejo, si me iría por una librería.