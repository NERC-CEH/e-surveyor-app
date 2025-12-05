import { useState, useEffect } from 'react';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import { UUIDv7 } from '@flumens';
import { IonModal } from '@ionic/react';
import { SeedmixSpecies as SeedmixSpeciesFromRemote } from 'common/data/seedmix';
import appModel, { SeedMix as SeedMixFromRemote } from 'models/app';
import Seedmix from './Components/Seedmix';
import SeedmixFindSpecies from './Components/SeedmixFindSpecies';

export type SeedmixSpecies = SeedmixSpeciesFromRemote & {
  /** The warehouse id will always exist from search. */
  warehouseId: number;
};

export type SeedMix = SeedMixFromRemote & { species: SeedmixSpecies[] };

const bySpeciesName = (sp1: SeedmixSpecies, sp2: SeedmixSpecies) => {
  const name1 = sp1.commonName || sp1.latinName;
  const name2 = sp2.commonName || sp2.latinName;

  return name1.localeCompare(name2);
};

const getBlankSeedmix = (): SeedMix => ({
  id: UUIDv7(),
  name: 'My seedmix',
  species: [],
});

interface Props {
  seedMixId: string;
  onCancelSeedmix: () => void;
  onSaveSeedmix: (seedmix: SeedMix) => void;
}

const EditSeedmix = ({ seedMixId, onCancelSeedmix, onSaveSeedmix }: Props) => {
  const [seedmix, setSeedmix] = useState<SeedMix>(getBlankSeedmix());

  useEffect(() => {
    if (!seedMixId) return;

    if (seedMixId === 'new') {
      setSeedmix(getBlankSeedmix());
      return;
    }

    const byId = ({ id }: SeedMixFromRemote) => id === seedMixId;
    const existingSeedmix = appModel.data.seedmixes.find(byId);
    const existingSeedmixCopy = JSON.parse(JSON.stringify(existingSeedmix));
    setSeedmix(existingSeedmixCopy);
  }, [seedMixId]);

  const onCancelSeedmixWrap = () => {
    setSeedmix(getBlankSeedmix());
    onCancelSeedmix();
  };

  const onSaveSeedmixWrap = () => {
    onSaveSeedmix(seedmix);
    setSeedmix(getBlankSeedmix());
    onCancelSeedmix();
  };

  const onSpeciesDelete = (warehouseId: number) => {
    const byId = (sp: SeedmixSpecies) => sp.warehouseId !== warehouseId;
    const filteredList = seedmix.species.filter(byId);
    setSeedmix({ ...seedmix, species: filteredList } as SeedMix);
  };

  const onSpeciesSelected = (sp: SeedmixSpecies) => {
    seedmix?.species.push(sp);
    seedmix?.species.sort(bySpeciesName);
    setSeedmix({ ...seedmix } as SeedMix);
  };

  const onNameChange = (e: any) =>
    setSeedmix({ ...seedmix, name: e.target.value } as SeedMix);

  const getWarehouseID = (sp: SeedmixSpecies) => sp.warehouseId;
  const selectedSpecies = seedmix.species.map(getWarehouseID);

  return (
    <IonModal isOpen={!!seedMixId} onDidDismiss={onCancelSeedmixWrap}>
      <MemoryRouter>
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <Seedmix
                seedmix={seedmix}
                onCancel={onCancelSeedmixWrap}
                onSave={onSaveSeedmixWrap}
                onSpeciesDelete={onSpeciesDelete}
                onNameChange={onNameChange}
              />
            )}
          />
          <Route
            exact
            path="/add"
            render={() => (
              <SeedmixFindSpecies
                onSpeciesSelected={onSpeciesSelected}
                selectedSpecies={selectedSpecies}
              />
            )}
          />
        </Switch>
      </MemoryRouter>
    </IonModal>
  );
};

export default EditSeedmix;
