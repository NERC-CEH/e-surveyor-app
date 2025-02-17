import { filterUKSpecies } from '../helpers';
import { processResponse } from '../plantNet';

const fumariaSpecies = {
  images: [],
  score: 0.5,
  species: {
    scientificNameWithoutAuthor: 'Fumaria',
    scientificNameAuthorship: '',
    genus: {
      scientificNameWithoutAuthor: '',
      scientificNameAuthorship: '',
      scientificName: '',
    },
    family: {
      scientificNameWithoutAuthor: '',
      scientificNameAuthorship: '',
      scientificName: '',
    },
    commonNames: [],
    scientificName: '',
  },
};

describe('filterUKSpecies', () => {
  it('should filter out non-UK species', () => {
    // Given
    const nonUKSpecies = JSON.parse(JSON.stringify(fumariaSpecies));
    nonUKSpecies.species.scientificNameWithoutAuthor = 'Alpine Fumaria';
    const plantNetResponse: any = {
      suggestions: [
        {
          taxon: fumariaSpecies.species.scientificNameWithoutAuthor,
          record_cleaner: 'pass',
        },
        {
          taxon: nonUKSpecies.species.scientificNameWithoutAuthor,
          record_cleaner: 'pass',
        },
      ],
      raw: {
        results: [fumariaSpecies, nonUKSpecies],
        version: '',
      },
    };
    const { results } = processResponse(plantNetResponse);

    // When
    const filteredResults = filterUKSpecies(results);

    // Then
    expect(filteredResults[0].warehouseId).toBe(17200);
    expect(filteredResults.length).toBe(1);
  });

  it('should not filter non-UK species with high scores', () => {
    // Given
    const nonUKSpecies = JSON.parse(JSON.stringify(fumariaSpecies));
    nonUKSpecies.species.scientificNameWithoutAuthor = 'Alpine Fumaria';
    nonUKSpecies.score = 1;

    const plantNetResponse: any = {
      suggestions: [
        {
          taxon: fumariaSpecies.species.scientificNameWithoutAuthor,
          record_cleaner: 'pass',
        },
        {
          taxon: nonUKSpecies.species.scientificNameWithoutAuthor,
          record_cleaner: 'pass',
        },
      ],
      raw: {
        results: [fumariaSpecies, nonUKSpecies],
        version: '',
      },
    };
    const { results } = processResponse(plantNetResponse);

    // When
    const filteredResults = filterUKSpecies(results);

    // Then
    expect(filteredResults.length).toBe(2);
  });
});
