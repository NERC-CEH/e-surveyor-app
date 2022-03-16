import React, { FC } from 'react';
import {
  IonItemSliding,
  IonItem,
  IonLabel,
  IonItemOptions,
  IonItemOption,
  IonIcon,
} from '@ionic/react';
import { observer } from 'mobx-react';
import config from 'common/config';
import Sample from 'models/sample';
import {
  checkmarkCircle,
  helpCircle,
  closeCircle,
  earth,
  leaf,
} from 'ionicons/icons';

type Props = {
  sample: Sample;
  isDisabled: boolean;
  onDelete: (smp: Sample) => void;
  onClick: (smp: Sample) => void;
};

const { POSITIVE_THRESHOLD, POSSIBLE_THRESHOLD } = config;

const Species: FC<Props> = ({ sample, isDisabled, onDelete, onClick }) => {
  const species = sample.getSpecies();
  const [occ] = sample.occurrences;

  let commonName: string;
  let scientificName: string;
  let idClass;
  let detailIcon;
  let notFoundInUK;
  let speciesPhoto;

  const { media } = occ;
  if (media.length) {
    const photo = media[0];
    speciesPhoto = photo.attrs ? photo.getURL() : null;
  }

  if (species) {
    scientificName = species.species.scientificNameWithoutAuthor;
    [commonName] = species.species.commonNames;
    notFoundInUK = !species.warehouseId;

    const earthIcon = notFoundInUK ? earth : checkmarkCircle;

    if (species.score > POSITIVE_THRESHOLD) {
      idClass = 'id-icon-positive';
      detailIcon = earthIcon;
    } else if (species.score > POSSIBLE_THRESHOLD) {
      idClass = 'id-icon-possible';
      detailIcon = helpCircle;
    } else {
      idClass = 'id-icon-rejected';
      detailIcon = closeCircle;
    }

    const speciesDoesNotExist = species.score === 0;

    if (speciesDoesNotExist) {
      scientificName = 'Not found';
      idClass = 'id-red';
      detailIcon = closeCircle;
    }
  }

  const deleteWrap = () => onDelete(sample);
  const onClickWrap = () => onClick(sample);

  const detailsIcon = detailIcon || '';

  const photo = speciesPhoto ? (
    <img src={speciesPhoto} />
  ) : (
    <IonIcon icon={leaf} />
  );
  const profilePhoto = <div className="plant-photo-profile">{photo}</div>;

  const getSpeciesName = () => {
    return (
      <IonLabel text-wrap>
        {commonName && (
          <IonLabel className="long" slot="start">
            <b>{commonName}</b>
          </IonLabel>
        )}
        <IonLabel className="long" slot="start">
          <i>{scientificName}</i>
        </IonLabel>
      </IonLabel>
    );
  };

  return (
    <IonItemSliding className="species-list-item" key={sample.cid}>
      <IonItem
        detail
        detailIcon={detailsIcon}
        className={idClass}
        onClick={onClickWrap}
      >
        {profilePhoto}

        {getSpeciesName()}
      </IonItem>

      {!isDisabled && (
        <IonItemOptions side="end">
          <IonItemOption color="danger" onClick={deleteWrap}>
            Delete
          </IonItemOption>
        </IonItemOptions>
      )}
    </IonItemSliding>
  );
};

export default observer(Species);
