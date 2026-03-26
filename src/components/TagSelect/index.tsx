import { useEffect, useRef, useState } from 'react';
import { useTagGroups } from '../../hooks/useTags';
import { Tag, TagGroup } from '../../types/tag.types';
import { SECTION_LABELS, SECTION_ORDER } from '../../utils/tagConstants';
import { getLeafTags } from '../../utils/tagUtils';
import './style.scss';

const REQUIRED_SECTIONS = new Set([
  'BodyZone',
  'Equipment',
  'MuscleActivationPattern',
  'Laterality',
  'MovementPattern',
  'ExerciseType',
  'Discipline',
  'TrainingSplit',
  'Miscellaneous',
]);

function getMuscleSubgroups(
  group: TagGroup,
): { label: string; tags: Tag[] }[] | null {
  if (group.tagType !== 'BodyZone') {
    return null;
  }
  const mfg = group.tagGroups?.find((g) => g.tagType === 'MuscleFamily');
  const mgg = mfg?.tagGroups?.find((g) => g.tagType === 'MuscleGroup');
  if (!mfg || !mgg) {
    return null;
  }
  return mfg.tags
    .map((family) => ({
      label: family.name,
      tags: mgg.tags.filter((mg) => mg.parentId === family.id),
    }))
    .filter((g) => g.tags.length > 0);
}

// ---- Individual dropdown ----
interface TagDropdownProps {
  label: string;
  leafTags: Tag[];
  muscleSubgroups: { label: string; tags: Tag[] }[] | null;
  selectedTagIds: string[];
  required: boolean;
  hasError: boolean;
  onSectionChange: (ids: string[]) => void;
}

const TagDropdown = ({
  label,
  leafTags,
  muscleSubgroups,
  selectedTagIds,
  required,
  hasError,
  onSectionChange,
}: TagDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const allLeafIds = leafTags.map((t) => t.id);
  const sectionSelected = selectedTagIds.filter((id) =>
    allLeafIds.includes(id),
  );
  const selectedSet = new Set(sectionSelected);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const toggle = (id: string) => {
    if (selectedSet.has(id)) {
      onSectionChange(sectionSelected.filter((x) => x !== id));
    } else {
      onSectionChange([...sectionSelected, id]);
    }
  };

  const renderOptions = () => {
    if (muscleSubgroups) {
      return muscleSubgroups.map((subgroup) => (
        <div key={subgroup.label} className="ts-panel-group">
          <span className="ts-panel-group-label">{subgroup.label}</span>
          {subgroup.tags.map((tag) => (
            <label key={tag.id} className="ts-option">
              <input
                type="checkbox"
                checked={selectedSet.has(tag.id)}
                onChange={() => toggle(tag.id)}
              />
              <span>{tag.name}</span>
            </label>
          ))}
        </div>
      ));
    }
    return leafTags.map((tag) => (
      <label key={tag.id} className="ts-option">
        <input
          type="checkbox"
          checked={selectedSet.has(tag.id)}
          onChange={() => toggle(tag.id)}
        />
        <span>{tag.name}</span>
      </label>
    ));
  };

  return (
    <div ref={ref} className={`ts-dropdown${open ? ' ts-dropdown--open' : ''}`}>
      <button
        type="button"
        className={`ts-trigger${hasError ? ' ts-trigger--error' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-required={required}
        aria-invalid={hasError}
      >
        <span className="ts-trigger-label">{label}</span>
        {sectionSelected.length > 0 && (
          <span className="ts-badge">{sectionSelected.length}</span>
        )}
        <span className="material-symbols-outlined ts-chevron">
          expand_more
        </span>
      </button>
      {open && (
        <div className="ts-panel" role="listbox">
          {leafTags.length === 0 ? (
            <span className="ts-empty">No options available</span>
          ) : (
            renderOptions()
          )}
        </div>
      )}
    </div>
  );
};

// ---- Main component ----
interface TagSelectProps {
  selectedTagIds: string[];
  onChange: (ids: string[]) => void;
  showErrors?: boolean;
}

const TagSelect = ({
  selectedTagIds,
  onChange,
  showErrors = false,
}: TagSelectProps) => {
  const { data: groups = [] } = useTagGroups();

  const ordered = SECTION_ORDER.map((type) =>
    groups.find((g) => g.tagType === type),
  ).filter((g): g is TagGroup => !!g);

  const handleSectionChange = (group: TagGroup, sectionIds: string[]) => {
    const leafIds = getLeafTags(group).map((t) => t.id);
    const without = selectedTagIds.filter((id) => !leafIds.includes(id));
    onChange([...without, ...sectionIds]);
  };

  return (
    <div className="tag-select">
      {ordered.map((group) => {
        const leafIds = getLeafTags(group).map((t) => t.id);
        const required = REQUIRED_SECTIONS.has(group.tagType);
        const hasError =
          showErrors &&
          required &&
          !selectedTagIds.some((id) => leafIds.includes(id));
        return (
          <TagDropdown
            key={group.tagType}
            label={SECTION_LABELS[group.tagType] ?? group.tagType}
            leafTags={getLeafTags(group)}
            muscleSubgroups={getMuscleSubgroups(group)}
            selectedTagIds={selectedTagIds}
            required={required}
            hasError={hasError}
            onSectionChange={(ids) => handleSectionChange(group, ids)}
          />
        );
      })}
    </div>
  );
};

export default TagSelect;
