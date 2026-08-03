import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router';
import { Page, Header, useAlert, useSample } from '@flumens';
import { NavContext } from '@ionic/react';
import appModel from 'common/models/app';
import Sample, { useValidateCheck } from 'models/sample';
import HeaderButton from 'Survey/common/Components/HeaderButton';
import TrainingModeBanner from 'Survey/common/Components/TrainingModeBanner';
import config from '../config';
import Main from './Main';

const useDataSharingPrompt = () => {
  const alert = useAlert();

  useEffect(() => {
    if (!appModel.data.showSoilDataSharingTip) return;

    alert({
      header: 'Data sharing',
      message: (
        <>
          Data collected can optionally be uploaded to the e-Surveyor{' '}
          <a href="https://esurveyor.ceh.ac.uk/">website</a> where you can
          access and download your data. Uploaded data will also be used by
          UKCEH and partners to support our research into soil health. More
          details can be found in our{' '}
          <a href="https://esurveyor.ceh.ac.uk/terms-of-use">terms of use</a>.
        </>
      ),
      buttons: [
        {
          text: 'OK',
          handler: () => {
            appModel.data.showSoilDataSharingTip = false;
          },
        },
      ],
    });
  }, []);
};

const Home = () => {
  const { sample } = useSample<Sample>();
  if (!sample) throw new Error('Sample is missing');

  const { url } = useRouteMatch();
  const { navigate } = useContext(NavContext);
  const checkSampleStatus = useValidateCheck(sample);

  useDataSharingPrompt();

  const onFinish = async () => {
    const isValid = checkSampleStatus();
    if (!isValid) return;

    const saveAndReturn = () => {
      sample.cleanUp();
      sample.save();
      navigate(`${url}/report`);
    };

    sample.metadata.saved = true;
    sample.save();

    appModel.data[`draftId:${config.name}`] = '';

    saveAndReturn();
  };

  const onSampleDelete = (smp: Sample) => smp.destroy();
  const onSampleAdd = () => {
    const name = `Sample #${sample.samples.length + 1}`;
    const smp = config.smp?.create!({ name });
    sample.samples.push(smp!);
    sample.save();
    navigate(`${url}/sample/${smp!.cid}`);
  };

  const isInvalid = sample.validateRemote();

  const finishButton = sample.isSynchronising ? null : (
    <HeaderButton onClick={onFinish} isInvalid={isInvalid}>
      {sample.metadata.saved ? 'Report' : 'Finish'}
    </HeaderButton>
  );

  const isTraining = !!sample.data.training;

  return (
    <Page id="survey-soil-home" className="theme-soil">
      <Header
        title="Survey"
        rightSlot={finishButton}
        subheader={isTraining && <TrainingModeBanner />}
      />
      <Main
        sample={sample}
        onSampleDelete={onSampleDelete}
        onSampleAdd={onSampleAdd}
      />
    </Page>
  );
};

export default observer(Home);
