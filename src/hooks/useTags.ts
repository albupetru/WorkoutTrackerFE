import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getTags, getTagGroups, Tag, TagType, TagGroup } from "../api/tags";

export const tagKeys = {
  all: ["tags"] as const,
  lists: () => [...tagKeys.all, "list"] as const,
  list: (type?: TagType) => [...tagKeys.lists(), { type }] as const,
  grouped: () => [...tagKeys.all, "grouped"] as const,
};

export const useTags = (type?: TagType): UseQueryResult<Tag[], Error> => {
  return useQuery({
    queryKey: tagKeys.list(type),
    queryFn: () => getTags(type),
    staleTime: 10 * 60 * 1000,
  });
};

export const useTagGroups = (): UseQueryResult<TagGroup[], Error> => {
  return useQuery({
    queryKey: tagKeys.grouped(),
    queryFn: () => getTagGroups(),
    staleTime: 10 * 60 * 1000,
  });
};
