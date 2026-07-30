import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';
import {
  PhotoPicker,
  ImageCropper,
  captureImage,
  useToast,
  saveFile,
  deleteFile,
} from '@flumens';
import { isPlatform, useIonActionSheet } from '@ionic/react';
import Media from 'models/image';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import GalleryWithClassification from './GalleryWithClassification';
import Image from './Image';
import './styles.scss';

type URL = string;

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

type Props = {
  model: Sample | Occurrence;
  allowToCrop?: boolean;
  onChange?: any;
};

const useOnBackButton = (onCancelEdit: () => void, editImage?: Media) => {
  const hideModal = () => {
    const disableHardwareBackButton = (event: any) => {
      // eslint-disable-next-line
      event.detail.register(100, (processNextHandler: any) => {
        if (!editImage) {
          processNextHandler();
          return null;
        }

        onCancelEdit();
      });
    };
    document.addEventListener('ionBackButton', disableHardwareBackButton);

    const removeEventListener = () =>
      document.removeEventListener('ionBackButton', disableHardwareBackButton);
    return removeEventListener;
  };

  useEffect(hideModal, [editImage]);
};

const AppPhotoPicker = ({ model, allowToCrop = true, onChange }: Props) => {
  const [editImage, setEditImage] = useState<Media>();
  const toast = useToast();

  async function onAdd(shouldUseCamera: boolean) {
    try {
      const photoURLs = await captureImage(
        shouldUseCamera ? { camera: true } : { multiple: true }
      );
      if (!photoURLs.length) return;

      const getImageModel = async (imageURL: URL) =>
        Media.getImageModel(
          isPlatform('hybrid') ? Capacitor.convertFileSrc(imageURL) : imageURL
        );
      const imageModels: Media[] = await Promise.all<any>(
        photoURLs.map(getImageModel)
      );

      const canEdit = imageModels.length === 1;
      if (canEdit) {
        setEditImage(imageModels[0]);
        // don't identify until editing is over
        return;
      }

      model.media.push(...imageModels);
      model.save();

      onChange?.();
    } catch (e: any) {
      toast.error(e);
    }
  }

  const onRemove = async (m: any) => {
    await m.destroy();
    onChange?.();
  };

  const onDoneEdit = async (imageDataURL: URL) => {
    const image = editImage as Media;

    // overwrite existing file
    const oldFileName: string = image?.getURL().split('/').pop() as string;
    const extension = oldFileName.split('.').pop() as string;
    const newFileName = `${Date.now()}.${extension}`;

    await deleteFile(oldFileName);

    const savedURL = await saveFile(imageDataURL, newFileName);

    // copy over new image values to existing model to preserve its observability
    const newImageModel = await Media.getImageModel(
      isPlatform('hybrid') ? Capacitor.convertFileSrc(savedURL) : savedURL
    );
    Object.assign(image?.data, { ...newImageModel.data, species: null });

    if (!image.parent) {
      // came straight from camera rather than editing existing
      model.media.push(image);
    }

    model.save();

    setEditImage(undefined);
    onChange?.();
  };

  const onCancelEdit = () => setEditImage(undefined);

  const onCropExisting = (media: Media) => {
    if (model.isDisabled) return;

    setEditImage(media);
  };

  const isDisabled =
    model instanceof Occurrence ? model.parent?.isDisabled : model.isDisabled;

  const allowToEdit = allowToCrop && !isDisabled;

  useOnBackButton(onCancelEdit, editImage);

  if (isDisabled && !model.media.length) return null;

  return (
    <>
      <PhotoPicker
        className="with-cropper border-ion-none"
        onAdd={onAdd}
        value={model.media}
        Gallery={GalleryWithClassification}
        Image={Image}
        onRemove={onRemove}
        galleryProps={{
          onCrop: onCropExisting,
          isDisabled,
          onDelete: onRemove,
        }}
        isDisabled={isDisabled}
      />

      {allowToEdit && (
        <ImageCropper
          image={editImage?.getURL()}
          onDone={onDoneEdit}
          onCancel={onCancelEdit}
        />
      )}
    </>
  );
};

export default AppPhotoPicker;
