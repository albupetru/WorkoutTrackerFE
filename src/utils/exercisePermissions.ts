import { Exercise } from '../types/exercise.types';

export interface ExercisePermissions {
  canEdit: boolean;
  canDelete: boolean;
  canVerify: boolean;
}

export function getExercisePermissions(
  exercise: Exercise,
  isAdmin: boolean,
  userLoaded: boolean,
): ExercisePermissions {
  const isVerified = !!exercise.verifiedOn;
  const canEdit = userLoaded && (isAdmin || !isVerified);
  const canDelete = canEdit;
  const canVerify = userLoaded && isAdmin && !isVerified;
  return { canEdit, canDelete, canVerify };
}
