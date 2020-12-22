import React from 'react';
import PropTypes from 'prop-types';
import { IonButton,NavContext } from '@ionic/react';
import {
  Page,
  Header,
  device,
  loader,
  toast,
  showInvalidsMessage,
} from '@apps';
import { observer } from 'mobx-react';
import i18n from 'i18next';
import Main from './Main';

const { warn } = toast;

export function getMissingSeedmixSpecies(sample) {
  const [
    selectedSeedmixSpecies,
    totalSeedmixSpecies = [],
  ] = sample.getSeedmixUse();

  const getMissingSelectedSeedmixSpecies = ({ latin_name: latinName }) => {
    const hasLatinName = ([latin]) => latin === latinName;
    return !selectedSeedmixSpecies.find(hasLatinName);
  };

  return totalSeedmixSpecies.filter(getMissingSelectedSeedmixSpecies);
}

@observer
class ReportController extends React.Component {
  static contextType = NavContext;

  static propTypes = {
    appModel: PropTypes.object.isRequired,
    userModel: PropTypes.object.isRequired,
    sample: PropTypes.object.isRequired,
  };

  getMissingSeedmixSpecies = () => getMissingSeedmixSpecies(this.props.sample);

  onUpload = async () => {
    const { sample, userModel } = this.props;

    const invalids = sample.validateRemote();

    if (invalids) {
      showInvalidsMessage(invalids);
      return;
    }

    if (!device.isOnline()) {
      warn(i18n.t('Looks like you are offline!'));
      return;
    }

    const isLoggedIn = !!userModel.attrs.id;
    if (!isLoggedIn) {
      warn(i18n.t('Please log in first to upload the records.'));
      return;
    }

    if (!userModel.attrs.verified) {
      await loader.show({
        message: i18n.t('Please wait...'),
      });

      try {
        await userModel.refreshProfile();
      } catch (e) {
        // do nothing
      }

      loader.hide();

      if (!userModel.attrs.verified) {
        warn(
          i18n.t("Sorry, your account hasn't been verified yet or is blocked.")
        );
        return;
      }
    }

    sample.saveRemote();
    this.context.navigate('/home/surveys', 'root');
  };

  render() {
    const { appModel, sample } = this.props;

    if (!sample) {
      return null;
    }

    const uploadButton = <IonButton onClick={this.onUpload}>Upload</IonButton>;

    return (
      <Page id="survey-report">
        <Header title="Report" rightSlot={uploadButton} />
        <Main
          appModel={appModel}
          sample={sample}
          getMissingSeedmixSpecies={this.getMissingSeedmixSpecies}
        />
      </Page>
    );
  }
}

export default ReportController;
