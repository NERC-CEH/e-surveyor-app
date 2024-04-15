import { FC, useState } from 'react';
import { observer } from 'mobx-react';
import {
  checkmarkCircle,
  helpCircle,
  closeCircle,
  earth,
  leaf,
} from 'ionicons/icons';
import { Gallery } from '@flumens';
import {
  IonItemSliding,
  IonItem,
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
  let speciesPhoto: any;

  const { media } = occ;
  if (media.length) {
    const photo = media[0];
    speciesPhoto = photo.attrs ? photo.getURL() : null;
  }

  const [showingGallery, setShowGallery] = useState(false);
  const showGallery = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setShowGallery(true);
  };
  const hideGallery = () => setShowGallery(false);

  const getGallery = () => {
    if (!speciesPhoto) return null;

    return (
      <Gallery
        isOpen={showingGallery}
        items={[
          {
            src: speciesPhoto,
          },
        ]}
        initialSlide={0}
        onClose={hideGallery}
      />
    );
  };

  if (species) {
    scientificName = species.scientificName;
    commonName = species.commonName;
    notFoundInUK = !species.warehouseId;

    const earthIcon = notFoundInUK ? earth : checkmarkCircle;

    if (species.score > POSITIVE_THRESHOLD) {
      idClass = '[--detail-icon-color:var(--id-positive-color)]';
      detailIcon = earthIcon;
    } else if (species.score > POSSIBLE_THRESHOLD) {
      idClass = '[--detail-icon-color:var(--id-possible-color)]';
      detailIcon = helpCircle;
    } else {
      idClass = '[--detail-icon-color:var(--id-rejected-color)]';
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
    <img src={speciesPhoto} onClick={showGallery} />
  ) : (
    <IonIcon icon={leaf} />
  );
  const profilePhoto = <div className="list-avatar">{photo}</div>;

  const getSpeciesName = () => {
    return (
      <div className="flex flex-col">
        {commonName && <div className="font-semibold">{commonName}</div>}
        <div className="italic">{scientificName}</div>
      </div>
    );
  };

  return (
    <IonItemSliding key={model.cid}>
      <IonItem
        detail
        detailIcon={detailsIcon}
        className={`[--detail-icon-opacity:1] [--padding-start:0px] ${idClass}`}
        onClick={onClickWrap}
      >
        <div className="flex items-center gap-2 p-1">
          {profilePhoto}

          {getSpeciesName()}
        </div>
      </IonItem>

      {!isDisabled && onDelete && (
        <IonItemOptions side="end">
          <IonItemOption color="danger" onClick={deleteWrap}>
            Delete
          </IonItemOption>
        </IonItemOptions>
      )}
      {getGallery()}
    </IonItemSliding>
  );
};

export default observer(Species);
