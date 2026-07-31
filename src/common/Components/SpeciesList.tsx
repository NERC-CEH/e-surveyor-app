import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { searchOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import { Button, useLoader } from '@flumens';
import { IonIcon, NavContext } from '@ionic/react';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import SpeciesCard from 'common/Components/SpeciesCard';
import { Suggestion, Taxon } from 'models/occurrence';
import { MachineInvolvement } from 'Survey/common/config';

type Props = {
  isDisabled?: boolean;
  isIdentifying?: boolean;
  taxon?: Taxon;
  onSelect?: (sp: Suggestion) => void;
};

const EditSpeciesMain = ({
  isDisabled: isDisabledProp,
  isIdentifying,
  taxon,
  onSelect,
}: Props) => {
  const { navigate } = useContext(NavContext);
  const match = useRouteMatch();
  const loader = useLoader();

  const isDisabled = !onSelect || isDisabledProp;

  useEffect(() => {
    if (!loader) return;

    if (isIdentifying) {
      loader.show('Please wait...');
      return;
    }

    loader.hide();
  }, [loader, isIdentifying]);

  const getSelectedSpecies = () => {
    if (!taxon) return null;

    const setByUser =
      taxon.machineInvolvement === MachineInvolvement.HUMAN ||
      taxon.machineInvolvement ===
        MachineInvolvement.HUMAN_ACCEPTED_PREFERRED ||
      taxon.machineInvolvement ===
        MachineInvolvement.HUMAN_ACCEPTED_LESS_PREFERRED;

    const selectedSpeciesByUser = !taxon.images || setByUser;

    return (
      <SpeciesCard
        species={taxon}
        selectedSpeciesByUser={selectedSpeciesByUser}
      />
    );
  };

  const getAIResults = () => {
    const getSpeciesCard = (sp: Suggestion) => {
      const lowScore = sp.probability <= 0.01; // 1%
      if (lowScore) return null;

      const onSelectWrap = () => onSelect?.(sp);

      const suggestionAsTaxon: Taxon = {
        ...sp,
        commonName: sp.commonNames[0],
      };

      return (
        <SpeciesCard
          key={sp.warehouseId}
          species={suggestionAsTaxon}
          onSelect={!isDisabled ? onSelectWrap : null}
        />
      );
    };

    const suggestions = taxon?.suggestions;
    if (!suggestions?.length) return [];

    const nonSelectedSpecies = (sp: Suggestion) =>
      taxon && sp.commonNames[0] !== taxon.commonName;

    return suggestions.filter(nonSelectedSpecies).map(getSpeciesCard);
  };

  const navigateToSearch = () => navigate(`${match.url}/taxon`);

  const hasNoSpecies = !taxon;

  if (!isIdentifying && hasNoSpecies)
    return (
      <InfoBackgroundMessage>
        <div>Sorry, we couldn't find any species 😕</div>
      </InfoBackgroundMessage>
    );

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5">
      {getSelectedSpecies()}

      {getAIResults()}

      {!isDisabled && (
        <Button
          onPress={navigateToSearch}
          className="mx-auto mt-6 text-sm"
          prefix={<IonIcon className="size-6" src={searchOutline} />}
        >
          Search Species
        </Button>
      )}
    </div>
  );
};

export default observer(EditSpeciesMain);
