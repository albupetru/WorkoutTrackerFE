import React from 'react';

interface StepInputProps {
  step: string;
  index: number;
  showRemove: boolean;
  inputRef: (el: HTMLTextAreaElement | null) => void;
  onUpdate: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onBlur: () => void;
}

const StepInput = ({
  step,
  index,
  showRemove,
  inputRef,
  onUpdate,
  onAdd,
  onRemove,
  onBlur,
}: StepInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(index, e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAdd();
    }
    if (e.key === 'Backspace' && step === '') {
      e.preventDefault();
      onRemove(index);
    }
  };

  return (
    <div className="exercise-form-step">
      <span className="exercise-form-step-number">
        {String(index + 1).padStart(2, '0')}
      </span>
      <textarea
        ref={inputRef}
        className="exercise-form-step-input"
        rows={1}
        placeholder={`Step ${index + 1}...`}
        value={step}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
      />
      {showRemove && (
        <button
          type="button"
          className="exercise-form-step-remove"
          onClick={() => onRemove(index)}
          aria-label="Remove step"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      )}
    </div>
  );
};

export default StepInput;
