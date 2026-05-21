/*
 * Aquí debes escribir tus tests para la API de jobs
 *
 * Recuerda:
 * - Usar node:test y node:assert (sin dependencias externas)
 * - Levantar el servidor con before() y cerrarlo con after()
 * - Testear todos los endpoints: GET, POST, PUT, PATCH, DELETE
 * - Verificar validaciones con Zod
 * - Comprobar códigos de estado HTTP correctos
 */
import { test, describe, before, after } from "node:test";
import assert from "node:assert";
import app from "./app.js";

let server;
const PORT = 3456;
const BASE_URL = `http://localhost:${PORT}`;

before(async () => {
  return new Promise((resolve, reject) => {
    server = app.listen(PORT, () => resolve());
    server.on("error", reject);
  });
});

after(async () => {
  return new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
});

/* Podemos crear unos helpers que nos ayuden a hacer los tests más legibles y reutilizar código */
const handleGetRequestAndAssertStatus = async (path, expectedStatus = 200) => {
  const response = await fetch(`${BASE_URL}${path}`);
  assert.strictEqual(response.status, expectedStatus);
  
  return response.json();
};

const handlePostRequestAndAssertStatus = async (path, body, expectedStatus = 200) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  
  assert.strictEqual(response.status, expectedStatus);
  
  return response.json();
};

const handlePutRequestAndAssertStatus = async (path, body, expectedStatus = 200) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  
  assert.strictEqual(response.status, expectedStatus);
};

const handlePatchRequestAndAssertStatus = async (path, body, expectedStatus = 200) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  
  assert.strictEqual(response.status, expectedStatus);
};

const handleDeleteRequestAndAssertStatus = async (path, expectedStatus = 200) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
  });
  
  assert.strictEqual(response.status, expectedStatus);
};

describe("GET /jobs", () => {
  test("Debe responder con 200 y un array de trabajos", async () => {
    const json = await handleGetRequestAndAssertStatus("/jobs", 200);
    assert.ok(Array.isArray(json.data), "La respuesta debe ser un array");
  });

  test("Debe filtrar jobs por tecnologia", async () => {
    const tech = "react";
    const json = await handleGetRequestAndAssertStatus(`/jobs?technology=${tech}`, 200);

    assert.ok(
      json.data.every((job) => job.data.technology.includes(tech)),
      "Todos los trabajos deben incluir la tecnologia",
    );
  });

  test("Debe respetar el límite de resultados", async () => {
    const limit = 2;
    const json = await handleGetRequestAndAssertStatus(`/jobs?limit=${limit}`, 200);

    assert.strictEqual(json.limit, limit, "El límite debe ser el especificado");
    assert.strictEqual(
      json.data.length,
      limit,
      "La cantidad de trabajos debe ser el especificado",
    );
  });

  test("Debe aplicar offset correctamente", async () => {
    const offset = 1;
    const json = await handleGetRequestAndAssertStatus(`/jobs?offset=${offset}`, 200);

    assert.strictEqual(json.offset, offset, "El offset debe ser el especificado");
    assert.ok(
      json.data[0].id === "d35b2c89-5d60-4f26-b19a-6cfb2f1a0f57",
      "El primer trabajo debe ser el segundo de la lista",
    );

    /* También podemos no depender de un ID escrito a mano, y buscar uno en BBDD. Por si en algún momento cambia */

    // 1. Obtenemos todos los jobs
    const allJobs = await handleGetRequestAndAssertStatus("/jobs", 200);
    
    // 2. Obtenemos el job correspondiente al offset
    const jobAtOffset = allJobs.data[offset];
    
    // 3. Comprobamos que el job obtenido es el mismo que el que se obtiene con el offset
    assert.strictEqual(json.data[0].id, jobAtOffset.id, "El primer trabajo debe ser el segundo de la lista");
  });
});

