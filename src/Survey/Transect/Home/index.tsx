import { FC, useContext } from 'react';
import { observer } from 'mobx-react';
import { checkmarkCircleOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import { Header, Page, useToast } from '@flumens';
import { NavContext, IonButton, IonIcon } from '@ionic/react';
import appModel from 'models/app';
import Sample, { useValidateCheck } from 'models/sample';
import { useUserStatusCheck } from 'models/user';
import Main from './Main';

type Props = {
  sample: Sample;
};

const Controller: FC<Props> = ({ sample }) => {
  const match = useRouteMatch();
  const { navigate } = useContext(NavContext);
  const toast = useToast();
  const checkUserStatus = useUserStatusCheck();
  const checkSampleStatus = useValidateCheck(sample);

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

    appModel.attrs['draftId:transect'] = '';

    navigate(`${match.url}/report`);
  };

  const onAddNewQuadrat = () => {
    if (sample.samples.length > sample.attrs.steps) {
      // in case tapped button twice
      return;
    }

    const survey = sample.getSurvey();
    const quadratSample = survey.smp.create(Sample);
    sample.samples.push(quadratSample);
    sample.save();

    navigate(`${match.url}/quadrat/${quadratSample.cid}`);
  };

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
    <Page id="transect-home">
      <Header title="Transect" rightSlot={uploadButton} />
      <Main
        sample={sample}
        onAddNewQuadrat={onAddNewQuadrat}
        isDisabled={isDisabled}
      />
    </Page>
  );
};

export default observer(Controller);
