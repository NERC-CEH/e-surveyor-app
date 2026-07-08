import { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router';
import { NavContext } from '@ionic/react';
import HabitatIdentification from 'common/Components/HabitatIdentification';
import { Habitat } from 'common/data/ukhab';
import { Button, Header, Main, Page } from 'common/flumens';
import Location from 'models/location';
import Footer from 'Survey/Habitat/common/Footer';
import StarsBackground from 'Survey/common/Components/StarsBackground';
import { Data, habitatAttr } from './config';
import useLocation from './useLocation';

const LocationHabitat = () => {
  const { url } = useRouteMatch();
  const { navigate } = useContext(NavContext);

  const baseUrl = url.split('/').slice(0, -1).join('/');

  const [isScrolled, setIsScrolled] = useState(false);

  const { location } = useLocation<Location<Data>>();
  if (!location) return null;

  const hasSuggestions = !!location.metadata.habitatSuggestions?.length;

  const selectHabitat = (suggestion: Habitat) => {
    location.data[habitatAttr.id] = suggestion.id;
  };

  const manualSelection = () => {
    navigate(`${baseUrl}/${habitatAttr.id}`);
  };

  return (
    <Page id="location-habitat" className="theme-habitat">
      <Header
        title="Habitat Type"
        className={`stars-background-header ${isScrolled ? 'header-scrolled' : ''}`}
      />
      <Main
        fullscreen
        scrollEvents
        onIonScroll={e => setIsScrolled(e.detail.scrollTop > 70)}
        className="[--padding-bottom:100px]"
      >
        <StarsBackground>Capture photos of this habitat.</StarsBackground>

        <div className="-mt-4 mx-3">
          <HabitatIdentification location={location} onChange={selectHabitat} />
        </div>

        <Button
          onClick={manualSelection}
          className="py-1 px-2 text-sm mx-auto mt-4"
        >
          Select from all habitats
        </Button>
      </Main>

      {hasSuggestions && <Footer link={baseUrl} />}
    </Page>
  );
};

export default observer(LocationHabitat);
