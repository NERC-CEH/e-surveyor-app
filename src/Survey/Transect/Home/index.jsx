import React from 'react';
import PropTypes from 'prop-types';
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
import { observer } from 'mobx-react';
import Sample from 'models/sample';
import Main from './Main';

const { warn } = toast;

@observer
class Controller extends React.Component {
  static contextType = NavContext;

  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    sample: PropTypes.object.isRequired,
    userModel: PropTypes.object.isRequired,
  };

  onUpload = async () => {
    const { sample, userModel, history, match } = this.props;

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

      history.push(`${match.url}/report`);
    } catch (e) {
      // do nothing
    }

    loader.hide();
  };

  onAddNewQuadrat = () => {
    const { match, sample } = this.props;

    if (sample.samples.length > sample.attrs.steps) {
      // in case tapped button twice
      return;
    }

    const survey = sample.getSurvey();
    const quadratSample = survey.smp.create(Sample);
    sample.samples.push(quadratSample);
    sample.save();

    this.context.navigate(`${match.url}/quadrat/${quadratSample.cid}`);
  };

  render() {
    const { match, sample } = this.props;

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
      <IonButton onClick={this.onUpload} color="secondary" fill="solid">
        <IonIcon icon={checkmarkCircleOutline} slot="start" />
        Finish
      </IonButton>
    );

    return (
      <Page id="transect-home">
        <Header title="transect" rightSlot={uploadButton} />
        <Main
          match={match}
          sample={sample}
          onAddNewQuadrat={this.onAddNewQuadrat}
          isDisabled={isDisabled}
        />
      </Page>
    );
  }
}

export default Controller;
