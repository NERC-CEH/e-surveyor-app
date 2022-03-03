import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { IonSpinner, IonLabel } from '@ionic/react';
import SpeciesCard from 'Components/SpeciesCard';
import Occurrence from 'models/occurrence';
import { Species } from 'models/image.d';
import './styles.scss';

interface Props {
  occurrence?: typeof Occurrence;
}

const SpeciesProfile: FC<Props> = ({ occurrence }) => {
  if (!occurrence) return null;

  const getPlantList = () => {
    const getSpeciesCard = (sp: Species) => (
      <SpeciesCard key={sp.gbif?.id} species={sp} />
    );

    if (
      !occurrence.media[0].attrs.species ||
      !occurrence.media[0].attrs.species.length
    ) {
      return null;
    }

    return occurrence.media[0].attrs.species.map(getSpeciesCard);
  };

  const getIDLoader = () => {
    const identifying = occurrence.isIdentifying();

    if (!identifying) {
      const hasNoSpecies =
        !occurrence.media[0].attrs.species ||
        !occurrence.media[0].attrs.species.length;
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
      <img
        className="species-main-image"
        src={occurrence.media[0].getURL()}
        alt="species"
      />

      {getIDLoader()}

      {getPlantList()}
    </div>
  );
};

export default observer(SpeciesProfile);
