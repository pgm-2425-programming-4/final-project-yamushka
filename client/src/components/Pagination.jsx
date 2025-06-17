export default function Pagination({ currentPage, totalItems, itemsPerPage = 10, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <div className="pagination-info">
        {totalItems === 1
          ? `${totalItems} item`
          : `Weergeven ${startItem}-${endItem} van ${totalItems} items`}
      </div>

      <div className="pagination-controls">
        <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
          Vorige
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            className={currentPage === page ? 'active' : ''}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
          Volgende
        </button>
      </div>
    </div>
  );
}
