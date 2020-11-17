import Sample from 'sample';
import pollination from './remote/pollination.json';

const recalculatePollinators = sp => {
  const pollinatorCount = Sample.getUniqueSupportedSpecies([[sp.latin_name]])
    .length;

  return { ...sp, pollinator_count: pollinatorCount };
};

export default pollination.map(recalculatePollinators);
