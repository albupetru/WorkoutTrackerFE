import { ColumnDef } from '@tanstack/react-table';
import { Exercise } from '../../../types/exercise.types.tsx';
import NameCell from '../NameCell';
import SortIcon from './SortIcon';

interface SortConfig {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (column: string) => void;
}

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
