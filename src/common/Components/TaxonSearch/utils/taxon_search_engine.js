/** ****************************************************************************
 * Generates species list suggestions.
 **************************************************************************** */
import species from 'common/data/species/index.json';
import searchCommonNames from './commonNamesSearch';
import searchSciNames from './scientificNamesSearch';

const loading = false;

const MAX = 20;

const API = {
  async init() {
    // empty
  },

  /**
   * Returns an array of species in format
   {
     arrayId: "Genus array index"
     speciesId: "Species array index"
     speciesNameId: "Species name index" //to know where found
     warehouseId: "Warehouse id"
     group: "Species group"
     scientificName: "Scientific name"
     commonName: "Common name"
     synonym: "Common name synonym"
   }
   */
  async search(searchPhrase, options = {}) {
    // todo Accent Folding: https://alistapart.com/article/accent-folding-for-auto-complete

    const results = [];

    if (!searchPhrase) {
      return results;
    }

    // check if data exists
    if (!species) {
      // initialise data load
      if (!loading) {
        await API.init();
        return API.search(searchPhrase || '', options);
      }

      return Promise.resolve([]);
    }

    const maxResults = options.maxResults || MAX;
    const informalGroups = options.informalGroups || [];

    // normalize the search phrase
    const normSearchPhrase = searchPhrase.toLowerCase();

    searchCommonNames(normSearchPhrase, results);

    // search sci names
    searchSciNames(
      species,
      normSearchPhrase,
      results,
      maxResults,
      null,
      informalGroups
    );

    // return results in the order
    return results;
  },
};

export { API as default };
