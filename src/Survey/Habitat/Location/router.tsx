import { observer } from 'mobx-react';
import { Polygon } from 'geojson';
import { Route } from 'react-router-dom';
import { AttrPage, updateModelLocation } from '@flumens';
import LocationModel from 'common/models/location';
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

const withLocationAndBlock = (Component: any, block: any) => {
  const WithLocationAndBlock = () => {
    const { location } = useLocation();
    if (!location) return null;

    return <Component record={location.data} block={block} />;
  };

  return WithLocationAndBlock;
};

const ModelLocationMapWrap = observer(() => {
  const { location: model } = useLocation<LocationModel>();
  if (!model) return null;

  const useShape = model.data.boundaryGeom !== undefined;

  const setLocation = async (newLocation: any) => {
    if (!newLocation) {
      if (useShape) {
        Object.assign(model.data, getLocationAttrsFromShape());
        return;
      }

      Object.assign(model.data, getLocationAttrsFromLocation());
      return;
    }
    if ('isGPSRunning' in model && model.isGPSRunning()) model.stopGPS();

    const newLocationAttributes = useShape
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
      startGPS={() => model.startGPS(loc => updateModelLocation(model, loc))}
    />
  );
});

const routes = [
  [baseURL, StartNewSurvey.with(survey as any), true],
  [`${baseURL}/:locId`, Summary],
  [
    `${baseURL}/:locId/${habitatAttr.id}`,
    withLocationAndBlock(AttrPage.BlockPage, habitatAttr),
  ],
  [`${baseURL}/:locId/location`, Location],
  [`${baseURL}/:locId/location/map`, ModelLocationMapWrap],
  [`${baseURL}/:locId/details`, Details],
  [`${baseURL}/:locId/habitat`, Habitat],
].map(([route, component]: any) => (
  <Route key={route} path={route} component={component} exact />
));

export default routes;
