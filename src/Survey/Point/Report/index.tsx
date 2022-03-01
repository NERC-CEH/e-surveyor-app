import React, { FC, useContext } from 'react';
import Sample from 'models/sample';
import { Page, Header, useAlert, useToast } from '@flumens';
import { IonButton, NavContext } from '@ionic/react';
import { observer } from 'mobx-react';
import Main from './Main';

export function getMissingSeedmixSpecies(sample: typeof Sample) {
  const [selectedSeedmixSpecies, totalSeedmixSpecies = []] =
    sample.getSeedmixUse();

  const getMissingSelectedSeedmixSpecies = ({ latin_name: latinName }: any) => {
    const hasLatinName = ([latin]: any) => latin === latinName;
    return !selectedSeedmixSpecies.find(hasLatinName);
  };

  return totalSeedmixSpecies.filter(getMissingSelectedSeedmixSpecies);
}

type Props = {
  sample: typeof Sample;
};

const ReportController: FC<Props> = ({ sample }) => {
  const { navigate } = useContext(NavContext);
  const alert = useAlert();
  const toast = useToast();

  const getMissingSeedmixSpeciesWrap = () => getMissingSeedmixSpecies(sample);

  if (!sample) return null;

  const onUpload = async () => {
    const isUploading = await sample.upload(alert, toast);
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

  return (
    <Page id="survey-report">
      <Header
        title="Report"
        rightSlot={uploadButton}
        defaultHref="/home/surveys"
      />
      <Main
        sample={sample}
        getMissingSeedmixSpecies={getMissingSeedmixSpeciesWrap}
      />
    </Page>
  );
};

export default observer(ReportController);
