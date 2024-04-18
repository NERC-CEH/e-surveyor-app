import Sample from 'models/sample';
import pollination from './cacheRemote/pollination.json';

type Pollinator = {
  latinName: string;
  pollinatorCount: number;
  pollinatorClass: string;
};

const getRecalculatedPollinator = (sp: Pollinator): Pollinator => {
  const pollinatorCount = Sample.getUniqueSupportedSpecies([
    [sp.latinName, ''],
  ]).length;

  return { ...sp, pollinatorCount };
};

export default pollination.map(getRecalculatedPollinator) as Pollinator[];
