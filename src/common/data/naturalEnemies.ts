import enemies from './cacheRemote/natural_enemies.json';

export interface Interaction {
  id: number;
  plantLatinName: string;
  plantFamily: string;
  beneficialInsectCommonName: string;
  majorPest: string;
  pestCommonName: string;
  pestFamily: string;
  pestOrder: string;
  cropCommonName: string;
  cropLevelDescriptor: string;
  cropGroup: string;
}

export default enemies as Interaction[];
