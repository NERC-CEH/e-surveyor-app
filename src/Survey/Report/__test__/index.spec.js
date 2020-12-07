import Sample from 'sample';
import Occurrence from 'occurrence';
import config from 'Survey/config';
import seedmixData from 'common/data/seedmix';
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
    it('should return missing species list', () => {
      // Given
      const seedmixName = Object.keys(seedmixData)[0];
      const seedmix = seedmixData[seedmixName];
      const species = seedmix[0].latin_name;

      class SampleWithNoGPS extends Sample {
        startGPS = () => {};
      }
      const sample = new SampleWithNoGPS({
        attrs: {
          seedmix: seedmixName,
        },
      });

      const subSmp = config.smp.create(SampleWithNoGPS, Occurrence, {});

      subSmp.occurrences[0].attrs.taxon = {
        species: {
          scientificNameWithoutAuthor: species,
        },
      };

      sample.samples.push(subSmp);

      // When
      const missingSeedmixSpecies = getMissingSeedmixSpecies(sample);

      // Then
      expect(missingSeedmixSpecies.length).toEqual(seedmix.length - 1);
    });
  });
});
