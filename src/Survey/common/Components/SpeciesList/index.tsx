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
  IonButton,
} from '@ionic/react';
import { useAlert, useToast, device } from '@flumens';
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
  const toast = useToast();

  const getProfile = (subSample: typeof Sample) => {
    const species = subSample.getSpecies();
    const [occ] = subSample.occurrences;

    let commonName: string;
    let scientificName: string;
    let idClass;
    let detailIcon;
    let notFoundInUK;
    const identifying = occ.isIdentifying();
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
        idClass = 'id-green';
        detailIcon = earthIcon;
      } else if (species.score > POSSIBLE_THRESHOLD) {
        idClass = 'id-amber';
        detailIcon = helpCircle;
      } else {
        idClass = 'id-red';
        detailIcon = closeCircle;
      }

      const speciesDoesNotExist = species.score === 0;

      if (speciesDoesNotExist && !identifying) {
        scientificName = 'Not found';
        idClass = 'id-red';
        detailIcon = closeCircle;
      }
    }

    const deletePhotoWrap = () => deletePhoto(alert, subSample);

    const detailsIcon = detailIcon || '';

    const getProfilePhoto = (pic?: string) => {
      const photo = pic ? <img src={pic} /> : <IonIcon icon={leaf} />;

      return <div className="plant-photo-profile">{photo}</div>;
    };
    const profilePhoto = getProfilePhoto(speciesPhoto);

    const link = `${match.url}/species/${subSample.cid}`;

    const getSpeciesName = () => {
      if (identifying) return null;

      if (!species)
        return (
          <IonLabel text-wrap>
            <IonLabel className="long" slot="start" color="warning">
              <b>Unkown species</b>
            </IonLabel>
          </IonLabel>
        );

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

    const onIdentify = (e: any) => {
      e.preventDefault();
      e.stopPropagation();

      if (!device.isOnline()) {
        toast.warn("Sorry, looks like you're offline.");
        return;
      }

      occ.identify();
    };

    const canBeIdentified = !identifying && occ.canReIdentify() && !species;
    return (
      <IonItemSliding className="species-list-item" key={subSample.cid}>
        <IonItem detailIcon={detailsIcon} className={idClass} routerLink={link}>
          {profilePhoto}

          {getSpeciesName()}

          {identifying && (
            <IonLabel className="long identifying" slot="end">
              Identifying
            </IonLabel>
          )}

          {canBeIdentified && (
            <IonButton
              slot="end"
              class="occurrence-identify"
              color="secondary"
              onClick={onIdentify}
              // fill={uploadIsPrimary ? undefined : 'outline'}
            >
              Identify
            </IonButton>
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
    <IonList lines="full">
      <div className="rounded">{list}</div>
    </IonList>
  );
};

export default observer(SpeciesList);
