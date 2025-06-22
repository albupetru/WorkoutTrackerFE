import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import tableConfiguration from "../tableConfiguration";
import { authenticatedFetch } from "../../../utils/requestUtils";
import { ExerciseTableFilters } from "../../../types/exerciseTableFilters.type";
import "./style.scss";

const ExerciseTable = (filterState: ExerciseTableFilters) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const { searchText } = filterState;
    authenticatedFetch(`https://localhost:7164/exercise?search=${searchText}`)
      .then((response) => response.json())
      .then(({ results }) => {
        setData(results);
      });
  }, []);

  const { getHeaderGroups, getRowModel } = useReactTable({
    data,
    columns: tableConfiguration,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="exercise-table">
      <thead>
        {getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th id={header.id}>
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
