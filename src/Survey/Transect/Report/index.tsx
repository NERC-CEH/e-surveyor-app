import { observer } from 'mobx-react';
import { Page, Header } from '@flumens';
import habitats from 'common/data/habitats';
import Sample from 'models/sample';
import { getUniqueSpecies } from 'Components/ReportView/helpers';
import Main from './Main';

type Props = {
  sample: Sample;
};

const ReportController = ({ sample }: Props) => {
  // TODO: Refactor when attr is renew
  const habitatsData: any = habitats;
  const getSteps = () => {
    const steps: any[] = [];
    const addToCounterIfInHabitat = (sp: any, stepSpecies: any) => {
      stepSpecies.push(sp);
    };

    const processStep = (stepSample: any) => {
      const stepSpecies: any = [];
      steps.push(stepSpecies);

      const addToCounterIfInHabitatWrap = (sp: any) =>
        addToCounterIfInHabitat(sp, stepSpecies);

      getUniqueSpecies(
        stepSample.samples.map((smp: Sample) => smp.occurrences[0])
      ).forEach(addToCounterIfInHabitatWrap);
    };

    sample.samples.forEach(processStep);

    return steps;
  };

  if (!sample) {
    return null;
  }

  const steps = getSteps();
  const stepCount = sample.samples.length;
  const habitatList = sample.attrs.habitat
    ? habitatsData[sample.attrs.habitat]
    : null;

  return (
    <Page id="transect-survey-report">
      <Header title="Report" />
      <Main stepCount={stepCount} steps={steps} habitatList={habitatList} />
    </Page>
  );
};

export default observer(ReportController);
