import seedmixData from './cacheRemote/seedmix.json';

export type Seedmix = {
  id?: number;
  warehouse_id?: number;
  mix_group: string;
  mix_name: string;
  common_name: string;
  latin_name: string;
  pn_latin_name: string;
};

export type SeedmixMap = {
  [key: string]: Seedmix[];
};

const aggregateBySeedmixName = (agg: SeedmixMap, item: Seedmix) => {
  const mix = item.mix_name;
  // eslint-disable-next-line no-param-reassign
  agg[mix] || (agg[mix] = []);
  agg[mix].push(item);

  return agg;
};

export default seedmixData.reduce(aggregateBySeedmixName, {});
