import seedmixData from './remote/seedmix.json';

const aggregateBySeedmixName = (agg, item) => {
  const { mix_name, ...species } = item; // eslint-disable-line camelcase
  // eslint-disable-next-line no-param-reassign
  agg[mix_name] || (agg[mix_name] = []);
  agg[mix_name].push(species);

  return agg;
};

export default seedmixData.reduce(aggregateBySeedmixName, {});
