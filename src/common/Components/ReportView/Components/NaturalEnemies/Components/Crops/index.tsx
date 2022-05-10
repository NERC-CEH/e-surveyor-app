import React, { FC, useState } from 'react';
import { Interaction as EnemyInteraction } from 'common/data/naturalEnemies';
import { ModalHeader, Main } from '@oldBit';
import {
  IonItem,
  IonLabel,
  IonItemDivider,
  IonModal,
  IonList,
} from '@ionic/react';
import Enemies from './Components/Enemies';
import './styles.scss';

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
    [...new Set(species)].length,
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
        <h3>Crops</h3>
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
