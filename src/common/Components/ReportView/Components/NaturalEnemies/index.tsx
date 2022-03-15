import React, { FC, useState } from 'react';
import naturalEnemies, {
  Interaction as EnemyInteraction,
} from 'common/data/naturalEnemies';
import { ModalHeader, InfoBackgroundMessage } from '@flumens';
import { IonItem, IonLabel, IonItemDivider, IonModal } from '@ionic/react';
import Crops from './Components/Crops';
import { SpeciesNames } from '../../helpers';

type Props = {
  uniqueSpecies: SpeciesNames[];
};

const NaturalEnemies: FC<Props> = ({ uniqueSpecies }) => {
  const [showModal, setShowModal] = useState('');

  const uniqueSpeciesFlat = uniqueSpecies.flat();
  const matchesPlant = (interaction: EnemyInteraction) =>
    uniqueSpeciesFlat.includes(interaction.plant_latin_name);
  const crops = naturalEnemies.filter(matchesPlant);

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

  const groups: { [key: string]: number } = crops
    .map((crop: EnemyInteraction) => crop.crop_group)
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
  if (!groupItems.length)
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

      <IonModal mode="md" isOpen={!!showModal}>
        <ModalHeader title={showModal} onClose={() => setShowModal('')} />
        <Crops species={crops} group={showModal} />
      </IonModal>
    </>
  );
};

export default NaturalEnemies;
