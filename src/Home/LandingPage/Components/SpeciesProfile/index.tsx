import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { IonSpinner, IonLabel } from '@ionic/react';
import SpeciesCard from 'Components/SpeciesCard';
import Image from 'models/image';
import { Species } from 'models/image.d';
import './styles.scss';

interface Props {
  species?: typeof Image;
}

const SpeciesProfile: FC<Props> = ({ species: image }) => {
  if (!image) return null;

  const getPlantList = () => {
    const getSpeciesCard = (sp: Species) => (
      <SpeciesCard key={sp.gbif?.id} species={sp} />
    );

    if (!image.attrs.species || !image.attrs.species.length) {
      return null;
    }

    return image.attrs.species.map(getSpeciesCard);
  };

  const getIDLoader = () => {
    const { identifying } = image.identification;

    if (!identifying) {
      const hasNoSpecies = !image.attrs.species || !image.attrs.species.length;
      if (hasNoSpecies) {
        return (
          <div className="identifying">
            <IonLabel>
              <h2>
                <b>Sorry, we couldn't find any species 😕</b>
              </h2>
            </IonLabel>
          </div>
        );
      }

      return null;
    }

    return (
      <div className="identifying">
        <IonLabel>
          <h2>
            <b>Identifying...</b>
          </h2>
        </IonLabel>
        <IonSpinner color="primary" />
      </div>
    );
  };

  return (
    <div id="species-profile-contents">
      <img className="species-main-image" src={image.getURL()} alt="species" />

      {getIDLoader()}

      {getPlantList()}
    </div>
  );
};

export default observer(SpeciesProfile);
