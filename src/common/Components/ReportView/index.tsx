/* eslint-disable camelcase */
import React, { FC, useState } from 'react';
import { observer } from 'mobx-react';
import {
  IonItem,
  IonLabel,
  IonIcon,
  IonList,
  IonBadge,
  IonItemDivider,
  IonModal,
} from '@ionic/react';
import {
  Main,
  ModalHeader,
  InfoBackgroundMessage,
  InfoMessage,
} from '@flumens';
import { informationCircleOutline } from 'ionicons/icons';
import CountUp from 'react-countup';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import {
  getUniqueSpecies,
  getSeedmixUse,
  SpeciesNames,
} from 'Components/ReportView/helpers';
import pollination from 'common/data/pollination';
import Seeds from 'common/images/seeds.svg';
import beeIcon from 'common/images/bee.svg';
import './styles.scss';

const { getUniqueSupportedSpecies, getSupportedSpeciesList } = Sample;

const SPECIES_GROUPS = ['Bee', 'Butterfly', 'Hoverfly'];

interface Pollinator {
  pollinator: string;
  pollinator_common_name: string;
}

interface Species {
  pollinator: string;
  plant: string;
  group: string;
  pollinator_common_name: string;
}

const byName = ([taxon, name]: SpeciesNames, [taxon2, name2]: SpeciesNames) => {
  const selectedName = name || taxon;
  const selectedName2 = name2 || taxon2;
  return selectedName.localeCompare(selectedName2);
};

// TODO:
const byName2 = (
  {
    latin_name: taxon,
    common_name: name,
  }: { latin_name: string; common_name: string },
  {
    latin_name: taxon2,
    common_name: name2,
  }: { latin_name: string; common_name: string }
) => {
  const selectedName = name || taxon;
  const selectedName2 = name2 || taxon2;
  return selectedName.localeCompare(selectedName2);
};

// TODO: name
const byName3 = (
  { pollinator: taxon }: { pollinator: string },
  { pollinator: taxon2 }: { pollinator: string }
) => {
  const selectedName = taxon;
  const selectedName2 = taxon2;
  return selectedName.localeCompare(selectedName2);
};

export function getMissingSeedmixSpecies(
  occurrences: typeof Occurrence[],
  seedmix: string
) {
  const [selectedSeedmixSpecies, totalSeedmixSpecies = []] = getSeedmixUse(
    occurrences,
    seedmix
  );

  const getMissingSelectedSeedmixSpecies = ({ latin_name: latinName }: any) => {
    const hasLatinName = ([latin]: any) => latin === latinName;
    return !selectedSeedmixSpecies.find(hasLatinName);
  };

  return totalSeedmixSpecies.filter(getMissingSelectedSeedmixSpecies);
}

type Props = {
  occurrences: typeof Occurrence[];
  seedmix?: string;
};

const ReportMain: FC<Props> = ({ occurrences, seedmix }) => {
  const [showModal, setShowModel] = useState<any>(false);

  const uniqueSpecies = getUniqueSpecies(occurrences);

  const getShowModal = (modalType: string | boolean) => setShowModel(modalType);

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
        <IonItem onClick={() => getShowModal(name)} key={selectedName}>
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
    const getGroupEntries = (groupName: string) => {
      const byGroupName = ({ group }: { group: string }) => group === groupName;

      const count = species.filter(byGroupName).length;

      if (!count) {
        return null;
      }

      return (
        <IonItem key={groupName} onClick={() => getShowModal(groupName)}>
          <IonLabel slot="start">{groupName}</IonLabel>
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
      .sort(byName3)
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

    const {
      pollinator_count: pollinatorCount,
      pollinator_class: pollinatorClass,
    } = pollinator;

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
      .sort(byName3)
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
      common_name: string;
      latin_name: string;
    }) => {
      const taxonName = common_name || latin_name;
      return <IonItem key={taxonName}>{common_name || latin_name}</IonItem>;
    };

    const list = missingSeedmixSpecies
      .sort(byName2)
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

  const getSelectedSeedmixSpeciesList = () => {
    if (!seedmix) return null;

    const [selectedSeedmixSpecies] = getSeedmixUse(occurrences, seedmix);

    if (!selectedSeedmixSpecies.length) {
      return null;
    }

    const selectedSeedmixEntries = ([latinName, commonName]: string) => {
      const taxonName = commonName || latinName;
      return <IonItem key={taxonName}>{taxonName}</IonItem>;
    };

    return (
      <IonList>
        <IonItemDivider>
          <IonLabel>Found species</IonLabel>
        </IonItemDivider>

        <div className="rounded">
          {selectedSeedmixSpecies.sort(byName).map(selectedSeedmixEntries)}
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

  const getModalContents = () => {
    if (showModal === 'Seed mix') {
      return <Main>{getSpeciesSeedmixModalList()}</Main>;
    }

    if (showModal === 'Pollinators') {
      return <Main>{getSpeciesPollinatorsModalList()}</Main>;
    }

    if (SPECIES_GROUPS.includes(showModal)) {
      return <Main>{getSpeciesGroupModalList(showModal)}</Main>;
    }

    const isSpeciesName = !!showModal;
    if (isSpeciesName) {
      return <Main>{getSingleSpeciesPollinatorsModalList(showModal)}</Main>;
    }

    return null;
  };

  const showPollinatorsData = () => {
    const showPollinators = uniqueSpecies.length > 1; // no need if just a single species

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
      </>
    );
  };

  const getSeedmixComponent = () => {
    if (!seedmix) return null;

    const [selectedSeedmixSpecies, totalSeedmixSpecies] = getSeedmixUse(
      occurrences,
      seedmix
    );

    return (
      <div className="seedmix" onClick={() => getShowModal('Seed mix')}>
        <>
          <IonIcon icon={Seeds} />
          <IonBadge color="dark">
            <CountUp end={selectedSeedmixSpecies.length} duration={2.75} />/
            {totalSeedmixSpecies.length}
          </IonBadge>
        </>
      </div>
    );
  };

  const uniqueSupportedSpecies = getUniqueSupportedSpecies(uniqueSpecies);

  const title = showModal || '';

  const numberOfSpecies = uniqueSupportedSpecies.length;

  const getPollinatorsComponent = () => (
    <div className="pollinators" onClick={() => getShowModal('Pollinators')}>
      <IonIcon icon={beeIcon} />
      <IonBadge color="dark">
        <CountUp end={numberOfSpecies} duration={2.75} />
      </IonBadge>
    </div>
  );

  return (
    <>
      <Main className="survey-report">
        <div className="report-header">
          {getSeedmixComponent()}
          {getPollinatorsComponent()}
        </div>

        <IonList lines="full">
          {!!numberOfSpecies && showPollinatorsData()}

          {!numberOfSpecies && (
            <InfoBackgroundMessage>
              This report does not have any supported species groups.
            </InfoBackgroundMessage>
          )}
        </IonList>
      </Main>

      <IonModal mode="md" isOpen={!!showModal}>
        <ModalHeader title={title} onClose={() => getShowModal(false)} />
        {getModalContents()}
      </IonModal>
    </>
  );
};

export default observer(ReportMain);
