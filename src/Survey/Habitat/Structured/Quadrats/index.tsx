import { useContext } from 'react';
import { observer } from 'mobx-react';
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
  const { navigate } = useContext(NavContext);
  const toast = useToast();
  const checkUserStatus = useUserStatusCheck();
  const checkSampleStatus = useValidateCheck(sample);

  const onUpload = async () => {
    const isValid = checkSampleStatus();
    if (!isValid) return;

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

  const isInvalid = sample.validateRemote();
  const uploadButton =
    isDisabled || sample.isSynchronising ? null : (
      <HeaderButton onClick={onUpload} isInvalid={isInvalid}>
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
      />
      <Main sample={sample} isDisabled={isDisabled} />
    </Page>
  );
};

export default observer(Controller);
