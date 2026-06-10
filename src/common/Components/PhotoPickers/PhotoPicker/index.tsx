import { ComponentProps, useState } from 'react';
import { observer } from 'mobx-react';
import { close, cropOutline } from 'ionicons/icons';
import {
  PhotoPicker,
  captureImage,
  URL,
  ImageCropper,
  saveFile,
  deleteFile,
} from '@flumens';
import { IonButton, IonIcon } from '@ionic/react';
import Media from 'models/image';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import './styles.scss';

export { usePromptImageSource } from '@flumens';

type Props = {
  model: Sample | Occurrence;
  maxImages?: number;
  allowToCrop?: boolean;
} & Omit<ComponentProps<typeof PhotoPicker>, 'getImage' | 'value'>;

const AppPhotoPicker = ({
  model,
  allowToCrop,
  maxImages,
  ...restProps
}: Props) => {
  const onAdd = async (shouldUseCamera: boolean) => {
    if (
      Number.isFinite(maxImages) &&
      model.media.length >= (maxImages as number)
    )
      return;

    const [image] = await captureImage({ camera: shouldUseCamera });
    if (!image) return;

    const imageModel = await Media.getImageModel(image);

    model.media.push(imageModel);

    if (!model.isPersistent()) return;
    model.save();
  };

  const onRemove = async (media: any) => media.destroy();

  const [editImage, setEditImage] = useState<Media>();

  const onDoneEdit = async (image: URL) => {
    if (!editImage) return;

    // save the new image and delete the old one
    const oldFileName = editImage.getURL().split('/').pop() as string;
    const extension = oldFileName.split('.').pop() as string;
    const newFileName = `${Date.now()}.${extension}`;
    await deleteFile(oldFileName);
    image = await saveFile(image, newFileName); // eslint-disable-line no-param-reassign

    const newImageModel = await Media.getImageModel(image);
    Object.assign(editImage?.data, {
      ...newImageModel.data,
      queued: null, // in case it was uploaded
    });

    if (editImage.isPersistent) {
      if (editImage.isPersistent()) editImage.save();
    } else {
      editImage.save();
    }

    setEditImage(undefined);
  };

  const onCancelEdit = () => setEditImage(undefined);

  const isDisabled = model.parent && model.isDisabled;
  const maxPicsReached = !!maxImages && model.media.length >= maxImages;

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
          <IonButton fill="clear" className="delete" onClick={onDelete}>
            <IonIcon icon={close} />
          </IonButton>
        )}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <img src={media.getURL()} onClick={onClick} />
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
        value={model.media}
        onAdd={onAdd}
        onRemove={onRemove}
        placeholderCount={1}
        Image={allowToCrop ? ImageWithCropping : undefined}
        isDisabled={isDisabled || maxPicsReached}
        buttonLabel={
          <span className="mx-2 my-0.5 text-sm opacity-70">Add photos</span>
        }
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
