/** ****************************************************************************
 * Generates species list suggestions.
 **************************************************************************** */
import species from 'common/data/species/index.json';
import searchCommonNames from './commonNamesSearch';
import searchSciNames from './scientificNamesSearch';
import { Species } from './searchHelpers';

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
     tvk: "TVK"
   }
   */
  async search(searchPhrase: any, options: any = {}): Promise<Species[]> {
    // todo Accent Folding: https://alistapart.com/article/accent-folding-for-auto-complete

    const results: Species[] = [];

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
      species as any,
      normSearchPhrase,
      results,
      maxResults,
      false,
      informalGroups
    );

    const byFrequency = (t1: Species, t2: Species) =>
      (Number.isFinite(t2.frequency) ? t2.frequency! : -1) -
      (Number.isFinite(t1.frequency) ? t1.frequency! : -1); // defaulting to -1 so that genera/species with no frequency value are pushed to the bottom
    results.sort(byFrequency);
    console.log(results);

    // return results in the order
    return results;
  },
};

export { API as default };
