/* eslint-disable no-param-reassign */
import { useContext } from 'react';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router';
import { Capacitor } from '@capacitor/core';
import { Page, useToast, captureImage, device, Header } from '@flumens';
import { NavContext, isPlatform } from '@ionic/react';
import CONFIG from 'common/config';
import appModel from 'models/app';
import Media from 'models/image';
import Occurrence from 'models/occurrence';
import Sample, { useValidateCheck } from 'models/sample';
import { useUserStatusCheck } from 'models/user';
import HeaderButton from 'Survey/common/Components/HeaderButton';
import Main from './Main';

interface Props {
  sample: Sample;
}

const HomeController = ({ sample }: Props) => {
  const match = useRouteMatch();

  const { navigate } = useContext(NavContext);
  const toast = useToast();
  const checkSampleStatus = useValidateCheck(sample);
  const checkUserStatus = useUserStatusCheck();

  const isDisabled = sample.isDisabled();

  const surveyConfig = sample.getSurvey();

  const onFinish = async () => {
    const isValid = checkSampleStatus();
    if (!isValid) return;

    const saveAndReturn = () => {
      sample.cleanUp();
      sample.save();
      navigate(`${match.url}/report`);
    };

    // eslint-disable-next-line no-param-reassign
    sample.metadata.saved = true;
    saveAndReturn();
  };

  const onIdentifyOccurrence = async (occ: Occurrence) => {
    if (
      appModel.attrs.useWiFiDataConnection &&
      device.connectionType !== 'wifi'
    )
      return;

    const isUserOK = await checkUserStatus();
    if (!isUserOK) return;

    try {
      await occ.identify();
    } catch (error: any) {
      toast.error(error);
    }
  };

  const photoSelect = async (shouldUseCamera: boolean = true) => {
    async function getImage() {
      const images = await captureImage(
        shouldUseCamera ? { camera: true } : { multiple: true }
      );
      if (!images.length) return [];

      const getImageModel = (image: any) =>
        Media.getImageModel(
          isPlatform('hybrid') ? Capacitor.convertFileSrc(image) : image,
          CONFIG.dataPath
        ) as Promise<Media>;

      const imageModels = images.map(getImageModel);

      return Promise.all(imageModels);
    }

    const images = await getImage();
    if (!images.length) return;

    images.forEach((photo: Media) => {
      const newOccurrence = surveyConfig.occ!.create!({
        Occurrence,
        photo,
      });

      sample.occurrences.push(newOccurrence);
      sample.save();

      if (device.isOnline) onIdentifyOccurrence(newOccurrence);
    });
  };

  const gallerySelect = () => photoSelect(false);

  const isInvalid = sample.validateRemote();

  const finishButton = sample.remote.synchronising ? null : (
    <HeaderButton onClick={onFinish} isInvalid={isInvalid}>
      {sample.metadata.saved ? 'Report' : 'Finish'}
    </HeaderButton>
  );

  const isTraining = !!sample.attrs.training;
  const trainingModeSubheader = isTraining && (
    <div className="bg-black p-1 text-center text-sm text-white">
      Training Mode
    </div>
  );

  return (
    <Page id="survey-moth-home">
      <Header
        title="Moth recording"
        rightSlot={finishButton}
        subheader={trainingModeSubheader}
      />
      <Main
        sample={sample}
        isDisabled={isDisabled}
        photoSelect={photoSelect}
        gallerySelect={gallerySelect}
      />
    </Page>
  );
};

export default observer(HomeController);
