import { useNavigate, useParams } from 'react-router-dom';
import {
  useExercise,
  useDeleteExercise,
  useVerifyExercise,
} from '../../api/exercises';
import useAuth from '../authentication/useAuth';
import './style.scss';

const ExerciseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: exercise,
    isLoading,
    isError,
    error,
    refetch,
  } = useExercise(id);
  const { isAdmin, userLoaded } = useAuth();
  const deleteMutation = useDeleteExercise();
  const verifyMutation = useVerifyExercise();

  if (isLoading) {
    return (
      <>
        <header className="exercise-detail-topbar">
          <button
            className="exercise-detail-back-btn"
            onClick={() => navigate('/exercise-library')}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to library
          </button>
        </header>
        <div className="exercise-detail-state">
          <span className="material-symbols-outlined">hourglass_empty</span>
          <p>Loading exercise...</p>
        </div>
      </>
    );
  }

  if (isError || !exercise) {
    const message =
      error instanceof Error ? error.message : 'Failed to load exercise';
    return (
      <>
        <header className="exercise-detail-topbar">
          <button
            className="exercise-detail-back-btn"
            onClick={() => navigate('/exercise-library')}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to library
          </button>
        </header>
        <div className="exercise-detail-state">
          <span className="material-symbols-outlined">error_outline</span>
          <p>{message}</p>
          <button onClick={() => refetch()}>Retry</button>
        </div>
      </>
    );
  }

  const isVerified = !!exercise.verifiedOn;
  const canEdit = userLoaded && (isAdmin || !isVerified);
  const canDelete = canEdit;
  const canVerify = userLoaded && isAdmin && !isVerified;

  const words = exercise.name.toUpperCase().split(' ');
  const titleFirstWord = words[0];
  const titleRest = words.slice(1).join(' ');

  const instructionSteps = exercise.instructions
    ? exercise.instructions
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${exercise.name}"?`)) {
      deleteMutation.mutate(exercise.id, {
        onSuccess: () => navigate('/exercise-library'),
        onError: () => alert('Failed to delete exercise. Please try again.'),
      });
    }
  };

  const handleVerify = () => {
    verifyMutation.mutate(exercise.id, {
      onError: () => alert('Failed to verify exercise. Please try again.'),
    });
  };

  return (
    <>
      {/* ---- Top Bar ---- */}
      <header className="exercise-detail-topbar">
        <button
          className="exercise-detail-back-btn"
          onClick={() => navigate('/exercise-library')}
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to library
        </button>

        {userLoaded && (canEdit || canVerify) && (
          <div className="exercise-detail-topbar-actions">
            {canEdit && (
              <button
                className="exercise-detail-action-btn exercise-detail-action-btn--edit"
                onClick={() => navigate(`/exercise/${exercise.id}/edit`)}
              >
                <span className="material-symbols-outlined">edit</span>
                Edit
              </button>
            )}
            {canVerify && (
              <button
                className="exercise-detail-action-btn exercise-detail-action-btn--verify"
                onClick={handleVerify}
                disabled={verifyMutation.isPending}
              >
                <span className="material-symbols-outlined">verified</span>
                {verifyMutation.isPending ? 'Verifying...' : 'Verify'}
              </button>
            )}
            {canDelete && (
              <button
                className="exercise-detail-action-btn exercise-detail-action-btn--delete"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                <span className="material-symbols-outlined">delete</span>
                Delete
              </button>
            )}
          </div>
        )}
      </header>

      {/* ---- Main Content ---- */}
      <div className="exercise-detail-content">
        {/* Title + Tags */}
        <header className="exercise-detail-header">
          <h1 className="exercise-detail-title">
            <span className="exercise-detail-title-primary">
              {titleFirstWord}
            </span>
            {titleRest && (
              <span className="exercise-detail-title-accent"> {titleRest}</span>
            )}
          </h1>

          {exercise.tags.length > 0 && (
            <div className="exercise-detail-tags">
              {exercise.tags.map((tag) => (
                <span key={tag.id} className="exercise-detail-tag">
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="exercise-detail-sections">
          {/* Description */}
          {exercise.description && (
            <div className="exercise-detail-description">
              <p>{exercise.description}</p>
            </div>
          )}

          {/* Instructions */}
          {instructionSteps.length > 0 && (
            <section className="exercise-detail-instructions">
              <h3 className="exercise-detail-instructions-heading">
                <span className="material-symbols-outlined">list_alt</span>
                Step-by-Step Instructions
              </h3>
              <div className="exercise-detail-steps">
                {instructionSteps.map((step, i) => (
                  <div key={i} className="exercise-detail-step">
                    <div className="exercise-detail-step-number">{i + 1}</div>
                    <p className="exercise-detail-step-text">{step}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default ExerciseDetail;
