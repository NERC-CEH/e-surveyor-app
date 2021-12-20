import React from 'react';
import PropTypes from 'prop-types';
import { Page, Header, toast, device } from '@flumens';
import { observer } from 'mobx-react';
import ImageModel from 'models/image';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import config from 'common/config';
import ImageHelp from 'common/Components/PhotoPicker/imageUtils';
import identifyImage from 'common/services/plantNet';
import Main from './Main';

const { warn } = toast;

@observer
class Controller extends React.Component {
  static propTypes = {
    subSample: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

  photoSelect = async () => {
    if (!device.isOnline()) {
      warn('Looks like you are offline!');
      return;
    }

    const photo = await ImageHelp.getImage();

    if (!photo) {
      return;
    }

    const { subSample } = this.props;
    const dataDirPath = config.dataPath;

    const image = await ImageHelp.getImageModel(ImageModel, photo, dataDirPath);

    const survey = subSample.getSurvey();
    const newSubSample = survey.smp.create(Sample, Occurrence, image);

    this.identifyPhoto(image, newSubSample);

    subSample.samples.push(newSubSample);
    subSample.save();
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

  render() {
    const { match, subSample } = this.props;

    const isDisabled = subSample.isUploaded();

    return (
      <Page id="transect-quadrat">
        <Header title={subSample.getPrettyName()} />
        <Main
          match={match}
          subSample={subSample}
          isDisabled={isDisabled}
          photoSelect={this.photoSelect}
        />
      </Page>
    );
  }
}

export default Controller;
