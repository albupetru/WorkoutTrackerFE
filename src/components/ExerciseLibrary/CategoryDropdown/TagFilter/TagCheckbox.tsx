import { Tag } from '../../../../types/tag.types';

const TagCheckbox = ({
  tag,
  selected,
  onToggle,
}: {
  tag: Tag;
  selected: boolean;
  onToggle: (id: string) => void;
}) => (
  <label className="tf-checkbox-option">
    <input
      type="checkbox"
      checked={selected}
      onChange={() => onToggle(tag.id)}
    />
    {tag.name}
  </label>
);

export default TagCheckbox;
