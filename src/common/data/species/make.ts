import fs from 'fs';
import uksiPlants from '../cacheRemote/uksi_plants.json';
import optimise from './helperOptimise';

// ideally the warehouse report should return only the latin names
function sortAlphabetically(species: any) {
  const alphabetically = (sp1: any, sp2: any) =>
    sp1.taxon.localeCompare(sp2.taxon);
  return species.sort(alphabetically);
}

const getData = async () => {
  const sortedSpecies = await sortAlphabetically(uksiPlants);
  const optimizedSpecies = await optimise(sortedSpecies);

  fs.writeFileSync('./index.json', JSON.stringify(optimizedSpecies, null, 2));

  console.log('All done! 🚀');
};

getData();
