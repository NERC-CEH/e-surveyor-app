import { Badge } from '@flumens';
import { NewnessResult } from '../services/newnessService';

type Props = {
  newness: NewnessResult;
};

const NewnessBadges = ({ newness }: Props) => {
  const { isNewForWebsite, isNewForYear, isNewForGrid } = newness;

  // no badges if all statuses are false
  if (!isNewForWebsite && !isNewForYear && !isNewForGrid) return null;

  return (
    <div className="flex gap-1">
      {isNewForWebsite && (
        <Badge color="secondary" className="bg-orange-100 text-[0.6rem]">
          New species
        </Badge>
      )}

      {isNewForYear && (
        <Badge color="tertiary" className="bg-blue-100 text-[0.6rem]">
          New this year
        </Badge>
      )}

      {isNewForGrid && (
        <Badge color="success" className="bg-green-100 text-[0.6rem]">
          New for area
        </Badge>
      )}
    </div>
  );
};

export default NewnessBadges;
