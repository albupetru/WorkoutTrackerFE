import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getTags, getTagGroups } from "../api/tags";
import { Tag, TagGroup } from "../types/tag.types";

export const tagKeys = {
  all: ["tags"] as const,
  list: (type?: string) => [...tagKeys.all, { type }] as const,
  grouped: () => [...tagKeys.all, "grouped"] as const,
};

export const useTags = (type?: string): UseQueryResult<Tag[], Error> => {
  return useQuery({
    queryKey: tagKeys.list(type),
    queryFn: () => getTags(type),
    staleTime: 30 * 60 * 1000,
  });
};

export const useTagGroups = (): UseQueryResult<TagGroup[], Error> => {
  return useQuery({
    queryKey: tagKeys.grouped(),
    queryFn: () => getTagGroups(),
    staleTime: 30 * 60 * 1000,
  });
};
