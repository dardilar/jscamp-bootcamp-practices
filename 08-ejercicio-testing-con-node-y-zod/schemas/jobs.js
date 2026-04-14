/*
 * Aquí debes crear el schema de validación con Zod para los jobs
 *
 * Recuerda:
 * - Importar zod
 * - Crear un schema que valide la estructura de un job
 * - Exportar funciones validateJob() y validatePartialJob()
 * - Usar safeParse() para validar sin lanzar excepciones
 * - Definir reglas de validación (min, max, required, optional, etc.)
 */
import * as z from 'zod'

const jobSchema = z.object({
    titulo: z.string().min(3, 'El titulo debe tener al menos 3 caracteres').max(100, 'El titulo no puede tener más de 100 caracteres'),
    empresa: z.string(),
    ubicacion: z.string(),
    descripcion: z.string().optional(),
    data: z.object({
        technology: z.array(z.string()),
        modalidad: z.string().optional(),
        nivel: z.string().optional()
    }),
    content: z.object({
        description: z.string(),
        responsibilities: z.string(),
        requirements: z.string(),
        about: z.string()
    }).optional()
});

export const validateJob = (input) => {
    return jobSchema.safeParse(input);
};

export const validatePartialJob = (input) => {
    return jobSchema.partial().safeParse(input);
};
