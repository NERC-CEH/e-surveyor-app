import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import { searchOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import { Button, Main, useLoader } from '@flumens';
import { IonIcon, NavContext } from '@ionic/react';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import PhotoPicker from 'common/Components/PhotoPickers/PhotoPicker';
import SpeciesCard from 'common/Components/SpeciesCard';
import { filterUKSpecies } from 'common/services/helpers';
import Occurrence, { Suggestion, Taxon } from 'models/occurrence';
import { MachineInvolvement } from 'Survey/common/config';
import './styles.scss';

type Props = {
  occurrence: Occurrence;
  onReidentify?: any;
};

const EditSpeciesMain = ({ occurrence, onReidentify }: Props) => {
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
    const setSpeciesAsMain = ({ commonNames, ...sp }: Suggestion) => {
      const taxon = JSON.parse(JSON.stringify(sp));

      const topSuggestion = occurrence.getSpecies()?.suggestions?.[0];
      const isTopSuggestion =
        topSuggestion?.scientificName === sp.scientificName;

      const machineInvolvement = isTopSuggestion
        ? MachineInvolvement.HUMAN_ACCEPTED_PREFERRED
        : MachineInvolvement.HUMAN_ACCEPTED_LESS_PREFERRED;

      const newTaxon: Taxon = {
        ...occurrence.getSpecies(),
        ...taxon,
        commonName: commonNames?.[0],
        machineInvolvement,
        score: 1,
      };

      // eslint-disable-next-line no-param-reassign
      occurrence.attrs.taxon = newTaxon;
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
        images: sp.images,
        tvk: '',
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

  const navigateToSearch = () => navigate(`${match.url}/taxon`);

  const identifying = occurrence.isIdentifying();
  const hasNoSpecies = !occurrence.getSpecies();

  const identifyButton = onReidentify && (
    <Button
      onPress={onReidentify}
      color="secondary"
      preventDefault
      className={clsx('mx-auto my-3 w-fit', isIdentifying ? 'opacity-30' : '')}
    >
      Reidentify
    </Button>
  );

  return (
    <Main id="edit-species">
      <div className="species-main-image-wrapper mx-auto -mt-1 max-w-xl">
        <PhotoPicker
          model={occurrence}
          placeholderCount={1}
          isDisabled={isDisabled}
          allowToCrop
        />
      </div>

      {identifyButton}

      <div className="mx-auto flex max-w-xl flex-col gap-5 p-3">
        {!identifying && hasNoSpecies && (
          <InfoBackgroundMessage>
            <div>Sorry, we couldn't find any species 😕</div>
          </InfoBackgroundMessage>
        )}

        {getSelectedSpecies()}

        {getAIResults()}

        {isPartOfSurvey && !isDisabled && (
          <Button
            onPress={navigateToSearch}
            className="mx-auto mt-6 text-sm"
            prefix={<IonIcon className="size-6" src={searchOutline} />}
          >
            Search Species
          </Button>
        )}
      </div>
    </Main>
  );
};

export default observer(EditSpeciesMain);
