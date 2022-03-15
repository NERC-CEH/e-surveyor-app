import React, { FC, useState } from 'react';
import { Interaction as EnemyInteraction } from 'common/data/naturalEnemies';
import { ModalHeader, Main } from '@flumens';
import {
  IonItem,
  IonLabel,
  IonItemDivider,
  IonModal,
  IonList,
} from '@ionic/react';
import Enemies from './Components/Enemies';

type Props = {
  species: EnemyInteraction[];
  group: string;
};

const NaturalEnemies: FC<Props> = ({ species, group }) => {
  const [showModal, setShowModal] = useState('');

  const countItems = (agg: any, item: string) => {
    if (!Number.isFinite(agg[item])) {
      // eslint-disable-next-line no-param-reassign
      agg[item] = 1;
      return agg;
    }
    // eslint-disable-next-line no-param-reassign
    agg[item]++;
    return agg;
  };

  const bySelectedGroup = (crop: EnemyInteraction) => crop.crop_group === group;
  const groups: { [key: string]: number } = species
    .filter(bySelectedGroup)
    .map((crop: EnemyInteraction) => crop.crop_common_name)
    .reduce(countItems, {});

  const getGroupItem = ([groupName, count]: [string, number]) => (
    <IonItem key={groupName} onClick={() => setShowModal(groupName)}>
      <IonLabel slot="start">{groupName}</IonLabel>
      <IonLabel slot="end">{count}</IonLabel>
    </IonItem>
  );

  const bySize = ([, count1]: [string, number], [, count2]: [string, number]) =>
    count2 - count1;

  const groupItems = Object.entries(groups).sort(bySize).map(getGroupItem);

  return (
    <Main className="survey-report">
      <IonList lines="full">
        <h3>Crops</h3>
        <div className="rounded">
          <IonItemDivider>
            <IonLabel slot="start">
              <b>
                <small>Species</small>
              </b>
            </IonLabel>
            <IonLabel className="ion-text-right" slot="end">
              <b>
                <small>Interactions</small>
              </b>
            </IonLabel>
          </IonItemDivider>

          {groupItems}
        </div>
      </IonList>

      <IonModal mode="md" isOpen={!!showModal}>
        <ModalHeader title={showModal} onClose={() => setShowModal('')} />
        <Enemies species={species} group={group} crop={showModal} />
      </IonModal>
    </Main>
  );
};

export default NaturalEnemies;
