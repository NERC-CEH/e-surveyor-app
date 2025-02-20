import fs from 'fs';
import { z, object, number } from 'zod';
import uksiPlants from '../cacheRemote/uksi_plants.json';
import optimise from './optimise';

const remoteSchema = object({
  id: z.string(),
  taxonGroup: z.string(),
  taxon: z.string(),
  defaultCommonName: z.string().optional(),
  commonName: z.string().optional(),
  externalKey: z.string(),
  frequency: number(),
  difficulty: number(),
});

export type RemoteAttributes = z.infer<typeof remoteSchema>;

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
