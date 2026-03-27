import { useState } from 'react';
import { TagGroup } from '../../../../types/tag.types';
import { buildTagHierarchyMaps } from '../../../../utils/tagUtils';
import TagCheckbox from './TagCheckbox';

const BodyZoneSection = ({
  bodyZoneGroup,
  selectedTagIds,
  onToggle,
}: {
  bodyZoneGroup: TagGroup;
  selectedTagIds: string[];
  onToggle: (id: string) => void;
}) => {
  const { muscleFamilyGroup, zoneToFamilies, familyToGroups } =
    buildTagHierarchyMaps(bodyZoneGroup);

  const [openFamilies, setOpenFamilies] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        (muscleFamilyGroup?.tags ?? []).map((t) => [t.id, true]),
      ),
  );

  const toggleFamily = (id: string) =>
    setOpenFamilies((prev) => ({ ...prev, [id]: !prev[id] }));

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
                      {isOpen ? 'expand_less' : 'expand_more'}
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

export default BodyZoneSection;
