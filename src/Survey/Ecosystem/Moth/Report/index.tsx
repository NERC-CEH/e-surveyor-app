import { useContext } from 'react';
import { useToast, Page, Header, useSample } from '@flumens';
import { NavContext } from '@ionic/react';
import Sample, { useValidateCheck } from 'common/models/sample';
import { useUserStatusCheck } from 'common/models/user';
import HeaderButton from 'Survey/common/Components/HeaderButton';
import useUploadSurveyConfirmation from 'Survey/common/useUploadSurveyConfirmation';
import Main from './Main';
import useNewnessCheck from './useNewnessCheck';

const Report = () => {
  const { sample } = useSample<Sample>();
  if (!sample) throw new Error('Sample is missing');

  const { navigate } = useContext(NavContext);
  const toast = useToast();
  const checkSampleStatus = useValidateCheck(sample);
  const checkUserStatus = useUserStatusCheck();
  const showUploadSurveyConfirmation = useUploadSurveyConfirmation();

  const { newnessMap } = useNewnessCheck(sample);

  const onFinish = async () => {
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
  const finishButton =
    sample.isSynchronising || sample.isDisabled ? null : (
      <HeaderButton onClick={onFinish} isInvalid={isInvalid}>
        Upload
      </HeaderButton>
    );

  return (
    <Page id="survey-moth-report" className="theme-ecosystem">
      <Header title="Report" rightSlot={finishButton} />
      <Main sample={sample} newnessMap={newnessMap} />
    </Page>
  );
};

export default Report;
