import React from 'react';
import PropTypes from 'prop-types';
import {
  Page,
  Header,
  alert,
  toast,
  device,
  showInvalidsMessage,
  loader,
} from '@apps';
import Sample from 'sample';
import Occurrence from 'occurrence';
import { observer } from 'mobx-react';
import { IonButton, NavContext, IonIcon } from '@ionic/react';
import config from 'config';
import ImageHelp from 'helpers/image';
import ImageModel from 'common/models/image';
import { checkmarkCircleOutline } from 'ionicons/icons';
import identifyImage from 'common/services/plantNet';
import i18n from 'i18next';
import Main from './Main';

const { warn } = toast;

const { POSSIBLE_THRESHOLD } = config;

@observer
class Controller extends React.Component {
  static contextType = NavContext;

  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    appModel: PropTypes.object.isRequired,
    userModel: PropTypes.object.isRequired,
    sample: PropTypes.object.isRequired,
  };

  identifyPhoto = async (image, subSample) => {
    const speciesImg = image;

    speciesImg.identification.identifying = true;

    try {
      const species = await identifyImage(speciesImg);
      speciesImg.attrs.species = species;

      // eslint-disable-next-line
      subSample.setSpecies(species[0]);

      speciesImg.identification.identifying = false;
      subSample.save();
    } catch (e) {
      speciesImg.identification.identifying = false;
    }
  };

  photoSelect = async () => {
    if (!device.isOnline()) {
      warn('Looks like you are offline!');
      return;
    }

    const image = await ImageHelp.getImage();

    if (!image) {
      return;
    }

    this.onPhotoAdd(image);
  };

  onPhotoAdd = async photo => {
    const { sample } = this.props;
    const dataDirPath = config.dataPath;

    const image = await ImageHelp.getImageModel(ImageModel, photo, dataDirPath);

    const survey = sample.getSurvey();
    const newSubSample = survey.smp.create(Sample, Occurrence, image);

    this.identifyPhoto(image, newSubSample);

    sample.samples.push(newSubSample);
    sample.save();
  };

  navToReport = async () => {
    const { sample } = this.props;
    const { samples } = this.props.sample;
    const { history } = this.props;

    let hasValidSpecies = false;

    const showReportIfScoreHigherThanThreshold = subSample => {
      const species = subSample.getSpecies();
      if (species && species.score > POSSIBLE_THRESHOLD) {
        hasValidSpecies = true;
      }
    };

    samples.forEach(showReportIfScoreHigherThanThreshold);

    if (!hasValidSpecies) {
      alert({
        skipTranslation: true,
        message: 'Please add some species first.',
        buttons: [{ text: 'Got it!', role: 'cancel', cssClass: 'secondary' }],
      });
      return;
    }

    history.push(`/survey/${sample.cid}/report`);
  };

  onUpload = async () => {
    const { sample, userModel, history } = this.props;

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

    await loader.show({
      message: i18n.t('Uploading your survey...'),
    });

    try {
      await sample.saveRemote();

      history.push(`/survey/${sample.cid}/report`);
    } catch (e) {
      // do nothing
    }
    // this.context.navigate('/home/surveys', 'root');
    loader.hide();
  };

  render() {
    const { appModel, match, sample } = this.props;

    if (!sample) {
      return null;
    }

    const isDisabled = sample.isUploaded();

    const uploadButton = isDisabled ? (
      <IonButton onClick={this.navToReport} color="secondary" fill="solid">
        See Report
      </IonButton>
    ) : (
      <IonButton onClick={this.onUpload} color="secondary" fill="solid">
        <IonIcon icon={checkmarkCircleOutline} slot="start" />
        Finish
      </IonButton>
    );

    return (
      <Page id="survey-default-edit">
        <Header
          title="Survey"
          rightSlot={uploadButton}
          defaultHref="/home/surveys"
        />
        <Main
          match={match}
          sample={sample}
          appModel={appModel}
          url={match.url}
          onPhotoAdd={this.onPhotoAdd}
          photoSelect={this.photoSelect}
          isDisabled={isDisabled}
        />
      </Page>
    );
  }
}

export default Controller;
