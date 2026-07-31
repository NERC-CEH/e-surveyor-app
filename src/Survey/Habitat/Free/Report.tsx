import { useContext } from 'react';
import { observer } from 'mobx-react';
import { Page, Header, useToast } from '@flumens';
import { NavContext } from '@ionic/react';
import Sample, { useValidateCheck } from 'models/sample';
import { useUserStatusCheck } from 'models/user';
import Main from 'Components/ReportView';
import HeaderButton from 'Survey/common/Components/HeaderButton';
import useUploadSurveyConfirmation from 'Survey/common/useUploadSurveyConfirmation';

type Props = {
  sample: Sample;
};

const ReportController = ({ sample }: Props) => {
  const { navigate } = useContext(NavContext);
  const toast = useToast();
  const checkUserStatus = useUserStatusCheck();
  const checkSampleStatus = useValidateCheck(sample);
  const showUploadSurveyConfirmation = useUploadSurveyConfirmation();

  if (!sample) return null;

  const onUpload = async () => {
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

  const isDisabled = sample.isUploaded;

  const uploadButton =
    isDisabled || sample.isSynchronising ? null : (
      <HeaderButton onClick={onUpload}>Upload</HeaderButton>
    );

  const occurrences = sample.samples.map(smp => smp.occurrences[0]);

  const seedmixSpecies: any = []; // TODO:
  // if (sample.data.seedmixgroup === CUSTOM_SEEDMIX_GROUP_VALUE) {
  //   seedmixSpecies = sample.data[customSeedmixAttr.id] || []; // TODO: stores species ids as string now
  // } else {
  //   seedmixSpecies = seedmixData[sample.data.seedmix] || []; // TODO: uses different ID
  // }

  return (
    <Page id="survey-report" className="theme-habitat">
      <Header
        title="Report"
        rightSlot={uploadButton}
        defaultHref="/home/surveys"
      />
      <Main
        occurrences={occurrences}
        seedmixSpecies={seedmixSpecies}
        showHabitats={sample.data.seeded !== 'Yes'}
      />
    </Page>
  );
};

export default observer(ReportController);
