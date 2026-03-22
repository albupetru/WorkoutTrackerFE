import Button from "../../Button";
import "./style.scss";

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
  const startItem = (pageNumber - 1) * pageSize + 1;
  const endItem = Math.min(pageNumber * pageSize, totalCount);

  if (totalCount === 0) {
    return null;
  }

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing {startItem} - {endItem} of {totalCount}
      </div>

      <div className="pagination-controls">
        <Button
          onClick={() => onPageChange(pageNumber - 1)}
          disabled={pageNumber === 1}
        >
          Previous
        </Button>

        <span className="pagination-current">
          Page {pageNumber} of {totalPages}
        </span>

        <Button
          onClick={() => onPageChange(pageNumber + 1)}
          disabled={pageNumber === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
