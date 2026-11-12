import { getCamelCaseObj } from '@flumens/utils';
import data from './data.json';
import warehouseIDs from './warehouseIDs.json';

export type Habitat = {
  id: string;
  warehouseId: string;
  level: number;
  name: string;
  definition: string;
  children?: string[];
  landscapeAndEcologicalContext?: string;
  synonyms?: string;
  inclusions?: string[];
  exclusions?: string[];
  species?: string;
};

const addWarehouseId = (habitat: Omit<Habitat, 'warehouseId'>): Habitat => ({
  ...habitat,
  warehouseId: (warehouseIDs as Record<string, string>)[habitat.id] || '',
});

export default Object.values(data).map(getCamelCaseObj).map(addWarehouseId);
