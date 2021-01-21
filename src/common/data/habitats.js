import habitats from './cacheRemote/habitats.json';

const normalisedHabitats = {};

const aggregateByHabitat = species => {
  const { scientificName, habitat, positive, commonName } = species;
  if (!normalisedHabitats[habitat]) {
    // eslint-disable-next-line
    normalisedHabitats[habitat] = [];
  }

  // eslint-disable-next-line
  normalisedHabitats[habitat].push({
    scientificName,
    commonName,
    positive,
  });
};

habitats.forEach(aggregateByHabitat);
export default normalisedHabitats;
