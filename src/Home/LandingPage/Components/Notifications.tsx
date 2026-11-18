import { useContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import {
  closeOutline,
  cloudUploadOutline,
  notificationsOutline,
} from 'ionicons/icons';
import { Button, Main, getRelativeDate } from '@flumens';
import { IonIcon, IonModal, NavContext } from '@ionic/react';
import appModel from 'models/app';
import {
  type AppNotification,
  NotificationType,
} from 'models/app/notificationsExt';
import { getPending } from 'models/collections/samples';

const PANEL_BREAKPOINT = 0.75;

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedNotification = useRef<AppNotification | null>(null);
  const { navigate } = useContext(NavContext);
  const notifications = appModel.notifications.getAll();
  const unreadCount = notifications.filter(
    notification => !notification.read
  ).length;
  const pendingCount = getPending().length;

  useEffect(() => {
    appModel.notifications.updatePendingRecords(pendingCount);
  }, [pendingCount]);

  useEffect(() => {
    if (isOpen && unreadCount) {
      appModel.notifications.markRead();
    }
  }, [isOpen, unreadCount]);

  const close = () => setIsOpen(false);

  const openNotification = (notification: AppNotification) => {
    selectedNotification.current = notification;
    close();
  };

  const onDismiss = () => {
    const notification = selectedNotification.current;
    selectedNotification.current = null;
    close();

    // Let the modal restore focus before switching tabs.
    if (notification?.type === NotificationType.PendingRecords) {
      navigate('/home/surveys?segment=pending');
    }
  };

  return (
    <>
      <Button
        shape="round"
        skipTranslation
        aria-label={
          unreadCount
            ? `Notifications (${unreadCount} unread)`
            : 'Notifications'
        }
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onPress={() => setIsOpen(true)}
        className="relative h-11 w-11 shrink-0 overflow-visible border-white/50 bg-white/15 p-0 text-white backdrop-blur-sm data-[hovered=true]:bg-white/25"
      >
        <IonIcon
          icon={notificationsOutline}
          className="size-6"
          aria-hidden="true"
        />
        {!!unreadCount && (
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 min-w-5 rounded-full bg-amber-400 px-1 text-center text-xs font-bold leading-5 text-neutral-950"
          >
            {unreadCount}
          </span>
        )}
      </Button>

      <IonModal
        id="notifications-panel"
        isOpen={isOpen}
        onDidDismiss={onDismiss}
        breakpoints={[0, PANEL_BREAKPOINT, 1]}
        initialBreakpoint={PANEL_BREAKPOINT}
        aria-label="Notifications"
        className="[--background:var(--ion-page-background)]"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
          <h2 className="m-0 text-xl font-semibold">Notifications</h2>
          <Button
            fill="clear"
            shape="round"
            aria-label="Close notifications"
            onPress={close}
            className="h-11 w-11 p-0"
          >
            <IonIcon
              icon={closeOutline}
              className="size-6"
              aria-hidden="true"
            />
          </Button>
        </div>

        <Main>
          <div className="space-y-3 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {!notifications.length && (
              <p role="status" className="py-8 text-center text-neutral-600">
                No notifications yet.
              </p>
            )}

            {notifications.map(notification => (
              <Button
                key={notification.id}
                fill="clear"
                skipTranslation
                onPress={() => openNotification(notification)}
                className="w-full rounded-xl bg-white! p-3 text-left shadow-sm"
              >
                <div className="flex w-full items-start gap-3 whitespace-normal">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                    <IonIcon
                      icon={cloudUploadOutline}
                      className="size-5"
                      aria-hidden="true"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="m-0 text-base font-semibold text-neutral-900">
                      {notification.title}
                    </h3>
                    <p className="mt-1 mb-2 text-sm font-normal text-neutral-700">
                      {notification.message}
                    </p>
                    <time
                      dateTime={new Date(notification.createdAt).toISOString()}
                      className="text-xs font-normal text-neutral-500"
                    >
                      {getRelativeDate(notification.createdAt)}
                    </time>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </Main>
      </IonModal>
    </>
  );
};

export default observer(Notifications);
