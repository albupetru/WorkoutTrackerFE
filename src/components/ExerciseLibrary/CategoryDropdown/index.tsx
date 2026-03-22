import { useState, useEffect, useRef } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync pending state when prop changes externally
  useEffect(() => {
    setPendingTagIds(selectedTagIds);
  }, [selectedTagIds]);

  // Close on click outside and apply
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        onApply(pendingTagIds);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, pendingTagIds, onApply]);

  const toggleTag = (tagId: string) => {
    setPendingTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const handleClose = () => {
    setOpen(false);
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
          {tags.map((tag) => (
            <label key={tag.id} className="dropdown-option">
              <input
                type="checkbox"
                checked={pendingTagIds.includes(tag.id)}
                onChange={() => toggleTag(tag.id)}
              />
              {tag.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
