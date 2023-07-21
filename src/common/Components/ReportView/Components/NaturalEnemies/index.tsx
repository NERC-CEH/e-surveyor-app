import { FC, useState } from 'react';
import { ModalHeader, InfoBackgroundMessage } from '@flumens';
import { IonItem, IonLabel, IonItemDivider, IonModal } from '@ionic/react';
import naturalEnemies, {
  Interaction as EnemyInteraction,
} from 'common/data/naturalEnemies';
import { SpeciesNames } from '../../helpers';
import Crops from './Components/Crops';

type Props = {
  uniqueSpecies: SpeciesNames[];
};

const NaturalEnemies: FC<Props> = ({ uniqueSpecies }) => {
  const [showModal, setShowModal] = useState('');

  const uniqueSpeciesFlat = uniqueSpecies.flat();
  const matchesPlant = (interaction: EnemyInteraction) =>
    uniqueSpeciesFlat.includes(interaction.plant_latin_name);
  const crops = naturalEnemies.filter(matchesPlant);

  const groupItems = (agg: any, item: EnemyInteraction) => {
    if (!agg[item.crop_group]) {
      // eslint-disable-next-line no-param-reassign
      agg[item.crop_group] = [item.beneficial_insect_common_name];
      return agg;
    }

    // eslint-disable-next-line no-param-reassign
    agg[item.crop_group].push(item.beneficial_insect_common_name);
    return agg;
  };

  const groups: { [key: string]: string[] } = crops.reduce(groupItems, {});

  const groupsWithUniqueSpeciesCount: [string, number][] = Object.entries(
    groups
  ).map(([groupName, species]: [string, string[]]) => [
    groupName,
    Array.from(new Set(species)).length,
  ]);

  const bySize = ([, count1]: [string, number], [, count2]: [string, number]) =>
    count2 - count1;

  const getGroupItem = ([groupName, count]: [string, number]) => (
    <IonItem key={groupName} onClick={() => setShowModal(groupName)}>
      <IonLabel>{groupName}</IonLabel>
      <IonLabel slot="end">{count}</IonLabel>
    </IonItem>
  );

  const beneficialSpeciesGroups = groupsWithUniqueSpeciesCount
    .sort(bySize)
    .map(getGroupItem);

  if (!beneficialSpeciesGroups.length)
    return (
      <InfoBackgroundMessage>
        This report does not have any natural enemies species interactions data.
      </InfoBackgroundMessage>
    );

  return (
    <>
      <h3>Supported Crops</h3>
      <div className="rounded">
        <IonItemDivider>
          <IonLabel slot="start">
            <b>
              <small>Plant</small>
            </b>
          </IonLabel>
          <IonLabel className="ion-text-right" slot="end">
            <b>
              <small>Beneficial species</small>
            </b>
          </IonLabel>
        </IonItemDivider>

        {beneficialSpeciesGroups}
      </div>

      <IonModal mode="md" isOpen={!!showModal}>
        <ModalHeader title={showModal} onClose={() => setShowModal('')} />
        <Crops crops={crops} group={showModal} />
      </IonModal>
    </>
  );
};

export default NaturalEnemies;
