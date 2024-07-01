import { RouteWithModels, AttrPage } from '@flumens';
import savedSamples from 'models/savedSamples';
import ModelLocationMap from 'Survey/common/Components/ModelLocationMap';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import Home from './Home';
import Management from './Management';
import Report from './Report';
import SOM from './SOM';
import VSA from './VSA';
import Worm from './Worm';
import Worms from './Worms';
import survey from './config';

const { AttrPageFromRoute } = AttrPage;
const baseURL = `/survey/${survey.name}`;

const routes = [
  [`${baseURL}`, StartNewSurvey.with(survey), true],
  [`${baseURL}/:smpId`, Home],
  [`${baseURL}/:smpId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/location`, ModelLocationMap],
  [`${baseURL}/:smpId/report`, Report],
  [`${baseURL}/:smpId/management`, Management],
  [`${baseURL}/:smpId/management/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/vsa/:subSmpId`, VSA],
  [`${baseURL}/:smpId/vsa/:subSmpId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/vsa/:subSmpId/location`, ModelLocationMap],
  [`${baseURL}/:smpId/worms`, Worms],
  [`${baseURL}/:smpId/worms/:subSmpId`, Worm],
  [`${baseURL}/:smpId/worms/:subSmpId/location`, ModelLocationMap],
  [`${baseURL}/:smpId/som`, SOM],
];

export default RouteWithModels.fromArray(savedSamples, routes);
