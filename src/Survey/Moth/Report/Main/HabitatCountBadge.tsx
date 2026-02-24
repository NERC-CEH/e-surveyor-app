import { Badge } from '@flumens';
import mothTraits, { SpeciesTraits } from 'common/data/moths/traits';

// index traits by TVK for fast lookup
const traitsByTvk: Record<string, SpeciesTraits> = {};
mothTraits.forEach(trait => {
  traitsByTvk[trait.tvk] = trait;
});

const HABITAT_KEYS = [
  'habitatGeneralist',
  'habitatWoodland',
  'habitatGrassland',
  'habitatUplandHeathlandMoorland',
  'habitatWetland',
] as const;

const getHabitatCount = (traits: SpeciesTraits): number =>
  HABITAT_KEYS.filter(key => traits[key]).length;

type Props = {
  tvk?: string;
};

const HabitatCountBadge = ({ tvk }: Props) => {
  const traits = traitsByTvk[tvk!];
  if (!traits) return null;

  const count = getHabitatCount(traits);
  if (!count) return null;

  return (
    <Badge color="tertiary" className="bg-violet-100 text-[0.6rem]">
      {`${count}`} habitat{count !== 1 ? 's' : ''}
    </Badge>
  );
};

export default HabitatCountBadge;
