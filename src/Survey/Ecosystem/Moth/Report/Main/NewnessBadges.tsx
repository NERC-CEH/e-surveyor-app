import { Badge } from '@flumens';
import { NewnessResult } from '../newness.api';

type Props = {
  newness: NewnessResult;
};

const NewnessBadges = ({ newness }: Props) => {
  const { isNewForWebsite, isNewForYear, isNewForGrid } = newness;

  // no badges if all statuses are false
  if (!isNewForWebsite && !isNewForYear && !isNewForGrid) return null;

  return (
    <div className="flex flex-col gap-1">
      {isNewForWebsite && (
        <Badge
          color="secondary"
          className="bg-secondary-100 text-secondary-800 w-full text-center"
          size="small"
        >
          New to app
        </Badge>
      )}

      {isNewForYear && (
        <Badge
          color="tertiary"
          className="text-tertiary-800 w-full text-center"
          size="small"
        >
          New this year
        </Badge>
      )}

      {isNewForGrid && (
        <Badge
          color="success"
          className="text-success-800 w-full text-center"
          size="small"
        >
          New for site
        </Badge>
      )}
    </div>
  );
};

export default NewnessBadges;
