import { AppModel } from '../app';
import { NotificationType } from '../app/notificationsExt';

describe('App', () => {
  describe('Notifications', () => {
    const notification = {
      id: 'test-notification',
      type: NotificationType.PendingRecords,
      title: 'A survey is waiting to upload',
      message: 'Upload it when you have a connection.',
    };

    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.clearAllTimers();
      jest.useRealTimers();
    });

    it('initialises notifications for existing app data', async () => {
      // Given
      const store = {
        find: jest.fn().mockResolvedValue({ data: { showedWelcome: true } }),
      };
      const app = new AppModel({ cid: 'app', store });

      // When
      await app.fetch();

      // Then
      expect(app.data.showedWelcome).toBe(true);
      expect(app.data.notifications).toEqual([]);
    });

    it('keeps notification extensions isolated between app models', () => {
      // Given
      const app = new AppModel({ data: {} });
      const otherApp = new AppModel({ data: {} });

      // When
      app.notifications.add(notification);

      // Then
      expect(app.notifications.getAll()).toBe(app.data.notifications);
      expect(app.notifications.getAll()).toHaveLength(1);
      expect(otherApp.notifications.getAll()).toEqual([]);
    });

    it('uses the current notification list after resetting the app', async () => {
      // Given
      const store = { save: jest.fn().mockResolvedValue() };
      const app = new AppModel({ data: {}, store });
      const { notifications } = app;
      notifications.add(notification);

      // When
      await app.reset();
      const afterReset = notifications.getAll();
      notifications.add(notification);

      // Then
      expect(afterReset).toEqual([]);
      expect(app.notifications).toBe(notifications);
      expect(notifications.getAll()).toBe(app.data.notifications);
      expect(notifications.getAll()).toEqual([
        { ...notification, createdAt: Date.now(), read: false },
      ]);
    });

    it('adds an unread notification with a creation time', () => {
      // Given
      const app = new AppModel({ data: {} });

      // When
      const added = app.notifications.add(notification);

      // Then
      expect(app.data.notifications).toEqual([
        { ...notification, createdAt: Date.now(), read: false },
      ]);
      expect(added).toBe(app.data.notifications[0]);
    });

    it('does not duplicate or mark an unchanged notification unread', () => {
      // Given
      const app = new AppModel({ data: {} });
      const added = app.notifications.add(notification);
      const { createdAt } = added;
      app.notifications.markRead();
      jest.advanceTimersByTime(1000);

      // When
      app.notifications.add(notification);

      // Then
      expect(app.data.notifications).toHaveLength(1);
      expect(app.data.notifications[0]).toEqual({
        ...notification,
        createdAt,
        read: true,
      });
    });

    it('updates an existing notification and makes it unread again', () => {
      // Given
      const app = new AppModel({ data: {} });
      app.notifications.add(notification);
      app.notifications.markRead();
      jest.advanceTimersByTime(1000);

      // When
      app.notifications.add({ ...notification, title: 'Updated notification' });

      // Then
      expect(app.data.notifications).toEqual([
        {
          ...notification,
          title: 'Updated notification',
          createdAt: Date.now(),
          read: false,
        },
      ]);
    });

    it('removes only the requested notification and ignores missing IDs', () => {
      // Given
      const app = new AppModel({ data: {} });
      app.notifications.add(notification);
      app.notifications.add({ ...notification, id: 'another-notification' });

      // When
      app.notifications.remove('missing-notification');
      app.notifications.remove(notification.id);

      // Then
      expect(app.data.notifications).toHaveLength(1);
      expect(app.data.notifications[0].id).toBe('another-notification');
    });

    it('keeps one pending-record notification as the count changes', () => {
      // Given
      const app = new AppModel({ data: {} });
      app.notifications.updatePendingRecords(1);
      expect(app.data.notifications[0].title).toBe(
        '1 survey waiting to upload'
      );
      app.notifications.markRead();

      // When
      app.notifications.updatePendingRecords(2);

      // Then
      expect(app.data.notifications).toHaveLength(1);
      expect(app.data.notifications[0]).toMatchObject({
        id: NotificationType.PendingRecords,
        type: NotificationType.PendingRecords,
        title: '2 surveys waiting to upload',
        read: false,
      });
    });

    it('clears only the pending-record notification when no surveys remain', () => {
      // Given
      const app = new AppModel({ data: {} });
      app.notifications.add(notification);
      app.notifications.updatePendingRecords(1);

      // When
      app.notifications.updatePendingRecords(0);

      // Then
      expect(app.data.notifications).toHaveLength(1);
      expect(app.data.notifications[0].id).toBe(notification.id);
    });

    it('preserves notifications and read status when saved and fetched', async () => {
      // Given
      const store = {
        save: jest.fn().mockResolvedValue(),
        find: jest.fn(),
      };
      const app = new AppModel({ cid: 'app', store });
      app.notifications.updatePendingRecords(1);
      app.notifications.markRead();
      await app.save();
      store.find.mockResolvedValue(store.save.mock.calls[0][0]);
      const restored = new AppModel({ cid: 'app', store });

      // When
      await restored.fetch();
      restored.notifications.updatePendingRecords(1);

      // Then
      expect(restored.data.notifications).toEqual(app.data.notifications);
      expect(restored.data.notifications[0].read).toBe(true);
    });
  });

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
