/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import { Main } from '@apps';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { IonSpinner } from '@ionic/react';
import SpeciesCard from 'common/Components/SpeciesCard';
import './styles.scss';

@observer
class Component extends React.Component {
  static propTypes = {
    species: PropTypes.object.isRequired,
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

    if (!species.attrs.species) {
      return null;
    }

    return species.attrs.species.map(this.getSpeciesCard);
  };

  render() {
    const { species } = this.props;
    const { identifying } = species.identification;

    return (
      <>
        <Main id="species-profile" className="ion-padding">
          <img
            className="species-main-image"
            src={species.attrs.data}
            alt="species"
          />

          {identifying && <IonSpinner className="centered" />}

          {this.showPlantList()}
        </Main>
      </>
    );
  }
}

export default Component;
