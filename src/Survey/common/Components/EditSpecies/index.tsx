import React, { FC, useEffect } from 'react';
import { observer } from 'mobx-react';
import { IonButton } from '@ionic/react';
import { Page, Header, useLoader, useToast, device } from '@flumens';
import Sample from 'models/sample';
import Main from './Main';

type Props = {
  subSample: typeof Sample;
  subSubSample: typeof Sample;
};

const EditSpecies: FC<Props> = ({ subSample, subSubSample }) => {
  const loader = useLoader();
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

  // TODO: check if deleted

  const identifyButton = occ.canReIdentify() && (
    <IonButton onClick={identifySpecies} color="secondary" fill="solid">
      Identify
    </IonButton>
  );

  const isIdentifying = occ.isIdentifying();

  useEffect(() => {
    if (!loader) return;

    if (occ.isIdentifying()) {
      loader.show('Please wait...');
      return;
    }

    loader.hide();
  }, [loader, isIdentifying]);

  return (
    <Page id="species-profile">
      <Header title="Species" rightSlot={identifyButton} />
      <Main sample={sample} isDisabled={subSample.isUploaded()} />
    </Page>
  );
};

export default observer(EditSpecies);
