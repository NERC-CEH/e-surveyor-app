import { useContext } from 'react';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router-dom';
import { Header, Page, useToast } from '@flumens';
import { NavContext } from '@ionic/react';
import appModel from 'models/app';
import Sample, { useValidateCheck } from 'models/sample';
import { useUserStatusCheck } from 'models/user';
import HeaderButton from 'Survey/common/Components/HeaderButton';
import TrainingModeBanner from 'Survey/common/Components/TrainingModeBanner';
import Main from './Main';

type Props = {
  sample: Sample;
};

const Controller = ({ sample }: Props) => {
  const match = useRouteMatch();
  const { navigate } = useContext(NavContext);
  const toast = useToast();
  const checkUserStatus = useUserStatusCheck();
  const checkSampleStatus = useValidateCheck(sample);

  const onUpload = async () => {
    const isUserOK = await checkUserStatus();
    if (!isUserOK) return;

    const isUploading = await sample.syncRemote(toast.error);
    if (!isUploading) return;

    navigate('/home/surveys', 'root');
  };

  const onFinish = async () => {
    const isValid = checkSampleStatus();
    if (!isValid) return;
    sample.metadata.saved = true;
    sample.save();

    appModel.data['draftId:beetle'] = '';

    navigate('/home/surveys', 'root');
  };

  const onAddNewTrap = async () => {
    const survey = sample.getSurvey();

    const trapSample = survey.smp!.create!({ surveySample: sample });
    sample.samples.push(trapSample);

    navigate(`${match.url}/trap/${trapSample.cid}`);
  };

  const onTrapDelete = async (trap: Sample) => trap.destroy();

  const isDisabled = sample.isUploaded;

  const isInvalid = sample.validateRemote();
  const uploadButton =
    isDisabled || sample.isSynchronising ? null : (
      <HeaderButton
        onClick={sample.metadata.saved ? onUpload : onFinish}
        isInvalid={isInvalid}
      >
        {sample.metadata.saved ? 'Upload' : 'Finish'}
      </HeaderButton>
    );

  const isTraining = !!sample.data.training;

  return (
    <Page id="beetle-home" className="theme-ecosystem">
      <Header
        backButtonLabel="Home"
        title="Trap survey"
        rightSlot={uploadButton}
        subheader={isTraining && <TrainingModeBanner />}
      />
      <Main
        sample={sample}
        onAddNewTrap={onAddNewTrap}
        onTrapDelete={onTrapDelete}
      />
    </Page>
  );
};

export default observer(Controller);
