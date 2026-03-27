import { Tag } from '../../../../types/tag.types';
import TagCheckbox from './TagCheckbox';

const FlatTagList = ({
  tags,
  selectedTagIds,
  onToggle,
}: {
  tags: Tag[];
  selectedTagIds: string[];
  onToggle: (id: string) => void;
}) => (
  <div className="tf-checkbox-list">
    {tags.map((tag) => (
      <TagCheckbox
        key={tag.id}
        tag={tag}
        selected={selectedTagIds.includes(tag.id)}
        onToggle={onToggle}
      />
    ))}
  </div>
);

export default FlatTagList;
