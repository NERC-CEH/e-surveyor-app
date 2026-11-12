import fs from 'fs';
import uksiPlants from '../cacheRemote/uksi_plants.json';

const capitalize = (value: string) =>
  value
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const names = uksiPlants
  .filter(({ language }) => language === 'English')
  .map(
    ({
      id,
      taxon,
      preferredTaxon,
      preferredTaxaTaxonListId,
      externalKey,
      difficulty,
      frequency,
    }) => ({
      warehouseId: Number(id),
      commonName: capitalize(taxon),
      scientificName: preferredTaxon,
      preferredId: Number(preferredTaxaTaxonListId),
      tvk: externalKey,
      difficulty: difficulty ?? undefined,
      frequency: frequency ?? undefined,
    })
  )
  .sort((a, b) => a.commonName.localeCompare(b.commonName));

fs.writeFileSync('./index.json', JSON.stringify(names, null, 2));
console.log('All done! 🚀');
