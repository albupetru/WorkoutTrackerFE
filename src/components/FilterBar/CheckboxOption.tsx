import { useEffect, useRef } from 'react';

const CheckboxOption = ({
  label,
  checked,
  indeterminate = false,
  depth = 0,
  onChange,
}: {
  label: string;
  checked: boolean;
  indeterminate?: boolean;
  depth?: number;
  onChange: () => void;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label className={`fb-option fb-option--depth-${depth}`}>
      <input ref={ref} type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
};

export default CheckboxOption;