describe("POST /jobs", () => {
  test("El nuevo trabajo se añade correctamente con buen formato", async () => {
    const newJob = {
      titulo: "Desarrollador Web",
      empresa: "Google",
      ubicacion: "Madrid",
      descripcion: "Desarrollador web con experiencia en javascript y react",
      data: {
        technology: ["javascript", "react"],
        modalidad: "remoto",
        nivel: "senior",
      },
    };

    const json = await handlePostRequestAndAssertStatus("/jobs", newJob, 201);

    assert.ok(json.id, "El job devuelto debe tener un id generado");
    assert.strictEqual(json.titulo, newJob.titulo, "El titulo debe coincidir");
    assert.strictEqual(
      json.empresa,
      newJob.empresa,
      "La empresa debe coincidir",
    );
    assert.strictEqual(
      json.ubicacion,
      newJob.ubicacion,
      "La ubicacion debe coincidir",
    );
    assert.strictEqual(
      json.descripcion,
      newJob.descripcion,
      "La descripcion debe coincidir",
    );
    assert.deepStrictEqual(json.data, newJob.data, "Los datos deben coincidir");
  });

  test("La petición es validada correctamente", async () => {
    const validBase = {
      empresa: "Google",
      ubicacion: "Madrid",
      data: { technology: ["javascript"] },
    };

    // 1. Titulo con menos de 3 caracteres
    await handlePostRequestAndAssertStatus("/jobs", { ...validBase, titulo: "ab" }, 400);

    // 2. Titulo con más de 100 caracteres
    await handlePostRequestAndAssertStatus("/jobs", { ...validBase, titulo: "a".repeat(101) }, 400);

    // 3. Sin campo titulo
    await handlePostRequestAndAssertStatus("/jobs", { ...validBase }, 400);

    // 4. Titulo que no sea string
    await handlePostRequestAndAssertStatus("/jobs", { ...validBase, titulo: 12345 }, 400);

    // 5. Sin descripcion (opcional)
    await handlePostRequestAndAssertStatus("/jobs", {
      ...validBase,
      titulo: "Desarrollador Web",
    }, 201);
  });
});

describe("GET /jobs/:id", () => {
  test("Debe devolver el trabajo con ID especificado", async () => {
    const jobId = "d35b2c89-5d60-4f26-b19a-6cfb2f1a0f57";
    
    const json = await handleGetRequestAndAssertStatus(`/jobs/${jobId}`, 200);
    assert.strictEqual(json.id, jobId);
  });

  test("Debe enviar 404 cuando el ID no existe", async () => {
    const jobId = "noexiste";
    await handleGetRequestAndAssertStatus(`/jobs/${jobId}`, 404);
  });
});

describe("PUT /jobs/:id", () => {
  test("Debe recibir 204 y actualizar el trabajo", async () => {
    const jobId = "7a4d1d8b-1e45-4d8c-9f1a-8c2f9a9121a4";
    const updatedJob = {
      titulo: "Desarrollador Full Stack",
      empresa: "Nueva Empresa S.A.",
      ubicacion: "Bogota",
      descripcion: "Descripción actualizada del trabajo",
      data: {
        technology: ["typescript", "vue", "postgres"],
        modalidad: "hibrido",
        nivel: "mid",
      },
    };

    await handlePutRequestAndAssertStatus(`/jobs/${jobId}`, updatedJob, 204);

    const json = await handleGetRequestAndAssertStatus(`/jobs/${jobId}`, 200);
    assert.strictEqual(json.titulo, updatedJob.titulo, "El titulo debe haberse actualizado");
    assert.strictEqual(json.empresa, updatedJob.empresa, "La empresa debe haberse actualizado");
    assert.strictEqual(json.ubicacion, updatedJob.ubicacion, "La ubicacion debe haberse actualizado");
    assert.strictEqual(json.descripcion, updatedJob.descripcion, "La descripcion debe haberse actualizado");
    assert.deepStrictEqual(json.data, updatedJob.data, "Los datos deben haberse actualizado");
  });

  test("Debe devolver 404 cuando el ID no existe", async () => {
    const jobId = "noexiste";
    await handlePutRequestAndAssertStatus(`/jobs/${jobId}`, {}, 404);
  })
});

describe("PATCH /jobs/:id", () => {
  test("Debe recibir 204 y actualizar solo los campos enviados", async () => {
    const jobId = "f62d8a34-923a-4ac2-9b0b-14e0ac2f5405";
    const partialUpdatedJob = {
      titulo: "Desarrollador Full Stack Actualizado",
      ubicacion: "Medellin",
    };

   await handlePatchRequestAndAssertStatus(`/jobs/${jobId}`, partialUpdatedJob, 204); 

   const json = await handleGetRequestAndAssertStatus(`/jobs/${jobId}`, 200);
   assert.strictEqual(json.titulo, partialUpdatedJob.titulo, "El titulo debe haberse actualizado");
   assert.strictEqual(json.ubicacion, partialUpdatedJob.ubicacion, "La ubicacion debe haberse actualizado");
  });

  test("Debe devolver 404 cuando el ID no existe", async () => {
    const jobId = "noexiste";
    await handlePatchRequestAndAssertStatus(`/jobs/${jobId}`, { titulo: "Titulo actualizado" }, 404);
  });
});

describe("DELETE /jobs/:id", () => {
  test("Debe recibir 204 y eliminar el trabajo", async () => {
    const jobId = "f62d8a34-923a-4ac2-9b0b-14e0ac2f5405";
    await handleDeleteRequestAndAssertStatus(`/jobs/${jobId}`, 204);
    
    await handleGetRequestAndAssertStatus(`/jobs/${jobId}`, 404);
  });

  test("Debe devolver 404 cuando el ID no existe", async () => {
    const jobId = "noexiste";
    await handleDeleteRequestAndAssertStatus(`/jobs/${jobId}`, 404);
  })
});
