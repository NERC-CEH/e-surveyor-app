import { useState } from 'react';
import { observer } from 'mobx-react';
import { locationOutline, mapOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import { IonIcon } from '@ionic/react';
import { Block, device, Header, Main, Page, RadioInput } from 'common/flumens';
import Location from 'models/location';
import Footer from 'Survey/Habitat/common/Footer';
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

  const [isScrolled, setIsScrolled] = useState(false);

  const { location } = useLocation<Location<Data>>();
  if (!location) return null;

  const isValueValid = !!location.data.name && !!location.data.centroidSref;

  const recordAttrs = {
    record: location.data,
    isDisabled: location.isDisabled,
  };

  const currentLocation = getLocationFromSref(location.data.centroidSref);
  const currentShape = getShapeFromGeom(location?.data.boundaryGeom);

  return (
    <Page id="location-location" className="theme-habitat">
      <Header
        title="Location"
        className={`stars-background-header ${isScrolled ? 'header-scrolled' : ''}`}
      />
      <Main
        fullscreen
        scrollEvents
        onIonScroll={e => setIsScrolled(e.detail.scrollTop > 70)}
        className="[--padding-bottom:100px]"
      >
        <StarsBackground>Set up this survey location.</StarsBackground>

        <div className="mx-3">
          <div className="bg-white rounded-lg p-4 shadow-xl -mt-4">
            <Block block={siteNameAttr} {...recordAttrs} platform="web" />
          </div>

          <div className="bg-white rounded-lg p-4 shadow-xl mt-4">
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
              />
            )}

            {!device.isOnline && <div>You are offline.</div>}
          </div>
        </div>
      </Main>

      {isValueValid && <Footer link={`${baseUrl}/details`} />}
    </Page>
  );
};

export default observer(LocationLocation);
