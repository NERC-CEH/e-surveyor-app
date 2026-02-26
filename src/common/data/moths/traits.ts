import mothTraits from '../cacheRemote/moth_traits.json';

export type SpeciesTraits = {
  scientificName: string;
  tvk: string;
  nationalRarity: string;
  hostPlants?: string;
  habitatGeneralist?: 1;
  habitatCoastal?: 1;
  habitatWoodland?: 1;
  habitatGrassland?: 1;
  habitatHeathlandMoorland?: 1;
  habitatMontaneUpland?: 1;
  habitatWetland?: 1;
  habitatOther?: 1;
};

export default mothTraits as SpeciesTraits[];
