import { observer } from 'mobx-react';
import { informationCircleOutline } from 'ionicons/icons';
import { Main, InfoButton, InfoMessage } from '@flumens';
import { IonIcon } from '@ionic/react';
import { SeedmixSpecies } from 'common/data/seedmix';
import beeIcon from 'common/images/bee.svg';
import seedsIcon from 'common/images/seeds.svg';
import Occurrence from 'models/occurrence';
import { getUniqueSpecies } from 'Components/ReportView/helpers';
import Habitats from './Components/Habitats';
import NaturalEnemies from './Components/NaturalEnemies';
import PollinatorsBadge from './Components/PollinatorsBadge';
import PollinatorsList from './Components/PollinatorsList';
import SeedmixBadge from './Components/SeedmixBadge';

type Props = {
  showHabitats?: boolean;
  occurrences: Occurrence[];
  seedmixSpecies?: SeedmixSpecies[];
};

const ReportMain = ({ showHabitats, occurrences, seedmixSpecies }: Props) => {
  const uniqueSpecies = getUniqueSpecies(occurrences);

  return (
    <Main className="survey-report">
      <InfoMessage
        prefix={<IonIcon src={informationCircleOutline} className="size-6" />}
        color="tertiary"
        className="m-2"
      >
        What does this report mean?
        <InfoButton color="dark" label="READ MORE" header="Tips">
          <div className="[&>*]:my-2">
            <p>
              <IonIcon src={seedsIcon} /> <b>Seed Mix</b> tells you how many of
              the plant species you sowed (through your seed mix) that appeared
              in your survey. Tap to find out which species are missing.
            </p>
            <p>
              <IonIcon src={beeIcon} /> <b>Insect</b> tells you how many insect
              species you are supporting. Tap for the full list of species.
            </p>

            <p>
              Habitat tells you which broad habitat types are associated with
              the plant list you recorded.
            </p>
          </div>
        </InfoButton>
      </InfoMessage>

      <div className="my-4 flex flex-col gap-6">
        <div className="flex w-full justify-evenly">
          <SeedmixBadge
            occurrences={occurrences}
            seedmixSpecies={seedmixSpecies}
          />
          <PollinatorsBadge uniqueSpecies={uniqueSpecies} />
        </div>

        {showHabitats && <Habitats uniqueSpecies={uniqueSpecies} />}

        <PollinatorsList uniqueSpecies={uniqueSpecies} />

        <NaturalEnemies uniqueSpecies={uniqueSpecies} />
      </div>
    </Main>
  );
};

export default observer(ReportMain);
