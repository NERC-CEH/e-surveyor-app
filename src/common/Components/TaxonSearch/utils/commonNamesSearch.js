import speciesNames from 'common/data/commonNames/index.json';

const MAX_RESULTS = 200;

export default (normSearchPhrase, results) => {
  const languageSpeciesNames = speciesNames;
  if (!languageSpeciesNames) {
    return results;
  }

  let commonNames = [];
  languageSpeciesNames.forEach(
    // eslint-disable-next-line
    ({ warehouseId, scientificName, commonName, preferredId, tvk }) => {
      const matches = commonName.match(new RegExp(normSearchPhrase, 'i'));
      if (matches && results.length + commonNames.length <= MAX_RESULTS) {
        commonNames.push({
          foundInName: 'commonName',
          warehouseId,
          commonName,
          scientificName,
          preferredId,
          tvk,
        });
      }
    }
  );

  const alphabetically = (sp1, sp2) =>
    sp1.commonName.localeCompare(sp2.commonName);

  const byCommonNameLength = (sp1, sp2) =>
    sp1.commonName.split(' ').length - sp2.commonName.split(' ').length;

  commonNames = commonNames.sort(alphabetically).sort(byCommonNameLength);

  results.push(...commonNames);
  return results;
};
