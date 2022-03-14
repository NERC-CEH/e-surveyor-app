import React, { FC, useContext, useState } from 'react';
import {
  Page,
  Header,
  device,
  useAlert,
  getDeepErrorMessage,
  captureImage,
} from '@flumens';
import Sample from 'models/sample';
import appModel from 'models/app';
import Occurrence from 'models/occurrence';
import { observer } from 'mobx-react';
import { IonButton, NavContext, isPlatform } from '@ionic/react';
import config from 'common/config';
import { Capacitor } from '@capacitor/core';
import Media from 'models/image';
import getPhotoFromCustomCamera from 'helpers/CustomCamera';
import ImageCropper from 'Components/ImageCropper';
import { usePromptImageSource } from 'Components/PhotoPicker';
import { useRouteMatch } from 'react-router-dom';
import Main from './Main';
import './styles.scss';

type URL = string;

type Props = {
  sample: Sample;
};

const showFirstSurveyTip = (alert: any) => {
  alert({
    skipTranslation: true,
    header: 'Your first survey',
    message: (
      <>
        You can add plant photos using your camera and we will try to identify
        them for you. Alternatively, you can long-press the button to enter the
        species manually.
      </>
    ),
    buttons: [
      {
        text: 'OK, got it',
        role: 'cancel',
        cssClass: 'primary',
      },
    ],
  });

  appModel.attrs.showFirstSurveyTip = false;
};

const HomeController: FC<Props> = ({ sample }) => {
  const match = useRouteMatch();
  const { navigate } = useContext(NavContext);
  const alert = useAlert();
  const promptImageSource = usePromptImageSource();

  const [editImage, setEditImage] = useState<URL>();

  const attachImages = async (photoURLs: URL[]) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const photoURL of photoURLs) {
      const dataDirPath = config.dataPath;

      // eslint-disable-next-line no-await-in-loop
      const image = await Media.getImageModel(photoURL, dataDirPath);

      const survey = sample.getSurvey();
      const newSubSample = survey.smp.create(Sample, Occurrence, image);

      device.isOnline && newSubSample.occurrences[0].identify();

      sample.samples.push(newSubSample);
      sample.save();
    }
  };

  const photoSelect = async () => {
    const shouldUseCamera = await promptImageSource();
    const cancelled = shouldUseCamera === null;
    if (cancelled) return;

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

  const navToReport = async () => {
    navigate(`${match.url}/report`);
  };

  const onDoneEdit = (image: URL) => {
    attachImages([image]);
    setEditImage(undefined);
  };
  const onCancelEdit = () => setEditImage(undefined);

  const onFinish = async () => {
    const invalids = sample.validateRemote();
    if (invalids) {
      const hasUnidentifiedOcc = (occ: any) => !occ.attributes.value.taxon;
      const hasUnidentifiedSample = (smp: any) =>
        Object.values(smp.occurrences).some(hasUnidentifiedOcc);
      const hasUnidentified = Object.values(invalids.samples).some(
        hasUnidentifiedSample
      );

      if (hasUnidentified) {
        alert({
          header: "Some of photos you have taken haven't been identified",
          message: `You can identify them yourself by tapping the species photo and searching for the known species, or wait until you have phone signal, when the AI will identify them for you.`,
          buttons: [
            {
              text: 'Got it',
              role: 'cancel',
            },
          ],
        });
        return;
      }

      alert({
        header: 'Survey incomplete',
        message: getDeepErrorMessage(invalids),
        buttons: [
          {
            text: 'Got it',
            role: 'cancel',
          },
        ],
      });
      return;
    }

    // eslint-disable-next-line no-param-reassign
    sample.metadata.saved = true;
    sample.save();

    appModel.attrs['draftId:point'] = '';
    navToReport();
  };

  if (!sample) {
    return null;
  }

  const isDisabled = sample.isUploaded();

  const finishButton = sample.remote.synchronising ? null : (
    <IonButton
      onClick={sample.metadata.saved ? navToReport : onFinish}
      color="secondary"
      fill="solid"
    >
      {sample.metadata.saved ? 'See Report' : 'Finish'}
    </IonButton>
  );

  if (appModel.attrs.showFirstSurveyTip) showFirstSurveyTip(alert);

  return (
    <Page id="survey-default-edit">
      <Header
        title="Survey"
        rightSlot={finishButton}
        defaultHref="/home/surveys"
      />
      <Main
        match={match}
        sample={sample}
        photoSelect={photoSelect}
        isDisabled={isDisabled}
      />
      <ImageCropper
        image={editImage}
        onDone={onDoneEdit}
        onCancel={onCancelEdit}
      />
    </Page>
  );
};

export default observer(HomeController);
