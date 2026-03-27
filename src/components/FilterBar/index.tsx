import { useTagGroups } from '../../hooks/useTags';
import { SECTION_LABELS } from '../../utils/tagConstants';
import { getLeafTags, sortTagGroupsBySectionOrder } from '../../utils/tagUtils';
import FilterDropdown from './FilterDropdown';
import MusclePanel from './MusclePanel';
import FlatPanel from './FlatPanel';
import FilterSection from './FilterSection';
import './style.scss';

interface FilterBarProps {
  selectedTagIds: string[];
  onChange: (ids: string[]) => void;
  variant?: 'horizontal' | 'sidebar';
}

const FilterBar = ({
  selectedTagIds,
  onChange,
  variant = 'horizontal',
}: FilterBarProps) => {
  const { data: tagGroups, isLoading } = useTagGroups();

  if (isLoading || !tagGroups) {
    return null;
  }

  const sorted = sortTagGroupsBySectionOrder(tagGroups);

  return (
    <>
      {sorted.map((group) => {
        const leafIds = getLeafTags(group).map((t) => t.id);
        const leafSet = new Set(leafIds);
        const sectionSelected = selectedTagIds.filter((id) => leafSet.has(id));

        const handleSectionChange = (newIds: string[]) => {
          onChange([
            ...selectedTagIds.filter((id) => !leafSet.has(id)),
            ...newIds,
          ]);
        };

        const label = SECTION_LABELS[group.tagType] ?? group.tagType;

        return variant === 'sidebar' ? (
          <FilterSection
            key={group.tagType}
            label={label}
            selectedCount={sectionSelected.length}
            onClear={() => handleSectionChange([])}
          >
            {group.tagType === 'BodyZone' ? (
              <MusclePanel
                bodyZoneGroup={group}
                selectedTagIds={sectionSelected}
                onChange={handleSectionChange}
              />
            ) : (
              <FlatPanel
                tags={group.tags}
                selectedTagIds={sectionSelected}
                onChange={handleSectionChange}
              />
            )}
          </FilterSection>
        ) : (
          <FilterDropdown
            key={group.tagType}
            label={label}
            selectedCount={sectionSelected.length}
            onClear={() => handleSectionChange([])}
          >
            {group.tagType === 'BodyZone' ? (
              <MusclePanel
                bodyZoneGroup={group}
                selectedTagIds={sectionSelected}
                onChange={handleSectionChange}
              />
            ) : (
              <FlatPanel
                tags={group.tags}
                selectedTagIds={sectionSelected}
                onChange={handleSectionChange}
              />
            )}
          </FilterDropdown>
        );
      })}
    </>
  );
};

export default FilterBar;
