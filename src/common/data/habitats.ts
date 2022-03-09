import habitats from './cacheRemote/habitats.json';

export type Habitat = {
  scheme: string;
  habitat: string;
  commonName?: string;
  scientificName: string;
  positive: number | string; // string = 'NA';
};

export type HabitatsByScheme = {
  [key: string]: string[];
};

export type HabitatMap = {
  [key: string]: Habitat[];
};

const normalisedHabitats: HabitatMap = {};

export const schemeHabitats: HabitatsByScheme = {};

const aggregateByHabitat = (species: Habitat) => {
  const { habitat, scheme } = species;

  if (!normalisedHabitats[habitat]) {
    normalisedHabitats[habitat] = [];
  }

  if (!schemeHabitats[scheme]) {
    schemeHabitats[scheme] = [];
  }

  if (!schemeHabitats[scheme].includes(habitat)) {
    schemeHabitats[scheme].push(habitat);
  }

  normalisedHabitats[habitat].push(species);
};

habitats.forEach(aggregateByHabitat);
export default normalisedHabitats;
