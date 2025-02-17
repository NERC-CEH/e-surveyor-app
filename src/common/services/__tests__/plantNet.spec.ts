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

describe('plantNet service', () => {
  describe('processResponse', () => {
    it('should return with warehouse IDs', () => {
      // Given
      const plantNetResponse: any = {
        suggestions: [
          {
            taxon: fumariaSpecies.species.scientificNameWithoutAuthor,
            record_cleaner: 'pass',
          },
        ],
        raw: {
          results: [fumariaSpecies],
          version: '',
        },
      };

      // When
      const { results } = processResponse(plantNetResponse);

      // Then
      expect(results[0].warehouseId).toBe(17200);
    });

    it('should return results UK names', () => {
      // Given
      const plantNetResponse: any = {
        suggestions: [
          {
            taxon: fumariaSpecies.species.scientificNameWithoutAuthor,
            record_cleaner: 'pass',
          },
        ],
        raw: {
          results: [fumariaSpecies],
          version: '',
        },
      };

      // When
      const { results } = processResponse(plantNetResponse);

      // Then
      expect(results[0].commonNames[0]).toBe('Fumitory');
    });
  });
});
