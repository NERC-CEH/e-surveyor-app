import React, { FC, useContext } from 'react';
import Sample from 'models/sample';
import { Page, Header, useAlert, useToast } from '@flumens';
import { IonButton, NavContext } from '@ionic/react';
import { observer } from 'mobx-react';
import Main from 'Components/ReportView';

type Props = {
  sample: typeof Sample;
};

const ReportController: FC<Props> = ({ sample }) => {
  const { navigate } = useContext(NavContext);
  const alert = useAlert();
  const toast = useToast();

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

  const occurrences = sample.samples.map(smp => smp.occurrences[0]);

  return (
    <Page id="survey-report">
      <Header
        title="Report"
        rightSlot={uploadButton}
        defaultHref="/home/surveys"
      />
      <Main occurrences={occurrences} seedmix={sample.attrs.seedmix} />
    </Page>
  );
};

export default observer(ReportController);
