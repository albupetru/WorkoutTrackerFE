import { ColumnDef } from '@tanstack/react-table';
import { Exercise } from '../../../types/exercise.types.tsx';
import NameCell from '../NameCell';

interface SortConfig {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (column: string) => void;
}

const SortIcon = ({
  column,
  sortBy,
  sortOrder,
}: {
  column: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}) => {
  if (sortBy !== column) {
    return (
      <span className="material-symbols-outlined th-sort-icon">swap_vert</span>
    );
  }
  return (
    <span className="material-symbols-outlined th-sort-icon active">
      {sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
    </span>
  );
};

const tableConfiguration = ({
  sortBy,
  sortOrder,
  onSortChange,
}: SortConfig): ColumnDef<Exercise>[] => [
  {
    header: () => (
      <button
        className="th-inner sortable"
        onClick={() => onSortChange('name')}
      >
        Exercise
        <SortIcon column="name" sortBy={sortBy} sortOrder={sortOrder} />
      </button>
    ),
    accessorKey: 'name',
    cell: ({ row }) => (
      <NameCell exerciseId={row.original.id} exerciseName={row.original.name} />
    ),
  },
  {
    header: () => <span className="th-inner">Tags</span>,
    accessorKey: 'tags',
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
