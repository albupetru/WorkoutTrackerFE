import { apiClient } from "./apiClient";
import { PaginatedResponse } from "./types";
import { Tag } from "./tags";

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  instructions?: string;
  tags?: Tag[];
}

export interface ExerciseFilters {
  search?: string;
  tags?: string[];
  page?: number;
  pageSize?: number;
}

export const getExercises = async (
  filters?: ExerciseFilters,
): Promise<PaginatedResponse<Exercise>> => {
  const params: Record<string, any> = {};

  if (filters?.search) {
    params.search = filters.search;
  }
  if (filters?.tags && filters.tags.length > 0) {
    params.tags = filters.tags.join(",");
  }
  if (filters?.page !== undefined) {
    params.page = filters.page;
  }
  if (filters?.pageSize !== undefined) {
    params.pageSize = filters.pageSize;
  }

  return apiClient.get<PaginatedResponse<Exercise>>("/exercise", { params });
};

export const getExercise = async (id: string): Promise<Exercise> => {
  return apiClient.get<Exercise>(`/exercise/${id}`);
};
