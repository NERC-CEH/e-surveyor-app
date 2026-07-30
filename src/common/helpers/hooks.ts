import { useAlert } from '@flumens';
import {
  getConfig,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from '@ionic/react';

const useEntryDeleteConfirmation = () => {
  const alert = useAlert();

  const confirmDeletion = () =>
    new Promise(resolve => {
      alert({
        header: 'Delete',
        skipTranslation: true,
        message: 'Are you sure you want to remove this entry from your survey?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'primary',
            handler: () => resolve(false),
          },
          {
            text: 'Delete',
            cssClass: 'danger',
            handler: () => resolve(true),
          },
        ],
      });
    });

  return confirmDeletion;
};

export function useDisableSwipeBack() {
  const config = getConfig()!;
  useIonViewWillEnter(() => config.set('swipeBackEnabled', false));
  useIonViewWillLeave(() => config.set('swipeBackEnabled', true));
}

export default useEntryDeleteConfirmation;
