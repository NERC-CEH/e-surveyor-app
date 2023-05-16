import { FC, useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { searchOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import { Main, useLoader } from '@flumens';
import {
  IonButton,
  IonList,
  IonIcon,
  NavContext,
  IonLabel,
} from '@ionic/react';
import PhotoPicker from 'common/Components/PhotoPickers/PhotoPicker';
import SpeciesCard from 'common/Components/SpeciesCard';
import { filterUKSpecies } from 'common/services/helpers';
import Occurrence, { Suggestion, Taxon } from 'models/occurrence';
import { MachineInvolvement } from 'Survey/common/config';
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
    const sp = occurrence.getSpecies();
    if (!sp) return null;

    const setByUser = sp.machineInvolvement === MachineInvolvement.HUMAN;
    const isLegacy = !!(sp as any).scoreFromAPI; // scoreFromAPI - backwards compatible
    const selectedSpeciesByUser = !sp.gbif?.id || setByUser || isLegacy;

    return (
      <SpeciesCard species={sp} selectedSpeciesByUser={selectedSpeciesByUser} />
    );
  };

  const getAIResults = () => {
    const setSpeciesAsMain = (sp: Suggestion) => {
      const taxon = JSON.parse(JSON.stringify(sp));

      const topSuggestion = occurrence.getSpecies()?.suggestions?.[0];
      const isTopSuggestion =
        topSuggestion?.scientificName === sp.scientificName;

      const machineInvolvement = isTopSuggestion
        ? MachineInvolvement.HUMAN_ACCEPTED_PREFERRED
        : MachineInvolvement.HUMAN_ACCEPTED_LESS_PREFERRED;

      // eslint-disable-next-line no-param-reassign
      occurrence.attrs.taxon = {
        ...occurrence.getSpecies(),
        ...taxon,
        machineInvolvement,
        score: 1,
      };
      occurrence.save();
    };

    const getSpeciesCard = (sp: Suggestion) => {
      const lowScore = sp.score <= 0.01; // 1%
      if (lowScore) return null;

      const onSelectWrap = () => setSpeciesAsMain(sp);

      const suggestionAsTaxon: Taxon = {
        score: sp.score,
        warehouseId: sp.warehouseId,
        commonName: sp.commonNames[0],
        scientificName: sp.scientificName,
      };

      return (
        <SpeciesCard
          key={sp.warehouseId}
          species={suggestionAsTaxon}
          onSelect={!isDisabled && isPartOfSurvey ? onSelectWrap : null}
        />
      );
    };

    const taxon = occurrence.getSpecies();
    const suggestions = taxon?.suggestions;
    if (!suggestions?.length) return [];

    const UKSuggestions = filterUKSpecies(suggestions);

    const nonSelectedSpecies = (sp: Suggestion) =>
      taxon && sp.commonNames[0] !== taxon.commonName;

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
      const hasNoSpecies = !occurrence.getSpecies();
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
