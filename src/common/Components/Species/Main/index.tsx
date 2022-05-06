import React, { FC, useContext, useEffect } from 'react';
import { Main, useLoader } from '@flumens';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router-dom';
import SpeciesCard from 'common/Components/SpeciesCard';
import {
  IonButton,
  IonList,
  IonIcon,
  NavContext,
  IonLabel,
} from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import PhotoPicker from 'common/Components/PhotoPicker';
import Occurrence, { Taxon } from 'models/occurrence';
import { filterUKSpecies } from 'common/services/plantNet';
import './styles.scss';

type Props = {
  occurrence: Occurrence;
};

const EditSpeciesMain: FC<Props> = ({ occurrence }) => {
  const { navigate } = useContext(NavContext);
  const match = useRouteMatch();
  const loader = useLoader();

  const isPartOfSurvey = occurrence.parent;
  const isDisabled = isPartOfSurvey && occurrence.isDisabled();

  const isIdentifying = occurrence.isIdentifying();

  useEffect(() => {
    if (!loader) return;

    if (occurrence.isIdentifying()) {
      loader.show('Please wait...');
      return;
    }

    loader.hide();
  }, [loader, isIdentifying]);

  const getSelectedSpecies = () => {
    const { taxon: sp } = occurrence.attrs;
    if (!sp) return null;

    const selectedSpeciesByUser =
      !sp.gbif?.id || sp.isUserSet || !!(sp as any).scoreFromAPI; // scoreFromAPI - backwards compatible

    return (
      <SpeciesCard species={sp} selectedSpeciesByUser={selectedSpeciesByUser} />
    );
  };

  const getAIResults = () => {
    const getTaxon = (sp: Taxon) => {
      const taxon = JSON.parse(JSON.stringify(sp));
      taxon.isUserSet = true;
      taxon.score = 1;

      return taxon;
    };

    const setSpeciesAsMain = (sp: Taxon) => {
      // eslint-disable-next-line no-param-reassign
      occurrence.attrs.taxon = {
        ...occurrence.attrs.taxon,
        ...getTaxon(sp),
      };
      occurrence.save();
    };

    const getSpeciesCard = (sp: Taxon) => {
      const onSelectWrap = () => setSpeciesAsMain(sp);

      if (sp.score <= 0.01) return null; // 1%

      return (
        <SpeciesCard
          key={sp.warehouseId}
          species={sp}
          onSelect={!isDisabled && isPartOfSurvey ? onSelectWrap : null}
        />
      );
    };

    const { taxon } = occurrence.attrs;
    const suggestions = taxon?.suggestions;
    if (!suggestions?.length) return [];

    const UKSuggestions = filterUKSpecies(suggestions);

    const nonSelectedSpecies = (sp: Taxon) =>
      taxon && sp.species.commonNames[0] !== taxon.species.commonNames[0];

    return UKSuggestions.filter(nonSelectedSpecies).map(getSpeciesCard);
  };

  const getSpeciesAddButton = () => {
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

  const showSpeciesMainPhoto = () => (
    <div className="species-main-image-wrapper">
      <div className="rounded">
        <PhotoPicker
          model={occurrence}
          placeholderCount={1}
          isDisabled={isDisabled}
          allowToCrop
        />
      </div>
    </div>
  );

  const getUnknownSpeciesMessage = () => {
    const identifying = occurrence.isIdentifying();

    if (!identifying) {
      const hasNoSpecies = !occurrence.attrs.taxon;
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
    }

    return null;
  };

  return (
    <>
      <Main id="edit-species">
        {showSpeciesMainPhoto()}

        <IonList className="species-wrapper">
          {getUnknownSpeciesMessage()}

          {getSelectedSpecies()}

          {getAIResults()}

          {isPartOfSurvey && getSpeciesAddButton()}
        </IonList>
      </Main>
    </>
  );
};

export default observer(EditSpeciesMain);
