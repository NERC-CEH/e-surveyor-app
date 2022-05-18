import { FC } from 'react';
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
  IonItemDivider,
} from '@ionic/react';
import { InfoBackgroundMessage, useAlert } from '@flumens';
import { useHistory } from 'react-router-dom';
import { SeedmixSpecies, SeedMix } from '../../index';
import './styles.scss';

const useCancelConfirmation = () => {
  const alert = useAlert();

  return () => {
    return new Promise(resolve => {
      alert({
        header: 'Discard seedmix changes',
        message: 'Are you sure you want to discard the changes?',
        buttons: [
          {
            text: 'Cancel',
            cssClass: 'secondary',
            handler: () => resolve(false),
          },
          {
            text: 'Discard',
            cssClass: 'primary',
            handler: () => resolve(true),
          },
        ],
      });
    });
  };
};

const useDeleteConfirmation = () => {
  const alert = useAlert();

  return () => {
    return new Promise(resolve => {
      alert({
        header: 'Delete species',
        message: 'Are you sure you want to delete this species?',
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

interface Props {
  seedmix: SeedMix;
  onCancel: () => void;
  onSave: () => void;
  onSpeciesDelete: (warehouseId: number) => void;
  onNameChange: (e: any) => void;
}

const Seedmix: FC<Props> = ({
  seedmix,
  onCancel,
  onSave,
  onSpeciesDelete,
  onNameChange,
}) => {
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

      onSpeciesDelete(species.warehouse_id);
    };

    const taxonName = species.common_name || species.latin_name;

    return (
      <IonItemSliding className="seedmix-list-item" key={species.warehouse_id}>
        <IonItem>
          <IonLabel slot="start">{taxonName}</IonLabel>
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
        <IonList>
          <InfoBackgroundMessage>
            Your custom seedmix list is empty.
          </InfoBackgroundMessage>
        </IonList>
      );

    const speciesEntries = seedmix?.species.map(getItem);

    return (
      <IonList>
        <IonItemDivider>Species</IonItemDivider>
        <div className="rounded">{speciesEntries}</div>
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
        <IonList className="list-with-padding">
          <div className="rounded">
            <IonItem>
              <IonLabel position="fixed">
                <b>Name</b>
              </IonLabel>
              <IonInput value={seedmix.name} onIonChange={onNameChange} />
            </IonItem>
          </div>
        </IonList>

        <IonButton
          color="secondary"
          shape="round"
          expand="full"
          type="submit"
          onClick={() => history.push('/add')}
        >
          Add Species
        </IonButton>

        {getSpeciesList()}
      </IonContent>
    </div>
  );
};

export default Seedmix;
