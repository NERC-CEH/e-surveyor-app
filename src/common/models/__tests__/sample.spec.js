/* eslint-disable max-classes-per-file */

import Occurrence from 'occurrence';
import config from 'Survey/Point/config';
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

  describe('setSpecies', () => {
    it('should set taxon', () => {
      // Given
      class SampleWithNoGPS extends Sample {
        startGPS = () => {};
      }
      const sample = new SampleWithNoGPS({});

      const subSmp = config.smp.create(SampleWithNoGPS, Occurrence, {});

      sample.samples.push(subSmp);

      const newSpecies = {
        warehouseId: 123,
        gbif: { id: 123 },
        images: [],
        species: {
          commonNames: ['Common Blue'],
          scientificNameWithoutAuthor: 'Poterium sanguisorba',
        },
      };

      // When
      subSmp.setSpecies(newSpecies);

      // Then
      const savedSpecies = subSmp.getSpecies();
      expect(savedSpecies).toMatchObject(newSpecies);
    });

    it('should prevent non subSamples', () => {
      // Given
      class SampleWithNoGPS extends Sample {
        startGPS = () => {};
      }

      const sample = new SampleWithNoGPS({});

      // then
      expect(() => sample.setSpecies()).toThrowError('Parent does not exist');
    });
  });
});
