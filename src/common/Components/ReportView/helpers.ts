import seedmixData, { SeedmixSpecies } from 'common/data/seedmix';
import Occurrence from 'models/occurrence';

export type SpeciesNames = [string, string];

export function getUniqueSpecies(occurrences: Occurrence[]): SpeciesNames[] {
  const dict: any = {};

  const addToUniqueDict = (occ: Occurrence) => {
    const { species } = occ.getSpecies() || {};
    if (!species) return;

    const commonNames = species.commonNames || [];

    dict[species.scientificNameWithoutAuthor] = commonNames[0] || '';
  };

  occurrences.forEach(addToUniqueDict);

  return Object.entries(dict);
}

export function getSeedmixUse(
  occurrences: Occurrence[],
  seedmix: string
): [SpeciesNames[], SeedmixSpecies[]] {
  const seedmixSpecies = seedmixData[seedmix];
  if (!seedmixSpecies) {
    return [[], []];
  }

  const extractLatinName = ({ latin_name }: SeedmixSpecies) => latin_name; // eslint-disable-line camelcase
  const selectedSeedmixLatinNames = seedmixSpecies.map(extractLatinName);

  const seedmixIncludesSpecies = ([scientificName]: SpeciesNames) =>
    selectedSeedmixLatinNames.includes(scientificName);

  const species = getUniqueSpecies(occurrences);
  const recordedSeedmixSpecies = species.filter(seedmixIncludesSpecies);

  return [recordedSeedmixSpecies, seedmixSpecies];
}

export function getMissingSeedmixSpecies(
  occurrences: Occurrence[],
  seedmix: string
) {
  const [selectedSeedmixSpecies, totalSeedmixSpecies = []] = getSeedmixUse(
    occurrences,
    seedmix
  );

  const getMissingSelectedSeedmixSpecies = ({ latin_name: latinName }: any) => {
    const hasLatinName = ([latin]: any) => latin === latinName;
    return !selectedSeedmixSpecies.find(hasLatinName);
  };

  return totalSeedmixSpecies.filter(getMissingSelectedSeedmixSpecies);
}
