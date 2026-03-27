import { useTagGroups } from '../../../../hooks/useTags';
import { sortTagGroupsBySectionOrder } from '../../../../utils/tagUtils';
import BodyZoneSection from './BodyZoneSection';
import FlatTagList from './FlatTagList';
import FilterSection from './FilterSection';
import './style.scss';

interface TagFilterProps {
  selectedTagIds: string[];
  onChange: (selectedTagIds: string[]) => void;
}

// ---- Main TagFilter ----
const TagFilter = ({ selectedTagIds, onChange }: TagFilterProps) => {
  const { data: tagGroups, isLoading } = useTagGroups();

  const toggleTag = (id: string) => {
    const next = selectedTagIds.includes(id)
      ? selectedTagIds.filter((x) => x !== id)
      : [...selectedTagIds, id];
    onChange(next);
  };

  if (isLoading || !tagGroups) {
    return <div className="tf-loading">Loading tags...</div>;
  }

  // Sort groups by SECTION_ORDER, unknown types appended at end
  const sorted = sortTagGroupsBySectionOrder(tagGroups);

  return (
    <div className="tag-filter" role="group" aria-label="Filter by tags">
      {sorted.map((group) => (
        <FilterSection
          key={group.tagType}
          tagType={group.tagType}
          defaultOpen={true}
        >
          {group.tagType === 'BodyZone' ? (
            <BodyZoneSection
              bodyZoneGroup={group}
              selectedTagIds={selectedTagIds}
              onToggle={toggleTag}
            />
          ) : (
            <FlatTagList
              tags={group.tags}
              selectedTagIds={selectedTagIds}
              onToggle={toggleTag}
            />
          )}
        </FilterSection>
      ))}
    </div>
  );
};

export default TagFilter;
