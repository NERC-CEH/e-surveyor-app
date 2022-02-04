import React, { FC, useContext } from 'react';
import {
  Page,
  Header,
  toast,
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
} from '@ionic/react';
import config from 'common/config';
import Media from 'models/image';
import ImageHelp from 'common/Components/PhotoPicker/imageUtils';
import { checkmarkCircleOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import Main from './Main';

const { warn } = toast;

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
  appModel.save();
};

const HomeController: FC<Props> = ({ sample }) => {
  const match = useRouteMatch();
  const { navigate } = useContext(NavContext);
  const alert = useAlert();
  const [presentActionSheet] = useIonActionSheet();

  const identifyPhoto = async (
    speciesPhoto: typeof Media,
    subSample: typeof Sample
  ) => {
    try {
      const species = await speciesPhoto.identify();
      if (!species) return;

      subSample.setSpecies(species[0]);
      subSample.save();
    } catch (e) {
      console.error(e);
    }
  };

  const photoSelect = async () => {
    if (!device.isOnline()) {
      warn('Looks like you are offline!');
      return;
    }

    const photos = await ImageHelp.getImages(undefined, presentActionSheet);
    if (!photos || !photos.length) {
      return;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const photo of photos) {
      const dataDirPath = config.dataPath;

      // eslint-disable-next-line no-await-in-loop
      const image = await ImageHelp.getImageModel(Media, photo, dataDirPath);

      const survey = sample.getSurvey();
      const newSubSample = survey.smp.create(Sample, Occurrence, image);

      identifyPhoto(image, newSubSample);

      sample.samples.push(newSubSample);
      sample.save();
    }
  };

  const onUpload = async () => {
    const isUploading = await sample.upload(alert);
    if (!isUploading) return;

    navigate(`/home/surveys`, 'root');
  };

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

  if (!appModel.attrs.showFirstSurveyTip) showFirstSurveyTip(alert);

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
    </Page>
  );
};

export default observer(HomeController);
