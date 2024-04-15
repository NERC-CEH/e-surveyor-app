import { FC, useState } from 'react';
import CountUp from 'react-countup';
import { ModalHeader, Main } from '@flumens';
import { IonIcon, IonModal, IonItem, IonList } from '@ionic/react';
import { SeedmixSpecies } from 'common/data/seedmix';
import Seeds from 'common/images/seeds.svg';
import Occurrence from 'models/occurrence';
import {
  SpeciesNames,
  getSeedmixUse,
  getMissingSeedmixSpecies,
} from '../helpers';

const bySpeciesName = (
  [taxon, name]: SpeciesNames,
  [taxon2, name2]: SpeciesNames
) => {
  const selectedName = name || taxon;
  const selectedName2 = name2 || taxon2;
  return selectedName.localeCompare(selectedName2);
};

const bySeedmixName = (
  { latin_name: taxon, common_name: name }: SeedmixSpecies,
  { latin_name: taxon2, common_name: name2 }: SeedmixSpecies
) => (name || taxon).localeCompare(name2 || taxon2);

type Props = {
  occurrences: Occurrence[];
  seedmixSpecies?: SeedmixSpecies[];
};

const SeedmixBadge: FC<Props> = ({ occurrences, seedmixSpecies }) => {
  const [showModal, setShowModal] = useState(false);

  if (!seedmixSpecies?.length) return null;

  const selectedSeedmixSpecies = getSeedmixUse(occurrences, seedmixSpecies);

  const getSelectedSeedmixSpeciesList = () => {
    if (!seedmixSpecies) return null;

    if (!selectedSeedmixSpecies.length) {
      return null;
    }

    const selectedSeedmixEntries = ([latinName, commonName]: SpeciesNames) => {
      const taxonName = commonName || latinName;
      return <IonItem key={taxonName}>{taxonName}</IonItem>;
    };

    return (
      <IonList>
        <div className="rounded-list">
          <div className="list-divider">Found species</div>

          {selectedSeedmixSpecies
            .sort(bySpeciesName)
            .map(selectedSeedmixEntries)}
        </div>
      </IonList>
    );
  };

  const getMissingSeedmixSpeciesList = () => {
    if (!seedmixSpecies) return null;

    const missingSeedmixSpecies = getMissingSeedmixSpecies(
      occurrences,
      seedmixSpecies
    );

    if (!missingSeedmixSpecies.length) {
      return null;
    }

    const selectedSeedmixSpeciesEntries = ({
      common_name,
      latin_name,
    }: {
      common_name?: string;
      latin_name: string;
    }) => {
      const taxonName = common_name || latin_name;
      return <IonItem key={taxonName}>{common_name || latin_name}</IonItem>;
    };

    const list = missingSeedmixSpecies
      .sort(bySeedmixName)
      .map(selectedSeedmixSpeciesEntries);

    return (
      <IonList>
        <h3 className="list-title">Missing species</h3>

        <div className="rounded-list">
          <div className="list-divider">Species</div>
          {list}
        </div>
      </IonList>
    );
  };

  const getSpeciesSeedmixModalList = () => {
    return (
      <>
        {getSelectedSeedmixSpeciesList()}
        {getMissingSeedmixSpeciesList()}
      </>
    );
  };

  return (
    <>
      <div
        className="flex items-center justify-between gap-2"
        onClick={() => setShowModal(true)}
      >
        <IonIcon icon={Seeds} className="size-9" />
        <div className="rounded-lg bg-primary-800 px-4 py-1 text-4xl font-bold text-white">
          <CountUp end={selectedSeedmixSpecies.length} duration={2.75} />/
          {seedmixSpecies.length}
        </div>
      </div>

      <IonModal mode="md" isOpen={!!showModal}>
        <ModalHeader title="Seedmix" onClose={() => setShowModal(false)} />

        <Main>{getSpeciesSeedmixModalList()}</Main>
      </IonModal>
    </>
  );
};

export default SeedmixBadge;
