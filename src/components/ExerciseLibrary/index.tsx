import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExerciseTable from "./ExerciseTable/exerciseTable";
import ExerciseFilters from "./ExerciseFilters/ExerciseFilters";
import Button from "../Button";
import { ExerciseFilters as ExerciseFiltersType } from "../../types/exercise.types";
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
  const navigate = useNavigate();
  const [filters, setFilters] =
    useState<ExerciseFiltersType>(defaultFilterState);

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, pageNumber: newPage });
  };

  return (
    <div className="exercise-library">
      <div className="library-header">
        <h1>Exercise Library</h1>
        <Button onClick={() => navigate("/exercise/new")}>
          ➕ Add Exercise
        </Button>
      </div>

      <ExerciseFilters filters={filters} onFiltersChange={setFilters} />

      <ExerciseTable filters={filters} onPageChange={handlePageChange} />
    </div>
  );
};

export default ExerciseLibrary;
