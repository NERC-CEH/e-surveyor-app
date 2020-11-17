import React from 'react';
import PropTypes from 'prop-types';
import { Page, Header, alert } from '@apps';
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

  /**
   * Adds a new image to occurrence.
   */
  onPhotoAdd = async photo => {
    const { sample } = this.props;

    const image = await ImageHelp.getImageModel(ImageModel, photo);

    sample.media.push(image);
    await sample.save();

    image.identification.identifying = true;
    try {
      const species = (await identifyImage(image)) || [];
      image.identification.identifying = false;
      image.attrs.species = {
        ...species[0].species,
        score: species[0].score,
      };
      sample.save();
    } catch (e) {
      image.identification.identifying = false;
    }
  };

  navToReport = async () => {
    const { sample } = this.props;
    const { history } = this.props;

    let hasValidSpecies = false;

    const showReportIfScoreHigherThanThreshold = image => {
      if (
        image.attrs.species &&
        image.attrs.species.score > POSSIBLE_THRESHOLD
      ) {
        hasValidSpecies = true;
      }
    };
    sample.media.forEach(showReportIfScoreHigherThanThreshold);

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
          sample={sample}
          appModel={appModel}
          url={match.url}
          onPhotoAdd={this.onPhotoAdd}
        />
      </Page>
    );
  }
}

export default Controller;
