import React from 'react';
import { IonList, IonItem } from '@ionic/react';
import PropTypes from 'prop-types';
import Species from './components/Species';

/**
 * Some common names might be identical so needs to add
 * a latin name next to it.
 * @param suggestions
 */
function deDuplicateSuggestions(suggestions) {
  let previous = {};
  const results = [];

  const taxonWrap = taxon => {
    const name = taxon[taxon.found_in_name] || '';
    const nameNormalized = name.toLocaleLowerCase();

    const previousName = previous[previous.found_in_name] || '';
    const previousNameNormalized = previousName.toLocaleLowerCase();

    const noCommonNames = !nameNormalized || !previousNameNormalized;
    const isUnique = noCommonNames || nameNormalized !== previousNameNormalized;

    if (!isUnique) {
      return;
    }

    results.push(taxon);
    previous = taxon;
  };

  suggestions.forEach(taxonWrap);

  return results;
}

const getSearchInfo = () => (
  <IonItem className="empty">
    <span>
      <p>
        'For quicker searching of the taxa you can use different shortcuts. For
        example, to find'
        <i>Lopinga achine</i> you can type in the search bar :
        <br />
        <br />
        <i>lop ach</i>
        <br />
        <i>lopac</i>
        <br />
        <i>lop .ne</i>
        <br />
        <i>. achine</i>
      </p>
    </span>
  </IonItem>
);

const Suggestions = ({ searchResults, searchPhrase, onSpeciesSelected }) => {
  if (!searchResults) {
    return (
      <IonList id="suggestions" lines="none">
        {getSearchInfo()}
      </IonList>
    );
  }

  let suggestionsList;
  if (!searchResults.length) {
    suggestionsList = (
      <IonItem className="empty">
        <span> 'No species found with this name</span>
      </IonItem>
    );
  } else {
    const deDuped = deDuplicateSuggestions(searchResults);

    const speciesWrap = species => {
      const key = `${species.warehouse_id}-${species.found_in_name}-${species.isFavourite}`;

      return (
        <Species
          key={key}
          species={species}
          searchPhrase={searchPhrase}
          onSelect={onSpeciesSelected}
        />
      );
    };

    suggestionsList = deDuped.map(speciesWrap);
  }

  return (
    <IonList id="suggestions" lines="none">
      {suggestionsList}
    </IonList>
  );
};

Suggestions.propTypes = {
  searchResults: PropTypes.array,
  searchPhrase: PropTypes.string.isRequired,
  onSpeciesSelected: PropTypes.func.isRequired,
};

export default Suggestions;
