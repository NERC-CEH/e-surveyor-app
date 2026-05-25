import { RouteWithModels, AttrPage } from '@flumens';
import samples from 'models/collections/samples';
import ModelLocationMap from 'Survey/common/Components/ModelLocationMap';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import Home from './Home';
import Occurrence from './Occurrence';
import Report from './Report';
import survey from './config';

const { AttrPageFromRoute } = AttrPage;
const { baseURL } = survey;

const routes = [
  [baseURL, StartNewSurvey.with(survey), true],
  [`${baseURL}/:smpId`, Home],
  [`${baseURL}/:smpId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/occurrence/:occId`, Occurrence],
  [`${baseURL}/:smpId/location`, ModelLocationMap],
  [`${baseURL}/:smpId/report`, Report],
];

export default RouteWithModels.fromArray(samples as any, routes);
