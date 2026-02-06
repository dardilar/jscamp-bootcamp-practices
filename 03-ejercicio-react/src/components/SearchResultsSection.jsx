import { JobListing } from "./JobListing";
import { Pagination } from "./Pagination";

export function SearchResultsSection({ pageResults, currentPage, totalPages, onPageChange }) {
  return (
    <section>
      <h2 style={{ textAlign: "center" }}>Resultados de búsqueda</h2>

      <JobListing jobs={pageResults} />

      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </section>
  );
}
