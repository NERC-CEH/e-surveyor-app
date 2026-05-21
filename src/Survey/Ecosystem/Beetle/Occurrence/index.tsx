import { observer } from 'mobx-react';
import { Page, Header } from '@flumens';
import Occurrence from 'models/occurrence';
import Main from './Main';

type Props = {
  occurrence: Occurrence;
};

const OccurrenceController = ({ occurrence }: Props) => {
  const sample = occurrence.parent;
  const isDisabled = sample?.isUploaded || false;

  return (
    <Page id="beetle-occurrence">
      <Header title="Beetle" />
      <Main occurrence={occurrence} isDisabled={isDisabled} />
    </Page>
  );
};

export default observer(OccurrenceController);
