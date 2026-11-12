import search from './scientificNamesSearch';
import type { Genera, Species } from './searchHelpers';

const genera: Genera = [
  [
    1,
    'Alpha',
    'alpha-tvk',
    [
      [2, 'beta', 'beta-tvk', 42, 2],
      [3, 'gamma', 'gamma-tvk', null, 3],
    ],
  ],
  [4, 'Beta', 'beta-genus-tvk', [[5, 'delta', 'delta-tvk']]],
  [6, 'Zeta', 'zeta-tvk'],
];

const MAX_RESULTS = 10;

describe('scientific name search', () => {
  it.each([
    { phrase: 'alpha', ids: [1, 2, 3] },
    { phrase: 'alpha be', ids: [2] },
    { phrase: 'beta', ids: [4, 5, 2] },
    { phrase: 'alpbe', ids: [2] },
    { phrase: 'zeta', ids: [6] },
    { phrase: 'missing', ids: [] },
  ])('preserves results for "$phrase"', ({ phrase, ids }) => {
    const results: Species[] = [];

    search(genera, phrase, results, MAX_RESULTS, false);

    expect(results.map(({ warehouseId }) => warehouseId)).toEqual(ids);
  });

  it('preserves species metadata for genus and species searches', () => {
    const genusResults: Species[] = [];
    const speciesResults: Species[] = [];

    search(genera, 'alpha', genusResults, MAX_RESULTS, false);
    search(genera, 'alpha be', speciesResults, MAX_RESULTS, false);

    expect(genusResults[1]).toEqual(speciesResults[0]);
    expect(speciesResults[0]).toEqual({
      arrayId: 0,
      speciesId: 0,
      foundInName: 'scientificName',
      warehouseId: 2,
      scientificName: 'Alpha beta',
      commonName: undefined,
      tvk: 'beta-tvk',
      frequency: 42,
      difficulty: 2,
    });
    expect(genusResults[2].frequency).toBeUndefined();
  });

  it('respects the result limit across search passes', () => {
    const results: Species[] = [];
    const limit = 2;

    search(genera, 'alpha', results, limit, false);

    expect(results.map(({ warehouseId }) => warehouseId)).toEqual([1, 2]);
  });
});
