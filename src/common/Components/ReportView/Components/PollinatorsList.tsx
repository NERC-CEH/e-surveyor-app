import React, { FC, useState } from 'react';
import {
  ModalHeader,
  InfoBackgroundMessage,
  Main,
  InfoMessage,
} from '@flumens';
import {
  IonItem,
  IonLabel,
  IonItemDivider,
  IonModal,
  IonBadge,
  IonList,
} from '@ionic/react';
import Sample from 'models/sample';
import pollination from 'common/data/pollination';
import { informationCircleOutline } from 'ionicons/icons';
import { SpeciesNames } from '../helpers';

const { getUniqueSupportedSpecies, getSupportedSpeciesList } = Sample;

export const SPECIES_GROUPS = {
  Bee: 'Bees are fantastic pollinators.',
  Butterfly:
    'Hoverflies are great pollinators, and are useful in pest control.',
  Hoverfly: 'Butterflies are great pollinators.',
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

const NaturalEnemies: FC<Props> = ({ uniqueSpecies }) => {
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
          <IonLabel slot="start">{selectedName}</IonLabel>
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
            <IonLabel slot="start">{groupName}</IonLabel>
            <IonLabel slot="end">{count}</IonLabel>
          </IonItem>
          <InfoMessage color="medium">{groupLabel}</InfoMessage>
        </>
      );
    };

    return Object.entries(SPECIES_GROUPS).map(getGroupEntries);
  };

  const getSupportedSpecies = () => {
    const species = getUniqueSupportedSpecies(uniqueSpecies);

    return (
      <>
        <IonItemDivider>
          <IonLabel slot="start">
            <b>
              <small>Species</small>
            </b>
          </IonLabel>
          <IonLabel className="ion-text-right" slot="end">
            <b>
              <small>Counts</small>
            </b>
          </IonLabel>
        </IonItemDivider>

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
        <IonList>
          <IonItemDivider>
            <IonLabel>Sorry, no species were found</IonLabel>
          </IonItemDivider>
        </IonList>
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
        <InfoMessage icon={informationCircleOutline}>
          This is <b className={pollinatorClass}>{pollinatorClass}</b> class
          flower that supports <b>{pollinatorCount}</b> species
        </InfoMessage>

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

  const showPollinators = uniqueSpecies.length > 1; // no need if just a single species

  const isSpeciesGroupModal = Object.keys(SPECIES_GROUPS).includes(showModal);

  return (
    <>
      {showPollinators && (
        <>
          <h3>Pollinators count</h3>
          <div className="rounded">
            <IonItemDivider>
              <IonLabel slot="start">
                <b>
                  <small>Species</small>
                </b>
              </IonLabel>
              <IonLabel className="ion-text-right" slot="end">
                <b>
                  <small>Counts</small>
                </b>
              </IonLabel>
            </IonItemDivider>

            {getPollinators()}
          </div>
        </>
      )}

      <h3>Supported species groups</h3>
      <div className="rounded">{getSupportedSpecies()}</div>

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
