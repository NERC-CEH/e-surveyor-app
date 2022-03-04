import seedmixData from 'common/data/seedmix';

export function getUniqueSpecies(occurrences) {
  const dict = {};

  const addToUniqueDict = occ => {
    const { species } = occ.getSpecies() || {};

    if (!species) return;

    const commonNames = species.commonNames || [];

    dict[species.scientificNameWithoutAuthor] = commonNames.length
      ? commonNames[0]
      : null;
  };

  occurrences.forEach(addToUniqueDict);

  return Object.entries(dict);
}

export function getSeedmixUse(occurrences, seedmix) {
  const seedmixSpecies = seedmixData[seedmix];
  if (!seedmixSpecies) {
    return [[]];
  }

  const extractLatinName = ({ latin_name }) => latin_name; // eslint-disable-line camelcase
  const selectedSeedmixLatinNames = seedmixSpecies.map(extractLatinName);

  const seedmixIncludesSpecies = ([scientificName]) =>
    selectedSeedmixLatinNames.includes(scientificName);

  const species = getUniqueSpecies(occurrences);
  const recordedSeedmixSpecies = species.filter(seedmixIncludesSpecies);

  return [recordedSeedmixSpecies, seedmixSpecies];
}
