import { useNavigate } from 'react-router-dom';

interface NameCellProps {
  exerciseId: string;
  exerciseName: string;
  description?: string;
}

const NameCell = ({ exerciseId, exerciseName, description }: NameCellProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="exercise-name-cell"
      onClick={() => navigate(`/exercise/${exerciseId}`)}
    >
      {' '}
      <div className="accent-bar" />
      <div>
        <span className="exercise-name">{exerciseName}</span>
        {description && (
          <span className="exercise-subtitle">{description}</span>
        )}
      </div>
    </div>
  );
};

export default NameCell;
