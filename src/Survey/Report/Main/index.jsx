/* eslint-disable camelcase */
import React from 'react';
import { observer } from 'mobx-react';
import {
  IonItem,
  IonLabel,
  IonIcon,
  IonList,
  IonBadge,
  IonItemDivider,
  IonModal,
  IonNote,
} from '@ionic/react';
import { Main, ModalHeader, InfoBackgroundMessage } from '@apps';
import CountUp from 'react-countup';
import PropTypes from 'prop-types';
import Sample from 'sample';
import pollination from 'common/data/pollination';
import Seeds from 'common/images/seeds.svg';
import './styles.scss';
import './bee.svg';

const { getUniqueSupportedSpecies, getSupportedSpeciesList } = Sample;

const SPECIES_GROUPS = ['Bee', 'Butterfly', 'Hoverfly'];

const byName = ([taxon, name], [taxon2, name2]) => {
  const selectedName = name || taxon;
  const selectedName2 = name2 || taxon2;
  return selectedName.localeCompare(selectedName2);
};

// TODO:
const byName2 = (
  { latin_name: taxon, common_name: name },
  { latin_name: taxon2, common_name: name2 }
) => {
  const selectedName = name || taxon;
  const selectedName2 = name2 || taxon2;
  return selectedName.localeCompare(selectedName2);
};

// TODO: name
const byName3 = ({ pollinator: taxon }, { pollinator: taxon2 }) => {
  const selectedName = taxon;
  const selectedName2 = taxon2;
  return selectedName.localeCompare(selectedName2);
};

@observer
class MainComponent extends React.Component {
  static propTypes = {
    sample: PropTypes.object.isRequired,
    getLeagueTable: PropTypes.func.isRequired,
    getMissingSeedmixSpecies: PropTypes.func.isRequired,
  };

  state = {
    showModal: false,
  };

  species = this.props.sample.getUniqueSpecies();

  getPollinators = () => {
    const getPollinatorsEntries = ([name, commonName]) => {
      const hasLatinName = ({ latin_name }) => latin_name === name;

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
        <IonItem onClick={this.getShowModal(name)} key={selectedName}>
          <IonLabel slot="start">{selectedName}</IonLabel>
          <IonLabel slot="end" className="pollinator-class">
            <IonBadge className={`${pollinatorClass}`}>
              {pollinatorCount}
            </IonBadge>
          </IonLabel>
        </IonItem>
      );
    };

