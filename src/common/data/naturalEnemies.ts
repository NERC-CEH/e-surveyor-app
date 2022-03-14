import enemies from './cacheRemote/natural_enemies.json';

export interface Interaction {
  plant_latin_name: string;
  plant_family: string;
  Enemy: string;
  enemy_family: string;
  Enemy_order: string;
  enemy_order_common_name: string;
  pest_latin_name: string;
  pest_common_name: string;
  pest_family: string;
  pest_family_common_name: string;
  pest_order: string;
  pest_order_common_name: string;
  crop_common_name: string;
  crop_level_descriptor: string;
  crop_group: string;
}

export default enemies as Interaction[];
