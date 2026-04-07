import jobs from '../jobs.json' with { type: 'json' };
import { DEFAULTS } from '../config.js';
import crypto from 'node:crypto';

/* Aquí deberá ir la lógica de tu modelo */
/* Recuerda que el modelo SOLO debe manejar la lógica de los datos, en este caso nuestro JSON */
export class JobModel {
    static async getAll({ text, title, level, limit = DEFAULTS.LIMIT_PAGINATION, technology, offset = DEFAULTS.LIMIT_OFFSET }) {
        let filteredJobs = jobs;

        const limitNumber = Number(limit);
        const offsetNumber = Number(offset);

        if(text) {
            const searchTerm = text.toLowerCase();

            filteredJobs = filteredJobs.filter(job => 
                job.titulo.toLowerCase().includes(searchTerm) ||
                job.descripcion.toLowerCase().includes(searchTerm)
            );
        }

        if(title) {
            const searchTitle = title.toLowerCase();

            filteredJobs = filteredJobs.filter(job => 
                job.titulo.toLowerCase().includes(searchTitle)
            );
        }

        if(level) {
            const searchLevel = level.toLowerCase();

            filteredJobs = filteredJobs.filter(job => 
                job.data.nivel.toLowerCase().includes(searchLevel)
            );
        }

        if(technology) {
            const searchTechnology = technology.toLowerCase();

            filteredJobs = filteredJobs.filter(job => 
                job.data.technology.includes(searchTechnology)
            );
        }

        const paginatedJobs = filteredJobs.slice(offsetNumber, offsetNumber + limitNumber);

        return {
            data: paginatedJobs,
            limit: limitNumber,
            offset: offsetNumber,
            total: filteredJobs.length
        };
    }

    static async getById(id) {
        const job = jobs.find(job => job.id === id);
        return job;
    }

    static async create({ titulo, empresa, ubicacion, descripcion, data, content }) {
        const newJob = {
            id: crypto.randomUUID(),
            titulo,
            empresa,
            ubicacion,
            descripcion,
            data,
            content, 
        }
        
        jobs.push(newJob)
        return newJob
    }

    static async update({ id, data }) {
        const jobIndex = jobs.findIndex(job => job.id === id)
        
        if(jobIndex === -1) {
            return null
        }

        const { titulo, empresa, ubicacion, descripcion, data: jobData, content } = data

        jobs[jobIndex] = {
            ...jobs[jobIndex],
            titulo,
            empresa,
            ubicacion,
            descripcion,
            data: jobData,
            content,
        }

        return jobs[jobIndex]
    }

    static async partialUpdate({ id, data }) {
        const jobIndex = jobs.findIndex(job => job.id === id)
        
        if(jobIndex === -1) {
            return null
        }

        jobs[jobIndex] = {
            ...jobs[jobIndex],
            ...Object.fromEntries(
                Object.entries(data)
                    .filter(([_, value]) => value !== undefined)
            )
        }

        return jobs[jobIndex]
    }

    static async delete({ id }) {
        const jobIndex = jobs.findIndex(job => job.id === id)
        
        if(jobIndex === -1) {
            return null
        }

        jobs.splice(jobIndex, 1)
        return true
    }
}
