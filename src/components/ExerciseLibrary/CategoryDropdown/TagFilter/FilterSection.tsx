import { useState } from 'react';
import { SECTION_LABELS } from '../../../../utils/tagConstants';

const FilterSection = ({
  tagType,
  children,
  defaultOpen = false,
}: {
  tagType: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const label = SECTION_LABELS[tagType] ?? tagType;

  return (
    <div className="tf-section">
      <button
        type="button"
        className="tf-section-header"
        aria-expanded={open}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="tf-section-label">{label}</span>
        <span className="material-symbols-outlined tf-section-chevron">
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>
      {open && <div className="tf-section-body">{children}</div>}
    </div>
  );
};

export default FilterSection;
