import { FC, useContext } from 'react';
import { observer } from 'mobx-react';
import { Page, Header, useToast } from '@flumens';
import { IonButton, NavContext } from '@ionic/react';
import seedmixData from 'common/data/seedmix';
import Sample, { useValidateCheck } from 'models/sample';
import { useUserStatusCheck } from 'models/user';
import Main from 'Components/ReportView';
import { CUSTOM_SEEDMIX_NAME } from 'Survey/common/config';

type Props = {
  sample: Sample;
};

const ReportController: FC<Props> = ({ sample }) => {
  const { navigate } = useContext(NavContext);
  const toast = useToast();
  const checkUserStatus = useUserStatusCheck();
  const checkSampleStatus = useValidateCheck(sample);

  if (!sample) return null;

  const onUpload = async () => {
    const isUserOK = await checkUserStatus();
    if (!isUserOK) return;

    const isValid = checkSampleStatus();
    if (!isValid) return;

    const isUploading = await sample.upload().catch(toast.error);
    if (!isUploading) return;

    navigate(`/home/surveys`, 'root');
  };

  const isDisabled = sample.isUploaded();

  const uploadButton =
    isDisabled || sample.remote.synchronising ? null : (
      <IonButton onClick={onUpload} color="secondary" fill="solid">
        Upload
      </IonButton>
    );

  const occurrences = sample.samples.map(smp => smp.occurrences[0]);

  let seedmixSpecies = [];
  if (sample.attrs.seedmixgroup === CUSTOM_SEEDMIX_NAME) {
    seedmixSpecies = sample.attrs.customSeedmix || [];
  } else {
    seedmixSpecies = seedmixData[sample.attrs.seedmix] || [];
  }

  return (
    <Page id="survey-report">
      <Header
        title="Report"
        rightSlot={uploadButton}
        defaultHref="/home/surveys"
      />
      <Main occurrences={occurrences} seedmixSpecies={seedmixSpecies} />
    </Page>
  );
};

export default observer(ReportController);
