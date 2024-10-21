import { useContext } from 'react';
import { useToast, Page, Header } from '@flumens';
import { NavContext } from '@ionic/react';
import Sample, { useValidateCheck } from 'common/models/sample';
import { useUserStatusCheck } from 'common/models/user';
import HeaderButton from 'Survey/common/Components/HeaderButton';
import Main from './Main';

type Props = { sample: Sample };

const Report = ({ sample }: Props) => {
  const { navigate } = useContext(NavContext);
  const toast = useToast();
  const checkSampleStatus = useValidateCheck(sample);
  const checkUserStatus = useUserStatusCheck();

  const onSync = async () => {
    const isUserOK = await checkUserStatus();
    if (!isUserOK) return;

    const isValid = checkSampleStatus();
    if (!isValid) return;

    sample.syncRemote(toast.error);

    navigate(`/home/surveys`, 'root');
  };

  const isInvalid = sample.validateRemote();
  const requiresSync = sample.requiresRemoteSync();
  const isUploaded = sample.isUploaded();

  const finishButton =
    sample.remote.synchronising || !requiresSync ? null : (
      <HeaderButton onClick={onSync} isInvalid={isInvalid}>
        {isUploaded ? 'Sync' : 'Upload'}
      </HeaderButton>
    );

  return (
    <Page id="survey-soil-report">
      <Header title="Report" rightSlot={finishButton} />
      <Main />
    </Page>
  );
};

export default Report;
