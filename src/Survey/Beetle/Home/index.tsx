import { useContext } from 'react';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router-dom';
import { Header, Page, useToast } from '@flumens';
import { NavContext } from '@ionic/react';
import appModel from 'models/app';
import Sample, { useValidateCheck } from 'models/sample';
import { useUserStatusCheck } from 'models/user';
import HeaderButton from 'Survey/common/Components/HeaderButton';
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

    navigate(`/home/surveys`, 'root');
  };

  const onFinish = async () => {
    const isValid = checkSampleStatus();
    if (!isValid) return;

    // eslint-disable-next-line no-param-reassign
    sample.metadata.saved = true;
    sample.save();

    appModel.data['draftId:beetle'] = '';

    navigate(`/home/surveys`, 'root');
  };

  const onAddNewTrap = async () => {
    const survey = sample.getSurvey();

    const trapSample = survey.smp!.create!({
      Sample,
      surveySample: sample,
    });
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
    </Page>
  );
};

export default observer(Controller);
