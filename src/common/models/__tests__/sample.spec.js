/* eslint-disable max-classes-per-file */

import Sample from '../sample';

describe('Sample', () => {
  describe('getSupportedSpeciesList', () => {
    it('should return pollinators list', () => {
      // Given
      const plants = [['Poterium sanguisorba']];

      // When
      const pollinators = Sample.getSupportedSpeciesList(plants);

      // Then
      expect(pollinators).toEqual([
        {
          group: 'Butterfly',
          plant: 'Poterium sanguisorba',
          pollinator: 'Polyommatus icarus',
          pollinator_common_name: 'Common Blue',
        },
      ]);
    });
  });
});
