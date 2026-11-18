import { Route } from 'react-router-dom';
import { AttrPage, withSample } from '@flumens';
import ModelLocationMap from 'Survey/common/Components/ModelLocationMap';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import Home from './Home';
import Occurrence from './Occurrence';
import Report from './Report';
import Videos from './Videos';
import survey from './config';

const { AttrPageFromRoute } = AttrPage;
export const { baseURL } = survey;

const routes = [
  [baseURL, StartNewSurvey.with(survey)],
  [`${baseURL}/:smpId`, Home],
  [`${baseURL}/:smpId/:attr`, withSample(AttrPageFromRoute)],
  [`${baseURL}/:smpId/occurrence/:occId`, Occurrence],
  [`${baseURL}/:smpId/location`, ModelLocationMap.SampleFromRoute],
  [`${baseURL}/:smpId/report`, Report],
  // Ionic uses the last match, so this must follow the :smpId route.
  [`${baseURL}/videos`, Videos],
] as const;

export default routes.map(([route, component]) => (
  <Route key={route} exact path={route} component={component} />
));
