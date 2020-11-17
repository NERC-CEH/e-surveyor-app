import plantInteractions from './remote/plant_interactions.json';

const uniqArrayHashes = [];
const getUnique = sp => {
  const spHash = JSON.stringify(sp);
  if (uniqArrayHashes.includes(spHash)) {
    return false;
  }
  uniqArrayHashes.push(spHash);
  return true;
};

export default plantInteractions.filter(getUnique);
