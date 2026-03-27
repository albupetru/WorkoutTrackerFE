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

export default SortIcon;
