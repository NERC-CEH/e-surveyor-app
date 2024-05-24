import { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import {
  Page,
  Header,
  device,
  useAlert,
  ModelValidationMessage,
  captureImage,
} from '@flumens';
import { NavContext, isPlatform } from '@ionic/react';
import config from 'common/config';
import appModel from 'models/app';
import Media from 'models/image';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import getPhotoFromCustomCamera from 'helpers/CustomCamera';
import ImageCropper from 'Components/ImageCropper';
import { usePromptImageSource } from 'Components/PhotoPickers/PhotoPicker';
import HeaderButton from 'Survey/common/Components/HeaderButton';
import Main from './Main';

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

const HomeController = ({ sample }: Props) => {
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
      const newSubSample = survey.smp!.create!({
        Sample,
        Occurrence,
        photo: image,
      });

      device.isOnline && newSubSample.occurrences[0].identify();

      sample.samples.push(newSubSample);
      sample.save();
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
      const hasUnidentifiedOcc = ({ model, attributes }: any) =>
        model instanceof Occurrence && !attributes.value.taxon;

      const hasUnidentifiedSample = ({ model, models }: any) =>
        model instanceof Sample &&
        Object.values(models).some(hasUnidentifiedOcc);

      const hasUnidentified = Object.values(invalids.models).some(
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
        message: <ModelValidationMessage {...invalids} />,
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

  if (!sample) return null;

  const isDisabled = sample.isUploaded();

  const isInvalid = sample.validateRemote();

  const finishButton = sample.remote.synchronising ? null : (
    <HeaderButton
      onClick={sample.metadata.saved ? navToReport : onFinish}
      isInvalid={isInvalid}
    >
      {sample.metadata.saved ? 'Report' : 'Finish'}
    </HeaderButton>
  );

  if (appModel.attrs.showFirstSurveyTip) showFirstSurveyTip(alert);

  const isTraining = !!sample.attrs.training;
  const trainingModeSubheader = isTraining && (
    <div className="bg-black p-1 text-center text-sm text-white">
      Training Mode
    </div>
  );

  return (
    <Page id="survey-default-edit">
      <Header
        title="Survey"
        rightSlot={finishButton}
        defaultHref="/home/surveys"
        subheader={trainingModeSubheader}
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
