import { JobListing } from "./JobListing";
import { Pagination } from "./Pagination";

import JobsData from "../data.json";

import { useState } from "react";

export function SearchResultsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const handlePageChange = function(page) {
    setCurrentPage(page);
  }

  return (
    <section>
      <h2 style={{ textAlign: "center" }}>Resultados de búsqueda</h2>

      <JobListing jobs={JobsData} />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </section>
  );
}
