import seedmixData from './cacheRemote/seedmix.json';

export type SeedmixSpecies = {
  id?: number;
  warehouseId?: number;
  mixGroup?: string;
  mixName: string;
  commonName?: string;
  latinName: string;
  pnLatinName?: string;
};

export type SeedmixMap = Record<string, SeedmixSpecies[]>;

const aggregateBySeedmixName = (agg: SeedmixMap, item: SeedmixSpecies) => {
  const mix = item.mixName;

  agg[mix] || (agg[mix] = []);
  agg[mix].push(item);

  return agg;
};

export default seedmixData.reduce(aggregateBySeedmixName, {});
