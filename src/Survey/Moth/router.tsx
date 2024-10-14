import { RouteWithModels, AttrPage } from '@flumens';
import samples from 'models/samples';
import ModelLocationMap from 'Survey/common/Components/ModelLocationMap';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import Home from './Home';
import Report from './Report';
import survey from './config';

const { AttrPageFromRoute } = AttrPage;
const baseURL = `/survey/${survey.name}`;

const routes = [
  [`${baseURL}`, StartNewSurvey.with(survey), true],
  [`${baseURL}/:smpId`, Home],
  [`${baseURL}/:smpId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/location`, ModelLocationMap],
  [`${baseURL}/:smpId/report`, Report],
];

export default RouteWithModels.fromArray(samples, routes);
