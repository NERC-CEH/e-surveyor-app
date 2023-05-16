import { FC, useContext, useState } from 'react';
import { observer } from 'mobx-react';
import { checkmarkCircleOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import {
  captureImage,
  device,
  Header,
  Page,
  useLoader,
  useToast,
} from '@flumens';
import { NavContext, IonButton, IonIcon, isPlatform } from '@ionic/react';
import config from 'common/config';
// import appModel from 'models/app';
import Media from 'models/image';
import Occurrence from 'models/occurrence';
import Sample, { useValidateCheck } from 'models/sample';
import { useUserStatusCheck } from 'models/user';
import getPhotoFromCustomCamera from 'helpers/CustomCamera';
import ImageCropper from 'Components/ImageCropper';
import Main from './Main';
import detectObjects from './objectDetection';

type URL = string;

type Props = {
  sample: Sample;
};

const Controller: FC<Props> = ({ sample }) => {
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
    // sample.metadata.saved = true;
    // sample.save();

    // appModel.attrs['draftId:beetle'] = '';

    toast.success('👷‍♂️ work in progress. This part is disabled');

    // navigate(`${match.url}/report`);
  };

  const [editImage, setEditImage] = useState<URL>();

  const attachImages = async (photoURL: URL) => {
    loader.show('Analysing the trap photo...');

    const survey = sample.getSurvey();

    // new subsample
    const dataDirPath = config.dataPath;
    const image = await Media.getImageModel(photoURL, dataDirPath);
    const trapSample = survey.smp.create(Sample, null, image);
    sample.samples.push(trapSample);

    navigate(`${match.url}/trap/${trapSample.cid}`);

    // detect beetles and create occurrences
    const [beetlePhotos] = await detectObjects(image.getURL());
    const getOccurrence = async (beetlePhotoURL: URL) => {
      const mediaModel = await Media.getImageModel(beetlePhotoURL, dataDirPath);
      return survey.smp.occ.create(Occurrence, mediaModel);
    };
    const occurrences = await Promise.all(beetlePhotos.map(getOccurrence));
    trapSample.occurrences.push(...occurrences);
    sample.save();

    occurrences.forEach(occ => device.isOnline && occ.identify());

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

  const onDoneEdit = (image: URL) => {
    attachImages(image);
    setEditImage(undefined);
  };
  const onCancelEdit = () => setEditImage(undefined);

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

  return (
    <Page id="beetle-home">
      <Header
        backButtonLabel="Home"
        title="Trap survey"
        rightSlot={uploadButton}
      />
      <Main sample={sample} onAddNewTrap={onAddNewTrap} />
      <ImageCropper
        image={editImage}
        onDone={onDoneEdit}
        onCancel={onCancelEdit}
        message="Place your tray at the center of the frame."
      />

      <canvas id="imageCanvas" className="hidden" />
    </Page>
  );
};

export default observer(Controller);
