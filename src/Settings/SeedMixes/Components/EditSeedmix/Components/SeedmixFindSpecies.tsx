import { FC, createRef, useEffect } from 'react';
import {
  IonButton,
  IonContent,
  IonButtons,
  IonTitle,
  IonToolbar,
  IonHeader,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import TaxonSearch, { Species } from 'common/Components/TaxonSearch';
import { SeedmixSpecies } from '../index';

interface Props {
  onSpeciesSelected: (species: SeedmixSpecies) => void;
  selectedSpecies: number[];
}

const SeedmixFindSpecies: FC<Props> = ({
  onSpeciesSelected,
  selectedSpecies,
}) => {
  const history = useHistory();
  const input = createRef<any>();

  const onSpeciesSelectedWrap = (sp: Species) => {
    const seedmixSpecies = {
      mix_name: 'Custom',
      common_name: sp.common_name,
      latin_name: sp.scientific_name,
      warehouse_id: sp.preferredId || sp.warehouse_id,
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
