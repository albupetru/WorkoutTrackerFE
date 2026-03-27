import './style.scss';

interface PaginationProps {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalCount === 0 || pageNumber >= totalPages) {
    return null;
  }

  return (
    <div className="load-more-container">
      <button
        className="load-more-btn"
        onClick={() => onPageChange(pageNumber + 1)}
      >
        <span className="material-symbols-outlined">expand_more</span>
        Load More Entries
      </button>
    </div>
  );
};

export default Pagination;
