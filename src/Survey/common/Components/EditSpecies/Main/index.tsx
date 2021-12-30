import React, { FC, useContext } from 'react';
import { Main } from '@flumens';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router-dom';
import SpeciesCard from 'common/Components/SpeciesCard';
import { IonButton, IonList, IonIcon, NavContext } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import Sample from 'models/sample';
// eslint-disable-next-line import/named
import { Species } from 'models/occurrence';
import './styles.scss';

type Props = {
  sample: typeof Sample;
  isDisabled: boolean;
};

const EditSpeciesMain: FC<Props> = ({ sample, isDisabled }) => {
  const { navigate } = useContext(NavContext);
  const match = useRouteMatch();

  const showSelectedSpecies = () => {
    const { taxon: sp } = sample.occurrences[0].attrs;
    const selectedSpeciesByUser = !sp.gbif.id || !!sp.scoreFromAPI;

    return (
      <SpeciesCard species={sp} selectedSpeciesByUser={selectedSpeciesByUser} />
    );
  };

  const showAIResults = () => {
    const getTaxon = (sp: Species) => {
      const taxon = JSON.parse(JSON.stringify(sp));
      taxon.scoreFromAPI = sp.score;
      taxon.score = 1;

      return taxon;
    };

    const setSpeciesAsMain = (sp: Species) => {
      sample.setSpecies(getTaxon(sp));
      sample.save();
    };

    const getSpeciesCard = (sp: Species) => {
      const onSelectWrap = () => setSpeciesAsMain(sp);

      return (
        <SpeciesCard
          key={sp.score}
          species={sp}
          onSelect={!isDisabled ? onSelectWrap : null}
        />
      );
    };

    const species = sample.getAISuggestions() || [];
    const { taxon } = sample.occurrences[0].attrs;

    const nonSelectedSpecies = (sp: Species) =>
      sp.species.commonNames[0] !== taxon.species.commonNames[0];

    return species.filter(nonSelectedSpecies).map(getSpeciesCard);
  };

  const speciesAddButton = () => {
    if (isDisabled) {
      return null;
    }

    const navigateToSearch = () => navigate(`${match.url}/taxon`);

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

  const showSpeciesMainPhoto = () => {
    const { media } = sample.occurrences[0];
    if (!media.length) {
      return (
        <div className="species-main-image-wrapper">
          <div className="species-main-image-empty">Image does not exist</div>
        </div>
      );
    }

    const image = media[0];
    const showImage = image.getURL();

    return (
      <div className="species-main-image-wrapper">
        <img src={showImage} className="species-main-image" />
      </div>
    );
  };

  return (
    <Main id="edit-species">
      {showSpeciesMainPhoto()}

      <div className="species-wrapper">
        {showSelectedSpecies()}

        {showAIResults()}

        {speciesAddButton()}
      </div>
    </Main>
  );
};

export default observer(EditSpeciesMain);
