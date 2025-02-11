import { useState } from 'react';
import { informationCircleOutline } from 'ionicons/icons';
import { ModalHeader, Main, InfoMessage, Badge } from '@flumens';
import { IonItem, IonLabel, IonModal, IonList, IonIcon } from '@ionic/react';
import pollination from 'common/data/pollination';
import Sample from 'models/sample';
import InfoBackgroundMessage from 'Components/InfoBackgroundMessage';
import InfoButton from 'Components/InfoButton';
import { SpeciesNames } from '../../helpers';
import './styles.scss';

const { getUniqueSupportedSpecies, getSupportedSpeciesList } = Sample;

const SPECIES_GROUPS = ['Bee', 'Butterfly', 'Hoverfly'];

interface Pollinator {
  pollinator: string;
  pollinatorCommonName: string;
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
  pollinatorCommonName: string;
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
      <InfoBackgroundMessage className="my-3">
        This report does not have any supported species groups.
      </InfoBackgroundMessage>
    );

  const getPollinators = () => {
    const getPollinatorsEntries = ([name, commonName]: SpeciesNames) => {
      const hasLatinName = ({ latinName }: { latinName: string }) =>
        latinName === name;

      const pollinator = pollination.find(hasLatinName);

      if (!pollinator) {
        return null;
      }

      const { pollinatorCount, pollinatorClass } = pollinator;

      const selectedName = commonName || name;

      return (
        <IonItem
          onClick={() => setShowModal(name)}
          key={selectedName}
          className="[--inner-padding-end:0]"
        >
          <div className="flex w-full justify-between py-4">
            <div className="">{selectedName}</div>
            <div className="pollinator-class flex h-fit min-w-12 shrink-0 justify-center">
              <Badge className={`${pollinatorClass}`} skipTranslation>
                {pollinatorCount}
              </Badge>
            </div>
          </div>
        </IonItem>
      );
    };

    return uniqueSpecies.sort(byName).map(getPollinatorsEntries);
  };

  const listGroupCounts = (species: Species[]) => {
    const getGroupEntries = (groupName: string) => {
      const byGroupName = ({ group }: { group: string }) => group === groupName;

      const count = species.filter(byGroupName).length;

      if (!count) {
        return null;
      }

      return (
        <IonItem key={groupName} onClick={() => setShowModal(groupName)}>
          <IonLabel>{groupName}</IonLabel>
          <IonLabel slot="end">{count}</IonLabel>
        </IonItem>
      );
    };

    return SPECIES_GROUPS.map(getGroupEntries);
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
      pollinatorCommonName: commonName,
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
          <div className="list-divider">
            Species associated with your plants
          </div>

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
      pollinatorCommonName: commonName,
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

    const hasLatinName = ({ latinName }: { latinName: string }) =>
      latinName === speciesName;
    const pollinator = pollination.find(hasLatinName);

    let pollinatorCount;
    let pollinatorClass;
    if (pollinator) {
      pollinatorCount = pollinator.pollinatorCount;
      pollinatorClass = pollinator.pollinatorClass;
    }

    return (
      <>
        <InfoMessage
          prefix={<IonIcon src={informationCircleOutline} className="size-6" />}
          color="tertiary"
          className="m-2"
        >
          This is a <b className={pollinatorClass}>{pollinatorClass}</b> class
          flower that supports <b>{pollinatorCount}</b> species
        </InfoMessage>

        <IonList>
          <div className="rounded-list">
            <div className="list-divider">
              Species associated with your plants
            </div>
            {species}
          </div>
        </IonList>
      </>
    );
  };

  const showPollinators = uniqueSpecies.length > 1; // no need if just a single species

  const isSpeciesGroupModal = SPECIES_GROUPS.includes(showModal);

  return (
    <>
      {showPollinators && (
        <IonList lines="full">
          <h3 className="list-title">
            Potential pollinator count
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
        </IonList>
      )}

      <IonList lines="full">
        <h3 className="list-title">
          Potentially supported species
          <InfoButton>
            <div className="font-light">
              In this section, you can see the number of species within each
              group that you are supporting. Tap the group name to see a full
              list of your supported species. Bees, butterflies and hoverflies
              are great pollinators and hoverflies are also useful in pest
              control.
            </div>
          </InfoButton>
        </h3>
        <div className="rounded-list">{getSupportedSpecies()}</div>
      </IonList>

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
