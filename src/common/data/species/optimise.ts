import taxonCleaner from './clean';
import {
  GENUS_ID_INDEX,
  GENUS_TAXON_INDEX,
  GENUS_TVK_INDEX,
  GENUS_SPECIES_INDEX,
  SPECIES_ID_INDEX,
  SPECIES_TAXON_INDEX,
  SPECIES_TVK_INDEX,
  SPECIES_FREQUENCY_INDEX,
  SPECIES_DIFFICULTY_INDEX,
} from './constants';
import { RemoteAttributes } from './make';

function normalizeValue(value: any) {
  // check if int
  // https://coderwall.com/p/5tlhmw/converting-strings-to-number-in-javascript-pitfalls
  const int = value * 1;
  if (!Number.isNaN(int)) {
    return int;
  }
  return value;
}

function isGenusDuplicate(
  optimised: string | any[],
  taxa: RemoteAttributes,
  index?: number | undefined
) {
  const lastEntry = index || optimised.length - 1;
  if (lastEntry < 0) {
    // empty array
    return false;
  }
  const genus = optimised[lastEntry];
  if (genus.taxon !== taxa.taxon) {
    // couldn't find duplicate
    return false;
  }

  return true;
}

/**
 * Finds the last genus entered in the optimised list.
 * Looks for the matching taxa and informal group.
 * @param taxa
 * @param taxaNameSplitted
 * @returns {*}
 */
function getLastGenus(
  optimised: any[],
  taxa: RemoteAttributes,
  taxaNameSplitted: any[],
  index: number = optimised.length - 1
) {
  const lastEntry = index;
  const [genusName] = taxaNameSplitted;

  let lastGenus;
  if (index < 0) {
    // create a new genus with matching group
    lastGenus = [];
    lastGenus[GENUS_ID_INDEX] = 0;
    lastGenus[GENUS_TAXON_INDEX] = genusName;
    lastGenus[GENUS_TVK_INDEX] = '';
    lastGenus[GENUS_SPECIES_INDEX] = [];
    optimised.push(lastGenus);
    return lastGenus;
  }

  lastGenus = optimised[lastEntry];

  // const previousGenusName = lastGenus[GENUS_TAXON_INDEX];
  // if (previousGenusName !== genusName) {
  //   return getLastGenus(optimised, taxa, taxaNameSplitted, lastEntry - 1);
  // }

  if (!lastGenus[GENUS_SPECIES_INDEX]) {
    lastGenus[GENUS_SPECIES_INDEX] = [];
  }
  return lastGenus;
}

function addGenus(optimised: any[], taxa: RemoteAttributes) {
  if (isGenusDuplicate(optimised, taxa)) {
    console.warn(`Duplicate genus found: ${taxa.toString()}`);
    return;
  }

  const taxon = taxonCleaner(taxa.taxon, false);
  if (!taxon) {
    return;
  }

  const genus = [];
  genus[GENUS_ID_INDEX] = Number.parseInt(taxa.id, 10);
  genus[GENUS_TVK_INDEX] = taxa.externalKey;
  genus[GENUS_TAXON_INDEX] = taxon;
  genus[GENUS_SPECIES_INDEX] = [];

  optimised.push(genus);
}

const splitTaxonName = (taxaName: string) => {
  const taxaNameSplitted = taxaName.split(' ');
  // hybrid genus names starting with X should
  // have a full genus eg. X Agropogon littoralis
  if (taxaNameSplitted[0] === 'X') {
    taxaNameSplitted[0] = `${taxaNameSplitted.shift()} ${taxaNameSplitted[0]}`;
  }
  return taxaNameSplitted;
};

function addSpecies(optimised: any[], taxa: RemoteAttributes) {
  const taxaNameSplitted = splitTaxonName(taxa.taxon);

  // species that needs to be appended to genus
  const lastGenus = getLastGenus(optimised, taxa, taxaNameSplitted);

  let speciesArray = lastGenus[GENUS_SPECIES_INDEX];
  if (!speciesArray) {
    lastGenus[GENUS_SPECIES_INDEX] = [];
    speciesArray = lastGenus[GENUS_SPECIES_INDEX];
  }

  const id = normalizeValue(taxa.id);

  const taxon = taxaNameSplitted.slice(1).join(' ');
  const taxonClean = taxonCleaner(taxon, false);
  if (!taxonClean) {
    // cleaner might stripped all
    return;
  }

  const species = [];
  species[SPECIES_ID_INDEX] = id;
  species[SPECIES_TAXON_INDEX] = taxonClean;
  species[SPECIES_TVK_INDEX] = taxa.externalKey;

  if (taxa.frequency) {
    species[SPECIES_FREQUENCY_INDEX] = taxa.frequency;
  }
  if (taxa.difficulty) {
    species[SPECIES_DIFFICULTY_INDEX] = taxa.difficulty;
  }

  speciesArray.push(species);
}

/**
 * Optimises the array by grouping species to genus.
 */
export default function optimise(speciesFlattened: RemoteAttributes[]) {
  const optimised: any = [];

  const addToList = (taxa: RemoteAttributes) => {
    const hasOnlyGenusInTheName = taxa.taxon.split(' ').length === 1;
    if (hasOnlyGenusInTheName) {
      addGenus(optimised, taxa);
      return;
    }

    addSpecies(optimised, taxa);
  };

  speciesFlattened.forEach(addToList);

  return optimised;
}
