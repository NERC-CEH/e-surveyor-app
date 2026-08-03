import { useContext } from 'react';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router-dom';
import { Page, Header, useAlert, useSample } from '@flumens';
import { NavContext } from '@ionic/react';
import useHeaderScroll from 'common/helpers/useHeaderScroll';
import Sample from 'models/sample';
import HeaderButton from 'Survey/common/Components/HeaderButton';
import surveyConfig, { getDetailsValidationSchema } from '../config';
import Main from './Main';

const validate = (data: any) =>
  getDetailsValidationSchema().safeParse(data).error;

const Controller = () => {
  const match = useRouteMatch();
  const alert = useAlert();
  const { navigate } = useContext(NavContext);
  const { isScrolled } = useHeaderScroll();

  const { sample } = useSample<Sample>();
  if (!sample) throw new Error('Sample is missing');

  const onDone = () => {
    const invalids = validate(sample.data);
    if (invalids) {
      alert({
        header: 'Missing',
        skipTranslation: true,
        message: invalids.issues.map(i => (
          <div key={i.path.join('.')}>{i.message}</div>
        )) as any,
        buttons: [{ text: 'Got it', role: 'cancel' }],
      });
      return;
    }

    if (!sample.metadata.completedDetails) {
      sample.metadata.completedDetails = true;

      // add sub-sample quadrats to the sample
      for (let i = 0; i < sample.data.quadrats; i++) {
        const quadratSample = surveyConfig.smp.create();
        sample.samples.push(quadratSample);
      }
    }
    sample.save();

    navigate(`${match.url}/quadrats`);
  };

  const isInvalid = !!validate(sample.data);
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
