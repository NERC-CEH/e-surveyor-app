import { useState } from 'react';
import CountUp from 'react-countup';
import { ModalHeader, Main } from '@flumens';
import { IonIcon, IonModal, IonLabel, IonItem, IonList } from '@ionic/react';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import beeIcon from 'common/images/bee.svg';
import Sample from 'models/sample';
import { SpeciesNames } from '../helpers';

const { getUniqueSupportedSpecies } = Sample;

interface Pollinator {
  pollinator: string;
  pollinatorCommonName: string;
}

type Props = {
  uniqueSpecies: SpeciesNames[];
};

const PollinatorsBadge = ({ uniqueSpecies }: Props) => {
  const [showModal, setShowModal] = useState(false);

  const uniqueSupportedSpecies = getUniqueSupportedSpecies(uniqueSpecies);
  const numberOfSpecies = uniqueSupportedSpecies.length;

  const getSpeciesPollinatorsModalList = () => {
    const getPollinatorsEntries = ({
      pollinator: taxon,
      pollinatorCommonName: commonName,
    }: Pollinator) => (
      <IonItem key={taxon}>
        <IonLabel>{commonName || taxon}</IonLabel>
      </IonItem>
    );

    const byName = (s1: Pollinator, s2: Pollinator) => {
      const name1 = s1.pollinatorCommonName || s1.pollinator;
      const name2 = s2.pollinatorCommonName || s2.pollinator;
      return name1.localeCompare(name2);
    };
    const species = getUniqueSupportedSpecies(uniqueSpecies)
      .sort(byName)
      .map(getPollinatorsEntries);

    if (!species.length) {
      return (
        <InfoBackgroundMessage>
          Sorry, no species were found
        </InfoBackgroundMessage>
      );
    }

    return (
      <IonList>
        <div className="rounded-list">
          <div className="list-divider">
            Species associated with your plants
          </div>
          {species}
        </div>
      </IonList>
    );
  };

  return (
    <>
      <div
        className="flex items-center justify-between gap-2"
        onClick={() => setShowModal(true)}
      >
        <IonIcon icon={beeIcon} className="size-9" />
        <div className="rounded-lg bg-primary-800 px-4 py-1 text-4xl font-bold text-white">
          <CountUp end={numberOfSpecies} duration={2.75} />
        </div>
      </div>

      <IonModal mode="md" isOpen={!!showModal}>
        <ModalHeader title="Pollinators" onClose={() => setShowModal(false)} />

        <Main>{getSpeciesPollinatorsModalList()}</Main>
      </IonModal>
    </>
  );
};

export default PollinatorsBadge;
