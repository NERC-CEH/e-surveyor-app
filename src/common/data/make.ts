import fs from 'fs';
import _ from 'lodash';
// eslint-disable-next-line
import fetchSheet from '@flumens/fetch-onedrive-excel';

const drive =
  'sites/flumensio.sharepoint.com,6230bb4b-9d52-4589-a065-9bebfdb9ce63,21520adc-6195-4b5f-91f6-7af0b129ff5c/drive';

const file = '01UPL42ZVRTEH6ILWMRFG3I5MIKC4YA7YW';

const camelCase = (doc: any) => _.mapKeys(doc, (__, key) => _.camelCase(key));

function saveSpeciesToFile(data: any, sheetName: string) {
  return new Promise((resolve, reject) => {
    const fileName = `./cacheRemote/${sheetName}.json`;
    console.log(`Writing ${fileName}`);

    const dataOption = (err: any) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    };

    fs.writeFile(fileName, JSON.stringify(data, null, 2), dataOption);
  });
}

function getEnglishPlantNames() {
  const rawData = fs.readFileSync('./cacheRemote/uksi_plants.json', 'utf8');
  const data = JSON.parse(rawData);

  const englishOnly = ({ language }: any) => language === 'English';

  const mapTaxonToCommonName = (agg: any, taxon: any) => ({
    ...agg,
    [taxon.preferredTaxon]: taxon.taxon,
  });

  const filteredData = data
    .filter(englishOnly)
    .reduce(mapTaxonToCommonName, {});

  fs.writeFileSync(
    './uksi_plants.names.json',
    JSON.stringify(filteredData, null, 2)
  );
}

const fetchAndSave = async (sheet: string) => {
  let sheetData = await fetchSheet({ drive, file, sheet });
  sheetData = sheetData.map(camelCase);
  saveSpeciesToFile(sheetData, sheet);
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
  await fetchAndSave('beetles');

  await getEnglishPlantNames();

  console.log('All done! 🚀');
};

getData();
