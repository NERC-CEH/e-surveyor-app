import React, { FC } from 'react';
import { IonItem } from '@ionic/react';
import './styles.scss';
import { Species } from '../../../index';

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
  const foundInName = species.found_in_name;

  const name = species[foundInName] as string;

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

const SpeciesItem: FC<Props> = ({ species, searchPhrase, onSelect }) => {
  const prettyName = prettifyName(species, searchPhrase);
  const { isRecorded } = species;

  const onClickWrap = (e: any) => !isRecorded && onClick(e, species, onSelect);
  return (
    <IonItem
      className={`search-result ${isRecorded ? 'recorded' : ''}`}
      onClick={onClickWrap}
    >
      <div className="taxon">{prettyName}</div>
    </IonItem>
  );
};

export default SpeciesItem;
