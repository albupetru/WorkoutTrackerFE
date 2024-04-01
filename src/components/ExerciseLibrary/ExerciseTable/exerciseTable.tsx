import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import tableConfiguration from '../tableConfiguration';
import './style.scss';

const defaultData = [
  {
    name: 'Bench Press',
    repetitions: 10,
    sets: 3,
  },
  {
    name: 'Squats',
    repetitions: 15,
    sets: 3,
  },
  {
    name: 'Deadlifts',
    repetitions: 8,
    sets: 3,
  },
];

const ExerciseTable = () => {
  const [data, setData] = useState(defaultData);

  //   // If defining columns inside a component, you should still try to give the column definitions a stable identity.
  //   // This will help with performance and prevent unnecessary re-renders.
  //   const columns = useMemo(
  //     () => [
  //       {
  //         header: "Exercise Name",
  //         accessorKey: "name",
  //       },
  //       {
  //         header: "Repetitions",
  //         accessorKey: "repetitions",
  //       },
  //       {
  //         header: "Sets",
  //         accessorKey: "sets",
  //       },
  //     ],
  //     [],
  //   );

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
