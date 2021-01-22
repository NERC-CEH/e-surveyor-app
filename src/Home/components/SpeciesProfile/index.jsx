/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { IonSpinner, IonLabel } from '@ionic/react';
import SpeciesCard from 'common/Components/SpeciesCard';
import './styles.scss';

@observer
class Component extends React.Component {
  static propTypes = {
    species: PropTypes.object,
  };

  getSpeciesCard = sp => (
    <SpeciesCard
      key={sp.gbif.id}
      species={sp}
      onSpeciesImageClicked={this.onSpeciesImageClicked}
    />
  );

  showPlantList = () => {
    const { species } = this.props;

    if (!species.attrs.species || !species.attrs.species.length) {
      return null;
    }

    return species.attrs.species.map(this.getSpeciesCard);
  };

  getIDLoader = () => {
    const { species } = this.props;
    const { identifying } = species.identification;

    if (!identifying) {
      const hasNoSpecies =
        !species.attrs.species || !species.attrs.species.length;
      if (hasNoSpecies) {
        return (
          <div className="identifying centered">
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
      <div className="identifying centered">
        <IonLabel>
          <h2>
            <b>Identifying...</b>
          </h2>
        </IonLabel>
        <IonSpinner color="primary" />
      </div>
    );
  };

  render() {
    const { species: image } = this.props;

    return (
      <div id="species-profile-contents">
        <img
          className="species-main-image"
          src={image.getURL()}
          alt="species"
        />

        {this.getIDLoader()}

        {this.showPlantList()}
      </div>
    );
  }
}

export default Component;
