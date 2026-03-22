import { useNavigate } from "react-router-dom";

interface NameCellProps {
  exerciseId: string;
  exerciseName: string;
}

const NameCell = ({ exerciseId, exerciseName }: NameCellProps) => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(`/exercise/${exerciseId}`)}>
      {exerciseName}
    </button>
  );
};

export default NameCell;
