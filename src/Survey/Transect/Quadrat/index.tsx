import React, { FC } from 'react';
import { Page, Header, device, captureImage, useAlert } from '@flumens';
import { observer } from 'mobx-react';
import ImageModel from 'models/image';
import Sample from 'models/sample';
import appModel from 'models/app';
import Occurrence from 'models/occurrence';
import config from 'common/config';
import { usePromptImageSource } from 'Components/PhotoPicker';
import getPhotoFromCustomCamera from 'helpers/CustomCamera';
import Main from './Main';

type Props = {
  subSample: Sample;
};

const showFirstPhotoTip = (alert: any) => {
  // if (!appModel.attrs.showFirstPhotoTip) return null;

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

  const isDisabled = subSample.isUploaded();
  const promptImageSource = usePromptImageSource();

  const photoSelect = async () => {
    const shouldUseCamera = await promptImageSource();
    const cancelled = shouldUseCamera === null;
    if (cancelled) return;

    if (shouldUseCamera) {
      await showFirstPhotoTip(alert);
    }

    const photos = await captureImage(
      shouldUseCamera
        ? { getPhoto: getPhotoFromCustomCamera }
        : { multiple: true }
    );

    if (!photos || !photos.length) {
      return;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const photo of photos) {
      const dataDirPath = config.dataPath;

      // eslint-disable-next-line no-await-in-loop
      const image = await ImageModel.getImageModel(photo, dataDirPath);

      const survey = subSample.getSurvey();
      const newSubSample = survey.smp.create(Sample, Occurrence, image);

      device.isOnline && newSubSample.occurrences[0].identify();

      subSample.samples.push(newSubSample);
      subSample.save();
    }
  };

  return (
    <Page id="transect-quadrat">
      <Header title={subSample.getPrettyName()} />
      <Main
        subSample={subSample}
        isDisabled={isDisabled}
        photoSelect={photoSelect}
      />
    </Page>
  );
};

export default observer(QuadratController);
