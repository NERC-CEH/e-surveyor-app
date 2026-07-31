import { useContext } from 'react';
import { observer } from 'mobx-react';
import { locationOutline, mapOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import { IonIcon, NavContext } from '@ionic/react';
import {
  Block,
  Button,
  device,
  Header,
  InfoMessage,
  Main,
  Page,
  RadioInput,
} from 'common/flumens';
import Location from 'models/location';
import useHeaderScroll from 'helpers/useHeaderScroll';
import HeaderButton from 'Survey/common/Components/HeaderButton';
import {
  getLocationAttrsFromLocation,
  getLocationFromSref,
  getShapeFromGeom,
} from 'Survey/common/Components/ModelLocationMap';
import StarsBackground from 'Survey/common/Components/StarsBackground';
import GeometryLink from '../common/GeometryLink';
import { Data, siteNameAttr } from './config';
import useLocation from './useLocation';

const LocationLocation = () => {
  const { url } = useRouteMatch();
  const baseUrl = url.split('/').slice(0, -1).join('/');
  const { navigate } = useContext(NavContext);

  const { isScrolled, ...mainProps } = useHeaderScroll();
  const { location } = useLocation<Location<Data>>();
  if (!location) return null;

  const isValid =
    location.isDisabled ||
    (!!location.data.name && !!location.data.centroidSref);

  const recordAttrs = {
    record: location.data,
    isDisabled: location.isDisabled,
  };

  const currentLocation = getLocationFromSref(location.data.centroidSref);
  const currentShape = getShapeFromGeom(location?.data.boundaryGeom);

  const locate = () => {
    location.startGPS(loc => {
      Object.assign(location.data, getLocationAttrsFromLocation(loc));
    });
  };

  const nextButton = (
    <HeaderButton
      onClick={() => isValid && navigate(`${baseUrl}/details`)}
      isInvalid={!isValid}
    >
      Next
    </HeaderButton>
  );

  return (
    <Page id="location-location" className="theme-habitat">
      <Header
        title="Location"
        rightSlot={nextButton}
        className={`stars-background-header ${isScrolled ? 'header-scrolled' : ''}`}
      />
      <Main {...mainProps} className="pb-ion-25">
        <StarsBackground>Set up this survey location.</StarsBackground>

        <div className="list">
          <div className="card top">
            <Block block={siteNameAttr} {...recordAttrs} platform="web" />
          </div>

          <div className="card">
            <RadioInput
              platform="web"
              label="How would you like to record this location?"
              value={
                location.data.boundaryGeom !== undefined ? 'boundary' : 'pin'
              }
              onChange={val => {
                if (val === 'pin') {
                  Object.assign(location.data, getLocationAttrsFromLocation());
                  location.startGPS(loc => {
                    Object.assign(
                      location.data,
                      getLocationAttrsFromLocation(loc)
                    );
                  });
                } else {
                  Object.assign(location.data, getLocationAttrsFromLocation());
                  location.data.boundaryGeom = ''; // Set to empty string to indicate that the user wants to draw a boundary
                }
              }}
              isDisabled={location.isDisabled}
            >
              <RadioInput.Option
                value="boundary"
                label="Map habitat boundary"
                prefix={<IonIcon icon={mapOutline} className="size-6" />}
              />
              <div className="text-neutral-600">
                Draw the outline of the habitat on the map.
              </div>
              <RadioInput.Option
                value="pin"
                label="Drop a pin"
                prefix={<IonIcon icon={locationOutline} className="size-6" />}
              />
              <div className="text-neutral-600">
                Mark a single point within the habitat.
              </div>
            </RadioInput>

            {device.isOnline && (
              <GeometryLink
                link={`${url}/map`}
                location={currentLocation}
                shape={currentShape}
                className="mt-4 rounded-lg overflow-hidden"
                isDisabled={location.isDisabled}
              />
            )}

            {!device.isOnline && (
              <InfoMessage className="my-5">
                You are offline. You can use the GPS to locate your current
                location. My current location:
                <div className="my-2 font-semibold">
                  {location.data.centroidSref || 'Location missing'}
                </div>
                <Button onPress={locate}>Locate me</Button>
              </InfoMessage>
            )}
          </div>
        </div>
      </Main>
    </Page>
  );
};

export default observer(LocationLocation);
