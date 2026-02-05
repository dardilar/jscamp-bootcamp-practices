
import { JobCard } from "./JobCard";

export function JobListing({ jobs }) {
  return (
    <div className="jobs-listings">
      {jobs.length === 0 && (
        <p style={{ textAlign: "center", padding: "2rem" }}>
          No se han encontrado empleos que coincidan con los criterios de
          búsqueda
        </p>
      )}

      {jobs.map((job) => {
        return <JobCard key={job.id} job={job} />;
      })}
    </div>
  );
}
