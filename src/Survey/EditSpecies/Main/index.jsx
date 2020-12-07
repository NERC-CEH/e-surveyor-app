import React from 'react';
import { Main } from '@apps';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import SpeciesCard from 'common/Components/SpeciesCard';
import { IonButton, IonList, IonIcon, NavContext } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
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
    taxon.scoreFromAPI = JSON.parse(JSON.stringify(sp.score));
    taxon.score = 1;

    return taxon;
  };

  setSpeciesAsMain = sp => {
    const { sample } = this.props;

    sample.occurrences[0].attrs.taxon = this.getTaxon(sp);
    sample.save();
  };

  showSelectedSpecies = () => {
    const { sample } = this.props;
    const { taxon: sp } = sample.occurrences[0].attrs;

    return <SpeciesCard species={sp} />;
  };

  showAIResults = () => {
    const { sample } = this.props;
    const species = sample.getAllSpecies();
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
          <IonIcon slot="start" src={addOutline} />
          Add Plant
        </IonButton>
      </IonList>
    );
  };

  render() {
    const { sample } = this.props;
    const speciesImage = sample.occurrences[0].media[0].attrs.data;

    const style = {
      backgroundImage: `url(${speciesImage})`,
    };

    return (
      <Main id="edit-species">
        <div className="species-main-image-wrapper">
          <div style={style} className="species-main-image" alt="species" />
        </div>

        {this.showSelectedSpecies()}

        {this.showAIResults()}

        {this.speciesAddButton()}
      </Main>
    );
  }
}

export default MainComponent;
