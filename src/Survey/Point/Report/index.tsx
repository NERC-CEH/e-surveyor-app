import React, { FC } from 'react';
import Sample from 'models/sample';
import { Page, Header } from '@flumens';
import { observer } from 'mobx-react';
import Main from './Main';

export function getMissingSeedmixSpecies(sample: typeof Sample) {
  const [selectedSeedmixSpecies, totalSeedmixSpecies = []] =
    sample.getSeedmixUse();

  const getMissingSelectedSeedmixSpecies = ({ latin_name: latinName }: any) => {
    const hasLatinName = ([latin]: any) => latin === latinName;
    return !selectedSeedmixSpecies.find(hasLatinName);
  };

  return totalSeedmixSpecies.filter(getMissingSelectedSeedmixSpecies);
}

type Props = {
  sample: typeof Sample;
};

const ReportController: FC<Props> = ({ sample }) => {
  const getMissingSeedmixSpeciesWrap = () => getMissingSeedmixSpecies(sample);

  if (!sample) return null;

  return (
    <Page id="survey-report">
      <Header title="Report" />
      <Main
        sample={sample}
        getMissingSeedmixSpecies={getMissingSeedmixSpeciesWrap}
      />
    </Page>
  );
};

export default observer(ReportController);
