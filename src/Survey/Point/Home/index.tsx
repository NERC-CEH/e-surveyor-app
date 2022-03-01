import React, { FC, useContext, useState } from 'react';
import {
  Page,
  Header,
  useToast,
  device,
  useAlert,
  getDeepErrorMessage,
} from '@flumens';
import Sample from 'models/sample';
import appModel from 'models/app';
import Occurrence from 'models/occurrence';
import { observer } from 'mobx-react';
import {
  IonButton,
  IonIcon,
  NavContext,
  useIonActionSheet,
  isPlatform,
} from '@ionic/react';
import config from 'common/config';
import { Capacitor } from '@capacitor/core';
import Media from 'models/image';
import {
  getImages,
  getImageModel,
} from 'common/Components/PhotoPicker/imageUtils';
import ImageCropper from 'common/Components/ImageCropper';
import { checkmarkCircleOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import Main from './Main';
import './styles.scss';

type URL = string;

type Props = {
  sample: typeof Sample;
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
  const [presentActionSheet] = useIonActionSheet();
  const alert = useAlert();
  const toast = useToast();

  const [editImage, setEditImage] = useState<URL>();

  const attachImages = async (photoURLs: URL[]) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const photoURL of photoURLs) {
      const dataDirPath = config.dataPath;

      // eslint-disable-next-line no-await-in-loop
      const image = await getImageModel(Media, photoURL, dataDirPath);

      const survey = sample.getSurvey();
      const newSubSample = survey.smp.create(Sample, Occurrence, image);

      device.isOnline && newSubSample.occurrences[0].identify();

      sample.samples.push(newSubSample);
      sample.save();
    }
  };

  const photoSelect = async () => {
    const photoURLs = await getImages(undefined, presentActionSheet);

    if (!photoURLs || !photoURLs.length) {
      return;
    }

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

  const onUpload = async () => {
    const isUploading = await sample.upload(alert, toast);
    if (!isUploading) return;

    navigate(`/home/surveys`, 'root');
  };

  const onDoneEdit = (image: URL) => {
    attachImages([image]);
    setEditImage(undefined);
  };
  const onCancelEdit = () => setEditImage(undefined);

  const onFinish = async () => {
    const invalids = sample.validateRemote();
    if (invalids) {
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

    navigate(`${match.url}/report`);
  };

  if (!sample) {
    return null;
  }

  const isDisabled = sample.isUploaded();

  const uploadButton =
    isDisabled || sample.remote.synchronising ? null : (
      <IonButton
        onClick={sample.metadata.saved ? onUpload : onFinish}
        color="secondary"
        fill="solid"
      >
        <IonIcon icon={checkmarkCircleOutline} slot="start" />
        {sample.metadata.saved ? 'Upload' : 'Finish'}
      </IonButton>
    );

  if (appModel.attrs.showFirstSurveyTip) showFirstSurveyTip(alert);

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
