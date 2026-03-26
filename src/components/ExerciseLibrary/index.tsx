import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExerciseTable from "./ExerciseTable";
import FilterBar from "../FilterBar";
import { ExerciseFilters as ExerciseFiltersType } from "../../types/exercise.types.tsx";
import useAuth from "../authentication/useAuth";
import "./style.scss";

const defaultFilterState: ExerciseFiltersType = {
  keyword: "",
  tagIds: [],
  includeUnverified: false,
  pageNumber: 1,
  pageSize: 20,
  sortBy: "name",
  sortOrder: "asc",
};

const ExerciseLibrary = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] =
    useState<ExerciseFiltersType>(defaultFilterState);
  const [totalCount, setTotalCount] = useState(0);
  const [keywordInput, setKeywordInput] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const hasFilters = (filters.tagIds?.length ?? 0) > 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (keywordInput !== filters.keyword) {
        setFilters((f) => ({ ...f, keyword: keywordInput, pageNumber: 1 }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [keywordInput]);

  const handlePageChange = (newPage: number) => {
    setFilters((f) => ({ ...f, pageNumber: newPage }));
  };

  const handleSortChange = (column: string) => {
    setFilters((f) => ({
      ...f,
      sortBy: column,
      sortOrder: f.sortBy === column && f.sortOrder === "asc" ? "desc" : "asc",
      pageNumber: 1,
    }));
  };

  const handleTagChange = (tagIds: string[]) => {
    setFilters((f) => ({ ...f, tagIds, pageNumber: 1 }));
  };

  const handleIncludeUnverifiedChange = (checked: boolean) => {
    setFilters((f) => ({ ...f, includeUnverified: checked, pageNumber: 1 }));
  };

  const displayedCount = Math.min(
    (filters.pageNumber ?? 1) * (filters.pageSize ?? 20),
    totalCount,
  );

  return (
    <div>
      <div className="library-header">
        <div className="library-top-bar">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            className="library-search-input"
            type="text"
            placeholder="Search movements..."
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
          />
          <button
            type="button"
            className={`library-filter-btn${
              filtersOpen
                ? " library-filter-btn--open"
                : hasFilters
                  ? " library-filter-btn--active"
                  : ""
            }`}
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <span className="material-symbols-outlined">tune</span>
            Filters
            {!filtersOpen && hasFilters && (
              <span className="library-filter-badge">
                {filters.tagIds?.length}
              </span>
            )}
          </button>
          {isAdmin && (
            <label className="unverified-toggle">
              <input
                type="checkbox"
                checked={filters.includeUnverified ?? false}
                onChange={(e) =>
                  handleIncludeUnverifiedChange(e.target.checked)
                }
              />
              Show unverified
            </label>
          )}
          <span className="count-display top-bar-count">
            Displaying {displayedCount} of {totalCount} movements
          </span>
          <button
            className="library-add-btn"
            onClick={() => navigate("/exercise/new")}
          >
            <span className="material-symbols-outlined">add</span>
            Add New
          </button>
        </div>

        {filtersOpen && (
          <div className="library-filter-row">
            <FilterBar
              selectedTagIds={filters.tagIds ?? []}
              onChange={handleTagChange}
            />
            {hasFilters && (
              <button
                type="button"
                className="library-filter-clear-all"
                onClick={() => handleTagChange([])}
              >
                <span className="material-symbols-outlined">close</span>
                Clear all
              </button>
            )}
          </div>
        )}
      </div>

      <div
        className={`library-content${filtersOpen ? " library-content--filters-open" : ""}`}
      >
        <ExerciseTable
          filters={filters}
          onPageChange={handlePageChange}
          onTotalCountChange={setTotalCount}
          onSortChange={handleSortChange}
        />
      </div>
    </div>
  );
};

export default ExerciseLibrary;
