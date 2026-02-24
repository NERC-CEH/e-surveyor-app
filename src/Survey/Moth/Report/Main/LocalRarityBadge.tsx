import { Badge } from '@flumens';
import localRarityData from 'common/data/moths/local_rarity.json';

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

const LocalRarityBadge = ({ tvk, grid: gridSquareLetters }: Props) => {
  if (!tvk || !gridSquareLetters) return null;

  const data = localRarityData as RarityData;
  let label = 'No data';

  const speciesData = data[tvk];
  if (speciesData) {
    label = 'Rare';

    if (speciesData?.[gridSquareLetters]) {
      label =
        speciesData?.[gridSquareLetters] === UNCOMMON ? 'Uncommon' : 'Common';
    }
  }

  return (
    <Badge color="warning" className="bg-amber-100 text-[0.6rem]">
      {label}
    </Badge>
  );
};

export default LocalRarityBadge;
