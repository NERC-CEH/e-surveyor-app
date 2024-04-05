import { FC, useState } from 'react';
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
  pollinator_common_name: string;
}

type Props = {
  uniqueSpecies: SpeciesNames[];
};

const PollinatorsBadge: FC<Props> = ({ uniqueSpecies }) => {
  const [showModal, setShowModal] = useState(false);

  const uniqueSupportedSpecies = getUniqueSupportedSpecies(uniqueSpecies);
  const numberOfSpecies = uniqueSupportedSpecies.length;

  const getSpeciesPollinatorsModalList = () => {
    const getPollinatorsEntries = ({
      pollinator: taxon,
      pollinator_common_name: commonName,
    }: Pollinator) => (
      <IonItem key={taxon}>
        <IonLabel>{commonName || taxon}</IonLabel>
      </IonItem>
    );

    const species = getUniqueSupportedSpecies(uniqueSpecies).map(
      getPollinatorsEntries
    );

    if (!species.length) {
      return (
        <InfoBackgroundMessage>
          Sorry, no species were found
        </InfoBackgroundMessage>
      );
    }

    return (
      <IonList>
        <h3 className="list-title">Found species</h3>

        <div className="rounded">{species}</div>
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
