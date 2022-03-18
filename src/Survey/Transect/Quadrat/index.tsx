import React, { FC, useState } from 'react';
import { Page, Header, device, captureImage, useAlert } from '@flumens';
import { observer } from 'mobx-react';
import Media from 'models/image';
import { isPlatform } from '@ionic/react';
import Sample from 'models/sample';
import appModel from 'models/app';
import Occurrence from 'models/occurrence';
import config from 'common/config';
import { Capacitor } from '@capacitor/core';
import { usePromptImageSource } from 'Components/PhotoPicker';
import getPhotoFromCustomCamera from 'helpers/CustomCamera';
import ImageCropper from 'Components/ImageCropper';
import Main from './Main';

type URL = string;

type Props = {
  subSample: Sample;
};

const showFirstPhotoTip = (alert: any) => {
  if (!appModel.attrs.showFirstPhotoTip) return null;

  appModel.attrs.showFirstPhotoTip = false;

  return new Promise(resolve => {
    alert({
      skipTranslation: true,
      header: '5 tips for an AI-friendly image',
      message: (
        <ol>
          <li>
            Make sure that one part of your species (such as a flower or a leaf)
            is in the centre of the image.
          </li>
          <li>
            Try to avoid a busy background, particularly one with a lot of other
            species in it.
          </li>
          <li>
            Focus the image by tapping on the part of your species you want to
            take a photo of, and then slowly zoom in, refocusing as you go.
          </li>
          <li>
            Check that nothing is between the species and the camera, such as an
            insect or your finger.
          </li>
          <li>
            If the AI uis uncertain about hte species you can add more photos
            from different angles or of different parts of your species to help
            improve identification.
          </li>
        </ol>
      ),
      buttons: [
        {
          text: 'OK, got it',
          role: 'cancel',
          handler: resolve,
        },
      ],
    });
  });
};

const QuadratController: FC<Props> = ({ subSample }) => {
  const alert = useAlert();
  const [editImage, setEditImage] = useState<URL>();

  const isDisabled = subSample.isUploaded();
  const promptImageSource = usePromptImageSource();

  const attachImages = async (photoURLs: URL[]) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const photoURL of photoURLs) {
      const dataDirPath = config.dataPath;

      // eslint-disable-next-line no-await-in-loop
      const image = await Media.getImageModel(photoURL, dataDirPath);

      const survey = subSample.getSurvey();
      const newSubSample = survey.smp.create(Sample, Occurrence, image);

      device.isOnline && newSubSample.occurrences[0].identify();

      subSample.samples.push(newSubSample);
      subSample.save();
    }
  };

  const photoSelect = async () => {
    const shouldUseCamera = await promptImageSource();
    const cancelled = shouldUseCamera === null;
    if (cancelled) return;

    if (shouldUseCamera) {
      await showFirstPhotoTip(alert);
    }

    const photoURLs = await captureImage(
      shouldUseCamera
        ? { getPhoto: getPhotoFromCustomCamera }
        : { multiple: true }
    );

    if (!photoURLs || !photoURLs.length) return;

    const canEdit = photoURLs.length === 1;
    if (canEdit) {
      let imageToEdit = photoURLs[0];
      if (isPlatform('hybrid')) {
        imageToEdit = Capacitor.convertFileSrc(imageToEdit);
      }

      setEditImage(imageToEdit);
      return;
    }

    attachImages(photoURLs);
  };

  const onDoneEdit = (image: URL) => {
    attachImages([image]);
    setEditImage(undefined);
  };
  const onCancelEdit = () => setEditImage(undefined);

  return (
    <Page id="transect-quadrat">
      <Header title={subSample.getPrettyName()} />
      <Main
        subSample={subSample}
        isDisabled={isDisabled}
        photoSelect={photoSelect}
      />
      <ImageCropper
        image={editImage}
        onDone={onDoneEdit}
        onCancel={onCancelEdit}
      />
    </Page>
  );
};

export default observer(QuadratController);
