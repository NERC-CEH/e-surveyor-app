import React from 'react';
import { Main } from '@apps';
import config from 'config';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import {
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonCardTitle,
  IonSpinner,
  IonIcon,
  IonItem,
  IonList,
} from '@ionic/react';
import { checkmarkCircle, helpCircle, closeCircle } from 'ionicons/icons';
import './styles.scss';

const { POSITIVE_THRESHOLD, POSSIBLE_THRESHOLD } = config;

@observer
class Component extends React.Component {
  getSpeciesInfo = () => {
    const { species } = this.props;

    if (!species.attrs.species) {
      if (!species.identification.identifying) {
        return (
          <IonList lines="full">
            <IonItem className="empty">
              <span>Sorry, we couldn't identify the species</span>
            </IonItem>
          </IonList>
        );
      }

      return null;
    }

    const taxon = species.attrs.species.scientificNameWithoutAuthor;
    const score = Number.parseFloat(species.attrs.species.score).toFixed(1);

    let commonName;
    let idClass;
    let detailIcon;

    if (
      species.attrs.species.commonNames &&
      species.attrs.species.commonNames.length
    ) {
      [commonName] = species.attrs.species.commonNames;
    }

    if (score > POSITIVE_THRESHOLD) {
      idClass = 'id-green';
      detailIcon = checkmarkCircle;
    } else if (score > POSSIBLE_THRESHOLD) {
      idClass = 'id-amber';
      detailIcon = helpCircle;
    } else {
      idClass = 'id-red';
      detailIcon = closeCircle;
    }

    return (
      <>
        <IonCardHeader>
          {commonName && <IonCardTitle>{commonName}</IonCardTitle>}
          <IonCardSubtitle>{taxon}</IonCardSubtitle>
        </IonCardHeader>

        {score && (
          <IonCardContent className={`score ${idClass}`}>
            <h3 className="species-label inline-label">Score:</h3>
            <span>{score * 100}%</span>
            <IonIcon icon={detailIcon} />
          </IonCardContent>
        )}
      </>
    );
  };

  render() {
    const { species } = this.props;
    const { identifying } = species.identification;

    return (
      <>
        <Main id="species-profile" className="ion-padding">
          <img src={species.attrs.data} alt="species" />

          {identifying && <IonSpinner className="centered" />}

          {this.getSpeciesInfo()}
        </Main>
      </>
    );
  }
}

Component.propTypes = {
  species: PropTypes.object.isRequired,
};

export default Component;
