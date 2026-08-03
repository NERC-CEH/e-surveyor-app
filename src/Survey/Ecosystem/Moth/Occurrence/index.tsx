import { useContext } from 'react';
import { observer } from 'mobx-react';
import { Header, Page, useSample } from '@flumens';
import { NavContext } from '@ionic/react';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import Main from './Main';

const OccurrenceController = () => {
  const { occurrence } = useSample<Sample, Occurrence>();
  if (!occurrence) throw new Error('Occurrence is missing');

  const sample = occurrence.parent;
  const isDisabled = sample?.isUploaded || false;
  const { goBack } = useContext(NavContext);

  const onDelete = async () => {
    sample?.occurrences.remove(occurrence);
    await occurrence.destroy();
    goBack();
  };

  return (
    <Page id="survey-moth-occurrence" className="theme-ecosystem">
      <Header title="Occurrence" />
      <Main
        occurrence={occurrence}
        isDisabled={isDisabled}
        onDelete={onDelete}
      />
    </Page>
  );
};

export default observer(OccurrenceController);
