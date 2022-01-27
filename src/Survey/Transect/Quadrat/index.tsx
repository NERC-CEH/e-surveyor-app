import React, { FC } from 'react';
import { Page, Header, toast, device } from '@flumens';
import { observer } from 'mobx-react';
import ImageModel from 'models/image';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import config from 'common/config';
import ImageHelp from 'common/Components/PhotoPicker/imageUtils';
import Main from './Main';

const { warn } = toast;

type Props = {
  subSample: typeof Sample;
};

const QuadratController: FC<Props> = ({ subSample }) => {
  const isDisabled = subSample.isUploaded();

  const identifyPhoto = async (speciesPhoto: any, model: typeof Sample) => {
    try {
      const species = await speciesPhoto.identify();
      if (!species) return;

      model.setSpecies(species[0]);
      model.save();
    } catch (e) {
      console.error(e);
    }
  };

  const photoSelect = async () => {
    if (!device.isOnline()) {
      warn('Looks like you are offline!');
      return;
    }

    const photo = await ImageHelp.getImage();

    if (!photo) {
      return;
    }

    const dataDirPath = config.dataPath;

    const image = await ImageHelp.getImageModel(ImageModel, photo, dataDirPath);

    const survey = subSample.getSurvey();
    const newSubSample = survey.smp.create(Sample, Occurrence, image);

    identifyPhoto(image, newSubSample);

    subSample.samples.push(newSubSample);
    subSample.save();
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
