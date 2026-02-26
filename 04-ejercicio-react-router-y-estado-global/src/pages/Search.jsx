import { Pagination } from "../components/Pagination.jsx";
import { SearchFormSection } from "../components/SearchFormSection.jsx";
import { JobListings } from "../components/JobListings.jsx";

import { useFilters } from "../hooks/useFilters.jsx";

export default function SearchPage() {
  // useFilters Hook
  const {
    loading,
    currentPage,
    jobs,
    total,
    totalPages,
    handlePageChange,
    handleSearch,
    handleTextFilter,
    filters,
    textToFilter
  } = useFilters();

  const title = loading ? "Cargando empleos..." : `Results: ${total}, Page: ${currentPage}`;

  // Render
  return (
    <main>
      <title>{title}</title>
      <SearchFormSection
        onSearch={handleSearch}
        onTextFilter={handleTextFilter}
        filters={filters}
        initialText={textToFilter}
      />

      <section className="listing-container">
        
        <h2>Resultados de búsqueda</h2>

        {loading ? (
          <p>Cargando empleos...</p>
        ) : (
          <JobListings jobs={jobs} />
        )}
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </section>
    </main>
  );
}
