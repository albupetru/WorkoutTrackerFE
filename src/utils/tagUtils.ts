import { Tag, TagGroup } from '../types/tag.types';
import { SECTION_ORDER } from './tagConstants';

export function getLeafTags(group: TagGroup): Tag[] {
  if (group.tagType === 'BodyZone') {
    const mfg = group.tagGroups?.find((g) => g.tagType === 'MuscleFamily');
    const mgg = mfg?.tagGroups?.find((g) => g.tagType === 'MuscleGroup');
    return mgg?.tags ?? [];
  }
  return group.tags;
}

export interface TagHierarchyMaps {
  muscleFamilyGroup: TagGroup | undefined;
  muscleGroupGroup: TagGroup | undefined;
  zoneToFamilies: Map<string, Tag[]>;
  familyToGroups: Map<string, Tag[]>;
}

export function buildTagHierarchyMaps(
  bodyZoneGroup: TagGroup,
): TagHierarchyMaps {
  const muscleFamilyGroup = bodyZoneGroup.tagGroups?.find(
    (g) => g.tagType === 'MuscleFamily',
  );
  const muscleGroupGroup = muscleFamilyGroup?.tagGroups?.find(
    (g) => g.tagType === 'MuscleGroup',
  );

  const zoneToFamilies = new Map<string, Tag[]>();
  for (const mf of muscleFamilyGroup?.tags ?? []) {
    if (mf.parentId) {
      if (!zoneToFamilies.has(mf.parentId)) {
        zoneToFamilies.set(mf.parentId, []);
      }
      zoneToFamilies.get(mf.parentId)!.push(mf);
    }
  }

  const familyToGroups = new Map<string, Tag[]>();
  for (const mg of muscleGroupGroup?.tags ?? []) {
    if (mg.parentId) {
      if (!familyToGroups.has(mg.parentId)) {
        familyToGroups.set(mg.parentId, []);
      }
      familyToGroups.get(mg.parentId)!.push(mg);
    }
  }

  return {
    muscleFamilyGroup,
    muscleGroupGroup,
    zoneToFamilies,
    familyToGroups,
  };
}

export function getMuscleSubgroups(
  group: TagGroup,
): { label: string; tags: Tag[] }[] | null {
  if (group.tagType !== 'BodyZone') {
    return null;
  }
  const { muscleFamilyGroup, familyToGroups } = buildTagHierarchyMaps(group);
  if (!muscleFamilyGroup) {
    return null;
  }
  return muscleFamilyGroup.tags
    .map((family) => ({
      label: family.name,
      tags: familyToGroups.get(family.id) ?? [],
    }))
    .filter((g) => g.tags.length > 0);
}

export function sortTagGroupsBySectionOrder<T extends { tagType: string }>(
  groups: T[],
): T[] {
  return [...groups].sort((a, b) => {
    const ai = SECTION_ORDER.indexOf(a.tagType);
    const bi = SECTION_ORDER.indexOf(b.tagType);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
}
