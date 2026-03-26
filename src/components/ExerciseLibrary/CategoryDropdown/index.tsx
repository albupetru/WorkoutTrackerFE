import { useState, useEffect, useRef, useCallback } from 'react';
import TagFilter from '../../TagFilter';
import './style.scss';

interface CategoryDropdownProps {
  selectedTagIds: string[];
  onApply: (tagIds: string[]) => void;
}

const CategoryDropdown = ({
  selectedTagIds,
  onApply,
}: CategoryDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [pendingTagIds, setPendingTagIds] = useState<string[]>(selectedTagIds);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync pending state when prop changes externally
  useEffect(() => {
    setPendingTagIds(selectedTagIds);
  }, [selectedTagIds]);

  // Close on click outside and apply immediately
  useEffect(() => {
    if (!open) {
      return;
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        setOpen(false);
        onApply(pendingTagIds);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, pendingTagIds, onApply]);

  const scheduleApply = useCallback(
    (nextTagIds: string[]) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        onApply(nextTagIds);
      }, 300);
    },
    [onApply],
  );

  const handleChange = (nextTagIds: string[]) => {
    setPendingTagIds(nextTagIds);
    scheduleApply(nextTagIds);
  };

  const handleClose = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    setOpen(false);
    onApply(pendingTagIds);
  };

  const label =
    pendingTagIds.length === 0
      ? 'ALL TAGS'
      : `${pendingTagIds.length} SELECTED`;

  return (
    <div className="category-dropdown" ref={containerRef}>
      <button
        className="category-btn"
        onClick={() => (open ? handleClose() : setOpen(true))}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        {label}
        <span className="category-btn-icons">
          {pendingTagIds.length > 0 && (
            <span
              className="material-symbols-outlined category-clear"
              role="button"
              aria-label="Clear tag filters"
              onClick={(e) => {
                e.stopPropagation();
                if (debounceRef.current) {
                  clearTimeout(debounceRef.current);
                }
                setPendingTagIds([]);
                onApply([]);
                setOpen(false);
              }}
            >
              close
            </span>
          )}
          <span className="material-symbols-outlined category-chevron">
            {open ? 'expand_less' : 'expand_more'}
          </span>
        </span>
      </button>

      {open && (
        <div className="dropdown-panel" role="dialog" aria-label="Tag filters">
          <TagFilter selectedTagIds={pendingTagIds} onChange={handleChange} />
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
