import speciesNames from 'common/data/commonNames/index.json';

const MAX_RESULTS = 200;

export default (normSearchPhrase: any, results: any) => {
  const languageSpeciesNames = speciesNames;
  if (!languageSpeciesNames) {
    return results;
  }

  let commonNames: any = [];
  languageSpeciesNames.forEach(
    // eslint-disable-next-line
    ({
      warehouseId,
      scientificName,
      commonName,
      preferredId,
      tvk,
      difficulty,
      frequency,
    }) => {
      const matches = commonName.match(new RegExp(normSearchPhrase, 'i'));
      if (matches && results.length + commonNames.length <= MAX_RESULTS) {
        commonNames.push({
          foundInName: 'commonName',
          warehouseId,
          commonName,
          scientificName,
          preferredId,
          tvk,
          difficulty,
          frequency,
        });
      }
    }
  );

  const alphabetically = (sp1: any, sp2: any) =>
    sp1.commonName.localeCompare(sp2.commonName);

  const byCommonNameLength = (sp1: any, sp2: any) =>
    sp1.commonName.split(' ').length - sp2.commonName.split(' ').length;

  commonNames = commonNames.sort(alphabetically).sort(byCommonNameLength);

  results.push(...commonNames);
  return results;
};
