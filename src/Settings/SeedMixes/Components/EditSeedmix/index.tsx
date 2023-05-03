import { FC, useState, useEffect } from 'react';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import { IonModal } from '@ionic/react';
import { SeedmixSpecies as SeedmixSpeciesFromRemote } from 'common/data/seedmix';
import appModel, { SeedMix as SeedMixFromRemote } from 'models/app';
import Seedmix from './Components/Seedmix';
import SeedmixFindSpecies from './Components/SeedmixFindSpecies';

export type SeedmixSpecies = SeedmixSpeciesFromRemote & {
  /** The warehouse id will always exist from search. */
  warehouse_id: number;
};

export type SeedMix = SeedMixFromRemote & { species: SeedmixSpecies[] };

/**
 * Generate UUID.
 */
/* eslint-disable no-bitwise, import/prefer-default-export */
export function getNewUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });
}
/* eslint-enable no-bitwise, import/prefer-default-export */

const bySpeciesName = (sp1: SeedmixSpecies, sp2: SeedmixSpecies) => {
  const name1 = sp1.common_name || sp1.latin_name;
  const name2 = sp2.common_name || sp2.latin_name;

  return name1.localeCompare(name2);
};

const getBlankSeedmix = (): SeedMix => ({
  id: getNewUUID(),
  name: 'My seedmix',
  species: [],
});

interface Props {
  seedMixId: string;
  onCancelSeedmix: () => void;
  onSaveSeedmix: (seedmix: SeedMix) => void;
}

const EditSeedmix: FC<Props> = ({
  seedMixId,
  onCancelSeedmix,
  onSaveSeedmix,
}) => {
  const [seedmix, setSeedmix] = useState<SeedMix>(getBlankSeedmix());

  useEffect(() => {
    if (!seedMixId) return;

    if (seedMixId === 'new') {
      setSeedmix(getBlankSeedmix());
      return;
    }

    const byId = ({ id }: SeedMixFromRemote) => id === seedMixId;
    const existingSeedmix = appModel.attrs.seedmixes.find(byId);
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
    const byId = (sp: SeedmixSpecies) => sp.warehouse_id !== warehouseId;
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

  const getWarehouseID = (sp: SeedmixSpecies) => sp.warehouse_id;
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
