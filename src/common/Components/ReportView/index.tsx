/* eslint-disable camelcase */
import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { IonList } from '@ionic/react';
import { Main } from '@flumens';
import Occurrence from 'models/occurrence';
import { getUniqueSpecies } from 'Components/ReportView/helpers';
import SeedmixBadge from './Components/SeedmixBadge';
import PollinatorsBadge from './Components/PollinatorsBadge';
import NaturalEnemies from './Components/NaturalEnemies';
import PollinatorsList from './Components/PollinatorsList';
import './styles.scss';

type Props = {
  occurrences: Occurrence[];
  seedmix?: string;
};

const ReportMain: FC<Props> = ({ occurrences, seedmix }) => {
  const uniqueSpecies = getUniqueSpecies(occurrences);

  return (
    <>
      <Main className="survey-report">
        <div className="report-header">
          <SeedmixBadge occurrences={occurrences} seedmix={seedmix} />
          <PollinatorsBadge uniqueSpecies={uniqueSpecies} />
        </div>

        <IonList lines="full">
          <PollinatorsList uniqueSpecies={uniqueSpecies} />
          <NaturalEnemies uniqueSpecies={uniqueSpecies} />
        </IonList>
      </Main>
    </>
  );
};

export default observer(ReportMain);
