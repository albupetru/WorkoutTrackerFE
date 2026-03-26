import { useState } from "react";
import { useTagGroups } from "../../hooks/useTags";
import { Tag, TagGroup } from "../../types/tag.types";
import "./style.scss";

interface TagFilterProps {
  selectedTagIds: string[];
  onChange: (selectedTagIds: string[]) => void;
}

const SECTION_LABELS: Record<string, string> = {
  BodyZone: "Muscles",
  Equipment: "Equipment",
  MuscleActivationPattern: "Activation Pattern",
  Laterality: "Laterality",
  MovementPattern: "Movement Pattern",
  ExerciseType: "Exercise Type",
  Discipline: "Discipline",
  TrainingSplit: "Training Split",
  Comfort: "Comfort",
  Miscellaneous: "Other",
};

const SECTION_ORDER = [
  "BodyZone",
  "Equipment",
  "MuscleActivationPattern",
  "Laterality",
  "MovementPattern",
  "ExerciseType",
  "Discipline",
  "TrainingSplit",
  "Comfort",
  "Miscellaneous",
];

interface TagFilterProps {
  selectedTagIds: string[];
  onChange: (selectedTagIds: string[]) => void;
}

// ---- Leaf tag checkbox ----
const TagCheckbox = ({
  tag,
  selected,
  onToggle,
}: {
  tag: Tag;
  selected: boolean;
  onToggle: (id: string) => void;
}) => (
  <label className="tf-checkbox-option">
    <input
      type="checkbox"
      checked={selected}
      onChange={() => onToggle(tag.id)}
    />
    {tag.name}
  </label>
);

// ---- Flat tag list ----
const FlatTagList = ({
  tags,
  selectedTagIds,
  onToggle,
}: {
  tags: Tag[];
  selectedTagIds: string[];
  onToggle: (id: string) => void;
}) => (
  <div className="tf-checkbox-list">
    {tags.map((tag) => (
      <TagCheckbox
        key={tag.id}
        tag={tag}
        selected={selectedTagIds.includes(tag.id)}
        onToggle={onToggle}
      />
    ))}
  </div>
);

// ---- BodyZone hierarchical section ----
const BodyZoneSection = ({
  bodyZoneGroup,
  selectedTagIds,
  onToggle,
}: {
  bodyZoneGroup: TagGroup;
  selectedTagIds: string[];
  onToggle: (id: string) => void;
}) => {
  // muscleFamilyGroup is nested inside bodyZoneGroup.tagGroups
  const muscleFamilyGroup = bodyZoneGroup.tagGroups?.find(
    (g) => g.tagType === "MuscleFamily",
  );
  const muscleGroupGroup = muscleFamilyGroup?.tagGroups?.find(
    (g) => g.tagType === "MuscleGroup",
  );

  const [openFamilies, setOpenFamilies] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        (muscleFamilyGroup?.tags ?? []).map((t) => [t.id, true]),
      ),
  );

  const toggleFamily = (id: string) =>
    setOpenFamilies((prev) => ({ ...prev, [id]: !prev[id] }));

  // Build a map: muscleFamilyTag.id → muscleGroupTags[]
  // Using parentId on MuscleGroup tags
  const familyToGroups = new Map<string, Tag[]>();
  if (muscleGroupGroup) {
    for (const mgTag of muscleGroupGroup.tags) {
      const pid = mgTag.parentId;
      if (pid) {
        if (!familyToGroups.has(pid)) familyToGroups.set(pid, []);
        familyToGroups.get(pid)!.push(mgTag);
      }
    }
  }

  // Group muscleFamilyTags by their parentId (bodyZoneTag.id)
  const zoneToFamilies = new Map<string, Tag[]>();
  if (muscleFamilyGroup) {
    for (const mfTag of muscleFamilyGroup.tags) {
      const pid = mfTag.parentId;
      if (pid) {
        if (!zoneToFamilies.has(pid)) zoneToFamilies.set(pid, []);
        zoneToFamilies.get(pid)!.push(mfTag);
      }
    }
  }

  return (
    <>
      {bodyZoneGroup.tags.map((zone) => {
        const families = zoneToFamilies.get(zone.id) ?? [];
        return (
          <div key={zone.id} className="tf-body-zone">
            <span className="tf-body-zone-label">{zone.name}</span>
            {families.map((family) => {
              const leafTags = familyToGroups.get(family.id) ?? [];
              const isOpen = !!openFamilies[family.id];
              return (
                <div key={family.id} className="tf-muscle-family">
                  <button
                    type="button"
                    className="tf-family-toggle"
                    aria-expanded={isOpen}
                    onClick={() => toggleFamily(family.id)}
                  >
                    <span className="tf-family-name">{family.name}</span>
                    <span className="material-symbols-outlined tf-family-chevron">
                      {isOpen ? "expand_less" : "expand_more"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="tf-checkbox-list tf-checkbox-list--indented">
                      {leafTags.map((tag) => (
                        <TagCheckbox
                          key={tag.id}
                          tag={tag}
                          selected={selectedTagIds.includes(tag.id)}
                          onToggle={onToggle}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

// ---- Collapsible section wrapper ----
const FilterSection = ({
  tagType,
  children,
  defaultOpen = false,
}: {
  tagType: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const label = SECTION_LABELS[tagType] ?? tagType;

  return (
    <div className="tf-section">
      <button
        type="button"
        className="tf-section-header"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="tf-section-label">{label}</span>
        <span className="material-symbols-outlined tf-section-chevron">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>
      {open && <div className="tf-section-body">{children}</div>}
    </div>
  );
};

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
  const sorted = [...tagGroups].sort((a, b) => {
    const ai = SECTION_ORDER.indexOf(a.tagType);
    const bi = SECTION_ORDER.indexOf(b.tagType);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  return (
    <div className="tag-filter" role="group" aria-label="Filter by tags">
      {sorted.map((group) => (
        <FilterSection
          key={group.tagType}
          tagType={group.tagType}
          defaultOpen={true}
        >
          {group.tagType === "BodyZone" ? (
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
