import React from 'react';
import PropTypes from 'prop-types';
import { Page, Header } from '@apps';
import { observer } from 'mobx-react';
import Main from './Main';
import habitats from './habitats';

@observer
class ReportController extends React.Component {
  static propTypes = {
    sample: PropTypes.object.isRequired,
  };

  getSteps = () => {
    const { sample } = this.props;

    const steps = [];

    const addToCounterIfInHabitat = (sp, stepSpecies) => {
      stepSpecies.push(sp);
    };

    const processStep = stepSample => {
      const stepSpecies = [];
      steps.push(stepSpecies);

      const addToCounterIfInHabitatWrap = sp =>
        addToCounterIfInHabitat(sp, stepSpecies);

      stepSample.getUniqueSpecies().forEach(addToCounterIfInHabitatWrap);
    };

    sample.samples.forEach(processStep);

    return steps;
  };

  render() {
    const { sample } = this.props;

    if (!sample) {
      return null;
    }

    const steps = this.getSteps();
    const stepCount = sample.samples.length;
    const habitatList = sample.attrs.habitat
      ? habitats[sample.attrs.habitat]
      : null;

    return (
      <Page id="transect-survey-report">
        <Header title="Report" />
        <Main stepCount={stepCount} steps={steps} habitatList={habitatList} />
      </Page>
    );
  }
}

export default ReportController;
