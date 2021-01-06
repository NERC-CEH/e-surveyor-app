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
    ({ warehouse_id, scientific_name, common_name, preferredId }) => {
      const matches = common_name.match(new RegExp(normSearchPhrase, 'i'));
      if (matches && results.length + commonNames.length <= MAX_RESULTS) {
        commonNames.push({
          found_in_name: 'common_name',
          warehouse_id,
          common_name,
          scientific_name,
          preferredId,
        });
      }
    }
  );

  const alphabetically = (sp1, sp2) =>
    sp1.common_name.localeCompare(sp2.common_name);

  const byCommonNameLength = (sp1, sp2) =>
    sp1.common_name.split(' ').length - sp2.common_name.split(' ').length;

  commonNames = commonNames.sort(alphabetically).sort(byCommonNameLength);

  results.push(...commonNames);
  return results;
};
