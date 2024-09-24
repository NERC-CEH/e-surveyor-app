import { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import {
  captureImage,
  getNewUUID,
  getObjectURL,
  Header,
  Page,
  saveFile,
  useLoader,
  useToast,
} from '@flumens';
import { NavContext, isPlatform } from '@ionic/react';
import config from 'common/config';
import appModel from 'models/app';
import Media from 'models/image';
import Occurrence from 'models/occurrence';
import Sample, { useValidateCheck } from 'models/sample';
import { useUserStatusCheck } from 'models/user';
import getPhotoFromCustomCamera from 'helpers/CustomCamera';
import ImageCropper from 'Components/ImageCropper';
import HeaderButton from 'Survey/common/Components/HeaderButton';
import Main from './Main';
import detectObjects from './objectDetection';

type URL = string;

const dataURItoFile = (dataURI: string) =>
  isPlatform('hybrid')
    ? saveFile(dataURI, `${getNewUUID()}.jpg`)
    : getObjectURL(dataURI);

type Props = {
  sample: Sample;
};

const Controller = ({ sample }: Props) => {
  const match = useRouteMatch();
  const { navigate } = useContext(NavContext);
  const toast = useToast();
  const checkUserStatus = useUserStatusCheck();
  const checkSampleStatus = useValidateCheck(sample);
  const loader = useLoader();

  const onUpload = async () => {
    const isUserOK = await checkUserStatus();
    if (!isUserOK) return;

    const isUploading = await sample.upload().catch(toast.error);
    if (!isUploading) return;

    navigate(`/home/surveys`, 'root');
  };

  const onFinish = async () => {
    const isValid = checkSampleStatus();
    if (!isValid) return;

    // eslint-disable-next-line no-param-reassign
    sample.metadata.saved = true;
    sample.save();

    appModel.attrs['draftId:beetle'] = '';

    navigate(`/home/surveys`, 'root');
  };

  const [editImage, setEditImage] = useState<URL>();

  const attachImages = async (photoURL: URL) => {
    loader.show('Analysing the trap photo...');

    const survey = sample.getSurvey();

    // new subsample
    const dataDirPath = config.dataPath;
    const image = await Media.getImageModel(photoURL, dataDirPath);
    const trapSample = survey.smp!.create!({
      Sample,
      photo: image,
      surveySample: sample,
    });
    sample.samples.push(trapSample);

    navigate(`${match.url}/trap/${trapSample.cid}`);

    // detect beetles and create occurrences
    const [beetlePhotoURIs] = await detectObjects(image.getURL());
    const beetlePhotos = await Promise.all(beetlePhotoURIs.map(dataURItoFile));

    const getOccurrence = async (beetlePhotoURL: URL) => {
      const mediaModel = await Media.getImageModel(beetlePhotoURL, dataDirPath);
      return survey.smp!.occ!.create!({ Occurrence, photo: mediaModel });
    };
    const occurrences = await Promise.all(beetlePhotos.map(getOccurrence));
    trapSample.occurrences.push(...occurrences);
    sample.save();

    // TODO: enable once the AI is ready
    // occurrences.forEach(occ => device.isOnline && occ.identify());

    loader.hide();
  };

  const onAddNewTrap = async () => {
    const photoURLs = await captureImage(
      !isPlatform('hybrid')
        ? { camera: false }
        : { getPhoto: getPhotoFromCustomCamera }
    );

    if (!photoURLs || !photoURLs.length) return;

    let imageToEdit = photoURLs[0];
    if (isPlatform('hybrid')) {
      imageToEdit = Capacitor.convertFileSrc(imageToEdit);
    }

    setEditImage(imageToEdit);
  };

  const onTrapDelete = async (trap: Sample) => trap.destroy();

  const onDoneEdit = (image: URL) => {
    attachImages(image);
    setEditImage(undefined);
  };
  const onCancelEdit = () => setEditImage(undefined);

  const isDisabled = sample.isUploaded();

  const isInvalid = sample.validateRemote();
  const uploadButton =
    isDisabled || sample.remote.synchronising ? null : (
      <HeaderButton
        onClick={sample.metadata.saved ? onUpload : onFinish}
        isInvalid={isInvalid}
      >
        {sample.metadata.saved ? 'Upload' : 'Finish'}
      </HeaderButton>
    );

  const isTraining = !!sample.attrs.training;
  const trainingModeSubheader = isTraining && (
    <div className="bg-black p-1 text-center text-sm text-white">
      Training Mode
    </div>
  );

  return (
    <Page id="beetle-home">
      <Header
        backButtonLabel="Home"
        title="Trap survey"
        rightSlot={uploadButton}
        subheader={trainingModeSubheader}
      />
      <Main
        sample={sample}
        onAddNewTrap={onAddNewTrap}
        onTrapDelete={onTrapDelete}
      />
      <ImageCropper
        image={editImage}
        onDone={onDoneEdit}
        onCancel={onCancelEdit}
        message="Align the rectangle with the edges of the tray."
        allowRotation
        cropperProps={{ aspect: 0.7 }}
      />

      <canvas id="imageCanvas" className="hidden" />
    </Page>
  );
};

export default observer(Controller);
