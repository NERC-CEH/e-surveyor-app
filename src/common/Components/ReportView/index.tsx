/* eslint-disable camelcase */
import { FC } from 'react';
import { observer } from 'mobx-react';
import { IonList, IonIcon } from '@ionic/react';
import { Main, InfoButton, InfoMessage } from '@oldBit';
import Occurrence from 'models/occurrence';
import { informationCircleOutline } from 'ionicons/icons';
import { getUniqueSpecies } from 'Components/ReportView/helpers';
import { SeedmixSpecies } from 'common/data/seedmix';
import beeIcon from 'common/images/bee.svg';
import seedsIcon from 'common/images/seeds.svg';
import SeedmixBadge from './Components/SeedmixBadge';
import PollinatorsBadge from './Components/PollinatorsBadge';
import NaturalEnemies from './Components/NaturalEnemies';
import PollinatorsList from './Components/PollinatorsList';
import './styles.scss';

type Props = {
  occurrences: Occurrence[];
  seedmixSpecies?: SeedmixSpecies[];
};

const ReportMain: FC<Props> = ({ occurrences, seedmixSpecies }) => {
  const uniqueSpecies = getUniqueSpecies(occurrences);

  return (
    <>
      <Main className="survey-report">
        <InfoMessage icon={informationCircleOutline}>
          What does this report mean?
          <InfoButton label="READ MORE" header="Tips">
            <div>
              <p>
                <IonIcon src={seedsIcon} /> <b>Seed Mix</b> tells you how many
                of the plant species you sowed (through your seed mix) that
                appeared in your survey. Tap to find out which species are
                missing.
              </p>
              <p>
                <IonIcon src={beeIcon} /> <b>Insect</b> tells you how many
                insect species you are supporting. Tap for the full list of
                species.
              </p>
            </div>
          </InfoButton>
        </InfoMessage>

        <div className="report-header">
          <SeedmixBadge
            occurrences={occurrences}
            seedmixSpecies={seedmixSpecies}
          />
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
