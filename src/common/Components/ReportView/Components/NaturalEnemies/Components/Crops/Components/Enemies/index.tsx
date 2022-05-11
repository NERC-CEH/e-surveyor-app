import { FC } from 'react';
import { Interaction as EnemyInteraction } from 'common/data/naturalEnemies';
import plantCommonNamesDataset from 'common/data/uksi_plants.names.json';
import { Main } from '@oldBit';
import { IonItem, IonLabel, IonItemDivider, IonList } from '@ionic/react';
import './styles.scss';

const plantCommonNames = plantCommonNamesDataset as any;

type Props = {
  crops: EnemyInteraction[];
  group: string;
  crop: string;
};

const NaturalEnemies: FC<Props> = ({ crops, group, crop }) => {
  const bySelectedGroup = (interaction: EnemyInteraction) =>
    interaction.crop_group === group;
  const bySelectedCrop = (interaction: EnemyInteraction) =>
    interaction.crop_common_name === crop;

  const normalisePlantName = (
    interaction: EnemyInteraction
  ): [string, string] => {
    const plantName = plantCommonNames[interaction.plant_latin_name]
      ? plantCommonNames[interaction.plant_latin_name]
      : interaction.plant_latin_name;
    const beneficialSpecies = interaction.beneficial_insect_common_name; // || interacion.pest_latin_name;
    return [beneficialSpecies, plantName];
  };

  const uniqueCombinations: string[] = [];
  const unique = ([beneficialSpecies, plantName]: [string, string]) => {
    const hash = `${beneficialSpecies}${plantName}`;
    if (uniqueCombinations.includes(hash)) return false;
    uniqueCombinations.push(hash);
    return true;
  };

  const byBeneficialSpeciesName = (
    [beneficialSpecies1]: [string, string],
    [beneficialSpecies2]: [string, string]
  ): number => beneficialSpecies1.localeCompare(beneficialSpecies2);

  const groups: [string, string][] = crops
    .filter(bySelectedGroup)
    .filter(bySelectedCrop)
    .map(normalisePlantName)
    .filter(unique)
    .sort(byBeneficialSpeciesName);

  const getGroupItem = ([beneficialSpecies, plantName]: string[]) => (
    <IonItem key={beneficialSpecies}>
      <IonLabel slot="start">{beneficialSpecies}</IonLabel>
      <IonLabel slot="end">{plantName}</IonLabel>
    </IonItem>
  );

  const items = groups.map(getGroupItem);

  return (
    <Main className="survey-report beneficial-species">
      <IonList lines="full">
        <div className="rounded">
          <IonItemDivider>
            <IonLabel slot="start">
              <b>
                <small>Beneficial species</small>
              </b>
            </IonLabel>
            <IonLabel slot="end">
              <b>
                <small>Host plant</small>
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
