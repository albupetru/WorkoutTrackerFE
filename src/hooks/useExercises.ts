import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  getExercises,
  getExercise,
  Exercise,
  ExerciseFilters,
} from "../api/exercises";
import { PaginatedResponse } from "../api/types";

export const exerciseKeys = {
  all: ["exercises"] as const,
  lists: () => [...exerciseKeys.all, "list"] as const,
  list: (filters?: ExerciseFilters) =>
    [...exerciseKeys.lists(), filters] as const,
  details: () => [...exerciseKeys.all, "detail"] as const,
  detail: (id: string) => [...exerciseKeys.details(), id] as const,
};

export const useExercises = (
  filters?: ExerciseFilters,
): UseQueryResult<PaginatedResponse<Exercise>, Error> => {
  return useQuery({
    queryKey: exerciseKeys.list(filters),
    queryFn: () => getExercises(filters),
  });
};

export const useExercise = (
  id: string | undefined,
): UseQueryResult<Exercise, Error> => {
  return useQuery({
    queryKey: exerciseKeys.detail(id || ""),
    queryFn: () => getExercise(id!),
    enabled: !!id,
  });
};
