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
  const hostPlants = traitsByTvk[tvk]?.hostPlants;
  if (!hostPlants) return null;

  return (
    <div className="inline-flex items-center gap-1 text-sm w-full">
      <span className="text-nowrap mr-2 font-medium min-w-25">
        Caterpillars eat:
      </span>{' '}
      {hostPlants}
    </div>
  );
};

export default HostPlantBadge;
