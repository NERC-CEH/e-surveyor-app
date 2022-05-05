import enemies from './cacheRemote/natural_enemies.json';

export interface Interaction {
  id: number;
  plant_latin_name: string;
  plant_family: string;
  beneficial_insect_common_name: string;
  major_pest: string;
  pest_common_name: string;
  pest_family: string;
  pest_order: string;
  crop_common_name: string;
  crop_level_descriptor: string;
  crop_group: string;
}

export default enemies as Interaction[];
