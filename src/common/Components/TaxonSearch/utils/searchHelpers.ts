export type Species = {
  warehouseId: number;
  /**
   * Which name was it found when doing search
   */
  foundInName: 'scientificName' | 'commonName';
  /**
   * Scientific name
   */
  scientificName: string;
  /**
   * Common name
   */
  commonName?: string;
  /**
   * Genus array index
   */
  arrayId?: number;
  /**
   * ?
   */
  preferredId?: number;
  /**
   * Species array index
   */
  speciesId?: number;
  /**
   * Species name index, to know where found
   */
  speciesNameId?: number;
  /**
   * Species group
   */
  group?: number;
  /**
   * Common name synonym
   */
  synonym?: string;
  /**
   * Common name synonym
   */
  tvk?: string;
  /**
   * Records with the species.
   */
  frequency?: number;
  /**
   * ID difficulty level.
   */
  difficulty?: number;
  isRecorded?: boolean;
  isFavourite?: boolean;
};

export type SpeciesEntry = [
  id: number,
  name: string,
  tvk: string,
  frequency?: number | null,
  difficulty?: number,
];
export type Genus = [
  id: number,
  name: string,
  tvk: string,
  species?: SpeciesEntry[],
];
export type Genera = Genus[];

const SCI_NAME_INDEX = 1;

const helpers = {
  normalizeFirstWord: (phrase: string) => phrase.replace('.', ''),

  removeNonAlphanumerics: (phrase: string) =>
    phrase.replace(/\\[-'"()\\]/g, '.?'),

  escapeRegExp: (value: string) =>
    value.replace(/[-.*+?^${}()|[\]\\]/g, '\\$&'),

  getFirstWordRegexString(phraseOrig: string) {
    const phrase = helpers.removeNonAlphanumerics(
      helpers.escapeRegExp(phraseOrig)
    );
    return `^${phrase}.*`;
  },

  getOtherWordsRegexString(phraseOrig: string) {
    const phrase = helpers.removeNonAlphanumerics(
      helpers.escapeRegExp(phraseOrig)
    );

    return phrase
      .split(' ')
      .map(word => {
        const leading = word.replace(/\\\.([a-zA-Z]*)\b/i, '.*$1');
        const withoutTrailingDot = leading.replace(/\b\\\./i, '');
        return withoutTrailingDot.replace(
          /.*/i,
          withoutTrailingDot === '=' ? '$&.*' : '\\b$&.*'
        );
      })
      .join('');
  },

  findFirstMatching(genera: Genera, searchPhrase: string): number | null {
    const comparator = (index: number) => {
      const value = genera[index][SCI_NAME_INDEX].toLowerCase();
      const previous = genera[index - 1]?.[SCI_NAME_INDEX].toLowerCase();
      const match = new RegExp(`^${helpers.escapeRegExp(searchPhrase)}`, 'i');

      if (match.test(value)) return previous && match.test(previous) ? 1 : 0;
      return searchPhrase > value ? -1 : 1;
    };

    return helpers.binarySearch(genera, comparator);
  },

  binarySearch<T>(
    array: readonly T[],
    comparator: (index: number) => number,
    low = 0,
    high = array.length - 1
  ): number | null {
    if (high < low) return null;

    const mid = Math.floor((low + high) / 2);
    const compared = comparator(mid);
    if (compared > 0)
      return helpers.binarySearch(array, comparator, low, mid - 1);
    if (compared < 0)
      return helpers.binarySearch(array, comparator, mid + 1, high);
    return mid;
  },
};

export default helpers;
