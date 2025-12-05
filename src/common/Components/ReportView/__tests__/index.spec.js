// eslint-disable-next-line max-classes-per-file
import seedmixData from 'common/data/seedmix';
import config from 'Survey/Point/config';
import Occurrence from '../../../models/occurrence';
import Sample from '../../../models/sample';
import { getMissingSeedmixSpecies, getSeedmixUse } from '../helpers';

class SampleWithNoGPS extends Sample {
  startGPS = () => {};
}

describe('ReportView', () => {
  describe('getSeedmixUse', () => {
    it('should return seedmix species in use', () => {
      // Given
      const seedmixName = Object.keys(seedmixData)[0];
      const seedmix = seedmixData[seedmixName];
      const species = seedmix[0].latinName;

      const sample = new SampleWithNoGPS({
        data: {
          surveyId: config.id,
          seedmix: seedmixName,
        },
      });

      const subSmp = config.smp.create({ Sample: SampleWithNoGPS, Occurrence });

      subSmp.occurrences[0].data.taxon = {
        scientificName: species,
      };

      sample.samples.push(subSmp);

      const occurrences = sample.samples.map(smp => smp.occurrences[0]);

      // When
      const recordedSeedmixSpecies = getSeedmixUse(occurrences, seedmix);

      // Then
      expect(recordedSeedmixSpecies.length).toEqual(1);
    });
  });

  describe('getMissingSeedmixSpecies', () => {
    it('should return missing species list', () => {
      // Given
      const seedmixName = Object.keys(seedmixData)[0];
      const seedmix = seedmixData[seedmixName];
      const species = seedmix[0].latinName;

      const sample = new SampleWithNoGPS({
        data: {
          surveyId: config.id,
          seedmix: seedmixName,
        },
      });

      const subSmp = config.smp.create({ Sample: SampleWithNoGPS, Occurrence });

      subSmp.occurrences[0].data.taxon = {
        scientificName: species,
      };

      sample.samples.push(subSmp);

      const occurrences = sample.samples.map(smp => smp.occurrences[0]);

      // When
      const missingSeedmixSpecies = getMissingSeedmixSpecies(
        occurrences,
        seedmix
      );

      // Then
      expect(missingSeedmixSpecies.length).toEqual(seedmix.length - 1);
    });
  });
});
