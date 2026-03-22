import { Tag } from "../api/tags";

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  instructions?: string;
  movementType?: string;
  createdById: string;
  createdByName: string;
  createdOn: string;
  verifiedById?: string;
  verifiedByName?: string;
  verifiedOn?: string;
  tags: Tag[];
}

export const isExerciseVerified = (exercise: Exercise): boolean => {
  return exercise.verifiedOn != null;
};

export interface ExerciseFilters {
  keyword?: string;
  tagIds?: string[];
  movementType?: string;
  includeUnverified?: boolean;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ExercisesResponse {
  exercises: Exercise[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface CreateExerciseDto {
  name: string;
  description?: string;
  instructions?: string;
  movementType?: string;
  tagIds: string[];
}

export interface UpdateExerciseDto extends CreateExerciseDto {
  id: string;
}
