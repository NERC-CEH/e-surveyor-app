// get local environment variables from .env
const fs = require('fs');
const uksiPlants = require('../cacheRemote/uksi_plants.json');
const optimise = require('./helperOptimise');

// ideally the warehouse report should return only the latin names
function sortAlphabetically(species) {
  const alphabetically = (sp1, sp2) => sp1.taxon.localeCompare(sp2.taxon);
  return species.sort(alphabetically);
}

const getData = async () => {
  const sortedSpecies = await sortAlphabetically(uksiPlants);
  const optimizedSpecies = await optimise(sortedSpecies);

  fs.writeFileSync('./index.json', JSON.stringify(optimizedSpecies, null, 2));

  console.log('All done! 🚀');
};

getData();
