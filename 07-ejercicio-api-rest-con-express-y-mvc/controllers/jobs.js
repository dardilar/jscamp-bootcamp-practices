/* Aquí debe ir la lógica de tu controlador */
import { JobModel } from '../models/jobs.js';
import { DEFAULTS } from '../config.js';

export class JobController {
    static async getAll(req, res) {
        const { text, title, level, limit = DEFAULTS.LIMIT_PAGINATION, technology, offset = DEFAULTS.LIMIT_OFFSET } = req.query

        const paginatedJobs = await JobModel.getAll({ text, title, level, limit, technology, offset })
        res.json(paginatedJobs)
    }

    static async getById(req, res) {
        const { id } = req.params;
        
        const job = await JobModel.getById(id);

        if (!job) {
        return res.status(404).json({ error: "Job not found" });
        }

        return res.json(job);
    }

    static async create(req, res) {
        const job = await JobModel.create(req.body)
        res.json(job)
    }

    static async update(req, res) {
        const { id } = req.params
        const job = await JobModel.update({ id, data: req.body })
        res.json(job)
    }

    static async partialUpdate(req, res) {
        const { id } = req.params
        const job = await JobModel.partialUpdate({ id, data: req.body })
        res.json(job)
    }

    static async delete(req, res) {
        const { id } = req.params
        const job = await JobModel.delete({ id })
        res.json(job)
    }
}
