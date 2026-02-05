export function Pagination({ currentPage = 1, totalPages = 5, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const styleFirstPage = isFirstPage ? { opacity: 0.5, pointerEvents: "none" } : {};
  const styleLastPage = isLastPage ? { opacity: 0.5, pointerEvents: "none" } : {};

  const handlePrevClick = function(e) {
    e.preventDefault();

    if (isFirstPage) return;
    onPageChange(currentPage - 1);
  }

  const handleNextClick = function(e) {
    e.preventDefault();

    if (isLastPage) return;
    onPageChange(currentPage + 1);
  }

  const handlePageClick = function(e, page) {
    e.preventDefault();

    if (page !== currentPage) {
      onPageChange(page);
    }
  }

  return (
    <nav className="pagination">
      <a href="#" style={styleFirstPage} onClick={handlePrevClick}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M15 6l-6 6l6 6" />
        </svg>
      </a>

      {pages.map((page) => (
        <a key={page} data-page={page} href="#" className={page === currentPage ? "isActive" : ""} onClick={(e) => handlePageClick(e, page)}>
          {page}
        </a>
      ))}

      <a href="#" style={styleLastPage} onClick={handleNextClick}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M9 6l6 6l-6 6" />
        </svg>
      </a>
    </nav>
  );
}
