import {
  ForwardRefRenderFunction,
  useEffect,
  useState,
  createRef,
  forwardRef,
  RefObject,
} from 'react';
import { IonSearchbar, useIonViewDidEnter } from '@ionic/react';
import SpeciesSearchEngine from './utils/taxon_search_engine';
import Suggestions from './components/Suggestions';
import './styles.scss';

export type Species = {
  /**
   * Warehouse id
   */
  warehouse_id: number;
  /**
   * Which name was it found when doing search
   */
  found_in_name: 'scientific_name' | 'common_name';
  /**
   * Scientific name
   */
  scientific_name: string;
  /**
   * Common name
   */
  common_name?: string;
  /**
   * Genus array index
   */
  array_id?: number;
  /**
   * ?
   */
  preferredId?: number;
  /**
   * Species array index
   */
  species_id?: number;
  /**
   * Species name index, to know where found
   */
  species_name_id?: number;
  /**
   * Species group
   */
  group?: number;
  /**
   * Common name synonym
   */
  synonym?: string;
};

const MIN_SEARCH_LENGTH = 2;

const annotateRecordedTaxa = (
  searchResults: Species[],
  recordedTaxa: number[]
) => {
  const recordedTaxaWrap = (result: Species) =>
    recordedTaxa.includes(result.preferredId || result.warehouse_id)
      ? { ...result, ...{ isRecorded: true } }
      : result;

  return searchResults.map(recordedTaxaWrap);
};

type Props = {
  onSpeciesSelected: any;
  recordedTaxa?: number[];
};

const TaxonSearch: ForwardRefRenderFunction<any, Props> = (
  { recordedTaxa, onSpeciesSelected },
  ref
) => {
  const localRef = createRef<any>();
  const input = (ref as RefObject<any>) || localRef;

  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any>(null);

  useEffect(() => {
    SpeciesSearchEngine.init();
  }, []);

  const onInputKeystroke = async (e: any) => {
    let newSearchPhrase = e.target.value;

    const isValidSearch =
      typeof newSearchPhrase === 'string' &&
      newSearchPhrase.length >= MIN_SEARCH_LENGTH;
    if (!isValidSearch) {
      setSearchPhrase('');
      setSearchResults(null);
      return;
    }

    newSearchPhrase = newSearchPhrase.toLowerCase();

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
    if (input.current) {
      input.current.setFocus();
    }
  }, [input]);

  return (
    <>
      <IonSearchbar
        id="taxon"
        ref={input}
        placeholder="Species name"
        debounce={300}
        onIonChange={onInputKeystroke}
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
