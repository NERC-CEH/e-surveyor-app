import { createRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonButton,
  IonContent,
  IonButtons,
  IonTitle,
  IonToolbar,
  IonHeader,
} from '@ionic/react';
import TaxonSearch, { Species } from 'common/Components/TaxonSearch';
import { SeedmixSpecies } from '../index';

interface Props {
  onSpeciesSelected: (species: SeedmixSpecies) => void;
  selectedSpecies: number[];
}

const SeedmixFindSpecies = ({ onSpeciesSelected, selectedSpecies }: Props) => {
  const history = useHistory();
  const input = createRef<any>();

  const onSpeciesSelectedWrap = (sp: Species) => {
    const seedmixSpecies = {
      mixName: 'Custom',
      commonName: sp.commonName,
      latinName: sp.scientificName,
      warehouseId: sp.preferredId || sp.warehouseId,
    };
    onSpeciesSelected(seedmixSpecies);

    history.goBack();
  };

  useEffect(() => {
    if (input.current) {
      input.current.setFocus();
    }
  }, [input, input.current]);

  return (
    <div id="seedmix-find-species" className="ion-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>Back</IonButton>
          </IonButtons>
          <IonTitle>Find species</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <TaxonSearch
          onSpeciesSelected={onSpeciesSelectedWrap}
          recordedTaxa={selectedSpecies}
          ref={input}
        />
      </IonContent>
    </div>
  );
};

export default SeedmixFindSpecies;
