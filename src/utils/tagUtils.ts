import { Tag, TagGroup } from '../types/tag.types';

export function getLeafTags(group: TagGroup): Tag[] {
  if (group.tagType === 'BodyZone') {
    const mfg = group.tagGroups?.find((g) => g.tagType === 'MuscleFamily');
    const mgg = mfg?.tagGroups?.find((g) => g.tagType === 'MuscleGroup');
    return mgg?.tags ?? [];
  }
  return group.tags;
}
