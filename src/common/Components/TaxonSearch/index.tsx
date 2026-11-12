import {
  type ForwardRefRenderFunction,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from 'react';
import {
  IonSearchbar,
  useIonViewDidEnter,
  type SearchbarCustomEvent,
} from '@ionic/react';
import Suggestions from './components/Suggestions';
import './styles.scss';
import SpeciesSearchEngine from './utils/searchEngine';
import type { Species } from './utils/searchHelpers';

export type { Species };

const MIN_SEARCH_LENGTH = 2;

const annotateRecordedTaxa = (
  searchResults: Species[],
  recordedTaxa: number[]
) => {
  const recordedTaxaWrap = (result: Species) =>
    recordedTaxa.includes(result.preferredId || result.warehouseId)
      ? { ...result, ...{ isRecorded: true } }
      : result;

  return searchResults.map(recordedTaxaWrap);
};

type Props = {
  onSpeciesSelected: (species: Species, edit: boolean) => void;
  recordedTaxa?: number[];
};

const TaxonSearch: ForwardRefRenderFunction<HTMLIonSearchbarElement, Props> = (
  { recordedTaxa, onSpeciesSelected },
  ref
) => {
  const input = useRef<HTMLIonSearchbarElement>(null);
  useImperativeHandle(ref, () => input.current!, []);

  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Species[] | null>(null);

  const onInputKeystroke = async (event: SearchbarCustomEvent) => {
    let newSearchPhrase = event.detail.value;

    const isValidSearch =
      typeof newSearchPhrase === 'string' &&
      newSearchPhrase.length >= MIN_SEARCH_LENGTH;
    if (!isValidSearch) {
      setSearchPhrase('');
      setSearchResults(null);
      return;
    }

    newSearchPhrase = (newSearchPhrase || '').toLowerCase();

    // search
    const newSearchResults = await SpeciesSearchEngine.search(newSearchPhrase);

    const annotatedSearchResults = annotateRecordedTaxa(
      newSearchResults,
      recordedTaxa || []
    );

    setSearchPhrase(newSearchPhrase);
    setSearchResults(annotatedSearchResults);
  };

  const onInputClear = () => {
    setSearchPhrase('');
    setSearchResults(null);
  };

  useIonViewDidEnter(() => {
    input.current?.setFocus();
  }, [input]);

  return (
    <>
      <IonSearchbar
        id="taxon"
        ref={input}
        placeholder="Species name"
        debounce={300}
        onIonInput={onInputKeystroke}
        onIonClear={onInputClear}
        showCancelButton="never"
      />

      <Suggestions
        searchResults={searchResults}
        searchPhrase={searchPhrase}
        onSpeciesSelected={onSpeciesSelected}
      />
    </>
  );
};

export default forwardRef(TaxonSearch);
