# Dudas sobre el ejercicio CLI con Node.js

## 1. ¿Por qué es necesario usar `async/await` (asincronismo) en este ejercicio?

```javascript
const files = await readdir(dir);
const info = await stat(fullPath);
```

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