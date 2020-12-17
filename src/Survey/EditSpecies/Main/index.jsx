import React from 'react';
import { Main } from '@apps';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import SpeciesCard from 'common/Components/SpeciesCard';
import { IonButton, IonList, IonIcon, NavContext } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import './styles.scss';

@observer
class MainComponent extends React.Component {
  static contextType = NavContext;

  static propTypes = {
    sample: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

  getSpeciesCard = sp => {
    const onSelectWrap = () => this.setSpeciesAsMain(sp);

    return <SpeciesCard key={sp.score} species={sp} onSelect={onSelectWrap} />;
  };

  getTaxon = sp => {
    const taxon = JSON.parse(JSON.stringify(sp));
    taxon.scoreFromAPI = sp.score;
    taxon.score = 1;

    return taxon;
  };

  setSpeciesAsMain = sp => {
    const { sample } = this.props;

    sample.setSpecies(this.getTaxon(sp));
    sample.save();
  };

  showSelectedSpecies = () => {
    const { sample } = this.props;
    const { taxon: sp } = sample.occurrences[0].attrs;
    const selectedSpeciesByUser = !sp.gbif.id || sp.scoreFromAPI;

    return (
      <SpeciesCard species={sp} selectedSpeciesByUser={selectedSpeciesByUser} />
    );
  };

  showAIResults = () => {
    const { sample } = this.props;
    const species = sample.getAISuggestions() || [];
    const { taxon } = sample.occurrences[0].attrs;

    const nonSelectedSpecies = sp =>
      sp.species.commonNames[0] !== taxon.species.commonNames[0];

    return species.filter(nonSelectedSpecies).map(this.getSpeciesCard);
  };

  speciesAddButton = () => {
    const { match } = this.props;

    const navigateToSearch = () => this.context.navigate(`${match.url}/taxon`);

    return (
      <IonList className="species-add-button">
        <IonButton
          mode="md"
          onClick={navigateToSearch}
          fill="outline"
          className="footer"
        >
          <IonIcon slot="start" src={searchOutline} />
          Search Species
        </IonButton>
      </IonList>
    );
  };

  showSpeciesMainPhoto = () => {
    const { sample } = this.props;

    const image = sample.occurrences[0].media[0];

    if (!image) {
      return (
        <div className="species-main-image-wrapper">
          <div className="species-main-image-empty" alt="species">
            Image does not exist
          </div>
        </div>
      );
    }

    const showImage = image.getURL();

    const style = {
      backgroundImage: `url(${showImage})`,
    };

    return (
      <div className="species-main-image-wrapper">
        <div style={style} className="species-main-image" alt="species" />
      </div>
    );
  };

  render() {
    return (
      <Main id="edit-species">
        {this.showSpeciesMainPhoto()}

        <div className="species-wrapper">
          {this.showSelectedSpecies()}

          {this.showAIResults()}

          {this.speciesAddButton()}
        </div>
      </Main>
    );
  }
}

export default MainComponent;
