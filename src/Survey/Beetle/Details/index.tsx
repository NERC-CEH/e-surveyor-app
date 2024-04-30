import { useContext, useMemo } from 'react';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router-dom';
import { Page, Header, useAlert, TailwindContext } from '@flumens';
import { NavContext } from '@ionic/react';
import Sample from 'models/sample';
import HeaderButton from 'Survey/common/Components/HeaderButton';
import { getDetailsValidationSchema } from '../config';
import Main from './Main';

const validate = (sample: Sample) => {
  try {
    getDetailsValidationSchema.validateSync(sample.attrs);
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
  const { navigate } = useContext(NavContext);

  const alert = useAlert();

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

  const onChangeTrapOutside = (value: number) => {
    // eslint-disable-next-line no-param-reassign
    sample.attrs.trapDays = value;
  };

  const isDisabled = sample.isDisabled();

  const origContext = useContext(TailwindContext);
  const tailwindContext = useMemo(
    () => ({ ...origContext, isDisabled }),
    [origContext, isDisabled]
  );

  return (
    <Page id="beetle-details">
      <Header title="Survey details" rightSlot={doneButton} />
      <TailwindContext.Provider value={tailwindContext}>
        <Main sample={sample} onChangeTrapOutside={onChangeTrapOutside} />
      </TailwindContext.Provider>
    </Page>
  );
};

export default observer(Controller);
