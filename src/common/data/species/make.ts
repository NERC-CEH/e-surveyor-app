import fs from 'fs';
import uksiPlants from '../cacheRemote/uksi_plants.json';
import optimise from './optimise';

export type RemoteAttributes = (typeof uksiPlants)[number];

const sortedSpecies = [...uksiPlants].sort((a, b) =>
  a.taxon.localeCompare(b.taxon)
);
const optimizedSpecies = optimise(sortedSpecies);

fs.writeFileSync('./index.json', JSON.stringify(optimizedSpecies, null, 2));
console.log('All done! 🚀');
