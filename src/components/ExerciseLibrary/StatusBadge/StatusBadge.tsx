import { Exercise } from "../../../types/exercise.types";
import "./style.scss";

interface StatusBadgeProps {
  exercise: Exercise;
}

const StatusBadge = ({ exercise }: StatusBadgeProps) => {
  if (exercise.verifiedOn) {
    return (
      <span className="status-badge status-badge--verified">✓ Verified</span>
    );
  }

  return <span className="status-badge status-badge--pending">⏳ Pending</span>;
};

export default StatusBadge;
