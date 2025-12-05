import { useContext } from 'react';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router-dom';
import { Page, Header, useAlert } from '@flumens';
import { NavContext } from '@ionic/react';
import Sample from 'models/sample';
import HeaderButton from 'Survey/common/Components/HeaderButton';
import { getDetailsValidationSchema } from '../config';
import Main from './Main';

const validate = (sample: Sample) => {
  try {
    getDetailsValidationSchema().validateSync(sample.data);
  } catch (attrError) {
    return attrError;
  }

  return null;
};

type Props = {
  sample: Sample;
};

const Controller = ({ sample }: Props) => {
  const match = useRouteMatch();
  const alert = useAlert();
  const { navigate } = useContext(NavContext);

  const onDone = () => {
    const invalids = validate(sample);
    if (invalids) {
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
    navigate(url, 'forward', 'replace');
  };

  const { completedDetails } = sample.metadata;

  const isInvalid = !!validate(sample);
  const doneButton = !completedDetails && (
    <HeaderButton onClick={onDone} isInvalid={isInvalid}>
      Next
    </HeaderButton>
  );

  return (
    <Page id="transect-details">
      <Header backButtonLabel="Home" title="Transect" rightSlot={doneButton} />
      <Main sample={sample} isDisabled={sample.isUploaded} />
    </Page>
  );
};

export default observer(Controller);
