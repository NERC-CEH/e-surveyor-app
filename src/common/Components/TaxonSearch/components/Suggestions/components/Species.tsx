import { IonItem } from '@ionic/react';
import { Species } from '../../../index';
import Difficulty from './Difficulty';
import './styles.scss';

const onClick = (e: any, species: Species, onSelect: any) => {
  const edit = e.target.tagName === 'BUTTON';

  onSelect(species, edit);
};

/**
 * Highlight the searched parts of taxa names.
 * @param name
 * @param searchPhrase
 * @returns {*}
 * @private
 */
function prettifyName(species: Species, searchPhrase: string) {
  const name = species[species.foundInName] as string;

  const searchPos = name.toLowerCase().indexOf(searchPhrase);
  if (!(searchPos >= 0)) {
    return name;
  }
  return (
    <>
      {name.slice(0, searchPos)}
      <b>{name.slice(searchPos, searchPos + searchPhrase.length)}</b>
      {name.slice(searchPos + searchPhrase.length)}
    </>
  );
}

type Props = {
  species: Species & { isRecorded?: boolean };
  searchPhrase: any;
  onSelect: (species: Species, edit: boolean) => void;
};

const SpeciesItem = ({ species, searchPhrase, onSelect }: Props) => {
  const prettyName = prettifyName(species, searchPhrase);
  const { isRecorded } = species;

  const foundInCommonName = species.foundInName === 'commonName';
  const commonName = foundInCommonName ? prettyName : species.commonName;
  const scientificName = !foundInCommonName
    ? prettyName
    : species.scientificName;

  const onClickWrap = (e: any) => !isRecorded && onClick(e, species, onSelect);

  const hasDifficulty = species.difficulty! > 1;

  return (
    <IonItem
      className={`search-result ${isRecorded ? 'recorded' : ''}`}
      onClick={onClickWrap}
    >
      <div className="flex w-full items-center gap-2">
        <div className="flex w-full flex-col gap-1 px-0 py-2">
          <div>{commonName}</div>
          <i>{scientificName}</i>
        </div>
        {hasDifficulty && <Difficulty difficulty={species.difficulty} />}
      </div>
    </IonItem>
  );
};

export default SpeciesItem;
