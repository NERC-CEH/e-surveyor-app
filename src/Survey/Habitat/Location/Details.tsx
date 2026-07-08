import { useState } from 'react';
import { observer } from 'mobx-react';
import { informationCircle } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import { IonIcon, IonToggle } from '@ionic/react';
import { Block, Header, Main, Page } from 'common/flumens';
import Location from 'models/location';
import Footer from 'Survey/Habitat/common/Footer';
import StarsBackground from 'Survey/common/Components/StarsBackground';
import {
  activitiesAttr,
  Data,
  locationCommentAttr,
  siteLengthAttr,
  siteSizeAttr,
  siteWidthAttr,
} from './config';
import useLocation from './useLocation';

const LocationDetails = () => {
  const { url } = useRouteMatch();
  const baseUrl = url.split('/').slice(0, -1).join('/');

  const [isScrolled, setIsScrolled] = useState(false);

  const { location } = useLocation<Location<Data>>();
  if (!location) return null;

  const isValueValid = !!location.data[activitiesAttr.id];
  const showHectaresInput = location.data[siteSizeAttr.id] !== undefined;

  const recordAttrs = {
    record: location.data,
    isDisabled: location.isDisabled,
  };

  const onInputModeToggle = (event: CustomEvent<{ checked: boolean }>) => {
    const isAreaMode = event.detail.checked;
    delete location.data[siteLengthAttr.id];
    delete location.data[siteWidthAttr.id];

    if (isAreaMode) {
      location.data[siteSizeAttr.id] = 0;
    } else {
      delete location.data[siteSizeAttr.id];
    }
  };

  return (
    <Page id="location-details" className="theme-habitat">
      <Header
        title="Site Details"
        className={`stars-background-header ${isScrolled ? 'header-scrolled' : ''}`}
      />
      <Main
        fullscreen
        scrollEvents
        onIonScroll={e => setIsScrolled(e.detail.scrollTop > 70)}
        className="[--padding-bottom:100px]"
      >
        <StarsBackground>
          Describe the site and recent management.
        </StarsBackground>

        <div className="mx-3 flex flex-col gap-5">
          <div className="bg-white rounded-lg p-4 shadow-xl -mt-4">
            <h2>Approximate habitat size</h2>

            <div className="">
              {!showHectaresInput && (
                <div className="grid grid-cols-2 gap-2 w-full mb-2">
                  <Block
                    block={siteLengthAttr}
                    {...recordAttrs}
                    platform="web"
                  />
                  <Block
                    block={siteWidthAttr}
                    {...recordAttrs}
                    platform="web"
                  />
                </div>
              )}

              {showHectaresInput && (
                <Block block={siteSizeAttr} {...recordAttrs} platform="web" />
              )}

              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm">Enter area in hectares</div>
                <IonToggle
                  checked={showHectaresInput}
                  disabled={location.isDisabled}
                  onIonChange={onInputModeToggle}
                />
              </div>

              <div className="opacity-70 text-sm mt-4">
                <IonIcon icon={informationCircle} className="-mb-0.5 mr-2" />
                An estimate will help us interpret your results accurately.
              </div>
            </div>
          </div>

          <div>
            <h2>What's been happening here recently?</h2>
            <div className="opacity-70 text-sm">
              Tick all that apply in recent years (5 years).
            </div>
            <Block block={activitiesAttr} {...recordAttrs} platform="web" />
          </div>

          <Block block={locationCommentAttr} {...recordAttrs} platform="web" />
        </div>
      </Main>

      {isValueValid && <Footer link={`${baseUrl}/habitat`} />}
    </Page>
  );
};

export default observer(LocationDetails);
