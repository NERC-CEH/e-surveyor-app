import { SeedmixSpecies } from 'common/data/seedmix';
import Occurrence from 'models/occurrence';

type ScientificName = string;
type CommonName = string;
type TVK = string;
export type SpeciesNames =
  | [ScientificName, CommonName]
  | [ScientificName, CommonName, TVK];

export function getUniqueSpecies(occurrences: Occurrence[]): SpeciesNames[] {
  const dict: any = {};

  const addToUniqueDict = (occ: Occurrence) => {
    const species = occ.getSpecies();
    if (!species) return;

    const { commonName, scientificName, tvk } = species;

    dict[scientificName] = [commonName || '', tvk];
  };

  occurrences.forEach(addToUniqueDict);

  return Object.entries(dict).map((s: any) => [s[0], ...s[1]] as any);
}

export function getSeedmixUse(
  occurrences: Occurrence[],
  seedmixSpecies: SeedmixSpecies[]
): SpeciesNames[] {
  const extractLatinName = ({ latinName }: SeedmixSpecies) => latinName;
  const selectedSeedmixLatinNames = seedmixSpecies.map(extractLatinName);

  const seedmixIncludesSpecies = ([scientificName]: SpeciesNames) =>
    selectedSeedmixLatinNames.includes(scientificName);

  const species = getUniqueSpecies(occurrences);
  return species.filter(seedmixIncludesSpecies);
}

export function getMissingSeedmixSpecies(
  occurrences: Occurrence[],
  seedmixSpecies: SeedmixSpecies[]
) {
  const selectedSeedmixSpecies = getSeedmixUse(occurrences, seedmixSpecies);

  const getMissingSelectedSeedmixSpecies = ({ latinName }: any) => {
    const hasLatinName = ([latin]: any) => latin === latinName;
    return !selectedSeedmixSpecies.find(hasLatinName);
  };

  return seedmixSpecies.filter(getMissingSelectedSeedmixSpecies);
}
