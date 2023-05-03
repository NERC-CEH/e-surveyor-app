import { FC, useState } from 'react';
import CountUp from 'react-countup';
import { ModalHeader, Main } from '@flumens';
import {
  IonBadge,
  IonIcon,
  IonModal,
  IonItemDivider,
  IonLabel,
  IonItem,
  IonList,
} from '@ionic/react';
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
        <IonList>
          <IonItemDivider>
            <IonLabel>Sorry, no species were found</IonLabel>
          </IonItemDivider>
        </IonList>
      );
    }

    return (
      <>
        <IonList>
          <IonItemDivider>
            <IonLabel>Found species</IonLabel>
          </IonItemDivider>
        </IonList>

        <IonList>
          <div className="rounded">{species}</div>
        </IonList>
      </>
    );
  };

  return (
    <>
      <div className="pollinators" onClick={() => setShowModal(true)}>
        <IonIcon icon={beeIcon} />
        <IonBadge color="dark">
          <CountUp end={numberOfSpecies} duration={2.75} />
        </IonBadge>
      </div>

      <IonModal mode="md" isOpen={!!showModal}>
        <ModalHeader title="Pollinators" onClose={() => setShowModal(false)} />

        <Main>{getSpeciesPollinatorsModalList()}</Main>
      </IonModal>
    </>
  );
};

export default PollinatorsBadge;
