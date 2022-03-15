import plantInteractions from './cacheRemote/plant_interactions.json';

export type Interaction = {
  pollinator: string;
  plant: string;
  group: string;
  pollinator_common_name: string;
};

const uniqArrayHashes: any = [];
const getUnique = (sp: Interaction) => {
  const spHash = JSON.stringify(sp);
  if (uniqArrayHashes.includes(spHash)) {
    return false;
  }
  uniqArrayHashes.push(spHash);
  return true;
};

export default plantInteractions.filter(getUnique);
