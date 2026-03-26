import { useEffect, useRef, useState } from 'react';

interface FilterDropdownProps {
  label: string;
  selectedCount: number;
  onClear: () => void;
  children: React.ReactNode;
}

const FilterDropdown = ({
  label,
  selectedCount,
  onClear,
  children,
}: FilterDropdownProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const hasSelection = selectedCount > 0;

  return (
    <div className="fdd" ref={containerRef}>
      <button
        type="button"
        className={`fdd-btn${hasSelection ? ' fdd-btn--active' : ''}${open ? ' fdd-btn--open' : ''}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="fdd-label">{label}</span>
        {hasSelection && <span className="fdd-badge">{selectedCount}</span>}
        <span className="material-symbols-outlined fdd-chevron">
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {open && (
        <div className="fdd-panel">
          <button
            type="button"
            className="fdd-clear-btn"
            onClick={() => {
              onClear();
              setOpen(false);
            }}
          >
            Clear filter
          </button>
          <div className="fdd-options">{children}</div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
