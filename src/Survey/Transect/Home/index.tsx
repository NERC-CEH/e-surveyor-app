import React, { FC, useContext } from 'react';
import { Page, Header, useAlert } from '@flumens';
import { NavContext, IonButton, IonIcon } from '@ionic/react';
import { checkmarkCircleOutline } from 'ionicons/icons';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router-dom';
import Sample from 'models/sample';
import Main from './Main';

type Props = {
  sample: typeof Sample;
};

const Controller: FC<Props> = ({ sample }) => {
  const match = useRouteMatch();
  const { navigate } = useContext(NavContext);
  const alert = useAlert();

  const onUpload = async () => {
    const isUploading = await sample.upload(alert);
    if (!isUploading) return;

    // eslint-disable-next-line no-param-reassign
    sample.metadata.saved = true;
    sample.save();

    navigate(`${match.url}/report`);
  };

  const onAddNewQuadrat = () => {
    if (sample.samples.length > sample.attrs.steps) {
      // in case tapped button twice
      return;
    }

    const survey = sample.getSurvey();
    const quadratSample = survey.smp.create(Sample);
    sample.samples.push(quadratSample);
    sample.save();

    navigate(`${match.url}/quadrat/${quadratSample.cid}`);
  };

  const isDisabled = sample.isUploaded();

  const uploadButton =
    isDisabled || sample.remote.synchronising ? null : (
      <IonButton onClick={onUpload} color="secondary" fill="solid">
        <IonIcon icon={checkmarkCircleOutline} slot="start" />
        {sample.metadata.saved ? 'Upload' : 'Finish'}
      </IonButton>
    );

  return (
    <Page id="transect-home">
      <Header title="Transect" rightSlot={uploadButton} />
      <Main
        sample={sample}
        onAddNewQuadrat={onAddNewQuadrat}
        isDisabled={isDisabled}
      />
    </Page>
  );
};

export default observer(Controller);
