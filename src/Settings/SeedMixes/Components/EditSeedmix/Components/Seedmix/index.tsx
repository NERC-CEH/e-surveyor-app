import { useHistory } from 'react-router-dom';
import { Button, useAlert } from '@flumens';
import {
  IonItem,
  IonList,
  IonButton,
  IonContent,
  IonButtons,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonLabel,
  IonInput,
} from '@ionic/react';
import InfoBackgroundMessage from 'Components/InfoBackgroundMessage';
import { SeedmixSpecies, SeedMix } from '../..';
import './styles.scss';

const useCancelConfirmation = () => {
  const alert = useAlert();

  return () =>
    new Promise(resolve => {
      alert({
        header: 'Discard seedmix changes',
        message: 'Are you sure you want to discard the changes?',
        buttons: [
          { text: 'Cancel', handler: () => resolve(false) },
          { text: 'Discard', handler: () => resolve(true) },
        ],
      });
    });
};

const useDeleteConfirmation = () => {
  const alert = useAlert();

  return () =>
    new Promise(resolve => {
      alert({
        header: 'Delete species',
        message: 'Are you sure you want to delete this species?',
        buttons: [
          { text: 'Cancel', handler: () => resolve(false) },
          { text: 'Delete', handler: () => resolve(true) },
        ],
      });
    });
};

type Props = {
  seedmix: SeedMix;
  onCancel: () => void;
  onSave: () => void;
  onSpeciesDelete: (warehouseId: number) => void;
  onNameChange: (e: any) => void;
};

const Seedmix = ({
  seedmix,
  onCancel,
  onSave,
  onSpeciesDelete,
  onNameChange,
}: Props) => {
  const history = useHistory();
  const confirmCancel = useCancelConfirmation();
  const confirmDelete = useDeleteConfirmation();

  const onCancelWrap = async () => {
    const shouldCancel = await confirmCancel();
    if (!shouldCancel) return;

    onCancel();
  };

  const getItem = (species: SeedmixSpecies) => {
    const onSpeciesDeleteWrap = async () => {
      const shouldDelete = await confirmDelete();
      if (!shouldDelete) return;

      onSpeciesDelete(species.warehouseId);
    };

    const taxonName = species.commonName || species.latinName;

    return (
      <IonItemSliding className="seedmix-list-item" key={species.warehouseId}>
        <IonItem lines="none">
          <div>{taxonName}</div>
        </IonItem>

        <IonItemOptions side="end">
          <IonItemOption color="danger" onClick={onSpeciesDeleteWrap}>
            Delete
          </IonItemOption>
        </IonItemOptions>
      </IonItemSliding>
    );
  };

  const getSpeciesList = () => {
    if (!seedmix?.species.length)
      return (
        <InfoBackgroundMessage>
          Your custom seedmix list is empty.
        </InfoBackgroundMessage>
      );

    const speciesEntries = seedmix?.species.map(getItem);

    return (
      <IonList>
        <div className="rounded-list">
          <div className="list-divider">Species</div>
          {speciesEntries}
        </div>
      </IonList>
    );
  };

  return (
    <div id="seedmix" className="ion-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onCancelWrap}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>Seedmix</IonTitle>
          <IonButtons slot="end">
            <IonButton color="secondary" fill="solid" onClick={onSave}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="list-with-padding list mx-2.5">
          <div className="rounded-list">
            <IonItem lines="none">
              <IonLabel position="fixed">
                <b>Name</b>
              </IonLabel>
              <IonInput value={seedmix.name} onIonChange={onNameChange} />
            </IonItem>
          </div>
        </div>

        <Button
          color="secondary"
          onPress={() => history.push('/add')}
          className="mx-auto my-5 bg-secondary-600"
        >
          Add Species
        </Button>

        {getSpeciesList()}
      </IonContent>
    </div>
  );
};

export default Seedmix;
