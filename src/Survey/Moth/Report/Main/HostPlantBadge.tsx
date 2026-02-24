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

const HostPlantBadge = ({ tvk }: Props) => {
  const hostPlants = traitsByTvk[tvk!]?.hostPlants;
  if (!hostPlants) return null;

  return (
    <Badge color="success" className="bg-emerald-100 text-[0.6rem]">
      Caterpillars eat: {hostPlants}
    </Badge>
  );
};

export default HostPlantBadge;
