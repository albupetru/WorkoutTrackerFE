import { useState } from "react";
import ExerciseTable from "./ExerciseTable/exerciseTable";
import { ExerciseTableFilters } from "../../types/exerciseTableFilters.type";

const defaultFilterState: ExerciseTableFilters = {
  searchText: "",
  selectedTags: [],
};

const ExerciseLibrary = () => {
  const [filterState, setFilterState] =
    useState<ExerciseTableFilters>(defaultFilterState);

  return (
    <>
      <ExerciseTable filterState={filterState} />
    </>
  );
};

export default ExerciseLibrary;
