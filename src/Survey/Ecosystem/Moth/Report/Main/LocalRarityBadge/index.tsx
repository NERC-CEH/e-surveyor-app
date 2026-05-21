import localRarityData from 'common/data/moths/local_rarity.json';
import DotIcon from './one-circle.svg?react';
import ThreeDotIcon from './three-circles.svg?react';
import TwoDotIcon from './two-circles.svg?react';

// values: 1 = common, 2 = uncommon, null = rare,
const UNCOMMON = 2;

type RarityData = Record<string, Record<string, number>>;

type Props = {
  tvk?: string;
  /**
   * 100km grid square letters (e.g. "SU", "TQ"). This is used to look up the local rarity of a species in the grid square where the sample was taken.
   */
  grid?: string;
};

const LocalRarityBadge = ({ tvk, grid }: Props) => {
  if (!tvk || !grid) return null;

  const data = localRarityData as RarityData;
  let label = 'No data';
  let icon: any = '';

  const speciesData = data[tvk];
  if (speciesData) {
    label = 'Rare';
    icon = <DotIcon className="fill-danger" />;

    if (speciesData?.[grid]) {
      icon = <ThreeDotIcon className="fill-primary-600" />;
      label = 'Common';

      if (speciesData[grid] === UNCOMMON) {
        icon = <TwoDotIcon className="fill-secondary-600" />;
        label = 'Uncommon';
      }
    }
  }

  return (
    <div className="inline-flex items-center gap-1 text-sm w-full">
      <span className="min-w-18 font-medium">Your area:</span> {icon} {label}
    </div>
  );
};

export default LocalRarityBadge;
