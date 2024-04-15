import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router-dom';
import { Page, Header, useAlert } from '@flumens';
import Sample from 'models/sample';
import useRouter from 'helpers/router';
import HeaderButton from 'Survey/common/Components/HeaderButton';
import { getDetailsValidationSchema } from '../config';
import Main from './Main';

const validate = (sample: Sample) => {
  try {
    getDetailsValidationSchema().validateSync(sample.attrs);
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
  const router = useRouter();

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
    router.replace(url);
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
      <Main sample={sample} isDisabled={sample.isUploaded()} />
    </Page>
  );
};

export default observer(Controller);
