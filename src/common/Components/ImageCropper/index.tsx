import React, { FC, useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types'; // eslint-disable-line import/no-unresolved
import {
  IonButton,
  IonModal,
  IonFooter,
  IonToolbar,
  IonButtons,
  isPlatform,
} from '@ionic/react';
import { InfoBackgroundMessage, getObjectURL, cropImage, URL } from '@oldBit';
import { Filesystem, Directory } from '@capacitor/filesystem';
import './styles.scss';

type Props = {
  image?: URL;
  onDone: (newImage: URL) => any;
  onCancel: any;
};

const ImageCropper: FC<Props> = ({ image, onDone, onCancel }) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [croppedArea, setCroppedArea] = useState<Area>();
  const setCroppedAreaWrap = (_: any, area: Area) => setCroppedArea(area);
  const onCropComplete = useCallback(setCroppedAreaWrap, [image]);

  const resetOnNewImage = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };
  useEffect(resetOnNewImage, [image]);

  const onDoneEditing = async () => {
    if (!croppedArea || !image) return;

    const imageDataURL: URL = await cropImage(image, croppedArea);
    if (!isPlatform('hybrid')) {
      onDone(getObjectURL(imageDataURL));
      return;
    }

    const fileName: string = image.split('/').pop() as string;

    await Filesystem.writeFile({
      path: fileName,
      data: imageDataURL,
      directory: Directory.Data,
    });

    const { uri } = await Filesystem.stat({
      path: fileName,
      directory: Directory.Data,
    });

    onDone(uri);
  };

  return (
    <IonModal
      isOpen={!!image}
      backdropDismiss={false}
      animated={false}
      className="image-cropper"
    >
      <div>
        <InfoBackgroundMessage>
          Place your plant at the center of the frame.
        </InfoBackgroundMessage>

        {image && (
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            rotation={0}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            showGrid={false}
            objectFit="horizontal-cover"
            style={{ containerStyle: { background: 'black' } }}
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
            <IonButton slot="start" onClick={onCancel}>
              Cancel
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default ImageCropper;
