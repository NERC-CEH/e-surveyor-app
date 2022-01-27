import { observer } from 'mobx-react';
import React, { FC } from 'react';
import {
  IonItem,
  IonLabel,
  IonIcon,
  IonList,
  IonSpinner,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from '@ionic/react';
import { useAlert } from '@flumens';
import Sample from 'models/sample';
import { useRouteMatch } from 'react-router-dom';
import {
  checkmarkCircle,
  helpCircle,
  closeCircle,
  earth,
  leaf,
} from 'ionicons/icons';
import config from 'common/config';
import './styles.scss';

const { POSITIVE_THRESHOLD, POSSIBLE_THRESHOLD } = config;

function deletePhoto(alert: any, image: any) {
  alert({
    header: 'Delete',
    skipTranslation: true,
    message: 'Are you sure you want to remove the photo from your survey?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'primary',
      },
      {
        text: 'Delete',
        cssClass: 'danger',
        handler: () => image.destroy(),
      },
    ],
  });
}

type Props = {
  sample: typeof Sample;
  isDisabled: boolean;
};

const SpeciesList: FC<Props> = ({ sample, isDisabled }) => {
  const match = useRouteMatch();
  const alert = useAlert();

  const getProfile = (subSample: typeof Sample) => {
    const species = subSample.getSpecies();

    let commonName;
    let scientificName;
    let idClass;
    let detailIcon;
    let notFoundInUK;
    let identifying;
    let speciesPhoto;
    let link;

    const { media } = subSample.occurrences[0];
    if (media.length) {
      const photo = media[0];
      identifying = photo.isIdentifying();
      speciesPhoto = photo.attrs ? photo.getURL() : null;
    }

    if (species) {
      scientificName = species.species.scientificNameWithoutAuthor;
      [commonName] = species.species.commonNames;
      notFoundInUK = !species.warehouseId;

      const earthIcon = notFoundInUK ? earth : checkmarkCircle;
      const speciesDoesNotExist = species.score === 0;

      if (species.score > POSITIVE_THRESHOLD) {
        idClass = 'id-green';
        detailIcon = earthIcon;
      } else if (species.score > POSSIBLE_THRESHOLD) {
        idClass = 'id-amber';
        detailIcon = helpCircle;
      } else {
        idClass = 'id-red';
        detailIcon = closeCircle;
      }

      if (speciesDoesNotExist && !identifying) {
        scientificName = 'Not found';
        idClass = 'id-red';
        detailIcon = closeCircle;
      }

      link = speciesDoesNotExist
        ? undefined
        : `${match.url}/species/${subSample.cid}`;
    }

    const deletePhotoWrap = () => deletePhoto(alert, subSample);

    const detailsIcon = detailIcon || '';

    const getProfilePhoto = (pic?: string) => {
      const photo = pic ? <img src={pic} /> : <IonIcon icon={leaf} />;

      return <div className="plant-photo-profile">{photo}</div>;
    };
    const profilePhoto = getProfilePhoto(speciesPhoto);

    return (
      <IonItemSliding className="species-list-item" key={subSample.cid}>
        <IonItem
          detail
          detailIcon={detailsIcon}
          className={idClass}
          routerLink={link}
        >
          {profilePhoto}

          <IonLabel text-wrap>
            {commonName && (
              <IonLabel className="long" slot="end">
                <b>{commonName}</b>
              </IonLabel>
            )}
            <IonLabel className="long" slot="end">
              <i>{scientificName}</i>
            </IonLabel>
          </IonLabel>

          {identifying && (
            <IonLabel className="long identifying" slot="end">
              Identifying
            </IonLabel>
          )}

          {identifying && <IonSpinner slot="end" className="identifying" />}
        </IonItem>
        {!isDisabled && (
          <IonItemOptions side="end">
            <IonItemOption color="danger" onClick={deletePhotoWrap}>
              Delete
            </IonItemOption>
          </IonItemOptions>
        )}
      </IonItemSliding>
    );
  };

  const subSamples = [...sample.samples];

  if (!sample.samples.length) {
    return (
      <IonList>
        <IonItem className="empty">
          <span>Your species list is empty.</span>
        </IonItem>
      </IonList>
    );
  }

  const reversedSubSampleList = subSamples.reverse();
  const list = reversedSubSampleList.map(getProfile);

  return (
    <IonList>
      <div className="rounded">{list}</div>
    </IonList>
  );
};

export default observer(SpeciesList);
