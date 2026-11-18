export enum NotificationType {
  PendingRecords = 'pending-records',
}

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: number;
  read: boolean;
};

export type Extension = {
  getAll: () => AppNotification[];
  add: (
    notification: Omit<AppNotification, 'createdAt' | 'read'>
  ) => AppNotification;
  remove: (notificationId: string) => void;
  markRead: () => void;
  updatePendingRecords: (count: number) => void;
};

type NotificationModel = {
  data: { notifications: AppNotification[] };
};

const initialise = (model: NotificationModel): Extension => {
  const getAll = () => model.data.notifications;

  const add: Extension['add'] = notification => {
    const existing = model.data.notifications.find(
      ({ id }) => id === notification.id
    );

    // Rechecking pending records must not make an unchanged notification unread again.
    if (
      existing?.type === notification.type &&
      existing.title === notification.title &&
      existing.message === notification.message
    ) {
      return existing;
    }

    const newNotification: AppNotification = {
      ...notification,
      createdAt: Date.now(),
      read: false,
    };

    model.data.notifications = [
      newNotification,
      ...model.data.notifications.filter(({ id }) => id !== notification.id),
    ];

    return model.data.notifications[0];
  };

  const remove = (notificationId: string) => {
    model.data.notifications = model.data.notifications.filter(
      ({ id }) => id !== notificationId
    );
  };

  const markRead = () => {
    model.data.notifications.forEach(notification => {
      notification.read = true;
    });
  };

  const updatePendingRecords = (count: number) => {
    if (!count) {
      remove(NotificationType.PendingRecords);
      return;
    }

    add({
      id: NotificationType.PendingRecords,
      type: NotificationType.PendingRecords,
      title: `${count} ${count === 1 ? 'survey' : 'surveys'} waiting to upload`,
      message:
        'Connect to Wi-Fi or mobile data to upload your surveys, so they appear in your results.',
    });
  };

  return { getAll, add, remove, markRead, updatePendingRecords };
};

export default initialise;
