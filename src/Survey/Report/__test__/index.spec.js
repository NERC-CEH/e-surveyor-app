import Sample from 'sample';
import Occurrence from 'occurrence';
import Image from 'common/models/image';
import config from 'Survey/config';
import { getLeagueTable, getMissingSeedmixSpecies } from '..';

describe('Settings Menu', () => {
  describe('getLeagueTable', () => {
    it('should return the table', () => {
      // Given
      const sample = new Sample();

      // When
      const table = getLeagueTable(sample);

      // Then
      expect(table.length > 1).toBe(true);
      expect(table[0]).toHaveProperty('name');
      expect(table[0]).toHaveProperty('pollinators');
      expect(table[0]).toHaveProperty('species');
    });

    it('should return add current survey to table', () => {
      // Given
      const sample = new Sample();

      // When
      const table = getLeagueTable(sample);

      // Then
      const lastEntry = table.length - 1;
      expect(table[lastEntry]).toHaveProperty('current', true);
    });
  });

  describe('getMissingSeedmixSpecies', () => {
    it('should return full missing species list if no species added', () => {
      // Given
      const sample = new Sample();
      sample.attrs.seedmix = 'MIXAB8 -  Flower Rich Margin (AB8)';

      // When
      const missingSpecies = getMissingSeedmixSpecies(sample);

      // Then
      expect(missingSpecies.length > 1).toEqual(true);
    });

    it('should return missing species list', () => {
      // Given
      const seedmixName = 'MIXAB8 -  Flower Rich Margin (AB8)';

      const emptySample = new Sample({ attrs: { seedmix: seedmixName } });
      const fullSpeciesListSize = getMissingSeedmixSpecies(emptySample).length;

      class SampleWithNoGPS extends Sample {
        startGPS = () => {};
      }
      const sample = new SampleWithNoGPS();
      sample.attrs.seedmix = seedmixName;

      const subSmp = config.smp.create(
        SampleWithNoGPS,
        Occurrence,
        new Image()
      );
      subSmp.occurrences[0].media[0].attrs.species = {
        scientificNameWithoutAuthor: 'Prunella vulgaris',
      };

      sample.samples.push(subSmp);

      // When
      const missingSpecies = getMissingSeedmixSpecies(sample);

      // Then
      expect(missingSpecies.length).toEqual(fullSpeciesListSize - 1);
    });
  });
});
