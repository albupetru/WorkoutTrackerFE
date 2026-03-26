import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useBlocker } from 'react-router-dom';
import {
  useExercise,
  useCreateExercise,
  useUpdateExercise,
} from '../../api/exercises';
import useAuth from '../authentication/useAuth';
import TagSelect from '../TagSelect';
import { REQUIRED_SECTIONS } from '../TagSelect/tagUtils';
import { getLeafTags } from '../../utils/tagUtils';
import { useTagGroups } from '../../hooks/useTags';
import './style.scss';

interface ExerciseFormProps {
  mode: 'create' | 'edit';
}

const ExerciseForm = ({ mode }: ExerciseFormProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin, userLoaded } = useAuth();

  const { data: exercise, isLoading: exerciseLoading } = useExercise(
    mode === 'edit' ? id : undefined,
  );

  const createMutation = useCreateExercise();
  const updateMutation = useUpdateExercise();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<string[]>(['']);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [stepsError, setStepsError] = useState('');
  const [tagsError, setTagsError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const stepInputRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  const { data: tagGroups = [] } = useTagGroups();

  // Populate form in edit mode
  useEffect(() => {
    if (mode === 'edit' && exercise) {
      setName(exercise.name);
      setDescription(exercise.description || '');
      const parsedSteps = exercise.instructions
        ? exercise.instructions
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean)
        : [''];
      setSteps(parsedSteps.length > 0 ? parsedSteps : ['']);
      setTagIds(exercise.tags.map((t) => t.id));
    }
  }, [exercise, mode]);

  // Authorization check for edit mode
  useEffect(() => {
    if (mode === 'edit' && userLoaded && exercise) {
      const isVerified = !!exercise.verifiedOn;
      if (!isAdmin && isVerified) {
        navigate(`/exercise/${id}`);
      }
    }
  }, [exercise, mode, userLoaded, isAdmin, id, navigate]);

  // Focus name input on mount (once data is loaded)
  useEffect(() => {
    if (!exerciseLoading) {
      nameInputRef.current?.focus();
    }
  }, [exerciseLoading]);

  // Warn on browser close / refresh when there are unsaved changes
  // Block all React Router navigation when dirty
  useBlocker(() => {
    if (isDirty) {
      return !window.confirm(
        'The changes you\'ve made to this exercise will be lost. Are you sure?',
      );
    }
    return false;
  });

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Recalculate all step textarea heights whenever steps change (handles deletion shrink)
  useEffect(() => {
    stepInputRefs.current.forEach((el) => {
      if (el) {
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
      }
    });
  }, [steps]);

  const addStep = () => {
    setIsDirty(true);
    setSteps((prev) => {
      const next = [...prev, ''];
      setTimeout(() => {
        stepInputRefs.current[next.length - 1]?.focus();
      }, 0);
      return next;
    });
  };

  const updateStep = (index: number, value: string) => {
    setIsDirty(true);
    setSteps((prev) => {
      const next = prev.map((s, i) => (i === index ? value : s));
      if (submitted) {
        setStepsError(
          next.some((s) => s.trim())
            ? ''
            : 'At least one instruction step is required',
        );
      }
      return next;
    });
  };

  const removeStep = (index: number) => {
    setIsDirty(true);
    if (steps.length === 1) {
      setSteps(['']);
      return;
    }
    setSteps((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setTimeout(() => {
        const focusIdx = Math.min(index, next.length - 1);
        stepInputRefs.current[focusIdx]?.focus();
      }, 0);
      return next;
    });
  };

  const validate = () => {
    let valid = true;
    if (!name.trim()) {
      setNameError('Exercise name is required');
      valid = false;
    } else {
      setNameError('');
    }
    if (!description.trim()) {
      setDescriptionError('Description is required');
      valid = false;
    } else {
      setDescriptionError('');
    }
    if (!steps.some((s) => s.trim())) {
      setStepsError('At least one instruction step is required');
      valid = false;
    } else {
      setStepsError('');
    }
    const missingCategory = tagGroups
      .filter((g) => REQUIRED_SECTIONS.has(g.tagType))
      .some((g) => {
        const leafIds = getLeafTags(g).map((t) => t.id);
        return !tagIds.some((id) => leafIds.includes(id));
      });
    if (missingCategory) {
      setTagsError(
        'All highlighted tag categories require at least one selection',
      );
      valid = false;
    } else {
      setTagsError('');
    }
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // we prevent default form submission to handle validation and async logic manually
    setSubmitted(true);
    if (!validate()) {
      if (!name.trim()) {
        nameInputRef.current?.focus();
      }
      return;
    }

    const instructions = steps.filter((s) => s.trim()).join('\n') || undefined;

    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      instructions,
      tagIds,
    };

    if (mode === 'create') {
      createMutation.mutate(payload, {
        onSuccess: (exercise) => {
          setIsDirty(false);
          navigate(`/exercise/${exercise.id}`);
        },
      });
    } else {
      updateMutation.mutate(
        { ...payload, id: id! },
        {
          onSuccess: (exercise) => {
            setIsDirty(false);
            navigate(`/exercise/${exercise.id}`);
          },
        },
      );
    }
  };

  const handleDiscard = () => {
    navigate(mode === 'edit' ? `/exercise/${id}` : '/exercise-library');
  };

  if (mode === 'edit' && exerciseLoading) {
    return (
      <div className="exercise-form-state">
        <span className="material-symbols-outlined">hourglass_empty</span>
        <p>Loading exercise...</p>
      </div>
    );
  }

  if (mode === 'edit' && !exerciseLoading && !exercise) {
    return (
      <div className="exercise-form-state">
        <span className="material-symbols-outlined">error_outline</span>
        <p>Exercise not found</p>
        <button onClick={() => navigate('/exercise-library')}>
          Back to Library
        </button>
      </div>
    );
  }

  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error || updateMutation.error;
  const errorMessage = mutationError?.message ?? null;

  return (
    <div className="exercise-form-wrapper">
      <div className="exercise-form-header">
        <h1 className="exercise-form-title">
          {mode === 'create' ? (
            <>
              New <span className="accent">Exercise</span>
            </>
          ) : (
            <>
              Edit <span className="accent">Exercise</span>
            </>
          )}
        </h1>
      </div>

      <form className="exercise-form" onSubmit={handleSubmit} noValidate>
        <section className="exercise-form-identity">
          <div
            className={`exercise-form-field ${nameError ? 'has-error' : ''}`}
          >
            <label className="exercise-form-label">
              Exercise Name{' '}
              <span className="exercise-form-label-optional">(required)</span>
            </label>
            <input
              ref={nameInputRef}
              className="exercise-form-name-input"
              type="text"
              placeholder="e.g. BARBELL BULGARIAN SPLIT SQUAT"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setIsDirty(true);
                if (submitted) {
                  setNameError(
                    e.target.value.trim() ? '' : 'Exercise name is required',
                  );
                }
              }}
              onBlur={() => {
                if (submitted) {
                  setNameError(name.trim() ? '' : 'Exercise name is required');
                }
              }}
              maxLength={200}
              aria-required="true"
              aria-invalid={!!nameError}
            />
            {nameError && (
              <span className="exercise-form-error" role="alert">
                {nameError}
              </span>
            )}
          </div>

          <div className="exercise-form-field">
            <label className="exercise-form-label">
              Movement Description{' '}
              <span className="exercise-form-label-optional">(required)</span>
            </label>
            <textarea
              className={`exercise-form-textarea${descriptionError ? ' has-error' : ''}`}
              placeholder="Describe the mechanical intent and focus of this movement..."
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setIsDirty(true);
                if (submitted) {
                  setDescriptionError(
                    e.target.value.trim() ? '' : 'Description is required',
                  );
                }
                const el = e.target;
                el.style.height = 'auto';
                el.style.height = `${el.scrollHeight}px`;
              }}
              onBlur={() => {
                if (submitted) {
                  setDescriptionError(
                    description.trim() ? '' : 'Description is required',
                  );
                }
              }}
              maxLength={2000}
            />
            {descriptionError && (
              <span className="exercise-form-error" role="alert">
                {descriptionError}
              </span>
            )}
          </div>
        </section>

        <section className="exercise-form-instructions">
          <div className="exercise-form-instructions-header">
            <label className="exercise-form-label">
              Instructions{' '}
              <span className="exercise-form-label-optional">(required)</span>
            </label>
            <button
              type="button"
              className="exercise-form-add-step-btn"
              onClick={addStep}
            >
              <span className="material-symbols-outlined">add_circle</span>
              Add Step
            </button>
          </div>
          {stepsError && (
            <span className="exercise-form-error" role="alert">
              {stepsError}
            </span>
          )}
          <div className="exercise-form-steps">
            {steps.map((step, i) => (
              <div key={i} className="exercise-form-step">
                <span className="exercise-form-step-number">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <textarea
                  ref={(el) => {
                    stepInputRefs.current[i] = el;
                  }}
                  className="exercise-form-step-input"
                  rows={1}
                  placeholder={`Step ${i + 1}...`}
                  value={step}
                  onChange={(e) => {
                    updateStep(i, e.target.value);
                    const el = e.target;
                    el.style.height = 'auto';
                    el.style.height = `${el.scrollHeight}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addStep();
                    }
                    if (e.key === 'Backspace' && step === '') {
                      e.preventDefault();
                      removeStep(i);
                    }
                  }}
                  onBlur={() => {
                    if (submitted) {
                      setStepsError(
                        steps.some((s) => s.trim())
                          ? ''
                          : 'At least one instruction step is required',
                      );
                    }
                  }}
                />
                {steps.length > 1 && (
                  <button
                    type="button"
                    className="exercise-form-step-remove"
                    onClick={() => removeStep(i)}
                    aria-label="Remove step"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="exercise-form-tags-section">
          <label className="exercise-form-label">
            Tags{' '}
            <span className="exercise-form-label-optional">
              (Comfort optional)
            </span>
          </label>
          <TagSelect
            selectedTagIds={tagIds}
            onChange={(ids) => {
              setTagIds(ids);
              setIsDirty(true);
              if (submitted && tagsError) {
                const missing = tagGroups
                  .filter((g) => REQUIRED_SECTIONS.has(g.tagType))
                  .some((g) => {
                    const leafIds = getLeafTags(g).map((t) => t.id);
                    return !ids.some((id) => leafIds.includes(id));
                  });
                setTagsError(
                  missing
                    ? 'All highlighted tag categories require at least one selection'
                    : '',
                );
              }
            }}
            showErrors={submitted}
          />
          {tagsError && (
            <span className="exercise-form-error" role="alert">
              {tagsError}
            </span>
          )}
        </section>

        {errorMessage && (
          <div className="exercise-form-error-banner" role="alert">
            <span className="material-symbols-outlined">error_outline</span>
            {errorMessage}
          </div>
        )}

        <div className="exercise-form-footer">
          <button
            type="button"
            className="exercise-form-discard-btn"
            onClick={handleDiscard}
            disabled={isPending}
          >
            Discard Draft
          </button>
          <button
            type="submit"
            className="exercise-form-submit-btn"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="material-symbols-outlined exercise-form-spinner">
                  progress_activity
                </span>
                {mode === 'create' ? 'Creating...' : 'Saving...'}
              </>
            ) : mode === 'create' ? (
              'Create Exercise'
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExerciseForm;
