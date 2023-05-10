import { FC } from 'react';
import { observer } from 'mobx-react';
import { arrowForwardCircleOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import { Page, Header, useAlert } from '@flumens';
import { IonButton, IonIcon } from '@ionic/react';
import Sample from 'models/sample';
import useRouter from 'helpers/router';
import { getDetailsValidationSchema } from '../config';
import Main from './Main';

type Props = {
  sample: Sample;
};

const Controller: FC<Props> = ({ sample }) => {
  const match = useRouteMatch();
  const router = useRouter();

  const alert = useAlert();

  const onDone = () => {
    try {
      getDetailsValidationSchema.validateSync(sample.attrs);
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
    router.replace(url);
  };

  const { completedDetails } = sample.metadata;

  const doneButton = !completedDetails && (
    <IonButton onClick={onDone} color="secondary" fill="solid">
      Next
      <IonIcon icon={arrowForwardCircleOutline} slot="end" />
    </IonButton>
  );

  const onChangeTrapOutside = (value: number) => {
    // eslint-disable-next-line no-param-reassign
    sample.attrs.trapDays = value;
  };

  return (
    <Page id="beetle-details">
      <Header title="Survey details" rightSlot={doneButton} />
      <Main sample={sample} onChangeTrapOutside={onChangeTrapOutside} />
    </Page>
  );
};

export default observer(Controller);
