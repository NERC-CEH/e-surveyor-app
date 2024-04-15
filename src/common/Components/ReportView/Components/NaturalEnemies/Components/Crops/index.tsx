import { FC, useState } from 'react';
import { ModalHeader, Main } from '@flumens';
import { IonItem, IonLabel, IonModal, IonList } from '@ionic/react';
import { Interaction as EnemyInteraction } from 'common/data/naturalEnemies';
import Enemies from './Components/Enemies';

type Props = {
  crops: EnemyInteraction[];
  group: string;
};

const NaturalEnemies: FC<Props> = ({ crops, group }) => {
  const [showModal, setShowModal] = useState('');

  const groupItems = (agg: any, item: EnemyInteraction) => {
    if (!agg[item.crop_common_name]) {
      // eslint-disable-next-line no-param-reassign
      agg[item.crop_common_name] = [item.beneficial_insect_common_name];
      return agg;
    }

    // eslint-disable-next-line no-param-reassign
    agg[item.crop_common_name].push(item.beneficial_insect_common_name);
    return agg;
  };

  const bySelectedGroup = (crop: EnemyInteraction) => crop.crop_group === group;

  const groups: { [key: string]: string[] } = crops
    .filter(bySelectedGroup)
    .reduce(groupItems, {});

  const groupsWithUniqueSpeciesCount: [string, number][] = Object.entries(
    groups
  ).map(([groupName, species]: [string, string[]]) => [
    groupName,
    Array.from(new Set(species)).length,
  ]);

  const getGroupItem = ([groupName, count]: [string, number]) => (
    <IonItem key={groupName} onClick={() => setShowModal(groupName)}>
      <IonLabel slot="start">{groupName}</IonLabel>
      <IonLabel slot="end">{count}</IonLabel>
    </IonItem>
  );

  const bySize = ([, count1]: [string, number], [, count2]: [string, number]) =>
    count2 - count1;

  const groupedItems = groupsWithUniqueSpeciesCount
    .sort(bySize)
    .map(getGroupItem);

  return (
    <Main className="survey-report crops">
      <IonList lines="full">
        <h3 className="list-title">Crops</h3>

        <div className="rounded-list">
          <div className="list-divider">
            <div>Plant</div>
            <div>Beneficial species</div>
          </div>

          {groupedItems}
        </div>
      </IonList>

      <IonModal mode="md" isOpen={!!showModal}>
        <ModalHeader title={showModal} onClose={() => setShowModal('')} />
        <Enemies crops={crops} group={group} crop={showModal} />
      </IonModal>
    </Main>
  );
};

export default NaturalEnemies;
