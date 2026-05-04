import { observer } from 'mobx-react';
import { Header, Page } from '@flumens';
import Occurrence from 'models/occurrence';
import Main from './Main';

type Props = {
  occurrence: Occurrence;
};

const OccurrenceController = ({ occurrence }: Props) => {
  const sample = occurrence.parent;
  const isDisabled = sample?.isUploaded || false;

  return (
    <Page id="survey-moth-occurrence">
      <Header title="Occurrence" />
      <Main occurrence={occurrence} isDisabled={isDisabled} />
    </Page>
  );
};

export default observer(OccurrenceController);
