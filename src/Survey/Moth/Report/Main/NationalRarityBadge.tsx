import { Badge } from '@flumens';
import mothTraits, { SpeciesTraits } from 'common/data/moths/traits';

// index traits by TVK for fast lookup
const traitsByTvk: Record<string, SpeciesTraits> = {};
mothTraits.forEach(trait => {
  traitsByTvk[trait.tvk] = trait;
});

type Props = {
  tvk: string;
};

const NationalRarityBadge = ({ tvk }: Props) => {
  const status = traitsByTvk[tvk!]?.nationalRarity;
  if (!status) return null;

  return (
    <Badge color="danger" className="bg-red-100 text-[0.6rem]">
      {status}
    </Badge>
  );
};

export default NationalRarityBadge;
