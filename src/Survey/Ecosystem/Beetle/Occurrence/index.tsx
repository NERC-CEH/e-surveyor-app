import { observer } from 'mobx-react';
import { Page, Header, useSample } from '@flumens';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import Main from './Main';

const OccurrenceController = () => {
  const { occurrence } = useSample<Sample, Occurrence>();
  if (!occurrence) throw new Error('Occurrence is missing');

  const sample = occurrence.parent;
  const isDisabled = sample?.isUploaded || false;

  return (
    <Page id="beetle-occurrence" className="theme-ecosystem">
      <Header title="Beetle" />
      <Main occurrence={occurrence} isDisabled={isDisabled} />
    </Page>
  );
};

export default observer(OccurrenceController);
