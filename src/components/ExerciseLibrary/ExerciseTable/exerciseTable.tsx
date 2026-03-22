import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import tableConfiguration from "./tableConfiguration";
import { useExercises } from "../../../api/exercises";
import { ExerciseFilters } from "../../../types/exercise.types";
import Pagination from "../Pagination/Pagination";
import "./style.scss";

interface ExerciseTableProps {
  filters: ExerciseFilters;
  onPageChange: (page: number) => void;
}

const ExerciseTable = ({ filters, onPageChange }: ExerciseTableProps) => {
  const { data, isLoading, isError, error, refetch } = useExercises(filters);

  const exercises = data?.exercises || [];
  const totalCount = data?.totalCount || 0;
  const pageNumber = data?.pageNumber || 1;
  const pageSize = data?.pageSize || 20;

  const { getHeaderGroups, getRowModel } = useReactTable({
    data: exercises,
    columns: tableConfiguration,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="exercise-table-loading">
        <div className="spinner">⌛</div>
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
        <p>No exercises found</p>
        <p className="subtitle">
          Try adjusting your filters or add a new exercise
        </p>
      </div>
    );
  }

  return (
    <div className="exercise-table-container">
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
          {getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <Pagination
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ExerciseTable;
