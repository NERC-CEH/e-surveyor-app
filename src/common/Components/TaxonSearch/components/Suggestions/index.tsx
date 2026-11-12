import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import type { Species as SpeciesType } from '../../utils/searchHelpers';
import Species from './components/Species';

/**
 * Some common names might be identical so needs to add
 * a latin name next to it.
 * @param suggestions
 */
function deDuplicateSuggestions(suggestions: SpeciesType[]) {
  let previous: SpeciesType | undefined;
  const results: SpeciesType[] = [];

  const getFoundName = (taxon?: SpeciesType) =>
    taxon ? taxon[taxon.foundInName] || '' : '';

  const taxonWrap = (taxon: SpeciesType) => {
    const name = getFoundName(taxon);
    const nameNormalized = name.toLocaleLowerCase();

    const previousName = getFoundName(previous);
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
  <InfoBackgroundMessage className="text-left">
    For quicker searching of the taxa you can use different shortcuts. For
    example, to find <i>Lopinga achine</i> you can type in the search bar :
    <br />
    <br />
    <i>lop ach</i>
    <br />
    <i>lopac</i>
    <br />
    <i>lop .ne</i>
    <br />
    <i>. achine</i>
  </InfoBackgroundMessage>
);

type Props = {
  searchResults?: SpeciesType[] | null;
  searchPhrase: string;
  onSpeciesSelected: (species: SpeciesType, edit: boolean) => void;
};
const Suggestions = ({
  searchResults,
  searchPhrase,
  onSpeciesSelected,
}: Props) => {
  if (!searchResults) {
    return (
      <div id="suggestions" className="list">
        {getSearchInfo()}
      </div>
    );
  }

  let suggestionsList;
  if (!searchResults.length) {
    suggestionsList = (
      <InfoBackgroundMessage>
        No species found with this name
      </InfoBackgroundMessage>
    );
  } else {
    const deDuped = deDuplicateSuggestions(searchResults);

    const speciesWrap = (species: SpeciesType) => {
      const key = `${species.warehouseId}-${species.foundInName}-${species.isFavourite}`;

      return (
        <Species
          key={key}
          species={species}
          searchPhrase={searchPhrase}
          onSelect={onSpeciesSelected}
        />
      );
    };

    suggestionsList = deDuped.slice(0, 50).map(speciesWrap);
  }

  return (
    <div id="suggestions" className="list mx-2.5">
      {suggestionsList}
    </div>
  );
};

export default Suggestions;
