import habitats from './cacheRemote/habitats.json';

const normalisedHabitats = {};

export const schemeHabitats = {};

const aggregateByHabitat = species => {
  const { scientificName, habitat, positive, commonName, scheme } = species;
  if (!normalisedHabitats[habitat]) {
    // eslint-disable-next-line
    normalisedHabitats[habitat] = [];
  }

  if (!schemeHabitats[scheme]) {
    schemeHabitats[scheme] = [];
  }

  if (!schemeHabitats[scheme].includes(habitat)) {
    schemeHabitats[scheme].push(habitat);
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
