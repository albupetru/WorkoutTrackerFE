import { useState } from 'react';

const FilterSection = ({
  label,
  selectedCount,
  onClear,
  children,
}: {
  label: string;
  selectedCount: number;
  onClear: () => void;
  children: React.ReactNode;
}) => {
  const [expanded, setExpanded] = useState(selectedCount > 0);

  return (
    <div className="fsec">
      <button
        type="button"
        className={`fsec-header${selectedCount > 0 ? ' fsec-header--active' : ''}`}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="fsec-label">{label}</span>
        {selectedCount > 0 && (
          <span className="fsec-badge">{selectedCount}</span>
        )}
        <span className="material-symbols-outlined fsec-chevron">
          {expanded ? 'expand_less' : 'expand_more'}
        </span>
      </button>
      {expanded && (
        <div className="fsec-body">
          {selectedCount > 0 && (
            <button
              type="button"
              className="fsec-clear-btn"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
            >
              Clear
            </button>
          )}
          {children}
        </div>
      )}
    </div>
  );
};

export default FilterSection;
