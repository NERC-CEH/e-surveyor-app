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
    it('should return with warehouse IDs', async () => {
      // Given
      const plantNetResponse = {
        results: [fumariaSpecies],
      };

      // When
      const updated = await processResponse(plantNetResponse);

      // Then
      expect(updated[0].warehouseId).toBe(17200);
    });

    it('should filter out non-UK species', async () => {
      // Given
      const nonUKSpecies = JSON.parse(JSON.stringify(fumariaSpecies));
      nonUKSpecies.species.scientificNameWithoutAuthor = 'Alpine Fumaria';
      const plantNetResponse = {
        results: [fumariaSpecies, nonUKSpecies],
      };

      // When
      const updated = await processResponse(plantNetResponse);

      // Then
      expect(updated[0].warehouseId).toBe(17200);
      expect(updated.length).toBe(1);
    });

    it('should not filter non-UK species with high scores', async () => {
      // Given
      const nonUKSpecies = JSON.parse(JSON.stringify(fumariaSpecies));
      nonUKSpecies.species.scientificNameWithoutAuthor = 'Alpine Fumaria';
      nonUKSpecies.score = 1;

      const plantNetResponse = {
        results: [fumariaSpecies, nonUKSpecies],
      };

      // When
      const updated = await processResponse(plantNetResponse);

      // Then
      expect(updated.length).toBe(2);
    });

    it('should return updated UK names', async () => {
      // Given
      const plantNetResponse = {
        results: [fumariaSpecies],
      };

      // When
      const updated = await processResponse(plantNetResponse);

      // Then
      expect(updated[0].species.commonNames[0]).toBe('Fumitory');
    });
  });
});
