import Sample from 'models/sample';
import pollination from './cacheRemote/pollination.json';

type Pollinator = {
  latin_name: string;
  pollinator_count: number;
  pollinator_class: string;
};

const getRecalculatedPollinator = (sp: Pollinator): Pollinator => {
  const pollinatorCount = Sample.getUniqueSupportedSpecies([
    [sp.latin_name, ''],
  ]).length;

  return { ...sp, pollinator_count: pollinatorCount };
};

export default pollination.map(getRecalculatedPollinator) as Pollinator[];