    return this.species.sort(byName).map(getPollinatorsEntries);
  };

  listGroupCounts = species => {
    const getGroupEntries = groupName => {
      const byGroupName = ({ group }) => group === groupName;

      const count = species.filter(byGroupName).length;

      if (!count) {
        return null;
      }

      return (
        <IonItem key={groupName} onClick={this.getShowModal(groupName)}>
          <IonLabel slot="start">{groupName}</IonLabel>
          <IonLabel slot="end">{count}</IonLabel>
        </IonItem>
      );
    };

    return SPECIES_GROUPS.map(getGroupEntries);
  };

  getSupportedSpecies = () => {
    const species = getUniqueSupportedSpecies(this.species);

    return (
      <>
        <IonItem>
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
        </IonItem>

        {this.listGroupCounts(species)}
      </>
    );
  };

  getSpeciesPollinatorsModalList = () => {
    const getPollinatorsEntries = ({
      pollinator: taxon,
      pollinator_common_name: commonName,
    }) => (
      <IonItem key={taxon}>
        <IonLabel>{commonName || taxon}</IonLabel>
      </IonItem>
    );

    const species = getUniqueSupportedSpecies(this.species).map(
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

        <IonList>{species}</IonList>
      </>
    );
  };

  getSingleSpeciesPollinatorsModalList = speciesName => {
    const bySpeciesName = ({ plant }) => plant === speciesName;
    const getPollinatorsEntries = ({
      pollinator: latinName,
      pollinator_common_name: commonName,
    }) => {
      const taxonName = commonName || latinName;
      return (
        <IonItem key={taxonName}>
          <IonLabel>{taxonName}</IonLabel>
        </IonItem>
      );
    };

    const species = getSupportedSpeciesList(this.species)
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
    const hasLatinName = ({ latin_name }) => latin_name === speciesName;
    const pollinator = pollination.find(hasLatinName);

    const {
      pollinator_count: pollinatorCount,
      pollinator_class: pollinatorClass,
    } = pollinator;

    return (
      <>
        <IonItem className="pollinator-class">
          <IonLabel className="ion-text-wrap">
            <IonNote color="primary">
              This is <b className={pollinatorClass}>{pollinatorClass}</b> class
              flower that supports <b>{pollinatorCount}</b> species
            </IonNote>
          </IonLabel>
        </IonItem>

        <IonList>
          <IonItemDivider>
            <IonLabel>Found species</IonLabel>
          </IonItemDivider>
        </IonList>

        <IonList>{species}</IonList>
      </>
    );
  };

  getSpeciesGroupModalList = groupName => {
    const getPollinatorsEntries = ({
      pollinator: taxon,
      pollinator_common_name: commonName,
    }) => {
      return (
        <IonItem key={commonName || taxon}>
          <IonLabel>{commonName || taxon}</IonLabel>
        </IonItem>
      );
    };
    const byGroupName = ({ group }) => group === groupName;

    const species = getUniqueSupportedSpecies(this.species)
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

        <IonList>{species}</IonList>
      </>
    );
  };

  getMissingSeedmixSpeciesList = () => {
    const { getMissingSeedmixSpecies } = this.props;

    const missingSeedmixSpecies = getMissingSeedmixSpecies();

    if (!missingSeedmixSpecies.length) {
      return null;
    }

    const selectedSeedmixSpeciesEntries = ({ common_name, latin_name }) => {
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
        {list}
      </IonList>
    );
  };

  getSelectedSeedmixSpeciesList = () => {
    const { sample } = this.props;
    const [selectedSeedmixSpecies] = sample.getSeedmixUse();

    if (!selectedSeedmixSpecies.length) {
      return null;
    }

    const selectedSeedmixEntries = ([latinName, commonName]) => {
      const taxonName = commonName || latinName;
      return <IonItem key={taxonName}>{taxonName}</IonItem>;
    };

    return (
      <IonList>
        <IonItemDivider>
          <IonLabel>Found species</IonLabel>
        </IonItemDivider>
        {selectedSeedmixSpecies.sort(byName).map(selectedSeedmixEntries)}
      </IonList>
    );
  };

  getSpeciesSeedmixModalList = () => {
    return (
      <>
        {this.getSelectedSeedmixSpeciesList()}
        {this.getMissingSeedmixSpeciesList()}
      </>
    );
  };

  getLeagueTable = () => {
    const { getLeagueTable } = this.props;

    const getRow = (survey, index) => {
      const key = survey.name || survey.pollinators;

      return (
        <IonItem
          key={key}
          className={`league-table-item ${
            survey.current ? 'league-table-current' : ''
          }`}
        >
          <IonLabel>
            <IonLabel position="stacked">
              <b>{survey.name}</b>
            </IonLabel>
            <IonLabel position="stacked">
              Pollinators: <b>{survey.pollinators}</b>
            </IonLabel>
            <IonLabel position="stacked">
              {'Recorded species: '}
              {survey.species.length}
            </IonLabel>
          </IonLabel>
          <IonLabel slot="end">{index + 1}</IonLabel>
        </IonItem>
      );
    };

    const table = getLeagueTable().map(getRow);

    return (
      <IonList>
        <IonItem>
          <IonLabel className="ion-text-wrap">
            <IonNote color="primary">
              Recorder surveys supporting the most pollinators
            </IonNote>
          </IonLabel>
        </IonItem>

        {table}
      </IonList>
    );
  };

  getModalContents = () => {
    if (this.state.showModal === 'Seedmix') {
      return <Main>{this.getSpeciesSeedmixModalList()}</Main>;
    }

    if (this.state.showModal === 'Pollinators') {
      return <Main>{this.getSpeciesPollinatorsModalList()}</Main>;
    }

    if (this.state.showModal === 'League') {
      return <Main>{this.getLeagueTable()}</Main>;
    }

    if (SPECIES_GROUPS.includes(this.state.showModal)) {
      return <Main>{this.getSpeciesGroupModalList(this.state.showModal)}</Main>;
    }

    const isSpeciesName = !!this.state.showModal;
    if (isSpeciesName) {
      return (
        <Main>
          {this.getSingleSpeciesPollinatorsModalList(this.state.showModal)}
        </Main>
      );
    }

    return null;
  };

  getShowModal = modalType => {
    const showModal = () => this.setState({ showModal: modalType });
    return showModal;
  };

  showPollinatorsData = () => {
    return (
      <>
        <IonItem detail onClick={this.getShowModal('League')}>
          <IonLabel slot="start">League Table</IonLabel>
        </IonItem>

        <IonItemDivider mode="ios">
          <IonLabel className="home-report-label">Pollinators count</IonLabel>
        </IonItemDivider>

        <IonItem>
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
        </IonItem>

        {this.getPollinators()}

        <IonItemDivider mode="ios">
          <IonLabel className="home-report-label">
            Supported species groups
          </IonLabel>
        </IonItemDivider>
        {this.getSupportedSpecies()}
      </>
    );
  };

  render() {
    const { sample } = this.props;

    const [
      selectedSeedmixSpecies,
      totalSeedmixSpecies,
    ] = sample.getSeedmixUse();

    const { seedmix } = sample.attrs;

    const species = getUniqueSupportedSpecies(this.species);

    const title = this.state.showModal || '';

    const numberOfSpecies = species.length;

    return (
      <>
        <Main>
          <IonList lines="full">
            <IonItem className="report-header">
              <div className="seedmix" onClick={this.getShowModal('Seedmix')}>
                {seedmix && (
                  <>
                    <IonIcon icon={Seeds} />
                    <IonBadge>
                      <CountUp
                        end={selectedSeedmixSpecies.length}
                        duration={2.75}
                      />
                      /{totalSeedmixSpecies.length}
                    </IonBadge>
                  </>
                )}
              </div>
              <div
                className="pollinators"
                onClick={this.getShowModal('Pollinators')}
              >
                <IonIcon icon="/images/bee.svg" />
                <IonBadge>
                  <CountUp end={numberOfSpecies} duration={2.75} />
                </IonBadge>
              </div>
            </IonItem>

            {!!numberOfSpecies && this.showPollinatorsData()}

            {!numberOfSpecies && (
              <InfoBackgroundMessage skipTranslations>
                This report does not have any supported species groups.
              </InfoBackgroundMessage>
            )}
          </IonList>
        </Main>

        <IonModal mode="md" isOpen={!!this.state.showModal}>
          <ModalHeader title={title} onClose={this.getShowModal(false)} />
          {this.getModalContents()}
        </IonModal>
      </>
    );
  }
}

export default MainComponent;
