import { Badge } from '@flumens';
import mothTraits, { SpeciesTraits } from 'common/data/moths/traits';

// index traits by TVK for fast lookup
const traitsByTvk: Record<string, SpeciesTraits> = {};
mothTraits.forEach(trait => {
  traitsByTvk[trait.tvk] = trait;
});

const HABITAT_LABELS: Record<string, string> = {
  habitatCoastal: 'Coastal',
  habitatWoodland: 'Woodland',
  habitatGrassland: 'Grassland',
  habitatHeathlandMoorland: 'Heathland',
  habitatMontaneUpland: 'Montane',
  habitatWetland: 'Wetland',
  habitatOther: 'Other',
};

const MAX_BADGES = 3;

const getHabitats = (traits: SpeciesTraits): string[] =>
  Object.keys(HABITAT_LABELS).filter(key => traits[key as keyof SpeciesTraits]);

type Props = {
  tvk?: string;
};

const HabitatCountBadge = ({ tvk }: Props) => {
  const traits = traitsByTvk[tvk!];
  if (!traits) return null;

  const habitats = getHabitats(traits);
  if (!habitats.length) return null;

  let habitatBadges;

  // show a single generalist badge if more than 3 habitats apply
  if (habitats.length > MAX_BADGES) {
    habitatBadges = (
      <Badge className="bg-neural-100 text-neutral-800" size="small">
        Generalist
      </Badge>
    );
  } else {
    habitatBadges = habitats.map(key => (
      <Badge key={key} className="bg-neural-100 text-neutral-800" size="small">
        {HABITAT_LABELS[key]}
      </Badge>
    ));
  }

  return (
    <div className="inline-flex items-center gap-1 text-sm w-full">
      <span className="text-nowrap mr-2 font-medium min-w-25">Habitats:</span>{' '}
      {habitatBadges}
    </div>
  );
};

export default HabitatCountBadge;
