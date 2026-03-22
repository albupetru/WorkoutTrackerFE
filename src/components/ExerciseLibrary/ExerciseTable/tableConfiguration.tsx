import { ColumnDef } from "@tanstack/react-table";
import { Exercise } from "../../../types/exercise.types.tsx";
import NameCell from "../NameCell";

const tableConfiguration: ColumnDef<Exercise>[] = [
  {
    header: () => (
      <span className="th-inner">
        Movement Pattern
        <span className="material-symbols-outlined th-sort-icon">
          swap_vert
        </span>
      </span>
    ),
    accessorKey: "name",
    cell: ({ row }) => (
      <NameCell
        exerciseId={row.original.id}
        exerciseName={row.original.name}
        description={row.original.description}
      />
    ),
  },
  {
    header: () => (
      <span className="th-inner">
        Tags
        <span className="material-symbols-outlined th-sort-icon">
          swap_vert
        </span>
      </span>
    ),
    accessorKey: "tags",
    cell: ({ row }) => {
      const tags = row.original.tags || [];
      return (
        <div className="tags-cell">
          {tags.map((tag) => (
            <span key={tag.id} className="tag-chip">
              {tag.name}
            </span>
          ))}
        </div>
      );
    },
  },
];

export default tableConfiguration;
