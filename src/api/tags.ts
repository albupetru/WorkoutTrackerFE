import { apiClient } from "./apiClient";

export interface Tag {
  id: string;
  name: string;
  type?: TagType;
  description?: string;
}

export type TagType = "MUSCLE_GROUP" | "EQUIPMENT" | "DIFFICULTY" | "OTHER";

export interface TagGroup {
  type: TagType;
  tags: Tag[];
}

export const getTags = async (type?: TagType): Promise<Tag[]> => {
  const params: Record<string, any> = {};

  if (type) {
    params.type = type;
  }

  return apiClient.get<Tag[]>("/tags", { params });
};

export const getTagGroups = async (): Promise<TagGroup[]> => {
  const tags = await getTags();
  const groupMap = new Map<TagType, Tag[]>();

  tags.forEach((tag) => {
    const type = tag.type || "OTHER";
    if (!groupMap.has(type)) {
      groupMap.set(type, []);
    }
    groupMap.get(type)!.push(tag);
  });

  return Array.from(groupMap.entries()).map(([type, tags]) => ({
    type,
    tags,
  }));
};
