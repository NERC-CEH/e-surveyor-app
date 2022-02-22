/* eslint-disable camelcase */
import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { Main } from '@flumens';
import './styles.scss';

const alphabetically = (s1: any, s2: any) => {
  const speciesName1 = s1.commonName || s1.scientificName;
  const speciesName2 = s2.commonName || s2.scientificName;
  return speciesName1.localeCompare(speciesName2);
};

type Props = {
  stepCount: any;
  steps: any;
  habitatList: any;
};

const ReportMain: FC<Props> = ({ stepCount, steps, habitatList }) => {
  const getRowComponent = ({ scientificName, commonName, count }: any) => {
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

  const getSpeciesCount = () => {
    const counter: any[] = [];
    const addToCounter = ([scientificName, commonName]: any) => {
      const byName = (sp: any) => sp.scientificName === scientificName;
      let species = counter.find(byName);
      if (!species) {
        species = { count: 1, commonName, scientificName };
        counter.push(species);
        return;
      }

      species.count++;
    };

    const countStepSpecies = (stepSpecies: any) =>
      stepSpecies.forEach(addToCounter);
    steps.forEach(countStepSpecies);

    return counter;
  };

  const getSpeciesCountForHabitat = () => {
    const counter = getSpeciesCount();

    const habitatCounter: any[] = [];

    const addToHabitatsCounter = ({
      commonName,
      positive,
      scientificName,
    }: any) => {
      const byName = (sp: any) => sp.scientificName === scientificName;
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

  const getSpeciesCountRowsForHabitat = () => {
    const counter = getSpeciesCountForHabitat();

    const byPositive = ({ positive, count }: any) => count && positive === 1;
    const byNegative = ({ positive, count }: any) => count && positive === 0;
    const byNeutral = ({ positive, count }: any) => count && positive === 'NA';

    const positive = counter
      .filter(byPositive)
      .sort(alphabetically)
      .map(getRowComponent);

    const neutral = counter
      .filter(byNeutral)
      .sort(alphabetically)
      .map(getRowComponent);

    const negative = counter
      .filter(byNegative)
      .sort(alphabetically)
      .map(getRowComponent);

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

    const getGroup = (rows: any, label: any) => {
      if (!rows.length) {
        return (
          <>
            <IonRow className="header">
              <IonCol>
                <h2>{label}</h2>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>No species found</IonCol>
            </IonRow>
          </>
        );
      }

      return (
        <>
          <IonRow className="header">
            <IonCol>
              <h2>{label}</h2>
            </IonCol>
          </IonRow>
          {header}
          {rows}
        </>
      );
    };

    return (
      <>
        {getGroup(neutral, 'Neutral')}
        {getGroup(positive, 'Positive')}
        {getGroup(negative, 'Negative')}
      </>
    );
  };

  const getSpeciesCountRows = () => {
    const counter = getSpeciesCount();

    const positive = counter.sort(alphabetically).map(getRowComponent);

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
  };

  const getSpeciesRows = () => {
    return habitatList
      ? getSpeciesCountRowsForHabitat()
      : getSpeciesCountRows();
  };

  return (
    <>
      <Main>
        <IonGrid>{getSpeciesRows()}</IonGrid>
      </Main>
    </>
  );
};

export default observer(ReportMain);
