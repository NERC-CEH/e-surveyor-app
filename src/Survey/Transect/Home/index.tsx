import React, { FC, useContext } from 'react';
import {
  Page,
  Header,
  toast,
  device,
  showInvalidsMessage,
  loader,
} from '@flumens';
import { NavContext, IonButton, IonIcon } from '@ionic/react';
import { checkmarkCircleOutline } from 'ionicons/icons';
import userModel from 'models/user';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router-dom';
import Sample from 'models/sample';
import Main from './Main';

const { warn } = toast;

type Props = {
  sample: typeof Sample;
};

const Controller: FC<Props> = ({ sample }) => {
  const match = useRouteMatch();
  const { navigate } = useContext(NavContext);

  const onUpload = async () => {
    const invalids = sample.validateRemote();

    if (invalids) {
      showInvalidsMessage(invalids);
      return;
    }

    if (!device.isOnline()) {
      warn('Looks like you are offline!');
      return;
    }

    const isLoggedIn = !!userModel.attrs.id;
    if (!isLoggedIn) {
      warn('Please log in first to upload the records.');
      return;
    }

    if (!userModel.attrs.verified) {
      await loader.show({
        message: 'Please wait...',
      });

      try {
        await userModel.refreshProfile();
      } catch (e) {
        // do nothing
      }

      loader.hide();

      if (!userModel.attrs.verified) {
        warn("Sorry, your account hasn't been verified yet or is blocked.");
        return;
      }
    }

    await loader.show({
      message: 'Uploading your survey...',
    });

    try {
      await sample.saveRemote();

      navigate(`${match.url}/report`);
    } catch (e) {
      // do nothing
    }

    loader.hide();
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

  const uploadButton = isDisabled ? (
    <IonButton
      color="secondary"
      fill="solid"
      routerLink={`${match.url}/report`}
    >
      See Report
    </IonButton>
  ) : (
    <IonButton onClick={onUpload} color="secondary" fill="solid">
      <IonIcon icon={checkmarkCircleOutline} slot="start" />
      Finish
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
