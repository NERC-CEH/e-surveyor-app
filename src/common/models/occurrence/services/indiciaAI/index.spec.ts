import { processSuggestion } from '.';
import IndiciaAIResponse from './indiciaAIResponse.d';

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

const plantNetResponse: IndiciaAIResponse<any> = {
  suggestions: [
    {
      taxon: fumariaSpecies.species.scientificNameWithoutAuthor,
      record_cleaner: 'pass',
      default_common_name: 'Fumitory',
      probability: 0.5,
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
      const suggestions = processSuggestion(plantNetResponse);

      // Then
      expect(suggestions[0].warehouseId).toBe(17200);
    });

    it('should return suggestions UK names', () => {
      // Given

      // When
      const suggestions = processSuggestion(plantNetResponse);

      // Then
      expect(suggestions[0].commonNames[0]).toBe('Fumitory');
    });
  });
});
