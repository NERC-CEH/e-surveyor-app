import React, { FC, useState } from 'react';
import {
  IonBadge,
  IonIcon,
  IonModal,
  IonItemDivider,
  IonLabel,
  IonItem,
  IonList,
} from '@ionic/react';
import Occurrence from 'models/occurrence';
import { SeedmixSpecies } from 'common/data/seedmix';
import { ModalHeader, Main } from '@flumens';
import CountUp from 'react-countup';
import Seeds from 'common/images/seeds.svg';
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
  seedmix?: string;
};

const SeedmixBadge: FC<Props> = ({ occurrences, seedmix }) => {
  const [showModal, setShowModal] = useState(false);

  if (!seedmix) return null;

  const [selectedSeedmixSpecies, totalSeedmixSpecies] = getSeedmixUse(
    occurrences,
    seedmix
  );

  const getSelectedSeedmixSpeciesList = () => {
    if (!seedmix) return null;

    if (!selectedSeedmixSpecies.length) {
      return null;
    }

    const selectedSeedmixEntries = ([latinName, commonName]: SpeciesNames) => {
      const taxonName = commonName || latinName;
      return <IonItem key={taxonName}>{taxonName}</IonItem>;
    };

    return (
      <IonList>
        <IonItemDivider>
          <IonLabel>Found species</IonLabel>
        </IonItemDivider>

        <div className="rounded">
          {selectedSeedmixSpecies
            .sort(bySpeciesName)
            .map(selectedSeedmixEntries)}
        </div>
      </IonList>
    );
  };

  const getMissingSeedmixSpeciesList = () => {
    if (!seedmix) return null;

    const missingSeedmixSpecies = getMissingSeedmixSpecies(
      occurrences,
      seedmix
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
        <IonItemDivider>
          <IonLabel>Missing species</IonLabel>
        </IonItemDivider>
        <div className="rounded">{list}</div>
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
      <div className="seedmix" onClick={() => setShowModal(true)}>
        <IonIcon icon={Seeds} />
        <IonBadge color="dark">
          <CountUp end={selectedSeedmixSpecies.length} duration={2.75} />/
          {totalSeedmixSpecies.length}
        </IonBadge>
      </div>

      <IonModal mode="md" isOpen={!!showModal}>
        <ModalHeader title="Seedmix" onClose={() => setShowModal(false)} />

        <Main>{getSpeciesSeedmixModalList()}</Main>
      </IonModal>
    </>
  );
};

export default SeedmixBadge;
