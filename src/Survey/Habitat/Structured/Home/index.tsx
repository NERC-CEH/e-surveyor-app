import { useContext } from 'react';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router-dom';
import { Page, Header, useAlert, useSample } from '@flumens';
import { NavContext } from '@ionic/react';
import useHeaderScroll from 'common/helpers/useHeaderScroll';
import Sample from 'models/sample';
import HeaderButton from 'Survey/common/Components/HeaderButton';
import { getDetailsValidationSchema } from '../config';
import Main from './Main';

const validate = (sample: Sample) =>
  getDetailsValidationSchema().safeParse(sample.data).error;

const Controller = () => {
  const match = useRouteMatch();
  const alert = useAlert();
  const { navigate } = useContext(NavContext);
  const { isScrolled } = useHeaderScroll();

  const { sample } = useSample<Sample>();
  if (!sample) return null;

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
    sample.metadata.completedDetails = true;
    sample.save();

    navigate(`${match.url}/quadrats`);
  };

  const isInvalid = !!validate(sample);
  const doneButton = (
    <HeaderButton onClick={onDone} isInvalid={isInvalid}>
      Next
    </HeaderButton>
  );

  return (
    <Page id="transect-home" className="theme-habitat">
      <Header
        backButtonLabel="Home"
        title="Survey setup"
        rightSlot={doneButton}
        className={`stars-background-header ${isScrolled ? 'header-scrolled' : ''}`}
      />
      <Main sample={sample} isDisabled={sample.isUploaded} />
    </Page>
  );
};

export default observer(Controller);
