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

export type SeedmixMap = {
  [key: string]: SeedmixSpecies[];
};

const aggregateBySeedmixName = (agg: SeedmixMap, item: SeedmixSpecies) => {
  const mix = item.mixName;
  // eslint-disable-next-line no-param-reassign
  agg[mix] || (agg[mix] = []);
  agg[mix].push(item);

  return agg;
};

export default seedmixData.reduce(aggregateBySeedmixName, {});
