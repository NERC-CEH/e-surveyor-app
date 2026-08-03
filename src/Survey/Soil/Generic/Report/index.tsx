import { useContext } from 'react';
import { useToast, Page, Header, useSample } from '@flumens';
import { NavContext } from '@ionic/react';
import Sample, { useValidateCheck } from 'common/models/sample';
import { useUserStatusCheck } from 'common/models/user';
import HeaderButton from 'Survey/common/Components/HeaderButton';
import useUploadSurveyConfirmation from 'Survey/common/useUploadSurveyConfirmation';
import Main from './Main';

const Report = () => {
  const { sample } = useSample<Sample>();
  if (!sample) throw new Error('Sample is missing');

  const { navigate } = useContext(NavContext);
  const toast = useToast();
  const checkSampleStatus = useValidateCheck(sample);
  const checkUserStatus = useUserStatusCheck();
  const showUploadSurveyConfirmation = useUploadSurveyConfirmation();

  const onSync = async () => {
    const isUserOK = await checkUserStatus();
    if (!isUserOK) return;

    const isValid = checkSampleStatus();
    if (!isValid) return;

    const isConfirmed = await showUploadSurveyConfirmation();
    if (!isConfirmed) return;

    const isUploading = await sample.syncRemote(toast.error);
    if (!isUploading) return;

    navigate('/home/surveys', 'root');
  };

  const isInvalid = sample.validateRemote();
  const requiresSync = sample.requiresRemoteSync();
  const { isUploaded } = sample;

  const finishButton =
    sample.isSynchronising || !requiresSync ? null : (
      <HeaderButton onClick={onSync} isInvalid={isInvalid}>
        {isUploaded ? 'Sync' : 'Upload'}
      </HeaderButton>
    );

  return (
    <Page id="survey-soil-report" className="theme-soil">
      <Header title="Report" rightSlot={finishButton} />
      <Main />
    </Page>
  );
};

export default Report;
