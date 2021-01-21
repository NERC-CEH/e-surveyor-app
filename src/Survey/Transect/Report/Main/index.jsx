/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { observer } from 'mobx-react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { Main } from '@apps';
import './styles.scss';

const alphabetically = (s1, s2) => {
  const speciesName1 = s1.commonName || s1.scientificName;
  const speciesName2 = s2.commonName || s2.scientificName;
  return speciesName1.localeCompare(speciesName2);
};

@observer
class MainComponent extends React.Component {
  static propTypes = exact({
    stepCount: PropTypes.number.isRequired,
    steps: PropTypes.array.isRequired,
    habitatList: PropTypes.array,
  });

  getRowComponent = ({ scientificName, commonName, count }) => {
    const { stepCount } = this.props;

    const name = commonName || scientificName;

    return (
      <IonRow key={name}>
        <IonCol>{name}</IonCol>
        <IonCol>
          <b>{count}</b>/{stepCount}
        </IonCol>
      </IonRow>
    );
  };

  getSpeciesCount = () => {
    const { steps } = this.props;

    const counter = [];
    const addToCounter = ([scientificName, commonName]) => {
      const byName = sp => sp.scientificName === scientificName;
      let species = counter.find(byName);
      if (!species) {
        species = { count: 1, commonName, scientificName };
        counter.push(species);
        return;
      }

      species.count++;
    };

    const countStepSpecies = stepSpecies => stepSpecies.forEach(addToCounter);
    steps.forEach(countStepSpecies);

    return counter;
  };

  getSpeciesCountForHabitat = () => {
    const { habitatList } = this.props;

    const counter = this.getSpeciesCount();

    const habitatCounter = [];

    const addToHabitatsCounter = ({ commonName, positive, scientificName }) => {
      const byName = sp => sp.scientificName === scientificName;
      const recordedSpecies = counter.find(byName) || {};
      const count = recordedSpecies.count || 0;

      habitatCounter.push({
        count,
        scientificName,
        commonName,
        positive,
      });
    };

    habitatList.forEach(addToHabitatsCounter);

    return habitatCounter;
  };

  getSpeciesCountRowsForHabitat() {
    const counter = this.getSpeciesCountForHabitat();

    const byPositive = ({ positive }) => positive === 1;
    const byNegative = ({ positive }) => positive === 0;
    const byNeutral = ({ positive }) => positive === 'NA';

    const positive = counter
      .filter(byPositive)
      .sort(alphabetically)
      .map(this.getRowComponent);

    const neutral = counter
      .filter(byNeutral)
      .sort(alphabetically)
      .map(this.getRowComponent);

    const negative = counter
      .filter(byNegative)
      .sort(alphabetically)
      .map(this.getRowComponent);

    const header = (
      <IonRow className="subheader">
        <IonCol>
          <h3>Species</h3>
        </IonCol>
        <IonCol>
          <h3>Abundance</h3>
        </IonCol>
      </IonRow>
    );

    return (
      <>
        {!!neutral.length && (
          <>
            <IonRow className="header">
              <IonCol>
                <h2>Neutral</h2>
              </IonCol>
            </IonRow>
            {header}
            {neutral}
          </>
        )}

        {!!positive.length && (
          <>
            <IonRow className="header">
              <IonCol>
                <h2>Positive</h2>
              </IonCol>
            </IonRow>
            {header}
            {positive}
          </>
        )}

        {!!negative.length && (
          <>
            <IonRow className="header">
              <IonCol>
                <h2>Negative</h2>
              </IonCol>
            </IonRow>
            {header}
            {negative}
          </>
        )}
      </>
    );
  }

  getSpeciesCountRows() {
    const counter = this.getSpeciesCount();

    const positive = counter.sort(alphabetically).map(this.getRowComponent);

    const header = (
      <IonRow className="subheader">
        <IonCol>
          <h3>Species</h3>
        </IonCol>
        <IonCol>
          <h3>Abundance</h3>
        </IonCol>
      </IonRow>
    );

    return (
      <>
        {header}
        {positive}
      </>
    );
  }

  getSpeciesRows = () => {
    const { habitatList } = this.props;

    return habitatList
      ? this.getSpeciesCountRowsForHabitat()
      : this.getSpeciesCountRows();
  };

  render() {
    return (
      <>
        <Main>
          <IonGrid>{this.getSpeciesRows()}</IonGrid>
        </Main>
      </>
    );
  }
}

export default MainComponent;
