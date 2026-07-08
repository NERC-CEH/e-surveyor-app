import { Route } from 'react-router-dom';
import { AttrPage } from '@flumens';
import ModelLocationMap from 'Survey/common/Components/ModelLocationMap';
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

const routes = [
  [baseURL, StartNewSurvey.with(survey as any), true],
  [`${baseURL}/:locId`, Summary],
  [
    `${baseURL}/:locId/${habitatAttr.id}`,
    withLocationAndBlock(AttrPage.BlockPage, habitatAttr),
  ],
  [`${baseURL}/:locId/location`, Location],
  [`${baseURL}/:locId/location/map`, ModelLocationMap],
  [`${baseURL}/:locId/details`, Details],
  [`${baseURL}/:locId/habitat`, Habitat],
].map(([route, component]: any) => (
  <Route key={route} path={route} component={component} exact />
));

export default routes;
