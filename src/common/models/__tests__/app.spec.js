/* eslint-disable max-classes-per-file */
import { AppModel } from '../app';

describe('App', () => {
  describe('Seedmixes', () => {
    it('should delete seedmix', () => {
      // Given
      const seedmixes = [{ id: '1', name: 'seedmix', species: [] }];
      const app = new AppModel({ data: { seedmixes } });

      // When
      app.deleteSeedmix('1');

      // Then
      expect(app.data.seedmixes.length).toEqual(0);
    });

    it('should save new seedmix', () => {
      // Given
      const app = new AppModel({ data: { seedmixes: [] } });
      const newSeedmix = { id: '1', name: 'seedmix', species: [] };

      // When
      app.saveSeedmix(newSeedmix);

      // Then
      expect(app.data.seedmixes[0].id).toBe(newSeedmix.id);
    });

    it('should update existing seedmix', () => {
      // Given
      const seedmix = { id: '1', name: 'seedmix', species: [] };
      const app = new AppModel({ data: { seedmixes: [seedmix] } });

      // When
      const updatedSeedmix = JSON.parse(JSON.stringify(seedmix));
      updatedSeedmix.name = 'seedmix update';
      updatedSeedmix.species.push({ warehouseId: 1 });

      app.saveSeedmix(updatedSeedmix);

      // Then
      expect(app.data.seedmixes[0].name).toBe(updatedSeedmix.name);
      expect(app.data.seedmixes[0].species.length).toBe(1);
    });
  });
});
