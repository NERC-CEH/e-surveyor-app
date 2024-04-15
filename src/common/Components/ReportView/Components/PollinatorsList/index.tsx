import { useState } from 'react';
import { informationCircleOutline } from 'ionicons/icons';
import { ModalHeader, Main, InfoMessage } from '@flumens';
import {
  IonItem,
  IonLabel,
  IonModal,
  IonBadge,
  IonList,
  IonIcon,
} from '@ionic/react';
import pollination from 'common/data/pollination';
import Sample from 'models/sample';
import InfoBackgroundMessage from 'Components/InfoBackgroundMessage';
import InfoButton from 'Components/InfoButton';
import { SpeciesNames } from '../../helpers';
import './styles.scss';

const { getUniqueSupportedSpecies, getSupportedSpeciesList } = Sample;

export const SPECIES_GROUPS = {
  Bee: 'Bees are fantastic pollinators.',
  Butterfly: 'Butterflies are great pollinators.',
  Hoverfly: 'Hoverflies are great pollinators, and are useful in pest control.',
};

interface Pollinator {
  pollinator: string;
  pollinator_common_name: string;
}

const byName = ([taxon, name]: SpeciesNames, [taxon2, name2]: SpeciesNames) => {
  const selectedName = name || taxon;
  const selectedName2 = name2 || taxon2;
  return selectedName.localeCompare(selectedName2);
};

const byPollinatorName = (
  { pollinator: taxon }: Pollinator,
  { pollinator: taxon2 }: Pollinator
) => {
  const selectedName = taxon;
  const selectedName2 = taxon2;
  return selectedName.localeCompare(selectedName2);
};

interface Species {
  pollinator: string;
  plant: string;
  group: string;
  pollinator_common_name: string;
}

type Props = {
  uniqueSpecies: SpeciesNames[];
};

