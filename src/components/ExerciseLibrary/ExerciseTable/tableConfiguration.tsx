import { ColumnDef } from "@tanstack/react-table";
import { Exercise } from "../../../types/exercise.types";
import StatusBadge from "../StatusBadge/StatusBadge";
import ActionButtons from "../ActionButtons/ActionButtons";
import NameCell from "../NameCell/NameCell";

const tableConfiguration: ColumnDef<Exercise>[] = [
  {
    header: "Exercise Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <NameCell exerciseId={row.original.id} exerciseName={row.original.name} />
    ),
  },
  {
    header: "Tags",
    accessorKey: "tags",
    cell: ({ row }) => {
      const tags = row.original.tags || [];
      const visibleTags = tags.slice(0, 3);
      const remainingCount = tags.length - 3;

      return (
        <div className="tags-cell">
          {visibleTags.map((tag) => (
            <span key={tag.id} className="tag-chip">
              {tag.name}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="tag-more">+{remainingCount} more</span>
          )}
        </div>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "verifiedOn",
    cell: ({ row }) => <StatusBadge exercise={row.original} />,
  },
  {
    header: "Submitted By",
    accessorKey: "createdByName",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <ActionButtons exercise={row.original} />,
  },
];

export default tableConfiguration;
