import { FC } from 'react';
import { observer } from 'mobx-react';
import { Page, Header, useToast, device } from '@flumens';
import { IonButton } from '@ionic/react';
import Sample from 'models/sample';
import Main from './Main';

type Props = {
  subSample: Sample;
  subSubSample: Sample;
};

const EditSpecies: FC<Props> = ({ subSample, subSubSample }) => {
  const toast = useToast();
  const sample = subSubSample || subSample;
  const [occ] = sample.occurrences;

  const identifySpecies = async () => {
    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.", { position: 'bottom' });
      return;
    }

    try {
      await occ.identify();
    } catch (e: any) {
      toast.error(e.message, { position: 'bottom' });
    }
  };

  const isIdentifying = occ.isIdentifying();
  const identifyButton = !isIdentifying && occ.canReIdentify() && (
    <IonButton onClick={identifySpecies} color="secondary" fill="solid">
      Reidentify
    </IonButton>
  );

  return (
    <Page id="species-profile">
      <Header title="Species" rightSlot={identifyButton} />
      <Main occurrence={occ} />
    </Page>
  );
};

export default observer(EditSpecies);
