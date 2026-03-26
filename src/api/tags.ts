import { apiClient } from './apiClient';
import { Tag, TagGroup } from '../types/tag.types';

export type { Tag, TagGroup };
export type TagType = string;

export const getTags = async (type?: string): Promise<Tag[]> => {
  const params: Record<string, string> = {};

  if (type) {
    params.type = type;
  }

  return apiClient.get<Tag[]>('/tags', { params });
};

export const getTagGroups = async (): Promise<TagGroup[]> => {
  return apiClient.get<TagGroup[]>('/tags/grouped');
};
