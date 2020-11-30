import React from 'react';
import { Main } from '@apps';
import PropTypes from 'prop-types';
import SpeciesCard from 'common/Components/SpeciesCard';
// import { IonButton, IonList, IonIcon } from '@ionic/react';
// import { addOutline } from 'ionicons/icons';
import './styles.scss';

export default class MainComponent extends React.Component {
  static propTypes = {
    sample: PropTypes.object.isRequired,
  };

  getSpeciesCard = sp => (
    <SpeciesCard
      key={sp.gbif.id}
      species={sp}
      onSpeciesImageClicked={this.onSpeciesImageClicked}
    />
  );

  showPlantList = () => {
    const { sample } = this.props;
    const species = sample.getAllSpecies();

    return species.map(this.getSpeciesCard);
  };

  // getSpeciesAddButton = () => {
  //   const navigateToSearch = () => {
  //     return null;
  //   };

  //   return (
  //     <IonList>
  //       <IonButton
  //         mode="md"
  //         onClick={navigateToSearch}
  //         fill="outline"
  //         className="footer"
  //       >
  //         <IonIcon slot="start" src={addOutline} />
  //         Add Plant
  //       </IonButton>
  //     </IonList>
  //   );
  // };

  render() {
    const { sample } = this.props;
    const speciesImage = sample.occurrences[0].media[0].attrs.data;

    const style = {
      backgroundImage: `url(${speciesImage})`,
    };

    return (
      <Main id="edit-species">
        <div style={style} className="species-main-image" alt="species" />

        {this.showPlantList()}
      </Main>
    );
  }
}
