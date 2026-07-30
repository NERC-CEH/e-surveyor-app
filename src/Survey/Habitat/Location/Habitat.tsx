import { useContext } from 'react';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router';
import { NavContext } from '@ionic/react';
import HabitatIdentification from 'common/Components/HabitatIdentification';
import { Habitat } from 'common/data/ukhab';
import { Button, Header, Main, Page } from 'common/flumens';
import Location from 'models/location';
import useHeaderScroll from 'helpers/useHeaderScroll';
import HeaderButton from 'Survey/common/Components/HeaderButton';
import StarsBackground from 'Survey/common/Components/StarsBackground';
import { Data, habitatAttr } from './config';
import useLocation from './useLocation';

const LocationHabitat = () => {
  const { url } = useRouteMatch();
  const { navigate } = useContext(NavContext);

  const baseUrl = url.split('/').slice(0, -1).join('/');

  const { isScrolled, ...mainProps } = useHeaderScroll();

  const { location } = useLocation<Location<Data>>();
  if (!location) return null;

  const isValid = !!location.data[habitatAttr.id] && !!location.media.length;

  const selectHabitat = (suggestion: Habitat) => {
    location.data[habitatAttr.id] = suggestion.warehouseId;
  };

  const manualSelection = () => navigate(`${baseUrl}/${habitatAttr.id}`);

  const nextButton = (
    <HeaderButton
      onClick={() => isValid && navigate(baseUrl)}
      isInvalid={!isValid}
    >
      Next
    </HeaderButton>
  );

  return (
    <Page id="location-habitat" className="theme-habitat">
      <Header
        title="Habitat Type"
        rightSlot={nextButton}
        className={`stars-background-header ${isScrolled ? 'header-scrolled' : ''}`}
      />
      <Main {...mainProps} className="pb-ion-25">
        <StarsBackground>Capture photos of this habitat.</StarsBackground>

        <div className="-mt-4 mx-3">
          <HabitatIdentification location={location} onChange={selectHabitat} />
        </div>

        {!location.isDisabled && (
          <Button
            onClick={manualSelection}
            className="py-1 px-2 text-sm mx-auto mt-4"
          >
            Select from all habitats
          </Button>
        )}
      </Main>
    </Page>
  );
};

export default observer(LocationHabitat);
