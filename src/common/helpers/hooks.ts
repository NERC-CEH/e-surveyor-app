import { useAlert } from '@flumens/ionic/dist';

// eslint-disable-next-line import/prefer-default-export
export const useEntryDeleteConfirmation = () => {
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
