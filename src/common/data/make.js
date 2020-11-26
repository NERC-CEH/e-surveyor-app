const fs = require('fs');
const fetchSheet = require('@flumens/fetch-onedrive-excel');

const drive =
  'sites/flumensio.sharepoint.com,6230bb4b-9d52-4589-a065-9bebfdb9ce63,21520adc-6195-4b5f-91f6-7af0b129ff5c/drive';

const file = '01UPL42ZVRTEH6ILWMRFG3I5MIKC4YA7YW';

function saveSpeciesToFile(data, sheetName) {
  const saveSpeciesToFileWrap = (resolve, reject) => {
    const fileName = `./remote/${sheetName}.json`;
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
  const rawData = fs.readFileSync('./remote/uksi_plants.json');
  const data = JSON.parse(rawData);

  const extractTaxon = ({ preferred_taxon: taxon }) => taxon;

  const filteredData = [...new Set(data.map(extractTaxon))];

  fs.writeFileSync(
    './uksi_plants.list.json',
    JSON.stringify(filteredData, null, 2)
  );
}

function getEnglishPlantNames() {
  const rawData = fs.readFileSync('./remote/uksi_plants.json');
  const data = JSON.parse(rawData);

  const englishOnly = ({ language }) => language === 'English';

  const mapTaxonToCommonName = (agg, taxon) => ({
    ...agg,
    [taxon.preferred_taxon]: taxon.taxon,
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
  const sheetData = await fetchSheet({ drive, file, sheet });
  saveSpeciesToFile(sheetData, sheet);
};

const getData = async () => {
  await fetchAndSave('uksi_plants');
  await fetchAndSave('species');
  await fetchAndSave('seedmix');
  await fetchAndSave('pollination');
  await fetchAndSave('plant_interactions');
  await fetchAndSave('dummy_surveys');

  await filterUKSIPlants();
  await getEnglishPlantNames();

  console.log('All done! 🚀');
};

getData();
