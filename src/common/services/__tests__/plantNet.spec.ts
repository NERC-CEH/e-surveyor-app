import { processResponse } from '../plantNet';
import IndiciaAIResponse from '../plantNet/indiciaAIResponse.d';
import PlantNetResponse from '../plantNet/plantNetResponse.d';

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

const plantNetResponse: IndiciaAIResponse<PlantNetResponse> = {
  suggestions: [
    {
      taxon: fumariaSpecies.species.scientificNameWithoutAuthor,
      record_cleaner: 'pass',
      default_common_name: 'Fumitory',
      probability: 0,
      taxa_taxon_list_id: '17200',
      taxon_group_id: '',
      external_key: '',
      organism_key: '',
    },
  ],
  raw: {
    results: [fumariaSpecies],
    version: '',
    language: '',
    preferedReferential: '',
    bestMatch: '',
    remainingIdentificationRequests: 0,
    query: null as any,
  },
  classifier_id: '',
  classifier_version: '',
};

describe('plantNet service', () => {
  describe('processResponse', () => {
    it('should return with warehouse IDs', () => {
      // Given

      // When
      const { results } = processResponse(plantNetResponse);

      // Then
      expect(results[0].warehouseId).toBe(17200);
    });

    it('should return results UK names', () => {
      // Given

      // When
      const { results } = processResponse(plantNetResponse);

      // Then
      expect(results[0].commonNames[0]).toBe('Fumitory');
    });
  });
});
