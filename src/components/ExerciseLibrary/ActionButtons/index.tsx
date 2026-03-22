import { useNavigate } from "react-router-dom";
import { Exercise } from "../../../types/exercise.types";
import { useDeleteExercise, useVerifyExercise } from "../../../api/exercises";
import useAuth from "../../authentication/useAuth";
import Button from "../../Button";
import "./style.scss";

interface ActionButtonsProps {
  exercise: Exercise;
}

const ActionButtons = ({ exercise }: ActionButtonsProps) => {
  const navigate = useNavigate();
  const { isAdmin, userLoaded } = useAuth();
  const deleteMutation = useDeleteExercise();
  const verifyMutation = useVerifyExercise();

  if (!userLoaded) return null;

  const isVerified = !!exercise.verifiedOn;
  const canEdit = isAdmin || !isVerified;
  const canDelete = canEdit;
  const canVerify = isAdmin && !isVerified;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${exercise.name}"?`)) {
      deleteMutation.mutate(exercise.id, {
        onSuccess: () => {
          console.log("Exercise deleted successfully");
        },
        onError: (error) => {
          console.error("Failed to delete exercise:", error);
          alert("Failed to delete exercise. Please try again.");
        },
      });
    }
  };

  const handleVerify = () => {
    verifyMutation.mutate(exercise.id, {
      onSuccess: () => {
        console.log("Exercise verified successfully");
      },
      onError: (error) => {
        console.error("Failed to verify exercise:", error);
        alert("Failed to verify exercise. Please try again.");
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
