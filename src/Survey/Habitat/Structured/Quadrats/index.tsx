import { useContext } from 'react';
import { observer } from 'mobx-react';
import { Header, Page, useToast } from '@flumens';
import { NavContext } from '@ionic/react';
import useHeaderScroll from 'common/helpers/useHeaderScroll';
import appModel from 'models/app';
import Sample, { useValidateCheck } from 'models/sample';
import { useUserStatusCheck } from 'models/user';
import HeaderButton from 'Survey/common/Components/HeaderButton';
import TrainingModeBanner from 'Survey/common/Components/TrainingModeBanner';
import useUploadSurveyConfirmation from 'Survey/common/useUploadSurveyConfirmation';
import Main from './Main';

type Props = {
  sample: Sample;
};

const Controller = ({ sample }: Props) => {
  const { navigate } = useContext(NavContext);
  const showUploadSurveyConfirmation = useUploadSurveyConfirmation();
  const toast = useToast();
  const checkUserStatus = useUserStatusCheck();
  const checkSampleStatus = useValidateCheck(sample);
  const { isScrolled } = useHeaderScroll();

  const onUpload = async () => {
    sample.metadata.saved = true;
    sample.save();

    appModel.data['draftId:habitat-structured'] = '';

    const isUserOK = await checkUserStatus();
    if (!isUserOK) return;

    const isUploading = await sample.syncRemote(toast.error);
    if (!isUploading) return;

    navigate('/home/surveys', 'root');
  };

  const isDisabled = sample.isUploaded;

  const onFinish = () => {
    const isValid = checkSampleStatus();
    if (!isValid) return;

    showUploadSurveyConfirmation(onUpload);
  };

  const isInvalid = sample.validateRemote();
  const uploadButton =
    isDisabled || sample.isSynchronising ? null : (
      <HeaderButton onClick={onFinish} isInvalid={isInvalid}>
        Finish
      </HeaderButton>
    );

  const isTraining = !!sample.data.training;

  return (
    <Page id="transect-transects" className="theme-habitat">
      <Header
        title="Quadrats"
        rightSlot={uploadButton}
        subheader={isTraining && <TrainingModeBanner />}
        className={`stars-background-header ${isScrolled ? 'header-scrolled' : ''}`}
      />
      <Main sample={sample} />
    </Page>
  );
};

export default observer(Controller);
