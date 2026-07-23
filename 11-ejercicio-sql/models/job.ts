import crypto from 'node:crypto'
import { db } from '../db/database'
import type { Job, JobData, CreateJobDTO, UpdateJobDTO, JobFilters } from '../types'

export class JobModel {
  // Obtener todos los jobs con filtros opcionales
  static async getAll(filters?: JobFilters): Promise<Job[]> {
    // TODO: Debemos hacer la consulta a la base de datos para obtener todos los resultados, y por cada filtro, debemos agregarlo a la consulta
    
    let query = `SELECT j.id, j.title, j.company, j.location, j.description, j.modality, j.level, GROUP_CONCAT(jt.technology) as technologies FROM jobs j LEFT JOIN job_technologies jt ON j.id = jt.job_id`

    const conditions: string[] = []
    const params: unknown[] = []

    if(filters?.modality) {
      conditions.push('j.modality = ?')
      params.push(filters.modality)
    }

    if(filters?.level) {
      conditions.push('j.level = ?')
      params.push(filters.level)
    }

    if(filters?.tech) {
      conditions.push('j.id IN (SELECT job_id FROM job_technologies WHERE technology = ? COLLATE NOCASE)')
      params.push(filters.tech)
    }

    if(conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`
    }

    query += ' GROUP BY j.id'

    const rows = db.prepare(query).all(...params) as Array<{
      id: string
      title: string
      company: string
      location: string
      description: string
      modality: JobData['modality']
      level: JobData['level']
      technologies: string | null
    }>

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      company: row.company,
      location: row.location,
      description: row.description,
      data: {
        technology: row.technologies?.split(',') || [],
        modality: row.modality,
        level: row.level
      }
    }))
  }

  // Obtener un job por ID
  static async getById(id: string): Promise<Job | undefined> {
    // TODO: Debemos hacer la consulta a la base de datos para obtener el job por ID
    const query = `SELECT j.id, j.title, j.company, j.location, j.description, j.modality, j.level, GROUP_CONCAT(jt.technology) as technologies FROM jobs j LEFT JOIN job_technologies jt ON j.id = jt.job_id WHERE j.id = ? GROUP BY j.id`

    const row = db.prepare(query).get(id) as {
      id: string
      title: string
      company: string
      location: string
      description: string
      modality: JobData['modality']
      level: JobData['level']
      technologies: string | null
    }

    if(!row) return undefined

    return {
      id: row.id,
      title: row.title,
      company: row.company,
      location: row.location,
      description: row.description,
      data: {
        technology: row.technologies?.split(',') || [],
        modality: row.modality,
        level: row.level
      }
    }
  }

  // Crear un nuevo job
  static async create(input: CreateJobDTO): Promise<Job> {
    const newJob: Job = {
      id: crypto.randomUUID(),
      ...input,
    }

    // TODO: Debemos insertar el job en la base de datos
    const insertJob = db.prepare(`INSERT INTO jobs (id, title, company, location, description, modality, level) VALUES (?, ?, ?, ?, ?, ?, ?)`)

    const insertTech = db.prepare(`INSERT INTO job_technologies (job_id, technology) VALUES (?, ?)`)

    const transaction = db.transaction(() => {
      insertJob.run(newJob.id, newJob.title, newJob.company, newJob.location, newJob.description, newJob.data.modality, newJob.data.level)

      newJob.data.technology.forEach(tech => {
        insertTech.run(newJob.id, tech)
      })
    })

    transaction()

    return newJob
  }

  // Eliminar un job
  static async delete(id: string): Promise<boolean> {
    // TODO: Debemos eliminar el job de la base de datos
    const query = `DELETE FROM jobs WHERE id = ?`
    const result = db.prepare(query).run(id)

    return result.changes > 0
  }

  // Actualizar un job
  static async update(id: string, input: UpdateJobDTO): Promise<Job | null> {
    const existing = await JobModel.getById(id)
    if (!existing) return null

    const fields: string[] = []
    const params: unknown[] = []

    if (input.title !== undefined) {
      fields.push('title = ?')
      params.push(input.title)
    }
    if (input.company !== undefined) {
      fields.push('company = ?')
      params.push(input.company)
    }
    if (input.location !== undefined) {
      fields.push('location = ?')
      params.push(input.location)
    }
    if (input.description !== undefined) {
      fields.push('description = ?')
      params.push(input.description)
    }
    if (input.data?.modality !== undefined) {
      fields.push('modality = ?')
      params.push(input.data.modality)
    }
    if (input.data?.level !== undefined) {
      fields.push('level = ?')
      params.push(input.data.level)
    }

    const insertTech = db.prepare(`INSERT INTO job_technologies (job_id, technology) VALUES (?, ?)`)
    const deleteTech = db.prepare(`DELETE FROM job_technologies WHERE job_id = ?`)

    const transaction = db.transaction(() => {
      if (fields.length > 0) {
        db.prepare(`UPDATE jobs SET ${fields.join(', ')} WHERE id = ?`).run(...params, id)
      }

      if (input.data?.technology !== undefined) {
        deleteTech.run(id)
        input.data.technology.forEach((tech) => {
          insertTech.run(id, tech)
        })
      }
    })

    transaction()

    return (await JobModel.getById(id)) ?? null
  }
}
