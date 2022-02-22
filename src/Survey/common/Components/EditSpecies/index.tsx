import React, { FC, useEffect, useState } from 'react';
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

  // for some reason identifying is fired 2-3s late so we force it
  const [refreshLoader, forceRefreshLoader] = useState(0);

  const identifySpecies = () => {
    if (!device.isOnline()) {
      toast.warn("Sorry, looks like you're offline.", { position: 'bottom' });
      return;
    }

    occ.identify();
    forceRefreshLoader(Math.random());
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
  }, [loader, refreshLoader, isIdentifying]);

  return (
    <Page id="species-profile">
      <Header title="Species" rightSlot={identifyButton} />
      <Main sample={sample} isDisabled={subSample.isUploaded()} />
    </Page>
  );
};

export default observer(EditSpecies);
