import { useState } from 'react';
import clsx from 'clsx';

type Props = {
  text: string;
  previewThreshold?: number;
  textClassName?: string;
  buttonClassName?: string;
  showMoreLabel?: string;
  showLessLabel?: string;
};

const DEFAULT_PREVIEW_THRESHOLD = 160;

const ExpandableText = ({
  text,
  previewThreshold = DEFAULT_PREVIEW_THRESHOLD,
  textClassName,
  buttonClassName,
  showMoreLabel = 'Show more',
  showLessLabel = 'Show less',
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isLong = text.length > previewThreshold;

  const onToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    // prevent parent labels from toggling related inputs when expanding text
    event.preventDefault();
    event.stopPropagation();

    setIsExpanded(previousState => !previousState);
  };

  return (
    <>
      <p
        className={clsx(textClassName, isLong && !isExpanded && 'line-clamp-2')}
      >
        {text}
      </p>

      {isLong && (
        <button type="button" onClick={onToggle} className={buttonClassName}>
          {isExpanded ? showLessLabel : showMoreLabel}
        </button>
      )}
    </>
  );
};

export default ExpandableText;
