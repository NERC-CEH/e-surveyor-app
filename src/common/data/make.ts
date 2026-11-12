import fs from 'fs';
import { camelCase } from 'lodash';
// eslint-disable-next-line import-x/no-extraneous-dependencies
import fetchSheet from '@flumens/fetch-onedrive-excel';

const drive =
  'sites/flumensio.sharepoint.com,6230bb4b-9d52-4589-a065-9bebfdb9ce63,21520adc-6195-4b5f-91f6-7af0b129ff5c/drive';
const file = '01UPL42ZVRTEH6ILWMRFG3I5MIKC4YA7YW';

type Document = Record<string, unknown>;
type PlantName = {
  language: string;
  preferredTaxon: string;
  taxon: string;
};

const camelCaseKeys = (document: Document) =>
  Object.fromEntries(
    Object.entries(document).map(([key, value]) => [camelCase(key), value])
  );

function saveSpeciesToFile(data: Document[], sheetName: string) {
  const fileName = `./cacheRemote/${sheetName}.json`;
  console.log(`Writing ${fileName}`);
  fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
}

function getEnglishPlantNames() {
  const rawData = fs.readFileSync('./cacheRemote/uksi_plants.json', 'utf8');
  const data = JSON.parse(rawData) as PlantName[];

  const names = Object.fromEntries(
    data
      .filter(({ language }) => language === 'English')
      .map(({ preferredTaxon, taxon }) => [preferredTaxon, taxon])
  );

  fs.writeFileSync('./uksi_plants.names.json', JSON.stringify(names, null, 2));
}

const fetchAndSave = async (sheet: string) => {
  const result: unknown = await fetchSheet({ drive, file, sheet });
  if (!Array.isArray(result)) throw new Error(`Invalid ${sheet} worksheet`);

  saveSpeciesToFile(result.map(camelCaseKeys), sheet);
};

const getData = async () => {
  await fetchAndSave('uksi_plants');
  await fetchAndSave('uksi_plants_blacklist');
  await fetchAndSave('species');
  await fetchAndSave('seedmix');
  await fetchAndSave('pollination');
  await fetchAndSave('plant_interactions');
  await fetchAndSave('habitats');
  await fetchAndSave('natural_enemies');
  await fetchAndSave('moth_traits');
  await fetchAndSave('moth_local_rarity');
  await fetchAndSave('beetles');

  getEnglishPlantNames();
  console.log('All done! 🚀');
};

getData();
