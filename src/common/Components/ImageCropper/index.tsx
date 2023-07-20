import { FC, useState, useCallback, useEffect } from 'react';
import Cropper, { CropperProps } from 'react-easy-crop';
// eslint-disable-next-line import/no-unresolved
import { Point, Area } from 'react-easy-crop/types';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { InfoBackgroundMessage, getObjectURL, cropImage, URL } from '@flumens';
// eslint-disable-line import/no-unresolved
import {
  IonButton,
  IonModal,
  IonFooter,
  IonToolbar,
  IonButtons,
  isPlatform,
} from '@ionic/react';
import './styles.scss';

type Props = {
  image?: URL;
  onDone: (newImage: URL) => any;
  onCancel: any;
  message?: string;
  allowRotation?: boolean;
  cropperProps?: Partial<CropperProps>;
};

const ImageCropper: FC<Props> = ({
  image,
  onDone,
  onCancel: onCancelProp,
  message = 'Place your plant at the center of the frame.',
  allowRotation,
  cropperProps,
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const [croppedArea, setCroppedArea] = useState<Area>();
  const setCroppedAreaWrap = (_: any, area: Area) => setCroppedArea(area);
  const onCropComplete = useCallback(setCroppedAreaWrap, [image]);

  const [isModalReady, setIsModalReady] = useState(false);

  const resetOnNewImage = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };
  useEffect(resetOnNewImage, [image]);

  const onCancelEditing = () => {
    setIsModalReady(false);
    onCancelProp();
  };

  const onDoneEditing = async () => {
    setIsModalReady(false);

    if (!croppedArea || !image) return;

    const imageDataURL: URL = await cropImage(image, croppedArea, rotation);
    if (!isPlatform('hybrid')) {
      onDone(getObjectURL(imageDataURL));
      return;
    }

    const fileName: string = image.split('/').pop() as string;

    try {
      await Filesystem.deleteFile({
        path: fileName,
        directory: Directory.Data,
      });
    } catch (error) {
      console.error('There was an error deleting a file', fileName);
      // continue nevertheless
    }

    const newFileName = `c_${fileName}`;
    await Filesystem.writeFile({
      path: newFileName,
      data: imageDataURL,
      directory: Directory.Data,
    });

    const { uri } = await Filesystem.stat({
      path: newFileName,
      directory: Directory.Data,
    });

    onDone(uri);
  };

  const fixCropper = () => setIsModalReady(true);

  return (
    <IonModal
      isOpen={!!image}
      backdropDismiss={false}
      animated={false}
      className="image-cropper"
      onDidPresent={fixCropper}
    >
      <div>
        <InfoBackgroundMessage>{message}</InfoBackgroundMessage>

        {image && isModalReady && (
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            rotation={rotation}
            onRotationChange={allowRotation ? setRotation : undefined}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            showGrid={false}
            style={{ containerStyle: { background: 'black' } }}
            {...cropperProps}
          />
        )}
      </div>

      <IonFooter>
        <IonToolbar>
          <IonButtons slot="primary">
            <IonButton slot="end" onClick={onDoneEditing}>
              Done
            </IonButton>
          </IonButtons>
          <IonButtons slot="secondary">
            <IonButton slot="start" onClick={onCancelEditing}>
              Cancel
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default ImageCropper;
