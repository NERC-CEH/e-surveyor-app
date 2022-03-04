import config from 'Survey/Point/config';
import seedmixData from 'common/data/seedmix';
import Sample from '../../../models/sample';
import Occurrence from '../../../models/occurrence';
import { getMissingSeedmixSpecies } from '..';

describe('ReportView', () => {
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

      const occurrences = sample.samples.map(smp => smp.occurrences[0]);

      // When
      const missingSeedmixSpecies = getMissingSeedmixSpecies(
        occurrences,
        sample.attrs.seedmix
      );

      // Then
      expect(missingSeedmixSpecies.length).toEqual(seedmix.length - 1);
    });
  });
});
