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
  isPlatform,
  NavContext,
} from '@ionic/react';
import { Main, alert, MenuAttrItem, LongPressButton } from '@apps';
import {
  camera,
  checkmarkCircle,
  helpCircle,
  closeCircle,
  bookmarkOutline,
  locationOutline,
  searchCircleOutline,
  earth,
  leaf,
} from 'ionicons/icons';
import PropTypes from 'prop-types';
import config from 'config';
import Seeds from 'common/images/seeds.svg';
import GridRefValue from '../../GridRefValue';
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
  static contextType = NavContext;

  static propTypes = {
    sample: PropTypes.object.isRequired,
    onPhotoAdd: PropTypes.func.isRequired,
    photoSelectHybrid: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
  };

  onPhotoSelectBrowser = e => {
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

  getProfile = subSample => {
    const { match } = this.props;
    const species = subSample.getSpecies();
    const [photo] = subSample.occurrences[0].media;

    let commonName;
    let scientificName;
    let idClass;
    let detailIcon;
    let notFoundInUK;
    let identifying;
    let speciesPhoto;
    let link;

    if (photo) {
      identifying = photo.identification.identifying;
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

    const deletePhotoWrap = () => deletePhoto(subSample);

    const detailsIcon = detailIcon || null;

    const profilePhoto = this.getProfilePhoto(speciesPhoto);

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

  getProfilePhoto = speciesPhoto => {
    <img src={speciesPhoto} />;
    const photo = speciesPhoto ? (
      <img src={speciesPhoto} />
    ) : (
      <IonIcon icon={leaf} />
    );

    return <div className="photo">{photo}</div>;
  };

  getSpeciesProfiles = () => {
    const { sample } = this.props;

    const subSamples = [...sample.samples];

    if (!sample.samples.length) {
      return (
        <IonList lines="full">
          <IonItem className="empty">
            <span>Your species list is empty.</span>
          </IonItem>
        </IonList>
      );
    }

    const reversedSubSampleList = subSamples.reverse();
    return reversedSubSampleList.map(this.getProfile);
  };

  navigateToSearch = () => {
    const { match } = this.props;

    this.context.navigate(`${match.url}/taxon`);
  };

  getNewImageButton = photoSelectHybrid => {
    if (!isPlatform('hybrid')) {
      return (
        <>
          <IonButton className="img-picker" type="submit" expand="block">
            <IonIcon slot="start" icon={camera} size="large" />
            Plant
            <input
              type="file"
              accept="image/*"
              onChange={this.onPhotoSelectBrowser}
              multiple
            />
          </IonButton>

          <IonButton
            color="primary"
            id="add"
            className="img-picker"
            type="submit"
            expand="block"
            onClick={this.navigateToSearch}
          >
            <IonIcon slot="start" icon={searchCircleOutline} size="large" />
            Search
          </IonButton>
        </>
      );
    }

    return (
      <LongPressButton
        color="primary"
        id="add"
        onLongClick={this.navigateToSearch}
        className="img-picker"
        type="submit"
        expand="block"
        onClick={photoSelectHybrid}
      >
        <IonIcon slot="start" icon={camera} size="large" />
        Plant
      </LongPressButton>
    );
  };

  render() {
    const { sample, photoSelectHybrid } = this.props;

    const { seedmixgroup, seedmix, name } = sample.attrs;

    const prettyGridRef = <GridRefValue sample={sample} />;

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

          <MenuAttrItem
            routerLink={`${baseURL}/map`}
            value={prettyGridRef}
            icon={locationOutline}
            label="Location"
            skipValueTranslation
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

        {this.getNewImageButton(photoSelectHybrid)}

        {this.getSpeciesProfiles()}
      </Main>
    );
  }
}

export default Component;
