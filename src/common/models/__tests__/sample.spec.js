import Sample from '../sample';

jest.mock('@flumens', () => {
  const actual = jest.requireActual('@flumens');

  return {
    ...actual,
    device: {
      ...actual.device,
      isOnline: true,
    },
  };
});

jest.mock('models/user', () => ({
  checkActivation: jest.fn(),
}));

const getDeferred = () => {
  let resolve;
  let reject;

  const promise = new Promise((nextResolve, nextReject) => {
    resolve = nextResolve;
    reject = nextReject;
  });

  return { promise, resolve, reject };
};

const getFakeSample = (overrides = {}) => ({
  isSynchronising: false,
  requiresRemoteSync: jest.fn(() => true),
  validateRemote: jest.fn(() => null),
  cleanUp: jest.fn(),
  data: { surveyId: 'survey-id' },
  syncedAt: undefined,
  saveRemote: jest.fn(),
  updateRemote: jest.fn(),
  ...overrides,
});

describe('Sample', () => {
  beforeEach(() => {
    const userModel = jest.requireMock('models/user');

    userModel.checkActivation.mockResolvedValue(true);
  });

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
          pollinatorCommonName: 'Common Blue',
        },
      ]);
    });
  });

  describe('syncRemote', () => {
    it('awaits saveRemote before resolving for unsynced samples', async () => {
      // Given
      const deferred = getDeferred();
      const pending = Symbol('pending');
      const sample = getFakeSample({
        saveRemote: jest.fn(() => deferred.promise),
      });

      // When
      const syncPromise = Sample.prototype.syncRemote.call(sample);

      // Then
      await Promise.resolve();
      expect(sample.saveRemote).toHaveBeenCalledTimes(1);
      await expect(
        Promise.race([syncPromise, Promise.resolve(pending)])
      ).resolves.toBe(pending);

      deferred.resolve();
      await expect(syncPromise).resolves.toBe(true);
    });

    it('awaits updateRemote before resolving for synced samples', async () => {
      // Given
      const deferred = getDeferred();
      const pending = Symbol('pending');
      const sample = getFakeSample({
        syncedAt: '2026-08-03T00:00:00.000Z',
        updateRemote: jest.fn(() => deferred.promise),
      });

      // When
      const syncPromise = Sample.prototype.syncRemote.call(sample);

      // Then
      await Promise.resolve();
      expect(sample.updateRemote).toHaveBeenCalledTimes(1);
      await expect(
        Promise.race([syncPromise, Promise.resolve(pending)])
      ).resolves.toBe(pending);

      deferred.resolve();
      await expect(syncPromise).resolves.toBe(true);
    });

    it('returns false and calls onError when saveRemote rejects', async () => {
      // Given
      const error = new Error('Upload failed');
      const onError = jest.fn();
      const sample = getFakeSample({
        saveRemote: jest.fn(() => Promise.reject(error)),
      });

      // When
      const result = await Sample.prototype.syncRemote.call(sample, onError);

      // Then
      expect(result).toBe(false);
      expect(onError).toHaveBeenCalledWith(error);
    });
  });
});
