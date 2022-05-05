import React, { FC } from 'react';
import { Interaction as EnemyInteraction } from 'common/data/naturalEnemies';
import plantCommonNamesDataset from 'common/data/uksi_plants.names.json';
import { Main } from '@flumens';
import { IonItem, IonLabel, IonItemDivider, IonList } from '@ionic/react';

const plantCommonNames = plantCommonNamesDataset as any;

type Props = {
  species: EnemyInteraction[];
  group: string;
  crop: string;
};

const NaturalEnemies: FC<Props> = ({ species, group, crop }) => {
  const bySelectedGroup = (interaction: EnemyInteraction) =>
    interaction.crop_group === group;
  const bySelectedCrop = (interaction: EnemyInteraction) =>
    interaction.crop_common_name === crop;

  const groups: string[] = species
    .filter(bySelectedGroup)
    .filter(bySelectedCrop)
    .map((interacion: EnemyInteraction) => {
      const plantName = plantCommonNames[interacion.plant_latin_name]
        ? plantCommonNames[interacion.plant_latin_name]
        : interacion.plant_latin_name;
      const pest = interacion.pest_common_name; // || interacion.pest_latin_name;
      return `${plantName} - ${pest}`;
    })
    .sort();

  const getGroupItem = (groupName: string) => (
    <IonItem key={groupName}>
      <IonLabel>{groupName}</IonLabel>
    </IonItem>
  );

  const items = groups.map(getGroupItem);

  return (
    <Main className="survey-report">
      <IonList lines="full">
        <h3>Plant - Pest</h3>
        <div className="rounded">
          <IonItemDivider>
            <IonLabel slot="start">
              <b>
                <small>Species Interactions</small>
              </b>
            </IonLabel>
          </IonItemDivider>

          {items}
        </div>
      </IonList>
    </Main>
  );
};

export default NaturalEnemies;
