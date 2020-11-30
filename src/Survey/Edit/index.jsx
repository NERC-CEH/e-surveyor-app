import React from 'react';
import PropTypes from 'prop-types';
import { Page, Header, alert } from '@apps';
import Sample from 'sample';
import Occurrence from 'occurrence';
import { observer } from 'mobx-react';
import { IonButton } from '@ionic/react';
import config from 'config';
import ImageHelp from 'helpers/image';
import ImageModel from 'common/models/image';
import identifyImage from 'common/services/plantNet';
import Main from './Main';

const { POSSIBLE_THRESHOLD } = config;

@observer
class Controller extends React.Component {
  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    appModel: PropTypes.object.isRequired,
    sample: PropTypes.object.isRequired,
  };

  identifyPhoto = async image => {
    const { sample } = this.props;

    const speciesImg = image;

    speciesImg.identification.identifying = true;

    try {
      const species = await identifyImage(speciesImg);
      speciesImg.attrs.species = species;
      speciesImg.identification.identifying = false;
      sample.save();
    } catch (e) {
      speciesImg.identification.identifying = false;
    }
  };

  photoSelectHybrid = async () => {
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

    this.identifyPhoto(image);

    const survey = sample.getSurvey();

    const newSubSample = survey.smp.create(Sample, Occurrence, image);

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

  render() {
    const { appModel, match, sample } = this.props;

    if (!sample) {
      return null;
    }

    const uploadButton = (
      <IonButton onClick={this.navToReport}>See Report</IonButton>
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
          photoSelectHybrid={this.photoSelectHybrid}
        />
      </Page>
    );
  }
}

export default Controller;
