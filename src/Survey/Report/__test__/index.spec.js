import Sample from 'sample';
import { getLeagueTable } from '..';

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
      expect(table[table.length - 1]).toHaveProperty('current', true);
    });
  });
});
