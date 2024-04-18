const fs = require('fs');
const uksiPlants = require('../cacheRemote/uksi_plants.json');

const LANGUAGE_ISO_MAPPING = {
  eng: 'English',
};

function turnNamesArrayIntoLangObject(array) {
  const transformToUpperCase = word =>
    word.charAt(0).toUpperCase() + word.slice(1);

  const capitalize = str =>
    str.toLowerCase().split(' ').map(transformToUpperCase).join(' ');

  const result = array.reduce(function getResult(agg, term) {
    const {
      language: languageCode,
      id,
      taxon: name,
      preferredTaxon: taxon,
      preferredTaxaTaxonListId: preferredId,
    } = term;

    if (languageCode === 'Latin') {
      // no need for latin - see data/species/index.json file
      return agg;
    }

    const language = LANGUAGE_ISO_MAPPING[languageCode];
    agg[language] || (agg[language] = []); // eslint-disable-line

    const species = {
      warehouseId: parseInt(id, 10),
      commonName: capitalize(name),
      scientificName: taxon,
      preferredId: parseInt(preferredId, 10),
    };

    agg.push(species);
    return agg;
  }, []);

  fs.writeFileSync('./index.json', JSON.stringify(result, null, 2));
}

function sortAlphabetically(species) {
  const alphabetically = (sp1, sp2) => sp1.taxon.localeCompare(sp2.taxon);
  return species.sort(alphabetically);
}

const getData = async () => {
  const sortedSpecies = await sortAlphabetically(uksiPlants);

  turnNamesArrayIntoLangObject(sortedSpecies);

  console.log('All done! 🚀');
};

getData();
