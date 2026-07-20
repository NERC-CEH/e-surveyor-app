import { useContext } from 'react';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router';
import { Page, useToast, captureImage, device, Header } from '@flumens';
import { NavContext } from '@ionic/react';
import appModel from 'models/app';
import Media from 'models/image';
import Occurrence from 'models/occurrence';
import Sample, { useValidateCheck } from 'models/sample';
import { useUserStatusCheck } from 'models/user';
import HeaderButton from 'Survey/common/Components/HeaderButton';
import TrainingModeBanner from 'Survey/common/Components/TrainingModeBanner';
import config from '../config';
import IntroAlert from './IntroAlert';
import Main from './Main';

type Props = {
  sample: Sample;
};

const HomeController = ({ sample }: Props) => {
  const match = useRouteMatch();

  const { navigate } = useContext(NavContext);
  const toast = useToast();
  const checkSampleStatus = useValidateCheck(sample);
  const checkUserStatus = useUserStatusCheck();

  const { isDisabled } = sample;

  const surveyConfig = sample.getSurvey();

  const onFinish = async () => {
    const isValid = checkSampleStatus();
    if (!isValid) return;

    const saveAndReturn = () => {
      sample.cleanUp();
      sample.save();
      navigate(`${match.url}/report`);
    };

    sample.metadata.saved = true;
    appModel.data[`draftId:${config.name}`] = '';

    saveAndReturn();
  };

  const onIdentifyOccurrence = async (occ: Occurrence) => {
    if (appModel.data.useWiFiDataConnection && device.connectionType !== 'wifi')
      return;

    const isUserOK = await checkUserStatus();
    if (!isUserOK) return;

    try {
      await occ.identify();
    } catch (error: any) {
      toast.error(error);
    }
  };

  const photoSelect = async (shouldUseCamera = true) => {
    async function getImage() {
      const images = await captureImage(
        shouldUseCamera ? { camera: true } : { multiple: true }
      );
      if (!images.length) return [];

      const getImageModel = (image: any) => Media.getImageModel(image);

      const imageModels = images.map(getImageModel);

      return Promise.all(imageModels);
    }

    const images = await getImage();
    if (!images.length) return;

    images.forEach((photo: Media) => {
      const newOccurrence = surveyConfig.occ!.create!({ photo });
      sample.occurrences.push(newOccurrence);
      sample.save();

      if (device.isOnline) onIdentifyOccurrence(newOccurrence);
    });
  };

  const gallerySelect = () => photoSelect(false);

  const isInvalid = sample.validateRemote();

  const finishButton = sample.isSynchronising ? null : (
    <HeaderButton onClick={onFinish} isInvalid={isInvalid}>
      {sample.metadata.saved ? 'Report' : 'Finish'}
    </HeaderButton>
  );

  const isTraining = !!sample.data.training;

  return (
    <Page id="survey-moth-home" className="theme-ecosystem">
      <Header
        title="Moth recording"
        rightSlot={finishButton}
        subheader={isTraining && <TrainingModeBanner />}
      />
      <Main
        sample={sample}
        isDisabled={isDisabled}
        photoSelect={photoSelect}
        gallerySelect={gallerySelect}
      />
      {!isDisabled && <IntroAlert />}
    </Page>
  );
};

export default observer(HomeController);
