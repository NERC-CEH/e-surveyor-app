const fs = require('fs');
const fetchSheet = require('@flumens/fetch-onedrive-excel'); // eslint-disable-line
const _ = require('lodash');

const drive =
  'sites/flumensio.sharepoint.com,6230bb4b-9d52-4589-a065-9bebfdb9ce63,21520adc-6195-4b5f-91f6-7af0b129ff5c/drive';

const file = '01UPL42ZVRTEH6ILWMRFG3I5MIKC4YA7YW';

const camelCase = doc => _.mapKeys(doc, (__, key) => _.camelCase(key));

function saveSpeciesToFile(data, sheetName) {
  const saveSpeciesToFileWrap = (resolve, reject) => {
    const fileName = `./cacheRemote/${sheetName}.json`;
    console.log(`Writing ${fileName}`);

    const dataOption = err => {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    };

    fs.writeFile(fileName, JSON.stringify(data, null, 2), dataOption);
  };
  return new Promise(saveSpeciesToFileWrap);
}

function filterUKSIPlants() {
  const rawData = fs.readFileSync('./cacheRemote/uksi_plants.json');
  const data = JSON.parse(rawData);

  const extractTaxon = (
    agg,
    { taxon, id, language, preferred } // eslint-disable-line camelcase
  ) => {
    if (language !== 'Latin') return agg;

    if (agg[taxon] && !preferred) return agg; // don't overwrite preferred ones

    // eslint-disable-next-line no-param-reassign
    agg[taxon] = id;
    return agg;
  };

  const filteredData = data.reduce(extractTaxon, {});

  fs.writeFileSync(
    './uksi_plants.list.json',
    JSON.stringify(filteredData, null, 2)
  );
}

function getEnglishPlantNames() {
  const rawData = fs.readFileSync('./cacheRemote/uksi_plants.json');
  const data = JSON.parse(rawData);

  const englishOnly = ({ language }) => language === 'English';

  const mapTaxonToCommonName = (agg, taxon) => ({
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

const fetchAndSave = async sheet => {
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

  await filterUKSIPlants();
  await getEnglishPlantNames();

  console.log('All done! 🚀');
};

getData();
