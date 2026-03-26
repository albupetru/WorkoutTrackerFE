import { useEffect, useRef, useState } from 'react';
import { useTagGroups } from '../../hooks/useTags';
import { Tag, TagGroup } from '../../types/tag.types';
import { SECTION_LABELS } from '../../utils/tagConstants';
import {
  getLeafTags,
  buildTagHierarchyMaps,
  sortTagGroupsBySectionOrder,
} from '../../utils/tagUtils';
import FilterDropdown from './FilterDropdown';
import './style.scss';

// ---- Checkbox with indeterminate support ----
const CheckboxOption = ({
  label,
  checked,
  indeterminate = false,
  depth = 0,
  onChange,
}: {
  label: string;
  checked: boolean;
  indeterminate?: boolean;
  depth?: number;
  onChange: () => void;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label className={`fb-option fb-option--depth-${depth}`}>
      <input ref={ref} type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
};

// ---- Flat panel ----
const FlatPanel = ({
  tags,
  selectedTagIds,
  onChange,
}: {
  tags: Tag[];
  selectedTagIds: string[];
  onChange: (ids: string[]) => void;
}) => {
  const selectedSet = new Set(selectedTagIds);
  const toggle = (id: string) => {
    if (selectedSet.has(id)) {
      onChange(selectedTagIds.filter((x) => x !== id));
    } else {
      onChange([...selectedTagIds, id]);
    }
  };

  return (
    <>
      {tags.map((tag) => (
        <CheckboxOption
          key={tag.id}
          label={tag.name}
          checked={selectedSet.has(tag.id)}
          onChange={() => toggle(tag.id)}
        />
      ))}
    </>
  );
};

// ---- Hierarchical muscle panel ----
const MusclePanel = ({
  bodyZoneGroup,
  selectedTagIds,
  onChange,
}: {
  bodyZoneGroup: TagGroup;
  selectedTagIds: string[];
  onChange: (ids: string[]) => void;
}) => {
  const { zoneToFamilies, familyToGroups: familyToLeaves } =
    buildTagHierarchyMaps(bodyZoneGroup);

  const selectedSet = new Set(selectedTagIds);

  const getZoneLeafIds = (zoneId: string) =>
    (zoneToFamilies.get(zoneId) ?? []).flatMap((f) =>
      (familyToLeaves.get(f.id) ?? []).map((l) => l.id),
    );

  const getFamilyLeafIds = (familyId: string) =>
    (familyToLeaves.get(familyId) ?? []).map((l) => l.id);

  type CheckState = 'checked' | 'indeterminate' | 'unchecked';

  const getState = (leafIds: string[]): CheckState => {
    const n = leafIds.filter((id) => selectedSet.has(id)).length;
    if (n === 0) {
      return 'unchecked';
    }
    if (n === leafIds.length) {
      return 'checked';
    }
    return 'indeterminate';
  };

  const toggleZone = (zoneId: string) => {
    const leafIds = getZoneLeafIds(zoneId);
    if (getState(leafIds) === 'checked') {
      onChange(selectedTagIds.filter((id) => !leafIds.includes(id)));
    } else {
      const toAdd = leafIds.filter((id) => !selectedSet.has(id));
      onChange([...selectedTagIds, ...toAdd]);
    }
  };

  const toggleFamily = (familyId: string) => {
    const leafIds = getFamilyLeafIds(familyId);
    if (getState(leafIds) === 'checked') {
      onChange(selectedTagIds.filter((id) => !leafIds.includes(id)));
    } else {
      const toAdd = leafIds.filter((id) => !selectedSet.has(id));
      onChange([...selectedTagIds, ...toAdd]);
    }
  };

  const toggleLeaf = (leafId: string) => {
    if (selectedSet.has(leafId)) {
      onChange(selectedTagIds.filter((id) => id !== leafId));
    } else {
      onChange([...selectedTagIds, leafId]);
    }
  };

  return (
    <>
      {bodyZoneGroup.tags.map((zone) => {
        const families = zoneToFamilies.get(zone.id) ?? [];
        const zoneLeafIds = getZoneLeafIds(zone.id);
        const zoneState = getState(zoneLeafIds);
        return (
          <div key={zone.id} className="fb-zone">
            <CheckboxOption
              label={zone.name}
              checked={zoneState === 'checked'}
              indeterminate={zoneState === 'indeterminate'}
              depth={0}
              onChange={() => toggleZone(zone.id)}
            />
            {families.map((family) => {
              const leafIds = getFamilyLeafIds(family.id);
              const familyState = getState(leafIds);
              return (
                <div key={family.id}>
                  <CheckboxOption
                    label={family.name}
                    checked={familyState === 'checked'}
                    indeterminate={familyState === 'indeterminate'}
                    depth={1}
                    onChange={() => toggleFamily(family.id)}
                  />
                  {(familyToLeaves.get(family.id) ?? []).map((leaf) => (
                    <CheckboxOption
                      key={leaf.id}
                      label={leaf.name}
                      checked={selectedSet.has(leaf.id)}
                      depth={2}
                      onChange={() => toggleLeaf(leaf.id)}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

// ---- Sidebar accordion section ----
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

// ---- Main FilterBar ----
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
