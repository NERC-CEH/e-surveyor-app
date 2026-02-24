import mothTraits from '../cacheRemote/moth_traits.json';

export type SpeciesTraits = {
  scientificName: string;
  tvk: string;
  nationalRarity: string;
  habitatGeneralist?: 1;
  habitatWoodland?: 1 | 2;
  habitatGrassland?: 1;
  habitatUplandHeathlandMoorland?: 1;
  habitatWetland?: 1;
};

export default mothTraits as SpeciesTraits[];
