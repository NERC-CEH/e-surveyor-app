import React, { FC, useContext } from 'react';
import {
  Page,
  Header,
  toast,
  device,
  showInvalidsMessage,
  loader,
} from '@flumens';
import Sample from 'models/sample';
import appModel from 'models/app';
import userModel from 'models/user';
import Occurrence from 'models/occurrence';
import { observer } from 'mobx-react';
import { IonButton, IonIcon, NavContext } from '@ionic/react';
import config from 'common/config';
import Media from 'models/image';
import ImageHelp from 'common/Components/PhotoPicker/imageUtils';
import { checkmarkCircleOutline } from 'ionicons/icons';
import identifyImage from 'common/services/plantNet';
import { useRouteMatch } from 'react-router-dom';
import i18n from 'i18next';
import Main from './Main';

const { warn } = toast;

type Props = {
  sample: typeof Sample;
};

const HomeController: FC<Props> = ({ sample }) => {
  const match = useRouteMatch();
  const { navigate } = useContext(NavContext);

  const identifyPhoto = async (
    image: typeof Media,
    subSample: typeof Sample
  ) => {
    const speciesImg = image;

    speciesImg.identification.identifying = true;

    try {
      const species = await identifyImage(speciesImg);
      speciesImg.attrs.species = species;

      // eslint-disable-next-line
      subSample.setSpecies(species[0]);

      speciesImg.identification.identifying = false;
      subSample.save();
    } catch (e) {
      speciesImg.identification.identifying = false;
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

    const image = await ImageHelp.getImageModel(Media, photo, dataDirPath);

    const survey = sample.getSurvey();
    const newSubSample = survey.smp.create(Sample, Occurrence, image);

    identifyPhoto(image, newSubSample);

    sample.samples.push(newSubSample);
    sample.save();
  };

  const onUpload = async () => {
    const invalids = sample.validateRemote();

    if (invalids) {
      showInvalidsMessage(invalids);
      return;
    }

    if (!device.isOnline()) {
      warn(i18n.t('Looks like you are offline!'));
      return;
    }

    const isLoggedIn = !!userModel.attrs.id;
    if (!isLoggedIn) {
      warn(i18n.t('Please log in first to upload the records.'));
      return;
    }

    if (!userModel.attrs.verified) {
      await loader.show({
        message: i18n.t('Please wait...'),
      });

      try {
        await userModel.refreshProfile();
      } catch (e) {
        // do nothing
      }

      loader.hide();

      if (!userModel.attrs.verified) {
        warn(
          i18n.t("Sorry, your account hasn't been verified yet or is blocked.")
        );
        return;
      }
    }

    await loader.show({
      message: i18n.t('Uploading your survey...'),
    });

    try {
      await sample.saveRemote();

      navigate(`${match.url}/report`);
    } catch (e) {
      // do nothing
    }

    loader.hide();
  };

  if (!sample) {
    return null;
  }

  const isDisabled = sample.isUploaded();

  const uploadButton = isDisabled ? (
    <IonButton
      color="secondary"
      fill="solid"
      routerLink={`${match.url}/report`}
    >
      See Report
    </IonButton>
  ) : (
    <IonButton onClick={onUpload} color="secondary" fill="solid">
      <IonIcon icon={checkmarkCircleOutline} slot="start" />
      Finish
    </IonButton>
  );

  return (
    <Page id="survey-default-edit">
      <Header
        title="Survey"
        rightSlot={uploadButton}
        defaultHref="/home/surveys"
      />
      <Main
        match={match}
        sample={sample}
        appModel={appModel}
        url={match.url}
        photoSelect={photoSelect}
        isDisabled={isDisabled}
      />
    </Page>
  );
};

export default observer(HomeController);