const NaturalEnemies = ({ uniqueSpecies }: Props) => {
  const [showModal, setShowModal] = useState('');

  const uniqueSupportedSpecies = getUniqueSupportedSpecies(uniqueSpecies);

  const numberOfSpecies = uniqueSupportedSpecies.length;

  if (!numberOfSpecies)
    return (
      <InfoBackgroundMessage>
        This report does not have any supported species groups.
      </InfoBackgroundMessage>
    );

  const getPollinators = () => {
    const getPollinatorsEntries = ([name, commonName]: SpeciesNames) => {
      const hasLatinName = ({ latin_name }: { latin_name: string }) =>
        latin_name === name;

      const pollinator = pollination.find(hasLatinName);

      if (!pollinator) {
        return null;
      }

      const {
        pollinator_count: pollinatorCount,
        pollinator_class: pollinatorClass,
      } = pollinator;

      const selectedName = commonName || name;

      return (
        <IonItem onClick={() => setShowModal(name)} key={selectedName}>
          <IonLabel>{selectedName}</IonLabel>
          <IonLabel slot="end" className="pollinator-class">
            <IonBadge className={`${pollinatorClass}`}>
              {pollinatorCount}
            </IonBadge>
          </IonLabel>
        </IonItem>
      );
    };

    return uniqueSpecies.sort(byName).map(getPollinatorsEntries);
  };

  const listGroupCounts = (species: Species[]) => {
    const getGroupEntries = ([groupName, groupLabel]: string[]) => {
      const byGroupName = ({ group }: { group: string }) => group === groupName;

      const count = species.filter(byGroupName).length;

      if (!count) {
        return null;
      }

      return (
        <>
          <IonItem key={groupName} onClick={() => setShowModal(groupName)}>
            <IonLabel>{groupName}</IonLabel>
            <IonLabel slot="end">{count}</IonLabel>
          </IonItem>
          <InfoMessage>{groupLabel}</InfoMessage>
        </>
      );
    };

    return Object.entries(SPECIES_GROUPS).map(getGroupEntries);
  };

  const getSupportedSpecies = () => {
    const species = getUniqueSupportedSpecies(uniqueSpecies);

    return (
      <>
        <div className="list-divider">
          <div>Species</div>
          <div>Counts</div>
        </div>

        {listGroupCounts(species)}
      </>
    );
  };

  const getSpeciesGroupModalList = (groupName: string) => {
    const getPollinatorsEntries = ({
      pollinator: taxon,
      pollinator_common_name: commonName,
    }: Pollinator) => {
      return (
        <IonItem key={commonName || taxon}>
          <IonLabel>{commonName || taxon}</IonLabel>
        </IonItem>
      );
    };
    const byGroupName = ({ group }: { group: string }) => group === groupName;

    const species = getUniqueSupportedSpecies(uniqueSpecies)
      .sort(byPollinatorName)
      .filter(byGroupName)
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
          <div className="list-divider">Found species</div>

          {species}
        </div>
      </IonList>
    );
  };

  const getSingleSpeciesPollinatorsModalList = (speciesName: string) => {
    const bySpeciesName = ({ plant }: { plant: string }) =>
      plant === speciesName;
    const getPollinatorsEntries = ({
      pollinator: latinName,
      pollinator_common_name: commonName,
    }: Pollinator) => {
      const taxonName = commonName || latinName;
      return (
        <IonItem key={taxonName}>
          <IonLabel>{taxonName}</IonLabel>
        </IonItem>
      );
    };

    const species = getSupportedSpeciesList(uniqueSpecies)
      .sort(byPollinatorName)
      .filter(bySpeciesName)
      .map(getPollinatorsEntries);

    if (!species.length) {
      return (
        <InfoBackgroundMessage>
          Sorry, no species were found
        </InfoBackgroundMessage>
      );
    }

    // eslint-disable-next-line camelcase
    const hasLatinName = ({ latin_name }: { latin_name: string }) =>
      latin_name === speciesName;
    const pollinator = pollination.find(hasLatinName);

    let pollinatorCount;
    let pollinatorClass;
    if (pollinator) {
      pollinatorCount = pollinator.pollinator_count;
      pollinatorClass = pollinator.pollinator_class;
    }

    return (
      <>
        <InfoMessage
          prefix={<IonIcon src={informationCircleOutline} className="size-6" />}
          color="tertiary"
          className="m-2"
        >
          This is <b className={pollinatorClass}>{pollinatorClass}</b> class
          flower that supports <b>{pollinatorCount}</b> species
        </InfoMessage>

        <IonList>
          <div className="rounded-list">
            <div className="list-divider">Found species</div>
            {species}
          </div>
        </IonList>
      </>
    );
  };

  const showPollinators = uniqueSpecies.length > 1; // no need if just a single species

  const isSpeciesGroupModal = Object.keys(SPECIES_GROUPS).includes(showModal);

  return (
    <>
      {showPollinators && (
        <>
          <h3>
            <span>Pollinators count</span>
            <InfoButton>
              <div className="font-light">
                This section shows you how many pollinating species are
                supported by each of the plants in your habitat. Tap the green
                button to find out which species each plant supports.
              </div>
            </InfoButton>
          </h3>
          <div className="rounded-list">
            <div className="list-divider">
              <div>Species</div>
              <div>Counts</div>
            </div>

            {getPollinators()}
          </div>
        </>
      )}

      <h3>
        <span>Supported species groups</span>
        <InfoButton>
          <div className="font-light">
            In this section, you can see the number of species within each group
            that you are supporting. Tap the group name to find out about their
            benefits, and to see a full list of your supported species.
          </div>
        </InfoButton>
      </h3>
      <div className="rounded-list">{getSupportedSpecies()}</div>

      <IonModal mode="md" isOpen={!!showModal}>
        <ModalHeader title={showModal} onClose={() => setShowModal('')} />

        {isSpeciesGroupModal && (
          <Main>{getSpeciesGroupModalList(showModal)}</Main>
        )}
        {!isSpeciesGroupModal && (
          <Main>{getSingleSpeciesPollinatorsModalList(showModal)}</Main>
        )}
      </IonModal>
    </>
  );
};

export default NaturalEnemies;
