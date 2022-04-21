import React, { FC, useState } from 'react';
import {
  IonItem,
  IonList,
  IonButton,
  IonItemOption,
  IonItemOptions,
  IonLabel,
  IonItemSliding,
  IonItemDivider,
} from '@ionic/react';
import { Page, Main, Header, InfoBackgroundMessage, useAlert } from '@flumens';
import appModel, { SeedMix } from 'models/app';
import { observer } from 'mobx-react';
import EditSeedmix from './Components/EditSeedmix';
import './styles.scss';

const useDeleteConfirmation = () => {
  const alert = useAlert();

  return () => {
    return new Promise(resolve => {
      alert({
        header: 'Delete seedmix',
        message: 'Are you sure you want to delete this seedmix?',
        buttons: [
          {
            text: 'Cancel',
            cssClass: 'secondary',
            handler: () => resolve(false),
          },
          {
            text: 'Delete',
            cssClass: 'primary',
            handler: () => resolve(true),
          },
        ],
      });
    });
  };
};

const Seedmixes: FC = () => {
  const [newSeedmix, setNewSeedmix] = useState<string>('');
  const confirmDelete = useDeleteConfirmation();

  const getSeedmixes = () => {
    if (!appModel.attrs.seedmixes.length)
      return (
        <IonList>
          <InfoBackgroundMessage>
            Your custom seedmix list is empty.
          </InfoBackgroundMessage>
        </IonList>
      );

    const getSeedmixEntry = ({ name, id, species }: SeedMix) => {
      const openSeedmix = () => setNewSeedmix(id);

      const onSeedmixDelete = async () =>
        (await confirmDelete()) && appModel.deleteSeedmix(id);

      const speciesCount = species.length;

      return (
        <IonItemSliding className="seedmix-list-item" key={id}>
          <IonItem onClick={openSeedmix}>
            <IonLabel slot="start">{name}</IonLabel>
            <IonLabel slot="end">{speciesCount}</IonLabel>
          </IonItem>

          <IonItemOptions side="end">
            <IonItemOption color="danger" onClick={onSeedmixDelete}>
              Delete
            </IonItemOption>
          </IonItemOptions>
        </IonItemSliding>
      );
    };

    const seedmixListItems = appModel.attrs.seedmixes.map(getSeedmixEntry);

    return (
      <IonList>
        <div className="rounded">
          <IonItemDivider className="seedmix-list-header">
            <IonLabel>Seedmix</IonLabel>
            <IonLabel>Species</IonLabel>
          </IonItemDivider>

          {seedmixListItems}
        </div>
      </IonList>
    );
  };

  const getNewSeedMixButton = () => {
    const addNewSeedmix = () => setNewSeedmix('new');

    return (
      <IonButton color="secondary" fill="solid" onClick={addNewSeedmix}>
        Add new
      </IonButton>
    );
  };

  const onCancelSeedmix = () => setNewSeedmix('');

  const onSaveSeedmix = (seedmixToSave: SeedMix) =>
    appModel.saveSeedmix(seedmixToSave);

  return (
    <Page id="seedmixes">
      <Header title="My seedmixes" rightSlot={getNewSeedMixButton()} />

      <Main>{getSeedmixes()}</Main>

      <EditSeedmix
        seedMixId={newSeedmix}
        onSaveSeedmix={onSaveSeedmix}
        onCancelSeedmix={onCancelSeedmix}
      />
    </Page>
  );
};

export default observer(Seedmixes);
