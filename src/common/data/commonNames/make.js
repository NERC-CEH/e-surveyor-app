const fs = require('fs');
const uksiPlants = require('../remote/uksi_plants.json');

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
      preferred_taxon: taxon,
      preferred_taxa_taxon_list_id: preferredId,
    } = term;

    if (languageCode === 'Latin') {
      // no need for latin - see data/species/index.json file
      return agg;
    }

    const language = LANGUAGE_ISO_MAPPING[languageCode];
    agg[language] || (agg[language] = []); // eslint-disable-line

    const species = {
      warehouse_id: parseInt(id, 10),
      common_name: capitalize(name),
      scientific_name: taxon,
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
