import { Route } from 'react-router-dom';
import { AttrPage, withSample } from '@flumens';
import ModelLocationMap from 'Survey/common/Components/ModelLocationMap';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import Home from './Home';
import Occurrence from './Occurrence';
import Report from './Report';
import survey from './config';

const { AttrPageFromRoute } = AttrPage;
const { baseURL } = survey;

const routes = [
  [baseURL, StartNewSurvey.with(survey)],
  [`${baseURL}/:smpId`, Home],
  [`${baseURL}/:smpId/:attr`, withSample(AttrPageFromRoute)],
  [`${baseURL}/:smpId/occurrence/:occId`, Occurrence],
  [`${baseURL}/:smpId/location`, ModelLocationMap.SampleFromRoute],
  [`${baseURL}/:smpId/report`, Report],
] as any[];

const mappedRoutes = routes.map(([route, component]) => (
  <Route key={route} exact path={route} component={component} />
));

export default mappedRoutes;
