import React, { FC } from 'react';
import { Page, Header, device, captureImage } from '@flumens';
import { observer } from 'mobx-react';
import ImageModel from 'models/image';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import config from 'common/config';
import { usePromptImageSource } from 'Components/PhotoPicker';
import getPhotoFromCustomCamera from 'helpers/CustomCamera';
import Main from './Main';

type Props = {
  subSample: Sample;
};

const QuadratController: FC<Props> = ({ subSample }) => {
  const isDisabled = subSample.isUploaded();
  const promptImageSource = usePromptImageSource();

  const photoSelect = async () => {
    const shouldUseCamera = await promptImageSource();
    const cancelled = shouldUseCamera === null;
    if (cancelled) return;

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
