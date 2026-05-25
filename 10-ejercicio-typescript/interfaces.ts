/* En este archivo deberás tipar las interfaces de los servicios de búsqueda y aplicación a empleo */
import { ApplicationStatus, ExperienceLevel, Technology } from './types.ts'
import { Job } from './objects.ts'
import { filterByExperience, filterByMinSalary, filterByTechnology, searchJobs } from './functions.ts'

// Interface para servicios de búsqueda
export interface JobSearchServiceError {
  /* Deberás definir los tipos de las funciones */
  searchJobs: typeof searchJobs, // <- No es buena práctica tipar una prop por medio de una función, se suele hacer lo inverso: Tipamos la función por el type
  filterByExperience: typeof filterByExperience,
  filterByMinSalary: typeof filterByMinSalary,
  filterByTechnology: typeof filterByTechnology,
}

export interface JobSearchService {
  searchJob: (jobs: Job[], searchTerm: string) => Job[]
  filterByExperience: (jobs: Job[], level: ExperienceLevel) => Job[]
  filterByMinSalary: (jobs: Job[], minSalary: number) => Job[]
  filterByTechnology: (jobs: Job[], tech: Technology) => Job[]
}

export const searchService: JobSearchService = {
  searchJob: searchJobs,
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
