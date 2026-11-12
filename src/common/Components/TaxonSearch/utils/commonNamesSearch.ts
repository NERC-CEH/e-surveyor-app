import speciesNames from 'common/data/commonNames/index.json';
import type { Species } from './searchHelpers';

const MAX_RESULTS = 200;

export default (normSearchPhrase: string, results: Species[]) => {
  const commonNames: Species[] = [];

  speciesNames.forEach(
    ({
      warehouseId,
      scientificName,
      commonName,
      preferredId,
      tvk,
      difficulty,
      frequency,
    }) => {
      if (
        commonName.match(new RegExp(normSearchPhrase, 'i')) &&
        results.length + commonNames.length <= MAX_RESULTS
      ) {
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

  commonNames.sort(
    (a, b) =>
      a.commonName!.split(' ').length - b.commonName!.split(' ').length ||
      a.commonName!.localeCompare(b.commonName!)
  );

  results.push(...commonNames);
  return results;
};
