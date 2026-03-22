import { useState, useEffect } from "react";
import ExerciseTable from "./ExerciseTable";
import CategoryDropdown from "./CategoryDropdown";
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
  const [filters, setFilters] =
    useState<ExerciseFiltersType>(defaultFilterState);
  const [totalCount, setTotalCount] = useState(0);
  const [keywordInput, setKeywordInput] = useState("");

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

  const handleCategoryApply = (tagIds: string[]) => {
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
      <div className="library-top-bar">
        <span className="material-symbols-outlined search-icon">search</span>
        <input
          className="library-search-input"
          type="text"
          placeholder="Search movements..."
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
        />
      </div>

      <div className="library-content">
        <div className="controls-row">
          <CategoryDropdown
            selectedTagIds={filters.tagIds ?? []}
            onApply={handleCategoryApply}
          />
          <div className="controls-right">
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
            <span className="count-display">
              Displaying {displayedCount} of {totalCount} movements
            </span>
          </div>
        </div>

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
