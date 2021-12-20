import React from 'react';
import PropTypes from 'prop-types';
import { Page, Header } from '@flumens';
import { observer } from 'mobx-react';
import Main from './Main';

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
  static propTypes = {
    appModel: PropTypes.object.isRequired,
    sample: PropTypes.object.isRequired,
  };

  getMissingSeedmixSpecies = () => getMissingSeedmixSpecies(this.props.sample);

  render() {
    const { appModel, sample } = this.props;

    if (!sample) {
      return null;
    }

    return (
      <Page id="survey-report">
        <Header title="Report" />
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
