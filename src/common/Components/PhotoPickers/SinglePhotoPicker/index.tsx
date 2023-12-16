import { FC, ComponentProps, useState } from 'react';
import { observer } from 'mobx-react';
import { close, cropOutline } from 'ionicons/icons';
import { captureImage, URL } from '@flumens';
import { IonButton, IonIcon } from '@ionic/react';
import ImageCropper from 'common/Components/ImageCropper';
import config from 'common/config';
import Media from 'models/image';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import SinglePhotoPicker from './SinglePhotoPicker';

interface Props
  extends Omit<ComponentProps<typeof SinglePhotoPicker>, 'getImage'> {
  model: Sample | Occurrence;
  maxImages?: number;
  allowToCrop?: boolean;
  disabled?: boolean;
}

const AppPhotoPicker: FC<Props> = ({
  model,
  allowToCrop,
  maxImages,
  disabled,
  ...restProps
}) => {
  async function onAddNew(shouldUseCamera: boolean) {
    const [image] = await captureImage({
      camera: shouldUseCamera,
    });

    if (!image) return;

    const imageModel = await Media.getImageModel(image, config.dataPath);

    const imageArray = Array.isArray(imageModel) ? imageModel : [imageModel];
    model.media.push(...imageArray);

    model.save();
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

  const isDisabled = disabled || (model.parent && model.isDisabled());
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
        <img
          src={media.getURL()}
          onClick={onClick} // TODO: fix
        />
        {!isDisabled && allowToCrop && (
          <IonButton className="crop-button" onClick={cropImage}>
            <IonIcon icon={cropOutline} />
          </IonButton>
        )}
      </div>
    );
  };

  return (
    <>
      <SinglePhotoPicker
        onAddNew={onAddNew}
        model={model}
        Image={ImageWithCropping}
        isDisabled={isDisabled || maxPicsReached}
        {...restProps}
      />
      {allowToCrop && (
        <ImageCropper
          image={editImage?.getURL()}
          onDone={onDoneEdit}
          onCancel={onCancelEdit}
          message="Place your tray at the center of the frame."
        />
      )}
    </>
  );
};

export default observer(AppPhotoPicker);
