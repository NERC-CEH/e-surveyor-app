import { processResponse, filterUKSpecies } from '../plantNet';

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
      const plantNetResponse = {
        results: [fumariaSpecies],
        version: '',
      };

      // When
      const { results } = processResponse(plantNetResponse);

      // Then
      expect(results[0].warehouseId).toBe(17200);
    });

    it('should return results UK names', () => {
      // Given
      const plantNetResponse = {
        results: [fumariaSpecies],
        version: '',
      };

      // When
      const { results } = processResponse(plantNetResponse);

      // Then
      expect(results[0].species.commonNames[0]).toBe('Fumitory');
    });
  });

  describe('filterUKSpecies', () => {
    it('should filter out non-UK species', () => {
      // Given
      const nonUKSpecies = JSON.parse(JSON.stringify(fumariaSpecies));
      nonUKSpecies.species.scientificNameWithoutAuthor = 'Alpine Fumaria';
      const plantNetResponse = {
        results: [fumariaSpecies, nonUKSpecies],
        version: '',
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

      const plantNetResponse = {
        results: [fumariaSpecies, nonUKSpecies],
        version: '',
      };
      const { results } = processResponse(plantNetResponse);

      // When
      const filteredResults = filterUKSpecies(results);

      // Then
      expect(filteredResults.length).toBe(2);
    });
  });
});
