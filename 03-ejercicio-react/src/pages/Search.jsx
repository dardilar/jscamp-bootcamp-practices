import { useState, useEffect } from "react";
import { SearchFormSection } from "../components/SearchFormSection";
import { SearchResultsSection } from "../components/SearchResultsSection";

import JobsData from "../data.json";

const RESULTS_PER_PAGE = 5;

export function SearchPage() {
  const [filters, setFilters] = useState({
    technology: "",
    location: "",
    experienceLevel: "",
  });
  const [textFilter, setTextFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const jobsFilterByFilters = JobsData.filter((job) => {
    return (filters.location === "" || job.data.modalidad.toLowerCase().includes(filters.location.toLowerCase())) &&
    (filters.experienceLevel === "" || job.data.nivel.toLowerCase().includes(filters.experienceLevel.toLowerCase())) &&
    (filters.technology === "" || job.data.technology.toLowerCase().includes(filters.technology.toLowerCase()))
  })

  const jobsWithFilterText =
    textFilter === ""
      ? jobsFilterByFilters
      : jobsFilterByFilters.filter((job) => {
          return job.titulo.toLowerCase().includes(textFilter.toLowerCase());
        });

  const totalPages = Math.ceil(jobsWithFilterText.length / RESULTS_PER_PAGE);

  const pageResults = jobsWithFilterText.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE,
  );

  const handlePageChange = function (page) {
    setCurrentPage(page);
  };

  const handleSearch = function (filters) {
    setCurrentPage(1);
    setFilters(filters);
  };

  const handleTextFilter = function (text) {
    setCurrentPage(1);
    setTextFilter(text);
  };

  return (
      <main>
        <SearchFormSection
          onSearch={handleSearch}
          onTextFilter={handleTextFilter}
        />
        <SearchResultsSection
          pageResults={pageResults}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
  );
}
