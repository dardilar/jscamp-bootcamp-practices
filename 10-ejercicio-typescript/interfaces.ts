/* En este archivo deberás tipar las interfaces de los servicios de búsqueda y aplicación a empleo */
import { ApplicationStatus } from './types.ts'
import { Job } from './objects.ts'
import { filterByExperience, filterByMinSalary, filterByTechnology, searchJobs } from './functions.ts'

// Interface para servicios de búsqueda
export interface JobSearchService {
  /* Deberás definir los tipos de las funciones */
  searchJobs: typeof searchJobs,
  filterByExperience: typeof filterByExperience,
  filterByMinSalary: typeof filterByMinSalary,
  filterByTechnology: typeof filterByTechnology,
}

export const searchService: JobSearchService = {
  searchJobs,
  filterByExperience,
  filterByMinSalary,
  filterByTechnology,
}

// Interface para aplicación a empleo
export interface JobApplication {
  id: string,
  jobId: string,
  candidateId: string,
  status: ApplicationStatus,
  appliedDate: Date,
  coverLetter?: string
}

// Interface que extiende Job con propiedades adicionales
export interface DetailedJob extends Job {
  benefits: string[],
  requirements: string[],
  applicationDeadline?: Date
}
