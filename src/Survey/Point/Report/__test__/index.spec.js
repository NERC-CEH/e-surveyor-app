import config from 'Survey/Point/config';
import seedmixData from 'common/data/seedmix';
import Sample from '../../../../common/models/sample';
import Occurrence from '../../../../common/models/occurrence';
import { getMissingSeedmixSpecies } from '..';

describe('Settings Menu', () => {
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
