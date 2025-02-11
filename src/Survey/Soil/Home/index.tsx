/* eslint-disable no-param-reassign */
import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router';
import { Page, Header, useAlert } from '@flumens';
import { NavContext } from '@ionic/react';
import appModel from 'common/models/app';
import Sample, { useValidateCheck } from 'models/sample';
import HeaderButton from 'Survey/common/Components/HeaderButton';
import config from '../config';
import Main from './Main';

const useDataSharingPrompt = () => {
  const alert = useAlert();

  useEffect(() => {
    if (!appModel.attrs.showSoilDataSharingTip) return;

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
            appModel.attrs.showSoilDataSharingTip = false;
          },
        },
      ],
    });
  }, []);
};

interface Props {
  sample: Sample;
}

const Home = ({ sample }: Props) => {
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

    // eslint-disable-next-line no-param-reassign
    sample.metadata.saved = true;
    sample.save();

    appModel.attrs[`draftId:${config.name}`] = '';

    saveAndReturn();
  };

  const onSampleDelete = (smp: Sample) => smp.destroy();
  const onSampleAdd = () => {
    const name = `Sample #${sample.samples.length + 1}`;
    const smp = config.smp?.create!({ Sample, name });
    sample.samples.push(smp!);
    sample.save();
    navigate(`${url}/sample/${smp!.cid}`);
  };

  const isInvalid = sample.validateRemote();

  const finishButton = sample.remote.synchronising ? null : (
    <HeaderButton onClick={onFinish} isInvalid={isInvalid}>
      {sample.metadata.saved ? 'Report' : 'Finish'}
    </HeaderButton>
  );

  const isTraining = !!sample.attrs.training;
  const trainingModeSubheader = isTraining && (
    <div className="bg-black p-1 text-center text-sm text-white">
      Training Mode
    </div>
  );

  return (
    <Page id="survey-soil-home">
      <Header
        title="Survey"
        rightSlot={finishButton}
        subheader={trainingModeSubheader}
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
