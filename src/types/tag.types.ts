export interface Tag {
  id: string;
  name: string;
  tagType: string;
  parentId?: string;
}

export interface TagGroup {
  tagType: string;
  tags: Tag[];
  tagGroups?: TagGroup[];
}
