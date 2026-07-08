import { getCamelCaseObj } from '@flumens/utils';
import data from './data.json';

export type Habitat = {
  id: string;
  level: number;
  name: string;
  definition: string;
  children: string[];
  landscapeAndEcologicalContext: string;
  synonyms: string;
  inclusions: string[];
  exclusions: string[];
  species: string;
};

export default Object.values(data).map(getCamelCaseObj) as Habitat[];
