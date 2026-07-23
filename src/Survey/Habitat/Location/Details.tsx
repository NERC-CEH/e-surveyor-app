import { observer } from 'mobx-react';
import { informationCircle } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import { IonIcon } from '@ionic/react';
import { Block, Header, Main, Page, Toggle } from 'common/flumens';
import Location from 'models/location';
import useHeaderScroll from 'helpers/useHeaderScroll';
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

  const { isScrolled, ...mainProps } = useHeaderScroll();

  const { location } = useLocation<Location<Data>>();
  if (!location) return null;

  const isValid = !!location.data[activitiesAttr.id];
  const showHectaresInput = location.data[siteSizeAttr.id] !== undefined;

  const recordAttrs = {
    record: location.data,
    isDisabled: location.isDisabled,
  };

  const onInputModeToggle = (isAreaMode: boolean) => {
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
      <Main {...mainProps} className="[--padding-bottom:100px]">
        <StarsBackground>
          Describe the site and recent management.
        </StarsBackground>

        <div className="list">
          <div className="card top">
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
                <div className="mb-2">
                  <Block block={siteSizeAttr} {...recordAttrs} platform="web" />
                </div>
              )}

              <Toggle
                isSelected={showHectaresInput}
                label="Enter area in hectares"
                onChange={onInputModeToggle}
                isDisabled={location.isDisabled}
                className="[&>div>div]:px-0"
              />

              <div className="opacity-70 text-sm mt-4">
                <IonIcon icon={informationCircle} className="-mb-0.5 mr-2" />
                An estimate will help us interpret your results accurately.
              </div>
            </div>
          </div>

          <div className="card">
            <h2>What's been happening here recently?</h2>
            <div className="opacity-70 text-sm">
              Tick all that apply in recent years (5 years).
            </div>
            <Block block={activitiesAttr} {...recordAttrs} platform="web" />
          </div>

          <Block block={locationCommentAttr} {...recordAttrs} platform="web" />
        </div>
      </Main>

      {(location.isDisabled || isValid) && (
        <Footer link={`${baseUrl}/habitat`} />
      )}
    </Page>
  );
};

export default observer(LocationDetails);
