import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useEffect, useMemo } from "react";
import tableConfiguration from "./tableConfiguration";
import { useExercises } from "../../../api/exercises";
import { ExerciseFilters } from "../../../types/exercise.types.tsx";
import Pagination from "../Pagination";
import "./style.scss";

interface ExerciseTableProps {
  filters: ExerciseFilters;
  onPageChange: (page: number) => void;
  onTotalCountChange: (count: number) => void;
  onSortChange: (column: string) => void;
}

const ExerciseTable = ({
  filters,
  onPageChange,
  onTotalCountChange,
  onSortChange,
}: ExerciseTableProps) => {
  const { data, isLoading, isError, error, refetch } = useExercises(filters);

  const exercises = data?.exercises || [];
  const totalCount = data?.totalCount || 0;
  const pageNumber = data?.pageNumber || 1;
  const pageSize = data?.pageSize || 20;

  useEffect(() => {
    onTotalCountChange(totalCount);
  }, [totalCount]);

  const columns = useMemo(
    () =>
      tableConfiguration({
        sortBy: filters.sortBy ?? "name",
        sortOrder: filters.sortOrder ?? "asc",
        onSortChange,
      }),
    [filters.sortBy, filters.sortOrder, onSortChange],
  );

  const { getHeaderGroups, getRowModel } = useReactTable({
    data: exercises,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="exercise-table-loading">
        <span className="material-symbols-outlined">hourglass_empty</span>
        <p>Loading exercises...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="exercise-table-error">
        <p>Error loading exercises: {error?.message || "Unknown error"}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="exercise-table-empty">
        <span className="material-symbols-outlined">search_off</span>
        <p>No exercises found</p>
        <p className="subtitle">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <>
      <div className="exercise-list-container">
        <table className="exercise-table">
          <thead>
            {getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default ExerciseTable;
