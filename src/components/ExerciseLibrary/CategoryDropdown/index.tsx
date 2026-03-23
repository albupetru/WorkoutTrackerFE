import { useState, useEffect, useRef, useCallback } from "react";
import { useTags } from "../../../hooks/useTags";
import "./style.scss";

interface CategoryDropdownProps {
  selectedTagIds: string[];
  onApply: (tagIds: string[]) => void;
}

const CategoryDropdown = ({
  selectedTagIds,
  onApply,
}: CategoryDropdownProps) => {
  const { data: tags } = useTags();
  const [open, setOpen] = useState(false);
  const [pendingTagIds, setPendingTagIds] = useState<string[]>(selectedTagIds);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync pending state when prop changes externally
  useEffect(() => {
    setPendingTagIds(selectedTagIds);
  }, [selectedTagIds]);

  // Close on click outside and apply immediately
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        setOpen(false);
        setSearch("");
        onApply(pendingTagIds);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, pendingTagIds, onApply]);

  const scheduleApply = useCallback(
    (nextTagIds: string[]) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onApply(nextTagIds);
      }, 300);
    },
    [onApply],
  );

  const toggleTag = (tagId: string) => {
    setPendingTagIds((prev) => {
      const next = prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId];
      scheduleApply(next);
      return next;
    });
  };

  const handleClose = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setOpen(false);
    setSearch("");
    onApply(pendingTagIds);
  };

  const label =
    pendingTagIds.length === 0
      ? "ALL TAGS"
      : `${pendingTagIds.length} SELECTED`;

  return (
    <div className="category-dropdown" ref={containerRef}>
      <button
        className="category-btn"
        onClick={() => (open ? handleClose() : setOpen(true))}
        type="button"
      >
        {label}
        <span className="material-symbols-outlined category-chevron">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>

      {open && tags && tags.length > 0 && (
        <div className="dropdown-panel">
          <div className="dropdown-search">
            <span className="material-symbols-outlined dropdown-search-icon">
              search
            </span>
            <input
              ref={searchInputRef}
              className="dropdown-search-input"
              type="text"
              placeholder="Search tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            {search && (
              <button
                className="dropdown-search-clear"
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>
          <div className="dropdown-options">
            {tags
              .filter((tag) =>
                tag.name.toLowerCase().includes(search.toLowerCase()),
              )
              .map((tag) => (
                <label key={tag.id} className="dropdown-option">
                  <input
                    type="checkbox"
                    checked={pendingTagIds.includes(tag.id)}
                    onChange={() => toggleTag(tag.id)}
                  />
                  {tag.name}
                </label>
              ))}
            {tags.filter((tag) =>
              tag.name.toLowerCase().includes(search.toLowerCase()),
            ).length === 0 && (
              <div className="dropdown-no-results">No tags found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
