import React, { FC, ComponentProps, useState } from 'react';
import { PhotoPicker, captureImage, URL } from '@flumens';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { useIonActionSheet, IonButton, IonIcon } from '@ionic/react';
import { close, cropOutline } from 'ionicons/icons';
import Media from 'models/image';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import config from 'common/config';
import ImageCropper from 'common/Components/ImageCropper';
import './styles.scss';

export function usePromptImageSource() {
  const { t } = useTranslation();
  const [presentActionSheet] = useIonActionSheet();

  return () =>
    new Promise<boolean | null>(resolve => {
      presentActionSheet({
        buttons: [
          { text: t('Gallery'), handler: () => resolve(false) },
          { text: t('Camera'), handler: () => resolve(true) },
          { text: t('Cancel'), role: 'cancel', handler: () => resolve(null) },
        ],
        header: 'Choose a method to upload a photo',
      });
    });
}

interface Props extends Omit<ComponentProps<typeof PhotoPicker>, 'getImage'> {
  model: Sample | Occurrence;
  maxImages?: number;
  allowToCrop?: boolean;
}

const AppPhotoPicker: FC<Props> = ({
  model,
  allowToCrop,
  maxImages,
  ...restProps
}) => {
  const promptImageSource = usePromptImageSource();

  async function getImageWrap() {
    if (
      Number.isFinite(maxImages) &&
      model.media.length >= (maxImages as number)
    )
      return null;

    const shouldUseCamera = await promptImageSource();
    const cancelled = shouldUseCamera === null;
    if (cancelled) return null;

    const [image] = await captureImage({
      camera: shouldUseCamera,
    });
    if (!image) {
      return null;
    }

    const imageModel = await Media.getImageModel(image, config.dataPath);

    return imageModel;
  }

  const [editImage, setEditImage] = useState<Media>();

  const onDoneEdit = async (image: URL) => {
    if (!editImage) return;

    const newImageModel = await Media.getImageModel(image, config.dataPath);
    Object.assign(editImage?.attrs, newImageModel.attrs);
    if (editImage.isPersistent) {
      if (editImage.isPersistent()) editImage.save();
    } else {
      editImage.save();
    }

    setEditImage(undefined);
  };

  const onCancelEdit = () => setEditImage(undefined);

  const isDisabled = model.parent && model.isDisabled();

  // eslint-disable-next-line react/no-unstable-nested-components
  const ImageWithCropping = ({
    media,
    onDelete,
    onClick,
  }: {
    media: Media;
    onDelete: any;
    onClick: any;
  }) => {
    const cropImage = () => {
      setEditImage(media);
    };

    return (
      <div className="img">
        {!isDisabled && (
          <IonButton fill="clear" class="delete" onClick={onDelete}>
            <IonIcon icon={close} />
          </IonButton>
        )}
        <img
          src={media.getURL()}
          onClick={onClick} // TODO: fix
        />
        {!isDisabled && (
          <IonButton className="crop-button" onClick={cropImage}>
            <IonIcon icon={cropOutline} />
          </IonButton>
        )}
      </div>
    );
  };

  return (
    <>
      <PhotoPicker
        getImage={getImageWrap}
        model={model}
        placeholderCount={1}
        Image={allowToCrop ? ImageWithCropping : undefined}
        {...restProps}
      />
      {allowToCrop && (
        <ImageCropper
          image={editImage?.getURL()}
          onDone={onDoneEdit}
          onCancel={onCancelEdit}
        />
      )}
    </>
  );
};

export default observer(AppPhotoPicker);
