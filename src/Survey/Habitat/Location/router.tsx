import type { ElementType } from 'react';
import { observer } from 'mobx-react';
import type { Polygon } from 'geojson';
import { Route } from 'react-router-dom';
import { AttrPage, type BlockT, type Location as GeoLocation } from '@flumens';
import ModelLocationMap, {
  getLocationAttrsFromLocation,
  getLocationAttrsFromShape,
  getLocationFromSref,
  getShapeFromGeom,
} from 'Survey/common/Components/ModelLocationMap';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import Details from './Details';
import Habitat from './Habitat';
import Location from './Location';
import Summary from './Summary';
import survey, { habitatAttr } from './config';
import useLocation from './useLocation';

const { baseURL } = survey;

const withLocationAndBlock = (Component: ElementType, block: BlockT) => {
  const WithLocationAndBlock = () => {
    const { location } = useLocation();
    if (!location) return null;

    return <Component record={location.data} block={block} />;
  };

  return WithLocationAndBlock;
};

const ModelLocationMapWrap = observer(() => {
  const { location: model } = useLocation();
  if (!model) return null;

  const useShape = model.data.boundaryGeom !== undefined;

  const setLocation = async (newLocation?: GeoLocation | Polygon) => {
    if (!newLocation) {
      if (useShape) {
        Object.assign(model.data, getLocationAttrsFromShape());
        return;
      }

      Object.assign(model.data, getLocationAttrsFromLocation());
      return;
    }
    if (model.isGPSRunning()) model.stopGPS();

    const newLocationAttributes =
      'type' in newLocation
        ? getLocationAttrsFromShape(newLocation)
        : getLocationAttrsFromLocation(newLocation);
    Object.assign(model.data, newLocationAttributes);
  };

  const location = getLocationFromSref(model.data.centroidSref);
  const shape = getShapeFromGeom(model?.data.boundaryGeom) as Polygon;

  return (
    <ModelLocationMap
      useShape={useShape}
      location={location}
      shape={shape}
      setLocation={setLocation}
      isLocating={model.isGPSRunning()}
      stopGPS={() => model.stopGPS()}
      startGPS={() =>
        model.startGPS(loc =>
          Object.assign(model.data, getLocationAttrsFromLocation(loc))
        )
      }
    />
  );
});

const routes = [
  [baseURL, StartNewSurvey.with(survey)],
  [`${baseURL}/:locId`, Summary],
  [
    `${baseURL}/:locId/${habitatAttr.id}`,
    withLocationAndBlock(AttrPage.BlockPage, habitatAttr),
  ],
  [`${baseURL}/:locId/location`, Location],
  [`${baseURL}/:locId/location/map`, ModelLocationMapWrap],
  [`${baseURL}/:locId/details`, Details],
  [`${baseURL}/:locId/habitat`, Habitat],
] as const;

export default routes.map(([route, component]) => (
  <Route key={route} path={route} component={component} exact />
));
