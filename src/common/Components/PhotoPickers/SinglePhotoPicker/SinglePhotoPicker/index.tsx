import { observer } from 'mobx-react';
import clsx from 'clsx';
import { addOutline, cameraOutline, closeOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useAlert } from '@flumens';
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  useIonActionSheet,
} from '@ionic/react';
import './styles.scss';

const ImageDefault = observer(
  ({ media, isDisabled, onDelete, onClick }: any) => {
    const mediaSrc = media.getURL();

    return (
      <div className="img">
        {!isDisabled && (
          <IonButton fill="clear" className="delete" onClick={onDelete}>
            <IonIcon icon={closeOutline} />
          </IonButton>
        )}
        <img src={mediaSrc} alt="" onClick={onClick} />
      </div>
    );
  }
);

type Props = {
  /**
   * Sample or Occurrence model.
   */
  model: any;
  /**
   * Function called when the new photo button is pressed.
   */
  onAddNew?: any;
  /**
   * Disable any editing.
   */
  isDisabled?: boolean;
  /**
   * Extra classes to append.
   */
  className?: string;
  /**
   * Item label.
   */
  label?: string;
  /**
   * Caption to filter media.
   */
  caption?: string;
  /**
   * Image component class.
   */
  Image?: any;
};

export function usePromptImageSource() {
  const { t } = useTranslation();
  const [presentActionSheet] = useIonActionSheet();

  const promptImageSource = (resolve: any) => {
    presentActionSheet({
      buttons: [
        { text: t('Gallery'), handler: () => resolve(false) },
        { text: t('Camera'), handler: () => resolve(true) },
        { text: t('Cancel'), role: 'cancel', handler: () => resolve(null) },
      ],
      header: t('Choose a method to upload a photo'),
    });
  };
  const promptImageSourceWrap = () =>
    new Promise<boolean | null>(promptImageSource);

  return promptImageSourceWrap;
}

function useDeletePrompt() {
  const alert = useAlert();

  return () =>
    new Promise(resolve => {
      alert({
        header: 'Delete',
        message: (
          <>
            Are you sure you want to remove this photo?
            <br />
            <br />
            Note: it will remain in the gallery.
          </>
        ),
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'primary',
            handler: () => resolve(false),
          },
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => resolve(true),
          },
        ],
      });
    });
}

const SinglePhotoPicker = ({
  model,
  label = 'Photo',
  onAddNew: onAddNewProp,
  isDisabled,
  className,
  Image = ImageDefault,
  caption,
}: Props) => {
  const byCaption = (m: any) => (caption ? m.data.caption === caption : true);
  const [photo] = model.media.filter(byCaption);
  const promptToDelete = useDeletePrompt();
  const promptImageSource = usePromptImageSource();

  const onDelete = async () => {
    const shouldDelete = await promptToDelete();
    if (!shouldDelete) return;

    photo.destroy();
  };

  const getPhoto = () => {
    if (!photo) return null;

    // const showGalleryWrap = () => setShowGallery(index as any);

    return (
      <Image
        key={photo.cid}
        media={photo}
        // onClick={showGalleryWrap}
        onDelete={onDelete}
        isDisabled={isDisabled}
      />
    );
  };

  const onAddNew = async () => {
    if (photo || isDisabled) return;

    const shouldUseCamera = await promptImageSource();
    const cancelled = shouldUseCamera === null;
    if (cancelled) return;

    onAddNewProp(shouldUseCamera);
  };

  return (
    <IonItem
      className={clsx('single-photo-picker', !photo && 'empty', className)}
      detail={!photo && !isDisabled}
      detailIcon={addOutline}
      onClick={onAddNew}
    >
      <IonIcon slot="start" icon={cameraOutline} />
      <IonLabel>{label}</IonLabel>
      <IonLabel slot="end" className="flex">
        {getPhoto()}
      </IonLabel>
    </IonItem>
  );
};

export default observer(SinglePhotoPicker);
