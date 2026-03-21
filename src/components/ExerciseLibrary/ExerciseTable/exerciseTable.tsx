import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import tableConfiguration from "../tableConfiguration";
import { useExercises } from "../../../hooks/useExercises";
import { ExerciseTableFilters } from "../../../types/exerciseTableFilters.type";
import "./style.scss";

const ExerciseTable = ({
  filterState,
}: {
  filterState: ExerciseTableFilters;
}) => {
  const { data, isLoading, isError, error } = useExercises({
    search: filterState.searchText,
    tags: filterState.selectedTags,
  });

  const exercises = data?.results || [];

  const { getHeaderGroups, getRowModel } = useReactTable({
    data: exercises,
    columns: tableConfiguration,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="exercise-table-loading">
        <p>Loading exercises...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="exercise-table-error">
        <p>Error loading exercises: {error.message}</p>
      </div>
    );
  }

  return (
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
  );
};
export default ExerciseTable;
