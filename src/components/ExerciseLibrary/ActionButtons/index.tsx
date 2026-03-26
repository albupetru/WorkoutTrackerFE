import { useNavigate } from 'react-router-dom';
import { Exercise } from '../../../types/exercise.types';
import { useDeleteExercise, useVerifyExercise } from '../../../api/exercises';
import useAuth from '../../authentication/useAuth';
import { getExercisePermissions } from '../../../utils/exercisePermissions';
import Button from '../../Button';
import './style.scss';

interface ActionButtonsProps {
  exercise: Exercise;
}

const ActionButtons = ({ exercise }: ActionButtonsProps) => {
  const navigate = useNavigate();
  const { isAdmin, userLoaded } = useAuth();
  const deleteMutation = useDeleteExercise();
  const verifyMutation = useVerifyExercise();

  if (!userLoaded) {
    return null;
  }

  const { canEdit, canDelete, canVerify } = getExercisePermissions(
    exercise,
    isAdmin,
    userLoaded,
  );

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${exercise.name}"?`)) {
      deleteMutation.mutate(exercise.id, {
        onError: () => {
          alert('Failed to delete exercise. Please try again.');
        },
      });
    }
  };

  const handleVerify = () => {
    verifyMutation.mutate(exercise.id, {
      onError: () => {
        alert('Failed to verify exercise. Please try again.');
      },
    });
  };

  return (
    <div className="action-buttons">
      {canEdit && (
        <Button onClick={() => navigate(`/exercise/${exercise.id}/edit`)}>
          ✏️ Edit
        </Button>
      )}

      {canVerify && <Button onClick={handleVerify}>✓ Verify</Button>}

      {canDelete && <Button onClick={handleDelete}>🗑️ Delete</Button>}
    </div>
  );
};

export default ActionButtons;
