import plantInteractions from './cacheRemote/plant_interactions.json';

export type Interaction = {
  pollinator: string;
  plant: string;
  group: string;
  pollinatorCommonName: string;
};

const uniqArrayHashes: any = [];
const getUnique = (sp: Partial<Interaction>) => {
  const spHash = JSON.stringify(sp);
  if (uniqArrayHashes.includes(spHash)) {
    return false;
  }
  uniqArrayHashes.push(spHash);
  return true;
};

const getComplete = (sp: Partial<Interaction>) => {
  return (
    !!sp.group && !!sp.plant && !!sp.pollinator && !!sp.pollinatorCommonName
  );
};

export default plantInteractions
  .filter(getComplete)
  .filter(getUnique) as Interaction[];
