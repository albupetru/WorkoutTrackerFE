import { TagGroup } from '../../types/tag.types';
import { buildTagHierarchyMaps } from '../../utils/tagUtils';
import CheckboxOption from './CheckboxOption';

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

export default MusclePanel;
