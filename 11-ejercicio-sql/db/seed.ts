import crypto from 'node:crypto'
import jobs from '../jobs.json'
import { db } from './database'

db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    modality TEXT NOT NULL CHECK(modality IN ('remote', 'onsite', 'hybrid')),
    level TEXT NOT NULL CHECK(level IN ('junior', 'mid', 'senior'))
  );

  CREATE TABLE IF NOT EXISTS job_technologies (
    job_id TEXT NOT NULL,
    technology TEXT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS job_content (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT NOT NULL,
    requirements TEXT NOT NULL,
    about TEXT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );
`)

const insertJob = db.prepare(`
  INSERT INTO jobs (id, title, company, location, description, modality, level)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`)

const insertJobTechnology = db.prepare(`
  INSERT INTO job_technologies (job_id, technology)
  VALUES (?, ?)
`)

const insertJobContent = db.prepare(`
  INSERT INTO job_content (id, job_id, description, responsibilities, requirements, about)
  VALUES (?, ?, ?, ?, ?, ?)
`)

/* Con esto hacemos dos cosas: */
/* Usamos los datos que vienen de jobs.json para insertar los jobs en la base de datos */
/* Permitimos que se pueda correr varias veces el seed, sin tener errores */
const seed = db.transaction(() => {
  for (const job of jobs) {
    insertJob.run(job.id, job.title, job.company, job.location, job.description, job.modality, job.level)

    for (const technology of job.technologies) {
      insertJobTechnology.run(job.id, technology)
    }

    insertJobContent.run(
      crypto.randomUUID(),
      job.id,
      job.content.description,
      job.content.responsibilities,
      job.content.requirements,
      job.content.about
    )
  }
})

seed()

console.log('Database seeded successfully');