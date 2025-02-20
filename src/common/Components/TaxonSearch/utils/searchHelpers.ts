/** ****************************************************************************
 *
 **************************************************************************** */
import _ from 'lodash';

export type Species = {
  /**
   * Warehouse id
   */
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
};

const SCI_NAME_INDEX = 1; // in genera and above

const helpers: any = {
  normalizeFirstWord(phrase: any) {
    // replace all non alphanumerics with open character

    return phrase.replace('.', '');
  },

  removeNonAlphanumerics(phrase: any) {
    return phrase.replace(/\\[\-\'\"()\\]/g, '.?'); // eslint-disable-line
  },

  // TODO: change èéöüáöëïåß -> eeou..
  getFirstWordRegexString(phraseOrig: string) {
    let phrase = helpers.escapeRegExp(phraseOrig);
    phrase = helpers.removeNonAlphanumerics(phrase);
    return `^${phrase}.*`;
  },

  getOtherWordsRegexString(phraseOrig: string) {
    let phrase = helpers.escapeRegExp(phraseOrig);
    phrase = helpers.removeNonAlphanumerics(phrase);

    const words = phrase.split(' ');

    const wordOriginWrap = (wordOrigin: any, i: any) => {
      let word = wordOrigin;
      // check if word is ssp. var. etc
      // remove leading dot with .*
      const leading = word.replace(/\\\.([a-zA-Z]*)\b/i, '.*$1');
      if (leading) {
        word = leading;
      }

      word = word.replace(/\b\\\./i, ''); // remove trailing dot

      // hybrids
      if (word !== '=') {
        word = word.replace(/.*/i, '\\b$&.*'); // make \b word .*
      } else {
        word = word.replace(/.*/i, '$&.*'); // make \b word .*
      }

      words[i] = word;
    };

    _.each(words, wordOriginWrap);

    return words.join('');
  },

  /**
   * Escape string for using in regex.
   * @param string
   * @returns {*}
   * @private
   */
  escapeRegExp(string: any) {
    return string.replace(/[-.*+?^${}()|[\]\\]/g, '\\$&');
  },

  /**
   * Finds first match in array.
   * @param searchArray sorted array to find the first match
   * @param searchPhrase
   * @param commonName true/false if provided common name pointer array
   * @returns index of the first match in the array
   */
  findFirstMatching(
    species: any,
    searchArray: any,
    searchPhraseOrig: any,
    wordCount: any
  ) {
    let searchPhrase = searchPhraseOrig;
    function comparator(index: any) {
      const AFTER = -1;
      const BEFORE = 1;
      const EQUAL = 0;
      let value;
      let prevValue;

      // get values to compare
      if (wordCount >= 0) {
        // common name from pointer
        [searchPhrase] = searchPhrase.split(' ');
        let p = searchArray[index];

        value = helpers.getCommonName(species, p);
        // select word
        value = value.split(' ')[wordCount];

        // get a previous entry to compare against
        if (index > 0) {
          p = searchArray[index - 1];
          prevValue = helpers.getCommonName(species, p);
          // select word
          prevValue = prevValue.split(' ')[wordCount];
        }
      } else {
        value = searchArray[index][SCI_NAME_INDEX].toLowerCase();
        if (index > 0) {
          prevValue = searchArray[index - 1][SCI_NAME_INDEX].toLowerCase();
        }
      }

      // check if found first entry in array
      const matchRe = new RegExp(`^${helpers.escapeRegExp(searchPhrase)}`, 'i');
      if (matchRe.test(value)) {
        // check if prev entry matches
        if (prevValue) {
          if (matchRe.test(prevValue)) {
            return BEFORE; // matches but not the first match
          }
          return EQUAL; // found first entry
        }
        // no prev entry
        return EQUAL; // found first entry
      }

      // compare
      if (searchPhrase > value) {
        return AFTER;
      }
      return BEFORE;
    }

    return helpers.binarySearch(searchArray, comparator);
  },

  /**
   * Binary search.
   * Find the index of the first matching entry in array
   * O(Log n) (30K - lookup 14 times)
   */
  binarySearch(array: any, comparator: any, lowOrig: any, highOrig: any) {
    // initial set up
    const low = lowOrig || 0;
    let high = highOrig;
    if (high !== 0 && !high) {
      high = array.length - 1;
    }

    // checkup
    if (high < low) {
      return null;
    }

    const mid = parseInt(((low + high) / 2) as any, 10);
    const campared = comparator(mid);
    if (campared > 0) {
      return helpers.binarySearch(array, comparator, low, mid - 1);
    }
    if (campared < 0) {
      return helpers.binarySearch(array, comparator, mid + 1, high);
    }
    return mid;
  },

  isGenusPointer(p: any) {
    return p.length === 2;
  },
};

export { helpers as default };
