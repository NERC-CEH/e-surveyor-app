import { useContext } from 'react';
import { observer } from 'mobx-react';
import { Header, Page } from '@flumens';
import { NavContext } from '@ionic/react';
import Occurrence from 'models/occurrence';
import Main from './Main';

type Props = {
  occurrence: Occurrence;
};

const OccurrenceController = ({ occurrence }: Props) => {
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
