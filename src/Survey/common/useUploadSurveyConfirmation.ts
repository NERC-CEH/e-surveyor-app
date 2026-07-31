import { useAlert } from '@flumens';

type UploadAction = () => void | Promise<void>;

const useUploadSurveyConfirmation = () => {
  const alert = useAlert();

  const showUploadSurveyConfirmation = async (onConfirm?: UploadAction) => {
    const header = 'Upload Survey';
    const message =
      'Once uploaded, this survey cannot be edited. Are you sure you want to continue?';

    return new Promise<boolean>(resolve => {
      alert({
        header,
        message,
        backdropDismiss: false,
        buttons: [
          { text: 'Cancel', role: 'cancel', handler: () => resolve(false) },
          {
            text: 'Upload',
            handler: async () => {
              if (onConfirm) {
                await onConfirm();
              }

              resolve(true);
            },
          },
        ],
      });
    });
  };

  return showUploadSurveyConfirmation;
};

export default useUploadSurveyConfirmation;
