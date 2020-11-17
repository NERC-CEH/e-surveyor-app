import { observer } from 'mobx-react';
import React from 'react';
import {
  IonItem,
  IonItemDivider,
  IonLabel,
  IonIcon,
  IonList,
  IonButton,
  IonSpinner,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from '@ionic/react';
import { Main, alert, MenuAttrItem } from '@apps';
import {
  camera,
  checkmarkCircle,
  helpCircle,
  closeCircle,
  bookmarkOutline,
} from 'ionicons/icons';
import PropTypes from 'prop-types';
import config from 'config';
import Seeds from 'common/images/seeds.svg';
import './styles.scss';
import 'ionicons/dist/svg/checkmark-circle-outline.svg';
import 'ionicons/dist/svg/help-circle-outline.svg';
import 'ionicons/dist/svg/close-circle-outline.svg';

const { POSITIVE_THRESHOLD, POSSIBLE_THRESHOLD } = config;

function deletePhoto(image) {
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

@observer
class Component extends React.Component {
  static propTypes = {
    sample: PropTypes.object.isRequired,
    onPhotoAdd: PropTypes.func.isRequired,
  };

  photoUpload = e => {
    const onPhotoAddWrap = photo => this.props.onPhotoAdd(photo);

    e.target.files.forEach(onPhotoAddWrap);
  };

  showIdentificationStatuses = () => {
    alert({
      skipTranslation: true,
      message: (
        <>
          <IonItem className="id-green">
            <IonIcon src="/images/checkmark-circle-outline.svg" />
            <IonLabel position="stacked" mode="ios">
              <IonLabel>Positive Identification</IonLabel>
              <IonLabel>
                <small>Over {POSITIVE_THRESHOLD * 100}% confidence</small>
              </IonLabel>
            </IonLabel>
          </IonItem>

          <IonItem className="id-amber">
            <IonIcon src="/images/help-circle-outline.svg" />
            <IonLabel position="stacked" mode="ios">
              <IonLabel>Possible Identification</IonLabel>
              <IonLabel>
                <small>Over {POSSIBLE_THRESHOLD * 100}% confidence</small>
              </IonLabel>
            </IonLabel>
          </IonItem>

          <IonItem className="id-red">
            <IonIcon src="/images/close-circle-outline.svg" />
            <IonLabel position="stacked" mode="ios">
              <IonLabel>Not Found</IonLabel>
              <IonLabel>
                <small>Less than {POSSIBLE_THRESHOLD * 100}% confidence</small>
              </IonLabel>
            </IonLabel>
          </IonItem>
        </>
      ),

      buttons: [{ text: 'OK', role: 'cancel', cssClass: 'secondary' }],
    });
  };

  getImage = media => {
    const { identifying } = media.identification;
    const { species } = media.attrs;

    let commonName;
    let scientificName;
    let idClass;
    let detailIcon;

    if (species) {
      scientificName = species.scientificNameWithoutAuthor;
      [commonName] = species.commonNames;

      if (species.score > POSITIVE_THRESHOLD) {
        idClass = 'id-green';
        detailIcon = checkmarkCircle;
      } else if (species.score > POSSIBLE_THRESHOLD) {
        idClass = 'id-amber';
        detailIcon = helpCircle;
      } else {
        idClass = 'id-red';
        detailIcon = closeCircle;
      }
    }

    if (!species && !identifying) {
      scientificName = 'Not found';
      idClass = 'id-red';
      detailIcon = closeCircle;
    }

    const deletePhotoWrap = () => deletePhoto(media);

    return (
      <IonItemSliding className="species-list-item" key={media.cid}>
        <IonItem
          detail
          detailIcon={detailIcon}
          className={idClass}
          onClick={this.showIdentificationStatuses}
        >
          <div className="photo">
            <img src={media.getURL()} />
          </div>

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
            <IonSpinner slot="end" className="media-identifying" />
          )}
        </IonItem>
        <IonItemOptions side="end">
          <IonItemOption color="danger" onClick={deletePhotoWrap}>
            Delete
          </IonItemOption>
        </IonItemOptions>
      </IonItemSliding>
    );
  };

  getImages = () => {
    const { sample } = this.props;

    if (!sample.media.length) {
      return (
        <IonList lines="full">
          <IonItem className="empty">
            <span>Your species list is empty.</span>
          </IonItem>
        </IonList>
      );
    }

    const reversedMediaList = [...sample.media].reverse();
    return reversedMediaList.map(this.getImage);
  };

  getNewImageButton = () => (
    <IonButton className="img-picker" type="submit" expand="block">
      <IonIcon slot="start" icon={camera} size="large" />
      Plant
      <input
        type="file"
        accept="image/*"
        onChange={this.photoUpload}
        multiple
      />
    </IonButton>
  );

  render() {
    const { sample } = this.props;

    const { seedmixgroup, seedmix, name } = sample.attrs;

    const baseURL = `/survey/${sample.cid}/edit`;

    return (
      <Main>
        <IonList lines="full">
          <MenuAttrItem
            routerLink={`${baseURL}/name`}
            icon={bookmarkOutline}
            label="Name"
            value={name}
          />

          <IonItemDivider mode="ios">Seedmix</IonItemDivider>
          <MenuAttrItem
            routerLink={`${baseURL}/seedmixgroup`}
            icon={Seeds}
            label="Supplier"
            value={seedmixgroup}
          />

          <MenuAttrItem
            routerLink={`${baseURL}/seedmix`}
            icon={Seeds}
            label="Name"
            value={seedmix}
            styles="opacity:0.8"
            disabled={!seedmixgroup}
          />
        </IonList>

        {this.getNewImageButton()}

        {this.getImages()}
      </Main>
    );
  }
}

export default Component;
