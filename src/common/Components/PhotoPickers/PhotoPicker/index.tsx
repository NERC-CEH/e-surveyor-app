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
import {
  isPlatform,
  useIonActionSheet,
  type BackButtonEvent,
} from '@ionic/react';
import Media from 'models/image';
import Location from 'models/location';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import GalleryWithClassification from './GalleryWithClassification';
import Image from './Image';
import './styles.scss';

type URL = string;

export function usePromptImageSource() {
  const { t } = useTranslation();
  const [presentActionSheet] = useIonActionSheet();

  const promptImageSource = (resolve: (value: boolean | null) => void) => {
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
  model: Sample | Occurrence | Location;
  allowToCrop?: boolean;
  onChange?: () => void;
};

const useOnBackButton = (onCancelEdit: () => void, editImage?: Media) => {
  const hideModal = () => {
    const disableHardwareBackButton = (event: Event) => {
      (event as BackButtonEvent).detail.register(100, processNextHandler => {
        if (!editImage) {
          processNextHandler();
          return;
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
      const imageModels = await Promise.all(photoURLs.map(getImageModel));

      const canEdit = imageModels.length === 1;
      if (canEdit) {
        setEditImage(imageModels[0]);
        // don't identify until editing is over
        return;
      }

      model.media.push(...imageModels);
      model.save();

      onChange?.();
    } catch (error) {
      toast.error(error);
    }
  }

  const onRemove = async (media: Media) => {
    await media.destroy();
    onChange?.();
  };

  const onDoneEdit = async (imageDataURL: URL) => {
    if (!editImage) return;

    const image = editImage;

    // overwrite existing file
    const oldFileName = image.getURL().split('/').pop();
    if (!oldFileName) throw new Error('Image filename is missing.');

    const extension = oldFileName.split('.').pop() || 'jpg';
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
