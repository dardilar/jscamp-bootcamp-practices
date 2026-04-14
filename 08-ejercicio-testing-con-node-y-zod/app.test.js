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

describe("GET /jobs", () => {
  test("Debe responder con 200 y un array de trabajos", async () => {
    const response = await fetch(`${BASE_URL}/jobs`);
    assert.strictEqual(response.status, 200);

    const json = await response.json();
    assert.ok(Array.isArray(json.data), "La respuesta debe ser un array");
  });

  test("Debe filtrar jobs por tecnologia", async () => {
    const tech = "react";
    const response = await fetch(`${BASE_URL}/jobs?technology=${tech}`);
    assert.strictEqual(response.status, 200);

    const json = await response.json();
    assert.ok(
      json.data.every((job) => job.data.technology.includes(tech)),
      "Todos los trabajos deben incluir la tecnologia",
    );
  });

  test("Debe respetar el límite de resultados", async () => {
    const response = await fetch(`${BASE_URL}/jobs?limit=2`);
    assert.strictEqual(response.status, 200);

    const json = await response.json();
    assert.strictEqual(json.limit, 2, "El límite debe ser el especificado");
    assert.strictEqual(
      json.data.length,
      2,
      "La cantidad de trabajos debe ser el especificado",
    );
  });

  test("Debe aplicar offset correctamente", async () => {
    const response = await fetch(`${BASE_URL}/jobs?offset=1`);
    assert.strictEqual(response.status, 200);

    const json = await response.json();
    assert.strictEqual(json.offset, 1, "El offset debe ser el especificado");
    assert.ok(
      json.data[0].id === "d35b2c89-5d60-4f26-b19a-6cfb2f1a0f57",
      "El primer trabajo debe ser el segundo de la lista",
    );
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

    const response = await fetch(`${BASE_URL}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newJob),
    });

    assert.strictEqual(response.status, 201, "El status debe ser 201");

    const json = await response.json();
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

    const post = (body) =>
      fetch(`${BASE_URL}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

    const shortTitulo = await post({ ...validBase, titulo: "ab" });
    assert.strictEqual(
      shortTitulo.status,
      400,
      "Titulo con menos de 3 caracteres debe devolver 400",
    );

    const longTitulo = await post({ ...validBase, titulo: "a".repeat(101) });
    assert.strictEqual(
      longTitulo.status,
      400,
      "Titulo con más de 100 caracteres debe devolver 400",
    );

    const noTitulo = await post({ ...validBase });
    assert.strictEqual(
      noTitulo.status,
      400,
      "Sin campo titulo debe devolver 400",
    );

    const numberTitulo = await post({ ...validBase, titulo: 12345 });
    assert.strictEqual(
      numberTitulo.status,
      400,
      "Titulo que no sea string debe devolver 400",
    );

    const noDescripcion = await post({
      ...validBase,
      titulo: "Desarrollador Web",
    });
    assert.strictEqual(
      noDescripcion.status,
      201,
      "Sin descripcion (opcional) debe devolver 201",
    );
  });
});

describe("GET /jobs/:id", () => {
  test("Debe devolver el trabajo con ID especificado", async () => {
    const jobId = "d35b2c89-5d60-4f26-b19a-6cfb2f1a0f57";
    const response = await fetch(`${BASE_URL}/jobs/${jobId}`);
    assert.strictEqual(response.status, 200);

    const json = await response.json();
    assert.strictEqual(json.id, jobId);
  });

  test("Debe enviar 404 cuando el ID no existe", async () => {
    const jobId = "noexiste";
    const response = await fetch(`${BASE_URL}/jobs/${jobId}`);
    assert.strictEqual(response.status, 404);
    
    const json = await response.json();
    assert.ok(json.error);
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

    const putResponse = await fetch(`${BASE_URL}/jobs/${jobId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedJob),
    });
    assert.strictEqual(putResponse.status, 204, "El status debe ser 204");

    const getResponse = await fetch(`${BASE_URL}/jobs/${jobId}`);
    assert.strictEqual(getResponse.status, 200);

    const json = await getResponse.json();
    assert.strictEqual(json.titulo, updatedJob.titulo, "El titulo debe haberse actualizado");
    assert.strictEqual(json.empresa, updatedJob.empresa, "La empresa debe haberse actualizado");
    assert.strictEqual(json.ubicacion, updatedJob.ubicacion, "La ubicacion debe haberse actualizado");
    assert.strictEqual(json.descripcion, updatedJob.descripcion, "La descripcion debe haberse actualizado");
    assert.deepStrictEqual(json.data, updatedJob.data, "Los datos deben haberse actualizado");
  });

  test("Debe devolver 404 cuando el ID no existe", async () => {
    const jobId = "noexiste";
    const response = await fetch(`${BASE_URL}/jobs/${jobId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });

    assert.strictEqual(response.status, 404);

  })
});

describe("PATCH /jobs/:id", () => {
  test("Debe recibir 204 y actualizar solo los campos enviados", async () => {
    const jobId = "f62d8a34-923a-4ac2-9b0b-14e0ac2f5405";
    const partialUpdatedJob = {
      titulo: "Desarrollador Full Stack Actualizado",
      ubicacion: "Medellin",
    };

    const putResponse = await fetch(`${BASE_URL}/jobs/${jobId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partialUpdatedJob),
    });

    assert.strictEqual(putResponse.status, 204, "El status debe ser 204");

    const getResponse = await fetch(`${BASE_URL}/jobs/${jobId}`);
    assert.strictEqual(getResponse.status, 200);

    const json = await getResponse.json();
    assert.strictEqual(json.titulo, partialUpdatedJob.titulo, "El titulo debe haberse actualizado");
    assert.strictEqual(json.ubicacion, partialUpdatedJob.ubicacion, "La ubicacion debe haberse actualizado");
  });

  test("Debe devolver 404 cuando el ID no existe", async () => {
    const jobId = "noexiste";
    const response = await fetch(`${BASE_URL}/jobs/${jobId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo: "Titulo actualizado" }),
    });

    assert.strictEqual(response.status, 404);
  });
});

describe("DELETE /jobs/:id", () => {
  test("Debe recibir 204 y eliminar el trabajo", async () => {
    const jobId = "f62d8a34-923a-4ac2-9b0b-14e0ac2f5405";
    const deleteResponse = await fetch(`${BASE_URL}/jobs/${jobId}`, {
      method: "DELETE",
    });
    
    assert.strictEqual(deleteResponse.status, 204);
    
    const getResponse = await fetch(`${BASE_URL}/jobs/${jobId}`);
    assert.strictEqual(getResponse.status, 404);
  });

  test("Debe devolver 404 cuando el ID no existe", async () => {
    const jobId = "noexiste";
    const response = await fetch(`${BASE_URL}/jobs/${jobId}`, {
      method: "DELETE",
    });

    assert.strictEqual(response.status, 404);
  })
});
