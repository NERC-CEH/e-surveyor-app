import React, { FC, useContext } from 'react';
import { Page, Header, useAlert } from '@flumens';
import { IonButton, NavContext, IonIcon } from '@ionic/react';
import { arrowForwardCircleOutline } from 'ionicons/icons';
import { observer } from 'mobx-react';
import Sample from 'models/sample';
import { useRouteMatch } from 'react-router-dom';
import { getDetailsValidationSchema } from '../config';
import Main from './Main';

type Props = {
  sample: typeof Sample;
};

const Controller: FC<Props> = ({ sample }) => {
  const match = useRouteMatch();
  const { navigate } = useContext(NavContext);
  const alert = useAlert();

  const onDone = () => {
    try {
      getDetailsValidationSchema(sample).validateSync(sample.attrs);
    } catch (attrError) {
      alert({
        header: 'Missing',
        message:
          'Please fill in all the details in this page before navigating next.',
        buttons: [{ text: 'Got it', role: 'cancel' }],
      });

      return;
    }

    // eslint-disable-next-line no-param-reassign
    sample.metadata.completedDetails = true;
    sample.save();

    const url = match.url.replace('/details', '');
    navigate(url, 'none', 'replace');
  };

  const { completedDetails } = sample.metadata;

  const doneButton = !completedDetails && (
    <IonButton onClick={onDone} color="secondary" fill="solid">
      Next
      <IonIcon icon={arrowForwardCircleOutline} slot="end" />
    </IonButton>
  );

  return (
    <Page id="transect-details">
      <Header title="Transect" rightSlot={doneButton} />
      <Main sample={sample} isDisabled={sample.isUploaded()} />
    </Page>
  );
};

export default observer(Controller);
