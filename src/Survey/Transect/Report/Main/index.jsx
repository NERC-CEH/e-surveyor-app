/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { observer } from 'mobx-react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { Main } from '@apps';
import './styles.scss';

const alphabetically = ([s1], [s2]) => s1.localeCompare(s2);
@observer
class MainComponent extends React.Component {
  static propTypes = exact({
    stepCount: PropTypes.number.isRequired,
    steps: PropTypes.array.isRequired,
  });

  getRowComponent = ([scientificName, { commonName, count }]) => {
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

  getSpeciesRows = () => {
    const { steps } = this.props;

    const counter = {};
    const addToCounter = ([scientificName, commonName]) => {
      if (!counter[scientificName]) {
        counter[scientificName] = { count: 1, commonName };
        return;
      }

      counter[scientificName].count++;
    };

    const countStepSpecies = stepSpecies => stepSpecies.forEach(addToCounter);
    steps.forEach(countStepSpecies);

    return Object.entries(counter)
      .sort(alphabetically)
      .map(this.getRowComponent);
  };

  render() {
    return (
      <>
        <Main>
          <IonGrid>
            <IonRow>
              <IonCol>
                <h3>Species</h3>
              </IonCol>
              <IonCol>
                <h3>Abundance</h3>
              </IonCol>
            </IonRow>

            {this.getSpeciesRows()}
          </IonGrid>
        </Main>
      </>
    );
  }
}

export default MainComponent;
