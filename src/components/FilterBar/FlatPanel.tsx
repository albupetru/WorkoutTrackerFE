import { Tag } from '../../types/tag.types';
import CheckboxOption from './CheckboxOption';

const FlatPanel = ({
  tags,
  selectedTagIds,
  onChange,
}: {
  tags: Tag[];
  selectedTagIds: string[];
  onChange: (ids: string[]) => void;
}) => {
  const selectedSet = new Set(selectedTagIds);
  const toggle = (id: string) => {
    if (selectedSet.has(id)) {
      onChange(selectedTagIds.filter((x) => x !== id));
    } else {
      onChange([...selectedTagIds, id]);
    }
  };

  return (
    <>
      {tags.map((tag) => (
        <CheckboxOption
          key={tag.id}
          label={tag.name}
          checked={selectedSet.has(tag.id)}
          onChange={() => toggle(tag.id)}
        />
      ))}
    </>
  );
};

export default FlatPanel;
