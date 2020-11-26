import React from 'react';
import PropTypes from 'prop-types';
import { Page, Header } from '@apps';
import { observer } from 'mobx-react';
import dummySurveys from 'common/data/dummy_surveys';
import Sample from 'sample';
import Main from './Main';

const { getUniqueSupportedSpecies } = Sample;

export function getLeagueTable(sample) {
  const species = sample.getUniqueSpecies();
  const pollinators = getUniqueSupportedSpecies(species);

  const byPollinationCounts = (a, b) => b.pollinators - a.pollinators;

  const currentSurvey = {
    name: sample.attrs.name,
    species,
    pollinators: pollinators.length,
    current: true,
  };

  return [...dummySurveys, currentSurvey].sort(byPollinationCounts);
}

export function getMissingSeedmixSpecies(sample) {
  const [selectedSeedmixSpecies, totalSeedmixSpecies = []] = sample.getSeedmixUse();

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

  getLeagueTable = () => getLeagueTable(this.props.sample);

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
          getLeagueTable={this.getLeagueTable}
          getMissingSeedmixSpecies={this.getMissingSeedmixSpecies}
        />
      </Page>
    );
  }
}

export default ReportController;
