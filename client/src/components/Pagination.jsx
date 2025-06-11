import React from 'react';
import '../styles/pagination.css';

export default function Pagination({ currentPage, totalItems, itemsPerPage = 10, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null; // Don't show pagination if only one page

  // Calculate page numbers to show
  const pageNumbers = [];
  const maxPagesToShow = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = startPage + maxPagesToShow - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} -
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
        >
          &laquo; First
        </button>

        <button
          className="pagination-button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          &lt; Previous
        </button>

        {pageNumbers.map(number => (
          <button
            key={number}
            className={`pagination-button ${currentPage === number ? 'active' : ''}`}
            onClick={() => onPageChange(number)}
          >
            {number}
          </button>
        ))}

        <button
          className="pagination-button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next &gt;
        </button>

        <button
          className="pagination-button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          Last &raquo;
        </button>
      </div>
    </div>
  );
}
