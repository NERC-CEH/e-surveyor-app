import { FC } from 'react';
import { observer } from 'mobx-react';
import {
  checkmarkCircle,
  helpCircle,
  closeCircle,
  earth,
  leaf,
} from 'ionicons/icons';
import {
  IonItemSliding,
  IonItem,
  IonLabel,
  IonItemOptions,
  IonItemOption,
  IonIcon,
} from '@ionic/react';
import config from 'common/config';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';

type Props = {
  model: Sample | Occurrence;
  isDisabled: boolean;
  onDelete?: (model: Sample | Occurrence) => void;
  onClick: (model: Sample | Occurrence) => void;
};

const { POSITIVE_THRESHOLD, POSSIBLE_THRESHOLD } = config;

const Species: FC<Props> = ({ model, isDisabled, onDelete, onClick }) => {
  const species = model.getSpecies();
  const occ = model instanceof Occurrence ? model : model.occurrences[0];

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
    scientificName = species.scientificName;
    commonName = species.commonName;
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

  const deleteWrap = () => onDelete && onDelete(model);
  const onClickWrap = () => onClick(model);

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
    <IonItemSliding className="species-list-item" key={model.cid}>
      <IonItem
        detail
        detailIcon={detailsIcon}
        className={idClass}
        onClick={onClickWrap}
      >
        {profilePhoto}

        {getSpeciesName()}
      </IonItem>

      {!isDisabled && onDelete && (
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
