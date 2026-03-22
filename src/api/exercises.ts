import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./apiClient";
import {
  Exercise,
  ExerciseFilters,
  ExercisesResponse,
  CreateExerciseDto,
  UpdateExerciseDto,
} from "../types/exercise.types";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Hook to fetch a paginated list of exercises with optional filters
 */
export function useExercises(filters: ExerciseFilters = {}) {
  return useQuery({
    queryKey: ["exercises", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.keyword) params.append("keyword", filters.keyword);
      if (filters.tagIds) {
        filters.tagIds.forEach((id) => params.append("tagIds", id));
      }
      if (filters.movementType) {
        params.append("movementType", filters.movementType);
      }
      if (filters.includeUnverified) {
        params.append("includeUnverified", "true");
      }
      params.append("pageNumber", (filters.pageNumber || 1).toString());
      params.append("pageSize", (filters.pageSize || 20).toString());
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

      const response = await apiClient.get<ExercisesResponse>(
        `/exercise?${params}`,
      );
      return response;
    },
    staleTime: 30_000, // 30 seconds - exercises change infrequently
  });
}

/**
 * Hook to fetch a single exercise by ID
 */
export function useExercise(id: string | undefined) {
  return useQuery({
    queryKey: ["exercise", id],
    queryFn: async () => {
      try {
        const response = await apiClient.get<Exercise>(`/exercise/${id}`);
        return response;
      } catch (error: any) {
        if (error.status === 404) {
          throw new Error("Exercise not found");
        }
        if (error.status === 403) {
          throw new Error("You do not have permission to view this exercise");
        }
        throw error;
      }
    },
    enabled: !!id, // Only fetch if id exists
    staleTime: 5 * 60_000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 404 or 403
      if (
        error instanceof Error &&
        (error.message.includes("not found") ||
          error.message.includes("permission"))
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Hook to create a new exercise
 */
export function useCreateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateExerciseDto) => {
      const response = await apiClient.post<Exercise>("/exercise", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });
}

/**
 * Hook to update an existing exercise
 */
export function useUpdateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateExerciseDto) => {
      const response = await apiClient.put<Exercise>(
        `/exercise/${data.id}`,
        data,
      );
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      queryClient.invalidateQueries({ queryKey: ["exercise", data.id] });
    },
  });
}

/**
 * Hook to delete an exercise
 */
export function useDeleteExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/exercise/${id}`);
    },
    onSuccess: (_, exerciseId) => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      queryClient.removeQueries({ queryKey: ["exercise", exerciseId] });
    },
  });
}

/**
 * Hook to verify an exercise (admin/trainer only)
 */
export function useVerifyExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch<Exercise>(
        `/exercise/${id}/verify`,
      );
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      queryClient.invalidateQueries({ queryKey: ["exercise", data.id] });
    },
  });
}
