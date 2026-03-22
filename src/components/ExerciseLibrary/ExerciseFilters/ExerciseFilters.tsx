import { useState, useEffect } from "react";
import { ExerciseFilters as ExerciseFiltersType } from "../../../types/exercise.types";
import TextInput from "../../TextInput";
import useAuth from "../../authentication/useAuth";
import { useTags } from "../../../hooks/useTags";
import "./style.scss";

interface ExerciseFiltersProps {
  filters: ExerciseFiltersType;
  onFiltersChange: (filters: ExerciseFiltersType) => void;
}

const ExerciseFilters = ({
  filters,
  onFiltersChange,
}: ExerciseFiltersProps) => {
  const { isAdmin } = useAuth();
  const { data: tags } = useTags();
  const [keywordInput, setKeywordInput] = useState(filters.keyword || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (keywordInput !== filters.keyword) {
        onFiltersChange({ ...filters, keyword: keywordInput, pageNumber: 1 });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [keywordInput]);

  const handleTagToggle = (tagId: string) => {
    const currentTags = filters.tagIds || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter((id) => id !== tagId)
      : [...currentTags, tagId];

    onFiltersChange({ ...filters, tagIds: newTags, pageNumber: 1 });
  };

  const handleIncludeUnverifiedChange = (checked: boolean) => {
    onFiltersChange({ ...filters, includeUnverified: checked, pageNumber: 1 });
  };

  return (
    <div className="exercise-filters">
      <div className="filter-section">
        <TextInput
          label="Search"
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          placeholder="Search exercises..."
        />
      </div>

      {tags && tags.length > 0 && (
        <div className="filter-section">
          <label>Tags:</label>
          <div className="tag-list">
            {tags.map((tag) => (
              <label key={tag.id} className="tag-checkbox">
                <input
                  type="checkbox"
                  checked={filters.tagIds?.includes(tag.id) || false}
                  onChange={() => handleTagToggle(tag.id)}
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="filter-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.includeUnverified || false}
              onChange={(e) => handleIncludeUnverifiedChange(e.target.checked)}
            />
            Show unverified exercises
          </label>
        </div>
      )}
    </div>
  );
};

export default ExerciseFilters;
