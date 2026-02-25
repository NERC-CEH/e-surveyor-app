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
  const icon = '';

  const label = traitsByTvk[tvk!]?.nationalRarity;
  if (!label) return null;

  return (
    <span className="text-sm">
      GB: {icon} {label}
    </span>
  );
};

export default NationalRarityBadge;
